"use client";
/**
 * Words that glide to their new places (a FLIP animation): call `capture()` just before the change, and after
 * it each element marked `data-k` moves from where it was to where it now is; a newcomer comes in with `enter`.
 * With reduced motion nothing is captured, so the words simply appear in their new places. Used by the Academy's
 * Shift and Report drawings.
 */
import { useLayoutEffect, useRef } from "react";
import { prefersReducedMotion, useSettings } from "@/lib/settings";

export function useFlip<T extends HTMLElement>(change: unknown, enter: Keyframe, ms: number) {
  const motion = useSettings((s) => s.motion);
  const box = useRef<T>(null);
  const before = useRef<Map<string, DOMRect> | null>(null);
  const capture = () => {
    const el = box.current;
    if (el && !prefersReducedMotion(motion)) {
      before.current = new Map([...el.querySelectorAll<HTMLElement>("[data-k]")].map((s) => [s.dataset.k!, s.getBoundingClientRect()]));
    }
  };
  useLayoutEffect(() => {
    const el = box.current, old = before.current;
    before.current = null;
    if (!el || !old) return;
    for (const s of el.querySelectorAll<HTMLElement>("[data-k]")) {
      const r0 = old.get(s.dataset.k!);
      const r1 = s.getBoundingClientRect();
      const anim = r0
        ? [{ transform: `translate(${r0.left - r1.left}px, ${r0.top - r1.top}px)` }, { transform: "none" }]
        : [{ opacity: 0, ...enter }, { opacity: 1, transform: "none" }];
      s.animate(anim, { duration: ms, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change]);
  return { box, capture };
}
