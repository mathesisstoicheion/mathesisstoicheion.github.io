/**
 * The home page's vase as data: which pattern goes in each band, the two painted words, and every brush
 * stroke the visitor has added (components/amphora/paint.ts draws it; components/Amphora.tsx shows it).
 * A visitor's own vase is kept in this browser only (localStorage), like everything else in the Treasury.
 */

export const BANDS = ["meander", "wave", "tongues", "dots", "zigzag", "ivy", "rays", "black", "clay"] as const;
export type Band = (typeof BANDS)[number];
export const BAND_NAMES: Record<Band, string> = {
  meander: "Meander (key pattern)", wave: "Waves", tongues: "Tongues", dots: "Dots", zigzag: "Zigzag",
  ivy: "Ivy", rays: "Rays", black: "Plain black", clay: "Bare clay",
};

export const FRIEZES = ["open", "panels", "black", "clay"] as const;
export type Frieze = (typeof FRIEZES)[number];
export const FRIEZE_NAMES: Record<Frieze, string> = {
  open: "A band all the way round", panels: "Two framed panels", black: "Plain black", clay: "Bare clay",
};

/** The colours a painter in Athens had: black gloss, the clay itself, added red, added white, and gloss thinned to a golden brown. */
export const PALETTE = [
  { name: "Black gloss", hex: "#15100c" },
  { name: "Clay", hex: "#c8703a" },
  { name: "Added red", hex: "#8e2a14" },
  { name: "Added white", hex: "#efe4cf" },
  { name: "Thinned gloss", hex: "#9a5a26" },
] as const;

/** Colours no Athenian painter had, for painting the vase any way you like (named for the colour picker). */
export const MORE_COLOURS = [
  { name: "Pomegranate", hex: "#b3202a" }, { name: "Coral", hex: "#e8644a" }, { name: "Saffron", hex: "#f0a020" }, { name: "Honey", hex: "#e8c15a" },
  { name: "Lemon", hex: "#f2e05c" }, { name: "Olive", hex: "#7d8a2e" }, { name: "Leaf", hex: "#4f9a3a" }, { name: "Malachite", hex: "#1f8a62" },
  { name: "Sea green", hex: "#2aa39a" }, { name: "Aegean", hex: "#1f6fb2" }, { name: "Lapis", hex: "#26418f" }, { name: "Midnight", hex: "#1a2550" },
  { name: "Sky", hex: "#8cc4ea" }, { name: "Violet", hex: "#6a3d9a" }, { name: "Tyrian purple", hex: "#66023c" }, { name: "Rose", hex: "#e58fae" },
  { name: "Ivory", hex: "#fbf3e2" }, { name: "Stone", hex: "#a39b8b" }, { name: "Slate", hex: "#55595f" }, { name: "Soot", hex: "#000000" },
  { name: "Gold", hex: "#d4a73c" }, { name: "Bronze", hex: "#a8662c" }, { name: "Umber", hex: "#5b3a1e" }, { name: "Sand", hex: "#dcc08f" },
] as const;

/** One stroke of the brush: a colour (an index into PALETTE; -1 rubs out; -2 is any colour, given in h), a half-width
 *  in texture pixels, and its points as x, y, aspect×100 triples (aspect: how much wider a texture pixel is than tall
 *  at that height). Texture pixels are of a 2048 × 1024 picture, whatever size the vase is drawn at. */
export type Stroke = { c: number; w: number; p: number[]; h?: string };
/** A blow that cracked the vase: where (texture pixels), how hard (0–1), and the seed its cracks grow from. */
export type Crack = { x: number; y: number; f: number; s: number };
export const MAX_CRACKS = 40;

export type Design = {
  v: 1;
  /** black-figure: dark figures on the clay; red-figure: the clay left for the figures and the ground painted black */
  style: "black" | "red";
  neck: Band; shoulder: Band; frieze: Frieze; lower: Band; foot: Band;
  words: [string, string];
  strokes: Stroke[];
  cracks: Crack[];
};

export const DEFAULT_DESIGN: Design = {
  v: 1, style: "black", neck: "dots", shoulder: "tongues", frieze: "open", lower: "meander", foot: "rays",
  words: ["ΜΑΘΗΣΙΣ", "ΣΤΟΙΧΕΙΩΝ"], strokes: [], cracks: [],
};

export const BARE_DESIGN: Design = {
  v: 1, style: "black", neck: "clay", shoulder: "clay", frieze: "clay", lower: "clay", foot: "clay", words: ["", ""], strokes: [], cracks: [],
};

export const WORD_MAX = 14;
/** beyond this many stroke points the vase is too big to keep in the browser (about 1.5 MB) */
export const MAX_POINTS = 240_000;

/**
 * What a visitor types for the painted words, turned into Greek capitals as on real vases (no accents or
 * breathings). English letters are spelled out: th → Θ, ph → Φ, ch → Χ, ps → Ψ, ks → Ξ, w or ō → Ω, ē → Η;
 * an h on its own is dropped. Greek letters typed directly are kept, as capitals.
 */
export function toGreekCaps(s: string): string {
  const one: Record<string, string> = {
    a: "Α", b: "Β", g: "Γ", d: "Δ", e: "Ε", z: "Ζ", i: "Ι", j: "Ι", k: "Κ", c: "Κ", q: "Κ", l: "Λ", m: "Μ", n: "Ν",
    x: "Ξ", o: "Ο", p: "Π", r: "Ρ", s: "Σ", t: "Τ", u: "Υ", y: "Υ", f: "Φ", v: "Β", w: "Ω", h: "",
  };
  return s
    .replace(/ē/gi, "Η").replace(/ō/gi, "Ω")
    .normalize("NFD").replace(/\p{M}/gu, "")
    // a two-letter sound: its first letter may already have been turned into Greek while typing
    .replace(/(t|Τ)h/gi, "Θ").replace(/(p|Π)h/gi, "Φ").replace(/(c|k|Κ)h/gi, "Χ").replace(/(p|Π)s/gi, "Ψ").replace(/(k|Κ)s/gi, "Ξ")
    .replace(/[a-z]/gi, (ch) => one[ch.toLowerCase()] ?? ch)
    .toLocaleUpperCase("el")
    .replace(/\p{M}/gu, "")
    .slice(0, WORD_MAX);
}

const KEY = "mathesis:amphora";
const oneOf = <T extends string>(xs: readonly T[], x: unknown, d: T): T => (xs.includes(x as T) ? (x as T) : d);

/** A design read back from storage, with anything unexpected replaced by the default. */
export function cleanDesign(x: unknown): Design | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  if (o.v !== 1) return null;
  const d = DEFAULT_DESIGN;
  const words = Array.isArray(o.words) ? o.words : [];
  const strokes = Array.isArray(o.strokes) ? o.strokes.filter((s): s is Stroke =>
    !!s && typeof s === "object" && Number.isInteger((s as Stroke).c) && (s as Stroke).c >= -2 && (s as Stroke).c < PALETTE.length
    && ((s as Stroke).c !== -2 || /^#[0-9a-f]{6}$/i.test(String((s as Stroke).h)))
    && typeof (s as Stroke).w === "number" && (s as Stroke).w > 0 && (s as Stroke).w <= 80
    && Array.isArray((s as Stroke).p) && (s as Stroke).p.length % 3 === 0 && (s as Stroke).p.every((n) => typeof n === "number" && Number.isFinite(n))) : [];
  return {
    v: 1,
    style: o.style === "red" ? "red" : "black",
    neck: oneOf(BANDS, o.neck, d.neck), shoulder: oneOf(BANDS, o.shoulder, d.shoulder), frieze: oneOf(FRIEZES, o.frieze, d.frieze),
    lower: oneOf(BANDS, o.lower, d.lower), foot: oneOf(BANDS, o.foot, d.foot),
    words: [typeof words[0] === "string" ? toGreekCaps(words[0]) : "", typeof words[1] === "string" ? toGreekCaps(words[1]) : ""],
    strokes: strokes.map((st) => (st.c === -2 ? { c: -2, w: st.w, p: st.p, h: st.h!.toLowerCase() } : { c: st.c, w: st.w, p: st.p })),
    cracks: (Array.isArray(o.cracks) ? o.cracks : []).filter((c): c is Crack => !!c && typeof c === "object"
      && [c.x, c.y, c.f, c.s].every((n) => typeof n === "number" && Number.isFinite(n)) && c.f >= 0 && c.f <= 1).slice(0, MAX_CRACKS)
      .map((c) => ({ x: c.x, y: c.y, f: c.f, s: c.s })),
  };
}

export function loadDesign(): Design | null {
  try { const s = localStorage.getItem(KEY); return s ? cleanDesign(JSON.parse(s)) : null; } catch { return null; }
}

/** Keeps the design; false when the browser would not store it (too big, or storage switched off). */
export function saveDesign(d: Design | null): boolean {
  try {
    if (d) localStorage.setItem(KEY, JSON.stringify(d)); else localStorage.removeItem(KEY);
    return true;
  } catch { return false; }
}

export const pointCount = (d: Design) => d.strokes.reduce((n, s) => n + s.p.length / 3, 0);
