/**
 * Working out one list: which words or phrases are in it, their counts where you are looking, and their order.
 * Pure functions over the register (lib/census-register.ts), so the numbers can be tested against the files.
 */
import {
  BANDS, bandOf, inList, keyness, matcher, periodRates, trend,
  type Order, type PhraseFile, type Register, type Spread,
} from "@/lib/census-register";
import { lemmaKey } from "@/lib/census";
import { transliterate } from "@/lib/translit";
import type { Shown } from "./shared";

export interface ListInput {
  reg: Register;
  c: string;                                   // the list (see inList), or "phrase"
  counts: Map<number, number> | null;          // counts in the chosen works (null: the whole library)
  scopeWords: number;                          // words in the chosen works
  allWords: number;                            // words in the whole library
  periodWords: number[];
  pe: Spread | null;                           // counts per period (needed for rising and falling, and the little lines)
  order: Order;
  band: string | null;                         // BANDS id
  onlyOne: boolean;                            // used by one author only
  query: string;
  meanings: Record<string, string> | null;
  placeName?: (greek: string) => string | undefined;
  isName: boolean;
}
export interface ListOutput { rows: Shown[]; inList: number; bands: number[]; matched: number }

/** The sub-line under a word: an English name for a place, a transliteration for a name, else a meaning. */
function sub(inp: ListInput, i: number): string | null {
  const t = inp.reg.w[i];
  if (inp.c === "place") return inp.placeName?.(t) ?? transliterate(t);
  const group = inp.reg.groups[inp.reg.g[i]];
  if (inp.isName || ["person", "god", "place", "people"].includes(group)) return transliterate(t);
  return inp.meanings?.[i] ?? null;
}

export function wordList(inp: ListInput): ListOutput {
  const { reg, counts, order } = inp;
  const match = matcher(inp.query);
  const auto = new Set(reg.auto);
  const bands = BANDS.map(() => 0);
  let total = 0, matched = 0;
  const picked: { i: number; n: number; score: number; note?: string }[] = [];
  const ids: Iterable<number> = counts ? counts.keys() : reg.n.keys();
  for (const i of ids) {
    if (!inList(reg, inp.c, i)) continue;
    const n = counts ? counts.get(i)! : reg.n[i];
    if (!n) continue;
    total++;
    if (inp.onlyOne && reg.na[i] !== 1) continue;
    if (match && !match(reg.w[i], inp.meanings?.[i])) continue;
    matched++;
    const b = bandOf(n);
    bands[BANDS.indexOf(b)]++;
    if (inp.band && b.id !== inp.band) continue;
    let score = n, note: string | undefined;
    if (order === "rising" || order === "falling") {
      const t = inp.pe ? trend(inp.pe, i, inp.periodWords) : null;
      if (t === null) continue;
      score = order === "rising" ? t : 1 / t;
      note = t >= 1 ? `×${fmtRatio(t)}` : `÷${fmtRatio(1 / t)}`;
    } else if (order === "marked") {
      const k = keyness(n, reg.n[i], inp.scopeWords, inp.allWords);
      if (!k) continue;
      score = k.g2;
      note = k.ratio === Infinity ? "only here" : `×${fmtRatio(k.ratio)}`;
    }
    picked.push({ i, n, score, note });
  }
  const az = (a: number, b: number) => reg.w[a].localeCompare(reg.w[b], "el");
  if (order === "least") picked.sort((a, b) => a.n - b.n || az(a.i, b.i));
  else if (order === "az") picked.sort((a, b) => az(a.i, b.i));
  else picked.sort((a, b) => b.score - a.score || b.n - a.n || az(a.i, b.i));
  const rows = picked.map(({ i, n, note }): Shown => ({
    key: lemmaKey(reg.w[i]), text: reg.w[i], n, auto: auto.has(i), sub: sub(inp, i), id: i, note,
    rates: inp.pe?.[i] ? periodRates(inp.pe, i, inp.periodWords) : undefined,
  }));
  return { rows, inList: total, bands, matched };
}

/** Phrases: counted in the chosen works (null: all of them). */
export function phraseList(ph: PhraseFile, works: Set<string> | null, inp: Pick<ListInput, "order" | "band" | "onlyOne" | "query">): ListOutput {
  const match = matcher(inp.query);
  const bands = BANDS.map(() => 0);
  let total = 0, matched = 0;
  const picked: { j: number; n: number }[] = [];
  const inWorks = works ? ph.works.map((w) => works.has(w)) : null;
  for (let j = 0; j < ph.p.length; j++) {
    let n = ph.n[j];
    if (inWorks) {
      n = 0;
      const w = ph.w[j];
      for (let x = 0; x < w.length; x += 2) if (inWorks[w[x]]) n += w[x + 1];
    }
    if (!n) continue;
    total++;
    if (inp.onlyOne && new Set(phraseAuthors(ph, j)).size !== 1) continue;
    if (match && !match(ph.p[j], undefined)) continue;
    matched++;
    const b = bandOf(n);
    bands[BANDS.indexOf(b)]++;
    if (inp.band && b.id !== inp.band) continue;
    picked.push({ j, n });
  }
  const az = (a: number, b: number) => ph.p[a].localeCompare(ph.p[b], "el");
  if (inp.order === "least") picked.sort((a, b) => a.n - b.n || az(a.j, b.j));
  else if (inp.order === "az") picked.sort((a, b) => az(a.j, b.j));
  else picked.sort((a, b) => b.n - a.n || az(a.j, b.j));
  return { rows: picked.map(({ j, n }) => ({ key: ph.p[j], text: ph.p[j], n, auto: false, sub: transliterate(ph.p[j]) })), inList: total, bands, matched };
}
function phraseAuthors(ph: PhraseFile, j: number): string[] {
  const out: string[] = [];
  for (let x = 0; x < ph.w[j].length; x += 2) out.push(ph.works[ph.w[j][x]].split(".")[0]);
  return out;
}

export const fmtRatio = (r: number) => (r >= 100 ? Math.round(r).toLocaleString("en-GB") : r >= 10 ? r.toFixed(0) : r.toFixed(1));

/**
 * How much of the text the commonest words make up: for each count of commonest words (1, 2, … all), the share of
 * all the words read. Returned at the given points.
 */
export function coverage(counts: number[], at: number[]): { k: number; share: number }[] {
  const sorted = [...counts].sort((a, b) => b - a);
  const sum = sorted.reduce((s, n) => s + n, 0) || 1;
  const out: { k: number; share: number }[] = [];
  let acc = 0, j = 0;
  for (let i = 0; i < sorted.length && j < at.length; i++) {
    acc += sorted[i];
    while (j < at.length && at[j] === i + 1) { out.push({ k: at[j], share: acc / sum }); j++; }
  }
  while (j < at.length) { out.push({ k: Math.min(at[j], sorted.length), share: 1 }); j++; }
  return out;
}
