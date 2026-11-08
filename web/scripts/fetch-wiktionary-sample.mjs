// Fetch what Wiktionary's definition API sends (Ancient Greek entries only) for a spread of words, so that the look-up's
// cleaning is tested on real entries. Writes src/lib/lookup/fixtures/wiktionary-sample.json. One request a second, as
// Wikimedia asks of scripts; a word Wiktionary turned away (429, too many requests) is asked again on the next run, and the
// words already fetched are kept (--fresh fetches them all again).
// Usage: node scripts/fetch-wiktionary-sample.mjs [out-file] [--fresh]   (behind a proxy: NODE_USE_ENV_PROXY=1)
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const WORDS = `διά ἐπί κατά ἀπό ἐν εἰς ἐκ παρά πρός ὑπό μετά περί ἀμφί ἀντί σύν ὑπέρ ἄνευ ἕνεκα πρό
δέ γάρ μέν οὖν ἄν τε καί ἀλλά οὐ μή γε δή ἤ ὡς ὅτι εἰ ἐπεί ἵνα ἄρα που
ὁ αὐτός οὗτος ἐκεῖνος τίς τις ὅς ἐγώ σύ ἡμεῖς ὅστις
εἰμί λέγω ἔχω ποιέω λύω φημί οἶδα ἔρχομαι δίδωμι ἵστημι τίθημι ἵημι γίγνομαι βαίνω ὁράω ἀκούω φέρω
λόγος θεός ἀνήρ ἄνθρωπος μῆνις πόλις ψυχή ἀρετή φύσις ναῦς Ζεύς Ἀχιλλεύς Ἀγαμέμνων Τροία θεά ἄλγος
ἀγαθός καλός πολύς μέγας πᾶς κακός
ἄειδε Πηληϊάδεω ἔφη ἦν λόγου ἀνδρός εἶπε ἐστί τοῦ τῷ ποσσίν ῥέεθρα κιών οὐλομένην ἔθηκε ἀνδρῶν`.split(/\s+/).filter(Boolean);

const API = "https://en.wiktionary.org/api/rest_v1/page/definition/";
const UA = "MathesisStoicheion-lookup-check/1.0 (https://mathesisstoicheion.com)";
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const file = args[0] ?? "src/lib/lookup/fixtures/wiktionary-sample.json";
const out = existsSync(file) && !process.argv.includes("--fresh") ? JSON.parse(readFileSync(file, "utf8")) : {};
for (const w of WORDS) {
  if (out[w] && !out[w].status) continue;
  let res;
  for (let tries = 0; tries < 4; tries++) {
    res = await fetch(API + encodeURIComponent(w) + "?redirect=true", { headers: { "user-agent": UA } });
    if (res.status !== 429) break;
    console.log(w, "429, waiting");
    await new Promise((r) => setTimeout(r, 5000 * (tries + 1)));
  }
  if (!res.ok) { out[w] = { status: res.status }; console.log(w, res.status); continue; }
  const data = await res.json();
  const grc = {};
  for (const [k, list] of Object.entries(data)) {
    const keep = list.filter((e) => e.language === "Ancient Greek").map((e) => ({ ...e, definitions: e.definitions.map((d) => ({ definition: d.definition })) }));
    if (keep.length) grc[k] = keep;
  }
  out[w] = grc;
  console.log(w, "ok");
  await new Promise((r) => setTimeout(r, 1000));
}
writeFileSync(file, JSON.stringify(Object.fromEntries(WORDS.map((w) => [w, out[w]])), null, 1) + "\n");
console.log(`fetched ${WORDS.length} words`);
