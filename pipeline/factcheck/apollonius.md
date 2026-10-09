# Fact-check: Apollonius of Rhodes

Article: `web/src/wiki/authors/tlg0001.ts` (43 sources). Checked 2026-10-09.

Method. Every `cite` source was opened with `scripts/passage.ts` (Suda α 3419 and κ 227, Strabo 14.2.13, Athenaeus 7.19,
Aelian NA 15.23, the Aetia testimonium, Longinus 33.4, and all eleven Argonautica passages) and every Greek quotation and every
"our translation" was read against its Greek. The `url` sources were fetched: Wikipedia (Apollonius of Rhodes, Argonautica, Varro
Atacinus, Valerius Flaccus, Aeneid, Hermann Fränkel, List of editiones principes) as wikitext; the four Dickinson College
Commentaries pages; attalus.org (the two Lives and P.Oxy. 1241); the Internet Archive OCR text of Mooney (1912: introduction,
commentary on 1.8 and 1.18, Appendix I) and of Seaton's Loeb (1919 reprint: bibliography, notes on 1.8, 1.18, 4.543); LacusCurtius
(Quintilian 10.1.54 in Butler's English; Macrobius, Sat. 5.17.4 in Latin); the Propylaeum page and PDF of Sistakou's review of
Race; the Open Library records (Vian tome 2, Hunter III and IV, Green); the Internet Archive record of Fränkel's OCT; Biblissima.
The Perseus TEI header of the Scroll's text was checked (`pipeline/.cache/corpus/perseus/data/tlg0001/tlg001/`: George W.
Mooney, London: Longmans, Green, 1912). The researcher's log `pipeline/drafts/checked/tlg0001.md` was read but not relied on.

Totals: **8 findings**. All the Greek quotations match the Scroll, and all but one "our translation" render their Greek faithfully.
The one real slip is in the paraphrase of the night scene in Book 3, which puts the sailors and travellers to sleep when the poem
has the sailors watching the stars and the travellers only longing for sleep. The rest are small: a line range in the "two editions"
paragraph, a count of thirteenth-century manuscripts, and some wording that goes slightly beyond its source.

---

### 1. The night scene in Book 3: the sailors are awake and the travellers only long for sleep
- **Claim:** "That night, while sailors, travellers, gatekeepers and even a mother whose children have died are wrapped in sleep, «ἀλλὰ μάλʼ οὐ Μήδειαν ἐπὶ γλυκερὸς λάβεν ὕπνος» …[^19]"
- **Problem:** The Greek doesn't say that everyone is asleep. The sailors are awake at sea, looking out from their ships at the Great Bear (Helice) and Orion. The traveller and the gatekeeper only "longed for sleep". Deep sleep wraps only the mother whose children have died. The point of the passage is that sleep comes to everyone except Medea.
- **Evidence:** `npx tsx scripts/passage.ts tlg0001.tlg001 3.744 3.760`: «οἱ δʼ ἐνὶ πόντῳ / ναῦται εἰς Ἑλίκην τε καὶ ἀστέρας Ὠρίωνος / ἔδρακον ἐκ νηῶν· ὕπνοιο δὲ καί τις ὁδίτης / ἤδη καὶ πυλαωρὸς ἐέλδετο· καί τινα παίδων / μητέρα τεθνεώτων ἀδινὸν περὶ κῶμʼ ἐκάλυπτεν» ("sailors at sea looked from their ships to Helice and the stars of Orion; and now the traveller and the gatekeeper longed for sleep; and deep slumber wrapped even a mother whose children had died").
- **Suggested fix:** "That night, while sailors at sea look out at the Bear and Orion, travellers and gatekeepers long for sleep, and deep sleep wraps even a mother whose children have died, «ἀλλὰ μάλʼ οὐ Μήδειαν ἐπὶ γλυκερὸς λάβεν ὕπνος», “but sweet sleep did not take hold of Medea” (our translation), …[^19]"
- **Confidence:** high

### 2. The earlier edition at 1.515 lacked lines 516–523, not just 516–518
- **Claim:** "our text then has them pour a drink-offering and go to sleep (516–518), before dawn comes and the helmsman Tiphys wakes them. In the earlier edition, the scholia say, lines 516–518 were missing: instead, at the third dawn a wind came from Zeus and Tiphys called the crew aboard, and the text went on at our line 524.[^5,22]"
- **Problem:** The scholion that Mooney prints says the four lines of the earlier edition came straight after 515, and that the transmitted text then went on with «σμερδαλέον δὲ λιμήν», which is line 524. So the dawn and Tiphys' waking of the crew (519–523) were also missing. The article itself says the text "went on at our line 524". The figure "516–518" comes from Mooney's own summary, but it doesn't fit the scholion he prints, or the article's next clause.
- **Evidence:** Mooney (1912), Appendix I, no. (2), Internet Archive OCR (`argonauticaedite00apoluoft_djvu.txt`): "Schol. on 515 κηληθμῷ: ἐν δὲ τῇ προεκδόσει μετὰ τοῦτο γέγραπται ἦμος δὲ τριτάτη φάνη ἠὼς … τῆμος ἂρ ἐκ Διόθεν πνοιὴ πέσεν, ὦρτο δὲ Τίφυς / κεκλόμενος βαίνειν ἐπὶ σέλμασι. τοὶ δ᾽ ἀΐοντες. ἑξῆς δὲ τῶν κειμένων ‘σμερδαλέον δὲ λιμήν.’" He goes on: "The last line of the passage in the προέκδοσις … cannot have been immediately followed by σμερδαλέον δὲ λιμήν".
- **Suggested fix:** "In the earlier edition, the scholia say, the poem went straight from line 515 to four other lines: at the third dawn a wind came from Zeus and Tiphys called the crew aboard; the text then went on at our line 524, so our lines 516–523 were not there.[^5,22]"
- **Confidence:** medium

### 3. Mooney names three thirteenth-century manuscripts, not two, and the article's "first four" depends on the third
- **Claim:** "Next come two thirteenth-century books, G at Wolfenbüttel and Laurentianus 32.16, which go back to a different ancestor; … In the nineteenth century Merkel counted twenty-six manuscripts, the last twenty-two of them, from the fifteenth and sixteenth centuries, far inferior to the first four.[^5]"
- **Problem:** Mooney (source 5) lists three manuscripts "three centuries later than L": Vaticanus 280, G and Laurentianus 32.16. With L, these three make Merkel's "first four". The article names only two, so a reader can't tell what the "first four" are. Seaton (source 31) mentions only G and L 32.16, but he doesn't say they are the only ones.
- **Evidence:** Mooney, Introduction V: "Three centuries later than L we have three other mss. of Apollonius: (1) Vaticanus 280, in the Palatine Library, collated by Flangini. (2) Guelferbytanus … G … (3) Laurentianus xxxii, 16 … There are thus twenty-six mss. in all, of which the last twenty-two, according to Merkel, are far inferior to the first four."
- **Suggested fix:** "Next come three thirteenth-century books: Vaticanus 280; G at Wolfenbüttel; and Laurentianus 32.16. G and Laurentianus 32.16 go back to a different ancestor from L; …[^5,31]" Keep the rest of the paragraph as it is.
- **Confidence:** medium

### 4. The Lives don't say that the citizenship is why he was called "the Rhodian"
- **Claim:** "{legend} The *Lives* tell a story. … ashamed, he left for Rhodes, polished the poem, recited it again to great acclaim, and was made a citizen, which is why he is called the Rhodian.[^6,5]"
- **Problem:** Both Lives mention the citizenship, but neither gives it as the reason for the name. The first Life says that, after his success, "in the title of the poem he calls himself a Rhodian". The second says he "made his home and taught rhetoric" on Rhodes, "therefore he is called a Rhodian". The link to citizenship is Mooney's own retelling (source 5), and the sentence presents it as what "the Lives" say.
- **Evidence:** http://www.attalus.org/poetry/lives.html, Life 1: "when he published it in its new form, he was held in the highest esteem, and therefore in the title of the poem he calls himself a Rhodian. He became a distinguished teacher at Rhodes, and was rewarded by the Rhodians with citizenship"; Life 2: "There he made his home and taught rhetoric; therefore he is called a Rhodian." Mooney p. 3: "enrolling him amongst the citizens, whence he is known as Apollonius ‘the Rhodian.’"
- **Suggested fix:** "… polished the poem, recited it again to great acclaim, and was honoured with citizenship; that, the *Lives* explain, or his living and teaching there, is why he is called the Rhodian.[^6]"
- **Confidence:** low (the substance of the legend is right; only the reason for the name is attributed loosely)

### 5. In 1.8 it is the poet, not Jason, who speaks to Phoebus
- **Claim:** "In line 8 of Book 1 Jason comes «τεὴν κατὰ βάξιν», “according to your word”, speaking to Phoebus Apollo of the oracle Pelias heard."
- **Problem:** As written, "speaking to Phoebus Apollo" attaches to Jason. But the "your" belongs to the poet's address to Phoebus in line 1, and Jason says nothing here. Mooney's note, which the paragraph follows, says just that.
- **Evidence:** `npx tsx scripts/passage.ts tlg0001.tlg001 1.1 1.8` (1.1 «ἀρχόμενος σέο, Φοῖβε …»; 1.8 «δηρὸν δʼ οὐ μετέπειτα τεὴν κατὰ βάξιν Ἰήσων»). Mooney, commentary on 1.8: "τεήν: refers to Φοῖβε (v. 1)."
- **Suggested fix:** "In line 8 of Book 1 the poet, still speaking to Phoebus Apollo, says that Jason came «τεὴν κατὰ βάξιν», “according to your word”, meaning the oracle Pelias had heard."
- **Confidence:** medium

### 6. The source says Catullus imitates Apollonius constantly in poem 64, not in general
- **Claim:** "Varro of Atax, who died about 35 BC, put the *Argonautica* into Latin; Catullus imitated it constantly, and Virgil made it one of his models for the *Aeneid*.[^25,4,26]"
- **Problem:** The Dickinson page (source 26) limits the claim to one poem. Without that limit, the article seems to say that Catullus imitated it all through his work.
- **Evidence:** https://dcc.dickinson.edu/apollonius-argonautica/intro/scholarly-perspectives: "Catullus must have read the Argonautica avidly. He imitates Apollonius constantly throughout his poem 64".
- **Suggested fix:** "… Catullus imitated it constantly in his poem 64, on the wedding of Peleus and Thetis, and Virgil …" (or simply "… Catullus imitated it constantly in his poem 64, …").
- **Confidence:** medium

### 7. Vian was co-translator only of the last volume
- **Claim:** "F. Vian, *Apollonios de Rhodes: Argonautiques*, translated by É. Delage and F. Vian, 3 vols (Collection Budé; Paris: Les Belles Lettres, 1974–81).[^2,36]"
- **Problem:** The article's own source 2 gives the translators volume by volume. Books I–II (1974) and Book III (1980) were translated by Émile Delage alone; only Book IV (1981) was translated by Delage and Vian. The timeline entry ("with Émile Delage's French translation") is correct.
- **Evidence:** https://en.wikipedia.org/wiki/Argonautica, Editions: "Chants I–II. Traduit par Émile Delage. 1974 … Chant III. Traduit par Émile Delage. 1980 … Chant IV. Traduit par Émile Delage et Francis Vian. 1981".
- **Suggested fix:** "F. Vian, *Apollonios de Rhodes: Argonautiques*, translated by É. Delage (the last volume by Delage and Vian), 3 vols (Collection Budé; Paris: Les Belles Lettres, 1974–81).[^2,36]"
- **Confidence:** medium

### 8. δίφραξ is a rare word for a chair, not "a rare kind of chair"
- **Claim:** "In another place (788–789) the earlier text sat Jason on a rare kind of chair, a δίφραξ, where ours has the Homeric «κλισμῷ».[^5,38]"
- **Problem:** Mooney says the *word* is very unusual and glosses it, after Hesychius, as a woman's chair or throne. He says nothing about the chair being a rare kind of object. (The earlier text also changed the setting: «προδόμου διὰ ποιητοῖο» for «καλῆς διὰ παστάδος».)
- **Evidence:** Mooney, Appendix I, no. (5): "In the second edition the poet replaced the very unusual δίφραξ (= θρόνος γυναικεῖος Hesych.) by the Homeric κλισμός".
- **Suggested fix:** "In another place (788–789) the earlier text sat Jason on a δίφραξ, a very rare word for a woman's chair, where ours has the Homeric «κλισμῷ».[^5,38]"
- **Confidence:** low

---

**Checked, no problems found in:**
- The *Suda* α 3419: «Ἀπολλώνιοϲ, Ἀλεξανδρεὺϲ, ἐπῶν ποιητὴϲ, διατρίψαϲ ἐν Ῥόδῳ» and its translation; son of Silleus, pupil of Callimachus; successor of Eratosthenes. κ 227: the *Ibis* quotation and its translation are exact.
- Strabo 14.2.13 ("though Alexandrians, were called Rhodians", Jones); Athenaeus 7.19 and Aelian NA 15.23 («Ἀπολλώνιος (δ’) ὁ Ῥόδιος ἢ Ναυκρατίτης»); Pompilus, the girl (Ocyrhoe), Apollo, the fish.
- The epigram (AP 11.275, in the Aetia testimonia) and "Callimachus the scum, the plaything, the wooden brain"; attributed to "Apollonius the grammarian", perhaps another Apollonius (Wikipedia).
- Argonautica 1.1–4, 3.1, 3.286–287, 3.751, 4.445, 4.466–467, 4.1773: every quotation matches the Scroll, and every "our translation" is faithful. 1.1309 matches Wikipedia's English and its "verbatim quotation of Callimachus (Aitia I fr. 12.6 Pf)". 4.538–548: the numbering really does jump from 543 to 546.
- The Lives (attalus.org, from Wendel): the failure, Rhodes, the revision, "Some say" he returned, headed the libraries and was buried next to Callimachus. P.Oxy. 1241: the wording quoted; "first" king, with the translator's note "A mistake for 'third'"; Eratosthenes his successor; the beginning lost, with Zenodotus before him; second century AD.
- Wikipedia (Apollonius of Rhodes): no source gives a birth date; Naucratis about 70 km south on the Nile; "pupil" as a figure of speech; accession of Ptolemy III in 247/246, whom Apollonius probably tutored; the Suda's order does not fit; the Eidographer; the exile stories probably invented to explain a second edition (Lefkowitz 59–61 in the refs); "of Rhodes" perhaps from a poem on Rhodes (Lefkowitz 58, 61); the feud "enormously sensationalised, if it happened at all"; both Lives stress the friendship; the *Ibis* deliberately obscure; the first monograph on Homer against Zenodotus; Archilochus and Hesiod "credited"; the foundation poems; "a kind of poetic dictionary of Homer"; once thought a mere imitator, now re-valued.
- Mooney: birth dates "ranging from 296 to 235 B.C."; "the most bitter in the ancient world of letters" (exact); the Lives "appended to the scholia in the Codex Laurentianus"; L tenth century, with Aeschylus and Sophocles; later corrections in L from the G family; Merkel's twenty-six manuscripts; Brunck relied on the Paris manuscripts and was the first "really critical edition"; scholia "as valuable as those … on any ancient author", preserving lines of Hesiod; the subscription naming Lucillus of Tarrha, Sophocles and Theon; editio princeps by Lascaris, Alopa, Florence 1496, "uncials with accents, the scholia in cursive minuscules on the margin"; Aldine 1521; six προέκδοσις passages in Book 1; Brunck and Cardinal Angelus Quirinus at 4.544–545; "no modern editor has followed Brunck"; 1.8 τεήν "suspected by almost all critics", kept after Samuelsson, Merkel's ἐτεήν; 1.18 ἐπικλείουσιν Brunck, ἔτι κλείουσιν codd.
- Seaton: "far the best authority for the text" (exact), the early eleventh century; G and L 32.16 of the thirteenth century; the second type of text and the *Etymologicum Magnum*, "as old as the fifth century"; editions 1496, 1521, 1780, Merkel–Keil 1854, Oxford 1900; "in accordance with that true report"; "First printed 1912", London: Heinemann.
- Dickinson College Commentaries: published perhaps in 238; the route home; Chares, "a friend", on the poem's sources; Theon (1st c. BC), Lucillus (mid-1st c. AD), Sophocles (2nd c. AD); about 49 papyri, 24/9/10/6 by book, mostly 1st–4th c. AD from Oxyrhynchus, some to the 7th/8th c.; Varro's translation; Virgil's debt; -οιο used more than in the *Iliad*; new forms; Longinus' ἄπτωτος.
- Wikipedia (Argonautica): the only entirely surviving Hellenistic epic; fewer than 6,000 lines; the plot by book; Erato "the Muse of love poetry"; Ptolemy II or a generation later; Murray's 238; Fränkel and ἀμηχανία; Bulloch's "the pathology of love"; Wendel 1935; editions and translations (Seaton LCL 1 1912; Race LCL 2008; Hunter III 1989, IV 2015; Green 1997, expanded later).
- Longinus 33.4: «ἄπτωτος» and «ἆρ’ οὖν Ὅμηρος ἂν μᾶλλον ἢ Ἀπολλώνιος ἐθέλοις γενέσθαι;» and its translation. Quintilian 10.1.54 (Butler): left out because Aristarchus and Aristophanes included no contemporary poets; "his work is by no means to be despised". Macrobius 5.17.4: «librum Aeneidos suae quartum totum paene formaverit», Medea's love transferred to Dido.
- Varro Atacinus 82 – c. 35 BC; Valerius Flaccus writing about AD 70, "a free imitation and in parts a translation"; the *Aeneid* 29–19 BC, unfinished in 19 BC; Fränkel's OCT 1961 (Wikipedia; Internet Archive record dated 1961); Race LCL 1, Harvard, 2008, with the fragments (Propylaeum metadata and Sistakou's review, which mentions "the translation of Apollonius’ extant fragments"); the Open Library records of Vian tome 2 (1980), Hunter III (1989), Hunter IV (2015) and Green (1997, 2008); Mooney's first name, George W. (Internet Archive metadata and the TEI header).
