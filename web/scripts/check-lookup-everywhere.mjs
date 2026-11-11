// The word look-up works on every page that shows touchable Greek, not only in the reader (the owner, 2026-11-11: "More about it" did
// nothing on Home's passage of the day). On a phone (390 x 844) and a computer (1280 x 800), on Home's passage of the day, a Guide
// and a lesson (their "real" passages): touch a word, expect the look-up; "More about it" shows the second layer (data-layer="2", with
// the dictionary); Back returns to the first layer (data-layer="1"); Escape closes it.
// usage: node web/scripts/check-lookup-everywhere.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";
import { lessonsShown } from "./lib/pages.mjs";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const PACKS = "https://raw.githubusercontent.com/mathesisstoicheion/packs/main";
const LOOKUP = 'aside[aria-label^="Look-up"]';
const PAGES = [
  { name: "Home, the passage of the day", path: "/", words: "section[aria-labelledby=pod-title] [data-w]" },
  { name: "the Guide (which-greek)", path: "/academy/guide/which-greek", words: "[data-real] [data-w]" },
  { name: "the Guide (dictionary-form)", path: "/academy/guide/dictionary-form", words: "[data-real] [data-w]" },
  // lessons are switched off for now (LESSONS_SHOWN); they use the same panel and are checked when shown
  ...(lessonsShown ? [{ name: "a lesson (Letters)", path: "/academy/lesson/letters", words: "[data-real] [data-w]" }] : []),
];
const SIZES = [{ name: "phone", w: 390, h: 844 }, { name: "computer", w: 1280, h: 800 }];
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
const layer = (page) => page.locator(LOOKUP).first().getAttribute("data-layer").catch(() => null);

for (const sz of SIZES) for (const pg of PAGES) {
  const tag = `${pg.name} on a ${sz.name}`;
  const ctx = await browser.newContext({ viewport: { width: sz.w, height: sz.h }, serviceWorkers: "block", hasTouch: sz.w < 800, isMobile: sz.w < 800 });
  const page = await ctx.newPage();
  await page.route("**/data/{words,lsj,lexicon,syntax}/**", async (route) => {
    const p = new URL(route.request().url()).pathname.replace(/^\/data\//, "");
    try { await route.fulfill({ response: await route.fetch({ url: `${PACKS}/${p}` }) }); } catch { await route.abort(); }
  });
  try {
    await page.goto(base + pg.path);
    await page.waitForSelector(pg.words, { timeout: 45000 });
    await page.waitForTimeout(2500);
    const word = page.locator(pg.words).nth(2);
    await word.scrollIntoViewIfNeeded();
    await word.click();
    await page.waitForSelector(LOOKUP, { timeout: 10000 });
    if ((await layer(page)) !== "1") found.push(`${tag}: the look-up did not open on its first layer`);
    const more = page.locator(`${LOOKUP} button:has-text("More about it")`);
    await more.click();
    await page.waitForTimeout(600);
    if ((await layer(page)) !== "2") { found.push(`${tag}: "More about it" did not open the second layer`); continue; }
    const text = await page.locator(LOOKUP).first().innerText();
    if (!/Dictionary|LSJ/.test(text)) found.push(`${tag}: the second layer shows no dictionary`);
    await page.locator(`${LOOKUP} button:has-text("Back")`).first().click();
    await page.waitForTimeout(500);
    if ((await layer(page)) !== "1") found.push(`${tag}: Back did not return to the first layer`);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
    if (await page.locator(LOOKUP).count()) found.push(`${tag}: Escape did not close the look-up`);
  } catch (e) { found.push(`${tag}: ${String(e.message).split("\n")[0]}`); }
  await ctx.close();
}
await browser.close();
if (found.length) { console.log(found.join("\n")); process.exit(1); }
console.log(`look-up everywhere: ${PAGES.length} pages x ${SIZES.length} sizes ok`);
