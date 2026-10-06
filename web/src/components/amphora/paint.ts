/**
 * Paints the vase's skin: a flat picture wrapped round the lathe, x running round the pot and y down its
 * profile. Layers: the decoration chosen in the studio (base), the visitor's brushwork (hand, which the rubber
 * clears back to the decoration), and the two together with the cracks on top (out), which is the picture the
 * vase wears. Two smaller pictures shape its surface: its relief (bump: the potter's wheel marks, the grooves of
 * cracks, chips) and how glossy each part is (rough: black gloss shines, bare clay is matt).
 * Everything is drawn in a 2048 × 1024 "design" picture and scaled by k to the size actually used (k = 2 on a
 * capable computer, for a 4096 × 2048 surface), so a design looks the same at any size.
 */
import { PALETTE, type Band, type Crack, type Design, type Stroke } from "@/lib/amphora";
import { CrackField, strike, type Fracture, type Surface } from "./cracks";

export const TW = 2048, TH = 1024;
const GLOSS = PALETTE[0].hex, CLAY = PALETTE[1].hex, RED = PALETTE[2].hex, WHITE = PALETTE[3].hex;

export type Rect = { x: number; y: number; w: number; h: number };

const sheet = (w: number, h: number) => { const c = document.createElement("canvas"); c.width = Math.round(w); c.height = Math.round(h); return c; };

/** `pts`: the profile, evenly spaced along its length (foot first); `font`: the CSS family for the painted words; `k`: the scale. */
export function makePainter(pts: { x: number; y: number }[], font: string, k = 1) {
  const N = pts.length - 1;
  const vOf = (y: number) => { for (let i = 0; i < N; i++) if (pts[i + 1].y >= y) return i / N; return 1; };
  const rowOf = (y: number) => (1 - vOf(y)) * TH;
  const rAt = (y: number) => { for (let i = 0; i < N; i++) if (pts[i + 1].y >= y) return pts[i].x; return 0.3; };
  let L = 0;
  for (let i = 1; i <= N; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  /** how much wider than tall one texture pixel is on the pot at radius r, so shapes are not stretched */
  const aspectR = (r: number) => (TW / (2 * Math.PI * Math.max(r, 0.06))) / (TH / L);
  const aspect = (y: number) => aspectR(rAt(y));

  const ks = k / 2;   // the relief and gloss pictures are half the size: they vary slowly
  const base = sheet(TW * k, TH * k), hand = sheet(TW * k, TH * k), out = sheet(TW * k, TH * k);
  const bump = sheet(TW * ks, TH * ks), rough = sheet(TW * ks, TH * ks);
  const g = base.getContext("2d")!, h = hand.getContext("2d")!, o = out.getContext("2d", { willReadFrequently: false })!;
  const b = bump.getContext("2d")!, r = rough.getContext("2d", { willReadFrequently: true })!;
  const rAtRow = (y: number) => pts[Math.max(0, Math.min(N, Math.round((1 - y / TH) * N)))].x;
  const surface: Surface = { W: TW, H: TH, sx: (y) => TW / (2 * Math.PI * Math.max(rAtRow(y), 0.06)), sy: TH / L };

  const fill = (y0: number, y1: number, c: string) => { g.fillStyle = c; g.fillRect(0, rowOf(y1), TW, rowOf(y0) - rowOf(y1)); };
  /** draw `fn` three times, a turn apart, so whatever crosses the seam at the back of the pot joins up */
  const wrapped = (fn: () => void) => { for (const dx of [-TW, 0, TW]) { g.save(); g.translate(dx, 0); fn(); g.restore(); } };

  // ---- the ornament bands ------------------------------------------------------------------
  function band(kind: Band, y0: number, y1: number) {
    const top = rowOf(y1), bot = rowOf(y0), H = bot - top, a = aspect((y0 + y1) / 2);
    if (kind === "black" || kind === "clay") { fill(y0, y1, kind === "black" ? GLOSS : CLAY); return; }
    fill(y0, y1, CLAY);
    g.fillStyle = GLOSS; g.strokeStyle = GLOSS; g.lineCap = "round"; g.lineJoin = "round";
    const rules = () => { g.fillRect(0, top, TW, H * 0.07); g.fillRect(0, bot - H * 0.07, TW, H * 0.07); };
    const cells = (w: number) => { const n = Math.max(6, Math.round(TW / w)); return { n, w: TW / n }; };
    switch (kind) {
      case "meander": {
        const { n, w: cw } = cells(H * a);
        g.lineWidth = H * 0.1; g.lineCap = "square";
        for (let i = 0; i < n; i++) {
          const x = i * cw, u = cw / 20, v = H / 20;
          g.beginPath();
          g.moveTo(x, top + v); g.lineTo(x + cw, top + v); g.moveTo(x, top + 19 * v); g.lineTo(x + cw, top + 19 * v);
          g.moveTo(x + 3 * u, top + 19 * v); g.lineTo(x + 3 * u, top + 4 * v); g.lineTo(x + 16 * u, top + 4 * v); g.lineTo(x + 16 * u, top + 16 * v);
          g.lineTo(x + 7 * u, top + 16 * v); g.lineTo(x + 7 * u, top + 8 * v); g.lineTo(x + 12 * u, top + 8 * v); g.lineTo(x + 12 * u, top + 12 * v);
          g.stroke();
        }
        break;
      }
      case "wave": { // the running wave: a line that curls over into a spiral, again and again
        rules();
        const { n, w: cw } = cells(H * 1.25 * a), R = H * 0.3, cy = top + H * 0.47;
        g.lineWidth = H * 0.1;
        g.beginPath();
        for (let i = 0; i < n; i++) {
          const cx = i * cw + cw * 0.55;
          g.moveTo(i * cw, cy + R);
          g.lineTo(cx, cy + R);
          for (let t = 0; t <= 2.3 * Math.PI; t += 0.12) {
            const r = R * (1 - t / (3.1 * Math.PI)), th = Math.PI / 2 - t;
            g.lineTo(cx + r * Math.cos(th) * a, cy + r * Math.sin(th));
          }
        }
        g.stroke();
        break;
      }
      case "tongues": { // hanging from the top of the band, every third one red
        const { n, w } = cells(H * 0.55 * a);
        for (let i = 0; i < n; i++) {
          g.fillStyle = i % 3 === 1 ? RED : GLOSS; g.beginPath();
          g.moveTo(i * w + 3, top); g.lineTo(i * w + w - 3, top); g.lineTo(i * w + w - 3, top + H * 0.5);
          g.quadraticCurveTo(i * w + w / 2, bot + H * 0.15, i * w + 3, top + H * 0.5); g.fill();
        }
        break;
      }
      case "dots": {
        rules();
        const { n, w } = cells(H * 0.9 * a), cy = (top + bot) / 2;
        for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? RED : GLOSS; g.beginPath(); g.ellipse(i * w + w / 2, cy, H * 0.24 * a, H * 0.24, 0, 0, 7); g.fill(); }
        break;
      }
      case "zigzag": {
        rules();
        const { n, w } = cells(H * 0.8 * a);
        g.lineWidth = H * 0.11; g.beginPath(); g.moveTo(0, bot - H * 0.24);
        for (let i = 0; i < n; i++) { g.lineTo(i * w + w / 2, top + H * 0.24); g.lineTo(i * w + w, bot - H * 0.24); }
        g.stroke();
        break;
      }
      case "ivy": { // a wavy stem with heart-shaped leaves, above and below by turns
        rules();
        const { n, w } = cells(H * 1.5 * a), cy = (top + bot) / 2, amp = H * 0.13;
        g.lineWidth = H * 0.05; g.beginPath(); g.moveTo(0, cy);
        for (let x = 0; x <= TW; x += 4) g.lineTo(x, cy + amp * Math.sin((x / w) * 2 * Math.PI));
        g.stroke();
        for (let i = 0; i < n * 2; i++) {
          const x = (i + 0.25) * (w / 2), up = i % 2 === 0, s = H * 0.2;
          const y = cy + amp * Math.sin((x / w) * 2 * Math.PI) + (up ? -s * 0.4 : s * 0.4);
          g.save(); g.translate(x, y); g.scale(a, up ? -1 : 1);
          g.beginPath(); g.moveTo(0, -s * 0.2);
          g.bezierCurveTo(-s * 0.9, -s * 1.0, -s * 0.9, s * 0.5, 0, s * 1.1);
          g.bezierCurveTo(s * 0.9, s * 0.5, s * 0.9, -s * 1.0, 0, -s * 0.2);
          g.fillStyle = i % 4 === 1 ? RED : GLOSS; g.fill(); g.restore();
        }
        break;
      }
      case "rays": { // rising from the foot
        const { n, w } = cells(H * 0.35 * a);
        for (let i = 0; i < n; i++) { g.beginPath(); g.moveTo(i * w + 3, bot); g.lineTo(i * w + w / 2, top + H * 0.08); g.lineTo(i * w + w - 3, bot); g.fill(); }
        break;
      }
    }
  }

  // ---- the main band, round the belly ---------------------------------------------------------
  const Y0 = 0.68, Y1 = 1.44;
  function word(text: string, cx: number, x0: number, x1: number, yT: number, yB: number, ink: string, dots: string) {
    if (!text) return;
    const a = aspect(1.06);
    g.save();
    g.translate(cx, yT + (yB - yT) * 0.58); g.scale(a, 1);
    let fs = (yB - yT) * 0.3;
    const f = (px: number) => `700 ${px}px ${font}`;
    g.font = f(fs);
    const maxW = ((x1 - x0) * 0.86) / a, mw = g.measureText(text).width;
    if (mw > maxW) { fs *= maxW / mw; g.font = f(fs); }
    g.fillStyle = ink; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, 0, 0);
    g.fillStyle = dots;
    for (const dx of [-1, 1]) { g.beginPath(); g.arc(dx * (Math.min(mw, maxW) / 2 + fs * 0.35), 0, fs * 0.09, 0, 7); g.fill(); }
    g.restore();
  }
  /** a palmette, the fan of leaves painted beneath the handles, on its two curling tendrils */
  function palmette(cx: number, ink: string) {
    const yB = rowOf(Y0 + 0.07), yT = rowOf(Y1 - 0.08), H = yB - yT, a = aspect(1.06);
    g.save(); g.translate(cx, yB); g.scale(a, 1);
    g.strokeStyle = ink; g.lineWidth = H * 0.035; g.lineCap = "round";
    for (const s of [-1, 1]) { // the tendrils: from the root, out and over into a spiral
      g.beginPath(); g.moveTo(0, -H * 0.04);
      for (let t = 0; t <= 2.2 * Math.PI; t += 0.1) {
        const r = H * 0.15 * (1 - t / (2.8 * Math.PI)), th = -Math.PI / 2 + t;
        g.lineTo(s * (H * 0.24 + r * Math.cos(th)), -H * 0.1 + r * Math.sin(th));
      }
      g.stroke();
    }
    const n = 9, root = -H * 0.22;
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1) - 0.5, ang = k * 2.3, len = H * (0.62 - Math.abs(k) * 0.32);
      g.save(); g.translate(0, root); g.rotate(ang);
      g.beginPath(); g.ellipse(0, -len / 2, H * 0.055, len / 2, 0, 0, 7);
      g.fillStyle = i % 2 ? RED : ink; g.fill(); g.restore();
    }
    g.beginPath(); g.ellipse(0, root, H * 0.09, H * 0.07, 0, 0, 7); g.fillStyle = ink; g.fill();
    g.restore();
  }
  function frieze(d: Design) {
    const red = d.style === "red", ground = red ? GLOSS : CLAY, ink = red ? CLAY : GLOSS, dots = red ? WHITE : RED;
    const yT = rowOf(1.36), yB = rowOf(0.76);
    if (d.frieze === "clay" || d.frieze === "black") { fill(Y0, Y1, d.frieze === "clay" ? CLAY : GLOSS); return; }
    fill(0.66, 0.68, RED); fill(1.44, 1.46, RED);
    // the words face front and back (u = 0 and ½); the handles stand at the sides (u = ¼ and ¾)
    const half = 0.115 * TW;
    if (d.frieze === "open") {
      fill(Y0, Y1, ground);
      if (!red) { fill(Y0, Y0 + 0.012, GLOSS); fill(Y1 - 0.012, Y1, GLOSS); }
      wrapped(() => {
        [0, 0.5].forEach((u, i) => word(d.words[i], u * TW, u * TW - half * 1.2, u * TW + half * 1.2, yT, yB, ink, dots));
        [0.25, 0.75].forEach((u) => palmette(u * TW, ink));
      });
      return;
    }
    fill(Y0, Y1, GLOSS);
    wrapped(() => [0, 0.5].forEach((u, i) => {
      const x0 = u * TW - half, x1 = u * TW + half;
      g.fillStyle = ground; g.fillRect(x0, yT, x1 - x0, yB - yT);
      const th = (yB - yT) * 0.12, tw = th * 0.8 * aspect(1.3), tn = Math.round((x1 - x0) / tw), tww = (x1 - x0) / tn;
      for (let k = 0; k < tn; k++) { // tongues along the top of the panel
        g.fillStyle = k % 2 ? RED : ink; g.beginPath();
        g.moveTo(x0 + k * tww + 2, yT); g.lineTo(x0 + (k + 1) * tww - 2, yT); g.lineTo(x0 + (k + 1) * tww - 2, yT + th * 0.55);
        g.quadraticCurveTo(x0 + (k + 0.5) * tww, yT + th * 1.25, x0 + k * tww + 2, yT + th * 0.55); g.fill();
      }
      word(d.words[i], u * TW, x0, x1, yT, yB, ink, dots);
      g.strokeStyle = red ? CLAY : GLOSS; g.lineWidth = 5; g.strokeRect(x0 + 10, yT + 4, x1 - x0 - 20, yB - yT - 8);
    }));
  }

  function paintBase(d: Design) {
    g.setTransform(k, 0, 0, k, 0, 0);
    g.globalCompositeOperation = "source-over";
    g.fillStyle = CLAY; g.fillRect(0, 0, TW, TH);
    // foot: black up to the rays, which rise from it
    if (d.foot === "clay" || d.foot === "black") fill(0, 0.48, d.foot === "clay" ? CLAY : GLOSS);
    else { fill(0, 0.2, GLOSS); band(d.foot, 0.2, 0.46); fill(0.46, 0.48, GLOSS); }
    if (d.lower === "clay" || d.lower === "black") fill(0.48, 0.66, d.lower === "clay" ? CLAY : GLOSS);
    else band(d.lower, 0.5, 0.64);
    frieze(d);
    if (d.shoulder === "clay" || d.shoulder === "black") fill(1.46, 1.62, d.shoulder === "clay" ? CLAY : GLOSS);
    else band(d.shoulder, 1.47, 1.62);
    // neck: black, with a band of pattern left in the clay
    if (d.neck === "clay" || d.neck === "black") fill(1.62, 2.3, d.neck === "clay" ? CLAY : GLOSS);
    else { fill(1.62, 2.3, GLOSS); band(d.neck, 1.72, 1.86); }
    // the fired surface is never perfectly even
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(255,230,200,${rnd() * 0.05})`; g.fillRect(rnd() * TW, rnd() * TH, 2, 2); }
  }

  // ---- the brush ------------------------------------------------------------------------------
  /** One step of a stroke, from one point to the next, in texture pixels; returns the area it changed. */
  function segment(s: Pick<Stroke, "c" | "w" | "h">, x0: number, y0: number, x1: number, y1: number, a: number): Rect[] {
    if (x1 - x0 > TW / 2) x1 -= TW; else if (x0 - x1 > TW / 2) x1 += TW; // the short way round, across the seam
    if (x0 === x1 && y0 === y1) x1 += 0.01;
    h.globalCompositeOperation = s.c === -1 ? "destination-out" : "source-over";
    h.strokeStyle = s.c === -2 ? s.h ?? "#000" : s.c < 0 ? "#000" : PALETTE[s.c].hex;
    h.lineWidth = s.w * 2; h.lineCap = "round"; h.lineJoin = "round";
    const out: Rect[] = [];
    const px = s.w * a + 2, py = s.w + 2;
    for (const dx of [-TW, 0, TW]) {
      const lo = Math.min(x0, x1) + dx - px, hi = Math.max(x0, x1) + dx + px;
      if (hi < 0 || lo > TW) continue;
      h.setTransform(a * k, 0, 0, k, 0, 0);
      h.beginPath(); h.moveTo((x0 + dx) / a, y0); h.lineTo((x1 + dx) / a, y1); h.stroke();
      out.push({ x: Math.max(0, lo), y: Math.max(0, Math.min(y0, y1) - py), w: Math.min(TW, hi) - Math.max(0, lo), h: Math.abs(y1 - y0) + 2 * py });
    }
    h.setTransform(1, 0, 0, 1, 0, 0);
    return out;
  }
  function replay(strokes: Stroke[]) {
    h.globalCompositeOperation = "source-over";
    h.setTransform(1, 0, 0, 1, 0, 0);
    h.clearRect(0, 0, hand.width, hand.height);
    for (const s of strokes) {
      const p = s.p;
      for (let i = 0; i + 2 < p.length; i += 3) {
        const j = i >= 3 ? i - 3 : i;
        segment(s, p[j], p[j + 1], p[i], p[i + 1], p[i + 2] / 100);
      }
    }
  }
  // ---- cracks ----------------------------------------------------------------------------------
  let field = new CrackField(TW), fractures: Fracture[] = [];
  const boxHits = (bx: [number, number, number, number], rc: Rect) =>
    [-TW, 0, TW].some((dx) => bx[0] + dx < rc.x + rc.w && bx[2] + dx > rc.x && bx[1] < rc.y + rc.h && bx[3] > rc.y);
  /** Draw a fracture (the part of it from `from` to `to`, 0–1, while it spreads) in colour or in relief. */
  function drawFracture(cx: CanvasRenderingContext2D, fr: Fracture, scale: number, relief: boolean, from = 0, to = 1) {
    cx.lineCap = "round"; cx.lineJoin = "round";
    for (const dx of [-TW, 0, TW]) {
      cx.setTransform(scale, 0, 0, scale, dx * scale, 0);
      if (from === 0 && fr.chip.length) {
        cx.beginPath();
        for (let i = 0; i < fr.chip.length; i += 2) cx.lineTo(fr.chip[i], fr.chip[i + 1]);
        cx.closePath();
        if (relief) { cx.fillStyle = "rgb(70,70,70)"; cx.fill(); cx.strokeStyle = "rgb(175,175,175)"; cx.lineWidth = 1.2; cx.stroke(); }
        else {
          // the gloss flakes off and shows the paler clay of the body beneath, with a dark broken edge
          cx.fillStyle = "#d9935f"; cx.fill();
          cx.strokeStyle = "rgba(24,14,8,0.75)"; cx.lineWidth = 0.8; cx.stroke();
        }
      }
      for (const p of fr.paths) {
        const n = p.pts.length / 3, i0 = Math.floor(from * (n - 1)), i1 = Math.ceil(to * (n - 1));
        for (let pass = 0; pass < 2; pass++) {
          for (let i = Math.max(1, i0); i <= i1; i++) {
            const j = i * 3, w = p.pts[j + 2];
            cx.beginPath();
            if (relief) {
              cx.strokeStyle = pass ? "rgb(25,25,25)" : "rgba(0,0,0,0.22)"; cx.lineWidth = pass ? w * 1.4 + 0.6 : w * 3.4 + 1.5;
              cx.moveTo(p.pts[j - 3], p.pts[j - 2]); cx.lineTo(p.pts[j], p.pts[j + 1]);
            } else if (pass === 0) {
              // a pale edge where the gloss has broken away along the crack, so it shows on black as well as on clay
              cx.strokeStyle = "rgba(240,205,165,0.32)"; cx.lineWidth = w + 1.3;
              cx.moveTo(p.pts[j - 3] + 0.6, p.pts[j - 2] + 0.6); cx.lineTo(p.pts[j] + 0.6, p.pts[j + 1] + 0.6);
            } else {
              cx.strokeStyle = "rgba(14,9,6,0.94)"; cx.lineWidth = w;
              cx.moveTo(p.pts[j - 3], p.pts[j - 2]); cx.lineTo(p.pts[j], p.pts[j + 1]);
            }
            cx.stroke();
          }
        }
      }
    }
    cx.setTransform(1, 0, 0, 1, 0, 0);
  }
  /** The relief with no cracks: the faint ridges a potter's fingers leave on a wheel-thrown pot, and grain. */
  function plainRelief() {
    b.setTransform(1, 0, 0, 1, 0, 0);
    const img = b.createImageData(bump.width, bump.height), d = img.data;
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let y = 0; y < bump.height; y++) {
      const yy = y / ks;
      const ridge = 128 + 5 * Math.sin(yy * 0.47) + 2.2 * Math.sin(yy * 1.31 + 1.7);
      for (let x = 0; x < bump.width; x++) {
        const v = ridge + (rnd() - 0.5) * 7, i = (y * bump.width + x) * 4;
        d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
      }
    }
    b.putImageData(img, 0, 0);
  }
  /** All the cracks again, from the list of blows (after an undo, or when the vase opens). */
  function rebuildCracks(cracks: Crack[]) {
    field = new CrackField(TW);
    fractures = cracks.map((c) => strike(c, surface, field));
    plainRelief();
    for (const fr of fractures) drawFracture(b, fr, ks, true);
  }
  /** A new blow: its cracks are worked out and returned, to be drawn as they spread (drawCrack). */
  function addCrack(c: Crack): Fracture {
    const fr = strike(c, surface, field);
    fractures.push(fr);
    return fr;
  }
  /** The part of a spreading crack from `from` to `to`, drawn straight onto the vase and its relief; returns where. */
  function drawCrack(fr: Fracture, from: number, to: number): Rect[] {
    drawFracture(o, fr, k, false, from, to);
    drawFracture(b, fr, ks, true, from, to);
    const rects: Rect[] = [];
    for (const dx of [-TW, 0, TW]) {
      const x0 = Math.max(0, fr.box[0] + dx), x1 = Math.min(TW, fr.box[2] + dx);
      if (x1 > x0) rects.push({ x: x0, y: Math.max(0, fr.box[1]), w: x1 - x0, h: Math.min(TH, fr.box[3]) - Math.max(0, fr.box[1]) });
    }
    return rects;
  }
  /** The colour of the vase at a point (for the chips that fly off). */
  function colourAt(x: number, y: number): string {
    const px = o.getImageData(Math.max(0, Math.min(out.width - 1, Math.round(x * k))), Math.max(0, Math.min(out.height - 1, Math.round(y * k))), 1, 1).data;
    return `rgb(${px[0]},${px[1]},${px[2]})`;
  }
  /** How glossy each part is, read from its colour: the black gloss shines; clay and added colours less. */
  function glossFrom(rc: Rect) {
    const x = Math.max(0, Math.floor(rc.x * ks)), y = Math.max(0, Math.floor(rc.y * ks));
    const w = Math.min(rough.width - x, Math.ceil(rc.w * ks) + 2), hh = Math.min(rough.height - y, Math.ceil(rc.h * ks) + 2);
    if (w <= 0 || hh <= 0) return;
    r.setTransform(1, 0, 0, 1, 0, 0);
    r.drawImage(out, (x / ks) * k, (y / ks) * k, (w / ks) * k, (hh / ks) * k, x, y, w, hh);
    const img = r.getImageData(x, y, w, hh), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      const v = lum < 34 ? 0.2 : lum < 70 ? 0.2 + ((lum - 34) / 36) * 0.38 : 0.6;
      d[i] = d[i + 1] = d[i + 2] = v * 255;
    }
    r.putImageData(img, x, y);
  }

  /** Base, brushwork and cracks together, in the given areas (design pixels), or everywhere. */
  function compose(rects?: Rect[]) {
    for (const rc of rects ?? [{ x: 0, y: 0, w: TW, h: TH }]) {
      const x = Math.max(0, Math.floor(rc.x * k)), y = Math.max(0, Math.floor(rc.y * k));
      const w = Math.min(out.width - x, Math.ceil(rc.w * k) + 2), hh = Math.min(out.height - y, Math.ceil(rc.h * k) + 2);
      if (w <= 0 || hh <= 0) continue;
      o.setTransform(1, 0, 0, 1, 0, 0);
      o.drawImage(base, x, y, w, hh, x, y, w, hh);
      o.drawImage(hand, x, y, w, hh, x, y, w, hh);
      const here = fractures.filter((fr) => boxHits(fr.box, rc));
      if (here.length) {
        o.save(); o.beginPath(); o.rect(x, y, w, hh); o.clip();
        for (const fr of here) drawFracture(o, fr, k, false);
        o.restore();
      }
      glossFrom(rc);
    }
  }

  return { canvas: out, bump, rough, k, paintBase, replay, compose, segment, aspectR, rebuildCracks, addCrack, drawCrack, colourAt };
}
