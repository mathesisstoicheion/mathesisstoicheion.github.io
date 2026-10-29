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
// And they check the second layer (ticket 06). One press of "More about it" shows, in this order, the LSJ entry (with "The whole
// entry"), where else the word occurs (a button that opens Echoes), "How the sentence is built", the lesson, Word Study and the
// other dictionaries, under the same small-capitals headings on a computer and a phone; the meaning the first layer gave is not
// said again; the credits are ONE line, once, at the very foot, naming only what is shown. "‹ Back" or Escape returns to the
// first layer (on a phone at its resting height, the keyboard on "More about it"), then Escape closes the look-up and gives the
// keyboard back to the word; × closes it from the second layer. On a computer the same window keeps its left edge and width,
// grows to the height it may have, and stays fixed while the text scrolls. μῆνιν in the Iliad, 1.1 (on a computer and a phone)
// is checked in full: "12 times in the Iliad" (the number of words GLAUx analyses as μῆνις in the whole pack), the lesson "Why the
// accusative?", the credit line "Analysis and treebank: GLAUx (Keersmaekers 2021), CC BY-SA 4.0 · LSJ: Perseus Digital Library, CC BY-SA".
// And the back routes (the quiet desk, the owner, 2026-10-29: "the word lookup in the reader needs a back button"): from the second
// layer, "How the sentence is built" and "12 times in the Iliad" open the sentence panel and Echoes with a "‹ Back to μῆνις" that
// closes them and brings the look-up back on the same word with "More about it" open (Escape in them still just closes them); "‹ Back"
// in the second layer is at least 44 × 44 px under a finger; and on a phone the browser's Back steps second layer, first layer,
// closed (page.goBack()) without leaving /read or moving the passage, while × and Previous and Next keep the history level.
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
  // the look-up must keep clear of the English beside the Greek, so this reader has chosen "Both" (a book opens on Greek alone now;
  // the quiet desk, ticket 07): the saved settings, version 3
  await page.addInitScript(() => { localStorage.setItem("mathesis:settings", JSON.stringify({ state: { columns: "both" }, version: 3 })); });
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

/** The meaning line of the first layer, as it stands. */
const meaningOf = (page) => page.evaluate((LOOKUP) => document.querySelector(LOOKUP)?.querySelector('[class*="cardMeaning"]')?.textContent?.replace(/\s*\(from [^)]*\)\s*$/, "").trim() ?? "", LOOKUP);
const layerOf = (page) => page.evaluate((LOOKUP) => document.querySelector(LOOKUP)?.getAttribute("data-layer") ?? "", LOOKUP);
const norm = (x) => x.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

/**
 * "More about it", and everything the second layer must be (ticket 06). The look-up stands in its first layer; this presses
 * More, checks what it then shows and where, calls `during` (the caller's own checks of the open second layer), then goes back
 * to the first layer by Escape and again by "‹ Back", leaving the look-up open in its first layer.
 *   opts.sheet   a sheet (a phone, a narrow window, two books) rather than the window over the margin
 *   opts.exact   the word is μῆνιν in the Iliad: the counted line, the lesson, Word Study and the credits are all checked exactly
 */
async function secondLayer(page, tag, opts, during) {
  const look = page.locator(LOOKUP);
  const rest = (await boxes(page)).look;
  const meaning = await meaningOf(page);
  if (!(await openMore(page, tag))) return;
  const open = await page.evaluate((LOOKUP) => {
    const el = document.querySelector(LOOKUP);
    const text = (e) => e.textContent.trim().replace(/\s+/g, " ");
    const find = (sel, re) => [...el.querySelectorAll(sel)].find((e) => re.test(text(e)));
    const shown = (e) => !!e && e.checkVisibility() && e.getClientRects().length > 0;
    const credits = [...el.querySelectorAll("[data-credits]")];
    let after = "";
    if (credits.length) { const r = document.createRange(); r.setStartAfter(credits[credits.length - 1]); r.setEndAfter(el.lastChild); after = r.toString().trim(); }
    return {
      layer: el.getAttribute("data-layer"),
      text: text(el),
      first: !!el.querySelector('[class*="cardMeaning"]'),
      heads: [...el.querySelectorAll("h3")].map((e) => ({ t: text(e), shown: shown(e) })),
      // the parts, in the order they must stand
      parts: [
        ["the LSJ heading", find("h3", /^Dictionary · LSJ/)],
        ["“The whole entry”", find("button", /^The whole entry$/)],
        ["where else it occurs", find("button", /times in the|^Once in the|^Where else it occurs$/)],
        ["“How the sentence is built”", find("button", /^How the sentence is built$/)],
        ["the lesson", el.querySelector('a[href^="/academy/lesson/"]')],
        ["Word Study", el.querySelector('a[href^="/treasury/word"]')],
        ["the other dictionaries", find("h3", /^More dictionaries$/)],
        ["the credits", credits[0] ?? null],
      ].map(([name, node]) => ({ name, found: !!node, shown: shown(node), before: node ? [...el.querySelectorAll("*")].indexOf(node) : -1, text: node ? text(node) : "", href: node?.getAttribute?.("href") ?? "" })),
      credits: credits.map(text),
      // the short definitions and senses the second layer gives (LSJ's, Wiktionary's)
      glosses: [...el.querySelectorAll('[class*="gloss"], [class*="senses"] p')].map(text),
      creditCount: credits.length,
      after,
      focusOnBack: document.activeElement?.textContent?.trim().endsWith("Back") ?? false,
      back: (() => {
        const b = [...el.querySelectorAll("button")].find((x) => /^‹?\s*Back$/.test(x.textContent.trim()));
        const r = b?.getBoundingClientRect();
        return b ? { w: r.width, h: r.height, size: parseFloat(getComputedStyle(b).fontSize), coarse: matchMedia("(pointer: coarse)").matches } : null;
      })(),
    };
  }, LOOKUP);
  if (open.layer !== "2") found.push(`${tag}: "More about it" did not show the second layer (data-layer ${open.layer})`);
  if (open.first) found.push(`${tag}: the second layer still shows the card of the first layer (the meaning is said again)`);
  // "‹ Back" is a button to find and to hit: a finger's 44 × 44 px on a touch screen, and as large as the panel's reading size
  if (!open.back) found.push(`${tag}: no "‹ Back" button in the second layer`);
  else if (open.back.coarse && (open.back.h < 43.5 || open.back.w < 43.5)) found.push(`${tag}: "‹ Back" is ${Math.round(open.back.w)} × ${Math.round(open.back.h)} px under a finger (at least 44 × 44)`);
  else if (!open.back.coarse && (open.back.h < 32 || open.back.size < 15)) found.push(`${tag}: "‹ Back" is ${Math.round(open.back.h)} px tall in ${Math.round(open.back.size)} px letters (it is a button at the panel's reading size)`);
  if (!open.focusOnBack) found.push(`${tag}: the keyboard did not move into the second layer when it opened (it belongs on "‹ Back")`);
  const has = (name) => open.parts.find((x) => x.name === name);
  // (a word with no LSJ entry or no analysis has no “whole entry” or credit to show, so only μῆνιν is held to all of them)
  const want = ["the LSJ heading", "where else it occurs", "“How the sentence is built”", "the other dictionaries"];
  if (opts.exact) want.push("“The whole entry”", "Word Study", "the lesson", "the credits");
  for (const name of want) if (!has(name).found) found.push(`${tag}: the second layer has no ${name}`);
  for (const x of open.parts) if (x.found && !x.shown) found.push(`${tag}: ${x.name} is in the second layer but not shown`);
  const placed = open.parts.filter((x) => x.found);
  for (let i = 1; i < placed.length; i++) if (placed[i].before < placed[i - 1].before) found.push(`${tag}: ${placed[i].name} comes before ${placed[i - 1].name} (the order is the LSJ entry, where else, the sentence, the lesson, Word Study, the other dictionaries, the credits)`);
  // the same small-capitals headings on a computer and a phone (none hidden)
  for (const hd of open.heads) if (!hd.shown) found.push(`${tag}: the heading "${hd.t}" is hidden (the computer and the phone show the same headings)`);
  if (!open.heads.some((x) => x.t === "Dictionary · LSJ")) found.push(`${tag}: no "Dictionary · LSJ" heading`);
  // credits: one line, once, at the very foot, and no other credit anywhere in the look-up
  if (open.creditCount > 1 || (opts.exact && open.creditCount !== 1)) found.push(`${tag}: ${open.creditCount} credit lines in the second layer (there is exactly one, at the foot)`);
  if (open.after) found.push(`${tag}: "${open.after.slice(0, 40)}" stands below the credits (they are the very foot)`);
  const once = (re, what) => { const n = (open.text.match(re) ?? []).length; if (n > 1 || (opts.exact && n !== 1)) found.push(`${tag}: ${what} appears ${n} times in the second layer (once, in the credit line)`); };
  once(/Keersmaekers/g, "GLAUx's credit");
  once(/Perseus Digital Library/g, "LSJ's credit");
  if (/Analysis:|Text provided under|Data accessed from/.test(open.text)) found.push(`${tag}: an old credit line is still in the second layer`);
  if (opts.exact) {
    const line = open.credits[0] ?? "";
    if (line !== "Analysis and treebank: GLAUx (Keersmaekers 2021), CC BY-SA 4.0 · LSJ: Perseus Digital Library, CC BY-SA") found.push(`${tag}: the credit line reads "${line}"`);
    const where = has("where else it occurs").text;
    if (where !== "12 times in the Iliad") found.push(`${tag}: the where-else line reads "${where}" (12 times in the Iliad)`);
    if (!/Why the accusative\?/.test(has("the lesson").text) || has("the lesson").href !== "/academy/lesson/case") found.push(`${tag}: the lesson reads "${has("the lesson").text}" at ${has("the lesson").href}`);
  }
  // the meaning the first layer gave is not given again
  if (meaning && open.glosses.some((g) => norm(g) === norm(meaning))) found.push(`${tag}: the second layer says the first layer's meaning ("${meaning.slice(0, 40)}") again`);
  // the same window, grown in place
  const now = (await boxes(page)).look;
  if (now && rest) {
    if (opts.sheet) { if (now.height <= rest.height + 1) found.push(`${tag}: the sheet did not rise for the second layer (${Math.round(rest.height)} px before, ${Math.round(now.height)} px after)`); }
    else {
      if (Math.abs(now.left - rest.left) > 1 || Math.abs(now.right - rest.right) > 1) found.push(`${tag}: the second layer's window moved or changed width (left ${Math.round(rest.left)} to ${Math.round(now.left)}, right ${Math.round(rest.right)} to ${Math.round(now.right)})`);
      if (now.height <= rest.height + 1) found.push(`${tag}: the window did not grow for the second layer (${Math.round(rest.height)} px before, ${Math.round(now.height)} px after)`);
      const vh = page.viewportSize().height;
      if (now.bottom > vh + 1) found.push(`${tag}: the second layer reaches ${Math.round(now.bottom - vh)} px below the screen`);
    }
  }
  await during?.();
  // the text scrolls under the window; on a computer the window with the second layer open stays where it is
  if (!opts.sheet && now) {
    await page.mouse.move(200, page.viewportSize().height / 2);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(700);
    const s = (await boxes(page)).look;
    if (!s) found.push(`${tag}: the look-up closed when the text was scrolled with the second layer open`);
    else if (Math.abs(s.top - now.top) > 2 || Math.abs(s.left - now.left) > 2) found.push(`${tag}: the second layer moved ${Math.round(s.top - now.top)} px when the text was scrolled`);
  }
  // Escape goes back to the first layer, and the look-up stays open with the keyboard on "More about it"
  await look.focus();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);
  const esc = await page.evaluate((LOOKUP) => ({ open: !!document.querySelector(LOOKUP), layer: document.querySelector(LOOKUP)?.getAttribute("data-layer"), onMore: document.activeElement?.textContent?.trim() === "More about it" }), LOOKUP);
  if (!esc.open) found.push(`${tag}: Escape in the second layer closed the look-up (it goes back to the first layer)`);
  else {
    if (esc.layer !== "1") found.push(`${tag}: Escape in the second layer did not go back to the first layer`);
    if (!esc.onMore) found.push(`${tag}: after Escape the keyboard is not on "More about it"`);
  }
  // and "‹ Back" does the same, to the height it rested at
  await look.getByRole("button", { name: "More about it" }).click();
  await page.waitForTimeout(700);
  await look.getByRole("button", { name: "Back" }).click();
  await page.waitForTimeout(700);
  const back = await boxes(page);
  if ((await layerOf(page)) !== "1") found.push(`${tag}: "‹ Back" did not return to the first layer`);
  else if (back.look && rest && Math.abs(back.look.height - rest.height) > 2 && opts.sheet) found.push(`${tag}: after "‹ Back" the sheet is ${Math.round(back.look.height)} px tall (it rested at ${Math.round(rest.height)} px)`);
  if (!(await meaningOf(page))) found.push(`${tag}: after "‹ Back" the first layer has no meaning line`);
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
    // with the rest opened, the window still stays where it is (it ends back in the first layer)
    await secondLayer(page, `margin ${tag}`, { sheet: false }, async () => inMargin(`${tag}, with More about it open`, await boxes(page)));
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
  // "More about it" raises the sheet to all the room it has, and reveals the dictionary; "‹ Back" brings it down again
  await secondLayer(page, `sheet ${label}`, { sheet: true }, async () => { await check("at its full height"); });
  const next = page.locator(LOOKUP).getByRole("button", { name: "Next word" });
  if (await next.count()) { await next.click(); await page.waitForTimeout(900); await check("on the next word"); }
  await ctx.close();
}

/** Open the look-up on μῆνιν, Iliad 1.1, with the word tapped on a phone and clicked elsewhere. */
async function lookUp(page, phone) {
  const word = page.locator('[data-u="1.1"] [data-w="μῆνιν"]');
  if (phone) await word.tap(); else await word.click();
  await page.waitForSelector(LOOKUP, { timeout: 10000 });
  await page.waitForTimeout(900);
  await page.locator(LOOKUP).getByText("Looking it up…").waitFor({ state: "detached", timeout: 20000 }).catch(() => {});
}
const headOf = (page) => page.evaluate((LOOKUP) => document.querySelector(LOOKUP)?.querySelector('[class*="pw"]')?.textContent?.trim() ?? "", LOOKUP);

/**
 * The back routes (from the second layer to the sentence panel or Echoes, and back to the word). The look-up stands in its
 * first layer, on μῆνιν. Each route: More about it, then the link; the look-up closes and the panel opens with "‹ Back to μῆνις";
 * Back brings the look-up back on the same word in the second layer. Escape in the panel only closes it. Ends with the look-up
 * open in its first layer.
 */
async function backRoutes(page, tag, phone) {
  const look = page.locator(LOOKUP);
  for (const [name, link, panel] of [
    ["the sentence", /^How the sentence is built$/, 'aside[aria-label="How the sentence is built"]'],
    ["where else", /times in the|^Once in the|^Where else it occurs$/, 'aside[aria-label="Echoes"]'],
  ]) {
    const here = `${tag}, ${name}`;
    for (const pass of ["escape", "back"]) {
      if (!(await look.count())) await lookUp(page, phone);
      if ((await layerOf(page)) !== "2") { await look.getByRole("button", { name: "More about it" }).click(); await page.waitForTimeout(700); }
      await look.getByRole("button", { name: link }).click();
      const shown = await page.waitForSelector(panel, { timeout: 20000 }).then(() => true, () => false);
      if (!shown) { found.push(`${here}: the panel did not open`); return; }
      await page.waitForTimeout(700);
      if (await look.count()) found.push(`${here}: the look-up stayed open under the panel`);
      const back = page.locator(panel).getByRole("button", { name: /^Back to/ });
      if (!(await back.count())) { found.push(`${here}: the panel has no "Back to" button`); await page.locator(panel).focus(); await page.keyboard.press("Escape"); continue; }
      const label = ((await back.first().textContent()) ?? "").trim().replace(/\s+/g, " ");
      if (pass === "escape") {
        if (!/^‹ Back to μῆνις$/.test(label)) found.push(`${here}: the button reads "${label}" (‹ Back to μῆνις)`);
        // Escape in the panel closes it, as before, and does not bring the look-up back
        await page.locator(panel).focus();
        await page.keyboard.press("Escape");
        await page.waitForTimeout(700);
        if (await page.locator(panel).count()) found.push(`${here}: Escape did not close the panel`);
        if (await look.count()) found.push(`${here}: Escape in the panel brought the look-up back (it only closes the panel)`);
        continue;
      }
      await back.first().click();
      await page.waitForSelector(LOOKUP, { timeout: 10000 }).catch(() => found.push(`${here}: "Back to μῆνις" did not bring the look-up back`));
      await page.waitForTimeout(1000);
      if (await page.locator(panel).count()) found.push(`${here}: the panel stayed open after "Back to μῆνις"`);
      if (!(await look.count())) continue;
      if ((await layerOf(page)) !== "2") found.push(`${here}: the look-up came back in layer ${await layerOf(page)} (the second layer, "More about it", is where the reader came from)`);
      if (!/Dictionary · LSJ/.test((await look.textContent()) ?? "")) found.push(`${here}: the look-up came back without "More about it" open`);
      if ((await headOf(page)) !== "μῆνις") found.push(`${here}: the look-up came back on "${await headOf(page)}" (the same word, μῆνις)`);
      const marked = await page.evaluate(() => [...document.querySelectorAll("article [data-w][class*='__sel']")].map((e) => e.getAttribute("data-w")));
      if (marked.join() !== "μῆνιν") found.push(`${here}: the word marked in the text is "${marked.join()}" (μῆνιν)`);
      // and it is the second layer's own Back that goes on from here
      await look.focus();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(600);
    }
  }
}

/**
 * The phone's back gesture steps back through the look-up: second layer, first layer, closed, with the reader staying on its page
 * and its passage; and × / Previous and Next keep the history level (they add nothing of their own).
 */
async function historySteps(page, tag) {
  const look = page.locator(LOOKUP);
  const state = () => page.evaluate(() => ({ step: history.state?.lookupStep ?? 0, len: history.length, path: location.pathname, search: location.search, top: Math.round(document.querySelector('[data-u="1.1"] [data-w="μῆνιν"]')?.getBoundingClientRect().top ?? -9999) }));
  const wait = () => page.waitForTimeout(800);
  // (a Back that left the reader leaves nothing more to check)
  const left = () => { const gone = !new URL(page.url()).pathname.startsWith(new URL(start.url).pathname); if (gone) found.push(`${tag}: the browser's Back left the reader (now at ${page.url()})`); return gone; };
  const start = { ...(await state()), url: page.url() };
  await lookUp(page, true);
  const first = await state();
  if (first.step !== 1 || first.len !== start.len + 1) found.push(`${tag}: opening the look-up left the history at step ${first.step}, ${first.len - start.len} entries added (one step, one entry)`);
  const placed = first.top;   // where the line stands with the look-up open (it may have been brought up)
  await look.getByRole("button", { name: "More about it" }).click();
  await wait();
  const second = await state();
  if (second.step !== 2 || second.len !== start.len + 2) found.push(`${tag}: "More about it" left the history at step ${second.step}, ${second.len - start.len} entries added (two)`);
  // the browser's Back: the second layer to the first
  await page.goBack().catch(() => {});
  await wait();
  if (left()) return;
  if (!(await look.count())) found.push(`${tag}: Back from the second layer closed the look-up (it goes to the first layer)`);
  else if ((await layerOf(page)) !== "1") found.push(`${tag}: Back from the second layer left the look-up in layer ${await layerOf(page)}`);
  let now = await state();
  if (now.path !== start.path || now.search !== start.search) found.push(`${tag}: Back changed the page address to ${now.path}${now.search}`);
  if (now.step !== 1) found.push(`${tag}: Back from the second layer landed on step ${now.step} (1)`);
  // Next adds no entry
  const next = look.getByRole("button", { name: "Next word" });
  if (await next.count()) {
    await next.click(); await wait();
    const stepped = await state();
    if (stepped.len !== now.len || stepped.step !== 1) found.push(`${tag}: Next word changed the history (step ${stepped.step}, ${stepped.len - now.len} entries added)`);
    await look.getByRole("button", { name: "Previous word" }).click(); await wait();
  }
  // the browser's Back again: the first layer closes
  await page.goBack().catch(() => {});
  await wait();
  if (left()) return;
  if (await look.count()) found.push(`${tag}: a second Back did not close the look-up`);
  now = await state();
  if (now.path !== start.path || now.search !== start.search) found.push(`${tag}: Back left or changed the page (${now.path}${now.search})`);
  if (now.step !== 0) found.push(`${tag}: after the look-up closed the history is at step ${now.step} (0)`);
  if (!(await page.locator('[data-u="1.1"] [data-w="μῆνιν"]').count())) found.push(`${tag}: after Back the reader no longer shows Iliad 1.1`);
  else if (Math.abs(now.top - placed) > 40 && Math.abs(now.top - start.top) > 40) found.push(`${tag}: Back moved the passage (the line stood ${placed} px from the top with the look-up open and ${start.top} px before, then ${now.top} px)`);
  // × from the second layer steps back over both entries, and a new look-up is not stacked on old ones
  await lookUp(page, true);
  await look.getByRole("button", { name: "More about it" }).click();
  await wait();
  await look.getByRole("button", { name: "Close look-up" }).click();
  await wait();
  now = await state();
  if (await look.count()) found.push(`${tag}: × did not close the look-up`);
  if (now.step !== 0 || now.path !== start.path || now.search !== start.search) found.push(`${tag}: after × the history is at step ${now.step} on ${now.path}${now.search} (step 0, the reader's page)`);
  await lookUp(page, true);
  if ((await state()).step !== 1) found.push(`${tag}: a look-up opened after × is at step ${(await state()).step} (1)`);
  // Escape closes it too (from the first layer, with the keyboard in the look-up), and a tap in the margin of the text
  await look.focus();
  await page.keyboard.press("Escape");
  await wait();
  now = await state();
  if (now.step !== 0) found.push(`${tag}: after Escape the history is at step ${now.step} (0)`);
  // Back now leaves nothing of the look-up to step through: it must not close or reopen anything
  if (await look.count()) found.push(`${tag}: Escape did not close the look-up`);
}

// ---- the second layer on μῆνιν, Iliad 1.1: a computer (the window over the margin) and a phone (the sheet)
for (const [w, h, label] of [[1280, 900, "1280px"], [390, 844, "390px"]]) {
  const tag = `μῆνιν in the Iliad, ${label}`;
  const { ctx, page } = await open(w, h, "light", "/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  const word = page.locator('[data-u="1.1"] [data-w="μῆνιν"]');
  if (w < 800) await word.tap(); else await word.click();
  await page.waitForSelector(LOOKUP, { timeout: 10000 });
  await page.waitForTimeout(900);
  await firstLayer(page, tag);
  if (w >= 800) inMargin(tag, await boxes(page));
  await secondLayer(page, tag, { sheet: w < 800, exact: true });
  await backRoutes(page, tag, w < 800);
  if (!(await page.locator(LOOKUP).count())) await lookUp(page, w < 800);
  if ((await layerOf(page)) === "2") { await page.locator(LOOKUP).focus(); await page.keyboard.press("Escape"); await page.waitForTimeout(600); }
  // × closes the look-up from the second layer, not only back to the first
  await page.locator(LOOKUP).getByRole("button", { name: "More about it" }).click();
  await page.waitForTimeout(500);
  await page.locator(LOOKUP).getByRole("button", { name: "Close look-up" }).click();
  await page.waitForTimeout(500);
  if (await page.locator(LOOKUP).count()) found.push(`${tag}: × in the second layer did not close the look-up`);
  // Escape from the first layer closes it and gives the keyboard back to the word
  await word.focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector(LOOKUP, { timeout: 10000 });
  await page.locator(LOOKUP).focus();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const gone = await page.evaluate((LOOKUP) => ({ open: !!document.querySelector(LOOKUP), back: !!document.activeElement?.matches("article [data-w]") }), LOOKUP);
  if (gone.open) found.push(`${tag}: Escape in the first layer did not close the look-up`);
  else if (!gone.back) found.push(`${tag}: after Escape the keyboard is not back on the word`);
  await ctx.close();
}

// ---- the phone's back gesture, on a page of its own (so that the entries counted are only this one's)
{
  const { ctx, page } = await open(390, 844, "light", "/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await historySteps(page, "μῆνιν in the Iliad, 390px, the browser's Back");
  await ctx.close();
}

await browser.close();
if (found.length) {
  console.error(`The look-up: ${found.length} problem(s)\n  ` + found.join("\n  "));
  process.exit(1);
}
console.log("The look-up: a first layer with no badge, lesson card or credit, and the rest in a second layer behind More about it (the LSJ entry, where else, the sentence, the lesson, Word Study, the other dictionaries, one credit line at the foot; ‹ Back and Escape return); a window at least 280 px wide floating over the right margin on a computer, still while the text scrolls (with a panel open too), and a low sheet that stops below the line elsewhere");
