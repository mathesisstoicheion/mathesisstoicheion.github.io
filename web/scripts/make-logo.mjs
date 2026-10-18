// Makes the pictures of the site's logo, design A's square ΣΤΟΙΧΕΙΑ mark (public/logo/stoicheia.svg, the owner's choice
// of 2026-10-18), in gold on the lamplit black. Not part of the site; run it again after changing the drawing, and commit the pictures:
//   public/favicon.ico                    the tab icon, at 16, 32 and 48 pixels (heavier lines, so it holds when small)
//   public/apple-touch-icon.png           the icon an iPhone shows on its home screen
//   public/icons/icon-192.png, icon-512.png, maskable-512.png   the install icons (app/manifest.ts)
// The header and footer draw the same mark inline (components/EmblemMark.tsx).
//   node scripts/make-logo.mjs      (CHROMIUM=<path> picks the browser it draws in)
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url)), pub = join(here, "..", "public");
const mark = readFileSync(join(pub, "logo", "stoicheia.svg"), "utf8").replace(/#f2e0c6/g, "#d9b56a");
// the small sizes: thicker lines and dot, so the letters do not fade to a smudge in a browser tab
const bold = mark.replace('stroke-width="1.5"', 'stroke-width="2.6"').replace('r="1.1"', 'r="1.7"');
const uri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

// one square picture: the mark at `markW` of the width on the black, lit a little from above as by the lamp
async function draw(page, px, { markW, radius = 0, svg = mark }) {
  await page.setViewportSize({ width: px, height: px });
  await page.setContent(`<body style="margin:0;background:transparent"><div style="width:${px}px;height:${px}px;border-radius:${radius}px;
    display:grid;place-items:center;background:radial-gradient(120% 90% at 50% 18%,#241a10,#070504 70%)">
    <img src="${uri(svg)}" style="width:${Math.round(px * markW)}px;height:${Math.round(px * markW)}px;"></div></body>`);
  await page.locator("img").evaluate((i) => i.decode());
  return page.screenshot({ omitBackground: true, type: "png" });
}

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ deviceScaleFactor: 1 });
const tab = [];
for (const px of [16, 32, 48]) tab.push([px, await draw(page, px, { markW: 0.94, svg: bold })]);
// iPhones round the corners themselves; Android's ordinary icons come rounded; a maskable one keeps the drawing inside
// the central circle that every phone's mask leaves
const files = {
  "apple-touch-icon.png": await draw(page, 180, { markW: 0.74 }),
  "icons/icon-192.png": await draw(page, 192, { markW: 0.74, radius: 192 * 0.18 }),
  "icons/icon-512.png": await draw(page, 512, { markW: 0.74, radius: 512 * 0.18 }),
  "icons/maskable-512.png": await draw(page, 512, { markW: 0.58 }),
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
console.log(`made the mark's icons: favicon.ico and ${Object.keys(files).join(", ")}`);
