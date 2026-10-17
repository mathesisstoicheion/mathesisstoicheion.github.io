import { describe, expect, it } from "vitest";
import { freeStrings, keysOf, stringKeys, stringsFor } from "./tuning";

describe("the computer keyboard", () => {
  it("plays the strings in order from A along the home row", () => {
    expect(stringKeys(8)).toEqual(["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK"]);
    expect(stringKeys(11).at(-1)).toBe("Quote");
  });

  it("puts the higher half of a larger lyre on the row above, from Q", () => {
    const k = stringKeys(15);
    expect(k.slice(0, 8)).toEqual(["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK"]);
    expect(k.slice(8)).toEqual(["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU"]);
    expect(new Set(stringKeys(13)).size).toBe(13);
  });
});

describe("a MIDI keyboard", () => {
  it("puts the two-octave scale on the white keys, in either tuning", () => {
    const white = [45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69];
    expect(keysOf(freeStrings("ancient"))).toEqual(white);
    expect(keysOf(freeStrings("modern"))).toEqual(white);
  });

  it("gives two strings that round to one key a key each, low to high", () => {
    // the Orestes papyrus' steps smaller than a semitone, in Hagel's tuning
    const keys = keysOf(stringsFor([59.96, 62.66, 63.16, 64.02, 69.66, 70.14]));
    expect(new Set(keys).size).toBe(keys.length);
    expect([...keys].sort((a, b) => a - b)).toEqual(keys);
    expect(keys).toEqual([60, 62, 63, 64, 69, 70]);
  });
});
