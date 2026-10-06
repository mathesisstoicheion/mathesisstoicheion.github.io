import { describe, expect, it } from "vitest";
import { englishSnippet, englishSource, findInText, greekIndex, pieceText } from "./find";
import type { TeiDoc } from "./tei/types";
import type { Placed } from "./tei/align";

const line = (n: string, text: string) => ({ ref: ["1", n], blocks: [{ t: "l" as const, n, c: [text] }] });
const doc: TeiDoc = {
  lang: "grc", levels: ["book", "line"],
  units: [
    line("1", "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"),
    line("2", "οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε,"),
    line("3", "πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν"),
    line("4", "ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν"),
  ],
  chunks: [{ label: "Book 1", first: 0, last: 3 }],
};
const placed: Placed[] = [
  { at: 0, src: 0, blocks: [{ t: "p", c: ["Sing, goddess, the wrath of Achilles, Peleus’ son, the ruinous wrath"] }] },
  { at: 2, src: 1, blocks: [{ t: "p", c: ["that sent many brave souls of heroes to Hades"] }] },
];
const idx = greekIndex(doc);

describe("findInText", () => {
  it("finds a Greek word whatever its accents, typed in Greek, Latin letters or Beta Code", () => {
    for (const q of ["μηνιν", "μῆνιν", "mēnin", "menin", "mh=nin"]) {
      const r = findInText(doc, idx, null, q);
      expect(r.grc.map((h) => h.words)).toEqual([[{ unit: 0, i: 0 }]]);
    }
  });
  it("finds a phrase, also across the end of a line", () => {
    expect(findInText(doc, idx, null, "θεὰ Πηληϊάδεω").grc).toHaveLength(1);
    const across = findInText(doc, idx, null, "Ἀχιλῆος οὐλομένην").grc;
    expect(across).toHaveLength(1);
    expect(across[0].words).toEqual([{ unit: 0, i: 4 }, { unit: 1, i: 0 }]);
    expect(findInText(doc, idx, null, "θεὰ Ἀχιλῆος").grc).toHaveLength(0);
  });
  it("understands wildcards", () => {
    expect(findInText(doc, idx, null, "αχ*").grc.map((h) => h.unit)).toEqual([0, 1]);
    expect(findInText(doc, idx, null, "ψυχ?ς").grc).toHaveLength(1);
  });
  it("looks for Latin letters in the translation as whole words, and for phrases", () => {
    const r = findInText(doc, idx, placed, "wrath");
    expect(r.eng.map((h) => h.unit)).toEqual([0, 0]);
    expect(findInText(doc, idx, placed, "goddess the wrath").eng).toHaveLength(1);
    expect(findInText(doc, idx, placed, "hero").eng).toHaveLength(0);
    expect(findInText(doc, idx, placed, "hero*").eng.map((h) => h.unit)).toEqual([2]);
    expect(findInText(doc, idx, placed, "Peleus’ son").eng).toHaveLength(1);
  });
  it("does not look for Greek letters in the translation", () => {
    expect(findInText(doc, idx, placed, "ψυχὰς").eng).toHaveLength(0);
  });
  it("says why a search cannot be made", () => {
    expect(findInText(doc, idx, null, "*ος").error).toMatch(/Start with a letter/);
    expect(findInText(doc, idx, null, "  ").grc).toHaveLength(0);
  });
});

describe("englishSnippet", () => {
  it("shows the words either side of the match", () => {
    const text = pieceText(placed[0]);
    const h = findInText(doc, idx, placed, "Achilles").eng[0];
    const s = englishSnippet(text, h, 12);
    expect(s.hit).toBe("Achilles");
    expect(s.before.endsWith("of ")).toBe(true);
    expect(s.after.startsWith(",")).toBe(true);
  });
  it("needs a letter to search the translation", () => {
    expect(englishSource("*")).toBeNull();
    expect(englishSource("12")).toBeNull();
  });
});
