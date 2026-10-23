import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import ReportBugLink from "@/components/ReportBugLink";
import NotFoundSearch from "@/components/NotFoundSearch";
import { AREAS, FORUM_OPEN } from "@/config/areas";
import styles from "./not-found.module.css";
import { LOST_PAGE } from "@/data/pieces";

export const metadata: Metadata = { title: "Not found", robots: { index: false } };

/**
 * An address that leads nowhere: 404 in Greek numerals over the title, the plate of a head that has outlived the rest of
 * its stele, and the ways on (search, the main rooms with what each is for, a report). Also served as 404.html on the
 * static site.
 */
export default function NotFound() {
  return (
    <Page>
      {/* data-not-found: an address that leads nowhere is not a page to carry on with (components/Resume.tsx) */}
      <div className={`wrap ${styles.page}`} data-not-found="">
        <PageHead bare path={[{ label: "Not found" }]} inscription="ΥΔ" inscriptionSays="ΥΔ, 404 in Greek numerals" title="This page has not survived" greek="ἀπόλωλε" piece={LOST_PAGE}
          purpose={<>The address may be mistyped, or the page may have moved. You are in good company: Aeschylus wrote an estimated
            70 to 90 plays, and <Link href="/author/tlg0085" transitionTypes={["page-turn"]}>seven survive</Link>.</>}
          action={<NotFoundSearch />}>
          <p className={styles.caption}>
            The letters over the title are 404 in <a href="https://en.wikipedia.org/wiki/Greek_numerals" rel="noopener">Greek numerals</a>: Υ is 400, Δ is 4.
          </p>
          <nav className={`slab-cards ${styles.ways}`} aria-label="Ways on">
            {(["home", "library", "study", "wiki"] as const).map((id) => (
              <Link key={id} className="slab-card" href={AREAS[id].href} transitionTypes={["page-turn"]}>
                <b>{AREAS[id].name}</b> <span className="muted">{AREAS[id].english ?? AREAS[id].door}</span>
              </Link>
            ))}
          </nav>
          {FORUM_OPEN && (
            <p className="muted">
              Followed a link on this site that led here? <ReportBugLink>Tell us about the broken link</ReportBugLink>.
            </p>
          )}
        </PageHead>
      </div>
    </Page>
  );
}
