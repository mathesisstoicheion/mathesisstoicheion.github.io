# Fact-check: Isocrates

Article: `web/src/wiki/authors/tlg0010.ts`. Checked 2026-10-06.

Method. Every `cite` source was opened with `scripts/passage.ts` and read against each sentence that points to it: the *Lives of the
Ten Orators* 4.1, *Antidosis* 4–9, 59–66, 161 and 270–272, *Panathenaicus* 1–11 and 266–270, *To Philip* 81, *Against the Sophists*
14–15, *Panegyricus* 1–4 and 47–50, Letter 3.1–6, Dionysius *On Isocrates* 1, 2 and 18, and *Phaedrus* 278–279. The url sources were
fetched and read in full:
- Jebb's Britannica article, the rendered Wikisource text.
- Wikipedia, as raw wikitext.
- Norlin's Loeb vols. 1 and 2, the Internet Archive OCR text: the general introduction, the bibliography, the *To Demonicus* introduction, the *Antidosis* and *Panathenaicus* introductions, and the Loeb page at *Antidosis* 59–66.
- Cicero, *De oratore* 2, on The Latin Library.
- Engels's review, the PDF.
- The archived Monash exhibition page and Pearse's Kellis page.
- BMCR 2019.08.02 and 2005.02.43.
- The Onassis Library record.
- The UT Press page.
- The Milton Reading Room page.

The Zenon record would not open: it is blocked by a bot check. Edition dates were compared with the Perseus TEI headers in
`pipeline/.cache/corpus/perseus/data/tlg0010` and with the catalogue labels. The researcher's log was read, but I did not rely on it.

Totals: **9 findings**. There are no misquotations. Every Greek quotation matches the Scroll's text, and every English quotation matches its source. The real slips are:
- The Kellis codex was found in January 1988, not "in the 1990s".
- The 360–380 date for the Kellis codex is an inference on Roger Pearse's page, not something "the excavators thought".
- Dionysius I of Syracuse is listed as fact among the leaders Isocrates asked to lead the war. The article's own Norlin source calls that appeal "extremely unlikely".
- Mandilaras's 206 "codices antiqui" are not all "written before the fifteenth century". Engels, the source cited, says so.

The other findings are dropped qualifications.

---

### 1. The Kellis codex was found in 1988, not "in the 1990s"
- **Claim:** "In the 1990s a team from Monash University digging at Kellis, in Egypt's Dakhleh Oasis, found a wooden book in the sand of a house: the oldest surviving complete set of these speeches.[^23]"
- **Problem:** Source 23, the Monash exhibition page, gives no year for the find. "During the 1990's" comes from Pearse's page (source 24), and Wikipedia has "a 1990's excavation". Both describe the excavations in general terms. The Isocrates codex was found on 20 January 1988, together with the Kellis Agricultural Account Book, in the kitchen of House 2. The Monash page does agree that the two wooden codices were found together "in sand above the floor of the kitchen of House 2 in Area A".
- **Evidence:** 4CARE database, artefact 430 (the Kellis Agricultural Account Book; the entry is based on Bagnall et al., *The Kellis Agricultural Account Book*, 1997), https://4care-skos.mf.no/artefacts/430/: "Found on January 20th 1988 together with another wooden codex containing three orations of Isocrates (P.Kellis III), in the south-east corner of the kitchen of House 2 in Area A of the site." Monash page (source 23): "Two intact wooden codices were found in sand above the floor of the kitchen of House 2 in Area A, they are the Kellis Agricultural Account Book and The Kellis Isocrates Codex."
- **Suggested fix:** "In 1988 a team from Monash University digging at Kellis, in Egypt's Dakhleh Oasis, found a wooden book in the sand of a house: the oldest surviving complete set of these speeches.[^23]" Also add the 4CARE record (or Bagnall 1997) as a source for the year. Alternatively, drop the decade: "A team from Monash University digging at Kellis … found …".
- **Confidence:** high.

### 2. The 360–380 date is Pearse's inference, not "the excavators'", and the codex was the schoolmaster's copy, not written "for" him
- **Claim:** "The excavators thought it may have been written between about 360 and 380 AD, probably for a local schoolmaster.[^24]"
- **Problem:** Pearse (source 24) says the codex "may have been written at the same time as the account book below (so 360-380 AD)". The "so 360-380" is his own sum, worked out from the account book's dates ("the mid-360s or 370s"). It is not given as the excavators' view. What Pearse does attribute to the project concerns ownership: "Members of the project believe that it was probably the copy of a local schoolmaster". That means the schoolmaster owned or used the book. It does not say the book was written for him.
- **Evidence:** https://tertullian.org/rpearse/manuscripts/kellis.htm: "The first of these is known as the Isocrates Codex and may have been written at the same time as the account book below (so 360-380 AD)." Also: "Members of the project believe that it was probably the copy of a local schoolmaster as the general quality of the handwriting and the spelling errors make it unlikely that it was owned by a refined scholar." On the account book: "The records deal with a four year period in either in the mid-360s or 370s."
- **Suggested fix:** "It was found with a wooden account book of the 360s or 370s and may be of the same date; members of the project thought it was probably a local schoolmaster's copy.[^24]"
- **Confidence:** medium-high.

### 3. Dionysius I among the leaders he appealed to: the article's own Norlin doubts it
- **Claim:** "The cities would not unite, so he looked for one strong man to lead them, among others Dionysius I of Syracuse and Archidamus of Sparta, and at last, in *To Philip* (346 BC), Philip of Macedon.[^7,2]"
- **Problem:** Jebb (source 7) and Wikipedia (source 2) do name Dionysius I. But Norlin (source 1, used throughout the article) argues against it in a long note. Isocrates' letter to Dionysius asks only for "some service" for Greece. It is "extremely unlikely" that he asked Dionysius to lead the expedition against Persia. The only evidence for it is a letter attributed to Speusippus, which Norlin calls "worthless". Wikipedia also hedges on Archidamus ("later possibly King Archidamus"). The researcher left out Jason and Alexander of Pherae because the sources disagree. Dionysius is in the same position, but the article states him as fact.
- **Evidence:** Norlin, vol. 1, General Introduction, p. xl, note (Internet Archive OCR): "The fragment of the letter to Dionysius shows only that Isocrates appealed to him to perform 'some service' for the good of Greece. It is extremely unlikely that he should have appealed to Dionysius … to head the expedition against Persia. … Obviously, the letter is worthless as evidence on this point." Wikipedia: "first King Agesilaus of Sparta, then Dionysius I of Syracuse, then Alexander of Pherae, and later possibly King Archidamus of Sparta." Jebb: "Jason of Pherae, Dionysius I. of Syracuse, Archidamus III. … each in turn rose as a possible leader".
- **Suggested fix:** "The cities would not unite, so he looked for one strong man to lead them: Archidamus of Sparta, perhaps Dionysius I of Syracuse (Norlin doubted that he ever asked Dionysius to lead the war), and at last, in *To Philip* (346 BC), Philip of Macedon.[^7,2,1]"
- **Confidence:** medium.

### 4. Mandilaras's 206 "codices antiqui" are not all "written before the fifteenth century"
- **Claim:** "Mandilaras lists 206 manuscripts written before the fifteenth century and 197 later ones.[^22]"
- **Problem:** Engels (source 22) does give the numbers this way. In the very next sentence, though, he objects that Mandilaras put some late manuscripts among the "codices antiqui", including some from the 16th century that depend entirely on older copies. So "written before the fifteenth century" does not hold for all 206, by the source's own account.
- **Evidence:** Engels, *Exemplaria Classica* 12 (2008), p. 2: "kurze Angaben zu 206 codices antiqui (p. 11-59), die vor dem 15. Jh. geschrieben wurden, und 197 jüngeren codices recentissimi … Dabei ist aber die Zuweisung einzelner später und gänzlich von älteren Handschriften abhängiger Manuskripte sogar noch des 16. Jh. zu den codices antiqui nicht leicht nachvollziehbar."
- **Suggested fix:** "Mandilaras lists 206 older manuscripts (his “codices antiqui”, most of them written before the fifteenth century) and 197 later ones.[^22]"
- **Confidence:** medium.

### 5. The lost *Art of Rhetoric* is given as his without the ancient doubts
- **Claim:** "Besides these there are nine letters, and a lost *Art of Rhetoric* known only from scattered quotations.[^7,1]"
- **Problem:** Jebb (source 7), in the very passage cited, adds that Quintilian and Photius, who had seen this *Art*, doubted that it was genuine. The *Lives* (source 3) reports both sides: some say he wrote textbooks, others that he taught by practice, not by method. Engels (source 22) also writes "if indeed Isocrates himself wrote such a textbook". The article drops this.
- **Evidence:** Jebb: "No lost work of Isocrates is known from a definite quotation, except an 'Art of Rhetoric,' from which some scattered precepts are cited. Quintilian, indeed, and Photius, who had seen this 'Art,' felt a doubt as to whether it was genuine." `npx tsx scripts/passage.ts tlg0007.tlg121 4.1`: "Some say that he also wrote textbooks of oratory, others that in his teaching he made use of practice, not of method." Engels p. 12: "falls denn tatsächlich bereits Isokrates selbst ein solches Lehrbuch verfaßt haben sollte".
- **Suggested fix:** "Besides these there are nine letters, and a lost *Art of Rhetoric*, known only from scattered quotations; even in antiquity some doubted that it was his.[^7,1,3]"
- **Confidence:** medium.

### 6. The Scroll's text does not "follow the short form" of Γ; the Loeb simply leaves the passages out
- **Claim:** "Γ gives these self-quotations in shortened form, while Θ and Λ copy them out in full.[^26] The Scroll's text follows the short form: at [section 66](cts:tlg0010.tlg019:66) it gives only a pointer to the passages of *On the Peace* that were read.[^28]"
- **Problem:** The BMCR review (source 26) says Γ gives the quotations "in forma abbreviata". Nothing says that Norlin's Loeb text, which the Scroll uses, follows Γ here. The Loeb leaves the extracts out and sends the reader to the pages of its own volumes where those speeches are printed. That is a modern editor's cross-reference. The Perseus file has an empty `<quote>` with a reference. Section 59 does the same for the *Panegyricus* extract. Calling this "the short form" links it to Γ without support.
- **Evidence:** `npx tsx scripts/passage.ts tlg0010.tlg019 59 66`: 59 ends "Isoc. 4.51-99"; 66 is only "Isoc. 8.25-56; Isoc. 8.132-145". In the TEI it is `<cit><quote type="Extract"/><bibl …>`. Norlin, vol. 2 (Internet Archive OCR), Antidosis 65–69: "[Extracts from oration On the Peace 25-56, 132 to the end. See this Vol. pp. 22-43, 90-97.]"; at 59: "[Extract from the Panegyricus 51-99. See Isocrates, Vol. I. pp. 148-181, L.C.L.]". BMCR 2019.08.02: "mentre Γ le riproduce in forma abbreviata, i due testimoni primari della seconda famiglia … riportano il testo per intero."
- **Suggested fix:** "The Scroll's text, from Norlin's Loeb, does not print them again: at [section 66](cts:tlg0010.tlg019:66) it gives only a pointer to the passages of *On the Peace* that were read.[^28]"
- **Confidence:** medium.

### 7. In the *Panathenaicus* the "contrasted and balanced phrases" are his earlier style, which he says he has now given up
- **Claim:** "In the *Panathenaicus* he describes his own writing as rich in «ἀντιθέσεων καὶ παρισώσεων», “contrasted and balanced phrases”.[^5]"
- **Problem:** The quotation is exact. But the passage is about the speeches of his younger years ("When I was younger …"). In the next section he says that at ninety-four he has given these devices up entirely. As written, the sentence suggests this was how he described his writing in general.
- **Evidence:** `npx tsx scripts/passage.ts tlg0010.tlg021 1 11`: 1: "When I was younger, I elected not to write …"; 2: "writing in a style rich in many telling points, in contrasted and balanced phrases not a few …"; 3: «νῦν δʼ οὐδʼ ὁπωσοῦν τοὺς τοιούτους» ("Now, however, I have completely given up these devices of rhetoric. For I do not think it is becoming to the ninety-four years which I have lived …").
- **Suggested fix:** "In the *Panathenaicus* he describes the speeches of his younger days as rich in «ἀντιθέσεων καὶ παρισώσεων», “contrasted and balanced phrases”, devices he says he gave up in old age.[^5]"
- **Confidence:** medium (on what the source says); low (on how much it matters).

### 8. The *Lives* gives the Chios school only as "as some say"
- **Claim:** "{debated} The *Lives* says he first taught on the island of Chios, with nine pupils;[^3]"
- **Problem:** The *Lives* does not say this in its own voice. It reports it as a tradition: «ὣς τινές φασι», "as some say". The {debated} label is right, but the sentence drops the source's own hedge.
- **Evidence:** `npx tsx scripts/passage.ts tlg0007.tlg121 4.1`: «σχολῆς δʼ ἡγεῖτο, ὣς τινές φασι, πρῶτον ἐπὶ Χίου, μαθητὰς ἔχων ἐννέα», "became the head of a school, at first, as some say, at Chios, where he had nine pupils".
- **Suggested fix:** "{debated} The *Lives* reports that, as some said, he first taught on the island of Chios, with nine pupils;[^3]"
- **Confidence:** medium (on the wording); low (on how much it matters).

### 9. "Published in 339 BC" is stated flatly, but the cited Engels review suggests 338
- **Claim:** "It was published in 339 BC.[^16]" (and the timeline: `{ year: -339, … "Finishes the *Panathenaicus* at ninety-seven, after three years of illness" }`)
- **Problem:** Norlin (sources 1 and 16) does say 339, a year before his death. But the article's own source 22 suggests that the completion "should perhaps now be dated more precisely" to 338, shortly before his death. The *Lives* says "a year (or, as some say, four years) before his end". The date is not settled.
- **Evidence:** Norlin, vol. 2, Panathenaicus introduction: "The Panathenaicus was, therefore, issued in 339 B.C., when the author was ninety-seven years old." Engels, p. 2: "Allerdings sollte man vielleicht die Vollendung des Panathenaikos jetzt präziser erst kurz vor dem Tode des Isokrates in das Jahr 338 datieren."
- **Suggested fix:** "It was published in 339 BC,[^16] or perhaps in 338, shortly before his death.[^22]" Mark the timeline entry `approx: true`.
- **Confidence:** low (a matter of hedging; Norlin's date is the usual one).

---

**Checked, no problems found in:**
- Life (Lives 4.1; Norlin; Jebb; Wikipedia):
  - born 436 (archonship of Lysimachus) and died 338 after Chaeronea
  - Theodorus of Erchia, his flute-making slaves, a chorus, the children's education
  - Prodicus, Gorgias, Tisias
  - "late compilations" mixing gossip with fact (Norlin, p. xi)
  - Plato seven years younger
  - "about one hundred" pupils: Timotheus, Theopompus, Ephorus; Isaeus, Lycurgus and Hypereides named by Norlin
  - ten minas and ten thousand for self-confidence and a pleasant voice
  - the whetstone saying
  - ten or fifteen years on the *Panegyricus*
  - sixty speeches, twenty-five (Dionysius), twenty-eight (Caecilius)
  - the palaestra of Hippocrates, the three Euripides openings, "enslaved four times", the fourth or ninth day
- Antidosis 161 ("the patrimony which remained to me"). Panathenaicus 10 (Greek and English as quoted), 3 (ninety-four), 266–270 (the illness "not decorous to name", three years, the friends, "lacked but three years of having lived a century"). To Philip 81 (exact).
- Dionysius *On Isocrates* 18: Aphareus against Megacleides, Aristotle's «δέσμας πάνυ πολλὰς δικανικῶν λόγων Ἰσοκρατείων», Cephisodorus, "some, but not many". *On Isocrates* 1: ninety-eight, «ἅμα τοῖς ἀγαθοῖς τῆς πόλεως συγκαταλῦσαι τὸν ἑαυτοῦ βίον», «ἀδήλου ἔτι ὄντος, πῶς χρήσεται τῇ τύχῃ Φίλιππος». *On Isocrates* 2: «φωνηέντων τὰς παραλλήλους θέσεις», «ἀναγνώσεώς τε μᾶλλον οἰκειότερός ἐστιν ἢ χρήσεως». The translations are fair.
- Phaedrus 278–279 ("the fair Isocrates"; «φύσει γάρ, ὦ φίλε, …» and Fowler's English). Jebb: dramatic date about 410. Wikipedia: "some scholars have taken this to be sarcasm".
- Against the Sophists 14–15. Antidosis 270–272 (exact). Antidosis 4–9: the trierarchy challenge, the loss, the expense, "a true image of my thought and of my whole life", «ἔτη γεγονὼς δύο καὶ ὀγδοήκοντα». Norlin dates it to 354–353.
- Panegyricus 3 and 50 (Greek and English exact). Jebb: 380, the Olympic festival "probably by means of copies circulated there", *On the Peace* and *Areopagiticus* 355, *Philippus* 346, *Against the Sophists* 391–390, six forensic speeches 403–393, *Against Euthynus* 403, the school about 392 "when he was forty-four" near the Lyceum, Photius in about 850 knowing twenty-one speeches, Benseler on hiatus and on xxi and xvii, the invalid of ninety-eight and the legend, Cicero and modern Europe.
- Norlin: "no doubt merely an exaggeration"; the speech-writing; the Chios doubt (Blass); the suicide "must be set down as fable"; the third letter "now generally accepted as genuine"; *To Demonicus* doubted by Benseler "on insufficient grounds"; *Against Euthynus* "thought by some to be spurious"; the long periodic sentence "sometimes occupying a page", balance and hiatus.
- Letter 3.1–6: after the battle; "then will naught be left for you except to become a god". Milton: the 1645 text matches exactly.
- Cicero, *De oratore* 2.94: "cuius e ludo tamquam ex equo Troiano meri principes exierunt".
- Wikipedia: one of the ten Attic orators; four of the nine letters questioned; *To Nicocles* given to rulers; Elizabeth I and Ascham.
- Manuscripts and printed editions (Norlin's bibliography; Engels; BMCR 2019.08.02; Onassis):
  - Drerup's 121 manuscripts and ten papyri
  - Γ: late 9th or early 10th century, lacking only *Against Callimachus* and *Against Euthynus*, with all the letters
  - Θ: Laur. 87.14, 13th century; Λ: Vat. gr. 65, 1063
  - the vulgate contaminated by marginal and interlinear notes
  - Bekker: Oxford 1822 and Berlin 1823; Baiter and Sauppe at Zürich, closer still to Γ; Benseler 1851, "goes too far"
  - Mustoxydis, Milan 1812
  - Chalcondyles, Milan, Ulrich Scinzenzeler, 24 January 1493, the 21 orations
  - Musurus, Venice 1499, without letter 9
  - the London papyrus (1st century AD, *Peace* from §13) and the Berlin papyrus (2nd century AD, *To Demonicus* from §18)
  - Mandilaras's 109 papyri; the case-by-case choice and the raised weight of the vulgate and the papyri
  - Martinelli Tempesta "sconsigliare"; Engels "nur mit Einschränkungen"
  - Papillon and Mandilaras accept all nine letters; Drerup "die erste Wahl" for his volume
  - the papyri in the hiatus debate
  - the Viterbo meeting of 2011 for the Oxford Classical Texts
  - Colomo (manuscripts better) against Menchelli (papyri preferable in most cases), rightly marked {debated}
  - *To Demonicus* "probabilmente spurio" but early in the collection and used in schools
  - the lacuna in an ancestor of Λ, "oltre tre quarti"
- Kellis: nine boards tied with string and written on both sides; *To Demonicus*, *To Nicocles* and *Nicocles*; "the oldest surviving complete set"; P. Kellis III Gr. 95, Oxbow 1997, Worp and Rijksbaron (from Pearse and BMCR, because the Zenon record would not open).
- Editions list:
  - Loeb 209, 229, 373 (1928, 1929, 1945). The catalogue labels give vol. 2 as 1929. The TEI `sourceDesc` of the vol. 2 files says 1928, but 1929 is the true date, and the article is right.
  - Mathieu and Brémond, 4 vols, 1928–62; Mandilaras, Saur 2003; Drerup 1906, vol. 1 only
  - Mirhady and Too, OCG 4, 2000; Papillon, OCG 7, 2004; Vallozza, Olschki 2017
- Certainty labels: {legend} on the death story, and {debated} on the Phaedrus, the Chios school, the papyri, *To Demonicus*, the letters and the modern doubts. All are appropriate. The timeline years, kinds and `approx` marks agree with the sources, except as noted in findings 1 and 9.

**Minor observation (not counted):** the note on Mirhady and Too ("the court speeches, the essays on education and the *Antidosis*") is incomplete. The UT Press page shows that the volume also has *To Demonicus*, *Helen*, *Busiris*, *Evagoras*, *To Nicocles*, *Nicocles* and the *Areopagiticus*. A fuller note would be "the court speeches, the essays on education, the Cyprian speeches, *Helen*, *Busiris* and the *Areopagiticus*".

**Could not verify:**
- The Zenon record (source 25): it is blocked by a bot check. The bibliographic details were confirmed from Pearse and BMCR 2019.08.02 instead.
- "Then Immanuel Bekker found the *Urbinas* in the Vatican". Norlin says so. But BMCR 2019.08.02 (source 26), summarising Pinto, says Girolamo Amati had found manuscripts of the first family in the Vatican earlier and never published an edition. I could not confirm whether Amati's find included the *Urbinas* itself, so this is not counted as a finding.

**Findings: 9** (1 high, 1 medium-high, 5 medium, 2 low).
