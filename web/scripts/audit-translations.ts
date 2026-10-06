/**
 * Translation audit: for every Greek edition and every English translation of the same work, line them
 * up exactly as the reader does and look for English that exists but would not show where it belongs.
 *
 *   npx tsx scripts/audit-translations.ts            writes pipeline/.cache/translation-audit.json
 *
 * For each pair it reports:
 *  - lost:     share of the translation's words that the parser kept, against the words in the file
 *  - stray:    share of translation pieces whose reference the Greek does not have (they follow the piece before)
 *  - pile:     the largest share of the translation's words beside a single Greek passage
 *  - covered:  share of Greek passages that sit in a row with translation beside them
 *  - pages:    pages (chunks) with no translation at all, split into those before, inside and after the translated stretch
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { indexCatalog, greekEditions, translations, type Catalog, type CatText } from "../src/lib/catalog";
import { parseTei } from "../src/lib/tei/parse";
import { translationPieces, placePieces, alignChunk, untranslated } from "../src/lib/tei/align";
import { renumber, schemeFor } from "../src/lib/tei/versification";
import type { Block, TeiDoc } from "../src/lib/tei/types";

const CORPUS = "../pipeline/.cache/corpus";
const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);
const words = (s: string) => (s.match(/[\p{L}\p{N}]+/gu) ?? []).length;
const blockWords = (bs: Block[]) => bs.reduce((n, b) => n + b.c.reduce((m, x) => m + (typeof x === "string" ? words(x) : "note" in x ? words(x.note) : 0), 0), 0);
const docs = new Map<string, TeiDoc | null>();
const load = (t: CatText) => {
  if (docs.has(t.urn)) return docs.get(t.urn)!;
  const f = join(CORPUS, t.col, t.path);
  let d: TeiDoc | null = null;
  try { d = existsSync(f) ? parseTei(readFileSync(f, "utf8")) : null; } catch { d = null; }
  docs.set(t.urn, d);
  return d;
};
/** words in the file's text, outside the header */
const rawWords = (t: CatText) => {
  const x = readFileSync(join(CORPUS, t.col, t.path), "utf8").replace(/<teiHeader[\s\S]*?<\/teiHeader>/, "");
  const body = x.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;|&#\d+;/g, " ");
  return words(body);
};

interface Entry {
  work: string; title: string; grc: string; eng: string; default: boolean;
  grcUnits: number; trUnits: number; trWords: number; rawWords: number;
  kept: number; stray: number; pile: number; covered: number;
  pages: number; emptyBefore: number; emptyInside: number[]; emptyAfter: number;
  problems: string[]; missing?: number; missingRows?: string[];
}
const out: Entry[] = [];
let n = 0;
for (const a of idx.catalog.authors) for (const w of a.works) {
  const eds = greekEditions(w), trs = translations(w).filter((t) => t.lang === "eng");
  if (!eds.length || !trs.length) continue;
  const defEd = eds.find((t) => t.col === "perseus") ?? eds[0];
  for (const ed of eds) for (const tr of trs) {
    const g = load(ed), e0 = load(tr);
    const scheme = schemeFor(w.id, tr);
    const e = g && e0 && scheme ? renumber(scheme, g, e0) : e0;
    if (!g || !e) { out.push({ work: w.id, title: w.title, grc: ed.urn, eng: tr.urn, default: ed === defEd && tr === trs[0], grcUnits: g?.units.length ?? 0, trUnits: e?.units.length ?? 0, trWords: 0, rawWords: 0, kept: 0, stray: 0, pile: 0, covered: 0, pages: 0, emptyBefore: 0, emptyInside: [], emptyAfter: 0, problems: [!g ? "Greek did not load" : "translation did not load"] }); continue; }
    const pieces = translationPieces(g, e);
    const index = new Set(g.units.map((u) => u.ref.join(".")));
    const stray = pieces.filter((p) => p.key == null || (!index.has(p.key) && !(p.key.endsWith(".?") && g.units.some((u) => u.ref.join(".").startsWith(p.key!.slice(0, -1)))))).length;
    const placed = placePieces(g, pieces);
    const trWords = e.units.reduce((s, u) => s + blockWords(u.blocks), 0);
    const raw = rawWords(tr);
    const at = new Map<number, number>();
    for (const p of placed) at.set(p.at, (at.get(p.at) ?? 0) + blockWords(p.blocks));
    const pile = trWords ? Math.max(0, ...at.values()) / trWords : 0;
    let coveredUnits = 0, missing = 0;
    const missingRows: string[] = [];
    const pageHas: boolean[] = [];
    g.chunks.forEach((c) => {
      const rows = alignChunk(g, c, placed);
      let has = false;
      for (const r of rows) if (r.trans.length) { coveredUnits += r.greek.length; has = true; }
      for (const r of untranslated(rows)) { missing += r.greek.length; missingRows.push(r.key); }
      pageHas.push(has);
    });
    const firstP = pageHas.indexOf(true), lastP = pageHas.lastIndexOf(true);
    const emptyInside = firstP < 0 ? [] : pageHas.map((h, i) => (!h && i > firstP && i < lastP ? i : -1)).filter((i) => i >= 0);
    const ent: Entry = {
      work: w.id, title: w.title, grc: ed.urn, eng: tr.urn, default: ed === defEd && tr === trs[0],
      grcUnits: g.units.length, trUnits: e.units.length, trWords, rawWords: raw,
      kept: raw ? +(trWords / raw).toFixed(3) : 1, stray: pieces.length ? +(stray / pieces.length).toFixed(3) : 0,
      pile: +pile.toFixed(3), covered: +(coveredUnits / Math.max(1, g.units.length)).toFixed(3),
      pages: g.chunks.length, emptyBefore: firstP < 0 ? g.chunks.length : firstP, emptyInside, emptyAfter: firstP < 0 ? 0 : g.chunks.length - 1 - lastP,
      problems: [], missing, missingRows: missingRows.slice(0, 12),
    };
    if (!e.units.length || trWords === 0) ent.problems.push("translation has no passages");
    if (ent.kept < 0.9) ent.problems.push(`parser kept ${Math.round(ent.kept * 100)}% of the translation's words`);
    if (ent.stray > 0.2) ent.problems.push(`${Math.round(ent.stray * 100)}% of pieces match no Greek reference`);
    if (pile > 0.25 && g.units.length > 20) ent.problems.push(`${Math.round(pile * 100)}% of the English sits beside one Greek passage`);
    if (ent.emptyInside.length) ent.problems.push(`${ent.emptyInside.length} pages without English inside the translated stretch`);
    out.push(ent);
    if (++n % 100 === 0) console.error(n, "pairs");
  }
}
writeFileSync("../pipeline/.cache/translation-audit.json", JSON.stringify(out, null, 1));
const bad = out.filter((e) => e.problems.length);
console.log(`${out.length} pairs (${out.filter((e) => e.default).length} default), ${bad.length} with problems (${bad.filter((e) => e.default).length} default)`);
const tally = new Map<string, number>();
for (const e of bad) for (const p of e.problems) { const k = p.replace(/\d+%?/g, "N"); tally.set(k, (tally.get(k) ?? 0) + 1); }
console.log([...tally].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v}\t${k}`).join("\n"));
