import type { Metadata } from "next";
import { Suspense } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import Library from "@/components/library/Library";
import MineButtons from "@/components/library/MineButtons";
import BeginHere from "@/components/library/BeginHere";
import FamousBooks, { type Book } from "@/components/library/FamousBooks";
import LibSearch from "@/components/a/LibSearch";
import { PlateList } from "@/components/plate/Plate";
import { AREAS, areaTitle } from "@/config/areas";
import { hasTranslation, greekEditions, type Catalog } from "@/lib/catalog";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import { MEDALLIONS } from "@/data/medallions";
import { LIBRARY_PLATES, WORK_PLATES } from "@/data/library-plates";
import { PATHS } from "@/data/paths";
import styles from "@/components/library/Library.module.css";

export const metadata: Metadata = { title: areaTitle("library"), description: PAGE_DESCRIPTIONS.library };

// The library's size, counted from the catalogue when the site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const WORKS = CATALOG.authors.flatMap((a) => a.works);
const n = (x: number) => x.toLocaleString("en-GB");

// a work's Greek title: the first of its Greek editions' names written in Greek (some are catalogued by a Latin name)
const greekTitle = (w: Catalog["authors"][number]["works"][number]) =>
  greekEditions(w).map((e) => e.label).find((l): l is string => !!l && /[Ͱ-Ͽἀ-῿]/.test(l)) ?? "";

// the famous books, in their two groups (data/medallions.ts), each with its photograph (data/library-plates.ts)
const BOOKS: Book[] = MEDALLIONS.map(({ group, id, pic, about }) => {
  const a = CATALOG.authors.find((x) => x.works.some((w) => w.id === id))!, w = a.works.find((x) => x.id === id)!;
  return { id, group, author: a.name, title: w.title, greek: greekTitle(w), about, english: hasTranslation(w), pic: WORK_PLATES[id]?.pic ?? pic, why: WORK_PLATES[id]?.why };
});

// the reading paths, each work named from the catalogue ("Plato, Apology"); every step opens the Greek with its English beside it
const WORK_NAME = new Map(CATALOG.authors.flatMap((a) => a.works.map((w) => [w.id, `${a.name}, ${w.title}`] as const)));
const Paths = () => (
  <ul className={styles.paths}>
    {PATHS.map((p) => (
      <li key={p.id} className={styles.path}>
        <h4>{p.title}</h4>
        <p>{p.blurb}</p>
        <ol>
          {p.steps.map(([w, note]) => (
            <li key={w}><Link href={`/read?w=${w}`} transitionTypes={["page-turn"]}><b>{WORK_NAME.get(w)}</b></Link><span>{note}</span></li>
          ))}
        </ol>
      </li>
    ))}
  </ul>
);

/**
 * The library, set as the catalogue at the back of an old edition (redesign SPEC.md 4.2, decision 11): its title with the
 * plate of a seated Muse, the search first, then six famous books with their plates in the margin, where to begin, and
 * every work in the library by kind of writing (or A to Z). The page ends with its list of plates and their credits.
 */
export default function LibraryPage() {
  return (
    <Page screen="library">
      <PageHead path={[{ label: AREAS.library.door ?? "Read" }, { label: "the library" }]} size="large" title={AREAS.library.name} greek={AREAS.library.greek}
        purpose={<>In Greek a mouseion is a shrine of the Muses. This one holds {n(WORKS.length)} Greek works, from Homer to the Byzantine scholars, {n(WORKS.filter(hasTranslation).length)} of them with an English translation beside the Greek.</>}
        action={<><LibSearch /><MineButtons /></>} />
      <FamousBooks books={BOOKS} />
      <BeginHere paths={<Paths />} />
      <Suspense fallback={null}>
        <Library />
      </Suspense>
      <div className="wrap"><PlateList ids={LIBRARY_PLATES} className={styles.plates} /></div>
    </Page>
  );
}
