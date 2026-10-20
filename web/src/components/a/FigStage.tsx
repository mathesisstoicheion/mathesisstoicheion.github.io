"use client";
/**
 * A figure's stage (data/figures.ts): one canvas behind the page. As the page opens, the letters of the area's Greek text
 * wander slowly in the dark and gather into its face, in the opening the page marks for it (data-face-anchor). Scroll on,
 * and they become the area's object, grown large behind the whole page, where it stays until you scroll back to the top;
 * then the letters fly back into the face (the owner, 2026-10-20). Press and hold on the face to read it through a glass
 * (lib/a/lamplight.js, FigScene). Every line of the page's words has a soft dark veil behind it, so no letter of the figure
 * is ever seen through a word.
 *
 * A door's stage is pinned behind its blocks, and its wheel glides slowly, as in the library (the library keeps its own,
 * LibStage.tsx); on the pages inside an area (`area`) it is fixed behind the whole page (AreaStage.tsx), and the page
 * scrolls as the browser does.
 */
import { useEffect, useRef } from "react";
import { addStage, glide } from "@/lib/a/lamplight";
import { FIGURES, type FigureId } from "@/data/figures";
import s from "./a.module.css";

export default function FigStage({ fig, area = false }: { fig: FigureId; area?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const f = FIGURES[fig];
    // behind a page's own words (an area's inner pages, which have no dark blocks) the object is dimmer and a little smaller
    const off = addStage(cv, { src: f.face, text: f.text, target: f.target, img2: f.img2, veil: true, ...(area ? { dim: 0.4, smax: 2.4 } : {}) });
    if (!area) glide(true);
    return () => { off(); if (!area) glide(false); };
  }, [fig, area]);
  return <div className={area ? s["area-stage"] : s.stage} aria-hidden="true"><canvas ref={ref} /></div>;
}
