/**
 * Citations for what a reader collects: a passage of a work, in a given edition. Three styles:
 * - classical, as classicists cite (the abbreviations of the Liddell–Scott–Jones lexicon where it has one:
 *   "A. Ag. 87"; otherwise author, title and reference);
 * - Chicago-style and MLA-style notes, naming the edition as its own TEI file describes it (never
 *   invented), the collection it comes from, its CTS URN (the standard address of the passage) and a link.
 */
import type { CatalogIndex } from "@/lib/catalog";
import { COLLECTIONS } from "@/config/sources";

export type CiteStyle = "classical" | "chicago" | "mla";
export const CITE_STYLES: { id: CiteStyle; label: string }[] = [
  { id: "classical", label: "Classical (A. Ag. 87)" }, { id: "chicago", label: "Chicago-style note" }, { id: "mla", label: "MLA-style" },
];

/** What a citation is made from: a work, an edition (its CTS URN) and a passage, from one reference to another. */
export interface Citable { work: string; urn: string; from: string; to?: string }

/** The abbreviations file (data/abbrev.json): key → [abbreviation, work, how often LSJ uses it]. */
export type Abbrev = Record<string, [string, string, number]>;
const bestCache = new WeakMap<Abbrev, Map<string, string>>();
/** A work's commonest LSJ abbreviation, if it has one. */
export function abbrevOf(abbrevs: Abbrev | null, work: string): string | null {
  if (!abbrevs) return null;
  let m = bestCache.get(abbrevs);
  if (!m) {
    const best = new Map<string, [string, number]>();
    for (const [ab, w, n] of Object.values(abbrevs)) {
      // only a plain abbreviation of the work, not one carrying a passage ("Arist. Metaph. 1022b")
      if (/\d/.test(ab)) continue;
      const cur = best.get(w);
      if (!cur || n > cur[1]) best.set(w, [ab, n]);
    }
    m = new Map([...best].map(([w, [ab]]) => [w, ab]));
    bestCache.set(abbrevs, m);
  }
  return m.get(work) ?? null;
}

/** "1.1–7" for 1.1 to 1.7; "87–106"; "1.1" for one passage. */
export function rangeOf(from: string, to?: string): string {
  if (!to || to === from) return from;
  const a = from.split("."), b = to.split(".");
  let i = 0;
  while (i < a.length - 1 && a[i] === b[i]) i++;
  return `${from}–${b.slice(i).join(".")}`;
}

/** The passage's CTS URN: urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1-1.7 */
export const ctsOf = (c: Citable) => `${c.urn}:${c.from}${c.to && c.to !== c.from ? `-${c.to}` : ""}`;

export interface CiteParts { author: string; title: string; edition: string; collection: string; abbrev: string | null }
export function partsOf(idx: CatalogIndex, c: Citable, abbrevs: Abbrev | null): CiteParts {
  const t = idx.text.get(c.urn);
  return {
    author: idx.authorOf.get(c.work)?.name ?? "",
    title: idx.work.get(c.work)?.title ?? c.work,
    edition: (t as { desc?: string } | undefined)?.desc?.trim() ?? "",
    collection: COLLECTIONS.find((x) => x.id === t?.col)?.name ?? "",
    abbrev: abbrevOf(abbrevs, c.work),
  };
}

const date = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const withStop = (s: string) => (s && !/[.!?]$/.test(s) ? `${s}.` : s);

/**
 * A citation as text, with *asterisks* round the title (Markdown italics; exportHtml turns them into <i>).
 * `link` is the passage's address on this site.
 */
export function cite(idx: CatalogIndex, c: Citable, style: CiteStyle, abbrevs: Abbrev | null, link: string, accessed = new Date()): string {
  const p = partsOf(idx, c, abbrevs), where = rangeOf(c.from, c.to);
  if (style === "classical") return p.abbrev ? `${p.abbrev} ${where}` : `${p.author}, *${p.title}* ${where}`;
  const ed = p.edition ? ` ${withStop(p.edition)}` : "";
  if (style === "chicago") {
    return `${p.author}, *${p.title}* ${where}.${ed}${p.collection ? ` ${p.collection},` : ""} ${ctsOf(c)}, ${link} (accessed ${date(accessed)}).`;
  }
  return `${withStop(p.author)} *${p.title}*, ${where}.${ed}${p.collection ? ` *${p.collection}*,` : ""} ${link}. Accessed ${date(accessed)}.`;
}
