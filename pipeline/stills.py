"""
The still picture of each page's piece (PAGE-RULES.md, rule 7, the owner's choice, 2026-10-18: "A faint still picture of the
statue shows at once, then the lit statue draws in its place"). Made from the two pictures pipeline/pieces.py writes for the
lit piece: its colour (lit/<id>.jpg) and its maps (lit/<id>-m.png: R shape, G cut-out, B shading in the hollows). The still is
the colour, shaded by the hollows and dimmed as if by a low lamp, cut out by the G channel, small: lit/<id>-s.webp.

Run from the repository's root:  python3 pipeline/stills.py
"""
from pathlib import Path
import numpy as np
from PIL import Image

LIT = Path("web/public/images/pieces/lit")
HEIGHT = 420          # css px tall in the biggest window it fills, roughly; the lit piece replaces it in a moment

def still(alb: Path) -> Path:
    m = Image.open(alb.with_name(alb.stem + "-m.png")).convert("RGB")
    c = Image.open(alb).convert("RGB").resize(m.size, Image.LANCZOS)
    k = HEIGHT / m.height
    size = (max(1, round(m.width * k)), HEIGHT) if k < 1 else m.size
    c, m = c.resize(size, Image.LANCZOS), m.resize(size, Image.LANCZOS)
    a = np.asarray(c, dtype=np.float32) / 255
    mp = np.asarray(m, dtype=np.float32) / 255
    ao = 0.45 + 0.55 * mp[..., 2:3]
    # a low lamp from the upper left: darker towards the lower right, and dim overall
    h, w = mp.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    lamp = 0.62 - 0.22 * ((xx / w) * 0.4 + (yy / h) * 0.6)
    rgb = np.clip(a * ao * lamp[..., None], 0, 1)
    out = np.dstack([rgb, mp[..., 1:2]])
    path = alb.with_name(alb.stem + "-s.webp")
    Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA").save(path, "WEBP", quality=62, method=6)
    return path

if __name__ == "__main__":
    total = 0
    for alb in sorted(LIT.glob("*.jpg")):
        p = still(alb)
        total += p.stat().st_size
    print(f"{len(list(LIT.glob('*-s.webp')))} stills, {total / 1024:.0f} KB in all")
