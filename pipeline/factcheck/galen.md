# Fact-check: Galen (web/src/wiki/authors/tlg0057.ts)

Checked 2026-10-07 by an independent checker (not the article's author).

Method. Every `cite` source (16 passages) was opened with `npx tsx scripts/passage.ts <work> <ref>` from `web/` and read against each
sentence that points to it. Every `url` source (13) was fetched in full. Wikipedia was read as raw wikitext (`action=raw`). The other
pages were downloaded and read as text: the Stanford Encyclopedia, Pearcy, both BMCR reviews, the archived BIU Santé and CMG pages,
Roger Pearse, LSJ on Perseus, and the Cambridge record of Rabin's review. All 13 opened. The Scroll's catalogue (`web/public/data/catalog.json`)
and the TEI files in `pipeline/.cache/corpus/first1k/data/tlg0057` were used to check the claims about the Scroll. The researcher's log
(`pipeline/drafts/checked/tlg0057.md`) was read but not relied on.

Totals: **7 findings**. One is a real factual slip: the Corpus Medicorum Graecorum did not begin in 1914. 1914 is when its first
*Galen* volume came out. The others are smaller. One dropped qualification. One footnote cites a source that does not give the figure.
One claim ("the whole survives in Arabic") is not in either cited source. One translation renders a word that is not inside the quoted
Greek. One sentence ("the year of the great epidemic") squeezes a 15-year epidemic into one year. One "known only from" leaves out other
witnesses that the cited review names. No misquotations of the Greek were found. Every Greek quotation matches the Scroll's text letter for
letter, Brock's English is quoted exactly, and the BMCR and Pearse quotations are exact.

---

### 1. The Corpus Medicorum Graecorum did not begin in 1914: 1914 is its first Galen volume
- **Claim:** timeline, `{ year: 1914, kind: "print", what: "The Corpus Medicorum Graecorum begins its critical editions", src: [1] }`. Also in
  Print: "Since 1914 the Corpus Medicorum Graecorum has been publishing critical editions work by work". Also in the editions note to De Lacy:
  "of the Corpus Medicorum Graecorum (1914–)".
- **Problem:** The CMG's own history page says work on the series began in 1907. Its first volume, Wellmann's Philumenus (CMG X 1,1), came out
  in 1908. The SEP's "1914–" appears in the SEP's *Galen* bibliography, so it dates the CMG's Galen volumes. The SEP's own example is
  Mewaldt's *In Hippocratis De natura hominis*, CMG V 9.1, 1914. So the timeline entry is wrong as it stands, and the two other sentences
  suggest the series itself started in 1914.
- **Evidence:** SEP, bibliography: "Corpus Medicorum Graecorum, various editors, Leipzig: Teubner, and Berlin: Akademie Verlag, 1914– "
  and "Commentary on Hippocrates' "Nature of the Human Being" (In Hippocratis De natura hominis), ed. J. Mewaldt, CMG V 9.1, 1914."
  https://cmg.bbaw.de/en/homepage/about-us/history-of-cmg/: "…paved the way for work on the Corpus Medicorum Graecorum (CMG) to begin in 1907."
  Philumenus, *De venenatis animalibus*, ed. M. Wellmann, CMG X 1,1, Leipzig and Berlin: Teubner, 1908 (Wikipedia, Philumenus; DAI Zenon
  catalogue record 000173170).
- **Suggested fix:** timeline: "The Corpus Medicorum Graecorum publishes its first critical edition of Galen". Print: "Since 1914 the Corpus
  Medicorum Graecorum has been publishing critical editions of Galen work by work, and the French Budé series has its own under way.[^1,10]"
  De Lacy note: "One of the critical editions, with English translation, of the Corpus Medicorum Graecorum (Galen volumes since 1914)."
- **Confidence:** high

### 2. The Antonine Plague was not an event of one year
- **Claim:** "It was the year of the great epidemic now called the Antonine Plague, or the Plague of Galen.[^8]" Also the timeline entry
  "Slips away from Rome to Pergamum, in the year of the Antonine Plague".
- **Problem:** Source 8 dates the epidemic 165–180. It says the plague reached Rome in 166 and that Galen went home in 166 "during the
  epidemic". "The year of the great epidemic" makes it sound like a single year's outbreak.
- **Evidence:** https://en.wikipedia.org/wiki/Antonine_Plague (raw): "The Antonine Plague of AD 165 to 180 … also known as the Plague of Galen";
  "From the east the plague spread westward reaching Rome in 166"; "In 166, during the epidemic, the Greek physician and writer Galen
  traveled from Rome to his home in Asia Minor".
- **Suggested fix:** "That year the great epidemic now called the Antonine Plague, or the Plague of Galen, reached Rome.[^8]" Timeline:
  "Slips away from Rome to Pergamum, the year the Antonine Plague reached Rome".
- **Confidence:** medium

### 3. *On My Own Opinions* was not known "only" from the two Latin versions
- **Claim:** "The rest of the work was known only from a medieval Latin version of an Arabic translation and from Niccolò da Reggio's
  version from the Greek, until Vlatadon 14 gave the whole Greek text.[^10]"
- **Problem:** The review that this sentence cites lists other witnesses too. "A few fragments in the original Greek" had been identified,
  of which the Ambrosianus chapters were only "the longest". It also mentions Arabic witnesses "of lesser importance". So "only" is not what
  the source says.
- **Evidence:** https://bmcr.brynmawr.edu/2025/2025.09.52/: "Until its discovery it was known from a Latin translation based on an Arabic
  intermediary and a Graeco-Latin version by Niccolò da Reggio (active 1308-1345). In addition, a few fragments in the original Greek had
  been identified as such, the longest of which, in … Ambrosianus gr. 659, presents the final three chapters … To these witnesses a few
  others of lesser importance from Arabic sources can be added."
- **Suggested fix:** "The rest of the work was known mainly from a medieval Latin version of an Arabic translation and from Niccolò da
  Reggio's version from the Greek, with a few shorter Greek and Arabic fragments, until Vlatadon 14 gave the whole Greek text.[^10]"
- **Confidence:** high

### 4. "The whole survives in Arabic" is not in either cited source
- **Claim:** "*On Medical Experience* is one: the whole survives in Arabic, first edited by Richard Walzer in 1944,[^14,24]"
- **Problem:** Neither source says the Arabic version is complete. The CMG list (source 14) gives only "De experientia medica (frg. gr.,
  arab.)", with "Walzer (1944)". Source 24 is only the bibliographic record of Rabin's review. It shows the book's title, "Galen on Medical
  Experience. First edition of the Arabic version with English translation and notes", and has no abstract. The claim may well be true,
  but no listed source supports "the whole".
- **Evidence:** archived CMG Gesamtübersicht (source 14): "De experientia medica (frg. gr., arab.) Περὶ τῆς ἰατρικῆς ἐμπειρίας – – – – Walzer
  (1944) Walzer / Frede (1985) (en)". Cambridge Core record (source 24): title only, "An abstract is not available for this content".
- **Suggested fix:** "*On Medical Experience* is one: it survives in Arabic, first edited by Richard Walzer in 1944,[^14,24] while the
  Scroll has only a Greek fragment …". Alternatively, add a source that states the Arabic text is complete.
- **Confidence:** medium (it is the support that is missing, not necessarily the fact)

### 5. Source 2 gives no word count, and source 13 says "over" 2.6 million
- **Claim:** "what survives has been put at anything from 2.6 to more than 4 million words.[^13,2,1]"
- **Problem:** The Wikipedia *Galen* page (source 2) gives no word count. The only "million" in its text is about plague deaths. Source 13
  says "over 2.6 million", so 2.6 million is a lower bound, not an estimate. The SEP (source 1) gives "more than 4 million".
- **Evidence:** https://en.wikipedia.org/wiki/Galenic_corpus (raw): "His surviving work runs to over 2.6 million words". SEP: "a total of
  more than 4 million words". https://en.wikipedia.org/wiki/Galen (raw): no word count; its nearest statement is "the surviving texts
  represent nearly half of all the extant literature from ancient Greece".
- **Suggested fix:** "and what survives has been put at over 2.6 million words, or at more than 4 million.[^13,1]"
- **Confidence:** high

### 6. The SEP hedges Galen's service under Commodus and Severus with "apparently"
- **Claim:** "He went on to serve Commodus and Septimius Severus.[^1]"
- **Problem:** The only cited source says this with a qualification that the article drops. Wikipedia (source 2) states it plainly, so the
  fix is simply to cite both sources.
- **Evidence:** SEP: "Galen's court career apparently continued through the reigns of Marcus' successors, Commodus (180–92) and Septimius
  Severus (193–211)". Wikipedia, Galen: "Galen was the physician to Commodus for much of the emperor's life …"; "Galen was also physician
  to Septimius Severus during his reign in Rome."
- **Suggested fix:** "He went on to serve Commodus and Septimius Severus.[^1,2]"
- **Confidence:** medium

### 7. The translation of the dream line renders a word that is not inside the quoted Greek
- **Claim:** "Galen puts it in one line: «τοῦ πατρὸς ὀνείρασιν ἐναργέσι προτραπέντος ἐπὶ τὴν τῆς ἰατρικῆς ἄσκησιν ἀφικόμεθα», “then, my father being
  urged on by vivid dreams, I came to the practice of medicine” (our translation).[^5]"
- **Problem:** "Then" translates εἶθ' ὕστερον ("then, later"), which comes just before the quoted Greek and is left out of it. The English is
  therefore slightly longer than the Greek it stands beside.
- **Evidence:** `npx tsx scripts/passage.ts tlg0057.tlg066 9.4`: «… φιλοσοφίας ἐρασθέντες ἐπ' ἐκείνην ἥξαμεν πρῶτον. εἶθ' ὕστερον τοῦ πατρὸς ὀνείρασιν
  ἐναργέσι προτραπέντος ἐπὶ τὴν τῆς ἰατρικῆς ἄσκησιν ἀφικόμεθα …»
- **Suggested fix:** «εἶθ' ὕστερον τοῦ πατρὸς ὀνείρασιν ἐναργέσι προτραπέντος ἐπὶ τὴν τῆς ἰατρικῆς ἄσκησιν ἀφικόμεθα», “then later, my father being urged on
  by vivid dreams, I came to the practice of medicine” (our translation). Update the `outsideQuotes` entry to match. Alternatively, keep
  the Greek as it is and drop "then".
- **Confidence:** high (minor)

---

## Verified and found correct

- **Life (sources 1, 2, 4):** Born 129 at Pergamum, a "culturally Greek city … near the northwest coast of Roman Asia", the son of an
  architect (SEP, Pearcy). The plan of philosophy or politics, and Asclepius in a dream in 144 or 145 (Pearcy). Father's death in 148 or
  149, Galen 19, rich and independent, then Smyrna, Corinth and Alexandria (Pearcy; SEP says 149). The gladiators in 157 (Pearcy, SEP).
  Rome in the early 160s (SEP; Wikipedia says 162), with lectures and demonstrations. Fear of exile or poisoning (Wikipedia). Aquileia in
  168 (Pearcy). Left in Rome 169–76, writing up major works (SEP). Fire given as 191 by Pearcy and 192 by the SEP and BMCR. Death: the Suda
  at 70 (about 199), Arabic sources at 87 (about 216), Nutton and Boudon-Millot for 216 (Wikipedia). The SEP's traditional "around 200"
  with later sources "more than ten years after this".
- **Galen's own words (sources 5, 6, 7, 9, 11):** *Method of Healing* 9.4: philosophy first, then medicine after his father's dreams.
  *Comp. Med. Gen.* 3.2: home from Alexandria aged 28; the high priest entrusted the gladiators to him alone; "beginning my twenty-ninth
  year" is right for τοῦ ἐνάτου καὶ εἰκοστοῦ ἔτους ἠρχόμην; many deaths in earlier years and none of his; the second high priest, then the third,
  fourth and fifth, which is "four more". *On Prognosis* 9: pretending to leave for Campania, then Brundisium and the crossing; the summons
  to the winter quarters at Aquileia; Lucius' death in midwinter; Marcus persuaded to leave him in Rome; Commodus under Peitholaus;
  πολλὰς πραγματείας ἔγραψα φιλοσόφους τε καὶ ἰατρικὰς. *On Prognosis* 11: τῶν μὲν ἰατρῶν πρῶτον εἶναι, τῶν δὲ φιλοσόφων μόνον. *Comp. Med. Gen.* 1.1: the
  storehouse on the Sacred Way, the precinct of Peace and the Palatine libraries; the quotation is exact.
- **Reading Galen (sources 17, 18, 19, 20, 21, 22):** *On the Powers of Foods* 2.9.12: clear teaching rather than old Attic. *In Hipp.
  Off.* 3.33: the plaster names and οὐ γὰρ ἀττικίζειν διδάσκειν πρόκειταί μοι …. *Opt. Med.* 1: the athletes and ἐπαινοῦσι μὲν γὰρ Ἱπποκράτην …. *Nat. Fac.*
  1.13: Asclepiades and the kidneys, the "itch" sentence in Greek and in Brock's English, and the tied ureters, all exact. *Nat. Fac.*
  3.15: "nothing is done by Nature in vain", the septum perforations and "extreme terminations", all exact, and the argument is indeed
  driven by the "nothing in vain" principle. The lexicon of medical words in Old Comedy lost in the fire (BMCR 2015).
- **The name:** γαληνός "calm" (Wikipedia). LSJ: "calm, esp. of the sea"; "of persons, gentle".
- **Medicine and legacy (source 2):** Four humours and four temperaments. The three systems. Human dissection forbidden, Barbary apes,
  pigs. Vesalius and the impermeable septum. More than 1,300 years. Not translated into Latin in antiquity. All Greek manuscripts
  Byzantine. Syrian Christians after 750. Hunayn's 129 works (c. 830–870). Only-Arabic and only-Latin works. al-Razi's *Doubts*. Latin
  from the Arabic from the 11th century. "Medical Pope of the Middle Ages". Burgundio from the Greek. Niccolò da Reggio at Robert of
  Naples' court, the most important Latin translator (BMCR 2025: active 1308–1345). Bonardo's Latin edition of 1490. Vesalius 1543.
  Harvey and others. Bloodletting into the 19th century. *On Theriac, to Piso*: events of 204, "may be spurious", Nutton thinks it
  genuine. Hunayn 808–873; Greek into Syriac, Hubaysh from Syriac into Arabic (Wikipedia, Hunayn ibn Ishaq).
- **The corpus (sources 1, 12, 13, 14):** More than 25 ethical works with two surviving whole; logic nearly all lost (SEP). The eighth of
  Greek literature, the Greek tradition rarely before the 12th century, *Subfiguratio empirica* only in Latin, the Aldine of 1525 in five
  folio volumes, Basel 1538, Chartier "(Paris, 1679)" and the editor's ruin, Kühn without critical apparatus "except one" and the
  edition one cites (Boudon). Volume counts of 20, 21 plus an index, and 22 (SEP, Boudon, Galenic corpus). 122 treatises, over 20,000
  pages, mainly from Chartier (Galenic corpus). *Anatomical Procedures* "X–XV nur arab." (CMG). The Scroll's text ends at 9.5, the last
  chapter in the TEI file. [Introductio sive medicus], [Definitiones medicae] and [De theriaca ad Pisonem] in square brackets, with
  Boudon-Millot's CUF Gal. VI (CMG). The bookshop story and Singer's translation are exact, and so is the account of why *On My Own
  Books* was written (Pearse, quoting Singer 1997).
- **Vlatadon 14 and *Avoiding Distress* (sources 10, 19):** Found in 2005 by Pietrobelli, sent by Boudon-Millot. Table of contents. *Avoiding
  Distress* a little later and before known only by its title. The full *On My Own Books*, otherwise only in Ambrosianus gr. 659 apart from
  the Arabic. Scribal errors, moisture, the microfilm. The letter to an old friend from Pergamum. Library, drugs and medical equipment lost
  in 192. About forty textual problems, mostly in *Indol.* The misnamed fragment in Kühn IV (BMCR 2025). Written 1448–1453 from a
  Constantinople library by followers of Argyropoulos. The ἀλυπίας / ἀλυπησίας dispute and Kotzia. The three English titles. The Antium
  reading (Jones 2009) at 16, 17 and 18 of the Budé, with Nicholls rejecting it. "Almost certainly written shortly after Commodus' death".
  The Commodus quotation, exact (BMCR 2015).
- **Editions:** Kühn 20 vols, 1821–33, reprinted Hildesheim 1964–65. Brock's Loeb, London and Cambridge, Mass., 1916. De Lacy, CMG V
  4.1.2, 1978–84, 2nd edn 2005. Singer 1997, with *On My Own Books* and *The Best Doctor* in English. Singer 2013 with Nutton's *Avoiding
  Distress*. Johnston and Horsley, 3 vols, Loeb 2011. Boudon-Millot and Jouanna with Pietrobelli, CUF Galien IV, 2010, and Boudon's
  first Greek text of 2007 (both BMCRs). Polemis and Xenophontos, Trends in Classics suppl. 151, De Gruyter 2023, made with direct access
  to the manuscript.
- **The Scroll:** The catalogue lists 97 works under Galen and 6 under Pseudo-Galen. Most of the Greek is from Kühn. The later editors are
  Marquardt 1879, Müller 1879, Helmreich 1893–1923, Kaibel 1894, Kalbfleisch 1896–98, Schöne 1901 and Raeder 1928, so 1879–1928 is
  right. Volumes 17.1, 17.2–18.1 and 18.2 are named for the Hippocrates commentaries. Only *On the Natural Faculties* has English (Brock
  1916). The *On Medical Experience* fragment is Schöne, Berlin 1901. *Introduction, or the Physician* is under Pseudo-Galen (tlg0530.tlg012).
  *On Theriac, to Piso* is under Galen (tlg0057.tlg079). The Kühn vol. 4 fragment carries the title "Fragment on the Substance of the
  Natural Faculties".
- **Source labels:** The SEP author and dates (P. N. Singer, 2016, revised 2021), the BMCR reviewers (Tieleman, Kaufman) and the Classical
  Review 59.2 (1945) record are all correct.

Note, not a finding: Chartier's edition actually came out over several decades (about 1639–1679), and Chartier died before it was
finished. The article's "(1679, in Boudon's account)" reports its source accurately, so it is left as it is.
