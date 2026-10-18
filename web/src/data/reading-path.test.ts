import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PATH, PRACTICE, partText, type PathPart, type PathStep } from "./reading-path";
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

/** each passage sentence as one line: all its pieces' words, with the sentence's English */
const passageLines = (s: PathStep): PathPart[] => (s.passage?.sentences ?? []).map((st) => ({ words: st.pieces.flatMap((p) => p.words), en: st.en }));

/** where each step's lines are: the line itself, and its passage (in another work or section if it names one) */
const placesOf = (s: PathStep) => {
  const out = [{ work: s.work, ref: s.ref, lines: s.parts }];
  const ss = s.passage?.sentences ?? [];
  const refs = [...new Set(ss.map((st) => st.ref ?? s.passage!.ref ?? s.ref))];
  for (const ref of refs) out.push({ work: s.passage!.work ?? s.work, ref, lines: passageLines(s).filter((_, i) => (ss[i].ref ?? s.passage!.ref ?? s.ref) === ref) });
  return out;
};

/** every place checked against the library: each lesson's line and passage, and each practice line */
const ALL = [
  ...PATH.flatMap((s) => placesOf(s).map((pl) => ({ id: s.id, ...pl }))),
  ...PRACTICE.flatMap((p) => p.lines.map((l) => ({ id: p.id, work: l.work, ref: l.ref, lines: [{ words: l.pieces.flatMap((q) => q.words), en: l.en }] }))),
];

describe("the reading path", () => {
  it("has twelve steps with unique ids, every word explained", () => {
    expect(PATH).toHaveLength(12);
    expect(new Set(PATH.map((s) => s.id)).size).toBe(PATH.length);
    for (const s of PATH) {
      expect(idx.work.get(s.work), s.id).toBeTruthy();
      expect(s.meaning.length, s.id).toBeGreaterThan(0);
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

  // the rules agreed with Noa: at most eight words a line or passage piece, and every piece has its grammar
  it("has a practice lesson after every third lesson, with two or three lines", () => {
    expect(PRACTICE.map((p) => PATH.findIndex((s) => s.id === p.after))).toEqual([2, 5, 8, 11]);
    for (const p of PRACTICE) {
      expect(p.lines.length, p.id).toBeGreaterThanOrEqual(2);
      expect(p.lines.length, p.id).toBeLessThanOrEqual(3);
      for (const l of p.lines) {
        for (const k of ["work", "ref", "label", "translator", "who", "en"] as const) expect(l[k].trim(), `${p.id} ${k}`).not.toBe("");
        expect(l.meaning.length, p.id).toBeGreaterThan(0);
        for (const q of l.pieces) {
          expect(q.words.length, p.id).toBeLessThanOrEqual(8);
          if (q.learn.at !== undefined) expect(q.learn.at, p.id).toBeLessThan(q.words.length);
          for (const w of q.words) for (const k of ["form", "lemma", "here", "dict", "form_note"] as const) expect(w[k].trim(), `${p.id} ${w.form} ${k}`).not.toBe("");
        }
      }
    }
  });

  // Noa (2026-10-18): the passages grow as the path goes on
  it("gives the later lessons longer passages", () => {
    const pieces = PATH.map((s) => (s.passage?.sentences ?? []).reduce((n, st) => n + st.pieces.length, 0));
    for (let i = 3; i < 6; i++) expect(pieces[i], PATH[i].id).toBeGreaterThanOrEqual(6);
    for (let i = 6; i < 9; i++) expect(pieces[i], PATH[i].id).toBeGreaterThanOrEqual(9);
    for (let i = 9; i < 12; i++) expect(pieces[i], PATH[i].id).toBeGreaterThanOrEqual(12);
  });

  it("keeps every line and passage piece to eight words", () => {
    for (const s of PATH) {
      expect(s.parts.flatMap((p) => p.words).length, s.id).toBeLessThanOrEqual(8);
      for (const st of s.passage?.sentences ?? []) {
        expect(st.en.trim(), s.id).not.toBe("");
        expect(st.meaning.length, s.id).toBeGreaterThan(0);
        for (const p of st.pieces) {
          expect(p.words.length, `${s.id}: ${partText({ ...p, en: "" })}`).toBeLessThanOrEqual(8);
          expect(p.learn.text.length, s.id).toBeGreaterThan(0);
          if (p.learn.at !== undefined) expect(p.learn.at, s.id).toBeLessThan(p.words.length);
          for (const w of p.words) for (const k of ["form", "lemma", "here", "dict", "form_note"] as const) expect(w[k].trim(), `${s.id} ${w.form} ${k}`).not.toBe("");
        }
      }
    }
  });

  // The Greek and English are checked against the source files: the local corpus when it is there
  // (python pipeline/fetch_corpus.py), else GitHub; run with NETWORK=1 or with the corpus downloaded.
  it.skipIf(!process.env.NETWORK && !existsSync(CORPUS))("copies every line from the library's texts", async () => {
    for (const pl of ALL) { const s = pl;
      const w = idx.work.get(pl.work)!;
      expect(w, `${s.id}: ${pl.work}`).toBeTruthy();
      const ed = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
      const doc = parseTei(await text(ed));
      expect(findRef(doc, pl.ref), `${s.id}: ${pl.ref}`).toBeGreaterThanOrEqual(0);
      const greek = squash(unitText(doc, pl.ref));
      const en = squash(parseTei(await text(translations(w)[0])).units.flatMap((u) => u.blocks).map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" "));
      for (const line of pl.lines) {
        expect(greek, `${s.id}: ${pl.ref}`).toContain(squash(partText(line)));
        expect(en, `${s.id}: ${line.en}`).toContain(squash(line.en));
      }
    }
  }, 300_000);

  // Dictionary forms as GLAUx analyses them at this place (packs cached by scripts/path-words.ts).
  it.skipIf(!existsSync(CORPUS) || !existsSync(join(PACKS, "words")))("gives GLAUx's dictionary form for each word", async () => {
    for (const pl of ALL) { const s = pl;
      const f = join(PACKS, "words", `${pl.work}.json`);
      if (!existsSync(f)) continue;
      const pack = JSON.parse(readFileSync(f, "utf8")) as WordPack;
      const w = idx.work.get(pl.work)!;
      const ed = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
      const doc = parseTei(await text(ed));
      const key = doc.units[findRef(doc, pl.ref)].ref.join(".");
      const keys = new Set(doc.units.map((u) => u.ref.join(".")));
      const unit = norm(unitText(doc, pl.ref));
      for (const line of pl.lines) {
        const before: string[] = (unit.slice(0, unit.indexOf(norm(partText(line)))).match(/[\p{L}\p{M}ʼ]+/gu) ?? []);
        for (const word of line.words) {
          const occ = before.filter((b) => b === norm(word.form)).length;
          before.push(norm(word.form));
          const a = analyse(pack, word.form, key, occ, keys, doc.levels.length);
          if (a) expect(a.lemma, `${s.id}: ${word.form}`).toBe(word.glaux ?? word.lemma);
        }
      }
    }
  }, 300_000);
});
