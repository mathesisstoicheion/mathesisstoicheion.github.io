# Fact-check: Theocritus (web/src/wiki/authors/tlg0005.ts)

Checked 2026-10-07 by an independent checker (not the writer).

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts` (Idylls 1.1–3, 7.21, 7.39–41, 11.1–8, 11.72, 14.58–68,
15.22–24, 15.87–95; Epigrams 23.1–24.3; Syrinx 1–20; Athenaeus 7.20 with Yonge's English) and read against each sentence that
points to it. Every "our translation" was compared word by word with the Greek or Latin. Every `url` source was opened: Wikipedia
(*Theocritus*, *Pastoral*, *Eclogues*, *List of editiones principes in Greek*, as wikitext); the Internet Archive OCR texts of
Cholmeley (1919), Edmonds (1916 printing) and Wilamowitz (1905), read in full where relevant (preface, life, authenticity,
manuscripts, early editions, addenda; Edmonds's introduction, argument to Idyll 1 and note on the Syrinx; Wilamowitz's preface,
list of poems and sigla); Suda On Line θ 166 (raw page); the four BnF records; the Internet Archive record of Gow vol. 1;
Cambridge Core pages for Gow's 1930 review, Bulloch 1987 (extract and footnote 1) and Williams's Gallavotti notice; McNamee's
GRBS PDF (note 7 and table); Fries's GRBS PDF; the ParaText page for f. 350r and, in addition, ParaText's pages on the
"Ambrosiana family" and the physical description of Ambr. C 222 inf.; The Latin Library, Eclogue 6. LSJ entries were read in the
site's copy (`pipeline/.cache/lsj`). TEI headers were read in `pipeline/.cache/corpus`. The writer's log
(`pipeline/drafts/checked/tlg0005.md`) was read but not relied on.

Totals: **7 findings** (1 high, 2 medium, 4 low). No misquotation of any source was found, and all the article's own translations
of Greek and Latin match the text. The one real misreport:
- Edmonds did **not** doubt the *Syrinx*: he set out Gow's argument against it and then answered it, and took the poem as
  Theocritus' own.

---

### 1. Edmonds did not doubt the *Syrinx*; he reported Gow's argument and rejected it
- **Claim:** "So is the *Syrinx*, a puzzle-poem whose answer is a shepherd's pipe dedicated to Pan by Theocritus: Edmonds, following an argument of A. S. F. Gow's, doubted that it is his.[^4,13]"
- **Problem:** Edmonds calls Gow's point (that the pipe of Theocritus' time had tubes of equal apparent length) "the strongest reason for doubting" the ascription. He then argues against it at once. He ends by treating the *Syrinx* as Theocritus' early work, earlier than the *Harvest Home* (*Idyll 7*), and as the origin of the poet's nickname Simichidas. So the article turns Edmonds's position upside down. Source 13 (the Scroll's text from Gow's OCT) says nothing about authorship either way, and no other source the article cites says the *Syrinx* is doubtful.
- **Evidence:** Edmonds, *The Greek Bucolic Poets* (1916 printing), Internet Archive OCR (`greekbucolicpo00theo_djvu.txt`), pp. 500–501: "The strongest reason for doubting the self-contained ascription of this remarkable tour-de-force to Theocritus is that the shepherd's pipe of Theocritus' time would seem to have been rectangular … [footnote: Advanced by Mr. A. S. F. Gow in an unpublished paper] **But** to the riddle-maker and his public a poem was primarily something heard, not something seen, and the variation in the heard length of the lines would correspond naturally enough to the variation in note of the tubes of the pipe. Moreover, every musical person must have known that, effectively, the tubes were unequal. … in giving himself the patronymic Simichidas the author is probably acknowledging his debt to his predecessor … If so, the Pipe is anterior to the Harvest Home, and we have here the origin of the poet's nickname."
- **Suggested fix:** "The *Syrinx* is a puzzle-poem whose answer is a shepherd's pipe dedicated to Pan by Theocritus. A. S. F. Gow argued that it cannot be his, because the pipes of Theocritus' day had reeds of equal length; Edmonds reported the argument, answered it, and kept the poem as Theocritus'.[^4]" If the article wants to keep "doubtful", it needs a source that says so (Gow's own later view, or Hopkinson, who prints the pattern poems apart; the BnF contents list in source 1 shows only that Hopkinson puts "Pattern poems (Technopaegnia)" in a separate section).
- **Confidence:** high

### 2. There are three Aeolic poems in the Scroll's edition, not two
- **Claim:** "… and two poems in the Aeolic dialect and metre (*28* and *29*); …[^2]"
- **Problem:** The cited source says "Two of these are **certainly** by Theocritus, 28 and 29". It then describes a third Aeolic poem: one "very corrupt", found by Ziegler in 1864 in a single late manuscript and "assigned to Theocritus by recent editors". That is *Idyll 30*, which is in the Scroll. Cholmeley, the Scroll's editor (source 3), also says "Idylls xxviii–xxx are written in lyric measures". Without "certainly", the article says there are only two Aeolic poems, which is wrong for the book the reader has in front of them.
- **Evidence:** Wikipedia, *Theocritus*, "Lyrics": "Two of these are certainly by Theocritus, 28 and 29, composed in Aeolic verse and in the Aeolic dialect. … A very corrupt poem, only found in one very late manuscript, was discovered by Ziegler in 1864. As the subject and style very closely resemble that of 29, it is assigned to Theocritus by recent editors." Cholmeley 1919, p. 36: "Idylls xxviii–xxx are written in lyric measures." The Scroll's *Idyll 30* (`passage.ts tlg0005.tlg001 30.1 30.4`) is in Aeolic: «Ὤιαι τῶ χαλεπῶ καἰνομόρω τῶδε νοσήματος …».
- **Suggested fix:** "… and poems in the Aeolic dialect and metre (*28*, *29* and *30*, the last found only in 1864, in one late manuscript); …[^2,3]"
- **Confidence:** high on the fact; medium on how much it matters

### 3. "Probably born about 300 BC" is footnoted to Cholmeley, who dates the birth about 310–308 BC
- **Claim:** "He came from Syracuse in Sicily, was probably born about 300 BC, and spent part of his life on the island of Cos …[^1,2,3]" (timeline: "Born at Syracuse, probably about 300 BC", `certainty: "debated"`, `src: [2, 5]`)
- **Problem:** Only Wikipedia (source 2) gives "c. 300 BC". Source 1 says only "early third century BC". The Suda (source 5, in the timeline) gives no date. Source 3, Cholmeley, cited in the summary sentence, puts the birth at 310–308 BC. The "probably" and the timeline's "debated" label help, but the summary's footnote suggests all three sources support the date, and one of them gives a different date.
- **Evidence:** Cholmeley 1919, p. 14: "we may set the date of the poet's birth 310-308 B.C."; p. 35 (chronological table): "310-8 B.C. Birth (Sicily)." Wikipedia: "born c. 300 BC". Suda θ 166: no date.
- **Suggested fix:** "He came from Syracuse in Sicily, was born about 300 BC or a little earlier (Cholmeley put it at 310–308), and spent part of his life …[^1,2,3]". In the timeline, use `src: [2, 3]` and "Born at Syracuse, about 300 BC or a little earlier".
- **Confidence:** medium

### 4. Doric is not "a country dialect"
- **Claim:** "What made the new form was a mixture: the hexameter, the metre of epic and of the grandest Greek poetry, in the mouths of goatherds speaking a country dialect.[^17,1]"
- **Problem:** Both cited sources name the dialect as Doric, "the Doric dialect of his native Sicily". Neither calls it rustic. It was the everyday speech of Syracuse and other Dorian cities, as the article itself shows in *Idyll 15*, where two city women from Syracuse speak it and defend it. Wikipedia's contrast is "simplicity and sophistication", not town against country.
- **Evidence:** Wikipedia, *Pastoral*: "He wrote in the Doric dialect but the metre he chose was the dactylic hexameter associated with the most prestigious form of Greek poetry, epic. This blend of simplicity and sophistication …". BnF record of Hopkinson's Loeb (jacket): "combine lyric tone with epic meter and the Doric dialect of his native Sicily".
- **Suggested fix:** "… the hexameter, the metre of epic and of the grandest Greek poetry, in the mouths of goatherds speaking the Doric of Sicily.[^17,1]"
- **Confidence:** medium (the wording is not supported by the sources and contradicts the article's own *Idyll 15* section)

### 5. "The first poet of the countryside" says more than the sources
- **Claim:** "Theocritus was a Greek poet of the early third century BC, and the first poet of the countryside: the herdsmen who sing to one another in the shade, in the kind of poetry later called pastoral, begin with him.[^1,2]"
- **Problem:** The sources make him the inventor of the *bucolic* or pastoral genre ("inventor of the bucolic genre", "creator of Ancient Greek pastoral poetry"). They do not make him the first poet of country life. Hesiod's *Works and Days*, a poem about farming, is centuries older. The article's own source 17 (Wikipedia, *Pastoral*) calls it the first literature with pastoral sentiments. The clause after the colon is right; only the label goes too far.
- **Evidence:** BnF, Hopkinson: "was the inventor of the bucolic genre". Wikipedia, *Theocritus*: "the creator of Ancient Greek pastoral poetry". Wikipedia, *Pastoral*: "Hesiod's Works and Days … This is the first example of literature that has pastoral sentiments and may have begun the pastoral tradition."
- **Suggested fix:** "… and the first poet of pastoral: the herdsmen who sing to one another in the shade, in the kind of poetry later called pastoral, begin with him.[^1,2]"
- **Confidence:** low

### 6. Hunter's *Selection* is not only "the country poems"
- **Claim:** (editions) Hunter, *Theocritus: A Selection. Idylls 1, 3, 4, 6, 7, 10, 11 and 13* … note: "Greek text with an English commentary on the country poems."
- **Problem:** The selection includes *Idyll 13*, the *Hylas*. The article itself puts that poem among the "short tales of heroes such as *Hylas* (*13*)", and Wikipedia classes it with the "Epics". *Idyll 10* (two reapers) is a farm poem, not a herdsmen's poem, though it is fair to call it a country poem. The BnF record (source 32) lists only the poem numbers.
- **Evidence:** BnF cb37098996g: "A selection : Idylls : 1, 3, 4, 6, 7, 10, 11 and 13". Article, summary: "short tales of heroes such as *Hylas* (*13*)". Wikipedia, *Theocritus*, "Epics": "The other poems are 13, the story of Hylas and the Nymphs, and 24 …".
- **Suggested fix:** note: "Greek text with an English commentary on eight poems, most of them country poems, with the *Hylas*."
- **Confidence:** low

### 7. K as Ambr. C 222 inf.: the inference is right, but the cited page does not say it
- **Claim:** "The single most valuable copy is K, a book in Milan (Ambrosianus C 222 inf.) that holds *Idylls 1–17*, *29* and the epigrams, with old notes in the margins.[^6,27]"
- **Problem:** I checked the writer's inference, as asked. Wilamowitz's siglum is "K — AMBROSIANVS 222, saec. xiii. Theocr. 1-17, 29. Epigr. Simiae Alae et Securis." Note that he gives other Ambrosiani with their letter (A = "G 32", C = "B 75", F = "B 99") but this one without. The identification with Ambr. C 222 inf. is **correct**. ParaText's own page on the "Ambrosiana family" says so in so many words, and lists the same contents. But source 27, the transcription of f. 350r, shows only Theocritus 9–10 with scholia in that codex. It never names K or its contents. So the shelfmark currently rests on an inference that the cited page does not state.
- **Evidence:** https://paratext.unipv.it/?p=1518 ("The 'Ambrosiana Family' in the tradition of Theocritus' Idylls"): "The manuscript Ambr. C 222 inf., identified by the siglum K, belongs to the so-called 'Ambrosiana family' … of which it is the sole witness. It represents one of the three main lines of transmission … alongside the Vaticana and Laurentiana families … preserves (ff. 339r-362v) … Idylls I, VII, III-VI, VIII-XIII, II, XIV, XV, XVII, XVI, XXIX, Epigrams 1-22, and the two carmina Alae and Securis." https://paratext.unipv.it/?p=1511 also dates the codex "ca. 1180-1186" after Mazzucchi, which matches Fries (source 28).
- **Suggested fix:** Keep the wording. Replace source 27 with (or add) "ParaText (University of Pavia), 'The "Ambrosiana Family" in the tradition of Theocritus' Idylls': Ambr. C 222 inf. = K, its contents and family" (https://paratext.unipv.it/?p=1518). The same page could also support "Scholars sort them into three families, the Ambrosian, the Vatican and the Laurentian".
- **Confidence:** high that the identification is right; low as an error (only a sourcing gap)

---

**Checked, no problems found in:**
- **Translations (Greek against the Scroll):**
  - 1.1–3 ("Sweet is the whispering of that pine …").
  - 7.39–41 ("in singing I beat neither the good Sicelidas from Samos nor Philitas"; «οὐ γάρ πω» supports "does not yet").
  - 11.1 ("there is no other medicine for love" than the Pierides, 11.3).
  - 11.7 («ὁ Κύκλωψ ὁ παρʼ ἁμῖν»).
  - 11.72 («ὦ Κύκλωψ Κύκλωψ, πᾷ τὰς φρένας ἐκπεπότασαι;»).
  - 14.59 and 14.68 (μισθοδότας … οἷος ἄριστος; «ᾇ τάχος εἰς Αἴγυπτον»).
  - 15.87–88, 15.90 and 15.92–93.
  - The Greek quotations are exact. 11.72 really is near the end (the poem has 81 lines).
- **Other translations:**
  - The epigram ἄλλος ὁ Χῖος, against Cholmeley's Greek: "one of the many people of Syracuse", "famous Philinna" (περικλειτῆς).
  - Artemidorus' epigram (AP 9.205, Greek in Cholmeley p. 50).
  - The argument to *Idyll 11* («ὃς συμφοιτητὴς γέγονεν Ἐρασιστράτου»).
  - Wilamowitz's Latin: "nobis necessario …"; "maxime per Vergilium"; "proterva intrudit interpolatione".
  - Virgil, *Ecl.* 6.1–2: "Prima Syracosio dignata est ludere uersu / nostra … Thalia".
- **LSJ:**
  - ἡδύς (Dor. ἁδύς), τῆνος (Dor. for ἐκεῖνος, Theoc. 1.1), ποτί (Dor. for πρός), πηγή (Dor. παγά).
  - ψιθύρισμα ("any low whispering noise, as of trees rustling, Theoc. 1.1").
  - εἰδύλλιον (dim. of εἶδος; "short, highly wrought descriptive poem, mostly on pastoral subjects … Sch. Theoc. Proll.").
  - βουκολέω "tend cattle"; βουκολιαστής (only Theoc. 5.68).
  - πλατειάζω ("pronounce broadly, like the Dorians, Theoc. 15.88"); ἐκκναίω; Δωρίζω (Theoc. 15.93).
  - σποράς ("not collected into a volume, AP 9.205"); πατριώτης "fellow-countryman"; θετός ("q. πατήρ adoptive father").
- **Suda θ 166 (Heath):**
  - The Chian rhetor first.
  - Praxagoras and Philinna "(though others [say], of Simmichas)".
  - "of Syracuse (though others [say] that he was from Cos and migrated to Syracuse)".
  - Bucolics in Doric.
  - Proetides, Hopes, hymns, funeral songs, elegies and iambi, epigrams. Heath's translation drops the Greek Ἡρωΐνας; the article's "among them" is safe.
- **Cholmeley (1919):**
  - The list of ancient notices and "to a large extent merely inferences from the poet's own works, and are not consistent".
  - The epigram "(not by Theocritus)".
  - Idyll 16 to 275–274 and Idyll 17 before Arsinoe's death (271–270); Beloch (1885) and Gercke (1887) for later dates of Idyll 16, so "nineteenth-century scholars" is right.
  - Theocritus at Ptolemy II's court about 273.
  - Philetas a "famous critic and elegiac poet"; the teacher-claim "seems to be merely an inference from Id. vii. 40 … This confirmation is however not altogether lacking".
  - The scholium on 7.21: πατρίου "obviously corrupt"; Hauler (step-father, mother remarried to Simichus of Cos), Meineke, Hiller; the words refer to "another", not to the poet.
  - "naturally difficult … at the beginning of a new epoch".
  - The smaller corrections mostly due to Ahrens.
  - Rejection of 19, 20, 21, 23, 27; the Megara included.
  - "now traditional order" from Stephanus (1566 and 1579).
  - Editio princeps "Mediolana, 1481", i–xviii; Aldine 1495.
  - Juntine and Callierges from Musurus' copy of a lost Codex Patavinus.
  - MSS "vary enormously"; none older than the twelfth century, most fourteenth and fifteenth, fuller ones compilations.
  - 26 "undoubtedly genuine".
  - Addenda: Artemidorus "about 70 B.C."; Theo "the first annotated edition"; "Nothing is known of Theocritus' later years or of his death", which supports "The date of his death is unknown" better than Wikipedia, whose infobox says "died after 260 BC".
- **Edmonds:**
  - "First printed 1912 / Reprinted May 1916", Heinemann and Putnam; preface "8 October, 1912".
  - "The rest—and that means much of the following account—is conjecture".
  - The argument of Idyll 1 (shepherd Thyrsis and a goatherd at noon, the cup, Daphnis).
  - The emendation of the argument to Idyll 11 ("otherwise both συν- and καὶ αὐτ. are unintelligible") and "He seems to have studied medicine … under the famous physician Erasistratus, along with the Milesian Nicias".
- **Wilamowitz (1905; "Dabam Berolini, Id. Aug. 1905"):**
  - Artemidorus in Sulla's time.
  - Theon's commented edition and fame "quanta ne vivus quidem floruerat, maxime per Vergilium".
  - Berenice lost; Suda titles "penitus interiere".
  - 8 and 9 "a Theocrito alienissima"; many epigrams falsely ascribed.
  - Silence "usque ad Tzetzae et Eustathii tempora"; from the twelfth century the Byzantines "conquirunt, describunt, emendant".
  - "Hylae pauca verba Oxyrhynchi inventa"; other scraps "abdita".
  - K "ceteros omnes … aequiparat auctoritate unus … sed incedere uno hoc duce nequaquam licet"; M next for the first twelve poems.
  - No change in dialect "nisi monito lectore"; false forms kept in the Appendix.
  - Praise owed to Ahrens "tantum non omnem".
  - Appendix numbers for 19, 20, 21, 23, 25, 26, 27.
  - Sigla for K (xiii), M (Vat. 915, xiii), P (Laur. 32.37, xiv), S (Laur. 32.16, xiv), and B (the lost Padua codex, used by Musurus in Callierges' and Junta's editions).
- **Wikipedia:**
  - *Theocritus*: the 1911 Britannica basis; Polyphemus "countryman"; Idyll 7 on Cos, Simichidas, Sicelidas = Asclepiades; singing matches; mimes 2, 14, 15; hymns 16, 17, 22; 13 and 24; 16 and 17 "the only ones which can be dated", 275–270; 28 with the distaff for Nicias' wife; 8 and 9 suspected; 26 and Eustathius; 19, 20, 21, 23, 25 spurious; doubtful epigrams; P.Oxy. 694 (Idyll 13, 2nd century AD).
  - *Pastoral*: Cos, Sicilian folk traditions, Doric and hexameter, Pope's *Pastorals* (1709), Arnold's *Thyrsis* (1867).
  - *Eclogues*: Theocritus the model, ten poems, Eclogue 2 from Idyll 11, 3 mostly from 5, 7 from pseudo-Theocritus 8, Eclogue 4 dated to 40 BC.
  - *List of editiones principes*: Milan, undated, c. 1482, first 18 idylls; Aldine 1495–1496, I–XXIII; Callierges, Rome, 1516, with the old scholia.
- **Papyri:**
  - Bulloch 1987 (extract and footnote 1): P.Oxy. 2064, late second century, published 1930; "very fragmentary"; "the most important known witness prior to the fifth century"; P.Oxy. 3548 in 1983; order closest, except for Id. 5, to the Laurentian family; the conventional order "follows the Vatican family, still has no ancient support".
  - Gow's review, CR 44.6 (1930) 228–230. The review's heading says "Egypt Exploration Fund", where Bulloch says "Society"; the label rightly copies the heading.
  - McNamee, GRBS 36 (1995), n. 7: the Antinoe Theocritus annotations "though abundant, are also intermittent and fall short of the relatively high standard of Theocritean scholia". Her table, as far as the PDF layout can be read, dates it to the 5th–6th century, so "late antiquity" is safe.
- **Manuscript K:**
  - Fries, GRBS 57: "Carlo Mazzucchi recently redated from ca. 1280 to the 1180s"; the codex is Pindar's A.
  - ParaText: ca. 1180–1186.
- **Editions:**
  - BnF: Hopkinson, Loeb 28, Harvard 2015, with the epigrams and fragments and the Megara under Moschus; the jacket text quoted.
  - BnF: Gow, 2nd edition, Cambridge 1952, 2 vols, Idylls I–XXXI.
  - BnF: Hunter, CGLC 1999.
  - BnF: Verity–Hunter, OUP 2002.
  - Internet Archive: Gow vol. 1 dated 1950.
  - CR 46.1 (1996): Gallavotti's 3rd edition, Rome, Istituto Poligrafico e Zecca dello Stato, 1993.
- **TEI headers:**
  - Idylls (30 poems) and Epigrams (24 pieces): Cholmeley, London, George Bell and Sons, 1901–1919.
  - Syrinx: Gow, *Bucolici Graeci*, Oxford, Clarendon Press, "1952 (printing)".
- **Athenaeus 7.20:** Yonge's English is quoted exactly.
- **Timeline:** all years, kinds and approx/debated marks agree with the sources above, apart from the birth entry (finding 3).

**Could not verify:** nothing the article relies on. Every source opened. ParaText's f. 350r page loads its metadata tabs by
script, so only its heading ("Theocritus 9.18–36, 10.1–22 with scholia") could be read. That is why finding 7 points to the
family page instead.
