"use client";
/** Today's session: the lesson or checkpoint whose refresh is due, as its test. Loaded only when one is due. */
import { lessonById } from "@/data/lessons";
import { checkpointById } from "@/data/checkpoints";
import type { Due } from "@/lib/refreshes";
import Workout from "./Workout";

export default function SessionRefresh({ due, onFinish }: { due: Due; onFinish: () => void }) {
  const cp = due.kind === "checkpoint" ? checkpointById(due.id) : undefined;
  const lesson = cp ? lessonById(cp.lessons.at(-1)!) : lessonById(due.id);
  if (!lesson) return null;
  return <Workout lesson={lesson} mode="test" checkpoint={cp} embedded onFinish={onFinish} />;
}
