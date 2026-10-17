/**
 * One plucked gut string, as a physical model (a digital waveguide: the Karplus–Strong family), rendered into a buffer.
 * Nothing here is a recording; it is the arithmetic of a vibrating string, so the same code runs in the browser and in
 * the script that renders whole pieces.
 *
 * What makes it sound like a real string rather than a beep:
 * - The pluck: the plectrum pulls the string aside near one end and lets go, so the string starts as a triangle with its
 *   corner at the plucking point. Plucking there silences the partials that have a node at that point, as on any string.
 *   A soft touch rounds the corner (fewer high partials); a hard one leaves it sharp and adds the plectrum's click.
 * - Losses: every time the wave runs the length of the string it loses a little, the high partials more than the low,
 *   so the sound darkens as it dies away. Gut strings are dull next to steel ones, and low strings ring longer.
 * - Two planes: a string swings both across and towards the sound board; the two swings are tuned a hair apart and die at
 *   different rates, so the tone has a slow shimmer and a long, quiet tail after the first fall.
 * - A hard pluck stretches the string a little, so its pitch starts a few cents sharp and settles within a tenth of a
 *   second.
 * The sound box (tortoise shell and hide) and the room are added afterwards, by the player (sound.ts).
 */

export interface PluckSpec {
  hz: number;
  /** 0 to 1: how hard the string is plucked (only its tone; loudness is applied by the player) */
  strength: number;
  sr: number;
  /** a number that varies the plucking point and the noise of the touch, so repeated notes are not identical */
  seed?: number;
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/** How long the string rings, in seconds, until it has fallen by 60 dB: about 4.4 s at 110 Hz, 2.2 s at 440 Hz. */
export const ringTime = (hz: number) => clamp(4.4 * Math.sqrt(110 / hz), 0.9, 5.2);

function rng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
}

interface Guide { N: number; line: Float32Array; i: number; lpA: number; lpY: number; apX: number; apY: number; g: number; dLP: number }

/** The phase delay, in samples, of the one-pole low-pass y = (1 - a) x + a y[-1] at angular frequency w. */
const lpDelay = (a: number, w: number) => Math.atan2(a * Math.sin(w), 1 - a * Math.cos(w)) / w;

function guide(hz: number, sr: number, a: number, t60: number, shape: Float32Array | null, sharpest = 1): Guide {
  const w = (2 * Math.PI * hz) / sr;
  const P = sr / hz, dLP = lpDelay(a, w);
  // the whole samples of the loop; an all-pass filter makes up the remaining fraction (at least 0.5, where the filter
  // is stable and accurate, even at the sharpest moment of a hard pluck), so the pitch is exact to a fraction of a cent
  const N = Math.max(2, Math.floor(P * sharpest - dLP - 0.5));
  const line = new Float32Array(N);
  if (shape) for (let k = 0; k < N; k++) line[k] = shape[Math.floor((k / N) * shape.length)];
  // the loss per trip, so the fundamental falls by 60 dB in t60; the low-pass loses a little at the fundamental, which
  // the gain makes up
  const lpMag = (1 - a) / Math.hypot(1 - a * Math.cos(w), a * Math.sin(w));
  const g = Math.pow(10, -3 / (t60 * hz)) / lpMag;
  return { N, line, i: 0, lpA: a, lpY: 0, apX: 0, apY: 0, g, dLP };
}

/** One sample of a string: read the oldest sample, filter it, write it back. `P` is the loop's length this sample. */
function tick(s: Guide, P: number) {
  const out = s.line[s.i];
  s.lpY = (1 - s.lpA) * out + s.lpA * s.lpY;
  const d = P - s.N - s.dLP;                         // the fraction the all-pass delays by (about 0.5 to 1.5)
  const C = (1 - d) / (1 + d);
  const y = C * s.lpY + s.apX - C * s.apY;
  s.apX = s.lpY; s.apY = y;
  s.line[s.i] = y * s.g;
  s.i = s.i + 1 === s.N ? 0 : s.i + 1;
  return out;
}

/** Render one pluck. Returns mono samples at `sr`, peaking at about 1 for a full-strength pluck. */
export function renderPluck({ hz, strength, sr, seed = 1 }: PluckSpec): Float32Array {
  const s = clamp(strength, 0, 1);
  const rand = rng(seed * 2654435761 + Math.round(hz * 100));
  const t60 = ringTime(hz);
  const secs = Math.min(6, t60 * 1.1 + 0.2);
  const n = Math.ceil(sr * secs);
  // gut is darker than steel; high strings keep their brightness for fewer trips, so they get a lighter filter
  const a = clamp(0.62 - 0.17 * Math.log2(hz / 110), 0.1, 0.66);

  // the shape of the string as the plectrum lets go: a triangle with its corner at the plucking point (an eighth to a
  // fifth of the way along), smoothed by how soft the touch is, with a trace of roughness from the plectrum
  const L = 512, beta = 0.13 + 0.05 * (rand() * 0.5 + 0.5);
  const shape = new Float32Array(L);
  for (let k = 0; k < L; k++) {
    const x = k / L;
    shape[k] = (x < beta ? x / beta : (1 - x) / (1 - beta)) + 0.05 * rand();
  }
  const soft = clamp(0.92 - 0.75 * s, 0.1, 0.95);    // a one-pole smoothing, run forwards and back (no phase shift)
  for (let pass = 0; pass < 2; pass++) {
    let y = shape[pass ? L - 1 : 0];
    for (let j = 0; j < L; j++) { const k = pass ? L - 1 - j : j; y = (1 - soft) * shape[k] + soft * y; shape[k] = y; }
  }
  let mean = 0; for (let k = 0; k < L; k++) mean += shape[k]; mean /= L;
  let peak = 0; for (let k = 0; k < L; k++) { shape[k] -= mean; peak = Math.max(peak, Math.abs(shape[k])); }
  for (let k = 0; k < L; k++) shape[k] /= peak || 1;

  // two planes of motion, a third of a cent apart either way; the one towards the board dies sooner
  const cents = 0.35;
  const hzA = hz * 2 ** (cents / 1200), hzB = hz * 2 ** (-cents / 1200);
  // the stretch of a hard pluck: up to 6 cents sharp, settling with a time constant of 0.12 s
  const glide = 6 * s * s, tau = 0.12 * sr, sharpest = 2 ** (-glide / 1200);
  const A = guide(hzA, sr, a, t60 * 0.72, shape, sharpest);
  const B = guide(hzB, sr, a * 0.92, t60 * 1.35, shape, sharpest);
  const PA = sr / hzA, PB = sr / hzB;

  const y = new Float32Array(n);
  const gEnd = glide ? Math.min(n, Math.ceil(tau * 7)) : 0;      // after seven time constants the glide is over
  for (let k = 0; k < gEnd; k++) {
    const sharp = 2 ** (-(glide * Math.exp(-k / tau)) / 1200);
    y[k] = 0.62 * tick(A, PA * sharp) + 0.38 * tick(B, PB * sharp);
  }
  for (let k = gEnd; k < n; k++) y[k] = 0.62 * tick(A, PA) + 0.38 * tick(B, PB);

  // the plectrum's click: a few milliseconds of bright noise, only for a firm touch
  const click = Math.floor(sr * 0.004), cl = 0.05 * s * s;
  if (cl > 0.002) {
    let lp = 0, hp = 0, prev = 0;
    for (let k = 0; k < click; k++) {
      const env = Math.sin((Math.PI * k) / click);
      const v = rand();
      lp = 0.55 * lp + 0.45 * v;                     // a band of noise around 3–6 kHz: low-pass, then high-pass
      hp = 0.85 * (hp + lp - prev); prev = lp;
      y[k] += cl * env * hp;
    }
  }

  // take away any slow drift (a high-pass at about 20 Hz), and fade the last 80 ms so a note never ends with a click
  let hx = 0, hy = 0;
  const R = 1 - (2 * Math.PI * 20) / sr;
  for (let k = 0; k < n; k++) { const v = y[k]; hy = v - hx + R * hy; hx = v; y[k] = hy; }
  const fade = Math.floor(sr * 0.08);
  for (let k = 0; k < fade; k++) y[n - 1 - k] *= k / fade;
  return y;
}

/**
 * The sound box, as an impulse response: a direct path, and the ringing of the hide sounding board and the air in the
 * tortoise shell at a handful of broad resonances, each a few decibels at most, which colour every note the same way
 * (a woody warmth in the low middle, a little nasal brightness above it). The modes are chosen by ear for a small shell lyre; they are not measurements
 * of a surviving instrument, since none survives in playable condition.
 */
export function bodyResponse(sr: number): Float32Array {
  const len = Math.floor(sr * 0.25);
  const ir = new Float32Array(len);
  // [frequency, sharpness (Q), how much it rises above the direct sound at its peak]
  const modes: [hz: number, q: number, rise: number][] = [
    [185, 16, 1.4], [262, 18, 1.7], [395, 18, 1.45], [560, 16, 1.2], [780, 14, 1.0],
    [1080, 12, 0.8], [1520, 10, 0.6], [2150, 9, 0.45], [3050, 7, 0.3], [4300, 6, 0.18],
  ];
  ir[0] = 1;
  for (const [f, q, rise] of modes) {
    const w = (2 * Math.PI * f) / sr, tau = (q / (Math.PI * f)) * sr;     // the mode's time constant, in samples
    // a ringing sine whose peak response, about amp·tau/2, is `rise` times the direct sound's
    const amp = (2 * rise) / tau;
    for (let i = 1; i < len; i++) { const e = Math.exp(-i / tau); if (e < 1e-4) break; ir[i] += amp * e * Math.sin(w * i); }
  }
  const fade = Math.floor(sr * 0.03);
  for (let i = 0; i < fade; i++) ir[len - 1 - i] *= i / fade;
  return ir;
}

/**
 * The room: a hall of stone at night. Early echoes from the walls (left and right a little apart, so the sound has
 * width), then a tail that dies over about two seconds and darkens as it goes, as stone and air swallow the highs.
 */
export function roomResponse(sr: number, seconds = 2.4, seed = 7): [Float32Array, Float32Array] {
  const len = Math.floor(sr * seconds);
  const out: [Float32Array, Float32Array] = [new Float32Array(len), new Float32Array(len)];
  const early: [ms: number, gl: number, gr: number][] = [
    [13, 0.42, 0.18], [19, 0.16, 0.38], [27, 0.3, 0.12], [34, 0.1, 0.27], [43, 0.2, 0.16], [52, 0.12, 0.2], [61, 0.14, 0.09],
  ];
  for (const [ms, gl, gr] of early) {
    const i = Math.floor((ms / 1000) * sr);
    out[0][i] += gl; out[1][i + Math.floor(sr * 0.0007)] += gr;
  }
  const pre = Math.floor(sr * 0.022), rt = 2.1;
  for (let ch = 0; ch < 2; ch++) {
    const r = rng(seed + ch * 101);
    let lp = 0;
    for (let i = pre; i < len; i++) {
      const t = (i - pre) / sr;
      const env = Math.exp((-6.9 * t) / rt) * Math.min(1, t / 0.03);
      const dark = Math.min(0.94, 0.2 + t * 0.45);    // the tail grows darker as it dies
      lp = (1 - dark) * r() + dark * lp;
      out[ch][i] += 0.34 * env * lp * (1 + dark);
    }
  }
  const fade = Math.floor(sr * 0.2);
  for (let ch = 0; ch < 2; ch++) for (let i = 0; i < fade; i++) out[ch][len - 1 - i] *= i / fade;
  // each channel carries the energy of a single click, so the hall's loudness is set only by how much of it is mixed in
  for (const ch of out) { let e = 0; for (const v of ch) e += v * v; const k = 1 / Math.sqrt(e || 1); for (let i = 0; i < len; i++) ch[i] *= k; }
  return out;
}
