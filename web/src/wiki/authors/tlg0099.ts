/**
 * Strabo. Checked on 2026-10-07 (notes: pipeline/drafts/checked/tlg0099.md). Left out because nothing
 * reliable could be found, or the sources disagree too much: the number of books of the lost history (the
 * Loeb introduction says forty-seven, the Bohn preface forty-three), Strabo's study with Athenodorus (only a
 * friendship is in the text), his "plain, educated prose" (no source opened says so), the claim that the
 * Epitome and Chrestomathy "sometimes preserve readings lost elsewhere", the Latin translation as used by
 * Columbus, Athenaeus' date, a firm date for Parisinus gr. 1397 (tenth or eleventh century: both given), the
 * claim that the Aldine's errors "persisted until the manuscripts were collated afresh", and which of Josephus'
 * many quotations of Strabo come from the lost history and which from the Geography.
 */
import type { AuthorArticle } from "../author-articles";

export const strabo: AuthorArticle = {
  id: "tlg0099",
  summary: `Strabo was a Greek scholar from Asia Minor who lived under the first Roman emperors.[^1,2] He was born in 64 or 63 BC at Amaseia in Pontus, now Amasya in Turkey, and probably died about AD 24.[^2,1,3] He is remembered for one great book, the *Geography* (Γεωγραφικά), a description in seventeen books of the whole world known to the Greeks and Romans of his day.[^3,4] Apart from the end of Book 7, all of it survives.[^5,6]

### A family that served the kings of Pontus

He was proud of his home town: «ἡ δʼ ἡμετέρα πόλις κεῖται μὲν ἐν φάραγγι βαθείᾳ καὶ μεγάλῃ», “My city is situated in a large deep valley, through which flows the Iris River,” he writes, describing its fortress on a high rock with the palaces and the tombs of the kings inside the walls; Amaseia, he adds, “was also given to kings, though it is now a province”.[^7]

His mother's family had served those kings. Her great-grandfather Dorylaus, a general and a friend of King Mithridates Euergetes, settled at Cnossus in Crete.[^8,9] A younger Dorylaus was brought up with Mithridates Eupator, rose to the highest honours, and fell when he was caught trying to hand the kingdom over to the Romans.[^8,9] Strabo's grandfather changed sides in good time: in the war against the Roman general Lucullus he went over to Rome with fifteen garrisons, and “great promises were made in return for these services”; but Pompey, who took over the war, saw to it that the Senate did not grant them.[^9]

{debated} Some modern accounts, among them the introduction to the Loeb translation, make this man Strabo's father's father.[^2,1] Strabo's own words, «ὁ πάππος ἡμῶν ὁ πρὸς αὐτῆς», “our grandfather on her side”, point to his mother's family, and the Loeb's English has “my maternal grandfather”.[^9]

Even his name is a small puzzle. Στράβων is also a Greek word: the great Greek dictionary of Liddell, Scott and Jones explains it as the same as στραβός, “squinting”, and a modern reviewer remarks that we cannot be absolutely sure it was his real name.[^10,5]

### Teachers and travels

As a very young man he studied at Nysa in Caria with the aged Aristodemus, who taught rhetoric in the morning and grammar in the evening.[^11] He also heard the grammarian Tyrannion[^12] and the Peripatetic (that is, Aristotelian) philosopher Xenarchus, who taught at Alexandria, at Athens and at last in Rome,[^13] and he studied Aristotle together with Boethus of Sidon.[^14] Yet he counted himself a Stoic: he speaks of “Our Zeno”, and he blames Posidonius for imitating Aristotle's hunt for causes, “a subject which we [Stoics] scrupulously avoid”.[^15,16,2]

He first came to Rome in 44 BC, at nineteen or twenty, and returned there more than once.[^2] In 29 BC his ship put in at the little island of Gyaros, and he took on board a fisherman who was going to Octavian, the future Augustus, at Corinth to ask for a lower tribute: the islanders were paying “one hundred and fifty drachmas when they could only with difficulty pay one hundred”.[^17,2]

Later he lived for some years in Egypt, probably gathering his material in the library of Alexandria.[^2] His friend Aelius Gallus was prefect of Egypt, and Strabo went with him up the Nile “as far as Syene and the frontiers of Ethiopia”, in 25–24 BC.[^18,2] At Thebes they visited two colossal statues near the Memnonium, one of which was believed to give out a sound once a day; Strabo heard it, and kept his head: “I heard a noise at the first hour (of the day), but whether proceeding from the base or from the colossus, or produced on purpose by some of those standing around the base, I cannot confidently assert.”[^19]

He was proud of how far he had gone: «ἐπήλθομεν δὲ ἐπὶ δύσιν μὲν ἀπὸ τῆς Ἀρμενίας μέχρι τῶν κατὰ Σαρδόνα τόπων τῆς Τυρρηνίας», “in a westerly direction we have travelled from Armenia to that part of Tyrrhenia which is over against Sardinia”, he says, and south from the Black Sea to the borders of Ethiopia; no other geographer, he claims, had covered much more.[^20]

{debated} The introduction to the Loeb edition is less impressed: “it cannot be said that he was a great traveller”. He seems to have seen little of Italy beyond its main roads, and it cannot be shown that he saw any place in Greece except Corinth.[^2]

### A history first

Before the *Geography* he wrote a history, the *Historical Sketches* («ὑπομνήματα ἱστορικὰ»), which he thought a contribution “both to political and moral philosophy”.[^21] The *Geography*, he says, “has been prepared on the same system as the former, and for the same class of readers, but more particularly for those who are in high stations of life”.[^21] Part of the history carried on where the historian Polybius had stopped: in the *Geography* he refers back to what he wrote «ἐν τῇ ἕκτῃ τῶν ἱστορικῶν ὑπομνημάτων βίβλῳ, δευτέρᾳ δὲ τῶν μετὰ Πολύβιον», “in the sixth book of the Historical Sketches, the second of those after Polybius” (our translation).[^22]

The history is lost, but other writers used it: Plutarch cites “Strabo, another philosopher, in his Historical Commentaries”,[^23] and from Strabo, probably from the same work, he takes some of the omens before Caesar's murder: “multitudes of men all on fire were seen rushing up”.[^24] Josephus calls him «Στράβων ὁ Καππάδοξ», “Strabo of Cappadocia”, and quotes him several times in his *Jewish Antiquities*.[^25] A scrap of papyrus at Milan (P. Vogliano 46) has been assigned to the lost history, though with a question mark.[^26]

### The Geography

The *Geography* opens with a bold claim: «τῆς τοῦ φιλοσόφου πραγματείας εἶναι νομίζομεν, εἴπερ ἄλλην τινά, καὶ τὴν γεωγραφικήν», “geography too, if any subject is, we count the business of the philosopher” (our translation).[^27] The first geographer, he goes on, was Homer: «ἀρχηγέτην εἶναι τῆς γεωγραφικῆς ἐμπειρίας Ὅμηρον», in the Bohn translation “Homer as the founder of geographical science”.[^27]

The first two books set out his principles and argue with the writers before him, above all Eratosthenes, Hipparchus, Polybius and Posidonius.[^4] Then comes the tour of the world: Iberia (Book 3); Gaul, Britain and the Alps (4); Italy and Sicily (5–6); northern and eastern Europe (7); Greece and its islands (8–10); Asia, from the Caucasus and Central Asia through Asia Minor to Persia, India and the Middle East (11–16); and last of all Egypt and North Africa (17).[^4]

It was written for men in public life, and Strabo asks that it be judged like a colossal statue, by the whole and not by each detail: «κολοσσουργία γάρ τις καὶ αὕτη», “Its proportions, so to speak, are colossal”.[^21] He knew that he had seen only part of the world himself; most of what any geographer knows comes from others, he says, and that is no shame: “To pretend that those only can know who have themselves seen, is to deprive hearing of all confidence, which, after all, is a better servant of knowledge than sight itself.”[^20]

So the book is full of extracts from earlier writers,[^2] and it holds far more than places: the history of the eastern Mediterranean in the first century BC, cults, the expedition of Alexander the Great, even the history of women.[^5] He notes local produce too: in the valleys of the Pyrenees the Cerretanians cure hams «ταῖς Κανταβρικαῖς ἐνάμιλλοι», “fully equal to those of the Cantabrians”.[^28]

{debated} When he wrote it is argued over.[^2,29] The latest event in the book that can be dated is the death of King Juba II of Mauretania in AD 23: “Juba died lately, and was succeeded by his son Ptolemy”.[^30,5] Ettore Pais argued that a first version was finished about 7 BC, because most of the deeds of Augustus that Strabo mentions fall between 31 and 7 BC, and that it was revised about AD 18; before him, Niese had held that Strabo wrote it at Rome in AD 18–19.[^2] Sarah Pothecary thinks he wrote it out between AD 17 and 23, and Daniela Dueck between AD 18 and 24.[^29,4] Where he wrote it is uncertain too: at home in Amaseia, as Pais thought, or at Rome.[^2]

### Readers

Strabo was not much read in antiquity.[^6,5] The *Geography* seems to have gone unnoticed by the Romans, even by Pliny, though it was known in the Greek East.[^5,2] Athenaeus, in his *Banquet of the Learned*, quotes its third book on Spanish hams, calls Strabo “not a very modern author”, and adds that in his seventh book Strabo said he had known the Stoic philosopher Posidonius.[^31] The *Geography* drew little attention before the sixth century; from the ninth on, Byzantine writers cited it often.[^3]

In the fifteenth century it reached Italy, where a Latin translation was printed about 1469, nearly fifty years before the Greek.[^3] Today the *Geography* is the main source for the history of Greek writing on geography,[^5] and a guide to the whole Greek and Roman world in the age of Augustus.[^1]`,

  timeline: [
    { year: -64, approx: true, kind: "writing", what: "Born at Amaseia in Pontus, in 64 or 63 BC", src: [2, 1] },
    { year: -44, kind: "writing", what: "First comes to Rome, aged nineteen or twenty", src: [2] },
    { year: -29, kind: "writing", what: "Sails by Gyaros, where a fisherman is setting out to ask Octavian (the future Augustus) for a lower tribute", src: [2, 17] },
    { year: -25, kind: "writing", what: "Goes up the Nile with Aelius Gallus, prefect of Egypt, as far as Syene (25–24 BC)", src: [2, 18] },
    { year: -7, approx: true, kind: "writing", certainty: "debated", what: "A first version of the *Geography*, by Ettore Pais's dating", src: [2] },
    { year: 23, kind: "writing", what: "Death of Juba II of Mauretania, the latest datable event in the *Geography*", src: [30, 5, 29] },
    { year: 24, approx: true, kind: "writing", what: "Probably dies", src: [3, 5] },
    { year: 200, approx: true, kind: "copy", what: "Papyrus rolls of the *Geography* are copied (second and third centuries AD); fragments survive", src: [32] },
    { year: 450, approx: true, kind: "copy", what: "A parchment copy of the fifth century, later scraped and written over; its leaves survive in the Vatican and at Grottaferrata", src: [33, 34, 4] },
    { year: 850, approx: true, kind: "copy", what: "The *Chrestomathy*, a Byzantine selection, probably made in the ninth century (Heidelberg, Pal. gr. 398)", src: [3] },
    { year: 1000, approx: true, kind: "copy", certainty: "debated", what: "Paris, Grec 1397, the chief manuscript of Books 1–9 (tenth or eleventh century)", src: [4, 36] },
    { year: 1458, kind: "reception", what: "Guarino of Verona finishes his Latin translation of the whole work at Ferrara", src: [3] },
    { year: 1469, approx: true, kind: "print", what: "The Latin translation is printed at Rome by Sweynheym and Pannartz", src: [3] },
    { year: 1516, kind: "print", what: "First printed Greek text (Aldine Press, Venice, November)", src: [3, 6] },
    { year: 1620, kind: "print", what: "The Paris edition with Casaubon's commentary, whose pages (C 1–840) are still used to cite Strabo", src: [3, 5, 6] },
    { year: 1844, kind: "print", what: "Gustav Kramer's critical edition begins (Berlin, 1844–52)", src: [3, 33] },
    { year: 1852, kind: "print", what: "August Meineke's Teubner text (1852–53), the Greek in the Scroll", src: [33, 37] },
    { year: 1854, kind: "print", what: "Hamilton and Falconer's English translation (Bohn, 1854–57)", src: [39, 37] },
    { year: 1917, kind: "print", what: "First volume of H. L. Jones's Loeb edition (eight volumes, 1917–32)", src: [6, 33] },
    { year: 2002, kind: "print", what: "Stefan Radt's edition begins (ten volumes, 2002–11)", src: [33, 5] },
    { year: 2014, kind: "print", what: "Duane W. Roller's English translation (Cambridge)", src: [5] },
  ],

  transmission: `**Little read, one copy.** Strabo “was not much read in antiquity: in a sense he was discovered in Byzantine times”, says the bibliography of the Loeb edition (1917). All the medieval manuscripts seem to descend from a single lost copy, since they share the same mistakes and gaps, above all the great gap at the end of Book 7.[^6]

**Papyri.** The oldest pieces of the text are scraps of papyrus rolls of the second and third centuries AD: parts of Book 2 (P. Oxy. 4459), of Book 9 (P. Oxy. 3447) and of the lost end of Book 7 (P. Köln 8).[^32]

**A book scraped clean.** The oldest book is a parchment copy of the fifth century, later scraped and written over, twice.[^33,4,34] Its leaves are now divided among three manuscripts, two in the Vatican Library (Vat. gr. 2061A and Vat. gr. 2306) and one at Grottaferrata (Crypt. A.δ.XXIII).[^34]

**Selections.** Two Byzantine abridgements help where the full text fails. The *Chrestomathy*, an anonymous selection made probably in the ninth century, survives in a manuscript of the same age at Heidelberg (Pal. gr. 398).[^3] It begins «Ὅτι Ὅμηρος πρῶτος ἐτόλμησε γεωγραφῆσαι», “That Homer was the first who dared to write geography” (our translation), and the Scroll has it in Karl Müller's edition.[^35] The other, the *Epitome*, was made from a manuscript that still had the end of Book 7.[^6] {debated} The Loeb editors date it to the end of the tenth century; Sarah Pothecary puts it in the fourteenth.[^6,33]

**The medieval manuscripts.** About thirty survive.[^33,5] For Books 1–9 the chief witness is a Paris manuscript, Grec 1397, which holds only those books and breaks off at the end.[^6,36] {debated} It is dated to the tenth century in the table of manuscripts on Wikipedia, which follows Stefan Radt's edition, and to the eleventh in the catalogue of the Bibliothèque nationale.[^4,36] For Books 10–17 editors rely on later manuscripts, among them Vatican 1329 and Venice 640, and on the *Epitome*.[^6] A Paris manuscript of the thirteenth century, Grec 1393, has the whole text.[^4]

**Print.** Pope Nicholas V (1447–55) commissioned a Latin translation and divided the work: Guarino of Verona took Books 1–10 and Gregorio Tifernate Books 11–17. Guarino went on to translate the rest as well, finishing at Ferrara in 1458, but the version printed at Rome by Sweynheym and Pannartz about 1469 joined Guarino's Books 1–10 to Gregorio's 11–17.[^3] The Greek was first printed by the Aldine Press at Venice in November 1516,[^3] from a poor manuscript, Paris 1395.[^6] Isaac Casaubon's edition with commentary (Geneva, 1587) was followed by a Paris edition of 1620, printed after his death, and Strabo is still cited by the pages of that edition, from C 1 to C 840.[^3,5,6] The modern editions begin with Gustav Kramer's (Berlin, 1844–52), and August Meineke's Teubner text (1852–53), based on Kramer's, is the Greek in the Scroll.[^6,3,33,37] Stefan Radt's ten volumes (Göttingen, 2002–11) are now the edition to use, and they could draw on the papyri and the fifth-century manuscript, which earlier editors had seen only in part or not at all.[^33,5]`,

  variants: `**Where Book 7 breaks off.** Every manuscript of the full text stops in the middle of the account of the oracle of Dodona, at the words «Κινέας δʼ ἔτι μυθωδέστερον», in the Bohn translation “Cineas relates what is still more fabulous”; the rest of the book is lost.[^38,6] Editors fill the gap with “fragments”: passages from the *Epitome* and the *Chrestomathy*, and quotations by later writers. The first fragment in the Scroll's text comes from Stephanus, under the word «Δωδώνη».[^38,6,33] Radt prints the passages of the *Epitome* and *Chrestomathy* that stand in for the lost end in his volume of Books 5–8, and the papyrus P. Köln 8 has added new pieces of it.[^33,32]

**A quotation that does not match.** Athenaeus quotes Strabo on hams: «ἐν Σπανίᾳ πρὸς τῇ Ἀκυτανίᾳ πόλις Πομπέλων», “in Spain, near Aquitania, is the city of Pompelo” (our translation), where, he says, fine hams are cured.[^31] In the manuscripts of Strabo the two things are a few lines apart: Pompelo is a city of the Vascons, and the hams belong to the Cerretanians of the Pyrenees.[^28]

**A first edition from a poor copy.** The Greek text of 1516 was set from a poor manuscript.[^6] The Latin translation printed decades earlier had been made from other copies, which still survive: Ciriaco of Ancona's two volumes, now at Eton and Moscow, with notes in Guarino's own hand.[^3] Giovanni Andrea Bussi, who revised the Latin for the printed edition, found much missing from Guarino's Europe, which he put down, he says, to gaps in Guarino's Greek copies, and had it filled in with friends' help; one manuscript of the translation was supplemented and revised with the help of another Greek manuscript by Bussi and others.[^3] In 1523 Conrad Heresbach revised the Latin against the Greek of 1516; he thought Guarino's part particularly bad, worse than Gregorio's.[^3]

**Two Greek texts behind the Scroll.** The Greek in the Scroll is Meineke's, which follows Kramer's text with changes listed at the start of each volume. The Bohn English of 1854–57 was translated from Kramer's text, and for the Loeb, Jones made a Greek text of his own, based on Meineke's.[^33,39,6] So where the English beside the Greek seems not to fit it exactly, the two may rest on different editors' choices.[^33,39]`,

  editions: [
    { text: "A. Meineke, *Strabonis Geographica*, 3 vols (Leipzig, Teubner, 1852–53; reprinted several times).[^33,37]", note: "The Greek text in the Scroll is Perseus's copy of the Teubner printing of 1877." },
    { text: "H. L. Jones, *The Geography of Strabo*, 8 vols (Loeb Classical Library, 1917–32; vol. 1, London: Heinemann, and New York: Putnam, 1917), based in part on the unfinished version of J. R. S. Sterrett.[^6,33]", note: "Greek and English. The English of Books 6–14 in the Scroll is Perseus's copy of this translation (Harvard University Press and Heinemann, printings of 1924–29)." },
    { text: "H. C. Hamilton and W. Falconer, *The Geography of Strabo*, 3 vols (London: Henry G. Bohn, 1854–57).[^39,37,4]", note: "The first complete English translation, made from Kramer's Greek; also in the Scroll, for all seventeen books." },
    { text: "C. Müller, *Geographi Graeci Minores*, vol. 2 (Paris: Didot, 1861).[^3,35]", note: "Contains the *Chrestomathy*, the Byzantine selection from the *Geography* that the Scroll prints." },
    { text: "G. Kramer, *Strabonis Geographica*, 3 vols (Berlin, 1844–52).[^3,33]", note: "Greek text with full critical apparatus, the first of the modern editions." },
    { text: "S. Radt, *Strabons Geographika*, 10 vols (Göttingen: Vandenhoeck & Ruprecht, 2002–11).[^33,5]", note: "Greek text with full apparatus, German translation and commentary; volume 9 has the *Epitome* and the *Chrestomathy*." },
    { text: "G. Aujac, F. Lasserre, R. Baladié and B. Laudenbach, *Strabon: Géographie* (Paris: Les Belles Lettres, Budé series, 1966–).[^33]", note: "Greek text and French translation; Books 1–12 and 17 had appeared by 2015." },
    { text: "D. W. Roller, *The Geography of Strabo: An English Translation, with Introduction and Notes* (Cambridge University Press, 2014), and *A Historical and Topographical Guide to the Geography of Strabo* (2018).[^5]", note: "The modern English translation, with a full commentary in the *Guide*." },
  ],

  sources: [
    { label: "Wikipedia, Strabo (dates, Amaseia and Amasya, the grandfather, Rome in 44 BC, the reign of Augustus)", url: "https://en.wikipedia.org/wiki/Strabo" },
    { label: "H. L. Jones, Introduction to The Geography of Strabo, vol. 1 (Loeb Classical Library, 1917; left substantially as J. R. S. Sterrett wrote it), on LacusCurtius: life, teachers, travels, the debate between Pais and Niese on when and where the Geography was written", url: "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Strabo/Introduction*.html" },
    { label: "Aubrey Diller and Paul Oskar Kristeller, “Strabo”, Catalogus Translationum et Commentariorum 2 (1971) 225–233: Strabo's fortune, the Latin translation, the editions, the Chrestomathy", url: "http://catalogustranslationum.org/PDFs/volume02/v02_strabo.pdf" },
    { label: "Wikipedia, Geographica (the seventeen books and their contents; manuscripts after Radt; the palimpsest; the dating by Dueck; the Bohn translation)", url: "https://en.wikipedia.org/wiki/Geographica" },
    { label: "Jan P. Stronk, review of D. W. Roller, A Historical and Topographical Guide to the Geography of Strabo (Cambridge, 2018), CJ-Online 2019.02.04", url: "https://cj.camws.org/sites/default/files/reviews/2019.02.04%20Stronk%20on%20Roller.pdf" },
    { label: "H. L. Jones, The Geography of Strabo, vol. 1 (London: Heinemann; New York: Putnam, 1917), Internet Archive: title page, preface, and the bibliography (manuscripts, early editions, early translations)", url: "https://archive.org/details/geographyofstrab00stra" },
    { label: "Strabo, Geography 12.3.39, in the Scroll (Amaseia, “my city”)", cite: { work: "tlg0099.tlg001", ref: "12.3.39" } },
    { label: "Strabo, Geography 10.4.10, in the Scroll (Dorylaus at Cnossus)", cite: { work: "tlg0099.tlg001", ref: "10.4.10" } },
    { label: "Strabo, Geography 12.3.33, in the Scroll (his mother's family; his grandfather and Lucullus)", cite: { work: "tlg0099.tlg001", ref: "12.3.33" } },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entries στράβων and στραβός (read in the site's copy; also on the Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Strabo, Geography 14.1.48, in the Scroll (Aristodemus at Nysa)", cite: { work: "tlg0099.tlg001", ref: "14.1.48" } },
    { label: "Strabo, Geography 12.3.16, in the Scroll (Tyrannion)", cite: { work: "tlg0099.tlg001", ref: "12.3.16" } },
    { label: "Strabo, Geography 14.5.4, in the Scroll (Xenarchus)", cite: { work: "tlg0099.tlg001", ref: "14.5.4" } },
    { label: "Strabo, Geography 16.2.24, in the Scroll (Boethus of Sidon)", cite: { work: "tlg0099.tlg001", ref: "16.2.24" } },
    { label: "Strabo, Geography 1.2.34, in the Scroll (“Our Zeno”)", cite: { work: "tlg0099.tlg001", ref: "1.2.34" } },
    { label: "Strabo, Geography 2.3.8, in the Scroll (Posidonius and the search for causes)", cite: { work: "tlg0099.tlg001", ref: "2.3.8" } },
    { label: "Strabo, Geography 10.5.3, in the Scroll (Gyaros)", cite: { work: "tlg0099.tlg001", ref: "10.5.3" } },
    { label: "Strabo, Geography 2.5.12, in the Scroll (with Aelius Gallus up the Nile)", cite: { work: "tlg0099.tlg001", ref: "2.5.12" } },
    { label: "Strabo, Geography 17.1.46, in the Scroll (the colossus at Thebes)", cite: { work: "tlg0099.tlg001", ref: "17.1.46" } },
    { label: "Strabo, Geography 2.5.11, in the Scroll (his travels; hearing and sight)", cite: { work: "tlg0099.tlg001", ref: "2.5.11" } },
    { label: "Strabo, Geography 1.1.22–23, in the Scroll (the Historical Sketches; for statesmen; a colossal work)", cite: { work: "tlg0099.tlg001", ref: "1.1.22", to: "1.1.23" } },
    { label: "Strabo, Geography 11.9.3, in the Scroll (the sixth book of the Historical Sketches)", cite: { work: "tlg0099.tlg001", ref: "11.9.3" } },
    { label: "Plutarch, Lucullus 28.7, in the Scroll", cite: { work: "tlg0007.tlg036", ref: "28.7" } },
    { label: "Plutarch, Caesar 63.2, in the Scroll", cite: { work: "tlg0007.tlg048", ref: "63.2" } },
    { label: "Josephus, Jewish Antiquities 14.104–118, in the Scroll (“Strabo of Cappadocia”)", cite: { work: "tlg0526.tlg001", ref: "14.104", to: "14.118" } },
    { label: "Sarah Pothecary, Strabo the Geographer: “Strabo's lost History” (the fragments; P. Vogliano 46)", url: "https://www.strabo.ca/history.html" },
    { label: "Strabo, Geography 1.1.1–2, in the Scroll (the opening; Homer)", cite: { work: "tlg0099.tlg001", ref: "1.1.1", to: "1.1.2" } },
    { label: "Strabo, Geography 3.4.10–11, in the Scroll (Pompelo; the Cerretanians' hams)", cite: { work: "tlg0099.tlg001", ref: "3.4.10", to: "3.4.11" } },
    { label: "Sarah Pothecary, Strabo the Geographer: “When was the Geography written?”", url: "https://www.strabo.ca/when.html" },
    { label: "Strabo, Geography 17.3.7, in the Scroll (the death of Juba)", cite: { work: "tlg0099.tlg001", ref: "17.3.7" } },
    { label: "Athenaeus, The Deipnosophists 14.75, in the Scroll (Strabo on hams; “not a very modern author”)", cite: { work: "tlg0008.tlg001", ref: "14.75" } },
    { label: "Sarah Pothecary, Strabo the Geographer: “Papyri of Strabo's Geography”", url: "https://www.strabo.ca/papyri.html" },
    { label: "Sarah Pothecary, Strabo the Geographer: “Editions of Strabo's Geography” (Radt, the Budé, Jones, Meineke, Kramer; the Epitome and Chrestomathy)", url: "https://www.strabo.ca/editions.html" },
    { label: "Vatican Library, Palimpsests: “Relationship between the recycled and the new manuscript” (the early copy of Strabo in Vat. gr. 2061A, Vat. gr. 2306 and Crypt. A.δ.XXIII)", url: "https://spotlight.vatlib.it/en/palimpsests/feature/relationship-between-the-recycled-and-the-new-manuscript" },
    { label: "Chrestomathy from Strabo's Geography 1.1, in the Scroll (Müller's text, Geographi Graeci Minores 2, Paris 1861, as the file's header says)", cite: { work: "tlg0099.tlg004", ref: "1.1" } },
    { label: "Bibliothèque nationale de France, Archives et manuscrits: Grec 1397 (Strabo, Books 1–9, eleventh century)", url: "https://archivesetmanuscrits.bnf.fr/ark:/12148/cc214890" },
    { label: "Perseus's copies of Strabo shown in the Scroll: each file's header names its source (Meineke's Teubner text, Leipzig, 1877; Jones's translation, Harvard University Press and Heinemann, printings of 1924–29; Hamilton and Falconer, Bohn, 1854–57)", cite: { work: "tlg0099.tlg001", ref: "1.1.1" } },
    { label: "Strabo, Geography 7.7.12 and the first fragment of Book 7, in the Scroll (where the book breaks off)", cite: { work: "tlg0099.tlg001", ref: "7.7.12", to: "7.fragments.1" } },
    { label: "Sarah Pothecary, Strabo the Geographer: “Translations of Strabo's Geography” (Jones; Hamilton and Falconer, from Kramer's text)", url: "https://www.strabo.ca/translations.html" },
  ],
  outsideQuotes: [
    "in Spain, near Aquitania, is the city of Pompelo",
    "our grandfather on her side",
    "it cannot be said that he was a great traveller",
    "in the sixth book of the Historical Sketches, the second of those after Polybius",
    "geography too, if any subject is, we count the business of the philosopher",
    "was not much read in antiquity: in a sense he was discovered in Byzantine times",
    "That Homer was the first who dared to write geography",
  ],
  checked: "2026-10-09",
};
