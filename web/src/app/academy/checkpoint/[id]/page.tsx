import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import Workout from "@/components/academy/Workout";
import { CHECKPOINTS, CHECKPOINT_GREEK, checkpointById } from "@/data/checkpoints";
import { LESSONS, lessonById } from "@/data/lessons";
import { AREAS, trail } from "@/config/areas";
import { TRACKS } from "@/data/tracks";
import styles from "@/components/academy/Workout.module.css";

export function generateStaticParams() {
  return CHECKPOINTS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/academy/checkpoint/[id]">): Promise<Metadata> {
  const { id } = await params;
  const c = checkpointById(id);
  return { title: `Checkpoint ${c?.numeral ?? ""}: ${c?.title ?? ""} · ${AREAS.study.name}`, robots: { index: false } };
}

export default async function CheckpointPage({ params }: PageProps<"/academy/checkpoint/[id]">) {
  const { id } = await params;
  const c = checkpointById(id);
  if (!c) notFound();
  const lessons = c.lessons.map((x) => lessonById(x)!);
  const first = LESSONS.indexOf(lessons[0]) + 1, last = LESSONS.indexOf(lessons.at(-1)!) + 1;
  return (
    <Page>
      <div className="wrap tool-page" style={{ paddingBlock: "0 clamp(28px, 5vw, 48px)" }}>
        <div className="tool-main">
        <PageHead bare path={trail("study", { label: TRACKS.grammar.name, href: TRACKS.grammar.href }, `Checkpoint ${c.numeral}`)} title={<>Checkpoint {c.numeral}: {c.title}</>} greek={CHECKPOINT_GREEK}
          purpose={<>Fifteen questions over lessons {first} to {last}, mixed together, one try each. Testing the lessons side by side is what
            makes them hold.</>} />
        <div className={`meander ${styles.pageIntro}`} aria-hidden="true" style={{ marginBlock: 6 }} />
        <Workout lesson={lessons.at(-1)!} mode="test" checkpoint={c} />
        </div>
      </div>
    </Page>
  );
}
