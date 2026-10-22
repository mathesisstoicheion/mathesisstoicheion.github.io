/**
 * The instruments of the lyre page: one for each song, and one for each tuning of the two-octave scale, every one drawn
 * at its own fixed proportions (it is made larger or smaller to fit the page, never stretched).
 *
 * Four kinds, as the sources describe them (Wikipedia, "Lyre", "Chelys" and "Music of ancient Greece", checked
 * 2026-10-17):
 *  - the chelys (χέλυς, "tortoise"), the lyre proper: "a convex back of tortoiseshell or of wood shaped like the shell",
 *    two raised arms "curved both outward and forward", a crossbar or yoke, a bridge, and gut strings;
 *  - the barbitos (βάρβιτος): "a larger, bass-version of the cithara, considered to be east-Ionian", Sappho's instrument;
 *  - the kithara (κιθάρα): "the version of the lyre used by professional musicians", a "box-type frame" held upright and
 *    played with a plectrum, in two kinds, "the round-based cylinder kithara and the flat-based concert kithara";
 *  - the phorminx (φόρμιγξ): "an ancient wooden-frame lyre intermediate in size between the smaller tortoise-shell lyre
 *    and larger kithara, which replaced it".
 * The plectrum hangs from each on a ribbon, as the sources say it did when not in use. The colours and ornaments are
 * the site's own.
 *
 * Each instrument is drawn once, in its own colours with a soft light from above (`paintAlbedo`), and the page copies
 * that picture under its strings each frame (draw.ts, `inkBody`). (The painters can still draw an edge's glints, the
 * `sheen` they are given; on the printed page they are always given none: nothing glints or glows.)
 */

export type RGB = [number, number, number];
export type Kind = "chelys" | "barbitos" | "kithara" | "round-kithara" | "phorminx";

interface Finish {
  /** the frame: its wood (or horn), lit, and its grain */
  wood: RGB; grain: RGB;
  /** the arms, where they differ from the frame (a chelys's horns) */
  arm?: RGB; armTip?: RGB;
  /** gilding, bronze or silver: the trim */
  trim: RGB;
  /** the sounding board: hide on a shell, else a wooden face */
  board: RGB;
  /** a chelys's shell */
  shell?: RGB; mottle?: RGB;
  ribbon: RGB;
  /** a painted panel on the kithara's face */
  panel?: RGB;
}

interface Ornament {
  /** the face's border */
  border?: "meander" | "eggs" | "dots" | "lines";
  /** at the heart of the face */
  centre?: "rosette" | "sun" | "laurel" | "wheel" | "none";
  /** the discs where the arms meet the yoke */
  discs?: "rosette" | "plain";
  /** studs along the frame */
  studs?: boolean;
  /** a frame covered in gold */
  gilded?: boolean;
}

export interface Design {
  id: string;
  kind: Kind;
  n: number;
  finish: Finish;
  orn: Ornament;
  /** what the page says about it */
  name: string; greek: string; about: string;
}

// ── the colours (lit) ───────────────────────────────────────────────────────────────────────────────────────────────
const WALNUT: RGB = [142, 92, 52], WALNUT_G: RGB = [62, 36, 16];
const CEDAR: RGB = [168, 88, 50], CEDAR_G: RGB = [82, 34, 16];
const BOX: RGB = [212, 172, 112], BOX_G: RGB = [140, 98, 52];
const EBONY: RGB = [64, 50, 44], EBONY_G: RGB = [26, 18, 14];
const OLIVE: RGB = [176, 140, 88], OLIVE_G: RGB = [96, 70, 38];
const GOLD: RGB = [228, 182, 96], BRONZE: RGB = [184, 124, 70], SILVER: RGB = [200, 198, 196];
const IVORY: RGB = [236, 222, 192], HIDE: RGB = [230, 208, 166];
const HORN: RGB = [104, 80, 60], HORN_TIP: RGB = [200, 172, 128];
const AMBER: RGB = [196, 128, 54], BLOTCH: RGB = [58, 28, 12];
const MADDER: RGB = [164, 42, 36], INDIGO: RGB = [48, 62, 124], SAFFRON: RGB = [214, 150, 44];
const PURPLE: RGB = [104, 40, 84], LINEN: RGB = [214, 200, 170], GREEN: RGB = [62, 104, 70];

const ABOUT = {
  kithara: "the version of the lyre used by professional musicians: a box-shaped frame, held upright and played with a plectrum.",
  round: "the round-based kind of kithara, the lyre of professional musicians.",
  chelys: "a lyre whose back is a tortoise shell, or wood shaped like one, strung with gut. In the Homeric Hymn to Hermes, Hermes makes the first.",
  barbitos: "a larger, deeper-voiced cousin of the kithara from eastern Ionia, the instrument of Sappho.",
  phorminx: "an old wooden-frame lyre, between the tortoise-shell lyre and the kithara in size; the kithara replaced it.",
};
const OURS = " No source says what it was played on: the instrument is our choice.";

/** The instrument for each song (by its id), and for the two tunings of the scale. */
const DESIGNS: Omit<Design, "n">[] = [
  { id: "free-ancient", kind: "kithara", name: "kithara", greek: "κιθάρα", about: ABOUT.kithara,
    finish: { wood: WALNUT, grain: WALNUT_G, trim: GOLD, board: [168, 112, 64], ribbon: MADDER, panel: [70, 34, 22] },
    orn: { border: "meander", centre: "rosette", discs: "rosette", studs: true } },
  { id: "free-modern", kind: "kithara", name: "kithara", greek: "κιθάρα", about: ABOUT.kithara,
    finish: { wood: BOX, grain: BOX_G, trim: SILVER, board: [222, 190, 136], ribbon: INDIGO, panel: [44, 52, 82] },
    orn: { border: "eggs", centre: "laurel", discs: "plain", studs: true } },
  { id: "seikilos", kind: "chelys", name: "chelys", greek: "χέλυς", about: ABOUT.chelys + OURS,
    finish: { wood: BOX, grain: BOX_G, arm: HORN, armTip: HORN_TIP, trim: GOLD, board: HIDE, shell: AMBER, mottle: BLOTCH, ribbon: MADDER },
    orn: {} },
  { id: "muse", kind: "chelys", name: "chelys", greek: "χέλυς", about: ABOUT.chelys + " This one is of wood." + OURS,
    finish: { wood: OLIVE, grain: OLIVE_G, arm: IVORY, armTip: [250, 240, 220], trim: GOLD, board: HIDE, shell: CEDAR, mottle: CEDAR_G, ribbon: SAFFRON },
    orn: { studs: true } },
  { id: "helios", kind: "round-kithara", name: "kithara", greek: "κιθάρα", about: ABOUT.round + " Mesomedes, to whom the hymn is attributed, was a citharode: he sang to the kithara.",
    finish: { wood: [186, 132, 60], grain: [110, 70, 26], trim: GOLD, board: [196, 146, 74], ribbon: SAFFRON, panel: [92, 46, 18] },
    orn: { border: "dots", centre: "sun", discs: "rosette", gilded: true } },
  { id: "nemesis", kind: "kithara", name: "kithara", greek: "κιθάρα", about: ABOUT.kithara + " Mesomedes, who wrote the hymn, was a citharode: he sang to the kithara.",
    finish: { wood: EBONY, grain: EBONY_G, trim: SILVER, board: [92, 74, 64], ribbon: PURPLE, panel: [28, 24, 30] },
    orn: { border: "meander", centre: "wheel", discs: "plain", studs: true } },
  { id: "calliope", kind: "kithara", name: "kithara", greek: "κιθάρα", about: ABOUT.kithara + " Mesomedes, to whom the hymn has been attributed, was a citharode: he sang to the kithara.",
    finish: { wood: CEDAR, grain: CEDAR_G, trim: GOLD, board: [186, 112, 66], ribbon: GREEN, panel: [40, 58, 40] },
    orn: { border: "eggs", centre: "laurel", discs: "rosette" } },
  { id: "delphic-1", kind: "kithara", name: "kithara", greek: "κιθάρα", about: ABOUT.kithara + " The hymn's own words name the golden kithara.",
    finish: { wood: [214, 166, 84], grain: [130, 88, 30], trim: GOLD, board: IVORY, ribbon: MADDER, panel: [118, 40, 30] },
    orn: { border: "meander", centre: "rosette", discs: "rosette", gilded: true, studs: true } },
  { id: "delphic-2", kind: "kithara", name: "kithara", greek: "κιθάρα", about: ABOUT.kithara + " Limenios, who wrote the hymn, was a kithara-player.",
    finish: { wood: [122, 62, 40], grain: [60, 24, 12], trim: BRONZE, board: [176, 112, 70], ribbon: INDIGO, panel: [30, 40, 70] },
    orn: { border: "eggs", centre: "sun", discs: "rosette", studs: true } },
  { id: "orestes", kind: "barbitos", name: "barbitos", greek: "βάρβιτος", about: ABOUT.barbitos + OURS,
    finish: { wood: EBONY, grain: EBONY_G, arm: [72, 56, 48], armTip: [120, 96, 78], trim: SILVER, board: HIDE, shell: [120, 70, 34], mottle: [30, 14, 6], ribbon: PURPLE },
    orn: {} },
  { id: "oxyrhynchus", kind: "phorminx", name: "phorminx", greek: "φόρμιγξ", about: ABOUT.phorminx + OURS,
    finish: { wood: BOX, grain: BOX_G, trim: [150, 118, 80], board: [204, 166, 108], ribbon: LINEN },
    orn: { border: "lines", centre: "none" } },
  { id: "berlin-instrumental", kind: "phorminx", name: "phorminx", greek: "φόρμιγξ", about: ABOUT.phorminx + OURS,
    finish: { wood: WALNUT, grain: WALNUT_G, trim: [190, 136, 76], board: [176, 120, 70], ribbon: MADDER },
    orn: { border: "dots", centre: "rosette" } },
];

/** The instrument for a song (or for the scale, `free-ancient` or `free-modern`), with this many strings. */
export function designFor(id: string, n: number): Design {
  const d = DESIGNS.find((x) => x.id === id) ?? DESIGNS[0];
  return { ...d, n };
}

// ── the shape ───────────────────────────────────────────────────────────────────────────────────────────────────────
// Every instrument is drawn in its own units: 1 is its height, from the tips of its arms to its foot; x runs from its
// middle. `w` is its whole width in the same units.

export interface Shape {
  w: number;
  /** the yoke: its height (y), how far it reaches each side, how thick it is */
  barY: number; barX: number; barH: number;
  /** the strings: their spread at the yoke and at the tailpiece, where they cross the bridge and are tied */
  topSpan: number; botSpan: number; bridgeY: number; tailY: number;
  /** where the sounding board begins (the strings' shadows fall on it below this) */
  boardY: number;
}

const SPACING: Record<Kind, number> = { chelys: 0.048, barbitos: 0.036, kithara: 0.042, "round-kithara": 0.044, phorminx: 0.046 };

/** The arms of a kithara: where the inner and outer edges are at the yoke and at the box. */
function kitharaArms(topSpan: number) {
  const a = topSpan / 2;
  const it = a + 0.05, ot = it + 0.07;               // at the yoke
  const ib = a * 0.84 + 0.06, ob = ib + 0.15;         // where they join the box
  return { it, ot, ib, ob };
}

export function shapeOf(d: Design): Shape {
  const topSpan = Math.max(1, d.n - 1) * SPACING[d.kind];
  switch (d.kind) {
    case "chelys": {
      const barX = topSpan / 2 + 0.13;
      return { w: 2 * Math.max(barX + 0.075, Math.max(0.22, topSpan / 2 + 0.075) + 0.06), barY: 0.115, barX, barH: 0.034,
        topSpan, botSpan: topSpan * 0.6, bridgeY: 0.77, tailY: 0.91, boardY: 0.67 };
    }
    case "barbitos": {
      const barX = topSpan / 2 + 0.1;
      return { w: 2 * (barX + 0.13), barY: 0.1, barX, barH: 0.028,
        topSpan, botSpan: topSpan * 0.75, bridgeY: 0.81, tailY: 0.93, boardY: 0.75 };
    }
    case "kithara": {
      const { ob } = kitharaArms(topSpan);
      return { w: 2 * (ob + 0.1), barY: 0.12, barX: kitharaArms(topSpan).ot + 0.04, barH: 0.038,
        topSpan, botSpan: topSpan * 0.84, bridgeY: 0.79, tailY: 0.9, boardY: 0.58 };
    }
    case "round-kithara": {
      const { ob } = kitharaArms(topSpan);
      return { w: 2 * (ob + 0.1), barY: 0.12, barX: kitharaArms(topSpan).ot + 0.04, barH: 0.038,
        topSpan, botSpan: topSpan * 0.78, bridgeY: 0.76, tailY: 0.86, boardY: 0.56 };
    }
    case "phorminx": {
      const r = topSpan / 2 + 0.17;
      return { w: 2 * (r + 0.09), barY: 0.13, barX: topSpan / 2 + 0.13, barH: 0.034,
        topSpan, botSpan: topSpan * 0.7, bridgeY: 0.74, tailY: 0.86, boardY: 0.52 };
    }
  }
}

// ── drawing helpers (all in the instrument's units) ─────────────────────────────────────────────────────────────────
type G2 = CanvasRenderingContext2D;
type P = [number, number];
const rgb = ([r, g, b]: RGB, a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const shade = (c: RGB, k: number): RGB => (k < 0 ? mix(c, [8, 5, 3], -k) : mix(c, [255, 244, 222], k));
function seeded(seed: number) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/** A cubic Bézier, as points. */
function bez(a: P, b: P, c: P, d: P, N = 24): P[] {
  const out: P[] = [];
  for (let k = 0; k <= N; k++) {
    const t = k / N, u = 1 - t;
    out.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
      u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]);
  }
  return out;
}
const mirror = (ps: P[]): P[] => ps.map(([x, y]) => [-x, y]);
function trace(g: G2, ps: P[], move = true) { ps.forEach(([x, y], k) => (k === 0 && move ? g.moveTo(x, y) : g.lineTo(x, y))); }

/** A band of varying width around a centre line: its outline, and its two edges. */
function band(c: P[], w: (t: number) => number) {
  const L: P[] = [], R: P[] = [];
  c.forEach((p, k) => {
    const a = c[Math.max(0, k - 1)], b = c[Math.min(c.length - 1, k + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, h = w(k / (c.length - 1)) / 2;
    L.push([p[0] - (dy / len) * h, p[1] + (dx / len) * h]);
    R.push([p[0] + (dy / len) * h, p[1] - (dx / len) * h]);
  });
  return { L, R };
}
/** Lines part-way across a band (for the light and shade along an arm). */
const across = (L: P[], R: P[], f: number): P[] => L.map(([x, y], k) => [x + (R[k][0] - x) * f, y + (R[k][1] - y) * f]);

function fillBand(g: G2, L: P[], R: P[]) { g.beginPath(); trace(g, L); trace(g, [...R].reverse(), false); g.closePath(); }

/** A turned rod across: a cylinder lit from above. */
function rodFill(g: G2, y: number, h: number, c: RGB) {
  const gr = g.createLinearGradient(0, y - h / 2, 0, y + h / 2);
  gr.addColorStop(0, rgb(shade(c, 0.28))); gr.addColorStop(0.35, rgb(c)); gr.addColorStop(0.8, rgb(shade(c, -0.45))); gr.addColorStop(1, rgb(shade(c, -0.7)));
  return gr;
}
/** A gilt or metal fill: bright bands and dark ones, as polished metal shows the room. */
function metalFill(g: G2, x0: number, y0: number, x1: number, y1: number, c: RGB) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, rgb(shade(c, -0.35))); gr.addColorStop(0.3, rgb(shade(c, 0.3))); gr.addColorStop(0.5, rgb(c));
  gr.addColorStop(0.72, rgb(shade(c, -0.4))); gr.addColorStop(1, rgb(shade(c, 0.1)));
  return gr;
}

/** A spiral scroll (a volute), turning `turns` times inwards. */
function volute(g: G2, cx: number, cy: number, r: number, dir: 1 | -1, lw: number, c: RGB) {
  g.beginPath();
  const N = 60, turns = 1.7;
  for (let k = 0; k <= N; k++) {
    const t = k / N, a = dir * (t * turns * Math.PI * 2) - Math.PI / 2, rr = r * (1 - 0.82 * t);
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    if (k === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.strokeStyle = rgb(c); g.lineWidth = lw; g.lineCap = "round"; g.stroke();
  g.beginPath(); g.arc(cx, cy, r * 0.2, 0, Math.PI * 2); g.fillStyle = rgb(c); g.fill();
}

/** A rosette of `k` petals. */
function rosette(g: G2, cx: number, cy: number, r: number, k: number, c: RGB, dark: RGB) {
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2;
    g.save(); g.translate(cx, cy); g.rotate(a);
    g.beginPath(); g.moveTo(0, 0);
    g.quadraticCurveTo(r * 0.42, -r * 0.3, 0, -r); g.quadraticCurveTo(-r * 0.42, -r * 0.3, 0, 0);
    const gr = g.createLinearGradient(0, 0, 0, -r); gr.addColorStop(0, rgb(shade(c, -0.25))); gr.addColorStop(1, rgb(shade(c, 0.25)));
    g.fillStyle = gr; g.fill();
    g.strokeStyle = rgb(dark, 0.55); g.lineWidth = r * 0.04; g.stroke();
    g.restore();
  }
  g.beginPath(); g.arc(cx, cy, r * 0.22, 0, Math.PI * 2);
  g.fillStyle = metalFill(g, cx - r * 0.2, cy - r * 0.2, cx + r * 0.2, cy + r * 0.2, c); g.fill();
}

/** A border of a meander (a Greek key), of eggs and darts, of dots or of plain lines, along a straight run. */
function borderRun(g: G2, x0: number, x1: number, y: number, h: number, kind: Ornament["border"], c: RGB, ground: RGB) {
  const len = x1 - x0;
  g.fillStyle = rgb(ground); g.fillRect(x0, y - h / 2, len, h);
  g.strokeStyle = rgb(c); g.fillStyle = rgb(c);
  const lw = h * 0.12;
  g.lineWidth = lw;
  g.beginPath(); g.moveTo(x0, y - h / 2 + lw / 2); g.lineTo(x1, y - h / 2 + lw / 2); g.moveTo(x0, y + h / 2 - lw / 2); g.lineTo(x1, y + h / 2 - lw / 2); g.stroke();
  const inner = h * 0.62;
  if (kind === "meander") {
    const u = inner / 3, n = Math.max(1, Math.floor(len / (u * 4)));
    const step = len / n;
    g.beginPath();
    for (let i = 0; i < n; i++) {
      const x = x0 + i * step + (step - u * 3.2) / 2, yt = y - inner / 2, yb = y + inner / 2;
      g.moveTo(x, yb); g.lineTo(x, yt); g.lineTo(x + u * 3, yt); g.lineTo(x + u * 3, yb - u); g.lineTo(x + u, yb - u); g.lineTo(x + u, yt + u); g.lineTo(x + u * 2, yt + u);
    }
    g.lineWidth = lw * 0.9; g.lineJoin = "miter"; g.stroke();
  } else if (kind === "eggs") {
    const u = inner * 0.9, n = Math.max(1, Math.floor(len / u));
    const step = len / n;
    const eggs = new Path2D(), darts = new Path2D();
    for (let i = 0; i < n; i++) {
      const x = x0 + (i + 0.5) * step;
      eggs.moveTo(x + step * 0.3, y); eggs.ellipse(x, y, step * 0.3, inner * 0.42, 0, 0, Math.PI * 2);
      darts.moveTo(x + step / 2, y - inner * 0.4); darts.lineTo(x + step / 2, y + inner * 0.25);
    }
    g.fill(eggs); g.lineWidth = lw * 0.7; g.stroke(darts);
  } else if (kind === "dots") {
    const n = Math.max(1, Math.floor(len / (inner * 0.9)));
    const dots = new Path2D();
    for (let i = 0; i < n; i++) { const x = x0 + (i + 0.5) * (len / n); dots.moveTo(x + inner * 0.2, y); dots.arc(x, y, inner * 0.2, 0, Math.PI * 2); }
    g.fill(dots);
  } else if (kind === "lines") {
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.lineWidth = lw * 0.7; g.stroke();
  }
}

/** Fine grain along a shape: thin wavering lines, clipped to the current path (in three strengths, each one stroke). */
function grain(g: G2, x0: number, y0: number, x1: number, y1: number, c: RGB, seed: number, vertical = true, count = 46) {
  const r = seeded(seed);
  const paths = [new Path2D(), new Path2D(), new Path2D()];
  for (let i = 0; i < count; i++) {
    const t = r(), q = paths[Math.min(2, Math.floor(r() * 3))];
    if (vertical) {
      const x = x0 + (x1 - x0) * t, wob = (r() - 0.5) * 0.02;
      q.moveTo(x, y0); q.bezierCurveTo(x + wob, y0 + (y1 - y0) * 0.33, x - wob, y0 + (y1 - y0) * 0.66, x + wob * 0.5, y1);
    } else {
      const y = y0 + (y1 - y0) * t, wob = (r() - 0.5) * 0.012;
      q.moveTo(x0, y); q.bezierCurveTo(x0 + (x1 - x0) * 0.33, y + wob, x0 + (x1 - x0) * 0.66, y - wob, x1, y + wob * 0.5);
    }
  }
  g.lineWidth = 0.0024;
  paths.forEach((q, k) => { g.strokeStyle = rgb(c, 0.1 + k * 0.07); g.stroke(q); });
}

// ── the parts ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** The yoke: a turned rod with rings near its ends and a knob at each end, and a collar (κόλλοψ) for each string. */
function yoke(g: G2, d: Design, S: Shape, tops: number[], sheen: Sheen) {
  const { barY: y, barX: x, barH: h } = S, f = d.finish;
  const col = d.orn.gilded ? f.trim : mix(f.wood, [230, 190, 130], 0.18);
  if (!sheen) {
    g.beginPath(); g.roundRect(-x, y - h / 2, 2 * x, h, h / 2);
    g.fillStyle = rodFill(g, y, h, col); g.fill();
    g.strokeStyle = rgb(shade(col, -0.75), 0.8); g.lineWidth = 0.003; g.stroke();
    // turned rings
    for (const s of [-1, 1]) for (const k of [0.04, 0.055, 0.07]) {
      g.beginPath(); g.moveTo(s * (x - k), y - h / 2 + 0.002); g.lineTo(s * (x - k), y + h / 2 - 0.002);
      g.strokeStyle = rgb(shade(col, -0.6), 0.55); g.lineWidth = 0.0025; g.stroke();
    }
    // the knobs
    for (const s of [-1, 1]) {
      const r = h * 0.78, cx = s * (x + r * 0.55);
      const gr = g.createRadialGradient(cx - r * 0.3, y - r * 0.35, r * 0.1, cx, y, r);
      gr.addColorStop(0, rgb(shade(f.trim, 0.45))); gr.addColorStop(0.6, rgb(f.trim)); gr.addColorStop(1, rgb(shade(f.trim, -0.6)));
      g.beginPath(); g.arc(cx, y, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
      g.strokeStyle = rgb(shade(f.trim, -0.8), 0.7); g.lineWidth = 0.0025; g.stroke();
    }
    // the collars, of hide, wound round the yoke where each string is tied
    for (const t of tops) {
      const cw = Math.min(0.022, SPACING[d.kind] * 0.5), ch = h * 1.25;
      g.beginPath(); g.roundRect(t - cw / 2, y - ch / 2, cw, ch, cw * 0.35);
      const gr = g.createLinearGradient(t - cw / 2, 0, t + cw / 2, 0);
      gr.addColorStop(0, rgb(shade(HIDE, -0.55))); gr.addColorStop(0.4, rgb(shade(HIDE, -0.05))); gr.addColorStop(1, rgb(shade(HIDE, -0.6)));
      g.fillStyle = gr; g.fill();
      g.strokeStyle = "rgba(30,18,8,0.55)"; g.lineWidth = 0.002; g.stroke();
      for (const k of [-0.25, 0, 0.25]) {
        g.beginPath(); g.moveTo(t - cw / 2, y + ch * k - 0.003); g.lineTo(t + cw / 2, y + ch * k + 0.003);
        g.strokeStyle = "rgba(40,24,10,0.35)"; g.lineWidth = 0.0018; g.stroke();
      }
    }
  } else {
    g.beginPath(); g.moveTo(-x + h / 2, y - h * 0.3); g.lineTo(x - h / 2, y - h * 0.3);
    g.strokeStyle = sheen.c(0.75); g.lineWidth = h * 0.16; g.lineCap = "round"; g.stroke();
  }
}

/** The bridge on the sounding board, and the tailpiece below it where the strings are tied. */
function bridgeAndTail(g: G2, d: Design, S: Shape, sheen: Sheen) {
  const f = d.finish;
  const bw = S.topSpan + (S.botSpan - S.topSpan) * ((S.bridgeY - S.barY) / (S.tailY - S.barY)) + 0.06;
  const tw = S.botSpan + 0.05;
  if (!sheen) {
    // the bridge's shadow, then the bridge: a low curved bar with feet
    g.beginPath(); g.ellipse(0, S.bridgeY + 0.014, bw / 2 + 0.01, 0.012, 0, 0, Math.PI * 2); g.fillStyle = "rgba(10,6,3,0.32)"; g.fill();
    const col = d.orn.gilded ? f.trim : mix(f.wood, IVORY, 0.35);
    g.beginPath();
    g.moveTo(-bw / 2, S.bridgeY + 0.008); g.quadraticCurveTo(0, S.bridgeY - 0.022, bw / 2, S.bridgeY + 0.008);
    g.lineTo(bw / 2 - 0.012, S.bridgeY + 0.014); g.quadraticCurveTo(0, S.bridgeY - 0.008, -bw / 2 + 0.012, S.bridgeY + 0.014); g.closePath();
    g.fillStyle = rodFill(g, S.bridgeY, 0.03, col); g.fill();
    g.strokeStyle = rgb(shade(col, -0.75), 0.75); g.lineWidth = 0.0025; g.stroke();
    // the tailpiece, a plate of metal with the strings' knots
    const ty = S.tailY, th = 0.03;
    g.beginPath(); g.ellipse(0, ty + 0.018, tw / 2, 0.012, 0, 0, Math.PI * 2); g.fillStyle = "rgba(10,6,3,0.3)"; g.fill();
    g.beginPath();
    g.moveTo(-tw / 2, ty - th / 2); g.lineTo(tw / 2, ty - th / 2); g.lineTo(tw / 2 - 0.02, ty + th / 2); g.lineTo(-tw / 2 + 0.02, ty + th / 2); g.closePath();
    g.fillStyle = metalFill(g, -tw / 2, ty - th, tw / 2, ty + th, f.trim); g.fill();
    g.strokeStyle = rgb(shade(f.trim, -0.8), 0.8); g.lineWidth = 0.0025; g.stroke();
    g.beginPath(); g.moveTo(-tw / 2 + 0.01, ty - th / 2 + 0.006); g.lineTo(tw / 2 - 0.01, ty - th / 2 + 0.006);
    g.strokeStyle = rgb(shade(f.trim, -0.5), 0.6); g.lineWidth = 0.0018; g.stroke();
  } else {
    g.beginPath(); g.moveTo(-bw / 2 + 0.01, S.bridgeY - 0.002); g.quadraticCurveTo(0, S.bridgeY - 0.019, bw / 2 - 0.01, S.bridgeY - 0.002);
    g.strokeStyle = sheen.c(0.55); g.lineWidth = 0.004; g.stroke();
    g.beginPath(); g.moveTo(-tw / 2 + 0.01, S.tailY - 0.011); g.lineTo(tw / 2 - 0.01, S.tailY - 0.011);
    g.strokeStyle = sheen.c(0.7); g.lineWidth = 0.004; g.stroke();
  }
}

/** The plectrum, hanging on its cord from the instrument's right side: the cord falls from (x0, y0) to (x1, y1). */
function plectrum(g: G2, d: Design, x0: number, y0: number, x1: number, y1: number, sheen: Sheen) {
  const f = d.finish;
  if (!sheen) {
    // the cord: a soft ribbon falling in a curve (no shadow on the page: the plate prints the object alone)
    const c = bez([x0, y0], [x0 + 0.03, y0 + (y1 - y0) * 0.25], [x1 + 0.01, y1 - (y1 - y0) * 0.45], [x1, y1], 20);
    const { L, R } = band(c, (t) => 0.011 - 0.004 * t);
    fillBand(g, L, R);
    const gr = g.createLinearGradient(x0, y0, x1, y1);
    gr.addColorStop(0, rgb(shade(f.ribbon, -0.35))); gr.addColorStop(0.4, rgb(shade(f.ribbon, 0.1))); gr.addColorStop(1, rgb(shade(f.ribbon, -0.3)));
    g.fillStyle = gr; g.fill();
    g.strokeStyle = rgb(shade(f.ribbon, -0.7), 0.6); g.lineWidth = 0.0018; g.stroke();
    // the plectrum: a little leaf of horn
    g.save(); g.translate(x1, y1 + 0.008); g.rotate(-0.15);
    g.beginPath(); g.moveTo(0, -0.012); g.quadraticCurveTo(0.016, 0.006, 0, 0.032); g.quadraticCurveTo(-0.016, 0.006, 0, -0.012);
    const pg = g.createLinearGradient(-0.012, 0, 0.012, 0.03); pg.addColorStop(0, rgb(HORN_TIP)); pg.addColorStop(1, rgb(shade(HORN, -0.3)));
    g.fillStyle = pg; g.fill(); g.strokeStyle = "rgba(20,12,6,0.6)"; g.lineWidth = 0.002; g.stroke();
    g.restore();
  } else {
    g.save(); g.translate(x1, y1 + 0.008); g.rotate(-0.15);
    g.beginPath(); g.moveTo(-sheen.side * 0.004, -0.004); g.lineTo(-sheen.side * 0.005, 0.016);
    g.strokeStyle = sheen.c(0.6); g.lineWidth = 0.003; g.stroke();
    g.restore();
  }
}

/** Studs of metal, in a row. */
function studs(g: G2, ps: P[], r: number, c: RGB, sheen: Sheen) {
  for (const [x, y] of ps) {
    if (!sheen) {
      const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
      gr.addColorStop(0, rgb(shade(c, 0.5))); gr.addColorStop(1, rgb(shade(c, -0.55)));
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
    } else {
      g.beginPath(); g.arc(x - sheen.side * r * 0.35, y - r * 0.35, r * 0.35, 0, Math.PI * 2); g.fillStyle = sheen.c(0.85); g.fill();
    }
  }
}

/** A horn or a curved wooden arm, as a band along a curve; lit from above, glinting along one edge. */
function arm(g: G2, c: P[], w: (t: number) => number, base: RGB, tip: RGB, ringed: boolean, seed: number, sheen: Sheen) {
  const { L, R } = band(c, w);
  if (!sheen) {
    fillBand(g, L, R);
    const [a, b] = [c[0], c[c.length - 1]];
    const gr = g.createLinearGradient(a[0], a[1], b[0], b[1]);
    gr.addColorStop(0, rgb(base)); gr.addColorStop(0.75, rgb(mix(base, tip, 0.5))); gr.addColorStop(1, rgb(tip));
    g.fillStyle = gr; g.fill();
    g.save(); g.clip();
    // rounded: shade along both edges
    g.lineCap = "round";
    for (const [f, a2] of [[0.1, 0.42], [0.92, 0.5]] as const) {
      g.beginPath(); trace(g, across(L, R, f)); g.strokeStyle = `rgba(8,5,2,${a2})`; g.lineWidth = w(0.4) * 0.28; g.stroke();
    }
    if (ringed) {
      // a horn's growth rings
      const rr = seeded(seed);
      for (let k = 1; k < c.length - 2; k++) {
        if (rr() < 0.35) continue;
        g.beginPath(); g.moveTo(L[k][0], L[k][1]); g.quadraticCurveTo(c[k][0] + 0.004, c[k][1] + 0.006, R[k][0], R[k][1]);
        g.strokeStyle = `rgba(20,12,6,${0.16 + rr() * 0.22})`; g.lineWidth = 0.0022; g.stroke();
      }
    } else {
      for (const f of [0.3, 0.5, 0.68]) { g.beginPath(); trace(g, across(L, R, f)); g.strokeStyle = "rgba(30,16,6,0.16)"; g.lineWidth = 0.002; g.stroke(); }
    }
    g.restore();
    fillBand(g, L, R); g.strokeStyle = "rgba(8,5,2,0.6)"; g.lineWidth = 0.0028; g.stroke();
  } else {
    // the glint runs along the side of the arm turned to the light
    const f = sheen.side < 0 ? 0.3 : 0.62;
    const edge = c[Math.floor(c.length / 2)][0] < 0 ? f : 1 - f;
    g.beginPath(); trace(g, across(L, R, edge));
    g.strokeStyle = sheen.c(0.55); g.lineWidth = w(0.5) * 0.16; g.lineCap = "round"; g.stroke();
  }
  return { L, R };
}

// ── the kinds ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** A shell: its rim of plates around a hide sounding board. */
function shell(g: G2, d: Design, cx: number, cy: number, rx: number, ry: number, sheen: Sheen) {
  const f = d.finish, sh = f.shell ?? AMBER, mo = f.mottle ?? BLOTCH;
  const hx = rx * 0.86, hy = ry * 0.84;
  if (sheen) {
    g.beginPath(); g.ellipse(cx, cy, rx * 0.97, ry * 0.97, 0, sheen.side < 0 ? Math.PI * 1.05 : Math.PI * 1.55, sheen.side < 0 ? Math.PI * 1.45 : Math.PI * 1.95);
    g.strokeStyle = sheen.c(0.5); g.lineWidth = 0.006; g.stroke();
    return;
  }
  // the rim: a dome of shell, mottled, in plates
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  const dome = g.createRadialGradient(cx - rx * 0.25, cy - ry * 0.4, rx * 0.1, cx, cy, rx * 1.05);
  dome.addColorStop(0, rgb(shade(sh, 0.15))); dome.addColorStop(0.7, rgb(sh)); dome.addColorStop(1, rgb(shade(sh, -0.55)));
  g.fillStyle = dome; g.fill();
  g.save(); g.clip();
  const r = seeded(d.id.length * 97 + 13);
  for (let k = 0; k < 40; k++) {            // a tortoise shell's dark clouds
    const a = r() * Math.PI * 2, rr = 0.82 + r() * 0.2, x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr, s = (0.03 + r() * 0.05) * rx * 4;
    const m = g.createRadialGradient(x, y, 0, x, y, s);
    m.addColorStop(0, rgb(mo, 0.55)); m.addColorStop(1, rgb(mo, 0));
    g.fillStyle = m; g.fillRect(x - s, y - s, 2 * s, 2 * s);
  }
  const K = 22;
  for (let k = 0; k < K; k++) {             // the seams between the plates of the rim
    const a = (k / K) * Math.PI * 2 + 0.07;
    g.beginPath(); g.moveTo(cx + Math.cos(a) * hx, cy + Math.sin(a) * hy); g.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
    g.strokeStyle = "rgba(14,7,3,0.6)"; g.lineWidth = 0.0035; g.stroke();
  }
  for (const k of [0.9, 0.95]) { g.beginPath(); g.ellipse(cx, cy, rx * k, ry * k, 0, 0, Math.PI * 2); g.strokeStyle = "rgba(14,7,3,0.22)"; g.lineWidth = 0.002; g.stroke(); }
  g.restore();
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.strokeStyle = "rgba(8,4,2,0.7)"; g.lineWidth = 0.003; g.stroke();
  // the hide, drawn tight, sewn to the rim
  g.beginPath(); g.ellipse(cx, cy, hx, hy, 0, 0, Math.PI * 2);
  const hg = g.createRadialGradient(cx - hx * 0.2, cy - hy * 0.3, hx * 0.1, cx, cy, hx * 1.05);
  hg.addColorStop(0, rgb(shade(f.board, 0.12))); hg.addColorStop(0.75, rgb(f.board)); hg.addColorStop(1, rgb(shade(f.board, -0.4)));
  g.fillStyle = hg; g.fill();
  g.save(); g.clip();
  const rh = seeded(7);
  for (let k = 0; k < 8; k++) {
    const x = cx + (rh() * 2 - 1) * hx * 0.8, y = cy + (rh() * 2 - 1) * hy * 0.7, s = (0.25 + rh() * 0.4) * hx;
    const m = g.createRadialGradient(x, y, 0, x, y, s);
    m.addColorStop(0, `rgba(90,60,30,${0.05 + rh() * 0.07})`); m.addColorStop(1, "rgba(90,60,30,0)");
    g.fillStyle = m; g.fillRect(x - s, y - s, 2 * s, 2 * s);
  }
  // the rim's shadow on the hide
  g.beginPath(); g.ellipse(cx, cy - hy * 0.06, hx * 1.02, hy * 1.0, 0, Math.PI * 1.05, Math.PI * 1.95); g.strokeStyle = "rgba(20,12,5,0.35)"; g.lineWidth = hy * 0.12; g.stroke();
  g.restore();
  g.beginPath(); g.ellipse(cx, cy, hx, hy, 0, 0, Math.PI * 2); g.strokeStyle = "rgba(30,18,8,0.6)"; g.lineWidth = 0.003; g.stroke();
  g.save(); g.setLineDash([0.004, 0.014]);
  g.beginPath(); g.ellipse(cx, cy, hx - 0.01, hy - 0.009, 0, 0, Math.PI * 2); g.strokeStyle = "rgba(60,36,16,0.6)"; g.lineWidth = 0.0035; g.stroke();
  g.restore();
}

function paintChelys(g: G2, d: Design, S: Shape, tops: number[], sheen: Sheen) {
  const f = d.finish;
  const rx = Math.max(0.22, S.topSpan / 2 + 0.075), ry = 0.175, cy = 0.81;
  // the arms first (their feet go under the shell's rim), then the shell, then the yoke: each rises from the top of the
  // shell, leaning out and then in to the yoke, and its tip curls outwards above it
  for (const s of [-1, 1] as const) {
    const xb = s * rx * 0.5, xt = s * S.barX * 0.88;
    const c = [...bez([xb, cy - ry * 0.7], [s * (rx * 0.5 + 0.13), 0.5], [s * (S.barX * 1.04), 0.3], [xt, S.barY]),
      ...bez([xt, S.barY], [xt + s * 0.004, S.barY - 0.035], [xt + s * 0.03, S.barY - 0.07], [xt + s * 0.066, S.barY - 0.086], 8).slice(1)];
    arm(g, c, (t) => 0.05 - 0.032 * t, f.arm ?? f.wood, f.armTip ?? f.wood, !!f.armTip && f.arm !== IVORY, 40 + s, sheen);
  }
  shell(g, d, 0, cy, rx, ry, sheen);
  if (d.orn.studs) studs(g, Array.from({ length: 12 }, (_, k) => { const a = Math.PI * (0.1 + 0.8 * (k / 11)); return [Math.cos(a) * rx * 0.94, cy + Math.sin(a) * ry * 0.94] as P; }), 0.0065, f.trim, sheen);
  bridgeAndTail(g, d, S, sheen);
  yoke(g, d, S, tops, sheen);
  plectrum(g, d, rx * 0.93, cy - ry * 0.3, S.w / 2 - 0.03, cy + ry * 0.5, sheen);
}

function paintBarbitos(g: G2, d: Design, S: Shape, tops: number[], sheen: Sheen) {
  const f = d.finish;
  const rx = 0.15, ry = 0.13, cy = 0.85;
  for (const s of [-1, 1] as const) {
    // long arms: out from the little shell, in again below the yoke, and their tips flaring out above it
    const xb = s * 0.055, xm = s * (S.barX + 0.07), xt = s * (S.barX - 0.03);
    const c = [...bez([xb, cy - ry * 0.75], [s * 0.2, cy - ry - 0.05], [xm, 0.6], [xm, 0.44]),
      ...bez([xm, 0.44], [xm, 0.3], [s * (S.barX - 0.07), 0.22], [xt, S.barY]).slice(1),
      ...bez([xt, S.barY], [xt + s * 0.004, S.barY - 0.03], [xt + s * 0.03, S.barY - 0.07], [xt + s * 0.075, S.barY - 0.085], 8).slice(1)];
    arm(g, c, (t) => 0.042 - 0.024 * t, f.arm ?? f.wood, f.armTip ?? f.wood, false, 60 + s, sheen);
  }
  shell(g, d, 0, cy, rx, ry, sheen);
  bridgeAndTail(g, d, S, sheen);
  yoke(g, d, S, tops, sheen);
  plectrum(g, d, rx * 0.95, cy - ry * 0.2, rx + 0.07, cy + ry * 0.55, sheen);
}

/** The outline of a kithara's frame (both arms and the box), as one path, and its parts. */
function kitharaFrame(S: Shape, round: boolean) {
  const { it, ot, ib, ob } = kitharaArms(S.topSpan);
  const yTop = S.barY + 0.012, yJoin = 0.56, yShoulder = 0.62, yBase = round ? 0.995 : 0.965;
  // right half, from the top of the arm's inner edge, down, round the box, and up the outer edge
  const inner = bez([it, yTop], [it - 0.005, 0.3], [ib + 0.01, 0.46], [ib, yJoin]);
  const arch = bez([ib, yJoin], [ib * 0.6, yJoin - 0.025], [ib * 0.2, yJoin - 0.03], [0, yJoin - 0.03], 12);
  const outerUp = round
    ? [...bez([0, yBase], [ob * 0.75, yBase], [ob + 0.02, 0.86], [ob, yShoulder + 0.02]), ...bez([ob, yShoulder + 0.02], [ob - 0.01, 0.45], [ot + 0.02, 0.28], [ot, yTop]).slice(1)]
    : [...bez([0, yBase], [ob * 0.5, yBase], [ob - 0.03, yBase], [ob - 0.02, 0.9], 8), ...bez([ob - 0.02, 0.9], [ob - 0.05, 0.8], [ob - 0.05, 0.7], [ob, yShoulder]).slice(1),
      ...bez([ob, yShoulder], [ob + 0.02, 0.5], [ot + 0.05, 0.3], [ot, yTop]).slice(1)];
  return { inner, arch, outerUp, it, ot, ib, ob, yTop, yJoin, yShoulder, yBase };
}

function paintKithara(g: G2, d: Design, S: Shape, tops: number[], sheen: Sheen, round: boolean) {
  const f = d.finish, o = d.orn;
  const K = kitharaFrame(S, round);
  const body = f.wood;
  // the whole frame (both arms and the box) as one closed outline
  const right: P[] = [...K.outerUp].reverse();                          // from the top of the right arm's outer edge, down to the foot
  const path = (gg: G2) => {
    gg.beginPath();
    // left outer edge, from the foot up to the top
    trace(gg, mirror(K.outerUp));
    // across the top of the left arm to its inner edge, and down it to the box
    trace(gg, mirror(K.inner), false);
    // the arch of the box between the arms
    trace(gg, mirror(K.arch), false);
    trace(gg, [...K.arch].reverse(), false);
    // up the right arm's inner edge, across, and down its outer edge to the foot
    trace(gg, [...K.inner].reverse(), false);
    trace(gg, right, false);
    gg.closePath();
  };
  if (!sheen) {
    path(g);
    const col = o.gilded ? mix(body, f.trim, 0.55) : body;
    const gr = g.createLinearGradient(-K.ob, 0, K.ob, 0);
    gr.addColorStop(0, rgb(shade(col, -0.45))); gr.addColorStop(0.12, rgb(shade(col, 0.08))); gr.addColorStop(0.5, rgb(col));
    gr.addColorStop(0.88, rgb(shade(col, -0.1))); gr.addColorStop(1, rgb(shade(col, -0.55)));
    g.fillStyle = gr; g.fill();
    g.save(); g.clip();
    grain(g, -K.ob, K.yTop, K.ob, K.yBase, f.grain, 3 + d.n, true, 70);
    // the box below the arms is a little nearer the eye: a soft shade where the arms rise from it
    const v = g.createLinearGradient(0, K.yJoin - 0.06, 0, K.yJoin + 0.05);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(0.5, "rgba(0,0,0,0.12)"); v.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = v; g.fillRect(-K.ob - 0.1, K.yJoin - 0.06, 2 * K.ob + 0.2, 0.11);
    g.restore();
    path(g); g.strokeStyle = rgb(shade(col, -0.85), 0.85); g.lineWidth = 0.004; g.stroke();
    // a fillet of trim inside the outline
    g.save(); path(g); g.clip();
    path(g); g.strokeStyle = rgb(f.trim, 0.85); g.lineWidth = 0.014; g.stroke();
    path(g); g.strokeStyle = rgb(shade(f.trim, -0.6), 0.6); g.lineWidth = 0.004; g.stroke();
    g.restore();
  } else {
    g.save(); path(g); g.clip();
    g.beginPath(); trace(g, (sheen.side < 0 ? mirror(K.outerUp) : K.outerUp).map(([x, y]) => [x - Math.sign(x || 1) * 0.012, y] as P));
    g.strokeStyle = sheen.c(0.6); g.lineWidth = 0.01; g.stroke();
    g.restore();
  }

  // the face of the box: a panel framed by a border, with its ornament
  const py0 = K.yJoin + 0.035, py1 = K.yBase - 0.06;
  const half = (y: number) => {                                // the panel's half-width at height y, inside the box
    const t = (y - K.yShoulder) / (K.yBase - K.yShoulder);
    return round ? (K.ob - 0.06) * Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, t - 0.1) / 0.95, 2))) * 0.96 : K.ob - 0.075 - 0.02 * Math.sin(Math.PI * Math.max(0, Math.min(1, t)));
  };
  const panel = (gg: G2) => {
    gg.beginPath();
    const N = 30, ps: P[] = [];
    for (let k = 0; k <= N; k++) { const y = py0 + (py1 - py0) * (k / N); ps.push([half(y), y]); }
    trace(gg, mirror(ps)); trace(gg, [...ps].reverse(), false); gg.closePath();
  };
  if (!sheen) {
    if (f.panel) {
      panel(g);
      const pg = g.createLinearGradient(0, py0, 0, py1);
      pg.addColorStop(0, rgb(shade(f.panel, -0.2))); pg.addColorStop(1, rgb(shade(f.panel, 0.08)));
      g.fillStyle = pg; g.fill();
      // the sounding board, a lighter wooden face set in the panel
      g.save(); panel(g); g.clip();
      g.beginPath(); g.roundRect(-half(py0 + 0.1) + 0.035, py0 + 0.03, 2 * (half(py0 + 0.1) - 0.035), py1 - py0 - 0.06, 0.02);
      const bg = g.createLinearGradient(0, py0, 0, py1);
      bg.addColorStop(0, rgb(shade(f.board, -0.1))); bg.addColorStop(0.5, rgb(f.board)); bg.addColorStop(1, rgb(shade(f.board, -0.25)));
      g.fillStyle = bg; g.fill();
      g.save(); g.clip(); grain(g, -K.ob, py0, K.ob, py1, f.grain, 77 + d.n, false, 30); g.restore();
      g.strokeStyle = rgb(f.trim, 0.9); g.lineWidth = 0.004; g.stroke();
      g.restore();
      panel(g); g.strokeStyle = rgb(f.trim); g.lineWidth = 0.006; g.stroke();
    }
    // the border above the panel
    if (o.border) borderRun(g, -half(py0) + 0.01, half(py0) - 0.01, py0 - 0.016, 0.03, o.border, f.trim, shade(f.panel ?? f.wood, -0.3));
    // and the base: a moulding with a band of ornament
    if (!round) {
      const bx = K.ob - 0.03;
      borderRun(g, -bx, bx, K.yBase - 0.022, 0.034, o.border ?? "lines", f.trim, shade(f.panel ?? f.wood, -0.35));
      g.beginPath(); g.moveTo(-bx, K.yBase - 0.004); g.lineTo(bx, K.yBase - 0.004); g.strokeStyle = rgb(shade(f.trim, -0.4)); g.lineWidth = 0.006; g.stroke();
    }
    // the ornament at the heart of the face, below the bridge
    const oy = (S.bridgeY + S.tailY) / 2 + 0.005, or = Math.min(0.05, (S.tailY - S.bridgeY) * 0.42);
    const c = o.centre ?? "none";
    if (c === "rosette") rosette(g, 0, oy, or, 8, f.trim, shade(f.trim, -0.8));
    if (c === "sun") {
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * Math.PI * 2, r1 = or * 0.42, r2 = or * (k % 2 ? 0.86 : 1.18);
        g.beginPath(); g.moveTo(Math.cos(a - 0.12) * r1, oy + Math.sin(a - 0.12) * r1); g.lineTo(Math.cos(a) * r2, oy + Math.sin(a) * r2); g.lineTo(Math.cos(a + 0.12) * r1, oy + Math.sin(a + 0.12) * r1);
        g.fillStyle = rgb(shade(f.trim, k % 2 ? -0.15 : 0.1)); g.fill();
      }
      g.beginPath(); g.arc(0, oy, or * 0.4, 0, Math.PI * 2); g.fillStyle = metalFill(g, -or, oy - or, or, oy + or, f.trim); g.fill();
    }
    if (c === "wheel") {
      g.beginPath(); g.arc(0, oy, or * 0.9, 0, Math.PI * 2); g.strokeStyle = rgb(f.trim); g.lineWidth = or * 0.12; g.stroke();
      for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; g.beginPath(); g.moveTo(0, oy); g.lineTo(Math.cos(a) * or * 0.85, oy + Math.sin(a) * or * 0.85); g.lineWidth = or * 0.07; g.stroke(); }
      g.beginPath(); g.arc(0, oy, or * 0.2, 0, Math.PI * 2); g.fillStyle = rgb(f.trim); g.fill();
    }
    if (c === "laurel") laurel(g, 0, oy, or * 1.5, f.trim);
    // the volutes on the shoulders, where the arms rise from the box
    for (const s of [-1, 1] as const) volute(g, s * (K.ob - 0.035), K.yShoulder + 0.02, 0.03, s === 1 ? 1 : -1, 0.008, f.trim);
    // the discs where the arms meet the yoke
    for (const s of [-1, 1] as const) {
      const cx = s * ((K.it + K.ot) / 2), r = (K.ot - K.it) * 0.72;
      g.beginPath(); g.arc(cx + 0.006, S.barY + 0.01, r, 0, Math.PI * 2); g.fillStyle = "rgba(0,0,0,0.3)"; g.fill();
      g.beginPath(); g.arc(cx, S.barY, r, 0, Math.PI * 2); g.fillStyle = metalFill(g, cx - r, S.barY - r, cx + r, S.barY + r, f.trim); g.fill();
      g.strokeStyle = rgb(shade(f.trim, -0.8), 0.8); g.lineWidth = 0.003; g.stroke();
      if (o.discs === "rosette") rosette(g, cx, S.barY, r * 0.8, 10, shade(f.trim, 0.05), shade(f.trim, -0.8));
      else { g.beginPath(); g.arc(cx, S.barY, r * 0.6, 0, Math.PI * 2); g.strokeStyle = rgb(shade(f.trim, -0.5)); g.lineWidth = 0.003; g.stroke(); }
    }
    if (o.studs) {
      const ps: P[] = [];
      for (const s of [-1, 1]) for (let k = 0; k < 6; k++) { const y = 0.24 + k * 0.055; ps.push([s * ((K.it + K.ot) / 2 + 0.012 + 0.018 * (k / 5)), y]); }
      studs(g, ps, 0.006, f.trim, sheen);
    }
  } else {
    for (const s of [-1, 1] as const) {
      const cx = s * ((K.it + K.ot) / 2), r = (K.ot - K.it) * 0.72;
      g.beginPath(); g.arc(cx - sheen.side * r * 0.3, S.barY - r * 0.35, r * 0.32, 0, Math.PI * 2); g.fillStyle = sheen.c(0.8); g.fill();
    }
    if (o.studs) {
      const ps: P[] = [];
      for (const s of [-1, 1]) for (let k = 0; k < 6; k++) { const y = 0.24 + k * 0.055; ps.push([s * ((K.it + K.ot) / 2 + 0.012 + 0.018 * (k / 5)), y]); }
      studs(g, ps, 0.006, f.trim, sheen);
    }
    g.beginPath(); g.arc(0, (S.bridgeY + S.tailY) / 2 + 0.005, 0.03, Math.PI * 1.1, Math.PI * 1.6); g.strokeStyle = sheen.c(0.4); g.lineWidth = 0.004; g.stroke();
  }
  bridgeAndTail(g, d, S, sheen);
  yoke(g, d, S, tops, sheen);
  plectrum(g, d, K.ob - 0.02, K.yShoulder + 0.05, K.ob + 0.045, round ? 0.86 : 0.83, sheen);
}

/** A sprig of laurel on each side, bending round. */
function laurel(g: G2, cx: number, cy: number, r: number, c: RGB) {
  for (const s of [-1, 1]) {
    const stem = bez([cx, cy + r * 0.55], [cx + s * r * 0.75, cy + r * 0.45], [cx + s * r * 0.85, cy - r * 0.2], [cx + s * r * 0.35, cy - r * 0.6], 10);
    g.beginPath(); trace(g, stem); g.strokeStyle = rgb(shade(c, -0.3)); g.lineWidth = r * 0.04; g.stroke();
    stem.forEach(([x, y], k) => {
      if (k === 0 || k % 2) return;
      for (const side of [-1, 1]) {
        const [nx, ny] = stem[Math.min(stem.length - 1, k + 1)], a = Math.atan2(ny - y, nx - x) + side * 0.9;
        g.save(); g.translate(x, y); g.rotate(a);
        g.beginPath(); g.ellipse(r * 0.12, 0, r * 0.13, r * 0.045, 0, 0, Math.PI * 2);
        g.fillStyle = rgb(shade(c, side > 0 ? 0.1 : -0.15)); g.fill();
        g.restore();
      }
    });
  }
}

function paintPhorminx(g: G2, d: Design, S: Shape, tops: number[], sheen: Sheen) {
  const f = d.finish, o = d.orn;
  const R = S.w / 2 - 0.09, cy = 0.66, ry = 0.32;
  const ot = S.barX - 0.035, it = ot - 0.06;
  // one frame of wood: a round body that rises into two short arms
  const outer: P[] = [...bez([0, cy + ry], [R * 0.9, cy + ry], [R + 0.02, cy + 0.06], [R, cy - 0.06]), ...bez([R, cy - 0.06], [R - 0.02, 0.4], [ot + 0.03, 0.25], [ot, S.barY + 0.01]).slice(1)];
  const inner: P[] = [...bez([it, S.barY + 0.01], [it - 0.005, 0.25], [it * 0.9 + 0.02, 0.4], [it * 0.82, 0.48]), ...bez([it * 0.82, 0.48], [it * 0.55, 0.455], [it * 0.2, 0.45], [0, 0.45], 10).slice(1)];
  const path = (gg: G2) => {
    gg.beginPath();
    trace(gg, [...mirror(outer)].reverse());          // up the left side from the foot... (reversed: from the left arm top down to the foot)
    trace(gg, outer, false);                           // foot to the right arm's top
    trace(gg, [...inner], false);                      // down the right arm's inner edge to the middle
    trace(gg, [...mirror(inner)].reverse(), false);    // and up the left arm's inner edge
    gg.closePath();
  };
  if (!sheen) {
    g.save(); g.translate(0.012, 0.016); path(g); g.fillStyle = "rgba(0,0,0,0.3)"; g.fill(); g.restore();
    path(g);
    const gr = g.createRadialGradient(-R * 0.2, cy - ry * 0.3, R * 0.1, 0, cy, R * 1.2);
    gr.addColorStop(0, rgb(shade(f.wood, 0.12))); gr.addColorStop(0.7, rgb(f.wood)); gr.addColorStop(1, rgb(shade(f.wood, -0.5)));
    g.fillStyle = gr; g.fill();
    g.save(); g.clip(); grain(g, -R, S.barY, R, cy + ry, f.grain, 9 + d.n, true, 60); g.restore();
    path(g); g.strokeStyle = rgb(shade(f.wood, -0.85), 0.85); g.lineWidth = 0.004; g.stroke();
    g.save(); path(g); g.clip();
    path(g); g.strokeStyle = rgb(f.trim, 0.8); g.lineWidth = 0.016; g.stroke();
    path(g); g.strokeStyle = rgb(shade(f.trim, -0.6), 0.55); g.lineWidth = 0.004; g.stroke();
    g.restore();
    // the sounding board: a crescent face, edged with trim
    const face = (gg: G2) => {
      gg.beginPath();
      gg.moveTo(-it * 0.8, 0.5);
      gg.bezierCurveTo(-it * 0.4, 0.475, it * 0.4, 0.475, it * 0.8, 0.5);
      gg.bezierCurveTo(R * 0.92, 0.56, R * 0.9, cy + ry * 0.75, 0, cy + ry - 0.04);
      gg.bezierCurveTo(-R * 0.9, cy + ry * 0.75, -R * 0.92, 0.56, -it * 0.8, 0.5);
      gg.closePath();
    };
    face(g);
    const bg = g.createRadialGradient(0, cy - 0.05, 0.02, 0, cy, R);
    bg.addColorStop(0, rgb(shade(f.board, 0.1))); bg.addColorStop(1, rgb(shade(f.board, -0.35)));
    g.fillStyle = bg; g.fill();
    g.strokeStyle = rgb(f.trim); g.lineWidth = 0.005; g.stroke();
    // a band of ornament across the top of the face, and a small one at its heart below the bridge
    if (o.border) {
      g.save(); face(g); g.clip();
      borderRun(g, -R, R, 0.5 + 0.022, 0.026, o.border, f.trim, shade(f.board, -0.45));
      g.restore();
    }
    if (o.centre === "rosette") rosette(g, 0, (S.bridgeY + S.tailY) / 2 + 0.004, 0.035, 8, f.trim, shade(f.trim, -0.8));
  } else {
    g.save(); path(g); g.clip();
    g.beginPath(); trace(g, (sheen.side < 0 ? mirror(outer) : outer).map(([x, y]) => [x - Math.sign(x || 1) * 0.012, y] as P));
    g.strokeStyle = sheen.c(0.55); g.lineWidth = 0.01; g.stroke();
    g.restore();
  }
  bridgeAndTail(g, d, S, sheen);
  yoke(g, d, S, tops, sheen);
  plectrum(g, d, R * 0.97, cy - 0.04, R + 0.05, cy + ry * 0.55, sheen);
}

/** The glints are drawn twice, once as the light from the left would place them and once from the right. */
type Sheen = null | { side: -1 | 1; c: (a: number) => string };

function paintKind(g: G2, d: Design, S: Shape, tops: number[], sheen: Sheen) {
  switch (d.kind) {
    case "chelys": return paintChelys(g, d, S, tops, sheen);
    case "barbitos": return paintBarbitos(g, d, S, tops, sheen);
    case "kithara": return paintKithara(g, d, S, tops, sheen, false);
    case "round-kithara": return paintKithara(g, d, S, tops, sheen, true);
    case "phorminx": return paintPhorminx(g, d, S, tops, sheen);
  }
}

/** Where the strings meet the yoke, in units, low to high. */
export function stringTops(S: Shape, n: number) {
  return Array.from({ length: n }, (_, i) => (n > 1 ? -S.topSpan / 2 + (i * S.topSpan) / (n - 1) : 0));
}

/** The instrument in its own colours, under a soft light from above. `g` is set to its units. */
export function paintAlbedo(g: G2, d: Design, S: Shape) {
  paintKind(g, d, S, stringTops(S, d.n), null);
}
