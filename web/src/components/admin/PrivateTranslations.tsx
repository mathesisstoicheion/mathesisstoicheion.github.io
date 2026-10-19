"use client";
/**
 * The moderator's private translations: our own English beside the Greek, in Mine. URL: /treasury/translations (the
 * shelf, and adding or updating a translation from a .json file), /treasury/translations?id=<id> (reading one).
 *
 * The text lives only in the database, where row-level security lets the moderator alone read or change it
 * (lib/private-translations-db.ts); nothing of it is in the site's code. This page asks only once the account
 * is known to be the moderator's: signed out, it offers to sign in; signed in as anyone else, it says
 * "This page is private." and nothing more (and the database would hand them nothing anyway).
 * It is linked only from the Treasury, and only for the moderator (components/treasury/PrivateShelf.tsx), and kept
 * out of the sitemap, robots and the offline copy (config/pages.ts, ADMIN_PAGES).
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { isModerator, useAccount } from "@/lib/community/client";
import {
  fileTooBig, isIsoDate, plainText, readTranslationFile, sizeOf, type Checked,
} from "@/lib/private-translations";
import { mineHref } from "@/lib/mine";
import { listTranslations, removeTranslation, saveTranslation, trouble, type StoredSummary } from "@/lib/private-translations-db";
import { useReloadable } from "@/lib/use-load";
import { DownloadButton, HERE, Seal, StatusTag, docDate, savedDate } from "./parts";
import Rich from "./Rich";
import TranslationReader from "./TranslationReader";
import styles from "./PrivateTranslations.module.css";
import PageHead from "@/components/PageHead";
import { trail } from "@/config/areas";

export default function PrivateTranslations() {
  const start = useAccount((s) => s.start);
  useEffect(() => { start(); }, [start]);
  const { ready, session, profile } = useAccount();
  const id = useSearchParams().get("id");

  if (!ready || (session && !profile)) return <Waiting />;
  if (!session) {
    const back = `${HERE}${id ? `?id=${encodeURIComponent(id)}` : ""}`;
    return (
      <div className={`wrap ${styles.status}`}>
        <h1 className="visually-hidden">Private translations</h1>
        <p className="notice"><Link href={`/account?next=${encodeURIComponent(back)}`}>Sign in</Link> to open this page.</p>
      </div>
    );
  }
  if (!isModerator(profile)) return <div className="wrap"><div className="notice"><h1 className={styles.privateLine}>This page is private.</h1></div></div>;
  return id ? <TranslationReader key={id} id={id} /> : <Shelf />;
}

/** While the account is read; after a while, a word on why it may be taking long. */
function Waiting() {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setSlow(true), 8000); return () => clearTimeout(t); }, []);
  return (
    <div className={`wrap ${styles.status}`} aria-busy="true">
      <h1 className="visually-hidden">Private translations</h1>
      <span className={styles.spinner} aria-hidden="true" /> One moment…
      {slow && <p className={styles.small}>Still waiting for the site&apos;s database. Check the connection light at the top of the page.</p>}
    </div>
  );
}

// ------------------------------------------------------------ the shelf
function Shelf() {
  const list = useReloadable("private-translations", listTranslations);
  const [notice, setNotice] = useState<{ text: string; id?: string } | null>(null);
  const rows = list.data;
  const error = list.error ? trouble(list.error) : null;

  return (
    <div className={`wrap ${styles.page}`}>
      <PageHead bare path={trail("treasury", "Private translations")} title="Private translations"
        purpose={<>Our own English, read side by side with the Greek. The translations are kept only in the site&apos;s database, where nobody but
          the moderator can open them. They are never part of the website&apos;s code, which anyone can download, and this page keeps no copy on this computer.</>}>
        <div className={styles.kicker}><span className="tongues draw" aria-hidden="true" /><Seal /></div>
      </PageHead>
      <div className="meander draw" aria-hidden="true" />

      <section className={styles.shelfSec} aria-labelledby="shelf-h" aria-busy={list.busy}>
        <div className={styles.secHead}>
          <h2 id="shelf-h">On the shelf</h2>
          {rows && <span className={styles.count}>{rows.length === 1 ? "1 translation" : `${rows.length} translations`}</span>}
        </div>
        {notice && (
          <p className={styles.done} role="status">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9" /></svg>
            {notice.text}{notice.id && <> <Link href={mineHref(notice.id)}>Read it in the reader →</Link></>}
          </p>
        )}
        {error && <p className={styles.error} role="alert">{error}</p>}
        {!rows && !error && <p className={styles.status}><span className={styles.spinner} aria-hidden="true" /> Taking the books down…</p>}
        {rows?.length === 0 && <p className={styles.empty}>Nothing is stored yet. Add the first translation below.</p>}
        {rows && rows.length > 0 && (
          <ul className={styles.shelf}>
            {rows.map((r, i) => (
              <Book key={r.id} r={r} i={i} onRemoved={(gone) => {
                const t = r.title ? plainText(r.title) : r.id;
                setNotice({ text: gone ? `Removed “${t}”.` : `“${t}” was already gone.` });
                list.reload();
              }} />
            ))}
          </ul>
        )}
      </section>

      <AddTranslation stored={rows} onSaved={(id, title, replaced) => { setNotice({ text: `${replaced ? "Replaced" : "Saved"} “${plainText(title)}”.`, id }); list.reload(); }} />
    </div>
  );
}

/** One translation on the shelf: its Greek and English titles, the author, how far along it is, when it was saved. */
function Book({ r, i, onRemoved }: { r: StoredSummary; i: number; onRemoved: (gone: boolean) => void }) {
  const title = r.title ?? r.id;
  return (
    <li className={styles.book} style={{ "--i": i } as CSSProperties}>
      <Link className={styles.bookLink} href={mineHref(r.id)} title="Open it in the reader, with all the reading aids">
        {r.greekTitle && <span className={styles.bookGr} lang="grc"><Rich text={r.greekTitle} inline /></span>}
        <b className={styles.bookTitle}><Rich text={title} inline /></b>
        <span className={styles.bookBy}>{r.author ? <Rich text={r.author} inline /> : "No author given"}</span>
        <span className={styles.bookGo} aria-hidden="true">Read it in the reader →</span>
      </Link>
      <div className={styles.bookFoot}>
        <p className={styles.bookMeta}>
          <StatusTag status={r.status} />
          <span>Saved <time dateTime={r.updated_at}>{savedDate(r.updated_at)}</time></span>
        </p>
        <div className={styles.bookActs}>
          <Link className={styles.act} href={`${HERE}?id=${encodeURIComponent(r.id)}`} title="Side by side with the published English, with the introduction and the translator's notes">Notes and comparison</Link>
          <DownloadButton id={r.id} />
          <RemoveButton id={r.id} title={title} onRemoved={onRemoved} />
        </div>
      </div>
    </li>
  );
}

/** Remove, asked in the page ("are you sure?"), never in the browser's own pop-up box. */
function RemoveButton({ id, title, onRemoved }: { id: string; title: string; onRemoved: (gone: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <button type="button" className={styles.act} onClick={() => { setOpen(!open); setError(null); }} aria-expanded={open}>Remove</button>
      {open && (
        <span className={styles.ask} role="group" aria-label={`Remove ${plainText(title)}`}>
          <span>Remove “<Rich text={title} inline />” from the database? This cannot be undone: download it first if you may want it again.</span>
          <span className={styles.askRow}>
            <button type="button" className="chip" disabled={busy} autoFocus onClick={async () => {
              setBusy(true); setError(null);
              try { onRemoved(await removeTranslation(id)); } catch (e) { setError(trouble(e)); setBusy(false); }
            }}>{busy ? "Removing…" : "Yes, remove it"}</button>
            <button type="button" className={styles.act} onClick={() => setOpen(false)}>Keep it</button>
          </span>
          {error && <span className={styles.error} role="alert">{error}</span>}
        </span>
      )}
    </>
  );
}

// ------------------------------------------------------------ adding or updating
/**
 * Choose (or drop) a .json file: it is read and checked here, in the browser, and shown; nothing is saved until
 * Save is pressed. A file whose id is already on the shelf replaces that translation.
 */
function AddTranslation({ stored, onSaved }: { stored: StoredSummary[] | undefined; onSaved: (id: string, title: string, replaced: boolean) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState<{ name: string; result: Checked } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  const take = async (f: File) => {
    setError(null);
    const big = fileTooBig(f.size);
    if (big) { setPicked({ name: f.name, result: { ok: false, problems: [big] } }); return; }
    let text: string;
    try { text = await f.text(); } catch { setPicked({ name: f.name, result: { ok: false, problems: ["This file could not be opened."] } }); return; }
    setPicked({ name: f.name, result: readTranslationFile(text) });
  };

  const ok = picked?.result.ok ? picked.result : null;
  const existing = ok ? stored?.find((s) => s.id === ok.doc.id) : undefined;
  const older = !!ok && !!existing && isIsoDate(ok.doc.updated) && isIsoDate(existing.updated) && ok.doc.updated < existing.updated;

  const save = async () => {
    if (!ok) return;
    setBusy(true); setError(null);
    try {
      await saveTranslation(ok.doc.id, ok.raw);
      setPicked(null);
      onSaved(ok.doc.id, ok.doc.title, !!existing);
    } catch (e) { setError(trouble(e)); } finally { setBusy(false); }
  };

  return (
    <section className={styles.add} aria-labelledby="add-h" data-over={over || undefined}
      onDragOver={(e) => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); setOver(true); } }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false); }}
      onDrop={(e) => { if (!e.dataTransfer.files.length) return; e.preventDefault(); setOver(false); void take(e.dataTransfer.files[0]); }}>
      <h2 id="add-h">Add or update a translation</h2>
      <p className={styles.addLead}>
        Choose the translation&apos;s <b>.json</b> file on this computer. It is checked first, and nothing is saved until you press Save.
        A file whose id is already on the shelf replaces that translation.
      </p>
      <div className={styles.btnRow}>
        <button type="button" className="btn" onClick={() => input.current?.click()}>Choose a .json file</button>
        <span className={styles.small}>or drop it on this box</span>
        <input ref={input} type="file" accept=".json,application/json" hidden aria-label="Choose a translation file (.json)"
          onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void take(f); }} />
      </div>

      {picked && !picked.result.ok && (
        <div className={styles.problems} role="alert">
          <p><b>{picked.name}</b> cannot be saved{picked.result.problems.length > 1 ? `: ${picked.result.problems.length} things need mending` : ""}.</p>
          <ul>{picked.result.problems.slice(0, 12).map((p, i) => <li key={i}>{p}</li>)}</ul>
          {picked.result.problems.length > 12 && <p>…and {picked.result.problems.length - 12} more.</p>}
        </div>
      )}

      {ok && (
        <div className={styles.preview}>
          <p className="label">Ready to save · {picked!.name}</p>
          <div>
            {ok.doc.greekTitle && <p className={styles.previewGr} lang="grc"><Rich text={ok.doc.greekTitle} inline /></p>}
            <h3 className={styles.previewTitle}><Rich text={ok.doc.title} inline /></h3>
          </div>
          <dl className={styles.facts}>
            <div><dt>Author</dt><dd><Rich text={ok.doc.author} inline /></dd></div>
            <div><dt>Status</dt><dd><StatusTag status={ok.doc.status} /></dd></div>
            <div><dt>Contents</dt><dd>{sizeOf(ok.doc)}</dd></div>
            {ok.doc.updated && <div><dt>Dated</dt><dd>{docDate(ok.doc.updated)}</dd></div>}
            <div><dt>Id</dt><dd><code>{ok.doc.id}</code></dd></div>
          </dl>
          <p>
            {existing
              ? <>This <b>replaces</b> “{existing.title ? <Rich text={existing.title} inline /> : existing.id}” on the shelf, saved {savedDate(existing.updated_at)}.</>
              : <>This is new: nothing with this id is on the shelf yet.</>}
          </p>
          {older && (
            <p className={styles.warn}>This file is dated {docDate(ok.doc.updated!)}, earlier than the copy on the shelf ({docDate(existing!.updated!)}). Is it the newer one?</p>
          )}
          {ok.warnings.map((w, i) => <p key={i} className={styles.warn}>{w}</p>)}
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.btnRow}>
            <button type="button" className="btn" onClick={save} disabled={busy}>{busy ? "Saving…" : existing ? "Replace it" : "Save it"}</button>
            <button type="button" className="btn ghost" onClick={() => { setPicked(null); setError(null); }} disabled={busy}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}
