import { describe, expect, it } from "vitest";
import { afterPop, stepOf, stepsToTake } from "./useBackSteps";

// The phone's back gesture steps back through the look-up (the quiet desk, back routes, the owner, 2026-10-29): the pure rules
// that keep the browser's history level with how deep the look-up is. (The browser side is checked by scripts/check-lookup.mjs.)
describe("the look-up's steps in the history", () => {
  it("adds a step for each layer opened, and none while going from word to word", () => {
    expect(stepsToTake(1, 0)).toEqual({ add: 1, back: 0 });
    expect(stepsToTake(2, 1)).toEqual({ add: 1, back: 0 });
    expect(stepsToTake(2, 0)).toEqual({ add: 2, back: 0 });
    expect(stepsToTake(1, 1)).toEqual({ add: 0, back: 0 });
  });
  it("steps back over every step added when the look-up is closed any other way", () => {
    expect(stepsToTake(0, 1)).toEqual({ add: 0, back: 1 });
    expect(stepsToTake(0, 2)).toEqual({ add: 0, back: 2 });
    expect(stepsToTake(1, 2)).toEqual({ add: 0, back: 1 });
  });
  it("reads our mark in a history entry's state, and nothing else", () => {
    expect(stepOf({ lookupStep: 2, __NA: true })).toBe(2);
    expect(stepOf({ __NA: true })).toBe(0);
    expect(stepOf(null)).toBe(0);
    expect(stepOf("lookupStep")).toBe(0);
    expect(stepOf({ lookupStep: 0 })).toBe(0);
    expect(stepOf({ lookupStep: "1" })).toBe(0);
    expect(stepOf({ lookupStep: 1.5 })).toBe(0);
  });
  it("tells the browser's Back from our own step back and from Forward", () => {
    expect(afterPop(1, 2)).toBe("back");
    expect(afterPop(0, 1)).toBe("back");
    expect(afterPop(1, 1)).toBe("same");
    expect(afterPop(1, 0)).toBe("forward");
  });
});
