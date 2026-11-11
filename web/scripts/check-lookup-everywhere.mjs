// The word look-up works on every page that shows touchable Greek, not only in the reader (the owner, 2026-11-11: "More about it" did
// nothing on Home's passage of the day). On a phone (390 x 844) and a computer (1280 x 800), on Home's passage of the day, a Guide
// and a lesson (their "real" passages), a Stoa entry (prose and a quotation), the Oracle's results (by work and as a concordance), the
// Census's item panel and the Parse-real-sentences drill: touch a word, expect the look-up; "More about it" shows the second layer (data-layer="2", with
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
  // the Stoa's entries: Greek in the prose (kleroterion) and in a quotation (slavery); the words are touchable, not the links
  { name: "a Stoa entry (prose)", path: "/stoa/kleroterion", words: "[data-entry] p [data-w], [data-entry] li [data-w]", quick: true },
  { name: "a Stoa entry (quotation)", path: "/stoa/slavery", words: "[data-entry] blockquote [data-w]", quick: true },
  { name: "the Oracle (by work)", path: "/search?m=forms&q=%CE%BB%CE%BF%CE%B3%CE%BF%CF%82", words: "li[class*=hit] p [data-w]", quick: true, index: true, prep: async (page) => { await page.locator('li[class*=group] button[aria-expanded]').first().click(); } },
  { name: "the Oracle (concordance)", path: "/search?m=forms&q=%CE%BB%CE%BF%CE%B3%CE%BF%CF%82&v=conc", words: "ol[data-lang=grc] [data-w]", quick: true, index: true },
  { name: "the Census", path: "/stoa/census", words: "article h2 [data-w]", quick: true, prep: async (page) => { await page.locator('button[aria-pressed][class*=row]').first().click(); } },
  { name: "the Parse-real-sentences drill", path: "/academy/practice", words: "[data-drill] [data-w]", quick: true, prep: async (page) => {
    await page.getByRole("radio", { name: "Parse real sentences" }).click();
    await page.waitForSelector("[data-drill] [data-w]", { timeout: 30000 });
    // the words are touchable once the question is answered (before, a look-up would give the answer away)
    await page.locator("[class*=options]").nth(0).locator("button").first().click();
    await page.locator("[class*=options]").nth(1).locator("button").first().click();
    await page.waitForSelector("[class*=drillFoot]", { timeout: 10000 });
  } },
  ...(lessonsShown ? [{ name: "a lesson (Letters)", path: "/academy/lesson/letters", words: "[data-real] [data-w]" }] : []),
];
// ONLY="Stoa" runs just the pages whose name contains it (a quicker run while working)
const only = process.env.ONLY;
const SIZES = [{ name: "phone", w: 390, h: 844 }, { name: "computer", w: 1280, h: 800 }];
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
const skipped = [];
const layer = (page) => page.locator(LOOKUP).first().getAttribute("data-layer").catch(() => null);

for (const sz of SIZES) for (const pg of PAGES.filter((x) => !only || x.name.includes(only))) {
  const tag = `${pg.name} on a ${sz.name}`;
  const ctx = await browser.newContext({ viewport: { width: sz.w, height: sz.h }, serviceWorkers: "block", hasTouch: sz.w < 800, isMobile: sz.w < 800 });
  const page = await ctx.newPage();
  await page.route("**/data/{words,lsj,lexicon,syntax}/**", async (route) => {
    const p = new URL(route.request().url()).pathname.replace(/^\/data\//, "");
    try { await route.fulfill({ response: await route.fetch({ url: `${PACKS}/${p}` }) }); } catch { await route.abort(); }
  });
  try {
    await page.goto(base + pg.path);
    // the Oracle's results need the search index, which a copy built without the data packs does not have: say so, do not fail
    if (pg.index && !(await page.waitForSelector("[class*=groupHead], ol[data-lang]", { timeout: 25000 }).then(() => true, () => false))) { skipped.push(tag); await ctx.close(); continue; }
    if (pg.prep) { try { await pg.prep(page); } catch (e) { found.push(`${tag}: could not set the page up (${String(e.message).split("\n")[0]})`); await ctx.close(); continue; } }
    await page.waitForSelector(pg.words, { timeout: pg.quick ? 20000 : 45000 });
    await page.waitForTimeout(2500);
    const word = page.locator(pg.words).nth(pg.quick ? 0 : 2);
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
if (skipped.length) console.log(`skipped, no search index in this copy: ${skipped.join("; ")}`);
console.log(`look-up everywhere: ${PAGES.length} pages x ${SIZES.length} sizes ok`);
