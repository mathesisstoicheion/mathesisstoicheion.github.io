// Makes public/og-card.png: the picture that appears when a link to the site is shared (1200 x 630). It is the home page's
// title page in small, as the printed page sets it (redesign SPEC.md 4.1): the kicker, the title, the line of what the site
// is, the printer's device with the name, and the Socrates plate with its number and full credit (decision 6: every photo
// shows its credit). Not part of the site; run it again after changing any of these, and commit the picture.
// It draws on a page of the built site, so it uses the site's own typefaces, colours and photograph:
//   npm run build, then: node scripts/serve-out.mjs 3100   and   node scripts/make-share-card.mjs [http://localhost:3100]
//   (CHROMIUM=<path> picks the browser it draws in)
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(web, "public", "og-card.png");
const base = process.argv[2] ?? "http://localhost:3100";

// the plate and its credit, from the photograph's own record (data/images.json), as components/plate/Plate.tsx prints it
const PLATE = "socrates-louvre";
const p = JSON.parse(readFileSync(join(web, "src", "data", "images.json"), "utf8"))[PLATE];
const by = p.creator && !/^unknown$/i.test(p.creator.trim()) ? `${p.creator.trim()}. ` : "";
const credit = `${p.title}, ${p.date}. ${p.place}. ${by}${p.licence}${p.sourceName ? `, via ${p.sourceName}` : ""}.`;
// the site's name and its line, as config/areas.ts gives them (SITE)
const areas = readFileSync(join(web, "src", "config", "areas.ts"), "utf8");
const SITE = Object.fromEntries(["greek", "latin", "tagline"].map((k) => [k, areas.match(new RegExp(`export const SITE = \\{[^}]*?${k}: "([^"]+)"`))[1]]));

// the printer's device with the ring's words (components/a/Mark.tsx, Seal)
const seal = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" style="flex:none;overflow:visible">
  <defs><path id="seal-ring" d="M 12.25 50 a 37.75 37.75 0 1 1 75.5 0 a 37.75 37.75 0 1 1 -75.5 0"/></defs>
  <text font-size="5.8" letter-spacing="1.2" dominant-baseline="middle" style="font-family:var(--face-didot);fill:var(--ink)"><textPath href="#seal-ring" textLength="${Math.PI * 75.5 * 0.995}" lengthAdjust="spacing">ΜΑΘΗΣΙΣ · ΣΤΟΙΧΕΙΩΝ · ΜΑΘΗΣΙΣ · ΣΤΟΙΧΕΙΩΝ ·</textPath></text>
  <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="1.2"/>
  <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" stroke-width="0.6"/>
  <text x="50" y="51" text-anchor="middle" dominant-baseline="central" font-size="25" letter-spacing="-1" style="font-family:var(--face-didot);fill:var(--ink)">Μ<tspan style="fill:var(--rubric)">Σ</tspan></text>
</svg>`;

const card = `
<div id="card" style="width:1200px;height:630px;position:relative;overflow:hidden;background:var(--paper);color:var(--paper-ink);
  display:grid;grid-template-columns:minmax(0,1fr) 372px;gap:64px;padding:52px 72px 48px;box-sizing:border-box;align-items:end;
  font:400 22px/1.5 var(--face-garamond);font-variant-numeric:oldstyle-nums">
  <div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(120% 80% at 50% 0%,transparent 55%,var(--paper-shade)),radial-gradient(90% 60% at 50% 110%,var(--paper-shade),transparent 70%)"></div>
  <div style="position:relative;display:grid;align-content:space-between;height:100%">
    <div style="display:flex;align-items:center;gap:16px">${seal(92)}
      <span style="display:flex;flex-direction:column;line-height:1.1">
        <b style="font:400 34px/1.1 var(--face-didot);letter-spacing:.01em" lang="grc">${SITE.greek}</b>
        <i style="font:500 15px/1.2 var(--face-garamond);font-style:normal;letter-spacing:.24em;text-transform:uppercase;color:var(--ink-2);margin-top:6px">${SITE.latin}</i>
      </span>
    </div>
    <div>
      <div style="display:flex;gap:16px;align-items:center;color:var(--ink-2);font:500 17px/1.35 var(--face-garamond);letter-spacing:.2em;text-transform:uppercase">
        <span style="width:34px;height:1px;background:var(--rubric);flex:none"></span><span><span lang="grc" style="font-family:var(--face-gentium)">ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ</span> · learning the letters</span>
      </div>
      <h1 style="font:400 88px/0.96 var(--face-garamond);letter-spacing:-.015em;margin:24px 0 22px;color:var(--ink)">Read the Greeks in <em style="font-style:italic;color:var(--rubric)">their own</em> words</h1>
      <p style="margin:0;font-size:27px;line-height:1.4;color:var(--ink-2);text-wrap:balance">${SITE.tagline}</p>
      <div style="height:1px;background:var(--rubric);margin-top:30px"></div>
    </div>
  </div>
  <figure class="plate plate-frame" style="position:relative;margin:0">
    <div class="plate-ph" style="aspect-ratio:3/4"><img src="/images/w640/${p.file}" alt="" style="object-position:50% 30%"></div>
    <figcaption style="font-size:14px"><b class="plate-no" style="font-size:11px">Plate I</b><span class="plate-credit">${credit}</span></figcaption>
  </figure>
</div>`;

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
// Paper whatever the computer's own setting: the card is the paper
const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1200, height: 630 }, colorScheme: "light" });
await page.goto(`${base}/about`, { waitUntil: "networkidle" });
await page.addStyleTag({ content: "html, body { background: transparent !important; } body::before, body::after { display: none !important; } body > :not(#sheet) { display: none !important; } #sheet { position: fixed; inset: 0 auto auto 0; z-index: 2147483647; } #sheet *, #sheet *::before, #sheet *::after { animation: none !important; transition: none !important; }" });
await page.evaluate((html) => { const d = document.createElement("div"); d.id = "sheet"; d.innerHTML = html; document.body.append(d); }, card);
// every typeface the card uses, by the name the build gave it (only the typeface itself: its stand-in may not be there)
await page.evaluate(async () => {
  for (const v of ["--face-garamond", "--face-didot", "--face-gentium"]) {
    const el = document.createElement("span");
    el.style.fontFamily = `var(${v})`;
    document.body.append(el);
    const family = getComputedStyle(el).fontFamily.split(",")[0];
    for (const style of ["400", "italic 400", "500"]) await document.fonts.load(`${style} 40px ${family}`, "ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ Μάθησις Στοιχείων Read the Greeks").catch(() => {});
  }
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  await document.fonts.ready;
});
await page.locator("#card").screenshot({ path: out, type: "png" });
await browser.close();
console.log("wrote", out);
