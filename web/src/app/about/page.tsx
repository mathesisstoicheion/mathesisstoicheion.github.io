import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import { AREAS, SITE, shown, type AreaId } from "@/config/areas";
import styles from "../prose.module.css";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: "About the names", description: PAGE_DESCRIPTIONS.about };

/**
 * The areas under the names of the header's menu (config/areas.ts: the five doors, then the Oracle), each with the places that
 * belong to it: the reader opens from the Mouseion (the phone bar's `also` lists it there), the Kerameikos, the Census and
 * the Periplus are pages of the Painted Stoa (their addresses begin /stoa), the Pnyx is in the Agora (/town-hall/pnyx),
 * and the Scroll Case is kept with the Treasury (the Treasury links to it as the place for what is read offline).
 * While the forum is closed (FORUM_OPEN) its group is left out.
 */
/** each group is headed by its room's verb (what you do there), or the place's plain English word */
const verb = (id: AreaId) => AREAS[id].door ?? AREAS[id].english ?? AREAS[id].name;
const GROUPS: { heading: string; ids: AreaId[] }[] = ([
  { heading: verb("home"), ids: ["home"] },
  { heading: verb("study"), ids: ["study"] },
  { heading: verb("library"), ids: ["library", "reader"] },
  { heading: verb("wiki"), ids: ["wiki", "archaeology", "census", "map"] },
  { heading: verb("forum"), ids: ["forum", "debates"] },
  { heading: verb("treasury"), ids: ["treasury", "downloads"] },
  { heading: verb("search"), ids: ["search"] },
] as { heading: string; ids: AreaId[] }[]).map((g) => ({ ...g, ids: g.ids.filter(shown) })).filter((g) => g.ids.length > 0);

export default function AboutPage() {
  return (
    <Page>
      <article className={`wrap ${styles.prose}`}>
        <PageHead bare path={[{ label: "About" }, { label: "The names" }]} title={SITE.latin} greek={SITE.greek}
          purpose={<><i>Mathēsis</i> means learning; <i>stoicheia</i> are the letters of the alphabet, and also the basic elements
            of anything, as in the title of Euclid&apos;s <i>Elements</i>. Together, <i>learning the letters</i>: where every
            reader of Greek begins.</>} />
        <div className="meander" aria-hidden="true" />
        <h2>Why each area has a Greek name</h2>
        <p>Every part of the site is named after a place or thing from the Greek world, always shown the same way: its English name first, then its Greek name.</p>
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
                      {a.greek && <span lang="grc">{a.greek}</span>}
                      {a.english && <small>{a.english}</small>}
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
