/**
 * The site's icons and its share picture (the printer's device, made by scripts/make-logo.mjs), each named with the mark of
 * its own picture after its address: /favicon.ico?v=4ecba4ec. A browser keeps a site's tab icon, a phone the icon of a site
 * added to its home screen, and a chat app the picture of a shared link, under the picture's address, often for weeks: the
 * owner still saw the old owl a week after the seal replaced it (2026-10-30). A new picture is a new address, fetched
 * afresh everywhere. The marks are read from the files when the site is built, so this is for the server's pages only
 * (app/layout.tsx, app/manifest.ts); scripts/check-icons.mjs checks every built page.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SHARE_IMAGE } from "./seo";

/** A picture in public/ by its address, with its mark: the first eight letters of its SHA-256. */
export function marked(address: string): string {
  const mark = createHash("sha256").update(readFileSync(join(process.cwd(), "public", address))).digest("hex").slice(0, 8);
  return `${address}?v=${mark}`;
}

/** The picture a shared link shows (lib/seo.ts), with its mark. */
export const SHARE_PICTURE = { ...SHARE_IMAGE, url: marked(SHARE_IMAGE.url) };
