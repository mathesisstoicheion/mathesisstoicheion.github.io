/**
 * The Muses' niches: a round-headed hollow in the wall, as deep as it is wide, shaded by the torch (no picture, only
 * light). Each point inside is lit (Lambert) unless the rim of the opening stands between it and the flame, so a soft
 * shadow edge sweeps across the hollow as the torch moves.
 */
import { canvas, clamp, DPR, RAMP, smooth, type Art, type LocalLight } from "./common";
import { torchRadius } from "@/lib/torch";

export class Niche implements Art {
  cv: HTMLCanvasElement; x: CanvasRenderingContext2D; t0: number | null = -1e9;
  private w = 0; private lw = 0; private lh = 0; private rr = 0; private cxn = 0; private ca = 0; private ybn = 0;
  private K = new Uint8Array(0); private U = new Float32Array(0); private V = new Float32Array(0); private Z = new Float32Array(0);
  private A = new Float32Array(0); private C = new Float32Array(0);
  private low: HTMLCanvasElement | null = null; private lx: CanvasRenderingContext2D | null = null; private img: ImageData | null = null;
  constructor(cv: HTMLCanvasElement) { this.cv = cv; this.x = cv.getContext("2d")!; }
  layout() {
    const r = this.cv.getBoundingClientRect();
    if (r.width < 4) return false;
    const k = DPR();
    this.w = r.width; this.cv.width = Math.round(r.width * k); this.cv.height = Math.round(r.height * k);
    const lw = Math.round(clamp(r.width * 0.72, 36, 92)), lh = Math.round((lw * r.height) / r.width), n = lw * lh;
    this.lw = lw; this.lh = lh;
    const m = lw * 0.07, rr = (lw - 2 * m) / 2, cx = lw / 2, ca = m + rr, yb = lh * 0.88, ys = lh * 0.95;
    this.rr = rr; this.cxn = cx; this.ca = ca; this.ybn = (yb - ca) / rr;
    const K = new Uint8Array(n), U = new Float32Array(n), V = new Float32Array(n), Z = new Float32Array(n), A = new Float32Array(n), C = new Float32Array(n);
    let seed = Math.round(r.left * 7 + r.top * 3) + 5;
    const rnd = () => (seed = (seed * 16807 + 11) % 2147483647) / 2147483647;
    for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
      const i = y * lw + x, u = (x + 0.5 - cx) / rr, yy = y + 0.5, v = (yy - ca) / rr;
      if (yy < ca) { const q = u * u + v * v; if (q < 1.02) { K[i] = 1; U[i] = u; V[i] = v; Z[i] = Math.sqrt(Math.max(0, 1 - q)); C[i] = clamp((1 - Math.sqrt(q)) * rr + 0.5, 0, 1); } }
      else if (yy < yb) { if (Math.abs(u) < 1.02) { K[i] = 2; U[i] = u; V[i] = v; Z[i] = Math.sqrt(Math.max(0, 1 - u * u)); C[i] = clamp((1 - Math.abs(u)) * rr + 0.5, 0, 1); } }
      else if (yy < ys) { if (Math.abs(u) < 1.14) { K[i] = 3; U[i] = u; V[i] = v; C[i] = clamp((1.14 - Math.abs(u)) * rr + 0.5, 0, 1) * clamp(ys - yy + 0.5, 0, 1); } }
      A[i] = 0.8 + 0.2 * rnd();
    }
    Object.assign(this, { K, U, V, Z, A, C });
    this.low = canvas(lw, lh); this.lx = this.low.getContext("2d")!; this.img = this.lx.createImageData(lw, lh);
    return true;
  }
  draw(_now: number, ls: LocalLight[]) {
    const { lw, lh, K, U, V, Z, A, C, rr, cxn: cx, ca, ybn } = this, u8 = this.img!.data;
    const TR = torchRadius(), sc = lw / this.w, Lz = (TR * 0.75 * sc) / rr, fr = ((TR * sc) / rr) ** 2;
    const Ls = ls.filter((l) => l.I > 0.01).map((l) => ({ X: (l.x * sc - cx) / rr, Y: (l.y * sc - ca) / rr, kd: 1.08 * l.I })), n = Ls.length;
    for (let i = 0, N = lw * lh; i < N; i++) {
      const k = K[i];
      if (!k) { u8[i * 4 + 3] = 0; continue; }
      const u = U[i], v = V[i];
      let nx: number, ny: number, nz: number, pz: number, ao: number;
      const px = u, py = v;
      if (k === 3) { nx = 0; ny = -0.82; nz = 0.57; pz = 0; ao = 0.9; }
      else { const z = Z[i]; pz = -z; nx = -u; ny = k === 1 ? -v : 0; nz = z; ao = (0.3 + 0.7 * (1 - z * 0.8)) * (k === 1 ? 0.8 + 0.2 * (1 + v) : 1); }
      let lit = 0;
      for (let q = 0; q < n; q++) {
        const L = Ls[q], Lx = L.X, Ly = L.Y;
        let sf = 1, lx = Lx - px, ly = Ly - py, lz = Lz - pz;
        const d = Math.sqrt(lx * lx + ly * ly + lz * lz); lx /= d; ly /= d; lz /= d;
        const ndl = nx * lx + ny * ly + nz * lz;
        if (ndl <= 0) continue;
        if (k !== 3) {
          // the rim of the opening, between this point and the flame
          const t = -pz / (Lz - pz || 1e-6), qx = px + t * (Lx - px), qy = py + t * (Ly - py);
          const mg = qy < 0 ? 1 - Math.sqrt(qx * qx + qy * qy) : Math.min(1 - Math.abs(qx), ybn - qy);
          sf = smooth((mg + 0.05) / 0.1);
        }
        const dd = (Lx - u) * (Lx - u) + (Ly - v) * (Ly - v);
        lit += ((ndl * sf * fr) / (fr + dd)) * L.kd;
      }
      const val = (0.1 * ao + lit * ao) * A[i], c = RAMP[val >= 2.4 ? 511 : (val * 212.9) | 0], p = i * 4;
      u8[p] = c & 255; u8[p + 1] = (c >> 8) & 255; u8[p + 2] = (c >> 16) & 255; u8[p + 3] = C[i] * 255;
    }
    this.lx!.putImageData(this.img!, 0, 0);
    const x = this.x;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, this.cv.width, this.cv.height);
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high";
    x.drawImage(this.low!, 0, 0, this.cv.width, this.cv.height);
    return false;
  }
}
