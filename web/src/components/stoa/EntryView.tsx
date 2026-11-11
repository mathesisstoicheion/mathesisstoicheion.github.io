/**
 * One entry of the Painted Stoa. The head holds the title, its Greek and its one line, then (on a computer, in the same
 * column) the opening paragraph and one quiet line of counts; the entry's own photograph stands at the right at its own
 * shape (on a phone it follows the one line and comes before the opening). Then the body with its quotations and boxes,
 * Share, the Dates, "Read it yourself", related entries and sources. On a computer a side column stays beside the article
 * (sticky): "On this page" with its reading rule, "Read it yourself", the places on the map and the Pnyx. On a phone the side
 * column gives way to a slim bar of the sections (SectionBar) and "Read it yourself" and the map stand at the article's end.
 */
import Link from "next/link";
import { blocks, inline, plain } from "@/wiki/markup";
import { type Entry } from "@/wiki/types";
import { BIB } from "@/wiki/bibliography";
import { entryBySlug, categoryOf } from "@/wiki/index";
import { Blocks, Inline, Timeline, readHref, greekAware } from "./Markup";
import Contents, { SectionBar } from "./Contents";
import { EntryMarkers, SectionNote } from "./EntryNotes";
import ShareEntry from "./ShareEntry";
import mapData from "../../../public/data/map/places.json";
import { ENGLISH_NAMES } from "@/lib/place-names";
import styles from "./Stoa.module.css";
import PageHead from "@/components/PageHead";
import { photo } from "@/lib/photos";
import { FORUM_OPEN, trail } from "@/config/areas";

const PLACE_NAME = new Map((mapData as { places: { id: string; grc: string; en: string }[] }).places.map((p) => [p.id, p]));

export default function EntryView({ e }: { e: Entry }) {
  const body = blocks(e.body);
  const heads = body.flatMap((b) => ("h2" in b ? [{ id: b.id, text: b.h2 }] : []));
  const cat = categoryOf(e.category);
  const related = e.related.map((s) => entryBySlug.get(s)!).filter(Boolean);
  // the counts under the opening, all computed from this entry's own data; reading time is the body's words at 200 a minute
  const words = body.reduce((n, b) => {
    const text = "p" in b ? plain(b.p) : "list" in b ? b.list.map(plain).join(" ") : "dyk" in b ? b.dyk.map(plain).join(" ") : "h3" in b ? b.h3 : "";
    return n + (text.match(/\S+/g)?.length ?? 0);
  }, 0);
  const minutes = Math.max(1, Math.round(words / 200));
  const nDates = e.timeline?.length ?? 0;
  const count = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
  const counts = [
    heads.length > 0 && count(heads.length, "section"),
    `about ${count(minutes, "minute")}`,
    nDates > 0 && count(nDates, "date"),
    e.readIt.length > 0 && `${count(e.readIt.length, "passage")} to read in Greek`,
  ].filter(Boolean).join(" · ");
  // "On this page": the sections, then three fixed places; with one section or fewer there is no list
  const stops = [...heads, ...(nDates > 0 ? [{ id: "dates", text: "Dates" }] : []), { id: "read-it", text: "Read it yourself" }, { id: "sources", text: "Sources" }];
  const sideStops = stops.map((s) => (s.id === "read-it" ? { ...s, id: "read-it-side", track: false as const } : s));
  const readIt = (side: boolean) => (
    <section className={side ? styles.readSide : `${styles.readIt} rv`} aria-labelledby={side ? "read-it-side" : "read-it"}>
      {side ? <h2 id="read-it-side" className="label">Read it yourself</h2> : <h2 id="read-it" className={styles.h2}>Read it yourself</h2>}
      <ul>
        {e.readIt.map((r) => (
          <li key={`${r.work}${r.ref}`}>
            <Link href={readHref(r)} transitionTypes={["page-turn"]}>
              <b>{r.label}</b>
              <span>{greekAware(r.why, "w")}</span>
              <small>Open in the reader →</small>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
  // the places on the map and the Pnyx: in the side column on a computer, at the article's end on a phone
  const extras = (
    <>
      {(e.places?.length ?? 0) > 0 && (
        <div className={styles.onMap}>
          <p className="label">On the map</p>
          {e.places!.map((id) => { const p = PLACE_NAME.get(id); return p && <Link key={id} href={`/stoa/periplus?p=${id}`} transitionTypes={["page-turn"]}>{ENGLISH_NAMES[id] ?? p.en.split("/")[0].replace(/ \(.*\)$/, "")} <span lang="grc">{p.grc}</span> →</Link>; })}
        </div>
      )}
      {FORUM_OPEN && (
        <div className={styles.onMap}>
          <p className="label">Argue it out</p>
          <Link href={`/town-hall/pnyx?from=${e.slug}#propose`} transitionTypes={["page-turn"]}>Debate this in the Pnyx →</Link>
        </div>
      )}
    </>
  );
  return (
    <article className={styles.entry} data-entry={e.slug}>
      <EntryMarkers slug={e.slug} heads={heads} />
      <PageHead path={trail("wiki", { label: cat.title, href: cat.href ?? `/stoa#${cat.id}` }, e.title)} title={e.title} greek={e.greek} purpose={e.kicker}
        piece={e.image && photo(e.image) ? { piece: e.image } : undefined} className={styles.entryHead}>
        {/* the opening follows the purpose line, under it on a computer (after the photograph on a phone), then the counts */}
        <div className={styles.hookBlock}>
          <p className={styles.hook} data-key="top"><Inline xs={inline(e.hook)} card /></p>
          <div className={styles.countsRow}>
            <p className={styles.counts}>{counts}</p>
            <SectionNote slug={e.slug} section="top" title={e.title} />
          </div>
        </div>
      </PageHead>
      {heads.length > 1 && <SectionBar stops={stops} />}

      <div className={`wrap ${styles.entryGrid}`}>
        <div className={styles.entryMain} data-article>
          <Blocks bs={body} entry={e} />
          {/* the entry's one Share, where its reading ends */}
          <p className={styles.shareLine}><ShareEntry slug={e.slug} title={e.title} /></p>
          {nDates > 0 && <Timeline items={e.timeline!} />}
          <div className={styles.entryExtras}>{readIt(false)}{extras}</div>

          {related.length > 0 && (
            <section className={`${styles.related} rv`} aria-labelledby="related">
              <h2 id="related" className={styles.h2}>Related entries</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.slug}><Link href={`/stoa/${r.slug}`} transitionTypes={["page-turn"]}><span className="label">{categoryOf(r.category).title}</span><b>{r.title}</b><span>{r.kicker}</span></Link></li>
                ))}
              </ul>
            </section>
          )}

          <section className={`${styles.sources} rv`} aria-labelledby="sources">
            <h2 id="sources" className={styles.h2}>Sources</h2>
            <div className={styles.sourceCols}>
              <div>
                <h3 className="label">Ancient sources, in the library</h3>
                <ul className={styles.inLibrary}>{e.primary.map((c) => <li key={`${c.work}${c.ref}`}><Link href={readHref(c)} transitionTypes={["page-turn"]}>{c.label}</Link></li>)}</ul>
              </div>
              <div>
                <h3 className="label">Modern scholarship</h3>
                <ul>
                  {e.secondary.map(({ id, note }) => {
                    const b = BIB[id];
                    return <li key={id}>{b.author}, <i>{b.title}</i> ({b.publisher}, {b.year}).{note && <span className={styles.note}> {note}</span>}</li>;
                  })}
                </ul>
              </div>
            </div>
            <p className={styles.checked}>Every Greek quotation here is checked word for word against the edition it cites, and every translation against the translation named. Written {new Date(e.written).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</p>
          </section>
        </div>

        <aside className={styles.entryAside}>
          {heads.length > 1 && <Contents stops={sideStops} />}
          {readIt(true)}
          {extras}
        </aside>
      </div>
    </article>
  );
}
