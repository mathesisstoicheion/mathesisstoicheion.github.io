/**
 * Claudius Ptolemy. Checked on 2026-10-07 (notes: pipeline/drafts/checked/tlg0363.md). Left out because nothing
 * reliable could be found, or the sources disagree too much: Arabic translation "at Baghdad in 827" (Toomer says
 * about 800, improved under al-Ma'mun); Simon Grynaeus as editor of the Greek Almagest of 1538 (Wikipedia's list of
 * first editions names Camerarius; the editor is not named here); Paris gr. 2389 as written "largely in capitals" and
 * Vat. gr. 1594 as "the finest witness"; "editors must check the numerals against Ptolemy's own calculations"; the
 * claim that our sixty minutes and seconds come from Ptolemy's sexagesimal fractions; "clear, technical prose"
 * (Robbins found him a difficult writer); the introductory chapters as "approachable"; the Tetrabiblos as "the
 * standard ancient textbook of astrology" (Toomer says it never had an authority like the Almagest's); a fixed
 * order of writing after the Almagest for the Harmonics; Theon's daughter Hypatia and Almagest book 3; the 2022
 * palimpsest of Hipparchus' star catalogue; and the Geography's count of places with coordinates (6,300 in
 * Wikipedia), since the sources read give only "some eight thousand" place names.
 */
import type { AuthorArticle } from "../author-articles";

export const ptolemy: AuthorArticle = {
  id: "tlg0363",
  summary: `Claudius Ptolemy, the astronomer of Alexandria, lived from about AD 100 to about 170.[^1] Almost everything we know about him has to be worked out from his own books.[^1,2] The best evidence for his dates is the observations of the sky that he reports in his great work on astronomy: the earliest is dated 26 March 127 and the latest 2 February 141.[^1] The only place named in any of his observations is Alexandria, and there is no reason to think he lived anywhere else.[^1] His name tells us a little more: *Ptolemaeus* suggests an inhabitant of Egypt of Greek or Greek-speaking family, and *Claudius* that he was a Roman citizen, probably because the emperor Claudius or Nero had made an ancestor one.[^1]

The only formal notice of his life, in the tenth-century Byzantine encyclopedia called the Suda, is a few lines long.[^1] It calls him «Πτολεμαῖοϲ, ὁ Κλαύδιοϲ χρηματίϲαϲ, Ἀλεξανδρεύϲ, φιλόϲοφοϲ», “Ptolemy, called Claudius, of Alexandria, philosopher” (our translation), and places him in the time of the emperor Marcus, that is Marcus Aurelius, who reigned from 161 to 180.[^3,1]

{legend} Later writers filled the gaps. A sixth-century commentator, Olympiodorus, says Ptolemy practised astronomy for forty years at Canopus, near the mouth of the Nile; Gerald Toomer thinks this probably a fiction spun from an inscription said to be his.[^1] A description of his looks, handed down in Arabic, turns out to be the stock portrait of a philosopher from Greek handbooks on reading character in the face.[^2]

{debated} A fourteenth-century astronomer, Theodore Meliteniotes, says that he was born at Ptolemais in Upper Egypt.[^4] Frank Robbins, his translator, thought we can probably rely on that, and on an eleventh-century Arabic report that he lived to 78; Toomer allows that the first could be correct but calls it late and unsupported, and sets the Arabic sources aside as adding nothing credible.[^2,1]

### What he wrote

Astronomy was the subject he gave the most time and effort to: about half of his surviving works deal with it.[^4] His great work, in thirteen books, was called the *Mathematical Syntaxis*, «μαθηματικῆς συντάξεως» in the Scroll's heading, that is, the *Mathematical Compilation*.[^1,5] In later antiquity it came to be called the Great, or Greatest, compilation; Arabic translators turned the Greek word for “greatest”, *megistē*, into *al-majisṭī*, and medieval Latin made that *almagesti* or *almagestum*: our *Almagest*.[^1,6] Starting from first principles, it leads the reader to tables that give the places of the sun, the moon, the five planets then known and the stars for any date.[^1] Around a round, motionless earth the heavens turn.[^1] To make the planets' uneven motions come out right he combined small circles riding on larger ones (epicycles), circles whose centre is not the earth (eccentrics), and a new device: a point off the centre about which the motion looks even, later called the equant.[^1,6] Books 7 and 8 hold a catalogue of 1,022 stars in forty-eight constellations.[^1]

The *Almagest* is the earliest of his major works, and several of the later ones mention it.[^1] The *Handy Tables* gathered its tables into a more practical form, and the *Planetary Hypotheses* turned its geometry into a physical model of the universe and worked out its size.[^1] The *Tetrabiblos* (“Four Books”) is a handbook of astrology, which Ptolemy saw as the natural partner of the *Almagest*: one tells where the heavenly bodies will be, the other what they do to things on earth.[^1] The *Geography*, in eight books, teaches how to draw a map of the known world, and most of it is a list of some eight thousand places with their longitudes and latitudes, so that the map can be rebuilt from the text alone.[^1,7] The *Harmonics*, in three books, works out the mathematics of musical intervals, steering between the followers of Pythagoras, who trusted theory over the ear, and the followers of Aristoxenus, who did the reverse.[^1]

Some works survive only in translation: the *Optics* in a twelfth-century Latin version made from a lost Arabic one, and the *Planisphaerium*, on mapping the sky onto a flat plane (the mathematics behind the astrolabe), in Arabic and Latin.[^1] Others are lost, among them a *Mechanics* in three books, which the Suda lists.[^1,3]

The Scroll has the *Almagest* in J. L. Heiberg's Greek, the *Tetrabiblos* in two Greek editions, and a short *On Music*, which is not the *Harmonics* but twenty-seven brief notes headed «ΠΤΟΛΕΜΑΙΟΥ ΜΟΥΣΙΚΑ», printed by Karl von Jan in 1895; his own notes show that some repeat passages of Cleonides and Nicomachus.[^8,9,1] It has no English translation of Ptolemy, so the English here is our own unless a translator is named.[^8]

### Reading Ptolemy

The *Almagest* opens with a short essay on knowledge, addressed «ὦ Σύρε», “O Syrus”, to a man of whom nothing else is known.[^10,1] Following Aristotle, Ptolemy divides theoretical philosophy into theology, physics and mathematics, and then ranks them: the first two are guesswork rather than knowledge, but «μόνον δὲ τὸ μαθηματικόν, εἴ τις ἐξεταστικῶς αὐτῷ προσέρχοιτο, βεβαίαν καὶ ἀμετάπιστον τοῖς μεταχειριζομένοις τὴν εἴδησιν παράσχοι», “only the mathematical kind, if one comes to it in a spirit of inquiry, would give those who practise it sure and unshakeable knowledge” (our translation).[^10] Astronomy, he adds, improves character too, «ἐραστὰς μὲν ποιοῦσα τοὺς παρακολουθοῦντας τοῦ θείου τούτου κάλλους», “making those who follow it lovers of this divine beauty” (our translation).[^10]

The headings of book 1 announce its picture of the world one claim at a time: «ὅτι μέση τοῦ οὐρανοῦ ἐστιν ἡ γῆ», “that the earth is in the middle of the heavens”, and «ὅτι οὐδὲ κίνησίν τινα μεταβατικὴν ποιεῖται ἡ γῆ», “that the earth does not move from place to place either” (our translations).[^5] He sets himself a rule: «ὅλως δὲ ἡγούμεθα προσήκειν διʼ ἁπλουστέρων ὡς ἔνι μάλιστα ὑποθέσεων τὰ φαινόμενα ἀποδεικνύειν», “in general we think it right to account for the phenomena by hypotheses as simple as possible” (our translation), so long as nothing of weight in the observations tells against it.[^11] The planets would not be simple, and in the last book he defends his elaborate models: «καὶ μηδεὶς τὰς τοιαύτας τῶν ὑποθέσεων ἐργώδεις νομισάτω σκοπῶν τὸ τῶν παῤ ἡμῖν ἐπιτεχνημάτων κατασκελές· οὐ γὰρ προσήκει παραβάλλειν τὰ ἀνθρώπινα τοῖς θείοις», “and let no one think such hypotheses troublesome, looking at the inadequacy of our own devices; for it is not right to compare human things with divine” (our translation).[^12] The great Greek dictionary, LSJ, cites this very sentence for the rare word κατασκελής: “the meagreness or inadequacy of human contrivances”.[^13]

The *Tetrabiblos* begins by looking back at the *Almagest*.[^14,15] The study of the heavens' motions, Ptolemy tells Syrus, «κατʼ ἰδίαν σύνταξιν ὡς μάλιστα ἐνῆν ἀποδεικτικῶς σοι περιώδευται», in Robbins' translation “has been expounded to you as best we could in its own treatise by the method of demonstration”.[^14,15] Readers do not agree about his style. Toomer calls the *Almagest* “a masterpiece of clarity and method”;[^1] Robbins found Ptolemy “a difficult author even for the ancients”, fond of “long, involved sentences”.[^2]

{debated} The most famous lines under his name are a short poem, kept in the Greek Anthology and copied on the first page of manuscripts of the *Almagest*: “I know that I am a mortal, a creature of a day; but when I search into the multitudinous revolving spirals of the stars my feet no longer rest on the earth, but, standing by Zeus himself, I take my fill of ambrosia, the food of the gods” (W. R. Paton's translation, slightly modified by Cristian Tolsa).[^16] Whether Ptolemy wrote it is uncertain.[^16] Synesius of Cyrene engraved it on an astrolabe shortly before 400 and called it old, without naming an author; Tolsa argues that it was added to the *Almagest* as a note on its preface, and that this is what led the anthologies to call it Ptolemy's.[^16]

### Why he matters

The *Almagest* became the standard textbook almost at once and ruled theoretical astronomy until the end of the sixteenth century.[^1] It was translated into Arabic about 800, and Western Europe knew it mainly through Gerard of Cremona's Latin translation from the Arabic, of 1175.[^1] Even Copernicus' *De revolutionibus* (1543), which put the sun at the centre, is, in Toomer's words, “cast in a firm Ptolemaic mold”; only Kepler's work, built on Tycho Brahe's observations, made the *Almagest* obsolete.[^1] The *Geography*, in Latin from about 1406, lay behind most maps printed in the fifteenth and sixteenth centuries.[^1] The *Tetrabiblos*, Robbins says, “enjoyed almost the authority of a Bible” among astrological writers for a thousand years or more.[^2]

{debated} His honesty has been questioned. His own observations of the equinoxes are each about a day out, in a way that agrees with his predecessor Hipparchus; Jean-Baptiste Delambre, in the early nineteenth century, held that he copied Hipparchus, and in 1977 Robert R. Newton called him “the most successful fraud in the history of science”.[^1,4,6] Toomer finds wholesale copying implausible, though he thinks Ptolemy probably picked the observations that best agreed with Hipparchus; Owen Gingerich, admitting “some remarkably fishy numbers”, also rejected the charge of fraud.[^1,6] Toomer's verdict on the system that bears his name: “The Ptolemaic system is indeed named after the right man.”[^1]`,

  timeline: [
    { year: 100, approx: true, kind: "writing", what: "Born, about AD 100; nothing is known of his birthplace for certain", src: [1, 4] },
    { year: 127, kind: "writing", what: "His earliest recorded observation, 26 March 127, at Alexandria", src: [1] },
    { year: 141, kind: "writing", certainty: "debated", what: "His latest dated observation, 2 February 141 (151, if a date in the *Almagest* is read as it stands)", src: [1, 2, 22] },
    { year: 147, approx: true, kind: "writing", certainty: "debated", what: "The Canobic Inscription, dated to the tenth year of Antoninus; Toomer doubts it is Ptolemy's", src: [1, 6] },
    { year: 150, approx: true, kind: "writing", what: "The *Almagest* is finished, not before about 150; the *Tetrabiblos*, *Geography* and other works follow", src: [6, 1] },
    { year: 170, approx: true, kind: "writing", what: "Dies, about 170; the Suda places him under Marcus Aurelius (161–180)", src: [1, 3] },
    { year: 320, approx: true, kind: "reception", what: "Pappus writes a commentary on the *Almagest* (only parts survive)", src: [1, 6] },
    { year: 360, approx: true, kind: "reception", what: "Theon of Alexandria writes his commentary on the *Almagest*", src: [1, 6, 17] },
    { year: 400, approx: true, kind: "reception", what: "Synesius engraves the poem later called Ptolemy's on an astrolabe, shortly before 400", src: [16] },
    { year: 800, approx: true, kind: "reception", what: "The *Almagest* is translated into Arabic; better translations follow under al-Ma'mun", src: [1] },
    { year: 860, approx: true, kind: "copy", what: "Vat. gr. 1594, one of the oldest manuscripts of the *Almagest*, is written in the third quarter of the ninth century", src: [16] },
    { year: 1138, kind: "reception", what: "Plato of Tivoli translates the *Tetrabiblos* into Latin from the Arabic", src: [2, 4] },
    { year: 1175, kind: "reception", what: "Gerard of Cremona's Latin *Almagest*, from the Arabic", src: [1, 6] },
    { year: 1280, approx: true, kind: "copy", what: "The oldest surviving manuscripts of the *Geography*, some with the oldest Ptolemaic maps, are written in the late thirteenth century", src: [7] },
    { year: 1406, approx: true, kind: "reception", what: "Jacobus Angelus translates the *Geography* into Latin from the Greek", src: [1] },
    { year: 1533, kind: "print", what: "The Greek *Geography* is first printed, at Basel", src: [20] },
    { year: 1535, kind: "print", what: "Joachim Camerarius prints the Greek *Tetrabiblos* at Nuremberg", src: [2] },
    { year: 1538, kind: "print", what: "The Greek *Almagest* is first printed, at Basel, with Theon's commentary", src: [1, 20] },
    { year: 1543, kind: "reception", what: "Copernicus' *De revolutionibus*, still “cast in a firm Ptolemaic mold”", src: [1] },
    { year: 1898, kind: "print", what: "Heiberg's critical edition of the *Almagest* begins (1898–1903): the Greek in the Scroll", src: [18, 8] },
  ],

  transmission: `**In antiquity.** The *Almagest* became the standard textbook almost at once.[^1] Pappus (active about 320) and Theon of Alexandria wrote commentaries on it; Theon's survives, of Pappus' only parts, and a third, by Ammonius, is lost.[^1,6] The *Handy Tables* survive in a later version, usually credited to Theon; Toomer judged from Ptolemy's own introduction that Theon changed nothing essential, and the surviving tables are thought to be very close to Ptolemy's.[^1,17]

**Manuscripts of the *Almagest*.** Heiberg's edition rests on a few main manuscripts, known by letters: A, Paris gr. 2389 (ninth century), a copy with very few marginal notes; B, Vatican gr. 1594 (third quarter of the ninth century); C, Venice, Marc. gr. 313 (late ninth or early tenth century); D, Vatican gr. 180 (tenth century); and G, Vatican gr. 184 (1269–70), which Heiberg used only for books 7–13.[^16] B is laid out in two columns and writes the older notes in capitals and the newer ones in small letters, which suggests it is a faithful copy of its model.[^16] B and C come from a common ancestor which, according to Tolsa, was made in the sixth century in the Neoplatonist school of Heliodorus and Ammonius at Alexandria; that school also added the material that now stands before the text, including the Canobic Inscription.[^16]

**Arabic and Latin.** The *Almagest* was translated into Arabic about 800, and again, better, in the ninth century.[^1] In the twelfth century it was put into Latin twice: in Sicily, straight from the Greek, about 1160, a version that seems to have been little known, and at Toledo by Gerard of Cremona, from the Arabic, in 1175.[^1,6] The *Tetrabiblos* went the same way: Ishaq ibn Hunayn put it into Arabic in the ninth century, and Plato of Tivoli made a Latin version from the Arabic in 1138.[^2]

**The *Tetrabiblos*.** At least thirty-five manuscripts hold all or most of it, but none is older than the thirteenth century. One manuscript of the ancient *Paraphrase* ascribed to Proclus, written in the tenth century, is older than any of them, so editors use it too.[^2] Joachim Camerarius printed the first Greek edition at Nuremberg in 1535 from a Nuremberg manuscript, in which his marks to guide the printer can still be seen.[^2] The critical edition of Franz Boll and Emilie Boer appeared in the Teubner series in 1940; Wolfgang Hübner revised it in 1998.[^18,19]

**The *Geography*.** None of the many manuscripts is older than the late thirteenth century.[^7] The maps in them date from about 1300, after the Byzantine scholar Maximus Planudes rediscovered the text.[^4] The Greek was first printed at Basel in 1533.[^20] The first complete critical edition, by Alfred Stückelberger and Gerd Grasshoff and a team at Berne, came out only in 2006; the last complete one before it, C. F. A. Nobbe's (1843–45), had almost no record of the manuscripts' readings.[^7]

**Print of the *Almagest*.** The Greek *Almagest* was first printed at Basel in 1538, followed by a commentary that is mostly Theon's, with Pappus' for book 5 and the Byzantine Nicolaus Cabasilas' for book 3.[^1,20] Heiberg's critical edition (Leipzig, Teubner, 1898–1903) is still the standard text; it is the Greek in the Scroll.[^1,21,8]`,

  variants: `{debated} **141 or 151?** In book 10 of the *Almagest*, in the Scroll's Greek, Ptolemy dates an observation of Venus «ἡμεῖς δὲ ἐτηρήσαμεν τῷ ιδʹ ἔτει Ἀντωνίνου», “we observed in the fourteenth year of Antoninus” (our translation).[^22] Read as it stands, that would make his latest observation one of 151. Franz Boll, who saw that a very slight change in the text would give 141, still found no real reason to alter it, and Robbins followed him.[^2] Toomer gives the latest observation as 2 February 141.[^1] The Canobic Inscription has the same kind of problem: it is dated in the tenth year of Antoninus, but one manuscript reading has “the fifteenth year”.[^1]

**Numbers miscopied.** Greek wrote numbers with letters, and copyists confused letters that look alike: in the star catalogue Α (1) and Δ (4) were sometimes swapped, and in Arabic copies 3 and 8.[^6] Gerard of Cremona gave several stars a latitude of 300°, misreading, it seems, an Arabic letter that stood for 60 in the East, where his manuscript came from, but for 300 among the Moors from whom he had apparently learned.[^6] Toomer's English translation, based on Heiberg's Greek, corrects the text in many places from the medieval Arabic translations.[^21]

{debated} **Two Geographies, and the maps.** The manuscripts of the *Geography* preserve two versions of the text, which parted before Greek books began to be written in small letters (minuscule), if not already in antiquity.[^7] One survives nearly complete in a single huge thirteenth-century manuscript, Vatican gr. 191, whose copyists stopped writing the longitudes and latitudes a little over halfway through the list.[^7] The other comes in a group of manuscripts with maps; their numbers look as if they were corrected by people actually drawing the maps, so their tidiness cannot all come from careful copying, and the corrected figures will not always be Ptolemy's.[^7] Where the maps come from is disputed: Toomer had no doubt that Ptolemy published maps like those in the manuscripts, while Alexander Jones calls their origin a controversial question.[^1,7]

**Two endings.** The manuscripts of the *Tetrabiblos* end in two different ways.[^2] In one group the ending is missing, or has been filled in with the ending of the *Paraphrase* ascribed to Proclus; others, like the Arabic version, have a longer, knottier one. Robbins thought the borrowed ending certainly spurious and the long one probably Ptolemy's, but printed both.[^2] Even the title varies: some manuscripts call the work the *Mathematical Treatise in Four Books*, as the Scroll's text does («Κλαυδίου Πτολεμαίου μαθηματικῆς τετραβίβλου συντάξεως»), others *Apotelesmatika*, “Prognostics”, or, in some, *Symperasmatika*.[^2,14]

**The poem in the manuscripts.** The four-line poem appears in two of the three main branches of the *Almagest*'s manuscripts, but in one of them (D and G) it was added later by another hand.[^16] In most of the *Almagest* manuscripts (B, C and D) two readings differ from the version in Synesius and the anthologies, and Tolsa argues that they were changed on purpose to fit the preface they stand beside.[^16]`,

  editions: [
    { text: "J. L. Heiberg, *Claudii Ptolemaei Opera quae exstant omnia*, vol. 1, *Syntaxis mathematica*, 2 parts (Leipzig, Teubner, 1898–1903).[^8,18,1]", note: "The Greek text of the *Almagest* in the Scroll." },
    { text: "F. Boll and E. Boer, *Claudii Ptolemaei Opera quae exstant omnia*, vol. 3.1, *Apotelesmatica* (Leipzig, Teubner, 1940).[^18,8]", note: "One of the two Greek texts of the *Tetrabiblos* in the Scroll; its file names a printing of 1954." },
    { text: "F. E. Robbins, *Ptolemy: Tetrabiblos* (Loeb Classical Library, Harvard University Press and Heinemann, 1940).[^2,8]", note: "The other Greek text in the Scroll (a printing of 1964); Robbins's English translation is free to read on LacusCurtius." },
    { text: "K. von Jan, *Musici Scriptores Graeci* (Leipzig, Teubner, 1895).[^8,9]", note: "The source of the short *On Music* in the Scroll." },
    { text: "G. J. Toomer, *Ptolemy's Almagest* (1984; Princeton University Press, 1998).[^21,6]", note: "The standard English translation, with notes, based on Heiberg's Greek." },
    { text: "W. Hübner, *Claudii Ptolemaei Opera quae exstant omnia*, vol. 3.1, *Apotelesmatika*, after F. Boll and E. Boer (Stuttgart and Leipzig, Teubner, 1998).[^19]", note: "The current critical text of the *Tetrabiblos*." },
    { text: "J. L. Berggren and A. Jones, *Ptolemy's Geography: An Annotated Translation of the Theoretical Chapters* (Princeton University Press, 2000).[^23,24]", note: "English translation of the theoretical parts of the *Geography*, with an introduction and maps." },
    { text: "A. Stückelberger and G. Grasshoff (eds.), *Klaudios Ptolemaios: Handbuch der Geographie*, 2 vols (Basel, Schwabe, 2006).[^7]", note: "The first complete critical edition of the *Geography*, with a German translation and reconstructed maps." },
  ],

  sources: [
    { label: "G. J. Toomer, “Ptolemy (Claudius Ptolemaeus)”, Complete Dictionary of Scientific Biography (Charles Scribner's Sons), copy hosted by MacTutor, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/DSB/Ptolemy.pdf" },
    { label: "F. E. Robbins, Ptolemy: Tetrabiblos (Loeb Classical Library, 1940), Introduction, on LacusCurtius (Bill Thayer)", url: "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Ptolemy/Tetrabiblos/Introduction*.html" },
    { label: "The Suda, Π 3033 (Ptolemy, called Claudius), in the Scroll", cite: { work: "tlg9010.tlg001", ref: "4.Π.3033" } },
    { label: "Wikipedia, Ptolemy (Meliteniotes; astronomy his main subject; mathematics above theology; Plato of Tivoli; the maps from about 1300; Delambre)", url: "https://en.wikipedia.org/wiki/Ptolemy" },
    { label: "Ptolemy, Almagest, contents of book 1, in the Scroll", cite: { work: "tlg0363.tlg001", ref: "1.toc" } },
    { label: "Wikipedia, Almagest (the name; the equant; not finished before about 150; the commentaries; Gerard of Cremona; miscopied numbers; Newton and Gingerich; Toomer's translation)", url: "https://en.wikipedia.org/wiki/Almagest" },
    { label: "Alexander Jones, review of A. Stückelberger and G. Grasshoff (eds.), Klaudios Ptolemaios: Handbuch der Geographie (Basel, 2006), American Journal of Philology 129 (2008) 128–131 (NYU Faculty Digital Archive)", url: "https://archive.nyu.edu/jspui/bitstream/2451/60907/2/Jones%202008%20review%20Stueckelberger%20and%20Grasshoff.pdf" },
    { label: "The Scroll's copies of Ptolemy: each file's header names its source (Heiberg, Teubner, 1898–1903; Boll and Boer, Teubner, 1954; Robbins, Loeb Classical Library, printing of 1964; von Jan, Musici Scriptores Graeci, Teubner, 1895); none has an English translation", cite: { work: "tlg0363.tlg007", ref: "1.1" } },
    { label: "Ptolemy (attributed), On Music, the twenty-seven notes printed by von Jan, with the editor's remarks, in the Scroll", cite: { work: "tlg0363.tlg011", ref: "1", to: "27" } },
    { label: "Ptolemy, Almagest 1.1 (the preface), in the Scroll", cite: { work: "tlg0363.tlg001", ref: "1.1" } },
    { label: "Ptolemy, Almagest 3.1, in the Scroll", cite: { work: "tlg0363.tlg001", ref: "3.1" } },
    { label: "Ptolemy, Almagest 13.2, in the Scroll", cite: { work: "tlg0363.tlg001", ref: "13.2" } },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entry κατασκελής (read in the site's copy; also on the Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Ptolemy, Tetrabiblos 1.1 (the opening, with the title), in the Scroll", cite: { work: "tlg0363.tlg007", ref: "1.1" } },
    { label: "Ptolemy, Tetrabiblos, Book I §§ 1–3, translated by F. E. Robbins (Loeb Classical Library, 1940), on LacusCurtius", url: "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Ptolemy/Tetrabiblos/1A*.html" },
    { label: "Cristian Tolsa, “The ‘Ptolemy’ Epigram: A Scholion on the Preface of the Syntaxis”, Greek, Roman, and Byzantine Studies 54 (2014) 687–697", url: "https://grbs.library.duke.edu/index.php/grbs/article/download/15171/6457/16953" },
    { label: "Wikipedia, Theon of Alexandria (c. 335–c. 405; observations of 364; the Handy Tables credited to him, though no manuscript names him; his commentary on the Almagest)", url: "https://en.wikipedia.org/wiki/Theon_of_Alexandria" },
    { label: "Internet Archive, Claudii Ptolemaei Opera quae exstant omnia (University of Michigan copy): the volumes and their dates (Heiberg 1898–1903 and 1907; Boll and Boer 1940; Lammert and Boer 1961)", url: "https://archive.org/details/claudiiptolemae04ptolgoog" },
    { label: "University of Münster, Institut für Klassische Philologie: publications of Wolfgang Hübner (Apotelesmatika, Teubner, 1998)", url: "https://www.uni-muenster.de/KlassischePhilologie/Institut/Ehemalige/huebner.html" },
    { label: "Wikipedia, List of editiones principes in Greek (Ptolemy's Geography, Basel 1533; the Almagest with the commentaries, Basel 1538)", url: "https://en.wikipedia.org/wiki/List_of_editiones_principes_in_Greek" },
    { label: "Princeton University Press, Ptolemy's Almagest, translated and annotated by G. J. Toomer (1998)", url: "https://press.princeton.edu/books/paperback/9780691002606/ptolemys-almagest" },
    { label: "Ptolemy, Almagest 10.1, in the Scroll (an observation dated in the fourteenth year of Antoninus)", cite: { work: "tlg0363.tlg001", ref: "10.1" } },
    { label: "Princeton University Press, Ptolemy's Geography, translated by J. Lennart Berggren and Alexander Jones (copyright 2000)", url: "https://press.princeton.edu/books/paperback/9780691092591/ptolemys-geography" },
    { label: "Leonardo Digital Reviews, David Topper on Berggren and Jones, Ptolemy's Geography: An Annotated Translation of the Theoretical Chapters", url: "https://leonardo.info/reviews_archive/jul2001/bk_PTOLEMY_topper.html" },
  ],
  outsideQuotes: [
    "Ptolemy, called Claudius, of Alexandria, philosopher",
    "only the mathematical kind, if one comes to it in a spirit of inquiry, would give those who practise it sure and unshakeable knowledge",
    "making those who follow it lovers of this divine beauty",
    "that the earth is in the middle of the heavens",
    "that the earth does not move from place to place either",
    "in general we think it right to account for the phenomena by hypotheses as simple as possible",
    "and let no one think such hypotheses troublesome, looking at the inadequacy of our own devices; for it is not right to compare human things with divine",
    "the meagreness or inadequacy of human contrivances",
    "has been expounded to you as best we could in its own treatise by the method of demonstration",
    "a masterpiece of clarity and method",
    "a difficult author even for the ancients",
    "long, involved sentences",
    "I know that I am a mortal, a creature of a day; but when I search into the multitudinous revolving spirals of the stars my feet no longer rest on the earth, but, standing by Zeus himself, I take my fill of ambrosia, the food of the gods",
    "cast in a firm Ptolemaic mold",
    "enjoyed almost the authority of a Bible",
    "the most successful fraud in the history of science",
    "some remarkably fishy numbers",
    "The Ptolemaic system is indeed named after the right man.",
    "we observed in the fourteenth year of Antoninus",
    "the fifteenth year",
  ],
  checked: "2026-10-07",
};
