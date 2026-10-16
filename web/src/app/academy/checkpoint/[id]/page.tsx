import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import Workout from "@/components/academy/Workout";
import { CHECKPOINTS, CHECKPOINT_GREEK, checkpointById } from "@/data/checkpoints";
import { LESSONS, lessonById } from "@/data/lessons";
import { AREAS } from "@/config/areas";
import styles from "@/components/academy/Workout.module.css";
import NameCarving from "@/components/art/NameCarving";

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
      <div className="wrap" style={{ paddingBlock: "clamp(28px, 5vw, 48px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14, maxWidth: 820 }}>
        <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Checkpoint {c.numeral}</nav>
        <NameCarving greek={CHECKPOINT_GREEK} />
        <h1 className="page-title" style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
          Checkpoint {c.numeral}: {c.title}
          <span lang="grc" style={{ display: "block", fontSize: "0.55em", marginTop: 6 }}>{CHECKPOINT_GREEK}</span>
        </h1>
        <p className={`muted ${styles.pageIntro}`} style={{ fontSize: "1.05rem", maxWidth: "62ch" }}>
          Fifteen questions over lessons {first} to {last}, mixed together, one try each. Testing the lessons side by side is what
          makes them hold: pass it, and the whole stretch comes back for short refreshes like a single lesson.
        </p>
        <div className={`meander ${styles.pageIntro}`} aria-hidden="true" style={{ marginBlock: 6 }} />
        <Workout lesson={lessons.at(-1)!} mode="test" checkpoint={c} />
      </div>
    </Page>
  );
}
