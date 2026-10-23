"use client";
/**
 * The home page's floating letters (design A): faint Greek letters behind the page at three depths, few and slow; they
 * move at three speeds as you scroll, and step aside from the pointer, catching a little of its light. They float behind
 * the page's head only (review fix list, slice 7: "never under body copy"): the canvas stays pinned to the screen, as the
 * engine draws it, and is cut off where the head ends (`area`, a selector for the head), so none reaches the words below.
 */
import { useEffect, useRef } from "react";
import { addLetters } from "@/lib/a/lamplight";

export default function FlyLetters({ className, area }: { className: string; area?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { const cv = ref.current; if (!cv) return; return addLetters(cv); }, []);
  useEffect(() => {
    const cv = ref.current, head = area ? document.querySelector<HTMLElement>(area) : null;
    if (!cv || !head) return;
    let raf = 0;
    const cut = () => {
      raf = 0;
      const below = Math.max(0, innerHeight - head.getBoundingClientRect().bottom);
      cv.style.clipPath = `inset(0 0 ${Math.round(below)}px 0)`;
      cv.style.visibility = below >= innerHeight ? "hidden" : "";
    };
    const soon = () => { if (!raf) raf = requestAnimationFrame(cut); };
    cut();
    addEventListener("scroll", soon, { passive: true });
    addEventListener("resize", soon);
    const ro = new ResizeObserver(soon);
    ro.observe(head);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", soon); removeEventListener("resize", soon); ro.disconnect(); };
  }, [area]);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
