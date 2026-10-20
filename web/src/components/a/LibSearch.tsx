"use client";
/**
 * The library's search, as design A set it under the page's title: one field for an author or a title. Typing puts the
 * famous books aside, so the catalogue's answers come up right under the field. What to show (All, With English, Greek
 * only) is in the list's one bar of filters (components/library/Library.tsx).
 */
import { useLibQuery } from "@/components/library/libQuery";
import s from "./a.module.css";

export default function LibSearch() {
  const { q, setQ } = useLibQuery();
  return (
    <>
      <label className={s.search}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></svg>
        <input id="library-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          placeholder="An author or a title: Plato, Odyssey, Ἰλιάς…" aria-label="Search the library" aria-controls="library-list" />
      </label>
    </>
  );
}
