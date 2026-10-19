#!/usr/bin/env python3
"""
Writes the Greek texts the letter figures are spelled out of (lib/a/lamplight.js, the stages; data/figures.ts says which
figure takes which text): plain Greek, in reading order, one line, from the Perseus Digital Library's TEI files at the
exact version the site's catalogue pins (public/data/catalog.json). Notes, headings and editors' labels are left out;
everything the edition prints as the text is kept, accents and punctuation included.

Each passage is named by the edition's own numbers (Stephanus pages, chapters, sections or lines), so anyone can check it
in the reader. Plato's Apology, the library's Socrates, is made the same way, and the script checks that it still matches
the file design A shipped (public/data/a/apology.txt).

    python3 web/scripts/make-figure-texts.py <folder with the TEI files>     (from the repository root)

The TEI files are downloaded first, e.g. with curl, from
https://raw.githubusercontent.com/PerseusDL/canonical-greekLit/<sha>/<path>, the sha and path given in the catalogue.
"""
import re
import sys
import unicodedata
import xml.etree.ElementTree as ET
from pathlib import Path

TEI = "{http://www.tei-c.org/ns/1.0}"
SKIP = {"note", "bibl", "head", "label", "speaker", "gap"}

# what each figure is spelled out of: the file, and the passage, in the edition's numbering
PASSAGES = {
    # the library's Socrates: the whole Apology (checked against the file design A shipped)
    "apology": ("tlg0059.tlg002.perseus-grc2.xml", ("all",)),
    # Learn: Plato's cave, "our nature in its education and its lack of education" (Republic 7, 514a to 519b)
    "republic-cave": ("tlg0059.tlg030.perseus-grc2.xml", ("milestone", "section", "514a", "519b")),
    # Explore: the life of Chrysippus (Diogenes Laertius 7.179 to 7.187, before what his critics said and the list of his books)
    "chrysippus-life": ("tlg0004.tlg001.perseus-grc2.xml", ("sections", "7", "179", "187")),
    # Talk: Pericles' Funeral Oration (Thucydides 2.35 to 2.46)
    "funeral-oration": ("tlg0003.tlg001.perseus-grc2.xml", ("chapters", "2", "35", "46")),
    # Mine: Pericles counts the city's treasure, down to the gold on Athena's statue (Thucydides 2.13)
    "treasure-of-athens": ("tlg0003.tlg001.perseus-grc2.xml", ("chapters", "2", "13", "13")),
    # Search: the Pythian part of the Homeric Hymn to Apollo, from his going to Pytho with his lyre (lines 182 to 546)
    "hymn-to-apollo-pythian": ("tlg0013.tlg003.perseus-grc2.xml", ("lines", "182", "546")),
}


def tag(e):
    return e.tag.replace(TEI, "") if isinstance(e.tag, str) else ""


def events(e, path=()):
    """The body in reading order: ("t", text), ("m", unit, n) for a milestone, ("open"/"close", tag, subtype, n)."""
    t = tag(e)
    if t in SKIP:
        if e.tail:
            yield ("t", e.tail)
        return
    if t == "milestone":
        yield ("m", e.get("unit"), e.get("n"))
    else:
        yield ("open", t, e.get("subtype"), e.get("n"))
        if e.text:
            yield ("t", e.text)
        for c in e:
            yield from events(c, path + (t,))
        yield ("close", t, e.get("subtype"), e.get("n"))
    if e.tail:
        yield ("t", e.tail)


def pick(body, sel):
    out, on = [], sel[0] == "all"
    stack = []   # open divs: (subtype, n)
    for ev in events(body):
        kind = ev[0]
        if kind == "open":
            _, t, sub, n = ev
            if t == "div":
                stack.append((sub, n))
                book = next((x[1] for x in stack if x[0] == "book"), None)
                if sel[0] == "sections" and sub == "section" and book == sel[1] and int(sel[2]) <= int(n) <= int(sel[3]):
                    on = True
                if sel[0] == "chapters" and sub == "chapter" and book == sel[1] and int(sel[2]) <= int(n) <= int(sel[3]):
                    on = True
            if t == "l" and sel[0] == "lines" and n and n.isdigit() and int(sel[1]) <= int(n) <= int(sel[2]):
                on = True
            continue
        if kind == "close":
            _, t, sub, n = ev
            if t == "div":
                stack.pop()
                if sel[0] in ("sections", "chapters") and sub == sel[0][:-1] and on:
                    on = False
            if t == "l" and sel[0] == "lines" and on:
                out.append(" ")
                on = False
            if t in ("p", "l", "div"):
                out.append(" ")
            continue
        if kind == "m":
            _, unit, n = ev
            out.append(" ")   # a milestone stands between two words (design A's file has a space there)
            if sel[0] == "milestone" and unit == sel[1]:
                if n == sel[2]:
                    on = True
                elif n == sel[3]:
                    on = False
            continue
        if on:
            out.append(ev[1])
    return "".join(out)


def tidy(s):
    s = unicodedata.normalize("NFC", s)
    s = s.replace("ʼ", "’").replace("᾽", "’")   # the elision mark, as design A's file writes it
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r" ([,.·;:])", r"\1", s)
    s = re.sub(r"[<>]", "", s)   # an editor's angle brackets (design A's file leaves them out)
    return s


def to_sentence(s):
    """A passage that ends between two milestones in mid-sentence stops at the last full stop, question or colon before."""
    k = max(s.rfind(c) for c in ".;·")
    return s[:k + 1] if k > len(s) * 0.8 else s


def main():
    src = Path(sys.argv[1])
    out = Path(__file__).resolve().parent.parent / "public" / "data" / "a"
    for name, (file, sel) in PASSAGES.items():
        root = ET.parse(src / file).getroot()
        body = root.find(f".//{TEI}body")
        text = tidy(pick(body, sel))
        if sel[0] == "milestone":
            text = to_sentence(text)
        if name == "apology":
            # (design A's file has a space before one comma, after φωνή; that is the only other difference)
            shipped = tidy((out / "apology.txt").read_text(encoding="utf8"))
            same = text == shipped
            print(f"apology: {len(text)} letters; {'matches' if same else 'DIFFERS FROM'} the file design A shipped")
            if not same:
                for i, (a, b) in enumerate(zip(text, shipped)):
                    if a != b:
                        print("  first difference at", i, repr(text[max(0, i - 40):i + 40]), "|", repr(shipped[max(0, i - 40):i + 40]))
                        break
            continue
        (out / f"{name}.txt").write_text(text + "\n", encoding="utf8")
        print(f"{name}: {len(text)} letters, from “{text[:60]}” to “{text[-60:]}”")


if __name__ == "__main__":
    main()
