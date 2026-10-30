"use client";
/**
 * The library's search, first on the page (redesign decision 11: "search first"), set as the sample's catalogue sets it: one
 * line to write on, in italic, ruled in ink, with what to show (All, With English, Greek only) beside it in plain words,
 * the chosen one underlined in red. Typing puts the famous books aside, so the catalogue's answers come up right under it.
 */
import { useLibQuery, type Tr } from "@/components/library/libQuery";

const SHOW: [Tr, string][] = [["all", "All"], ["with", "With English"], ["greek", "Greek only"]];

export default function LibSearch() {
  const { q, tr, setQ, setTr } = useLibQuery();
  return (
    <div className="find">
      <label className="find-field">
        <span className="label">Search</span>
        <input id="library-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          placeholder="an author or a title, in English or Greek" aria-label="Search the library" aria-controls="library-list" />
      </label>
      <div className="find-show" role="radiogroup" aria-label="Show">
        {SHOW.map(([id, label]) => <button key={id} type="button" role="radio" aria-checked={tr === id} onClick={() => setTr(id)}>{label}</button>)}
      </div>
    </div>
  );
}
