import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { TOOLS, closeTool, toggleTool, underEchoes } from "./tool";

// The reader's side panels are one slot, not six yes/no flags (tool.ts): at most one is open at a time.
describe("the reader's one tool at the side", () => {
  it("opens a tool in place of any other, and closes it when pressed again", () => {
    expect(toggleTool(null, "vocab")).toBe("vocab");
    expect(toggleTool("find", "vocab")).toBe("vocab");
    expect(toggleTool("vocab", "vocab")).toBeNull();
  });

  it("closes a tool only if it is the one open", () => {
    expect(closeTool("places", "places")).toBeNull();
    expect(closeTool("places", "talk")).toBe("places");
    expect(closeTool(null, "talk")).toBeNull();
  });

  it("keeps Find and the list of differences waiting behind the Echoes, and closes the rest", () => {
    expect(underEchoes("find")).toBe("find");
    expect(underEchoes("cmp")).toBe("cmp");
    for (const t of ["vocab", "places", "ms", "talk"] as const) expect(underEchoes(t)).toBeNull();
    expect(underEchoes(null)).toBeNull();
  });

  it("names every row of Study", () => expect([...TOOLS].sort()).toEqual(["cmp", "find", "ms", "places", "talk", "vocab"]));

  // a guard for whoever works on the reader next: a yes/no flag of its own for a tool would let two open at once again
  it("is kept as one slot in the reader", () => {
    const src = readFileSync(join(__dirname, "Reader.tsx"), "utf8");
    expect(src.match(/\bset(Find|Vocab|Places|Ms|Talk|CmpList)Open\b/g) ?? []).toEqual([]);
  });
});
