"use client";
/**
 * A returning visitor's desk, in the place of "Where are you starting?" (which a returning visitor has already answered):
 * carry on where you left off and the next lesson, all from what this device remembers (lib/resume.ts,
 * lib/position.ts, lib/academy.ts), set as a short table under a rule of ink. Below, the other recent pages. Which of the
 * two the home page shows is decided before the first paint (lib/visitor.ts, data-visitor on <html>).
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { trail, clearTrail, pageKey, type Visit } from "@/lib/resume";
import { recentPositions, shownAt } from "@/lib/position";
import { useAcademy } from "@/lib/academy";
import { RESTORE, ago, describe, resumeHref } from "@/components/Resume";
import s from "./Home.module.css";
import { TRACKS, begun, nextSteps } from "@/data/tracks";

const remember = (href: string) => { try { sessionStorage.setItem(RESTORE, pageKey(href)); } catch { /* ignore */ } };

export default function HomeDesk() {
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [books, setBooks] = useState<[string, { at: string; t: number }][]>([]);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const completed = useAcademy((st) => st.completed);
  useEffect(() => {
    // storage is only available in the browser: read it after the first paint
    const t = setTimeout(() => {
      // (an address that led nowhere, noted before such visits were left out of the trail, is not offered either)
      setVisits(trail().filter((v) => v.href !== "/" && v.title !== "Not found"));
      setBooks(recentPositions(4));
      useAcademy.persist.rehydrate();
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

  // the next lesson, the same as the Learn page's next step (data/tracks.ts): the reading path's, then the grammar course's
  const started = begun(completed);
  const { main, also } = nextSteps(completed);
  const alsoRecent = (visits ?? []).slice(1).filter((v) => !v.href.startsWith("/read")).slice(0, 3);
  // the lesson "Carry on" already opens is not offered again as the next lesson
  const lastPath = last ? new URL(last.href, "http://x").pathname : undefined;
  const lessonRow = !(main && lastPath === main.step.href);

  return (
    // (the section it stands in is "Your desk", by its heading: this part is not named again)
    <div className={s.desk}>
      <div className={s.drows}>
        <div className={s.drow}>
          <span className={s.dlabel}>Carry on</span>
          <div>
            {last && lastD ? (
              <><Link href={resumeHref(last)} onClick={() => remember(last.href)} transitionTypes={["page-turn"]}><b>{lastD.what}</b></Link>
                <small>{lastD.where ? `${lastD.where} · ` : ""}{ago(last.t)}</small></>
            ) : books[0] ? (
              <><Link href={bookHref(books[0][0], books[0][1].at)} transitionTypes={["page-turn"]}><b>{workName(books[0][0])}</b></Link>{shownAt(books[0][1].at) && <> <small>at {books[0][1].at}</small></>}</>
            ) : (
              <>{visits ? "Nothing open yet. " : "… "}<Link href="/library" transitionTypes={["page-turn"]}>Find something to read →</Link></>
            )}
            {otherBooks.length > 0 && (
              <ul aria-label="Also in progress">
                {otherBooks.map(([w, p]) => (
                  <li key={w}><Link href={bookHref(w, p.at)} transitionTypes={["page-turn"]}><i>{workName(w)}</i></Link>{shownAt(p.at) && <> <small>at {p.at}</small></>}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {lessonRow && <div className={s.drow}>
          <span className={s.dlabel}>{main ? (started.reading || started.grammar ? "Your next lesson" : "The first lesson") : "The lessons"}</span>
          <div>
            {main ? (
              <><b>{main.step.title}</b>{" "}
                <Link href={main.step.href} transitionTypes={["page-turn"]}>Open the lesson →</Link>
                <small>{main.track} · {main.step.place} · {main.step.size}</small>
                {also && <small>And in {TRACKS.grammar.name.toLowerCase()}, {also.place}: <Link href={also.href} transitionTypes={["page-turn"]}>{also.title} →</Link></small>}</>
            ) : (
              <><b>Every lesson done</b> <Link href="/library" transitionTypes={["page-turn"]}>Read on in the library →</Link></>
            )}
          </div>
        </div>}
      </div>
      {alsoRecent.length > 0 && (
        <p className={s.dalso}>
          <span className={s.dlabel}>Also recently</span>{" "}
          {alsoRecent.map((v, i) => (
            <span key={v.href}>{i > 0 && " · "}<Link href={resumeHref(v)} onClick={() => remember(v.href)} transitionTypes={["page-turn"]}>{describe(v, idx).what}</Link></span>
          ))}
          {" "}<button type="button" onClick={() => { clearTrail(); setVisits([]); }}>Forget these pages</button>
        </p>
      )}
    </div>
  );
}
