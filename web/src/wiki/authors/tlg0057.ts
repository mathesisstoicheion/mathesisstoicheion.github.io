/**
 * Galen. Checked on 2026-10-06 (notes: pipeline/drafts/checked/tlg0057.md). Left out because nothing
 * reliable could be opened, or the sources disagree too much: "hundreds of medieval manuscripts" and "no
 * single one contains more than a fraction" (no count found); a "large dictionary of Attic words" (only
 * Rosen's lexicon of medical words in Old Comedy is kept); the ape Galen is said to have disembowelled to
 * win the gladiators' post, and Wikipedia's "five deaths against sixty" (Galen's own account in the Scroll
 * says only that none of his patients died); Galen's death in Sicily and a tomb at Palermo; the bookshop
 * story's date; diagnosis and prognosis as words "passed into modern medicine"; William Harvey's date; the
 * Basel papyrus of 2018 (its own source hedges between Galen and a commentary on him);
 * Chartier's date (1679 in Boudon's account, 1638–39 on Wikipedia: only Boudon's is given). Confirmed but cut
 * for length: the cinnamon tree and the theriac (On Antidotes 1.13), Oribasius and Ibn al-Nafis.
 */
import type { AuthorArticle } from "../author-articles";

export const galen: AuthorArticle = {
  id: "tlg0057",
  summary: `Galen was born in AD 129 at Pergamum, a culturally Greek city near the north-west coast of Roman Asia, in what is now Turkey; his father was an architect.[^1] His name comes from the Greek adjective γαληνός, “calm”,[^2] which the great Greek dictionary of Liddell, Scott and Jones explains as “calm, esp. of the sea” and, of people, “gentle”.[^3] It hardly fits. Galen became doctor to gladiators and to emperors, one of the most prolific writers of the ancient world, and one of its most combative.[^1]

### From the gladiators to the palace

His father meant him for philosophy or public life, but in 144 or 145, Galen says, the healing god Asclepius told his father in a dream to let the boy study medicine.[^4] Galen puts it in one line: «εἶθ' ὕστερον τοῦ πατρὸς ὀνείρασιν ἐναργέσι προτραπέντος ἐπὶ τὴν τῆς ἰατρικῆς ἄσκησιν ἀφικόμεθα», “then later, my father being urged on by vivid dreams, I came to the practice of medicine” (our translation).[^5] When his father died, in 148 or 149, Galen was nineteen, rich and free, and he went to study at Smyrna, Corinth and Alexandria.[^4,1]

In 157 he came home to a coveted post: doctor to the gladiators of Pergamum.[^4,1] In a book on drugs he tells how the high priest of the city put the gladiators in his care alone, «καίτοι νέῳ τὴν ἡλικίαν ὄντι. τοῦ γὰρ ἐνάτου καὶ εἰκοστοῦ ἔτους ἠρχόμην», “though I was young: I was just beginning my twenty-ninth year” (our translation). Many wounded men had died in the years before, he says, but none of his patients died, so four more high priests in turn kept him on.[^6]

In the early 160s he moved to Rome,[^1,2] where his lectures and dissections soon made him famous.[^1] Fame brought enemies. In 166 he slipped away, letting it be thought that he was going to Campania, and sailed home;[^7,4] one account says he feared that rival doctors would have him exiled or poisoned.[^2] That year the great epidemic now called the Antonine Plague, or the Plague of Galen, reached Rome.[^8]

Two years later the emperors Marcus Aurelius and Lucius Verus summoned him to their winter quarters at Aquileia.[^4,7] Lucius died that winter, and Marcus wanted Galen with him on his war against the Germans, but Galen persuaded him to leave him in Rome to look after his young son Commodus.[^7] While Marcus was away, from 169 to 176, Galen wrote up many of his major works:[^1] «πολλὰς πραγματείας ἔγραψα φιλοσόφους τε καὶ ἰατρικὰς», “I wrote many treatises, philosophical and medical” (our translation).[^7] By his own account the emperor used to call him «τῶν μὲν ἰατρῶν πρῶτον εἶναι, τῶν δὲ φιλοσόφων μόνον», “first among doctors, and alone among philosophers” (our translation).[^9,2]

He went on to serve Commodus and Septimius Severus.[^1,2] In 192 a fire destroyed the Temple of Peace in Rome, and with it a storehouse in which Galen kept books, drugs and instruments:[^1,10,11] in his words, «τὸ τῆς Εἰρήνης τέμενος ὅλον ἐκαύθη, καὶ κατὰ τὸ παλάτιον αἱ μεγάλαι βιβλιοθῆκαι», “the whole precinct of Peace burned down, and the great libraries on the Palatine” (our translation).[^11] One account dates the fire to 191.[^4]

{debated} Nobody knows when he died. The Byzantine lexicon called the Suda has him die at seventy, about 199; Arabic sources say at eighty-seven, about 216, the date Vivian Nutton and Véronique Boudon-Millot favour.[^2] The Stanford Encyclopedia of Philosophy keeps the traditional date, about 200, but notes later sources that have him alive more than ten years after that.[^1]

### A mountain of books

Galen may have written more than any other ancient author.[^2] The standard edition of his Greek, by Karl Gottlob Kühn (Leipzig, 1821–33), runs to some twenty thick volumes,[^1,12] and what survives has been put at over 2.6 million words, or at more than 4 million.[^13,1] Véronique Boudon reckons his works at an eighth of all Greek literature from Homer to the end of the second century AD.[^12]

Even so, much is lost. Much of his philosophy went: he lists more than twenty-five works on ethics, of which only two survive whole, and nearly all his books on logic are gone.[^1] Some works survive only in translation: the last six books of *Anatomical Procedures* only in Arabic, the *Outline of Empiricism* only in medieval Latin.[^14,12,13] And some books that carry his name are not his. The *Introduction, or the Physician* and the *Medical Definitions* came down among his works, but the Corpus Medicorum Graecorum's list puts them in square brackets, as not his,[^14] and the Scroll files the *Introduction* under Pseudo-Galen.[^15] The trouble began in his lifetime. In *On My Own Books*, his guide to his genuine works, he tells how a man of letters in the booksellers' quarter of Rome read two lines of a book sold as Galen's and tore up its title: “This is not Galen's language—the title is false” (P. N. Singer's translation).[^16,10]

### Reading Galen

Galen writes the Greek of his own day, and says so. He has little patience with the people he calls Atticizers, who insisted on the old words of classical Athens: teaching clearly, he says, matters more.[^17] In a commentary on Hippocrates he tells his readers to call a kind of plaster what they like: «οὐ γὰρ ἀττικίζειν διδάσκειν πρόκειταί μοι τοὺς νέους ἐν τοῖσδε τοῖς ὑπομνήμασιν», “for my task in these notes is not to teach the young to talk Attic” (our translation).[^18] Yet words fascinated him: among the books lost in the fire were his word-books, including a lexicon of medical words in Old Comedy, the comic plays of classical Athens.[^19]

His voice is unmistakable, argumentative and much given to digression. He makes his case by attacking his rivals and by explaining his heroes, Plato and Hippocrates.[^1] *That the Best Physician Is Also a Philosopher* opens with a jab at doctors who, like athletes longing for an Olympic win without training for it, «ἐπαινοῦσι μὲν γὰρ Ἱπποκράτην, καὶ πρῶτον ἁπάντων ἡγοῦνται», “praise Hippocrates and think him the first of all” (our translation), and then do anything but follow him.[^20] His fiercest words are for the medical sects. Of the followers of Asclepiades, who would not grant that the kidneys make urine, he writes: «δυσαπότριπτόν τι κακόν ἐστιν ἡ περὶ τὰς αἱρέσεις φιλοτιμία καὶ δυσέκνιπτον ἐν τοῖς μάλιστα καὶ ψώρας ἁπάσης δυσιατότερον», in Arthur Brock's translation “so difficult an evil to get rid of is this sectarian partizanship … harder to heal than any itch”.[^21]

### His medicine in plain words

Galen took over the theory of the four humours, the body's fluids: blood, yellow bile, black bile and phlegm. He tied an excess of each to a temperament: sanguine, choleric, melancholic or phlegmatic.[^2] He pictured the body as three linked systems: the brain and nerves, for thought and sensation; the heart and arteries, for life-giving energy; and the liver and veins, for nutrition and growth. Dissecting human bodies was forbidden in his day, so he worked on animals, above all apes, and also pigs, often while they were alive.[^2] In a famous experiment he tied the spinal cord of a live pig to show that the brain is the seat of the soul's ruling part.[^1] To prove that urine comes from the kidneys, he says, tie off the ureters, the tubes from the kidneys to the bladder, in a living animal: later you will find “the bladder empty and the ureters quite full and distended”.[^21]

Behind it all lay one conviction: «μηδὲν ὑπὸ τῆς φύσεως γίγνεσθαι μάτην», “nothing is done by Nature in vain”.[^22] His great work *On the Usefulness of the Parts* sets out to show that every part of the body was purposely, indeed divinely, made for its job.[^1] The same conviction could lead him astray. Some blood, he argued, passes through the wall between the two sides of the heart: «ἐκ τῆς δεξιᾶς κοιλίας εἰς τὴν ἀριστερὰν ἕλκεται τὸ λεπτότατον ἔχοντός τινα τρήματα τοῦ μέσου διαφράγματος αὐτῶν», “the thinnest portion of the blood is drawn from the right ventricle into the left, owing to there being perforations in the septum between them”, though he admits that “it is not possible, however, actually to observe their extreme terminations”.[^22] In the sixteenth century the anatomist Andreas Vesalius showed that the wall is not pierced at all.[^2]

### Why he matters

Galen's views dominated Western medicine for more than 1,300 years.[^2] In ninth-century Baghdad Hunayn ibn Ishaq (808–873) is credited with translating 129 of his works,[^23,2] and doctors writing in Arabic, such as al-Razi, author of *Doubts on Galen*, built on him and argued with him. In the Latin West, which recovered him from the eleventh century on through translations from the Arabic, he became the “Medical Pope of the Middle Ages”. Then, in 1543, Vesalius' *De humani corporis fabrica* corrected his anatomy from human dissection, and the work of William Harvey and others on the circulation of the blood carried knowledge beyond where Galen had left it; yet his advice to let blood for many illnesses stayed influential until well into the nineteenth century.[^2] After the Scientific Revolution the intellectual world largely ignored him. In recent decades scholars have come back to him, for his logic, his ethics and his thinking about mind and body.[^1]`,

  timeline: [
    { year: 129, kind: "writing", what: "Born at Pergamum, the son of an architect", src: [1, 2] },
    { year: 145, approx: true, kind: "writing", what: "His father dreams that Asclepius wants the boy to study medicine (144 or 145)", src: [4, 5] },
    { year: 148, approx: true, kind: "writing", what: "His father dies (148 or 149); Galen studies at Smyrna, Corinth and Alexandria", src: [4, 1] },
    { year: 157, kind: "writing", what: "Doctor to the gladiators of Pergamum, aged twenty-eight", src: [4, 6, 1] },
    { year: 162, approx: true, kind: "writing", what: "Moves to Rome (early 160s)", src: [2, 1] },
    { year: 166, kind: "writing", what: "Slips away from Rome to Pergamum, the year the Antonine Plague reached Rome", src: [7, 8, 4] },
    { year: 168, kind: "writing", what: "Summoned by Marcus Aurelius and Lucius Verus to Aquileia", src: [4, 7] },
    { year: 169, kind: "writing", what: "Stays in Rome to care for Commodus while Marcus is at war (169–176), and writes many of his major works", src: [1, 7] },
    { year: 192, kind: "writing", certainty: "debated", what: "Fire in the Temple of Peace destroys his storehouse of books and drugs (one account says 191)", src: [1, 10, 11, 4] },
    { year: 216, approx: true, kind: "writing", certainty: "debated", what: "Dies, about 216 according to Arabic sources; the traditional date is about 200", src: [2, 1] },
    { year: 850, approx: true, kind: "reception", what: "Hunayn ibn Ishaq and his circle translate Galen into Syriac and Arabic in Baghdad (about 830–870)", src: [2, 23] },
    { year: 1450, approx: true, kind: "copy", what: "The manuscript Vlatadon 14 is copied between 1448 and 1453, from books in a library in Constantinople, Boudon-Millot argues", src: [19] },
    { year: 1490, kind: "print", what: "First collected works in Latin, Venice", src: [12, 2] },
    { year: 1525, kind: "print", what: "First printed Greek text: the Aldine edition, Venice, five folio volumes", src: [12] },
    { year: 1543, kind: "reception", what: "Vesalius' *De humani corporis fabrica* corrects Galen's anatomy", src: [2] },
    { year: 1821, kind: "print", what: "Kühn's edition begins at Leipzig (1821–33): most of the Greek in the Scroll", src: [1, 12, 27] },
    { year: 1914, kind: "print", what: "The Corpus Medicorum Graecorum publishes its first critical edition of Galen", src: [1] },
    { year: 1916, kind: "print", what: "Brock's Loeb *On the Natural Faculties*, the Greek and English in the Scroll", src: [27, 1] },
    { year: 2005, kind: "copy", what: "*On My Own Opinions* and the lost *Avoiding Distress* are found in Vlatadon 14", src: [10] },
    { year: 2010, kind: "print", what: "Boudon-Millot and Jouanna's Budé edition of *Avoiding Distress*", src: [1, 19] },
  ],

  transmission: `**In his own hands.** Galen wrote many of his books for friends and pupils, with no thought of publishing them. Copies went out without his name on them, and some were passed off by others as their own work; that is why he wrote *On My Own Books*.[^16] Late in life he wrote *On My Own Opinions* to do the same for his views.[^10] The fire of 192 destroyed the copies he kept in his storehouse on the Sacred Way.[^11]

**Translations.** Galen's works were not translated into Latin in antiquity, and in the early medieval West few could read them; in the Greek East they went on being studied, and every surviving Greek manuscript of Galen was copied by Byzantine scholars.[^2] The Greek tradition rarely goes back beyond the twelfth century.[^12] After 750 Syrian Christians made the first translations into Syriac and Arabic.[^2] Hunayn ibn Ishaq worked with his nephew Hubaysh: Hunayn put the Greek into Syriac, and Hubaysh the Syriac into Arabic.[^23] So some works survive only in Arabic, and others only in medieval Latin versions made from the Arabic.[^2] *On Medical Experience* is one: it survives in Arabic, first edited by Richard Walzer in 1944,[^14,24] while the Scroll has only a Greek fragment, published by Hermann Schöne in 1901.[^25] The Greek of *Anatomical Procedures* breaks off in book 9, and books 10 to 15 survive only in Arabic.[^14] Its last Greek lines, in the Scroll, explain how the Alexandrian anatomist Herophilus named a part of the brain «ὅπερ Ἡρόφιλος εἴκαζεν ἀναγλυφῇ καλάμου, ᾧ διαγράφομεν», “which Herophilus likened to the groove cut in the reed pen we write with” (our translation).[^26] Latin translators also worked straight from the Greek, among them Burgundio of Pisa and the most important of all, Niccolò da Reggio, at the court of King Robert of Naples in the first half of the fourteenth century.[^2,10]

**A manuscript in Thessaloniki.** In 2005 Antoine Pietrobelli, a doctoral student sent by Véronique Boudon-Millot, found Galen's *On My Own Opinions* listed in the table of contents of Vlatadon 14, a manuscript of the mid-fifteenth century kept at the Vlatadon monastery in Thessaloniki. A little later it turned out to hold *Avoiding Distress* too, a work known until then only by its title. It also has a complete text of *On My Own Books*, known before in Greek (besides an Arabic translation) from only one other manuscript, Ambrosianus gr. 659.[^10] Boudon-Millot argues that Vlatadon 14 was copied from the books of a library in Constantinople, between 1448 and 1453, by followers of the philosopher John Argyropoulos.[^19] It is full of scribal errors and in places damaged by damp, and the French team who first edited it had to work from a microfilm.[^10] *Avoiding Distress* is a letter to an old friend from Pergamum who had asked how Galen bore the loss of his library in the fire.[^10] It was almost certainly written soon after Commodus' death, and says of him that in all of time “fewer evils have happened to men than those which Commodus accomplished in a few years”.[^19]

**Print.** Latin came first: Diomede Bonardo's collection of the medieval Latin translations, printed at Venice in 1490.[^12,2] The first Greek edition followed from the Aldine Press in Venice in 1525, in five folio volumes; a Basel edition of 1538 corrected its plainest mistakes.[^12] René Chartier's edition at Paris (1679, in Boudon's account) ruined its editor.[^12] Kühn's edition (Leipzig, 1821–33) took its text and Latin translation mainly from Chartier's; it prints 122 treatises in Greek with Latin on the facing page, in about 20,000 pages.[^13,12] It has, with a single exception, no record of the manuscript readings, yet it is the edition by whose volume and page Galen is still cited.[^12,14] Its volumes are counted as twenty, as twenty-one plus an index, or as twenty-two, because some came out in two parts: the Scroll's copies of Galen's commentaries on Hippocrates name volumes 17.1, 17.2–18.1 and 18.2.[^1,12,13,27] Since 1914 the Corpus Medicorum Graecorum has been publishing critical editions of Galen work by work, and the French Budé series has its own under way.[^1,10]

**Galen in the Scroll.** The Scroll has 97 works of Galen, and six more under the name Pseudo-Galen. Most of the Greek is Kühn's; some works come from later editions, by Marquardt, Müller, Kalbfleisch, Helmreich, Kaibel, Schöne and others (1879–1928). Only *On the Natural Faculties* has an English translation, Arthur John Brock's of 1916.[^27]`,

  variants: `{debated} **Grief, or distress?** Even the title of the rediscovered letter is disputed: scholars disagree whether it is Περὶ ἀλυπίας or Περὶ ἀλυπησίας, and Paraskevi Kotzia has argued for the first.[^19] In English it goes by *On Freedom from Distress*, *Avoiding Distress* or *On Consolation from Grief*.[^19,1,13] With only one damaged manuscript, editors keep disagreeing about the words: the edition of 2023 discusses some forty places, most of them in this letter, where it departs from earlier editors.[^10]

{debated} **A library at Antium?** At three places (sections 16, 17 and 18 of the Budé edition) the manuscript has forms of the word ἐναντίος, “opposite”. In 2009 C. P. Jones proposed reading ἐν Ἀντίῳ, “at Antium”, which would put a library Galen mentions in the imperial villa at Antium. The reading is popular but disputed: Matthew Nicholls, who works out what it would mean, himself argues against it.[^19]

**A fragment under the wrong name.** Kühn printed, in his fourth volume, a short Greek piece called *On the Substance of the Natural Faculties*, and the Scroll has it under that title.[^28] It is really the last three chapters of Galen's *On My Own Opinions*, which came down under that misleading title in Ambrosianus gr. 659. The rest of the work was known mainly from a medieval Latin version of an Arabic translation and from Niccolò da Reggio's version from the Greek, with a few shorter Greek and Arabic fragments, until Vlatadon 14 gave the whole Greek text.[^10]

{debated} **Is *On Theriac, to Piso* his?** This treatise refers to events of 204; if Galen wrote it, he was still alive then. Some think it spurious, but Nutton believes it genuine.[^2] The Corpus Medicorum Graecorum's list of Galen's works puts it in square brackets, as it does the works wrongly attributed to him, and also lists Boudon-Millot's Budé edition of it;[^14] the Scroll files it under Galen himself.[^29]`,

  editions: [
    { text: "C. G. Kühn, *Claudii Galeni Opera Omnia*, 20 vols, some in two parts (Leipzig, 1821–33; reprinted Hildesheim, 1964–65).[^1,12,27]", note: "Greek with a Latin translation on the facing page; the text of most of Galen's works in the Scroll." },
    { text: "A. J. Brock, *Galen: On the Natural Faculties* (Loeb Classical Library; London and Cambridge, Mass., 1916).[^27,1]", note: "Greek and English; the Greek and the translation in the Scroll." },
    { text: "P. De Lacy, *Galen: On the Doctrines of Hippocrates and Plato* (Corpus Medicorum Graecorum V 4.1.2, 1978–84; second edition 2005).[^1]", note: "One of the critical editions, with English translation, of the Corpus Medicorum Graecorum (Galen volumes since 1914)." },
    { text: "P. N. Singer, *Galen: Selected Works* (Oxford University Press, 1997).[^1]", note: "English translations, among them *On My Own Books* and *That the Best Physician Is Also a Philosopher*." },
    { text: "P. N. Singer (ed.), *Galen: Psychological Writings* (Cambridge University Press, 2013).[^1,19]", note: "Includes Vivian Nutton's English translation of *Avoiding Distress*." },
    { text: "I. Johnston and G. H. R. Horsley, *Galen: Method of Medicine*, 3 vols (Loeb Classical Library, 2011).[^1]", note: "An English translation of his great work on treatment." },
    { text: "V. Boudon-Millot and J. Jouanna, with A. Pietrobelli, *Galien*, tome IV: *Ne pas se chagriner* (Collection des Universités de France; Paris, Les Belles Lettres, 2010).[^1,19]", note: "The Budé edition of the rediscovered letter, with a French translation; Boudon-Millot had first published the Greek text in 2007." },
    { text: "I. Polemis and S. Xenophontos, *Galen: On Avoiding Distress and On My Own Opinions* (Trends in Classics, supplementary volume 151; Berlin and Boston, De Gruyter, 2023).[^10]", note: "A new edition, made from the manuscript itself." },
  ],

  sources: [
    { label: "Stanford Encyclopedia of Philosophy, Galen, by P. N. Singer (2016, revised 2021): his life, the size and losses of the corpus, his style and polemics, the Usefulness of the Parts, the pig experiment, the editions and translations", url: "https://plato.stanford.edu/entries/galen/" },
    { label: "Wikipedia, Galen (his name, Rome, the death-date debate, the humours and the three systems, dissection of apes and pigs, the septum and Vesalius, the translations and Byzantine copies, Hunayn, al-Razi, the Latin edition of 1490, legacy)", url: "https://en.wikipedia.org/wiki/Galen" },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entry γαληνός (read in the site's copy; also on the Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057%3Aentry%3Dgalhno%2Fs" },
    { label: "Lee T. Pearcy, Galen: a Biographical Sketch, Medicina Antiqua (University College London): the dream of 144 or 145, his father's death in 148 or 149, the gladiators 157–161, Pergamum 166–169, Aquileia 168, the fire (given as 191)", url: "https://www.homepages.ucl.ac.uk/~ucgajpd/medicina%20antiqua/Medant/galbio.htm" },
    { label: "Galen, On the Method of Healing 9.4, in the Scroll (philosophy first, then medicine after his father's dreams)", cite: { work: "tlg0057.tlg066", ref: "9.4" } },
    { label: "Galen, On the Composition of Drugs according to Kinds 3.2, in the Scroll (the gladiators of Pergamum and the five high priests)", cite: { work: "tlg0057.tlg077", ref: "3.2" } },
    { label: "Galen, On Prognosis 9, in the Scroll (the flight from Rome, the summons to Aquileia, Commodus, the books written in Marcus' absence)", cite: { work: "tlg0057.tlg083", ref: "9" } },
    { label: "Wikipedia, Antonine Plague (165–180, the Plague of Galen; Galen's journey home in 166 and his brief descriptions)", url: "https://en.wikipedia.org/wiki/Antonine_Plague" },
    { label: "Galen, On Prognosis 11, in the Scroll (the emperor's stomach, and his praise of Galen)", cite: { work: "tlg0057.tlg083", ref: "11" } },
    { label: "Bryn Mawr Classical Review 2025.09.52, Teun Tieleman on I. Polemis and S. Xenophontos, Galen: On Avoiding Distress and On My Own Opinions (De Gruyter, 2023): the find of 2005, Vlatadon 14 and Ambrosianus gr. 659, the fire of 192, On My Own Opinions and its misnamed fragment, the editions", url: "https://bmcr.brynmawr.edu/2025/2025.09.52/" },
    { label: "Galen, On the Composition of Drugs according to Kinds 1.1, in the Scroll (the fire in the precinct of Peace and the storehouse on the Sacred Way)", cite: { work: "tlg0057.tlg077", ref: "1.1" } },
    { label: "Véronique Boudon, First printed editions of Galen, BIU Santé, Paris (archived copy): Kühn's volumes and pages, works lost in Greek, an eighth of Greek literature, the Greek tradition after the twelfth century, the Latin edition of 1490, the Aldine of 1525, Basel 1538, Chartier", url: "https://web.archive.org/web/20140421160949/http://www.bium.univ-paris5.fr/histmed/medica/galien_va.htm" },
    { label: "Wikipedia, Galenic corpus (over 2.6 million words; Kühn's 122 treatises, mainly from Chartier's edition, 22 volumes, over 20,000 pages; the English titles On Consolation from Grief and An Outline of Empiricism)", url: "https://en.wikipedia.org/wiki/Galenic_corpus" },
    { label: "Corpus Medicorum Graecorum (Berlin-Brandenburg Academy), Gesamtübersicht: Galenus und [Galenus], the list of Galen's works and of works attributed to him, with editions and translations (archived copy, 2020)", url: "https://web.archive.org/web/20201024064111/http://cmg.bbaw.de/epubl/online/galges.html" },
    { label: "Pseudo-Galen, Introduction, or the Physician, in the Scroll", cite: { work: "tlg0530.tlg012", ref: "1" } },
    { label: "Roger Pearse, The pain of being Galen; plagiarism in the ancient world (2009), quoting the opening of On My Own Books in P. N. Singer's translation (Galen: Selected Works, 1997)", url: "https://www.roger-pearse.com/weblog/2009/02/27/the-pain-of-being-galen-plagiarism-in-the-ancient-world/" },
    { label: "Galen, On the Powers of Foods 2.9.12, in the Scroll (names as people use them now, rather than old Attic)", cite: { work: "tlg0057.tlg037", ref: "2.9.12" } },
    { label: "Galen, commentary On Hippocrates' In the Surgery 3.33, in the Scroll", cite: { work: "tlg0057.tlg101", ref: "3.33" } },
    { label: "Bryn Mawr Classical Review 2015.07.22, David H. Kaufman on C. K. Rothschild and T. W. Thompson (eds.), Galen's De indolentia: Essays on a Newly Discovered Letter (Mohr Siebeck, 2014): the title, the date of Vlatadon 14, the reading at Antium, the lost word-books, Commodus, the editions", url: "https://bmcr.brynmawr.edu/2015/2015.07.22" },
    { label: "Galen, That the Best Physician Is Also a Philosopher 1, in the Scroll", cite: { work: "tlg0057.tlg003", ref: "1" } },
    { label: "Galen, On the Natural Faculties 1.13, in the Scroll, with A. J. Brock's translation (the Asclepiadeans; the ureters tied in a living animal)", cite: { work: "tlg0057.tlg010", ref: "1.13" } },
    { label: "Galen, On the Natural Faculties 3.15, in the Scroll, with A. J. Brock's translation (nothing in vain; the pits in the septum)", cite: { work: "tlg0057.tlg010", ref: "3.15" } },
    { label: "Wikipedia, Hunayn ibn Ishaq (808–873; 129 works of Galen; Greek into Syriac, and his nephew Hubaysh from Syriac into Arabic)", url: "https://en.wikipedia.org/wiki/Hunayn_ibn_Ishaq" },
    { label: "The Classical Review 59.2 (1945), record of C. Rabin's review of R. Walzer, Galen on Medical Experience: First Edition of the Arabic Version with English Translation and Notes (Oxford University Press, 1944)", url: "https://www.cambridge.org/core/journals/classical-review/article/r-walzer-galen-on-medical-experience-first-edition-of-the-arabic-version-with-english-translation-and-notes-pp-xi164-london-oxford-university-press-for-the-wellcome-trustees-1944-cloth-12s-6d-net/A4B90AAA9A77684E94C3C09B64F25BC2" },
    { label: "Galen, On Medical Experience, the Greek fragment in the Scroll (edited by H. Schöne, Berlin, 1901, as its file header says)", cite: { work: "tlg0057.tlg107", ref: "1" } },
    { label: "Galen, On Anatomical Procedures 9.5, in the Scroll (the last chapter of the Greek text: Herophilus and the reed pen)", cite: { work: "tlg0057.tlg011", ref: "9.5" } },
    { label: "The Scroll's copies of Galen (its catalogue lists 97 works under Galen and six under Pseudo-Galen): each file's header names its source (Kühn's Opera Omnia, Leipzig, 1821–33, by volume, including 17.1, 17.2–18.1 and 18.2; editions by Marquardt, Müller, Kalbfleisch, Helmreich, Kaibel, Schöne and Raeder, 1879–1928; A. J. Brock's Greek text and translation of On the Natural Faculties, Heinemann and Harvard, 1916)", cite: { work: "tlg0057.tlg010", ref: "1.1" } },
    { label: "Galen, On the Substance of the Natural Faculties (from Kühn's volume 4), in the Scroll", cite: { work: "tlg0057.tlg084", ref: "1" } },
    { label: "Galen (attributed), On Theriac, to Piso, in the Scroll", cite: { work: "tlg0057.tlg079", ref: "1" } },
  ],
  outsideQuotes: [
    "calm, esp. of the sea",
    "then later, my father being urged on by vivid dreams, I came to the practice of medicine",
    "though I was young: I was just beginning my twenty-ninth year",
    "I wrote many treatises, philosophical and medical",
    "first among doctors, and alone among philosophers",
    "the whole precinct of Peace burned down, and the great libraries on the Palatine",
    "This is not Galen's language—the title is false.",
    "for my task in these notes is not to teach the young to talk Attic",
    "praise Hippocrates and think him the first of all",
    "Medical Pope of the Middle Ages",
    "which Herophilus likened to the groove cut in the reed pen we write with",
    "fewer evils have happened to men than those which Commodus accomplished in a few years",
  ],
  checked: "2026-10-06",
};
