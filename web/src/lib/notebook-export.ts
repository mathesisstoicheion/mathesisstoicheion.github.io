/**
 * A notebook written out: as a document (HTML, which any browser and word processor opens, and prints to
 * PDF), as Markdown, as a spreadsheet (CSV), or as its citations alone. Each thing gathered carries its
 * citation in the chosen style, and the document ends with the editions cited, as their files describe them.
 */
import { describe as describeText, versionOf, type CatalogIndex } from "@/lib/catalog";
import { COLLECTIONS } from "@/config/sources";
import { cite, type Abbrev, type Citable, type CiteStyle } from "./cite";
import { toCsv } from "./search/kwic";
import type { NbItem, Notebook } from "./notebooks";

export interface ExportCtx { idx: CatalogIndex; abbrevs: Abbrev | null; style: CiteStyle; origin: string; now?: Date }

/** What an item cites, or null (a paragraph of one's own). */
export function citableOf(it: NbItem): Citable | null {
  if (it.kind === "text") return null;
  return { work: it.work, urn: it.urn, from: it.from, to: it.kind === "passage" ? it.to : undefined };
}

/** The item's place in the reader on this site. */
export function linkOf(it: NbItem, origin: string): string {
  if (it.kind === "text") return "";
  const q = new URLSearchParams({ w: it.work, ed: versionOf(it.urn), at: it.from });
  if (it.kind === "variant") q.set("cmp", versionOf(it.other));
  return `${origin}/read?${q}`;
}

export function citationOf(it: NbItem, c: ExportCtx): string {
  const x = citableOf(it);
  return x ? cite(c.idx, x, c.style, c.abbrevs, linkOf(it, c.origin), c.now) : "";
}

/** An edition named short: "Smyth, 1926" (without the file's own name in brackets). */
const edName = (idx: CatalogIndex, urn: string) => { const t = idx.text.get(urn); return t ? describeText(t).replace(/\s*\([^)]*\)$/, "") : urn; };

/** The editions cited, once each: author, title, the edition as described in its file, the collection, the CTS URN. */
export function editionsCited(nb: Notebook, idx: CatalogIndex): string[] {
  const urns = new Set<string>();
  for (const it of nb.items) if (it.kind !== "text") { urns.add(it.urn); if (it.kind === "variant") urns.add(it.other); }
  return [...urns].map((urn) => {
    const t = idx.text.get(urn), work = urn.split(":")[3]?.split(".").slice(0, 2).join(".") ?? "";
    const col = COLLECTIONS.find((c) => c.id === t?.col);
    return [`${idx.authorOf.get(work)?.name ?? ""}, *${idx.work.get(work)?.title ?? work}*.`, t?.desc?.trim() ?? "", col ? `${col.name} (${col.licence}).` : "", `${urn}.`]
      .filter(Boolean).join(" ");
  }).sort();
}

/** The body of an item: the Greek, the translation, the concordance line, the two readings. */
function bodyOf(it: NbItem, c: ExportCtx): { greek?: string; english?: string; line?: [string, string, string]; readings?: [string, string, string, string] } {
  if (it.kind === "passage") return { greek: it.grc, english: it.tr };
  if (it.kind === "line") return { line: [it.left, it.match, it.right] };
  if (it.kind === "variant") return { readings: [edName(c.idx, it.urn), it.a, edName(c.idx, it.other), it.b] };
  return {};
}

export function toMarkdown(nb: Notebook, c: ExportCtx): string {
  const out = [`# ${nb.title}`, ""];
  for (const it of nb.items) {
    if (it.kind === "text") { out.push(it.text, ""); continue; }
    const b = bodyOf(it, c);
    out.push(`**${citationOf(it, c)}**`, "");
    if (b.greek) out.push(`> ${b.greek}`, "");
    if (b.english) out.push(`> *${b.english}*`, "");
    if (b.line) out.push(`> …${b.line[0]} **${b.line[1]}** ${b.line[2]}…`, "");
    if (b.readings) out.push(`> ${b.readings[1]} (${b.readings[0]}) ] ${b.readings[3]} (${b.readings[2]})`, "");
    if (it.kind === "line" && it.grammar) out.push(`Grammar (GLAUx): ${it.grammar}`, "");
    if (it.note) out.push(it.note, "");
  }
  const eds = editionsCited(nb, c.idx);
  if (eds.length) out.push("## Editions cited", "", ...eds.map((e) => `- ${e}`), "");
  out.push(`*From Mathesis Stoicheion (${c.origin}), ${(c.now ?? new Date()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Texts: Perseus Digital Library and First Thousand Years of Greek, CC BY-SA 4.0.*`);
  return out.join("\n");
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** *italics* and **bold** of the Markdown into HTML (after escaping). */
const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>");

export function toHtml(nb: Notebook, c: ExportCtx): string {
  const parts: string[] = [];
  for (const it of nb.items) {
    if (it.kind === "text") { parts.push(`<p class="own">${inline(it.text).replace(/\n/g, "<br>")}</p>`); continue; }
    const b = bodyOf(it, c);
    parts.push(`<section><p class="cite">${inline(citationOf(it, c))}</p>`
      + (b.greek ? `<blockquote lang="grc">${esc(b.greek)}</blockquote>` : "")
      + (b.english ? `<blockquote class="tr">${esc(b.english)}</blockquote>` : "")
      + (b.line ? `<blockquote lang="${it.kind === "line" && it.lang === "eng" ? "en" : "grc"}">…${esc(b.line[0])} <b>${esc(b.line[1])}</b> ${esc(b.line[2])}…</blockquote>` : "")
      + (b.readings ? `<blockquote><span lang="grc">${esc(b.readings[1])}</span> (${esc(b.readings[0])}) ] <span lang="grc">${esc(b.readings[3])}</span> (${esc(b.readings[2])})</blockquote>` : "")
      + (it.kind === "line" && it.grammar ? `<p class="small">Grammar (GLAUx): ${esc(it.grammar)}</p>` : "")
      + (it.note ? `<p class="note">${inline(it.note).replace(/\n/g, "<br>")}</p>` : "")
      + "</section>");
  }
  const eds = editionsCited(nb, c.idx);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(nb.title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body { max-width: 46rem; margin: 2rem auto; padding: 0 1rem; font: 17px/1.6 Georgia, "Times New Roman", serif; color: #1b1410; }
h1 { font-weight: 400; font-size: 2rem; margin-bottom: 1.5rem; }
h2 { font-weight: 400; font-size: 1.3rem; margin-top: 2.5rem; border-top: 1px solid #ccc; padding-top: 1rem; }
section { margin: 0 0 1.6rem; }
.cite { margin: 0 0 .4rem; font-weight: 600; }
blockquote { margin: .3rem 0 .3rem 1.2rem; }
[lang="grc"] { font-family: "GFS Didot", "Gentium Book Plus", "Noto Serif", Georgia, serif; font-size: 1.12em; }
.tr { color: #4a3a2e; font-style: italic; }
.note, .own { margin: .5rem 0; }
.small, footer { font-size: .85rem; color: #6b5a4c; }
ul { padding-left: 1.2rem; }
@media print { body { margin: 0; } a { color: inherit; } }
</style></head><body>
<h1>${esc(nb.title)}</h1>
${parts.join("\n")}
${eds.length ? `<h2>Editions cited</h2><ul>${eds.map((e) => `<li>${inline(e)}</li>`).join("")}</ul>` : ""}
<footer><p>From Mathesis Stoicheion (${esc(c.origin)}), ${(c.now ?? new Date()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Texts: Perseus Digital Library and First Thousand Years of Greek, CC BY-SA 4.0.</p></footer>
</body></html>`;
}

export function toSheet(nb: Notebook, c: ExportCtx): string {
  const rows: (string | number)[][] = [["Kind", "Citation", "Greek or match", "Translation or context", "Note", "Link"]];
  for (const it of nb.items) {
    const b = bodyOf(it, c);
    if (it.kind === "text") rows.push(["Paragraph", "", "", "", it.text, ""]);
    else rows.push([
      { passage: "Passage", line: "Concordance line", variant: "Difference between editions" }[it.kind], citationOf(it, c).replace(/\*/g, ""),
      b.greek ?? (b.line ? b.line[1] : b.readings ? `${b.readings[1]} ] ${b.readings[3]}` : ""),
      b.english ?? (b.line ? `${b.line[0]} … ${b.line[2]}` : b.readings ? `${b.readings[0]} ] ${b.readings[2]}` : ""),
      it.note ?? "", linkOf(it, c.origin),
    ]);
  }
  return toCsv(rows);
}

/** The citations alone, one a line, in the order of the notebook (italics left as *asterisks*). */
export function citationsOnly(nb: Notebook, c: ExportCtx): string {
  return nb.items.filter((it) => it.kind !== "text").map((it) => citationOf(it, c)).join("\n");
}
