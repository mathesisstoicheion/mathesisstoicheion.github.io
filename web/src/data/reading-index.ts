/**
 * The learn-by-reading path in order, as pages outside its own lessons need it: to name and number each lesson and
 * link to it (the Learn page's next step, Your desk on the home page). What each lesson teaches is in reading-path.ts,
 * which only the reading pages load, so the other pages do not carry it; reading-index.test.ts checks that the two
 * agree. The same pattern as lesson-index.ts for the grammar course.
 */
export interface ReadingItem {
  id: string;
  /** the letters (lesson 1), a lesson on one line, or a practice lesson after every three */
  kind: "letters" | "lesson" | "practice";
  title: string;
  /** the dictionary forms the lesson's line teaches (the six names, for the letters); none for a practice lesson */
  words: number;
}

export const READING_ITEMS: ReadingItem[] = [
  { id: "letters", kind: "letters", title: "The letters", words: 6 },
  { id: "nothing-too-much", kind: "lesson", title: "Nothing in excess", words: 2 },
  { id: "know-yourself", kind: "lesson", title: "Know yourself", words: 2 },
  { id: "everything-moves", kind: "lesson", title: "Everything moves on", words: 5 },
  { id: "practice-1", kind: "practice", title: "Practice: lessons 2 to 4", words: 0 },
  { id: "life-is-short", kind: "lesson", title: "Life is short", words: 3 },
  { id: "the-art-is-long", kind: "lesson", title: "The art is long", words: 4 },
  { id: "measure-of-all-things", kind: "lesson", title: "The measure of all things", words: 4 },
  { id: "practice-2", kind: "practice", title: "Practice: lessons 5 to 7", words: 0 },
  { id: "what-i-do-not-know", kind: "lesson", title: "I do not think I know", words: 4 },
  { id: "the-unexamined-life", kind: "lesson", title: "The unexamined life", words: 7 },
  { id: "political-animal", kind: "lesson", title: "An animal of the city", words: 5 },
  { id: "practice-3", kind: "practice", title: "Practice: lessons 8 to 10", words: 0 },
  { id: "full-of-gods", kind: "lesson", title: "Full of gods", words: 4 },
  { id: "they-say-fine-things", kind: "lesson", title: "They say many fine things", words: 5 },
  { id: "desire-to-know", kind: "lesson", title: "All human beings desire to know", words: 6 },
  { id: "practice-4", kind: "practice", title: "Practice: lessons 11 to 13", words: 0 },
];

/** Progress keys in the academy store (lib/academy.ts): a lesson's line (or a practice lesson) read, and its passage read to the end. */
export const pathKey = (id: string) => `read:${id}`;
export const passageKey = (id: string) => `passage:${id}`;

/** the lessons alone, numbered from 1 (the letters are lesson 1); practice lessons carry no number */
const LESSONS = READING_ITEMS.filter((i) => i.kind !== "practice");
export const READING_TOTAL = LESSONS.length;
export const readingNo = (id: string) => LESSONS.findIndex((i) => i.id === id) + 1;
export const readingLesson = (id: string) => `Lesson ${readingNo(id)} of ${READING_TOTAL}`;
/** how many of those lessons a learner has finished, the letters among them: the one count of "lessons read" that the
 * Learn page and the reading path's Lessons completed both show */
export const lessonsRead = (completed: Record<string, number>) => LESSONS.filter((i) => completed[pathKey(i.id)]).length;
