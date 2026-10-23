// The rooms along the foot of a phone's screen (components/TabBar.tsx; redesign decisions 9 and 10, SPEC.md 7): the bar
// hides as you scroll down, comes back when you scroll up, and is not there at all in the reader. On a phone (390 × 844)
// it reads each page as a reader would, a screen's worth at a time, and lists:
//   top     - at the top of a page the bar is not on the screen, at its foot
//   down    - after reading on, the bar is still on the screen
//   up      - after scrolling back up a little, the bar has not come back
//   reader  - a book open in the reader shows the bar, at the top or after scrolling either way
//   wide    - on a computer (1280 px) a bar along the foot shows (there the header holds the rooms)
// "On the screen" is what a reader sees: some of the bar inside the window, and not see-through.
// usage: node web/scripts/check-bar.mjs [base-url]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        PROVE_CSS=<css> adds a fault to every page, to show the check catches it. Proved 2026-10-23: the bar held in
//        place (transform: none; opacity: 1) was listed as still on the screen after reading on, on every page.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const PAGES = ["/", "/library", "/academy", "/academy/alphabet", "/stoa", "/stoa/kerameikos", "/treasury", "/guide", "/credits"];
const READER = ["/read?w=tlg0012.tlg001", "/read?w=tlg0059.tlg002"];

/** the bar as a reader sees it: true when some of it is inside the window and it is not see-through */
const onScreen = (page) => page.evaluate(() => {
  const bar = [...document.querySelectorAll("nav")].find((n) => n.getAttribute("aria-label") === "The rooms of the site" && !n.closest("header"));
  if (!bar) return false;
  const r = bar.getBoundingClientRect(), s = getComputedStyle(bar);
  return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity) > 0.05 && r.height > 0 && r.top < innerHeight - 1 && r.bottom > 0;
});
const scrollBy = async (page, dy, steps = 6) => {
  for (let i = 0; i < steps; i++) { await page.evaluate((d) => scrollBy(0, d), dy / steps); await page.waitForTimeout(40); }
  await page.waitForTimeout(800);   // the bar's own slide (0.5 s) has finished
};

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
if (process.env.PROVE_CSS) await phone.addInitScript((c) => addEventListener("load", () => document.head.append(Object.assign(document.createElement("style"), { textContent: c }))), process.env.PROVE_CSS);
const page = await phone.newPage();
for (const path of PAGES) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  if (!(await onScreen(page))) { found.push(`${path}: top: the bar is not at the foot of the screen`); continue; }
  const room = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  if (room < 900) { found.push(`${path}: the page is too short to read on (${room} px): choose a longer page`); continue; }
  await scrollBy(page, 700);
  if (await onScreen(page)) found.push(`${path}: down: the bar stays on the screen after reading on`);
  await scrollBy(page, -240, 3);
  if (!(await onScreen(page))) found.push(`${path}: up: the bar does not come back on scrolling up`);
}
for (const path of READER) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  if (await onScreen(page)) found.push(`${path}: reader: the bar shows at the top`);
  await scrollBy(page, 700);
  await scrollBy(page, -240, 3);
  if (await onScreen(page)) found.push(`${path}: reader: the bar shows after scrolling back up`);
}
await phone.close();
const computer = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const wide = await computer.newPage();
for (const path of ["/", "/library"]) {
  await wide.goto(base + path, { waitUntil: "networkidle" });
  if (await onScreen(wide)) found.push(`${path}: wide: a bar along the foot shows on a computer`);
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : `the bar slips away as you read on, comes back as you scroll up, and is not in the reader (${PAGES.length} pages, ${READER.length} books)`);
process.exit(found.length ? 1 : 0);
