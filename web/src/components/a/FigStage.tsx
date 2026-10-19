"use client";
/**
 * A door's stage: the library's, with the area's own figure (data/figures.ts; the library keeps its own, LibStage.tsx).
 * One canvas pinned behind the page: the letters of the area's Greek text wander slowly in the dark, gather into its face
 * as the door opens, and become its object once the page's first part is scrolled past; neither goes back when you scroll
 * up. Press and hold on the face to read it through a glass (lib/a/lamplight.js, FigScene). The wheel glides slowly, as in
 * the library, and the page stops where you stop.
 */
import { useEffect, useRef } from "react";
import { addStage, glide } from "@/lib/a/lamplight";
import { FIGURES, type FigureId } from "@/data/figures";
import s from "./a.module.css";

export default function FigStage({ fig }: { fig: FigureId }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const f = FIGURES[fig];
    // how far the page scrolls while the face gathers and becomes the object: down to the place the door marks for it
    // (data-door-turn: the window onto the object on a phone, the page's first part on a computer), a fifth of the way
    // down the window. Measured at most twice a second, so the drawing never waits on the page's layout.
    let at = -1e9, cached = innerHeight * 2;
    const span = () => {
      const now = performance.now();
      if (now - at > 500) {
        at = now;
        const el = [...document.querySelectorAll("[data-door-turn]")].find((e) => e.getBoundingClientRect().height > 0);
        cached = el ? Math.max(innerHeight, el.getBoundingClientRect().top + scrollY - innerHeight * 0.2) : innerHeight * 2;
      }
      return cached;
    };
    const off = addStage(cv, { src: f.face, span, text: f.text, target: f.target, img2: f.img2 });
    glide(true);
    return () => { off(); glide(false); };
  }, [fig]);
  return <div className={s.stage} aria-hidden="true"><canvas ref={ref} /></div>;
}
