"use client";
/** Words you have written a note on, each opening its Word Study page; and a box to study any word. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toGreek } from "@/components/notes/NoteField";
import { plural, wordHref, type TreasuryState } from "./data";
import styles from "./Treasury.module.css";
import Icon from "@/components/Icon";

export default function WordsSection({ t }: { t: TreasuryState }) {
  const router = useRouter();
  const [order, setOrder] = useState<"new" | "abc">("new");
  const [look, setLook] = useState("");
  const words = useMemo(() => {
    const list = Object.values(t.pageNotes).filter((n) => n.kind === "word");
    return order === "abc" ? list.sort((a, b) => a.target.localeCompare(b.target, "el")) : list.sort((a, b) => b.updated - a.updated);
  }, [t.pageNotes, order]);
  const study = () => { const g = toGreek(look.trim()); if (g) router.push(wordHref(g)); };

  return (
    <>
      <div className={styles.sectionHead}>
        <h2>Words</h2>
        <p className="muted">{plural(words.length, "word")} with a note from you. Each has a Word Study page: its dictionary entry, every form, where it is used, and its family.</p>
      </div>
      <div className={styles.filters}>
        <span className={styles.inlineForm}>
          <input value={look} onChange={(e) => setLook(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") study(); }}
            placeholder="Study any word: λόγος, or lo/gos in Beta Code" aria-label="Study any dictionary word" lang="grc" />
          <button type="button" className="chip" onClick={study} disabled={!look.trim()}><Icon name="word" />Word Study</button>
        </span>
        <span className={styles.seg} role="group" aria-label="Order">
          <button type="button" aria-pressed={order === "new"} onClick={() => setOrder("new")}>Newest</button>
          <button type="button" aria-pressed={order === "abc"} onClick={() => setOrder("abc")}><span lang="grc">α–ω</span></button>
        </span>
      </div>
      {!words.length && <p className={styles.empty}>No notes on words yet. Open a word&apos;s Word Study page and write a note under <b>Yours</b>.</p>}
      <ol className={styles.words}>
        {words.map((n, i) => (
          <li key={n.id} style={{ "--i": Math.min(i, 16) } as React.CSSProperties}>
            <Link href={wordHref(n.target)} className={styles.wordCard} transitionTypes={["page-turn"]}>
              <span className={styles.wordGr} lang="grc">{n.target}</span>
              <span className={styles.gloss}>{n.text.length > 90 ? n.text.slice(0, 90) + "…" : n.text}</span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
