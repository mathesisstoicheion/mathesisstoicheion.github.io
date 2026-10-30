import { describe, expect, it } from "vitest";
import type { TeiDoc } from "@/lib/tei/types";
import { placeOf } from "./place";

// The quiet desk, ticket 09: what the foot bar's centre says ("Book 1 · line 25 of 611"). The pure rules; scripts/check-reader.mjs reads
// the real bar.
const unit = (...ref: string[]) => ({ ref, blocks: [] });
const doc = (levels: string[], refs: string[][], chunks: TeiDoc["chunks"]): TeiDoc => ({ lang: "grc", levels, units: refs.map((r) => unit(...r)), chunks });
const orderOf = (d: TeiDoc) => new Map(d.units.map((u, i) => [u.ref.join("."), i]));

describe("where the reader is, for the foot bar", () => {
  const lines = doc(["book", "line"], [["1", "1"], ["1", "2"], ["1", "3"], ["1", "4"], ["2", "1"], ["2", "2"]], [
    { label: "Book 1", first: 0, last: 3 }, { label: "Book 2", first: 4, last: 5 },
  ]);

  it("names the page, the kind of passage, its number and how many there are on the page", () => {
    expect(placeOf(lines, 0, "1.3", orderOf(lines))).toEqual({ part: "Book 1", level: "line", num: "3", of: 4, progress: 2 / 3 });
    expect(placeOf(lines, 1, "2.1", orderOf(lines))).toMatchObject({ part: "Book 2", num: "1", of: 2, progress: 0 });
  });

  it("starts at the page's first passage while the top of the screen is not known yet, or is not on this page", () => {
    expect(placeOf(lines, 0, null, orderOf(lines))).toMatchObject({ num: "1", progress: 0 });
    expect(placeOf(lines, 0, "2.2", orderOf(lines))).toMatchObject({ num: "4", progress: 1 });   // (kept inside the page)
    expect(placeOf(lines, 0, "9.9", orderOf(lines))).toMatchObject({ num: "1", progress: 0 });
  });

  it("says no total for sections cited with letters", () => {
    const plato = doc(["section"], [["327a"], ["327b"], ["327c"]], [{ label: "", first: 0, last: 2 }]);
    expect(placeOf(plato, 0, "327b", orderOf(plato))).toMatchObject({ level: "section", num: "327b", of: null, progress: 0.5 });
  });

  it("says no total when the numbers start again under a new chapter, or go back", () => {
    const chapters = doc(["book", "chapter", "section"], [["1", "1", "1"], ["1", "1", "2"], ["1", "2", "1"]], [{ label: "Book 1", first: 0, last: 2 }]);
    expect(placeOf(chapters, 0, "1.2.1", orderOf(chapters))).toMatchObject({ level: "section", num: "1", of: null });
    const back = doc(["line"], [["3"], ["2"]], [{ label: "", first: 0, last: 1 }]);
    expect(placeOf(back, 0, "2", orderOf(back))?.of).toBeNull();
  });

  it("never names a passage numbered 0 (Perseus's line 0 holds only the first speaker's name): it names the first numbered one", () => {
    const play = doc(["line"], [["0"], ["1"], ["2"], ["3"]], [{ label: "Lines 1–3", first: 0, last: 3 }]);
    expect(placeOf(play, 0, "0", orderOf(play))).toMatchObject({ num: "1", of: 3, progress: 1 / 3 });
    expect(placeOf(play, 0, null, orderOf(play))).toMatchObject({ num: "1" });
    expect(placeOf(play, 0, "2", orderOf(play))).toMatchObject({ num: "2" });
    // a page of nothing but a 0 has nothing else to name
    const alone = doc(["line"], [["0"]], [{ label: "", first: 0, last: 0 }]);
    expect(placeOf(alone, 0, "0", orderOf(alone))?.num).toBe("0");
  });

  it("copes with a page of one passage and with no such page", () => {
    const one = doc(["line"], [["7"]], [{ label: "", first: 0, last: 0 }]);
    expect(placeOf(one, 0, "7", orderOf(one))).toMatchObject({ num: "7", of: 7, progress: 0 });
    expect(placeOf(one, 3, "7", orderOf(one))).toBeNull();
  });
});
