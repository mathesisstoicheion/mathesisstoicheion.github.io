# Fact-check: Plotinus (`web/src/wiki/authors/tlg2000.ts`)

Checked 2026-10-06, by a reader who did not write the article.

Method. Every `cite` source was opened with `npx tsx scripts/passage.ts tlg2000.tlg001 <ref>` (V.1.1, VI.9.1, IV.8.1, VI.9.11,
V.3.17, I.6.1, I.6.8, I.6.9, IV.4.28–30, IV.7.8, and the file header) and read against each sentence that points to it. The *Life of
Plotinus* was read word for word in the full text of both Internet Archive scans the article cites: Volkmann's Greek
(`plotinienneadesp00plot_djvu.txt`) and MacKenna's *Ethical Treatises* (`ethicaltreatises01plot_djvu.txt`). Every `url` source was
fetched: the two Stanford entries on Plotinus (Gerson, Fall 2024 archive; Kalligas 2024), Emilsson's *Porphyry*, Wildberg's
*Neoplatonism*, Adamson's *Theology of Aristotle*, Celenza's *Ficino*, Wright's Eunapius on tertullian.org, Goulet-Cazé's article in
*Revista Archai* (PDF), Zamora Calvo's article in *Synthesis* (PDF), BMCR 2021.12.07, the Glasgow Incunabula page, Wikipedia
*Enneads* and *List of editiones principes in Greek* (as wikitext), the Classical Review page (metadata), the Internet Archive record of
*Plotini Opera* vol. 1, the Patras library record, and the LSJ entries κρᾶσις and βράσις on Perseus. The TEI header in
`pipeline/.cache/corpus/first1k/data/tlg2000/tlg001/tlg2000.tlg001.1st1K-grc1.xml` was read. The researcher's log
(`pipeline/drafts/checked/tlg2000.md`) was read but not relied on.

Totals: **9 findings**. No misquotation was found: every Greek quotation from the Scroll matches `passage.ts`, every Greek quotation
from the *Life* matches Volkmann's scan (allowing for the scan's OCR slips), and every MacKenna and Wright quotation matches the
scans word for word. The real problems:
- A footnote points to MacKenna for "his twenty-eighth year", but MacKenna's translation says "At twenty".
- "Porphyry stayed some five years" cites the *Life*, but Porphyry himself says six.
- "The missing pages survive only because Eusebius quoted them" ignores the Arabic version, which the article itself (and its
  sources) say preserves most of them.
- Armstrong's Loeb dates: both dates the article offers are off. The volumes appeared 1966–88.
The rest are dropped qualifications and one late report told as plain fact.

---

## 1. MacKenna, cited for "his twenty-eighth year", actually says "At twenty"
- **Claim:** "In his twenty-eighth year he turned to it at Alexandria, but came back from the lectures of the famous teachers there sad
  and discouraged.[^3,4,2]"
- **Problem:** Source 4 (MacKenna's translation of the *Life*) gives a different age. The Greek (source 3) and Kalligas (source 2)
  support "twenty-eighth year". MacKenna (source 4) is right only for the second half of the sentence (sad and discouraged). The
  researcher's log says "MacKenna is not cited for the age", but the footnote does cite him for this sentence.
- **Evidence:** MacKenna, *Life* 3 (`ethicaltreatises01plot_djvu.txt`): "At twenty he was caught by the passion for philosophy: he
  was directed to the most highly reputed professors to be found at Alexandria; but he used to come from their lectures saddened and
  discouraged." Volkmann's Greek (`plotinienneadesp00plot_djvu.txt`): «εἰκοστὸν δὲ καὶ ὄγδοον ἔτος αὐτὸν ἄγοντα ὁρμῆσαι ἐπὶ
  φιλοσοφίαν». Kalligas: "at the age of 28".
- **Suggested fix:** "In his twenty-eighth year he turned to it at Alexandria,[^3,2] but came back from the lectures of the famous
  teachers there sad and discouraged.[^3,4]"
- **Confidence:** high

## 2. "Some five years" cites the *Life*, where Porphyry says six
- **Claim:** "Porphyry stayed some five years, until Plotinus saw that he was thinking of killing himself and sent him away to Sicily,
  in 268.[^4,7]"
- **Problem:** Emilsson (source 7) does say "some five years", and so does Kalligas (source 2, not cited here). But source 4, the
  *Life*, has Porphyry counting six years: "this year and five more", which he then calls "these six years". The modern "five" comes
  from 263 to 268; Porphyry's "six" counts inclusively. As it stands, the footnote makes the *Life* say something it does not say.
- **Evidence:** MacKenna, *Life* 5: "After coming to know him I passed six years in close relation with him." Volkmann's Greek:
  «συγγεγονὼς δὲ αὐτῷ τοῦτό τε τὸ ἔτος καὶ ἐφεξῆς ἄλλα ἔτη πέντε … ἐν δὴ τοῖς ἓξ ἔτεσι τούτοις». Emilsson: "In Rome he stayed for
  some five years". Kalligas: "lived with him for a period of roughly five years".
- **Suggested fix:** "Porphyry stayed some five years (six, as he counts them),[^7,2,4] until Plotinus saw that he was thinking of
  killing himself and sent him away to Sicily, in 268.[^4,7]"
- **Confidence:** high

## 3. The lost pages of IV.7 survive in the Arabic version too, not "only" through Eusebius
- **Claim:** "The missing pages survive only because Eusebius quoted them in his *Preparation for the Gospel*, and modern editions print
  them as chapters 8¹–8⁵.[^6]"
- **Problem:** Only the *Greek* text survives solely through Eusebius. Goulet-Cazé (source 6), following Kraus, sets out that the
  Arabic *Theology of Aristotle* preserves most of the missing passage (all but its first ten lines) and the start of the chapter on
  entelechy. Adamson (source 20) says the same: the Arabic has the section that all the Greek manuscripts lack. The article's own
  transmission section says the Arabic "helps to restore the lost pages of IV.7", so the two sentences contradict each other. A smaller
  point: the gap begins inside chapter 8 itself (at line 28) and runs to near the end of 8⁵. So the missing text is not exactly
  "chapters 8¹–8⁵".
- **Evidence:** Goulet-Cazé, *Archai* 5, p. 19–21: the gap runs "a partir de IV 7, 8. 28 até 8⁵. 49"; the *Pseudo-Teologia* "nos
  conservou … a maior parte da perícope B (faltam apenas as 10 primeiras linhas) e o começo da C". Adamson, SEP: "all our Greek
  manuscripts lack a section (at Enn. IV.7.8) from the Enneads that is transmitted indirectly by Eusebius, but is found in the
  Arabic translation (in chapter three of the Theology)."
- **Suggested fix:** "The Greek of the missing pages survives only because Eusebius quoted them in his *Preparation for the Gospel*,
  and most of them are also reflected in the Arabic *Theology of Aristotle*; modern editions print them as the end of chapter 8 and
  chapters 8¹–8⁵.[^6,20]"
- **Confidence:** high

## 4. Armstrong's Loeb appeared 1966–88; neither date range the article gives is right
- **Claim:** (editions) "A. H. Armstrong, *Plotinus*, 7 vols (Loeb Classical Library 440–445 and 468, Harvard University Press;
  1966–89 by a library record, 1968–88 in the Stanford Encyclopedia).[^31,2]" Timeline: "Armstrong's Loeb edition and translation
  begins to appear (1968 in the Stanford Encyclopedia)".
- **Problem:** Both Stanford entries give "1968–88". The Patras record gives "1966–1989" (it is a record of the e-book set, so the
  last date is probably a reprint). Independent evidence fixes both ends. Vol. I came out in 1966: Zamora Calvo (source 8) cites
  "Armstrong, A. H. (1966) Plotinus: Enneads, vol. I", and the Patras range starts in 1966. The last volume, LCL 468, came out in
  1988. Offering readers two ranges, each with one wrong end, is worse than giving the right one.
- **Evidence:** Zamora Calvo, bibliography: "Armstrong, A. H. (1966) Plotinus: Enneads, vol. I, Cambridge, Mass." Olomouc University
  Library record (https://library.upol.cz/arl-upol/en/detail-upol_us_cat-m0078641-Ennead-VI): *Ennead VI* [6–9], Loeb Classical
  Library 468, Harvard University Press / Heinemann, **1988**. SEP (Gerson and Kalligas): "1968–88". Patras: "1966-1989".
- **Suggested fix:** Editions: "… (Loeb Classical Library 440–445 and 468, Harvard University Press, 1966–88).[^31,8]" Add the Olomouc
  record as a source for 1988 if wanted. Timeline: "Armstrong's Loeb edition and translation begins to appear (1966–88)",
  `src: [31, 8]`.
- **Confidence:** medium-high

## 5. The last words are a report passed on by Eustochius, told here as plain fact
- **Claim:** "In Stephen MacKenna's translation, his last words were: “I have been a long time waiting for you; I am striving to give
  back the Divine in myself to the Divine in the All.”[^4]"
- **Problem:** Porphyry was in Sicily. He gives the last words, in the same sentence as the snake, on Eustochius' word alone. The
  article puts the snake under {legend} but tells the words as plain fact. Its own source 8 reports Schwyzer's warning that the
  pupils probably shaped the final words into a legend, as with Apollo's oracle.
- **Evidence:** MacKenna, *Life* 2: "Of Plotinus' last moments Eustochius has given me an account … I myself was at Lilybaeum at the
  time". Zamora Calvo, p. 3: "Schwyzer (1976: 97) aboga por la prudencia: probablemente … sus discípulos modelaron las palabras finales
  en forma de leyenda".
- **Suggested fix:** "As Eustochius later told Porphyry, his last words were, in Stephen MacKenna's translation: “I have been a long
  time waiting for you; I am striving to give back the Divine in myself to the Divine in the All.”[^4,8]"
- **Confidence:** medium

## 6. "Argument with an unnamed opponent": Kalligas says "dialogue with an unnamed interlocutor", and only "sometimes"
- **Claim:** "his treatises move by association, like an inner monologue or an argument with an unnamed opponent.[^2]"
- **Problem:** Kalligas hedges twice: the associative structure is "often" there, and only "sometimes" does it feel like a monologue
  or a dialogue. He also speaks of an "interlocutor", not an "opponent". The article drops the hedges and makes the partner hostile.
- **Evidence:** Kalligas, SEP §1: "Plotinus' authorial style often exhibits an associative structure, with frequent repetitions and
  labyrinthine interconnections, where we sometimes have the feeling of witnessing the oral expression of an internal monologue or
  even a live dialogue with an unnamed interlocutor".
- **Suggested fix:** "his treatises often move by association, and sometimes read like an inner monologue or a live dialogue with an
  unnamed interlocutor.[^2]"
- **Confidence:** medium

## 7. Gerson's "in their formative periods" dropped
- **Claim:** "For Christian, Muslim and Jewish thinkers alike he was the main source for their understanding of Platonism.[^1]"
- **Problem:** Gerson limits this to the formative periods of the three theological traditions. Without that limit, the sentence
  claims it for all times.
- **Evidence:** Gerson, SEP §6: "The theological traditions of Christianity, Islam, and Judaism all, in their formative periods, looked
  to ancient Greek philosophy … Plotinus was the principal source for their understanding of Platonism."
- **Suggested fix:** "In the formative periods of Christian, Muslim and Jewish theology, he was the main source for their
  understanding of Platonism.[^1]"
- **Confidence:** medium

## 8. Porphyry dates the birth by Severus' reign; "204 or 205" is the modern conversion
- **Claim:** "Porphyry worked out the year of his birth, 204 or 205, by counting back sixty-six years from his death.[^4,1]"
- **Problem:** Porphyry gives no AD year. He counts back to "the thirteenth year of Severus". The conversion to 204/5 is modern
  (Gerson, source 1). The sentence puts a modern date into Porphyry's mouth.
- **Evidence:** MacKenna, *Life* 2: "Counting sixty-six years back from the second year of Claudius, we can fix Plotinus' birth at the
  thirteenth year of Severus". Volkmann: «εἰς τὸ τρισκαιδέκατον ἔτος τῆς Σευήρου βασιλείας πίπτει».
- **Suggested fix:** "Porphyry worked out the year of his birth by counting back sixty-six years from his death, to the thirteenth year
  of the emperor Severus: 204 or 205 by our reckoning.[^4,1]"
- **Confidence:** medium (the meaning is right; the attribution is loose)

## 9. "One of the most argued-over sentences" is Glenn Most's judgement, quoted by Zamora Calvo
- **Claim:** "The Greek behind them is one of the most argued-over sentences in later Greek literature (see *Where editors
  disagree*).[^8]"
- **Problem:** Zamora Calvo does not say this himself. He quotes Most (2003). Unattributed, a single scholar's superlative reads as
  established fact.
- **Evidence:** Zamora Calvo, p. 2: "El pasaje de las últimas palabras … es considerado por Most (2003: 576) uno “de los más
  controvertidos en la literatura griega posterior”."
- **Suggested fix:** "The Greek behind them has been called one of the most controversial passages in later Greek literature (see
  *Where editors disagree*).[^8]"
- **Confidence:** low-medium

---

## Verified and found correct
- **Greek from the Scroll** (`passage.ts`): V.1.1 title and opening («Τί ποτε ἄρα … ἐπιλαθέσθαι»); VI.9.1 opening; IV.8.1 opening;
  VI.9.11 end («φυγὴ μόνου πρὸς μόνον», life of gods and godlike men); V.3.17 end («ἄφελε πάντα»); I.6.1 opening, with words, music,
  ways of life and deeds; I.6.8 («φεύγωμεν δὴ φίλην ἐς πατρίδα», Circe and Calypso, not on foot, by chariot or by ship); I.6.9 (the
  statue, «μὴ παύσῃ τεκταίνων τὸ σὸν ἄγαλμα», the sunlike eye); IV.4.28 «θηρία πρὸς τὰς κράσεις» in the passage on anger. The
  article's own translations match the Greek.
- **The Scroll's IV.7.8** runs about 21,000 characters (its neighbours about 3,000). After «σωφροσύνη καὶ δικαιοσύνη» it continues
  «ἀνδρεία τε καὶ ἄλλαι», which is Eusebius' text, and ends at «καθ' ὅσον ἂν αὐτοῦ μεταλαμβάνῃ», where chapter 9 of modern editions
  begins. So "one very long chapter 8" is right. IV.4.30 begins a new chapter, as the Eustochius note requires.
- **TEI header:** Volkmann, Teubner, Leipzig, 1883–1884, with the two Internet Archive links. Volkmann's vol. 1 title page has the
  exact title given in the editions list.
- **The *Life* (Volkmann's Greek and MacKenna's English, word for word):** ἐῴκει μὲν αἰσχυνομένῳ, ὅτι ἐν σώματι εἴη; family,
  parents, homeland; the painter, "Is it not enough to carry about this image in which nature has enclosed us?", "an image of the
  image"; τοῦτον ἐζήτουν (the OCR reads ἐξήτουν) and "This was the man I was looking for."; eleven years with Ammonius; "to
  investigate the Persian methods and the system adopted among the Indians"; age 39, Gordian killed in Mesopotamia, Antioch; Rome at
  forty; ten years without writing; writing from about the first year of Gallienus; 21 treatises when Porphyry came; *On Beauty* first
  in the chronological list; "as though he were copying from a book", weak sight, spelling; children left in his care; 26 years, no
  enemy; the Egyptian priest in the Iseum ("none of the lower degree but a God"); "It is for those Beings to come to me, not for me to
  go to them."; Porphyry's thoughts of suicide and Sicily; Platonopolis (rebuild a ruined city of philosophers in Campania, Plato's
  laws, jealousy at court); "In style Plotinus is concise, dense with thought, terse, more lavish of ideas than of words"; four
  unions; revision entrusted to Porphyry, arrangement by subject after Andronicus, six sets of nine, easiest first, three sections
  (I–III, IV–V, VI); illness (hoarse voice, dim sight, friends avoiding him), Zethus' estate, Eustochius from Puteoli; the last words in
  MacKenna; the snake; only Eustochius present; Volkmann's φήσας πειρᾶσθαι τὸ ἐν ἡμῖν θεῖον ἀνάγειν πρὸς τὸ ἐν τῷ παντὶ θεῖον.
- **MacKenna's note on the text:** Volkmann (Teubner, Leipzig, 1883); Creuzer's three-volume Oxford edition of 1835. The Internet
  Archive copy is Boston, C. T. Branford, 1918.
- **Eunapius (Wright):** "Lyco they call it"; "his books are in the hands of educated men, more so than the dialogues of Plato".
- **Gerson (SEP 2018):** 204/5–270; "generally regarded as the founder of Neoplatonism"; the term is early 19th century; he saw himself
  as a Platonist; 28, Ammonius, 243, Rome 245; Porphyry in 263, 21 treatises; guardian of children; a possible edition by Eustochius,
  all traces lost; division into treatises; One, Intellect, Soul; the One simple and indescribable; thinking complex; emanation not a
  temporal process; Soul as desire for external objects, plants and food; the external activity of Soul is nature; *On Beauty* the first
  treatise, beauty as form and images of the Forms, "dimly recognize its paradigm"; Ficino 1492; Colet, Erasmus, More, Cambridge
  Platonists, Hegel; Dillon's abridged MacKenna (Penguin 1991); Gerson 2018 and its translators.
- **Kalligas (SEP 2024):** native of Egypt; 28; eleven years; Gordian 243; "late in 244"; writing began ten years after arrival, at
  about fifty; the *sunousiai* (commentaries read, difficulties, his own analysis); readers expected to know Plato and Aristotle; recent
  sources almost never named; arrangement criticised as artificial; chronological table *VP* 4–6, some recent editors follow it;
  editio minor Oxford 1964–82 "the standard critical edition"; editio maior Brussels and Paris 1951–73 with the full account of the
  readings; Gerson 2018 "most recent English translation with no Greek facing text"; Kalligas' commentary (Princeton 2014, 2023; first
  in Greek by the Academy of Athens).
- **Emilsson:** Porphyry in Rome 263, Sicily 268 on Plotinus' advice, edition with the *Life* in 301.
- **Wildberg:** Ammonius Saccas; Augustine "intimately familiar with the writings of Plotinus and Porphyry".
- **Adamson:** Plotinus in Arabic in the ninth century; the *Theology* under Aristotle's name, influential in the Arabic-speaking world;
  extant material only from Enneads IV–VI.
- **Celenza:** Ficino's "first full Greek to Latin translation of Plotinus's works along with commentary". **Glasgow:** Florence,
  Antonio di Bartolommeo Miscomini, 7 May 1492, with Ficino's commentary.
- **Wikipedia:** Perna, Basel, 1580, with Ficino's Latin; Porphyry split and joined texts to make 54; *ennea*; the chronological numbers
  I.6 [1], III.8 [30], V.8 [31], V.5 [32], II.9 [33].
- **Goulet-Cazé:** Eunapius' exaggerations with a basis in fact, early fifth century; Eusebius quotes V.1 and IV.7 (PE XI 17, XV 10,
  22), written 312–322; the scholion at IV.4.29.55 in manuscripts of three main families (w, x, y), its wording and meaning (third
  book beginning at ch. 30, chapters 30–45 in IV.4 in Porphyry's edition); Henry's theory of a Eustochian edition, and her own view,
  after Kraus and Schwyzer, that the gap is a mechanical accident in the Porphyrian tradition; the gap after σωφροσύνη καὶ δικαιοσύνη
  running on to words that make no sense; J, M, V patched part of it from Eusebius; the archetype "sem dúvida" part of the
  "Philosophical Collection" copied at Constantinople; the Arabic text older than the archetype (D'Ancona) and useful with Eusebius;
  IV.3–IV.4 one treatise cut mid-sentence (Schwyzer's argument); Harder 1936 "provou" that III.8, V.8, V.5, II.9 were one treatise.
- **Zamora Calvo:** the readings τὸ ἐν ἡμῖν θεῖον (traditional, in every edition after Perna and before Henry 1953) and τὸν ἐν ὑμῖν
  θεόν (marked as a variant in A, E and R; printed by Perna 1580; adopted by Henry 1953 reading the infinitive as an imperative;
  printed in H–S's editio minor 1964; accepted by Armstrong 1966); the three addressees (all pupils, Eustochius alone, all humanity);
  Eustochius pupil and doctor; the snake as an image of the soul leaving the body. (Small detail: R has the variant above the line,
  not in the margin. Not worth a change.)
- **BMCR 2021.12.07 (Smith):** no reliable Greek text before H–S; maior 1951–73, minor 1964–82; Henry's search from 1932 at 26;
  Zürich, four months each summer over nearly thirty years, photocopies of the ten major manuscripts; Page revised MacKenna;
  Schwyzer's κράσεις → βράσεις at IV.4.28, "angry if you prefer Bréhier", Armstrong's "long and apologetic footnote".
- **Classical Review 34.2 (1984) 221–222:** H. J. Blumenthal's review of OCT vol. III, Oxford University Press, 1982. **Internet
  Archive:** *Plotini Opera* vol. 1, Henry and Schwyzer, L'Édition Universelle, 1951. **Patras:** Loeb 440–445 and 468, Harvard.
  **LSJ (Perseus):** κρᾶσις "mixing, blending"; βράσις "boiling".
