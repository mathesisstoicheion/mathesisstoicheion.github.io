import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { scanSource } from "../../../scripts/token-inventory.mjs";

// The quiet desk, ticket 03: the reader's spacing is on the scale (tokens.css: --space-1 to --space-8, and --hair and
// --hair-2 for a line's own width), and its stylesheets name colours and lines by their plain roles, not by the stone
// look's names. Spacing in em stays: it is set against the letters (a note's mark, a verse's hanging indent) and grows
// with the reader's Greek size.
const DIR = join(__dirname);
const OLD = /var\(--(?:slab|field|cut|inlay|groove|channel|frame-line|accent-hi|bg-deep|f-display|lintel|sill|tympanum|flutes|glow|gold|bone|parch|patina|gilt|shaft|capital|stylobate)\b/;

describe("the reader's stylesheets", () => {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".css"));
  it("finds them", () => expect(files.length).toBeGreaterThan(5));

  it("set every spacing in px on the scale", () => {
    const off = files.flatMap((f) => (scanSource(`src/components/reader/${f}`, readFileSync(join(DIR, f), "utf8")) as { category: string; value: string; line: number }[])
      .filter((o) => o.category === "spacing" && /px$/.test(o.value)).map((o) => `${f}:${o.line} ${o.value}`));
    expect(off).toEqual([]);
  });

  it("use no colour or line names from the earlier looks", () => {
    const old = [...files, ...readdirSync(DIR).filter((f) => f.endsWith(".tsx"))].flatMap((f) =>
      readFileSync(join(DIR, f), "utf8").split("\n").flatMap((l, i) => (OLD.test(l) ? [`${f}:${i + 1} ${l.match(OLD)![0]}`] : [])));
    expect(old).toEqual([]);
  });
});
