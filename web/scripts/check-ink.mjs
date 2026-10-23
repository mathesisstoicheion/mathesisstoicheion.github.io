// Softer words are still easy to read, in Paper and in Night (the owner, 2026-10-23: "the grey text can be a little
// unintelligible when reading"). Every line of words on a page is measured as it is painted: its colour, made fainter by
// any see-through colour or opacity on it or round it, against the colour of the paper or panel behind it. It lists:
//   grey   - words in ink or a softer ink (captions, notes, credits, the English beside the Greek) under 7 : 1, the
//            "enhanced" contrast of the web's accessibility guidelines (WCAG 1.4.6)
//   colour - words in the red or another of the page's colours (well established, debated, done…) under 4.5 : 1
// Words on a photograph or a shaded band, in a drawing set in a figure, in a map, in a disabled control, or in a box drawn for screen readers only are left out. Each
// page is opened at a computer's and a phone's width, in Paper and in Night, with motion reduced so that nothing is
// caught half inked in.
// usage: node web/scripts/check-ink.mjs [base-url] [path…]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/reading", "/academy/reading/letters", "/academy/lesson/letters", "/academy/alphabet",
  "/academy/tables", "/academy/vocabulary", "/academy/practice", "/academy/review", "/academy/checkpoint/first-steps",
  "/academy/guide/looking-up", "/library", "/library/author?a=tlg0012", "/author/tlg0012", "/work/tlg0012-tlg001",
  "/read?w=tlg0012.tlg001&tr=perseus-eng3", "/search", "/search?q=μῆνιν", "/stoa", "/stoa/authors", "/stoa/eras",
  "/stoa/manuscripts", "/stoa/lyre", "/stoa/antikythera-mechanism", "/stoa/kerameikos", "/stoa/ostracism", "/stoa/census",
  "/treasury", "/treasury/word?l=λόγος", "/downloads", "/account", "/about", "/credits", "/guide", "/no-such-page",
];
const LOOKS = ["paper", "night"];
const WIDTHS = [1280, 390];

const MEASURE = () => {
  const rgba = (s) => { const m = s.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0]; const k = s.startsWith("color(") ? 255 : 1; return [m[0] * k, m[1] * k, m[2] * k, m[3] ?? 1]; };   // rgb() or color(srgb …), which a colour mixed in CSS comes out as
  const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3]));
  const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const root = getComputedStyle(document.documentElement);
  const hex = (c) => c.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");
  // the page's colours that are not ink: words in them need only the ordinary 4.5 : 1
  const probe = document.createElement("i"); document.body.append(probe);
  const COLOURS = new Set();
  for (const v of ["--rubric", "--rubric-2", "--accent", "--blue", "--ochre", "--legend", "--ok", "--warn", "--danger", "--case-nom", "--case-gen", "--case-dat", "--case-acc", "--case-voc", "--pen-red", "--pen-ochre", "--pen-blue", "--pen-green", "--accent-on-ink", "--rubric-on-ink"]) {
    probe.style.color = `var(${v})`; COLOURS.add(hex(rgba(getComputedStyle(probe).color)));
  }
  probe.remove();
  const paper = rgba(getComputedStyle(document.documentElement).backgroundColor);
  // what lies behind an element: the first solid background up the tree (a see-through one is laid over what is beneath)
  const behind = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage !== "none") return null;   // words on a picture or a shaded band: no one colour behind them
      const c = rgba(s.backgroundColor);
      if (c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
    }
    let bg = paper;
    for (const c of layers.reverse()) bg = over(c, bg);
    return bg;
  };
  const fade = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return o; };
  const out = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!n.data.trim() || !el || seen.has(el)) continue;
    seen.add(el);
    if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
    if (el.closest("figure") && !el.closest("figcaption")) continue;   // a drawing of the page (the guide's pictures), not words to read
    if (el.closest("svg, [disabled], [aria-disabled='true'], .visually-hidden, .skip, [data-overlay][hidden], option, [class*='map' i]")) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) continue;
    const s = getComputedStyle(el);
    const bg = behind(el);
    if (!bg) continue;
    const c = rgba(s.color);
    c[3] *= fade(el);
    const shown = over(c, bg);
    const k = ratio(shown, bg);
    const colour = COLOURS.has(hex(c)) && c[3] >= 0.99;
    const need = colour ? 4.5 : 7;
    if (k < need - 0.005) {
      const cls = (typeof el.className === "string" ? el.className.split(" ")[0] : "").replace(/^[A-Z][A-Za-z]+-module__\w+__/, "");
      out.push({ kind: colour ? "colour" : "grey", what: `${el.tagName.toLowerCase()}${cls ? "." + cls : ""} "${n.data.trim().slice(0, 32)}"`, k: Math.round(k * 100) / 100, need, fg: hex(shown), bg: hex(bg) });
    }
  }
  return out;
};

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
let pages = 0;
for (const look of LOOKS) for (const w of WIDTHS) {
  const phone = w < 761;
  const ctx = await browser.newContext({ viewport: { width: w, height: phone ? 844 : 900 }, reducedMotion: "reduce", isMobile: phone, hasTouch: phone, colorScheme: look === "night" ? "dark" : "light" });
  await ctx.addInitScript(() => {
    try {
      if (!localStorage.getItem("mathesis:settings")) localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduce" }, version: 2 }));
    } catch { /* storage unavailable */ }
  });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    const where = `${path} at ${w}px in ${look === "night" ? "Night" : "Paper"}`;
    try {
      await page.goto(base + path, { waitUntil: "networkidle", timeout: 45000 });
    } catch (e) {
      found.push(`${where}: did not open (${e.message.split("\n")[0]})`);
      continue;
    }
    await page.waitForTimeout(400);
    pages++;
    const res = await page.evaluate(MEASURE);
    const byWhat = new Map();
    for (const r of res) if (!byWhat.has(r.what)) byWhat.set(r.what, r);
    for (const r of byWhat.values()) found.push(`${r.kind}: ${where}: ${r.what} reads at ${r.k} : 1 (#${r.fg} on #${r.bg}), under ${r.need} : 1`);
  }
  await ctx.close();
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : `every line of words reads clearly (${pages} page views, Paper and Night, computer and phone)`);
process.exit(found.length ? 1 : 0);
