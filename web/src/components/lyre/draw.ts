/**
 * Drawing the lyre page's two canvases (Lyre.tsx), on the printed page (redesign SPEC.md 4.4: "the lyre stays").
 *
 * The instrument is one of those in instruments.ts, a different one for each song, drawn at its own proportions and
 * made larger or smaller to fit, never stretched. It is painted once in its own colours, evenly, as a coloured plate
 * prints an object: no lamp, no glints, no shadow, nothing glows (`plate`, `inkBody`). Each frame copies it and draws
 * the strings over it in the page's ink, so a lyre being played costs very little to draw.
 *
 * Above it the roll: each string's lane a hairline, the song's notes coming down to the strings in the brown ink with
 * their syllables, the note sounding now in red, and what has been played rising away from them as a fading red trail.
 * Every colour is the page's own (`readInks`), so Paper and Night both read.
 */
import { paintAlbedo, shapeOf, stringTops, type Design, type Shape } from "./instruments";

export interface Geom {
  W: number; H: number; n: number; cx: number;
  design: Design; shape: Shape;
  /** pixels to the instrument's unit (its height), and where its top middle is */
  s: number; ox: number; oy: number;
  /** each string's x at the yoke (where the roll's lanes are) and at the tailpiece */
  top: number[]; bot: number[];
  yBar: number; yBridge: number; yTail: number; yBoard: number;
  /** where the strings leave the yoke, and where the keys' letters go */
  yFree: number; yLabel: number;
  /** the part of the canvas the instrument and its shadow cover */
  box: { x: number; y: number; w: number; h: number };
  narrow: boolean;
}

type RGB = [number, number, number];
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const rgb = ([r, g, b]: RGB, a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;
const mixRGB = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** The page's inks (styles/tokens.css) as the canvases need them: the ink, its two lighter shades, the red, and the
 *  hairline (with its own strength). Read again whenever Paper or Night changes (Lyre.tsx). */
export interface Inks { ink: RGB; ink2: RGB; ink3: RGB; red: RGB; rule: RGB; ruleA: number }
export function readInks(): Inks {
  const cs = getComputedStyle(document.documentElement);
  const c = document.createElement("canvas").getContext("2d")!;
  const one = (name: string, fallback: string): [number, number, number, number] => {
    c.fillStyle = fallback;
    c.fillStyle = cs.getPropertyValue(name).trim() || fallback;
    const v = String(c.fillStyle);
    if (v[0] === "#") return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16), 1];
    const m = (v.match(/[\d.]+/g) ?? ["0", "0", "0"]).map(Number);
    return [m[0], m[1], m[2], m[3] ?? 1];
  };
  const [r0, r1, r2, ra] = one("--rule", "rgba(30,26,21,0.2)");
  return {
    ink: one("--ink", "#1e1a15").slice(0, 3) as RGB, ink2: one("--ink-2", "#5c5043").slice(0, 3) as RGB,
    ink3: one("--ink-3", "#675846").slice(0, 3) as RGB, red: one("--rubric", "#a3301a").slice(0, 3) as RGB,
    rule: [r0, r1, r2], ruleA: ra,
  };
}

export function geometry(W: number, H: number, design: Design): Geom {
  const shape = shapeOf(design), n = design.n, narrow = W < 560;
  const padT = narrow ? 8 : 10, padB = 6;
  const s = Math.min(H - padT - padB, (W - 16) / shape.w);
  const ox = W / 2, oy = H - padB - s;
  const X = (u: number) => ox + u * s, Y = (v: number) => oy + v * s;
  const tops = stringTops(shape, n), k = shape.topSpan > 0 ? shape.botSpan / shape.topSpan : 1;
  const m = Math.ceil(s * 0.04) + 4;
  const x0 = Math.max(0, Math.floor(X(-shape.w / 2) - m)), x1 = Math.min(W, Math.ceil(X(shape.w / 2) + m));
  const y0 = Math.max(0, Math.floor(oy - m)), y1 = Math.min(H, Math.ceil(Y(1) + m));
  return {
    W, H, n, cx: ox, design, shape, s, ox, oy,
    top: tops.map(X), bot: tops.map((u) => X(u * k)),
    yBar: Y(shape.barY), yBridge: Y(shape.bridgeY), yTail: Y(shape.tailY), yBoard: Y(shape.boardY),
    yFree: Y(shape.barY + shape.barH * 0.62), yLabel: Y(shape.barY - shape.barH * 0.75) - 6,
    box: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 },
    narrow,
  };
}

/** Where string `i` is at height `y` (they lean from the yoke to the tailpiece). */
export function stringX(G: Geom, i: number, y: number) {
  const f = clamp((y - G.yBar) / (G.yTail - G.yBar), 0, 1);
  return G.top[i] + (G.bot[i] - G.top[i]) * f;
}

// ── the instrument ──────────────────────────────────────────────────────────────────────────────────────────────────

/** The instrument, painted once for its place on the canvas, in its own colours (covering only its box). */
export interface Plate { G: Geom; dpr: number; albedo: HTMLCanvasElement }

function layer(G: Geom, k: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(G.box.w * k)); c.height = Math.max(1, Math.round(G.box.h * k));
  return c;
}
/** A context set to the instrument's units, `k` canvas pixels to a CSS pixel. */
function units(c: HTMLCanvasElement, G: Geom, k: number) {
  const g = c.getContext("2d")!;
  g.setTransform(k * G.s, 0, 0, k * G.s, k * (G.ox - G.box.x), k * (G.oy - G.box.y));
  return g;
}

/** The plate, so a new song's instrument appears at once. */
export function plate(G: Geom, dpr: number): Plate {
  const albedo = layer(G, dpr);
  paintAlbedo(units(albedo, G, dpr), G.design, G.shape);
  return { G, dpr, albedo };
}

/** The instrument into `g` (a canvas the size of the lyre's, in CSS pixels), evenly, as printed. */
export function inkBody(g: CanvasRenderingContext2D, P: Plate) {
  const { box } = P.G;
  g.clearRect(box.x, box.y, box.w, box.h);
  g.drawImage(P.albedo, box.x, box.y, box.w, box.h);
}

/** What a string is doing this frame: how far it swings (px), and how strongly it sounds (0 to 1), which turns it red. */
export interface StringState { amp: number; glow: number }

/** The strings, over the instrument, in the page's ink (red while they sound), and the key that plucks each. */
export function paintStrings(g: CanvasRenderingContext2D, G: Geom, state: (i: number) => StringState, labels: (string | undefined)[] | null, face: string, inks: Inks) {
  const { n, top, bot, yBridge, yTail, yFree, narrow } = G;
  const thin = clamp(G.s / 380, 0.7, 1.1);
  for (let i = 0; i < n; i++) {
    const { amp, glow } = state(i);
    const xb = stringX(G, i, yBridge), mx = (top[i] + xb) / 2, my = (yFree + yBridge) / 2;
    const w = (0.7 + 0.9 * (1 - i / Math.max(1, n - 1))) * thin;   // the low strings are a little thicker
    g.beginPath(); g.moveTo(top[i], yFree); g.quadraticCurveTo(mx + amp * 2, my, xb, yBridge); g.lineTo(bot[i], yTail);
    g.strokeStyle = rgb(mixRGB(inks.ink2, inks.red, clamp(glow * 1.6, 0, 1)), 0.9);
    g.lineWidth = w + 0.4 * glow; g.stroke();
  }
  if (labels) {
    g.textAlign = "center"; g.textBaseline = "alphabetic";
    const sp = n > 1 ? top[1] - top[0] : 30;
    g.font = `600 ${sp < 15 ? 9.5 : narrow ? 10 : 11}px ${face}`;
    for (let i = 0; i < n; i++) {
      const lab = labels[i];
      if (!lab) continue;
      const { glow } = state(i);
      g.fillStyle = glow > 0.05 ? rgb(inks.red) : rgb(inks.ink3);
      g.fillText(lab, top[i], G.yLabel);
    }
  }
}

export function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + rr, y); g.arcTo(x + w, y, x + w, y + h, rr); g.arcTo(x + w, y + h, x, y + h, rr);
  g.arcTo(x, y + h, x, y, rr); g.arcTo(x, y, x + w, y, rr); g.closePath();
}

// ── the roll ─────────────────────────────────────────────────────────────────────────────────────────────────────────
export interface RollNote { m: number; t: number; d: number; syl?: string }
export interface Trail { x: number; start: number; end: number | null; s: number }
export type NoteLook = "coming" | "sounding" | "hit" | "missed" | "due" | "past";

export interface RollScene {
  W: number; H: number;
  lanes: number[];
  /** lanes lit by a sounding string (0 to 1) */
  laneGlow: (i: number) => number;
  notes: RollNote[] | null;
  gaps: [number, number][];
  beat: number;
  laneOf: (m: number) => number;
  look: (i: number) => NoteLook;
  trails: Trail[];
  now: number;
  face: string;
  inks: Inks;
  hint: string | null;
}

const PX_PER_BEAT = (H: number) => clamp(H / 9, 24, 52);

export function paintRoll(g: CanvasRenderingContext2D, s: RollScene) {
  const { W, H, lanes, notes, beat, now, face, inks } = s;
  g.clearRect(0, 0, W, H);
  const sp = lanes.length > 1 ? Math.abs(lanes[1] - lanes[0]) : 40;
  // the lanes, hairlines above each string; a sounding string's lane in red
  for (let i = 0; i < lanes.length; i++) {
    const gl = s.laneGlow(i);
    g.fillStyle = gl > 0.03 ? rgb(inks.red, 0.25 + 0.4 * gl) : rgb(inks.rule, inks.ruleA * 0.6);
    g.fillRect(Math.round(lanes[i]) - (gl > 0.03 ? 1 : 0), 0, gl > 0.03 ? 2 : 1, H);
  }
  // what has been played: a trail of red ink rising from the strings, fading as it goes
  const RISE = 64;
  for (const t of s.trails) {
    const top = H - ((now - t.start) / 1000) * RISE;
    const bot = t.end === null ? H : H - ((now - t.end) / 1000) * RISE;
    if (bot < 0) continue;
    const w = clamp(sp * 0.4, 5, 15);
    const gr = g.createLinearGradient(0, Math.max(0, top), 0, bot);
    gr.addColorStop(0, rgb(inks.red, 0));
    gr.addColorStop(1, rgb(inks.red, 0.2 + 0.4 * t.s));
    g.fillStyle = gr;
    roundRect(g, t.x - w / 2, Math.max(0, top), w, Math.max(2, bot - Math.max(0, top)), 2);
    g.fill();
  }
  if (notes) {
    const ppb = PX_PER_BEAT(H);
    for (const [a, b] of s.gaps) {                    // a silence in the source
      const y1 = H - (a - beat) * ppb, y2 = H - (b - beat) * ppb;
      if (y1 < 0 || y2 > H) continue;
      g.fillStyle = rgb(inks.rule, inks.ruleA * 0.3);
      g.fillRect(0, Math.max(0, y2), W, Math.min(H, y1) - Math.max(0, y2));
    }
    const w = clamp(sp * 0.58, 8, 24);
    g.textAlign = "center"; g.textBaseline = "alphabetic";
    g.font = `500 ${sp < 30 ? 12 : 15}px ${face}`;
    for (let i = 0; i < notes.length; i++) {
      const nt = notes[i];
      const yb = H - (nt.t - beat) * ppb;
      const yt = yb - nt.d * ppb + 3;
      if (yt > H) continue;
      if (yb < -24) break;
      const look = s.look(i);
      if (look === "past") continue;
      const x = s.laneOf(nt.m);
      const fadeIn = clamp((yb + 20) / 60, 0, 1);    // notes come in softly at the top
      const sounding = look === "sounding" || look === "hit";
      // a note: a bar of the brown ink, red while it sounds, faint once missed
      roundRect(g, x - w / 2, yt, w, Math.max(6, yb - yt), 2);
      g.fillStyle = sounding ? rgb(inks.red) : look === "missed" ? rgb(inks.ink3, 0.3) : rgb(inks.ink3, 0.85 * fadeIn);
      g.fill();
      if (look === "due") {                          // waiting for you: ringed in red, still
        g.strokeStyle = rgb(inks.red); g.lineWidth = 1.6; g.stroke();
      }
      if (nt.syl) {
        g.fillStyle = look === "missed" ? rgb(inks.ink3, 0.8) : sounding ? rgb(inks.red) : rgb(inks.ink2, 0.95 * fadeIn);
        g.fillText(nt.syl.replace(/-$/, ""), x, yt - 7);
      }
    }
  } else if (s.hint && !s.trails.length) {
    g.textAlign = "center"; g.fillStyle = rgb(inks.ink3); g.font = `italic 400 16px ${face}`;
    g.fillText(s.hint, W / 2, H / 2);
  }
  // the line where the notes reach the strings: a hairline of ink across the roll
  g.fillStyle = rgb(inks.ink, 0.55); g.fillRect(0, H - 1, W, 1);
}
