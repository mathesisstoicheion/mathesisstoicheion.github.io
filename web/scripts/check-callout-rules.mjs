#!/usr/bin/env node
/**
 * A call-out's red rule hidden under its own frame: a check.
 *
 * On the printed page a note set off from the text has a hairline frame (--slab-edge, --field-edge) and a rule of red
 * (or of green, ochre or blue) down its left side or across its top (--inlay-left…, --inlay-top…), as the sample's side
 * notes have (redesign/templates-2026-10-21/printed-photos.html, ".side"). Both are 1 px lines drawn inside the box, so
 * the one listed first in `box-shadow` lies on top: written frame-first, the frame's faint line covers the red one and
 * the note loses its rule (found so in the Treasury, Word Study, the reader and the forum, 2026-10-22).
 *
 * The rule checked: in any `box-shadow`, a --*-inlay-* rule comes before every --*-edge frame.
 *
 *   node scripts/check-callout-rules.mjs          check every stylesheet under src/; exit 1 on a finding
 *   node scripts/check-callout-rules.mjs <file>…  check only these
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "..", "src");

/** the box-shadow values in a stylesheet, each with its line number */
function shadows(css) {
  const out = [];
  const re = /box-shadow\s*:\s*([^;}]+)/g;
  for (let m; (m = re.exec(css)); ) out.push({ value: m[1], line: css.slice(0, m.index).split("\n").length });
  return out;
}

export function findings(file, css) {
  const out = [];
  for (const { value, line } of shadows(css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " ")))) {
    const parts = value.split(/,(?![^(]*\))/).map((s) => s.trim());
    const frame = parts.findIndex((p) => /^var\(--[\w-]*-edge\)/.test(p));
    const rule = parts.findIndex((p) => /^var\(--inlay-(left|top)[\w-]*\)/.test(p));
    if (frame >= 0 && rule > frame) out.push(`${path.relative(path.join(SRC, ".."), file)}:${line}: "${value.trim()}" draws the frame over the call-out's rule`);
  }
  return out;
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith(".css")) acc.push(p);
  }
  return acc;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const files = process.argv.length > 2 ? process.argv.slice(2).map((f) => path.resolve(f)) : walk(SRC);
  const all = files.flatMap((f) => findings(f, fs.readFileSync(f, "utf8")));
  if (all.length) {
    console.log(`check-callout-rules: ${all.length} finding${all.length === 1 ? "" : "s"}\n` + all.map((x) => "  " + x).join("\n"));
    process.exit(1);
  }
  console.log(`check-callout-rules: ${files.length} stylesheets, every call-out's rule is drawn over its frame`);
}
