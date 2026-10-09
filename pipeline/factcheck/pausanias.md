# Fact-check: Pausanias (`web/src/wiki/authors/tlg0525.ts`)

Checked 2026-10-09, by a checker who did not write the article.

Method. Every `cite` source (21 passages: 19 in Pausanias, plus Strabo 8.6.10 and Aelian VH 12.61) was opened with
`npx tsx scripts/passage.ts` and read against each sentence that points to it, Greek and English. Every "our translation" was
checked against its Greek. For the `url` sources:
- **Read in full:** Wikipedia's *Pausanias (geographer)*, *Description of Greece*, *Costoboci*, *Grave Circle A*, *Hermes and the
  Infant Dionysus*, *Claudius Aelianus* and *Dagger (mark)* (as wikitext); Jones's Loeb vol. 1 (1918) and Frazer's vol. 1 (1898)
  from the Internet Archive OCR (preface, introduction, translation, critical notes); Mazzaferro's review of the Valla edition
  (through the Blogger feed, because the page itself comes back empty); the Sánchez Hernández abstract (UCM); the BNP dictionary
  page; the Patras and ARCE library records; both *Classical Review* records.
- **Read in the site's own copy:** the LSJ entry περιήγησις (`pipeline/.cache/lsj/lsj17.xml`).
- **Edition dates:** checked against the Perseus TEI header (`pipeline/.cache/corpus/perseus/data/tlg0525/tlg001/tlg0525.tlg001.perseus-grc2.xml`:
  Spiro, Leipzig, Teubner, 1903, vols 1–3). Strabo's date was checked on Wikipedia's *Geographica*. Rocha-Pereira's revised edition
  was checked in library catalogues.

The researcher's log (`pipeline/drafts/checked/tlg0525.md`) was read but not relied on.

Totals: **9 findings** (2 high, 4 medium, 3 low). No quotation was found to be misquoted, and every "our translation" matches its
Greek. The real slips are these:
- The article says the people of Pergamum took Pessinus. In the Greek it is the Gauls, and Frazer (source 4) translates it that way.
- The passage it cites as "a few lines earlier" is six chapters earlier.
- "In the reign of Augustus" for Strabo is Frazer's 1898 view; modern work dates the *Geography* to AD 18–24.
- The Athens–Olympia–Delphi copying theory was Kalkmann's, not Wilamowitz's.
- Rocha-Pereira's revised edition came out in 1989–90, not in 1989 alone.
- The tour does not end in Phocis but in Ozolian Locris.

---

### 1. The Gauls, not the people of Pergamum, took Pessinus; and the passage is six chapters earlier, not "a few lines"
- **Claim:** "**A gap or not?** A few lines earlier, the people of Pergamum take Pessinus, «τὴν ὑπὸ τὸ ὄρος τὴν Ἄγδιστιν», “which lies under Mount Agdistis”.[^38]"
- **Problem:**
  - **Who took the town.** In the Greek of 1.4.5 the people of Pergamum drive the Gauls inland from the sea. Then «οὗτοι», "these", meaning the Gauls, hold the land beyond the Sangarius, «Ἄγκυραν πόλιν ἑλόντες». After the aside about Midas' anchor the sentence picks up again: «ταύτην τε δὴ τὴν Ἄγκυραν εἷλον καὶ Πεσσινοῦντα». The subject is still the Gauls; historically too, Ancyra and Pessinus became Galatian towns. Frazer (source 4, cited in the next sentence) translates it that way. Jones's Loeb English, shown in the Scroll, does say "the Pergameni took Ancyra and Pessinus". That clashes with his own previous sentence ("this people … capturing Ancyra"), and the article has followed his slip.
  - **Where the passage is.** The variant before it is at 1.10.4, and this one is at 1.4.5. That is six chapters earlier, several pages, not "a few lines".
- **Evidence:**
  - `npx tsx scripts/passage.ts tlg0525.tlg001 1.4.5` (Greek): «χρόνῳ δὲ ὕστερον οἱ Πέργαμον ἔχοντες … ἐς ταύτην Γαλάτας ἐλαύνουσιν ἀπὸ θαλάσσης. οὗτοι μὲν δὴ τὴν ἐκτὸς Σαγγαρίου χώραν ἔσχον Ἄγκυραν πόλιν ἑλόντες Φρυγῶν … ταύτην τε δὴ τὴν Ἄγκυραν εἷλον καὶ Πεσσινοῦντα τὴν ὑπὸ τὸ ὄρος τὴν Ἄγδιστιν».
  - Frazer, vol. 1 (Internet Archive), translation of 1.4.5: "the people of Pergamus … drove them away from the sea into the country now called Galatia. They captured Ancyra … This town of Ancyra, then, was captured by the Gauls, and likewise Pessinus under Mount Agdistis, where they say that Attis is buried."
- **Suggested fix:** "**A gap or not?** Earlier in the same book, Pausanias tells how the Gauls took Ancyra and Pessinus, «τὴν ὑπὸ τὸ ὄρος τὴν Ἄγδιστιν», “which lies under Mount Agdistis”.[^38,4]" Keep the rest of the paragraph as it is.
- **Confidence:** high

### 2. "In the reign of Augustus" is Frazer's old dating of Strabo; modern scholars place the *Geography* under Tiberius
- **Claim:** "In the reign of Augustus the geographer Strabo wrote that the Argives had razed the city «ὥστε νῦν μηδʼ ἴχνος …»"[^21,4]
- **Problem:** Frazer (1898) does say "Strabo wrote in the reign of Augustus". But Strabo did not date his work, and its date is disputed. The study usually followed today (Dueck) puts the writing of the *Geography* in AD 18–24, under Tiberius, and one passage dates itself to AD 19. The article states Frazer's dating as fact. The cited Scroll passage (source 21) gives no date.
- **Evidence:**
  - Frazer, vol. 1, introduction p. xcii: "Strabo wrote in the reign of Augustus; Pausanias wrote in the reign of Marcus Aurelius."
  - https://en.wikipedia.org/wiki/Geographica: "Strabo did not date his work and determining this has been a matter of scholarly study since the Renaissance" … "Dueck concludes that the Geography was written between AD 18–24."
- **Suggested fix:** "Writing a century and a half before him, the geographer Strabo said that the Argives had razed the city «ὥστε νῦν μηδʼ ἴχνος εὑρίσκεσθαι τῆς Μυκηναίων πόλεως», “so that today not even a trace of the city of the Mycenaeans is to be found”.[^21,4]" Or keep a reign and hedge it: "Under Augustus or Tiberius, the geographer Strabo wrote …"
- **Confidence:** medium

### 3. The theory that he copied Athens, Olympia and Delphi from Polemo was Kalkmann's, not Wilamowitz's
- **Claim:** "In 1877 Ulrich von Wilamowitz-Moellendorff revived the idea that he had copied his Athens, Olympia and Delphi from Polemo of Ilium, a writer of some three hundred years before, and in 1886 A. Kalkmann argued that he had seen little of Greece himself; Kalkmann later largely took this back.[^4]"
- **Problem:** Frazer, the only source cited, puts it differently.
  - **Kalkmann's theory.** The full theory is that Pausanias "slavishly copied from Polemo the best part of his descriptions of Athens, Olympia, and Delphi", described them as they had been in Polemo's time, and had seen very little of Greece. Frazer's footnote calls all of this "the theory of Mr. A. Kalkmann" (1886).
  - **Wilamowitz's part.** Wilamowitz (1877) only revived Preller's more general view "that Pausanias borrowed largely from Polemo".
  - **What Kalkmann took back.** He took back the claim that Pausanias had not seen things for himself.

  The article gives Kalkmann's specific claim (Athens, Olympia, Delphi) to Wilamowitz.
- **Evidence:** Frazer, vol. 1, introduction (Internet Archive), the paragraph headed "Theory that Pausanias copied from Polemo": "Yet in recent years it has been maintained that Pausanias slavishly copied from Polemo the best part of his descriptions of Athens, Olympia, and Delphi … for it is a part of the same theory that Pausanias had travelled and seen very little in Greece". The footnote reads: "This was the theory of Mr. A. Kalkmann (Pausanias der Perieget (Berlin, 1886) …), but he has since substantially retracted it by admitting that Pausanias saw all the chief objects of interest for himself (Archäologischer Anzeiger, 1895 …). The view that Pausanias borrowed largely from Polemo was suggested by L. Preller in his edition of Polemo … and revived by Professor U. von Wilamowitz-Moellendorff (Hermes, 12 (1877), p. 346)."
- **Suggested fix:** "In 1877 Ulrich von Wilamowitz-Moellendorff revived the idea that he had borrowed largely from Polemo of Ilium, a writer of some three hundred years before; in 1886 A. Kalkmann went further, arguing that he had copied his Athens, Olympia and Delphi from Polemo and had seen little of Greece himself. Kalkmann later largely took this back.[^4]"
- **Confidence:** high

### 4. Rocha-Pereira's revised edition came out in 1989 and 1990, not in 1989 alone
- **Claims:**
  - Transmission: "The modern Teubner edition is M. H. Rocha-Pereira's, in three volumes (1973, 1977, 1981), revised in 1989.[^30,31,32]"
  - Editions: "M. H. Rocha-Pereira, *Pausaniae Graeciae Descriptio*, 3 vols (Bibliotheca Teubneriana, Leipzig, 1973–81; revised 1989).[^30,31,32]"
- **Problem:** Source 32 reviews only volumes 1 and 3 of the second edition, both of 1989. Library catalogues date the revised volume 2 (books 5–8) to 1990, and CiNii dates the whole second edition 1989–1990.
- **Evidence:**
  - Source 32 (Cambridge Core record): "Maria Helena Rocha-Pereira: Pausaniae Graeciae Descriptio, Vol. 1 (lib. i–iv), Vol. 3 (lib. ix–x) (2. verbesserte Auflage) … Leipzig: Teubner, 1989".
  - CiNii (https://cir.nii.ac.jp/crid/1130000793855966976): "2., verb. Aufl.", 1989–1990, three volumes.
  - Estudio Teológico Agustiniano de Valladolid catalogue (https://biblioteca.agustinosvalladolid.es/bib/37566): vol. 2, Leipzig, Teubner, 1990, v + 338 pp.
- **Suggested fix:** "… in three volumes (1973, 1977, 1981), revised in 1989–90.[^30,31,32]" and "(Bibliotheca Teubneriana, Leipzig, 1973–81; revised 1989–90)".
- **Confidence:** medium

### 5. The tour does not end in Phocis: the last book also covers Ozolian Locris
- **Claim:** "The tour starts at Cape Sunium and Athens and goes on through Corinth and the Argolid, Laconia, Messenia, Elis with Olympia (two books), Achaea, Arcadia, Boeotia, and last Phocis.[^2,3,15]"
- **Problem:** Book 10 covers Phocis *and* Ozolian Locris, and the work ends in Locris (Amphissa, Naupactus, 10.38). Two of the sources the sentence cites say so: Wikipedia (source 2) lists "Phocis … and Ozolian Locris", and the Patras record (source 15) lists vol. 4 as "Phocis and Ozolian Locri".
- **Evidence:**
  - https://en.wikipedia.org/wiki/Description_of_Greece: "[[Phocis (ancient region)|Phocis]] (Φωκικά), and [[Ozolian Locris]] (Λοκρῶν Ὀζόλων)."
  - https://find.library.upatras.gr/Record/181560/TOC: vol. IV "Books 8.22-10 (Arcadia, Boeotia, Phocis and Ozolian Locri)".
- **Suggested fix:** "… Achaea, Arcadia, Boeotia, and last Phocis with western Locris.[^2,3,15]"
- **Confidence:** medium

### 6. Jones did not sort the manuscripts into three classes; he reports a division already made
- **Claim:** "Jones, in 1918, sorted the manuscripts into three classes and warned that the worst blemishes are gaps “where the manuscript tradition fails us entirely”, which only guesswork can fill.[^3]"
- **Problem:** Jones uses the passive voice: the manuscripts "have been divided into three classes". He is reporting other editors' grouping, not his own. Jones was a translator working from Spiro's text and did no study of the manuscripts. (The rest of the sentence is right. Strictly, Jones says no "great trust" can be placed in the conjectures, but "only guesswork can fill" is a fair summary.)
- **Evidence:** Jones, vol. 1 (Internet Archive), "The Manuscripts of Pausanias", p. xxvii: "There are many MSS. of Pausanias, but all are late. They have been divided into three classes, of which the best representatives are: …" and "The chief blemishes are gaps in the text, where the manuscript tradition fails us entirely. Conjectures may sometimes fill these gaps plausibly, but obviously no great trust can be reposed in them."
- **Suggested fix:** "Jones, in 1918, reported that the manuscripts had been divided into three classes, and warned that the worst blemishes are gaps “where the manuscript tradition fails us entirely”, which only guesswork can fill.[^3]"
- **Confidence:** medium

### 7. The Megalopolitans honour the North Wind "second to none", not "above all the gods"
- **Claim:** "Pausanias does say that the people of Megalopolis honour the North Wind above all the gods.[^28]"
- **Problem:** The Greek says they honour Boreas *less than none* of the gods, that is, as highly as any god. Jones's English says the same. "Above all the gods" makes it stronger than the text.
- **Evidence:** `npx tsx scripts/passage.ts tlg0525.tlg001 8.36.6`: «καὶ θεῶν οὐδενὸς Βορέαν ὕστερον ἄγουσιν ἐν τιμῇ»; English: "holding none of the gods in greater honor than the North Wind".
- **Suggested fix:** "Pausanias does say that the people of Megalopolis sacrifice to the North Wind every year and honour him second to none of the gods.[^28]"
- **Confidence:** low (a small overstatement, but the Greek is plain)

### 8. "He wrote one book" is more than the sources say
- **Claim:** "Pausanias was a Greek who lived in the second century AD, and he wrote one book, which survives whole: the *Description of Greece* …[^1,2]"
- **Problem:** The sources say this is his only *surviving* (or known) work, not that he wrote nothing else. Wikipedia (source 2): "the only surviving work by the ancient geographer Pausanias". Frazer even discusses other works under the name and decides they were probably not his. Nothing shows he wrote only one book.
- **Evidence:** https://en.wikipedia.org/wiki/Description_of_Greece, first sentence: "is the only surviving work by the ancient geographer Pausanias".
- **Suggested fix:** "Pausanias was a Greek who lived in the second century AD. The one work of his that we know survives whole: the *Description of Greece* …[^1,2]"
- **Confidence:** low

### 9. Sánchez Hernández calls Smyrna the centre "of the Second Sophistic", not "of the region in his time"
- **Claim:** "… a study of 2007 by Juan Pablo Sánchez Hernández links him rather with Smyrna, which it calls the main cultural and administrative centre of the region in his time.[^4,13]"
- **Problem:** The article reports what the study "calls" Smyrna, but changes the wording. The abstract says passages of Pausanias, compared with inscriptions and archaeology, "point to Smyrna" as the main cultural and administrative centre *of the Second Sophistic*. It does not say "of the region".
- **Evidence:** https://revistas.ucm.es/index.php/CFCG/article/view/CFCG0707110233A (English abstract): "However, other quotations from Pausanias' Periegesis in comparison to Epigraphy and Archaeology point to Smyrna" as "the main cultural and administrative center of the Second Sophistic".
- **Suggested fix:** "… links him rather with Smyrna, which it calls the main cultural and administrative centre of the Second Sophistic, the Greek literary revival of his age.[^4,13]"
- **Confidence:** low

---

## Verified and found correct

- **Every quotation from the Scroll matches exactly** (Greek and Jones's English): 5.1.2, 7.20.6, 8.9.7, 10.34.5, 5.13.7, 1.39.3, 3.11.1, 10.4.1, 8.8.3, 2.16.5 and 2.16.7, 5.17.3, 1.1.1, 1.2.5, 1.4.3, 1.10.4 (the dagger before οἷ is in the Scroll's text), and Strabo 8.6.10.
- **"Our translation" checks:**
  - 5.1.2 «εἴκοσιν ἔτη καὶ διακόσια τριῶν δέοντα» = "twenty years and two hundred, less three" (217).
  - 1.26.4 «πάντα ὁμοίως ἐπεξιόντα τὰ Ἑλληνικά» = "all things Greek alike".
  - Aelian VH 12.61 «Παυσανίας δέ φησιν ὅτι καὶ Μεγαλοπολῖται» = "Pausanias says that the Megalopolitans did so too". The passage is about Thurii making the North Wind a citizen.
  - All three are accurate.
- **Date and life:**
  - Corinth restored 44 BC, so book 5 dates to AD 174 (Jones and Frazer).
  - Regilla died 160 or 161, so book 1 was finished by then at the latest (Frazer).
  - Antinous died about 130; Pausanias was "born a good many years before 130" (Frazer).
  - The Costoboci invaded in 170 or 171 (Wikipedia).
  - The German and Sarmatian war appears at 8.43.6; Marcus' death in 180 is not mentioned (Jones).
  - "At least fourteen years and probably of many more" (Frazer).
  - Musti's two phases, 135–145/150 and 161–180, and Herodotus and Thucydides as models (Mazzaferro, quoting Musti vol. 1 p. XIV).
  - Lydia: "fair inference" (Jones), "good grounds" (Frazer), "probably" (Wikipedia). Magnesia: Frazer says "we cannot say". Habicht argues for Magnesia (Sánchez abstract).
- **The book:**
  - Habicht's two quotations (Wikipedia, quoting Habicht 1985).
  - The LSJ wording, read in the site's copy.
  - Jones on the method of the tour, his main interests ("sanctuaries, statues, tombs, and the legends connected therewith"), the lodging footnote, the style ("so violent as to throw doubt upon the sense") and "some nineteen" references to the ciceroni.
  - Frazer's "trumpet-blast of defiance to the critics", his "peculiar piece of good fortune … come down to us entire … an eye-witness", "one of the most curious and valuable records bequeathed to us by antiquity", and the Herodotean conjunctions (critical note on 1.2.1, citing Pfundtner).
  - Elis in two books (Patras record).
- **Archaeology:**
  - Schliemann and Stamatakis, 1876(–77), followed Homer and Pausanias, found five gold masks, recognised the five shafts as Pausanias' graves, and the burials are about three centuries before Agamemnon (Wikipedia, *Grave Circle A*).
  - The Hermes was found on 8 May 1877 in the temple of Hera; the attribution rests on Pausanias' passing mention (Wikipedia). Note: the "fierce controversy" sentence on that Wikipedia page carries a "citation needed" tag. Its next paragraph ("unlikely to have been one of Praxiteles' famous works … a passing mention") does support the {debated} label.
  - Kalkmann's later retraction (Frazer).
- **Transmission:**
  - Aelian about 175–235 (Wikipedia).
  - Frazer on Aelian, Herodian, Philostratus and Stephanus (all ten books by number).
  - Buondelmonti, Niccoli around 1418, San Marco after 1437, lost after 1500, eighteen manuscripts in the 1830s (Wikipedia, after Diller).
  - Fourteen whole or nearly, all by 1550; Parisinus gr. 1410 of 1491 long preferred; Marcianus gr. 413 and Laurentianus 56.11 older and now trusted more (Mazzaferro).
  - 1516 edition by the heirs of Aldus and Andrea Torresano, edited by Musurus; Amaseo at Rome 1547; Bonacciuoli at Mantua 1593 (Mazzaferro, Wikipedia); Taylor, London 1794 (Jones, Wikipedia).
  - Frazer used Schubart (Leipzig, 1853–1854), and made his journeys in 1890 and 1895 (Frazer's preface).
  - Jones translated Spiro (Jones's preface).
- **Variants (Frazer's critical notes):**
  - 1.1.1: Πτολεμαίου is a conjectural insertion, "probably right" (Kayser).
  - 1.2.5: Ἀπόλλων is in some manuscripts (MoVtLab); the others seem to have Ἀπόλλωνός, as did the editions before Schubart; with that reading Eubulides would have made and dedicated the whole group.
  - 1.4.3: Kiehl's Μαλιακοῦ, *Mnemosyne* 1 (1852).
  - 1.10.4: the words are "unintelligible" and Frazer omits them.
  - 1.4.5: Frazer's lemma «ὑπὸ τὸ ὄρος * * * τὴν Ἄγδιστιν» and "not absolutely necessary to suppose that there is a lacuna"; Spiro has no gap.
  - The obelus as a mark of questionable or corrupt words (Wikipedia, *Dagger (mark)*).
- **Editions:**
  - Spiro, Teubner, Leipzig 1903, 3 vols (TEI header).
  - Jones, Heinemann and Putnam, 1918; LCL 93, 188, 272, 297, 298; Ormerod for vol. 2; Wycherley for vol. 5 (title page, Perseus header, Patras record).
  - Rocha-Pereira 1973, 1977 (*CR* 1979) and 1981 (BNP).
  - Frazer, Macmillan 1898, six volumes (title page).
  - Levi, Penguin Classics, Harmondsworth, copyright 1971 (ARCE record); "often thought a loose translation" (Wikipedia).
  - The Valla edition: ten volumes, 1982–2017, directed by Musti and Torelli (Mazzaferro).
- **Timeline:** every entry agrees with its sources, apart from the points in findings 2 and 4, which touch the text rather than the timeline. 1876 is the year of Schliemann's own season; Stamatakis found the sixth grave in 1877.

**Could not verify:**
- Habicht's *Pausanias' Guide to Ancient Greece* and Diller (1957) were not opened (JSTOR). The article uses them only as Wikipedia reports them, and says so in its source labels.
- Part Two of Mazzaferro's review was not read; nothing in the article depends on it.

**Findings: 9** (high 2: nos. 1 and 3; medium 4: nos. 2, 4, 5 and 6; low 3: nos. 7–9, small overstatements of the sources).
