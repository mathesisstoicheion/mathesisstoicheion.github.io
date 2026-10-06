/**
 * A concordance line ("key word in context", as concordances have long been printed): the words before a
 * match, the match, and the words after, read from the text itself and running on into the passages
 * either side when the match is near the start or end of its own. Line ends of verse are shown as " / ".
 */
import { GREEK_WORD, isGreekWord } from "@/lib/greek";
import type { TeiDoc } from "@/lib/tei/types";
import { englishKey, greekKey } from "./codec";

const ENGLISH_WORD = /([A-Za-z]+(?:[’'][a-z]+)?)/;

interface Tok { t: string; w?: number }

/** A passage as words and what lies between them; w counts the words, as the search index does. */
function tokens(doc: TeiDoc, unit: number, lang: "grc" | "eng"): Tok[] {
  const u = doc.units[unit];
  if (!u) return [];
  const re = lang === "grc" ? GREEK_WORD : ENGLISH_WORD;
  const isWord = lang === "grc" ? isGreekWord : (s: string) => /^[A-Za-z]/.test(s);
  const out: Tok[] = [];
  let n = 0;
  u.blocks.forEach((b) => {
    if (!b.c.some((x) => typeof x === "string" && x.trim())) return;
    if (out.length) out.push({ t: b.t === "l" ? " / " : " " });
    for (const x of b.c) {
      if (typeof x !== "string") continue;
      for (const s of x.split(re)) {
        if (!s) continue;
        if (isWord(s)) out.push({ t: s, w: n++ });
        else out.push({ t: s.replace(/\s+/g, " ") });
      }
    }
  });
  return out;
}

export interface Bit { t: string; near?: boolean }
export interface KwicLine {
  /** the words before and after, in pieces: a piece is marked when it is the other word of a "near" search */
  left: Bit[]; key: string; right: Bit[];
  leftText: string; rightText: string;
  /** for sorting: the match, and the words either side of it, as search keys */
  keySort: string; leftSort: string; rightSort: string;
}

/** The concordance line for a match of the given words (positions in the passage), with about n words each side. */
export function kwic(doc: TeiDoc, unit: number, words: number[], lang: "grc" | "eng", n = 8, also: number[] = []): KwicLine | null {
  const here = tokens(doc, unit, lang);
  const first = Math.min(...words), last = Math.max(...words);
  const a = here.findIndex((t) => t.w === first), b = here.findIndex((t) => t.w === last);
  if (a < 0 || b < 0) return null;
  const sortKey = lang === "grc" ? greekKey : englishKey;

  // before: back through this passage, then the ones before it, until n words
  const before: Tok[] = [];
  let count = 0;
  for (let u = unit, list = here.slice(0, a); count < n && u >= 0 && unit - u <= 6; list = tokens(doc, --u, lang)) {
    if (u !== unit && list.length) list = [...list, { t: lang === "grc" && doc.units[u + 1]?.blocks[0]?.t === "l" ? " / " : " " }];
    for (let i = list.length - 1; i >= 0 && count < n; i--) { before.unshift(list[i]); if (list[i].w !== undefined) count++; }
    if (u === 0) break;
  }
  const after: Tok[] = [];
  count = 0;
  for (let u = unit, list = here.slice(b + 1); count < n && u < doc.units.length && u - unit <= 6; list = tokens(doc, ++u, lang)) {
    if (u !== unit && list.length) list = [{ t: lang === "grc" && doc.units[u]?.blocks[0]?.t === "l" ? " / " : " " }, ...list];
    for (let i = 0; i < list.length && count < n; i++) { after.push(list[i]); if (list[i].w !== undefined) count++; }
  }
  // the punctuation right after the last word belongs with it
  while (after.length && after[after.length - 1].w === undefined && !/[.,;·:!?;]/.test(after[after.length - 1].t)) after.pop();
  const text = (ts: Tok[]) => ts.map((t) => t.t).join("").replace(/\s+/g, " ");
  // pieces: runs of plain text, and the near word on its own (only words of this passage can be it)
  const ownBefore = new Set(here.slice(0, a)), ownAfter = new Set(here.slice(b + 1));
  const bits = (ts: Tok[], own: Set<Tok>): Bit[] => {
    const out: Bit[] = [];
    for (const t of ts) {
      if (t.w !== undefined && own.has(t) && also.includes(t.w)) out.push({ t: t.t, near: true });
      else if (out.length && !out[out.length - 1].near) out[out.length - 1].t += t.t;
      else out.push({ t: t.t });
    }
    return out.map((x) => (x.near ? x : { t: x.t.replace(/\s+/g, " ") }));
  };
  const firstWord = (ts: Tok[]) => ts.find((t) => t.w !== undefined)?.t ?? "";
  const lastWord = (ts: Tok[]) => [...ts].reverse().find((t) => t.w !== undefined)?.t ?? "";
  const keyToks = here.slice(a, b + 1);
  return {
    // (the space between the words before and the match is the page's to draw: right-to-left setting would lose it)
    left: trimEnds(trimEnds(bits(before, ownBefore), "start"), "end"), key: text(keyToks), right: trimEnds(bits(after, ownAfter), "end"),
    leftText: text(before).trim(), rightText: text(after).trimEnd(),
    keySort: keyToks.filter((t) => t.w !== undefined).map((t) => sortKey(t.t)).join(" "),
    leftSort: sortKey(lastWord(before)), rightSort: sortKey(firstWord(after)),
  };
}

const trimEnds = (bs: Bit[], side: "start" | "end") => {
  if (!bs.length) return bs;
  bs = [...bs];
  const i = side === "start" ? 0 : bs.length - 1;
  if (!bs[i].near) bs[i] = { t: side === "start" ? bs[i].t.trimStart() : bs[i].t.trimEnd() };
  return bs;
};

/** A table of rows as CSV, which spreadsheet programs open (with the mark that tells Excel it is UTF-8, for the Greek). */
export function toCsv(rows: (string | number)[][]): string {
  const cell = (v: string | number) => {
    const s = String(v);
    return /[",\r\n]/.test(s) || /^[=+\-@]/.test(s) ? `"${(/^[=+\-@]/.test(s) ? "'" : "") + s.replace(/"/g, '""')}"` : s;
  };
  return String.fromCharCode(0xfeff) + rows.map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}
