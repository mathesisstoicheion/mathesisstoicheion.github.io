import { describe, expect, it } from "vitest";
import { LETTERS_STEP, PATH, PRACTICE, lineWords, stepWords, wordsRead } from "./reading-path";
import { READING_ITEMS, READING_TOTAL, lessonsRead, pathKey, readingNo } from "./reading-index";
import { LESSON_INFO } from "./lesson-index";
import { TRACKS, nextGrammar, nextReading, nextSteps } from "./tracks";

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

describe("the lessons read", () => {
  it("count the letters and every lesson finished, and no practice lesson", () => {
    const read = (...ids: string[]) => Object.fromEntries(ids.map((id) => [pathKey(id), 1]));
    expect(lessonsRead({})).toBe(0);
    expect(lessonsRead(read("letters"))).toBe(1);
    expect(lessonsRead(read("letters", "nothing-too-much", "know-yourself", "everything-moves", "practice-1"))).toBe(4);
    expect(lessonsRead(read(...READING_ITEMS.map((i) => i.id)))).toBe(READING_TOTAL);
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

describe("the one next step a page offers", () => {
  const at = (...ids: string[]) => Object.fromEntries(ids.map((id) => [id, 1]));

  it("is the reading path's next lesson, with the grammar course's beside it only once that course is begun", () => {
    expect(nextSteps({})).toMatchObject({ main: { step: { href: "/academy/reading/letters" }, track: "Learn by reading" }, also: null });
    expect(nextSteps(at(LESSON_INFO[0].id))).toMatchObject({ main: { step: { href: "/academy/reading/letters" } }, also: { href: `/academy/lesson/${LESSON_INFO[1].id}` } });
  });

  it("is the grammar course's once the path is finished, and nothing once both are", () => {
    const path = READING_ITEMS.map((i) => `read:${i.id}`);
    expect(nextSteps(at(...path))).toMatchObject({ main: { step: { href: `/academy/lesson/${LESSON_INFO[0].id}` }, track: "The grammar course" }, also: null });
    expect(nextSteps(at(...path, ...LESSON_INFO.map((l) => l.id)))).toEqual({ main: null, also: null });
  });
});

describe("the words read on the path", () => {
  const at = (...ids: string[]) => Object.fromEntries(ids.map((id) => [id, 1]));
  const lemmas = (c: Record<string, number>) => wordsRead(c).map((w) => w.lemma);

  it("are none before a lesson with a line is finished (the letters teach no words)", () => {
    expect(wordsRead({})).toEqual([]);
    expect(wordsRead(at("read:letters"))).toEqual([]);
  });

  it("are a finished lesson's line, and its passage only once that is finished too", () => {
    const s = PATH.find((x) => x.passage)!;
    expect(lemmas(at(`read:${s.id}`))).toEqual(s.parts.flatMap((p) => p.words.map((w) => w.lemma)));
    expect(lemmas(at(`read:${s.id}`, `passage:${s.id}`))).toEqual(stepWords(s, true).map((w) => w.lemma));
  });

  it("take in every line of a finished practice lesson, after the lessons", () => {
    const p = PRACTICE[0];
    const line = p.lines.flatMap((l) => l.pieces.flatMap((q) => q.words.map((w) => w.lemma)));
    expect(lemmas(at(`read:${PATH[0].id}`, `read:${p.id}`))).toEqual([...stepWords(PATH[0], false).map((w) => w.lemma), ...line]);
  });
});
