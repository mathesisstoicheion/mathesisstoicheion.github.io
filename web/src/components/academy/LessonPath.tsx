"use client";
/** The Academy's lessons in order, each with its standing (passed, a refresh due, or read), and a checkpoint after each stretch. */
import Link from "next/link";
import { Fragment } from "react";
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
import { CHECKPOINTS, CHECKPOINT_GREEK, checkpointKey } from "@/data/checkpoints";
import { useAcademy } from "@/lib/academy";
import { TRACKS, nextSteps, wordsLabel } from "@/data/tracks";
import { refreshDue } from "@/lib/mastery";
import styles from "./Academy.module.css";
import w from "./Workout.module.css";

/** "Passed; a refresh is due": a turning arrow, drawn (none of the site's three typefaces has the sign "↻") */
const Again = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 8.5A5 5 0 1 1 11.2 4.4 M11.6 1.6v3.1H8.5" />
  </svg>
);

export default function LessonPath() {
  const mastery = useAcademy((s) => s.mastery);
  const completed = useAcademy((s) => s.completed);
  // the course's next lesson, lit as the reading path lights its own, when the Learn page offers it: once the course is
  // begun, or the path is finished (data/tracks.ts nextSteps), so that a beginner meets one next step, not two
  const { main, also } = nextSteps(completed);
  const next = (main?.track === TRACKS.grammar.name ? main.step : also)?.href;
  return (
    <ol className={styles.path}>
      {LESSONS.map((l, i) => {
        const m = mastery[l.id];
        const due = refreshDue(m);
        const cp = CHECKPOINTS.find((c) => c.lessons.at(-1) === l.id);
        const lit = `/academy/lesson/${l.id}` === next;
        return (
          <Fragment key={l.id}>
          <li>
            <Link href={`/academy/lesson/${l.id}`} transitionTypes={["page-turn"]} className={`${styles.pathItem} ${lit ? styles.pathLit : ""}`} aria-current={lit ? "step" : undefined}>
              <span className={styles.pathNo}>{i + 1}</span>
              <span>
                <b>{l.title}</b> <span lang="grc" className={styles.pathGr}>{l.greek}</span>
                <span className={styles.pathAbout}>{l.summary}</span>
              </span>
              <span className={styles.pathMin}>
                {m?.passed
                  ? <span className={`${w.mark} ${w.markPassed} ${due ? w.markDue : ""}`} title={due ? "Passed; a refresh is due" : "Passed"}>{due ? <Again /> : "✓"}<span className="visually-hidden">{due ? "Passed; a refresh is due" : "Passed"}</span></span>
                  : completed[l.id] ? <span className={w.mark} title="Read; test not yet passed">read<span className="visually-hidden">: test not yet passed</span></span>
                  : lit ? <span className={`label ${styles.nextMark}`}>Next</span>
                  : wordsLabel(l.words.length)}
              </span>
            </Link>
          </li>
          {cp && <CheckpointRow id={cp.id} />}
          </Fragment>
        );
      })}
    </ol>
  );
}

function CheckpointRow({ id }: { id: string }) {
  const c = CHECKPOINTS.find((x) => x.id === id)!;
  const m = useAcademy((s) => s.mastery[checkpointKey(id)]);
  const ready = useAcademy((s) => c.lessons.every((l) => s.completed[l]));
  const due = refreshDue(m);
  const first = LESSONS.findIndex((l) => l.id === c.lessons[0]) + 1, last = first + c.lessons.length - 1;
  return (
    <li>
      <Link href={`/academy/checkpoint/${c.id}`} transitionTypes={["page-turn"]} className={styles.pathItem}>
        {/* the same marker as the practice lessons of Learn by reading (review fixes, slice 4), and like them no band:
            the lit band is the next step's alone */}
        <span className={styles.pathNo} aria-hidden="true">◆</span>
        <span>
          <b>Checkpoint {c.numeral}</b> <span lang="grc" className={styles.pathGr}>{CHECKPOINT_GREEK}</span>
          <span className={styles.pathAbout}>{c.title}: lessons {first} to {last} tested together.{!m?.passed && ready ? " You are ready for it." : ""}</span>
        </span>
        <span className={styles.pathMin}>
          {m?.passed
            ? <span className={`${w.mark} ${w.markPassed} ${due ? w.markDue : ""}`} title={due ? "Passed; a refresh is due" : "Passed"}>{due ? <Again /> : "✓"}<span className="visually-hidden">{due ? "Passed; a refresh is due" : "Passed"}</span></span>
            : "Test"}
        </span>
      </Link>
    </li>
  );
}
