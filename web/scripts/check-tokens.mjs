#!/usr/bin/env node
/**
 * Drift detector (a ratchet) for hardcoded visual values.
 *
 *   node scripts/check-tokens.mjs                 check: fail if any file has MORE hardcoded values than its baseline
 *   node scripts/check-tokens.mjs --update        rewrite the baseline from the current tree, but only ever DOWN
 *   node scripts/check-tokens.mjs --update --force   also allow raising a count / adding a file (needs a reason)
 *
 * It uses the same scanner as token-inventory.mjs. The baseline, scripts/token-baseline.json, is
 * { "<file under web/>": { "<category>": count } }; a file or category that is missing counts as 0.
 * Options for testing: --baseline <path>, --root <web folder>.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { CATEGORIES, WEB_ROOT, countsByFile, scanSource, scanTree, totalOf } from "./token-inventory.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_BASELINE = path.join(HERE, "token-baseline.json");
const fmt = (n) => n.toLocaleString("en-GB");
const SHOW_MAX = 30;

function parseArgs(argv) {
  const o = { update: false, force: false, baseline: DEFAULT_BASELINE, root: WEB_ROOT };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--update") o.update = true;
    else if (a === "--force") o.force = true;
    else if (a === "--baseline") o.baseline = path.resolve(argv[++i] ?? "");
    else if (a === "--root") o.root = path.resolve(argv[++i] ?? "");
    else if (a === "--help" || a === "-h") o.help = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  if (o.force && !o.update) throw new Error("--force only makes sense together with --update");
  return o;
}

function loadBaseline(file) {
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(`${file} must be a JSON object of { file: { category: count } }`);
  return data;
}

/** every (file, category) where the tree has more than the baseline allows */
function findRaises(current, baseline) {
  const raises = [];
  for (const file of Object.keys(current)) {
    for (const cat of CATEGORIES) {
      const now = current[file][cat] ?? 0;
      const was = baseline[file]?.[cat] ?? 0;
      if (now > was) raises.push({ file, cat, was, now, isNewFile: !(file in baseline) });
    }
  }
  return raises;
}

/** the file as of the last commit, scanned, as a multiset of "category|value"; null when git can't say */
function headMultiset(root, file) {
  try {
    const text = execFileSync("git", ["show", `HEAD:./${file}`], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 });
    const bag = new Map();
    for (const o of scanSource(file, text)) {
      const k = `${o.category}\u0001${o.value}`;
      bag.set(k, (bag.get(k) ?? 0) + 1);
    }
    return bag;
  } catch {
    return null;
  }
}

function describeOffences(raises, occurrences, root) {
  const lines = [];
  const byFile = new Map();
  for (const r of raises) {
    if (!byFile.has(r.file)) byFile.set(r.file, []);
    byFile.get(r.file).push(r);
  }
  for (const [file, list] of byFile) {
    lines.push(`${file}${list[0].isNewFile ? "   (not in the baseline)" : ""}`);
    const head = headMultiset(root, file);
    for (const r of list) {
      lines.push(`  ${r.cat}: baseline ${r.was}, now ${r.now} (+${r.now - r.was})`);
      const here = occurrences.filter((o) => o.file === file && o.category === r.cat);
      // mark the values that were not in the last commit, so the new ones stand out
      let flagged = here.map(() => false);
      if (head) {
        const bag = new Map(head);
        flagged = here.map((o) => {
          const k = `${o.category}\u0001${o.value}`;
          const left = bag.get(k) ?? 0;
          if (left > 0) { bag.set(k, left - 1); return false; }
          return true;
        });
      }
      const anyNew = flagged.some(Boolean);
      const shown = here.map((o, i) => ({ o, mark: flagged[i] })).filter((x) => !anyNew || x.mark);
      for (const { o } of shown.slice(0, SHOW_MAX)) lines.push(`    line ${String(o.line).padEnd(5)} ${o.value}   (${o.prop})`);
      if (shown.length > SHOW_MAX) lines.push(`    ... and ${shown.length - SHOW_MAX} more`);
      if (!anyNew && here.length && (head || r.was > 0)) {
        lines.push(`    (${head ? "none differ from the last commit" : "no last commit to compare with"}, so all ${here.length} in this file are listed; the baseline says ${r.was})`);
      }
    }
  }
  return lines;
}

function writeBaseline(file, current) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(current, null, 2) + "\n");
}

function main(argv) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (e) {
    console.error(e.message);
    return 2;
  }
  if (opts.help) {
    console.log("usage: node scripts/check-tokens.mjs [--update [--force]] [--baseline <path>] [--root <web folder>]");
    return 0;
  }
  const { files, occurrences } = scanTree(opts.root);
  const current = countsByFile(occurrences);
  const total = occurrences.length;
  const baseline = loadBaseline(opts.baseline);
  const baseTotal = baseline ? Object.values(baseline).reduce((s, c) => s + totalOf(c), 0) : 0;
  const raises = findRaises(current, baseline ?? {});

  if (opts.update) {
    if (!baseline && !opts.force) {
      console.error(`There is no baseline yet at ${opts.baseline}, so every hardcoded value counts as new. To create it from the current tree: node scripts/check-tokens.mjs --update --force`);
      return 1;
    }
    if (raises.length && !opts.force) {
      console.error(`Refusing to update ${path.relative(process.cwd(), opts.baseline) || opts.baseline}: ${raises.length} count(s) would go UP, and the baseline only ratchets down.`);
      console.error(raises.slice(0, 40).map((r) => `  ${r.file}  ${r.cat}: ${r.was} -> ${r.now}${r.isNewFile ? "  (new file)" : ""}`).join("\n"));
      if (raises.length > 40) console.error(`  ... and ${raises.length - 40} more`);
      console.error("Replace the hardcoded values with tokens (var(--…) from src/styles/tokens.css). If that truly cannot be done, re-run with --update --force.");
      return 1;
    }
    writeBaseline(opts.baseline, current);
    const lowered = baseline ? Object.keys(baseline).reduce((s, f) => s + CATEGORIES.reduce((t, c) => t + Math.max(0, (baseline[f]?.[c] ?? 0) - (current[f]?.[c] ?? 0)), 0), 0) : 0;
    const raised = raises.reduce((s, r) => s + (r.now - r.was), 0);
    console.log(
      `Baseline written: ${fmt(Object.keys(current).length)} files with hardcoded values, ${fmt(total)} in all` +
        (baseline ? ` (was ${fmt(baseTotal)}; ${fmt(lowered)} lowered, ${fmt(raised)} raised${raised ? " with --force" : ""}).` : " (new baseline)."),
    );
    return 0;
  }

  if (!baseline) {
    console.error(`No baseline at ${opts.baseline}. Create it from the current tree with: node scripts/check-tokens.mjs --update --force`);
    return 1;
  }

  if (raises.length) {
    const nFiles = new Set(raises.map((r) => r.file)).size;
    console.error(`Token drift: ${nFiles} file${nFiles === 1 ? "" : "s"} ha${nFiles === 1 ? "s" : "ve"} more hardcoded visual values than token-baseline.json allows.\n`);
    console.error(describeOffences(raises, occurrences, opts.root).join("\n"));
    console.error(
      "\nUse a token instead: var(--…) from src/styles/tokens.css (add one there if the design really needs a new value)." +
        "\nOnly if a hardcoded value is truly unavoidable: npm run check:tokens -- --update --force",
    );
    return 1;
  }

  const below = baseTotal - total;
  console.log(
    `check-tokens OK: ${fmt(files.length)} files scanned, ${fmt(total)} hardcoded values, none above the baseline (${fmt(baseTotal)})` +
      (below > 0 ? `; ${fmt(below)} below it, so run "npm run check:tokens -- --update" to lock that in.` : "."),
  );
  return 0;
}

try {
  process.exit(main(process.argv.slice(2)));
} catch (e) {
  console.error(`check-tokens failed: ${e.message}`);
  process.exit(2);
}
