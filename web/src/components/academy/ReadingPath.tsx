"use client";
/** The steps of the learn-by-reading path in order (data/reading-path.ts), each marked once read. */
import Link from "next/link";
import { LETTERS_STEP, PATH, partText } from "@/data/reading-path";
import { useAcademy } from "@/lib/academy";
import styles from "./Academy.module.css";
import w from "./Workout.module.css";

export const pathKey = (id: string) => `read:${id}`;

export default function ReadingPath() {
  const completed = useAcademy((s) => s.completed);
  return (
    <ol className={styles.path} start={0}>
      <li>
        <Link href={`/academy/reading/${LETTERS_STEP.id}`} transitionTypes={["page-turn"]} className={styles.pathItem}>
          <span className={styles.pathNo}>0</span>
          <span>
            <b>{LETTERS_STEP.title}</b> <span lang="grc" className={styles.pathGr}>{LETTERS_STEP.names.slice(0, 3).map((n) => n.gr).join(" ")}</span>
            <span className={styles.pathAbout}>{LETTERS_STEP.who}</span>
          </span>
          <span className={styles.pathMin}>
            {completed[pathKey(LETTERS_STEP.id)]
              ? <span className={`${w.mark} ${w.markPassed}`} title="Read">✓<span className="visually-hidden">Read</span></span>
              : `${LETTERS_STEP.names.length} names`}
          </span>
        </Link>
      </li>
      {PATH.map((s, i) => (
        <li key={s.id}>
          <Link href={`/academy/reading/${s.id}`} transitionTypes={["page-turn"]} className={styles.pathItem}>
            <span className={styles.pathNo}>{i + 1}</span>
            <span>
              <b>{s.title}</b> <span lang="grc" className={styles.pathGr}>{s.parts.map(partText).join(" ")}</span>
              <span className={styles.pathAbout}>{s.who}</span>
            </span>
            <span className={styles.pathMin}>
              {completed[pathKey(s.id)]
                ? <span className={`${w.mark} ${w.markPassed}`} title="Read">✓<span className="visually-hidden">Read</span></span>
                : `${s.parts.reduce((n, p) => n + p.words.length, 0)} words`}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
