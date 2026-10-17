import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import LessonView from "@/components/academy/LessonView";
import { LESSONS, lessonById } from "@/data/lessons";
import { AREAS } from "@/config/areas";
import NameCarving from "@/components/art/NameCarving";
import PagePiece from "@/components/art/PagePiece";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/academy/lesson/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `${lessonById(id)?.title ?? "Lesson"} · ${AREAS.study.name}` };
}

export default async function LessonPage({ params }: PageProps<"/academy/lesson/[id]">) {
  const { id } = await params;
  const lesson = lessonById(id);
  if (!lesson) notFound();
  const n = LESSONS.indexOf(lesson) + 1;
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <div className="page-head">
          <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Lesson {n} of {LESSONS.length}</nav>
          <NameCarving greek={lesson.greek} />
          <PagePiece className="piece-desk" />
          <h1 className="page-title">{lesson.title} <span lang="grc" style={{ display: "block", fontSize: "0.5em", marginTop: 8 }}>{lesson.greek}</span></h1>
          <PagePiece className="piece-phone" />
          <p className="muted" style={{ fontSize: "1.1rem" }}>{lesson.summary} · about {lesson.minutes} minutes</p>
        </div>
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        <LessonView lesson={lesson} />
      </div>
    </Page>
  );
}
