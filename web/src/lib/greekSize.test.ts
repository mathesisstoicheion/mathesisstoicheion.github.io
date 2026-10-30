import { describe, expect, it } from "vitest";
import { LIMITS } from "./settings";
import { snapRem, steppedSize } from "./greekSize";

// The quiet desk, ticket 10: the size buttons step from the size on the screen now, and the first step from "auto" saves a number.
// (The size on the screen is read from a probe in the page, shownGreekSize; it is read in a browser by scripts/check-reader.mjs and e2e/phone-reader.spec.ts.)
const { min, max, step } = LIMITS.greekSize;

describe("a size from the page's own measure", () => {
  it("is put on the step's grid, a whole number of px at 16 px to the rem", () => {
    expect(snapRem(26 / 16)).toBe(1.625);       // a computer: 26 px
    expect(snapRem(18.007 / 16)).toBe(1.125);   // a phone, 390 px wide: the size that suits it is 18.007 px
    expect(snapRem(18.256 / 16)).toBe(1.125);   // 412 px wide
    expect(snapRem(22.19 / 16)).toBe(1.375);    // a tablet
  });
});

describe("the size one step on", () => {
  it("starts from the size the reader chose", () => {
    expect(steppedSize(1.5, 99, 1)).toBe(1.5 + step);
    expect(steppedSize(1.5, 99, -1)).toBe(1.5 - step);
    expect(steppedSize(1.5, 99, 1, 2)).toBe(1.5 + 2 * step);
  });
  it("starts from the size shown now when the size is auto, and gives a number: 26 px on a computer goes to 27 or 25", () => {
    expect(steppedSize("auto", 26 / 16, 1)).toBe(27 / 16);
    expect(steppedSize("auto", 26 / 16, -1)).toBe(25 / 16);
    expect(steppedSize("auto", 18.007 / 16, 1)).toBe(19 / 16);   // 18 px on a phone to 19, not to some other size
    expect(steppedSize("auto", 18.007 / 16, -1, 2)).toBe(16 / 16);   // the search's "smaller" steps two
  });
  it("stays inside the limits", () => {
    expect(steppedSize(max, 99, 1)).toBe(max);
    expect(steppedSize(min, 99, -1)).toBe(min);
    expect(steppedSize("auto", max, 1)).toBe(max);
    expect(steppedSize("auto", min, -1, 2)).toBe(min);
    expect(steppedSize("auto", 1000, -1)).toBe(max);   // a size beyond the limits is brought inside them
  });
});
