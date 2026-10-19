"use client";
/**
 * The library's famous books (design A): two groups of three, each book a row with its emblem, its picture drawn in
 * letters (lib/a/lamplight.js, Letters), which wakes and glints while the pointer is on the row. Socrates' emblem is spelled
 * out of the Apology itself. Each row opens its book in the reader. While a search or a filter is on, the famous books stand
 * aside, so the catalogue's answers come up right under the search.
 */
import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import { emblem } from "@/lib/a/lamplight";
import { useLibQuery } from "@/components/library/libQuery";
import SettleText from "./SettleText";
import s from "./a.module.css";

export interface Book { id: string; author: string; title: string; greek: string; pic: string; why: string; english: boolean }

function BookRow({ b }: { b: Book }) {
  const row = useRef<HTMLAnchorElement>(null), cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const a = row.current, c = cv.current;
    if (!a || !c) return;
    let hot = false, art: { stop(): void; wake(): void } | null = null, gone = false;
    const on = () => { hot = true; art?.wake(); }, off = () => { hot = false; art?.wake(); };
    emblem(c, `/images/a/em-${b.pic}.png`, { mode: "row", cols: 28, width: () => (innerWidth < 860 ? 72 : 92), isHot: () => hot, text: b.pic === "socrates-louvre" })
      .then((r) => { if (gone) r?.stop(); else art = r; });
    a.addEventListener("pointerenter", on); a.addEventListener("pointerleave", off); a.addEventListener("focus", on); a.addEventListener("blur", off);
    return () => { gone = true; art?.stop(); a.removeEventListener("pointerenter", on); a.removeEventListener("pointerleave", off); a.removeEventListener("focus", on); a.removeEventListener("blur", off); };
  }, [b.pic]);
  return (
    <Link ref={row} className={s.book} href={`/read?w=${b.id}`} transitionTypes={["page-turn"]}>
      <canvas ref={cv} aria-hidden="true" />
      <div><div className={`${s.who} ${s.mono}`}>{b.author}</div><div className={s.tt}>{b.title}</div>{b.greek && <span className={s.gt} lang="grc">{b.greek}</span>}</div>
      <p className={s.why}>{b.why}</p>
      <span className={`${s.tag} ${s.mono}`}>{b.english ? "Greek + English" : "Greek"}</span>
    </Link>
  );
}

export default function Featured({ groups, between, after }: { groups: { name: string; books: Book[] }[]; between?: React.ReactNode; after?: React.ReactNode }) {
  const aside = useLibQuery((x) => !!x.q.trim() || x.tr !== "all");
  if (aside) return null;
  return (
    <section aria-label="Famous books to begin with" style={{ display: "contents" }}>
      {groups.map((g, i) => (
        <Fragment key={g.name}>
          {i > 0 && between}
          <div className={s.wrap}><div className={s.blk}>
            <div className={s["grp-h"]}><SettleText className={s.mono} text={g.name} /><span className={s.mono}>{g.books.length} works</span></div>
            <div className={s.books}>{g.books.map((b) => <BookRow key={b.id} b={b} />)}</div>
            {i === groups.length - 1 && after}
          </div></div>
        </Fragment>
      ))}
    </section>
  );
}
