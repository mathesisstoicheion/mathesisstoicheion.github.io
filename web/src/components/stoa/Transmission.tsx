/**
 * The Painted Stoa's "Manuscripts & transmission" and "Textual variants" pages: each checked author article's account
 * of how the words reached us, or of where the copies disagree, gathered on one page (owner's decision 2026-10-09).
 * Nothing here is written anew: the excerpts are the opening of each article's own section, and the chart re-draws the
 * marks of each article's timeline; every claim rests on that article's numbered sources, one click away. An author
 * joins these pages when their article is checked and added to ARTICLES.
 */
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ARTICLES } from "@/wiki/author-articles-all";
import { PIN_KINDS, type AuthorArticle, type PinKind } from "@/wiki/author-articles";
import { blocks, plain } from "@/wiki/markup";
import type { Catalog } from "@/lib/catalog";
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

/** The opening of a section, as plain text: its first paragraph, cut at a sentence near 330 characters. */
function opening(src: string): string {
  const p = blocks(src).find((b) => "p" in b);
  const t = p && "p" in p ? plain(p.p).replace(/\*+/g, "").replace(/\s+/g, " ").trim() : "";
  if (t.length <= 360) return t;
  const cut = t.slice(0, 360);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  return (end > 160 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, "")) + " …";
}

// ---------------------------------------------------------------- the roads of the texts
// One row per author, the name beside its own track, so the two cannot drift apart; each mark is placed by its year,
// as a share of the span from 800 BC to today (HTML shapes, so they keep their shape at any width).
const X0 = -800, X1 = 2030;
const pct = (y: number) => (((Math.min(Math.max(y, X0), X1) - X0) / (X1 - X0)) * 100);
const TICKS = [-800, -400, 1, 400, 800, 1200, 1600, 2000];
const tickLabel = (t: number) => (t === 1 ? "AD 1" : t < 0 ? `${-t} BC` : String(t));

function Roads() {
  return (
    <figure className={styles.roads} aria-label={`The timelines of ${ALL.length} author articles side by side, from ${yearLabel(X0)} to the present`}>
      <div className={styles.chart}>
        <div className={styles.axis} aria-hidden="true">
          <span />
          <span className={styles.axisTrack}>{TICKS.map((t) => <span key={t} style={{ left: `${pct(t)}%` }}>{tickLabel(t)}</span>)}</span>
        </div>
        <ol className={styles.rows}>
          {ALL.map((a, i) => {
            const ys = a.timeline.map((p) => p.year);
            return (
              <li key={a.id} style={{ "--i": i } as React.CSSProperties}>
                <span className={styles.who}>{NAME.get(a.id) ?? a.id}</span>
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
      </div>
      <figcaption>
        <ul className={styles.legend}>
          {(Object.keys(PIN_KINDS) as PinKind[]).map((k) => (
            <li key={k}><i className={`${styles.mark} ${styles.key} ${styles[k]}`} aria-hidden="true" /><b>{PIN_KINDS[k].label}</b> <span>{PIN_KINDS[k].about}</span></li>
          ))}
        </ul>
        <p>The marks of each author article&apos;s own timeline, drawn on one scale. Look for the gaps: between an author&apos;s own time and the copies of their words, and between the last copies made by hand and the first printed books. Point at a mark for its year; the article tells what happened.</p>
      </figcaption>
    </figure>
  );
}

export default function Transmission({ part }: { part: "transmission" | "variants" }) {
  const title = part === "transmission" ? "How the words reached us" : "Where the copies disagree";
  return (
    <div className={`wrap ${styles.page}`}>
      {part === "transmission" && <Roads />}
      <section aria-labelledby="tr-list">
        <h2 id="tr-list" className="label">{ALL.length} authors, in time order</h2>
        <ol className={styles.list}>
          {ALL.map((a, i) => (
            <li key={a.id} className="rv" style={{ "--i": i } as React.CSSProperties}>
              <Link href={`/author/${a.id}#survive-title`} transitionTypes={["page-turn"]} className={styles.card}>
                <span className={styles.when}>{century(firstYear(a))}</span>
                <b>{NAME.get(a.id) ?? a.id}</b>
                <span className={styles.text}>{opening(a[part])}</span>
                <span className={styles.go}>{title}: the whole account, with its sources <span aria-hidden="true">→</span></span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <p className={styles.more}>
        These come from the author articles, each checked claim by claim against the sources listed with it.
        More authors join as their articles are checked.
      </p>
    </div>
  );
}
