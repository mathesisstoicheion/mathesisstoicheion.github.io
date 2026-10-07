# Fact-check: Claudius Ptolemy (web/src/wiki/authors/tlg0363.ts)

Checked 2026-10-07 by an independent checker (not the article's author).

Method. Every `cite` source (8 passages: Suda Π 3033; *Almagest* 1.toc, 1.1, 3.1, 10.1, 13.2; *Tetrabiblos* 1.1; *On Music* 1–27)
was opened with `npx tsx scripts/passage.ts <work> <ref>` from `web/` and read against each sentence that points to it. Every `url`
source was fetched and read in full: Toomer's DSB article (MacTutor PDF, as text), Robbins's Loeb Introduction and Book I §§ 1–3 on
LacusCurtius, Wikipedia *Ptolemy*, *Almagest*, *Theon of Alexandria* and *List of editiones principes in Greek* (raw wikitext), Tolsa
(GRBS PDF), Jones's AJP review (NYU PDF), the Internet Archive record, Hübner's Münster publication list, the two Princeton pages
(through WebFetch; plain download is blocked by Cloudflare) and the Leonardo review. LSJ κατασκελής was read in the site's own copy
(`web/public/data/lsj/κα.json`). All 24 sources opened. Edition claims were compared with the TEI headers in
`pipeline/.cache/corpus/{first1k,perseus}/data/tlg0363` and with `web/public/data/catalog.json`. The researcher's log
(`pipeline/drafts/checked/tlg0363.md`) was read but not relied on.

Totals: **9 findings**. One is a real error of substance: the "141 or 151?" paragraph gives Robbins a remark that Robbins reports
from Boll, drops Boll's own conclusion that there is "no real reason for altering the figure", and leaves out that Toomer's
translation does alter it, on astronomical grounds. One is a dropped qualification in a {debated} paragraph (Toomer says
Meliteniotes "could be correct"). The other seven are small: an overstated "most of his time", "the other works followed", an
"ancient" Suda, a dropped "apparently", a partial account of the 1538 commentary, an over-general "in the Almagest manuscripts", and
a quoted "rule" whose proviso was cut. No misquotation was found: every Greek quotation matches the Scroll letter for letter, and the
English quotations from Toomer, Robbins, Tolsa (Paton), LSJ and Wikipedia are exact.

---

### 1. The 141/151 paragraph credits Robbins with Boll's remark, drops Boll's conclusion, and leaves out Toomer's correction
- **Claim:** variants: "Read as it stands, that would make his latest observation one of 151, and Franz Boll accepted it; Robbins notes
  that a very slight change in the text would make the date 141.[^2] Toomer gives the latest observation as 2 February 141.[^1]"
- **Problem:** Three things.
  (a) In Robbins's note 7 it is Boll himself (misprinted "Bill") who "points out" that a slight change would give 141. Robbins is
  reporting Boll.
  (b) The same sentence goes on to say "there is no real reason for altering the figure". So Boll, followed by Robbins, kept 151 even
  though he knew of the possible change. The article leaves this out and makes it sound as if Robbins favoured 141.
  (c) The article does not say why Toomer gives 141. Toomer's translation reads the year as the *fourth* of Antoninus, not the
  fourteenth. His reason is that the sun's position given in the same passage does not fit year 14. With that reading the observation
  falls on 29/30 July 140. So "would make the date 141" is not right either. The observation itself becomes one of 140, and the latest
  observation overall is then 2 February 141, from another passage (Toomer's note 1 cites *Almagest* IX.7 and XI.5).
  The {debated} label can stay, but the paragraph should give each side correctly.
- **Evidence:** Robbins, Introduction, note 7 (source 2): "This is Boll's conclusion (op. cit., p64)… Bill [Boll], ibid., pp63, 65,
  cites the passages of the Almagest which refer to the dated observations. He points out that a very slight change in the text of
  Almagest, X.1, would make the date of the latest observation 141 instead of 151, but though this would, perhaps, agree better with
  some of the traditions, there is no real reason for altering the figure." Main text: "the earliest of his observations recorded in
  the Almagest was made in 127 and the latest in 151".
  Toomer's reading, as quoted by J. Voisey's chapter-by-chapter commentary on Toomer's translation
  (https://jonvoisey.net/blog/2023/12/almagest-book-x-the-apogee-of-venus/): "In the fourth year of Antoninus, Thoth [I] 11/12 in the
  Egyptian calendar [July 29/30 140 CE]…". Its footnote: "Toomer notes that manuscripts usually give this as the fourteenth, but this
  does not match the calculations for the solar position… Thus, the value in the tens place is evidently in error." (I could not open
  Toomer's book itself; this is a secondary quotation of it.) A rough check agrees. The passage gives the mean sun at Leo 5¾°. Eleven
  365-day Egyptian years later, Thoth 11 falls about 2.7 days earlier in the season, which would put the mean sun near Leo 3°. D. Duke,
  who works from Toomer's text, likewise treats the *Almagest*'s own observations as spanning "127-141 AD"
  (https://people.sc.fsu.edu/~dduke/inner.pdf).
  Scroll: `npx tsx scripts/passage.ts tlg0363.tlg001 10.1`: «ἡμεῖς δὲ ἐτηρήσαμεν τῷ ιδʹ ἔτει Ἀντωνίνου κατʼ Αἰγυπτίους Θὼθ ιαʹ εἰς
  τὴν ιβʹ … ὁ δὲ μέσος ἥλιος Δέοντος μοίρας ε ∠ʹ δʹ».
- **Suggested fix:** "Read as it stands, that would make his latest observation one of 151. Franz Boll, who saw that a very slight
  change in the text would give 141, still found no real reason to alter it, and Robbins followed him.[^2] Gerald Toomer's
  translation reads "the fourth year" instead, which puts this observation in July 140, because the position of the sun given in the
  same passage does not fit the fourteenth; his latest observation is then 2 February 141.[^1]" If the article is to state Toomer's
  reason, add a source for it: Toomer's *Almagest* at X.1, or the Voisey page as a stopgap. Otherwise end with "…Toomer gives the
  latest observation as 2 February 141.[^1]" and keep only the corrected Boll/Robbins sentence.
- **Confidence:** high for (a) and (b); medium for (c), because I read Toomer's note only as quoted by a secondary source.

### 2. Toomer does not simply dismiss Meliteniotes: he says the report "could be correct"
- **Claim:** "Toomer calls the first late and unsupported, and sets the Arabic sources aside as adding nothing credible.[^2,1]"
- **Problem:** The paragraph sets Robbins against Toomer. But Toomer's sentence begins with a concession that the article drops. Toomer
  does not reject the Ptolemais report. He calls it possible but late and unsupported, so the two scholars are closer than the article
  makes them look.
- **Evidence:** Toomer, DSB (source 1): "The statement by Theodore Meliteniotes that he was born in Ptolemais Hermiou (in Upper
  Egypt) could be correct, but it is late (ca. 1360) and unsupported." Wikipedia, *Ptolemy* (source 4), quotes the same sentence.
- **Suggested fix:** "Toomer allows that the first could be correct but calls it late and unsupported, and sets the Arabic sources
  aside as adding nothing credible.[^2,1]"
- **Confidence:** medium

### 3. "Most of his time" turns Wikipedia's "the most time" into a majority
- **Claim:** "Astronomy took most of his time and effort.[^4]"
- **Problem:** Source 4 says astronomy was the subject he gave *the most* time and effort to, more than to any other subject. It does
  not say it took most (more than half) of his time. Its own measure is that "about half" of the surviving works are astronomical.
- **Evidence:** Wikipedia, *Ptolemy* (raw): "Astronomy was the subject to which Ptolemy devoted the most time and effort; about half of
  all the works that survived deal with astronomical matters".
- **Suggested fix:** "Astronomy was the subject he gave the most time and effort to: about half of his surviving works deal with
  it.[^4]"
- **Confidence:** low (a shade of meaning, but the source's wording is clear)

### 4. Toomer says the *Almagest* is the earliest of the *major* works, not that all the others followed it
- **Claim:** "The other works followed the *Almagest*, which several of them mention.[^1]"
- **Problem:** Toomer's claim is limited to the major works: the *Tetrabiblos*, *Handy Tables*, *Planetary Hypotheses* and
  *Geography*. For several minor works (*Analemma*, *Phaseis*, *Planisphaerium*) no order is known. The *Canobic Inscription*, if it
  is genuine, is earlier (the article's own timeline puts it at about 147, and Wikipedia's *Almagest* page, source 6, says it was
  earlier than the *Almagest*). The researcher's own header also notes that the *Harmonics* has no fixed place in the order.
- **Evidence:** Toomer (source 1): "The Almagest is certainly the earliest of the major works: it is mentioned in the introductions to
  the Tetrabiblos, Handy Tables, and Planetary Hypotheses, and in book VIII, 2, of the Geography". Wikipedia, *Almagest*: "the version
  of Ptolemy's models set out in the Canopic Inscription was earlier than the version in the Almagest".
- **Suggested fix:** "The *Almagest* is the earliest of his major works, and several of the later ones mention it.[^1]"
- **Confidence:** low

### 5. The Suda is not an "ancient" notice: Toomer calls it the only formal *biographical* notice
- **Claim:** "The only formal ancient notice of his life, in the tenth-century Byzantine encyclopedia called the Suda, is a few lines
  long.[^1]"
- **Problem:** Toomer's bibliography (source 1) supports "the only formal biographical notice", but he does not call it ancient. A
  tenth-century Byzantine lexicon is not ancient, and the same sentence says so. The word contradicts its own clause.
- **Evidence:** Toomer, Bibliography, "Life": "The only formal biographical notice (wretchedly incomplete) is in the tenth-century
  Byzantine lexicon of Suidas ("the Suda")".
- **Suggested fix:** "The only formal notice of his life, in the tenth-century Byzantine encyclopedia called the Suda, is a few lines
  long.[^1]"
- **Confidence:** low

### 6. Gerard's 300° latitudes: the source says he "apparently" learned from the Moors
- **Claim:** "Gerard of Cremona gave several stars a latitude of 300°, misreading an Arabic letter that stood for 60 in the East, where
  his manuscript came from, but for 300 among the Moors from whom he had learned.[^6]"
- **Problem:** Source 6 offers the explanation as a likely one: "He had apparently learned from Moors". The article states it as fact.
- **Evidence:** Wikipedia, *Almagest* (raw): "Gerard of Cremona… put 300° for the latitude of several stars. He had apparently learned
  from Moors, who used the letter س (sin) for 300…, but the manuscript he was translating came from the East, where س was used for 60".
- **Suggested fix:** "…misreading, it seems, an Arabic letter that stood for 60 in the East, where his manuscript came from, but for
  300 among the Moors from whom he had apparently learned.[^6]"
- **Confidence:** low

### 7. The 1538 commentary: book 3 is Nicolaus Cabasilas's, not Theon's
- **Claim:** "The Greek *Almagest* was first printed at Basel in 1538, followed by a commentary that is mostly Theon's, with Pappus'
  for book 5.[^1,20]"
- **Problem:** Not false, but incomplete in a way that misleads. Source 20 names a third author, Nicolaus Cabasilas (a
  fourteenth-century Byzantine), for book 3. The sentence implies that everything except book 5 is Theon's.
- **Evidence:** Wikipedia, *List of editiones principes in Greek* (raw), 1538 row: "while it mostly uses Theon (he covers Books I-II,
  IV, VI-X, XII-XIII), he also uses Pappus for Book V and Nicolaus Cabasilas for Book III."
- **Suggested fix:** "…followed by a commentary that is mostly Theon's, with Pappus' for book 5 and the Byzantine Nicolaus Cabasilas'
  for book 3.[^1,20]"
- **Confidence:** low

### 8. The two changed readings of the poem are in B, C and D, not in all the *Almagest* manuscripts
- **Claim:** "In the *Almagest* manuscripts two readings differ from the version in Synesius and the anthologies, and Tolsa argues that
  they were changed on purpose to fit the preface they stand beside.[^16]"
- **Problem:** Tolsa says G, one of the *Almagest* manuscripts the article names, shares those two readings with Synesius and the
  anthologies. The changed readings are those of "most of the Syntaxis manuscripts (BCD)".
- **Evidence:** Tolsa, GRBS 54 (2014) 693: "Finally, G and [the Handy Tables manuscript] have in common with the anthologies, and with
  Synesius, two forms which appear much changed in BCD… If we look at the version in most of the Syntaxis manuscripts (BCD)…"
- **Suggested fix:** "In most of the *Almagest* manuscripts (B, C and D) two readings differ from the version in Synesius and the
  anthologies, and Tolsa argues that they were changed on purpose to fit the preface they stand beside.[^16]"
- **Confidence:** low

### 9. The "rule" of simple hypotheses has a proviso that the quotation cuts off
- **Claim:** "He sets himself a rule: «ὅλως δὲ ἡγούμεθα προσήκειν διʼ ἁπλουστέρων ὡς ἔνι μάλιστα ὑποθέσεων τὰ φαινόμενα ἀποδεικνύειν», “in
  general we think it right to account for the phenomena by hypotheses as simple as possible” (our translation).[^11]"
- **Problem:** The Greek is quoted exactly, but the sentence goes on with a condition: as long as nothing significant in the
  observations goes against it. That condition is what lets Ptolemy use complex models for the planets, which the article's next
  sentence turns to. Presented as a bare "rule", the quotation drops a qualification that is in the source.
- **Evidence:** `npx tsx scripts/passage.ts tlg0363.tlg001 3.1`: «ὅλως δὲ ἡγούμεθα προσήκειν διʼ ἁπλουστέρων ὡς ἔνι μάλιστα ὑποθέσεων
  τὰ φαινόμενα ἀποδεικνύειν, ἐφʼ ὅσον ἂν μηδὲν ἀξιόλογον ἐκ τῶν τηρήσεων ἀντιπίπτον τῇ τοιαύτῃ προθέσει φαίνηται.»
- **Suggested fix:** keep the quotation and add after it: "…as simple as possible” (our translation), so long as nothing of weight
  in the observations tells against it.[^11]" (Add the new English to `outsideQuotes` only if it is put in quotation marks.)
- **Confidence:** low

---

**Checked, no problems found in:**
- Toomer, DSB (source 1): born about 100, died about 170; observations 26 March 127 to 2 February 141; the scholiast's "until the
  reign of Marcus Aurelius (161-180)"; Alexandria the only place named; *Ptolemaeus* / *Claudius* and citizenship from Claudius or
  Nero; Olympiodorus (sixth century), forty years at Canopus, "probably a fictional elaboration"; the Arabic sources "add nothing
  credible"; the Suda notice; thirteen books, the title, al-majisti / almagesti / almagestum; first principles to tables; stationary
  spherical earth; eccentric, epicycle, equant ("most original element"); 1,022 stars in 48 constellations; *Handy Tables*
  (Theon "changed nothing essential"); *Planetary Hypotheses* (physical models, absolute distances); *Tetrabiblos* as the natural
  complement; *Geography* in eight books, maps "undoubtedly" in Ptolemy's own publication, rebuilt from the text alone; *Harmonics*
  between Pythagoreans and Aristoxenians; *Optics* (Eugenius, twelfth century, from a lost Arabic); *Planisphaerium* (Arabic, Latin
  1143), astrolabe; *Mechanics* in three books lost; Syrus otherwise unknown; "a masterpiece of clarity and method"; the equinoxes
  each about a day out, Delambre's charge "implausible", selection of observations "likely"; standard textbook almost at once; Pappus
  (fl. 320), Theon (fl. 360); Arabic about 800, improved under al-Ma'mun; Sicilian Latin c. 1160 little known; Gerard 1175;
  Copernicus 1543 "cast in a firm Ptolemaic mold"; Tycho and Kepler; Jacobus Angelus c. 1406 and most cartography of the 15th–16th
  centuries; Heiberg the standard text; Basel 1538 with Theon's commentary; Canobic Inscription (tenth year; alternative reading
  "the fifteenth year"; Toomer doubts its authenticity); "The Ptolemaic system is indeed named after the right man."
- Robbins (sources 2, 15): his life pieced together from his works; Ptolemais and age 78 "probably" reliable (the 78 from Abulwafa,
  eleventh century); the physiognomists' stock portrait; "almost the authority of a Bible among the astrological writers of a thousand
  years or more"; "a difficult author even for the ancients", "long, involved sentences"; at least 35 manuscripts, none before the
  13th century; one tenth-century manuscript of the *Paraphrase*; Camerarius, Nuremberg 1535, from N with his printer's marks; Ishaq
  ibn Hunayn (ninth century) and Plato of Tivoli (1138); the two endings and Robbins's view of them; the three titles; the Robbins
  translation of the *Tetrabiblos* opening, quoted exactly; Boll–Boer 1940 (Robbins's 1980 note).
- Scroll passages: Suda Π 3033 (the Greek, "under Marcus", the *Mechanics* in three books); *Almagest* 1.toc (μαθηματικῆς συντάξεως;
  both chapter headings); 1.1 (ὦ Σύρε; the Aristotelian division; the two quotations and their translations); 13.2 (the quotation and
  translation); 10.1 (the quotation); *Tetrabiblos* 1.1 (title, ὦ Σύρε, the quotation); *On Music* 1–27 (heading ΠΤΟΛΕΜΑΙΟΥ
  ΜΟΥΣΙΚΑ; von Jan's notes at § 18 on Cleonides and § 23 on Nicomachus).
- LSJ κατασκελής: "the meagreness or inadequacy of human contrivances. Ptol. Alm. 13.2" (the site's copy misprints "contrinances";
  Perseus has "contrivances", as the article does).
- Wikipedia *Ptolemy*: Meliteniotes 14th century, Ptolemais Hermiou in the Thebaid; mathematics above theology; Plato of Tivoli 1138;
  maps c. 1300 after Planudes; Delambre "in the early 1800s"; two 12th-century Latin translations.
- Wikipedia *Almagest*: μεγίστη → al-majisṭī; the equant as a third device; not completed before about 150 (Hamilton); commentaries of
  Theon (extant), Pappus (fragments), Ammonius (lost); Gerard at Toledo, 1175; Α/Δ and Arabic 3/8; Newton 1977, "the most successful
  fraud in the history of science"; Gingerich, "some remarkably fishy numbers", rejected fraud; Toomer 1984, 2nd ed. 1998.
- Wikipedia *Theon of Alexandria*: c. 335–405, eclipses of 364; *Handy Tables* often credited to him in modern times but no
  manuscript names him, and the surviving tables are "very similar" to Ptolemy's.
- Wikipedia *List of editiones principes*: *Geography*, Basel 1533 (Froben); *Almagest*, Basel 1538 (Walder) with the commentary
  (but see finding 7).
- Tolsa (source 16): Anth. Pal. 9.577; Synesius' astrolabe shortly before 400, "old", no author named; Paton's translation "slightly
  modified" (quoted exactly); the poem in two of three branches, by the main scribe in B and C and a later hand in D and G; A (Par. gr.
  2389, 9th c., very few scholia), B (Vat. gr. 1594, third quarter of the 9th c., two columns, older scholia in capitals, "a highly
  reliable facsimile of its model"), C (Marc. gr. 313, late 9th–early 10th), D (Vat. gr. 180, 10th), G (Vat. gr. 184, 1269–70, used
  by Heiberg for books 7–13); the BC ancestor from the sixth-century school of Heliodorus and Ammonius, which added the preliminary
  material including the Canobic Inscription; the manuscripts led the anthologies to name Ptolemy.
- Jones, AJP 129 (2008): "some eight-thousand place names" with coordinates; no manuscript older than the late thirteenth century; the
  map origin "controversial"; two recensions parted before minuscule "if not already in antiquity"; Vat. gr. 191, a 13th-century
  anthology, stops giving coordinates "a little more than halfway"; the other recension with the oldest Ptolemaic maps; coordinates
  corrected by map-makers and not always Ptolemy's; Nobbe (1843–45) with no apparatus beyond an 18-page index; the Berne team's
  complete critical edition (Schwabe, 2006), with a German translation and reconstructed maps.
- Editions: TEI headers and catalogue (Heiberg 1898[–1903]; Boll–Boer, file dated 1954; Robbins, Loeb, printing of 1964; von Jan,
  1895; no English translation of Ptolemy in the Scroll); Internet Archive (Heiberg 1898–1903 and 1907; Boll–Boer 1940; Lammert and
  Boer 1961); Münster list (Hübner, *Apotelesmatika*, after Boll and Boer, Stuttgart–Leipzig 1998); Princeton UP, Toomer (1998; "based
  on the standard Greek text of Heiberg"; "numerous corrections derived from medieval Arabic translations"); Princeton UP,
  Berggren–Jones (copyright 2000); Leonardo review (the subtitle; Books 1, 2, 7 and 8).
