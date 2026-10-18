"use client";
/**
 * Schedules torchlit art. Each piece is laid out when it first comes near the screen (and again after a resize), cut in
 * when it comes into view, and redrawn only while it is on screen and only when a light has moved relative to it, so
 * a page full of carvings costs nothing while the torch is still. Each piece also brightens a little as it nears the
 * middle of the screen (eased, so it lags behind the scroll); nothing pulls the page towards it.
 */
import { useEffect, type RefObject } from "react";
import { onFrame, torchStill } from "@/lib/torch";
import { PHONE } from "./common";
import { clamp, smooth, type Art, type LocalLight } from "./common";
import { clearSprites } from "./carve";

export interface PartOptions {
  /** seconds to wait after it comes into view before it is cut in */
  delay?: number;
  /** how strongly the torch lights it */
  gain?: number;
  /** where its one still light stands when motion is reduced, or on the Daylight page (in its own pixels) */
  still?: (w: number, h: number) => { x: number; y: number };
  /** true when it is lit by daylight (one still, even light) */
  day?: () => boolean;
  /** false: it does not brighten as it nears the middle of the screen */
  place?: boolean;
  /** true while it keeps to its one still light, as on the Daylight page (it is not redrawn as the page scrolls) */
  steady?: () => boolean;
}

interface Part { art: Art; el: HTMLElement; o: PartOptions; vis: boolean; ok: boolean; tried: boolean; last: LocalLight[] | null; revealing: boolean; dirty: boolean; sp: number; drew: boolean }

// the one still light, and the phone's torch standing mid-screen, a little brighter than the mouse's torch (the owner,
// 2026-10-18: "make it brighter")
const STILL_I = 1.35, PHONE_GAIN = 1.3;

const parts = new Set<Part>();
let io: IntersectionObserver | null = null;
let stopFrame: (() => void) | null = null;
let resizeTimer = 0;

function tick(now: number, dt: number, ls: readonly { x: number; y: number; I: number }[]) {
  const H = innerHeight, still = torchStill(), touch = PHONE();
  for (const p of parts) {
    const a = p.art;
    if (p.drew) { a.pace?.(dt); p.drew = false; }
    // every piece is measured at once, in view or not, so the page does not jump when one comes into view (a hidden
    // one is tried again only once it is in view)
    if (!p.ok && (p.vis || !p.tried)) { p.tried = true; p.ok = a.layout() !== false; p.dirty = true; }
    if (!p.vis || !p.ok) continue;
    const r = p.el.getBoundingClientRect();
    // near the screen but not on it (the observer looks a little beyond): nothing to see, so nothing to draw yet
    if (r.bottom <= 0 || r.top >= H) continue;
    let local: LocalLight[];
    if (still || p.o.day?.() || p.o.steady?.()) { const s = p.o.still ? p.o.still(r.width, r.height) : { x: r.width * 0.15, y: -r.height * 0.35 }; local = [{ x: s.x, y: s.y, I: STILL_I }]; }
    else {
      // brighter near the middle of the screen (a piece taller than the screen: near its top)
      let raw = 1;
      if (p.o.place !== false) { const off = r.height <= H * 0.84 ? r.top + r.height / 2 - H / 2 : r.top - H * 0.08; raw = 1 - smooth(clamp(Math.abs(off) / (H * 0.6), 0, 1)); }
      p.sp = p.sp < 0 ? raw : p.sp + (raw - p.sp) * (1 - Math.exp(-dt * 3.2));
      if (Math.abs(raw - p.sp) < 0.002) p.sp = raw;
      const g = (p.o.gain ?? 1) * (0.6 + 0.4 * p.sp) * (touch ? PHONE_GAIN : 1);
      local = ls.map((l) => ({ x: l.x - r.left, y: l.y - r.top, I: l.I * g }));
    }
    // cut in when it comes into view
    if (a.t0 === null && r.top < innerHeight * 0.86 && r.bottom > innerHeight * 0.06) a.t0 = now + (p.o.delay ?? 0);
    let changed = p.dirty || p.revealing || !p.last || p.last.length !== local.length;
    if (!changed) for (let i = 0; i < local.length; i++) {
      const u = local[i], v = p.last![i];
      if (Math.abs(u.x - v.x) > 0.3 || Math.abs(u.y - v.y) > 0.3 || Math.abs(u.I - v.I) > 0.006) { changed = true; break; }
    }
    if (changed) { p.revealing = a.draw(now, local); p.last = local; p.dirty = false; p.drew = true; }
  }
}

function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => { for (const p of parts) p.ok = false; }, 140);
}

function add(p: Part) {
  if (!io) {
    io = new IntersectionObserver((es) => { for (const e of es) for (const q of parts) if (q.el === e.target) q.vis = e.isIntersecting; }, { rootMargin: "160px 0px" });
    stopFrame = onFrame(tick);
    addEventListener("resize", onResize);
  }
  parts.add(p); io.observe(p.el);
}
function remove(p: Part) {
  parts.delete(p); io?.unobserve(p.el); p.art.dispose?.();
  if (!parts.size) { io?.disconnect(); io = null; stopFrame?.(); stopFrame = null; removeEventListener("resize", onResize); }
}

/** Draws the art on this canvas again on the next frame (something about it changed, such as a lamp set before it). */
export function redrawArt(cv: HTMLElement) { for (const p of parts) if (p.el === cv) p.dirty = true; }

/** Lays every piece out again now (after fonts load), or only the one on this canvas (when the page around it changes). */
export function relayoutArt(cv?: HTMLElement) { for (const p of parts) if (!cv || p.el === cv) p.ok = false; }

/**
 * Lights a canvas with the torch. `make` builds the art for the canvas (it may wait for a picture or a font); it is
 * rebuilt when `key` changes.
 */
export function useTorchlit(ref: RefObject<HTMLCanvasElement | null>, make: (cv: HTMLCanvasElement) => Promise<Art | null> | Art | null, o: PartOptions = {}, key = "") {
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let p: Part | null = null, gone = false;
    Promise.resolve(make(cv)).then((art) => {
      if (gone || !art) return;
      p = { art, el: cv, o, vis: false, ok: false, tried: false, last: null, revealing: false, dirty: true, sp: -1, drew: false };
      add(p);
    });
    return () => { gone = true; if (p) remove(p); };
    // the art is rebuilt only when its key changes (make and o are fresh functions on every render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, key]);
}

/**
 * Waits (at most 2.5 s) for the face letters are carved in, so the first carving is cut in the right letters. If the
 * face arrives later than that, every carving is cut again in it.
 */
let carvingFont: Promise<void> | null = null;
export function carvingFontReady() {
  if (!carvingFont) {
    const fam = getComputedStyle(document.documentElement).getPropertyValue("--f-carved").trim() || '"Noto Serif Display"';
    let waited = false;
    const load = document.fonts ? document.fonts.load(`500 40px ${fam}`, "ΑΒΓΔΜΣΩ").then(() => { if (waited) { clearSprites(); relayoutArt(); } }) : Promise.resolve();
    carvingFont = Promise.race([load, new Promise<void>((r) => setTimeout(() => { waited = true; r(); }, 2500))]).catch(() => undefined);
  }
  return carvingFont;
}
