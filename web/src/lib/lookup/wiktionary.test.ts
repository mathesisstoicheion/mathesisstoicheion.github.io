/**
 * The look-up's Wiktionary part, on what Wiktionary really sends (fixtures/wiktionary-sample.json: the definition API's
 * Ancient Greek entries for about a hundred words, fetched by scripts/fetch-wiktionary-sample.mjs; the entries are English
 * Wiktionary's, CC BY-SA 4.0). The owner's phone,
 * 2026-11-08: διά showed Wiktionary's style sheet as words (".mw-parser-output .object-usage-tag{font-style:italic}…"), and
 * its senses as one flat run of lines, "[with genitive]" and "[with accusative]" lost among them, some lines twice.
 */
import { describe, expect, it } from "vitest";
import sample from "./fixtures/wiktionary-sample.json";
import { linesOf, parseHtml, sensesFromApi, sensesOf, tidy, type WiktItem, type WiktSense } from "./wiktionary";

type Api = Parameters<typeof sensesFromApi>[0];
const words = Object.entries(sample as Record<string, Api | { status: number }>).filter(([, v]) => !("status" in v)) as [string, Api][];

/** What a reader would see that is not reading matter: code, tags, entities, stray spaces. */
function oddities(text: string): string[] {
  const out: string[] = [];
  if (/\{\{|\}\}/.test(text)) out.push("template braces");
  if (/^\[[^\]]*\]$/.test(text)) out.push("a bare heading");
  if (/mw-parser-output|\{[^{}]*:[^{}]*\}|\.[a-z-]+\{/.test(text)) out.push("style code");
  if (/<\/?[a-z][^>]*>/i.test(text)) out.push("an HTML tag");
  if (/&(#\d+|#x[0-9a-f]+|[a-z]+);/i.test(text)) out.push("an HTML entity");
  if (/\[\d+\]|\[edit\]|\bcite_note\b/.test(text)) out.push("a footnote mark");
  if (text !== text.trim() || /\s{2,}| [,.;:)]|\( /.test(text)) out.push("stray spaces");
  if (/^[,;:.]/.test(text)) out.push("a line that starts with punctuation");
  return out;
}

const walk = (items: WiktItem[], f: (it: WiktItem, depth: number) => void, depth = 0) =>
  items.forEach((it) => { f(it, depth); walk(it.sub, f, depth + 1); });

describe("Wiktionary's senses, read from its HTML", () => {
  it("has a sample of real entries to check (at least 80 words with Ancient Greek senses)", () => {
    expect(words.filter(([, d]) => sensesFromApi(d).length).length).toBeGreaterThanOrEqual(80);
  });

  it("never shows style code, tags, entities, template braces, footnote marks, stray spaces or a heading with nothing under it, for any word in the sample", () => {
    const found: string[] = [];
    for (const [w, d] of words) for (const s of sensesFromApi(d)) walk(s.items, (it) => {
      for (const o of oddities(it.text)) if (!(o === "a bare heading" && it.sub.length)) found.push(`${w} (${s.pos}): ${o} in "${it.text.slice(0, 80)}"`);
    });
    expect(found).toEqual([]);
  });

  it("never shows a sense with no words and nothing under it", () => {
    const found: string[] = [];
    for (const [w, d] of words) for (const s of sensesFromApi(d)) walk(s.items, (it) => { if (!it.text && !it.sub.length) found.push(`${w} (${s.pos})`); });
    expect(found).toEqual([]);
  });

  it("shows a sub-sense once, under its sense, and not again on its own", () => {
    const found: string[] = [];
    for (const [w, d] of words) for (const s of sensesFromApi(d)) {
      // (a sense that heads others may share its words with one of them, as πρό's "before" heads "before" of time)
      const top = new Set(s.items.filter((it) => !it.sub.length).map((it) => it.text).filter(Boolean));
      walk(s.items, (it, depth) => { if (depth > 0 && it.text && top.has(it.text)) found.push(`${w} (${s.pos}): "${it.text}" both under a sense and on its own`); });
    }
    expect(found).toEqual([]);
  });

  it("keeps διά's senses as Wiktionary groups them: with the genitive, with the accusative, each group under its heading", () => {
    const [prep] = sensesFromApi((sample as unknown as Record<string, Api>)["διά"]) as WiktSense[];
    expect(prep.pos).toBe("Preposition");
    expect(prep.items.map((it) => it.text)).toEqual(["[with genitive]", "[with accusative]"]);
    const gen = prep.items[0];
    expect(gen.sub.length).toBeGreaterThanOrEqual(2);
    expect(linesOf(gen.sub)).toContain("in a line");
    expect(linesOf(prep.items[1].sub)).toContain("because of");
    expect(linesOf(prep.items).filter((l) => l === "in a line")).toHaveLength(1);
    expect(prep.lemma).toBeNull();   // "because of" is a meaning, not the word it is a form of
  });

  it("finds the word an inflected form belongs to (ἄειδε: ἀείδω)", () => {
    const senses = sensesFromApi((sample as unknown as Record<string, Api>)["ἄειδε"]);
    expect(senses.some((s) => s.lemma === "ἀείδω")).toBe(true);
  });
});

describe("the small HTML reader", () => {
  it("drops a style sheet, a script and a footnote mark, and keeps the words around them", () => {
    const html = '<style data-mw-deduplicate="x">.mw-parser-output .a{font-style:italic}</style>to <i>sing</i><sup class="reference">[1]</sup> &amp; <script>x()</script>praise';
    expect(sensesOf([html]).items).toEqual([{ text: "to sing & praise", sub: [] }]);
  });

  it("reads nested lists as senses under a sense, and an unclosed tag does not swallow the rest", () => {
    const html = "[with dative]\n<ol><li>beside<ol><li>at the side of</li></ol></li>\n<li>near <b>by</li></ol>";
    expect(sensesOf([html]).items).toEqual([{ text: "[with dative]", sub: [
      { text: "beside", sub: [{ text: "at the side of", sub: [] }] },
      { text: "near by", sub: [] },
    ] }]);
  });

  it("tidies spaces the tags leave", () => {
    expect(tidy(" through ( of place ) , by ")).toBe("through (of place), by");
    expect(parseHtml("a<br>b").kids).toHaveLength(3);
  });
});
