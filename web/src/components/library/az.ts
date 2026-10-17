/**
 * Putting a list in alphabetical order, for the "A to Z" lists (AZList.tsx; the owner asked for them on 2026-10-16).
 * A title is filed under the first letter of its first word, accents ignored: "Ἀγησίλαος" would go under #, "1 Corinthians"
 * under C, "The Gospel of John" under T. (The library already files its titles this way; no word such as "The" is skipped.)
 * Titles that do not start with a Latin letter, such as Greek ones, go together at the end, under "#".
 */
import type { ReactNode } from "react";
import { fold } from "@/lib/catalog";

/** One thing in an A to Z list. Give it a `href` for a plain link, or a whole list item as `node`. */
export interface AZItem {
  id: string;
  /** what it is called, and so where it is filed */
  title: string;
  /** a plain link on the title */
  href?: string;
  /** a few quiet words after the title ("12 works") */
  note?: string;
  /** a ready-made `<li>` to show instead of the plain link (the author page shows its own work rows) */
  node?: ReactNode;
}

export const AZ_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
/** The heading for everything that does not start with a Latin letter. */
export const AZ_OTHER = "#";

/** The title with its accents and capitals folded away, and any leading digits, brackets or spaces dropped. */
const filed = (title: string) => fold(title).replace(/^[^\p{L}]+/u, "");

/** The letter a title is filed under: A to Z, or "#" when it does not start with a Latin letter. */
export function azKey(title: string): string {
  const c = filed(title).charAt(0).toUpperCase();
  return c >= "A" && c <= "Z" ? c : AZ_OTHER;
}

/** Alphabetical order: A to Z, then "#"; within a letter, by the title (numbers by their size: "Oration 2" before "Oration 10"). */
export function compareAZ(a: string, b: string): number {
  const ka = azKey(a), kb = azKey(b);
  if (ka !== kb) return ka === AZ_OTHER ? 1 : kb === AZ_OTHER ? -1 : ka < kb ? -1 : 1;
  const opts = { sensitivity: "base", numeric: true } as const;
  return filed(a).localeCompare(filed(b), "en", opts) || fold(a).localeCompare(fold(b), "en", opts);
}

/** The items in alphabetical order, in one group for each letter that has any. */
export function groupAZ<T extends { title: string }>(items: readonly T[]): { key: string; items: T[] }[] {
  const out: { key: string; items: T[] }[] = [];
  for (const it of [...items].sort((x, y) => compareAZ(x.title, y.title))) {
    const key = azKey(it.title);
    const last = out[out.length - 1];
    if (last && last.key === key) last.items.push(it);
    else out.push({ key, items: [it] });
  }
  return out;
}

/**
 * How closely a search names an author, for the "Best match" at the head of the library's list (Library.tsx). Give it the
 * words as `fold()` leaves them and every name the author goes by. 0: the words are a whole name; 1: they open a name;
 * 2: they open a word inside a name ("Plato" in "Pseudo-Plato"); 3: they are only somewhere inside one; -1: not a name of theirs.
 */
export function nameMatch(names: readonly (string | undefined)[], folded: string): number {
  if (!folded) return -1;
  let best = -1;
  for (const name of names) {
    if (!name) continue;
    const s = fold(name), i = s.indexOf(folded);
    const t = i < 0 ? -1 : s === folded ? 0 : i === 0 ? 1 : /[^\p{L}\p{N}]/u.test(s.charAt(i - 1)) ? 2 : 3;
    if (t >= 0 && (best < 0 || t < best)) best = t;
  }
  return best;
}

/** The one item that is plainly closer than all the rest (the lowest non-negative tier, held by it alone), or null when two are level or none match. */
export function bestMatch<T>(items: readonly T[], tier: (x: T) => number): T | null {
  let best: T | null = null, low = Infinity, level = false;
  for (const x of items) {
    const t = tier(x);
    if (t < 0) continue;
    if (t < low) { best = x; low = t; level = false; } else if (t === low) level = true;
  }
  return level ? null : best;
}
