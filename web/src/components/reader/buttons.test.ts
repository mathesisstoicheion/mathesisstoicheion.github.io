import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The quiet desk, ticket 02: the reader's buttons come in one small set (globals.css, "The buttons"), so that the new look
// can be put on them in one place. Every <button> in the reader says which kind it is with one of the set's classes:
//   btn (with ghost or small)  an action in words, framed
//   chip                       a small framed action, or a setting turned on and off (with its switch)
//   icon-btn (with framed)     a sign or an icon: ×, ‹ ›, +, play
//   text-btn                   a button that reads like a link
//   row-btn                    a whole line of a list (a match, a word, a book); its list sets its look
// A choice in a .segmented group (role="radio") or a tab (role="tab") is drawn by its group. A class of its own besides
// the set's may place or size a button, but not give it a look of its own.
const SET = ["btn", "chip", "icon-btn", "text-btn", "row-btn"];
// buttons that are the text itself, tapped: the passage number, a beat of the metre, a word to pick, a place on the map
// (and your marks beside a passage, and its number: a button with data-row)
const TEXT = new Set(["styles.front", "styles.beatBtn", "hl.has(i) ? styles.picked : \"\"", "ss.node", "ss.word", "styles.dot", "styles.name", "styles.marker", "styles.book", "e.self ? es.self : undefined", "styles[`mk-${m.kind}`]"]);
// what has not yet been brought into the set, each in a place that is not the bar, Aa or Study (those were: the quiet desk, ticket 09, the owner,
// 2026-10-30): the title page's "Private collection", Try it first's "Tap to see the translation", the scroll-bar signs button the Stoa still uses,
// and Drop's button, whose class comes from where it stands (always a button of the set)
const LATER = new Set(["styles.crumbBtn", "styles.legendBtn", "styles.reveal", "className"]);

const DIR = join(__dirname);
const NOT_HERE = new Set(["FloatingReader.tsx"]);   // a second reader in its own window (as in panels.test.ts)

/** the attributes of each <button> in a file: where it is, its className as written, its role, and the tag itself */
function kinds(file: string): { at: string; cls: string | null; role: string | null; tag: string }[] {
  const src = readFileSync(join(DIR, file), "utf8");
  const out: { at: string; cls: string | null; role: string | null; tag: string }[] = [];
  for (let i = src.indexOf("<button"); i >= 0; i = src.indexOf("<button", i + 1)) {
    // the tag runs to the first > outside quotes and braces
    let j = i + 7, depth = 0, q = "";
    for (; j < src.length; j++) {
      const c = src[j];
      if (q) { if (c === q) q = ""; continue; }
      if (c === '"' || c === "`") q = c;
      else if (c === "{") depth++;
      else if (c === "}") depth--;
      else if (c === ">" && depth === 0) break;
    }
    const tag = src.slice(i, j + 1);
    let cls: string | null = null;
    const k = tag.indexOf("className=");
    if (k >= 0) {
      if (tag[k + 10] === '"') cls = tag.slice(k + 11, tag.indexOf('"', k + 11));
      else { let d = 0, e = k + 10; for (; e < tag.length; e++) { if (tag[e] === "{") d++; else if (tag[e] === "}" && --d === 0) break; } cls = tag.slice(k + 11, e); }
    }
    out.push({ at: `${file}:${src.slice(0, i).split("\n").length}`, cls, role: tag.match(/role="(\w+)"/)?.[1] ?? null, tag });
  }
  return out;
}

const inSet = (cls: string) => SET.some((k) => new RegExp(`(^|[\\s\`"'{])${k}($|[\\s\`"'}])`).test(cls));
// in the passage actions (PassageToolbar.tsx, which has a ticket of its own) or with a class that waits (above)
const later = (b: { at: string; cls: string | null; tag: string }) => b.at.startsWith("PassageToolbar.tsx") || LATER.has((b.cls ?? "").trim());

describe("the reader's buttons", () => {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".tsx") && !NOT_HERE.has(f));
  const all = files.flatMap(kinds);

  it("finds the reader's buttons", () => expect(all.length).toBeGreaterThan(100));

  it("each is one of the set, a choice in a group, the text itself, or waits for its own ticket", () => {
    const stray = all.filter((b) => {
      if (b.cls && inSet(b.cls)) return false;
      if (!b.cls && (b.role === "radio" || b.role === "tab" || /data-row=/.test(b.tag))) return false;
      if (b.cls && TEXT.has(b.cls.trim())) return false;
      return !later(b);
    });
    expect(stray.map((b) => `${b.at} ${b.cls ?? "(no class)"}`)).toEqual([]);
  });
});
