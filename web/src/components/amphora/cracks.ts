/**
 * Cracks in fired clay, grown from a blow. A simple model of how brittle things break:
 * - the blow chips the surface where it lands, and sends cracks running outward from it (radial cracks);
 * - each crack follows the stress, which pulls it outward from the blow, but wanders where the clay is uneven;
 * - a crack carries the blow's energy and stops when it runs out, thinning towards its tip;
 * - a fast crack splits in two (branching), more often the harder the blow;
 * - a crack that meets another crack stops there (a crack cannot cross a gap that is already open),
 *   which is why old cracks shape new ones;
 * - a hard blow also opens rings around itself (the cone of a percussion fracture) between the radial cracks.
 * Everything is worked out in the pot's own measure (so a crack is as long round the narrow neck as round the
 * belly) and drawn in the flat picture of its surface. The same blow always grows the same cracks (seeded).
 */
import type { Crack } from "@/lib/amphora";

export interface Surface {
  /** width and height of the flat picture (texture pixels; x runs round the pot and wraps) */
  W: number; H: number;
  /** texture pixels per unit of length round the pot, at a row */
  sx: (y: number) => number;
  /** texture pixels per unit of length down the profile */
  sy: number;
}

/** A crack: its points as x, y, width triples (texture pixels; x may run past the seam), and its bounds. */
export interface CrackPath { pts: number[]; box: [number, number, number, number] }
export interface Fracture { paths: CrackPath[]; chip: number[]; box: [number, number, number, number]; f: number }

const mulberry = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Every crack on the pot so far, in a grid of cells, so a new crack can find whether it meets one. */
export class CrackField {
  private cells = new Map<number, number[]>();
  private segs: number[] = [];
  constructor(private W: number, private cell = 24) {}
  private key(cx: number, cy: number) { return (((cx % 4096) + 4096) % 4096) + cy * 4096; }
  add(x0: number, y0: number, x1: number, y1: number) {
    const shift = Math.floor(Math.min(x0, x1) / this.W) * this.W;
    x0 -= shift; x1 -= shift;
    const i = this.segs.length / 4;
    this.segs.push(x0, y0, x1, y1);
    const n = Math.ceil(this.W / this.cell);
    for (let cx = Math.floor(Math.min(x0, x1) / this.cell); cx <= Math.floor(Math.max(x0, x1) / this.cell); cx++)
      for (let cy = Math.floor(Math.min(y0, y1) / this.cell); cy <= Math.floor(Math.max(y0, y1) / this.cell); cy++) {
        const k = this.key(((cx % n) + n) % n, cy);
        const list = this.cells.get(k);
        if (list) list.push(i); else this.cells.set(k, [i]);
      }
  }
  /** Where along the step from (x0, y0) to (x1, y1) it first meets a crack (0–1), or null. */
  hit(x0: number, y0: number, x1: number, y1: number): number | null {
    const shift = Math.floor(Math.min(x0, x1) / this.W) * this.W;
    x0 -= shift; x1 -= shift;
    const n = Math.ceil(this.W / this.cell), seen = new Set<number>();
    let best: number | null = null;
    for (let cx = Math.floor(Math.min(x0, x1) / this.cell); cx <= Math.floor(Math.max(x0, x1) / this.cell); cx++)
      for (let cy = Math.floor(Math.min(y0, y1) / this.cell); cy <= Math.floor(Math.max(y0, y1) / this.cell); cy++) {
        for (const i of this.cells.get(this.key(((cx % n) + n) % n, cy)) ?? []) {
          if (seen.has(i)) continue;
          seen.add(i);
          for (const dx of [0, -this.W, this.W]) {
            const t = cross(x0, y0, x1, y1, this.segs[i * 4] + dx, this.segs[i * 4 + 1], this.segs[i * 4 + 2] + dx, this.segs[i * 4 + 3]);
            if (t !== null && (best === null || t < best)) best = t;
          }
        }
      }
    return best;
  }
}

/** Where segment a meets segment b, as a fraction along a (ignoring a touch at a's very start). */
function cross(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): number | null {
  const rx = bx - ax, ry = by - ay, sx = dx - cx, sy = dy - cy;
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-9) return null;
  const t = ((cx - ax) * sy - (cy - ay) * sx) / den, u = ((cx - ax) * ry - (cy - ay) * rx) / den;
  return t > 1e-4 && t <= 1 && u >= 0 && u <= 1 ? t : null;
}

/** The cracks one blow makes, given the cracks already there (which it adds to). */
export function strike(c: Crack, surf: Surface, field: CrackField): Fracture {
  const rnd = mulberry(c.s), f = Math.max(0.05, Math.min(1, c.f));
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd());
  const paths: CrackPath[] = [];
  const { W, H, sy } = surf;
  const sxAt = (y: number) => surf.sx(Math.max(0, Math.min(H - 1, y)));
  const STEP = 0.0075;   // the length of one step of a crack, in the pot's units (the pot is about 2.1 tall)

  // the chip where the blow landed: the gloss flakes away and shows the clay
  const rc = 0.006 + 0.032 * f * (0.8 + 0.4 * rnd());
  const chip: number[] = [];
  const nChip = 9 + Math.floor(rnd() * 6);
  for (let i = 0; i < nChip; i++) {
    const a = (i / nChip) * 2 * Math.PI + (rnd() - 0.5) * 0.4, r = rc * (0.55 + 0.6 * rnd());
    chip.push(c.x + Math.cos(a) * r * sxAt(c.y), c.y + Math.sin(a) * r * sy);
  }

  /** One crack, from a point, in a direction (radians, in the pot's measure), with a budget of length. */
  function run(x: number, y: number, th: number, budget: number, w0: number, gen: number, follow: (x: number, y: number) => number | null) {
    const pts = [x, y, w0];
    let left = budget;
    while (left > 0) {
      const sx = sxAt(y);
      const want = follow(x, y);
      if (want !== null) th += wrapAngle(want - th) * 0.2;
      th += gauss() * 0.13;
      const nx = x + Math.cos(th) * STEP * sx, ny = y + Math.sin(th) * STEP * sy;
      if (ny < 3 || ny > H - 3) break;
      const w = 0.3 + (w0 - 0.3) * Math.pow(Math.max(0, left / budget), 0.7);
      const t = field.hit(x, y, nx, ny);
      if (t !== null) { pts.push(x + (nx - x) * t, y + (ny - y) * t, w); break; }   // it meets a crack, and stops
      field.add(x, y, nx, ny);
      pts.push(nx, ny, w);
      x = nx; y = ny; left -= STEP;
      // a fast crack splits: more often early on (while it carries most of the energy) and in a hard blow
      if (gen < 3 && rnd() < 0.05 * f * (left / budget)) {
        const side = rnd() < 0.5 ? -1 : 1;
        run(x, y, th + side * (0.32 + rnd() * 0.35), left * (0.45 + 0.25 * rnd()), w * 0.75, gen + 1, follow);
        th -= side * 0.1;
        left *= 0.78;
      }
    }
    if (pts.length > 3) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let i = 0; i < pts.length; i += 3) { x0 = Math.min(x0, pts[i]); x1 = Math.max(x1, pts[i]); y0 = Math.min(y0, pts[i + 1]); y1 = Math.max(y1, pts[i + 1]); }
      paths.push({ pts, box: [x0 - 4, y0 - 4, x1 + 4, y1 + 4] });
    }
  }

  // outward from the blow: the stress points away from it
  const outward = (x: number, y: number) => {
    let dx = x - c.x;
    if (dx > W / 2) dx -= W; else if (dx < -W / 2) dx += W;
    return Math.atan2((y - c.y) / sy, dx / sxAt(y));
  };
  const radials = 3 + Math.floor(f * 6 + rnd() * 2);
  const a0 = rnd() * 2 * Math.PI;
  for (let i = 0; i < radials; i++) {
    const a = a0 + ((i + (rnd() - 0.5) * 0.7) / radials) * 2 * Math.PI;
    const start = rc * 0.7;
    run(c.x + Math.cos(a) * start * sxAt(c.y), c.y + Math.sin(a) * start * sy, a,
      (0.16 + 0.8 * f) * (0.65 + 0.7 * rnd()), 0.9 + 2.4 * f, 0, outward);
  }

  // a hard blow: rings round it, from one radial crack to the next
  if (f > 0.4) {
    const rings = f > 0.8 ? 2 : 1;
    for (let k = 0; k < rings; k++) {
      const R = (0.07 + 0.2 * f) * (0.6 + 0.35 * (k + rnd()));
      for (let j = 0; j < 2 + Math.floor(rnd() * 3); j++) {
        const a = rnd() * 2 * Math.PI, dir = rnd() < 0.5 ? -1 : 1;
        const rx = c.x + Math.cos(a) * R * sxAt(c.y), ry = c.y + Math.sin(a) * R * sy;
        // the blow's stress cannot reach past a crack that is already open
        if (field.hit(c.x + Math.cos(a) * rc * 1.2 * sxAt(c.y), c.y + Math.sin(a) * rc * 1.2 * sy, rx, ry) !== null) continue;
        const along = (x: number, y: number) => {
          let dx = x - c.x;
          if (dx > W / 2) dx -= W; else if (dx < -W / 2) dx += W;
          const wx = dx / sxAt(y), wy = (y - c.y) / sy, r = Math.hypot(wx, wy), polar = Math.atan2(wy, wx);
          return polar + dir * Math.PI / 2 - dir * Math.max(-0.8, Math.min(0.8, ((r - R) / R) * 2.5));   // round the ring, kept to its radius
        };
        run(rx, ry, a + dir * Math.PI / 2, R * 1.4, 0.6 + 1.1 * f, 3, along);
      }
    }
  }

  // the chip's edge is open too: later cracks stop at it (this blow's own cracks start from it)
  for (let i = 0; i < chip.length; i += 2) {
    const j = (i + 2) % chip.length;
    field.add(chip[i], chip[i + 1], chip[j], chip[j + 1]);
  }
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of paths) { x0 = Math.min(x0, p.box[0]); y0 = Math.min(y0, p.box[1]); x1 = Math.max(x1, p.box[2]); y1 = Math.max(y1, p.box[3]); }
  for (let i = 0; i < chip.length; i += 2) { x0 = Math.min(x0, chip[i] - 4); x1 = Math.max(x1, chip[i] + 4); y0 = Math.min(y0, chip[i + 1] - 4); y1 = Math.max(y1, chip[i + 1] + 4); }
  return { paths, chip, box: [x0, y0, x1, y1], f };
}
