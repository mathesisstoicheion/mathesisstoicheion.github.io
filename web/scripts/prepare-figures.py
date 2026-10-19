#!/usr/bin/env python3
"""
Prepares the faces and objects the letter figures are drawn from (lib/a/lamplight.js, the stages; data/figures.ts).
Each is a small greyscale JPEG on black, like design A's own picture of Socrates (public/images/a/soc.jpg): the head cut
out of its photograph, its tones stretched inside the cut-out (autocontrast, 1.5 per cent clipped), the background black.
The engine reads only the brightness, so where it is black no letter is lit.

Sources, all already on the site with their credits:
  * the Met's sculptures: web/public/images/pieces/lit/<name>.jpg with its cut-out in the GREEN channel of <name>-m.png
    (as scripts/prepare-engravings.py reads them);
  * Pericles: web/public/images/pericles-bust.jpg (British Museum, photograph by Marie-Lan Nguyen, CC BY 2.5), with the
    cut-out in pipeline/figures/pericles-bust-mask.png (made once with OpenCV's GrabCut, white = the bust);
  * the owl coin: design A's own picture of it, web/public/images/a/coin.png (a silver tetradrachm of Athens, the Met,
    2021.40.80, CC0), set on black.

    python3 web/scripts/prepare-figures.py      (from the repository root; needs Pillow and NumPy)

Output: web/public/images/a/fig-<name>.jpg
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
IMG = ROOT / "web" / "public" / "images"
OUT = IMG / "a"

# name: (photograph, cut-out, crop of the cut-out's bounding box as fractions x0, y0, x1, y1, output width)
FIGS = {
    "philosopher-head": ("pieces/lit/philosopher-head.jpg", "pieces/lit/philosopher-head-m.png", (0, 0, 1, 1), 230),
    "chrysippos-head": ("pieces/lit/chrysippos-head.jpg", "pieces/lit/chrysippos-head-m.png", (0, 0, 1, 1), 230),
    "athena-head": ("pieces/lit/athena-head.jpg", "pieces/lit/athena-head-m.png", (0, 0, 1, 1), 230),
    # the head of Apollo carries a fragment of his hand on top; the figure starts below it
    "apollo-head": ("pieces/lit/apollo-head.jpg", "pieces/lit/apollo-head-m.png", (0, .2, 1, 1), 230),
    # the bust down to the beard, as design A's Socrates is cropped
    "pericles-bust": ("pericles-bust.jpg", "../../../pipeline/figures/pericles-bust-mask.png", (.04, 0, .96, .64), 230),
}


def cutout(name, photo, mask_file, crop, width):
    im = Image.open(IMG / photo).convert("L")
    m = Image.open(IMG / mask_file)
    m = (m.split()[1] if m.mode in ("RGB", "RGBA") else m.convert("L")).resize(im.size, Image.BILINEAR)
    box = m.point(lambda v: 255 if v > 127 else 0).getbbox()
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    c = (round(x0 + crop[0] * bw), round(y0 + crop[1] * bh), round(x0 + crop[2] * bw), round(y0 + crop[3] * bh))
    im, m = im.crop(c), m.crop(c)
    h = round(width * im.height / im.width)
    im, m = im.resize((width, h), Image.LANCZOS), m.resize((width, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.8))
    g = np.asarray(im).astype(np.float32)
    a = np.asarray(m).astype(np.float32) / 255
    inside = g[a > 0.5]
    lo, hi = np.percentile(inside, 1.5), np.percentile(inside, 98.5)
    g = np.clip((g - lo) / max(1, hi - lo), 0, 1) * a
    Image.fromarray((g * 255).astype(np.uint8)).save(OUT / f"fig-{name}.jpg", quality=92)
    print(f"fig-{name}.jpg {width}x{h}")


def coin():
    # design A's own preparation of the same Met coin (public/images/a/coin.png, see components/a/pictures.ts), on black
    im = Image.open(OUT / "coin.png")
    g = Image.new("L", im.size, 0)
    g.paste(im.convert("L"), mask=im.split()[-1])
    g.save(OUT / "fig-owl-coin.jpg", quality=92)
    print(f"fig-owl-coin.jpg {g.width}x{g.height}")


if __name__ == "__main__":
    for name, (photo, mask, crop, width) in FIGS.items():
        cutout(name, photo, mask, crop, width)
    coin()
