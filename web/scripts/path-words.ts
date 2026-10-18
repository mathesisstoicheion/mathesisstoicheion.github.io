/**
 * For the reading path (src/data/reading-path.ts): print each word of a quotation with its GLAUx analysis at that
 * place, its DCC core definition and LSJ's first summary, so the path's glosses can be written and checked from
 * the site's own data. Packs are read from pipeline/.cache/packs (downloaded from the packs site when missing).
 *
 *   npx tsx scripts/path-words.ts <work> <ref> "<quotation>"
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { indexCatalog, greekEditions, fold, type Catalog } from "../src/lib/catalog";
import { parseTei } from "../src/lib/tei/parse";
import { findRef } from "../src/lib/tei/refs";
import { analyse, norm, type WordPack } from "../src/lib/lookup/words";
import { readTag } from "../src/lib/lookup/postag";
import { shardOf, type LsjEntry } from "../src/lib/lookup/lsj";

const CACHE = "../pipeline/.cache";
const RAW = "https://raw.githubusercontent.com/mathesisstoicheion/packs/main";
async function pack(path: string) {
  const f = join(CACHE, "packs", path);
  if (!existsSync(f)) {
    const r = await fetch(`${RAW}/${encodeURI(path)}`);
    if (!r.ok) return null;
    mkdirSync(dirname(f), { recursive: true });
    writeFileSync(f, await r.text());
  }
  return JSON.parse(readFileSync(f, "utf8"));
}

async function main() {
const [work, ref, quote] = process.argv.slice(2);
const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);
const w = idx.work.get(work)!;
const ed = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
const doc = parseTei(readFileSync(join(CACHE, "corpus", ed.col, ed.path), "utf8"));
const u = doc.units[findRef(doc, ref)];
const key = u.ref.join(".");
const text = u.blocks.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" ").replace(/\s+/g, " ");
const at = norm(text).indexOf(norm(quote));
if (at < 0) throw new Error(`quotation not found in ${work} ${key}`);
const words = (s: string): string[] => norm(s).match(/[\p{L}\p{M}ʼ]+/gu) ?? [];
const before = words(norm(text).slice(0, at));
const wp = (await pack(`words/${work}.json`)) as WordPack | null;
const core = JSON.parse(readFileSync("public/data/core.json", "utf8")).words as Record<string, { def: string }[]>;
const keys = new Set(doc.units.map((x) => x.ref.join(".")));
console.log(`${work} ${key} (${ed.urn})${wp ? "" : " — no word pack"}`);
for (const form of words(quote)) {
  const occ = before.filter((b) => b === form).length;
  before.push(form);
  const a = wp ? analyse(wp, form, key, occ, keys, doc.levels.length) : null;
  const lemma = a?.lemma ?? "?";
  const lsj = (await pack(`lsj/${shardOf(lemma)}.json`)) as Record<string, LsjEntry[]> | null;
  const entry = lsj?.[lemma] ?? Object.entries(lsj ?? {}).find(([k]) => fold(k) === fold(lemma))?.[1];
  const coreDef = core[lemma]?.[0]?.def ?? "";
  const p = a ? readTag(a.tag) : null;
  console.log(`  ${form}\t${lemma}\t${a?.tag ?? ""} ${p ? `${p.pos}: ${p.detail}` : ""}${a ? ` [${a.where}${a.manual ? ", checked" : ""}]` : ""}`);
  if (coreDef) console.log(`      DCC: ${coreDef}`);
  if (entry) console.log(`      LSJ: ${entry[0].s.slice(0, 160)}`);
}
}
main();
