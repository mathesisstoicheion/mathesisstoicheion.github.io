// Makes the pictures of the site's logo, the printer's device (the owner's choice of 2026-10-22, decision 1 of the
// printed-page redesign): a round seal like the marks early printers set on their title pages, ΜΣ in the middle (Μ in ink,
// Σ in red) and ΜΑΘΗΣΙΣ · ΣΤΟΙΧΕΙΩΝ around the ring, on the paper. Below 64 pixels the ring's words are dropped, leaving
// the ring and ΜΣ (redesign SPEC.md 3.3). The drawing is the one the owner chose it from (the project files'
// redesign/templates-2026-10-21/logos.js); the header and the foot of the page draw the same seal themselves
// (components/a/Mark.tsx). Not part of the site; run it again after changing the drawing, and commit the pictures:
//   public/favicon.ico                    the tab icon, at 16, 32 and 48 pixels
//   public/apple-touch-icon.png           the icon an iPhone shows on its home screen
//   public/icons/icon-192.png, icon-512.png, maskable-512.png   the install icons (app/manifest.ts)
//   android/app/src/main/res/mipmap-*/   the phone app's icon: the seal alone on a clear ground (ic_launcher_foreground),
//                                        which Android sets on the paper in whatever shape the phone uses
//                                        (mipmap-anydpi-v26/ic_launcher.xml), and a plain square for older phones
// It draws on a page of the built site, so that it sets the letters in the site's own GFS Didot:
//   npm run build, then: node scripts/serve-out.mjs 3100   and   node scripts/make-logo.mjs [http://localhost:3100]
//   (CHROMIUM=<path> picks the browser it draws in)
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(web, "public"), res = join(web, "..", "android", "app", "src", "main", "res");
const base = process.argv[2] ?? "http://localhost:3100";
// the paper, the ink and the red of the printed page (styles/tokens.css)
const C = { paper: "#f3ece0", ink: "#1e1a15", red: "#a3301a" };

// one square icon of `S` pixels, the seal at `k` of its full size: 0.82 keeps it inside the circle every phone's mask leaves
// (a maskable icon), 0.69 inside the smaller circle Android keeps of an app icon's foreground; `clear` leaves out the paper
function device(S, didot, { k = 1, clear = false } = {}) {
  const tiny = S <= 64, r1 = S * 0.42 * k, r2 = S * 0.335 * k, c = S / 2, rm = (r1 + r2) / 2;
  const ring = tiny ? "" : `<defs><path id="rp" d="M ${c - rm} ${c} a ${rm} ${rm} 0 1 1 ${r1 + r2} 0 a ${rm} ${rm} 0 1 1 ${-(r1 + r2)} 0"/></defs>`
    + `<text font-family="${didot}" font-size="${S * 0.058 * k}" letter-spacing="${S * 0.012 * k}" fill="${C.ink}" dominant-baseline="middle">`
    + `<textPath href="#rp" startOffset="0" textLength="${Math.PI * (r1 + r2) * 0.995}" lengthAdjust="spacing">ΜΑΘΗΣΙΣ · ΣΤΟΙΧΕΙΩΝ · ΜΑΘΗΣΙΣ · ΣΤΟΙΧΕΙΩΝ ·</textPath></text>`;
  const circles = `<circle cx="${c}" cy="${c}" r="${tiny ? S * 0.45 : r1 + S * 0.02 * k}" fill="none" stroke="${C.ink}" stroke-width="${Math.max(1.2, S * 0.012)}"/>`
    + (tiny ? "" : `<circle cx="${c}" cy="${c}" r="${r2 - S * 0.015 * k}" fill="none" stroke="${C.ink}" stroke-width="${S * 0.006}"/>`);
  return `<div id="icon" style="width:${S}px;height:${S}px;background:${clear ? "transparent" : C.paper};display:grid;place-items:center;position:relative;overflow:hidden">`
    + `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" style="position:absolute;inset:0">${ring}${circles}</svg>`
    + `<div style="position:relative;font:400 ${S * (tiny ? 0.42 : 0.25) * k}px/1 ${didot};color:${C.ink};letter-spacing:-.04em;transform:translateY(${S * 0.01}px)">Μ<span style="color:${C.red}">Σ</span></div></div>`;
}

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 600, height: 600 } });
await page.goto(`${base}/about`, { waitUntil: "networkidle" });
// the site's GFS Didot, by the name the build gave it, loaded for the letters the seal uses
const didot = await page.evaluate(async () => {
  const el = document.createElement("span");
  el.style.fontFamily = "var(--face-didot)";
  document.body.append(el);
  const family = getComputedStyle(el).fontFamily;
  // (only the typeface itself: its stand-in, made from a font of the computer's own, may not be there to load)
  await document.fonts.load(`400 64px ${family.split(",")[0]}`, "ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ·");
  return family.replace(/"/g, "'");
});
// a clean sheet: nothing of the page around the icon
await page.addStyleTag({ content: "html, body { background: transparent !important; } body::before, body::after { display: none !important; } body > :not(#sheet) { display: none !important; } #sheet { position: fixed; inset: 0 auto auto 0; z-index: 2147483647; }" });

async function draw(S, opts) {
  await page.evaluate((html) => {
    document.getElementById("sheet")?.remove();
    const d = document.createElement("div");
    d.id = "sheet";
    d.innerHTML = html;
    document.body.append(d);
  }, device(S, didot, opts));
  await page.evaluate(() => document.fonts.ready);
  return page.locator("#icon").screenshot({ type: "png", omitBackground: !!opts?.clear });
}

const tab = [];
for (const px of [16, 32, 48]) tab.push([px, await draw(px)]);
const files = {
  "apple-touch-icon.png": await draw(180),
  "icons/icon-192.png": await draw(192),
  "icons/icon-512.png": await draw(512),
  "icons/maskable-512.png": await draw(512, { k: 0.82 }),
};
const app = {
  "mipmap-xxhdpi/ic_launcher.png": await draw(144),
  "mipmap-xxxhdpi/ic_launcher.png": await draw(192),
  "mipmap-xxhdpi/ic_launcher_foreground.png": await draw(324, { k: 0.69, clear: true }),
  "mipmap-xxxhdpi/ic_launcher_foreground.png": await draw(432, { k: 0.69, clear: true }),
};
await browser.close();

// the tab icon: one .ico file holding the three sizes as PNGs
function ico(sizes) {
  const head = Buffer.alloc(6 + 16 * sizes.length);
  head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let at = head.length;
  sizes.forEach(([px, buf], i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(px, e); head.writeUInt8(px, e + 1); head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(buf.length, e + 8); head.writeUInt32LE(at, e + 12); at += buf.length;
  });
  return Buffer.concat([head, ...sizes.map(([, b]) => b)]);
}
mkdirSync(join(pub, "icons"), { recursive: true });
writeFileSync(join(pub, "favicon.ico"), ico(tab));
for (const [name, buf] of Object.entries(files)) writeFileSync(join(pub, name), buf);
for (const [name, buf] of Object.entries(app)) { mkdirSync(dirname(join(res, name)), { recursive: true }); writeFileSync(join(res, name), buf); }
console.log(`made the printer's device: favicon.ico, ${Object.keys(files).join(", ")}, and the app's ${Object.keys(app).join(", ")}`);
