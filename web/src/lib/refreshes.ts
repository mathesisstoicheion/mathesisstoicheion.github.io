/**
 * What is due again: lessons and checkpoints whose refresh has come round, and a checkpoint the learner is ready
 * for. Light (lesson-index and checkpoints only), for the Academy's progress panel and Today's session.
 */
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
import { CHECKPOINTS, checkpointKey } from "@/data/checkpoints";
import { refreshDue, type Mastery } from "./mastery";

export interface Due { kind: "lesson" | "checkpoint"; id: string; name: string; title: string; href: string; due: number }

export function dueRefreshes(mastery: Record<string, Mastery>, now = Date.now()): Due[] {
  const out: Due[] = [];
  LESSONS.forEach((l, i) => {
    const m = mastery[l.id];
    if (refreshDue(m, now)) out.push({ kind: "lesson", id: l.id, name: `Lesson ${i + 1}`, title: l.title, href: `/academy/lesson/${l.id}/test`, due: m.due });
  });
  for (const c of CHECKPOINTS) {
    const m = mastery[checkpointKey(c.id)];
    if (refreshDue(m, now)) out.push({ kind: "checkpoint", id: c.id, name: `Checkpoint ${c.numeral}`, title: c.title, href: `/academy/checkpoint/${c.id}`, due: m.due });
  }
  return out.sort((a, b) => a.due - b.due);
}

/** The first checkpoint whose lessons are all done but which is not yet passed. */
export const readyCheckpoint = (completed: Record<string, number>, mastery: Record<string, Mastery>) =>
  CHECKPOINTS.find((c) => c.lessons.every((l) => completed[l]) && !mastery[checkpointKey(c.id)]?.passed);
