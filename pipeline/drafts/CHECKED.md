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

## The New Testament (tlg0031), checked 2026-10-06

Article: `web/src/wiki/authors/tlg0031.ts` (68 sources). Not yet registered in `author-articles.ts` / `author-articles-all.ts`.
Tests: `ARTICLE=tlg0031 npx vitest run src/wiki/author-articles.test.ts` (11 passed); `CORPUS=1 ARTICLE=tlg0031 npx vitest run
src/wiki/author-articles.corpus.test.ts` (3 passed; an altered Greek quotation and an altered English one were both caught, so the
check is live); `npx tsc --noEmit -p .` reports nothing in this file (its only errors are in `scripts/zz-align-old.ts`, which this work did not touch).

What the library has: all 27 books (tlg0031.tlg001–027) in Westcott and Hort's Greek (Perseus file headers: *The New Testament in the
Original Greek*, New York, Harper and Brothers, 1882–1892) with the World English Bible (headers: Michael Paul Johnson, Rainbow
Missions, revision of the ASV of 1901). For Mark there are also two First1KGreek files: the INTF's transcription of **Mark chapter 1 in
Codex Sinaiticus** (British Library Add. 43725) and Mark chapter 1 in Sahidic Coptic (Coptic SCRIPTORIUM). Eusebius' *Ecclesiastical
History* (Greek, with Lake and Oulton's Loeb English) and Aratus' *Phaenomena* (Greek only) are in the Scroll too.

A finding worth knowing for the reader: the WEB "has been edited to conform to the Greek Majority Text New Testament where there are
significant differences in manuscripts" (WEB FAQ), while Westcott and Hort follow above all Vaticanus and Sinaiticus. So the Scroll's
two columns disagree at real variants: Mark 1:1 ("the Son of God" in the English only), Mark 1:2 ("in Isaiah the prophet" against "in
the prophets"), Romans 16:25–27 (in the English after 14:23, and 16:24 has a verse only in the English), Revelation 1:4 ("from God, who
is…", the scribes' smoothing of ἀπὸ ὁ ὤν), Mark 16 (the English has only the longer ending). The article uses this.

**Confirmed and kept**
- Wikipedia, New Testament: 27 books in Koine; gospels, Acts, letters, Revelation; mid-to-late first century, no consensus on the latest;
  Ehrman's "between the years 50 and 120 C.E." (quoted from Ehrman 1997, p. 8); seven undisputed letters and six disputed; Hebrews
  anonymous, Pauline authorship generally rejected; gospels anonymous, names fixed by the mid-second century; Marcan priority;
  Acts the sequel to Luke; "gospel" = εὐαγγέλιον, good news; Jesus spoke Aramaic; Irenaeus' *Against Heresies* about 180 and the four
  gospels; Marcion about 140 (Luke and ten letters); Pauline letters circulating, perhaps collected, by the end of the first century;
  Eusebius about 300; Athanasius' letter of 367 the first list of the present canon; Hippo 393 "may have been" the first council,
  Carthage 397 and 419; Vaticanus and Sinaiticus among the earliest extant Christian Bibles; more than 5,800 Greek, 10,000 Latin and
  9,300 other manuscripts; translations into Latin, Syriac and Coptic; the two explanations of NT style (Jewish Greek; everyday Koine
  like the papyri letters, receipts and petitions); earliest manuscripts late second to early third century, possibly P52.
- Wikipedia, First Epistle to the Thessalonians: 49–51 by a majority; the earliest extant Christian text.
- Wikipedia, book pages (infoboxes and text): Mark around 70; Matthew c. 80–90 (and Papias c. 60–130); Luke c. 80–90; Acts c. 80–90,
  same author as Luke, some date it later (NT page); John 90–100; Revelation about 95, Domitian 81–96, the title ἀποκάλυψις, the only
  apocalypse in the NT.
- Wikipedia, Epistle to the Hebrews: its Greek "more polished and eloquent than any other book of the New Testament".
- Wikipedia, Authorship of the Pauline epistles: Paul names secretaries in several letters, a common Greco-Roman practice.
- Wikipedia, Koine Greek: ἡ κοινὴ διάλεκτος, "the common dialect"; spread with Alexander; lingua franca; the Septuagint (third century
  BC); NT authors follow the Septuagint for over half their Old Testament quotations; the historical present 151 times in Mark.
- Wikipedia, Koine Greek grammar (after Morwood): dual eliminated, optative rarer, wider uses of ἵνα, higher ratio of καί to δέ at
  sentence starts under Semitic influence.
- Wikipedia, Language of the New Testament: Mark translates Aramaic phrases (talitha kum and others).
- Wikipedia, Luke 1: Karris, "finely crafted, periodic Greek" (from the New Jerome Biblical Commentary, 1990, p. 678); ἐπειδήπερ not
  elsewhere in the NT or the Septuagint. Our own count in the Scroll's Greek agrees: ἐπειδήπερ once, in Luke 1:1.
- Our count (script over the 27 Perseus Greek files, accents ignored): εὐθύς 41 times in Mark, 12 times in all the other books.
- Mounce, Zondervan Academic blog: ἀπό "should" take the genitive; three nominatives at Rev 1:4; Wallace's "the first and worst
  grammatical solecism in Revelation"; the Exodus 3:14 echo, nominative as a title; scribes adding θεοῦ.
- LSJ (site's copy): διαθήκη (will, testament; compact, covenant, frequent in the LXX; καινὴ δ. Luke 22:20); εὐαγγέλιον (good tidings,
  good news); εὐθύς (of time, "straightway, forthwith"); ἄλλως ("otherwise"); ἀπό ("Prep. usually with Gen."); εἰμί (1 pl. ἐσμέν, epic
  and Ionic εἰμέν).
- Wikipedia, Aratus: Paul quotes the fifth line of the *Phaenomena* in Acts 17:28.
- Scroll passages, all copied from `passage.ts`: Luke 22:20; Romans 16:22; Galatians 6:11; Mark 5:41; John 1:1; Mark 1:12; Luke 1:1–4;
  Revelation 1:4; Acts 17:28; Aratus, *Phaenomena* 1–5; Mark 16:8–20 and the shorter ending (ΑΛΛΩΣ), both in ⟦ ⟧; John 7:52–8:12 in
  ⟦ ⟧; 1 John 5:6–8 (no Comma in Greek or English); Revelation 13:18; Mark 1:1–2; Romans 14:23 (English with the doxology) and
  16:24–27 (Greek with the doxology, 16:24 empty).
- Eusebius, *Ecclesiastical History* in the Scroll: 3.25.1–7 (the holy tetrad of the Gospels; recognized and disputed books; Revelation
  in both); 3.39.15–17 (Papias: Mark Peter's interpreter, "wrote accurately all that he remembered, not, indeed, in order"; the woman
  accused of many sins in the Gospel according to the Hebrews); 5.8.2–6 (Irenaeus: Mark "the disciple and interpreter of Peter", Luke
  "a follower of Paul"; the number "found in all the good and ancient copies"; Revelation seen "towards the end of the reign of Domitian").
- Athanasius, Festal Letter 39 (CCEL, NPNF 2.4, "For 367"): the 27 books, the seven Catholic Epistles named, "fountains of salvation".
- Wikipedia, Biblical manuscript: Gregory's four groups (1908); Metzger's 1992 figures for the *Iliad* (457 papyri, 2 uncials, 188 minuscules).
- Wikipedia, Westcott and Hort: 1881; heavy reliance on Vaticanus and Sinaiticus; later critical editions share their preference.
- eBible.org WEB FAQ: update of the ASV of 1901, edited to conform to the Greek Majority Text; public domain.
- Wikipedia, Rylands Library Papyrus P52: credit-card size, John 18; Roberts 1935; 100–150 (Roberts), 125–175 (Orsini and Clarysse),
  some allow later dates; "generally accepted as the earliest extant record".
- Wikipedia, Papyrus 46: Chester Beatty; 175–225 or early third century. Papyrus 75: Luke and John; traditionally third century, possibly
  early fourth. Jesus and the woman taken in adultery: P66 and P75 "c. 200 or 4th century" / "early 3rd century or 4th century".
- Wikipedia, Nomina sacra: holy names shortened with an overline. The INTF transcription shows ιυ χυ and the corrector's υυ θυ marked
  as nomina sacra.
- Wikipedia, Codex Vaticanus: fourth century; in the Vatican Library since at least the fifteenth century; catalogue of 1481; breaks off
  at Hebrews 9:14, lacks 1–2 Timothy, Titus, Philemon, Revelation.
- Wikipedia, Codex Sinaiticus: Add MS 43725; oldest complete NT; "one of the earliest and most complete manuscripts of the Bible";
  codex the forerunner of the modern book; Tischendorf 1844 and 1859; sold by the Soviet Union to the British Museum in 1933; four libraries.
  Codex Sinaiticus Project site: four institutions; conservation, digitisation, transcription.
- INTF transcription (First1KGreek on GitHub, and the local copy): Mark 1:1 first hand without υἱοῦ θεοῦ, corrector 1 adds it.
- Wikipedia, Codex Bezae: fifth century; Greek and Latin; Cambridge; principal Greek witness of the Western text; Acts nearly 8% longer.
- Wikipedia, Complutensian Polyglot: NT printed 1514; publication 1520, distribution 1521; Alcalá. Novum Instrumentum omne: Froben,
  Basel, 1516; first published; rushed, many errors; last six verses of Revelation back-translated from the Vulgate. Textus Receptus:
  the back-translation; Elzevir preface 1633, *textum ergo habes, nunc ab omnibus receptum*. Chapters and verses of the Bible: Estienne's
  verse numbers, 1551, the system in almost all modern Bibles.
- Wikipedia, Novum Testamentum Graece: Nestle 1898; NA28 2012, text edited by the INTF; UBS5 2014, same text; NA has more variants.
  Editio Critica Maior: INTF Münster; every manuscript; completion by 2030; NA28 and UBS5 follow it for the Catholic epistles; volumes
  for Mark, Acts and the Catholic Letters listed.
- Wikipedia, Mark 16: Sinaiticus and Vaticanus end at 16:8, Vaticanus with a blank column; longer ending in the Byzantine majority;
  shorter ending rare, both together in six Greek manuscripts; 16:9–20 almost universally rejected; debate whether 16:8 intended.
- Wikipedia, Jesus and the woman taken in adultery: not in P66, P75, ℵ, B; Bezae the first Greek manuscript with it; relocations after
  John 21:25, Luke 21:38, John 7:36; broad consensus that it is an interpolation; Papias via Eusebius, possibly another story; NA28/UBS
  double brackets.
- Wikipedia, Johannine Comma: the KJV wording; mainly Latin; earliest Greek manuscript fourteenth century; Erasmus omitted it in his
  first two editions and added it in 1522.
- Wikipedia, Number of the beast and Papyrus 115: 616 in P115 (P. Oxy. 4499, c. 225–275) and Codex Ephraemi; Irenaeus knew and rejected it.
- Wikipedia, Mark 1: Wasserman, omission of "Son of God" accidental; Mark 1:2 "in Isaiah the prophet" in B D L Δ ℵ, "in the prophets"
  in the Textus Receptus and many other manuscripts.
- Wikipedia, Romans 14 (majority Byzantine placement after 14:23; some manuscripts both places or none) and Epistle to the Romans
  (doxology in different places; P46 after chapter 15).
- Internet Archive record: Metzger, *A Textual Commentary*, Stuttgart, Deutsche Bibelgesellschaft, 1994, companion to UBS4.
  bartehrman.com: Metzger and Ehrman, *The Text of the New Testament*, 4th ed., OUP, April 2005.

**Left out because it could not be confirmed**
- The draft's breakdown "some 140 papyri, around 320 majuscules, about 2,900 minuscules, some 2,400 lectionaries" and "nearly 6,000":
  the INTF pages (Liste, blog) returned 403; only Wikipedia's "more than 5,800" is kept.
- "Estimates run to several hundred thousand variant readings": no source opened gives it (Wikipedia quotes only "more than 30,000
  different readings" in 150 manuscripts of Luke, from a dictionary; not used).
- "1 Thessalonians, probably Galatians" as the earliest letters: only 1 Thessalonians is dated in a source opened.
- "Luke opens with a single polished period… as does the Letter to the Hebrews": only Hebrews' polished Greek in general is kept.
- The Alexandrian / Western / Byzantine text types as a classification, with P75 and Bezae as members: only Bezae as the chief Greek
  witness of the "Western" text is kept, and "Byzantine" only where the Romans 14 page uses it.
- The Editio Critica Maior "begun in 1997" and CBGM details (computer comparison of manuscripts): the ECM page gives no start date;
  the CBGM page did not exist; left out of the article.
- K. and B. Aland, *The Text of the New Testament* (2nd ed. 1989): no record opened. The UBS fifth edition's own page and the German
  Bible Society's NA history page returned 403 (dates kept from Wikipedia's Novum Testamentum Graece page).
- The Muratorian fragment (dates range from about 170 to the late fourth century): left out for space.
- 1 Corinthians 15:33 as a quotation of Menander: in the Scroll the Greek and the English of that verse are misaligned (the Greek line
  shows only μὴ πλανᾶσθε), so it could not be quoted cleanly.
- "Survives in more manuscripts than any other ancient text": in Wikipedia only as a quotation of Geisler and Nix; replaced by the
  number of manuscripts and Metzger's *Iliad* figures.

**Corrected from the draft**
- "ἀπὸ ὁ ὤν… where classical Greek requires a genitive after ἀπό" → LSJ: ἀπό "usually" with the genitive (dative in Arcadian and
  Cypriot, accusative in later Greek); the article says "usually", adds Wallace's verdict and Mounce's explanation, and notes the
  scribes' θεοῦ, which the Scroll's English follows.
- "Mark … moves it along with εὐθύς, some forty times" → confirmed by our count in the Scroll's Greek: 41 in Mark (12 elsewhere).
- "Mark tells his story in the present tense" → the historical present, 151 times (Wikipedia, Koine Greek).
- "The 'Western' text of Acts … almost a tenth longer" → "nearly 8 per cent longer" (Wikipedia, Codex Bezae).
- "this collection includes a Coptic version of Mark" → only chapter 1, in Sahidic Coptic; the Scroll also has Mark 1 in Codex Sinaiticus.
- "Westcott and Hort (1881) — the Greek text used here" → kept, but the Scroll's files name the New York printing (Harper and
  Brothers, 1882–1892).
- "World English Bible (a public-domain revision of the ASV)" → kept, adding that its NT follows the Greek Majority Text, which is why
  the Scroll's columns sometimes disagree.
- "P46 and P66, P75, around 200" → P46 175–225 or early third century; P66 about 200 and P75 third century traditionally, both with
  recent arguments for later dates (marked as such).
- "P52 … long dated to the first half of the second century… some scholars now allow a later date" → kept with the figures: Roberts
  100–150, Orsini and Clarysse 125–175, some later still.
- "Mark (approximate date) 70; Matthew and Luke–Acts 85; John and Revelation 95" → Mark about 70; Matthew, Luke, Acts 80–90 (Acts
  later by some); John 90–100; Revelation about 95; all marked as debated.
- "The Johannine Comma … none of which is in the earliest witnesses" → kept with detail: earliest Greek manuscript fourteenth century;
  Erasmus added it in 1522.
- "the ending of Romans, whose closing doxology stands in different places" → confirmed, with P46 (end of 15) and the Byzantine
  majority (after 14:23), and shown in the Scroll's own two columns.
- "Codex Sinaiticus and Codex Vaticanus, fourth century" → kept; "Nestle–Aland 28th edition, 2012" and "UBS 5th edition, 2014" kept.
- Added from the sources: Papias and Irenaeus on the gospels (from Eusebius in the Scroll), Eusebius' recognized and disputed books,
  Athanasius' "fountains of salvation", the Tertius greeting, Paul's "large letters", the Aratus quotation in Acts with Aratus' own
  epic εἰμέν, Mark 5:41's Aramaic, the 666/616 variant, Mark 1:1 in Sinaiticus with its corrector, Erasmus' back-translated end of
  Revelation, Stephanus' verse numbers.

**Weak points to revisit**
- Most modern facts rest on Wikipedia pages (read as wikitext); several of those pages carry "citation needed" or "verify source" tags
  in places not used here. Better sources (Metzger–Ehrman, the INTF Liste, publisher pages for NA28/UBS5) should replace them if they
  can be opened; the German Bible Society and INTF sites returned 403 to every request.
- Ehrman's 50–120 is quoted through Wikipedia's footnote to Ehrman 1997, not from the book.
- The Wallace quotation is taken from Mounce's blog, not from Wallace's grammar itself (p. 63 according to Mounce).
- The εὐθύς count includes every form spelled εὐθύς (accents ignored); an adjectival εὐθύς ("straight") would be counted too, but
  none was noticed in the hits.
- The INTF Mark 1:1 reading was read in the XML (first hand empty, corrector 1 with υυ θυ), not in the manuscript photographs.
- NA28's year (2012) and UBS5's (2014) rest on Wikipedia's Novum Testamentum Graece page alone.
- The `checked` date is 2026-10-06 as instructed; the work ran past midnight into 2026-10-07.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/new-testament.md):** 13 findings, each checked against
the cited passage or page (Eusebius 3.39.15, Luke 22.20, Acts 17.28 and Aratus 1–5 in the Scroll; Wikipedia, Papyrus 115, Editio
Critica Maior, Authorship of the Pauline epistles; Mounce's post), all corrected: the ECM sentence footnoted to sources 51 and 45;
Paul used secretaries, one names himself (Tertius); Papias passes on what "the Presbyter" said; Wallace's "solecism" with his
reading of the words as a title; P115 "apparently" reads 616, "one of the oldest manuscripts of Revelation"; the cup "after supper",
with Westcott and Hort's double brackets noted; the ECM volumes include Revelation; dating "most in the first century, some
scholars a few well into the second"; the papyri footnoted to P52 and P75; διαθήκη as covenant in the Septuagint; Acts quotes the
opening of Aratus' line 5; the Septuagint "begun" in the third century BC; ἐπειδήπερ footnoted to Luke 1.1–4.
Two glitches in the Scroll's Greek noted by the checker are errors in the Perseus source file itself, not in the article: 1 John 5.7
holds «ἀλήθεια» from the end of 5.6, and John 8.11 repeats «οὐκ ἐγείρεται» from 7.52.

## The Septuagint (tlg0527), checked 2026-10-06

Article: `web/src/wiki/authors/tlg0527.ts` (44 sources). Not yet registered in `author-articles.ts` / `author-articles-all.ts`.

**Confirmed and kept**
- What it is, the name, LXX, a collection by many translators from different Hebrew copies; Pentateuch translated by Jews of Ptolemaic Egypt, "probably in or around Alexandria", mid or late 3rd century BC; the rest "presumably" in the 2nd century BC, "over the next two to three centuries", some perhaps translated twice; Koine with Semitisms, style from literal to paraphrase; Greek and Aramaic the common languages of Jews: Wikipedia, Septuagint (wikitext read).
- The extra books (Tobit, Judith, Wisdom, Sirach, Baruch, Letter of Jeremiah, 1–4 Maccabees, 1 Esdras, Psalms of Solomon, Odes, Psalm 151, additions to Esther and Daniel); manuscripts not uniform in contents: Wikipedia, Septuagint. Psalm 151 "supernumerary", in most copies: Wikipedia, Psalm 151; its heading «ἔξωθεν τοῦ ἀριθμοῦ» copied from the Scroll (Psalms 151.1).
- The legend: Letter of Aristeas (courtier of Ptolemy II; Demetrius of Phalerum; six from each tribe, 72; 72 days); Josephus paraphrase c. AD 93; Hody's Oxford dissertation of 1685; Bagnall on Demetrius as a client of Ptolemy I; Metzger's "most scholars" conclusion; dates "3rd or early 2nd century BC" and Hody's 170–130 BC: Wikipedia, Letter of Aristeas.
- Josephus in the Scroll: Ant. 1.12 «μόνα τὰ τοῦ νόμου» / Whiston "only the books of the law"; 12.56 «ἓξ ἀπὸ φυλῆς ἑκάστης»; 12.57 «τῶν ἑβδομήκοντα πρεσβυτέρων» (Whiston's English adds "[two]"; our translation used); 12.100 the book of Aristaeus; 12.107 "seventy-two days"; 12.108–109 the request that it not be altered.
- Philo, Life of Moses 2.37 (Yonge: "like men inspired", "as if some unseen prompter had suggested all their language to them"), 2.41 (yearly festival on Pharos, Jews and many others): Scroll.
- Irenaeus (in Eusebius, HE 5.8.10–15, Scroll): Theodotion and Aquila's «ἰδοὺ ἡ νεᾶνις ἐν γαστρὶ ἕξει»; «Πτολεμαῖος ὁ Λάγου»; seventy elders separated, identical translations of all the books "from beginning to end". The phrase «τῆς κατὰ τοὺς ἑβδομήκοντα ἑρμηνείας» is Eusebius' own introduction (attributed to him, not to Irenaeus). Against Heresies around 180: Wikipedia, Irenaeus.
- Ben Sira's grandson: arrival in the 38th year of Euergetes = 132 BC if Euergetes II (Swete, Introduction, 2nd ed. 1902, Internet Archive full text); his words imply the Law, Prophets and other books were already in Greek (Swete); NETS translation of the Prologue (B. G. Wright, PDF) for the quotations.
- Psalm numbering (Heb. 9+10 = LXX 9, etc.): Swete. Shown in the Scroll: Greek Ps 22.1 «Κύριος ποιμαίνει με» beside WEB Ps 22 ("My God, my God…"); WEB 23.1 "Yahweh is my shepherd: I shall lack nothing".
- Hebraisms δύο δύο (Gen. 6.19) and σφόδρα σφόδρα (Exod. 1.12), "emphatic adverbs doubled after the Hebrew manner": Swete's list; both checked in the Scroll's Greek.
- Genesis 1.3 and Exodus 3.14 (Greek and WEB) copied from the Scroll; "I am the one who is" is our translation.
- Christian use, NT writers "freely used" the LXX with exceptions (Jerome's examples), Jews' turning away around the 2nd century (association with a rival religion "may have" made it suspect), Aquila preferred; Jerome's Vulgate from Hebrew, Augustine's criticism; Eastern Orthodox use where Greek is liturgical: Wikipedia, Septuagint. Matthew 1.23 Greek and WEB from the Scroll; Isaiah 7.14 (Swete's Greek; Ottley's English) from the Scroll.
- Vaticanus (4th c.) and Alexandrinus (5th c.) the oldest nearly complete OT copies; complete Hebrew texts c. 600 years later; pre-LXX Hebrew manuscripts at Qumran including 4QJer-b, 4QJer-d; translators consult the LXX where the MT is unclear: Wikipedia, Septuagint. Jeremiah: Greek about one eighth shorter, arranged differently, both forms at Qumran, most scholars think the Hebrew behind the Greek older: Wikipedia, Book of Jeremiah; NETS Jeremiah intro ("opinio communis" that the Greek rests on a Hebrew text substantially at variance with MT).
- WEB based on the ASV (1901) and the Biblia Hebraica Stuttgartensia, public domain: worldenglish.bible.
- Transmission: Aquila fl. 130 (Wikipedia, Aquila of Sinope); Symmachus, Theodotion (Wikipedia, Septuagint and Hexapla); Hexapla before 240, its six columns, asterisks/obeli, Field 1875 (Wikipedia, Hexapla); Eusebius HE 6.16.4 (Lake–Oulton English in the Scroll, quotation copied); Hexaplaric recension, Lucian and Hesychius per Jerome; papyri of the 2nd and 1st centuries BC; daughter versions (Old Latin, Old Church Slavonic, Syro-Hexaplar, Armenian, Georgian, Coptic) (Wikipedia, Septuagint). P. Rylands 458 (Rahlfs 957, Deut., mid-2nd c. BC, eight fragments, 1917): Wikipedia page and Manchester Digital Collections ("eight fragments … from a papyrus roll of Deuteronomy"). Sinaiticus mid-4th c., Tischendorf 1844, Saint Catherine's, British Library: Wikipedia, Codex Sinaiticus.
- Print: Complutensian, Alcalá, Ximenes, last OT volume dated 10 July 1517, papal sanction 22 May 1520, Pope's copy 1521; Aldine February 1518 (Andreas Asolanus); Sixtine 1587 (printed 1586, published May 1587) based on B with gaps supplied; Holmes and Parsons (Oxford, 1798–1827) with collations: Swete; Wikipedia, Complutensian Polyglot (printed 1514–17, published 1520–21) and Septuagint ("textus receptus"). Swete's portable text "taken from the Vatican MS., where this MS. is not defective, with the variations of two or three other early uncial MSS.", committed to him 1883, vols 1887, 1890, 1894, 2nd ed. 1895–99: Swete, Introduction. Old Greek Daniel first printed at Rome 1772 "e singulari Chisiano codice": Swete.
- Rahlfs 1935, Vaticanus/Sinaiticus/Alexandrinus, Hanhart revision 2006, most widespread edition (Wikipedia, Rahlfs' edition); Göttingen series founded 1908, 26 of 36 volumes by February 2025, Psalmi cum Odis 1931 (Wikipedia, Septuaginta: Vetus Testamentum Graecum); NETS, Pietersma and Wright, OUP 2007, second printing 2009 (NETS website).
- Daniel: Old Greek c. 100 BC and Theodotion, both with the additions, Dan. 3:24–90 in Greek (Wikipedia, Additions to Daniel); OG supplanted by TH by the 1st or 2nd century CE, Papyrus 967 the most important OG manuscript (NETS Daniel intro, R. T. McLay); Jerome's statement that the churches read Theodotion's Daniel and "only one Greek copy has survived" (Swete, 1902). Old Greek Dan. 3.25 «στὰς δὲ Ἀζαρίας προσηύξατο οὕτως» from the Scroll.
- Genesis 1.8 «καὶ ἴδεν ὁ θεὸς ὅτι καλόν» absent from the WEB beside it (Scroll); Origen, Letter to Africanus (Scroll 1.5) says "God saw that it was good" at the firmament is not in the Hebrew, and notes «πολλὴν μετάθεσιν καὶ ἐναλλαγὴν» in Jeremiah.
- Jeremiah in the Scroll: Greek 25.14–15 begins the oracle on Elam («Συνετρίβη τὸ τόξον Αἰλάμ») while the WEB at 25.15 has "take this cup of the wine of wrath at my hand". Order of the oracles: Swete.
- Sirach: Hart's text of MS 248 opens with a preface beginning «Ἰησοῦς οὗτος Σιρὰχ μὲν ἦν υἱός» (Scroll, folded into 1.1); NETS Sirach intro: the alternative prologue only in MS 248, from the Synopsis Scripturae Sacrae falsely attributed to Athanasius; MS 248 an important witness to GKII with added proverbs; critical editions (Ziegler, NETS) open with the grandson's prologue.
- Editions: the Scroll's TEI headers (Swete vols dated 1901, 1896, 1905; Hart 1909; Ottley 1904; WEB); Internet Archive records for Hart (Cambridge, 1909) and Ottley (two volumes: translation of Alexandrinus, Greek text).

**Left out because it could not be confirmed**
- «καὶ ἐγένετο» as a characteristic Hebraism (not found in the sources read; Swete's own examples used instead).
- "The Septuagint in turn shaped the language of the New Testament."
- "Hundreds of later manuscripts" (no count found).
- Ethiopic as a daughter version (not in the list read).
- "Most of the remaining books available in Greek by the 1st century BC" as a timeline mark.
- Reign dates of Ptolemy II (Wikipedia pages give 285–247 and 281–246).
- Philo's date for the Life of Moses (only Wikipedia's "c. AD 15").
- Brenton's translation (1844 and 1851 both given), the Talmud's version of the legend (only Wikipedia's quotation seen), Augustine as the first to call it *Septuaginta*.

**Corrected from the draft**
- "Translating his grandfather's book around 132 BCE": he *arrived* in Egypt in the 38th year of Euergetes, i.e. 132 BC only if Euergetes II is meant (Swete: "as is probable"); the translation came after.
- "Aldine edition (1518–19)": February 1518 (Swete, colophon).
- "The Complutensian Polyglot prints the first complete Septuagint (1514–17; issued in the 1520s)": the OT volumes were finished in July 1517 and the work published 1520–21.
- "The Pentateuch was in fact translated in Alexandria": "probably in or around Alexandria" (Wikipedia).
- "The New Testament writers usually quote it": softened to "freely quoted it, though not every quotation matches it" (Wikipedia, with Jerome's examples).
- Draft's Greek name «Οἱ Ἑβδομήκοντα» replaced by the attested ancient phrase in the Scroll, Eusebius' «τῆς κατὰ τοὺς ἑβδομήκοντα ἑρμηνείας».
- "Swete's edition largely prints Codex Vaticanus with variants": kept, in Swete's own words.
- "Daughter translations into Latin, Coptic, Ethiopic, Armenian": replaced by Wikipedia's list.

**Weak points to revisit**
- Much rests on Wikipedia (Septuagint, Letter of Aristeas, Jeremiah, Isaiah 7:14, Hexapla, codices) and on Swete's Introduction of 1902, which is old (e.g. on Old Greek Daniel he knew one manuscript; Papyrus 967 is now the chief witness, per NETS).
- The 132 BC date depends on identifying Euergetes as Euergetes II; marked debated in the timeline.
- NETS Daniel's "supplanted by the first or second century CE" sits awkwardly with Wikipedia's mid-2nd-century date for Theodotion (scholars discuss an earlier "proto-Theodotion"; not explored here).
- The Scroll's Sirach "praef" is folded into the reference 1.1, so the citation points to 1.1.
- "One behind" for the Psalm numbering is inferred from Swete's list of joins and splits; true for the bulk of the Psalter (Heb. 11–113 and 117–146), not every psalm.
- `npx tsc --noEmit -p .` reports 7 errors, all in `web/scripts/zz-align-old.ts` (an untracked script not part of this work); none in the article.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/septuagint.md):** 12 findings, each checked against
the cited passage or page, all corrected: the Psalm 22 paragraph rewritten, since the reader now lines the Psalms up by psalm
(fixed the same day, lib/tei/versification.ts), and the "not even on the same passage" footnote moved to Jeremiah 25 and Daniel 3;
the Scroll has two Greek Sirachs, Swete's with the grandson's prologue; Tischendorf took 43 leaves of Sinaiticus to Leipzig in 1844
and saw the rest in 1859; the Complutensian is the first printed whole Septuagint (Psalters from 1481, Swete); Matthew's ἕξει is
Codex Alexandrinus's reading (Ottley's Greek in the Scroll), Swete's text has λήμψεται; Josephus lets the translation be corrected
before it is fixed; Irenaeus' king keeps the elders apart (χωρίσας); the Letter of Aristeas third to mid-second century BC; the other
books over "two to three centuries"; Origen's Letter to Africanus §4; Susanna and Bel are separate texts in the Scroll, and source 40
now points at Theodotion's Daniel 3.23–26.

## Lucian of Samosata (tlg0062), checked 2026-10-06

Article: `web/src/wiki/authors/tlg0062.ts` (43 sources). Not yet registered in `author-articles.ts` / `author-articles-all.ts`.
Tests: `ARTICLE=tlg0062 npx vitest run src/wiki/author-articles.test.ts` (11 passed) and
`CORPUS=1 ARTICLE=tlg0062 npx vitest run src/wiki/author-articles.corpus.test.ts` (3 passed; a deliberately broken quotation
was caught, so the check really runs). `npx tsc --noEmit -p .` shows no errors in this file (the only errors are in
`web/scripts/zz-align-old.ts`, which is not part of this work).

**Confirmed and kept**
- Dates and career: Harmon, Loeb vol. 1 introduction (Internet Archive scan `lucianha01luciuoft`): born "not long before 125
  A.D.", died "not long after 180"; travelling rhetorician through Ionia, Greece, Italy and Gaul, wealth and fame; eighty-two
  pieces, "not a few" disputed; "Certainly spurious are Halcyon, Nero, Philopatris, and Astrology", the "Ungrammatical Man"
  (Soloecista) among those "generally considered spurious"; Vaticanus 90 "the best manuscript", its order adopted by Rabe and
  Nilén; "a hundred and fifty manuscripts … none too good"; γ group (Vat. 90, Harl. 5694, 9/10th century) and β group
  (Vindob. 123, 11th century?); first edition Florence 1496, J. Lascaris, L. de Alopa; Jacobitz 1836–41 with the scholia;
  Rabe's scholia 1906; Nilén 1906–; a new text made beyond the True Story; "conjectures have been admitted with
  considerable freedom".
- Wikipedia, Lucian: c. 125 – after 180; native language probably Syriac; Attic of the Second Sophistic; no contemporary
  mention; Russell ("no more to be trusted than the voyage to the moon"; Socrates as sculptor); Swain ("a fine but rather
  apocryphal version"); Richter on the "Syrian" as a device; Statuary and Culture in the Dream; Casson's Athens c. 165 for
  about a decade; Egypt "in his fifties", perhaps under Commodus, then disappears; over eighty works, more than most
  classical writers; comic dialogue as his proudest invention (Double Indictment); Helm 1906 on Menippus; Philosophies for
  Sale as a slave-market; Glycon cult confirmed by coins, statues, inscriptions; Peregrinus at the Olympics of 165;
  Syrian Goddess doubted and restored (Richter); Photius and the ninth-century humanists; school curriculum from the
  eleventh century; Suda; rediscovery c. 1400; Utopia, Gulliver, Timon of Athens, Botticelli's Calumny.
- Scroll passages (all quotations copied from `passage.ts`): How to Write History 24; Fisherman 19; Dream 1–6; Double
  Indictment 27 and 33; Peregrinus 35–36; Alexander 55; Apology 12; Dialogues of the Dead 18.1 (Greek only: the English
  shown beside it belongs to a different dialogue, Macleod's numbering differs); Menippus 21; True Story 1.4, 1.9–1.10,
  2.47; Court of Vowels 9; Lexiphanes 22–23; Lover of Lies 35–36; [Lucian], The Ass 55; Scholia 14.47 (the scholiast on
  the ending; Alexander of Nicaea's subscription, siglum Γ2) and 55.13 (the note headed Ἀρέθα, «ματαιότατε Λουκιανέ»).
- Rabe, Scholia in Lucianum 1906, preface (IA `scholiainlucianu00rabe`): Γ = Vaticanus gr. 90, parchment, 9th–10th century,
  353 leaves; scholia partly by the scribe, partly c. mid-10th century by Alexander bishop of Nicaea, called to
  Constantinople by Constantine Porphyrogenitus; E = Harleianus 5694, parchment, 10th century, 134 leaves, 59 works lost,
  text by Baanes, scholia by Arethas; B = Vindobonensis gr. 123, 11th century.
- Pinakes record of Harley 5694 (Gamillscheg: copied by the notary Baanes for Arethas of Caesarea).
- Wittek, Scriptorium 6 (1952), first page on Persée: numbering after the order of Vat. gr. 90 (Rothstein, Nilén, Rabe,
  Mras); nos. 81–86 certainly not Lucian's; no papyrus known to him; nearly 170 post-1600 manuscripts excluded; Nilén's
  edition unfinished (works 1–19, fascicles of 1906 and 1923).
- Delhez's review of Marquis, Budé vol. XII (2017), Les Études classiques: Peregrinus burnt himself at the end of the
  Olympic Games of 165; the work "dans l'ensemble bien transmise", variants between the main branches few and of little
  significance.
- Brignone, Lexis 43 (2025): Vat. gr. 90 parchment, tenth century, head of one branch; some works with a single-branch
  tradition; Par. gr. 2957 (N), first half of the 15th century, in Italy by 1424 (Traversari's letter), Ass purged, Peregrinus
  omitted (the scribe says why on f. 126r), one Courtesans dialogue omitted; nine manuscripts in the "Rezension N"; the Ass
  "ritenuta spuria dalla maggior parte degli studiosi".
- Macleod, Loeb vol. 8 introduction to The Ass (IA `lucianhar08luciuoft`): Photius cod. 129 in Macleod's translation ("one
  might almost call him another Lucian"; Lucian probably abridged Lucius of Patras); both the Ass and Apuleius from the lost
  Metamorphoses, the Ass an abridgement; most editors reject it; Macleod: Lucian's own hand probably had some share.
- Wikipedia, The Golden Ass (Lucius of Patrae; the Ass an epitome). Wikipedia, Amores (Bloch 1907, Jope 2011, growing
  acceptance in the 2010s). Wikipedia, Philopatris (Julian; Niebuhr's Nicephorus Phocas 963–969; Heraclius; Baldwin 1982).
- Suda On Line, lambda 683: "The story goes that he was killed by dogs"; eternal fire with Satan.
- BnF BP16_100767: Luciani … compluria opuscula, Erasmus and More, Paris, Josse Bade, 13 November 1506; More's Philopseudes.
  Monzó Gallo, Ágora 26.1 (2024): the 1506 volume; eleven reprints 1506–1535 against four of Utopia in More's lifetime.
- Wikipedia, The Sorcerer's Apprentice: Goethe 1797; Eucrates' tale in the Lover of Lies the oldest known version; Dukas
  1897; Fantasia 1940 with Mickey Mouse. Wikipedia, A True Story: best-known work; "the first known text that could be
  called science fiction". Wikipedia, List of editiones principes in Greek: Lucian 1496, Alopa, Florence, Lascaris.
- LSJ θάλασσα, "Att. θάλαττα" (site copy and Perseus).
- Editions: Perseus file headers (Harmon Loeb 1–5, 1913–36; Kilburn 6, 1959; Macleod 7, 1961; Jacobitz, Teubner 1909 and
  1913; Fowler 1905; Smith 1892); Loeb 8 vols to 1967 (Wikipedia); Macleod OCT 1972 and 1987 (Kyushu University record;
  AbeBooks publisher's description: vol. IV completes the set and indexes all four); Bompaire Budé vol. I 1993 (Classical
  Review 45.1, 1995, Anderson); Hopkinson 2008 and Nesselrath's "lengthy, scathing review" of Macleod (BMCR 2009.08.11).

**Left out because it could not be confirmed**
- "Papyri are few, but they confirm that the collection is ancient": Wittek (1952) knew of none. Search results named
  P.Oxy. 69.4738 (Dialogues of the Gods 10.1–2, third century) and P.Oxy. 52.3683 (Halcyon, attributed to Plato, Lucian or
  Leon), but papyri.info asked for a bot check, Trismegistos failed on its certificate and the Oxford portal refused access.
- "Scribes sometimes 'corrected' Lucian's deliberate Atticisms": no source found.
- "Takes an administrative post in Roman Egypt" in 175: no source gives that year (Wikipedia: perhaps under Commodus,
  180–192; Harmon: died not long after 180). The article says "late in life".
- "Kept him on school reading lists into the twentieth century": not found; only Byzantine schooling (from the eleventh
  century) is kept.
- Antioch in 162/3, his marriage and son, the post in Gaul (Wikipedia after Casson): not needed and not checked further.
- Marlowe's "face that launched a thousand ships" as a paraphrase of the Helen dialogue: the Wikipedia sentence has no
  citation.
- Alexander of Nicaea as owner of Vat. gr. 90 "in the first decades of the tenth century" (a search summary only); Rabe's
  "about the middle of the tenth century" is used instead.
- The exact year of Arethas' notes in E: the OCR of Rabe's preface is garbled at that point.
- The date of Macleod's second OCT volume (the Kyushu record says 1993, probably a reprint).
- Marquis's RHT article (2013) on the texts with a single-branch tradition and on E's lost contents: Brepols refused access;
  only the search-engine summary was seen, so it is not cited.

**Corrected from the draft**
- "a barbarian in speech, dressed in the Assyrian manner": the Greek (Double Indictment 27) has βάρβαρον ἔτι τὴν φωνήν …
  εἰς τὸν Ἀσσύριον τρόπον; Harmon's English, quoted, says "a foreign accent … in the Syrian style". The passage is marked
  debated (Richter reads the Syrian as a device).
- "Settles in Athens; the great dialogues" (165) and the Dream story: kept only as Casson's reconstruction and Lucian's own
  account, marked debated.
- "Harleianus 5694 … written for Arethas and annotated by him": confirmed and made precise (copied by the notary Baanes;
  scholia by Arethas; 59 works lost).
- "Vindobonensis phil. gr. 123 (B, eleventh century)": Harmon puts a question mark after the century; Rabe gives saec. XI.
- "The Philopatris, a Byzantine work of the tenth century": the date is disputed (Julian, Nicephorus Phocas, Heraclius;
  Baldwin against the Byzantine dates); marked debated.
- "Amores … not by Lucian": now marked debated (Bloch 1907 against; Jope 2011 for; acceptance growing).
- "The differences between the two families are mostly small": kept, on Marquis's authority (via Delhez).
- "Erasmus and Thomas More publish Latin translations of several dialogues" (1506): confirmed (Paris, Josse Bade,
  13 November 1506), with More's Lover of Lies.
- Draft editions: Jacobitz's Teubner dates given as the Scroll's printings (1909, 1913); Macleod OCT 1972–87 confirmed;
  Bompaire Budé 1993– confirmed.

**Weak points to revisit**
- Much of the life rests on Wikipedia's Lucian page (mostly after Casson 1962) and on Harmon's introduction of 1913; both
  are older or secondary. Lucian's own statements are labelled as his own account.
- The Sigma/Tau joke is explained with LSJ's θάλασσα / θάλαττα; no modern commentary on the Court of Vowels was opened.
- The identification of Rabe's Γ2 (the hand of the True Story subscription) with Alexander rests on Rabe's sigla list
  ("Γ Vat. 90 (Γ2: scholia ab Alexandro scripta)"), read in an OCR scan.
- The note «ματαιότατε Λουκιανέ» is printed by Rabe under the heading Ἀρέθα; it closes with the siglum R (Palatinus 73), so
  the article says only that Rabe prints it under Arethas' name.
- "Harmon's Ungrammatical Man" = Soloecista = the Scroll's "The Purist Purized" (Ψευδοσοφιστής ἢ Σολοικιστής) is an
  identification made from the titles, not stated by a source.
- The Loeb vol. 8 date (1967) comes from Wikipedia; the IA scan's metadata gives a wrong year.
- `checked` is set to 2026-10-06 as instructed, though the work ran past midnight into 2026-10-07.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/lucian.md):** 8 findings, each checked against the
cited passage or page (Rabe's scholia 14.47 and 55.13 in the Scroll; Harmon's Loeb vol. 1 in the Internet Archive text; Wikipedia,
Lucian and The Sorcerer's Apprentice; the TEI headers), all corrected: the "most foolish Lucian" note survives in Palatinus gr. 73
(R), not in E; Harmon thought the Trial in the Court of Vowels "probably not by Lucian", and his added "Consonants at Law" restored;
Parisinus gr. 2957 "probably" in Italy by 1424; Alexander of Nicaea corrected Γ with his brother Jacob, metropolitan of Larissa;
Casson's Athens decade "one modern reconstruction"; the Dream cited 1–14; Dukas wrote an orchestral piece on Goethe's poem; the
Scroll's Greek is Harmon's for vols 1–5, Jacobitz's for the later works with the Loeb Greek of vols 6–7 beside it.

## Flavius Josephus (tlg0526), checked 2026-10-06

Article: `web/src/wiki/authors/tlg0526.ts` (46 sources). Not yet added to `ARTICLE_LOADERS` / `author-articles-all.ts`.
Tests: `ARTICLE=tlg0526 npx vitest run src/wiki/author-articles.test.ts` (11 passed); `CORPUS=1 ARTICLE=tlg0526 npx vitest run
src/wiki/author-articles.corpus.test.ts` (3 passed); `npx tsc --noEmit -p .` shows no error in this file (its only errors are in an
untracked scratch file, `web/scripts/zz-align-old.ts`, not part of this work).

**Confirmed and kept**
- Self-description, the first version in his own language for the "upper barbarians", the Greek "translation": War 1.1–1.3 (Greek and
  Whiston). The echo of Thucydides in War 1.4 («μεγίστου τοῦδε τοῦ κινήματος» against Thuc. 1.1.2 «κίνησις γὰρ αὕτη μεγίστη»):
  Thackeray, Loeb 203 introduction (1927), both passages read in the Scroll.
- Birth in the first year of Gaius: Life 5; "A.D. 37-38": Thackeray, Loeb 186 introduction (1926). (Wikipedia's infobox has c. 36,
  after Mason.) Priestly family, first of the 24 courses, Hasmonean descent through his mother: Life 1–2; Wikipedia, Josephus.
- Education (14, 16, the three schools, Bannus, three years, Pharisees at 19): Life 7–12. Voyage to Rome after his 26th year, the
  shipwreck (about 600 swam all night, about 80 saved), Aliturus, Poppaea: Life 13–16; "the age of 26 or 27 in the year 64": Thackeray.
- Galilee: War 2.568 (general of both Galilees) against Life 29 (sent with two other priests to make the troublemakers lay down
  arms); Thackeray: "We have two accounts of this period, both biased and in some details inconsistent" (quoted).
- Jotapata: forty-seven days (War 3.406; Wikipedia, Siege of Yodfat; Thackeray "the forty-seven days' siege"), fell July 67
  (Thackeray); the pit and the cave with forty men of rank (War 3.341–342); the lots and "whether we must say it happened so by chance,
  or whether by the providence of God" (War 3.387–391); the Josephus problem and Smallwood's verdict (Wikipedia, Josephus, quoting her
  introduction to Williamson's translation).
- The prophecy (War 3.399–408: the private audience, «ἐγὼ δὲ ἄγγελος ἥκω σοι μειζόνων», «σὺ Καῖσαρ, Οὐεσπασιανέ, καὶ αὐτοκράτωρ, σὺ
  καὶ παῖς ὁ σὸς οὗτος»); Suetonius, Vespasian 5.6, Loeb translation (1914) on LacusCurtius ("Josephus by name, as he was being put in
  chains...").
- Freed in 69, the chain cut with an axe at Titus' suggestion: War 4.622–629 (πελέκει διέκοψε τὴν ἅλυσιν); Thackeray (July 69, "one of
  the first acts of the new Emperor"). The name Flavius: Wikipedia.
- Siege of Jerusalem: interpreter and mediator (Thackeray); hated by both sides, the sacred books, his brother and fifty friends,
  about 190 freed from the Temple (Life 416–419). Rome: lodging in Vespasian's former house, citizenship, pension, Domitian's tax
  exemption (Life 422–429).
- Seven books of the War and twenty of the Antiquities: Eusebius HE 3.9.3 («ἐν ἑπτά»); Eusebius HE 3.9.2 on the statue in Rome and
  the library (paraphrased in the timeline). Wikipedia, The Jewish War (seven books).
- The War's Aramaic first version lost; the Greek no literal translation, "practically rewritten"; published probably 75–79; Titus'
  imprimatur: Thackeray (Loeb 203); Life 363 ("he subscribed his own hand to them, and ordered that they should be published").
- Antiquities: creation to the twelfth year of Nero (Ant. 20.259); finished in the thirteenth year of Domitian and his 56th year
  (20.267); "A.D. 93-94" and the counterpart to Dionysius' twenty-book Roman Antiquities: Thackeray, Loeb 242 introduction (1930).
  Life as an appendix answering Justus of Tiberias: Thackeray (Loeb 186); Life 430 (dedication of "all this treatise of our
  Antiquities"). Against Apion: two books, purpose (Ap. 1.1–3), "numerous quotations from lost writings" (Thackeray).
- His Greek: Ant. 20.263 (pronunciation; Greek and Whiston); Ap. 1.50 «χρησάμενός τισι πρὸς τὴν Ἑλληνίδα φωνὴν συνεργοῖς» (our
  translation) against Whiston's "assist me in learning the Greek tongue"; Thackeray's theory of the assistants (Atticistic style,
  avoidance of hiatus, the Life his own words, Ant. 17–19 a "slavish imitator of Thucydides"), given as his theory.
- Testimonium (Ant. 18.63–64, Greek and Whiston); Origen, Against Celsus 1.47 («ἀπιστῶν τῷ Ἰησοῦ ὡς Χριστῷ»; no English in the
  Scroll, so the Greek only, paraphrased); Eusebius HE 1.11.7–8; Feldman's Loeb note (Loeb 433, 1965: arguments for and against, "our
  text represents substantially what Josephus wrote, but that some alterations have been made by a Christian interpolator");
  Wikipedia, Josephus on Jesus (consensus of partial authenticity since the late 20th century; minority view of forgery; Agapius and
  Michael the Syrian brought to light by Pines in 1971; the Arabic does not blame the Jewish leaders; the Syriac "he was believed to be
  Christ"; Whealey 2008; Jerome "thought to be"; John the Baptist passage accepted by almost all scholars; James passage largely
  accepted). James: Ant. 20.200; Feldman ("few have doubted").
- Masada: War 7.389–406 (Eleazar, the lots, 960, two women and five children, the Romans' discovery); Wikipedia, The Jewish War
  (73/74); Wikipedia, Siege of Masada (single source; breach of the wall; Shaye Cohen "incomplete and inaccurate"; Magness: archaeology
  cannot prove or disprove).
- Why he matters: Wikipedia, Josephus (chief source next to the Bible for the Second Temple period; Jewish distrust; Ritter's
  "Josephus is, however, to be used with great care."); Wikipedia, The Jewish War ("the only extensive eyewitness narrative of the
  revolt to survive antiquity"); Wikipedia, Josephus on Jesus (copied by Christian monks).
- Transmission: Wikipedia, Josephus on Jesus (about 120 Greek manuscripts, 33 before the 14th century; Jews not known to have preserved
  him); Brent Nongbri's blog (the Vienna papyrus leaf G 29810, "usually said to have been produced in the third century"); Thackeray,
  Loeb 186 (Life: P = Palatinus gr. 14, 9th or 10th century; Against Apion: one imperfect 11th-century manuscript, L = Laur. 69.22, all
  others copies; the lacuna 2.52–113 supplied by the Latin made by order of Cassiodorus; ed. pr. Basel 1544 "derived in part from some
  MS. unknown to Niese"; Niese's editio maior 1887–89 and minor 1888–95; Naber, Teubner, 1888–96; Niese's sections against the older
  chapters); Thackeray, Loeb 203 (War: two families PA(ML) and VR(C); readings of the inferior type already in Porphyry; Hegesippus
  about 370; a Latin version known to Cassiodorus); Thackeray, Loeb 242 (bisection of the Antiquities; Latin by order of Cassiodorus,
  "cent. v or vi"); Wikipedia, The Jewish War (one abbreviated and one full Latin War); Wikipedia, Cassiodorus (Vivarium; Institutiones
  530s–550s). The Latin gap is visible in the Scroll: Niese's Against Apion runs in Latin from the middle of 2.51 to the middle of 2.113.
- Print: Wikipedia, List of editiones principes in Greek (1544, Froben and Episcopius, Basel, ed. Arlenius, with 4 Maccabees);
  Wikipedia, Arnoldus Arlenius (manuscripts in Mendoza's library); Whiston's title page (1737, "according to Havercamp's accurate
  Edition") on penelope.uchicago.edu; Wikipedia, Josephus (Whiston "enormous popularity", "often the book (after the Bible) that
  Christians most frequently owned"; the Münster edition); Wikipedia, Benedikt Niese (1885–1895, numbering still most used).
- Variants: Feldman's notes on 18.118 (manuscripts ἤρθησαν "aroused"; Eusebius and the Slavonic ἥσθησαν "overjoyed"; Niese and
  Schürer adopted Eusebius' reading; Eisler's view; Feldman's text follows the manuscripts) checked against the Scroll's Niese text
  (ἥσθησαν) and Whiston ("moved [or pleased]"); Feldman's note on 20.200 (Origen and Eusebius cite a passage blaming the fall of
  Jerusalem on James's death that is not in Josephus) with Origen 1.47 («Ἰακώβου τοῦ δικαίου»); Wikipedia, Slavonic Josephus (Popov
  1866, Eisler 1926, rejected) and Thackeray (the additions on John, Christ and the early Christians; his reserved report of Eisler);
  Thackeray (most manuscripts title the War Περὶ ἁλώσεως; at Ant. 20.263 cod. A and the epitome add καὶ ποιητικῶν μαθημάτων, absent
  from the Scroll's text); Ant. 20.268 «ἐν τέσσαρσι βίβλοις» against Whiston's "three books" (observed in the Scroll; Thackeray's
  "four books").
- Editions: Scroll TEI headers (Niese, Berlin: Weidmann, vols 1–6, 1885–1895; Whiston, Auburn and Rochester, NY: Alden and Beardsley,
  1856); Internet Archive records and full texts of the Loeb volumes 186 (1926), 203 (1927), 210 (1928), 242 (1930), 410 (Marcus and
  Wikgren, 1963), 433 (Feldman, 1965); G. J. Goldberg's review of the Brill Josephus Project (ed. Steve Mason; vol. 3, Feldman, 2000).

**Left out because it could not be confirmed**
- The Latin Antiquities "made for Cassiodorus" in 550 as an exact date: no source gives a year; kept as approximate ("cent. v or vi" in
  Thackeray; the Institutiones were written from the 530s into the 550s).
- Whiston's translation as "the most widely read version for two centuries": only Wikipedia's "enormous popularity" is kept.
- "Jewish War completed (c. 75–79)": Thackeray gives 75–79 for publication, "commonly regarded"; Wikipedia says 78 in one place and
  about 75 in another. Kept as "probably between 75 and 79".
- Dates for the Life and Against Apion: Thackeray puts both after AD 100 (after the death of Agrippa II, dated 100 by Photius);
  Wikipedia gives about 94–99 and about 97. Left out of the article; only "after 94" and "probably around 100" for his death.
- Cassius Dio's account of the prophecy (66.1): Book 66 is not in the Scroll and no translation was opened.
- The Penguin Jewish War (Williamson, revised by Smallwood): only Wikipedia's mention was seen.
- The precise passage of the Vienna papyrus (War 2.576–579, 582–584) and Feldman's view that it differs from all of Niese's
  manuscripts: seen only on Roger Pearse's blog, not in a scholarly source; Trismegistos and papyri.info were behind bot checks.
- Leoni, "The Text of Josephus's Works: An Overview", JSJ 40 (2009): only the abstract could be read.
- The Antiquities drawing on the Greek Bible and on "sources now lost": Thackeray says it used the Septuagint, but this was cut for
  length.

**Corrected from the draft**
- "37–c. 100 CE": birth in the first year of Gaius, AD 37 or 38 (Life 5; Thackeray); death unknown, after 94 (Ant. 20.267),
  probably about 100 (Wikipedia; Thackeray: he outlived Agrippa II).
- "Given command in Galilee": the War says he was general; the Life says he was one of three priests sent to disarm the troublemakers.
  Both accounts are given, marked debated.
- "Takes the name Flavius when freed in 69": kept only as "he took the family name of his patrons" (Wikipedia notes he calls himself
  only Josephus in his own works).
- "Wrote it first in Aramaic": Josephus says "the ancestral language"; Aramaic is Thackeray's and Wikipedia's inference ("probably").
- "The Greek manuscripts, the oldest of them from about the tenth century": Thackeray dates the oldest (the Palatine manuscript of
  the Life and Ant. 11–17) to the ninth or tenth century and the oldest War manuscripts to the tenth or eleventh; Wikipedia (Josephus
  on Jesus) says none is older than the eleventh. The article names the Palatine manuscript and Thackeray's date; the Vienna papyrus
  (third century, usually) is added as the oldest copy of all.
- "He admits that he used assistants for the Greek (Against Apion 1.50)": confirmed; added that the Scroll's English (Whiston) turns it
  into lessons in Greek, which the Greek does not say.
- "Jewish War ... Antiquities ... Christians read him eagerly ... which is largely why his works survived": kept, with the sources.
- "Readers should also note that Whiston's chapter numbers differ from the section numbers of Niese's edition": confirmed (Thackeray;
  Wikipedia, Benedikt Niese).

**Weak points to revisit**
- Much of the life and the transmission rests on Thackeray's Loeb introductions of 1926–30 (OCR text on the Internet Archive). They
  are old: his date for the Life (after 100) differs from Wikipedia's (about 94–99), and Eisler's Slavonic theory, which he
  reported, is now rejected (Wikipedia). The article gives his assistant theory as his own reading, not as fact.
- The Testimonium paragraphs rest on Wikipedia's Josephus on Jesus and on Feldman's 1965 note; Pines (1971) and Whealey (2008) were
  not read directly.
- The Vienna papyrus rests on a scholar's blog (Nongbri); the papyrological databases were blocked by bot checks.
- The Brill series is confirmed only by a review on josephus.org (Goldberg) and Wikipedia's bibliography; Brill's own pages
  returned 403.
- Whiston's "three books" at Ant. 20.268 is an observed difference between the Scroll's Greek and its English; no source explains it.
- The Lake translation of Eusebius in the Scroll is an OCR text with errors; nothing from it is quoted (the statue is only
  paraphrased in the timeline).

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/josephus.md):** 13 findings, each checked against
the cited passage or page (Life 13–16, 361–364, 414–421 and Against Apion 1.1–3 in the Scroll; Thackeray's Loeb 186 and 210 and
Feldman's Loeb 433 in the Internet Archive texts; Wikipedia, Siege of Masada), all corrected: the 1544 edition's unknown manuscript
limited to Against Apion and Antiquities 1–10, "seems"; at the fall of Jerusalem he asked for his countrymen's freedom and was given
the sacred books; Titus signed the War so that it would be the sole account; Masada 73 (74 a proposed dating), footnoted to the
Masada page; the Pharisees "debated" (Mason); Puteoli, and the actor Aliturus named; Pal. gr. 14 the oldest medieval manuscript,
dated by Thackeray; Loeb 210 is War IV–VII; Cohen a historian, Magness an archaeologist; Origen about 248 (Wikipedia, Contra
Celsum, added as a source); the other Against Apion copies "seem" to derive from L; Against Apion's opponents not called Greek
writers; Niese printed and Schürer preferred Eusebius' word.

## Galen (tlg0057), checked 2026-10-06

Article: `web/src/wiki/authors/tlg0057.ts` (29 sources). Not yet registered in `author-articles.ts` / `author-articles-all.ts`.
Tests: `ARTICLE=tlg0057 npx vitest run src/wiki/author-articles.test.ts` (11 passed); `CORPUS=1 ARTICLE=tlg0057 npx vitest run
src/wiki/author-articles.corpus.test.ts` (3 passed; a deliberately altered Greek quotation and an altered English one were both caught,
so the check is live); `npx tsc --noEmit -p .` clean.

What the library has: 97 works of Galen (tlg0057) and six of Pseudo-Galen (tlg0530), nearly all Greek only, mostly from Kühn's
Opera Omnia (file headers), some from Marquardt (1879), I. von Müller (1879), Helmreich (Scripta Minora III 1893; De temperamentis
1904; CMG V 4.2 1923), Kaibel (1894), Kalbfleisch (1896, 1898), Schöne (1901), Raeder (1928). Only *On the Natural Faculties*
(tlg0057.tlg010) has an English translation: Brock, Heinemann and Harvard, 1916. So every English rendering of Galen in the article,
except Brock's, is "our translation" and listed in `outsideQuotes`.

**Confirmed and kept**
- Life: SEP, Galen (P. N. Singer, 2016, rev. 2021): born 129 at Pergamon, "culturally Greek", son of an architect; philosophy from 14,
  medicine from 16; father's death 149; Smyrna, Corinth, Alexandria; 157 gladiators; Rome in the early 160s; lectures and anatomical
  demonstrations, fame among the elite; court physician to Marcus; left in Rome during the campaign 169–76 and wrote up many major
  works; served Commodus and Severus; the fire of 192 and the loss of his library (described in *Avoiding Distress*); traditional death
  c. 200, later sources suggest more than ten years later (Nutton 1984); "one of the most prolific intellectuals", "extremely adversarial",
  "extremely prone to digression", polemic and commentary on Plato and Hippocrates; 21 volumes of c. 1000 pages, more than 4 million
  words, a few works only in Arabic, Syriac, Hebrew or Latin; more than 25 ethical works, two surviving in full; logic nearly all lost;
  UP on the purposive, divine construction of the parts; the live pig and the spinal cord; ignored since the Scientific Revolution,
  recently revived; editions: CMG 1914–, Kühn 20 vols 1821–33 (repr. Olms 1964–65), Brock's Loeb 1916, De Lacy's PHP (CMG V 4.1.2,
  1978–84, 2nd edn 2005), Singer 1997 (Lib. Prop., Opt. Med. in English), Singer 2013 with Nutton's *Avoiding Distress*,
  Johnston–Horsley Loeb 2011, Boudon-Millot–Jouanna with Pietrobelli, Budé IV 2010.
- Pearcy, "Galen: a Biographical Sketch" (Medicina Antiqua, UCL): dream 144 or 145; father died 148 or 149, Galen 19, rich and
  independent; gladiators autumn 157 to autumn 161; back in Pergamum 166–169; 168 invitation to Aquileia; fire given as 191; "most
  prolific, cantankerous".
- Wikipedia, Galen: name from γαληνός "calm"; went to Rome 162; feared exile or poisoning and left; Suda (died at 70, c. 199) against
  Arabic sources (87, c. 216), Nutton and Boudon-Millot for 216; On Theriac to Piso mentions events of 204, "may, however, be spurious",
  Nutton thinks it genuine; may have produced more than any ancient author; some 3 million words; four humours and temperaments; three
  systems (brain/nerves, heart/arteries, liver/veins); human dissection forbidden, mainly Barbary apes, also pigs; vivisection; Vesalius
  1543 and the impermeable septum (Nat. Fac. III.15); Harvey and others; bloodletting into the 19th century; more than 1,300 years;
  Marcus' praise (Praen. 14.660 K.); not translated into Latin in antiquity; all Greek manuscripts copied by Byzantines; Syrian Christians
  after 750; Hunayn 129 works (c. 830–870); works only in Arabic or only in Latin from Arabic; forgeries prompted On My Own Books;
  al-Razi's Doubts on Galen; Latin translations from Arabic from the 11th century; "Medical Pope of the Middle Ages"; Burgundio; Niccolò
  da Reggio at Robert of Naples' court; Latin Opera Venice 1490 (Bonardo, Pinzi); Aldine 1525.
- Wikipedia, Antonine Plague: 165–180, "Plague of Galen"; Galen went home in 166 during the epidemic; brief descriptions.
- Wikipedia, Galenic corpus: over 2.6 million words; Kühn 122 treatises, Greek with facing Latin, mainly from Chartier, 22 volumes,
  over 20,000 pages; the titles On Consolation from Grief (De indolentia) and Walzer–Frede's An Outline of Empiricism.
- Wikipedia, Hunayn ibn Ishaq: 808–873; 129 works of Galen; Greek into Syriac, nephew Hubaysh Syriac into Arabic.
- LSJ (site's copy and Perseus): γαληνός "calm, esp. of the sea"; of persons, "gentle".
- BIU Santé, "First printed editions of Galen" (presentation by Véronique Boudon): Kühn 21 volumes plus an index, c. 20,000 pages, no
  critical edition as a whole, no critical apparatus (except one), the edition one refers to; works lost in Greek, some only in medieval
  Latin (Subfiguratio empirica), some in Arabic; an eighth of Greek literature from Homer to the end of the second century; the Greek
  tradition rarely before the 12th century; Bonardus (Venice 1490); Aldine 1525, five folio volumes; Basel 1538 correcting the
  Aldine; Chartier (Paris, 1679), the ruin of its editor.
- Corpus Medicorum Graecorum, Gesamtübersicht "Galenus und [Galenus]" (archived 2020): De anatomicis administrationibus "X–XV nur
  arab."; De experientia medica "frg. gr., arab.", Walzer 1944; [Introductio sive medicus] and [Definitiones medicae] in brackets
  (TLG 0530, Pseudo-Galen); [De theriaca ad Pisonem] in brackets, with Boudon-Millot's CUF edition (Gal. VI); citation by Kühn volume
  and page ("K.").
- BMCR 2025.09.52 (Tieleman on Polemis–Xenophontos 2023): the 2005 find by Pietrobelli, sent by Boudon-Millot; On My Own Opinions in
  the table of contents, Avoiding Distress found a little later; mid-15th-century Vlatadon 14; full On My Own Books, otherwise one Greek
  witness (Ambrosianus gr. 659) apart from the Arabic; microfilm, the French team denied direct access, the new editors given it;
  scribal errors, moisture; about forty textual problems, most in Indol.; Prop. Plac. known from Latin via Arabic and Niccolò's
  Graeco-Latin version; its last three chapters in Ambrosianus gr. 659 as "On the Substance of the Natural Faculties", printed by Kühn
  (IV 757–766); Nutton's CMG V 3.2 (1999); Prop. Plac. late in life, authenticating his positions; Avoiding Distress known before only
  by its title, a letter to an old friend from Pergamum about the loss of library, drugs and equipment in the fire of 192, Commodus
  recently dead; other people's books circulating under Galen's name.
- BMCR 2015.07.22 (Kaufman on Rothschild–Thompson 2014): Vlatadon 14 written 1448–1453 by followers of John Argyropoulos, from the
  collections of a library in Constantinople (Boudon-Millot); Περὶ Ἀλυπίας or Περὶ Ἀλυπησίας, Kotzia for the former; ἐν Ἀντίῳ for
  ἐναντίω etc. at 16, 17, 18 BMJ, proposed by C. P. Jones (2009), popular but controversial, Nicholls against; Rosen on the lost
  lexical works, including a lexicon of medical terms in Old Comedy; written shortly after Commodus' death, and the sentence on
  Commodus (reviewer's translation of BMJ 54–55); the four editions (2007, 2010, Kotzia–Sotiroudis 2010, Garofalo–Lami 2012);
  Nutton's translation in Singer 2013.
- Roger Pearse's post quoting Singer's translation of On My Own Books: the Sandalarium, the book "Galen the doctor", two lines read,
  "This is not Galen's language—the title is false"; books given without inscription to friends and pupils, passed off by others.
- Classical Review 59.2 (1945) record: Walzer, Galen on Medical Experience, first edition of the Arabic version (OUP, 1944).
- Scroll passages (all quotations copied from `passage.ts`): MM 9.4 (philosophy first, then medicine after his father's vivid dreams);
  Comp. Med. Gen. 3.2 (returned from Alexandria at 28; the high priest entrusted the gladiators to him alone, "beginning my twenty-ninth
  year"; many died before, none of his; second high priest after seven and a half months, then the third, fourth and fifth);
  Praen. 9 (sudden departure "as if to Campania", Brundisium; summons to Aquileia; Lucius' death mid-winter; Marcus persuaded to
  leave him in Rome for Commodus; "many treatises, philosophical and medical"); Praen. 11 (the emperor's praise, "first of doctors,
  alone of philosophers"); Comp. Med. Gen. 1.1 (the precinct of Peace and the Palatine libraries burned; the storehouse on the Sacred
  Way; the first two books rewritten); On the Powers of Foods 2.9.12 (names as people now use them; clarity before old Atticism);
  In Hipp. De officina medici 3.33 (not here to teach the young to Atticize); That the Best Physician 1 (the athletes; "they praise
  Hippocrates and think him first of all"); Nat. Fac. 1.13 (Brock: the Asclepiadeans, "sectarian partizanship … harder to heal than
  any itch"; the ureters tied in a living animal, "the bladder empty and the ureters quite full and distended"); Nat. Fac. 3.15 (Brock:
  "nothing is done by Nature in vain"; the perforations in the septum; "not possible … to observe their extreme terminations");
  Anat. Admin. 9.5 (the last Greek chapter in the Scroll: Herophilus and the carved reed pen); the Greek fragment of On Medical
  Experience (Schöne 1901); "On the Substance of the Natural Faculties" (Kühn IV); On Theriac to Piso under Galen; Introduction, or
  the Physician under Pseudo-Galen; On Antidotes 1.13 (the cinnamon tree, read but cut for length).

**Left out because it could not be confirmed**
- "Hundreds of medieval Greek manuscripts" and "no single one contains more than a fraction of them": no count found in a source
  opened.
- "Many treatises survive in only one or two copies": only the specific case of On My Own Books (two Greek witnesses) is kept.
- A "large dictionary of Attic words, now lost": Rosen (via BMCR) speaks of lexical works and a lexicon of medical terms in Old Comedy;
  that is what the article says.
- διάγνωσις and πρόγνωσις "passed into modern medicine": not checked against a source; dropped.
- Wikipedia's ape disembowelled to win the post, and "five deaths among the gladiators against sixty": the source of the figures could
  not be opened (the Arabic-only *On Examinations by which the Best Physicians are Recognized* is named only in a search summary);
  Galen's own account in the Scroll says that none of his patients died, and the article keeps that.
- Death in Sicily, the tomb at Palermo (Wikipedia, from Arabic sources): not needed and not checked further.
- Job of Edessa's 36 Syriac translations: confirmed in Wikipedia but cut for length.
- The 2018 Basel papyrus (Wikipedia: "an unknown medical document of Galen or an unknown commentary on his work"): left out.
- A date for William Harvey: the Wikipedia Galen page gives none; Harvey is named without a date.
- The bookshop story's date and the identity of Bassus: not needed.

**Corrected from the draft**
- "129–c. 216 CE" stated as fact → the death date is marked debated: c. 199 (Suda), c. 216 (Arabic sources, Nutton, Boudon-Millot),
  c. 200 traditional (SEP), after 210 (Pearcy), c. 210 (Boudon, BIU).
- "More of his writing survives than of any other ancient Greek author, roughly three million words" → "may have written more than any
  other ancient author" (Wikipedia's own hedge); the word count varies by source: over 2.6 million, some 3 million, more than 4 million.
- Timeline "146: begins medical studies at about sixteen" → the dream is dated 144 or 145 (Pearcy); medicine from sixteen (SEP), i.e.
  about 145.
- "Kühn's edition in 22 volumes" → counted as 20 (SEP), 21 plus an index (Boudon) or 22 (Wikipedia), because some volumes are in two
  parts (the Scroll's headers show 17.1, 17.2–18.1, 18.2).
- "Kühn largely reprints René Chartier's of 1679" → Kühn's text and Latin are "mainly taken from" Chartier (Wikipedia); Boudon dates
  Chartier's edition 1679, Wikipedia gives 1638–39; only Boudon's date is printed, attributed to her.
- "Teubner texts by Helmreich, Kalbfleisch, Marquardt and others (1879–1923)" → not all Teubner: Marquardt's 1879 text was a Güstrow
  school publication, von Müller's an Erlangen one, Kaibel's Weidmann, Schöne's in the Berlin Academy's Sitzungsberichte; the Scroll's
  range is 1879–1928 (Raeder's CMG volume).
- "Corpus Medicorum Graecorum V (Berlin, 1914–)" → Leipzig (Teubner) and Berlin (Akademie Verlag), 1914– (SEP).
- "Leaves Rome, as the Antonine plague breaks out" → he left in 166, in the year of the epidemic (Antonine Plague page); his own
  account (Praen. 9) gives no plague, only a sudden departure "as if to Campania"; Wikipedia gives fear of rivals.
- "Recalled by Marcus Aurelius" (169) → summoned with Lucius Verus to Aquileia in 168 (Pearcy, Praen. 9); stayed in Rome from 169
  for Commodus (SEP, Praen. 9).
- "Vlatadon 14 … found to contain On the Avoidance of Grief, lost in Greek until then" → it was lost altogether, known only by its title
  (Tieleman); the first find was On My Own Opinions in the table of contents, Avoiding Distress a little later; the manuscript is
  mid-15th-century (1448–1453, Boudon-Millot).
- "Hunayn and his school … over a hundred Galenic works" → "credited with translating 129" (both Wikipedia pages); the Syriac and
  Arabic division of labour with Hubaysh added.
- "He tells of seeing a book falsely sold under his name in a Roman bookshop" → he witnessed a dispute in the Sandalarium, where a man of
  letters read two lines and tore up the title (Singer's translation, via Pearse).
- "Forgeries were already circulating … On My Own Books … remains the starting point for deciding what is authentic" → only the first
  part is kept; the second was not found in a source opened.
- Added from the sources: the gladiators in Galen's own words; the fire in his own words; the misnamed fragment "On the Substance of the
  Natural Faculties" (in the Scroll) as the end of On My Own Opinions; On Theriac to Piso and the death date; the title and Antium
  cruxes of Avoiding Distress; Galen's own remarks on Atticizing.

**Weak points to revisit**
- Much of the life rests on Galen's own self-portrait (Praen., Comp. Med. Gen.) and on Wikipedia, Pearcy (a short sketch first printed
  in 1985) and the SEP; the sources disagree on several years (father's death 148/149; Rome 161/162; fire 191/192).
- The identification of the emperor in Praen. 11 as Marcus rests on Wikipedia; the Scroll's chapter says only "the emperor" (αὐτοκράτωρ).
- The bookshop story and the words "This is not Galen's language" come from a blog post quoting Singer's printed translation; the book
  itself was not opened.
- The CMG list is an archived 2020 page; "square brackets = wrongly attributed" is inferred from its title "Galenus und [Galenus]" and
  from the bracketed titles being the TLG's Pseudo-Galen (0530) works; On Theriac to Piso is bracketed although the TLG files it under
  Galen (0057.079).
- The Greek fragment of On Medical Experience in the Scroll is identified as such by the catalogue (tlg0057.tlg107, the TLG number the
  CMG list gives for De experientia medica) and by Schöne's title; Walzer's 1944 edition is confirmed only by a journal record of a
  review (the Internet Archive copy is restricted).
- Singer (ed.), Psychological Writings: 2013 in the SEP and in Kaufman's review, 2014 in Tieleman's bibliography; 2013 is printed.
- Wikipedia's "Hunayn translated 129 works" may conflate his own translations with those of his circle; the article says "is credited
  with".
- Brock's Greek text in the Scroll is called his own edition in the file header; the SEP gives Helmreich's Scripta Minora III (1893) as
  the critical text of Nat. Fac. The article does not say whose text Brock printed.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/galen.md):** 7 findings, each checked against the
cited passage or page (Method of Healing 9.4 in the Scroll; Wikipedia, Antonine Plague), all corrected: 1914 is the Corpus Medicorum
Graecorum's first Galen volume, not its start; the Antonine Plague (165–180) reached Rome in 166; On My Own Opinions was known
"mainly" from the two Latin versions, with Greek and Arabic fragments; On Medical Experience "survives in Arabic" (no source says
whole); "over 2.6 million words, or more than 4 million"; Commodus and Severus also footnoted to Wikipedia (the SEP says
"apparently"); the dream line quoted from «εἶθ' ὕστερον», "then later".

## Hippocrates and the Hippocratic Corpus (tlg0627), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0627.ts` (27 sources). Not yet registered in `author-articles.ts` / `author-articles-all.ts`.
Tests: `ARTICLE=tlg0627 npx vitest run src/wiki/author-articles.test.ts` (11 passed); `CORPUS=1 ARTICLE=tlg0627 npx vitest run
src/wiki/author-articles.corpus.test.ts` (3 passed; the check is live: a first draft quoting Jones's English of *Epidemics* I 11 failed,
because the reader offers only Adams's translation for that work, and the quotation was replaced with Adams's); `npx tsc --noEmit -p .` clean.

What the library has: 53 works under Hippocrates (tlg0627), 19 with English. Greek from Littré (Paris: Baillière, 1839–61; some files
from the Hakkert reprint of 1961) and from Jones's Loeb vol. 1 (1923: *Ancient Medicine*, *Airs, Waters, Places*, *Epidemics* I and III,
the Oath, *Precepts*, *Nutriment*); English from Adams (New York, 1886) and Jones (1923). Also in the library: Soranus' *Life of
Hippocrates* (Ilberg, CMG IV, 1927; Greek only, lunate sigma, so not quoted), the Hippocratic *Letters* (Littré vol. 9, Greek only),
Galen's commentaries on Hippocrates (Kühn, Greek only), two Pseudo-Hippocratic works (tlg0751).

**Confirmed and kept**
- Wikipedia, Hippocrates: born c. 460 on Cos, "other biographical information ... likely to be untrue"; Father of Medicine; little known
  for certain of what he thought, wrote, did; Soranus a 2nd-century physician, first biographer; Plato's *Protagoras*, *Phaedrus* and
  Aristotle's *Politics*; Polybus son-in-law and student; Aristotle's "The Great Hippocrates" (the claim the article corrects);
  Girodet's *Hippocrates Refusing the Gifts of Artaxerxes*, 1792; death at Larissa, c. 370.
- Plato, *Protagoras* 311 (Lamb): "your namesake Hippocrates of Cos, the Asclepiad", the fee, "A doctor". *Phaedrus* 270 (Fowler):
  "If Hippocrates the Asclepiad is to be trusted ...". Aristotle, *Politics* 7, 1326a (Rackham): "greater, not as a human being but
  as a physician, than somebody who surpassed him in bodily size". All copied from `passage.ts`.
- Soranus, *Life* (Scroll, read in Greek): son of Heraclides, his first teacher; twentieth from Heracles / nineteenth from Asclepius
  (the order of "one ... the other" kept vague as in the Greek); born Ol. 80.1 per Ischomachus; Soranus of Cos in the Coan archives,
  the day on which the Coans still make offerings; Andreas "maliciously" on the burning of the Cnidian record office; the dream sending
  him to Thessaly; Perdiccas' love for his father's concubine; the Abderites and Democritus "as in madness"; the plague in Illyria,
  foreseen to reach Attica; Artaxerxes via Hystanes, governor of the Hellespont, refused; death at Larissa, aged 90, 85, 104 or 109;
  tomb between Gyrton and Larissa, bees and honey for children with aphthae; sons Thessalus and Draco, his most famous pupils; much
  disagreement about his writings.
- *Letters* 3 and 5 (Scroll): Artaxerxes to Hystanes; Hippocrates to Hystanes, «Περσέων δὲ ὄλβου οὔ μοι θέμις ἐπαύρασθαι» (our
  translation).
- Jones, *Hippocrates* I (Loeb, 1923; Internet Archive scan of the 1957 printing): "some seventy" works in the manuscripts; the
  collection a medley in Ionic, the remains of a library (perhaps the Cos school's), against Littré's Alexandrian publication; the
  "outstanding genius" of certain treatises; Herophilus (c. 300 BC) first, Bacchius' glossary, Heraclides of Tarentum the most
  celebrated commentator; Erotian under Nero, accepting the Oath; §11 the pseudo-Ionic forms of the later manuscripts and the scribes
  who "restored" them; §12 none very old, no canon or order, θ Vindob. med. IV (10th c., oldest), A Paris. 2253 (11th c., "has
  transformed our Hippocratic text"), M Marc. Ven. 269 (11th c.), V Vat. gr. 276 (12th c.); §13 editions: Calvus 1525, Aldine 1526,
  Cornarius 1538, Foes 1595, Littré 1839–61, Adams 1849 (London, 2 vols), Ermerins 1859–64, Kühlewein 1894 and 1902; Littré "diffuse,
  and not always accurate", knowledge of manuscripts confined to Paris, twenty-two years; Kühlewein purged pseudo-ionisms; Hippocrates
  a textbook almost to c. 1840; the Oath introduction: "Whatever its origin, it is a landmark in the ethics of medicine"; the stone
  clause, Littré's αἰτέοντας, Reinhold's οὐδὲ μὴ ἐν ἡλικίῃ ἐόντας, Gomperz on castration, the clause possibly a late addition; chief
  manuscripts of the Oath V and M; "the art" as medicine; Aristotle quoting *Nature of Man* as Polybus'.
- Hanson, "Hippocrates: The 'Greek Miracle' in Medicine" (Medicina Antiqua, UCL, archived): some 60 treatises; famous physician to
  Plato and Aristotle; collected certainly in Alexandria by the mid-3rd c. BC; Galen on *Epidemics* I, III (genuine) and II, IV, VI
  (Thessalus); Scribonius Largus and Soranus on the pessary clause; Galen's enthusiasm, copying into Byzantine times, Latin translation
  in the early 16th c. and the prestige that followed; "nothing to connect"; anonymous writers unlike Herodotus and Thucydides;
  "By what process does this sickness occur?".
- Wikipedia, Hippocratic Corpus: most works late 5th / first half 4th c.; *Law*, *Heart*, *Physician*, *Sevens* Hellenistic, *Precepts*,
  *Decorum* 1st–2nd c. AD; Ermerins at least nineteen authors; contradictions; Ionic, though Cos spoke Doric; *Epidemics* I and III
  c. 410; 42 case histories, 25 deaths; rejection of divine causes; Arabic, Hebrew, Syriac, Latin; remains of a Cos library or an
  Alexandrian compilation; Calvus 1525 Rome, Vat. gr. 277 (14th c.) owned and transcribed by him; Aldine 1526; Littré 1839–61; Adams
  1849 (a dozen and a half "genuine" works); Budé from 1967; *Nature of Man* by Polybus, 410–400.
- Wikipedia, Hippocratic Oath: one of the most widely known Greek medical texts; most modern scholars do not attribute it to Hippocrates;
  P.Oxy. 2547, 3rd c.; Scribonius Largus AD 43; Soranus; disagreement over the poison clause; *primum non nocere* not in the Oath,
  *Epidemics* I the nearest; eclipsed by longer codes; Declaration of Geneva 1948; 2018: all US graduates take an oath, none the original.
- Scroll passages: *Airs, Waters, Places* 1; *Sacred Disease* 1; *Epidemics* I case 1 (Philiscus) and I 11 (Jones's Greek, Adams's
  English; Littré's Greek read in the First1K file); *Aphorisms* 1.1 (Littré's Greek, Adams); the Oath (Jones's Greek and English; Littré's
  ξυγγραφῆς read in the First1K file); Galen, *In Hipp. Aph.* 1.1 (one aphorism or two; the lemma's ποιέοντα); Aristotle, *History of
  Animals* 3.3 (Polybus, «τὰ δὲ τῶν φλεβῶν τέτταρα ζεύγη ἐστίν»); *Nature of Man* 11.
- Smyth §31 (Perseus): in Attic alone η after ρ (and ε, ι) changed back to ᾱ.
- CMG Editionen online (CMG I): CMG I 1, Heiberg, Leipzig and Berlin 1927 (Iusiurandum, Lex, De arte, ..., De prisca medicina, De aere
  locis aquis ...); later volumes single treatises with German, French or English translation.
- Wikipedia, List of editiones principes in Greek: Ps.-Hippocrates' letters in the Aldine *Epistolae*, Venice 1499, ed. Musurus;
  Hippocrates, Aldine Press, Venice, 1526.
- Geller, BMCR 2019.08.17 (UCL Discovery copy): Potter, *Hippocrates* XI, Loeb 538, Harvard 2018, "the last of the Loeb Classical
  Library volumes of Hippocrates".
- Wikipedia, Loeb Classical Library: Hippocrates I–XI, L147–150, 472, 473, 477, 482, 509, 520, 538; vol. I contents.
- Classical Review 48.2 (1998), King's review: Jouanna, *Hippocrate* II 2, *Airs, eaux, lieux*, CUF, Paris 1996.
- Penguin page: *Hippocratic Writings*, ed. G. Lloyd, trans. Chadwick, Mann, Lonie, Withington, Penguin Classics.

**Left out because it could not be confirmed**
- Plato's *Protagoras* "set around" 433 BC (timeline): no dramatic date in a source read; the timeline says only that Plato and Aristotle
  name him in the fourth century.
- The Cos–Cnidus distinction as "itself disputed": not found in a source read (Wikipedia's Hippocrates page states the two schools as
  fact). Dropped altogether, with the Wikipedia Corpus page's mention of Cnidian works (cut for length).
- His mother's name: the *Life* in the Scroll says Phaenarete (Φαιναρέτης), Wikipedia says Praxitela daughter of Tizane: left out.
- Modern redatings of the manuscripts (some catalogues may date M or A differently): only Jones's 1923 dates, attributed to him.
- Bacchius' "edition" of *Epidemics* III (the scan is garbled at that point): only his glossary is kept.
- The Penguin selection's first year (a search summary said 1978; the publisher's page shows 2005): no year printed.
- The Letters as "clearly late": no source read says so in those words; they are called pseudo-Hippocratic (the editiones principes list).
- The 2017 Sinai manuscript, the Hippocratic bench, clubbing, "Hippocratic face", the Melusine legend (Wikipedia): not needed.
- Wikipedia's "the first four Loeb volumes 1923–1931, seven further between 1988 and 2012": contradicted by Geller (vol. XI in 2018);
  only the series' end in 2018 and the first volume of 1923 are used.
- Schubert and Scholl on P.Oxy. 2547 (Heidelberg PDF blocked), the Wellcome and Duke papyrus records (404 / bot check): the papyrus rests
  on Wikipedia only.

**Corrected from the draft**
- "Aristotle calls him 'the great Hippocrates'": the *Politics* (Scroll, 7.1326a) says he would be called greater as a physician, not as
  a man, than someone bigger in body. Wikipedia repeats the draft's reading; the article explains the difference.
- "Plato mentions him as a well-known physician who taught medicine for a fee (Protagoras 311b)": kept, with the exact words; the
  dramatic date 433 dropped.
- "Some sixty treatises gathered ... probably at Alexandria": "some sixty to seventy" (Hanson 60, Jones seventy); Alexandria by the
  mid-third century (Hanson), with Jones's library-at-Cos view marked debated.
- "Mostly between about 430 and 350": rewritten as Wikipedia's "last decades of the 5th century and first half of the 4th".
- "His saving Athens from the plague": the *Life* says he foresaw that a plague in Illyria would reach Attica and looked after the cities
  and his pupils.
- "Letters to kings": the letters are to and from Hystanes, governor of the Hellespont, about Artaxerxes' offer.
- "Ὁ βίος βραχύς ... μακρή" with "Ionic ending -ή where Attic would have μακρά": kept, with Smyth §31; the Greek quoted as the Scroll
  prints it (Littré: «ὁ βίος βραχὺς, ἡ δὲ τέχνη μακρὴ»); "the best-known sentence in Greek medicine" dropped as a judgement.
- Manuscripts "of the tenth to twelfth centuries" and "Vindobonensis med. gr. 4": kept, with each date as Jones gives it (θ 10th, A and
  M 11th, V 12th).
- "Early translations into Latin, Syriac and Arabic, which sometimes preserve better readings": only "survive in Arabic, Hebrew, Syriac
  and Latin; some works known only in translation" (Wikipedia) is kept; "better readings" not found.
- "Scribes often normalised the Ionic forms": the opposite, per Jones: later scribes *added* false Ionic forms; shown with Jones's and
  Littré's texts side by side.
- Timeline "1525 Calvo ... 1526 Aldine": kept (Jones, Wikipedia), with Calvus's own manuscript (Vat. gr. 277).
- Editions: "CMG I (Berlin, 1927–)" → Leipzig and Berlin, 1927 (CMG page); "Loeb 1923–, later volumes by P. Potter and W. D. Smith" →
  only Potter's last volume (2018) is named; Smith's volume was not checked.
- Added from the sources: the *Life*'s legends (bees, Perdiccas, Andreas), the Letters, the Philiscus case, the forty-two case histories,
  the Oath's stone clause and its emendations, Galen on "one aphorism or two", Aristotle's Polybus.

**Weak points to revisit**
- The manuscript dates are Jones's of 1923; a modern study (e.g. Jouanna's) would be better.
- P.Oxy. 2547 and the Scribonius date rest on the Wikipedia Oath page (Hanson gives only "first century").
- Soranus' date ("second century") is from Wikipedia; Wikipedia's Oath page says *Gynaecology* is of the 1st or 2nd century.
- Kühlewein's title is given as *Hippocratis opera quae feruntur omnia*; Jones's scan reads "geruntur", an OCR slip for "feruntur".
- The Loeb volume list comes from Wikipedia's Loeb page; HUP's own pages were not opened. The Jouanna Budé volume is confirmed by the
  Classical Review record only (the review text was not visible).
- Hanson's essay is an undated web article (archived 2011).
- The summary is about 1,450 words including the Greek, at the top of the requested range.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/hippocrates.md):** 9 findings, each checked against the
cited passage or page (the Life of Hippocrates in the Scroll; Jones's Loeb vol. 1 in the Internet Archive text and record; the Oath in
the Scroll). 8 corrected in the article: the Life's birth date is Ischomachus', the archives and the dream from an earlier Soranus of
Cos, and its third reason for leaving Cos added; Jones left "the Hippocrates of tradition" in obscurity; the Oath's own "abstain from
all intentional wrong-doing and harm" beside primum non nocere; Jones's 1923 vol. 1 published by Heinemann and Putnam (Harvard on later
printings); the Budé edition began in 1967 without naming Jouanna; Jones read the Politics passage as "the Great Hippocrates", stated
with his reading; famous in his own lifetime; "came to be" for "soon". The ninth was a reader fault, fixed the same day in
lib/tei/align.ts: in Adams's Epidemics I, section 2 (English 1–6, Greek 1.2.4–12), numbers that matched only by coincidence had put
"to do good or to do no harm" beside the wrong Greek; it now shares a row with «ὠφελέειν ἢ μὴ βλάπτειν».

## Euclid (tlg1799), checked 2026-10-07

Article: `web/src/wiki/authors/tlg1799.ts` (30 sources). Written afresh; notes left in the scratchpad by an earlier, interrupted attempt were used only as leads, and every page cited was opened again for this check.

**Confirmed and kept**
- Life and the ancient testimonia: Heath, *The Thirteen Books of Euclid's Elements*, vol. 1 (1908; Internet Archive OCR), ch. 1: Proclus' summary (Friedlein p. 68) in Heath's translation ("put together the Elements, collecting many of Eudoxus' theorems, perfecting many of Theaetetus'"; "in the time of the first Ptolemy"; "younger than the pupils of Plato but older than Eratosthenes and Archimedes"; the royal road); Proclus had no direct knowledge of birthplace or dates; Euclid flourished c. 300 BC; Stobaeus' royal-road story of Alexander and Menaechmus and the "threepence" story; Pappus on Apollonius and "the pupils of Euclid at Alexandria"; Heath's "One thing is however certain … taught, and founded a school, at Alexandria"; the confusion with Euclid of Megara (Valerius Maximus, Metochites, Campanus to Candalla; Commandinus); Heiberg's view that the Archimedes reference is genuine, "though in themselves they would be somewhat suspicious"; Proclus 410–485.
- Jones, "Euclid, the Elusive Geometer" (2005, NYU archive PDF): eight Teubner volumes; no prefaces, no reference treating him as a living person; Archimedes' cross-reference "manifestly an interpolation"; Apollonius' preface the earliest authentic reference ("an accidental fragment … not felicitously done"), Conics about 185 BC give or take a decade; Pappus c. AD 320, does not strictly say Euclid lived at Alexandria, inclined to present guesses as facts; Proclus "was grasping at straws"; Euclid probably several decades later than usually said; about five papyrus manuscripts, the Elements the only demonstrative treatise in papyri; Galen and Alexander of Aphrodisias the first securely datable citers, sometimes naming the book; Optics, Catoptrics and Sectio Canonis possibly falsely attributed; "the most faceless of the great Hellenistic mathematicians".
- Archimedes, *On the Sphere and Cylinder* 1.2 in the Scroll: «διὰ τὸ β΄ τοῦ α΄ τῶν Εὐκλείδου» (our translation).
- Wikipedia, Euclid: fl. 300 BC; Proclus and Pappus many centuries later; fanciful, unverifiable Arabic biography; Euclid of Megara; Books 1–6 / 7–10 / 11–13, Book 5 and Book 10 (irrational lines); predecessors Eudoxus, Hippocrates of Chios, Theaetetus; Data, Optics (earliest surviving Greek treatise on perspective), Phaenomena (spherical astronomy); On Divisions in Arabic; lost Conics, Porisms, Pseudaria, Surface Loci; Catoptrics questioned; Book 9 infinitely many primes; postulates against common notions (more general).
- Wikipedia, Euclid's Elements: "most successful textbook ever written"; Books 14 (probably Hypsicles) and 15 (perhaps a pupil of Isidore of Miletus); six parts of a proposition; the unstated assumption that the circles of 1.1 meet; Elephantine ostraca (3rd c. BC, XIII.10 and XIII.16); Demetrius Lacon; Theon's edition the only Greek source until Peyrard's 1808 discovery; Heiberg's position on Vat. gr. 190; Klamroth–Heiberg debate, Knorr siding with Klamroth; Arabic under Harun al-Rashid (c. 800), al-Hajjaj, Ishaq ibn Hunayn and Thabit; Adelard c. 1120; Campanus before 1260, dominant until Greek manuscripts; quadrivium; Ratdolt 1482; over a thousand editions, estimated second only to the Bible; Zamberti 1505; Greek text 1533; Billingsley 1570 with Dee; Ricci and Xu 1607 (Books 1–6); fell out of favour in the 19th century; Dodgson 1879; Lobachevsky 1829; Pythagorean theorem in 1.47.
- Wikipedia, Papyrus Oxyrhynchus 29: found 1897 by Grenfell and Hunt, published 1898; first dated end 3rd/beginning 4th c., now AD 75–125; Book 2, Proposition 5 with diagram.
- Wikipedia, Theon of Alexandria (c. 335–405; Hypatia's father; his edition). Wikipedia, Hypsicles (c. 190–120 BC; possibly Book 14). Wikipedia, Q.E.D. (ὅπερ ἔδει δεῖξαι; Q.E.F. and Elements 1.1).
- LSJ (site's copy): στοιχεῖον II.1 simple sound of speech; II.3 "the propositions whose proof is involved in the proof of other propositions", title of works by Hippocrates of Chios, Leon, Theudios and Euclid; στοιχειωτής "of Euclid, the author of the Elements" (Elias in Cat.).
- Heath ch. 5 (the text, after Heiberg): manuscripts titled "from the edition of Theon" / "from the lectures of Theon"; Theon's own claim to the second part of VI.33 in his Ptolemy commentary; P lacks it; marginal note at XIII.6; Theon's kinds of change (additions, standardised diction, "is" added 600 times); P = Vat. 190, 10th c.; F Laurentian 28.3, 10th c.; B Bodleian D'Orville 301, AD 888, Stephen clericus, Arethas; V Vienna phil. gr. 103, probably 12th c.; papyri: Herculanensis 1061 (Def. 15 without the glosses), P.Oxy. 29 "3rd or 4th c." (no porism to II.4), Fayum IX "2nd or 3rd c." (I.39, I.41 without I.40).
- Heath notes: Def. 15 glosses bracketed by Heiberg (omitted by Proclus, Taurus, Sextus, Boethius); I.40 an interpolation (Heath's translation brackets it, as the Scroll shows); the common notions (four extra, three bracketed by Heiberg, one omitted; Proclus' five); "two straight lines cannot enclose a space" an interpolation; Proclus on Postulate 5 ("ought even to be struck out of the Postulates altogether …").
- Heath ch. 7–8: Hajji Khalfa and the Fihrist on al-Hajjaj (Harun ar-Rashid 786–809; al-Ma'mun), Ishaq b. Hunain improved by Thabit b. Qurra; al-Hajjaj's Book I with 47 propositions, I.45 omitted; Athelhard c. 1120; Ratdolt 1482 "the first printed mathematical book of any importance", his dedication on printing figures; Grynaeus, Basel 1533, from two manuscripts "among the worst", long the basis of later editions; Peyrard 1814–18, Vatican MSS sent to Paris in 1808, adopted many readings of Vat. 190; Billingsley 1570 ("Evclide of Megara" on the title page, not used in the article); Heiberg 1883–88.
- Heath ch. 2: Catoptrica not genuine, Heiberg suspects Theon; Sectio canonis accepted by Heath, disputed by Tannery.
- Bodleian (IIIF manifest of Digital Bodleian): D'Orville 301, Elementa I–XV, scribe Stephanos, 888, Theon's version, bought by Arethas for 14 nomismata, many notes, "the oldest manuscript of a classical Greek author to carry a precise date".
- Digital Vatican Library: Vat. gr. 190 pt. 1, "sec. IX".
- Internet Archive records: Ratdolt 1482 (Campanus); Heiberg vol. 1 1883 (contents of the series: Elementa I–IV 1883–85, V 1888, Data 1896, Optica 1895, Phaenomena 1916); Peyrard 1814–18 (Greek, Latin, French); Heath vol. 1, 1926.
- GlossGA (BBAW) record: Stamatis post Heiberg, Leipzig 1969–1977, vols I–V (an Innsbruck card record also gives Teubner, 1969, 2nd edition).
- Fitzpatrick (UT Austin): Heiberg's Greek with an English translation. Princeton University Press: Morrow's Proclus, 1970, paperback 1992.
- Scroll passages (all quotations copied from passage.ts): Elements 1.def.1, 1.def.2, 1.def.15, 1.post.1, 1.post.5, 1.comm_not.1–9 (nine in Greek, five in Heath with [7], [8]), 1.prop.1 (enunciation, setting-out, specification, ὅπερ ἔδει ποιῆσαι), 1.prop.39–41 (Heath's [Proposition 40 …]), 1.prop.47, 6.prop.33 (no sectors), 9.prop.20, 13.prop.18; Optics pr; Division of the Canon (catalogue title "spurious"); file headers (Heiberg 1883–88, Heath 1908, Menge/Heiberg 1895–1916). Twenty-three definitions counted in the Scroll.

**Left out because it could not be confirmed**
- Vitrac's French translation (PUF, 1990–2001, 4 vols): only a search-engine summary of vol. 1 (1990) was seen; the HAL page was blocked.
- "Used in schools into the twentieth century": the sources say only that it fell out of favour in the nineteenth century and is still occasionally used.
- "Translated into Arabic at Baghdad": no source opened names the city.
- "Euclid's Greek … easier than he looks": an opinion, no source.
- Birth and death years, an Athenian training at the Academy, a post at the Museum: modern inferences (Heath's "most probable", Jones's "standard life"), not ancient statements; only the uncertainty is reported.
- The Scroll's epigram ascribed to Euclid (tlg1799.tlg017): no source on its authorship.
- Knorr's sentence "We have never had a 'genuine' text of Euclid…" (seen only as quoted on Wikipedia); Proclus' Greek for the royal road (seen only on Wikipedia, with a misprint); Heath's Simplicius note on "three axioms only" in the ancient manuscripts (passed through an-Nairizi's Latin; left out as too indirect).
- Theon's words "at the end of the sixth book": the OCR reads "at the aid of the sixth book", so only "by me in my edition of the Elements" is quoted.

**Corrected from the draft**
- "Pappus says he taught at Alexandria": Pappus says only that Apollonius studied with Euclid's pupils at Alexandria; Heath drew the conclusion, Jones questions it. Marked debated.
- "The famous reply … is a later anecdote" kept, but with its twin story (Alexander and Menaechmus) and marked legend.
- "Vaticanus gr. 190, P, 9th century": the Vatican Library says ninth century, Heiberg/Heath and Wikipedia say tenth; both given.
- "Books 14 (by Hypsicles, 2nd century BCE)": Wikipedia says "likely"/"possibly"; "probably" used. Book 15 "later still" replaced by Wikipedia's "may have been written by a pupil of Isidore of Miletus".
- "Sectio canonis of doubtful authorship": made specific (Heath accepted it, Tannery disputed it, the Scroll lists it as spurious, Jones doubts it) and marked debated.
- "Every proposition follows the same pattern: statement, setting-out, construction, proof and conclusion": Wikipedia gives six parts (with the specification); the article follows that.
- "The Bodleian manuscript is copied at Constantinople": the Bodleian gives "Constantinople (?)", so the place is left out.
- "In 1808 Peyrard recognises …": kept, with Heath's detail that the manuscripts were sent to Paris in 1808 and his edition appeared 1814–18.
- "Heiberg and Menge, 8 vols (1883–1916)": given as Heiberg's vols 1–5 (1883–88) with the later volumes named separately (Menge 1896 and 1916, Heiberg 1895).
- "Translated into Arabic at Baghdad (c. 800 and later)": the place dropped; al-Hajjaj under Harun al-Rashid and al-Ma'mun, Ishaq and Thabit, from Heath.

**Weak points to revisit**
- Much rests on Heath 1908 (read in a Google OCR scan with some garbled words; only clearly legible words were quoted) and on two Wikipedia pages.
- The date of P.Oxy. 29: Heath (1908) and the Elements page caption say 3rd–4th century; the P.Oxy. 29 page (after Fowler) says AD 75–125. Both given, marked debated in the timeline.
- Jones's later dating of Euclid is one scholar's argument in a talk; marked debated.
- The Stamatis edition is confirmed by catalogue records only; Morrow's translation by the publisher's page (dates only).
- The Greek in the Scroll (Perseus's copy of Heiberg) does not show Heiberg's square brackets for the doubtful common notions and the words in Definition 15; the article says only what the Scroll shows and what Heath reports of Heiberg.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/euclid.md):** 9 findings, each checked against the
cited page (Heath 1908 vol. 1 in the Internet Archive text; Wikipedia, Euclid and Euclid's Elements; Jones 2005). 8 corrected: the
common notions (Heath: three of the four extra ones bracketed by Heiberg, a fourth, "if equals be subtracted from unequals", left
out; the ninth an interpolation, in Heath's view); Heath, not Heiberg, accepted the Division of the Canon; Heiberg thought the
Catoptrics "in its present form" may be Theon's; On Divisions survives only in part, its authorship questioned; Demetrius Lacon's
critique does not name Euclid (Jones); Galen and Alexander cite the Elements by name, sometimes giving the book; the Conics date is
Toomer's argument as Jones reports it; the eight Teubner volumes hold the writings "under his name". Not changed: "second only to
the Bible" in editions, which Wikipedia's Euclid's Elements page does say ("has been estimated to be second only to the Bible in the
number of editions").

## Archimedes (tlg0552), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0552.ts` (40 sources). Every Greek quotation was copied from `scripts/passage.ts`;
every English quotation is either in a cited Scroll translation or listed in `outsideQuotes` (our translations, Heath,
Gwilt). Web pages were opened directly (Wikipedia as wikitext, Internet Archive full texts, project pages).

**Confirmed and kept**
- Wikipedia, Archimedes: c. 287–212 BC; historians "almost universally agree" he was the finest ancient mathematician;
  the lost biography mentioned by Eutocius; Tzetzes' 75 years; father Phidias, nothing else known; Plutarch's kinship
  with Hiero against Cicero and Silius Italicus' humble origin; letters to Dositheus (pupil of Conon) and Eratosthenes
  (head librarian); unknown whether he visited Alexandria; Pappus' "place to stand"; Marcellus' attack in 214; burning
  mirrors absent from Polybius, Livy and Plutarch, Lucian (2nd c.) first on burned ships without mirrors, Galen first on
  mirrors, mixed modern results; Livy's death account; "Do not disturb my circles" in no ancient source; Vitruvius two
  centuries later; Plutarch's disdain for mechanics seen as his own Platonism; lost works (Sphere-Making, 13
  semiregular solids, Principles to Zeuxippus); 96-sided polygons; 8 × 10^63 grains; Doric; writings little known in
  antiquity; Isidore c. 530; Eutocius same century; Arabic (9th c., Thābit) and Latin (12th c., Gerard of Cremona);
  Renaissance and 17th-century influence; the Method found in 1906.
- Wikipedia, Siege of Syracuse (213–212 BC): siege 213–212; war 214; Syracuse on the east coast.
- Wikipedia, Archimedes' heat ray: Anthemius about AD 500 (the disagreement with Galen is stated in the article).
- Wikipedia, Cicero: quaestor in Sicily, 75 BC.
- Wikipedia, Archimedes Palimpsest: Isidore "the architect" of Hagia Sophia; copy c. 950 at Constantinople; to the
  Jerusalem area, scraped 1229 (colophon 13 April 1229); Tischendorf's leaf (Cambridge UL); Papadopoulos-Kerameus 1899;
  Heiberg 1906, photographs, transcriptions 1910–15; disappearance in the 1920s; Sirieix (Paris), water and mould,
  forged pictures on four pages; Christie's, New York, 1998; Walters imaging 1999–2008; SLAC X-rays; online release
  29 October 2008.
- Wikipedia, William of Moerbeke: 1269 at Viterbo; two Greek MSS, both lost; his own copy in the Vatican.
- Wikipedia, List of editiones principes in Greek: Basel 1544, Herwagen, ed. Venatorius; Cattle Problem 1773 (Lessing);
  Method 1907 (Heiberg, Hermes); Stomachion 1915.
- Wikipedia, Book of Lemmas / Archimedes's cattle problem / Ostomachion: Arabic only (Thābit); third-person mention of
  Archimedes; 44-line poem found by Lessing at Wolfenbüttel, 1773; Stomachion fragmentary in Arabic and the palimpsest.
- Heath, Works of Archimedes (1897, archive.org full text): Heracleides' Life via Eutocius; Tzetzes; Pheidias, with
  Blass's correction for τοῦ Ἀκούπατρος and the scholion on Gregory of Nazianzus; Hieron and his son Gelon; Diodorus
  and the long stay in Alexandria; Livy's dust; Pappus' saying; burning mirrors not before Lucian; the Valla MS
  (9th or 10th c.), lost after 1544; editio princeps Basel 1544 (Venatorius); Torelli, Oxford 1792; Heiberg 1880–81
  "definitive"; Doric: S&C and Measurement practically without Doric, Sand-Reckoner least affected, recast after
  Eutocius; Eutocius' "favourite Doric dialect"; Liber Assumptorum through the Arabic, quotes Archimedes by name;
  "edited in modern notation" (title page); Sand-Reckoner translation (opening, Aristarchus, Pheidias, conclusion).
- Heath, The Method (1912, archive.org): "certain things first became clear to me by a mechanical method…"; "the proof of
  which Eudoxus was the first to discover".
- Heiberg, Opera omnia, 2nd ed., vol. III (1915, archive.org): "iterum edidit"; codex A written about the middle of the
  9th century at Constantinople (Leo); Valla, Alberto Pio, Rodolfo Pio at Rome in 1544; vanished between 1544 and 1564;
  Moerbeke used codex A itself and a second Greek codex for Floating Bodies.
- Nigel Wilson (archimedespalimpsest.org): A probably 9th c., Valla, four copies (D, E, G, H); Moerbeke 1269 at
  Viterbo, autograph Vat. Ottob. lat. 1850, extremely literal; *temnesthai* → *brekhesthai*, Latin *humectetur*.
- Reviel Netz (archimedespalimpsest.org): Renaissance MSS all from codex A, lost in the 16th c.; codex B (Codex
  Mechanicorum) lost probably in the 14th c., known through a Latin translation; overlaps of the palimpsest with A and B;
  Method and Stomachion; hundreds of corrections to Heiberg; Eudoxus "publish" not "discover".
- CNRS press release (9 March 2026): leaf 123 (S&C I, 39–41) identified at Blois; ZPE article of 6 March 2026.
- Internet Archive record of the 1544 edition (Herwagen, Venatorius, Greek and Latin, Eutocius).
- Perseus Catalog: Mugler, tome I, Belles Lettres 1970, "Texte établi et traduit par Charles Mugler".
- Stanford Classics: Netz vol. 1 (CUP 2004), first English Eutocius, first scientific edition of the diagrams, uses the
  palimpsest.
- IMU, Fields Medal: head of Archimedes, ΑΡΧΙΜΗΔΟΥΣ, sphere inscribed in a cylinder.
- The Latin Library, Cicero Tusc. 5.64–66: humilem homunculum a pulvere et radio; denied by the Syracusans; brambles;
  Agrigentine gate; small column with sphere and cylinder (our translations).
- LacusCurtius, Vitruvius 9 pref. 9–12 (Gwilt): the crown, the bath, "leapt out of the vessel in joy…".
- LSJ (site copy): γᾶ Dor. for γῆ; ἅλιος (C) Dor. for ἥλιος; ἁμός for ἐμός esp. in Doric.
- Scroll passages: Sand-Reckoner 1 and 4; Quadrature pr.; S&C 1.pr (ἡμιόλιος; ὑφʼ ἡμῶν); Measurement 3; Method pr1;
  Eutocius on Measurement 1.1 (Heracleides) and on S&C 37 (Doric); Plutarch, Marcellus 14.3–9, 15.1–17.7, 19.4–6;
  Plutarch, Non posse 11 (εὕρηκα, the crown); Polybius 8.3.3, 8.7.6–7 (one soul; eight months; Shuckburgh's English);
  Lucian, Hippias 2 (Harmon: "the former burned the ships"); Strabo 1.3.11 (On Floating Bodies by title).

**Left out because it could not be confirmed**
- The 1998 price ($2 million on one Wikipedia page, $2.2 million on another) and where the palimpsest is now (CNRS:
  Walters; Wikipedia: returned to its owner).
- Heraclides Lembus as the biographer (Wikipedia doubts it); Valla's death year (1499 Heath, 1500 Heiberg, 1501 Wilson).
- "Codex B last heard of in 1311": seen only in a search summary, page not opened.
- The draft's "double reductio ad absurdum" and "a rigorous method of exhaustion" as a description of his proofs.
- Diodorus on the water-screw: Diodorus book 5 is not in the Scroll's default copy, so reported only through Heath.
- Cut for length although confirmed: the planetarium taken to Rome; the Syracusia (Athenaeus 5.40); Hipparchus on his
  solstices; later praise (Galileo, Leibniz, Gauss).

**Corrected from the draft**
- "Greatest mathematician of antiquity" as a bare fact → attributed: historians almost all agree (Wikipedia).
- "Siege of Syracuse (214–212)" → 214 or 213 (Wikipedia pages differ), marked debated.
- "The story of Eureka comes from Vitruvius" → Plutarch tells it too (Non posse 11, in the Scroll).
- "Codex B … lost soon after [1269]" → lost probably in the fourteenth century (Netz).
- "Codex C … our only source for the Method and the Stomachion" → only source for the Method and the Greek of
  On Floating Bodies; the Stomachion also survives in fragments in Arabic.
- "Eutocius writes commentaries, 530" → sixth century, same century as Isidore's compilation (no exact year).
- "Phidias … his father" → kept, but the name is Blass's correction of the manuscripts' Ἀκούπατρος (Heath).
- "Codex A … lost in the sixteenth century after many copies" → last seen 1544, gone by 1564 (Heiberg); Wilson counts
  four copies.
- "Heiberg … 3 vols (2nd ed. 1910–15)": volume count not confirmed; only the dates and vol. III are given.

**Weak points to revisit**
- The 214/213 date of the first assault; the birth year depends only on Tzetzes.
- Galen (Wikipedia, Archimedes) versus Anthemius (Wikipedia, heat ray) as the first to mention mirrors: both reported.
- "The Greek that the Scroll prints for the Book of Lemmas is a modern rendering": an inference from the work surviving
  only in Arabic; whoever made Mugler's Greek was not identified.
- Netz's "publish" correction is tied to the Method preface by inference (it is the only place where Heiberg's text
  makes Eudoxus "discover" a proof); the Greek reading of the palimpsest was not seen.
- Wilson's *temnesthai*/*brekhesthai* passage (Heiberg II p. 408.13) was not located in the Scroll's text, so the article
  does not say what Mugler prints there.
- Several transmission facts rest on Wikipedia (Arabic and Latin translations, the palimpsest's modern history).

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/archimedes.md):** 11 findings, each checked against the
cited passage or page (Plutarch, Marcellus 17 and Non posse suaviter 11 in the Scroll; Cicero, Tusculans 5.64 on The Latin Library;
Wikipedia, Archimedes Palimpsest; Federspiel's review of Mugler on Persée), all corrected: the Book of Lemmas Greek is E. Stamatis's
modern Doric reconstruction (the review added as source 41; its phrase "as a philological curiosity" not quoted, since it was not seen);
ἁμός flagged as Blass's correction where it is used; Galen first mentions the mirrors, Anthemius later tried to explain them (no
disagreement between the pages); Netz's "publish, not discover" not tied to a passage he does not name; Cicero's a pulvere et radio
goes with excitabo; Plutarch's εὕρηκα quoted with the words the English renders; Eutocius mentions the Life twice; the grave request
"is said"; Heiberg recognised Archimedes from the 1899 catalogue and came in 1906; Rivault's 1615 edition added; Isidore's
compilation "is believed".

## Claudius Ptolemy (tlg0363), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0363.ts` (24 sources). Not yet registered in `author-articles.ts` / `author-articles-all.ts`.
Tests: `ARTICLE=tlg0363 npx vitest run src/wiki/author-articles.test.ts` (11 passed); `CORPUS=1 ARTICLE=tlg0363 npx vitest run
src/wiki/author-articles.corpus.test.ts` (3 passed; a deliberately altered Greek quotation and a removed outside quotation were both
caught, so the check is live); `npx tsc --noEmit -p .` clean.

What the library has: three works under tlg0363, all Greek only. *Almagest* (tlg001), Heiberg, Teubner 1898–1903 (book.section,
with a "toc" section per book); *Tetrabiblos* (tlg007) in Robbins's Loeb Greek (perseus-grc2, printing of 1964, the default text)
and Boll–Boer's Teubner (1st1K, the file says 1954); *On Music* (tlg011), 27 short notes headed ΠΤΟΛΕΜΑΙΟΥ ΜΟΥΣΙΚΑ from von Jan,
*Musici Scriptores Graeci* (1895), p. 411 ff. This is NOT the *Harmonics* (three books): the editor's own notes (§ 18, § 23)
point to passages also in Cleonides and Nicomachus. No English translation of Ptolemy is in the Scroll, so every English rendering
of his Greek is "our translation" except Robbins's *Tetrabiblos* (quoted from LacusCurtius) and the Paton/Tolsa poem.
Note: the Greek Anthology's default edition in the Scroll is Paton vol. 5 (grc10), so Anth. Pal. 9.577 cannot be cited as a
Scroll passage; the poem is quoted in English from Tolsa (GRBS 2014) only.

**Confirmed and kept**
- Toomer, DSB article "Ptolemy" (MacTutor PDF of the Complete DSB text): b. c. 100, d. c. 170; observations 26 March 127 to
  2 February 141; Alexandria the only place named; Roman citizenship probably from Claudius or Nero; the Canobic Inscription
  (tenth year of Antoninus; alternative MS reading "fifteenth year"; Toomer doubts its authenticity); Olympiodorus' forty years
  at Canopus "probably a fictional elaboration"; Meliteniotes (c. 1360) "could be correct" but late and unsupported; Arabic
  sources "add nothing credible"; the Suda the only formal notice (tenth century), "wretchedly incomplete"; Almagest the
  earliest major work, mentioned in the Tetrabiblos, Handy Tables, Planetary Hypotheses and Geography; Syrus otherwise unknown;
  thirteen books; the title and al-majisti / almagesti / almagestum; first principles to tables; eccentrics, epicycles, the
  equant ("most original element"); 1,022 stars, 48 constellations; Handy Tables (Theon's version, "changed nothing
  essential"); Planetary Hypotheses (two books, physical models, absolute distances); Tetrabiblos as complement of the
  Almagest; Geography in eight books, lists of places, maps "undoubtedly" in Ptolemy's own publication; Harmonics in three
  books between Pythagoreans and Aristoxenians; Optics (Latin by Eugenius of Sicily, 12th c., from a lost Arabic version);
  Planisphaerium (Arabic and Latin); Mechanics in three books lost; Almagest "a masterpiece of clarity and method"; the
  equinox observations each about a day out; Delambre's charge "implausible", selection of observations likely; standard
  textbook almost at once; Pappus (fl. 320) and Theon (fl. 360); Arabic about 800 and better versions under al-Ma'mun;
  Sicilian Latin c. 1160 little known; Gerard 1175; Copernicus 1543 "cast in a firm Ptolemaic mold"; Kepler; Geography in
  Latin by Jacobus Angelus c. 1406 and the basis of most 15th–16th-century cartography; Heiberg the standard text; Basel 1538
  editio princeps with Theon's commentary; "The Ptolemaic system is indeed named after the right man."
- Suda Π 3033 in the Scroll (4.Π.3033): «Πτολεμαῖοϲ, ὁ Κλαύδιοϲ χρηματίϲαϲ, Ἀλεξανδρεύϲ, φιλόϲοφοϲ», under Marcus; lists
  Mechanics in 3 books, Phaseis, Planisphaerium, Handy Table, the Great Astronomer or Syntaxis.
- Robbins, Loeb Tetrabiblos (1940), Introduction and Book I §§ 1–3 on LacusCurtius: personal history pieced together from his
  works, scholia and late notices; Ptolemais and age 78 "probably" reliable (Abulwafa, 11th c.); the physiognomic portrait;
  latest observation 151 (Boll) but "a very slight change in the text of Almagest X.1" would give 141; "almost the authority
  of a Bible"; "a difficult author even for the ancients", "long, involved sentences"; at least 35 manuscripts, none before
  the 13th century; the 10th-century manuscript of the Paraphrase (Vat. gr. 1453); Ishaq ibn Hunayn's Arabic (9th c.);
  Plato of Tivoli 1138; Camerarius' first edition, Nuremberg 1535, from N with his printer's marks; the two endings (the
  borrowed one "certainly" spurious; P's ending in the Arabic too; both printed); the titles (Μαθηματικὴ τετράβιβλος σύνταξις,
  ἀποτελεσματικά, συμπερασματικά); note 2 identifies "its own treatise" as the Almagest.
- Wikipedia, Ptolemy: Meliteniotes 14th-century; astronomy most of his time; mathematics above theology; Plato of Tivoli 1138;
  Geography maps c. 1300 after Planudes; Delambre early 1800s.
- Wikipedia, Almagest: μεγίστη / al-majisṭī; equant as a third device; Hamilton: not completed before about 150; the
  commentaries of Theon (extant), Pappus (fragments), Ammonius (lost); Gerard at Toledo 1175; Α/Δ and Arabic 3/8 confusions;
  Gerard's 300° latitudes; Newton (1977) "the most successful fraud in the history of science"; Gingerich "some remarkably
  fishy numbers"; Toomer 1984, 2nd ed. 1998.
- Wikipedia, Theon of Alexandria: c. 335–c. 405; the Handy Tables often credited to him, but no manuscript names him and the
  tables are thought very close to Ptolemy's.
- Tolsa, GRBS 54 (2014): Anth. Pal. 9.577; Paton's translation "slightly modified"; Synesius' astrolabe shortly before 400,
  "old", no author named; the poem in two of three branches (BC by the main scribe; D and G by a later hand); manuscripts A
  (Par. gr. 2389, 9th c., very few scholia), B (Vat. gr. 1594, third quarter 9th c., two columns, older scholia in capitals),
  C (Marc. gr. 313, late 9th–early 10th), D (Vat. gr. 180, 10th), G (Vat. gr. 184, 1269–70, used by Heiberg for books 7–13);
  ancestor of BC from the 6th-century Neoplatonic school of Heliodorus and Ammonius, which added the preliminary material
  incl. the Canobic Inscription; two variants in the Almagest MSS fitted to the preface; the manuscripts led the anthologies to
  name Ptolemy; Paton "Ptolemy: uncertain, which".
- Jones, AJP 129 (2008), review of Stückelberger–Grasshoff: some 8,000 place names with coordinates; no manuscript older than the
  late 13th century; two recensions parted before minuscule if not in antiquity; Vat. gr. 191 (X) stops giving coordinates a
  little over halfway; the other group with the oldest Ptolemaic maps; numbers corrected by map-makers; origin of the maps
  "controversial"; Nobbe (1843–45) with no real apparatus; the Berne team's complete critical edition (Schwabe, 2006) with
  German translation and reconstructed maps.
- Scroll passages (all Greek copied from passage.ts): Almagest 1.toc (μαθηματικῆς συντάξεως; the chapter headings on the earth
  in the middle and not moving), 1.1 (ὦ Σύρε; mathematics alone gives sure knowledge; lovers of divine beauty), 3.1 (simplest
  hypotheses), 13.2 (no one should think such hypotheses troublesome), 10.1 (τῷ ιδʹ ἔτει Ἀντωνίνου, the only Antoninus date in
  that chapter); Tetrabiblos 1.1 (title; ὦ Σύρε; κατʼ ἰδίαν σύνταξιν … περιώδευται); On Music 1–27.
- LSJ (site's copy): κατασκελής, "the meagreness or inadequacy of human contrivances. Ptol. Alm. 13.2"; ἐπιτέχνημα "devices,
  Ptol. Alm. 13.2"; ἐργώδης "difficult, troublesome"; εἴδησις "knowledge".
- Wikipedia, List of editiones principes in Greek: Geography, Basel 1533 (Froben); Almagest, Basel 1538 (Walder), with a
  commentary mostly Theon's, Pappus for book 5.
- Editions: Scroll file headers (Heiberg 1898; Boll–Boer 1954; Robbins 1964 printing; von Jan 1895); Internet Archive record of
  the Michigan copy of the Opera omnia (Heiberg 1898–1903 and 1907; Boll–Boer Apotelesmatica 1940; Lammert and Boer 1961);
  Princeton UP page for Toomer's Almagest (1998; based on Heiberg; "numerous corrections derived from medieval Arabic
  translations"); Hübner's publication list at Münster (Apotelesmatika, Teubner, Stuttgart–Leipzig 1998, after Boll and
  Boer); Princeton UP page for Berggren–Jones (copyright 2000); Leonardo review (the subtitle; Books 1, 2, 7 and 8 translated).

**Left out because it could not be confirmed**
- "Translated into Arabic at Baghdad" in 827 (draft timeline): Toomer gives about 800, with better ninth-century translations
  under al-Ma'mun; Wikipedia names Sahl ibn Bishr as perhaps the first translator. Only "about 800" is kept.
- Simon Grynaeus as editor of the 1538 Greek Almagest (draft): Wikipedia's list names Joachim Camerarius; Toomer names no
  editor. The editor is not named in the article.
- Par. gr. 2389 "largely in capitals", Vat. gr. 1594 "the finest witness, rich in notes": Tolsa says A has very few scholia
  and describes B's layered notes, but neither "largely in capitals" nor "finest witness" was found.
- "Editors must check the numerals against Ptolemy's own calculations": not found as stated; kept only the documented copying
  confusions and Toomer's corrections from the Arabic.
- Sexagesimal fractions "which is why we still divide degrees and hours into sixty minutes": Toomer says Greek astronomy took
  over the Babylonian sexagesimal system, but the modern-legacy claim was not checked against a source; dropped.
- "His Greek is the clear, technical prose of Hellenistic science" and "the introductory chapters are approachable": opinions
  without a source; the article instead sets Toomer's "masterpiece of clarity" beside Robbins's "difficult author".
- Theon's daughter Hypatia and Almagest book 3 (Wikipedia, Theon): cut; the nature of her work is disputed and was not checked
  further.
- The 2022 palimpsest fragments of Hipparchus' star catalogue (Wikipedia, Ptolemy): cut for length, not checked further.
- Olympiodorus' date: Toomer says sixth century, Robbins (note 5) says fourth; Toomer's is kept (the more recent specialist
  account); worth checking.
- The Analemma (Moerbeke's Latin) and the attempt on the parallel postulate: confirmed in Toomer but cut for length.
- Wikipedia's "about 6,300 places with coordinates" for the Geography: not used; Jones's "some eight thousand place names" kept.

**Corrected from the draft**
- "Observations ... dated between 127 and 141" kept, but the 141/151 problem is now shown: Heiberg's text of Alm. 10.1 has
  τῷ ιδʹ ἔτει Ἀντωνίνου (fourteenth year), which Boll took as 151; Robbins notes a slight change gives 141; Toomer: 2 February 141.
- "Arab astronomers called it al-majisti ('the greatest')": al-majisṭī is the Arabic form of Greek megistē, "greatest"
  (Wikipedia; Toomer), not an Arabic word meaning "greatest".
- "Tetrabiblos, the standard ancient textbook of astrology": Robbins's "almost the authority of a Bible" is quoted, but Toomer
  says it never had an authority in its field like the Almagest's (the article avoids "standard").
- "Geography giving coordinates for some 8,000 places" → "a list of some eight thousand places with their longitudes and
  latitudes" (Jones), with the two recensions and the disputed origin of the maps.
- "K. von Jan, Musici Scriptores Graeci — the musical text used here": the Scroll's *On Music* is a set of 27 short notes under
  Ptolemy's name, not the *Harmonics*; the Harmonics' edition is Düring (1930, per Toomer), not used in the Scroll.
- "F. Boll and E. Boer's Teubner edition (1954 printing)": the edition first appeared in 1940 (Internet Archive record; Robbins's
  1980 note); the Scroll's file names 1954. Hübner's revision is 1998 (Stuttgart and Leipzig).
- "Toomer, Ptolemy's Almagest (London, 1984)": the place could not be confirmed (a Wikipedia link says Duckworth); printed as
  1984 and Princeton 1998.
- "Writes the Almagest (c. 150), followed by the Tetrabiblos, Geography and Harmonics": the Almagest is not finished before
  about 150 (Hamilton, via Wikipedia); the Tetrabiblos, Geography and others come after it (Toomer); the Harmonics' place in
  the order is not fixed, so it is not named in the timeline.
- "Theon of Alexandria writes a commentary on the Almagest (370)": Toomer gives fl. 360; Wikipedia's Theon observed eclipses in 364.
  Timeline mark at about 360.

**Weak points to revisit**
- Much rests on Toomer's DSB article (the MacTutor PDF is the encyclopedia.com text, whose
  Greek words dropped out in conversion and whose OCR garbles the Canobic year as "147-147"). The Canobic mark is placed at
  about 147 (Wikipedia: 147 or 148; Wikipedia's Ptolemy page: 146–147).
- The Theon/Handy Tables question: Toomer speaks of "the revised version of Theon", Wikipedia's Theon page says no manuscript
  names him. The article says "usually credited to Theon".
- Jones's review was read in an OCR text in which the Greek sigla of the Geography's two recensions are garbled; the article
  avoids the sigla.
- Toomer's Almagest translation and the Berggren–Jones volume were confirmed only by publisher pages and a review, not opened.
- The Tetrabiblos opening line in Robbins's English was read on LacusCurtius; the Scroll has only his Greek.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/ptolemy.md):** 9 findings, each checked against the
cited passage or page (Almagest 3.1 in the Scroll; Toomer's DSB article; Robbins's Loeb introduction on LacusCurtius; Wikipedia,
Ptolemy, Almagest and the list of editiones principes), all corrected: Boll himself saw the 141 reading and kept 151, and Robbins
followed him (Toomer's own reading of the passage, reported only on a commentary site, not added); Toomer allows Meliteniotes'
Ptolemais "could be correct"; astronomy the subject of most time, about half the works; the Almagest the earliest of the major
works; the Suda the only formal biographical notice (not "ancient"); Gerard "apparently" learned from the Moors; the 1538
commentary has Cabasilas for book 3; the poem's changed readings in B, C and D; the proviso to the rule of simple hypotheses.

## Epicurus (tlg0537), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0537.ts` (44 sources). Started fresh: the earlier, interrupted attempt's notes in the scratchpad were used only as leads, and every page and passage below was opened again for this check.

**Confirmed and kept**
- Life: Diogenes Laertius 10.1–2 in the Scroll (Hicks): son of Neocles and Chaerestrate, deme Gargettus; brought up on Samos where Athenians had settled; Athens at eighteen; joined his father at Colophon after the expulsion by Perdiccas; philosophy at fourteen (his own words); the schoolmasters and Hesiod's Chaos (Apollodorus the Epicurean). Stanford Encyclopedia (Konstan, rev. 2022): 341 and 323 as the dates; Colophon in 321, "on the coast of what is now Turkey"; Nausiphanes, a Democritean; "Ten years later" Mytilene and Lampsacus; back in Athens 307/06; death in 270 "at the age of seventy or seventy-one"; the Garden as the name of the school. Wikipedia (Epicurus): required military training at Athens; teaching at Mytilene around 311; the Garden (κῆπος); women students including Themista and Leontion.
- Diogenes 10.3 (brothers and the slave Mys), 10.9 (the School continuing while nearly all others had died out), 10.10 (garden for eighty minae, friends from all parts, servants as members), 10.11 (the pot of cheese), 10.13 (Nausiphanes denied, "self-taught"; ordinary words; "so lucid a writer…"), 10.14–15 (Hermarchus: renal calculus, a fortnight; seventy-two), 10.16–23 (will: garden for Hermarchus and the School; Mys, Nicias, Lycon and Phaedrium freed; the children of Metrodorus, who died seven years before him; the letter to Idomeneus, quoted from Hicks), 10.12 (Diocles: treatises learnt by heart), 10.26–29 (about three hundred rolls; On Nature in thirty-seven books; three letters as epitome), 10.35 (the Letter to Herodotus calls itself an epitome).
- Heading of Hicks's translation of book 10 in the Scroll: "EPICURUS (341-271 B.C.)". Hicks's Greek and English are both from the Harvard/Heinemann edition of 1925 (both file headers).
- Wikipedia (Epicurus): the letter to Idomeneus "uncertain", but "the vast majority of scholars accept it as genuine"; forty Principal Doctrines; the tetrapharmakos (first four doctrines; name from a compound of four drugs; Roman-era Epicureans; Hutchinson's translation of Philodemus, PHerc. 1005, quoted exactly); Letter to Menoeceus in an eloquent style similar to Isocrates'; letter to his mother at Oenoanda, attributed to Epicurus by the majority of scholars; 1888 and eighty-one sayings; Christian critics; "virtually extinct" by the early fifth century; Dante's burning tombs; Poggio 1417.
- SEP: Diogenes Laertius third century, tenth and final book; the three letters and their subjects; Principal Doctrines and Vatican Sayings meant to make doctrine easy to remember; On Nature from the Herculaneum villa buried in 79; the library almost certainly Philodemus' working collection; Lucretius' six books of hexameter verse; Cicero's hostile criticism, especially of the ethics; atoms and void inherited from Democritus; the swerve known "chiefly from later sources, including Lucretius and Cicero", "not entirely clear how the swerve operates"; VS 52 in Konstan's English (quoted exactly); VS 23 "or is a virtue, if we follow the manuscript reading"; Letter to Menoeceus "a précis of Epicurean ethics"; Letter to Pythocles "sufficient reason to attribute it to the founder"; Arrighetti 1973 the standard edition (Einaudi, Turin); Usener 1887 still the fullest collection; Bailey 1926; Long and Sedley 1987; Dorandi 2013; Mensch 2018; Inwood and Gerson 1997.
- Quotations from the Scroll, copied from `scripts/passage.ts`: Diogenes 10.39 (τὸ πᾶν ἐστι σώματα καὶ κενόν; the bracketed note on the Larger Epitome), 10.122, 10.123, 10.124–125, 10.127–128 (ἀταραξίαν), 10.130–132, 10.133 (διαγελῶντος; "Destiny … he laughs to scorn"), 10.135 (ζήσεις δὲ ὡς θεὸς ἐν ἀνθρώποις), 10.139 (Principal Doctrines 1–2 and the note "Elsewhere he says"), 10.140 (Doctrine 5 with angle brackets), 10.148 (Doctrine 27); von der Mühll's Greek: Menoeceus 132 (angle brackets) and 133 (†ἀγγέλλοντος * *), Vatican Sayings 5, 10, 14, 23, 52; Iliad 1.70; Plutarch, That One Cannot Live Pleasantly 1 and Against Colotes 1; Plutarch, "Live Unnoticed" 2–4 (λάθε βιώσας; Epicurus addressed by name; letters to friends in Asia; books sent to men and women); Lucian, Alexander 47.
- LSJ (site's copy): κῆπος "garden"; ἀταραξία "impassiveness, calmness"; διαγελάω "laugh at, mock"; ἀγγέλλω "announce"; αἱρετός "to be chosen"; καιρός "exact or critical time, season, opportunity"; χαίρω "rejoice".
- Von der Mühll, Teubner 1922 (Internet Archive scan; preface read in the OCR text, pages 49, 50, 61 and 62 read from the page images): "Epicuri parcam et obscuram brevitatem" (our translation "sparing and obscure brevity"); two classes of manuscripts; B (Burbonicus III B 29, twelfth century, Naples); P (Parisinus gr. 1759, written at the beginning of the fourteenth century); F (Laurentianus 69.13, thirteenth century); a single, very faulty copy of Diogenes found at Constantinople "saeculo circiter nono" ("suspicamur"); Diogenes' marginal notes woven into the text, sometimes hard to separate, especially in Herodotus and thoroughly in Pythocles; Pythocles doubted by scholars and already in antiquity (Philodemus), but genuine in his view; Principal Doctrines all by Epicurus, though the Oenoanda inscription shows a varied order; the Vatican Gnomologium in Vat. gr. 1950, fourteenth century, found by K. Wotke in 1888 and first edited by Usener in Wiener Studien 10; Usener's proof that it was made from Principal Doctrines and the letters of the four leaders (Epicurus, Metrodorus, Polyaenus, Hermarchus). Notes: Men. 132 "hiatum explevit Steph., cf. Rat. Sent. V"; Men. 133 ἀγγέλλοντος BFZf, "corruptum", the following lines "scholion"; διαγελῶντος ⟨…⟩ "suppl. Us."; VS 5 = Sent. V; VS 10 = Metrodori fr. 37 Koerte, Hom. Il. A 70; VS 14 κύριος "Stob.: om. Vat.", τὸν καιρόν "Stob.: τὸ χαῖρον Vat."; VS 23 "ἀρετή Vat., corr. Us.".
- Bailey, Epicurus: The Extant Remains (1926, Internet Archive scan): "the extreme difficulty of the writings of Epicurus"; the remains embodied in Diogenes book 10, so the text of Epicurus is that of the manuscripts of Diogenes; two classes; B parchment, twelfth century, Naples; P much corrected, beginning of the fourteenth century; F dated twelfth century by Usener, thirteenth by von der Mühll; scholia interwoven, especially in Herodotus and Pythocles; Bailey inclines to Usener's view that Pythocles is an Epicurean compilation; sixteenth-century editors had inferior manuscripts but some of their conjectures survive; Stephanus 1570; Gassendi "revived the serious study of Epicureanism and may be said to have introduced the theory of atomism to the modern world", his book 10 of 1649 "practically re-wrote the text"; Usener's Epicurea (1887) a fresh start from the manuscripts and a collection from the whole range of classical literature; von der Mühll re-read the manuscripts and added five; Vat. gr. 1950, fourteenth century, first published by C. Wotke with notes by Usener and Gomperz, Wiener Studien 10 (1888).
- Wikipedia (Diogenes Laertius): B twelfth century, Naples; P eleventh/twelfth century (after Dorandi 2013); F thirteenth century; Traversari's Latin printed at Rome in 1472; first whole Greek text by Froben, 1533; Estienne 1570; Meibom's numbering of 1692 "still in use today"; Long (OCT 1964), Marcovich (Teubner 1999–2002), Dorandi (Cambridge 2013). Wikipedia (List of editiones principes in Greek): Froben, Basel, 1533.
- Wikipedia (Diogenes of Oenoanda): second century; now Hadrianic (117–138), once late second century; about 25,000 words; a portico wall; discovered 1884, first 64 fragments published 1892; "to help also those who come after us"; wealthy; letters of Epicurus including one to his mother. Wikipedia (Lucretius): Cicero's letter of February 54 BC; poem almost lost in the Middle Ages, rediscovered in 1417 by Poggio. Wikipedia (Villa of the Papyri): found 1750, first rolls 1752. Wikipedia (Herculaneum papyri): first rolls autumn 1752; Piaggio's machine from 1756, silk threads, beginning of every roll destroyed (Barker, 1908, quoted there); large parts of On Nature books 14, 15, 25, 28. Wikipedia (Crux): the dagger marks a passage the editor cannot mend. Wikipedia (Leiden Conventions): ⟨abc⟩ for letters omitted and restored by the editor.
- Catalogue and TEI headers: the Scroll's Greek of the letters, Principal Doctrines and Vatican Sayings is von der Mühll (Leipzig: Teubner, 1922), digitised by Open Greek and Latin.

**Left out because it could not be confirmed**
- "His school's motto was λάθε βιώσας": no source read calls it the school's motto. Kept only as a precept Plutarch attacked in a whole essay addressed to Epicurus.
- A house and garden "outside the city walls": not in any source read.
- The Greek word *ephebeia* for his military service (only "required military training" in Wikipedia).
- His birthday: Diogenes gives the 7th of Gamelion (10.14) and the 10th in the will (10.18); Wikipedia says the 20th. Left out.
- "Almost all of his vast output is lost" in those words; replaced by Diogenes' three hundred rolls and the short works that survive whole.
- Lucretius' poem dated "-55": no date for the poem found; Cicero's letter of February 54 BC is used instead.
- That readings of the Herculaneum papyri of Epicurus "continue to change as new imaging methods are applied": the recent imaging news on Wikipedia concerns Philodemus and a Stoic treatise, not Epicurus' own books.
- Wikipedia's "assets of all the members held in common": contradicted by Diogenes 10.11 (Epicurus rejected common property). Not used.
- Arrighetti's first edition (1960), the Hackett *Epicurus Reader* as a separate book, the "Epicurean epitaph", the "Epicurean paradox", the giraffe gift of P.Herc. 1521.
- That the Garden lay "between the Stoa and the Academy" (Wikipedia, citing Konstan; not found in the SEP text read).

**Corrected from the draft**
- "341–270 BCE": kept, but marked {debated}: SEP says he died in 270 aged seventy or seventy-one; Diogenes says seventy-two; Hicks's heading gives 341–271.
- "Came to Athens for his military training (ephebeia) in 323": Diogenes only says he came at eighteen; the military training is Wikipedia's ("it seems").
- "Begins teaching at Mytilene, then at Lampsacus" dated 311: marked approximate ("ten years later" than 321 in SEP; "around 311" in Wikipedia).
- "Returned to Athens in 306": 307/6 (SEP).
- "Diogenes Laertius says he wrote some three hundred books": "about three hundred rolls" (Hicks).
- "A collection of sayings discovered in a Vatican manuscript in 1888 … eighty-one maxims by Epicurus and his followers": kept, with the manuscript (Vat. gr. 1950, fourteenth century), the finder (Wotke) and the disagreement over who first edited it (Bailey: Wotke with notes by Usener and Gomperz; von der Mühll: Usener).
- "Karl Wotke": the sources give only "C. Wotke" / "K. Wotke"; the article writes "C. Wotke" as Bailey does, without a first name.
- "Usener's Epicurea collects the fragments": kept, with SEP's "still the fullest collection".
- "Herculaneum rolls found 1752": kept as the first rolls (the villa itself was found in 1750).
- "The Letter to Pythocles may have been written by a pupil": now set out as a debate (von der Mühll and SEP for genuine; Bailey and Usener for a compilation; doubts already in Philodemus).
- "The Letter to Menoeceus … is the clearest introduction": kept as advice ("a good place to begin"), resting on SEP's "précis of Epicurean ethics" and Wikipedia's "eloquent style".
- Editions: "von der Mühll (Teubner, 1922), the Greek text used here" confirmed by the TEI headers; Usener, Arrighetti (2nd ed., Turin, 1973), Bailey (Oxford, 1926), Long–Sedley (Cambridge, 1987) confirmed by SEP; Hicks (1925), Dorandi (2013) with Mensch (2018) and Inwood–Gerson (1997) added.

**Weak points to revisit**
- The OCR of Bailey's introduction twice reads "1523" for Froben's first edition, while his own list of sigla reads "MDXXXIII" (1533) and both Wikipedia pages give 1533; von der Mühll's OCR also reads "1523". 1533 is used; the page images of Bailey p. 11 were not opened to settle whether the book itself has a misprint.
- The date of manuscript P differs: early fourteenth century (von der Mühll, Bailey) against eleventh/twelfth (Dorandi 2013, as reported by Wikipedia; Dorandi himself was not opened). Both are given.
- The von der Mühll critical notes were read from page images; the Latin is clear, but "quattuorvirorum principum sectae Epicuri Metrodori Polyaeni Hermarchi" is read as "the four leaders, Epicurus, Metrodorus, Polyaenus and Hermarchus".
- The tetrapharmakos wording is Hutchinson's translation as quoted by Wikipedia (Hackett, 1994); the book was not opened.
- Cicero's letter, the Oenoanda details, the Herculaneum dates and the editions of Diogenes rest on Wikipedia pages.
- Konstan's English for VS 52 and his note on VS 23 are from SEP, not from a printed translation.
- The Hicks Diogenes is not called "Loeb" in the article (the file headers do not say so).

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/epicurus.md):** 8 findings, each checked against the
cited passage or page (Diogenes Laertius 10.1.1, 10.1.11, 10.1.15–17 in the Scroll; Wikipedia, Herculaneum papyri), all corrected: B
"the chief manuscript", the oldest of the better class "in Bailey's account"; the will left the property to two friends in trust, to
keep the garden for Hermarchus and the school; the tetrapharmakos lines named as D. S. Hutchinson's free English; the Villa's 1750
footnoted to source 33 only; Hicks brackets such notes "for example"; the deme Gargettus is Epicurus' own; the cheese letter's
addressee not named; "a stone blocked his urine" for Hicks's "renal calculus".

## Epictetus (tlg0557), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0557.ts` (41 sources). Written fresh from the old-site draft's list of claims; every page and
passage below was opened for this check.

**Confirmed and kept**
- Life: SEP (Graver, rev. 2025): born in the 50s at Hierapolis; slave of Epaphroditus, an administrator at Nero's court; studied
  with Musonius Rufus, "a Roman senator and Stoic philosopher who taught intermittently at Rome"; freed, lectured on his own
  account; left Rome under Domitian's edict "(in 89)"; school at Nicopolis, "an important communications hub and administrative
  center", on the Adriatic coast of north-western Greece; taught there until his death around 135; the Discourses dated around
  108 (Millar); limp attributed to arthritis or abuse; never married, adopted a child; four books of an original "eight or
  more"; Koine, unlike Arrian's literary Greek; Dobbin's view that Epictetus composed them; the Encheiridion can mislead;
  volition (prohairesis); Origen, Contra Celsum 6.2; Simplicius' commentary; Poliziano 1497; Pascal; Descartes; Tom Wolfe's
  A Man in Full (1998); editions of Schenkl 1916, Oldfather, Souilhé, Waterfield 2022, Dobbin 1998, Boter 1999.
- Boter, "Epictetus", Catalogus Translationum et Commentariorum 9 (2011), the "Fortuna" (scanned PDF, pages 2–10 read from the
  page images): Suda E 2424; born probably about 50; Pisidian inscription (mother a slave), "whether or not this is true"; "certain"
  that he came to Rome as a slave of Epaphroditus, freedman and secretary of Nero; the name means "acquired", no proof of later
  enslavement; banished by Domitian in 94; death "generally placed about 125–30", the Suda "until the time of Marcus Aurelius
  (161–80)"; published nothing; the names of the work and the debate over one work or several; quantity lost "a matter of
  speculation"; Simplicius on Arrian compiling the Encheiridion; "some twenty manuscripts"; Bodl. Auct. T. 4. 13 copied ca. 1100,
  source of all others, proved by the lacuna at the stain on fol. 25 (Mowat 1876); Encheiridion and Christian adaptations in more
  than a hundred manuscripts, chief witnesses s. XIV–XV; Gellius 1.2, 2.18.10, 15.11.5, 17.19.6 ("bear and forbear"), 19.1.14–21;
  Hadrian (HA 16.10); Lucian's lamp; Celsus first tells the leg story; Marcus Aurelius and Rusticus; Stobaeus 21 Encheiridion
  passages against 4 from the Discourses; the three Christian adaptations (Nil., Par., Vat.), names changed (Paul, Solomon), Par.
  on Job 1:21 and Gospel passages for Plato; oldest MSS s. X; Arethas and the scholia in the Bodleian MS (Schenkl's view); Photius
  codex 58; Perotti 1450, Poliziano 1479 printed 1497; Simplicius' commentary with most of the Encheiridion, Venice 1528;
  Haloander's complete Greek Encheiridion, Nuremberg 1529; Discourses Venice 1535; Carter, London, 1758; Upton 1739–41;
  Schweighäuser 1798 and 1799–1800, "the standard for the next century"; Schenkl 1894, first based on the Bodleian MS, still
  standard; Boter 1999; Albert Ellis and Encheiridion 5; Tom Wolfe.
- Oldfather, Loeb vol. 1 (Internet Archive, reprint of 1956, "First printed 1925"; the Heinemann/Putnam issue dated 1926 is also
  there): slave woman's son; Epaphroditus "the freedman and administrative secretary of Nero"; lessons from Musonius while in his
  service; lame, the stories (Celsus, Origen, Suidas' rheumatism, Simplicius "lame from an early period of his life"); took a wife
  in old age to bring up a child; the iron lamp; banishment "presumably in A.D. 89 or 92"; Nicopolis; life "ca. A.D. 50–120"; wrote
  nothing for publication; Koine against Arrian's Attic; the editio princeps by Trincavelli, Venice 1535, "from a singularly faulty
  MS."; Schegk 1554, Wolf 1560, Upton 1739–41, Schweighäuser 1799–1800 (Encheiridion 1798), Schenkl 1894 / 1898 / 1916; the
  Bodleian MS Misc. Graec. 251, s. xi/xii, shown by Schenkl and Mowat to be the archetype; "must have survived the Middle Ages in
  only a single exemplar"; the anonymous epigram (Macnaghten's translation; Macrobius' ascription "a patent absurdity"); notes on
  1.18.10: εἰσενέγκῃς (Mowat), φιλοψογούντων (Schenkl), μωρούς supplied by Capps "for a lacuna of about five letters in S"; the
  English "do not introduce those words which the multitude of the censorious use".
- Oldfather, Loeb vol. 2 (Internet Archive, reprint of 1959, "First printed 1928"; Heinemann/Putnam 1928 issue also there):
  Encheiridion "a compilation made by Arrian himself", somewhat more than half from the four books; Simplicius' commentary "more
  than ten times the bulk of the original"; Ench. 29 = Disc. 3.15, omitted in Par., not commented on by Simplicius, "may have been
  added in some second edition, whether by Arrian or not"; Upton's readings from the Discourses (παρορύσσεσθαι for παρέρχεσθαι /
  παρέχεσθαι; ἐκβαλεῖν for βαλεῖν, λαβεῖν, βλαβεῖν); "dig in"; the Fragments: genuine ones "not very numerous", doubtful
  aphorisms from Stobaeus and the gnomology "purporting to contain excerpts from Democritus, Isocrates, and Epictetus", doubted by
  Schenkl, Asmus and Elter.
- Wikipedia (Epictetus): Hierapolis = Pamukkale; name unknown, "gained"/"acquired"; banishment around 93; lived alone, adopted a
  friend's child, Simplicius ambiguous on marriage. Wikipedia (Discourses of Epictetus): titles; about 108, Trajan's coins (4.5.17);
  Bodleian MS twelfth century and the stain; Trincavelli 1535; English translations (Carter 1758, Higginson 1865, Long 1877, Hard
  2014). Wikipedia (Enchiridion of Epictetus): 53 chapters; ch. 29; Perotti 1450, Poliziano 1479, first printed 1497; 1528 with
  Simplicius. Wikipedia (Arrian): Nicomedia in Bithynia; consul about 130; Anabasis of Alexander; "young Xenophon". Wikipedia (List of
  editiones principes in Greek): Encheiridion with Simplicius, Venice 1528, complete text 1529 (Haloander); Discourses, Venice 1535.
- Lindsay, An Introduction to Latin Textual Emendation (1896), p. 43 (Internet Archive): the Bodleian MS of Arrian's Dissertations,
  fol. 25, a large portion illegible "apparently by the pressure of some heavy weight, the leg of a chair perhaps"; all other MSS
  copied from it.
- Photius, Bibliotheca codex 58 (Freese 1920, tertullian.org): eight books of Lectures and twelve of Conversations.
- Gellius on LacusCurtius: 15.11.3–5 (Latin: Domitian's senatus consultum; Epictetus left Rome for Nicopolis); 19.1.14 (the fifth
  book); 17.19 (Favorinus; anechou et apechou); 1.2 in Rolfe's Loeb English (Herodes, "the first volume", Rolfe's note "Actually
  the second book, II.19", and the Homer line). Historia Augusta, Hadrian 16.10 (Magie, LacusCurtius): checked, then cut for length.
- Scroll passages (copied from scripts/passage.ts): Suda E 2424 and A 3868; Arrian's preface 0.0.1–8; Disc. 1.1.1, 1.1.22–24,
  1.9.29–30, 1.16.20–21, 1.18.8–16 (gaps at 1.18.10; the iron lamp), 2.6.20, 2.19.12–13, 3.15.1–5, 3.23.30, 4.5.17; Handbook 1, 5,
  9, 17, 29, 53; Fragments 1 (heading) and 10; Gnomologium Epicteteum; Origen, Against Celsus 6.2 and 7.53; Lucian, Ignorant
  Book-Collector 13 and Alexander 2; Marcus Aurelius 1.7.3 and 4.41.
- LSJ (site's copy): ἐπίκτητος "gained besides or in addition"; ἐγχειρίδιος "in the hand … manual, handbook"; προαίρεσις "choosing
  one thing before another; purpose, resolution"; ἀναγκοτροφέω "eat by regimen, not after one's own appetite, like athletes, Epict.
  Ench. 29.2"; ἀναγκοφαγέω = ἀναγκοτροφέω, Arr. Epict. 3.15.3; ἰατρεῖον "surgery".
- Catalogue / TEI headers: Schenkl, Teubner editio maior 1916 (all the Greek); Long, George Bell and Sons, 1887; Higginson, Thomas
  Nelson and Sons, 1890.

**Left out because it could not be confirmed**
- "Born a slave" as a fact: only the Pisidian inscription says so (Boter: "whether or not this is true"). Kept as reported.
- Epaphroditus "let him study" with Musonius: no source says the master gave permission (Wikipedia says so, citing only the
  Discourses, which do not).
- A single date for Domitian's expulsion (SEP 89; Oldfather 89 or 92; Wikipedia about 93; Boter 94) and for the death.
- The draft's "Gnomologium Epictetum ... some are certainly by others": Oldfather says the doubts were serious enough to drop them,
  not that each is certainly by someone else; kept as doubtful.
- Wolf's edition date (Oldfather and Wikipedia 1560; Boter 1563 for the complete works, 1561 for the Encheiridion translation).
- Mowat's article date (Boter 1876, Oldfather 1877): the article names Mowat without a year.
- The Bodleian catalogue entry for Auct. T. 4. 13 (blocked by a bot check); the manuscript's date rests on Boter, Oldfather and
  Wikipedia.
- Hadrian's friendship (Historia Augusta 16.10), the epigram "Slave, poor as Irus" (Anthology 7.676, in a Greek edition the Scroll's
  default does not show), Epaphroditus' shoemaker (Disc. 1.19.19–22) and the Trajan coin (4.5.17): all checked, cut for length.
- James Stockdale, the Golden Sayings, the Altercatio Hadriani et Epicteti, Arrian's Homiliai as a separate work (Oldfather doubts it).

**Corrected from the draft**
- "Born a slave at Hierapolis" → from Hierapolis (Suda); the slave birth only reported (inscription), slavery at Rome certain.
- "(c. 50–c. 135)" → kept as about 50 to about 135, with the disagreements (SEP, Boter, Oldfather ca. 50–120, Suda) marked {debated}.
- "Domitian expelled the philosophers from Italy (c. 93)" → date marked {debated} with all four datings; Gellius quoted for the decree.
- "Like Socrates, Epictetus wrote nothing" → "published nothing" (Oldfather; Boter "did not publish anything himself"), with Dobbin's
  dissent.
- "an eleventh- or twelfth-century codex in the Bodleian Library at Oxford (Auct. T. 4. 13, S)" → copied about 1100 (Boter),
  s. xi/xii (Oldfather); the proof by the stain added (Lindsay, Boter).
- "Angelo Poliziano's Latin translation of the Handbook is printed, the first printed edition of any of his work" → the first
  printed edition of the Handbook (Wikipedia, Boter); "of any of his work" not stated by the sources.
- "Marcus Aurelius learned from these notes" → Marcus thanks Rusticus for the ὑπομνήματα of Epictetus and quotes him (1.7.3, 4.41).
- "Christian monks adapted the Handbook" → three adaptations, the oldest manuscripts tenth century (Boter).
- "T. W. Higginson, The Works of Epictetus (1865) — the translations used here" → the Scroll uses the 1890 Nelson printing.
- "W. A. Oldfather (Loeb, 1925–28)" → publisher given as Heinemann and Putnam (title pages of the first issues), later Harvard.

**Weak points to revisit**
- Boter's article was read from page images of a scanned PDF (pages 2–10 only; the bibliography of translations was not read).
- The Oldfather volumes read are later reprints; the first-issue title pages (Heinemann/Putnam, vol. 1 dated 1926, vol. 2 1928)
  were checked only in the OCR text.
- Oldfather's note crediting φιλοψογούντων to "Schenkl" is read from OCR ("Schenkl: φ . . . των S"); the article says only that the
  words are modern restorations by Mowat, Schenkl and Capps, as his notes list them.
- The identification of the Scroll's Gnomologium Epicteteum with the doubtful material Oldfather left out is general (both are
  Stobaeus-based gnomic collections); Oldfather does not name Schenkl's Gnomologium as such.
- The Gellius Latin on LacusCurtius comes from an unnamed online edition (Thayer's note); the English of book 1 is Rolfe's.
- Arrian's consulship rests on the Suda and Wikipedia; Photius' translator Freese gives other dates in his note, not used.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/epictetus.md):** 8 findings, each checked against the
cited passage or page (Discourses 1.16.20 in the Scroll; the TEI headers; Wikipedia, Discourses of Epictetus and Contra Celsum), all
corrected: Origen's remark is in Against Celsus, about 248 (Wikipedia, Contra Celsum, added as source 42); Simplicius "chiefly", not
the only evidence on the marriage; the Discourses debate given at both extremes (Wirth: largely Arrian's; Dobbin: Epictetus' own) with
the mainstream between; "we owe to a pupil, Arrian"; the lame old man's hymn "without self-pity", not a joke; the 1528 Handbook "most of
it" (the checker's Nuremberg 1529 claim not added, being unchecked); the stain at 1.18 and "about 108" footnoted to source 33; Long's
header says 1890, the scan 1887. Outside the article: the checker reports that in the Scroll's Lucian, Demonax, Harmon's English is one
section off around §§54–56.

## Marcus Aurelius (tlg0562), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0562.ts` (24 sources). The Scroll has only the Greek of the *Meditations* (Leopold's text, `perseus-grc2`), with no English translation, so every English rendering of Marcus, of Herodian and of the Suda is our own and is listed in `outsideQuotes`. Greek quotations were copied from `scripts/passage.ts`. The Internet Archive scans of Leopold (1908) and Haines (1916) were read in their OCR text (Greek OCR is poor in places; Latin and English are clear).

**Confirmed and kept**
- Wikipedia (Marcus Aurelius): born in Rome 26 April 121; emperor 161–180; Stoic; last of the "Five Good Emperors"; father died when he was three; raised by mother and grandfather; Hadrian adopted Antoninus in 138, who adopted Marcus and Lucius; Greek tutors including Herodes Atticus, Latin tutor Fronto, "the most esteemed orators of their time"; Rusticus the strongest influence, who drew him away from oratory; acceded with Lucius Verus in 161; Parthian war; Marcomanni, Quadi, Iazyges; Antonine Plague broke out 165 or 166, Galen in Rome when it reached the city in 166; Lucius died 169, probably of the plague; Commodus co-ruler from 177; died 17 March 180 aged 58 at Vindobona or near Sirmium (Aurelius Victor against Tertullian); the Historia Augusta's lives of Avidius Cassius not reliable; Christians named only once (11.3); "Meditations" written in Greek on campaign between 170 and 180; equestrian statue c. 175, Capitoline Museums, the only Roman equestrian statue surviving into modern times; a favourite of Frederick the Great, Mill, Arnold, Goethe; 100,000 copies sold in 2019.
- Wikipedia (Marcomannic Wars): about 166–180.
- Wikipedia (Meditations): twelve books in Koine Greek; Swain's note that close imitation of Attic was not required since he wrote without thought of publication; the Quadi note (Granua = Hron, Slovakia) for Book 1 and Carnuntum for Book 2; unlikely to have been meant for publication; Herodian's remark "may refer" to the Meditations; Historia Augusta's story of the three days; Themistius' "doubtful" mention about 364 to Valens; Arethas before 907, letter to Demetrius of Heraclea, "so old indeed that it is altogether falling to pieces" (Farquharson's English); Arethas' scholia to Lucian and Dio, τὰ εἰς ἑαυτὸν ἠθικά, the title of the manuscript behind the first edition; Arethas' copy the likely ancestor; Suda late tenth century, "a directing (ἀγωγή) of his own life by Marcus the Emperor in twelve books", first mention of twelve books, about thirty quotations from books 1, 3, 4, 5, 9, 11; Tzetzes about 1150 (Books 4 and 5); Greek compilations of the 14th–16th centuries; P and A; A from Stefano Gradi's collection in 1683; 42 lines lost in A; Xylander's first edition "1558 or 1559" at Zurich, at Conrad Gesner's instigation, printed by Andreas Gesner, with Latin translation and notes; manuscript from Otto Heinrich's library through Toxites; second edition 1568 without access; translations of Hard and Gill (OUP 2011), Hammond (Penguin 2006), Hays (2002).
- Wikipedia (Wilhelm Xylander): 1558 first edition, Heidelberg manuscript now lost.
- IEP (John Sellars, "Marcus Aurelius"): personal notebook, probably written on campaign c. 171–175; no particular order; Book 1 may have been written separately; Themistius 364 the first recorded mention; the title ta eis heauton from a manuscript now lost, maybe a later addition, first recorded c. 900 (Arethas); text from the Vatican manuscript and the lost one behind the 1558 edition; Lucius' death and sole rule from 169; influence of Epictetus, quoted at 11.33–38; Marcus never calls himself a Stoic, open to other traditions; "From a modern perspective … certainly not in the first rank of ancient philosophers"; the book as written philosophical exercises; Hadot's 1978 article on the three topoi as "a key"; editions: Leopold OCT 1908, Haines Loeb (Heinemann 1916, later Harvard reprints), Farquharson 1944 2 vols ("arguably the definitive edition"), Dalfen Teubner 1979 / 2nd ed. 1987 (word index), Gataker 1652, Hadot, The Inner Citadel (trans. Chase, Harvard 1998), Hard (OUP 2011), Hammond (Penguin 2006), Hays (Weidenfeld & Nicolson 2003).
- Haines, Loeb 1916 (Internet Archive, London: Heinemann; New York: Putnam): preface "in many places corrupt beyond cure"; Teubner's text used as basis; introduction: "this small but priceless book of private devotional memoranda"; not known how it was preserved; the notes "shew that the second Book was composed … among the Quadi on the Gran, and the third at Carnuntum"; headquarters at Carnuntum 171–173; Schenkl: Book 1 written last; Book 1 probably written as a whole, the rest disconnected jottings; style abrupt and concise, words to be supplied; footnote: Marcus may mean this work by ὑπομνημάτια at 3.14; Epictetus "his true spiritual father"; Suda, Arethas (Cappadocian bishop), Tzetzes, Nicephorus, Planudes anthology in twenty-five or more MSS of practically no help; P "contains the whole work", first printed 1558; A, forty-two lines lost; D and C give some independent help; Casaubon's first English translation 1634; Gataker 1652 Cambridge with voluminous notes; Casaubon's Greek edition 1643. Notes on 1.17: τούτου PA, τὸ τοῦ ἐν Καιήτῃ "ὥσπερ χρήσῃ" Lofft; the Quadi note "may be intended either to conclude the first book or, more likely, head the second" (Gataker's point about τάδε). Note on 11.3: ὡς οἱ Χριστιανοί bracketed, "ungrammatical and pretty certainly a gloss"; the Note on Christians pp. 381–2 argues the same.
- Leopold, OCT 1908 (Internet Archive, Oxonii e typographeo Clarendoniano): preface: P = Xylander's edition from the Palatine library of Otto Heinrich (1558), the codex lost; A = Vat. gr. 1950, bombycinus, 14th century, fols. 341–392; first used by Cardinal Barberini 1675 for an Italian translation, copied in 1770 for de Joly, used by Schultz 1802 and Coraes 1816; D = Darmstadt 2773, 14th century; C = Paris suppl. gr. 319, 15th century; the X excerpt manuscripts, an anthology apparently by Planudes; all manuscripts closely related; P and A share lacunae and corruptions "sescenties", down to spelling, so from a common recension; P purer, A full of scribal faults but often keeps the genuine reading; Schultz's complaint; Xylander Zurich 1559 (sic, against 1558 in section I), Basel 1568; anonymous Lyon 1626 first divided the books into chapters (Xylander's translation had done much the same); Casaubon 1643, Gataker Cambridge 1652, de Joly Paris 1774, Schultz 1802, Stich Leipzig 1882 and 1903. Testimonia: Suda s.v. Μάρκος; Themistius Or. 6; Arethas scholia on Lucian (ἐν τοῖς εἰς ἑαυτὸν Ἠθικοῖς); Arethas' letter to Demetrius of Heraclea, Μάρκου τοῦ αὐτοκράτορος τὸ μεγαλωφελέστατον βιβλίον. Apparatus: Book 1 end: "A caret subscriptione et spatio trium fere versuum intermisso librum secundum instituit; P … exhibet, tria proxima capita subnectit, tum librum secundum inchoat per Μέμνησο"; Book 2 end: "subscriptione carent A D Mo 1: in P verba Τὰ ἐν Κ. libro tertio praefixa sunt"; 2.17: "ῥόμβος P adscripto ῥεμβός: ῥεμβός A D C Mo 1"; Leopold cites the Suda in his notes (e.g. at 1.5–1.6, s.v. Πρασιανός, ἀκενόσπουδον); he prints ὡς οἱ Χριστιανοί in 11.3 without brackets.
- LSJ (site's copy): ἡγεμονικόν "the authoritative part of the soul (reason), esp. in Stoic philosophy"; ἀποκαισαρόομαι, Pass., only M.Ant. 6.30; βάπτω "dip", "dye"; ῥόμβος bull-roarer, boy's toy, magic wheel, whirling motion; ῥεμβός "roaming, roving", ψυχή M.Ant. 2.17 (v.l.); ἀκενόσπουδος "shunning vain pursuits", M.Ant. 1.6.
- Scroll passages (Greek only): Med. 1.1, 1.6, 1.7 (Rusticus; Epictetus' ὑπομνήματα shared οἴκοθεν), 1.17.9 (Caieta; the Quadi note), 2.1, 2.2, 2.17 (the Carnuntum note; ῥόμβος), 3.5, 3.14, 4.3, 5.1, 6.30, 11.3, 12.36; Herodian 1.2.3 (his writings "that have come down to us"), 1.2.4 (μόνος τε βασιλέων …), 1.3.1–1.4.7 (illness, speech to friends, death after a night and a day); Suda α 830 (quoting 1.6, "Μάρκοϲ ὁ φιλόϲοφοϲ βαϲιλεύϲ") and α 1903 (quoting 3.5 with ἀναμένων where Leopold has περιμένων).
- Catalogue and TEI header: the Scroll's Greek is Leopold's 1908 text; the header gives "Teubner, Leipzig", but the Internet Archive scan it links to is the Oxford Clarendon Press edition (Scriptorum Classicorum Bibliotheca Oxoniensis), as IEP also says. The article names Oxford and points out the header's slip.

**Left out because it could not be confirmed**
- Epictetus as "the strongest single influence on the work" in those words: Wikipedia gives "the strongest influence" among his teachers to Rusticus; IEP and Haines support the influence of Epictetus, so the article says that instead.
- "Rusticus lent him the lecture notes of Epictetus": Marcus says only ὧν οἴκοθεν μετέδωκεν, "which he shared from his own house"; IEP says "borrowed a copy". Our rendering follows the Greek.
- The number of extracts in D: Haines's scan reads 119, Wikipedia (citing Haines) 112; Leopold's list counts about 111 chapters. The article says "more than a hundred passages".
- Dio's "kingdom of gold to one of iron and rust" and his books on Marcus: Dio books 71–72 are not in the Scroll (it stops at book 55); not used.
- The Antonine Plague's death toll; the "miraculous victory" of 174; Marcus' four chairs of philosophy at Athens (IEP) — not needed and not further checked.
- The Lyon 1626 edition's reading χρησμόν at 1.17 (in Leopold's OCR as "χρησμόν ed. Lugd."): the line-reference could not be tied with certainty in the OCR; left out. Haines's English rendering of the Caieta phrase was not quoted because the OCR of that line is garbled ("shall use itr").
- Theiler (Zürich 1951), Waterfield (2021), the Hickses (2002), Staniforth (1964), Long (1862): not given as editions (details not opened beyond the lists in Wikipedia and IEP).
- The Historia Augusta's date of the three-day discussion (Haines: before the last campaign, 178; Wikipedia: before the Marcomannic Wars): the article gives no date.

**Corrected from the draft**
- "The title found in the manuscripts, Τὰ εἰς ἑαυτόν": the title comes from the lost manuscript behind the first edition, may be a later addition, and is first recorded about 900 (IEP; Wikipedia).
- "The editio princeps by Xylander at Zürich, 1559": 1558 or 1559 (Leopold gives both; Wikipedia "1558 or 1559"; Haines, IEP and the Xylander page 1558).
- "A lost manuscript (T) that belonged to Michael Toxites": it came from the library of the Elector Palatine Otto Heinrich at Heidelberg; Toxites passed it to Gesner (Wikipedia; Leopold).
- "Vaticanus gr. 1950 … the only complete manuscript": kept, with Haines's 42 lost lines and Leopold's description (paper, 14th century).
- "Excerpts survive in Byzantine anthologies and in a manuscript at Darmstadt": kept, with D (14th century), C (Paris, 15th century) and the Planudean anthology, and Haines's judgement of their value.
- "The chapter numbers are early modern (Thomas Gataker, 1652)": Leopold gives the first division into chapters to the anonymous Lyon edition of 1626 (with Xylander's translation already divided much the same way); Gataker's 1652 edition is kept for its notes.
- "Notes … stand between Books 1–2 and 2–3, and it is disputed whether each belongs to the book before or after": confirmed and sharpened from Leopold's apparatus (P and A differ) and Haines ("more likely, head the second") against Wikipedia (Books 1 and 2).
- "Dies at Vindobona or Sirmium; the sources differ": confirmed (Wikipedia; Aurelius Victor against Tertullian); Herodian added.
- "Arethas … first clear evidence … around 900": confirmed as "before 907" (Wikipedia, after Farquharson).
- "Leopold (OCT, 1908) — the text used here": confirmed; the Scroll's TEI header wrongly says Teubner, Leipzig.
- "Haines (Loeb, 1916)": confirmed, publisher Heinemann and Putnam (Internet Archive record), not Harvard.
- "Dalfen (Teubner, 2nd ed. 1987)": confirmed, first edition 1979 (IEP). "Farquharson 1944, 2 vols, with commentary": confirmed (IEP).
- Added from sources: Herodian on Marcus (Scroll), the Suda's quotations and its reading ἀναμένων, the ῥόμβος/ῥεμβός variant, the Caieta crux, and the bracketing of ὡς οἱ Χριστιανοί.

**Weak points to revisit**
- Leopold's and Haines's apparatus were read in OCR; the Greek is garbled in places. The readings used (subscriptions, ῥόμβος/ῥεμβός, τούτου/τὸ τοῦ, the brackets in 11.3) are each clear in the OCR, but the page images were not opened.
- The Scroll's text has no chapter 12.18: its 12.17 ends with "ιη′" and the words of 12.18 (a digitisation quirk of the Perseus file, not an editor's variant). Not mentioned in the article.
- The date of the Suda: Wikipedia says late tenth century, Haines "about 900"; the article follows Wikipedia.
- Themistius' date: Wikipedia and IEP 364, Haines "about 350"; the article says "about 364" and marks the mention as doubtful.
- Haines's Loeb series number (58) was seen only in an Internet Archive search listing of the 1961 Harvard reprint, so it is not given.
- The modern translations (Hard–Gill, Hammond, Hays) and Hadot rest on IEP and Wikipedia; no publisher pages or reviews were opened.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/marcus-aurelius.md):** 10 findings, each checked against
the cited passage or page (Herodian 1.3.1 in the Scroll; Wikipedia, Marcus Aurelius, Meditations and Equestrian statue), all corrected:
the Capitoline statue is "almost the only" surviving Roman equestrian bronze, spared by being taken for Constantine (Wikipedia's
Marcus Aurelius page says "the only", which is not so; Wikipedia, Equestrian statue, added as source 25); Lucius "perhaps" died of the
plague; the first edition's lost manuscript was headed τῶν εἰς ἑαυτόν; "very probably" never meant to be published; Herodian's
"age, toil and care", then illness; Haines added as a source for "precepts"; Leopold for Basel 1568; Haines's place-notes reading is
in his introduction; the Suda quotes 1.6 in its own words; the timeline's Suda mark no longer cites Haines; Meditations 3.5 a source of
its own (26), so source 22 is 1.6 only.

## Menander (tlg0541), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0541.ts` (42 sources). Not yet registered in `author-articles.ts` / `author-articles-all.ts`.

**Confirmed and kept**
- Life, from the ancient testimonies in English on attalus.org (lives page): the inscription IG 14.1184 (son of Diopeithes, of Cephisia; born under Sosigenes, 342/1; died aged 52 under Philippus, 292/1, in Ptolemy Soter's 32nd year); the anonymous history of comedy (Prolegomena 3: long with Alexis, "seems to have been instructed by him"; "He produced his first play as an ephebe", archon Philocles, given there as 322 BC; 108 plays; died at Athens aged 52); the production note of the *Dyskolos* (P.Bodmer 4, Arnott's translation: Lenaea, archon Demogenes, January 316, first prize, actor Aristodemus of Scarphe); P.Oxy. 1235 (*The Imbrians* written for the Dionysia of 302/1, not performed because of the tyrant Lachares); the scholia on Ovid, *Ibis* 591 (drowned swimming in the harbour of Piraeus; marked legend); "no Byzantine manuscripts of Menander's plays".
- Suda On Line mu 589 (108 comedies; parents); its note gives the OCD's dates 344/3–292/1, kept as the "debated" alternative. Wikipedia (Menander): c. 342/341 – c. 290.
- Gellius 17.4 (Latin on LacusCurtius; English in attalus.org's Apollodorus fr. 43): Philemon's wins by *ambitus gratiaque et factionibus*; the "don't you blush" question (legend); 108 or 109 plays; Apollodorus: 105 plays, 8 victories.
- Parian Marble (attalus.org, Greek Chronicles B 13–14): Demetrius "set laws in Athens" 317/6; Menander's first victory 316/5 (noted as not quite agreeing with the production note).
- Scroll passages (all quotations copied from `passage.ts`): Strabo 14.1.18 (ephebe with Epicurus), 10.5.6 (law of Ceos, Greek and Jones's English); Diogenes Laertius 5.36 (Theophrastus taught him, after Pamphila), 5.79 (nearly tried as Demetrius' friend; Telesphorus the nephew); Pausanias 1.2.2 (grave, «Μενάνδρου τοῦ Διοπείθους»), 1.21.1 (statue in the theatre); Athenaeus 13.8 (*Arrhephoros* or *Auletris*, «ἀνερρίφθω κύβος», Yonge's "the die is cast"); Plutarch, *Pompey* 60.2 (Caesar's Greek words at the Rubicon); 1 Corinthians 15.33–34 (the Greek line stands under 15.34 in this edition; WEB English under 15.33); Plutarch, *Comparison of Aristophanes and Menander* 2–3 (Fowler's English); Clement, *Stromata* 1.14.59 («ἰαμβείῳ συγκέχρηται τραγικῷ», our translation); Euripides fr. 1024 in Nauck's TGF (1889), with χρήσθ’; the *Sententiae* 1.2, 1.11, 1.28 (Greek; our translations).
- LSJ (site copy): ἔφηβος "one arrived at adolescence (i.e. the age of 18 years)"; δύσκολος "prop. hard to satisfy with food … generally, hard to please, discontented, fretful, peevish".
- Papyri: Wikipedia (Cairo Codex): fifth century; Epitrepontes, Perikeiromene, Samia, Heros and an unknown play; found by Lefebvre at Kom Ishgaw, used as a jar stopper with Dioscorus documents; Egyptian Museum; Lefebvre 1907 and 1911. Allinson's Loeb introduction (1921, Internet Archive): Cairo papyrus "discovered in Egypt in 1905"; "portions of five comedies"; connected scenes restored since 1891 and mostly since 1905; Lefebvre ed. princeps Cairo 1907, facsimile 1911; "758 gnomic verses loosely attributed" and "various other Byzantine anthologies". Internet Archive record of Lefebvre 1907.
- Bodmer Lab record of P.Bodmer 25+4+26: Samia, Dyskolos, Aspis; single quire of 16 sheets (64 pages); 52 folios and fragments; possible educational use; received September and October 1956, "said to have been purchased in Egypt"; leaves taken by Bodmer in Cairo, September 1957; dates: early 3rd (Martin), 4th (Turner), late 4th (Orsini); acts marked ΧΟΡΟΥ; Martin 1958, Kasser and Austin 1969.
- Wikipedia (Dyskolos): only play surviving nearly complete; about 969 lines, about 9 missing (Photiades 1958); Lenaea 316; published 1958 by Victor Martin; Phyle 13 miles north-west of Athens; Pan comes out of his temple; act 4: Gorgias goes down the well, Sostratos hauls Knemon out; the chorus dances at the end of each act.
- Greek Wikisource text of the *Dyskolos*: lines 1–7 (Pan; Knemon «ἀπάνθρωπός τις ἄνθρωπος σφόδρα καὶ δύσκολος πρὸς ἅπαντας») and 713–714, 722–726; quoted in English only (our translation), since Greek in guillemets must come from the Scroll.
- Harlfinger, *Forum Classicum* 1/2004 (archived): 400 lines in a Syriac palimpsest of the late ninth century (catalogue: written 886), from a fourth-century Menander codex; half *Dyskolos*, half an unknown play; found by Francesco D'Aiuto; made known in *L'Osservatore Romano* of 6 December; Bodmer as "Bibliophile". Wikipedia: 2003.
- BMCR 1997.10.07 (Anderson, read via the Wayback Machine): Allinson's single Loeb volume of 1921; Arnott vol. 1 1979 (six plays), vol. 2 1996; Heros: about fifty lines, twelve-line metrical hypothesis and cast list; Bodmer's didascalic notes date the *Dyskolos*; Dis Exapaton parallels Plautus' *Bacchides*; Terence's prologues on Kolax/Eunuchus and Andria/Perinthia; Misoumenos "work of 1970–94"; mainly iambic trimeters.
- BMCR 2001.05.16 (Goldberg, via the Wayback Machine): Arnott 1979–2000; personal inspection of the Bodmer and Cairo codices; Sandbach's first OCT had eighteen plays; *Samia* 96 ff. (Bodmer gives all to Demeas; Sandbach 98–101 to Nikeratos; Arnott back to the papyrus, citing Kassel on the proverb; Goldberg doubtful); *Dyskolos* 430 ff. (B gives lines to Getas; OCT and Arnott to Sostratos' mother).
- Smith's *Dictionary* (1849, Perseids): the Aristophanes of Byzantium saying (Greek given; our English), "several hundred lines" of Γνῶμαι μονόστιχοι. GEDSH: Syriac sentences of "Menander the Wise", probably translated from a lost Greek original; the Greek monostichs (ed. Jaekel) often not Menander's.
- Quintilian 10.1.69–72 (Butler, LacusCurtius); Suetonius, *Life of Terence* (Rolfe, LacusCurtius): Caesar's "thou half-Menander"; Socrates Scholasticus 3.16 (Zenos, New Advent): "the tragedies of Euripides".
- Wikipedia (Ancient Greek comedy): New Comedy's everyday subjects, stock characters, recognitions; influence through Plautus and Terence on Shakespeare, Jonson, Congreve, Wycherley and Molière. Wikipedia (Menander): fragments collected by Meineke (1855) and Kock (1888), some 1,650 verses; the 1 Corinthians line "probably" from *Thais*; Kassel–Austin PCG VI.2 and Arnott's Loeb as standard; Austin's OCT unfinished at his death; Sandbach 1972, 1990.
- Editions: Ullmann 1961 (TEI headers of the Scroll's three files and the catalogue titles: Men Ar I, Men Ar II, Gregory Nazianzen *Carmen morale* XXX); Martin 1958 (Bodmer Lab); Sandbach 1972 (Patras library record) and 1990 (Classical Review 41.1, 1991, Arnott's review: metadata read); Gomme–Sandbach 1973 (Internet Archive record); Arnott's Loeb (CiNii: LCL 132, 459–460, Harvard UP and Heinemann, 1979–2000); Kassel–Austin 1998 (AbeBooks record); Jaekel 1964 (ELTE library record); Miller, Penguin 1987 (Internet Archive record, associated name "Miller, N. P").

**Left out because it could not be confirmed**
- *Orge* ("Anger") as his first play in 321: the Prolegomena name no play (and give 322); attalus.org's index ties *Orge* to his first victory. Sources confused; left out.
- Demetrius of Phalerum governing "for Macedon from 317 to 307": only the Parian Marble's 317/6 is kept.
- Ptolemy Soter's invitation, the villa at Piraeus and Glycera (Alciphron's letters, not read); Philemon as rival in love.
- "Whom the gods love die young" (no edition of the line opened); "The property of friends is common".
- 23 plays with Psellus' commentary in eleventh-century Constantinople; the complete Menander at Urbino (Wikipedia itself doubts it).
- Old Church Slavonic versions of the *Sententiae*; the Arabic versions are kept only through Ullmann's title.
- Molière's *Misanthrope* inspired by the theme of the *Dyskolos* (one popular web essay only).
- "Recovered in Egypt in 1952" (Wikipedia, Dyskolos): the Bodmer Lab record has the leaves arriving in 1956–57; no find date kept.
- Austin's death in 2010 (the Guardian obituary was not opened).
- Maurice Balme's Oxford World's Classics translation (no page opened).
- Ancient testimony that Menander's statue in the theatre was by Praxiteles' sons (only a Wikipedia picture caption).

**Corrected from the draft**
- "Born 342/1, died c. 291/0": the inscription gives 292/1 (aged 52); the article marks the dates as debated and gives the OCD's 344/3 and Wikipedia's c. 290 as alternatives.
- "First play, Orge, in 321": first production as an ephebe in the archonship of Philocles (322); no title (see above).
- "The complete Dyskolos": nearly complete (about nine of about 969 lines missing).
- "Cairo codex found in 1907": Allinson says discovered in 1905; 1907 is the year of publication (both given, marked debated in the timeline).
- "The third-century Bodmer codex": its date is disputed, early third to late fourth century.
- "Large parts of the Samia from the Cairo codex (1907) … most of the Samian Woman and the Shield published 1969": kept, with editors Kasser and Austin named.
- "Studied with Theophrastus" kept, but as Diogenes' report from Pamphila.
- "The Aristophanes of Byzantium quotation": kept as a saying *ascribed* to him (legend), translated from Smith's Greek.
- "Translated into Arabic and other languages": only Arabic (Ullmann) and Syriac (GEDSH) kept.
- "Plots shaped European comedy from Shakespeare to Molière": kept for New Comedy in general, through Plautus and Terence (Wikipedia, Ancient Greek comedy), not claimed for Menander's plots in particular.

**Weak points to revisit**
- Much of the life rests on late testimonies read in attalus.org's English (not checked against Kassel–Austin's Greek), and on Wikipedia pages (Menander, Dyskolos, Cairo Codex, Ancient Greek comedy).
- The archon years in brackets (322; January 316; 317/6; 316/5) are the translators' conversions on attalus.org.
- BMCR article pages were down (502); both reviews were read in Wayback Machine copies, and the sources point to those copies.
- Kassel–Austin is confirmed only by a bookseller's record (De Gruyter, ÖAW and other library pages refused access); Gomme–Sandbach, Sandbach 1972, Jaekel and Miller by library records only.
- The Dyskolos lines are translated from the Greek Wikisource text, whose edition is not named on the page.
- Wikipedia's "Cairo Codex" says "discovered in 1907" against Allinson's 1905; Lefebvre's own 1907 preface (Internet Archive) was not read.
- The palimpsest's year (2003) comes from Wikipedia; Harlfinger's article gives only "6 December" in a 2004 issue.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/menander.md):** 7 findings, each checked against the
cited passage or page (Strabo 14.1.18 in the Scroll; the P.Oxy. 1235 note on Attalus.org; the Scroll's TEI headers; Wikipedia,
Menander), all corrected: The Imbrians was put off in 302/1 and "subsequently acted by the Athenian Callippus"; the Bodmer codex's 52
are pages, not leaves; the Cairo codex has large parts of three comedies and pieces of two; Strabo's ephebe story is "it is said";
no Byzantine copy, rather than no medieval copy (the palimpsests are medieval); Ullmann's pages 17–59, 64–73 and 77–80; the
palimpsest's other play "then unknown", now identified by Wikipedia as the Titthe.

## Callimachus (tlg0533), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0533.ts` (42 sources). Not yet registered in `author-articles.ts` / `author-articles-all.ts`.
Tests: `ARTICLE=tlg0533 npx vitest run src/wiki/author-articles.test.ts` (11 passed), `CORPUS=1 ARTICLE=tlg0533 npx vitest run
src/wiki/author-articles.corpus.test.ts` (3 passed), `npx tsc --noEmit -p .` (clean).

Note: the Scroll has no English translation of Callimachus. English quoted from his poems is either A. W. Mair's (Loeb 1921, read
in the Internet Archive scan, listed in `outsideQuotes`) or our own translation, said so in the prose.

**Confirmed and kept**
- Life: Wikipedia (Callimachus): poet, scholar and librarian at Alexandria; the Suda (tenth century) the main source, with inaccuracies
  (after Ferguson); calls himself Battiades, perhaps after the founder Battus; patronage of Ptolemy II, established at court by 270 at
  the latest (Ferguson); writing until about 240; Cameron on the schoolteacher story, "almost certainly outright fiction"; six hymns,
  about 60 epigrams, 13 Iambi, Hecale, Aetia in four books; mimetic hymns (Apollo, Demeter, Athena) after Stephens; epigrams mostly in
  the Palatine Anthology (tenth-century manuscript, found at Heidelberg in 1606); Pinakes 120 volumes, from the shelf-lists, poetry and
  prose, subcategories, alphabetical with biography and works, Casson's "first comprehensive bibliographic resource"; Roman poets'
  "principal model[s]"; Cameron on the Hecale scholion (limited authority); Gutzwiller's sentence (quoted). Mair's Loeb introduction
  (Internet Archive): birth "circ. 310", death "circ. 235"; descent from Battus (Strabo 17.837); the Suda notice in translation; the
  librarianship of Callimachus "not an ascertained fact"; the bitter feud (as Mair told it); Ovid's Ibis modelled on Callimachus'
  Ibis; Athenaeus' "a big book is a big evil" and the modern explanation of an inconvenient roll; Hymns 5 and 6 in Doric, 5 alone in
  elegiacs; the manuscripts of the Hymns (Byzantine sylloge with Homer, Orpheus, Proclus; Aurispa, 1423; three families; Athous Laurae
  587, fourteenth century; Laur. 32.45 torn out for the editio princeps; Politian's Latin Bath of Pallas, 1489); the Rainer tablet
  (Vienna, Phoenissae on the back, Gomperz 1893); the note on Hymn 1.3 (Πηλογόνων of the manuscripts, corrected by Salmasius from E.M.);
  the note that "Cretans are ever liars" was attributed to Epimenides and quoted in Titus 1:12; Cory's version in Ionica (1858);
  translations quoted (Hymn 1.8, 2.108–112, Ep. 30 Mair, Hecale "unbarred house"); title page: London, Heinemann; New York, Putnam, 1921,
  Callimachus and Lycophron translated by A. W. Mair, Aratus by G. R. Mair.
- Susan Stephens, Dickinson College Commentaries (Aetia site): "Callimachus of Cyrene" (most influential poet of the Hellenistic age;
  born about 305, died some time after 240 judging from his subjects; Pinakes by genre with lives, works cited by first words; never head
  of the Library; Apollonius followed Zenodotus; six hymns and about sixty epigrams intact; Hecale about 1,000 lines); "The Aetia"
  (Lindos aition; 4,000–6,000 lines; Berenice married Ptolemy III in 246, the Lock no earlier than 245; 37 papyri; Lille papyrus within
  a generation of his death with interlinear comments; PSI 1092 first century BC, main source of the Lock; P.Oxy. 17.2079 second century
  AD, opening of Book 1; P.Oxy. 2258 sixth/seventh century collected edition; Florentine and London scholia; Milan Diegeseis, first or
  second century AD, summaries of Aetia and Iambi, each with its first line); "The Organization of the Aetia" (Hesiodic dream; Pfeiffer's
  reissue thesis "now commonly accepted", Cameron's alternative, Knox on fr. 112; order of Books 3–4 from the Diegeseis; Lille papyrus
  published 1976; SH 238/253 and Harder 137m; Harder fr. 75b for Aristaenetus 1.10); "Prologue: Against the Telchines" (Greek text of
  fr. 1 Harder = 1 Pf. = 1 Massimilla; λεπταλέην at line 24; the Telchines as mythical sorcerers destroyed by Zeus or Apollo; not
  certain whether real people; βροντᾶν οὐκ ἐμόν, ἀλλὰ Διός; the tablet on his knees, line 21).
- LSJ (Perseus and the site's copy): λεπταλέος "fine, delicate", Call. Dian. 243, and metaphorically of the Muse, Call. Aet. Oxy. 2079.24.
- Scroll passages (all copied from `scripts/passage.ts`): Suda κ 227 (parents, "grammarian", more than 800 books, Philadelphus, Eleusis,
  Euergetes, the Ibis against Apollonius, the Pinakes in 120 books; lunate sigma kept as printed); Strabo 17.3.22; Hymn to Zeus 1–9;
  Hymn to Apollo 105–113; Hymn to Artemis 243; Epigrams 2 and 28 (Wilamowitz) and 2 and 30 (Mair); Hecale 1.1 (Rainer tablet), 2.1
  (unbarred house) and testimonium 2 (scholion on Hymn 2.106); Aetia testimonia 1 (A.P. 11.275, "Apollonius") and 3 (Martial 10.4);
  Aetia 1.1–1.2 (Mair's fragment 1, a dinner party, then P.Ryl. 13); Athenaeus 3.1 with Yonge's English; Titus 1:12 with WEB English.
- Wikipedia: Pinakes (pinax = tablet; Callimachus never head librarian; Apollonius succeeded Zenodotus); Aetia (Muses on Helicon,
  Hesiod; Victory and Lock of Berenice; about 4,000 lines; still read about 500; Eustathius the last first-hand reader; vanished in the
  thirteenth century; Poliziano; Oxyrhynchus breakthrough; Martial 10.4; Catullus 66 and Pope 1712); Hecale (deme and sanctuary of Zeus
  Hecaleus; Rainer tablet fourth century AD, after Wessely via Mair's Loeb); Apollonius of Rhodes (little evidence of a feud; the Lives
  stress friendship; epigram attributed to "Apollonius the grammarian" maybe not Apollonius of Rhodes; most scholars think it
  sensationalised); Catullus (c. 84–c. 54 BC); Rudolf Pfeiffer (Callimachi fragmenta nuper reperta 1923; vol. 1 1949, vol. 2 1953,
  Clarendon; "landmark"; P.Ryl. I 13 became Aetia fr. 26 in 1949); List of editiones principes in Greek (Hymni, Florence, Laurentius de
  Alopa, ed. Janus Lascaris, undated, 1494–96).
- Treccani, Dizionario Biografico (Mondolfo, "Alopa, Lorenzo"): Lascaris' editions of Callimachus and others "tutto nel 1496, o circa";
  Greek printed in elegant capitals designed by Lascaris.
- Latin texts (The Latin Library): Catullus 65.16 "haec expressa tibi carmina Battiadae" and 66 (Berenice's lock, Conon); Propertius
  4.1.64 "Vmbria Romani patria Callimachi"; Ovid, Amores 1.15.13–14.
- Ionica (ed. Benson 1905, Internet Archive): "Heraclitus" on p. 7; pages 1–104 appeared in the 1858 volume.
- Editions: Wilamowitz 1897 and Mair 1921 (Scroll TEI headers / catalogue); Pfeiffer (Wikipedia, Pfeiffer); Trypanis, LCL 421,
  Harvard 1958 (Open Library; a 1968 record adds Heinemann); SH, de Gruyter 1983 (Open Library); Hollis 1990 Clarendon (Classical
  Review 44.1, Williams) and 2nd ed. OUP 2009 (Classical Review 61.1, D'Alessio); Harder 2012, 2 vols, xii + 362 + vi + 1,061 pp.
  (Classical Review 63.2, Jeffrey Hunt); Stephens, Callimachus: The Hymns, OUP 2015 (Open Library). P.Oxy. part 17 = 1927, ed. Hunt
  (Internet Archive record), with DCC's "P Oxy 17.2079".

**Left out because it could not be confirmed**
- His mother's name: the Suda's κ 227 has Mesatma; κ 228 makes Megatima his *sister* (mother of the younger Callimachus); Hemsterhuys
  conjectured Megatima for the mother too (Mair); Wikipedia (Ferguson) states Megatima as the mother. Too tangled for the article.
- Where and with whom he studied: Wikipedia (Ferguson) puts his study with Praxiphanes and Hermocrates at Alexandria in the 280s; Mair
  puts Praxiphanes at Athens, about 287–281. Left out.
- The draft's dates "moves to Alexandria c. 280" and "compiles the Pinakes c. 270": no source dates either; only Ferguson's "at court by
  270 at the latest" is kept. Wikipedia's Pinakes page gives "about 245 BCE" on a weak citation; not used.
- "The ancient list of the Library's heads does not include him" (P.Oxy. 1241): the papyrus edition was not opened; replaced by
  Stephens's "never head of the Library" and Mair's warning.
- The year the Milan Diegeseis were found (a search summary says Tebtunis, 1934, by Vogliano and Bagnani; the Falivene PDF returned an
  HTML page, and papyri.info showed a bot check, which was not bypassed). Only DCC's date of the papyrus is kept.
- The Suda's Olympiad date for Ptolemy III (ρκζ΄), "manifestly wrong" (Mair), with Merkel's and Kaibel's corrections: the OCR of
  Mair's numerals is garbled.
- φθόνος / φθόρος in the Hymn to Apollo (Mair's apparatus): the OCR is too poor to tell which line and which manuscripts.
- Hymn 1.6 in the Scroll's Wilamowitz text reads "Ζεῦ δὲ μὲν" where Mair has "Ζεῦ, σὲ μὲν": probably a transcription slip in the
  digital file, not an editorial choice; not used.
- Ep. 28.2 / 30.2: Mair's digital text lacks "καὶ ὧδε" (his own translation has "to and fro"): probably a transcription slip; not used.
- "Βροντᾶν οὐκ ἐμόν" and the λεπταλέην line could not be quoted in Greek (not in the Scroll: Mair's Aetia predates the prologue); given
  in English (our translation) and transliteration, with DCC as the source.
- Frank Nisetich, The Poems of Callimachus (OUP 2001): only an Open Library record; not needed.
- The Pinakes date "about 245 BCE", the "first library catalogue in the West" label (Wikipedia Pinakes, weak sourcing).
- "Printed in capitals ... 1494–96": kept, but Mair gives 1494 outright; the article says "about 1494–96".

**Corrected from the draft**
- "c. 305–c. 240 BCE": the sources disagree: about 310 (Mair; Ferguson via Wikipedia) or about 305 (Stephens); death about 235 (Mair) or
  after 240 (Stephens). Marked {debated}, both given.
- "The Lock of Berenice ... (246/5)": DCC says no earlier than 245 (marriage in 246); the timeline says "no earlier than 245", approximate.
- "A. W. and G. R. Mair, Callimachus, Lycophron, Aratus": the title page shows A. W. Mair translated Callimachus and Lycophron and
  G. R. Mair Aratus; publisher London: Heinemann; New York: Putnam (1921), now stated.
- "The ancient list of the Library's heads does not include him": reworded to what the sources say (never head; Apollonius followed
  Zenodotus; Mair's 1921 warning), marked {debated}.
- "Founder of Greek bibliography": softened to Casson's "first comprehensive" guide (via Wikipedia).
- "Pfeiffer ... the standard edition": no opened source says "standard"; Wikipedia's "landmark" is used.
- "The surviving manuscripts, mostly of the fifteenth century, go back to one lost archetype": made precise from Mair (a lost Byzantine
  collection, a copy brought to Venice in 1423; one manuscript of the fourteenth century).
- The feud "may be a later invention built on the Aetia prologue": the link to the prologue was not found; the article gives the Suda,
  the "Apollonius" epigram, Mair's 1921 account and the modern view (Wikipedia, Apollonius of Rhodes).
- Wikipedia (Apollonius of Rhodes) cites the "Apollonius" epigram as Pal. Anth. 11.322; Mair's testimonia in the Scroll give A.P. 11.275,
  which matches the Greek Anthology file in the corpus (book 11, no. 275). 11.275 is used.
- "Λεπταλέην, leptaleēn": kept as a transliteration with DCC's Greek text and LSJ, whose entry cites this very line (Aet. Oxy. 2079.24).

**Weak points to revisit**
- Much of the life rests on Wikipedia (Ferguson 1980, Cameron 1995) and on Mair's Loeb introduction of 1921, which is old: it tells the
  feud as fact and its manuscript account follows Schneider; the article marks Mair's views as his.
- The 1927 date of P.Oxy. 2079 rests on combining DCC's "P Oxy 17.2079" with the Internet Archive record of part 17 (1927); the volume
  itself is lending-only and was not read.
- Trypanis's 1958 Loeb, Stephens 2015 and SH 1983 are confirmed only by Open Library records; the Harder and Hollis volumes by
  Classical Review records (BMCR returned 502 errors on 2026-10-07).
- Mair's English is read from an OCR text; the quoted phrases were checked against both the introduction and the translation pages
  where possible (the Hymn to Apollo line about Envy differs between the two, "songs in number" / "things for number", so our own
  translation is used for that line).
- "Mair's fragment 1 is a dinner-party scene, and the lines that follow come from P.Ryl. 13": read from the Scroll's TEI (section 1.2
  opens with the heading "Papyrus Rylands 13"); Pfeiffer's fr. 26 from the Wikipedia caption on Pfeiffer's page.
- Summary is about 1,400 English words (about 1,470 counting the Greek), at the top of the requested range.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/callimachus.md):** 4 findings, each checked, all
corrected: the Suda is a tenth-century Byzantine encyclopaedia, not "an ancient reference book"; the Aetia's dream comes after the
prologue; William Johnson (later Cory) put the Heraclitus epigram into English in Ionica (1858), without "made it famous" (Wikipedia: he
changed his name to Cory in 1872); Pfeiffer's dating "followed by many" footnoted to Stephens's preface (source 8). Also "tablets"
footnoted to source 1 as well.

## Theocritus (tlg0005), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0005.ts` (33 sources). Not yet registered in `author-articles.ts` / `author-articles-all.ts`.
Tests: `ARTICLE=tlg0005 npx vitest run src/wiki/author-articles.test.ts` (11 passed), `CORPUS=1 ARTICLE=tlg0005 npx vitest run
src/wiki/author-articles.corpus.test.ts` (3 passed), `npx tsc --noEmit -p .` (clean).

Note: the Scroll has no English translation of Theocritus. Every English rendering of his Greek is our own translation, said so in the
prose and listed in `outsideQuotes`; the Greek words were checked in LSJ (site's copy). The Greek Anthology in the Scroll opens only on
its books 13–16 (the passage tool and the corpus test read the first file), so AP 9.205 and 9.434 could not be cited as Scroll
passages: they are given in English only, from the Greek printed by Cholmeley and Wilamowitz.

**Confirmed and kept**
- Life: Loeb jacket text in the BnF record of Hopkinson's Loeb 28 (2015): early third century BC, born in Syracuse, active on Cos and at
  Alexandria, "inventor of the bucolic genre", "little forms", epic metre with the Doric of his native Sicily, the genre "remained vital
  … into the modern era"; Edmonds's Loeb 28 was the previous edition of the volume. Wikipedia (Theocritus, largely after Clark's
  Britannica article of 1911): born c. 300 BC; little known beyond the poems; Polyphemus his "countryman"; probably in Alexandria;
  Artemidorus "in the time of Sulla"; the Suda's list of works; Idyll 1 (Daphnis, Hermes, Priapus, Aphrodite); Idyll 7 set on Cos,
  narrator called Simichidas by his friends, Sicelidas = Asclepiades (ancient critics), Philitas the veteran poet of Cos; singing
  matches; mimes 2, 14 (Aeschines advised to enlist with Ptolemy), 15 (Gorgo and Praxinoa, Adonis); hymns 16, 17, 22; 13 and 24; 16 and
  17 the only datable poems; Hiero made general in 275; 17 celebrates the marriage with his sister Arsinoe; 15 and 17 between 275 and
  270; 28 and 29 Aeolic, 28 with a distaff to Theugenis, wife of Nicias, doctor of Miletus; 8 and 9 suspected but in Virgil's Theocritus;
  26 attacked by Wilamowitz, defended, quoted by Eustathius as Theocritus'; 19, 20, 21, 23, 25 "generally considered to be spurious";
  doubtful epigrams; P.Oxy. 694 (Idyll 13), second century AD; death date unknown.
- Cholmeley, *The Idylls of Theocritus* (1919 edition; first published May 1901), Internet Archive OCR text: the ancient evidence (Suda,
  anonymous life, arguments, scholia, Choeroboscus, the epigram "not by Theocritus") "to a large extent merely inferences from the poet's
  own works, and are not consistent"; Idyll 16 to 275–274, 17 after the marriage and before Arsinoe's death (271–270); the later datings
  of Beloch (263–2) and Gercke (c. 268); court poet in Alexandria; the evidence for Syracuse (xi.7 and others); Cos theory and the
  scholium on 7.21 (Hauler πατρῴου "step-father", Meineke πατρὸς θετοῦ, Hiller πατριώτου, Cholmeley πατρίου ξένου; the note refers to
  "another" in his reading); the Philitas teacher-claim "merely an inference from Id. vii. 40", but "confirmation is however not
  altogether lacking"; Greek "naturally difficult … at the beginning of a new epoch"; smaller corrections of spelling and dialect not
  recorded, "the great majority of these are due to H. L. Ahrens"; rejection of 19, 20, 21, 23, 27 (and the Adonis poem), Megara
  included with 25; "now traditional order" only from Stephanus (1566 and 1579); editio princeps "Mediolana, 1481", i–xviii; Aldines
  1495; Juntine 1515 and Callierges 1516 from Musurus' copy of a lost Codex Patavinus; MSS vary enormously in contents and order; none
  older than the twelfth century, most fourteenth–fifteenth, fuller ones compilations; 26 among the undoubtedly genuine; Artemidorus'
  epigram (AP 9.205, Greek); the epigram ἄλλος ὁ Χῖος (Greek), probably attached to Munatius' edition; addenda: Artemidorus "about
  70 B.C.", his son Theo "published the first annotated edition"; the argument to Idyll 11 (Nicias "fellow-student" of Erasistratus).
- Edmonds, *The Greek Bucolic Poets* (Internet Archive, printing of 1916, London: Heinemann; New York: Putnam; preface dated
  8 October 1912): "The rest—and that means much of the following account—is conjecture"; the argument of Idyll 1 (shepherd Thyrsis and a
  goatherd at noon, the cup, Daphnis, the gods); the Syrinx a pipe dedicated to Pan by Theocritus, "strongest reason for doubting" the
  ascription (equal-length pipes), an argument of Gow's; his emendation of the argument to Idyll 11 (ᾧ for ὅς, nominative for genitive),
  "otherwise … unintelligible", and his guess that Theocritus studied medicine under Erasistratus.
- Suda On Line θ 166 (tr. Malcolm Heath): the Chian rhetor first; the second Theocritus, son of Praxagoras and Philinna "(though others
  [say], of Simmichas)", of Syracuse or from Cos; "wrote the so-called Bucolics in the Doric dialect"; Proetides, Hopes, hymns, Heroines,
  funeral songs, elegies and iambi, epigrams.
- Wilamowitz, *Bucolici Graeci* (OCT 1905), Internet Archive OCR (Latin preface, conspectus, sigla): "nobis necessario Theocritus is est
  quem Artemidorus edidit"; Theon, son of Artemidorus, edited Theocritus with a commentary, and this edition brought him fame "maxime per
  Vergilium"; editions "ornata epigrammate ἄλλος ὁ Χῖος"; Munatius and Amarantus; silence until Tzetzes and Eustathius, collection and
  correction from the twelfth century; Idylls 8 and 9 "a Theocrito alienissima"; many epigrams falsely ascribed; Oxyrhynchus papyrus
  of Hylas (lines 19–34, second century) the only one he could use, other scraps "abdita"; K "ceteros omnes … aequiparat auctoritate
  unus", "sed incedere uno hoc duce nequaquam licet"; M next for the first twelve poems; one family "in dialecticis saepe Doridem
  proterva intrudit interpolatione"; no change in dialect against the agreeing manuscripts without notice; in the appendix even false
  dialect forms kept knowingly; everything owed to Ahrens; appendix numbers for 19, 20, 21, 23, 25, 26, 27; sigla K (Ambrosianus 222,
  thirteenth century, Theocr. 1–17, 29, Epigr.), M (Vaticanus 915, thirteenth), P (Laur. 32.37, fourteenth), S (Laur. 32.16,
  fourteenth); B the lost Padua codex used by Musurus in Callierges' and Junta's editions of 1516.
- Scroll passages (copied from `scripts/passage.ts`): Idyll 1.1–3; 7.21; 7.39–41; 11.1–8 (Nicias, doctor; ὁ Κύκλωψ ὁ παρʼ ἁμῖν;
  Polyphemus); 11.72; 14.58–68 (μισθοδότας Πτολεμαῖος; ᾇ τάχος εἰς Αἴγυπτον); 15.22–24 (to the house of King Ptolemy to see the Adonis);
  15.87–95; Epigrams 23 (Berenice, from Athenaeus) and 24 (Megara); Syrinx 1–20; Athenaeus 7.20 with Yonge's English (Berenice). File
  headers: Idylls and Epigrams from Cholmeley (London: George Bell and Sons, 1901–1919); Syrinx from Gow's *Bucolici Graeci* (Oxford,
  1952 printing).
- LSJ (site's copy): ἡδύς (Dor. ἁδύς); τῆνος (Dor. for ἐκεῖνος; Theoc. 1.1); ποτί (Dor. for πρός); πηγή (Dor. παγά); μελίζω (Dor.
  μελίσδω, Theoc. 1.2); συρίζω (Dor. συρίσδω, Theoc. 1.3); ψιθύρισμα ("any low whispering noise, as of trees rustling, Theoc. 1.1");
  εἰδύλλιον (dim. of εἶδος, "short, highly wrought descriptive poem, mostly on pastoral subjects", Sch. Theoc. Proll.); βουκολέω "tend
  cattle"; βουκολικός; βουκολιαστής "pastoral poet, Theoc. 5.68" (only example); πλατειάζω "pronounce broadly, like the Dorians,
  Theoc. 15.88"; ἐκκναίω; Δωρίζω (Theoc. 15.93); μάνδρα "fold"; σποράς ("not collected into a volume", AP 9.205); also πατριώτης,
  θετός for the glosses of the conjectures.
- Wikipedia (Pastoral): landscape probably reflecting Cos; may have drawn on Sicilian shepherds' folk traditions; Doric with the epic
  hexameter; Pope's *Pastorals* (1709) imitating Spenser; Arnold's *Thyrsis* (1867). Wikipedia (Eclogues): Theocritus the model; ten
  poems; Eclogue 2 from Idyll 11, Eclogue 3 mostly Idyll 5, Eclogue 7 on pseudo-Theocritus 8; Eclogue 4 dated to 40 BC. The Latin
  Library: Eclogue 6.1–2 (Prima Syracosio dignata est ludere uersu … Thalia).
- Papyri: Bulloch, CQ 37 (1987) (Cambridge Core extract and footnote 1): P.Oxy. 2064, late second century AD, published 1930 by Hunt and
  Johnson; very fragmentary; most important witness before the fifth century; P.Oxy. 3548 (more of the roll) published 1983; order
  closest (except Id. 5) to the Laurentian family, against the Ambrosian and Vatican groups; modern order follows the Vatican family and
  "still has no ancient support". Gow's review in CR 44 (1930): *Two Theocritus Papyri*, ed. Hunt and Johnson, London: Egypt Exploration
  Fund, 1930. McNamee, GRBS 36 (1995), note 7 and table: annotations in the Antinoe Theocritus (Hunt–Johnson 1930) "abundant", but
  "intermittent" and below "the relatively high standard of Theocritean scholia"; listed among papyrus codices of the fourth century and
  later.
- Manuscript K: ParaText (Pavia) shows Ambr. C 222 inf. with Theocritus 9, 10, 16 and 29 and scholia; Fries, GRBS 57 (2017): Mazzucchi
  redated Ambr. C 222 inf. (Pindar's A) from c. 1280 to the 1180s.
- Print: Wikipedia, List of editiones principes in Greek: Milan, undated, c. 1482, Bonus Accursius, first 18 idylls; Aldine 1495–1496,
  idylls I–XXIII; Callierges, Rome, 1516, with the old scholia.
- Editions: BnF records of Gow's *Theocritus*, 2nd ed., 2 vols, Cambridge University Press 1952 (Idylls I–XXXI, fragments incl. Berenice,
  epigrams); Hunter, *A Selection* (CGLC, CUP 1999; also CR 51.2 (2001) review record); Verity–Hunter, *Idylls* (OUP 2002); Hopkinson,
  Loeb 28 (Harvard 2015). Internet Archive record of Gow's *Theocritus* vol. 1 dated 1950. CR 46.1 (1996) notice of Gallavotti's 3rd
  edition (Rome 1993).

**Left out because it could not be confirmed**
- The Antinoë papyrus as "fifth century" (draft): only a search-engine summary said "5th/6th century"; the papyri.info page would not
  open (a bot check) and McNamee's table could not be read reliably from the PDF. Kept only as "a papyrus book of late antiquity".
- "Confirm the ancient text" (draft, of the papyri): not said in any source read; replaced with what Bulloch and McNamee say.
- Hopkinson's Loeb text as based on Gow (1952) and Gallavotti (1993): only a search summary of a Classics for All review, which is
  behind a Cloudflare check; Harvard's and the Loeb site's pages would not open. Left out.
- That "a few use … epic Ionic" (draft): no source read says so. Only the Aeolic poems (28, 29) are kept.
- "Vaticanus gr. 915 and related manuscripts" as the Vatican family and Laur. 32.16 and 32.37 as the Laurentian (draft): the three
  family names are confirmed (Bulloch), but no source read assigns these manuscripts to them. The manuscripts are named with
  Wilamowitz's dates only.
- The BMCR reviews (2004.09.22 of Verity–Hunter; 1999.11.16 of Hunter) could not be opened (the BMCR site returned 502 errors).
- The DBI (Treccani) article on Bonus Accursius, cited by Wikipedia for the Milan edition, would not open.
- Idyll 31 (Gow's numbering) and its papyrus; the Antinoë codex's list of poems; who speaks which line in Idyll 15 (the Scroll's Greek
  has no speaker labels, so the article does not name Gorgo or Praxinoa for the replies).
- The "Daughters of Proetus" link to Virgil, Eclogue 6.48 (Wikipedia says only "may have been known").
- Philitas' death date ("cannot be placed later than 283", Cholmeley) and Arsinoe's death date (271–270 in Cholmeley, 270 in Wikipedia):
  not needed and disputed, so not given.
- Milton and Spenser's *Shepheardes Calender* by title (Wikipedia's Pastoral page spells it "Calendar" and does not link it to
  Theocritus); Dover (1971), Hine (1982), Trevelyan, Calverley, Lang, Way, Wells translations: listed on Wikipedia only, not opened.

**Corrected from the draft**
- "He is the inventor of pastoral poetry": kept in substance, with the Loeb jacket's and Wikipedia's wording ("inventor of the bucolic
  genre", "creator of … pastoral poetry"), and with the countryside poems shown to be only part of the book.
- "The name … was given later" (εἰδύλλιον): replaced by LSJ's definition and its source (the ancient notes); no source says when the
  name was first used.
- "Idyll 16 addressed to Hieron II (c. 275)" and "Idyll 17 (c. 273–270)": kept as approximate and debated, with the usual range 275–270
  and the nineteenth-century later datings of Idyll 16 noted (Cholmeley).
- "His latest datable poems belong to the 270s; nothing is known of his death": kept only as "the date of his death is unknown".
- "Artemidorus of Tarsus gathers the bucolic poets" dated -50: about 70 BC (Cholmeley's addenda, correcting his own "Augustan times";
  Wikipedia: time of Sulla), marked approximate and debated; "of Tarsus" dropped, since only Wikipedia makes the editor of the bucolic
  poets the grammarian of Tarsus (Cholmeley and Wilamowitz call him simply Artemidorus).
- "Editio princeps of Idylls 1–18 (Milan, c. 1480); Aldine 1495": undated; Cholmeley 1481, Wikipedia's list c. 1482; Aldine 1495–96 with
  Idylls 1–23.
- "Ambrosianus C 222 inf., K, thirteenth century": Wilamowitz's date, but Mazzucchi has redated the codex to the 1180s (Fries). Both are
  given.
- "Scribes often normalized Theocritus' Doric forms": the source read (Wilamowitz) says one family often thrusts Doric forms in; the
  article says the manuscripts disagree, and gives Wilamowitz's complaint.
- "Most editors regard Idylls 8, 9, 19, 20, 21, 23, 25 and 27 as not by Theocritus": the sources disagree; the article gives the
  Britannica/Wikipedia list (19, 20, 21, 23, 25), Cholmeley's (19, 20, 21, 23, 27) and Wilamowitz's (19–21, 23, 25–27, and 8 and 9).
- "The poem for Ptolemy (Idyll 17) and the Syracusan Women (15) are securely his": not stated so in any source read; left implicit.
- "The Syrinx … is also of doubtful authorship": kept, with Edmonds's reason (Gow's argument about the pipes).
- "Editions differ markedly in how much Doric colouring they restore": kept in substance, resting on Wilamowitz's and Cholmeley's own
  statements about dialect.
- "R. J. Cholmeley … (London, 1901; 2nd ed. 1919)": the 1919 book calls itself a "new edition, revised and augmented"; the Scroll's file
  header gives 1901–1919. "A. S. F. Gow, Bucolici Graeci (OCT, 1952) — the text of the Syrinx used here": confirmed by the file header
  ("1952 (printing)").
- "Gallavotti (Rome, 3rd ed. 1993)": confirmed (CR notice: Istituto Poligrafico e Zecca dello Stato). "Hopkinson (Loeb, 2015)": Loeb 28,
  Harvard University Press. "Hunter, Theocritus: A Selection (Cambridge, 1999)": confirmed (BnF, CR).
- The draft's first line of Idyll 1 had commas the Scroll's text does not; the quotation is copied from the Scroll.

**Weak points to revisit**
- Much of the life rests on Wikipedia, which itself follows the 1911 Britannica, and on Cholmeley (1919) and Edmonds (1912). Modern
  accounts (Hunter, Hopkinson, Gow) could not be opened beyond catalogue records.
- Gow's first edition year (1950) rests on an Internet Archive library record (volume 1, 1950) and Hunter's blurb seen only in a search
  summary; the BnF confirms the second edition of 1952.
- K is "Ambrosianus 222" in Wilamowitz; its identity with Ambr. C 222 inf. rests on ParaText's pages showing Theocritus with scholia in
  that codex (the same contents as K). Mazzucchi's redating is reported by Fries in an article on Pindar.
- Wilamowitz's and Cholmeley's texts were read in OCR; the Latin quoted is clear in the OCR, but the Greek in their pages was not used
  for quotation.
- The Edmonds copy read is the 1916 printing; the 1912 date rests on the preface's date and the Internet Archive's 1912 items.
- The Eclogues dates and models rest on Wikipedia.
- Our translations of AP 9.205 and 9.434 were made from the Greek as printed by Cholmeley; they should be compared with a modern
  translation (Hopkinson) when one can be opened.

**Fact check (2026-10-07, a second, independent check; report pipeline/factcheck/theocritus.md):** 7 findings, each checked against the
cited page (Edmonds's Loeb in the Internet Archive text; ParaText, Pavia), all corrected: Edmonds reported Gow's argument against the
Syrinx (the pipes' equal reeds) and answered it, keeping the poem as Theocritus'; the Aeolic poems are 28, 29 and 30 (found 1864);
the birth "about 300 BC or a little earlier" (Cholmeley 310–308); goatherds speak "the Doric of Sicily", not a country dialect; "the
first poet of pastoral", not of the countryside; Hunter's Selection includes the Hylas; K = Ambr. C 222 inf. now footnoted to
ParaText's page on that manuscript (source 34).

## Apollonius of Rhodes (tlg0001), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0001.ts` (43 sources). Registered 2026-10-09.
Tests: `ARTICLE=tlg0001 npx vitest run src/wiki/author-articles.test.ts` (11 passed), `CORPUS=1 ARTICLE=tlg0001 npx vitest run
src/wiki/author-articles.corpus.test.ts` (3 passed; a deliberately broken Greek quotation was caught, then restored), `npx tsc --noEmit -p .` (clean).

Note: the Scroll has only Mooney's Greek text of the *Argonautica* (Perseus, perseus-grc2), with no English translation. Every
English rendering of a line of the poem is our own translation, said so in the prose and listed in `outsideQuotes`; the only English
taken from the Scroll is Strabo 14.2.13 (Jones) and Athenaeus 7.19 (Yonge). The catalogue's `desc` calls Mooney "editor, translator";
his book is a Greek text with an English introduction and commentary, not a translation (Internet Archive title page; the TEI header
names him only as editor). The article says so in the editions note.

**Confirmed and kept**
- Life: Wikipedia (Apollonius of Rhodes, after Lefkowitz, Bulloch, Race): fl. first half of the third century BC; almost nothing
  known; the sources are the two *Lives* in the scholia, the *Suda*, and P.Oxy. 1241; father Silleus/Illeus; Alexandria (Lives, Suda,
  Strabo) or Naucratis (Athenaeus, Aelian), some 70 km south of Alexandria on the Nile; no source gives a birth date; "pupil" a figure
  of speech in ancient biography; P.Oxy. 1241 makes Eratosthenes his successor, after the accession of Ptolemy III in 247/246, whom
  Apollonius probably tutored; the Suda's order (successor of Eratosthenes) does not fit; the later librarian Apollonius the
  Eidographer as a source of confusion; the exile stories probably invented to explain the second edition (Lefkowitz); "of Rhodes"
  perhaps only from a poem about Rhodes; the epigram under "Apollonius the grammarian" (perhaps not him: Race); the Ibis deliberately
  obscure (Cameron); both Lives stress the friendship; most scholars now think the feud "enormously sensationalised, if it happened
  at all"; first scholarly monograph on Homer, against Zenodotus; works on Archilochus and Hesiod "credited"; foundation poems
  (Alexandria, Naucratis, Caunus, Cnidus, Rhodes, Lesbos); a "weaker, more human protagonist"; "a kind of poetic dictionary of Homer"
  (Rengakos); once dismissed as an imitator of Homer, now re-valued.
- The Lives in English (attalus.org, from Wendel): failure as a youth, Rhodes, polishing, citizenship; "Some say" he returned, was put
  in charge of the libraries, buried next to Callimachus. P.Oxy. 1241 in English: "Apollonius son of Silleus, of Alexandria, called
  the Rhodian, the disciple of Callimachus", teacher of the "first" king (the translator's note: a mistake for "third"), succeeded by
  Eratosthenes; Zenodotus before him; the papyrus of the second century AD. The Greek of both Lives also read in Mooney (pp. 1–2), who
  says they are appended to the scholia in the Laurentian manuscript.
- The *Suda* α 3419 and κ 227 (Ibis aimed at Apollonius, who wrote the Argonautica), Strabo 14.2.13, Athenaeus 7.19 (the *Foundation
  of Naucratis*, Pompilus), Aelian NA 15.23: all opened in the Scroll and quoted from it. The epigram «Καλλίμαχος τὸ κάθαρμα …» from
  the Aetia testimonia (tlg0533.tlg006 0.1); its translation is the one used in the Callimachus article (our translation).
- Mooney (1912), Internet Archive: dates guessed from 296 to 235 BC; his own picture of the feud, "the most bitter in the ancient world
  of letters" (quoted as his view); L, Laurentianus 32.9, tenth century, with Aeschylus and Sophocles; G (Wolfenbüttel), Laur. 32.16
  and Vat. 280 three centuries later; Merkel's 26 manuscripts, the last 22 (fifteenth–sixteenth century) far inferior; Brunck relied on
  the Paris manuscripts, Merkel disparaged them; the scholia "as valuable as those … on any ancient author", preserving lines of
  Hesiod; the subscription naming Lucillus of Tarrha, Sophocles and Theon; the Lives appended to the scholia in L; editio princeps by
  Lascaris, Alopa, Florence 1496, text in capitals with accents, scholia in minuscule in the margin; Aldine 1521; Brunck 1780 the first
  critical edition. Appendix I: six places in Book 1 where the scholia quote the προέκδοσις (1.285, 515, 543, 725, 788, 801); at 515
  the earlier text lacked 516–518 and had four other lines (third dawn, wind from Zeus, Tiphys) before our 524; at 788 δίφραξ and
  πρόδομος for κλισμός and παστάς; 4.538–547 (the line τυτθὸς ἐών ποτ᾽ ἔναιεν in different places, in L's margin with letters;
  Brunck's arrangement from Cardinal Angelus Quirinus' *Primordia Corcyrae*; all later numbering from Brunck; no modern editor
  followed him). Commentary on 1.8 (τεήν kept after Samuelsson; Merkel's ἐτεήν; suspected by almost all critics) and 1.18
  (ἐπικλείουσιν Brunck, ἔτι κλείουσιν codd.).
- Seaton's Loeb (Internet Archive, 1919 reprint; "First printed 1912"; London: Heinemann; New York: Putnam on this reprint): two
  editions by Apollonius, the first known only from the scholia; L "far the best authority for the text", dated by him to the early
  eleventh century; G and L 32.16 of the thirteenth century; the second type of text attested in the *Etymologicum Magnum* as old as
  the fifth century; editions 1496 (Lascaris), 1521 (Aldine), Brunck 1780, Schaefer 1810–13, Merkel 1854 with Keil's scholia, Seaton's
  Oxford text 1900; the Loeb text is his Oxford text; 1.8 note "μετέπειτ᾽ ἐτεὴν Merkel: μετέπειτα τεὴν LG" and his English "in
  accordance with that true report"; 1.18 note.
- Dickinson College Commentaries (Peter Hulse, Book 4): date "might have been officially published in 238"; the poem whole; the route
  home; Chares, a friend; Theon (1st c. BC), Lucillus (mid-1st c. AD), Sophocles (2nd c. AD) named at the end of Book 4 of the
  scholia; roughly 49 papyri, 1st–4th c. AD, mostly Oxyrhynchus, some to the 7th/8th c.; 24/9/10/6 by book; Varro of Atax's Latin
  translation; Virgil's debt; Catullus imitates Apollonius "constantly" in poem 64; Longinus' "a poet without fault"; Macrobius. The
  language page: -οιο used more than in the Iliad; new forms by analogy; never a pure imitator.
- Wikipedia (Argonautica): the only entirely surviving Hellenistic epic; four books, fewer than 6,000 lines; plot by book (Book 2 ends
  in the Phasis; Erato "the Muse of love poetry"; Medea lures Apsyrtus, Jason kills him); date under Ptolemy II or a generation later,
  Murray's 238; Fränkel and ἀμηχανία; Bulloch's "the pathology of love"; 1.1309 a verbatim line of Callimachus (Köhnken); editions
  (Seaton LCL 1, 1912; Race LCL 1N; Mooney; Vian–Delage Budé 1974, 1980, 1981; Hunter III 1989, IV 2015); Wendel's scholia 1935;
  Green's verse translation 1997.
- The Scroll: Argonautica 1.1–4, 1.5–19, 1.512–524, 1.788–789, 1.1309, 3.1–5, 3.284–298, 3.744–760, 4.445–467, 4.538–548 (the numbering
  really jumps from 543 to 546), 4.1773–1781; Longinus 33.4 (Greek only).
- LSJ (site copy; Perseus entry for ἄπτωτος opened): ἄπτωτος "never thrown, of a wrestler", metaph. "faultless, Longin. 33.4";
  ἀμηχανία "helplessness"; σχέτλιος "merciless"; στύγος "object of hatred, abomination".
- Quintilian 10.1.54 (Butler, LacusCurtius): left out of the lists because Aristarchus and Aristophanes included no contemporary poets;
  "his work is by no means to be despised". Macrobius, Saturnalia 5.17.4 (Latin, LacusCurtius): "librum Aeneidos suae quartum totum
  paene formaverit", Medea's love for Jason given to Dido.
- Wikipedia (Varro Atacinus): 82 – c. 35 BC; translated the Argonautica. Wikipedia (Valerius Flaccus): Argonautica written during or
  shortly after AD 70; a free imitation and in parts a translation. Wikipedia (Aeneid): 29–19 BC, unfinished at Virgil's death in 19 BC.
- Biblissima (Plut. 32.9): tenth century; Sophocles, Aeschylus, Apollonius Rhodius. Wikipedia (List of editiones principes): 1496,
  Laurentius de Alopa, Florence, edited by Janus Lascaris, with the Florentine scholia.
- Editions: Mooney (IA title page; TEI header: London, Longmans, Green, 1912); Seaton (as above); Fränkel OCT 1961 (Wikipedia, Hermann
  Fränkel, English and German; Internet Archive record, 1961, no publisher shown); Vian (Wikipedia; Open Library record of tome 2, Livre
  3, Les Belles Lettres, 1980); Race (Propylaeum page of Sistakou's review: Harvard University Press, Cambridge MA, 2008, LCL 1, xxi +
  511 pp.); Hunter (Open Library records: Book III, CUP, Cambridge Greek and Latin Classics, 1989; Book IV, CUP, 2015); Green (Open
  Library record: University of California Press, 1997, later printings 2007 and 2008).

**Left out because it could not be confirmed**
- A birth year ("perhaps c. 295"): no ancient source gives one; Mooney reports guesses from 296 to 235, Seaton from 296 to 260; the
  article gives the range and an approximate, debated timeline mark only.
- A date for his headship of the Library; it is shown only relative to Ptolemy III's accession and Eratosthenes' appointment.
- That the Argonautica is "the only Greek epic to survive from the long gap between Homer and the Roman empire": only "the only
  Hellenistic epic to survive entire" was found.
- That he "avoids the repetitions of oral epic", and that editors disagree "mainly over Homeric forms" and the geography of Book 4.
- The passages older editors read as moves in the quarrel (Callimachus' Hymn to Apollo 105–113; Argonautica 3.927–947), told by Seaton
  and Mooney but not checked against a modern source.
- A modern count of the manuscripts (only Merkel's 26, via Mooney) and a modern stemma (Vian's); a modern view on whether the
  "earlier edition" is really the poet's own (only Mooney, Seaton and Lefkowitz-via-Wikipedia were read).
- P.Oxy. 1241 in Grenfell and Hunt's volume X (1914): the Internet Archive copy is print-disabled and its text would not download; the
  papyrus is used through attalus.org's translation.
- The Cambridge, Harvard/Loeb, Britannica and Classics for All pages (403), the BMCR review of Hunter's Book IV (502): not used.
- Lucian's joke "Here comes Apollonius and his Argonauts" (Demonax), reported by DCC: it concerns a different Apollonius and shows only
  that the myth was known.

**Corrected from the draft**
- "Head of the Library … after Zenodotus" kept but marked debated, with the papyrus's own words and the Suda's conflicting order.
- "Tutored the future Ptolemy III": the papyrus says the "first" king (a slip for the third, as its translator notes); kept as "said to"
  / "probably" (Wikipedia, after Bulloch).
- "About 5,800 lines" → "fewer than 6,000 lines" (Wikipedia; the Scroll's text has 5,834 numbered lines).
- "The other medieval manuscripts, mostly of the thirteenth to fifteenth centuries, form a few related groups" → three of the thirteenth
  century (G, Laur. 32.16, Vat. 280), the rest of the fifteenth–sixteenth (Mooney).
- "Lucillus of Tarrha, Sophocleus and Theon" → Lucillus of Tarrha, Sophocles and Theon (Mooney's text of the subscription; DCC).
- "Papyri of the Roman period add early evidence" → roughly forty-nine papyri, 1st–4th c. AD, with the count by book (DCC).
- "Varro of Atax adapts the Argonautica in Latin" dated -60 → only his death about 35 BC is dated; the mark is "about 35 BC".
- "Valerius Flaccus … 75" → begun about AD 70 (Wikipedia).
- "One of the first great studies of love in European literature" → Bulloch's "seems to have been the first narrative poet to study
  'the pathology of love'" (as Wikipedia quotes him).
- The draft's Rhodes story and quarrel are kept only as legend / debated, with the modern doubts.
- Mooney: the draft says "London, 1912 … the text used here"; the article adds the publisher (Longmans, Green) and that it is not a
  translation. Seaton's Loeb is given as London: Heinemann, 1912 (the US co-publisher of the first printing could not be confirmed:
  the scanned 1919 reprint names Putnam, one Internet Archive record says Macmillan; neither is printed).
- Race: 2008 (Wikipedia; the review heading); one bibliography site says 2009. Kept 2008.

**Weak points to revisit**
- Much of the life and the quarrel rests on Wikipedia's Apollonius page (itself built on Lefkowitz, Bulloch, Race and Cameron); the
  papyrus date is given as second century AD by attalus.org and Wikipedia's Argonautica page, but as "2nd-century BC" on Wikipedia's
  Apollonius page (apparently a slip there).
- Manuscript and edition history comes from Mooney (1912) and Seaton (1912); modern work (Vian, Fränkel's Einleitung of 1964, the
  Brill Companion) could not be opened. L's date: tenth century (Mooney, Biblissima) against "early eleventh" (Seaton); the article
  gives both.
- The 4.544–545 explanation is Mooney's, as of 1912 ("no modern editor has followed Brunck").
- Fränkel's OCT is confirmed only by Wikipedia and a bare Internet Archive record; Vian's volumes by Wikipedia and one Open Library
  record; Hunter and Green by Open Library records.

**Fact check (2026-10-09, a second, independent check; report pipeline/factcheck/apollonius.md):** 8 findings, each checked against the cited page or passage (the Greek of Book 3 and Book 1; Mooney's 1912 edition, Internet Archive text; the Lives at attalus.org; the Dickinson commentary; Wikipedia's Argonautica editions), all corrected: in the night scene of Book 3 the sailors are awake and travellers and gatekeepers only long for sleep, only the bereaved mother sleeps; the earlier edition at 1.515 lacked lines 516–523, not 516–518 (the scholion goes on at 524); Mooney names three thirteenth-century manuscripts (Vaticanus 280, G, Laurentianus 32.16), not two; the Lives give the name "the Rhodian" from the poem's title or his living there, not from the citizenship; in 1.8 it is the poet who addresses Phoebus, not Jason; Catullus imitates Apollonius constantly in poem 64; Delage alone translated Vian's Books I–III; δίφραξ is a very rare word for a woman's chair.


## Diogenes Laertius (tlg0004), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0004.ts` (33 sources). Written from the old-site draft (`old-site-author-articles.json`, key
`tlg0004`); every claim below was compared with the source named. Greek and English quotations of Diogenes and Homer were copied
from `scripts/passage.ts` (Hicks's Greek and English; Murray's Homer).

**Confirmed and kept**
- Wikipedia (Diogenes Laertius, read as raw wikitext): after Sextus Empiricus (c. 200), whom he mentions, and before Sopater of
  Apamea (c. 300), who quotes him; flourished in the first half of the 3rd century; manuscripts call him "Laertius Diogenes", the
  form "Diogenes Laertius" much rarer; Laerte as a possible home town; the prevailing view that "Laertius" is a nickname from the
  Homeric epithet of Odysseus; home town unknown; ten books, Ionian (Anaximander to Clitomachus, Theophrastus, Chrysippus) and
  Italian (Pythagoras to Epicurus) lines; the book-by-book table; Book 7 breaks off in Chrysippus, the index in P lists the lost
  Stoics down to Cornutus; Favorinus and Diocles as chief authorities, the others used "either directly or indirectly"; B 12th
  century (Naples), P 11th/12th (Paris, after Dorandi), F 13th (Laurentian, after Dorandi); all lack the end of Book 7; Hicks's
  "scribe knew no Greek" rejected by Long, Dorandi's "little knowledge" and the later corrector; headings of the lives absent from
  the oldest manuscripts, added in P by a later hand; Henricus Aristippus's lost Latin version, late 1150s; Traversari in Florence
  1424–1433 (Cao), presentation copy to Cosimo dated 8 February 1433 (de la Mare); Latin printed at Rome 1472; Aldine Aristotle
  1497; Froben 1533; Estienne 1570; Meibom 1692 and his numbering; Long's OCT 1964 the first critical edition, superseded by
  Marcovich (1999–2002; vol. 3 indexes by Gärtner); Dorandi 2013; Yonge 1853 "more literal" but with "many inaccuracies";
  Montaigne's wish; Usener's "asinus germanus"; Jaeger's "that great ignoramus"; Long's "importance out of all proportion to his
  merits"; the partial rehabilitation by reading him in a Hellenistic literary context.
- Hicks, Loeb vol. 1 (1925), Internet Archive OCR of the preface, introduction and bibliography: title page London, William
  Heinemann / New York, G. P. Putnam's Sons, MCMXXV; nothing known of who he was, when or where born; Eustathius calls him Laertes;
  his book the one that survives of many; date from Saturninus, pupil of Sextus (ix. 116), Sextus "supposed to have flourished
  towards the end of the second century"; no allusion to Neoplatonism; the *Pammetros* in at least two books, epitaphs, "but sorry
  stuff"; the lady Platonist of iii. 47 and the singular address in x. 29, Arria and Julia Domna as the only names proposed; no
  claim to have studied philosophy; the Sceptic question (ix. 109) and the excerpt explanation; "Dryasdust ... of multifarious
  reading, amazing industry, and insatiable curiosity"; the two hundred sources cited; wills of six philosophers; fashion for
  anecdotes; "successions" as a family tree; the Presocratics scattered in Books 1, 2, 8, 9 and treated perfunctorily; Plato and
  Epicurus each a whole book, padded with doctrine and extracts; the Epicurus extracts "by far the most precious thing ..."; the
  Stoic summary vii. 39–160 "comprehensive and trustworthy"; P's index of Book 7 and "the book would be doubled in size";
  Favorinus "the most eminent sophist of his day", friend of Plutarch; Antigonus, Hermippus, Sotion, Apollodorus; Nietzsche 1868
  "rashly inferred" that Laertius owed all to Diocles; the scholia in Book X, and Hicks's view that Laertius may be their author;
  Usener's note to x. 74 ("Hiat oratio ..."); the Homer line of vi. 63 inserted by some editors into the Iliad; Sopater via
  Photius, Stephanus of Byzantium three times, Photius, Eustathius, Tzetzes; Traversari (Camaldoli, pupil of Chrysoloras,
  "completed in 1431 (for an extant copy is dated February 1432)"); Aldine 1497, Froben and Episcopius 1533, printed from "a
  worthless interpolated later ms." identified by Von der Mühll (Z, Raudnitz); Estienne 1570; Meibom "1691-92" (bibliography:
  Amsterdam, 1692, 1693); neglect until the 19th century; Cobet (Didot, 1850), no reasons given; Usener, *Epicurea* 1887; B "about
  A.D. 1200", "the most faithful to the archetype"; P "probably ... circa 1300"; F Laur. plut. 69.13; shared mistakes from a common
  archetype; Von der Mühll's "suspicamur": a single copy found at Constantinople about the ninth century; Hicks's text "eclectic",
  "based largely on the Didot edition"; ἀρετῶν for ἐτῶν (iv. 48) from Herbert Richards; von Arnim's SVF incorporates most of Book
  VII; Diels's fragment collections; Meineke and the Anthology editors.
- Dorandi's introduction (Cambridge Core summary, read in the page source): "a hundred or so manuscripts"; B, P, F "datable between
  the end of the eleventh century and the thirteenth century"; two excerpt collections in a 12th-century Vatican MS, one in Vienna
  dated 28 July 925; P Paris gr. 1759, 11th/12th century, written at Constantinople by two contemporary hands.
- Dorandi's book page (Cambridge Core): CCTC 50, 2013; "radically improved text"; used Von der Mühll's Nachlass for the first time
  in its entirety.
- BMCR 2000.07.09 (Todd on Marcovich, Internet Archive copy): Long's OCT "discredited"; Marcovich 1999, two volumes, exhaustive
  reports of B, P, F and the Magnum Excerptum; vol. 2 with Photius, the Suda, Hesychius and the Magnum Excerptum; F = Med.-Laur.
  69.13; 4.43 περιών (Wilamowitz's crux, περιιών adopted and rendered "in all his life" by Hicks, Marcovich's 〈τῇ οὐσίᾳ〉, Todd's
  reading); 4.48 ἐτῶν, Reiske's ἀνιῶν, Russell's αἰτιῶν ("charges"), Marcovich's further rewriting.
- BMCR 2019.02.28 (McConnell on Mensch, Internet Archive copy): OUP 2018, ed. James Miller; first English translation of Dorandi's
  text; Hicks largely used the Didot text of 1850; 556 colour images; sixteen essays, among them Gutzwiller on the epigrams ("much
  more sophisticated than they appear at first") and Most on Nietzsche and *Quellenforschung*.
- BMCR 2022.01.04 (Moore on White, Internet Archive copy): Cambridge 2021; both White and Mensch rely on Dorandi; White's 128
  departures listed.
- JHS 85 (1965) 185–186, Cambridge Core record of N. G. Wilson's review: Long, 2 vols, Clarendon Press, 1964.
- Montaigne, Essays II.10, Cotton/Hazlitt (Project Gutenberg): "I am very sorry we have not a dozen Laertii".
- Wikipedia (Chreia): the definition and the "On being asked" (ἐρωτηθείς) / "He said" (ἔφη) patterns.
- LSJ (site's copy): κολοφών "summit, top, finishing", κολοφῶνα ἐπιτιθέναι "put the finishing touch to"; ἀνία "grief, sorrow";
  αἰτία "accusation"; ἔτος "year".
- The Scroll (passage.ts): 1.1–3 (prologue and his reply), 1.13–15 (two beginnings, the successions), 1.34 (λέγεται; Thales and
  the ditch), 1.36 (ἐρωτηθεὶς τί δύσκολον), 1.39 (his epigram from "my first book, Epigrams in Various Metres"), 1.63 (what the
  collection contains), 3.47 (Φιλοπλάτωνι δέ σοι ... ὑπαρχούσῃ), 4.43, 4.48 (〈ἀρ〉ετῶν), 6.38 (Alexander), 6.63 (the Homer line),
  7.202 (the break, "[Pleasure]"), 8.53 (ἐγὼ δʼ εὗρον), 8.91 (σποράδην), 9.109 (ὁ παρʼ ἡμῶν), 9.116 (Saturninus), 10.16 (the will),
  10.29, 10.74 (gap and bracketed scholion), 10.138 (κολοφῶνα); Iliad 2.173 (διογενὲς Λαερτιάδη); the Perseus TEI headers (Hicks,
  Harvard University Press and Heinemann, 1925).

**Left out because it could not be confirmed**
- His Greek as "the plain prose of the imperial period and one of the easier texts for a reader moving on from a grammar": no source.
- "All three go back to a single damaged ancestor": a common archetype is confirmed (Hicks), "damaged" is not.
- "A Vatican manuscript (Vaticanus gr. 96) preserves an independent set of excerpts": Dorandi's summary confirms excerpts in a
  twelfth-century Vatican manuscript but gives no shelfmark here, so the number is left out.
- "The Suda draws on the work extensively": Hicks is cautious (Hesychius' extracts "presumably from the selfsame authors"); only
  Marcovich's printing of Suda passages among the Byzantine extracts is kept.
- The authenticity of the Letter to Pythocles "also debated", and repairing the letters "central to the study of Epicureanism": no
  source opened says so (Wikipedia has no page on the letter; the Epicurus page does not discuss it).
- "Rather weak epigrams" kept only as Hicks's own judgement, set against Gutzwiller's.
- A date for Montaigne's remark: the Essays first appeared in 1580, but this sentence may be a later addition, so no timeline mark.
- The number of lost Stoic lives in P's index: Hicks lists nineteen (with Cato) and speaks of "22 names" (the OCR may be at fault);
  Wikipedia lists twenty (without Cato). The article says "about twenty".
- Stephanus of Byzantium, Cobet, F and Estienne kept in the prose but not in the timeline (held to twenty marks).

**Corrected from the draft**
- "Names more than two hundred earlier authors" → "some two hundred" (Hicks: "the two hundred sources cited").
- The woman reader "who 'loves Plato'" was given as a quotation; it is no one's translation. Replaced with Hicks's English of 3.47.
- The draft's line that the work "ends with Epicurus" after describing the Ionian line could be read as the end of the Ionian line;
  Diogenes says the Ionian line ends with Clitomachus, Chrysippus and Theophrastus, the Italian with Epicurus (1.14). The
  "sporadic" philosophers (8.91) added.
- "The three primary manuscripts (B, P, F) are copied" in the "twelfth and thirteenth centuries": Dorandi dates them between the end
  of the eleventh century and the thirteenth (P 11th/12th); Hicks put P about 1300. Now given as {debated}.
- Traversari's translation "finished about 1433": Hicks says completed 1431 (a copy dated February 1432); Wikipedia (Cao, de la
  Mare) 1424–1433, presentation copy 8 February 1433. Both given, marked debated.
- Book 7 "breaks off in the middle of the life of Chrysippus": more exactly in the list of Chrysippus' writings (7.202).
- Meibom's numbering "1692": kept, with the note that Hicks gives 1691–92 (bibliography: Amsterdam 1692–93).
- Hicks's Loeb (1925): the first printing is London: Heinemann and New York: Putnam (title page), not Harvard; Perseus's header gives
  the later Harvard and Heinemann imprint. Both are stated.
- Dorandi "the new standard text": softened to "the text now followed by translators" (BMCR 2022: both recent translations use it).
- Marcovich "1999–2002": vols 1–2 in 1999 (BMCR), vol. 3 indexes 2002 (Wikipedia).

**Weak points to revisit**
- Several facts rest on Wikipedia alone (Sopater's date; Henricus Aristippus; Traversari's 1424–1433 and the 1433 presentation copy;
  Rome 1472; the headings added in P; Long's rejection of Hicks on B's scribe; Usener, Jaeger and Long's quotations). Dorandi's
  introduction or Cao's article in *The Classical Tradition* would be better.
- The BMCR site was down (502); its three reviews were read in the Internet Archive's copies, whose URLs are given.
- Hicks's dates for B and P (1925) are old; Dorandi's full introduction was not accessible beyond its summary, so B's date "12th
  century" comes via Wikipedia.
- White's translation: BMCR says 2021, Wikipedia 2020; the article follows BMCR.
- The gloss of περιών "wealth to spare" follows Todd's reading; the exact Greek of Marcovich's text was not seen.

**Fact check (2026-10-09, a second, independent check; report pipeline/factcheck/diogenes-laertius.md):** 10 findings, each checked against the cited page or passage (Wikipedia's wikitext; Todd's and Moore's BMCR reviews; Hicks's introduction, Internet Archive text; Iliad 2.172–173), all corrected: the Bion variants cited the LSJ entry for κολοφών (now Todd alone; "griefs" dropped, αἰτιῶν glossed "charges" as Todd does); Dorandi's corrector changed readings "rightly or wrongly"; Hicks's verdict quoted whole ("a Dryasdust, vain and credulous, …"); Long's "prevailing view" of the nickname dated to 1972 and White's argument for the town of Laertes added (source 28), "home town is not recorded"; Apollodorus' verse chronicle, not a biography; Homer's characters, gods among them (Athena speaks Iliad 2.173); Henricus Aristippus translated "at least part"; the 8 February 1433 date credited to de la Mare, not Cao; "many of his sayings" are chreiai, not "much of the book"; B "most faithful" given as the agreement of Hicks's day, with Todd's ranking of B and P together.


## Arrian (tlg0074), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0074.ts` (39 sources). The Scroll has Arrian's Greek only (no English translation), so every English rendering of his words is either E. J. Chinnock's (1884, Project Gutenberg), Philip Stadter's (GRBS 1967), or ours, and all are listed in `outsideQuotes`.

**Confirmed and kept**
- Life: Wikipedia (Arrian): Lucius Flavius Arrianus of Nicomedia (İzmit); born c. 86/89 (also "within a few years prior to 90"), died "after 146/160"; consul around 130; Cappadocia; Cassius Dio 69.15.1 on the Alans, Vologases III; Epictetus in Epirus, "probably Nicopolis"; Tactics 136/137, Hadrian's twentieth year; Bowie (Past & Present 46, 1970, 25 n. 72) against Stadter's "Lucius Flavius Arrianus Xenophon" as the official name; Landmark Arrian (Pantheon 2010); Hammond's OUP translation of 2013; the first part of the Indica after Megasthenes, the second after Nearchus. Livius (Jona Lendering): born between 85 and 90; family Roman citizens from an earlier stage; priesthood of Demeter and Kore, "perhaps already as a young man"; Epictetus at Nicopolis; consul in 129 or 130; Cappadocia, a frontier province with two legions; voyage of inspection along the Black Sea as one of his first acts; the Alans in 134, the two legions taken into the field; Tactics as a present for Hadrian's twentieth anniversary (136/137); after 137 settled at Athens, citizen, "important Athenian office" in 145/146; the Indica in Ionic after Herodotus; Megasthenes a Greek envoy; Arrian chose eyewitnesses; modern scholarship follows Arrian and adds details from the vulgate; "Alexander as we know him was, until recently, very much a creation by Arrian".
- Stadter, "Arrianus, Flavius", Catalogus Translationum et Commentariorum 3 (1976) 1–20 (scanned PDF, read page by page): ca. 95–175; consul ca. 129; legatus of Cappadocia 131–137; "repelled the Alan invasion of 134"; retired, Athens, citizen, civic offices; Discourses in eight books (four preserved) and the Encheiridion; Periplus as a letter to Hadrian ca. 131; Acies contra Alanos; Ars tactica dated 137, first page lost; Anabasis in seven books "presumably written in Athens"; Indica; Cynegeticus; the six extant works; Post-Alexandrian History (to 321 BC), Bithynica, Parthica known from Photius codd. 58, 92, 93 and fragments, "including at least one papyrus"; Alanike and three short biographies "ascribed" to him; the Periplus Maris Erythraei and the anonymous Periplus Ponti Euxini not his, preserved with his Periplus in one manuscript; Byzantine readers (Dexippus, Stephanus of Byzantium, Photius, the Constantinian Excerpts, the Suda, two palimpsest leaves, Eustathius, Tzetzes, Zonaras); all Greek manuscripts of Anabasis and Indica from Vindobonensis hist. gr. 4 (s. XII ex.–XIII in.); apographs 1 / 5 / 25 in the 13th / 14th / 15th centuries; Pal. gr. 398 (s. IX) and Laur. 55,4 (s. X) for the minor works; Aurispa's manuscript in 1421; four Latin translations 1433–1508, Vergerio's for Sigismund probably 1433–37; Gelenius, Basel 1533 (Periplus); Trincavelli, Venice, Zanetti, September 1535 (Anabasis and Indica); Holstenius, Paris 1644 (Cynegeticus); Scheffer, Uppsala 1664 (Tactica and Acies); Roos, Teubner, vol. 1 Anabasis 1907, vol. 2 Scripta minora incl. Indica 1928, corrected by Wirth 1967–68; fragments in Roos 2 and Jacoby FGrHist 156.
- Stadter, "Flavius Arrianus: the New Xenophon", GRBS 8 (1967) 155–161: Photius cod. 58 and the Suda on the "new Xenophon"; Xenophon parallels (teacher's words, Cynegeticus, the title Anabasis, seven books); Periplus 1.1, 2.3, 12.5, 25.1 "that Xenophon" / "the elder"; Cynegeticus 1.4, 5.6, 16.6, 22.1; the title in Pal. gr. 398 altered to "of Xenophon the Athenian, the second"; Acies 10 and 22, the commander Xenophon = Arrian; archonship in 146 by inscription; Periplus ca. 131–132; Alans 134; priesthood of Demeter and Kore; the second preface (Anabasis 1.12.5) and Stadter's translation of it; the Periplus greeting and his translation of it; Epictetus "wrote nothing himself"; Photius on Arrian's plain style.
- Cassius Dio 69.15.1 (Cary's Loeb translation, LacusCurtius; the page is the epitome of Book 69): the Alans persuaded by gifts from Vologaesus and in dread of Flavius Arrianus.
- Photius, Bibliotheca codd. 58, 91–93 (Freese, Tertullian Project): Parthica 17 books, Bithynica 8, Alanica; "young Xenophon"; lectures of Epictetus in eight books; "His style is dry, and he is a genuine imitator of Xenophon"; the Anabasis in seven books "continued by the Indica, in one book"; the Indica "written in the Ionic dialect"; the History of the Successors in ten books. (Freese's own footnotes, governor in 136 and consul in 146, are out of date and not used.)
- Scroll passages (all copied from passage.ts): Periplus 1.1–1.4 (greeting; Trapezus; the statue), 12.5 and 25.1 (Ξενοφῶν ὁ πρεσβύτερος); Tactics 44.3 (twentieth year); Battle Order 10 and 22; On Hunting 1.4 and 5.6; the letter to Lucius Gellius (tlg0074.tlg008) and Long's English of it in Epictetus' Discourses; Suda alpha 3868 (νέοϲ Ξενοφῶν); Lucian, Alexander 2 (Harmon's English); Anabasis 1.pr.1–3, 1.2.7, 1.9.5, 1.9.10, 1.12.1–5, 1.28.7, 4.7.4, 7.12.7–7.13.1 (the dots of the gap), 7.30.3; Indica 1.2 (τοῖσι πολλοῖσιν Ἰνδοῖσιν) and 19.8 (ὅκως; ἐν τῇ ἄλλῃ τῇ Ἀττικῇ συγγραφῇ).
- Chinnock 1884 (Gutenberg 46976): title page (London: Hodder and Stoughton, MDCCCLXXXIV); his English for the preface, 1.9.10, 1.12.5, 4.7.4, 7.30.3.
- Wikipedia (Anabasis of Alexander): composed in the second century, seven books after Xenophon; fullest surviving account of the conquest of the Persian Empire; 336–323; Thebes 335; Ptolemy later king in Egypt; Bosworth and the critical view since the 1970s (hagiography, apologia, misleading passages); the digression at 4.7–14; the Loeb of 1929 revised by Brunt in 1976 with a new introduction and appendices; Landmark 2010; Hammond and Atkinson 2013. Wikipedia (Indica (Arrian)): Ionic, Herodotus as model; Nearchus' voyage from India to the Persian Gulf. Wikipedia (List of editiones principes in Greek): 1533 Basel (Gelenius, Froben), 1535 Venice (Trincavelli, Zanetti), 1644 Paris (Holstenius), 1664 Uppsala (Scheffer).
- LSJ (site's copy): ἀνάβασις "expedition up from the coast, esp. into Central Asia, as that of the younger Cyrus related by X."; ὅκως "Ion. for ὅπως"; συγγραφή "book, esp. in prose: history".
- German school-programme essay (ULB Düsseldorf PDF, about 1905, author unnamed in the scan; his father edited the Anabasis, Leipzig 1903): Roos, Prolegomena (Groningen 1904); the Vienna codex A as archetype; the gap at 7.12.7 in all manuscripts, from a lost leaf of A; the corrector's reworking of A (A²), from which Gronovius' Florentine "optimus" (Laur. IX 32, edition of 1704) derives; h keeps the opening of the Anabasis, missing in A; one manuscript family joins Books 6 and 7; the Venice edition of 1535 counts six books with the Indica as the seventh; Basel 1539 gets seven.
- Robson's Loeb vol. 1 (Internet Archive scan of a later reprint, OCR): note to 1.9.5 "Editors add καὶ τῇ ὀλιγότητι. Roos marks lacuna."; note to 1.28.7 "After πεντακοσίους Krüger and Roos mark a lacuna, supplying ζῶντες δὲ ὀλίγοι ἐλήφθησαν (R.)". Both match the dots in the Scroll's text.
- Editions: Classical Review 45.2 (J. O. Thomson; Cambridge Core record): Roos vol. 2, Leipzig: Teubner, 1928; Robson vol. 1, Loeb, London: Heinemann, New York: Macmillan, 1929. University of Patras library record: Brunt, LCL 236 and 269, Harvard, 1976–1983, vol. 2 with the Indica. Bibliothekai: Brunt vol. 1, 1976, numerous appendices, revising Robson. BMCR 1997.04.07 (Heckel; read through the Wayback Machine, the BMCR site gave 502 errors): Bosworth, Historical Commentary, Clarendon, vol. 1 (1980, Books 1–3), vol. 2 (1995, Books 4–5); the Book 4 digression out of context, "The whole digression serves the function of a sermon on the evils of intemperance". Scroll file headers: Roos 1907 (Anabasis); Hercher and Eberhard 1885 (Indica, Cynegeticus, Periplus, Tactica, Acies); Roos vol. 2 dated 1910 (letter to Gellius).

**Left out because it could not be confirmed**
- A single birth year (c. 86, 85–90, c. 95, c. 96 are all given) or death year (c. 160, c. 175, before or about 180): given as a range and marked debated.
- The year he studied with Epictetus (Wikipedia gives both about 108 and 117–120).
- The draft's "damaged by damp in the fifteenth century" and "leaves carrying ... the end of the Indica were lost": not found in any source opened (only the loss of the opening of the Anabasis in A, and the leaf at 7.12.7, are confirmed).
- Livius' speculative early career (military tribune, Noricum or Dacia, proconsul of Baetica, Africa) and Hadrian as a fellow pupil of Epictetus; Pliny's letters to an "Arrianus"; a lost Meteorology and life of Epictetus; the papyrus and palimpsests of the History of the Successors by name (Wikipedia gives PSI 12.1284 and the Gothenburg palimpsest; only Stadter's "at least one papyrus" and "two palimpsest folia" are kept, and only the papyrus is mentioned).
- The date of the Anabasis (Stadter: presumably at Athens; Wikipedia: most probably under Hadrian). Not stated.
- The Tillorobus life (Lucian, Alexander 2) was confirmed but cut for length; the lives of Dion and Timoleon (Wikipedia, Chinnock via Photius) not named.
- Robson's second volume and its date (1933 appears only indirectly on Bibliothekai and in a library record).
- Encyclopaedia Iranica "Arrian" and OUP's page for Bosworth's commentary were blocked (Cloudflare); BMCR's own site gave 502 errors.

**Corrected from the draft**
- "his own writings call him a 'new Xenophon'": the nickname "new/young Xenophon" is in Photius (9th c.) and the Suda (10th c.), both Byzantine; in his own works Arrian calls himself Xenophon (On Hunting, Battle Order) and the classical author "the elder" (Periplus).
- "drove back an invasion of the Alans": Stadter says he repelled it, but Cassius Dio (epitome of Book 69) says the war stopped because the Alans were bought off by Vologaesus and feared Arrian; both given, marked debated. Date 134 (Stadter, Livius) or 135 (Wikipedia).
- "Roos, Teubner, 1907–10": vol. 1 1907, vol. 2 1928 (Stadter; the Classical Review record), corrected by Wirth 1967–68. The Scroll's file header for the letter to Gellius says 1910; the article notes the discrepancy.
- "Vindobonensis hist. gr. 4, c. 1200": Stadter gives s. XII ex.–XIII in.; kept as "about the end of the twelfth century or the beginning of the thirteenth".
- "Roos showed in 1904": kept, with his proof (the gap at 7.12.7 from a lost leaf of A) from the 1905 programme essay.
- "consul around 130", "archon 145/6", "born c. 86/89", "dies perhaps c. 160": consul "about 129 or 130"; archon 145/6 (Stadter: 146; Robson: 147); birth and death as ranges.
- "edition princeps of the Anabasis (Venice)": kept as 1535, Trincavelli, with the six-book count of that edition.
- "His Greek is clear Atticising prose in Xenophon's manner": not stated as such; the article uses Photius' "dry"/plain style and Arrian's own phrase "my other, Attic, history" (Indica 19.8).

**Weak points to revisit**
- Stadter's Catalogus article is of 1976 and his GRBS article of 1967; newer work (Syme's "The Career of Arrian", HSCP 1982; Bosworth; Leon, Arrian the Historian, 2021) could not be read. The career dates rest on Stadter, Livius and Wikipedia, which differ by a year here and there.
- The 1905 programme essay is anonymous in the scan (it is a school-programme supplement; its author's father edited the Anabasis in 1903, so probably a son of K. Abicht, but this is not confirmed and not said in the article). It reports Roos's Prolegomena second-hand.
- Robson's notes to 1.9.5 and 1.28.7 were read in OCR of a later reprint; the "(R.)" after the supplement at 1.28.7 is ambiguous (Roos or Robson), so the article says only "the Loeb note gives".
- Wikipedia's Arrian article is badly referenced; it is used only for points also found elsewhere, or (Bowie 1970 against Stadter) clearly attributed.
- Our translations: Periplus 1.4, On Hunting 1.4 and 5.6, Indica 19.8, Anabasis 7.12.7–7.13.1, 1.9.5 and 1.28.7, and the altered title in Pal. gr. 398 (Stadter gives it in Greek only).

**Fact check (2026-10-09, a second, independent check; report pipeline/factcheck/arrian.md):** 6 findings, each checked against the cited page or passage (the Indica and Anabasis in the Scroll; Wikipedia's Arrian and Anabasis wikitext); the two resting on scanned pages (Stadter's Catalogus survey, the 1905 Düsseldorf essay) were applied because they only narrow the claim. Corrected: the Indica's first sentence is already Ionic, and ὅκως comes later (19.8); the Erythraean Sea voyage was taken for Arrian's in the Renaissance, the anonymous Black Sea voyage only came to bear his name; Stadter's 1967 view stated as he gave it (a Greek name beside the Roman, which alone appears in inscriptions), and Bowie's reply as reported; "the fullest account of Alexander the Great's campaigns" (source 18 added); Gronovius filled the gaps from the Florentine manuscript; after the lost leaf the text starts again at «… Ἡφαιστίων.».


## Strabo (tlg0099), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0099.ts` (39 sources). Tests: `author-articles.test.ts` and the CORPUS check pass with ARTICLE=tlg0099; `tsc --noEmit` clean.

**Confirmed and kept**
- Life: Jones's Loeb introduction (vol. 1, 1917, on LacusCurtius; per Jones's preface left substantially as Sterrett wrote it): born at Amaseia in 64 or 63 BC; Aristodemus at Nysa (14.1.48), Tyrannion (12.3.16), Xenarchus (14.5.4), "Aristotelized" with Boethus (16.2.24); a Stoic ("our Zeno" 1.2.34; "what our School avoids" 2.3.8); Rome in 44 BC aged nineteen or twenty, again 35 and about 31 BC; Gyaros in 29 BC (10.5.3); Egypt with Aelius Gallus 25–24 BC, still there in 20 BC, more than five years in Alexandria, excerpts "may infer" made in the library; "it cannot be said that he was a great traveller"; perhaps no place in Greece but Corinth; the extracts "with which his book is filled"; Pais (first version about 7 BC, revised about AD 18, written at Amasia) against Niese (Rome, AD 18–19); the Geography not known to the Romans, not even Pliny; his habit of naming famous men of eastern cities. Wikipedia (Strabo): 64 or 63 BC to c. AD 24; Amaseia = Amasya; paternal grandfather (as reported); Rome 44 BC; only extant work on Greek and Roman peoples under Augustus. Diller and Kristeller, CTC 2 (1971): born about 63 BC, probably died AD 24; Geography "which we have entire" (Book 7 apart, Stronk); little attention before the sixth century, often cited by Byzantine authors from the ninth; copies to Italy from 1424; Nicholas V's commission; Guarino (Books I–X) and Gregorio (XI–XVII) from Ciriaco's two volumes; Guarino's holograph dated Ferrara 13 July 1458, at eighty-four; ed. (1469) Rome, Sweynheym and Pannartz, I–X Guarino, XI–XVII Gregorio, revised by Bussi; Bussi's preface (much missing from Guarino's Europe); Vat. lat. 2049 supplemented with another Greek manuscript by Bussi and others; Heresbach 1523 revised from the 1516 Greek, called Guarino's part worse than Gregorio's; editio princeps Venice, Aldus, November 1516; Kramer 1844–52 as the critical edition; Casaubon 1587 (Geneva), reprinted after his death 1620; Chrestomathy anonymous, probably ninth century, in the contemporary Pal. gr. 398, ed. pr. Basel 1533, Müller GGM II (1861).
- Stronk, CJ-Online 2019.02.04 (review of Roller's Guide, 2018): c. 63 BC – c. AD 24; not "absolutely sure" Strabo was his real name; Juba's death AD 23 the latest datable passage; complete except parts of Book 7; not read extensively, unnoticed by the Romans even Pliny, known in the East; some thirty manuscripts; Casaubon 1587 and 1620, C 1–840; Radt 2002–11 "the edition to be used"; Roller's translation 2014; topics (Alexander, cults, eastern Mediterranean, women's history); "primary source for the history of Greek scholarship on geography".
- Wikipedia (Geographica): seventeen books and the book-by-book contents (Books 1–2 against Eratosthenes, Hipparchus, Polybius, Posidonius; 3 Iberia ... 17 North Africa); Dueck's AD 18–24; the fifth-century palimpsest (bi-rescriptus); table after Radt: Paris gr. 1397 tenth century, Books 1–9; Paris gr. 1393 thirteenth century, whole text; Bohn translation the first complete English.
- Pothecary, strabo.ca: editions (about thirty medieval manuscripts; Radt 10 vols 2002–11 used papyri and a dismembered fifth-century manuscript; vol. 2 replaces the lost end of Book 7 with Epitome and Chrestomathy passages; vol. 9 Epitome and Chrestomathy, "fourteenth and ninth centuries"; Budé vols 1966–2015 = Books 1–12 and 17; Jones 1917–32 based on Meineke; Meineke 1852–53 based on Kramer with variations listed; Kramer 1844–52 full apparatus); translations (Hamilton and Falconer from Kramer's text, Bohn 1854–57); papyri (P. Köln 8 from the lost end of Book 7, P. Oxy. 3447 Book 9, P. Oxy. 4459 Book 2, second and third centuries); lost History (fragments; P. Vogliano 46 "?"); when written (AD 17–23; Juba AD 23).
- Jones vol. 1 (Internet Archive, title page and bibliography): London, Heinemann; New York, Putnam, 1917; "based in part upon the unfinished version of J. R. S. Sterrett", who died June 15, 1914; manuscripts: "not much read in antiquity: in a sense he was discovered in Byzantine times", one archetype, the gap at the end of Book 7 in all manuscripts, Paris 1397 for Books 1–9 (contains no more), Vatican 1329, Epitome Vaticana, Venice 640 for 10–17, the Epitome going back to the end of the tenth century and made from a copy with the end of Book 7; Aldine 1516 from a poor manuscript, Par. 1395; the Latin made from better manuscripts since perished; citation by Casaubon's pages; Jones's own Greek text (preface).
- Vatican Library palimpsest page: an early copy of Strabo recycled in Vat. gr. 2061A, Vat. gr. 2306 and Crypt. A.δ.XXIII; "double palimpsest".
- BnF Archives et manuscrits, Grec 1397: eleventh century, parchment, 232 leaves, Books 1–9, end mutilated.
- LSJ (site copy): στράβων = στραβός; στραβός "squinting".
- Scroll passages (Greek and English copied from passage.ts and the Bohn file): 12.3.39, 10.4.10, 12.3.33 (my mother's great grandfather; "my maternal grandfather"; fifteen garrisons; "great promises..."), 14.1.48, 12.3.16, 14.5.4, 16.2.24, 1.2.34, 2.3.8, 10.5.3, 2.5.11–12, 17.1.46, 1.1.1–2, 1.1.22–23, 11.9.3, 3.4.10–11, 17.3.7, 7.7.12 and 7.fragments.1 (Stephanus, s.v. Δωδώνη); Plutarch, Lucullus 28.7 and Caesar 63.2; Josephus, AJ 14.104–118 ("Strabo of Cappadocia"); Athenaeus 14.75; Chrestomathy 1.1 (tlg0099.tlg004).

**Left out because it could not be confirmed**
- The number of books of the lost history: Jones's introduction says forty-seven, the Bohn preface (in the Scroll's English file) forty-three; no modern source opened settles it.
- "Studied with Athenodorus" (Wikipedia says teacher; Strabo 16.4.21 only calls him "my friend"); Wikipedia's Rome-based study with Xenarchus as fact (Jones says "probably").
- "His Greek is the plain, educated prose of the Augustan age" and "a treasure-house of lost works": no source opened says so (only Jones's "numerous excerpts" is used).
- The Epitome and Chrestomathy "sometimes preserve readings lost elsewhere": not found as stated.
- The Aldine's errors "persisted in later editions until the manuscripts were collated afresh": not found as stated (Jones says only that Casaubon "did much for the text of the first three books").
- Columbus's use of the Latin translation (Wikipedia, unsourced there); the 1424 "modern edition" in Stronk (unclear, not used); Athenaeus's date.
- Whether Josephus quotes the History or the Geography (Jones's introduction says the Geography; modern view not checked).
- BMCR reviews of Radt's volumes (2003.07.08, 2006.12.24) and of Roller: the site returned 502 errors all day; Fizzarotti's chapter on the palimpsest (Brill), Pinakes and ISTC were blocked.

**Corrected from the draft**
- "Studied with Tyrannion and Xenarchus ... spent long periods in Rome": kept, but the length of the stays is not claimed (Jones: "It does not appear that he lived for any very long stretch of time at Rome").
- "Historical Sketches, a continuation of Polybius in forty-seven books": the article says part of the history continued Polybius (11.9.3: the sixth book was the second "after Polybius"), and leaves the book count out.
- "The work was barely read in antiquity and was first widely used by Byzantine scholars": kept with Diller's precise wording (little attention before the sixth century; often cited from the ninth) and Athenaeus as an early exception.
- "It was completed late in his life, after 18 CE": presented as a debate (Pais, Niese, Pothecary, Dueck).
- "Latin translation by Guarino of Verona and Gregorio Tifernate printed at Rome 1469": Diller gives "(1469)", undated; the article says "about 1469". Jones's bibliography gives Rome 1472, but Diller lists 1472 as a Venice edition (Vindelinus de Spira); Jones's date not used.
- "For the last eight we depend on later manuscripts of the thirteenth and fourteenth centuries": made specific (Vatican 1329, Venice 640, the Epitome: Jones; Paris gr. 1393, thirteenth century, whole text: Wikipedia after Radt).
- "Parisinus gr. 1397, tenth century": the BnF catalogue says eleventh; both given, marked debated.
- "Epitome ... and the excerpts known as the Chrestomathy": the Chrestomathy is ninth century (Diller; Pothecary); the Epitome's date differs (Jones: end of tenth; Pothecary: fourteenth), marked debated.
- "Meineke, 3 vols (Teubner, 1877)": Meineke's edition is of 1852–53; 1877 is the reprint Perseus used.
- "Jones, Loeb 1917–32" with no publisher: vol. 1 was London, Heinemann, and New York, Putnam (title page), the Scroll's later volumes Harvard and Heinemann (file header).
- "Aujac, Lasserre and others (Budé, 1966–)": Baladié and Laudenbach added; by 2015 Books 1–12 and 17.
- The grandfather: Jones's introduction and Wikipedia say "paternal"; Strabo's Greek (ὁ πάππος ἡμῶν ὁ πρὸς αὐτῆς) and Jones's own translation say maternal. The article gives both, marked debated.
- Wikipedia (Geographica) says Sterrett died in 1915; Jones's preface says June 15, 1914 (not used in the article, noted here).

**Weak points to revisit**
- Much of the life rests on Jones's introduction of 1917 (largely Sterrett's), which is old; modern accounts (Dueck 2000, Roller 2014, Radt's prolegomena) were not opened.
- The fifth-century date of the palimpsest rests on Pothecary and Wikipedia (citing Fizzarotti 2020), not on the Vatican's own catalogue (DigiVatLib gave no description).
- Jones's English at 10.4.10 says "My mother's mother was the sister of Lagetas", but the Greek (in Meineke and in Jones's own Greek) has θυγάτηρ, daughter; and his English there names Lagetas where the Greek has ἐκείνου (the other Dorylaus, as 12.3.33 shows). Not used in the article; a reader comparing the columns may notice.
- Wikipedia's table date for Paris gr. 1397 (tenth century) is said to follow Radt; Radt was not opened.
- The Athenaeus "variant" is our own comparison of two Scroll passages (Athenaeus 14.75 and Strabo 3.4.10–11); no modern discussion of it was opened.

**Fact check (2026-10-09, a second, independent check; report pipeline/factcheck/strabo.md):** 7 findings, each checked against the cited page or passage (Diller and Kristeller, Catalogus 2, pp. 226 and 229, read from the scanned PDF; Athenaeus 14.75 and Strabo 3.4.10 and 10.5.3 in the Scroll; Perrin's note in the Perseus file of Plutarch's Caesar), all corrected: the Latin translators' Greek copies survive (Ciriaco's two volumes, now Eton and Moscow, with Guarino's notes), not "since lost"; Athenaeus' πρὸς τῇ Ἀκυτανίᾳ is "near Aquitania" (our translation; Yonge's "in the province of" was wrong); the gaps in Guarino's Greek are Bussi's guess ("ut puto"), for Guarino's part only; Guarino translated the whole work, finished at Ferrara 13 July 1458, and the 1469 print joined his Books 1–10 to Gregorio's 11–17; the Caesar omens "probably" from the history (Perrin); "Octavian, the future Augustus" in 29 BC; στράβων "also a Greek word", not "ordinary" (LSJ cites one comic fragment).


## Pausanias (tlg0525), checked 2026-10-07

Article: `web/src/wiki/authors/tlg0525.ts` (39 sources). Registered 2026-10-09.

**Confirmed and kept**
- Life and date. Wikipedia (Pausanias (geographer)): nothing known beyond his own writing; Lydia, Asia Minor; honest about second-hand information; classicists dismissed him (after Wilamowitz) until twentieth-century archaeology showed his accuracy (Habicht). Jones, Loeb vol. 1 (1918; Internet Archive): nothing known except hints in the book; 5.13.7 makes Lydia "a fair inference"; 5.1.2 (217 years since Corinth was repeopled, restored 44 BC) gives book 5 in AD 174; 7.20.6 (Odeion of Herodes not yet built when Attica was written); the war of "the second Antonine" against Germans and Sauromatae (166, triumph 176); no mention of his death in 180. Frazer, vol. 1 (1898; Internet Archive): Antinous' death "appears to have fallen in 130", Pausanias old enough to have seen him and born "a good many years before 130"; the Costobocs the latest event; Regilla's death 160 or 161, so book 1 finished by then at the latest; Gurlitt's later dates (book 1 not before 143); book 5 in 174; at least fourteen years of work and probably many more; the rule restated at Sparta as an answer to critics; Lydia near Sipylus; Magnesia "we cannot say". Wikipedia (Costoboci): invasion of 170 or 171. Mazzaferro's review of the Valla edition: Musti's two phases (135–145/150 and 161–180); Herodotus and Thucydides as models. Sánchez Hernández, CFC(G) 17 (2007), abstract: Habicht argues for Magnesia ad Sipylum; the author for Smyrna.
- Scroll passages, Greek and English copied from passage.ts: 5.1.2, 7.20.6, 8.9.7, 10.34.5, 8.43.6, 5.13.7, 1.39.3, 3.11.1, 1.26.4, 10.4.1, 8.8.3, 2.16.5–7, 5.17.3, 8.36.6, 1.1.1, 1.2.5, 1.4.3, 1.4.5, 1.10.4; Strabo 8.6.10; Aelian, Historical Miscellany 12.61 (Greek only; our translation).
- The book. Wikipedia (Description of Greece): ten books on mainland Greece; the islands left out; title Ἑλλάδος περιήγησις; Habicht's "He definitely prefers the sacred to the profane and the old to the new" and "It was not read … not a whisper before the sixth century (Stephanus Byzantius), and only three or two references … throughout the Middle Ages"; his few words often the only surviving literary source. Upatras record of the Loeb: Elis in two books (vol. 2 ends "Elis 1", vol. 3 begins "Elis 2"). LSJ (site's copy): περιήγησις "leading round and explaining, as is done by guides and cicerones"; "geographical description". Jones: the method (road to a centre, then each road out and back); main interest sanctuaries, statues, tombs and legends; omissions (scenery, agriculture, trade); the footnote on "a night's lodging"; style simple, with verbose expressions and transpositions "sometimes so violent as to throw doubt upon the sense"; some nineteen references to the guides (ἐξηγηταί). Frazer's critical notes: imitations of Herodotus' conjunctions (Pfundtner).
- Archaeology. Frazer: Preller's idea of copying from Polemo revived by Wilamowitz (Hermes 1877); Kalkmann's theory (1886), substantially retracted (Archäologischer Anzeiger 1895); Strabo's "not a vestige of Mycenae" against Pausanias' walls and lion gate; Strabo wrote under Augustus. Wikipedia (Grave Circle A): Schliemann and Stamatakis, 1876, following Homer and Pausanias; five shafts recognised as Pausanias' graves; the burials about three centuries older than Agamemnon's supposed time. Wikipedia (Hermes and the Infant Dionysus): found on 8 May 1877 in the temple of Hera, excavations led by Curtius; the attribution to Praxiteles rests on Pausanias' mention and is fiercely contested. Frazer's "one of the most curious and valuable records bequeathed to us by antiquity".
- Transmission. Frazer: Aelian VH 12.61 refers to Pausanias 8.36.6; Herodian and Philostratus may have used him; Stephanus of Byzantium cites him by name and by the numbers of all ten books. Wikipedia (Claudius Aelianus): c. 175 – c. 235. Wikipedia (Description of Greece, after Diller 1957): a single lost manuscript; Buondelmonti brought it to Italy; Niccoli had it in Florence around 1418; to San Marco after his death in 1437; lost after 1500; eighteen manuscripts known in the 1830s, fifteenth or sixteenth century, full of lacunae; first edition Venice 1516, Aldine firm, Musurus from Venetian Crete; Latin by Amaseo, Rome 1547; Italian 1593; Taylor 1794; Frazer still credible; Levi often thought loose and restructured. Mazzaferro: single archetype belonging to Niccoli; fourteen codices with the whole work or nearly, all by 1550; Parisinus gr. 1410 (1491) long preferred, Marcianus gr. 413 and Laurentianus 56.11 now trusted more, being older; 1516 edition by the heirs of Aldus and Andrea Torresano, edited by Musurus; Amaseo 1547, Bonacciuoli at Mantua 1593; the Valla edition in ten volumes, 1982–2017, directed by Musti and Torelli. Jones: three classes of manuscripts; Parisinus 1410 written 1491; gaps "where the manuscript tradition fails us entirely"; chief editions 1516 Musurus … 1903 Spiro; English translations Taylor 1794, Shilleto 1886, Frazer 1898. Frazer's preface: translated from Schubart's Teubner recension (1853–54); journeys in 1890 and 1895.
- Variants. Frazer's critical notes (on Schubart's text), compared with Spiro's text in the Scroll: 1.1.1 the conjectural Πτολεμαίου "probably right" (Spiro prints it; Jones "Ptolemy, son of Ptolemy, son of Lagus"); 1.2.5 Ἀπόλλων (some manuscripts) against Ἀπόλλωνός (others, and the editions before Schubart), with the consequence for Eubulides; 1.4.3 Λαμιακοῦ, Kiehl's Μαλιακοῦ (Mnemosyne 1852); 1.10.4 the words "unintelligible" and omitted by Frazer, printed with a dagger by Spiro and translated by Jones; 1.4.5 a lacuna marked in Schubart's text, "not absolutely necessary" (Frazer), none in Spiro. Wikipedia (Dagger (mark)): the obelus marked questionable or corrupt words.
- Editions. Perseus file headers: Spiro, Teubner, Leipzig 1903, vols 1–3; Jones and Ormerod, Loeb, Harvard and Heinemann, 1918–1935, vols 1–4. Jones vol. 1 title page: London, Heinemann; New York, Putnam; 1918. Upatras record: LCL 93, 188, 272, 297–298; Ormerod co-translator of vol. 2; vol. 5 maps, plans, illustrations and index, ed. Wycherley. Rocha-Pereira: Classical Review 29 (1979) review of vols 1–2 (1973, 1977); BNP dictionary (1973, 1977, 1981); Classical Review 40 (1990) review of the revised edition of 1989. Frazer: title page (London, Macmillan, 1898; six volumes). Levi: ARCE record (Penguin Classics, Harmondsworth, copyright 1971).

**Left out because it could not be confirmed**
- A birth year: the draft's "c. 115" (no source); Wikipedia's "c. 110" rests on a book about the Panathenaic Stadium. Only Frazer's inference from Antinous is kept.
- "Begins his Description with Attica (c. 155)" and "completes the work (c. 180)": not found as such; replaced by Frazer's book-by-book dates and the absence of Marcus' death.
- "Ionic turns of phrase": no source; only the borrowed conjunctions (Frazer) and Herodotus as a model (Musti) are kept.
- "Excavators at Olympia, Delphi and Mycenae used him as a guidebook": Mycenae (Schliemann) and Olympia (the Hermes) kept with sources; Delphi left out.
- Frazer's commentary as "the basis of modern archaeological study": not found; Wikipedia's "a credible work of scholarship" was not needed.
- The Suda's silent borrowings (Frazer mentions them; no date opened for the Suda here).
- Wikipedia's account of the ending (a poetess told in a dream to present the book to the Greeks): the Scroll's 10.38.13 tells of Anyte bringing a sealed tablet to heal Phalysius' eyes; the claim is not used.
- Wikipedia's Tartessos claim; Habicht's book *Pausanias' Guide to Ancient Greece* (only the publisher's page opened, which dates it 1999; Wikipedia gives 1985).
- Diller's articles (JSTOR would not open); his findings are used only as reported on Wikipedia.

**Corrected from the draft**
- "Probably from Magnesia ad Sipylum" → very probably a Lydian from near Mount Sipylus; Magnesia marked {debated} (Frazer undecided; Habicht for Magnesia; Sánchez Hernández for Smyrna).
- "Datable references show that he was writing between about 155 and 180" → the dates his remarks actually give: book 1 finished by 160/161 at the latest (Frazer), book 5 in 174, the Costoboci in 170 or 171, nothing on 180; Musti's two phases (135–150, 161–180) given as a debated alternative.
- "Mentions the invasion of the Costoboci (170/1)" kept as 170 or 171 (Wikipedia), not as one year.
- "He was little read in antiquity" → kept, but marked {debated}: Aelian (c. 175–235) names him (VH 12.61, matching 8.36.6), as Frazer noted, against Habicht's "not a single mention".
- "All the surviving manuscripts, some twenty, were copied in Italy in the fifteenth century" → eighteen known in the 1830s, fifteenth or sixteenth century (Wikipedia); fourteen with the whole or nearly, all by 1550 (Valla edition). "In Italy" left out.
- "Niccoli had it in Florence in 1418" → "around 1418" (Wikipedia, after Diller); San Marco after 1437 and lost after 1500 kept.
- Loeb "5 vols (1918–35)" → four volumes of text, 1918–35, with a fifth (maps and index) edited by Wycherley; first volume published by Heinemann and Putnam; Ormerod co-translator of vol. 2 only.
- "His Greek … deliberately varied and often awkward, with an unusual word order" → Jones's words: roundabout expressions and violent transpositions of words.
- The draft's Delphi is not called a site where excavators followed him (no source).

**Weak points to revisit**
- Much of the manuscript history rests on Wikipedia's summary of Diller (1957) and on a blog review of the Valla edition (Mazzaferro, 2019) reporting Musti's introduction; Diller and Musti themselves were not read.
- Habicht's words are taken from Wikipedia's quotation of his 1985 article (JSTOR would not open).
- The two Wikipedia counts (eighteen manuscripts in the 1830s; fourteen complete or nearly in the Valla edition) are both given; they need not conflict, but neither was checked against a manuscript catalogue.
- The Schubart lacuna at 1.4.5 is inferred from the asterisks in Frazer's lemma (his notes are made on Schubart's text); the OCR of Frazer's notes is rough in places, and only readings written out clearly were used.
- The Rocha-Pereira third volume (1981) is confirmed by the BNP dictionary page; the Teubner and De Gruyter catalogue pages would not open.
- The Hermes find: the English part of Wikipedia's page gives the date and place; "found ... in the ruins of that very temple" also follows its first sentence. The Wikipedia page has untranslated French sections, which were not used.

**Fact check (2026-10-09, a second, independent check; report pipeline/factcheck/pausanias.md):** 9 findings, each checked against the cited page or passage (Pausanias 1.4.5 and 8.36.6 in the Scroll; Frazer vol. 1 and Jones vol. 1, Internet Archive texts; Wikipedia's Description of Greece and Geographica; the CiNii record; the UCM abstract), all corrected: the Gauls, not the people of Pergamum, took Ancyra and Pessinus (Jones's English slips; Frazer and the Greek agree), and the passage is earlier in the book, not "a few lines"; Strabo's date given as "about a century and a half before him" (Frazer's "reign of Augustus" is out of date; Dueck dates the Geography AD 18–24); Wilamowitz revived only the general borrowing from Polemo, the Athens–Olympia–Delphi theory is Kalkmann's; Rocha-Pereira's revision 1989–90; the tour ends in Phocis with western Locris; Jones reported the three classes of manuscripts, he did not make them; the North Wind honoured "second to none of the gods"; "the one work of his that we know"; Smyrna the centre "of the Second Sophistic".
