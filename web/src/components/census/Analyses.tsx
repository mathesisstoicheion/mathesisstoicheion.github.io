"use client";
/**
 * "Looking closer": four charts drawn from the counts, each one a way into the lists above.
 *   How much of the text the commonest words make up (follows the place chosen above)
 *   What the text is made of: its running words by part of speech (follows the place chosen above)
 *   The shape of the library: its words by kind of writing and period; a cell chooses that place
 *   Authors' vocabularies: how many different words each uses, by size; a dot chooses that author
 */
import { useMemo, useRef, useState } from "react";
import { EMPTY_SCOPE, groupInfo, groupOf, type CensusMeta, type Scope } from "@/lib/census";
import { inList, loadAuthorStats, WORD_KINDS, type Register } from "@/lib/census-register";
import { useLoad } from "@/lib/use-load";
import { fmt } from "./shared";
import styles from "./Census.module.css";

export default function Analyses({ meta, reg, scope, counts, onScope, onBand }: {
  meta: CensusMeta; reg: Register; scope: Scope; counts: Map<number, number> | null | undefined;
  onScope: (s: Scope, label: string) => void; onBand: (h: string, label: string) => void;
}) {
  const where = groupInfo(meta, groupOf(scope)).label.replace(/^The /, "the ");
  const values = useMemo(() => (counts === undefined ? null : counts ? [...counts.values()] : reg.n), [counts, reg]);
  return (
    <section className={styles.analyses} aria-labelledby="an-h">
      <h2 id="an-h">Looking closer</h2>
      <p className={styles.blurb}>Four ways to see the counts at once. The first two follow what you chose above ({where}); the last two choose it.</p>
      <div className={styles.anGrid}>
        <Coverage values={values} where={where} onBand={onBand} />
        <MadeOf reg={reg} counts={counts} where={where} />
        <Shape meta={meta} scope={scope} onScope={onScope} />
        <Authors meta={meta} scope={scope} onScope={onScope} />
      </div>
    </section>
  );
}

// ------------------------------------------------------------ how much of the text the commonest words make up
function Coverage({ values, where, onBand }: { values: number[] | null; where: string; onBand: (h: string, label: string) => void }) {
  const curve = useMemo(() => {
    if (!values?.length) return null;
    const sorted = [...values].sort((a, b) => b - a);
    const sum = sorted.reduce((s, n) => s + n, 0);
    const cum: number[] = [];
    let acc = 0;
    for (const n of sorted) { acc += n; cum.push(acc / sum); }
    const once = sorted.filter((n) => n === 1).length;
    return { cum, sum, once };
  }, [values]);
  const [k, setK] = useState(100);
  const svg = useRef<SVGSVGElement>(null);
  if (!curve) return <figure className={styles.anCard} aria-busy="true"><figcaption className="label">How many words make a page</figcaption><p className="muted">Counting…</p></figure>;
  const N = curve.cum.length;
  const lx = (x: number) => (Math.log10(x) / Math.log10(Math.max(N, 10))) * 100;
  const at = Math.min(Math.max(1, k), N);
  const share = curve.cum[at - 1];
  const step = Math.max(1, Math.floor(N / 400));
  const pts: string[] = [];
  for (let i = 1; i <= N; i = i < 200 ? i + 1 : i + step) pts.push(`${lx(i).toFixed(2)},${(100 - curve.cum[i - 1] * 100).toFixed(2)}`);
  pts.push(`100,${(100 - 100).toFixed(2)}`);
  const pick = (clientX: number) => {
    const r = svg.current!.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setK(Math.max(1, Math.round(10 ** (f * Math.log10(Math.max(N, 10))))));
  };
  const ticks = [1, 10, 100, 1000, 10000, 100000].filter((t) => t <= N);
  return (
    <figure className={styles.anCard}>
      <figcaption className="label">How many words make a page</figcaption>
      <p className={styles.anLead}>
        The <b>{fmt(at)}</b> commonest {at === 1 ? "word makes" : "words make"} up <b className={styles.anBig}>{(share * 100).toFixed(1)}%</b> of the {fmt(curve.sum)} words read in {where}.
      </p>
      <svg ref={svg} className={styles.curve} viewBox="-2 -4 106 112" preserveAspectRatio="none" role="slider" tabIndex={0}
        aria-label="How many of the commonest words" aria-valuemin={1} aria-valuemax={N} aria-valuenow={at}
        aria-valuetext={`${fmt(at)} commonest words: ${(share * 100).toFixed(1)}% of the text`}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); pick(e.clientX); }}
        onPointerMove={(e) => { if (e.buttons || e.pointerType === "mouse") pick(e.clientX); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setK(Math.min(N, Math.ceil(at * 1.25) + (at < 4 ? 1 : 0))); }
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setK(Math.max(1, Math.floor(at / 1.25))); }
          if (e.key === "PageUp") { e.preventDefault(); setK(Math.min(N, at * 10)); }
          if (e.key === "PageDown") { e.preventDefault(); setK(Math.max(1, Math.floor(at / 10))); }
          if (e.key === "Home") { e.preventDefault(); setK(1); }
          if (e.key === "End") { e.preventDefault(); setK(N); }
        }}>
        {[25, 50, 75].map((y) => <line key={y} className={styles.grid} x1="0" x2="100" y1={100 - y} y2={100 - y} />)}
        <polygon className={styles.area} points={`0,100 ${pts.join(" ")} 100,100`} />
        <polyline className={`${styles.line} ${styles.iconDot}`} points={pts.join(" ")} />
        <line className={styles.cursor} x1={lx(at)} x2={lx(at)} y1="0" y2="100" />
        <line className={styles.cursor} x1="0" x2={lx(at)} y1={100 - share * 100} y2={100 - share * 100} />
        <circle className={`${styles.dot} ${styles.iconDot}`} cx={lx(at)} cy={100 - share * 100} r="1.8" />
      </svg>
      <div className={styles.axis} aria-hidden="true">
        {ticks.map((t) => <span key={t} style={{ left: `${lx(t)}%` }}>{t >= 1000 ? `${t / 1000}k` : t}</span>)}
      </div>
      <p className={styles.anNote}>
        Drag along the curve, or use the arrow keys. Different dictionary words, commonest first (left), on a scale of tens. {fmt(curve.once)} of the {fmt(N)} are used only once here:{" "}
        <button type="button" className={styles.linkBtn} onClick={() => onBand("1", "Looking closer")}>see them</button>.
      </p>
    </figure>
  );
}

// ------------------------------------------------------------ what the text is made of
function MadeOf({ reg, counts, where }: { reg: Register; counts: Map<number, number> | null | undefined; where: string }) {
  const parts = useMemo(() => {
    if (counts === undefined) return null;
    const kinds = [
      { id: "names", label: "Names" }, ...WORD_KINDS.filter((k) => k.id !== "words").map((k) => ({ id: k.id, label: k.label })),
    ];
    const tot = new Map<string, number>(kinds.map((k) => [k.id, 0]));
    let all = 0, other = 0;
    const add = (i: number, n: number) => {
      all += n;
      const hit = kinds.find((k) => inList(reg, k.id, i));
      if (hit) tot.set(hit.id, tot.get(hit.id)! + n); else other += n;
    };
    if (counts) for (const [i, n] of counts) add(i, n); else reg.n.forEach((n, i) => add(i, n));
    return { all, rows: [...kinds.map((k) => ({ ...k, n: tot.get(k.id)! })), { id: "other", label: "Other", n: other }].filter((r) => r.n > 0).sort((a, b) => b.n - a.n) };
  }, [reg, counts]);
  const [hover, setHover] = useState<string | null>(null);
  if (!parts) return <figure className={styles.anCard} aria-busy="true"><figcaption className="label">What the text is made of</figcaption><p className="muted">Counting…</p></figure>;
  const top = parts.rows.find((r) => r.id === hover) ?? parts.rows[0];
  return (
    <figure className={styles.anCard}>
      <figcaption className="label">What the text is made of</figcaption>
      <p className={styles.anLead}><b>{top.label}</b> are <b className={styles.anBig}>{((top.n / parts.all) * 100).toFixed(1)}%</b> of the running words in {where} ({fmt(top.n)}).</p>
      <div className={styles.stack} onMouseLeave={() => setHover(null)}>
        {parts.rows.map((r, i) => (
          <span key={r.id} tabIndex={0} role="img" style={{ "--w": `${(r.n / parts.all) * 100}%`, "--i": i } as React.CSSProperties} data-on={(hover ?? parts.rows[0].id) === r.id ? "" : undefined}
            onMouseEnter={() => setHover(r.id)} onFocus={() => setHover(r.id)} onBlur={() => setHover(null)} aria-label={`${r.label}: ${((r.n / parts.all) * 100).toFixed(1)}%`} />
        ))}
      </div>
      <ul className={styles.legend}>
        {parts.rows.map((r) => (
          <li key={r.id} data-on={(hover ?? parts.rows[0].id) === r.id ? "" : undefined} onMouseEnter={() => setHover(r.id)}>
            <i /> {r.label} <small>{((r.n / parts.all) * 100).toFixed(1)}%</small>
          </li>
        ))}
      </ul>
      <p className={styles.anNote}>Every word counted where it stands, under its dictionary word&apos;s part of speech as GLAUx gives it most often. “Little words” are the article, prepositions, conjunctions, particles and interjections.</p>
    </figure>
  );
}

// ------------------------------------------------------------ the shape of the library
function Shape({ meta, scope, onScope }: { meta: CensusMeta; scope: Scope; onScope: (s: Scope, label: string) => void }) {
  const fams = Object.entries(meta.groups).filter(([id]) => /^f\d+$/.test(id));
  const pers = Object.entries(meta.groups).filter(([id]) => /^p\d+$/.test(id));
  const max = Math.max(...fams.flatMap(([f]) => pers.map(([p]) => meta.groups[`${f}${p}`]?.[1] ?? 0)));
  const [hover, setHover] = useState<string | null>(null);
  const shown = hover ? meta.groups[hover] : null;
  return (
    <figure className={styles.anCard}>
      <figcaption className="label">The shape of the library</figcaption>
      <p className={styles.anLead}>
        {shown ? <><b>{shown[0]}</b>: <b className={styles.anBig}>{fmt(shown[1])}</b> words, {((shown[1] / meta.words) * 100).toFixed(1)}% of the library.</> : <>Where the {fmt(meta.words)} words come from: each square is a kind of writing in one period, larger for more words.</>}
      </p>
      <div className={styles.shape} role="group" aria-label="Words by kind of writing and period" onMouseLeave={() => setHover(null)}>
        <span />
        {pers.map(([p, [label]]) => (
          <button key={p} type="button" className={styles.shapeHead} onMouseEnter={() => setHover(p)} onFocus={() => setHover(p)} onBlur={() => setHover(null)} title={label}
            aria-pressed={scope.p === +p.slice(1) && scope.f === null && !scope.a} onClick={() => onScope({ ...EMPTY_SCOPE, p: +p.slice(1) }, "Looking closer")}>
            {label.split(" · ")[0]}
          </button>
        ))}
        {fams.map(([f, [flabel]]) => (
          <div key={f} style={{ display: "contents" }}>
            <button type="button" className={styles.shapeRow} onMouseEnter={() => setHover(f)} onFocus={() => setHover(f)} onBlur={() => setHover(null)}
              aria-pressed={scope.f === +f.slice(1) && scope.p === null && !scope.a} onClick={() => onScope({ ...EMPTY_SCOPE, f: +f.slice(1) }, "Looking closer")}>
              {flabel}
            </button>
            {pers.map(([p]) => {
              const id = `${f}${p}`, n = meta.groups[id]?.[1] ?? 0;
              const on = scope.f === +f.slice(1) && scope.p === +p.slice(1) && !scope.a;
              return n ? (
                <button key={id} type="button" className={styles.cell} aria-pressed={on} onMouseEnter={() => setHover(id)} onFocus={() => setHover(id)} onBlur={() => setHover(null)}
                  aria-label={`${meta.groups[id][0]}: ${fmt(n)} words`} onClick={() => onScope({ ...EMPTY_SCOPE, f: +f.slice(1), p: +p.slice(1) }, "Looking closer")}>
                  <i style={{ "--s": `${Math.max(8, Math.sqrt(n / max) * 100)}%` } as React.CSSProperties} />
                </button>
              ) : <span key={id} className={styles.cellEmpty} aria-hidden="true" />;
            })}
          </div>
        ))}
      </div>
      <p className={styles.anNote}>Choose a square, a kind of writing or a period to count only there.</p>
    </figure>
  );
}

// ------------------------------------------------------------ authors' vocabularies
function Authors({ meta, scope, onScope }: { meta: CensusMeta; scope: Scope; onScope: (s: Scope, label: string) => void }) {
  const st = useLoad("authorstats", loadAuthorStats);
  const [measure, setMeasure] = useState<"rich" | "only">("rich");
  const [hover, setHover] = useState<string | null>(null);
  const pts = useMemo(() => {
    if (st.state !== "done" || !st.value) return null;
    return st.value.rows.filter((r) => (measure === "rich" ? r[5] !== null && r[6] >= 5 : r[1] >= 5000)).map((r) => ({
      id: r[0], name: meta.authors.find((a) => a[0] === r[0])?.[1] ?? r[0], words: r[1], different: r[2], only: r[3], y: measure === "rich" ? r[5]! : (r[3] / r[2]) * 100,
    }));
  }, [st, measure, meta]);
  if (!pts) return <figure className={styles.anCard} aria-busy="true"><figcaption className="label">Authors&apos; vocabularies</figcaption><p className="muted">Counting…</p></figure>;
  const win = st.state === "done" && st.value ? st.value.window : 1000;
  const xs = pts.map((p) => Math.log10(p.words)), ys = pts.map((p) => p.y);
  const x0 = Math.floor(Math.min(...xs)), x1 = Math.ceil(Math.max(...xs)), y1 = Math.max(...ys) * 1.08;
  const X = (w: number) => ((Math.log10(w) - x0) / (x1 - x0)) * 100, Y = (y: number) => 100 - (y / y1) * 100;
  const top = [...pts].sort((a, b) => b.y - a.y);
  const h = pts.find((p) => p.id === (hover ?? scope.a)) ?? top[0];
  const fmtY = (y: number) => (measure === "rich" ? y.toFixed(0) : `${y.toFixed(1)}%`);
  return (
    <figure className={styles.anCard}>
      <figcaption className="label">Authors&apos; vocabularies</figcaption>
      <div className={styles.seg} role="group" aria-label="Measure">
        <button type="button" aria-pressed={measure === "rich"} onClick={() => setMeasure("rich")}>Richness</button>
        <button type="button" aria-pressed={measure === "only"} onClick={() => setMeasure("only")}>Words of their own</button>
      </div>
      <p className={styles.anLead}>
        <b>{h.name}</b>: {measure === "rich"
          ? <><b className={styles.anBig}>{fmtY(h.y)}</b> different words in every {fmt(win)}, across {fmt(h.words)} words.</>
          : <><b className={styles.anBig}>{fmtY(h.y)}</b> of {fmt(h.different)} different words used by no other author ({fmt(h.only)}).</>}
      </p>
      <div className={styles.scatterBox}>
        <svg className={styles.scatter} viewBox="-3 -3 106 106" preserveAspectRatio="none" aria-hidden="true">
          {[0.25, 0.5, 0.75].map((f) => <line key={f} className={styles.grid} x1="0" x2="100" y1={100 - f * 100} y2={100 - f * 100} />)}
        </svg>
        <div className={styles.dots2} onMouseLeave={() => setHover(null)}>
          {pts.map((p) => (
            <button key={p.id} type="button" style={{ left: `${X(p.words)}%`, top: `${Y(p.y)}%` }} aria-pressed={scope.a === p.id}
              data-on={h.id === p.id ? "" : undefined} aria-label={`${p.name}: ${fmtY(p.y)}, ${fmt(p.words)} words`}
              onMouseEnter={() => setHover(p.id)} onFocus={() => setHover(p.id)} onBlur={() => setHover(null)} onClick={() => onScope({ ...EMPTY_SCOPE, a: p.id }, "Looking closer")} />
          ))}
        </div>
        <span className={styles.yLab}>{measure === "rich" ? `different words per ${fmt(win)}` : "share of words no one else uses"}</span>
        <div className={styles.axis} aria-hidden="true">
          {Array.from({ length: x1 - x0 + 1 }, (_, i) => x0 + i).map((e) => <span key={e} style={{ left: `${((e - x0) / (x1 - x0)) * 100}%` }}>{fmt(10 ** e)}</span>)}
        </div>
      </div>
      <p className={styles.anNote}>
        {measure === "rich"
          ? <>Each dot is an author: across, how many words of theirs were read (on a scale of tens); up, how many different dictionary words they use in each stretch of {fmt(win)} words, on average, so long and short authors compare fairly. Highest: {top.slice(0, 3).map((p) => p.name).join(", ")}.</>
          : <>Each dot is an author with at least 5,000 words: up, the share of their different words that no other author in the library uses. Choose a dot to count only that author.</>}
      </p>
    </figure>
  );
}
