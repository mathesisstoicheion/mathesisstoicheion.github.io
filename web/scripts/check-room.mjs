// A computer's screen is used, not left empty (the owner, 2026-10-23: "the pc version also doesn't use a lot of the
// available space on the page"). A printed page keeps margins, but the type area fills the sheet; on a wide screen the
// site's own column stood in the middle with a third of the window empty on either side. Each page is opened at 1440 and
// 1920 px with motion reduced, and it lists:
//   margin  - the page's column (the header's line, from the logo to the last control) takes less than 80% of the window
//   empty   - a stretch of the page, 300 px tall or more, where nearly half the column (45% or more) stands empty in one
//             piece, at one side or between two things: words set to one side of a wide page with nothing beside them.
//             A column of reading with even margins (its heading hung beside it, its notes in the margin) is a page well
//             used, as a book's is; so is the white round a plate, and a grid's last row that ends short
//   measure - running text whose lines run past 90 characters, too long to read with ease (the cure for an empty
//             stretch is never a longer line)
//   verse   - a line of Greek verse in the reader broken in two, while the window has room for it whole
// usage: node web/scripts/check-room.mjs [base-url] [path…]   (WIDTHS=1440,1920 picks the widths; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/reading", "/academy/reading/letters", "/academy/lesson/letters", "/academy/alphabet",
  "/academy/tables", "/academy/vocabulary", "/academy/practice", "/academy/checkpoint/first-steps",
  "/academy/guide/looking-up", "/library", "/library/author?a=tlg0012", "/author/tlg0012", "/work/tlg0012-tlg001",
  "/read?w=tlg0012.tlg001&tr=perseus-eng3", "/read?w=tlg0003.tlg001", "/search", "/search?q=μῆνιν", "/stoa",
  "/stoa/authors", "/stoa/eras", "/stoa/manuscripts", "/stoa/lyre", "/stoa/antikythera-mechanism", "/stoa/kerameikos",
  "/stoa/ostracism", "/stoa/census", "/stoa/troy", "/treasury", "/treasury/word?l=λόγος", "/downloads", "/account",
  "/about", "/credits", "/guide", "/no-such-page",
];
const WIDTHS = (process.env.WIDTHS ?? "1440,1920").split(",").map(Number);
const FRAME = 0.8, GAP = 0.45, BAND = 300, CHARS = 90;

const MEASURE = ({ GAP, BAND, CHARS }) => {
  const out = [];
  const shown = (e) => e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
  const cls = (e) => `${e.tagName.toLowerCase()}${typeof e.className === "string" && e.className ? "." + e.className.split(" ")[0].replace(/^[A-Z][A-Za-z]+-module__\w+__/, "") : ""}`;
  // the column: the header's line from its first mark to its last (the reader has its own bar in its place)
  let L = Infinity, R = -Infinity;
  for (const bar of document.querySelectorAll("[class*='rbarIn'], [data-site-header], body > header, header")) {
    for (const e of bar.querySelectorAll("a, button, img, svg")) {
      if (!shown(e)) continue;
      const r = e.getBoundingClientRect();
      if (r.width > 0) { L = Math.min(L, r.left); R = Math.max(R, r.right); }
    }
    if (R > L) break;
  }
  if (!(R > L)) return { frame: 0, out: ["margin: no header line found to measure the column by"] };
  const W = R - L;
  // everything set on the page below its head: lines of words (a text's own boxes), pictures and controls
  const main = document.querySelector("main");
  const head = main.querySelector(".ph, .page-head, [class*='cover' i], [class*='hero' i], [class*='titlePage'], [class*='__tp']");
  const from = head ? head.getBoundingClientRect().bottom + scrollY : main.getBoundingClientRect().top + scrollY;
  const boxes = [];
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!n.data.trim() || !el || !shown(el) || el.closest("[data-overlay], .visually-hidden, [aria-hidden='true'], dialog")) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const b of r.getClientRects()) if (b.width > 1 && b.height > 1) boxes.push({ l: b.left, r: b.right, t: b.top + scrollY, b: b.bottom + scrollY, el });
  }
  for (const e of main.querySelectorAll("img, svg, canvas, video, input, select, textarea, button, iframe, [class*='bar' i]")) {
    if (!shown(e) || e.closest("svg") !== e && e.closest("svg") || e.closest("[data-overlay], .visually-hidden, dialog")) continue;
    const b = e.getBoundingClientRect();
    if (b.width > 4 && b.height > 4) boxes.push({ l: b.left, r: b.right, t: b.top + scrollY, b: b.bottom + scrollY, el: e });
  }
  // a frame drawn round a part (a border on both sides, or a hairline all round) fills the width it is drawn to
  for (const e of main.querySelectorAll("*")) {
    if (!shown(e) || e.closest("[data-overlay], dialog")) continue;
    const s = getComputedStyle(e);
    const sides = parseFloat(s.borderLeftWidth) > 0 && parseFloat(s.borderRightWidth) > 0 && s.borderLeftStyle !== "none";
    if (!sides && !/0px 0px 0px [1-9][\d.]*px inset/.test(s.boxShadow)) continue;
    const b = e.getBoundingClientRect();
    if (b.width > 40 && b.height > 4) boxes.push({ l: b.left, r: b.right, t: b.top + scrollY, b: b.bottom + scrollY, el: e });
  }
  // a row ruled across the column (a line of a list or a contents, with its rule or its dotted leader) fills its width
  for (const e of main.querySelectorAll("*")) {
    if (!shown(e) || e.closest("[data-overlay], dialog")) continue;
    const s = getComputedStyle(e), b = e.getBoundingClientRect();
    if (b.width < W * 0.5 || b.height > 160 || b.height < 1) continue;
    const ruled = ["Top", "Bottom"].some((k) => parseFloat(s[`border${k}Width`]) > 0 && s[`border${k}Style`] !== "none" && s[`border${k}Color`] !== "rgba(0, 0, 0, 0)")
      || /0px -?[1-9][\d.]*px 0px( 0px)? inset/.test(s.boxShadow);
    if (ruled) boxes.push({ l: b.left, r: b.right, t: b.top + scrollY, b: b.bottom + scrollY, el: e });
  }
  // a margin that stays beside the text as it is read (position: sticky) stands beside all of the part it belongs to
  for (const e of main.querySelectorAll("*")) {
    if (!shown(e) || getComputedStyle(e).position !== "sticky" || !e.parentElement) continue;
    const b = e.getBoundingClientRect(), p = e.parentElement.getBoundingClientRect();
    if (b.width > 40) boxes.push({ l: b.left, r: b.right, t: b.top + scrollY, b: p.bottom + scrollY, el: e });
  }
  // a grid of cards or columns fills the width it is laid out across: a last row that ends short is the end of a list
  for (const e of main.querySelectorAll("*")) {
    if (!shown(e) || e.closest("[data-overlay], dialog")) continue;
    const s = getComputedStyle(e);
    // (a grid of like tracks, as cards are set in; a page's own layout of a column and its margin has tracks unlike)
    const tracks = s.display.endsWith("grid") ? s.gridTemplateColumns.trim().split(/\s+/).map(parseFloat) : [];
    if (tracks.length < 2 || Math.max(...tracks) - Math.min(...tracks) > 2) continue;
    const b = e.getBoundingClientRect();
    if (b.width > 40 && b.height > 4) boxes.push({ l: b.left, r: b.right, t: b.top + scrollY, b: b.bottom + scrollY, el: e });
  }
  // a plate (a photograph with its caption) stands in white of its own, as a book's plates do: beside it the page is not empty
  const plates = [...main.querySelectorAll("figure, .plate")].filter(shown).map((e) => { const b = e.getBoundingClientRect(); return { t: b.top + scrollY, b: b.bottom + scrollY }; });
  const end = Math.max(from, ...boxes.map((b) => b.b));
  // slice the page into strips of 50 px; in each, the widest stretch of the column with nothing set in it, whether at one
  // side or between two things. A run of strips where that stretch is more than GAP of the column is an empty stretch;
  // a column of text with even margins either side of it (a heading hung beside it, a margin of notes) is not
  const STEP = 50;
  let run = null;
  const runs = [];
  for (let y = from; y < end; y += STEP) {
    const inStrip = boxes.filter((b) => b.b > y && b.t < y + STEP).map((b) => [Math.max(L, b.l), Math.min(R, b.r)]).filter(([a, b]) => b > a).sort((a, b) => a[0] - b[0]);
    if (!inStrip.length || plates.some((f) => f.b > y && f.t < y + STEP)) { if (run) { runs.push(run); run = null; } continue; }   // white between parts is the page's room
    let gap = 0, at = L;
    for (const [a, b] of inStrip) { gap = Math.max(gap, a - at); at = Math.max(at, b); }
    gap = Math.max(gap, R - at);
    if (gap > W * GAP) { if (!run) run = { y, gap: 0 }; run.gap = Math.max(run.gap, gap); run.end = y + STEP; }
    else if (run) { runs.push(run); run = null; }
  }
  if (run) runs.push(run);
  for (const r of runs) if (r.end - r.y >= BAND) {
    // name what stands in the stretch: the nearest named boxes round a word in its middle
    const yMid = (r.y + r.end) / 2;
    const at = boxes.filter((b) => b.t < r.end && b.b > r.y).sort((a, b) => Math.abs((a.t + a.b) / 2 - yMid) - Math.abs((b.t + b.b) / 2 - yMid))[0];
    const names = [];
    for (let a = at?.el; a && a !== main && names.length < 3; a = a.parentElement) if (typeof a.className === "string" && /module__/.test(a.className)) names.push(cls(a));
    out.push(`empty: from ${Math.round(r.y)} to ${Math.round(r.end)} px down, ${Math.round((r.gap / W) * 100)}% of the column stands empty${names.length ? ` (${names.join(" in ")})` : ""}`);
  }
  // running text: a paragraph of 160 characters or more, measured line by line in its own face
  const canvas = document.createElement("canvas").getContext("2d");
  for (const p of main.querySelectorAll("p, li, dd, blockquote, figcaption")) {
    if (!shown(p) || p.closest("[data-overlay], dialog, nav")) continue;
    const text = (p.innerText ?? "").replace(/\s+/g, " ").trim();
    if (text.length < 160 || p.querySelector("p, li")) continue;
    const s = getComputedStyle(p);
    canvas.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    const per = canvas.measureText(text).width / text.length;
    // each line's width, from the words' own boxes (a range over the whole paragraph would count its boxes too)
    const lines = new Map();
    const tw = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    for (let t = tw.nextNode(); t; t = tw.nextNode()) {
      if (!t.data.trim() || !shown(t.parentElement)) continue;
      // the block the words run in: a row laid out in columns is several lines side by side, not one long one
      let blk = t.parentElement;
      while (blk !== p && getComputedStyle(blk).display.startsWith("inline")) blk = blk.parentElement;
      const r = document.createRange(); r.selectNodeContents(t);
      for (const b of r.getClientRects()) {
        if (b.width < 1) continue;
        const k = `${[...p.querySelectorAll("*")].indexOf(blk)}:${Math.round((b.top + b.bottom) / 2 / 6)}`;
        lines.set(k, [...(lines.get(k) ?? []), { l: b.left, r: b.right }]);
      }
    }
    // pieces of one line further apart than a wide space are side by side (a paragraph set in columns), not one line
    const gap = 1.5 * parseFloat(s.fontSize);
    const widths = [...lines.values()].flatMap((bs) => {
      const runs = [];
      for (const b of bs.sort((x, y) => x.l - y.l)) {
        const last = runs.at(-1);
        if (last && b.l - last.r < gap) last.r = Math.max(last.r, b.r); else runs.push({ ...b });
      }
      return runs.map((x) => x.r - x.l);
    });
    const widest = Math.max(0, ...widths);
    const chars = widest / per;
    if (chars > CHARS) out.push(`measure: ${cls(p)} "${text.slice(0, 30)}" runs ${Math.round(chars)} characters to a line`);
  }
  // the reader's verse: each line of Greek kept whole
  let broken = 0, first = "";
  for (const line of main.querySelectorAll(".grc [class*='__line']")) {
    if (!shown(line)) continue;
    const words = [...line.childNodes].filter((n) => !(n.nodeType === 1 && /speaker/i.test(n.className)));
    const tops = new Set();
    for (const n of words) { const r = document.createRange(); r.selectNodeContents(n); for (const b of r.getClientRects()) if (b.width > 1) tops.add(Math.round(b.top / 4)); }
    if (tops.size > 1) { broken++; first ||= line.innerText.trim().slice(0, 30); }
  }
  if (broken) out.push(`verse: ${broken} line(s) of Greek verse broken in two, the first "${first}"`);
  return { frame: W, out };
};

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
let n = 0;
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 1000 }, reducedMotion: "reduce" });
  await ctx.addInitScript(() => {
    try {
      if (!localStorage.getItem("mathesis:settings")) localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduce" }, version: 2 }));
    } catch { /* storage unavailable */ }
  });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    const where = `${path} at ${w}px`;
    try {
      await page.goto(base + path, { waitUntil: "networkidle", timeout: 45000 });
    } catch (e) {
      found.push(`${where}: did not open (${e.message.split("\n")[0]})`);
      continue;
    }
    await page.waitForTimeout(500);
    n++;
    const { frame, out } = await page.evaluate(MEASURE, { GAP, BAND, CHARS });
    if (frame && frame < w * FRAME) found.push(`margin: ${where}: the page's column is ${Math.round(frame)} px, ${Math.round((frame / w) * 100)}% of the window`);
    for (const p of out) found.push(`${p.split(":")[0]}: ${where}: ${p.slice(p.indexOf(":") + 2)}`);
  }
  await ctx.close();
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : `every page uses the screen, at ${WIDTHS.join(" and ")} px (${n} page views)`);
process.exit(found.length ? 1 : 0);
