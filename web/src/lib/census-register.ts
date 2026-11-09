/**
 * The Census's register: every dictionary word and every repeated phrase the library uses, not only the top of each
 * list (pipeline/build_census.py, write_register). Lists are worked out here, in the browser, from these files:
 *   reg.json        every dictionary word, most used first; its place in the arrays is its id
 *   gl.json         { id: short English meaning }
 *   full/<g>.json   every word's count in a group of works, packed as [gap from the previous id, count, …]
 *   full/a/<a>.json the same for an author ("a:<a>") and each of its works ("w:<work>")
 *   phr.json        every repeated phrase, with its count in each work
 *   authors.json    per author: words, different words, words no one else uses, words used once, richness
 * Every number shown comes from these counts; nothing is estimated.
 */
import type { CensusMeta, Scope } from "@/lib/census";
import { groupOf } from "@/lib/census";
import { greekKey } from "@/lib/search/codec";
import { transliterate } from "@/lib/translit";

export interface Register {
  kinds: string[]; groups: string[]; periods: string[]; families: string[];
  w: string[]; n: number[]; k: number[]; g: number[]; auto: number[]; nw: number[]; na: number[];
}
/** Per word (by id): its counts in each period, or in each kind of writing; 0 when it has none there. */
export type Spread = (number[] | 0)[];
export interface PhraseFile { works: string[]; p: string[]; n: number[]; w: number[][] }
export interface AuthorStats { window: number; cols: string[]; rows: [string, number, number, number, number, number | null, number][] }

const BASE = "/data/census";
const cache = new Map<string, Promise<unknown>>();
function json<T>(path: string): Promise<T | null> {
  if (!cache.has(path)) {
    cache.set(path, fetch(`${BASE}/${path}`).then((r) => {
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(`the Census data could not be reached (${r.status})`);
      return r.json();
    }).catch((e) => { cache.delete(path); throw e; }));
  }
  return cache.get(path) as Promise<T | null>;
}

export const loadRegister = () => json<Register>("reg.json");
export const loadPeriodCounts = () => json<Spread>("reg-pe.json");
export const loadFamilyCounts = () => json<Spread>("reg-fa.json");
export const loadMeanings = () => json<Record<string, string>>("gl.json");
export const loadPhrases = () => json<PhraseFile>("phr.json");
export const loadAuthorStats = () => json<AuthorStats>("authors.json");

/** [gap, count, gap, count…] -> id -> count */
export function unpack(flat: number[]): Map<number, number> {
  const m = new Map<number, number>();
  let id = 0;
  for (let i = 0; i < flat.length; i += 2) { id += flat[i]; m.set(id, flat[i + 1]); }
  return m;
}

/** Every word's count in a group of works; null for the whole library (whose counts are the register's own). */
export async function groupCounts(group: string): Promise<Map<number, number> | null> {
  if (group === "all") return null;
  if (group.startsWith("a:") || group.startsWith("w:")) {
    const file = await json<Record<string, number[]>>(`full/a/${group.slice(2).split(".")[0]}.json`);
    const flat = file?.[group];
    return flat ? unpack(flat) : new Map();
  }
  const flat = await json<number[]>(`full/${group}.json`);
  return flat ? unpack(flat) : new Map();
}

// ------------------------------------------------------------ what a list holds
/** The lists: the old ids (names, things, words by part of speech, phrases) and three wider ones. */
export const WORD_KINDS: { id: string; label: string; one: string; kinds: string[] }[] = [
  { id: "words", label: "All words", one: "word", kinds: [] },
  { id: "noun", label: "Nouns", one: "noun", kinds: ["noun"] },
  { id: "verb", label: "Verbs", one: "verb", kinds: ["verb"] },
  { id: "adj", label: "Adjectives", one: "adjective", kinds: ["adj"] },
  { id: "adv", label: "Adverbs", one: "adverb", kinds: ["adv"] },
  { id: "pron", label: "Pronouns", one: "pronoun", kinds: ["pron"] },
  { id: "small", label: "Little words", one: "little word", kinds: ["art", "prep", "conj", "part", "intj"] },
  { id: "num", label: "Numbers", one: "number word", kinds: ["num"] },
];
export const NAME_IDS = ["person", "god", "place", "people"];

/** Does word i belong in list c? */
export function inList(reg: Register, c: string, i: number): boolean {
  const group = reg.groups[reg.g[i]];
  if (c === "words") return true;
  if (c === "names") return NAME_IDS.includes(group);
  if (c === "things") return group.startsWith("obj:");
  if (NAME_IDS.includes(c) || c.startsWith("obj:")) return group === c;
  const wk = WORD_KINDS.find((x) => x.id === c);
  return !!wk && wk.kinds.includes(reg.kinds[reg.k[i]]);
}

// ------------------------------------------------------------ how often
export const BANDS: { id: string; label: string; lo: number; hi: number }[] = [
  { id: "1", label: "Once", lo: 1, hi: 1 },
  { id: "2", label: "2–9", lo: 2, hi: 9 },
  { id: "10", label: "10–99", lo: 10, hi: 99 },
  { id: "100", label: "100–999", lo: 100, hi: 999 },
  { id: "1000", label: "1,000+", lo: 1000, hi: Infinity },
];
export const bandOf = (n: number) => BANDS.find((b) => n >= b.lo && n <= b.hi)!;

// ------------------------------------------------------------ orders
export type Order = "most" | "least" | "az" | "rising" | "falling" | "marked";
export const ORDERS: { id: Order; label: string; short: string; needsScope?: boolean }[] = [
  { id: "most", label: "most mentioned first", short: "Most mentioned" },
  { id: "least", label: "least mentioned first", short: "Least mentioned" },
  { id: "az", label: "in alphabetical order", short: "Α to Ω" },
  { id: "rising", label: "rising most from the Classical to the Roman age", short: "Rising" },
  { id: "falling", label: "falling most from the Classical to the Roman age", short: "Falling" },
  { id: "marked", label: "most typical of this choice, compared with the rest of the library", short: "Most typical", needsScope: true },
];
/** Rising and falling compare these two periods, the two largest (by index in reg.periods). */
export const EARLY = 1, LATE = 3;
export const TREND_MIN = 50;      // a word must be used this often in the two periods together to be ranked by its change
export const MARKED_MIN = 10;     // …and this often in the chosen works to be ranked as typical of them

/** A word's rate per 10,000 words in each period. */
export function periodRates(spread: Spread, i: number, periodWords: number[]): number[] {
  const pe = spread[i];
  return periodWords.map((w, p) => (pe && w ? (pe[p] * 10000) / w : 0));
}

/** How many times more (or less) often, for its size, a word is used in the Roman age than in the Classical. */
export function trend(spread: Spread, i: number, periodWords: number[]): number | null {
  const pe = spread[i];
  if (!pe || pe[EARLY] + pe[LATE] < TREND_MIN) return null;
  // half a use added to each side, so a word missing from one period has a finite ratio
  return ((pe[LATE] + 0.5) / periodWords[LATE]) / ((pe[EARLY] + 0.5) / periodWords[EARLY]);
}

/**
 * How typical a word is of the chosen works: Dunning's log-likelihood (G²) of its count here against the rest of the
 * library, for words used more often here than elsewhere; with the ratio of the two rates to show.
 */
export function keyness(here: number, total: number, hereWords: number, allWords: number): { g2: number; ratio: number } | null {
  const elsewhere = total - here, restWords = allWords - hereWords;
  if (here < MARKED_MIN || restWords <= 0 || hereWords <= 0) return null;
  const e1 = (hereWords * total) / allWords, e2 = (restWords * total) / allWords;
  const ratio = elsewhere === 0 ? Infinity : (here / hereWords) / (elsewhere / restWords);
  if (ratio <= 1) return null;
  const g2 = 2 * (here * Math.log(here / e1) + (elsewhere > 0 ? elsewhere * Math.log(elsewhere / e2) : 0));
  return { g2, ratio };
}

// ------------------------------------------------------------ searching
/** What a search box text matches: Greek letters by their bare letters, Latin letters by sound or by meaning. */
export function matcher(q: string): ((text: string, meaning: string | undefined) => boolean) | null {
  const t = q.trim();
  if (!t) return null;
  if (/[Ͱ-Ͽἀ-῿]/.test(t)) {
    const k = greekKey(t);
    if (!k) return null;
    return (text) => greekKey(text).includes(k);
  }
  const plain = fold(t);
  if (!plain) return null;
  const word = new RegExp(`\\b${plain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
  return (text, meaning) => fold(transliterate(text)).includes(plain) || (!!meaning && word.test(meaning.toLowerCase()));
}
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z ]/g, "");

/** The works of a scope, by id; null for the whole library. */
export function scopeKey(s: Scope) { return groupOf(s); }

/** The words in each period, from the Census's own groups. */
export function periodWords(meta: CensusMeta, reg: Register): number[] {
  return reg.periods.map((_, i) => meta.groups[`p${i}`]?.[1] ?? 0);
}
export function familyWords(meta: CensusMeta, reg: Register): number[] {
  return reg.families.map((_, i) => meta.groups[`f${i}`]?.[1] ?? 0);
}
