"use client";
/**
 * The library's stage (design A): one canvas pinned behind the page. Before you scroll, the letters of Plato's Apology
 * wander slowly in the dark; as you scroll down to the catalogue they gather into the face of Socrates, and a light reads
 * the speech slowly across his face; scroll on, and they become a papyrus roll, which stays behind the catalogue. Press
 * and hold on his face to read it through a glass (lib/a/lamplight.js, SocScene). The wheel glides slowly as on the home
 * page, and the page stops where you stop.
 */
import { useEffect, useRef } from "react";
import { addStage, glide } from "@/lib/a/lamplight";
import s from "./a.module.css";

export default function LibStage() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    // how far the page scrolls while he gathers and becomes the roll: down to the catalogue's heading, a fifth of the way
    // down the window. Measured at most twice a second, so the drawing never waits on the page's layout.
    let at = -1e9, cached = innerHeight * 2;
    const span = () => {
      const now = performance.now();
      if (now - at > 500) {
        at = now;
        const list = document.getElementById("library-list");
        cached = list ? Math.max(innerHeight, list.getBoundingClientRect().top + scrollY - innerHeight * 0.2) : innerHeight * 2;
      }
      return cached;
    };
    const off = addStage(cv, { src: "/images/a/soc.jpg", span });
    glide(true);
    return () => { off(); glide(false); };
  }, []);
  return <div className={s.stage} aria-hidden="true"><canvas ref={ref} /></div>;
}
