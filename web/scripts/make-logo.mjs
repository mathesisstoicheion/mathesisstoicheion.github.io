// Makes the pictures of the site's logo: the name's emblem (DESIGN.md, Signature details 1) cut into the stone and laid
// with gold, lit by the torch (scripts/logo/render.js draws it). Not part of the site; run it again after changing the
// drawing or the material, and commit the pictures:
//   public/logo/mark-2x.png, mark-3x.png   the header's and footer's mark (components/EmblemMark.tsx), on no ground
//   public/favicon.ico                    the tab icon, at 16, 32 and 48 pixels
//   public/apple-touch-icon.png           the icon an iPhone shows on its home screen
//   public/icons/icon-192.png, icon-512.png, maskable-512.png   the install icons (app/manifest.ts)
//   node scripts/make-logo.mjs [gilt|cut|seal]      (CHROMIUM=<path> picks the browser it draws in)
// The other two materials were the owner's other options (2026-10-16); a round seal-stone needs a square .logo box in
// components/Header.module.css.
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

const style = process.argv[2] ?? "gilt";
const here = dirname(fileURLToPath(import.meta.url)), pub = join(here, "..", "public");

// the stone round the mark in the icons: the site's dark wall, lit by the torch
const DARK = { stone: "#2e251d", stoneDk: "#1a1410" };
// a brighter gold for the small sizes, so it holds in the header and a browser tab
const BRIGHT = { gold: "#d2b06a", goldHi: "#f3dca4" };
// for each material: the icons (`icon`), the tab icon (`tab`, drawn four times larger and shrunk) and the header's mark
// (`head`, at twice the header's 46 x 38)
const OPTS = {
  gilt: { icon: { markW: 0.78, weight: "icon", ...DARK, ...BRIGHT, intensity: 2.4 }, tab: { markW: 0.88, weight: "bold", ...DARK, ...BRIGHT, intensity: 3.2 },
    head: { W: 92, H: 76, tile: false, flat: true, wall: "#14100d", weight: "bold", markW: 0.96, light: [8, -26, 64], intensity: 3.6, ...BRIGHT } },
  cut: { icon: { markW: 0.78, weight: "icon", ...DARK, cutStone: "#8c7b68", grime: 0, depth: 0.45 }, tab: { markW: 0.88, weight: "bold", ...DARK, cutStone: "#9c8a74", grime: 0, depth: 0.3, intensity: 2.6 },
    head: { W: 92, H: 76, tile: false, weight: "icon", markW: 0.96, light: [10, -20, 50], intensity: 2.8, depth: 0.3, grime: 0, stone: "#8a7864", stoneDk: "#6a5a48" } },
  seal: { icon: { markW: 0.66, weight: "icon", sealR: 0.44, ...DARK }, tab: { markW: 0.64, weight: "bold", sealR: 0.49, ...DARK, frost: "#c49c74", intensity: 2.4 },
    head: { W: 80, H: 80, tile: false, weight: "icon", markW: 0.72, light: [5, -20, 60], frost: "#c49c74" } },
}[style];
if (!OPTS) throw new Error(`no material called ${style}: gilt, cut or seal`);

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage();
await page.addScriptTag({ path: join(here, "logo", "render.js") });
const pics = await page.evaluate(({ style, OPTS }) => {
  // each picture is drawn larger and halved down to its size, for clean edges
  const shrink = (c, n) => { while (c.width > n) { const m = Math.max(n, Math.round(c.width / 2)), d = document.createElement("canvas"); d.width = d.height = m;
    const x = d.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(c, 0, 0, m, m); c = d; } return c; };
  const png = (c) => c.toDataURL("image/png").split(",")[1];
  const icon = (px, o) => png(shrink(LogoR.render({ W: px * 2, H: px * 2, style, ...OPTS.icon, ...o }), px));
  // the header's mark at three times its size: the same drawing, with the light moved out in step
  const head3 = { ...OPTS.head, W: OPTS.head.W * 1.5, H: OPTS.head.H * 1.5, light: OPTS.head.light.map((v) => v * 1.5) };
  return {
    "logo/mark-2x.png": png(LogoR.render({ style, ...OPTS.head })),
    "logo/mark-3x.png": png(LogoR.render({ style, ...head3 })),
    tab: [16, 32, 48].map((px) => [px, png(shrink(LogoR.render({ W: px * 4, H: px * 4, style, ...OPTS.tab }), px))]),
    // iPhones round the corners themselves; Android's ordinary icons come rounded; a maskable one keeps the drawing
    // inside the central circle that every phone's mask leaves
    "apple-touch-icon.png": icon(180, {}),
    "icons/icon-192.png": icon(192, { radius: 192 * 2 * 0.18 }),
    "icons/icon-512.png": icon(512, { radius: 512 * 2 * 0.18 }),
    "icons/maskable-512.png": icon(512, { markW: style === "seal" ? 0.5 : 0.6 }),
  };
}, { style, OPTS });
await browser.close();

// the tab icon: one .ico file holding the three sizes as PNGs
function ico(sizes) {
  const bufs = sizes.map(([, b64]) => Buffer.from(b64, "base64")), head = Buffer.alloc(6 + 16 * sizes.length);
  head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let at = head.length;
  sizes.forEach(([px], i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(px, e); head.writeUInt8(px, e + 1); head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(bufs[i].length, e + 8); head.writeUInt32LE(at, e + 12); at += bufs[i].length;
  });
  return Buffer.concat([head, ...bufs]);
}
mkdirSync(join(pub, "logo"), { recursive: true });
mkdirSync(join(pub, "icons"), { recursive: true });
const { tab, ...files } = pics;
writeFileSync(join(pub, "favicon.ico"), ico(tab));
for (const [name, b64] of Object.entries(files)) writeFileSync(join(pub, name), Buffer.from(b64, "base64"));
console.log(`made the ${style} logo: favicon.ico and ${Object.keys(files).join(", ")}`);
