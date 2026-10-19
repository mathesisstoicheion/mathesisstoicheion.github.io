#!/usr/bin/env python3
"""
Prepares the "engraving sources": small grey-and-see-through PNG pictures that a canvas engine draws as gold line
engravings (Design A, "Gold and lamplight").

Each picture is a greyscale PNG with an alpha (see-through) channel:
  * the RED channel is the brightness, 0 (dark) to 255 (light), which the engine turns into lines;
  * the ALPHA channel says where the object is. Sculpture pieces have a cut-out, so their background is see-through.
    Relief pictures have no cut-out, so they are fully solid.

The preparation follows Design A's own picture script: resize with LANCZOS, make greyscale and stretch the tones
(autocontrast, 1.5 per cent clipped at each end), optionally boost the local contrast (the picture plus an amount of
itself minus a blurred copy, then stretch again between the 1.5th and 99th percentiles), then apply a gamma.

Two kinds of picture are made:
  1. Sculpture pieces: every name in web/src/data/piece-shapes.json. The photograph is
     web/public/images/pieces/lit/<name>.jpg and its cut-out is the GREEN channel of <name>-m.png (white = the object;
     the red channel of that file is the piece's height and the blue channel its shadow map, which we do not use).
     The whole object is kept (no crop), 320 px wide. The tone stretch only looks at pixels inside the cut-out, so a
     bright or dark studio background cannot waste the tonal range.
  2. Reliefs shown by ReliefWindow (the home page's reliefs and the books' medallions): the original photograph
     web/public/images/<name>.jpg (or, if there is none, web/public/images/relit/<name>.jpg), uncropped, 360 px wide,
     fully solid. The Parthenon frieze cast gets a stronger local contrast and a gamma of 1.5, as in Design A.
     A relief whose cut-out is real (the grave stele) is treated as a piece instead, so its background is see-through.

Output: web/public/images/a/pieces/<name>.png, and index.json there, listing each picture's width, height and kind.

Run it again from the repository root whenever the pictures change:

    python3 web/scripts/prepare-engravings.py

Needs Python 3 with NumPy and Pillow.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

REPO = Path(__file__).resolve().parents[2]
IMAGES = REPO / "web" / "public" / "images"
LIT = IMAGES / "pieces" / "lit"
OUT = IMAGES / "a" / "pieces"
SHAPES = REPO / "web" / "src" / "data" / "piece-shapes.json"

PIECE_W = 320   # sculpture pieces: output width in pixels
RELIEF_W = 360  # reliefs: output width in pixels

# The relief pictures ReliefWindow shows (web/src/app/page.tsx names three; web/src/data/medallions.ts names the six
# for the books' medallions). Find them again with:  grep -rn "ReliefWindow" web/src
RELIEFS = [
    "great-eleusinian-relief", "parthenon-frieze-cast", "stele-woman-and-servant",
    "mask-of-agamemnon", "melian-relief", "pericles-bust", "socrates-louvre", "asklepios-epidaurus", "gerome-diogenes",
]

# Local contrast (blur radius in pixels, amount) and gamma. Everything uses 10, 1.0, 1.0 unless named here.
DEFAULT_LOOK = {"radius": 10, "amount": 1.0, "gamma": 1.0}
LOOKS = {"parthenon-frieze-cast": {"radius": 14, "amount": 1.6, "gamma": 1.5}}


def blur(a, radius):
    """Gaussian blur of a float picture, done in full precision (separable, edges mirrored)."""
    sigma = float(radius)
    half = max(1, int(sigma * 3))
    k = np.exp(-0.5 * (np.arange(-half, half + 1) / sigma) ** 2)
    k /= k.sum()
    out = a.astype(np.float32)
    for axis in (0, 1):
        pad = [(0, 0), (0, 0)]
        pad[axis] = (half, half)
        p = np.pad(out, pad, mode="reflect")
        acc = np.zeros_like(out)
        n = out.shape[axis]
        for i, w in enumerate(k):
            acc += w * (p[i:i + n, :] if axis == 0 else p[:, i:i + n])
        out = acc
    return out


def stretch_inside(g, m):
    """Autocontrast, clipping 1.5 per cent at each end, using only pixels inside the cut-out (m > 0.5)."""
    inside = g[m > 0.5]
    if inside.size < 50:
        inside = g.ravel()
    lo, hi = np.percentile(inside, 1.5), np.percentile(inside, 98.5)
    return np.clip((g - lo) / (hi - lo + 1e-6), 0, 1)


def blur_masked(g, m, radius):
    """Blur of g that only counts pixels inside the mask (a weighted blur: blur(g*m) / blur(m))."""
    num = blur(g * m, radius)
    den = blur(m, radius)
    return np.where(den > 0.02, num / np.maximum(den, 0.02), g)


def prepare(rgb, m, look):
    """rgb: PIL RGB picture already at its output size. m: float 0..1 cut-out (all ones when there is none).
    Returns the brightness as a float 0..1 array."""
    g = np.asarray(rgb.convert("L")).astype(np.float32) / 255
    if m is None:
        # the same call Design A uses
        g = np.asarray(ImageOps.autocontrast(rgb.convert("L"), cutoff=1.5)).astype(np.float32) / 255
        mm = np.ones_like(g)
    else:
        mm = m
        g = stretch_inside(g, mm)
    r, amt = look["radius"], look["amount"]
    if amt:  # bring out the carving and the drawing: local contrast against a wide blur, then stretch again
        bl = blur(g, r) if m is None else blur_masked(g, mm, r)
        g = np.clip(g + amt * (g - bl), 0, 1)
        inside = g[mm > 0.5] if m is not None else g.ravel()
        lo, hi = np.percentile(inside, 1.5), np.percentile(inside, 99)
        g = np.clip((g - lo) / (hi - lo + 1e-6), 0, 1)
    g = np.power(g, look["gamma"])
    if m is not None:
        # on the soft edge of the cut-out the photograph still shows some studio background, which would make a pale
        # halo round the object. So near and beyond the edge, carry the tones of the object's solid inside outwards.
        core = (mm > 0.9).astype(np.float32)
        near = blur_masked(g, core, 4)
        keep = np.clip((mm - 0.5) / 0.4, 0, 1)  # 0 at and beyond the half-way edge, 1 well inside
        g = g * keep + near * (1 - keep)
    return g


def save(name, g, alpha, kind, index):
    L = Image.fromarray((np.clip(g, 0, 1) * 255 + 0.5).astype(np.uint8))
    A = Image.fromarray((np.clip(alpha, 0, 1) * 255 + 0.5).astype(np.uint8))
    out = OUT / (name + ".png")
    Image.merge("LA", (L, A)).save(out, "PNG", optimize=True)
    index[name] = {"w": L.width, "h": L.height, "kind": kind}
    print(f"{name:28s} {L.width:4d} x {L.height:<4d} {kind:6s} {out.stat().st_size // 1024:4d} KB")


def make_piece(name, index):
    """A sculpture piece: the whole object from its lit photograph, with its cut-out as the alpha."""
    photo = Image.open(LIT / (name + ".jpg")).convert("RGB")
    mask_png = Image.open(LIT / (name + "-m.png"))
    green = mask_png.split()[1] if mask_png.mode == "RGB" else mask_png.convert("L")  # green = where the piece is
    h = round(PIECE_W * photo.height / photo.width)
    rgb = photo.resize((PIECE_W, h), Image.LANCZOS)
    cut = green.resize((PIECE_W, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1))  # soften the edge by about 1 px
    m = np.asarray(cut).astype(np.float32) / 255
    g = prepare(rgb, m, LOOKS.get(name, DEFAULT_LOOK))
    save(name, g, m, "piece", index)


def has_real_cutout(name):
    """True when the piece's cut-out is a real shape (not just 'everything is the piece')."""
    p = LIT / (name + "-m.png")
    if not p.exists():
        return False
    im = Image.open(p)
    green = np.asarray(im.split()[1] if im.mode == "RGB" else im.convert("L"))
    return green.min() < 250


def make_relief(name, index):
    """A relief picture: the original photograph, uncropped, fully solid."""
    src = IMAGES / (name + ".jpg")
    if not src.exists():
        src = IMAGES / "relit" / (name + ".jpg")
    photo = Image.open(src).convert("RGB")
    h = round(RELIEF_W * photo.height / photo.width)
    rgb = photo.resize((RELIEF_W, h), Image.LANCZOS)
    g = prepare(rgb, None, LOOKS.get(name, DEFAULT_LOOK))
    save(name, g, np.ones_like(g), "relief", index)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    pieces = list(json.loads(SHAPES.read_text()).keys())
    index = {}
    for name in pieces:
        if name in RELIEFS and not has_real_cutout(name):
            continue  # a relief with no cut-out: made below from its original photograph
        make_piece(name, index)
    for name in RELIEFS:
        if name in index:
            continue  # already made as a piece (it has a real cut-out)
        make_relief(name, index)
    (OUT / "index.json").write_text(json.dumps(index, indent=1) + "\n")
    total = sum(p.stat().st_size for p in OUT.glob("*.png"))
    print(f"\n{len(index)} pictures, {total // 1024} KB in {OUT.relative_to(REPO)}")


if __name__ == "__main__":
    sys.exit(main())
