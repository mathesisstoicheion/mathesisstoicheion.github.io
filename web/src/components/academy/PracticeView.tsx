"use client";
/**
 * A practice lesson, after every three lessons (Noa, 2026-10-18): first a mixed check of the words of those three
 * lessons, then two or three other real lines from the library that use them, each read in the lesson stages with
 * the help of the lessons it follows.
 */
import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { PATH, pathKey, pathLevel, knownBefore, type PathPractice, type PathWord } from "@/data/reading-path";
import { useAcademy } from "@/lib/academy";
import { useSettings, prefersReducedMotion } from "@/lib/settings";
import Rich from "./Rich";
import { MatchCheck, UnitView, sentenceUnits, knownByUnit, AlphabetFold } from "./PathStepView";
import styles from "./Academy.module.css";

export default function PracticeView({ practice }: { practice: PathPractice }) {
  const after = PATH.findIndex((s) => s.id === practice.after);
  const lessons = PATH.slice(after - 2, after + 1);
  const level = pathLevel(after);
  const next = PATH[after + 1];
  // the check: one card for each dictionary form of the three lessons' lines
  const cards = useMemo(() => {
    const ws = lessons.flatMap((s) => s.parts.flatMap((p) => p.words));
    return ws.filter((x, i) => ws.findIndex((y) => y.lemma === x.lemma) === i);
  }, [lessons]);
  const all = useMemo(() => sentenceUnits(practice.lines,
    (si, pi) => `Line ${si + 1} of ${practice.lines.length}: ${practice.lines[si].label}${practice.lines[si].pieces.length > 1 ? `, piece ${pi + 1} of ${practice.lines[si].pieces.length}` : ""}`,
    (si) => practice.lines[si].translator, "l"), [practice]);
  const known = useMemo(() => knownByUnit(all, knownBefore(after + 1)), [all, after]);
  const pool = useMemo(() => [...cards, ...all.flatMap((x) => x.words)].map((x: PathWord) => x.here), [cards, all]);
  const [u, setU] = useState(-1); // -1: the check
  const [atEnd, setAtEnd] = useState(false);
  const complete = useAcademy((s) => s.completeLesson);
  const done = useAcademy((s) => !!s.completed[pathKey(practice.id)]);
  const box = useRef<HTMLElement>(null);
  useEffect(() => { if (u > 0) box.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion(useSettings.getState().motion) ? "auto" : "smooth" }); }, [u]);

  const unit = u >= 0 ? all[u] : null;
  const line = unit ? practice.lines[Number(unit.key.slice(1).split("p")[0])] : null;
  const nextLabel = u === all.length - 1 ? "Finish the practice →" : unit?.end ? "Next line →" : "Next piece →";

  return (
    <article className={styles.lesson}>
      <section style={{ display: "grid", gap: "var(--space-3)" }}>
        <span className="label">Where you are</span>
        <p className={styles.lp}><Rich text={practice.intro} /></p>
        <p className={styles.small}>
          It practises lessons {after - 1} to {after + 1}: {lessons.map((s, i) => <span key={s.id}>{i > 0 && ", "}<Link href={`/academy/reading/${s.id}`} transitionTypes={["page-turn"]}>{s.title}</Link></span>)}.
        </p>
      </section>

      <AlphabetFold />

      <figure ref={box} className={`${styles.real} ${styles.cm}`} style={{ scrollMarginTop: 90 }}>
        <figcaption className={styles.realHead}>
          <span className="label">{unit ? unit.label : "Check yourself: the words of these three lessons"}</span>
          {line && <Link className="chip" href={`/read?w=${line.work}&at=${line.ref}`} transitionTypes={["page-turn"]}>In the reader →</Link>}
        </figcaption>
        {u === -1 ? (
          <MatchCheck cards={cards} pool={pool} onNext={() => setU(0)} nextLabel="On to the lines →" doneText="Now read them in other real lines." />
        ) : atEnd ? (
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <p className={styles.good}>You have finished this practice.</p>
            <p className={styles.lp}>Now read each line where it stands, in the reader, with the sentences around it. Tap any word you forget.</p>
            {practice.lines.map((l) => (
              <Link key={l.ref + l.work} className="btn ghost" style={{ justifySelf: "start" }} href={`/read?w=${l.work}&at=${l.ref}`} transitionTypes={["page-turn"]}>{l.label} in the reader →</Link>
            ))}
          </div>
        ) : (
          <>
            {unit!.key.endsWith("p0") && <p className={styles.lp}><Rich text={line!.who} /></p>}
            <UnitView key={unit!.key} unit={unit!} level={level} known={known[u]} pool={pool} doneLabel={nextLabel}
              onDone={() => { if (u === all.length - 1) { complete(pathKey(practice.id)); setAtEnd(true); } else setU(u + 1); }} />
          </>
        )}
      </figure>

      <footer className={styles.lessonEnd}>
        {done ? <p className={styles.good}>You have done this practice.</p> : <span />}
        {next
          ? <Link className="btn ghost" href={`/academy/reading/${next.id}`} transitionTypes={["page-turn"]}>Next lesson: {next.title} →</Link>
          : <Link className="btn ghost" href="/academy/reading#completed" transitionTypes={["page-turn"]}>See how far you have come →</Link>}
      </footer>
    </article>
  );
}
