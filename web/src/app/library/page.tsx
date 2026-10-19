import type { Metadata } from "next";
import { Suspense } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Page from "@/components/Page";
import Library from "@/components/library/Library";
import MineButtons from "@/components/library/MineButtons";
import LibStage from "@/components/a/LibStage";
import LibSearch from "@/components/a/LibSearch";
import Featured, { type Book } from "@/components/a/Featured";
import { AREAS } from "@/config/areas";
import { hasTranslation, greekEditions, type Catalog } from "@/lib/catalog";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import { MEDALLIONS } from "@/data/medallions";
import { PATHS } from "@/data/paths";
import Link from "next/link";
import s from "@/components/a/a.module.css";
import styles from "./library.module.css";

export const metadata: Metadata = { title: `${AREAS.library.name} · ${AREAS.library.english}`, description: PAGE_DESCRIPTIONS.library };

// The library's size, counted from the catalogue when the site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const WORKS = CATALOG.authors.flatMap((a) => a.works);
const n = (x: number) => x.toLocaleString("en-GB");

// a work's Greek title: the first of its Greek editions' names written in Greek (some are catalogued by a Latin name)
const greekTitle = (w: Catalog["authors"][number]["works"][number]) =>
  greekEditions(w).map((e) => e.label).find((l): l is string => !!l && /[Ͱ-Ͽἀ-῿]/.test(l)) ?? "";

// design A's famous books, in its two groups: the books that have a picture (data/medallions.ts)
const GROUPS = [...new Set(MEDALLIONS.map((b) => b.group))].map((name) => ({
  name,
  books: MEDALLIONS.filter((b) => b.group === name).map(({ id, pic, why }): Book => {
    const a = CATALOG.authors.find((x) => x.works.some((w) => w.id === id))!, w = a.works.find((x) => x.id === id)!;
    return { id, author: a.name, title: w.title, greek: greekTitle(w), pic, why, english: hasTranslation(w) };
  }),
}));

// the reading paths, each work named from the catalogue ("Plato, Apology"); every step opens the Greek with its English beside it
const WORK_NAME = new Map(CATALOG.authors.flatMap((a) => a.works.map((w) => [w.id, `${a.name}, ${w.title}`] as const)));
const Paths = () => (
  <ul className={styles.paths}>
    {PATHS.map((p) => (
      <li key={p.id} className={styles.path}>
        <h4>{p.title}</h4>
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

/**
 * The library, as design A drew it (the owner, 2026-10-19: "Just take the template of the original gold and lamplight
 * design"): one stage pinned behind the page, where the letters of Plato's Apology gather into Socrates as you scroll and
 * then become a papyrus roll; over it, black blocks with the page's name and search, the famous books, and then every
 * work in the library. On wide screens the blocks stand at the left, so nothing covers him.
 */
export default function LibraryPage() {
  return (
    <Page screen="library">
      <div className={`${s.screen} ${s.library}`}>
        <LibStage />
        <div className={s.flow}>
          <div className={`${s.wrap} ${s["lib-hero"]}`}>
            <div className={s.blk}>
              <span className={s.mono} style={{ color: "var(--a-accent)" }}>Read · The Library</span>
              <h1 className={s["lib-title"]}>{AREAS.library.name}<span className={s["gr-t"]} lang="grc">{AREAS.library.greek}</span></h1>
              <p className={s.lede}>
                In Greek a mouseion is a shrine of the Muses. This one holds {n(WORKS.length)} Greek works, from Homer to the Byzantine scholars,
                {" "}{n(WORKS.filter(hasTranslation).length)} of them with an English translation beside the Greek. Each of the famous books below carries a picture of its author or of the thing it is best known for.
              </p>
              <LibSearch />
              <MineButtons />
              <p className={`${s.stcap} ${s.mono}`}>The letters gather into Socrates, spelled out of Plato’s Apology. Scroll on, and they become a papyrus roll. Press and hold to read.</p>
            </div>
            <div className={`${s.win} ${s.tall}`} role="img" aria-label="The head of Socrates, spelled out letter by letter from the Greek of Plato's Apology; press and hold on his face to read it">
              <span className={s.wcap}>Socrates · spelled out of the Apology · press and hold to read</span>
            </div>
          </div>
          <Featured groups={GROUPS}
            between={<div className={`${s.win} ${s.band}`} aria-hidden="true" />}
            after={<p className={s.cap} style={{ marginTop: 22 }}>Socrates wrote nothing, so his face is spelled out of the speech Plato gave him, the Apology: the whole Greek text in reading order, from “<span lang="grc">ὅτι μὲν ὑμεῖς, ὦ ἄνδρες Ἀθηναῖοι</span>” to “<span lang="grc">τῷ θεῷ</span>” (Platonis Opera, ed. John Burnet, Oxford, via the Perseus Digital Library). Press and hold on his face, and a glass lets you read it. The face is a Roman marble portrait, 1st century AD, Musée du Louvre; photograph by Eric Gaba, public domain. Each book’s picture is credited beside it.</p>} />
          <Suspense fallback={null}>
            <Library paths={<Paths />} />
          </Suspense>
        </div>
      </div>
    </Page>
  );
}
