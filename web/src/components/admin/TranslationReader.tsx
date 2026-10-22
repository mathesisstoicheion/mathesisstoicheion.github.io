"use client";
/**
 * One private translation, read side by side: the Greek on the left, our English beside it and the reference in
 * the margin, each row level with its English; at a touch, the published English as a third column (the choice is
 * remembered in this browser). Under each passage come the translator's notes and the places where our English
 * parts from the published one. Phones stack each row: reference, Greek, ours, then the published English.
 * URL: /treasury/translations?id=<id>. PrivateTranslations.tsx shows this to the moderator alone.
 */
import Link from "next/link";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  checkTranslation, hasPublished, marksAdded, plainText, readerHref, rowName, rowWith, sizeOf,
  type Difference, type Passage, type TranslationDoc, type TranslationRow,
} from "@/lib/private-translations";
import { getTranslation, trouble } from "@/lib/private-translations-db";
import { mineHref } from "@/lib/mine";
import { scrollBehavior } from "@/lib/settings";
import { useReloadable } from "@/lib/use-load";
import { DownloadButton, HERE, Seal, StatusTag, docDate, savedTime } from "./parts";
import Rich from "./Rich";
import styles from "./PrivateTranslations.module.css";
import PageHead from "@/components/PageHead";
import { trail } from "@/config/areas";

/** the path above a translation's title: the Treasury, then the shelf */
const PATH = trail("treasury", { label: "Private translations", href: HERE });

/** This browser's choice: the published English shown beside ours. Only a convenience, so it may be lost. */
const PUB_KEY = "mathesis:translations-published";
const readPub = () => { try { return localStorage.getItem(PUB_KEY) === "1"; } catch { return false; } };
const writePub = (on: boolean) => { try { localStorage.setItem(PUB_KEY, on ? "1" : "0"); } catch { /* storage unavailable: the choice lasts this visit */ } };

export default function TranslationReader({ id }: { id: string }) {
  const got = useReloadable(`private-translation|${id}`, () => getTranslation(id));
  const stored = got.data;
  const checked = useMemo(() => (stored ? checkTranslation(stored.doc) : null), [stored]);

  if (stored === undefined && got.error) {
    return (
      <Message title="The translation could not be opened">
        <p className={styles.error} role="alert">{trouble(got.error)}</p>
        <div className={styles.btnRow}><button type="button" className="btn small" onClick={got.reload}>Try again</button></div>
      </Message>
    );
  }
  if (stored === undefined) {
    return (
      <div className={`wrap ${styles.status}`} aria-busy="true">
        <h1 className="visually-hidden">Private translation</h1>
        <span className={styles.spinner} aria-hidden="true" /> Opening the translation…
      </div>
    );
  }
  if (stored === null) {
    return <Message title="Not on the shelf"><p>Nothing on the shelf has the id “{id}”. It may have been removed.</p></Message>;
  }
  if (!checked?.ok) {
    const problems = checked?.ok === false ? checked.problems : [];
    return (
      <Message title="This translation cannot be shown">
        <div className={styles.problems} role="alert">
          <p>The translation stored as “{id}” no longer passes the check:</p>
          <ul>{problems.slice(0, 12).map((p, i) => <li key={i}>{p}</li>)}</ul>
          {problems.length > 12 && <p>…and {problems.length - 12} more.</p>}
        </div>
        <p>Download it, mend the file, and add it again on the shelf.</p>
        <div className={styles.btnRow}><DownloadButton id={id} doc={stored.doc} /></div>
      </Message>
    );
  }
  return <ReaderView id={id} doc={checked.doc} raw={stored.doc} savedAt={stored.updated_at} />;
}

/** A page with only a few words on it (not found, could not load), and the way back to the shelf. */
function Message({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={`wrap ${styles.page}`}>
      <PageHead bare path={[...PATH, { label: title }]} title={title} />
      <div className={styles.message}>
        {children}
        <p><Link href={HERE}>Back to the shelf</Link></p>
      </div>
    </div>
  );
}

/** Bring a row (or a passage) into view, and mark it for a moment so the eye finds it (a passage marks its heading). */
function bring(id: string, block: ScrollLogicalPosition = "center") {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: scrollBehavior(), block });
  el.focus({ preventScroll: true });
  const mark = el.querySelector<HTMLElement>("[data-mark]") ?? el;
  mark.classList.remove(styles.flash);
  void mark.offsetWidth;  // so the mark plays again when asked twice
  mark.classList.add(styles.flash);
  window.setTimeout(() => mark.classList.remove(styles.flash), 2600);
}

function ReaderView({ id, doc, raw, savedAt }: { id: string; doc: TranslationDoc; raw: unknown; savedAt: string }) {
  const offer = hasPublished(doc);
  const [pub, setPub] = useState(readPub);
  const showPub = offer && pub;
  const flip = () => { setPub(!pub); writePub(!pub); };

  return (
    <article className={`wrap ${styles.page} ${styles.reading}`} data-pub={showPub ? "" : undefined} aria-labelledby="doc-title">
      <PageHead bare path={[...PATH, { label: plainText(doc.title) }]} titleId="doc-title"
        title={<><Rich text={doc.title} inline />{doc.greekTitle && <span className="ph-greek" lang="grc"><Rich text={doc.greekTitle} inline /></span>}</>}
        purpose={<Rich text={doc.author} inline />}>
        <div className={styles.kicker}><Seal /><StatusTag status={doc.status} /></div>
        <dl className={styles.about}>
          {doc.greekEdition && <div><dt>The Greek</dt><dd><Rich text={doc.greekEdition} inline /></dd></div>}
          {doc.publishedTranslation && <div><dt>Published English</dt><dd><Rich text={doc.publishedTranslation} inline /></dd></div>}
          <div>
            <dt>This version</dt>
            <dd>{doc.updated && <>Dated {docDate(doc.updated)}; </>}saved <time dateTime={savedAt}>{savedTime(savedAt)}</time></dd>
          </div>
        </dl>
      </PageHead>

      {doc.intro && <div className={styles.intro}><Rich text={doc.intro} /></div>}

      {marksAdded(doc) && (
        <p className={styles.key}>
          <span className={styles.keyMark} aria-hidden="true">⟦ ⟧</span>
          <span>Words between double brackets, set fainter, are words the editor of the Greek thinks were added later.</span>
        </p>
      )}

      {doc.passages.length > 1 && (
        <nav className={styles.contents} aria-label="Passages">
          <p className="label">The passages</p>
          <ol>
            {doc.passages.map((p, n) => (
              <li key={n}>
                <a href={`#passage-${n + 1}`} onClick={(e) => { e.preventDefault(); bring(`passage-${n + 1}`, "start"); }}>
                  <span className={styles.cNum}>{n + 1}</span> <span><Rich text={p.heading ?? p.locator ?? `Passage ${n + 1}`} inline /></span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className={styles.bar}>
        {offer && (
          <button type="button" className="chip" aria-pressed={showPub} onClick={flip} title="The published English, in a third column beside ours">
            <span className="dot" aria-hidden="true" /> Published English
          </button>
        )}
        <Link className="chip" href={mineHref(id)} title="Read it in the site's reader, with all the reading aids">Open in the reader →</Link>
        <span className={styles.barSize}>{sizeOf(doc)}</span>
        <span className={styles.barEnd}><DownloadButton id={id} doc={raw} /></span>
      </div>

      {doc.passages.map((p, n) => <PassageView key={n} p={p} n={n} urn={doc.urn} showPub={showPub} />)}
    </article>
  );
}

function PassageView({ p, n, urn, showPub }: { p: Passage; n: number; urn: string | undefined; showPub: boolean }) {
  const num = n + 1;
  return (
    <section id={`passage-${num}`} className={styles.passage} aria-labelledby={`passage-${num}-h`} tabIndex={-1} style={{ "--i": n } as CSSProperties}>
      <header className={styles.passageHead}>
        {p.locator && <p className={styles.locator}><Rich text={p.locator} inline /></p>}
        <h2 id={`passage-${num}-h`} className={styles.passageTitle} data-mark=""><Rich text={p.heading ?? `Passage ${num}`} inline /></h2>
      </header>
      <div className={styles.heads} aria-hidden="true">
        <span className={styles.hGrc}>Greek</span>
        <span className={styles.hOurs}>Our English</span>
        {showPub && <span className={styles.hPub}>Published English</span>}
      </div>
      <div className={styles.lines}>
        {p.rows.map((r, j) => <Line key={j} r={r} prev={p.rows[j - 1]} id={`row-${num}-${j + 1}`} j={j} urn={urn} showPub={showPub} />)}
      </div>
      {(p.notes || p.differences) && <Apparatus p={p} num={num} />}
    </section>
  );
}

/**
 * One row. The margin shows its label (a line number, say) or else its reference; a reference repeated from the row
 * before is left out, and only the first row of a reference links to that place in the site's reader.
 */
function Line({ r, prev, id, j, urn, showPub }: { r: TranslationRow; prev: TranslationRow | undefined; id: string; j: number; urn: string | undefined; showPub: boolean }) {
  const first = !prev || prev.ref !== r.ref;
  const name = (r.label || first) ? rowName(r) : "";
  const href = first ? readerHref(urn, r.ref) : null;
  return (
    <div id={id} className={styles.line} tabIndex={-1} style={{ "--j": j } as CSSProperties}>
      <div className={styles.margin}>
        {href ? (
          <Link className={styles.refLink} href={href} target="_blank" rel="noopener" title={`Open ${r.ref} in the site's reader, in a new tab`}>
            <span className={styles.refName}>{name}</span>
            <span className={styles.go} aria-hidden="true">↗</span>
            <span className={styles.goText}>open in the reader</span>
          </Link>
        ) : name && <span className={styles.refName}>{name}</span>}
      </div>
      <div className={styles.grc} lang="grc"><span className={styles.cellLabel} lang="en">Greek</span><Rich text={r.greek} /></div>
      <div className={styles.ours}><span className={styles.cellLabel}>Our English</span><Rich text={r.english} /></div>
      {showPub && (
        <div className={styles.pub}>
          <span className={styles.cellLabel}>Published English</span>
          {r.published ? <Rich text={r.published} /> : <p className={styles.none}>No published English for this row.</p>}
        </div>
      )}
    </div>
  );
}

/** Under a passage: the translator's notes, and where our English parts from the published one, and why. */
function Apparatus({ p, num }: { p: Passage; num: number }) {
  return (
    <div className={styles.apparatus}>
      {p.notes && (
        <div className={styles.notes}>
          <h3 className={styles.appHead}>Translator&apos;s notes</h3>
          <ol>{p.notes.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ol>
        </div>
      )}
      {p.differences && (
        <div className={styles.diffs}>
          <h3 className={styles.appHead}>Where we part from the published English</h3>
          <ul>{p.differences.map((d, i) => <DifferenceView key={i} d={d} at={rowWith(p, d.greek)} num={num} />)}</ul>
        </div>
      )}
    </div>
  );
}

function DifferenceView({ d, at, num }: { d: Difference; at: number; num: number }) {
  return (
    <li className={styles.diff}>
      {d.greek && <p className={styles.diffGr} lang="grc"><Rich text={d.greek} inline /></p>}
      {(d.published || d.ours) && (
        <dl className={styles.pair}>
          {d.published && <div><dt>Published</dt><dd><Rich text={d.published} inline /></dd></div>}
          {d.ours && <div className={styles.pairOurs}><dt>Ours</dt><dd><Rich text={d.ours} inline /></dd></div>}
        </dl>
      )}
      {d.why && <div className={styles.why}><Rich text={d.why} /></div>}
      {at >= 0 && (
        <button type="button" className={styles.seeIt} onClick={() => bring(`row-${num}-${at + 1}`)}>
          See it in the text <span aria-hidden="true">↑</span>
        </button>
      )}
    </li>
  );
}
