/** Small helpers shared by the art the torch lights (carved letters, re-lit reliefs, the Muses' niches). */

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
export const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
export const DPR = () => Math.min(2, window.devicePixelRatio || 1);
export const PHONE = () => innerWidth < 760;

export function canvas(w: number, h: number) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; return c;
}

/** Greek as it was carved: capitals, with no accents, breathings or spaces; iota subscript written as a full Ι. */
export const carvedCaps = (s: string) =>
  s.normalize("NFD").replace(/ͅ/g, "Ι").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^Α-Ω·]/g, "");

export function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const i = new Image(); i.decoding = "async";
    i.onload = () => resolve(i); i.onerror = () => resolve(null); i.src = src;
  });
}

/** A two-pass box blur of a grey picture held as numbers 0 to 1. */
export function boxBlur(src: Float32Array, w: number, h: number, r: number) {
  const tmp = new Float32Array(w * h), out = new Float32Array(w * h), k = 1 / (2 * r + 1);
  for (let y = 0; y < h; y++) {
    const o = y * w; let acc = 0;
    for (let i = -r; i <= r; i++) acc += src[o + clamp(i, 0, w - 1)];
    for (let x = 0; x < w; x++) { tmp[o + x] = acc * k; acc += src[o + Math.min(w - 1, x + r + 1)] - src[o + Math.max(0, x - r)]; }
  }
  for (let x = 0; x < w; x++) {
    let acc = 0;
    for (let i = -r; i <= r; i++) acc += tmp[clamp(i, 0, h - 1) * w + x];
    for (let y = 0; y < h; y++) { out[y * w + x] = acc * k; acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x]; }
  }
  return out;
}

/** How bright light makes stone, from black through ember and amber to the honey of the flame (torchlit), as packed RGBA. */
export const RAMP = (() => {
  const st = [[0, 0, 0, 0], [0.12, 30, 17, 10], [0.35, 100, 56, 30], [0.62, 176, 104, 56], [0.9, 226, 156, 92], [1.25, 250, 198, 132], [1.7, 255, 222, 170], [2.4, 255, 236, 204]];
  const L = new Uint32Array(512);
  for (let i = 0; i < 512; i++) {
    const v = (i / 511) * 2.4; let k = 0;
    while (k < st.length - 2 && v > st[k + 1][0]) k++;
    const a = st[k], b = st[k + 1], f = clamp((v - a[0]) / (b[0] - a[0]), 0, 1);
    const r = a[1] + (b[1] - a[1]) * f, g = a[2] + (b[2] - a[2]) * f, bl = a[3] + (b[3] - a[3]) * f;
    L[i] = (0xff000000 | (bl << 16) | (g << 8) | r) >>> 0;
  }
  return L;
})();
/** The same, by daylight: plain white light on pale stone. */
export const DAYRAMP = (() => {
  const L = new Uint32Array(512);
  for (let i = 0; i < 512; i++) { const v = Math.min(1, (i / 511) * 2.4), r = v * 255, g = v * 250, b = v * 240; L[i] = (0xff000000 | (b << 16) | (g << 8) | r) >>> 0; }
  return L;
})();

/** A light as a piece of art sees it: in pixels from the art's own top-left corner. */
export interface LocalLight { x: number; y: number; I: number }

/** What every piece of torchlit art can do (see lib/art/part.ts, which schedules them). */
export interface Art {
  /** Sizes the canvas to its box and prepares what can be prepared once. False when the box has no size yet. */
  layout(): boolean;
  /** Draws with these lights; returns true while it is still revealing itself (so it must be drawn again next frame). */
  draw(now: number, lights: LocalLight[]): boolean;
  /** Start the reveal at this time (seconds); null until it comes into view. */
  t0: number | null;
}
