import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import { AREAS, SITE, doorWord, menuWord, type AreaId } from "@/config/areas";
import styles from "../prose.module.css";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import NameCarving from "@/components/art/NameCarving";
import PagePiece from "@/components/art/PagePiece";

export const metadata: Metadata = { title: "About the names", description: PAGE_DESCRIPTIONS.about };

/**
 * The areas under the names of the header's menu (config/areas.ts: the five doors, then the Oracle), each with the places that
 * belong to it: the Scroll opens from the Mouseion (the phone bar's `also` lists it there), the Kerameikos, the Census and
 * the Periplus are pages of the Painted Stoa (their addresses begin /stoa), the Pnyx is in the Town Hall (/town-hall/pnyx),
 * and the Scroll Case is kept with the Treasury (the Treasury links to it as the place for what is read offline).
 */
const GROUPS: { heading: string; ids: AreaId[] }[] = [
  { heading: doorWord("home"), ids: ["home"] },
  { heading: doorWord("study"), ids: ["study"] },
  { heading: doorWord("library"), ids: ["library", "reader"] },
  { heading: doorWord("wiki"), ids: ["wiki", "archaeology", "census", "map"] },
  { heading: doorWord("forum"), ids: ["forum", "debates"] },
  { heading: doorWord("treasury"), ids: ["treasury", "downloads"] },
  { heading: menuWord("search"), ids: ["search"] },
];

export default function AboutPage() {
  return (
    <Page>
      <article className={`wrap ${styles.prose}`}>
        <div className="page-head">
          <span className="label">About</span>
          <NameCarving greek={SITE.greek} />
          <PagePiece className="piece-desk" />
          <h1>{SITE.latin} <span lang="grc" className={styles.gr}>{SITE.greek}</span></h1>
          <PagePiece className="piece-phone" />
          <p className={styles.lead}>
            <i>Mathēsis</i> means learning; <i>stoicheia</i> are the letters of the alphabet, and also the basic elements
            of anything, as in the title of Euclid&apos;s <i>Elements</i>. Together, <i>learning the letters</i>: where every
            reader of Greek begins.
          </p>
        </div>
        <div className="meander" aria-hidden="true" />
        <h2>Why each area has a Greek name</h2>
        <p>Every part of the site is named after a place or thing from the Greek world, always with a plain English subtitle.</p>
        {GROUPS.map((g) => (
          <section key={g.heading} className={styles.group} aria-labelledby={`about-${g.ids[0]}`}>
            <h3 id={`about-${g.ids[0]}`} className={styles.groupHead}>{g.heading}</h3>
            <dl className={styles.names}>
              {g.ids.map((id) => {
                const a = AREAS[id];
                return (
                  <div key={id}>
                    <dt>
                      <Link href={a.href} transitionTypes={["page-turn"]}>{a.name}</Link>
                      {a.greek && <span lang="grc"> {a.greek}</span>}
                      <small>{a.english}</small>
                    </dt>
                    <dd>{a.origin} {a.fit}</dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </article>
    </Page>
  );
}
