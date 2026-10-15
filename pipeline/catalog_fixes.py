"""
Corrections to the collections' own metadata that the catalogue applies when it is built.

Some __cts__.xml files label an English translation as Greek (Armstrong's Economics, Burtt's Against Leocrates)
or list it as an edition (Jones's Epidemics), so the reader never offered them as translations. The file's
version name says what it is ("perseus-eng2" is English), and the files themselves agree (<text xml:lang="eng">,
<div type="translation">, checked 2026-10-15), so the version name is trusted over the label.

Run directly to correct the catalogue already built, without fetching anything:
    python pipeline/catalog_fixes.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "web" / "public" / "data" / "catalog.json"


def fix_languages(catalog: dict) -> list[str]:
    changes = []
    for a in catalog["authors"]:
        for w in a["works"]:
            has_greek = any(t["kind"] == "edition" and t["lang"] == "grc" for t in w["texts"])
            for t in w["texts"]:
                version = t["urn"].rsplit(".", 1)[-1]          # e.g. perseus-eng2
                if not re.match(r"^[\w]+-eng\d+$", version):
                    continue
                if t["lang"] != "eng":
                    changes.append(f"{t['urn']}: language {t['lang']} -> eng")
                    t["lang"] = "eng"
                if t["kind"] == "edition" and has_greek:
                    changes.append(f"{t['urn']}: edition -> translation")
                    t["kind"] = "translation"
            w["texts"].sort(key=lambda t: (["edition", "translation", "commentary"].index(t["kind"]), t["urn"]))
    return changes


if __name__ == "__main__":
    catalog = json.loads(OUT.read_text(encoding="utf-8"))
    changes = fix_languages(catalog)
    OUT.write_text(json.dumps(catalog, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print("\n".join(changes) or "nothing to correct")
