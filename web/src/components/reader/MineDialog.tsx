"use client";
/**
 * The private collection's window in the reader (owner's request, 2026-10-14): the moderator's own translations and the
 * texts they imported, to open in the reader with all its aids (lib/mine.ts), and "Import a text" (lib/import-text.ts).
 * Shown only to the moderator (Reader.tsx); the database lets nobody else read or save anything anyway
 * (lib/private-translations-db.ts). This window is loaded only when opened, so the database's library stays out of
 * the reader for everyone else. Nothing is kept on this computer.
 */
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PRIVATE_COLLECTION, PRIVATE_TRANSLATIONS } from "@/config/admin";
import { fromPlainText, fromTei, kindOf, teiMeta } from "@/lib/import-text";
import { isMine, mineId } from "@/lib/mine";
import { fileTooBig, plainText, readTranslationFile, sizeOf, type Checked } from "@/lib/private-translations";
import { listTranslations, saveTranslation, trouble, type StoredSummary } from "@/lib/private-translations-db";
import { scrollBehavior } from "@/lib/settings";
import { StatusTag } from "@/components/admin/parts";
import styles from "./Mine.module.css";

export type Tab = "shelf" | "import";

export default function MineDialog({ current, onOpen, onClose, start = "shelf" }: {
  current: string | null; onOpen: (id: string) => void; onClose: () => void;
  /** the tab it opens on: the shelf, or "Import a text" */
  start?: Tab;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<Tab>(start);
  useEffect(() => { ref.current?.showModal(); }, []);
  const close = () => ref.current?.close();

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="mine-title" onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) close(); }}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <span className={styles.seal}>{LOCK} Private · only you can see this</span>
            <h2 id="mine-title" className={styles.title}>Private collection</h2>
          </div>
          <button type="button" className={styles.x} onClick={close} aria-label="Close">×</button>
        </header>
        <Collection current={current} onOpen={onOpen} tab={tab} onTab={setTab} />
        <p className={styles.foot}><Link href={PRIVATE_COLLECTION}>Open the private collection as a page</Link></p>
      </div>
    </dialog>
  );
}

export const LOCK = <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>;

/**
 * The shelf and "Import a text", as tabs: in the reader's window above, and on the private collection's own page
 * (components/library/PrivateCollection.tsx, /library/private).
 */
export function Collection({ current, onOpen, tab, onTab }: {
  current: string | null; onOpen: (id: string) => void; tab: Tab; onTab: (t: Tab) => void;
}) {
  const [rows, setRows] = useState<StoredSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  useEffect(() => {
    let live = true;
    listTranslations().then((r) => { if (live) { setRows(r); setError(null); } }, (e) => { if (live) setError(trouble(e)); });
    return () => { live = false; };
  }, [round]);
  const here = isMine(current) ? mineId(current) : null;

  return (
    <>
      <div className={styles.tabs} role="tablist" aria-label="Private collection">
        <button type="button" role="tab" id="mine-tab-shelf" aria-controls="mine-shelf" aria-selected={tab === "shelf"} onClick={() => onTab("shelf")}>
          On the shelf{rows ? <span className={styles.n}>{rows.length}</span> : null}
        </button>
        <button type="button" role="tab" id="mine-tab-import" aria-controls="mine-import" aria-selected={tab === "import"} onClick={() => onTab("import")}>Import a text</button>
      </div>

      {tab === "shelf" ? (
        <section id="mine-shelf" role="tabpanel" aria-labelledby="mine-tab-shelf" className={styles.panel}>
          {error && <p className={styles.error} role="alert">{error} <button type="button" className={styles.link} onClick={() => setRound(round + 1)}>Try again</button></p>}
          {!rows && !error && <p className={styles.quiet}><span className={styles.spinner} aria-hidden="true" /> Taking the books down…</p>}
          {rows?.length === 0 && <p className={styles.quiet}>Nothing is on the shelf yet. <button type="button" className={styles.link} onClick={() => onTab("import")}>Import a text</button>, or add a translation on the <Link href={PRIVATE_TRANSLATIONS}>shelf in Mine</Link>.</p>}
          {rows && rows.length > 0 && (
            <ul className={styles.books}>
              {rows.map((r, i) => (
                <li key={r.id} style={{ "--i": i } as CSSProperties}>
                  <button type="button" className={styles.book} onClick={() => onOpen(r.id)} aria-current={r.id === here || undefined}>
                    {r.greekTitle && <span className={styles.bookGr} lang="grc">{plainText(r.greekTitle)}</span>}
                    <b className={styles.bookTitle}>{r.title ? plainText(r.title) : r.id}</b>
                    <span className={styles.bookBy}>{r.author ? plainText(r.author) : "No author given"}</span>
                    <span className={styles.bookFoot}>
                      <StatusTag status={r.status} />
                      {r.id === here ? <span className={styles.now}>Reading now</span> : <span className={styles.go} aria-hidden="true">Read →</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className={styles.foot}>
            To add, replace, download or remove translations, use the <Link href={PRIVATE_TRANSLATIONS}>shelf in Mine</Link>.
          </p>
        </section>
      ) : (
        <section id="mine-import" role="tabpanel" aria-labelledby="mine-tab-import" className={styles.panel}>
          <Importer taken={rows?.map((r) => r.id) ?? []} stored={rows} onSaved={(id) => { setRound(round + 1); onOpen(id); }} />
        </section>
      )}
    </>
  );
}

interface Picked { name: string; text: string }

/**
 * Import a text: a file (.json, .xml or .txt), or the Greek typed or pasted, with the English if there is one. It is
 * checked here and shown before anything is saved; Save keeps it in the private collection and opens it in the reader.
 */
function Importer({ taken, stored, onSaved }: { taken: string[]; stored: StoredSummary[] | null; onSaved: (id: string) => void }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [greekTitle, setGreekTitle] = useState("");
  const [greek, setGreek] = useState("");
  const [english, setEnglish] = useState("");
  // a TEI file stands in for the typed Greek (or English) until it is taken away
  const [teiGrc, setTeiGrc] = useState<Picked | null>(null);
  const [teiEng, setTeiEng] = useState<Picked | null>(null);
  const [urn, setUrn] = useState<string | undefined>();
  const [result, setResult] = useState<{ checked: Checked; from: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const grcInput = useRef<HTMLInputElement>(null), engInput = useRef<HTMLInputElement>(null);
  // the check's answer comes below the form: bring it into view
  const answer = useRef<HTMLDivElement>(null);
  useEffect(() => { if (result) answer.current?.scrollIntoView({ block: "nearest", behavior: scrollBehavior() }); }, [result]);

  const read = async (f: File): Promise<string | null> => {
    const big = fileTooBig(f.size);
    if (big) { setError(big.replace("A translation file", "A file")); return null; }
    try { return (await f.text()).replace(/^﻿/, ""); } catch { setError(`“${f.name}” could not be opened.`); return null; }
  };
  const takeGreek = async (f: File) => {
    setError(null); setResult(null);
    const text = await read(f);
    if (text === null) return;
    const kind = kindOf(f.name, text);
    if (kind === "json") { setResult({ checked: readTranslationFile(text), from: f.name }); return; }
    if (kind === "tei") {
      const m = teiMeta(text);
      setTeiGrc({ name: f.name, text }); setGreek("");
      if (m.title && !title) setTitle(m.title);
      if (m.author && !author) setAuthor(m.author);
      setUrn(m.urn);
      return;
    }
    setTeiGrc(null); setGreek(text);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  };
  const takeEnglish = async (f: File) => {
    setError(null); setResult(null);
    const text = await read(f);
    if (text === null) return;
    if (kindOf(f.name, text) === "tei") { setTeiEng({ name: f.name, text }); setEnglish(""); }
    else { setTeiEng(null); setEnglish(text); }
  };

  const check = async () => {
    setError(null); setResult(null);
    if (!title.trim() || !author.trim()) { setError("Give the text a title and an author first."); return; }
    const meta = { title, author, greekTitle, urn };
    if (teiGrc) {
      setBusy(true);
      try {
        const { parseInWorker } = await import("@/lib/tei/client");
        const parsed = await parseInWorker(teiGrc.text, teiEng?.text ?? null);
        setResult({ checked: fromTei(meta, parsed, taken), from: teiGrc.name });
      } catch (e) {
        setError(`“${teiGrc.name}” could not be read as a TEI text: ${(e as Error).message}`);
      } finally { setBusy(false); }
      return;
    }
    setResult({ checked: fromPlainText(meta, greek, english, taken), from: "the text typed in" });
  };

  const ok = result?.checked.ok ? result.checked : null;
  const existing = ok ? stored?.find((s) => s.id === ok.doc.id) : undefined;
  const save = async () => {
    if (!ok) return;
    setBusy(true); setError(null);
    try { await saveTranslation(ok.doc.id, ok.raw); onSaved(ok.doc.id); } catch (e) { setError(trouble(e)); setBusy(false); }
  };

  return (
    <div className={styles.importer} data-over={over || undefined}
      onDragOver={(e) => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); setOver(true); } }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false); }}
      onDrop={(e) => { if (!e.dataTransfer.files.length) return; e.preventDefault(); setOver(false); void takeGreek(e.dataTransfer.files[0]); }}>
      <p className={styles.lead}>
        Bring in a Greek text of your own, with its English if you have one. It is kept in your private collection, which only you can open,
        and read here with every reading aid. Nothing is saved until you press Save.
      </p>

      <div className={styles.drop}>
        <button type="button" className="btn small" onClick={() => grcInput.current?.click()}>Choose a file</button>
        <span className={styles.quiet}>or drop it here: a TEI file (.xml) like those of Perseus and First1K, a plain text (.txt), or a translation file (.json)</span>
        <input ref={grcInput} type="file" accept=".xml,.txt,.json,text/xml,application/xml,text/plain,application/json" hidden aria-label="Choose a text file"
          onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void takeGreek(f); }} />
      </div>

      <div className={styles.fields}>
        <label><span className="label">Title</span><input value={title} onChange={(e) => { setTitle(e.target.value); setResult(null); }} placeholder="e.g. On Habits" /></label>
        <label><span className="label">Author</span><input value={author} onChange={(e) => { setAuthor(e.target.value); setResult(null); }} placeholder="e.g. Galen" /></label>
        <label className={styles.wide}><span className="label">Greek title <span className={styles.opt}>(if you like)</span></span>
          <input lang="grc" value={greekTitle} onChange={(e) => { setGreekTitle(e.target.value); setResult(null); }} placeholder="e.g. Περὶ ἐθῶν" /></label>
      </div>

      <div className={styles.texts}>
        <div className={styles.textBox}>
          <span className="label">The Greek</span>
          {teiGrc ? (
            <p className={styles.file}><b>{teiGrc.name}</b> <span className={styles.quiet}>(TEI)</span>
              <button type="button" className={styles.link} onClick={() => { setTeiGrc(null); setTeiEng(null); setUrn(undefined); setResult(null); }}>Take it away</button></p>
          ) : (
            <textarea lang="grc" value={greek} onChange={(e) => { setGreek(e.target.value); setResult(null); }} rows={8} aria-label="The Greek text"
              placeholder="Paste or type the Greek. Leave a blank line between passages." spellCheck={false} />
          )}
        </div>
        <div className={styles.textBox}>
          <span className="label">The English <span className={styles.opt}>(if you have one)</span></span>
          {teiEng ? (
            <p className={styles.file}><b>{teiEng.name}</b> <span className={styles.quiet}>(TEI)</span>
              <button type="button" className={styles.link} onClick={() => { setTeiEng(null); setResult(null); }}>Take it away</button></p>
          ) : teiGrc ? (
            <p className={styles.quiet}>With a TEI Greek text, the English comes from its own TEI file:{" "}
              <button type="button" className={styles.link} onClick={() => engInput.current?.click()}>choose the English file</button>.</p>
          ) : (
            <>
              <textarea value={english} onChange={(e) => { setEnglish(e.target.value); setResult(null); }} rows={8} aria-label="The English translation"
                placeholder="Paste the English, a blank line between passages, in the same order as the Greek." />
              <button type="button" className={styles.link} onClick={() => engInput.current?.click()}>or choose a file</button>
            </>
          )}
          <input ref={engInput} type="file" accept=".xml,.txt,text/xml,application/xml,text/plain" hidden aria-label="Choose the English file"
            onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void takeEnglish(f); }} />
        </div>
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}
      {!result && (
        <div className={styles.row}>
          <button type="button" className="btn" onClick={check} disabled={busy || (!teiGrc && !greek.trim())}>{busy ? "Reading…" : "Check it"}</button>
        </div>
      )}

      <div ref={answer} className={styles.answer}>
      {result && !result.checked.ok && (
        <div className={styles.problems} role="alert">
          <p><b>{result.from}</b> cannot be saved{result.checked.problems.length > 1 ? `: ${result.checked.problems.length} things need mending` : ""}.</p>
          <ul>{result.checked.problems.slice(0, 10).map((p, i) => <li key={i}>{p}</li>)}</ul>
          {result.checked.problems.length > 10 && <p>…and {result.checked.problems.length - 10} more.</p>}
        </div>
      )}
      {ok && (
        <div className={styles.preview}>
          <p className="label">Ready to save · {result!.from}</p>
          {ok.doc.greekTitle && <p className={styles.bookGr} lang="grc">{plainText(ok.doc.greekTitle)}</p>}
          <h3 className={styles.bookTitle}>{plainText(ok.doc.title)}</h3>
          <p className={styles.bookBy}>{plainText(ok.doc.author)} · {sizeOf(ok.doc)}{ok.doc.passages.some((p) => p.rows.some((r) => r.english)) ? ", with English" : ", Greek only"}</p>
          {existing && <p className={styles.warn}>This <b>replaces</b> “{existing.title ? plainText(existing.title) : existing.id}”, already on the shelf with the same id.</p>}
          {ok.warnings.map((w, i) => <p key={i} className={styles.warn}>{w}</p>)}
          <div className={styles.row}>
            <button type="button" className="btn" onClick={save} disabled={busy}>{busy ? "Saving…" : existing ? "Replace it and read" : "Save and read"}</button>
            <button type="button" className="btn ghost" onClick={() => setResult(null)} disabled={busy}>Change something</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
