// The other rooms' check (review fix list, slice 9), at a computer's width and a phone's. It lists:
//   stoa     - the Painted Stoa's page with more than one search box (or way into one); "The weird" and "The strange" as two
//              categories; a photograph on the page without the engraving's gold (docs/adr/0007-photographs-in-the-stoa.md)
//   treasury - the Treasury's section names in another face than the site's card headings (the Academy's "Practice and reference")
//   account  - the sign-in below the portrait on a phone, or below the first screen on a computer; a date in CE or BCE
// The Agora's page (the Town Hall) is not checked: the forum is frozen and hidden from visitors (FORUM_OPEN, CLAUDE.md).
// usage: node web/scripts/check-rooms.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];

for (const [w, h] of [[1280, 900], [375, 812]]) {
  const tag = `${w}px`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block" });
  const page = await ctx.newPage();

  // ---- the Painted Stoa
  await page.goto(base + "/stoa");
  await page.waitForTimeout(1500);
  const stoa = await page.evaluate(() => {
    const shown = (e) => e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== "hidden";
    const searches = [...document.querySelectorAll('main input[type="search"], main [aria-label^="Search the Painted Stoa"]')].filter(shown);
    const boxes = new Set(searches.map((e) => (e.closest("label, form, [class*=search]") ?? e)));
    const titles = [...document.querySelectorAll("main h2, main h3")].map((e) => e.textContent.trim());
    const photos = [...document.querySelectorAll("main img")].filter(shown)
      .filter((i) => !/grayscale|sepia/.test(getComputedStyle(i).filter)).map((i) => i.alt.slice(0, 50));
    return { boxes: boxes.size, weird: titles.includes("The weird") && titles.includes("The strange"), photos };
  });
  if (stoa.boxes > 1) found.push(`stoa ${tag}: ${stoa.boxes} search boxes on the Painted Stoa's page`);
  if (stoa.weird) found.push(`stoa ${tag}: "The weird" and "The strange" are two categories`);
  for (const p of stoa.photos) found.push(`stoa ${tag}: the photograph "${p}" is in full colour on the Stoa's page`);

  // ---- the Treasury, against the Academy's cards
  await page.goto(base + "/academy");
  await page.waitForTimeout(800);
  const card = await page.evaluate(() => {
    const h = document.querySelector("#tools-title")?.closest("section")?.querySelector("h3");
    if (!h) return null;
    const s = getComputedStyle(h);
    return `${s.fontFamily.split(",")[0]} / ${s.fontStretch} / ${s.fontWeight}`;
  });
  await page.goto(base + "/treasury");
  await page.waitForTimeout(1200);
  const tiles = await page.evaluate(() => [...document.querySelectorAll('nav[aria-label="Sections of the Treasury"] button > span:nth-child(2)')].map((e) => {
    const s = getComputedStyle(e);
    return { t: e.textContent.trim(), f: `${s.fontFamily.split(",")[0]} / ${s.fontStretch} / ${s.fontWeight}` };
  }));
  if (!card) found.push(`treasury ${tag}: the Academy's "Practice and reference" cards were not found`);
  if (!tiles.length) found.push(`treasury ${tag}: the Treasury's sections were not found`);
  for (const x of tiles.filter((x) => card && x.f !== card)) found.push(`treasury ${tag}: "${x.t}" is set in ${x.f}, the site's card headings in ${card}`);

  // ---- the account page, signed out
  await page.goto(base + "/account");
  await page.waitForTimeout(1500);
  const acct = await page.evaluate(() => {
    const top = (e) => (e ? e.getBoundingClientRect().top + scrollY : Infinity);
    // the way in: the Sign in and Join tabs, or, while the account service is reached, its "Opening the doors…"
    const form = document.querySelector('main [role="tablist"][aria-label="Account"]') ?? document.querySelector('main [aria-busy="true"]');
    const pic = [...document.querySelectorAll("main canvas[role=img], main img")].find((e) => e.getBoundingClientRect().width > 0);
    const era = (document.querySelector("main")?.innerText ?? "").match(/\b\d+(?:st|nd|rd|th)? (?:century )?B?CE\b|\bB?CE \d+/);
    return { form: top(form), pic: top(pic), era: era?.[0] ?? null };
  });
  if (acct.form === Infinity) found.push(`account ${tag}: the sign-in was not found`);
  else if (w < 700 && acct.pic < acct.form) found.push(`account ${tag}: the sign-in comes after the portrait (${Math.round(acct.form)} px down, the portrait at ${Math.round(acct.pic)} px)`);
  else if (w >= 700 && acct.form > h * 0.85) found.push(`account ${tag}: the sign-in starts ${Math.round(acct.form)} px down, below the first screen`);
  if (acct.era) found.push(`account ${tag}: the page says "${acct.era}" (BC and AD on this site)`);
  await ctx.close();
}

await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : "the other rooms are in order");
process.exit(found.length ? 1 : 0);
