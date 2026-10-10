"use client";
/**
 * For the Academy's drawings: play once when the drawing scrolls into view, and again on request ("Again").
 * Returns the element's ref, the play count (0 until it has been seen; each replay adds one, so a `key` on it
 * restarts the CSS animations) and the replay function. Without IntersectionObserver it plays at once.
 */
import { useEffect, useRef, useState } from "react";

export function usePlay<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setRun(1); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun((n) => n || 1); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, run, again: () => setRun((n) => n + 1) };
}
