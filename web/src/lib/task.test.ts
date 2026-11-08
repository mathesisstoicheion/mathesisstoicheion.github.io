import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { IDLE, failed, taskError } from "./task";

// A button's work for the database is one state (lib/task.ts), not a busy flag beside an error text.
describe("a task", () => {
  it("has no message unless it failed", () => {
    expect(taskError(IDLE)).toBeNull();
    expect(taskError({ state: "busy" })).toBeNull();
    expect(taskError({ state: "done" })).toBeNull();
  });

  it("says what went wrong in plain words", () => {
    expect(taskError(failed(new Error("Failed to fetch")))).toMatch(/could not be reached/);
    expect(taskError(failed(new Error("A title of three letters or more.")))).toBe("A title of three letters or more.");
  });

  // a guard for whoever works on the board next: a busy flag beside an error text is a task (a lone busy flag, as on
  // "Put it on the board", which shows no error, is fine)
  it("is how the board's buttons keep their state", () => {
    const dir = join(__dirname, "..", "components", "board");
    const flags = readdirSync(dir).filter((f) => f.endsWith(".tsx")).filter((f) => {
      const src = readFileSync(join(dir, f), "utf8");
      return /\bsetBusy\b/.test(src) && /\bsetError\b/.test(src);
    });
    expect(flags).toEqual([]);
  });
});
