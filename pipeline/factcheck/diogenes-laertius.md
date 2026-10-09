# Fact-check: Diogenes Laertius

Article: `web/src/wiki/authors/tlg0004.ts` (checked by its researcher 2026-10-07). Checked 2026-10-09.

Method. Every `cite` source (all 22 of them) was opened with `scripts/passage.ts` and read against the sentences that point to it.
Every `url` source was read: Wikipedia *Diogenes Laertius* (live wikitext, identical to the copy saved by the earlier, interrupted
check), Wikipedia *Chreia* (wikitext), Hicks's Loeb vol. 1 (Internet Archive OCR: title page, preface, the whole introduction and
the bibliography), the three BMCR reviews (Todd 2000.07.09, McConnell 2019.02.28, Moore 2022.01.04, in the Internet Archive's
copies), the Cambridge Core summary of Dorandi's introduction, the Cambridge Core book page (the publisher's description), the
Cambridge Core record of Wilson's JHS review of Long, LSJ κολοφών on Perseus, and Montaigne II.10 in Cotton's translation (Project
Gutenberg). The edition details were compared with the Perseus TEI headers in `pipeline/.cache/corpus`. The researcher's log
(`pipeline/drafts/checked/tlg0004.md`) was glanced at but not relied on. Both "our translation" renderings were checked against the
Greek and the Latin.

Totals: **10 findings**. No misquotation of the Greek and no wrong date was found; every Greek quotation matches the Scroll's text,
and every English rendering attributed to the Scroll matches Hicks's translation word for word. The findings are:
- one footnote that points at the wrong source (the Bion variants cite the LSJ entry for κολοφών);
- three dropped or softened qualifications (Dorandi's corrector, Hicks's "vain and credulous", Aristippus's partial translation);
- one out-of-date "prevailing view" that the article's own source 28 contradicts (White argues he came from the town of Laertes);
- five smaller slips of wording or attribution (Apollodorus called a biographer; "Homer's heroes" for a line spoken by Athena;
  the Traversari date credited to Cao; "much of the book" is chreiai; B "is" the most faithful witness, on a 1925 source alone).

---

## Fact check: Diogenes Laertius (web/src/wiki/authors/tlg0004.ts)

### 1. The Bion variants point to the LSJ entry for κολοφών, which says nothing about them
- **Claim:** "Others have tried ἀνιῶν, “griefs” (Reiske), and αἰτιῶν, “accusations” (Donald Russell), and Marcovich rewrote the phrase further.[^24,20]"
- **Problem:** Source 20 is "Liddell–Scott–Jones, Greek–English Lexicon, the entry κολοφών". It has nothing to do with Bion's saying,
  Reiske, Russell or Marcovich. The gloss "griefs" for ἀνιῶν is not in Todd's review (source 24) either; Todd glosses only αἰτιῶν
  ("charges", and "glory gives birth to accusations"). Everything else in the sentence is in Todd.
- **Evidence:** Todd, BMCR 2000.07.09 (https://web.archive.org/web/2024/https://bmcr.brynmawr.edu/2000/2000.07.09/), on 4.48:
  "Reiske’s ἀνιῶν has been a popular replacement for ἐτῶν, though Donald Russell … proposed the more plausible, and easily
  explicable, αἰτιῶν (“charges”) … i.e., “glory gives birth to accusations.” M. meanwhile chooses to enrich this text with
  δόξαν < ἀνιῶν ἀσχ > έτων μητέρα". LSJ κολοφών (source 20, Perseus): "summit, top, finishing … κολοφῶνα ἐπιτιθέναι put the
  finishing touch to" and nothing else relevant.
- **Suggested fix:** "Others have tried ἀνιῶν (Reiske) and αἰτιῶν, “charges” (Donald Russell), and Marcovich rewrote the phrase further.[^24]"
  (If "griefs" is wanted, add an LSJ source for ἀνία; do not reuse source 20.)
- **Confidence:** high

### 2. Dorandi's corrector did not simply "put many errors right": he changed what he took to be errors, "rightly or wrongly"
- **Claim:** "Dorandi judges that he knew little and copied mechanically, and that a few years later a corrector who knew Greek well put many errors right.[^2,1]"
- **Problem:** The quotation of Dorandi in Wikipedia (source 1, the only source for this) keeps his qualification: the corrector
  changed "many errors or readings that, rightly or wrongly, he considered erroneous". The article turns this into plain fact,
  which tells the reader the corrector's changes can be trusted. Dorandi says the opposite.
- **Evidence:** Wikipedia, *Diogenes Laertius*, raw wikitext (https://en.wikipedia.org/w/index.php?title=Diogenes_Laertius&action=raw),
  note to "Manuscript B": "A few years later an "anonymous corrector" with good knowledge of Greek rectified "many errors or
  readings that, rightly or wrongly, he considered erroneous" {{harv|Dorandi|2013|p=21}}."
- **Suggested fix:** "… and that a few years later a corrector who knew Greek well changed many readings that, rightly or wrongly, he took to be mistakes.[^2,1]"
- **Confidence:** high

### 3. Hicks's "multifarious reading" sentence is quoted without its first half, which turns a mixed verdict into praise
- **Claim:** "Hicks found in him a man “of multifarious reading, amazing industry, and insatiable curiosity”, writing in an age whose taste ran to personal details, anecdotes and witty sayings.[^2]"
- **Problem:** In Hicks the words are the end of a sentence that begins "a Dryasdust, vain and credulous". The article's
  "a man" replaces Hicks's "a Dryasdust, vain and credulous", so the reader gets only the compliments.
- **Evidence:** Hicks, vol. 1, introduction p. xiv (https://archive.org/details/livesofeminentph01diog): "The impression left upon
  the unprejudiced reader by close acquaintance with our author is that he is dealing with a Dryasdust, vain and credulous, of
  multifarious reading, amazing industry, and insatiable curiosity."
- **Suggested fix:** "Hicks found in him “a Dryasdust, vain and credulous, of multifarious reading, amazing industry, and insatiable curiosity”, writing in an age whose taste ran to personal details, anecdotes and witty sayings.[^2]"
  (Add the longer quotation to `outsideQuotes`.)
- **Confidence:** high

### 4. "The prevailing modern view" that "Laertius" is a nickname, and "His home town is unknown", are out of date by the article's own source 28
- **Claim:** "His home town is unknown.[^1]" and "{debated} Nor is it clear what “Laertius” means. It might point to a town called Laerte, but the prevailing modern view is that it was a nickname …[^1,3]"
- **Problem:** Wikipedia's "prevailing modern theory" rests on H. S. Long's introduction of 1972 ({{sfn|Long|1972|p=xvi}}). The
  article's own source 28 (Moore's review of White, 2021) reports that the newest translator argues at length the opposite: that the
  name means "of Laertes", a real town. The paragraph is rightly marked {debated}, but "the prevailing modern view" and the flat
  "His home town is unknown" do not tell the reader that the most recent full study disagrees.
- **Evidence:** Moore, BMCR 2022.01.04 (https://web.archive.org/web/2024/https://bmcr.brynmawr.edu/2022/2022.01.04/): "White then
  establishes, at length, that the author's name is Diogenes of Laertes (a town in modern-day Turkey); dates the work to 210–220 ce".
  Wikipedia wikitext: "The prevailing modern theory is that "Laertius" is a nickname … {{sfn|Long|1972|p=xvi}}".
- **Suggested fix:** "His home town is not recorded.[^1]" and "… It might point to a town called Laerte; H. S. Long, writing in 1972, called it the prevailing view that it was a nickname, taken from … to tell him apart from the many other men called Diogenes,[^1,3] but Stephen White, his most recent translator, argues at length that he came from Laertes.[^28]"
- **Confidence:** medium (the claim is sourced, but stated more firmly than the article's own sources allow)

### 5. Apollodorus was a chronicler, not a biographer
- **Claim:** "he also drew, directly or through others, on Hellenistic biographers such as Antigonus of Carystus, Hermippus, Sotion and Apollodorus.[^1,2]"
- **Problem:** Wikipedia (source 1) links Apollodorus of Athens, and Hicks (source 2) describes his work as a verse chronology
  (*Chronica*), cited by Diogenes for dates. Neither calls him a biographer. (The "Life of Epicurus by Apollodorus" that Hicks
  mentions is by a different man, the Epicurean.)
- **Evidence:** Hicks, introduction pp. xxv–xxvi: "Apollodorus of Athens was another writer indispensable to any later compiler of
  a biographical history. About 140 B.C. he published Χρονικά, a compendium of chronology, in comic trimeters … The dates given in
  it are cited for the earlier and more doubtful figures in Greek philosophy by Laertius". Wikipedia: "… [[Apollodorus of Athens]] …".
- **Suggested fix:** "he also drew, directly or through others, on Hellenistic biographers such as Antigonus of Carystus, Hermippus and Sotion, and on the chronicle of Apollodorus of Athens.[^1,2]"
- **Confidence:** high

### 6. The cited line of Homer is spoken by Athena, not by a hero
- **Claim:** "taken from the words with which Homer's heroes address Odysseus, «διογενὲς Λαερτιάδη», “Zeus-born son of Laertes” (our translation)"
- **Problem:** The footnoted line, *Iliad* 2.173, is Athena's address to Odysseus (2.172 "ἀγχοῦ δ' ἱσταμένη προσέφη γλαυκῶπις
  Ἀθήνη"). The formula is used by gods as well as men. Wikipedia (source 1) says only that the epithet is "used in addressing
  Odysseus". The translation "Zeus-born son of Laertes" is correct.
- **Evidence:** `npx tsx scripts/passage.ts tlg0012.tlg001 2.172 2.173`; Wikipedia wikitext: "derived from the Homeric epithet
  Diogenés Laertiádē, used in addressing Odysseus".
- **Suggested fix:** "taken from the words with which Homer's characters, gods among them, address Odysseus, «διογενὲς Λαερτιάδη», “Zeus-born son of Laertes” (our translation)"
- **Confidence:** high

### 7. Henricus Aristippus may have translated only part of the work
- **Claim:** "Henricus Aristippus, archdeacon of Catania, translated him in the late 1150s, but his version is lost.[^1]" and the timeline's "Henricus Aristippus translates Diogenes into Latin (late 1150s); his version is lost"
- **Problem:** Source 1 says two things. Its "Legacy" section (after Cao) speaks of "a Latin translation of Diogenes Laërtius's
  book". Its "Manuscripts" section (after Long) is more careful: he "is known to have translated at least some of the work". The
  article keeps only the stronger version.
- **Evidence:** Wikipedia wikitext: "[[Henry Aristippus]], in the 12th century, is known to have translated at least some of the
  work into Latin … {{sfn|Long|1972|p=xxvi}}"; and "[[Henricus Aristippus]], the archdeacon of [[Catania]], produced a Latin
  translation of Diogenes Laërtius's book in southern Italy in the late 1150s, which has since been lost or destroyed.{{sfn|Cao|2010|page=271}}"
- **Suggested fix:** "Henricus Aristippus, archdeacon of Catania, translated at least part of the work in the late 1150s, but his version is lost.[^1]"; timeline: "Henricus Aristippus translates at least part of Diogenes into Latin (late 1150s); his version is lost"
- **Confidence:** medium

### 8. The date of Traversari's presentation copy is not Cao's
- **Claim:** "while Wikipedia, after Gian Mario Cao, has him working on it in Florence from 1424 to 1433, and dates the copy presented to Cosimo de' Medici 8 February 1433.[^2,1]"
- **Problem:** In Wikipedia only the years 1424–1433 come from Cao. The date of the presentation copy is cited to A. C. de la Mare
  (1992), and that citation is tagged "page needed". The sentence credits both to Cao.
- **Evidence:** Wikipedia wikitext: "… produced another Latin translation in [[Florence]] between 1424 and 1433 …{{sfn|Cao|2010|page=271}}"
  and "(whose manuscript presentation copy to [[Cosimo de' Medici]] was dated February 8, 1433{{sfn|de la Mare|1992|p={{page needed|date=March 2016}} }})".
  Hicks, p. xxxii: "completed in 1431 (for an extant copy is dated February 1432)".
- **Suggested fix:** "… Hicks dates its completion to 1431, from a copy dated February 1432; Wikipedia, after Gian Mario Cao, has him working on it in Florence from 1424 to 1433, and, after A. C. de la Mare, dates the copy presented to Cosimo de' Medici 8 February 1433.[^2,1]"
- **Confidence:** medium

### 9. "Much of the book is made of" chreiai: no source says so
- **Claim:** "Much of the book is made of sayings told in a fixed shape that ancient teachers called a *chreia*: a short anecdote about a named person, often in the pattern *on being asked* (ἐρωτηθείς) … *he said* (ἔφη).[^14]"
- **Problem:** Source 14 (Wikipedia, *Chreia*) supports the definition and the patterns, but it never mentions Diogenes Laertius'
  book. Hicks speaks of "choice specimens" of "personal details, anecdotes, and witty sayings … in Books VI. and VII." No source
  says how much of the book they make up.
- **Evidence:** Wikipedia *Chreia* wikitext (https://en.wikipedia.org/w/index.php?title=Chreia&action=raw): "Usually it conformed
  to one of a few patterns, the most common being "On seeing..." …, "On being asked..." (ἐρωτηθείς …), and "He said..." (ἔφη …)";
  no mention of Diogenes Laertius. Hicks p. xv: "Of these there are choice specimens in Books VI. and VII."
- **Suggested fix:** "Many of his sayings are told in a fixed shape that ancient teachers called a *chreia*: …[^14]"
- **Confidence:** medium

### 10. "B … is the most faithful to the archetype" rests on Hicks's report of opinion in 1925
- **Claim:** "B, the Borbonicus at the National Library in Naples, is the most faithful to the archetype.[^2]" and the timeline's "B, the Naples manuscript, the most faithful to the archetype, is written"
- **Problem:** The only source is Hicks (1925), who reports it as the agreement of critics of his day. The article states it as
  present fact. Its later source, Todd's review of the 1999 Teubner (source 24), ranks B and P together.
- **Evidence:** Hicks p. xxxv: "Nevertheless all critics agree that B is the most faithful to the archetype." Todd, BMCR
  2000.07.09: "The manuscripts are B (Neap. III B 29), P (Par. gr. 1759) and F (Med.-Laur. 69.13), of which B and P are superior."
- **Suggested fix:** "B, the Borbonicus at the National Library in Naples, was in Hicks's day agreed to be the most faithful to the archetype;[^2] Marcovich's reviewer ranked B and P together above F.[^24]" Timeline: "B, the Naples manuscript, is written (twelfth century; about 1200 by Hicks's dating)"
- **Confidence:** low to medium

---

## Verified and found correct

- **Cite sources (all opened):** *Iliad* 2.173 (the words διογενὲς Λαερτιάδη; "Zeus-born son of Laertes" is a fair rendering); DL 9.116
  (Saturninus, "Sextus taught Saturninus called Cythenas, another empiricist", Hicks word for word); 3.47 (Φιλοπλάτωνι … ὑπαρχούσῃ,
  feminine, so the reader is a woman; "as you are an enthusiastic Platonist, and rightly so" exact); 10.29 (ὥστε σὲ πανταχόθεν
  καταμαθεῖν τὸν ἄνδρα and its English exact; the three letters and their subjects); 9.109 ("our Apollonides of Nicaea", ὁ παρʼ
  ἡμῶν); 1.1–3 (Magi, Chaldaeans, Gymnosophists, Druids; the reply quoted exactly); 1.13–15 (two beginnings, Anaximander pupil of
  Thales, Pythagoras "for the most part in Italy", the Ionian line ending with Clitomachus, Chrysippus and Theophrastus, the Italian
  with Epicurus); 8.91 (τῶν σποράδην, ὥς φασι, "the so-called sporadic philosophers"); 8.53 (ἐγὼ δʼ εὗρον … "I found in the
  Memorabilia of Favorinus"); 1.34 (Thales and the ditch, introduced by λέγεται, rightly tagged {legend}); 1.36 (ἐρωτηθεὶς τί
  δύσκολον …); 6.38 (Alexander: both Greek phrases and the English exact; tagged {legend}); 1.39 (death "from heat, thirst" in old
  age; ἐν τῷ πρώτῳ τῶν Ἐπιγραμμάτων ἢ Παμμέτρῳ; the couplet quoted exactly); 1.63 ("all the illustrious dead in all metres and
  rhythms, in epigrams and lyrics"); 10.138 (κολοφῶνα … τῇ τῆς εὐδαιμονίας ἀρχῇ and the English); 10.16 (his epigram and the start
  of the will); 4.48 (〈ἀρ〉ετῶν and "Renown he called the mother of virtues"); 4.43 (περιιὼν … "In all his life he never married nor had
  any children"); 10.74 (the gap, the asterisks and the bracketed note, all as described); 7.202 (ends at Περὶ τῶν λεγομένων ὑπὲρ τῆς,
  with Hicks's bracketed "[Pleasure]"); 6.63 (the Homeric-style line and "Despoil the rest; off Hector keep thy hands").
- **Hicks (source 2):** the name ("Eustathius calls him Laertes"); "who he was, when and where he was born, is nowhere recorded";
  "Many books had been written … this … alone remains"; Photius on Sopater; Stephanus "cites it three times"; Eustathius and Tzetzes
  in the twelfth century; date from Saturninus; no mention of Neoplatonism; the Pammetros and "but sorry stuff"; no claim to study
  philosophy; the two views on "our Apollonides"; "succession" and the pedigree; Presocratics in Books 1, 2, 8 and 9; Plato and
  Epicurus swollen by supplementary matter; "by far the most precious thing preserved in this collection of odds and ends";
  "comprehensive and trustworthy"; Book 7 index in P, ending with Cornutus, "the book would be doubled in size"; the lady, Arria and
  Julia Domna (d. 217), "a natural inference"; x. 138 as the end; "the two hundred sources cited"; Favorinus "the most eminent
  sophist of his day", friend of Plutarch; Favorinus and Diocles read at first hand; Nietzsche 1868 and "rashly"; decrees, epitaphs,
  epistles, wills of six philosophers; the scholia possibly his; Usener's "Hiat oratio …" on x. 74 (the "our translation" is
  accurate); Herbert Richards's ἀρετῶν; the Homer line inserted by some editors, absent from the manuscripts and unknown to the
  scholiasts; Traversari of Camaldoli, pupil of Chrysoloras, finished 1431; the Aldine of 1497; Basel 1533 (Froben and Episcopius)
  from a poor interpolated manuscript identified by Von der Mühll; Stephanus 1570 with a revised Latin version; neglect after
  Meibom; Cobet's Didot text (Paris 1850), a great advance with no reasons given; B dated about 1200, scribe "knew no Greek"; P
  "probably … circa 1300"; F Laur. 69.13; shared errors from one archetype; Von der Mühll's single copy found at Constantinople about
  the ninth century; Usener's *Epicurea* 1887; von Arnim and Diels; Meineke and the Anthology; Hicks's eclectic text based largely
  on the Didot. Title page: London, William Heinemann; New York, G. P. Putnam's Sons; MCMXXV.
- **Wikipedia (source 1):** Sextus c. 200 and Sopater c. 300; first half of the third century; "Laertius Diogenes" in the
  manuscripts, "Diogenes Laertius" much rarer; Laerte; the ten books; end of Book 7 lost in all manuscripts; chief authorities
  Favorinus and Diocles; B 12th c. at Naples, P 11th/12th c., F 13th c. at the Laurentian; Long's rejection of Hicks on B's scribe;
  titles added in P by a later hand; 1472 Rome; 1497 Aldine; 1533 Froben; 1570 Estienne; Meibom 1692 and the numbered sections; Long
  1964 first critical edition; Marcovich 1999–2002 with Gärtner's indexes; Yonge 1853 "more literal" but with "many inaccuracies";
  Montaigne; Usener "complete ass" (*asinus germanus*); Jaeger "that great ignoramus"; Long's "importance out of all proportion to
  his merits"; partial rehabilitation since the late twentieth century.
- **Dorandi summary (source 23):** "a hundred or so manuscripts"; B, P, F "datable between the end of the eleventh century and the
  thirteenth century"; two excerpt collections in a twelfth-century Vatican manuscript and one at Vienna "written and dated 28 July
  925"; P = Paris gr. 1759, 11th/12th c., "Written at Constantinople by two contemporary anonymous hands".
- **Todd (source 24):** Long's OCT "discredited"; Marcovich reports B, P, F and the Magnum Excerptum exhaustively; Vol. II has a
  Photius fragment, Suda excerpts and the "Magnum Excerptum", "a biographical compendium based on Diogenes"; the περιών / περιιών
  discussion as told.
- **McConnell (source 12):** Hicks largely used the 1850 Didot text; Mensch is the first English translation of Dorandi; 556
  full-colour images; sixteen papers; Gutzwiller on the epigrams; Most on Diogenes and *Quellenforschung*.
- **Moore (source 28):** White, Cambridge 2021; both translations rely on Dorandi 2013; White's 128 departures, listed.
- **Cambridge book page (source 27):** CCTC 50; "has used the Nachlaß of Peter Von der Mühll, for the first time in its entirety".
- **Wilson record (source 26):** Long, 2 vols, Oxford, Clarendon Press, 1964; JHS 85 (1965) 185–186.
- **LSJ κολοφών (source 20):** "summit, top, finishing"; κολοφῶνα ἐπιτιθέναι "put the finishing touch to".
- **Montaigne (source 22):** II.10 "Of Books": "I am very sorry we have not a dozen Laertii".
- **Perseus TEI headers (source 25):** Hicks, Harvard University Press and William Heinemann, 1925, two volumes, as the edition note says.
