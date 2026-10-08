/**
 * The Guide's small moving pictures, one for each chapter: drawings of the real controls, in the site's own
 * colours, that play a few seconds of what the control does and then rest. Every Greek line, meaning and
 * transliteration in them is the site's own (the Iliad and Murray's English in the Scroll, LSJ, lib/translit).
 * With reduced motion they show their finished state.
 */
import styles from "./Guide.module.css";

const Frame = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className={styles.pic} role="img" aria-label={label}>
    <div className={styles.picBar} aria-hidden="true"><i /><i /><i /></div>
    <div className={styles.picBody} aria-hidden="true">{children}</div>
  </div>
);

export function Picture({ id }: { id: string }) {
  switch (id) {
    case "find":
      return (
        <Frame label="A search box: typing homer finds the Iliad and the Odyssey.">
          <div className={styles.fSearch}><span className={styles.fTyped}>homer</span><span className={styles.caret} /></div>
          <ul className={styles.fList}>
            <li><b>Homer</b><span>Iliad</span><em>Greek · English</em></li>
            <li><b>Homer</b><span>Odyssey</span><em>Greek · English</em></li>
          </ul>
        </Frame>
      );
    case "read":
      return (
        <Frame label="The reader: the first line of the Iliad in Greek, with Murray's English beside it.">
          <div className={styles.rRow}>
            <span className={styles.rNo}>1.1</span>
            <span className={styles.rGr} lang="grc">μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος</span>
            <span className={styles.rEn}>The wrath sing, goddess, of Peleus&apos; son, Achilles…</span>
          </div>
          <div className={styles.rCols}><i>Both</i><i>Greek</i><i>English</i></div>
        </Frame>
      );
    case "word":
      return (
        <Frame label="Clicking the word μῆνιν opens its meaning: wrath.">
          <p className={styles.wLine} lang="grc"><span className={styles.wHit}>μῆνιν</span> ἄειδε θεὰ</p>
          <div className={styles.wCard}>
            <b lang="grc">μῆνις</b>
            <span>noun · accusative singular</span>
            <span className={styles.wMean}>wrath <small>(LSJ)</small></span>
          </div>
          <span className={styles.wPointer} />
        </Frame>
      );
    case "aids":
      return (
        <Frame label="Reading aids: transliteration shows mēnin aeide thea under the Greek.">
          <div className={styles.aChips}><i data-on="">Transliteration</i><i>Colour by case</i><i>Vocabulary</i></div>
          <p className={styles.aGr} lang="grc">μῆνιν ἄειδε θεὰ</p>
          <p className={styles.aTr}>mēnin aeide thea</p>
        </Frame>
      );
    case "keep":
      return (
        <Frame label="A passage highlighted, bookmarked and given a note, all kept in the Treasury.">
          <p className={styles.kLine} lang="grc"><span className={styles.kMark}>μῆνιν ἄειδε θεὰ</span> Πηληϊάδεω</p>
          <span className={styles.kRibbon} />
          <div className={styles.kNote}>The first word is wrath.</div>
          <div className={styles.kTools}><i>Bookmark</i><i className={styles.kSw} /><i>Note</i><i>Notebook</i></div>
        </Frame>
      );
    case "search":
      return (
        <Frame label="A concordance: four lines of the Iliad lined up on the word μῆνιν.">
          <ol className={styles.sConc} lang="grc">
            <li><span>Il. 1.1</span><b>μῆνιν</b> ἄειδε θεὰ Πηληϊάδεω</li>
            <li><span>Il. 1.75</span><b>μῆνιν</b> Ἀπόλλωνος ἑκατηβελέταο</li>
            <li><span>Il. 5.444</span><b>μῆνιν</b> ἀλευάμενος ἑκατηβόλου</li>
            <li><span>Il. 16.711</span><b>μῆνιν</b> ἀλευάμενος ἑκατηβόλου</li>
          </ol>
        </Frame>
      );
    case "learn":
      return (
        <Frame label="Letter cards: alpha, beta, gamma, delta, each with its name.">
          <div className={styles.lTiles}>
            {[["Α α", "alpha"], ["Β β", "beta"], ["Γ γ", "gamma"], ["Δ δ", "delta"]].map(([g, n]) => (
              <div key={n} className={styles.lTile}><b lang="grc">{g}</b><span>{n}</span></div>
            ))}
          </div>
        </Frame>
      );
    case "explore":
      return (
        <Frame label="A small map with Athens, Delphi and Sparta marked.">
          <svg className={styles.eMap} viewBox="0 0 240 130">
            <path className={styles.eCoast} d="M20 30 C55 18 80 40 105 32 S150 15 170 34 S200 70 182 92 S140 118 118 104 S80 120 60 100 S28 70 20 30 Z" />
            <path className={styles.eRoute} d="M140 66 C120 52 100 50 84 48" />
            <g className={styles.ePlace} style={{ ["--d" as string]: "0.2s" }}><circle cx="140" cy="66" r="4" /><text x="148" y="70">Athens</text></g>
            <g className={styles.ePlace} style={{ ["--d" as string]: "0.7s" }}><circle cx="84" cy="48" r="4" /><text x="50" y="40">Delphi</text></g>
            <g className={styles.ePlace} style={{ ["--d" as string]: "1.2s" }}><circle cx="104" cy="96" r="4" /><text x="112" y="100">Sparta</text></g>
          </svg>
        </Frame>
      );
    case "talk":
      return (
        <Frame label="A question in the forum, an answer, and a vote in the Pnyx.">
          <div className={`${styles.tBubble} ${styles.tAsk}`}>What does <span lang="grc">ἄειδε</span> mean here?</div>
          <div className={`${styles.tBubble} ${styles.tAns}`}>“Sing!”: Homer asks the goddess to sing.</div>
          <div className={styles.tVote}><span>For</span><i /><span>Against</span></div>
        </Frame>
      );
    case "settings":
      return (
        <Frame label="Settings: the Greek text growing larger, and the page switching between light and dark.">
          <div className={styles.zPage}>
            <p className={styles.zGr} lang="grc">μῆνιν ἄειδε θεὰ</p>
            <div className={styles.zSlider}><small>Aa</small><i /><b>Aa</b></div>
          </div>
        </Frame>
      );
    default:
      return null;
  }
}
