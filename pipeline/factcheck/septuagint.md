# Fact-check: the Septuagint (web/src/wiki/authors/tlg0527.ts)

Checked 2026-10-07 by an independent checker. The article's author did not write this report.

Method. I opened every `cite` source with `npx tsx scripts/passage.ts`, from `web/`, and read it against each sentence that points
to it. This used today's reader, which lines up the Septuagint Psalms by psalm and 2 Ezra with Nehemiah. I fetched every `url` source:
- the Wikipedia pages, as raw wikitext;
- the three NETS PDFs (Sirach, Ieremias, Daniel), as text;
- the NETS home page, worldenglish.bible and the Manchester Digital Collections page;
- the Internet Archive records for Hart and Ottley, and the full text of Swete's *Introduction* (2nd edition, 1902);
- Bagnall's article, cited through Wikipedia, as a PDF.

I also checked the TEI headers in `pipeline/.cache/corpus/first1k/data/tlg0527` and the site's catalogue (`web/public/data/catalog.json`). I
read the researcher's log (`pipeline/drafts/checked/tlg0527.md`) but did not rely on it.

Totals: **12 findings.** No quotation is misquoted, and every "our translation" matches its Greek. The serious ones are:
- **Psalm 22** (findings 1–2). Since today's reader fix, the Greek Psalm 22 stands beside the English "Yahweh is my shepherd". The
  article says the opposite, and source 14 and the closing paragraph rely on it.
- **Sirach** (finding 3). The Scroll has two Greek Sirachs. Swete's text in the Scroll opens with the grandson's prologue, so "the
  Scroll's Sirach … opens with a different preface" is only half true.
- **Codex Sinaiticus** (finding 4). In 1844 Tischendorf took away only 43 leaves, now in Leipzig. The part now in the British Library
  came out in 1859.
- **"The first printed Septuagint"** (finding 5). Swete says the Complutensian is the first printed text of the *whole* Septuagint.
  Greek Psalters had been printed from 1481.

The rest are dropped qualifications and small slips.

---

### 1. The Greek Psalm 22 no longer stands beside a different psalm
- **Claim:** "So the Greek Psalm 22 in the Scroll begins «Κύριος ποιμαίνει με», “The Lord shepherds me” (our translation), while the English beside it, which follows the Hebrew numbering, is a different psalm; the English “Yahweh is my shepherd: I shall lack nothing” sits one number later.[^14,11]"
- **Problem:** The reader was fixed today. It now renumbers the World English Bible Psalms into the Greek numbering
  (`web/src/lib/tei/versification.ts`: "Septuagint … 10–112 = [Hebrew] 11–113"). So the Greek Psalm 22 now stands beside the English
  Psalm 23, "Yahweh is my shepherd". The Greek numbering really does differ, and that half of the sentence is right. What the sentence
  says the reader shows is now wrong.
- **Evidence:** `npx tsx scripts/passage.ts tlg0527.tlg027 22.1 23.1`. Greek 22.1: «Ψαλμὸς τῷ Δαυείδ. / Κύριος ποιμαίνει με, καὶ
  οὐδέν με ὑστερήσει.» English beside it: "A Psalm by David. / Yahweh is my shepherd: I shall lack nothing." Greek 23.1 «Τοῦ κυρίου ἡ
  γῆ» stands beside "The earth is Yahweh's". The researcher's own log still records the old view ("beside WEB Ps 22 ('My God, my
  God…')").
- **Suggested fix:** "So the Greek Psalm 22 begins «Κύριος ποιμαίνει με», “The Lord shepherds me” (our translation): it is the psalm
  English Bibles, following the Hebrew, call Psalm 23, “Yahweh is my shepherd: I shall lack nothing”. The Scroll lines the two up by
  psalm, so they stand side by side under the Greek number.[^14,11]" Also change the label of source 14 to: "Psalms 22.1–23.1 in the
  Scroll: the Greek Psalms 22 and 23 beside the English Psalms 23 and 24".
- **Confidence:** high

### 2. The closing paragraph still cites the Psalms as a mismatch
- **Claim:** "… so the two columns do not always say the same thing, and sometimes they are not even on the same passage.[^14,23]"
- **Problem:** Source 14 (Psalms 22–23) no longer shows two different passages side by side (see finding 1). The sentence is still
  true: Jeremiah 25 (source 23) shows it. So does Daniel 3 (source 39). At Old Greek Daniel 3.24–26 the prayer of Azariah stands beside
  the English 3:24–26, where Nebuchadnezzar is astonished.
- **Evidence:** `npx tsx scripts/passage.ts tlg0527.tlg056 3.24 3.26`: Greek 3.25 «στὰς δὲ Ἀζαρίας προσηύξατο οὕτως…» beside "He
  answered, Look, I see four men loose, walking in the midst of the fire…". `npx tsx scripts/passage.ts tlg0527.tlg049 25.13 26.2`:
  Greek 25.15 «Συνετρίβη τὸ τόξον Αἰλάμ» beside "take this cup of the wine of wrath at my hand".
- **Suggested fix:** "… and sometimes they are not even on the same passage.[^23,39]"
- **Confidence:** high

### 3. The Scroll has two Greek Sirachs, and Swete's opens with the grandson's prologue
- **Claims:**
  - "Critical editions open Sirach with the grandson's prologue;[^10] but the Scroll's Sirach, Hart's edition of manuscript 248,[^42,2] opens with a different preface …"
  - Editions list, note to Hart: "The Greek text of Sirach in the Scroll.[^2]"
- **Problem:** The catalogue lists two Greek editions for Sirach (tlg0527.tlg034). One is Hart's text of MS 248, which `passage.ts`
  shows by default. The other is Swete's text (1st1K-grc2), which opens with the grandson's prologue. So the Scroll does not have only
  the 248 preface. Source 2 claims to list what the files' headers say, but its label leaves Swete's Sirach out.
- **Evidence:**
  - `web/public/data/catalog.json`, work tlg0527.tlg034 has two texts. One is "1st1K-grc1 … Ecclesiasticus: the Greek text of Codex 248.
    Hart … 1909". The other is "1st1K-grc2 … The Old Testament in Greek … Volume 2 … Swete … 1896".
  - The body of `pipeline/.cache/corpus/first1k/data/tlg0527/tlg034/tlg0527.tlg034.1st1K-grc2.xml` begins «ΣΟΦΙΑ ΣΕΙΡΑΧ προλογος …
    ΠΟΛΛΩΝ καὶ μεγάλων ἡμῖν διὰ τοῦ νόμου καὶ τῶν προφητῶν…». That is the grandson's prologue (NETS: "Seeing that many and great things
    have been given to us through the Law and the Prophets…").
- **Suggested fixes:**
  - Variants: "Critical editions open Sirach with the grandson's prologue, and so does Swete's text, one of the Scroll's two Greek
    Sirachs;[^10,2] but the other, Hart's edition of manuscript 248,[^42,2] opens with a different preface, …"
  - Editions note to Hart: "One of the two Greek texts of Sirach in the Scroll (the other is Swete's).[^2]"
  - Add to the label of source 2: "… J. H. A. Hart's Ecclesiasticus, 1909, beside Swete's Sirach …".
- **Confidence:** high

### 4. Tischendorf found only part of Sinaiticus in 1844, and that part is not in the British Library
- **Claims:**
  - Transmission: "Sinaiticus came to light in 1844, when Constantin von Tischendorf found it at Saint Catherine's Monastery in Sinai;
    most of it is now in the British Library.[^30]"
  - Timeline 1844: "Tischendorf finds Codex Sinaiticus at Saint Catherine's Monastery, Sinai"
- **Problem:** The cited Wikipedia page says that in 1844 Tischendorf was allowed to take only 43 leaves, which went to Leipzig. He was
  shown the codex itself on a later visit, in 1859. The portion now in the British Library is the part taken to Russia after 1859. The
  sentence runs the two events together, as if the British Library's part had been found in 1844.
- **Evidence:** https://en.wikipedia.org/wiki/Codex_Sinaiticus (wikitext):
  - "Tischendorf was permitted to take only one-third of the whole, i.e. 43 leaves. … After his return they were deposited in the
    Leipzig University Library, where they remain."
  - "Returning in 1859 … he was shown Codex Sinaiticus."
  - "A two-thirds portion of the codex was held in the National Library of Russia in St. Petersburg from 1859 until 1933."
  - "347 leaves in the British Library … 43 leaves in the Leipzig University Library".
- **Suggested fixes:**
  - Transmission: "Its first leaves came to light in 1844, when Constantin von Tischendorf took 43 of them from Saint Catherine's
    Monastery in Sinai to Leipzig; he was shown the rest in 1859, and most of the codex is now in the British Library.[^30]"
  - Timeline: "Tischendorf brings the first leaves of Codex Sinaiticus from Saint Catherine's Monastery, Sinai (the rest in 1859)".
- **Confidence:** high

### 5. The Complutensian is the first printed *whole* Septuagint; Greek Psalters were printed from 1481
- **Claims:**
  - Timeline 1517: "The Complutensian Polyglot, the first printed Septuagint, finishes printing in Spain (published 1520–21)"
  - Transmission: "The first printed Septuagint is a column of the Complutensian Polyglot …[^11,31]"
- **Problem:** Both sources say "whole" or "complete". The same chapter of Swete lists separate Greek Psalters printed earlier, at Milan
  in 1481 and Venice in 1486.
- **Evidence:**
  - Swete, *Introduction* (1902), ch. VI: "The first printed text of the whole Septuagint is that which forms the third column in the
    Old Testament of the great Complutensian Polyglott". Under PSALMS: "Separate editions of the Greek Psalter were published at Milan,
    1481; Venice, 1486; Venice, not later than 1498 (Aldus Manutius)…" (https://archive.org/details/anintrotooldtes00swetuoft).
  - Wikipedia, Complutensian Polyglot Bible: "It includes the first printed editions of the Greek New Testament, the complete
    Septuagint…".
- **Suggested fixes:**
  - Timeline: "The Complutensian Polyglot, the first printed text of the whole Septuagint, finishes printing in Spain (published 1520–21)"
  - Transmission: "The first printed text of the whole Septuagint is a column of the Complutensian Polyglot … (single books, such as the
    Psalms, had been printed since 1481)".
- **Confidence:** high

### 6. Matthew's «ἕξει» is not the reading of the Scroll's Isaiah, which footnote 20 points to
- **Claim:** "Matthew's account of the birth of Jesus quotes Isaiah in this Greek: «Ἰδοὺ ἡ παρθένος ἐν γαστρὶ ἕξει», “Behold, the
  virgin shall be with child”.[^19,20]"
- **Problem:** Source 20 is Swete's Isaiah 7.14 in the Scroll, and it reads «λήμψεται», not «ἕξει». The article quotes this itself in
  the variants section. Matthew's wording matches Codex Alexandrinus. The Scroll has Alexandrinus as a second Greek text of Isaiah
  (Ottley's), and Ottley's English beside Swete's Greek translates that reading. As written, footnote 20 seems to show Matthew's exact
  Greek in the Scroll's Isaiah, which it does not.
- **Evidence:**
  - `npx tsx scripts/passage.ts tlg0527.tlg048 7.14`: «ἰδοὺ ἡ παρθένος ἐν γαστρὶ λήμψεται καὶ τέξεται υἱόν».
  - `pipeline/.cache/corpus/first1k/data/tlg0527/tlg048/tlg0527.tlg048.1st1K-grc2.xml` (header: "The Book Of Isaiah Richard Rusden
    Ottley … 1904"): «ἰδοὺ ἡ παρθένος ἐν γαστρὶ ἔξει καὶ τέξεται υἱόν».
  - `npx tsx scripts/passage.ts tlg0031.tlg001 1.23`: «Ἰδοὺ ἡ παρθένος ἐν γαστρὶ ἕξει».
- **Suggested fix:** "Matthew's account of the birth of Jesus quotes Isaiah in this Greek: «Ἰδοὺ ἡ παρθένος ἐν γαστρὶ ἕξει», “Behold,
  the virgin shall be with child”, word for word as Codex Alexandrinus has it (Swete's text, from Vaticanus, reads «λήμψεται»).[^19,20]"
  To support this, add the Scroll's Ottley Greek text to the label of source 20.
- **Confidence:** medium (it is a matter of exactness, not a false statement)

### 7. Josephus allows corrections; "never altered" drops the next sentence
- **Claim:** "… and those who heard it read asked that it be left as it was and never altered.[^4]"
- **Problem:** In 12.108 the request comes from the priest, the elders among the translators and the leaders of the community: «ὅ τε
  ἱερεὺς καὶ τῶν ἑρμηνέων οἱ πρεσβύτεροι καὶ τοῦ πολιτεύματος οἱ προεστηκότες». It does not come from everyone who heard the reading.
  More importantly, the very next section (12.109, inside the cited range) adds a qualification. Anyone who saw something added or left
  out was to point it out and correct it. Only after that would the approved text stand for ever. The curse on anyone who changed the
  text belongs to the *Letter of Aristeas* (Wikipedia: "lay a curse on anyone who would change the translation"), not to Josephus.
- **Evidence:** `npx tsx scripts/passage.ts tlg0526.tlg001 12.100 12.109`, Whiston:
  - "they all, both the priest and the ancientest of the elders, and the principal men of their commonwealth, made it their request, that
    … it might continue in the state it now was, and might not be altered."
  - "they enjoined, that if any one observed either any thing superfluous, or any thing omitted, that he would take a view of it again,
    and have it laid before them, and corrected; … that when the thing was judged to have been well done, it might continue for ever."
- **Suggested fix:** "… and the priest, the elders and the leaders of the community asked that it be left as it was, once anything
  superfluous or missing had been put right.[^4]"
- **Confidence:** medium

### 8. Irenaeus "separates" the elders; "shut up" adds a detail from later versions of the story
- **Claim:** "Irenaeus … has the king shut the elders up separately and every one produce the same translation of all the books …[^8]"
- **Problem:** The Greek says the king separated them from one another: «χωρίσας αὐτοὺς ἀπ' ἀλλήλων». Nothing in Irenaeus says they were
  locked in. Shutting each translator in his own room belongs to later tellings, such as the Talmud's "72 chambers" quoted on the
  Wikipedia page. The article itself leaves the Talmud out.
- **Evidence:** `npx tsx scripts/passage.ts tlg2018.tlg002 5.8.10 5.8.15`, 5.8.13: «χωρίσας αὐτοὺς ἀπ' ἀλλήλων ἐκέλευσε τοὺς πάντας τὴν
  αὐτὴν ἑρμηνείαν γράφειν, καὶ τοῦτ' ἐπὶ πάντων τῶν βιβλίων ἐποίησεν».
- **Suggested fix:** "… has the king keep the elders apart from one another and every one produce the same translation of all the
  books …[^8]"
- **Confidence:** medium

### 9. "To the late second century" goes beyond the dates in the source
- **Claim:** "Scholars date it anywhere from the third to the late second century BC.[^3]"
- **Problem:** The Wikipedia page gives "the 3rd or early 2nd century BC". The latest date it mentions is Hody's 170–130 BC, which is
  the middle of the century. Bagnall, whom the page cites, calls it "a work of the second century" and "a mid-second-century date is
  plausible". None of these says "late second century".
- **Evidence:** https://en.wikipedia.org/wiki/Letter_of_Aristeas: "a Hellenistic work of the 3rd or early 2nd century BC"; "Hody placed
  the writing closer to 170–130 BC". Bagnall, "Alexandria: Library of Dreams" (2002), p. 349 and n. 12.
- **Suggested fix:** "Scholars date it anywhere from the third to the middle of the second century BC.[^3]"
- **Confidence:** medium

### 10. "Two centuries or so" shortens the source's "two to three centuries"
- **Claim:** "The rest followed over the next two centuries or so …[^1]"
- **Problem:** The source says two to three centuries. It also says the Septuagint "was written from the 3rd through the 1st centuries
  BC".
- **Evidence:** https://en.wikipedia.org/wiki/Septuagint: "After the Torah, other books were translated over the next two to three
  centuries."
- **Suggested fix:** "The rest followed over the next two to three centuries …[^1]"
- **Confidence:** medium (small, but it is a dropped part of the source's wording)

### 11. Origen's remark is in section 4 of the *Letter to Africanus*, not section 5
- **Claim:** Source 36: "Origen, Letter to Africanus 5 (section 1.5 in the Scroll): differences in Job, Jeremiah and Genesis".
- **Problem:** The Scroll's paragraph 1.5 does not follow the usual section numbers. The Scroll's 1.3 and 1.4 together make up the usual
  §3. The passage on Job, Jeremiah and Genesis is §4 in the standard numbering, which is what Swete cites ("Origen ad Afric. 4").
- **Evidence:** Swete, *Introduction* p. 241 n.: "Origen ad Afric. 4 πολλὰ δὲ τοιαῦτα καὶ ἐν τῷ Ἱερεμίᾳ κατενοήσαμεν…". ANF translation
  (https://www.newadvent.org/fathers/0414.htm), §4: "In Jeremiah I noticed many instances, and indeed in that book I found much
  transposition and variation … Again, in Genesis, the words, God saw that it was good …". `npx tsx scripts/passage.ts tlg2042.tlg045
  1.3 1.5`.
- **Suggested fix:** "Origen, Letter to Africanus 4 (section 1.5 in the Scroll): differences in Job, Jeremiah and Genesis"
- **Confidence:** high

### 12. In the Scroll, Susanna and Bel are separate texts, not part of the two Daniels
- **Claim:** "The Scroll has both versions, and both contain the additions: in chapter 3 the Greek goes on for dozens of verses …[^39,40,26]"
- **Problem:** Both of the Scroll's Daniels do contain the chapter 3 addition. But the other two additions, Susanna and Bel and the
  Dragon, are four separate works in the Scroll. So "both contain the additions" is not quite what the Scroll shows. Source 40 (Theodotion
  1.1) shows only the opening of the book, not an addition. The addition in Theodotion's version is at 3.24–26.
- **Evidence:** The catalogue lists tlg0527.tlg054 "Susanna (Greek translation)", tlg055 "Susanna (Theodotion's version)", tlg058 "Bel and
  the Dragon (Greek translation)" and tlg059 "Bel and the Dragon (Theodotion's version)". `npx tsx scripts/passage.ts tlg0527.tlg057 3.23
  3.26`: «Καὶ περιεπάτουν ἐν μέσῳ τῆς φλογὸς … καὶ συνστὰς Ἀζαρίας προσηύξατο οὕτως…».
- **Suggested fix:** "The Scroll has both versions, with Susanna and Bel and the Dragon as separate texts beside each; and in both, in
  chapter 3, the Greek goes on for dozens of verses that are not in the Hebrew …[^39,40,26]". Also point source 40 at 3.24–3.26 of
  tlg0527.tlg057 instead of 1.1.
- **Confidence:** medium

---

## Verified and found correct

- **Summary.**
  - Earliest surviving Greek translation, begun by Jews in Egypt in the 3rd century BC; the name from the Latin for "seventy" and LXX; many
    translators, places, times and Hebrew copies (Wikipedia, Septuagint).
  - The Scroll has 55 Septuagint works in Greek. The catalogue lists 56 works, and Ecclesiastes has English only. All are Swete's text
    except the default Sirach (Hart).
- **The legend.**
  - The courtier of Ptolemy II, Demetrius, six from each tribe, 72 in 72 days; Josephus c. AD 93 (Wikipedia, Letter of Aristeas).
  - Josephus 12.100 (the book of Aristaeus), 12.56 «ἓξ ἀπὸ φυλῆς ἑκάστης», 12.57 «τῶν ἑβδομήκοντα πρεσβυτέρων», 12.107 "came to its
    conclusion in seventy-two days", and 1.12 «μόνα τὰ τοῦ νόμου» / "only the books of the law". All exact.
  - Philo, *Moses* 2.37 and 2.41: the Yonge quotations are exact, and so is the Pharos festival.
  - Irenaeus in Eusebius 5.8.10–14: «Πτολεμαῖος ὁ Λάγου»; the identical translations "from beginning to end"; «ἰδοὺ ἡ νεᾶνις ἐν γαστρὶ
    ἕξει» in Theodotion and Aquila. «τῆς κατὰ τοὺς ἑβδομήκοντα ἑρμηνείας» is rightly given as Eusebius' own words.
  - Against Heresies c. 180 (Wikipedia, Irenaeus).
- **Scholarly views.**
  - Metzger's "most scholars", Hody 1685 (Wikipedia).
  - Bagnall: Demetrius "not a good candidate for collaborator with Ptolemy II" (Bagnall 2002, p. 349).
- **Ben Sira's grandson.**
  - 132 BC "if, as is probable, the Euergetes intended was the second of that name" (Swete, p. 24).
  - The NETS quotations from the Prologue are exact.
  - The Law, Prophets and other books already in Greek (Swete).
- **The Greek and the Scroll's texts.**
  - Psalm numbering, Heb. 9+10 = LXX 9 (Swete, p. 240). Psalm 151 heading «ἔξωθεν τοῦ ἀριθμοῦ» (Scroll).
  - Hebraisms δύο δύο (Gen. 6.19) and σφόδρα σφόδρα (Exod. 1.12) are in Swete's list and in the Scroll's Greek.
  - Genesis 1.3, 1.8 and Exodus 3.14, Greek and English, match the Scroll.
- **Jeremiah and Origen.**
  - The Greek is about one eighth shorter; both forms are at Qumran; most scholars think the Hebrew behind the Greek is older (Wikipedia,
    Book of Jeremiah).
  - The sections have exchanged places after 25:13 (Swete, p. 241).
  - In the Scroll, Jeremiah 25.14–15 shows the Greek Elam oracle beside the WEB "cup" passage.
  - Origen's «πολλὴν μετάθεσιν καὶ ἐναλλαγὴν» and his note on Genesis 1:8.
- **Use by Jews and Christians.**
  - Christian use, Jewish abandonment, Aquila, Jerome and Augustine, Eastern Orthodox use (Wikipedia, Septuagint).
  - The oldest papyri; Vaticanus and Alexandrinus as the oldest nearly complete Old Testaments, with complete Hebrew texts about 600 years
    later; pre-LXX Jeremiah manuscripts at Qumran; daughter versions; the Hexaplaric, Lucianic and Hesychian recensions (Wikipedia,
    Septuagint).
- **Isaiah 7:14.**
  - *almah*, παρθένος, Matthew, and most scholars preferring "young woman" (Wikipedia, Isaiah 7:14).
  - Ottley's English translates Alexandrinus (Internet Archive record).
- **Aquila and the Hexapla.**
  - Aquila fl. 130 (Wikipedia).
  - Hexapla: before 240, its six columns, the signs, Field 1875 (Wikipedia).
  - Eusebius 6.16.4, Lake–Oulton: quotation exact.
- **Papyrus Rylands 458.** Rahlfs 957; eight fragments of a Deuteronomy roll; mid-2nd century BC by its handwriting; 1917 (Wikipedia;
  Manchester Digital Collections; acquired by the Rylands in 1917 per Wikipedia, Rylands Papyri).
- **Printed editions.**
  - Complutensian: last OT volume dated July 10, 1517, published 1520–21.
  - Aldine: February 1518.
  - Sixtine 1587, based on B with the gaps filled; Holmes and Parsons 1798–1827.
  - Swete's 1883 commission, with the quotation exact; 1887–94; revised edition 1895–99.
  - Old Greek Daniel printed in 1772 "e singulari Chisiano codice".
  - Jerome on the churches reading Theodotion's Daniel; "only one Greek copy has survived". All Swete.
  - The Sixtine as "textus receptus" (Wikipedia, Septuagint).
- **Daniel.**
  - Old Greek c. 100 BC and Theodotion; Dan. 3:24–90 (Wikipedia, Additions to Daniel).
  - Old Greek supplanted "by the first or second century CE"; Papyrus 967 the most important witness (NETS Daniel).
  - Old Greek Daniel 3.25 «στὰς δὲ Ἀζαρίας προσηύξατο οὕτως» (Scroll).
- **Sirach.** The alternative prologue is only in MS 248 and comes from the pseudo-Athanasian *Synopsis* (Ziegler, via NETS Sirach); MS
  248 is an important witness to GKII. The Scroll's Hart text opens with «Ἰησοῦς οὗτος Σιρὰχ μὲν ἦν υἱός».
- **Modern editions and translations.**
  - Rahlfs 1935, built on B, ℵ and A, the most widespread edition, revised by Hanhart in 2006.
  - Göttingen founded in 1908, publishing since 1931 (Psalmi cum Odis), unfinished (Wikipedia).
  - NETS: Pietersma and Wright, OUP 2007, second printing 2009 (NETS site).
  - WEB: based on the ASV of 1901 and the Biblia Hebraica Stuttgartensia, public domain (worldenglish.bible).
- **Editions list.**
  - Swete's printings of 1896, 1901 and 1905 and Hart 1909 (TEI headers); Ottley, Cambridge 1904 (TEI header).
  - Swete's *Introduction*, 1900 and 2nd edition 1902, with Thackeray's Aristeas (title page).
