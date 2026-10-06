import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { indexCatalog, type Catalog } from "./catalog";
import type { Abbrev } from "./cite";
import { citationsOnly, editionsCited, linkOf, toHtml, toMarkdown, toSheet, type ExportCtx } from "./notebook-export";
import type { Notebook } from "./notebooks";

const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);
const abbrevs = JSON.parse(readFileSync("public/data/abbrev.json", "utf8")) as Abbrev;
const nb: Notebook = {
  id: "nb-1", title: "Wrath & <justice>", created: 0, updated: 0,
  items: [
    { id: "a", added: 0, kind: "passage", work: "tlg0012.tlg001", urn: "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2", from: "1.1", to: "1.7",
      grc: "μῆνιν ἄειδε θεὰ", tr: "The wrath sing, goddess", note: "The first word." },
    { id: "b", added: 0, kind: "text", text: "A thought of my own." },
    { id: "c", added: 0, kind: "variant", work: "tlg0085.tlg005", urn: "urn:cts:greekLit:tlg0085.tlg005.perseus-grc2", other: "urn:cts:greekLit:tlg0085.tlg005.1st1K-grc1", from: "87", a: "πειθοῖ", b: "πευθοῖ" },
    { id: "d", added: 0, kind: "line", work: "tlg0059.tlg034", urn: "urn:cts:greekLit:tlg0059.tlg034.perseus-grc2", from: "10.887", lang: "grc", left: "θεοί τʼ εἰσὶν", match: "δίκην", right: "τιμῶντες", grammar: "noun, accusative singular feminine" },
  ],
};
const c: ExportCtx = { idx, abbrevs, style: "classical", origin: "https://mathesisstoicheion.com", now: new Date("2026-10-06T12:00:00Z") };

describe("a notebook written out", () => {
  it("cites each thing, and links it to its place in the reader", () => {
    expect(citationsOnly(nb, c).split("\n")).toEqual(["Il. 1.1–7", "A. Ag. 87", "Pl. Lg. 10.887"]);
    expect(linkOf(nb.items[2], c.origin)).toBe("https://mathesisstoicheion.com/read?w=tlg0085.tlg005&ed=perseus-grc2&at=87&cmp=1st1K-grc1");
  });
  it("as Markdown, with the readings of both editions and the editions cited", () => {
    const md = toMarkdown(nb, c);
    expect(md).toContain("**Il. 1.1–7**");
    expect(md).toContain("> μῆνιν ἄειδε θεὰ");
    expect(md).toContain("A thought of my own.");
    expect(md).toMatch(/πειθοῖ \(Smyth, 1926[^)]*\) \] πευθοῖ \(Sidgwick, 1902/);
    expect(md).toContain("## Editions cited");
    expect(editionsCited(nb, idx)).toHaveLength(4);
  });
  it("as a document, escaped, and as a spreadsheet", () => {
    const html = toHtml(nb, c);
    expect(html).toContain("<title>Wrath &amp; &lt;justice&gt;</title>");
    expect(html).toContain('<blockquote lang="grc">μῆνιν ἄειδε θεὰ</blockquote>');
    const csv = toSheet(nb, c);
    expect(csv).toContain("Difference between editions,A. Ag. 87,πειθοῖ ] πευθοῖ");
  });
});
