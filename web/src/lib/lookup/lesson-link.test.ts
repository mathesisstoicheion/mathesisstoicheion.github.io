import { describe, expect, it } from "vitest";
import { lessonFor } from "./lesson-link";

// tags in the GLAUx/AGDT pattern: part of speech, person, number, tense, mood, voice, gender, case, degree
const CASES: [string, string | null, string | null][] = [
  ["n-s---fa-", "μῆνις", "case"],                 // μῆνιν, Iliad 1.1: an accusative
  ["v2spma---", "ἀείδω", "present-tense"],        // ἄειδε: present imperative active
  ["v3sasm---", "ἀείδω", "middle-passive"],       // a middle form goes to the middle and passive
  ["v3siia---", "λύω", "past-tenses"],            // ἔλυε: imperfect
  ["v3saia---", "λύω", "past-tenses"],            // ἔλυσε: aorist
  ["v-sapamn-", "λύω", "participles"],            // λύσας: participle, before tense or voice
  ["v--pna---", "λύω", null],                     // an infinitive: no lesson yet
  ["v3sfia---", "λύω", null],                     // a future: no lesson yet
  ["v3spia---", "εἰμί", "to-be"],                 // ἐστί
  ["l-s---mn-", "ὁ", "article"],
  ["r--------", "ἐν", "prepositions"],
  ["a-s---fa-", "ἀγαθός", "adjectives"],
  ["p-s---ma-", "αὐτός", null],                    // pronouns: no lesson yet
  ["b--------", "καί", null],
];

describe("the lesson that explains a word's form", () => {
  for (const [tag, lemma, id] of CASES) {
    it(`${lemma} (${tag}) → ${id ?? "none"}`, () => expect(lessonFor(tag, lemma)?.id ?? null).toBe(id));
  }
  it("numbers the lesson as the Academy does, and gives a reason", () => {
    const l = lessonFor("n-s---fa-", "μῆνις")!;
    expect(l.n).toBe(3);
    expect(l.title).toBe("Who does what: the idea of case");
    expect(l.why).toBe("Why the accusative?");
  });
  it("needs a tag", () => expect(lessonFor(null)).toBeNull());
});
