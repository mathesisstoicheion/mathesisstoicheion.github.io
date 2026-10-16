import type { Metadata } from "next";
import { Suspense } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Page from "@/components/Page";
import Library from "@/components/library/Library";
import Stelai, { type Stele } from "@/components/library/Stelai";
import Carving from "@/components/art/Carving";
import { AREAS } from "@/config/areas";
import { hasTranslation, greekEditions, type Catalog } from "@/lib/catalog";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import { MEDALLIONS } from "@/data/medallions";
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

export default function LibraryPage() {
  return (
    <Page>
      <div className={`wrap ${styles.head}`}>
        <span className={`label ${styles.kick}`}>{AREAS.library.door} · {AREAS.library.english}</span>
        <Carving text="ΜΟΥΣΕΙΟΝ" kind="title" delay={0.2} className={`carve ${styles.carve}`} />
      </div>
      <Suspense fallback={null}>
        <Library
          hero={<>
            <h1>{AREAS.library.name}<span lang="grc">{AREAS.library.greek}</span></h1>
            <p>{AREAS.library.origin} This one holds {WORKS.length.toLocaleString("en-GB")} Greek works, from Homer to the Byzantine scholars, {WORKS.filter(hasTranslation).length.toLocaleString("en-GB")} of them with an English translation beside the Greek.</p>
          </>}
          stelai={<Stelai groups={GROUPS} />}
        />
      </Suspense>
    </Page>
  );
}
