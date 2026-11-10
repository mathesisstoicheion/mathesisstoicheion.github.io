import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import PageHead from "@/components/PageHead";
import { trail } from "@/config/areas";
import { ARTICLES } from "@/wiki/author-articles-all";
import type { Catalog } from "@/lib/catalog";
import { ERAS } from "@/lib/authors-meta";
import { editionRows } from "@/lib/editions";
import SideScroll from "./SideScroll";
import { REF_PAGES, type RefId } from "./refPages";
import styles from "./RefHead.module.css";

const num = (n: number) => n.toLocaleString("en-GB");

/** What each reference page holds, counted from the catalogue and the author articles (never typed in). */
function counts(): Record<RefId, string> {
  const catalog = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
  const accounts = Object.keys(ARTICLES).length;
  const texts = editionRows(catalog).length;
  return {
    authors: `${num(catalog.authors.length)} authors`,
    eras: `${num(ERAS.length)} periods`,
    manuscripts: `${num(accounts)} accounts`,
    editions: `${num(texts)} ${texts === 1 ? "text" : "texts"}`,
    variants: `${num(accounts)} accounts`,
  };
}

/** The reference shelf: the five reference pages with a count each; the current one marked with a red rule. */
function Shelf({ here }: { here: RefId }) {
  const n = counts();
  return (
    <nav className={styles.shelf} aria-label="Reference pages">
      <p className="label">The reference shelf</p>
      <SideScroll className={styles.row}>
        <ul>
          {REF_PAGES.map((p) => (
            <li key={p.id}>
              <Link href={p.href} className={styles.item} aria-current={p.id === here ? "page" : undefined} transitionTypes={["page-turn"]}>
                <span className={styles.name}>{p.title}</span>
                <span className={styles.greek} lang="grc">{p.greek}</span>
                <span className={styles.count}>{n[p.id]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </SideScroll>
    </nav>
  );
}

/** The head of a Stoa reference page (Authors, Eras, Editions…): its path, its title and what it is for (PageHead); with `here`, the reference shelf fills its right side. */
export default function RefHead({ title, greek, here, children }: { title?: string; greek?: string; here?: RefId; children: React.ReactNode }) {
  const page = REF_PAGES.find((p) => p.id === here);
  const t = title ?? page?.title ?? "";
  return <PageHead path={trail("wiki", t)} title={t} greek={greek ?? page?.greek} purpose={children} side={here ? <Shelf here={here} /> : undefined} />;
}
