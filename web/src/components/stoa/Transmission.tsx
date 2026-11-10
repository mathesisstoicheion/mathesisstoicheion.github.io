/**
 * The Painted Stoa's "Manuscripts & transmission" and "Textual variants" pages: each checked author article's account
 * of how the words reached us, or of where the copies disagree, gathered on one page (owner's decision 2026-10-09).
 * Nothing here is written anew: the excerpts are the opening of each article's own section, and the chart re-draws the
 * marks of each article's timeline; every claim rests on that article's numbered sources, one click away. An author
 * joins these pages when their article is checked and added to ARTICLES.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ARTICLES } from "@/wiki/author-articles-all";
import { PIN_KINDS, type AuthorArticle, type PinKind } from "@/wiki/author-articles";
import { blocks, plain } from "@/wiki/markup";
import type { Catalog } from "@/lib/catalog";
import Ledger, { type LedgerItem } from "./Ledger";
import SideScroll from "./SideScroll";
import idx from "./WikiIndex.module.css";
import styles from "./Transmission.module.css";

const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const NAME = new Map(CATALOG.authors.map((a) => [a.id, a.name]));

/** Authors in time order: by the first year of their own writing in the article's timeline. */
const firstYear = (a: AuthorArticle) => Math.min(...a.timeline.filter((p) => p.kind === "writing").map((p) => p.year), 3000);
const ALL = Object.values(ARTICLES).sort((x, y) => firstYear(x) - firstYear(y));

const yearLabel = (y: number) => (y < 0 ? `${-y} BC` : `AD ${y}`);
const century = (y: number) => {
  const c = Math.ceil(Math.abs(y) / 100) || 1;
  const th = c % 10 === 1 && c !== 11 ? "st" : c % 10 === 2 && c !== 12 ? "nd" : c % 10 === 3 && c !== 13 ? "rd" : "th";
  return `${c}${th} century ${y < 0 ? "BC" : "AD"}`;
};

/** The opening of a section, as plain text: its first paragraph, whole. */
function opening(src: string): string {
  const p = blocks(src).find((b) => "p" in b);
  return p && "p" in p ? plain(p.p).replace(/\*+/g, "").replace(/\s+/g, " ").trim() : "";
}
/** The account's opening words up to the first full stop, when they are under 40 characters ("Wild papyri."). */
const lead = (t: string) => { const m = /^[^.]*\./.exec(t); return m && m[0].length < 40 ? m[0] : null; };

// ---------------------------------------------------------------- the roads of the texts
// One row per author, the name beside its own track, so the two cannot drift apart; each mark is placed by its year,
// as a share of the span from 800 BC to today (HTML shapes, so they keep their shape at any width). On a phone the chart
// scrolls sideways under the names, which stay in view (Transmission.module.css).
const X0 = -800, X1 = 2030;
const pct = (y: number) => (((Math.min(Math.max(y, X0), X1) - X0) / (X1 - X0)) * 100);
const TICKS = [-800, -400, 1, 400, 800, 1200, 1600, 2000];
const tickLabel = (t: number) => (t === 1 ? "AD 1" : t < 0 ? `${-t} BC` : String(t));

/** The years along the chart, above its rows and again below them. */
function Axis() {
  return (
    <div className={styles.axis} aria-hidden="true">
      <span className={styles.pin} />
      <span className={styles.axisTrack}>{TICKS.map((t) => <span key={t} style={{ left: `${pct(t)}%` }}>{tickLabel(t)}</span>)}</span>
    </div>
  );
}

function Roads() {
  return (
    <figure className={styles.roads} aria-label={`The timelines of ${ALL.length} author articles side by side, from ${yearLabel(X0)} to the present`}>
      {/* the key and what to look for stand above the chart, at the width of the screen; only the chart scrolls sideways */}
      <figcaption>
        <ul className={styles.legend}>
          {(Object.keys(PIN_KINDS) as PinKind[]).map((k) => (
            <li key={k}><i className={`${styles.mark} ${styles.key} ${styles[k]}`} aria-hidden="true" /><span><b>{PIN_KINDS[k].label}</b> <span className={styles.about}>{PIN_KINDS[k].about}</span></span></li>
          ))}
        </ul>
        <p>The marks of each author article&apos;s own timeline, drawn on one scale. Look for the gaps: between an author&apos;s own time and the copies of their words, and between the last copies made by hand and the first printed books. Point at a mark for its year; choose an author&apos;s name to read the account below; the article tells what happened.</p>
      </figcaption>
      <SideScroll className={styles.scroller} label="The timelines, side by side">
      <div className={styles.chart}>
        <Axis />
        <ol className={styles.rows}>
          {ALL.map((a, i) => {
            const ys = a.timeline.map((p) => p.year);
            return (
              <li key={a.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={`#ledger-${a.id}`} className={`${styles.who} ${styles.pin}`} title={NAME.get(a.id) ?? a.id}>{NAME.get(a.id) ?? a.id}</a>
                <span className={styles.track}>
                  {TICKS.map((t) => <i key={t} className={styles.grid} style={{ left: `${pct(t)}%` }} aria-hidden="true" />)}
                  <i className={styles.road} style={{ left: `${pct(Math.min(...ys))}%`, width: `${pct(Math.max(...ys)) - pct(Math.min(...ys))}%` }} aria-hidden="true" />
                  {a.timeline.map((p, k) => (
                    <i key={k} className={`${styles.mark} ${styles[p.kind]}`} style={{ left: `${pct(p.year)}%`, "--x": (pct(p.year) / 100).toFixed(3) } as React.CSSProperties}
                      title={`${NAME.get(a.id) ?? a.id}, ${p.approx ? "about " : ""}${yearLabel(p.year)}: ${PIN_KINDS[p.kind].label}`} />
                  ))}
                </span>
              </li>
            );
          })}
        </ol>
        <Axis />
      </div>
      </SideScroll>
    </figure>
  );
}

export default function Transmission({ part }: { part: "transmission" | "variants" }) {
  const items: LedgerItem[] = ALL.map((a) => {
    const text = opening(a[part]);
    return { id: a.id, name: NAME.get(a.id) ?? a.id, group: century(firstYear(a)), lead: lead(text), text, href: `/author/${a.id}#survive-title` };
  });
  const note = (
    <section className={idx.made} aria-labelledby="tr-made">
      <h2 id="tr-made" className="label">How this page is made</h2>
      <p>
        These come from the author articles, each checked claim by claim against the sources listed with it.
        More authors join as their articles are checked.
      </p>
    </section>
  );
  return (
    <div className={`wrap ${styles.page}`}>
      {part === "transmission" && <><Roads />{note}</>}
      <section aria-labelledby="tr-list">
        <h2 id="tr-list" className="label">{ALL.length} authors, in time order</h2>
        <Ledger items={items} />
      </section>
      {part === "variants" && note}
    </div>
  );
}
