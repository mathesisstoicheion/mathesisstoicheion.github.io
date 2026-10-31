import { describe, expect, it } from "vitest";
import { afterBack, afterPop, afterSteps, leaveBy, stackOf, stepOf, stepsToTake, type Layer } from "./useBackSteps";

// The phone's back gesture closes what is open over the text, newest first (the quiet desk, ticket 11, the owner, 2026-10-30; the look-up alone
// had steps before: back routes, 2026-10-29): the pure rules that keep the browser's history level with how many layers are open and say what
// Back should close. (The browser side is checked by scripts/check-lookup.mjs and the "back" part of scripts/check-reader.mjs.)
describe("the layers' steps in the history", () => {
  it("adds a step for each layer opened, and none while going from word to word", () => {
    expect(stepsToTake(1, 0)).toEqual({ add: 1, back: 0 });
    expect(stepsToTake(2, 1)).toEqual({ add: 1, back: 0 });
    expect(stepsToTake(2, 0)).toEqual({ add: 2, back: 0 });
    expect(stepsToTake(1, 1)).toEqual({ add: 0, back: 0 });
  });
  it("steps back over every step added when the layers are closed any other way", () => {
    expect(stepsToTake(0, 1)).toEqual({ add: 0, back: 1 });
    expect(stepsToTake(0, 2)).toEqual({ add: 0, back: 2 });
    expect(stepsToTake(1, 2)).toEqual({ add: 0, back: 1 });
  });
  it("reads our mark in a history entry's state, and nothing else", () => {
    expect(stepOf({ readerStep: 2, __NA: true })).toBe(2);
    expect(stepOf({ __NA: true })).toBe(0);
    expect(stepOf(null)).toBe(0);
    expect(stepOf("readerStep")).toBe(0);
    expect(stepOf({ readerStep: 0 })).toBe(0);
    expect(stepOf({ readerStep: "1" })).toBe(0);
    expect(stepOf({ readerStep: 1.5 })).toBe(0);
    expect(stepOf({ lookupStep: 1 })).toBe(0);   // the mark of the look-up alone, before the quiet desk's ticket 11: it means nothing now
  });
  it("tells the browser's Back from our own step back and from Forward", () => {
    expect(afterPop(1, 2)).toBe("back");
    expect(afterPop(0, 1)).toBe("back");
    expect(afterPop(1, 1)).toBe("same");
    expect(afterPop(1, 0)).toBe("forward");
  });
});

describe("which layers are in the history, oldest first", () => {
  it("puts a layer on the end when it opens, and takes it out when it closes", () => {
    expect(stackOf([], ["aa"])).toEqual(["aa"]);
    expect(stackOf(["vocab"], ["vocab", "look"])).toEqual(["vocab", "look"]);
    expect(stackOf(["vocab", "look"], ["vocab"])).toEqual(["vocab"]);
    expect(stackOf(["vocab", "look"], [])).toEqual([]);
  });
  it("keeps the order the layers were opened in, whatever order they are listed in", () => {
    expect(stackOf(["toolbar", "look"], ["look", "toolbar"])).toEqual(["toolbar", "look"]);
    expect(stackOf(["look", "more"], ["more", "look"])).toEqual(["look", "more"]);
  });
  it("puts a layer that closes and opens again on the end", () => {
    expect(stackOf(["find", "look"], ["find"])).toEqual(["find"]);
    expect(stackOf(["find"], ["find", "look"])).toEqual(["find", "look"]);
  });
  it("lists the layers that open together in the order given", () => {
    expect(stackOf([], ["look", "more"])).toEqual(["look", "more"]);
  });
  it("keeps Study at the bottom while a panel opened from one of its rows stands over it", () => {
    // Study is open: a row is chosen, the menu closes and the panel opens
    expect(stackOf(["study"], ["vocab"], ["study"])).toEqual(["study", "vocab"]);
    // a look-up over the panel
    expect(stackOf(["study", "vocab"], ["vocab", "look"], ["study"])).toEqual(["study", "vocab", "look"]);
    // the panel closed by ×: Study does not come back, and no step is kept for it
    expect(stackOf(["study", "vocab"], [], [])).toEqual([]);
    // "Back to Study": the menu is open again and the panel is gone
    expect(stackOf(["study", "vocab"], ["study"], [])).toEqual(["study"]);
  });
  it("keeps the look-up under the Echoes or the sentence it opened, and its place under a look-up opened over them", () => {
    expect(stackOf(["look", "more"], ["echoes"], ["word", "word+"])).toEqual(["word", "word+", "echoes"]);
    expect(stackOf(["word", "word+", "echoes"], ["echoes", "look"], ["word", "word+"])).toEqual(["word", "word+", "echoes", "look"]);
    expect(stackOf(["word", "word+", "echoes", "look"], ["echoes"], ["word", "word+"])).toEqual(["word", "word+", "echoes"]);
    // "Back to μῆνις": the look-up opens again in its second layer and the Echoes are gone
    expect(stackOf(["word", "word+", "echoes"], ["look", "more"], [])).toEqual(["look", "more"]);
  });
  it("does not list Study twice when it is open as well as waiting", () => {
    expect(stackOf(["study", "vocab"], ["study", "vocab"], ["study"])).toEqual(["study", "vocab"]);
  });
});

describe("what Back closes", () => {
  const shut = new Set<Layer>(["study", "word", "word+"]);
  const isOpen = (l: Layer) => !shut.has(l);
  it("closes the newest layer, and nothing else", () => {
    expect(afterBack(["aa"], 0, isOpen)).toEqual({ close: ["aa"], show: null });
    expect(afterBack(["vocab", "look"], 1, isOpen)).toEqual({ close: ["look"], show: null });
    expect(afterBack(["look", "more"], 1, isOpen)).toEqual({ close: ["more"], show: null });
  });
  it("shows Study again when the panel opened from it closes, and the next Back closes Study", () => {
    expect(afterBack(["study", "vocab"], 1, isOpen)).toEqual({ close: ["vocab"], show: "study" });
    expect(afterBack(["study"], 0, isOpen)).toEqual({ close: ["study"], show: null });
  });
  it("leaves a panel as it is when a look-up opened over it closes", () => {
    expect(afterBack(["study", "vocab", "look"], 2, isOpen)).toEqual({ close: ["look"], show: null });
  });
  it("brings the look-up back in its second layer when Back leaves Echoes or the sentence", () => {
    expect(afterBack(["word", "word+", "echoes"], 2, isOpen)).toEqual({ close: ["echoes"], show: "word+" });
    expect(afterBack(["word", "word+", "echoes"], 1, isOpen)).toEqual({ close: ["echoes", "word+"], show: "word" });
    expect(afterBack(["word", "word+", "echoes"], 0, isOpen)).toEqual({ close: ["echoes", "word+", "word"], show: null });
  });
  it("closes several layers, newest first, when Back lands more than one step down", () => {
    expect(afterBack(["toolbar", "look", "more"], 0, isOpen)).toEqual({ close: ["more", "look", "toolbar"], show: null });
    expect(afterBack(["aa", "look", "more"], 1, isOpen)).toEqual({ close: ["more", "look"], show: null });
  });
  it("holds to the stack it was given", () => {
    expect(afterBack([], 0, isOpen)).toEqual({ close: [], show: null });
    expect(afterBack(["aa"], 5, isOpen)).toEqual({ close: [], show: null });
  });
});

describe("a page turned or a link followed", () => {
  const click = (over: Partial<Parameters<typeof leaveBy>[0]> = {}) => ({ button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false, preventDefault: () => {}, ...over });
  it("runs at once when the reader has put no steps in the history", () => {
    let ran = 0;
    afterSteps(() => ran++);
    expect(ran).toBe(1);
  });
  it("takes over a plain click on a link, and goes once", () => {
    let ran = 0, stopped = 0;
    leaveBy(click({ preventDefault: () => stopped++ }), () => ran++);
    expect(stopped).toBe(1);
    expect(ran).toBe(1);
  });
  it("leaves a click meant for another tab, or one already handled, to the browser", () => {
    let ran = 0, stopped = 0;
    const go = () => ran++, stop = () => stopped++;
    for (const over of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }]) leaveBy(click({ ...over, preventDefault: stop }), go);
    expect(stopped).toBe(0);
    expect(ran).toBe(0);
  });
});
