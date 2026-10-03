/**
 * Paints the vase's skin: a flat picture wrapped round the lathe, x running round the pot and y down its
 * profile. Three layers: the decoration chosen in the studio (base), the visitor's brushwork (hand, which
 * the rubber clears back to the decoration), and the two together, which is the texture the vase wears.
 */
import { PALETTE, type Band, type Design, type Stroke } from "@/lib/amphora";

export const TW = 2048, TH = 1024;
const GLOSS = PALETTE[0].hex, CLAY = PALETTE[1].hex, RED = PALETTE[2].hex, WHITE = PALETTE[3].hex;

export type Rect = { x: number; y: number; w: number; h: number };

const sheet = () => { const c = document.createElement("canvas"); c.width = TW; c.height = TH; return c; };

/** `pts`: the profile, evenly spaced along its length (foot first); `font`: the CSS family for the painted words. */
export function makePainter(pts: { x: number; y: number }[], font: string) {
  const N = pts.length - 1;
  const vOf = (y: number) => { for (let i = 0; i < N; i++) if (pts[i + 1].y >= y) return i / N; return 1; };
  const rowOf = (y: number) => (1 - vOf(y)) * TH;
  const rAt = (y: number) => { for (let i = 0; i < N; i++) if (pts[i + 1].y >= y) return pts[i].x; return 0.3; };
  let L = 0;
  for (let i = 1; i <= N; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  /** how much wider than tall one texture pixel is on the pot at radius r, so shapes are not stretched */
  const aspectR = (r: number) => (TW / (2 * Math.PI * Math.max(r, 0.06))) / (TH / L);
  const aspect = (y: number) => aspectR(rAt(y));

  const base = sheet(), hand = sheet(), out = sheet();
  const g = base.getContext("2d")!, h = hand.getContext("2d")!, o = out.getContext("2d")!;

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
  function segment(s: Pick<Stroke, "c" | "w">, x0: number, y0: number, x1: number, y1: number, a: number): Rect[] {
    if (x1 - x0 > TW / 2) x1 -= TW; else if (x0 - x1 > TW / 2) x1 += TW; // the short way round, across the seam
    if (x0 === x1 && y0 === y1) x1 += 0.01;
    h.globalCompositeOperation = s.c < 0 ? "destination-out" : "source-over";
    h.strokeStyle = s.c < 0 ? "#000" : PALETTE[s.c].hex;
    h.lineWidth = s.w * 2; h.lineCap = "round"; h.lineJoin = "round";
    const out: Rect[] = [];
    const px = s.w * a + 2, py = s.w + 2;
    for (const dx of [-TW, 0, TW]) {
      const lo = Math.min(x0, x1) + dx - px, hi = Math.max(x0, x1) + dx + px;
      if (hi < 0 || lo > TW) continue;
      h.setTransform(a, 0, 0, 1, 0, 0);
      h.beginPath(); h.moveTo((x0 + dx) / a, y0); h.lineTo((x1 + dx) / a, y1); h.stroke();
      out.push({ x: Math.max(0, lo), y: Math.max(0, Math.min(y0, y1) - py), w: Math.min(TW, hi) - Math.max(0, lo), h: Math.abs(y1 - y0) + 2 * py });
    }
    h.setTransform(1, 0, 0, 1, 0, 0);
    return out;
  }
  function replay(strokes: Stroke[]) {
    h.globalCompositeOperation = "source-over";
    h.clearRect(0, 0, TW, TH);
    for (const s of strokes) {
      const p = s.p;
      for (let i = 0; i + 2 < p.length; i += 3) {
        const j = i >= 3 ? i - 3 : i;
        segment(s, p[j], p[j + 1], p[i], p[i + 1], p[i + 2] / 100);
      }
    }
  }
  function compose(rects?: Rect[]) {
    for (const r of rects ?? [{ x: 0, y: 0, w: TW, h: TH }]) {
      const x = Math.max(0, Math.floor(r.x)), y = Math.max(0, Math.floor(r.y)), w = Math.min(TW - x, Math.ceil(r.w) + 2), hh = Math.min(TH - y, Math.ceil(r.h) + 2);
      if (w <= 0 || hh <= 0) continue;
      o.drawImage(base, x, y, w, hh, x, y, w, hh);
      o.drawImage(hand, x, y, w, hh, x, y, w, hh);
    }
  }

  return { canvas: out, paintBase, replay, compose, segment, aspectR };
}
