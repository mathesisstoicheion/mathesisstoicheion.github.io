// The map's place panel offers the Painted Stoa's entry about a place (the owner: "clicking on Egypt gives you an option to
// read more about Egypt"). A place with an entry (Delphi) shows a "Read about" link at least 48 px tall that opens the
// entry, and the entry links back to the map; a place with none shows no such block. Phone and computer.
// usage: node web/scripts/check-map-wiki.mjs [base-url]   (exits with 1 on a problem)
import { chromium } from "playwright";
import { readdirSync, readFileSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3100";
const WITH = { id: "540726", name: "Delphi", slug: "delphi" };
const SIZES = [[390, 844], [1280, 800]];
const problems = [];
const bad = (m) => { problems.push(m); console.log("PROBLEM", m); };

// every Pleiades id some entry names (its `places: [...]` line)
const dir = new URL("../src/wiki/entries/", import.meta.url);
const named = new Set();
for (const f of readdirSync(dir)) for (const m of readFileSync(new URL(f, dir), "utf8").matchAll(/^\s*places:\s*\[([^\]]*)\]/gm)) for (const id of m[1].match(/\d+/g) ?? []) named.add(id);
const places = JSON.parse(readFileSync(new URL("../public/data/map/places.json", import.meta.url), "utf8")).places;
const none = places.find((p) => p.checked && !named.has(p.id));

const browser = await chromium.launch();
for (const [w, h] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 600, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/stoa/periplus?p=${WITH.id}`);
  const link = page.locator("[data-place-entries] a", { hasText: "Read about" }).first();
  try { await link.waitFor({ timeout: 15000 }); } catch { bad(`${w}px: no "Read about" link for ${WITH.name}`); await ctx.close(); continue; }
  await link.scrollIntoViewIfNeeded();
  const box = await link.boundingBox();
  if (!box || box.height < 47.5) bad(`${w}px: the link is ${box?.height}px tall, under 48`);
  await link.click();
  await page.waitForURL(`**/stoa/${WITH.slug}`, { timeout: 10000 }).catch(() => bad(`${w}px: the link did not open the entry`));
  const h1 = await page.locator("h1").first().innerText().catch(() => "");
  if (!/delphi/i.test(h1)) bad(`${w}px: the entry page's heading is "${h1}"`);
  if (!(await page.locator(`a[href*="/stoa/periplus?p=${WITH.id}"]`).count())) bad(`${w}px: the entry has no link back to the map`);
  await page.goto(`${base}/stoa/periplus?p=${none.id}`);
  await page.locator("aside h2").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(500);
  if (await page.locator("[data-place-entries]").count()) bad(`${w}px: ${none.en} shows an entry block though no entry names it`);
  await ctx.close();
}
await browser.close();
console.log(problems.length ? `${problems.length} problem(s)` : `ok (${places.length} places, ${named.size} with entries)`);
process.exit(problems.length ? 1 : 0);
