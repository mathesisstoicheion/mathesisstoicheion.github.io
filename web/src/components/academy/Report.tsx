"use client";
/**
 * Reported speech, drawn: a plain statement, and at a press it becomes what someone says or thinks. A verb of
 * saying slides in at the front, the subject slips into the accusative and the verb into the infinitive; the
 * words that changed are then in red, and every word glides from where it was (a FLIP animation, as in Shift.tsx).
 * With reduced motion the words simply appear in their new form.
 */
import { Fragment, useState } from "react";
import type { Section } from "@/data/lessons";
import { fold } from "@/lib/catalog";
import { useFlip } from "@/lib/use-flip";
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
  const { box, capture } = useFlip<HTMLSpanElement>(told, { transform: "translateX(-14px)" }, 560);
  // a word in the reported form is keyed by the plain-statement word it came from
  const alias = new Map(it.pairs.map(([from, to]) => [to, fold(from)]));
  const words = told ? keyed(it.b, alias) : keyed(it.a, new Map());
  // in red: the words that changed, once they have
  const changed = new Set(told ? it.pairs.map(([, to]) => to) : []);

  const flip = () => { capture(); setTold(!told); };


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
