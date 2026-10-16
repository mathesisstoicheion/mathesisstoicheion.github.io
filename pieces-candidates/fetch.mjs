// Downloads the museum's small web picture of every candidate in list.json (Met object IDs) into this folder, so the
// pieces for each page can be chosen by eye. Temporary: this folder goes once the pieces are chosen.
//   node pieces-candidates/fetch.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";
const dir = new URL(".", import.meta.url).pathname;
const ids = JSON.parse(readFileSync(dir + "list.json", "utf8"));
const UA = { "User-Agent": "MathesisStoicheion/1.0 (non-commercial educational site; choosing pictures)" };
for (const id of ids) {
  if (existsSync(`${dir}${id}.jpg`)) continue;
  try {
    const o = await (await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`, { headers: UA })).json();
    const url = o.primaryImageSmall || o.primaryImage;
    if (!o.isPublicDomain || !url) { console.log(id, "no open image"); continue; }
    const r = await fetch(url, { headers: UA });
    if (!r.ok) { console.log(id, "image", r.status); continue; }
    writeFileSync(`${dir}${id}.jpg`, Buffer.from(await r.arrayBuffer()));
    console.log(id, o.title);
  } catch (e) { console.log(id, "failed", String(e)); }
  await new Promise((s) => setTimeout(s, 1200));
}
