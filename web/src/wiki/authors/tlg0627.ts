/**
 * Hippocrates of Cos and the Hippocratic Corpus. Checked on 2026-10-07 (notes: pipeline/drafts/checked/tlg0627.md).
 * Left out because no source opened here confirms it, or the sources disagree too much: Plato's Protagoras "set around
 * 433 BC" (no dramatic date found in a source read); Aristotle calling him "the great Hippocrates" (the Politics only says
 * he was greater as a doctor; the article says so); the Cos–Cnidus split "itself disputed" (no source read says so; only the
 * presence of Cnidian works is kept); his mother's name (the Life in the Scroll says Phaenarete, Wikipedia says Praxitela:
 * left out); "saving Athens from the plague" (the Life says only that he foresaw a plague coming from Illyria and looked after
 * the cities and his pupils); the "best-known sentence in Greek medicine" (a judgement, not a fact); the Letters as "clearly
 * late" (only their place among the pseudo-Hippocratic letters of the Aldine collection of 1499 is kept); modern redatings of
 * the medieval manuscripts (only Jones's dates of 1923 are given, and attributed to him); Bacchius' edition of Epidemics III
 * (the scan of Jones is unclear at that point); the Penguin selection's first year (the publisher's page gives only 2005).
 */
import type { AuthorArticle } from "../author-articles";

export const hippocrates: AuthorArticle = {
  id: "tlg0627",
  summary: `Hippocrates of Cos was born around 460 BC on the Greek island of Cos; historians agree on that much, but most of the other stories about his life are probably untrue.[^1] He is traditionally called the Father of Medicine, and yet very little is known for certain about what he himself thought, wrote or did, because his name came to be attached to the work of many other doctors.[^1]

### A famous doctor in his own century

He was famous in his own lifetime, and remembered as famous by the next generation. In Plato's *Protagoras*, Socrates asks a young man what he would be paying for if he paid a fee to «Ἱπποκράτη τὸν Κῷον, τὸν τῶν Ἀσκληπιαδῶν», “your namesake Hippocrates of Cos, the Asclepiad”; the answer is, to become a doctor.[^2] The title Asclepiad ties him to Asclepius, the god of healing, from whom the ancient *Life of Hippocrates* says his family descended.[^2,3] In the *Phaedrus*, Plato has Phaedrus say that “If Hippocrates the Asclepiad is to be trusted, one cannot know the nature of the body, either”, without knowing the nature of the whole.[^4]

Aristotle uses him to make a point about size. A city is great, he says, by what it can do, not by its numbers, «οἷον Ἱπποκράτην οὐκ ἄνθρωπον ἀλλʼ ἰατρὸν εἶναι μείζω φήσειεν ἄν τις», in Rackham's translation “just as one would pronounce Hippocrates to be greater, not as a human being but as a physician, than somebody who surpassed him in bodily size.”[^5] Jones took this sentence to show that he was “already known as ‘the Great Hippocrates’”, and Wikipedia repeats the claim; the Greek itself says only that he was greater as a doctor, whatever his height.[^5,7,1]

### Life and legend

{legend} Almost everything else comes from a short Greek *Life of Hippocrates* that goes under the name of Soranus, a Greek doctor of the second century AD.[^1,3] It makes his father Heraclides his first teacher, and traces his descent to Heracles and to Asclepius: twentieth from the one and nineteenth from the other.[^3] It dates his birth, on the authority of one Ischomachus, to the first year of the 80th Olympiad, and adds from an earlier Soranus of Cos, who searched the archives there, the day on which the people of Cos still made offerings to him.[^3]

{legend} A hostile writer, Andreas, claimed that he left Cos after setting fire to the record office at Cnidus; others said he left to see how medicine was practised elsewhere, and Soranus of Cos that a dream told him to settle in Thessaly.[^3] He is said to have cured King Perdiccas of Macedon, whose wasting disease was really love for his late father's concubine; to have been called to Abdera to treat Democritus for supposed madness; and, when a plague struck Illyria, to have worked out that it would reach Attica, foretold it, and looked after the cities and his pupils.[^3] When the Persian king Artaxerxes offered him rich gifts through Hystanes, the governor of the Hellespont, he refused.[^3] A letter that goes under his name tells Hystanes: «Περσέων δὲ ὄλβου οὔ μοι θέμις ἐπαύρασθαι», “it is not right for me to enjoy the wealth of the Persians” (our translation).[^6]

{legend} He died at Larissa in Thessaly, aged ninety, or eighty-five, or 104, or 109, according to different authorities.[^3] For a long time, the *Life* says, bees made honey in his tomb, and nurses cured babies' mouth sores with it at the grave.[^3] His two sons, Thessalus and Draco, were his most famous pupils.[^3]

### Many writers under one name

Some sixty to seventy works have come down under his name: W. H. S. Jones counted some seventy, the classical scholar Ann Ellis Hanson some 60.[^7,8] Most were written in the last decades of the fifth century BC and the first half of the fourth, but some are Hellenistic, and *Precepts* and *Decorum* belong to the first and second centuries AD.[^9] The editor F. Z. Ermerins found the hands of at least nineteen authors, some of them contradicting one another.[^9] The whole collection is in Ionic Greek, although Cos itself spoke Doric.[^9] The Scroll has 53 of these works under Hippocrates' name, 19 of them with an English translation beside the Greek.[^10]

{debated} Which of them, if any, Hippocrates wrote himself is *the Hippocratic question*, and it has no agreed answer; modern debate turns on only a few treatises.[^1,9] The argument is ancient: the *Life* reports much disagreement about his writings, and Galen, the great doctor of the second century AD, was certain that Hippocrates himself wrote *Epidemics* I and III, and thought that books II, IV and VI were notes that his son Thessalus found among his papers.[^3,8] In 1923 Jones, the first editor of the Loeb Hippocrates, was content to leave “the Hippocrates of tradition” in obscurity, but held that certain treatises are “impressed with the marks of an outstanding genius”.[^7] Hanson goes further: there is nothing to connect the Hippocrates of Plato and Aristotle “with any single medical treatise in our present Hippocratic Corpus”.[^8]

### What reading it is like

The books are anonymous: unlike Herodotus and Thucydides, who put their names in their first words, the medical writers never name themselves.[^8] *Airs, Waters, Places* begins «ἰητρικὴν ὅστις βούλεται ὀρθῶς ζητεῖν», in Francis Adams's translation “Whoever wishes to investigate medicine properly”, and tells the doctor to study the seasons, the winds, the waters and the lie of a town.[^11] *The Sacred Disease*, on epilepsy, opens with a challenge: the disease «οὐδέν τί μοι δοκέει τῶν ἄλλων θειοτέρη εἶναι νούσων οὐδὲ ἱερωτέρη», “it appears to me to be nowise more divine nor more sacred than other diseases”, and people call it divine from ignorance and wonder.[^12] In Hanson's words, these writers ask not who causes a sickness, but “By what process does this sickness occur?”[^8]

The *Epidemics* follow patients day by day. The first case of book I begins «Φιλίσκος ᾤκει παρὰ τὸ τεῖχος», “Philiscus, who lived by the Wall”, traces his fever through black urine, delirium and cold sweats, and ends: “about the middle of the sixth day he died.”[^13] Books I and III hold forty-two case histories, and in twenty-five of them the patient died.[^9] The same book gives the rule «ἀσκεῖν περὶ τὰ νοσήματα δύο, ὠφελεῖν ἢ μὴ βλάπτειν»: in Adams's translation, the doctor should have “two special objects in view with regard to disease, namely, to do good or to do no harm”.[^14]

The *Aphorisms* are short sayings, and the first begins: «ὁ βίος βραχὺς, ἡ δὲ τέχνη μακρὴ», “Life is short, and Art long; the crisis fleeting; experience perilous, and decision difficult.”[^15] The art is medicine: elsewhere in the collection, Jones notes, it is called simply the art.[^7] You can hear the Ionic dialect in μακρή, “long”: in Attic Greek alone this η after ρ changed back to α, so an Athenian said μακρά.[^16]

### The Oath

The Oath is one of the best known of all Greek medical texts, and most modern scholars do not think that Hippocrates wrote it.[^17] As Jones put it, “Whatever its origin, it is a landmark in the ethics of medicine.”[^7] The new doctor swears «ὄμνυμι Ἀπόλλωνα ἰητρὸν καὶ Ἀσκληπιὸν καὶ Ὑγείαν καὶ Πανάκειαν», by Apollo Physician, by Asclepius, by Health, by Panacea, and by all the gods and goddesses.[^18] He promises to hold his teacher equal to his own parents, to share his livelihood with him, and to teach the teacher's sons the art “without fee or indenture”.[^18] Then come the rules: “Neither will I administer a poison to anybody when asked to do so, nor will I suggest such a course. Similarly I will not give to a woman a pessary to cause abortion.”[^18] He will not operate even for bladder stone, will enter every house “to help the sick”, will abuse no one, man or woman, free or slave, and will keep what he hears to himself, “holding such things to be holy secrets”.[^18]

{debated} Readers have argued over these lines since antiquity: the earliest surviving reference to the Oath, by the Roman doctor Scribonius Largus in AD 43, took it to forbid all abortion; Soranus decided that it forbade only abortive pessaries.[^17,8] Modern scholars still disagree about what the clause on poison was meant to forbid.[^17] And the Latin motto *primum non nocere*, ‘first, do no harm’, is not in the Oath, though the Oath does promise to “abstain from all intentional wrong-doing and harm”; the rule from the *Epidemics* quoted above is close to it too.[^17,18,14]

### Why it matters

Whatever their disagreements, the Hippocratic writers agree in rejecting divine causes and religious cures of disease in favour of natural ones.[^9] Galen's enthusiasm for some of the treatises kept later doctors reading them, and once the collection was translated into Latin early in the sixteenth century, the prestige of Hippocrates grew throughout Europe.[^8] Jones noted that Hippocrates was still a medical textbook almost down to about 1840.[^7] The Oath has given way to newer codes and oaths, such as the World Medical Association's Declaration of Geneva of 1948; by 2018 every graduate of a United States medical school took some form of oath, but none used the original.[^17]`,

  timeline: [
    { year: -460, approx: true, kind: "writing", what: "Born on the island of Cos (the *Life*, citing Ischomachus, says in the first year of the 80th Olympiad)", src: [1, 3] },
    { year: -410, approx: true, kind: "writing", what: "*Epidemics* I and III written, about 410 BC; most of the Corpus belongs to the late fifth and early fourth centuries", src: [9] },
    { year: -370, approx: true, kind: "writing", what: "Dies at Larissa in Thessaly; the ancient authorities give his age as 85, 90, 104 or 109", certainty: "debated", src: [1, 3] },
    { year: -350, approx: true, kind: "reception", what: "Plato (*Protagoras*, *Phaedrus*) and Aristotle (*Politics*) name him as a famous doctor", src: [2, 4, 5] },
    { year: -250, approx: true, kind: "copy", what: "By the middle of the third century BC the treatises are gathered under his name at Alexandria", src: [8] },
    { year: 43, kind: "reception", what: "Scribonius Largus: the earliest surviving reference to the Oath", src: [17, 8] },
    { year: 60, approx: true, kind: "reception", what: "Erotian's glossary of Hippocratic words, written about the time of Nero, still survives", src: [7] },
    { year: 175, approx: true, kind: "reception", what: "Galen, practising in Rome in the later second century, writes his commentaries on Hippocrates", src: [8, 19] },
    { year: 250, approx: true, kind: "copy", what: "A fragment of the Oath is copied on papyrus in Egypt (P.Oxy. 2547, third century AD)", src: [17] },
    { year: 950, approx: true, kind: "copy", what: "The oldest manuscript, Vienna med. gr. 4, is written in the tenth century (Jones)", src: [7] },
    { year: 1525, kind: "print", what: "Fabius Calvus's Latin translation of the whole collection printed at Rome", src: [7, 9] },
    { year: 1526, kind: "print", what: "First printed Greek text, the Aldine edition, Venice", src: [7, 9, 20] },
    { year: 1792, kind: "reception", what: "Girodet paints *Hippocrates Refusing the Gifts of Artaxerxes*", src: [1] },
    { year: 1839, kind: "print", what: "Émile Littré's Greek text and French translation begins to appear (ten volumes, 1839–61)", src: [7, 9, 10] },
    { year: 1849, kind: "print", what: "Francis Adams's *The Genuine Works of Hippocrates*, London", src: [7, 9] },
    { year: 1923, kind: "print", what: "W. H. S. Jones's first Loeb volume, with the Oath", src: [7, 10] },
    { year: 1927, kind: "print", what: "J. L. Heiberg's volume opens the Corpus Medicorum Graecorum's Hippocrates (CMG I 1)", src: [21] },
    { year: 1948, kind: "reception", what: "The World Medical Association's Declaration of Geneva, a modern doctors' oath", src: [17] },
    { year: 1967, kind: "print", what: "The French Budé edition begins to appear, Greek text with French translation", src: [9] },
    { year: 2018, kind: "print", what: "Paul Potter's eleventh volume completes the Loeb Hippocrates", src: [24, 25] },
  ],

  transmission: `**Collected.** The treatises were gathered under Hippocrates' name in Hellenistic times, certainly at Alexandria by the middle of the third century BC.[^8] {debated} How and by whom is disputed. The collection may be the remains of a library on Cos, or a compilation made at Alexandria.[^9] Jones thought it impossible that the Alexandrian librarians ever published the collection, as Littré had supposed: they could at most have drawn up a list of accepted works, and the collection itself is the remains of a library, perhaps that of the medical school on Cos.[^7]

**Ancient scholars.** Herophilus, about 300 BC, appears to have been the first to write on the Hippocratic works; his pupil Bacchius made a glossary of their rare words, and the most famous commentator before Galen was Heraclides of Tarentum.[^7] About the time of Nero, Erotian wrote a glossary of unusual Hippocratic words, which survives; he accepted the Oath as genuinely Hippocratic.[^7] Galen wrote commentaries that quote the text a passage at a time; the Scroll has his commentaries on the *Aphorisms*, on *Epidemics* I, on the *Prognostic*, on *Fractures* and *Joints*, and others, all in Greek.[^19]

**Papyri and translations.** A fragment of the Oath survives on a third-century papyrus from Oxyrhynchus in Egypt (P.Oxy. 2547).[^17] Some Hippocratic works are known only in translation, and Hippocratic texts survive in Arabic, Hebrew, Syriac and Latin.[^9]

**Manuscripts.** None of the manuscripts is very old, Jones wrote in 1923, but the oldest are far better than the later ones, both in their readings and in their dialect.[^7] There is no fixed canon or order: each independent manuscript seems to hold a different collection of works.[^7] Jones dated the oldest, a Vienna manuscript (Vindobonensis med. gr. 4), to the tenth century; Parisinus gr. 2253 (A), whose use “has transformed our Hippocratic text”, and Marcianus gr. 269 (M) in Venice to the eleventh; and Vaticanus gr. 276 (V) to the twelfth.[^7] V and M are the chief manuscripts of the Oath.[^7]

**Print.** The pseudo-Hippocratic letters were printed first, in the Aldine collection of Greek letters edited by Marcus Musurus at Venice in 1499.[^20] The whole collection appeared in Latin in 1525, translated by Marcus Fabius Calvus at Rome, who used a fourteenth-century manuscript that he owned and had written out in his own hand (Vaticanus gr. 277).[^7,9] The first complete Greek edition followed from the Aldine Press in Venice in 1526.[^7,9,20] Émile Littré spent twenty-two years (1839–61) on the first scholarly edition, Greek text with French translation in ten volumes; Jones praised his common sense but found him diffuse and not always accurate, and his knowledge of the manuscripts almost confined to those in Paris.[^7,9] Hugo Kühlewein's Teubner edition (1894–1902) collated fresh manuscripts and cleaned out the false Ionic forms.[^7] Since 1927 the Corpus Medicorum Graecorum in Berlin has been publishing critical editions of the Hippocratic treatises one or a few at a time, and since 1967 the French Budé series has been doing the same.[^21,9]`,

  variants: `**Not even for the stone?** The Oath's clause «οὐ τεμέω δὲ οὐδὲ μὴν λιθιῶντας», in Jones's translation “I will not use the knife, not even, verily, on sufferers from stone”, has long puzzled editors, because elsewhere the Hippocratic writers operate without hesitation.[^18,7] Littré suggested reading αἰτέοντας, “those who ask” (our translation); Reinhold proposed *οὐδὲ μὴ ἐν ἡλικίῃ ἐόντας*; and Gomperz, like others before him, thought the words hid a ban on castration.[^7] Jones kept the manuscripts' reading and thought the clause might be a late addition.[^7]

**How much Ionic?** Later scribes, Jones explains, wrongly believed the texts had been made Attic and put back what they took to be the old Ionic forms, many of them false, so that the later manuscripts are full of pseudo-Ionic forms the oldest ones rarely have; how much Ionic to print is the editor's choice.[^7] The Scroll has both Jones's and Littré's texts of these works, and they differ. In Jones's Loeb text the rule in *Epidemics* I reads «ἀσκεῖν περὶ τὰ νοσήματα δύο, ὠφελεῖν ἢ μὴ βλάπτειν»; Littré prints *ἀσκέειν, περὶ τὰ νουσήματα, δύο, ὠφελέειν, ἢ μὴ βλάπτειν*.[^14,10] In the Oath, Jones has «ἄνευ μισθοῦ καὶ συγγραφῆς» where Littré has *ξυγγραφῆς*.[^18,10]

**One aphorism or two?** Galen, commenting on the first aphorism, says that almost all who have explained it agree that it is the preface to the whole work, «εἴθʼ εἷς ἀφορισμός ἐστιν εἴτε δύο», “whether it is one aphorism or two” (our translation).[^19] Even the words differ a little: the text Galen comments on, as printed in the Scroll, reads «ποιέοντα» where Littré prints «ποιεῦντα» (“doing”).[^19,15]

{debated} **Hippocrates or Polybus?** Aristotle, describing the veins in the *History of Animals*, quotes a passage that begins «τὰ δὲ τῶν φλεβῶν τέτταρα ζεύγη ἐστίν», “there are four pairs of veins” (our translation), and gives it to Polybus.[^22] The same account stands in chapter 11 of the Hippocratic *Nature of Man*: «τέσσαρα ζεύγεά ἐστιν ἐν τῷ σώματι».[^23] Jones noted that Aristotle quotes *Nature of Man* but ascribes it to Polybus, and modern scholars give it to him, dating it 410–400 BC; Polybus, the tradition says, was Hippocrates' son-in-law and pupil.[^7,9,1]`,

  editions: [
    { text: "É. Littré, *Œuvres complètes d'Hippocrate*, 10 vols (Paris: Baillière, 1839–61).[^7,10]", note: "Greek text with French translation; the Greek of most works in the Scroll." },
    { text: "W. H. S. Jones, *Hippocrates*, vol. 1 (Loeb Classical Library 147; London: Heinemann; New York: Putnam, 1923; later printings Heinemann and Harvard University Press).[^7,10,25]", note: "*Ancient Medicine*, *Airs, Waters, Places*, *Epidemics* I and III, the Oath, *Precepts*, *Nutriment*: Greek and English. The Scroll's Greek text of these works, and part of its English." },
    { text: "F. Adams, *The Genuine Works of Hippocrates*, 2 vols (London, 1849; the Scroll uses the New York printing of 1886).[^7,10]", note: "The first English translation of the dozen and a half works then thought genuine; the Scroll's English for most works." },
    { text: "H. Kühlewein (ed.), *Hippocratis opera quae feruntur omnia*, 2 vols (Teubner, Leipzig, 1894–1902).[^7]", note: "The edition that cleared out the false Ionic forms." },
    { text: "J. L. Heiberg (ed.), *Corpus Medicorum Graecorum* I 1 (Leipzig and Berlin, 1927).[^21]", note: "Critical texts of the Oath, *Law*, *The Art*, *Ancient Medicine*, *Airs, Waters, Places* and others; later CMG volumes edit single treatises with a translation." },
    { text: "J. Jouanna (ed.), *Hippocrate*, tome II, 2e partie: *Airs, eaux, lieux* (Collection des Universités de France; Paris: Les Belles Lettres, 1996).[^26]", note: "One volume of the Budé edition, Greek text with French translation." },
    { text: "P. Potter, *Hippocrates*, vol. 11: *Diseases of Women 1–2* (Loeb Classical Library 538; Harvard University Press, 2018).[^24,25]", note: "The last of the eleven Loeb volumes." },
    { text: "G. E. R. Lloyd (ed.), *Hippocratic Writings*, translated by J. Chadwick, W. N. Mann, I. M. Lonie and E. T. Withington (Penguin Classics).[^27]", note: "A selection in English for the general reader." },
  ],

  sources: [
    { label: "Wikipedia, Hippocrates (born about 460 on Cos, other biography likely untrue; Father of Medicine; little known for certain; Soranus as first biographer; Polybus; Aristotle's \"The Great Hippocrates\"; Girodet, 1792; death at Larissa)", url: "https://en.wikipedia.org/wiki/Hippocrates" },
    { label: "Plato, Protagoras 311, in the Scroll", cite: { work: "tlg0059.tlg022", ref: "311" } },
    { label: "Soranus, Life of Hippocrates (ed. J. Ilberg, 1927), in the Scroll, Greek only: family, teachers, birth date, Andreas, the dream, Perdiccas, Democritus, the plague, Artaxerxes, death at Larissa, the tomb and the bees, the sons, the disagreement over his writings", cite: { work: "tlg0565.tlg004", ref: "1" } },
    { label: "Plato, Phaedrus 270, in the Scroll", cite: { work: "tlg0059.tlg012", ref: "270" } },
    { label: "Aristotle, Politics 7, 1326a, in the Scroll", cite: { work: "tlg0086.tlg035", ref: "7.1326a" } },
    { label: "Hippocrates, Letters 3–5 (Artaxerxes to Hystanes; Hippocrates to Hystanes), in the Scroll, Greek only", cite: { work: "tlg0627.tlg055", ref: "3", to: "5" } },
    { label: "W. H. S. Jones, Hippocrates, vol. 1 (Loeb Classical Library, 1923; Internet Archive scan of a later printing): preface, general introduction (the collection as a library, the commentators, Erotian, dialect, manuscripts, editions) and the introduction to the Oath", url: "https://archive.org/details/hippocrates01hippuoft" },
    { label: "Ann Ellis Hanson, “Hippocrates: The ‘Greek Miracle’ in Medicine”, Medicina Antiqua (University College London), archived copy", url: "https://web.archive.org/web/20110116195856/http://www.ucl.ac.uk/~ucgajpd/medicina%20antiqua/Medant/hippint.htm" },
    { label: "Wikipedia, Hippocratic Corpus (dates and groupings, Ermerins, Ionic and Doric, case histories, natural causes, translations, printed editions)", url: "https://en.wikipedia.org/wiki/Hippocratic_Corpus" },
    { label: "The Scroll's Hippocrates: the catalogue lists 53 works under his name, 19 of them with an English translation; each file's header names its source (Littré, Paris: Baillière, 1839–61, and its Hakkert reprint; Jones's volume 1, 1923, in a printing by Heinemann and Harvard; Adams, New York, 1886)", cite: { work: "tlg0627.tlg001", ref: "1" } },
    { label: "Hippocrates, Airs, Waters, Places 1, in the Scroll", cite: { work: "tlg0627.tlg002", ref: "1" } },
    { label: "Hippocrates, The Sacred Disease 1, in the Scroll", cite: { work: "tlg0627.tlg027", ref: "1" } },
    { label: "Hippocrates, Epidemics I, case 1 (Philiscus), in the Scroll", cite: { work: "tlg0627.tlg006", ref: "1.4.1" } },
    { label: "Hippocrates, Epidemics I 11 (“to do good or to do no harm”), in the Scroll", cite: { work: "tlg0627.tlg006", ref: "1.2.11" } },
    { label: "Hippocrates, Aphorisms 1.1, in the Scroll", cite: { work: "tlg0627.tlg012", ref: "1.1" } },
    { label: "H. W. Smyth, Greek Grammar (1920), §31: Attic ᾱ for η after ρ, ε and ι (Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0007%3Asmythp%3D31" },
    { label: "Wikipedia, Hippocratic Oath (not by Hippocrates; P.Oxy. 2547; Scribonius Largus, AD 43; Soranus; the poison clause; primum non nocere; Declaration of Geneva, 1948; oaths in US medical schools)", url: "https://en.wikipedia.org/wiki/Hippocratic_Oath" },
    { label: "Hippocrates, The Oath, in the Scroll (Jones's Greek text and translation, and Adams's)", cite: { work: "tlg0627.tlg013", ref: "oath" } },
    { label: "Galen, Commentary on Hippocrates' Aphorisms 1.1 (Kühn, vol. 17.2), in the Scroll; the catalogue lists his commentaries on Hippocrates beside it", cite: { work: "tlg0057.tlg092", ref: "1.1" } },
    { label: "Wikipedia, List of editiones principes in Greek (the Aldine letters of 1499, edited by Musurus; Hippocrates, Aldine Press, Venice, 1526)", url: "https://en.wikipedia.org/wiki/List_of_editiones_principes_in_Greek" },
    { label: "Corpus Medicorum Graecorum (Berlin-Brandenburg Academy), Editionen online: CMG I, Hippocrates (Heiberg 1927 and the later volumes)", url: "https://cmg.bbaw.de/epubl/online/editionencmg_01.html" },
    { label: "Aristotle, History of Animals 3.3 (Bekker's text), in the Scroll", cite: { work: "tlg0086.tlg014", ref: "3.3" } },
    { label: "Hippocrates, Nature of Man 11 (Littré's text), in the Scroll", cite: { work: "tlg0627.tlg019", ref: "11" } },
    { label: "M. J. Geller, review of P. Potter, Hippocrates, vol. XI (Loeb 538, Harvard University Press, 2018), Bryn Mawr Classical Review 2019.08.17 (copy in UCL Discovery)", url: "https://discovery.ucl.ac.uk/10079722/1/BMCR%202019.08.17%C2%A0Geller%20on%C2%A0Potter%2C%20Hippocrates.%20Volume%20XI%20%20Diseases%20of%20Women%201-2.html" },
    { label: "Wikipedia, Loeb Classical Library: the list of volumes (Hippocrates I–XI, LCL 147–150, 472, 473, 477, 482, 509, 520, 538)", url: "https://en.wikipedia.org/wiki/Loeb_Classical_Library" },
    { label: "The Classical Review 48.2 (1998), H. King's review of J. Jouanna (ed.), Hippocrate, tome II, 2e partie: Airs, eaux, lieux (Paris: Les Belles Lettres, 1996)", url: "https://www.cambridge.org/core/journals/classical-review/article/airs-waters-places/9C9CA453501DFD54E71BBBC1FCF23D77" },
    { label: "Penguin Books, Hippocratic Writings, edited by G. Lloyd, translated by J. Chadwick, W. N. Mann, I. M. Lonie and E. T. Withington (Penguin Classics)", url: "https://www.penguin.co.uk/books/35088/hippocratic-writings/9780140444513.html" },
  ],
  outsideQuotes: [
    "the Hippocrates of tradition",
    "already known as ‘the Great Hippocrates’",
    "The Great Hippocrates",
    "it is not right for me to enjoy the wealth of the Persians",
    "impressed with the marks of an outstanding genius",
    "with any single medical treatise in our present Hippocratic Corpus",
    "By what process does this sickness occur?",
    "Whatever its origin, it is a landmark in the ethics of medicine.",
    "those who ask",
    "whether it is one aphorism or two",
    "has transformed our Hippocratic text",
    "there are four pairs of veins",
  ],
  checked: "2026-10-07",
};
