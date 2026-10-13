/**
 * The Periplus' engine: the view (zoom and position), the motions that change it (a glide to a view, the
 * wheel's smooth zoom, a flick's drift) and the frame loop that paints the canvas (draw.ts). It lives
 * outside React, so moving the map never waits for the page to re-render; Periplus.tsx feeds it events
 * and what is chosen or filtered.
 */
import { clearSprites, clearWidths, layout, lodFor, paint, readLook, seaMask, zoomPath, type Box, type Label, type Layout, type Look, type Lod, type Pt, type View } from "./draw";
import { loadReliefMeta, Relief } from "./relief";

const KM_PER_UNIT = 1.1132;   // a map unit is a hundredth of a degree of latitude
export const MAX_ZOOM = 14;    // times the opening view
/**
 * Only the famous are named at the opening view (places the library names 400 times or more, about the top
 * fifty); as the map is zoomed in the bar falls, so lesser places earn their names, until at the closest zoom
 * every place can be named. z is how far in from the opening view.
 */
export const nameBar = (z: number) => Math.max(0, 400 * (Math.max(1, z) ** -1.2 - MAX_ZOOM ** -1.2));
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);
const fmt = (n: number) => n.toLocaleString("en-GB");

type Motion =
  | { type: "path"; t0: number; ms: number; at: (t: number) => [number, number, number]; to: View }
  | { type: "wheel"; k: number; ax: number; ay: number; wx: number; wy: number }
  | { type: "fling"; vx: number; vy: number; lv: number; ax: number; ay: number };

export interface Options { kinds: Set<string>; greek: boolean; selected: string | null; saved: Record<string, number>; hover: string | null; reduce: boolean }
interface Els { stage: HTMLElement; canvas: HTMLCanvasElement; ring: HTMLElement; scale: HTMLElement }

/** how fast a drag was going over its last tenth of a second, in px per ms */
export function trailVelocity(trail: { t: number; x: number; y: number }[]) {
  const now = performance.now(), recent = trail.filter((p) => now - p.t < 100);
  if (recent.length < 2) return null;
  const a = recent[0], b = recent[recent.length - 1], dt = b.t - a.t;
  return dt > 0 ? { vx: (b.x - a.x) / dt, vy: (b.y - a.y) / dt } : null;
}

export class MapEngine {
  v: View = { k: 1, tx: 0, ty: 0 };
  home: View | null = null;
  w = 0; h = 0;
  lay: Layout | null = null;
  private dpr = 1;
  private look: Look | null = null;
  private relief: Relief | null = null;
  private onSeaMap: ((x: number, y: number) => boolean) | null = null;
  private motion: Motion | null = null;
  private raf = 0;
  private last = 0;
  private laidFor = "";
  private laidAt = 0;
  private touchedAt = 0;   // the last time a finger or the mouse moved the map directly
  private zoomTrail: { t: number; lk: number }[] = [];   // the zoom over the last moments of a pinch, for its glide
  private dotA = new Map<string, number>();
  private labA = new Map<string, { l: Label; dx: number; dy: number; a: number; on: boolean }>();
  private scaleKm = 0;
  private els: Els | null = null;
  private avoid: Box[] = [];
  opts: Options = { kinds: new Set(), greek: true, selected: null, saved: {}, hover: null, reduce: false };
  /** called once the opening view is known */
  private onHome: () => void = () => {};

  constructor(private W: number, private H: number, private pts: Pt[], private byId: Map<string, Pt>, private lods: Lod[], private opening: [[number, number], [number, number]]) {}

  attach(els: Els, onHome: () => void) {
    this.els = els; this.onHome = onHome; this.restyle();
    // the picture of the land and sea; without it (no connection) the flat map is drawn instead
    if (!this.relief) loadReliefMeta().then((m) => { if (this.els) { this.relief = new Relief(m, () => this.request()); this.request(); } }, () => undefined);
  }
  detach() { cancelAnimationFrame(this.raf); this.raf = 0; this.els = null; this.relief?.dispose(); this.relief = null; }

  setOptions(o: Options) { this.opts = o; this.laidFor = ""; this.request(); }

  /** read the theme's colours and fonts again (on a theme change), then redraw */
  restyle() {
    const els = this.els;
    if (!els) return;
    const look = readLook(els.stage);
    this.look = look;
    clearSprites();
    this.fontsChanged();
    // names are measured and drawn in the site's fonts, once they have arrived
    Promise.all([document.fonts.load(`13px ${look.greek}`, "Ἀθῆναι Ῥώμη"), document.fonts.load(`11px ${look.label}`, "ΘΡΑΚΗ")]).then(() => this.fontsChanged(), () => undefined);
  }
  fontsChanged() { clearWidths(); clearSprites(); this.laidFor = ""; this.request(); }

  /** the frame has a new size (first show, a window resized, a phone turned round) */
  resize(w: number, h: number) {
    const els = this.els;
    if (!els || !w || !h) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    // keep the middle of the map in the middle
    if (this.w) this.v = { ...this.v, tx: this.v.tx + (w - this.w) / 2, ty: this.v.ty + (h - this.h) / 2 };
    this.w = w; this.h = h;
    els.canvas.width = Math.round(w * dpr); els.canvas.height = Math.round(h * dpr);
    els.canvas.style.width = `${w}px`; els.canvas.style.height = `${h}px`;
    if (dpr !== this.dpr) { this.dpr = dpr; this.restyle(); }
    if (!this.home) {
      // open on the Aegean; the whole map is the furthest you can zoom out
      const [[x0, y0], [x1, y1]] = this.opening;
      const k = Math.min(w / (x1 - x0), h / (y1 - y0));
      this.home = this.clamp({ k, tx: w / 2 - ((x0 + x1) / 2) * k, ty: h / 2 - ((y0 + y1) / 2) * k });
      this.v = this.home;
      this.onHome();
    }
    this.v = this.clamp(this.v);
    this.measureAvoid();
    this.laidFor = "";
    this.request();
  }

  /** where the buttons, compass and scale sit over the map, so that no dot or name hides under them */
  measureAvoid() {
    const els = this.els;
    if (!els) return;
    const r0 = els.stage.getBoundingClientRect();
    this.avoid = [...els.stage.querySelectorAll("[data-avoid]")].map((e) => {
      const r = e.getBoundingClientRect();
      return { x0: r.left - r0.left - 4, y0: r.top - r0.top - 4, x1: r.right - r0.left + 4, y1: r.bottom - r0.top + 4 };
    });
  }

  // ---------------------------------------------------------------- limits and motions

  /** the zoom kept between the whole map and MAX_ZOOM times the opening view */
  limitK(k: number) { return Math.max(Math.min(this.w / this.W, this.h / this.H), Math.min(this.home ? this.home.k * MAX_ZOOM : k, k)); }
  clamp(v: View): View {
    const k = this.limitK(v.k), { w, h, W, H } = this;
    // the picture stops at its edges: where the map is wider (or taller) than the frame, it cannot be dragged
    // past them; where it is narrower, it sits in the middle
    const axis = (t: number, frame: number, size: number) => (size * k >= frame ? Math.min(0, Math.max(frame - size * k, t)) : (frame - size * k) / 2);
    return { k, tx: axis(v.tx, w, W), ty: axis(v.ty, h, H) };
  }
  stop() { this.motion = null; }

  /** jump (a drag or pinch follows the finger exactly) */
  set(v: View) { this.v = this.clamp(v); this.motion = null; this.touchedAt = performance.now(); this.request(); }

  /** glide to a view; far away, the map zooms out, travels and zooms back in */
  go(to: View, ms?: number) {
    const target = this.clamp(to);
    if (this.opts.reduce) { this.set(target); return; }
    const c = (v: View): [number, number, number] => [(this.w / 2 - v.tx) / v.k, (this.h / 2 - v.ty) / v.k, this.w / v.k];
    const path = zoomPath(c(this.v), c(target));
    const widest = this.w / Math.min(this.w / this.W, this.h / this.H);
    this.motion = {
      type: "path", t0: performance.now(), ms: ms ?? Math.max(320, Math.min(1500, path.S * 900)), to: target,
      at: (t) => { const [x, y, ww] = path.at(t); return [x, y, Math.min(widest, ww)]; },
    };
    this.request();
  }

  /** zoom by `factor` about a point of the frame, gliding; pressed again mid-glide, it carries on from where the glide was going */
  zoomAt(factor: number, px: number, py: number) {
    const m = this.motion, v = m?.type === "path" ? m.to : this.v, k = this.limitK(v.k * factor);
    this.go({ k, tx: px - ((px - v.tx) * k) / v.k, ty: py - ((py - v.ty) * k) / v.k });
  }

  /** the wheel (or a trackpad's pinch): the zoom glides toward where the wheel has sent it, the point under the pointer staying put */
  wheel(factor: number, ax: number, ay: number) {
    const m = this.motion, k = this.limitK((m?.type === "wheel" ? m.k : this.v.k) * factor), v = this.v;
    if (this.opts.reduce) { this.set({ k, tx: ax - ((ax - v.tx) * k) / v.k, ty: ay - ((ay - v.ty) * k) / v.k }); return; }
    this.motion = { type: "wheel", k, ax, ay, wx: (ax - v.tx) / v.k, wy: (ay - v.ty) / v.k };
    this.request();
  }

  /**
   * A pinch (two fingers on a screen or a trackpad): the map follows the fingers at once, the point under them
   * staying under them; nothing is smoothed, so it never trails behind the hand. When the fingers let go,
   * pinchEnd lets the zoom carry on a little and settle, as it would in a phone's own maps.
   */
  pinch(factor: number, ax: number, ay: number, dx = 0, dy = 0) {
    const v = this.v, k = this.limitK(v.k * factor);
    this.set({ k, tx: ax + dx - ((ax - v.tx) * k) / v.k, ty: ay + dy - ((ay - v.ty) * k) / v.k });
    this.trackZoom();
  }
  /** note the zoom now, so the glide after a pinch knows how fast it was going */
  trackZoom() {
    const t = performance.now();
    this.zoomTrail.push({ t, lk: Math.log(this.v.k) });
    while (this.zoomTrail.length && t - this.zoomTrail[0].t > 120) this.zoomTrail.shift();
  }
  /** how fast the zoom was changing as the fingers let go (log of the zoom per ms) */
  private zoomVelocity() {
    // over the pinch's last tenth of a second; nothing if the fingers had already stopped before letting go
    const trail = this.zoomTrail, end = trail[trail.length - 1];
    this.zoomTrail = [];
    if (!end || performance.now() - end.t > 160) return 0;
    const recent = trail.filter((p) => end.t - p.t < 100);
    if (recent.length < 2) return 0;
    const a = recent[0], b = recent[recent.length - 1];
    return b.t > a.t ? (b.lk - a.lk) / (b.t - a.t) : 0;
  }
  /** the fingers have let go: the zoom (and any movement) glides on about (ax, ay) and slows to a stop */
  pinchEnd(ax: number, ay: number, vel: { vx: number; vy: number } | null = null) { this.fling(vel, this.zoomVelocity(), ax, ay); }

  /** move the map by so many pixels (a trackpad's two-finger scroll, which carries its own glide) */
  panBy(dx: number, dy: number) { const v = this.v; this.set({ k: v.k, tx: v.tx - dx, ty: v.ty - dy }); }

  /** let go while moving: the map drifts on and slows to a stop */
  fling(vel: { vx: number; vy: number } | null, lv = 0, ax = this.w / 2, ay = this.h / 2) {
    const pan = !!vel && Math.hypot(vel.vx, vel.vy) >= 0.25, zoom = Math.abs(lv) >= 0.0008;
    if (this.opts.reduce || (!pan && !zoom)) return;
    const c = (x: number, most: number) => Math.max(-most, Math.min(most, x));
    this.motion = { type: "fling", vx: pan ? c(vel!.vx, 4) : 0, vy: pan ? c(vel!.vy, 4) : 0, lv: zoom ? c(lv, 0.006) : 0, ax, ay };
    this.request();
  }

  /** fly to a place, close enough to see its neighbours */
  flyTo(id: string) {
    const t = this.byId.get(id);
    if (!t || !this.home) return;
    const k = Math.max(this.v.k, this.home.k * (t.name === "region" ? 1.6 : 3.2));
    this.go({ k, tx: this.w * 0.5 - t.x * k, ty: this.h * 0.5 - t.y * k });
  }

  /** the place under a point of the frame: the nearest dot or name, with room for a fingertip */
  hitAt(x: number, y: number, touch: boolean): string | null {
    const lay = this.lay, v = this.v;
    if (!lay) return null;
    let best: string | null = null, bestD = Infinity;
    for (const t of lay.dots) {
      const d = Math.hypot(t.x * v.k + v.tx - x, t.y * v.k + v.ty - y);
      if (d <= Math.max(t.r + (touch ? 6 : 3), touch ? 22 : 0) && d < bestD) { best = t.p.id; bestD = d; }
    }
    if (best) return best;
    for (const l of lay.labels) {
      const x0 = l.align === "left" ? l.x : l.align === "right" ? l.x - l.w : l.x - l.w / 2;
      if (x >= x0 - 4 && x <= x0 + l.w + 4 && y >= l.y - 14 && y <= l.y + 5) return l.key;
    }
    return null;
  }

  // ---------------------------------------------------------------- the frame loop

  request() { if (!this.raf && this.els) this.raf = requestAnimationFrame(this.frame); }

  private frame = (t: number) => {
    this.raf = 0;
    const dt = this.last ? Math.min(64, t - this.last) : 16;
    this.last = t;
    let moving = false;
    const m = this.motion;
    if (m?.type === "path") {
      const u = Math.min(1, (t - m.t0) / m.ms), [cx, cy, ww] = m.at(ease(u)), k = this.w / ww;
      this.v = { k, tx: this.w / 2 - cx * k, ty: this.h / 2 - cy * k };
      if (u < 1) moving = true; else { this.v = m.to; this.motion = null; }
    } else if (m?.type === "wheel") {
      const lk = Math.log(this.v.k), goal = Math.log(m.k), next = lk + (goal - lk) * (1 - Math.exp(-dt / 75)), k = Math.exp(next);
      this.v = this.clamp({ k, tx: m.ax - m.wx * k, ty: m.ay - m.wy * k });
      if (Math.abs(goal - next) > 0.002) moving = true; else this.motion = null;
    } else if (m?.type === "fling") {
      // drift on, and keep zooming about the point the fingers left, both slowing to a stop (the zoom sooner)
      const v = this.v, k = this.limitK(v.k * Math.exp(m.lv * dt));
      this.v = this.clamp({ k, tx: m.ax - ((m.ax - v.tx) * k) / v.k + m.vx * dt, ty: m.ay - ((m.ay - v.ty) * k) / v.k + m.vy * dt });
      const d = Math.exp(-dt / 325);
      m.vx *= d; m.vy *= d; m.lv *= Math.exp(-dt / 160);
      if (k === v.k) m.lv = 0;   // at the furthest or closest zoom: stop zooming
      if (Math.hypot(m.vx, m.vy) > 0.015 || Math.abs(m.lv) > 0.00006) moving = true; else this.motion = null;
    }
    const fading = this.draw(dt);
    if (moving || fading) this.raf = requestAnimationFrame(this.frame);
    else {
      this.last = 0;
      // where the map rests, for the browser tests
      this.els?.stage.setAttribute("data-view", `${this.v.k.toFixed(5)} ${this.v.tx.toFixed(1)} ${this.v.ty.toFixed(1)}`);
    }
  };

  /** lay out (when the view has changed), fade, paint; true while something is still fading */
  private draw(dt: number): boolean {
    const els = this.els, g = els?.canvas.getContext("2d"), op = this.opts, look = this.look;
    if (!els || !g || !look || !this.w) return false;
    const { v, w, h } = this;
    const key = `${v.k.toFixed(6)} ${v.tx.toFixed(2)} ${v.ty.toFixed(2)} ${w} ${h}`;
    // While the map moves, the names and dots move with it and keep their sides; a few times a second those
    // that now crowd one another are let go, but nothing new comes in until the map comes to rest. Then what
    // fits is worked out afresh, and the newcomers fade in.
    const now = performance.now(), busy = !!this.motion || now - this.touchedAt < 150;
    const full = !this.lay || this.laidFor === "" || (key !== this.laidFor && !busy);
    if (full || (key !== this.laidFor && now - this.laidAt > 250)) {
      this.laidAt = now;
      const shown = new Set<string>();
      for (const [id, a] of this.dotA) if (a > 0.5) shown.add(id);
      const prefer = new Map<string, Label["align"]>();
      for (const e of this.labA.values()) if (e.on) prefer.set(e.l.key, e.l.align);
      const only = full ? undefined : new Set([...(this.lay?.dots ?? []).map((t) => t.p.id), ...(this.lay?.labels ?? []).map((l) => l.key)]);
      // whether a name sits on the sea: a lookup in a small grid of the coastline
      this.onSeaMap ??= seaMask(this.lods[Math.min(3, this.lods.length - 1)].sea, this.W, this.H);
      const mask = this.onSeaMap, onSea = (x: number, y: number) => mask((x - v.tx) / v.k, (y - v.ty) / v.k);
      g.setTransform(1, 0, 0, 1, 0, 0);
      this.lay = layout(g, this.pts, v, w, h, { look, greek: op.greek, kinds: op.kinds, selected: op.selected, saved: op.saved, shown, avoid: this.avoid, onSea, prefer, only, nameBar: nameBar(this.home ? v.k / this.home.k : 1) });
      this.laidFor = full ? key : "moving";
      // each name's offset from its place, taken once, where it was laid out: from then on the name is drawn at
      // that offset wherever the place goes, so it stays fixed to it while the map moves. A name that has to
      // move to another side of its place does not jump there: the old one fades out where it was and the new
      // one fades in.
      for (const e of this.labA.values()) e.on = false;
      for (const l of this.lay.labels) {
        const t = this.byId.get(l.key)!, dx = l.x - (t.x * v.k + v.tx), dy = l.y - (t.y * v.k + v.ty);
        const id = `${l.key}|${Math.round(dx)}|${Math.round(dy)}`, was = this.labA.get(id);
        this.labA.set(id, { l, dx: was?.dx ?? dx, dy: was?.dy ?? dy, a: was?.a ?? 0, on: true });
      }
    }
    const step = op.reduce ? 1 : Math.min(1, dt / 200);
    let fading = key !== this.laidFor;   // come back to lay out the view where it rests
    const want = new Set(this.lay!.dots.map((t) => t.p.id));
    for (const id of want) { const a = Math.min(1, (this.dotA.get(id) ?? 0) + step); this.dotA.set(id, a); if (a < 1) fading = true; }
    for (const [id, a] of this.dotA) if (!want.has(id)) { const b = a - step; if (b <= 0) this.dotA.delete(id); else { this.dotA.set(id, b); fading = true; } }
    const labels: { l: Label; a: number; t: Pt }[] = [];
    for (const [id, e] of this.labA) {
      e.a = e.on ? Math.min(1, e.a + step) : e.a - step;
      if (e.a <= 0) { this.labA.delete(id); continue; }
      if (e.a < 1) fading = true;
      const t = this.byId.get(e.l.key)!;
      e.l.x = t.x * v.k + v.tx + e.dx; e.l.y = t.y * v.k + v.ty + e.dy;
      labels.push({ l: e.l, a: e.a, t });
    }
    const dots = [...this.dotA].map(([id, a]) => ({ t: this.byId.get(id)!, a }));
    paint({ g, dpr: this.dpr, w, h, v, look, lod: lodFor(this.lods, v.k), relief: this.relief, moving: busy, dots, labels, selected: op.selected, hover: op.hover, saved: op.saved });

    // the ring round the chosen place, and the scale bar, are plain HTML over the canvas
    const sel = op.selected ? this.byId.get(op.selected) : null;
    els.ring.hidden = !sel;
    if (sel) {
      const r = sel.r + 7;
      els.ring.style.transform = `translate(${sel.x * v.k + v.tx - r}px, ${sel.y * v.k + v.ty - r}px)`;
      els.ring.style.width = els.ring.style.height = `${2 * r}px`;
    }
    const most = (KM_PER_UNIT / v.k) * 90;   // km across 90 px
    const p = 10 ** Math.floor(Math.log10(most)), km = [5, 2, 1].map((x) => x * p).find((x) => x <= most) ?? p;
    if (km !== this.scaleKm) { this.scaleKm = km; els.scale.querySelector("span")!.textContent = `${fmt(km)} km`; }
    (els.scale.firstElementChild as HTMLElement).style.width = `${(km / KM_PER_UNIT) * v.k}px`;
    return fading;
  }
}
