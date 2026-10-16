/**
 * Calm scrolling (DESIGN.md: Motion). On every page but the reader, the mouse wheel moves the page a little slowly
 * (0.8 of the browser's distance per notch) and smoothly, easing towards where the wheel has sent it (a time constant
 * of about 0.11 s, so it keeps up with the hand). There is no snapping: the page stops where the wheel leaves it (the
 * owner: "no snapping. it's annoying", 2026-10-16). A finger, the keyboard and the scroll bar scroll the page as usual.
 *
 * It stands aside whenever the wheel means something else: a pinch-zoom (Ctrl), a sideways scroll, anything that has
 * already handled the wheel (the maps zoom with it), a box on the page that can still scroll that way (a panel, a
 * list, a dialog), or a page that is not scrolling at all. Touching the page, pressing a key or a mouse button lets go
 * at once, and so does anything else that moves the page (a link to a heading, the scroll bar, find-in-page).
 */

const FACTOR = 0.8;
const RATE = 9;   // 1 - e^(-dt * 9): a time constant of about 0.11 s

const S = { target: null as number | null, pos: 0, set: null as number | null };
let raf = 0;
let enabled = () => true;

const maxY = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);

/** True when something between the wheel and the page could scroll itself in this direction. */
function innerScroller(from: EventTarget | null, dy: number) {
  for (let el = from instanceof Element ? from : null; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
    if (el instanceof HTMLElement && el.dataset.nativeScroll !== undefined) return true;
    const oy = getComputedStyle(el).overflowY;
    if ((oy === "auto" || oy === "scroll" || oy === "overlay") && el.scrollHeight > el.clientHeight + 1) {
      if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
    }
    // a fixed layer (a dialog, a sheet, a floating window) owns its wheel even when it cannot scroll
    if (getComputedStyle(el).position === "fixed") return true;
  }
  return false;
}

function tick() {
  raf = 0;
  if (S.target === null) return;
  const y = scrollY;
  // someone else moved the page: let go of it
  if (S.set !== null && Math.abs(y - S.set) > 2) { S.target = null; S.set = null; return; }
  const now = performance.now();
  const dt = Math.min(0.05, (now - lastT) / 1000 || 0.016);
  lastT = now;
  let ny = S.pos + (S.target - S.pos) * (1 - Math.exp(-dt * RATE));
  if (Math.abs(S.target - ny) < 0.5) { ny = S.target; S.target = null; }
  S.pos = ny;
  scrollTo(0, ny);
  S.set = scrollY;
  if (S.target !== null) raf = requestAnimationFrame(tick);
  else S.set = null;
}
let lastT = 0;

function onWheel(e: WheelEvent) {
  if (!enabled() || e.defaultPrevented || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  const d = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight * 0.9 : 1);
  if (!d || maxY() <= 0) return;
  if (innerScroller(e.target, d)) return;
  // the page itself cannot go further this way: leave the wheel to the browser
  const from = S.target ?? scrollY;
  if ((d > 0 && from >= maxY() - 0.5) || (d < 0 && from <= 0.5)) return;
  e.preventDefault();
  if (S.target === null) { S.target = scrollY; S.pos = scrollY; lastT = performance.now(); }
  S.target = Math.min(maxY(), Math.max(0, S.target + d * FACTOR));
  if (!raf) raf = requestAnimationFrame(tick);
}
const letGo = () => { S.target = null; S.set = null; if (raf) { cancelAnimationFrame(raf); raf = 0; } };

/** Starts calm scrolling; `on` says whether it applies now (not in the reader, not with reduced motion). */
export function startCalmScroll(on: () => boolean) {
  enabled = on;
  addEventListener("wheel", onWheel, { passive: false });
  addEventListener("touchstart", letGo, { passive: true });
  addEventListener("pointerdown", letGo, { passive: true });
  addEventListener("keydown", letGo);
  return () => {
    letGo();
    removeEventListener("wheel", onWheel);
    removeEventListener("touchstart", letGo);
    removeEventListener("pointerdown", letGo);
    removeEventListener("keydown", letGo);
  };
}

/** Stops any easing now (a new page starts where the browser puts it). */
export const stopCalmScroll = letGo;
