// A book opens again where the reader left it (components/reader/Reader.tsx, lib/position.ts): on a phone (390 × 844) and a
// computer (1440 × 900), in verse (the Iliad) and in long prose passages (Plato's Apology, whose sections run over two screens
// on a phone), it reads on part of the way into a passage, waits, reloads the page, and lists where the line at the top of the
// screen has moved to: a different passage, or the same passage more than 40 px (about a line) higher or lower.
// The owner saw it as "the reader reopens a few lines lower"; on a phone a long passage reopened at its start, two screens back.
// usage: node web/scripts/check-resume.mjs [base-url]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        Proved 2026-11-07: before the fix the Apology reopened 1,578 px higher on a phone (at the start of section 21) and the
//        Iliad 104 px higher on a computer.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const BOOKS = ["tlg0012.tlg001", "tlg0059.tlg002"];
const VIEWS = { phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, computer: { viewport: { width: 1440, height: 900 } } };
// how far the reader scrolls in, in steps of the wheel: some way into a passage, not at its start
const STEPS = [3700, 9000, 15300];

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];

/** the passage under the top of the text (the one Reader.tsx keeps: the first showing more than a sliver below the sticky bar), and how far into it the top of the screen is, in px */
const where = (page) => page.evaluate(() => {
  const bar = [...document.querySelectorAll("[class*=bar]")].find((el) => el.offsetHeight && getComputedStyle(el).position === "sticky");
  const edge = bar ? bar.getBoundingClientRect().bottom : 0;
  const row = [...document.querySelectorAll("article [data-key]")].find((r) => r.getBoundingClientRect().bottom - parseFloat(getComputedStyle(r).paddingBottom) > edge + 24);
  return row ? { key: row.dataset.key, into: Math.round(edge - row.getBoundingClientRect().top) } : null;
});

for (const [view, opts] of Object.entries(VIEWS)) {
  for (const book of BOOKS) {
    for (const dy of STEPS) {
      const ctx = await browser.newContext({ ...opts, serviceWorkers: "block" });
      const page = await ctx.newPage();
      await page.goto(`${base}/read?w=${book}`, { waitUntil: "load" });
      await page.locator("article [data-key]").first().waitFor({ timeout: 30000 });
      await page.waitForTimeout(1500);
      // read on as a reader does, a wheel at a time
      for (let y = 0; y < dy; y += 900) { await page.mouse.wheel(0, Math.min(900, dy - y)); await page.waitForTimeout(120); }
      await page.waitForTimeout(1500);
      const before = await where(page);
      await page.reload({ waitUntil: "load" });
      await page.locator("article [data-key]").first().waitFor({ timeout: 30000 });
      await page.waitForTimeout(3500);
      const after = await where(page);
      const label = `${view} ${book} after ${dy} px`;
      if (!before || !after) found.push(`${label}: no passage found at the top (${JSON.stringify({ before, after })})`);
      else if (before.key !== after.key) found.push(`${label}: reopened at ${after.key} (${after.into} px in), not ${before.key} (${before.into} px in)`);
      else if (Math.abs(before.into - after.into) > 40) found.push(`${label}: reopened ${Math.abs(before.into - after.into)} px ${after.into < before.into ? "higher" : "lower"} in ${before.key} (${before.into} → ${after.into} px in)`);
      else console.log(`✓ ${label}: ${before.key}, ${before.into} → ${after.into} px in`);
      await ctx.close();
    }
  }
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : "\nevery book reopens where it was left");
process.exit(found.length ? 1 : 0);
