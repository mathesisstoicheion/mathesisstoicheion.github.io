import { describe, expect, it } from "vitest";
import { fold } from "@/lib/catalog";
import { azKey, bestMatch, compareAZ, groupAZ, nameMatch } from "./az";

describe("A to Z order", () => {
  it("files a title under its first Latin letter, skipping numbers, brackets and accents", () => {
    expect(azKey("Iliad")).toBe("I");
    expect(azKey("éloge")).toBe("E");
    expect(azKey("1 Corinthians")).toBe("C");
    expect(azKey("(Sophonias) Commentary on the Parva Naturalia")).toBe("S");
    expect(azKey("The Gospel of John")).toBe("T");
  });

  it("puts titles that do not start with a Latin letter under #", () => {
    expect(azKey("Ἰλιάς")).toBe("#");
    expect(azKey("")).toBe("#");
    expect(azKey("123")).toBe("#");
  });

  it("sorts A to Z, then #, ignoring capitals and putting numbers in order of size", () => {
    const titles = ["Ἰλιάς", "oration 10", "Oration 2", "Against Timarchus", "1 Corinthians", "Apology"];
    expect([...titles].sort(compareAZ)).toEqual(["Against Timarchus", "Apology", "1 Corinthians", "Oration 2", "oration 10", "Ἰλιάς"]);
  });

  it("groups the sorted items by letter, leaving out letters with nothing", () => {
    const g = groupAZ([{ title: "Odyssey" }, { title: "Iliad" }, { title: "Ἰλιάς" }, { title: "Hymns" }, { title: "Iliad, book 1" }]);
    expect(g.map((x) => x.key)).toEqual(["H", "I", "O", "#"]);
    expect(g[1].items.map((x) => x.title)).toEqual(["Iliad", "Iliad, book 1"]);
  });

  it("does not change the list it is given", () => {
    const items = [{ title: "B" }, { title: "A" }];
    groupAZ(items);
    expect(items.map((x) => x.title)).toEqual(["B", "A"]);
  });
});

describe("the best match for a search", () => {
  it("tells a whole name from the start of one, of a word in one, and from the middle of one", () => {
    expect(nameMatch(["Plato"], "plato")).toBe(0);
    expect(nameMatch(["Aristotle"], "aristot")).toBe(1);
    expect(nameMatch(["Pseudo-Plato"], "plato")).toBe(2);
    expect(nameMatch(["Elias Neoplatonicus"], "plato")).toBe(3);
    expect(nameMatch(["Homer"], "plato")).toBe(-1);
  });

  it("ignores accents, capitals and names that are missing, and takes the closest of an author's names", () => {
    expect(nameMatch(["Albinus", undefined, "Albino platonico"], "platon")).toBe(2);
    expect(nameMatch(["Ἀριστοτέλης", "Aristotle"], fold("αριστοτελης"))).toBe(0);
    expect(nameMatch(["Plato Philosophus", "Platon"], "platon")).toBe(0);
  });

  it("picks an item only when it alone is closest", () => {
    const tiers: Record<string, number> = { Plato: 0, "Pseudo-Plato": 2, Albinus: 2, Cato: -1 };
    expect(bestMatch(Object.keys(tiers), (x) => tiers[x])).toBe("Plato");
    expect(bestMatch(["Marcus Aurelius", "Marcus Argentarius"], () => 1)).toBeNull();
    expect(bestMatch(["Cato"], (x) => tiers[x])).toBeNull();
    expect(bestMatch([], () => 0)).toBeNull();
  });
});
