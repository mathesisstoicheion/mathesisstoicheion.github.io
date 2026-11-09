"use client";
/**
 * The moving centre of the world: the places the library mentions most in each of the five ages, sized by mentions per
 * 10,000 words, and the weighted centre of those mentions, which travels from age to age.
 */
import { useEffect, useMemo, useState } from "react";
import { EMPTY_SCOPE, loadGroup, scopeParams, type CensusMeta } from "@/lib/census";
import { loadMap, mapSize, placesByName, project, ringsPath, shortName, type Place } from "@/lib/map";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import Icon from "@/components/Icon";
import { fmt, useLoad } from "./shared";
import styles from "./Census.module.css";

const AGES = [0, 1, 2, 3, 4];
const STEP_MS = 1800;

interface Dot { place: Place; grc: string; count: number; rate: number; xy: [number, number] }
interface Age { p: number; label: string; dates: string; dots: Dot[]; centre: [number, number] | null }
interface Data { w: number; h: number; sea: string; lakes: string; ages: Age[]; nearest: (xy: [number, number]) => Place | null; all: Place[] }

async function build(meta: CensusMeta): Promise<Data> {
  const [{ base }, byName] = await Promise.all([loadMap(), placesByName()]);
  const [w, h] = mapSize(base);
  const inside = (xy: [number, number]) => xy[0] >= 0 && xy[0] <= w && xy[1] >= 0 && xy[1] <= h;
  const ages: Age[] = [];
  for (const p of AGES) {
    const [label, words] = meta.groups[`p${p}`] ?? ["", 0];
    const lists = await loadGroup(`p${p}`);
    const dots: Dot[] = [];
    for (const row of (lists?.place ?? []).slice(0, 40)) {
      const place = byName.get(String(row[0]).normalize("NFC"));
      if (!place) continue;
      const xy = project(base, place.lon, place.lat);
      if (!inside(xy)) continue;
      const count = Number(row[1]);
      dots.push({ place, grc: String(row[0]), count, rate: words ? (count * 10000) / words : 0, xy });
    }
    let centre: [number, number] | null = null;
    const total = dots.reduce((s, d) => s + d.count, 0);
    if (total > 0) centre = [dots.reduce((s, d) => s + d.xy[0] * d.count, 0) / total, dots.reduce((s, d) => s + d.xy[1] * d.count, 0) / total];
    const [name, dates = ""] = label.split(" · ");
    ages.push({ p, label: name, dates, dots, centre });
  }
  const all = [...new Set(byName.values())].filter((pl) => inside(project(base, pl.lon, pl.lat)));
  const pts = all.map((pl) => ({ pl, xy: project(base, pl.lon, pl.lat) }));
  const nearest = (c: [number, number]) => {
    let best: Place | null = null, bd = Infinity;
    for (const { pl, xy } of pts) { const d = (xy[0] - c[0]) ** 2 + (xy[1] - c[1]) ** 2; if (d < bd) { bd = d; best = pl; } }
    return best;
  };
  return { w, h, sea: ringsPath(base, base.water), lakes: ringsPath(base, base.lakes), ages, nearest, all };
}

export default function MovingMap({ meta, onOpen }: { meta: CensusMeta; onOpen: (changes: [string, string | null][], label: string) => void }) {
  const load = useLoad("moving", () => build(meta));
  const reduce = prefersReducedMotion(useSettings((s) => s.motion));
  const [age, setAge] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState<Dot | null>(null);

  useEffect(() => {
    if (!playing || age >= AGES.length - 1) return;
    const t = setTimeout(() => setAge((a) => a + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [playing, age]);

  const active = playing && age < AGES.length - 1;   // playing stops by itself at the last age
  const data = load.state === "done" ? load.value : null;
  const maxRate = useMemo(() => Math.max(1e-9, ...(data?.ages.flatMap((a) => a.dots.map((d) => d.rate)) ?? [0])), [data]);
  if (load.state === "loading") return <p className="muted">Counting…</p>;
  if (!data) return null;

  const cur = data.ages[age];
  const open = (d: Dot) => onOpen([["c", "place"], ...scopeParams({ ...EMPTY_SCOPE, p: cur.p }), ["o", null], ["h", null], ["u", null], ["q", null], ["i", d.grc]], "The moving centre");
  const rScale = (data.w * 0.03) / 2;   // the largest dot is about 3% of the map's width across
  const radius = (rate: number) => rScale * (0.2 + 0.8 * Math.sqrt(rate / maxRate));
  const fs = data.w * 0.018;
  const top3 = new Set(cur.dots.slice(0, 3).map((d) => d.place.id));
  const labelled = new Set(cur.dots.slice(0, 5).map((d) => d.place.id));
  const near = cur.centre ? data.nearest(cur.centre) : null;
  // every place that appears in any age keeps its circle, so it grows or shrinks between ages
  const ids = new Map<string, { place: Place; grc: string; xy: [number, number] }>();
  for (const a of data.ages) for (const d of a.dots) if (!ids.has(d.place.id)) ids.set(d.place.id, { place: d.place, grc: d.grc, xy: d.xy });
  const trail = data.ages.filter((a) => a.centre).map((a) => a.centre!);
  const trailD = trail.map((c, i) => `${i ? "L" : "M"}${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join("");
  const tx = reduce ? "none" : undefined;

  return (
    <section className={styles.moving} aria-labelledby="moving-h">
      <h2 id="moving-h">The moving centre of the world</h2>
      <p className={styles.blurb}>The places the library mentions most in each age, sized by mentions per 10,000 words. The red ring is the centre of all those mentions; watch it travel.</p>
      <div className={styles.movingAges}>
        <div className={styles.movingTabs} role="group" aria-label="Age">
          {data.ages.map((a, i) => (
            <button key={a.p} type="button" aria-pressed={i === age} className={styles.movingTab} onClick={() => { setPlaying(false); setAge(i); }}>
              <span>{a.label}</span><small>{a.dates}</small>
            </button>
          ))}
        </div>
        <button type="button" className={`btn ${styles.movingPlay}`} aria-label={active ? "Pause" : "Play through the ages"}
          onClick={() => { if (active) setPlaying(false); else { if (age >= AGES.length - 1) setAge(0); setPlaying(true); } }}>
          <Icon name={active ? "pause" : "play"} />
        </button>
      </div>
      <div className={styles.movingBody}>
        <figure className={styles.movingFig}>
          <p className={styles.movingInfo} aria-live="polite">
            {hover ? <><b lang="grc">{hover.grc}</b> <span>{shortName(hover.place)}</span> · {fmt(hover.count)} mentions · {hover.rate.toFixed(1)} per 10,000 words</> : <span className={styles.movingHint}>Hover a place for its numbers; choose it to open its list.</span>}
          </p>
          <svg viewBox={`0 0 ${data.w} ${data.h}`} role="img" aria-label={`A map of the Mediterranean world: the places mentioned most in the ${cur.label} age, and the centre of those mentions`} className={styles.movingSvg}>
            <rect width={data.w} height={data.h} className={styles.movingLand} />
            <path d={data.sea} className={styles.movingSea} />
            <path d={data.lakes} className={styles.movingSea} />
            {[...ids.entries()].map(([id, g]) => {
              const d = cur.dots.find((x) => x.place.id === id);
              const rank = d ? top3.has(id) : false;
              return (
                <g key={id} role="button" tabIndex={d ? 0 : -1} aria-hidden={d ? undefined : true}
                  aria-label={d ? `${shortName(d.place)}: ${d.count} mentions in ${cur.label}` : undefined}
                  className={styles.movingDot} style={{ pointerEvents: d ? "auto" : "none" }}
                  onMouseEnter={() => d && setHover(d)} onMouseLeave={() => setHover(null)}
                  onFocus={() => d && setHover(d)} onBlur={() => setHover(null)}
                  onClick={() => d && open(d)} onKeyDown={(e) => { if (d && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(d); } }}>
                  <circle cx={g.xy[0]} cy={g.xy[1]} r={d ? radius(d.rate) : 0} className={rank ? styles.movingTop : styles.movingPlace}
                    style={{ opacity: d ? undefined : 0, transition: tx }} />
                  {d && labelled.has(id) && <text x={g.xy[0] + radius(d.rate) + fs * 0.3} y={g.xy[1] + fs * 0.35} style={{ fontSize: fs, strokeWidth: fs * 0.3 }}>{shortName(d.place)}</text>}
                </g>
              );
            })}
            <path d={trailD} className={styles.movingTrail} style={{ strokeWidth: data.w * 0.002, strokeDasharray: `${data.w * 0.008} ${data.w * 0.006}` }} />
            {data.ages.map((a, i) => a.centre && i !== age && <circle key={a.p} cx={a.centre[0]} cy={a.centre[1]} r={data.w * 0.007} className={styles.movingRing} style={{ strokeWidth: data.w * 0.002 }} />)}
            {cur.centre && <circle cx={cur.centre[0]} cy={cur.centre[1]} r={data.w * 0.013} className={styles.movingNow} style={{ strokeWidth: data.w * 0.004, transition: tx }} />}
          </svg>
          <figcaption className={styles.movingCaption}>{near ? <>Centre of mentions: near {shortName(near)}</> : "Centre of mentions: not enough places in this age"}</figcaption>
        </figure>
        <ol className={styles.movingList}>
          {cur.dots.slice(0, 10).map((d, i) => (
            <li key={d.place.id}>
              <button type="button" onClick={() => open(d)}>
                <span className={styles.movingRank}>{i + 1}</span>
                <b lang="grc">{d.grc}</b>
                <span className={styles.movingEn}>{shortName(d.place)}</span>
                <small>{fmt(d.count)}</small>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <p className={styles.fine}>Places matched to Pleiades through the site&apos;s map; each age reflects the works the library has from it.</p>
    </section>
  );
}
