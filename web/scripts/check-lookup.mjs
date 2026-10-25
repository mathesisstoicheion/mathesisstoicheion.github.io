// The word look-up never covers the line being read (redesign SPEC.md 4.3 and 7; decision 4), on Plato's Apology with
// Fowler's English. It lists:
//   margin - one book on a computer (1280 × 900 on Paper, 1440 × 900 on Night, and 1440 × 900 with Find open beside the
//            text): the look-up is not written in the margin beside the word's line (its top more than a line from the
//            word's, or its left edge over the text), it is narrower than 280 px (the quiet desk, ticket 04: about 300),
//            it reaches under the panel beside it, the word moves when it is looked up, Next does not keep it beside the
//            next word's line, or Escape does not close it and give the keyboard back to the word
//   sheet  - a narrower window (1000 × 800), a phone (390 × 844), and two books side by side (1280 × 900): the look-up's sheet
//            reaches over the word's line, when it opens low on the screen, at its full height, or on the next word; or it
//            opens higher than 27% of the screen (the quiet desk: it rests at about a quarter)
// The word packs and the dictionary are served from their own site (config/packs.ts); this check fetches them from the
// packs repository, so the look-up is as full as a reader sees it.
// usage: node web/scripts/check-lookup.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const PACKS = "https://raw.githubusercontent.com/mathesisstoicheion/packs/main";
const WORK = "tlg0059.tlg002";
const LOOKUP = 'aside[aria-label^="Look-up"]';
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];

async function open(w, h, scheme, path) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, serviceWorkers: "block", hasTouch: w < 800, isMobile: w < 800 });
  const page = await ctx.newPage();
  await page.route("**/data/{words,lsj,lexicon,syntax}/**", async (route) => {
    const p = new URL(route.request().url()).pathname.replace(/^\/data\//, "");
    try { await route.fulfill({ response: await route.fetch({ url: `${PACKS}/${p}` }) }); } catch { await route.abort(); }
  });
  await page.route(/wiktionary\.org/, (route) => route.fulfill({ status: 404, contentType: "application/json", body: "{}" }));
  await page.goto(base + path);
  await page.waitForSelector("article [data-w]", { timeout: 45000 });
  await page.waitForTimeout(2500);   // everything has inked in
  return { ctx, page };
}

/** The first word whose top is about `frac` of the way down the screen (in the first book). */
async function wordAt(page, frac) {
  return page.evaluate((frac) => {
    const ws = [...document.querySelectorAll("article [data-w]")];
    const y = innerHeight * frac;
    const w = ws.find((e) => { const r = e.getBoundingClientRect(); return r.top >= y && r.bottom < innerHeight - 8 && r.width > 0; });
    if (!w) return -1;
    w.setAttribute("data-check", "");
    return ws.indexOf(w);
  }, frac);
}

const boxes = (page) => page.evaluate((LOOKUP) => {
  const sel = document.querySelector("article [data-w][class*='__sel']") ?? document.querySelector("[data-check]");
  const look = document.querySelector(LOOKUP);
  const row = sel?.closest("section[data-key]");
  const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, height: b.height }; };
  const side = [...document.querySelectorAll("aside")].find((a) => a !== look && getComputedStyle(a).position === "fixed");
  return { word: r(sel), look: r(look), tr: r(row?.querySelector("[data-tr]")), grc: r(row?.querySelector("[lang='grc']")), side: r(side), lookPos: look ? getComputedStyle(look).position : "" };
}, LOOKUP);

// ---- margin: one book on a computer
const inMargin = (tag, b) => {
  if (!b.look) { found.push(`margin ${tag}: no look-up opened`); return; }
  if (Math.abs(b.look.top - b.word.top) > b.word.height) found.push(`margin ${tag}: the look-up's top is ${Math.round(b.look.top - b.word.top)} px from the word's line (it belongs beside it, in the margin)`);
  const over = Math.max(b.tr?.right ?? 0, b.grc?.right ?? 0);
  if (b.look.left < over - 1) found.push(`margin ${tag}: the look-up reaches ${Math.round(over - b.look.left)} px over the text (it belongs in the margin)`);
  if (b.look.right - b.look.left < 280) found.push(`margin ${tag}: the look-up is ${Math.round(b.look.right - b.look.left)} px wide (at least 280)`);
  if (b.side && b.look.right > b.side.left + 1) found.push(`margin ${tag}: the look-up reaches ${Math.round(b.look.right - b.side.left)} px under the panel beside the text`);
  if (b.lookPos === "fixed") found.push(`margin ${tag}: the look-up is fixed to the screen, not written in the page's margin`);
};
for (const [w, h, scheme, find] of [[1280, 900, "light"], [1440, 900, "dark"], [1440, 900, "light", true]]) {
  const tag = `${w}px ${scheme === "dark" ? "Night" : "Paper"}${find ? " with Find open" : ""}`;
  const { ctx, page } = await open(w, h, scheme, `/read?w=${WORK}`);
  if (find) {
    await page.keyboard.press("Control+f");
    await page.waitForSelector('aside[aria-label^="Find"]', { timeout: 10000 }).catch(() => found.push(`margin ${tag}: Find did not open`));
    await page.waitForTimeout(900);
  }
  for (const frac of [0.3, 0.75]) {
    await page.evaluate(() => scrollTo({ top: innerHeight * 1.4, behavior: "instant" }));
    await page.waitForTimeout(600);
    const i = await wordAt(page, frac);
    if (i < 0) { found.push(`margin ${tag}: no word found ${Math.round(frac * 100)}% down the screen`); continue; }
    const word = page.locator("article [data-w]").nth(i);
    const before = await word.boundingBox();
    await word.click();
    await page.waitForSelector(LOOKUP, { timeout: 10000 });
    await page.waitForTimeout(900);
    const b = await boxes(page);
    const after = await word.boundingBox();
    if (Math.abs(after.y - before.y) > 2) found.push(`margin ${tag}: the word moved ${Math.round(after.y - before.y)} px when it was looked up`);
    inMargin(tag, b);
    if (!b.look) continue;
    const next = page.locator(LOOKUP).getByRole("button", { name: "Next word" });
    if (await next.count()) { await next.click(); await page.waitForTimeout(900); inMargin(`${tag}, on the next word`, await boxes(page)); }
    else found.push(`margin ${tag}: no Next word button`);
    await page.locator(LOOKUP).focus();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    const after2 = await page.evaluate((LOOKUP) => ({ open: !!document.querySelector(LOOKUP), back: !!document.activeElement?.matches("article [data-w]") }), LOOKUP);
    if (after2.open) found.push(`margin ${tag}: Escape did not close the look-up`);
    else if (!after2.back) found.push(`margin ${tag}: after Escape the keyboard is not back on the word`);
  }
  await ctx.close();
}

// ---- sheet: a narrower window, a phone, two books side by side
for (const [w, h, path, label] of [[1000, 800, `/read?w=${WORK}`, "1000px"], [390, 844, `/read?w=${WORK}`, "390px"], [1280, 900, `/read?w=${WORK}&w2=tlg0059.tlg001`, "two books, 1280px"]]) {
  const { ctx, page } = await open(w, h, "light", path);
  await page.evaluate(() => scrollTo({ top: innerHeight * 1.4, behavior: "instant" }));
  // two books: each pane scrolls in its own box
  await page.evaluate(() => document.querySelectorAll("[data-key]")[0]?.closest("[class*='pane']")?.scrollBy({ top: innerHeight, behavior: "instant" }));
  await page.waitForTimeout(600);
  const i = await wordAt(page, 0.72);
  if (i < 0) { found.push(`sheet ${label}: no word found low on the screen`); await ctx.close(); continue; }
  const word = page.locator("article [data-w]").nth(i);
  if (w < 800) await word.tap(); else await word.click();
  await page.waitForSelector(LOOKUP, { timeout: 10000 });
  await page.waitForTimeout(1200);
  const check = async (when) => {
    const b = await boxes(page);
    if (!b.look || !b.word) { found.push(`sheet ${label}: ${when}: no look-up, or no word marked as looked up`); return; }
    if (b.word.bottom > h || b.word.top < 0) found.push(`sheet ${label}: ${when}: the word's line is off the screen (${Math.round(b.word.top)} px)`);
    else if (b.look.top < b.word.bottom - 1) found.push(`sheet ${label}: ${when}: the look-up reaches ${Math.round(b.word.bottom - b.look.top)} px over the word's line`);
    return b;
  };
  const first = await check("as it opens");
  if (first?.look && first.look.height > h * 0.27 + 1) found.push(`sheet ${label}: it opens ${Math.round(first.look.height)} px tall, ${Math.round(first.look.height / h * 100)}% of the screen (it rests at 27% or less)`);
  const more = page.locator(LOOKUP).getByRole("button", { name: "Show all of the look-up" });
  if (await more.count()) { await more.click(); await page.waitForTimeout(700); await check("at its full height"); }
  const next = page.locator(LOOKUP).getByRole("button", { name: "Next word" });
  if (await next.count()) { await next.click(); await page.waitForTimeout(900); await check("on the next word"); }
  await ctx.close();
}

await browser.close();
if (found.length) {
  console.error(`The look-up: ${found.length} problem(s)\n  ` + found.join("\n  "));
  process.exit(1);
}
console.log("The look-up: a note at least 280 px wide in the margin beside its line on a computer (with a panel open too), and a low sheet that stops below the line elsewhere");
