"use client";
/**
 * "On this page" for an entry, in two forms (an entry holds both; the stylesheet shows the one that fits):
 *  - `Contents`, in the side column on a computer: the entry's sections and three fixed places (Dates, Read it yourself,
 *    Sources), with a thin rule at its left that fills red from top to bottom as the article is read, as the Kerameikos'
 *    ranging pole does (DepthPole.tsx), measured on the article. With reduced motion the rule stays still and only the
 *    section being read is marked.
 *  - `SectionBar`, on a phone and a tablet: once the opening has scrolled away, a slim bar under the top of the screen with
 *    the name of the section being read; pressing it opens the same list.
 */
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import styles from "./Stoa.module.css";

/** `track: false` for a stop that is always on the screen (the side column's own "Read it yourself"), which is never "the one being read" */
export type Stop = { id: string; text: string; track?: false };

/** the id of the stop being read: the last whose top has passed 30% of the screen's height (stops not on the screen are passed over) */
function useCurrent(stops: Stop[], live: React.RefObject<HTMLElement | null>) {
  const [current, setCurrent] = useState(stops[0]?.id);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (live.current?.offsetParent === null) return;   // the one this width does not show
      let at = stops[0]?.id;
      for (const s of stops) {
        if (s.track === false) continue; const el = document.getElementById(s.id); if (el && el.offsetParent !== null && el.getBoundingClientRect().top < innerHeight * 0.3) at = s.id; }
      setCurrent(at);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, [stops, live]);
  return current;
}

export default function Contents({ stops }: { stops: Stop[] }) {
  const root = useRef<HTMLElement>(null);
  const current = useCurrent(stops, root);
  const [still, setStill] = useState(true);
  useEffect(() => {
    const el = root.current;
    const article = el?.closest("[data-entry]")?.querySelector<HTMLElement>("[data-article]");
    if (!el || !article) return;
    if (prefersReducedMotion(useSettings.getState().motion)) { setStill(true); return; }
    setStill(false);
    let frame = 0;
    const update = () => {
      frame = 0;
      if (el.offsetParent === null) return;
      const r = article.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top) / Math.max(1, r.height - innerHeight * 0.3)));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return (
    <nav className={styles.contents} aria-label="On this page" ref={root} data-still={still ? "" : undefined}>
      <p className="label">On this page</p>
      <ol>
        {stops.map((s) => (
          <li key={s.id}><a href={`#${s.id}`} aria-current={current === s.id ? "location" : undefined}>{s.text}</a></li>
        ))}
      </ol>
    </nav>
  );
}

export function SectionBar({ stops }: { stops: Stop[] }) {
  const root = useRef<HTMLDivElement>(null);
  const current = useCurrent(stops, root);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const update = () => { const top = document.querySelector("[data-key=top]"); setShown(!!top && top.getBoundingClientRect().bottom < 0); };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const away = (e: Event) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); root.current?.querySelector("button")?.focus(); } };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", key); };
  }, [open]);
  const shownOpen = shown && open;
  return (
    <div className={styles.sectionBar} ref={root} data-shown={shown ? "" : undefined}>
      <button type="button" className={styles.sectionBarBtn} aria-expanded={shownOpen} aria-controls="section-bar-list" tabIndex={shown ? 0 : -1} onClick={() => setOpen((o) => !o)}>
        <span className={styles.sectionBarRule} aria-hidden="true" />
        <span className={styles.sectionBarName}>{stops.find((s) => s.id === current)?.text}</span>
        <span className={styles.sectionBarTri} aria-hidden="true" />
      </button>
      {shownOpen && (
        <nav className={styles.sectionBarList} id="section-bar-list" aria-label="On this page">
          <ol>
            {stops.map((s) => <li key={s.id}><a href={`#${s.id}`} aria-current={current === s.id ? "location" : undefined} onClick={() => setOpen(false)}>{s.text}</a></li>)}
          </ol>
        </nav>
      )}
    </div>
  );
}
