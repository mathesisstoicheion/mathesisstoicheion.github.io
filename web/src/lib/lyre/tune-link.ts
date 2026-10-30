/**
 * A tune played on the lyre, packed into a link (/stoa/lyre#tune=…; the owner, 2026-10-30: "every thought and creation:
 * Shareable"): which lyre it was played on (a melody's, or the free two-octave scale in its tuning) and every pluck, as
 * the time since the one before, its note and how hard it was struck. Nothing is stored anywhere: the link is the tune.
 * Packed and checked as the pot is (lib/link-code.ts).
 */
import { In, Out, fromCode, toCode } from "@/lib/link-code";
import type { Tuning } from "./tuning";

/** one string plucked: milliseconds from the first pluck, the MIDI note, and how hard (0 to 1) */
export interface Pluck { t: number; m: number; s: number }
export interface Tune { song: string | null; tuning: Tuning; plucks: Pluck[] }

const FORMAT = 1;
/** more than anyone plays at a sitting (about fifteen minutes of quick playing) */
export const MAX_PLUCKS = 3000;
const MAX_MS = 15 * 60_000, MAX_CODE = 40_000, MAX_BYTES = 64_000;
const SONG = /^[a-z0-9-]{1,40}$/;

export async function encodeTune(tune: Tune): Promise<string> {
  const o = new Out();
  o.byte(FORMAT);
  o.text(tune.song ?? "");
  o.byte(tune.tuning === "modern" ? 1 : 0);
  o.uint(tune.plucks.length);
  let last = 0;
  for (const p of tune.plucks) { o.uint(p.t - last); last = Math.round(p.t); o.byte(p.m); o.byte(Math.round(p.s * 100)); }
  return toCode(o.done());
}

export async function decodeTune(code: string): Promise<Tune | null> {
  const b = await fromCode(code, MAX_CODE, MAX_BYTES);
  if (!b) return null;
  try {
    const r = new In(b);
    if (r.byte() !== FORMAT) return null;
    const song = r.text(40);
    if (song && !SONG.test(song)) return null;
    const tuning: Tuning = r.byte() ? "modern" : "ancient";
    const n = r.uint();
    if (n > MAX_PLUCKS) return null;
    const plucks: Pluck[] = [];
    let t = 0;
    for (let i = 0; i < n; i++) {
      t += r.uint();
      const m = r.byte(), s = r.byte();
      if (t > MAX_MS || m > 127 || s > 100) return null;
      plucks.push({ t, m, s: s / 100 });
    }
    return r.end ? { song: song || null, tuning, plucks } : null;
  } catch { return null; }
}
