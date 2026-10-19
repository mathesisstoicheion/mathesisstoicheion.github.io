"use client";
/**
 * A room's small window on the home page, onto the figure that room's door shows (data/figures.ts): its face drawn in
 * gold letters of its own Greek text on Pompeian red, gathering once as it comes into view (lib/a/lamplight.js, emblem),
 * as the library's famous books draw theirs. So the five rooms show the five figures you meet at their doors.
 */
import { useEffect, useRef } from "react";
import { emblem } from "@/lib/a/lamplight";
import { FIGURES, type FigureId } from "@/data/figures";
import s from "./a.module.css";

export default function RoomFig({ fig }: { fig: FigureId }) {
  const host = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null);
  const f = FIGURES[fig];
  useEffect(() => {
    const el = host.current, c = cv.current;
    if (!el || !c) return;
    let r: { stop(): void } | null = null, gone = false;
    // Socrates is the library's own emblem of him (as the famous books draw it); the others are their figures' faces
    const src = fig === "read" ? "/images/a/em-socrates-louvre.png" : f.face;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      emblem(c, src, { mode: "gather", cols: 30, text: f.text, height: () => el.clientHeight - 16, tokenEl: el })
        .then((x) => { if (gone) x?.stop(); else r = x; });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { gone = true; io.disconnect(); r?.stop(); };
  }, [fig, f]);
  const who = f.who[0].toUpperCase() + f.who.slice(1);
  return (
    <div ref={host} className={`${s.win} ${s.mini} ${s.roomfig}`}>
      <canvas ref={cv} role="img" aria-label={`${who}, drawn in the letters of ${f.from}`} />
    </div>
  );
}
