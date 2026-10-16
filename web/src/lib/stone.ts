/**
 * The stone (DESIGN.md: Texture and light): one still tile of mottled, pitted stone, 420 px square, laid over the wall's
 * colour on <html> as --tex (globals.css). It never moves. It is drawn from a fixed seed (the same stone every time)
 * by scripts/make-stone.mjs, once, into public/images/stone.webp, which the page simply loads: drawing it in the browser
 * on every visit, and then laying it on <html> (which restyled every element of the page), held the page up just after
 * it appeared.
 */
const S = 420;

export function make(): HTMLCanvasElement {
  const c = document.createElement("canvas"); c.width = S; c.height = S;
  const x = c.getContext("2d")!, im = x.createImageData(S, S), d = im.data;
  let seed = 19;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const oct = ([[3, 0.2], [7, 0.16], [14, 0.14], [30, 0.12], [70, 0.09], [140, 0.08], [210, 0.06]] as const).map(([n, a]) => {
    const g = new Float32Array(n * n); for (let i = 0; i < g.length; i++) g[i] = rnd() * 2 - 1; return { n, a, g };
  });
  const val = (o: { n: number; g: Float32Array }, u: number, v: number) => {
    const n = o.n, fx = u * n, fy = v * n, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const i0 = x0 % n, i1 = (i0 + 1) % n, j0 = y0 % n, j1 = (j0 + 1) % n, g = o.g;
    const a = g[j0 * n + i0], b = g[j0 * n + i1], cc = g[j1 * n + i0], e = g[j1 * n + i1];
    return a + (b - a) * sx + (cc - a) * sy + (a - b - cc + e) * sx * sy;
  };
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
    let h = 0; for (const o of oct) h += val(o, i / S, j / S) * o.a;
    h += (rnd() - 0.5) * 0.26;
    const p = (j * S + i) * 4;
    // raised grain catches a little warm light; hollows hold shadow
    if (h > 0) { d[p] = 255; d[p + 1] = 226; d[p + 2] = 192; d[p + 3] = Math.min(255, h * 34); }
    else d[p + 3] = Math.min(255, -h * 130);
  }
  x.putImageData(im, 0, 0);
  // pits: a dark hollow with a faint lit lip, wrapped round the edges so the tile repeats without a seam
  for (let k = 0; k < 170; k++) {
    const px = rnd() * S, py = rnd() * S, r = 0.4 + rnd() * rnd() * 1.7, a = 0.12 + rnd() * 0.24;
    for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
      x.fillStyle = `rgba(255,228,196,${(a * 0.16).toFixed(3)})`; x.beginPath(); x.arc(px + ox + r * 0.45, py + oy + r * 0.55, r * 0.9, 0, 7); x.fill();
      x.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`; x.beginPath(); x.arc(px + ox, py + oy, r, 0, 7); x.fill();
    }
  }
  return c;
}
