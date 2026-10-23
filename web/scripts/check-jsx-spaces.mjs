#!/usr/bin/env node
/**
 * Words run together by JSX: a check for a space lost at the end of a line.
 *
 * JSX drops the line break and indent between a line of text and a `{…}` or an inline tag on the next line, so
 *     An account is needed only to keep your Treasury in step between devices.{" "}   <- needed
 *     Accounts are kept by Supabase…
 * prints "devices.Accounts" without the `{" "}` (the account page was found so, 2026-10-23). The rule checked: where a
 * line of text in JSX meets a `{…}` or an inline tag (a, b, i, em, strong, span, small, code, abbr, sup, Link) across a
 * line break, and the text's end at that join is a word or a sentence's end, the join must carry an explicit space.
 *
 *   node scripts/check-jsx-spaces.mjs           check every .tsx under src/; exit 1 on a finding
 *   node scripts/check-jsx-spaces.mjs <file>…   check only these
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "..", "src");
const INLINE = new Set(["a", "b", "i", "em", "strong", "span", "small", "code", "abbr", "sup", "sub", "mark", "q", "cite", "Link"]);
// a join that needs a space: a word, a figure, or the punctuation that ends a clause, beside the line break
const WORD_END = /[\p{L}\p{N}.,;:!?)\]”’"']$/u;
const WORD_START = /^[\p{L}\p{N}(\[“‘"']/u;

const tagName = (n) => {
  const t = ts.isJsxElement(n) ? n.openingElement.tagName : ts.isJsxSelfClosingElement(n) ? n.tagName : null;
  return t ? t.getText() : null;
};
/** a sibling that prints inline: an expression (not an explicit space), or an inline tag */
function inline(n) {
  if (!n) return false;
  if (ts.isJsxExpression(n)) {
    if (!n.expression) return false;   // {/* a comment */}
    if (ts.isStringLiteral(n.expression) && /^\s+$/.test(n.expression.text)) return false;   // {" "}
    return true;
  }
  const name = tagName(n);
  return !!name && INLINE.has(name);
}

/**
 * What a sibling can print at its first (or last) character, where the code says: a list of the possible characters ("" for
 * nothing), or "?" where it cannot be known (a name, a call).
 */
function edges(n, first) {
  if (!n) return [""];
  if (ts.isJsxExpression(n)) return n.expression ? edges(n.expression, first) : [""];
  if (ts.isParenthesizedExpression(n)) return edges(n.expression, first);
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return [first ? n.text.slice(0, 1) : n.text.slice(-1)];
  if (ts.isTemplateExpression(n)) {
    const t = first ? n.head.text : n.templateSpans.at(-1).literal.text;
    return t ? [first ? t[0] : t.at(-1)] : ["?"];
  }
  if (ts.isConditionalExpression(n)) return [...edges(n.whenTrue, first), ...edges(n.whenFalse, first)];
  if (ts.isBinaryExpression(n)) {
    const op = n.operatorToken.kind;
    if (op === ts.SyntaxKind.AmpersandAmpersandToken) return ["", ...edges(n.right, first)];
    if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) return [...edges(n.left, first), ...edges(n.right, first)];
    return ["?"];
  }
  if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && n.expression.name.text === "map") {
    const fn = n.arguments[0];
    if (fn && (ts.isArrowFunction(fn) || ts.isFunctionExpression(fn)) && !ts.isBlock(fn.body)) return edges(fn.body, first);
    return ["?"];
  }
  if (ts.isJsxElement(n) || ts.isJsxFragment(n)) {
    if (ts.isJsxElement(n) && !INLINE.has(tagName(n))) return ["?"];
    const kids = [...n.children];
    if (!first) kids.reverse();
    for (const k of kids) {
      if (ts.isJsxText(k)) {
        const raw = k.text;
        if (!raw.trim()) { if (!raw.includes("\n")) return [" "]; continue; }   // a space on the line is kept; a line break is not
        const edge = first ? raw.match(/^[^\S\n]*\n/) ? raw.trimStart()[0] : raw[0] : raw.match(/\n[^\S\n]*$/) ? raw.trimEnd().at(-1) : raw.at(-1);
        return [edge];
      }
      return edges(k, first);
    }
    return [""];
  }
  if (ts.isJsxSelfClosingElement(n)) return ["?"];
  return ["?"];
}
const blank = (c) => c === "" || /^\s$/.test(c);
// after a line of text, the sibling may begin with nothing, a space, or punctuation that takes none before it
const fineAfter = (n) => edges(n, true).every((c) => blank(c) || /^[,.;:!?)\]”’]$/.test(c));
// before a line of text, the sibling may end with nothing or a space
const fineBefore = (n) => edges(n, false).every(blank);

export function findings(file, code) {
  const sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out = [];
  const visit = (node) => {
    const kids = ts.isJsxElement(node) || ts.isJsxFragment(node) ? node.children : null;
    if (kids) {
      kids.forEach((k, i) => {
        if (!ts.isJsxText(k) || !k.text.trim()) return;
        const raw = k.text;   // the text with its line breaks (getText() would skip the leading ones)
        const text = raw.trim();
        const prev = kids[i - 1], next = kids[i + 1];
        // a line break before the text, after an inline sibling: "{x}⏎Accounts"
        if (/^\s*\n/.test(raw) && inline(prev) && !fineBefore(prev) && WORD_START.test(text)) {
          const { line } = sf.getLineAndCharacterOfPosition(k.pos + raw.length - raw.trimStart().length);
          out.push(`${path.relative(process.cwd(), file)}:${line + 1}: no space before "${text.slice(0, 40)}" (after ${prev.getText().slice(0, 40)})`);
        }
        // a line break after the text, before an inline sibling: "devices.⏎{x}"
        if (/\n\s*$/.test(raw) && inline(next) && !fineAfter(next) && WORD_END.test(text)) {
          const { line } = sf.getLineAndCharacterOfPosition(next.getStart());
          out.push(`${path.relative(process.cwd(), file)}:${line + 1}: no space after "${text.slice(-40)}" (before ${next.getText().slice(0, 40)})`);
        }
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".tsx") ? [path.join(d, e.name)] : []);

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = process.argv.length > 2 ? process.argv.slice(2).map((f) => path.resolve(f)) : walk(SRC);
  const all = files.flatMap((f) => findings(f, fs.readFileSync(f, "utf8")));
  for (const f of all) console.log(f);
  console.log(all.length ? `\n${all.length} join(s) in JSX where words run together` : "No words run together in JSX.");
  process.exit(all.length ? 1 : 0);
}
