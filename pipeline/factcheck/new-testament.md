# Fact-check: the New Testament (`web/src/wiki/authors/tlg0031.ts`)

Checked 2026-10-07, by a reader who did not write the article.

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts` from `web/`. That covered Luke 22.20 (and 22.19), Eusebius
*HE* 3.39.15–17, 5.8.2–6 and 3.25.1–7 (Greek and Lake's English), Romans 16.22, Galatians 6.11, Mark 5.41, John 1.1, Mark 1.12,
Luke 1.1–4, Revelation 1.4, Acts 17.28, Aratus *Phaenomena* 1–5, Mark 16.8–16.20a, John 7.52–8.12, 1 John 5.6–8, Revelation 13.18,
Mark 1.1–2, Romans 16.24–27 and 14.23. Each was read against every sentence that points to it. The εὐθύς and ἐπειδήπερ counts were
redone with a script over all 27 Westcott–Hort files in `pipeline/.cache/corpus/perseus/data/tlg0031`, with the TEI headers and notes
stripped. The TEI headers of the Westcott–Hort Mark, the INTF Sinaiticus transcription of Mark 1 (`tlg0031.tlg002.INTF-grc1.xml`) and
the Coptic SCRIPTORIUM Mark 1 were read, as was the INTF XML of Mark 1:1. The LSJ entries διαθήκη, εὐαγγέλιον, εὐθύς, ἄλλως, ἀπό and
εἰμί were read in the site's copy (`pipeline/.cache/lsj`). All 38 Wikipedia sources were fetched as current wikitext and searched
sentence by sentence. Also fetched: Mounce's Zondervan blog post, the CCEL page of Athanasius' Letter 39, the eBible.org WEB FAQ, the
Internet Archive record of Metzger's *Textual Commentary*, Ehrman's page for Metzger–Ehrman, and the Codex Sinaiticus Project's
"About the Project" page. Wikipedia *Papyrus 47* and *Papyrus 98* were fetched as a cross-check. The researcher's log
(`pipeline/drafts/checked/tlg0031.md`) was read but not relied on.

Totals: **13 findings**. No Greek quotation is wrong: every Greek and English quotation from the Scroll matches `passage.ts`, and the
"our count" figures (εὐθύς 41 in Mark and 12 in the other books; ἐπειδήπερ once, in Luke 1:1) are exactly right. The real problems:
- A footnote in the Print paragraph points to Athanasius' Easter letter (source 32) for a claim about NA28/UBS5 and the ECM.
- "Paul names his secretaries in several of them" is overstated. Only one secretary, Tertius, is named, and the source hedges.
- Papias does not say the words about Mark himself. He reports what "the Presbyter used to say".
- Wallace is set against Mounce as though Wallace called Rev 1:4 a mistake. Mounce's own post says Wallace classes it as a title.
- P115's 616 is stated flatly. Its own source says "apparently" and gives the INTF's "666 or 616". "Oldest manuscript of Revelation 13"
  is not what the source says, and P47 (c. 200–300) also has Revelation 13.
- The Luke 22:20 quotation in the summary sits inside the Scroll's own double brackets ⟦ ⟧. The article never says so.
- The ECM note lists Mark, Acts and the Catholic Letters, but its source also lists Revelation (and the Parallel Pericopes).
The rest are smaller: a dropped qualification on dating, unsupported or loose wording, and one footnote range.

---

## 1. The ECM sentence cites Athanasius' Easter letter (source 32)
- **Claim:** "The INTF's *Editio Critica Maior*, meant to use every known manuscript, is to be completed by 2030; for the Catholic
  Letters (the seven letters of James, Peter, John and Jude) its text is already followed by both.[^51,32]"
- **Problem:** Source 32 is "Athanasius, Festal Letter 39 (for 367) … (Christian Classics Ethereal Library)". It says nothing about
  the ECM, NA28 or UBS5. The fact itself is right: source 51 supports it, and source 45 supports "both" (NA28 and UBS5). The 32 is a
  slip, probably for 45.
- **Evidence:** Wikipedia, *Editio Critica Maior* (source 51): "It is to be completed by the year 2030." Also: "The recent editions of
  *Nestle-Aland* (the 28th edition), and the *Greek New Testament* of the United Bible Societies (the 5th edition), follow the text of
  the ECM for the Catholic epistles." CCEL, `npnf204.xxv.iii.iii.xxv.html` (source 32) is the list of books and "These are fountains
  of salvation…", with nothing on modern editions.
- **Suggested fix:** "… its text is already followed by both.[^51,45]"
- **Confidence:** high

## 2. "Paul names his secretaries in several of them": only one secretary is named, and the source hedges
- **Claim:** "The letters are real letters, often dictated: Paul names his secretaries in several of them, a common practice in the
  Greco-Roman world.[^13]"
- **Problem:** The source says Paul "does explicitly state, or even names, in multiple epistles that he used secretaries". That means
  he says in several letters that he used one, and in some cases a name is given. The article turns this into "names his secretaries
  in several of them". The letters name only one secretary, Tertius (Romans 16:22, which the article quotes next). The other passages,
  like Galatians 6:11 (also quoted), are Paul saying he writes the closing in his own hand.
- **Evidence:** Wikipedia, *Authorship of the Pauline epistles*, "Paul's use of secretaries": "Paul does explicitly state, or even
  names, in multiple epistles that he used secretaries (or amenuenses), which was a common practice in the Greco-Roman world".
  `npx tsx scripts/passage.ts tlg0031.tlg006 16.22`: «ἀσπάζομαι ὑμᾶς ἐγὼ Τέρτιος ὁ γράψας τὴν ἐπιστολὴν ἐν κυρίῳ».
- **Suggested fix:** "The letters are real letters, often dictated: several of them show that Paul used a secretary, a common practice
  in the Greco-Roman world, and in one the secretary gives his name.[^13]"
- **Confidence:** high

## 3. Papias is quoting "the Presbyter", not speaking for himself
- **Claim:** "Papias of Hierapolis, who lived about 60–130,[^6] said that Mark, «ἑρμηνευτὴς Πέτρου γενόμενος», "Peter's
  interpreter", “wrote accurately all that he remembered, not, indeed, in order”.[^11]"
- **Problem:** In the cited passage Papias passes on what an older authority, "the Presbyter" (ὁ πρεσβύτερος), used to say. This is
  the same kind of dropped attribution flagged in earlier fact-checks (Demetrius of Magnesia in *Lives of the Ten Orators*).
- **Evidence:** `npx tsx scripts/passage.ts tlg2018.tlg002 3.39.15` Greek: «καὶ τοῦθ’ ὁ πρεσβύτερος ἔλεγεν· Μάρκος μὲν ἑρμηνευτὴς
  Πέτρου γενόμενος, ὅσα ἐμνημόνευσεν, ἀκριβῶς ἔγραψεν, οὐ μέντοι τάξει…». Lake's English: "And the Presbyter used to say this, Mark
  became Peter's interpreter and wrote accurately all that he remembered, not, indeed, in order…"
- **Suggested fix:** "Papias of Hierapolis, who lived about 60–130,[^6] passed on what "the Presbyter" used to say: that Mark,
  «ἑρμηνευτὴς Πέτρου γενόμενος», "Peter's interpreter", “wrote accurately all that he remembered, not, indeed, in order”.[^11]"
- **Confidence:** high

## 4. Wallace is presented as calling Rev 1:4 a blunder, against Mounce; the source says Wallace treats it as a title
- **Claim:** "Daniel Wallace called it “the first and worst grammatical solecism in Revelation” (a solecism is a grammatical blunder).
  Bill Mounce argues that it is deliberate: the words echo God's name in Exodus 3:14 and are kept unchanged as a title.[^27]"
- **Problem:** The only source (Mounce's post, quoting Wallace) does not set the two against each other. Mounce says Wallace classes
  the phrase as a "nominative of appellation", that is, a title kept in the nominative. Mounce gives that as the reason it is not a
  mistake. The article's gloss "(a solecism is a grammatical blunder)" and the "but" structure give Wallace a view the source does not
  give him. (Wallace's grammar itself was not read: the log says the quotation comes from Mounce, not from Wallace's book.)
- **Evidence:** Mounce, "Who was, and Is, and Is to come" (Zondervan Academic, 6 Jan 2020): "Is this a mistake? No. … As a title, it
  is common to have it in the nominative case … Wallace would classify this as a "nominative of appellation" (pp. 61f) and he in fact
  discusses it in detail under the heading "nominative after a preposition," of which our expression is the only example in the NT.
  He says that "this is the first and worst grammatical solecism in Revelation" (63)." Also: "When the biblical writers break what we
  consider to be "proper" grammar, we call it a "solecism.""
- **Suggested fix:** "Daniel Wallace called it “the first and worst grammatical solecism in Revelation” (a solecism is a break with
  the rules of grammar), yet he classes the words as a title kept in the nominative. Bill Mounce, quoting him, argues that the
  irregularity is deliberate: the words echo God's name in Exodus 3:14 and are kept unchanged as a title.[^27]"
- **Confidence:** medium

## 5. P115's 616 is stated as certain, and "the oldest known manuscript of Revelation 13" is not what the source says
- **Claim:** "That number stands in Codex Ephraemi Rescriptus and in P115, a papyrus from Oxyrhynchus dated about 225–275, the oldest
  known manuscript of Revelation 13 (as of 2017).[^59,60]"
- **Problem:** (a) Source 60 says P115 "apparently" gives 616, and that the INTF's transcription conjectures "666 or 616", "therefore
  not giving a definitive number". The article drops that hedge. (b) Source 59 calls P115 "the oldest preserved manuscript of the
  Revelation (as of 2017)". The article narrows this to "Revelation 13". Neither source makes that claim, and it is not safe: P47
  (Chester Beatty), dated c. 200–300, contains Revelation 9:10–17:2, chapter 13 included. It may be as old as P115 or older.
- **Evidence:** Wikipedia, *Papyrus 115*: "An interesting element of 𝔓115 is that it apparently gives the number of the beast in
  Revelation 13:18 as 616 … According to the transcription of the INTF, a conjectured reading of the manuscript, due to the space
  left, is [χξϛ] η χιϛ (666 or 616), therefore not giving a definitive number to the beast." Wikipedia, *Number of the beast*: "Papyrus
  115 (which is the oldest preserved manuscript of the Revelation as of 2017)". Wikipedia, *Papyrus 47*, infobox: "text = Book of
  Revelation 9:10-17:2", "date = c. 200-300".
- **Suggested fix:** "That number stands in Codex Ephraemi Rescriptus, and apparently in P115, a papyrus from Oxyrhynchus dated about
  225–275 and one of the oldest manuscripts of Revelation.[^59,60]"
- **Confidence:** medium

## 6. The Luke 22:20 quotation sits inside the Scroll's own double brackets
- **Claim:** "In Luke, Jesus calls the cup at supper «ἡ καινὴ διαθήκη ἐν τῷ αἵματί μου», “the new covenant in my blood”.[^2,3]"
- **Problem:** In the Scroll's Greek (Westcott and Hort), the words from 22:19b to the end of 22:20 are set between ⟦ ⟧. The article
  treats those brackets as the editors' mark of a later addition when it discusses Mark 16:9–20 and John 7:53–8:11. A reader who opens
  source 3 sees the quoted words bracketed, and the article gives no word of it. Small point too: the Greek says the cup was taken
  "after supper" (μετὰ τὸ δειπνῆσαι), and the WEB says so as well.
- **Evidence:** `npx tsx scripts/passage.ts tlg0031.tlg003 22.19` Greek: «… Τοῦτό ἐστιν τὸ σῶμά μου ⟦τὸ ὑπὲρ ὑμῶν διδόμενον· τοῦτο
  ποιεῖτε εἰς τὴν ἐμὴν ἀνάμνησιν.» `… 22.20`: «καὶ τὸ ποτήριον ὡσαύτως μετὰ τὸ δειπνῆσαι, λέγων Τοῦτο τὸ ποτήριον ἡ καινὴ διαθήκη ἐν
  τῷ αἵματί μου, τὸ ὑπὲρ ὑμῶν ἐκχυννόμενον⟧.» English: "Likewise, he took the cup after supper, saying, "This cup is the new covenant
  in my blood…""
- **Suggested fix:** "In Luke, Jesus calls the cup after supper «ἡ καινὴ διαθήκη ἐν τῷ αἵματί μου», “the new covenant in my blood”
  (words that Westcott and Hort, whose Greek the Scroll prints, set in double brackets as doubtful).[^2,3]"
- **Confidence:** medium

## 7. The ECM's published volumes: Revelation (and the Parallel Pericopes) are left out
- **Claim:** Editions, note on the *Editio Critica Maior*: "volumes for Mark, Acts and the Catholic Letters have appeared."
- **Problem:** The cited source lists published volumes for Mark, Acts, the Catholic Letters, **Revelation** (Text, Supplementary
  Material, two Studies volumes) and the Parallel Pericopes. As worded, the note implies those three are the only ones. (The log
  records only three books "listed". The page may have been updated since, but the current page lists five.)
- **Evidence:** Wikipedia, *Editio Critica Maior*, "Current editions": headings "The Gospel of Mark", "The Acts of the Apostles",
  "Catholic Letters", "Revelation" ("VI/1, Revelation, Part 1, Text"; "VI/2 … Supplementary Material"; "VI/3.1 … Studies"; "VI/3.2 …
  Studies on Punctuation and Textual Structure") and "Parallel Pericopes".
- **Suggested fix:** "The great edition meant to use every known manuscript; volumes for Mark, Acts, the Catholic Letters and
  Revelation have appeared."
- **Confidence:** medium

## 8. "First century and perhaps the early second" understates the range in the source
- **Claim:** "The books were written by several authors in the first century and perhaps the early second, and scholars do not agree
  on the date of the latest of them.[^1]"
- **Problem:** Source 1 names scholars who date some books well beyond the early second century: Harris puts Jude and 2 Peter at
  130–150, and Trobisch puts Acts in the mid-to-late second century. Its lead says only that "many" of the texts are mid-to-late first
  century. "Perhaps the early second" sets a later limit than the source does.
- **Evidence:** Wikipedia, *New Testament*, "Dating the New Testament": "Many other scholars, such as Bart D. Ehrman and Stephen L.
  Harris, date some New Testament texts much later than this" (Harris 2010 p. 20: "Dates Jude and 2 Peter to 130–150 AD"; Harris 1980
  p. 295: 2 Peter "about 150 C.E."). Also: "Richard Pervo dated Luke–Acts to c. 115 AD, and David Trobisch places Acts in the
  mid-to-late second century". Lead: "Literary analysis suggests many of its texts were written in the mid-to-late first century.
  There is no scholarly consensus on the date of composition of the latest New Testament text."
- **Suggested fix:** "The books were written by several authors, most of them in the first century; some scholars date a few of them
  well into the second, and there is no agreement on the date of the latest.[^1]"
- **Confidence:** medium

## 9. "No page written by the authors survives; the oldest copies are papyri from Egypt" is not in source 1
- **Claim:** "No page written by the authors survives; the oldest copies are papyri from Egypt.[^1]"
- **Problem:** Source 1 says the earliest manuscripts "date from the late second to early third centuries", with P52 a possible
  exception. It says nothing about where the oldest copies come from, and nothing explicit about the authors' own pages. The claim is
  true, but its support is in other sources the article already cites: P52 "found = Egypt" (source 44), and P75 found at Pabau, Egypt
  (source 47).
- **Evidence:** Wikipedia, *New Testament*: "The earliest surviving New Testament manuscripts date from the late second to early third
  centuries AD, with the possible exception of Papyrus 52." Wikipedia, *Rylands Library Papyrus P52*, infobox: "found = Egypt", and
  "The fragment of papyrus was among a group acquired on the Egyptian market in 1920". Wikipedia, *Papyrus 75*: "found = Pabau, Egypt".
- **Suggested fix:** "No page written by the authors survives; the oldest copies are papyri found in Egypt.[^1,44,47]"
- **Confidence:** medium

## 10. διαθήκη: three meanings listed, then "the second sense"
- **Claim:** "(διαθήκη could mean a will, a testament, or a covenant, and the Greek Old Testament often uses it in the second sense)"
- **Problem:** Three meanings are listed, so "the second sense" reads as "testament". LSJ (source 2) gives two senses: (1) a will or
  testament, (2) a compact or covenant, "freq. in LXX". The Septuagint use is the covenant sense, which is third in the article's list.
- **Evidence:** LSJ s.v. διαθήκη (site copy, `lsj4.xml`): "disposition of property by will, testament … compact, covenant … freq. in
  LXX, Ge. 6.18, al.; καινή, παλαιὰ δ., Ev.Luc. 22.20".
- **Suggested fix:** "(διαθήκη could mean a will or testament, or a covenant, and the Greek Old Testament often uses it in the sense of
  covenant)"
- **Confidence:** medium

## 11. Acts quotes the opening of Aratus' fifth line, not the whole line
- **Claim:** "The words are the fifth line of Aratus' poem *Phaenomena*,[^29] where the poet uses the epic form of "we are", «τοῦ γὰρ
  καὶ γένος εἰμέν»"
- **Problem:** Line 5 runs on past the quoted words: «τοῦ γὰρ καὶ γένος εἰμέν· ὁ δʼ ἤπιος ἀνθρώποισιν». Acts quotes only the first
  half. Source 29 says "quotes the fifth line" loosely, but the article's own source 30 shows the full line.
- **Evidence:** `npx tsx scripts/passage.ts tlg0653.tlg001 1 5`, line 5: «τοῦ γὰρ καὶ γένος εἰμέν· ὁ δʼ ἤπιος ἀνθρώποισιν».
- **Suggested fix:** "The words open the fifth line of Aratus' poem *Phaenomena*,[^29,30] where the poet uses the epic form of "we
  are", «τοῦ γὰρ καὶ γένος εἰμέν»; Acts has the everyday ἐσμέν.[^30,2]"
- **Confidence:** medium

## 12. The Septuagint "made in the third century BC" is narrower than source 1
- **Claim:** "The writers knew the Septuagint, the Greek translation of the Hebrew Bible made in the third century BC, …[^16]"
- **Problem:** Source 16 does say "the 3rd century BC Greek translation". But the article's own source 1 dates the translators' work
  to "the 3rd and 2nd century BC", which is the usual account: the Torah first, in the third century, the rest later. "Made in the third
  century BC" states the narrower date as fact.
- **Evidence:** Wikipedia, *New Testament*: "by the Jewish translators of the Septuagint in Alexandria in the 3rd and 2nd century BC".
  Wikipedia, *Koine Greek*: "the Septuagint (the 3rd century BC Greek translation of the Hebrew Bible)".
- **Suggested fix:** "The writers knew the Septuagint, the Greek translation of the Hebrew Bible begun in the third century BC, …[^16,1]"
- **Confidence:** low

## 13. Source 22's range covers only Mark, but it is cited for Luke 1:1 and for counts across all 27 books
- **Claim:** "… its first word, ἐπειδήπερ ("since indeed"), occurs nowhere else in the New Testament or the Septuagint.[^24,22]" Also
  "… only 12 times in all the other books together (our count).[^22]"
- **Problem:** Source 22's label describes a count over the whole New Testament, but its `cite` is `tlg0031.tlg002` 1.1–16.20, which
  is Mark only. Readers who follow the link land on Mark, not on Luke 1:1 or the other books. The counts themselves are right (see
  below). The claim "nowhere else … or the Septuagint" rests on source 24 alone.
- **Evidence:** Script over all 27 Westcott–Hort files: εὐθύς Matthew 7, Mark 41, Luke 1, John 3, Acts 1, all others 0; ἐπειδήπερ
  Luke 1, all others 0. Source 22: `cite: { work: "tlg0031.tlg002", ref: "1.1", to: "16.20" }`.
- **Suggested fix:** For the ἐπειδήπερ sentence, cite "[^24,23]" (source 23 is Luke 1.1–4, which shows ΕΠΕΙΔΗΠΕΡ), and keep source 22
  for the εὐθύς count only.
- **Confidence:** low

---

**Checked, no problems found in:**
- Scroll passages: Luke 22.20 (the Greek words and the LSJ citation Ev.Luc. 22.20); Romans 16.22 (Greek and WEB English exact);
  Galatians 6.11; Mark 5.41 (Greek, "Young lady, I tell you, get up"); John 1.1 (first words in capitals; English exact); Mark 1.12 (the
  WEB's English exact; "our translation" accurately renders the historical present ἐκβάλλει); Luke 1.1–4 (one sentence over four
  verses; the English of 1.1 exact); Revelation 1.4 (ἀπὸ ὁ ὢν … in the Greek; the WEB's "from God, who is …"); Acts 17.28 (ἐσμέν;
  "As some of your own poets have said"; "For we are also his offspring"); Mark 16.8–20a (16.8 Greek and English; both endings in ⟦ ⟧;
  ΑΛΛΩΣ heading; the English has only the longer ending); John 7.53–8.11 in ⟦ ⟧, «Οὐδὲ ἐγώ σε κατακρίνω», "Neither do I condemn you";
  1 John 5.6–8 (no Comma in Greek or English); Revelation 13.18 (ἑξακόσιοι ἑξήκοντα ἕξ, "six hundred sixty-six"); Mark 1.1–2 (no "Son of
  God" in the Greek, which the WEB has; ἐν τῷ Ἠσαίᾳ τῷ προφήτῃ against "in the prophets"); Romans 16.25–27 in the Greek and the
  doxology after 14.23 in the English.
- Eusebius 3.39.15–17 (Lake's "wrote accurately all that he remembered, not, indeed, in order"; the woman "accused before the Lord of
  many sins"; the Gospel according to the Hebrews). 5.8.2–6 ("the disciple and interpreter of Peter", "a follower of Paul", "found in
  all the good and ancient copies", "towards the end of the reign of Domitian"). 3.25.1–7 ("the holy tetrad of the Gospels", «ἐν
  ὁμολογουμένοις», «τῶν δ’ ἀντιλεγομένων», "Disputed Books which are nevertheless known to most"; Revelation in both lists, as Wikipedia
  also says).
- Aratus 5 εἰμέν; LSJ εἰμί ("1 pl. ἐσμέν, Ep. and Ion. εἰμέν"); LSJ ἀπό ("usually with Gen."); εὐαγγέλιον ("good tidings, good news");
  εὐθύς ("of Time, straightway, forthwith"); ἄλλως ("otherwise").
- The εὐθύς counts (41 / 12) and ἐπειδήπερ (once, Luke 1:1) in the Westcott–Hort text, recounted.
- TEI headers: Westcott and Hort, New York, Harper and Brothers, 1882–1892; the WEB "Rainbow Missions"; the INTF transcription of
  British Library Add. 43725, with Mark 1:1 ending ιυ χυ in the first hand and υυ θυ added by corrector 1 (all overlined nomina sacra);
  Coptic SCRIPTORIUM, "Mark Chapter 1", Sahidic Coptic.
- Wikipedia, *New Testament*: 27 books; Ἡ Καινὴ Διαθήκη; no consensus on the latest date; Ehrman's "between the years 50 and 120"; the
  seven undisputed and six disputed letters ("near consensus"); Hebrews anonymous, Pauline authorship generally rejected; names fixed
  to the gospels "by the mid second century"; Irenaeus c. 180; Acts the sequel to Luke; letters "circulating, perhaps in collected
  forms, by the end of the 1st century"; Marcion c. 140 (a version of Luke, ten letters); Irenaeus' four gospels c. 180; Eusebius c.
  300; Athanasius' Easter letter of 367; Hippo 393 "may have been" the first; Carthage 397 and 419; the two explanations of the style
  (Jewish Greek against the papyri of letters, receipts and petitions); 5,800 Greek, 10,000 Latin and 9,300 other manuscripts; Syriac,
  Latin and Coptic as the earliest versions; Vaticanus and Sinaiticus among the earliest extant Christian Bibles.
- Wikipedia book pages: 1 Thessalonians 49–51 and "the earliest extant Christian text"; Mark c. 70 and Markan priority; Matthew 80–90
  (infobox; "last quarter of the first century" in the lead) and Papias c. 60–130; Luke and Acts 80–90 and the same author; John
  90–100; Revelation c. 95, Domitian 81–96, title from ἀποκάλυψις, the only apocalyptic book in the canon.
- Wikipedia *Koine Greek* (ἡ κοινὴ διάλεκτος; Alexander; "over half their quotations"; the historical present "151 times" in Mark);
  *Koine Greek grammar* (dual gone, optative rarer, new uses of ἵνα, καί/δέ ratio from Semitic influence); *Language of the New
  Testament* (talitha kum); *Luke 1* (Karris, "finely crafted, periodic Greek"; ἐπειδήπερ not elsewhere in the NT or LXX); *Epistle to
  the Hebrews* ("more polished and eloquent than any other book"); *Biblical manuscript* (Gregory 1908, four groups; Metzger 1992, the
  *Iliad* 457 / 2 / 188).
- Wikipedia *Westcott and Hort* (1881; reliance on Vaticanus and Sinaiticus; later editions similar); *Papyrus 46* (Chester Beatty;
  175–225 or the early third century); *Rylands P52* (credit-card size; John 18; Roberts 1935; 100–150; Orsini–Clarysse 125–175; later
  dates possible); *Papyrus 75* (third century traditionally; recent arguments into the fourth); *Nomina sacra*; *Codex Vaticanus*
  (fourth century; "since at least the 15th century"; "definitely appearing in the 1481 catalog"; ends at Hebrews 9:14; lacks 1–2
  Timothy, Titus, Philemon, Revelation); *Codex Sinaiticus* (Add MS 43725; oldest complete NT; codex "the forerunner to the modern
  book"; 1844 leaves; shown the codex in 1859; Soviet sale to the British Museum, 1933); Codex Sinaiticus Project (four institutions;
  digitisation, transcription); *Codex Bezae* (5th century; Greek–Latin; Cambridge; "principal Greek representative of the Western
  text-type"; Acts "nearly 8% longer").
- Wikipedia *Complutensian Polyglot* (NT printed 1514; publication 1520, distribution 1521; Alcalá); *Novum Instrumentum omne* (Froben,
  Basel, 1516; first published; rushed; "a large number of translation mistakes"; last six verses of Revelation back-translated);
  *Chapters and verses* (Estienne, 1551); *Textus Receptus* (1633 Elzevir preface, "Textum ergo habes, nunc ab omnibus receptum");
  *Novum Testamentum Graece* (Nestle 1898; NA28 2012, edited by the INTF; UBS5 2014 same text; NA has more variants); *Editio Critica
  Maior* (INTF, Münster; every manuscript; 2030; NA28/UBS5 follow it for the Catholic Letters).
- Wikipedia *Mark 16* (Sinaiticus and Vaticanus end at 16:8; the deliberate blank column in Vaticanus; the Byzantine majority with
  16:9–20; both endings together in six Greek manuscripts; both endings considered later; whether 16:8 was the end is disputed);
  *Jesus and the woman taken in adultery* (not in P66, P75, ℵ, B; Bezae the first Greek witness; after John 21:25, Luke 21:38, John
  7:36; "broad academic consensus"; Papias; NA28 and UBS double square brackets); *Johannine Comma* (mainly Latin; earliest Greek
  manuscript 14th century; Erasmus' first two editions without it; added 1522 after being told of a Greek manuscript); *Number of the
  beast* (Irenaeus knew 616 and did not adopt it); *Mark 1* (Wasserman: the omission accidental; B D L Δ ℵ "Isaiah the prophet", the
  Textus Receptus "in the prophets"); *Romans 14* (most Greek manuscripts, mostly Byzantine, put the doxology after 14:23; others after
  15, in several places, or nowhere); *Epistle to the Romans* (P46 after chapter 15).
- Mounce post (the nominatives after ἀπό; Exodus 3:14; scribes adding θεοῦ). CCEL Letter 39 ("For 367"; "These are fountains of
  salvation"). WEB FAQ (update of the ASV of 1901; "edited to conform to the Greek Majority Text New Testament where there are
  significant differences in manuscripts"; public domain; senior editor Michael Paul Johnson). Internet Archive: Metzger, *Textual
  Commentary*, companion to UBS4, Stuttgart, Deutsche Bibelgesellschaft, 1994. Ehrman's site: Metzger–Ehrman, fourth edition, OUP,
  2005.
- Timeline years and kinds; the certainty labels on the gospel authorship, the gospel dates, P52 and the Mark ending are appropriate.

**Could not verify / not checked in depth:**
- Wallace's grammar itself (p. 63) was not read. Finding 4 rests on Mounce's account of it.
- "The first list that matches today's twenty-seven exactly" (Athanasius): source 1 says only that he "gave a list of the books that
  would become the twenty-seven-book NT canon". "First" is the standard view, but source 1 does not say it.
- "recent studies argue for dates as late as the fourth" is supported for P75 (source 47). For P66 the cited sources give only "late
  100s or early 200s" (source 46).
- The Complutensian's release date: source 40 says distribution 1521, but source 41 (*Novum Instrumentum omne*) says "not released
  until 1522". The article follows source 40, so it agrees with its citation. The two sources disagree.
- Aside, not an article claim: in the reader, 1 John 5:6–7 shows broken verse boundaries (Greek 5.6 ends "… ἐστιν ἡ" and 5.7 reads
  "ὅτι τρεῖς εἰσὶν οἱ μαρτυροῦντες, ἀλήθεια."). John 8.11 ends with a stray "οὐκ ἐγείρεται" (the end of 7.52). These look like
  parser slips worth a separate look.

**Findings: 13** (3 high-confidence, 8 medium, 2 low).
