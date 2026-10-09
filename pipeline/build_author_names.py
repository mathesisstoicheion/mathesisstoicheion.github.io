"""
Build web/public/data/author-names.json from Wikidata (CC0): for every catalogue author with a "TLG author ID"
(property P3576), the author's Ancient Greek name (the "grc" label) and the other names they are known by, so the
library's search finds Aristotle under Ἀριστοτέλης, Aristoteles or Aristote, and Plato under Platon. Nothing is
written by hand: the names are Wikidata's labels and aliases in English, Ancient and Modern Greek, Latin, German,
French, Italian and Spanish, keeping only those that differ from the catalogue's own name once accents and capitals
are ignored, are at least four letters long, are not abbreviations ("Thuc.") and do not name a different author
("Pseudo-Aristotle" is an alias of Aristotle there, but a separate shelf here).

Usage:  python pipeline/build_author_names.py        (needs a connection to query.wikidata.org)
"""
import json
import re
import unicodedata
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "web" / "public" / "data" / "catalog.json"
OUT = ROOT / "web" / "public" / "data" / "author-names.json"
UA = {"User-Agent": "MathesisStoicheion/0.1 (learning site; mathesis.stoicheion@gmail.com)", "Accept": "application/sparql-results+json"}
LANGS = ["en", "grc", "el", "la", "de", "fr", "it", "es"]

QUERY = """SELECT ?tlg ?lang ?label WHERE {
  VALUES ?tlg { %s }
  ?item wdt:P3576 ?tlg .
  { ?item rdfs:label ?label } UNION { ?item skos:altLabel ?label }
  BIND(LANG(?label) AS ?lang)
  FILTER(?lang IN (%s))
}"""


def fold(s: str) -> str:
    """As the site folds for search (lib/catalog.ts): no accents or breathings, lower case, one sigma."""
    s = "".join(c for c in unicodedata.normalize("NFD", s) if not unicodedata.combining(c))
    return s.lower().replace("ς", "σ").replace("ϲ", "σ")


def main() -> None:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    names = {a["id"]: a["name"] for a in catalog["authors"]}
    # Wikidata stores "0086" for tlg0086; ask for the catalogue's authors only, a hundred at a time
    wanted = [i[3:] if re.fullmatch(r"tlg\d{4}", i) else i for i in names]
    rows = []
    for k in range(0, len(wanted), 100):
        q = QUERY % (" ".join(f'"{w}"' for w in wanted[k:k + 100]), ", ".join(f'"{l}"' for l in LANGS))
        url = "https://query.wikidata.org/sparql?format=json&query=" + urllib.parse.quote(q)
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r:
            rows += json.load(r)["results"]["bindings"]

    grc: dict[str, set[str]] = defaultdict(set)
    also: dict[str, set[str]] = defaultdict(set)
    for row in rows:
        raw = row["tlg"]["value"]
        tlg = "tlg" + raw if re.fullmatch(r"\d{4}", raw) else raw
        if tlg not in names:
            continue
        label, lang = row["label"]["value"].strip(), row["lang"]["value"]
        if lang == "grc":
            grc[tlg].add(label)
        also[tlg].add(label)

    out = {}
    for tlg, labels in also.items():
        own = fold(names[tlg])
        kept, seen = [], {own}
        for label in sorted(labels, key=lambda s: (len(s), s)):
            f = fold(label)
            if f in seen or len(re.sub(r"\W", "", f)) < 4 or "." in label or "pseudo" in f:
                continue
            seen.add(f)
            kept.append(label)
        e = {}
        # the Ancient Greek name, when Wikidata has exactly one (several would mean variants we cannot choose between)
        if len(grc[tlg]) == 1:
            e["grc"] = next(iter(grc[tlg]))
        if kept:
            e["also"] = kept
        if e:
            out[tlg] = e

    payload = {"source": "Wikidata labels and aliases, property P3576 (TLG author ID)", "licence": "CC0",
               "accessed": date.today().isoformat(), "authors": dict(sorted(out.items()))}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {len(out)} of {len(names)} authors ({sum('grc' in e for e in out.values())} with a Greek name) to {OUT}")


if __name__ == "__main__":
    main()
