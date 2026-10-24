// Nothing spills out of its frame or off the screen (the owner, 2026-10-23, a word's panel in the census on a phone: a
// button running past the frame's right line, the longest bars and their numbers cut off at the screen's edge, a frame line
// through a divider; "fix overlapping issues like this"). A page that clips its sides (main has overflow-x: clip, so
// nothing can nudge it sideways) hides what spills instead of scrolling, so check-sideways never sees it. It lists:
//   off-screen  - words, a picture or a bar that run past the left or right edge of the screen
//   out-frame   - words, a picture, a button or a bar that cross the line of a frame drawn round them (a border, or a
//                 hairline drawn as an inset shadow), or run out of a box that cuts off what overflows it
// Words are measured line by line (a text's own boxes), so a number pushed out beside a bar is found even when its box
// is not. A row meant to be scrolled sideways (overflow-x: auto) is its own world: what is inside it is not checked
// against the screen. Each page is opened with motion reduced, scrolled to its end, and, where a step is given, after
// clicking what the step names (a word in the census, to open its panel).
// usage: node web/scripts/check-spill.mjs [base-url] [path…]   (WIDTHS=390,1280 picks the widths; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
// a page, or a page and what to click once it is open
const PAGES = only.length ? only.map((p) => [p]) : [
  ["/"], ["/academy"], ["/academy/reading"], ["/academy/reading/letters"], ["/academy/lesson/letters"], ["/academy/alphabet"],
  ["/academy/tables"], ["/academy/vocabulary"], ["/academy/practice"], ["/academy/review"], ["/academy/today"],
  ["/academy/checkpoint/first-steps"], ["/academy/guide/looking-up"], ["/library"], ["/library/author?a=tlg0012"],
  ["/author/tlg0012"], ["/work/tlg0012-tlg001"], ["/read?w=tlg0012.tlg001&tr=perseus-eng3"], ["/search"], ["/search?q=μῆνιν"],
  ["/stoa"], ["/stoa/authors"], ["/stoa/eras"], ["/stoa/manuscripts"], ["/stoa/lyre"], ["/stoa/antikythera-mechanism"],
  ["/stoa/kerameikos"], ["/stoa/ostracism"], ["/stoa/troy"], ["/stoa/periplus"], ["/stoa/census"],
  ["/stoa/census", "census-word"], ["/stoa/census?c=place", "census-word"], ["/treasury"], ["/treasury/word?l=λόγος"],
  ["/downloads"], ["/account"], ["/about"], ["/credits"], ["/guide"], ["/no-such-page"],
];
const WIDTHS = (process.env.WIDTHS ?? "390,1280").split(",").map(Number);
const STEPS = {
  // the census: the first word in the list, so its panel opens with its counts and charts
  "census-word": async (page) => {
    await page.locator("ol li button, ul li button").filter({ hasText: /\S/ }).first().click();
    await page.waitForTimeout(2500);
  },
};

const FIND = () => {
  const W = document.documentElement.clientWidth;
  const out = [];
  const css = (e) => getComputedStyle(e);
  const shown = (e) => e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
  const name = (e) => {
    const c = typeof e.className === "string" ? e.className.split(" ")[0].replace(/_[A-Za-z0-9-]{5,}$/, "").replace(/^[A-Z][A-Za-z]+_/, "") : "";
    return `${e.tagName.toLowerCase()}${c ? "." + c : ""}`;
  };
  const said = (e) => (e.innerText || e.getAttribute("aria-label") || e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
  // a frame: a border on both sides, or a hairline drawn all round as an inset shadow; or a box that cuts off what overflows
  const frameOf = (e) => {
    const s = css(e);
    const bl = parseFloat(s.borderLeftWidth) && s.borderLeftStyle !== "none" && s.borderLeftColor !== "rgba(0, 0, 0, 0)";
    const br = parseFloat(s.borderRightWidth) && s.borderRightStyle !== "none" && s.borderRightColor !== "rgba(0, 0, 0, 0)";
    const inset = /(^|, )(rgba?\([^)]*\) )?0px 0px 0px [1-9][\d.]*px inset/.test(s.boxShadow);
    const clips = /hidden|clip/.test(s.overflowX) && e !== document.body && e.tagName !== "MAIN" && e.tagName !== "HTML";
    if ((bl && br) || inset) return "frame";
    if (clips) return "clip";
    return null;
  };
  const scrolls = (e) => /auto|scroll/.test(css(e).overflowX) && e.scrollWidth > e.clientWidth + 1;
  // the things that must stay inside: each line of words, and every picture, bar, button or field
  const items = [];
  for (const e of document.body.querySelectorAll("img, svg, canvas, video, button, a.btn, input, select, textarea, [class*='bar'], [class*='Bar']")) {
    if (!shown(e) || e.closest("svg") !== e && e.closest("svg")) continue;
    const b = e.getBoundingClientRect();
    if (b.width > 0.5 && b.height > 0.5) items.push({ el: e, b, what: `${name(e)} ${said(e) ? `"${said(e)}"` : ""}`.trim() });
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.data.trim() || !n.parentElement || !shown(n.parentElement)) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const b of r.getClientRects()) if (b.width > 0.5 && b.height > 0.5) items.push({ el: n.parentElement, b, what: `"${n.data.trim().slice(0, 30)}"` });
  }
  const seen = new Set();
  const flagged = [];   // a box already reported: what is inside it is the same spill, said once
  for (const { el, b, what } of items) {
    if (flagged.some((f) => f.contains(el))) continue;
    if (el.closest("[data-overlay], .visually-hidden, [aria-hidden='true'] svg")) continue;
    if (el.closest(".visually-hidden, .skip")) continue;
    // a part kept for screen readers only (a table's head on a phone): a box of a pixel that cuts off all it holds
    let hidden = false;
    for (let a = el; a && !hidden; a = a.parentElement) { const r = a.getBoundingClientRect(); hidden = r.width <= 1 && r.height <= 1 && (/hidden|clip/.test(css(a).overflow) || css(a).clipPath !== "none"); }
    if (hidden) continue;
    let inScroll = false;
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      if (scrolls(a)) { inScroll = true; break; }
      const f = frameOf(a);
      if (!f) continue;
      const fr = a.getBoundingClientRect(), s = css(a);
      const L = fr.left + (f === "frame" ? parseFloat(s.borderLeftWidth) || 1 : 0), R = fr.right - (f === "frame" ? parseFloat(s.borderRightWidth) || 1 : 0);
      if (b.left < L - 1 || b.right > R + 1) {
        const k = `out-frame: ${what} runs ${b.right > R + 1 ? `${Math.round(b.right - R)} px past the right` : `${Math.round(L - b.left)} px past the left`} line of ${f === "clip" ? "the box that cuts it off" : "its frame"}, ${name(a)}`;
        if (!seen.has(k)) { seen.add(k); out.push(k); }
        flagged.push(el);
        break;
      }
    }
    if (!inScroll && (b.right > W + 1 || b.left < -1)) {
      const k = `off-screen: ${what} runs ${b.right > W + 1 ? `${Math.round(b.right - W)} px past the right` : `${Math.round(-b.left)} px past the left`} edge of the screen`;
      if (!seen.has(k)) { seen.add(k); out.push(k); }
      flagged.push(el);
    }
  }
  return out;
};

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
for (const w of WIDTHS) {
  const phone = w < 761;
  const ctx = await browser.newContext({ viewport: { width: w, height: phone ? 844 : 900 }, reducedMotion: "reduce", isMobile: phone, hasTouch: phone });
  await ctx.addInitScript(() => {
    try {
      if (!localStorage.getItem("mathesis:settings")) localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduce" }, version: 2 }));
    } catch { /* storage unavailable */ }
  });
  const page = await ctx.newPage();
  for (const [path, step] of PAGES) {
    const where = `${path}${step ? ` (${step})` : ""} at ${w}px`;
    try {
      await page.goto(base + path, { waitUntil: "networkidle", timeout: 45000 });
      if (step) await STEPS[step](page);
    } catch (e) {
      found.push(`${where}: did not open (${e.message.split("\n")[0]})`);
      continue;
    }
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    for (const p of await page.evaluate(FIND)) found.push(`${where}: ${p}`);
  }
  await ctx.close();
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : `nothing spills out of its frame or off the screen on ${PAGES.length} pages at ${WIDTHS.join(" and ")} px`);
process.exit(found.length ? 1 : 0);
