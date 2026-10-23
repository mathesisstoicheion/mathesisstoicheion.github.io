"use client";

import Link from "next/link";
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
import { useAcademy, streak } from "@/lib/academy";
import { dueRefreshes, readyCheckpoint } from "@/lib/refreshes";
import styles from "./Academy.module.css";
import { TRACKS, grammarLesson } from "@/data/tracks";

/** Where the learner stands, and what to do next. */
export default function AcademyProgress() {
  const { completed, days, mastery } = useAcademy();
  const refresh = dueRefreshes(mastery)[0];
  const checkpoint = readyCheckpoint(completed, mastery);
  const done = LESSONS.filter((l) => completed[l.id]).length;
  const next = LESSONS.find((l) => !completed[l.id]);
  const s = streak(days);
  // the four numbers are for a visitor who has begun: a first visit would meet four zeros
  const started = done > 0;

  return (
    <section className={`${styles.progress} ${started ? "" : styles.progressNew}`} aria-label="Your progress">
      {started && (
        <div className={styles.stats}>
          <div><b>{done}<small>/{LESSONS.length}</small></b><span>lessons done</span></div>
          <div><b>{s}</b><span>day{s === 1 ? "" : "s"} in a row</span></div>
        </div>
      )}
      <div className={styles.nextStep}>
        <span className="label">Next step</span>
        {refresh && <p>{refresh.name} is due for a refresh. <Link href={refresh.href} transitionTypes={["page-turn"]}>Refresh {refresh.title} →</Link></p>}
        {checkpoint && <p>You have done every lesson before Checkpoint {checkpoint.numeral}. <Link href={`/academy/checkpoint/${checkpoint.id}`} transitionTypes={["page-turn"]}>Test them together →</Link></p>}
        {next
            ? <>
                <p>{done ? `Your next lesson in ${TRACKS.grammar.name.toLowerCase()}:` : `${TRACKS.grammar.name}, ${grammarLesson(next.id).toLowerCase()}:`}</p>
                <Link className="btn" href={`/academy/lesson/${next.id}`} transitionTypes={["page-turn"]}>{next.title} <span className="arr" aria-hidden="true">→</span></Link>
              </>
            : <>
                <p>You have finished every lesson so far.</p>
                <Link className="btn" href="/academy/vocabulary" transitionTypes={["page-turn"]}>Grow your vocabulary <span className="arr" aria-hidden="true">→</span></Link>
              </>}
      </div>
    </section>
  );
}
