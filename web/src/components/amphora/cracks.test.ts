import { describe, expect, it } from "vitest";
import { CrackField, strike, type Surface } from "./cracks";

// a plain cylinder: 2048 pixels round, 1024 down, as many pixels per unit each way as the vase's belly
const surf: Surface = { W: 2048, H: 1024, sx: () => 2048 / (2 * Math.PI * 0.6), sy: 1024 / 2.6 };
const length = (pts: number[]) => { let n = 0; for (let i = 3; i < pts.length; i += 3) n += Math.hypot(pts[i] - pts[i - 3], pts[i + 1] - pts[i - 2]); return n; };

describe("strike", () => {
  it("grows the same cracks from the same blow", () => {
    const a = strike({ x: 600, y: 500, f: 0.7, s: 42 }, surf, new CrackField(2048));
    const b = strike({ x: 600, y: 500, f: 0.7, s: 42 }, surf, new CrackField(2048));
    expect(a).toEqual(b);
  });
  it("a harder blow makes more and longer cracks, and rings", () => {
    const light = strike({ x: 600, y: 500, f: 0.15, s: 7 }, surf, new CrackField(2048));
    const hard = strike({ x: 600, y: 500, f: 0.95, s: 7 }, surf, new CrackField(2048));
    const total = (fr: typeof light) => fr.paths.reduce((n, p) => n + length(p.pts), 0);
    expect(hard.paths.length).toBeGreaterThan(light.paths.length);
    expect(total(hard)).toBeGreaterThan(total(light) * 2);
  });
  it("cracks thin towards their tips", () => {
    const fr = strike({ x: 600, y: 500, f: 0.6, s: 3 }, surf, new CrackField(2048));
    const p = fr.paths[0].pts;
    expect(p[p.length - 1]).toBeLessThan(p[2]);
  });
  it("a new crack stops where it meets an old one", () => {
    const field = new CrackField(2048);
    // an old crack: a long vertical line just right of the new blow
    for (let y = 100; y < 900; y += 10) field.add(700, y, 700, y + 10);
    const fr = strike({ x: 640, y: 500, f: 1, s: 11 }, surf, field);
    for (const p of fr.paths) for (let i = 0; i < p.pts.length; i += 3) expect(p.pts[i]).toBeLessThanOrEqual(700.5);
  });
  it("runs across the seam at the back of the pot without a break", () => {
    const fr = strike({ x: 4, y: 500, f: 0.9, s: 5 }, surf, new CrackField(2048));
    expect(fr.paths.some((p) => p.pts.some((v, i) => i % 3 === 0 && v < 0))).toBe(true);
  });
});
