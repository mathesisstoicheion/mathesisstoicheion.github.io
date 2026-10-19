"use client";
/**
 * A returning visitor's desk, in the place of design A's "Where are you starting?" (which a returning visitor has already
 * answered): carry on where you left off, today's practice and the next lesson, all from what this device remembers
 * (lib/resume.ts, lib/position.ts, lib/academy.ts), in A's panel. Below, the other recent pages. Which of the two the
 * home page shows is decided before the first paint (lib/visitor.ts, data-visitor on <html>).
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { trail, clearTrail, pageKey, type Visit } from "@/lib/resume";
import { recentPositions } from "@/lib/position";
import { useAcademy, dueCards, type DeckCard } from "@/lib/academy";
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
import { RESTORE, ago, describe, resumeHref } from "@/components/Resume";
import s from "./a.module.css";

const remember = (href: string) => { try { sessionStorage.setItem(RESTORE, pageKey(href)); } catch { /* ignore */ } };

export default function HomeDesk() {
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [books, setBooks] = useState<[string, { at: string; t: number }][]>([]);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [ready, setReady] = useState(false);
  const deck = useAcademy((st) => st.deck);
  const completed = useAcademy((st) => st.completed);
  useEffect(() => {
    // storage is only available in the browser: read it after the first paint
    const t = setTimeout(() => {
      setVisits(trail().filter((v) => v.href !== "/"));
      setBooks(recentPositions(4));
      Promise.resolve(useAcademy.persist.rehydrate()).then(() => setReady(true));
    }, 0);
    loadCatalog().then(setIdx, () => undefined);
    return () => clearTimeout(t);
  }, []);

  const last = visits?.[0];
  const lastD = last ? describe(last, idx) : null;
  const lastWork = last && new URL(last.href, "http://x").pathname === "/read" ? new URL(last.href, "http://x").searchParams.get("w") : null;
  // the book the main link opens (the last page read, or else the last book) is not listed again under it
  const mainWork = last ? lastWork : books[0]?.[0] ?? null;
  const otherBooks = books.filter(([w]) => w !== mainWork).slice(0, 2);
  const workName = (w: string) => { const wk = idx?.work.get(w), a = idx?.authorOf.get(w); return wk ? `${a ? `${a.name}, ` : ""}${wk.title}` : w; };
  const bookHref = (w: string, at: string) => `/read?w=${w}&at=${encodeURIComponent(at)}`;

  const due: DeckCard[] = ready ? dueCards(deck) : [];
  const deckSize = Object.keys(deck).length;
  const nextLesson = LESSONS.findIndex((l) => !completed[l.id]);
  const done = Object.keys(completed).filter((id) => LESSONS.some((l) => l.id === id)).length;
  const alsoRecent = (visits ?? []).slice(1).filter((v) => !v.href.startsWith("/read")).slice(0, 3);

  return (
    <section className={`${s.paths} ${s.desk}`} aria-labelledby="desk-title">
      <h2 id="desk-title" className={`${s["paths-label"]} ${s.mono}`}>Your desk</h2>
      <div className={s.drows}>
        <div className={s.drow}>
          <span className={s.mono}>Carry on</span>
          <div>
            {last && lastD ? (
              <><Link href={resumeHref(last)} onClick={() => remember(last.href)} transitionTypes={["page-turn"]}><b>{lastD.what}</b></Link>
                <small>{lastD.where ? `${lastD.where} · ` : ""}{ago(last.t)}</small></>
            ) : books[0] ? (
              <><Link href={bookHref(books[0][0], books[0][1].at)} transitionTypes={["page-turn"]}><b>{workName(books[0][0])}</b></Link> <small>at {books[0][1].at}</small></>
            ) : (
              <>{visits ? "Nothing open yet. " : "… "}<Link href="/library" transitionTypes={["page-turn"]}>Find something to read →</Link></>
            )}
            {otherBooks.length > 0 && (
              <ul aria-label="Also in progress">
                {otherBooks.map(([w, p]) => (
                  <li key={w}><Link href={bookHref(w, p.at)} transitionTypes={["page-turn"]}><i>{workName(w)}</i></Link> <small>at {p.at}</small></li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={s.drow}>
          <span className={s.mono}>Today&apos;s practice</span>
          <div>
            {!ready ? "…" : due.length > 0 ? <b>{due.length} {due.length === 1 ? "word" : "words"} to review</b>
              : deckSize > 0 ? <b>All done for today</b> : <>Your pile is empty</>}{" "}
            <Link href="/academy/today" transitionTypes={["page-turn"]}>{due.length ? "Start" : "Practise anyway"} →</Link>
            {ready && deckSize === 0 && <small>Save a word from the reader or a lesson, and it comes back here for practice.</small>}
          </div>
        </div>
        <div className={s.drow}>
          <span className={s.mono}>{nextLesson >= 0 ? (done ? "Your next lesson" : "The first lesson") : "The lessons"}</span>
          <div>
            {nextLesson >= 0 ? (
              <><b>{LESSONS[nextLesson].title}</b>{" "}
                <Link href={`/academy/lesson/${LESSONS[nextLesson].id}`} transitionTypes={["page-turn"]}>Open the lesson →</Link>
                <small>Lesson {nextLesson + 1} of {LESSONS.length} · about {LESSONS[nextLesson].minutes} minutes{done ? ` · ${done} done` : ""}</small></>
            ) : (
              <><b>All {LESSONS.length} lessons done</b> <Link href="/academy" transitionTypes={["page-turn"]}>The Academy →</Link></>
            )}
          </div>
        </div>
      </div>
      {alsoRecent.length > 0 && (
        <p className={s.dalso}>
          <span className={s.mono}>Also recently</span>{" "}
          {alsoRecent.map((v, i) => (
            <span key={v.href}>{i > 0 && " · "}<Link href={resumeHref(v)} onClick={() => remember(v.href)} transitionTypes={["page-turn"]}>{describe(v, idx).what}</Link></span>
          ))}
          {" "}<button type="button" onClick={() => { clearTrail(); setVisits([]); }}>Forget these pages</button>
        </p>
      )}
    </section>
  );
}
