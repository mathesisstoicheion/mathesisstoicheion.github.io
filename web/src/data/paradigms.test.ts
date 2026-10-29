import { describe, expect, it } from "vitest";
import { PARADIGMS, askFor, formsOf, whatIs, wrongForms, type Ask } from "./paradigms";
import { fold } from "@/lib/catalog";

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

describe("the Endings drill's other choices", () => {
  it("are never a form that is right for the cell asked for (φύλαξιν as well as φύλαξι, βασιλῆς as well as βασιλεῖς)", () => {
    const wrong: string[] = [];
    for (const p of PARADIGMS.filter((x) => x.group !== "pronoun")) p.cells.forEach((row, r) => row.forEach((cell, c) => {
      const right = formsOf(cell).map(fold);
      for (const f of wrongForms(p, r, c)) if (right.includes(fold(f))) wrong.push(`${p.id} ${p.rows[r]} ${p.cols[c]}: ${f}`);
    }));
    expect(wrong).toEqual([]);
  });

  it("are the table's other forms", () => {
    const p = table("phylax");
    expect(wrongForms(p, p.rows.indexOf("genitive"), p.cols.indexOf("plural"))).toContain("φύλακος");
    expect(wrongForms(p, p.rows.indexOf("genitive"), p.cols.indexOf("plural"))).not.toContain("φυλάκων");
  });
});

describe("a wrong answer is named for what it is", () => {
  const asked = (id: string, row: string, col: string) => at(id, row, col);
  it("in the same table: its case and number, or its tense and person", () => {
    expect(whatIs(table("phylax"), "φύλακος", asked("phylax", "genitive", "plural"))).toBe("the genitive singular");
    expect(whatIs(table("luo"), "ἔλυσας", asked("luo", "we", "aorist"))).toBe("the aorist, for “you (one)”");
  });

  it("names another verb of the table by its own dictionary form", () => {
    expect(whatIs(table("contract-present"), "τιμῶσι", asked("contract-present", "they", "ποιέω (make, do)"))).toBe("τιμάω in the present, for “they”");
  });

  it("names every cell a form fills, together, and the vocative only when it is nothing else", () => {
    expect(whatIs(table("article"), "τοῦ", asked("article", "dative", "fem. sg"))).toBe("the masculine or neuter genitive singular");
    expect(whatIs(table("luomenos"), "λυομένων", asked("luomenos", "dative", "fem. pl"))).toBe("the masculine, feminine or neuter genitive plural");
    expect(whatIs(table("doron"), "δῶρον", asked("doron", "genitive", "plural"))).toBe("the nominative or accusative singular");
    expect(whatIs(table("luo-inf"), "λύεσθαι", asked("luo-inf", "aorist", "active"))).toBe("the present middle or passive infinitive");
    expect(whatIs(table("contract-imperfect"), "ἐποίουν", asked("contract-imperfect", "I", "δηλόω"))).toBe("ποιέω in the imperfect, for “I” or “they”");
    expect(whatIs(table("basileus"), "βασιλεῖς", asked("basileus", "accusative", "plural"))).toBe("the nominative plural");
    expect(whatIs(table("basileus"), "βασιλεῦ", asked("basileus", "accusative", "plural"))).toBe("the vocative singular");
  });
});
