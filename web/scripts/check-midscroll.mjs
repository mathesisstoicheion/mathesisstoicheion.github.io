// The mid-scroll check (DESIGN.md, "Before anything goes live"): flicks down a page on a phone at 3x with the graphics
// memory held to <mb> (default 200; use 128 for an older phone) and saves a screenshot at three points, without waiting
// for the drawing to settle, so anything a phone would leave blank shows up blank.
// usage: node web/scripts/check-midscroll.mjs <url> <out-prefix> [mb]   (CHROMIUM=<path> picks the browser)
import { chromium } from "playwright";
const [url, out, mem = "200"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined,
  args: ["--enable-gpu-rasterization", `--force-gpu-mem-available-mb=${mem}`, "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, serviceWorkers: "block" });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);
const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const cdp = await ctx.newCDPSession(page);
for (const [i, f] of [0.2, 0.35, 0.5].entries()) {
  // a finger flick: scroll in steps without waiting for drawing to settle
  for (let k = 0; k < 8; k++) await page.mouse.wheel(0, H * f / 8);
  const shot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  (await import("node:fs")).writeFileSync(`${out}-${i}.png`, Buffer.from(shot.data, "base64"));
}
await browser.close();
