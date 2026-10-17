/**
 * Carved letters (DESIGN.md: Texture and light). Each letter is cut as a V-groove. For 16 torch directions (and one
 * from straight above) the groove is lit once and kept as a sprite; a letter on the page is then one or two stamps from
 * its sprite, weighted by how near each light is, so the light rakes across the cut from the side the flame is on.
 */
import { boxBlur, canvas, clamp, DPR, smooth, type Art, type LocalLight } from "./common";
import { torchRadius, torchStill } from "@/lib/torch";

const NA = 16, ELEV = 0.62, cE = Math.cos(ELEV), sE = Math.sin(ELEV);
const DIRS = [...Array(NA)].map((_, k) => { const a = (k / NA) * Math.PI * 2; return [Math.cos(a) * cE, Math.sin(a) * cE]; });
type Pal = "night" | "day";
const PAL: Record<Pal, { hi: number[]; sh: number[]; base: number[]; bA: number; lit: number[]; lA: number }> = {
  night: { hi: [255, 202, 132], sh: [6, 4, 3], base: [5, 4, 3], bA: 0.46, lit: [176, 146, 110], lA: 0.3 },
  day: { hi: [255, 254, 248], sh: [92, 70, 48], base: [104, 84, 62], bA: 0.4, lit: [255, 255, 252], lA: 0.5 },
};
const SPR = new Map<string, HTMLCanvasElement>();
const CARVE_FONT = () => getComputedStyle(document.documentElement).getPropertyValue("--f-carved").trim() || '"Noto Serif Display", "GFS Didot", serif';

/** Forget every prepared letter (after the carving font has loaded, so letters are cut in the right face). */
export const clearSprites = () => SPR.clear();

function sprite(ch: string, s: number, pal: Pal) {
  const key = `${ch}|${s}|${pal}`;
  let c = SPR.get(key);
  if (c) return c;
  const t = canvas(s, s), x = t.getContext("2d", { willReadFrequently: true })!;
  x.fillStyle = "#000"; x.fillRect(0, 0, s, s); x.fillStyle = "#fff";
  if (ch === "·") { x.beginPath(); x.arc(s / 2, s * 0.5, Math.max(1.5, s * 0.055), 0, 7); x.fill(); }
  else if (ch !== " ") {
    x.font = `500 ${Math.round(s * 0.66)}px ${CARVE_FONT()}`; x.textAlign = "center"; x.textBaseline = "alphabetic";
    const m = x.measureText(ch), yb = s / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
    x.fillText(ch, s / 2, yb);
    x.strokeStyle = "#fff"; x.lineJoin = "round"; x.lineWidth = Math.max(1, s * 0.034); x.strokeText(ch, s / 2, yb);
  }
  const px = x.getImageData(0, 0, s, s).data, n = s * s, A = new Float32Array(n);
  for (let i = 0; i < n; i++) A[i] = px[i * 4] / 255;
  const r = Math.max(1, Math.round(s * 0.028));
  let D = boxBlur(A, s, s, r); D = boxBlur(D, s, s, r);
  const Z = new Float32Array(n);
  for (let i = 0; i < n; i++) { const a = A[i]; Z[i] = a < 0.01 ? 0 : a * (0.22 + 0.78 * smooth((D[i] - 0.3) / 0.62)); }
  const K = s * 0.12;
  c = canvas(s, s * (NA + 2));
  const cx = c.getContext("2d")!, out = cx.createImageData(s, s * (NA + 2)), o = out.data, Pl = PAL[pal];
  for (let y = 1; y < s - 1; y++) for (let xx = 1; xx < s - 1; xx++) {
    const i = y * s + xx, a = A[i];
    if (a < 0.02) continue;
    let nx = (Z[i + 1] - Z[i - 1]) * 0.5 * K, ny = (Z[i + s] - Z[i - s]) * 0.5 * K;
    const l = 1 / Math.sqrt(nx * nx + ny * ny + 1); nx *= l; ny *= l;
    const nz = l, ao = Z[i] * 0.5;
    let p = i * 4;
    {
      // the groove unlit: dark in its depth, its upper wall faintly lit by the room
      const ad = clamp(Pl.bA * (0.5 + 0.5 * Z[i]) + clamp(ny * 1.3, 0, 1) * 0.22, 0, 1), al = clamp(-ny * 1.5, 0, 1) * Pl.lA, at = al + ad * (1 - al);
      if (at > 0) { for (let q = 0; q < 3; q++) o[p + q] = (Pl.lit[q] * al + Pl.base[q] * ad * (1 - al)) / at; o[p + 3] = 255 * a * at; }
    }
    for (let k = 0; k <= NA; k++) {
      let hl: number, sh: number;
      if (k < NA) { const L = DIRS[k], dif = nx * L[0] + ny * L[1] + nz * sE - sE; hl = clamp(dif * 4.6, 0, 1); sh = clamp(-dif * 2.8 + ao * 0.45, 0, 1); }
      else { hl = clamp((nz - 0.93) * 3.6, 0, 0.24); sh = clamp((1 - nz) * 2.2 + ao * 0.3, 0, 1); }
      const tot = Math.min(1, hl + sh);
      if (tot < 0.004) continue;
      const f = hl / (hl + sh + 1e-6);
      p = ((k + 1) * n + i) * 4;
      o[p] = Pl.sh[0] + (Pl.hi[0] - Pl.sh[0]) * f; o[p + 1] = Pl.sh[1] + (Pl.hi[1] - Pl.sh[1]) * f; o[p + 2] = Pl.sh[2] + (Pl.hi[2] - Pl.sh[2]) * f; o[p + 3] = 255 * a * tot;
    }
  }
  cx.putImageData(out, 0, 0);
  SPR.set(key, c);
  return c;
}

interface Rect { left: number; right: number; top: number; bottom: number }
export interface CarvedOptions {
  text: string;
  /** letters per row, or a function of the width */
  cols?: number | ((w: number) => number);
  /** the cell's size in CSS pixels, from the width and the number of columns */
  cell: (w: number, cols: number) => number;
  /** fill the whole canvas with rows of the text, repeating it (the home page's wall) */
  fill?: boolean;
  /** the canvas is exactly as wide as its letters */
  fixedW?: boolean;
  /** where the letters stand in a canvas wider than they are: in the middle (the default) or at the start of the line */
  align?: "center" | "start";
  /** rows to leave room for (a carving that should not change height with its text) */
  boxRows?: number;
  /** boxes (in the canvas's own pixels) near which letters stay dim, so text over the wall stays readable */
  quiet?: (canvasRect: DOMRect) => Rect[];
  /** seconds over which the letters are cut in, one after another, and how long each takes */
  reveal?: number; dur?: number;
  /** cut in reading order, or diagonally across the wall */
  order?: "read" | "diag";
  /** how far each light reaches, as a share of the torch's radius */
  rad?: number;
  pal?: Pal;
}

interface Cell { spr: HTMLCanvasElement; dx: number; dy: number; cx: number; cy: number; q: number; q2: number; ord: number }

/** how far across a letter the chisel has gone, for a letter that is `a` of the way cut */
const cutTo = (a: number) => clamp(a * 1.15, 0, 1);

export class Carved implements Art {
  cv: HTMLCanvasElement; o: Required<Omit<CarvedOptions, "quiet" | "cols" | "boxRows" | "align">> & Pick<CarvedOptions, "quiet" | "cols" | "boxRows" | "align">;
  x: CanvasRenderingContext2D; cells: Cell[] = []; s = 8; t0: number | null; cache: HTMLCanvasElement | null = null;
  constructor(cv: HTMLCanvasElement, o: CarvedOptions) {
    this.cv = cv;
    this.o = { pal: "night", reveal: 1.6, dur: 0.9, order: "read", rad: 0.62, fill: false, fixedW: false, ...o };
    this.x = cv.getContext("2d")!;
    this.t0 = torchStill() || !this.o.reveal ? -1e9 : null;
  }
  layout() {
    const o = this.o, cv = this.cv, k = DPR(), txt = o.text;
    let w = cv.parentElement ? cv.parentElement.clientWidth : 0;
    if (!o.fixedW) w = cv.clientWidth || w;
    if (w < 4) return false;
    const cols = typeof o.cols === "function" ? o.cols(w) : o.cols || txt.length;
    const cell = o.cell(w, cols), s = Math.max(8, Math.round(cell * k)), cs = s / k;
    let rows: number, H: number;
    if (o.fill) { H = cv.clientHeight; rows = Math.ceil(H / cs); } else { rows = Math.ceil(txt.length / cols); H = (o.boxRows || rows) * cs; }
    const W = o.fixedW ? cols * cs : w;
    if (o.fixedW) cv.style.width = `${W}px`;
    if (!o.fill) cv.style.height = `${H}px`;
    cv.width = Math.round(W * k); cv.height = Math.round(H * k);
    const fillCols = o.fill ? Math.floor(cv.width / s) : cols;
    const ox = o.align === "start" ? 0 : Math.round((cv.width - fillCols * s) / 2), oy = Math.round((cv.height - rows * s) / 2);
    this.s = s; this.cells = [];
    const qs = o.quiet ? o.quiet(cv.getBoundingClientRect()) : [];
    const n = fillCols * rows;
    for (let idx = 0; idx < n; idx++) {
      const ch = o.fill ? txt[idx % txt.length] : txt[idx];
      if (!ch || ch === " ") continue;
      const i = idx % fillCols, j = Math.floor(idx / fillCols), dx = ox + i * s, dy = oy + j * s, cx = (dx + s / 2) / k, cy = (dy + s / 2) / k;
      let q = 1;
      for (const r of qs) { const ddx = Math.max(r.left - cx, 0, cx - r.right), ddy = Math.max(r.top - cy, 0, cy - r.bottom), dd = Math.hypot(ddx, ddy); q = Math.min(q, 0.16 + 0.84 * smooth(dd / (cs * 2.2))); }
      const ord = o.order === "diag" ? (i + j * 1.35) / (fillCols + rows * 1.35) : idx / Math.max(1, txt.length - 1);
      this.cells.push({ spr: sprite(ch, s, o.pal), dx, dy, cx, cy, q, q2: 0.3 + 0.7 * q, ord });
    }
    this.cache = null;
    return true;
  }
  private rev(c: Cell, now: number) {
    if (this.t0 === null) return 0;
    if (this.t0 < -1e8) return 1;
    return smooth((now - this.t0 - c.ord * this.o.reveal) / this.o.dur);
  }
  draw(now: number, ls: LocalLight[]) {
    const x = this.x, s = this.s, cv = this.cv;
    // a letter being cut shows only as far as the chisel has gone, left to right (the owner, 2026-10-17: "the animation
    // of stone inscriptions being carved in the stone"); `row` is which lighting of the letter to stamp
    const stamp = (c: Cell, row: number, a: number) => {
      const w = a >= 1 ? s : Math.max(1, Math.round(s * cutTo(a)));
      x.drawImage(c.spr, 0, row * s, w, s, c.dx, c.dy, w, s);
    };
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.clearRect(0, 0, cv.width, cv.height);
    let revealing = false;
    if (this.cache) x.drawImage(this.cache, 0, 0);
    else {
      for (const c of this.cells) { const a = this.rev(c, now); if (a < 1) revealing = true; if (a <= 0) continue; x.globalAlpha = Math.min(1, a * 1.8) * c.q; stamp(c, 0, a); }
      // once every letter is cut, the unlit wall is kept as one picture
      if (!revealing && this.t0 !== null) {
        const cc = canvas(cv.width, cv.height), y = cc.getContext("2d")!;
        for (const c of this.cells) { y.globalAlpha = c.q; y.drawImage(c.spr, 0, 0, s, s, c.dx, c.dy, s, s); }
        this.cache = cc;
      }
    }
    const R = torchRadius() * this.o.rad, R2 = R * R, day = this.o.pal === "day";
    for (const c of this.cells) {
      const a = this.cache ? 1 : this.rev(c, now);
      if (a <= 0) continue;
      for (const l of ls) {
        const I = l.I;
        if (I < 0.01) continue;
        const dx = l.x - c.cx, dy = l.y - c.cy, d2 = dx * dx + dy * dy;
        let L: number;
        if (day) L = I * a * 0.9;
        else { if (d2 > R2 * 30) continue; const f = R2 / (R2 + d2); L = Math.min(1, Math.pow(f, 1.25) * 1.35) * I * c.q2 * a; }
        if (L > 0.012) {
          const d = Math.sqrt(d2), dir = day ? 1 : d / (d + R * 0.25);
          let fi = (Math.atan2(dy, dx) / (Math.PI * 2)) * NA; fi = (fi + NA) % NA;
          const k0 = fi | 0, fr = fi - k0, k1 = (k0 + 1) % NA;
          x.globalAlpha = L * dir * (1 - fr); stamp(c, k0 + 1, a);
          if (fr > 0.02) { x.globalAlpha = L * dir * fr; stamp(c, k1 + 1, a); }
          if (dir < 0.97) { x.globalAlpha = L * (1 - dir); stamp(c, NA + 1, a); }
        }
      }
      // a letter that has just been cut catches the light once, softly, from above, and brightest at the fresh edge
      // where the chisel is
      if (a < 1 && !day) {
        const row = ((NA * 3) / 4 + 1) * s;
        x.globalAlpha = Math.sin(a * Math.PI) * 0.5 * c.q2; stamp(c, (NA * 3) / 4 + 1, a);
        const e = Math.round(s * cutTo(a)), ew = Math.max(2, Math.round(s * 0.09));
        if (e > 0 && e < s) { x.globalAlpha = Math.sin(a * Math.PI) * 0.9 * c.q2; x.drawImage(c.spr, Math.max(0, e - ew), row, ew, s, c.dx + Math.max(0, e - ew), c.dy, ew, s); }
      }
    }
    x.globalAlpha = 1;
    return revealing;
  }
}
