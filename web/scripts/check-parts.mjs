// A page's parts stand clearly apart on a computer (the owner, 2026-10-23: "the seperate sections in the pages blend into
// each other, visually"). On the printed page a new part begins as a book's chapter does: a rule of ink across the
// column, room above it, and its heading. For every heading of a part (an h2 in the page, outside its head, a panel or a
// card), it lists:
//   rule  - no rule of ink across the column between the part before and this heading (a faint hairline, a rule that
//           spans only a little of the column, or none at all, lets the two parts run together)
//   room  - less than 48 px between the end of the part before and the rule (or the heading, where there is no rule)
// Each page is opened at two computer widths with motion reduced. A part that comes first after the page's head is
// measured from the head's end.
// usage: node web/scripts/check-parts.mjs [base-url] [path…]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/reading", "/academy/reading/letters", "/academy/lesson/letters", "/academy/alphabet",
  "/academy/tables", "/academy/vocabulary", "/academy/practice", "/academy/review", "/academy/checkpoint/first-steps",
  "/academy/guide/looking-up", "/library", "/library/author?a=tlg0012", "/author/tlg0012", "/work/tlg0012-tlg001",
  "/search", "/search?q=μῆνιν", "/stoa", "/stoa/authors", "/stoa/eras", "/stoa/manuscripts", "/stoa/lyre",
  "/stoa/antikythera-mechanism", "/stoa/kerameikos", "/stoa/ostracism", "/stoa/census", "/stoa/troy", "/treasury",
  "/treasury/word?l=λόγος", "/downloads", "/account", "/about", "/credits", "/guide",
];
const WIDTHS = [1440, 1024];
const ROOM = 48;

const MEASURE = (ROOM) => {
  const rgba = (s) => { const m = s.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0]; const k = s.startsWith("color(") ? 255 : 1; return [m[0] * k, m[1] * k, m[2] * k, m[3] ?? 1]; };   // rgb() or color(srgb …), which a colour mixed in CSS comes out as
  const paper = rgba(getComputedStyle(document.documentElement).backgroundColor);
  const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const contrast = (c) => { const m = [0, 1, 2].map((i) => c[i] * c[3] + paper[i] * (1 - c[3])); const x = lum(m), y = lum(paper); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const shown = (e) => e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && e.getBoundingClientRect().height > 0;
  const Y = (v) => v + scrollY;
  // every horizontal line drawn on the page: a border along the top or foot of a box, or one drawn as an inset shadow
  const lines = [];
  for (const e of document.querySelectorAll("main *, main")) {
    if (!shown(e)) continue;
    const s = getComputedStyle(e), r = e.getBoundingClientRect();
    if (r.width < 40) continue;
    const add = (y, c) => lines.push({ y: Y(y), x0: r.left, x1: r.right, k: contrast(rgba(c)) });
    if (parseFloat(s.borderTopWidth) >= 1 && s.borderTopStyle !== "none") add(r.top, s.borderTopColor);
    if (parseFloat(s.borderBottomWidth) >= 1 && s.borderBottomStyle !== "none") add(r.bottom, s.borderBottomColor);
    for (const m of s.boxShadow.matchAll(/(rgba?\([^)]*\)) 0px (-?\d+(?:\.\d+)?)px 0px 0px inset/g)) {
      const dy = parseFloat(m[2]);
      if (dy > 0) add(r.top, m[1]); else if (dy < 0) add(r.bottom, m[1]);
    }
    if (e.tagName === "HR") add(r.top, s.borderTopColor === "rgba(0, 0, 0, 0)" ? s.backgroundColor : s.borderTopColor);
    if (r.height <= 2 && rgba(s.backgroundColor)[3] > 0) add(r.top, s.backgroundColor);
    // a rule drawn by a box of its own set over the element (a heading hung in the margin rules the whole width so)
    for (const k of ["::before", "::after"]) {
      const ps = getComputedStyle(e, k);
      if (ps.content === "none" || ps.position !== "absolute" || !(parseFloat(ps.borderTopWidth) >= 1) || ps.borderTopStyle === "none") continue;
      const x0 = r.left + (parseFloat(ps.left) || 0), w = parseFloat(ps.width);
      if (w > 0) lines.push({ y: Y(r.top + (parseFloat(ps.top) || 0)), x0, x1: x0 + w, k: contrast(rgba(ps.borderTopColor)) });
    }
  }
  const head = document.querySelector("main .ph, main .page-head, main header");
  const headEnd = head ? Y(head.getBoundingClientRect().bottom) : null;
  const out = [];
  for (const h of document.querySelectorAll("main h2")) {
    if (!shown(h) || h.closest(".ph, [data-overlay], dialog, aside, .visually-hidden, figure, [class*='card' i], [class*='panel' i], details:not([open])")) continue;
    const hr = h.getBoundingClientRect();
    if (parseFloat(getComputedStyle(h).fontSize) < 22) continue;   // a small heading inside a part, not a part's own
    const top = Y(hr.top);
    // the rule that opens the part: the nearest line of ink across the column above the heading (a small label may stand
    // between them, as a kicker over a title); then the end of what comes before it
    const col = h.parentElement.getBoundingClientRect();
    const span = Math.min(col.width, 600);
    // the heading's own labels set over it (a kicker, a chapter's number): one or two short boxes just before it
    const group = [];
    for (let e = h.previousElementSibling; e && group.length < 2 && e.getBoundingClientRect().height < 120; e = e.previousElementSibling) group.push(e);
    const groupTop = Math.min(top, ...group.filter(shown).map((e) => Y(e.getBoundingClientRect().top)));
    const near = lines.filter((l) => l.y >= groupTop - 140 && l.y <= top + 4 && l.x1 - l.x0 >= span * 0.6 && l.x0 <= hr.left + 8);
    // (or a rule of ink ruled straight under the heading, as a catalogue sets a group's name over its list)
    const under = lines.find((l) => l.k >= 3 && l.y >= Y(hr.bottom) - 1 && l.y <= Y(hr.bottom) + 24 && l.x1 - l.x0 >= span * 0.6 && l.x0 <= hr.left + 8);
    const rule = near.filter((l) => l.k >= 3).sort((a, b) => b.y - a.y)[0] ?? (under && { ...under, y: top }) ?? near.sort((a, b) => b.k - a.k)[0];
    const until = rule && rule.k >= 3 ? rule.y : top;
    let prev = headEnd ?? 0;
    for (const e of document.querySelectorAll("main p, main li, main a, main button, main img, main figure, main table, main h2, main h3, main dl, main svg, main input, main .ph")) {
      if (!shown(e) || e.contains(h) || h.contains(e) || group.some((g) => g.contains(e))) continue;
      const er = e.getBoundingClientRect();
      if (er.right <= col.left || er.left >= col.right) continue;   // beside the column (a margin's contents), not above it
      const b = Y(er.bottom);
      if (b <= until + 1 && b > prev) prev = b;
    }
    if (prev >= top - 0.5 && !headEnd) continue;
    const cls = (e) => `${e.tagName.toLowerCase()}${typeof e.className === "string" && e.className ? "." + e.className.split(" ")[0].replace(/^[A-Z][A-Za-z]+-module__\w+__/, "") : ""}`;
    const name = `"${h.innerText.trim().slice(0, 40)}" (${cls(h)} in ${cls(h.parentElement)})`;
    if (!rule || rule.k < 3) out.push(`rule: ${name} has ${rule ? `only a faint rule above it (${rule.k.toFixed(1)} : 1)` : "no rule above it"}`);
    const room = until - prev;
    if (room < ROOM - 0.5) out.push(`room: ${name} stands ${Math.round(room)} px under the part before it`);
  }
  return out;
};

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
let n = 0;
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
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
    await page.waitForTimeout(400);
    n++;
    for (const p of await page.evaluate(MEASURE, ROOM)) found.push(`${p.split(":")[0]}: ${where}: ${p.slice(p.indexOf(":") + 2)}`);
  }
  await ctx.close();
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : `every part of every page stands apart, under a rule of ink with room above it (${n} page views)`);
process.exit(found.length ? 1 : 0);
