import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkoutPage from "@/components/academy/WorkoutPage";
import { LESSONS, lessonById } from "@/data/lessons";
import { AREAS } from "@/config/areas";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/academy/lesson/[id]/test">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Test: ${lessonById(id)?.title ?? "Lesson"} · ${AREAS.study.name}`, robots: { index: false } };
}

export default async function LessonPage({ params }: PageProps<"/academy/lesson/[id]/test">) {
  const { id } = await params;
  const lesson = lessonById(id);
  if (!lesson) notFound();
  return <WorkoutPage lesson={lesson} mode="test" />;
}
