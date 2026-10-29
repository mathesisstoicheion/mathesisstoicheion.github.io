import { describe, expect, it } from "vitest";
import { PARADIGMS, askFor, type Ask } from "./paradigms";

const table = (id: string) => PARADIGMS.find((p) => p.id === id)!;
const at = (id: string, row: string, col: string): Ask => {
  const p = table(id);
  return askFor(p, p.rows.indexOf(row), p.cols.indexOf(col));
};
/** the question as the drill prints it */
const words = (a: Ask) => (a.kind === "form" ? `the ${a.what} of ${a.article ? "the article " : ""}${a.of}` : `${a.of} in the ${a.tense}, for “${a.person}”`);

describe("the Endings drill asks for a form as a grammar would", () => {
  it("names a noun's case and number together, without a comma", () => {
    expect(words(at("phylax", "genitive", "plural"))).toBe("the genitive plural of φύλαξ");
  });

  it("spells out gender and number, never masc. or sg", () => {
    expect(words(at("agathos", "genitive", "masc. sg"))).toBe("the masculine genitive singular of ἀγαθός");
    expect(words(at("article", "dative", "fem. pl"))).toBe("the feminine dative plural of the article ὁ");
  });

  it("asks for a participle by its own first form, not by the verb", () => {
    expect(words(at("luon", "dative", "fem. pl"))).toBe("the feminine dative plural of λύων");
  });

  it("asks for a verb's form by its tense and person", () => {
    expect(words(at("luo", "he, she, it", "aorist"))).toBe("λύω in the aorist, for “he, she, it”");
    expect(words(at("luomai", "I", "present"))).toBe("λύω in the present middle and passive, for “I”");
    expect(words(at("luo-inf", "aorist", "passive"))).toBe("the aorist passive infinitive of λύω");
  });

  it("names the column's own verb where a table holds three", () => {
    expect(words(at("contract-present", "we", "τιμάω (honour)"))).toBe("τιμάω in the present, for “we”");
    expect(words(at("contract-imperfect", "they", "δηλόω"))).toBe("δηλόω in the imperfect, for “they”");
  });

  it("never prints an abbreviation or a bare comma between the parts, in any table the drill uses", () => {
    for (const p of PARADIGMS.filter((x) => x.group !== "pronoun"))
      p.rows.forEach((_, r) => p.cols.forEach((_, c) => {
        const w = words(askFor(p, r, c));
        expect(w, `${p.id} ${r} ${c}`).not.toMatch(/\b(sg|pl|masc|fem|neut)\b|\w, (singular|plural|masc)/);
      }));
  });
});
