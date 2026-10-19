"use client";
/**
 * The area's figure at the foot of every page inside it (the owner, 2026-10-19: "each page has its own distinct design, but
 * with an overall, unifying design"): each page keeps its own gilded piece in red at its head, and ends with a window onto
 * its area's figure, as its door shows it on the stage (data/figures.ts). When the window comes into view, the letters of the
 * area's Greek text gather into the face, a light reads across it, and then they become the area's object, which stays
 * (lib/a/lamplight.js, addFigure). Press and hold on it to read it through a glass. The door itself, the home page, the
 * reader and the pages outside the areas have none.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { addFigure } from "@/lib/a/lamplight";
import { AREAS } from "@/config/areas";
import { figureFor, figureCredit } from "@/data/figures";
import s from "./a.module.css";

export default function FootFigure() {
  const path = (usePathname() ?? "/").replace(/\/+$/, "") || "/";
  const found = figureFor(path);
  const f = found && AREAS[found.area].href !== path ? found : null;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !f) return;
    return addFigure(el, { src: f.face, text: f.text, target: f.target, img2: f.img2 });
  }, [f]);
  if (!f) return null;
  const a = AREAS[f.area], who = f.who[0].toUpperCase() + f.who.slice(1);
  return (
    <aside className={`${s.screen} ${s["foot-fig"]}`} aria-label={`${a.name}: ${f.who} and ${f.object}, spelled out of ${f.from}`}>
      <div className={`${s.wrap} ${s["ff-grid"]}`}>
        {/* its label, as a museum's beside the object: the area, what it shows, its sources, and the way back to the door */}
        <div className={s["ff-text"]}>
          <span className={s.mono} style={{ color: "var(--a-accent)" }}>{a.door ?? a.english} · {a.name}</span>
          <p className={s["ff-title"]}>{who} becomes {f.object}</p>
          <p className={s.cap}>{figureCredit(f)}</p>
          <Link className={s["ff-go"]} href={a.href} transitionTypes={["page-turn"]}>Back to {a.name.replace(/^The /, "the ")} <span aria-hidden="true">→</span></Link>
        </div>
        <div ref={ref} className={`${s.win} ${s.figwin}`}>
          <canvas role="img" aria-label={`${who}, spelled out letter by letter from the Greek of ${f.from}, becoming ${f.object}; press and hold to read`} />
          <span className={s.wcap}>Press and hold to read</span>
        </div>
      </div>
    </aside>
  );
}
