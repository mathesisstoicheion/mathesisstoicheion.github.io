"""
Prepares each page's sculpture for the torch (DESIGN.md, "A piece on every page"; web/src/lib/art/piece.ts draws them).
From one licensed photograph it makes two files in web/public/images/pieces/lit/:

  <id>.jpg     the piece's own colour, cropped to it, with most of the studio's lighting taken out (so the torch can
               put its own light on it) and the background replaced by the piece's edge colours
  <id>-m.png   three maps at half that size: red = the piece's shape (how far it stands out, 0 to 1), green = where the
               piece is (its cut-out), blue = how much light reaches into its hollows (ambient occlusion)

The shape is guessed from the outline: a statue or head is "blown up" from its silhouette (a smooth dome over it, solved
as a Poisson equation, the way a soap film bulges), a vase is turned on a wheel row by row, a stele or coin is a slab with
rounded edges, and a relief is read from its brightness (bright = raised). Fine detail is added by the page, from the
picture itself. The cut-out comes from a salient-object model (rembg, ISNet), or else from modelling the studio
background from the picture's border and refining it with GrabCut (OpenCV). Credits are those of the originals (web/src/data/piece-images.json, web/src/data/images.json).

Settings for each piece are in pipeline/pieces.json; each piece's size, shape and material are written to
web/src/data/piece-shapes.json for the page. Needs Pillow, NumPy, SciPy and opencv-python-headless,
and rembg with onnxruntime for the best cut-outs.

    python pipeline/pieces.py [id ...]       # all, or only these
    python pipeline/pieces.py --sheet DIR    # also writes a contact sheet of every cut-out and shape to DIR
"""
import json
import os
import sys

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.sparse import coo_matrix
from scipy.sparse.linalg import spsolve

HERE = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(HERE, "..", "web")
OUT = os.path.join(WEB, "public", "images", "pieces", "lit")
LONG = 1200          # the colour picture's longer side
MAPS = 0.5           # the maps' size, as a share of the colour picture's


def lum(rgb):
    return rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722


def gauss(a, s):
    return cv2.GaussianBlur(a, (0, 0), s, borderType=cv2.BORDER_REFLECT)


def norm_blur(a, m, s):
    """a blurred inside the mask only (the background does not bleed in)"""
    return gauss(a * m, s) / np.maximum(gauss(m, s), 1e-4)


# ---------------------------------------------------------------------------------------------------------- cut-out
def background_model(rgb, band):
    """The studio background as a smooth (quadratic) colour field fitted to the picture's border, ignoring the parts of
    the border the piece itself touches (they differ most from the rest)."""
    h, w, _ = rgb.shape
    yy, xx = np.mgrid[0:h, 0:w]
    edge = np.zeros((h, w), bool)
    edge[:band], edge[-band:], edge[:, :band], edge[:, -band:] = True, True, True, True
    X = np.stack([np.ones(h * w), xx.ravel() / w, yy.ravel() / h, (xx.ravel() / w) ** 2, (yy.ravel() / h) ** 2,
                  xx.ravel() * yy.ravel() / (w * h)], 1)
    P = rgb.reshape(-1, 3)
    use = edge.ravel().copy()
    for _ in range(4):
        coef, *_ = np.linalg.lstsq(X[use], P[use], rcond=None)
        res = np.linalg.norm(P - X @ coef, axis=1)
        cut = np.percentile(res[use], 70) * 2.2 + 0.01
        use = edge.ravel() & (res < cut)
    return (X @ coef).reshape(h, w, 3)


_SESSION = None


def cutout(rgb, s):
    """The piece's mask (0 to 1, feathered) on the working picture: from a salient-object model (rembg's ISNet, run on
    this computer; its weights are fetched once from the rembg project on GitHub), cleaned of specks and pinholes. Where
    rembg is not installed, or a piece says "mask": "studio", the studio background is modelled instead (below)."""
    global _SESSION
    h, w, _ = rgb.shape
    if s.get("mask") == "none":
        return np.ones((h, w), np.float32)
    if s.get("mask") != "studio":
        try:
            from rembg import new_session, remove
        except ImportError:
            remove = None
        if remove:
            if _SESSION is None:
                _SESSION = new_session("isnet-general-use")
            img = Image.fromarray(np.clip(rgb * 255, 0, 255).astype(np.uint8))
            a = np.asarray(remove(img, session=_SESSION, only_mask=True), np.float32) / 255
            hard = a > 0.5
            lab, n = ndimage.label(hard)
            if n:
                sizes = ndimage.sum(hard, lab, range(1, n + 1))
                keep = np.isin(lab, [i + 1 for i, v in enumerate(sizes) if v > sizes.max() * s.get("keep", 0.05)])
                # pinholes inside the piece are filled; real gaps (between an arm and the body) are larger and stay
                holes = ndimage.binary_fill_holes(keep) & ~keep
                hl, hn = ndimage.label(holes)
                if hn:
                    hs = ndimage.sum(holes, hl, range(1, hn + 1))
                    keep |= np.isin(hl, [i + 1 for i, v in enumerate(hs) if v < keep.sum() * 0.002])
                # a slab is solid stone: whatever it encloses is stone in shadow, not a gap
                if s.get("form") in ("slab", "relief", "coin") or s.get("solid"):
                    keep = ndimage.binary_fill_holes(keep)
                # where the model has taken a stone's flat ground for background ("hull": the stone's outline is convex)
                if s.get("hull"):
                    pts = cv2.findNonZero(keep.astype(np.uint8))
                    hullm = np.zeros(keep.shape, np.uint8)
                    cv2.fillConvexPoly(hullm, cv2.convexHull(pts), 1)
                    keep = hullm.astype(bool)
                a = np.where(keep, np.maximum(a, 0.5), np.minimum(a, 0.49) * ndimage.binary_dilation(keep, iterations=3))
            return np.clip(gauss(a, 0.6), 0, 1)
    return studio_cutout(rgb, s)


def studio_cutout(rgb, s):
    """The cut-out found by modelling the studio background from the picture's border, refined with GrabCut."""
    h, w, _ = rgb.shape
    band = max(4, int(min(h, w) * 0.03))
    bg = background_model(rgb, band)
    d = np.linalg.norm(rgb - bg, axis=2)
    d = gauss(d, 1.2)
    t = s.get("thresh", float(np.percentile(d[:band].ravel(), 99)) * 1.6 + 0.035)
    fg = d > t
    if s.get("dark"):          # a dark piece on a light ground, or the other way round: brightness helps too
        fg |= np.abs(lum(rgb) - lum(bg)) > t
    fg = ndimage.binary_opening(fg, iterations=1)
    lab, n = ndimage.label(fg)
    if n == 0:
        raise SystemExit("no piece found: try a lower thresh")
    sizes = ndimage.sum(fg, lab, range(1, n + 1))
    keep = [i + 1 for i, v in enumerate(sizes) if v > sizes.max() * s.get("keep", 0.12)]
    fg = np.isin(lab, keep)
    fg = ndimage.binary_fill_holes(fg)
    # GrabCut: sure background at the border (where the piece does not reach), sure piece in its eroded core
    gc = np.full((h, w), cv2.GC_PR_BGD, np.uint8)
    gc[fg] = cv2.GC_PR_FGD
    gc[ndimage.binary_erosion(fg, iterations=max(3, int(min(h, w) * 0.02)))] = cv2.GC_FGD
    far = ~ndimage.binary_dilation(fg, iterations=max(4, int(min(h, w) * 0.03)))
    gc[far] = cv2.GC_BGD
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    img8 = np.clip(rgb * 255, 0, 255).astype(np.uint8)[..., ::-1].copy()
    cv2.grabCut(img8, gc, None, bgd, fgd, 4, cv2.GC_INIT_WITH_MASK)
    m = (gc == cv2.GC_FGD) | (gc == cv2.GC_PR_FGD)
    lab, n = ndimage.label(m)
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        m = np.isin(lab, [i + 1 for i, v in enumerate(sizes) if v > sizes.max() * s.get("keep", 0.12)])
    m = ndimage.binary_fill_holes(m)
    m = ndimage.binary_closing(m, iterations=2)
    m = ndimage.binary_opening(m, iterations=1)
    # a soft edge about a pixel wide (the page's light rounds it further)
    return np.clip(gauss(m.astype(np.float32), 0.9), 0, 1)


# ---------------------------------------------------------------------------------------------------------- shapes
def poisson_dome(m):
    """Solves  laplacian(u) = -1  inside the mask with u = 0 on its edge; the square root of u is a rounded dome whose
    cross-sections are close to circles (a statue's limbs come out rounder than its flat ground)."""
    inside = m > 0.5
    idx = -np.ones(m.shape, np.int64)
    idx[inside] = np.arange(inside.sum())
    ys, xs = np.nonzero(inside)
    n = len(ys)
    rows, cols, vals = [np.arange(n)], [np.arange(n)], [np.full(n, 4.0)]
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        yy, xx = ys + dy, xs + dx
        ok = (yy >= 0) & (yy < m.shape[0]) & (xx >= 0) & (xx < m.shape[1])
        nb = np.full(n, -1)
        nb[ok] = idx[yy[ok], xx[ok]]
        good = nb >= 0
        rows.append(np.arange(n)[good]); cols.append(nb[good]); vals.append(np.full(good.sum(), -1.0))
    A = coo_matrix((np.concatenate(vals), (np.concatenate(rows), np.concatenate(cols))), shape=(n, n)).tocsr()
    u = np.zeros(m.shape)
    u[inside] = spsolve(A, np.ones(n))
    return np.sqrt(u / max(u.max(), 1e-9))


def shape_of(form, m, L, s):
    """The piece's shape, 0 to 1, on the maps' grid (m: mask, L: flattened brightness)."""
    h, w = m.shape
    inside = m > 0.5
    k = min(h, w)
    if form == "relief":
        g = gauss(L, max(1.2, k / 170))
        lo, hi = np.percentile(g, [1, 99.5])
        r = np.clip((g - lo) / (hi - lo + 1e-6), 0, 1) ** s.get("gamma", 1.0)
        return r * m
    # broad shape
    if form == "lathe":
        r = np.zeros((h, w))
        for y in range(h):
            row = inside[y]
            if not row.any():
                continue
            lab, n = ndimage.label(row)
            for i in range(1, n + 1):
                xs = np.nonzero(lab == i)[0]
                c, rad = (xs[0] + xs[-1]) / 2, (xs[-1] - xs[0]) / 2 + 0.5
                r[y, xs] = np.sqrt(np.maximum(0, rad ** 2 - (xs - c) ** 2)) / max(rad, 1)
        # rows differ in width: scale each by its radius, so the belly stands out more than the neck
        widths = np.array([inside[y].sum() for y in range(h)], float)
        r *= np.sqrt(widths / max(widths.max(), 1))[:, None]
        base = gauss(r, 1.0)
    elif form in ("slab", "coin"):
        dt = ndimage.distance_transform_edt(inside)
        bevel = max(2.0, k * s.get("bevel", 0.035))
        base = np.sqrt(np.clip(dt / bevel, 0, 1))
        if form == "coin":
            base = base * 0.6 + 0.4 * poisson_dome(gauss(m, 1.0)) * inside
    else:  # "round": statues, heads, figurines
        small = cv2.resize(m, (max(8, w // 3), max(8, h // 3)), interpolation=cv2.INTER_AREA)
        dome = poisson_dome(small)
        base = cv2.resize(dome, (w, h), interpolation=cv2.INTER_CUBIC)
        base = np.clip(base, 0, 1) * inside
    # middle-sized detail from the picture (folds of drapery, curls, the carving on a slab): bright reads as raised
    band = norm_blur(L, m, max(1.0, k / 300)) - norm_blur(L, m, max(3.0, k / 28))
    lo, hi = np.percentile(band[inside], [2, 98]) if inside.any() else (0, 1)
    band = np.clip(band / (max(abs(lo), abs(hi)) + 1e-6), -1, 1)
    detail = s.get("detail", 0.55 if form in ("slab", "coin") else 0.22)
    r = (base * (1 - detail * 0.5) + band * detail * 0.5 + (0.5 * detail if form in ("slab", "coin") else 0)) * inside
    r = np.clip(gauss(r, 0.7), 0, 1)
    return r / max(r.max(), 1e-6) * m


def occlusion(H, k):
    """How much light reaches into each hollow: the scene's height compared with its surroundings at three scales."""
    ao = np.zeros_like(H)
    for s, wgt in ((k / 120, 0.5), (k / 40, 0.35), (k / 14, 0.25)):
        ao += np.clip(gauss(H, max(1.0, s)) - H, 0, None) * wgt / max(s, 1) * k * 0.012
    return np.clip(1 - ao * 3.2, 0.25, 1)


# ---------------------------------------------------------------------------------------------------------- colour
def flatten(rgb, m, s):
    """Takes most of the studio's broad lighting out of the picture (the torch will light it instead), keeps its fine
    shading (which carries the carving), and stretches its contrast inside the piece."""
    L = lum(rgb)
    k = min(m.shape)
    broad = norm_blur(L, m, k * s.get("broad", 0.06))
    inside = m > 0.5
    mean = float(np.average(L, weights=m + 1e-6))
    f = s.get("flat", 0.65)
    gain = (mean / np.maximum(broad, 0.04)) ** f
    out = rgb * gain[..., None]
    lo, hi = np.percentile(lum(out)[inside], [0.5, 99.6]) if inside.any() else (0, 1)
    out = np.clip((out - lo) / (hi - lo + 1e-6), 0, 1)
    sat = s.get("sat", 1.0)
    if sat != 1.0:
        g = lum(out)[..., None]
        out = np.clip(g + (out - g) * sat, 0, 1)
    return out


def bleed(rgb, m):
    """Fills the background with the colour of the nearest part of the piece, so its soft edge never picks up the
    studio's grey or black when the picture is scaled."""
    inside = m > 0.5
    if inside.all():
        return rgb
    _, (iy, ix) = ndimage.distance_transform_edt(~inside, return_indices=True)
    fill = rgb[iy, ix]
    fill = gauss(fill, 2.0)
    a = np.clip(m * 1.6, 0, 1)[..., None]
    return rgb * a + fill * (1 - a)


# ---------------------------------------------------------------------------------------------------------- one piece
def unmount(m, s):
    """Takes away a museum's modern mount where the photo shows one, measured on the piece's own height from its top:
    "cut": y clears everything below that line (a block or a pin under a head); "trim": [y, w] clears, below y, whatever
    is narrower than w of the piece's width (a thin rod standing beside a leg)."""
    if "cut" not in s and "trim" not in s:
        return m
    ys, xs = np.nonzero(m > 0.5)
    y0, y1 = ys.min(), ys.max()
    m = m.copy()
    if "cut" in s:
        yc = int(y0 + (y1 - y0) * s["cut"])
        m[yc:] = 0
        m[max(0, yc - 3):yc] *= np.linspace(1, 0.4, min(3, yc))[:, None]
    if "trim" in s:
        y, w = s["trim"]
        yc = int(y0 + (y1 - y0) * y)
        k = max(3, int((xs.max() - xs.min()) * w))
        below = m[yc:] > 0.5
        opened = cv2.morphologyEx(below.astype(np.uint8), cv2.MORPH_OPEN, np.ones((1, k), np.uint8)).astype(bool)
        m[yc:] = np.where(opened, m[yc:], np.minimum(m[yc:], 0.0))
    return np.clip(gauss(m, 0.6), 0, 1)


def make(s, sheet=None):
    pid = s["id"]
    src = os.path.join(WEB, s["src"]) if not os.path.isabs(s["src"]) else s["src"]
    im = Image.open(src).convert("RGB")
    W0, H0 = im.size
    if "crop" in s:
        x0, y0, x1, y1 = s["crop"]
        im = im.crop((int(x0 * W0), int(y0 * H0), int(x1 * W0), int(y1 * H0)))
    # the cut-out is found on a working copy about 900 px long
    sc = 900 / max(im.size)
    work = np.asarray(im.resize((max(8, round(im.width * sc)), max(8, round(im.height * sc))), Image.LANCZOS),
                      np.float32) / 255
    mw = cutout(work, s)
    form = s.get("form", "round")
    mw = unmount(mw, s)
    # stone the model missed, given as boxes on the picture ([x0, y0, x1, y1], fractions of its width and height)
    for x0, y0, x1, y1 in s.get("add", []):
        hh, ww = mw.shape
        mw[int(y0 * hh):int(y1 * hh), int(x0 * ww):int(x1 * ww)] = 1
    # crop to the piece, with a margin
    ys, xs = np.nonzero(mw > 0.5)
    pad = s.get("pad", 0.04)
    hh, ww = mw.shape
    if s.get("mask") == "none":
        bx0, by0, bx1, by1 = 0, 0, ww, hh
    else:
        py, px = int((ys.max() - ys.min()) * pad) + 2, int((xs.max() - xs.min()) * pad) + 2
        bx0, by0 = max(0, xs.min() - px), max(0, ys.min() - py)
        bx1, by1 = min(ww, xs.max() + px + 1), min(hh, ys.max() + py + 1)
    fx0, fy0, fx1, fy1 = bx0 / ww, by0 / hh, bx1 / ww, by1 / hh
    full = im.crop((int(fx0 * im.width), int(fy0 * im.height), int(fx1 * im.width), int(fy1 * im.height)))
    k = min(1.0, LONG / max(full.size))
    out_w, out_h = max(8, round(full.width * k)), max(8, round(full.height * k))
    rgb = np.asarray(full.resize((out_w, out_h), Image.LANCZOS), np.float32) / 255
    m = cv2.resize(mw[by0:by1, bx0:bx1], (out_w, out_h), interpolation=cv2.INTER_LINEAR)
    m = np.clip((m - 0.5) * 1.15 + 0.5, 0, 1)
    alb = bleed(flatten(rgb, m, s), m)
    # the maps, at half size
    mw2, mh2 = max(8, round(out_w * MAPS)), max(8, round(out_h * MAPS))
    m2 = cv2.resize(m, (mw2, mh2), interpolation=cv2.INTER_AREA)
    L2 = cv2.resize(lum(alb), (mw2, mh2), interpolation=cv2.INTER_AREA)
    r = shape_of(form, m2, L2, s)
    stand = 0.0 if form == "relief" else 0.35
    H = m2 * stand + r * (1 - stand)
    ao = occlusion(H, min(mw2, mh2))
    os.makedirs(OUT, exist_ok=True)
    Image.fromarray(np.clip(alb * 255 + 0.5, 0, 255).astype(np.uint8)).save(
        os.path.join(OUT, pid + ".jpg"), "JPEG", quality=s.get("q", 84), optimize=True, progressive=True,
        subsampling=0)
    # a little noise before rounding to 8 bits, so smooth slopes do not show steps
    rng = np.random.default_rng(7)
    dith = lambda a: np.clip(a * 255 + rng.uniform(-0.5, 0.5, a.shape), 0, 255).round().astype(np.uint8)
    maps = np.stack([dith(r), dith(m2), dith(ao)], 2)
    Image.fromarray(maps).save(os.path.join(OUT, pid + "-m.png"), optimize=True)
    kb = lambda p: os.path.getsize(os.path.join(OUT, p)) // 1024
    print(f"{pid}: {out_w}x{out_h} {form}  colour {kb(pid + '.jpg')} KB, maps {kb(pid + '-m.png')} KB")
    if sheet is not None:
        t = 300
        def fit(a):
            a = np.clip(a * 255, 0, 255).astype(np.uint8)
            im2 = Image.fromarray(a)
            return im2.resize((max(1, round(im2.width * t / im2.height)), t))
        row = [fit(rgb), fit(alb * m[..., None]), fit(np.repeat(r[..., None], 3, 2)), fit(np.repeat(ao[..., None], 3, 2))]
        sheet.append((pid, row))
    return {"id": pid, "w": out_w, "h": out_h, "form": form, "material": s.get("material", "marble")}


def main(argv):
    with open(os.path.join(HERE, "pieces.json"), encoding="utf-8") as f:
        conf = json.load(f)
    sheet_dir = None
    if "--sheet" in argv:
        i = argv.index("--sheet"); sheet_dir = argv[i + 1]; argv = argv[:i] + argv[i + 2:]
    want = set(argv)
    sheet = [] if sheet_dir else None
    shapes_path = os.path.join(WEB, "src", "data", "piece-shapes.json")
    shapes = json.load(open(shapes_path, encoding="utf-8")) if os.path.exists(shapes_path) else {}
    for s in conf:
        if want and s["id"] not in want:
            continue
        r = make(s, sheet)
        shapes[r.pop("id")] = r
    # what the page needs to lay each piece out before its pictures arrive (its size, its shape, its material)
    ids = [s["id"] for s in conf]
    shapes = {k: shapes[k] for k in ids if k in shapes}
    with open(shapes_path, "w", encoding="utf-8") as f:
        json.dump(shapes, f, indent=1)
        f.write("\n")
    if sheet:
        from PIL import ImageDraw
        os.makedirs(sheet_dir, exist_ok=True)
        for pid, row in sheet:
            W = sum(i.width for i in row) + 10 * len(row)
            c = Image.new("RGB", (W, 320), (40, 30, 24))
            x = 0
            for i in row:
                c.paste(i, (x, 20)); x += i.width + 10
            ImageDraw.Draw(c).text((4, 4), pid, fill=(255, 220, 160))
            c.save(os.path.join(sheet_dir, pid + ".jpg"), quality=85)


if __name__ == "__main__":
    main(sys.argv[1:])
