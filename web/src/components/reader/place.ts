/**
 * Where the reader is in the book, as the foot bar says it (the quiet desk, ticket 09, the owner, 2026-10-30): the part the page is
 * ("Book 1"), the kind of passage it is made of ("line", the last of the text's citation levels), the passage at the top of the
 * screen ("25", the last part of its reference), and how far through the page that is (for the thin rule beside the words).
 * "of 611" is said only when it is true: when every passage on the page is numbered with a plain whole number, in one run, in
 * order (a book of lines: "line 25 of 611"); with sections cited "327a", or numbers that start again under a new chapter, the bar
 * says only "section 327a". It never says "line 0": a passage numbered 0 is a speaker's name, not a line.
 */
import type { TeiDoc } from "@/lib/tei/types";

export interface Place {
  /** the page's name, as the page select lists it ("Book 1") */
  part: string;
  /** the kind of passage: the text's last citation level ("line", "section", "verse") */
  level: string;
  /** the passage at the top of the screen, its number in its part ("25") */
  num: string;
  /** the number of the page's last passage, when the page is numbered one to N in order; else null */
  of: number | null;
  /** how far through the page the passage is, 0 at its first passage to 1 at its last */
  progress: number;
}

const WHOLE = /^\d+$/;
const ZERO = /^0+$/;

/**
 * @param doc    the text
 * @param chunk  the page now shown
 * @param key    the reference of the passage at the top of the screen (its row's key), or null before it is known (the page's first)
 * @param order  each passage's place in the text, by reference (Reader.tsx's `order`)
 */
export function placeOf(doc: TeiDoc, chunk: number, key: string | null, order: ReadonlyMap<string, number>): Place | null {
  const page = doc.chunks[chunk];
  if (!page || !doc.units[page.first]) return null;
  let at = Math.min(page.last, Math.max(page.first, key === null ? page.first : order.get(key) ?? page.first));
  // a passage numbered 0 is no line (Perseus's "line 0" holds only the first speaker's name): the bar names the first numbered one after it
  while (at < page.last && ZERO.test(doc.units[at].ref.at(-1)!)) at++;
  const ref = doc.units[at].ref;
  let of: number | null = null;
  // one run: every passage on the page under the same part of the reference (the same book), each number a whole number, none lower than the one before
  const head = ref.slice(0, -1).join(".");
  let prev = -1, ok = true;
  for (let i = page.first; i <= page.last && ok; i++) {
    const r = doc.units[i].ref, n = r[r.length - 1];
    ok = WHOLE.test(n) && r.slice(0, -1).join(".") === head && Number(n) >= prev;
    prev = Number(n);
  }
  if (ok) of = prev;
  return {
    part: page.label,
    level: doc.levels.at(-1) ?? "passage",
    num: ref[ref.length - 1],
    of,
    progress: page.last === page.first ? 0 : (at - page.first) / (page.last - page.first),
  };
}
