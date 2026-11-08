// Nothing opens under the phone's status bar (the clock and the battery). The phone app draws the site edge to edge, under that bar, and
// tells the page how tall it is (env(safe-area-inset-top)); the site paints a strip of paper there (globals.css body::before). In the reader
// the site's header stands aside, so the page must keep its own first line clear of the strip (the owner, 2026-11-08, beta 12: "the title is
// cut off when loading a text": the book's one-line title, "Περὶ ψυχῆς · Aristotle, On the Soul, …", half under the clock).
// Chromium is told of a 36 px status bar and a 24 px gesture bar (the size of the owner's phone's), and on a phone of 361 × 794 the check
// opens each page and lists every line of words that starts under the strip once the page has settled:
//   the reader, the first time a book is opened (its title page) and every time after (its one-line title), in verse and in prose;
//   the reader reopened where it was left, some way into the book: no line cut through by the strip's edge (it comes back at the start of a line);
//   and the site's other main pages, whose header steps down below the strip.
// usage: node web/scripts/check-status-bar.mjs [base-url]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        Proved 2026-11-08: before the fix the one-line title of the Apology and the Iliad started 4 px from the top of the screen, 32 px under the strip.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const TOP = 36;
const BOOKS = ["tlg0059.tlg002", "tlg0012.tlg001"];
const PAGES = ["/", "/library", "/academy", "/stoa", "/treasury", "/search", "/guide", "/about"];

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];

async function open() {
  const ctx = await browser.newContext({ viewport: { width: 361, height: 794 }, isMobile: true, hasTouch: true, reducedMotion: "reduce", serviceWorkers: "block" });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets: { top: TOP, bottom: 24 } });
  return { ctx, page };
}

/** lines of words (of anything not fixed or sticky: those are placed against the strip on purpose) that start under the strip, at the top of the screen */
const under = (page, crossing = false) => page.evaluate(([top, crossing]) => {
  const pinned = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === "fixed" || p === "sticky") return true; } return false; };
  const out = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) {
    const t = n.textContent.trim(); const el = n.parentElement;
    if (!t || !el || el.closest("script,style,noscript,[aria-hidden=true],.visually-hidden") || pinned(el)) continue;
    const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const b of r.getClientRects()) if (b.width > 2 && b.height > 2 && b.right > 0 && b.left < innerWidth && b.bottom > (crossing ? top + 1 : 0) && b.top < top - 1) { out.push(`"${t.slice(0, 40)}" starts ${Math.round(b.top)} px from the top`); break; }
  }
  return out.slice(0, 4);
}, [TOP, crossing]);

const settle = async (page) => { await page.locator("article [data-key]").first().waitFor({ timeout: 30000 }); await page.waitForTimeout(2500); };

for (const book of BOOKS) {
  const { ctx, page } = await open();
  await page.goto(`${base}/read?w=${book}`, { waitUntil: "load" });
  await settle(page);
  for (const u of await under(page)) found.push(`${book}, first opening (title page): ${u}`);
  await page.goto(`${base}/read?w=${book}`, { waitUntil: "load" });
  await settle(page);
  for (const u of await under(page)) found.push(`${book}, opened again (one-line title): ${u}`);
  for (let y = 0; y < 5400; y += 900) { await page.mouse.wheel(0, 900); await page.waitForTimeout(120); }
  await page.waitForTimeout(1500);
  await page.reload({ waitUntil: "load" });
  await settle(page);
  // some way into the book what is above the strip has been read and is meant to be under it; the line at the strip's edge must not be cut through
  for (const u of await under(page, true)) found.push(`${book}, reopened where it was left: a line cut by the strip: ${u}`);
  await ctx.close();
}
for (const path of PAGES) {
  const { ctx, page } = await open();
  await page.goto(base + path, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  for (const u of await under(page)) found.push(`${path}: ${u}`);
  await ctx.close();
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : "\nnothing opens under the phone's status bar");
process.exit(found.length ? 1 : 0);
