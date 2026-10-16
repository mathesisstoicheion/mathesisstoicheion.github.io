// The renderer of the site's logo (scripts/make-logo.mjs runs it in a browser page): the name's emblem as a height map
// (its strokes cut into the stone), a colour for each material, and one warm point light (the torch) with cast shadows.
// window.LogoR.render(opts) -> canvas. Three materials: "cut" (cut into the stone), "gilt" (cut and laid with gold, the
// one in use) and "seal" (cut into a round polished seal-stone in a gold rim).
(() => {
  // the emblem's drawing (DESIGN.md, Signature details 1) on a 48 x 40 grid: a wax tablet in its frame, Euclid's first
  // proposition scratched in the wax (the two circles and the equilateral triangle on the line AB), and the stylus standing
  // upright in it like a sundial's pointer. [shape, geometry, fine weight, heavy weight (for small sizes), part]
  const MARK = [
    ["rect", { x: 2.5, y: 10.5, width: 43, height: 27 }, 1.6, 3.2, "frame"],
    ["rect", { x: 6.5, y: 14.5, width: 35, height: 19 }, 0.7, 0, "wax"],
    ["circle", { cx: 20, cy: 27, r: 7 }, 0.9, 1.7, "fig"],
    ["circle", { cx: 27, cy: 27, r: 7 }, 0.9, 1.7, "fig"],
    ["tri", { d: [[20, 27], [27, 27], [23.5, 20.94]] }, 1.1, 1.5, "fig"],
    ["line", { d: [[20, 27], [27, 27]] }, 2, 2.6, "fig"],
    ["line", { d: [[20, 27], [20, 5.5]] }, 1.3, 2.6, "stylus"],
  ];
  const HEAD = { fine: [[18.4, 1.5], [21.6, 1.5], [20.9, 5.5], [19.1, 5.5]], icon: [[17.6, 0.6], [22.4, 0.6], [21.4, 6], [18.6, 6]] };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v), smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  function hash(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
  function vnoise(x, y, s) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
  function fbm(x, y, s, oct = 5) { let f = 0, amp = 0.5, fr = 1, t = 0; for (let i = 0; i < oct; i++) { f += amp * vnoise(x * fr, y * fr, s + i * 17); t += amp; fr *= 2.03; amp *= 0.5; } return f / t; }
  const hex = (h) => [1, 3, 5].map((i) => Math.pow(parseInt(h.slice(i, i + 2), 16) / 255, 2.2));
  const srgb = (v) => Math.round(255 * Math.pow(clamp(v, 0, 1), 1 / 2.2));
  const mix = (a, b, t) => a.map((v, k) => v * (1 - t) + b[k] * t);

  function canvas(W, H) { const c = document.createElement("canvas"); c.width = W; c.height = H; return c; }
  function alpha(c) { const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data, m = new Float32Array(c.width * c.height); for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] / 255; return m; }
  /** how far inside a shape each pixel is, as a fraction of `reach` px (0 at the edge, 1 at reach or deeper): the shape is
   *  drawn by fill(ctx), and eroded by erode(ctx, e) (which draws, with destination-out, a band e px wide round the edge) */
  function inset(W, H, fill, erode, reach, n = 10) {
    const acc = new Float32Array(W * H);
    for (let k = 0; k < n; k++) {
      const c = canvas(W, H), x = c.getContext("2d"); x.fillStyle = x.strokeStyle = "#fff"; fill(x);
      const e = (reach * k) / n; if (e > 0) { x.globalCompositeOperation = "destination-out"; erode(x, e); }
      const m = alpha(c); for (let i = 0; i < m.length; i++) acc[i] += m[i] / n;
    }
    return acc;
  }
  function path(x, el, a, T, sc) {
    x.beginPath();
    if (el === "rect") x.rect(T[0] + a.x * sc, T[1] + a.y * sc, a.width * sc, a.height * sc);
    else if (el === "circle") x.arc(T[0] + a.cx * sc, T[1] + a.cy * sc, a.r * sc, 0, Math.PI * 2);
    else { a.d.forEach(([px, py], i) => (i ? x.lineTo : x.moveTo).call(x, T[0] + px * sc, T[1] + py * sc)); if (el === "tri") x.closePath(); }
  }
  const W8 = (w, wi, weight) => (weight === "icon" ? wi : weight === "mid" ? (w + wi) / 2 : weight === "bold" ? wi * 1.15 : w);
  /** the mark's strokes as a shape: fill draws them at full width; erode draws them `e` narrower on each side */
  function markShape(T, sc, weight, parts, mult = 1) {
    const draw = (x, shrink) => {
      for (const [el, a, w, wi, kind] of MARK) {
        if (!parts.includes(kind)) continue;
        const lw = W8(w, wi, weight) * sc * mult; if (lw <= 0) continue;
        if (shrink != null) { if (shrink * 2 >= lw) { continue; } }
        x.lineCap = "butt"; x.lineJoin = el === "tri" ? "round" : "miter"; x.miterLimit = 4;
        x.lineWidth = shrink != null ? lw - shrink * 2 : lw; path(x, el, a, T, sc); x.stroke();
      }
      if (parts.includes("stylus")) {
        const hd = HEAD[weight === "icon" || weight === "bold" ? "icon" : "fine"]; x.beginPath(); hd.forEach(([px, py], i) => (i ? x.lineTo : x.moveTo).call(x, T[0] + px * sc, T[1] + py * sc)); x.closePath();
        if (shrink != null) { x.save(); x.clip(); x.lineWidth = shrink * 2; x.stroke(); x.restore(); } else x.fill();
      }
    };
    // erosion for strokes: what is left after narrowing is drawn again over a cleared canvas, so erode = clear + redraw
    return { fill: (x) => draw(x, null), erode: (x, e) => { x.globalCompositeOperation = "copy"; x.fillStyle = "rgba(0,0,0,0)"; x.fillRect(0, 0, x.canvas.width, x.canvas.height); x.globalCompositeOperation = "source-over"; x.fillStyle = x.strokeStyle = "#fff"; draw(x, e); } };
  }
  /**
   * o: { W, H, style: "cut" | "gilt" | "seal", tile: true|false (false: only the cut, on a transparent ground, for the
   *   header), radius, markW (how much of W the mark spans), weight: "fine" | "mid" | "icon" | "bold", light: [x, y, z]
   *   px, flat: true (light the flat stone evenly, to sit on the header's wall), wall: hex (the wall's colour, flat mode),
   *   stone, stoneDk, cutStone, grime, depth, gold, goldHi, frost, sealR, rim, intensity, falloff, ambient, noMark }
   */
  function render(o) {
    const W = o.W, H = o.H, N = W * H;
    const sc = o.sc ?? (W * (o.markW ?? 0.78)) / 48;
    const T = o.T ?? [(W - 48 * sc) / 2, (H - 40 * sc) / 2 + 0.4 * sc];
    const wpx = W8(1.2, 2.4, o.weight ?? "mid") * sc;
    const style = o.style, tile = o.tile !== false;
    const h = new Float32Array(N), alb = new Float32Array(N * 3), spec = new Float32Array(N), shin = new Float32Array(N).fill(16), metal = new Float32Array(N), cover = new Float32Array(N);
    // the stone: a soft mottle in colour, a fine grain in the surface
    const st = hex(o.stone ?? "#433729"), stD = hex(o.stoneDk ?? "#261e17"), stL = hex("#4f4234");
    const k1 = (o.mottle ?? 3.2) / W, k2 = (o.grain ?? 70) / W;
    for (let i = 0; i < N; i++) {
      const x = i % W, y = (i / W) | 0;
      const m = fbm(x * k1, y * k1, 3, 5), g = fbm(x * k2, y * k2, 9, 3), p = vnoise(x * k2 * 2.3, y * k2 * 2.3, 51);
      const t = smooth(0.32, 0.72, m);
      const c = mix(mix(stL, st, smooth(0.0, 0.45, m)), stD, t);
      alb.set(o.wall ? hex(o.wall) : c.map((v) => v * (0.92 + 0.16 * g)), i * 3);
      h[i] = (g - 0.5) * 0.5 * (o.rough ?? 1) + (p > 0.93 ? -(p - 0.93) * 18 * (o.rough ?? 1) : 0);
      spec[i] = 0.035;
    }
    const parts = o.noMark ? [] : ["frame", "fig", "stylus"].concat(o.weight === "fine" || o.weight === "mid" ? ["wax"] : []);
    if (style === "cut" || style === "gilt") {
      const sh = markShape(T, sc, o.weight ?? "mid", parts);
      // a cut with steep walls and a narrow floor: how far in from its edge each pixel is, up to the wall's width
      const reach = wpx * 0.5;
      const f = inset(W, H, sh.fill, sh.erode, reach, 9);
      const depth = wpx * (style === "cut" ? 0.85 : 0.65) * (o.depth ?? 1);
      const gold = hex(o.gold ?? "#b39660"), goldHi = hex(o.goldHi ?? "#dcc794"), grime = hex("#1c1612");
      for (let i = 0; i < N; i++) {
        if (f[i] <= 0) continue;
        const x = i % W, y = (i / W) | 0;
        h[i] -= depth * smooth(0, 0.85, f[i]);
        cover[i] = clamp(f[i] * 9, 0, 1);
        const floor = smooth(0.55, 0.95, f[i]);
        if (style === "cut" && o.cutStone) { const cs = hex(o.cutStone), q = 0.9 + 0.2 * fbm(x * 0.4, y * 0.4, 77, 2); alb.set(mix(alb.subarray(i * 3, i * 3 + 3), cs.map((v) => v * q), smooth(0.05, 0.5, f[i])), i * 3); }
        else if (style === "cut") { alb.set(mix(alb.subarray(i * 3, i * 3 + 3), mix(alb.subarray(i * 3, i * 3 + 3), grime, o.grime ?? 0.45), smooth(0.1, 0.6, f[i])), i * 3); }
        else {
          const leaf = smooth(0.3, 0.7, f[i]), q = fbm(x * 0.7, y * 0.7, 21, 2);
          alb.set(mix(alb.subarray(i * 3, i * 3 + 3), mix(gold, goldHi, q * 0.5), leaf), i * 3);
          spec[i] = 0.035 * (1 - leaf) + 0.85 * leaf; shin[i] = 16 * (1 - leaf) + 34 * leaf; metal[i] = leaf;
          h[i] += floor * 0.0;
        }
      }
    } else if (style === "seal") {
      // a round sealstone of dark polished stone in a gold rim, the mark cut into it (intaglio): the cut is matte and
      // paler than the polish round it
      const cx = W / 2, cy = H / 2, Ro = Math.min(W, H) * (o.sealR ?? 0.47), Ri = Ro * (o.rim ?? 0.92);
      const sh = markShape(T, sc, o.weight ?? "mid", parts);
      const f = inset(W, H, sh.fill, sh.erode, wpx * 0.5, 9);
      const goldR = hex("#b39660"), goldRHi = hex("#dcc794"), agate = hex("#2a140c"), agate2 = hex("#4a2416"), frost = hex(o.frost ?? "#a67e5c");
      for (let i = 0; i < N; i++) {
        const x = i % W, y = (i / W) | 0, r = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        if (r > Ro + 1) continue;
        const edgeA = clamp(Ro + 0.5 - r, 0, 1);
        cover[i] = edgeA;
        if (r >= Ri) {
          // the rim: a rounded gold band
          const u = (r - (Ri + Ro) / 2) / ((Ro - Ri) / 2);
          h[i] = (Ro - Ri) * 0.45 * Math.sqrt(Math.max(0, 1 - u * u)) + (Ro - Ri) * 0.2;
          alb.set(mix(goldR, goldRHi, 0.3 + 0.3 * fbm(x * 0.5, y * 0.5, 13, 2)), i * 3); spec[i] = 0.9; shin[i] = 36; metal[i] = 1;
        } else {
          // the stone: domed and polished, with faint bands
          const d = r / Ri;
          h[i] = Ri * 0.035 * Math.sqrt(Math.max(0, 1 - d * d));
          const band = 0.5 + 0.5 * Math.sin((x * 0.6 + y) * (14 / W) + fbm(x * (3 / W), y * (3 / W), 41, 4) * 7);
          alb.set(mix(agate, agate2, band * 0.7), i * 3); spec[i] = 0.3; shin[i] = 150;
          if (f[i] > 0) {
            h[i] -= wpx * 0.75 * smooth(0, 0.85, f[i]);
            const c = smooth(0.05, 0.5, f[i]);
            alb.set(mix(alb.subarray(i * 3, i * 3 + 3), frost, c * 0.75), i * 3); spec[i] = spec[i] * (1 - c) + 0.04 * c; shin[i] = 70 * (1 - c) + 10 * c;
          }
        }
      }
    }
    // the light: one warm torch, with a little of the room's cool dark
    const [lx, ly, lz] = o.light ?? [W * 0.12, H * -0.06, W * 0.62];
    const Lc = hex(o.lightColor ?? "#ffd6a2"), Ac = hex("#2b2420");
    const R = o.falloff ?? W * 0.85, amb = o.ambient ?? 0.28, I0 = o.intensity ?? 1.9;
    const out = canvas(W, H), ox = out.getContext("2d"), img = ox.createImageData(W, H), D = img.data;
    const flatK = o.flat ? (() => { const d = Math.hypot(lx - W / 2, ly - H / 2, lz); return 1 / (amb + (I0 / (1 + (d / R) ** 2)) * (lz / d)); })() : 1;
    const reach = W * 0.18;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const hx = (h[y * W + Math.min(W - 1, x + 1)] - h[y * W + Math.max(0, x - 1)]) / 2, hy = (h[Math.min(H - 1, y + 1) * W + x] - h[Math.max(0, y - 1) * W + x]) / 2;
      let nx = -hx, ny = -hy, nz = 1; const nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
      let Lx = lx - x, Ly = ly - y, Lz = lz - h[i]; const dl = Math.hypot(Lx, Ly, Lz); Lx /= dl; Ly /= dl; Lz /= dl;
      const att = o.flat ? (I0 / (1 + (Math.hypot(lx - W / 2, ly - H / 2, lz) / R) ** 2)) : I0 / (1 + (dl / R) ** 2);
      // cast shadow: march toward the light across the height map
      let shd = 1;
      const pl = Math.hypot(Lx, Ly), slope = Lz / Math.max(1e-6, pl);
      for (let s = 1; s < reach; s += 0.75) {
        const px = x + (Lx / pl) * s, py = y + (Ly / pl) * s; if (px < 0 || py < 0 || px >= W - 1 || py >= H - 1) break;
        const over = h[(py | 0) * W + (px | 0)] - (h[i] + s * slope); if (over > 0) { shd = Math.min(shd, clamp(1 - over / 1.2, 0, 1)); if (shd <= 0) break; }
      }
      const ndl = Math.max(0, nx * Lx + ny * Ly + nz * Lz) * shd;
      const hzv = Lz + 1, hn = Math.hypot(Lx, Ly, hzv), ndh = Math.max(0, (nx * Lx + ny * Ly + nz * hzv) / hn);
      const sp = spec[i] * Math.pow(ndh, shin[i]) * shd * att;
      const a = alb.subarray(i * 3, i * 3 + 3), am = Math.max(a[0], a[1], a[2], 1e-4);
      let rgb = [0, 1, 2].map((k) => (a[k] * (amb * Ac[k] / 0.03 * 0.03 + ndl * att * Lc[k]) + sp * Lc[k] * (metal[i] * (a[k] / am) + (1 - metal[i]))) * flatK);
      let A = 1;
      if (tile) {
        const qx = Math.abs(x + 0.5 - W / 2) - (W / 2 - (o.radius ?? 0)), qy = Math.abs(y + 0.5 - H / 2) - (H / 2 - (o.radius ?? 0));
        A = clamp(0.5 - (Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - (o.radius ?? 0)), 0, 1);
      } else {
        // only the cut is drawn; the flat stone round it is the header's own wall, so it fades out where nothing is cut
        A = cover[i];
      }
      D[i * 4] = srgb(rgb[0]); D[i * 4 + 1] = srgb(rgb[1]); D[i * 4 + 2] = srgb(rgb[2]); D[i * 4 + 3] = Math.round(A * 255);
    }
    ox.putImageData(img, 0, 0);
    return out;
  }
  window.LogoR = { render };
})();
