import { describe, expect, it } from "vitest";
import { LETTERS_STEP, PATH, PRACTICE, lineWords } from "./reading-path";
import { READING_ITEMS, READING_TOTAL, readingNo } from "./reading-index";
import { LESSON_INFO } from "./lesson-index";
import { TRACKS, nextGrammar, nextReading } from "./tracks";

describe("the reading path's light index", () => {
  it("lists the letters, every lesson and every practice lesson, in the path's order, with the same titles and sizes", () => {
    const full = [
      { id: LETTERS_STEP.id, kind: "letters", title: LETTERS_STEP.title, words: LETTERS_STEP.names.length },
      ...PATH.flatMap((s) => [
        { id: s.id, kind: "lesson", title: s.title, words: lineWords(s) },
        ...PRACTICE.filter((p) => p.after === s.id).map((p) => ({ id: p.id, kind: "practice", title: p.title, words: 0 })),
      ]),
    ];
    expect(READING_ITEMS).toEqual(full);
  });

  it("numbers the lessons from 1, the letters first, practice lessons left out", () => {
    expect(READING_TOTAL).toBe(PATH.length + 1);
    expect(readingNo(LETTERS_STEP.id)).toBe(1);
    PATH.forEach((s, i) => expect(readingNo(s.id), s.id).toBe(i + 2));
  });
});

describe("the next step", () => {
  const at = (...ids: string[]) => Object.fromEntries(ids.map((id) => [id, 1]));

  it("starts a new learner on the reading path's first lesson, where every way in for a beginner leads", () => {
    expect(nextReading({})).toMatchObject({ href: "/academy/reading/letters", title: "The letters", place: `lesson 1 of ${READING_TOTAL}` });
    expect(TRACKS.reading.first).toBe(nextReading({})!.href);
  });

  it("follows the path in order, practice lessons included", () => {
    expect(nextReading(at("read:letters"))?.href).toBe(`/academy/reading/${PATH[0].id}`);
    const third = PATH[2].id;
    const before = ["read:letters", ...PATH.slice(0, 3).map((s) => `read:${s.id}`)];
    expect(nextReading(at(...before))).toMatchObject({ href: "/academy/reading/practice-1", place: "practice" });
    expect(PRACTICE[0].after).toBe(third);
  });

  it("is done when every lesson and practice lesson is read", () => {
    expect(nextReading(at(...READING_ITEMS.map((i) => `read:${i.id}`)))).toBeNull();
  });

  it("keeps the grammar course's own next lesson apart", () => {
    expect(nextGrammar({})).toMatchObject({ href: `/academy/lesson/${LESSON_INFO[0].id}`, place: `lesson 1 of ${LESSON_INFO.length}` });
    // the path's letters lesson is not the grammar course's first lesson
    expect(nextGrammar(at("read:letters"))?.href).toBe(`/academy/lesson/${LESSON_INFO[0].id}`);
    expect(nextGrammar(at(LESSON_INFO[0].id))?.href).toBe(`/academy/lesson/${LESSON_INFO[1].id}`);
  });
});
