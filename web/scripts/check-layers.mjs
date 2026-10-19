// The graphics-memory check (DESIGN.md, "Before anything goes live"). Measures the composited layers a page asks the graphics chip to hold, at several scroll positions, on a phone at 3x.
// usage: node web/scripts/check-layers.mjs <url> [dpr] [stops]   (CHROMIUM=<path> picks the browser)
import { chromium } from "playwright";
const [url, dprArg = "3", stopsArg = "0,0.15,0.3,0.45,0.6,0.8"] = process.argv.slice(2);
const dpr = Number(dprArg);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: dpr, isMobile: true, hasTouch: true, serviceWorkers: "block" });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
let layers = [];
cdp.on("LayerTree.layerTreeDidChange", (e) => { if (e.layers) layers = e.layers; });
await cdp.send("LayerTree.enable");
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
for (const f of stopsArg.split(",").map(Number)) {
  await page.evaluate((y) => scrollTo(0, y), Math.round(H * f));
  await page.waitForTimeout(900);
  const drawn = layers.filter((l) => l.drawsContent && !l.invisible);
  let px = 0, big = 0;
  for (const l of drawn) { const a = l.width * l.height; px += Math.min(a, 412 * 915 * 2); if (a > 412 * 915 * 0.8) big++; }
  const mb = (px * dpr * dpr * 4) / 1e6;
  console.log(`scroll ${String(Math.round(f * 100)).padStart(3)}%  layers ${String(drawn.length).padStart(4)}  screen-sized+ ${String(big).padStart(3)}  memory ~${mb.toFixed(0)} MB`);
}
await browser.close();
