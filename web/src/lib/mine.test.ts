/**
 * The private collection in the reader (lib/mine.ts) and "Import a text" (lib/import-text.ts). Made-up placeholder text
 * only: no translation may ever be in this repository.
 */
import { describe, expect, it } from "vitest";
import { describe as describeText } from "./catalog";
import { fromPlainText, fromTei, kindOf, newId, teiMeta } from "./import-text";
import { isMine, mineBook, mineHref, mineId, mineParsed } from "./mine";
import { FORMAT, checkTranslation, type TranslationDoc } from "./private-translations";
import { recordVisit, trail, clearTrail } from "./resume";
import { alignChunk, placePieces, translationPieces } from "./tei/align";
import { parseTei } from "./tei/parse";
import { findRef } from "./tei/refs";
import type { Block } from "./tei/types";

const ok = (input: unknown): TranslationDoc => {
  const r = checkTranslation(input);
  if (!r.ok) throw new Error(r.problems.join(" | "));
  return r.doc;
};
const text = (bs: Block[]) => bs.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" / ");

const DOC = ok({
  format: FORMAT, id: "placeholder-one", author: "Placeholder *Author*", title: "Placeholder Work", greekTitle: "Λόγος πρῶτος", status: "draft",
  urn: "urn:cts:greekLit:tlg9999.tlg001", publishedTranslation: "Placeholder published",
  passages: [
    {
      heading: "Placeholder heading *one*", locator: "Placeholder locator",
      rows: [
        { ref: "1.7", label: "1a10", greek: "λόγος ἐστί ⟦ἄλφα⟧", english: "Placeholder *one*.", published: "Published one." },
        { ref: "1.7", greek: "βῆτα\n\nγάμμα", english: "Placeholder two." },
        { ref: "1.8", greek: "δέλτα", english: "Placeholder three.", published: "Published three." },
      ],
    },
    { rows: [{ ref: "2.1", greek: "ἔψιλον\nζῆτα", english: "Placeholder four." }] },
  ],
});

describe("a stored document as a book of the reader", () => {
  it("names the book by its id, and only the Englishes it holds", () => {
    expect(isMine("mine:placeholder-one")).toBe(true);
    expect(isMine("tlg0012.tlg001")).toBe(false);
    expect(mineId("mine:placeholder-one")).toBe("placeholder-one");
    expect(mineHref("placeholder-one")).toBe("/read?w=mine:placeholder-one");
    const { work, author } = mineBook(DOC);
    expect(work.id).toBe("mine:placeholder-one");
    expect(work.title).toBe("Placeholder Work");
    expect(author.name).toBe("Placeholder Author");
    expect(work.texts.map((t) => t.urn)).toEqual(["mine:placeholder-one.grc", "mine:placeholder-one.ours", "mine:placeholder-one.published"]);
    expect(work.texts[0].label).toBe("Λόγος πρῶτος");
    expect(work.texts.map((t) => describeText(t))).toEqual(["Private collection", "Our English", "Published English"]);
    const greekOnly = ok({ format: FORMAT, id: "x", author: "A", title: "T", status: "imported", passages: [{ rows: [{ greek: "α" }] }] });
    expect(mineBook(greekOnly).work.texts.map((t) => t.kind)).toEqual(["edition"]);
  });

  it("numbers rows passage.row when references repeat, with the label or reference as a marker", () => {
    const { doc, placed } = mineParsed(DOC, "ours");
    expect(doc.levels).toEqual(["passage", "row"]);
    expect(doc.units.map((u) => u.ref.join("."))).toEqual(["1.1", "1.2", "1.3", "2.1"]);
    expect(doc.units[0].blocks[0].c[0]).toEqual({ m: "section", n: "1a10" });
    // a reference repeated from the row before is not marked again
    expect(doc.units[1].blocks[0].c[0]).toBe("βῆτα");
    expect(doc.units[2].blocks[0].c[0]).toEqual({ m: "section", n: "1.8" });
    expect(text(doc.units[0].blocks)).toBe("λόγος ἐστί ⟦ἄλφα⟧");
    expect(doc.units[1].blocks.map((b) => b.t)).toEqual(["p", "p"]);
    // a paragraph broken into lines is verse: a line each
    expect(doc.units[3].blocks.map((b) => b.t)).toEqual(["l", "l"]);
    expect(doc.chunks).toEqual([{ label: "1. Placeholder heading one", first: 0, last: 2 }, { label: "Passage 2", first: 3, last: 3 }]);
    expect(findRef(doc, "1a10")).toBe(0);

    const rows = doc.chunks.flatMap((c) => alignChunk(doc, c, placed));
    expect(rows.map((r) => r.key)).toEqual(["1.1", "1.2", "1.3", "2.1"]);
    expect(rows[0].trans[0]).toEqual({ t: "head", c: ["Placeholder heading one"] });
    expect(text(rows[0].trans.slice(1))).toBe("Placeholder one.");
  });

  it("shows the published English where chosen, and the Greek alone with none", () => {
    const pub = mineParsed(DOC, "published");
    const rows = pub.doc.chunks.flatMap((c) => alignChunk(pub.doc, c, pub.placed));
    // as in the reader's other books, English runs on beside the Greek after it that has none of its own
    expect(rows.map((r) => [r.key, text(r.trans)])).toEqual([["1.1", "Placeholder heading one / Published one."], ["1.3", "Published three."], ["2.1", ""]]);
    const none = mineParsed(DOC, null);
    expect(none.placed).toBeNull();
  });

  it("keeps a document's own references when every row has a different one", () => {
    const d = ok({ format: FORMAT, id: "x", author: "A", title: "T", status: "imported",
      passages: [{ heading: "Book 1", rows: [{ ref: "1.1", greek: "α" }, { ref: "1.2", greek: "β" }] }, { rows: [{ ref: "2.1", greek: "γ" }] }] });
    const { doc } = mineParsed(d, null);
    expect(doc.levels).toEqual(["chapter", "section"]);
    expect(doc.units.map((u) => u.ref.join("."))).toEqual(["1.1", "1.2", "2.1"]);
    expect(doc.units[0].blocks[0].c).toEqual(["α"]);
  });

  it("keeps a private book off the list of recent pages", () => {
    const store = new Map<string, string>();
    (globalThis as unknown as { localStorage: unknown }).localStorage = {
      getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v), removeItem: (k: string) => store.delete(k),
    };
    clearTrail();
    recordVisit("/read?w=mine:placeholder-one", "Placeholder");
    recordVisit("/read?w=tlg0012.tlg001&w2=mine:placeholder-one", "Placeholder");
    recordVisit("/read?w=tlg0012.tlg001", "Iliad");
    expect(trail().map((v) => v.href)).toEqual(["/read?w=tlg0012.tlg001"]);
  });
});

describe("importing a text", () => {
  const meta = { title: "Placeholder Title", author: "Placeholder Author" };

  it("makes an id from the title, Greek ones in Latin letters, never one already taken", () => {
    expect(newId("Placeholder Title!", [])).toBe("placeholder-title");
    expect(newId("Placeholder Title", ["placeholder-title", "placeholder-title-2"])).toBe("placeholder-title-3");
    expect(newId("Περὶ ἐθῶν", [])).toBe("peri-ethon");
    expect(newId("???", [])).toBe("text");
  });

  it("pairs plain Greek and English passages in order, marking the extra", () => {
    const r = fromPlainText(meta, "ἄλφα βῆτα\n\nγάμμα *δέλτα*\n\n\nἔψιλον", "Placeholder one.\n\nPlaceholder two.", []);
    if (!r.ok) throw new Error(r.problems.join());
    expect(r.doc.status).toBe("imported");
    expect(r.doc.id).toBe("placeholder-title");
    expect(r.doc.passages[0].rows).toEqual([
      { ref: "1", greek: "ἄλφα βῆτα", english: "Placeholder one." },
      { ref: "2", greek: "γάμμα ∗δέλτα∗", english: "Placeholder two." },
      { ref: "3", greek: "ἔψιλον" },
    ]);
    expect(r.warnings).toEqual(["The Greek has 3 passages and the English 2, so they are paired in order. Check that they line up."]);
    expect(fromPlainText(meta, "  \n ", "", []).ok).toBe(false);
  });

  it("reads a TEI file, with its English lined up, one row per passage", () => {
    const g = parseTei(`<TEI><text><body><div type="edition"><div type="textpart" subtype="chapter" n="1">
      <div type="textpart" subtype="section" n="1"><p>ἄλφα <note>placeholder note</note>βῆτα</p></div>
      <div type="textpart" subtype="section" n="2"><p>γάμμα</p></div></div></div></body></text></TEI>`);
    const t = parseTei(`<TEI><text><body><div type="translation"><div type="textpart" subtype="chapter" n="1">
      <div type="textpart" subtype="section" n="1"><p>Placeholder one.</p></div></div></div></body></text></TEI>`);
    const r = fromTei(meta, { doc: g, placed: placePieces(g, translationPieces(g, t)), trLevels: t.levels }, []);
    if (!r.ok) throw new Error(r.problems.join());
    expect(r.doc.passages.flatMap((p) => p.rows)).toEqual([
      { ref: "1.1", greek: "ἄλφα βῆτα", english: "Placeholder one." },
      { ref: "1.2", greek: "γάμμα" },
    ]);
    // read back in the reader, it keeps the file's own references
    expect(mineParsed(r.doc, null).doc.units.map((u) => u.ref.join("."))).toEqual(["1.1", "1.2"]);
  });

  it("reads what a TEI file says of itself, and tells the kinds of file apart", () => {
    const xml = `<TEI><teiHeader><fileDesc><titleStmt><title xml:lang="eng">Placeholder <hi>Title</hi></title><author>Placeholder Author</author></titleStmt></fileDesc></teiHeader>
      <text><body><div type="edition" n="urn:cts:greekLit:tlg9999.tlg001.placeholder-grc1"></div></body></text></TEI>`;
    expect(teiMeta(xml)).toEqual({ title: "Placeholder Title", author: "Placeholder Author", urn: "urn:cts:greekLit:tlg9999.tlg001" });
    expect(kindOf("a.json", "")).toBe("json");
    expect(kindOf("a", "  <?xml")).toBe("tei");
    expect(kindOf("a.txt", "λόγος")).toBe("text");
  });
});
