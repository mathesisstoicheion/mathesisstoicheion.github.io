#!/usr/bin/env node
/**
 * The paper's own colour used as ink: a check for text set in the "on ink" colours where there is no ink behind it.
 *
 * The site's tokens keep a few colours for words printed on a block of ink (styles/tokens.css): --inv-fg (the paper's
 * colour), --ink-2-on-ink, --accent-on-ink and --accent-ink-on-ink. On the printed page the old stone panels became
 * transparent hairline frames, so a rule that still sets its words in --inv-fg over one of them prints paper-coloured
 * words on paper: invisible (the Treasury's "Keep safe" panel and its shelf of books were found so, 2026-10-22).
 *
 * The rule checked: a CSS rule that sets `color` from --inv-fg, or hands a block the on-ink colours (`--ink-2:
 * var(--ink-2-on-ink)`, `--accent: var(--accent-on-ink)`, `--accent-ink: var(--accent-ink-on-ink)`), must have a block
 * of ink behind it: its own `background` is --inv-bg or --sel-bg, or a rule for the start of its selector (the element it
 * sits in, in the same stylesheet) has one.
 *
 *   node scripts/check-on-ink.mjs            check every stylesheet under src/; exit 1 on a finding
 *   node scripts/check-on-ink.mjs <file>…    check only these
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "..", "src");
const SKIP = new Set([path.join(SRC, "styles", "tokens.css")]);

const ON_INK_COLOR = /(^|;)\s*color\s*:[^;]*var\(--inv-fg\)/;
const ON_INK_VARS = /--(ink-2|accent|accent-ink)\s*:\s*var\(--(ink-2-on-ink|accent-on-ink|accent-ink-on-ink)\)/;
const INK_BEHIND = /(^|;)\s*background(-color)?\s*:[^;]*var\(--(inv-bg|sel-bg)\)/;

/** Every rule in a stylesheet as [selector, declarations], at-rules opened (their own rules kept), comments dropped. */
function rules(css) {
  const out = [];
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const stack = [];
  let buf = "";
  for (const ch of text) {
    if (ch === "{") { stack.push(buf.trim()); buf = ""; }
    else if (ch === "}") {
      const sel = stack.pop() ?? "";
      if (!sel.startsWith("@") && buf.trim()) out.push([sel, buf.trim()]);
      buf = "";
    } else buf += ch;
  }
  return out;
}

/** the starts of a selector: ".a .b > .c:hover" gives ".a", ".a .b", and the whole */
function starts(sel) {
  const parts = sel.split(/\s*[\s>+~]\s*/).filter(Boolean);
  return parts.map((_, i) => parts.slice(0, i + 1).join(" "));
}
const bare = (s) => s.replace(/:(hover|focus|focus-visible|focus-within|active|first-child|last-child|not\([^)]*\))/g, "").trim();

export function findings(file, css) {
  const rs = rules(css);
  // the selectors (each of a comma list) that stand on a block of ink
  const inked = new Set();
  for (const [sel, decl] of rs) if (INK_BEHIND.test(decl)) for (const s of sel.split(",")) inked.add(bare(s.trim()));
  const out = [];
  for (const [sel, decl] of rs) {
    if (!ON_INK_COLOR.test(decl) && !ON_INK_VARS.test(decl)) continue;
    if (INK_BEHIND.test(decl)) continue;
    for (const one of sel.split(",").map((s) => s.trim())) {
      if (starts(one).some((s) => inked.has(bare(s)))) continue;
      out.push(`${path.relative(path.join(SRC, ".."), file)}: "${one}" sets its words in the on-ink colours with no ink behind them`);
    }
  }
  return out;
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith(".css") && !SKIP.has(p)) acc.push(p);
  }
  return acc;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const files = process.argv.length > 2 ? process.argv.slice(2).map((f) => path.resolve(f)) : walk(SRC);
  const all = files.flatMap((f) => findings(f, fs.readFileSync(f, "utf8")));
  if (all.length) {
    console.log(`check-on-ink: ${all.length} finding${all.length === 1 ? "" : "s"}\n` + all.map((x) => "  " + x).join("\n"));
    process.exit(1);
  }
  console.log(`check-on-ink: ${files.length} stylesheets, every on-ink colour has ink behind it`);
}
