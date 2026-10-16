import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import ReportBugLink from "@/components/ReportBugLink";
import NotFoundSearch from "@/components/NotFoundSearch";
import Carving from "@/components/art/Carving";
import { AREAS } from "@/config/areas";
import styles from "./not-found.module.css";

export const metadata: Metadata = { title: "Not found", robots: { index: false } };

/**
 * An address that leads nowhere: a broken piece of stone set in the wall, with 404 cut into it in Greek numerals and
 * lit by the torch, and the ways on (search, the main areas, a report). Also served as 404.html on the static site.
 */
export default function NotFound() {
  return (
    <Page>
      <div className={`wrap ${styles.page}`}>
        <figure className={styles.frag} aria-labelledby="nf-num">
          <div className={styles.stone} role="img" aria-label="A broken piece of stone, carved with ΥΔ, 404 in Greek numerals">
            <Carving text="ΥΔ" kind="fragment" delay={0.2} className={`carve ${styles.carve}`} />
          </div>
          <svg className={styles.edge} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="4,22 30,6 46,12 63,2 88,10 97,34 92,58 99,80 76,96 52,90 30,99 8,84 2,56" />
          </svg>
          <figcaption id="nf-num" className={styles.caption}>
            404 in <a href="https://en.wikipedia.org/wiki/Greek_numerals" rel="noopener">Greek numerals</a>: Υ is 400, Δ is 4.
          </figcaption>
        </figure>

        <div className={styles.text}>
          <p className="label">Not found</p>
          <h1 className="page-title">This page has not survived <span lang="grc">ἀπόλωλε</span></h1>
          <p className={styles.lead}>
            The address may be mistyped, or the page may have moved. You are in good company: Aeschylus wrote an estimated
            70 to 90 plays, and <Link href="/author/tlg0085" transitionTypes={["page-turn"]}>seven survive</Link>.
          </p>
          <NotFoundSearch />
          <nav className={styles.ways} aria-label="Ways on">
            {(["home", "library", "study", "wiki"] as const).map((id) => (
              <Link key={id} href={AREAS[id].href} transitionTypes={["page-turn"]}>
                <b>{AREAS[id].name}</b> <span className="muted">{AREAS[id].english}</span>
              </Link>
            ))}
          </nav>
          <p className="muted">
            Followed a link on this site that led here? <ReportBugLink>Tell us about the broken link</ReportBugLink>.
          </p>
        </div>
      </div>
    </Page>
  );
}
