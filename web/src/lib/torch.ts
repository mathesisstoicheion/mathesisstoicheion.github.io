/**
 * The torch (DESIGN.md: Texture and light). One torch lights the whole site: on a computer it follows the mouse gently
 * (eased, a little behind) and drifts slowly by itself when the mouse leaves the page. On a phone (a touch screen with
 * no mouse) nothing needs touching: the torch stands in the middle of the screen, so carvings and reliefs light up as
 * scrolling brings them to the middle and dim as they scroll away (the owner, 2026-10-16: lighting by touch "is a bit
 * distracting"). Near the top and the foot of a page it stands a little higher or lower, so the first and last things
 * on the page are lit too. It flickers only very slightly. Nothing here blocks scrolling: every listener is passive.
 *
 * One animation loop drives it all. Art that the torch lights (carved letters, re-lit reliefs, the emblem) registers
 * with onFrame() and is handed the lights of each frame, in viewport pixels; it redraws only when they move relative
 * to it. Pages can say where the torch wanders when nobody holds it (setDrift).
 *
 * Each frame first lets every piece measure the page, then makes every change to it (the pools of light, and whatever
 * the pieces hand back), so the page is laid out at most once a frame however many pieces it holds.
 */

export interface Light { x: number; y: number; /** 0 to 1 */ I: number }
/** A frame's work: it may read the page, and it hands back what it changes on the page, run once all have read. */
type FrameFn = (now: number, dt: number, lights: readonly Light[]) => void | (() => void);
/** Where the torch drifts: the centre (as fractions of the window) and how far it wanders either way. */
export type Drift = [ax: number, ay: number, sx: number, sy: number];

const MAX_FINGERS = 5;
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

interface FingerLight { key: string; x: number; y: number; tx: number; ty: number; a: number; on: boolean; g: HTMLElement | null }

const P = { x: 0, y: 0, mouse: false, inside: false };
const PT = new Map<number, { x: number; y: number }>();   // fingers, from Pointer Events
const TT = new Map<number, { x: number; y: number }>();   // fingers, from Touch Events (they keep coming while the page scrolls)
const FL: FingerLight[] = [];
const T = { x: 0, y: 0, a: 1, f: 1, sVel: 0, sy: 0, R: 260, hold: -1, had: 0 };
let LS: Light[] = [];
let drift: Drift | null = null;
let quiet = false;                 // the reader: the torch rests (it fades out), and nothing moves
let quietLevel = 1;                // how much light is left while quiet (the reader's cover fades it out as you scroll)
let reduce = () => false;
let glow: HTMLElement | null = null;
const pool: HTMLElement[] = [];
const subs = new Set<FrameFn>();
let raf = 0, last = 0, started = false;
const writes: (() => void)[] = [];
const glowSets: [HTMLElement, number, number, number][] = [];

/** Art lit by the torch: called every frame with this frame's lights. It reads the page and returns what it changes on
 *  it (see FrameFn). Returns the function that stops it. */
export function onFrame(fn: FrameFn) { subs.add(fn); return () => { subs.delete(fn); }; }
/** This frame's lights, in viewport pixels. */
export const lights = (): readonly Light[] => LS;
/** Where the torch wanders by itself on this page (null: the default, over the middle of the window). */
export function setDrift(d: Drift | null) { drift = d; }
/** The reader: the torch fades, to `level` (0 to 1) of its light; false brings it back. */
export function setQuiet(on: boolean, level = 0) { quiet = on; quietLevel = level; }
/** The torch's radius on the wall, in pixels (art sizes its pool of light by it). */
export const torchRadius = () => T.R;
/** True when animation should be skipped (the site's setting, then the device's). */
export const torchStill = () => reduce();

function driftAnchor(): Drift { return drift ?? [0.56, 0.42, 0.3, 0.16]; }

/** A touch screen with no mouse: the torch stands still in the middle of the screen and fingers carry no light. */
let touchOnly = () => false;
/** Where the torch stands on a touch screen: in the middle, but higher within the first half screen of the page and
 *  lower within the last, so the top and the foot of the page can be lit too. */
function middleSpot(): [number, number] {
  const W = innerWidth, H = innerHeight, half = H / 2, end = H * 0.28;
  const room = Math.max(0, document.documentElement.scrollHeight - H), y = scrollY;
  const top = clamp(1 - y / half, 0, 1), foot = clamp(1 - (room - y) / half, 0, 1);
  return [W / 2, half - (half - end) * top + (half - end) * foot];
}

function setRadius() {
  T.R = clamp(Math.min(innerWidth, innerHeight) * 0.36, 170, 330);
  // on the pools' own box: on <html> it would restyle every element of the page
  (glow?.parentElement ?? document.documentElement).style.setProperty("--glow-d", `${Math.round(T.R * 3.6)}px`);
}

function fingers() {
  const src = TT.size ? TT : PT, pre = src === TT ? "t" : "p", out: { key: string; x: number; y: number }[] = [];
  for (const [k, v] of src) { out.push({ key: pre + k, x: v.x, y: v.y }); if (out.length >= MAX_FINGERS) break; }
  return out;
}
function updateFingers(dt: number) {
  const fs = fingers(), used = new Set<FingerLight>();
  for (const L of FL) L.on = false;
  for (const f of fs) {
    let L = FL.find((l) => l.key === f.key);
    // the same finger may arrive under a new name (pointer first, then touch): it keeps the nearest light that lost its finger
    if (!L) { L = FL.find((l) => !used.has(l) && !fs.some((g) => g.key === l.key) && Math.hypot(l.tx - f.x, l.ty - f.y) < 80); if (L) L.key = f.key; }
    if (!L) { if (FL.length >= MAX_FINGERS + 2) continue; L = { key: f.key, x: f.x, y: f.y, tx: f.x, ty: f.y, a: 0, on: true, g: null }; FL.push(L); }
    used.add(L); L.on = true; L.tx = f.x; L.ty = f.y;
  }
  const k = 1 - Math.exp(-dt * 6);
  for (let i = FL.length - 1; i >= 0; i--) {
    const L = FL[i];
    L.x += (L.tx - L.x) * k; L.y += (L.ty - L.y) * k;
    L.a += ((L.on ? 1 : 0) - L.a) * (1 - Math.exp(-dt * (L.on ? 4 : 1.6)));
    if (!L.on && L.a < 0.01) { if (L.g) { glowSets.push([L.g, 0, 0, 0]); pool.push(L.g); } FL.splice(i, 1); }
  }
  return fs.length;
}

function updateTorch(dt: number, t: number) {
  const W = innerWidth, H = innerHeight;
  if (touchOnly() && !P.mouse) {
    // fingers carry no light; their lights fade if one was showing
    PT.clear(); TT.clear(); updateFingers(dt);
    const [mx, my] = middleSpot(), k = 1 - Math.exp(-dt * 8);
    T.x += (mx - T.x) * k; T.y += (my - T.y) * k;
    T.a += (1 - T.a) * (1 - Math.exp(-dt * 1.1)); T.sy = scrollY; T.sVel = 0; T.had = 0;
    T.f = 1 + 0.016 * Math.sin(t * 1.7 + 1.3 * Math.sin(t * 0.61)) + 0.008 * Math.sin(t * 3.9 + 0.7);
    return;
  }
  const nf = updateFingers(dt);
  let tx: number, ty: number, rate: number;
  if (nf) T.hold = t + 0.9;
  // when the fingers lift, the torch comes back from where the last light was
  if (T.had && !nf) { let best: FingerLight | null = null; for (const L of FL) if (!best || L.a > best.a) best = L; if (best && T.a < 0.2) { T.x = best.x; T.y = best.y; } }
  T.had = nf;
  if (P.mouse && P.inside) { tx = P.x; ty = P.y; rate = 2.4; }
  else {
    const [ax, ay, sx, sy] = driftAnchor();
    tx = W * (ax + sx * Math.sin(t * 0.071 + 0.6) + sx * 0.33 * Math.sin(t * 0.173 + 2.2));
    ty = H * (ay + sy * Math.sin(t * 0.097 + 1.3) + sy * 0.35 * Math.sin(t * 0.23));
    rate = nf || t < T.hold ? 0 : 0.7;
  }
  // carrying the torch down the wall: when you scroll, it dips a little the way you are going, then settles
  const y = scrollY, v = dt > 0 ? (y - T.sy) / dt : 0;
  T.sy = y; T.sVel += (clamp(v, -4000, 4000) - T.sVel) * (1 - Math.exp(-dt * 3));
  if (!(P.mouse && P.inside)) ty += clamp(T.sVel * 0.08, -H * 0.1, H * 0.1);
  const k = 1 - Math.exp(-dt * rate);
  T.x += (tx - T.x) * k; T.y += (ty - T.y) * k;
  // while fingers hold their own lights the drifting torch rests; it returns softly after they lift
  const want = (nf || t < T.hold) && !(P.mouse && P.inside) ? 0 : 1;
  T.a += (want - T.a) * (1 - Math.exp(-dt * (want ? 1.1 : 3)));
  // a very small, slow flicker
  T.f = 1 + 0.016 * Math.sin(t * 1.7 + 1.3 * Math.sin(t * 0.61)) + 0.008 * Math.sin(t * 3.9 + 0.7);
}

function setGlow(g: HTMLElement, o: number, x: number, y: number) {
  const el = g as HTMLElement & { __o?: string; __t?: string };
  // in steps of a hundredth: finer steps change no pixel on the screen (the brightest pool adds a fifth of its colour,
  // so a hundredth of that is less than one step of brightness), yet each one would make the graphics draw the whole
  // screen again: the flicker alone did that sixty times a second
  const os = o.toFixed(2);
  if (el.__o !== os) { el.style.opacity = os; el.__o = os; }
  // and on a grid of two pixels: across a pool six hundred pixels or more wide, a two-pixel step changes no pixel by as
  // much as one step of brightness, and the torch drifting by itself redraws the screen half as often
  if (o > 0) { const ts = `translate3d(${Math.round(x / 2) * 2}px,${Math.round(y / 2) * 2}px,0)`; if (el.__t !== ts) { el.style.transform = ts; el.__t = ts; } }
}

function frame(ms: number) {
  raf = requestAnimationFrame(frame);
  const now = ms / 1000, dt = Math.min(0.05, last ? now - last : 0.016);
  last = now;
  if (document.hidden || !glow) return;
  LS = [];
  if (reduce()) {
    // reduced motion: one still light, drawn once; fingers carry none
    const [ax, ay] = driftAnchor();
    const I = quiet ? quietLevel * 0.7 : 0.7;
    glowSets.push([glow, I, innerWidth * ax, innerHeight * ay]);
    for (const L of FL) if (L.g) glowSets.push([L.g, 0, 0, 0]);
    LS.push({ x: innerWidth * ax, y: innerHeight * ay, I });
  } else {
    updateTorch(dt, now);
    const base = quiet ? quietLevel : 1;
    const I = T.a * T.f * base;
    if (I > 0.01) LS.push({ x: T.x, y: T.y, I });
    glowSets.push([glow, I > 0.01 ? I * 0.92 : 0, T.x, T.y]);
    for (const L of FL) {
      if (!L.g) L.g = pool.pop() ?? null;
      const If = L.a * T.f * base;
      if (If > 0.01) LS.push({ x: L.x, y: L.y, I: If });
      if (L.g) glowSets.push([L.g, If > 0.01 ? If * 0.8 : 0, L.x, L.y]);
    }
  }
  // every piece reads the page first; then the page is changed, all at once
  for (const fn of subs) { const w = fn(now, dt, LS); if (w) writes.push(w); }
  for (const [g, o, x, y] of glowSets) setGlow(g, o, x, y);
  for (const w of writes) w();
  glowSets.length = 0; writes.length = 0;
}

/**
 * Starts the torch with its pools of light (the first is the torch, the rest are for fingers). Returns the function that
 * stops it. `still` says whether animation is turned off.
 */
export function startTorch(glows: HTMLElement[], still: () => boolean) {
  if (started) return () => {};
  started = true;
  reduce = still;
  glow = glows[0];
  pool.length = 0; pool.push(...glows.slice(1));
  setRadius();
  const mq = matchMedia("(hover: none) and (pointer: coarse)");
  touchOnly = () => mq.matches;
  const [ax, ay] = driftAnchor();
  T.x = innerWidth * ax; T.y = innerHeight * ay; T.sy = scrollY;
  if (touchOnly()) [T.x, T.y] = middleSpot();
  const onDown = (e: PointerEvent) => { if (e.pointerType === "mouse") { P.mouse = true; P.inside = true; P.x = e.clientX; P.y = e.clientY; } else PT.set(e.pointerId, { x: e.clientX, y: e.clientY }); };
  const onMove = (e: PointerEvent) => { if (e.pointerType === "mouse") { P.mouse = true; P.inside = true; P.x = e.clientX; P.y = e.clientY; } else if (PT.has(e.pointerId) || e.buttons) PT.set(e.pointerId, { x: e.clientX, y: e.clientY }); };
  const onUp = (e: PointerEvent) => { PT.delete(e.pointerId); };
  const syncTouches = (e: TouchEvent) => { TT.clear(); for (const t of Array.from(e.touches)) TT.set(t.identifier, { x: t.clientX, y: t.clientY }); };
  const onOut = (e: MouseEvent) => { if (!e.relatedTarget) P.inside = false; };
  const onOver = () => { if (P.mouse) P.inside = true; };
  let rz = 0;
  const onResize = () => { clearTimeout(rz); rz = window.setTimeout(setRadius, 140); };
  const opt = { passive: true } as const;
  addEventListener("pointerdown", onDown, opt);
  addEventListener("pointermove", onMove, opt);
  addEventListener("pointerup", onUp, opt);
  addEventListener("pointercancel", onUp, opt);
  const touchNames = ["touchstart", "touchmove", "touchend", "touchcancel"] as const;
  touchNames.forEach((n) => addEventListener(n, syncTouches, opt));
  document.addEventListener("mouseout", onOut);
  document.addEventListener("mouseover", onOver);
  addEventListener("resize", onResize);
  raf = requestAnimationFrame(frame);
  return () => {
    started = false; cancelAnimationFrame(raf); last = 0;
    removeEventListener("pointerdown", onDown); removeEventListener("pointermove", onMove);
    removeEventListener("pointerup", onUp); removeEventListener("pointercancel", onUp);
    touchNames.forEach((n) => removeEventListener(n, syncTouches));
    document.removeEventListener("mouseout", onOut); document.removeEventListener("mouseover", onOver);
    removeEventListener("resize", onResize);
    glow = null; pool.length = 0; FL.length = 0;
  };
}
