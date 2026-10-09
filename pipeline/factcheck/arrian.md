# Fact-check: Arrian (`web/src/wiki/authors/tlg0074.ts`)

Checked 2026-10-09 by an independent checker who did not write the article.

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts` and read against each sentence that points to it. (This includes the
passages linked in the text but not listed as sources: Voyage 25.1 and Anabasis 1.28.7.) Every `url` source was read:
- Wikipedia's *Arrian*, *Anabasis of Alexander*, *Indica (Arrian)* and *List of editiones principes in Greek*, as wikitext.
- Livius, and Cassius Dio 69 on LacusCurtius.
- Photius (Freese) on the Tertullian Project.
- Stadter's GRBS article (text layer) and Stadter's *Catalogus* article. The *Catalogus* is a scan with no text, so its pages were rendered as images and read one by one.
- The Düsseldorf school essay (its text layer), and the BMCR review in the Internet Archive.
- Chinnock (Gutenberg 46976).
- Robson's Loeb vol. 1. This is the Internet Archive OCR of the 1967 reprint.
- The Cambridge Core record of the *Classical Review*, the Patras library record and Bibliothekai.
- LSJ in the site's own copy (`web/public/data/lsj`).

Edition dates were compared with the TEI headers in `pipeline/.cache/corpus`. The Scroll's listing of the two pseudo-Arrian works
was checked in `web/public/data/catalog.json`. The researcher's log (`pipeline/drafts/checked/tlg0074.md`) was read but not relied on.

Totals: **6 findings**, all small: none high, three medium, three low. All the "our translation" renderings match the Greek. Every
quotation from Harmon, Long, Chinnock, Freese, Cary, Stadter, Bosworth and Lendering is exact. No wrong dates, shelfmarks or
first-edition years were found. The findings are:
- a slip about the Greek of the *Indica*;
- one overstated claim about the anonymous *Voyage around the Black Sea*;
- a sentence about Bowie that pits him against a claim Stadter did not make;
- a footnote that does not support "fullest";
- a timeline line that overstates how far Gronovius used his Florentine manuscript;
- a quotation said to be where the text "starts again", when it starts one word earlier.

---

### 1. The *Indica*'s first sentence, not only its second, is already in Ionic
- **Claim:** "Its second sentence already has the Ionic endings of «τοῖσι πολλοῖσιν Ἰνδοῖσιν», “most Indians”, and it says ὅκως, the Ionic form of ὅπως, “how”.[^29,30,19]"
- **Problem:** "Its second sentence already" implies the first sentence is not yet Ionic. But the very first sentence (1.1) is full of Ionic forms:
  - ἑσπέρην (Attic ἑσπέραν);
  - ἔθνεα (Attic ἔθνη);
  - ἐποικέουσιν (Attic ἐποικοῦσιν).

  Also, "it says ὅκως" reads as if the second sentence had ὅκως. It does not. The word comes at 19.8 (source 30).
- **Evidence:** `npx tsx scripts/passage.ts tlg0074.tlg002 1.1 1.3`:
  - 1.1: «τὰ ἔξω τοῦ Ἰνδοῦ ποταμοῦ τὰ πρὸς ἑσπέρην ἔστε ἐπὶ ποταμὸν Κωφῆνα Ἀστακηνοὶ καὶ Ἀσσακηνοί, ἔθνεα Ἰνδικά, ἐποικέουσιν.»
  - 1.2: «… οὐδὲ μέλανες ὡσαύτως τοῖσι πολλοῖσιν Ἰνδοῖσιν.»
  - `… tlg0074.tlg002 19.8`: «ὅκως μὲν δὴ κατὰ τοὺς ποταμοὺς …».
- **Suggested fix:** "Its very first sentence has Ionic forms such as «ἔθνεα» for ἔθνη, “peoples”, and the second has the Ionic endings of «τοῖσι πολλοῖσιν Ἰνδοῖσιν», “most Indians”; later it says ὅκως, the Ionic form of ὅπως, “how”.[^29,30,19]"
- **Confidence:** high

### 2. The anonymous *Voyage around the Black Sea* was not "long taken for Arrian's", says the source
- **Claim:** "The *Voyage around the Erythraean Sea*, an important source of geographical information, was long taken for Arrian's because it stands beside his Black Sea voyage in the Heidelberg manuscript; so was an anonymous *Voyage around the Black Sea*, a later and much poorer work that borrows from his.[^3]"
- **Problem:** Stadter (source 3) does say that the *Erythraean Sea* voyage "was generally regarded as Arrian's in the Renaissance". He says nothing like that about the anonymous Black Sea voyage. Instead he says it was known only in fragments until quite late, and was not usually printed with Arrian's works. "So was" therefore claims more than the source says. Stadter says only that both works "were attributed to him because they are associated with his *Periplus* in the one medieval manuscript".
- **Evidence:** Stadter, *Catalogus* 3, p. 2 (the scan, page image): "Two short works that cannot have been written by Arrian were attributed to him because they are associated with his *Periplus* in the one medieval manuscript in which they are preserved. The *Periplus maris Erythraei*, an important source of geographical information, was generally regarded as Arrian's in the Renaissance. A late and much inferior work, an anonymous *Periplus Ponti Euxini*, having the same name as Arrian's work and dependent upon it, was known until quite late only in fragments, and was not usually printed with Arrian's works. It is missing from the miscellaneous volume which contains the *editio princeps* of the Greek text of Arrian's *Periplus* (Basel, Froben, 1533) as well as from the collected works edited by Blancardus".
- **Suggested fix:** "The *Voyage around the Erythraean Sea*, an important source of geographical information, was generally taken for Arrian's in the Renaissance, because it stands beside his Black Sea voyage in the Heidelberg manuscript; an anonymous *Voyage around the Black Sea*, a later and much poorer work that borrows from his, came to bear his name the same way. Neither is his.[^3]"
- **Confidence:** high

### 3. Bowie is said to answer a claim that Stadter did not make, and the point rests on a Wikipedia footnote alone
- **Claim:** "{debated} Was Xenophon one of his real names? Stadter argued in 1967 that it was, and that his full name was Flavius Arrianus Xenophon.[^4] E. L. Bowie replied in 1970 that the inscriptions rule this out as his official name.[^1]"
- **Problem:** The only support for the Bowie sentence is a footnote on Wikipedia (source 1). That footnote says Stadter's "suggestion that his *official* name was Lucius Flavius Arrianus Xenophon … is disproven by epigraphic evidence". Bowie's article (*Past & Present* 46, 1970, p. 25 n. 72) was not opened, and no other source was found that reports what he says.
  The article's own source 4 shows that Stadter did not argue for an "official" name. He said the opposite: the inscriptions use only his Roman name, and Xenophon was a Greek name that Arrian used beside it.
  So "rule this out as his official name" answers a claim the article never puts to Stadter. It also makes the two scholars look more opposed than the sources show.
- **Evidence:**
  - Stadter, GRBS 8 (1967) 159, source 4: "What is noteworthy about Arrian is that he regularly used his Latin name rather than his Greek one … Quite suitably only his Roman name appears on the official records and inscriptions which mention him."
  - Wikipedia, *Arrian*, footnote to the name: "Stadter's suggestion that his official name was Lucius Flavius Arrianus Xenophon … is disproven by epigraphic evidence: Bowie, E. L. … Past & Present, 46 (1970): 25 n. 72."
  - A search found no open copy of Bowie's footnote.
- **Suggested fix:** "{debated} Was Xenophon one of his real names? Stadter argued in 1967 that it was, a Greek name used beside his Roman one, so that his full name was Flavius Arrianus Xenophon; he granted that the inscriptions name him only by his Roman name.[^4] Others, starting with E. L. Bowie in 1970, have held that the inscriptions tell against it.[^1]"
- **Confidence:** medium (the Stadter half is certain; what Bowie says could not be read)

### 4. "The fullest account" is not what the three cited sources say
- **Claim:** "… and wrote the fullest account of Alexander the Great that has come down to us.[^1,2,3]"
- **Problem:** None of the three cited sources says "fullest":
  - Wikipedia's *Arrian* (source 1) calls the *Anabasis* "the best source on the campaigns of Alexander the Great".
  - Livius (source 2) calls it "our most important source on the reign of Alexander".
  - Stadter (source 3) calls it "His great work".

  The word comes from Wikipedia's *Anabasis of Alexander* (source 18), which the article cites for the same claim later. That page puts it more narrowly: "the fullest surviving account of Alexander's conquest of the Persian Empire" ("our most complete account of Alexander's campaigns"). That is not the same as the fullest account of Alexander in general.
- **Evidence:** wikitext of https://en.wikipedia.org/wiki/Anabasis_of_Alexander: "The *Anabasis* is by far the fullest surviving account of Alexander's conquest of the Persian Empire" and "Arrian's Anabasis is our most complete account of Alexander's campaigns". https://www.livius.org/sources/content/arrian/: "our most important source on the reign of Alexander".
- **Suggested fix:** "… and wrote the fullest account of Alexander the Great's campaigns that has come down to us.[^1,2,3,18]"
- **Confidence:** medium

### 5. Timeline: Gronovius did not base his text on the Florentine manuscript; he filled gaps from it and put its readings below the text
- **Claim:** (timeline, 1704) "Jacob Gronovius' edition, from a Florentine manuscript he thought the best"
- **Problem:** The cited source (31) says Gronovius found the Florentine manuscript and used it to fill all the gaps of the earlier editions but one. Otherwise, it says, he oddly kept the old printed text, and put the manuscript's often better readings below the text as variants. "Edition, from a Florentine manuscript" suggests that his text followed that manuscript. The transmission paragraph ("The Florentine manuscript that Jacob Gronovius had found and prized as the best, for his edition of 1704") is fine.
- **Evidence:** Düsseldorf essay (source 31), p. 7: "einem andern Holländer Jakob Gronov war es vorbehalten in Florenz eine Handschrift zu entdecken (Laurentianus IX, 32) welche die zahlreichen Lücken -- bis auf eine -- aufs glücklichste ergänzte … Wunderbarerweise behielt er aber sonst den Text der bisherigen Überlieferung bei, ohne die oft unstreitig besseren und richtigeren Lesarten der neu entdeckten Handschriften … aufzunehmen, die er als Varianten unter den Text setzte."
- **Suggested fix:** "Jacob Gronovius' edition fills the gaps of the earlier printed text from a Florentine manuscript he thought the best"
- **Confidence:** medium

### 6. After the lost leaf the text starts again one word earlier than the quotation shows
- **Claim:** "In Book 7 the text breaks off in mid-sentence, in a passage about Antipater, «οὐχ ὡσαύτως εἶναι αὐτῷ πρὸς θυμοῦ Ἀντίπατρον», and starts again in another story, «τούτῳ τῷ λόγῳ ὑποπτήξαντα Ἡφαιστίωνα συναλλαγῆναι Εὐμενεῖ, οὐχ ἑκόντα ἑκόντι» …"
- **Problem:** In the Scroll's text the first words after the dots are «Ἡφαιστίων.», the end of a lost sentence. «τούτῳ τῷ λόγῳ …» comes after that. So the quoted words are not where the text "starts again". The translation is right.
- **Evidence:** `npx tsx scripts/passage.ts tlg0074.tlg001 7.12.7 7.13.1`: «… οὐχ ὡσαύτως εἶναι αὐτῷ πρὸς θυμοῦ Ἀντίπατρον ... ... Ἡφαιστίων. τούτῳ τῷ λόγῳ ὑποπτήξαντα Ἡφαιστίωνα συναλλαγῆναι Εὐμενεῖ, οὐχ ἑκόντα ἑκόντι.»
- **Suggested fix:** "… and starts again near the end of another story, «… Ἡφαιστίων. τούτῳ τῷ λόγῳ ὑποπτήξαντα Ἡφαιστίωνα συναλλαγῆναι Εὐμενεῖ, οὐχ ἑκόντα ἑκόντι»: “… Hephaestion. That Hephaestion, cowed by this speech, made it up with Eumenes, unwilling with willing” (our translation)." (Or keep the quotation and say "and soon after the gap we read".)
- **Confidence:** low (a precision point, not a falsehood)

---

## Verified and found correct

- **Life**
  - Nicomedia / İzmit, Roman citizenship back several generations, priesthood of Demeter and Kore "perhaps already as a young man" (Livius; Wikipedia, quoting Haase–Temporini; Stadter 1967; Photius cod. 93).
  - Birth "a few years before AD 90" by most accounts. Stadter (*Catalogus*) gives "ca. A.D. 95–175". Stadter 1967 has the archonship "in 146"; Livius has an office "in 145/146".
  - Epictetus at Nicopolis.
  - Consul "ca. 129" (Stadter) and "129 or 130" (Livius).
  - Legate of Cappadocia "A.D. 131–137" with two legions.
  - The Periplus as a letter to Hadrian "ca. 131".
  - Settling at Athens after 137, citizen, civic offices; "archon and prytanis" (Stadter 1967).
- **Quotations from outside sources**
  - Lucian, *Alexander* 2: Harmon's English is quoted exactly.
  - Cassius Dio 69.15.1 (Cary, the epitome): the quotation is exact; Albania, Media, Armenia, Cappadocia; Vologaesus' gifts.
  - Stadter's "repelled the Alan invasion of 134".
  - Stadter's translations of the Periplus greeting and of *Battle Order* 10: exact.
- **The *Tactics***: 44.3, Hadrian's twentieth year; dated 137 with its first page lost (Stadter); 136/137 and the vicennalia (Wikipedia, Livius).
- **Xenophon**
  - Photius cod. 58: "young Xenophon", "His style is dry, and he is a genuine imitator of Xenophon", Discourses in eight books, Conversations in twelve.
  - Suda α 3868: «ὁ ἐπικληθεὶϲ νέοϲ Ξενοφῶν».
  - *On Hunting* 1.4 and 5.6; *Battle Order* 10 and 22; Voyage 12.5 and 25.1.
  - The Heidelberg title changed to "of Xenophon the Athenian, the second" (Stadter 1967).
- **Works**
  - Six extant works of his own; Discourses eight books, four preserved; Encheiridion.
  - History of the Successors 10, Bithynica 8, Parthica 17 books (Photius codd. 58, 92, 93); "at least one papyrus".
  - Alanike and three short lives "ascribed".
  - Two Voyages not his. Both are listed in the Scroll under "Pseudo-Arrianus" as "anonymous; said to be by Arrian" (catalog.json, tlg0071 and tlg0075).
- **The *Anabasis***
  - From 336 to 323; "fullest surviving account of … conquest of the Persian Empire"; title and seven books after Xenophon; Thebes 335.
  - LSJ ἀνάβασις "expedition up from the coast"; ὅκως "Ion. for ὅπως".
  - Preface 1.pr.1–3 and Chinnock's English: exact.
  - 1.9.10 (Chinnock exact); 4.7.4 (Chinnock exact, "barbaric[535] custom"); 1.12.1–5 (ὡς λόγος = "the story went"; Stadter's and Chinnock's renderings exact); 7.30.3 (Chinnock exact).
  - The critical view since the 1970s through Bosworth (Wikipedia).
  - The Book 4 digression out of order, and Bosworth's "sermon on the evils of intemperance" (BMCR 1997.04.07).
  - Lendering's sentence is quoted exactly.
- **Letter to Lucius Gellius** (Roos's text and the Discourses copy): Long's "whatever I heard him say …" is exact.
- **The *Indica***: in Ionic after Herodotus, Megasthenes, Nearchus (Wikipedia; Photius cod. 91: "written in the Ionic dialect"; Livius). 19.8 «ἐν τῇ ἄλλῃ τῇ Ἀττικῇ συγγραφῇ».
- **Every "our translation"**: the statue, the namesake, Xenophon the elder, Hormê, "my other, Attic, history", Hephaestion and Eumenes, καὶ τῇ ὀλιγότητι, "about five hundred", ζῶντες δὲ ὀλίγοι ἐλήφθησαν, the Heidelberg title. All are accurate.
- **Transmission** (Stadter, *Catalogus* pp. 2–3)
  - Dexippus, Stephanus, Photius, the Constantinian Excerpts and the Suda, Eustathius, Tzetzes, Zonaras.
  - Vindob. hist. gr. 4 (s. XII ex.–XIII in.); apographs 1 / 5 / 25.
  - Pal. gr. 398 (s. IX) and Laur. 55,4 (s. X).
  - Aurispa 1421; four Latin translations 1433–1508; Vergerio for Sigismund, probably 1433–37.
  - Gelenius, Basel 1533; Trincavelli, Venice, Zanetti, September 1535; Holstenius, Paris 1644; Scheffer, Uppsala 1664.
  - Roos 1907 and 1928; Wirth 1967–68; Jacoby FGrHist 156.
  - The same first editions appear in Wikipedia's list of editiones principes.
- **Düsseldorf essay**
  - Roos, *Prolegomena*, Groningen 1904 ("im vorigen Jahre").
  - The leaf lost at 7.12.7 in the archetype as the main proof.
  - The corrector's "großer Willkür".
  - The Florentine copied from the reworked Vienna book, yet keeping the opening of the *Anabasis*.
  - Venice 1535 with six books and the *Indica* as seventh; Basel 1539 with seven.
  - One family joining Books 6 and 7.
- **Robson's notes**: 1.9.5 "Editors add καὶ τῇ ὀλιγότητι. Roos marks lacuna."; 1.28.7 "After πεντακοσίους Krüger and Roos mark a lacuna, supplying ζῶντες δὲ ὀλίγοι ἐλήφθησαν (R.)". The article's careful "the Loeb note gives" is right.
- **Editions**
  - TEI headers: Roos 1907 (Anabasis); Roos vol. 2 dated 1910 (letter to Gellius, so the editor's note about 1928 is justified); Hercher–Eberhard 1885 (the other five works).
  - Classical Review 45.2 (1931): Roos vol. 2 (Teubner, 1928) and Robson vol. 1 (Heinemann / Macmillan, 1929).
  - Brunt, Loeb 236 and 269, 1976–83, vol. 2 with the *Indica* (Patras record; Bibliothekai).
  - Bosworth vol. 1 1980 (Books 1–3), vol. 2 1995 (Books 4–5).
  - Chinnock, Hodder and Stoughton, 1884 (Gutenberg title page).
  - Landmark Arrian, Pantheon 2010.
  - Hammond / Atkinson, Oxford World's Classics, 2013.
- **Timeline**: every other year and label agrees with the sources above.

**Could not verify:** Bowie's footnote (*Past & Present* 46, 1970, p. 25 n. 72): see finding 3.

**Findings: 6** (by importance: 1–3 medium, 4–6 low; the confidence of each is given under it).
