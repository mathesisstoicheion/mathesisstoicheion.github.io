# Fact-check: Epictetus (web/src/wiki/authors/tlg0557.ts)

Checked 2026-10-07 by an independent checker who did not write the article.

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts`: *Handbook* 1, 5, 9 and 29; *Discourses* preface
0.0.1–8, 1.1.22–24, 1.9.29–30, 1.16.20–21, 1.18.8–16, 2.6.20, 2.19.12–13, 3.15.1–5 and 3.23.30; Fragments 1 and 10;
the Gnomologium; Suda E 2424 and A 3868; Origen, *Against Celsus* 6.2 and 7.53; Lucian, *Ignorant Book-Collector* 13 and
*Alexander* 2; Marcus Aurelius 1.7 and 4.41. Each was read against every sentence that points to it. Where the script printed
no English for a range, Long's English was read straight from the TEI file. Every `url` source was fetched: the Stanford
Encyclopedia (Graver, revised 2025, as text); Wikipedia *Epictetus*, *Arrian*, *Enchiridion of Epictetus*, *Discourses of
Epictetus*, *List of editiones principes in Greek* and *Contra Celsum* (raw wikitext); Boter's *CTC* article (scanned PDF,
pp. 1–10 read from page images); Oldfather's Loeb vols 1 and 2 (Internet Archive OCR, 1956 and 1959 reprints: introductions,
bibliography, notes to 1.18.10 and *Ench.* 29, introductions to the Fragments and the *Encheiridion*); Lindsay 1896, p. 43
(Internet Archive OCR); Gellius 15.11, 17.19 and 19.1 (Latin) and 1.2 (Rolfe's English and notes) on LacusCurtius; Photius,
codex 58 (Freese, tertullian.org). The LSJ entries were read in the site's copy (`web/public/data/lsj`). The TEI headers in
`pipeline/.cache/corpus` were read for all the Epictetus files, and the Internet Archive scans they link to were checked.
The researcher's log (`pipeline/drafts/checked/tlg0557.md`) was read but not relied on.

Totals: **8 findings**. None is a misquotation: every Greek quotation matches the Scroll letter for letter, every English
quotation matches Long, Oldfather, Harmon, Rolfe, Freese, Lindsay or LSJ as cited, and the "our translation" renderings
(Gellius 15.11.5 and 19.1.14, Celsus in Origen 7.53, Marcus 1.7.3 and 4.41, Schenkl's Latin heading) match the originals.
The main points:
- Origen's remark comes from *Against Celsus*, written about 248, not "early in the third century" (the timeline puts it at
  230). Both cited sources use the loose phrase, but the work itself is datable.
- The family-life paragraph calls Simplicius "the only evidence". Lucian's *Demonax* 55, cited by both Oldfather and
  Wikipedia, also bears on it.
- The {debated} paragraph on the *Discourses* gives only one dissenting view. Its own sources (Boter, Wikipedia) also name
  the opposite one: that Arrian composed them himself.
- The summary says that everything we have of Epictetus "was taken down by a pupil". The *Handbook* is a compilation, and
  how the *Discourses* were taken down is the very thing the article later marks as debated.

---

### 1. Origen wrote *Against Celsus* about 248, not "early in the third century"
- **Claim:** Body: "Early in the third century the Christian Origen observed that Plato was handled only by the learned, while Epictetus was admired even by ordinary people, «καὶ ὑπὸ τῶν τυχόντων», who felt that his words made them better.[^31,3]" Timeline: `{ year: 230, approx: true, kind: "reception", what: "Early in the third century Origen writes that ordinary people admire Epictetus while Plato is read only by the learned", src: [31, 3] }`
- **Problem:** The passage is *Against Celsus* 6.2 (source 31). That work is usually dated about AD 248, near the end of Origen's life (he died about 253). That is the middle of the third century, not the start. Boter (source 3) and the SEP both say "In the early third century Origen…", but they are describing Origen in general, not dating this book. The timeline's year 230 is about eighteen years too early.
- **Evidence:** Wikipedia, *Contra Celsum* (https://en.wikipedia.org/w/index.php?title=Contra_Celsum&action=raw): "a major apologetics work by the Church Father Origen of Alexandria, written in around 248 AD". Boter, *CTC* 9, p. 5: "In the early third century Origen is the first Christian author to mention Epictetus explicitly." SEP §6: "In the early third century Origen remarks on the popularity of Epictetus … (Contra Celsum 6.2)."
- **Suggested fix:** Body: "About 248, in his reply to the pagan Celsus, the Christian Origen observed that …[^31,3,42]". Add source 42 `{ label: "Wikipedia, Contra Celsum (written about 248)", url: "https://en.wikipedia.org/wiki/Contra_Celsum" }`. Timeline: `{ year: 248, approx: true, kind: "reception", what: "About 248 Origen, answering Celsus, writes that ordinary people admire Epictetus while Plato is read only by the learned", src: [31, 3, 42] }`. If no new source is wanted, write "In the third century" in both places.
- **Confidence:** high on the date. The article's wording does follow its two sources.

### 2. Simplicius is not "the only evidence" on whether he married
- **Claim:** "The Stanford Encyclopedia says that he never married; Oldfather that in old age he took a wife to help him bring the child up; the only evidence, in Simplicius, is ambiguous.[^1,4,2]"
- **Problem:** Two of the three cited sources bring in a second ancient witness. Lucian, *Demonax* 55, tells how Epictetus urged Demonax to marry and have children, and Demonax answered, "Then give me one of your daughters". Wikipedia (source 2) cites it as "a joke at Epictetus' expense … about the fact that he had no family". Oldfather (source 4) cites it as the reason Epictetus at last married. So Simplicius is the main evidence, but not the only one.
- **Evidence:** `npx tsx scripts/passage.ts tlg0062.tlg008 55`: «ὁ Ἐπίκτητος … συνεβούλευεν αὐτῷ ἀγαγέσθαι γυναῖκα καὶ παιδοποιήσασθαι … Οὐκοῦν, ὦ Ἐπίκτητε, δός μοι μίαν τῶν σαυτοῦ θυγατέρων». Harmon's English (it shows up under section 56 in the Scroll; see the note at the end): "When Epictetus rebuked him and advised him to get married and have children … « Then give me one of your daughters, Epictetus »". Wikipedia, *Epictetus*, note: "There is a joke at Epictetus' expense in Lucian's Life of Demonax about the fact that he had no family." Oldfather vol. 1, p. x n. 1: "He had been stung, no doubt, by the bitter and in his case unfair gibe of Demonax, who, on hearing Epictetus' exhortation to marry, had sarcastically asked the hand of one of his daughters (Lucian, Demon. 55)."
- **Suggested fix:** "… Oldfather that in old age he took a wife to help him bring the child up; the ancient evidence, chiefly a remark of Simplicius, is ambiguous.[^1,4,2]"
- **Confidence:** high

### 3. The {debated} paragraph leaves out the other side of the debate
- **Claim:** "{debated} Are they his own words? They are in Koine, … so most scholars trust them as a record of Epictetus' teaching; a few, notably Robert Dobbin, argue that Epictetus composed them himself.[^1,4,3]"
- **Problem:** Boter (source 3) sets out three positions, and Wikipedia's *Discourses* page (source 33) gives two "extreme" ones. Some scholars think Arrian took the words down almost verbatim. Others think Arrian freely composed the *Discourses* from what he had heard. A middle group allows for literary shaping. Dobbin's view, that Epictetus wrote at least part of them, is one more dissent. As written, the paragraph gives only the pro-Epictetus side and so makes the debate look one-sided. The cited sources also do not say "most scholars". The SEP says "we have reason to be confident", and Wikipedia calls it "the mainstream opinion".
- **Evidence:** Boter, *CTC* 9, p. 4: "Some scholars hold that Arrian made stenographic reports of Epictetus' lectures, so that the *Diatribes* represent Epictetus' *ipsissima verba*; others believe that Arrian freely composed the *Diatribes*, using as a basis what he had heard from Epictetus. Still others take a position between these two extremes". The same page also says: "Although some scholars assume that Epictetus is responsible for at least part of the composition of the written works [n. 13: Stellwag; Dobbin] …". Wikipedia, *Discourses of Epictetus*: "Extreme positions have been held ranging from the view that they are largely Arrian's own compositions to the view that Epictetus actually wrote them himself. The mainstream opinion is that the *Discourses* report the actual words of Epictetus, even if they cannot be a pure *verbatim* record."
- **Suggested fix:** "… so the mainstream view trusts them as a record of Epictetus' teaching, if not word for word. At the extremes, some have held that Arrian largely composed them himself, and a few, notably Robert Dobbin, that Epictetus wrote them.[^1,4,3,33]"
- **Confidence:** medium-high

### 4. "Everything we can read of him was taken down by a pupil" is too strong
- **Claim:** Summary: "yet he never published a word: everything we can read of him was taken down by a pupil.[^2,3,4]"
- **Problem:** The cited sources say only that we *owe* everything to Arrian. The *Handbook* was not taken down. Arrian compiled it from the *Discourses* (Oldfather: "a compilation made by Arrian himself"), as the article itself says later. Whether the *Discourses* themselves were "taken down" is the question the article marks {debated} (Dobbin; and those who think Arrian composed them, see finding 3). The summary states as fact what the body leaves open.
- **Evidence:** Boter, *CTC* 9, p. 4: "it is almost universally accepted that Epictetus did not publish anything himself: everything that remains of his teaching is owing to the work of his pupil Arrian." Oldfather vol. 2, p. 479: "This celebrated work is a compilation made by Arrian himself from the Discourses". SEP: "A few scholars, including especially Dobbin (1998), argue that Epictetus must have composed them himself".
- **Suggested fix:** "yet he never published a word: everything we can read of him we owe to a pupil, Arrian.[^2,3,4]"
- **Confidence:** medium

### 5. The "lame old man" passage is a hymn, not a joke
- **Claim:** "Epictetus was lame, and he could joke about it: “what else can I do, a lame old man, than sing hymns to God?”[^11]"
- **Problem:** *Discourses* 1.16.20 is the solemn close of the chapter on Providence, a call to sing hymns to God. Oldfather calls it "the beautiful hymn of praise concluding the sixteenth chapter of the first book". Nothing in the passage is a joke. The article quotes the same passage again later as an example of Epictetus being "tender", which fits it far better.
- **Evidence:** `npx tsx scripts/passage.ts tlg0557.tlg001 1.16.20 1.16.21`: «τί γὰρ ἄλλο δύναμαι γέρων χωλὸς εἰ μὴ ὑμνεῖν τὸν θεόν; … νῦν δὲ λογικός εἰμι· ὑμνεῖν με δεῖ τὸν θεόν. τοῦτό μου τὸ ἔργον ἐστίν … καὶ ὑμᾶς ἐπὶ τὴν αὐτὴν ταύτην ᾠδὴν παρακαλῶ». Long: "But now I am a rational creature, and I ought to praise God: this is my work; I do it, nor will I desert this post". Oldfather vol. 1, p. xvii: "the beautiful hymn of praise concluding the sixteenth chapter of the first book".
- **Suggested fix:** "Epictetus was lame, and he spoke of it without self-pity: “what else can I do, a lame old man, than sing hymns to God?”[^11]"
- **Confidence:** medium

### 6. The 1528 edition printed most of the Greek *Handbook*, not "almost" all of it
- **Claim:** Timeline: `{ year: 1528, kind: "print", what: "The Greek *Handbook*, almost whole, first printed at Venice inside Simplicius' commentary", src: [3, 35] }`
- **Problem:** Boter (source 3) says the 1528 Simplicius contained "the greater part" of the *Encheiridion*. Wikipedia (source 35) says the text was "not published fully", and the *Enchiridion* page says "somewhat abbreviated". None of these says "almost whole". The transmission section ("as headings to the sections of Simplicius' commentary") is correct.
- **Evidence:** Boter, *CTC* 9, p. 8: "The Simplicius edition also contained the greater part of the *Encheiridion*, added as lemmata in the commentary." Wikipedia, *List of editiones principes in Greek*: "Epictetus was not published fully and separately in 1528 but as integrated in Simplicius' commentary; it was in 1529 that the complete text came out in Nuremberg". Wikipedia, *Enchiridion of Epictetus*: "The original Greek was first published (somewhat abbreviated) with Simplicius's *Commentary* in 1528."
- **Suggested fix:** `what: "Most of the Greek *Handbook* first printed at Venice, as headings inside Simplicius' commentary; the complete text follows at Nuremberg in 1529"`
- **Confidence:** medium

### 7. Two sentences rest on footnotes that do not say what they are cited for
- **Claim (a):** "In *Discourses* 1.18 Epictetus tells his pupils to pity wrongdoers rather than hate them, and just there the Oxford manuscript is illegible.[^36,3]"
- **Problem (a):** Neither cited source places the stain at 1.18. The Scroll's Greek (36) shows gaps but says nothing about the manuscript. Boter (3) mentions only "fol. 25". The link to 1.18 is made by Wikipedia's *Discourses* page (33) and by Oldfather's notes on 1.18.10 (4), which report the lacunae "in S".
- **Evidence (a):** Wikipedia, *Discourses of Epictetus*, picture caption: "Note the large stain on the manuscript which has made this passage (Book 1. 18. 8–11) partially illegible." Oldfather vol. 1, p. 122, n. 4: "Supplied by Capps for a lacuna of about five letters in S." Boter, p. 4: "a stain has rendered the passage illegible on fol. 25 of the Oxford codex" (no chapter given).
- **Claim (b):** "The talks belong to Epictetus' later years at Nicopolis, around 108 by the usual dating.[^1]"
- **Problem (b):** The SEP gives 108 as "Millar's (1965) dating", one scholar's, not "the usual" one. "Generally agreed" comes from Wikipedia's *Discourses* page (33), which is not cited here, though the timeline's entry for 108 does cite it.
- **Evidence (b):** SEP: "The teaching represented in the *Discourses* is that of his later career, around the year 108 by Millar's (1965) dating". Wikipedia, *Discourses of Epictetus*: "it is generally agreed that the *Discourses* were composed sometime in the years around 108 AD."
- **Suggested fix:** (a) "… and just there the Oxford manuscript is illegible.[^36,33,4]" (b) "… around 108 by the usual dating.[^1,33]"
- **Confidence:** high (these are citation fixes; the facts themselves stand)

### 8. Long's TEI header gives 1890, not 1887
- **Claim:** Source 40: "The Scroll's copies of Epictetus: each file's header names its source (… George Long's translation, London: George Bell and Sons, 1887 …)"
- **Problem:** The Long files' own `<sourceDesc>` gives the date as **1890**. The year 1887 comes from the site's catalogue (`web/public/data/catalog.json`) and from the Internet Archive scan the header links to, whose title page reads 1887. So 1887 is the right year for the printing used (and the editions list's "the Scroll uses the printing of 1887" is correct), but the header does not "name" it.
- **Evidence:** `pipeline/.cache/corpus/perseus/data/tlg0557/tlg001/tlg0557.tlg001.perseus-eng3.xml` (and `tlg002/…perseus-eng3.xml`): `<publisher>George Bell and Sons</publisher> <date>1890</date>`, with `<ref target="https://archive.org/details/dscrsesepictetus00epiciala/…">`. That scan's OCR title page (https://archive.org/download/dscrsesepictetus00epiciala/dscrsesepictetus00epiciala_djvu.txt): "LONDON: GEORGE BELL AND SONS, YORK STREET, COVENT GARDEN. 1887." Internet Archive metadata: date 1887.
- **Suggested fix:** "… George Long's translation, London: George Bell and Sons, 1887 (the date of the scan the file reproduces; the file's header says 1890) …"
- **Confidence:** high

---

## Verified and found correct

- **Life.** Suda E 2424: Hierapolis in Phrygia, Nicopolis, rheumatism («πηρωθεὶϲ δὲ τὸ ϲκέλοϲ ὑπὸ ῥεύματοϲ», quoted exactly), lived into the reign of Marcus. Birth about 50 (SEP "in the 50s", Boter "probably about A.D. 50"). The Pisidian inscription, and that his coming to Rome as Epaphroditus' slave is "certain" (Boter p. 2). Epaphroditus a freedman and Nero's secretary. Lessons from Musonius while still a slave (Oldfather), Musonius "a Roman senator and Stoic philosopher who taught intermittently at Rome" (SEP). Freed, then teaching on his own (SEP). The four dates for the expulsion (SEP 89, Oldfather 89 or 92, Wikipedia about 93, Boter 94). Death "generally … about 125–30" (Boter), "around 135" (SEP). Nicopolis "an important communications hub and administrative center … on the Adriatic coast" (SEP). Simplicius "lame from an early period of his life" (Oldfather). Never married and adopted a child (SEP); Oldfather's wife. ἐπίκτητος "gained besides … acquired" (LSJ; Wikipedia "gained" or "acquired").
- **Quotations from the Scroll.** Rufus testing him (1.9.29, Long, who supplies "Musonius"); Nicopolis and earthquakes (2.6.20); the lame old man and the nightingale (1.16.20); *Handbook* 9 Greek and Long; Celsus' story (7.53: «κατάσσεις», «οὐκ ἔλεγον … ὅτι κατάσσεις;», with ὑπομειδιῶν ἀνεκπλήκτως rendered fairly as "smiled and said calmly"); the iron lamp (1.18.15); Lucian's lamp and "that marvellous old man" (*Ind.* 13, Harmon); "Arrian, the disciple of Epictetus, a Roman of the highest distinction" (*Alex.* 2); Arrian's preface (both English quotations exact, ὑπομνήματα … ἐμαυτῷ); *Handbook* 1 (Greek and Long); 1.1.23 (Greek and Long); *Handbook* 5 (Greek and Long); 3.23.30 (Greek and Long); Fragment 10 «ἀνέχου et ἀπέχου»; Marcus 1.7.3 «τοῖς Ἐπικτητείοις ὑπομνήμασιν» and 4.41; Origen 6.2 «καὶ ὑπὸ τῶν τυχόντων»; *Handbook* 29.2 and *Discourses* 3.15.3–4 (παρορύσσεσθαι, ἐκβαλεῖν, ἀναγκοτροφεῖν against ἀναγκοφαγεῖν); 2.19.12 (the Homer line); Schenkl's Fragments heading; the gaps and dotted letters in 1.18.10; Long's "these accursed and odious fellows".
- **Other sources.** Gellius 15.11.4–5 ("Domitiano imperante senatusconsulto eiecti atque urbe et Italia interdicti sunt. Qua tempestate Epictetus quoque philosophus propter id senatusconsultum Nicopolim Roma decessit"); 19.1.14 ("librum … Epicteti philosophi quintum dialexeon, quas ab Arriano digestas"); 17.19.1–6 (Favorinus and the two words); Rolfe's Gellius 1.2 (Herodes at his villa near Athens, "the first volume of the Discourses of Epictetus, arranged by Arrian", the note "Actually the second book, II.19.", Rolfe's Homer line). Photius codex 58 (Freese, quoted exactly). Arrian from Nicomedia, consul, historian of Alexander (Wikipedia; Suda A 3868). LSJ entries for ἐγχειρίδιος, προαίρεσις, ἀναγκοτροφέω ("eat by regimen, not after one's own appetite, like athletes") and ἀναγκοφαγέω (= ἀναγκοτροφέω). Translators' "will" (Long), "moral purpose" (Oldfather) and "volition" (SEP). "Heartfelt and satirical by turns" (SEP).
- **Works and transmission.** Arrian made the *Handbook*, "somewhat more than half" from the four books; Simplicius' commentary "more than ten times the bulk" (Oldfather vol. 2). Fifty-three chapters (Wikipedia). *Handbook* 29 = *Discourses* 3.15, omitted in *Par.* and not discussed by Simplicius, "may have been added in some second edition, whether by Arrian or not" (Oldfather, *Ench.* 29 n.). Upton's restorations and the manuscripts' readings (Oldfather's notes, exact). Stobaeus 21 against 4 passages; Schenkl's numbering standard (Boter). "Some twenty manuscripts", Bodl. Auct. T. 4. 13 copied about 1100, the source of the rest, shown by the stain on fol. 25 (Boter); Misc. Graec. 251, s. xi/xii, the archetype, "must have survived the Middle Ages in only a single exemplar" (Oldfather); Lindsay p. 43 (quotation exact, "omit either the illegible words alone or the whole passage"). Arethas and the scholia (Boter). More than a hundred *Handbook* manuscripts, the tenth-century Christian ones, the fourteenth- and fifteenth-century chief witnesses (Boter). The three Christian adaptations: Paul and Solomon, Job 1:21, the Gospels for Plato (Boter p. 6). Oldfather's notes on 1.18.10 (Mowat, Schenkl, Capps "for a lacuna of about five letters in S") and his English, quoted exactly. Fragments "not very numerous" and the gnomology "purporting to contain excerpts from Democritus, Isocrates, and Epictetus" (Oldfather vol. 2, exact).
- **Print and editions.** Perotti 1450, Poliziano 1479, printed 1497 and the first printed *Handbook*; Simplicius, Venice 1528, as lemmata; Haloander, Nuremberg 1529; Trincavelli, Venice 1535, "valueless for the purposes of textual criticism"; Upton 1739–41; Schweighäuser 1798 and 1799–1800, "the standard for the next century"; Carter, London 1758; Schenkl 1894 and 1916, the first text based on the Bodleian manuscript and still standard; Boter 1999 (Boter, Oldfather, Wikipedia). Ellis and *Encheiridion* 5a; Tom Wolfe's *A Man in Full* (Boter, SEP). The editions list: Schenkl 1916 and the Teubner headers; Long 1877 (Wikipedia) with the Scroll's 1887 printing (scan); Higginson 1865 and the Nelson 1890 printing (TEI header, Internet Archive); Oldfather "First printed 1925" / "1928" (reprint versos) and the Heinemann first issues; Boter, Brill 1999; Dobbin, Clarendon 1998; Hard, OUP 2014; Waterfield, Chicago 2022 (SEP bibliography, Wikipedia).

## Note outside the article

In the Scroll's Lucian *Demonax* (`tlg0062.tlg008`), Harmon's English sits one section off around §§54–56.
`npx tsx scripts/passage.ts tlg0062.tlg008 54 56` puts the Rufinus joke under Greek 55 and the Epictetus anecdote
(Greek 55) under 56. This does not affect the Epictetus article, which does not cite *Demonax*, but the reader will show the
wrong English beside those sections.
