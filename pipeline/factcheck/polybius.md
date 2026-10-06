# Fact-check: Polybius (`web/src/wiki/authors/tlg0543.ts`)

Checked 2026-10-06 by an independent checker who did not write the article.

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts` (run from `web/`) and read against each sentence that points to
it. The Scroll's English for Polybius (Shuckburgh) is numbered differently from its Greek, so Shuckburgh's wording was also read directly in
`pipeline/.cache/corpus/perseus/data/tlg0543/tlg001/tlg0543.tlg001.perseus-eng2.xml`. These `url` sources were downloaded and read in full:
Wikipedia *Polybius*, *Histories (Polybius)*, *Constantinian Excerpts*, *List of editiones principes in Greek*, *Christopher Watson
(translator)* and *De re publica* (raw wikitext); Edwards's Loeb introduction with Thayer's notes, and Paton's Loeb Books 30, 38 and 39
(LacusCurtius); J. M. Moore, "Polybiana", GRBS 12 (1971) (the full PDF, 39 pages); the Cambridge Core page of Moore's CQ article (its
first-page extract); BMCR 2011.05.40 and 2013.06.04; The Latin Library (Livy 30, Cicero *Rep.* 1 and 2); The Founders' Constitution and
the Constitution Society contents page for John Adams; the ECU library record. The Oxford Classical Dictionary page would not open (it
shows a "Just a moment" robot check); its title, with the dates c. 200–c. 118 BCE, is confirmed by the citation in Wikipedia's
*Polybius*. The researcher's log (`pipeline/drafts/checked/tlg0543.md`) was read but not relied on.

**The two points I was asked to check specially.**
- *The manuscript claims.* Moore's CQ extract on Cambridge Core says exactly what the article reports: A is Vaticanus Graecus 124,
  "copied by a monk called Ephraim in the tenth century", "quite probably A should be dated to A.D. 947, though this cannot be certain,
  since Ephraim gave the day of the month and the indiction in the subscription, but not the year". It also gives the two gaps (f. 1v
  col. 2 to the top of f. 2r, and f. 2r ll. 3–9, so the same opening of the book: "facing pages" is right). It says "These lacunae also
  appear in all other manuscripts covering the same section of text". The GRBS article confirms the rest: A "X cent. (A.D. 947?)"; "from
  nearly 300 errors noted in A and not found in the 'Byzantine Tradition'"; FCZJDE "must be derived from a single manuscript (φ) which was
  a gemellus of A"; F = "Vaticanus Urb. Gr. 102, X/XI cent. (Excerpta Antiqua from I-XVIII)"; "the Excerpta Antiqua were selected in the IX
  or X century"; "Book XVII was probably missing by the X century"; M = Vaticanus Gr. 73, *de Sententiis*. All confirmed. But the same
  article contradicts the variants section's "Book 17 has no fragments at all" (finding 2).
- *Numbering and the two English translations.* Both confirmed directly. The Greek 31.23–24 (Scipio's talk) is Shuckburgh's 32.9–10. In
  the Scroll the English shown under Greek 31.23 is about Demetrius's flight. Greek 38.21–22 is Shuckburgh's 39.5. Shuckburgh's Book 39
  is headed "[Including Book XL, of Dindorf's Text.]". At 38.22.3 Shuckburgh has "he did not name Rome distinctly", and White's Appian
  19.132 has "he did not hesitate frankly to name his own country". The two English versions really are opposite. But the Greek is not
  ambiguous, and Paton's Loeb agrees with White, so the {debated} framing is not supported (finding 4).

Totals: **9 findings**. Three are real factual errors (findings 1–3). One is an unsupported "debated" (4). The rest are dropped
qualifications or slightly inaccurate descriptions of what a source says.
- The closing chapter is in Book 39, not the "fortieth book". The article's own variants section and its source say so.
- Moore, the article's own source, says Athenaeus quotes two passages from Book 17, so it is not true that Book 17 "has no fragments at all".
- Cato's joke has only one witness, Plutarch. The Scroll's "Polybius 35.6" is Plutarch's own text printed among the fragments, so
  "Plutarch tells the same story" is wrong.

---

### 1. The closing chapter is not "at the end of his fortieth book"
- **Claim:** "He asks the question again [at the end of his fortieth book](cts:tlg0543.tlg001:39.8.7).[^3]"
- **Problem:** The linked passage is 39.8, the last chapter of Book 39, in the Scroll, in Paton's Loeb and in Büttner-Wobst. Book 40 is
  lost. In the passage itself Polybius says that all that remains is to give the dates and the number of books, which Paton translates
  "and an index of the whole work". "Fortieth book" comes from Edwards's 1922 introduction, which cites "XL.14". Thayer's note on the same
  page (source 3) corrects this. The article's own variants section says the same thing: "the 1922 Loeb introduction cites the last
  chapter as 40.14, while the Loeb's own text, like the Scroll, numbers it 39.8". The summary therefore contradicts the article itself.
  Also, 39.8.7 restates his aim as a statement, not a question.
- **Evidence:** Source 3 (LacusCurtius, Edwards's introduction), Thayer's note 6: "So the Loeb edition; the 40th Book of Polybius hasn't
  come down to us, though; the last surviving chapter of the last book … is XXXIX.8." Paton, Book 39 ch. 8 (LacusCurtius 39*.html):
  "Now that I have actually accomplished all this, nothing remains for me but to indicate the dates included in the history, to give a
  list of the number of books and an index of the whole work." `npx tsx scripts/passage.ts tlg0543.tlg001 39.8.1 39.8.8` gives Book 39,
  chapter 8, and `refs tlg0543.tlg001 40` returns nothing.
- **Suggested fix:** "He comes back to the same question [in the last surviving chapter of his work](cts:tlg0543.tlg001:39.8.7), at the end of Book 39.[^3]"
- **Confidence:** high

### 2. "Book 17 has no fragments at all": the article's own source says Athenaeus quotes Book 17
- **Claim:** "Book 17 has no fragments at all.[^47,43]"
- **Problem:** Source 43 (Moore, GRBS) says that no Byzantine selection (neither the Old Excerpts nor the Constantinian Excerpts) keeps
  anything from Book 17. It also says plainly that two long passages of Book 17 survive in Athenaeus. Shuckburgh's note (source 47) only
  says that "According to Hultsch no fragments or extracts of book 17 are preserved". That is one editor's arrangement, reported second-hand,
  and the same note goes on to say that chapters are "generally classed in book 17". The flat "no fragments at all" goes further than
  either source. The other mention of Book 17 in the article ("Nothing in it comes from Book 17, which was probably already lost") is
  correct.
- **Evidence:** Moore, GRBS 12 (1971) p. 430 n. 42: "Fragments from the books apparently lost in the X century are preserved in the indirect
  tradition; e.g., Athenaeus preserves two quite extensive excerpts from Book XVII, the first of which is specifically said to come from
  that book." Shuckburgh's note (eng2 XML, book 17): "According to Hultsch no fragments or extracts of book 17 are preserved … The first
  seventeen chapters of this book are generally classed in book 17." `npx tsx scripts/passage.ts refs tlg0543.tlg001 17` returns nothing,
  so the Scroll's Greek does have no Book 17.
- **Suggested fix:** "The Scroll has no Book 17 at all: the Byzantine excerpts keep nothing from it, though Athenaeus quotes two passages
  that he says come from it.[^47,43]"
- **Confidence:** high

### 3. Cato's joke has only one witness: the Scroll's "Polybius 35.6" *is* Plutarch's text
- **Claim:** "The Roman statesman Cato mocked the long debate: “As though we had nothing else to do, we sit here the whole day debating
  whether some old Greek dotards should be buried by Italian or Achaean undertakers!” Plutarch tells the same story.[^11,12]"
- **Problem:** The Greek printed in the Scroll at 35.6 is word for word the Greek of Plutarch, *Cato the Elder* 9.2–3. Büttner-Wobst
  prints Plutarch's passage among the fragments because it is thought to come from Polybius. (The researcher's own log says "Polyb. 35.6 =
  Plutarch, Cato 9.2–3".) So Plutarch is not a second witness telling "the same story". He is the only witness, and the quotation is
  Shuckburgh's English of Plutarch's words. The article handles Appian and Strabo correctly elsewhere ("known from Appian's and Strabo's
  retellings"), but not this case.
- **Evidence:** `npx tsx scripts/passage.ts tlg0543.tlg001 35.6.1 35.6.4` gives «ὑπὲρ δὲ τῶν ἐξ Ἀχαΐας φυγάδων ἐντευχθεὶς διὰ Πολύβιον ὑπὸ
  Σκιπίωνος … ὥσπερ οὐκ ἔχοντες εἶπεν ὃ πράττωμεν, καθήμεθα τὴν ἡμέραν ὅλην περὶ γεροντίων Γραικῶν ζητοῦντες …». `npx tsx scripts/passage.ts
  tlg0007.tlg025 9.2 9.3` gives the same words (Σκιπίωνος/Σκηπίωνος aside), down to the Cyclops joke.
- **Suggested fix:** "The Roman statesman Cato mocked the long debate, as Plutarch tells it: “As though we had nothing else to do, we sit
  here the whole day debating whether some old Greek dotards should be buried by Italian or Achaean undertakers!” The Greek text in the
  Scroll prints Plutarch's words among the fragments of Polybius.[^12,11]"
- **Confidence:** high

### 4. "Did Scipio name Rome?" is marked {debated}, but the Greek is clear and no source debates it
- **Claim:** "{debated} Did Scipio name Rome? The Greek, «φασὶν οὐ φυλαξάμενον ὀνομάσαι τὴν πατρίδα σαφῶς», is read in opposite ways by
  the two English versions in the Scroll: “he did not name Rome distinctly” (Shuckburgh's Polybius) and “he did not hesitate frankly to
  name his own country” (Horace White's Appian).[^13,14]"
- **Problem:** The two English versions do disagree; that much is true. But the Greek means "they say that, without guarding his words, he
  named his country clearly". «οὐ» goes with «φυλαξάμενον», and «σαφῶς» with «ὀνομάσαι». Paton's Loeb Polybius at the same passage agrees
  with White, so Shuckburgh is the odd one out and goes against the Greek. None of the article's sources says that scholars debate the
  point, so {debated} and "Did Scipio name Rome?" present one translator's slip as an open question. The one real uncertainty is one the
  article leaves out: the Greek says «φασίν», "they say".
- **Evidence:** `npx tsx scripts/passage.ts tlg0543.tlg001 38.21.1 38.22.3` (Greek 38.22.3) and `tlg0551.tlg009 19.132` (White's
  English). Shuckburgh 39.5 (eng2 XML): "he did not name Rome distinctly, but was evidently fearing for her". Paton, Loeb Book 38 ch. 22
  (https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Polybius/38*.html): "they say that without any attempt at concealment he named his
  own country, for which he feared when he reflected on the fate of all things human."
- **Suggested fix:** Drop {debated}. "Did Scipio name Rome? The Greek says he did: «φασὶν οὐ φυλαξάμενον ὀνομάσαι τὴν πατρίδα σαφῶς», “they
  say that he named his country plainly, without guarding his words” (our translation). Horace White's Appian in the Scroll agrees (“he
  did not hesitate frankly to name his own country”), but Shuckburgh's Polybius reads it the other way: “he did not name Rome distinctly”.[^13,14]"
- **Confidence:** high on the Greek and on Paton. The suggested wording keeps the article's interesting point (the Scroll's two
  translations disagree) without implying a scholarly debate.

### 5. Appian reports Scipio's tears as hearsay ("is said to have")
- **Claim:** "The historian Appian adds that Scipio wept and quoted Homer on the fall of Troy, and that “Polybius wrote this down just as he
  heard it”.[^14]"
- **Problem:** Appian does not say outright that Scipio wept: «λέγεται μὲν δακρῦσαι», "is said to have shed tears". He also says that the
  verses came out "either voluntarily or otherwise". The article drops the "is said".
- **Evidence:** `npx tsx scripts/passage.ts tlg0551.tlg009 19.132`: "Scipio, beholding this spectacle, is said to have shed tears and
  publicly lamented the fortune of the enemy … either voluntarily or otherwise the words of the poet escaped his lips". Paton 38.22.1: "is
  said to have shed tears".
- **Suggested fix:** "The historian Appian adds that Scipio is said to have wept and quoted Homer on the fall of Troy, and that “Polybius
  wrote this down just as he heard it”.[^14]"
- **Confidence:** medium (a dropped qualification, not a wrong fact)

### 6. The golden shields: Walbank, who revised the Loeb, later changed his mind
- **Claim:** "Paton's translation adds ten thousand with golden shields, following a conjecture by the scholar Kaibel; Walbank doubted it,
  but the revised Loeb kept it.[^53,48]"
- **Problem:** Source 48 (BMCR 2013.06.04) does say that Kaibel's golden shields were "wisely questioned in Walbank's Commentary" and kept
  in the revised Loeb. But its note 2 adds that, according to Habicht's note in the new Loeb, Walbank "in the handwritten notes for this
  edition, corrected himself". The text revisions in the new Loeb were Walbank's own (BMCR note 1). The article's "Walbank doubted it, but
  the revised Loeb kept it" suggests the revisers overrode Walbank. In fact Walbank himself had come round to Kaibel.
- **Evidence:** https://bmcr.brynmawr.edu/2013/2013.06.04/: "Kaibel's interpolation of Macedonian 'golden shields', accepted by Paton but
  wisely questioned in Walbank's Commentary, has been retained on doubtful grounds"; note 2: "Habicht's note (p. 158 n. 77) informs us that
  Walbank, 'in the handwritten notes for this edition, corrected himself'"; note 1: "all textual emendations, both Greek and English, were
  done by Walbank". Paton 30.25.5 (LacusCurtius): "twenty thousand Macedonians of whom ten thousand bore golden shields, five thousand
  brazen shields and the rest silver shields". The Scroll's 30.25.5 has no golden shields (confirmed).
- **Suggested fix:** "Paton's translation adds ten thousand with golden shields, following a conjecture by the scholar Kaibel. Walbank
  doubted it in his commentary but later changed his mind, and the revised Loeb kept it; its reviewer still thought the grounds
  doubtful.[^53,48]"
- **Confidence:** high

### 7. Timeline: "present at the sack of Corinth" is stated as fact; the article's own sources hedge or disagree
- **Claim:** (timeline, 146 BC) "With Scipio at the burning of Carthage; present at the sack of Corinth"
- **Problem:** The body text rightly reports this as Strabo's statement: "Polybius, Strabo reports, “says that he was present …”". The
  timeline turns it into plain fact. Edwards (source 3) doubts it: Polybius returned "in time, if not to witness the sack of Corinth by
  Mummius, at any rate to modify the executions". Wikipedia (source 4) puts his return after the sack: "After the destruction of Corinth in
  the same year, Polybius returned to Greece". Strabo's «παρών» need only mean he was there while the soldiers were dicing on the paintings.
- **Evidence:** Edwards's introduction (LacusCurtius): "he returned to Greece, in time, if not to witness the sack of Corinth by Mummius, at
  any rate to modify the executions of the Romans". Wikipedia, *Polybius*: "After the destruction of Corinth in the same year, Polybius
  returned to Greece". Strabo 8.6.23 (`npx tsx scripts/passage.ts tlg0099.tlg001 8.6.23`): "he says that he was present and saw paintings
  that had been flung to the ground".
- **Suggested fix:** "With Scipio at the burning of Carthage; at Corinth, by his own account, when the Roman soldiers played dice on its
  paintings" (keep src [13, 14, 15]; optionally add 3).
- **Confidence:** medium

### 8. The fire-signal alphabet is in five groups, the last one letter short, not "five rows of five letters"
- **Claim:** "The code square that now bears his name comes from his chapter on fire signals, where the alphabet is laid out in five rows of
  five letters.[^4,30]"
- **Problem:** Polybius divides the 24 letters into five groups "of five letters each" and says the last group is one letter short. Each
  group is written on its own tablet. He does not lay out a square of 25. The square with a spare cell is the modern form described by
  Wikipedia.
- **Evidence:** `npx tsx scripts/passage.ts tlg0543.tlg001 10.45.6 10.45.7`: «διελεῖν εἰς πέντε μέρη κατὰ πέντε γράμματα. λείψει δὲ τὸ
  τελευταῖον ἑνὶ στοιχείῳ». Shuckburgh (eng2 XML): "Divide the alphabet into five groups of five letters each (of course the last group
  will be one letter short …). The parties … must then prepare five tablets each, on which the several groups of letters must be written."
- **Suggested fix:** "… comes from his chapter on fire signals, where the alphabet is split into five groups of five letters (the last
  one letter short), each written on its own tablet.[^4,30]"
- **Confidence:** medium (a small inaccuracy)

### 9. Polybius adapts Plato's saying; he does not turn it "on its head"
- **Claim:** "He even turns Plato's saying about philosopher kings on its head: “history will never be properly written, until either men
  of action undertake to write it”.[^26]"
- **Problem:** "On its head" means reversed. Polybius does not reverse Plato's saying; he copies its pattern. Plato: things will go well
  when philosophers become kings or kings philosophers. Polybius: history will go well when men of action write history or historians gain
  practical experience («κἀγὼ δʼ ἂν εἴποιμι», "and I would say [likewise]").
- **Evidence:** `npx tsx scripts/passage.ts tlg0543.tlg001 12.28.1 12.28.5`: «ὁ μὲν οὖν Πλάτων φησὶ … ὅταν ἢ οἱ φιλόσοφοι βασιλεύσωσιν ἢ οἱ
  βασιλεῖς φιλοσοφήσωσι· κἀγὼ δʼ ἂν εἴποιμι διότι τὰ τῆς ἱστορίας ἕξει τότε καλῶς, ὅταν ἢ οἱ πραγματικοὶ … ἢ οἱ γράφειν ἐπιβαλλόμενοι …»;
  Shuckburgh: "Plato says … So I should say that history will never be properly written, until either men of action undertake to write it
  … or historians become convinced that practical experience is of the first importance".
- **Suggested fix:** "He even borrows the shape of Plato's saying about philosopher kings: “history will never be properly written, until
  either men of action undertake to write it”, or historians gain experience of affairs.[^26]"
- **Confidence:** low to medium (a misdescription of the text rather than a wrong fact)

---

## Verified and found correct

- **Opening:** 1.1.5 Greek and Shuckburgh's English word for word; 3.1.9 and Shuckburgh "the fall of the Macedonian monarchy", margin
  "B. C. 220"; Edwards's "220‑168".
- **Life:**
  - Born c. 200 and died c. 118 (Wikipedia; the OCD title as cited there); Edwards "about 208".
  - Megalopolis in the Achaean League; Lycortas strategos (Wikipedia).
  - The urn: Plutarch *Philop.* 21.3, quoted exactly; 183 (Edwards) or 182 (Wikipedia).
  - The 181 embassy, under the legal age: 24.6.5, Greek exact. The king dies and the embassy never sails: 24.6.7.
  - Hipparch: 28.6.9; 170 or 169 and "second-highest position" (Wikipedia); 169‑8 (Edwards).
  - Callicrates and "over a thousand men": Pausanias 7.10.11, exact. "three hundred at most": 7.10.12.
  - The trial that never came, and 151 with fewer than 300 (Edwards); 150 (Wikipedia).
  - The loan of books, Fabius and Scipio and the praetor, "only just eighteen", the hand-clasp quotation: Greek 31.23.4–24.1; Shuckburgh
    32.10, exact.
  - Carthage: 38.21.1, Greek and Shuckburgh exact; "Polybius wrote this down just as he heard it" (White).
  - Corinth: Strabo 8.6.23, exact.
  - The commissioners and the honours in life and death: 39.5.2–4.
  - Philopoemen's statues: Plutarch 21.5–6.
  - Statue sites: Edwards. Pausanias 8.30.8 ("roamed over every land and every sea") and 8.37.2 (both quotations exact).
  - Lost works: Edwards and Wikipedia.
  - Pseudo-Lucian, *Long-Lived* 22, exact.
- **Method:**
  - 1.4.1 (quotation exact; tyche as chance or goddess on Wikipedia *Histories*).
  - 1.14.6 Greek and English exact.
  - 1.2.8 «ὁ τῆς πραγματικῆς ἱστορίας τρόπος»; Habicht's "political history or history of events" (BMCR 2011.05.40, xxiii).
  - 12.25e.1, exact.
  - Habicht on Timaeus, "spiteful and biased" (Wikipedia).
  - 3.48.12, 3.59.7 and 3.4.13: Shuckburgh's wording exact.
  - Cleoxenus and Democlitus (Shuckburgh's spelling; the Greek has Δημοκλείτου).
- **Book 6:** 6.3.5–8, 6.4.6 («ὀχλοκρατίαν»), 6.9.9–10 («αὕτη πολιτειῶν ἀνακύκλωσις»), 6.9.13 and 6.11.11: all quotations exact.
  Anacyclosis and the influence of Book 6 (Wikipedia).
- **Reception:**
  - Dionysius, *Comp.* 4: the Greek is as quoted, and the translation is fair (Polybius is named in the list).
  - Livy 30.45, *Polybius, haudquaquam spernendus auctor*.
  - Cicero *Rep.* 1.34 *coram Polybio* (Laelius speaking to Scipio; the talks were with Panaetius) and 2.27 *Polybium nostrum, quo nemo fuit
    in exquirendis temporibus diligentior*.
  - *De re publica* written 54–51 BC (Wikipedia).
  - Adams: "As we advance, we may see cause to differ widely from the judgment of Polybius" (Founders' Constitution); letters XXX and
    XXXI headed "Polybius" (Constitution Society); 1787.
- **Transmission:**
  - «βύβλους τετταράκοντα»: 3.32.2.
  - Five books complete; the rest from excerpts (Edwards; Wikipedia *Histories*).
  - A, Ephraim, 947, the 11th-century date in Edwards, the twin manuscript, nearly 300 errors, F, the Old Excerpts: all as in the summary
    above.
  - Constantinian Excerpts: 945–959, 53 volumes, at least 25 historians, four survive, Peirescianus at Tours, Vat. gr. 73 palimpsest
    overwritten in the 14th century, Polybius material found nowhere else (Wikipedia).
  - Printing history: 1529 Venice (Lascaris, part of Book 6); 1530 Hagenau (Obsopoeus, Books 1–5 with Perotti's Latin); 1549 Basel (the
    Old Excerpts); 1582 Antwerp (Orsini, *de legationibus*); 1609 Paris (Casaubon) (Wikipedia list).
  - Watson, London 1568, from Perotti's Latin (Wikipedia *Watson*, citing the ODNB; Wikipedia *Histories*).
  - Appian's and Strabo's retellings printed at 38.22 and 39.2 (confirmed with the passage tool).
- **Variants:**
  - The two gaps and their pages (Moore, CQ extract).
  - The Scroll's Greek at 1.2.7, exact.
  - Paton's 1922 square brackets and the 2010 "still partly hypothetical" reconstruction, "for those living irresistible, for those to come
    insurpassable" (BMCR 2011.05.40). Note, not a finding: the Scroll's Büttner-Wobst Greek already has the words this English translates.
    The newness of the 2010 text lies mainly in the following sentence. The article does not say otherwise.
  - Walbank's Pydna reordering not adopted; Book 37 a single sentence (BMCR 2013.06.04; 37.1.1 checked).
  - Zeus Homarios: 2.39.6 «Διὸς Ὁμαρίου», and Shuckburgh's note "The MS. vary between ὁμάριος and ὁμόριος".
  - 1922 introduction "XL.14" against the Loeb text's 39.8 (Thayer's note).
  - Shuckburgh's Book 39 heading "[Including Book XL, of Dindorf's Text.]".
- **Editions:**
  - Büttner-Wobst, Teubner, a recension of Dindorf, 1882–1904 (Wikipedia; BMCR 2011.05.40 n. 1). The Scroll's TEI header: Leipzig,
    Teubner, "1893-", vols. 1–4.
  - Shuckburgh, Macmillan, London and New York, 1889, 2 vols (TEI header).
  - Paton's Loeb 1922–27, LCL 128–161 (Wikipedia).
  - Revised Loeb 2010–12, vol. 6 with Olson (Wikipedia *Histories*; ECU record; BMCR); 236 unattributed fragments.
  - Walbank 1957, 1967, 1979 (Wikipedia, under Sources; Edwards's bibliographical note); "still essential" (BMCR 2013).
  - Moore 1965 (GRBS n. 1; Edwards's note).
  - Waterfield 2010 and Scott-Kilvert/Walbank 1979 (Wikipedia *Histories*).
- **Timeline:** every entry matches its sources, except the "present at the sack of Corinth" wording (finding 7).

**Could not open:** the Oxford Classical Dictionary page (robot check). The c. 200–c. 118 dates it supports also stand on Wikipedia.

**Findings: 9** (high: 1, 2, 3, 4, 6; medium: 5, 7, 8; low to medium: 9).
