// Draws the stone of the wall (src/lib/stone.ts) into public/images/stone.webp, the tile globals.css lays over the wall's
// colour as --tex. Not part of the site; run it again after changing the stone, and commit the picture:
//   node scripts/make-stone.mjs      (CHROMIUM=<path> picks the browser it draws in)
// The browser packs it loosely; packing it again tightly, losing nothing, takes it to about a third of the size
// (cwebp -lossless -z 9, or Python's Pillow: save(..., "WEBP", lossless=True, method=6)).
import { chromium } from "@playwright/test";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { writeFileSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const { outputFiles } = await build({ entryPoints: [join(here, "..", "src", "lib", "stone.ts")], bundle: true, write: false, format: "iife", globalName: "stone" });
const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const p = await b.newPage();
await p.addScriptTag({ content: outputFiles[0].text });
const url = await p.evaluate(() => new Promise((r) => window.stone.make().toBlob((blob) => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(blob); }, "image/webp", 1)));
const out = join(here, "..", "public", "images", "stone.webp");
writeFileSync(out, Buffer.from(url.split(",")[1], "base64"));
console.log("wrote", out);
await b.close();
