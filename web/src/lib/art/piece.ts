/**
 * A piece of ancient sculpture standing in a niche cut into the wall, lit by the torch (DESIGN.md: "A piece on every
 * page"). It is drawn with WebGL2 from two files made by pipeline/pieces.py: the piece's colour (a museum photograph
 * with most of the studio's lighting taken out) and three maps (its shape, its cut-out, and how much light reaches into
 * its hollows).
 *
 * The niche, the piece and the wall behind it are one surface of known height, so every point can ask whether the
 * torch can see it: a short march across the surface towards the flame finds anything taller in the way. That gives
 * real shadows, soft at their edges as a flame's are: the piece throws its shadow on the back of the niche and the
 * shadow swings round as the light moves (στοιχεῖον, the site's name, was also the shadow of a sundial's pointer); the
 * niche's lip shades the piece; folds of drapery shade one another. The niche is round-headed, as Roman niches were:
 * curved in plan, with a half-dome above, so the light runs round its back. Each material takes the light its own way:
 * marble glows a little past the line of shadow (light passes a short way into it) and shines softly; bronze and gold
 * are dark until the flame glints in them; terracotta is matte.
 *
 * The torch's height above the wall decides the shadows' length. When a piece comes into view the light comes in from
 * far off, so its shadows grow from short to their full length as the light arrives (calm, about two seconds).
 * Clicking a piece (tapping it, on a phone) sets a steady lamp before it, high on one side with a little light from the
 * other, so the whole piece can be seen clearly; clicking again takes the lamp away and gives it back to the torch (the
 * owner, 2026-10-16).
 *
 * If WebGL2 is missing (or its context is lost) the piece is drawn flat, its photograph in a warm light.
 */
import { torchRadius, torchStill } from "@/lib/torch";
import { clamp, DAYRAMP, DPR, PHONE, RAMP, smooth, type Art, type LocalLight } from "./common";

export type Material = "marble" | "limestone" | "plaster" | "bronze" | "terracotta" | "gold";
export type NicheShape = "arch" | "rect" | "round";

export interface PieceLook {
  material?: Material;
  /** the niche: round-headed (statues), a plain window (reliefs) or a round recess (coins, medallions) */
  niche?: NicheShape;
  /** "contain": the piece stands in the niche with room around it; "cover": a relief fills its window */
  fit?: "contain" | "cover";
  /** room around a contained piece, as shares of the niche (top, right, bottom, left) */
  margin?: [number, number, number, number];
  /** the point kept in view when a covering relief is cropped (0 to 1) */
  fx?: number; fy?: number;
  /** how far the piece stands out from the back of the niche, how deep it is, and the niche's depth, as shares of the
   *  niche's width */
  stand?: number; depth?: number; hollow?: number;
  /** how strongly the photograph's own fine shading is read as carving */
  detail?: number;
  /** light that reaches the niche from elsewhere, and how strongly the torch lights it */
  amb?: number; gain?: number;
}

interface Mat { wrap: number; kd: number; ks: number; shin: number; metal: number; sat: number }
const MATS: Record<Material, Mat> = {
  marble: { wrap: 0.32, kd: 1.32, ks: 0.26, shin: 22, metal: 0, sat: 0.28 },
  limestone: { wrap: 0.16, kd: 1.38, ks: 0.08, shin: 9, metal: 0, sat: 0.45 },
  plaster: { wrap: 0.24, kd: 1.3, ks: 0.1, shin: 12, metal: 0, sat: 0.2 },
  bronze: { wrap: 0.05, kd: 1.1, ks: 0.95, shin: 18, metal: 1, sat: 0.85 },
  terracotta: { wrap: 0.08, kd: 1.3, ks: 0.07, shin: 7, metal: 0, sat: 0.9 },
  gold: { wrap: 0, kd: 0.9, ks: 1.5, shin: 46, metal: 1, sat: 1 },
};
const STONE: Mat = { wrap: 0.1, kd: 1.25, ks: 0.05, shin: 8, metal: 0, sat: 1 };

const VERT = `#version 300 es
in vec2 a; void main() { gl_Position = vec4(a, 0., 1.); }`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uAlb, uMap, uRamp, uWall;
uniform vec2 uSize; uniform float uDpr;
uniform vec4 uFig;          // the piece's box in the niche (css px: x, y, w, h)
uniform vec4 uL[4];         // lights: x, y, height above the back of the niche, strength
uniform int uN;
uniform float uStand, uDepth, uHollow, uLip;
uniform int uShape;         // 0 window, 1 round-headed niche, 2 round recess
uniform vec4 uMat;          // wrap, kd, ks, shininess
uniform vec2 uMet;          // metal, saturation
uniform vec4 uStone;        // the niche's own stone: wrap, kd, ks, shininess
uniform float uDetail, uAmb, uSteps, uFall, uWallLum;
uniform vec2 uAlbPx;        // one css px, in the colour picture's own units
out vec4 o;

const vec3 LUM = vec3(0.2126, 0.7152, 0.0722);

// the opening's edge, d px in from it: a rounded bead standing a little proud of the wall, then a chamfer down
float lip(float d) {
  float b = uLip * 0.55, bead = d < b ? sqrt(max(0., 1. - pow(2. * d / b - 1., 2.))) : 0.;
  return uHollow * (1. - smoothstep(b * 0.7, b + uLip, d)) + bead * uLip * 0.32;
}
// the niche: 0 at its deepest, rising to uHollow (the face of the wall) at its edges
float nicheH(vec2 p) {
  float W = uSize.x, H = uSize.y;
  if (uShape == 1) {
    float R = W * 0.5; vec2 c = vec2(R, R);
    float r = p.y < c.y ? length(p - c) : abs(p.x - c.x);
    if (r >= R || p.y > H || p.y < 0.) return uHollow;
    float q = r / R;
    float back = uHollow * (1. - sqrt(max(0., 1. - q * q)));
    float d = min(R - r, H - p.y);                               // a moulded lip round the opening, and the sill
    return max(back, lip(d));
  }
  if (uShape == 2) {
    float R = min(W, H) * 0.5, r = length(p - vec2(W, H) * 0.5);
    if (r >= R) return uHollow;
    float q = r / R;
    return max(uHollow * 0.55 * q * q, lip(R - r));
  }
  float d = min(min(p.x, W - p.x), min(p.y, H - p.y));
  return d <= 0. ? uHollow : lip(d);
}
float figH(vec2 p, float lod) {
  vec2 uv = (p - uFig.xy) / uFig.zw;
  if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) return 0.;
  vec3 m = textureLod(uMap, uv, lod).rgb;
  return m.g * uStand + m.r * uDepth;
}
float sceneH(vec2 p, float lod) { return max(nicheH(p), figH(p, lod)); }

// how much of the flame this point can see: a march across the surface towards it (soft-edged, as a flame's shadows are)
float shade(vec3 P, vec3 Lp, float top) {
  vec3 d = Lp - P; float dxy = length(d.xy);
  if (dxy < 0.5) return 1.;
  vec2 u = d.xy / dxy; float slope = d.z / dxy;
  float tmax = min(dxy, (top - P.z) / max(slope, 1e-4));
  if (tmax <= 0.8) return 1.;
  // a step every two or three px is as fine as the blurred height it reads, so a short march needs fewer steps
  float steps = clamp(ceil((tmax - 0.8) / 2.5), 4., uSteps);
  float res = 1.;
  for (int i = 1; i <= 40; i++) {
    float f = float(i) / steps;
    if (f > 1.) break;
    float t = 0.8 + (tmax - 0.8) * pow(f, 1.25);
    float h = sceneH(P.xy + u * t, 2.);
    res = min(res, clamp(4.5 * (P.z + slope * t - h + 0.8) / t, 0., 1.));
    if (res < 0.01) break;
  }
  return res * res * (3. - 2. * res);
}

float wallN(vec2 p) { return texture(uWall, p / 256.).r; }

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  float W = uSize.x, Hh = uSize.y;
  // the opening's outline, for its soft edge
  float sd;
  if (uShape == 1) { float R = W * 0.5; sd = p.y < R ? length(p - vec2(R)) - R : max(-p.x, p.x - W); sd = max(sd, p.y - Hh); }
  else if (uShape == 2) sd = length(p - vec2(W, Hh) * 0.5) - min(W, Hh) * 0.5;
  else sd = max(max(-p.x, p.x - W), max(-p.y, p.y - Hh));
  float alpha = clamp(0.5 - sd * uDpr, 0., 1.);
  if (alpha <= 0.) { o = vec4(0.); return; }

  vec2 uv = (p - uFig.xy) / uFig.zw;
  bool inFig = uv.x >= 0. && uv.y >= 0. && uv.x <= 1. && uv.y <= 1.;
  vec3 mp = inFig ? texture(uMap, uv).rgb : vec3(0., 0., 1.);
  float mask = mp.g;
  float wn = wallN(p);
  float hW = nicheH(p), hF = mp.g * uStand + mp.r * uDepth;
  float isFig = smoothstep(0.0, 1.5, hF - hW + 0.5) * mask;
  float Hc = max(hW + (wn - 0.5) * 0.9, hF);
  // the surface's slope (the wall's grain is in it, faintly)
  float e = 1.;
  float hx = sceneH(p + vec2(e, 0.), 0.) - sceneH(p - vec2(e, 0.), 0.);
  float hy = sceneH(p + vec2(0., e), 0.) - sceneH(p - vec2(0., e), 0.);
  float wx = wallN(p + vec2(1., 0.)) - wallN(p - vec2(1., 0.)), wy = wallN(p + vec2(0., 1.)) - wallN(p - vec2(0., 1.));
  vec3 n = vec3(-hx / (2. * e), -hy / (2. * e), 1.);
  n.xy -= vec2(wx, wy) * 0.9 * (1. - isFig);
  // the photograph's fine shading, read as carving (bright is raised)
  vec4 alb = inFig ? texture(uAlb, uv) : vec4(0.);
  if (inFig && uDetail > 0.) {
    float lx = dot(texture(uAlb, uv + vec2(uAlbPx.x, 0.)).rgb - texture(uAlb, uv - vec2(uAlbPx.x, 0.)).rgb, LUM);
    float ly = dot(texture(uAlb, uv + vec2(0., uAlbPx.y)).rgb - texture(uAlb, uv - vec2(0., uAlbPx.y)).rgb, LUM);
    n.xy -= vec2(lx, ly) * uDetail * isFig;
  }
  n = normalize(n);

  // colour and material: the niche's stone, or the piece's own
  float g = dot(alb.rgb, LUM);
  vec3 figC = mix(vec3(g), alb.rgb, uMet.y);
  vec3 wallC = vec3(uWallLum * (0.82 + 0.36 * texture(uWall, p / 256.).g));
  vec3 C = mix(wallC, figC, isFig);
  vec4 M = mix(uStone, uMat, isFig);
  float metal = uMet.x * isFig;

  // light from elsewhere: less in the depth of the niche and close in against the piece
  float deep = clamp(hW / max(uHollow, 1e-3), 0., 1.);
  float contact = inFig ? textureLod(uMap, uv, 4.).g : 0.;
  float ao = mix(mix(0.5, 1., deep) * (1. - 0.5 * contact * (1. - isFig)), mp.b, isFig);
  float v = uAmb * ao, s = 0.;
  float top = max(uHollow + uLip * 0.35, uStand + uDepth) + 1.;
  vec3 P = vec3(p, Hc);
  for (int i = 0; i < 4; i++) {
    if (i >= uN) break;
    vec4 L = uL[i];
    vec2 dd = L.xy - p; float d2 = dot(dd, dd);
    float hz = L.z - Hc, f0 = uFall / (uFall + d2), fall = f0 * f0;
    if (fall * L.w < 0.004) continue;
    vec3 l = normalize(vec3(dd, hz));
    float ndl = dot(n, l);
    float dif = max(0., (ndl + M.x) / (1. + M.x));
    float sh = ndl > -M.x ? shade(P, vec3(L.xy, L.z), top) : 0.;
    // a little light still passes into marble on the shadowed side of its edges
    sh = max(sh, M.x * 0.35 * dif * isFig);
    vec3 hv = normalize(l + vec3(0., 0., 1.));
    float sp = pow(max(0., dot(n, hv)), M.w) * step(0., ndl);
    v += dif * M.y * L.w * fall * sh;
    s += sp * M.z * L.w * fall * sh;
  }
  vec3 lit = texture(uRamp, vec2(clamp(v / 2.4, 0., 1.), 0.5)).rgb;
  vec3 col = lit * C * mix(1., 0.8, metal);
  vec3 spec = texture(uRamp, vec2(clamp(s / 2.4, 0., 1.), 0.5)).rgb;
  col += spec * mix(vec3(0.9), C * 1.7 + 0.08, metal);
  // a whisper of noise, so the dark gradients do not band
  float nz = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  col += nz / 255.;
  o = vec4(col * alpha, alpha);
}`;

/** The stone of the niche: one still tile of grain with the marks of a claw chisel, made once from a fixed seed. */
let wallTile: Uint8Array | null = null;
function makeWall() {
  if (wallTile) return wallTile;
  const S = 256, h = new Float32Array(S * S), c = new Float32Array(S * S);
  let seed = 41;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (const [n, a] of [[4, 0.3], [8, 0.22], [16, 0.16], [32, 0.12], [64, 0.08], [128, 0.05]] as const) {
    const g = new Float32Array(n * n), q = new Float32Array(n * n);
    for (let i = 0; i < g.length; i++) { g[i] = rnd() * 2 - 1; q[i] = rnd() * 2 - 1; }
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const fx = (x / S) * n, fy = (y / S) * n, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
      const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty), i0 = x0 % n, i1 = (x0 + 1) % n, j0 = y0 % n, j1 = (y0 + 1) % n;
      const v = (G: Float32Array) => { const A = G[j0 * n + i0], B = G[j0 * n + i1], C = G[j1 * n + i0], D = G[j1 * n + i1]; return A + (B - A) * sx + (C - A) * sy + (A - B - C + D) * sx * sy; };
      h[y * S + x] += v(g) * a; c[y * S + x] += v(q) * a;
    }
  }
  // claw-chisel marks: short parallel grooves in little groups, at the angles a mason's arm makes
  for (let k = 0; k < 90; k++) {
    const x0 = rnd() * S, y0 = rnd() * S, ang = -0.6 + rnd() * 1.2 + (rnd() < 0.5 ? 0 : Math.PI / 2), len = 7 + rnd() * 14;
    const teeth = 3 + Math.floor(rnd() * 3), ux = Math.cos(ang), uy = Math.sin(ang), dep = 0.12 + rnd() * 0.16;
    for (let t = 0; t < teeth; t++) for (let s = 0; s < len; s += 0.5) {
      const px = x0 + ux * s - uy * t * 2.2, py = y0 + uy * s + ux * t * 2.2;
      const xi = ((Math.round(px) % S) + S) % S, yi = ((Math.round(py) % S) + S) % S;
      h[yi * S + xi] -= dep * Math.sin((s / len) * Math.PI);
    }
  }
  const out = new Uint8Array(S * S * 4);
  for (let i = 0; i < S * S; i++) {
    out[i * 4] = clamp(Math.round((h[i] * 0.9 + 0.5) * 255), 0, 255);
    out[i * 4 + 1] = clamp(Math.round((c[i] * 0.9 + 0.5) * 255), 0, 255);
    out[i * 4 + 3] = 255;
  }
  return (wallTile = out);
}

function rampBytes(r: Uint32Array) {
  const b = new Uint8Array(512 * 4);
  for (let i = 0; i < 512; i++) { const v = r[i]; b[i * 4] = v & 255; b[i * 4 + 1] = (v >> 8) & 255; b[i * 4 + 2] = (v >> 16) & 255; b[i * 4 + 3] = 255; }
  return b;
}

type Img = HTMLImageElement | ImageBitmap;

export class Piece implements Art {
  t0: number | null = null;
  day = false;
  /** 1: a steady lamp is set before the piece (it was clicked); 0: the torch lights it */
  lampTo = 0;
  private lamp = 0; private lastNow = 0;
  // smoothness comes first (the owner, 2026-10-16: "The site is not allowed to be laggy"): where drawing keeps the
  // frames slow, the piece is drawn with fewer pixels and shorter shadow marches, and stays so
  private level = 0; private slow = 0; private runs = 0; private dark = false;
  private gl: WebGL2RenderingContext | null = null; private prog: WebGLProgram | null = null;
  private U: Record<string, WebGLUniformLocation | null> = {};
  private tex: WebGLTexture[] = [];
  private w = 0; private h = 0; private k = 1; private lost = false;
  private flat: CanvasRenderingContext2D | null = null; private cut: HTMLCanvasElement | null = null;
  private o: Required<PieceLook>;
  private onLost = (e: Event) => { e.preventDefault(); this.lost = true; };
  private onRestored = () => { this.lost = false; this.init(); this.layout(); };

  constructor(public cv: HTMLCanvasElement, private alb: Img, private map: Img, look: PieceLook = {}) {
    const cover = look.fit === "cover";
    this.o = {
      material: "marble", niche: cover ? "rect" : "arch", fit: "contain", margin: [0.2, 0.12, 0.035, 0.12], fx: 0.5, fy: 0.5,
      stand: cover ? 0 : 0.07, depth: cover ? 0.045 : 0.2, hollow: cover ? 0.05 : 0.2, detail: cover ? 1.0 : 1.6, amb: 0.19, gain: 1, ...look,
    };
    cv.addEventListener("webglcontextlost", this.onLost);
    cv.addEventListener("webglcontextrestored", this.onRestored);
    this.init();
  }

  private init() {
    const gl = this.cv.getContext("webgl2", { premultipliedAlpha: true, alpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) { this.flat = this.cv.getContext("2d"); return; }
    this.gl = gl;
    const sh = (t: number, src: string) => { const s = gl.createShader(t)!; gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s)); return s; };
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(p, 0, "a"); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(p)); this.gl = null; return; }
    this.prog = p; gl.useProgram(p);
    for (const n of ["uAlb", "uMap", "uRamp", "uWall", "uSize", "uDpr", "uFig", "uL", "uN", "uStand", "uDepth", "uHollow", "uLip", "uShape", "uMat", "uMet", "uStone", "uDetail", "uAmb", "uSteps", "uFall", "uWallLum", "uAlbPx"])
      this.U[n] = gl.getUniformLocation(p, n);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    const T = (unit: number, src: Img | null, raw?: { w: number; h: number; data: Uint8Array }, repeat = false, mip = true) => {
      const t = gl.createTexture()!; gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      if (src) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      else if (raw) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, raw.w, raw.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, raw.data);
      const wrap = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      if (mip) gl.generateMipmap(gl.TEXTURE_2D);
      return t;
    };
    this.tex = [
      T(0, this.alb), T(1, this.map),
      T(2, null, { w: 512, h: 1, data: rampBytes(this.day ? DAYRAMP : RAMP) }, false, false),
      T(3, null, { w: 256, h: 256, data: makeWall() }, true),
    ];
    gl.uniform1i(this.U.uAlb, 0); gl.uniform1i(this.U.uMap, 1); gl.uniform1i(this.U.uRamp, 2); gl.uniform1i(this.U.uWall, 3);
  }

  /** day: plain white light, for the reader's Daylight page */
  setDay(day: boolean) {
    if (day === this.day) return;
    this.day = day;
    const gl = this.gl;
    if (gl && this.tex[2]) { gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.tex[2]); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, rampBytes(day ? DAYRAMP : RAMP)); }
  }

  /** the piece's box inside the niche, in css px */
  private figBox(W: number, H: number) {
    const aw = this.alb.width, ah = this.alb.height, o = this.o;
    if (o.fit === "cover") {
      const s = Math.max(W / aw, H / ah), fw = aw * s, fh = ah * s;
      return [clamp(W / 2 - fw * o.fx, W - fw, 0), clamp(H / 2 - fh * o.fy, H - fh, 0), fw, fh];
    }
    const [mt, mr, mb, ml] = o.margin, bw = W * (1 - mr - ml), bh = H * (1 - mt - mb);
    const s = Math.min(bw / aw, bh / ah), fw = aw * s, fh = ah * s;
    // centred across, standing on the sill
    return [W * ml + (bw - fw) / 2, H * (1 - mb) - fh, fw, fh];
  }

  layout() {
    const r = this.cv.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return false;
    // at most so many pixels; and each level down draws it with fewer of them, however small it is
    // (a phone's big window drawn at its full sharpness slowed scrolling past it from 49 to 25 fps in the speed test: its
    // limit balances the two, 2026-10-17)
    const phone = PHONE(), cap = phone ? 220000 : 1200000;
    let k = DPR();
    if (r.width * r.height * k * k > cap) k = Math.sqrt(cap / (r.width * r.height));
    k *= [1, 0.75, 0.55][this.level];
    this.k = k; this.w = r.width; this.h = r.height; this.dark = false;
    this.cv.width = Math.round(r.width * k); this.cv.height = Math.round(r.height * k);
    const gl = this.gl;
    if (!gl) return true;
    const o = this.o, W = r.width, H = r.height, m = MATS[o.material];
    const [fx, fy, fw, fh] = this.figBox(W, H);
    gl.viewport(0, 0, this.cv.width, this.cv.height);
    gl.uniform2f(this.U.uSize, W, H); gl.uniform1f(this.U.uDpr, this.cv.width / W);
    gl.uniform4f(this.U.uFig, fx, fy, fw, fh);
    const unit = Math.min(W, o.fit === "cover" ? H * 1.4 : W);
    // the piece must stand clear of the curved back of the niche at its sides
    let stand = o.stand * unit;
    if (o.niche === "arch") { const q = clamp((fw / 2) / (W / 2), 0, 0.98); stand = Math.max(stand, o.hollow * unit * (1 - Math.sqrt(1 - q * q)) * 0.9); }
    gl.uniform1f(this.U.uStand, stand); gl.uniform1f(this.U.uDepth, o.depth * unit); gl.uniform1f(this.U.uHollow, o.hollow * unit);
    gl.uniform1f(this.U.uLip, Math.max(4, unit * 0.03));
    gl.uniform1i(this.U.uShape, o.niche === "arch" ? 1 : o.niche === "round" ? 2 : 0);
    gl.uniform4f(this.U.uMat, m.wrap, m.kd, m.ks, m.shin); gl.uniform2f(this.U.uMet, m.metal, m.sat);
    gl.uniform4f(this.U.uStone, STONE.wrap, STONE.kd, STONE.ks, STONE.shin);
    // a metal's photograph is full of the studio's reflections, which are not carving: less of it is read as relief
    gl.uniform1f(this.U.uDetail, o.detail * (fw / this.alb.width) * (m.metal ? 0.5 : 1));
    gl.uniform1f(this.U.uSteps, (phone ? 16 : 32) * [1, 0.75, 0.5][this.level]);
    // one css px is this much of the colour picture's width and height
    gl.uniform2f(this.U.uAlbPx, Math.max(1 / fw, 0.5 / this.alb.width), Math.max(1 / fh, 0.5 / this.alb.height));
    return true;
  }

  /** The length of the frame that followed one in which the piece was drawn: if such frames keep coming slow, the piece
   *  steps down a level (fewer pixels, shorter shadow marches) and is laid out again. */
  pace(dt: number) {
    if (this.level >= 2 || dt > 0.25) return;
    if (++this.runs < 6) return;
    this.slow = dt > 1 / 42 ? this.slow + 1 : Math.max(0, this.slow - 1);
    if (this.slow >= 10) { this.level++; this.slow = 0; this.runs = 0; this.layout(); }
  }

  draw(now: number, ls: LocalLight[]) {
    const dt = this.lastNow ? clamp(now - this.lastNow, 0, 0.1) : 0;
    this.lastNow = now;
    const still = torchStill();
    // the light arrives: from dark, and from far off, so the shadows grow to their length
    const rv = still ? 1 : this.t0 === null || now < this.t0 ? 0 : smooth((now - this.t0) / 2.1);
    this.lamp += (this.lampTo - this.lamp) * (still ? 1 : 1 - Math.exp(-dt * 3));
    if (Math.abs(this.lampTo - this.lamp) < 0.002) this.lamp = this.lampTo;
    const moving = rv < 1 || this.lamp !== this.lampTo;
    const gl = this.gl;
    if (!gl || this.lost) { this.drawFlat(ls, rv); return moving; }
    const o = this.o, R = torchRadius(), unit = Math.min(this.w, o.fit === "cover" ? this.h * 1.4 : this.w);
    const W = this.w, H = this.h, lamp = smooth(this.lamp), torch = 1 - lamp;
    const hz = R * 1.15 * (1 + 2.2 * (1 - rv)) + o.hollow * unit;
    const arr = new Float32Array(16);
    let n = 0;
    const f = R * 1.15 * (1 + 1.6 * lamp) * (Math.max(W, H) > R * 1.6 ? 1 + lamp : 1);
    const put = (x: number, y: number, z: number, I: number) => {
      // how much it gives the nearest point of the piece (as the shader reckons it)
      const dx = x - clamp(x, 0, W), dy = y - clamp(y, 0, H), f0 = (f * f) / (f * f + dx * dx + dy * dy);
      if (n < 4 && I > 0.01 && f0 * f0 * I > 0.003) { arr.set([x, y, z, I], n * 4); n++; }
    };
    // the lamp: high on the left and a little in front, with a weaker light from low on the right
    put(-W * 0.2, -H * 0.06, Math.max(W, H) * 0.95 + o.hollow * unit, 1.3 * lamp * rv);
    put(W * 1.25, H * 0.7, Math.max(W, H) * 0.6 + o.hollow * unit, 0.4 * lamp * rv);
    for (const l of ls) put(l.x, l.y, hz, l.I * o.gain * rv * (this.day ? 0.65 : 1) * torch);
    // the torch is too far off to reach the piece, as it was the last time: the picture already drawn stands
    const dark = !moving && n === 0;
    if (dark && this.dark) return false;
    this.dark = dark;
    gl.uniform4fv(this.U.uL, arr); gl.uniform1i(this.U.uN, n);
    gl.uniform1f(this.U.uAmb, ((this.day ? 0.55 : o.amb) + 0.1 * lamp) * (0.25 + 0.75 * rv));
    gl.uniform1f(this.U.uFall, f * f);
    // under the lamp the niche's stone stays a step darker than the piece, so the piece stands out from it
    gl.uniform1f(this.U.uWallLum, this.day ? 0.66 : 0.4 - 0.09 * lamp);   // a limestone niche by day
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return moving;
  }

  /** no WebGL2: the photograph, still and dim, cut out of a dark niche (the page's own torch glow lies behind it) */
  private drawFlat(_ls: LocalLight[], rv: number) {
    const x = this.flat ?? this.cv.getContext("2d");
    if (!x) return;
    this.flat = x;
    const W = this.cv.width, H = this.cv.height, k = W / this.w, [fx, fy, fw, fh] = this.figBox(this.w, this.h);
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
    if (!this.cut) {
      // the photograph with its own background taken away (the maps' green is the cut-out)
      const c = document.createElement("canvas"), aw = this.alb.width, ah = this.alb.height;
      c.width = aw; c.height = ah;
      const cx = c.getContext("2d", { willReadFrequently: true })!;
      cx.drawImage(this.map, 0, 0, aw, ah);
      const m = cx.getImageData(0, 0, aw, ah);
      cx.drawImage(this.alb, 0, 0);
      const a = cx.getImageData(0, 0, aw, ah);
      for (let i = 0; i < a.data.length; i += 4) a.data[i + 3] = m.data[i + 1];
      cx.putImageData(a, 0, 0);
      this.cut = c;
    }
    x.globalAlpha = (0.25 + 0.75 * rv) * 0.8; x.drawImage(this.cut, fx * k, fy * k, fw * k, fh * k); x.globalAlpha = 1;
  }

  dispose() {
    this.cv.removeEventListener("webglcontextlost", this.onLost);
    this.cv.removeEventListener("webglcontextrestored", this.onRestored);
    const gl = this.gl;
    if (gl) { for (const t of this.tex) gl.deleteTexture(t); if (this.prog) gl.deleteProgram(this.prog); gl.getExtension("WEBGL_lose_context")?.loseContext(); }
    this.gl = null;
  }
}

/** Loads a piece's two files (web/public/images/pieces/lit/) as pictures the GPU can take as they are. */
export async function loadPiece(id: string): Promise<{ alb: Img; map: Img } | null> {
  const get = async (url: string) => {
    try {
      const r = await fetch(url);
      if (!r.ok) return null;
      const b = await r.blob();
      if (typeof createImageBitmap === "function") return await createImageBitmap(b, { premultiplyAlpha: "none", colorSpaceConversion: "none" });
      const i = new Image(); i.src = URL.createObjectURL(b); await i.decode(); return i;
    } catch { return null; }
  };
  const [alb, map] = await Promise.all([get(`/images/pieces/lit/${id}.jpg`), get(`/images/pieces/lit/${id}-m.png`)]);
  return alb && map ? { alb, map } : null;
}
