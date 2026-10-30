import { describe, expect, it } from "vitest";
import { MAX_PLUCKS, decodeTune, encodeTune, type Tune } from "./tune-link";

const played: Tune = {
  song: "seikilos", tuning: "ancient",
  plucks: [{ t: 0, m: 64, s: 0.62 }, { t: 412, m: 66, s: 0.95 }, { t: 413, m: 69, s: 0.6 }, { t: 2050, m: 57, s: 0.18 }],
};

describe("a tune played on the lyre, packed into a link", () => {
  it("comes back as it was played: the lyre, every note, its time and how hard", async () => {
    expect(await decodeTune(await encodeTune(played))).toEqual(played);
    const free: Tune = { song: null, tuning: "modern", plucks: [{ t: 0, m: 60, s: 1 }] };
    expect(await decodeTune(await encodeTune(free))).toEqual(free);
  });

  it("is short: a minute of playing fits in a few hundred letters", async () => {
    const minute: Tune = { song: null, tuning: "ancient", plucks: Array.from({ length: 150 }, (_, i) => ({ t: i * 400, m: 57 + (i % 12), s: 0.6 })) };
    expect((await encodeTune(minute)).length).toBeLessThan(600);
    expect(await encodeTune(minute)).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("refuses a damaged link, and one that claims more than anyone plays", async () => {
    const code = await encodeTune(played);
    expect(await decodeTune(code.slice(0, 6))).toBeNull();
    expect(await decodeTune("nonsense!")).toBeNull();
    const endless: Tune = { song: null, tuning: "ancient", plucks: Array.from({ length: MAX_PLUCKS + 1 }, (_, i) => ({ t: i * 10, m: 60, s: 0.5 })) };
    expect(await decodeTune(await encodeTune(endless))).toBeNull();
  });

  it("refuses a lyre name that could be anything but a melody's", async () => {
    expect(await decodeTune(await encodeTune({ ...played, song: "../../etc" }))).toBeNull();
  });
});
