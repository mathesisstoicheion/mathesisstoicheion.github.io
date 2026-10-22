/**
 * The smart parts of the universal search (components/search/QuickSearch.tsx), kept pure so they can
 * be tested: how well a text matches what was typed, and the site's own pages, Academy lessons and
 * guides, places and quick actions ("dark mode", "bigger text") that a search can offer.
 * Matching ignores case, accents and breathings, and every word typed must be found.
 */
import { fold } from "@/lib/catalog";

/**
 * How well `text` matches the query: 4 the whole text, 3 the text starts with it, 2 a word of the text
 * starts with every query word, 1 every query word is somewhere inside, 0 no match.
 */
export function score(text: string, query: string): number {
  const t = fold(text).replace(/\s+/g, " ").trim(), q = fold(query).replace(/\s+/g, " ").trim();
  if (!q || !t) return 0;
  if (t === q) return 4;
  if (t.startsWith(q)) return 3;
  const words = q.split(" ");
  const tw = t.split(/[\s,.;:·()–-]+/);
  if (words.every((w) => tw.some((x) => x.startsWith(w)))) return 2;
  if (words.every((w) => t.includes(w))) return 1;
  return 0;
}

/** The best score over several texts (a title counts double a description). */
export const best = (query: string, main: string[], more: string[] = []) =>
  Math.max(0, ...main.map((t) => score(t, query) * 2), ...more.map((t) => score(t, query)));

/** Items that match, best first (ties keep their order), at most `max`. */
export function rank<T>(items: T[], query: string, texts: (x: T) => { main: string[]; more?: string[] }, max: number, min = 1): T[] {
  return items
    .map((x, i) => ({ x, i, s: best(query, texts(x).main, texts(x).more) }))
    .filter((r) => r.s >= min)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, max)
    .map((r) => r.x);
}

/** Something the search can do rather than a page it can open. */
export type ActionId =
  | "theme-dark" | "theme-light" | "theme-auto" | "settings" | "bigger" | "smaller"
  | "face-didot" | "face-gentium" | "motion-reduce" | "motion-auto";

export interface Action { id: ActionId; label: string; words: string[] }

export const ACTIONS: Action[] = [
  // Paper or Night (the site follows the device unless one is chosen)
  { id: "theme-dark", label: "The page: Night", words: ["dark", "dark mode", "night", "black", "theme"] },
  { id: "theme-light", label: "The page: Paper", words: ["light", "light mode", "day", "daylight", "paper", "papyrus", "theme"] },
  { id: "theme-auto", label: "The page: follow this device", words: ["auto", "system", "device", "follow", "theme"] },
  { id: "bigger", label: "Bigger Greek text", words: ["bigger", "larger", "zoom in", "text size", "font size", "size"] },
  { id: "smaller", label: "Smaller Greek text", words: ["smaller", "zoom out", "text size", "font size", "size"] },
  { id: "face-gentium", label: "Greek typeface: Gentium", words: ["gentium", "typeface", "font"] },
  { id: "face-didot", label: "Greek typeface: Didot", words: ["didot", "typeface", "font"] },
  { id: "motion-reduce", label: "Movement: off (nothing inks in)", words: ["reduce motion", "animation", "motion", "still", "performance", "slow", "lag"] },
  { id: "motion-auto", label: "Movement: ink-in, as this device allows", words: ["animation", "motion", "ink"] },
  { id: "settings", label: "Open Settings", words: ["settings", "preferences", "options", "line spacing", "vibration", "offline"] },
];

/** Actions whose words start with what was typed (at least two letters). */
export function matchActions(query: string, max = 3): Action[] {
  const q = fold(query).trim();
  if (q.length < 2) return [];
  return ACTIONS
    .map((a, i) => ({ a, i, s: Math.max(...a.words.map((w) => (fold(w) === q ? 3 : fold(w).startsWith(q) ? 2 : q.startsWith(fold(w)) && fold(w).length >= 4 ? 1 : 0))) }))
    .filter((r) => r.s > 0)
    .sort((x, y) => y.s - x.s || x.i - y.i)
    .slice(0, max)
    .map((r) => r.a);
}
