# Fact-check: Epicurus (web/src/wiki/authors/tlg0537.ts)

Checked 2026-10-07 by an independent checker who did not write the article.

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts` (Diogenes Laertius 10.1–29, 35, 39, 122–125,
127–133, 135, 139–140, 148 in Hicks's Greek and English; von der Mühll's Greek of *Menoeceus* 122 and 132–133 and *Vatican
Sayings* 5, 10–14, 23 and 52; Plutarch, *Live Unnoticed* 2–4, *Non posse* 1 and *Against Colotes* 1; Lucian, *Alexander* 47;
*Iliad* 1.68–70) and read against each sentence that points to it. Every `url` source was fetched: the Stanford Encyclopedia
(Konstan, read as text); Wikipedia *Epicurus*, *Diogenes of Oenoanda*, *Lucretius*, *Diogenes Laertius*, *Villa of the Papyri*,
*Herculaneum papyri*, *List of editiones principes in Greek*, *Crux (literary)* and *Leiden Conventions* (all as raw
wikitext); von der Mühll's Teubner of 1922 (Internet Archive: the preface in the OCR text, and pp. 49, 50, 61 and 62 read from
page images rendered from the scan's PDF); Bailey's *Epicurus: The Extant Remains* (Internet Archive OCR: preface and "MSS. and
Editions"). The TEI headers in `pipeline/.cache/corpus` were read for the Hicks and von der Mühll editions. The researcher's
log (`pipeline/drafts/checked/tlg0537.md`) was read but not relied on.

Totals: **8 findings**, none of them serious. There are no misquotations, and no footnote points at the wrong passage. Every
Greek quotation matches the Scroll letter for letter, and every English quotation matches Hicks, Harmon, Goodwin, the SEP or
Bailey as cited. The "our translation" renderings (von der Mühll's Latin, *VS* 10, 14 and 23) match the originals. The main
points:
- The timeline calls B "the oldest manuscript of Diogenes". No source says so, and by Dorandi's dating, which the article
  itself reports, P may be older.
- The will did not leave the garden *to* Hermarchus. It left everything to two trustees, Amynomachus and Timocrates, who were
  to keep the garden for Hermarchus and the school.
- The four-line English "summing up" of the *tetrapharmakos* is D. S. Hutchinson's free rendering of the papyrus, but the
  article gives it no translator.

---

### 1. B is not "the oldest manuscript of Diogenes" in any of the cited sources, and Dorandi's dating of P undercuts "oldest"
- **Claim:** Timeline: `{"year":1150,"approx":true,"kind":"copy","what":"B, the oldest manuscript of Diogenes, is written (twelfth century)","src":[11,12,32]}`. Transmission: "The oldest of the better class is B, a twelfth-century parchment book now in Naples.[^12,32]"
- **Problem:** Bailey (source 12) says only that B is the oldest *of the first class*. Von der Mühll (source 11) calls B the best ("optimus"), not the oldest. Wikipedia (source 32) gives no "oldest" at all. It dates B to the 12th century and P to the "11th/12th century", after Dorandi. The article itself reports that dating in the next sentence ("the more recent edition of Tiziano Dorandi puts it in the eleventh or twelfth"). On Dorandi's dating, P may be as old as B or older. So the timeline's "the oldest manuscript of Diogenes" has no source. The prose "oldest of the better class" is true only on Bailey's dating.
- **Evidence:** Bailey, p. 9 (archive.org, EpicurusTheExtantRemainsBaileyOxford1926_201309): "The oldest representative of the first class is B, the Codex Borbonicus gr. III. B. 29 … a parchment codex of the twelfth century". Von der Mühll, praef. p. IV: "Quorum optimus est codex B(urbonicus) gr. III B 29 saec. XII". Wikipedia, *Diogenes Laertius*: "Manuscript B (Codex Borbonicus) dates from the 12th century … Manuscript P (Paris) is dated to the 11th/12th century".
- **Suggested fix:** Timeline: "B, the chief manuscript of Diogenes (twelfth century), is written". Transmission: "In Bailey's account the oldest of the better class is B, a twelfth-century parchment book now in Naples.[^12,32]" Alternatively: "The best of the better class is B, a twelfth-century parchment book now in Naples.[^11,12,32]"
- **Confidence:** medium (timeline); low (prose)

### 2. The will left the garden to two trustees, to be kept for Hermarchus and the school
- **Claim:** "His will left the garden to Hermarchus and the school, freed four of his slaves, and provided for the children of his late friend Metrodorus.[^10]"
- **Problem:** The will gives "all my property" to Amynomachus and Timocrates. Its condition is that they place the garden at the disposal of Hermarchus and his fellow members to live and study in. Hermarchus is the user and head of the school, not the heir. (The freed slaves, four in number, and the provision for Metrodorus' children are correct.)
- **Evidence:** `npx tsx scripts/passage.ts tlg0004.tlg001 10.1.16 10.1.17` (Hicks): "I give and bequeath all my property to Amynomachus, son of Philocrates of Bate and Timocrates, son of Demetrius of Potamus … on condition that they shall place the garden and all that pertains to it at the disposal of Hermarchus … and the members of his society". Greek: «δίδωμι τὰ ἐμαυτοῦ πάντα Ἀμυνομάχῳ … καὶ Τιμοκράτει … ἐφʼ ᾧ τε τὸν μὲν κῆπον … παρέξουσιν Ἑρμάρχῳ».
- **Suggested fix:** "His will left his property to two friends in trust, on condition that they keep the garden for Hermarchus and the school; it freed four of his slaves and provided for the children of his late friend Metrodorus.[^10]"
- **Confidence:** medium

### 3. The English "summing up" of the tetrapharmakos is Hutchinson's free rendering, not the papyrus's words, and has no translator
- **Claim:** "… and a papyrus of the Epicurean Philodemus from Herculaneum sums them up: “Don't fear god, Don't worry about death; What is good is easy to get, and What is terrible is easy to endure.”[^3]"
- **Problem:** Wikipedia (source 3) cites this English to D. S. Hutchinson's introduction to *The Epicurus Reader* (Hackett, 1994). It names the papyrus, PHerc. 1005, 4.9–14, only as the origin. Hutchinson's lines are a loose imperative paraphrase: the papyrus has short statements ("god not to be feared, death not to be suspected …"), not commands. Everywhere else the article names the translator of a modern English version ("in David Konstan's English"). As written, readers will take these lines as the papyrus's own wording.
- **Evidence:** https://en.wikipedia.org/w/index.php?title=Epicurus&action=raw: `{{blockquote|Don't fear god,<br />Don't worry about death;<br />What is good is easy to get, and<br />What is terrible is easy to endure.<ref>{{cite book | last =Hutchinson | first =D. S. (Introduction) | title =The Epicurus Reader … | year =1994 | pages =vi}}</ref>|[[Philodemus]]|[[Herculaneum]] Papyrus, 1005, 4.9–14}}`. The researcher's log also says "Hutchinson's translation … the book was not opened".
- **Suggested fix:** "… and a papyrus of the Epicurean Philodemus from Herculaneum sums them up, in D. S. Hutchinson's free English: “Don't fear god, …”.[^3]"
- **Confidence:** medium (that the translator should be named); low (on how free the rendering is, since the Greek of PHerc. 1005 was not opened)

### 4. One of the two sources cited for "the Villa … was found in 1750" dates the villa's discovery to 1752
- **Claim:** "At Herculaneum the Villa of the Papyri was found in 1750 and gave up its first carbonised rolls in 1752;[^33,34]"
- **Problem:** Source 33 says 1750. Source 34 says the villa itself was discovered in 1752. The double footnote therefore puts a source that contradicts the 1750 date behind it. The usual date is 1750 (the well-diggers), so the article's fact is fine; only the footnote is wrong.
- **Evidence:** Wikipedia, *Villa of the Papyri*: "The Villa of the Papyri was discovered in 1750 by farmers when digging a well … the first papyri scrolls which were obtained in 1752". Wikipedia, *Herculaneum papyri*: "In 1752, workmen of the Bourbon royal family accidentally discovered what is now known as the Villa of the Papyri".
- **Suggested fix:** "At Herculaneum the Villa of the Papyri was found in 1750[^33] and gave up its first carbonised rolls in 1752;[^33,34]"
- **Confidence:** low (a footnote matter)

### 5. Hicks brackets many such notes, not two
- **Claim:** "Hicks's text in the Scroll puts two such notes in square brackets: one in the *Letter to Herodotus* that points to the *Larger Epitome* and the first book *On Nature*, and one after the first *Principal Doctrine* that begins “Elsewhere he says”.[^14,16]"
- **Problem:** The two examples are correct. But Hicks's Greek of the *Letter to Herodotus* alone has bracketed notes at 10.39, 10.40, 10.43 (twice), 10.44, 10.50 and later, so "puts two such notes" reads as a count and is wrong.
- **Evidence:** `npx tsx scripts/passage.ts tlg0004.tlg001 10.1.35 10.1.154`. Bracketed Greek includes 10.39 «[τοῦτο καὶ ἐν τῇ Μεγάλῃ ἐπιτομῇ φησι…]», 10.40 «[τοῦτο καὶ ἐν τῇ πρώτῃ Περὶ φύσεως…]», 10.43 «[οὐδὲ γάρ φησιν ἐνδοτέρω…]» and «[φησὶ δὲ ἐνδοτέρω…]», 10.44 «[φησὶ δʼ ἐνδοτέρω…]» and 10.50.
- **Suggested fix:** "Hicks's text in the Scroll puts such notes in square brackets, for example one in the *Letter to Herodotus* that points to the *Larger Epitome* and the first book *On Nature*, and one after the first *Principal Doctrine* that begins “Elsewhere he says”.[^14,16]"
- **Confidence:** medium

### 6. The deme is Epicurus' own; neither source puts both parents in Gargettus
- **Claim:** "His parents, Neocles and Chaerestrate, were Athenians of the village district (*deme*) of Gargettus.[^1,2]"
- **Problem:** Diogenes and the SEP both say that *Epicurus*, son of Neocles and Chaerestrate, was an Athenian of the deme of Gargettus. Neither gives his mother a deme. Wikipedia (not cited here) says the parents were Athenian-born and the father a citizen. The deme passed down the male line, so the father's deme is implied, but the sentence as written goes beyond its sources.
- **Evidence:** `tlg0004.tlg001 10.1.1` (Hicks): "Epicurus, son of Neocles and Chaerestrate, was as citizen of Athens of the deme Gargettus". SEP §2: "Epicurus, the son of Neocles and Chaerestrata, was an Athenian from the deme of Gargettus".
- **Suggested fix:** "His parents were Neocles and Chaerestrate, and he was an Athenian of the village district (*deme*) of Gargettus.[^1,2]"
- **Confidence:** low

### 7. Diogenes does not say to whom the "pot of cheese" letter was written
- **Claim:** "Their life was famously plain; Epicurus wrote to a friend: “Send me a little pot of cheese, that, when I like, I may fare sumptuously.”[^4]"
- **Problem:** Diogenes introduces the line only as coming from Epicurus' letters ("In his correspondence … And again"). The recipient is not named, so "to a friend" is the article's own addition.
- **Evidence:** `tlg0004.tlg001 10.1.11` (Hicks): "In his correspondence he himself mentions that he was content with plain bread and water. And again: Send me a little pot of cheese, that, when I like, I may fare sumptuously." Greek: «αὐτός τέ φησιν ἐν ταῖς ἐπιστολαῖς … καί, πέμψον μοι τυροῦ, φησί, κυθριδίου».
- **Suggested fix:** "Their life was famously plain; in one of his letters Epicurus wrote: “Send me a little pot of cheese, that, when I like, I may fare sumptuously.”[^4]"
- **Confidence:** low

### 8. "Kidney stone" is Hicks's medical gloss; the Greek says a stone that stopped his urine
- **Claim:** "His successor Hermarchus wrote that he died of a kidney stone after an illness of a fortnight.[^8]"
- **Problem:** Hicks's English has "renal calculus", so the article follows its source. But the Greek does not name the kidney: «λίθῳ τῶν οὔρων ἐπισχεθέντων», "his urine being stopped by a stone". Source 3 (Wikipedia) puts it as a stone blockage of the urinary tract. In the last letter (10.22) Epicurus himself names strangury (painful, blocked urination). "Kidney stone" claims more than the evidence does.
- **Evidence:** `tlg0004.tlg001 10.1.15`: «τελευτῆσαι δʼ αὐτὸν λίθῳ τῶν οὔρων ἐπισχεθέντων, ὥς φησι καὶ Ἕρμαρχος ἐν ἐπιστολαῖς, ἡμέρας νοσήσαντα τεσσαρεσκαίδεκα». Hicks: "Epicurus died of renal calculus after an illness which lasted a fortnight". Wikipedia, *Epicurus*: "from a stone blockage of his urinary tract".
- **Suggested fix:** "His successor Hermarchus wrote that he died when a stone blocked his urine, after an illness of a fortnight.[^8]"
- **Confidence:** low

---

**Checked, no problems found in:**
- Diogenes 10.1–2: Neocles and Chaerestrate; Gargettus; brought up on Samos after the Athenian settlement; Athens at eighteen; expulsion by Perdiccas after Alexander's death; Colophon and his father; philosophy at fourteen ("He says himself"); the schoolmasters and Hesiod's chaos (Apollodorus), rightly told as "the story went".
- Diogenes 10.3 (three brothers; the slave Mys), 10.9 (the School continuing "while nearly all the others have died out"), 10.10 (friends "from all parts" in the garden; eighty minae, from Apollodorus, fairly given as "Diogenes reports"), 10.11 (plain life; the cheese quotation exact), 10.12 (Diocles: treatises by heart), 10.13 (Nausiphanes; "self-taught"; ordinary terms; "so lucid a writer …" exact), 10.14–15 (Ol. 109.3 birth; school at Mytilene and Lampsacus; died aged seventy-two; Hermarchus; a fortnight), 10.16–23 (four slaves freed: Mys, Nicias, Lycon, Phaedrium; Metrodorus' children; the Idomeneus letter, both quotations exact), 10.26–29 (about three hundred rolls; *On Nature* in thirty-seven books; the three letters as an epitome; their subjects), 10.35 (the epitome for those who cannot study all the physical writings).
- Hicks's heading "EPICURUS (341-271 B.C.)"; both TEI headers name Hicks, Harvard / Heinemann, 1925. The von der Mühll headers name Leipzig, Teubner, 1922, for all five Epicurus files (Herodotus, Pythocles, Menoeceus, Principal Doctrines, Vatican Sayings).
- All quotations from the letters and doctrines: 10.39 (Greek and English, with the bracketed note), 10.122, 10.123 («θεοὶ μὲν γάρ εἰσιν», "For verily there are gods"), 10.124–125 (Greek and English), 10.128 («ἀταραξίαν»; "to be free from pain and fear"), 10.131 (bread and water; "When we say, then …"; "By pleasure we mean …"), 10.132, 10.133 («διαγελῶντος»; "Destiny … he laughs to scorn"), 10.135 («ζήσεις δὲ ὡς θεὸς ἐν ἀνθρώποις», "wilt live as a god among men"), 10.139 (PD 1 and 2), 10.140 (PD 5 with angle brackets), 10.148 (PD 27).
- Von der Mühll's Greek and notes: *Men.* 132 with angle brackets ("hiatum explevit Steph., cf. Rat. Sent. V"); *Men.* 133 «†ἀγγέλλοντος * *», "ἀγγέλλοντος BFZf … corruptum", the following lines "mihi scholion esse videntur", and "διαγελῶντος ⟨…⟩ suppl. Us."; *VS* 5 one way only; *VS* 10 "= Metrodori fr. 37 Koerte", "Hom. Il. A 70"; *VS* 14 "κύριος Stob.: om. Vat.", "τὸν καιρόν Stob.: τὸ χαῖρον Vat."; *VS* 23 "ἀρετή Vat., corr. Us."; *VS* 52 Greek exact. Iliad 1.70 matches the line in *VS* 10.
- Von der Mühll's preface: "Epicuri parcam et obscuram brevitatem, quam in epistolis et sententiis affectabat" ("sparing and obscure brevity", fair); two classes of manuscripts; B twelfth century, Naples; P (Paris. gr. 1759) "ineunte saec. XIV", corrected by many hands; F (Laur. 69.13) thirteenth century; the single very faulty copy at Constantinople "saeculo circiter nono … suspicamur"; marginal notes woven into the text, hard to separate, especially in Herodotus and Pythocles; Pythocles doubted already by Philodemus but genuine in his view; the Oenoanda inscription shows the doctrines "vario ordine"; *VS* in Vat. gr. 1950, fourteenth century, found by Wotke in 1888, first edited by Usener in Wiener Studien X; made from Principal Doctrines and the letters of Epicurus, Metrodorus, Polyaenus and Hermarchus; re-collation of the manuscripts. Title page as given in the editions list.
- Bailey: "the extreme difficulty of the writings of Epicurus"; the remains embodied in Diogenes book 10, so the text of Epicurus is that of Diogenes' manuscripts; scholia interwoven, especially in Herodotus and Pythocles; P "much corrected", beginning of the fourteenth century; F twelfth (Usener) against thirteenth (von der Mühll); inclines to Usener's view that Pythocles is a compilation; sixteenth-century editors had inferior manuscripts, though their conjectures survive; Stephanus 1570; the Gassendi quotation exact; Gassendi 1649 "practically re-wrote the text"; Usener 1887, the whole range of classical literature, a fresh start; von der Mühll re-read the manuscripts and added new ones; Wotke "with some notes by Usener and Gomperz", Wiener Studien X (1888).
- SEP (Konstan; first published 10 Jan 2005, substantive revision 8 July 2022): 341, 323, Colophon in 321 "on the coast of what is now Turkey", Nausiphanes, "Ten years later" Mytilene and Lampsacus, 307/06, death in 270 "at the age of seventy or seventy-one"; Diogenes third century, tenth and final book; the letters' subjects; doctrines and sayings "to make the core doctrines easy to remember"; Herculaneum, 79, "almost certainly … Philodemus"; Lucretius, six books; Cicero especially on ethics; atoms and void "above all Democritus"; the swerve (chiefly later sources; "not entirely clear how the swerve operates"), rightly {debated}; *VS* 52 in Konstan's English exact; *VS* 23 "or is a virtue, if we follow the manuscript reading"; Menoeceus "a précis"; Pythocles genuine; Arrighetti 1973 "the standard edition" (Einaudi, Turin); Usener "still" the fullest; Bailey 1926; Long and Sedley 1987 (Greek in vol. 2, by topic); Dorandi 2013; Mensch 2018 on Dorandi's text; Inwood and Gerson 1997, Epicurean part published separately.
- Wikipedia, *Epicurus*: military training at Athens (the article's "it seems" is right); Mytilene about 311; women students including Themista and Leontion; the Idomeneus letter "uncertain" but accepted by "the vast majority of scholars"; forty doctrines; tetrapharmakos, the four drugs, Roman-era Epicureans; Isocrates; the letter to his mother accepted by most scholars; 1888 and eighty-one sayings; Christian critics; "virtually extinct" by the early fifth century; Dante's flaming coffins; Poggio 1417.
- Wikipedia, *Diogenes of Oenoanda*: second century, Hadrianic dating (117–138) against the older late-second-century one; about 25,000 words; portico wall; wealthy; "to help also those who come after us"; discovered 1884; first 64 fragments published 1892; the letter to Epicurus' mother. Wikipedia, *Lucretius*: Cicero to Quintus, February 54 BC; "almost lost during the Middle Ages"; 1417, Poggio. Wikipedia, *Herculaneum papyri*: first rolls autumn 1752; Piaggio's machine 1756; silk threads; the beginning of every roll destroyed; large parts of *On Nature* 14, 15, 25, 28. Wikipedia, *Diogenes Laertius* and *editiones principes*: Traversari's Latin, Rome 1472; Froben, Basel, 1533 (the OCR of both von der Mühll and Bailey reads 1523 in the running text, but Bailey's own list of sigla reads "MDXXXIII", and 1533 is the standard date); Estienne 1570; Meibom 1692 and the paragraph numbers; Long 1964, Marcovich 1999–2002, Dorandi 2013. *Crux* and *Leiden Conventions* support the explanations of the dagger and the angle brackets.
- Plutarch, *Live Unnoticed* 2–4: «λάθε βιώσας»; Epicurus addressed by name; letters "with your Asiatic friends"; books sent "to women as well as men". "Live concealed" is the wording of the Scroll's old translation (it is in the title and the first sentence of the Goodwin/Whitaker file). *Non posse* 1 and *Against Colotes* 1: Colotes as Epicurus' disciple; two treatises.
- Lucian, *Alexander* 47: «τὰς Ἐπικούρου κυρίας δόξας», burnt in the middle of the market-place; "what peace, tranquillity, and freedom it engenders in them" exact.
- LSJ glosses used for κῆπος, ἀταραξία ("calmness"), διαγελάω, ἀγγέλλω, αἱρετός, καιρός are standard and correct.
- Editions list: von der Mühll 1922, Hicks 1925, Usener 1887, Bailey 1926, Arrighetti 2nd ed. 1973, Long–Sedley 1987, Dorandi 2013 with Mensch 2018, and Inwood–Gerson 2nd ed. 1997 all match the SEP bibliography, the title pages or the TEI headers.
- Timeline: the years, kinds, `approx` flags and the two {debated} entries (death year, Oenoanda dating) agree with the sources, except finding 1.
- Left-out items in the header comment (lathe biosas as a motto, the garden "outside the walls", the birthday, common property) are rightly left out. Diogenes 10.11 does say that Epicurus rejected holding property in common.

**Could not verify / not checked in depth:**
- The Greek of PHerc. 1005 col. 4 and Hutchinson's book itself (finding 3 rests on Wikipedia's citation).
- Dorandi's own edition (his dating of P is known here only through Wikipedia).
- Bailey's page images were not opened; the OCR text was clear for every passage used.

**Findings: 8** (3 medium: #1 timeline, #2, #5; 1 medium/low: #3; 4 low: #4, #6, #7, #8). None is a serious factual error.
