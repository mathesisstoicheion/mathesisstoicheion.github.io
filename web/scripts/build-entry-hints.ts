/**
 * Writes src/wiki/entry-hints.json: each Painted Stoa entry's one-line kicker by slug, for the tooltip on links
 * to entries (components/stoa/Markup.tsx). Pages that show such links (author articles) then do not have to
 * carry every entry's whole text. Run after adding or retitling an entry; src/wiki/entries.test.ts checks it.
 *
 *   npx tsx scripts/build-entry-hints.ts
 */
import { writeFileSync } from "node:fs";
import { ENTRIES } from "../src/wiki/index";

const hints = Object.fromEntries([...ENTRIES].sort((a, b) => a.slug.localeCompare(b.slug)).map((e) => [e.slug, e.kicker]));
writeFileSync(new URL("../src/wiki/entry-hints.json", import.meta.url), JSON.stringify(hints, null, 1) + "\n");
console.log(`${Object.keys(hints).length} entries`);
