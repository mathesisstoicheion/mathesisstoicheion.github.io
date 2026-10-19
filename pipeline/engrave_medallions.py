"""
The library's famous-book stelai in gold lines (Gold and lamplight): each stele's round picture (data/medallions.ts; the
pictures and their credits are those of data/images.json) engraved the way pipeline/engrave.py engraves the pieces:
horizontal lines, each thicker where the photograph is lighter, inside a circle. Only the lines are kept, as an alpha
mask; the site colours them with CSS (gold in the dark look, oxblood in the light one).

Reads web/public/images/w640/<pic>.jpg and writes web/public/images/medallions/engraved/<pic>.webp.

    python pipeline/engrave_medallions.py mask-of-agamemnon socrates-louvre ...
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), "..", "web")
SRC = os.path.join(ROOT, "public", "images", "w640")
OUT = os.path.join(ROOT, "public", "images", "medallions", "engraved")
SIZE = 520     # the medallion's side, in pixels
LINES = 64     # lines across it


def engrave(pic):
    im = Image.open(os.path.join(SRC, pic + ".jpg")).convert("L")
    w, h = im.size
    s = min(w, h)
    # the square at the picture's centre (faces sit a little high, so lean upwards when the picture is tall)
    top = max(0, min(h - s, int((h - s) * 0.3)))
    im = im.crop(((w - s) // 2, top, (w - s) // 2 + s, top + s)).resize((SIZE, SIZE), Image.LANCZOS)
    g = np.asarray(im).astype(np.float32) / 255
    blur = np.asarray(im.filter(ImageFilter.GaussianBlur(SIZE * 0.02))).astype(np.float32) / 255
    # a plain backdrop (a museum photograph's paper or wall: smooth, with no detail in it) is left dark, so the object
    # stands out of it
    raw = g.copy()
    edge = np.abs(raw - np.asarray(im.filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255)
    detail = np.asarray(Image.fromarray((edge * 255 * 8).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))).astype(np.float32) / 255
    backdrop = np.clip(1 - detail * 5, 0, 1)
    g = np.clip(g + 1.1 * (g - blur), 0, 1)
    lo, hi = np.percentile(g, 2), np.percentile(g, 99.5)
    g = np.clip((g - lo) / (hi - lo + 1e-6), 0, 1) ** 1.7
    g = g * (1 - 0.85 * backdrop)
    yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
    r = np.hypot(xx - SIZE / 2 + 0.5, yy - SIZE / 2 + 0.5) / (SIZE / 2)
    inside = np.clip((0.97 - r) * 30, 0, 1)
    gap = SIZE / LINES
    alpha = np.zeros((SIZE, SIZE), np.float32)
    ys = np.arange(SIZE, dtype=np.float32)
    for i in range(LINES):
        yc = (i + 0.5) * gap
        row = min(SIZE - 1, int(yc))
        th = (0.06 + 0.8 * g[row]) * gap * 0.92 * inside[row]
        a0, a1 = max(0, int(yc - gap / 2)), min(SIZE, int(yc + gap / 2) + 1)
        d = np.abs(ys[a0:a1, None] - yc)
        alpha[a0:a1] = np.maximum(alpha[a0:a1], np.clip(th[None, :] / 2 - d + 0.5, 0, 1) * np.clip(th[None, :], 0, 1))
    # a fine ring round the medallion
    alpha = np.maximum(alpha, np.clip(1 - np.abs(r - 0.99) * SIZE / 2 / 1.2, 0, 1))
    out = np.zeros((SIZE, SIZE, 4), np.uint8)
    out[..., :3] = 255
    out[..., 3] = (alpha * 255).astype(np.uint8)
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, pic + ".webp")
    Image.fromarray(out, "RGBA").save(path, lossless=True, method=6)
    print(pic, os.path.getsize(path) // 1024, "KB")


if __name__ == "__main__":
    for p in sys.argv[1:]:
        engrave(p)
