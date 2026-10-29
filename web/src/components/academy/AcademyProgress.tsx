"use client";

import Link from "next/link";
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
import { READING_ITEMS, READING_TOTAL, pathKey } from "@/data/reading-index";
import { useAcademy, streak } from "@/lib/academy";
import { dueRefreshes, readyCheckpoint } from "@/lib/refreshes";
import styles from "./Academy.module.css";
import { TRACKS, begun, nextSteps } from "@/data/tracks";

/**
 * Where the learner stands, and what to do next: the reading path's next lesson first, the way in (data/tracks.ts);
 * the grammar course's next lesson, and its refreshes and checkpoints, beside it once that course has been begun.
 */
export default function AcademyProgress() {
  const { completed, days, mastery } = useAcademy();
  const started = begun(completed);
  const refresh = started.grammar ? dueRefreshes(mastery)[0] : undefined;
  const checkpoint = started.grammar ? readyCheckpoint(completed, mastery) : null;
  const read = READING_ITEMS.filter((i) => i.kind !== "practice" && completed[pathKey(i.id)]).length;
  const passed = LESSONS.filter((l) => completed[l.id]).length;
  const s = streak(days);
  // the numbers are for a learner who has begun: a first visit would meet a row of zeros
  const any = started.reading || started.grammar;
  // the main step: the path, unless it is finished (then the course, if anything of it is left)
  const { main, also } = nextSteps(completed);

  return (
    <section className={`${styles.progress} ${any ? "" : styles.progressNew}`} aria-label="Your progress">
      {any && (
        <div className={styles.stats}>
          <div><b>{read}<small>/{READING_TOTAL}</small></b><span>lessons read</span></div>
          {started.grammar && <div><b>{passed}<small>/{LESSONS.length}</small></b><span>grammar lessons</span></div>}
          <div><b>{s}</b><span>day{s === 1 ? "" : "s"} in a row</span></div>
        </div>
      )}
      <div className={styles.nextStep}>
        <span className="label">Next step</span>
        {main ? (
          <>
            <p>{main.track}, {main.step.place}:</p>
            <Link className="btn" href={main.step.href} transitionTypes={["page-turn"]}>{main.step.title} <span className="arr" aria-hidden="true">→</span></Link>
          </>
        ) : (
          <>
            <p>You have finished both tracks. Now read on, with the look-up beside you.</p>
            <Link className="btn" href="/library" transitionTypes={["page-turn"]}>Open the library <span className="arr" aria-hidden="true">→</span></Link>
          </>
        )}
        {also && <p className="muted">And in {TRACKS.grammar.name.toLowerCase()}, {also.place}: <Link href={also.href} transitionTypes={["page-turn"]}>{also.title} →</Link></p>}
        {refresh && <p className="muted">{refresh.name} is due for a refresh. <Link href={refresh.href} transitionTypes={["page-turn"]}>Refresh {refresh.title} →</Link></p>}
        {checkpoint && <p className="muted">You have done every lesson before Checkpoint {checkpoint.numeral}. <Link href={`/academy/checkpoint/${checkpoint.id}`} transitionTypes={["page-turn"]}>Test them together →</Link></p>}
      </div>
    </section>
  );
}
