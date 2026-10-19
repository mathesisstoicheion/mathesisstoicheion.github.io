"use client";
/**
 * The library's Socrates, spelled out of Plato's Apology (GOLD-AND-LAMPLIGHT-PLAN.md; design A, DESIGN.md "Socrates spelled
 * out of the Apology"). Socrates wrote nothing, so his face is drawn from the speech Plato gave him: every letter is the
 * speech in reading order (Burnet's Oxford text via Perseus, data/apology-wall.ts), and only their brightness draws the face.
 *
 * As the window rises into view, loose letters gather into his face; as it goes on up, the face lets go from the crown down
 * and its letters fall into a papyrus roll, the speech in capitals with no spaces, in columns between two rolled ends, as a
 * book was written in his day. Kept only if it holds frame rate on a phone (the owner's condition), so: the face and the roll
 * are each drawn once into a picture of their own, and each frame moves only a few hundred letters over them; nothing is
 * drawn while the window is off screen. With reduced motion the face stands still.
 *
 * Portrait: Roman marble, 1st century AD, Musée du Louvre; photograph by Eric Gaba, public domain (data/images.json,
 * socrates-louvre), cropped and turned grey for this.
 */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { prefersReducedMotion, useLight, useSettings } from "@/lib/settings";
import styles from "./SocratesRoll.module.css";

const CAPS = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
const LOOSE = "αβγδεζηθικλμνξοπρστυφχψω" + CAPS;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const smooth = (k: number) => k * k * (3 - 2 * k);
/** Greek as written in Plato's time: capitals, no accents, no spaces (the iota under a vowel written beside it). */
const caps = (s: string) => s.normalize("NFD").replace(/[̀-̈́͆-ͯ]/g, "").replace(/ͅ/g, "ι").toUpperCase().replace(/[^Α-Ω]/g, "");
/** A text set in lines of n letters, broken only between words. */
function wrap(s: string, n: number) {
  const out: string[] = [];
  let line = "";
  for (const w of s.split(" ")) {
    if (!line) line = w; else if (line.length + 1 + w.length <= n) line += " " + w; else { out.push(line.padEnd(n)); line = w; }
    while (line.length > n) { out.push(line.slice(0, n)); line = line.slice(n); }
  }
  if (line) out.push(line.padEnd(n));
  return out;
}

type Atlas = { cv: HTMLCanvasElement; idx: Map<string, [number, number]>[]; cw: number; ch: number };
/** Each letter drawn once in three weights; the scene then stamps them, far cheaper than drawing text. */
function atlas(chars: string[], px: number, font: string, colour: string, dpr: number): Atlas {
  const F = px * dpr * 1.6, cw = Math.ceil(F * 1.3), ch = Math.ceil(F * 1.7), styles = [[400, 0.84], [400, 1.04], [700, 1.2]] as const;
  const total = chars.length * styles.length, per = Math.ceil(Math.sqrt((total * ch) / cw));
  const cv = document.createElement("canvas");
  cv.width = per * cw; cv.height = Math.ceil(total / per) * ch;
  const x = cv.getContext("2d")!;
  x.textAlign = "center"; x.textBaseline = "alphabetic"; x.fillStyle = colour;
  const idx = styles.map(() => new Map<string, [number, number]>());
  let n = 0;
  styles.forEach(([w, s], si) => {
    x.font = `${w} ${(F * s).toFixed(1)}px ${font}`;
    for (const c of chars) { const sx = (n % per) * cw, sy = Math.floor(n / per) * ch; x.fillText(c, sx + cw / 2, sy + ch * 0.7); idx[si].set(c, [sx, sy]); n++; }
  });
  return { cv, idx, cw, ch };
}

type Flyer = { fx: number; fy: number; rx: number; ry: number; sx: number; sy: number; ph: number; w1: number; w2: number; amp: number; at: number; d: number; c: string; c2: string; g: number; dx: number; dy: number };
type Scene = { w: number; h: number; cw: number; ch: number; face: HTMLCanvasElement; roll: HTMLCanvasElement; fly: Flyer[]; A: Atlas; gw: number; gh: number; rows: { y: number; xs: number[]; cs: string[] }[]; slots: { x: number; y: number; c: string }[]; colour: string };

function build(img: HTMLImageElement, text: string, w: number, h: number, dpr: number, font: string, colour: string): Scene {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const asp = img.width / img.height;
  let boxH = h * 0.94, boxW = boxH * asp;
  if (boxW > w * 0.92) { boxW = w * 0.92; boxH = boxW / asp; }
  const bx = (w - boxW) / 2, by = (h - boxH) / 2;
  const cols = clamp(Math.round(boxW / 6.2), 40, 80), cw = boxW / cols, ch = cw * 1.26, rows = Math.floor(boxH / ch);
  // the picture's brightness, cell by cell; the features sharpened against their surroundings, the tones stretched
  const sc = document.createElement("canvas");
  sc.width = cols; sc.height = rows;
  const sx = sc.getContext("2d", { willReadFrequently: true })!;
  sx.drawImage(img, 0, 0, cols, rows);
  const d = sx.getImageData(0, 0, cols, rows).data, N = cols * rows, G = new Float32Array(N), Bl = new Float32Array(N);
  for (let k = 0; k < N; k++) G[k] = (0.3 * d[k * 4] + 0.59 * d[k * 4 + 1] + 0.11 * d[k * 4 + 2]) / 255;
  const rad = Math.max(2, Math.round(cols / 22));
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    let s = 0, c = 0;
    for (let v = Math.max(0, j - rad); v <= Math.min(rows - 1, j + rad); v++) for (let u = Math.max(0, i - rad); u <= Math.min(cols - 1, i + rad); u++) { s += G[v * cols + u]; c++; }
    Bl[j * cols + i] = s / c;
  }
  for (let k = 0; k < N; k++) G[k] = G[k] < 0.1 ? G[k] : clamp(G[k] + 1.1 * (G[k] - Bl[k]), 0, 1);
  const lit = [...G].filter((v) => v > 0.12).sort((a, b) => a - b), lo = lit[Math.floor(lit.length * 0.04)] ?? 0.1, hi = lit[Math.floor(lit.length * 0.98)] ?? 1;
  for (let k = 0; k < N; k++) G[k] = Math.pow(clamp((G[k] - lo) / (hi - lo), 0, 1), 1.25);

  const CAPS_TEXT = caps(text), chars = [...new Set(text + LOOSE)].filter((c) => c !== " ");
  const A = atlas(chars, cw * 1.24, font, colour, dpr), gw = A.cw / (dpr * 1.6), gh = A.ch / (dpr * 1.6);
  const stamp = (x: CanvasRenderingContext2D, c: string, g: number, px: number, py: number, a: number, s = 1) => {
    const p = A.idx[g < 0.3 ? 0 : g < 0.6 ? 1 : 2].get(c);
    if (!p || a < 0.012) return;
    x.globalAlpha = a > 1 ? 1 : a;
    x.drawImage(A.cv, p[0], p[1], A.cw, A.ch, px - (gw * s) / 2, py - gh * s * 0.7, gw * s, gh * s);
  };
  const pic = () => { const c = document.createElement("canvas"); c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); const x = c.getContext("2d")!; x.setTransform(dpr, 0, 0, dpr, 0, 0); return { c, x }; };

  // the face: the speech in reading order, each letter as bright as the marble under it
  const lines = wrap(text, cols), face = pic(), faceRows: Scene["rows"] = [];
  for (let j = 0; j < rows; j++) {
    const line = lines[j % lines.length], y = by + j * ch + ch * 0.86, row = { y, xs: [] as number[], cs: [] as string[] };
    for (let i = 0; i < cols; i++) {
      const c = line[i], g = G[j * cols + i], px = bx + (i + 0.5) * cw;
      if (c === " ") continue;
      stamp(face.x, c, g, px, y, 0.05 + 1.3 * g);
      if (g > 0.3) { row.xs.push(px); row.cs.push(c); }
    }
    faceRows.push(row);
  }

  // the roll: the speech in capitals, in columns, between two rolled ends shaded like cylinders
  const rW = Math.min(w * 0.94, boxW * 1.18), C2 = Math.max(30, Math.floor(rW / cw)), R2 = Math.max(14, Math.round((C2 * cw * 0.56) / ch));
  const rx = (w - C2 * cw) / 2, ry = (h - R2 * ch) / 2, rl = Math.max(3, Math.round(C2 * 0.075)), top = 1, bot = R2 - 2, t0 = rl + 2, t1 = C2 - rl - 2;
  const ncol = t1 - t0 >= 40 ? 3 : 2, gap = Math.max(2, Math.round((t1 - t0) * 0.07)), cc = Math.floor((t1 - t0 - gap * (ncol - 1)) / ncol);
  const roll = pic(), slots: Scene["slots"] = [];
  const put = (gx: number, l: number, g: number, c: string | null, text = false) => {
    const x = rx + (gx + 0.5) * cw, y = ry + l * ch + ch * 0.86, s = c ?? CAPS[(gx * 7 + l * 13) % 24];
    stamp(roll.x, s, g, x, y, 0.05 + 1.3 * g);
    if (text) slots.push({ x, y, c: s });
  };
  let ci = 0;
  for (let c = 0; c < ncol; c++) for (let l = top + 2; l <= bot - 2; l++) for (let i = 0; i < cc; i++) put(t0 + c * (cc + gap) + i, l, 0.48 + 0.14 * rnd(), CAPS_TEXT[ci++ % CAPS_TEXT.length], true);
  for (const l of [top, bot]) for (let gx = rl; gx < C2 - rl; gx++) put(gx, l, 0.3, null);
  for (const side of [0, 1]) for (let l = 0; l < R2; l++) for (let i = 0; i < rl; i++) {
    const u = (i + 0.5) / rl, sh = Math.pow(Math.sin(Math.PI * u), 0.7) * (side ? 0.82 + 0.18 * u : 1 - 0.18 * u);
    put(side ? C2 - rl + i : i, l, (0.14 + 0.78 * sh) * (l === 0 || l === R2 - 1 ? 0.55 : 1), null);
  }

  // the letters that travel: a few hundred of the face's brighter ones, each with a roll letter to become
  const bright: number[] = [];
  for (let k = 0; k < N; k++) if (G[k] > 0.28 && lines[Math.floor(k / cols) % lines.length][k % cols] !== " ") bright.push(k);
  const want = Math.min(170, bright.length), fly: Flyer[] = [];
  for (let q = 0; q < want; q++) {
    const k = bright[Math.floor(((q + rnd() * 0.9) * bright.length) / want)] ?? bright[0], j = Math.floor(k / cols), i = k % cols, sl = slots[Math.floor(((q + 0.5) * slots.length) / want)];
    fly.push({
      fx: bx + (i + 0.5) * cw, fy: by + j * ch + ch * 0.86, rx: sl.x, ry: sl.y, sx: rnd() * w, sy: rnd() * h, ph: rnd() * 6.3, w1: 0.12 + rnd() * 0.25, w2: 0.1 + rnd() * 0.22, amp: 14 + rnd() * 36,
      at: (j / rows) * 0.45 + rnd() * 0.25, d: 0.3 * (j / rows) + 0.5 * rnd(), c: lines[j % lines.length][i], c2: sl.c, g: G[k], dx: (rnd() - 0.5) * 60, dy: 30 + rnd() * 90,
    });
  }
  return { w, h, cw, ch, face: face.c, roll: roll.c, fly, A, gw, gh, rows: faceRows, slots, colour };
}

export default function SocratesRoll() {
  const box = useRef<HTMLDivElement>(null), cvs = useRef<HTMLCanvasElement>(null), faceRef = useRef<HTMLCanvasElement>(null), rollRef = useRef<HTMLCanvasElement>(null);
  const belowRef = useRef<HTMLDivElement>(null), aboveRef = useRef<HTMLDivElement>(null);
  const light = useLight();
  const motion = useSettings((s) => s.motion);
  useEffect(() => {
    const host = box.current, cv = cvs.current, faceCv = faceRef.current, rollCv = rollRef.current, below = belowRef.current, above = aboveRef.current;
    if (!host || !cv || !faceCv || !rollCv || !below || !above) return;
    let alive = true, raf = 0, on = false, S: Scene | null = null, last = -1, lastP = -1;
    const still = prefersReducedMotion(motion);
    const img = new Image();
    let text = "";
    const dpr = Math.min(1.25, window.devicePixelRatio || 1);

    // three layers: the face and the roll, each drawn once into a canvas of its own and only moved, faded or uncovered
    // by the compositor (a soft curtain of the window's own colour slides over the face); and the letters in flight, the
    // only drawing done frame by frame
    const make = () => {
      if (!img.complete || !img.naturalWidth || !text) return;
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      const cs = getComputedStyle(cv);
      S = build(img, text, w, h, dpr, cs.fontFamily || "serif", cs.color);
      for (const [el, src] of [[cv, null], [faceCv, S.face], [rollCv, S.roll]] as const) {
        const k = src ? dpr : 1;   // the letters in flight are drawn at plain resolution: they move, and it halves the work
        el.width = Math.round(w * k); el.height = Math.round(h * k);
        if (src) el.getContext("2d")!.drawImage(src, 0, 0);
      }
      lastP = -1;
      draw(performance.now());
    };
    const progress = () => { const r = host.getBoundingClientRect(), vh = window.innerHeight; return clamp((vh - r.top) / (vh + r.height), 0, 1); };
    let flying = true;
    const draw = (now: number, paint = true) => {
      if (!S) return;
      const t = now / 1000, p = still ? 0.5 : progress();
      // gathered as the whole window comes into view, then a roll while it is still in view (on a phone the window is
      // whole on screen for only about a fifth of its journey, so both happen within it)
      const a = still ? 1 : smooth(clamp((p - 0.08) / 0.32, 0, 1)), m = still ? 0 : smooth(clamp((p - 0.47) / 0.14, 0, 1));
      // the curtains are each twice the window's height, soft at one edge: below covers what is under the edge, above what is over it
      const H = S.h, reach = 1.32;
      below.style.transform = `translateY(${((-0.16 + a * reach) * H).toFixed(1)}px)`;
      above.style.transform = `translateY(${((m * reach - 2) * H).toFixed(1)}px)`;
      faceCv.style.transform = m > 0 ? `translateY(${(m * S.ch * 5).toFixed(1)}px)` : "";
      faceCv.style.opacity = m >= 1 ? "0" : "1";
      rollCv.style.opacity = m.toFixed(3);
      lastP = p;
      if (!paint) return;
      const x = cv.getContext("2d")!, moving = !still && (a < 1 || (m > 0 && m < 1));
      if (!moving && still) { if (flying) { x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height); flying = false; } return; }
      x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height); flying = true;
      const { A, gw, gh } = S;
      const stamp = (c: string, g: number, px: number, py: number, al: number, sc = 1) => {
        const q = A.idx[g < 0.3 ? 0 : g < 0.6 ? 1 : 2].get(c);
        if (!q || al < 0.012) return;
        x.globalAlpha = al > 1 ? 1 : al;
        x.drawImage(A.cv, q[0], q[1], A.cw, A.ch, px - (gw * sc) / 2, py - gh * sc * 0.7, gw * sc, gh * sc);
      };
      if (a < 1) {
        // before he gathers: loose letters wander slowly in the dark, then come home to their places in his face
        for (const f of S.fly) {
          const k = clamp((a - f.at) / 0.3, 0, 1), e = 1 - Math.pow(1 - k, 3), ox = f.sx + Math.sin(t * f.w1 + f.ph) * f.amp, oy = f.sy + Math.cos(t * f.w2 + f.ph * 1.3) * f.amp * 0.7;
          if (k >= 1) continue;
          stamp(k < 0.85 ? LOOSE[(f.ph * 9 + Math.floor(t * 0.6 + f.ph)) % LOOSE.length | 0] : f.c, f.g, ox + (f.fx - ox) * e, oy + (f.fy - oy) * e, (0.22 + 0.3 * f.g) * (0.5 + 0.5 * k) * (1 - k * k * 0.6));
        }
      } else if (m > 0 && m < 1) {
        // the face lets go from the crown down; each travelling letter drops a little, then glides to its place on the roll
        for (const f of S.fly) {
          const k = clamp((m * 1.5 - f.d) / 0.55, 0, 1);
          if (k <= 0 || k >= 1) continue;
          const e = k < 0.5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k), u = 1 - e, cx = f.fx + f.dx, cy = f.fy + f.dy;
          stamp(k > 0.8 ? f.c2 : f.c, f.g + (0.55 - f.g) * e, u * u * f.fx + 2 * u * e * cx + e * e * f.rx, u * u * f.fy + 2 * u * e * cy + e * e * f.ry, 0.35 + 0.5 * f.g);
        }
      } else {
        // at rest: a slow light reads the speech, across his face or along the roll's columns
        const cs: string[] = [], xs: number[] = [], ys: number[] = [];
        if (m >= 1) {
          const i0 = Math.floor(t * 9) % S.slots.length;
          for (let k = Math.max(0, i0 - 40); k <= i0; k++) { const sl = S.slots[k]; cs.push(sl.c); xs.push(sl.x); ys.push(sl.y); }
        } else {
          const rows = S.rows.filter((r) => r.xs.length > 8), cp = t * 9;
          let n = Math.floor(cp) % rows.reduce((sum, r) => sum + r.xs.length, 0), r = 0;
          while (n >= rows[r].xs.length) n -= rows[r++].xs.length;
          for (let k = Math.max(0, n - 40); k <= n; k++) { cs.push(rows[r].cs[k]); xs.push(rows[r].xs[k]); ys.push(rows[r].y); }
        }
        const L = cs.length - 1;
        cs.forEach((c, k) => { const al = Math.exp(-(L - k) / 12); stamp(c, 0.9, xs[k], ys[k], 0.25 + 0.75 * al, 1 + 0.26 * al); });
        if (L >= 0) {
          const gx = xs[L], gy = ys[L] - S.ch * 0.4, R = S.ch * 3.2, g = x.createRadialGradient(gx, gy, 0, gx, gy, R);
          g.addColorStop(0, light ? "rgba(255,226,170,.5)" : "rgba(255,190,110,.4)"); g.addColorStop(1, "rgba(255,150,60,0)");
          x.globalAlpha = 1; x.globalCompositeOperation = light ? "multiply" : "lighter"; x.fillStyle = g; x.fillRect(gx - R, gy - R, 2 * R, 2 * R); x.globalCompositeOperation = "source-over";
        }
      }
      x.globalAlpha = 1;
    };
    const frame = (now: number) => {
      raf = 0;
      if (!alive || !on) return;
            // the window's layers follow the scroll every frame (the compositor moves them); the letters in flight are redrawn
      // about thirty times a second, which keeps a slow phone smooth
      const due = now - last > 32;
      if (due) last = now;
      if (due || Math.abs(progress() - lastP) > 0.0005) draw(now, due);
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      if (on && !still && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(host);
    const ro = new ResizeObserver(() => { if (S && (S.w !== host.clientWidth || S.h !== host.clientHeight)) make(); });
    ro.observe(host);
    img.onload = make;
    img.src = "/images/socrates-apology.jpg";
    Promise.all([import("@/data/apology-wall"), document.fonts?.ready]).then(([m]) => { if (!alive) return; text = m.APOLOGY_OPENING; make(); });
    return () => { alive = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [light, motion]);

  return (
    <section className={styles.band} aria-labelledby="socrates-h">
      <div ref={box} className={`art-window ${styles.win}`}>
        <canvas ref={faceRef} className={styles.cv} aria-hidden="true" />
        <div ref={belowRef} className={`${styles.curtain} ${styles.below}`} aria-hidden="true" />
        <div ref={aboveRef} className={`${styles.curtain} ${styles.above}`} aria-hidden="true" />
        <canvas ref={rollRef} className={`${styles.cv} ${styles.roll}`} aria-hidden="true" />
        <canvas ref={cvs} className={styles.cv} role="img" aria-label="The face of Socrates, made of the Greek letters of Plato's Apology; as you scroll on, the letters fall into a papyrus roll" />
      </div>
      <div className={styles.words}>
        <p className="label">From the shelves</p>
        <h2 id="socrates-h" className={styles.h}>Socrates, in his own defence</h2>
        <p lang="grc" className={styles.gr}>ἀπολογία Σωκράτους</p>
        <p>Socrates wrote nothing. This face is spelled from the speech Plato gave him at his trial, the <i>Apology</i>, letter by letter in reading order. Scroll on and it falls into a papyrus roll, the speech written in capitals with no spaces, as books were in his day.</p>
        <Link href="/read?w=tlg0059.tlg002" transitionTypes={["page-turn"]} className={styles.go}>Read the Apology <span aria-hidden="true">→</span></Link>
        <small className={styles.src}>Greek text: Burnet, Oxford, via the Perseus Digital Library. Portrait: Roman marble, Musée du Louvre; photograph Eric Gaba, public domain.</small>
      </div>
    </section>
  );
}
