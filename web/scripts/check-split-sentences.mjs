#!/usr/bin/env node
/**
 * A sentence split by its own box: a check.
 *
 * A box laid out as a grid or a flex row makes each of its children an item of its own, and a run of words between them an
 * item too. Set on a sentence with a link in it, "<p class=notice><a>Sign in</a> to open this page.</p>" printed "Sign in"
 * on one line and "to open this page." on the next, as two blocks (the private pages' sign-in notes were found so,
 * 2026-10-23).
 *
 * The rule checked, at a computer's width and a phone's: where a grid or flex box has, as children of its own, both words
 * that are not inside any element and an element a sentence is made of (a link, b, i, em, strong, code, small, abbr, cite,
 * or a span with words in it, unless it is hidden from screen readers, as an arrow is), they stand on one line. (A part
 * meant to stand on a line of its own is given an element of its own.)
 *
 *   node scripts/check-split-sentences.mjs <base-url> [path…]   (CHROMIUM=<path> picks the browser; exits with 1 on a finding)
 */
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/reading", "/academy/alphabet", "/academy/lesson/letters", "/academy/practice", "/academy/review", "/academy/tables",
  "/library", "/library/author?id=tlg0012", "/library/private", "/author/tlg0011", "/work/tlg0012-tlg001", "/read?w=tlg0012.tlg001",
  "/search", "/search?q=μῆνιν", "/stoa", "/stoa/delphi", "/stoa/eras", "/stoa/authors", "/stoa/kerameikos", "/stoa/census", "/stoa/lyre",
  "/treasury", "/treasury/word?l=λόγος", "/treasury/translations", "/admin/translations", "/downloads", "/account", "/about", "/credits", "/guide",
  "/town-hall", "/nope-not-here",
];

/** in the page: every grid or flex box that splits a sentence onto two lines, as a short piece of its text */
function splits() {
  const SENTENCE = new Set(["A", "B", "I", "EM", "STRONG", "CODE", "SMALL", "ABBR", "CITE", "Q", "SPAN"]);
  const box = (n) => {
    if (n.nodeType === Node.TEXT_NODE) { const r = document.createRange(); r.selectNodeContents(n); return r.getBoundingClientRect(); }
    return n.getBoundingClientRect();
  };
  // two parts of one sentence stand on one line when their boxes share some height
  const together = (a, b) => Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2;
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    const d = getComputedStyle(el).display;
    if (!/(^|-)(grid|flex)$/.test(d)) continue;
    if (!el.getClientRects().length) continue;
    const kids = [...el.childNodes];
    const words = kids.filter((n) => n.nodeType === Node.TEXT_NODE && /\p{L}/u.test(n.textContent));
    if (!words.length) continue;
    const parts = kids.filter((n) => n.nodeType === Node.ELEMENT_NODE && SENTENCE.has(n.tagName) && n.getAttribute("aria-hidden") !== "true"
      && /\p{L}/u.test(n.textContent) && getComputedStyle(n).display !== "none" && !n.classList.contains("visually-hidden"));
    if (words.some((w) => parts.some((p) => !together(box(w), box(p)))))
      out.push(`<${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? ` class="${el.className.slice(0, 60)}"` : ""}> ${el.textContent.replace(/\s+/g, " ").trim().slice(0, 90)}`);
  }
  return out;
}

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = new Set();
for (const [w, h] of [[1280, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block" });
  await ctx.addInitScript(() => localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduce" }, version: 2 })));
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(base + path);
    await page.locator("h1").first().waitFor({ state: "attached", timeout: 30_000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(1200);   // the private pages read the account before they say "Sign in"
    for (const s of await page.evaluate(splits)) found.add(`${path} (${w}px): ${s}`);
  }
  await ctx.close();
}
await browser.close();
for (const f of found) console.log(f);
console.log(found.size ? `\n${found.size} sentence(s) split by their own box` : "No sentence is split by its own box.");
process.exit(found.size ? 1 : 0);
