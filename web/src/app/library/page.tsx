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
import LibSearch from "@/components/a/LibSearch";
import { AREAS, areaTitle } from "@/config/areas";
import { hasTranslation, type Catalog } from "@/lib/catalog";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import { PATHS } from "@/data/paths";
import styles from "@/components/library/Library.module.css";

export const metadata: Metadata = { title: areaTitle("library"), description: PAGE_DESCRIPTIONS.library };

// The library's size, counted from the catalogue when the site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const WORKS = CATALOG.authors.flatMap((a) => a.works);
const n = (x: number) => x.toLocaleString("en-GB");

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
 * The library, set as the catalogue at the back of an old edition (redesign SPEC.md 4.2, decision 11): its title, where to
 * begin and then the search (the owner, 2026-10-25: "not sure where to begin ... should be above the search"), then every
 * work in the library by kind of writing (or A to Z). The six famous books are on the home page now, and the page has no
 * photographs: it is for finding something to read.
 */
export default function LibraryPage() {
  return (
    <Page screen="library">
      <PageHead path={[{ label: AREAS.library.door ?? "Read" }, { label: "the library" }]} size="large" title={AREAS.library.name} greek={AREAS.library.greek}
        purpose={<>In Greek a mouseion is a shrine of the Muses. This one holds {n(WORKS.length)} Greek works, from Homer to the Byzantine scholars, {n(WORKS.filter(hasTranslation).length)} of them with an English translation beside the Greek.</>}
        action={<><BeginHere paths={<Paths />} /><LibSearch /><MineButtons /></>} />
      <Suspense fallback={null}>
        <Library />
      </Suspense>
    </Page>
  );
}
