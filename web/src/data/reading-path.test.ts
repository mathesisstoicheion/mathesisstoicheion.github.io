import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PATH, partText, firstMet, newWords } from "./reading-path";
import { indexCatalog, greekEditions, translations, rawUrl, type Catalog, type CatText } from "@/lib/catalog";
import { parseTei } from "@/lib/tei/parse";
import { findRef } from "@/lib/tei/refs";
import { analyse, norm, type WordPack } from "@/lib/lookup/words";
import { ENTRIES } from "@/wiki";

const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);
const places = new Set((JSON.parse(readFileSync("public/data/map/places.json", "utf8")).places as { id: string }[]).map((p) => p.id));
const squash = (s: string) => norm(s).replace(/\s+/g, " ").trim();
const CORPUS = "../pipeline/.cache/corpus";
const PACKS = "../pipeline/.cache/packs";
const text = async (t: CatText) => {
  const f = join(CORPUS, t.col, t.path);
  return existsSync(f) ? readFileSync(f, "utf8") : (await fetch(rawUrl(idx, t))).text();
};
const unitText = (doc: ReturnType<typeof parseTei>, ref: string) => {
  const u = doc.units[findRef(doc, ref)];
  return u.blocks.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" ");
};

describe("the reading path", () => {
  it("has twelve steps with unique ids, every word explained", () => {
    expect(PATH).toHaveLength(12);
    expect(new Set(PATH.map((s) => s.id)).size).toBe(PATH.length);
    for (const s of PATH) {
      expect(idx.work.get(s.work), s.id).toBeTruthy();
      for (const p of s.parts) {
        expect(p.en.trim(), s.id).not.toBe("");
        for (const w of p.words) for (const k of ["form", "lemma", "here", "dict", "form_note"] as const) expect(w[k].trim(), `${s.id} ${w.form} ${k}`).not.toBe("");
      }
    }
  });

  it("links only to pages that exist", () => {
    const authors = new Set(idx.catalog.authors.map((a) => a.id));
    const slugs = new Set(ENTRIES.map((e) => e.slug));
    for (const s of PATH) for (const l of s.links) {
      const [path, q] = l.href.split("?");
      const params = new URLSearchParams(q);
      if (path === "/stoa/periplus") expect(places.has(params.get("p")!), `${s.id}: ${l.href}`).toBe(true);
      else if (path === "/read") expect(idx.work.get(params.get("w")!), `${s.id}: ${l.href}`).toBeTruthy();
      else if (path.startsWith("/author/")) expect(authors.has(path.slice(8)), `${s.id}: ${l.href}`).toBe(true);
      else if (path.startsWith("/stoa/")) expect(slugs.has(path.slice(6)), `${s.id}: ${l.href}`).toBe(true);
      else throw new Error(`unchecked link ${l.href}`);
    }
  });

  // the rules agreed with Noa: at most four new words and eight words a step, and a word's "kin" really met before
  it("keeps to the beginners' rules", () => {
    PATH.forEach((s, i) => {
      expect(newWords(i).length, `${s.id}: ${newWords(i).join(", ")}`).toBeLessThanOrEqual(4);
      expect(s.parts.flatMap((p) => p.words).length, s.id).toBeLessThanOrEqual(8);
      for (const w of s.parts.flatMap((p) => p.words)) if (w.kin) expect(firstMet(w.kin, i), `${s.id}: ${w.form}`).toBeTruthy();
    });
  });

  it("builds on itself: the last step is mostly words met before", () => {
    const last = PATH.length - 1;
    const words = PATH[last].parts.flatMap((p) => p.words);
    expect(words.filter((w) => firstMet(w.lemma, last)).length).toBe(words.length - 1);
  });

  // The Greek and English are checked against the source files: the local corpus when it is there
  // (python pipeline/fetch_corpus.py), else GitHub; run with NETWORK=1 or with the corpus downloaded.
  it.skipIf(!process.env.NETWORK && !existsSync(CORPUS))("copies every line from the library's texts", async () => {
    for (const s of PATH) {
      const w = idx.work.get(s.work)!;
      const ed = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
      const tr = translations(w)[0];
      const doc = parseTei(await text(ed));
      expect(findRef(doc, s.ref), `${s.id}: ${s.ref}`).toBeGreaterThanOrEqual(0);
      const greek = squash(unitText(doc, s.ref));
      expect(greek, s.id).toContain(squash(s.parts.map(partText).join(" ")));
      const en = squash(parseTei(await text(tr)).units.flatMap((u) => u.blocks).map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" "));
      for (const p of s.parts) expect(en, `${s.id}: ${p.en}`).toContain(squash(p.en));
    }
  }, 180_000);

  // Dictionary forms as GLAUx analyses them at this place (packs cached by scripts/path-words.ts).
  it.skipIf(!existsSync(CORPUS) || !existsSync(join(PACKS, "words")))("gives GLAUx's dictionary form for each word", async () => {
    for (const s of PATH) {
      const f = join(PACKS, "words", `${s.work}.json`);
      if (!existsSync(f)) continue;
      const pack = JSON.parse(readFileSync(f, "utf8")) as WordPack;
      const w = idx.work.get(s.work)!;
      const ed = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
      const doc = parseTei(await text(ed));
      const key = doc.units[findRef(doc, s.ref)].ref.join(".");
      const keys = new Set(doc.units.map((u) => u.ref.join(".")));
      const unit = norm(unitText(doc, s.ref));
      const before: string[] = (unit.slice(0, unit.indexOf(norm(s.parts.map(partText).join(" ")))).match(/[\p{L}\p{M}ʼ]+/gu) ?? []);
      for (const word of s.parts.flatMap((p) => p.words)) {
        const occ = before.filter((b) => b === norm(word.form)).length;
        before.push(norm(word.form));
        const a = analyse(pack, word.form, key, occ, keys, doc.levels.length);
        if (a) expect(a.lemma, `${s.id}: ${word.form}`).toBe(word.lemma);
      }
    }
  }, 180_000);
});
