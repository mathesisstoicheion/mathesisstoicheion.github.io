/**
 * Packing a thing into a link's # (the Share of a painted pot, lib/amphora-link.ts, and of a tune played on the lyre,
 * lib/lyre/tune-link.ts): numbers written as bytes, smallest first, then squeezed (deflate, where the browser has it) and
 * set in the 64 letters an address can carry. Read back, every step is checked: a damaged code, or one that opens larger
 * than anything real, gives nothing rather than nonsense.
 */

/** Bytes as they are written: a byte, a whole number of any size (7 bits to a byte), a signed one, a piece of text. */
export class Out {
  b = new Uint8Array(1024); n = 0;
  byte(x: number) { if (this.n === this.b.length) { const g = new Uint8Array(this.b.length * 2); g.set(this.b); this.b = g; } this.b[this.n++] = x & 255; }
  uint(x: number) { x = Math.max(0, Math.round(x)); while (x >= 128) { this.byte((x % 128) | 128); x = Math.floor(x / 128); } this.byte(x); }
  int(x: number) { x = Math.round(x); this.uint(x < 0 ? -2 * x - 1 : 2 * x); }
  text(s: string) { const t = new TextEncoder().encode(s); this.uint(t.length); for (const c of t) this.byte(c); }
  done() { return this.b.slice(0, this.n); }
}

/** The same bytes read back; reading past the end, or a number or a text longer than allowed, throws. */
export class In {
  i = 0;
  constructor(private b: Uint8Array) {}
  byte() { if (this.i >= this.b.length) throw new Error("short"); return this.b[this.i++]; }
  uint() { let x = 0, m = 1; for (let k = 0; k < 6; k++) { const c = this.byte(); x += (c & 127) * m; if (c < 128) return x; m *= 128; } throw new Error("long number"); }
  int() { const z = this.uint(); return z % 2 ? -(z + 1) / 2 : z / 2; }
  text(max: number) { const n = this.uint(); if (n > max) throw new Error("long text"); const t = new Uint8Array(n); for (let k = 0; k < n; k++) t[k] = this.byte(); return new TextDecoder().decode(t); }
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
/** opened a piece at a time, and given up as soon as it grows past `max` bytes */
async function unsqueeze(b: Uint8Array, max: number): Promise<Uint8Array> {
  const r = new Blob([b as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw")).getReader();
  const parts: Uint8Array[] = [];
  let n = 0;
  for (;;) {
    const { done, value } = await r.read();
    if (done) break;
    n += value.length;
    if (n > max) { await r.cancel(); throw new Error("too large"); }
    parts.push(value);
  }
  const out = new Uint8Array(n);
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.length; }
  return out;
}

/** The bytes as a link's code: "z" and the squeezed bytes, or "r" and the bytes as they are where nothing squeezes. */
export async function toCode(b: Uint8Array): Promise<string> {
  return squeezes() ? `z${toB64(await squeeze(b))}` : `r${toB64(b)}`;
}

/** A code's bytes; null for one that is too long, not a code, damaged, or opens to more than `maxBytes`. */
export async function fromCode(code: string, maxCode: number, maxBytes: number): Promise<Uint8Array | null> {
  if (!code || code.length > maxCode || !/^[zr][A-Za-z0-9_-]+$/.test(code)) return null;
  try {
    const b = fromB64(code.slice(1));
    if (code[0] === "r") return b.length > maxBytes ? null : b;
    return squeezes() ? await unsqueeze(b, maxBytes) : null;
  } catch { return null; }
}
