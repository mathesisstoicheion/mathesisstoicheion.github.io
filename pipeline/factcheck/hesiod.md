# Fact-check: Hesiod (`web/src/wiki/authors/tlg0020.ts`)

Checked 2026-10-06.

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts` (from `web/`) and read against each sentence that points to
it: Herodotus 2.53.1–3; Theogony 1–35, 115–120, 924–930 with 929a–t, 1019–1022; Works and Days 1–12, 35–41, 169–169d, 174–175,
285–292, 520–526, 633–662, 820–828; Pausanias 9.31.3–6 and 9.38.3–4; Plutarch, Dinner of the Seven Wise Men 10; the *Contest*
(tlg1252.tlg002); Thucydides 3.96.1; Frogs 1030–1036; Shield 1–57. Every `url` source was fetched: the Wikipedia pages (as raw
wikitext: Hesiod, Works and Days, Theogony, Catalogue of Women, Shield of Heracles, Contest of Homer and Hesiod, Praxiphanes,
Aristarchus of Samothrace, Pausanias, List of editiones principes in Greek); Evelyn-White's introduction, bibliography and notes
(Project Gutenberg 348); the three BMCR reviews (Janko 2007.03.31, Fox 2007.10.44, Stama 2019.10.06); the Living Poets scholion
(Wayback copy); the Schøyen MS 5068 page; the two Cambridge Core opening pages of West's *CQ* articles (1964, 1974); the JHS 1968 and
CR 1979 review records; CiNii; Treccani (Bonaccorso da Pisa); LacusCurtius (Quintilian 10.1.52); the site's LSJ copy
(`pipeline/.cache/packs-publish/lsj/`, entries νήπιος, ἀνόστεος). Edition details were also compared with the Perseus TEI headers and
with ISTC-based library records for the two incunabula. The researcher's log `pipeline/drafts/checked/tlg0020.md` was read but not
relied on.

Totals: **6 findings**, all small. No misquotations, no wrong line numbers, no footnote pointing at the wrong passage, and no invented
facts were found. The findings are one claim stated as fact that the article's own source disputes, one dropped qualification, one
date that modern catalogues give differently, one detail about Pandora that the cited source words loosely, and two details that the
footnoted passage does not itself contain.

---

### 1. "Then corrects the *Theogony*" is stated as fact, but the article's own source 7 disputes it
- **Claim:** "The *Works and Days* opens with a short hymn to Zeus and then corrects the *Theogony*: “So, after all, there was not one kind of Strife alone, but all over the earth there are two”, one who stirs up war and one who drives people to work.[^11,12]"
- **Problem:** Wikipedia (*Works and Days*, source 12) does say that Hesiod "begins the poem proper by directly engaging with the content of the *Theogony*". But Janko's review (source 7, cited elsewhere in the article) argues against exactly this reading of line 11: Hesiod "can be taken as correcting the tradition rather than as referring to a fixed text of the *Theogony*". Scholars disagree, so the article should not state it flatly.
- **Evidence:** https://bmcr.brynmawr.edu/2007/2007.03.31/: "when Hesiod says ‘there was not, after all, only one strife’ (WD 11), he can be taken as correcting the tradition rather than as referring to a fixed text of the Theogony." https://en.wikipedia.org/wiki/Works_and_Days: "Hesiod begins the poem proper by directly engaging with the content of the *Theogony*. There was after all not one Eris … as in that poem, but two".
- **Suggested fix:** "The *Works and Days* opens with a short hymn to Zeus and then seems to correct the *Theogony*, or at least the older story it told: “So, after all, there was not one kind of Strife alone, but all over the earth there are two”, one who stirs up war and one who drives people to work.[^11,12,7]"
- **Confidence:** medium

### 2. The *Theogony* tells the story of the first woman but never names her Pandora
- **Claim:** "It is also the earliest known source for the myths of Pandora and Prometheus.[^1]"
- **Problem:** Wikipedia (source 1) does say this. But the name Pandora occurs only in the *Works and Days* (line 81). The *Theogony* (570–612) tells how the first woman was made, without a name. Prometheus is named in the *Theogony* (510, 521, 546). As written, a reader will take it that the *Theogony* names Pandora.
- **Evidence:** In the site's Perseus Greek texts (`pipeline/.cache/corpus/perseus/data/tlg0020/`), «Πανδώρ-» occurs 0 times in tlg001 (*Theogony*) and once in tlg002 (*Works and Days* 81: «Πανδώρην, ὅτι πάντες Ὀλύμπια δώματʼ ἔχοντες»). Wikipedia, *Works and Days* (source 12) is also careful here: "In the *Theogony*, Pandora and the 'tribe of women' had been sent as a plague upon man".
- **Suggested fix:** "It is also the earliest known source for the myth of Prometheus and for the making of the first woman, whom the *Works and Days* calls Pandora.[^1,12]"
- **Confidence:** medium

### 3. "Five books" for the *Catalogue* rests on the *Suda*; the cited page says so
- **Claim:** "The greatest, the *Catalogue of Women*, ran to five books of family trees of the heroines who lay with gods and the heroes born to them.[^15]"
- **Problem:** The cited page says "According to the *Suda*, the *Catalogue* was five books long". Evelyn-White (source 8) gives "four (Suidas says five) books". Modern editors follow the five (Fox, source 41, writes "divided into five books"). Still, the number comes from one Byzantine reference work, and the article drops that.
- **Evidence:** https://en.wikipedia.org/wiki/Catalogue_of_Women: "According to the *Suda*, the *Catalogue* was five books long. The length of each is unknown". Gutenberg 348, introduction: "This work was divided into four (Suidas says five) books".
- **Suggested fix:** "The greatest, the *Catalogue of Women*, ran, according to the Byzantine lexicon the *Suda*, to five books of family trees of the heroines who lay with gods and the heroes born to them.[^15]"
- **Confidence:** low (modern editors accept the five books; the point is the dropped attribution)

### 4. The Aldine Hesiod is dated February 1495 in the Venetian calendar, that is February 1496
- **Claim:** "Aldus Manutius printed all three poems at Venice in 1495.[^18,8]" Timeline: `{ year: 1495, kind: "print", what: "Aldus Manutius prints all three poems at Venice", src: [18, 8] }`
- **Problem:** Both cited sources (Evelyn-White 1914 and Wikipedia's *Shield* page) say 1495, so the footnotes support the wording. But the book is the Aldine Theocritus volume, whose colophon reads February 1495 in the Venetian year, which began on 1 March. By our calendar that is February 1496. Incunable catalogues (ISTC it00144000) date it "Feb. 1495/96". The article's own source 35 also gives "1495–1496". The timeline entry is not even marked approximate.
- **Evidence:** University of Glasgow incunabula record (https://www.gla.ac.uk/myglasgow/incunabula/a-zofauthorsa-j/t6/): "Venice: Aldus Manutius, Romanus, Feb. 1495/96", with Hesiod's Theogony, Shield and Works and Days in the volume. https://en.wikipedia.org/wiki/List_of_editiones_principes_in_Greek: the Aldine row containing "Hesiodus" and "Scutum Herculis" is dated "1495–1496". A search summary of the ISTC record says the colophon "is dated February 1495, according to the Old Style of dating … by today's calendar that equates to February 1496".
- **Suggested fix:** Prose: "Aldus Manutius printed all three poems at Venice in a book dated February 1495, by the Venetian calendar (1496 by ours).[^18,8,35]" Timeline: `{ year: 1496, approx: true, kind: "print", what: "Aldus Manutius prints all three poems at Venice (dated February 1495 in the Venetian calendar)", src: [18, 8, 35] }`
- **Confidence:** medium (whether to give 1495 or 1496 is a convention, but the article should not imply the matter is simple)

### 5. "Funeral games" and "a nobleman of Chalcis" are not in the passage the footnote points to
- **Claim:** "He crossed the sea only once, from Aulis to Euboea, for the funeral games of a nobleman of Chalcis, Amphidamas: “And there I boast …”.[^4]"
- **Problem:** *Works and Days* 650–659 (source 4) speaks only of "the games of wise Amphidamas where the sons of the great-hearted hero proclaimed and appointed prizes". It says neither "funeral" nor "nobleman". Both are fair inferences and appear in other sources the article already lists: Wikipedia, *Hesiod* (source 1) says "funeral celebrations for one Amphidamas of Chalcis", and Wikipedia, *Contest* (source 23) says "funeral games for Amphidamas, a noble of Chalcis". The footnote simply does not cover them.
- **Evidence:** `npx tsx scripts/passage.ts tlg0020.tlg002 633 662`: "Then I crossed over to Chalcis, to the games of wise Amphidamas where the sons of the great-hearted hero proclaimed and appointed prizes." https://en.wikipedia.org/wiki/Hesiod: "to participate in funeral celebrations for one Amphidamas of Chalcis". https://en.wikipedia.org/wiki/Contest_of_Homer_and_Hesiod: "the funeral games for Amphidamas, a noble of Chalcis".
- **Suggested fix:** Keep the wording and change the footnote to "[^4,1,23]".
- **Confidence:** low (footnote coverage only)

### 6. Pausanias does not say he was shown the tripod
- **Claim:** "Centuries later the traveller Pausanias was shown, on Helicon, a tripod said to be the one Hesiod won.[^5]"
- **Problem:** Pausanias says that tripods stand on Helicon and that the oldest is said to be the one Hesiod won. He uses "showed me" for the lead tablet (9.31.4), not for the tripod (9.31.3). The tripod's story is right; "was shown" adds a detail the source does not give.
- **Evidence:** `npx tsx scripts/passage.ts tlg0525.tlg001 9.31.3 9.31.6`: 9.31.3 "On Helicon tripods have been dedicated, of which the oldest is the one which it is said Hesiod received for winning the prize for song at Chalcis on the Euripus" («ἐν δὲ τῷ Ἑλικῶνι καὶ ἄλλοι τρίποδες κεῖνται καὶ ἀρχαιότατος, ὃν … λέγουσιν Ἡσίοδον νικήσαντα ᾠδῇ»). Compare 9.31.4: "They showed me also a tablet of lead" («καί μοι μόλυβδον ἐδείκνυσαν»).
- **Suggested fix:** "Centuries later the traveller Pausanias saw on Helicon, among other tripods, the oldest of them, which was said to be the one Hesiod won.[^5]" (or "noted that on Helicon stood a tripod said to be …")
- **Confidence:** low

---

**Checked, no problems found in:**
- Dates and persona: "generally thought to have been at work between 750 and 650 BC, around the same time as Homer"; the "first written poet in the Western tradition …" quotation (Wikipedia, *Hesiod*, word for word); "Most scholars today put Homer first"; the Lelantine-War identification and modern estimates (730–705 BC) fitting Hesiod's dates; Greeks of the late fifth and early fourth centuries ranking Orpheus, Musaeus, Hesiod, Homer; Hesiod as a source for myth, farming, economic thought, astronomy and cosmology.
- Herodotus 2.53.2: the Godley quotation is exact.
- Theogony 22–32: the Greek «Ἡσίοδον καλὴν ἐδίδαξαν ἀοιδήν» and «ἴδμεν ψεύδεα πολλὰ λέγειν ἐτύμοισιν ὁμοῖα»; the English quotations; the laurel staff; "a divine voice". Staff, not lyre, and the inference that he was no trained singer (Wikipedia: "ancient and modern scholars … infer").
- Works and Days 633–662: "left Aeolian Cyme", "from wretched poverty which Zeus lays upon men", the Ascra line in Greek and English, Aulis to Euboea, the tripod quotation. WD 35–41: the inheritance quotation and «νήπιοι, οὐδὲ ἴσασιν ὅσῳ πλέον ἥμισυ παντὸς» with its translation. WD 286 «μέγα νήπιε Πέρση» and 289–290 «τῆς δʼ ἀρετῆς ἱδρῶτα …» with "the sweat of our brows". WD 524 «ὅτʼ ἀνόστεος ὃν πόδα τένδει» and "the Boneless One gnaws his foot". WD 174 "would that I were not among the men of the fifth generation". WD 11 (the two Strifes). WD 828 «ὄρνιθας κρίνων καὶ ὑπερβασίας ἀλεείνων» and "who discerns the omens of birds and avoids transgression".
- Theogony 116–117 «ἦ τοι μὲν πρώτιστα Χάος γένετʼ» with Evelyn-White's English. Theogony 1021–1022 = *Catalogue* fr. 1.1–2, "sing of the company of women".
- Theogony 929a–929t: there are 20 lines; "Hera was very angry and quarrelled with her mate" is Evelyn-White's English. His note 1630 does say "Restored by Peppmuller. The nineteen following lines from another recension … are quoted by Chrysippus (in Galen)". WD 169a–d are printed, and 169a reads "for the father of men and gods released him from his bonds". Evelyn-White names them as new lines from papyri.
- Nagy and Perses (Wikipedia); Most on Hesiod as a real person and the self-legitimation quotation (Janko, BMCR, exact); Evelyn-White's view that Th. 22–35 tell of a later poet's call by the Muses who "once" taught Hesiod (Gutenberg introduction, "Life of Hesiod"); West versus Janko versus Most on Homer's priority, and "probably undecidable" (exact).
- The *Theogony*'s subject; the WD contents (Wikipedia); "Nearly all scholars accept these two poems" (Stama: «dalla stragrande maggioranza degli studiosi»); Pausanias 9.31.5 on Melampus and the *Precepts of Chiron*; the *Catalogue*: some 1,300 lines, most scholars against Hesiod's authorship, West 580–520, Janko near the *Theogony*, West's dating of Th. 965–1020, more than fifty ancient copies, the late-antique book label, P.Oxy. 28 (1962) nearly doubling the papyri, Merkelbach–West 1967.
- The *Shield*: Heracles and Cycnus; «ἢ οἵη» and the English of line 1; "fifty-odd" lines (Wikipedia 56, Evelyn-White 53); Aristophanes of Byzantium; late seventh to sixth century; papyri of the 1st, 2nd and 4th centuries.
- Hesiod's Greek: Ionic with Aeolisms and no certainly Boeotian words; "hobnailed hexameters"; 278 un-Homeric words in WD; West's "surly, conservative countryman" quotation (exact).
- LSJ (site copy): νήπιος "infant, child … II metaph., 1 of the understanding, childish, silly"; ἀνόστεος "boneless, of the polypus, Hes. Op. 524". Evelyn-White's "quaint allusive phrases" (exact). Quintilian 10.1.52 in Butler's translation, both quotations exact.
- The *Contest*: second century AD, mentions Hadrian, older papyri (Wikipedia); the Greek verdict «εἰπὼν δίκαιον εἶναι τὸν ἐπὶ γεωργίαν καὶ εἰρήνην προκαλούμενον νικᾶν» matches the site's text, and the "our translation" rendering is accurate (the clause «οὐ τὸν πολέμους καὶ σφαγὰς διεξιόντα» follows it). The Greeks calling for Homer and King Panedes crowning Hesiod are as stated. Plutarch's version: the riddle at the funeral of Amphidamas, who "had fallen in one of the battles for the possession of the Lelantine plain".
- Thucydides 3.96.1 (exact). Pausanias 9.31.6: the sister and "some say the deed was Hesiod's …" (exact). Pausanias 9.38.3–4: plague, Delphi, the crow, "Ascra rich in corn was his native land" (exact).
- Frogs 1032–1034: Orpheus, Musaeus, Hesiod, then Homer; the "our translation" of «Ἡσίοδος δὲ γῆς ἐργασίας, καρπῶν ὥρας, ἀρότους» is accurate.
- Transmission: Pausanias 9.31.4 on the lead tablet and the Boeotians' views (exact). The Living Poets scholion: Aristarchus' obelos, Praxiphanes "the pupil of Theophrastus", the copy beginning "so there is not just one race of Strifes" (exact). Aristarchus as head of the Library and "the most influential of all scholars of Homer" (Wikipedia). Aristarchus' monograph *On the Date of Hesiod* (Janko: "C. M. Schroeder has now shown …"). Evelyn-White on the papyri confirming the medieval manuscripts (WD 169a–d; better readings at WD 278, Th. 91, 93). Schøyen MS 5068: WD 360–366 and 378–383, third century BC, "by far the earliest surviving MS".
- West, *CQ* 24 (1974) 161–185, opening page: "something over 260, as against seventy-odd for the Theogony and sixty-odd for the Shield", and over 100 later than about 1480. West, *CQ* 14 (1964) 165–189, opening page: "The earliest complete manuscripts of the Theogony date only from the end of the thirteenth century, while those upon which the recensio must chiefly be based are of the fourteenth and fifteenth." Vat. gr. 1825 about 1310 by watermarks (Wikipedia, *Theogony*). Paris gr. 2771, eleventh century (Evelyn-White's siglum C).
- Print: Milan, Bonus Accursius, with Theocritus (Treccani; ISTC it00143000 "c. 1480–1"; Wikipedia "c. 1482"), so "around 1480" is fine. Evelyn-White's "Demetrius Chalcondyles, Milan (?) 1493 (?)" (exact). Rzach 1902 and 1913 and Evelyn-White following Rzach's classification (exact). Most's text follows West's (Stama; Janko).
- Variants: the end of the *Theogony* (West, Most athetizing, Janko against); Th. 900 and WD 288 ("ancient misquotations rather than the paradosis"); "at least a dozen places" (Janko, exact). Proclus and Apollonius on the *Divination by Birds* (Evelyn-White introduction and fragment). Wilamowitz 1928 "omits the Days".
- Editions: Evelyn-White 1914 (Perseus TEI header: London, Heinemann; New York, Macmillan, 1914). "totally outdated" (Janko, exact). West *Theogony* 1966 (JHS 88, 1968, 144–150, Kirk and Robertson). West *Works and Days* 1978 (CR 29.2, 1979, 202–206, Davies). Solmsen OCT 1970, 1983 (CiNii: "editio altera"), 1990. Merkelbach–West 1967. Most, LCL 57 and 503, 2006–07, second edition 2018 (Stama).
- Timeline dates: Praxiphanes about 300 BC (pupil of Theophrastus about 322); Aristophanes of Byzantium about 200; Aristarchus about 150; the *Contest* about 130; Pausanias about 160; the remaining entries as above.
