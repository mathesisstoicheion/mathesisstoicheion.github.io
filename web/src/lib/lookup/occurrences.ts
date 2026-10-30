/**
 * Where else a word occurs: how many times a dictionary form stands in a work, counted from the work's word pack (GLAUx's
 * analysis of every word), the one already loaded for the look-up (the quiet desk, ticket 06). Nothing is guessed: the count is
 * the number of words the pack analyses as this dictionary form, and "Where else it occurs" is said when it cannot be counted.
 */
import type { WordPack } from "./words";

const counts = new WeakMap<WordPack, Map<string, number>>();

/** How many words of the work GLAUx analyses as this dictionary form (one pass over the pack, kept for the next word asked). */
export function countLemma(pack: WordPack, lemma: string): number {
  let m = counts.get(pack);
  if (!m) {
    m = new Map();
    const per = new Array<number>(pack.lemmas.length).fill(0);
    for (const u of pack.units) for (const id of u[3]) per[id]++;
    pack.lemmas.forEach((name, id) => m!.set(name, (m!.get(name) ?? 0) + per[id]));
    counts.set(pack, m);
  }
  return m.get(lemma) ?? 0;
}

/** What the way into Echoes says when the word cannot be counted */
const UNCOUNTED = "Where else it occurs";

/**
 * The words of the link that opens Echoes: "12 times in the Iliad". With no count (no analysis of the word, a work with no
 * word pack, or none found) it says "Where else it occurs", never a made-up number.
 */
export function occursLine(count: number | null | undefined, workTitle: string | null | undefined): string {
  if (!count || count < 1) return UNCOUNTED;
  const times = count === 1 ? "Once" : `${count.toLocaleString("en-GB")} times`;
  return `${times} ${workTitle ? `in the ${workTitle}` : "in this work"}`;
}

/**
 * The same, as the row of "Go further" that opens Echoes (the quiet desk, the look-up's fixes, the owner, 2026-10-30): "Where else:
 * 12 times in the Iliad". Without a count the line already says where else, and stands as it is.
 */
export function whereElse(count: number | null | undefined, workTitle: string | null | undefined): string {
  const line = occursLine(count, workTitle);
  return line === UNCOUNTED ? line : `Where else: ${line}`;
}
