/**
 * The kind of writing each work is filed under in the library's catalogue (redesign decision 11: "the catalogue grouped by
 * kind (Epic, History, Philosophy, Drama, Medicine and so on), authors A to Z inside each").
 *
 * GLAUx's classification of the work comes first (lib/works-meta.ts, FAMILIES). About a third of the works have none; such a
 * work is filed with its author's usual kind: the kind of most of the author's classified works; else, for a collection
 * named by what it is, that ("Scholia on Pindar" is scholarship, "Letters of Phalaris" letters); else what Wikidata says
 * the author was (lib/authors-meta.ts, KINDS: "rhetorician" is oratory and rhetoric). Anything left is "Other writings".
 */
import { FAMILIES, familyOf, type WorkMeta } from "@/lib/works-meta";
import { KINDS, type AuthorMeta } from "@/lib/authors-meta";
import type { CatAuthor } from "@/lib/catalog";
import { OTHER_KIND } from "@/data/library-plates";

export { OTHER_KIND };

/** Every kind, in the catalogue's order: FAMILIES's, then the works filed under none. */
export const KIND_ORDER: string[] = [...FAMILIES.map(([f]) => f), OTHER_KIND];

/** A collection named by what it is. */
const NAMED: [RegExp, string][] = [
  [/^(?:scholia on|anonymous commentar(?:y|ies) on|commentar(?:y|ies) on)\b/i, "Scholarship"],
  [/^letters? of\b/i, "Letters"],
];

/** The kind with the most works; a tie goes to the kind that comes first in the catalogue. */
function most(count: Map<string, number>): string | null {
  let best: string | null = null;
  for (const k of KIND_ORDER) if (count.has(k) && (best === null || count.get(k)! > count.get(best)!)) best = k;
  return best;
}

/** The kind an author's unclassified works are filed under, or null. */
export function usualKind(a: CatAuthor, meta: Record<string, WorkMeta>, who: AuthorMeta | undefined): string | null {
  const count = new Map<string, number>();
  for (const w of a.works) { const f = familyOf(meta[w.id]?.genre ?? null); if (f) count.set(f, (count.get(f) ?? 0) + 1); }
  if (count.size) return most(count);
  const named = NAMED.find(([re]) => re.test(a.name));
  if (named) return named[1];
  const occ = new Set((who?.occ ?? []).map((o) => o.toLowerCase()));
  return KINDS.find(([, , os]) => os.some((o) => occ.has(o)))?.[0] ?? null;
}

/** Each work's kind, by its id. */
export function workKinds(authors: CatAuthor[], meta: Record<string, WorkMeta>, who: Record<string, AuthorMeta>): Map<string, string> {
  const out = new Map<string, string>();
  for (const a of authors) {
    let usual: string | null | undefined;
    for (const w of a.works) {
      const f = familyOf(meta[w.id]?.genre ?? null);
      if (f) { out.set(w.id, f); continue; }
      if (usual === undefined) usual = usualKind(a, meta, who[a.id]);
      out.set(w.id, usual ?? OTHER_KIND);
    }
  }
  return out;
}

/** The kind an author's own row stands for when they are listed once (A to Z): their usual kind. */
export function authorKind(a: CatAuthor, kinds: Map<string, string>): string {
  const count = new Map<string, number>();
  for (const w of a.works) { const k = kinds.get(w.id) ?? OTHER_KIND; count.set(k, (count.get(k) ?? 0) + 1); }
  return most(count) ?? OTHER_KIND;
}

/** The address of a kind's part of the list: "Lyric and elegy" is "lyric-and-elegy". */
export const kindKey = (k: string) => k.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
