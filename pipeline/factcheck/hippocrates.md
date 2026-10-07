# Fact-check: Hippocrates and the Hippocratic Corpus (web/src/wiki/authors/tlg0627.ts)

Checked 2026-10-07 by an independent checker (not the article's author).

Method. Every `cite` source (15 passages) was opened with `npx tsx scripts/passage.ts <work> <ref>` from `web/` and read against each
sentence that points to it. For the readings attributed to Littré, the First1K TEI files in `pipeline/.cache/corpus/first1k/data/tlg0627`
were read directly. The Scroll's catalogue (`web/public/data/catalog.json`) and the TEI headers were used for the claims about the Scroll.
The `url` sources were downloaded and read in full where possible. Wikipedia was read as raw wikitext (`action=raw`): *Hippocrates*,
*Hippocratic Corpus*, *Hippocratic Oath*, *List of editiones principes in Greek* and *Loeb Classical Library*. Also read: the full OCR
text of Jones's Loeb vol. 1 on the Internet Archive (a 1957 reprint), Hanson's archived *Medicina Antiqua* essay, Smyth §31 on Perseus,
the CMG "Editionen online" page, the Cambridge record of King's *Classical Review* notice, and the Penguin page. One source did not
open: Geller's BMCR review (source 24). The UCL copy returned a Cloudflare page and then 403, bmcr.brynmawr.edu returned 502, and the
Wayback Machine refused with 429. Its claim (vol. XI, LCL 538, 2018, the last Loeb Hippocrates volume) was confirmed by a web search
and by Wikipedia's Loeb list (source 25). The researcher's log (`pipeline/drafts/checked/tlg0627.md`) was read but not relied on.

Totals: **9 findings.**

Three are real slips:
- Jones's Loeb vol. 1 did not come out from Harvard in 1923. The first printing was Heinemann (London) and Putnam (New York).
- *primum non nocere*: the article says the nearest Hippocratic words are in the *Epidemics*. Its own source points first to the Oath
  itself.
- The Budé edition began in 1967 with Robert Joly's volume. Jouanna's first Budé Hippocrates came in 1983.

One concerns the reader rather than the wording. At the cited passage (Epidemics I 1.2.11), the Scroll does not show Adams's sentence
beside the Greek. It stands beside 1.2.5.

The rest are dropped attributions or qualifications:
- The *Life*'s birth date comes from Ischomachus, and its archive date and dream story from "Soranus of Cos". The article attributes
  them to "Soranus", the 2nd-century author, or to "the *Life*".
- Jones's "outstanding genius" is not, in Jones, Hippocrates himself.
- "The Great Hippocrates": the article's own source, Jones, reads the Politics passage the other way, and the article does not cite him.
- "soon" and "in the generation after his own" are not supported.

Every Greek quotation matches the Scroll's text letter for letter. Every English quotation (Lamb, Fowler, Rackham, Adams, Jones, Hanson)
is exact.

---

### 1. The *Life* names other authorities for the birth date, the Coan archives and the dream; the article gives them to "Soranus" or "the *Life*"
- **Claim:** "It dates his birth to the first year of the 80th Olympiad, and adds, from the archives of Cos, the day on which the people
  of Cos still made offerings to him.[^3]" Also: "A hostile writer, Andreas, claimed that he left Cos after setting fire to the record
  office at Cnidus; Soranus instead says that a dream told him to settle in Thessaly.[^3]" Also the timeline: "Born on the island of Cos
  (the *Life* says in the first year of the 80th Olympiad)".
- **Problem:** The *Life* reports these as other people's statements:
  - The Olympiad date is "as Ischomachus says in the first book of *On the School of Hippocrates*".
  - The Coan archives and the day of offerings are added by "Soranus of Cos, having searched the record offices on Cos".
  - The dream is "as Soranus of Cos relates". The *Life* also gives a third explanation, from "others": he left to see medical practice
    in other places.

  The article has just introduced "Soranus" as the 2nd-century doctor the *Life* goes under (source 1: Soranus of Ephesus). So
  "Soranus instead says" makes the dream that Soranus's own report. The *Life* names "Soranus of Cos", an earlier writer it cites in the
  third person.
- **Evidence:** `npx tsx scripts/passage.ts tlg0565.tlg004 1`:
  - «ὥς φησιν Ἰσχόμαχος ἐν τῷ πρώτῳ Περὶ τῆς Ἱπποκράτους αἱρέσεως, κατὰ τὸ πρῶτον ἔτος τῆς ὀγδοηκοστῆς ὀλυμπιάδος, ὡς δὲ Σωρανὸς
    ὁ Κῷος ἐρευνήσας τὰ ἐν Κῷ γραμματοφυλακεῖα προστίθησι, μοναρχοῦντος Ἀβριάδα, μηνὸς Ἀγριανίου ἑβδόμῃ καὶ εἰκοστῇ…»
  - «ὡς μὲν κακοήθως Ἀνδρέας φησὶν … διὰ τὸ ἐμπρῆσαι τὸ ἐν Κνίδῳ γραμματοφυλακεῖον· ἄλλοι δέ φασιν, ὅτι προθέσει τοῦ κατὰ τόπους τὰ
    ἀποτελούμενα θεάσασθαι … ὡς δὲ Σωρανὸς ὁ Κῷος ἱστορεῖ, ὄνειρος αὐτῷ παρέστη κελεύων τὴν Θεσσαλῶν γῆν κατοικεῖν.»

  The researcher's log (line 23) notes "born Ol. 80.1 per Ischomachus; Soranus of Cos in the Coan archives", but the article drops both.
- **Suggested fix:** "It dates his birth, on the authority of one Ischomachus, to the first year of the 80th Olympiad, and adds from an
  earlier Soranus of Cos, who searched the archives there, the day on which the people of Cos still made offerings to him.[^3]" Then: "A
  hostile writer, Andreas, claimed that he left Cos after setting fire to the record office at Cnidus; others said he left to see how
  medicine was practised elsewhere, and Soranus of Cos that a dream told him to settle in Thessaly.[^3]" Timeline: "(the *Life*, citing
  Ischomachus, says in the first year of the 80th Olympiad)".
- **Confidence:** high

### 2. Jones did not say that Hippocrates wrote the treatises marked by "an outstanding genius"
- **Claim:** "{debated} Which of them, if any, Hippocrates wrote himself is *the Hippocratic question* … In 1923 Jones, the first editor
  of the Loeb Hippocrates, still held that certain treatises are “impressed with the marks of an outstanding genius”.[^7] Hanson answers
  that there is nothing to connect the Hippocrates of Plato and Aristotle “with any single medical treatise in our present Hippocratic
  Corpus”.[^8]"
- **Problem:** The quotation is exact. But the framing ("still held", "Hanson answers") makes Jones a believer that Hippocrates wrote
  these treatises. In the same sentence Jones sets the identity of their author aside. He says the Hippocrates of tradition "may well be
  left buried in obscurity". What "we do know" is only that some treatises show one great mind. Jones and Hanson are not on opposite
  sides of the authorship question as the article implies.
- **Evidence:** Jones, vol. 1, General Introduction p. xxix (https://archive.org/details/hippocrates01hippuoft, OCR text): "The
  Hippocrates of tradition and the Hippocrates of the commentators may well be left buried in obscurity and uncertainty. What we do know,
  what must be our foundation stone, is that certain treatises in the Corpus are impressed with the marks of an outstanding genius, who
  inherited much but bequeathed much more."
- **Suggested fix:** "In 1923 Jones, the first editor of the Loeb Hippocrates, was content to leave “the Hippocrates of tradition” in
  obscurity, but held that certain treatises are “impressed with the marks of an outstanding genius”.[^7] Hanson goes further: there is
  nothing to connect the Hippocrates of Plato and Aristotle “with any single medical treatise in our present Hippocratic Corpus”.[^8]"
  Add "the Hippocrates of tradition" to `outsideQuotes`.
- **Confidence:** high

### 3. *primum non nocere*: the cited source names the Oath's own words first, not the *Epidemics*
- **Claim:** "And the Latin motto *primum non nocere*, ‘first, do no harm’, is not in the Oath at all; the nearest Hippocratic words are
  the rule from the *Epidemics* quoted above.[^17,14]"
- **Problem:** Source 17 does say that the phrase from which "first" could be translated is not in the Oath. But it adds that the Oath
  vows "a similar intention", and quotes it. Only then does it give the *Epidemics* line as "another related phrase". The Oath's Greek in
  the Scroll (source 18) has two such clauses: «ἐπὶ δηλήσει δὲ καὶ ἀδικίῃ εἴρξειν» and «ἐκτὸς ἐὼν πάσης ἀδικίης ἑκουσίης καὶ φθορίης».
  So "nearest" is the article's own judgement, against its source. "Not in the Oath at all" also overstates: the motto's wording is
  absent, but its sense is in the Oath.
- **Evidence:** Wikipedia, *Hippocratic Oath*, section "First do no harm" (raw wikitext): "no such phrase from which "First" or "Primum"
  can be translated appears in the text of the original oath, although a similar intention is vowed by, "I will abstain from all
  intentional wrong-doing and harm". Another related phrase is found in Epidemics, Book I…". Jones's translation in the Scroll
  (`passage.ts tlg0627.tlg013 oath`; Jones's English is perseus-eng5): "I will use treatment to help the sick … but never with a view to
  injury and wrong-doing … I will abstain from all intentional wrong-doing and harm".
- **Suggested fix:** "And the Latin motto *primum non nocere*, ‘first, do no harm’, is not in the Oath, though the Oath does promise to
  “abstain from all intentional wrong-doing and harm”; the rule from the *Epidemics* quoted above is close to it too.[^17,18,14]" ("abstain
  from all intentional wrong-doing and harm" is in Jones's English in the Scroll, so it needs no `outsideQuotes` entry.)
- **Confidence:** high

### 4. Jones's Loeb vol. 1 of 1923 was published by Heinemann and Putnam, not Harvard
- **Claim:** editions: "W. H. S. Jones, *Hippocrates*, vol. 1 (Loeb Classical Library 147; London: Heinemann; Cambridge, MA: Harvard
  University Press, 1923)." Also the label of source 10: "Jones's volume 1, Heinemann and Harvard, 1923".
- **Problem:** Harvard University Press became the Loeb's American publisher only after 1923. The first printing's imprint is London:
  William Heinemann; New York: G. P. Putnam's Sons. "Harvard … 1923" comes from the Perseus TEI header, which describes a later printing
  ("1923 (printing)"). The article's own Internet Archive scan (source 7) is a reprint whose title page reads "First printed 1923 /
  Reprinted 1939, 1948, 1957", with Heinemann and Harvard.
- **Evidence:** Internet Archive metadata for hippocrates01hippuoft: "publisher: London : Heinemann ; New York : Putnam". Library record
  (Université de Nantes, PPN056426763): "London ; New York : W. Heinemann : G. P. Putnam's sons, 1923 … The Loeb classical library (Greek
  authors ; 147)". The scan's title page (OCR): "LONDON WILLIAM HEINEMANN LTD CAMBRIDGE, MASSACHUSETTS HARVARD UNIVERSITY PRESS …
  First printed 1923 Reprinted 1939, 1948, 1957". Catalogue description in the Scroll: "Hippocrates, Vol. 1. Jones … London: William
  Heinemann Ltd.; Cambridge, MA: Harvard University Press, 1923 (printing)."
- **Suggested fix:** "W. H. S. Jones, *Hippocrates*, vol. 1 (Loeb Classical Library 147; London: Heinemann; New York: Putnam, 1923;
  later printings Heinemann and Harvard University Press).[^7,10,25]" Source 10's label: "Jones's volume 1, 1923, in a printing by
  Heinemann and Harvard".
- **Confidence:** high

### 5. The Budé edition began in 1967 with Robert Joly; Jacques Jouanna's first Budé volume came in 1983
- **Claim:** timeline: `{ year: 1967, kind: "print", what: "Jacques Jouanna and others begin the Budé edition, with French translation", src: [9] }`
- **Problem:** This repeats Wikipedia's wording ("Beginning in 1967, an important modern edition by Jacques Jouanna and others began to
  appear"). But it suggests that Jouanna began the series in 1967. The first Budé (Collection des Universités de France) Hippocrates
  volume of 1967 was Robert Joly's *Du régime* (tome VI, 1re partie). Jouanna's first Budé Hippocrates was *Maladies II* (tome X,
  2e partie), 1983. Jouanna later became the series' leading editor, but he did not begin it. The transmission sentence ("since 1967 the
  French Budé series has been doing the same") is correct and can stay.
- **Evidence:** Wikipedia, *Hippocratic Corpus*: "Beginning in 1967, an important modern edition by Jacques Jouanna and others began to
  appear (with Greek text, French translation, and commentary) in the Collection Budé." Library records found by web search: Hippocrate,
  *Du régime*, texte établi et traduit par R. Joly, CUF tome VI 1, Paris: Les Belles Lettres, 1967 (DAI Zenon record 000177404; Wellcome
  Collection). Hippocrate, tome X 2, *Maladies II*, texte établi et traduit par J. Jouanna, Paris: Les Belles Lettres, 1983 (Wellcome
  Collection; historyofmedicine.com id 12880).
- **Suggested fix:** "The French Budé edition (Collection des Universités de France) begins, Greek text with French translation; Jacques
  Jouanna, from 1983, is among its editors". Or simply "The French Budé edition begins to appear, Greek text with French translation"
  (src [9]).
- **Confidence:** high

### 6. "The Great Hippocrates": the article's own source, Jones, reads the Politics passage the other way, and is not cited
- **Claim:** "This joke lies behind the claim, repeated in Wikipedia, that Aristotle called him “The Great Hippocrates”; Aristotle only
  says that he was greater as a doctor, whatever his height.[^1,5]"
- **Problem:** Neither cited source says that the Politics passage "lies behind" the Wikipedia claim. Wikipedia (source 1) cites "Jones
  … p. 38", not Aristotle. The link is made by the article's own source 7. Jones cites exactly this passage (Politics VII.4, 1326a), and
  he takes it as evidence that Hippocrates was *already known* as "the Great Hippocrates". So the article corrects Wikipedia by
  contradicting the scholar it relies on elsewhere, without saying so and without citing him. Its literal reading of the Greek is fair,
  but the passage is a comparison built on the word μείζω ("greater"), not a joke. Whether it alludes to an existing epithet is a matter
  of interpretation.
- **Evidence:** Jones, vol. 1, General Introduction (OCR text, line ~2189): "From Aristotle¹ we learn that Hippocrates was already known
  as “the Great Hippocrates.” … ¹ Politics, VII. 4 (1326 a)." Wikipedia, *Hippocrates* (wikitext): "According to [[Aristotle]]'s
  testimony, Hippocrates was known as "The Great Hippocrates".<ref name="jones38">{{Harvnb|Jones|1868|p=38}}</ref>".
  `passage.ts tlg0086.tlg035 7.1326a`: «οἷον Ἱπποκράτην οὐκ ἄνθρωπον ἀλλʼ ἰατρὸν εἶναι μείζω φήσειεν ἄν τις τοῦ διαφέροντος κατὰ τὸ
  μέγεθος τοῦ σώματος».
- **Suggested fix:** "Jones took this sentence to show that he was “already known as ‘the Great Hippocrates’”, and Wikipedia repeats
  the claim; the Greek itself says only that he was greater as a doctor, whatever his height.[^5,7,1]" Add "already known as ‘the Great
  Hippocrates’" to `outsideQuotes`.
- **Confidence:** medium

### 7. The reader does not show Adams's "to do good or to do no harm" beside the passage cited (Epidemics I 1.2.11)
- **Claim:** "The same book gives the rule «ἀσκεῖν περὶ τὰ νοσήματα δύο, ὠφελεῖν ἢ μὴ βλάπτειν»: in Adams's translation, the doctor should
  have “two special objects in view with regard to disease, namely, to do good or to do no harm”.[^14]" Source 14 is `tlg0627.tlg006`,
  ref `1.2.11`.
- **Problem:** The Greek and the English quotation are both exact, and Adams's English is in the Scroll. But a reader who follows
  footnote 14 will not find that sentence beside the Greek. In section 2 of Epidemics I, Adams numbers his parts 1–6, while Jones's Greek
  numbers the subsections 1.2.4–1.2.12. Three of Adams's numbers (4, 5, 6) happen to match Greek numbers, so the reader pairs them by
  number, not by content:
  - Greek 1.2.4 gets Adams's parts 1–4.
  - Greek 1.2.5 gets part 5, which is the passage with the quoted rule.
  - Greek 1.2.6–1.2.12 together get only part 6.

  Today's alignment fix (commit ee7a320) handles section 1.3, where no numbers coincide. It does not catch section 1.2, because half of
  Adams's numbers there match. This is a reader problem, not a wording error, but it makes the citation hard to check.
- **Evidence:** `npx tsx scripts/passage.ts tlg0627.tlg006 1.2.4 1.2.12`:
  - row [1.2.4]: Greek 1.2.4 only; EN "Section II … PART 1 … PART 2 … PART 3 … PART 4 …"
  - row [1.2.5]: Greek 1.2.5 («γενομένου δὲ τοῦ ἔτεος ὅλου…»); EN "PART 5 / With regard to the dangers of these cases … to do good or to
    do no harm. The art consists in three things…"
  - row [1.2.6]: Greek 1.2.6–1.2.12; EN "PART 6 / Pains about the head and neck…"

  `npx tsx scripts/passage.ts tlg0627.tlg006 1.2.11` prints the Greek with no English. The cause is in `web/src/lib/tei/align.ts`,
  `placePieces`: a division is "spread" only when fewer than half its pieces match exactly, and here 3 of 6 match.
- **Suggested fix:** No change to the article's wording. Fix the reader for Adams's Epidemics I section 2: spread that division's pieces
  in order (for instance, treat a division as non-corresponding when its exact matches are not in the right positions, or when the
  English numbering starts at 1 while the Greek starts higher). Then check that `passage.ts tlg0627.tlg006 1.2.11` shows the quoted
  sentence. Until then, the footnote could say "(Adams's English for this passage stands beside 1.2.5 in the reader)", or point to Jones's
  English for the same passage instead.
- **Confidence:** high (on what the reader shows)

### 8. "He was famous in the generation after his own": the sources show him famous in his own lifetime
- **Claim:** "### A famous doctor in his own century / He was famous in the generation after his own."
- **Problem:** The article's own evidence shows him famous while alive. In the *Protagoras* (source 2), Socrates speaks of going to
  Hippocrates of Cos *now* and paying him a fee to be taught, so he is alive and taking pupils. Hippocrates died about 370 (source 1);
  Plato wrote while he was still alive. Wikipedia (source 1) calls Plato and Aristotle "contemporaries", and Hanson (source 8) says "the
  later Plato and … Aristotle". "The generation after his own" fits Aristotle, but not the *Protagoras* evidence that the paragraph goes on
  to use. It also clashes with the heading.
- **Evidence:** `passage.ts tlg0059.tlg022 311`: "Suppose, for example, you had taken it into your head to call on your namesake
  Hippocrates of Cos, the Asclepiad, and pay him money as your personal fee…". Wikipedia, *Hippocrates*: "Hippocrates is mentioned in
  passing in the writings of two contemporaries: in Plato's dialogues … and in Aristotle's Politics, all of which date from the 4th
  century BC." Hanson: "To the later Plato and to Aristotle, Hippocrates from the island of Cos was known as a famous physician".
- **Suggested fix:** "He was famous in his own lifetime, and remembered as famous by the next generation."
- **Confidence:** medium

### 9. "his name was soon attached to the work of many other doctors": "soon" is not in the source
- **Claim:** "…very little is known for certain about what he himself thought, wrote or did, because his name was soon attached to the
  work of many other doctors.[^1]"
- **Problem:** Source 1 says only that his achievements "were often conflated" with those of other Hippocratic writers. It gives no
  timing. The article's other source dates the gathering of the treatises under his name to "Hellenistic times, certainly in Alexandria
  by the middle of the Third Century B.C." (Hanson, source 8). That is about a century after his death, so "soon" is unsupported and
  arguable.
- **Evidence:** Wikipedia, *Hippocrates*: "very little is known concretely about what Hippocrates himself thought, wrote and did, because
  his achievements were often conflated with those of the practitioners of Hippocratic medicine and the writers of the Hippocratic Corpus."
  Hanson, §II (archived page): "These treatises collected under Hippocrates' name in Hellenistic times, certainly in Alexandria by the
  middle of the Third Century B.C."
- **Suggested fix:** "…because his name came to be attached to the work of many other doctors.[^1]"
- **Confidence:** medium

---

## Verified and found correct

- **Plato and Aristotle (sources 2, 4, 5):** «Ἱπποκράτη τὸν Κῷον, τὸν τῶν Ἀσκληπιαδῶν» and Lamb's "your namesake Hippocrates of Cos, the
  Asclepiad", with the answer "A doctor". *Phaedrus* 270: it is Phaedrus who speaks, Fowler's English is exact, and «ἄνευ τῆς τοῦ ὅλου
  φύσεως» lies behind "without knowing the nature of the whole". *Politics* 1326a: the Greek and Rackham's English are exact.
- **The *Life* (source 3):**
  - Ilberg's text, CMG IV, Teubner 1927 (TEI header).
  - Father Heraclides as first teacher; descent from Heracles and Asclepius, 20th and 19th in the Greek's own vague order.
  - Andreas «κακοήθως», the record office at Cnidus.
  - Perdiccas (thought consumptive; love for his late father's concubine).
  - Democritus «ὡς ἐν μανίᾳ»; the Illyrian plague, foretold for Attica, «καὶ τῶν πόλεων καὶ τῶν μαθητῶν ἐπεμελήθη»; Artaxerxes through
    Hystanes, «Ἑλλησποντίων ὑπάρχου».
  - Death «παρὰ Λαρισσαίοις» at 90, 85, 104 or 109; the bees and honey, nurses and thrush («ἀφθῶντα»).
  - Thessalus and Draco the most famous pupils; «πολλὴ γέγονε διαφωνία» about the writings.
- **Letters (source 6):** Letter 5, Hippocrates to Hystanes, «Περσέων δὲ ὄλβου οὔ μοι θέμις ἐπαύρασθαι». The translation is accurate.
- **The works and their Greek (sources 11–15, 18, 22, 23):**
  - *Airs, Waters, Places* 1 and *Sacred Disease* 1: the Greek and Adams's English are exact.
  - Philiscus: «Φιλίσκος ᾤκει παρὰ τὸ τεῖχος», black urine, delirium, cold sweats, "about the middle of the sixth day he died", the
    first of the fourteen cases of book I.
  - *Epidemics* 1.2.11: Jones's Greek is exact, and Littré's «ἀσκέειν, περὶ τὰ νουσήματα, δύο, ὠφελέειν, ἢ μὴ βλάπτειν» is exact (First1K
    file).
  - *Aphorisms* 1.1: the Greek and Adams's English are exact; the Scroll's Greek is Littré's (both files), «ποιεῦντα».
  - The Oath: «ὄμνυμι Ἀπόλλωνα ἰητρὸν…», and Jones's "without fee or indenture", the poison and pessary sentences, "to help the sick",
    "holding such things to be holy secrets" and "I will not use the knife, not even, verily, on sufferers from stone", all exact.
    Littré's «ξυγγραφῆς» confirmed.
  - Aristotle *HA* 3.3 (Bekker, Oxford 1837): «Πόλυβος δὲ ὧδε. Τὰ δὲ τῶν φλεβῶν τέτταρα ζεύγη ἐστίν».
  - *Nature of Man* 11 (Littré): «τέσσαρα ζεύγεά ἐστιν ἐν τῷ σώματι».
- **Galen (source 19):** Kühn 17.2–18.1. «εἴθʼ εἷς ἀφορισμός ἐστιν εἴτε δύο», the preface agreed by "almost all" commentators, and
  «ποιέοντα». The commentaries on *Epidemics* I, *Prognostic*, *Fractures* and *Joints* are in the catalogue, in Greek only.
- **The Scroll (source 10):** 53 works under Hippocrates, 19 with English. Littré, Baillière 1839–61 (First1K headers), and the Hakkert
  1961 reprint for 13 Perseus files. Jones's Greek for *Ancient Medicine*, *AWP*, *Epidemics*, the Oath, *Nutriment* and *Precepts*.
  Adams's English for 17 of the 19 works.
- **Jones vol. 1 (source 7):**
  - "some seventy in all"; Littré's Alexandrian "publication" rejected; "the remains of a library … the Hippocratic school at Cos".
  - Erotian "about the time of Nero", surviving, and accepting the Oath. Herophilus "appears to have been the first"; Bacchius' glossary;
    Heraclides of Tarentum the most celebrated commentator.
  - Pseudo-Ionic forms in the later manuscripts, and the scribes' mistaken "restoration". Manuscripts: "None of our MSS. are very old";
    no canon or order.
  - θ Vindob. med. IV tenth century "Our oldest MS."; A Paris 2253 eleventh century, "transformed our Hippocratic text"; M Marc. 269
    eleventh; V Vat. gr. 276 twelfth; "The chief MSS. containing the Oath are V and M".
  - Calvus 1525 Rome; Aldine 1526; Littré "first scholarly edition", "twenty-two years", "diffuse, and not always accurate", "common
    sense", "practically confined to the Paris MSS."; "a medical text-book almost down to the time (about 1840)".
  - Kühlewein: "Fresh manuscripts have been collated … purged of the pseudo-ionisms".
  - The Oath introduction: "Whatever its origin, it is a landmark in the ethics of medicine"; Littré on operations "without fear or
    scruple"; Gomperz and castration, "by no means new"; Reinhold's «οὐδὲ μὴ ἐν ἡλικίῃ ἐόντας»; footnote "Littré suggests αἰτέοντας"; the
    clause "may be an addition of late but uncertain date"; "the art".
- **Hanson (source 8):**
  - "some 60 medical treatises"; collected "in Hellenistic times, certainly in Alexandria by the middle of the Third Century B.C.".
  - Galen on *Epidemics* I and III and on Thessalus finding II, IV and VI.
  - Scribonius "to prohibit all abortions"; Soranus "decides that the Oath prohibits only abortive pessaries".
  - Galen's enthusiasm, and the Latin translation "early in the Sixteenth Century".
  - "nothing to connect…" and "By what process does this sickness occur?" (exact); writers nameless, unlike Herodotus and Thucydides.
- **Wikipedia (sources 1, 9, 17, 20, 25):**
  - Born about 460 on Cos, other biography "likely to be untrue"; "Father of Medicine"; Soranus of Ephesus, 2nd century; Polybus
    son-in-law and student; Girodet 1792; Larissa.
  - About seventy works, Ermerins's nineteen authors; late 5th to first half of 4th century, Hellenistic works, *Precepts* and
    *Decorum* 1st–2nd century AD; *Epidemics* I and III about 410; Polybus' *Nature of Man* 410–400.
  - Library of Cos or Alexandria; translations in Arabic, Hebrew, Syriac and Latin; forty-two case histories, 25 deaths; Ionic though Cos
    spoke Doric; the natural-causes sentence.
  - Vat. gr. 277 owned and transcribed by Calvus; Adams 1849 "a dozen and a half 'genuine' works".
  - The Oath: not by Hippocrates; P.Oxy. 2547 third century (picture caption); Scribonius Largus AD 43, earliest reference; the poison
    clause disputed; Declaration of Geneva 1948; "As of 2018, all US medical school graduates made some form of public oath but none used
    the original".
  - The Aldine *Epistolae diversorum* of 1499, edited by Musurus, with Ps.-Hippocrates; Hippocrates, Aldine, Venice, 1526.
  - Loeb Hippocrates I–XI, LCL 147–150, 472, 473, 477, 482, 509, 520, 538; vol. I's contents as the article gives them.
- **Smyth §31 (source 16):** "In Attic alone this η was changed back to ᾱ: 1. When preceded by a ρ".
- **CMG (source 21):** CMG I 1, Heiberg, Leipzig et Berlin 1927: Iusiurandum, Lex, De arte, De prisca medicina, De aere locis aquis and
  others; later volumes single treatises with a German, French or English translation.
- **Other editions (sources 26, 27):** King's notice of Jouanna, *Hippocrate* II 2, *Airs, eaux, lieux*, CUF, Les Belles Lettres 1996, in
  *Classical Review* 48.2 (1998), pp. 279–280. Penguin *Hippocratic Writings*, ed. G. Lloyd, trs. Chadwick, Mann, Lonie, Withington.
  Kühlewein, *Hippocratis opera quae feruntur omnia*, 1894 and 1902.

Note, not a finding: the sentence on Soranus and abortion cites [^17,8]. Hanson (8) supports "forbade only abortive pessaries".
Wikipedia (17) describes Soranus differently: two parties of doctors, and Soranus's own willing to prescribe abortion for the mother's
health. The footnote could cite [^8] alone.
