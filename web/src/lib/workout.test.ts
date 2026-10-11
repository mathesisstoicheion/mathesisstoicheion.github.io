import { describe, expect, it } from "vitest";
import { LESSONS } from "@/data/lessons";
import { lessonPool, testRound, practiceRound, warmUp, isRightWritten } from "./workout";
import { shortGloss } from "./glosses";
import { afterTest, refreshDue, passMark, REFRESH_DAYS } from "./mastery";

// meanings as the page would find them (a few, enough to make choices)
const glosses: Record<string, string> = Object.fromEntries(LESSONS.flatMap((l) => l.words).map((w, i) => [w, `${"abcdefghij"[i % 10]}${"klmnopqrst"[Math.floor(i / 10)]} meaning`]));

describe("lesson workouts", () => {
  it("every lesson has a test of at least five questions, each well formed", () => {
    for (const l of LESSONS) {
      const pool = lessonPool(l, glosses);
      const t = testRound(l, glosses);
      expect(t.length, l.id).toBeGreaterThanOrEqual(5);
      expect(new Set(t.map((q) => q.key)).size).toBe(t.length);
      for (const q of pool) {
        if (q.kind === "choice") {
          expect(q.options[q.answer], q.key).toBeTruthy();
          expect(new Set(q.options).size, q.key).toBe(q.options.length);
        } else expect(q.answers.length).toBeGreaterThan(0);
      }
    }
  });

  it("mixes earlier lessons into practice, and warms up with three earlier questions", () => {
    const l = LESSONS[5];
    const p = practiceRound(l, glosses);
    expect(p.length).toBe(12);
    expect(p.some((q) => q.lesson !== l.id)).toBe(true);
    const w = warmUp(l, glosses);
    expect(w).toHaveLength(3);
    expect(w.every((q) => q.lesson !== l.id)).toBe(true);
    expect(warmUp(LESSONS[0], glosses)).toHaveLength(0);
  });

  it("a form question's wrong answers are never also right", () => {
    for (const l of LESSONS) for (const q of lessonPool(l, glosses)) {
      if (q.kind !== "choice" || !q.key.includes(":form:")) continue;
      const wrong = q.options.filter((_, i) => i !== q.answer);
      expect(wrong).not.toContain(q.options[q.answer]);
    }
  });

  it("accepts a written form in Greek or Latin letters, without accents", () => {
    expect(isRightWritten("λογων", ["λόγων"])).toBe(true);
    expect(isRightWritten("logōn", ["λόγων"])).toBe(true);
    expect(isRightWritten("logous", ["λόγους"])).toBe(true);
    expect(isRightWritten("λογου", ["λόγων"])).toBe(false);
    expect(isRightWritten("", ["λόγων"])).toBe(false);
    expect(isRightWritten("λυει", ["λύει", "λύεις"])).toBe(true);
  });

  it("cuts a dictionary definition to its first sense", () => {
    expect(shortGloss("word, speech, discourse; thought, reason, account")).toBe("word, speech, discourse");
    expect(shortGloss("(+infin.) will, wish (to); be willing (to)")).toBe("will, wish");
  });

  it("spaces refreshes out after each pass and brings a failed one back tomorrow", () => {
    const now = 1_000_000_000_000, day = 86_400_000;
    const first = afterTest(undefined, 6, 10, now);
    expect(first.passed).toBe(0);
    const pass = afterTest(first, 8, 10, now);
    expect(pass.passed).toBe(now);
    expect(pass.due).toBe(now + REFRESH_DAYS[0] * day);
    expect(refreshDue(pass, now + 4 * day)).toBe(true);
    const again = afterTest(pass, 9, 10, now + 4 * day);
    expect(again.level).toBe(1);
    const fail = afterTest(again, 3, 10, now + 20 * day);
    expect(fail.due).toBe(now + 21 * day);
    expect(passMark(10)).toBe(8);
    expect(passMark(6)).toBe(5);
  });
});
