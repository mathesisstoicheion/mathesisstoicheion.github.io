#!/usr/bin/env node
/**
 * The same words twice: a check for a link, button, list item or heading whose words are one phrase said twice over.
 *
 * A card that prints its name and under it a gloss reads "The Mouseion The Mouseion" when the gloss turns out to be the name
 * itself (the not-found page's ways on were found so, 2026-10-23, after the rooms' names became one name each). The rule
 * checked, on every page of the built site (out/): no <a>, <button>, <li> or heading has words that are the same phrase twice.
 *
 *   node scripts/check-repeats.mjs        after `npm run build`; exit 1 on a finding
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const unescape = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
  e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENTITIES[e] ?? m);

export function findings(html) {
  const s = html.replace(/<!-- -->/g, "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ");
  const out = [];
  for (const m of s.matchAll(/<(a|button|li|h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    const text = unescape(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    const w = text.split(" ");
    const half = w.length / 2;
    if (text.length > 5 && w.length >= 2 && w.length % 2 === 0 && w.slice(0, half).join(" ") === w.slice(half).join(" ")) out.push(text);
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!fs.existsSync(OUT)) { console.error("No out/ folder: build the site first (npm run build)."); process.exit(2); }
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".html") ? [path.join(d, e.name)] : []);
  const all = walk(OUT).flatMap((f) => findings(fs.readFileSync(f, "utf8")).map((t) => `${path.relative(OUT, f)}: "${t}"`));
  for (const f of all) console.log(f);
  console.log(all.length ? `\n${all.length} place(s) where the same words stand twice` : "No words said twice over.");
  process.exit(all.length ? 1 : 0);
}
