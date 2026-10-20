// The names check (review fix list, slice 2: "one name per thing"). Every room has one English name, one Greek name and
// one plain word (config/areas.ts); this lists every place a visitor can read an old or other name for one:
//   in the built pages (web/out): their tab titles, and the words on them (not the scripts inside them)
//   in the source: words in quotes or between tags in .tsx/.ts files under src/ (text that only appears after a click,
//   such as the search's group labels, is not in the built pages)
// Words that only describe a thing in passing ("the town hall of Athens", "a store of words") are not names; each alias
// below is written to catch a name, and ALLOW lists the few phrases that are not.
// usage: node web/scripts/check-names.mjs [--list]   (run `npm run build` first; exits with 1 when anything is found)
import fs from "node:fs";
import path from "node:path";

const WEB = path.join(import.meta.dirname, "..");
const OUT = path.join(WEB, "out"), SRC = path.join(WEB, "src");
const list = process.argv.includes("--list");

// [room, what to look for, why it is wrong]
export const ALIASES = [
  ["forum", /\bTown[ -]Hall\b/g, "the forum is the Agora"],
  ["forum", /\b[Tt]he forum\b/g, "the forum is the Agora"],
  ["forum", /(?<![\w-])Forum\b/g, "the forum is the Agora"],
  ["treasury", /\bMy Library\b/g, "your saved things are the Treasury"],
  ["treasury", /(?:^|[>›·|"]\s*)Mine(?=\s*(?:$|[<›·|"]))/gm, "your saved things are the Treasury"],
  ["treasury", /θησαυρός/g, "the room's Greek name is capitalised: Θησαυρός"],
  ["reader", /\bThe Scroll\b(?! Case)/g, "the reader is \"the reader\""],
  ["search", /\bThe Oracle\b(?![^<]{0,40}Μαντεῖον)/g, "the Oracle carries its Greek name, Μαντεῖον"],
  ["wiki", /\bWiki\b/g, "the wiki is the Painted Stoa"],
];
// phrases that use an alias's words but are not a name for a room
export const ALLOW = [
  /town hall of [A-Z]/i, /Forum Classicum/, /\bwiki(pedia|source|data|tionary)/i, /Mine:/,
];

const strip = (html) => html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");
const textOf = (html) => strip(html).replace(/<[^>]+>/g, (t) => (/^<(title|\/title)/.test(t) ? t : " | ")).replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ");

function* walk(dir, ext) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!["_next", "data", "packs", "images", "fonts", "node_modules"].includes(e.name)) yield* walk(p, ext); }
    else if (ext.some((x) => p.endsWith(x))) yield p;
  }
}

const hits = new Map();   // "room · why · form" -> [{ where, context }]
const add = (room, why, form, where, context) => {
  const k = `${room} · ${why} · "${form}"`;
  if (!hits.has(k)) hits.set(k, []);
  hits.get(k).push({ where, context });
};
const scan = (text, where) => {
  for (const [room, re, why] of ALIASES) {
    for (const m of text.matchAll(re)) {
      const context = text.slice(Math.max(0, m.index - 50), m.index + m[0].length + 50).replace(/\s*\|\s*/g, " | ").trim();
      if (ALLOW.some((a) => a.test(context))) continue;
      add(room, why, m[0].replace(/^[>›·|"]\s*/, "").trim(), where, context);
    }
  }
};

if (!fs.existsSync(OUT)) { console.error("web/out does not exist: run `npm run build` first"); process.exit(2); }
// the built pages: one of each kind is enough for the thousands of work and author pages, which share their words
const seenKinds = new Set();
for (const f of walk(OUT, [".html"])) {
  const rel = "/" + path.relative(OUT, f).replace(/\.html$/, "").replace(/(^|\/)index$/, "");
  const kind = rel.replace(/^\/(work|author)\/.*/, "/$1/*");
  if (kind !== rel && seenKinds.has(kind)) continue;
  seenKinds.add(kind);
  scan(textOf(fs.readFileSync(f, "utf8")), `page ${rel}`);
}
// the source: words between tags, and words in quotes (comments are left out)
for (const f of walk(SRC, [".tsx", ".ts"])) {
  const code = fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " ")).replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
  const strings = [...code.matchAll(/"([^"\n]*)"|`([^`]*)`|'([^'\n]*)'|>([^<>{}\n]+)</g)].map((m) => m[1] ?? m[2] ?? m[3] ?? m[4]);
  const rel = "src/" + path.relative(SRC, f);
  for (const s of strings) if (s && /[A-Za-zΑ-ω]/.test(s) && !/^[\w./@-]+$/.test(s)) scan(`"${s}"`, `source ${rel}`);
}

let total = 0;
for (const [k, v] of [...hits].sort()) {
  total += v.length;
  console.log(`✗ ${k}: ${v.length}`);
  const shown = list ? v : v.slice(0, 4);
  for (const h of shown) console.log(`    ${h.where}: …${h.context}…`);
  if (!list && v.length > shown.length) console.log(`    … and ${v.length - shown.length} more (--list shows all)`);
}
console.log(total ? `\n${total} place(s) with another name for a room` : "every room has one name");
process.exit(total ? 1 : 0);
