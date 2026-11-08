/**
 * The top of the Explore door (the Painted Stoa's front): the three places that used to sit in its reference list,
 * brought up to lead it (Phase 11): the map, the Census and Archaeology, each with a picture drawn from the site's own
 * data, made when the site is built. The map is the Aegean from the map's own coastlines (the Ancient World Mapping
 * Center's), with the most-named towns; the Census card shows its real top five gods and heroes.
 */
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AREAS } from "@/config/areas";
import { HANDLE, PROFILE } from "@/lib/amphora";
import { project, shortName, type Base, type Place } from "@/lib/map";
import { designFor, shapeOf, stringTops } from "@/components/lyre/instruments";
import { IMAGES, srcSet } from "@/wiki/images";
import styles from "./ExploreLead.module.css";

const read = <T,>(f: string) => JSON.parse(readFileSync(join(process.cwd(), "public/data", f), "utf8")) as T;

// ---------------------------------------------------------------- the Aegean, drawn small
const [W, S, E, N] = [19.6, 34.9, 29.2, 41.4];   // west, south, east, north (degrees)
const base = read<Base>("map/base.json");
const [x0, y0] = project(base, W, N), [x1, y1] = project(base, E, S);
/** The sea within the frame, its outlines simplified to points about 5 km apart and kept just outside the edges. */
const SEA = (() => {
  const m = 0.3, tol = 0.05;
  let d = "";
  for (const r of base.water) {
    let inside = false;
    for (let i = 0; i < r.length && !inside; i += 2) inside = r[i] > W && r[i] < E && r[i + 1] > S && r[i + 1] < N;
    if (!inside) continue;
    const pts: string[] = [];
    let lx = Infinity, ly = Infinity;
    for (let i = 0; i < r.length; i += 2) {
      const lon = Math.min(E + m, Math.max(W - m, r[i])), lat = Math.min(N + m, Math.max(S - m, r[i + 1]));
      if (Math.hypot(lon - lx, lat - ly) < tol) continue;
      lx = lon; ly = lat;
      const [x, y] = project(base, lon, lat);
      pts.push(`${Math.round(x)} ${Math.round(y)}`);
    }
    if (pts.length >= 4) d += `M${pts.join("L")}Z`;
  }
  return d;
})();
// the most-named towns and sanctuaries in the frame; the first five are named
const TOWNS = read<{ places: Place[] }>("map/places.json").places
  .filter((p) => (p.type === "settlement" || p.type === "sanctuary") && p.lon > W && p.lon < E && p.lat > S && p.lat < N)
  .sort((a, b) => b.n - a.n).slice(0, 9)
  .map((p, i) => { const [x, y] = project(base, p.lon, p.lat); return { id: p.id, x, y, name: i < 5 ? shortName(p) : null }; });

// ---------------------------------------------------------------- the Census's top five gods and heroes
const GODS = read<{ all: Record<string, [string, number][]> }>("census/core.json").all.god.slice(0, 5);
const TOP = GODS[0][1];
// the usual English names of these five (the card shows the Greek beside them)
const GOD_EN: Record<string, string> = { "Ζεύς": "Zeus", "Ἡρακλῆς": "Heracles", "Ἀπόλλων": "Apollo", "Ἀθήνη": "Athena", "Ὀδυσσεύς": "Odysseus", "Ἀχιλλεύς": "Achilles" };

const KER = IMAGES["kerameikos-street"];

export default function ExploreLead() {
  return (
    <nav className={styles.lead} aria-labelledby="explore-h">
      <h2 id="explore-h" className="label">Explore the Greek world</h2>
      <ul>
        <li>
          <Link href={AREAS.map.href} transitionTypes={["page-turn"]} className={styles.card}>
            <svg className={styles.map} viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect x={x0 - 50} y={y0 - 50} width={x1 - x0 + 100} height={y1 - y0 + 100} className={styles.land} />
              <path d={SEA} className={styles.sea} fillRule="evenodd" />
              {TOWNS.map((t, i) => (
                <g key={t.id} className={styles.town} style={{ "--i": i } as React.CSSProperties}>
                  <circle cx={t.x} cy={t.y} r={t.name ? 7 : 5} />
                  {t.name && <text x={t.x + 11} y={t.y + 6}>{t.name}</text>}
                </g>
              ))}
            </svg>
            <span className={styles.txt}>
              <span className={styles.gr} lang="grc">{AREAS.map.greek}</span>
              <b>The map</b>
              <span>Every place the texts name, on a map you can pan and zoom, with the passages that mention it.</span>
            </span>
          </Link>
        </li>
        <li>
          <Link href={AREAS.census.href} transitionTypes={["page-turn"]} className={styles.card}>
            <span className={styles.bars} aria-hidden="true">
              <span className="label">Most named gods and heroes</span>
              {GODS.map(([g, n], i) => (
                <span key={g} className={styles.bar} style={{ "--w": `${(100 * n) / TOP}%`, "--i": i } as React.CSSProperties}>
                  <span className={styles.who}><span lang="grc">{g}</span> {GOD_EN[g] ?? ""}</span>
                  <span className={styles.fill}><i /></span>
                  <span className={styles.n}>{n.toLocaleString("en-GB")}</span>
                </span>
              ))}
            </span>
            <span className={styles.txt}>
              {/* ἀπογραφή: a register or list, among them census-lists (LSJ) */}
              <span className={styles.gr} lang="grc">Ἀπογραφή</span>
              <b>The Census</b>
              <span>Every person, god, place and thing in the texts, counted: who is named most, and where.</span>
            </span>
          </Link>
        </li>
        <li>
          <Link href={AREAS.archaeology.href} transitionTypes={["page-turn"]} className={styles.card}>
            {/* eslint-disable-next-line @next/next/no-img-element -- self-hosted, sized files; no image service */}
            <img className={styles.pic} src={`/images/${KER.file}`} srcSet={srcSet(KER)} sizes="(max-width: 760px) 100vw, 400px"
              alt={KER.alt} width={KER.width} height={KER.height} loading="lazy" decoding="async" data-photo="kerameikos-street" />
            <span className={styles.txt}>
              <span className={styles.gr} lang="grc">{AREAS.archaeology.greek}</span>
              <b>Archaeology</b>
              <span>How we know: digs, dating, pottery, and the great sites and finds.</span>
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

// ---------------------------------------------------------------- the lyre and the pot, as a black-figure painter drew them
type Pt = readonly [number, number];
const f4 = (n: number) => Math.round(n * 1e4) / 1e4;
const pts = (p: Pt[]) => p.map(([x, y]) => `${f4(x)} ${f4(y)}`).join("L");
/** The viewBox of the square centred on a drawing's box: the card's picture is square, and a drawing is framed in its
 *  box's own shape (scripts/check-svg-fill.mjs), so the paper either side of a tall drawing is part of its frame. */
const square = (x: number, y: number, w: number, h: number) => {
  const s = Math.max(w, h);
  return [x + (w - s) / 2, y + (h - s) / 2, s, s].map((v) => f4(v)).join(" ");
};
/** A smooth line through the points (Catmull-Rom, the curve the pot is turned on), as cubic Béziers. */
function through(p: Pt[], start: "M" | "L" = "M"): string {
  let d = `${start}${f4(p[0][0])} ${f4(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], e = p[Math.min(p.length - 1, i + 2)];
    d += `C${f4(b[0] + (c[0] - a[0]) / 6)} ${f4(b[1] + (c[1] - a[1]) / 6)} ${f4(c[0] - (e[0] - b[0]) / 6)} ${f4(c[1] - (e[1] - b[1]) / 6)} ${f4(c[0])} ${f4(c[1])}`;
  }
  return d;
}
/** A cubic Bézier, as points. */
const bez = (a: Pt, b: Pt, c: Pt, e: Pt, n: number): Pt[] => Array.from({ length: n + 1 }, (_, k) => {
  const t = k / n, u = 1 - t;
  return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * e[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * e[1]];
});

// the pot: the very outline the pot is turned on (lib/amphora.ts), seen from the side, up to the top of its lip
const RIM = PROFILE.reduce((top, p, i) => (p[1] > PROFILE[top][1] ? i : top), 0);
const LIP = PROFILE[RIM][1];
const SIDE: Pt[] = PROFILE.slice(0, RIM + 1).map(([r, y]) => [r, LIP - y]);
const POT = `${through(SIDE)}${through([...SIDE].reverse().map(([x, y]) => [-x, y] as const), "L")}Z`;
const HANDLES = [1, -1].map((s) => through(HANDLE.map(([x, y]) => [s * x, LIP - y] as const)));
/** the rays that rise above the foot, painted on a band of the clay left bare (from 0.21 to 0.5 of the pot's height) */
const RAYS = Array.from({ length: 11 }, (_, k) => -0.45 + k * 0.09)
  .map((x) => `M${f4(x - 0.034)} ${f4(LIP - 0.21)}L${f4(x)} ${f4(LIP - 0.48)}L${f4(x + 0.034)} ${f4(LIP - 0.21)}Z`).join("");

// the lyre: the tortoise-shell lyre (χέλυς) of the lyre page, at its own proportions (components/lyre/instruments.ts),
// with seven strings: its arms drawn as paintChelys draws them, rising from the shell, leaning out and in to the yoke, the
// tips curling outwards, each narrowing from the shell to its tip
const LYRE = shapeOf(designFor("seikilos", 7));
const STRINGS = stringTops(LYRE, 7).map((x, i) => [x, -LYRE.botSpan / 2 + (i * LYRE.botSpan) / 6] as const);
const SHELL = { rx: Math.max(0.22, LYRE.topSpan / 2 + 0.075), ry: 0.175, cy: 0.81 };
const ARMS = ([-1, 1] as const).map((s) => {
  const { rx, ry, cy } = SHELL, y = LYRE.barY, xb = s * rx * 0.5, xt = s * LYRE.barX * 0.88;
  const c = [...bez([xb, cy - ry * 0.7], [s * (rx * 0.5 + 0.13), 0.5], [s * LYRE.barX * 1.04, 0.3], [xt, y], 24),
    ...bez([xt, y], [xt + s * 0.004, y - 0.035], [xt + s * 0.03, y - 0.07], [xt + s * 0.066, y - 0.086], 8).slice(1)];
  const left: Pt[] = [], right: Pt[] = [];
  c.forEach((p, i) => {
    const q = c[Math.min(c.length - 1, i + 1)], o = c[Math.max(0, i - 1)];
    const dx = q[0] - o[0], dy = q[1] - o[1], len = Math.hypot(dx, dy) || 1, w = (0.05 - 0.032 * (i / (c.length - 1))) / 2;
    left.push([p[0] - (dy / len) * w, p[1] + (dx / len) * w]);
    right.push([p[0] + (dy / len) * w, p[1] - (dx / len) * w]);
  });
  return `M${pts([...left, ...right.reverse()])}Z`;
});

// the board: a board hung from a nail by a cord, in the gloss, with three panels of clay put up on it (a pot, a tune's
// plucks along its strings, lines of writing), and a frieze of added red and a scratched line beneath them
const PANELS = [0.12, 0.39, 0.66];
const PANEL = { y: 0.35, w: 0.22, h: 0.3 };
const MINI = 0.22 / LIP;   // the pot, made small to stand in its panel
const PLUCKS: Pt[] = [[0.03, 0.22], [0.06, 0.14], [0.09, 0.18], [0.12, 0.08], [0.15, 0.14], [0.18, 0.22]];

/**
 * Make and play: the lyre, the potter and the board, each a card with its picture, drawn as a black-figure painter drew: the
 * shapes in the black gloss (the page's ink), the lines scratched through it to the clay (the paper), and one line of
 * added red. Below the three places to explore, above the index of entries.
 */
export function MakeAndPlay() {
  const { rx, ry, cy } = SHELL;
  return (
    <nav className={styles.make} aria-labelledby="make-h">
      <h2 id="make-h" className="label">Make, play and share</h2>
      <ul>
        <li>
          <Link href={AREAS.lyre.href} transitionTypes={["page-turn"]} className={styles.makeCard}>
            <svg className={styles.fig} viewBox={square(-LYRE.w / 2, 0, LYRE.w, 1)} aria-hidden="true">
              <defs><clipPath id="make-shell"><ellipse cx="0" cy={cy} rx={rx} ry={ry} /></clipPath></defs>
              <g className={styles.gloss}>
                {ARMS.map((d) => <path key={d} d={d} />)}
                <ellipse cx="0" cy={cy} rx={rx} ry={ry} />
                <rect x={f4(-LYRE.barX)} y={f4(LYRE.barY - LYRE.barH / 2)} width={f4(2 * LYRE.barX)} height={f4(LYRE.barH)} rx={f4(LYRE.barH / 2)} />
              </g>
              <ellipse className={styles.dots} cx="0" cy={cy} rx={f4(rx - 0.014)} ry={f4(ry - 0.013)} />
              <line className={styles.scratch} x1={f4(-LYRE.botSpan / 2 - 0.03)} x2={f4(LYRE.botSpan / 2 + 0.03)} y1={LYRE.bridgeY} y2={LYRE.bridgeY} />
              <g className={styles.strings}>{STRINGS.map(([t, b]) => <line key={t} x1={f4(t)} y1={f4(LYRE.barY)} x2={f4(b)} y2={LYRE.tailY} />)}</g>
              <g className={styles.scratch} clipPath="url(#make-shell)">{STRINGS.map(([t, b]) => <line key={t} x1={f4(t)} y1={f4(LYRE.barY)} x2={f4(b)} y2={LYRE.tailY} />)}</g>
            </svg>
            <span className={styles.txt}>
              <span className={styles.gr} lang="grc">{AREAS.lyre.greek}</span>
              <b>{AREAS.lyre.name}</b>
              <span>{AREAS.lyre.fit}</span>
            </span>
          </Link>
        </li>
        <li>
          <Link href={AREAS.pot.href} transitionTypes={["page-turn"]} className={styles.makeCard}>
            <svg className={styles.fig} viewBox={square(-0.7, -0.06, 1.4, LIP + 0.12)} aria-hidden="true">
              <defs><clipPath id="make-pot"><path d={POT} /></clipPath></defs>
              <path className={styles.gloss} d={POT} />
              {HANDLES.map((d) => <path key={d} className={styles.handle} d={d} />)}
              <g clipPath="url(#make-pot)">
                <rect className={styles.clay} x="-0.7" y={f4(LIP - 0.5)} width="1.4" height="0.29" />
                <path className={styles.gloss} d={RAYS} />
                <line className={styles.scratch} x1="-0.7" x2="0.7" y1={f4(LIP - 1.66)} y2={f4(LIP - 1.66)} />
                <line className={styles.addedRed} x1="-0.7" x2="0.7" y1={f4(LIP - 1.42)} y2={f4(LIP - 1.42)} />
                <line className={styles.scratch} x1="-0.7" x2="0.7" y1={f4(LIP - 1.37)} y2={f4(LIP - 1.37)} />
              </g>
            </svg>
            <span className={styles.txt}>
              <span className={styles.gr} lang="grc">{AREAS.pot.greek}</span>
              <b>{AREAS.pot.name}</b>
              <span>{AREAS.pot.fit}</span>
            </span>
          </Link>
        </li>
        <li>
          <Link href={AREAS.board.href} transitionTypes={["page-turn"]} className={styles.makeCard}>
            <svg className={styles.fig} viewBox="0 0 1 1" aria-hidden="true">
              <path className={styles.cord} d="M0.3 0.26L0.5 0.1L0.7 0.26" />
              <circle className={styles.gloss} cx="0.5" cy="0.1" r="0.018" />
              <rect className={styles.gloss} x="0.05" y="0.26" width="0.9" height="0.66" rx="0.012" />
              <rect className={styles.scratch} x="0.075" y="0.285" width="0.85" height="0.61" />
              {PANELS.map((x, i) => (
                <g key={x}>
                  <rect className={styles.clay} x={x} y={PANEL.y} width={PANEL.w} height={PANEL.h} />
                  {i === 0 && <g transform={`translate(${f4(x + PANEL.w / 2)} ${f4(PANEL.y + 0.04)}) scale(${f4(MINI)})`}>
                    <path className={styles.gloss} d={POT} />
                    {HANDLES.map((d) => <path key={d} className={styles.handle} d={d} />)}
                  </g>}
                  {i === 1 && <g transform={`translate(${f4(x + 0.005)} ${f4(PANEL.y)})`}>
                    {[0.08, 0.14, 0.18, 0.22].map((y) => <line key={y} className={styles.panelLine} x1="0.02" x2="0.2" y1={y} y2={y} />)}
                    {PLUCKS.map(([px, py]) => <circle key={px} className={styles.gloss} cx={px} cy={py} r="0.012" />)}
                  </g>}
                  {i === 2 && [0.07, 0.12, 0.17, 0.22].map((y, k) => <line key={y} className={styles.panelInk} x1={f4(x + 0.03)} x2={f4(x + PANEL.w - 0.03 - (k === 3 ? 0.07 : 0))} y1={f4(PANEL.y + y)} y2={f4(PANEL.y + y)} />)}
                </g>
              ))}
              <line className={styles.addedRed} x1="0.075" x2="0.925" y1="0.76" y2="0.76" />
              <line className={styles.scratch} x1="0.075" x2="0.925" y1="0.8" y2="0.8" />
            </svg>
            <span className={styles.txt}>
              <span className={styles.gr} lang="grc">{AREAS.board.greek}</span>
              <b>{AREAS.board.name}</b>
              <span>{AREAS.board.fit}</span>
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

/** The small print for the three pictures and counts at the head of the page, which ends the page rather than sitting under them. */
export function ExploreCredit() {
  return (
    <p className={styles.credit}>
      Map: the Ancient World Mapping Center (ODbL) and Pleiades (CC BY); counts from GLAUx (CC BY-SA). Archaeology: <span data-credit="kerameikos-street">{KER.title}{KER.creator && !/^unknown$/i.test(KER.creator) ? `, ${KER.creator}` : ""}, <a href={KER.licenceUrl || KER.source} rel="noopener">{KER.licence}</a>, via <a href={KER.source} rel="noopener">{KER.sourceName}</a></span>.
    </p>
  );
}
