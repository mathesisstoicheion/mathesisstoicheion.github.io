import { Fragment } from "react";
import Link from "next/link";
import Page from "@/components/Page";
import LetterTiles from "@/components/LetterTiles";
import PassageOfTheDay from "@/components/PassageOfTheDay";
import OfflineActions from "@/components/OfflineActions";
import ForumActivity from "@/components/ForumActivity";
import StartChoice from "@/components/home/StartChoice";
import Desk from "@/components/home/Desk";
import Rooms from "@/components/home/Rooms";
import Wall from "@/components/home/Wall";
import NameEmblem from "@/components/home/NameEmblem";
import Muses from "@/components/home/Muses";
import Settle from "@/components/art/Settle";
import Carving from "@/components/art/Carving";
import ReliefWindow from "@/components/art/ReliefWindow";
import VisitorMark from "@/components/home/VisitorMark";
import start from "@/components/home/Start.module.css";
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
import HomeFold from "@/components/HomeFold";
import GuideInvite from "@/components/guide/GuideInvite";
import { AREAS, SITE } from "@/config/areas";
import StoaCards, { type StoaCard } from "@/components/StoaCards";
import { ENTRIES, categoryOf } from "@/wiki/index";
import { inline, plain } from "@/wiki/markup";
import { IMAGES, srcSet } from "@/wiki/images";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { greekEditions, hasTranslation, type Catalog } from "@/lib/catalog";
import { PATHS } from "@/data/paths";
import { STARTS } from "@/data/starts";
import HomeFinder, { type Start } from "@/components/HomeFinder";
import styles from "./home.module.css";

// From the Painted Stoa: each entry reduced to what a home-page card shows (its first sentences).
const firstSentences = (t: string) => { let out = ""; for (const x of t.split(/(?<=[.!?])\s+/)) { if (out && (out + " " + x).length > 230) break; out = out ? `${out} ${x}` : x; } return out; };
const STOA_CARDS: StoaCard[] = ENTRIES.map((e) => {
  const im = e.image ? IMAGES[e.image] : undefined;
  return {
    slug: e.slug, title: e.title, cat: categoryOf(e.category).title, catId: e.category, text: firstSentences(plain(inline(e.hook))),
    pic: im && { src: `/images/${im.file}`, srcSet: srcSet(im), alt: im.alt, credit: `${im.title} · ${im.sourceName} · ${im.licence}`, width: im.width, height: im.height },
  };
});

// The library's size, counted from the catalogue when the site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const WORKS = CATALOG.authors.flatMap((a) => a.works);
const STATS: [number, string][] = [
  [CATALOG.authors.length, "authors"],
  [WORKS.length, "works"],
  [WORKS.filter(hasTranslation).length, "with an English translation"],
];

// Each reading path's works, named from the catalogue ("Plato, Apology").
const WORK_NAME = new Map(CATALOG.authors.flatMap((a) => a.works.map((w) => [w.id, `${a.name}, ${w.title}`] as const)));

const START_CARDS: Start[] = STARTS.map((id) => {
  const a = CATALOG.authors.find((x) => x.works.some((w) => w.id === id))!;
  const w = a.works.find((x) => x.id === id)!;
  return { id, title: w.title, author: a.name, grc: greekEditions(w)[0]?.label ?? null };
});

// The opening words, cut in letter by letter as the page opens (home.module.css, .c).
const TITLE: { text: string; em?: boolean }[][] = [[{ text: "Read the Greeks" }], [{ text: "in " }, { text: "their own", em: true }, { text: " words" }]];
function CutTitle() {
  let i = 0;
  const cut = (t: string) => [...t].map((ch, k) => ch === " " ? " " : <span key={k} className={styles.c} style={{ animationDelay: `${(0.3 + i++ * 0.045).toFixed(3)}s` }}>{ch}</span>);
  return (
    <h1 id="hero-title" className={styles.title} aria-label="Read the Greeks in their own words">
      <span aria-hidden="true">
        {TITLE.map((line, l) => <Fragment key={l}>{l > 0 && " "}<span className={styles.ln}>{line.map((p, k) => p.em ? <em key={k}>{cut(p.text)}</em> : <span key={k}>{cut(p.text)}</span>)}</span></Fragment>)}
      </span>
    </h1>
  );
}

export default function Home() {
  return (
    <Page>
      <VisitorMark />

      {/* ---------------------------------------------------------------- the wall: the opening of the Apology, cut in the stone */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <Wall className={styles.wall} />
        <div className={`wrap ${styles.heroIn}`}>
          <div className={styles.heroText} data-quiet="">
            <p className={`label ${styles.kick}`}><span lang="grc">ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ</span> · Learning the letters</p>
            <CutTitle />
            <p className={styles.heroLede}>{SITE.tagline}</p>
            {/* a first visit: one question; a returning visitor: their desk */}
            <div className={start.firstOnly}>
              <div className={styles.btns}>
                <Link className="btn" href="/academy/alphabet" transitionTypes={["page-turn"]}>Start with the letters</Link>
                <Link className="btn ghost" href="/library" transitionTypes={["page-turn"]}>Open the library</Link>
              </div>
              <div className={styles.startCell}><StartChoice /></div>
            </div>
            <div className={`${start.backOnly} ${styles.deskCell}`}><Desk /></div>
            <dl className={styles.stats}>
              {STATS.map(([n, what]) => <div key={what}><dt>{n.toLocaleString("en-GB")}</dt><dd>{what}</dd></div>)}
            </dl>
          </div>
        </div>
        <p className={styles.wallCap} data-quiet="">Cut into the wall: the opening of Plato’s <i>Apology</i>, as Greek was written in Plato’s time: in capitals, with no spaces or accents. Carry the torch over it to read; on a phone, scroll it through the light.</p>
      </section>

      {/* ---------------------------------------------------------------- the name */}
      <section className={`wrap ${styles.sec} ${styles.name}`} aria-labelledby="name-title">
        <div className={styles.secH}><Settle className="label" text="The name" /><span className="label faint" lang="grc">Μάθησις στοιχείων</span></div>
        <div className={styles.nameG}>
          <div className={styles.emb}><NameEmblem /></div>
          <div className={styles.nameT}>
            <Settle as="h2" id="name-title" className={`${styles.h2} rv`} lang="grc" text="Μάθησις στοιχείων" />
            <p className={`${styles.nameSub} rv`}>Learning the elements</p>
            <p className="rv"><span lang="grc">Μάθησις</span> is learning: “the act of learning, getting of knowledge”. A <span lang="grc">στοιχεῖον</span> was three things, and all three are on this tablet.</p>
            <ol className={styles.nameL}>
              <li className="rv"><b>A letter.</b> Strictly “a simple sound of speech, as the first component of the syllable”, and so a letter of the alphabet. Greek children learned their letters on wax tablets like this one, writing with a stylus.</li>
              <li className="rv"><b>A shadow.</b> “In a form of sun-dial, the shadow of the gnomon, the length of which in feet indicated the time of day.” In Aristophanes’ <i>Assemblywomen</i>, Praxagora tells her husband that his only care will be to go to dinner <span lang="grc">ὅταν ᾖ δεκάπουν τὸ στοιχεῖον</span>, “when the shadow is ten feet long” (line 652). Here the stylus stands in the wax as the pointer.</li>
              <li className="rv"><b>An element.</b> <span lang="grc">Στοιχεῖα</span>, the <i>Elements</i>, is the name of Euclid’s geometry. Its first proposition is drawn in the wax: <span lang="grc">ἐπὶ τῆς δοθείσης εὐθείας πεπερασμένης τρίγωνον ἰσόπλευρον συστήσασθαι</span>, “On a given finite straight line to construct an equilateral triangle” (Elements 1.1). The given line is the stylus’s shadow.</li>
            </ol>
          </div>
          <p className={`${styles.cap} rv`}>The definitions are quoted from Liddell, Scott and Jones, <i>A Greek-English Lexicon</i> (LSJ), under <span lang="grc">μάθησις</span> and <span lang="grc">στοιχεῖον</span>; the letter sense cites Plato, Cratylus 424d. Euclid’s Greek is Heiberg’s text (Teubner, 1883–88), translated by T. L. Heath; Aristophanes is Hall and Geldart’s text (Oxford, 1907); both via the Perseus Digital Library. The tablet, stylus and compass are drawn for this page. Move your torch over the tablet, or on a phone scroll it through the middle of the screen: the light casts its own shadows.</p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- passage */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="passage-title" data-fold="passage">
        <div className={styles.secH}>
          <Settle as="h2" id="passage-title" className="label" text="Passage of the day" />
          <span className={styles.secR}><span className="label faint">{AREAS.reader.name} · {AREAS.reader.english}</span><HomeFold id="passage" title="Passage of the day" className={styles.foldBtn} /></span>
        </div>
        <div className={styles.podGrid} data-fold-hide="">
          <div className="rv">
            <p className={styles.lede}>A different famous passage each day, read live from the original files. Every word can be looked up.</p>
            <PassageOfTheDay />
          </div>
          <ReliefWindow pic="great-eleusinian-relief" className={`${styles.tall} rv`}
            alt="A marble relief: two tall women in long robes, Demeter and Persephone, stand on either side of a naked boy, Triptolemus."
            caption={<><b>Demeter, Triptolemus and Persephone.</b> Fragments of a Roman copy of the Great Eleusinian Relief, c. 27 BC–AD 14. The Metropolitan Museum of Art, New York (14.130.9). CC0.</>} />
        </div>
      </section>

      {/* ---------------------------------------------------------------- learn */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="learn-title" data-fold="learn">
        <div className={styles.secH}>
          <Settle as="h2" id="learn-title" className="label" text="Start with the letters" />
          <span className={styles.secR}><span className="label faint">{AREAS.study.name} · {AREAS.study.english}</span><HomeFold id="learn" title="Start with the letters" className={styles.foldBtn} /></span>
        </div>
        <div className={styles.learnGrid} data-fold-hide="">
          <div className="rv">
            <p className={styles.lede}>Twenty-four letters, seven of them vowels. Many will look familiar from maths and science; a few will surprise you.</p>
            <ol className={styles.path}>
              <li><Link href="/academy/alphabet" transitionTypes={["page-turn"]}><b>Meet the alphabet</b></Link><span>Shapes, names and sounds, and the order each letter is written in.</span></li>
              <li><Link href="/academy/lesson/marks" transitionTypes={["page-turn"]}><b>Accents and breathings</b></Link><span>What the small marks above the letters do, and how much they matter to a beginner.</span></li>
              <li><Link href="/academy/lesson/letters" transitionTypes={["page-turn"]}><b>Your first real sentence</b></Link><span>A genuine line of Homer by the end of lesson one, linked to the library.</span></li>
            </ol>
          </div>
          <div className="rv">
            <LetterTiles />
            <p className={styles.cap}>Hover or tap a letter. Sounds follow the reconstructed pronunciation of Classical Athens; on <Link href="/academy/alphabet" transitionTypes={["page-turn"]}>the alphabet page</Link> you can switch to Erasmian or Modern Greek.</p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- the Muses */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="muses-title">
        <div className={styles.secH}><Settle as="h2" id="muses-title" className="label" text="Begin with the Muses" /><span className="label faint">Hesiod · Theogony 1, 76–79</span></div>
        <Carving text="Μουσάων Ἑλικωνιάδων ἀρχώμεθ’ ἀείδειν" kind="line" delay={0.1} />
        <p className={`${styles.muG} rv`} lang="grc">Μουσάων Ἑλικωνιάδων ἀρχώμεθ’ ἀείδειν</p>
        <p className={`${styles.muE} rv`}>“From the Heliconian Muses let us begin to sing.”</p>
        <Muses />
        <p className={`${styles.cap} ${styles.musesCap} rv`}>Hesiod names nine Muses, “nine daughters begotten by great Zeus” (Theogony 76–79). Which art belongs to which Muse was settled later, and ancient writers do not always agree. Translation by H. G. Evelyn-White (1914), via the Perseus Digital Library. Pass the torch over a niche and her name catches the light.</p>
      </section>

      {/* ---------------------------------------------------------------- find something to read */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="find-title">
        <div className={styles.secH}><Settle as="h2" id="find-title" className="label" text="Find something to read" /><span className="label faint">{AREAS.library.name} · {AREAS.library.english}</span></div>
        <p className={`${styles.lede} rv`}>Search by title, author or Greek name. Where a work has an English translation, it sits beside the Greek.</p>
        <div className="rv"><HomeFinder starts={START_CARDS} total={WORKS.length} /></div>
      </section>

      {/* ---------------------------------------------------------------- reading paths */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="paths-title">
        <div className={styles.secH}><Settle as="h2" id="paths-title" className="label" text="Where to read next" /><span className="label faint">Six paths through the library</span></div>
        <p className={`${styles.lede} rv`}>Six short paths through the library, each in a sensible order. Every step opens the Greek with its English beside it.</p>
        <ul className={`${styles.paths} rv`}>
          {PATHS.map((p) => (
            <li key={p.id} className={styles.pathCard}>
              <h3>{p.title}</h3>
              <p className={styles.pathBlurb}>{p.blurb}</p>
              <ol>
                {p.steps.map(([w, note]) => (
                  <li key={w}><Link href={`/read?w=${w}`} transitionTypes={["page-turn"]}><b>{WORK_NAME.get(w)}</b></Link><span>{note}</span></li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- a band of frieze */}
      <div className={`wrap ${styles.sec}`}>
        <ReliefWindow pic="parthenon-frieze-cast" className={styles.band} frameClassName="frame rv"
          alt="A white plaster relief of two figures seated side by side on stools, their faces broken away."
          caption={<><b>Two seated figures from the Parthenon frieze.</b> Plaster cast in the Acropolis Museum of part of block IV of the Parthenon’s east frieze; the marble original is in the British Museum. Original 5th century BC; modern cast. Photograph by Deiadameian, CC BY-SA 4.0.</>} />
      </div>

      {/* ---------------------------------------------------------------- the five rooms */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="rooms-title">
        <div className={styles.secH}><Settle as="h2" id="rooms-title" className="label" text="Five rooms" /><span className="label faint">The same five on every page</span></div>
        <Rooms works={WORKS.length} lessons={LESSONS.length} />
      </section>

      {/* ---------------------------------------------------------------- the Painted Stoa */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="stoa-title" data-fold="stoa">
        <div className={styles.stoaG}>
          <div>
            <div className={styles.secH}>
              <Settle className="label" text="From the Painted Stoa" />
              <span className={styles.secR}><span className="label faint">Diogenes Laertius · Lives 7.5</span><HomeFold id="stoa" title="From the Painted Stoa" className={styles.foldBtn} /></span>
            </div>
            <Settle as="h2" id="stoa-title" className={`${styles.h2} rv`} text="Why Stoics are called Stoics" />
            <p className="rv">The Stoa Poikile, the “Painted Colonnade”, stood on the north side of the Athenian Agora, hung with famous paintings such as the Battle of Marathon. Around 300 BC Zeno of Citium began to teach there, walking up and down the colonnade.</p>
            <p className="rv">His followers were first called Zenonians, then Stoics, “the people of the Stoa” (Diogenes Laertius, Lives 7.5).</p>
            <p className={`${styles.stoaMore} rv`} data-fold-hide="">The site&apos;s own Painted Stoa holds history, daily life, the strange and the brutal, told from the sources. Every entry says how sure we can be.</p>
          </div>
          <ReliefWindow pic="stele-woman-and-servant" className={`${styles.stele} rv`}
            alt="A tall marble gravestone topped with a small pediment: a young woman in a long draped dress looks down at a servant girl, carved at half her size, who holds up an open box to her."
            caption={<><b>Grave stele of a young woman and servant,</b> from Attica, c. 400–390 BC. The Metropolitan Museum of Art, New York (36.11.1). CC0.</>} />
        </div>
        <div className={styles.stoaCards} data-fold-hide=""><StoaCards cards={STOA_CARDS} styles={styles} /></div>
      </section>

      {/* ---------------------------------------------------------------- forum */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="forum-title" data-fold="forum">
        <div className={styles.secH}>
          <Settle as="h2" id="forum-title" className="label" text="What people are asking" />
          <span className={styles.secR}><span className="label faint">{AREAS.forum.name} · {AREAS.forum.english}</span><HomeFold id="forum" title="What people are asking" className={styles.foldBtn} /></span>
        </div>
        <p className={`${styles.lede} rv`} data-fold-hide="">Questions from beginners, help with a passage, and a debate each week. Reading is open to everyone; a free account lets you join in.</p>
        <div className="rv" data-fold-hide=""><ForumActivity styles={styles} /></div>
      </section>

      {/* ---------------------------------------------------------------- offline */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="offline-title" data-fold="offline">
        <div className={styles.secH}>
          <Settle as="h2" id="offline-title" className="label" text="Read without a connection" />
          <span className={styles.secR}><span className="label faint">{AREAS.downloads.name} · {AREAS.downloads.english}</span><HomeFold id="offline" title="Read without a connection" className={styles.foldBtn} /></span>
        </div>
        <div className={`${styles.offline} rv`} data-fold-hide="">
          <p className={styles.lede}>Download the original text collections once and keep reading on a train, a plane or a remote island. Your notes and saved words stay on this computer.</p>
          <OfflineActions />
        </div>
      </section>

      <GuideInvite />

      {/* ---------------------------------------------------------------- sources */}
      <section className={`wrap ${styles.sec} ${styles.credits}`} aria-labelledby="sources-title">
        <div className={styles.secH}><h2 id="sources-title" className="label">Sources for this page</h2></div>
        <ul>
          <li><b>The wall.</b> Plato, Apology, from its first words: Platonis Opera, ed. John Burnet, Oxford, via the Perseus Digital Library. Accents and spaces left out.</li>
          <li><b>The name.</b> Liddell, Scott and Jones, <i>A Greek-English Lexicon</i>, under <span lang="grc">μάθησις</span> and <span lang="grc">στοιχεῖον</span>. Euclid, Elements 1.1, Heiberg’s text, translated by T. L. Heath; Aristophanes, Assemblywomen 652, Hall and Geldart’s text; both via the Perseus Digital Library. The tablet, stylus and compass are drawn for this page.</li>
          <li><b>The Muses.</b> Hesiod, Theogony 1 and 76–79, translated by H. G. Evelyn-White (1914), via the Perseus Digital Library.</li>
          <li><b>Great Eleusinian Relief,</b> fragments of a Roman copy, c. 27 BC–AD 14. The Metropolitan Museum of Art, New York (14.130.9). CC0.</li>
          <li><b>Parthenon east frieze, block IV,</b> plaster cast, Acropolis Museum, Athens; original 5th century BC, British Museum. Photograph by Deiadameian, CC BY-SA 4.0.</li>
          <li><b>Grave stele of a young woman and servant,</b> Attica, c. 400–390 BC. The Metropolitan Museum of Art, New York (36.11.1). CC0.</li>
        </ul>
      </section>
    </Page>
  );
}
