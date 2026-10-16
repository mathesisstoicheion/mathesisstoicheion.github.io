import { describe, expect, it } from "vitest";
import { azKey, compareAZ, groupAZ } from "./az";

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
