#!/usr/bin/env node
/**
 * Record one of the lyre's melodies to a CD-quality WAV file (44.1 kHz, 16-bit, stereo), with the very code the page
 * plays (src/lib/lyre: the strings, the sound box, the hall, and record.ts for the playing), run in a headless browser's
 * OfflineAudioContext.
 *
 *   node scripts/record-melody.mjs <melody id> <out.wav> [tempo] [room]
 *   e.g. node scripts/record-melody.mjs seikilos seikilos.wav 0.8 0.5
 */
import { build } from "esbuild";
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [id, out, tempo = "1", room = "0.5"] = process.argv.slice(2);
if (!id || !out) { console.error("usage: record-melody.mjs <id> <out.wav> [tempo] [room]"); process.exit(1); }
const data = JSON.parse(fs.readFileSync(path.join(WEB, "public/data/melodies", `${id}.json`), "utf8"));

const bundle = await build({
  stdin: {
    contents: `import { recordWav } from "@/lib/lyre/record"; window.recordWav = recordWav;`,
    resolveDir: WEB, loader: "ts",
  },
  bundle: true, write: false, format: "iife", target: "es2022",
  alias: { "@": path.join(WEB, "src") },
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? undefined, args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage();
page.on("console", (m) => console.log("[page]", m.text()));
await page.setContent("<!doctype html><title>record</title>");
await page.addScriptTag({ content: bundle.outputFiles[0].text });
const t0 = Date.now();
const b64 = await page.evaluate(async ({ data, tempo, room }) => {
  const blob = await window.recordWav(data.notes, { bpm: data.bpm, tempo, room });
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = ""; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}, { data, tempo: +tempo, room: +room });
await browser.close();
fs.writeFileSync(out, Buffer.from(b64, "base64"));
console.log(`${out}: ${(fs.statSync(out).size / 1e6).toFixed(1)} MB in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
