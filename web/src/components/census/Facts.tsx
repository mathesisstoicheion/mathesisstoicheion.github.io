"use client";
/**
 * "Did you know?": findings worked out live from the Census's own counts when the page opens, so the words and the
 * numbers can never drift apart. Each card opens a window of findings that turns sideways like pages (swipe, the arrows
 * or the arrow keys), with dots below for where you are, and a close button; nothing moves the page behind it. Each
 * finding shows its own little chart, and can open its full list.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { EMPTY_SCOPE, groupInfo, groupOf, loadGroup, scopeParams, type Category, type CensusMeta, type Scope } from "@/lib/census";
import { BANDS, loadAuthorStats, loadPeriodCounts, trend, periodWords, type Register } from "@/lib/census-register";
import { transliterate } from "@/lib/translit";
import Icon from "@/components/Icon";
import { coverage, fmtRatio } from "./rows";
import { fmt } from "./shared";
import styles from "./Census.module.css";

type Changes = [string, string | null][];
interface Bar { label: string; sub?: string; n: number; text?: string; greek?: boolean }
interface Fact { kicker: string; head: React.ReactNode; more: React.ReactNode; bars: Bar[]; unit: string; open: Changes; openLabel: string }

/** Which ranking each "most mentioned" finding reads. */
const ASK: { c: string; scope: Scope }[] = [
  { c: "god", scope: { ...EMPTY_SCOPE, a: "tlg0012", w: "tlg0012.tlg001" } },      // the Iliad
  { c: "place", scope: { ...EMPTY_SCOPE, a: "tlg0016" } },                          // Herodotus
  { c: "phrase", scope: { ...EMPTY_SCOPE, f: 5 } },                                 // oratory
  { c: "obj:animals", scope: { ...EMPTY_SCOPE, a: "tlg0012", w: "tlg0012.tlg002" } }, // the Odyssey
  { c: "person", scope: { ...EMPTY_SCOPE, f: 4 } },                                 // philosophy
  { c: "obj:food", scope: { ...EMPTY_SCOPE, f: 7 } },                               // medicine
];
const pct = (x: number) => `${(x * 100).toFixed(x < 0.1 ? 1 : 0)}%`;

export default function Facts({ meta, reg, cats, onOpen }: { meta: CensusMeta; reg: Register; cats: Category[]; onOpen: (changes: Changes, label: string) => void }) {
  const [tops, setTops] = useState<(Fact | null)[] | null>(null);
  const [extra, setExtra] = useState<Fact[] | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all(ASK.map(async ({ c, scope }): Promise<Fact | null> => {
      const g = groupOf(scope);
      const rows = (await loadGroup(g).catch(() => null))?.[c];
      const cat = cats.find((x) => x.id === c);
      if (!rows?.length || !cat) return null;
      const where = groupInfo(meta, g).label;
      const [first, second] = rows;
      return {
        kicker: where, unit: "mentions",
        head: <>The most mentioned {cat.one} is <b lang="grc">{first[0]}</b></>,
        more: <><i>({transliterate(first[0])})</i>, {fmt(first[1])} times{second && <>, ahead of <span lang="grc">{second[0]}</span> with {fmt(second[1])}</>}.</>,
        bars: rows.slice(0, 6).map(([t, n]) => ({ label: t, sub: transliterate(t), n, greek: true })),
        open: [["c", c], ...scopeParams(scope), ["o", null], ["h", null], ["u", null], ["q", null]], openLabel: "Did you know",
      };
    })).then((fs) => { if (live) setTops(fs); });
    return () => { live = false; };
  }, [meta, cats]);

  useEffect(() => {
    let live = true;
    Promise.all([loadPeriodCounts().catch(() => null), loadAuthorStats().catch(() => null)]).then(([pe, au]) => {
      if (!live) return;
      const out: Fact[] = [];
      const all: Changes = [...scopeParams(EMPTY_SCOPE), ["o", null], ["h", null], ["u", null], ["q", null]];
      // words used once
      const once = reg.n.filter((n) => n === 1).length;
      const bands = BANDS.map((b) => reg.n.filter((n) => n >= b.lo && n <= b.hi).length);
      out.push({
        kicker: "The whole library", unit: "different words",
        head: <><b className={styles.num}>{fmt(once)}</b> words appear only once</>,
        more: <>That is {pct(once / reg.n.length)} of the {fmt(reg.n.length)} different dictionary words in {fmt(meta.words)} words of Greek. Scholars call them <i>hapax legomena</i>, “said once”.</>,
        bars: BANDS.map((b, i) => ({ label: b.id === "1" ? "Once" : `${b.label} times`, n: bands[i] })),
        open: [["c", "words"], ...all, ["h", "1"], ["o", "az"]], openLabel: "Did you know",
      });
      // how much of a page the commonest words make up
      const cov = coverage(reg.n, [10, 100, 1000, 5000]);
      out.push({
        kicker: "For readers", unit: "of all the words read",
        head: <>The <b className={styles.num}>100</b> commonest words make up <b className={styles.num}>{pct(cov[1].share)}</b> of everything read</>,
        more: <>The 10 commonest alone are {pct(cov[0].share)}; the commonest 1,000 are {pct(cov[2].share)}. Learn those and most of every page is already known.</>,
        bars: cov.map(({ k, share }) => ({ label: `The ${fmt(k)} commonest`, n: Math.round(share * 1000) / 10, text: pct(share) })),
        open: [["c", "words"], ...all], openLabel: "Did you know",
      });
      // rising and falling nouns
      if (pe) {
        const pw = periodWords(meta, reg);
        const nouns = reg.w.map((_, i) => i).filter((i) => reg.kinds[reg.k[i]] === "noun");
        const scored = nouns.map((i) => [i, trend(pe, i, pw)] as [number, number | null]).filter((x): x is [number, number] => x[1] !== null);
        const up = [...scored].sort((a, b) => b[1] - a[1]).slice(0, 6);
        const down = [...scored].sort((a, b) => a[1] - b[1]).slice(0, 6);
        out.push({
          kicker: "Rising · Classical to Roman age", unit: "times as often",
          head: <>The noun that rose most is <b lang="grc">{reg.w[up[0][0]]}</b></>,
          more: <><i>({transliterate(reg.w[up[0][0]])})</i>: for the size of each age, it is used {fmtRatio(up[0][1])} times as often in the Roman age (1st–3rd c. AD) as in the Classical (5th–4th c. BC).</>,
          bars: up.map(([i, t]) => ({ label: reg.w[i], sub: transliterate(reg.w[i]), n: t, text: `×${fmtRatio(t)}`, greek: true })),
          open: [["c", "noun"], ...all, ["o", "rising"]], openLabel: "Did you know",
        });
        out.push({
          kicker: "Falling · Classical to Roman age", unit: "times less often",
          head: <>The noun that fell most is <b lang="grc">{reg.w[down[0][0]]}</b></>,
          more: <><i>({transliterate(reg.w[down[0][0]])})</i>: used {fmtRatio(1 / down[0][1])} times less often, for the size of each age, in the Roman age than in the Classical.</>,
          bars: down.map(([i, t]) => ({ label: reg.w[i], sub: transliterate(reg.w[i]), n: 1 / t, text: `÷${fmtRatio(1 / t)}`, greek: true })),
          open: [["c", "noun"], ...all, ["o", "falling"]], openLabel: "Did you know",
        });
      }
      if (au) {
        const name = (id: string) => meta.authors.find((a) => a[0] === id)?.[1] ?? id;
        const rich = au.rows.filter((r) => r[5] !== null && r[6] >= 20).sort((a, b) => b[5]! - a[5]!);
        if (rich.length) out.push({
          kicker: "The richest vocabulary", unit: `different words in every ${fmt(au.window)}`,
          head: <><b className={styles.plain}>{name(rich[0][0])}</b> uses the most different words</>,
          more: <>On average {rich[0][5]} different dictionary words in every stretch of {fmt(au.window)} words (authors with at least {fmt(20 * au.window)} words). The library&apos;s plainest by this measure is {name(rich[rich.length - 1][0])}, with {rich[rich.length - 1][5]}.</>,
          bars: rich.slice(0, 6).map((r) => ({ label: name(r[0]), n: r[5]!, text: String(r[5]) })),
          open: [["c", "words"], ["a", rich[0][0]], ["w", null], ["f", null], ["p", null], ["o", "marked"], ["h", null], ["u", null], ["q", null]], openLabel: "Did you know",
        });
        const only = [...au.rows].sort((a, b) => b[3] - a[3]);
        const lone = reg.na.filter((n) => n === 1).length;
        out.push({
          kicker: "Words of one author", unit: "words no one else uses",
          head: <><b className={styles.num}>{fmt(lone)}</b> words are used by one author only</>,
          more: <>{name(only[0][0])} has the most of them: {fmt(only[0][3])} words that no other author in the library uses.</>,
          bars: only.slice(0, 6).map((r) => ({ label: name(r[0]), n: r[3] })),
          open: [["c", "words"], ["a", only[0][0]], ["w", null], ["f", null], ["p", null], ["u", "1"], ["o", null], ["h", null], ["q", null]], openLabel: "Did you know",
        });
      }
      setExtra(out);
    });
    return () => { live = false; };
  }, [meta, reg]);

  const facts = useMemo(() => {
    if (!tops && !extra) return null;
    const t = (tops ?? []).filter((f): f is Fact => !!f), e = extra ?? [];
    // the new findings interleaved with the "most mentioned" ones
    const out: Fact[] = [];
    for (let i = 0; i < Math.max(t.length, e.length); i++) { if (e[i]) out.push(e[i]); if (t[i]) out.push(t[i]); }
    return out;
  }, [tops, extra]);
  const [at, setAt] = useState<number | null>(null);
  if (!facts?.length) return null;
  return (
    <section className={styles.facts} aria-labelledby="facts-h">
      <h2 id="facts-h">Did you know?</h2>
      <p className={styles.blurb}>Worked out from the counts as the page opens. Open one to page through them all.</p>
      <ul>
        {facts.map((f, i) => (
          <li key={i} style={{ "--i": i } as React.CSSProperties}>
            <button type="button" onClick={() => setAt(i)} aria-haspopup="dialog">
              <span className="label">{f.kicker}</span>
              <span className={styles.factText}>{f.head}</span>
              <span className={styles.factGo}>Open <span className="arr">→</span></span>
            </button>
          </li>
        ))}
      </ul>
      <FactWindow facts={facts} at={at} onClose={() => setAt(null)} onOpen={(f) => { setAt(null); onOpen(f.open, f.openLabel); }} />
    </section>
  );
}

// ------------------------------------------------------------ the window of findings
function FactWindow({ facts, at, onClose, onOpen }: { facts: Fact[]; at: number | null; onClose: () => void; onOpen: (f: Fact) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (at !== null && !d.open) {
      opener.current = document.activeElement as HTMLElement | null;
      d.showModal();
      setCur(at);
      // stand on the chosen page at once, without a sweep across the ones before it
      requestAnimationFrame(() => { const t = track.current; if (t) t.scrollTo({ left: at * t.clientWidth, behavior: "instant" as ScrollBehavior }); });
    }
    if (at === null && d.open) { d.close(); opener.current?.focus?.(); }
  }, [at]);
  const goTo = (i: number) => {
    const t = track.current;
    if (!t) return;
    const j = Math.max(0, Math.min(facts.length - 1, i));
    t.scrollTo({ left: j * t.clientWidth, behavior: "smooth" });
  };
  const onScroll = () => {
    const t = track.current;
    if (t) setCur(Math.round(t.scrollLeft / Math.max(1, t.clientWidth)));
  };
  return (
    <dialog ref={ref} className={styles.window} aria-label="Did you know?" onClose={() => at !== null && onClose()}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); goTo(cur + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); goTo(cur - 1); } }}>
      <div className={styles.windowBar}>
        <button type="button" className="btn small ghost" onClick={onClose}><Icon name="back" /> Back</button>
        <p className="label" aria-live="polite">Did you know? · {cur + 1} of {facts.length}</p>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close" title="Close (Esc)"><Icon name="close" /></button>
      </div>
      <div ref={track} className={styles.track} onScroll={onScroll}>
        {facts.map((f, i) => (
          <article key={i} className={styles.slide} aria-roledescription="page" aria-label={`${i + 1} of ${facts.length}`} inert={i !== cur ? true : undefined}>
            <p className="label">{f.kicker}</p>
            <h3 className={styles.slideHead}>{f.head}</h3>
            <p className={styles.slideMore}>{f.more}</p>
            <FactBars bars={f.bars} unit={f.unit} />
            <button type="button" className="btn small" onClick={() => onOpen(f)}>Show the full list <span className="arr">→</span></button>
          </article>
        ))}
      </div>
      <div className={styles.windowFoot}>
        <button type="button" className="icon-btn" onClick={() => goTo(cur - 1)} disabled={cur === 0} aria-label="Previous"><Icon name="chevron-left" /></button>
        <div className={styles.dots} role="tablist" aria-label="Findings">
          {facts.map((_, i) => (
            <button key={i} type="button" role="tab" aria-selected={i === cur} aria-label={`Finding ${i + 1}`} onClick={() => goTo(i)}><i /></button>
          ))}
        </div>
        <button type="button" className="icon-btn" onClick={() => goTo(cur + 1)} disabled={cur === facts.length - 1} aria-label="Next"><Icon name="chevron-right" /></button>
      </div>
    </dialog>
  );
}

function FactBars({ bars, unit }: { bars: Bar[]; unit: string }) {
  const max = Math.max(...bars.map((b) => b.n), 0) || 1;
  return (
    <figure className={styles.factBars}>
      <ol>
        {bars.map((b, i) => (
          <li key={i} style={{ "--i": i } as React.CSSProperties}>
            <span className={styles.fbLabel}>{b.greek ? <b lang="grc">{b.label}</b> : <b>{b.label}</b>}{b.sub && <small>{b.sub}</small>}</span>
            <span className={styles.fbTrack}><span className={styles.fbBar} style={{ "--w": `${Math.max(1, (b.n / max) * 100)}%` } as React.CSSProperties} data-first={i === 0 ? "" : undefined} /></span>
            <span className={styles.fbN}>{b.text ?? fmt(b.n)}</span>
          </li>
        ))}
      </ol>
      <figcaption>{unit}</figcaption>
    </figure>
  );
}
