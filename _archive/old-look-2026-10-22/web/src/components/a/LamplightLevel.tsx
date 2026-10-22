"use client";
/**
 * Tells design A's drawing code (lib/a/lamplight.js) which of the three levels of animation to draw at: Settings
 * (lib/settings.ts, `level`), and the device's own "reduce motion", which design A always honoured.
 */
import { useEffect } from "react";
import { useSettings, prefersReducedMotion } from "@/lib/settings";
import { setLevel } from "@/lib/a/lamplight";

export default function LamplightLevel() {
  useEffect(() => {
    const apply = () => { const s = useSettings.getState(); setLevel(s.level, prefersReducedMotion(s.motion)); };
    apply();
    const unsub = useSettings.subscribe(apply);
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", apply);
    return () => { unsub(); mq.removeEventListener("change", apply); };
  }, []);
  return null;
}
