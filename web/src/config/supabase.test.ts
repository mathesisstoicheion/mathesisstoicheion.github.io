import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : /\.(ts|tsx|mjs|js)$/.test(e.name) ? [join(dir, e.name)] : []);

describe("the Supabase project", () => {
  it("is named only in the build settings, never in the code", () => {
    const found = [...files("src"), ...files("scripts"), ...files("e2e")].filter((f) =>
      /[a-z0-9]{20}\.supabase\.co|sb_publishable_[A-Za-z0-9_-]{10}/.test(readFileSync(f, "utf8")));
    expect(found).toEqual([]);
  });
});
