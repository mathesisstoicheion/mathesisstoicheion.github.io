import { describe, expect, it } from "vitest";
import { VERSE_FLOOR, verseSize, verseSizeWhere } from "./verseFit";

// The quiet desk, ticket 10: a page set in verse keeps the reader's size where its widest line stands whole, is made smaller only as far as that
// line needs, and never goes below 16 px; a line that still does not fit wraps (the hanging indent is in the stylesheet, and is checked on the
// built site by scripts/check-reader.mjs, "verse fit").
//
// The numbers are measured, not made up. Chromium, Gentium Book Plus, the build of 2026-10-30: Iliad 1 has 611 lines. At 20 px its widest lines
// are 456, 454 and 452 px (canvas measureText); the median is 381 px, 90% are under 416 px and 99% under 447 px (Odyssey 1 and Iliad 6 are the same
// within a few px). The room a line's words had then: 323 px at 390 px wide, 509 px at 1100, 666 px at 1280 and 712 px at 1440. After this ticket's
// phone layout (side gutters of 12 px, a narrower column for the numbers) the room at 390 px is 342 px, and 364 px at 412 (the same check measures and prints
// them). On a computer the column of line numbers is 2.4 em wide, so the room is not a fixed number: it is 557 px less 2.4 times the size at 1100 px (509 px at
// 20 px, 495 px at 26 px, 504 px at 22 px), and 760 px less 2.4 times the size at 1440 px.
const WIDEST_AT_20 = 456;
const widest = (px: number) => (WIDEST_AT_20 * px) / 20;   // a line's width grows in step with the size
const LINES_AT_20 = [456, 454, 452, 447, 416, 381];       // the widest three, the 99th and 90th percentile, and the median

describe("the Greek's size for a page of verse", () => {
  it("is never below 16 px", () => {
    expect(VERSE_FLOOR).toBe(16);
    for (const reader of [16, 18, 22, 26, 32]) {
      for (const room of [1, 50, 100, 200, 342, 509, 666, 712, 5000]) {
        const size = verseSize(reader, widest(reader), room);
        expect(size, `reader's size ${reader}, room ${room}`).toBeGreaterThanOrEqual(VERSE_FLOOR);
        expect(size, `reader's size ${reader}, room ${room}`).toBeLessThanOrEqual(reader);
      }
    }
  });

  it("stays the reader's size where the widest line fits: 26 px at 1440 (room 712) and at 1280 (room 666)", () => {
    expect(verseSize(26, widest(26), 712)).toBe(26);
    expect(verseSize(26, widest(26), 666)).toBe(26);
  });

  it("is made smaller only as far as the widest line needs: at most 22.3 px at 1100 (room 509, reader's size 26), and the widest line fits", () => {
    const size = verseSize(26, widest(26), 509);
    expect(size).toBeLessThanOrEqual(22.3);
    expect(size).toBeGreaterThan(22);   // not smaller than it need be (the line has only a hair to spare)
    expect(widest(size)).toBeLessThanOrEqual(509);
  });

  it("is 16 px at 390 (room 342, reader's size 18), and the lines wider than the room at 16 px are the ones that will wrap", () => {
    expect(verseSize(18, widest(18), 342)).toBe(16);
    const wrap = LINES_AT_20.filter((w) => (w * 16) / 20 > 342);
    expect(wrap).toEqual([456, 454, 452, 447]);   // the 90th percentile line and the median stand whole at 16 px
    // and the page's widest line is the first of them: nothing narrower is made to wrap by it
    expect(Math.max(...wrap)).toBe(WIDEST_AT_20);
  });

  it("is still 16 px with a room of 100 px, or none: the floor wins over wholeness", () => {
    expect(verseSize(18, widest(18), 100)).toBe(16);
    expect(verseSize(26, widest(26), 100)).toBe(16);
    expect(verseSize(26, widest(26), 1)).toBe(16);
  });

  it("grows with the room, never shrinks as the room grows", () => {
    let last = 0;
    for (let room = 100; room <= 800; room += 20) {
      const size = verseSize(26, widest(26), room);
      expect(size).toBeGreaterThanOrEqual(last);
      last = size;
    }
    expect(last).toBe(26);
  });

  it("leaves a hair of room over, so that a measure a pixel out does not break the widest line", () => {
    // a line exactly as wide as its room is made a little smaller, not left to break on a rounding
    expect(verseSize(26, 509, 509)).toBeLessThan(26);
    const used = widest(verseSize(26, widest(26), 509)) / 509;
    expect(used).toBeLessThan(1);
    expect(used).toBeGreaterThan(0.99);   // a hair, not a gap: the page keeps all the size it can
  });

  it("does not make a reader's size under the floor any bigger", () => {
    // a browser set to small type: the reader's size can be under 16 px, and verse is never enlarged
    expect(verseSize(14, widest(14), 100)).toBe(14);
    expect(verseSize(14, widest(14), 1000)).toBe(14);
  });

  it("keeps the reader's size when nothing was measured (no lines drawn, no room)", () => {
    expect(verseSize(26, 0, 509)).toBe(26);
    expect(verseSize(26, 456, 0)).toBe(26);
    expect(verseSize(26, Number.NaN, 509)).toBe(26);
  });
});

describe("the Greek's size where the room depends on the size", () => {
  // a computer: the words' room is the width of the line less its column of line numbers, 2.4 em wide, so a smaller size leaves them more
  const room = (across: number) => (px: number) => across - 2.4 * px;
  const fits = (px: number, across: number) => widest(px) <= room(across)(px);

  it("is 22 px or a little more at 1100 (the line is 557 px across), not the 21.5 px that the room at 26 px alone gives", () => {
    const size = verseSizeWhere(26, widest(26), room(557));
    expect(size).toBeGreaterThanOrEqual(22);
    expect(size).toBeLessThanOrEqual(22.3);
    expect(verseSize(26, widest(26), room(557)(26))).toBeLessThan(21.7);   // read at 26 px alone, it would stop short
    expect(fits(size, 557)).toBe(true);
    expect(fits(size + 0.3, 557)).toBe(false);   // and it is as big as it can be, to within a third of a px
  });

  it("stays 26 px at 1440 and 1280, where the widest line already stands whole", () => {
    expect(verseSizeWhere(26, widest(26), room(760))).toBe(26);
    expect(verseSizeWhere(26, widest(26), room(760 - 46))).toBe(26);   // 1280 px
  });

  it("is the same as the plain size where the room does not depend on it: a phone", () => {
    expect(verseSizeWhere(18, widest(18), () => 342)).toBe(16);
    expect(verseSizeWhere(18, widest(18), () => 364)).toBe(16);
    expect(verseSizeWhere(18, widest(18), () => 460)).toBeCloseTo(verseSize(18, widest(18), 460), 6);
  });

  it("always leaves the widest line whole where it can, whatever the width of the window, and never goes below 16 px", () => {
    for (let across = 300; across <= 900; across += 25) {
      const size = verseSizeWhere(26, widest(26), room(across));
      expect(size, `across ${across}`).toBeGreaterThanOrEqual(VERSE_FLOOR);
      expect(size, `across ${across}`).toBeLessThanOrEqual(26);
      if (size > VERSE_FLOOR) expect(fits(size, across), `across ${across}, size ${size}`).toBe(true);
    }
  });

  it("still leaves the widest line whole where the room changes steeply with the size", () => {
    // (a column of 14 em: the sizes found alternate around the right one and settle slowly, and the one kept is on the side where the line fits)
    for (const across of [700, 760, 820]) {
      const room = (px: number) => across - 14 * px;
      const size = verseSizeWhere(26, widest(26), room);
      expect(size, `across ${across}`).toBeGreaterThan(VERSE_FLOOR);
      expect(widest(size), `across ${across}, size ${size}`).toBeLessThanOrEqual(room(size));
    }
  });

  it("keeps the reader's size when nothing was measured", () => {
    expect(verseSizeWhere(26, widest(26), () => 0)).toBe(26);
    expect(verseSizeWhere(26, 0, () => 509)).toBe(26);
  });
});

