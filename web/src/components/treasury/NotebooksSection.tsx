"use client";
/**
 * The Treasury's notebooks: research projects of passages, concordance lines and differences between editions,
 * with notes and paragraphs of one's own, each cited (lib/cite.ts) and the whole downloadable as a document,
 * Markdown, a spreadsheet, or its citations alone (lib/notebook-export.ts); printing saves a PDF.
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { describe as describeText, loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { CITE_STYLES, type Abbrev, type CiteStyle } from "@/lib/cite";
import { citationOf, citationsOnly, linkOf, toHtml, toMarkdown, toSheet, type ExportCtx } from "@/lib/notebook-export";
import { notebookList, useNotebooks, type NbItem, type Notebook } from "@/lib/notebooks";
import { useUI } from "@/lib/ui";
import { loadAbbrevs } from "@/lib/search/refs";
import styles from "../notebook/Notebook.module.css";

const STYLE_KEY = "mathesis:cite-style";
const save = (name: string, text: string, type: string) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
const fileName = (t: string) => t.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 60) || "notebook";
/** *italics* in a citation, shown as italics */
const Cite = ({ text }: { text: string }) => <>{text.split(/(\*[^*]+\*)/).map((p, i) => (p.startsWith("*") && p.endsWith("*") && p.length > 2 ? <i key={i}>{p.slice(1, -1)}</i> : p))}</>;

export default function NotebooksSection() {
  const params = useSearchParams();
  const router = useRouter();
  const books = useNotebooks((s) => s.books);
  const open = params.get("nb");
  const go = (nb: string | null) => {
    const q = new URLSearchParams(params.toString());
    if (nb) q.set("nb", nb); else q.delete("nb");
    router.replace(`/treasury?${q}`, { scroll: false });
  };
  const book = open ? books[open] : undefined;
  if (book) return <NotebookView nb={book} onBack={() => go(null)} />;

  const list = notebookList(books);
  return (
    <div className={styles.section}>
      <h2 className={styles.h2}>Notebooks</h2>
      <p className={styles.lede}>
        A notebook gathers what you find for one question: passages from the reader, lines of a concordance, differences between editions,
        sentences. Add them with <b>Notebook</b> in the reader&apos;s passage actions, or <b>Add to a notebook</b> in the Oracle&apos;s concordance,
        a list of differences or a sentence&apos;s structure. Each is cited, and the whole can be downloaded or printed.
      </p>
      <NewNotebook onMade={(id) => go(id)} />
      {list.length > 0 && (
        <ul className={styles.bookList}>
          {list.map((b) => (
            <li key={b.id}>
              <button type="button" onClick={() => go(b.id)}>
                <b>{b.title}</b>
                <span>{b.items.length === 1 ? "1 thing" : `${b.items.length} things`} · changed {new Date(b.updated).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NewNotebook({ onMade }: { onMade: (id: string) => void }) {
  const [title, setTitle] = useState("");
  return (
    <form className={styles.newBook} onSubmit={(e) => { e.preventDefault(); onMade(useNotebooks.getState().create(title).id); setTitle(""); }}>
      <label htmlFor="nb-make">Start a notebook</label>
      <div>
        <input id="nb-make" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Justice in the orators" autoComplete="off" maxLength={120} />
        <button type="submit" className="btn small">Create</button>
      </div>
    </form>
  );
}

function NotebookView({ nb, onBack }: { nb: Notebook; onBack: () => void }) {
  const toast = useUI((s) => s.showToast);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [abbrevs, setAbbrevs] = useState<Abbrev | null>(null);
  const [style, setStyle] = useState<CiteStyle>(() => {
    try { const s = localStorage.getItem(STYLE_KEY); return (CITE_STYLES.some((x) => x.id === s) ? s : "classical") as CiteStyle; } catch { return "classical"; }
  });
  useEffect(() => { loadCatalog().then(setIdx, () => undefined); loadAbbrevs().then(setAbbrevs); }, []);
  const pickStyle = (s: CiteStyle) => { setStyle(s); try { localStorage.setItem(STYLE_KEY, s); } catch { /* blocked */ } };
  const ctx = useMemo<ExportCtx | null>(() => (idx ? { idx, abbrevs, style, origin: location.origin } : null), [idx, abbrevs, style]);
  const st = useNotebooks.getState();
  const [confirm, setConfirm] = useState(false);

  const copy = async () => {
    if (!ctx) return;
    try { await navigator.clipboard.writeText(citationsOnly(nb, ctx).replace(/\*/g, "")); toast("Citations copied."); }
    catch { toast("This browser would not copy: download the document instead."); }
  };
  const print = () => {
    if (!ctx) return;
    const w = window.open("", "_blank");
    if (!w) { toast("The browser blocked the new window: download the document and print that."); return; }
    w.document.write(toHtml(nb, ctx));
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  return (
    <div className={styles.section}>
      <p><button type="button" className={styles.back} onClick={onBack}>← All notebooks</button></p>
      <input className={styles.titleInput} value={nb.title} aria-label="The notebook's title"
        onChange={(e) => st.rename(nb.id, e.target.value)} maxLength={120} />
      <div className={styles.tools} role="group" aria-label="Citations and downloads">
        <label className={styles.styleSel}>
          <span>Citations</span>
          <select value={style} onChange={(e) => pickStyle(e.target.value as CiteStyle)} aria-label="Citation style">
            {CITE_STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <button type="button" className="btn small ghost" onClick={copy} disabled={!ctx || !nb.items.some((x) => x.kind !== "text")}>Copy the citations</button>
        <button type="button" className="btn small ghost" disabled={!ctx} onClick={() => ctx && save(`${fileName(nb.title)}.html`, toHtml(nb, ctx), "text/html;charset=utf-8")}>Download a document</button>
        <button type="button" className="btn small ghost" disabled={!ctx} onClick={() => ctx && save(`${fileName(nb.title)}.md`, toMarkdown(nb, ctx), "text/markdown;charset=utf-8")}>Markdown</button>
        <button type="button" className="btn small ghost" disabled={!ctx} onClick={() => ctx && save(`${fileName(nb.title)}.csv`, toSheet(nb, ctx), "text/csv;charset=utf-8")}>Spreadsheet</button>
        <button type="button" className="btn small ghost" disabled={!ctx} onClick={print}>Print or save as PDF</button>
      </div>

      {!nb.items.length && <p className={styles.lede}>Nothing here yet. In the reader, select some Greek and choose <b>Notebook</b>; in the Oracle, a concordance line&apos;s <b>+</b> adds it.</p>}
      <ol className={styles.items}>
        {nb.items.map((it, i) => (
          <li key={it.id} className={styles.item} data-kind={it.kind}>
            <div className={styles.itemHead}>
              <span className="label">{{ passage: "Passage", line: "Concordance line", variant: "Difference between editions", text: "Your paragraph" }[it.kind]}</span>
              <span className={styles.itemBtns}>
                <button type="button" onClick={() => st.move(nb.id, it.id, -1)} disabled={i === 0} aria-label="Move up" title="Move up">↑</button>
                <button type="button" onClick={() => st.move(nb.id, it.id, 1)} disabled={i === nb.items.length - 1} aria-label="Move down" title="Move down">↓</button>
                <button type="button" onClick={() => st.drop(nb.id, it.id)} aria-label="Remove from the notebook" title="Remove">×</button>
              </span>
            </div>
            <ItemBody it={it} ctx={ctx} />
            {it.kind === "text"
              ? <textarea className={styles.text} value={it.text} onChange={(e) => st.edit(nb.id, it.id, { text: e.target.value })} aria-label="Your paragraph" rows={3} />
              : <textarea className={styles.note} value={it.note ?? ""} onChange={(e) => st.edit(nb.id, it.id, { note: e.target.value })} aria-label="Your note on this" placeholder="Your note…" rows={2} />}
          </li>
        ))}
      </ol>
      <p className={styles.addRow}>
        <button type="button" className="btn small ghost" onClick={() => st.add(nb.id, [{ kind: "text", text: "" }])}>Add a paragraph of your own</button>
      </p>
      <p className={styles.danger}>
        {!confirm
          ? <button type="button" className={styles.back} onClick={() => setConfirm(true)}>Delete this notebook…</button>
          : <>Delete “{nb.title}” and everything in it? <button type="button" className="btn small" onClick={() => { st.remove(nb.id); onBack(); }}>Delete</button> <button type="button" className="btn small ghost" onClick={() => setConfirm(false)}>Keep it</button></>}
      </p>
    </div>
  );
}

function ItemBody({ it, ctx }: { it: NbItem; ctx: ExportCtx | null }) {
  if (it.kind === "text") return null;
  const edName = (urn: string) => { const t = ctx?.idx.text.get(urn); return t ? describeText(t).replace(/\s*\([^)]*\)$/, "") : ""; };
  return (
    <div className={styles.body}>
      <p className={styles.cite}>
        {ctx ? <Cite text={citationOf(it, ctx)} /> : "…"}{" "}
        <Link href={linkOf(it, "")} className={styles.open} transitionTypes={["page-turn"]}>Open in the reader</Link>
      </p>
      {it.kind === "passage" && (
        <>
          <p className={styles.greek} lang="grc">{it.grc}</p>
          {it.tr && <p className={styles.tr}>{it.tr}</p>}
        </>
      )}
      {it.kind === "line" && (
        <>
          <p className={styles.greek} lang={it.lang === "grc" ? "grc" : undefined}>…{it.left} <b>{it.match}</b> {it.right}…</p>
          {it.grammar && <p className={styles.small}>{it.grammar}</p>}
        </>
      )}
      {it.kind === "variant" && (
        <p className={styles.greek}>
          <span lang="grc">{it.a}</span> <span className={styles.small}>{edName(it.urn)}</span> ] <span lang="grc">{it.b}</span> <span className={styles.small}>{edName(it.other)}</span>
        </p>
      )}
    </div>
  );
}
