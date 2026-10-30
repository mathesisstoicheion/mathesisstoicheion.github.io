"use client";
/**
 * The universal search, from any page: press "/" or Ctrl+K (⌘K on a Mac), the search button in the
 * header, or on phones the Search button in the bottom bar (a full-screen sheet, with Greek letters that
 * can sit just above the phone's keyboard).
 *
 * Before anything is typed: your recent searches, where you left off, and examples. Then, grouped:
 * a passage (a typed reference), the word (its dictionary entry, for Greek typed in any script), texts
 * and authors, lessons and guides, Painted Stoa entries, places on the map, the site's pages, quick
 * actions ("daylight", "bigger text") and the full searches of the Oracle. Matching ignores case,
 * accents and breathings (lib/search/universal.ts).
 */
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { fold, loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { detectScript, queryWords, toPattern } from "@/lib/search/input";
import { loadAbbrevs, readReference, type Abbrevs } from "@/lib/search/refs";
import { ACTIONS, matchActions, rank, type ActionId } from "@/lib/search/universal";
import { addRecentSearch, clearRecentSearches, recentSearches, removeRecentSearch } from "@/lib/recent-searches";
import { trail, type Visit } from "@/lib/resume";
import { lsjEntries } from "@/lib/lookup/lsj";
import { coreEntry } from "@/lib/lookup/core";
import { loadPlaces, shortName, typeLabel, type Place } from "@/lib/map";
import { useSettings } from "@/lib/settings";
import { shownGreekSize, steppedSize } from "@/lib/greekSize";
import { startSearch, useUI } from "@/lib/ui";
import { AREAS, FORUM_OPEN, areaTitle, shown } from "@/config/areas";
import GreekKeyboard from "./GreekKeyboard";
import styles from "./QuickSearch.module.css";
import { useScrollLock } from "@/lib/overlay";

/** What the search needs of each wiki entry, lesson and guide; loaded only when the box opens. */
type Item = { href: string; title: string; greek?: string; about: string; words?: string[]; kind: string };

type GroupId = "goto" | "word" | "texts" | "academy" | "stoa" | "places" | "pages" | "actions" | "everywhere";
const GROUP_TITLE: Record<GroupId, string> = {
  goto: "Go to", word: "The word", texts: "Texts and authors", academy: "Learn Greek", stoa: "Painted Stoa",
  places: "On the map", pages: "Pages", actions: "Do it", everywhere: "Search everywhere",
};
/** a row's own label is left out where it only repeats its group's title ("On the map" under "On the map") */
const repeats = (kind: string, title: string) => { const n = (t: string) => t.toLowerCase().replace(/s$/, ""); return n(kind) === n(title); };

interface Option { id: string; group: GroupId; kind: string; label: React.ReactNode; href?: string; run?: ActionId; greek?: boolean }

/** Pages of the site a search can open by name. */
const PAGES: { href: string; title: string; about: string }[] = [
  ...(["home", "library", "search", "study", "wiki", "archaeology", "census", "map", "forum", "debates", "treasury", "downloads"] as const)
    .filter(shown).map((id) => ({ href: AREAS[id].href, title: areaTitle(id), about: AREAS[id].fit })),
  { href: "/academy/alphabet", title: "The alphabet", about: "letters, how to write them, how they sounded" },
  { href: "/academy/today", title: "Today's session", about: "a few minutes a day" },
  { href: "/academy/practice", title: "Practice", about: "drills, endings, parsing" },
  { href: "/academy/tables", title: "Tables of forms", about: "paradigms, declensions, conjugations, endings" },
  { href: "/academy/vocabulary", title: "Vocabulary by frequency", about: "commonest words, core vocabulary" },
  { href: "/stoa/authors", title: "Authors", about: "every author, by period and kind of writing" },
  { href: "/stoa/eras", title: "Eras of Greek", about: "periods, centuries" },
  { href: "/stoa/editions", title: "Editions and translations", about: "printed sources, publishers" },
  { href: "/stoa/manuscripts", title: "Manuscripts and transmission", about: "papyrus, copies, how the texts reached us" },
  { href: "/stoa/variants", title: "Textual variants", about: "readings, where the copies disagree" },
  { href: "/stoa/lyre", title: "The lyre", about: "play music, kithara, harp, ancient songs, Seikilos" },
  { href: "/stoa/pot", title: "The potter", about: "paint a pot, vase, amphora, pottery, black-figure, red-figure, make and share" },
  { href: "/search", title: "Research tools", about: "concordance, statistics, grammar, constructions, word counts" },
  { href: "/about", title: "About the names", about: "about this site" },
  { href: "/credits", title: "Credits, licences and privacy", about: "sources, privacy" },
];

const EXAMPLES = ["μῆνιν", "Il. 1.1", "logos", "Sparta", "aorist", "daylight"];

export default function QuickSearch() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable;
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (useUI.getState().searchOpen) setOpen(false); else startSearch(); }
      else if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); startSearch(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [setOpen]);

  if (!open) return null;
  return <Box onClose={() => setOpen(false)} />;
}

function Box({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [abbrevs, setAbbrevs] = useState<Abbrevs | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [word, setWord] = useState<{ q: string; head: string; def: string; rank: number | null } | null>(null);
  // the box is only ever drawn in the browser (it opens on a click or a key), so these can be read at once
  const [recent, setRecent] = useState<string[]>(() => recentSearches());
  // only real places to go back to: never the home page, nor the page you are on
  const [visits] = useState<Visit[]>(() => trail().filter((v) => v.href !== "/" && v.href !== location.pathname + location.search).slice(0, 3));
  const [kbd, setKbd] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // phones: the sheet covers only what the on-screen keyboard leaves visible, so nothing hides behind it
  useEffect(() => {
    const vv = window.visualViewport, d = dialog.current;
    if (!vv || !d) return;
    const fit = () => { d.style.setProperty("--vv-h", `${vv.height}px`); d.style.setProperty("--vv-top", `${vv.offsetTop}px`); };
    fit();
    vv.addEventListener("resize", fit);
    vv.addEventListener("scroll", fit);
    return () => { vv.removeEventListener("resize", fit); vv.removeEventListener("scroll", fit); };
  }, []);

  useScrollLock(true);
  useEffect(() => {
    dialog.current?.showModal();
    // the dialog gives focus to its first button, now the Greek letters at the left: the search line takes it instead
    input.current?.focus();
    loadCatalog().then(setIdx, () => undefined);
    loadAbbrevs().then(setAbbrevs);
    Promise.all([import("@/wiki/index"), import("@/data/lesson-index"), import("@/data/guides")]).then(([w, l, g]) => setItems([
      ...l.LESSON_INFO.map((x, i) => ({ href: `/academy/lesson/${x.id}`, title: x.title, greek: x.greek, about: x.summary, words: x.words, kind: `Lesson ${i + 1}` })),
      ...g.GUIDES.map((x) => ({ href: `/academy/guide/${x.id}`, title: x.title, greek: x.greek, about: x.summary, kind: "Guide" })),
      ...w.ENTRIES.map((x) => ({ href: `/stoa/${x.slug}`, title: x.title, greek: x.greek, about: x.kicker, kind: "Painted Stoa" })),
    ]), () => undefined);
  }, []);

  const t = q.trim();
  // places: loaded the first time a name is long enough to look for
  useEffect(() => {
    if (places || t.length < 3 || /\d/.test(t)) return;
    loadPlaces().then((p) => setPlaces([...p.places].sort((a, b) => b.n - a.n)), () => setPlaces([]));
  }, [t, places]);

  // the word: a single Greek word (typed in Greek, Latin letters or Beta Code) looked up in LSJ, a moment after typing stops
  const greekWord = useMemo(() => {
    const ws = queryWords(t);
    if (ws.length !== 1 || /\d/.test(t) || ws[0].length < 2 || /[*?]/.test(ws[0])) return null;
    const p = toPattern(ws[0], detectScript(ws[0]));
    return "error" in p ? null : p.greek;
  }, [t]);
  useEffect(() => {
    if (!greekWord) return;
    let live = true;
    const timer = setTimeout(async () => {
      const lsj = await lsjEntries(greekWord).catch(() => null);
      if (!live) return;
      if (!lsj) { setWord(null); return; }
      const core = await coreEntry(lsj.head).catch(() => null);
      if (live) setWord({ q: greekWord, head: lsj.head, def: core?.def ?? lsj.entries[0]?.s ?? "", rank: core?.rank ?? null });
    }, 180);
    return () => { live = false; clearTimeout(timer); };
  }, [greekWord]);

  const options = useMemo<Option[]>(() => {
    if (!t) return [];
    const out: Option[] = [];
    const e = encodeURIComponent(t);
    const hasDigit = /\d/.test(t);
    const script = detectScript(t);
    const greekOk = queryWords(t).every((w) => !("error" in toPattern(w, detectScript(w))));
    const shown = queryWords(t).map((w) => { const p = toPattern(w, detectScript(w)); return "error" in p ? w : p.greek; }).join(" ");

    // a passage: "Il. 1.1", "Plato Republic 514a", "John 3.16"
    if (idx && abbrevs && hasDigit) {
      for (const r of readReference(t, idx, abbrevs)) {
        out.push({ id: `ref:${r.work}`, group: "goto", kind: "Passage", href: `/read?w=${r.work}${r.at ? `&at=${encodeURIComponent(r.at)}` : ""}`, label: <><b>{r.label}</b> {r.at}</> });
      }
    }

    // the word, and searches of the Greek, come first when Greek letters are typed
    const wordOpts: Option[] = [];
    if (word && greekWord === word.q) {
      wordOpts.push({ id: `word:${word.head}`, group: "word", kind: word.rank ? `Word · core #${word.rank}` : "Word", greek: true,
        href: `/treasury/word?l=${encodeURIComponent(word.head)}`,
        label: <><b lang="grc">{word.head}</b> <span className={styles.muted}>{word.def || "in LSJ"}</span> <span className={styles.more}>Word Study →</span></> });
    }
    const greekSearches: Option[] = [];
    const acts = !hasDigit && t.length >= 2 ? matchActions(t) : [];
    // English that only asks for something to be done ("daylight") is not Greek in Latin letters
    if (greekOk && !hasDigit && !(script !== "greek" && acts.length)) {
      greekSearches.push({ id: "forms", group: "everywhere", kind: "Search the Greek", href: `/search?q=${e}`, label: <>for <b lang="grc">{shown}</b></>, greek: true });
      if (queryWords(t).length === 1) greekSearches.push({ id: "lemma", group: "everywhere", kind: "Every form of", href: `/search?m=lemma&q=${e}`, label: <b lang="grc">{shown}</b>, greek: true });
    }
    if (script === "greek") out.push(...wordOpts, ...greekSearches);

    // things to do: "daylight", "bigger text", "gentium"
    for (const a of acts) out.push({ id: `do:${a.id}`, group: "actions", kind: "Do it", run: a.id, label: <b>{a.label}</b> });

    if (t.length >= 3 && !hasDigit) {
      // places the texts name; a place named exactly ("sparta") comes before texts that mention it
      const placeOpts: Option[] = (places ? rank(places, t, (p) => ({ main: [shortName(p), p.grc, ...(p.also ?? [])] }), 4, 4) : []).map((p) => ({
        id: `pl:${p.id}`, group: "places" as const, kind: "On the map", href: `/stoa/periplus?p=${p.id}`,
        label: <><b>{shortName(p)}</b> <span lang="grc">{p.grc}</span> <span className={styles.muted}>{typeLabel(p.type)} · named {p.n.toLocaleString("en-GB")} times</span></> }));
      const exactPlace = placeOpts.length > 0 && places!.some((p) => [shortName(p), p.grc].some((n) => fold(n) === fold(t)));
      if (exactPlace) out.push(...placeOpts);
      // authors, then works (an author's name also brings up their best-known works)
      if (idx) {
        const authors = rank(idx.catalog.authors, t, (a) => ({ main: [a.name] }), 3, 2);
        const work = (w: { id: string; title: string }, a: { name: string }) =>
          out.push({ id: `w:${w.id}`, group: "texts", kind: "Text", href: `/read?w=${w.id}`, label: <><b>{w.title}</b> <span className={styles.muted}>{a.name}</span></> });
        const shownWorks = new Set<string>();
        authors.forEach((a, k) => {
          out.push({ id: `au:${a.id}`, group: "texts", kind: "Author", href: `/library/author?a=${a.id}`, label: <><b>{a.name}</b> <span className={styles.muted}>{a.works.length === 1 ? "1 work" : `${a.works.length} works`}</span></> });
          // the best-matching author's own works come right after their name
          if (k === 0) for (const w of a.works.slice(0, 4)) { work(w, a); shownWorks.add(w.id); }
        });
        const works = rank(idx.catalog.authors.flatMap((a) => a.works.filter((w) => !shownWorks.has(w.id)).map((w) => ({ w, a }))), t, ({ w, a }) => ({ main: [w.title, w.orig ?? ""], more: [`${a.name} ${w.title}`] }), 6 - Math.min(shownWorks.size, 4));
        for (const { w, a } of works) work(w, a);
      }
      // lessons and guides, then the Painted Stoa
      const found = rank(items, t, (x) => ({ main: [x.title, x.greek ?? ""], more: [x.about, ...(x.words ?? [])] }), 8);
      for (const x of found.filter((x) => x.kind !== "Painted Stoa").slice(0, 4)) out.push({ id: `ac:${x.href}`, group: "academy", kind: x.kind, href: x.href, label: <><b>{x.title}</b> <span className={styles.muted}>{x.about}</span></> });
      for (const x of found.filter((x) => x.kind === "Painted Stoa").slice(0, 4)) out.push({ id: `st:${x.href}`, group: "stoa", kind: "Painted Stoa", href: x.href, label: <><b>{x.title}</b> <span className={styles.muted}>{x.about}</span></> });
      if (!exactPlace) out.push(...placeOpts);
      // the site's own pages
      for (const p of rank(PAGES, t, (p) => ({ main: [p.title], more: [p.about] }), 3, 2)) out.push({ id: `pg:${p.href}`, group: "pages", kind: "Page", href: p.href, label: <><b>{p.title}</b> <span className={styles.muted}>{p.about}</span></> });
    }

    if (script !== "greek") out.push(...wordOpts, ...greekSearches);
    if (/[a-z]/i.test(t) && !hasDigit) {
      out.push({ id: "english", group: "everywhere", kind: "Search the translations", href: `/search?m=english&q=${e}`, label: <>for <b>{t}</b></> });
      out.push({ id: "wiki", group: "everywhere", kind: "Search the Painted Stoa", href: `/stoa?q=${e}`, label: <>for <b>{t}</b></> });
      if (FORUM_OPEN) out.push({ id: "forum", group: "everywhere", kind: "Search the Agora", href: `/town-hall?q=${e}`, label: <>for <b>{t}</b></> });
    }
    out.push({ id: "library", group: "everywhere", kind: "Search my library", href: `/search?m=library&q=${e}`, label: <>for <b>{t}</b></> });
    return out;
  }, [t, idx, abbrevs, items, places, word, greekWord]);

  const doAction = (id: ActionId) => {
    const s = useSettings.getState();
    switch (id) {
      case "theme-dark": s.set({ theme: "night" }); break;
      case "theme-light": s.set({ theme: "paper" }); break;
      case "theme-auto": s.set({ theme: "auto" }); break;
      // two steps (2 px) from the size on the screen now: from the size that suits the device, the first one saves a number (lib/greekSize.ts)
      case "bigger": s.set({ greekSize: steppedSize(s.greekSize, shownGreekSize().rem, 1, 2) }); break;
      case "smaller": s.set({ greekSize: steppedSize(s.greekSize, shownGreekSize().rem, -1, 2) }); break;
      case "motion-reduce": s.set({ motion: "reduce" }); break;
      case "motion-auto": s.set({ motion: "auto" }); break;
      case "settings": onClose(); useUI.getState().openSettings(); return;
    }
    useUI.getState().showToast(`${ACTIONS.find((a) => a.id === id)!.label}: done.`);
  };

  const choose = (o: Option | undefined) => {
    if (!o) return;
    if (t) setRecent(addRecentSearch(t));
    if (o.run) { doAction(o.run); return; }
    onClose();
    router.push(o.href!);
  };
  const go = (href: string) => { onClose(); router.push(href); };
  const cur = Math.min(sel, Math.max(0, options.length - 1));
  const pick = (s: string) => { setQ(s); setSel(0); requestAnimationFrame(() => input.current?.focus()); };

  // the on-screen Greek letters type at the caret, as on the Oracle's page
  const key = (k: string) => {
    const el = input.current;
    if (!el) return;
    const a = el.selectionStart ?? q.length, b = el.selectionEnd ?? q.length;
    const next = k === "Backspace" ? (a === b ? q.slice(0, Math.max(0, a - 1)) + q.slice(b) : q.slice(0, a) + q.slice(b)) : q.slice(0, a) + k + q.slice(b);
    const caret = k === "Backspace" ? (a === b ? Math.max(0, a - 1) : a) : a + k.length;
    setQ(next);
    setSel(0);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(caret, caret); });
  };

  // options in their groups, in the order they were found; numbering follows the flat list the arrow keys walk
  const groups: { id: GroupId; opts: { o: Option; i: number }[] }[] = [];
  options.forEach((o, i) => {
    const last = groups[groups.length - 1];
    if (last && last.id === o.group) last.opts.push({ o, i });
    else groups.push({ id: o.group, opts: [{ o, i }] });
  });

  return (
    <dialog ref={dialog} className={styles.dialog} aria-label="Quick search" onClose={onClose} data-overlay=""
      onClick={(e) => { if (e.target === dialog.current) onClose(); }}>
      <div className={styles.inner}>
        <div className={styles.head}>
        <svg className={styles.glass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
        {/* the Greek letters on screen, at the left beside the glass; the right end closes the search (the owner, 2026-10-25) */}
        <button type="button" className={styles.kbdBtn} lang="grc" aria-pressed={kbd} onClick={() => setKbd(!kbd)}
          onMouseDown={(e) => e.preventDefault()} aria-label="Greek letters on screen" title="Greek letters on screen">αβγ</button>
        <input ref={input} className={styles.input} autoFocus value={q} placeholder="A word, a passage, a subject…" aria-label="Search"
          role="combobox" aria-expanded={options.length > 0} aria-controls="qs-list" aria-activedescendant={options[cur] ? `qs-${cur}` : undefined}
          type="search" enterKeyHint="search" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((cur + 1) % Math.max(1, options.length)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setSel((cur - 1 + options.length) % Math.max(1, options.length)); }
            else if (e.key === "Enter") { e.preventDefault(); choose(options[cur]); }
          }} />
        {q && <button type="button" className={styles.clear} onClick={() => pick("")} aria-label="Clear the search">Clear</button>}
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close the search" title="Close (Esc)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        </div>
        <div className={styles.body}>
        {options.length > 0 ? (
          <div id="qs-list" role="listbox" aria-label="Results" className={styles.list}>
            {groups.map((g) => (
              <div key={`${g.id}-${g.opts[0].i}`} role="group" aria-labelledby={`qs-g-${g.opts[0].i}`} className={styles.group}>
                <div id={`qs-g-${g.opts[0].i}`} className={styles.groupTitle} role="presentation">{GROUP_TITLE[g.id]}</div>
                {g.opts.map(({ o, i }) => (
                  <div key={o.id} id={`qs-${i}`} role="option" aria-selected={i === cur} className={styles.opt} data-group={o.group}
                    onMouseEnter={() => setSel(i)} onClick={() => choose(o)}>
                    {!repeats(o.kind, GROUP_TITLE[g.id]) && <><span className={styles.kind}>{o.kind}</span> </>}<span className={styles.what}>{o.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.start}>
            {recent.length > 0 && (
              <section aria-labelledby="qs-recent">
                <div className={styles.startHead}>
                  <h2 id="qs-recent" className={styles.groupTitle}>Recent searches</h2>
                  <button type="button" className={styles.link} onClick={() => setRecent(clearRecentSearches())}>Clear</button>
                </div>
                <ul className={styles.chips}>
                  {recent.map((r) => (
                    <li key={r} className={styles.recent}>
                      <button type="button" className={styles.chip} onClick={() => pick(r)}>{r}</button>
                      <button type="button" className={styles.chipX} onClick={() => setRecent(removeRecentSearch(r))} aria-label={`Forget “${r}”`}>×</button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {visits.length > 0 && (
              <section aria-labelledby="qs-continue">
                <h2 id="qs-continue" className={styles.groupTitle}>Continue where you left off</h2>
                <ul className={styles.visits}>
                  {visits.map((v) => <li key={v.href}><button type="button" onClick={() => go(v.href)}>{v.title} <span aria-hidden="true">→</span></button></li>)}
                </ul>
              </section>
            )}
            <section aria-labelledby="qs-try">
              <h2 id="qs-try" className={styles.groupTitle}>Try</h2>
              <ul className={styles.chips}>
                {EXAMPLES.map((x) => <li key={x}><button type="button" className={styles.chip} onClick={() => pick(x)} lang={/[α-ω]/.test(x) ? "grc" : undefined}>{x}</button></li>)}
              </ul>
            </section>
            <p className={styles.help}>Type Greek, Latin letters or Beta Code, a reference such as <i>Il. 1.1</i>, an author or a work, a subject, a place, or what you want to do, such as <i>daylight</i>.<span className={styles.keys}> <kbd>↑</kbd> <kbd>↓</kbd> to choose, <kbd>Enter</kbd> to go, <kbd>Esc</kbd> to close.</span></p>
          </div>
        )}
        <a className={styles.full} href={AREAS.search.href} onClick={(e) => { e.preventDefault(); if (t) addRecentSearch(t); go(t ? `${AREAS.search.href}?q=${encodeURIComponent(t)}` : AREAS.search.href); }}>
          {AREAS.search.name}: the full search and research tools (grammar, concordance, statistics, constructions) <span aria-hidden="true">→</span>
        </a>
        </div>
        {kbd && <GreekKeyboard onKey={key} docked />}
      </div>
    </dialog>
  );
}

