import { describe, expect, it } from "vitest";
import { cleanDesign, DEFAULT_DESIGN, toGreekCaps } from "./amphora";

describe("toGreekCaps", () => {
  it("turns English letters into Greek capitals, two-letter sounds included", () => {
    expect(toGreekCaps("sophia")).toBe("ΣΟΦΙΑ");
    expect(toGreekCaps("Theo")).toBe("ΘΕΟ");
    expect(toGreekCaps("Achilles")).toBe("ΑΧΙΛΛΕΣ");
    expect(toGreekCaps("psyche")).toBe("ΨΥΧΕ");
    expect(toGreekCaps("Alex")).toBe("ΑΛΕΞ");
    expect(toGreekCaps("Hēra")).toBe("ΗΡΑ");
  });
  it("finishes a two-letter sound whose first letter was already turned into Greek while typing", () => {
    expect(toGreekCaps("Τh")).toBe("Θ");
    expect(toGreekCaps("ΣΟΠh")).toBe("ΣΟΦ");
    expect(toGreekCaps("Πs")).toBe("Ψ");
  });
  it("keeps Greek typed directly, as capitals without accents or breathings", () => {
    expect(toGreekCaps("Ἀθηνᾶ")).toBe("ΑΘΗΝΑ");
    expect(toGreekCaps("ΜΑΘΗΣΙΣ")).toBe("ΜΑΘΗΣΙΣ");
  });
  it("is kept short enough to fit a panel", () => {
    expect(toGreekCaps("a".repeat(40))).toHaveLength(14);
  });
});

describe("cleanDesign", () => {
  it("keeps a good design and repairs a damaged one", () => {
    expect(cleanDesign(DEFAULT_DESIGN)).toEqual(DEFAULT_DESIGN);
    const d = cleanDesign({ v: 1, neck: "lasers", words: ["sophia", 3], strokes: [{ c: 0, w: 5, p: [1, 2, 100] }, { c: 99, w: 5, p: [] }, "x"] });
    expect(d?.neck).toBe(DEFAULT_DESIGN.neck);
    expect(d?.words).toEqual(["ΣΟΦΙΑ", ""]);
    expect(d?.strokes).toEqual([{ c: 0, w: 5, p: [1, 2, 100] }]);
    expect(cleanDesign({ v: 2 })).toBeNull();
    expect(cleanDesign("nonsense")).toBeNull();
  });
});
