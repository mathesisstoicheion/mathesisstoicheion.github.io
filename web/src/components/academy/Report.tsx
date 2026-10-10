"use client";
/**
 * Reported speech, drawn: a plain statement, and at a press it becomes what someone says or thinks. A verb of
 * saying slides in at the front, the subject slips into the accusative and the verb into the infinitive; the
 * words that changed are then in red, and every word glides from where it was (a FLIP animation, as in Shift.tsx).
 * With reduced motion the words simply appear in their new form.
 */
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import type { Section } from "@/data/lessons";
import { fold } from "@/lib/catalog";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import styles from "./Academy.module.css";

type Item = Extract<Section, { kind: "report" }>["items"][number];

/** Each word with a key that stays the same when it changes form ("ὁ" and "τὸν" are one word moving). */
function keyed(phrase: string, alias: Map<string, string>) {
  const seen = new Map<string, number>();
  return phrase.split(/\s+/).map((w) => {
    const f = alias.get(w) ?? fold(w);
    const n = seen.get(f) ?? 0;
    seen.set(f, n + 1);
    return { w, key: `${f}#${n}` };
  });
}

function ReportItem({ it }: { it: Item }) {
  const [told, setTold] = useState(false);
  const motion = useSettings((s) => s.motion);
  const box = useRef<HTMLSpanElement>(null);
  const before = useRef<Map<string, DOMRect> | null>(null);
  // a word in the reported form is keyed by the plain-statement word it came from
  const alias = new Map(it.pairs.map(([from, to]) => [to, fold(from)]));
  const words = told ? keyed(it.b, alias) : keyed(it.a, new Map());
  // in red: the words that changed, once they have
  const changed = new Set(told ? it.pairs.map(([, to]) => to) : []);

  const flip = () => {
    const el = box.current;
    if (el && !prefersReducedMotion(motion)) {
      before.current = new Map([...el.querySelectorAll<HTMLElement>("[data-k]")].map((s) => [s.dataset.k!, s.getBoundingClientRect()]));
    }
    setTold(!told);
  };

  useLayoutEffect(() => {
    const el = box.current, old = before.current;
    before.current = null;
    if (!el || !old) return;
    for (const s of el.querySelectorAll<HTMLElement>("[data-k]")) {
      const r0 = old.get(s.dataset.k!);
      const r1 = s.getBoundingClientRect();
      const anim = r0
        ? [{ transform: `translate(${r0.left - r1.left}px, ${r0.top - r1.top}px)` }, { transform: "none" }]
        : [{ opacity: 0, transform: "translateX(-14px)" }, { opacity: 1, transform: "none" }];
      s.animate(anim, { duration: 560, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" });
    }
  }, [told]);

  return (
    <div className={styles.shiftItem}>
      <p className={styles.shiftGr} lang="grc">
        <span ref={box}>
          {words.map((x, i) => <Fragment key={x.key}>{i > 0 && " "}<span data-k={x.key} className={changed.has(x.w) ? styles.shiftAdj : undefined}>{x.w}</span></Fragment>)}
        </span>
      </p>
      <p className={styles.shiftEn} aria-live="polite">
        <span className={styles.shiftTag}>{told ? "reported" : "said"}</span> <span key={String(told)} className={styles.shiftSay}>“{told ? it.bEn : it.aEn}”</span>
      </p>
      {told && <p className={styles.small}>{it.note}</p>}
      <button type="button" className="chip" onClick={flip} aria-pressed={told}>{told ? "Say it plainly" : "Report it"}</button>
    </div>
  );
}

export default function Report({ title, items }: Extract<Section, { kind: "report" }>) {
  return (
    <div className={styles.shift}>
      <span className="label">{title}</span>
      {items.map((it) => <ReportItem key={it.a} it={it} />)}
    </div>
  );
}
