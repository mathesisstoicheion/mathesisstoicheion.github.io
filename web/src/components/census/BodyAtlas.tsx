"use client";
/**
 * The body atlas: an engraved figure whose parts carry red dots sized by how often a kind of writing names that part,
 * per 10,000 words. Tabs choose the kind of writing.
 */
import { useMemo, useState } from "react";
import { EMPTY_SCOPE, fmtRate, scopeParams, type CensusMeta } from "@/lib/census";
import { familyWords, loadFamilyCounts, type Register } from "@/lib/census-register";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import { transliterate } from "@/lib/translit";
import { fmt, useHitRadius, useLoad } from "./shared";
import styles from "./Census.module.css";

interface Part { grc: string; en: string; x?: number; y?: number }
const PARTS: Part[] = [
  { grc: "κόμη", en: "hair", x: 100, y: 8 }, { grc: "κεφαλή", en: "head", x: 100, y: 34 },
  { grc: "ὀφθαλμός", en: "eye", x: 88, y: 42 }, { grc: "οὖς", en: "ear", x: 125, y: 44 },
  { grc: "στόμα", en: "mouth", x: 100, y: 60 }, { grc: "τράχηλος", en: "neck", x: 100, y: 86 },
  { grc: "ὦμος", en: "shoulder", x: 64, y: 104 }, { grc: "στῆθος", en: "chest", x: 100, y: 124 },
  { grc: "πνεύμων", en: "lung", x: 84, y: 136 }, { grc: "καρδία", en: "heart", x: 112, y: 144 },
  { grc: "ἧπαρ", en: "liver", x: 86, y: 172 }, { grc: "νεφρός", en: "kidney", x: 116, y: 184 },
  { grc: "γαστήρ", en: "belly", x: 100, y: 206 }, { grc: "ἀγκών", en: "elbow", x: 46, y: 178 },
  { grc: "χείρ", en: "hand", x: 34, y: 250 }, { grc: "δάκτυλος", en: "finger", x: 30, y: 278 },
  { grc: "μηρός", en: "thigh", x: 86, y: 292 }, { grc: "γόνυ", en: "knee", x: 86, y: 352 },
  { grc: "σκέλος", en: "leg", x: 114, y: 392 }, { grc: "πούς", en: "foot", x: 90, y: 458 },
  { grc: "γλῶσσα", en: "tongue" }, { grc: "ὀδούς", en: "tooth" }, { grc: "ὀστέον", en: "bone" },
  { grc: "δέρμα", en: "skin" }, { grc: "πλευρά", en: "side, rib" }, { grc: "σπλάγχνον", en: "inward parts" },
];

const FIGURE =
  "M100 17 C114 17 120 30 120 42 C120 56 112 66 106 70 L106 84 C118 88 134 94 142 102 " +
  "C146 108 146 116 144 128 C142 156 130 196 122 215 C124 228 128 238 128 250 " +
  "C128 280 120 330 118 380 C117 420 114 445 112 458 C112 466 100 468 100 460 " +
  "C100 440 100 400 100 340 C100 300 100 270 100 250 " +
  "C100 270 100 300 100 340 C100 400 100 440 100 460 C100 468 88 466 88 458 " +
  "C86 445 83 420 82 380 C80 330 72 280 72 250 C72 238 76 228 78 215 C70 196 58 156 56 128 " +
  "C54 116 54 108 58 102 C66 94 82 88 94 84 L94 70 C88 66 80 56 80 42 C80 30 86 17 100 17 Z";
const ARM_L = "M58 102 C48 130 40 190 36 250";
const ARM_R = "M142 102 C152 130 160 190 164 250";
const LEG_GAP = "M100 250 C100 300 100 340 100 380";

interface Row { part: Part; id: number; count: number; rate: number }
interface Data { counts: Awaited<ReturnType<typeof loadFamilyCounts>> }

export default function BodyAtlas({ meta, reg, onOpen }: {
  meta: CensusMeta; reg: Register; onOpen: (changes: [string, string | null][], label: string) => void;
}) {
  const [tab, setTab] = useState(-1);
  const [hover, setHover] = useState<Row | null>(null);
  const still = prefersReducedMotion(useSettings((s) => s.motion));
  const load = useLoad<Data>("census-body-atlas", async () => ({ counts: await loadFamilyCounts() }));
  const svgRef = useHitRadius(280, 486, load.state === "done");
  const fw = useMemo(() => familyWords(meta, reg), [meta, reg]);

  const rows = useMemo<Row[]>(() => {
    if (load.state !== "done") return [];
    const { counts } = load.value;
    const out: Row[] = [];
    for (const part of PARTS) {
      const id = reg.w.indexOf(part.grc);
      if (id < 0) continue;
      let count: number, rate: number;
      if (tab === -1) { count = reg.n[id] ?? 0; rate = meta.words ? (count * 10000) / meta.words : 0; }
      else { const c = counts?.[id]; count = c ? c[tab] ?? 0 : 0; rate = fw[tab] ? (count * 10000) / fw[tab] : 0; }
      out.push({ part, id, count, rate });
    }
    return out;
  }, [load, reg, meta.words, tab, fw]);

  if (load.state === "loading") return <section className={styles.body}><h2>The body atlas</h2><p className="muted">Counting…</p></section>;
  if (load.state === "error") return null;

  const tabName = tab === -1 ? "all writing" : reg.families[tab];
  const placed = rows.filter((r) => r.part.x !== undefined);
  const maxPlaced = Math.max(1e-9, ...placed.map((r) => r.rate));
  const top3 = new Set([...placed].sort((a, b) => b.rate - a.rate).slice(0, 3).map((r) => r.part.grc));
  const ranked = [...rows].sort((a, b) => b.rate - a.rate);
  const maxList = Math.max(1e-9, ...ranked.map((r) => r.rate));
  const top3List = new Set(ranked.slice(0, 3).map((r) => r.part.grc));
  const open = (r: Row) => onOpen([
    ["c", "words"], ...scopeParams(tab === -1 ? EMPTY_SCOPE : { ...EMPTY_SCOPE, f: tab }),
    ["o", null], ["h", null], ["u", null], ["q", null], ["i", r.part.grc],
  ], "The body atlas");

  return (
    <section className={styles.body}>
      <h2>The body atlas</h2>
      <p className={styles.blurb}>How often each kind of writing names each part of the body, per 10,000 words. Choose a kind of writing and watch the figure change.</p>
      <div className={styles.bodyTabs}>
        {[-1, ...reg.families.map((_, i) => i)].map((t) => (
          <button key={t} type="button" className="chip" aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t === -1 ? "All writing" : reg.families[t]}
          </button>
        ))}
      </div>
      <div className={styles.bodyMain}>
        <figure className={styles.bodyFig}>
          <p className={styles.bodyInfo} aria-live="polite">
            {hover ? (
              <>
                <b lang="grc">{hover.part.grc}</b> {transliterate(hover.part.grc)} · {hover.part.en} · {fmt(hover.count)} uses · {fmtRate(hover.rate)} per 10,000 words
              </>
            ) : <span className={styles.bodyHint}>Point at a part of the body</span>}
          </p>
          <svg ref={svgRef} className={styles.bodySvg} viewBox="-40 -6 280 486" role="group" aria-label="A human figure with dots on the body parts named in the chosen writing">
            <g className={styles.bodyLines}>
              <path d={FIGURE} />
              <path d={ARM_L} />
              <path d={ARM_R} />
              <path d={LEG_GAP} />
            </g>
            {placed.map((r) => {
              const x = r.part.x!, y = r.part.y!;
              const rad = 2 + 12 * Math.sqrt(r.rate / maxPlaced);
              const left = x < 100 || r.part.grc === "κεφαλή";   // the head is named on the left, clear of the ear
              return (
                <g key={r.part.grc} className={styles.bodyDot} role="button" tabIndex={0} data-touch-strip=""
                  aria-label={`${r.part.en}: ${fmtRate(r.rate)} per 10,000 words in ${tabName}`}
                  onMouseEnter={() => setHover(r)} onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(r)} onBlur={() => setHover(null)}
                  onClick={() => open(r)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(r); } }}>
                  <circle className={styles.hit} cx={x} cy={y} />
                  <circle className={styles.iconDot} cx={x} cy={y} r={rad} style={still ? { transition: "none" } : undefined} />
                  {top3.has(r.part.grc) && (
                    <text x={left ? x - rad - 3 : x + rad + 3} y={y + 3} textAnchor={left ? "end" : "start"}>{r.part.en}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </figure>
        <ol className={styles.bodyList}>
          {ranked.map((r, i) => (
            <li key={r.part.grc}>
              <button type="button" className={styles.bodyRow} onClick={() => open(r)}
                onMouseEnter={() => setHover(r)} onMouseLeave={() => setHover(null)}>
                <span className={styles.bodyRank}>{i + 1}</span>
                <span className={styles.bodyWord}><span lang="grc">{r.part.grc}</span> <small>{r.part.en}</small></span>
                <span className={styles.bodyBar}><i className={top3List.has(r.part.grc) ? styles.bodyTop : undefined} style={{ width: `${(r.rate / maxList) * 100}%` }} /></span>
                <span className={styles.bodyRate}>{r.rate.toFixed(1)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <p className={styles.fine}>Counted by dictionary word, every form together. Some words have other senses: πούς is also a measure (a foot), γλῶσσα also a language, στόμα also any opening.</p>
    </section>
  );
}
