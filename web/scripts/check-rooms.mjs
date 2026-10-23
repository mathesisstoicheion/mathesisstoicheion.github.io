// The other rooms' check (review fix list, slice 9), at a computer's width and a phone's. It lists:
//   stoa     - the Painted Stoa's page with more than one search box (or way into one); "The weird" and "The strange" as two
//              categories; a photograph on the page tinted or turned grey: photographs are shown in their real colours (the
//              printed page, docs/adr/0008-the-printed-page.md, decision 6; this replaces the engraving's gold of ADR 7)
//   treasury - the Treasury's section names in another face (family and width) than the site's card headings (the Academy's "Practice and reference")
//   account  - the sign-in below the portrait on a phone, or below the first screen on a computer; a date in CE or BCE
// The Agora's page (the Town Hall) is not checked: the forum is frozen and hidden from visitors (FORUM_OPEN, CLAUDE.md).
// usage: node web/scripts/check-rooms.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        PROVE_CSS=<css> adds a fault to every page, to show the check catches it. Proved 2026-10-23: the Stoa's
//        photographs turned sepia were each listed.
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];

for (const [w, h] of [[1280, 900], [375, 812]]) {
  const tag = `${w}px`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block" });
  if (process.env.PROVE_CSS) await ctx.addInitScript((c) => addEventListener("load", () => document.head.append(Object.assign(document.createElement("style"), { textContent: c }))), process.env.PROVE_CSS);
  const page = await ctx.newPage();

  // ---- the Painted Stoa
  await page.goto(base + "/stoa");
  await page.waitForTimeout(1500);
  const stoa = await page.evaluate(() => {
    const shown = (e) => e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== "hidden";
    const searches = [...document.querySelectorAll('main input[type="search"], main [aria-label^="Search the Painted Stoa"]')].filter(shown);
    const boxes = new Set(searches.map((e) => (e.closest("label, form, [class*=search]") ?? e)));
    const titles = [...document.querySelectorAll("main h2, main h3")].map((e) => e.textContent.trim());
    // a filter that changes its colours (grey, sepia, a tint, a dimming, a drawn SVG filter) or a blend into what lies
    // under it; a blur leaves the colours as they are (the ink-in passes through one), and so does a function at its
    // identity value (sepia(0), saturate(1))
    const SAME = { grayscale: 0, sepia: 0, invert: 0, saturate: 1, brightness: 1, contrast: 1, opacity: 1, "hue-rotate": 0 };
    const tints = (f) => /url\(/.test(f) || [...f.matchAll(/([a-z-]+)\(([^)]*)\)/g)]
      .some(([, fn, arg]) => fn in SAME && parseFloat(arg) / (arg.trim().endsWith("%") ? 100 : 1) !== SAME[fn]);
    const photos = [...document.querySelectorAll("main img")].filter(shown)
      .filter((i) => { const s = getComputedStyle(i); return tints(s.filter) || s.mixBlendMode !== "normal"; })
      .map((i) => `${i.alt.slice(0, 50)}" (${tints(getComputedStyle(i).filter) ? getComputedStyle(i).filter : getComputedStyle(i).mixBlendMode})`);
    return { boxes: boxes.size, weird: titles.includes("The weird") && titles.includes("The strange"), photos };
  });
  if (stoa.boxes > 1) found.push(`stoa ${tag}: ${stoa.boxes} search boxes on the Painted Stoa's page`);
  if (stoa.weird) found.push(`stoa ${tag}: "The weird" and "The strange" are two categories`);
  for (const p of stoa.photos) found.push(`stoa ${tag}: the photograph "${p} is not in its real colours on the Stoa's page`);

  // ---- the Treasury, against the Academy's cards
  await page.goto(base + "/academy");
  await page.waitForTimeout(800);
  const card = await page.evaluate(() => {
    const h = document.querySelector("#tools-title")?.closest("section")?.querySelector("h3");
    if (!h) return null;
    const s = getComputedStyle(h);
    return `${s.fontFamily.split(",")[0]} / ${s.fontStretch}`;
  });
  await page.goto(base + "/treasury");
  await page.waitForTimeout(1200);
  const tiles = await page.evaluate(() => [...document.querySelectorAll('nav[aria-label="Sections of the Treasury"] [class*="Label"]')].map((e) => {
    const s = getComputedStyle(e);
    return { t: e.textContent.trim(), f: `${s.fontFamily.split(",")[0]} / ${s.fontStretch}` };
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
