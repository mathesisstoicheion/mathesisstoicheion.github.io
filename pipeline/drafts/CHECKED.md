# Author articles: what was checked, and what was left out

Method (owner's decision, 2026-09-30): take the old site's draft (`old-site-author-articles.json`), check every claim against a
real source, rewrite in plain, lively English, keep only what holds, and record the sources in `web/src/wiki/authors/<id>.ts`.
Ancient passages are cited as links into the Scroll (the site's own copy of the texts); modern works by publisher, catalogue or
review page. The reader can follow each footnote number to its source at the bottom of the author's page.

## Herodotus (tlg0016), checked 2026-09-30

**Confirmed and kept**
- Opening words, Halicarnassus, "inquiry", the cause of the war: Hdt. 1.1.0 (the site's text).
- ἱστορίη / θωμαστά / κότε / ἀπίκετο are Ionic forms: LSJ entries (ἱστορία "Ion. -ιη", θαυμαστός "Ion. θωμ-", κότε "Ion. for πότε", ἀφικνέομαι "Ion. ἀπ-"), read in the site's copy of LSJ.
- Cicero, *De Legibus* 1.5: "apud Herodotum patrem historiae et apud Theopompum sunt innumerabiles fabulae".
- Born about 484: Gellius 15.23 (Pamphila: Herodotus 53 at the war's start). Livius.org gives c. 480–c. 429, so the dates are marked debated.
- Still writing after 430: Hdt. 7.137.3 and Thuc. 2.67 (end of the second summer; 2.47.1 closes the first year).
- Travel and method: Hdt. 2.29.1, 2.44.1, 2.99.1, 7.152.3.
- Plutarch, *On the Malice of Herodotus*: chapter 1 (the charge, Boeotians and Corinthians); chapter 26 (Diyllus: ten talents, decree of Anytus). Marked as tradition.
- Lucian, *Herodotus* 1 (Olympia; books named after the Muses). Marked as tradition.
- The Persian debate: Hdt. 3.80.1–2, 6.43.3. Solon and Croesus: Hdt. 1.29–33; Plutarch, *Solon* 27.1 (some prove by chronology that it is fictitious); Hollmann 2015, n. 68.
- The ending and the unkept promise: Hdt. 9.122.2–3, 7.213.3; Jona Lendering (Livius.org) for "probably unfinished".
- Manuscript families, sigla, papyri, apparatus examples (ἄποδος / ἄφοδος at 4.97.4; Hemmerdinger): Verhasselt's edition of a Book 4 papyrus (KU Leuven repository). A (Laur. plut. 70.3): tenth century, parchment, 374 leaves: Biblissima.
- Nine books by Alexandrian scholars in the third century BC: Livius.org.
- Valla's Latin translation, Venice 1474 (Jacobus Rubeus): Whitmore catalogue, and the History of Information page (seen through a search result only: the page itself would not open).
- Aldine Greek edition 1502: Wikipedia's list of editiones principes (and its "Editio princeps" page).
- Editions: Godley (Loeb 1920–25, named in the TEI header of the site's Greek and English); Wilson OCT 2015 (two volumes; replaces Hude; two neglected Roman-family manuscripts collated), from the OUP page as quoted in a search result and the Journal of Hellenic Studies review record; Rosén (Teubner, vol. 1, 1987, lxxxviii + 458 pp.; vol. 2, 1997), Classical Review record; Asheri, Lloyd, Corcella (OUP 2007), BMCR review.

**Left out because it could not be confirmed**
- "Plutarch says many readers made that change" (of Halicarnassus to of Thurii): not found in Plutarch's essays read; Aristotle's "of Thurii" is kept.
- Dates for manuscripts B, D and the others (draft: eleventh / eleventh or twelfth century): no reliable source found; only A's date is kept.
- Travels "in Egypt, the Levant, Scythia" beyond what his own text says; "public readings at Athens" (the Olympia tale and the ten talents are kept as tradition); "joins the colony of Thurii in 443"; the Suda's life (the Suda's page would not open).
- The *Acharnians* parody of 425 and "death shortly after 425".
- Thucydides as an early critic (he never names Herodotus; scholars' reading could not be sourced).
- Nothing on the "Roman family: R, S, V" beyond Verhasselt's list.

**Corrected from the draft**
- "Hellenistic scholars" → third-century BC scholars at Alexandria (Livius.org).
- "The latest datable events belong to c. 431–425" → a firm date of 430 (Hdt. 7.137 with Thuc. 2.67).
- "Several dozen papyri, mostly from Oxyrhynchus" → 44 published (Verhasselt); "mostly Oxyrhynchus" not confirmed.
- "Neither family is consistently better" → not stated by the source; left out.

**Weak points to revisit**
- Bibliographic details of the OUP Wilson and the Loeb volumes rest on search-result summaries and review records because the publishers' pages would not open in the fetch tool.
- Wikipedia's list is the only source for the year of the Aldine edition (a bibliographic fact widely given; replace with a library catalogue record when one can be opened).

## Homer (tlg0012), checked 2026-09-30

**Confirmed and kept:** Iliad 1.1, 2.134 (nine years) and Odyssey 2.175 (the twentieth year); the Hymn to Apollo line 172 and Thucydides 3.104.4–6 (he quotes the hymn as Homer's and says the poet "also mentions himself"); Herodotus 2.53.2 (Homer and Hesiod "not more than four hundred years earlier than I") and 2.117 (he refuses the Cypria); the ancient lives, the cities, the blindness, the dates of composition (late 8th or early 7th century; Janko to Nagy; West 660–650), the works attributed, Wolf 1795 and Parry from about 1928 (Wikipedia: Homer, Homeric Question); the chorizontes, Xenon and Hellanicus (Harper's Dictionary, Perseus); the dialect mix and the genitive in -οιο (Wikipedia, Homeric Greek) with LSJ for ἀγορή and ἄμμες; the Pisistratus story (Cicero, De Oratore 3.137; the Hipparchus 228b, a dialogue transmitted under Plato's name); Zenodotus (first director of the Library, 284 BC, first critical editor) and Aristarchus (director 153–145 BC, his signs, his severity), from Wikipedia; the papyri (third century BC to seventh century AD, most found in Egypt, settling about 150 BC: Casey Dué, CHS) and the "wild" papyri (Graeme Bird, CHS 2010; Stephanie West 1967); the Venetus A (tenth century, A scholia, Villoison 1788: Wikipedia); the first printed Homer (Florence 1488–89, Chalcondyles: Wikipedia's list); the digamma and ἄναξ / wa-na-ka (Wikipedia: Digamma, Wanax) with Iliad 1.7; West's Teubner Iliad (1998–2000) and Odyssey (2017), with West "more than doubling" the Odyssey papyri (BMCR); Monro–Allen OCT 1920; Kirk's commentary (6 vols, 1985–93); Heubeck and others (3 vols, 1988–92); Murray's Loeb (Odyssey 1919, Iliad 1924–25) and Butler, as named in the site's own file headers.

**Left out because nothing reliable was found:** "well over 1,500 papyri"; "nearly 200 manuscripts of the Iliad and about 80 of the Odyssey"; the dates and shelfmarks of Venetus B, the Townley Homer, Laurentianus 32.24 and Palatinus gr. 45; the Judgement of Paris at Iliad 24.29–30; the Doloneia scholion; Odyssey 23.296 and the peras; Van Thiel's editions; Eratosthenes' date for Troy (1184/3) and the Trojan War as history.

**Corrected from the draft:** "c. 280 BC" for Zenodotus → appointed 284 BC; "150 BC" for Aristarchus → head of the Library 153–145; Chalcondyles 1488 → 1488–89.

**Weak points:** the history of Alexandrian scholarship, Wolf and Parry rests on Wikipedia pages (their own footnotes could be followed up); West 1967 and Bird 2010 are cited through a publisher page and the CHS page, not read; the Loeb and OUP pages would not open, so those details rest on search results and the files' own headers.

## Thucydides (tlg0003), checked 2026-09-30

**Confirmed and kept:** his own statements: 1.1.1 (began at the outset), 1.22.1 (the speeches, "as it seemed to me"), 1.22.4 (a possession for all time), 1.23.6 (the truest explanation), 2.47.3–2.48.3 (the plague; "I had the disease myself"), 4.104.4 (Thasos, half a day from Amphipolis), 4.105.1 (the gold mines), 4.106.3–4 (Eion saved by a night), 4.116.3 (the eighth year ends), 5.26.1–5 (twenty years' exile; the war lasted twenty-seven years), 8.109 (the last sentence); Xenophon, Hellenica 1.1.1; LSJ σύν ("old Att. ξύν"); Wikipedia (birth c. 460, Olorus and Thrace, Valla 1448–52, Hobbes 1628/9, Aldus 1502, the narrative ending in 411, the eight books by later librarians, the manuscripts and the Oxyrhynchus papyri, Xenophon continuing); Hornblower vol. III review (BMCR) for the incompleteness debate; editions: Jones–Powell OCT (Perseus file: Jones 1910, reprinted 1942), Crawley (Dent 1914) and Hobbes (1843 reprint) as named in the file headers, Alberti 1972–2000, Hornblower 1991–2008.

**Left out:** the two manuscript families (ABEFM and CG) and the dates of B and C; chapter 3.84 "rejected by most editors"; Books 5 and 8 as unrevised; ancient divisions into nine and thirteen books; "c. 400 BC" for his death and his return to Athens in 404; "Thracian connections" beyond Olorus's name and the mines.

**Corrected from the draft:** "failed to save Amphipolis" → the text says he arrived the evening it fell and saved Eion, and that he was banished "after my command at Amphipolis" (it does not say he was exiled *for* it); Hobbes 1629 → sources give 1628 or 1629.

**Weak points:** many details rest on Wikipedia; the years of the Alberti volumes come from a bibliography page.

## Plato (tlg0059), checked 2026-09-30

**Confirmed and kept:** Diogenes Laertius 3.2 (Apollodorus: birth 428/7; Hermippus: death 348/7 at a wedding feast), 3.37 (Plato names himself only in two dialogues; the Laws and the Epinomis; the Republic revised), 3.56–57 (Thrasyllus and the tetralogies); Phaedo 59b (Plato was ill) and Apology 34a (present at the trial); Seventh Letter 324a and 326 (about forty at Syracuse; philosophers and power), with the letter's authenticity marked disputed; Republic 514a, 592b, 330d–331d; Euthyphro 11b; LSJ πάνυ; Wikipedia (family, the Thirty, the Academy in the 380s, Aristotle in 367, the works surviving, doubtful works, Thrasyllus, about 250 Byzantine manuscripts, Ficino 1484); Stephanus pagination (Geneva 1578); the Clarke Plato (Biblissima's copy of the Bodleian record: 895, tetralogies 1–6, 24 works, Arethas, 21 gold coins); Aldus 1513 with Musurus (Wikipedia's list); Burnet OCT 1900–07, Duke and others 1995 (OUP, BMCR), Slings 2003, Cooper 1997; Shorey's Loeb Republic and Burnet's text as named in the Perseus file headers.

**Left out:** dates and sigla of manuscripts other than the Clarke Plato; "papyri from the third century BCE"; "the order of the dialogues rests partly on counting features of style" (Wikipedia does not say so); the Hippias Major as doubtful; the Budé series; the claim that Book 1 of the Republic began as a separate early dialogue (only the ancient report of revisions is kept).

**Corrected from the draft:** the Academy "around 387" → "in the 380s" (Wikipedia gives roughly 383–385); Sicily in 388 → "about forty" by the Seventh Letter; "Critias, his mother's cousin, and Charmides, her brother" → "two relatives" (the exact relationships were not confirmed); Plato's death "348" → 348/7 (Wikipedia has c. 347).

**Weak points:** the Seventh Letter's authenticity is disputed, so what it says about Plato's life is marked as such; the Clarke Plato details come from the Biblissima copy of the Bodleian catalogue because the Bodleian page would not open.

## The automatic check

`CORPUS=1 npx vitest run src/wiki/author-articles.corpus.test.ts` opens every passage an article cites, finds every Greek quotation «…» in a cited text, and finds every English quotation “…” in a cited translation, unless the article lists it under `outsideQuotes` (our own translation, or words from a web source). In these four articles it confirmed every quotation from the library and listed the ones that come from elsewhere.

## Sophocles (tlg0011), checked 2026-09-30

**Confirmed and kept:** Wikipedia (Sophocles): born c. 497/6 at Colonus, died 406/5, more than 120 plays and seven complete, thirty competitions and twenty-four wins and never below second, the first victory in 468 over Aeschylus, Hellenotamias in 443/2, general in 441 under the Life of Sophocles, Lloyd-Jones calling the Antigone-and-generalship story "most improbable", the Salamis paean, Dexion and the image of Asclepius (420), Philoctetes (409), Oedipus at Colonus performed in 401 at his grandson's wish, the seven plays, Aristotle's Poetics using Oedipus Rex. Plutarch, Cimon 8 (the archon Apsephion, Cimon and the generals as judges, Aeschylus leaving for Sicily; in the site's text). The Tracking Satyrs: the Scroll's own text and introduction (about 400 lines of perhaps 800; Oxyrhynchus; 1907; Hunt's edition of 1912 in the file header) and Wikipedia, Ichneutae (second-century papyrus, published 1912). Antigone 333 (the ode; numbered 333 in the Scroll's text) and LSJ δεινός (both "fearful, terrible" and "wondrous, marvellous, strange"). Antigone 904–912 (in the Scroll) and Aristotle, Rhetoric 1417a, quoting the brother lines (Perseus). The manuscripts: Pearse's page (L as Laurentianus 32.9, Aeschylus' M; the Leiden twin palimpsest; the triad; about two hundred copies; Triclinius in Paris gr. 2711; Paris gr. 2712) with Biblissima for the tenth century. Editions: Lloyd-Jones and Wilson OCT 1990 and Sophoclea (OUP; a review in the Revue des études grecques), Storr (Loeb 1912) and Jebb (1891 Antigone) and Mahoney as named in the file headers, Lloyd-Jones's Loeb (volume of 1994).

**Left out:** "eighteen" victories (Wikipedia gives twenty-four); Antigone 904–920 as a suspected interpolation and Goethe's hope (only Aristotle's quotation is kept, without the suspicion); the manuscript dates of A (thirteenth century) and the Leiden palimpsest ("around 950"); the ancient-source disagreement on victories; Pearson's OCT of 1924; Lobeck's Ajax; the Budé; "Doric colouring" of the choral songs; the Antigone's date.

**Corrected from the draft:** "Colonus near Athens" → Colonus in Attica; "general alongside Pericles" → per the Life of Sophocles; "papyrus published by Grenfell and Hunt" → Hunt's 1912 edition in Oxyrhynchus Papyri 9 (Wikipedia and the file header agree on 1912; the papyrus was found in 1907); the ode's line number → 333 in this text.

**Weak points:** most of the life rests on one Wikipedia page; Pearse's manuscript page is a secondary reference page; the OUP and Loeb pages would not open (details come from search results and file headers).

## Aristotle (tlg0086), checked 2026-09-30

**Confirmed and kept:** Diogenes Laertius 5.1 (Aristotle) in the Scroll: born at Stagira, father Nicomachus physician and friend of Amyntas (5.1), Eumelus on the aconite and Diogenes' correction (5.6), Apollodorus' chronology and the twenty years with Plato (5.9), Hermias, Philip's court, the Lyceum for thirteen years, Chalcis and death about sixty-three, the year Demosthenes died (5.10). Wikipedia (Aristotle): Assos and Lesbos with Theophrastus, the name Peripatetic, about a third of his output surviving, lecture aids. Wikipedia (Corpus Aristotelicum): Andronicus' first complete edition, Bekker numbers and the Berlin Academy edition (1831–70), the lost dialogues, the spurious and disputed works. Plutarch, Sulla 26.1–2 (Apellicon's library; Tyrannio and Andronicus; Neleus' heirs). Metaphysics 7.4 (τὸ τί ἦν εἶναι) and LSJ ἐνέργεια. Wikipedia (Constitution of the Athenians): the papyri, 1879/80, 1890, Kenyon in January 1891, authorship. Wikipedia (Nicomachean Ethics): Kb (Laurentianus LXXXI.11, tenth century) and the shared books; the two treatments of pleasure (NE 7.11–14 and 10.1–5, in the Scroll). Wikipedia (Poetics): Paris 1741 (eleventh century), the Arabic version from Syriac and independent of it, Moerbeke 1278, the lost second part, the 1508 Aldine. Wikipedia (Editio princeps): Aldine Aristotle 1495–98. Editions: Bywater 1894 (PhilPapers), Kassel 1965 (Oxford Scholarly Editions), Rackham, Freese and Fyfe as named in the file headers, Gauthier–Jolif (WorldCat), Barnes (PhilPapers).

**Left out:** Cicero's "golden stream" (the source page would not open); Strabo's cellar story; dates for Andronicus; "over a thousand manuscripts"; Parisinus gr. 1854 (Lb) and Marcianus gr. 213 (Mb) and their dates; Grosseteste's translation of about 1246; the Arabic translations at Baghdad in the ninth and tenth centuries; the glosses for οὐσία and τέλος; Ross's Metaphysics (1924) and other Oxford texts; "Magna Moralia is disputed" (Wikipedia lists it as generally agreed spurious); "Plato's death around the time he left" as 347 (Wikipedia: 348/47).

**Corrected from the draft:** "enters the Academy in 367" kept as approximate (seventeen years after 384); "tutor to Alexander at 343" kept (Wikipedia: 343/42; Diogenes: Alexander "in his fifteenth year", Wikipedia: thirteen, so Alexander's age is not stated); the Constitution's papyrus "identified in 1890" → bought in Egypt in 1890, published January 1891.

**Weak points:** much of the history of the corpus rests on Wikipedia pages (Corpus Aristotelicum, Poetics, Nicomachean Ethics).

## Euripides (tlg0006), checked 2026-09-30

**Confirmed and kept:** Wikipedia (Euripides): the ninety-five / ninety-two plays and nineteen survivors with Rhesus disputed; more plays survive than Aeschylus' and Sophocles' together; first competition 455, first victory 441, five wins (four and one posthumous); Alcestis 438, Medea 431, Hippolytus 428, Trojan Women 415, Orestes 408; the Bacchae and Iphigenia at Aulis in 405; Aristophanes' three plays; Salamis day and Archelaus and the doubt over Macedon; the two streams (a select edition of ten plays about AD 200; nine alphabetical plays) joined by a Byzantine scholar; L and P; Hypsipyle. Aristotle, Rhetoric 3.2.5 (in the Scroll). Wikipedia's list of editiones principes: about 1494 (four plays) and the Aldine of 1503 without Electra. Diggle's OCT (OUP; a Classical Review article), Kovacs' Loeb (Loeb pages), Mastronarde (BMCR), Kannicht TrGF 5 (BMCR); Murray, Coleridge, Buckley and G. Murray as named in the file headers.

**Left out:** the siglum and date of each manuscript (M, V, B, and the dates of L and Triclinius), the "Byzantine triad", the Parian Marble's 485/4, the lists of plays by stream, the disputed passages (Medea 38–43, the Phoenician Women's ending, the ending of Iphigenia at Aulis), actors' interpolations, Vettori's 1545 Electra, Janus Lascaris by name, the claim that he was "the youngest of the three", and Medea and others as "among the most performed".

**Corrected from the draft:** "about ninety plays" → ninety-five (some ancient scholars) or ninety-two at most (Suda); "first printing Lascaris c. 1495, four plays" → about 1494, with Wikipedia's list not naming Lascaris alone (Alopa's edition); Euripides' first victory 441 kept.

**Weak points:** this is the shortest article, because much of the old draft's detail could not be confirmed with sources that open; nearly all the life and manuscript facts rest on one Wikipedia page.

## Aeschylus (tlg0085), checked 2026-09-30

**Confirmed and kept:** Wikipedia (Aeschylus): born about 525 at Eleusis (27 km from Athens); first competed 499, aged 26; Marathon with his brother Cynegeirus; first victory 484; an estimated 70 to 90 plays, seven surviving; thirteen victories according to the Life; Persians 472 with Pericles as choregos; Sicily in the 470s at Hieron's invitation; death at Gela 456/5; Valerius Maximus' eagle and tortoise; the Mysteries; only his plays allowed to be restaged. Pausanias 1.14.5 (the epitaph naming only Marathon; Artemisium and Salamis). Herodotus 6.114 (Cynegirus son of Euphorion) and 6.21.2 (Phrynichus fined). Plutarch, Cimon 8 (468). Wikipedia pages on The Persians (oldest surviving play; the only tragedy on a contemporary event; Phrynichus), Seven Against Thebes (467; the ending rewritten about fifty years later), The Suppliants (long thought earliest; the 1952 papyrus; probably 463), Oresteia (458; the only trilogy; Proteus), Prometheus Bound (doubted since the nineteenth century; Griffith 1977; West and Euphorion), The Frogs (Lenaia 405, first prize), Lycurgus of Athens (finances from 336), Library of Alexandria (Galen's story of Ptolemy III and the fifteen talents), Editio princeps (Aldine 1518, six plays, Agamemnon 311–1066 lost in the fusion; Robortello 1552). Aristotle, Poetics 4.16 (the second actor) and Nicomachean Ethics 3.1 (the Mysteries). [Plutarch], Lives of the Ten Orators, Lycurgus (the official copies; actors not to depart from them). Aristophanes, Frogs 924 (ox-sized words) and 1126–1174 (the opening of the Libation Bearers quoted and mocked). Agamemnon 688–690 (ἑλένας, ἕλανδρος, ἑλέπτολις; Smyth's "Hell to ships"). Libation Bearers 1–5 (printed as editor's additions in Smyth's text). Seven against Thebes 1011 (the herald). Roger Pearse's notes after Rosenmeyer, The Art of Aeschylus (1982): M written about 1000, in Florence 1423, all seven plays, the opening of the Libation Bearers lost, Libation Bearers and Suppliants only in M and its copies, Agamemnon and Eumenides in three more manuscripts (one Triclinius'), about 150 manuscripts mostly of the triad. BMCR 2025.07.38 (Tr and F the only basis for a large part of the Agamemnon). Biblissima (Laur. Plut. 32.9, tenth century, with Sophocles and Apollonius). Editions: Smyth, Sidgwick and Browning as named in the file headers; Page (OUP), West (Classical Review, 1992), Sommerstein (Harvard University Press), Radt and Fraenkel (Classical Review).

**Left out:** the "Doric colouring" of the choral songs; "among the most corrupt texts in Greek literature"; the exact lines M has lost from the Agamemnon (311–1066 and 1160 to the end); the sigla F, G, T as Laur. 31.8, Marc. gr. 616 and the Naples autograph; the Byzantine commentaries; West's second edition of 1998 and the Teubner title "cum incerti poetae Prometheo" (seen only in shop listings); Lycurgus' law as "c. 330" (the date of the law itself is not given; his years in office are); "Proteus is lost" (a single line survives).

**Corrected from the draft:** Helen's epithets: the draft's ἑλέναυς is not what either Greek text in the Scroll prints (both have ἑλένας), and the line is 688 there, not 689; "the epitaph remembers Marathon, not his plays" kept, with Pausanias's words; the Suppliants papyrus "showed it was produced in the 460s" → probably 463 (Wikipedia); Plutarch's 468 story kept as told there.

**Weak points:** the life rests mostly on Wikipedia pages; the manuscript history rests on Pearse's summary of Rosenmeyer and one BMCR review; the Galen story is known here only from Wikipedia's summary.

## Demosthenes (tlg0014), checked 2026-10-02

**Confirmed and kept:** Wikipedia (Demosthenes): born 384, died 322 at Kalaureia; among the greatest orators; father a wealthy sword-maker of Paeania; orphaned at seven; came of age 366; Against Aphobus 363–362, damages of ten talents, only part recovered; the training stories and the warning that it is unknown whether they are factual; On the Navy 354; First Philippic 351–350; Olynthiacs 349, Olynthus taken 348; the embassy to Pella with Aeschines and Philocrates; False Embassy 343, Aeschines acquitted by thirty votes; Aeschines his greatest rival; Elatea seized 338; the Theban alliance; Demosthenes at Chaeronea as a hoplite; Ctesiphon's proposal 336 and the trial 330; Harpalus 324, convicted and fined 50 talents, escape and return after Alexander's death; Grote (innocent) against Hansen (likely guilty); Cicero's Philippics inspired by him; Quintilian's lex orandi; Longinus' thunderbolt; publication in his lifetime; texts in Athens and Alexandria; 61 orations, 56 prologues, 6 letters; doubts of Blass (Fourth Philippic, Funeral Speech, Erotic Essay, Against Stephanus II, Against Evergus) and Vince (five political speeches, including On the Treaty with Alexander). Wikipedia (Works of Demosthenes): 258 Byzantine manuscripts and 21 of extracts; F (Marcianus 416), A (Monacensis 485), Y (Parisinus 2935), S (Parisinus 2934); the Aldine based on three manuscripts of F's family, hence the customary order; Callimachus collected the prologues; Schaefer's 29 genuine speeches; Hegesippus for On Halonnesus ("virtually everyone"); additions in the Third Philippic; Philip's Letter (MacDowell). Wikipedia (Third Philippic): 341. Wikipedia (On the Crown): 336 proposal, 330 trial. Wikipedia (Battle of Chaeronea): Peace of Philocrates 346, battle August 338. Wikipedia (Apollodorus of Acharnae): seven speeches for him, six generally given to a pseudo-Demosthenes, often Apollodorus himself. Wikipedia (Didymus Chalcenterus): Reynolds and Wilson's "scrupulous compiler", not an original researcher. Wikipedia (List of editiones principes in Greek): Demosthenes, Aldus, Venice 1504; letters in the Aldine collection of 1499 edited by Musurus. Against Aphobus I 4 (nearly fourteen talents; aged seven; sister five). [Plutarch], Lives of the Ten Orators 8.1 (Paeania; "Delivery" three times; sixty-five genuine speeches; Demetrius of Magnesia on the distich written by Demosthenes himself). Plutarch, Demosthenes 4–8 (guardians, first speeches jeered, underground study, half-shaved head, Pytheas and the lamp wicks), 6.1 (not even a small fraction recovered), 9.5 (the comic joke on take and retake, Halonnesus), 11.1–2 (pebbles, after Demetrius of Phalerum; running and climbing), 15.1–3 (speeches for Apollodorus and for Phormio, the cutlery-shop; the doubtful trial of Aeschines), 20.2–21.2 (flight at Chaeronea; Philip's chant; the eulogy), 24.1–2 (less than a fifth of the votes; Aeschines to Rhodes and Ionia), 25–27 (Harpalus' cup and twenty talents; Areopagus; fifty talents; escape; the owl, the serpent and the people; trireme; the altar of Zeus the Saviour), 28–30 (Demades' motion; Calauria; Archias; the pen; the statue and its verses; "utter nonsense"). Plutarch, Cicero 48.4 (Cicero named his speeches Philippics). First Philippic 10–11; Third Philippic 65; On the Crown 54–55, 118, 167, 169, 208; On Halonnesus 5; Aeschines, On the Embassy 34–35 (the breakdown before Philip). Longinus, On the Sublime 16.2 (the oath, "as if inspired by a god", our translation) and 12.4 (thunderbolt; Cicero as a spreading fire), Greek only. BnF Archives et manuscrits, Grec 2934: end of the ninth century, parchment, 534 leaves, probably Constantinople, monastery of Sosandra in the thirteenth century, Ridolfi, Catherine de' Medici, the royal library, Omont's facsimile 1892–93. McGay's Fordham abstract: S "universally accepted as having the greatest authority". BMCR 2006.09.28 (Weissenberger on Dilts II): sigla S A F Q Y and P; the controversy over S against A F Y and Dilts's case-by-case approach; hiatus removal since the nineteenth century, abandoned by Dilts, without basis in the copies; testimonia; Butcher and Rennie 1903–31; Budé 13 vols 1924–87; Dilts in 4 vols 2002–2009. Princeton papyri page: P. Oxy. XI 1377, first century BC, On the Crown 167–169, published 1915. BMCR 2007.04.16 (Herrman on Harding): Didymus in the second half of the first century BC; the papyrus known since 1904 with notes on speeches 9, 10, 11, 13; "the only extensive ancient commentary on a Greek prose author"; copied by a student in the late second or early third century AD; no affinity to one group of Byzantine manuscripts, like the other papyri; Harding's view of Didymus as an original researcher. BMCR 2001.09.19 (Worthington on Yunis): the documents in On the Crown spurious, found in the major manuscripts and some papyri, left out by Yunis; Worthington doubts any were included; MacDowell's Meidias (1990) and False Embassy (2000). BMCR 2009.12.13 (Harris, Speeches 20–22, Texas 2008). BMCR 2014.04.48 (Worthington 2013, "a flawed one"). Editions in the Scroll as named in the Perseus file headers: Butcher (1903, 1907), Rennie (1921, 1931); J. H. and C. A. Vince, A. T. Murray, N. W. and N. J. DeWitt (Harvard University Press, printings of 1926–49).

**Left out:** "later antiquity called him simply ὁ ῥήτωρ, as Homer was the poet" (no source found); "he avoids long runs of short syllables" (no source opened); "S often lacks words and phrases that the others include" (not found as stated; only the controversy over S against A F Y is kept); "many papyri from the Ptolemaic period" (the oldest confirmed here is P. Oxy. 1377, first century BC); Monacensis 485 "once at Augsburg"; dates for F, A and Y (Wikipedia gives tenth or tenth/eleventh century, a search snippet suggested the ninth for A: left out); "Loeb Classical Library" as the name of the Harvard volumes (the file headers do not say so); the statue's date in the archonship of Gorgias (no modern date found for it); a date for Cicero's Philippics; the Funeral Speech dismissed as "rather poor".

**Corrected from the draft:** the oath at On the Crown 208 does not begin οὐ μά: the Scroll's text (and Longinus) has «μὰ τοὺς Μαραθῶνι προκινδυνεύσαντας τῶν προγόνων»; S is dated by the BnF to the end of the ninth century, not the tenth (and Wikipedia's "tenth or eleventh" is not used); the draft's "Cicero named his speeches after his" → Plutarch says Cicero named them Philippics, Wikipedia that Demosthenes inspired them; "fined fifty talents and exiled (324/3)" kept as Harpalus in 324 and the return in 323; "Isaeus" as teacher left out of the article, since the ancient lives disagree (Isaeus, Isocrates, Plato); "Didymus' commentary on the Philippics" → notes on speeches 9, 10, 11 and 13; Plutarch's ancient attribution of On Halonnesus to Demosthenes noted beside the modern view.

**Weak points:** much of the life rests on the Wikipedia page Demosthenes and on Plutarch, who wrote four centuries later and is openly hostile on Demosthenes' courage and honesty; the Wikipedia pages disagree on the Third Philippic (342 on Demosthenes, 341 on Third Philippic; 341 kept); the claim that the papyrus P. Oxy. 1377 holds part of a document rests on comparing Princeton's "167–169" with section 167 of the Scroll's text, which is wholly Philip's letter (a Textkit forum post says the same, not used as a source); the Dilts review is in German and the Cambridge review of volume II and OUP's pages did not open; McGay's abstract was read, not the dissertation.

**Corrected in review (2026-10-02):** Quintilian's words are *longe princeps Demosthenes ac paene lex orandi fuit* (10.1.76, checked in the Latin at The Latin Library): "almost" the standard of oratory; Wikipedia's "extolled him as *lex orandi*" drops the *paene*.

**Fact check (2026-10-02, a second, independent check; report pipeline/factcheck/new-authors.md):** the findings were checked against the cited passages and pages and corrected in the article.

## Plutarch (tlg0007), checked 2026-10-02

**Confirmed and kept**
- Chaeronea, about 30 km east of Delphi, where he lived most of his life; Autobulus, Timon and Lamprias, Timoxena, at least four sons and a daughter (two died young); Florus, associate of Vespasian, c. AD 70, and the Roman name "possibly" Lucius Mestrius Plutarchus (marked debated); one of the two priests at Delphi c. AD 95; 23 pairs and four single Lives; the Lives of the emperors (only Galba and Otho left); lost Lives (Heracles, Philip II, Epaminondas, the Scipios); 227 titles in the Lamprias catalogue, 78 surviving works; Amyot 1559 (Lives) and 1572 (Moralia), North 1579, Holland 1603, Dryden 1683, Montaigne's 400 references, Emerson's "a bible for heroes"; "nominal" procurator: Wikipedia, Plutarch.
- Born 45–47 (worked out from *The E at Delphi* 385B, assuming he was not over twenty: marked debated), Ammonius while Nero was in Greece (66/67), Athenian citizen, Rome and Alexandria, several works on Delphi, procurator of Achaea under Hadrian in 119 (Eusebius' *Chronicle*), the Lamprias catalogue "supposedly compiled by Plutarch's son Lamprias", the name *Moralia* first given to eleven ethical works in a fourteenth-century manuscript: SEP, "Plutarch" (George Karamanolis).
- The small city and Latin learned late: *Demosthenes* 2.1–2.2; the fifth book: *Demosthenes* 3.1; the tenth: *Pericles* 2.4; the twelfth: *Dion* 2.7 (all in the Scroll).
- Ammonius and Nero, "Pythian discourses", the sons and the visitors by the temple: *The E at Delphi* 1 (the Scroll).
- The daughter born after four sons, named after her mother, lived two years: *Consolation to His Wife* 2 and 8 (Goodwin's 1874 English in the Scroll).
- "Serving the Pythian Apollo for many Pythiads": *Whether an Old Man Should Engage in Public Affairs* 17 (Scroll).
- Great Pan is dead (told by Philip, a speaker in the dialogue; Thamus, Paxi, Tiberius): *Obsolescence of Oracles* 17 (Scroll). Marked legend.
- The edges of the map, Sosius Senecio, Lycurgus–Numa written before Theseus–Romulus: *Theseus* 1.1–1.2; Senecio consul in 99 and 107, dedications: Wikipedia, Quintus Sosius Senecio.
- "Not Histories but Lives": *Alexander* 1.1–1.3; the mirror: *Timoleon* preface (0.1–0.2 in the Scroll).
- Written probably at the beginning of the second century; Epaminondas paired with a Scipio, both lost; Latin Lives at Rome about 1470: Wikipedia, Parallel Lives.
- 78 essays and speeches; Aldine Moralia March 1509 with Erasmus and Aleandro as proofreaders; fourteen books since the Stephanus edition of 1572; Lives of the Ten Orators, On the Opinions of the Philosophers, On Fate, On Music as Pseudo-Plutarch: Wikipedia, Moralia. Consolation to Apollonius, Whether Fire or Water is More Useful, Parallel Stories: Wikipedia, Pseudo-Plutarch. Editors: Demetrius Ducas (1509), Junta (Florence 1517): Wikipedia, List of editiones principes in Greek.
- Speeches on meat-eating from his youth, "a foible of Plutarch's early manhood", the excerptor's "stupid interpolations", Shelley in 1813 and his lost translation, "one of the eighteen works ... that do not appear in the Lamprias Catalogue", the Symposiacs missing too: Cherniss and Helmbold's introduction to *On the Eating of Flesh* (Loeb XII, in the Scroll).
- *On the Malice of Herodotus* 1 ("defend our ancestors and the truth").
- Manuscripts of the Lives (Sg, tenth century, fifteen Lives; S, eleventh century, sixteen, best since 1870; Paris 1671 A, 1672 C, 1674 D), editio princeps 1517 from inferior Florentine manuscripts, Aldine 1519 from better Venetian ones, "the order of the Lives in our collection is not the original one", Amyot, North and Shakespeare's three Roman plays: Perrin's introduction to the Loeb Lives (1914), on LacusCurtius.
- Cleopatra's barge: *Antony* 26.1–26.3 (Scroll); North's wording and the barge speech closely following it: Mark Womack's page.
- First papyrus of the *Life of Alexander*, "some text-critical interest": BMCR 2017.06.39 (P.Oxy. LXXXII, 2016).
- Parisinus gr. 1671 finished 11 July 1296 by one professional scribe, revised by Planudes, the Lives in three volumes plus the Moralia; Parisinus gr. 1672 at least half a century after Planudes' death: Philippe Hoffmann, Scriptorium 37 (1983), on Persée.
- Parisinus gr. 1672 the only manuscript with all 78 Moralia, made at Planudes' instigation, soon after 1302; Planudes' list of 69 titles in his Anthology manuscript in 1302: G. R. Manton, CQ 43 (1949).
- Ziegler's study of 1907, Lindskog and Ziegler's Teubner from 1914, Gärtner's fifth edition of vol. I.1 (2000), two lines of transmission only for the first volume: BMCR 2001.05.08 (Yitzhak Dana).
- *On the Face in the Moon* mutilated at the beginning, "despite statements to the contrary": Cherniss's Loeb introduction (Scroll). *The Education of Children* generally believed not his: Babbitt's Loeb introduction (Scroll).
- Editions: Perrin (11 vols, 1914–26), Bernardakis (Teubner, vols I–VI dated 1888–95), the Loeb Moralia translators (Babbitt, Helmbold, Fowler, Cherniss) and Goodwin (Boston 1874, 5 vols), all as named in the Scroll's file headers; the Loeb Moralia "in sixteen volumes" and Sandbach's vol. XV, Fragments (1969): WorldCat; Budé Vies tome XII (Flacelière and Chambry, 1976): a review in REA 85 (1983) on Persée; Waterfield and Stadter, Greek Lives (OWC 1998): the translator's own page.

**Left out**
- His Greek style (learned Koine, long sentences, avoidance of hiatus): no source checked.
- Death "at Chaeronea": no source gives the place.
- A visit to Rome in 90 and lectures there in that year (the only date found is c. 70; the lecturing is kept only as his own words about pupils in Rome and Italy).
- "One arrangement in two volumes and one in three": only the three-volume edition in Parisinus 1671 and 1674 is confirmed.
- Laurentianus 69.6 (L) and Marcianus gr. 385: not found in any source opened.
- Epaminondas–Scipio as the pair that "probably opened the series": seen only in a search-result summary of an article that would not open.
- The Lamprias letter as a thirteenth- or fourteenth-century forgery and the catalogue as third or fourth century: seen only in a search summary; Irigoin's article (REG 1986) opened only at its first page.
- Ziegler's Teubner Lives "1957–80" and the Teubner Moralia (Paton, Pohlenz and others, 1925–78): no page opened that gives these dates.
- Manager (epimeletes) of the Amphictyonic League "from 107 to 127": Wikipedia gives it, but it sits badly with his death after 119, so it is left out.
- "Eighteen" pairs closing with a comparison: Wikipedia's Parallel Lives page gives eighteen in its text but marks four of its 23 pairs as lacking one; the count is left out.

**Corrected from the draft**
- "c. 46" → born between 45 and 47, an estimate made from *The E at Delphi* (marked debated).
- "Visits Rome 90" → about AD 70, with Florus.
- "Held Roman citizenship as Lucius Mestrius Plutarchus" → "possibly" so named (Wikipedia).
- "About fifty Lives" → 23 pairs and four single Lives.
- "Parisinus gr. 1671 (A, 1296)" kept, now with the day (11 July 1296) and the scribe; "Planudes' edition of the Moralia, 1296" → Planudes revised A (1296) and listed 69 titles in 1302.
- "Parisinus gr. 1672 (E, fourteenth century), the fullest single manuscript of Plutarch" → the only manuscript with all 78 Moralia; its date is disputed (Manton: soon after 1302; Hoffmann: at least fifty years after Planudes' death). Perrin calls it C (in the Lives); Manton says E is its siglum in editions of the Moralia.
- "Lives printed at Florence, 1517" kept; added the Aldine Lives (1519) and the Latin Lives of about 1470.
- Goodwin "1870" → 1874, the date in every one of the Scroll's file headers.
- Bernardakis "7 vols, 1888–96" → only volumes I–VI (1888–95) are named in the Scroll's headers.
- "Several works in the Moralia are not his, including On the Education of Children": kept, with the Loeb translator's words.

**Weak points**
- Much of the life rests on Wikipedia and the SEP; Hadrian's appointment rests on Eusebius' *Chronicle* as cited by the SEP, not read.
- Perrin's introduction is from 1914; the location it gives for the Codex Sangermanensis is not repeated here, since it may be out of date.
- Hoffmann's and Manton's articles were read through the fetch tool (Persée page and Cambridge PDF), not in full.
- The Loeb and Harvard pages would not open (403), so the Loeb Moralia's sixteen volumes rest on WorldCat.
- The North–Shakespeare comparison rests on a teacher's web page (Mark Womack) and Perrin.

**Fact check (2026-10-02, a second, independent check; report pipeline/factcheck/new-authors.md):** the findings were checked against the cited passages and pages and corrected in the article.

## Xenophon (tlg0032), checked 2026-10-02

**Confirmed and kept:** Anabasis 3.1.4–7 (Xenophon "neither general nor captain nor private"; Proxenus' invitation; Socrates sends him to Delphi; the question put wrongly) and 3.1.47 (chosen general in place of Proxenus); 1.7.10 (10,400 hoplites, 2,500 peltasts); 1.8.27 (Cyrus killed); 2.6.1 (generals beheaded); 4.7.21–25 (Mount Theches, θάλαττα θάλαττα, the cairn); 5.3.7–13 (Scillus, the temple of Artemis, the cypress statue, the festival and hunting); 7.7.57 (not yet exiled in 399); 7.8.24 (Thibron takes over). Diogenes Laertius 2.48 (the meeting with Socrates; first to publish Socrates' conversations), 2.51–52 (exiled for siding with Sparta; life at Scillus), 2.53–55 (Corinth; sons sent to serve Athens; Gryllus at Mantinea; "I knew my son was mortal"; the march in the year before Socrates died), 2.56–59 (death at Corinth "at an advanced age"; some forty books; the list of works; prefaces to each book of the Anabasis; Demetrius of Magnesia on the Constitution; the Attic Muse; Plato; Thucydides' history; Istrus on Eubulus' decrees). Memorabilia 1.1.1 and 4.8.11; Apology 1–2 (Hermogenes); Symposium 1.1; Oeconomicus 1.1; Hellenica 1.1.1, 3.1.2 (Themistogenes) and 7.5.26–27 (the ending); Cyropaedia 1.1.3 and 8.7.1–28; Ways and Means 4.1; On Horsemanship 1.1 (Simon). Herodotus 1.205–214 (Tomyris; Cyrus killed). Plutarch, Agesilaus 18.1 (Xenophon at Coronea) and 20.2 (sons raised at Sparta); Plutarch, Glory of the Athenians 1 (Themistogenes as a device). Pausanias 5.6.5–6 (Scillus given by the Spartans; exile for joining Cyrus; the Elean version, the trial and the tomb). Arrian, Anabasis 1.12.3 and On Hunting 1.1–4 (Greek only; paraphrased, not quoted). Encyclopaedia Iranica (Tuplin): about 430; Coronea 394 against Athenians; whether this caused or reflected formal exile disputed; over 20 years at Scillus; 371 to Corinth; reconciliation; Gryllus an Athenian cavalryman at Mantinea 362; unknown whether he returned; 14 works, all extant; Agesilaus an encomium. Wikipedia: Xenophon (Erchia, Gryllus, 396 with Agesilaus, death probably 355 or 354, the Anabasis ending in 399, the Old Oligarch "detests" democracy, Phillips and Willcock 1999), Anabasis (401, Cunaxa, Tissaphernes' treachery, the march north, most scholars with Plutarch on Themistogenes, first unabridged text for students), Hellenica (411–362, no preface, early part to 2.3.10 written in the 380s), Cyropaedia (partly fictional; Scipio Aemilianus, Alexander, Caesar; mirrors for princes; Machiavelli; Filelfo 1467; Barker 1567), Ways and Means (355, last work), Trial of Socrates (399), Constitution of the Athenians (preserved among his works; Demetrius of Magnesia; Gilbert Murray; 443–406), Arrian (dates), List of editiones principes (Hiero 1494–96, Hellenica 1503, Giunta 1516, Reuchlin 1520, Aldine 1525 with Ps.-Xenophon). Manuscripts: Schmoll, GRBS 31 (1990) (Vat. gr. 1335 = A, parchment, 246 leaves, contents, date disputed tenth to twelfth century, Orsini; five manuscripts of the Apology; A alone suffices; earlier editions on faulty collations); Cirignano, GRBS 34 (1993) (two families of the shorter works; the Symposium only in the second; 23 manuscripts, 25 texts); Pinakes (Paris gr. 1640, 1320, Cyropaedia and Anabasis, owned by Lascaris, Ridolfi, Catherine de' Medici); Pearse after the Loeb introductions (Anabasis families c and f, old preference for c, papyri; Hellenica: Vienna papyrus of the third century, B = Paris gr. 1738 early fourteenth century); Paap, The Xenophon Papyri (1970), from the Internet Archive catalogue record. Interpolations: Paradeisopoulos, GRBS 53 (2013) (2.2.6, 5.5.4, 7.8.25–26 often thought interpolated; he argues they are Xenophon's); the Loeb note in the Scroll's English at 7.8.25 ("like the summaries prefixed to the several books, must have been the contribution of a late editor"). On Hunting: Stadter, GRBS 17 (1976) ("part or all" doubted, "the very dubious first chapter"; Arrian accepted it; Arrian imitated Xenophon most and was also called Xenophon). Editions: Marchant and the Loeb translators as named in the file headers; Loeb 90 revised by Dillery 1998 (Harvard Book Store record); Landmark Hellenika 2009 (BMCR 2011.10.17); Landmark Anabasis 2021 (BMCR 2022.09.40, "translation is sound"); Huitink and Rood 2019 (Classical Review record); Flower 2012 (BMCR 2014.03.54); Cambridge Companion 2016 (BMCR 2017.10.19, Xenophon fading over the century; the 1990s and 2000s banner decades).

**Left out:** the draft's "Marcianus gr. 368 (M)" for the Hellenica (Pearse gives M = Milan, Ambrosianus A 4, 1344, and Marcianus 368 = V); a date for Vaticanus gr. 987 (B of the Anabasis); "numerous papyri, a sign of his popularity in schools" (Paap's book shows papyri exist, nothing about schools); doubts about the Agesilaus and the Constitution of the Lacedaemonians; "the Attic admits poetic and non-Attic words that later purists frowned on, a hint of the Koine" (no source found); the Budé Anabasis of Masqueray (1930–31) (no record opened); an exact year of death; "Ten Thousand" as Xenophon's own phrase; Cicero's and Quintilian's praise (Latin, not in the Scroll; only Wikipedia's list); the Hellenica papyrus PSI 1197 (only an image caption).

**Corrected from the draft:** "Exiled ... perhaps by now or earlier" (394) → marked debated, with Anabasis 7.7.57, Pausanias, Diogenes and Iranica; "Dies 354, probably at Corinth" → "probably 355 or 354" (Wikipedia), Corinth by Diogenes' account, with Pausanias' Elean tomb as the other tradition; "Parisinus gr. 1640 (C, 1320)" as chief witness kept, as a leading c manuscript (Pearse) dated 1320 (Pinakes); "older family represented by Vat. gr. 1335 (A)" → A's date is disputed (tenth to twelfth century, Schmoll); "editio princeps (Giunta, Florence) 1516" → the works came out piece by piece, 1494–1525, the Giunta edition lacking the Apology, Agesilaus and Ways and Means; "On Hunting is doubted" → part or all, above all the first chapter (Stadter); "The short summaries are later additions" → kept as the Loeb note says, but marked debated, since Diogenes already knew a preface to each book; "theories that the Hellenica was written in stages" → the first part to 2.3.10 probably in the 380s (Wikipedia, after Thomas).

**Weak points:** Roger Pearse dates Paris gr. 1640 to the 9th–10th century; the Pinakes catalogue gives 1320, which is used here. Pearse's notes say the Hellenica was first printed at Florence in 1516; Wikipedia's list (after Marsh, Catalogus Translationum 7) gives the Aldine of 1503, which is used. The Harvard University Press and Loeb Classical Library pages would not open; the 1998 Loeb Anabasis rests on the Harvard Book Store record. The Encyclopaedia Iranica dates Xenophon ca. 430–353, Wikipedia "probably 355 or 354"; the article follows Wikipedia and says "most modern scholars". Wikipedia's sentence that most scholars agree with Plutarch about Themistogenes is marked "citation needed" there; the article attributes it to Wikipedia by name. Paap's book (restricted on the Internet Archive) was not read; only its title and contents line were used. Arrian's two passages are paraphrased from the Greek (no English translation in the Scroll).

**Fact check (2026-10-02, a second, independent check; report pipeline/factcheck/new-authors.md):** the findings were checked against the cited passages and pages and corrected in the article.

## Aristophanes (tlg0019), checked 2026-10-02

**Confirmed and kept:** Wikipedia (Aristophanes, read as wikitext): c. 446–c. 386; son of Philippus, deme Kydathenaion; forty plays, eleven surviving; Banqueters second at the City Dionysia 427; Babylonians showed the allied cities as slaves at a mill, denounced by Cleon as slander; first three plays directed by Callistratus and Philoneides; Knights the first play he directed himself; the Knights chorus on "the author-director of comedies" (their translation, kept as an outside quote); Clouds 528–32 read as showing he was very young (kept as debated); Frogs' unique repeat performance; the first nine plays Old Comedy, the last two Middle; Araros and Wealth, the posthumous plays; the Symposium as doubtful evidence; the epitaph "reputedly" by Plato (kept as legend); the list of plays and dates; Kassel and Austin as the standard edition of the fragments. Harvard University Press page for Henderson's Loeb Fragments: over forty plays, nearly a thousand fragments. Wikipedia, Old Comedy: only Aristophanes' plays survive; chorus of 24; eight plays named after the chorus. Play pages on Wikipedia: Acharnians (425, Callistratus, first at the Lenaia; Babylonians at the City Dionysia; Cleon's prosecution, possibly of Callistratus), Knights (424, first at the Lenaia; pro-war populist Cleon; the mask-makers), Clouds (423, last of three; Ameipsias' Connus; revision clues: Maricas 421, Hyperbolus 416, the Cleon appeal left over; circulated in manuscript; 399 and the debate over its influence), Wasps (Lenaia 422; editors who swap 1265–91 and 1450–73), Peace (421, second; Peace of Nicias; dung beetle; Cleon dead), Birds (414, second; longest; Pisthetaerus; Cloudcuckooland), Lysistrata (Lenaia 411; sex strike; Acropolis), Thesmophoriazusae (411, probably City Dionysia, result unknown; Mnesilochus disguised), Frogs (Lenaia 405, first; Euripides recently dead; the jealousy over the tragic throne), Assemblywomen (391), Plutus (388). In the Scroll: Acharnians 130–132, 377–382, 515–516; Knights 40–45, 230–233, 512–516; Clouds 218–234, 518–562 (including the revised parabasis, the "virgin" lines, Cleon "struck in the belly", Eupolis' Maricas and Hyperbolus), 591–594, 1435–1440 (speaker Strepsiades in the TEI file); Birds 817–821; Lysistrata 120–124; Frogs 66–72, 209–210, 686–705, 1418–1471; Euripides, Hippolytus 612 (the line Frogs 1471 echoes, compared directly); Plato, Apology 19, Symposium 185–189 (hiccough), 191 (the split humans), 221 (Alcibiades quotes Clouds 362). BMCR 2013.08.48 (Dicaearchus: second performance "because of the parabasis"; Sommerstein's 404; the best adviser for the city). Wikipedia, Papyrus Oxyrhynchus 212. Wikipedia, Codex Ravennas 429 (mid-tenth century, oldest with all eleven, Thesmophoriazusae and a quarter of Lysistrata, Aurispa 1423, Giunti 1516, Ravenna 1712). German Wikipedia, Byzantinische Trias (Wealth, Clouds, Frogs). Bridwell Library exhibit (Aldus, July 1498, nine plays named, Musurus, scholia). Wikipedia, Editio princeps (Lysistrata and Thesmophoriazusae, 1515, Philippus Junta). BMCR 2008.07.50 (Wilson's OCT 2007; Hall and Geldart; Sommerstein 1980–2002 as a reference edition; speaker attribution; Wilson's cut of Clouds 1437–1439; Wilson on "the deterioration of texts"; the Ravennas facsimile; dated papyri listed). Editions: catalogue headers in the Scroll (Hall and Geldart 1906/1907, Hickie 1853, the anonymous Birds 1938); Henderson (BMCR 1999.05.17); Kassel–Austin (JHS review page); Dover's Clouds (Classical Review page) and Frogs (BMCR 1994.03.26).

**Left out:** the Venetus (Marcianus gr. 474, V), its date (eleventh or twelfth century) and its seven plays: seen only in a search-engine summary of a Padua thesis page, which would not open (nor would White's 1906 article or HathiTrust's record of the 1902 facsimile); the scholia going back to Alexandria, Didymus and Symmachus; ancient copies marking a change of speaker only with a dash or double point; the prize of the Babylonians (Wikipedia says it won first prize at the City Dionysia, and elsewhere that he was "probably victorious ... with Babylonians in 427", while its own list dates the play 426; the Acharnians' "last year's comedy" fits 426); Callistratus by name as producer of the Banqueters; the prize of the Wasps; the hypothesis saying the revised Clouds was never finished (not in the Scroll; Wikipedia says only "incomplete"); Cratinus' Pytine as the winner in 423 (not on the page read); "the living Attic of the street"; papyri "adding fragments of the lost plays" (beyond P. Oxy. 212); Sommerstein's publisher; Parker's 1997 study of the lyrics; Coulon's Budé.

**Corrected from the draft:** "all eleven plays survive together in only one medieval manuscript" → the Ravenna manuscript is the *oldest* with all eleven (Wikipedia); "Clouds placed third" kept as last of three; "Assemblywomen c. 391" → about 392 or 391 (Wikipedia's Aristophanes page says c. 392, the play's page 391); "Giunta prints Lysistrata and Thesmophoriazusae in 1516" → 1515 or 1516, the sources disagree; "Cleon denounced him before the Council" kept, from the Acharnians' own words, with Wikipedia's doubt whether the target was the poet or Callistratus; "Nephelokokkygia, Birds 819" → the word is at 819b and 821 in the Scroll's text; "the Frogs performed a second time because of its parabasis" kept, as Dicaearchus' explanation reported in the hypothesis (BMCR), with the date of the second performance marked as debated; "the first play in his own name" → the first he directed himself.

**Weak points:** the life and dates rest mostly on Wikipedia pages (read as wikitext, so the wording is exact); the manuscript history is thin: only the Ravenna manuscript is properly sourced, the Byzantine triad rests on German Wikipedia, and the important Venetus is left out; several sources (Sommerstein's "History of the Text of Aristophanes" PDF, De Gruyter, the Loeb site, Booktopia) would not open; the 1515/1516 date of the Giunta edition is unresolved; the BMCR review of Wilson is in French and was translated by us.

**Added in review (2026-10-02):** the Frogs' «ἡ γλῶττʼ ὀμώμοκʼ» as a quotation of Hippolytus 612 now also rests on Gilbert Murray's notes to his 1912 translation (lines 101 and 1471), not only on comparing the two texts.

**Fact check (2026-10-02, a second, independent check; report pipeline/factcheck/new-authors.md):** the findings were checked against the cited passages and pages and corrected in the article.

## Pindar (tlg0033), checked 2026-10-02

**Confirmed and kept**
- Life: Wikipedia (Pindar): born c. 518 at Cynoscephalae near Thebes; died c. 438 at Argos, aged about eighty; daughters took the ashes to Thebes; Lasus of Hermione as teacher; Pythian 10 in 498 for the Thessalian ruling family, aged about twenty; Aegina's leading citizens ordered about a quarter of the odes; Theron, Hieron, Arcesilas; the "bulwark of Hellas" (fr. 76), the Theban fine and the Athenian gift ("said to"); Corinna's victories probably invented by ancient commentators; the five ancient sources (P.Oxy. 2438 found 1961, Pausanias, Eustathius, the Vita Vratislavensis, Thomas Magister, the Suda), "much of the material is clearly fanciful", Bundy's *Studia Pindarica* (1962); Alexander sparing the house in 335. Sandys's Loeb introduction (Internet Archive): Ol. 65.3 = 518 widely accepted, 522 the alternative (Boeckh); death at Argos aged eighty, so 442 or 438; daughters and ashes; Lasus "probably".
- Quintilian 10.1.61 in Butler's Loeb translation (LacusCurtius): "Of the nine lyric poets Pindar is by far the greatest".
- The four books, the seventeen books and their kinds: Wikipedia; Sandys (the Ambrosian life's list of seventeen works; only the four books of epinicians "nearly complete"; "the contest itself is not directly described").
- Forty-five odes: counted from the Scroll's own references (Olympian 1–14, Pythian 1–12, Nemean 1–11, Isthmian 1–8).
- Dates from the headings of Svarlien's translation in the Scroll: Olympian 1 (476), Pythian 10 (498), Pythian 8 (446), Pythian 4 (462), Pythian 12 (a flute-playing contest, 490), Nemean 11 (president of the council of Tenedos), Isthmian 3 and 4 (both for Melissus of Thebes), question marks on every Nemean ode, Pythian 11 "474 or 454".
- Pythian 8.95–96 (Greek and Svarlien's English), Olympian 1.1 ("Water is best"), Olympian 1.6 (ἐν ἁμέρᾳ), Olympian 3.4 (Μοῖσα) and 3.8 (lyre, flutes and words), Olympian 2.25–27, Olympian 6.54: all copied from passage.ts.
- LSJ (site's copy): ἐπάμερος "Dor. and Aeol. for ἐφήμερος, Pi. P. 8.95"; ἡμέρα "Dor. ἀμέρα"; Μοῦσα "Aeol. Μοῖσα", Dor. Μῶσα.
- Dialect, music, triads (Pythian 4 thirteen triads; shortest one triad), chorus versus solo: Wikipedia. Pausanias 9.22.3 ("not in Doric speech like Pindar").
- Quotations of lost poems: Herodotus 3.38.4 (νόμον πάντων βασιλέα); Plato, Gorgias 484 (νόμος ὁ πάντων βασιλεὺς, Callicles "I do not know the poem well").
- Legends: Pausanias 9.23.2–4 (tomb in the hippodrome, bees, share of Delphic first-fruits, Persephone's dream, the old woman), 10.24.5 (iron chair), 1.8.4 (statue at Athens), 9.25.3 (ruins of the house beyond the Dirce).
- Alexander: Arrian 1.9.10 (house and descendants, "they say", our translation); Plutarch, Alexander 11.6 ("the descendants of Pindar"). Milton, Sonnet 8, in *Poems* (1645): the John Milton Reading Room text.
- Alexandria: Österdahl, *Pindaric Scholarship between Aristarchus and Didymus* (Stockholm 2021): Aristophanes of Byzantium (c. 257–180) "most probably" the authoritative 17-book edition; the Vita Thomana on Olympian 1 first; Callimachus filing Pythian 2 as Nemean; Aristarchus' commentary (some 70 fragments), Didymus (at least 68); the athetesis of φιλέοντι δὲ Μοῖσαι at Ol. 2.27 on metrical grounds, still transmitted; Olympian 5 "not in the edaphia" but Pindar's according to Didymus, the only poem whose authenticity the scholia question. Order Olympian, Pythian, Isthmian, Nemean, with Nemeans 9–11 at the end: Sandys and Wikipedia.
- Papyri: Grenfell and Hunt, *Oxyrhynchus Papyri* 5 (1908), read in the Internet Archive scan: the find of 13 January 1906; some 380 fragments; written on the back of a list of persons; hand of the early second century, with scholia; only two fragments previously assignable to the Paeans; no epinician among the Oxyrhynchus Pindar papyri so far, though Eustathius called those the most popular.
- Manuscripts: Fries, GRBS 57 (2017): school syllabus and scholia; none older than the late twelfth century; Isaac Tzetzes' treatise; two branches; A redated by Mazzucchi from c. 1280 to the 1180s; B c. 1180, 282 leaves, the better part of Ol. 1 to Isthm. 8; only D (Laur. 32.52, early fourteenth century) near-complete. A has Olympians 1–12 (Sandys; Wikipedia's table). 142 manuscripts and the Byzantine reworkings by Thomas Magister, Moschopulus and Triclinius: Sandys.
- Print: Aldus 1513 and Callierges 1515 (Sandys's bibliography; Wikipedia's list of editiones principes, which adds that Callierges printed the scholia for the first time); Callierges worked from B (Wikipedia); Boeckh 1811–21, "a new epoch", parts of 1811, 1819 and 1821 (Sandys).
- Variants: Isthmian 3 and 4 the only two odes with the same metre, one reason for joining them (Sandys); Ol. 6.54 βατιᾷ (Wilamowitz) for βατείᾳ of the old manuscripts, ἀπειράτῳ against ἀπεράτῳ / ἀπεράντῳ and Heyne's ἀπειρίτῳ (Sandys's critical notes); the Scroll's Ol. 2.27 without φιλέοντι δὲ Μοῖσαι; Pausanias 6.13.8 on the Corinthian and Argive records; Wikipedia on the Olympic and Pythian victor lists.
- Editions: Sandys (title page of the Internet Archive copy: first edition 1915, revised 1937; the Scroll's file header names the 1937 reprint); Svarlien 1990 (file header); Race, Loeb 56 and 485, 1997 (UCL Discovery record of a review); Snell–Maehler, Teubner, Leipzig 1987, pars 1 Epinicia (Internet Archive library record); Maehler, pars 2 Fragmenta, Indices, Leipzig 1989 (Classical Review record of Carey's review); Boeckh (Sandys); Grenfell–Hunt 1908.

**Left out**
- "About 180 medieval manuscripts" (Sandys counts 142; no source for 180 found).
- "The end of the Isthmian book has been lost": a search-engine summary said B has eight Isthmians and D the beginning of a ninth, and D'Alessio has a chapter called "The lost Isthmian odes of Pindar" (Cambridge, 2012), but no page with the text would open.
- "Boeckh's edition of 1811 was the first to reconstruct the metre convincingly", and strict strophic correspondence as editors' "main tool for detecting corruption": no source found; only Sandys's "new epoch" and "text, metres" are kept.
- Aristarchus as the author of the scholia in P.Oxy. 841 (search summary only); Lobel's further fragments of 1961 in P.Oxy. 26.
- Horace's ode on Pindar (only Quintilian's mention of Horace's view is in the source read; Quintilian's quotation is cut before it).
- Pindar as Athenian *proxenos* (Wikipedia itself calls it "highly unlikely"); his wife and son by name; other teachers (Agathocles, Apollodorus, his uncle Scopelinus); Pindar's own claim, in a fragment, to have been born at a Pythian festival.
- Modern translations whose details could not be opened or disagreed: Verity (Oxford World's Classics, given as 2007 and 2008), Nisetich (1980), Bowra's Oxford text (1935/1947), Drachmann's scholia (1903–27; Wikipedia only).
- Milton's sonnet as written during the royal army's approach to London in 1642 (a search summary only; the Reading Room page has no note).

**Corrected from the draft**
- "Doric colouring (… Μοῖσα, Moisa, for Attic Μοῦσα)": LSJ gives Μοῖσα as the *Aeolic* form (Doric is Μῶσα). The Doric example used instead is ἁμέρα (LSJ: Dor. ἀμέρα), and LSJ's own note on ἐπάμερος.
- "Ambrosianus C 222 inf. (A, twelfth century)": Fries reports Mazzucchi's redating from c. 1280 to the 1180s; Wikipedia's table, after Bowra, still says thirteenth to fourteenth century. The article gives the 1180s and names the redating.
- "Vaticanus gr. 1312 (B, twelfth or thirteenth century)": c. 1180 (Fries); Wikipedia's table says thirteenth.
- "Aristophanes of Byzantium arranges his works into 17 books": kept as "most probably" (Österdahl), with the date marked as approximate.
- "Some scholars have argued that at least some were performed solo": kept, marked debated (Wikipedia).
- Quintilian's "by far the first": Butler's wording, "by far the greatest", is quoted.

**Weak points**
- The life rests mostly on Wikipedia's Pindar page and on Sandys's introduction of 1915 (as revised in 1937); both rely on the late ancient lives, which the article marks as legend where it uses them.
- The Internet Archive copy of Sandys is the 1968 reprint; its title-page history (1915, 1919, 1937) is the source for the dates. The manuscript count of 142 is Sandys's and may be out of date.
- The Ol. 6.54 variants come from an OCR scan of Sandys's critical notes; the editors' sigla in brackets were partly garbled, so only the readings and the names written out (Wilamowitz, Heyne) are used.
- The Snell–Maehler 1987 volume is confirmed only by a library record on the Internet Archive; the Race volumes by a university repository record of a review (the Loeb and Harvard pages would not open). Trismegistos (P.Oxy. 841) and the Oxford Scholarly Editions page were blocked.

**Fact check (2026-10-02, a second, independent check; report pipeline/factcheck/new-authors.md):** the findings were checked against the cited passages and pages and corrected in the article.

## Hesiod (tlg0020), checked 2026-10-06

Article: `web/src/wiki/authors/tlg0020.ts` (45 sources). Not yet registered in `author-articles.ts` / `author-articles-all.ts`.
Tests: `ARTICLE=tlg0020 npx vitest run src/wiki/author-articles.test.ts` (11 passed); `CORPUS=1 ARTICLE=tlg0020 npx vitest run
src/wiki/author-articles.corpus.test.ts` (3 passed; a deliberately altered quotation was caught, so the check is live); `npx tsc --noEmit -p .` clean.

**Confirmed and kept**
- Wikipedia (Hesiod), read as wikitext: active c. 750–650 BC, fl. c. 700, around the same time as Homer; "the first written poet in the Western tradition to regard himself as an individual persona…"; father from Cyme in Aeolis, a little south of Lesbos; Ascra near Thespiae; laurel staff, not a lyre, so ancient and modern scholars infer he was no trained rhapsode; Perses as a possible literary creation; Nagy's reading of both names as poetic personae; Plutarch's identification of Amphidamas with the Lelantine War hero, and modern estimates for the war (730–705) fitting Hesiod's dates; most scholars today put Homer first; Greeks of the late fifth and early fourth centuries ranked Orpheus, Musaeus, Hesiod, Homer in that order; the Theogony the earliest source for Pandora and Prometheus; Hesiod's Greek (Ionic epic dialect, some Aeolisms, no certainly Boeotian words; "hobnailed hexameters"; 278 un-Homeric words in WD, 151 in Th.); West's portrait ("a surly, conservative countryman…"); the Shield spurious, probably sixth century; Hesiod as a source for myth, farming, economic thought, astronomy, cosmology; the death at the temple of Nemean Zeus in Locris.
- Scroll passages (all printed with `scripts/passage.ts`, every Greek and English quotation copied from the output): Theogony 1–35 (the Muses; "And one day they taught Hesiod glorious song…"; "mere bellies"; «ἴδμεν ψεύδεα πολλὰ…»; "a divine voice"), 116–117 (Chaos), 924–930 with 929a–929t, 1019–1022 (the last lines = the Catalogue's first); Works and Days 1–12 (hymn; two Strifes), 35–41 (the inheritance; line 40), 169–169d, 174–175, 285–292 ("foolish Perses"; the sweat), 520–526 (the Boneless One), 633–662 (Cyme, Ascra, Aulis–Euboea, Chalcis, the tripod), 826–828 (the last line); Shield 1–57 (opens «ἢ οἵη»; Cycnus begins at 57); Herodotus 2.53.1–3; Pausanias 9.31.3–6 (tripod on Helicon "which it is said Hesiod received"; lead tablet; the Helicon Boeotians' rejection of the prelude; the list of poems; the death and the sister) and 9.38.3–4 (bones at Orchomenus, the crow, the epitaph); Thucydides 3.96.1; Plutarch, Dinner of the Seven Wise Men 10 (Amphidamas and the Lelantine plain; Homer and Hesiod's riddles); the Contest of Homer and Hesiod (Greek only: the king Panedes crowns Hesiod for calling to farming and peace; our translation); Aristophanes, Frogs 1030–1036 (Greek only; speaker Aeschylus per the TEI; our translation).
- Evelyn-White, Hesiod, the Homeric Hymns and Homerica (1914), introduction, bibliography and notes (Project Gutenberg 348): his view that Th. 22–35 tell of a later poet's call by the Muses who once taught Hesiod; father a seafaring trader; the Shield's opening taken from the Catalogue (he says 53 lines); Hesiod's "quaint allusive phrases" ("the Boneless One gnaws his foot"); the death story (Nemea avoided; Oenoe in Locris also sacred to Nemean Zeus); papyri on the whole confirm the medieval manuscripts, new lines WD 169a–d and better readings at WD 278, Th. 91, 93, the chief gain being the Catalogue; Paris gr. 2771 (11th cent.) in Rzach's list; the Rylands papyrus; the Divination by Birds attached to the end of WD until rejected by Apollonius (from Proclus); note 1630 on Th. 929a–t (restored by Peppmüller; nineteen lines from another recension quoted by Chrysippus in Galen); editions: Chalcondyles "Milan (?) 1493 (?)", Aldus 1495, Trincavelli 1537, Rzach 1902 and 1913.
- BMCR 2007.03.31 (Janko on Most's Loeb 57, 2006): Evelyn-White's Loeb "totally outdated"; Most treats Hesiod as a real person ("the poet's self-representation…"); Most: relative date "probably undecidable"; Aristarchus' monograph On the Date of Hesiod (Hesiod later than Homer); West argued Hesiod antedates Homer; statistical study puts Homer first "beyond reasonable doubt" (Janko's view); Most follows West in athetizing the end of the Theogony, Janko disagrees; West/Most print ancient misquotations at Th. 900 and WD 288; "at least a dozen places" of weakly attested lines.
- BMCR 2007.10.44 (Fox on Loeb 503, 2007) and 2019.10.06 (Stama on the 2018 second edition, in Italian): two volumes 2006 and 2007, corrected reprint 2010, second edition 2018; Most's text is West's (1966 and 1978 commentaries); Th. and WD considered genuine by the great majority; Merkelbach and West's Fragmenta Hesiodea.
- Wikipedia (Works and Days): contents (hymn of ten lines, two Strifes, Pandora, five ages, hawk and nightingale, farming, sailing, auspicious days); editions list (Wilamowitz 1928 omits the "Days"; Solmsen's 1970 OCT, third edition 1990). Wikipedia (Theogony): earliest manuscripts end of the 13th century; Vat. gr. 1825 about 1310 by watermarks. Wikipedia (Shield of Heracles): subject; date end of 7th to mid 6th century; borrowed opening ("fifty-six lines"); Aristophanes of Byzantium; Aldus 1495; papyri of the 1st, 2nd and 4th centuries. Wikipedia (Catalogue of Women): five books; some 1,300 lines; final two lines of the Theogony = Catalogue fr. 1.1–2; most scholars now think it post-Hesiodic; West 580–520, Janko near the Theogony, Hirschberger 630–590; West dates Th. 965–1020 to the later sixth century; more than fifty ancient copies; the late-antique book label (Th., WD, Shield); P.Oxy. 28 (1962) nearly doubling the papyri; Merkelbach–West 1967. Wikipedia (Contest of Homer and Hesiod): second century AD, mentions Hadrian; older papyri. Wikipedia (Praxiphanes; Aristarchus of Samothrace; Pausanias): dates and roles. Wikipedia (List of editiones principes in Greek): WD at Milan c. 1482, ed. Bonus Accursius, with Theocritus; the Aldine Hesiod 1495–96.
- Living Poets (Durham), scholion from the WD prolegomena (p. 2 Pertusi), Greek and English, read in the Wayback copy of 18 Feb 2025 (the live site gave 502): Aristarchus obelized the proem; Praxiphanes, pupil of Theophrastus, found a copy beginning at WD 11.
- West, CQ 24 (1974): "something over 260" manuscripts of WD, "seventy-odd" of Th., "sixty-odd" of the Shield, over 100 later than c. 1480, the approximate date of the first printed edition. West, CQ 14 (1964): earliest complete manuscripts of Th. end of the 13th century, the recensio based on the 14th and 15th.
- Treccani DBI (Bonaccorso da Pisa): his Theocritus with Hesiod's Opera et dies (undated). Schøyen Collection, MS 5068: WD 360–366, 378–383, papyrus dated by the collection to the 3rd century BC, "by far the earliest" (the collection's own claim; kept as such).
- LSJ (site's copy): νήπιος "infant, child", metaph. "childish, silly"; ἀνόστεος "boneless, of the polypus, Hes. Op. 524"; πολύπους (B) "the common poulp or octopus".
- Quintilian 10.1.52 (Butler, LacusCurtius): "Hesiod rarely rises to any height…", "his maxims of moral wisdom provide a useful model".
- Edition records: JHS 88 (1968) review of West's Theogony (Oxford, Clarendon, 1966); CR 29 (1979) review of West's Works and Days (Oxford, Clarendon, 1978); CiNii record of the Solmsen OCT second edition (1983) with Merkelbach–West's Fragmenta selecta; the Perseus TEI header (Evelyn-White, Loeb, Heinemann and Macmillan, 1914).

**Left out because it could not be confirmed**
- "The first Greek poet to name himself and talk about himself": not found in this form; replaced by Wikipedia's attributed wording.
- "Laurentianus 32.16 (1280)": Evelyn-White gives only "13th cent."; no source for 1280 opened. "Vaticanus gr. 915" left out (only a century in Evelyn-White).
- "Parisinus gr. 2771, tenth or eleventh century": Evelyn-White says eleventh; a search snippet said "about 1000" (page not opened). The article says eleventh, in Evelyn-White's list.
- "The ending of the Theogony from about line 900 may be a later addition": the sources opened say West athetized "the end" and dated 965–1020 late; no source gives 900 as the boundary.
- "The Days (765–828) are often thought to be a later appendix": only Wilamowitz's omitting them (1928) is kept.
- Plutarch's own argument that WD 654–662 is an interpolation (reported only at second hand by Wikipedia and Evelyn-White; the article keeps just his identification of Amphidamas, which the Dinner of the Seven Wise Men shows).
- Proclus' and Tzetzes' commentaries in any detail (the Bodleian record was blocked); Virgil and the Roman reception; the Monnus mosaic and the "Pseudo-Seneca" bust; the Typhon episode as an interpolation.
- Modern translations (Lattimore, Athanassakis, Lombardo, Stallings, etc.): listed by Wikipedia only, no publisher pages opened.
- The Schøyen papyrus "variant not recorded elsewhere" at WD 363: the collection's claim only.

**Corrected from the draft**
- "Ascra, bad in winter, hard in summer, never good" → the Scroll's translation, "bad in winter, sultry in summer, and good at no time" (WD 640).
- "M. L. West argued that the Theogony is earlier than the Homeric poems": kept as a debated point beside Janko's opposite view and Most's "probably undecidable"; Wikipedia says most scholars put Homer first.
- Timeline "sixth century: the Shield and the Catalogue circulate under his name" → separate debated marks: the Shield late seventh to mid sixth century; the Catalogue 580–520 in West's dating, earlier according to others (Janko close to the Theogony; Hirschberger 630–590).
- "Editio princeps of Works and Days (Milan, c. 1480)" → kept as "about 1480" (West) / c. 1482 (Wikipedia), naming the editor, Bonus Accursius; Evelyn-White's older attribution to Chalcondyles (1493?) noted.
- "Aristarchus later rejects the hymn" → he marked the lines with an obelos (the scholion); Praxiphanes "says he found" a copy without it.
- "Its first 56 lines are borrowed from the Catalogue": Wikipedia says 56, Evelyn-White 53 → "fifty-odd".
- "The Theogony in about 70 [manuscripts], the Shield in about 60" → West's "seventy-odd" and "sixty-odd".
- "F. Solmsen, R. Merkelbach, M. L. West … (OCT, 3rd ed. 1990)" → Solmsen edited the three poems; Merkelbach and West the Fragmenta selecta; first edition 1970, second 1983, third 1990.
- "G. W. Most, Hesiod, 2 vols (Loeb, 2006–07)": confirmed, with the second edition of 2018 added.
- "Herodotus says that Homer and Hesiod gave the Greeks their gods": quoted exactly ("taught the Greeks the descent of the gods, and gave the gods their names").

**Weak points to revisit**
- Much of the life and the dates rests on Wikipedia (Hesiod) and on Evelyn-White's introduction of 1914, which a reviewer calls "totally outdated"; Most's own introduction (Loeb site) returned 403 and was known only through the BMCR reviews.
- West's two CQ articles and the JHS/CR reviews were read only as their opening page or record on Cambridge Core.
- The manuscript dates (Paris gr. 2771 eleventh century; Vat. gr. 1825 about 1310) rest on Evelyn-White's list and on Wikipedia; a library catalogue record would be better. The BnF and the Cambridge Digital Library (Trinity O.9.27) would not open.
- The Living Poets scholion was read in a Wayback copy because the live site returned 502.
- The Schøyen papyrus date and "earliest" claim are the owning collection's own.
- Wikipedia's "Hesiod's Greek" figures (the digamma statistics, the 278 un-Homeric words) are not traced to their original studies.

**Fact check (2026-10-06, a second, independent check; report pipeline/factcheck/hesiod.md):** 6 findings, each checked against
the cited page or passage, all corrected: *Works and Days* 11 "seems to correct" the *Theogony* or the older story (Janko, BMCR
2007.03.31: correcting "the tradition rather than … a fixed text"); the *Theogony* never names Pandora (the name is at *Works
and Days* 81); the *Catalogue*'s five books are the *Suda*'s figure (Wikipedia, *Catalogue of Women*); the Aldine is dated
February 1495 Venetian style, 1496 by ours (Glasgow incunabula record "Feb. 1495/96"; Wikipedia's list "1495–96"), timeline
1496, approximate; "funeral games" and "nobleman" footnoted to sources 1 and 23, not only to *Works and Days* 650–659;
Pausanias (9.31.3) says the oldest tripod on Helicon is said to be Hesiod's prize, not that he was shown it.

## Lysias (tlg0540), checked 2026-10-06

Article: `web/src/wiki/authors/tlg0540.ts` (27 sources). Not yet added to `ARTICLE_LOADERS` / `author-articles-all.ts`.
Tests: `ARTICLE=tlg0540 npx vitest run src/wiki/author-articles.test.ts` (11 passed), `CORPUS=1 ARTICLE=tlg0540 npx vitest run
src/wiki/author-articles.corpus.test.ts` (3 passed), `npx tsc --noEmit -p .` (clean).

**Confirmed and kept**
- Life and dates: Wikipedia (Lysias): c. 445–c. 380; one of the ten Attic orators; modern critics place birth c. 445 and Thurii c. 430 (citing Nails and Todd's OCD article). BMCR 2008.11.05 (Christ on Todd 2007): "probably born in the mid-440s", career as logographer 403 to c. 380, financial need after the Thirty; 425 speeches, 233 accepted; modern editions print 34 or 35; Carey's fragments give evidence of another 145 speeches; corpus grouped by procedure, survival of groups perhaps by chance; Dover's collaboration theory (1968) rejected by Todd, both sceptical of stylometry; Euphiletus and Lys. 1; Lys. 2 accepted by Todd as a display piece (a metic unlikely to be chosen); Lys. 5 just under 300 words because of damage; Lys. 6 a genuine speech of c. 400, perhaps revised; Lys. 9 probably not by Lysias; Lys. 11 an epitome of 10.
- Jebb, EB1911 "Lysias" (Wikisource page scans 197–199): ancient birth date 459, reckoned back from Thurii (444) at fifteen; the Republic set at Polemarchus' house, family well known to Plato; Tisias "said to"; 413 disaster; "accused of Atticizing", 300 others, settled at Athens 412; shield factory with 120 skilled slaves; Thirty in 404; Polemarchus' hemlock; back door; Megara; Thrasybulus' proposal of 403 defeated for want of a probouleuma; speech-writing from 403 to c. 380; Against Eratosthenes 403, his only direct contact with politics; the Socrates-defence story "probably arose from a confusion" with Polycrates; Olympiacus 388; For Pherenicus 381 or 380; died in or soon after 380; three styles, Lysias the model of the plain; 34 speeches (three fragmentary), 127 lost known by title or fragment; Augustan age 425 works, more than 200 genuine; Epitaphios "certainly spurious", c. 380–340; For the Soldier probably by an imitator; Theomnestus II an epitome; the Phaedrus erotikos generally held Plato's, with Jebb's doubt; Hibeh papyri (Theozotides); Sauppe showed all MSS derive from Palatinus X; Laurentianus C next; editio princeps Aldus 1513; Reiske 1772, Bekker 1823.
- Lamb's Loeb (Internet Archive scan; title page: Loeb Classical Library, first printed 1930, reprint 1967): text based on Thalheim (Teubner 1901); Gernet–Bizos (Les Belles Lettres, 1924); bibliography: Hude (Oxford text) 1912, Baiter–Sauppe 1839; "no serious difficulty" in the ancient birth date (paraphrased); 412 return; citizenship briefly, then isoteles; the Lives "formerly attributed to Plutarch"; Phaedrus speech "more probably a Platonic parody"; P.Oxy. xiii (Grenfell and Hunt, 1919), Against Hippotherses, "the wealthiest resident alien in the times of your prosperity"; Olympic Oration preserved by Dionysius (De Lysia 29–30), Diodorus' date 388; Lys. 1: Euphiletus prosecuted for murder by the dead man's relatives; Lys. 2 "much disputed", Aristotle quotes it unnamed, Dionysius silent; Lys. 6 "now generally agreed" not Lysias, a pamphlet; Lys. 12's title says "spoken by Lysias himself", "no reason to doubt"; eight pages lost from the Palatine manuscript (end of 25, Against Nicides, start of 26); Lys. 17's title a correction by Hoelscher; apparatus notes crediting Aldus, Reiske, Markland, Taylor, Cobet and others.
- BMCR 2021.07.14 (Trevett on Todd 2020): Lys. 12 "universally agreed" Lysias' work, but Todd leaves open whether a non-citizen could take part in the euthunai, maybe a pamphlet; Lys. 1 "perhaps the most widely read, at least by students", a different Eratosthenes; no English commentary on these speeches on this scale before; Carey's OCT text reproduced; Todd's Texas translation (2000); Carey, Lysias: Selected Speeches (Cambridge 1989).
- Kremmydas, CR 57.2 (2007) 303–4 (Royal Holloway PDF): P.Oxy. XIII 1606, first published by Grenfell and Hunt; fragments of at least six speeches; Lysias the defendant in Against Hippotherses, delivered by a supporting speaker; clauses of the amnesty of 403/2.
- Sosower, GRBS 23.4 (1982): X twelfth century ("early XII" in his table), best witness; all surviving speeches through X; speeches 1–2 probably also in a rhetorical anthology; other witnesses of the greater corpus probably lost in 1204; the 14th-century note (patriarch Niphon, 1311–1315) placing X at Nicaea; Palla Strozzi owned X, Scutariotes' copies; Aristobulus Apostolius wrote K for Musurus in Florence 1492/3; K the main source of the Aldine Oratores (1513); "the whole of the manuscript tradition ... stands behind the first printed edition".
- Pinakes notice (PDF) of Heidelberg Pal. gr. 88: Lysias content dated 11th century, second half; owners Palla Strozzi (Florence to 1434, then Padua), Ulrich Fugger (bequest of 1584 to Frederick IV, Elector Palatine, hence Heidelberg); Gernet–Bizos, Lysias. Discours, CUF 1, 1924; Sosower's 1987 book.
- Wikipedia (Dionysius of Halicarnassus): flourished under Augustus, moved to Rome, taught rhetoric.
- LSJ (site copy): μέτοικος "settler from abroad, alien resident in a foreign city"; ἰσοτελής "of a favoured class of μέτοικοι, subject to the same taxation as the citizens"; λογογράφος II "professional speech-writer"; ἠθοποιία II "delineation of character" (citing D.H. Lys. 8).
- Quintilian 10.1.78 (Butler, LacusCurtius): "would compare him to a clear spring rather than to a mighty river"; Latin checked at The Latin Library (puro tamen fonti quam magno flumini propior).
- Scroll passages (copied from passage.ts): Lys. 12.4–20 (Pericles and thirty years; Theognis and Peison; ten men; the talent; the chest's contents; Damnippus' house with doors front and back; three doors open; Archeneos; Megara the next night; Eratosthenes' arrest of Polemarchus in the street; hemlock without trial; the hired hut and the cloaks; 700 shields, 120 slaves; Melobius and the earrings); 12.100; Lys. 1.6–10; Lys. 33.1–3; [Plut.] Lives 3.1 (Cephalus' wealth and possible banishment; Thurii at fifteen; Tisias and Nicias; "accused of favouring Athens", 300 others; 2,000 drachmas, 200 shields, 300 mercenaries; Thrasybulus, Archinus, no prior vote of the Council; isoteles; 425 / 233 / lost only two; Defence of Socrates; "easy ... hard to imitate"; speeches for Iphicrates; the Olympic speech against Dionysius); Plato, Republic 1.328, Phaedrus 227–228, 257, 279; Plutarch, Concerning Talkativeness 5; Diogenes Laertius 2.40–41; Dionysius, On Lysias 1–3, 8, 12, 29 (Greek only; translations ours).

**Left out because it could not be confirmed**
- A single date for X: the draft's "13th century" is not supported; Sosower says early twelfth, Pinakes the second half of the eleventh (both given, marked debated). The Heidelberg digital library and Biblissima pages were blocked by a bot check.
- How X travelled from Heidelberg to Rome and back (implied by Stevenson's Vatican catalogue of 1885 in the Pinakes bibliography, but not stated in any source read).
- A second-volume date for Gernet–Bizos (the draft's 1924–26): only vol. 1, 1924, is confirmed (Lamb, Pinakes); Wikipedia gives a two-volume printing of 1959–62.
- 384 as an alternative date for the Olympic Oration (only Wikipedia's table; Jebb and Lamb give 388).
- Carey's showing that a fifteenth-century manuscript used by Hude is a copy, and his conservatism as an editor (search summary of MacDowell's CR review, which would not open).
- Wikipedia's claim that stylometric studies support Plato's authorship of the Phaedrus speech (not checkable; Lamb and Jebb are used instead).
- The Lives' date of his return "when the Four Hundred already had possession of the city" (411), which sits awkwardly with 412 in Jebb and Lamb; 412 kept, the discrepancy not discussed.
- Lamb's "Cephalus settled about 470" and Lamb's Thurii "about 440" (not needed; the modern dates are given from Wikipedia and Todd).

**Corrected from the draft**
- "Ancient scholars dated his birth to 459, but most modern scholars prefer c. 445": kept, marked debated, and noted that Lamb (1930) still accepted the ancient date.
- "a decree making him a citizen was annulled, and he remained a metic" → he lived on as an *isoteles*, a privileged metic (the Lives; LSJ).
- "Plato set the Republic in the family's house" → in the house of his brother Polemarchus (Republic 1.328).
- "Only one, Against Eratosthenes (12), ... was delivered by Lysias himself" → marked debated: the manuscript title and Lamb say so; Todd leaves open that a non-citizen could not, and it may have been a pamphlet. The papyrus speech Against Hippotherses shows Lysias also had a case of his own, delivered by a supporting speaker.
- "Palatinus gr. 88 ... (X, 13th century)" → dated early twelfth (Sosower) or second half of the eleventh (Pinakes).
- "The Funeral Oration (2) and a few other pieces also circulated separately" → speeches 1 and 2 probably also in a rhetorical anthology (Sosower).
- "the Funeral Oration and Against Andocides ... long debated": kept with the actual positions (Jebb and Lamb against; Todd for speech 2 and for speech 6 as a genuine trial speech).
- "C. Carey ... the standard text": confirmed as Lysiae Orationes cum Fragmentis (OCT 2007); "K. Hude (OCT, 1912)" confirmed by Lamb's bibliography (Kremmydas gives 1911; 1912 kept).
- "Lamb ... the Greek text and translation used here": confirmed by the Perseus file headers; Lamb's Greek is based on Thalheim (1901).

**Weak points to revisit**
- Jebb's article is of 1911 and Lamb's introduction of 1930; on authorship, they are set against Todd's views as reported in two BMCR reviews, not Todd's own pages.
- The number of surviving speeches varies by count: 34 (Jebb, the Scroll), 34 or 35 (Todd), 31 (Sosower, who counts differently).
- The Pinakes date and owners come from its PDF notice; the Heidelberg page itself could not be opened.
- Todd's commentary, Carey's OCT and Carey's 1989 selection are known here only through reviews (BMCR, and the Classical Review record), not their publishers' pages.
- The Plutarch story of the client and the Diogenes story of the Defence of Socrates are marked as legend; Jebb's explanation of the latter is his own guess.

**Fact check (2026-10-06, a second, independent check; report pipeline/factcheck/lysias.md):** 11 findings, each checked against
the cited page or passage (Lamb's Loeb in the Internet Archive text and record, Jebb on Wikisource, BMCR 2008.11.05, the Pinakes
notice, Dionysius *On Lysias* 2 and 29–30 and *Republic* 328 in the Scroll), all corrected: in *Against Hippotherses* the
supporting speaker calls Lysias the wealthiest metic; the *Olympic Oration*'s date 388 (Diodorus) marked debated, 384 having
been proposed (Lamb); Niphon's patriarchate 1310–1314 (Pinakes bibliography: Agoritsas); Lamb's 1930 Loeb published by
Heinemann and Putnam, Harvard on the reprints; "his fortune gone" hedged after Jebb ("probably") and Todd ("may have been");
Dionysius's Attic standard is the Attic of Lysias's own day, not Plato's or Thucydides'; "127 more" given as Jebb's count of
1911; source 16 now *On Lysias* 29–30, where the opening is quoted; the *Republic* begins on the road, not at Polemarchus's
house; speech 6 "probably" a pamphlet (Lamb); Carey's edition "with the fragments", not "all".

## Isocrates (tlg0010), checked 2026-10-06

Article: `web/src/wiki/authors/tlg0010.ts` (31 sources). Tests: `ARTICLE=tlg0010 npx vitest run src/wiki/author-articles.test.ts`
(11 passed), `CORPUS=1 ARTICLE=tlg0010 npx vitest run src/wiki/author-articles.corpus.test.ts` (3 passed; a deliberate
misquote in a scratch copy was caught), `npx tsc --noEmit -p .` (clean).

**Confirmed and kept**
- Life: Norlin, Loeb *Isocrates* vol. 1 (1928), general introduction, read in the Internet Archive text: born 436, died 338 after
  Chaeronea; the ancient lives are "late compilations" mixing gossip and fact; speech-writing before the school (forensic speeches
  403–393, after Jebb); school "probably in the year 392"; Jebb accepts a Chios school, Blass thinks it "very dubious"; pupils
  Isaeus, Lycurgus, Hypereides, Ephorus, Theopompus, Speusippus, Timotheus; never delivered a speech, few discourses written for
  delivery; ten years on the *Panegyricus* "no doubt merely an exaggeration"; style: long periodic sentences "sometimes occupying a
  page", avoidance of hiatus, rhythm; through Cicero to modern times; the suicide "must be set down as fable"; the third letter "now
  generally accepted as genuine"; *To Demonicus* challenged by Benseler "on insufficient grounds"; *Against Euthynus* thought by some
  spurious. Bibliography: Drerup described 121 MSS and ten papyri; Urbinas (Γ) late 9th or early 10th century, all speeches except
  *Against Callimachus* and *Against Euthynus*, and all letters; Laur. 87.14 (Θ) 13th century; Vat. 65 (Λ) 1063; Papyrus
  Londinensis, 1st cent. AD, *Peace* §13 to the end; Papyrus Berolinensis, 2nd cent. AD, *To Demonicus* §18 to the end; two
  families, the vulgate contaminated by marginal notes; Bekker found Γ (Oxford 1822; Berlin 1823), now "generally agreed" the most
  trustworthy; Baiter and Sauppe (Zurich) follow Γ even more; editio princeps by Chalcondyles, Milan 1493; letters (Aldus) 1499
  without the letter to Archidamus; Wolf, Basel 1570, first modern commentary; Mustoxydis, *Antidosis* complete, Milan 1812;
  Benseler (Teubner 1851) "goes too far in removing hiatus everywhere".
- Norlin, Loeb vol. 2 (1929), Internet Archive: *Antidosis* written at 82, 354–353; *Panathenaicus* begun at 94 (342),
  interrupted by illness, issued 339 at 97.
- Jebb, *Encyclopaedia Britannica* 1911 (Wikisource, page transcriptions read): six forensic speeches 403–393; Aphareus' denial and
  Dionysius' answer; school about 392 near the Lyceum at 44; *Phaedrus* dramatic date about 410; *Panegyricus* 380, circulated at the
  Olympic festival; the leaders (Dionysius I, Archidamus III) and *Philippus* 346; *Peace* and *Areopagiticus* 355; *Against the
  Sophists* 391–390; philosophia = "culture"; Cicero and the prose of modern Europe; earliest authority for the suicide is Dionysius;
  an invalid of 98 dying naturally could have bred the legend; Photius knew 21 speeches; a lost *Art of Rhetoric*; glosses in the
  text; Benseler removed every hiatus "against even the best MS." and doubted *Against Euthynus* and *Trapeziticus*, partly for hiatus;
  Jebb's answer about early work.
- Wikipedia (Isocrates, wikitext): one of the ten Attic orators; the *Phaedrus* praise taken by some as sarcasm; philosophia as
  practical ethics, politics and speaking rather than Plato's dialectic; leaders including Dionysius I and Archidamus; *Philippus*
  346; the third letter's authenticity "doubted by some scholars"; nine letters, four questioned; Renaissance gifts of *To Nicocles*,
  Elizabeth I reading Isocrates with Ascham.
- Ancient texts in the Scroll (all quotations copied from `scripts/passage.ts`): [Plutarch], *Lives of the Ten Orators* 4.1 (father
  and flute-makers; teachers; Chios and nine pupils; about 100 pupils, Timotheus, Theopompus, Ephorus; seven years older than Plato;
  ten minas and ten thousand; the whetstones; 60 speeches, 25 genuine for Dionysius, 28 for Caecilius; ten or fifteen years on the
  *Panegyricus*; the death in the palaestra, the Euripides lines, fourth or ninth day, "for he could not endure the sight of Greece
  enslaved four times"). Dionysius, *On Isocrates* 1 (98 years; motive "together with the good fortunes of the city", while Philip's
  use of his fortune was unclear: our translation), 2 (avoids vowels side by side; better for reading than for use: our translation),
  18 (Aphareus; Aristotle's "bundles" of court speeches at the booksellers; Cephisodorus; some but not many). Plato, *Phaedrus*
  278–279. *Panathenaicus* 1–11 (antitheses and balanced phrases; 94 years; voice and assurance), 266–270 (the illness, three years,
  "lacked but three years of having lived a century"). *To Philip* 81. *Antidosis* 4–9 (the exchange, the trierarchy, "a true image",
  82 years), 59–66 (the clerk reads; §66 in the Scroll is only a pointer "Isoc. 8.25-56; Isoc. 8.132-145"), 161 (the lost
  patrimony), 270–272 (the wise man). *Against the Sophists* 14–15. *Panegyricus* 1–4 and 47–50. Letter 3, *To Philip* II 1–6.
- Cicero, *De oratore* 2.94 (Latin Library): "cuius e ludo tamquam ex equo Troiano meri principes exierunt" ("nothing but leaders",
  our translation).
- Milton, Sonnet 10 (*Poems*, 1645), John Milton Reading Room: "Kil'd with report that Old man eloquent".
- BMCR 2019.08.02 (Berlinzani on Vallozza 2017): meeting of 2011 towards a new OCT; Γ = Urb. gr. 111, Bekker's "revolutionary"
  edition; Θ = Laur. 87.14, Λ = Vat. gr. 65 (dated 1063); Γ abbreviates the self-quotations of *On the Peace* in the *Antidosis*, Θ
  and Λ give them in full; P.Kellis III Gr. 95; Colomo found the manuscripts' readings better in the passages studied, Menchelli the
  papyri's mostly preferable; *To Demonicus* "probably spurious" but early in the corpus and used in schools; the second family lost
  over three quarters of the *Antidosis* through damage above Λ; editio princeps Milan 1493 (Chalcondyles); Mathieu–Brémond 1928–62
  and Mandilaras 2003 as the current editions.
- Engels, review of Mandilaras (ExClass 12, 2008, PDF read): 3 vols, Saur 2003; 206 codices antiqui and 197 recentissimi; 109
  papyri; Γ's importance, but case-by-case decisions that raise the vulgate (Λ, Θ) and papyri; papyri in the hiatus debate;
  editio princeps 1493; letters by Musurus, Venice 1499, without letter 9; Drerup vol. 1 (1906) only; Mathieu–Brémond 4 vols
  1928–62; Loeb LCL 209, 229, 373 (1928, 1929, 1945); Papillon and Mandilaras hold all nine letters genuine; Martinelli Tempesta
  (Gnomon 2006) advises against using Mandilaras; Engels recommends it with reservations; *Ad Demonicum* first in the traditional order.
- Kellis: Monash exhibition (archived): codex found in a house, orations by Isocrates, "the oldest surviving complete set of these
  speeches". Pearse's page (drawn from the exhibition): *Ad Demonicum*, *Ad Nicoclem*, *Nicocles*; nine boards tied with string,
  written on both sides; "may have been written" with the account book, 360–380 AD; probably a local schoolmaster's copy. Zenon record:
  Worp and Rijksbaron, *The Kellis Isocrates Codex (P. Kell. III Gr. 95)*, Oxford, Oxbow, 1997.
- Onassis Library record of the 1493 Milan edition (Chalkokondyles, Scinzenzeler, 24 January 1493, the 21 speeches).
- UT Press page (Mirhady and Too, *Isocrates I*, 2000, series vol. 4) and BMCR 2005.02.43 (Papillon, *Isocrates II*, 2004, series
  vol. 7; political speeches and the nine letters).
- Scroll file headers (catalog.json `desc`): Norlin vol. 1 (1928) and vol. 2 (1929), Van Hook vol. 3 (1945), Harvard and Heinemann.

**Left out because it could not be confirmed**
- "Ran the most successful school of rhetoric in Athens for half a century" (only "over fifty years", Wikipedia citing a reader).
- Pliny's twenty talents for one speech (Wikipedia only; the *Lives* gives twenty talents from Nicocles for the speech in his honour).
- "Pairs clause against clause with μέν … δέ" (no source opened says so; the article uses Isocrates' own "contrasted and balanced
  phrases" instead).
- Plato's Academy founded "in response" to Isocrates (Wikipedia, sourced only to a course website).
- The names in the *antidosis* lawsuit (the *Lives* names Megacleides and Lysimachus as two separate suits; Jebb says Megaclides,
  disguised as Lysimachus in the speech).
- That he mourned Socrates in black (*Lives*; Norlin reports it doubted).
- The Demosthenes fee anecdote and the Sophocles anecdote of the *Lives* (true or not, not needed).
- Jason of Pherae / Alexander of Pherae among the leaders addressed (Jebb and Wikipedia disagree).
- A date for Baiter and Sauppe's edition (Norlin 1839, Jebb 1850).
- Whether the new Oxford text has appeared (only the 2011 meeting and the 2017 volume are confirmed).

**Corrected from the draft**
- Manuscript sigla: the draft had "Laurentianus 87.14 (Λ), Vaticanus gr. 936 (Θ)". Norlin, BMCR 2019 and Engels give Θ = Laur. 87.14
  and Λ = Vat. gr. 65 (1063); Vat. gr. 936 is a fourteenth-century manuscript (Jebb calls it Δ). Γ is dated "late 9th or early 10th
  century" (Norlin), as the draft said.
- "Γ often lacks words found in the other family": not found in that general form. Kept instead: Γ shortens the self-quotations in
  the *Antidosis* (BMCR 2019), and the vulgate is contaminated by marginal notes (Norlin, Jebb).
- "Opens his school c. 390": about 392 (Jebb, Norlin).
- "Antidosis ... at the age of eighty-two" (353): kept, dated 354–353 (Norlin vol. 2); Jebb gives 353.
- "Speeches 20 and 21 are debated": only 21 (*Against Euthynus*) and 17 (*Trapeziticus*) were found doubted (Benseler, via Jebb;
  Norlin for *Against Euthynus*).
- *To Demonicus* "widely thought not to be by Isocrates": marked {debated} (Norlin 1928 defends it; Menchelli, in BMCR 2019, calls it
  probably spurious).
- The death: the draft's "reportedly by starving himself, though a letter ... strikes a different note" is kept, split into a {legend}
  paragraph (the *Lives* and Dionysius, who give different motives) and a {debated} one (Norlin, Jebb, Wikipedia).
- "Aristotle, as Dionysius reports, said that booksellers hawked bundles of them": confirmed (*On Isocrates* 18) and quoted in Greek.
- Kellis codex "fourth-century CE": kept with the excavators' caution ("may have been written" 360–380).
- Editions: Mirhady and Too, Papillon, Mathieu–Brémond, Mandilaras, Norlin and Van Hook all confirmed; dates as in the draft.

**Weak points to revisit**
- Much of the life rests on Norlin (1928) and Jebb (1911), both old, and on the *Lives* and Dionysius, which are late; the modern
  OCD/Britannica articles (Mikalson, Cawkwell) could not be opened.
- The Kellis date and the "schoolmaster" rest on Roger Pearse's page, which summarises the Monash exhibition (and wrongly calls the
  speeches "previously lost"); the 1997 edition itself was not read.
- The Urbinas date is Norlin's (after Drerup); no modern catalogue entry (Vatican, Pinakes) was opened.
- Norlin's text is an OCR scan: sigla in it are garbled (Γ appears as "f", "l", "T"); they were read against BMCR 2019 and Engels.
- The papyrus count (109) is Mandilaras's of 2003; more have been published since (Engels names P.Oxy. 4717–4725).
- Wikipedia's "four letters questioned" has no named source (flagged "by whom?" on the page).

**Fact check (2026-10-06, a second, independent check; report pipeline/factcheck/isocrates.md):** 9 findings, each checked
against the cited page or passage, all corrected: the Kellis codex found in 1988, and the "schoolmaster" put as the project's
opinion, with the 4CARE database (artefact 430) added as a source; *Archidamus* addressee hedged ("perhaps Dionysius I"; Norlin
doubted); Drerup's 206 "codices antiqui", most before the fifteenth century; the *Art of Rhetoric* doubted even in antiquity;
the Scroll's text (Norlin's Loeb) does not reprint the letters; the *Panathenaicus* devices "he says he gave up in old age";
the Chios school "as some said"; the *Panathenaicus* finished 339 "or perhaps 338" (timeline mark approximate).

## Polybius (tlg0543), checked 2026-10-06

Article: `web/src/wiki/authors/tlg0543.ts` (54 sources). Not yet added to `ARTICLE_LOADERS` / `author-articles-all.ts`.

**Confirmed and kept**
- The opening question and the fifty-three years: Polyb. 1.1.5 (Greek «οὐχ ὅλοις πεντήκοντα καὶ τρισὶν ἔτεσιν», Shuckburgh's English); 3.1 (ending with "the fall of the Macedonian monarchy"; margin note "B. C. 220 to B. C. 168"); Paton/Edwards Loeb introduction on LacusCurtius (220–168; forty books, two introductory; only Books 1–5 complete). The question repeated at the end: 39.8.7.
- Forty books: 3.32.2 «βύβλους τετταράκοντα».
- Dates of life: Wikipedia, Polybius (c. 200–c. 118; born Megalopolis; urn of Philopoemen in 182; hipparch 170 or 169, the League's second-highest office; Lycortas strategos; 1,000 Achaeans; detained 167, released 150; with Scipio at Carthage 146; Corinth the same year; lost works; Pseudo-Lucian on his death; Habicht on the Timaeus polemic; Dionysius' verdict; Strabo and Athenaeus quote him; Diodorus, Livy, Plutarch, Arrian used him; Book 6 the most influential; the Polybius square; editions of Büttner-Wobst 1882–1904, Paton 1922–27, Walbank 1957/1967/1979). Oxford Classical Dictionary title page: "c. 200–c. 118 BCE".
- Edwards's Loeb introduction (1922): born about 208; urn in 183; embassy to Egypt 181; hipparch 169–8; Pydna 168; "no less than a thousand"; trial never came; released 151 with fewer than 300; Polybius more fortunate, allowed to stay in Rome in 167; 149 called in before the Third Punic War; by Scipio's side at Carthage 146; commissioners left him to settle the cities; statues at Megalopolis, Mantinea, Tegea, Olympia; Life of Philopoemen, Tactics, Numantine War; A of the eleventh century, F, M, the Constantine Excerpts; Moore 1965 in the bibliographical note. Thayer's note: the introduction's "XL.14" is XXXIX.8 in the Loeb text.
- Plutarch, Philopoemen 21.3 (the urn "was borne by Polybius, the son of the Achaean general") and 21.5–6 (Polybius defends Philopoemen's statues before Mummius and the commissioners).
- Polyb. 24.6.3–7 (envoy with Lycortas and Aratus, «νεώτερον ὄντα τῆς κατὰ τοὺς νόμους ἡλικίας»; Ptolemy dies, embassy never leaves); 28.6.9 (hipparch).
- Pausanias 7.10.11–12 (everyone Callicrates accused; "over a thousand"; Etruria; freed in the seventeenth year in the Greek, "Sixteen years later" in Jones's English; three hundred at most); 8.30.8–9 (Megalopolis relief, "roamed over every land and every sea"); 8.37.2 (the sanctuary of the Mistress, «εἰ Πολυβίῳ τὰ πάντα ἐπείθετο»). (8.9.1 Mantinea and 8.48.8 Tegea were read too; the list of statue sites is cited from Edwards.)
- Polyb. 31.23–24 (Greek; Shuckburgh numbers it 32.9–10): the loan of books, the praetor, Scipio "only just eighteen", blushing, the hand.
- Polyb. 35.6 = Plutarch, Cato 9.2–3 (Cato's joke; Odysseus and the Cyclops).
- Polyb. 38.21.1 (Scipio's words, Greek and Shuckburgh); 38.22 (= Appian, Punica 132, printed by Büttner-Wobst; "Polybius wrote this down just as he heard it"); Appian 19.132 in the Scroll with Horace White's translation.
- Strabo 8.6.23 (Polybius present at Corinth; dice on paintings; Aristides' Dionysus). Polyb. 39.5 (the commissioners, the cities' laws, honours in life and death).
- Lucian (attributed), The Long-Lived 22 (fall from his horse; eighty-two).
- Method: 1.4.1–5 (Fortune, universal history); Wikipedia, Histories (tyche as chance or goddess); 1.14.5–8 (truth; Greek and English); 1.2.8 «ὁ τῆς πραγματικῆς ἱστορίας τρόπος»; BMCR 2011.05.40 (Habicht: "political history or history of events"); 12.25e.1 (threefold); 12.28.1–5 (Plato inverted); 3.48.12 (the Alpine pass); 3.59.7–8 (travels in Libya, Iberia, Gaul, the outer sea); 3.4.13 (eyewitness, actor, director); 10.45.6–7 (fire signals: method of Cleoxenus and Democleitus, worked out by Polybius; five groups of five letters).
- Book 6: 6.3.5–8 (three kinds; the best is a mixture; Lycurgus); 6.4.6–13 (six forms; ὀχλοκρατία); 6.9.9–13 («αὕτη πολιτειῶν ἀνακύκλωσις»; Rome will decay by natural causes); 6.11.11–12 (no one could tell; consuls, Senate, people).
- Reception: Dionysius, De compositione verborum 4 (Greek only; "our translation"); Livy 30.45 *Polybius, haudquaquam spernendus auctor* (The Latin Library); Cicero, Rep. 1.34 *coram Polybio* and 2.27 *Polybium nostrum, quo nemo fuit in exquirendis temporibus diligentior* (The Latin Library); Wikipedia, De re publica (54–51 BC); John Adams, Defence (1787): The Founders' Constitution page ("we may see cause to differ widely from the judgment of Polybius") and the Constitution Society contents page (letters XXX and XXXI titled "Polybius").
- Transmission: J. M. Moore, CQ 16 (1966) 243–247, first page via Cambridge Core (A = Vat. gr. 124, copied by the monk Ephraim, tenth century, "quite probably" 947; subscription gives day and indiction but not year; two lacunae on successive pages at 1.2.7–8 and 1.3.3, the same in the other manuscripts). J. M. Moore, "Polybiana", GRBS 12.3 (1971), PDF read in full for these points: A "X cent. (A.D. 947?)"; nearly 300 errors in A not in the "Byzantine tradition"; A and φ "gemelli"; F = Urb. gr. 102, X/XI century, Excerpta Antiqua from I–XVIII; Excerpta Antiqua selected in the IX or X century; Book XVII probably lost by the X century; M = Vat. gr. 73 de Sententiis, P = Turonensis 980. Wikipedia, Constantinian Excerpts (Constantine VII 945–959; 53 volumes; at least 25 historians; four survive; Peirescianus at Tours; Vat. gr. 73 palimpsest overwritten in the 14th century; Polybius material found nowhere else). Wikipedia, List of editiones principes in Greek (Venice 1529, Lascaris, part of Book 6; Hagenau 1530, Obsopoeus, Books 1–5 with Perotti's Latin; Basel 1549, Hervagius; Antwerp 1582, Ursinus, de legationibus; Casaubon, Paris 1609). Wikipedia, Histories (Watson 1568 the first English translation; Waterfield 2010; Scott-Kilvert/Walbank 1979; Loeb numbers 128–161). Wikipedia, Christopher Watson (made from Perotti's Latin).
- Variants: BMCR 2011.05.40 (Paton's 1922 brackets at 1.2.7; the 2010 "still partly hypothetical" reconstruction, "for those living irresistible, for those to come insurpassable"; Büttner-Wobst a recension of Dindorf). BMCR 2013.06.04 (Books 28–39 pieced together from fragments, mostly Constantinian Excerpts; Book 37 a single sentence assigned by Büttner-Wobst; Walbank's reordering of the Pydna fragments of Book 29 not adopted; Kaibel's "golden shields" at 30.25 accepted by Paton, questioned by Walbank, retained; 236 unattributed fragments; Olson's renumbering). Paton's Book 30 on LacusCurtius ("ten thousand bore golden shields"). The Scroll's 30.25.5 (no golden shields), 37.1.1 (one sentence), 2.39.6 (Ὁμαρίου) with Shuckburgh's note (the manuscripts vary between ὁμάριος and ὁμόριος), Shuckburgh's notes on Book 17 (no fragments, after Hultsch) and Book 39 (including Dindorf's Book 40), and the observed difference in numbering (31.23–24 Greek against 32.9–10 English).
- Editions: the Perseus TEI headers (Büttner-Wobst, Teubner, Leipzig, "1893-", vols. 1–4; Shuckburgh, Macmillan, London and New York, 1889, 2 vols, note "Reprint Bloomington 1962"); revised Loeb vols. 1–2 (BMCR 2011.05.40, 2010) and vol. 6 (BMCR 2013.06.04; ECU library record: Paton, rev. Walbank and Habicht, ed. and trans. S. Douglas Olson, LCL 161, Harvard 2012).

**Left out because it could not be confirmed**
- Influence on Montesquieu, Locke and "the framers" in general (Wikipedia only); only John Adams is kept, from his own text.
- Polybius as a Stoic (Edwards's introduction only).
- His language: educated Koine, avoidance of hiatus, abstract vocabulary (no source opened).
- The date of Perotti's Latin translation; the editions of Schweighaeuser and Hultsch (mentioned only in Shuckburgh's notes, undated); the Budé edition.
- Dates of the papyri (Wikipedia names P.Oxy. 5268 and P.Ryl. 60 with no reliable date for the first).
- The Via Domitia (118 BC) as the last event mentioned (Wikipedia only, and the wording "seems").
- Polybius on the 189 campaign in Asia Minor; the Numantine campaign; a later visit to Egypt (Edwards, all hedged with "may").
- The Lilybaeum journey of 149 (36.11) and Polybius's remarks on his own name (36.12) were checked but cut for length.
- The garbled opening of 38.21.1 and of 1.2.8 in the Scroll's Greek (no source explains them).

**Corrected from the draft**
- "Books 1–5 survive complete in Vaticanus gr. 124 (A, tenth or eleventh century) and the manuscripts copied from it": Moore dates A to the tenth century, "quite probably" 947, and shows the other manuscripts of Books 1–5 descend from A's lost twin (φ), not from A. Edwards's 1922 date (eleventh century) is reported as the older view.
- "Books 6–18 ... Excerpta Antiqua in Urbinas gr. 102 (F, eleventh century)": F is of the tenth or eleventh century and has excerpts from Books 1–18 (Moore).
- "One of a thousand Achaean detainees, held in Italy without trial for some seventeen years": "over a thousand" (Pausanias), released in 151 (Edwards) or 150 (Wikipedia), in the seventeenth year (Pausanias' Greek) or after sixteen years (Edwards; Jones's translation). Marked as approximate.
- "Released ... 150", "carries the ashes ... 182", "hipparch ... 170": all given with the alternative year from Edwards.
- "In not quite fifty-three years (220–167 BCE)": Polybius's own end-point is the fall of the Macedonian monarchy, 168 (Edwards, 3.1); Wikipedia's Histories page says 220–167. The article says 168.
- "Paton, rev. Walbank and Habicht, 6 vols (2010–12)": volume 6 is also edited and translated by S. Douglas Olson.
- "Büttner-Wobst, 5 vols (Teubner, 1889–1905)": Wikipedia gives 1882–1904; the Scroll's file names vols. 1–4, "1893-". The article gives 1882–1904 and names the Scroll's volumes.
- "πραγματικὴ ἱστορία ('political and practical history')": Habicht's gloss, "political history or history of events" (BMCR), is quoted instead.
- The "Polybius square": his own text credits the method to Cleoxenus and Democleitus and says he worked it out further (10.45.6).
- "Influenced Montesquieu and the founders of the American republic": cut to John Adams, who discussed Polybius in two letters of the *Defence* (1787) and also said he differed from him.
- "Dies at eighty-two, reportedly after a fall from a horse": kept, but the source is named (a work under Lucian's name, thought to be Pseudo-Lucian).

**Weak points to revisit**
- Moore's CQ article was seen only as its first page through a fetch tool that summarises pages; the sentence that the other manuscripts share A's two gaps comes from that summary. The GRBS article (read as a PDF) supports the rest.
- The Oxford Classical Dictionary page gave only its title (the dates); the article itself would not open.
- Many life details rest on Wikipedia and on Edwards's 1922 introduction, which disagree by a year in several places (both are given).
- The printing history (1529, 1530, 1549, 1582, 1609) rests on Wikipedia's list (which cites the Catalogus Translationum and Momigliano); Watson 1568 on two Wikipedia pages (HathiTrust's record returned 403).
- The "golden shields": the Scroll's Büttner-Wobst text has no golden shields and Paton's English has them; that this is Kaibel's insertion rests on the BMCR review.
- Translators disagree at 38.22.3 (did Scipio name Rome?); the article reports both English versions and does not judge between them.

**Fact check (2026-10-06, a second, independent check; report pipeline/factcheck/polybius.md):** 9 findings, each checked against
the cited page or passage (Moore, GRBS 12 (1971) n. 42; BMCR 2013.06.04; Edwards's introduction and Thayer's note on LacusCurtius;
Polybius 10.45.7, 12.28, 35.6, 38.22 and Plutarch *Cato* 9.2 and Appian *Punica* 132 in the Scroll), all corrected: 39.8 is the
last surviving chapter, in Book 39 (Book 40 is lost); Book 17 is absent from the Scroll and the Byzantine excerpts, but Athenaeus
quotes two passages from it (Moore); Cato's joke has one witness, Plutarch, whose words the Scroll prints as Polybius 35.6;
"Did Scipio name Rome?" no longer marked debated: the Greek says he did (our translation), with White, against Shuckburgh;
Appian's "is said to have" wept; Walbank doubted the golden shields but later corrected himself (BMCR, after Habicht), the
reviewer still doubting; the timeline's Corinth entry credited to Strabo (Edwards doubts he saw the sack); the fire-signal
alphabet in five groups, the last one letter short, on five tablets; Polybius borrows the shape of Plato's saying.

## Plotinus (tlg2000), checked 2026-10-06

Article: `web/src/wiki/authors/tlg2000.ts` (31 sources). Not yet registered in `author-articles.ts` / `author-articles-all.ts`.
Tests: `ARTICLE=tlg2000 npx vitest run src/wiki/author-articles.test.ts` (11 passed); `CORPUS=1 ARTICLE=tlg2000 npx vitest run
src/wiki/author-articles.corpus.test.ts` (3 passed; a deliberately altered Greek quotation and an altered English one were both caught,
so the check is live); `npx tsc --noEmit -p .` clean.

What the library has: the *Enneads* (tlg2000.tlg001) in Volkmann's Teubner text, Greek only, numbered Ennead.treatise.chapter.
Porphyry's *Life of Plotinus* is **not** in the Scroll (Volkmann's file starts at I.1; the library's Porphyry has other works), and the
library's Eunapius is only a section on Libanius. So the *Life* is cited from the Internet Archive scan of Volkmann's vol. 1 (Greek) and
MacKenna's translation (Internet Archive), and Eunapius from Wright's Loeb translation on tertullian.org. All English quotations of
Plotinus and Porphyry are therefore in `outsideQuotes` (MacKenna's words, or "our translation"); the Greek of the *Life* is given
without guillemets, since the corpus test can only check Greek from the Scroll.

**Confirmed and kept**
- Life (Porphyry, *Life*, Greek in Volkmann's scan, English in MacKenna): "seemed ashamed of being in the body" (ἐῴκει μὲν αἰσχυνομένῳ, ὅτι ἐν σώματι εἴη, ch. 1); no talk of family, parents, homeland; refusal of a portrait, "an image of the image" (ch. 1); died at 66 at the end of Claudius' second year, born in Severus' thirteenth (ch. 2); in his 28th year (Greek εἰκοστὸν δὲ καὶ ὄγδοον) to philosophy at Alexandria, sad after the lectures, τοῦτον ἐζήτουν / "This was the man I was looking for", eleven years with Ammonius, Gordian's campaign at 39, Gordian killed in Mesopotamia, escape to Antioch, Rome at forty under Philip, ten years without writing (ch. 3); began writing about the first year of Gallienus, 21 treatises when Porphyry came (ch. 4); never re-read, weak eyes, spelling, writing "as though he were copying from a book" (ch. 8); guardian of children, no enemy in 26 years (ch. 9); Egyptian priest in the Iseum, Amelius and the new moon, ἐκείνους δεῖ πρὸς ἐμὲ ἔρχεσθαι (ch. 10); Porphyry's melancholy and Sicily (ch. 11); Platonopolis (ch. 12); style "concise, dense with thought, terse…" (ch. 14); four unions, Porphyry once at 68 (ch. 23); arrangement by subject after Andronicus, six sets of nine, three sections (ch. 24–26); illness, Zethus' estate, Eustochius from Puteoli, last words, the snake (ch. 2).
- SEP, Kalligas (2024): born in Egypt (204 inferred), Ammonius at 28 for eleven years, Gordian 243, Rome late 244, taught until 270; the *sunousiai* (commentaries read, difficulties, his own answer); writing began about ten years after reaching Rome, at about fifty; Porphyry with him about five years; style (associative, repetitions, unnamed interlocutor, hardly ever names recent sources, readers expected to know Plato and Aristotle); arrangement criticised as artificial; chronological table *Life* 4–6, some recent editors follow it; bibliography: H–S editio maior (Brussels and Paris, 1951–73, full account of the readings) and minor (Oxford 1964–82, "the standard critical edition"), Armstrong's Loeb (given as 1968–88), Gerson 2018, Kalligas' commentary (Princeton 2014, 2023; first in Greek, Academy of Athens).
- SEP, Gerson (2018, archived): 204/5–270; founder of Neoplatonism, a term of the early nineteenth century; Plotinus a Platonist; Rome in 245; Porphyry in 263, 21 treatises; perhaps an edition by Eustochius, all traces lost; Porphyry divided some treatises; the One, Intellect, Soul (simple, indescribable, beyond thinking; Intellect and the Forms; Soul as desire for external objects, its external activity nature; emanation not a temporal process); On Beauty the chronologically first treatise, beauty as form and image of the Forms; influence (Porphyry, Iamblichus; principal source of Platonism for Christianity, Islam, Judaism; Ficino's Latin of 1492; Taylor's English late eighteenth century; Colet, Erasmus, More, Cambridge Platonists, Hegel); MacKenna abridged by Dillon (Penguin 1991); Gerson 2018.
- SEP Porphyry (Emilsson): Porphyry in Rome 263, about five years, Sicily 268 on Plotinus' advice; edition of the *Enneads* with the *Life*, 301.
- SEP Neoplatonism (Wildberg): Augustine "intimately familiar with the writings of Plotinus and Porphyry".
- SEP Theology of Aristotle (Adamson): Plotinus translated into Arabic in the ninth century; the *Theology* the longest text; based only on Enneads IV–VI; influential under Aristotle's name.
- SEP Ficino (Celenza): the first full Greek-to-Latin translation of Plotinus.
- Glasgow Incunabula Project: Ficino's Plotinus, Florence, Miscomini, 7 May 1492, with commentary.
- Wikipedia, List of editiones principes: Plotinus, Petrus Perna, Basel, 1580, with Ficino's Latin. Zamora Calvo also names Perna's Basel edition of 1580.
- Wikipedia, Enneads: Porphyry split and joined texts to reach 54; ἐννέα, "nine"; the chronological numbers (I.6 = 1; III.8, V.8, V.5, II.9 = 30–33).
- Eunapius (Wright): "Lyco they call it"; "his books are in the hands of educated men, more so than the dialogues of Plato".
- Goulet-Cazé, Archai 5 (2010): Eunapius' exaggerations with some basis, early fifth century; Eusebius quotes IV.7 and V.1 (PE XI 17, XV 10, 22), written 312–322; the gap in IV.7 in all Ennead manuscripts from 8.28 (after σωφροσύνη καὶ δικαιοσύνη) to 85.49, filled from Eusebius, printed today as 8¹–8⁵; J, M, V patched part of it from Eusebius; the scholion at IV.4.29 (manuscripts of families w, x, y) on Eustochius' and Porphyry's division; Henry's theory of a Eustochian edition, her own view (and Kraus's) that the gap is an accident of the Porphyrian tradition; Arabic text older than the archetype (Kraus, D'Ancona), useful with Eusebius for IV.7; archetype part of the "Philosophical Collection" at Constantinople (note 54); IV.3 and IV.4 one treatise cut mid-sentence (Schwyzer); Harder (1936) on III.8, V.8, V.5, II.9 as one anti-Gnostic treatise.
- Zamora Calvo, Synthesis 25 (2018): the last words passage (Life 2.23–29 H-S), "one of the most controversial" in later Greek (after Most 2003); readings τὸ ἐν ἡμῖν θεῖον (traditional, all editions after Perna to 1953), τὸν ἐν ὑμῖν θεόν (marginal variants in A, E, R; Perna 1580; Henry 1953; H-S² 1964; Armstrong 1966), Igal's and Schwyzer's views and the three possible addressees; Eustochius doctor and pupil; snake as image of the soul; Apollo's oracle in 51 hexameters (Life 22).
- BMCR 2021.12.07 (Smith): no reliable Greek text before Henry–Schwyzer; maior 1951–73, minor 1964–82; Henry's search from 1932 at 26; Zürich, four months each summer for nearly thirty years, photocopies of the ten major manuscripts; Page revised MacKenna; Schwyzer's κράσεις → βράσεις at IV.4.28, Armstrong preferring Bréhier with an apologetic footnote.
- Classical Review 34.2 (1984): OCT vol. III, Enneas VI, Oxford University Press, 1982 (Blumenthal).
- Internet Archive record: *Plotini Opera* vol. 1, L'Édition Universelle, 1951.
- Patras library record: Armstrong, Loeb 440–445 and 468, Harvard, 1966–1989; vol. I = Porphyry's Life and Ennead I.
- MacKenna's note on the text: Volkmann (Teubner, Leipzig, 1883); Creuzer's three-volume Oxford edition of 1835.
- Scroll file header: Volkmann, Teubner, Leipzig, 1883–84.
- Greek quotations copied from `passage.ts`: V.1.1 (title and opening), VI.9.1, IV.8.1, VI.9.11 (end), V.3.17 (end), I.6.1, I.6.8, I.6.9 (twice), IV.7.8 (σωφροσύνη καὶ δικαιοσύνη, and the chapter running on with the Eusebius passage on harmony and entelechy), IV.4.28 (θηρία πρὸς τὰς κράσεις, the only κράσεις in the chapter).
- LSJ (site's copy): κρᾶσις "mixing, blending"; βράσις "boiling".

**Left out because it could not be confirmed**
- Lycopolis as birthplace: Eunapius says "Lyco"; Lycopolis appears in Guthrie's translation of the Suda (not used) and Wikipedia gives two possible towns. Only "Lyco" is kept.
- The draft's "a single archetype of Porphyry's edition" as a stated fact about all manuscripts is kept only as Goulet-Cazé's archetype; family names, sigla and dates of the manuscripts are left out.
- Theiler's theory that IV.1 also stands at the end of III.9 in all manuscripts and got its number from Ficino: reported by Goulet-Cazé, but too intricate to check or explain safely.
- The Brisson–Pradeau French translation: Kalligas gives 2002–2020, Gerson 2002–2010.
- Thomas Taylor's titles and dates (only Gerson's "late eighteenth century" is kept; an Internet Archive copy of *Five Books of Plotinus*, 1794, has no translator in its record).
- MacKenna's first publication date (London, 1917?): only the Boston printing in the Internet Archive record (1918) was seen, so no date is given in the editions list.
- The exact year of Porphyry's edition: Emilsson gives 301, Harvard's blurb (in the Patras record) "between 301 and 305"; the article says "about 301".
- Guthrie's 1918 translation (Gutenberg) was read but not used: it adds glosses (e.g. "Lycopolis, now Syout") into Porphyry's text and gives Plotinus' age on reaching Rome as 50.
- The Olympius star-spell story and the Carterius portrait: confirmed in the Life, cut for length.

**Corrected from the draft**
- "a later writer, Eunapius, names Lycopolis" → Eunapius says "Lyco".
- "he once asked … to found a city of philosophers, 'Platonopolis'" → to *rebuild* a ruined town in Campania said to have been a city of philosophers (Life 12).
- "began writing only at about fifty, in 253/4" → "at about fifty, some ten years after reaching Rome"; the year 253/4 itself was not found in a source opened (Wikipedia has "c. 253"), so the timeline marks 254 as approximate.
- "Settles in Rome and begins teaching" (244) → late 244 (Kalligas) or 245 (Gerson), marked debated.
- "published them around 301" → kept as "about 301" (Emilsson 301; Harvard 301–305).
- "Armstrong, 7 vols (Loeb, 1966–88)" → the two sources disagree (library record 1966–1989; both Stanford entries 1968–88); both are given.
- Henry–Schwyzer "editio minor (OCT, 1964–82)" → confirmed (Kalligas, BMCR, the 1982 OCT vol. III); Wikipedia's "1964–1984" not used.
- "An ancient note (on Ennead IV.4.29) mentions an edition by … Eustochius, and long passages quoted by Eusebius may derive from it" → the note mentions Eustochius' *copies*; whether there was an edition is open, and Goulet-Cazé argues Eusebius used Porphyry's edition.
- "the great treatise … divided among III.8, V.8, V.5 and II.9" → confirmed (Harder 1936, via Goulet-Cazé); also IV.3–IV.4 one treatise.
- "The Arabic 'Theology of Aristotle' is an independent, if very free, witness" → independent witness older than the archetype (Goulet-Cazé, after Kraus and D'Ancona); "very free" left as Adamson's "interpretation … not just a translation" (not quoted in the article).
- Added from the sources: the real textual problems (the last words, the IV.7 gap filled from Eusebius, the Eustochius note, Schwyzer's βράσεις).

**Weak points to revisit**
- The *Life* is cited from scans and an old translation, not from the Scroll; the Greek of the *Life* in the article (ἐῴκει μὲν αἰσχυνομένῳ…, τοῦτον ἐζήτουν, ἐκείνους δεῖ πρὸς ἐμὲ ἔρχεσθαι…, the last words) was read in the OCR of Volkmann's 1883 scan (some letters garbled, e.g. ἐξήτουν for ἐζήτουν, iota subscripts lost) and normalised; Zamora Calvo's quotation of Henry–Schwyzer agrees for the last words. If the *Life* is ever added to the library, these should be re-cited there.
- MacKenna's 1918 printing says Plotinus turned to philosophy "at twenty"; the Greek has his twenty-eighth year, which is what the article says (MacKenna is not cited for the age).
- Goulet-Cazé is read in a Portuguese translation; her note on the archetype reads "na segunda metade do ES século" (garbled century), so no date is given for the "Philosophical Collection".
- Volkmann's IV.7.8 was checked only by its content (harmony, entelechy, the run-on after σωφροσύνη καὶ δικαιοσύνη) against Goulet-Cazé's description; the exact boundaries of 8¹–8⁵ in his text were not compared.
- The κράσεις reading: BMCR places Schwyzer's emendation at IV.4.28, line 32; the Scroll has no line numbers, and κράσεις occurs once in its chapter 28, so that occurrence is assumed to be the one meant.
- The SEP Gerson entry is cited from the Fall 2024 archive URL, which serves the 2018 text; the live entry is now Kalligas's.

**Fact check (2026-10-06, a second, independent check; report pipeline/factcheck/plotinus.md):** 9 findings, each checked against
the cited page or passage (MacKenna's *Life* in the Internet Archive text, Kalligas and Gerson in the Stanford Encyclopedia,
Adamson on the *Theology of Aristotle*, the Olomouc library record), all corrected: "twenty-eighth year" footnoted to the Greek
and Kalligas only (MacKenna has "At twenty"); Porphyry's stay "some five years (six, as he counts them)"; the lost pages of IV.7
are also reflected in the Arabic *Theology*, and the gap begins inside chapter 8; Armstrong's Loeb 1966–88 (Olomouc record of
LCL 468, 1988, added as a source); the last words told "as Eustochius later told Porphyry"; Kalligas's "often" and "sometimes"
and his "live dialogue with an unnamed interlocutor" restored; Gerson's "in their formative periods" restored; 204 or 205 given
as our reckoning of Porphyry's "thirteenth year of Severus"; the last words "have been called" one of the most controversial
passages (Most, quoted by Zamora Calvo).
