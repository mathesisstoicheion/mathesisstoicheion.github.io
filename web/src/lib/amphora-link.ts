/**
 * A painted pot packed into a link (the pot's Share, components/Amphora.tsx; the owner, 2026-10-30: "every thought and
 * creation: Shareable, including making a pot"). The whole design goes after the # of /stoa/pot#v=…, which a browser
 * never sends to the server, so nothing is stored anywhere: the link is the pot.
 *
 * Packed as numbers, smallest first: the style and the five bands as one byte each, the two words, the cracks, then each
 * stroke as its colour, width and points, every point after the first written as its step from the one before (a brush
 * moves a few texture pixels at a time, so most steps fit in a byte). Then squeezed (deflate, where the browser has it)
 * and written in the 64 letters an address can carry. A link read back is checked at every step: a damaged one, or one
 * that claims more than a browser keeps, is refused rather than drawn.
 */
import { BANDS, FRIEZES, MAX_CRACKS, MAX_POINTS, PALETTE, cleanDesign, type Design, type Stroke } from "./amphora";

const FORMAT = 1;
/** a link's code longer than this is not read at all; a squeezed design opening larger than this is refused */
const MAX_CODE = 400_000, MAX_BYTES = 4_000_000, MAX_STROKES = 100_000, MAX_WORD = 64;

// ---------------------------------------------------------------- bytes
class Out {
  b = new Uint8Array(1024); n = 0;
  byte(x: number) { if (this.n === this.b.length) { const g = new Uint8Array(this.b.length * 2); g.set(this.b); this.b = g; } this.b[this.n++] = x & 255; }
  uint(x: number) { x = Math.max(0, Math.round(x)); while (x >= 128) { this.byte((x % 128) | 128); x = Math.floor(x / 128); } this.byte(x); }
  int(x: number) { x = Math.round(x); this.uint(x < 0 ? -2 * x - 1 : 2 * x); }
  text(s: string) { const t = new TextEncoder().encode(s); this.uint(t.length); for (const c of t) this.byte(c); }
  done() { return this.b.slice(0, this.n); }
}
class In {
  i = 0;
  constructor(private b: Uint8Array) {}
  byte() { if (this.i >= this.b.length) throw new Error("short"); return this.b[this.i++]; }
  uint() { let x = 0, m = 1; for (let k = 0; k < 6; k++) { const c = this.byte(); x += (c & 127) * m; if (c < 128) return x; m *= 128; } throw new Error("long number"); }
  int() { const z = this.uint(); return z % 2 ? -(z + 1) / 2 : z / 2; }
  text(max: number) { const n = this.uint(); if (n > max) throw new Error("long words"); const t = new Uint8Array(n); for (let k = 0; k < n; k++) t[k] = this.byte(); return new TextDecoder().decode(t); }
  get end() { return this.i === this.b.length; }
}

const toB64 = (b: Uint8Array) => {
  let s = "";
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64 = (s: string) => {
  const t = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  const b = new Uint8Array(t.length);
  for (let i = 0; i < t.length; i++) b[i] = t.charCodeAt(i);
  return b;
};

const squeezes = () => typeof CompressionStream === "function" && typeof DecompressionStream === "function";
async function squeeze(b: Uint8Array): Promise<Uint8Array> {
  const s = new Blob([b as BlobPart]).stream().pipeThrough(new CompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(s).arrayBuffer());
}
/** opened a piece at a time, and given up as soon as it grows past what any real pot needs */
async function unsqueeze(b: Uint8Array): Promise<Uint8Array> {
  const r = new Blob([b as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw")).getReader();
  const parts: Uint8Array[] = [];
  let n = 0;
  for (;;) {
    const { done, value } = await r.read();
    if (done) break;
    n += value.length;
    if (n > MAX_BYTES) { await r.cancel(); throw new Error("too large"); }
    parts.push(value);
  }
  const out = new Uint8Array(n);
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.length; }
  return out;
}

// ---------------------------------------------------------------- the design
function pack(d: Design): Uint8Array {
  const o = new Out();
  o.byte(FORMAT);
  o.byte(d.style === "red" ? 1 : 0);
  for (const k of ["neck", "shoulder", "lower", "foot"] as const) o.byte(BANDS.indexOf(d[k]));
  o.byte(FRIEZES.indexOf(d.frieze));
  o.text(d.words[0]); o.text(d.words[1]);
  o.uint(d.cracks.length);
  for (const c of d.cracks) { o.uint(c.x); o.uint(c.y); o.byte(Math.round(c.f * 100)); o.uint(c.s); }
  o.uint(d.strokes.length);
  for (const s of d.strokes) {
    o.byte(s.c + 2);
    o.uint(s.w * 10);
    if (s.c === -2) { const h = parseInt((s.h ?? "#000000").slice(1), 16); o.byte(h >> 16); o.byte(h >> 8); o.byte(h); }
    const n = s.p.length / 3;
    o.uint(n);
    for (let i = 0; i < n; i++) {
      if (i === 0) { o.uint(s.p[0]); o.uint(s.p[1]); o.uint(s.p[2]); }
      else for (let k = 0; k < 3; k++) o.int(s.p[i * 3 + k] - s.p[i * 3 + k - 3]);
    }
  }
  return o.done();
}

function unpack(b: Uint8Array): Design | null {
  const r = new In(b);
  if (r.byte() !== FORMAT) return null;
  const style = r.byte() ? "red" : "black";
  const band = () => { const i = r.byte(); if (i >= BANDS.length) throw new Error("band"); return BANDS[i]; };
  const neck = band(), shoulder = band(), lower = band(), foot = band();
  const fi = r.byte(); if (fi >= FRIEZES.length) return null;
  const words = [r.text(MAX_WORD), r.text(MAX_WORD)];
  const nc = r.uint(); if (nc > MAX_CRACKS) return null;
  const cracks = Array.from({ length: nc }, () => ({ x: r.uint(), y: r.uint(), f: r.byte() / 100, s: r.uint() }));
  const ns = r.uint(); if (ns > MAX_STROKES) return null;
  const strokes: Stroke[] = [];
  let points = 0;
  for (let j = 0; j < ns; j++) {
    const c = r.byte() - 2;
    if (c < -2 || c >= PALETTE.length) return null;
    const w = r.uint() / 10;
    const h = c === -2 ? `#${[r.byte(), r.byte(), r.byte()].map((x) => x.toString(16).padStart(2, "0")).join("")}` : undefined;
    const n = r.uint();
    points += n;
    if (points > MAX_POINTS) return null;
    const p = new Array<number>(n * 3);
    for (let i = 0; i < n; i++) {
      if (i === 0) { p[0] = r.uint(); p[1] = r.uint(); p[2] = r.uint(); }
      else for (let k = 0; k < 3; k++) p[i * 3 + k] = p[i * 3 + k - 3] + r.int();
    }
    strokes.push(h ? { c, w, h, p } : { c, w, p });
  }
  if (!r.end) return null;
  return cleanDesign({ v: 1, style, neck, shoulder, frieze: FRIEZES[fi], lower, foot, words, strokes, cracks });
}

/** The pot as the code that follows #v= in its link. */
export async function encodeDesign(d: Design): Promise<string> {
  const raw = pack(d);
  return squeezes() ? `z${toB64(await squeeze(raw))}` : `r${toB64(raw)}`;
}

/** A pot read back from its link's code; null for anything damaged, cut short or larger than a browser keeps. */
export async function decodeDesign(code: string): Promise<Design | null> {
  if (!code || code.length > MAX_CODE || !/^[zr][A-Za-z0-9_-]+$/.test(code)) return null;
  try {
    const b = fromB64(code.slice(1));
    return unpack(code[0] === "z" ? (squeezes() ? await unsqueeze(b) : (() => { throw new Error("cannot open"); })()) : b);
  } catch { return null; }
}

// ---------------------------------------------------------------- fitting it into a link
/** the distance of point p from the line through a and b (or from a, when a and b are one point) */
const off = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
  return len ? Math.abs(dy * px - dx * py + bx * ay - by * ax) / len : Math.hypot(px - ax, py - ay);
};
/** Each stroke with the points dropped that lie within `tol` texture pixels of the line between the points kept on either
 *  side (Douglas and Peucker's way); the ends and every corner stay. With tol 0 the design is untouched. */
export function simplify(d: Design, tol: number): Design {
  if (tol <= 0) return d;
  const strokes = d.strokes.map((s) => {
    const n = s.p.length / 3;
    if (n < 3) return s;
    const keep = new Uint8Array(n); keep[0] = keep[n - 1] = 1;
    const stack: [number, number][] = [[0, n - 1]];
    while (stack.length) {
      const [a, b] = stack.pop()!;
      let far = -1, at = -1;
      for (let i = a + 1; i < b; i++) {
        const e = off(s.p[i * 3], s.p[i * 3 + 1], s.p[a * 3], s.p[a * 3 + 1], s.p[b * 3], s.p[b * 3 + 1]);
        if (e > far) { far = e; at = i; }
      }
      if (far > tol) { keep[at] = 1; stack.push([a, at], [at, b]); }
    }
    const p: number[] = [];
    for (let i = 0; i < n; i++) if (keep[i]) p.push(s.p[i * 3], s.p[i * 3 + 1], s.p[i * 3 + 2]);
    return { ...s, p };
  });
  return { ...d, strokes };
}

/** The pot's code, no longer than `max` letters: exact if it fits, else drawn with fewer points (finer brushwork simplified
 *  by up to 4 texture pixels, about a hair's width on the pot); null when even that is too long. */
export async function fittingCode(d: Design, max: number): Promise<string | null> {
  for (const tol of [0, 0.75, 1.5, 3, 4]) {
    const code = await encodeDesign(simplify(d, tol));
    if (code.length <= max) return code;
  }
  return null;
}
