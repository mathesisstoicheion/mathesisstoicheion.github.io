"use client";
/** The Academy's lessons in order, each with its standing (passed, a refresh due, or read), and a checkpoint after each stretch. */
import Link from "next/link";
import { Fragment } from "react";
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
import { CHECKPOINTS, CHECKPOINT_GREEK, checkpointKey } from "@/data/checkpoints";
import { useAcademy } from "@/lib/academy";
import { refreshDue } from "@/lib/mastery";
import styles from "./Academy.module.css";
import w from "./Workout.module.css";

export default function LessonPath() {
  const mastery = useAcademy((s) => s.mastery);
  const completed = useAcademy((s) => s.completed);
  return (
    <ol className={styles.path}>
      {LESSONS.map((l, i) => {
        const m = mastery[l.id];
        const due = refreshDue(m);
        const cp = CHECKPOINTS.find((c) => c.lessons.at(-1) === l.id);
        return (
          <Fragment key={l.id}>
          <li>
            <Link href={`/academy/lesson/${l.id}`} transitionTypes={["page-turn"]} className={styles.pathItem}>
              <span className={styles.pathNo}>{i + 1}</span>
              <span>
                <b>{l.title}</b> <span lang="grc" className={styles.pathGr}>{l.greek}</span>
                <span className={styles.pathAbout}>{l.summary}</span>
              </span>
              <span className={styles.pathMin}>
                {m?.passed
                  ? <span className={`${w.mark} ${w.markPassed} ${due ? w.markDue : ""}`} title={due ? "Passed; a refresh is due" : "Passed"}>{due ? "↻" : "✓"}<span className="visually-hidden">{due ? "Passed; a refresh is due" : "Passed"}</span></span>
                  : completed[l.id] ? <span className={w.mark} title="Read; test not yet passed">read<span className="visually-hidden">: test not yet passed</span></span>
                  : `${l.minutes} min`}
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
    <li className={w.cpRow}>
      <Link href={`/academy/checkpoint/${c.id}`} transitionTypes={["page-turn"]} className={`${styles.pathItem} ${w.cpItem}`}>
        <span className={w.cpNo} aria-hidden="true">{c.numeral}</span>
        <span>
          <b>Checkpoint {c.numeral}</b> <span lang="grc" className={styles.pathGr}>{CHECKPOINT_GREEK}</span>
          <span className={styles.pathAbout}>{c.title}: lessons {first} to {last} tested together.{!m?.passed && ready ? " You are ready for it." : ""}</span>
        </span>
        <span className={styles.pathMin}>
          {m?.passed
            ? <span className={`${w.mark} ${w.markPassed} ${due ? w.markDue : ""}`} title={due ? "Passed; a refresh is due" : "Passed"}>{due ? "↻" : "✓"}<span className="visually-hidden">{due ? "Passed; a refresh is due" : "Passed"}</span></span>
            : "15 questions"}
        </span>
      </Link>
    </li>
  );
}
