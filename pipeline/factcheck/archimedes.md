# Fact check: Archimedes (web/src/wiki/authors/tlg0552.ts)

Checked 2026-10-07 by an independent checker. Every `cite` source was opened with `scripts/passage.ts` and read against the
sentences that point to it (Eutocius on the *Measurement* 1.1 and on *Sphere and Cylinder* 37; *Sand-Reckoner* 1 and 4;
*Quadrature* pr.; *Sphere and Cylinder* 1.pr; *Measurement* 3; *Method* pr1; Plutarch, *Marcellus* 14.3–14.9, 15.1–17.3,
17.4–17.7, 19.4–19.6; Plutarch, *Non posse* 11; Polybius 8.3.3–8.7.7; Lucian, *Hippias* 2; Strabo 1.3.11; and the Scroll's
catalogue entry for tlg0552). Every `url` source was fetched: the ten Wikipedia pages as raw wikitext; Heath's *Works* (1897),
Heath's *Method* (1912) and Heiberg's *Opera* vol. III (1915) as Internet Archive full texts; the Internet Archive record of
the 1544 Basel edition; Wilson's and Netz's pages on archimedespalimpsest.org; the CNRS press release; the IMU Fields Medal page;
the Stanford Classics page; the Perseus Catalog record; Cicero, *Tusc.* 5 on The Latin Library; Vitruvius 9 on LacusCurtius;
and the LSJ entries in the site's copy. The TEI headers of all thirteen Archimedes files and the three Eutocius files in
`pipeline/.cache/corpus/first1k` were read. For the *Book of Lemmas* question, three reviews of Mugler's edition on Persée
were also read. The researcher's log (`pipeline/drafts/checked/tlg0552.md`) was read but not relied on.

Totals: **11 findings** (2 medium-high, 2 medium, 7 low). No wrong dates, no misquoted Greek and no footnote pointing at the
wrong passage were found. The quotations from the Scroll all match the Greek letter for letter. The main points:
- The *Book of Lemmas* claim is **true**, but neither of its two sources says it. A 1973 review of Mugler's edition does:
  the Greek is a modern reconstruction in Doric by E. Stamatis, printed "as a philological curiosity".
- The article uses ἁμός ("my") as evidence of Archimedes' Doric. At that spot, though, the word is a modern editor's
  correction (Blass), as the article itself says further down.
- The article says two Wikipedia pages disagree about who first mentioned the mirrors. They do not.

---

### 1. *Book of Lemmas*: the claim is right, but neither cited source supports it
- **Claim:** "Since no Greek copy is known, the Greek that the Scroll prints for it is a modern rendering, not an ancient text.[^2,19]"
- **Problem:** The writer inferred this (the log says so), and neither footnote supports it. Heath (source 2) says only that the
  work "has reached us through the Arabic". He says nothing about any Greek text, because none existed in 1897. Source 19 (the
  Scroll's TEI header) names only "Archimède, ed. Charles Mugler, Belles Lettres, Paris, 1971, vol. 3", not where the Greek
  came from. The claim itself is **correct**: a review of Mugler's volume says the Greek is a modern reconstruction in Doric
  by E. Stamatis. Mugler printed it "as a philological curiosity", together with the second of the two 17th-century Latin
  translations. That Latin translation is also in the Scroll, as `tlg0552.tlg011.1st1K-lat1.xml`. The Greek file is indeed in
  Doric (Εἴ κα ᾗ δύο κύκλοι … σαμείου … ἐσσοῦνται). Saying "a modern rendering" without naming who made it is accurate,
  but the article can now name the source and the man.
- **Evidence:** Michel Federspiel, review of Mugler, *Archimède* II–III, *Revue des Études Anciennes* 75 (1973), pp. 375–377
  (https://www.persee.fr/doc/rea_0035-2004_1973_num_75_3_3946_t1_0375_0000_2): «le texte ne nous est parvenu que dans une
  version en langue arabe dont deux traductions ont été données en latin au xviie siècle. L'opuscule a fait l'objet d'études
  philologiques de la part de J. L. Heiberg … et surtout d'E. Stamatis, qui a tout récemment reconstitué le texte grec en
  dialecte dorien. La reconstitution d'E. Stamatis est donnée dans cette édition, à titre de curiosité philologique, en même
  temps que la deuxième traduction latine.» Heath, *Works* p. xxxii: "a collection of Lemmas (Liber Assumptorum) which has
  reached us through the Arabic". Header of `tlg0552.tlg011.1st1K-grc1.xml`: Mugler, Belles Lettres, Paris, 1971, vol. 3,
  with no word on where the Greek came from.
- **Suggested fix:** "Since no Greek copy is known, the Greek that the Scroll prints for it is a modern reconstruction, made
  in Doric by the scholar E. Stamatis, which Mugler printed, beside a seventeenth-century Latin translation, “as a
  philological curiosity” (our translation).[^2,41]" Add a source 41: "Michel Federspiel, review of Charles Mugler,
  Archimède, tomes II–III, Revue des Études Anciennes 75 (1973), 375–377, on Persée (the Book of Lemmas: Stamatis's Doric
  reconstruction)", with the Persée URL above. Add "as a philological curiosity" to `outsideQuotes`.
- **Confidence:** high

### 2. ἁμός is given as Archimedes' own Doric, but at that spot the word is Blass's correction
- **Claim:** "and for “my” father he uses ἁμός, a word the dictionary marks as especially Doric.[^23]" (in "Reading him").
  Compare "A life in Syracuse": "he mentions «Φειδία δὲ τοῦ ἁμοῦ πατρὸς», “Pheidias my father”.[^5,2]"
- **Problem:** The article's own variants section says, citing Heath, that «τοῦ ἁμοῦ πατρὸς» is not in the manuscripts. It is
  Blass's correction of their τοῦ Ἀκούπατρος. So "he uses ἁμός" is evidence of a modern editor's Doric, not of
  Archimedes'. This is the one place in the passage where the word ἁμός comes from the editor. γᾶ and ἅλιος, the other two
  examples, are read in the manuscripts and are sound. In "A life in Syracuse" the quotation is also given as his own words.
  The variants section corrects this later, but nothing in the life section warns the reader.
- **Evidence:** Heath, *Works* p. xv n. §: "Pheidias is mentioned in the Sand-reckoner … Φειδία δὲ τοῦ ἁμοῦ πατρὸς (the last
  words being the correction of Blass for τοῦ Ἀκούπατρος, the reading of the text)". LSJ (site copy) for ἁμός (A): "freq.
  used for ἐμός … esp. in Dor." (the LSJ entry itself is quoted correctly).
- **Suggested fix:** In "Reading him", replace the clause with a sound example from the same text: "…and the sun ἅλιος, not
  ἥλιος; elsewhere in the same book “by us” is ὑφʼ ἁμῶν, not the Attic ὑφʼ ἡμῶν.[^5,23]" (ὑφʼ ἁμῶν occurs several times in
  *Sand-Reckoner* 1 in the Scroll.) If the ἁμός sentence is kept, say: "and in the text editors print, his father is “ἁμός”,
  “my”, a word the dictionary marks as especially Doric, though that word is a modern correction (see Variants).[^23,2]" In
  "A life in Syracuse", add "(in a modern correction of the manuscripts; see Variants)" after "Pheidias my father".
- **Confidence:** high on the facts; the wording of the fix is a suggestion

### 3. The two Wikipedia pages do not disagree about who first mentioned the mirrors
- **Claim:** "Wikipedia's article on Archimedes names Galen, later in the second century, as the first to mention mirrors; its
  article on the “heat ray” names Anthemius of Tralles, about AD 500.[^1,13]" (The header comment also calls this
  "the disagreement with Galen", and the log calls Galen against Anthemius a weak point.)
- **Problem:** The sentence is built to present two rival "firsts". The heat-ray page does not call Anthemius the first. It
  says only that the story "was an established story about Archimedes by around 500 AD, when Anthemius described a
  reconstruction", and "Around 500 AD, Anthemius of Tralles mentions burning-glasses as Archimedes' weapon". The Archimedes
  page agrees and puts Anthemius after Galen: "Nearly four hundred years after Lucian and Galen, Anthemius, despite skepticism,
  tried to reconstruct Archimedes' hypothetical reflector geometry." So the sources do not conflict, and there is no reason to
  hedge by naming Wikipedia in the text.
- **Evidence:** https://en.wikipedia.org/wiki/Archimedes (War machines): "The first author to mention mirrors is Galen,
  writing later in the same century. Nearly four hundred years after Lucian and Galen, Anthemius …".
  https://en.wikipedia.org/wiki/Archimedes%27_heat_ray (lead and "Historical accounts"), as quoted above.
- **Suggested fix:** "Galen, later in the second century, is the first to mention mirrors, and about AD 500 the architect
  Anthemius of Tralles tried to work out how such mirrors could have been made.[^1,13]" Remove "the disagreement" from the
  header note.
- **Confidence:** high

### 4. The "publish, not discover" correction: Netz does not say which passage it is in
- **Claim:** "The new imaging of the palimpsest shows that the manuscript makes Eudoxus the first to “publish” the proof, not
  to “discover” it: one of hundreds of small corrections to Heiberg's reading.[^38]" The sentence follows the *Method* preface
  quotation (sources 21, 22).
- **Problem:** Source 38 (Netz) says only: "in Heiberg's text Eudoxus was the first to 'discover' a certain proof; we know now
  the text has Eudoxus as the first to 'publish' it". He names neither the work nor the passage, and gives no Greek. Linking
  his remark to the cone-and-pyramid sentence of the *Method* preface is a strong inference. It is the only place in
  Heiberg's text where Eudoxus "discovers" (ἐξηύρηκεν) a proof, and the *Method* survives only in the palimpsest. But it
  remains the writer's inference: the log says so, and two searches found no published statement of it. The article states it
  as fact, tied to "the proof" just quoted. Netz also says the corrections number "in the hundreds, if not thousands", and
  that most are scribal slips. "Hundreds of small corrections" is therefore a fair summary.
- **Evidence:** https://archimedespalimpsest.org/about/scholarship/archimedes-manuscript.php: "many corrections – numbering in
  the hundreds, if not thousands - to the text as printed by Heiberg … (To take a single example: in Heiberg's text Eudoxus was
  the first to "discover" a certain proof; we know now the text has Eudoxus as the first to "publish" it)".
  `npx tsx scripts/passage.ts tlg0552.tlg010 pr1`: «ὧν Εὔδοξος ἐξηύρηκεν πρῶτος τὴν ἀπόδειξιν».
- **Suggested fix:** "Reviel Netz reports that the new imaging shows a passage where Heiberg's text makes Eudoxus the first to
  “discover” a proof, and the manuscript makes him the first to “publish” it. He does not say which passage, but this sentence
  is the only one in Heiberg's text where Eudoxus “discovers” a proof. It is one of hundreds of small corrections to
  Heiberg's reading.[^38]"
- **Confidence:** medium (the inference is very probably right; the finding is that it is stated as sourced fact)

### 5. Cicero's Latin is translated as if *a pulvere et radio* described the man; it goes with the verb
- **Claim:** "He called Archimedes *humilem homunculum a pulvere et radio*, “a humble little man of the dust and the drawing-rod”
  (our translation).[^7]"
- **Problem:** The Latin is cut off before its verb: «ex eadem urbe humilem homunculum a pulvere et radio excitabo … Archimedem»,
  "from the same city I shall call up, from his dust and drawing-rod, a humble little man … Archimedes". *A pulvere et radio*
  ("from the dust and the rod") goes with *excitabo*, "I shall call up". It does not describe *homunculum*. "Of the dust and the
  drawing-rod" turns a phrase about where Cicero summons him from into a label for the man. Because the translation is marked
  as the site's own, it should match the Latin. The meaning stays close, so this is low severity.
- **Evidence:** https://www.thelatinlibrary.com/cicero/tusc5.shtml, §64: "ex eadem urbe humilem homunculum a pulvere et radio
  excitabo, qui multis annis post fuit, Archimedem."
- **Suggested fix:** "He called Archimedes a *humilem homunculum*, “a humble little man”, whom he would “call up from his dust
  and drawing-rod” (*a pulvere et radio excitabo*; our translation).[^7]" Update `outsideQuotes` to match.
- **Confidence:** medium

### 6. The English for Plutarch's εὕρηκα includes words the quoted Greek leaves out
- **Claim:** "«ἐξήλατο βοῶν εὕρηκα», “he leaped up as one possessed or inspired, crying, I have found it”.[^18]"
- **Problem:** "as one possessed or inspired" translates «οἷον ἔκ τινος κατοχῆς ἢ ἐπιπνοίας». Those words come just before the
  quoted Greek and are not in it. The Greek and the English printed side by side do not match.
- **Evidence:** `npx tsx scripts/passage.ts tlg0007.tlg139 11`: «ἐννοήσας τὴν τοῦ στεφάνου μέτρησιν οἷον ἔκ τινος κατοχῆς ἢ
  ἐπιπνοίας ἐξήλατο βοῶν εὕρηκα»; Baxter/Goodwin: "he leaped up as one possessed or inspired, crying, I have found it (εὕρηκα)".
- **Suggested fix:** Quote «οἷον ἔκ τινος κατοχῆς ἢ ἐπιπνοίας ἐξήλατο βοῶν εὕρηκα» with the same English, or keep the short
  Greek and shorten the English to "he leaped up … crying, I have found it".
- **Confidence:** high (low severity)

### 7. Eutocius mentions the lost *Life* twice, not once
- **Claim:** "A man called Heracleides wrote a *Life* of him, but it is lost;[^1,2] all that survives is a mention by Eutocius, a
  commentator of the sixth century AD: «ὥς φησιν Ἡρακλείδης ἐν τῷ Ἀρχιμήδους βίῳ» …[^3,1]"
- **Problem:** Source 2 (Heath) says that Eutocius refers to the *Life* in two places. One is the commentary on the
  *Measurement*, which the article quotes. The other is his commentary on Apollonius' *Conics*, where the name is garbled as
  Ἡράκλειος. So "a mention" is inaccurate. Both mentions also report what Heracleides said, so they are more than bare
  mentions.
- **Evidence:** Heath, *Works* p. xv n. *: "Eutocius mentions this work in his commentary on Archimedes' Measurement of the
  circle, ὥς φησιν Ἡρακλείδης ἐν τῷ Ἀρχιμήδους βίῳ. He alludes to it again in his commentary on Apollonius' Conics (ed. Heiberg,
  Vol. II. p. 168), where, however, the name is wrongly given as Ἡράκλειος."
- **Suggested fix:** "…all that survives are two references to it by Eutocius, a commentator of the sixth century AD, one of
  them: «ὥς φησιν …», “as Heracleides says in his Life of Archimedes” (our translation).[^3,2]"
- **Confidence:** high (low severity)

### 8. Plutarch gives the grave request as hearsay ("he is said to have asked")
- **Claim:** "He asked, Plutarch says, for his grave to carry “a cylinder enclosing a sphere”, with the proportion between them.[^11]"
- **Problem:** Plutarch hedges: λέγεται … δεηθῆναι, "he is said to have asked". Heath also writes "is said to have requested".
  The article drops the hedge. The tomb itself is well attested by Cicero, but the request is a report.
- **Evidence:** `npx tsx scripts/passage.ts tlg0007.tlg022 17.4 17.7` (17.7): «λέγεται τῶν φίλων δεηθῆναι καὶ τῶν συγγενῶν»;
  Perrin: "he is said to have asked his kinsmen and friends to place over the grave … a cylinder enclosing a sphere".
- **Suggested fix:** "He is said, Plutarch reports, to have asked for his grave to carry “a cylinder enclosing a sphere”, with
  the proportion between them.[^11]"
- **Confidence:** medium (low severity)

### 9. Heiberg recognised Archimedes from the 1899 catalogue, before he went in 1906
- **Claim:** "In 1899 a catalogue of the Greek Orthodox library in Constantinople printed a few lines of the faint lower text, and
  in 1906 Heiberg came, recognised Archimedes, and had the pages photographed.[^27]"
- **Problem:** Source 27 says Heiberg realised the text was by Archimedes on seeing the lines printed in 1899. When he studied
  the manuscript in 1906, he *confirmed* it. Source 1 says the same: he went "after reading a short transcription published
  seven years earlier". The article puts the recognition in 1906.
- **Evidence:** https://en.wikipedia.org/wiki/Archimedes_Palimpsest (Modern): "Upon seeing these lines Johan Heiberg … realized
  that the work was by Archimedes. When Heiberg studied the palimpsest in Constantinople in 1906, he confirmed that the
  palimpsest included works by Archimedes thought to have been lost."
- **Suggested fix:** "…printed a few lines of the faint lower text, in which Heiberg recognised Archimedes; in 1906 he came to
  Constantinople, confirmed it, and had the pages photographed.[^27]"
- **Confidence:** high (low severity)

### 10. "Torelli's edition followed … Heiberg's came next" skips Rivault's Greek-and-Latin edition of 1615
- **Claim:** "J. Torelli's edition followed at Oxford in 1792.[^2] Heiberg's edition (Leipzig, 1880–81), which Heath called
  definitive, came next,[^2]"
- **Problem:** "Followed" and "came next" read as a full list of editions of the Greek after 1544. Heath's list of principal
  editions, the cited source, puts D. Rivault's *Archimedis opera quae exstant graece et latine* (Paris, 1615) between them.
  It printed the propositions in Greek with the proofs in Latin. Commandino's Latin translation (Venice, 1558) also comes
  between them. Source 1 even shows the 1615 title page.
- **Evidence:** Heath, *Works* pp. xxix–xxx: "3. D. Rivault's edition, Archimedis opera quae exstant graece et latine … (Paris,
  1615), gives only the propositions in Greek, while the proofs are in Latin … 4. Torelli's edition (Oxford, 1792) … 5. Last of
  all comes the definitive edition of Heiberg". Wikipedia, Archimedes, caption: "Front page of Archimedes' Opera, in Greek and
  Latin, edited by David Rivault (1615)".
- **Suggested fix:** "Later editions of the Greek included David Rivault's (Paris, 1615), which gave only the propositions in
  Greek, and J. Torelli's (Oxford, 1792).[^2] Heiberg's edition (Leipzig, 1880–81), which Heath called definitive, followed,[^2]
  …"
- **Confidence:** high (low severity)

### 11. Isidore's compilation is given as fact; source 27 says it "is believed"
- **Claim:** "About AD 530 Isidore of Miletus, the architect of Hagia Sophia, gathered the works into one collection at
  Constantinople,[^1,27]" (timeline 530: "Isidore of Miletus gathers the works at Constantinople").
- **Problem:** Source 1 states it flatly. Source 27 qualifies it: "The first version of the compilation is believed to have been
  produced by Isidore of Miletus … sometime around AD 530". The article keeps the flat version. Heath (source 2) says only
  that Eutocius "several times alludes" to an edition by Isidorus, "the teacher of Eutocius". Low severity: this is the usual
  view, but the cited source hedges it.
- **Evidence:** https://en.wikipedia.org/wiki/Archimedes_Palimpsest (lead): "The first version of the compilation is believed
  to have been produced by Isidore of Miletus". Heath, *Works* p. xxxvi: "editions such as that of Isidorus of Miletus, the
  teacher of Eutocius, to which the latter several times alludes".
- **Suggested fix:** "About AD 530, it is believed, Isidore of Miletus, the architect of Hagia Sophia, gathered the works into one
  collection at Constantinople,[^1,27]"
- **Confidence:** low-medium

---

**Note on the header comment (not counted as a finding).** The header says that the date "1311" for codex B was "found only in a
search summary". It is in the article's own source 28. Heiberg, *Opera* III (1915), p. LV, shows that both of Moerbeke's Greek
manuscripts (codex B and codex A) are listed in the papal library catalogue of 1311: "in catalogo antiquo illius bibliothecae a.
1311 confecto uterque recensetur", and codex B is also in the catalogue of 1295. The fact could be used if wanted. It agrees with
Netz's "lost probably in the 14th century".

---

**Checked, no problems found in:**
- Eutocius, *Measurement* 1.1: «ὥς φησιν Ἡρακλείδης ἐν τῷ Ἀρχιμήδους βίῳ» (exact). Eutocius, *Sphere and Cylinder* 37: the
  "old book" and «ἐν μέρει δὲ τὴν Ἀρχιμήδει φίλην Δωρίδα γλῶσσαν ἀπέσωζον» (exact; Heath's English).
- *Sand-Reckoner* 1: the opening, King Gelon, Aristarchus «τὰν δὲ γᾶν περιφέρεσθαι …» and Pheidias (all exact; Heath's
  English). *Sand-Reckoner* 4: «Ταῦτα δέ, βασιλεῦ Γέλων …» (exact).
- *Quadrature* preface: Conon's death; «ὃς ἧν οὐδὲν ἐπιλείπων ἁμῖν ἐν φιλίᾳ» (the translation is fair); «νῦν δὲ ὑφʼ ἁμῶν
  τεθεώρηται». *Sphere and Cylinder* 1.pr: «αὐτός τε ἡμιόλιός ἐστιν τῆς σφαίρας» and «τῶν ὑφʼ ἡμῶν τεθεωρημένων».
  *Measurement* 3 (exact). *Method* pr1: «Καὶ γάρ τινα τῶν πρότερόν μοι φανέντων μηχανικῶς ὕστερον γεωμετρικῶς ἀπεδείχθη» and
  the Eudoxus sentence; Heath's 1912 English for both (exact).
- Plutarch, *Marcellus* 14.3–14.9: kinsman and friend of Hiero; the letter; the boast (Greek exact); the three-masted
  merchantman and the compound pulleys; "mere accessories of a geometry practised for amusement" (14.4, Perrin).
  15.1–17.3: the engines, the iron claws, the stone of ten talents, "geometrical Briareus", the rope and the beam. 17.4: he
  left no treatise. 19.4–19.6: the three death stories (the quotation is exact), and that Marcellus grieved and honoured his
  kin ("generally agreed").
- Polybius 8.3.3 («μία ψυχὴ … ἀνυστικωτέρα», Shuckburgh exact); 8.5–8.6 (catapults for every range, the loopholes, stones of
  ten talents, the iron hand at the prow); 8.7.6 (eight months, never again dared to storm).
- Lucian, *Hippias* 2 (Greek and Harmon exact; no mirrors). Strabo 1.3.11 («ἐν τοῖς περὶ τῶν ὀχουμένων»).
- Wikipedia, Archimedes: c. 287–212; "almost universally agree"; Tzetzes' 75 years; Phidias, nothing else known; Plutarch's
  kinship against Cicero's humble origin; Dositheus a student of Conon; Eratosthenes head librarian; unknown whether he went to
  Alexandria; Pappus' "place to stand"; 214 BC and Marcellus; mirrors absent from Polybius, Livy and Plutarch; Lucian the
  earliest on ship-burning; Galen first on mirrors; Livy's death in the dust; "Do not disturb my circles" in no ancient
  source; Vitruvius two centuries later; Plutarch's Platonist mischaracterisation; the lost works (*Sphere-Making*, the
  thirteen semi-regular solids, *Principles* to Zeuxippus); the 96-sided polygons; 8 × 10^63; Doric; little known in
  antiquity outside Alexandria; Isidore c. 530; Eutocius in the same century; Arabic in the 9th century (Thābit) and Latin in
  the 12th (Gerard of Cremona); influence on the Renaissance and the 17th century; 1906.
- Wikipedia, Siege of Syracuse: war in 214, siege from 213 (so "214 or 213" with {debated} is fair); east coast. Wikipedia,
  Cicero: quaestor in Sicily in 75 BC. Wikipedia, William of Moerbeke: 1269, Viterbo, two Greek manuscripts both lost, his own
  copy in the Vatican. Wikipedia, editiones principes: Basel 1544, Herwagen, Venatorius; the *Cattle Problem* 1773 (Lessing);
  the *Method* 1907 (Heiberg). Wikipedia, Book of Lemmas / cattle problem / Ostomachion: known only in Arabic, through Thābit;
  "attributed"; 44 lines, Wolfenbüttel, 1773; the Ostomachion in fragments in Arabic and in the palimpsest.
- Wikipedia, Archimedes Palimpsest: the copy of c. 950 at Constantinople; to Jerusalem and Mar Saba; scraped in 1229, with
  the colophon of 13 April 1229; Tischendorf's leaf, now in Cambridge; Papadopoulos-Kerameus 1899; photographs 1906; Sirieix,
  water and mould; forged pictures on four pages; the 1998 sale in New York; the Walters imaging 1999–2008; X-rays at SLAC;
  online release 29 October 2008; the Blois leaf (ZPE, 6 March 2026).
- Heath, *Works* (1897): Heracleides; Tzetzes; Pheidias and Blass; the scholion on Gregory of Nazianzus naming Pheidias, a
  Syracusan astronomer; Hieron and his son Gelon; Diodorus 5.37.3 (the screw, "when he visited Egypt") and Heath's inference
  about Alexandria; Conon, to whom he sent his discoveries; Dositheus a pupil of Conon; Livy 25.31; Pappus' saying; mirrors
  "not found in any authority earlier than Lucian"; the Valla MS of the 9th or 10th century, Alberto Pio, Rodolfo Pio in 1544;
  Basel 1544 (Venatorius); Torelli, Oxford 1792; Heiberg 1880–81 "definitive"; the Doric (*Sphere and Cylinder* and
  *Measurement* "practically all traces … disappeared", the *Sand-Reckoner* "suffered least", both works "completely recast"
  after Eutocius); the Lemmas quote Archimedes by name, though some propositions may be his; the title page "edited in modern
  notation".
- Heiberg, *Opera* III (1915): "iterum edidit", vol. III; codex A "sumptibus Leonis … medio fere saeculo IX Cnopoli scriptus";
  Valla's library bought by Alberto Pio, prince of Carpi; with Rodolfo Pio at Rome in 1544; not in the 1564 inventory
  ("inter annos 1544 et 1564 … periit aut alio peruenit"); Moerbeke's two Greek codices at Viterbo in 1269; Ottob. lat. 1850;
  Eutocius and the Prolegomena in this volume.
- Wilson (archimedespalimpsest.org): A "probably the ninth century", Valla ("the Venetian humanist"), four copies (D, E, G, H)
  of the 15th–16th centuries; Moerbeke 1269 at Viterbo, autograph Vat. Ottob. lat. 1850, "extremely literal … permits a precise
  reconstruction"; *temnesthai* → *brekhesthai*, Latin *humectetur*.
- Netz (archimedespalimpsest.org): A lost in the 16th century; codex B lost "probably in the 14th century", known through a
  Latin translation; overlaps with A (*Spirals*, *Sphere and Cylinder*, *Measurement*) and with B (*Floating Bodies*); the
  *Method* and the fragmentary *Stomachion*; corrections in the hundreds.
- CNRS press release (dated 9 March 2026): leaf 123, *Sphere and Cylinder* I, propositions 39–41, Musée des Beaux-Arts de Blois,
  ZPE article of 6 March 2026.
- Internet Archive record of the 1544 edition: Basel, Herwagen, March 1544; Greek and Latin; "Editio princeps, edited by Thomas
  Venatorius"; Eutocius' commentaries; the romanised title as given.
- Perseus Catalog: Mugler, tome I, Belles Lettres 1970, "Texte établi et traduit par Charles Mugler". The TEI headers give
  vol. 1 1970, vols. 2–3 1971, vol. 4 1972. A review on Persée (Donnay, *L'Antiquité classique* 49, 1980) gives 1970–1972 for
  the four volumes. The Perseus Catalog gives 1972 for tome III, which disagrees with the headers and with Federspiel's
  review (1971). This does not affect the article's "1970–1972".
- Stanford Classics: Netz vol. 1 (CUP 2004); the first scientific edition of the diagrams, using the palimpsest; the first
  English translation of Eutocius. IMU: the head, ΑΡΧΙΜΗΔΟΥΣ, the sphere inscribed in a cylinder (Knobloch).
- Cicero, *Tusc.* 5.64–66: quaestor; the Syracusans denied the tomb existed; brambles and thickets; the Agrigentine gates; the
  small column with a sphere and a cylinder.
- Vitruvius 9 pref. 9–12 (Gwilt): the crown, the silver, the overflowing bath, "leapt out of the vessel in joy, and, returning
  home naked" (exact).
- LSJ: γᾶ "Dor. and Aeol. for γῆ"; ἅλιος (C) "Dor. for ἥλιος"; ἁμός "esp. in Dor.".
- The Scroll: thirteen Archimedes files (tlg001–013), all from Mugler, digitised in 2018. Eutocius on *Sphere and Cylinder*,
  *Measurement* and *Equilibrium of Planes* (tlg4072.tlg001–003; tlg003 is in the catalogue, although only 001 and 002 are
  footnoted).
- Timeline years, kinds and `approx` flags agree with the prose and the sources. The {legend} and {debated} labels are
  appropriate: the boast, the mirrors, the eureka story and the last words are {legend}; the Alexandria visit, Plutarch's
  view of engineering and the siege date are {debated}.

**Could not verify:**
- Which passage Netz's "publish" correction refers to (see finding 4). The palimpsest's Greek reading was not seen.
- Stamatis's own publication of the Doric reconstruction (only the review that reports it was read). His first name is not
  given there, so the fix keeps "E. Stamatis".
- Diodorus 5.37.3 itself (not in the Scroll's copy); it was checked only as Heath quotes it.

**Findings: 11** (#1 and #2 medium-high; #3 and #4 medium; #5–#11 low).
