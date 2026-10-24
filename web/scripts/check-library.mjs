// The library check (review fix list, slice 6; the printed page since 2026-10-22, where the page is plain paper with its
// plates). Two things are checked:
//   contrast - every piece of text on the page, down to the first authors of the list, against what is behind it: the page is
//              photographed with its text made invisible (twice, a moment apart), and the text's colour is compared with the
//              brightest tenth of what lies under it. WCAG AA: 4.5 to 1, or 3 to 1 for large text.
//   rows     - every author in the list: a "who they were" line that is not empty, that does not give a date when the
//              row's own date stands beside it ("4th-century BC Greek orator" next to "4th c. BC"), and that says BC and AD.
// usage: node web/scripts/check-library.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
/** a date in words: "4th-century", "4th c.", "384–322 BC", "(c. 470", "AD 46" */
export const DATED = /\b\d{1,2}(?:st|nd|rd|th)\b[\s/–-]*(?:(?:and |or |early |late )*\d{1,2}(?:st|nd|rd|th)[\s/–-]*)*(?:c\.|centur)|\b\d{2,4}\s?(?:BC|AD|BCE|CE)\b|\b(?:BC|AD)\s?\d|\(\s*(?:c\.\s?)?\d{2,4}|\bc\.\s?\d{2,4}\s?[–-]/i;

const HIDE = `*, *::before, *::after { color: transparent !important; -webkit-text-fill-color: transparent !important; text-decoration-color: transparent !important; text-shadow: none !important; caret-color: transparent !important; transition: none !important; }
  ::placeholder { color: transparent !important; } *::selection { background: transparent !important; }`;

for (const [w, h] of [[1280, 900], [375, 812]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, serviceWorkers: "block" });
  const page = await ctx.newPage();
  await page.goto(base + "/library");
  await page.waitForSelector("[data-author-row]");
  // what a visitor would open: the order and filters, and the suggestions on where to begin
  for (const b of await page.locator('button[aria-controls="library-filters"][aria-expanded="false"]').all()) await b.click();
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => { d.open = true; }));
  await page.waitForTimeout(2500);   // everything has inked in

  // every piece of text, by its own lines, down to the eighth author
  const stop = await page.evaluate(() => { const r = document.querySelectorAll("[data-author-row]")[7]; return r ? r.getBoundingClientRect().bottom + scrollY : document.body.scrollHeight; });
  const steps = Math.ceil(stop / (h - 120));
  const seen = new Map();
  for (let i = 0; i < steps; i++) {
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), i * (h - 120));
    await page.waitForTimeout(900);
    await page.addStyleTag({ content: HIDE }).then((t) => t.evaluate((e) => e.setAttribute("data-check-hide", "")));
    await page.waitForTimeout(120);
    const shots = [];
    for (let k = 0; k < 2; k++) { shots.push((await page.screenshot()).toString("base64")); await page.waitForTimeout(700); }
    // the words come back at once (no fade, which would be measured half-way), and stay still while they are measured
    await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" }).then((t) => t.evaluate((e) => e.setAttribute("data-check-still", "")));
    await page.evaluate(() => document.querySelector("style[data-check-hide]")?.remove());
    await page.waitForTimeout(80);
    const res = await page.evaluate(async ({ shots, top }) => {
      const load = (b64) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.src = `data:image/png;base64,${b64}`; });
      const cv = document.createElement("canvas"); cv.width = innerWidth; cv.height = innerHeight;
      const g = cv.getContext("2d", { willReadFrequently: true });
      const px = [];
      for (const s of shots) { g.drawImage(await load(s), 0, 0); px.push(g.getImageData(0, 0, cv.width, cv.height).data); }
      const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
      const L = (r, g2, b) => 0.2126 * lin(r) + 0.7152 * lin(g2) + 0.0722 * lin(b);
      const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      // rgb(…) / rgba(…) in 0–255, or color(srgb …) in 0–1 (what color-mix() computes to)
      const rgba = (s) => {
        const m = s.replace(/^color\(srgb/, "").match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1], k = s.startsWith("color(") ? 255 : 1;
        const al = s.includes("/") ? m[3] : s.startsWith("rgba") ? m[3] : 1;
        return [m[0] * k, m[1] * k, m[2] * k, al ?? 1];
      };
      const out = [];
      const root = document.querySelector("main") ?? document.body;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const els = new Set();
      for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.textContent.trim() && n.parentElement) els.add(n.parentElement);
      root.querySelectorAll("select, input[type=search]").forEach((e) => els.add(e));
      for (const el of els) {
        if (el.closest("option, script, style, [hidden], .visually-hidden, header, :disabled, [aria-disabled='true']")) continue;   // inactive controls are exempt (WCAG 1.4.3)
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden") continue;
        let op = 1;
        for (let e = el; e; e = e.parentElement) op *= Number(getComputedStyle(e).opacity);
        if (op < 0.05) continue;
        const rects = [];
        if (el.matches("select, input")) rects.push(el.getBoundingClientRect());
        else for (const t of el.childNodes) if (t.nodeType === 3 && t.textContent.trim()) { const r = document.createRange(); r.selectNodeContents(t); rects.push(...r.getClientRects()); }
        const [tr, tg, tb, ta] = rgba(cs.color);
        const a = ta * op;
        const size = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700;
        const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
        const ratios = [];
        for (const r of rects) {
          const x0 = Math.max(0, Math.floor(r.left)), x1 = Math.min(innerWidth, Math.ceil(r.right));
          const y0 = Math.max(0, Math.floor(r.top)), y1 = Math.min(innerHeight, Math.ceil(r.bottom));
          if (x1 - x0 < 2 || y1 - y0 < 2) continue;
          // a line covered by something else (the header, a sticky rail) is not read where it lies
          const top = document.elementFromPoint((x0 + x1) / 2, (y0 + y1) / 2);
          if (!top || !(el.contains(top) || top.contains(el))) continue;
          for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) {
            for (const d of px) {
              const i = (y * innerWidth + x) * 4, br = d[i], bg = d[i + 1], bb = d[i + 2];
              const fr = a * tr + (1 - a) * br, fg = a * tg + (1 - a) * bg, fb = a * tb + (1 - a) * bb;
              ratios.push(ratio(L(fr, fg, fb), L(br, bg, bb)));
            }
          }
        }
        if (!ratios.length) continue;
        ratios.sort((p, q) => p - q);
        const worst = ratios[Math.floor(ratios.length * 0.1)];
        const name = `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(/\s+/)[0].replace(/_[\w-]+$/, "").replace(/^.*__/, "") : ""}`;
        const text = (el.matches("select") ? el.selectedOptions[0]?.textContent : el.matches("input") ? el.placeholder : el.textContent).replace(/\s+/g, " ").trim().slice(0, 60);
        const r0 = el.getBoundingClientRect();
        out.push({ key: `${name} "${text}"`, at: Math.round(r0.top + top), worst: Math.round(worst * 100) / 100, need });
      }
      return out;
    }, { shots, top: i * (h - 120) });
    await page.evaluate(() => document.querySelector("style[data-check-still]")?.remove());
    for (const r of res) { const old = seen.get(r.key); if (!old || r.worst < old.worst) seen.set(r.key, r); }
  }
  for (const r of [...seen.values()].sort((p, q) => p.at - q.at)) if (r.worst < r.need) found.push(`contrast ${w}px: ${r.key} at y=${r.at} is ${r.worst}:1 (needs ${r.need}:1)`);

  if (w === 1280) {
    // every author's row: who they were, and no second date beside the row's own
    const rows = await page.evaluate(() => [...document.querySelectorAll("[data-author-row]")].map((b) => {
      const parts = [...b.children];
      const cls = (e) => (typeof e.className === "string" ? e.className : "");
      return { name: parts[0]?.textContent.trim(), desc: parts.find((e) => /desc/.test(cls(e)))?.textContent.trim() ?? "",
        dated: !!parts.find((e) => /facts/.test(cls(e)))?.querySelector("[title]") };
    }));
    for (const r of rows) {
      if (!r.desc) found.push(`rows: ${r.name} has no line on who they were`);
      else if (r.dated && DATED.test(r.desc)) found.push(`rows: ${r.name}: "${r.desc}" repeats the date beside it`);
      if (/(?<![%\w])BCE\b|(?:\d|centur(?:y|ies)|BC and)\s?CE\b/.test(r.desc)) found.push(`rows: ${r.name}: "${r.desc}" writes BCE or CE, not BC or AD`);
    }
    console.log(`${rows.length} authors read`);
  }
  await ctx.close();
}

await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : "the library reads clearly, and every author has one plain line");
process.exit(found.length ? 1 : 0);
