"use client";
/**
 * "Add to a notebook": a small window, wherever something is being gathered (a passage in the reader, lines of
 * a concordance, a difference between editions, a sentence). Choose a notebook, or start one, and the things
 * are added with their references (lib/notebooks.ts); the notebooks themselves are in the Treasury.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { notebookList, useNotebooks, type NewItem } from "@/lib/notebooks";
import { useUI } from "@/lib/ui";
import styles from "./Notebook.module.css";

export default function NotebookPicker({ items, what, onClose }: {
  /** what to add (worked out when the window opens) */
  items: NewItem[];
  /** what it is, for the window's title: "this passage", "300 lines" */
  what: string;
  onClose: () => void;
}) {
  const books = useNotebooks((s) => s.books), last = useNotebooks((s) => s.last);
  const toast = useUI((s) => s.showToast);
  const list = notebookList(books).sort((a, b) => (a.id === last ? -1 : b.id === last ? 1 : 0));
  const [title, setTitle] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const before = useRef<HTMLElement | null>(null);
  useEffect(() => {
    before.current = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("button, input")?.focus();
    return () => before.current?.focus?.({ preventScroll: true });
  }, []);

  const addTo = (id: string, name: string) => {
    const n = useNotebooks.getState().add(id, items);
    toast(n ? `Added ${n === 1 ? "1 thing" : `${n} things`} to “${name}”.` : `Already in “${name}”.`);
    onClose();
  };
  const createAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const nb = useNotebooks.getState().create(title || "Untitled notebook");
    addTo(nb.id, nb.title);
  };

  return (
    <div className={styles.scrim} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} className={styles.picker} role="dialog" aria-modal="true" aria-labelledby="nb-pick-title"
        onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } }}>
        <div className={styles.pickHead}>
          <h2 id="nb-pick-title" className={styles.pickTitle}>Add {what} to a notebook</h2>
          <button type="button" className={styles.x} onClick={onClose} aria-label="Close">×</button>
        </div>
        {list.length > 0 && (
          <ul className={styles.books}>
            {list.map((b) => (
              <li key={b.id}>
                <button type="button" onClick={() => addTo(b.id, b.title)}>
                  <b>{b.title}</b>
                  <span>{b.items.length === 1 ? "1 thing" : `${b.items.length} things`}{b.id === last ? " · added to last" : ""}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <form className={styles.newBook} onSubmit={createAndAdd}>
          <label htmlFor="nb-new">{list.length ? "Or start a new notebook" : "Start your first notebook"}</label>
          <div>
            <input id="nb-new" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Justice in the orators" autoComplete="off" maxLength={120} />
            <button type="submit" className="btn small">Create and add</button>
          </div>
        </form>
        <p className={styles.fine}>Your notebooks are in <Link href="/treasury?s=notebooks" onClick={onClose}>the Treasury</Link>, with citations and downloads.</p>
      </div>
    </div>
  );
}
