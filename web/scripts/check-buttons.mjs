// The buttons check (whole-site pass, 2026-10-29): a button's words read as one line of text, wrapping as a sentence
// does when they must. A button is a row of parts (its words, a piece of Greek, an arrow) side by side; on a narrow
// phone a long label broke into columns, each part wrapped in its own ("NEXT: SECOND / DECLENSION:" beside "λόγος, /
// δῶρον" beside "→", at the foot of every grammar lesson). This finds a button with two parts of words side by side
// where one of them runs onto a second line.
// usage: node web/scripts/check-buttons.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
const WIDTHS = [360, 390];

// every lesson of both tracks, from the Learn page's own lists, and the pages that lead to them
const ctx0 = await browser.newContext({ serviceWorkers: "block" });
const p0 = await ctx0.newPage();
await p0.goto(base + "/academy", { waitUntil: "load" });
await p0.waitForTimeout(800);
const lessons = await p0.evaluate(() => [...new Set([...document.querySelectorAll('section[aria-labelledby="reading-title"] ol a, section[aria-labelledby="lessons-title"] ol a')].map((a) => a.getAttribute("href")))]);
await ctx0.close();
const PAGES = ["/", "/academy", "/academy/today", "/academy/practice", "/academy/reading", "/academy/tables", "/academy/vocabulary", "/academy/alphabet", "/guide", ...lessons];

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true, serviceWorkers: "block", reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(base + path, { waitUntil: "load" });
    await page.waitForTimeout(700);
    const broken = await page.evaluate(() => {
      const out = [];
      for (const b of document.querySelectorAll(".btn")) {
        const r = b.getBoundingClientRect();
        if (r.width < 2 || getComputedStyle(b).display.indexOf("flex") < 0) continue;
        // the button's parts: its child elements and its runs of text, each measured as laid out
        const parts = [...b.childNodes].map((n) => {
          if (n.nodeType === 3) { if (!n.textContent.trim()) return null; const g = document.createRange(); g.selectNodeContents(n); return { rects: [...g.getClientRects()], text: n.textContent.trim() }; }
          if (n.nodeType !== 1 || n.getAttribute("aria-hidden") === "true") return null;
          return { rects: [...n.getClientRects()].length ? [...n.getClientRects()] : [n.getBoundingClientRect()], text: n.textContent.trim(), box: n.getBoundingClientRect() };
        }).filter((x) => x && x.text);
        if (parts.length < 2) continue;
        const lines = (p) => new Set(p.rects.map((q) => Math.round(q.top))).size;
        const box = (p) => p.box ?? p.rects.reduce((a, q) => ({ top: Math.min(a.top, q.top), bottom: Math.max(a.bottom, q.bottom) }), { top: Infinity, bottom: -Infinity });
        const side = parts.some((p, i) => parts.some((q, j) => j > i && box(p).top < box(q).bottom - 2 && box(q).top < box(p).bottom - 2));
        if (side && parts.some((p) => lines(p) > 1)) out.push(b.textContent.replace(/\s+/g, " ").trim().slice(0, 60));
      }
      return out;
    });
    for (const t of broken) found.push(`${width}px ${path}: the button "${t}" breaks into columns`);
  }
  await ctx.close();
}
await browser.close();

if (found.length) {
  console.log(`check-buttons: ${found.length} problem${found.length === 1 ? "" : "s"}`);
  for (const f of found) console.log("  " + f);
  process.exit(1);
}
console.log(`check-buttons: OK (${PAGES.length} pages at ${WIDTHS.join(" and ")} px: every button's words read as one line of text)`);
