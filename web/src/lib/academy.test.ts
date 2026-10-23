import { describe, expect, it } from "vitest";
import { streak } from "./academy";

describe("academy progress", () => {
  it("counts a streak of days ending today", () => {
    const d = new Date();
    const fmt = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    const days = [0, 1, 2].map((k) => { const x = new Date(d); x.setDate(d.getDate() - k); return fmt(x); });
    expect(streak(days)).toBe(3);
    expect(streak([])).toBe(0);
  });
});
