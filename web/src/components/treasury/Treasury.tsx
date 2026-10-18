"use client";
/**
 * The Treasury (Mine): everything the reader has saved, in one place. Design A's "your things" page
 * (GOLD-AND-LAMPLIGHT-PLAN.md, page flow 9): its head with a search through everything kept, then by default the latest
 * notes and saved words, then the shelves as gilded windows (each kind of thing kept, with its count, and the visitor's
 * own shelves), the private collection, keeping it safe and reading offline. "Arrange" moves or hides any part, makes
 * shelves of one's own and picks the engraving; "Reset" brings back the default (lib/treasury-layout.ts).
 */
import Link from "next/link";
import { AREAS } from "@/config/areas";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AreaHeader from "@/components/AreaHeader";
import { Room } from "@/components/art/PageArt";
import { BLOCKS, useTreasuryLayout, type BlockId } from "@/lib/treasury-layout";
import { PIECE_CREDITS, USED_PIECES } from "@/data/pieces";
import engraved from "@/data/engraved.json";
import { useTreasury, plural } from "./data";
import { NotesSection, BookmarksSection, HighlightsSection, XrefsSection, RecentSection } from "./MarkSections";
import AnthologySection from "./AnthologySection";
import WordsSection from "./WordsSection";
import AuthorsSection from "./AuthorsSection";
import KeepSafe from "./KeepSafe";
import styles from "./Treasury.module.css";
import PlacesSection from "./PlacesSection";
import { loadSavedPlaces, useSavedPlaces } from "@/lib/map";
import NotebooksSection from "./NotebooksSection";
import PrivateShelf from "./PrivateShelf";
import { useNotebooks } from "@/lib/notebooks";

const ENGRAVED = engraved as Record<string, unknown>;
const PIECES = USED_PIECES.filter((id) => ENGRAVED[id] && PIECE_CREDITS[id]).map((id) => ({ id, title: PIECE_CREDITS[id].title })).sort((a, b) => a.title.localeCompare(b.title));

export type SectionId = "recent" | "notes" | "anthology" | "bookmarks" | "highlights" | "xrefs" | "words" | "authors" | "places" | "notebooks";

export default function Treasury() {
  const params = useSearchParams();
  const router = useRouter();
  const t = useTreasury();
  const { marks, deck, pageNotes } = t;
  const savedPlaces = Object.keys(useSavedPlaces((s) => s.saved)).length;
  const notebooks = Object.keys(useNotebooks((s) => s.books)).length;
  useEffect(() => { loadSavedPlaces(); }, []);
  const section = (params.get("s") ?? "recent") as SectionId;
  const L = useTreasuryLayout();
  useEffect(() => { useTreasuryLayout.persist.rehydrate(); }, []);
  const [q, setQ] = useState("");
  const [arranging, setArranging] = useState(false);
  const tags = useMemo(() => {
    const c = new Map<string, number>();
    for (const m of marks) if (m.kind === "note") for (const x of m.tags ?? []) c.set(x, (c.get(x) ?? 0) + 1);
    return c;
  }, [marks]);

  const counts = useMemo(() => {
    const k = (kind: string) => marks.filter((m) => m.kind === kind).length;
    return {
      notes: k("note"), anthology: k("favourite"), bookmarks: k("bookmark"), highlights: k("highlight"), xrefs: k("xref"),
      words: Object.values(deck).filter((c) => c.source === "saved").length,
      authors: Object.values(pageNotes).filter((n) => n.kind === "author").length,
    };
  }, [marks, deck, pageNotes]);

  const METOPES: { id: SectionId; label: string; n: number | null; hint: string }[] = [
    { id: "notes", label: "Notes", n: counts.notes, hint: "on passages" },
    { id: "anthology", label: "Anthology", n: counts.anthology, hint: "favourite passages" },
    { id: "bookmarks", label: "Bookmarks", n: counts.bookmarks, hint: "and where you stopped" },
    { id: "highlights", label: "Highlights", n: counts.highlights, hint: "in four colours" },
    { id: "xrefs", label: "Cross-references", n: counts.xrefs, hint: "between passages" },
    { id: "words", label: "Words", n: counts.words, hint: "saved, with Word Study" },
    { id: "authors", label: "Authors", n: counts.authors, hint: "your notes on them" },
    { id: "places", label: "Places", n: savedPlaces, hint: "on your own map" },
    { id: "notebooks", label: "Notebooks", n: notebooks, hint: "for research, cited" },
  ];
  const go = (id: SectionId) => {
    const q = new URLSearchParams(params.toString());
    if (id === "recent" || id === section) q.delete("s"); else q.set("s", id);
    for (const k of ["tag", "c", "a", "nb"]) q.delete(k);
    router.replace(`/treasury${q.size ? `?${q}` : ""}`, { scroll: false });
  };
  const empty = t.ready && !marks.length && !Object.keys(deck).length && !Object.keys(pageNotes).length && !savedPlaces && !notebooks;

  const search = (
    <div className="search-field" role="search">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
      <input type="search" enterKeyHint="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search everything you have kept" aria-label="Search Mine" />
    </div>
  );
  const piece = L.piece && PIECE_CREDITS[L.piece] ? { piece: L.piece } : undefined;

  const blocks: Record<BlockId, React.ReactNode> = {
    latest: section === "recent"
      ? <RecentSection t={t} />
      : (
        <div>
          <button type="button" className={styles.back} onClick={() => go(section)}>← Back to all of Mine</button>
          {section === "notes" && <NotesSection t={t} />}
          {section === "anthology" && <AnthologySection t={t} />}
          {section === "bookmarks" && <BookmarksSection t={t} />}
          {section === "highlights" && <HighlightsSection t={t} />}
          {section === "xrefs" && <XrefsSection t={t} />}
          {section === "words" && <WordsSection t={t} />}
          {section === "authors" && <AuthorsSection t={t} />}
          {section === "places" && <PlacesSection />}
          {section === "notebooks" && <NotebooksSection />}
        </div>
      ),
    shelves: (
      <nav aria-labelledby="shelves-h">
        <h2 id="shelves-h" className="label rooms-h">Your shelves</h2>
        <ul className="rooms">
          {METOPES.map((m) => (
            <li key={m.id}>
              <Room title={m.label} blurb={m.hint} className={section === m.id ? "room-on" : undefined}>
                <button type="button" className="room-open" aria-current={section === m.id ? "page" : undefined} onClick={() => go(m.id)}>
                  <span className="room-n">{m.n === null || empty ? "Nothing yet" : t.ready ? plural(m.n, "item") : "…"}</span>
                  <span className="visually-hidden">Open {m.label}</span>
                </button>
              </Room>
            </li>
          ))}
          {L.shelves.map((sh) => (
            <li key={sh.id}>
              <Room href={`/treasury?s=notes&tag=${encodeURIComponent(sh.tag)}`} title={sh.name} blurb={<>Your notes tagged #{sh.tag}</>}>
                <span className="room-n">{plural(tags.get(sh.tag) ?? 0, "note")}</span>
              </Room>
            </li>
          ))}
        </ul>
      </nav>
    ),
    private: <PrivateShelf />,
    keep: <KeepSafe t={t} compact={empty} summary={`${plural(marks.length, "mark")}, ${plural(Object.keys(pageNotes).length, "note")} on authors, words and the Painted Stoa, ${plural(Object.keys(deck).length, "word")} in your review deck, ${plural(savedPlaces, "saved place")}, ${plural(notebooks, "notebook")}`} />,
    offline: (
      // the Mine door also keeps what you download for reading offline (Phase 11: Downloads moved here from the footer)
      <Link className={styles.offline} href={AREAS.downloads.href} transitionTypes={["page-turn"]}>
        <span className="label">{AREAS.downloads.name} · {AREAS.downloads.english}</span>
        <b>Read without a connection</b>
        <span>Download the Greek and English texts once, then read them on a train, a plane or anywhere without a signal.</span>
      </Link>
    ),
  };

  return (
    <>
    <AreaHeader id="treasury" action={search} piece={piece} />
    <div className={`wrap ${styles.treasury}`}>
      {/* a Treasury with nothing in it opens with what to do about that */}
      {empty && (
        <div className={styles.welcome}>
          <p>Your Treasury is empty so far. Open a text in <Link href="/library" transitionTypes={["page-turn"]}>the Mouseion</Link>, then
            select some Greek words, or click a passage number, to bookmark it, add it to your anthology, highlight it or write a note.
            Click any word to look it up, and press <b>Save word</b> to keep it here.</p>
          <Link className="btn" href={AREAS.library.href} transitionTypes={["page-turn"]}>Open the Mouseion</Link>
        </div>
      )}
      {t.error && <p className={styles.error} role="alert">{t.error}</p>}

      <div className={styles.arrangeBar}>
        <button type="button" className="btn ghost" aria-expanded={arranging} onClick={() => setArranging(!arranging)}>{arranging ? "Done arranging" : "Arrange"}</button>
      </div>
      {arranging && (
        <section className={styles.arrange} aria-label="Arrange Mine">
          <p className="label">The parts of this page, top to bottom</p>
          <ol>
            {L.order.map((id, i) => (
              <li key={id} data-hidden={L.hidden.includes(id) ? "" : undefined}>
                <span>{BLOCKS[id]}</span>
                <button type="button" className="chip" onClick={() => L.move(id, -1)} disabled={i === 0} aria-label={`Move ${BLOCKS[id]} up`}>↑</button>
                <button type="button" className="chip" onClick={() => L.move(id, 1)} disabled={i === L.order.length - 1} aria-label={`Move ${BLOCKS[id]} down`}>↓</button>
                <button type="button" className="chip" aria-pressed={!L.hidden.includes(id)} onClick={() => L.toggle(id)}>{L.hidden.includes(id) ? "Hidden" : "Shown"}</button>
              </li>
            ))}
          </ol>
          <OwnShelfForm tags={[...tags.keys()]} />
          {L.shelves.length > 0 && (
            <ul className={styles.ownList}>
              {L.shelves.map((sh) => <li key={sh.id}><span>{sh.name} <small>#{sh.tag}</small></span><button type="button" className="chip" onClick={() => L.removeShelf(sh.id)}>Remove</button></li>)}
            </ul>
          )}
          <label className={styles.pick}>
            <span className="label">The engraving at the top</span>
            <select value={L.piece ?? ""} onChange={(e) => L.setPiece(e.target.value || null)}>
              <option value="">Mine’s own</option>
              {PIECES.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </label>
          <button type="button" className="btn ghost" onClick={() => L.reset()}>Reset to the default</button>
        </section>
      )}

      {q.trim()
        ? <section className={styles.section}><RecentSection t={t} query={q} /></section>
        : L.order.filter((id) => !L.hidden.includes(id)).map((id) => (
          <section key={id === "latest" ? `latest-${section}` : id} className={styles.section} aria-live={id === "latest" ? "polite" : undefined}>{blocks[id]}</section>
        ))}
    </div>
    </>
  );
}

/** Make a shelf of one's own: a name, and the tag of the notes it gathers. */
function OwnShelfForm({ tags }: { tags: string[] }) {
  const add = useTreasuryLayout((s) => s.addShelf);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  return (
    <form className={styles.ownForm} onSubmit={(e) => { e.preventDefault(); if (name.trim() && tag.trim()) { add(name, tag); setName(""); setTag(""); } }}>
      <span className="label">Make a shelf of your own: it gathers your notes with one tag</span>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Its name, e.g. Courage" aria-label="Shelf name" />
      <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="The tag, e.g. courage" aria-label="Tag" list="own-shelf-tags" />
      <datalist id="own-shelf-tags">{tags.map((x) => <option key={x} value={x} />)}</datalist>
      <button type="submit" className="btn">Add the shelf</button>
    </form>
  );
}
