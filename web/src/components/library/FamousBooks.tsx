"use client";
/**
 * The library's famous books, set as the sample's catalogue sets them (redesign decision 11): numbered entries in two groups,
 * the author in small capitals, the title in italic, its Greek title under it. Pointing at one, or moving to it with the
 * keyboard, shows its photograph as a plate in the margin, with its credit; on a phone the margin gives way to a small
 * picture in each row, credited in the page's list of plates. While a search is on they stand aside, so the catalogue's
 * answers come up right under the search.
 */
import Link from "next/link";
import { useState } from "react";
import MarginPlate from "@/components/plate/MarginPlate";
import { photo } from "@/lib/photos";
import { plateNo } from "@/data/library-plates";
import { useLibQuery } from "./libQuery";
import styles from "./Library.module.css";

/** `about` is one line on the work itself; `pic` its photograph (data/library-plates.ts) and `why` why it belongs. */
export interface Book { id: string; group: string; author: string; title: string; greek: string; about: string; english: boolean; pic: string; why?: string }

/** The books are numbered in Greek, as a printed catalogue of Greek books might number them. */
const NUM = ["α´", "β´", "γ´", "δ´", "ε´", "ϛ´", "ζ´", "η´", "θ´"];

export default function FamousBooks({ books }: { books: Book[] }) {
  const aside = useLibQuery((x) => !!x.q.trim());
  // at first, Socrates' (the sample's): the library's best-known face
  const [lit, setLit] = useState(() => Math.max(0, books.findIndex((b) => b.pic === "socrates-louvre")));
  if (aside || !books.length) return null;
  const groups = [...new Set(books.map((b) => b.group))];
  const b = books[lit] ?? books[0];
  return (
    <section className={`wrap ${styles.famous}`} aria-label="Famous books to begin with">
      <div className={styles.cat}>
        <aside className={styles.margin} aria-label="The plate of the book pointed at"><MarginPlate id={b.pic} n={plateNo(b.pic)} why={b.why} /></aside>
        <div className={styles.list}>
          <h2 className={styles.secLabel}>Six famous books</h2>
          {groups.map((g) => (
            <div key={g} className={styles.grp} role="group" aria-label={g}>
              <h3 className={styles.grpH}>{g}</h3>
              {books.map((x, i) => x.group === g && (
                <Link key={x.id} href={`/read?w=${x.id}`} transitionTypes={["page-turn"]} className={styles.book} data-lit={i === lit ? "" : undefined}
                  onPointerEnter={() => setLit(i)} onFocus={() => setLit(i)}>
                  <span className={styles.bookNo} lang="grc">{NUM[i]}</span>
                  <BookPic id={x.pic} />
                  <span className={styles.bookText}>
                    <span className={styles.au}>{x.author}</span>
                    <span className={styles.ti}>{x.title}</span>
                    {x.greek && <span className={styles.gt} lang="grc">{x.greek}</span>}
                    <span className={styles.about}>{x.about}</span>
                  </span>
                  <span className={styles.bookGo}>{x.english ? "Greek and English" : "Greek"} <span aria-hidden="true">→</span></span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A book's small picture, for phones (credited in the page's list of plates). */
function BookPic({ id }: { id: string }) {
  const p = photo(id);
  if (!p) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={styles.bookPic} src={p.width > 320 ? `/images/w320/${p.file}` : `/images/${p.file}`} alt="" width={64} height={84} loading="lazy" decoding="async" data-photo={id} />;
}
