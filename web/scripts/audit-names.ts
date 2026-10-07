/**
 * Content check of the translations: are the English passages beside the right Greek? Proper names are the
 * one thing a translation keeps, so for every row the reader would show, the names in the Greek (capitalised
 * words, transliterated and reduced to their first consonants) are looked for in the English of the same row,
 * of the row before and of the row after. A translation whose names turn up more often one row early or late
 * than in their own row is out of step with the Greek, whatever its passage numbers say.
 *
 *   npx tsx scripts/audit-names.ts            writes pipeline/.cache/translation-names.json
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { indexCatalog, greekEditions, translations, type Catalog, type CatText } from "../src/lib/catalog";
import { parseTei } from "../src/lib/tei/parse";
import { translationPieces, placePieces, alignChunk } from "../src/lib/tei/align";
import { renumber, schemeFor } from "../src/lib/tei/versification";
import type { Block, Unit } from "../src/lib/tei/types";

const CORPUS = "../pipeline/.cache/corpus";
const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);
const load = (t: CatText) => { const f = join(CORPUS, t.col, t.path); try { return existsSync(f) ? parseTei(readFileSync(f, "utf8")) : null; } catch { return null; } };
const text = (bs: Block[]) => bs.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" ");

const GR: Record<string, string> = { α: "a", β: "b", γ: "g", δ: "d", ε: "e", ζ: "z", η: "e", θ: "th", ι: "i", κ: "k", λ: "l", μ: "m", ν: "n", ξ: "x", ο: "o", π: "p", ρ: "r", σ: "s", ς: "s", ϲ: "s", τ: "t", υ: "u", φ: "ph", χ: "ch", ψ: "ps", ω: "o" };
/** a name's skeleton: its first three consonants, after evening out the usual Greek–English spellings */
const skeleton = (latin: string) => {
  const s = latin.toLowerCase().replace(/ph/g, "f").replace(/th/g, "t").replace(/ch|kh/g, "k").replace(/c/g, "k").replace(/rh/g, "r").replace(/[^a-z]/g, "");
  const cons = s.replace(/[aeiouy]/g, "").replace(/(.)\1+/g, "$1");
  return cons.length >= 3 ? cons.slice(0, 3) : "";
};
const greekNames = (s: string) => {
  const out = new Set<string>();
  for (const w of s.normalize("NFD").replace(/\p{M}/gu, "").match(/\p{Lu}\p{Ll}{3,}/gu) ?? []) {
    const k = skeleton([...w.toLowerCase()].map((c) => GR[c] ?? "").join(""));
    if (k) out.add(k);
  }
  return out;
};
const COMMON = new Set(["the", "and", "but", "for", "this", "that", "when", "then", "they", "what", "with", "from", "there", "these", "those", "once", "after", "while", "even", "here", "now", "yet", "god", "gods", "lord", "king", "chapter", "book", "section"]);
const englishNames = (s: string) => {
  const out = new Set<string>();
  for (const w of s.match(/(?<![.!?:;“"‘]\s)(?<!^)\b[A-Z][a-z]{3,}/g) ?? []) {
    if (COMMON.has(w.toLowerCase())) continue;
    const k = skeleton(w);
    if (k) out.add(k);
  }
  return out;
};

interface Entry { work: string; title: string; eng: string; rows: number; same: number; before: number; after: number; verdict: string }
const out: Entry[] = [];
for (const a of idx.catalog.authors) for (const w of a.works) {
  const eds = greekEditions(w), trs = translations(w).filter((t) => t.lang === "eng");
  if (!eds.length || !trs.length) continue;
  const ed = eds.find((t) => t.col === "perseus") ?? eds[0];
  const g = load(ed);
  if (!g) continue;
  for (const tr of trs) {
    const e0 = load(tr);
    if (!e0) continue;
    const sc = schemeFor(w.id, tr);
    const e = sc ? renumber(sc, g, e0, tr.urn) : e0;
    const placed = placePieces(g, translationPieces(g, e));
    const rows = g.chunks.flatMap((c) => alignChunk(g, c, placed)).filter((r) => r.trans.length);
    const gN = rows.map((r) => greekNames(r.greek.map((u: Unit) => text(u.blocks)).join(" ")));
    const eN = rows.map((r) => englishNames(text(r.trans)));
    let same = 0, before = 0, after = 0;
    rows.forEach((_, i) => {
      for (const n of gN[i]) {
        // a name only counts where it tells rows apart: not in all three neighbouring rows
        const inSame = eN[i].has(n), inBefore = i > 0 && eN[i - 1].has(n), inAfter = i + 1 < rows.length && eN[i + 1].has(n);
        if (inSame && inBefore && inAfter) continue;
        if (inSame) same++;
        if (inBefore && !inSame) before++;
        if (inAfter && !inSame) after++;
      }
    });
    const off = Math.max(before, after);
    const verdict = rows.length < 8 || same + off < 10 ? "too few names" : off > same ? `out of step (${before > after ? "English a row late" : "English a row early"})` : off > same * 0.5 ? "doubtful" : "ok";
    out.push({ work: w.id, title: w.title, eng: tr.urn, rows: rows.length, same, before, after, verdict });
  }
}
writeFileSync("../pipeline/.cache/translation-names.json", JSON.stringify(out, null, 1));
const tally = new Map<string, number>();
for (const e of out) { const k = e.verdict.replace(/ \(.*/, ""); tally.set(k, (tally.get(k) ?? 0) + 1); }
console.log(`${out.length} pairs:`, [...tally].map(([k, v]) => `${v} ${k}`).join(", "));
for (const e of out.filter((x) => x.verdict !== "ok" && x.verdict !== "too few names")) console.log(`${e.verdict.padEnd(40)} ${e.work} ${e.title.slice(0, 30).padEnd(30)} ${e.eng.split(".").pop()} same ${e.same} before ${e.before} after ${e.after} rows ${e.rows}`);
