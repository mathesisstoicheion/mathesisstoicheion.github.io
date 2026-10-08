import { afterEach, describe, expect, it } from "vitest";
import { RULE, START_KEY, isReturning } from "./visitor";

// a stand-in for the browser's localStorage
const store = new Map<string, string>();
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
};
// the inline script's rule, run as the browser runs it
const inline = new Function(`return (${RULE})();`) as () => boolean;

const CASES: [string, Record<string, string>, boolean][] = [
  ["nothing stored", {}, false],
  ["only the home page visited", { "mathesis:resume": JSON.stringify({ trail: [{ href: "/", t: 1 }] }) }, false],
  ["another page visited", { "mathesis:resume": JSON.stringify({ trail: [{ href: "/", t: 2 }, { href: "/academy", t: 1 }] }) }, true],
  ["a start chosen", { [START_KEY]: JSON.stringify({ choice: "read", t: 1 }) }, true],
  ["a text opened", { "mathesis:positions": JSON.stringify({ "tlg0012.tlg001": { at: "1.5" } }) }, true],
  ["no texts opened", { "mathesis:positions": "{}" }, false],
  ["Academy progress", { "mathesis:academy": "{}" }, true],
  ["damaged storage", { "mathesis:resume": "{not json" }, false],
];

describe("first visit or returning", () => {
  afterEach(() => store.clear());
  for (const [what, saved, back] of CASES) {
    it(`${what}: ${back ? "returning" : "first visit"}, the same in the inline script and the app`, () => {
      for (const [k, v] of Object.entries(saved)) store.set(k, v);
      expect(isReturning()).toBe(back);
      expect(inline()).toBe(back);
    });
  }
});
