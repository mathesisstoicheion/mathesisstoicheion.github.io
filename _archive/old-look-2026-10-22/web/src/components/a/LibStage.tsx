"use client";
/**
 * The library's stage (design A): one canvas pinned behind the page. As the library opens, the letters of Plato's Apology
 * wander slowly in the dark and gather into the face of Socrates, in the opening beside the library's name, and a light
 * reads the speech slowly across his face; scroll on, and they become a papyrus roll, grown large behind the catalogue,
 * where it stays until you scroll back to the top (the owner, 2026-10-20). Press and hold on his face to read it through a
 * glass (lib/a/lamplight.js, FigScene). The wheel glides slowly as on the home page, and the page stops where you stop.
 */
import { useEffect, useRef } from "react";
import { addStage, glide } from "@/lib/a/lamplight";
import s from "./a.module.css";

export default function LibStage() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const off = addStage(cv, { src: "/images/a/soc.jpg", veil: true });
    glide(true);
    return () => { off(); glide(false); };
  }, []);
  return <div className={s.stage} aria-hidden="true"><canvas ref={ref} /></div>;
}
