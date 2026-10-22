import Link from "next/link";
import { FORUM_OPEN, SITE } from "@/config/areas";
import ReportBugLink from "./ReportBugLink";
import Mark from "./a/Mark";

export default function Footer() {
  return (
    // the foot of every page, a colophon: the printer's device and the site's name
    <footer className="site-footer">
      <div className="wrap site-footer-in">
        <div>
          <p className="site-footer-name"><Mark size="foot" label="Mathesis Stoicheion, home" /><span lang="grc">{SITE.greek}</span></p>
          <p className="muted">Free for everyone. No adverts, no trackers.</p>
        </div>
        <nav aria-label="About this site" className="site-footer-links">
          <Link href="/guide" transitionTypes={["page-turn"]}>How to use the site</Link>
          <Link href="/about" transitionTypes={["page-turn"]}>About the names</Link>
          <Link href="/credits" transitionTypes={["page-turn"]}>Credits, licences &amp; privacy</Link>
          {FORUM_OPEN && <>
            <ReportBugLink />
            <Link href="/town-hall?c=ideas">Suggest an idea</Link>
          </>}
        </nav>
        <p className="muted site-footer-src">
          Greek texts and translations from the Perseus Digital Library and the First Thousand Years of Greek project,
          used unchanged under CC BY-SA 4.0.
        </p>
      </div>
    </footer>
  );
}
