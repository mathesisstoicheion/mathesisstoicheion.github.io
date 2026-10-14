/**
 * The private translations' file check and markup (lib/private-translations.ts), and how the markup is drawn
 * (components/admin/Rich.tsx). Made-up placeholder text only: no translation may ever be in this repository.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Rich, { ADDED_NOTE } from "@/components/admin/Rich";
import {
  FORMAT, ID_PATTERN, MAX_FILE_BYTES, canonical, checkTranslation, fileTooBig, hasPublished, isIsoDate, marksAdded,
  parseRich, plainText, readTranslationFile, readerHref, rowName, rowWith, sizeOf, workOf,
  type Passage, type RichNode, type TranslationDoc,
} from "./private-translations";

/** The smallest translation the check accepts. */
const minimal = () => ({
  format: FORMAT,
  id: "placeholder-work",
  author: "Placeholder Author",
  title: "Placeholder Title",
  status: "draft",
  passages: [{ rows: [{ greek: "λόγος ἐστί", english: "Placeholder sentence one." }] }],
});

const ok = (input: unknown): TranslationDoc => {
  const r = checkTranslation(input);
  if (!r.ok) throw new Error(`expected the check to pass, got: ${r.problems.join(" | ")}`);
  return r.doc;
};
const problems = (input: unknown): string[] => {
  const r = checkTranslation(input);
  if (r.ok) throw new Error("expected the check to fail");
  return r.problems;
};
/** A copy of the minimal translation with some fields changed (undefined removes a field). */
const withFields = (changes: Record<string, unknown>) => {
  const d: Record<string, unknown> = { ...minimal(), ...changes };
  for (const k of Object.keys(changes)) if (changes[k] === undefined) delete d[k];
  return d;
};

describe("checking a translation file", () => {
  it("accepts the smallest translation, keeping the file's own object to save as it is", () => {
    const input = minimal();
    const r = checkTranslation(input);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.raw).toBe(input);
    expect(r.warnings).toEqual([]);
    expect(r.doc).toEqual({
      format: FORMAT, id: "placeholder-work", author: "Placeholder Author", title: "Placeholder Title", status: "draft",
      passages: [{ rows: [{ greek: "λόγος ἐστί", english: "Placeholder sentence one." }] }],
    });
  });

  it("keeps every optional field, and drops optional text left empty", () => {
    const doc = ok({
      ...minimal(),
      greekTitle: "Λόγος", updated: "2026-10-13", urn: "urn:cts:greekLit:tlg9999.tlg001", greekEdition: "Placeholder edition",
      publishedTranslation: "", intro: "Placeholder introduction.",
      passages: [{
        heading: "Placeholder heading", locator: "  ",
        rows: [{ ref: " 1.1 ", greek: "λόγος ἐστί", english: "Placeholder sentence one.", published: "Placeholder sentence two." }],
        notes: ["Placeholder note.", ""],
        differences: [{ greek: "λόγος", published: "word", ours: "account", why: "Placeholder reason." }],
      }],
    });
    expect(doc.greekTitle).toBe("Λόγος");
    expect(doc.updated).toBe("2026-10-13");
    expect(doc.urn).toBe("urn:cts:greekLit:tlg9999.tlg001");
    expect(doc.greekEdition).toBe("Placeholder edition");
    expect(doc.intro).toBe("Placeholder introduction.");
    expect("publishedTranslation" in doc).toBe(false);
    const p = doc.passages[0];
    expect(p.heading).toBe("Placeholder heading");
    expect("locator" in p).toBe(false);
    expect(p.rows[0]).toEqual({ ref: "1.1", greek: "λόγος ἐστί", english: "Placeholder sentence one.", published: "Placeholder sentence two." });
    expect(p.notes).toEqual(["Placeholder note."]);
    expect(p.differences).toEqual([{ greek: "λόγος", published: "word", ours: "account", why: "Placeholder reason." }]);
  });

  it("takes a row's label, shown in the margin instead of its reference, and lets rows share a reference", () => {
    const doc = ok({
      ...minimal(),
      urn: "urn:cts:greekLit:tlg9999.tlg001",
      passages: [{
        rows: [
          { ref: "1.7", label: " 1a10 ", greek: "λόγος ἐστί", english: "Placeholder sentence one." },
          { ref: "1.7", label: "1a15", greek: "ἄλφα βῆτα", english: "Placeholder sentence two." },
          { ref: "1.7", greek: "γάμμα", english: "Placeholder sentence three." },
          { label: "only a label", greek: "δέλτα", english: "Placeholder sentence four." },
        ],
      }],
    });
    const rows = doc.passages[0].rows;
    expect(rows.map(rowName)).toEqual(["1a10", "1a15", "1.7", "only a label"]);
    expect(rows[0].ref).toBe("1.7");
    // the reader link still goes by the reference, not the label
    expect(readerHref(doc.urn, rows[0].ref)).toBe("/read?w=tlg9999.tlg001&at=1.7");
    expect(readerHref(doc.urn, rows[3].ref)).toBeNull();
    expect(rowName({ greek: "x", english: "y" })).toBe("");
  });

  it("names a row by its label, else its reference, when something is wrong in it", () => {
    const ps = problems({
      ...minimal(),
      passages: [{
        rows: [
          { ref: "1.7", label: "1a10", greek: "λόγος", english: "Placeholder." },
          { ref: "1.7", label: "1a15", greek: "λόγος" },
          { ref: "2.1", english: "Placeholder." },
          { greek: "λόγος", english: "Placeholder.", label: 7 },
        ],
      }],
    });
    expect(ps).toEqual([
      `Passage 1, row 2 (1a15): our English ("english") is missing.`,
      `Passage 1, row 3 (2.1): the Greek ("greek") is missing.`,
      `Passage 1, row 4: the label ("label") must be text in "quotation marks" (found the number 7).`,
    ]);
  });

  it("says, in plain words, what is missing at the top", () => {
    expect(problems({})).toEqual([
      `The format ("format") is missing: the file should say "format": "${FORMAT}", so the page knows how to read it.`,
      `The id ("id") is missing.`,
      `The author ("author") is missing.`,
      `The title ("title") is missing.`,
      `The status ("status") is missing: it should be "sample", "draft", "complete" or "imported".`,
      `The passages ("passages") are missing: a translation needs at least one passage.`,
    ]);
  });

  it("refuses a wrong format, id or status, and empty or wrongly typed text", () => {
    expect(problems(withFields({ format: "mathesis-translation/2" }))).toEqual([
      `The format ("format") is "mathesis-translation/2", but this page reads only "${FORMAT}".`,
    ]);
    expect(problems(withFields({ id: "Placeholder Work" }))[0]).toMatch(/only lowercase letters, digits and hyphens/);
    expect(problems(withFields({ id: "a".repeat(81) }))).toEqual([`The id ("id") is 81 characters long; it may be at most 80.`]);
    expect(ok(withFields({ id: "a".repeat(80) })).id).toHaveLength(80);
    expect(problems(withFields({ status: "finished" }))).toEqual([
      `The status ("status") must be "sample", "draft", "complete" or "imported" (found "finished").`,
    ]);
    expect(problems(withFields({ title: "   " }))).toEqual([`The title ("title") is empty.`]);
    expect(problems(withFields({ author: 4.1 }))).toEqual([`The author ("author") must be text in "quotation marks" (found the number 4.1).`]);
    expect(problems(withFields({ intro: ["x"] }))).toEqual([
      `The introduction ("intro") must be text in "quotation marks" (found a list in [ square brackets ]).`,
    ]);
  });

  it("checks the passages and their rows", () => {
    expect(problems(withFields({ passages: [] }))).toEqual([`The list of passages ("passages") is empty: a translation needs at least one passage.`]);
    expect(problems(withFields({ passages: {} }))).toEqual([`The passages ("passages") must be a list in [ square brackets ] (found a group of fields in { curly brackets }).`]);
    expect(problems(withFields({ passages: ["x"] }))).toEqual([`Passage 1 must be a group of fields in { curly brackets } (found "x").`]);
    expect(problems(withFields({ passages: [{}] }))).toEqual([`Passage 1 has no rows ("rows"): each passage needs at least one row of Greek and English.`]);
    expect(problems(withFields({ passages: [{ rows: [] }] }))).toEqual([`Passage 1 has no rows ("rows"): each passage needs at least one row of Greek and English.`]);
    expect(problems(withFields({ passages: [{ rows: "λόγος" }] }))).toEqual([
      `Passage 1: the rows ("rows") must be a list in [ square brackets ] (found "λόγος").`,
    ]);
    expect(problems(withFields({ passages: [{ rows: [null] }] }))).toEqual([`Passage 1, row 1 must be a group of fields in { curly brackets } (found nothing (null)).`]);
  });

  it("checks notes and differences", () => {
    const base = { rows: [{ greek: "λόγος", english: "Placeholder." }] };
    expect(problems(withFields({ passages: [{ ...base, notes: ["Placeholder note.", 3] }] }))).toEqual([
      `Passage 1, note 2 must be text in "quotation marks" (found the number 3).`,
    ]);
    expect(problems(withFields({ passages: [{ ...base, notes: "Placeholder note." }] }))).toEqual([
      `Passage 1: the notes ("notes") must be a list in [ square brackets ] (found "Placeholder note.").`,
    ]);
    expect(problems(withFields({ passages: [{ ...base, differences: [{}] }] }))).toEqual([
      `Passage 1, difference 1 is empty: it has none of "greek", "published", "ours" or "why".`,
    ]);
    expect(problems(withFields({ passages: [{ ...base, differences: [{ why: true }] }] }))).toEqual([
      `Passage 1, difference 1: the reason ("why") must be text in "quotation marks" (found the word true).`,
    ]);
    const doc = ok(withFields({ passages: [{ ...base, differences: [{ ours: "Placeholder." }], notes: [] }] }));
    expect(doc.passages[0].differences).toEqual([{ ours: "Placeholder." }]);
    expect("notes" in doc.passages[0]).toBe(false);
  });

  it("ignores fields it does not know, and keeps them in the file's own object", () => {
    const input = { ...minimal(), extra: { anything: 1 }, passages: [{ colour: "red", rows: [{ greek: "λόγος", english: "Placeholder.", tone: 2 }] }] };
    const r = checkTranslation(input);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.doc.passages[0].rows[0]).toEqual({ greek: "λόγος", english: "Placeholder." });
    expect((r.raw as { extra: unknown }).extra).toEqual({ anything: 1 });
  });

  it("warns, without refusing, about an unrecognised urn or a date not written year-month-day", () => {
    const r = checkTranslation(withFields({ urn: "tlg9999.tlg001", updated: "13 October 2026" }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.warnings).toHaveLength(2);
    expect(r.warnings[0]).toMatch(/urn/);
    expect(r.warnings[1]).toMatch(/year-month-day/);
  });

  it("refuses anything that is not one group of fields", () => {
    for (const x of [null, [], "text", 4]) expect(problems(x)[0]).toMatch(/^This file does not hold a translation/);
  });
});

describe("reading a chosen file", () => {
  it("reads JSON, with or without a byte-order mark", () => {
    expect(readTranslationFile(JSON.stringify(minimal())).ok).toBe(true);
    expect(readTranslationFile(`﻿${JSON.stringify(minimal())}`).ok).toBe(true);
  });
  it("says when a file is empty", () => {
    expect(readTranslationFile("  \n")).toEqual({ ok: false, problems: ["This file is empty."] });
  });
  it("says on which line a file stops being JSON", () => {
    const r = readTranslationFile('{\n  "format": "x"\n  "id": "y"\n}');
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.problems).toHaveLength(1);
    expect(r.problems[0]).toMatch(/^This file could not be read: it is not written as valid JSON \(the first mistake is on line 3\)\./);
  });
  it("refuses a file over 5 MB before reading it", () => {
    expect(fileTooBig(MAX_FILE_BYTES)).toBeNull();
    expect(fileTooBig(MAX_FILE_BYTES + 1)).toBe("This file is 5.0 MB. A translation file may be at most 5 MB, so this is probably not the right file.");
    expect(fileTooBig(12.3 * 1024 * 1024)).toMatch(/^This file is 12\.3 MB\./);
  });
});

describe("small helpers", () => {
  it("counts passages and rows in words", () => {
    expect(sizeOf(ok(minimal()))).toBe("1 passage, 1 row");
    const two = ok(withFields({ passages: [minimal().passages[0], { rows: [{ greek: "α", english: "a" }, { greek: "β", english: "b" }] }] }));
    expect(sizeOf(two)).toBe("2 passages, 3 rows");
  });
  it("knows whether any row carries the published English, or any words marked as added", () => {
    expect(hasPublished(ok(minimal()))).toBe(false);
    expect(hasPublished(ok(withFields({ passages: [{ rows: [{ greek: "α", english: "a", published: "b" }] }] })))).toBe(true);
    expect(marksAdded(ok(minimal()))).toBe(false);
    expect(marksAdded(ok(withFields({ passages: [{ rows: [{ greek: "λόγος ⟦ἐστί⟧", english: "a" }] }] })))).toBe(true);
  });
  it("tells a year-month-day date", () => {
    expect(isIsoDate("2026-10-13")).toBe(true);
    expect(isIsoDate("2026-13-45")).toBe(false);
    expect(isIsoDate("13 October 2026")).toBe(false);
    expect(isIsoDate(undefined)).toBe(false);
  });
  it("uses the same rule for ids as the database", () => {
    expect(ID_PATTERN.test("placeholder-work-2")).toBe(true);
    for (const bad of ["", "Placeholder", "place holder", "placé", "a_b", "a".repeat(81)]) expect(ID_PATTERN.test(bad), bad).toBe(false);
  });
  it("finds the work and edition in a urn, and links into the site's reader", () => {
    expect(workOf("urn:cts:greekLit:tlg9999.tlg001")).toEqual({ work: "tlg9999.tlg001", ed: null });
    expect(workOf(" urn:cts:greekLit:tlg9999.tlg001.placeholder-grc1 ")).toEqual({ work: "tlg9999.tlg001", ed: "placeholder-grc1" });
    expect(workOf("tlg9999.tlg001")).toBeNull();
    expect(workOf(undefined)).toBeNull();
    expect(readerHref("urn:cts:greekLit:tlg9999.tlg001.placeholder-grc1", "1.7")).toBe("/read?w=tlg9999.tlg001&ed=placeholder-grc1&at=1.7");
    expect(readerHref("urn:cts:greekLit:tlg9999.tlg001", "Book 1")).toBe("/read?w=tlg9999.tlg001&at=Book%201");
    expect(readerHref("urn:cts:greekLit:tlg9999.tlg001", "  ")).toBeNull();
    expect(readerHref(undefined, "1.7")).toBeNull();
  });
  it("puts a stored translation's fields back in the format's order for Download, keeping unknown ones", () => {
    const stored = {
      extra: 1, passages: [{ notes: ["n"], rows: [{ tone: 2, english: "a", greek: "α", label: "l", ref: "1" }], heading: "h" }],
      status: "draft", title: "t", author: "a", id: "i", format: FORMAT,
    };
    const out = canonical(stored) as Record<string, unknown> & { passages: Record<string, unknown>[] };
    expect(Object.keys(out)).toEqual(["format", "id", "author", "title", "status", "passages", "extra"]);
    expect(Object.keys(out.passages[0])).toEqual(["heading", "rows", "notes"]);
    expect(Object.keys((out.passages[0].rows as object[])[0])).toEqual(["ref", "label", "greek", "english", "tone"]);
    expect(canonical("text")).toBe("text");
    expect(JSON.stringify(canonical(stored)).length).toBe(JSON.stringify(stored).length);
  });
});

// ------------------------------------------------------------ the markup
/** The marks as a short string, to compare: [i:…], [+:…] for added words, / for a line break. */
const show = (ns: RichNode[]): string => ns.map((n) => (n.k === "text" ? n.s : n.k === "br" ? "/" : `[${n.k === "i" ? "i" : "+"}:${show(n.c)}]`)).join("");
const paras = (src: string | undefined) => parseRich(src).map(show);

describe("the light markup", () => {
  it("splits paragraphs at blank lines, keeps single line breaks, and trims", () => {
    expect(paras(undefined)).toEqual([]);
    expect(paras("")).toEqual([]);
    expect(paras("  Placeholder one.  ")).toEqual(["Placeholder one."]);
    expect(paras("Placeholder one.\n\nPlaceholder two.")).toEqual(["Placeholder one.", "Placeholder two."]);
    expect(paras("Placeholder one.\r\n \t\r\nPlaceholder two.\n\n\n")).toEqual(["Placeholder one.", "Placeholder two."]);
    expect(paras("line one\nline two")).toEqual(["line one/line two"]);
  });
  it("reads *words* as italics, and leaves a lone or doubled star as it is", () => {
    expect(paras("a *placeholder* word")).toEqual(["a [i:placeholder] word"]);
    expect(paras("*two words*")).toEqual(["[i:two words]"]);
    expect(paras("2 * 3 * 4")).toEqual(["2 * 3 * 4"]);
    expect(paras("a *lone star")).toEqual(["a *lone star"]);
    expect(paras("**not bold**")).toEqual(["**not bold**"]);
  });
  it("reads ⟦words⟧ as added later, inside or around italics, and leaves an unclosed bracket as it is", () => {
    expect(paras("λόγος ⟦ἐστί⟧")).toEqual(["λόγος [+:ἐστί]"]);
    expect(paras("⟦a *placeholder* word⟧")).toEqual(["[+:a [i:placeholder] word]"]);
    expect(paras("λόγος ⟦ἐστί")).toEqual(["λόγος ⟦ἐστί"]);
    expect(paras("λόγος⟧ ἐστί")).toEqual(["λόγος⟧ ἐστί"]);
    expect(paras("⟦⟧")).toEqual(["⟦⟧"]);
  });
  it("never reads HTML: the text stays text", () => {
    expect(paras("<b>placeholder</b>")).toEqual(["<b>placeholder</b>"]);
  });
  it("gives the bare words for matching", () => {
    expect(plainText(" ⟦λόγος⟧\n *ἐστί*  ")).toBe("λόγος ἐστί");
  });
});

describe("finding the row a difference speaks of", () => {
  const p: Passage = {
    rows: [
      { greek: "λόγος ἐστί", english: "Placeholder one." },
      { greek: "ἄλφα ⟦βῆτα⟧ γάμμα δέλτα", english: "Placeholder two." },
    ],
  };
  it("matches the words as written, or without accents, or with words left out between", () => {
    expect(rowWith(p, "λόγος")).toBe(0);
    expect(rowWith(p, "βῆτα γάμμα")).toBe(1);
    expect(rowWith(p, "βητα γαμμα")).toBe(1);
    expect(rowWith(p, "ἄλφα … δέλτα")).toBe(1);
    expect(rowWith(p, "ἄλφα ... δέλτα")).toBe(1);
  });
  it("gives -1 when no row holds them, or there are no words", () => {
    expect(rowWith(p, "ὠμέγα")).toBe(-1);
    expect(rowWith(p, "δέλτα … ἄλφα")).toBe(-1);
    expect(rowWith(p, undefined)).toBe(-1);
    expect(rowWith(p, " … ")).toBe(-1);
  });
});

describe("drawing the markup (Rich)", () => {
  const html = (text: string, inline = false) => renderToStaticMarkup(createElement(Rich, { text, inline }));
  it("draws paragraphs, line breaks and italics", () => {
    expect(html("Placeholder *one*.\nPlaceholder two.\n\nPlaceholder three.")).toBe(
      "<p>Placeholder <i>one</i>.<br/>Placeholder two.</p><p>Placeholder three.</p>",
    );
    expect(html("Placeholder one.\n\nPlaceholder two.", true)).toBe("Placeholder one.<br/>Placeholder two.");
  });
  it("draws added words fainter between brackets, explained on hover and to screen readers", () => {
    const out = html("λόγος ⟦ἐστί⟧");
    expect(out).toContain(`title="${ADDED_NOTE}"`);
    expect(out).toContain(`<span class="visually-hidden" lang="en">(${ADDED_NOTE.toLowerCase()}:) </span>`);
    expect(out).toMatch(/<span[^>]*aria-hidden="true"[^>]*>⟦<\/span>ἐστί<span[^>]*aria-hidden="true"[^>]*>⟧<\/span>/);
  });
  it("escapes anything that looks like HTML", () => {
    expect(html("<script>placeholder</script>")).toBe("<p>&lt;script&gt;placeholder&lt;/script&gt;</p>");
  });
  it("draws nothing for no text", () => {
    expect(renderToStaticMarkup(createElement(Rich, { text: undefined }))).toBe("");
  });
});
