/**
 * One entry of the Painted Stoa: title and its hook, the lead picture, the body with its quotations and
 * boxes, "Read it yourself", related entries and sources. On a computer a side rail beside the article holds the
 * sections ("On this page"), the places on the map, the Pnyx and the key to the certainty labels; on a phone the rail
 * gives way to a closed "On this page" above the article, and the other three stand at its end, before "Read it yourself".
 */
import Link from "next/link";
import { blocks, inline } from "@/wiki/markup";
import { CERTAINTY, type Entry } from "@/wiki/types";
import { BIB } from "@/wiki/bibliography";
import { entryBySlug, categoryOf } from "@/wiki/index";
import { Blocks, Figure, Inline, CertTag, readHref, greekAware } from "./Markup";
import Contents from "./Contents";
import { EntryMarkers, SectionNote } from "./EntryNotes";
import mapData from "../../../public/data/map/places.json";
import { ENGLISH_NAMES } from "@/lib/place-names";
import styles from "./Stoa.module.css";
import PageHead from "@/components/PageHead";
import { trail } from "@/config/areas";

const PLACE_NAME = new Map((mapData as { places: { id: string; grc: string; en: string }[] }).places.map((p) => [p.id, p]));

export default function EntryView({ e }: { e: Entry }) {
  const body = blocks(e.body);
  const heads = body.flatMap((b) => ("h2" in b ? [{ id: b.id, text: b.h2 }] : []));
  const cat = categoryOf(e.category);
  const certs = new Set([...e.body.matchAll(/\{(well|debated|legend)\}/g)].map((m) => m[1] as keyof typeof CERTAINTY));
  const related = e.related.map((s) => entryBySlug.get(s)!).filter(Boolean);
  // the rail's three other blocks: in the rail on a computer, at the end of the article on a phone (one is hidden at each width)
  const extras = (
    <>
      {(e.places?.length ?? 0) > 0 && (
        <div className={styles.onMap}>
          <p className="label">On the map</p>
          {e.places!.map((id) => { const p = PLACE_NAME.get(id); return p && <Link key={id} href={`/stoa/periplus?p=${id}`} transitionTypes={["page-turn"]}>{ENGLISH_NAMES[id] ?? p.en.split("/")[0].replace(/ \(.*\)$/, "")} <span lang="grc">{p.grc}</span> →</Link>; })}
        </div>
      )}
      <div className={styles.onMap}>
        <p className="label">Argue it out</p>
        <Link href={`/town-hall/pnyx?from=${e.slug}#propose`} transitionTypes={["page-turn"]}>Debate this in the Pnyx →</Link>
      </div>
      {certs.size > 0 && (
        <div className={styles.certKey}>
          <p className="label">How sure is this?</p>
          {[...certs].map((c) => <p key={c}><CertTag c={c} /> <span>{CERTAINTY[c].about}</span></p>)}
        </div>
      )}
    </>
  );
  return (
    <article className={styles.entry} data-entry={e.slug}>
      <EntryMarkers slug={e.slug} heads={heads} />
      <PageHead path={trail("wiki", { label: cat.title, href: cat.href ?? `/stoa#${cat.id}` }, e.title)} title={e.title} greek={e.greek} purpose={e.kicker}>
        {/* the opening follows the purpose line, beside the niche on a computer (after the statue on a phone) */}
        <div className={styles.hookBlock}>
          <p className={styles.hook} data-key="top"><Inline xs={inline(e.hook)} /></p>
          <SectionNote slug={e.slug} section="top" title={e.title} />
        </div>
      </PageHead>
      {e.image ? <div className="wrap"><Figure id={e.image} lead /></div> : <div className="wrap"><div className={`${styles.band} rays draw`} aria-hidden="true" /></div>}

      <div className={`wrap ${styles.entryGrid}`}>
        <div className={styles.entryMain}>
          {heads.length > 1 && <Contents heads={heads} fold />}
          <Blocks bs={body} entry={e} />
          <div className={styles.entryExtras}>{extras}</div>

          <section className={`${styles.readIt} rv`} aria-labelledby="read-it">
            <h2 id="read-it" className={styles.h2}>Read it yourself</h2>
            <ul>
              {e.readIt.map((r) => (
                <li key={`${r.work}${r.ref}`}>
                  <Link href={readHref(r)} transitionTypes={["page-turn"]}>
                    <b>{r.label}</b>
                    <span>{greekAware(r.why, "w")}</span>
                    <small>Open in the Scroll →</small>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

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
                <ul>{e.primary.map((c) => <li key={`${c.work}${c.ref}`}><Link href={readHref(c)} transitionTypes={["page-turn"]}>{c.label}</Link></li>)}</ul>
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
          {heads.length > 1 && <Contents heads={heads} />}
          {extras}
        </aside>
      </div>
    </article>
  );
}
