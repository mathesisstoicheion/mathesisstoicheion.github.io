"""
Build the Periplus map's picture of the land and sea (web/public/data/relief/): NASA's Blue Marble: Next
Generation with topography and bathymetry, July 2004 (Reto Stöckli, NASA Earth Observatory; public domain),
the real colours of the land in summer, the mountains shaded, the sea darker where it is deeper.

The two 90-degree squares that hold the map (B1, west of Greenwich; C1, east of it; 240 pixels to a degree)
are cut to the map's own box (base.json's bbox), put into its projection (equirectangular, squeezed
east-west by the cosine of 38°N, as lib/map.ts does) and cut into a pyramid of 512-pixel WebP tiles:

  relief/meta.json          the levels: pixels per map unit, columns and rows of tiles, the full size
  relief/<z>/<col>_<row>.webp

Level 5 keeps the imagery's own sharpness (2.4 pixels per map unit, a map unit being a hundredth of a degree
of latitude); each level below halves it, down to level 0, one tile for the whole map. The tiles (about 8 MB)
are committed with the site, like the rest of public/data/map.

Needs network access the first time (about 160 MB, cached in pipeline/.cache/relief).

Usage:  python pipeline/build_relief.py
"""
import json
import math
import urllib.request
from pathlib import Path

from PIL import Image, ImageEnhance

Image.MAX_IMAGE_PIXELS = None
ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "pipeline" / ".cache" / "relief"
BASE = ROOT / "web" / "public" / "data" / "map" / "base.json"
OUT = ROOT / "web" / "public" / "data" / "relief"

SOURCE = "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73751/world.topo.bathy.200407.3x21600x21600.{}.jpg"
# the two squares: name, west edge, north edge (each 90 degrees across, 240 pixels to a degree; NASA letters
# the columns A to D from 180°W, so B1 is 90°W to 0°, C1 is 0° to 90°E)
SQUARES = [("B1", -90.0, 90.0), ("C1", 0.0, 90.0)]
PPD = 240
COS = math.cos(math.radians(38))
SCALE = 100            # map units to a degree of latitude (lib/map.ts)
PX_PER_UNIT = 2.4      # the finest level: the imagery's own 240 pixels to a degree of latitude
TILE = 512
QUALITY = 80


def fetch(name: str) -> Path:
    path = CACHE / f"world.topo.bathy.200407.{name}.jpg"
    if not path.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        print("downloading", name)
        req = urllib.request.Request(SOURCE.format(name), headers={"User-Agent": "Mozilla/5.0 (Mathesis Stoicheion map builder)"})
        with urllib.request.urlopen(req) as r, open(path.with_suffix(".part"), "wb") as f:
            while chunk := r.read(1 << 20):
                f.write(chunk)
        path.with_suffix(".part").rename(path)
    return path


def mosaic(west: float, south: float, east: float, north: float) -> Image.Image:
    """The box in longitude and latitude, at the imagery's own 240 pixels to a degree."""
    out = Image.new("RGB", (round((east - west) * PPD), round((north - south) * PPD)))
    for name, w0, n0 in SQUARES:
        lo, hi = max(west, w0), min(east, w0 + 90)
        if lo >= hi:
            continue
        with Image.open(fetch(name)) as im:
            box = (round((lo - w0) * PPD), round((n0 - north) * PPD), round((hi - w0) * PPD), round((n0 - south) * PPD))
            out.paste(im.crop(box), (round((lo - west) * PPD), 0))
            print("cut", name, box)
    return out


def main():
    west, south, east, north = json.loads(BASE.read_text(encoding="utf-8"))["bbox"]
    geo = mosaic(west, south, east, north)
    # into the map's projection: only the east-west squeeze, since both are equirectangular
    w = round((east - west) * COS * SCALE * PX_PER_UNIT)
    h = round((north - south) * SCALE * PX_PER_UNIT)
    full = geo.resize((w, h), Image.LANCZOS)
    del geo
    # a touch lighter and less saturated, so the names and dots read on it
    full = ImageEnhance.Color(ImageEnhance.Brightness(full).enhance(1.12)).enhance(0.92)

    levels = []
    z = 0
    while (w / 2 ** z) > TILE:
        z += 1
    top = z
    OUT.mkdir(parents=True, exist_ok=True)
    total = 0
    for zz in range(top, -1, -1):
        f = 2 ** (top - zz)
        lw, lh = math.ceil(w / f), math.ceil(h / f)
        im = full if f == 1 else full.resize((lw, lh), Image.LANCZOS)
        cols, rows = math.ceil(lw / TILE), math.ceil(lh / TILE)
        d = OUT / str(zz)
        d.mkdir(exist_ok=True)
        for old in d.glob("*.webp"):
            old.unlink()
        for r in range(rows):
            for c in range(cols):
                tile = im.crop((c * TILE, r * TILE, min(lw, (c + 1) * TILE), min(lh, (r + 1) * TILE)))
                p = d / f"{c}_{r}.webp"
                tile.save(p, "WEBP", quality=QUALITY, method=6)
                total += p.stat().st_size
        levels.append({"z": zz, "scale": PX_PER_UNIT / f, "w": lw, "h": lh, "cols": cols, "rows": rows})
        print(f"level {zz}: {lw}x{lh}, {cols * rows} tiles")
    levels.sort(key=lambda l: l["z"])
    meta = {
        "source": "NASA Earth Observatory, Blue Marble: Next Generation with Topography and Bathymetry (Reto Stöckli), July 2004; public domain",
        "bbox": [west, south, east, north], "tile": TILE, "levels": levels,
    }
    (OUT / "meta.json").write_text(json.dumps(meta, indent=1), encoding="utf-8")
    print(f"{total / 1e6:.1f} MB in tiles")


if __name__ == "__main__":
    main()
