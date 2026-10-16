/**
 * Reliefs re-lit by the torch (DESIGN.md: Texture and light). A real photograph of a relief is read as a height map
 * (bright parts treated as raised); its surface normals are worked out once, at low resolution, and each redraw lights
 * them (Lambert, a soft fall-off and a little sheen, in warm torch colours) with the sharp photograph multiplied over
 * it, so the light rakes across the marble from the side the flame is on. A window's rim, or a medallion's ring,
 * catches the light on the far side and throws a shadow on the near one.
 */
import { boxBlur, canvas, clamp, DAYRAMP, DPR, PHONE, RAMP, type Art, type LocalLight } from "./common";
import { torchRadius } from "@/lib/torch";

export interface ReliefOptions {
  /** how many pixels the lighting is worked out on (more is finer and slower) */
  area?: number; lowW?: number;
  /** how deep the relief reads */
  depth?: number;
  /** the point of the picture kept in view when it is cropped to its window (0 to 1) */
  fx?: number; fy?: number;
  /** a round medallion with a carved ring, a window with a rim, or a shape cut out of its background */
  round?: boolean; rim?: boolean; cut?: boolean;
  blur?: number; kd?: number; spec?: number; amb?: number;
}

export class Relief implements Art {
  cv: HTMLCanvasElement; img: HTMLImageElement; o: Required<ReliefOptions>; x: CanvasRenderingContext2D;
  day = false; t0: number | null = -1e9;
  private w = 0; private h = 0; private lw = 0; private lh = 0;
  private alb: HTMLCanvasElement | null = null; private mask: HTMLCanvasElement | null = null; private low: HTMLCanvasElement | null = null;
  private lx: CanvasRenderingContext2D | null = null; private lowImg: ImageData | null = null; private u32: Uint32Array | null = null;
  private NX = new Float32Array(0); private NY = new Float32Array(0); private NZ = new Float32Array(0);
  constructor(cv: HTMLCanvasElement, img: HTMLImageElement, o: ReliefOptions = {}) {
    this.cv = cv; this.img = img;
    this.o = { area: 56000, lowW: 340, depth: 2.6, fx: 0.5, fy: 0.5, round: false, blur: 1, kd: 1.4, spec: 0.3, amb: 0.12, rim: true, cut: false, ...o };
    this.x = cv.getContext("2d")!;
  }
  layout() {
    const r = this.cv.getBoundingClientRect();
    if (r.width < 4 || r.height < 4 || !this.img) return false;
    const k = DPR(), W = Math.round(r.width * k), H = Math.round(r.height * k), img = this.img, o = this.o;
    this.w = r.width; this.h = r.height; this.cv.width = W; this.cv.height = H;
    const ia = img.width / img.height, ca = r.width / r.height;
    let sw: number, sh: number;
    if (ia > ca) { sh = img.height; sw = sh * ca; } else { sw = img.width; sh = sw / ca; }
    const sx = clamp(img.width * o.fx - sw / 2, 0, img.width - sw), sy = clamp(img.height * o.fy - sh / 2, 0, img.height - sh);
    this.alb = canvas(W, H);
    const ax = this.alb.getContext("2d")!;
    ax.imageSmoothingQuality = "high"; ax.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    if (o.cut) {
      this.mask = canvas(W, H);
      const mx = this.mask.getContext("2d")!;
      mx.drawImage(this.alb, 0, 0);
      const id = mx.getImageData(0, 0, W, H), d = id.data;
      for (let i = 0; i < d.length; i += 4) d[i + 3] = clamp(d[i] * 9, 0, 255);
      mx.putImageData(id, 0, 0);
    }
    let lw = Math.round(Math.min(o.lowW, r.width, Math.sqrt(o.area * (PHONE() ? 0.7 : 1) * ca)));
    lw = Math.max(32, lw);
    const lh = Math.max(16, Math.round(lw / ca));
    this.lw = lw; this.lh = lh; this.low = canvas(lw, lh);
    const lx = this.low.getContext("2d", { willReadFrequently: true })!;
    lx.imageSmoothingQuality = "high"; lx.drawImage(img, sx, sy, sw, sh, 0, 0, lw, lh);
    const d = lx.getImageData(0, 0, lw, lh).data, n = lw * lh, L = new Float32Array(n);
    for (let i = 0; i < n; i++) L[i] = d[i * 4] / 255;
    const Hh = o.blur > 0 ? boxBlur(L, lw, lh, o.blur) : L, dep = (o.depth * lw) / 300;
    const NX = new Float32Array(n), NY = new Float32Array(n), NZ = new Float32Array(n);
    for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
      const i = y * lw + x, xa = x > 0 ? i - 1 : i, xb = x < lw - 1 ? i + 1 : i, ya = y > 0 ? i - lw : i, yb = y < lh - 1 ? i + lw : i;
      const nx = -(Hh[xb] - Hh[xa]) * 0.5 * dep, ny = -(Hh[yb] - Hh[ya]) * 0.5 * dep, l = 1 / Math.sqrt(nx * nx + ny * ny + 1);
      NX[i] = nx * l; NY[i] = ny * l; NZ[i] = l;
    }
    this.NX = NX; this.NY = NY; this.NZ = NZ; this.lx = lx;
    this.lowImg = lx.createImageData(lw, lh); this.u32 = new Uint32Array(this.lowImg.data.buffer);
    return true;
  }
  draw(_now: number, ls: LocalLight[]) {
    const { lw, lh, NX, NY, NZ } = this, u32 = this.u32!, o = this.o, sc = lw / this.w, hz = torchRadius() * 1.15 * sc, hz2 = hz * hz;
    const ramp = this.day ? DAYRAMP : RAMP, amb = this.day ? 0.5 : o.amb;
    // only the lights that reach this picture
    const Ls = ls.filter((l) => l.I > 0.01).map((l) => ({ px: l.x * sc, py: l.y * sc, kd: o.kd * l.I * (this.day ? 0.6 : 1), ks: o.spec * l.I }))
      .filter((l) => { const dx = Math.max(-l.px, 0, l.px - lw), dy = Math.max(-l.py, 0, l.py - lh), q = hz2 / (hz2 + dx * dx + dy * dy); return q * q > 0.004; });
    const n = Ls.length;
    for (let j = 0, i = 0; j < lh; j++) for (let x = 0; x < lw; x++, i++) {
      const nx = NX[i], ny = NY[i], nz = NZ[i];
      let v = amb;
      for (let q = 0; q < n; q++) {
        const l = Ls[q], dx = l.px - x, dy = l.py - j, d2 = dx * dx + dy * dy, inv = 1 / Math.sqrt(d2 + hz2);
        let ndl = (nx * dx + ny * dy + nz * hz) * inv; if (ndl < 0) ndl = 0;
        const f0 = hz2 / (hz2 + d2), fall = f0 * f0;
        const hx = dx * inv, hy = dy * inv, hh = hz * inv + 1, hl = 1 / Math.sqrt(hx * hx + hy * hy + hh * hh);
        let nh = (nx * hx + ny * hy + nz * hh) * hl; if (nh < 0) nh = 0;
        nh *= nh; nh *= nh; nh *= nh; nh *= nh;
        v += (ndl * l.kd + nh * l.ks) * fall;
      }
      u32[i] = ramp[v >= 2.4 ? 511 : (v * 212.9) | 0];
    }
    this.lx!.putImageData(this.lowImg!, 0, 0);
    const x = this.x, W = this.cv.width, H = this.cv.height;
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.globalCompositeOperation = "copy"; x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high"; x.drawImage(this.low!, 0, 0, W, H);
    x.globalCompositeOperation = "multiply"; x.drawImage(this.alb!, 0, 0);
    if (o.cut && this.mask) { x.globalCompositeOperation = "destination-in"; x.drawImage(this.mask, 0, 0); }
    x.globalCompositeOperation = "source-over";
    if (o.round) this.ring(x, W, H, ls); else if (o.rim) this.rim(x, W, H, ls);
    return false;
  }
  /** the medallion is sunk into the stone: its rim is a carved groove that catches the torch on the far side */
  private ring(x: CanvasRenderingContext2D, W: number, H: number, ls: LocalLight[]) {
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2, bw = Math.max(3, R * 0.07), TR = torchRadius();
    x.globalCompositeOperation = "destination-in"; x.beginPath(); x.arc(cx, cy, R - bw * 0.6, 0, 7); x.fill(); x.globalCompositeOperation = "source-over";
    const U = ls.map((l) => { const vx = l.x - this.w / 2, vy = l.y - this.h / 2, vd = Math.hypot(vx, vy) || 1, f = this.day ? 1 : (TR * TR) / (TR * TR + vd * vd); return { ux: vx / vd, uy: vy / vd, Ic: l.I * Math.sqrt(f) }; });
    const N = 72;
    x.lineCap = "butt";
    for (let s = 0; s < N; s++) {
      const a0 = (s / N) * Math.PI * 2, a1 = ((s + 1.08) / N) * Math.PI * 2, am = (a0 + a1) / 2, ox = Math.cos(am), oy = Math.sin(am);
      let inner = 0, outer = 0;
      for (const u of U) { const dot = ox * u.ux + oy * u.uy; inner += Math.max(0, -dot) * u.Ic; outer += Math.max(0, dot) * u.Ic; }
      inner = Math.min(1, inner); outer = Math.min(1, outer);
      x.lineWidth = bw * 0.55;
      x.strokeStyle = this.day ? `rgba(255,255,250,${(0.25 + 0.6 * outer).toFixed(3)})` : `rgba(255,196,126,${(0.04 + 0.55 * outer).toFixed(3)})`;
      x.beginPath(); x.arc(cx, cy, R - bw * 0.3, a0, a1); x.stroke();
      x.strokeStyle = this.day ? `rgba(80,60,40,${(0.25 + 0.4 * inner).toFixed(3)})` : `rgba(0,0,0,${(0.45 + 0.4 * inner).toFixed(3)})`;
      x.beginPath(); x.arc(cx, cy, R - bw * 0.85, a0, a1); x.stroke();
    }
  }
  /** the window is cut into the wall: the wall's edge on the torch side throws a shadow inward; the far edge is lit */
  private rim(x: CanvasRenderingContext2D, W: number, H: number, ls: LocalLight[]) {
    const TR = torchRadius();
    const U = ls.map((l) => { const vx = l.x - this.w / 2, vy = l.y - this.h / 2, vd = Math.hypot(vx, vy) || 1, f = (TR * TR) / (TR * TR + vd * vd * 0.4); return { ux: vx / vd, uy: vy / vd, Ic: l.I * Math.sqrt(f) }; });
    const b = Math.max(10, Math.min(W, H) * 0.06), E: [number, number, number, number][] = [[0, 0, 1, 0], [W, 0, -1, 0], [0, 0, 0, 1], [0, H, 0, -1]];
    for (const [x0, y0, nx, ny] of E) {
      let sh = 0, li = 0;
      for (const u of U) { const dot = nx * u.ux + ny * u.uy; sh += Math.max(0, -dot) * u.Ic; li += Math.max(0, dot) * u.Ic; }
      const shadow = Math.min(0.55, sh * 0.55) + 0.18, lit = Math.min(0.42, li * 0.42);
      const g = x.createLinearGradient(x0, y0, x0 + nx * b, y0 + ny * b);
      g.addColorStop(0, `rgba(0,0,0,${shadow.toFixed(3)})`); g.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      if (lit > 0.01) { x.fillStyle = `rgba(255,200,130,${lit.toFixed(3)})`; if (nx) x.fillRect(nx > 0 ? 0 : W - 2, 0, 2, H); else x.fillRect(0, ny > 0 ? 0 : H - 2, W, 2); }
    }
  }
}
