/**
 * The art behind the page (the owner's own idea, 2026-10-18; GOLD-AND-LAMPLIGHT-PLAN.md, "Page flow" 3):
 *
 * - Every page but the reader has its own engraving: a real object in gold lines on Pompeian red (pipeline/engrave.py).
 * - It starts in its window beside the page's title (after it, on a phone). As you scroll it grows, smoothly, until it
 *   fills the whole background behind the page; the page's panels are a touch see-through over it, and windows in the
 *   page (components/art/ArtWindow.tsx) look straight through to it.
 * - It turns very slowly: clockwise after you scroll down, and after you scroll up it eases round to turn the other way
 *   ("slow and calm", the owner). With "reduce motion" it holds still, and stands behind the page as soon as you scroll.
 * - The lamp lights it: on a computer a pool of light follows the pointer; on a phone it stands still in the middle of the
 *   screen. Clicking (tapping) the art lights it fully; again, and it goes back to the lamp.
 *
 * One stage per document. Every view of the art (the one behind the page, and one inside each window) is drawn by the same
 * transform, set here on each frame for the views on screen only: a transform and a clip, nothing that repaints the page.
 */

export interface ArtMeta { w: number; h: number }

interface View { el: HTMLElement; lines: HTMLElement; lamp: HTMLElement; base: boolean; seen: boolean; io?: IntersectionObserver }

const TURN = 1.5;          // degrees a second: one whole turn in four minutes
const EASE_TURN = 0.35;    // how quickly the turn comes round after the scroll changes direction (per second)

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

class Stage {
  private views = new Set<View>();
  private slots: HTMLElement[] = [];
  private meta: ArtMeta | null = null;
  private raf = 0;
  private ang = 0;
  private vel = TURN;
  private dir = 1;
  private lastY = 0;
  private last = 0;
  private lampX = -9999;
  private lampY = -9999;
  private hover = false;
  private reduce = false;
  private live = false;
  private top = 0;
  private behind = false;
  private size = "";

  /** The engraving's own size (the stage fits it to each box keeping its shape). */
  setMeta(m: ArtMeta | null) {
    this.meta = m;
    this.kick();
  }

  addView(el: HTMLElement, base: boolean) {
    const lines = el.querySelector<HTMLElement>(".eng-lines");
    const lamp = el.querySelector<HTMLElement>(".eng-lamp");
    if (!lines || !lamp) return () => {};
    const v: View = { el, lines, lamp, base, seen: base };
    if (!base) {
      v.io = new IntersectionObserver((es) => { v.seen = es.some((e) => e.isIntersecting); if (v.seen) this.kick(); }, { rootMargin: "20% 0%" });
      v.io.observe(el.parentElement ?? el);
    }
    this.views.add(v);
    this.kick();
    return () => { v.io?.disconnect(); this.views.delete(v); };
  }

  /** The window the art starts in (the page head's). Several may register (a computer's and a phone's): the one shown counts. */
  addSlot(el: HTMLElement) {
    this.slots.push(el);
    this.kick();
    return () => { this.slots = this.slots.filter((s) => s !== el); };
  }

  start() {
    if (this.live || typeof window === "undefined") return;
    this.live = true;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => {
      const m = document.documentElement.getAttribute("data-motion");
      this.reduce = m === "reduce" || (m !== "full" && mq.matches);
    };
    motion();
    mq.addEventListener("change", motion);
    new MutationObserver(motion).observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    this.hover = matchMedia("(hover: hover) and (pointer: fine)").matches;
    this.lastY = scrollY;
    addEventListener("scroll", () => {
      const y = scrollY;
      if (y !== this.lastY) { this.dir = y > this.lastY ? 1 : -1; this.lastY = y; }
      this.kick();
    }, { passive: true });
    const measure = () => { this.top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr-h")) || 0; this.kick(); };
    measure();
    addEventListener("resize", measure);
    if (this.hover) {
      addEventListener("pointermove", (e: PointerEvent) => { this.lampX = e.clientX; this.lampY = e.clientY; this.kick(); }, { passive: true });
      document.documentElement.addEventListener("pointerleave", () => { this.lampX = this.lampY = -9999; this.kick(); });
    }
    document.addEventListener("visibilitychange", () => this.kick());
  }

  private kick() {
    if (!this.raf && typeof requestAnimationFrame !== "undefined") this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  private slot(): DOMRect | null {
    for (const s of this.slots) {
      const r = s.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return r;
    }
    return null;
  }

  private frame(now: number) {
    this.raf = 0;
    if (!this.meta || !this.views.size || document.hidden) return;
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000);
    this.last = now;
    const vw = innerWidth, vh = innerHeight;
    const top = this.top;
    const { w: mw, h: mh } = this.meta;
    // the art behind the page: the whole object, as large as fits below the header with a margin round it
    const fk = Math.min((vw * 0.9) / mw, ((vh - top) * 0.86) / mh);
    const fw = mw * fk, fh = mh * fk, fcx = vw / 2, fcy = top + (vh - top) / 2;
    // the art in its window: the whole object inside the window's box
    const r = this.slot();
    let p = 1, cx = fcx, cy = fcy, s = 1, clip = "none";
    if (r) {
      const grow = Math.max(240, r.height * 1.2);
      const passed = clamp((top + 8 - r.top + r.height * 0.15) / grow, 0, 1);   // how far the page has scrolled past the window's top
      p = this.reduce ? (passed > 0.02 ? 1 : 0) : smooth(passed);
      const k0 = Math.min((r.width * 0.92) / mw, (r.height * 0.92) / mh) / fk;
      const L = (a: number, b: number) => a + (b - a) * p;
      cx = L(r.left + r.width / 2, fcx);
      cy = L(r.top + r.height / 2, fcy);
      s = L(k0, 1);
      const t = L(r.top, 0), l = L(r.left, 0), b = L(vh - r.bottom, 0), rt = L(vw - r.right, 0);
      clip = p >= 1 ? "none" : `inset(${Math.max(0, t)}px ${Math.max(0, rt)}px ${Math.max(0, b)}px ${Math.max(0, l)}px)`;
    }
    if (!this.reduce) {
      this.vel += (this.dir * TURN - this.vel) * Math.min(1, dt * EASE_TURN);
      this.ang = (this.ang + this.vel * dt) % 360;
    }
    const tf = `translate3d(${cx - fw / 2}px, ${cy - fh / 2}px, 0) scale(${s}) rotate(${this.reduce ? 0 : this.ang}deg)`;
    const lx = this.hover ? this.lampX : vw / 2, ly = this.hover ? this.lampY : top + (vh - top) / 2;
    const lt = `translate3d(${lx}px, ${ly}px, 0)`;
    const size = `${fw.toFixed(1)}x${fh.toFixed(1)}`, resized = size !== this.size;
    this.size = size;
    for (const v of this.views) {
      if (!v.seen) continue;
      if (resized || v.lines.style.width === "") { v.lines.style.width = `${fw}px`; v.lines.style.height = `${fh}px`; }
      v.lines.style.transform = tf;
      v.lamp.style.transform = lt;
      if (v.base) v.el.style.clipPath = clip;
    }
    if ((p >= 1) !== this.behind) { this.behind = p >= 1; document.documentElement.toggleAttribute("data-art-behind", this.behind); }
    // keep turning while there is anything to turn; otherwise wait for the next scroll or pointer move
    if (!this.reduce) this.kick();
  }
}

export const stage = new Stage();
