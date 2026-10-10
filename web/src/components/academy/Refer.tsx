"use client";
/**
 * Who is "he"? What is "which"? In a real sentence, each pronoun (in red) is joined by an arc to the word it
 * stands for (underlined), the arc drawing itself from the pronoun back to that word when the sentences scroll
 * into view; "Again" replays. The arcs are measured from where the words fall, so they follow the text when it
 * wraps on a phone. With reduced motion they are simply drawn. The Greek is checked against the source file
 * like the lessons' other real passages.
 */
import { useId, useLayoutEffect, useRef, useState } from "react";
import type { Section } from "@/data/lessons";
import { usePlay } from "@/lib/use-play";
import styles from "./Academy.module.css";

type Props = Extract<Section, { kind: "refer" }>;
type Item = Props["items"][number];

/** a word without the punctuation that follows or precedes it */
export const bare = (w: string) => w.replace(/^[«“(\[]+|[.,·;:»”)\]]+$/g, "");

function Sentence({ it }: { it: Item }) {
  const box = useRef<HTMLParagraphElement>(null);
  const head = `rf-head${useId().replace(/[^\w-]/g, "")}`;
  const [arcs, setArcs] = useState<{ d: string; key: string }[]>([]);
  const words = it.grc.split(/\s+/);
  const at = (w: string) => words.findIndex((x) => bare(x) === w);
  const pron = new Set(it.links.map((l) => at(l.from))), target = new Set(it.links.map((l) => at(l.to)));

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const r0 = el.getBoundingClientRect();
      const place = (i: number) => {
        const r = el.querySelector<HTMLElement>(`[data-i="${i}"]`)!.getBoundingClientRect();
        return { x: r.left - r0.left + r.width / 2, top: r.top - r0.top + 4, bottom: r.bottom - r0.top + 2, h: r.height };
      };
      setArcs(it.links.map((l) => {
        const a = place(at(l.from)), b = place(at(l.to)), key = `${l.from}>${l.to}`;
        if (Math.abs(a.top - b.top) > a.h / 2) {
          // on different lines (a phone, a long sentence): through the space between the lines, so the arc
          // crosses no words, from the top of the pronoun to the foot of the word it stands for
          const [lo, hi] = a.top > b.top ? [a, b] : [b, a], mid = (lo.top + hi.bottom) / 2;
          const from = a === lo ? { x: a.x, y: a.top } : { x: a.x, y: a.bottom }, to = b === lo ? { x: b.x, y: b.top } : { x: b.x, y: b.bottom };
          return { key, d: `M${from.x} ${from.y}C${from.x} ${mid} ${to.x} ${mid} ${to.x} ${to.y}` };
        }
        const lift = Math.min(54, 16 + Math.abs(a.x - b.x) * 0.22);
        const cy = Math.min(a.top, b.top) - lift;
        return { key, d: `M${a.x} ${a.top}C${a.x} ${cy} ${b.x} ${cy} ${b.x} ${b.top}` };
      }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [it]);

  return (
    <p ref={box} className={styles.rfGr} lang="grc">
      <svg className={styles.rfSvg} aria-hidden="true">
        <defs>
          <marker id={head} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" className={styles.rfHead} />
          </marker>
        </defs>
        {arcs.map((a, i) => <path key={a.key} d={a.d} pathLength={1} className={styles.rfArc} markerEnd={`url(#${head})`} style={{ animationDelay: `${0.3 + i * 0.6}s` }} />)}
      </svg>
      {words.map((w, i) => (
        <span key={i}>
          <span data-i={i} className={pron.has(i) ? styles.rfPron : target.has(i) ? styles.rfTarget : undefined}>{w}</span>{" "}
        </span>
      ))}
    </p>
  );
}

export default function Refer({ title, items }: Props) {
  const { ref, run, again } = usePlay<HTMLElement>(0.3);   // 0 = not yet in view; each "Again" plays once more

  return (
    <figure ref={ref} className={styles.refer} data-go={run > 0 ? "" : undefined}>
      <span className="label">{title}</span>
      <div key={run} className={styles.tlList}>
        {items.map((it) => (
          <div key={it.label + it.grc} className={styles.tlItem}>
            <Sentence it={it} />
            <p className={styles.vEn}>“{it.en}”</p>
            <p className={styles.small}>{it.note} <span className={styles.tlSrc}>{it.label}</span></p>
          </div>
        ))}
      </div>
      <figcaption className={styles.motCap}>
        <span>In red, the pronoun; underlined, the word it stands for.</span>
        <button type="button" className="chip" onClick={again}>Again</button>
      </figcaption>
    </figure>
  );
}
