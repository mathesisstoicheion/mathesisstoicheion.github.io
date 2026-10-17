/**
 * Drawing the lyre page's two canvases (Lyre.tsx).
 *
 * The instrument is one of those in instruments.ts, a different one for each song, drawn at its own proportions and
 * made larger or smaller to fit, never stretched. It is painted once in its own colours, with the glints its edges
 * would catch from either side (`plate`); whenever the torch's light on it moves, those pictures are lit again by
 * copying them under the light (`lightBody`), which costs a few copies, not a repainting. Each frame then copies the lit
 * instrument and draws the strings over it, so a lyre being played costs very little to draw.
 *
 * Above it the roll: each string's lane, the song's notes coming down to the strings with their syllables, and what
 * has been played rising away from them as light.
 */
import { paintAlbedo, paintSheen, shapeOf, stringTops, type Design, type Shape } from "./instruments";

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

/** A light on the canvas, in its own pixels: the torch. */
export interface Lamp { x: number; y: number; I: number }

type RGB = [number, number, number];
const AMBIENT = 0.3;
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const rgb = ([r, g, b]: RGB, a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;
const mixRGB = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const GUT: RGB = [238, 222, 188];
const HONEY: RGB = [249, 223, 174];

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

/** How much light falls at a point: a little from the room, the rest from the torch, fading with distance. */
function lum(l: Lamp, x: number, y: number, R: number) { return AMBIENT + l.I * Math.pow(Math.max(0, 1 - Math.hypot(l.x - x, l.y - y) / R), 1.25); }

// ── the instrument ──────────────────────────────────────────────────────────────────────────────────────────────────

/** The instrument, painted once for its place on the canvas: in its colours, its glints from the left and from the
 *  right (each covering only its box), and its silhouette, small, so that drawn larger it is a soft shadow. */
export interface Plate { G: Geom; dpr: number; albedo: HTMLCanvasElement; sheen: [HTMLCanvasElement, HTMLCanvasElement] | null; shadow: HTMLCanvasElement }

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

/** The plate, without its glints yet (`glints` adds them when the page has a moment), so a new song's instrument
 *  appears at once. */
export function plate(G: Geom, dpr: number): Plate {
  const albedo = layer(G, dpr);
  paintAlbedo(units(albedo, G, dpr), G.design, G.shape);
  // the silhouette at an eighth of the size: drawn back at full size, it is blurred for nothing
  const k = 0.125, shadow = layer(G, k), sg = shadow.getContext("2d")!;
  sg.drawImage(albedo, 0, 0, shadow.width, shadow.height);
  sg.globalCompositeOperation = "source-in"; sg.fillStyle = "#000"; sg.fillRect(0, 0, shadow.width, shadow.height);
  return { G, dpr, albedo, sheen: null, shadow };
}

export function glints(P: Plate) {
  const { G, dpr } = P, sheen: [HTMLCanvasElement, HTMLCanvasElement] = [layer(G, dpr), layer(G, dpr)];
  paintSheen(units(sheen[0], G, dpr), G.design, G.shape, -1);
  paintSheen(units(sheen[1], G, dpr), G.design, G.shape, 1);
  P.sheen = sheen;
}

/** The instrument under the torch, into `g` (a canvas the size of the lyre's, in CSS pixels): a few copies of the
 *  plate's pictures and one gradient, so the light can follow the torch without repainting anything. */
export function lightBody(g: CanvasRenderingContext2D, P: Plate, l: Lamp, R: number) {
  const { G } = P, { box } = G;
  g.clearRect(box.x, box.y, box.w, box.h);
  g.drawImage(P.albedo, box.x, box.y, box.w, box.h);
  // darker away from the torch
  g.globalCompositeOperation = "source-atop";
  const dark = g.createRadialGradient(l.x, l.y, 0, l.x, l.y, R);
  for (const k of [0, 0.2, 0.45, 0.7, 1]) dark.addColorStop(k, `rgba(10,6,3,${clamp(1 - (AMBIENT + l.I * Math.pow(1 - k, 1.25)), 0, 0.92)})`);
  g.fillStyle = dark; g.fillRect(box.x, box.y, box.w, box.h);
  // the glints on the side the torch is on, as bright as the torch is near
  const cy = G.oy + G.s * 0.5, near = l.I * clamp(1 - Math.hypot(l.x - G.ox, l.y - cy) / (R * 1.6), 0, 1);
  const side = clamp((l.x - G.ox) / Math.max(1, G.s * G.shape.w * 0.6), -1, 1);
  g.globalCompositeOperation = "lighter";
  for (const [k, w] of [[0, 0.5 - side * 0.5], [1, 0.5 + side * 0.5]] as const) {
    const a = near * (0.08 + 0.92 * w);
    if (a > 0.02 && P.sheen) { g.globalAlpha = a; g.drawImage(P.sheen[k], box.x, box.y, box.w, box.h); }
  }
  // and behind it, its shadow on the stone, cast away from the torch
  const ddx = G.ox - l.x, ddy = cy - l.y, dl = Math.hypot(ddx, ddy) || 1, off = G.s * 0.03;
  g.globalCompositeOperation = "destination-over"; g.globalAlpha = 0.6;
  g.drawImage(P.shadow, box.x + (ddx / dl) * off, box.y + (ddy / dl) * off * 0.7 + off * 0.5, box.w, box.h);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
}

/** What a string is doing this frame: how far it swings (px) and how much it glows (0 to 1). */
export interface StringState { amp: number; glow: number }

/** The strings, over the lit instrument, and the key that plucks each. */
export function paintStrings(g: CanvasRenderingContext2D, G: Geom, l: Lamp, R: number, state: (i: number) => StringState, labels: (string | undefined)[] | null, face: string) {
  const { n, top, bot, yBridge, yTail, yBoard, yFree, narrow } = G;
  const ddx = G.ox - l.x, ddy = G.oy + G.s * 0.6 - l.y, dl = Math.hypot(ddx, ddy) || 1;
  const ox = (ddx / dl) * 3, oy = (ddy / dl) * 1.6 + 1.6;
  const thin = clamp(G.s / 380, 0.7, 1.1);
  for (let i = 0; i < n; i++) {
    const { amp, glow } = state(i);
    const xb = stringX(G, i, yBridge), mx = (top[i] + xb) / 2, my = (yFree + yBridge) / 2;
    const L = clamp(lum(l, top[i], my, R), 0, 1);
    const w = (0.7 + 0.9 * (1 - i / Math.max(1, n - 1))) * thin;   // the low strings are a little thicker
    // its shadow on the sounding board
    const xh = stringX(G, i, yBoard);
    g.beginPath(); g.moveTo(xh + ox, yBoard + oy); g.lineTo(xb + ox + amp * 0.3, yBridge + oy); g.lineTo(bot[i] + ox, yTail + oy);
    g.strokeStyle = "rgba(12,7,3,0.32)"; g.lineWidth = w + 0.6; g.stroke();
    const path = () => { g.beginPath(); g.moveTo(top[i], yFree); g.quadraticCurveTo(mx + amp * 2, my, xb, yBridge); g.lineTo(bot[i], yTail); };
    if (glow > 0.04) { path(); g.strokeStyle = rgb(HONEY, 0.2 * glow); g.lineWidth = w + 2 + 5 * glow; g.stroke(); }
    path();
    g.strokeStyle = rgb(mixRGB(GUT, HONEY, glow), clamp(0.34 + 0.62 * L + 0.4 * glow, 0, 1));
    g.lineWidth = w + 0.5 * glow; g.stroke();
  }
  if (labels) {
    g.textAlign = "center"; g.textBaseline = "alphabetic";
    const sp = n > 1 ? top[1] - top[0] : 30;
    g.font = `600 ${sp < 15 ? 9.5 : narrow ? 10 : 11}px ${face}`;
    for (let i = 0; i < n; i++) {
      const lab = labels[i];
      if (!lab) continue;
      const { glow } = state(i);
      g.fillStyle = glow > 0.05 ? rgb(HONEY, 0.6 + 0.4 * glow) : "rgba(191,176,154,0.7)";
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
export interface Flare { x: number; at: number; s: number }
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
  flares: Flare[];
  now: number;
  still: boolean;
  face: string;
  hint: string | null;
}

const PX_PER_BEAT = (H: number) => clamp(H / 9, 24, 52);

export function paintRoll(g: CanvasRenderingContext2D, s: RollScene) {
  const { W, H, lanes, notes, beat, now, face } = s;
  g.clearRect(0, 0, W, H);
  const sp = lanes.length > 1 ? Math.abs(lanes[1] - lanes[0]) : 40;
  // the lanes, faint lines cut in the stone above each string
  for (let i = 0; i < lanes.length; i++) {
    const gl = s.laneGlow(i);
    g.fillStyle = gl > 0.03 ? rgb(HONEY, 0.05 + 0.1 * gl) : "rgba(239,229,210,0.045)";
    g.fillRect(Math.round(lanes[i]) - (gl > 0.03 ? 1 : 0), 0, gl > 0.03 ? 2 : 1, H);
  }
  // what has been played: light rising from the strings, fading as it goes
  const RISE = 64;
  for (const t of s.trails) {
    const top = H - ((now - t.start) / 1000) * RISE;
    const bot = t.end === null ? H : H - ((now - t.end) / 1000) * RISE;
    if (bot < 0) continue;
    const w = clamp(sp * 0.4, 5, 15);
    const gr = g.createLinearGradient(0, Math.max(0, top), 0, bot);
    gr.addColorStop(0, "rgba(240,162,76,0)");
    gr.addColorStop(1, `rgba(240,162,76,${0.16 + 0.36 * t.s})`);
    g.fillStyle = gr;
    roundRect(g, t.x - w / 2, Math.max(0, top), w, Math.max(2, bot - Math.max(0, top)), 3);
    g.fill();
  }
  if (notes) {
    const ppb = PX_PER_BEAT(H);
    for (const [a, b] of s.gaps) {                    // a silence in the source
      const y1 = H - (a - beat) * ppb, y2 = H - (b - beat) * ppb;
      if (y1 < 0 || y2 > H) continue;
      g.fillStyle = "rgba(147,133,111,0.05)";
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
      let base: RGB = [239, 194, 122], a = 0.82 * fadeIn;
      if (look === "sounding" || look === "hit") { base = HONEY; a = 1; }
      if (look === "missed") { base = [166, 93, 64]; a = 0.42; }
      if (look === "sounding" || look === "hit") {
        g.fillStyle = rgb(HONEY, 0.18);
        roundRect(g, x - w / 2 - 4, yt - 4, w + 8, Math.max(6, yb - yt) + 8, 6); g.fill();
      }
      roundRect(g, x - w / 2, yt, w, Math.max(6, yb - yt), 4);
      const gr = g.createLinearGradient(0, yt, 0, yb);
      gr.addColorStop(0, rgb(mixRGB([40, 28, 16], base, 0.55), a)); gr.addColorStop(1, rgb(base, a));
      g.fillStyle = gr; g.fill();
      g.strokeStyle = `rgba(255,240,210,${0.18 * a})`; g.lineWidth = 1; g.stroke();
      if (look === "due") {                          // waiting for you: a slow breath of light
        const p = s.still ? 1 : 0.5 + 0.5 * Math.sin(now / 560);
        g.strokeStyle = rgb(HONEY, 0.35 + 0.5 * p); g.lineWidth = 1.6; g.stroke();
      }
      if (nt.syl) {
        g.fillStyle = look === "missed" ? "rgba(147,133,111,0.8)" : look === "sounding" || look === "hit" ? rgb(HONEY) : `rgba(239,229,210,${0.9 * fadeIn})`;
        g.fillText(nt.syl.replace(/-$/, ""), x, yt - 7);
      }
    }
  } else if (s.hint && !s.trails.length) {
    g.textAlign = "center"; g.fillStyle = "rgba(147,133,111,0.9)"; g.font = `400 15px ${face}`;
    g.fillText(s.hint, W / 2, H / 2);
  }
  // a flare where a note meets its string
  for (const f of s.flares) {
    const age = (now - f.at) / 1000;
    if (age > 0.7) continue;
    const r = 18 + 26 * f.s, k = 1 - age / 0.7;
    const gr = g.createRadialGradient(f.x, H, 0, f.x, H, r);
    gr.addColorStop(0, rgb(HONEY, 0.5 * k * f.s)); gr.addColorStop(1, rgb(HONEY, 0));
    g.fillStyle = gr; g.fillRect(f.x - r, H - r, 2 * r, r);
  }
  // the line where the notes reach the strings
  const lg = g.createLinearGradient(0, 0, W, 0);
  lg.addColorStop(0, "rgba(239,194,122,0)"); lg.addColorStop(0.5, "rgba(239,194,122,0.5)"); lg.addColorStop(1, "rgba(239,194,122,0)");
  g.fillStyle = lg; g.fillRect(0, H - 1.5, W, 1.5);
}
