/**
 * Dates in the site's one convention, BC and AD (review fix list, slice 6). Wikidata's descriptions and the museums' captions
 * come in their own words, some with BCE and CE; the data files keep those words as they were fetched, and the site shows
 * them in its own (checked by scripts/check-eras.mjs and scripts/check-library.mjs).
 */

/** "c. 20 BCE-c. 50 CE" → "c. 20 BC – c. AD 50"; "2nd century CE" → "2nd century AD"; "ca. 14–68 CE" → "ca. AD 14–68" */
export function bcAd(s: string): string {
  return s
    .replace(/\bBCE\b/g, "BC")
    // a year or a span of years before CE: AD goes in front of it
    .replace(/(\d+(?:\/\d+)?(?:\s?[–-]\s?\d+(?:\/\d+)?)?)\s?CE\b/g, (_, y: string) => `AD ${y}`)
    // a century, or "BC and CE"
    .replace(/(centur(?:y|ies)|millennium|BC and)\s?CE\b/g, "$1 AD")
    // a span from BC into AD reads with spaces round its dash: "27 BC – AD 68"
    .replace(/BC\s?[–-]\s?(c\.\s?|ca\.\s?)?AD/g, (_, c = "") => `BC – ${c}AD`);
}

const ORD = String.raw`\d{1,2}(?:st|nd|rd|th)`;
/** "4th-century BC", "late 2nd/early 3rd century", "5th c. BC", "1st centuries BC and AD" */
const CENTURY = new RegExp(String.raw`\b(?:(?:late|early|mid)[\s-]+)?${ORD}(?:\s*(?:[/–-]|or|and)\s*(?:(?:late|early|mid)[\s-]+)?${ORD})*[\s-]+(?:century|centuries|c\.)(?:\s+(?:BC|AD)(?:\s+and\s+(?:BC|AD))?)?`, "gi");

/**
 * A description without the dates in it, for a place that shows the date beside it: "4th-century BC Greek orator" → "Greek
 * orator", "Greek rhetorician and writer (436–338 BC)" → "Greek rhetorician and writer", "King of Macedon from 359 to 336
 * BC" → "King of Macedon". Undefined when nothing is left.
 */
export function undated(s: string | undefined): string | undefined {
  if (!s) return undefined;
  const out = bcAd(s)
    .replace(/\s*\([^()]*\d[^()]*\)/g, "")                              // (384–322 BC), (died c. 374), (fl. 300 BC)
    .replace(CENTURY, " ")
    .replace(/\s+from\s+(?:c\.\s?)?\d+\s+to\s+(?:c\.\s?)?\d+(?:\s+(?:BC|AD))?/g, "")   // from 359 to 336 BC
    .replace(/\s+(?:composed\s+)?between\s+(?:c\.\s?)?(?:AD\s)?\d+(?:\s(?:BC|AD))?\s+and\s+(?:c\.\s?)?(?:AD\s)?\d+(?:\s(?:BC|AD))?/g, "")   // composed between c. 800 BC and c. AD 500
    .replace(/,\s*(?:c\.\s?)?\d{2,4}\s*[–-].*$/, "")                     // , c. 260–c. 339
    .replace(/\s+/g, " ")
    .replace(/(?:[\s,/]+|\s+(?:of|from)(?:\s+the)?)+$/i, "")
    .replace(/^[\s,/]+/, "")
    .trim();
  return out || undefined;
}
