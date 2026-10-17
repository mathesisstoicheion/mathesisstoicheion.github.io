import { describe, expect, it } from "vitest";
import { freeStrings, HOME_ROW, keyLetters, keysOf, LAYOUTS, layoutForLanguage, stringKeys, stringsFor, TOP_ROW } from "./tuning";

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

describe("keyboard layouts", () => {
  it("gives every layout a letter for each key of both rows", () => {
    for (const l of LAYOUTS) {
      expect(l.home, l.id).toHaveLength(HOME_ROW.length);
      expect(l.top, l.id).toHaveLength(TOP_ROW.length);
    }
    expect(new Set(LAYOUTS.map((l) => l.id)).size).toBe(LAYOUTS.length);
  });

  it("guesses the layout from the browser's language", () => {
    expect(layoutForLanguage("en-US")).toBe("qwerty");
    expect(layoutForLanguage("fr-FR")).toBe("azerty");
    expect(layoutForLanguage("fr-BE")).toBe("azerty");
    expect(layoutForLanguage("fr-CA")).toBe("qwerty");
    expect(layoutForLanguage("fr-CH")).toBe("ch-fr");
    expect(layoutForLanguage("de")).toBe("qwertz");
    expect(layoutForLanguage("de-CH")).toBe("ch-de");
    expect(layoutForLanguage("es-MX")).toBe("latam");
    expect(layoutForLanguage("es")).toBe("es");
    expect(layoutForLanguage("pt-BR")).toBe("br");
    expect(layoutForLanguage("el-GR")).toBe("el");
    expect(layoutForLanguage("sr-Latn-RS")).toBe("hr");
    expect(layoutForLanguage("eo")).toBeNull();
  });

  it("keeps a chosen layout's letters", async () => {
    const { labels, from } = await keyLetters("azerty");
    expect(from).toBe("choice");
    expect(stringKeys(4).map((c) => labels[c])).toEqual(["Q", "S", "D", "F"]);
    expect((await keyLetters("el")).labels.KeyA).toBe("Α");
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
