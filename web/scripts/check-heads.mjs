// Every page's head stands at one height on a computer, and stays where it first appears (the owner, 2026-10-23: "the
// heros load at different heights"). A page head (components/PageHead.tsx) is the path in small capitals, the title and
// the page's plate at the right. Turning from page to page, the eye should find them in the same place every time. It
// lists, at three computer widths (1280, 1440 and 1920 px):
//   kicker      - a page whose first line (the path over the title) starts higher or lower than on the other pages
//   title       - a page whose title stands at another distance under its path than on the other pages (a line in Greek
//                 over the title, as the Oracle's maxim, is part of the head and is allowed for)
//   plate       - a page whose plate starts at another height than its path, or whose photograph is another size than
//                 the other pages' (every head's photograph has the one frame, as a book's plates of one format)
//   jump        - a head that moves, or changes height, after it first appears (fonts, photographs or words that arrive
//                 late must take the room kept for them)
//   path        - a page whose path runs onto a second line while its head has room for it on one (the measure kept
//                 for running text is not a path's: "The Academy ·" stood alone over "The grammar course · Checkpoint I")
// Each page is opened with motion reduced, so what is measured is where things stand, not where they are inking in from;
// the head is measured on every frame from its first paint until the page has been still for a while.
// usage: node web/scripts/check-heads.mjs [base-url] [path…]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/reading", "/academy/reading/letters", "/academy/reading/desire-to-know", "/academy/lesson/letters",
  "/academy/lesson/prepositions", "/academy/checkpoint/first-steps", "/academy/guide/looking-up", "/academy/alphabet",
  "/academy/tables", "/academy/vocabulary", "/academy/practice", "/academy/review", "/academy/today", "/academy/studio",
  "/library", "/library/author?a=tlg0012", "/author/tlg0012", "/work/tlg0012-tlg001", "/work/tlg0656-tlg001", "/search",
  "/search?q=μῆνιν", "/stoa", "/stoa/authors", "/stoa/eras", "/stoa/manuscripts", "/stoa/lyre", "/stoa/antikythera-mechanism",
  "/stoa/kerameikos", "/stoa/ostracism", "/stoa/delphi", "/stoa/troy", "/stoa/periplus", "/stoa/census", "/treasury",
  "/treasury/word?l=λόγος", "/treasury/translations", "/library/private", "/downloads", "/account", "/about", "/credits",
  "/guide", "/no-such-page",
];
const WIDTHS = [[1280, 800], [1440, 900], [1920, 1080]];
const TOL = 1.5;   // px: what rounding to 64ths of a pixel and a browser's text metrics may move a box by

// measured on every frame, from the first one: the head's path, title, plate and photograph, and where the head ends
const RECORD = () => {
  const t0 = performance.now();
  const log = (window.__heads = []);
  const y = (r) => Math.round((r.top + scrollY) * 10) / 10;
  const tick = () => {
    // (the home page's title page is a head too, marked by data-head: its kicker and title start where every head's do)
    const head = document.querySelector(".ph, [data-head]");
    const k = head?.querySelector(".ph-path, [data-head-path]"), t = head?.querySelector(".ph-title, [data-head-title]");
    if (head && k && t && t.getBoundingClientRect().height > 0) {
      const hr = head.getBoundingClientRect(), kr = k.getBoundingClientRect(), tr = t.getBoundingClientRect();
      const inscr = head.querySelector(".ph-inscr");
      const plate = [...head.querySelectorAll(".piece-desk")].find((e) => e.getBoundingClientRect().width > 0);
      const ph = plate?.querySelector(".plate-ph")?.getBoundingClientRect();
      const r = {
        // under a line in Greek over the title, the title is measured from that line's foot instead of the path's
        k: y(kr), kh: Math.round(kr.height * 10) / 10, t: y(tr), i: inscr ? Math.round((inscr.getBoundingClientRect().bottom - kr.bottom) * 10) / 10 : 0,
        p: plate ? y(plate.getBoundingClientRect()) : null, pw: ph ? Math.round(ph.width * 10) / 10 : null, ph: ph ? Math.round(ph.height * 10) / 10 : null,
        end: Math.round((hr.bottom + scrollY) * 10) / 10,
      };
      const last = log.at(-1);
      if (!last || JSON.stringify(last.r) !== JSON.stringify(r)) log.push({ at: Math.round(performance.now() - t0), r });
    }
    if (performance.now() - t0 < 15000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const mode = (xs) => {
  const n = new Map();
  for (const x of xs) n.set(x, (n.get(x) ?? 0) + 1);
  return [...n].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0];
};

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
const noHead = new Set();
for (const [w, h] of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  await ctx.addInitScript(() => {
    try {
      if (!localStorage.getItem("mathesis:settings")) localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduce" }, version: 2 }));
    } catch { /* storage unavailable */ }
  });
  await ctx.addInitScript(RECORD);
  const page = await ctx.newPage();
  const heads = [];
  for (const path of PAGES) {
    const where = `${path} at ${w}px`;
    try {
      await page.goto(base + path, { waitUntil: "networkidle", timeout: 45000 });
    } catch (e) {
      found.push(`${where}: did not open (${e.message.split("\n")[0]})`);
      continue;
    }
    await page.waitForTimeout(2500);
    const log = await page.evaluate(() => window.__heads);
    if (!log?.length) { noHead.add(path); continue; }
    const first = log[0].r, last = log.at(-1).r;
    heads.push({ path, where, r: last });
    // a path on two lines that would stand on one: its steps' widths, the red rule before them and the gaps between them
    const wrapped = await page.evaluate(() => {
      const k = document.querySelector(".ph .ph-path");
      const steps = k ? [...k.children].filter((e) => e.getBoundingClientRect().width > 0) : [];
      const lines = new Set(steps.map((e) => Math.round(e.getBoundingClientRect().top))).size;
      if (lines < 2) return null;
      const room = (k.closest(".ph-text") ?? k.parentElement).getBoundingClientRect().width;
      const rule = getComputedStyle(k, "::before"), gap = parseFloat(getComputedStyle(k).columnGap) || 0;
      const need = (parseFloat(rule.width) || 0) + (parseFloat(rule.marginRight) || 0) + steps.reduce((n, e) => n + e.getBoundingClientRect().width + gap, 0);
      return need + 1 < room ? { lines, need: Math.round(need), room: Math.round(room) } : null;   // (a pixel for rounding)
    });
    if (wrapped) found.push(`path: ${where}: the path runs onto ${wrapped.lines} lines in a head ${wrapped.room} px wide, though it needs ${wrapped.need} px on one`);
    // a head that moves after it first appears: its path, its title, its plate, or where it ends
    const moved = [];
    if (Math.abs(first.k - last.k) > TOL) moved.push(`its path from ${first.k} to ${last.k} px`);
    if (Math.abs(first.t - last.t) > TOL) moved.push(`its title from ${first.t} to ${last.t} px`);
    if (first.p !== null && last.p !== null && Math.abs(first.p - last.p) > TOL) moved.push(`its plate from ${first.p} to ${last.p} px`);
    if ((first.ph ?? 0) && Math.abs(first.ph - last.ph) > TOL) moved.push(`its photograph from ${first.ph} to ${last.ph} px tall`);
    if (Math.abs(first.end - last.end) > TOL) moved.push(`its end from ${first.end} to ${last.end} px (everything under it moves)`);
    if (moved.length) found.push(`jump: ${where}: the head moves after it first appears: ${moved.join("; ")} (${log.length - 1} change(s), the last at ${log.at(-1).at} ms)`);
  }
  if (!heads.length) continue;
  // one height for every page's path; one distance from the path to the title; the plate level with the path, one size
  const k = mode(heads.map((x) => x.r.k));
  const gap = mode(heads.map((x) => Math.round((x.r.t - x.r.k - x.r.kh - x.r.i) * 10) / 10));
  const plates = heads.filter((x) => x.r.pw);
  const pw = mode(plates.map((x) => x.r.pw)), ph = mode(plates.map((x) => x.r.ph));
  const lift = mode(plates.map((x) => Math.round((x.r.p - x.r.k) * 10) / 10));
  for (const { where, r } of heads) {
    if (Math.abs(r.k - k) > TOL) found.push(`kicker: ${where}: the head starts at ${r.k} px, ${Math.round((r.k - k) * 10) / 10} px from the other pages' ${k} px`);
    const g = r.t - r.kh - r.k - r.i;
    if (Math.abs(g - gap) > TOL) found.push(`title: ${where}: the title stands ${Math.round(g * 10) / 10} px under its path, the other pages' ${gap} px`);
    if (!r.pw) continue;
    if (Math.abs(r.p - r.k - lift) > TOL) found.push(`plate: ${where}: the plate starts ${Math.round((r.p - r.k) * 10) / 10} px from the path, the other pages' ${lift} px`);
    if (Math.abs(r.pw - pw) > TOL || Math.abs(r.ph - ph) > TOL) found.push(`plate: ${where}: the photograph is ${r.pw} × ${r.ph} px, the other pages' ${pw} × ${ph} px`);
  }
  console.log(`${w}px: ${heads.length} heads; the path at ${k} px, the title ${gap} px under it, the plate ${lift} px from the path, its photograph ${pw} × ${ph} px`);
  await ctx.close();
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
if (noHead.size) console.log(`(no page head: ${[...noHead].join(", ")})`);
console.log(found.length ? `\n${found.length} problem(s)` : `every page head stands at one height and stays where it first appears, at ${WIDTHS.map(([w]) => w).join(", ")} px`);
process.exit(found.length ? 1 : 0);
