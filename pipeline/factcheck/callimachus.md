# Fact-check: Callimachus (web/src/wiki/authors/tlg0533.ts)

Checked 2026-10-07 by an independent checker who did not write the article.

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts` and read against each sentence that points to it:
the *Suda* κ 227 (tlg9010.tlg001 3.Κ.227); Strabo 17.3.22; *Hecale* testimonia 0.2 and frr. 1.1 and 2.1 (Mair); *Hymn to
Artemis* 242–243; *Hymn to Apollo* 105–113; *Hymn to Zeus* 1–9 (Mair, perseus-grc3, and Wilamowitz, perseus-grc4, line 3);
Epigrams 2 and 28 (Wilamowitz) and 2 and 30 (Mair); Athenaeus 3.1 with Yonge; Titus 1:12; *Aetia* testimonia 0.1–0.3 and
Mair's fr. 1.1–1.2. Every `url` source was fetched: Wikipedia *Callimachus*, *Pinakes*, *Aetia (Callimachus)*, *Hecale
(poem)*, *Apollonius of Rhodes*, *Catullus*, *Rudolf Pfeiffer* and *List of editiones principes in Greek* (all as raw
wikitext); Stephens's four Dickinson College Commentaries pages ("Callimachus of Cyrene", "The Aetia", "The Organization of
the Aetia", "Prologue: Against the Telchines"); the LSJ entry λεπταλέος (the Perseus page would not render its text, so the
site's own copy, `web/public/data/lsj/λε.json`, was read instead); Mair's 1921 Loeb (Internet Archive OCR: the introduction,
"The MSS. of the Hymns", the bibliography, the notes to *Hymn to Zeus* 3 and 8, *Hymn to Apollo* 105–113 with notes, Epigrams
II and XXX with notes, the *Aetia* introduction and fr. 1–2, and the introduction to the Rainer fragments of the *Hecale*);
Cory's *Ionica* (1905, Internet Archive OCR: Benson's note and "Heraclitus"); the Latin Library texts of Catullus 65,
Propertius 4.1 and Ovid, *Amores* 1.15; Mondolfo's Treccani article on Lorenzo Alopa; the Internet Archive record of
*P.Oxy.* 17; the Open Library records of the *Supplementum Hellenisticum*, Trypanis's Loeb and Stephens's *Hymns*; and the
three *Classical Review* pages (Hunt on Harder; Williams and D'Alessio on Hollis). The TEI headers in `pipeline/.cache/corpus`
were read for the Wilamowitz and Mair files, and the Wilamowitz date (1897, his second edition) was confirmed in the Perseus
catalogue. The researcher's log (`pipeline/drafts/checked/tlg0533.md`) was read but not relied on.

Totals: **4 findings**, none of them serious. Every Greek quotation matches the Scroll letter for letter. Every English
quotation said to be Mair's matches the 1921 scan word for word ("I hate the cyclic poem", "I loathe all common things", the
Assyrian river, "the very crown of waters", "a big book is a big evil", "Cretans are ever liars", "router of the
Pelagonians", "for she kept an unbarred house"). Every "our translation" (the *Suda*, Strabo, the prologue's "thundering",
*Hymn to Apollo* 106, the Heraclitus epigram, the "Apollonius" epigram, Catullus 65.16) fairly renders its Greek or Latin.
No footnote points at the wrong passage. The main points:
- The summary calls the *Suda* "an ancient reference book". It is a Byzantine encyclopaedia of the tenth century, as the
  article itself says two paragraphs later.
- The article says the *Aetia* "begins with a dream". Both cited sources put the dream after the prologue against the
  Telchines, and so does the article's own next section ("At the head of the *Aetia* Callimachus answers his critics").

---

### 1. The *Suda* is not "an ancient reference book"
- **Claim:** "An ancient reference book credits him with «ὑπὲρ τὰ ὀκτακοϲία», “more than eight hundred” books (our translation), in a great many forms.[^1,2]"
- **Problem:** The *Suda* was compiled in tenth-century Byzantium, more than a thousand years after Callimachus. Calling it "ancient" contradicts both sources and the article itself, which later calls it "a Byzantine encyclopaedia of the tenth century".
- **Evidence:** Wikipedia, *Callimachus* (source 1): "An entry in the ''Suda'', a 10th-century Byzantine encyclopaedia, is the main source about the life of Callimachus." Article, "A Cyrenean at Alexandria": "the *Suda*, a Byzantine encyclopaedia of the tenth century".
- **Suggested fix:** "A Byzantine encyclopaedia, the *Suda*, credits him with «ὑπὲρ τὰ ὀκτακοϲία», “more than eight hundred” books (our translation), in a great many forms.[^1,2]"
- **Confidence:** high

### 2. The *Aetia* does not begin with the dream; the dream comes after the prologue
- **Claim:** "It begins with a dream in which the young poet is carried to Mount Helicon and questions the Muses, an echo of Hesiod.[^7,9]"
- **Problem:** Both cited sources put the dream *after* the prologue against the Telchines. The article itself says, in the next section, "At the head of the *Aetia* Callimachus answers his critics", so the two sentences contradict each other. (The rest of the sentence is right: Helicon, the questions put to the Muses and the echo of Hesiod are all in both sources.)
- **Evidence:** Wikipedia, *Aetia (Callimachus)* (source 7): "After the proem, Callimachus describes a dream in which, as a young man, he was transported by the Muses to Mount Helicon … In a variation on a famous scene from Hesiod's ''Theogony''". Stephens, "The Organization of the Aetia" (source 9, https://dcc.dickinson.edu/node/26469): "*Against the Telchines* is followed by a dream (sometimes referred to as the *Somnium*) in which Callimachus as a young man dreams of an encounter with the Muses on Helicon. This is a deliberate reminiscence of Hesiod's poetic initiation in the *Theogony*."
- **Suggested fix:** "After a prologue (see below) comes a dream in which the young poet is carried to Mount Helicon and questions the Muses, an echo of Hesiod.[^7,9]"
- **Confidence:** high

### 3. No source says Cory "made it famous"; and in 1858 he was still William Johnson
- **Claim:** "In 1858 William Johnson Cory made it famous in English: “They told me, Heraclitus, they told me you were dead”.[^22,4]"
- **Problem:** Both cited sources show only that the translation appeared in *Ionica* in 1858. Neither says that it made the epigram famous. The judgment may be widely held, but it is not in the sources. Also, Benson's note in source 22 says "WILLIAM JOHNSON published in 1858"; the poet took the name Cory only later. Mair (source 4) writes "Wm. Cory (Johnson)". The quotation itself is exact.
- **Evidence:** Mair 1921, note on Epigram II (source 4, Internet Archive OCR): "The epigram of Callimachus is translated in Ionica (1858, rep. 1891) by Wm. Cory (Johnson)." Cory, *Ionica* (1905), Benson's note (source 22): "WILLIAM JOHNSON published in 1858 a slender volume … entitled 'Ionica'". The note also says that pp. 1–104, which include "Heraclitus" (p. 7), "appeared in the 1858 volume". Neither page uses "famous" or any similar word.
- **Suggested fix:** "In 1858 William Johnson (later William Cory) put it into English in his *Ionica*: “They told me, Heraclitus, they told me you were dead”.[^22,4]"
- **Confidence:** medium (the fact is not wrong, but it is unsupported)

### 4. "Many scholars follow him" is not in source 9; it comes from source 8, which the paragraph does not cite
- **Claim:** "{debated} **When was the prologue written?** Pfeiffer held that Callimachus reissued the *Aetia* late in life, adding the prologue to an older poem, and many scholars follow him; Alan Cameron argued instead that the prologue was simply the first part of the next section, and Peter Knox that the lines once taken as the epilogue of the whole poem closed Books 1–2.[^9]"
- **Problem:** Source 9 names only "Pfeiffer, Parsons" for the reissue view. It does not say how widely the view is held. That the thesis is "now commonly accepted", and that the prologue was added to the four-book edition, is said in Stephens's preface, "The Aetia" (source 8). The paragraph does not cite source 8. Everything else in the sentence (Cameron, Knox) is accurately taken from source 9.
- **Evidence:** Source 9 (https://dcc.dickinson.edu/node/26469): "it is open to question whether this section was really an independent prologue that was appended to the whole when the third and fourth books were added (so Pfeiffer, Parsons) or whether it was simply the first part of the following section (Cameron 1995: 114-32)"; and "Peter Knox (1985 and 1993) suggested that fr. 112 Pf., which has been taken to be an epilogue to the whole of the Aetia, is more likely to have ended Books I-II". Source 8 (https://dcc.dickinson.edu/node/26468): "This has led to the thesis (essentially Pfeiffer's), now commonly accepted, that Callimachus reissued or reedited the Aetia late in his life and added the prologue, now known as Against the Telchines, to the four-book edition."
- **Suggested fix:** Change the footnote at the end of the sentence from `[^9]` to `[^8,9]`. Keep the wording.
- **Confidence:** high (a missing footnote only)

---

## Borderline points, not counted as findings
- **Hollis's *Hecale*:** the edition note says "Text, translation and commentary." The second edition (2009) is titled *with Introduction, Text, Translation, and Enlarged Commentary*. The first (1990), as its *Classical Review* title gives it, is "Edited with Introduction and Commentary", and does not mention a translation. The note fits the 2009 edition. If the 1990 edition had no translation, the note could say "Text and commentary (with a translation from the second edition)". This could not be confirmed from the review pages, which show only their first page.
- ***Pinakes* means "tablets" [^6]:** Wikipedia's *Pinakes* page glosses the word as 'tables', though it also says the work was named after the painted tablets on the bins. Source 1 gives "the plural of the Greek for 'tablet'". Adding [^1] would cover the exact wording.
- **"Athenaeus reports":** the passage (3.1 = 72a) survives in the Byzantine epitome of Book 3, which is why it begins Ὅτι. Citing it as Athenaeus is the normal practice, and Mair does the same ("Athen. ii. 72 a tells us").

## Verified and found correct
- **Life:** the *Suda* entry (Battus and Mesatma, γραμματικός, teaching at Eleusis, κωμύδριον of Alexandria, before he was introduced to Philadelphus, living on into Euergetes' reign, over 800 books, "in every metre"). Strabo's "poet who was also devoted to scholarship". *Battiades* and the claimed descent from Battus (Wikipedia; Mair, citing Strabo 17.837). Mair's dates of about 310 and about 235. Stephens's "around 305" and "sometime after 240". Cameron's "almost certainly outright fiction". Ferguson's 270 BC (the timeline). Still writing about 240.
- ***Pinakes*:** the title and its 120 books in the *Suda*. Shelf-lists, poetry and prose, alphabetical order, a short life and a list of works (Wikipedia after Casson). Works cited by their first words (Stephens). Casson's "first comprehensive" verdict. Lost.
- **The Library:** he was not its head; Apollonius followed Zenodotus (Stephens; Wikipedia, *Pinakes*). Mair's 1921 warning about the "ascertained fact".
- **Hymns:** the six addressees. The three "mimetic" hymns (Wikipedia, after Stephens). Hymns 5 and 6 in Doric, and 5 alone in elegiacs (Mair). The Byzantine collection, Aurispa in 1423, the three families, the fourteenth-century Athous Laurae, Laurentianus 32.45 torn out for the editio princeps, and Politian's Latin *Bath of Pallas* of 1489 (all Mair). Alopa and Lascaris, the capital letters Lascaris designed, the edition undated and put at 1494–96 (Treccani "1496, o circa"; Wikipedia list "1494–1496 … Undated").
- **Epigrams:** about sixty. The *Palatine Anthology* (tenth century, Heidelberg, 1606). Heraclitus of Halicarnassus as his friend (Mair, citing Strabo's ἑταῖρος). The numbering 28 (Wilamowitz) against 30 (Mair). μισέω/μισῶ and λέσχηι/λέσχῃ as printed.
- ***Aetia*:** four books of elegiacs. The Lindian invective against Heracles. Helicon, the Muses and Hesiod. The Berenice frame. The *Lock* for Ptolemy III's safe return from the Third Syrian War, "certainly no earlier than 245". The 37 papyri. The Lille papyrus "within a generation" with interlinear notes. PSI 1092 (first century BC, main source of the *Lock*). P.Oxy. 2079 (second century AD; in *P.Oxy.* 17, 1927). P.Oxy. 2258, which "must have held a collected edition". The Milan *Diegeseis* (first or second century AD, lemmata, order of Books 3–4). Still read about AD 500, Eustathius the last first-hand reader, lost in the thirteenth century, Politian's reconstruction, Oxyrhynchus. Pope's *Rape of the Lock* (1712). Lille published in 1976. fr. 1 = Pf. 1 = Massimilla 1 = Harder 1. SH 253 = 137m Harder. Aristaenetus 1.10 as Harder fr. 75b. Mair's fr. 1 a dinner-party scene, and his next piece from P.Ryl. 13 = Pfeiffer fr. 26 (Wikipedia, *Rudolf Pfeiffer*, caption).
- **Prologue:** the Telchines as mythical sorcerers and their uncertain reality. The "continuous song … in many thousands of lines". "Judge poetry by its art". βροντᾶν οὐκ ἐμόν, ἀλλὰ Διός. The writing-tablet, the fat victim and the slender Muse, the untrodden tracks "even if narrower" (Stephens's text and translation). LSJ λεπταλέος "fine, delicate", citing both *Aet.* fr. 1.24 (P.Oxy. 2079.24) and *Dian.* 243.
- ***Hymn to Apollo* 105–113:** the Greek, Mair's English, and the Melissae as Demeter's priestesses (Mair's note). The scholion on 106 and the *Hecale*. Cameron's "limited authority" (Wikipedia). Athenaeus/Yonge and Mair's "a big book is a big evil". Mair's "modern explanation" of an awkwardly large roll.
- ***Hymn to Zeus*:** Crete or Arcadia. Κρῆτες ἀεὶ ψεῦσται, the tomb, "thou didst not die". Πηλαγόνων in both editions. The manuscripts' Πηλογόνων, the scholion's τῶν γιγάντων … ἐκ πηλοῦ, and Salmasius from *E.M.* (all Mair's note). Titus 1:12 (WEB) and Mair's note on Epimenides.
- ***Hecale*:** about 1,000 lines (Stephens). The story and the shrine of Zeus (Wikipedia). Fr. 2 and Mair's "unbarred house". The Vienna (Rainer) tablet: Gomperz 1893, *Phoenissae* on the back, fourth century AD after Wessely (Mair).
- **Ibis and the quarrel:** the *Suda*'s wording. The *A.P.* 11.275 epigram under "Apollonius the grammarian", which may not be by the Rhodian. Mair's feud account. The modern consensus, the friendship in the *Lives*, the slight evidence (Wikipedia, *Apollonius of Rhodes*).
- **Romans:** Catullus 65.16 and poem 66 (Catullus about 84–54). Propertius 4.1.64. Ovid, *Am.* 1.15.13–14. Hunter's "principal model[s]". Gutzwiller's quotation, word for word.
- **Editions:** Wilamowitz 1897, Weidmann (TEI header and Perseus catalogue: his second edition). Mair 1921 (Heinemann, Putnam). Pfeiffer's *Callimachi fragmenta nuper reperta* (1923), *Fragmenta* (1949) and *Hymni et Epigrammata* (1953). Trypanis 1958 (Harvard; LCL 421, per the 1968 reprint record). *SH* 1983 (de Gruyter, Berlin and New York). Hollis 1990 and 2009. Harder 2012 (vol. 2 vi + 1,061 pp.). Stephens 2015.
