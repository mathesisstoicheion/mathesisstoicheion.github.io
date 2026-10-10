"use client";
/**
 * A returning visitor's home page opens on their desk (Phase 11): carry on where you left off, today's practice and
 * the next lesson, all from what this device remembers (lib/resume.ts, lib/position.ts, lib/academy.ts). Below it,
 * the other recent pages, as "Continue where you left off" offered before.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { trail, clearTrail, pageKey, type Visit } from "@/lib/resume";
import { recentPositions } from "@/lib/position";
import { useAcademy, dueCards, type DeckCard } from "@/lib/academy";
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
import { RESTORE, ago, describe, resumeHref } from "@/components/Resume";
import styles from "./Start.module.css";

const remember = (href: string) => { try { sessionStorage.setItem(RESTORE, pageKey(href)); } catch { /* ignore */ } };

export default function Desk() {
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [books, setBooks] = useState<[string, { at: string; t: number }][]>([]);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [ready, setReady] = useState(false);
  const deck = useAcademy((s) => s.deck);
  const completed = useAcademy((s) => s.completed);
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
  // the book the big link opens (the last page read, or else the last book) is not listed again below it
  const mainWork = last ? lastWork : books[0]?.[0] ?? null;
  const otherBooks = books.filter(([w]) => w !== mainWork).slice(0, 2);
  const workName = (w: string) => { const wk = idx?.work.get(w), a = idx?.authorOf.get(w); return wk ? `${a ? `${a.name}, ` : ""}${wk.title}` : w; };

  const due: DeckCard[] = ready ? dueCards(deck) : [];
  const deckSize = Object.keys(deck).length;
  const nextLesson = LESSONS.findIndex((l) => !completed[l.id]);
  const done = Object.keys(completed).filter((id) => LESSONS.some((l) => l.id === id)).length;
  const alsoRecent = (visits ?? []).slice(1).filter((v) => !v.href.startsWith("/read")).slice(0, 3);

  return (
    <section className={styles.deskWrap} aria-labelledby="desk-title">
      <span className="label">Welcome back</span>
      <h2 id="desk-title" className={styles.deskTitle}>Your desk</h2>
      <div className={styles.desk}>
        {/* 1. carry on */}
        <div className={`${styles.dcard} ${styles.dmain}`}>
          <span className="label">Carry on where you left off</span>
          {last && lastD ? (
            <>
              <Link href={resumeHref(last)} onClick={() => remember(last.href)} className={styles.dlink} transitionTypes={["page-turn"]}>
                <b className={styles.dbig}>{lastD.what}</b>
              </Link>
              {lastD.where && <span className={styles.dsub}>{lastD.where}</span>}
              <span className={styles.dsub}>{ago(last.t)}</span>
            </>
          ) : books[0] ? (
            <Link href={`/read?w=${books[0][0]}&at=${encodeURIComponent(books[0][1].at)}`} className={styles.dlink} transitionTypes={["page-turn"]}>
              <b className={styles.dbig}>{workName(books[0][0])}</b> <span className={styles.dsub}>at {books[0][1].at}</span>
            </Link>
          ) : (
            <span className={styles.dsub}>{visits ? "Nothing open yet." : "…"}</span>
          )}
          {otherBooks.length > 0 && (
            <ul className={styles.dbooks} aria-label="Also in progress">
              {otherBooks.map(([w, p]) => (
                <li key={w}><Link href={`/read?w=${w}&at=${encodeURIComponent(p.at)}`} transitionTypes={["page-turn"]}><i>{workName(w)}</i></Link> <small>at {p.at}</small></li>
              ))}
            </ul>
          )}
          <span className={styles.dgo}>
            {last
              ? <Link className="btn" href={resumeHref(last)} onClick={() => remember(last.href)} transitionTypes={["page-turn"]}>Carry on <span className="arr" aria-hidden="true">→</span></Link>
              : books[0]
                ? <Link className="btn" href={`/read?w=${books[0][0]}&at=${encodeURIComponent(books[0][1].at)}`} transitionTypes={["page-turn"]}>Carry on <span className="arr" aria-hidden="true">→</span></Link>
                : <Link className="btn" href="/library" transitionTypes={["page-turn"]}>Find something to read <span className="arr" aria-hidden="true">→</span></Link>}
          </span>
        </div>

        {/* 2. today's practice */}
        <div className={styles.dcard}>
          <span className="label">Today&apos;s practice</span>
          {!ready ? <span className={styles.dsub}>…</span>
            : due.length > 0 ? (
              <>
                <b className={styles.dmid}>{due.length} {due.length === 1 ? "word" : "words"} to review</b>
                <span className={styles.stack} aria-hidden="true">
                  {due.slice(0, 3).reverse().map((c) => <span key={c.id} lang="grc">{c.lemma}</span>)}
                </span>
                <span className={styles.dsub}>A few minutes, then they come back when you are about to forget them.</span>
              </>
            ) : deckSize > 0 ? (
              <>
                <b className={styles.dmid}>All done for today</b>
                <span className={styles.dsub}>{deckSize} {deckSize === 1 ? "word" : "words"} in your pile; they come back when they are due.</span>
              </>
            ) : (
              <>
                <b className={styles.dmid}>Your pile is empty</b>
                <span className={styles.dsub}>Save a word from the reader or a lesson, and it comes back here for practice.</span>
              </>
            )}
          <span className={styles.dgo}>
            <Link className="btn small" href="/academy/today" transitionTypes={["page-turn"]}>{due.length ? "Start" : "Practise anyway"} <span className="arr" aria-hidden="true">→</span></Link>
          </span>
        </div>

        {/* 3. the next lesson */}
        <div className={styles.dcard}>
          <span className="label">{nextLesson >= 0 ? (done ? "Your next lesson" : "The first lesson") : "The lessons"}</span>
          {nextLesson >= 0 ? (
            <>
              <b className={styles.dmid}>{LESSONS[nextLesson].title}</b>
              <span className={styles.dsub}>Lesson {nextLesson + 1} of {LESSONS.length} · about {LESSONS[nextLesson].minutes} minutes{done ? ` · ${done} done` : ""}</span>
              <span className={styles.dgo}>
                <Link className="btn small ghost" href={`/academy/lesson/${LESSONS[nextLesson].id}`} transitionTypes={["page-turn"]}>Open the lesson <span className="arr" aria-hidden="true">→</span></Link>
              </span>
            </>
          ) : (
            <>
              <b className={styles.dmid}>All {LESSONS.length} lessons done</b>
              <span className={styles.dsub}>Keep them fresh with the tables and the practice.</span>
              <span className={styles.dgo}><Link className="btn small ghost" href="/academy" transitionTypes={["page-turn"]}>The Academy <span className="arr" aria-hidden="true">→</span></Link></span>
            </>
          )}
        </div>
      </div>

      {alsoRecent.length > 0 && (
        <p className={styles.also}>
          <span className="label">Also recently</span>{" "}
          {alsoRecent.map((v, i) => (
            <span key={v.href}>{i > 0 && " · "}<Link href={resumeHref(v)} onClick={() => remember(v.href)} transitionTypes={["page-turn"]}>{describe(v, idx).what}</Link></span>
          ))}
          {" "}<button type="button" className={styles.forget} onClick={() => { clearTrail(); setVisits([]); }}>Forget these pages</button>
        </p>
      )}
    </section>
  );
}
