/**
 * The Academy's two tracks (the owner's choice, 2026-10-20, review fixes slice 4): two courses that both start with the
 * letters, each with one name, one line on whom it suits, and lessons counted from 1. Every lesson number, every lesson
 * length and every "next lesson" on the site comes from here, so the home page, the Academy, the lesson pages and Your
 * desk always agree (e2e/lesson-refs.spec.ts and scripts/check-lessons.mjs check it).
 */
import { LESSON_INFO } from "./lesson-index";

export const TRACKS = {
  reading: {
    name: "Learn by reading", href: "/academy/reading",
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
