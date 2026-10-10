"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useSettings, prefersReducedMotion } from "@/lib/settings";
import {
  BANDS, BAND_NAMES, BARE_DESIGN, DEFAULT_DESIGN, FRIEZES, FRIEZE_NAMES, MAX_CRACKS, MAX_POINTS, MORE_COLOURS, PALETTE, WORD_MAX,
  loadDesign, pointCount, saveDesign, toGreekCaps, type Band, type Crack, type Design, type Frieze, type Stroke,
} from "@/lib/amphora";
import { makePainter, TW, TH, type Rect } from "./amphora/paint";
import { clink, makeChips } from "./amphora/effects";
import { onGesture, pinchFactor, wheelFactor, wheelReader } from "@/lib/wheel";
import type { Fracture } from "./amphora/cracks";
import styles from "./Amphora.module.css";

/**
 * A neck-amphora turned on a lathe in WebGL and painted in the manner of Athenian pots: black gloss on
 * clay, with added red. It turns slowly and can be dragged; on phones it also turns as the phone is tilted,
 * where the phone allows it (an iPhone asks first). "Paint it yourself" opens a studio: brush, scratch and
 * rub out straight onto the pot, choose its patterns and style, write its words. The visitor's vase is kept
 * in this browser (lib/amphora.ts). three.js is loaded only when the vase comes into view.
 */

type Tool = "brush" | "scratch" | "rub" | "strike" | "turn";
type Repaint = "base" | "hand" | "all";
type Api = { repaint(what: Repaint): void; picture(): string; nudge(turn: number, zoomBy: number): void; resetView(): void };

const SIZES = [{ name: "Fine", w: 3 }, { name: "Medium", w: 9 }, { name: "Broad", w: 20 }, { name: "Huge", w: 40 }] as const;
/** a blow's strength from how long it was held: a tap is light, about a second and a half is the hardest */
const forceOf = (ms: number) => Math.max(0.12, Math.min(1, 0.12 + ms / 1500));
const SCRATCH_W = 1.6;
const TOOLS: { id: Tool; name: string; hint: string }[] = [
  { id: "brush", name: "Paint", hint: "Paint straight onto the vase. To turn it, use Turn, the arrows on the vase, or two fingers (on a trackpad or a phone); pinch to come closer." },
  { id: "scratch", name: "Scratch", hint: "Scratch fine lines through to the clay, as black-figure painters did for muscles, folds of cloth and feathers." },
  { id: "rub", name: "Rub out", hint: "Rub out your own brushwork. The patterns underneath come back." },
  { id: "strike", name: "Strike", hint: "Tap the vase to strike it; press and hold for a harder blow. Cracks run out from the blow, split as they go, and stop where they meet another crack. In antiquity a cracked pot was often mended with lead clamps set in drilled holes." },
  { id: "turn", name: "Turn", hint: "Drag to turn the vase, and up or down to move along it; on a trackpad, two fingers do the same. Pinch, or the mouse wheel, to come closer." },
];
const ZONES: { key: "neck" | "shoulder" | "lower" | "foot"; name: string }[] = [
  { key: "neck", name: "Neck" }, { key: "shoulder", name: "Shoulder" }, { key: "lower", name: "Lower band" }, { key: "foot", name: "Foot" },
];

const isDefault = (d: Design) => d.strokes.length === 0 && JSON.stringify(d) === JSON.stringify(DEFAULT_DESIGN);
const describe = (d: Design) =>
  `A neck-amphora painted in the ${d.style}-figure style${d.strokes.length ? ", with brushwork added by hand" : ""}.` +
  (d.words.some(Boolean) ? ` Its painted words read ${d.words.filter(Boolean).join(" and ")}.` : "");
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

function Icon({ d }: { d: string }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}
const ICON = {
  brush: "M14.5 4.5l5 5-8.2 8.2a3 3 0 01-2.1.9H6.5v-2.7a3 3 0 01.9-2.1zM4 21c1.5 0 2.5-1 2.5-2.4",
  left: "M9 7H4V2M4.6 7A8.5 8.5 0 1112 20.5",
  right: "M15 7h5V2M19.4 7A8.5 8.5 0 1012 20.5",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  undo: "M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3",
  redo: "M15 14l5-5-5-5M20 9H10a6 6 0 000 12h3",
};

export default function Amphora() {
  const stageRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const motion = useSettings((s) => s.motion);
  const reduceRef = useRef(false);
  useEffect(() => { reduceRef.current = prefersReducedMotion(motion); }, [motion]);

  // tilting the phone left or right turns the vase that way (on top of its own slow turn)
  const tiltRef = useRef(0);
  const [tilt, setTilt] = useState<"off" | "ask" | "on">("off");
  const stopTilt = useRef<() => void>(() => {});
  const listenTilt = () => {
    const on = (e: DeviceOrientationEvent) => {
      if (e.gamma === null) return;
      tiltRef.current = Math.max(-1, Math.min(1, e.gamma / 40));
      setTilt((t) => (t === "on" ? t : "on"));
    };
    addEventListener("deviceorientation", on);
    stopTilt.current = () => removeEventListener("deviceorientation", on);
  };
  useEffect(() => {
    if (typeof DeviceOrientationEvent === "undefined" || !matchMedia("(pointer: coarse)").matches) return;
    const D = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof D.requestPermission === "function") setTilt("ask");
    else listenTilt();
    return () => stopTilt.current();
  }, []);
  const askTilt = () => {
    const D = DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> };
    D.requestPermission().then((r) => { if (r === "granted") listenTilt(); else setTilt("off"); }, () => setTilt("off"));
  };

  // ---- the design, its history, and the studio --------------------------------------------------
  const [design, setDesign] = useState<Design>(DEFAULT_DESIGN);
  const designRef = useRef(design);
  const [custom, setCustom] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const [studio, setStudio] = useState(false);
  const studioRef = useRef(false);
  const [slotH, setSlotH] = useState(0);
  const [tool, setTool] = useState<Tool>("brush");
  /** the brush's colour: one of the Athenian colours (an index), or any other (c = -2, with its hex) */
  const [colour, setColour] = useState<{ c: number; h?: string; name: string }>({ c: 0, name: PALETTE[0].name });
  const [picked, setPicked] = useState<string[]>([]);   // colours chosen with the colour picker, latest first
  const [size, setSize] = useState(1);
  const [sound, setSound] = useState(true);
  const [charge, setCharge] = useState<{ x: number; y: number; id: number } | null>(null);
  const brushRef = useRef({ tool: "brush" as Tool, c: 0, h: undefined as string | undefined, w: SIZES[1].w as number, sound: true });
  useEffect(() => {
    brushRef.current = { tool, c: colour.c, h: colour.h, w: tool === "scratch" ? SCRATCH_W : SIZES[size].w, sound };
  }, [tool, colour, size, sound]);
  const pickAny = (hex: string) => {
    setColour({ c: -2, h: hex, name: "Your colour" });
    setPicked((p) => [hex, ...p.filter((x) => x !== hex)].slice(0, 8));
  };
  const undoRef = useRef<Design[]>([]);
  const redoRef = useRef<Design[]>([]);
  const [hist, setHist] = useState({ undo: 0, redo: 0 });
  const [note, setNote] = useState("");
  const api = useRef<Api | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastTyped = useRef(0);

  const apply = (next: Design, what: Repaint | null) => {
    designRef.current = next;
    setDesign(next);
    if (what) api.current?.repaint(what);
    setHist({ undo: undoRef.current.length, redo: redoRef.current.length });
    setCustom(!isDefault(next));
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const d = designRef.current;
      if (!saveDesign(isDefault(d) ? null : d)) setNote("This browser would not keep your vase (it may be too detailed, or storage is switched off). Save a picture to keep it.");
    }, 400);
  };
  const commit = (next: Design, what: Repaint | null) => {
    undoRef.current.push(designRef.current);
    if (undoRef.current.length > 80) undoRef.current.shift();
    redoRef.current = [];
    apply(next, what);
  };
  const undo = () => { const prev = undoRef.current.pop(); if (!prev) return; redoRef.current.push(designRef.current); apply(prev, "all"); };
  const redo = () => { const next = redoRef.current.pop(); if (!next) return; undoRef.current.push(designRef.current); apply(next, "all"); };
  const set = (patch: Partial<Design>) => commit({ ...designRef.current, ...patch }, "base");
  const setWord = (i: 0 | 1, raw: string, at: number) => {
    const words = [...designRef.current.words] as [string, string];
    words[i] = toGreekCaps(raw);
    const next = { ...designRef.current, words };
    // a word typed letter by letter is one step to undo, not one per letter
    if (at - lastTyped.current < 1500 && undoRef.current.length) apply(next, "base"); else commit(next, "base");
    lastTyped.current = at;
  };

  const open = () => {
    if (figRef.current) setSlotH(figRef.current.offsetHeight);
    studioRef.current = true;
    setStudio(true);
  };
  const close = () => {
    studioRef.current = false;
    setStudio(false);
    api.current?.resetView();
    requestAnimationFrame(() => openBtnRef.current?.focus({ preventScroll: true }));
  };
  // the three.js effect calls these, so they always see the latest design
  const handlers = useRef({
    stroke: (s: Stroke) => { void s; }, undo, redo, close: () => {},
    crack: (c: Crack): boolean => { void c; return false; },
    charge: (at: { x: number; y: number } | null) => { void at; },
  });
  useEffect(() => {
    handlers.current.stroke = (s: Stroke) => {
      const d = designRef.current;
      if (pointCount(d) + s.p.length / 3 > MAX_POINTS) {
        setNote("Your vase is as detailed as this browser can keep. Undo some strokes, or rub out, to paint more.");
        api.current?.repaint("hand");
        return;
      }
      commit({ ...d, strokes: [...d.strokes, s] }, null);
    };
    handlers.current.crack = (c: Crack) => {
      const d = designRef.current;
      if (d.cracks.length >= MAX_CRACKS) { setNote("The vase cannot take another blow. Mend some cracks (Undo, or Mend all cracks) first."); return false; }
      commit({ ...d, cracks: [...d.cracks, c] }, null);
      return true;
    };
    handlers.current.charge = (at) => setCharge(at ? { ...at, id: Date.now() } : null);
    handlers.current.undo = undo;
    handlers.current.redo = redo;
    handlers.current.close = close;
  });

  useEffect(() => {
    if (!studio) return;
    const html = document.documentElement, was = html.style.overflow;
    html.style.overflow = "hidden";
    const canvas = stageRef.current?.querySelector("canvas");
    if (canvas) canvas.tabIndex = 0;
    figRef.current?.querySelector<HTMLElement>("[data-first]")?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { handlers.current.close(); return; }
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement;
      if (!typing && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); if (e.shiftKey) handlers.current.redo(); else handlers.current.undo(); }
      else if (!typing && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") { e.preventDefault(); handlers.current.redo(); }
    };
    addEventListener("keydown", key);
    return () => { html.style.overflow = was; removeEventListener("keydown", key); if (canvas) canvas.tabIndex = -1; };
  }, [studio]);

  const savePicture = () => {
    const url = api.current?.picture();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url; a.download = "my-vase.png"; a.click();
  };

  // ---- the vase -----------------------------------------------------------------------------------
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let disposed = false;
    let cleanup = () => {};

    const begin = () => import("three").then((THREE) => {
      if (disposed) return;
      // the visitor's own vase, if they have painted one (read here, after the page has been drawn as built)
      const saved = loadDesign();
      if (saved) { designRef.current = saved; setDesign(saved); setCustom(!isDefault(saved)); }
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); } catch { setNoGL(true); return; }
      // sharp on every screen, but never more pixels than the device can draw smoothly (see the frame loop)
      // sharp, within a budget of about four million pixels a frame (a full-screen studio on a fine screen would
      // otherwise ask the graphics card for three times that, sixty times a second)
      const maxRatio = () => {
        const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
        return Math.max(1, Math.min(devicePixelRatio || 1, 2, Math.sqrt(4_000_000 / (w * h))));
      };
      let ratio = maxRatio();
      renderer.setPixelRatio(ratio);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 0.9;
      const canvas = renderer.domElement;
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", describe(designRef.current));
      canvas.tabIndex = -1;
      canvas.className = styles.canvas;
      stage.prepend(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);

      // Profile of a neck-amphora: [radius, height], foot at y = 0.
      const prof: [number, number][] = [[0.001, 0], [0.34, 0], [0.35, 0.05], [0.27, 0.11], [0.21, 0.17], [0.26, 0.28], [0.42, 0.5],
        [0.56, 0.78], [0.63, 1.02], [0.62, 1.2], [0.53, 1.4], [0.38, 1.56], [0.25, 1.64], [0.21, 1.72], [0.21, 1.86], [0.24, 1.97],
        [0.31, 2.02], [0.32, 2.08], [0.27, 2.1], [0.22, 2.06], [0.2, 1.98]];
      const spline = new THREE.SplineCurve(prof.map(([x, y]) => new THREE.Vector2(x, y)));
      const pts = spline.getSpacedPoints(360);
      const geo = new THREE.LatheGeometry(pts, 300);
      // the surface pictures are uploaded the right way up (so a part of one can be updated): turn the mapping to match
      const uvs = geo.attributes.uv;
      for (let i = 0; i < uvs.count; i++) uvs.setY(i, 1 - uvs.getY(i));
      // a coarser copy of the same shape, never drawn: it finds where the brush touches the pot
      const proxyGeo = new THREE.LatheGeometry(spline.getSpacedPoints(90), 72);
      const proxyMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
      const proxy = new THREE.Mesh(proxyGeo, proxyMat);

      // next/font renames the family, so read the real name from its CSS variable
      const DIDOT = `${getComputedStyle(document.documentElement).getPropertyValue("--font-didot").trim() || '"GFS Didot"'}, serif`;
      // a 4096 × 2048 surface where the graphics card and memory allow; 2048 × 1024 otherwise
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      const k = renderer.capabilities.maxTextureSize >= 8192 && (mem === undefined || mem >= 4) ? 2 : 1;
      const painter = makePainter(pts, DIDOT, k);
      const surfaceTex = (img: HTMLCanvasElement, colour: boolean) => {
        const t = new THREE.CanvasTexture(img);
        t.flipY = false;
        if (colour) t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return t;
      };
      const texture = surfaceTex(painter.canvas, true), roughTex = surfaceTex(painter.rough, false), bumpTex = surfaceTex(painter.bump, false);
      // the same pictures as sources for updating a part of each (never drawn themselves)
      const src = { c: new THREE.Texture(painter.canvas), r: new THREE.Texture(painter.rough), b: new THREE.Texture(painter.bump) };
      const mat = new THREE.MeshStandardMaterial({
        map: texture, roughnessMap: roughTex, roughness: 1, bumpMap: bumpTex, bumpScale: 1.4, metalness: 0.02, envMapIntensity: 0.45, side: THREE.DoubleSide,
      });
      const vase = new THREE.Group();
      vase.add(new THREE.Mesh(geo, mat));
      // the pot stands on its foot and rocks about it when struck
      const rocker = new THREE.Group();
      rocker.add(vase);
      const hMat = new THREE.MeshStandardMaterial({ color: 0x15100c, roughness: 0.25, envMapIntensity: 0.65 });
      const handles: InstanceType<typeof THREE.TubeGeometry>[] = [];
      for (const s of [1, -1]) {
        const c = new THREE.CatmullRomCurve3(([[0.2, 1.82], [0.42, 1.86], [0.58, 1.74], [0.57, 1.56], [0.47, 1.47]] as const).map(([x, y]) => new THREE.Vector3(s * x, y, 0)));
        const tg = new THREE.TubeGeometry(c, 120, 0.034, 24);
        handles.push(tg);
        vase.add(new THREE.Mesh(tg, hMat));
      }
      scene.add(rocker);
      scene.add(new THREE.HemisphereLight(0xfff1e0, 0x3a2414, 1.1));
      const key = new THREE.DirectionalLight(0xfff0dc, 2.8); key.position.set(-3, 4, 5); scene.add(key);
      const rim = new THREE.DirectionalLight(0xffc89a, 1.9); rim.position.set(4, 2, -4); scene.add(rim);
      // a soft room reflected in the gloss, as a real pot reflects the room it stands in
      const pmrem = new THREE.PMREMGenerator(renderer);
      import("three/examples/jsm/environments/RoomEnvironment.js").then(({ RoomEnvironment }) => {
        if (disposed) return;
        const room = new RoomEnvironment();
        scene.environment = pmrem.fromScene(room, 0.04).texture;
        room.dispose?.();
      }, () => undefined);
      const chips = makeChips(THREE, scene);

      let wake = true;   // something changed that the next frame must draw
      const resize = () => {
        const w = stage.clientWidth, h = stage.clientHeight;
        if (!w || !h) return;
        if (ratio > maxRatio()) { ratio = maxRatio(); renderer.setPixelRatio(ratio); }
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
        wake = true;
      };
      resize();
      const ro = new ResizeObserver(resize); ro.observe(stage);

      const SPEED = 0.0045, PAN = 1.02;
      let rot = -0.6, vel = reduceRef.current ? 0 : SPEED, rise = reduceRef.current ? 1 : 0, visible = true, raf = 0, tilted = 0;
      let zoom = 1, zoomT = 1, pan = PAN, panT = PAN;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
      io.observe(stage);

      // ---- finding the brush on the pot, and painting there
      const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), local = new THREE.Vector3();
      const hits: { distance: number; point: InstanceType<typeof THREE.Vector3>; uv?: InstanceType<typeof THREE.Vector2> }[] = [];
      const lastHit = { point: new THREE.Vector3(), dir: new THREE.Vector3() };
      const hitAt = (cx: number, cy: number): [number, number, number] | null => {
        const r = canvas.getBoundingClientRect();
        ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        rocker.updateMatrixWorld();
        proxy.matrixWorld.copy(vase.matrixWorld);
        hits.length = 0;
        proxy.raycast(ray, hits as Parameters<typeof proxy.raycast>[1]);
        let best = hits[0];
        for (const h of hits) if (h.distance < best.distance) best = h;
        if (!best?.uv) return null;
        lastHit.point.copy(best.point); lastHit.dir.copy(ray.ray.direction);
        local.copy(best.point); vase.worldToLocal(local);
        let u = Math.atan2(local.x, local.z) / (2 * Math.PI);
        if (u < 0) u += 1;
        return [Math.round(u * TW), Math.round((1 - best.uv.y) * TH), Math.round(painter.aspectR(Math.hypot(local.x, local.z)) * 100)];
      };
      // the parts of the surface changed since the last frame, sent to the graphics card in the next one
      let dirty: Rect[] = [], all = false, bumpDirty: Rect[] = [], shown = false;
      const send = (rects: Rect[], relief = false) => { dirty.push(...rects); if (relief) bumpDirty.push(...rects); };
      const box = new THREE.Box2(), at = new THREE.Vector2();
      const copy = (from: InstanceType<typeof THREE.Texture>, to: InstanceType<typeof THREE.Texture>, rc: Rect, scale: number, w: number, h: number) => {
        const x0 = Math.max(0, Math.floor(rc.x * scale)), y0 = Math.max(0, Math.floor(rc.y * scale));
        const x1 = Math.min(w, Math.ceil((rc.x + rc.w) * scale) + 2), y1 = Math.min(h, Math.ceil((rc.y + rc.h) * scale) + 2);
        if (x1 <= x0 || y1 <= y0) return;
        box.min.set(x0, y0); box.max.set(x1, y1); at.set(x0, y0);
        renderer.copyTextureToTexture(from, to, box, at);
      };
      const flush = () => {
        send(painter.flushGloss());
        if (all || !shown) { texture.needsUpdate = true; roughTex.needsUpdate = true; bumpTex.needsUpdate = true; all = false; dirty = []; bumpDirty = []; return; }
        const cw = painter.canvas.width, ch = painter.canvas.height, rw = painter.rough.width, rh = painter.rough.height;
        for (const rc of dirty) { copy(src.c, texture, rc, k, cw, ch); copy(src.r, roughTex, rc, k / 2, rw, rh); }
        for (const rc of bumpDirty) copy(src.b, bumpTex, rc, k / 2, rw, rh);
        dirty = []; bumpDirty = [];
      };
      let live: { s: Stroke; last: [number, number, number] | null; sx: number; sy: number } | null = null;
      const paintAt = (cx: number, cy: number) => {
        if (!live) return;
        const p = hitAt(cx, cy);
        if (!p) { live.last = null; return; }
        // off the pot and back on again: that was one stroke, and this is the next
        if (!live.last && live.s.p.length) { handlers.current.stroke(live.s); live.s = { c: live.s.c, w: live.s.w, p: [], ...(live.s.h ? { h: live.s.h } : {}) }; }
        const q = live.last ?? p;
        const rects = painter.segment(live.s, q[0], q[1], p[0], p[1], p[2] / 100);
        painter.compose(rects, false);
        send(rects);
        live.s.p.push(p[0], p[1], p[2]);
        live.last = p;
      };

      // ---- a blow: the cracks spread over a moment, chips fly, the pot rocks on its foot and rings
      const spreading: { fr: Fracture; t: number; done: number }[] = [];
      const rock = { x: 0, z: 0, vx: 0, vz: 0, spin: 0 };
      const strikeAt = (cx: number, cy: number, f: number) => {
        const p = hitAt(cx, cy);
        if (!p) return;
        const crack: Crack = { x: p[0], y: p[1], f: Math.round(f * 100) / 100, s: Math.floor(Math.random() * 2 ** 31) };
        if (!handlers.current.crack(crack)) return;
        const fr = painter.addCrack(crack);
        spreading.push({ fr, t: 0, done: 0 });
        // chips: the painted surface, and the clay inside
        const outward = new THREE.Vector3(lastHit.point.x, 0, lastHit.point.z).normalize();
        chips.burst(lastHit.point.clone(), outward, [painter.colourAt(p[0], p[1]), "#c97a46"], crack.f);
        // the blow pushes along its own direction: rocking the pot about its foot, and turning it if it lands off-centre
        const F = lastHit.dir.clone().multiplyScalar(crack.f), h = Math.max(0.2, lastHit.point.y);
        rock.vx += F.z * h * 0.55; rock.vz -= F.x * h * 0.55;
        rock.spin += (lastHit.point.z * F.x - lastHit.point.x * F.z) * 0.06;
        if (brushRef.current.sound) clink(crack.f);
      };
      let charging: { x: number; y: number; t: number } | null = null;

      // ---- pointers: in the studio one finger paints and two turn and zoom; outside it, dragging turns
      const pointers = new Map<number, { x: number; y: number }>();
      let drag: { x: number; y: number; rot: number; pan: number } | null = null;
      let pinch: { d: number; x: number; zoom: number; rot: number } | null = null;
      const two = () => { const [a, b] = [...pointers.values()]; return { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, x: (a.x + b.x) / 2 }; };
      const down = (e: PointerEvent) => {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        try { canvas.setPointerCapture(e.pointerId); } catch { /* the pointer is already gone */ }
        if (!studioRef.current) { drag = { x: e.clientX, y: e.clientY, rot, pan }; return; }
        e.preventDefault();
        if (pointers.size >= 2) {
          if (live) { live = null; api.current?.repaint("hand"); } // the first finger was starting a turn, not a stroke
          if (charging) { charging = null; handlers.current.charge(null); }
          drag = null;
          const t = two();
          pinch = { d: t.d, x: t.x, zoom: zoomT, rot };
          return;
        }
        const b = brushRef.current;
        if (b.tool === "turn" || e.button === 2) { drag = { x: e.clientX, y: e.clientY, rot, pan: panT }; return; }
        vel = 0;
        if (b.tool === "strike") {
          const r = canvas.getBoundingClientRect();
          charging = { x: e.clientX, y: e.clientY, t: performance.now() };
          handlers.current.charge({ x: e.clientX - r.left, y: e.clientY - r.top });
          return;
        }
        const c = b.tool === "rub" ? -1 : b.tool === "scratch" ? 1 : b.c;
        live = { s: { c, w: b.w, p: [], ...(c === -2 && b.h ? { h: b.h } : {}) }, last: null, sx: e.clientX, sy: e.clientY };
        paintAt(e.clientX, e.clientY);
      };
      const move = (e: PointerEvent) => {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pinch && pointers.size >= 2) {
          const t = two();
          zoomT = clamp((pinch.zoom * t.d) / pinch.d, 1, 3.2);
          rot = pinch.rot + (t.x - pinch.x) * 0.012; vel = 0;
          return;
        }
        if (drag) {
          const nr = drag.rot + (e.clientX - drag.x) * 0.012; vel = (nr - rot) * 0.5; rot = nr;
          if (studioRef.current) panT = clamp(drag.pan + ((e.clientY - drag.y) * 0.004) / zoom, 0.25, 1.9);
          return;
        }
        if (live) {
          const evs = e.getCoalescedEvents?.() ?? [];
          for (const ev of evs.length ? evs : [e]) {
            if (Math.hypot(ev.clientX - live.sx, ev.clientY - live.sy) < 1.5) continue;
            live.sx = ev.clientX; live.sy = ev.clientY;
            paintAt(ev.clientX, ev.clientY);
          }
        }
      };
      const up = (e: PointerEvent) => {
        pointers.delete(e.pointerId);
        if (live) { if (live.s.p.length) handlers.current.stroke(live.s); live = null; }
        if (charging) {
          const c = charging;
          charging = null;
          handlers.current.charge(null);
          if (e.type === "pointerup") strikeAt(c.x, c.y, forceOf(performance.now() - c.t));
        }
        if (pointers.size < 2) pinch = null;
        if (!pointers.size) drag = null;
      };
      // a trackpad: pinch to come closer, two fingers to turn the vase and move along it; a mouse wheel zooms.
      // On the home page only a sideways swipe turns it, so the page still scrolls under the fingers.
      const readWheel = wheelReader();
      const wheel = (e: WheelEvent) => {
        const kind = readWheel(e), inStudio = studioRef.current;
        if (!inStudio) {
          if (kind !== "pan" || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
          e.preventDefault();
          rot -= e.deltaX * 0.006; vel = 0; wake = true;
          return;
        }
        e.preventDefault();
        if (kind === "pinch") zoomT = clamp(zoomT * pinchFactor(e), 1, 3.2);
        else if (kind === "wheel") zoomT = clamp(zoomT * wheelFactor(e) ** 0.7, 1, 3.2);
        else {
          rot -= e.deltaX * 0.006;
          // scrolling down moves down the vase, as it moves down a page
          panT = clamp(panT - (e.deltaY * 0.0035) / zoom, 0.25, 1.9);
        }
        vel = 0; wake = true;
      };
      // Safari's own trackpad gestures: pinch to zoom, and twist two fingers to turn the vase
      const stopGesture = onGesture(canvas, (scaleBy, rotateBy) => {
        if (!studioRef.current) return;
        zoomT = clamp(zoomT * scaleBy, 1, 3.2);
        rot += (rotateBy * Math.PI) / 180;
        vel = 0; wake = true;
      });
      const keys = (e: KeyboardEvent) => {
        if (!studioRef.current) return;
        const k = e.key;
        if (k === "ArrowLeft") rot -= 0.15; else if (k === "ArrowRight") rot += 0.15;
        else if (k === "ArrowUp") panT = clamp(panT + 0.08, 0.25, 1.9); else if (k === "ArrowDown") panT = clamp(panT - 0.08, 0.25, 1.9);
        else if (k === "+" || k === "=") zoomT = clamp(zoomT * 1.2, 1, 3.2); else if (k === "-") zoomT = clamp(zoomT / 1.2, 1, 3.2);
        else return;
        vel = 0; wake = true; e.preventDefault();
      };
      const menu = (e: Event) => { if (studioRef.current) e.preventDefault(); };
      const restored = () => { all = true; };
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);
      canvas.addEventListener("wheel", wheel, { passive: false });
      canvas.addEventListener("keydown", keys);
      canvas.addEventListener("contextmenu", menu);
      canvas.addEventListener("webglcontextrestored", restored);

      api.current = {
        repaint(what) {
          const d = designRef.current;
          if (what !== "hand") painter.paintBase(d);
          if (what !== "base") painter.replay(d.strokes);
          if (what === "all") { spreading.length = 0; painter.rebuildCracks(d.cracks); }
          painter.compose();
          all = true;
          canvas.setAttribute("aria-label", describe(d));
        },
        picture() { renderer.render(scene, camera); return canvas.toDataURL("image/png"); },
        nudge(turn, zoomBy) { rot += turn; vel = 0; zoomT = clamp(zoomT * zoomBy, 1, 3.2); wake = true; },
        resetView() { zoomT = 1; panT = PAN; wake = true; },
      };

      let last = performance.now(), slow = 0, fast = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!visible) return;
        // never lag: if frames take too long for a while, draw fewer pixels; if there is room again, more
        if (dt > 0.024) { slow++; fast = 0; } else { fast++; slow = Math.max(0, slow - 1); }
        if (slow > 30 && ratio > 1) { ratio = Math.max(1, ratio - 0.25); renderer.setPixelRatio(ratio); resize(); slow = 0; }
        else if (fast > 600 && ratio < maxRatio()) { ratio = Math.min(maxRatio(), ratio + 0.25); renderer.setPixelRatio(ratio); resize(); fast = 0; }
        const reduce = reduceRef.current, inStudio = studioRef.current;
        // a crack spreads from the blow in a third of a second
        for (let i = spreading.length - 1; i >= 0; i--) {
          const s = spreading[i];
          s.t = Math.min(1, s.t + dt / 0.32);
          const to = reduce ? 1 : 1 - Math.pow(1 - s.t, 2);
          send(painter.drawCrack(s.fr, s.done, to), true);
          s.done = to;
          // once it has run its course, the area is put together again (and its gloss worked out) with the crack in place
          if (s.t >= 1) { const rr = painter.drawCrack(s.fr, 1, 1); painter.compose(rr); send(rr, true); spreading.splice(i, 1); }
        }
        // the pot rocks on its foot (a stiff spring, quickly damped) and the blow's turn dies away
        rock.vx += (-90 * rock.x - 9 * rock.vx) * dt; rock.vz += (-90 * rock.z - 9 * rock.vz) * dt;
        rock.x += rock.vx * dt; rock.z += rock.vz * dt;
        rot += rock.spin; rock.spin *= Math.pow(0.02, dt);
        rocker.rotation.set(reduce ? 0 : rock.x, 0, reduce ? 0 : rock.z);
        const flying = chips.update(dt);
        if (!drag && !pinch) { vel += ((inStudio || reduce ? 0 : SPEED) - vel) * (inStudio ? 0.1 : 0.02); rot += vel; }
        rise = reduce ? 1 : Math.min(1, rise + 0.012);
        const e = 1 - Math.pow(1 - rise, 3);
        tilted += ((inStudio ? 0 : tiltRef.current * 0.9) - tilted) * 0.06;   // eased, so a shaky hand does not jolt it
        // the camera glides to where it is sent: quickly, so the vase answers the fingers at once
        zoom += (zoomT - zoom) * 0.3; pan += (panT - pan) * 0.3;
        camera.zoom = zoom; camera.position.set(0, pan + 0.13, 6.4); camera.lookAt(0, pan, 0); camera.updateProjectionMatrix();
        vase.rotation.y = rot + tilted; vase.position.y = -0.35 * (1 - e); vase.scale.setScalar(0.9 + 0.1 * e);
        // nothing moving and nothing new: the last picture stands (the studio stays light on the computer)
        const still = Math.abs(vel) < 1e-5 && Math.abs(zoomT - zoom) < 1e-4 && Math.abs(panT - pan) < 1e-4 && rise >= 1
          && Math.abs(rock.x) + Math.abs(rock.z) + Math.abs(rock.vx) + Math.abs(rock.vz) < 1e-4 && Math.abs(rock.spin) < 1e-6
          && Math.abs((inStudio ? 0 : tiltRef.current * 0.9) - tilted) < 1e-4 && !flying && !spreading.length && !drag && !pinch;
        if (still && !wake && !all && !dirty.length && !bumpDirty.length && shown) return;
        wake = false;
        flush();
        renderer.render(scene, camera);
        shown = true;
        stage.dataset.view = `${zoom.toFixed(3)} ${pan.toFixed(3)} ${rot.toFixed(3)}`;   // where the camera is (read by the tests)
      };
      const start = () => { if (disposed) return; api.current?.repaint("all"); frame(); };
      document.fonts.load(`700 80px ${DIDOT}`, "ΜΑΘΗΣΙΣ").then(start, start);

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); stopGesture();
        geo.dispose(); proxyGeo.dispose(); proxyMat.dispose(); handles.forEach((h) => h.dispose()); mat.dispose(); hMat.dispose();
        texture.dispose(); roughTex.dispose(); bumpTex.dispose(); chips.dispose(); pmrem.dispose(); scene.environment?.dispose();
        renderer.dispose(); canvas.remove(); api.current = null;
      };
    });

    // three.js is large (about 190 KB to download, and a second or two of work for a phone to set up and paint),
    // so it is fetched only when the vase comes into view, and once the browser has a moment to spare: the page
    // is ready to use first. Until then the stage shows its halo and shadow.
    let idle = 0;
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      const go = () => { if (!disposed) void begin(); };
      idle = typeof requestIdleCallback === "function" ? requestIdleCallback(go, { timeout: 1500 }) : Number(setTimeout(go, 200));
    }, { threshold: 0.15 });
    near.observe(stage);

    return () => {
      disposed = true; near.disconnect();
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idle); else clearTimeout(idle);
      cleanup(); clearTimeout(saveTimer.current);
    };
  }, []);

  const toolInfo = TOOLS.find((t) => t.id === tool)!;
  return (
    <div className={styles.slot} style={studio && slotH ? { minHeight: slotH } : undefined}>
      <figure
        ref={figRef} className={styles.figure} data-studio={studio ? "" : undefined}
        role={studio ? "dialog" : undefined} aria-modal={studio || undefined} aria-labelledby={studio ? "studio-title" : undefined}
      >
        <div ref={stageRef} className={styles.stage} data-tool={studio ? tool : undefined}>
          <div className={styles.halo} aria-hidden="true" />
          {charge && <span key={charge.id} className={styles.charge} style={{ left: charge.x, top: charge.y }} aria-hidden="true" />}
          <div className={styles.shadow} aria-hidden="true" />
          {studio && (
            <div className={styles.view} role="group" aria-label="Turn and come closer">
              <button type="button" onClick={() => api.current?.nudge(-0.5, 1)} aria-label="Turn left" title="Turn left"><Icon d={ICON.left} /></button>
              <button type="button" onClick={() => api.current?.nudge(0.5, 1)} aria-label="Turn right" title="Turn right"><Icon d={ICON.right} /></button>
              <button type="button" onClick={() => api.current?.nudge(0, 1.3)} aria-label="Come closer" title="Come closer"><Icon d={ICON.plus} /></button>
              <button type="button" onClick={() => api.current?.nudge(0, 1 / 1.3)} aria-label="Step back" title="Step back"><Icon d={ICON.minus} /></button>
            </div>
          )}
        </div>

        {!studio ? (
          <figcaption className={styles.cap}>
            {noGL
              ? "This browser cannot draw the vase in 3D."
              : <>{custom ? "Your own vase, painted here and kept in this browser." : "A neck-amphora in the black-figure style: black gloss painted on orange clay."} Drag to turn it{tilt === "on" ? ", or tilt your phone" : ""}.</>}
            <span className={styles.capBtns}>
              {!noGL && <button ref={openBtnRef} type="button" className={`btn small ${styles.paintBtn}`} onClick={open}><Icon d={ICON.brush} /> Paint it yourself</button>}
              {tilt === "ask" && <button type="button" className={styles.tiltBtn} onClick={askTilt}>Turn it by tilting the phone</button>}
            </span>
          </figcaption>
        ) : (
          <div className={styles.tools}>
            <div className={styles.toolsHead}>
              <h2 id="studio-title" className={styles.toolsTitle}>Paint your own vase</h2>
              <button type="button" className="btn small" data-first onClick={close}>Done</button>
            </div>

            <section className={styles.group} aria-label="Brush">
              <div className={styles.seg} role="group" aria-label="Tool">
                {TOOLS.map((t) => <button key={t.id} type="button" aria-pressed={tool === t.id} onClick={() => setTool(t.id)}>{t.name}</button>)}
              </div>
              <p className={styles.hint}>{toolInfo.hint}</p>
              {tool === "brush" && (
                <div className={styles.colours}>
                  <div className={styles.swatches} role="group" aria-label="The Athenian painter's colours">
                    {PALETTE.map((p, i) => (
                      <button key={p.hex} type="button" className={styles.swatch} style={{ "--sw": p.hex } as CSSProperties}
                        aria-pressed={colour.c === i} aria-label={p.name} title={p.name} onClick={() => setColour({ c: i, name: p.name })} />
                    ))}
                    <span className={styles.swatchName}>{colour.name}</span>
                  </div>
                  <div className={styles.more} role="group" aria-label="More colours">
                    {MORE_COLOURS.map((p) => (
                      <button key={p.hex} type="button" className={styles.chipSwatch} style={{ "--sw": p.hex } as CSSProperties}
                        aria-pressed={colour.c === -2 && colour.h === p.hex} aria-label={p.name} title={p.name} onClick={() => setColour({ c: -2, h: p.hex, name: p.name })} />
                    ))}
                    {picked.map((hex) => (
                      <button key={`p${hex}`} type="button" className={styles.chipSwatch} style={{ "--sw": hex } as CSSProperties}
                        aria-pressed={colour.c === -2 && colour.h === hex} aria-label={`Your colour ${hex}`} title={hex} onClick={() => setColour({ c: -2, h: hex, name: "Your colour" })} />
                    ))}
                    <label className={styles.anyColour} title="Any colour">
                      <input type="color" value={colour.h ?? PALETTE[Math.max(0, colour.c)].hex} onChange={(e) => pickAny(e.target.value)} aria-label="Any colour" />
                      <span aria-hidden="true">+</span>
                    </label>
                  </div>
                </div>
              )}
              {tool === "strike" && (
                <div className={styles.row}>
                  <button type="button" className={styles.plain} onClick={() => commit({ ...designRef.current, cracks: [] }, "all")} disabled={!design.cracks.length}>Mend all cracks</button>
                  <button type="button" className={styles.plain} aria-pressed={sound} onClick={() => setSound(!sound)}>{sound ? "Sound on" : "Sound off"}</button>
                </div>
              )}
              {(tool === "brush" || tool === "rub") && (
                <div className={styles.seg} role="group" aria-label="Brush size">
                  {SIZES.map((s, i) => (
                    <button key={s.name} type="button" aria-pressed={size === i} onClick={() => setSize(i)}>
                      <span className={styles.dot} style={{ width: 4 + s.w * 0.6, height: 4 + s.w * 0.6 }} aria-hidden="true" />{s.name}
                    </button>
                  ))}
                </div>
              )}
              <div className={styles.row}>
                <button type="button" className={styles.plain} onClick={undo} disabled={!hist.undo}><Icon d={ICON.undo} /> Undo</button>
                <button type="button" className={styles.plain} onClick={redo} disabled={!hist.redo}><Icon d={ICON.redo} /> Redo</button>
              </div>
            </section>

            <section className={styles.group} aria-labelledby="studio-style">
              <h3 id="studio-style" className="label">Style</h3>
              <div className={styles.seg} role="group" aria-label="Style">
                <button type="button" aria-pressed={design.style === "black"} onClick={() => set({ style: "black" })}>Black-figure</button>
                <button type="button" aria-pressed={design.style === "red"} onClick={() => set({ style: "red" })}>Red-figure</button>
              </div>
              <p className={styles.hint}>
                {design.style === "black"
                  ? "Figures painted black on the clay, with details scratched through."
                  : "From about 530 BC: the figures left in the clay and the background painted black."}{" "}
                <Link href="/stoa/black-and-red-figure" transitionTypes={["page-turn"]}>Read about the two styles</Link>.
              </p>
            </section>

            <section className={styles.group} aria-labelledby="studio-patterns">
              <h3 id="studio-patterns" className="label">Patterns</h3>
              <div className={styles.fields}>
                <label>
                  <span>Main band</span>
                  <select aria-label="Main band" value={design.frieze} onChange={(e) => set({ frieze: e.target.value as Frieze })}>
                    {FRIEZES.map((f) => <option key={f} value={f}>{FRIEZE_NAMES[f]}</option>)}
                  </select>
                </label>
                {ZONES.map((z) => (
                  <label key={z.key}>
                    <span>{z.name}</span>
                    <select aria-label={z.name} value={design[z.key]} onChange={(e) => set({ [z.key]: e.target.value as Band })}>
                      {BANDS.map((b) => <option key={b} value={b}>{BAND_NAMES[b]}</option>)}
                    </select>
                  </label>
                ))}
              </div>
            </section>

            <section className={styles.group} aria-labelledby="studio-words">
              <h3 id="studio-words" className="label">Painted words</h3>
              <div className={styles.fields}>
                {(["Front", "Back"] as const).map((side, i) => (
                  <label key={side}>
                    <span>{side}</span>
                    <input type="text" lang="grc" aria-label={`Painted word, ${side.toLowerCase()}`} value={design.words[i]} maxLength={WORD_MAX + 2} spellCheck={false} autoComplete="off"
                      onChange={(e) => setWord(i as 0 | 1, e.target.value, e.timeStamp)} disabled={design.frieze === "clay" || design.frieze === "black"} />
                  </label>
                ))}
              </div>
              <p className={styles.hint}>
                {design.frieze === "clay" || design.frieze === "black"
                  ? "Choose a main band with room for words to write them."
                  : <>Type in English letters and they become Greek capitals (th → Θ, ph → Φ, ch → Χ, ps → Ψ, w → Ω). Painters often wrote names beside their figures, or praised someone as <i>kalos</i>, &ldquo;beautiful&rdquo;.</>}
              </p>
            </section>

            <section className={styles.group} aria-label="Start again or keep it">
              <div className={styles.row}>
                <button type="button" className="btn small ghost" onClick={() => commit(BARE_DESIGN, "all")}>Bare clay</button>
                <button type="button" className="btn small ghost" onClick={() => commit(DEFAULT_DESIGN, "all")} disabled={!custom}>The site&apos;s design</button>
                <button type="button" className="btn small" onClick={savePicture}>Save a picture</button>
              </div>
              <p className={styles.hint}>Your vase is kept in this browser and shown on the home page. Nothing is sent anywhere.</p>
            </section>
            {note && <p className={styles.note} role="status">{note}</p>}
          </div>
        )}
      </figure>
    </div>
  );
}
