"use client";
/** The Academy's lessons in order, each with its standing: passed (with its seal), a refresh due, or read. */
import Link from "next/link";
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
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
        return (
          <li key={l.id}>
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
        );
      })}
    </ol>
  );
}
