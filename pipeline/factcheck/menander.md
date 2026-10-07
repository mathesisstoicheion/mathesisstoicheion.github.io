# Fact-check: Menander (web/src/wiki/authors/tlg0541.ts)

Checked 2026-10-07 by an independent checker who did not write the article.

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts` (Strabo 14.1.18 and 10.5.6; Diogenes Laertius 5.2.36
and 5.5.79; Pausanias 1.2.2 and 1.21.1; Athenaeus 13.8; Plutarch, *Pompey* 60.2 and *Comparison of Aristophanes and Menander*
2–3; 1 Corinthians 15.33–34; Clement, *Stromata* 1.14.59; Euripides fr. 1024 Nauck; the *Sententiae* 1.1–1.28) and read against
each sentence that points to it. Every `url` source was fetched: attalus.org (the lives page, the Greek Chronicles, Apollodorus
fr. 43); Suda On Line mu 589; Gellius 17.4 (LacusCurtius Latin); Wikipedia *Menander*, *Dyskolos*, *Cairo Codex* and *Ancient
Greek comedy* (raw wikitext); the site's LSJ (ἔφηβος, δύσκολος, in `pipeline/.cache/lsj`); BMCR 1997.10.07 and 2001.05.16
(Wayback copies); Allinson's 1921 Loeb (Internet Archive OCR: "The Transmission of Menander", "Extant Writings", bibliography);
the Bodmer Lab record; Harlfinger in *Forum Classicum* 1/2004 (Wayback copy); Smith's *Dictionary* on Perseids; GEDSH; Greek
Wikisource *Dyskolos* (raw text, lines 1–7 and 711–726); Quintilian 10.1 and Suetonius' *Life of Terence* (LacusCurtius);
Socrates Scholasticus 3.16 (New Advent); the Internet Archive records of Lefebvre 1907 (with its OCR preface), Gomme–Sandbach
1973 and Miller 1987; the Patras, CiNii, AbeBooks, ELTE and *Classical Review* records. The TEI headers in
`pipeline/.cache/corpus/first1k` were read for the three Ullmann *Sententiae* files and for Nauck's Euripides fragments. The
researcher's log (`pipeline/drafts/checked/tlg0541.md`) was read but not relied on.

Totals: **7 findings** (1 medium-high, 2 medium, 4 low). Every Greek quotation matches the Scroll letter for letter, and every
English quotation matches Jones, Hicks, Fowler, Yonge, the WEB, Butler, Rolfe, Zenos, LSJ, attalus.org or the reviews as cited.
The "our translation" renderings (*Dyskolos* 1–7 and 713–714 from Wikisource, Clement, the three *Sententiae*, Smith's Greek
of the Aristophanes of Byzantium saying) all match their Greek. No footnote points at the wrong passage. The main points:
- *The Imbrians* did reach the stage: the same note says Callippus acted it later. "Not every play reached the stage" is
  contradicted by the source.
- The Bodmer codex cannot have "fifty-two leaves" left if it had sixty-four pages (thirty-two leaves) in all; the three plays
  fill folios 1–26, so the 52 are pages.
- The timeline gives the Cairo codex "large parts of five comedies"; the sources give large parts of three and pieces of two.

---

### 1. *The Imbrians* was staged later: "Not every play reached the stage" is contradicted by the note itself
- **Claim:** "Not every play reached the stage: another note says that he wrote *The Imbrians* for the Dionysia of 302/1, but
  the performance did not take place because of the tyrant Lachares.[^3]" Timeline: `{ year: -302, … what: "*The Imbrians*,
  written for the Dionysia of 302/1, is not staged because of the tyrant Lachares", src: [3] }`
- **Problem:** The very next sentence of the same note (P.Oxy. 1235, on the cited attalus.org page) says the play was acted
  afterwards. So the example does not show a play that never reached the stage; it shows a production that was put off. The
  timeline entry, "is not staged", says the same wrong thing.
- **Evidence:** https://www.attalus.org/poetry/lives.html, Menander 2 (Grenfell and Hunt's translation): "This he wrote when
  Nicocles was archon [302/1 B.C.], … and issued it for production at the Dionysia; but it did not take place on account of
  the tyrant Lachares. The play was subsequently acted by the Athenian Callippus."
- **Suggested fix:** "Not every play was staged when planned: another note says that he wrote *The Imbrians* for the
  Dionysia of 302/1, but the performance did not take place because of the tyrant Lachares; the actor Callippus put it on
  later.[^3]" Timeline: "*The Imbrians*, written for the Dionysia of 302/1, is not staged then because of the tyrant Lachares
  (it was acted later by Callippus)".
- **Confidence:** high

### 2. "Fifty-two leaves" cannot remain from a book of sixty-four pages: the 52 are pages (26 leaves)
- **Claim:** "The book was a single gathering of sixteen sheets folded to make sixty-four pages, holding the *Samia*, the
  *Dyskolos* and the *Aspis*, of which fifty-two leaves and many scraps remain.[^16,18]"
- **Problem:** Sixteen sheets folded once make thirty-two leaves (sixty-four pages). Fifty-two leaves cannot survive from
  thirty-two. The Bodmer Lab record does say "52 identifiable papyrus folios", but the same record places the three plays on
  folios 1–26 (Samia 1–9v, Dyskolos 10r–20r, Aspis 20v–26v): twenty-six leaves, that is fifty-two pages. The record's "folios"
  is a slip for pages, and the article's "leaves" repeats it, which makes the sentence contradict itself. (A smaller point in
  the same paragraph: "more in October 1956 and September 1957". The record says the library received leaves in September and
  October 1956; in September 1957 Bodmer himself "took possession of some leaves" in Cairo. Close enough, but it was not the
  library receiving them.)
- **Evidence:** https://bodmerlab.unige.ch/constellations/papyri/barcode/1072205365: "The remains of this codex consist of 52
  identifiable papyrus folios and numerous fragments. The original codex would have contained complete copies of Menander's
  Samian (folios 1-9v), Dyskolos (folios 10r-20r), and Aspis (folios 20v-26v)"; "Quires: A single quire originally composed
  of 16 sheets (64 pages)"; "Bodmer himself took possession of some leaves of the Menander codex from Mahmoud Mohasseb in
  Cairo in September of 1957".
- **Suggested fix:** "… holding the *Samia*, the *Dyskolos* and the *Aspis*, which filled its first twenty-six leaves
  (fifty-two pages); these leaves survive in part, with many scraps.[^16,18]" Or simply: "… of which fifty-two pages and
  many scraps remain." Optionally: "and Bodmer himself acquired more leaves in Cairo in September 1957."
- **Confidence:** medium (the arithmetic is certain; how much of the twenty-six leaves survives is best left as "in part")

### 3. The Cairo codex did not give "large parts of five comedies"
- **Claim:** Timeline: `{ year: 450, approx: true, kind: "copy", what: "The Cairo codex, with large parts of five comedies, is
  copied", src: [14, 15] }`
- **Problem:** Neither source says "large parts" of five. Allinson (source 15) says "portions of five comedies", and that only
  three of them preserve continuous scenes. Wikipedia (source 14) gives large parts of three plays, about a hundred lines of
  *Heros* and sixty-four lines of an unknown play. The article's own prose says the same ("large parts of three comedies" plus
  about fifty lines of *Heros*), so the timeline contradicts the prose.
- **Evidence:** Allinson 1921, introduction, "Extant Writings" (archive.org, menanderprincipa00menauoft, OCR text): "The Cairo papyrus, discovered in Egypt in
  1905, contains portions of five comedies and some minor fragments as yet unidentified. Although no one play is complete,
  yet, in the case of three of them, continuous scenes are preserved". Wikipedia, *Cairo Codex*: "large parts of Epitrepontes
  … Perikeiromene … and Samia …, as well as some hundred lines of Heros (The Hero), and sixty-four lines of an otherwise
  unknown play".
- **Suggested fix:** "The Cairo codex, with large parts of three comedies and pieces of two more, is copied".
- **Confidence:** medium

### 4. Strabo gives the ephebe story as hearsay ("it is said")
- **Claim:** "Strabo says that the philosopher Epicurus served his time in Athens, and “that Menander the comic poet became an
  ephebus at the same time”.[^8]"
- **Problem:** Strabo does not vouch for it himself. Both statements depend on φασι, "they say" / "it is said". The article
  drops the qualification.
- **Evidence:** `npx tsx scripts/passage.ts tlg0099.tlg001 14.1.18`: «καὶ δὴ καὶ τραφῆναί φασιν ἐνθάδε καὶ ἐν Τέῳ καὶ
  ἐφηβεῦσαι Ἀθήνησι· γενέσθαι δʼ αὐτῷ συνέφηβον Μένανδρον τὸν κωμικόν». Jones: "And indeed it is said that Epicurus grew up
  here and in Teos, and that he became an ephebus at Athens, and that Menander the comic poet became an ephebus at the same
  time."
- **Suggested fix:** "Strabo reports the story that the philosopher Epicurus served his time in Athens, and “that Menander the
  comic poet became an ephebus at the same time”.[^8]"
- **Confidence:** low (Smith's *Dictionary* and modern accounts accept it; only the attribution is overstated)

### 5. "No copy of his plays came down through the Middle Ages" does not fit the article's own palimpsests
- **Claim:** "No copy of his plays came down through the Middle Ages: there are no Byzantine manuscripts of them.[^3]"
- **Problem:** The source (attalus.org) says only that there are no Byzantine manuscripts, that is, no copies made in the
  Middle Ages. But copies did come down through the Middle Ages: the article itself tells of the fourth-century Menander whose
  leaves were reused in a Syriac book of 886 and kept until the Vatican find. The article's source 17 (Harlfinger) also
  mentions a second fourth-century parchment Menander, the two leaves found by Tischendorf at Sinai in 1844, also partly
  written over in Syriac. As worded, the summary contradicts the transmission section. The transmission section's own wording
  ("no medieval copy of a play survives") is fine.
- **Evidence:** https://www.attalus.org/poetry/lives.html: "We do not have any Byzantine manuscripts of Menander's plays".
  Harlfinger (https://web.archive.org/web/20090508043006/http://www.forum-classicum.de/archiv104.htm): "hundert Verse in
  eleganter Majuskelschrift des 4. Jahrhunderts auf zwei Pergamentblättern (heute in St. Petersburg), die … Tischendorf bereits
  1844 im Katharinenkloster auf dem Sinai fand; … dass teilweise auch sie syrisch überschrieben wurden".
- **Suggested fix:** "No one copied his plays in the Middle Ages, or no such copy survives: there are no Byzantine manuscripts
  of them.[^3]"
- **Confidence:** low

### 6. Ullmann's pages 17–59 cover only one of the Scroll's three texts
- **Claim:** Editions: "M. Ullmann, *Die arabische Überlieferung der sogenannten Menandersentenzen* (Wiesbaden: Franz Steiner,
  1961), pp. 17–59.[^20]", with the note "The Greek lines in the Scroll, printed beside the Arabic tradition." The source label
  (20) also gives "pp. 17–59".
- **Problem:** The variants section rightly says the Scroll has three Greek texts from Ullmann's book. The TEI headers give
  pp. 17–59 for the first only (version Men Ar I). The second (Men Ar II) is pp. 64–73 and the third (Gregory of Nazianzus)
  pp. 77–80. So the page range does not cover "the Greek lines in the Scroll".
- **Evidence:** `pipeline/.cache/corpus/first1k/data/tlg0541/tlg042/`: grc1 `<biblScope unit="pp" from="17" to="59">`; grc2
  `from="64" to="73"`; grc3 `from="77" to="80"`. All three: Wiesbaden, Kommissionsverlag Franz Steiner, 1961.
- **Suggested fix:** "… (Wiesbaden: Franz Steiner, 1961), pp. 17–59, 64–73 and 77–80.[^20]" Change the source 20 label to match:
  "… pp. 17–59, 64–73 and 77–80".
- **Confidence:** low (bibliographical precision only)

### 7. The palimpsest's "unknown play": unknown in 2003, but source 1 now names it, and the first report hedged its authorship
- **Claim:** "… and half of the lines were from the *Dyskolos*, the other half from an unknown play.[^17,1]"
- **Problem:** The sentence is footnoted to both Harlfinger and Wikipedia, and they say different things. Harlfinger reports
  the 2003 announcement: the other half was an unknown comic text that "could also be by Menander". Wikipedia (source 1) says
  it is "another piece by Menander, so far unpublished, titled *Titthe*". So the article's "unknown play" is out of date by
  its own source 1. The 2003 report did not call that half certainly Menander's, although the article's "about 400 lines of
  Menander" does.
- **Evidence:** Harlfinger: "Die andere Hälfte … stelle einen unbekannten Lustspiel-Kontext dar, der auch von Menander stammen
  könne". Wikipedia, *Menander*: "The surviving leaves contain parts of the Dyskolos and 200 lines of another piece by
  Menander, so far unpublished, titled Titthe."
- **Suggested fix:** "… and half of the lines were from the *Dyskolos*, the other half from a comedy then unknown, which
  Wikipedia now identifies as Menander's *Titthe* (“The Nurse”).[^17,1]" Leave out the gloss if no source for it is added.
- **Confidence:** low

---

**Checked, no problems found in:**
- The life from attalus.org: IG 14.1184 (son of Diopeithes, of Cephisia; born under Sosigenes, 342/1; died aged 52 under
  Philippus, 292/1); Prolegomena 3 ("stayed for a long time with Alexis, and seems to have been instructed by him"; "He produced
  his first play as an ephebe, when Philocles was archon [322 B.C.]"; 108 plays); the *Dyskolos* production note (Lenaea,
  archon Demogenes, "January 316 B.C.", first prize, Aristodemus of Scarphe); the Ovid scholium (drowned swimming in the
  Piraeus harbour), rightly marked {legend}.
- Suda mu 589 (108 comedies; the note's "c.344/3-292/1 BC: OCD4"), and Wikipedia's "c. 342/341 – c. 290": the {debated} dates
  paragraph and the timeline entry are fair.
- Gellius 17.4 (Latin): Philemon won "ambitu gratiaque et factionibus saepenumero"; the "erubescis" question; 108 or 109
  plays; Apollodorus' 105 plays and 8 victories. The attalus.org English of the question is quoted exactly.
- Parian Marble B 13–14: "Demetrius set laws in Athens" 317/6; "Menander the comic poet won in Athens for the first time"
  316/5. "Do not quite agree" with the 317/16 Lenaean victory is a fair way to put it.
- Diogenes Laertius 5.36 (Pamphila: "he taught Menander the comic poet") and 5.79 (nearly tried as Demetrius' friend;
  Telesphorus "begged him off"). Hicks's "nephew" is the translation cited.
- Pausanias 1.2.2 (graves by the road up from Piraeus; «Μενάνδρου τοῦ Διοπείθους») and 1.21.1 (the statue sentence is
  quoted exactly).
- Strabo 10.5.6 (the Ceos law, the hemlock and those over sixty; Greek and Jones exact). Athenaeus 13.8 (*Arrhephoros* or
  *Auletris*; the speaker advised not to marry answers; Yonge's "The matter is decided—the die is cast"). Plutarch, *Pompey*
  60.2 (Caesar's Greek words at the Rubicon; no mention of Menander, so the article's caution is right).
- 1 Corinthians 15.33–34 (Greek and WEB exact); Clement 1.14.59 («ἰαμβείῳ συγκέχρηται τραγικῷ», rightly translated);
  Socrates 3.16 ("conversant with the tragedies of Euripides"); Nauck fr. 1024, TEI header Leipzig, Teubner, 1889, with
  χρήσθ’. (The Scroll's file reads ἤδη for ἤθη, which the article does not quote.) Wikipedia: the line "probably" from *Thais*.
- Plutarch, *Comparison* 2–3: all three quotations exact; "for readings, for instruction, and for dramatic competitions" exact.
- Quintilian 10.1.69 ("so perfect is his representation of actual life"; the careful study of Menander alone);
  Suetonius/Rolfe "thou half-Menander", with the backhanded "would that thy graceful verses had force as well".
- LSJ ἔφηβος ("one arrived at adolescence (i.e. the age of 18 years)") and δύσκολος ("prop. hard to satisfy with food …
  generally, hard to please, discontented, fretful, peevish"): both quoted correctly.
- Wikisource *Dyskolos* 1–7 (Pan comes out of the shrine of the nymphs at Phyle; «Κνήμων, ἀπάνθρωπός τις ἄνθρωπος σφόδρα
  καὶ δύσκολος πρὸς ἅπαντας»). Lines 713–714 («ἓν δ’ ἴσως ἥμαρτον ὅστις τῶν ἁπάντων ᾠόμην αὐτὸς αὐτάρκης τις εἶναι καὶ
  δεήσεσθ’ οὐδενός»): the "our translation" is accurate, and the line numbers are right. Lines 723–726 support "whom he had
  always kept at arm's length".
- Wikipedia, *Dyskolos*: about 969 lines, about 9 missing (Photiades); the only nearly complete play of New Comedy; Lenaea 316;
  Martin 1958; Phyle 13 miles north-west of Athens; act 4 (Gorgias goes down the well, Sostratos hauls Knemon out); the
  chorus between the acts.
- The Cairo codex: fifth century, Lefebvre, Kom Ishgaw, the jar of Dioscorus documents, the Egyptian Museum; 1907 and 1911
  editions (Allinson's bibliography; Internet Archive record of the 1907 book). Lefebvre's own 1907 preface (Internet Archive
  OCR) puts the first find at Kom Ishkaou in July 1905 and the codex find at the end of that year. This confirms Allinson's
  1905; the {debated} mark on the timeline could even be dropped. *Heros*: "about fifty consecutive lines from the opening",
  a twelve-line metrical hypothesis and a cast list (BMCR 1997).
- Allinson 1921: "restored to us since 1891 and, for the most part, since 1905"; "758 gnomic verses loosely attributed",
  with the footnote "various other Byzantine anthologies were current"; single Loeb volume. Wikipedia: Meineke 1855, Kock
  1888, "some 1650 verses or parts of verses"; Kassel–Austin and Arnott as standard; Austin's OCT unfinished; Sandbach 1972
  and 1990.
- Bodmer Lab: the contents; possible educational use; received September and October 1956, "said to have been purchased in
  Egypt"; the dates (Martin early 3rd, Turner 4th, Orsini late 4th), rightly {debated}; ΧΟΡΟΥ "written in large letters";
  Martin 1958; Kasser "with Colin Austin" 1969 for *Samia* and *Aspis*.
- Harlfinger: the Syriac codex "im Jahre 886" (catalogue); the fourth-century Menander codex; the washed-off text and Syriac
  sermons; *L'Osservatore Romano* of 6 December; Francesco D'Aiuto; Bodmer "Bibliophile".
- BMCR 1997 (Anderson): Allinson 1921, one volume; Arnott vol. 1 1979, vol. 2 1996; *Dis Exapaton* and the *Bacchides*;
  Terence's prologues on *Andria* and *Perinthia*; *Misoumenos* "work of 1970-94". BMCR 2001 (Goldberg): 1979–2000;
  "personal inspection of the Bodmer and Cairo codices" (said of the texts of vol. 3, but fair for the edition); Sandbach's
  eighteen plays; *Samia* 96 ff. and *Dyskolos* 430 ff. exactly as the variants section reports them.
- Smith's *Dictionary*: "To the same grammarian is ascribed the happy saying, Ὦ Μένανδρε, καὶ Βίε, πότερος ἆρ᾿ ὑμῶν πρότερον
  ἐμιμήσατο" (the "our translation" is fair, and {legend} is right); "several hundred lines … Γνῶμαι μονόστιχοι". GEDSH:
  "Menander the Wise"; the Greek monostichs, ed. Jaekel, "many of which were not original to Menander"; the Syriac "probably
  is a translation from the Greek …, the original of which is no longer extant".
- *Sententiae* 1.2, 1.11, 1.28: Greek exact, translations correct. TEI titles: Men Ar I, Men ar II, Gregory Nazianzen
  *Carmen morale* XXX; "pseudo-Menander"; Ullmann, Wiesbaden, 1961.
- Wikipedia, *Ancient Greek comedy*: everyday life; young lovers, stern fathers, cunning servants, sudden recognitions;
  influence through Plautus and Terence on Shakespeare, Ben Jonson and Molière.
- Editions: Martin 1958 (Bodmer Lab); Sandbach 1972 (Patras) and 1990 (*Classical Review* 41.1, Arnott's review);
  Gomme–Sandbach, London, OUP, 1973 (IA); Arnott, LCL 132, 459–460, Harvard and Heinemann, 1979–2000 (CiNii); Kassel–Austin,
  De Gruyter, 1998 (AbeBooks); Jaekel, Leipzig, Teubner, 1964 (ELTE); Miller, Penguin, 1987, "Miller, N. P" (IA).
- The left-out items in the header comment are rightly left out. Wikipedia itself doubts the Urbino report and gives
  "Whom the gods love" without a usable source. Wikipedia's "recovered in Egypt in 1952" for the Bodmer papyrus conflicts with
  the Bodmer Lab record.

**Could not verify / not checked in depth:**
- Kassel–Austin's Greek of the testimonia (the life rests on attalus.org's English translations, as the researcher's log says).
- Whether *Titthe* has since been published (finding 7 rests on Wikipedia's wording).
- The Bodmer page images (finding 2 rests on the record's own folio numbers and quire description).

**Findings: 7** (1 high: #1; 2 medium: #2, #3; 4 low: #4, #5, #6, #7).
