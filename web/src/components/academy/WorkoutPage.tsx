import Page from "@/components/Page";
import PageWin from "@/components/a/PageWin";
import PageHead from "@/components/PageHead";
import Workout, { type Mode } from "./Workout";
import { LESSONS, type Lesson } from "@/data/lessons";
import { trail } from "@/config/areas";
import styles from "./Workout.module.css";

/** The page around a lesson's practice or test. */
export default function WorkoutPage({ lesson, mode }: { lesson: Lesson; mode: Exclude<Mode, "warmup"> }) {
  const n = LESSONS.indexOf(lesson) + 1;
  return (
    <Page>
      <div className="wrap tool-page" style={{ paddingBlock: "0 clamp(28px, 5vw, 48px)" }}>
        <div className="tool-main">
        <PageHead bare desk={false} path={trail("study", { label: `Lesson ${n}`, href: `/academy/lesson/${lesson.id}` }, mode === "practice" ? "Practice" : "Test")}
          title={<>{mode === "practice" ? "Practise" : "Test yourself"}: {lesson.title}</>} greek={mode === "practice" ? "ἄσκησις" : "δοκιμασία"}
          purpose={mode === "practice"
            ? "A round of questions on this lesson, with some from earlier lessons mixed in. Anything you miss comes back at the end of the round, until you have it."
            : "Questions on this lesson alone, one try each. Pass it and the lesson's words join your daily review, and the lesson returns for short refreshes so that it stays with you."} />
        <div className={`meander ${styles.pageIntro}`} aria-hidden="true" style={{ marginBlock: 6 }} />
        <Workout lesson={lesson} mode={mode} />
        </div>
        <PageWin className="piece-desk" />
      </div>
    </Page>
  );
}
