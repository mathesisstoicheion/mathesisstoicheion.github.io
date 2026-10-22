/**
 * The photographs the site shows (redesign SPEC.md 3.7): every one named anywhere in the code must have its credit record
 * (src/data/images.json or src/data/piece-images.json: what it shows, where it is, its licence and its source), its file,
 * and real colour. A black-and-white photograph (an old museum print) breaks "real colour photographs" and fails.
 *
 *   node scripts/check-photos.mjs
 *
 * Colour is measured on the small copy, by the gap between each pixel's strongest and weakest channel (0 for a grey pixel):
 * the gap that only one pixel in a hundred exceeds. A grey print scores 0 to 2 (the noise of its compression); the palest
 * colour photograph on record, a dark bronze on a grey ground, scores 10.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WEB = join(import.meta.dirname, "..");
const LINE = 4;   // below this, the picture is grey
const records = { ...JSON.parse(readFileSync(join(WEB, "src/data/images.json"), "utf8")), ...JSON.parse(readFileSync(join(WEB, "src/data/piece-images.json"), "utf8")) };

// the code that is shown: every .ts and .tsx under src (tests aside)
const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (/\.tsx?$/.test(n) && !/\.test\.tsx?$/.test(n)) files.push(p); } };
walk(join(WEB, "src"));
const code = files.map((f) => readFileSync(f, "utf8")).join("\n");
const named = Object.keys(records).filter((id) => code.includes(`"${id}"`));

const fails = [];
for (const id of named) {
  const r = records[id];
  for (const k of ["file", "title", "licence", "source", "alt"]) if (!r[k]) fails.push(`${id}: its record has no ${k}`);
  const small = join(WEB, "public/images/w320", r.file), full = join(WEB, "public/images", r.file);
  const file = existsSync(small) ? small : full;
  if (!existsSync(file)) { fails.push(`${id}: no file ${r.file}`); continue; }
  const { data, info } = await sharp(file).resize(160, 160, { fit: "inside" }).toColourspace("srgb").removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const gaps = [];
  for (let i = 0; i < data.length; i += info.channels) gaps.push(Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]));
  gaps.sort((a, b) => a - b);
  const colour = gaps[Math.floor(gaps.length * 0.99)];
  if (colour < LINE) fails.push(`${id}: a black-and-white photograph (colour ${colour}); the plates are real colour photographs`);
}

console.log(`${named.length} photographs named in the code, of ${Object.keys(records).length} on record`);
if (fails.length) { console.error("FAIL\n  " + fails.join("\n  ")); process.exit(1); }
console.log("PASS: every one has its credit record, its file and real colour");
