/**
 * The Academy lesson that explains a word's form (Phase 11: learning and reading as one loop). The word look-up
 * shows it under the parsing: "This is a participle: Lesson 15". The choice rests only on the analysis's tag
 * (lib/lookup/postag.ts) and, for εἰμί, its dictionary form, never on guesses about the word's declension; a form
 * no lesson covers yet (a perfect, a numeral) gets no link.
 */
import { LESSONS } from "@/data/lessons";

export interface LessonLink { id: string; n: number; title: string; why: string }

const link = (id: string, why: string): LessonLink | null => {
  const i = LESSONS.findIndex((l) => l.id === id);
  return i < 0 ? null : { id, n: i + 1, title: LESSONS[i].title, why };
};

const CASES: Record<string, string> = { n: "nominative", g: "genitive", d: "dative", a: "accusative", v: "vocative" };

export function lessonFor(tag: string | null | undefined, lemma?: string | null): LessonLink | null {
  if (!tag) return null;
  const [p, , , ten, moo, voi, , cas] = tag.padEnd(9, "-").split("");
  if (lemma?.normalize("NFC") === "εἰμί") return link("to-be", "A form of “to be”");
  if (p === "l") return link("article", "The article, “the”");
  if (p === "v") {
    if (moo === "p") return link("participles", "A participle");
    if (moo === "n") return link("infinitives", "An infinitive");
    if (ten === "f") return link("future", "The future tense");       // before the voice: λύσομαι is a future first
    if (voi === "m" || voi === "p" || voi === "e") return link("middle-passive", `The ${voi === "m" ? "middle" : voi === "p" ? "passive" : "middle or passive"} voice`);
    if (ten === "i" || ten === "a") return link("past-tenses", `The ${ten === "i" ? "imperfect" : "aorist"}, a past tense`);
    if (ten === "p" && voi === "a") return link("present-tense", "The present tense");
    return null;
  }
  if (p === "r") return link("prepositions", "A preposition");
  if (p === "p") return link("pronouns", "A pronoun");
  if (p === "a") return link("adjectives", "An adjective");
  if (p === "n" && CASES[cas]) return link("case", `Why the ${CASES[cas]}?`);
  return null;
}
