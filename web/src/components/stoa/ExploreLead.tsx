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
import { project, shortName, type Base, type Place } from "@/lib/map";
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
              alt={KER.alt} title={`${KER.title} · ${KER.sourceName} · ${KER.licence}`} width={KER.width} height={KER.height} loading="lazy" decoding="async" />
            <span className={styles.txt}>
              <span className={styles.gr} lang="grc">{AREAS.archaeology.greek}</span>
              <b>Archaeology</b>
              <span>How we know: digs, dating, pottery, and the great sites and finds.</span>
            </span>
          </Link>
        </li>
      </ul>
      <p className={styles.credit}>Map: the Ancient World Mapping Center (ODbL) and Pleiades (CC BY); counts from GLAUx (CC BY-SA). Photograph: {KER.title}, {KER.sourceName}, {KER.licence}.</p>
    </nav>
  );
}
