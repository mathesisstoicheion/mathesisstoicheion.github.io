// The icons check. A browser keeps a site's tab icon, a phone the icon of a site added to its home screen, and a chat app
// the picture of a shared link, under the picture's address, often for weeks: a new picture saved at the old address can go
// unseen (the owner still saw the old owl a week after the printer's device replaced it, 2026-10-30: "The owl is old
// news"). So every icon the built pages and the install manifest name, and the share picture, must carry after its
// address the mark of the picture itself (?v=…, src/lib/icons.ts): a new picture is then a new address, fetched afresh.
// usage: node web/scripts/check-icons.mjs [built site, default web/out]   (run `npm run build` first; exits with 1 when an
// icon has no mark, or the mark of an older picture)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const OUT = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, "..", "out"));
const marks = new Map();
const markOf = (file) => {
  if (!marks.has(file)) marks.set(file, crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 8));
  return marks.get(file);
};

const found = new Map();   // problem -> the pages it was seen on
const note = (problem, where) => { if (!found.has(problem)) found.set(problem, []); found.get(problem).push(where); };
function look(where, address) {
  const u = new URL(address.replace(/&amp;/g, "&"), "https://mathesisstoicheion.com");
  const file = path.join(OUT, decodeURIComponent(u.pathname));
  if (!fs.existsSync(file)) return note(`${address} names no file in the built site`, where);
  const want = markOf(file);
  if (u.searchParams.get("v") !== want) note(`${address} should end ?v=${want}, the mark of the picture it names`, where);
}

// every page: its icons (<link rel="icon">, "apple-touch-icon"…) and its share picture (og:image, twitter:image)
const ICON = /<link\b[^>]*\brel="[^"]*\b(?:icon|apple-touch-icon)\b[^"]*"[^>]*>/g;
const SHARE = /<meta\b[^>]*\b(?:property="og:image"|name="twitter:image")[^>]*>/g;
let pages = 0, icons = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) {
      const html = fs.readFileSync(p, "utf8"), head = html.slice(0, html.indexOf("</head>") + 1 || html.length);
      const where = path.relative(OUT, p);
      pages++;
      for (const m of head.matchAll(ICON)) { const h = m[0].match(/\bhref="([^"]+)"/); if (h) { icons++; look(where, h[1]); } }
      for (const m of head.matchAll(SHARE)) { const c = m[0].match(/\bcontent="([^"]+)"/); if (c) { icons++; look(where, c[1]); } }
    }
  }
}
walk(OUT);

// the install manifest (src/app/manifest.ts)
const manifest = path.join(OUT, "manifest.webmanifest");
if (fs.existsSync(manifest)) for (const i of JSON.parse(fs.readFileSync(manifest, "utf8")).icons ?? []) { icons++; look("manifest.webmanifest", i.src); }
else note("the install manifest is missing", "manifest.webmanifest");

if (!pages) { console.error(`check-icons: no built pages in ${OUT} (run npm run build first)`); process.exit(1); }
if (!found.size) { console.log(`check-icons: all ${icons} icons and share pictures on ${pages} pages and in the manifest carry the mark of their picture`); process.exit(0); }
for (const [problem, where] of found) console.log(`✗ ${problem}  (${where.length} ${where.length === 1 ? "place" : "places"}, e.g. ${where.slice(0, 2).join(", ")})`);
console.log(`check-icons: ${found.size} ${found.size === 1 ? "icon" : "icons"} without the mark of their picture`);
process.exit(1);
