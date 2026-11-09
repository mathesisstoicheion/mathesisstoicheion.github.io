"use client";
/**
 * The Census: every word, name, thing and phrase the library uses, counted. One search box and one sentence of
 * choices ("Show gods and heroes in the whole library, most mentioned first, used any number of times") pick the
 * list; each underlined part of the sentence opens its choices under it. Lists hold everything, the rarest too, and
 * can run from the most to the least mentioned, alphabetically, by how a word rose or fell from the Classical to the
 * Roman age, or by how typical it is of the chosen works. A second place can be compared side by side. Choosing a row
 * opens the item: beside the list on a computer, as a sheet over it on a phone.
 *
 * URL: ?c=<list>&a=&w=&f=&p= (where) &o=<order>&h=<how often>&u=1 (one author only)&q=<search>
 *      &cmp=1&ba=&bw=&bf=&bp= (compared) &i=<item>
 */
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  categories, EMPTY_SCOPE, fmtRate, groupInfo, groupOf, isName, lemmaKey, loadCensusMeta,
  rate, scopeFrom, scopeParams, type Category, type CensusMeta, type Scope,
} from "@/lib/census";
import {
  BANDS, groupCounts, loadMeanings, loadPeriodCounts, loadPhrases, loadRegister, ORDERS, periodWords,
  type Order, type Register,
} from "@/lib/census-register";
import { loadPlaces, type Place } from "@/lib/map";
import { loadWorksMeta } from "@/lib/works-meta";
import { transliterate } from "@/lib/translit";
import { prefersReducedMotion, useSettings, scrollBehavior } from "@/lib/settings";
import Icon from "@/components/Icon";
import ItemPanel, { worksInScope } from "./ItemPanel";
import Facts from "./Facts";
import Analyses from "./Analyses";
import Duels from "./Duels";
import Catchphrases from "./Catchphrases";
import Method from "./Method";
import Finder, { listLabel } from "./Finder";
import { phraseList, wordList, type ListOutput } from "./rows";
import { fmt, useLoad, type Links, type Shown } from "./shared";
import { useSwipeNav } from "@/lib/use-swipe-nav";
import styles from "./Census.module.css";

export default function Census({ links }: { links: Links }) {
  const meta = useLoad("meta", loadCensusMeta);
  const reg = useLoad("reg", loadRegister);
  if (meta.state === "error" || reg.state === "error" || (meta.state === "done" && !meta.value) || (reg.state === "done" && !reg.value)) {
    return <p className={`wrap ${styles.status}`}>The Census&apos;s counts could not be loaded. Check the connection light at the top of the page, then reload.</p>;
  }
  if (meta.state === "loading" || reg.state === "loading") return <div className={`wrap ${styles.status}`} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> Counting…</div>;
  return <CensusView meta={meta.value!} reg={reg.value!} links={links} />;
}

/** Old links and the author pages say c=word; the list is "words". */
const ALIAS: Record<string, string> = { word: "words" };

export interface ListState { c: string; scope: Scope; order: Order; band: string | null; onlyOne: boolean; query: string }

function CensusView({ meta, reg, links }: { meta: CensusMeta; reg: Register; links: Links }) {
  const router = useRouter();
  const params = useSearchParams();
  const cats = useMemo(() => categories(meta), [meta]);
  const cParam = params.get("c");
  const c = (cParam && (ALIAS[cParam] ?? cParam)) || "god";
  const cat: Category = useMemo(() => cats.find((x) => x.id === c) ?? extraCategory(c) ?? cats.find((x) => x.id === "god")!, [cats, c]);
  const scope = scopeFrom((k) => params.get(k));
  const scopeB = scopeFrom((k) => params.get(k), "b");
  const comparing = params.get("cmp") === "1";
  const item = params.get("i");
  const orderParam = params.get("o") as Order | null;
  const groupA = groupOf(scope);
  const order: Order = ORDERS.some((o) => o.id === orderParam) && !(orderParam === "marked" && groupA === "all") && !(cat.id === "phrase" && (orderParam === "rising" || orderParam === "falling" || orderParam === "marked")) ? orderParam! : "most";
  const band = BANDS.some((b) => b.id === params.get("h")) ? params.get("h") : null;
  const onlyOne = params.get("u") === "1";
  const query = params.get("q") ?? "";
  const state: ListState = { c: cat.id, scope, order, band, onlyOne, query };

  const go = useCallback((changes: [string, string | null][]) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of changes) { if (v === null || v === "") sp.delete(k); else sp.set(k, v); }
    router.replace(`?${sp.toString()}`, { scroll: false });
  }, [params, router]);

  const groupB = groupOf(scopeB);
  const phrase = cat.id === "phrase";
  const names = isName(cat.id) || cat.id === "names";
  const countsA = useLoad(`gc|${groupA}`, () => groupCounts(groupA), !phrase);
  const countsB = useLoad(`gc|${groupB}`, () => groupCounts(groupB), comparing && !phrase);
  const pe = useLoad("reg-pe", loadPeriodCounts, !phrase);
  const meanings = useLoad("gl", loadMeanings, !phrase && (!names || /[a-z]/i.test(query)));
  const phr = useLoad("phr", loadPhrases, phrase);
  const needWm = phrase && ([scope, scopeB].some((s) => !s.a && (s.f !== null || s.p !== null)));
  const wm = useLoad("worksmeta", loadWorksMeta, needWm);
  const places = useLoad("places", () => loadPlaces().then((d) => {
    const m = new Map<string, Place>();
    for (const p of d.places) for (const n of [p.grc, ...(p.also ?? [])]) if (!m.has(n)) m.set(n, p);
    return m;
  }), cat.id === "place" || cat.id === "names");

  const pw = useMemo(() => periodWords(meta, reg), [meta, reg]);
  const infoA = groupInfo(meta, groupA);
  const infoB = groupInfo(meta, groupB);

  const list = (s: Scope, counts: typeof countsA, words: number, o: Order): ListOutput | null => {
    if (phrase) {
      if (phr.state !== "done" || !phr.value) return null;
      const g = groupOf(s);
      let works: Set<string> | null = null;
      if (g !== "all") {
        if (s.w || s.a) works = new Set(meta.authors.find((a) => a[0] === s.a)?.[3].map(([w]) => w).filter((w) => !s.w || w === s.w) ?? []);
        else if (wm.state === "done") works = worksInScope(meta, wm.value, s);
        else return null;
      }
      return phraseList(phr.value, works, { order: o, band, onlyOne, query });
    }
    if (counts.state !== "done") return null;
    return wordList({
      reg, c: cat.id, counts: counts.value, scopeWords: words, allWords: meta.words, periodWords: pw,
      pe: pe.state === "done" ? pe.value : null, order: o, band, onlyOne, query,
      meanings: meanings.state === "done" ? meanings.value : null, isName: names,
      placeName: places.state === "done" ? (g) => places.value.get(g)?.en : undefined,
    });
  };
  const outA = useMemo(() => list(scope, countsA, infoA.words, order),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cat.id, groupA, countsA, order, band, onlyOne, query, pe, meanings, phr, wm, places]);
  const orderB: Order = order === "marked" && groupB === "all" ? "most" : order;
  const outB = useMemo(() => (comparing ? list(scopeB, countsB, infoB.words, orderB) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comparing, cat.id, groupB, countsB, orderB, band, onlyOne, query, pe, meanings, phr, wm, places]);
  const waitingForTrend = (order === "rising" || order === "falling") && pe.state !== "done";

  const rowsA = outA && !waitingForTrend ? outA.rows : null;
  const rowsB = outB && !waitingForTrend ? outB.rows : null;
  const picked: Shown | null = item ? (rowsA?.find((r) => r.text === item) ?? rowsB?.find((r) => r.text === item) ?? {
    key: phrase ? item : lemmaKey(item), text: item, n: 0, auto: false, sub: names || phrase ? transliterate(item) : null,
    id: phrase ? undefined : reg.w.indexOf(item),
  }) : null;

  // the same item in both columns is joined by a thread
  const [regA] = useState(() => new Map<string, HTMLElement>());
  const [regB] = useState(() => new Map<string, HTMLElement>());

  const pick = (r: Shown) => go([["i", r.text === item ? null : r.text]]);
  // phones: a sideways swipe on the list moves to the next or previous list on this shelf (gods, people, places…)
  const swipe = useSwipeNav((d) => {
    if (cat.shelf === "phrases") return;
    const row = cats.filter((x) => x.shelf === cat.shelf), i = row.findIndex((x) => x.id === cat.id) + d;
    if (i >= 0 && i < row.length) go([["c", row[i].id], ["i", null]]);
  });

  // a jump from further down the page (a finding, a chart) up to the list leaves a way back to where it was
  const listRef = useRef<HTMLDivElement>(null);
  const [back, setBack] = useState<{ y: number; label: string } | null>(null);
  const jumpToList = (changes: [string, string | null][], label: string) => {
    setBack({ y: window.scrollY, label });
    go(changes);
    requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" }));
  };
  useEffect(() => {
    if (!back) return;
    const t = setTimeout(() => setBack(null), 60000);
    return () => clearTimeout(t);
  }, [back]);

  const narrow = useNarrow();
  const panel = picked && (
    <ItemPanel key={`${cat.id}|${picked.text}`} meta={meta} reg={reg} cat={cat} item={picked}
      listed={rowsA?.find((r) => r.text === picked.text)?.n ?? null} scope={scope} links={links} onClose={() => go([["i", null]])} />
  );

  return (
    <div className={`wrap ${styles.census}`}>
      <Finder meta={meta} reg={reg} cats={cats} state={state} comparing={comparing} scopeB={scopeB} go={go} out={outA} />

      <div ref={listRef} className={`${styles.layout} ${comparing ? styles.comparing : ""}`} data-picked={picked ? "" : undefined} {...swipe}>
        <div className={styles.columns}>
          <Ranking side="a" cat={cat} state={state} label={infoA.label} words={infoA.words} out={outA} rows={rowsA}
            failed={countsA.state === "error" || phr.state === "error"} selected={picked?.key ?? null} onPick={pick} register={regA} comparing={comparing}
            onBand={(h) => go([["h", h], ["i", null]])} />
          {comparing && <Threads a={regA} b={regB} selected={picked?.key ?? null} deps={`${cat.id}|${groupA}|${groupB}|${rowsA?.length}|${rowsB?.length}|${order}`} />}
          {comparing && <Ranking side="b" cat={cat} state={{ ...state, order: orderB }} label={infoB.label} words={infoB.words} out={outB} rows={rowsB}
            failed={countsB.state === "error"} selected={picked?.key ?? null} onPick={pick} register={regB} comparing={comparing}
            onBand={(h) => go([["h", h], ["i", null]])} />}
        </div>
        {!narrow && (
          <aside className={styles.side} aria-live="polite">
            {panel ?? <PanelHint cat={cat} />}
          </aside>
        )}
      </div>
      {narrow && <Sheet open={!!picked} onClose={() => go([["i", null]])} label={picked ? `${picked.text}: ${cat.label}` : ""}>{panel}</Sheet>}

      <Facts meta={meta} reg={reg} cats={cats} onOpen={(changes, label) => jumpToList(changes, label)} />
      <Duels meta={meta} reg={reg} />
      <Catchphrases meta={meta} onOpen={(changes, label) => jumpToList(changes, label)} />
      <Analyses meta={meta} reg={reg} scope={scope} counts={countsA.state === "done" ? countsA.value : undefined}
        onScope={(s, label) => jumpToList([...scopeParams(s), ["i", null], ["o", s === EMPTY_SCOPE ? null : params.get("o")]], label)}
        onBand={(h, label) => jumpToList([["h", h], ["c", "words"], ["i", null]], label)} />
      <Method meta={meta} />

      {back && (
        <button type="button" className={styles.backChip} onClick={() => { window.scrollTo({ top: back.y, behavior: scrollBehavior() }); setBack(null); }}>
          <Icon name="chevron-down" /> Back to {back.label}
        </button>
      )}
    </div>
  );
}

/** Lists that are not in categories(): all names, all things, and the parts of speech the register adds. */
function extraCategory(c: string): Category | null {
  const l = listLabel(c);
  if (!l) return null;
  const shelf = c === "names" ? "names" : c === "things" ? "things" : "words";
  return { id: c, label: l.label, one: l.one, shelf, blurb: l.blurb };
}

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = matchMedia("(max-width: 1080px)");
    const on = () => setNarrow(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return narrow;
}

// ------------------------------------------------------------ the item as a sheet over the list (phones, narrow screens)
function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { opener.current = document.activeElement as HTMLElement | null; d.showModal(); d.scrollTop = 0; }
    if (!open && d.open) { d.close(); opener.current?.focus?.(); }
  }, [open]);
  return (
    <dialog ref={ref} className={styles.sheet} aria-label={label} onClose={() => open && onClose()}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className={styles.sheetBar}>
        <button type="button" className="btn small ghost" onClick={onClose}><Icon name="back" /> Back to the list</button>
      </div>
      {children}
    </dialog>
  );
}

// ------------------------------------------------------------ the tally in the page's header
/**
 * The four big numbers, placed by the page in its header (app/stoa/census/page.tsx), where they fill the empty left column
 * beside the sculpture. They load the same counts as the rest of the page, which are fetched once.
 */
export function CensusTally() {
  const meta = useLoad("meta", loadCensusMeta);
  return <Tally meta={meta.state === "done" ? meta.value ?? null : null} />;
}

/** Until the counts arrive the four figures stand as dots, so the head is its full height from the first paint and nothing
 *  under it moves when they come (scripts/check-heads.mjs). */
function Tally({ meta }: { meta: CensusMeta | null }) {
  const names = meta ? ["person", "god", "place", "people"].reduce((s, k) => s + (meta.sizes[k] ?? 0), 0) : null;
  const figures: [number | null, string][] = [[meta?.words ?? null, "words read"], [meta?.sizes.words ?? null, "different words"], [names, "names sorted"], [meta ? meta.sizes.phrase ?? 0 : null, "repeated phrases"]];
  return (
    <dl className={styles.tally}>
      {figures.map(([n, label], i) => (
        <div key={label} style={{ "--i": i } as React.CSSProperties}>
          <dt>{label}</dt>
          <dd>{n === null ? "·" : fmt(n)}</dd>
        </div>
      ))}
    </dl>
  );
}

// ------------------------------------------------------------ a ranking
const PAGE = 50;

function Ranking({ side, cat, state, label, words, out, rows, failed, selected, onPick, register, comparing, onBand }: {
  side: "a" | "b"; cat: Category; state: ListState; label: string; words: number; out: ListOutput | null; rows: Shown[] | null; failed: boolean;
  selected: string | null; onPick: (r: Shown) => void; register: Map<string, HTMLElement>; comparing: boolean; onBand: (h: string | null) => void;
}) {
  const [shown, setShown] = useState(PAGE);
  const sig = `${cat.id}|${groupOf(state.scope)}|${state.order}|${state.band}|${state.onlyOne}|${state.query}`;
  const [lastSig, setLastSig] = useState(sig);
  if (sig !== lastSig) { setLastSig(sig); setShown(PAGE); }
  const motion = useSettings((s) => s.motion);
  const listRef = useRef<HTMLOListElement>(null);
  const prev = useRef(new Map<string, number>());
  const visible = rows ? rows.slice(0, shown) : [];
  const max = rows && rows.length ? Math.max(...rows.slice(0, Math.max(shown, 1)).map((r) => r.n)) : 1;
  const signature = visible.map((r) => `${r.key}:${r.n}`).join("|");
  const sparkMax = (r: Shown) => Math.max(...(r.rates ?? [0]));

  // a row that is new, or has a new rank, inks in where it now stands (nothing slides); the rest stay still
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const top = list.getBoundingClientRect().top;
    const now = new Map<string, number>();
    const reduce = prefersReducedMotion(motion);
    let fresh = 0;
    for (const [k, el] of register) {
      if (!list.contains(el)) { register.delete(k); continue; }
      const y = el.getBoundingClientRect().top - top;
      now.set(k, y);
      if (reduce || fresh > 30) continue;
      const was = prev.current.get(k);
      if (was === undefined || Math.abs(was - y) > 1) {
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: Math.min(fresh++ * 18, 360), easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", fill: "backwards" });
      }
    }
    prev.current = now;
  }, [signature, register, motion]);

  // more rows come only when asked for: rows that load by themselves would push everything below the list away
  const total = rows?.length ?? 0;

  const orderShort = ORDERS.find((o) => o.id === state.order)!.short.toLowerCase();
  const head = (
    <header className={styles.rankHead}>
      <p className="label">{cat.label} · {comparing ? (side === "a" ? "left" : "right") : orderShort}</p>
      <h2>{label}</h2>
      <p className={styles.rankSub}>
        {rows ? <><b>{fmt(total)}</b> {total === 1 ? cat.one : plural(cat)}{out && total !== out.inList && <> of {fmt(out.inList)}</>}</> : "…"}
        {" "}· {fmt(words)} words read{comparing && <> · small figures per 10,000 words</>}
      </p>
      {out && !comparing && <Bands out={out} band={state.band} onBand={onBand} one={cat.one} />}
    </header>
  );
  if (failed) return <section className={styles.rank}>{head}<p className={styles.warn}>This list could not be loaded. Check the connection, then try again.</p></section>;
  if (!rows) return <section className={styles.rank} aria-busy="true">{head}<p className="muted"><span className={styles.spinner} aria-hidden="true" /> Counting…</p></section>;
  const trendy = state.order === "rising" || state.order === "falling" || state.order === "marked";
  return (
    <section className={styles.rank} aria-label={`${cat.label} in ${label}`}>
      {head}
      {rows.length === 0 ? <p className={styles.empty}>{state.query ? <>Nothing here matches “{state.query}”.</> : <>No {cat.label.toLowerCase()} are counted here{state.band ? " at this frequency" : ""}.</>}</p> : (
        <ol ref={listRef} className={styles.rows}>
          {visible.map((r, i) => (
            <li key={r.key} ref={(el) => { if (el) register.set(r.key, el); }} data-key={r.key}>
              <button type="button" className={styles.row} aria-pressed={selected === r.key} onClick={() => onPick(r)}
                title={r.auto ? "Sorted automatically from GLAUx's tags, not checked by hand" : undefined}>
                <span className={styles.rankN}>{i + 1}</span>
                <span className={styles.word}>
                  <b lang="grc">{r.text}{r.auto && <span className={styles.auto} aria-label="(sorted automatically)">°</span>}</b>
                  {r.sub && <small>{r.sub}</small>}
                </span>
                {!comparing && <Spark rates={r.rates} max={sparkMax(r)} />}
                <span className={styles.barCell}>
                  <span className={styles.bar} style={{ "--w": `${Math.max(0.6, (r.n / max) * 100)}%` } as React.CSSProperties} />
                  <span className={styles.count}>
                    {trendy && r.note ? <>{r.note}<small>{fmt(r.n)} uses</small></> : <>{fmt(r.n)}{comparing && <small>{fmtRate(rate(r.n, words))}/10k</small>}</>}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
      {total > shown && (
        <button type="button" className={`chip ${styles.more}`} onClick={() => setShown(Math.min(total, shown + PAGE * 4))}>
          Show more ({fmt(shown)} of {fmt(total)} shown)
        </button>
      )}
    </section>
  );
}
const plural = (cat: Category) => cat.label.toLowerCase().replace(/^all /, "");

/** The little line of a word's use over the five periods, each point its rate per 10,000 words there. */
function Spark({ rates, max }: { rates?: number[]; max: number }) {
  if (!rates || !max) return <span className={styles.spark} aria-hidden="true" />;
  const pts = rates.map((r, i) => `${(i * 100) / (rates.length - 1)},${(28 - (r / max) * 24).toFixed(1)}`).join(" ");
  return (
    <svg className={styles.spark} viewBox="-4 0 108 32" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} />
      {rates.map((r, i) => <circle key={i} cx={(i * 100) / (rates.length - 1)} cy={28 - (r / max) * 24} r="2.4" data-zero={r === 0 ? "" : undefined} />)}
    </svg>
  );
}

/** How often: how many items are used once, 2–9 times… here; each band a tab that keeps only those. */
function Bands({ out, band, onBand, one }: { out: ListOutput; band: string | null; onBand: (h: string | null) => void; one: string }) {
  const max = Math.max(1, ...out.bands);
  return (
    <div className={styles.bands} role="group" aria-label="How often">
      {BANDS.map((b, i) => (
        <button key={b.id} type="button" aria-pressed={band === b.id} disabled={!out.bands[i] && band !== b.id}
          onClick={() => onBand(band === b.id ? null : b.id)}
          aria-label={`${b.label === "Once" ? "Used once" : `Used ${b.label} times`}: ${fmt(out.bands[i])} ${out.bands[i] === 1 ? one : "items"}`}>
          <span className={styles.bandBar}><i style={{ "--h": `${Math.max(out.bands[i] ? 6 : 0, (Math.sqrt(out.bands[i]) / Math.sqrt(max)) * 100)}%` } as React.CSSProperties} /></span>
          <b>{fmt(out.bands[i])}</b>
          <small>{b.label === "Once" ? "once" : `${b.label}×`}</small>
        </button>
      ))}
    </div>
  );
}

// ------------------------------------------------------------ threads between the two columns
function Threads({ a, b, selected, deps }: { a: Map<string, HTMLElement>; b: Map<string, HTMLElement>; selected: string | null; deps: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<{ key: string; d: string }[]>([]);
  const [h, setH] = useState(0);
  useEffect(() => {
    const draw = () => {
      const svg = ref.current;
      if (!svg) return;
      const box = svg.getBoundingClientRect();
      const out: { key: string; d: string }[] = [];
      for (const [k, ea] of a) {
        const eb = b.get(k);
        if (!eb || !ea.isConnected || !eb.isConnected) continue;
        const ra = ea.getBoundingClientRect(), rb = eb.getBoundingClientRect();
        const ya = ra.top + ra.height / 2 - box.top, yb = rb.top + rb.height / 2 - box.top;
        const w = box.width;
        out.push({ key: k, d: `M0 ${ya.toFixed(1)} C${(w / 2).toFixed(1)} ${ya.toFixed(1)} ${(w / 2).toFixed(1)} ${yb.toFixed(1)} ${w} ${yb.toFixed(1)}` });
      }
      setH(box.height);
      setPaths(out);
    };
    const t = requestAnimationFrame(draw);
    draw();
    const ro = new ResizeObserver(draw);
    if (ref.current?.parentElement) ro.observe(ref.current.parentElement);
    return () => { cancelAnimationFrame(t); ro.disconnect(); };
  }, [a, b, deps]);
  return (
    <svg ref={ref} className={styles.threads} aria-hidden="true" preserveAspectRatio="none" viewBox={`0 0 48 ${Math.max(1, h)}`}>
      {paths.map((p) => <path key={p.key} d={p.d} data-on={p.key === selected ? "" : undefined} pathLength={1} />)}
    </svg>
  );
}

function PanelHint({ cat }: { cat: Category }) {
  return (
    <div className={styles.hint}>
      <p className="label">Pick a {cat.one}</p>
      <p>Choose any row to see how its use changes over the periods, in which kinds of writing it lives, who mentions it most, and where it clusters in a work, with links to read every mention.</p>
      <p className={styles.fine}>The little line in each row is its use in the five periods, from the Archaic age (left) to Late Antiquity (right), for the size of each.</p>
      {(isName(cat.id) || cat.shelf === "things" || cat.id === "names") && <p className={styles.fine}><span className={styles.auto}>°</span> marks a {cat.shelf === "things" ? "word" : "name"} sorted automatically from GLAUx&apos;s tags and not checked by hand.</p>}
    </div>
  );
}
