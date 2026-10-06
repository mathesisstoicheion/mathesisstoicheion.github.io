/**
 * Trackpads and mouse wheels both send "wheel" events; what a hand means by them differs:
 * - a trackpad pinch arrives as a wheel event with Ctrl held (in Chrome, Edge and Firefox; Safari also sends
 *   its own gesture events, see onGesture): zoom, smoothly, as far as the fingers spread;
 * - a trackpad's two-finger scroll arrives as small, uneven steps, often sideways too: move what is under it;
 * - a mouse wheel arrives in large even notches (100 or 120 pixels, more with display scaling), or in lines: zoom.
 * A two-finger scroll can include a large step when flicked, so once a stream of events looks like a
 * trackpad's, the rest of that stream is taken as one too.
 */
export type WheelKind = "pinch" | "pan" | "wheel";

export function wheelReader() {
  let lastAt = -Infinity, streamPan = false;
  return (e: WheelEvent): WheelKind => {
    const now = e.timeStamp || performance.now();
    if (now - lastAt > 250) streamPan = false;   // a new gesture
    lastAt = now;
    if (e.ctrlKey) return "pinch";
    if (e.deltaMode !== 0) return "wheel";
    const dy = Math.abs(e.deltaY);
    const looksPan = e.deltaX !== 0 || dy < 40 || !Number.isInteger(dy);
    if (looksPan) streamPan = true;
    return streamPan ? "pan" : "wheel";
  };
}

/** How much a pinch's wheel event zooms (a factor above 1 zooms in). */
export const pinchFactor = (e: WheelEvent) => Math.exp(-e.deltaY * 0.01);
/** How much a mouse wheel's notch zooms. */
export const wheelFactor = (e: WheelEvent) => Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0022));

/**
 * Safari's own pinch and rotate gestures on a trackpad (other browsers never send these). The callback gets
 * the change of scale and of rotation (degrees) since the last call. Returns the function that stops listening.
 */
export function onGesture(el: HTMLElement, fn: (scaleBy: number, rotateBy: number, x: number, y: number) => void): () => void {
  type G = Event & { scale: number; rotation: number; clientX: number; clientY: number };
  let s = 1, r = 0;
  const start = (e: Event) => { e.preventDefault(); s = (e as G).scale; r = (e as G).rotation; };
  const change = (e: Event) => {
    e.preventDefault();
    const g = e as G;
    fn(g.scale / (s || 1), g.rotation - r, g.clientX, g.clientY);
    s = g.scale; r = g.rotation;
  };
  el.addEventListener("gesturestart", start);
  el.addEventListener("gesturechange", change);
  el.addEventListener("gestureend", start);
  return () => { el.removeEventListener("gesturestart", start); el.removeEventListener("gesturechange", change); el.removeEventListener("gestureend", start); };
}
