"use client";
/**
 * The reader's cover (design A, Gold and lamplight; the owner's choice of 2026-10-18): each book opens on a still,
 * lamplit cover, its author, its Greek title large, its English title under it, in a shaft of warm light from above,
 * with "Scroll to begin reading" at its foot. Nothing drifts or moves on it; as you scroll into the text the cover's
 * light fades away (one style value, set only while the cover is on screen). On paper, the light is a soft shadow.
 */
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Reader.module.css";

export default function ReaderCover({ author, title, greek, children }: { author?: string; title: string; greek?: string | null; children?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let raf = 0, last = -1;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0) return;
      const v = Math.round(Math.max(0, Math.min(1, r.bottom / Math.max(1, r.height))) * 50) / 50;
      if (v !== last) { last = v; el.style.setProperty("--atm", String(v)); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on, { passive: true });
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={box} className={styles.rcover}>
      <div className={styles.rcoverIn}>
        {author && <p className={`label ${styles.rcoverBy}`}>{author}</p>}
        <h1 className={styles.rcoverT}>
          {greek && greek !== title ? <><span lang="grc">{greek}</span><span className={styles.rcoverEn}>{title}</span></> : title}
        </h1>
        {children}
      </div>
      <span className={`label ${styles.rcoverBegin}`} aria-hidden="true">Scroll to begin reading</span>
    </div>
  );
}
