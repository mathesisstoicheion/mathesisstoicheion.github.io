/**
 * "Import a text" in the reader's private collection (owner's request, 2026-10-14): a text of the moderator's own,
 * brought in from a file or typed in, saved in the same private table as the translations (lib/private-translations-db.ts)
 * as a document of the same format (lib/private-translations.ts) with the status "imported", and read in the reader
 * (lib/mine.ts). Three ways in:
 *  - a translation file (.json, "mathesis-translation/1"), checked as on the shelf;
 *  - a TEI file (.xml), as the libraries publish them: parsed by the reader's own parser, one row per passage, a page per
 *    page of the reader; an English TEI file may come with it, lined up as the reader lines up a translation;
 *  - plain text (a .txt file, or pasted): a blank line between passages, the English (if any) paired with the Greek in order.
 * Nothing here touches the database or the browser's storage, so it is tested on its own (import-text.test.ts).
 */
import { FORMAT, ID_PATTERN, checkTranslation, workOf, type Checked } from "./private-translations";
import type { Parsed } from "./tei/client";
import type { Block, Inline } from "./tei/types";
import { transliterate } from "./translit";

export interface ImportMeta { title: string; author: string; greekTitle?: string; urn?: string }

/** An id for a new text, from its title (Greek titles in Latin letters), not one of those already taken. */
export function newId(title: string, taken: Iterable<string>): string {
  const used = new Set(taken);
  const base = (transliterate(title).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "")) || "text";
  let id = base, n = 2;
  while (used.has(id) || !ID_PATTERN.test(id)) id = `${base}-${n++}`;
  return id;
}

const today = () => new Date().toISOString().slice(0, 10);

/** The parts of a document every import shares. */
function head(meta: ImportMeta, id: string): Record<string, unknown> {
  const doc: Record<string, unknown> = { format: FORMAT, id, author: meta.author.trim(), title: meta.title.trim(), status: "imported", updated: today() };
  if (meta.greekTitle?.trim()) doc.greekTitle = meta.greekTitle.trim();
  if (meta.urn && workOf(meta.urn)) doc.urn = meta.urn;
  return doc;
}

/** Stars and double brackets are the format's markup (italics, added words): in an imported text they are only text. */
const literal = (s: string) => s.replace(/\*/g, "∗").replace(/⟦/g, "[[").replace(/⟧/g, "]]");

/** Split on blank lines: the passages of a plain text. */
const passagesOf = (s: string) => s.replace(/\r\n?/g, "\n").split(/\n[ \t]*\n+/).map((p) => p.trim()).filter(Boolean);

/**
 * Plain text: a blank line between passages; the English, if given, paired with the Greek in order. Passages are
 * numbered 1, 2, 3…, a page of up to 20 to a passage of the document. Returns the check's result, with a warning
 * when the Greek and the English have different numbers of passages.
 */
export function fromPlainText(meta: ImportMeta, greek: string, english: string, taken: Iterable<string>): Checked {
  const g = passagesOf(greek), e = passagesOf(english);
  if (!g.length) return { ok: false, problems: ["There is no Greek text: type or paste it, with a blank line between passages."] };
  const doc = head(meta, newId(meta.title, taken));
  const PAGE = 20;
  const passages: { heading?: string; rows: Record<string, string>[] }[] = [];
  g.forEach((text, i) => {
    if (i % PAGE === 0) passages.push({ ...(g.length > PAGE ? { heading: `${i + 1}–${Math.min(g.length, i + PAGE)}` } : {}), rows: [] });
    const row: Record<string, string> = { ref: String(i + 1), greek: literal(text) };
    if (e[i]) row.english = literal(e[i]);
    passages[passages.length - 1].rows.push(row);
  });
  if (e.length > g.length) passages[passages.length - 1].rows[passages[passages.length - 1].rows.length - 1].english = literal(e.slice(g.length - 1).join("\n\n"));
  doc.passages = passages;
  const out = checkTranslation(doc);
  if (out.ok && e.length && e.length !== g.length) {
    out.warnings.push(`The Greek has ${g.length} passages and the English ${e.length}, so they are paired in order${e.length > g.length ? " and the extra English is added to the last passage" : ""}. Check that they line up.`);
  }
  return out;
}

/** A TEI passage's text: its lines one to a line, its paragraphs with a blank line between (notes and markers left out). */
function textOf(blocks: Block[]): string {
  const line = (c: Inline[]) => c.map((x) => (typeof x === "string" ? x : "gap" in x ? " … " : "")).join("").replace(/\s+/g, " ").trim();
  let out = "";
  blocks.forEach((b, i) => {
    const t = line(b.c);
    if (!t) return;
    if (out) out += b.t === "l" && blocks[i - 1]?.t === "l" && !b.para ? "\n" : "\n\n";
    out += "speaker" in b && b.speaker ? `${b.speaker}: ${t}` : t;
  });
  return literal(out);
}

/**
 * A TEI file, as the reader parsed it (with the English, if one came with it): one row per passage of the file, a passage
 * of the document per page of the reader, references kept as the file gives them.
 */
export function fromTei(meta: ImportMeta, parsed: Parsed, taken: Iterable<string>): Checked {
  const { doc: grc, placed } = parsed;
  if (!grc.units.length) return { ok: false, problems: ["No passages were found in this file: is it a TEI text, like those of the Perseus or First1K libraries?"] };
  const doc = head(meta, newId(meta.title, taken));
  // the English anchored at each Greek passage (every passage keeps its own row, translated or not)
  const at = new Map<number, Block[]>();
  for (const p of placed ?? []) at.set(p.at, [...(at.get(p.at) ?? []), ...p.blocks]);
  doc.passages = grc.chunks.map((c) => ({
    heading: c.label,
    rows: grc.units.slice(c.first, c.last + 1).map((u, k) => {
      const english = textOf(at.get(c.first + k) ?? []);
      return { ref: u.ref.join("."), greek: textOf(u.blocks) || "…", ...(english ? { english } : {}) };
    }),
  }));
  return checkTranslation(doc);
}

/** What a TEI file says of itself: its title, author and CTS urn, as far as they can be read. */
export function teiMeta(xml: string): { title?: string; author?: string; urn?: string } {
  const pick = (re: RegExp) => re.exec(xml)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || undefined;
  const stmt = /<titleStmt[\s>][\s\S]*?<\/titleStmt>/.exec(xml)?.[0] ?? "";
  const urn = /urn:cts:greekLit:([a-z0-9]+\.[a-z0-9]+)/.exec(xml)?.[1];
  return {
    title: (/<title[^>]*>([\s\S]*?)<\/title>/.exec(stmt)?.[1] ?? pick(/<title[^>]*>([\s\S]*?)<\/title>/))?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || undefined,
    author: /<author[^>]*>([\s\S]*?)<\/author>/.exec(stmt)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || undefined,
    urn: urn ? `urn:cts:greekLit:${urn}` : undefined,
  };
}

/** Which way in a chosen file takes, from its name and its first characters. */
export function kindOf(name: string, text: string): "json" | "tei" | "text" {
  const t = text.replace(/^﻿/, "").trimStart();
  if (/\.json$/i.test(name) || t.startsWith("{")) return "json";
  if (/\.xml$/i.test(name) || t.startsWith("<")) return "tei";
  return "text";
}
