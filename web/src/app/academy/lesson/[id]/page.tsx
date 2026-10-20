import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import LessonView from "@/components/academy/LessonView";
import { LESSONS, lessonById } from "@/data/lessons";
import { TRACKS, grammarLesson } from "@/data/tracks";
import { AREAS, trail } from "@/config/areas";

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
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "0 clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <PageHead bare path={trail("study", { label: TRACKS.grammar.name, href: TRACKS.grammar.href }, grammarLesson(lesson.id))} title={lesson.title} greek={lesson.greek}
          purpose={<>{lesson.summary} · about {lesson.minutes} minutes</>} />
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        <LessonView lesson={lesson} />
      </div>
    </Page>
  );
}
