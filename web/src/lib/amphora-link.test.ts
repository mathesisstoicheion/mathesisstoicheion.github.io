import { describe, expect, it } from "vitest";
import { DEFAULT_DESIGN, MAX_POINTS, type Design, type Stroke } from "./amphora";
import { decodeDesign, encodeDesign, fittingCode, simplify } from "./amphora-link";

const line = (n: number, c = 0, w = 9): Stroke => ({ c, w, p: Array.from({ length: n }, (_, i) => [100 + i * 3, 400 + i * 2, 118]).flat() });
const painted: Design = {
  ...DEFAULT_DESIGN, style: "red", neck: "ivy", frieze: "panels", words: ["ΚΑΛΟΣ", "ΝΟΑ"],
  strokes: [
    line(40),
    { c: -2, w: 20, h: "#1f6fb2", p: [2047, 0, 95, 2040, 3, 96, 2001, 30, 96] },
    { c: 1, w: 1.6, p: [10, 1023, 140, 12, 1020, 140] },
    { c: -1, w: 40, p: [500, 500, 100] },
  ],
  cracks: [{ x: 900, y: 610, f: 0.42, s: 2147483000 }],
};

describe("a pot packed into a link", () => {
  it("comes back exactly as it was painted", async () => {
    expect(await decodeDesign(await encodeDesign(painted))).toEqual(painted);
    expect(await decodeDesign(await encodeDesign(DEFAULT_DESIGN))).toEqual(DEFAULT_DESIGN);
  });

  it("uses only the letters a link can carry", async () => {
    expect(await encodeDesign(painted)).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("is short for a pot with a little brushwork", async () => {
    const d = { ...painted, strokes: Array.from({ length: 30 }, (_, i) => line(80, i % 5)) };
    expect((await encodeDesign(d)).length).toBeLessThan(4000);
  });

  it("refuses a damaged or cut-short link instead of drawing nonsense", async () => {
    const code = await encodeDesign(painted);
    expect(await decodeDesign("not a pot")).toBeNull();
    expect(await decodeDesign(code.slice(0, Math.floor(code.length / 2)))).toBeNull();
    expect(await decodeDesign("")).toBeNull();
  });

  it("refuses a link that claims more brushwork than a browser keeps", async () => {
    const huge = { ...DEFAULT_DESIGN, strokes: Array.from({ length: 4 }, () => line(MAX_POINTS / 3)) };
    expect(await decodeDesign(await encodeDesign(huge))).toBeNull();
  });
});

describe("fitting a pot into a link of a given length", () => {
  it("drops points that lie on the line between their neighbours, and keeps the ends and the corners", () => {
    const s = simplify({ ...DEFAULT_DESIGN, strokes: [line(50)] }, 1).strokes[0];
    expect(s.p).toEqual([100, 400, 118, 247, 498, 118]);
    const corner: Stroke = { c: 0, w: 9, p: [0, 0, 100, 50, 0, 100, 100, 0, 100, 100, 50, 100, 100, 100, 100] };
    expect(simplify({ ...DEFAULT_DESIGN, strokes: [corner] }, 1).strokes[0].p).toEqual([0, 0, 100, 100, 0, 100, 100, 100, 100]);
  });

  it("gives the exact pot when it fits, a simplified one when only that fits, and nothing when nothing does", async () => {
    // a scribble: every point off the line of its neighbours, so simplifying has something to drop
    const wobble: Stroke = { c: 0, w: 9, p: Array.from({ length: 3000 }, (_, i) => [200 + i % 1500, 300 + (i % 2), 110]).flat() };
    const d = { ...DEFAULT_DESIGN, strokes: [wobble] };
    const exact = await encodeDesign(d);
    expect(await fittingCode(d, exact.length)).toBe(exact);
    const smaller = await fittingCode(d, exact.length - 1);
    expect(smaller).not.toBeNull();
    expect(smaller!.length).toBeLessThan(exact.length);
    expect(await fittingCode(d, 10)).toBeNull();
  });
});
