import { describe, expect, it } from "vitest";
import { bestOctave, freeStrings, keysOf, octaves, stringsFor } from "./tuning";

describe("the computer keyboard as a piano", () => {
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

  it("starts the keys from the C that reaches the most notes", () => {
    expect(bestOctave(keysOf(freeStrings("ancient")))).toBe(48);
    // a song from A3 to A4 whose notes are mostly from C4 up
    const song = [57, 59, 61, 62, 64, 66, 67, 69];
    const uses = [2, 1, 4, 6, 6, 4, 5, 9];
    expect(bestOctave(song, (i) => uses[i])).toBe(60);
    expect(octaves(song)).toEqual([48, 60]);
  });
});
