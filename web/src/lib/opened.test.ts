import { beforeEach, describe, expect, it } from "vitest";
import { addOpened, firstOpening, markOpened, MAX_OPENED, wasOpened } from "./opened";
import { savePosition } from "./position";

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); },
  };
});

const ILIAD = "tlg0012.tlg001";

// the quiet desk, ticket 08: a book's title page shows the first time it is opened on this device, and never again
describe("books opened on this device", () => {
  it("shows the title page the first time a book is opened, and no later time", () => {
    expect(firstOpening(ILIAD)).toBe(true);
    markOpened(ILIAD);
    expect(firstOpening(ILIAD)).toBe(false);
    markOpened(ILIAD);   // opened again: still not a first opening
    expect(firstOpening(ILIAD)).toBe(false);
    expect(firstOpening("tlg0012.tlg002")).toBe(true);   // another book has its own first time
  });

  it("treats a book of the private collection the same", () => {
    expect(firstOpening("mine:abc")).toBe(true);
    markOpened("mine:abc");
    expect(firstOpening("mine:abc")).toBe(false);
    expect(wasOpened(ILIAD)).toBe(false);
  });

  it("does not show the title page again to a reader who has a place saved in the book from before this list was kept", () => {
    savePosition(ILIAD, { ed: "", tr: null, at: "1.5" });
    expect(wasOpened(ILIAD)).toBe(false);
    expect(firstOpening(ILIAD)).toBe(false);
  });

  it("keeps the last few hundred, forgetting the oldest first", () => {
    for (let i = 0; i < MAX_OPENED + 25; i++) markOpened(`w${i}`);
    expect(JSON.parse(store.get("mathesis:opened")!)).toHaveLength(MAX_OPENED);
    expect(wasOpened("w0")).toBe(false);       // the oldest are forgotten: their title page would show again
    expect(wasOpened("w24")).toBe(false);
    expect(wasOpened("w25")).toBe(true);
    expect(wasOpened(`w${MAX_OPENED + 24}`)).toBe(true);
  });

  it("adds without changing the list it is given, and moves a book already in it to the end", () => {
    const list = ["a", "b", "c"];
    expect(addOpened(list, "d")).toEqual(["a", "b", "c", "d"]);
    expect(addOpened(list, "a")).toEqual(["b", "c", "a"]);
    expect(addOpened(list, "")).toEqual(list);
    expect(list).toEqual(["a", "b", "c"]);
    const full = Array.from({ length: MAX_OPENED }, (_, i) => `w${i}`);
    const next = addOpened(full, "new");
    expect(next).toHaveLength(MAX_OPENED);
    expect(next[0]).toBe("w1");
    expect(next[next.length - 1]).toBe("new");
  });

  it("survives broken or missing storage (the title page simply shows)", () => {
    store.set("mathesis:opened", "{not json");
    expect(wasOpened(ILIAD)).toBe(false);
    store.set("mathesis:opened", JSON.stringify([ILIAD, 7, null]));
    expect(wasOpened(ILIAD)).toBe(true);
    (globalThis as { localStorage?: unknown }).localStorage = undefined;
    expect(firstOpening(ILIAD)).toBe(true);
    expect(() => markOpened(ILIAD)).not.toThrow();
  });
});
