/**
 * A work's own page (/work/<id with a dash>), for search engines, link previews and anyone who arrives by a link:
 * what the work is, what the library holds of it (each edition and translation, as the collections
 * describe it), and where to read it. Only facts from the catalogue, GLAUx and Wikidata; no blurbs.
 * Drawn while the site is built; it needs no scripts.
 */
import OrigTitle from "./OrigTitle";
import Link from "next/link";
import { greekEditions, translations, versionOf, type CatAuthor, type CatText, type CatWork } from "@/lib/catalog";
import { centuries, DATE_NOTE, type WorkMeta } from "@/lib/works-meta";
import { commonShare } from "@/lib/difficulty";
import { AREAS, trail } from "@/config/areas";
import type { RelatedEntry } from "@/wiki/related";
import styles from "./AuthorProfile.module.css";
import lib from "./Library.module.css";
import Icon from "@/components/Icon";
import PageHead from "@/components/PageHead";

const num = (n: number) => n.toLocaleString("en-GB");

function TextRow({ w, t }: { w: CatWork; t: CatText }) {
  const href = `/read?w=${w.id}&${t.kind === "translation" ? "tr" : "ed"}=${encodeURIComponent(versionOf(t.urn))}`;
  return (
    <li className={lib.work}>
      <Link href={href} transitionTypes={["page-turn"]} className={lib.workLink}>
        <Icon name="read" />
        <span className={lib.workTitle}>{t.kind === "translation" ? "English translation" : t.kind === "commentary" ? "Commentary" : "Greek text"}</span>
        {/* the collection's own record of the file, in the body type: it is Latin or English, not a Greek title */}
        <span className={styles.record}>{t.desc ?? t.label ?? versionOf(t.urn)}</span>
      </Link>
    </li>
  );
}

export default function WorkLanding({ work, author, meta, diff, related }: {
  work: CatWork; author: CatAuthor; meta: WorkMeta | undefined; diff: [number, number] | undefined; related: RelatedEntry[];
}) {
  const greek = greekEditions(work);
  const english = translations(work);
  const others = work.texts.filter((t) => !greek.includes(t) && !english.includes(t));
  const label = greek[0]?.label;
  const pct = commonShare(diff);
  const when = meta && meta.from !== null && meta.to !== null ? centuries(meta.from, meta.to) : null;
  return (
    <div className={`wrap ${styles.page}`}>
      <PageHead bare path={trail("library", { label: author.name, href: `/author/${author.id}` }, work.title)} title={work.title}
        greek={label && label !== work.title ? label : null}
        purpose={<>By <Link href={`/author/${author.id}`} transitionTypes={["page-turn"]}>{author.name}</Link>.{work.orig && <> <OrigTitle work={work} full /></>}</>}
        action={
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Link className={`btn ${styles.readBtn}`} href={`/read?w=${work.id}`} transitionTypes={["page-turn"]}>
          {/* "Read it" in capitals, and what it opens in a smaller line under it, so the label does not break in the middle on a phone */}
          <span className={styles.readWords}>
            <span>{english.length ? "Read it" : "Read the Greek"}</span>
            {english.length > 0 && <> <small>with the English beside the Greek</small></>}
          </span>
          <span className="arr" aria-hidden="true">→</span>
        </Link>
        <Link className="btn ghost" href={`/author/${author.id}`} transitionTypes={["page-turn"]}>More by {author.name}</Link>
      </div>}>
        <dl className={styles.facts}>
          {meta?.genre && <div><dt>Kind of writing</dt><dd>{meta.genre}</dd></div>}
          {meta?.dialect && <div><dt>Dialect</dt><dd>{meta.dialect}</dd></div>}
          {when && <div><dt>Written</dt><dd title={DATE_NOTE}>{when}</dd></div>}
          {meta?.tokens ? <div><dt>Length</dt><dd>{num(meta.tokens)} words analysed</dd></div> : null}
          {pct !== null && <div><dt>Vocabulary</dt><dd title="The share of this text's running words that are among the 516 commonest Greek words">{pct}% common words</dd></div>}
          <div><dt>In the library</dt><dd>{greek.length} Greek {greek.length === 1 ? "text" : "texts"}, {english.length} English {english.length === 1 ? "translation" : "translations"}</dd></div>
        </dl>
        {!meta && <p className={styles.note}>GLAUx, the source of the date, kind of writing and dialect, does not analyse this text, so none are shown. Nothing is guessed.</p>}
      </PageHead>
      <div><div className="meander draw" aria-hidden="true" /></div>

      <section className={styles.sec} aria-labelledby="texts-title">
        <h2 id="texts-title">The texts</h2>
        <p className="muted">Each is the collection&apos;s own file, read unchanged from the Perseus Digital Library or Open Greek and Latin. The description is theirs too.</p>
        <ul className={lib.works}>
          {[...greek, ...english, ...others].map((t) => <TextRow key={t.urn} w={work} t={t} />)}
        </ul>
      </section>

      {related.length > 0 && (
        <section className={styles.sec} aria-labelledby="stoa-title">
          <h2 id="stoa-title">In {AREAS.wiki.name}</h2>
          <p className="muted">Entries that quote or point to this work&apos;s Greek.</p>
          <div className={styles.cards}>
            {related.map((e) => (
              <Link key={e.slug} href={`/stoa/${e.slug}`} className={styles.card} transitionTypes={["page-turn"]}>
                <span className="label">{e.kicker}</span>
                <b>{e.title}</b>
                <span>{e.hook}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
