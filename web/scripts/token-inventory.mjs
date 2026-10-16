#!/usr/bin/env node
/**
 * Design-token inventory: counts every hardcoded visual value in web/src, by category.
 *
 *   node scripts/token-inventory.mjs [--json report.json]
 *
 * Categories: colour, font-family, font-size, spacing, radius, shadow, z-index, motion.
 * Scans src/**\/*.css and src/**\/*.ts(x) (test files and .d.ts excluded). src/styles/tokens.css is exempt:
 * values written there ARE the tokens. Everything else is "hardcoded" unless it goes through var(--x).
 *
 * The scanner is exported (scanTree, scanSource, countsByFile ...) and shared with check-tokens.mjs.
 * Plain Node standard library only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const CATEGORIES = ["colour", "font-family", "font-size", "spacing", "radius", "shadow", "z-index", "motion"];
export const TOKENS_FILE = "src/styles/tokens.css";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const WEB_ROOT = path.resolve(HERE, "..");

/* ===================================================================== small text helpers */

const squash = (s) => s.replace(/\s+/g, " ").trim();
const normNums = (s) => s.replace(/(?<![\w.])\.(\d)/g, "0.$1");
const PLACEHOLDER = "\u0000"; // stands for a ${...} hole in a template literal

/** index of the ")" matching the "(" at `open`, or -1 */
function matchParen(s, open) {
  let depth = 0;
  let q = null;
  for (let i = open; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === "\\") i++;
      else if (c === q) q = null;
    } else if (c === '"' || c === "'") q = c;
    else if (c === "(") depth++;
    else if (c === ")" && --depth === 0) return i;
  }
  return -1;
}

/** removes every var(...) (fallbacks included), leaving a space */
function stripVars(s) {
  let out = "";
  let i = 0;
  const re = /(?<![\w-])var\(/gi;
  let m;
  while ((m = re.exec(s))) {
    const close = matchParen(s, m.index + m[0].length - 1);
    out += s.slice(i, m.index) + " ";
    if (close < 0) return out;
    i = close + 1;
    re.lastIndex = i;
  }
  return out + s.slice(i);
}

const maskQuoted = (s) => s.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""');

/** split at depth 0 / outside quotes on a single char (",") or on whitespace (sep === " ") */
function splitTop(s, sep) {
  const parts = [];
  let depth = 0;
  let q = null;
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      cur += c;
      if (c === "\\") cur += s[++i] ?? "";
      else if (c === q) q = null;
      continue;
    }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === "(") depth++;
    else if (c === ")") depth = Math.max(0, depth - 1);
    const isSep = depth === 0 && (sep === " " ? /\s/.test(c) : c === sep);
    if (isSep) { if (cur) parts.push(cur); cur = ""; } else cur += c;
  }
  if (cur) parts.push(cur);
  return parts;
}

/* ===================================================================== value classification (shared by CSS and TS) */

const NAMED_COLOURS = new Set(
  ("aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue " +
    "chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey " +
    "darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray " +
    "darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen " +
    "fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender " +
    "lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey " +
    "lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen " +
    "magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen " +
    "mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange " +
    "orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple " +
    "rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue " +
    "slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen").split(" "),
);
const CSS_WIDE = new Set(["inherit", "initial", "unset", "revert", "revert-layer"]);
const GENERIC_FAMILIES = new Set([
  "serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-serif", "ui-sans-serif", "ui-monospace",
  "ui-rounded", "emoji", "math", "fangsong",
]);
const SYSTEM_FONTS = new Set(["caption", "icon", "menu", "message-box", "small-caption", "status-bar"]);
const SIZE_KEYWORDS = new Set(["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large", "larger", "smaller"]);

/** properties whose values may hold a bare colour name */
const COLOUR_PROP_RE =
  /^(?:-webkit-)?(?:color|background|border|outline|fill|stroke|text-decoration|caret-color|accent-color|column-rule|box-shadow|text-shadow|text-emphasis|scrollbar-color|stop-color|flood-color|lighting-color|filter|backdrop-filter|mask|text-stroke|text-fill-color|tap-highlight-color)/;
const SPACING_RE = /^(?:scroll-)?(?:margin|padding)(?:-[a-z-]+)?$|^(?:row-|column-|grid-)?gap$|^inset(?:-[a-z-]+)?$|^(?:top|left|right|bottom)$/;
const RADIUS_RE = /^(?:-webkit-|-moz-)?border(?:-[a-z]+)*-radius$/;
const SHADOW_PROPS = new Set(["box-shadow", "text-shadow", "-webkit-box-shadow"]);
const MOTION_RE = /^(?:-webkit-)?(?:transition|animation)(?:-(?:duration|delay|timing-function))?$/;
// Custom properties (--x: value) outside tokens.css: colours are recognised by value shape; the rest by the property's name.
const CP_FONT_FAMILY = (p) => /^--(?:f|font|ff)(?:-|$)/.test(p) && !/size|weight|leading|height|style|stretch|spacing|tracking|step/.test(p);
const CP_FONT_SIZE = /^--(?:step|fs|font-size|text)(?:-|$)/;
const CP_SPACING = /^--(?:space|spacing|gap|gutter|pad|padding|margin|inset)(?:-|$)/;
const CP_Z = /^--(?:z|z-index|layer)(?:-|$)/;
const CP_MOTION = /^--(?:ease|dur|duration|delay|transition|anim|animation|speed)(?:-|$)/;

const LEN_PXREM = /(?<![\w.-])-?(?:\d*\.?\d+)(?:px|rem|em)(?![\w-])/g;
const LEN_ANY =
  /(?<![\w.-])-?(?:\d*\.?\d+)(?:px|rem|em|%|vw|vh|vmin|vmax|svh|dvh|lvh|svw|dvw|lvw|ch|ex|pt|cm|mm|in|pc|cqw|cqh|cqi|cqb|cqmin|cqmax)(?![\w-])/g;
const DURATION = /(?<![\w.-])-?(?:\d*\.?\d+)(?:ms|s)(?![\w-])/g;

function normHex(h) {
  let x = h.slice(1).toLowerCase();
  if (x.length === 3 || x.length === 4) x = [...x].map((c) => c + c).join("");
  return "#" + x;
}
function normColourFn(fn) {
  return normNums(squash(fn))
    .toLowerCase()
    .replace(/\s*,\s*/g, ", ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")");
}
function normLen(tok) {
  const m = /^(-?(?:\d*\.?\d+))(.*)$/.exec(tok);
  return String(Number(m[1])) + m[2];
}
const isZeroLen = (tok) => Number(/^-?(?:\d*\.?\d+)/.exec(tok)[0]) === 0;

function findLengths(value, re) {
  const out = [];
  for (const m of stripVars(value).matchAll(re)) if (!isZeroLen(m[0])) out.push(normLen(m[0]));
  return out;
}

const COLOUR_FNS = /(?<![\w-])(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/gi;

/** every hardcoded colour in `s` (quoted text already masked) */
function findColours(s, allowNamed) {
  const found = [];
  let masked = s;
  COLOUR_FNS.lastIndex = 0;
  let m;
  const fnRanges = [];
  while ((m = COLOUR_FNS.exec(s))) {
    const open = m.index + m[0].length - 1;
    const close = matchParen(s, open);
    if (close < 0) break;
    COLOUR_FNS.lastIndex = close + 1;
    fnRanges.push([m.index, close + 1]);
    const inner = s.slice(open + 1, close);
    // relative colours and colours built from a custom property are not literals; a template hole is tolerated
    // only as the last argument (rgba(255,230,200,${alpha}): the colour is hardcoded, its opacity is computed)
    if (/^\s*from\s/i.test(inner) || /var\(/i.test(inner)) continue;
    if (inner.includes(PLACEHOLDER) && inner.split(/[,/]/).slice(0, -1).some((a) => a.includes(PLACEHOLDER))) continue;
    found.push(normColourFn(s.slice(m.index, close + 1)).replaceAll(PLACEHOLDER, "${}"));
  }
  for (const [a, b] of fnRanges) masked = masked.slice(0, a) + " ".repeat(b - a) + masked.slice(b);
  for (const h of masked.matchAll(/(?<![\w&#-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![\w-])/g)) found.push(normHex(h[0]));
  if (allowNamed) {
    for (const w of masked.matchAll(/(?<![\w#.-])([a-z]+)(?![\w-])(?!\s*\()/gi)) {
      const lc = w[1].toLowerCase();
      if (NAMED_COLOURS.has(lc)) found.push(lc);
    }
  }
  return found;
}

function stripColourFns(s) {
  return s.replace(new RegExp(COLOUR_FNS.source + "[^)]*\\)", "gi"), " ");
}

/** font-family names written directly (var() entries skipped; a lone generic keyword counts only when nothing else is there) */
function familyNames(value) {
  const names = [];
  const generics = [];
  for (const raw of splitTop(value, ",")) {
    const t = raw.trim();
    if (!t || /^var\(/i.test(t) || t.includes(PLACEHOLDER)) continue;
    const q = /^(["'])(.*)\1$/.exec(t);
    if (q) { names.push(q[2].trim()); continue; }
    const lc = t.toLowerCase();
    if (CSS_WIDE.has(lc)) continue;
    if (GENERIC_FAMILIES.has(lc)) generics.push(lc);
    else names.push(squash(t));
  }
  if (names.length) return names;
  return /var\(/i.test(value) ? [] : generics;
}

/** a font-size value that is not a var() / a calc of vars; returns the value to record, or null */
function fontSizeValue(value) {
  const v = squash(value);
  if (!v || CSS_WIDE.has(v.toLowerCase()) || v.includes(PLACEHOLDER)) return null;
  const stripped = stripVars(v);
  const hasLength = [...stripped.matchAll(LEN_ANY)].some((m) => !isZeroLen(m[0]));
  const hasKeyword = stripped.toLowerCase().split(/[^a-z-]+/).some((w) => SIZE_KEYWORDS.has(w));
  return hasLength || hasKeyword ? v : null;
}

/** the size and the family part of a `font:` shorthand */
function fontShorthand(value) {
  const toks = splitTop(value, " ");
  if (!toks.length) return {};
  if (toks.length === 1 && (SYSTEM_FONTS.has(toks[0].toLowerCase()) || CSS_WIDE.has(toks[0].toLowerCase()))) return {};
  let si = -1;
  for (let k = 0; k < toks.length; k++) {
    const head = toks[k].split("/")[0];
    if (/^(?:\d*\.?\d+(?:px|rem|em|%|pt|vw|vh|vmin|vmax|ch|ex|cm|mm|in|pc)|calc\(.*|clamp\(.*|min\(.*|max\(.*)$/i.test(head) || SIZE_KEYWORDS.has(head.toLowerCase())) { si = k; break; }
  }
  if (si < 0) {
    const q = toks.findIndex((t) => /^["']/.test(t));
    return q >= 0 ? { family: toks.slice(q).join(" ") } : {};
  }
  const size = toks[si].split("/")[0];
  let famStart = si + 1;
  if (toks[famStart] === "/") famStart += 2;
  else if (toks[famStart]?.startsWith("/")) famStart += 1;
  return { size, family: toks.slice(famStart).join(" ") };
}

function motionValues(value) {
  const out = [];
  let s = stripVars(value);
  s = s.replace(/(?<![\w-])(cubic-bezier|steps|linear)\(([^)]*)\)/gi, (m) => {
    out.push(normColourFn(m));
    return " ";
  });
  for (const m of s.matchAll(/(?<![\w-])(ease-in-out|ease-in|ease-out|ease|linear|step-start|step-end)(?![\w(-])/gi)) out.push(m[1].toLowerCase());
  for (const m of s.matchAll(DURATION)) if (!isZeroLen(m[0])) out.push(normLen(m[0]));
  return out;
}

const isSolelyVar = (v) => /^var\(/i.test(v) && matchParen(v, 3) === v.length - 1;

/**
 * Classify one declaration (`prop: value`) into hardcoded-value occurrences.
 * `prop` is kebab-case (or a --custom-property); `value` is the CSS text. Returns [{ category, value }].
 */
export function classifyDeclaration(propIn, rawValue) {
  const prop = propIn.toLowerCase();
  const out = [];
  const add = (category, value) => out.push({ category, value });
  const value = maskUrls(normNums(squash(String(rawValue)))).replace(/\s*!important$/i, ""); // url(...) contents are never values
  if (!value) return out;
  const custom = prop.startsWith("--");

  // colour: a literal anywhere, including a var(--x, fallback) fallback
  for (const c of findColours(maskQuoted(value), custom || COLOUR_PROP_RE.test(prop))) add("colour", c);

  // font-family / font-size (also from the `font` shorthand)
  if (prop === "font-family" || (custom && CP_FONT_FAMILY(prop))) {
    for (const n of familyNames(value)) add("font-family", n);
  } else if (prop === "font") {
    const f = fontShorthand(value);
    const size = f.size && fontSizeValue(f.size);
    if (size) add("font-size", size);
    if (f.family) for (const n of familyNames(f.family)) add("font-family", n);
  }
  if (prop === "font-size" || (custom && CP_FONT_SIZE.test(prop))) {
    const size = fontSizeValue(value);
    if (size) add("font-size", size);
  }

  if (SPACING_RE.test(prop) || (custom && CP_SPACING.test(prop))) for (const l of findLengths(value, LEN_PXREM)) add("spacing", l);
  if (RADIUS_RE.test(prop) || (custom && /radius/.test(prop))) for (const l of findLengths(value, LEN_ANY)) add("radius", l);

  if (SHADOW_PROPS.has(prop) || (custom && /shadow/.test(prop))) {
    const lc = value.toLowerCase();
    // counted unless `none`, a lone var(), or built only from var()s and colours
    if (lc !== "none" && !CSS_WIDE.has(lc) && !isSolelyVar(value) && /\d/.test(stripColourFns(stripVars(value)).replaceAll(PLACEHOLDER, ""))) add("shadow", value);
  }
  if (prop === "filter" || prop === "backdrop-filter" || prop === "-webkit-filter") {
    for (const m of value.matchAll(/drop-shadow\(/gi)) {
      const close = matchParen(value, m.index + m[0].length - 1);
      if (close > 0) {
        const call = value.slice(m.index, close + 1);
        if (/\d/.test(stripColourFns(stripVars(call)).replaceAll(PLACEHOLDER, ""))) add("shadow", call);
      }
    }
  }

  if (prop === "z-index" || (custom && CP_Z.test(prop))) if (/^-?\d+$/.test(value)) add("z-index", value);

  // a custom property is motion by its name, or by its value being a lone time (--d: 0.2s) or holding a cubic-bezier()
  if (MOTION_RE.test(prop) || (custom && (CP_MOTION.test(prop) || /cubic-bezier\(/i.test(value) || /^-?(?:\d*\.?\d+)m?s$/.test(value)))) {
    for (const v of motionValues(value)) add("motion", v);
  }

  return out;
}

/* ===================================================================== CSS scanner */

/**
 * Splits CSS into statements, dropping comments and the insides of url(...) and keeping line numbers.
 * Yields { text, term ("{" | "}" | ";" | ""), line }.
 */
function* cssChunks(text, baseLine = 1) {
  let i = 0;
  let line = baseLine;
  let buf = "";
  let bufLine = null;
  let paren = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (c === "/" && text[i + 1] === "*") {
      const e = text.indexOf("*/", i + 2);
      const end = e < 0 ? n : e + 2;
      for (let k = i; k < end; k++) if (text[k] === "\n") line++;
      buf += " ";
      i = end;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      let ok = false;
      while (j < n && text[j] !== "\n") {
        if (text[j] === "\\") { j += 2; continue; }
        if (text[j] === c) { ok = true; break; }
        j++;
      }
      if (ok) {
        if (bufLine === null) bufLine = line;
        buf += text.slice(i, j + 1);
        i = j + 1;
        continue;
      }
    }
    if ((c === "u" || c === "U") && /^url\(/i.test(text.slice(i, i + 4)) && !/[\w-]/.test(text[i - 1] ?? "")) {
      const close = matchParen(text, i + 3);
      const end = close < 0 ? n : close + 1;
      for (let k = i; k < end; k++) if (text[k] === "\n") line++;
      if (bufLine === null) bufLine = line;
      buf += "url()";
      i = end;
      continue;
    }
    if (c === "(") paren++;
    else if (c === ")") paren = Math.max(0, paren - 1);
    if (paren === 0 && (c === ";" || c === "{" || c === "}")) {
      yield { text: buf, term: c, line: bufLine ?? line };
      buf = "";
      bufLine = null;
      i++;
      continue;
    }
    if (c === "\n") line++;
    else if (bufLine === null && !/\s/.test(c)) bufLine = line;
    buf += c;
    i++;
  }
  if (buf.trim()) yield { text: buf, term: "", line: bufLine ?? line };
}

/** hardcoded values in CSS text. Returns [{ category, value, line, prop }] */
export function scanCssText(text, baseLine = 1) {
  const out = [];
  for (const ch of cssChunks(text, baseLine)) {
    if (ch.term === "{") continue; // a selector or at-rule prelude
    const t = ch.text.trim();
    if (!t || t.startsWith("@")) continue;
    const colon = t.indexOf(":");
    if (colon < 1) continue;
    const prop = t.slice(0, colon).trim().toLowerCase();
    if (!/^(?:--[\w-]+|-?[a-z][a-z-]*)$/.test(prop)) continue;
    for (const o of classifyDeclaration(prop, t.slice(colon + 1))) out.push({ ...o, line: ch.line, prop });
  }
  return out;
}

/* ===================================================================== TS / TSX scanner */

const REGEX_KEYWORDS = new Set(["return", "typeof", "instanceof", "in", "of", "new", "delete", "void", "throw", "case", "do", "else", "yield", "await"]);
const OPS3 = new Set(["===", "!==", "..."]);
const OPS2 = new Set(["=>", "&&", "||", "??", "==", "!=", "<=", ">="]);

/**
 * A small tolerant lexer: comments dropped; strings, template literals (with ${} holes lexed as nested streams) and
 * numbers kept whole. It does not parse JSX; an apostrophe in JSX text just becomes a stray token.
 * Returns { streams: Token[][], strings: Token[] }.
 */
export function lexTs(src) {
  const n = src.length;
  let i = 0;
  let line = 1;
  const streams = [];
  const strings = [];

  function lex(inTemplate) {
    const toks = [];
    streams.push(toks);
    let depth = 0;
    const push = (t, v, extra) => { const tok = { t, v, line, ...extra }; toks.push(tok); return tok; };
    while (i < n) {
      const c = src[i];
      if (c === "\n") { line++; i++; continue; }
      if (c === " " || c === "\t" || c === "\r") { i++; continue; }
      if (c === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") i++; continue; }
      if (c === "/" && src[i + 1] === "*") {
        const e = src.indexOf("*/", i + 2);
        const end = e < 0 ? n : e + 2;
        for (let k = i; k < end; k++) if (src[k] === "\n") line++;
        i = end;
        continue;
      }
      if (c === '"' || c === "'") {
        let j = i + 1;
        let ok = false;
        while (j < n && src[j] !== "\n") {
          if (src[j] === "\\") { j += 2; continue; }
          if (src[j] === c) { ok = true; break; }
          j++;
        }
        if (ok) { strings.push(push("str", src.slice(i + 1, j))); i = j + 1; }
        else { push("p", c); i++; } // an apostrophe in JSX text, not a string
        continue;
      }
      if (c === "`") {
        const save = { i, line, streams: streams.length, strings: strings.length };
        const startLine = line;
        i++;
        let text = "";
        let ok = false;
        while (i < n) {
          const d = src[i];
          if (d === "\\") { text += src.slice(i, i + 2); if (src[i + 1] === "\n") line++; i += 2; continue; }
          if (d === "`") { ok = true; i++; break; }
          if (d === "$" && src[i + 1] === "{") { i += 2; text += PLACEHOLDER; lex(true); continue; }
          if (d === "\n") line++;
          text += d;
          i++;
        }
        if (!ok) { // not a real template: back out
          i = save.i + 1; line = save.line; streams.length = save.streams; strings.length = save.strings;
          push("p", "`");
          continue;
        }
        const tok = { t: "tpl", v: text, line: startLine };
        toks.push(tok);
        strings.push(tok);
        continue;
      }
      if (c === "/") {
        const p = toks[toks.length - 1];
        const regexOk = src[i - 1] !== "<" && (!p || (p.t === "p" && !")]}".includes(p.v)) || (p.t === "id" && REGEX_KEYWORDS.has(p.v)));
        if (regexOk) {
          let j = i + 1;
          let cls = false;
          let ok = false;
          while (j < n && src[j] !== "\n") {
            const d = src[j];
            if (d === "\\") { j += 2; continue; }
            if (d === "[") cls = true;
            else if (d === "]") cls = false;
            else if (d === "/" && !cls) { ok = true; break; }
            j++;
          }
          if (ok) {
            j++;
            while (/[a-z]/i.test(src[j] ?? "")) j++;
            push("re", src.slice(i, j));
            i = j;
            continue;
          }
        }
      }
      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] ?? "") && !(toks.length && ["id", "num"].includes(toks[toks.length - 1].t)))) {
        const m = /^(?:0[xX][0-9a-fA-F_]+|(?:\d[\d_]*\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/.exec(src.slice(i, i + 40));
        push("num", Number(m[0].replace(/_/g, "")));
        i += m[0].length;
        continue;
      }
      if (/[A-Za-z_$]/.test(c)) {
        let j = i + 1;
        while (j < n && /[\w$]/.test(src[j])) j++;
        push("id", src.slice(i, j));
        i = j;
        continue;
      }
      if (c === "{") { depth++; push("p", c); i++; continue; }
      if (c === "}") {
        if (inTemplate && depth === 0) { i++; return toks; }
        depth--; push("p", c); i++; continue;
      }
      const three = src.slice(i, i + 3);
      const two = src.slice(i, i + 2);
      if (OPS3.has(three)) { push("p", three); i += 3; continue; }
      if (OPS2.has(two)) { push("p", two); i += 2; continue; }
      if (c.charCodeAt(0) < 128) push("p", c);
      i++;
    }
    return toks;
  }

  lex(false);
  return { streams, strings };
}

const isP = (tok, v) => !!tok && tok.t === "p" && tok.v === v;

/** index of the closer matching the opener at `i` (within one token stream), or -1 */
function matchClose(toks, i) {
  const open = toks[i].v;
  const close = open === "{" ? "}" : open === "(" ? ")" : "]";
  let depth = 0;
  for (let k = i; k < toks.length; k++) {
    const t = toks[k];
    if (t.t !== "p") continue;
    if (t.v === open) depth++;
    else if (t.v === close && --depth === 0) return k;
  }
  return -1;
}

/** the literals that can BE the value of an expression (branches of ?:, ||, ??, &&), not ones inside calls or arithmetic */
function valueCandidates(toks, a, b) {
  const out = [];
  const stack = [];
  const BEFORE = new Set(["?", ":", "||", "??", "&&", "("]);
  const AFTER = new Set([":", "?", "||", "??", "&&", ")"]);
  for (let k = a; k < b; k++) {
    const t = toks[k];
    if (t.t === "p") {
      if (t.v === "(") {
        const p = toks[k - 1];
        stack.push(k > a && !!p && (p.t === "id" || isP(p, ")") || isP(p, "]")));
      } else if (t.v === "[" || t.v === "{") stack.push(true);
      else if (t.v === ")" || t.v === "]" || t.v === "}") stack.pop();
      continue;
    }
    if (stack.includes(true)) continue;
    if (t.t !== "str" && t.t !== "tpl" && t.t !== "num") continue;
    let pk = k - 1;
    let neg = false;
    if (t.t === "num" && isP(toks[pk], "-") && pk >= a) { neg = true; pk--; }
    const prev = pk >= a ? toks[pk] : null;
    const next = k + 1 < b ? toks[k + 1] : null;
    const prevOk = !prev || (prev.t === "p" && BEFORE.has(prev.v));
    const nextOk = !next || (next.t === "p" && AFTER.has(next.v)) || (next.t === "id" && next.v === "as");
    if (prevOk && nextOk) out.push({ tok: t, neg });
  }
  return out;
}

const kebab = (k) => {
  if (k.startsWith("--")) return k;
  const s = k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
  return /^(webkit|moz|ms)-/.test(s) ? "-" + s : s;
};
const unescapeJs = (s) => s.replace(/\\(["'`\\])/g, "$1").replace(/\\n/g, " ");

/** a numeric literal in a style object means pixels for these properties */
const PX_NUMERIC = (prop) => SPACING_RE.test(prop) || RADIUS_RE.test(prop) || prop === "font-size";

/** classify one property/value pair whose candidates were found in a token stream */
function emitPair(prop, cands, out) {
  for (const { tok, neg } of cands) {
    if (tok.done) continue;
    tok.done = true;
    let value;
    if (tok.t === "num") {
      if (PX_NUMERIC(prop)) value = `${neg ? -tok.v : tok.v}px`;
      else if (prop === "z-index") value = String(neg ? -tok.v : tok.v);
      else continue;
    } else value = unescapeJs(tok.v);
    for (const o of classifyDeclaration(prop, value)) out.push({ ...o, line: tok.line, prop });
  }
}

const COLOUR_KEY_RE = /^(?:colou?r|fill|stroke|background|bg|ink|tint|halo|border-colou?r|outline-colou?r)$|(?:colou?r|-bg|-fill|-stroke)$/;
const JSX_COLOUR_ATTRS = new Set(["fill", "stroke", "stopColor", "floodColor", "lightingColor", "color"]);
const CANVAS_COLOUR_PROPS = new Set(["fillStyle", "strokeStyle", "shadowColor"]);

/** pairs `key: value` inside tokens [a, b): the keys of an object literal, at any depth */
function eachPair(toks, a, b, fn) {
  for (let k = a; k < b; k++) {
    const t = toks[k];
    let vs; // where the value starts
    if ((t.t === "id" || t.t === "str") && isP(toks[k + 1], ":")) vs = k + 2;
    else if (isP(t, "[") && toks[k + 1]?.t === "str") {
      // a computed key: [ "--d" as string ]: value
      let j = k + 2;
      while (toks[j] && (toks[j].t === "id")) j++;
      if (!(isP(toks[j], "]") && isP(toks[j + 1], ":"))) continue;
      vs = j + 2;
    } else continue;
    const prev = toks[k - 1];
    if (k > a && !(isP(prev, "{") || isP(prev, ","))) continue;
    const keyTok = isP(t, "[") ? toks[k + 1] : t;
    let depth = 0;
    let e = vs;
    for (; e < b; e++) {
      const x = toks[e];
      if (x.t !== "p") continue;
      if (x.v === "(" || x.v === "[" || x.v === "{") depth++;
      else if (x.v === ")" || x.v === "]" || x.v === "}") { if (depth === 0) break; depth--; }
      else if (x.v === "," && depth === 0) break;
    }
    fn(keyTok.v, vs, e);
  }
}

/** end (exclusive) of an assignment's right-hand side starting at `a` */
function rhsEnd(toks, a) {
  let depth = 0;
  let e = a;
  for (; e < toks.length && e < a + 80; e++) {
    const x = toks[e];
    if (x.t !== "p") continue;
    if (x.v === "(" || x.v === "[" || x.v === "{") depth++;
    else if (x.v === ")" || x.v === "]" || x.v === "}") { if (depth === 0) break; depth--; }
    else if (x.v === ";" && depth === 0) break;
  }
  return e;
}

function scanStream(toks, out) {
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.t !== "id") {
      // F (below) and loose strings are handled elsewhere
      continue;
    }
    // A: style={{ ... }}
    if (t.v === "style" && isP(toks[i + 1], "=") && isP(toks[i + 2], "{") && isP(toks[i + 3], "{")) {
      const close = matchClose(toks, i + 3);
      if (close > 0) {
        eachPair(toks, i + 4, close, (key, a, b) => emitPair(kebab(key), valueCandidates(toks, a, b), out));
      }
      continue;
    }
    // B: el.style.prop = value
    if (t.v === "style" && isP(toks[i - 1], ".") && isP(toks[i + 1], ".") && toks[i + 2]?.t === "id" && isP(toks[i + 3], "=")) {
      emitPair(kebab(toks[i + 2].v), valueCandidates(toks, i + 4, rhsEnd(toks, i + 4)), out);
      continue;
    }
    // C: el.style.setProperty("--x", value)
    if (t.v === "setProperty" && isP(toks[i + 1], "(") && toks[i + 2]?.t === "str" && isP(toks[i + 3], ",")) {
      const close = matchClose(toks, i + 1);
      if (close > 0) {
        toks[i + 2].done = true;
        emitPair(kebab(toks[i + 2].v), valueCandidates(toks, i + 4, close), out);
      }
      continue;
    }
    // D: canvas colours, font and colour stops
    if (CANVAS_COLOUR_PROPS.has(t.v) && isP(toks[i + 1], "=")) {
      emitPair("fill", valueCandidates(toks, i + 2, rhsEnd(toks, i + 2)), out);
      continue;
    }
    if (t.v === "font" && isP(toks[i - 1], ".") && isP(toks[i + 1], "=")) {
      emitPair("font", valueCandidates(toks, i + 2, rhsEnd(toks, i + 2)), out);
      continue;
    }
    if (t.v === "addColorStop" && isP(toks[i + 1], "(")) {
      const close = matchClose(toks, i + 1);
      let comma = -1;
      for (let k = i + 2; k < close; k++) if (isP(toks[k], ",")) { comma = k; break; }
      if (close > 0 && comma > 0) emitPair("fill", valueCandidates(toks, comma + 1, close), out);
      continue;
    }
    // E: JSX / assignment of a colour attribute: fill="white", color="red"
    if (JSX_COLOUR_ATTRS.has(t.v) && isP(toks[i + 1], "=") && toks[i + 2]?.t === "str") {
      emitPair("fill", [{ tok: toks[i + 2], neg: false }], out);
      continue;
    }
  }
  // F: object literal keys that hold a colour: { color: "red", fill: "white" }
  eachPair(toks, 0, toks.length, (key, a, b) => {
    if (!COLOUR_KEY_RE.test(kebab(key.replace(/^["']|["']$/g, "")))) return;
    emitPair("color", valueCandidates(toks, a, b).filter((c) => c.tok.t !== "num"), out);
  });
}

/** CSS carried inside a string: <style> blocks, style="..." attributes, or a string that is itself CSS */
const KNOWN_PROP = (p) =>
  COLOUR_PROP_RE.test(p) || SPACING_RE.test(p) || RADIUS_RE.test(p) || SHADOW_PROPS.has(p) || MOTION_RE.test(p) ||
  /^(?:font(?:-family|-size)?|z-index)$/.test(p);

function cssInString(text, baseLine) {
  const out = [];
  let rest = text;
  const blank = (a, b) => { rest = rest.slice(0, a) + rest.slice(a, b).replace(/[^\n]/g, " ") + rest.slice(b); };
  const lineAt = (idx) => baseLine + (text.slice(0, idx).match(/\n/g)?.length ?? 0);
  let found = false;
  for (const m of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    found = true;
    const start = m.index + m[0].indexOf(m[1]);
    out.push(...scanCssText(m[1], lineAt(start)));
    blank(m.index, m.index + m[0].length);
  }
  for (const m of text.matchAll(/\sstyle=(["'])(.*?)\1/g)) {
    found = true;
    out.push(...scanCssText(m[2] + ";", lineAt(m.index)));
    blank(m.index, m.index + m[0].length);
  }
  if (!found) {
    // does the whole string read as CSS (a known property, then a `;`, `{` or `}`, or one lone declaration)?
    const decl = /(?:^|[;{}\s])(-?[a-z][a-z-]*)\s*:\s*[^;{}]+/g;
    let known = false;
    for (const m of text.matchAll(decl)) if (KNOWN_PROP(m[1])) { known = true; break; }
    const cssy = known && (/[;{}]/.test(text) || /^\s*-?[a-z][a-z-]*\s*:[^:]+$/.test(text));
    if (cssy) {
      out.push(...scanCssText(text.replace(/<[^>]*>/g, " "), baseLine));
      rest = "";
    }
  }
  return { out, rest, found: found || out.length > 0 };
}

const FONT_STRING = /^\s*(?:(?:italic|oblique|bold|bolder|lighter|normal|small-caps|[1-9]00)\s+)*\d*\.?\d+(?:px|pt|rem|em)(?:\/[\d.]+)?\s+\S.*$/;

/** colours in a string that is not CSS: functional notations anywhere, hex only when it clearly is a colour */
// short hex strings that are really page anchors / words ("#add", "#face"), not colours
const HEX_WORDS = new Set("add bad bed bee cab dab dad ebb fab fad fed fee ace abed babe bead beef cafe cede dead deaf deed face fade feed aced".split(" "));
function looseColours(text) {
  const s = text.trim();
  const out = [];
  const whole = /^#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})$/.exec(s);
  if (whole) return HEX_WORDS.has(s.slice(1).toLowerCase()) ? [] : [normHex(s)];
  out.push(...findColours(text, false).filter((c) => !c.startsWith("#")));
  for (const m of text.matchAll(/(?<![\w&#/-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![\w-])/g)) {
    const before = text[m.index - 1] ?? "";
    const long = m[0].length >= 7;
    // inside prose a hex-looking word is not a colour: a short one must follow a quote, "(", "," ":" or "=" directly
    if (before && !(long ? /[\s"'(,:=]/ : /["'(,:=]/).test(before)) continue;
    if (/^#\d{1,4}$/.test(m[0]) || HEX_WORDS.has(m[0].slice(1).toLowerCase())) continue; // "#123" reads as a number, not a colour
    out.push(normHex(m[0]));
  }
  return out;
}

function scanLooseString(tok, out) {
  const text = tok.v;
  if (/^\s*(?:data:|https?:\/\/)/i.test(text) || text.length < 3) return;
  const css = cssInString(text, tok.line);
  out.push(...css.out);
  if (css.found && css.rest === "") return;
  const rest = css.found ? css.rest : text;
  if (FONT_STRING.test(rest)) {
    const f = fontShorthand(squash(rest));
    const size = f.size && fontSizeValue(f.size);
    if (size) out.push({ category: "font-size", value: size, line: tok.line, prop: "font" });
    if (f.family) for (const n of familyNames(f.family)) out.push({ category: "font-family", value: n, line: tok.line, prop: "font" });
    return;
  }
  for (const c of looseColours(maskUrls(rest))) out.push({ category: "colour", value: c, line: tok.line, prop: "(string)" });
}

function maskUrls(s) {
  let out = "";
  let i = 0;
  const re = /(?<![\w-])url\(/gi;
  let m;
  while ((m = re.exec(s))) {
    const close = matchParen(s, m.index + 3);
    out += s.slice(i, m.index) + "url()";
    if (close < 0) return out;
    i = close + 1;
    re.lastIndex = i;
  }
  return out + s.slice(i);
}

export function scanTsText(text) {
  const { streams, strings } = lexTs(text);
  const out = [];
  for (const toks of streams) scanStream(toks, out);
  for (const tok of strings) if (!tok.done) scanLooseString(tok, out);
  return out;
}

/* ===================================================================== tree scanning */

export function scanSource(rel, text) {
  const raw = rel.endsWith(".css") ? scanCssText(text) : scanTsText(text);
  return raw.sort((a, b) => a.line - b.line || CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category));
}

function isScannable(name) {
  if (/\.d\.ts$/.test(name) || /\.(test|spec)\.tsx?$/.test(name)) return false;
  return /\.(css|tsx?)$/.test(name);
}

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (isScannable(e.name)) out.push(p);
  }
}

/** scans <root>/src; returns { files: [rel], occurrences: [{file,line,category,value,prop}] } */
export function scanTree(root = WEB_ROOT) {
  const abs = [];
  walk(path.join(root, "src"), abs);
  const files = [];
  const occurrences = [];
  for (const p of abs) {
    const rel = path.relative(root, p).split(path.sep).join("/");
    if (rel === TOKENS_FILE) continue; // exempt: this is where the tokens live
    files.push(rel);
    for (const o of scanSource(rel, fs.readFileSync(p, "utf8"))) occurrences.push({ file: rel, ...o });
  }
  return { files, occurrences };
}

/** { file: { category: count } }, files with nothing hardcoded left out, keys sorted */
export function countsByFile(occurrences) {
  const map = {};
  for (const o of occurrences) {
    const f = (map[o.file] ??= {});
    f[o.category] = (f[o.category] ?? 0) + 1;
  }
  const sorted = {};
  for (const file of Object.keys(map).sort()) {
    sorted[file] = {};
    for (const cat of CATEGORIES) if (map[file][cat]) sorted[file][cat] = map[file][cat];
  }
  return sorted;
}

export const totalOf = (counts) => Object.values(counts).reduce((a, b) => a + b, 0);

/* ===================================================================== report */

export function buildReport({ files, occurrences }) {
  const categories = {};
  for (const cat of CATEGORIES) {
    const vals = new Map();
    for (const o of occurrences) {
      if (o.category !== cat) continue;
      const v = vals.get(o.value) ?? { value: o.value, count: 0, fileSet: new Set() };
      v.count++;
      v.fileSet.add(o.file);
      vals.set(o.value, v);
    }
    const values = [...vals.values()]
      .sort((a, b) => b.count - a.count || (a.value < b.value ? -1 : 1))
      .map((v) => ({ value: v.value, count: v.count, files: v.fileSet.size }));
    categories[cat] = { distinct: values.length, total: values.reduce((s, v) => s + v.count, 0), values };
  }
  const perFile = countsByFile(occurrences);
  const filesReport = {};
  for (const [file, counts] of Object.entries(perFile)) filesReport[file] = { ...counts, total: totalOf(counts) };
  return { filesScanned: files.length, exempt: TOKENS_FILE, categories, files: filesReport };
}

const fmt = (n) => n.toLocaleString("en-GB");

export function printSummary(report) {
  const lines = [];
  lines.push(`Token inventory: ${fmt(report.filesScanned)} files scanned (${report.exempt} is exempt)`);
  lines.push("");
  lines.push("category".padEnd(14) + "distinct".padStart(10) + "occurrences".padStart(13));
  let totalDistinct = 0;
  let total = 0;
  for (const cat of CATEGORIES) {
    const c = report.categories[cat];
    totalDistinct += c.distinct;
    total += c.total;
    lines.push(cat.padEnd(14) + fmt(c.distinct).padStart(10) + fmt(c.total).padStart(13));
  }
  lines.push("all".padEnd(14) + fmt(totalDistinct).padStart(10) + fmt(total).padStart(13));
  lines.push("");
  lines.push("Top 10 files by hardcoded values:");
  const top = Object.entries(report.files).sort((a, b) => b[1].total - a[1].total || (a[0] < b[0] ? -1 : 1)).slice(0, 10);
  top.forEach(([file, c], k) => {
    const parts = CATEGORIES.filter((cat) => c[cat]).map((cat) => `${cat} ${c[cat]}`);
    lines.push(`${String(k + 1).padStart(3)}. ${file}  ${fmt(c.total)}  (${parts.join(", ")})`);
  });
  return lines.join("\n");
}

function main(argv) {
  let jsonPath = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--json") jsonPath = argv[++i];
    else if (argv[i] === "--help" || argv[i] === "-h") {
      console.log("usage: node scripts/token-inventory.mjs [--json <path>]");
      return 0;
    } else {
      console.error(`unknown argument: ${argv[i]}`);
      return 2;
    }
  }
  const report = buildReport(scanTree());
  if (jsonPath) {
    fs.mkdirSync(path.dirname(path.resolve(jsonPath)), { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2) + "\n");
  }
  console.log(printSummary(report));
  if (jsonPath) console.log(`\nFull report written to ${jsonPath}`);
  return 0;
}

const invokedDirectly = process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
if (invokedDirectly) process.exit(main(process.argv.slice(2)));
