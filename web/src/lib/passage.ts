/** Load a stretch of a work (Greek + aligned translation) straight from the source files. */
import { loadCatalog, greekEditions, translations, type CatText } from "@/lib/catalog";
import { getXml } from "@/lib/texts/source";
import { parseInWorker } from "@/lib/tei/client";
import { alignChunk, type Row } from "@/lib/tei/align";
import { findRef } from "@/lib/tei/refs";

export interface LoadedPassage { rows: Row[]; grc: CatText; tr: CatText | null; keys: Set<string>; depth: number }

export async function loadPassage(work: string, from: string, to = from): Promise<LoadedPassage> {
  const idx = await loadCatalog();
  const w = idx.work.get(work);
  if (!w) throw new Error(`${work} is not in the catalogue`);
  const grc = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
  const tr = translations(w)[0] ?? null;
  const [g, t] = await Promise.all([getXml(idx, grc), tr ? getXml(idx, tr).catch(() => null) : null]);
  const parsed = await parseInWorker(g.xml, t?.xml ?? null);
  const a = findRef(parsed.doc, from), b = findRef(parsed.doc, to);
  if (a < 0 || b < a) throw new Error(`reference ${from} not found`);
  // the last unit of a range: extend to the end of the passage named by `to` (e.g. "1.1.2" and its subsections)
  let end = b;
  const toKey = parsed.doc.units[b].ref.join(".");
  while (end + 1 < parsed.doc.units.length && parsed.doc.units[end + 1].ref.join(".").startsWith(toKey + ".")) end++;
  const rows = alignChunk(parsed.doc, { first: a, last: end }, t ? parsed.placed : null);
  return { rows, grc, tr: t ? tr : null, keys: new Set(parsed.doc.units.map((u) => u.ref.join("."))), depth: parsed.doc.levels.length };
}

/** The text of some blocks, with milestones, notes and gaps left out (a gap shows as an ellipsis). */
function plainText(bs: { c: (string | object)[] }[]): string {
  return bs.map((b) => b.c.map((x) => (typeof x === "string" ? x : "gap" in x ? " … " : "")).join("")).join(" ").replace(/\s+/g, " ").trim();
}

export interface Opening { ref: string; greek: string; english: string | null; cut: boolean; grc: CatText; tr: CatText | null }

/**
 * The opening words of a work, straight from its source file: its first passage (a few lines, for verse) and the
 * translation beside it, cut at the end of a sentence after about `max` letters ("cut" says so). Nothing is rewritten.
 */
export async function loadOpening(work: string, max = 260): Promise<Opening> {
  const idx = await loadCatalog();
  const w = idx.work.get(work);
  if (!w) throw new Error(`${work} is not in the catalogue`);
  const grc = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
  const tr = translations(w)[0] ?? null;
  const [g, t] = await Promise.all([getXml(idx, grc), tr ? getXml(idx, tr).catch(() => null) : null]);
  const parsed = await parseInWorker(g.xml, t?.xml ?? null);
  const units = parsed.doc.units;
  // the first unit with words in it; for verse, a few lines, up to about `max` letters
  let first = units.findIndex((u) => plainText(u.blocks.filter((b) => b.t !== "head")).length > 0);
  if (first < 0) throw new Error("no text");
  let last = first, greek = plainText(units[first].blocks.filter((b) => b.t !== "head"));
  while (last + 1 < units.length && units[last + 1].blocks.some((b) => b.t === "l") && greek.length < max * 0.6) {
    last++;
    greek += " / " + plainText(units[last].blocks.filter((b) => b.t !== "head"));
  }
  const rows = t ? alignChunk(parsed.doc, { first, last }, parsed.placed) : [];
  let english = rows.length ? plainText(rows.flatMap((r) => r.trans).filter((b) => b.t !== "head")) : "";
  let cut = false;
  if (english.length > max) {
    const stop = english.slice(0, max).search(/[.;?!][^.;?!]*$/);
    english = english.slice(0, stop > 60 ? stop + 1 : max).trim();
    cut = true;
  }
  if (greek.length > max * 1.4) { greek = greek.slice(0, max).replace(/\s\S*$/, ""); cut = true; }
  const ref = units[first].ref.join(".") + (last > first ? `–${units[last].ref.at(-1)}` : "");
  return { ref, greek, english: english || null, cut, grc, tr: english ? tr : null };
}
