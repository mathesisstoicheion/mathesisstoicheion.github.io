"use client";
/**
 * What opens over a page keeps the page still (review fixes, slice 5; scripts/check-overlays.mjs):
 * - a modal (the menu, the search, the settings) locks the page behind it while it is open: `useScrollLock(open)`;
 * - any panel marked `data-overlay` (the reader's drop-downs, the word panel, and the modals too) keeps the wheel to
 *   itself: turning it over the panel scrolls the panel as far as it goes, and never the page.
 */
import { useEffect } from "react";

let locks = 0;

/** Lock the page's own scrolling until the returned function is called (counted, so two modals can overlap). */
export function lockScroll(): () => void {
  const el = document.documentElement;
  if (locks++ === 0) {
    // keep the scroll bar's room while it is hidden, so the page does not shift sideways
    el.setAttribute("data-scroll-lock", innerWidth > el.clientWidth ? "gutter" : "");
  }
  let undone = false;
  return () => {
    if (undone) return;
    undone = true;
    if (--locks === 0) el.removeAttribute("data-scroll-lock");
  };
}

export function useScrollLock(on: boolean) {
  useEffect(() => (on ? lockScroll() : undefined), [on]);
}

/** true while a modal has the page locked (the slow wheel, lib/a/lamplight.js, then leaves the page alone) */
export const scrollLocked = () => document.documentElement.hasAttribute("data-scroll-lock");

/** can this element itself scroll any further in the wheel's direction? */
function canScroll(el: Element, dy: number) {
  const cs = getComputedStyle(el);
  if (!/(auto|scroll)/.test(cs.overflowY) || el.scrollHeight <= el.clientHeight + 1) return false;
  return dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1;
}

let guarded = false;
/** Installed once (components/Header.tsx): a wheel over an overlay that has nothing left to scroll goes nowhere. */
export function guardOverlayWheel() {
  if (guarded || typeof window === "undefined") return;
  guarded = true;
  addEventListener("wheel", (e: WheelEvent) => {
    const t = e.target instanceof Element ? e.target : null;
    const panel = t?.closest("[data-overlay]");
    if (!panel || e.ctrlKey) return;
    for (let el: Element | null = t; el; el = el === panel ? null : el.parentElement) if (canScroll(el, e.deltaY)) return;
    e.preventDefault();
  }, { capture: true, passive: false });
}
