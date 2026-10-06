# Fact-check: Lysias (`web/src/wiki/authors/tlg0540.ts`)

Checked 2026-10-06, by a checker who did not write the article.

Method. Every `cite` source was opened with `scripts/passage.ts` and read against each sentence that points to it. This included
Dionysius, *On Lysias* 30, the section after the one cited for the Olympic speech. Every `url` source was fetched and read:
- Jebb's EB1911 article, as the wikitext of the three Wikisource page scans 197–199;
- Wikipedia *Lysias* and *Dionysius of Halicarnassus*, as wikitext;
- both BMCR reviews;
- Lamb's Loeb on the Internet Archive: the OCR text of the whole volume, including the preface, the bibliography, the general introduction and the introductions to speeches 1, 2, 6, 12, 17, 25 and 33;
- Kremmydas's *CR* review (Royal Holloway PDF);
- Sosower's GRBS article (the full PDF);
- the Pinakes PDF notice of Pal. gr. 88;
- Quintilian 10.1.78 on LacusCurtius.

The four LSJ entries were read in the site's copy (`pipeline/.cache/lsj`), and the Perseus TEI header of `tlg0540.tlg012` was read in
`pipeline/.cache/corpus`. Outside sources consulted:
- Grenfell and Hunt's own edition of P. Oxy. 1606, in *The Oxyrhynchus Papyri* XIII (Internet Archive `oxyrhynchuspapyrunse_76`);
- E. Medda, *ZPE* 129 (2000) 21–28;
- library records for Lamb's 1930 first printing and for Hude's OCT;
- Wikipedia, *Nephon I of Constantinople*.

The researcher's log (`pipeline/drafts/checked/tlg0540.md`) was read but not relied on.

Totals: **11 findings**: 1 high-confidence, 5 medium, 5 low. Every quotation from the Scroll's own texts matches its passage
word for word, and the article's own translations of Dionysius are accurate. The real slips are these:
- **Against Hippotherses:** Lysias does not "call himself" the wealthiest metic. The speech was delivered by a supporting speaker, who says it *of* Lysias, in the third person.
- **The Olympic Oration:** the date 388 is disputed, and the article's own source 6 (Lamb) says so. The researcher's note that only Wikipedia gives 384 is wrong.
- **Patriarch Niphon:** his dates are 1310–1314, not 1311–1315.
- **Lamb's Loeb:** the 1930 first printing was published by Heinemann (London) and Putnam (New York), not Harvard.
- **"His fortune gone":** the sources say only *probably* that money troubles drove him to speech-writing.

---

### 1. In *Against Hippotherses* Lysias does not "call himself" anything: a supporting speaker describes him

- **Claim:** "Among them is *Against Hippotherses*, a case in which Lysias himself was the defendant, though a supporting speaker delivered the speech. In it he calls himself “the wealthiest resident alien in the times of your prosperity”, and the papyrus adds clauses of the amnesty of 403/2.[^24,6]"
- **Problem:** The two halves of the passage contradict each other. If a supporting speaker delivered the speech (Kremmydas, source 24), then the words are that speaker's description of Lysias, not Lysias' description of himself. The papyrus speaks of Lysias in the third person throughout and ends by asking the jury to acquit "Lysias". The phrase "he describes himself" comes from Lamb's 1930 paraphrase (source 6). Lamb wrote before the supporting-speaker reading became standard.
- **Evidence:**
  - Kremmydas, *CR* 57.2 (2007) 303 (source 24): "Lysias himself was the defendant in the case and his speech was delivered by a supporting speaker".
  - Grenfell and Hunt, *P. Oxy.* XIII (1919), no. 1606, their translation of the passage: "For while you were prosperous Lysias was the richest of the metoeci; but when disaster came he stayed on … I entreat you therefore, gentlemen of the jury, to acquit Lysias" (Internet Archive `oxyrhynchuspapyrunse_76`, djvu text). The Greek ends «ἀποψηφίσασθαι Λυσίου».
  - Lamb, General Introduction p. xviii (source 6): "He describes himself as “the wealthiest resident alien in the times of your prosperity …”".
- **Suggested fix:** "In it the speaker calls Lysias “the wealthiest resident alien in the times of your prosperity”, and the papyrus adds clauses of the amnesty of 403/2.[^24,6]" Keep the quotation in `outsideQuotes`: it is Lamb's English.
- **Confidence:** high

### 2. The date 388 for the *Olympic Oration* is disputed, and the article's own source says so

- **Claim:** "At the Olympic festival of 388 he called on the Greeks to unite against Dionysius, the tyrant of Syracuse.[^8,7]" Also the timeline: `{ year: -388, kind: "writing", what: "The *Olympic Oration*, against Dionysius of Syracuse", src: [8, 6] }`.
- **Problem:** The date is stated as certain, with no {debated} label. Lamb (source 6, cited on the timeline entry) gives 388 as Diodorus' date and says it "has been disputed by Grote, Freeman and other authorities", who put the speech in 384. Lamb himself prefers 388, but he reports the disagreement. Wikipedia (source 1) dates it "388 or 384 BC". The comment at the top of the article file says the 384 date was left out because "only Wikipedia's table gives it; Jebb and Lamb give 388". That is not correct for Lamb.
- **Evidence:** Lamb, introduction to Speech XXXIII, pp. 680–683 (Internet Archive `lysiaslamb00lysiuoft`): "The date given by Diodorus Siculus, 388 B.C., has been disputed by Grote, Freeman and other authorities … It has been proposed, therefore, to place the speech in 384 B.C. … But in 6 we have a probable reference to the Corinthian War as still proceeding, which strengthens the presumption that the date given by Diodorus (388) is correct." Wikipedia, *Lysias*, table of speeches, no. 33: "388 or 384 BC".
- **Suggested fix:** "At the Olympic festival of 388, the date given by the historian Diodorus, he called on the Greeks to unite against Dionysius, the tyrant of Syracuse.[^8,7] {debated} Some historians have preferred 384, but Lamb thought the speech itself points to 388.[^6,1]" On the timeline, add `certainty: "debated"` to the -388 entry and add source 1 to its `src`.
- **Confidence:** medium-high

### 3. Patriarch Niphon held office 1310–1314, not 1311–1315

- **Claim:** "A fourteenth-century note in it, dated by the patriarch Niphon (1311–1315), places it in a monk's cell at Nicaea." Also the timeline: `{ year: 1313, approx: true, … "A note in X, dated by the patriarch Niphon (1311–1315) …" }`.
- **Problem:** The dates are copied from Sosower's footnote (source 25), but they are a year off. Niphon (Nephon) I was Patriarch of Constantinople from May 1310 to April 1314. The article's own source 26, the Pinakes notice, lists in its bibliography a study of this note whose title gives the right dates.
- **Evidence:**
  - Sosower, GRBS 23 (1982) 378 n. 5: "it is dated by the patriarch Niphon (1311-1315)".
  - Pinakes notice, bibliography (source 26): "D. Agoritsas, « Ὁ οἰκουμενικὸς πατριάρχης Νίφων Α΄ (1310-1314) », Ἐπετηρὶς Ἑταιρείας Βυζαντινῶν Σπουδῶν 53 … 238 (et n. 2)".
  - Wikipedia, *Nephon I of Constantinople*: "term 9 May 1310 – 11 April 1314".
- **Suggested fix:** "… dated by the patriarch Niphon (1310–1314) …" in both places, with source 26 added to the footnote: `[^25,26]`, and `src: [25, 26]` on the timeline. The timeline year 1313 (approx) can stay, or change to 1312.
- **Confidence:** medium-high

### 4. Lamb's Loeb of 1930 was not published by Harvard University Press

- **Claim:** Editions: "W. R. M. Lamb, *Lysias* (Loeb Classical Library; London, Heinemann, and Cambridge, Mass., Harvard University Press, 1930).[^6,27]" Source 27's label gives the same imprint.
- **Problem:** The first printing of 1930 was published in London by Heinemann and in New York by G. P. Putnam's Sons. Harvard University Press became the Loeb's American publisher only in the 1930s, and its name is on the later reprints. The scan that source 6 links is one of those reprints: its title page reads "Cambridge, Massachusetts, Harvard University Press; London, William Heinemann Ltd, MCMLXVII. First printed 1930. Reprinted 1948, 1957, 1960, 1967". The Perseus header does read "Cambridge, MA: Harvard University Press; London: William Heinemann Ltd. … 1930", so source 27's label describes the header correctly. As a citation of the 1930 edition, though, it is wrong.
- **Evidence:**
  - Internet Archive metadata for `lysiaslamb00lysiuoft`: "London, W. Heinemann ltd.; New York, G. P. Putnam's sons", date 1930.
  - Library records for the first printing (e.g. Kyushu University): "London: W. Heinemann; New York: G. P. Putnam's Sons, 1930", Loeb Classical Library 244.
  - Title page of the scan (lamb.txt): "MCMLXVII. First printed 1930".
  - `pipeline/.cache/corpus/perseus/data/tlg0540/tlg012/tlg0540.tlg012.perseus-grc2.xml`: London, Heinemann; Cambridge, MA, Harvard University Press; 1930.
- **Suggested fix:** "W. R. M. Lamb, *Lysias* (Loeb Classical Library; London, Heinemann, and New York, Putnam, 1930; reprinted by Harvard University Press).[^6,27]" Source 27's label can keep quoting the Perseus header, since that is what it describes.
- **Confidence:** medium

### 5. "His fortune gone" states as fact what the sources give only as probable

- **Claim:** "His fortune gone, Lysias turned to writing speeches for clients to deliver in court.[^8,2]"
- **Problem:** Both cited sources are hedged. Jebb calls him "now *probably* a comparatively poor man". The BMCR review reports Todd's reason only as a suggestion: financial need "*may* have been" part of it, along with Lysias' discovery of his own skill. The same review calls him "this wealthy metic" in 403. Lamb (source 6) adds that he "probably had some property outside Attica". The papyrus *Against Hippotherses* shows him trying to recover property after 403. So the article turns a likely explanation into a fact.
- **Evidence:**
  - Jebb, EB1911 vol. 17 p. 182: "During his later years Lysias—now probably a comparatively poor man owing to the rapacity of the tyrants and his own generosity to the Athenian exiles—appears as a hardworking member of a new profession".
  - BMCR 2008.11.05: "Why did this wealthy metic turn to writing speeches in 403? Todd reasonably suggests that this may have been due to a combination of financial need after the Thirty plundered his family's fortune and his “realisation of capability”".
- **Suggested fix:** "Much of his fortune had been seized, and probably for that reason, among others, Lysias turned to writing speeches for clients to deliver in court.[^8,2]"
- **Confidence:** medium

### 6. Dionysius' "best standard of the Attic tongue" loses its qualification, and "the purest Attic prose of all" overstates him

- **Claim:** "And this outsider's Greek became, for the ancient critics, the purest Attic prose of all.[^4]" Also: "He calls his language pure, «τῆς Ἀττικῆς γλώττης ἄριστος κανών», “the best standard of the Attic tongue” (our translation)."
- **Problem:** Dionysius limits his praise in the very same sentence. Lysias is the best standard not of the old Attic used by Plato and Thucydides, but of the Attic of his own day. Dionysius also says only that no *later* writer surpassed Lysias in purity, with Isocrates next after him. That is not a claim that his prose was the purest "of all". The article gives the praise without its limit. It also makes one critic's view the view of "the ancient critics" in general.
- **Evidence:** `npx tsx scripts/passage.ts tlg0081.tlg003 1 3`, section 2: «καθαρός ἐστι τὴν ἑρμηνείαν πάνυ καὶ τῆς Ἀττικῆς γλώττης ἄριστος κανών, οὐ τῆς ἀρχαίας, ᾗ κέχρηται Πλάτων τε καὶ Θουκυδίδης, ἀλλὰ τῆς κατʼ ἐκεῖνον τὸν χρόνον ἐπιχωριαζούσης … οὐθεὶς τῶν μεταγενεστέρων αὐτὸν ὑπερεβάλετο … καθαρώτατος γὰρ δὴ τῶν ἄλλων μετὰ Λυσίαν … Ἰσοκράτης».
- **Suggested fix:** Summary: "And this outsider's Greek became, for the critic Dionysius, the purest Attic prose of its day.[^4]" Style section: "He calls his language pure, «τῆς Ἀττικῆς γλώττης ἄριστος κανών», “the best standard of the Attic tongue” (our translation): not the older Attic of Plato and Thucydides, but the Attic spoken in his own time. No later writer, he says, surpassed him in purity.[^4]"
- **Confidence:** medium

### 7. "Today … 127 more" is Jebb's count of 1911, and the article's own modern figure is 145

- **Claim:** "Today 34 speeches survive whole or in part, and 127 more are known from fragments or titles.[^8] Modern editions print 34 or 35, and the fragments in Carey's Oxford edition give evidence of another 145 speeches.[^2]"
- **Problem:** The 127 is Jebb's 1911 figure, which goes back to Sauppe's collection of the fragments (1839–50). The next sentence gives the current figure from Carey's 2007 edition, 145. Calling the old figure "Today's" makes the two sentences contradict each other.
- **Evidence:** Jebb, EB1911 p. 183: "Thirty-four speeches (three fragmentary) have come down … one hundred and twenty-seven more, now lost, are known from smaller fragments or from titles"; p. 183 F: "Three hundred and fifty-five of these are collected by Sauppe … Two hundred and fifty-two of them represent one hundred and twenty-seven speeches of known title". BMCR 2008.11.05: "the fragments in Carey's new OCT provide evidence from another 145 speeches".
- **Suggested fix:** "In 1911 Jebb counted 34 surviving speeches, whole or in part, and 127 more known from fragments or titles.[^8] Modern editions print 34 or 35, and the fragments in Carey's Oxford edition give evidence of another 145 speeches.[^2]"
- **Confidence:** medium-low

### 8. The opening of the *Olympic Oration* is quoted in *On Lysias* 30, not 29

- **Claim:** "The opening of that speech survives because Dionysius of Halicarnassus quoted it: Lysias deplores a Greece “with many parts of her held subject by the foreigner, and many of her cities ravaged by despots”.[^15,16]" The transmission section repeats this with "[^6,16]". Source 16 is labelled "Dionysius of Halicarnassus, On Lysias 29".
- **Problem:** Section 29 only introduces the speech and ends "he begins his speech like this:". The quoted text itself is in section 30, which the footnote does not cover. Lamb, the article's source 6, cites "De Lysia, 29-30".
- **Evidence:** `npx tsx scripts/passage.ts tlg0081.tlg003 29` ends «ταύτην λαβὼν τὴν ὑπόθεσιν τοιαύτην πεποίηται τὴν ἀρχὴν τοῦ λόγου·». `npx tsx scripts/passage.ts tlg0081.tlg003 30` begins «ἄλλων τε πολλῶν καὶ καλῶν ἔργων ἕνεκα, ὦ ἄνδρες, ἄξιον Ἡρακλέους μεμνῆσθαι …», which is Lys. 33.1–3. Lamb p. 680 n.: "De Lysia, 29-30".
- **Suggested fix:** Change source 16 to `cite: { work: "tlg0081.tlg003", ref: "29", to: "30" }`, labelled "Dionysius of Halicarnassus, On Lysias 29–30, in the Scroll (Greek only): the Olympic speech and its opening".
- **Confidence:** medium-low

### 9. The *Republic* does not open at Polemarchus' house

- **Claim:** "Plato set the *Republic* in their home. It opens at the house of Polemarchus, and Socrates says: “there we found Lysias and Euthydemus, the brothers of Polemarchus”; old Cephalus was at home too.[^9]"
- **Problem:** The dialogue opens on the road from the Piraeus festival, where Polemarchus' slave stops Socrates (327a–328b). Only after that do they go to the house. The cited passage itself says "So we went with them to Polemarchus's house". The conversation is *set* in the house, but the dialogue does not *open* there.
- **Evidence:** `npx tsx scripts/passage.ts tlg0059.tlg030 1.328`: "It looks as if we should have to stay, said Glaucon … So we went with them to Polemarchus’s house, and there we found Lysias and Euthydemus …"
- **Suggested fix:** "Plato set the *Republic* in their home. Socrates goes back with Polemarchus to his house, and says: “there we found Lysias and Euthydemus, the brothers of Polemarchus”; old Cephalus was at home too.[^9]"
- **Confidence:** low (a small inaccuracy of description)

### 10. Lamb's "probably" dropped from the pamphlet theory of speech 6

- **Claim:** "Lamb wrote in 1930 that it was “now generally agreed” that the writer could not be Lysias, and took it for a pamphlet by one of Andocides' enemies.[^6]"
- **Problem:** Lamb is hedged: the speech is "probably a pamphlet". The article states Lamb's guess as if he were sure of it.
- **Evidence:** Lamb, introduction to Speech VI, p. 111: "This piece, which takes the form of a speech in accusation of Andocides at his trial in 399 B.C., is probably a pamphlet composed by one of his many persecutors".
- **Suggested fix:** "… and thought it probably a pamphlet by one of Andocides' enemies.[^6]"
- **Confidence:** low

### 11. "With all the fragments" goes beyond the sources

- **Claim:** Editions note on Carey's OCT: "The standard Greek text, with all the fragments."
- **Problem:** The sources say only that Carey's edition includes the fragments, "cum Fragmentis", which give evidence of another 145 speeches. No source says the collection is complete, and new papyri keep appearing.
- **Evidence:** BMCR 2008.11.05: "the fragments in Carey's new OCT provide evidence from another 145 speeches". BMCR 2021.07.14, n. 2: "C. Carey, Lysiae Orationes cum Fragmentis, Oxford: 2007".
- **Suggested fix:** "The standard Greek text, with the fragments."
- **Confidence:** low

---

**Checked, no problems found in:**
- **[Plutarch], *Lives of the Ten Orators* 3.1** (tlg0007.tlg121):
  - Cephalus a Syracusan, persuaded by Pericles, a man of great wealth, and the report that he was banished;
  - birth in the archonship of Philocles (459/8);
  - Thurii at fifteen; Teisias and Nicias; "accused of favouring Athens", with 300 others;
  - 2,000 drachmas, 200 shields, 300 mercenaries;
  - Thrasybulus' grant, struck down by Archinus because it "had not been previously voted by the senate"; *isoteles*;
  - 425 speeches, 233 genuine, "lost his case with only two"; the "Defence of Socrates addressed to the judges";
  - "easy, although in fact he is hard to imitate";
  - the speeches for Iphicrates and the treason defence; the Olympic speech against Dionysius.
- **Lysias 12.4–20 and 12.100:**
  - every quotation, word for word: Pericles and "thirty years"; Theognis and Peison; the ten; the talent; the chest's contents; the house with two doors; "three doors"; Archeneos; Megara the next night; Eratosthenes' arrest of Polemarchus in the street; the hemlock without trial; the cloak refused; Melobius and the earrings; 120 slaves; 700 shields;
  - the ending: four verbs and «δικάζετε».
  - The Perseus Greek title «ὃν αὐτὸς εἶπε Λυσίας» supports "Its title in the manuscripts says so".
- **Lysias 1.6–10** ("simple-minded enough to suppose that my own was the chastest wife in the city"). **Lysias 33.1–3** (the quotation).
- **Plato:**
  - *Republic* 1.328 (the quotation);
  - *Phaedrus* 227–228 ("from Lysias … the son of Cephalus"; the speech under the cloak; "the cleverest writer of our day", «δεινότατος ὢν τῶν νῦν γράφειν»);
  - *Phaedrus* 257 (the prayer for Lysias and Polemarchus; "kept calling him a speech-writer", «λογογράφον»);
  - *Phaedrus* 279 ("a nature above the speeches of Lysias").
- **Plutarch, *De garrulitate* 5** (the quotations and the story, rightly marked {legend}). **Diogenes Laertius 2.40–41** (the quotation and the clothes and shoes, rightly marked {legend}).
- **Dionysius, *On Lysias*:**
  - 1–3: born at Athens; Thurii at fifteen; 300 exiles; speeches for courts, Council and Assembly, and showpieces; ordinary words and hardly any figurative language, yet subjects made grand;
  - 8: «καλουμένην δὲ ὑπὸ πολλῶν ἠθοποιΐαν»; «πεποίηται γὰρ αὐτῷ τοῦτο τὸ ἀποίητον», with an accurate translation;
  - 12: «ἄχαρίς ἐστι»; χάρις as the test; the seven years and the twenty years; the guess that Iphicrates wrote both speeches.
- **Jebb, EB1911:**
  - the 459 date reckoned back from Thurii (444); the *Republic* and Plato's knowledge of the family; Tisias;
  - 413; "accused of Atticizing"; Athens in 412; the shield factory and 120 skilled slaves; the Thirty in 404; the back door and Megara;
  - Thrasybulus' proposal and the missing *probouleuma*; speech-writing 403 to about 380; *Against Eratosthenes* (403) his only direct contact with politics;
  - the Socrates story and Polycrates; *For Pherenicus* (381 or 380) and death in or soon after 380;
  - the three styles, with Lysias the model of the plain; 425 works in the Augustan age;
  - the Epitaphios "certainly spurious", about 380–340; speech 9 by an imitator; speech 11 an epitome;
  - the *Phaedrus* erotikos and the "verbally exact" recital; Theozotides in the Hibeh papyri;
  - Sauppe and Palatinus X; Laurentianus C (15th c.); Aldus 1513, Reiske 1772, Bekker 1823.
- **Wikipedia, *Lysias*:** c. 445–c. 380; the ten Attic orators; modern critics put his birth about 445 and Thurii about 430; speech 6 "Generally considered spurious; beginning lost"; Baiter–Sauppe 1839; Gernet–Bizos in two volumes. **Wikipedia, *Dionysius of Halicarnassus*:** he flourished under Augustus and taught rhetoric at Rome.
- **BMCR 2008.11.05:** born "probably … in the mid-440s"; career apparently 403 to about 380; 425 and 233; 34 or 35; 145; the corpus grouped by procedure, with survival perhaps by chance; Dover's collaboration theory and Todd's rejection of it; both sceptical of stylometry; Euphiletus; Lys. 2 accepted as a display piece (a metic unlikely to be chosen); Lys. 5 just under 300 words; Lys. 6 genuine, about 400, perhaps revised; Lys. 9 probably not by Lysias; Lys. 11 an epitome of 10.
- **BMCR 2021.07.14:** Lys. 1 "perhaps the most widely read, at least by students", and a different Eratosthenes; Todd unsure whether a non-citizen could take part in the *euthunai*, with a pamphlet possible; "None of these speeches has previously received a commentary in English on this scale"; Carey's OCT text; Todd's Texas translation (2000); Carey's Cambridge selection (1989), more interested in style.
- **Lamb (Loeb):**
  - the Greek based on Thalheim (Teubner 1901); Gernet and Bizos (1924); Hude (Oxford text) 1912; Baiter and Sauppe 1839;
  - the *Lives* "formerly attributed to Plutarch"; "no serious difficulty" in the ancient birth date (Lamb gives 458–457); 412;
  - the *Phaedrus* speech "More probably a Platonic parody";
  - P. Oxy. XIII (1919);
  - Lys. 2: "much disputed", Aristotle quotes it unnamed, and Dionysius is silent;
  - Lys. 6: "now generally agreed";
  - Lys. 12: "spoken by Lysias himself", "no reason to doubt";
  - the eight lost pages (end of 25, *Against Nicides*, beginning of 26); Hoelscher's title for 17; the Olympic speech preserved by Dionysius; the apparatus credits to Aldus, Markland and others.
- **Kremmydas, *CR* 57.2 (2007):** P. Oxy. XIII 1606, first published by Grenfell and Hunt; "at least six" speeches; the defendant and the supporting speaker; the amnesty clauses of 403/2.
- **Sosower, GRBS 23 (1982):**
  - X twelfth century ("early XII"), the best witness; speeches 1–2 probably also in a rhetorical anthology;
  - other witnesses probably lost in 1204; the Nicaea note and the capital in exile (1204–1261);
  - Strozzi's ownership and Scutariotes' copies;
  - Aristobulus Apostolius writing K for Musurus in Florence, 1492/3; K the main source of the 1513 Aldine; the tradition "stands behind the first printed edition".
- **Pinakes notice:** the Lysias part dated "11 (2/2)"; owners Palla Strozzi, S. Giustina, Scrimger and Ulrich Fugger (bequest of 1584 to Frederick IV, Elector Palatine); Gernet–Bizos vol. 1, 1924. (Medda, *ZPE* 129, 21, also confirms a Gernet–Bizos volume of 1926.)
- **LSJ (site copy):**
  - μέτοικος "settler from abroad, alien resident in a foreign city";
  - ἰσοτελής "of a favoured class of μέτοικοι, subject to the same taxation as the citizens";
  - λογογράφος "professional speech-writer";
  - ἠθοποιία "delineation of character" (citing D.H. Lys. 8).
- **Quintilian 10.1.78 (Butler):** "subtlety and elegance"; "I would compare him to a clear spring rather than to a mighty river".
- **Hude's OCT:** preface dated 1911, published 1912, so 1912 is right.
- **Certainty labels:** {debated} on the birth date, on the delivery of speech 12, on speeches 2 and 6, on Dover, on the *Phaedrus* speech and on the date of X, and {legend} on the Plutarch and Diogenes stories, are appropriate. The timeline's `approx` marks are appropriate.

**Not checked in depth / could not verify:**
- How X travelled from Padua (S. Giustina) to Fugger: Pinakes names Henry Scrimger in between. The article does not go into this, and nothing it says is wrong.
- Whether the second "path" for speeches 1–2 includes Or. 1. Sosower's n. 3 reports Avezzù's doubt. The article's "probably" is close enough to Sosower.
