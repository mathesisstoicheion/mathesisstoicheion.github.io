import Link from "next/link";
import Page from "@/components/Page";
import Workout, { type Mode } from "./Workout";
import { LESSONS, type Lesson } from "@/data/lessons";
import { AREAS } from "@/config/areas";
import styles from "./Workout.module.css";
import NameCarving from "@/components/art/NameCarving";
import PagePiece from "@/components/art/PagePiece";

/** The page around a lesson's practice or test. */
export default function WorkoutPage({ lesson, mode }: { lesson: Lesson; mode: Exclude<Mode, "warmup"> }) {
  const n = LESSONS.indexOf(lesson) + 1;
  return (
    <Page>
      <div className="wrap tool-page" style={{ paddingBlock: "clamp(28px, 5vw, 48px)" }}>
        <div className="tool-main">
        <div className="page-head">
          <nav className="label">
            <Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> ›{" "}
            <Link href={`/academy/lesson/${lesson.id}`} transitionTypes={["page-turn"]}>Lesson {n}</Link> › {mode === "practice" ? "Practice" : "Test"}
          </nav>
          <PagePiece className="piece-phone" />
          <NameCarving greek={mode === "practice" ? "ἄσκησις" : "δοκιμασία"} />
          <h1 className="page-title" style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
            {mode === "practice" ? "Practise" : "Test yourself"}: {lesson.title}
            <span lang="grc" style={{ display: "block", fontSize: "0.55em", marginTop: 6 }}>{mode === "practice" ? "ἄσκησις" : "δοκιμασία"}</span>
          </h1>
          <p className={`muted ${styles.pageIntro}`} style={{ fontSize: "1.05rem", maxWidth: "62ch" }}>
            {mode === "practice"
              ? "A round of questions on this lesson, with some from earlier lessons mixed in. Anything you miss comes back at the end of the round, until you have it."
              : "Questions on this lesson alone, one try each. Pass it and the lesson's words join your daily review, and the lesson returns for short refreshes so that it stays with you."}
          </p>
        </div>
        <div className={`meander ${styles.pageIntro}`} aria-hidden="true" style={{ marginBlock: 6 }} />
        <Workout lesson={lesson} mode={mode} />
        </div>
        <PagePiece className="piece-desk" />
      </div>
    </Page>
  );
}
