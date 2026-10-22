"use client";
/**
 * Words that change place ink in at their new places (the printed page: nothing glides). Call `capture()` just before
 * the change; after it, each element marked `data-k` that now stands somewhere else, or is new, fades in where it is,
 * while the words that kept their place stay as they were. With reduced motion nothing is captured, so the words
 * simply appear in their new places. Used by the Academy's Shift and Report drawings.
 */
import { useLayoutEffect, useRef } from "react";
import { prefersReducedMotion, useSettings } from "@/lib/settings";

export function useFlip<T extends HTMLElement>(change: unknown, ms: number) {
  const motion = useSettings((s) => s.motion);
  const box = useRef<T>(null);
  const before = useRef<Map<string, { r: DOMRect; t: string | null }> | null>(null);
  const capture = () => {
    const el = box.current;
    if (el && !prefersReducedMotion(motion)) {
      before.current = new Map([...el.querySelectorAll<HTMLElement>("[data-k]")].map((s) => [s.dataset.k!, { r: s.getBoundingClientRect(), t: s.textContent }]));
    }
  };
  useLayoutEffect(() => {
    const el = box.current, old = before.current;
    before.current = null;
    if (!el || !old) return;
    let n = 0;
    for (const s of el.querySelectorAll<HTMLElement>("[data-k]")) {
      const was = old.get(s.dataset.k!), r1 = s.getBoundingClientRect();
      // a word that kept its place and its form stays as it is
      if (was && Math.abs(was.r.left - r1.left) < 1 && Math.abs(was.r.top - r1.top) < 1 && was.t === s.textContent) continue;
      s.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms, delay: n++ * 60, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", fill: "backwards" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change]);
  return { box, capture };
}
