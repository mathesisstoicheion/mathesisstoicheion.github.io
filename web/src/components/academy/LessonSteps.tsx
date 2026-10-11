"use client";
/** Where a lesson leads: a warm-up on earlier lessons at its top; practise and the test at its end, with the lesson's standing. */
import Link from "next/link";
import { useState } from "react";
import type { Lesson } from "@/data/lessons";
import { useAcademy } from "@/lib/academy";
import { LESSON_INFO } from "@/data/lesson-index";
import { refreshDue } from "@/lib/mastery";
import Workout from "./Workout";
import styles from "./Workout.module.css";

const fmtDate = (t: number) => new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "long" });

export function WarmUp({ lesson }: { lesson: Lesson }) {
  const [open, setOpen] = useState(true);
  const passed = useAcademy((s) => !!s.mastery[lesson.id]?.passed);
  // only once an earlier lesson is done: the questions come from lessons the learner has met
  const earlier = useAcademy((s) => LESSON_INFO.slice(0, LESSON_INFO.findIndex((l) => l.id === lesson.id)).some((l) => s.completed[l.id]));
  if (!open || passed || !earlier) return null;
  return (
    <aside className={styles.warmBox} aria-label="Warm-up">
      <div className={styles.warmHead}>
        <span className="label">Warm-up · three questions from earlier lessons</span>
      </div>
      <Workout lesson={lesson} mode="warmup" onExit={() => setOpen(false)} />
    </aside>
  );
}

export function LessonSteps({ lesson }: { lesson: Lesson }) {
  const m = useAcademy((s) => s.mastery[lesson.id]);
  const read = useAcademy((s) => !!s.completed[lesson.id]);
  const due = refreshDue(m);
  return (
    <section className={styles.steps} aria-label="Make it stick">
      <Link className={`${styles.step} ${m?.passed ? "" : styles.stepMain}`} href={`/academy/lesson/${lesson.id}/practice`} transitionTypes={["page-turn"]}>
        <span className={styles.stepGr} lang="grc">ἄσκησις</span>
        <b>Practise</b>
        <span className="muted">About twelve questions, with earlier lessons mixed in. What you miss comes back until you have it.</span>
      </Link>
      <Link className={`${styles.step} ${due ? styles.stepMain : ""}`} href={`/academy/lesson/${lesson.id}/test`} transitionTypes={["page-turn"]}>
        <span className={styles.stepGr} lang="grc">δοκιμασία</span>
        <b>{due ? "Refresh it now" : m?.passed ? "Take the test again" : "Take the test"}</b>
        <span className="muted">
          {m?.passed
            ? <>Passed on {fmtDate(m.passed)}. {due ? <span className={styles.due}>A refresh is due.</span> : <>Next refresh: {fmtDate(m.due)}.</>}</>
            : <>8 of 10 to pass. Passing adds the lesson&apos;s words to your daily review{read ? "" : " and completes the lesson"}.</>}
        </span>
      </Link>
    </section>
  );
}
