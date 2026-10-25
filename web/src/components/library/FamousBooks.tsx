/**
 * Six famous books, on the home page (the owner, 2026-10-25: "move '6 famous works' to the start page"), set as a printed
 * catalogue sets them (redesign decision 11): numbered entries in two groups, the author in small capitals, the title in
 * italic, its Greek title under it, each a way straight into the reader. No photographs: the owner wants pictures only
 * where they teach.
 */
import Link from "next/link";
import styles from "./Library.module.css";

/** `about` is one line on the work itself. */
export interface Book { id: string; group: string; author: string; title: string; greek: string; about: string; english: boolean }

/** The books are numbered in Greek, as a printed catalogue of Greek books might number them. */
const NUM = ["α´", "β´", "γ´", "δ´", "ε´", "ϛ´", "ζ´", "η´", "θ´"];

export default function FamousBooks({ books }: { books: Book[] }) {
  if (!books.length) return null;
  const groups = [...new Set(books.map((b) => b.group))];
  return (
    <div className={styles.list}>
      {groups.map((g) => (
        <div key={g} className={styles.grp} role="group" aria-label={g}>
          <h3 className={styles.grpH}>{g}</h3>
          {books.map((x, i) => x.group === g && (
            <Link key={x.id} href={`/read?w=${x.id}`} transitionTypes={["page-turn"]} className={styles.book}>
              <span className={styles.bookNo} lang="grc">{NUM[i]}</span>
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
  );
}
