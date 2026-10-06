/**
 * Find in the text being read: a word or a phrase, in the Greek and in the translation beside it.
 *
 * The Greek is matched word by word on search keys (no accents, breathings or case; lib/search/codec.ts),
 * so ἄνδρα, ανδρα and andra all find ἄνδρα. Greek may be typed in Greek letters, in Latin letters (the
 * site's transliteration) or in Beta Code, as in the site's search (lib/search/input.ts); * stands for any
 * letters and ? for one. A phrase is words in a row, and may run on from one passage into the next.
 * Latin letters are also looked for in the English translation, as whole words.
 */
import type { Placed } from "@/lib/tei/align";
import type { TeiDoc } from "@/lib/tei/types";
import { greekKey, unitWords } from "@/lib/search/codec";
import { detectScript, queryWords, toPattern } from "@/lib/search/input";

export const FIND_MAX = 5000;

/** A word of the Greek: its passage (index into doc.units) and its place among that passage's words. */
export interface WordAt { unit: number; i: number }
export interface GreekHit { lang: "grc"; unit: number; words: WordAt[] }
/** A match in the translation: the Greek passage it sits beside, the piece of translation, and where in its text. */
export interface EnglishHit { lang: "eng"; unit: number; piece: number; at: number; len: number }
export type FindHit = GreekHit | EnglishHit;

export interface FindResult {
  grc: GreekHit[];
  eng: EnglishHit[];
  /** the Greek being looked for, as the reader will recognise it ("λογος", "ανδρ*") */
  greek: string | null;
  /** the translation pattern, for marking matches on the page (use with the flags "gi") */
  engSource: string | null;
  /** why the Greek could not be searched, in plain words (the English may still have been) */
  error: string | null;
  /** more than FIND_MAX in one language: only the first FIND_MAX are listed */
  capped: boolean;
}

/** The plain text of a piece of translation, as the reader shows it (notes and milestones left out). */
export const pieceText = (p: Placed) =>
  p.blocks.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" ").replace(/\s+/g, " ");

/** Every Greek word of the text as a search key, with where it is: built once per text. */
export function greekIndex(doc: TeiDoc) {
  const keys: string[] = [], at: WordAt[] = [];
  doc.units.forEach((u, unit) => unitWords(u).forEach((w, i) => { keys.push(greekKey(w)); at.push({ unit, i }); }));
  return { keys, at };
}
export type GreekIndex = ReturnType<typeof greekIndex>;

/** The translation pattern for typed words: whole words, with * and ? as wildcards, any spacing or punctuation between. */
export function englishSource(q: string): string | null {
  const words = queryWords(q).map((w) => w.toLowerCase().replace(/[^a-z*?’']/g, "")).filter((w) => /[a-z]/.test(w));
  if (!words.length || words.some((w) => /^[*?]/.test(w))) return null;
  const one = (w: string) => w.replace(/[’']/g, "[’']").replace(/\*/g, "[a-z]*").replace(/\?/g, "[a-z]");
  return `(?<![A-Za-z])${words.map(one).join("[^A-Za-z]+")}(?![A-Za-z])`;
}

export function findInText(doc: TeiDoc, index: GreekIndex, placed: Placed[] | null, q: string): FindResult {
  const out: FindResult = { grc: [], eng: [], greek: null, engSource: null, error: null, capped: false };
  const words = queryWords(q);
  if (!words.length) return out;
  const script = detectScript(q);

  // ---- the Greek
  const pats = words.map((w) => toPattern(w, script));
  const bad = pats.find((p): p is { error: string } => "error" in p);
  if (bad) out.error = bad.error;
  else {
    const ps = pats as Exclude<(typeof pats)[number], { error: string }>[];
    out.greek = ps.map((p) => p.greek).join(" ");
    const { keys, at } = index, n = ps.length;
    for (let s = 0; s + n <= keys.length; s++) {
      let ok = true;
      for (let k = 0; k < n && ok; k++) ok = ps[k].regex.test(keys[s + k]);
      if (!ok) continue;
      if (out.grc.length >= FIND_MAX) { out.capped = true; break; }
      out.grc.push({ lang: "grc", unit: at[s].unit, words: at.slice(s, s + n) });
    }
  }

  // ---- the translation (Latin letters only)
  if (script === "translit" && placed?.length) {
    const src = englishSource(q);
    if (src) {
      out.engSource = src;
      const re = new RegExp(src, "gi");
      placed.forEach((p, piece) => {
        if (out.eng.length >= FIND_MAX) { out.capped = true; return; }
        for (const m of pieceText(p).matchAll(re)) {
          out.eng.push({ lang: "eng", unit: p.at, piece, at: m.index!, len: m[0].length });
          if (out.eng.length >= FIND_MAX) break;
        }
      });
    }
  }
  return out;
}

/** The words either side of a translation match, for the list of results. */
export function englishSnippet(text: string, h: EnglishHit, around = 48): { before: string; hit: string; after: string } {
  let a = Math.max(0, h.at - around), b = Math.min(text.length, h.at + h.len + around);
  if (a > 0) a = text.indexOf(" ", a) + 1 || a;
  if (b < text.length) b = text.lastIndexOf(" ", b) > h.at + h.len ? text.lastIndexOf(" ", b) : b;
  return { before: (a > 0 ? "…" : "") + text.slice(a, h.at), hit: text.slice(h.at, h.at + h.len), after: text.slice(h.at + h.len, b) + (b < text.length ? "…" : "") };
}
