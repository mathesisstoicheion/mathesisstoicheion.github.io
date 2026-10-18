import type { Metadata } from "next";
import { Suspense } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Page from "@/components/Page";
import Library from "@/components/library/Library";
import MineButtons from "@/components/library/MineButtons";
import Stelai, { type Stele } from "@/components/library/Stelai";
import PageHead from "@/components/PageHead";
import FindJump from "@/components/FindJump";
import { AREAS, trail } from "@/config/areas";
import { hasTranslation, greekEditions, type Catalog } from "@/lib/catalog";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import { MEDALLIONS } from "@/data/medallions";
import { PATHS } from "@/data/paths";
import Link from "next/link";
import styles from "./library.module.css";

export const metadata: Metadata = { title: `${AREAS.library.name} · ${AREAS.library.english}`, description: PAGE_DESCRIPTIONS.library };

// The library's size, counted from the catalogue when the site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const WORKS = CATALOG.authors.flatMap((a) => a.works);

// a work's Greek title: the first of its Greek editions' names written in Greek (some are catalogued by a Latin name)
const greekTitle = (w: Catalog["authors"][number]["works"][number]) =>
  greekEditions(w).map((e) => e.label).find((l): l is string => !!l && /[\u0370-\u03ff\u1f00-\u1fff]/.test(l)) ?? "";

// the wall of stelai: the books that have a medallion, in their groups
const GROUPS = [...new Set(MEDALLIONS.map((b) => b.group))].map((name) => ({
  name,
  books: MEDALLIONS.filter((b) => b.group === name).map(({ id, pic, alt, why }): Stele => {
    const a = CATALOG.authors.find((x) => x.works.some((w) => w.id === id))!, w = a.works.find((x) => x.id === id)!;
    return { id, author: a.name, title: w.title, greek: greekTitle(w), pic, alt, why, english: hasTranslation(w) };
  }),
}));

// the reading paths, each work named from the catalogue ("Plato, Apology"); every step opens the Greek with its English beside it
const WORK_NAME = new Map(CATALOG.authors.flatMap((a) => a.works.map((w) => [w.id, `${a.name}, ${w.title}`] as const)));
const Paths = () => (
  <ul className={styles.paths}>
    {PATHS.map((p) => (
      <li key={p.id} className={styles.path}>
        <h3>{p.title}</h3>
        <p className="muted">{p.blurb}</p>
        <ol>
          {p.steps.map(([w, note]) => (
            <li key={w}><Link href={`/read?w=${w}`} transitionTypes={["page-turn"]}><b>{WORK_NAME.get(w)}</b></Link><span>{note}</span></li>
          ))}
        </ol>
      </li>
    ))}
  </ul>
);

export default function LibraryPage() {
  return (
    <Page>
      {/* the page's head (PAGE-RULES.md): its main action is the library's search, which stands on the list it searches
          and is brought into view from here; for the moderator alone, their private collection follows */}
      <PageHead path={trail("library")} size="large" carve="ΜΟΥΣΕΙΟΝ" title={AREAS.library.name} greek={AREAS.library.greek}
        purpose={<>{AREAS.library.origin} This one holds {WORKS.length.toLocaleString("en-GB")} Greek works, from Homer to the Byzantine scholars, {WORKS.filter(hasTranslation).length.toLocaleString("en-GB")} of them with an English translation beside the Greek.</>}
        action={<FindJump target="library-search" label="Search the library">An author or a title: Plato, Odyssey…</FindJump>}>
        <MineButtons />
      </PageHead>
      <Suspense fallback={null}>
        <Library
          stelai={<Stelai groups={GROUPS} />}
          paths={<Paths />}
        />
      </Suspense>
    </Page>
  );
}
