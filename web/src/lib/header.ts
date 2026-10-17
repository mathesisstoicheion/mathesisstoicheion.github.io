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
export function scrollBelowHeader(el: HTMLElement, gap: number, smooth = false) {
  const h = headerHeight();
  const hidden = scrollY + el.getBoundingClientRect().top - gap;   // the place if the header is tucked away
  const dy = hidden - scrollY;
  // Header.tsx keeps it showing while it has the focus, or while held (holdBars)
  const pinned = !!document.querySelector("header:focus-within") || barsHeld();
  const tucked = !pinned && hidden > h && (dy > 6 || (dy >= -6 && headerVisible() === 0));
  scrollTo({ top: Math.max(0, tucked ? hidden : hidden - h), behavior: smooth ? "smooth" : "auto" });
}
