/**
 * The Academy's two tracks (the owner's choice, 2026-10-20, review fixes slice 4): two courses that both start with the
 * letters, each with one name, one line on whom it suits, and lessons counted from 1. Every lesson number, every lesson
 * length and every "next lesson" on the site comes from here, so the home page, the Academy, the lesson pages and Your
 * desk always agree (e2e/lesson-refs.spec.ts and scripts/check-lessons.mjs check it).
 */
import { LESSON_INFO } from "./lesson-index";
import { READING_ITEMS, READING_TOTAL, pathKey, readingNo } from "./reading-index";

export const TRACKS = {
  reading: {
    name: "Learn by reading", href: "/academy/reading",
    /** where a beginner starts, on every page that offers a way in (the home page, the guide) */
    first: "/academy/reading/letters",
    who: "Pick this to read real Greek from the first day: one line at a time, with the grammar explained as it comes.",
  },
  grammar: {
    name: "The grammar course", href: "/academy#lessons-title",
    who: "Pick this to learn the grammar in order, from the alphabet to Homer, each lesson with its own short test.",
  },
} as const;

/** a lesson's length, the same unit on both tracks: the words it teaches */
export const wordsLabel = (n: number) => `${n} word${n === 1 ? "" : "s"}`;

/** the grammar course: lesson numbers count from 1 */
export const GRAMMAR_TOTAL = LESSON_INFO.length;
export const grammarNo = (id: string) => LESSON_INFO.findIndex((l) => l.id === id) + 1;
export const grammarLesson = (id: string) => `Lesson ${grammarNo(id)} of ${GRAMMAR_TOTAL}`;

/**
 * The learner's next step on each track, from what this device remembers (lib/academy.ts `completed`), the same on
 * every page that offers one (the Learn page, Your desk). The reading path leads: it is the way in, and its lessons end
 * in the reader (the owner, 2026-10-18 and 2026-10-23); the grammar course's next lesson stands beside it once that
 * course has been begun.
 */
export interface NextStep { href: string; title: string; place: string; size: string }
type Completed = Record<string, number>;

export function nextReading(completed: Completed): NextStep | null {
  const it = READING_ITEMS.find((i) => !completed[pathKey(i.id)]);
  if (!it) return null;
  const practice = it.kind === "practice";
  return {
    href: `/academy/reading/${it.id}`, title: it.title,
    place: practice ? "practice" : `lesson ${readingNo(it.id)} of ${READING_TOTAL}`,
    size: practice ? "a practice lesson" : wordsLabel(it.words),
  };
}

export function nextGrammar(completed: Completed): NextStep | null {
  const l = LESSON_INFO.find((x) => !completed[x.id]);
  return l ? { href: `/academy/lesson/${l.id}`, title: l.title, place: grammarLesson(l.id).toLowerCase(), size: wordsLabel(l.words.length) } : null;
}

/** which tracks the learner has begun: a lesson read on the path, or a lesson passed (or marked read) in the course */
export const begun = (completed: Completed) => ({
  reading: READING_ITEMS.some((i) => completed[pathKey(i.id)]),
  grammar: LESSON_INFO.some((l) => completed[l.id]),
});
