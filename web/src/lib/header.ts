/**
 * The site header slides away while you scroll down and comes back when you scroll up.
 * Header.tsx keeps --hdr-h on <html> (the header's full height: it is taller on phones, where the menu wraps) and
 * sets data-hdr="hidden" on <html> while it is tucked away; the phone bar (TabBar) tucks away with it.
 * Anything sticky sits below --hdr-vis (how much of the header is showing), and anything fixed along the bottom of
 * the screen above --tabbar-vis and --readbar-vis. On <html> they are the full heights; each rule that uses them sets
 * them to 0 on its own element while the header is tucked away (html[data-hdr="hidden"] .x { --hdr-vis: 0px }).
 * Changing them on <html> instead would restyle every element of the page each time the header slides: a pause of a
 * tenth of a second or more.
 */
const px = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;

/** The header's full height in pixels. */
export const headerHeight = () => px("--hdr-h");

/** How many pixels of the header are showing at the top of the window now. */
export const headerVisible = () => (document.documentElement.dataset.hdr === "hidden" ? 0 : headerHeight());

/** Phones: the full height of what is fixed along the bottom of the screen (the bar, and the reader's bar). */
export const bottomBarsHeight = () => px("--tabbar-h") + px("--readbar-h");

/**
 * Hide the header and the bars along the bottom (a clean page for reading), or bring them back.
 * Header.tsx listens; with no argument it switches between the two.
 */
export const setBars = (hidden?: boolean) => dispatchEvent(new CustomEvent("mathesis:bars", { detail: hidden }));

/**
 * Keep the header and bars showing through the scrolling that follows a control in them (the reader's
 * next page, a chosen chapter): the passage is placed below the header, and the scroll does not tuck
 * them away. Anything the reader does next (scrolling, a tap, a key) ends it, as does time.
 */
let heldUntil = 0;
export const barsHeld = () => performance.now() < heldUntil;
export function holdBars(ms = 3000) {
  heldUntil = performance.now() + ms;
  setBars(false);
  const USER = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
  const release = () => { heldUntil = 0; USER.forEach((e) => removeEventListener(e, release, true)); };
  // after this click has finished: its own pointer events must not end the hold at once
  setTimeout(() => USER.forEach((e) => addEventListener(e, release, { capture: true, passive: true, once: true })), 0);
}

/**
 * Scroll the window so `el` sits `gap` pixels below the top, clear of the header. Scrolling down
 * past the header tucks it away and scrolling up brings it back, so the place to scroll to depends
 * on which way the jump goes: plain scrollIntoView with a fixed scroll-margin would leave a gap
 * (showing the passages before `el`) once the header has slid away.
 */
export function scrollBelowHeader(el: HTMLElement, gap: number, smooth: boolean | "glide" | "glide-quick" = false) {
  const h = headerHeight();
  const hidden = scrollY + el.getBoundingClientRect().top - gap;   // the place if the header is tucked away
  const dy = hidden - scrollY;
  // Header.tsx keeps it showing while it has the focus, or while held (holdBars)
  const pinned = !!document.querySelector("header:focus-within") || barsHeld();
  const tucked = !pinned && hidden > h && (dy > 6 || (dy >= -6 && headerVisible() === 0));
  const top = Math.max(0, tucked ? hidden : hidden - h);
  if (smooth === "glide" || smooth === "glide-quick") glideTo(top, smooth === "glide-quick");
  else { stopGlide(); scrollTo({ top, behavior: smooth ? "smooth" : "auto" }); }
}

/**
 * Glide the page to `top` (the A to Z's letters, AZList.tsx; the owner asked for a smooth A to Z on 2026-10-17). It eases in
 * to its place, slowing as it arrives. A long way off, it first goes straight to the last stretch, a little under half a
 * screen short, and glides only that: easing past a whole stretch of the library would have the browser draw every author
 * on the way, for a blur no one can read, and that is what makes a long smooth scroll stutter. `quick` is for a finger
 * sliding along the letters, so the page keeps up with it. A finger, the wheel or a key lets go of it at once.
 */
let glide = 0;
const LET_GO = ["wheel", "touchstart", "keydown"] as const;
export function stopGlide() {
  if (!glide) return;
  cancelAnimationFrame(glide);
  glide = 0;
  LET_GO.forEach((e) => removeEventListener(e, stopGlide, true));
}
export function glideTo(top: number, quick = false) {
  stopGlide();
  const end = Math.round(Math.max(0, Math.min(top, document.documentElement.scrollHeight - innerHeight)));
  const lead = Math.round(innerHeight * 0.4);
  const from = Math.abs(end - scrollY) > lead ? end - Math.sign(end - scrollY) * lead : scrollY;
  if (Math.abs(end - from) < 1) { scrollTo(0, end); return; }
  if (from !== scrollY) scrollTo(0, from);
  const t0 = performance.now(), dur = quick ? 240 : 460;
  // the browser may shift the scroll itself as long lists are laid out on arrival (scroll anchoring keeps what is on screen
  // still): follow that shift, so the page never steps back or leaps between two frames
  let start = from, stop = end, set = from;
  const step = (now: number) => {
    const drift = scrollY - set;
    if (Math.abs(drift) >= 1) { start += drift; stop += drift; }
    const p = Math.min(1, (now - t0) / dur);
    set = Math.round(start + (stop - start) * (1 - (1 - p) ** 3));
    scrollTo(0, set);
    if (p < 1) glide = requestAnimationFrame(step);
    else stopGlide();
  };
  glide = requestAnimationFrame(step);
  LET_GO.forEach((e) => addEventListener(e, stopGlide, { capture: true, passive: true }));
}
