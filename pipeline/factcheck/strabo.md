# Fact-check: Strabo (`web/src/wiki/authors/tlg0099.ts`)

Checked 2026-10-09, independently of the researcher (whose log, `pipeline/drafts/checked/tlg0099.md`, was read but not relied on).

Method. Every `cite` source was read in its passage.ts output (Greek and English) against each sentence that points to it.
The Bohn English of Books 1–5 and 15–17, which passage.ts does not print, was read in the Perseus file
`tlg0099.tlg001.perseus-eng4.xml`. Every `url` source was opened and read in full:
- Wikipedia *Strabo* and *Geographica* (raw wikitext);
- Jones's Loeb introduction on LacusCurtius;
- Jones's vol. 1 on the Internet Archive (title page, preface, bibliography);
- Diller and Kristeller, *CTC* 2 (all nine scanned pages, pp. 225–233);
- Stronk's CJ-Online review;
- the five strabo.ca pages (history, when, papyri, editions, translations);
- the Vatican palimpsest page;
- the BnF record for Grec 1397;
- the LSJ entries (στράβων, στραβός) in the site's copy, `pipeline/.cache/lsj`.

Edition details were compared with the TEI headers in `pipeline/.cache/corpus`. All the footnote numbers were checked
against the 39-item `sources` list, and none point at the wrong source.

Totals: **7 findings.** All the quotations match their sources word for word, and both "our translation" renderings
(1.1.1 and 11.9.3) and the *Chrestomathy* line are faithful to the Greek. The findings:
- one statement taken from the 1917 Loeb that the article's own newer source contradicts (the "lost" manuscripts behind the Latin translation);
- one English rendering of Athenaeus that misreads the Greek and so overstates the "variant";
- one opinion (Bussi's "I think") stated as fact;
- one division of labour that leaves out half of what Guarino did;
- three smaller points: an attribution that Plutarch's translator marks only "probably", an anachronistic "Augustus", and "ordinary" for a rare word.

---

### 1. The Latin translation's Greek manuscripts are not "since lost": the article's own source 3 names them, and they survive
- **Claim:** "The Greek text of 1516 was set from a poor manuscript, while the Latin translation printed decades earlier had been made from better manuscripts, since lost.[^6]"
- **Problem:** This follows the 1917 Loeb bibliography (source 6). The article's later and more specialised source, Diller and Kristeller (1971, source 3), contradicts it. They identify the copies the translators used: Ciriaco d'Ancona's two-volume Strabo, now the Eton codex (Books I–X, used by Guarino) and the Moscow codex (Books XI–XVII). Both carry notes in Guarino's hand, so they survive. Guarino also collated a papal copy, which Diller and Kristeller identify as Vat. gr. 174. Whether these copies are "better" than the Aldine's Par. gr. 1395 is Jones's judgement only; Diller and Kristeller do not say so.
- **Evidence:** Jones, vol. 1 (1917), Internet Archive `geographyofstrab00stra_djvu.txt`, "Early translations": "The translation was made from better manuscripts than that used in the Aldine edition, but these have since perished." Diller and Kristeller, *CTC* 2, p. 226 (http://catalogustranslationum.org/PDFs/volume02/v02_strabo.pdf): "the translators worked from Ciriaco's copy in two volumes, Guarino from the first (books I-X) and Gregorio from the second (books XI-XVII) … Books I-X were translated from the Eton codex of Strabo, which is the first volume of Ciriaco's copy. Books XI-XVII were translated from the Moscow codex of Strabo. Both codices have annotations in Guarino's hand. In collation Guarino cites an *exemplar pontificis* also, which is doubtless the Vatican codex graecus 174". On p. 225, of the copies brought to Italy (Aurispa, Filelfo, Bessarion, Isidore, Ciriaco), Diller and Kristeller add: "all of which are preserved".
- **Suggested fix:** "The Greek text of 1516 was set from a poor manuscript.[^6] The Latin translation printed decades earlier had been made from other copies, which still survive: Ciriaco of Ancona's two volumes, now at Eton and Moscow, with notes in Guarino's own hand.[^3]"
- **Confidence:** high

### 2. Athenaeus does not put Pompelo "in the province of Aquitania": the Greek says "near Aquitania"
- **Claim:** "Athenaeus quotes Strabo on hams: «ἐν Σπανίᾳ πρὸς τῇ Ἀκυτανίᾳ πόλις Πομπέλων», “In Spain, in the province of Aquitania, is the city Pompelo”, where, he says, fine hams are cured.[^31]"
- **Problem:** The English is Yonge's (the Scroll's), and it mistranslates the Greek. πρὸς τῇ Ἀκυτανίᾳ means "near (towards) Aquitania", not "in the province of Aquitania". The sentence sits in a paragraph headed "A quotation that does not match", so the reader is led to think Athenaeus moved Pompelo into Gaul. He did not. "In Spain, near Aquitania" agrees with Strabo's own text, which puts Pompelo among the Vascons on the road "to the very boundaries of Aquitania and Iberia". The real mismatch, the hams moved from the Cerretanians to Pompelo, stands.
- **Evidence:** `npx tsx scripts/passage.ts tlg0008.tlg001 14.75`, Greek: «ἐν Σπανίᾳ πρὸς τῇ Ἀκυτανίᾳ πόλις Πομπέλων, ὡς ἂν εἴποι τις Πομπηιόπολις, ἐν ᾗ πέρναι διάφοροι συντίθενται ταῖς Κανταβρικαῖς ἐνάμιλλοι»; English (Yonge): "In Spain, in the province of Aquitania, is the city Pompelo". `npx tsx scripts/passage.ts tlg0099.tlg001 3.4.10`: «…ἐπὶ τοὺς ἐσχάτους ἐπὶ τῷ ὠκεανῷ Ὀυάσκωνας τοὺς κατὰ Πομπέλωνα … πρὸς αὐτὰ τὰ τῆς Ἀκυιτανίας ὅρια καὶ τῆς Ἰβηρίας … τὸ τῶν Ὀυασκώνων ἔθνος, ἐν ᾧ πόλις Πομπέλων».
- **Suggested fix:** "…«ἐν Σπανίᾳ πρὸς τῇ Ἀκυτανίᾳ πόλις Πομπέλων», “in Spain, near Aquitania, is the city of Pompelo” (our translation), where, he says, fine hams are cured.[^31]" Also add the new rendering to `outsideQuotes` if the checker requires it.
- **Confidence:** high

### 3. "The translators' Greek had gaps of its own" is Bussi's guess, and he said it of Guarino's part only
- **Claim:** "The translators' Greek had gaps of its own. Giovanni Andrea Bussi, who revised the Latin for the printed edition, says that much was missing from Guarino's Europe…[^3]"
- **Problem:** Bussi reports that much was missing from Guarino's *Europe* (Books 1–10). He explains it "as I think" (*ut puto*) by the fragmentary state of Guarino's Greek copies. The article states that explanation as fact, and widens it to both translators. Nothing in source 3 says Gregorio's Greek had gaps.
- **Evidence:** Diller and Kristeller, *CTC* 2, p. 229, Bussi's preface to Paul II: «Guarini autem Europa perlecta, quod in ea multa deerant fragmentis ut puto Graecorum illius exemplarium, amicorum ope addi omnia procuravi» ("Having read through Guarino's Europe, since much was missing from it, owing, I think, to the gaps in his Greek copies, I had everything added with the help of friends").
- **Suggested fix:** "Bussi, who revised the Latin for the printed edition, found much missing from Guarino's Europe, which he put down, he says, to gaps in Guarino's Greek copies, and he had it filled in with friends' help; one manuscript of the translation was supplemented and revised with the help of another Greek manuscript by Bussi and others.[^3]"
- **Confidence:** high

### 4. Guarino translated the whole *Geography*, not just Books 1–10
- **Claim:** "Pope Nicholas V (1447–55) commissioned a Latin translation: Guarino of Verona translated Books 1–10 and Gregorio Tifernate Books 11–17, and their version was printed at Rome by Sweynheym and Pannartz about 1469.[^3]" (And in the timeline: "Guarino of Verona finishes his Latin translation at Ferrara", 1458.)
- **Problem:** The commission was divided that way, but source 3 says Guarino went on to translate Books 11–17 as well, "in competition with Gregorio". The translation he finished at Ferrara on 13 July 1458 is the complete one. Only the 1469 print combined Guarino's 1–10 with Gregorio's 11–17. As written, the paragraph says Guarino translated only Books 1–10, and the timeline entry for 1458 then reads as if it marked the end of that half.
- **Evidence:** Diller and Kristeller, *CTC* 2, p. 226: "Moreover Guarino continued to the end and translated books XI-XVII in competition with Gregorio … The colophon of Guarino's holograph is dated in Ferrara 13 July 1458". p. 228–229 (Editions): "(1469), Rome: Sweynheym and Pannartz. Books I-X by Guarino, without prefaces, and books XI-XVII by Gregorio, revised by Giovanni Andrea Bussi. Guarino's translation of books XI-XVII was never printed."
- **Suggested fix:** "Pope Nicholas V (1447–55) commissioned a Latin translation and divided the work: Guarino of Verona took Books 1–10 and Gregorio Tifernate Books 11–17. Guarino went on to translate the rest as well, finishing at Ferrara in 1458, but the version printed at Rome by Sweynheym and Pannartz about 1469 joined Guarino's Books 1–10 to Gregorio's 11–17.[^3]" Timeline: "Guarino of Verona finishes his Latin translation of the whole work at Ferrara".
- **Confidence:** high

### 5. Plutarch does not say the Caesar omens come from the *History*; his translator says "probably"
- **Claim:** "The history is lost, but other writers used it: Plutarch cites “Strabo, another philosopher, in his Historical Commentaries”,[^23] and from Strabo he takes some of the omens before Caesar's murder: “multitudes of men all on fire were seen rushing up”.[^24]"
- **Problem:** At *Lucullus* 28.7 Plutarch names the *Historical Commentaries*, but at *Caesar* 63.2 he says only "Strabo the philosopher". The sentence presents the omens as one of the uses of the lost history. That is the usual view, but the Scroll's own translation marks it "probably", and the article drops that word.
- **Evidence:** `npx tsx scripts/passage.ts tlg0007.tlg048 63.2`: «Στράβων δὲ ὁ φιλόσοφος ἱστορεῖ…», with no title. In the Perseus file `tlg0007.tlg048.perseus-eng2.xml`, Perrin's note at this point reads: "Probably in the Historical Commentaries cited in the Lucullus, xxviii. 7."
- **Suggested fix:** "…and from Strabo, probably from the same work, he takes some of the omens before Caesar's murder: …[^24]"
- **Confidence:** medium

### 6. In 29 BC the man at Corinth was not yet "Augustus"
- **Claim:** "he took on board a fisherman who was going to Augustus at Corinth to ask for a lower tribute" (also the timeline: "a fisherman is setting out to ask Augustus for a lower tribute", 29 BC)
- **Problem:** Strabo calls him simply "Caesar", and so do both English versions. Octavian received the name Augustus only in January 27 BC, two years later. The Loeb introduction (source 2) uses "Augustus" loosely, but as a dated statement it is anachronistic.
- **Evidence:** `npx tsx scripts/passage.ts tlg0099.tlg001 10.5.3`: «πρεσβευτὴν ἐνθένδε ὡς Καίσαρα … (ἦν δʼ ἐν Κορίνθῳ Καῖσαρ βαδίζων ἐπὶ τὸν θρίαμβον τὸν Ἀκτιακόν)»; Jones: "to Caesar as ambassador (Caesar was at Corinth, on his way to celebrate the Triumph after the victory at Actium)".
- **Suggested fix:** "…who was going to Octavian, the future Augustus, at Corinth to ask for a lower tribute". In the timeline: "…to ask Octavian (the future Augustus) for a lower tribute".
- **Confidence:** medium (a common loose usage, but the article dates the event exactly)

### 7. Στράβων is not shown to be an "ordinary" Greek word
- **Claim:** "Στράβων is an ordinary Greek word, which the great Greek dictionary of Liddell, Scott and Jones explains as the same as στραβός, “squinting”…[^10,5]"
- **Problem:** LSJ cites στράβων from a single anonymous comic fragment, and neither cited source calls it ordinary or common. The LSJ part of the claim (στράβων = στραβός, "squinting") is correct.
- **Evidence:** Site copy of LSJ, `pipeline/.cache/lsj/lsj21.xml`: «στρᾰ́β-ων, ωνος, ὁ, = στραβός, Com.Adesp. 334»; «στρᾰβ-ός, ή, όν, squinting, Sor. 1.31, Gal. 19.141». Stronk (source 5) says only that we are not "absolutely sure whether 'Strabo' was his actual name".
- **Suggested fix:** "Στράβων is also a Greek word: the great Greek dictionary of Liddell, Scott and Jones explains it as the same as στραβός, “squinting”, and a modern reviewer remarks…[^10,5]"
- **Confidence:** medium

---

## Verified and correct

- **Life (sources 1, 2, 3, 5).** All of these match their sources:
  - born 64 or 63 BC at Amaseia (Amasya), probably died about AD 24;
  - Rome in 44 BC at nineteen or twenty, with later visits;
  - Gyaros in 29 BC, and the 150 and 100 drachmas (Jones's English exactly);
  - Egypt with Aelius Gallus in 25–24 BC, as far as Syene;
  - the probable use of the Alexandrian library, and the book "filled" with excerpts;
  - "it cannot be said that he was a great traveller", the main Italian roads, and no place in Greece shown but Corinth;
  - Pais (first version about 7 BC, revised about AD 18, written at Amaseia) against Niese (Rome, AD 18–19);
  - unnoticed by the Romans, even Pliny, but known in the East.
- **Family (10.4.10, 12.3.33).** These match the Greek:
  - Dorylaus, his mother's great-grandfather (πρόπαππος τῆς μητρὸς ἡμῶν) and a friend of Euergetes, who stayed on at Cnossus;
  - the younger Dorylaus, Eupator's foster-brother, caught trying to hand the kingdom to Rome;
  - the fifteen garrisons, "great promises…", and Pompey and the Senate;
  - «ὁ πάππος ἡμῶν ὁ πρὸς αὐτῆς» rightly read as maternal, with Jones's English "my maternal grandfather";
  - the Loeb introduction and Wikipedia do say "paternal", so the {debated} note is accurate.
- **Teachers and philosophy.** These match the Greek and the cited English:
  - Aristodemus at Nysa, aged, teaching rhetoric in the morning and grammar in the evening (14.1.48);
  - Tyrannion (12.3.16);
  - Xenarchus at Alexandria, Athens and finally Rome (14.5.4);
  - συνεφιλοσοφήσαμεν τὰ Ἀριστοτέλεια with Boethus (16.2.24);
  - Ζήνων ὁ ἡμέτερος, "Our Zeno" (1.2.34);
  - the Bohn wording at 2.3.8.
- **Quotations from the Bohn English, checked in `perseus-eng4.xml`.** All are word for word:
  - 2.5.11 ("in a westerly direction…", "To pretend that those only can know…");
  - 2.5.12 ("as far as Syene and the frontiers of Ethiopia");
  - 17.1.46 ("I heard a noise at the first hour…");
  - 1.1.2 ("Homer as the founder of geographical science");
  - 1.1.22–23 ("both to political and moral philosophy", "high stations of life", "Its proportions, so to speak, are colossal");
  - 3.4.11 ("fully equal to those of the Cantabrians");
  - 7.7.12 ("Cineas relates what is still more fabulous");
  - 17.3.7 ("Juba died lately, and was succeeded by his son Ptolemy").
- **Jones's English, word for word:** 12.3.39 (both quotations) and 10.5.3.
- **"Our translation" and the Chrestomathy:**
  - 11.9.3: «ἐν τῇ ἕκτῃ … βίβλῳ, δευτέρᾳ δὲ τῶν μετὰ Πολύβιον» = "in the sixth book of the Historical Sketches, the second of those after Polybius". This is accurate, and better than Jones's English, which splits it into two works.
  - 1.1.1: "geography too, if any subject is, we count the business of the philosopher". Accurate.
  - *Chrestomathy* 1.1: «Ὅτι Ὅμηρος πρῶτος ἐτόλμησε γεωγραφῆσαι» = "That Homer was the first who dared to write geography". Accurate.
- **Other ancient witnesses.** Plutarch, *Lucullus* 28.7 (Perrin's wording) and *Caesar* 63.2 (Perrin's wording). Josephus, *AJ* 14.104 «Στράβων ὁ Καππάδοξ», with further quotations at 14.111, 114 and 118. Athenaeus 14.75: the third book, «ἀνὴρ οὐ πάνυ νεώτερος» ("not a very modern author"), and the seventh book's acquaintance with Posidonius.
- **The Geography.** These are all correct:
  - the book-by-book contents (Wikipedia, *Geographica*, including Posidonius in Book 2);
  - the topics in Stronk (Alexander, cults, the eastern Mediterranean, women's history), and "primary source for the history of Greek scholarship on geography";
  - Juba's death in AD 23 as the latest datable event;
  - Pothecary's AD 17–23 and Dueck's AD 18–24;
  - Diller's "little attention before the sixth century", "often cited by Byzantine authors" from the ninth, and the Latin print about 1469.
- **Transmission (sources 4, 6, 32, 33, 34, 36).** These are all correct:
  - one archetype, and the gap at the end of Book 7 in all manuscripts;
  - Paris 1397 for Books 1–9, "it contains no more", mutilated at the end;
  - Vatican 1329, Venice 640 and the Epitome for Books 10–17;
  - the Epitome made from a copy with the end of Book 7, dated end of the tenth century (Jones) or fourteenth century (Pothecary);
  - Paris gr. 1393, thirteenth century, whole text;
  - Grec 1397: tenth century in Wikipedia's table (citing Radt), eleventh in the BnF record ("XI siècle … fine mutili");
  - the fifth-century palimpsest written over twice, in Vat. gr. 2061A, Vat. gr. 2306 and Crypt. A.δ.XXIII;
  - the papyri P. Oxy. 4459 (Book 2), P. Oxy. 3447 (Book 9) and P. Köln 8 (end of Book 7), of the second and third centuries;
  - P. Vogliano 46 (Milan) assigned to the History with a question mark;
  - about thirty manuscripts;
  - the Chrestomathy anonymous, probably ninth century, in the contemporary Pal. gr. 398.
- **Editions.** These are all correct:
  - Nicholas V (1447–55);
  - Guarino's holograph dated Ferrara 1458;
  - Sweynheym and Pannartz (1469);
  - Bussi's revision, and Vat. lat. 2049 supplemented "with the aid of another Greek manuscript by Giov. Andr. Bussi and others";
  - Heresbach (Basel 1523), "particularly bad, worse than Gregorio's";
  - the Aldine, Venice, November 1516, from Par. 1395;
  - Casaubon (Geneva 1587; Paris 1620, after his death), with pages C 1–840;
  - Kramer (Berlin 1844–52), Meineke (Teubner 1852–53, reprinted, based on Kramer with a list of changes), and the 1877 printing in the TEI header;
  - Müller, *GGM* II (Paris 1861; TEI header of tlg004);
  - Jones (London: Heinemann; New York: Putnam, 1917; "based in part upon the unfinished version of J. R. S. Sterrett"; his own Greek text, based on Meineke);
  - Hamilton and Falconer (Bohn 1854–57, from Kramer's text, all seventeen books in the Scroll, "the first English translation of the full work");
  - Radt (Göttingen 2002–11; vol. 2 for the end of Book 7; vol. 9 for the Epitome and Chrestomathy; "the edition to be used");
  - the Budé (Aujac, Lasserre, Baladié, Laudenbach; Books 1–12 and 17 by 2015);
  - Roller (2014; *Guide* 2018).
- **LSJ.** στράβων = στραβός; στραβός "squinting".

No source failed to open. Not checked further: the exact Jacoby fragment number for *Caesar* 63, which Perrin's own note covers.
