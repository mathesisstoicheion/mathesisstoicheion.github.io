"""
Engrave every page's piece in gold lines, the way design A draws its objects (Gold and lamplight; the owner chose it on
2026-10-18): horizontal lines across the piece, each line thicker where the photograph is lighter, and nothing where the
piece is not (its cut-out). The result is only the lines, as an alpha mask; the site colours it (gold on Pompeian red in
the dark look, oxblood on pale gold in the light one) with CSS, so one file serves both looks.

Reads the pieces made by pipeline/pieces.py (web/public/images/pieces/lit/<id>.jpg and <id>-m.png: green = the cut-out,
blue = light reaching into hollows) and writes web/public/images/pieces/engraved/<id>.webp, plus web/src/data/engraved.json with
each engraving's size.

    python pipeline/engrave.py            # every piece
    python pipeline/engrave.py athena-head kouros
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), "..", "web")
SRC = os.path.join(ROOT, "public", "images", "pieces", "lit")
OUT = os.path.join(ROOT, "public", "images", "pieces", "engraved")
BOX = 1400        # the engraving's longer side, in pixels
LINES = 132       # lines across the longer side


def engrave(pid):
    rgb = Image.open(os.path.join(SRC, pid + ".jpg")).convert("RGB")
    maps = Image.open(os.path.join(SRC, pid + "-m.png")).convert("RGB").resize(rgb.size, Image.BILINEAR)
    m = np.asarray(maps).astype(np.float32) / 255
    cut, ao = m[..., 1], m[..., 2]
    # the piece alone, with a little room round it
    ys, xs = np.where(cut > 0.5)
    if not len(ys):
        return None
    h0, w0 = cut.shape
    pad = int(0.03 * max(h0, w0))
    y0, y1 = max(0, ys.min() - pad), min(h0, ys.max() + pad + 1)
    x0, x1 = max(0, xs.min() - pad), min(w0, xs.max() + pad + 1)
    g = np.asarray(rgb.convert("L")).astype(np.float32)[y0:y1, x0:x1] / 255
    cut, ao = cut[y0:y1, x0:x1], ao[y0:y1, x0:x1]
    H, W = g.shape
    k = BOX / max(H, W)
    H2, W2 = round(H * k), round(W * k)
    rs = lambda a, mode=Image.BILINEAR: np.asarray(Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).resize((W2, H2), mode)).astype(np.float32) / 255
    g, cut, ao = rs(g, Image.LANCZOS), rs(cut), rs(ao)
    # tones: stretched over the piece alone, then the carving brought out against a wide blur, the hollows darkened
    inside = g[cut > 0.5]
    lo, hi = np.percentile(inside, 2), np.percentile(inside, 98.5)
    g = np.clip((g - lo) / (hi - lo + 1e-6), 0, 1)
    blur = np.asarray(Image.fromarray((g * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(max(H2, W2) * 0.012))).astype(np.float32) / 255
    g = np.clip(g + 0.9 * (g - blur), 0, 1)
    g = g * (0.55 + 0.45 * ao)
    inside = g[cut > 0.5]
    lo, hi = np.percentile(inside, 1.5), np.percentile(inside, 99)
    g = np.clip((g - lo) / (hi - lo + 1e-6), 0, 1) ** 1.15
    # the lines: one every `gap` pixels; at each column a line is as thick as the light there, and thins to nothing
    # at the cut-out's edge
    gap = max(H2, W2) / LINES
    alpha = np.zeros((H2, W2), np.float32)
    yy = np.arange(H2, dtype=np.float32)
    for i in range(int(H2 / gap) + 1):
        yc = (i + 0.5) * gap
        r = min(H2 - 1, int(yc))
        th = (0.07 + 0.86 * g[r]) * gap * 0.92 * np.clip(cut[r] * 1.4 - 0.2, 0, 1)
        a0, a1 = max(0, int(yc - gap / 2)), min(H2, int(yc + gap / 2) + 1)
        d = np.abs(yy[a0:a1, None] - yc)
        alpha[a0:a1] = np.maximum(alpha[a0:a1], np.clip(th[None, :] / 2 - d + 0.5, 0, 1) * np.clip(th[None, :], 0, 1))
    out = np.zeros((H2, W2, 4), np.uint8)
    out[..., :3] = 255
    out[..., 3] = (alpha * 255).astype(np.uint8)
    os.makedirs(OUT, exist_ok=True)
    Image.fromarray(out, "RGBA").save(os.path.join(OUT, pid + ".webp"), lossless=True, method=6)
    return {"w": W2, "h": H2}


def main():
    ids = sys.argv[1:] or sorted(f[:-4] for f in os.listdir(SRC) if f.endswith(".jpg"))
    meta_path = os.path.join(ROOT, "src", "data", "engraved.json")
    meta = json.load(open(meta_path)) if os.path.exists(meta_path) else {}
    for pid in ids:
        r = engrave(pid)
        if r:
            meta[pid] = r
            print(pid, r, os.path.getsize(os.path.join(OUT, pid + ".webp")) // 1024, "KB")
    json.dump(dict(sorted(meta.items())), open(meta_path, "w"), indent=0)


if __name__ == "__main__":
    main()
