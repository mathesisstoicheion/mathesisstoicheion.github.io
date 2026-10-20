// The eras check (review fix list, slice 6): the site writes its dates one way, BC and AD ("4th c. BC", "AD 160"), never BCE
// and CE. This lists every place a visitor can read BCE or CE:
//   in the built pages (web/out): the words on them and their descriptions for search engines
// (The data files keep the words of their sources, Wikidata and the museums; the site shows them in BC and AD, lib/bc-ad.ts.
// What the library's list shows, after the page has loaded them, is checked by scripts/check-library.mjs.)
// The titles of other people's books and articles keep their own words (ALLOW). It also lists author pages whose
// description gives the same date twice ("Greek orator (4th century BC) (4th c. BC)").
// usage: node web/scripts/check-eras.mjs   (run `npm run build` first; exits with 1 when anything is found)
import fs from "node:fs";
import path from "node:path";

const WEB = path.join(import.meta.dirname, "..");
const OUT = path.join(WEB, "out");
/** BCE or CE as an era: after a number or a century, or "BCE and CE"; not the CE of a web address (%CE%BB) */
export const ERA = /(?<![%\w])BCE\b|(?:\d|centur(?:y|ies)|millennium|BCE and)\s?CE\b/g;
/** published titles, quoted as they are */
export const ALLOW = [/16th century BCE date for the Thera eruption/, /first millennium BCE in the Pamirs/, /Greek historian, c\. 200–c\. 118 BCE/];
const DATED = /\b\d{1,2}(?:st|nd|rd|th)\b[\s/–-]*(?:c\.|centur)|\b\d{2,4}\s?(?:BC|AD)\b|\(\s*(?:c\.\s?)?\d{2,4}/i;

const found = [];
const strip = (html) => html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");
const textOf = (html) => strip(html).replace(/<meta [^>]*content="([^"]*)"[^>]*>/g, " | $1 | ").replace(/<[^>]+>/g, " | ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ");
const scan = (text, where) => {
  for (const m of text.matchAll(ERA)) {
    const context = text.slice(Math.max(0, m.index - 60), m.index + m[0].length + 30).replace(/\s*\|\s*/g, " | ").trim();
    if (ALLOW.some((a) => a.test(context))) continue;
    found.push({ where, context });
  }
};
function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!["_next", "data", "packs", "images", "fonts"].includes(e.name)) yield* walk(p); }
    else if (p.endsWith(".html")) yield p;
  }
}

// one page of each kind is enough where thousands share a template (each work's page has its author's line)
const pages = [...walk(OUT)];
const twins = new Map();
for (const p of pages) {
  const rel = path.relative(OUT, p);
  const html = fs.readFileSync(p, "utf8");
  const text = textOf(html);
  const before = found.length;
  scan(text, rel);
  // the same line on many pages: count it once per page kind
  for (const f of found.splice(before)) { const k = `${rel.split(path.sep)[0]} ${f.context}`; if (!twins.has(k)) { twins.set(k, 1); found.push(f); } }
  if (rel.startsWith(`author${path.sep}`)) {
    const d = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    const who = d.replace(/^[^:]*:\s*/, "").split(/\.\s(?:[\d,]+|One|A) works?\b/)[0];
    // the life's dates close the line in brackets ("Greek orator (4th c. BC)"); the words before them give none
    const lived = who.match(/^(.*)\s\(([^()]*)\)$/);
    if (lived && DATED.test(lived[2]) && DATED.test(lived[1])) found.push({ where: rel, context: `the date twice: "${who}"` });
  }
}
for (const f of found) console.log(`✗ ${f.where}: …${f.context}…`);
console.log(found.length ? `\n${found.length} place(s) with BCE or CE, or a date twice` : `every date is in BC and AD, once (${pages.length} pages)`);
process.exit(found.length ? 1 : 0);
