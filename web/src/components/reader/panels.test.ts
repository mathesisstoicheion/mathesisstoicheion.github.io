import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The quiet desk, ticket 01: every panel, sheet and dialog in the reader is built from the one shell in Panel.tsx, so the
// frame, the heading, the close button and Escape behave the same everywhere. A file here that draws its own aside, dialog
// or panel head fails this test.
const DIR = join(__dirname);
// the floating reader is a second reader in its own window, not a panel over the page
const NOT_PANELS = new Set(["Panel.tsx", "FloatingReader.tsx"]);
const OWN_FRAME = [
  { what: "an <aside> of its own", re: /<aside\b/ },
  { what: "a <dialog> of its own", re: /<dialog\b/ },
  { what: 'a role="dialog" of its own', re: /role="dialog"/ },
  { what: "its own panel head", re: /\b\w+\.panelHead\b/ },
];

describe("the reader's panels", () => {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".tsx") && !NOT_PANELS.has(f));

  it("finds the reader's files", () => expect(files.length).toBeGreaterThan(10));

  it("all use the one shell", () => {
    const own = files.flatMap((f) => {
      const src = readFileSync(join(DIR, f), "utf8");
      return OWN_FRAME.filter((o) => o.re.test(src)).map((o) => `${f}: ${o.what}`);
    });
    expect(own).toEqual([]);
  });
});
