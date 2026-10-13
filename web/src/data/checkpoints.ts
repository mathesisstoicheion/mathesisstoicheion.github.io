/**
 * Checkpoints: a mixed test after each stretch of lessons, so that earlier lessons are tested together with later
 * ones. Light on purpose (ids and names only), like lesson-index.ts, so the lesson list can show them.
 */
export interface Checkpoint { id: string; numeral: string; title: string; lessons: string[] }

export const CHECKPOINT_GREEK = "ἐξέτασις";   // "examination, scrutiny"

export const CHECKPOINTS: Checkpoint[] = [
  { id: "first-steps", numeral: "I", title: "Letters, case and the article", lessons: ["letters", "marks", "case", "article"] },
  { id: "nouns-and-verbs", numeral: "II", title: "Two declensions, εἰμί and the present", lessons: ["second-declension", "first-declension", "to-be", "present-tense"] },
  { id: "building-sentences", numeral: "III", title: "Metre, prepositions, adjectives, the third declension and the past",
    lessons: ["metre", "prepositions", "adjectives", "third-declension", "past-tenses"] },
  { id: "the-full-verb", numeral: "IV", title: "Voices, participles, infinitives, the future and pronouns",
    lessons: ["middle-passive", "participles", "infinitives", "future", "pronouns"] },
];

/** A checkpoint's record sits beside the lessons' in the Academy's store, under this key. */
export const checkpointKey = (id: string) => `checkpoint:${id}`;
export const checkpointById = (id: string) => CHECKPOINTS.find((c) => c.id === id);
