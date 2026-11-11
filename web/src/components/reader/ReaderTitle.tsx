"use client";
/**
 * The one-line title a book opens on, every time but the first (the quiet desk, ticket 08, the owner, 2026-10-30; mockup B): at the top
 * of the text column, in line with the Greek, the Greek title in the Greek face and in ink, then "· Homer, Iliad, Book 1" in the body
 * face and in ink-2; the first passage follows straight under it. The author's name is a quiet link to the author's page, on a phone too
 * (the quiet desk, ticket 09, the owner, 2026-10-30: with no bar along the top, this is the one way to the author's page; there is no "About Homer"
 * row in Study). The book's title page (ReaderCover.tsx) stands in its place the first time the book is opened on this device (lib/opened.ts).
 */
import Link from "next/link";
import Icon from "@/components/Icon";
import { AREAS } from "@/config/areas";
import { greekTitle } from "./ReaderCover";
import styles from "./Reader.module.css";

export default function ReaderTitle({ title, greek, author, authorId, page, lines, only = false }: {
  title: string; greek?: string | null; author?: string; authorId?: string;
  /** a book of the private collection: a lock after the line says that only the reader can see it (it stood in the old top bar) */
  only?: boolean;
  /** which part of the work this page is, as the page's name says ("Book 1") */
  page: string;
  /** the first passage under it shows its Greek in lines of verse, whose words start past the line numbers' column: so does the title */
  lines: boolean;
}) {
  const big = greekTitle(greek);
  return (
    <div className={`wrap ${styles.rlWrap} enter`}>
      <h1 className={styles.rl} data-title-line="" data-lines={lines || undefined}>
        {big && <><span lang="grc" className={styles.rlGr}>{big}</span><span aria-hidden="true"> · </span></>}
        {author && (
          <span className={styles.rlAuthor}>
            {authorId ? <Link href={`${AREAS.library.href}/author?a=${authorId}`} transitionTypes={["page-turn"]}>{author}</Link> : author},{" "}
          </span>
        )}
        {big !== title && `${title}, `}{page}
        {only && <span className={styles.rlLock} role="img" aria-label="Only you can see this" title="Only you can see this"><Icon name="lock" /></span>}
      </h1>
    </div>
  );
}
