# Fact-check: Flavius Josephus (`web/src/wiki/authors/tlg0526.ts`)

Checked 2026-10-07.

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts` (from `web/`) and read against each sentence that points to
it: War 1.1–4, 2.566–568, 3.340–342, 3.383–391, 3.392–408, 4.622–629, 7.389–406; Life 1–6, 7–12, 13–16, 28–29, 361–364 (with
Whiston's English, which the Scroll attaches further on), 414–421, 422–430; Antiquities 18.63–64, 18.116–119, 20.199–203 (Whiston's
English sits with 20.197), 20.259–268; Against Apion 1.1–3, 1.47–56, 2.51–114; Thucydides 1.1.2; Eusebius HE 1.11.7–9, 3.9.1–4;
Origen, Against Celsus 1.47. Every `url` source was fetched fresh: the Wikipedia pages as raw wikitext (Josephus, Siege of Yodfat,
The Jewish War, Josephus on Jesus, Siege of Masada, Cassiodorus, List of editiones principes in Greek, Arnoldus Arlenius, Benedikt
Niese, Slavonic Josephus); the Internet Archive OCR texts and metadata of Loeb 186, 203, 210, 242, 410 and 433; Brent Nongbri's blog;
LacusCurtius (Suetonius, Vesp. 5.6); Thayer's Whiston title page; Goldberg's Brill review on josephus.org. The date of Pal. gr. 14
was also checked against its Pinakes record (diktyon 65747). Edition details were compared with the Perseus TEI headers in
`pipeline/.cache/corpus/perseus/data/tlg0526/`. The researcher's log `pipeline/drafts/checked/tlg0526.md` was read but not relied on.

Totals: **13 findings**, none serious. Every Greek and English quotation was checked against its source and is exact, and no
footnote points at the wrong passage, with one exception (finding 4). The findings are:
- two places where the article says something the cited passage does not (Josephus asking for the sacred books; Titus being "so
  pleased");
- one claim about the first printed edition that the source makes only for *Against Apion*, with "seems", and that the editions
  list then turns into a "lost" manuscript;
- one claim stated as fact that its own source reports as disputed (that he became a Pharisee);
- smaller slips of place, label, date-support and attribution.

---

### 1. The 1544 edition and the "manuscript unknown to Niese": the source says this only for *Against Apion* (and *Antiquities* 1–10), with "seems"; "lost" goes further than any source
- **Claim:** (transmission) "Thackeray found that this edition seems to draw in part on a manuscript unknown to Niese.[^3]" (editions,
  Arlenius) "The first edition, which sometimes preserves readings from a lost manuscript."
- **Problem:** In Loeb 186 (source 3), Thackeray says this only in his section on *Against Apion*, not about the edition as a whole.
  He says the same in Loeb 242 (source 22) for *Antiquities* 1–10. Neither source calls the manuscript "lost". "Unknown to Niese" or
  "some unknown ms" means a manuscript not known to the editor, which is not the same thing. The editions note also drops "seems".
- **Evidence:** Loeb 186, introduction, under "(b) For the Contra Apionem": "The editio princeps of the Greek text (Basel, 1544) is of
  first-rate importance and seems to be derived in part from some MS. unknown to Niese." Loeb 242, list of authorities for *A.* i–x:
  "ed. pr. The editio princeps of the Greek text (Basel, 1544) seems to be derived in part from some unknown ms and is occasionally an
  important authority." (https://archive.org/details/loeb-186, https://archive.org/details/loeb-242, OCR text files.)
- **Suggested fix:** Transmission: "For *Against Apion* and the first half of the *Antiquities*, Thackeray found that this edition
  seems to draw in part on a manuscript not otherwise known.[^3,22]" Editions note: "The first edition. For some works it seems to
  draw on a manuscript not otherwise known, and so is sometimes an important witness."
- **Confidence:** high

### 2. Josephus did not ask Titus for the sacred books; he asked for people's freedom and received the books as a gift
- **Claim:** "When the city fell he asked Titus for the sacred books and the freedom of his brother, of fifty friends, and of about a
  hundred and ninety people he knew among the captives in the Temple.[^16]"
- **Problem:** Life 418 says that he asked for the freedom of some of his countrymen and that he received the sacred books as Titus'
  gift. The request for his brother and fifty friends came "not long after" (419). He freed the 190 himself, after Titus allowed him
  into the Temple; it was not a request.
- **Evidence:** `npx tsx scripts/passage.ts tlg0526.tlg002 414 421`: «σωμάτων ἐλευθέρων τὴν αἴτησιν ἐποιούμην Τίτον καὶ βιβλίων
  ἱερῶν ἔλαβον χαρισαμένου Τίτου. μετʼ οὐ πολὺ δὲ καὶ τὸν ἀδελφὸν μετὰ πεντήκοντα φίλων αἰτησάμενος οὐκ ἀπέτυχον. καὶ εἰς τὸ ἱερὸν
  δὲ πορευθεὶς Τίτου τὴν ἐξουσίαν δόντος … ἐρρυσάμην περὶ ἑκατὸν καὶ ἐνενήκοντα». Whiston: "I made this request to Titus, that my
  family might have their liberty: I had also the holy books by Titus's concession." Thackeray's Loeb (186): "made request to Titus
  for the freedom of some of my countrymen; I also received by his gracious favour a gift of sacred books."
- **Suggested fix:** "When the city fell he asked Titus for the freedom of some of his countrymen and was given sacred books as a
  gift; soon afterwards he won the release of his brother and fifty friends, and, allowed into the Temple, he freed about a hundred
  and ninety people he knew among the captives.[^16]"
- **Confidence:** high

### 3. Titus signed the *War* because he wanted it to be the only account, not because he was "so pleased"
- **Claim:** "Titus was so pleased with it that “he subscribed his own hand to them, and ordered that they should be
  published”.[^21]"
- **Problem:** Life 363 gives another reason: Titus wanted people to learn about the war from these books alone. Thackeray (source 20)
  translates it the same way. "So pleased" is not in the source.
- **Evidence:** `npx tsx scripts/passage.ts tlg0526.tlg002 361 364`: «ὁ μὲν γὰρ αὐτοκράτωρ Τίτος ἐκ μόνων αὐτῶν ἐβουλήθη τὴν γνῶσιν
  τοῖς ἀνθρώποις παραδοῦναι τῶν πράξεων, ὥστε χαράξας τῇ ἑαυτοῦ χειρὶ τὰ βιβλία δημοσιῶσαι προσέταξεν». Loeb 203 introduction:
  "indeed so anxious was the Emperor Titus that my volumes should be the sole authority from which the world should learn the facts,
  that he affixed his own signature to them and gave orders for their publication".
- **Suggested fix:** "Titus wanted the world to learn the facts from these books alone, so “he subscribed his own hand to them, and
  ordered that they should be published”.[^21,20]"
- **Confidence:** high

### 4. "In 73 or 74" for Masada is footnoted to a page that does not give it
- **Claim:** "In 73 or 74 the last rebels held out on the rock of Masada.[^19]"
- **Problem:** Source 19 (Wikipedia, *The Jewish War*) dates the war "66–73 CE" and says nothing about 73 or 74. The two dates come
  from source 32 (Wikipedia, *Siege of Masada*). That page calls 73 the traditional date and 74 a proposed one. The source 19 label
  ("Masada in 73/74") is also wrong.
- **Evidence:** https://en.wikipedia.org/w/index.php?title=Siege_of_Masada&action=raw: "date = Late 72 – early 73 (traditional date)
  <br /> Late 73 – early 74 AD (proposed date)". The Jewish War page (raw): "a seven-book history of the First Jewish–Roman War (66–73
  CE)", and no other mention of 73 or 74.
- **Suggested fix:** "In 73, or by a proposed later dating 74, the last rebels held out on the rock of Masada.[^32]" Drop "Masada in
  73/74" from the source 19 label.
- **Confidence:** high

### 5. "Choosing the Pharisees" is stated as fact, but the article's own source 5 reports that this is disputed
- **Claim:** "he tried out all three Jewish schools and a desert hermit before choosing the Pharisees at nineteen.[^6]"
- **Problem:** The Greek says only that at nineteen he "began to take part in public life following the school of the Pharisees"
  (ἠρξάμην πολιτεύεσθαι τῇ Φαρισαίων αἱρέσει κατακολουθῶν). Whiston and Thackeray read this as joining them. But Wikipedia
  (source 5) reports Steve Mason's argument that Josephus was not a Pharisee and followed the school only out of deference. The
  article states one side as fact.
- **Evidence:** `npx tsx scripts/passage.ts tlg0526.tlg002 7 12` (Life 12, quoted above). https://en.wikipedia.org/wiki/Josephus
  (raw): "In his 1991 book, Steve Mason argued that Josephus was not a Pharisee but an orthodox Aristocrat-Priest who became associated
  with the philosophical school of the Pharisees as a matter of deference, and not by willing association."
- **Suggested fix:** "… before, at nineteen, beginning public life as a follower of the Pharisees; whether he ever counted himself
  one of them is debated.[^6,5]"
- **Confidence:** medium

### 6. He met the actor Aliturus after landing at Puteoli; the source does not say "in Rome"
- **Claim:** "in Rome a Jewish actor introduced him to Nero's wife Poppaea, and the priests were freed.[^7,3]"
- **Problem:** Life 16 says that after landing safely at Dicaearchia (Puteoli) he made friends with Aliturus, and through him came to
  know Poppaea. It does not say where the introduction took place, and the meeting with Aliturus is placed at Puteoli.
- **Evidence:** `npx tsx scripts/passage.ts tlg0526.tlg002 13 16`: «διασωθεὶς δʼ εἰς τὴν Δικαιάρχειαν, ἣν Ποτιόλους Ἰταλοὶ καλοῦσιν,
  διὰ φιλίας ἀφικόμην Ἁλιτύρῳ … καὶ διʼ αὐτοῦ Ποππαίᾳ τῇ τοῦ Καίσαρος γυναικὶ γνωσθεὶς». Thackeray (Loeb 186): "Landing safely at
  Dicaearchia, which the Italians call Puteoli, I formed a friendship with Aliturus … Through him I was introduced to Poppaea".
- **Suggested fix:** "Landing at Puteoli, he made friends with a Jewish actor, Aliturus, who introduced him to Nero's wife Poppaea, and
  the priests were freed.[^7,3]"
- **Confidence:** medium

### 7. Timeline: Pal. gr. 14 is not "the oldest Greek manuscript" outright, and source 29 disagrees with its date
- **Claim:** (timeline, 900) "The oldest Greek manuscript, Palatinus graecus 14 (ninth or tenth century)"
- **Problem:** The article's own next entry back (250) and its transmission section call the third-century Vienna papyrus "the
  oldest copy of all". That papyrus is also a Greek manuscript, so the two entries contradict each other. Source 29 (Wikipedia,
  *Josephus on Jesus*) also says no manuscript of Josephus is older than the eleventh century. Thackeray's date (ninth or tenth
  century) is supported: the Pinakes record lists studies of the earliest minuscule hands that include this manuscript. But it is
  Thackeray's date, and a source the article cites disagrees with it.
- **Evidence:** Loeb 186: "P Codex Palatinus (Vaticanus) Graecus 14, cent. ix. or x." Wikipedia, Josephus on Jesus (raw): "there
  are no known manuscripts of Josephus' works that can be dated before the eleventh century". Pinakes, diktyon 65747 (bibliography
  includes Agati on minuscule "tra IX e X secolo" and Sietis 2024 on Studite minuscule).
- **Suggested fix:** "The oldest medieval manuscript, Palatinus graecus 14, dated by Thackeray to the ninth or tenth century"
  (`src: [3]`).
- **Confidence:** medium

### 8. Source 45: the 1928 Loeb volume 3 is *The Jewish War*, Books IV–VII, not V–VII
- **Claim:** (source 45) "Internet Archive, record of Josephus, vol. 3: The Jewish War, Books V–VII, tr. H. St J. Thackeray (Loeb
  Classical Library 210, 1928)"
- **Problem:** The Internet Archive's metadata title says "Books V-VII". But the scanned book is the 1957 reprint of the 1928
  volume, and its title page and contents read "THE JEWISH WAR, BOOKS IV-VII" (Books IV, V, VI, VII). Books V–VII is the later
  reorganised LCL 210.
- **Evidence:** https://archive.org/download/loeb-210/Loeb%20210_djvu.txt: "IN NINE VOLUMES / III / THE JEWISH WAR, BOOKS IV-VII …
  First printed 1928 / Reprinted 1957 … CONTENTS OF VOLUME III … Book IV, Book V, Book VI, Book VII".
- **Suggested fix:** "… vol. 3: The Jewish War, Books IV–VII, tr. H. St J. Thackeray (Loeb Classical Library 210, 1928)".
- **Confidence:** high

### 9. Shaye Cohen is a historian, not an archaeologist
- **Claim:** "Josephus is the only ancient source, and archaeologists disagree about the remains: Shaye Cohen called his account
  “incomplete and inaccurate”, while Jodi Magness has written that archaeology can neither prove nor disprove it.[^32]"
- **Problem:** The cited page names Cohen as a scholar who says "archaeology shows" this. It does not call him an archaeologist, and
  he is in fact a historian of ancient Judaism. Of the four people the page names, only Magness and Cline are archaeologists.
- **Evidence:** https://en.wikipedia.org/wiki/Siege_of_Masada (raw): "According to Shaye Cohen, archaeology shows that Josephus'
  account is "incomplete and inaccurate"…"; "According to archaeologist Eric H. Cline …"; "American archaeologist Jodi Magness has
  written …".
- **Suggested fix:** "… and scholars disagree about what the remains show: the historian Shaye Cohen called his account “incomplete and
  inaccurate”, while the archaeologist Jodi Magness has written that archaeology can neither prove nor disprove it.[^32]"
- **Confidence:** medium

### 10. Timeline: "248" for Origen is not in the cited sources; the article's own Feldman source gives about 280
- **Claim:** `{ year: 248, approx: true, kind: "reception", what: "Origen writes that Josephus did not believe in Jesus as the Christ",
  src: [27, 29] }`
- **Problem:** Neither Against Celsus 1.47 (source 27) nor Wikipedia, *Josephus on Jesus* (source 29) gives a year. Feldman's Loeb
  note (source 28) dates Origen's statement "c. A.D. 280". The usual modern date for *Against Celsus* is about 248, and the article
  marks the entry as approximate. But no source in the list supports it, and one source in the list gives a different date.
- **Evidence:** Loeb 433, note on 18.63: "Origen (Contra Celsum i. 47 and Comment. in Matt. xiii. 55) explicitly states (c. A.D. 280)
  that Josephus did not believe in Jesus as the Christ." The raw wikitext of Josephus on Jesus has no date for *Against Celsus*.
- **Suggested fix:** Either add a source for about 248 (for example the Wikipedia page *Contra Celsum*, after checking it), or change
  the entry to a date the sources support: "Origen, in the third century, writes that …" kept at `year: 248, approx: true`, with
  `src: [27, 28, 29]` and a note that the date is approximate.
- **Confidence:** low

### 11. *Against Apion*: Thackeray says the other copies "appear to be" copies of L
- **Claim:** "*Against Apion* hangs by a thread: every surviving Greek copy goes back to one imperfect eleventh-century manuscript in
  Florence (Laurentianus 69.22).[^3]"
- **Problem:** The source qualifies this ("appear to be copies"), and the article drops the qualification. It also says the
  editio princeps "seems to be derived in part from some MS. unknown to Niese" (see finding 1), which bears on "every".
- **Evidence:** Loeb 186: "Here we are dependent on a solitary imperfect MS. viz. L Codex Laurentianus plut. lxix. 22, cent. xi, of
  which all other extant MSS. appear to be copies."
- **Suggested fix:** "*Against Apion* hangs by a thread: every other surviving Greek copy seems to have been copied from one imperfect
  eleventh-century manuscript in Florence (Laurentianus 69.22).[^3]"
- **Confidence:** low

### 12. *Against Apion* 1.1–3 does not say the slanderers were Greek writers
- **Claim:** "*Against Apion*, in two books, defends the antiquity of the Jewish people against Greek writers who ignored or slandered
  it,[^23]"
- **Problem:** The cited passage separates two groups. One is the famous Greek historians, who did not mention the Jews (1.2). The
  other is unnamed people "out of ill-will" who slandered them (ὑπό τινων, 1.2). Thackeray (source 3) lists the evidence as Egyptian,
  Phoenician, Babylonian and Greek. The chief slanderers answered in the book (Manetho, Chaeremon, Lysimachus, Apion) wrote in Egypt.
- **Evidence:** `npx tsx scripts/passage.ts tlg0526.tlg003 1.1 1.3`: «ταῖς ὑπὸ δυσμενείας ὑπό τινων εἰρημέναις … βλασφημίαις … τὸ
  μηδεμιᾶς παρὰ τοῖς ἐπιφανέσι τῶν Ἑλληνικῶν ἱστοριογράφων μνήμης ἠξιῶσθαι».
- **Suggested fix:** "*Against Apion*, in two books, defends the antiquity of the Jewish people against those who slandered them and
  against the doubt raised by the silence of the famous Greek historians,[^23]"
- **Confidence:** low

### 13. Schürer did not "print" a text
- **Claim:** "Niese and Schürer, who doubted that Josephus would speak warmly of a man who stirred up the people, printed Eusebius'
  word."
- **Problem:** Feldman says they "adopted" Eusebius' reading. Niese printed it in his edition. Schürer adopted it in his *History*
  (Feldman cites "Schürer, i. 438 n. 2"), which is not an edition.
- **Evidence:** Loeb 433, note on 18.118: "Because Schürer, i. 438 n. 2, and Niese believed that Josephus would never have viewed with
  sympathy one who stirred up the people thus, they adopted Eusebius' emendation."
- **Suggested fix:** "Niese, who printed Eusebius' word, and Schürer, who preferred it, both doubted that Josephus would speak warmly
  of a man who stirred up the people."
- **Confidence:** low

---

**Checked, no problems found in:**
- War 1.3: «Ἰώσηπος Ματθίου παῖς ἐξ Ἱεροσολύμων ἱερεύς», "fought the Romans at first", παρατυχὼν ἐξ ἀνάγκης, the earlier version for
  the "Upper Barbarians", and the Whiston quotation "to translate those books into the Greek tongue". War 1.4 «μεγίστου τοῦδε τοῦ
  κινήματος» against Thuc. 1.1.2 «κίνησις γὰρ αὕτη μεγίστη». The echo is Thackeray's (Loeb 203, "Thucydides" paragraph). The "our
  translation" of it is accurate.
- Life 1–6: both quotations, the first of the 24 courses, Hasmonean descent through his mother, born in the first year of Gaius.
  Thackeray gives "A.D. 37-38". Wikipedia gives the paternal line (Jehoiarib) and c. 100 for his death. Thackeray: he outlived Agrippa
  II. Life 7–12: fourteen, sixteen, the three schools, Bannus for three years, nineteen. Life 13–16: after his 26th year; about 600
  swam all night ("swam for our lives all the night" is exact); about 80 picked up; the priests freed. Thackeray: "26 or 27 in the
  year 64".
- Galilee: War 2.568 (both Galilees) and Life 29 (with Joazar and Judas, to make the troublemakers lay down their arms). Thackeray's
  "both biased and in some details inconsistent" is exact.
- Jotapata: the forty-seven days (War 3.406; Thackeray; Wikipedia, 24 May – 20 July 67). The pit, the cave, forty men of note
  (3.341–342). The lots and "whether we must say it happened so by chance, or whether by the providence of God" (3.391, exact). The
  Josephus problem and Smallwood's words (Wikipedia, exact). The private audience and both Greek quotations with Whiston's English
  (3.399–401, exact). Suetonius, Vesp. 5.6 (LacusCurtius, exact). The chain cut with an axe at Titus' suggestion (4.628–629; "like a
  man that had never been bound at all", exact). The name Flavius (Wikipedia).
- Life 416 ("the Romans also, whenever they were beaten …", exact). Life 423 (apartment, citizenship, pension, exact). Life 429
  (Domitian's tax exemption). Thackeray: interpreter and mediator at the siege.
- The *War* in seven books and the *Antiquities* in twenty (Eusebius HE 3.9.3; Wikipedia). The statue in Rome (HE 3.9.2). The lost
  first version, probably Aramaic; no trace of Semitic phrasing; "practically rewritten"; published "commonly" 75–79 (Thackeray,
  Loeb 203). The *Antiquities* from creation to the 12th year of Nero, finished in the 13th year of Domitian and the 56th of his life
  (20.259, 20.267). "A.D. 93-94" and the counterpart to Dionysius (Loeb 242). The *Life* against Justus; the "lost writings" quoted
  in *Against Apion* (Loeb 186).
- His Greek: Ant. 20.263 (Greek and Whiston, exact). Ap. 1.50 «τισι πρὸς τὴν Ἑλληνίδα φωνὴν συνεργοῖς»: the "our translation" is
  accurate, and Whiston's "to assist me in learning the Greek tongue" is exact and does misrender it. Thackeray's theory (Atticistic
  style, avoiding hiatus, the *Life* as his own words, Ant. 17–19 by "a hack, a slavish imitator of Thucydides") is correctly given
  as his.
- The Testimonium (Greek and Whiston, exact); Eusebius HE 1.11.7–8 in nearly the same words; Origen 1.47 «ἀπιστῶν τῷ Ἰησοῦ ὡς
  Χριστῷ» and «Ἰακώβου τοῦ δικαίου»; Feldman's verdict (exact) and his note on 20.200 ("few have doubted"; Origen and Eusebius "may
  be thinking of" John the Baptist). Wikipedia, Josephus on Jesus: partial authenticity is the majority view and forgery a minority
  view; Agapius (10th c.) and Michael (12th c.) brought to light by Pines in 1971; the Arabic does not blame the Jewish leaders; the
  Syriac reads "believed to be Christ"; Whealey 2008 and Jerome's "thought to be"; the John and James passages are accepted; about 120
  Greek manuscripts, 33 before the 14th century; Jews not known to have preserved him; copied by Christian monks. James at Ant. 20.200
  (Whiston's words, exact).
- John the Baptist variant: Feldman's apparatus («ἤρθησαν codd. E et Eusebii codd. quidam: ἥσθησαν Eusebius»), his note (the
  Slavonic has "overjoyed"; Eisler; Feldman's text follows the manuscripts). The Scroll's Niese text has ἥσθησαν, and Whiston's
  "moved [or pleased]" is exact.
- Masada: War 7.389–406 (the lots, the "nine hundred and sixty" quotation, the two women and five children, all exact). Wikipedia:
  single written source, the breach of the wall, Cohen's "incomplete and inaccurate", Magness.
- Why he matters: "chief source next to the Bible … Second Temple period" (Wikipedia); "the only extensive eyewitness narrative of
  the revolt to survive antiquity" (Wikipedia, The Jewish War); Jewish distrust; Ritter's line (exact).
- Transmission: the Vienna papyrus G 29810, "usually said to have been produced in the third century" (Nongbri). P = Pal. gr. 14 for
  the *Life*, 9th/10th c. (Thackeray; Pinakes bibliography consistent). Two families of the *War*, PA(ML) and VR(C), with the
  inferior type already in Porphyry. Hegesippus about 370 and a Latin version known to Cassiodorus (Loeb 203; Wikipedia: abbreviated
  and full Latin versions). The bisection of the *Antiquities* (Loeb 242). The lacuna Ap. 2.52–113, made good from the Latin made by
  order of Cassiodorus (Loeb 186). It is visible in the Scroll: the Greek of 2.51 breaks off at «τῆς βασιλείας» and goes on «et filios
  regis …», and 2.113 turns back to Greek at «τὴν πορείαν ποιουμένων». Cassiodorus, Theodoric and Vivarium (Wikipedia).
- Print: 1544, Basel, Froben and Episcopius, ed. Arlenius, with 4 Maccabees (Wikipedia, editiones principes); Mendoza's library
  (Wikipedia, Arlenius). Whiston's title page: "according to Havercamp's accurate Edition … London 1737". Whiston's "enormous
  popularity" and "often the book (after the Bible) that Christians most frequently owned" (Wikipedia). Niese, Weidmann, Berlin
  1885–1895, 7 vols, numbering still used (Wikipedia, Niese; TEI headers 1885–1895). The Münster edition (Wikipedia). Niese's
  sections against the older chapters (Loeb 186).
- Variants: the Slavonic (Popov 1866, Eisler 1926, rejected: Wikipedia; Thackeray's report of Eisler). Most manuscripts title the
  *War* Περὶ ἁλώσεως (Loeb 203). Ant. 20.263: cod. A and the epitome add καὶ ποιητικῶν μαθημάτων (Loeb 203), absent from the Scroll.
  Ant. 20.268 «ἐν τέσσαρσι βίβλοις» against Whiston's "three books" (both in the Scroll).
- Editions: Whiston 1856 printing (TEI headers). Naber, Teubner, Leipzig 1888–96, 6 vols, trusting AMW for the *Life* (Loeb 186).
  Loeb 186 (1926), 203 (1927), 210 (1928), 242 (1930), 410 (Marcus and Wikgren, 1963), 433 (Feldman, 1965), nine volumes in all
  (Internet Archive metadata and title pages). The Brill Josephus Project, ed. Mason, first volume Feldman's *Judean Antiquities 1–4*
  (2000), labelled vol. 3 (Goldberg's review).
