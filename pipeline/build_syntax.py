"""
Build the sentence-structure pack from GLAUx (Keersmaekers 2021, CC BY-SA 4.0; credited on the site's Credits page).

GLAUx analyses every sentence as a dependency tree, in the scheme of the Ancient Greek Dependency Treebank:
each word hangs on another (its head) with a relation (subject, object, attribute…), and the main verb hangs on
nothing. For every work that has a word pack (build_words.py), this writes web/public/data/syntax/<work>.json,
read from the same cached GLAUx files, so that its words come in exactly the same order as the word pack's.

Format (small, for 16 million words): {"v":1, "work", "glaux", "sha", "rels": [relation names], "s": [sentences]},
a sentence being [manual (0/1), code, extras?]:
- the sentence's tokens in order: the word pack's words (which follow on from the previous sentence's), plus
  "extras": punctuation that other words hang on (a comma joining two clauses) and words the annotators supplied
  (an understood verb, which GLAUx does not name), given as [position, form], a supplied word's form being "";
- code: two characters a token from B64: the relation, then the head as an offset from the token (-31…+32, never 0),
  "~" for no head (the root), or "!" and two characters for the head's position when it is further away.
Punctuation that nothing hangs on is left out. Usage: python pipeline/build_syntax.py [work ids…]
"""
from __future__ import annotations

import concurrent.futures as cf
import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "pipeline" / ".cache" / "glaux"
WORDS = ROOT / "web" / "public" / "data" / "words"
OUT = ROOT / "web" / "public" / "data" / "syntax"
B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"


def encode(rel: int, i: int, head: int) -> str:
    if rel >= 64:
        raise ValueError("more than 64 relations")
    if head < 0:
        return B64[rel] + "~"
    off = head - i
    if -31 <= off <= 32 and off != 0:
        return B64[rel] + B64[off + 31]
    if head >= 4096:
        raise ValueError("sentence too long")
    return B64[rel] + "!" + B64[head >> 6] + B64[head & 63]


def build_one(wid: str) -> tuple[str, int, int]:
    pack = json.loads((WORDS / f"{wid}.json").read_text(encoding="utf-8"))
    src = CACHE / f"{pack['glaux']}.xml"
    expected = sum(len(u[3]) for u in pack["units"])
    rels: dict[str, int] = {}
    sentences: list[list] = []
    words = 0
    for _event, el in ET.iterparse(src, events=("end",)):
        if el.tag != "sentence":
            continue
        toks = []
        for w in el.iter("word"):
            tag = w.get("postag") or ""
            form = w.get("form") or ""
            kept = not (w.get("artificial") or not form or tag.startswith("u"))   # the word pack's own rule
            toks.append({
                "id": w.get("id"), "head": w.get("head") or "0", "rel": w.get("relation") or "",
                # a word the annotators supplied ("elliptic") is not named in GLAUx: its form is left empty
                "kept": kept, "form": "" if w.get("artificial") else form,
            })
        heads = {t["head"] for t in toks}
        # punctuation nothing hangs on is left out; words the annotators supplied, and punctuation heads, stay
        toks = [t for t in toks if t["kept"] or t["id"] in heads]
        index = {t["id"]: i for i, t in enumerate(toks)}
        code, extras = [], []
        for i, t in enumerate(toks):
            h = index.get(t["head"], -1)
            code.append(encode(rels.setdefault(t["rel"], len(rels)), i, h))
            if t["kept"]:
                words += 1
            else:
                extras.append([i, t["form"]])
        manual = 1 if el.get("analysis") == "manual" else 0
        sentences.append([manual, "".join(code), extras] if extras else [manual, "".join(code)])
        el.clear()
    if words != expected:
        raise RuntimeError(f"{wid}: {words} words, but the word pack has {expected}")
    out = {"v": 1, "work": wid, "glaux": pack["glaux"], "sha": pack["sha"], "licence": pack["licence"],
           "rels": list(rels), "s": sentences}
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{wid}.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return wid, words, len(sentences)


def main() -> None:
    only = set(sys.argv[1:])
    works = sorted(p.stem for p in WORDS.glob("tlg*.json") if not only or p.stem in only)
    done = words = sents = 0
    with cf.ProcessPoolExecutor(6) as ex:
        for f in cf.as_completed([ex.submit(build_one, w) for w in works]):
            try:
                _wid, n, s = f.result()
                done += 1; words += n; sents += s
                if done % 100 == 0:
                    print(f"  {done}/{len(works)} works, {words:,} words", flush=True)
            except Exception as e:
                print(f"  failed: {e}", file=sys.stderr, flush=True)
    built = sorted(p.stem for p in OUT.glob("tlg*.json"))
    (OUT / "_index.json").write_text(json.dumps({"works": built}, separators=(",", ":")), encoding="utf-8")
    size = sum(p.stat().st_size for p in OUT.glob("*.json"))
    print(f"done: {done} works, {words:,} words in {sents:,} sentences, {size/1e6:.0f} MB in {OUT}")


if __name__ == "__main__":
    main()
