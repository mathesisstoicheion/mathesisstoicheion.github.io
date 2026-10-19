/**
 * The engraving's lines bend away from a finger or the pointer, as design A's did (the owner, 2026-10-19: "Bring back the
 * interactive deforming of the art pieces when you touch them or move your mouse over them").
 *
 * The lines are a CSS mask, which cannot bend, so near the pointer a small round patch takes over: a canvas that paints
 * everything the view shows there (the red ground and its hatching, the flare's halo and rays, and the lines) with the
 * lines pushed up or down away from the pointer, most at its centre and not at all at its rim, where it fades into the
 * still picture under it without a seam. Nothing of the large picture is touched or repainted; only the patch is drawn,
 * about thirty times a second, and only while a pointer is near.
 */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Where things are on screen: the lines' box (centre and size), the flare's square side and its turn (degrees). */
export interface Geometry { cx: number; cy: number; w: number; h: number; flare: number; spin: number }
interface Target { lines: HTMLElement; bend: HTMLCanvasElement | null; box?: HTMLElement | null }   // box: a window's own box (none for the art behind the page)
type RGBA = [number, number, number, number];

export class Bend {
  private x = -9999;
  private y = -9999;
  private w = 0;          // how strongly it bends: eases in while a pointer is there, out after it leaves
  private on = false;     // a pointer is there now
  private img: HTMLImageElement | null = null;
  private url = "";
  private arts = new Map<string, { la: Uint8Array; w: number; h: number }>();   // the whole picture's opacity, at the size it is drawn
  private out: ImageData | null = null;
  private tc = document.createElement("canvas");
  private gc = document.createElement("canvas");
  private flareImg: HTMLImageElement | null = null;
  private c: { ink: RGBA; ray: RGBA; halo: RGBA; ground: RGBA; hatch: RGBA } | null = null;
  private shown = false;
  private drawn = 0;
  private disp: Float32Array | null = null;
  private rim: Uint8ClampedArray | null = null;
  private tKey = "";
  private idx: Int32Array | null = null;   // the pixels inside the round patch
  private bg: Uint8ClampedArray | null = null;   // what the view shows under the lines over a square round the patch (RGBA)
  private bgKey = "";
  private bgX = 0;
  private bgY = 0;
  private bgW = 0;
  private la: Uint8Array | null = null;   // the still lines' opacity over the whole picture, at the size it is drawn (from arts)
  private laX = 0;   // where that picture's corner is, in device pixels
  private laY = 0;
  private laW = 0;
  private laH = 0;
  private sy = NaN;
  private syAt = 0;   // when the page last moved

  /** A pointer is at x, y (or has gone, with on = false). */
  point(x: number, y: number, on: boolean) {
    if (on) { this.x = x; this.y = y; }
    this.on = on;
  }

  /** Whether a pointer is there to bend the lines (when not, and nothing is easing back, the stage need not call). */
  wanted() {
    return this.on || this.w > 0;
  }

  /** The look's colours (read again whenever a bend starts, so a change of look is picked up). */
  readColours(el: HTMLElement) {
    const cs = getComputedStyle(el), x = document.createElement("canvas").getContext("2d")!;
    const rgba = (v: string): RGBA => {
      x.fillStyle = "#000"; x.fillStyle = v.trim() || "transparent";
      x.clearRect(0, 0, 1, 1); x.fillRect(0, 0, 1, 1);
      const d = x.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    };
    x.canvas.width = x.canvas.height = 1;
    const v = (n: string) => cs.getPropertyValue(n);
    this.c = { ink: rgba(v("--art-ink")), ray: rgba(v("--art-ink-lit")), halo: rgba(v("--art-flare")), ground: rgba(v("--art-ground")), hatch: rgba(v("--art-hatch")) };
  }

  /** Draws one frame; true while it still needs frames (easing in or out, or a pointer there). */
  frame(dt: number, g: Geometry, targets: Target[], still: boolean): boolean {
    const goal = this.on && !still ? 1 : 0;
    this.w += (goal - this.w) * Math.min(1, dt * (goal ? 6 : 3));
    if (this.w < 0.01 && !goal) { this.w = 0; this.hide(targets); return false; }
    const R = Math.min(90, innerWidth * 0.23);
    // only where the pointer is over the art or its flare
    const reach = Math.max(g.w, g.h, g.flare) / 2 + R;
    if (Math.abs(this.x - g.cx) > reach || Math.abs(this.y - g.cy) > reach) { this.hide(targets); return goal > 0; }
    // while the page moves (a finger that scrolls, a wheel) the lines rest; the bend grows back once the page is still
    if (scrollY !== this.sy) { this.sy = scrollY; this.syAt = performance.now(); }
    if (performance.now() - this.syAt < 150) { this.w = 0; this.hide(targets); return goal > 0; }
    const url = (targets[0]?.lines.style.maskImage.match(/url\(["']?([^"')]+)/) ?? [])[1];
    if (!url || !this.c) return false;
    if (url !== this.url) { this.url = url; this.img = new Image(); this.img.src = url; }
    if (!this.flareImg) { this.flareImg = new Image(); this.flareImg.src = "/images/flare.svg"; }
    if (!this.img?.complete || !this.img.naturalWidth || !this.flareImg.complete || !this.flareImg.naturalWidth) return true;
    // about thirty new pictures a second are enough for a bend that follows a hand, and keep a slow phone smooth
    const now = performance.now();
    if (now - this.drawn < 32) return true;
    this.drawn = now;

    // drawn at up to one and a half device pixels to the CSS pixel, so the patch stays nearly as sharp as the picture; the
    // patch sits on the device's pixel grid, so it lines up with the picture under it
    const P = Math.min(1.5, devicePixelRatio || 1), Ra = R * 0.86, side = Math.ceil(2 * Ra * P);
    const px0 = Math.round((this.x - Ra) * P), py0 = Math.round((this.y - Ra) * P);   // the patch's corner, in device pixels
    this.tables(R, Ra, P, side);
    this.ground(g, P, side, px0, py0);
    if (!this.out || this.out.width !== side) this.out = new ImageData(side, side);
    const o = this.out.data, ink = this.c.ink, push = 14 * this.w * P, D = this.disp!, RIM = this.rim!, G = this.bg!, A = this.la!;
    const gw = this.bgW, gx = px0 - this.bgX, gy = py0 - this.bgY, aw = this.laW, ah = this.laH, ax = px0 - this.laX, ay = py0 - this.laY;
    // only the pixels inside the round patch (the rest stay clear)
    const IX = this.idx!, ka = ink[3] / 255;
    for (let m = 0; m < IX.length; m++) {
      const n = IX[m], j = (n / side) | 0, i = n - j * side, at = n * 4;
      // the line that ends up here came from a little nearer the pointer
      const sy = j + ay - D[n] * push, y0 = Math.floor(sy), t = sy - y0, xx = i + ax, s0 = y0 * aw + xx;
      const inX = xx >= 0 && xx < aw, a0 = inX && y0 >= 0 && y0 < ah ? A[s0] : 0, a1 = inX && y0 + 1 >= 0 && y0 + 1 < ah ? A[s0 + aw] : 0;
      const al = (a0 + (a1 - a0) * t) * ka, q = ((j + gy) * gw + gx + i) * 4;
      o[at] = G[q] + (ink[0] - G[q]) * al; o[at + 1] = G[q + 1] + (ink[1] - G[q + 1]) * al; o[at + 2] = G[q + 2] + (ink[2] - G[q + 2]) * al;
      o[at + 3] = RIM[n];
    }
    // a window shows the patch where it overlaps it; the art behind the page needs it only where no window covers it all
    let covered = false;
    const near = targets.filter((t) => {
      if (!t.box) return true;
      const rb = t.box.getBoundingClientRect();
      if (this.x + R < rb.left || this.x - R > rb.right || this.y + R < rb.top || this.y - R > rb.bottom) return false;
      if (this.x - R >= rb.left && this.x + R <= rb.right && this.y - R >= rb.top && this.y + R <= rb.bottom) covered = true;
      return true;
    });
    for (const t of targets) {
      const c = t.bend;
      if (!c) continue;
      if (!near.includes(t) || (!t.box && covered)) { c.style.display = "none"; continue; }
      if (c.width !== side) { c.width = c.height = side; c.style.width = c.style.height = `${side / P}px`; }
      c.getContext("2d")!.putImageData(this.out, 0, 0);
      c.style.transform = `translate3d(${px0 / P}px, ${py0 / P}px, 0)`;
      c.style.display = "block";
    }
    this.shown = true;
    return true;
  }

  /** For each pixel of the patch: how far its line is pushed (per unit of push) and how opaque the patch is there. */
  private tables(R: number, Ra: number, P: number, side: number) {
    if (this.disp && this.tKey === `${R}|${P}`) return;
    this.tKey = `${R}|${P}`;
    this.disp = new Float32Array(side * side); this.rim = new Uint8ClampedArray(side * side);
    const EDGE = 6, inside: number[] = [];
    // the patch ends where the lines move by less than a third of a pixel, and fades out over its last few pixels
    for (let j = 0, n = 0; j < side; j++) for (let i = 0; i < side; i++, n++) {
      const dx = (i + 0.5) / P - Ra, dy = (j + 0.5) / P - Ra, d = Math.sqrt(dx * dx + dy * dy);
      if (d >= Ra) continue;
      this.disp[n] = (dy / (d || 1)) * (1 - d / R) ** 2;
      this.rim[n] = Math.max(1, 255 * Math.min(1, (Ra - d) / EDGE));
      inside.push(n);
    }
    this.idx = Int32Array.from(inside);
    this.out = null;
  }

  /**
   * What the view shows under the lines round the patch: the red ground and its hatching (a 1px stripe every 7px across
   * the diagonal, as the CSS draws it), the flare's halo and its rays (turned with the page). Painted for a square a good
   * margin larger than the patch and kept while the pointer moves within it, so a frame usually only bends the lines.
   */
  private ground(g: Geometry, P: number, side: number, px0: number, py0: number) {
    const key = `${g.cx}|${g.cy}|${g.w}|${g.h}|${g.flare}|${g.spin}|${P}|${this.url}|${innerWidth}|${innerHeight}|${this.c!.ground}|${this.c!.halo}|${this.c!.ray}|${this.c!.hatch}`, pad = Math.ceil(side / 2);
    if (this.bg && key === this.bgKey && px0 >= this.bgX && py0 >= this.bgY && px0 + side <= this.bgX + this.bgW && py0 + side <= this.bgY + this.bgW) return;
    this.bgKey = key;
    const S = side + 2 * pad;
    this.bgX = px0 - pad; this.bgY = py0 - pad; this.bgW = S;
    // the ground and its hatching, worked out here; the halo and the rays drawn over them by the canvas, as the page does
    const { ray, halo, ground, hatch } = this.c!, W = innerWidth, H = innerHeight;
    const gc = this.gc, x = gc.getContext("2d", { willReadFrequently: true })!;
    if (gc.width !== S) gc.width = gc.height = S;
    // the hatching depends only on how far a pixel is along the diagonal, so one strip of colours serves every row
    const id = x.createImageData(S, S), B = new Uint32Array(id.data.buffer), L = new Uint32Array(2 * S), L8 = new Uint8ClampedArray(L.buffer);
    for (let k = 0; k < 2 * S; k++) {
      let f = ((W + H - (this.bgX + this.bgY + k + 1) / P) * 0.70710678) % 7;
      if (f > 3.5) f -= 7;
      if (f < -3.5) f += 7;
      const al = clamp(Math.min(f + 0.5, 1.5 - f), 0, 1) * hatch[3], n = k * 4;
      L8[n] = ground[0] + (hatch[0] - ground[0]) * al; L8[n + 1] = ground[1] + (hatch[1] - ground[1]) * al; L8[n + 2] = ground[2] + (hatch[2] - ground[2]) * al; L8[n + 3] = 255;
    }
    for (let j = 0; j < S; j++) B.set(L.subarray(j, j + S), j * S);
    x.putImageData(id, 0, 0);
    x.setTransform(P, 0, 0, P, -this.bgX, -this.bgY);
    const haloR = g.flare * 0.38, hg = x.createRadialGradient(g.cx, g.cy, 0, g.cx, g.cy, haloR), hc = `${halo[0]},${halo[1]},${halo[2]}`;
    hg.addColorStop(0, `rgba(${hc},${halo[3]})`); hg.addColorStop(0.6, `rgba(${hc},${halo[3] * 0.35})`); hg.addColorStop(1, `rgba(${hc},0)`);
    x.fillStyle = hg; x.fillRect(g.cx - haloR, g.cy - haloR, haloR * 2, haloR * 2);
    // the rays: the flare's drawing, turned, filled with the look's colour and laid on at half strength
    const tc = this.tc, t = tc.getContext("2d")!;
    if (tc.width !== S) tc.width = tc.height = S;
    t.setTransform(1, 0, 0, 1, 0, 0); t.globalCompositeOperation = "source-over"; t.clearRect(0, 0, S, S);
    t.setTransform(P, 0, 0, P, -this.bgX, -this.bgY); t.translate(g.cx, g.cy); t.rotate((g.spin * Math.PI) / 180);
    t.drawImage(this.flareImg!, -g.flare / 2, -g.flare / 2, g.flare, g.flare);
    t.setTransform(1, 0, 0, 1, 0, 0); t.globalCompositeOperation = "source-in";
    t.fillStyle = `rgba(${ray[0]},${ray[1]},${ray[2]},${ray[3]})`; t.fillRect(0, 0, S, S);
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 0.5; x.drawImage(tc, 0, 0); x.globalAlpha = 1;
    this.bg = x.getImageData(0, 0, S, S).data;
    // the still lines: the mask is drawn "contain" in its box; the whole picture is drawn once at that size and its
    // opacity kept for the bend to read from. Moving the page only shifts it, so a few drawings (one for each fraction of
    // a pixel it lands on) serve until its size changes
    const img = this.img!, k = Math.min(g.w / img.naturalWidth, g.h / img.naturalHeight), iw = img.naturalWidth * k, ih = img.naturalHeight * k;
    const ix = (g.cx - iw / 2) * P, iy = (g.cy - ih / 2) * P, X0 = Math.floor(ix), Y0 = Math.floor(iy);
    const ak = `${this.url}|${iw}|${ih}|${P}|${(ix - X0).toFixed(2)}|${(iy - Y0).toFixed(2)}`;
    let a = this.arts.get(ak);
    if (!a) {
      if (this.arts.size >= 4) this.arts.clear();
      const c = document.createElement("canvas"), w = Math.ceil(ix + iw * P) - X0, h = Math.ceil(iy + ih * P) - Y0;
      c.width = w; c.height = h;
      const cx = c.getContext("2d", { willReadFrequently: true })!;
      cx.drawImage(img, ix - X0, iy - Y0, iw * P, ih * P);
      const d = cx.getImageData(0, 0, w, h).data, la = new Uint8Array(w * h);
      for (let n = 0, m = 3; n < la.length; n++, m += 4) la[n] = d[m];
      a = { la, w, h };
      this.arts.set(ak, a);
    }
    this.la = a.la; this.laW = a.w; this.laH = a.h; this.laX = X0; this.laY = Y0;
  }

  private hide(targets: Target[]) {
    if (!this.shown) return;
    this.shown = false;
    for (const t of targets) if (t.bend) t.bend.style.display = "none";
  }
}
