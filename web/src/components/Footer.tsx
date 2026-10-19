import Link from "next/link";
import { SITE } from "@/config/areas";
import ReportBugLink from "./ReportBugLink";
import EmblemMark from "./EmblemMark";
import Carving from "./art/Carving";

export default function Footer() {
  return (
    // the foot of the wall: a plinth, with the site's name cut along it and lit by the torch
    <footer className="site-footer">
      <div className="wrap site-footer-in">
        <Carving text={SITE.greek} kind="plinth" delay={0.1} className="carve site-footer-carve" />
        <div>
          <p className="site-footer-name"><EmblemMark className="site-footer-mark" /><span lang="grc">{SITE.greek}</span></p>
          <p className="muted">Free for everyone. No adverts, no trackers.</p>
        </div>
        <nav aria-label="About this site" className="site-footer-links">
          <Link href="/guide" transitionTypes={["page-turn"]}>How to use the site</Link>
          <Link href="/about" transitionTypes={["page-turn"]}>About the names</Link>
          <Link href="/credits" transitionTypes={["page-turn"]}>Credits, licences &amp; privacy</Link>
          <ReportBugLink />
          <Link href="/town-hall?c=ideas">Suggest an idea</Link>
        </nav>
        <p className="muted site-footer-src">
          Greek texts and translations from the Perseus Digital Library and the First Thousand Years of Greek project,
          used unchanged under CC BY-SA 4.0.
        </p>
      </div>
    </footer>
  );
}
