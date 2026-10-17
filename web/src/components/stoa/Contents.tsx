"use client";
/**
 * "On this page": the entry's sections, with the one being read marked as you scroll. In the side rail on a computer it is
 * a plain list; with `fold` (above the article, on a phone) it is a closed disclosure, so the sections do not push the
 * article down the screen. An entry holds both; the stylesheet shows the one that fits (Stoa.module.css).
 */
import { useEffect, useRef, useState } from "react";
import styles from "./Stoa.module.css";

export default function Contents({ heads, fold = false }: { heads: { id: string; text: string }[]; fold?: boolean }) {
  const [current, setCurrent] = useState(heads[0]?.id);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (root.current?.offsetParent === null) return;   // the one this width does not show
      let at = heads[0]?.id;
      for (const h of heads) { const el = document.getElementById(h.id); if (el && el.getBoundingClientRect().top < innerHeight * 0.3) at = h.id; }
      setCurrent(at);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [heads]);
  const list = (
    <ol>
      {heads.map((h) => (
        <li key={h.id}><a href={`#${h.id}`} aria-current={current === h.id ? "location" : undefined}>{h.text}</a></li>
      ))}
    </ol>
  );
  return fold ? (
    <details className={styles.contentsFold} ref={root as React.RefObject<HTMLDetailsElement>}>
      <summary className="label">On this page</summary>
      <nav className={styles.contents} aria-label="On this page">{list}</nav>
    </details>
  ) : (
    <nav className={styles.contents} aria-label="On this page" ref={root}>
      <p className="label">On this page</p>
      {list}
    </nav>
  );
}
