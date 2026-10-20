// The overlays check (review fix list, slice 5): every menu, sheet and panel that opens over a page must
//   hold  - keep the page behind it still: a turn of the wheel (or a swipe) over the panel never scrolls the page
//   close - close on Escape
//   focus - give the keyboard back to the button that opened it
// It opens each one at a computer and a phone size: the site's menu, the search, the settings, and in the reader the
// Aa panel, Tools, Marks, More (⋯) and the word panel.
// usage: node web/scripts/check-overlays.mjs <base-url> [filter]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100", only = ""] = process.argv.slice(2);
const READER = "/read?w=tlg0012.tlg001&at=1.1";

// each overlay: where it lives, how to find its trigger (a visible element) and its panel once open
const OVERLAYS = [
  { name: "menu", page: "/stoa", trigger: 'header button[aria-label="Menu"]', panel: "#site-menu" },
  { name: "search", page: "/stoa", trigger: 'header button[aria-label="Search"]', panel: 'dialog[open], [role="dialog"]' },
  { name: "settings", page: "/stoa", trigger: 'header button[aria-label="Settings"]', viaMenu: 'header button[aria-label="Menu"]', panel: 'dialog[open], [role="dialog"]' },
  { name: "reader Aa", page: READER, trigger: 'button[aria-label="Page and text"]', panel: "controls" },
  { name: "reader Tools", page: READER, trigger: 'button:text-is("Tools")', panel: "controls" },
  { name: "reader Marks", page: READER, trigger: 'button:text-matches("^(Marks|Your marks)")', panel: "controls" },
  { name: "reader More", page: READER, trigger: 'button[aria-label="More"]', panel: "controls" },
  { name: "word panel", page: READER, trigger: '[data-u="1.1"] [data-w]:nth-child(2)', panel: 'aside[aria-label^="Look-up"]' },
].filter((o) => o.name.includes(only));
const SIZES = [[1024, 768, "computer"], [375, 812, "phone"]];

const firstVisible = async (page, sel) => {
  for (const l of await page.locator(sel).all()) if (await l.isVisible().catch(() => false)) return l;
  return null;
};

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
let problems = 0;
for (const [w, h, size] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: size === "phone", hasTouch: size === "phone", serviceWorkers: "block" });
  for (const o of OVERLAYS) {
    const page = await ctx.newPage();
    const found = [];
    try {
      await page.goto(base + o.page);
      if (o.page.startsWith("/read")) await page.locator('[data-u="1.1"] [data-w]').first().waitFor({ timeout: 30000 });
      await page.waitForTimeout(800);
      await page.evaluate(() => scrollTo(0, Math.min(500, document.documentElement.scrollHeight - innerHeight)));
      await page.waitForTimeout(300);
      let trigger = await firstVisible(page, o.trigger);
      let returnTo = trigger;
      if (!trigger && o.viaMenu) {   // a phone keeps it inside the menu
        returnTo = await firstVisible(page, o.viaMenu);
        await returnTo?.click();
        await page.waitForTimeout(300);
        trigger = await firstVisible(page, o.trigger);
      }
      if (!trigger) throw new Error(`no visible trigger ${o.trigger}`);
      await trigger.click();
      await page.waitForTimeout(500);
      const panelSel = o.panel === "controls" ? `#${await trigger.getAttribute("aria-controls")}` : o.panel;
      const panel = await firstVisible(page, panelSel);
      if (!panel) throw new Error(`panel ${panelSel} did not open`);
      // hold: the wheel over the panel, and over the page beside it, must not move the page
      const before = await page.evaluate(() => scrollY);
      const box = await panel.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + Math.min(box.height / 2, 200));
      for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(60); }
      await page.waitForTimeout(400);
      const after = await page.evaluate(() => scrollY);
      if (Math.abs(after - before) > 2) found.push(`hold: the page behind moved ${Math.round(after - before)} px when the wheel turned over the panel`);
      const lock = await page.evaluate(() => [getComputedStyle(document.documentElement).overflowY, getComputedStyle(document.body).overflowY]);
      // close
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
      if (await panel.isVisible().catch(() => false)) found.push("close: Escape did not close it");
      // focus
      else {
        const back = await page.evaluate((el) => document.activeElement === el || el.contains(document.activeElement), await returnTo.elementHandle());
        if (!back) found.push(`focus: went to ${await page.evaluate(() => { const a = document.activeElement; return a ? `${a.tagName.toLowerCase()} "${(a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 30)}"` : "nothing"; })}, not the button that opened it`);
      }
      if (found.length && found[0].startsWith("hold")) found[0] += ` (page overflow while open: ${lock.join(" / ")})`;
    } catch (e) {
      found.push(`error: ${String(e.message || e).split("\n")[0].slice(0, 140)}`);
    }
    problems += found.length;
    console.log(`${found.length ? "✗" : "✓"} ${size.padEnd(8)} ${o.name}`);
    for (const f of found) console.log(`    ${f}`);
    await page.close();
  }
  await ctx.close();
}
// the search's own rows: no row repeats its group's title, and "Continue where you left off" never offers the home page
{
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 }, serviceWorkers: "block" });
  const page = await ctx.newPage();
  const found = [];
  await page.goto(base + "/");
  await page.waitForTimeout(600);
  await page.goto(base + "/stoa");   // a visit, so the home page is in the trail
  await page.waitForTimeout(600);
  await (await firstVisible(page, 'header button[aria-label="Search"]')).click();
  await page.waitForTimeout(500);
  const home = await page.evaluate(() => [...document.querySelectorAll("dialog[open] section[aria-labelledby='qs-continue'] li")].map((l) => l.textContent.trim()).filter((t) => /Mathesis Stoicheion|Μάθησις/.test(t)));
  if (home.length) found.push(`search: "Continue where you left off" offers the home page (${home[0].slice(0, 40)})`);
  await page.keyboard.type("Athens");
  await page.waitForTimeout(1200);
  const dupes = await page.evaluate(() => [...document.querySelectorAll("dialog[open] [role='group']")].flatMap((g) => {
    const title = (g.querySelector("[role='presentation']")?.textContent || "").trim().toLowerCase().replace(/s$/, "");
    return [...g.querySelectorAll("[role='option'] > span:first-child")].map((k) => k.textContent.trim()).filter((k) => k.toLowerCase().replace(/s$/, "") === title && k !== "");
  }));
  if (dupes.length) found.push(`search: ${dupes.length} row(s) repeat their group's title ("${dupes[0]}")`);
  problems += found.length;
  console.log(`${found.length ? "✗" : "✓"} computer search rows`);
  for (const f of found) console.log(`    ${f}`);
  await ctx.close();
}
await browser.close();
console.log(problems ? `\n${problems} problem(s)` : "\nevery overlay holds the page, closes on Escape and gives focus back");
process.exit(problems ? 1 : 0);
