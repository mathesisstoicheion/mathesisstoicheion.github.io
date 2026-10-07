/**
 * The New Testament. Checked on 2026-10-06 (notes: pipeline/drafts/checked/tlg0031.md). Left out because nothing
 * reliable could be opened, or the sources disagree too much: exact counts of papyri, majuscules, minuscules and
 * lectionaries ("some 140 papyri, around 320 majuscules, about 2,900 minuscules, some 2,400 lectionaries": only the
 * round total of more than 5,800 Greek manuscripts is kept); "several hundred thousand variants"; Galatians as one of
 * Paul's earliest letters; the Editio Critica Maior "begun in 1997"; the claim that Hebrews opens with a period like
 * Luke's; the Alexandrian / Western / Byzantine text types as a scheme (only Codex Bezae as the chief Greek witness
 * of the "Western" text is kept); Aland and Aland's *The Text of the New Testament* and the UBS fifth edition's own
 * pages (no page about them would open); the Menander line in 1 Corinthians 15:33 (the Scroll's Greek and English
 * are misaligned there); the Muratorian fragment's date (sources range from about 170 to the late fourth century).
 */
import type { AuthorArticle } from "../author-articles";

export const newTestament: AuthorArticle = {
  id: "tlg0031",
  summary: `The New Testament is a collection of twenty-seven Christian books written in Greek: four gospels, the Acts of the Apostles, a set of letters, most of them under the name of Paul, and the Book of Revelation.[^1] Its Greek name, Ἡ Καινὴ Διαθήκη, means the "new covenant" (διαθήκη could mean a will or testament, or a covenant, and the Greek Old Testament often uses it in the sense of covenant). In Luke, Jesus calls the cup after supper «ἡ καινὴ διαθήκη ἐν τῷ αἵματί μου», “the new covenant in my blood” (words that Westcott and Hort, whose Greek the Scroll prints, set in double brackets as doubtful).[^2,3] The books were written by several authors, most of them in the first century; some scholars date a few of them well into the second, and there is no agreement on the date of the latest.[^1] Bart Ehrman, for one, puts all twenty-seven between about AD 50 and 120.[^1]

### Who wrote what, and when

The oldest books are Paul's letters. Most scholars date 1 Thessalonians, probably the earliest of them and the earliest Christian writing that survives, to AD 49–51.[^4] Seven letters under Paul's name are accepted as his own by a near consensus of scholars: Romans, 1 and 2 Corinthians, Galatians, Philippians, 1 Thessalonians and Philemon. Six more (Ephesians, Colossians, 2 Thessalonians, 1 and 2 Timothy, and Titus) are disputed.[^1] The Letter to the Hebrews names no author, and modern scholars generally reject the old idea that Paul wrote it.[^1]

{debated} The gospels do not name their authors either. The names Matthew, Mark, Luke and John come from church tradition and were attached to them by the middle of the second century.[^1] Most scholars think Mark was written first, around AD 70, and that Matthew and Luke used it.[^5,1] Matthew and Luke are usually dated about 80–90, and so is Acts, which is by the same author as Luke, though some scholars date Acts much later. John is put about 90–100, and Revelation about 95.[^6,7,8,9,10]

Papias of Hierapolis, who lived about 60–130,[^6] passed on what "the Presbyter" used to say: that Mark, «ἑρμηνευτὴς Πέτρου γενόμενος», "Peter's interpreter", “wrote accurately all that he remembered, not, indeed, in order”.[^11] Irenaeus, bishop of Lyon, writing around 180,[^1] calls Mark “the disciple and interpreter of Peter” and Luke “a follower of Paul”. He dates the vision of Revelation “towards the end of the reign of Domitian”, who was emperor from 81 to 96.[^12,10]

### Four kinds of book

The gospels tell the life, death and resurrection of Jesus. Their name translates εὐαγγέλιον, "good news".[^1,2] Acts carries Luke's story on, following the apostles after Jesus' death.[^1] The letters are real letters, often dictated: several of them show that Paul used a secretary, a common practice in the Greco-Roman world, and in one the secretary gives his name.[^13] At the end of Romans the secretary sends his own greeting: «ἀσπάζομαι ὑμᾶς ἐγὼ Τέρτιος ὁ γράψας τὴν ἐπιστολὴν ἐν κυρίῳ», “I, Tertius, who write the letter, greet you in the Lord.”[^14] At the end of Galatians Paul takes the pen himself: “See with what large letters I write to you with my own hand.”[^15] Revelation is the only apocalypse in the New Testament; its title is its first word, ἀποκάλυψις, a "revelation" or "unveiling".[^10]

### The common Greek

None of it is written in the Attic Greek of Plato and Demosthenes. It is Koine, from ἡ κοινὴ διάλεκτος, “the common dialect”: the Greek that spread with the conquests of Alexander the Great and became the shared language of the eastern Mediterranean.[^16] Its grammar is simpler than Attic. The dual number (the special forms for "two") has gone, the optative is rarer, the word ἵνα ("that") takes on new jobs, and sentences start with καί ("and") more often, partly under the influence of Hebrew and Aramaic.[^17] The writers knew the Septuagint, the Greek translation of the Hebrew Bible begun in the third century BC, and follow it for over half of their quotations from the Old Testament.[^16] Words of Jesus' own language, Aramaic, are kept and then translated: «Ταλειθά κούμ, ὅ ἐστιν μεθερμηνευόμενον Τὸ κοράσιον, σοὶ λέγω, ἔγειρε», which in the Scroll's English is “Young lady, I tell you, get up.”[^18,19]

Much of it reads easily. John begins (the edition prints the first words in capitals): «ΕΝ ΑΡΧΗ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος», “In the beginning was the Word, and the Word was with God, and the Word was God.”[^20] But the writers sound very different. Mark often tells past events in the present tense, the "historical present": 151 times in the whole gospel.[^16] «Καὶ εὐθὺς τὸ πνεῦμα αὐτὸν ἐκβάλλει εἰς τὴν ἔρημον» is, word for word, “and at once the Spirit drives him out into the desert” (our translation); the Scroll's English has “Immediately the Spirit drove him out into the wilderness.”[^21] Mark's favourite word is that εὐθύς, "straightway, forthwith" in the dictionary:[^2] in the Scroll's Greek it comes 41 times in Mark, and only 12 times in all the other books together (our count).[^22]

Luke, by contrast, opens with one long, carefully built sentence, “Since many have undertaken to set in order a narrative concerning those matters which have been fulfilled among us”, and so on for four verses.[^23] The scholar Robert J. Karris calls it “finely crafted, periodic Greek”, and its first word, ἐπειδήπερ ("since indeed"), occurs nowhere else in the New Testament or the Septuagint.[^24,23] Scholars of Greek judge the Letter to the Hebrews the most polished and eloquent writing in the New Testament.[^25]

Revelation goes the other way. Its greeting wishes grace and peace «ἀπὸ ὁ ὢν καὶ ὁ ἦν καὶ ὁ ἐρχόμενος», “from the one who is and who was and who is to come” (our translation).[^26] After ἀπό, "from", Greek usually puts the genitive case,[^2] but here come three nominatives. Daniel Wallace called it “the first and worst grammatical solecism in Revelation” (a solecism is a break with the rules of grammar), yet he classes the words as a title kept in the nominative. Bill Mounce, quoting him, argues that the irregularity is deliberate: the words echo God's name in Exodus 3:14 and are kept unchanged as a title. Some scribes smoothed the grammar by adding θεοῦ, "God", after ἀπό.[^27] The Scroll's English follows such a text: “from God, who is and who was and who is to come”.[^26]

The writers knew Greek poetry too. In Acts, Paul tells the Athenians what “some of your own poets have said”: «Τοῦ γὰρ καὶ γένος ἐσμέν», “For we are also his offspring.”[^28] The words open the fifth line of Aratus' poem *Phaenomena*,[^29] where the poet uses the epic form of "we are", «τοῦ γὰρ καὶ γένος εἰμέν»; Acts has the everyday ἐσμέν.[^30,2]

### From many books to one

In the first Christian centuries there was no single agreed list of books.[^1] Around 140 Marcion accepted only a version of Luke and ten of Paul's letters, and around 180 Irenaeus argued that there must be exactly four gospels.[^1] Around 300 the historian Eusebius of Caesarea sorted the books by how widely they were accepted.[^1] First come “the holy tetrad of the Gospels”, then Acts, Paul's letters, 1 John and 1 Peter: these are «ἐν ὁμολογουμένοις», among the “Recognized Books”. James, Jude, 2 Peter and 2 and 3 John are «τῶν δ’ ἀντιλεγομένων», among the “Disputed Books which are nevertheless known to most”. Revelation he put in both groups.[^31] The first list that matches today's twenty-seven exactly is in the Easter letter that Athanasius, bishop of Alexandria, sent to his churches in 367.[^1,32] He calls the books “fountains of salvation”.[^32] A council at Hippo in North Africa in 393 may have been the first to accept it, and councils at Carthage in 397 and 419 did so too.[^1]

### Why read it in Greek

{debated} Its Greek is unlike the literary Greek of its day, and scholars explain this in two ways. Some think the writers, nearly all Jews steeped in the Septuagint, wrote a Jewish Greek coloured by Aramaic and Hebrew. Others point out that the literary men of the time imitated old Attic, while the New Testament is close to the spoken Greek of private letters, receipts and petitions found on papyrus in Egypt.[^1]

The New Testament has come down in an enormous number of copies: more than 5,800 Greek manuscripts of the New Testament survive, with some 10,000 in Latin and thousands more in other languages.[^1] Bruce Metzger, writing in 1992, set beside this the *Iliad*, preserved in 457 papyri, 2 uncial and 188 minuscule manuscripts.[^33]

The Scroll pairs Westcott and Hort's Greek text of 1881, which leans heavily on Codex Vaticanus and Codex Sinaiticus,[^34,35] with the World English Bible, which was “edited to conform to the Greek Majority Text New Testament where there are significant differences in manuscripts”.[^36] So now and then the two columns disagree (see *Where editors disagree*).`,

  timeline: [
    { year: 50, approx: true, kind: "writing", what: "Paul writes 1 Thessalonians (usually dated 49–51), the earliest surviving Christian text", src: [4] },
    { year: 70, approx: true, kind: "writing", what: "The Gospel of Mark, probably the first gospel, around 70", certainty: "debated", src: [5] },
    { year: 85, approx: true, kind: "writing", what: "Matthew, Luke and Acts, usually dated 80–90 (Acts later by some)", certainty: "debated", src: [6, 7, 8] },
    { year: 95, approx: true, kind: "writing", what: "Revelation, commonly dated about 95; John's gospel about 90–100", certainty: "debated", src: [10, 9, 12] },
    { year: 140, approx: true, kind: "reception", what: "Marcion's list: a version of Luke and ten letters of Paul", src: [1] },
    { year: 180, approx: true, kind: "reception", what: "Irenaeus argues that there are exactly four gospels", src: [1] },
    { year: 200, approx: true, kind: "copy", what: "P46, a papyrus book of Paul's letters (dated 175–225)", src: [37] },
    { year: 300, approx: true, kind: "reception", what: "Eusebius sorts the books into recognized and disputed", src: [1, 31] },
    { year: 350, approx: true, kind: "copy", what: "Codex Vaticanus and Codex Sinaiticus, two of the earliest and most complete Bibles (fourth century)", src: [38, 39] },
    { year: 367, kind: "reception", what: "Athanasius' Easter letter lists the twenty-seven books", src: [1, 32] },
    { year: 1481, kind: "copy", what: "Codex Vaticanus appears in the Vatican Library's catalogue", src: [38] },
    { year: 1514, kind: "print", what: "The Greek New Testament of the Complutensian Polyglot is printed in Spain (published only in the 1520s)", src: [40] },
    { year: 1516, kind: "print", what: "Erasmus publishes the first Greek New Testament to come out (Basel, Froben)", src: [41] },
    { year: 1551, kind: "print", what: "Robert Estienne (Stephanus) numbers the verses, the numbers still used", src: [42] },
    { year: 1633, kind: "print", what: "The Elzevirs' preface gives the printed text its name, *Textus Receptus*, the received text", src: [43] },
    { year: 1859, kind: "copy", what: "Tischendorf is shown Codex Sinaiticus at St Catherine's Monastery, Sinai", src: [39] },
    { year: 1881, kind: "print", what: "Westcott and Hort's *The New Testament in the Original Greek* (the Greek in the Scroll)", src: [34, 35] },
    { year: 1935, kind: "copy", what: "Colin Roberts publishes P52, a scrap of John generally accepted as the oldest New Testament manuscript, though its date is debated", certainty: "debated", src: [44] },
    { year: 2012, kind: "print", what: "Nestle–Aland, *Novum Testamentum Graece*, 28th edition", src: [45] },
  ],

  transmission: `**Letters and papyri.** Paul's letters were circulating, perhaps already gathered into collections, by the end of the first century.[^1] No page written by the authors survives; the oldest copies are papyri found in Egypt.[^1,44,47] The Rylands fragment P52, a scrap the size of a credit card with a few lines of John 18, was published by Colin Roberts in 1935. He dated it to 100–150; a recent study proposes 125–175, and some scholars allow dates later still.[^44] P46, a papyrus book of Paul's letters among the Chester Beatty Papyri, is dated 175–225 or the early third century.[^37] The Bodmer papyri P66 (John) and P75 (Luke and John) have traditionally been dated about 200 and to the third century, though recent studies argue for dates as late as the fourth.[^46,47] Christian scribes shortened holy names such as "Jesus", "Christ" and "God" to a few letters with a line above them, the *nomina sacra* ("sacred names").[^48]

**The great codices.** Codex Vaticanus and Codex Sinaiticus, of the fourth century, are among the earliest surviving Christian Bibles, written as codices, the forerunner of the modern book.[^1,39] Codex Vaticanus (B) has been in the Vatican Library since at least the fifteenth century and is in its catalogue of 1481; it breaks off in Hebrews 9:14 and lacks the letters to Timothy, Titus and Philemon, and Revelation.[^38] Codex Sinaiticus (ℵ), the oldest complete copy of the New Testament, came to light at St Catherine's Monastery on Sinai: Constantin von Tischendorf first saw leaves of it in 1844 and was shown the codex in 1859. In 1933 the Soviet Union sold most of it to the British Museum, and it is now British Library Add MS 43725.[^39] Its surviving leaves, divided among four institutions, have been photographed and transcribed by the Codex Sinaiticus Project.[^49] The Scroll includes a transcription of Mark chapter 1 in Sinaiticus by the Institute for New Testament Textual Research (INTF) at Münster. In its first verse the scribe writes Jesus Christ as ΙΥ ΧΥ, with no "Son of God"; a corrector added ΥΥ ΘΥ.[^35,50,51] Codex Bezae (D), of the fifth century and now at Cambridge, is in both Greek and Latin. It is the main Greek witness of the so-called "Western" text, and its Acts is nearly 8 per cent longer than the usual text.[^52]

**Counting and translating.** More than 5,800 Greek manuscripts are known.[^1] Since Caspar René Gregory's catalogue of 1908 they are sorted into four groups: papyri, uncials (written in capitals), minuscules (in small letters) and lectionaries.[^33] As Christianity spread, the books were translated into Latin, Syriac and Coptic.[^1] The Scroll has Mark chapter 1 in Sahidic Coptic, from Coptic SCRIPTORIUM.[^35]

**Print.** The first Greek New Testament to be printed was the one in the Complutensian Polyglot, a many-language Bible made at Alcalá in Spain, printed in 1514; it was not published until 1520 and distributed until 1521.[^40] Erasmus' edition, printed by Johann Froben at Basel, came out first, in 1516; it was rushed through the press and full of mistakes.[^41] For the last six verses of Revelation, missing from his manuscript, Erasmus translated the Latin back into Greek.[^41,43] Robert Estienne (Stephanus) numbered the verses in his edition of 1551, and his numbering is the one used today, the Scroll's included.[^42] The Elzevir printers' preface of 1633 offered the reader *textum … nunc ab omnibus receptum*, the text “now received by all”, and so this printed tradition got its name, the *Textus Receptus*.[^43] Westcott and Hort's *The New Testament in the Original Greek* (1881) relied heavily on Vaticanus and Sinaiticus, and later critical editions mostly share their preferences.[^34] Eberhard Nestle published his first Greek New Testament in 1898; its 28th edition (2012), edited by the INTF, has the same Greek text as the fifth edition of the United Bible Societies' *Greek New Testament* (2014).[^45] The INTF's *Editio Critica Maior*, meant to use every known manuscript, is to be completed by 2030; for the Catholic Letters (the seven letters of James, Peter, John and Jude) its text is already followed by both.[^51,45]`,

  variants: `**How Mark ends.** Mark's story breaks off at 16:8 with the women at the empty tomb: «οὐδενὶ οὐδὲν εἶπαν, ἐφοβοῦντο γάρ», “They said nothing to anyone; for they were afraid.”[^53] The two oldest complete manuscripts of Mark, Sinaiticus and Vaticanus, end there, and Vaticanus leaves a column blank after it. Most manuscripts go on with twelve more verses (16:9–20), the "longer ending"; a few have a short summary, the "shorter ending", and some have both.[^54] Scholars almost all reject 16:9–20 as Mark's own; {debated} whether he meant to stop at 16:8, or his ending was lost, is still argued.[^54] The Scroll's Greek prints both endings between double brackets ⟦ ⟧, the shorter one headed ΑΛΛΩΣ, "otherwise"; its English gives only the longer.[^53,2]

**The woman taken in adultery.** The story of John 7:53–8:11, where Jesus says «Οὐδὲ ἐγώ σε κατακρίνω», “Neither do I condemn you.”, is not in P66 or P75, nor in Sinaiticus or Vaticanus; the first surviving Greek manuscript to have it is Codex Bezae.[^55,46] Some manuscripts place it elsewhere: after John 21:25, after Luke 21:38, or after John 7:36. There is now a broad consensus that it was added to John later.[^46] Eusebius says that Papias told a story about “a woman who was accused before the Lord of many sins”, which was also in the Gospel according to the Hebrews; whether it is this story is uncertain.[^11,46] The Nestle–Aland and UBS texts print the passage in double square brackets, and the Scroll's Greek, too, has it between ⟦ ⟧.[^46,55]

**Three witnesses in heaven.** In the King James Version, 1 John 5:7 adds “in heaven, the Father, the Word, and the Holy Ghost: and these three are one”. These words, the "Johannine Comma", are found mainly in Latin manuscripts; the earliest Greek manuscript that has them is of the fourteenth century.[^56] Erasmus left them out of his first two editions because his Greek manuscripts lacked them, and added them in 1522, after he was told of a Greek manuscript that had them.[^56] Neither the Greek nor the English in the Scroll has them.[^57]

**666 or 616?** In Revelation the number of the beast is «ἑξακόσιοι ἑξήκοντα ἕξ», “six hundred sixty-six”.[^58] Irenaeus, quoted by Eusebius, insisted that this number is “found in all the good and ancient copies”.[^12] He knew another reading, 616, but did not accept it. That number stands in Codex Ephraemi Rescriptus, and apparently in P115, a papyrus from Oxyrhynchus dated about 225–275 and one of the oldest manuscripts of Revelation.[^59,60]

**When the two columns disagree.** Because the Scroll's Greek and its English rest on different kinds of text, the reader can sometimes watch a variant happen. In Mark 1:1 the Greek has «τοῦ εὐαγγελίου Ἰησοῦ Χριστοῦ», but the English reads “The beginning of the gospel of Jesus Christ, the Son of God.” The first scribe of Sinaiticus wrote no "Son of God" there, and a corrector added it; Tommy Wasserman concludes that its omission in some manuscripts was accidental.[^61,50,62] In the next verse the Greek quotes «ἐν τῷ Ἠσαίᾳ τῷ προφήτῃ», "in Isaiah the prophet", as Vaticanus, Sinaiticus and Bezae do, while the English, “As it is written in the prophets”, follows the reading of the *Textus Receptus* and many other manuscripts.[^61,62] In Romans the closing words of praise («Τῷ δὲ δυναμένῳ ὑμᾶς στηρίξαι») stand at the end of chapter 16 in the Greek, but in the English after 14:23, “Now to him who is able to establish you”, where most Greek manuscripts, of the Byzantine tradition, put them. P46 has them at the end of chapter 15, and some manuscripts have them twice or not at all.[^63,64,65,66]`,

  editions: [
    { text: "B. F. Westcott and F. J. A. Hort, *The New Testament in the Original Greek* (1881; the Scroll's copy names the New York printing, Harper and Brothers, 1882–1892).[^34,35]", note: "The Greek text in the Scroll, a critical text that leans on Codex Vaticanus and Codex Sinaiticus." },
    { text: "M. P. Johnson (editor), *World English Bible* (Rainbow Missions; eBible.org), a public-domain revision of the American Standard Version of 1901.[^36,35]", note: "The English in the Scroll; in the New Testament it follows the Greek Majority Text where the manuscripts differ significantly." },
    { text: "Nestle–Aland, *Novum Testamentum Graece*, 28th edition (Deutsche Bibelgesellschaft, 2012); United Bible Societies, *The Greek New Testament*, 5th edition (2014).[^45]", note: "The standard critical text today, the same in both; Nestle–Aland has the fuller list of variants." },
    { text: "*Novum Testamentum Graecum: Editio Critica Maior* (Institute for New Testament Textual Research, Münster; Deutsche Bibelgesellschaft), in progress.[^51]", note: "The great edition meant to use every known manuscript; volumes for Mark, Acts, the Catholic Letters and Revelation have appeared." },
    { text: "B. M. Metzger, *A Textual Commentary on the Greek New Testament* (Stuttgart, Deutsche Bibelgesellschaft, 1994).[^67]", note: "A companion volume to the UBS *Greek New Testament* (fourth revised edition), on its choices among the variants." },
    { text: "B. M. Metzger and B. D. Ehrman, *The Text of the New Testament: Its Transmission, Corruption, and Restoration*, 4th edition (Oxford University Press, 2005).[^68]", note: "A handbook of New Testament textual criticism, revised with Ehrman as co-author." },
    { text: "Erasmus, *Novum Instrumentum omne* (Basel, Johann Froben, 1516).[^41]", note: "The first published Greek New Testament, Greek and Latin side by side." },
    { text: "The Codex Sinaiticus Project, codexsinaiticus.org.[^49]", note: "The oldest complete New Testament, photographed and transcribed online." },
  ],

  sources: [
    { label: "Wikipedia, New Testament (the 27 books; authors and dates, with Ehrman's 50–120; the seven undisputed letters; anonymous gospels; the canon from Marcion to Athanasius and the councils; language and style; manuscript numbers; early versions)", url: "https://en.wikipedia.org/wiki/New_Testament" },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entries διαθήκη, εὐαγγέλιον, εὐθύς, ἄλλως, ἀπό (“usually with Gen.”) and εἰμί (1 pl. ἐσμέν, epic and Ionic εἰμέν) (read in the site's copy; also on the Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Luke 22.20, in the Scroll", cite: { work: "tlg0031.tlg003", ref: "22.20" } },
    { label: "Wikipedia, First Epistle to the Thessalonians (dated 49–51 by a majority of scholars; the earliest extant Christian text)", url: "https://en.wikipedia.org/wiki/First_Epistle_to_the_Thessalonians" },
    { label: "Wikipedia, Gospel of Mark (dated around 70; the first gospel)", url: "https://en.wikipedia.org/wiki/Gospel_of_Mark" },
    { label: "Wikipedia, Gospel of Matthew (c. 80–90; Papias, c. 60–130)", url: "https://en.wikipedia.org/wiki/Gospel_of_Matthew" },
    { label: "Wikipedia, Gospel of Luke (c. 80–90)", url: "https://en.wikipedia.org/wiki/Gospel_of_Luke" },
    { label: "Wikipedia, Acts of the Apostles (c. 80–90; the same author as Luke)", url: "https://en.wikipedia.org/wiki/Acts_of_the_Apostles" },
    { label: "Wikipedia, Gospel of John (90–100)", url: "https://en.wikipedia.org/wiki/Gospel_of_John" },
    { label: "Wikipedia, Book of Revelation (about 95; Domitian 81–96; the title ἀποκάλυψις; the only apocalypse in the New Testament)", url: "https://en.wikipedia.org/wiki/Book_of_Revelation" },
    { label: "Eusebius, Ecclesiastical History 3.39.15–17, in the Scroll (Papias on Mark; the woman accused of many sins)", cite: { work: "tlg2018.tlg002", ref: "3.39.15", to: "3.39.17" } },
    { label: "Eusebius, Ecclesiastical History 5.8.2–6, in the Scroll (Irenaeus on the four gospels, on the number of the beast and on the date of Revelation)", cite: { work: "tlg2018.tlg002", ref: "5.8.2", to: "5.8.6" } },
    { label: "Wikipedia, Authorship of the Pauline epistles (Paul's use of secretaries)", url: "https://en.wikipedia.org/wiki/Authorship_of_the_Pauline_epistles" },
    { label: "Romans 16.22, in the Scroll", cite: { work: "tlg0031.tlg006", ref: "16.22" } },
    { label: "Galatians 6.11, in the Scroll", cite: { work: "tlg0031.tlg009", ref: "6.11" } },
    { label: "Wikipedia, Koine Greek (the common dialect; the Septuagint; quotations following the Septuagint; the historical present in Mark)", url: "https://en.wikipedia.org/wiki/Koine_Greek" },
    { label: "Wikipedia, Koine Greek grammar (differences from Attic, after J. Morwood, Oxford Grammar of Classical Greek)", url: "https://en.wikipedia.org/wiki/Koine_Greek_grammar" },
    { label: "Mark 5.41, in the Scroll", cite: { work: "tlg0031.tlg002", ref: "5.41" } },
    { label: "Wikipedia, Language of the New Testament (Mark translates Aramaic phrases, among them talitha kum)", url: "https://en.wikipedia.org/wiki/Language_of_the_New_Testament" },
    { label: "John 1.1, in the Scroll", cite: { work: "tlg0031.tlg004", ref: "1.1" } },
    { label: "Mark 1.12, in the Scroll", cite: { work: "tlg0031.tlg002", ref: "1.12" } },
    { label: "Westcott and Hort's Greek of the whole New Testament in the Scroll, counted word by word for this article (εὐθύς: 41 in Mark, 12 elsewhere; ἐπειδήπερ: once, in Luke 1.1)", cite: { work: "tlg0031.tlg002", ref: "1.1", to: "16.20" } },
    { label: "Luke 1.1–4, in the Scroll", cite: { work: "tlg0031.tlg003", ref: "1.1", to: "1.4" } },
    { label: "Wikipedia, Luke 1 (the prologue: R. J. Karris on its periodic Greek; ἐπειδήπερ not elsewhere in the New Testament or the Septuagint)", url: "https://en.wikipedia.org/wiki/Luke_1" },
    { label: "Wikipedia, Epistle to the Hebrews (its Greek judged the most polished in the New Testament)", url: "https://en.wikipedia.org/wiki/Epistle_to_the_Hebrews" },
    { label: "Revelation 1.4, in the Scroll", cite: { work: "tlg0031.tlg027", ref: "1.4" } },
    { label: "Bill Mounce, “Who was, and Is, and Is to come” (Rev 1:4), Mondays with Mounce, Zondervan Academic (quoting D. B. Wallace's grammar)", url: "https://zondervanacademic.com/blog/who-was-and-is-and-is-to-come-rev-14-mondays-with-mounce" },
    { label: "Acts 17.28, in the Scroll", cite: { work: "tlg0031.tlg005", ref: "17.28" } },
    { label: "Wikipedia, Aratus (Paul quotes the fifth line of the Phaenomena in Acts 17:28)", url: "https://en.wikipedia.org/wiki/Aratus" },
    { label: "Aratus, Phaenomena 1–5, in the Scroll (Greek only)", cite: { work: "tlg0653.tlg001", ref: "1", to: "5" } },
    { label: "Eusebius, Ecclesiastical History 3.25.1–7, in the Scroll (the recognized and the disputed books), English by K. Lake", cite: { work: "tlg2018.tlg002", ref: "3.25.1", to: "3.25.7" } },
    { label: "Athanasius, Festal Letter 39 (for 367), on the books of the Bible, in Nicene and Post-Nicene Fathers, series 2, vol. 4 (Christian Classics Ethereal Library)", url: "https://www.ccel.org/ccel/schaff/npnf204.xxv.iii.iii.xxv.html" },
    { label: "Wikipedia, Biblical manuscript (Gregory's four groups of 1908; Metzger's 1992 comparison with the Iliad)", url: "https://en.wikipedia.org/wiki/Biblical_manuscript" },
    { label: "Wikipedia, Westcott and Hort (The New Testament in the Original Greek, 1881; their reliance on Vaticanus and Sinaiticus; their influence on later editions)", url: "https://en.wikipedia.org/wiki/Westcott_and_Hort" },
    { label: "The Scroll's copies of the New Testament: their file headers name the sources (Westcott and Hort, New York, Harper and Brothers, 1882–1892; the World English Bible, Rainbow Missions; for Mark also the INTF's transcription of Codex Sinaiticus, British Library Add. 43725, and a Sahidic Coptic text of chapter 1 from Coptic SCRIPTORIUM)", cite: { work: "tlg0031.tlg002", ref: "1.1" } },
    { label: "eBible.org, The World English Bible (WEB) FAQ (an update of the American Standard Version of 1901, edited to conform to the Greek Majority Text; public domain)", url: "https://ebible.org/eng-web/webfaq.htm" },
    { label: "Wikipedia, Papyrus 46 (Chester Beatty Papyri; dated 175–225 or the early third century)", url: "https://en.wikipedia.org/wiki/Papyrus_46" },
    { label: "Wikipedia, Codex Vaticanus (fourth century; in the Vatican Library catalogue of 1481; what it lacks)", url: "https://en.wikipedia.org/wiki/Codex_Vaticanus" },
    { label: "Wikipedia, Codex Sinaiticus (Add MS 43725; the oldest complete New Testament; Tischendorf in 1844 and 1859; sold to the British Museum in 1933)", url: "https://en.wikipedia.org/wiki/Codex_Sinaiticus" },
    { label: "Wikipedia, Complutensian Polyglot Bible (New Testament printed 1514; publication 1520, distribution 1521)", url: "https://en.wikipedia.org/wiki/Complutensian_Polyglot_Bible" },
    { label: "Wikipedia, Novum Instrumentum omne (Erasmus' edition, Froben, Basel, 1516; rushed printing; the last six verses of Revelation translated back from the Latin)", url: "https://en.wikipedia.org/wiki/Novum_Instrumentum_omne" },
    { label: "Wikipedia, Chapters and verses of the Bible (Robert Estienne's verse numbers, 1551)", url: "https://en.wikipedia.org/wiki/Chapters_and_verses_of_the_Bible" },
    { label: "Wikipedia, Textus Receptus (the back-translated end of Revelation; the Elzevir preface of 1633)", url: "https://en.wikipedia.org/wiki/Textus_Receptus" },
    { label: "Wikipedia, Rylands Library Papyrus P52 (published by C. H. Roberts in 1935; dated 100–150 by him, 125–175 by Orsini and Clarysse)", url: "https://en.wikipedia.org/wiki/Rylands_Library_Papyrus_P52" },
    { label: "Wikipedia, Novum Testamentum Graece (Nestle 1898; NA28, 2012, edited by the INTF; UBS5, 2014, with the same text)", url: "https://en.wikipedia.org/wiki/Novum_Testamentum_Graece" },
    { label: "Wikipedia, Jesus and the woman taken in adultery (the manuscripts that lack, move or include the passage; P66 and P75 and their dates; Papias; NA28 and UBS)", url: "https://en.wikipedia.org/wiki/Jesus_and_the_woman_taken_in_adultery" },
    { label: "Wikipedia, Papyrus 75 (Luke and John; traditionally third century, possibly early fourth)", url: "https://en.wikipedia.org/wiki/Papyrus_75" },
    { label: "Wikipedia, Nomina sacra", url: "https://en.wikipedia.org/wiki/Nomina_sacra" },
    { label: "The Codex Sinaiticus Project: about the project (the four institutions; conservation, digitisation, transcription)", url: "https://codexsinaiticus.org/en/project/" },
    { label: "INTF transcription of Mark 1 in Codex Sinaiticus (First1KGreek, tlg0031.tlg002.INTF-grc1.xml): Mark 1:1 without υἱοῦ θεοῦ in the first hand, added by corrector 1", url: "https://github.com/OpenGreekAndLatin/First1KGreek/blob/master/data/tlg0031/tlg002/tlg0031.tlg002.INTF-grc1.xml" },
    { label: "Wikipedia, Editio Critica Maior (INTF, Münster; every known manuscript; to be completed by 2030; followed by NA28 and UBS5 for the Catholic Letters)", url: "https://en.wikipedia.org/wiki/Editio_Critica_Maior" },
    { label: "Wikipedia, Codex Bezae (fifth century; Greek and Latin; at Cambridge; the Western text; Acts nearly 8% longer)", url: "https://en.wikipedia.org/wiki/Codex_Bezae" },
    { label: "Mark 16.8–16.20 and the shorter ending, in the Scroll", cite: { work: "tlg0031.tlg002", ref: "16.8", to: "16.20a" } },
    { label: "Wikipedia, Mark 16 (the manuscripts that end at 16:8; the longer and shorter endings; the debate)", url: "https://en.wikipedia.org/wiki/Mark_16" },
    { label: "John 7.52–8.12, in the Scroll", cite: { work: "tlg0031.tlg004", ref: "7.52", to: "8.12" } },
    { label: "Wikipedia, Johannine Comma (the King James wording; Latin manuscripts; the earliest Greek manuscript of the fourteenth century; Erasmus in 1522)", url: "https://en.wikipedia.org/wiki/Johannine_Comma" },
    { label: "1 John 5.6–8, in the Scroll", cite: { work: "tlg0031.tlg023", ref: "5.6", to: "5.8" } },
    { label: "Revelation 13.18, in the Scroll", cite: { work: "tlg0031.tlg027", ref: "13.18" } },
    { label: "Wikipedia, Number of the beast (616 in Papyrus 115 and Codex Ephraemi Rescriptus; Irenaeus knew and rejected it)", url: "https://en.wikipedia.org/wiki/Number_of_the_beast" },
    { label: "Wikipedia, Papyrus 115 (P. Oxy. 4499; Oxyrhynchus; dated about 225–275)", url: "https://en.wikipedia.org/wiki/Papyrus_115" },
    { label: "Mark 1.1–2, in the Scroll", cite: { work: "tlg0031.tlg002", ref: "1.1", to: "1.2" } },
    { label: "Wikipedia, Mark 1 (“Son of God” missing in some manuscripts, an accident according to T. Wasserman; Isaiah or the prophets in Mark 1:2)", url: "https://en.wikipedia.org/wiki/Mark_1" },
    { label: "Romans 16.24–27, in the Scroll (the closing praise in the Greek)", cite: { work: "tlg0031.tlg006", ref: "16.24", to: "16.27" } },
    { label: "Romans 14.23, in the Scroll (the closing praise in the English)", cite: { work: "tlg0031.tlg006", ref: "14.23" } },
    { label: "Wikipedia, Romans 14 (most Greek manuscripts, of the Byzantine tradition, place 16:25–27 after 14:23)", url: "https://en.wikipedia.org/wiki/Romans_14" },
    { label: "Wikipedia, Epistle to the Romans (the doxology in different places; Papyrus 46 after chapter 15)", url: "https://en.wikipedia.org/wiki/Epistle_to_the_Romans" },
    { label: "Internet Archive, B. M. Metzger, A Textual Commentary on the Greek New Testament: a companion volume to the United Bible Societies' Greek New Testament (fourth revised edition), Stuttgart, Deutsche Bibelgesellschaft, 1994", url: "https://archive.org/details/textualcommentar0000metz" },
    { label: "Bart D. Ehrman's site: B. M. Metzger and B. D. Ehrman, The Text of the New Testament, fourth edition (Oxford University Press, 2005)", url: "https://www.bartehrman.com/?p=1480" },
  ],
  outsideQuotes: [
    "the common dialect",
    "and at once the Spirit drives him out into the desert",
    "finely crafted, periodic Greek",
    "from the one who is and who was and who is to come",
    "the first and worst grammatical solecism in Revelation",
    "fountains of salvation",
    "edited to conform to the Greek Majority Text New Testament where there are significant differences in manuscripts",
    "now received by all",
    "in heaven, the Father, the Word, and the Holy Ghost: and these three are one",
    "Peter's interpreter",
  ],
  checked: "2026-10-06",
};
