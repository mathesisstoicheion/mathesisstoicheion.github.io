/**
 * Drawing the lyre page's two canvases (Lyre.tsx).
 *
 * The instrument is a chelys (χέλυς, "tortoise", and so a lyre: in the Homeric Hymn to Hermes the first lyre is strung on a
 * tortoise's shell): a shell with a hide stretched over it for a sounding board, two curving arms (πήχεις, "the horns of
 * the lyre"), a crossbar between them (ζυγόν) with a peg for each string (κόλλοψ), a bridge on the hide (μαγάς), and a
 * tailpiece below it that holds the strings taut (χορδοτόνον). The Greek words are as LSJ gives them. It is painted once into a layer
 * of its own, lit by the site's torch, and repainted only when the light on it moves; each frame then copies that layer
 * and draws the strings over it, so a lyre being played costs very little to draw.
 *
 * Above it the roll: each string's lane, the song's notes coming down to the strings with their syllables, and what
 * has been played rising away from them as light.
 */

export interface Geom {
  W: number; H: number; n: number; cx: number;
  /** each string's x at the crossbar (where the roll's lanes are) and at the tailpiece */
  top: number[]; bot: number[];
  yBar: number; yBridge: number; yTail: number;
  shell: { cx: number; cy: number; rx: number; ry: number };
  /** half the distance between the arms where they meet the crossbar */
  armX: number;
  narrow: boolean;
}

/** A light on the canvas, in its own pixels: the torch. */
export interface Lamp { x: number; y: number; I: number }

type RGB = [number, number, number];
const AMBIENT = 0.2;
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const rgb = ([r, g, b]: RGB, a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;
const mixRGB = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// the materials, each as [lit, in shadow]
const WOOD: [RGB, RGB] = [[184, 128, 70], [30, 19, 10]];
const BAR: [RGB, RGB] = [[198, 146, 88], [34, 22, 12]];
const SHELL: [RGB, RGB] = [[158, 104, 50], [22, 14, 8]];
const HIDE: [RGB, RGB] = [[228, 206, 164], [48, 37, 26]];
const LEATHER: [RGB, RGB] = [[214, 180, 128], [44, 31, 19]];
const BRIDGE: [RGB, RGB] = [[222, 178, 116], [38, 26, 15]];
const GUT: RGB = [238, 222, 188];
const HONEY: RGB = [249, 223, 174];

export function geometry(W: number, H: number, n: number): Geom {
  const narrow = W < 560;
  const span = Math.min(W - (narrow ? 92 : 170), Math.max(1, n - 1) * (narrow ? 40 : 50), 720);
  const sp = n > 1 ? span / (n - 1) : 0;
  const cx = W / 2;
  const top = Array.from({ length: n }, (_, i) => cx + (i - (n - 1) / 2) * sp);
  const fan = 0.7;                                   // the strings gather a little towards the tailpiece
  const bot = top.map((x) => cx + (x - cx) * fan);
  const yBar = 42;
  const ry = H * 0.215, cy = H - ry - 12;
  const yTail = cy + ry * 0.6, yBridge = cy - ry * 0.12;
  const f = (yBridge - yBar) / (yTail - yBar), atBridge = span * (1 - f * (1 - fan));
  const rx = Math.min(W / 2 - 8, Math.max(atBridge / 2 + 44, ry * 1.3));
  const armX = span / 2 + (narrow ? 16 : 26);
  return { W, H, n, cx, top, bot, yBar, yBridge, yTail, shell: { cx, cy, rx, ry }, armX, narrow };
}

/** Where string `i` is at height `y` (they lean from the crossbar to the tailpiece). */
export function stringX(G: Geom, i: number, y: number) {
  const f = clamp((y - G.yBar) / (G.yTail - G.yBar), 0, 1);
  return G.top[i] + (G.bot[i] - G.top[i]) * f;
}

/** How much light falls at a point: a little from the room, the rest from the torch, fading with distance. */
function lum(l: Lamp, x: number, y: number, R: number) { return AMBIENT + l.I * Math.pow(Math.max(0, 1 - Math.hypot(l.x - x, l.y - y) / R), 1.25); }

/** A fill for a material under the torch: lit near the light, falling away to its shadow colour. */
function litFill(g: CanvasRenderingContext2D, l: Lamp, R: number, [lit, dark]: [RGB, RGB], boost = 1) {
  const gr = g.createRadialGradient(l.x, l.y, 0, l.x, l.y, R);
  for (const k of [0, 0.25, 0.5, 0.75, 1]) gr.addColorStop(k, rgb(mixRGB(dark, lit, clamp((AMBIENT + l.I * Math.pow(1 - k, 1.25)) * boost, 0, 1))));
  return gr;
}

/** A glint along an edge: strong near the light, gone far from it. */
function glint(g: CanvasRenderingContext2D, l: Lamp, R: number, a: number) {
  const gr = g.createRadialGradient(l.x, l.y, 0, l.x, l.y, R * 0.9);
  gr.addColorStop(0, rgb(HONEY, a * l.I)); gr.addColorStop(1, rgb(HONEY, 0));
  return gr;
}

function seeded(seed: number) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/** The centre line of an arm, from where it leaves the shell to its horn tip above the crossbar, with its width. */
function armLine(G: Geom, side: -1 | 1) {
  const { cx, shell, yBar, armX, W, narrow } = G;
  const B = { x: cx + side * shell.rx * 0.6, y: shell.cy - shell.ry * 0.78 };
  const T = { x: cx + side * armX, y: yBar };
  const h = B.y - T.y;
  const room = W / 2 - armX - 10;
  const bulge = clamp(h * 0.2, 10, Math.max(10, Math.min(48, room)));
  const dx = Math.abs(T.x - B.x);
  const C1 = { x: B.x + side * (dx * 0.85 + bulge), y: B.y - h * 0.28 };
  const C2 = { x: T.x + side * bulge * 0.75, y: T.y + h * 0.42 };
  const pts: { x: number; y: number; w: number }[] = [];
  const w0 = narrow ? 15 : 21, w1 = narrow ? 8 : 10;
  const N = 22;
  for (let k = 0; k <= N; k++) {
    const t = k / N, u = 1 - t;
    pts.push({
      x: u * u * u * B.x + 3 * u * u * t * C1.x + 3 * u * t * t * C2.x + t * t * t * T.x,
      y: u * u * u * B.y + 3 * u * u * t * C1.y + 3 * u * t * t * C2.y + t * t * t * T.y,
      w: w0 + (w1 - w0) * t,
    });
  }
  // the horn's tip, curling outwards above the bar
  const tipLen = narrow ? 16 : 22;
  for (let k = 1; k <= 6; k++) {
    const t = k / 6;
    pts.push({ x: T.x + side * (tipLen * 0.55) * t * t, y: T.y - tipLen * t, w: w1 * (1 - 0.75 * t) });
  }
  return pts;
}

/** The outline of a band of varying width around a centre line, and its two edges. */
function band(pts: { x: number; y: number; w: number }[]) {
  const left: [number, number][] = [], right: [number, number][] = [];
  for (let k = 0; k < pts.length; k++) {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)];
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len, h = pts[k].w / 2;
    left.push([pts[k].x + nx * h, pts[k].y + ny * h]);
    right.push([pts[k].x - nx * h, pts[k].y - ny * h]);
  }
  return { left, right };
}

function poly(g: CanvasRenderingContext2D, ps: [number, number][], close = false) {
  g.moveTo(ps[0][0], ps[0][1]);
  for (let k = 1; k < ps.length; k++) g.lineTo(ps[k][0], ps[k][1]);
  if (close) g.closePath();
}

export function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + rr, y); g.arcTo(x + w, y, x + w, y + h, rr); g.arcTo(x + w, y + h, x, y + h, rr);
  g.arcTo(x, y + h, x, y, rr); g.arcTo(x, y, x + w, y, rr); g.closePath();
}

/** The instrument without its strings, lit by the lamp. `R` is how far the torch's light reaches. */
export function paintBody(g: CanvasRenderingContext2D, G: Geom, l: Lamp, R: number) {
  const { W, H, cx, shell, yBar, yBridge, yTail, top, bot, n, armX, narrow } = G;
  g.clearRect(0, 0, W, H);
  if (!n) return;
  // which way shadows fall: away from the light
  const ddx = shell.cx - l.x, ddy = shell.cy - l.y, dl = Math.hypot(ddx, ddy) || 1;
  const sx = (ddx / dl) * 9, sy = (ddy / dl) * 6 + 4;

  // the lyre's shadow on the stone
  g.save();
  g.translate(shell.cx + sx, shell.cy + sy);
  g.scale(1, shell.ry / shell.rx);
  const sh = g.createRadialGradient(0, 0, shell.rx * 0.6, 0, 0, shell.rx * 1.12);
  sh.addColorStop(0, "rgba(0,0,0,0.55)"); sh.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = sh;
  g.beginPath(); g.arc(0, 0, shell.rx * 1.12, 0, Math.PI * 2); g.fill();
  g.restore();

  // the arms
  for (const side of [-1, 1] as const) {
    const pts = armLine(G, side);
    const { left, right } = band(pts);
    // its shadow on the wall behind
    g.beginPath(); poly(g, left.map(([x, y]) => [x + sx * 0.8, y + sy * 0.8] as [number, number])); poly(g, [...right].reverse().map(([x, y]) => [x + sx * 0.8, y + sy * 0.8] as [number, number])); g.closePath();
    g.fillStyle = "rgba(0,0,0,0.32)"; g.fill();
    g.beginPath(); poly(g, left); for (let k = right.length - 1; k >= 0; k--) g.lineTo(right[k][0], right[k][1]); g.closePath();
    g.fillStyle = litFill(g, l, R, WOOD); g.fill();
    g.strokeStyle = "rgba(8,5,2,0.6)"; g.lineWidth = 1; g.stroke();
    // the curve of the horn: a band of light along the side turned to the torch, and shade along the other
    const mid = Math.floor(pts.length / 2);
    const nl = Math.sign((left[mid][0] - right[mid][0]) * (l.x - pts[mid].x) + (left[mid][1] - right[mid][1]) * (l.y - pts[mid].y)) || 1;
    const [litE, darkE] = nl > 0 ? [left, right] : [right, left];
    const along = (f: number) => litE.map(([x, y], k) => [x + (darkE[k][0] - x) * f, y + (darkE[k][1] - y) * f] as [number, number]);
    g.lineCap = "round";
    g.beginPath(); poly(g, along(0.3));
    g.strokeStyle = glint(g, l, R, 0.38); g.lineWidth = narrow ? 3 : 4; g.stroke();
    g.beginPath(); poly(g, along(0.82));
    g.strokeStyle = "rgba(10,5,2,0.4)"; g.lineWidth = narrow ? 3 : 4; g.stroke();
    // the grain of the horn: fine lines along it
    g.lineWidth = 0.6;
    for (const f of [0.18, 0.47, 0.64]) {
      g.beginPath(); poly(g, along(f));
      g.strokeStyle = "rgba(24,12,4,0.2)"; g.stroke();
    }
    g.lineCap = "butt";
    // the edge turned to the light catches it
    g.beginPath(); poly(g, litE);
    g.strokeStyle = glint(g, l, R, 0.8); g.lineWidth = 1.2; g.stroke();
    // a band where the arm is set into the shell
    let kb = pts.findIndex((q) => ((q.x - shell.cx) / shell.rx) ** 2 + ((q.y - shell.cy) / shell.ry) ** 2 > 1);
    kb = Math.max(0, Math.min(pts.length - 2, kb + 1));
    const b0 = pts[kb], b1 = pts[kb + 1], ang = Math.atan2(b1.y - b0.y, b1.x - b0.x);
    const lx = l.x - b0.x, ly = l.y - b0.y, ca = Math.cos(-ang), sa = Math.sin(-ang);
    g.save();
    g.translate(b0.x, b0.y); g.rotate(ang);
    roundRect(g, -3, -b0.w / 2 - 1.5, 6, b0.w + 3, 2);
    g.fillStyle = litFill(g, { x: lx * ca - ly * sa, y: lx * sa + ly * ca, I: l.I }, R, BRIDGE); g.fill();
    g.strokeStyle = "rgba(8,5,2,0.6)"; g.lineWidth = 0.8; g.stroke();
    g.restore();
  }

  // the shell: the rim of a tortoise's back, its plates around the edge, and the hide over it
  const hx = shell.rx * 0.84, hy = shell.ry * 0.8;
  g.beginPath(); g.ellipse(shell.cx, shell.cy, shell.rx, shell.ry, 0, 0, Math.PI * 2);
  g.fillStyle = litFill(g, l, R, SHELL); g.fill();
  g.save();
  g.beginPath();
  g.ellipse(shell.cx, shell.cy, shell.rx, shell.ry, 0, 0, Math.PI * 2);
  g.ellipse(shell.cx, shell.cy, hx, hy, 0, 0, Math.PI * 2, true);
  g.clip("evenodd");
  const K = narrow ? 18 : 24, rnd = seeded(31);
  for (let k = 0; k < K; k++) {
    const a0 = (k / K) * Math.PI * 2, a1 = ((k + 1) / K) * Math.PI * 2;
    // each plate a slightly different brown, as a real shell's are
    const v = rnd();
    g.beginPath();
    g.moveTo(shell.cx, shell.cy);
    g.ellipse(shell.cx, shell.cy, shell.rx * 1.02, shell.ry * 1.02, 0, a0, a1);
    g.closePath();
    g.fillStyle = v > 0.55 ? `rgba(214,150,72,${0.06 + 0.1 * (v - 0.55)})` : `rgba(0,0,0,${0.06 + 0.18 * (0.55 - v)})`;
    g.fill();
    // the seam between plates
    g.beginPath();
    g.moveTo(shell.cx + Math.cos(a0) * hx, shell.cy + Math.sin(a0) * hy);
    g.lineTo(shell.cx + Math.cos(a0) * shell.rx, shell.cy + Math.sin(a0) * shell.ry);
    g.strokeStyle = "rgba(10,6,2,0.72)"; g.lineWidth = 1.3; g.stroke();
    // and its growth rings
    for (const f of [0.9, 0.955]) {
      g.beginPath();
      g.ellipse(shell.cx, shell.cy, shell.rx * f, shell.ry * f, 0, a0 + 0.12 * (a1 - a0), a1 - 0.12 * (a1 - a0));
      g.strokeStyle = "rgba(12,7,3,0.28)"; g.lineWidth = 0.8; g.stroke();
    }
  }
  g.restore();
  g.beginPath(); g.ellipse(shell.cx, shell.cy, shell.rx, shell.ry, 0, 0, Math.PI * 2);
  g.strokeStyle = "rgba(6,4,2,0.7)"; g.lineWidth = 1.2; g.stroke();
  // the rim's lit edge
  g.beginPath(); g.ellipse(shell.cx, shell.cy, shell.rx - 1, shell.ry - 1, 0, 0, Math.PI * 2);
  g.strokeStyle = glint(g, l, R, 0.5); g.lineWidth = 1.2; g.stroke();

  // the hide, stretched and sewn to the rim
  g.beginPath(); g.ellipse(shell.cx, shell.cy, hx, hy, 0, 0, Math.PI * 2);
  g.fillStyle = litFill(g, l, R, HIDE, 0.8); g.fill();
  g.save();
  g.clip();
  const rh = seeded(7);
  for (let k = 0; k < 7; k++) {                     // the hide's uneven colour
    const x = shell.cx + (rh() * 2 - 1) * hx * 0.8, y = shell.cy + (rh() * 2 - 1) * hy * 0.7, r = (0.25 + rh() * 0.4) * hx;
    const m = g.createRadialGradient(x, y, 0, x, y, r);
    m.addColorStop(0, `rgba(70,48,24,${0.05 + rh() * 0.06})`); m.addColorStop(1, "rgba(70,48,24,0)");
    g.fillStyle = m; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  // and its fibres, faint
  g.lineWidth = 0.6;
  for (let k = 0; k < (narrow ? 26 : 44); k++) {
    const x = shell.cx + (rh() * 2 - 1) * hx, y = shell.cy + (rh() * 2 - 1) * hy, len = 10 + rh() * 26, a = (rh() - 0.5) * 0.7;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + len * 0.5, y + Math.sin(a) * len * 0.5 + 2, x + len * Math.cos(a), y + len * Math.sin(a));
    g.strokeStyle = rh() > 0.5 ? "rgba(255,240,210,0.07)" : "rgba(60,40,20,0.08)"; g.stroke();
  }
  // the rim's shadow on the hide, on the side away from the light
  g.beginPath(); g.ellipse(shell.cx + sx * 0.5, shell.cy + sy * 0.4, hx, hy, 0, 0, Math.PI * 2);
  g.ellipse(shell.cx - sx * 0.2, shell.cy - sy * 0.2 + 2, hx * 1.2, hy * 1.2, 0, 0, Math.PI * 2, true);
  g.fillStyle = "rgba(10,6,3,0.22)"; g.fill("evenodd");
  g.restore();
  g.beginPath(); g.ellipse(shell.cx, shell.cy, hx, hy, 0, 0, Math.PI * 2);
  g.strokeStyle = "rgba(20,12,5,0.65)"; g.lineWidth = 1.4; g.stroke();
  // the stitches that hold it
  g.save();
  g.setLineDash([1.6, narrow ? 6 : 8]);
  g.beginPath(); g.ellipse(shell.cx, shell.cy, hx - 4, hy - 3.5, 0, 0, Math.PI * 2);
  g.strokeStyle = "rgba(40,24,10,0.45)"; g.lineWidth = 1.4; g.stroke();
  g.restore();

  // the tailpiece, where the strings are tied
  const tl = bot[0] - 10, tr = bot[n - 1] + 10;
  roundRect(g, tl + sx * 0.3, yTail - 4 + sy * 0.3 + 1, tr - tl, 9, 4); g.fillStyle = "rgba(10,6,3,0.35)"; g.fill();
  roundRect(g, tl, yTail - 4, tr - tl, 8, 4); g.fillStyle = litFill(g, l, R, BAR); g.fill();
  g.strokeStyle = "rgba(8,5,2,0.6)"; g.lineWidth = 1; g.stroke();
  for (let i = 0; i < n; i++) {
    g.beginPath(); g.arc(bot[i], yTail, 2.2, 0, Math.PI * 2);
    g.fillStyle = litFill(g, l, R, LEATHER); g.fill();
  }

  // the bridge on the hide, which the strings run over
  const bl = stringX(G, 0, yBridge) - 12, br = stringX(G, n - 1, yBridge) + 12;
  roundRect(g, bl + sx * 0.45, yBridge - 3 + sy * 0.45 + 2, br - bl, 8, 3); g.fillStyle = "rgba(10,6,3,0.38)"; g.fill();
  roundRect(g, bl, yBridge - 3.5, br - bl, 7, 3); g.fillStyle = litFill(g, l, R, BRIDGE); g.fill();
  g.strokeStyle = "rgba(8,5,2,0.6)"; g.lineWidth = 1; g.stroke();
  g.beginPath(); g.moveTo(bl + 3, yBridge - 3); g.lineTo(br - 3, yBridge - 3);
  g.strokeStyle = glint(g, l, R, 0.6); g.lineWidth = 1; g.stroke();

  // the crossbar between the arms' tips, a turned rod with a knob at each end
  const xl = cx - armX - (narrow ? 12 : 16), xr = cx + armX + (narrow ? 12 : 16), bh = narrow ? 11 : 13;
  roundRect(g, xl + sx * 0.6, yBar - bh / 2 + sy * 0.6, xr - xl, bh, bh / 2); g.fillStyle = "rgba(0,0,0,0.35)"; g.fill();
  roundRect(g, xl, yBar - bh / 2, xr - xl, bh, bh / 2);
  g.fillStyle = litFill(g, l, R, BAR); g.fill();
  const rod = g.createLinearGradient(0, yBar - bh / 2, 0, yBar + bh / 2);
  rod.addColorStop(0, "rgba(255,236,200,0.16)"); rod.addColorStop(0.3, "rgba(255,236,200,0.04)");
  rod.addColorStop(0.65, "rgba(0,0,0,0.12)"); rod.addColorStop(1, "rgba(0,0,0,0.45)");
  g.fillStyle = rod; g.fill();
  g.strokeStyle = "rgba(8,5,2,0.65)"; g.lineWidth = 1; g.stroke();
  g.beginPath(); g.moveTo(xl + bh / 2, yBar - bh / 2 + 2); g.lineTo(xr - bh / 2, yBar - bh / 2 + 2);
  g.strokeStyle = glint(g, l, R, 0.7); g.lineWidth = 1.2; g.stroke();
  for (const x of [xl, xr]) {
    const r = bh * 0.62, ox = clamp((l.x - x) / 200, -1, 1) * r * 0.4, oy = clamp((l.y - yBar) / 200, -1, 1) * r * 0.4;
    const kn = g.createRadialGradient(x + ox, yBar + oy, 0.5, x, yBar, r);
    const L = clamp(lum(l, x, yBar, R), 0, 1);
    kn.addColorStop(0, rgb(mixRGB(BAR[1], [255, 228, 180], L))); kn.addColorStop(1, rgb(mixRGB(BAR[1], BAR[0], L * 0.6)));
    g.beginPath(); g.arc(x, yBar, r, 0, Math.PI * 2); g.fillStyle = kn; g.fill();
    g.strokeStyle = "rgba(8,5,2,0.6)"; g.stroke();
  }

  // the kollopes: a peg on the bar for each string, which tightens it
  for (let i = 0; i < n; i++) {
    const x = top[i], kw = narrow ? 6 : 8, kh = bh + 6;
    roundRect(g, x - kw / 2, yBar - kh / 2, kw, kh, 2.5);
    g.fillStyle = litFill(g, l, R, LEATHER); g.fill();
    g.strokeStyle = "rgba(10,6,3,0.55)"; g.lineWidth = 0.8; g.stroke();
    g.beginPath();
    for (const dy of [-kh * 0.2, kh * 0.12]) { g.moveTo(x - kw / 2 + 1, yBar + dy); g.lineTo(x + kw / 2 - 1, yBar + dy + 1.5); }
    g.strokeStyle = "rgba(30,18,8,0.45)"; g.stroke();
  }
}

/** What a string is doing this frame: how far it swings (px) and how much it glows (0 to 1). */
export interface StringState { amp: number; glow: number }

/** The strings, over the painted body, and the key that plucks each. */
export function paintStrings(g: CanvasRenderingContext2D, G: Geom, l: Lamp, R: number, state: (i: number) => StringState, labels: (string | undefined)[] | null, face: string) {
  const { n, top, bot, yBar, yBridge, yTail, shell, narrow } = G;
  const ddx = shell.cx - l.x, ddy = shell.cy - l.y, dl = Math.hypot(ddx, ddy) || 1;
  const ox = (ddx / dl) * 3.5, oy = (ddy / dl) * 2 + 1.5;
  const yHide = shell.cy - shell.ry * 0.8, y0 = yBar + (narrow ? 9 : 10);
  for (let i = 0; i < n; i++) {
    const { amp, glow } = state(i);
    const xb = stringX(G, i, yBridge), mx = (top[i] + xb) / 2, my = (y0 + yBridge) / 2;
    const L = clamp(lum(l, top[i], my, R), 0, 1);
    const w = (narrow ? 0.8 : 0.95) + 1.1 * (1 - i / Math.max(1, n - 1));   // the low strings are a little thicker
    // its shadow on the hide
    const xh = stringX(G, i, yHide);
    g.beginPath(); g.moveTo(xh + ox, yHide + oy); g.lineTo(xb + ox + amp * 0.3, yBridge + oy); g.lineTo(bot[i] + ox, yTail + oy);
    g.strokeStyle = "rgba(12,7,3,0.3)"; g.lineWidth = w + 0.6; g.stroke();
    const path = () => { g.beginPath(); g.moveTo(top[i], y0); g.quadraticCurveTo(mx + amp * 2, my, xb, yBridge); g.lineTo(bot[i], yTail); };
    if (glow > 0.04) { path(); g.strokeStyle = rgb(HONEY, 0.2 * glow); g.lineWidth = w + 2 + 6 * glow; g.stroke(); }
    path();
    g.strokeStyle = rgb(mixRGB(GUT, HONEY, glow), clamp(0.3 + 0.62 * L + 0.4 * glow, 0, 1));
    g.lineWidth = w + 0.5 * glow; g.stroke();
  }
  if (labels) {
    g.textAlign = "center"; g.textBaseline = "alphabetic";
    g.font = `600 ${narrow ? 10 : 11}px ${face}`;
    for (let i = 0; i < n; i++) {
      const lab = labels[i];
      if (!lab) continue;
      const { glow } = state(i);
      g.fillStyle = glow > 0.05 ? rgb(HONEY, 0.6 + 0.4 * glow) : "rgba(191,176,154,0.62)";
      g.fillText(lab, top[i], 17);
    }
  }
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
