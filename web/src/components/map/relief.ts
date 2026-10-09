/**
 * The Periplus' picture of the land and sea: NASA's Blue Marble in the map's projection, cut into a pyramid
 * of WebP tiles by pipeline/build_relief.py (public/data/relief, 8 MB, served with the site). Tiles are fetched
 * as the view needs them and decoded off the main thread; until a sharp tile arrives, the nearest coarser one
 * stands in for it, so the map never shows a hole. Level 0, one small tile for the whole map, is fetched first.
 */
const DIR = "/data/relief";
export interface ReliefLevel { z: number; scale: number; w: number; h: number; cols: number; rows: number }
export interface ReliefMeta { source: string; bbox: [number, number, number, number]; tile: number; levels: ReliefLevel[] }

type Slot = ImageBitmap | "loading" | "failed";
const MAX_KEPT = 220;   // decoded tiles kept in memory (512 px each, about 1 MB apiece)
const MAX_LOADING = 6;

let metaPromise: Promise<ReliefMeta> | null = null;
export function loadReliefMeta(): Promise<ReliefMeta> {
  metaPromise ??= fetch(`${DIR}/meta.json`).then((r) => { if (!r.ok) throw new Error(`relief ${r.status}`); return r.json(); });
  metaPromise.catch(() => { metaPromise = null; });
  return metaPromise;
}

export class Relief {
  private slots = new Map<string, Slot>();
  private used = new Map<string, number>();   // when each tile was last drawn, to let the oldest go
  private loading = 0;
  private queue: string[] = [];
  private frame = 0;

  constructor(readonly meta: ReliefMeta, private onLoad: () => void) { this.want(0, 0, 0); }

  private key(z: number, c: number, r: number) { return `${z}/${c}_${r}`; }

  /** the whole map's smallest tile has arrived, so there is always something to show */
  get ready() { return typeof this.slots.get("0/0_0") === "object"; }

  private want(z: number, c: number, r: number) {
    const k = this.key(z, c, r);
    if (this.slots.has(k)) return;
    this.slots.set(k, "loading");
    this.queue.push(k);
    this.pump();
  }

  private pump() {
    while (this.loading < MAX_LOADING && this.queue.length) {
      const k = this.queue.pop()!;   // the latest wanted first: what is on screen now
      if (this.slots.get(k) !== "loading") continue;
      this.loading++;
      fetch(`${DIR}/${k}.webp`)
        .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.blob(); })
        .then((b) => createImageBitmap(b))
        .then((bmp) => { this.slots.set(k, bmp); this.trim(); this.onLoad(); }, () => this.slots.set(k, "failed"))
        .finally(() => { this.loading--; this.pump(); });
    }
  }

  /** forget tiles no longer wanted, and decoded tiles not drawn for a while */
  private trim() {
    const kept = [...this.slots].filter(([k, s]) => typeof s === "object" && !k.startsWith("0/"));
    if (kept.length <= MAX_KEPT) return;
    kept.sort((a, b) => (this.used.get(a[0]) ?? 0) - (this.used.get(b[0]) ?? 0));
    for (const [k, s] of kept.slice(0, kept.length - MAX_KEPT)) { (s as ImageBitmap).close(); this.slots.delete(k); this.used.delete(k); }
  }

  /** the level whose pixels are at least as fine as the screen's (or the finest there is) */
  levelFor(pxPerUnit: number): ReliefLevel {
    const ls = this.meta.levels;
    return ls.find((l) => l.scale >= pxPerUnit * 0.92) ?? ls[ls.length - 1];
  }

  /**
   * Paint the tiles that cover the frame. `k` is screen pixels per map unit, (tx, ty) where the map's corner
   * falls, `dpr` the screen's pixel density; the context is in screen pixels (already scaled by dpr).
   */
  paint(g: CanvasRenderingContext2D, k: number, tx: number, ty: number, w: number, h: number, dpr: number, moving: boolean) {
    this.frame++;
    const L = this.levelFor(k * dpr), T = this.meta.tile, u = T / L.scale;   // map units per tile
    // the tiles in view, with one tile's margin while moving, so the next ones are on their way
    const m = moving ? 1 : 0;
    const c0 = Math.max(0, Math.floor(-tx / k / u) - m), c1 = Math.min(L.cols - 1, Math.floor((w - tx) / k / u) + m);
    const r0 = Math.max(0, Math.floor(-ty / k / u) - m), r1 = Math.min(L.rows - 1, Math.floor((h - ty) / k / u) + m);
    // the queue holds only what is wanted now
    this.queue = this.queue.filter((q) => q.startsWith(`${L.z}/`));
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) this.want(L.z, c, r);
    g.imageSmoothingEnabled = true;
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        // the tile's place on screen, snapped outward to whole pixels so neighbours meet without a seam
        const x0 = tx + c * u * k, y0 = ty + r * u * k;
        const tw = Math.min(T, L.w - c * T), th = Math.min(T, L.h - r * T);
        const sx0 = Math.floor(x0 * dpr) / dpr, sy0 = Math.floor(y0 * dpr) / dpr;
        const sx1 = Math.ceil((x0 + (tw / L.scale) * k) * dpr) / dpr, sy1 = Math.ceil((y0 + (th / L.scale) * k) * dpr) / dpr;
        if (sx1 < 0 || sy1 < 0 || sx0 > w || sy0 > h) continue;
        this.drawTile(g, L, c, r, sx0, sy0, sx1 - sx0, sy1 - sy0);
      }
    }
  }

  /** a tile, or the part of a coarser one that covers it */
  private drawTile(g: CanvasRenderingContext2D, L: ReliefLevel, c: number, r: number, x: number, y: number, w: number, h: number) {
    const T = this.meta.tile;
    // the tile's box in map units, so a coarser level's pixels can be found for it
    const ux0 = (c * T) / L.scale, uy0 = (r * T) / L.scale, uw = Math.min(T, L.w - c * T) / L.scale, uh = Math.min(T, L.h - r * T) / L.scale;
    for (let z = L.z; z >= 0; z--) {
      const P = this.meta.levels[z], pc = Math.floor((ux0 * P.scale) / T), pr = Math.floor((uy0 * P.scale) / T);
      const s = this.slots.get(this.key(z, pc, pr));
      if (typeof s !== "object") continue;
      this.used.set(this.key(z, pc, pr), this.frame);
      const sx = ux0 * P.scale - pc * T, sy = uy0 * P.scale - pr * T;
      const sw = Math.min(uw * P.scale, s.width - sx), sh = Math.min(uh * P.scale, s.height - sy);
      if (sw <= 0 || sh <= 0) continue;
      g.drawImage(s, sx, sy, sw, sh, x, y, (w * sw) / (uw * P.scale), (h * sh) / (uh * P.scale));
      return;
    }
  }

  dispose() { for (const s of this.slots.values()) if (typeof s === "object") s.close(); this.slots.clear(); }
}
