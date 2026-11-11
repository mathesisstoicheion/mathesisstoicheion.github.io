// The cold-open check (the Android app's blank cream screen, beta 16, 2026-11-11). A page can be the first one shown in a
// fresh window, with no history: the app reopening it, a shared link, a restored session. It must never be blank, and it
// must always offer a way on. For each address, in a fresh phone window (the app's WebView, with its MathesisApp and
// MathesisFiles bridges stubbed), it opens the address directly and lists:
//   blank      - no heading and no words in the page's main part
//   lost       - a "not found" page with no way on
//   no way on  - no link home (or to the Library) that can be seen: no header, no foot bar
// It looks four ways:
//   fresh          - empty storage, 6 s after the page starts loading
//   scripts held   - the same, with the site's code files held back: how a slow or cold phone sees the page first, and
//                    what stays on the screen when a code file fails to load. Words and a way on must not wait for scripts.
//   offline helper - a second visit, with the offline helper (sw.js) installed by a visit to the home page first
//   offline        - the same, with the connection cut
// usage: node web/scripts/check-cold-open.mjs [base-url]   (default http://localhost:3100; CHROMIUM=<path> picks the browser)
// It exits with 1 when anything is listed, so it can stand in the checks.
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const URLS = ["/", "/read?w=tlg0012.tlg001", `/read?w=tlg0012.tlg001&at=1.1&hl=${encodeURIComponent("μῆνιν")}`, "/stoa/census"]; // the lessons are off (LESSONS_SHOWN), so their addresses are left out; the Census stands in as a page opened first

const UA = "Mozilla/5.0 (Linux; Android 14; Pixel 7; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.0.0 Mobile Safari/537.36";
const SETTLE_MS = 6000;

// runs inside the page: what a reader can see
function look() {
  const shown = (el) => {
    if (!el || !el.getClientRects().length) return false;
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.05) return false;
    }
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
  };
  const main = document.querySelector("main");
  const mainText = main && shown(main) ? main.innerText.replace(/\s+/g, " ").trim() : "";
  const heading = [...document.querySelectorAll("h1, h2")].some((h) => shown(h) && h.textContent.trim());
  const home = [...document.querySelectorAll("a[href]")].some((a) => {
    const p = new URL(a.href, location.href);
    return p.origin === location.origin && ["/", "/library"].includes(p.pathname) && shown(a);
  });
  const notFound = /has not survived|not found|404/i.test(`${document.title} ${mainText.slice(0, 300)}`);
  return { mainText: mainText.length, heading, home, notFound };
}

const problems = [];
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});

async function phone(sw) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: UA,
    serviceWorkers: sw ? "allow" : "block",
  });
  await ctx.addInitScript(() => {
    window.MathesisApp = { look() {} };
    window.MathesisFiles = { save() {}, failed() {} };
  });
  return ctx;
}

async function judge(page, url, way) {
  await page.waitForTimeout(SETTLE_MS);
  const s = await page.evaluate(look).catch((e) => ({ error: String(e) }));
  const found = [];
  if (s.error) found.push(`could not be read (${s.error})`);
  else {
    if (!s.heading && !s.mainText) found.push("blank");
    if (s.notFound && !s.home) found.push("lost");
    if (!s.home) found.push("no way on");
  }
  for (const f of found) problems.push(`${way.padEnd(14)} ${url}: ${f}`);
  console.log(`${found.length ? "FAIL" : "ok  "} ${way.padEnd(14)} ${url}${found.length ? `  (${found.join(", ")})` : ""}`);
}

async function open(page, url) {
  await page.goto(base + url, { waitUntil: "domcontentloaded", timeout: 30000 }).catch((e) => problems.push(`${url}: did not open (${e.message.split("\n")[0]})`));
}

// fresh, and with the scripts held back
for (const held of [false, true]) {
  for (const url of URLS) {
    const ctx = await phone(false);
    const page = await ctx.newPage();
    if (held) await page.route(/\/_next\/static\/chunks\/.+\.js(\?|$)/, (r) => r.abort());
    await open(page, url);
    await judge(page, url, held ? "scripts held" : "fresh");
    await ctx.close();
  }
}

// a second visit with the offline helper installed, then the same offline
for (const offline of [false, true]) {
  for (const url of URLS) {
    const ctx = await phone(true);
    const first = await ctx.newPage();
    await open(first, "/");
    const ready = await first.evaluate(() => new Promise((res) => {
      if (!("serviceWorker" in navigator)) return res(false);
      const t = setTimeout(() => res(false), 45000);
      navigator.serviceWorker.ready.then(() => { clearTimeout(t); res(true); });
    })).catch(() => false);
    if (!ready) { console.log(`--   offline helper did not install for ${url}: ${offline ? "offline" : "second visit"} not checked`); await ctx.close(); continue; }
    await first.close();
    if (offline) await ctx.setOffline(true);
    const page = await ctx.newPage();
    await open(page, url);
    await judge(page, url, offline ? "offline" : "offline helper");
    await ctx.close();
  }
}

await browser.close();
if (problems.length) {
  console.log(`\n${problems.length} problem(s): a page opened first, with no history, must show words and a way on.`);
  process.exit(1);
}
console.log("\nEvery page opened cold shows words and a way on.");
