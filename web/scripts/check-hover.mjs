// The hover check. A phone has no pointer to rest on a button, so a phone's browser takes a tap for the hand arriving and
// keeps the button "under the hand" until the next tap elsewhere: a chip, a choice or a sign that turns red under the hand
// stays red after it is tapped, as if it were still chosen (the reader work found it, 2026-10-31). So every :hover rule of
// the site's CSS sits inside @media (hover: hover), which a computer with a mouse matches and a phone does not; what is
// chosen, or has the keyboard's focus, shows itself by its own rules, outside it.
// usage: node web/scripts/check-hover.mjs   (reads web/src; exits with 1 when a :hover rule is outside @media (hover: hover))
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(import.meta.dirname, "..", "src");
// The reader's own files, which the reader work is moving into @media (hover: hover) itself: each leaves this list as it
// is done, and none joins it.
const LATER = new Set([
  "components/reader/Reader.module.css", "components/reader/Float.module.css", "components/reader/Mine.module.css",
  "components/reader/Markers.module.css", "components/reader/Listen.module.css", "components/reader/Echoes.module.css",
  "components/reader/Sentence.module.css", "components/reader/Places.module.css", "components/reader/Manuscript.module.css",
  "components/reader/Find.module.css",
]);
const HAND = /^@media\b.*\((?:any-)?hover\s*:\s*hover\)/;
// :hover itself, but not the absence of the hand (:not(:hover)), which a phone's page has from the start
const HOVER = /(?<!:not\()(?<!:not\([^()]*):hover\b/;

/** every rule of a stylesheet whose selector names :hover with no @media (hover: hover) round it, by its line */
export function outsideTheHand(css) {
  const found = [], stack = [];
  let prelude = "", start = 1, line = 1;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === "/" && css[i + 1] === "*") {           // a comment: skipped, its lines counted
      const end = css.indexOf("*/", i + 2), stop = end < 0 ? css.length : end + 2;
      line += (css.slice(i, stop).match(/\n/g) ?? []).length; i = stop - 1; continue;
    }
    if (c === '"' || c === "'") {                     // a string: taken whole, whatever it holds
      let j = i + 1; while (j < css.length && css[j] !== c) { if (css[j] === "\\") j++; j++; }
      prelude += css.slice(i, j + 1); i = j; continue;
    }
    if (c === "{") {
      const p = prelude.trim().replace(/\s+/g, " ");
      if (!p.startsWith("@") && HOVER.test(p) && !stack.some((s) => HAND.test(s))) found.push({ line: start, selector: p });
      stack.push(p); prelude = ""; continue;
    }
    if (c === "}" || c === ";") { if (c === "}") stack.pop(); prelude = ""; continue; }
    if (c === "\n") line++;
    if (!prelude.trim() && !/\s/.test(c)) start = line;
    prelude += c;
  }
  return found;
}

function* cssFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* cssFiles(p);
    else if (e.name.endsWith(".css")) yield p;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let rules = 0, files = 0, later = 0;
  const problems = [];
  for (const file of cssFiles(SRC)) {
    const name = path.relative(SRC, file).split(path.sep).join("/");
    const found = outsideTheHand(fs.readFileSync(file, "utf8"));
    files++; rules += found.length;
    if (LATER.has(name)) { later += found.length; continue; }
    for (const f of found) problems.push(`src/${name}:${f.line}  ${f.selector}`);
  }
  const done = [...LATER].filter((n) => { const f = path.join(SRC, n); return !fs.existsSync(f) || !outsideTheHand(fs.readFileSync(f, "utf8")).length; });
  if (done.length) console.log(`(done, so it can leave the LATER list: ${done.join(", ")})`);
  if (later) console.log(`(${later} rules in the reader's own files are left to the reader work)`);
  if (!problems.length) { console.log(`check-hover: every :hover rule in ${files} stylesheets is inside @media (hover: hover)`); process.exit(0); }
  for (const p of problems) console.log(`✗ ${p}`);
  console.log(`check-hover: ${problems.length} :hover ${problems.length === 1 ? "rule" : "rules"} outside @media (hover: hover): on a phone a tap leaves ${problems.length === 1 ? "it" : "them"} stuck under the hand`);
  process.exit(1);
}
