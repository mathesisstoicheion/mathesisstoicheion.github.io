"use client";
/**
 * How the future is made, drawn: the stem, a σ and the ending slide together, and where the stem ends in a
 * consonant the two letters fuse (φ + σ = ψ, γ + σ = ξ; θ drops out). The parts close up, the σ glows, and the
 * finished word takes their place with the fused letters in red. Plays when it scrolls into view; "Again"
 * replays. At rest, and with reduced motion, the finished words are shown with their parts written beside them.
 */
import { useEffect, useRef, useState } from "react";
import type { Section } from "@/data/lessons";
import styles from "./Academy.module.css";

type Props = Extract<Section, { kind: "sigma" }>;
type Item = Props["items"][number];

/** the result with its marked part in red */
function Marked({ it }: { it: Item }) {
  const i = it.result.indexOf(it.mark);
  if (i < 0 || !it.mark) return <>{it.result}</>;
  return <>{it.result.slice(0, i)}<b>{it.mark}</b>{it.result.slice(i + it.mark.length)}</>;
}

export default function Sigma({ title, items }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(0);   // 0 = not yet in view; each increase plays once more
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setRun(1); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun((n) => n || 1); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className={styles.sigma} data-go={run > 0 ? "" : undefined}>
      <span className="label">{title}</span>
      <ol key={run} className={styles.sgList}>
        {items.map((it, n) => (
          <li key={it.present} className={styles.sgItem} style={{ "--n": n } as React.CSSProperties}>
            <span className={styles.sgFrom} lang="grc">{it.present}</span>
            <span className={styles.sgArrow} aria-hidden="true">→</span>
            <span className={styles.sgStage} lang="grc">
              <span className={styles.sgParts} aria-hidden="true">
                <span className={styles.sgTile}>{it.parts[0]}</span>
                <span className={`${styles.sgTile} ${styles.sgSig}`}>{it.parts[1]}</span>
                <span className={styles.sgTile}>{it.parts[2]}</span>
              </span>
              <span className={styles.sgResult}><Marked it={it} /></span>
            </span>
            <span className={styles.sgHow}>{it.how}</span>
          </li>
        ))}
      </ol>
      <figcaption className={styles.motCap}>
        <span>Stem, σ, ending: in red, where they meet.</span>
        <button type="button" className="chip" onClick={() => setRun((n) => n + 1)}>Again</button>
      </figcaption>
    </figure>
  );
}
