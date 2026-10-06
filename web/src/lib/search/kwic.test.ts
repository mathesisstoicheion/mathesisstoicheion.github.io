import { describe, expect, it } from "vitest";
import { kwic, toCsv } from "./kwic";
import { nearFilter } from "./run";
import type { TeiDoc } from "@/lib/tei/types";

const line = (n: string, text: string) => ({ ref: ["1", n], blocks: [{ t: "l" as const, n, c: [text] }] });
const doc: TeiDoc = {
  lang: "grc", levels: ["book", "line"],
  units: [
    line("1", "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"),
    line("2", "οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε,"),
    line("3", "πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν"),
  ],
  chunks: [{ label: "Book 1", first: 0, last: 2 }],
};
const join = (bs: { t: string }[]) => bs.map((b) => b.t).join("");

describe("kwic", () => {
  it("gives the words before and after, running on into the lines either side", () => {
    const k = kwic(doc, 1, [0], "grc", 4)!;
    expect(k.key).toBe("οὐλομένην");
    expect(join(k.left)).toBe("ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος /");
    expect(join(k.right)).toBe(", ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽");
    expect(k.leftSort).toBe("αχιληοσ");   // (search keys write every sigma as σ)
    expect(k.rightSort).toBe("η");
  });
  it("takes a phrase as one match, and marks the other word of a near search", () => {
    const k = kwic(doc, 0, [1, 2], "grc", 3, [4])!;
    expect(k.key).toBe("ἄειδε θεὰ");
    expect(k.right.find((b) => b.near)?.t).toBe("Ἀχιλῆος");
    expect(k.keySort).toBe("αειδε θεα");
  });
  it("stops at the start of the text", () => {
    expect(join(kwic(doc, 0, [0], "grc", 5)!.left)).toBe("");
  });
});

describe("nearFilter", () => {
  const hits = [{ text: 1, unit: 5, words: [3] }, { text: 1, unit: 9, words: [0] }, { text: 2, unit: 5, words: [3] }];
  const others = [{ text: 1, unit: 5, word: 10 }, { text: 1, unit: 5, word: 6 }, { text: 1, unit: 10, word: 2 }];
  it("keeps a match with the other word within so many words, marking the nearest", () => {
    expect(nearFilter(hits, others, 3)).toEqual([{ text: 1, unit: 5, words: [3], near: [6] }]);
    expect(nearFilter(hits, others, 2)).toEqual([]);
  });
  it("in the same passage, or the passages either side", () => {
    expect(nearFilter(hits, others, "p").map((h) => h.unit)).toEqual([5]);
    expect(nearFilter(hits, others, "pp").map((h) => h.unit)).toEqual([5, 9]);
  });
});

describe("toCsv", () => {
  it("quotes what needs quoting, and defuses formulas", () => {
    const csv = toCsv([["a", 'say "hi"', "x,y"], ["=1+1", 2, "ἄνδρα"]]);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv.slice(1)).toBe('a,"say ""hi""","x,y"\r\n"\'=1+1",2,ἄνδρα\r\n');
  });
});
