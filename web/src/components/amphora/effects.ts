/**
 * What a blow does besides cracking: chips of the pot fly off and fall (with real gravity, bouncing and
 * coming to rest on the floor the pot stands on), the pot rocks on its foot, and it rings.
 */
import type * as T from "three";

type Three = typeof import("three");

/**
 * Chips of fired clay, as a few dozen small shapes drawn in one go. The pot is about 2.1 units tall, which
 * makes a unit about 20 cm, so gravity (9.81 m/s²) is about 49 units/s².
 */
export function makeChips(THREE: Three, scene: T.Scene) {
  const MAX = 160, G = 49, FLOOR = 0;
  const geo = new THREE.TetrahedronGeometry(1, 0);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0, flatShading: true });
  const mesh = new THREE.InstancedMesh(geo, mat, MAX);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.count = 0;
  scene.add(mesh);
  type Chip = { p: T.Vector3; v: T.Vector3; q: T.Quaternion; w: T.Vector3; s: T.Vector3; c: T.Color; life: number; rest: number };
  const chips: Chip[] = [];
  const m = new THREE.Matrix4(), dq = new THREE.Quaternion(), e = new THREE.Euler(), up = new THREE.Vector3(0, 1, 0);

  /** A burst of chips from a point on the pot, thrown off along its surface's outward direction. */
  function burst(at: T.Vector3, outward: T.Vector3, colours: string[], f: number) {
    const n = Math.round(5 + 32 * f);
    for (let i = 0; i < n; i++) {
      if (chips.length >= MAX) chips.shift();
      const dir = outward.clone().multiplyScalar(0.6 + Math.random() * 0.6)
        .add(new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9, Math.random() - 0.5).multiplyScalar(0.9)).normalize();
      const size = (0.006 + Math.random() * 0.018) * (0.6 + f);
      chips.push({
        p: at.clone().addScaledVector(outward, 0.01),
        v: dir.multiplyScalar((1.2 + Math.random() * 2.6) * (0.5 + f)),
        q: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6)),
        w: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(30),
        s: new THREE.Vector3(size, size * (0.25 + Math.random() * 0.35), size * (0.6 + Math.random() * 0.6)),
        // half show the painted surface, half the clay of the body inside
        c: new THREE.Color(i % 2 ? colours[0] : colours[1] ?? colours[0]),
        life: 0, rest: 0,
      });
    }
  }

  /** Move every chip on by dt seconds; false once none is left. */
  function update(dt: number): boolean {
    dt = Math.min(dt, 1 / 30);
    for (let i = chips.length - 1; i >= 0; i--) {
      const c = chips[i];
      c.life += dt;
      if (c.rest > 0) c.rest += dt;
      else {
        c.v.y -= G * dt;
        c.p.addScaledVector(c.v, dt);
        e.set(c.w.x * dt, c.w.y * dt, c.w.z * dt); dq.setFromEuler(e); c.q.multiply(dq);
        const floor = FLOOR + c.s.y;
        if (c.p.y < floor) {
          // a bounce: clay chips lose most of their speed, and skid
          c.p.y = floor;
          c.v.y = -c.v.y * 0.32;
          c.v.x *= 0.62; c.v.z *= 0.62;
          c.w.multiplyScalar(0.55);
          if (Math.abs(c.v.y) < 0.35 && c.v.lengthSq() < 0.2) { c.rest = 1e-6; c.q.setFromAxisAngle(up, Math.random() * 6); }
        }
      }
      // at rest a while, it fades from sight
      if (c.rest > 1.6 || c.life > 6) { chips.splice(i, 1); continue; }
    }
    for (let i = 0; i < chips.length; i++) {
      const c = chips[i], fade = c.rest > 1.1 ? Math.max(0, 1 - (c.rest - 1.1) / 0.5) : 1;
      m.compose(c.p, c.q, c.s.clone().multiplyScalar(fade));
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.c);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.count = chips.length;
    mesh.instanceMatrix.needsUpdate = true;
    return chips.length > 0;
  }

  return { burst, update, dispose: () => { scene.remove(mesh); geo.dispose(); mat.dispose(); mesh.dispose(); } };
}

/**
 * The ring of struck pottery: a few sine tones at the uneven spacing of a ringing vessel, dying away quickly,
 * with a dry crackle when it cracks. Made in the browser (no recording); played only when you strike the pot.
 */
let audio: AudioContext | null = null;
export function clink(f: number) {
  try {
    audio ??= new AudioContext();
    const a = audio, t = a.currentTime;
    if (a.state === "suspended") void a.resume();
    const out = a.createGain();
    out.gain.value = 0.09 * (0.5 + f);
    out.connect(a.destination);
    const baseHz = 1650 - 750 * f + Math.random() * 140;
    [[1, 1, 0.55], [2.76, 0.45, 0.32], [5.4, 0.22, 0.18], [8.93, 0.1, 0.1]].forEach(([ratio, amp, decay]) => {
      const osc = a.createOscillator(), g = a.createGain();
      osc.frequency.value = baseHz * ratio;
      g.gain.setValueAtTime(amp, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay * (1 - 0.45 * f));
      osc.connect(g).connect(out);
      osc.start(t); osc.stop(t + decay + 0.05);
    });
    if (f > 0.3) {
      // the crack: a short burst of high noise
      const len = Math.floor(a.sampleRate * 0.08), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3) * (Math.random() < 0.3 ? 1 : 0.3);
      const src = a.createBufferSource(), hp = a.createBiquadFilter(), g = a.createGain();
      src.buffer = buf; hp.type = "highpass"; hp.frequency.value = 2500; g.gain.value = f;
      src.connect(hp).connect(g).connect(out);
      src.start(t + 0.01);
    }
  } catch { /* no sound in this browser: the blow still cracks */ }
}
