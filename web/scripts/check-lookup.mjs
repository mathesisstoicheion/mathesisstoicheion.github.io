// The word look-up never covers the line being read (redesign SPEC.md 4.3 and 7; decision 4), on Plato's Apology with
// Fowler's English. It lists:
//   margin - one book on a computer (1280 × 900 on Paper, 1440 × 900 on Night, and 1440 × 900 with Find open beside the
//            text): the look-up is not a window floating over the right margin (fixed to the screen, its left edge clear
//            of the text, the owner, 2026-10-26: "a floating window that opens on the right"), it moves when the text is
//            scrolled, it covers the reader's bar, it is narrower than 280 px (the quiet desk, ticket 04: about 300), it
//            reaches under the panel beside it, the word moves when it is looked up, Next does not keep it in place, or
//            Escape does not close it and give the keyboard back to the word
//   sheet  - a narrower window (1000 × 800), a phone (390 × 844), and two books side by side (1280 × 900): the look-up's sheet
//            reaches over the word's line, when it opens low on the screen, at its full height, or on the next word; or it
//            opens higher than 27% of the screen (the quiet desk: it rests at about a quarter)
// Both lay out the first layer of the look-up (the quiet desk, ticket 05) and fail when, before "More about it" is pressed, it
// shows a certainty badge, the lesson card, a credit (GLAUx, CC BY, "Analysis:"…) or the dictionary, when it has no meaning line,
// or when "More about it" does not reveal the dictionary ("Dictionary · LSJ").
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
  return { bar: r(document.querySelector("[class*='rbar']")), word: r(sel), look: r(look), tr: r(row?.querySelector("[data-tr]")), grc: r(row?.querySelector("[lang='grc']")), side: r(side), lookPos: look ? getComputedStyle(look).position : "" };
}, LOOKUP);

/**
 * The first layer holds the card and nothing else: the dictionary form, one meaning, what the word does here and its grammar,
 * with Previous, Next and More about it. No certainty badge, lesson card, credit or dictionary until More about it is pressed.
 */
async function firstLayer(page, tag) {
  const look = page.locator(LOOKUP);
  await look.getByText("Looking it up…").waitFor({ state: "detached", timeout: 20000 }).catch(() => found.push(`${tag}: the first layer was still "Looking it up…" after 20 s`));
  const seen = await page.evaluate((LOOKUP) => {
    const el = document.querySelector(LOOKUP);
    return {
      text: el?.textContent ?? "",
      badges: el?.querySelectorAll(".tag").length ?? 0,
      lessons: el?.querySelectorAll('a[href^="/academy/lesson/"], [class*="lessonLink"]').length ?? 0,
      meaning: el?.querySelector('[class*="cardMeaning"]')?.textContent?.trim() ?? "",
    };
  }, LOOKUP);
  if (seen.badges) found.push(`${tag}: the first layer shows a certainty badge before "More about it" is pressed`);
  if (seen.lessons) found.push(`${tag}: the first layer shows the lesson card before "More about it" is pressed`);
  const credit = seen.text.match(/GLAUx|CC BY|Analysis:|Keersmaekers|Dickinson College|Perseus Digital/);
  if (credit) found.push(`${tag}: the first layer shows a credit ("${credit[0]}") before "More about it" is pressed`);
  if (/Dictionary · LSJ/.test(seen.text)) found.push(`${tag}: the first layer shows the dictionary before "More about it" is pressed`);
  if (!seen.meaning) found.push(`${tag}: the first layer has no meaning line`);
}

/** "More about it" reveals the rest, the dictionary included. */
async function openMore(page, tag) {
  const more = page.locator(LOOKUP).getByRole("button", { name: "More about it" });
  if (!(await more.count())) { found.push(`${tag}: no "More about it" button`); return false; }
  await more.click();
  await page.waitForTimeout(700);
  if (!/Dictionary · LSJ/.test((await page.locator(LOOKUP).textContent()) ?? "")) found.push(`${tag}: "More about it" did not reveal the dictionary ("Dictionary · LSJ")`);
  return true;
}

// ---- margin: one book on a computer
const inMargin = (tag, b) => {
  if (!b.look) { found.push(`margin ${tag}: no look-up opened`); return; }
  const over = Math.max(b.tr?.right ?? 0, b.grc?.right ?? 0);
  if (b.look.left < over - 1) found.push(`margin ${tag}: the look-up reaches ${Math.round(over - b.look.left)} px over the text (it belongs in the margin)`);
  if (b.bar && b.look.top < b.bar.bottom - 1) found.push(`margin ${tag}: the look-up covers the reader's bar by ${Math.round(b.bar.bottom - b.look.top)} px`);
  if (b.look.right - b.look.left < 280) found.push(`margin ${tag}: the look-up is ${Math.round(b.look.right - b.look.left)} px wide (at least 280)`);
  if (b.side && b.look.right > b.side.left + 1) found.push(`margin ${tag}: the look-up reaches ${Math.round(b.look.right - b.side.left)} px under the panel beside the text`);
  if (b.lookPos !== "fixed") found.push(`margin ${tag}: the look-up is not fixed to the screen (it scrolls away with the text)`);
};
for (const [w, h, scheme, find] of [[1280, 900, "light"], [1440, 900, "dark"], [1440, 900, "light", true]]) {
  const tag = `${w}px ${scheme === "dark" ? "Night" : "Paper"}${find ? " with Find open" : ""}`;
  const { ctx, page } = await open(w, h, scheme, `/read?w=${WORK}`);
  if (find) {
    await page.keyboard.press("Control+f");
    await page.waitForSelector('aside[aria-label^="Find"]', { timeout: 10000 }).catch(() => found.push(`margin ${tag}: Find did not open`));
    await page.waitForTimeout(900);
  }
  // (with Find open the English stands under the Greek, so the lower word is looked for a little higher)
  for (const frac of find ? [0.3, 0.5] : [0.3, 0.75]) {
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
    await firstLayer(page, `margin ${tag}`);
    // the text scrolls under the window; the window stays where it is
    await page.mouse.move(200, h / 2);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(700);
    const s2 = await boxes(page);
    if (!s2.look) found.push(`margin ${tag}: the look-up closed when the text was scrolled`);
    else if (Math.abs(s2.look.top - b.look.top) > 2 || Math.abs(s2.look.left - b.look.left) > 2) found.push(`margin ${tag}: the look-up moved ${Math.round(s2.look.top - b.look.top)} px when the text was scrolled`);
    const next = page.locator(LOOKUP).getByRole("button", { name: "Next word" });
    if (await next.count()) { await next.click(); await page.waitForTimeout(900); inMargin(`${tag}, on the next word`, await boxes(page)); }
    else found.push(`margin ${tag}: no Next word button`);
    // with the rest opened, the window still stays where it is
    if (await openMore(page, `margin ${tag}`)) inMargin(`${tag}, with More about it open`, await boxes(page));
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
  await firstLayer(page, `sheet ${label}`);
  // "More about it" raises the sheet to all the room it has, and reveals the dictionary
  if (await openMore(page, `sheet ${label}`)) await check("at its full height");
  const next = page.locator(LOOKUP).getByRole("button", { name: "Next word" });
  if (await next.count()) { await next.click(); await page.waitForTimeout(900); await check("on the next word"); }
  await ctx.close();
}

await browser.close();
if (found.length) {
  console.error(`The look-up: ${found.length} problem(s)\n  ` + found.join("\n  "));
  process.exit(1);
}
console.log("The look-up: a first layer with no badge, lesson card or credit, and the rest behind More about it; a window at least 280 px wide floating over the right margin on a computer, still while the text scrolls (with a panel open too), and a low sheet that stops below the line elsewhere");
