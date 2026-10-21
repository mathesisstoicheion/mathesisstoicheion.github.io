// The design-token check (review fix list, slice 3), on what each page actually draws, at a computer's width and a phone's.
// For every visible piece of words it lists:
//   face    - a typeface outside the four the site uses: the display serif, the text serif, the Greek face and the mono for
//             labels (the logo's own face is allowed in the logo; faces a reader picks in Settings are allowed in the text)
//   size    - a size below 12 px, or, up to the h3 step, not one of the type scale's steps (--step--2 … --step-2, measured at
//             this width); the display titles above it are fluid by design
//   colour  - words in a colour that is not one of the place's own: its words (--ink), the quieter ones (--ink-2, and --ink-3
//             for small print), its gold (--accent) and the bright gold of the place you are in (--accent-hi)
//   button  - a filled button (not a card that is a link) whose fill is not the one primary fill, so that every page has the same three kinds:
//             primary (filled), secondary (outlined) and the text link
// Faint Greek words drawn as decoration (data-decorative), pictures' own lettering (canvas) and the reader's text, whose size
// and face the reader sets, are not judged; nor are the sizes of display lettering (titles and inscriptions in the display
// face, fluid by design) or of Greek quoted at the reader's Greek size.
// usage: node web/scripts/check-design.mjs <base-url> [path…]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        SUMMARY=1 prints every distinct value found with a count, for working through the list
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/reading", "/academy/lesson/letters", "/academy/alphabet", "/academy/tables", "/academy/vocabulary",
  "/library", "/library/author?id=tlg0012", "/read?w=tlg0012.tlg001&tr=perseus-eng3", "/search?q=μῆνιν",
  "/stoa", "/stoa/authors", "/stoa/eras", "/stoa/antikythera-mechanism", "/treasury", "/treasury/word?l=λόγος",
  "/downloads", "/account", "/about", "/credits", "/guide", "/town-hall",
];
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
const tally = { face: new Map(), size: new Map(), colour: new Map(), fill: new Map() };
const count = (m, k, where) => { const x = m.get(k) ?? { n: 0, where: new Set() }; x.n++; x.where.add(where); m.set(k, x); };

for (const [w, h] of [[1280, 900], [375, 812]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block" });
  await ctx.addInitScript(() => localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduce", lamp: false }, version: 0 })));
  for (const path of PAGES) {
    const page = await ctx.newPage();
    const at = `${path} ${w}px`;
    try {
      await page.goto(base + path);
      await page.locator("h1").first().waitFor({ timeout: 30_000 }).catch(() => {});
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
      await page.waitForTimeout(1000);
      const r = await page.evaluate(() => {
        const FACES = ["Noto Serif Display", "EB Garamond", "Gentium Book Plus", "Noto Sans Mono"];
        const first = (ff) => ff.split(",")[0].replace(/["']/g, "").replace(/^__(.+?)_[0-9a-f]+$/, "$1").replace(/ Fallback$/, "").replace(/_/g, " ").trim();
        // the scale's steps, measured here (two of them grow with the window)
        const probe = document.createElement("span");
        document.body.append(probe);
        const steps = ["--step--2", "--step--1", "--step-0", "--step-sub", "--step-1", "--step-2", "--step-3", "--step-4"].map((v) => {
          probe.style.fontSize = `var(${v})`;
          return parseFloat(getComputedStyle(probe).fontSize);
        });
        // a colour as the browser draws it
        const rgb = (c) => { probe.style.color = ""; probe.style.color = c; return getComputedStyle(probe).color; };
        const near = (a, b) => {
          const p = (s) => (s.match(/[\d.]+/g) ?? []).map(Number);
          const [x, y] = [p(a), p(b)];
          return x.length >= 3 && y.length >= 3 && Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]) + Math.abs(x[2] - y[2]) <= 9 && (x[3] ?? 1) === (y[3] ?? 1);
        };
        const out = { face: [], size: [], colour: [], fill: [] };
        const skip = (e) => e.closest("[data-decorative], canvas, svg, article, [aria-hidden=true], script, style, noscript, [hidden]");
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const seen = new Set();
        for (let t = walker.nextNode(); t; t = walker.nextNode()) {
          const e = t.parentElement;
          if (!e || seen.has(e) || !t.textContent.trim() || skip(e)) continue;
          seen.add(e);
          const b = e.getBoundingClientRect(), s = getComputedStyle(e);
          if (!b.width || !b.height || s.visibility === "hidden" || +s.opacity === 0) continue;
          const word = t.textContent.trim().slice(0, 24);
          const face = first(s.fontFamily);
          if (!FACES.includes(face) && !(face === "Noto Sans Display" && e.closest("[class*=mark]"))) out.face.push([face, word]);
          const px = parseFloat(s.fontSize);
          // the display titles (the page's title, and anything in the display face) are fluid by design, and the Greek
          // being read (the reader's lines, on any page) is sized by the reader in Settings
          let display = !!e.closest("h1, [class*=carve]");   // the title, and the carved inscriptions
          for (let x = e; x && !display && parseFloat(getComputedStyle(x).fontSize) === px; x = x.parentElement)
            display = first(getComputedStyle(x).fontFamily) === "Noto Serif Display";
          // Greek quoted to be read is set at the reader's own Greek size (Settings)
          probe.style.fontSize = "var(--greek-size)";
          e.append(probe);
          const reading = !!e.closest("[lang=grc]") && Math.abs(parseFloat(getComputedStyle(probe).fontSize) - px) < 0.6;
          document.body.append(probe);
          if (display || reading || e.closest("[data-u], [data-w]")) { /* not judged */ }
          else if (px < 11.9) out.size.push([`${Math.round(px * 100) / 100}px (under 12)`, word]);
          // above the h3 step the display titles are fluid (clamp(), design A's), so they are left as they are
          else if (px <= steps[5] + 0.6 && !steps.some((v) => Math.abs(v - px) < 0.6)) out.size.push([`${Math.round(px * 100) / 100}px`, word]);
          // inside a filled button the words are in the button's own ink
          const filled = e.closest("a, button");
          const onFill = filled && !/rgba\(0, 0, 0, 0\)|, 0\)$/.test(getComputedStyle(filled).backgroundColor);
          const ok = ["--ink", "--ink-2", "--ink-3", "--accent", "--accent-hi", ...(onFill ? ["--btn-ink"] : [])].map((v) => s.getPropertyValue(v).trim()).filter(Boolean).map(rgb);
          if (ok.length && !ok.some((c) => near(c, s.color))) out.colour.push([s.color, word]);
        }
        // filled buttons: a link or button with an opaque fill and words, that is not a chip, a tab, a choice or a chosen state
        for (const e of document.querySelectorAll("main a, main button, footer a, footer button")) {
          if (skip(e) || e.matches(".chip, [role=tab], [role=radio], [role=checkbox], [role=switch], [role=option], [aria-pressed], [aria-selected]")) continue;
          const s = getComputedStyle(e), b = e.getBoundingClientRect();
          // a card that is a link (a window, a heading, a picture inside) is not a button
          if (!b.width || !e.textContent.trim() || b.height > 72 || e.querySelector("h2, h3, h4, img, canvas, [class*=win]")) continue;
          const bg = s.backgroundColor;
          if (bg === "rgba(0, 0, 0, 0)" || /, 0\)$/.test(bg)) continue;
          out.fill.push([`${bg} with ${s.color}`, e.textContent.trim().slice(0, 24)]);
        }
        probe.remove();
        return out;
      });
      for (const k of Object.keys(tally)) for (const [v, word] of r[k]) count(tally[k], v, `${at} "${word}"`);
    } catch (e) {
      found.push(`load ${at}: ${String(e).split("\n")[0]}`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();

// the one primary fill is the commonest one; every other fill is a fourth kind of button
const fills = [...tally.fill.entries()].sort((a, b) => b[1].n - a[1].n);
const [primary] = fills[0] ?? [];
const report = (kind, entries) => {
  for (const [v, x] of entries) found.push(`${kind} ${v}: ${x.n} time(s), e.g. ${[...x.where].slice(0, 3).join(" · ")}`);
};
report("face", tally.face.entries());
report("size", [...tally.size.entries()].sort((a, b) => b[1].n - a[1].n));
report("colour", [...tally.colour.entries()].sort((a, b) => b[1].n - a[1].n));
report("button", fills.slice(1));
if (process.env.SUMMARY) {
  console.log(`primary fill: ${primary ?? "none"}`);
  for (const k of Object.keys(tally)) console.log(`${k}: ${tally[k].size} distinct off the tokens, ${[...tally[k].values()].reduce((n, x) => n + x.n, 0)} in all`);
}
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : "every face, size, colour and button is one of the site's own");
process.exit(found.length ? 1 : 0);
