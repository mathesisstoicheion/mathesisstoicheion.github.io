"use client";
/**
 * The library's search, as design A set it under the page's title: one field for an author or a title, and below it All,
 * With English, Greek only. Typing puts the famous books aside, so the catalogue's answers come up right under the field.
 */
import { useLibQuery, type Tr } from "@/components/library/libQuery";
import s from "./a.module.css";

const SEG: [Tr, string][] = [["all", "All"], ["with", "With English"], ["greek", "Greek only"]];

export default function LibSearch() {
  const { q, tr, setQ, setTr } = useLibQuery();
  return (
    <>
      <label className={s.search}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></svg>
        <input id="library-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          placeholder="An author or a title: Plato, Odyssey, Ἰλιάς…" aria-label="Search the library" aria-controls="library-list" />
      </label>
      <div className={s.lfilters}>
        <div className={s.seg} role="group" aria-label="Show">
          {SEG.map(([id, label]) => <button key={id} type="button" aria-pressed={tr === id} onClick={() => setTr(id)}>{label}</button>)}
        </div>
      </div>
    </>
  );
}
