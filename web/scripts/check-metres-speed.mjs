// The metre (the scansion drawn over verse: long and short marks, feet, caesura) turns on without freezing the page, and a
// book reopened with the metre left on still shows its verse promptly (components/reader/Reader.tsx, lib/metre/*).
// The owner, on a OnePlus 13R in the app: turning the metre on is "really laggy", and the app sometimes reopens a text to a
// blank cream screen, with the metre still on from the last visit.
// On a phone (390 x 844), with the processor slowed four times (as a mid-range phone runs), it:
//   1. opens the Iliad, Book 1 (611 lines), opens Study and taps Metre, and measures the long tasks (stretches of work over
//      50 ms during which the page cannot answer a tap or draw) that start within 3 s of the tap (the metre's data is fetched after the tap, so its work begins up to a second later). It fails when one of them
//      runs over MAX_TASK_MS, when their blocking time (each one's time over 50 ms, summed) is over TBT_MS, or when no line
//      shows its metre within 5 s (a fix must still draw the marks).
//   2. opens the Iliad, Book 1 cold twice, once with the metre saved off and once saved on, and fails when, with it on, the
//      first verse is drawn more than REOPEN_SLACK_MS later than with it off, or a long task over FREEZE_MS runs in the 3 s
//      after the verse is drawn (the page is frozen just after it opens).
//      (Opening the Iliad takes about 2.8-3.7 s here at this slowing even with the metre off, so a fixed "within 1.5 s" would
//      fail for reasons that have nothing to do with the metre; the metre's share is measured against the same page without it.)
// usage: node web/scripts/check-metres-speed.mjs [base-url]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        Proved 2026-11-11 before any fix: the tap gave one task of 7.4-8.3 s (blocking time 7.8-8.8 s; nearly all of it
//        the verse fit measuring the page again and again with 11,444 syllable marks drawn), and the reopened Iliad drew its
//        verse 0.6 s later than without the metre, then froze for 4.0-4.9 s.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const BOOK = "/read?w=tlg0012.tlg001";
const RATE = 4;
const MAX_TASK_MS = 200, TBT_MS = 300, REOPEN_SLACK_MS = 300, FREEZE_MS = 400;
const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 };
const KEY = "mathesis:settings";

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];

/** a phone whose saved settings have the metre on or off, recording long tasks and when the first verse and the first metre are drawn */
async function phone(metre) {
  const ctx = await browser.newContext(PHONE);
  await ctx.addInitScript(([key, metre]) => {
    // the saved settings, written once, before the site's own scripts read them
    if (!sessionStorage.getItem("metre-check")) { sessionStorage.setItem("metre-check", "1"); localStorage.setItem(key, JSON.stringify({ state: { metre }, version: 5 })); }
    window.__lt = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push({ s: e.startTime, d: e.duration }); }).observe({ type: "longtask", buffered: true });
    const tick = () => {
      if (!window.__verse && document.querySelector("article[data-reading] [data-w]")) window.__verse = performance.now();
      if (!window.__metre && document.querySelector("[data-metre]")) window.__metre = performance.now();
      if (!window.__verse || !window.__metre) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [KEY, metre]);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  return { ctx, page, slow: () => cdp.send("Emulation.setCPUThrottlingRate", { rate: RATE }) };
}

// ---- 1. the tap
{
  const { ctx, page, slow } = await phone(false);
  await page.goto(base + BOOK, { waitUntil: "networkidle" });
  await page.locator("article[data-reading] [data-w]").first().waitFor();
  await slow();
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: /^Study/ }).first().click();
  const tool = page.locator("[data-tool=metre]");
  await tool.waitFor();
  await page.waitForTimeout(800);
  await page.evaluate(() => document.querySelector("[data-tool=metre]").addEventListener("click", () => { window.__tap = performance.now(); }, { capture: true, once: true }));
  await tool.click();
  const drawn = await page.waitForFunction(() => document.querySelector("[data-metre]"), null, { timeout: 15000 }).then(() => true, () => false);
  await page.waitForTimeout(3500);   // the long tasks begun in the first 3 s are reported once they end
  const r = await page.evaluate(() => {
    const t0 = window.__tap, lt = window.__lt.filter((e) => e.s >= t0 - 5 && e.s < t0 + 3000);
    return { at: Math.round((window.__metre ?? Infinity) - t0), n: lt.length, max: Math.round(Math.max(0, ...lt.map((e) => e.d))),
      tbt: Math.round(lt.reduce((a, e) => a + Math.max(0, e.d - 50), 0)), lines: document.querySelectorAll("[data-metre]").length };
  });
  console.log(`tap: ${r.n} long tasks in the first 3 s, longest ${r.max} ms, blocking ${r.tbt} ms; metre drawn after ${r.at} ms (${r.lines} lines marked so far)`);
  if (!drawn || !(r.at <= 5000)) found.push(`tap: no line shows its metre within 5 s of the tap`);
  if (r.max > MAX_TASK_MS) found.push(`tap: one task ran ${r.max} ms (limit ${MAX_TASK_MS} ms): the page could not draw or answer for that long`);
  if (r.tbt > TBT_MS) found.push(`tap: ${r.tbt} ms of blocking time in the first 3 s (limit ${TBT_MS} ms)`);
  await ctx.close();
}

// ---- 2. the reopen
const open = async (metre) => {
  const { ctx, page, slow } = await phone(metre);
  await slow();
  await page.goto(base + BOOK, { waitUntil: "commit" });
  await page.waitForFunction(() => window.__verse, null, { timeout: 30000 }).catch(() => undefined);
  await page.waitForTimeout(3500);
  const r = await page.evaluate(() => {
    const v = window.__verse ?? Infinity;
    const after = window.__lt.filter((e) => e.s + e.d > v && e.s < v + 3000);
    return { verse: Math.round(v), freeze: Math.round(Math.max(0, ...after.map((e) => e.d))) };
  });
  await ctx.close();
  return r;
};
const off = await open(false), on = await open(true);
console.log(`reopen: verse drawn at ${off.verse} ms with the metre off, ${on.verse} ms with it on; longest task in the 3 s after: ${off.freeze} ms off, ${on.freeze} ms on`);
if (!(on.verse <= off.verse + REOPEN_SLACK_MS)) found.push(`reopen: with the metre saved on, the verse is drawn ${on.verse - off.verse} ms later than with it off (limit ${REOPEN_SLACK_MS} ms)`);
if (on.freeze > FREEZE_MS) found.push(`reopen: with the metre saved on, the page freezes for ${on.freeze} ms just after the verse is drawn (limit ${FREEZE_MS} ms)`);

await browser.close();
for (const f of found) console.log(`  - ${f}`);
console.log(found.length ? `${found.length} problem(s) with the metre's speed` : "the metre turns on and reopens without freezing the page");
process.exit(found.length ? 1 : 0);
