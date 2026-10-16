"""
The lyre's melodies (/stoa/lyre): the surviving ancient Greek music, from Stefan Hagel's MIDI renderings of the
transcriptions in Pöhlmann and West, Documents of Ancient Greek Music (Oxford 2001), turned into the note lists the
lyre plays: pitch (with Hagel's ancient tuning kept exactly: his files bend each note to its ratio, so 67.18 is a G a
little sharp of the modern one), start and length in beats, and the syllable sung to each note where the words are set.

Hagel's files (Austrian Academy of Sciences, "Ancient Greek Music: The Melodies", © Stefan Hagel 1998) are research
material kept on the lyre's branch only (music-sources/, fetched by .github/workflows/fetch-music.yml); the site carries
only the notes taken from them, with his name and the edition credited on the page.

Each file has two identical voices; the first is used. One beat is the χρόνος πρῶτος, the shortest time of Greek
rhythm (the commonest short note in each file). A silence of more than a beat is kept as it is: in the papyri these are
where the notes are lost.

Syllables are given line by line; "φαί-*3" means the syllable φαί, part of a longer word, sung over three notes. Where
a source sets the words (the Seikilos song in Wikipedia's transcription, which matches Hagel's note for note) it is
followed; for the two short hymns attributed to Mesomedes the notes are matched to the syllables by the metre: every
long syllable takes two beats and every short one beat, so a long syllable held over two one-beat notes is a melisma.
The script checks that every line's notes are used exactly.

    python pipeline/build_melodies.py
"""
from __future__ import annotations

import json
import struct
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "music-sources"
OUT = ROOT / "web" / "public" / "data" / "melodies"


def vlq(d: bytes, i: int):
    v = 0
    while True:
        b = d[i]; i += 1; v = (v << 7) | (b & 0x7F)
        if not b & 0x80:
            return v, i


def read_midi(path: Path):
    """The notes of a MIDI file's first channel: (start ms, length ms, pitch with its bend). Bend range ±2 semitones."""
    d = path.read_bytes()
    assert d[:4] == b"MThd"
    _fmt, _ntr, div = struct.unpack(">HHH", d[8:14])
    i, tempo, notes = 14, 500000, []
    while i < len(d):
        tag, ln = d[i:i + 4], struct.unpack(">I", d[i + 4:i + 8])[0]
        body = d[i + 8:i + 8 + ln]; i += 8 + ln
        if tag != b"MTrk":
            continue
        j = t = 0; run = None; bend = 8192; on = {}
        while j < len(body):
            dt, j = vlq(body, j); t += dt
            st = body[j]
            if st == 0xFF:
                typ = body[j + 1]; l2, k = vlq(body, j + 2)
                if typ == 0x51:
                    tempo = int.from_bytes(body[k:k + l2], "big")
                j = k + l2; continue
            if st in (0xF0, 0xF7):
                l2, k = vlq(body, j + 1); j = k + l2; continue
            if st & 0x80:
                run = st; j += 1
            st = run; kind, ch = st & 0xF0, st & 15
            n = 1 if kind in (0xC0, 0xD0) else 2
            a = body[j:j + n]; j += n
            if ch != 0:
                continue
            if kind == 0xE0:
                bend = a[0] + a[1] * 128
            elif kind == 0x90 and a[1] > 0:
                on[a[0]] = (t, a[0] + (bend - 8192) / 4096)
            elif kind == 0x80 or (kind == 0x90 and a[1] == 0):
                if a[0] in on:
                    t0, p = on.pop(a[0])
                    notes.append((t0, t - t0, p))
    ms = tempo / 1000 / div
    return sorted((t * ms, dd * ms, p) for t, dd, p in notes)


def unit_of(notes) -> float:
    c = Counter(round(d) for _, d, _ in notes)
    return float(min(k for k, _ in c.most_common(3)))


# ── the words, as sung ─────────────────────────────────────────────────────────────────────────────────────────────
SYLLABLES: dict[str, list[str]] = {
    # Wikipedia, "Seikilos epitaph", the transcription after Pöhlmann and West (its slurs give the melismas)
    "seikilos": [
        "Ὅ- σον ζῇς φαί-*3 νου",
        "μη- δὲν ὅ- λως*2 σὺ λυ- ποῦ*2",
        "πρὸς ὀ- λί- γον ἔσ-*2 τι τὸ ζῆν*2",
        "τὸ τέ- λος ὁ χρό- νος ἀπ- αι- τεῖ*3",
    ],
    # by the metre (iambic: u – u – …; a long syllable is two beats)
    "muse": [
        "Ἄ- ει- δε μοῦ- σά μοι φί- λη",
        "μολ- πῆς δ’ἐ- μῆς κα- τάρ- χου",
        "αὔ- ρη δὲ σῶν*2 ἀ- π’ἀλ- σέ- ων",
        "ἐ- μὰς*2 φρέ- νας*2 δο- νεί- τω*2",
    ],
    # by the metre (dactylic: – u u – …)
    "calliope": [
        "Καλ- λι- ό- πει- α σο- φά",
        "μου- σῶν*2 προ- κα- θα- γέ- τι τερ- πνῶν",
        "καὶ σο- φὲ μυσ- το- δό- τα",
        "Λα- τοῦς γό- νε Δή- λι- ε Παι- άν*2",
        "εὐ- με- νεῖς*2 πά- ρεσ- τέ μοι",
    ],
}

# (id, file, which notes: a slice of the file's notes, or all)
PIECES = [
    ("seikilos", "dam18.mid", None),
    ("muse", "dam01.mid", (0, 34)),
    ("calliope", "dam01.mid", (34, 76)),
    ("helios", "dam04.mid", None),
    ("nemesis", "dam05.mid", None),
    ("delphic-1", "dam19.mid", None),
    ("delphic-2", "dam20.mid", None),
    ("orestes", "dam21.mid", None),
    ("berlin-instrumental", "dam33.mid", None),
    ("oxyrhynchus", "dam34.mid", None),
]


def syllables_for(pid: str, count: int) -> list[str | None]:
    lines = SYLLABLES.get(pid)
    if not lines:
        return [None] * count
    out: list[str | None] = []
    for li, line in enumerate(lines):
        for ti, tok in enumerate(line.split()):
            syl, _, n = tok.partition("*")
            k = int(n) if n else 1
            out.append(("\n" if li and not ti else "") + syl)     # "\n": this syllable begins a new line of the words
            out.extend([None] * (k - 1))
    if len(out) != count:
        raise SystemExit(f"{pid}: {len(out)} note places for the words, but {count} notes")
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for pid, fname, part in PIECES:
        notes = read_midi(SRC / fname)
        unit = unit_of(notes)
        if part:
            notes = notes[part[0]:part[1]]
        t0 = notes[0][0]
        syl = syllables_for(pid, len(notes))
        rows, gaps, end = [], [], None
        for (t, d, p), s in zip(notes, syl):
            bt, bd = (t - t0) / unit, d / unit
            if end is not None and bt - end > 1.5:
                gaps.append([round(end, 2), round(bt, 2)])
            row = {"m": round(p, 2), "t": round(bt, 3), "d": round(bd, 3)}
            if s:
                if s.startswith("\n"):
                    row["br"] = 1
                row["syl"] = s.lstrip("\n")
            rows.append(row)
            end = bt + bd
        data = {"id": pid, "bpm": round(60000 / unit, 1), "gaps": gaps, "notes": rows}
        (OUT / f"{pid}.json").write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
        secs = (notes[-1][0] + notes[-1][1] - t0) / 1000
        print(f"{pid:22s} {len(rows):4d} notes  {secs:6.1f} s  beat {unit:.0f} ms  gaps {len(gaps)}")


if __name__ == "__main__":
    main()
