import Link from "next/link";
import Page from "@/components/Page";
import Win from "@/components/a/Win";
import FlyLetters from "@/components/a/FlyLetters";
import SettleText from "@/components/a/SettleText";
import PathTabs from "@/components/a/PathTabs";
import HomeDesk from "@/components/a/HomeDesk";
import GuideInvite from "@/components/guide/GuideInvite";
import HomePassage from "@/components/a/HomePassage";
import Glide from "@/components/a/Glide";
import { A_ART, passagePicture } from "@/components/a/pictures";
import { PASSAGES } from "@/data/passages";
import { AREAS, FORUM_OPEN, shown } from "@/config/areas";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { hasTranslation, type Catalog } from "@/lib/catalog";
import s from "@/components/a/a.module.css";
import { cssTempo } from "@/lib/tempo";

// The library's size, counted from the catalogue when the site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const WORKS = CATALOG.authors.flatMap((a) => a.works);
const n = (x: number) => x.toLocaleString("en-GB");

/** the five rooms of the site, each with a small window onto an object (design A); four while the forum is closed (FORUM_OPEN) */
const ALL_ROOMS = [
  { id: "study", gk: "Ἀκαδήμεια", art: A_ART.douris, text: "Lessons from the first letters to reading real texts." },
  { id: "library", gk: "Μουσεῖον", art: A_ART.amphora, text: `The library: ${n(WORKS.length)} works in Greek, ${n(WORKS.filter(hasTranslation).length)} with English beside them.` },
  { id: "wiki", gk: "Στοὰ Ποικίλη", art: A_ART.antikythera, text: "People, places and objects of the ancient world." },
  { id: "forum", gk: "Ἀγορά", art: A_ART.ostraka, text: "The forum: ask, answer, and read together." },
  { id: "treasury", gk: "Θησαυρός", art: A_ART.mask, text: "Your bookmarks, notes, highlights and words." },
] as const;
const ROOMS = ALL_ROOMS.filter((r) => shown(r.id));

// every picture the page can show, credited at its foot (the passage's window changes with the passage)
const PASSAGE_CREDITS = [...new Set(PASSAGES.map((p) => p.work))];

/**
 * The home page: design A's doorway, as it was chosen (the owner, 2026-10-19: "Just take the template of the original gold
 * and lamplight design"), with the site's real content, and without the nine Muses (the owner's choice, 2026-10-19).
 * Black, with windows onto real objects engraved in gold on Pompeian red; each window opens as a round iris as you reach
 * it. Faint Greek letters float behind the page.
 */
export default function Home() {
  return (
    <Page screen="home">
      <div className={`${s.screen} ${s.home}`}>
        <FlyLetters className={s.dust} />
        <Glide />
        <div className={s.flow}>
          <div className={`${s.wrap} ${s["h-hero"]}`}>
            <div className={s.blk}>
              <span className={s.mono} style={{ color: "var(--a-accent)" }}><span lang="grc">ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ</span> · Learning the letters</span>
              <h1 id="hero-title" className={s["c-title"]} aria-label="Read the Greeks in their own words">
                <span className={s.ln} aria-hidden="true"><span>Read the</span></span>
                <span className={s.ln} aria-hidden="true"><span style={{ animationDelay: cssTempo(".1s") }}>Greeks in</span></span>
                <span className={s.ln} aria-hidden="true"><span style={{ animationDelay: cssTempo(".2s") }}><em>their own</em> words</span></span>
              </h1>
              <p className={s.lede}>Learn to read Ancient Greek, and meet the world that wrote it.</p>
              <div className={s.btns}>
                <Link className={`${s.btn} ${s.solid}`} href="/academy/alphabet" transitionTypes={["page-turn"]}>Start with the letters</Link>
                <Link className={`${s.btn} ${s.ghost}`} href="/library" transitionTypes={["page-turn"]}>Open the library</Link>
              </div>
              {/* a first visit: where are you starting?; a returning visitor: their desk (lib/visitor.ts) */}
              <div className={s["first-only"]}><PathTabs /></div>
              <div className={s["back-only"]}><HomeDesk /></div>
            </div>
            <Win className={`${s.win} ${s.tall}`} kind="coin" src={A_ART.coin.src} label={A_ART.coin.label} caption={A_ART.coin.cap} capClass={s.wcap} />
          </div>

          <Win className={`${s.win} ${s.band}`} src={A_ART.frieze.src} label={A_ART.frieze.label} caption={A_ART.frieze.cap} capClass={s.wcap} />

          <HomePassage />

          <section className={`${s.wrap} ${s.rooms}`} aria-label="The rooms of the site">
            <div className={s["sec-h"]}><SettleText className={s.mono} text={FORUM_OPEN ? "Five rooms" : "Four rooms"} /><SettleText className={s.mono} text="Mathesis Stoicheion" /></div>
            <div className={s.rgrid}>
              {ROOMS.map((r) => {
                const a = AREAS[r.id];
                return (
                  <Link key={r.id} className={s.room} href={a.href} transitionTypes={["page-turn"]}>
                    <Win className={`${s.win} ${s.mini}`} src={r.art.src} label={r.art.label} caption={r.art.cap} capClass={s.wcap} />
                    <SettleText className={s.gk} lang="grc" text={r.gk} />
                    <span className={s.mono}>{a.door}</span>
                    <p>{r.text}</p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className={`${s.wrap} ${s.stoa}`} aria-label="From the Painted Stoa">
            <div className={s.blk}>
              <span className={s.mono} style={{ color: "var(--a-accent)" }}>From the Painted Stoa</span>
              <SettleText as="h3" text="Why Stoics are called Stoics" />
              <p>The Stoa Poikile, the “Painted Colonnade”, stood on the north side of the Athenian Agora, hung with famous paintings such as the Battle of Marathon. Around 300 BC Zeno of Citium began to teach there, walking up and down the colonnade.</p>
              <p>His followers were first called Zenonians, then Stoics, “the people of the Stoa” (Diogenes Laertius, Lives 7.5).</p>
            </div>
            <Win className={`${s.win} ${s.wide}`} src={A_ART.crates.src} label={A_ART.crates.label} caption={A_ART.crates.cap} capClass={s.wcap} />
          </section>

          <div className={s.wrap} style={{ paddingBottom: 40 }}>
            <p className={s.cap} style={{ maxWidth: "86ch" }}>
              The pictures in the windows, all redrawn as gold engravings: {[A_ART.coin, A_ART.frieze, A_ART.douris, A_ART.amphora, A_ART.antikythera, A_ART.ostraka, A_ART.mask, A_ART.crates].map((p) => p.credit).join(". ")}.
              {" "}Beside the passage of the day, a picture that belongs to its text: <PassageCredits works={PASSAGE_CREDITS} />.
            </p>
          </div>
        </div>
      </div>
      <GuideInvite />
    </Page>
  );
}

/** the credits of every picture the passage of the day can show, once each */
function PassageCredits({ works }: { works: string[] }) {
  const seen = [...new Set(works.map((w) => passagePicture(w).credit))];
  return <>{seen.join("; ")}</>;
}
