# Fact-check: Marcus Aurelius (web/src/wiki/authors/tlg0562.ts)

Checked 2026-10-07 by an independent checker who did not write the article.

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts` and read against each sentence that points to it:
*Meditations* 1.1, 1.6, 1.7, 1.17.9, 2.1, 2.2, 2.17, 3.5, 3.14, 4.3, 5.1, 6.30, 11.3 and 12.36 (Leopold's Greek; the Scroll
has no English), Herodian 1.2.1–1.4.8, and the Suda α 830 and α 1903. Every `url` source was fetched: Wikipedia *Marcus
Aurelius*, *Meditations*, *Marcomannic Wars* and *Wilhelm Xylander* (raw wikitext); John Sellars's IEP article (as text);
Haines's Loeb of 1916 and Leopold's Oxford text of 1908 (Internet Archive OCR text: preface, introduction, testimonia,
apparatus, notes and index); the LSJ entries in the site's copy (`pipeline/.cache/lsj`). Also checked: Wikipedia
*Equestrian statue of Marcus Aurelius*, *Equestrian statue*, *Marcus Nonius Balbus* and *Gilt Bronzes from Cartoceto di
Pergola* (for finding 2); the Bavarian State Library record of Xylander's 1558 edition; the TEI header of
`tlg0562.tlg001.perseus-grc2.xml`. One limitation: the Internet Archive OCR of Leopold lacks the page with *Med.* 3.5, so his
note there could not be read; the article's general remark that his notes cite the Suda is borne out elsewhere in his
apparatus. The researcher's log (`pipeline/drafts/checked/tlg0562.md`) was read but not relied on.

Totals: **10 findings**, none of them grave. Every Greek quotation matches the Scroll letter for letter. Every "our
translation" was checked against the Greek and is faithful. Every English quotation from Haines, the IEP, Wikipedia and
LSJ matches its source. The main points:
- The equestrian statue is not "the only Roman equestrian statue" to survive. Other Roman equestrian statues survive, in
  marble and in gilt bronze.
- Wikipedia says Lucius Verus "may have" died of the plague. The article says "probably".
- Leopold's apparatus shows that the lost Palatine manuscript was titled τῶν εἰς ἑαυτόν, without ἠθικά. So Arethas'
  τὰ εἰς ἑαυτὸν ἠθικά was not "the title in the manuscript behind the first printed edition".

---

### 1. The statue is not the only Roman equestrian statue to survive
- **Claim:** "His bronze statue on horseback, made about 175 and now in the Capitoline Museums in Rome, is the only Roman equestrian statue to have survived into modern times.[^1]"
- **Problem:** The claim comes from Wikipedia's *Marcus Aurelius* page (source 1), and it is wrong as stated. Several marble equestrian statues of Marcus Nonius Balbus survive from Herculaneum. A Roman gilt-bronze equestrian group survives from Cartoceto. Wikipedia's own page on the statue says something narrower. Its page on equestrian statues calls this one "almost the only" surviving Roman equestrian *bronze*.
- **Evidence:** https://en.wikipedia.org/w/index.php?title=Equestrian_statue&action=raw: "Almost the only surviving Roman equestrian bronze, the equestrian statue of Marcus Aurelius on the Campidoglio in Rome, owes its preservation to the popular misidentification…". https://en.wikipedia.org/w/index.php?title=Equestrian_statue_of_Marcus_Aurelius&action=raw: "Although there were many equestrian imperial statues, they rarely survived … that of Marcus Aurelius is one of only two surviving bronze statues of a pre-Christian Roman emperor". https://en.wikipedia.org/w/index.php?title=Marcus_Nonius_Balbus&action=raw: "Several equestrian statues of Balbus have been found". https://en.wikipedia.org/w/index.php?title=Gilt_Bronzes_from_Cartoceto_di_Pergola&action=raw: "the only surviving Roman gilt bronze equestrian group".
- **Suggested fix:** "His bronze statue on horseback, made about 175 and now in the Capitoline Museums in Rome, is almost the only Roman equestrian bronze to have survived; it was spared because people took it for Constantine, the Christian emperor.[^1]" If a new source can be added, cite Wikipedia *Equestrian statue* for "almost the only". Otherwise: "…is the best preserved of the very few Roman bronze equestrian statues to survive.[^1]"
- **Confidence:** medium

### 2. Wikipedia says Lucius "may have" died of the plague; "probably" overstates it
- **Claim:** "Lucius died in 169, probably of the plague, and Marcus ruled alone.[^1,2]"
- **Problem:** Source 1 says only "may have". Source 2 (IEP) gives the year 169 but says nothing about the cause.
- **Evidence:** https://en.wikipedia.org/w/index.php?title=Marcus_Aurelius&action=raw (lead): "Lucius Verus may have died from the plague in 169." No other statement on the cause of his death appears on the page. IEP §1: "becoming sole Emperor in C.E. 169".
- **Suggested fix:** "Lucius died in 169, perhaps of the plague, and Marcus ruled alone.[^1,2]"
- **Confidence:** medium

### 3. The lost manuscript's title was τῶν εἰς ἑαυτόν, without ἠθικά
- **Claim:** "In notes on Lucian, Arethas calls it τὰ εἰς ἑαυτὸν ἠθικά, “the ethical writings to himself”, and that was the title in the manuscript behind the first printed edition.[^8]"
- **Problem:** Wikipedia (source 8) does say this, after Farquharson. But Leopold's apparatus (source 19, cited elsewhere in the article) gives P's title as τῶν εἰς ἑαυτόν, without ἠθικά. The ἠθικά form is Arethas' own, in his scholia. The article itself says earlier, after the IEP, that the title it carries now, Τὰ εἰς ἑαυτόν, "comes from a manuscript now lost". The two sentences do not agree.
- **Evidence:** Leopold, p. 1, apparatus to the book title (archive.org/details/mantoninusimpera00marcuoft, OCR text): "Titulo carent A D : τῶν εἰς ἑαυτόν P Mo 1 : τῶν καθ᾽ ἑαυτόν X : ἐκ τῶν Μάρκου C". Leopold, testimonia: "ἧς καὶ Μάρκος ὁ Καῖσαρ ἐν τοῖς εἰς ἑαυτὸν Ἠθικοῖς αὑτοῦ μέμνηται. Schol. (Arethae) in Lucian." IEP §2: "The current Greek title—ta eis heauton ('to himself')—derives from a manuscript now lost".
- **Suggested fix:** "In notes on Lucian, Arethas calls it τὰ εἰς ἑαυτὸν ἠθικά, “the ethical writings to himself”; the manuscript behind the first printed edition was headed more simply τῶν εἰς ἑαυτόν, “of the things to himself”.[^8,19]"
- **Confidence:** medium (Leopold's OCR of the apparatus line is clear; the page image was not opened)

### 4. "Almost certainly" overstates the source's "unlikely"
- **Claim:** "It was almost certainly never meant to be published.[^8]"
- **Problem:** The cited source says only that publication was "unlikely" to have been intended. That is a weaker judgement. The book itself does not settle the question, so this is an inference about the author's intentions.
- **Evidence:** https://en.wikipedia.org/w/index.php?title=Meditations&action=raw: "It is unlikely that Marcus Aurelius ever intended the writings to be published."
- **Suggested fix:** "It was very probably never meant to be published.[^8]" Or: "Scholars think it unlikely that he ever meant it to be published.[^8]"
- **Confidence:** low

### 5. Herodian says Marcus was worn out by age, toil and care, and then fell ill
- **Claim:** "The historian Herodian, writing in the next century, tells how the old emperor, worn out by illness and care, called his friends to his bedside…"
- **Problem:** In Herodian the illness comes afterwards. Marcus was already worn out by age, toils and cares when a severe illness struck him.
- **Evidence:** `npx tsx scripts/passage.ts tlg0015.tlg001 1.2.1 1.4.8`, 1.3.1: «γηραιὸν ὄντα Μάρκον, καὶ μὴ μόνον ὑφ̓ ἡλικίας ἀλλὰ καμάτοις τε καὶ φροντίσι τετρυχωμένον, διατρίβοντά τε ἐν Παίοσι, νόσος χαλεπὴ καταλαμβάνει».
- **Suggested fix:** "…tells how the old emperor, worn out by age, toil and care, fell gravely ill among the Pannonians, called his friends to his bedside…"
- **Confidence:** low

### 6. "The precepts of Marcus" is Haines's English, but Haines is not cited; the cited Wikipedia has "exhortations"
- **Claim:** Timeline: "Themistius speaks of “the precepts of Marcus”: perhaps the first mention of the book" (src [2, 8]). Transmission: "…he had no need of the *parangelmata*, the “precepts”, of Marcus…[^8,2]"
- **Problem:** The rendering "precepts" comes from Haines (source 5), who is not cited at either place. Wikipedia (source 8) gives "exhortations". The IEP (source 2) gives no wording at all. The quotation marks therefore point to sources that do not contain it. (Haines also dates Themistius' speech "about 350". The article follows the IEP and Wikipedia with 364.)
- **Evidence:** Haines, introduction p. xv: "the Orations of the pagan philosopher Themistius, who speaks of the παραγγέλματα (precepts) of Marcus". Wikipedia *Meditations*: "'You do not need the exhortations (παραγγέλματα) of Marcus.'" Leopold, testimonia: «Οὐδέν σοι προσδεῖ τῶν Μάρκου παραγγελμάτων…» (Themistius, Or. 6).
- **Suggested fix:** Add source 5 to both places: timeline `src: [2, 8, 5]`, and "…the “precepts”, of Marcus; whether he meant this book is doubtful.[^8,2,5]"
- **Confidence:** low (a footnote matter)

### 7. "At Basel" in 1568 is not in the source cited for that sentence
- **Claim:** "By his second edition, at Basel in 1568, he no longer had the manuscript.[^8]"
- **Problem:** Wikipedia (source 8) gives 1568 and the loss of the manuscript, but not Basel. Basel comes from Leopold (source 19).
- **Evidence:** Wikipedia *Meditations*: "By 1568, when Xylander completed his second edition, he no longer had access to the source". Leopold, praef. p. vii: "Editio princeps Xylandri … denuo Basileae a. 1568 ab auctore purgata et novis quibusdam notis aucta prodiit".
- **Suggested fix:** "By his second edition, at Basel in 1568, he no longer had the manuscript.[^8,19]"
- **Confidence:** low (a footnote matter)

### 8. Haines did not translate the place-notes as dating Books 2 and 3; he said so in his introduction
- **Claim:** "Haines thought the first “more likely” heads Book 2, and translated the notes as saying that Book 2 was written among the Quadi and Book 3 at Carnuntum"
- **Problem:** In Haines's translation the notes stay where they stand in his Greek, at the ends of Books 1 and 2: "Written among the Quadi on the Gran" and "Written at Carnuntum". His footnotes give his opinion on each, more firmly on the first than on the second. The reading "Book 2 … Book 3" comes from his introduction, not from his translation.
- **Evidence:** Haines, p. 25 (English at the end of Book 1): "Written among the Quadi on the Gran", with the footnote "These words may be intended either to conclude the first book or, more likely, head the second". P. 43 (end of Book 2): "Written at Carnuntum", with the footnote on p. 42: "These words may very possibly be intended as a heading for Book III". Introduction p. xi: "notes added in one MS between Books I and II and II and III shew that the second Book was composed when the writer was among the Quadi on the Gran, and the third at Carnuntum".
- **Suggested fix:** "Haines thought the first “more likely” heads Book 2 and the second “very possibly” Book 3, and in his introduction he took them to show that Book 2 was written among the Quadi and Book 3 at Carnuntum; Wikipedia gives the Quadi to Book 1 and Carnuntum to Book 2.[^5,8]"
- **Confidence:** low

### 9. The Suda does not quote the first line of 1.6 word for word
- **Claim:** "Under the word ἀκενόσπουδος, “shunning vain pursuits”, it quotes the first line of [Book 1, chapter 6](cts:tlg0562.tlg001:1.6.1)…[^20,15,22]"
- **Problem:** The Suda quotes the opening words in its own form, with ἔμαθον, "I learned", added. It stops after the second item.
- **Evidence:** `npx tsx scripts/passage.ts tlg9010.tlg001 1.A.830`: «Ἀκενόϲπουδον· παρὰ Διογνήτου ἔμαθον τὸ ἀκενόϲπουδον καὶ τὸ ἀπιϲτητικόν. φηϲὶ Μάρκοϲ ὁ φιλόϲοφοϲ βαϲιλεύϲ.» Scroll 1.6.1: «Παρὰ Διογνήτου τὸ ἀκενόσπουδον· καὶ τὸ ἀπιστητικὸν τοῖς ὑπὸ τῶν τερατευομένων…».
- **Suggested fix:** "…it quotes, in its own words (“from Diognetus I learned …”), the opening of [Book 1, chapter 6](cts:tlg0562.tlg001:1.6.1)…"
- **Confidence:** low

### 10. Two footnote slips: Haines dates the Suda about 900, and source 22 cites a range of thirty chapters
- **Claim:** (a) Timeline: `{ year: 980, approx: true, kind: "reception", what: "The Suda, a Byzantine encyclopedia of the late tenth century, …", src: [8, 5, 20] }`. (b) Source 22: `{ label: "Marcus Aurelius, Meditations 1.6 and 3.5, …", cite: { work: "tlg0562.tlg001", ref: "1.6.1", to: "3.5.1" } }`
- **Problem:** (a) Haines (source 5) puts the Suda "about 900", not in the late tenth century. Only Wikipedia (source 8) supports the date in the timeline. (b) The label says "1.6 and 3.5", but the citation is a range. It opens everything from 1.6 to 3.5, which is the rest of Book 1, all of Book 2 and the start of Book 3.
- **Evidence:** (a) Haines, introduction p. xv: "about 900, the compiler of the dictionary, which goes by the name of Suidas…". Wikipedia *Meditations*: "the *Suda* lexicon published in the late 10th century". (b) `npx tsx scripts/passage.ts tlg0562.tlg001 1.6.1 3.5.1` prints all the chapters between them.
- **Suggested fix:** (a) Keep the date, but give the timeline item `src: [8, 20]` and leave Haines in the prose, where he supports the quotation count. Or write "late tenth century (Haines: about 900)". (b) Make source 22 `{ ref: "1.6.1" }` with the label "Meditations 1.6". Cite 3.5 through the in-text link that is already there, or as a separate source added at the end of the list so that the numbers do not change.
- **Confidence:** low (footnote matters)

---

## Verified and found correct

- **Life (Wikipedia, IEP):** the following all match their sources:
  - born in Rome 26 April 121; emperor 161–180; Stoic; last of the Five Good Emperors;
  - father died when he was three; raised by his mother and paternal grandfather;
  - Hadrian adopted Marcus' uncle Antoninus in 138, and Antoninus adopted Marcus and Lucius;
  - Herodes Atticus and Fronto, "the most esteemed orators of their time"; Rusticus "would have the strongest influence", having "wooed Marcus away" from oratory;
  - joint accession with Lucius Verus in 161; the Parthian war; Marcomanni, Quadi and Iazyges, about 166–180;
  - the Antonine Plague "in 165 or 166", and Galen in Rome when it arrived in 166; Commodus co-emperor from 177;
  - death on 17 March 180 aged 58 at Vindobona or near Sirmium, with the sources disagreeing;
  - the Historia Augusta lives of Avidius Cassius unreliable; Christians named only once (11.3);
  - the *Meditations* written on campaign "between 170 and 180" (Wikipedia) or "c. 171–175" (IEP);
  - the favourite of Frederick the Great, Mill, Arnold and Goethe; 100,000 copies in 2019; the statue c. 175 in the Capitoline Museums.
- **The book (IEP, Haines, Wikipedia):** the following all match:
  - the title from a lost manuscript, perhaps a later addition, first recorded c. 900;
  - entries "in no particular order"; Book 1 "may well have been written separately" (IEP) and "probably written as a whole", with Schenkl holding it was written last (Haines);
  - Marcus never calls himself a Stoic, and is open to other schools; he quotes Epictetus' *Discourses* "a number of times";
  - Haines's "true spiritual father" and "Epictetus the Phrygian slave"; "this small but priceless book of private devotional memoranda"; the footnote on ὑπομνημάτια at 3.14;
  - "words have occasionally to be supplied"; headquarters at Carnuntum 171–173, near Vienna;
  - "corrupt beyond cure"; Swain on non-Attic Greek;
  - Sellars's "from a modern perspective … certainly not in the first rank"; the written exercises; Hadot's "clé" and the three topoi.
- **Transmission:** the following all match:
  - Herodian 1.2.3 and 1.2.4 (Greek exact; translations faithful); Herodian 1.4.7, "a night and a day";
  - Themistius to Valens, about 364, doubtful; the Historia Augusta's three days, correctly marked {legend};
  - Arethas: before 907, the letter to Demetrius of Heraclea, "so old indeed that it is altogether falling to pieces", Μάρκου τοῦ αὐτοκράτορος τὸ μεγαλωφελέστατον βιβλίον (Leopold, testimonia), the Lucian scholia, the likely ancestor;
  - the Suda: about thirty quotations from Books 1, 3, 4, 5, 9 and 11, the ἀγωγή "in twelve books", the first mention of twelve books; Suda α 830 and α 1903 (ἀναμένων) exact;
  - Tzetzes c. 1150, Books 4–5; the anthologies of the 14th–16th centuries, perhaps by Planudes, "twenty-five or more MSS", "practically of no help";
  - P from Otto Heinrich's library, printed 1558 and lost; A = Vat. gr. 1950, *bombycinus* (paper), 14th century, from Gradi 1683, about 42 lines lost; A as the one surviving manuscript of the whole work (Leopold: "hi sunt libri quibus totum Antonini opus continetur");
  - D Darmstadt 2773, 14th century, more than a hundred extracts from Books 1–9; C Paris suppl. gr. 319, 15th century; D and C "some independent help";
  - P and A sharing lacunae and corruptions "sescenties … vel in orthographia", from a common recension; P purer, A often truer; Schultz's complaint;
  - Xylander at Zurich, 1558 or 1559 (Leopold gives both), at Gesner's instigation, with a Latin translation and notes;
  - Lyon 1626, the first division into chapters, Xylander's translation already divided; Casaubon's English translation 1634; Gataker, Cambridge 1652, "voluminous notes";
  - Barberini 1675, Assemani's copy of 1770 for de Joly, Paris 1774; Stich 1882 and 1903.
- **Variants:** the following all match:
  - P's and A's handling of the two place-notes, exactly as in Leopold's apparatus ("spatio trium fere versuum", "tria proxima capita subnectit", "libro tertio praefixa", and A and D lacking the Carnuntum note);
  - ῥόμβος in P with ῥεμβός noted beside it, ῥεμβός in A D C (Leopold); LSJ s.v. ῥεμβός "M.Ant. 2.17 (v.l.)";
  - Caieta: τούτου in P and A, τὸ τοῦ adopted by Haines (after Lofft) and read as an oracle;
  - 11.3: Leopold prints ὡς οἱ Χριστιανοί, Haines brackets it, "ungrammatical and pretty certainly a gloss".
- **LSJ:** ἡγεμονικόν "the authoritative part of the soul (reason)"; ἀποκαισαρόομαι cited from M.Ant. 6.30 alone; βάπτω "dip", "dye"; ῥόμβος a toy and a whirling motion; ἀκενόσπουδος "shunning vain pursuits".
- **Editions:** the following all match:
  - Leopold, OCT, Oxford 1908; the TEI header does name "Teubner, Leipzig", so the article's note is right;
  - Haines, London: Heinemann and New York: Putnam, 1916 (Internet Archive record), later Harvard reprints (IEP);
  - Farquharson, 2 vols, Clarendon 1944, "arguably the definitive edition"; Dalfen, Teubner 1979, 2nd edn 1987, word index;
  - Hard and Gill, OUP 2011; Hammond, Penguin 2006; Hays, Modern Library 2002 and Weidenfeld & Nicolson 2003; Hadot, *The Inner Citadel*, trans. Chase, Harvard 1998.
- **The Scroll's Greek:** every Greek quotation of Marcus and Herodian matches the Scroll exactly. All the "our translation" renderings are accurate (1.1, 1.7, 2.1, 2.2, 2.17, 3.5, 3.14, 4.3, 5.1, 6.30, 11.3, 12.36, the two place-notes, Herodian 1.2.3, 1.2.4 and 1.4.7, Arethas' phrase, Suda α 830).
