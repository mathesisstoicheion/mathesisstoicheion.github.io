/**
 * Every entry of the Painted Stoa. Add a new entry's module here (the order does not matter:
 * lists are sorted by title within each category).
 */
import type { CategoryId, Entry } from "./types";
import { CATEGORIES } from "./types";

/** The Painted Stoa has no entries now (the owner, 2026-11-12: "Delete all wiki entries"); they are in git history, before this commit. */
export const ENTRIES: Entry[] = [];

export const entryBySlug = new Map(ENTRIES.map((e) => [e.slug, e]));
export const entriesIn = (c: CategoryId) => ENTRIES.filter((e) => e.category === c).sort((a, b) => a.title.localeCompare(b.title));
export const categoryOf = (c: CategoryId) => CATEGORIES.find((x) => x.id === c)!;
