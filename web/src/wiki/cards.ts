/** What a page needs of a Painted Stoa entry to list it (the Stoa's front page): everything but its text. */
import type { Entry } from "./types";

export type EntryCard = Pick<Entry, "slug" | "title" | "greek" | "kicker" | "hook" | "category" | "image">;
export const cardOf = (e: Entry): EntryCard => ({ slug: e.slug, title: e.title, greek: e.greek, kicker: e.kicker, hook: e.hook, category: e.category, image: e.image });
