/**
 * Lesson workouts: the practice, the test and the warm-up that make a lesson stick.
 *
 * Every question is built from material already checked elsewhere on the site, never written here:
 *  - the lesson's own "Check yourself" questions (lessons.ts);
 *  - the lesson's words, with their meanings from the DCC core list or LSJ (fetched by the page and passed in);
 *  - the forms in the lesson's tables (paradigms.ts, checked against GLAUx);
 *  - for the first lesson, the letters and their names (alphabet.ts).
 *
 * Kinds of question: pick the meaning of a Greek word, pick the Greek for a meaning, pick or write a form
 * from a table, name a form, and the lesson's own questions. Writing a form accepts Greek letters or the
 * site's Latin transliteration, without accents (the answer is then shown with them).
 */
import type { Lesson } from "@/data/lessons";
import { LESSONS } from "@/data/lessons";
import { PARADIGMS, formsOf, type Paradigm } from "@/data/paradigms";
import { LETTERS } from "@/data/alphabet";
import { toPattern, detectScript } from "@/lib/search/input";
import { greekKey } from "@/lib/search/codec";
export { passMark } from "@/lib/mastery";

export type Question =
  | (Base & { kind: "choice"; options: string[]; answer: number; greek: boolean; why?: string })
  | (Base & { kind: "write"; answers: string[] });
/** `key` names the question; `about` the thing it asks about (a word, a cell), so a round never asks about one thing twice. */
interface Base { key: string; about: string; lesson: string; topic: string; prompt: string }

type Rand = () => number;
const shuffle = <T,>(a: T[], rand: Rand) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// ------------------------------------------------------------ which tables a lesson drills
/** Tables shown in more than one lesson are drilled only in the columns that lesson teaches. */
const LESSON_COLS: Record<string, Record<string, string[]>> = {
  "present-tense": { luo: ["present"] },
  "past-tenses": { luo: ["imperfect", "aorist"] },
  "future": { luo: ["future"] },
};

export function lessonTables(lesson: Lesson): { p: Paradigm; cols: number[] }[] {
  const ids = [...new Set(lesson.sections.flatMap((s) => (s.kind === "table" ? [s.paradigm] : [])))];
  return ids.flatMap((id) => {
    const p = PARADIGMS.find((x) => x.id === id);
    if (!p) return [];
    const only = LESSON_COLS[lesson.id]?.[id];
    const cols = p.cols.map((_, c) => c).filter((c) => !only || only.includes(p.cols[c]));
    return [{ p, cols }];
  });
}

/** What a table's forms are, where its rows and columns do not say it. */
const QUALIFIER: Record<string, string> = {
  luomai: "middle/passive",
  luon: "present active participle", lusas: "aorist active participle",
  luomenos: "present middle/passive participle", lutheis: "aorist passive participle", on: "participle",
};

/** How a cell is named in a question: the "genitive plural" of «λόγος»; the "present" of «λύω» for *he, she, it*. */
export function cellName(p: Paradigm, r: number, c: number): { what: string; of: string } {
  const row = p.rows[r], col = p.cols[c], q = QUALIFIER[p.id];
  const lemma = `«${p.colLemmas?.[c] ?? p.lemma}»`;
  if (p.id === "ego-sy" || p.id === "tis") return { what: row, of: `*${col}*` };
  if (p.id === "luo-inf") return { what: `${row} ${col} infinitive`, of: lemma };
  if (row === "I" || p.rows.includes("he, she, it")) return { what: p.colLemmas ? "form" : `${col}${q ? ` ${q}` : ""}`, of: `${lemma} for *${row}*` };
  const n = col.replace("masc.", "masculine").replace("fem.", "feminine").replace("neut.", "neuter").replace(/ sg$/, " singular").replace(/ pl$/, " plural");
  return { what: `${q ? `${q}, ` : ""}${row} ${n}`, of: lemma };
}

const describeCell = (p: Paradigm, r: number, c: number) => { const n = cellName(p, r, c); return `${n.what} of ${n.of}`; };

// ------------------------------------------------------------ the question pool for one lesson
export function lessonPool(lesson: Lesson, glosses: Record<string, string>, rand: Rand = Math.random): Question[] {
  const qs: Question[] = [];
  const L = lesson.id;

  // 1. the lesson's own questions, with their explanations
  lesson.sections.forEach((s, si) => {
    if (s.kind !== "check") return;
    s.items.forEach((it, i) => {
      const order = shuffle(it.options.map((_, j) => j), rand);
      qs.push({ kind: "choice", key: `${L}:check:${si}:${i}`, about: `${L}:check:${si}:${i}`, lesson: L, topic: "the lesson's questions", prompt: it.q,
        options: order.map((j) => it.options[j]), answer: order.indexOf(it.answer), greek: false, why: it.why });
    });
  });

  // 2. the lesson's words, both ways; wrong answers are meanings of other lessons' words
  const allGlossed = Object.entries(glosses).filter(([, g]) => g);
  for (const w of lesson.words) {
    const g = glosses[w];
    if (!g) continue;
    // a wrong meaning must not start like the right one ("who, which" beside "who? what?")
    const head = (x: string) => x.toLowerCase().match(/[a-z]+/)?.[0];
    const others = shuffle(allGlossed.filter(([x, y]) => x !== w && y !== g && head(y) !== head(g)), rand);
    const wrongG = [...new Set(others.map(([, y]) => y))].slice(0, 3);
    const wrongW = [...new Set(others.map(([x]) => x))].slice(0, 3);
    if (wrongG.length === 3) {
      const opts = shuffle([g, ...wrongG], rand);
      qs.push({ kind: "choice", key: `${L}:mean:${w}`, about: `word:${w}`, lesson: L, topic: "the words", prompt: `What does «${w}» mean?`, options: opts, answer: opts.indexOf(g), greek: false });
    }
    if (wrongW.length === 3) {
      const opts = shuffle([w, ...wrongW], rand);
      qs.push({ kind: "choice", key: `${L}:word:${w}`, about: `word:${w}`, lesson: L, topic: "the words", prompt: `Which word means *${g}*?`, options: opts, answer: opts.indexOf(w), greek: true });
    }
  }

  // 3. forms from the lesson's tables: pick one, write one, name one
  for (const { p, cols } of lessonTables(lesson)) {
    const rows = p.rows.map((_, r) => r).filter((r) => p.rows[r] !== "vocative");
    const cells = rows.flatMap((r) => cols.map((c) => ({ r, c, forms: formsOf(p.cells[r][c]) })));
    const tableForms = [...new Set(cells.flatMap((x) => x.forms))];
    for (const { r, c, forms } of cells) {
      const answer = forms[0];
      const { what, of } = cellName(p, r, c);
      const wrong = shuffle(tableForms.filter((f) => !forms.some((g) => greekKey(g) === greekKey(f))), rand).slice(0, 3);
      if (wrong.length === 3) {
        const opts = shuffle([answer, ...wrong], rand);
        qs.push({ kind: "choice", key: `${L}:form:${p.id}:${r}:${c}`, about: `cell:${p.id}:${r}:${c}`, lesson: L, topic: `the forms of «${p.lemma}»`,
          prompt: `Which is the **${what}** of ${of}?`, options: opts, answer: opts.indexOf(answer), greek: true });
      }
      qs.push({ kind: "write", key: `${L}:write:${p.id}:${r}:${c}`, about: `cell:${p.id}:${r}:${c}`, lesson: L, topic: `the forms of «${p.lemma}»`,
        prompt: `Write the **${what}** of ${of}.`, answers: forms });
      // name it: every other place in the table where the form does not appear is a wrong answer
      const elsewhere = shuffle(cells.filter((x) => !x.forms.some((f) => greekKey(f) === greekKey(answer))), rand)
        .map((x) => describeCell(p, x.r, x.c));
      const wrongNames = [...new Set(elsewhere)].slice(0, 3);
      if (wrongNames.length === 3) {
        const right = describeCell(p, r, c);
        const opts = shuffle([right, ...wrongNames], rand);
        qs.push({ kind: "choice", key: `${L}:name:${p.id}:${r}:${c}`, about: `cell:${p.id}:${r}:${c}`, lesson: L, topic: `the forms of «${p.lemma}»`,
          prompt: `What is «${answer}»?`, options: opts, answer: opts.indexOf(right), greek: false });
      }
    }
  }

  // 4. the letters, in the lesson that teaches them
  if (lesson.sections.some((s) => s.kind === "alphabet")) {
    for (const l of LETTERS) {
      const wrong = shuffle(LETTERS.filter((x) => x !== l), rand).slice(0, 3);
      const opts = shuffle([l, ...wrong], rand);
      qs.push({ kind: "choice", key: `${L}:letter:${l.name}`, about: `letter:${l.name}`, lesson: L, topic: "the letters", prompt: `Which letter is **${l.name}**?`,
        options: opts.map((x) => `${x.upper} ${x.lower}`), answer: opts.indexOf(l), greek: true });
      const opts2 = shuffle([l, ...shuffle(LETTERS.filter((x) => x !== l), rand).slice(0, 3)], rand);
      qs.push({ kind: "choice", key: `${L}:letname:${l.name}`, about: `letter:${l.name}`, lesson: L, topic: "the letters", prompt: `What is the letter «${l.lower}» called?`,
        options: opts2.map((x) => x.name), answer: opts2.indexOf(l), greek: false });
    }
  }
  return qs;
}

/** Is a written answer right? Greek letters or the site's transliteration; accents and breathings are not required. */
export function isRightWritten(typed: string, answers: string[]): boolean {
  const t = typed.trim().replace(/\s+/g, " ");
  if (!t || /[*?]/.test(t)) return false;
  const pat = toPattern(t, detectScript(t));
  if ("error" in pat) return false;
  return answers.some((a) => pat.regex.test(greekKey(a)));
}

// ------------------------------------------------------------ building a round
/** Take n questions, spreading them over the kinds of question and over the things asked about. */
function spread(pool: Question[], n: number, rand: Rand): Question[] {
  const groups = new Map<string, Question[]>();
  for (const q of shuffle(pool, rand)) {
    const g = `${q.key.split(":")[1]}:${q.topic}`;
    groups.set(g, [...(groups.get(g) ?? []), q]);
  }
  const lists = shuffle([...groups.values()], rand);
  const out: Question[] = [];
  const asked = new Set<string>();
  while (out.length < n && lists.some((l) => l.length)) {
    for (const l of lists) {
      while (l.length && asked.has(l[0].about)) l.shift();
      if (l.length && out.length < n) { const q = l.shift()!; asked.add(q.about); out.push(q); }
    }
  }
  return shuffle(out, rand);
}

export const earlierLessons = (lesson: Lesson) => LESSONS.slice(0, LESSONS.findIndex((l) => l.id === lesson.id));

export const TEST_LENGTH = 10;

/** Practice: about twelve questions, a third of them from earlier lessons when there are any. */
export function practiceRound(lesson: Lesson, glosses: Record<string, string>, rand: Rand = Math.random): Question[] {
  const own = lessonPool(lesson, glosses, rand);
  const earlier = earlierLessons(lesson).flatMap((l) => lessonPool(l, glosses, rand));
  const back = earlier.length ? 4 : 0;
  const mine = spread(own, 12 - back, rand);
  const asked = new Set(mine.map((q) => q.about));
  return shuffle([...mine, ...spread(earlier.filter((q) => !asked.has(q.about)), back, rand)], rand);
}

/** The test: ten questions on this lesson alone (fewer when the lesson has fewer to ask). */
export function testRound(lesson: Lesson, glosses: Record<string, string>, rand: Rand = Math.random): Question[] {
  return spread(lessonPool(lesson, glosses, rand), TEST_LENGTH, rand);
}

/** The warm-up: three quick questions from earlier lessons (those in `done`, when given), before a new one begins. */
export function warmUp(lesson: Lesson, glosses: Record<string, string>, rand: Rand = Math.random, done?: Set<string>): Question[] {
  const earlier = earlierLessons(lesson).filter((l) => !done || done.has(l.id))
    .flatMap((l) => lessonPool(l, glosses, rand)).filter((q) => q.kind === "choice");
  return spread(earlier, 3, rand);
}

/** The words a round needs meanings for: this lesson's and every earlier one's. */
export const wordsFor = (lesson: Lesson) => [...new Set([...earlierLessons(lesson), lesson].flatMap((l) => l.words))];
