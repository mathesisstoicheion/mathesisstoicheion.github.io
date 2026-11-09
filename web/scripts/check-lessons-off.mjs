// The lessons are off the site (the owner, 2026-11-09: "just remove all the lessons"; web/src/config/lessons.ts). This
// check opens the pages that used to lead to them and fails if any still links to a lesson, a practice lesson, a test,
// a checkpoint or the reading path, or if a lesson's address still shows a lesson instead of the page that is not here.
// To see it catch one: set LESSONS_SHOWN to true, build, and it lists the Academy's lesson links and the lesson pages.
// usage: node web/scripts/check-lessons-off.mjs <base-url>   (exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, serviceWorkers: "block" })).newPage();
const found = [];
const LESSON = /^\/academy\/(lesson|reading|checkpoint)(\/|$|\?)/;
for (const p of ["/", "/academy", "/academy/today", "/academy/alphabet", "/guide", "/library", "/stoa"]) {
  await page.goto(base + p, { waitUntil: "networkidle" });
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => new URL(a.href).pathname));
  for (const h of hrefs) if (LESSON.test(h)) found.push(`${p} links to ${h}`);
}
for (const p of ["/academy/lesson/adjectives", "/academy/reading", "/academy/reading/letters", "/academy/checkpoint/i"]) {
  await page.goto(base + p, { waitUntil: "networkidle" });
  const h1 = (await page.locator("h1").first().textContent().catch(() => "")) ?? "";
  if (!/not here|not found|no page/i.test(h1) && (await page.locator('a[href^="/academy/lesson/"], [aria-current="step"]').count()) > 0) found.push(`${p} still shows a lesson (${h1.trim()})`);
}
await browser.close();
for (const f of found) console.log("✗ " + f);
console.log(found.length ? `\n${found.length} problem(s)` : "no lesson anywhere: every way in leads to reading and the Academy's tools");
process.exit(found.length ? 1 : 0);
