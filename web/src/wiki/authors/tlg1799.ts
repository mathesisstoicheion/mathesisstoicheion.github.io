/**
 * Euclid. Checked on 2026-10-07 (notes: pipeline/drafts/checked/tlg1799.md). Written afresh from the old site's
 * draft, every claim compared with a source that was opened and read. Left out because no source could be opened
 * or the claim could not be confirmed: Vitrac's French translation (Paris, 1990–2001; only a search summary of its
 * first volume was seen); "used in schools into the twentieth century" (the sources say only that the Elements
 * fell out of favour as a textbook in the nineteenth century); "translated at Baghdad" (the sources name the caliphs,
 * not the city); "easier Greek than he looks"; birth and death years, an Athenian education and a post at the Museum
 * (modern guesses, not ancient statements); the Scroll's epigram ascribed to Euclid (nothing on its authorship was
 * found); Wilbur Knorr's words on the "genuine" text (read only as quoted on Wikipedia); Proclus' Greek for the
 * "royal road" (read only on Wikipedia, with a misprint).
 */
import type { AuthorArticle } from "../author-articles";

export const euclid: AuthorArticle = {
  id: "tlg1799",
  summary: `Euclid (in Greek Εὐκλείδης, Eukleides) wrote the *Elements*, often called the most successful textbook ever written,[^1] and yet almost nothing is known about the man himself.[^2] The writings that survive under his name fill eight volumes of the Teubner series of Greek texts, but none of them has a preface or a letter that speaks about its author, and no surviving writer of his own day mentions him as a living person.[^3]

### A man known from later writers

The fullest account was written in the fifth century AD, more than seven hundred years later, by Proclus, a philosopher who wrote a commentary on Book 1 of the *Elements*.[^4,2] Proclus says that Euclid “put together the Elements, collecting many of Eudoxus' theorems, perfecting many of Theaetetus'”, that he lived “in the time of the first Ptolemy”, king of Egypt, and that he was “younger than the pupils of Plato but older than Eratosthenes and Archimedes”.[^4] Proclus was reasoning, not remembering: he had no direct knowledge of Euclid's birthplace or of the dates of his birth and death.[^4] From his clues, modern historians place Euclid at about 300 BC.[^4,2]

{debated} Even that is uncertain. The historian Alexander Jones argues that Proclus “was grasping at straws” and that Euclid seems to have lived several decades later than the usual date.[^3] The first certain mention of Euclid by another writer is a criticism: Apollonius of Perga, in the preface to his *Conics*, says that Euclid had solved only “an accidental fragment” of a certain problem, “and even that was not felicitously done”.[^3] Pappus, a mathematician of about AD 320, says that Apollonius “spent a very long time with the pupils of Euclid at Alexandria”.[^4,3] Heath took this to make it certain that Euclid taught at Alexandria; Jones points out that Pappus does not quite say that Euclid lived there, and that he was inclined to present his guesses as facts.[^4,3]

{debated} One line in Archimedes may name him. In the Scroll's text of *On the Sphere and Cylinder*, a step of a proof is justified «διὰ τὸ β΄ τοῦ α΄ τῶν Εὐκλείδου», “by the second proposition of the first book of Euclid” (our translation).[^5] Heiberg, the great editor of Euclid, believed the words were genuine, though Heath admits they look “somewhat suspicious”; Jones calls the reference “manifestly an interpolation”, words added by a later hand.[^4,3]

{legend} Two stories about him come from late writers, Proclus and Stobaeus. King Ptolemy asked whether there was a shorter way into geometry than the *Elements*, and Euclid answered “that there was no royal road to geometry”. A beginner who had learnt the first theorem asked what he would gain from it, and Euclid told his slave: “Give him threepence, since he must make gain out of what he learns.”[^4] The same royal-road story is told of Alexander the Great and the geometer Menaechmus, and such tales prove nothing about who met whom.[^4,3] For centuries Euclid was also confused with Euclid of Megara, a philosopher of Plato's day,[^4,2] and medieval Arabic writers gave him a colourful but unverifiable life story.[^2]

### What he wrote

The *Elements* is in thirteen books: plane geometry in Books 1–6, numbers in Books 7–10 (Book 10 deals with lengths that cannot be measured against one another), and solid geometry in Books 11–13.[^2] The Greek title, Στοιχεῖα, is the plural of στοιχεῖον, a word for the simple sounds or letters that make up a syllable; in geometry it meant “the propositions whose proof is involved in the proof of other propositions”.[^6] The same title was used for geometrical books by Hippocrates of Chios, Leon and Theudios, now lost.[^6,1] A late commentator on Aristotle, Elias, calls Euclid simply ὁ στοιχειωτής, “the author of the Elements”.[^6] Much of the content is older than Euclid, from mathematicians such as Eudoxus, Hippocrates of Chios and Theaetetus.[^2] Two further books found in the manuscripts are not his: Book 14 is probably by Hypsicles, who lived in the second century BC, and Book 15 may have been written by a pupil of Isidore of Miletus.[^1,7]

Three other works survive in Greek and can be read in the Scroll: the *Data*, on what is “given” in a geometrical problem, the *Optics*, the earliest surviving Greek treatise on perspective, and the *Phaenomena*, an astronomy of the sphere.[^2] A fourth, *On Divisions* of figures, survives only in part, in Arabic (and some have doubted that it is his), and the *Conics*, the *Porisms*, the *Pseudaria* (on false proofs) and the *Surface Loci* are lost.[^2] The *Optics* begins by assuming that we see along «τὰς ἀπὸ τοῦ ὄμματος ἐξαγομένας εὐθείας γραμμὰς», “the straight lines drawn out from the eye” (our translation).[^8]

{debated} Some works under his name may not be his. Heath thought the *Catoptrics*, on mirrors, was not genuine, and Heiberg suspected that in its present form it might be Theon's; Heath accepted the *Division of the Canon*, on musical intervals, though Paul Tannery argued against it.[^4] The Scroll lists the *Division of the Canon* as spurious.[^9] Jones suspects that the *Optics*, the *Catoptrics* and the *Division of the Canon* were all wrongly given to Euclid in antiquity.[^3]

### Reading the Elements

Book 1 begins with definitions, twenty-three of them in the Scroll's text.[^10] The first two are only a few words long: «σημεῖόν ἐστιν, οὗ μέρος οὐθέν», “A point is that which has no part”, and «γραμμὴ δὲ μῆκος ἀπλατές», “A line is breadthless length”.[^10] Then come five postulates, things the reader is asked to grant, such as “To draw a straight line from any point to any point”, and the common notions, truths that hold beyond geometry, such as «τὰ τῷ αὐτῷ ἴσα καὶ ἀλλήλοις ἐστὶν ἴσα», “Things which are equal to the same thing are also equal to one another”.[^10,2]

The fifth postulate is much longer than the others: “That, if a straight line falling on two straight lines make the interior angles on the same side less than two right angles, the two straight lines, if produced indefinitely, meet on that side on which are the angles less than the two right angles.”[^10] Already Proclus thought it “ought even to be struck out of the Postulates altogether; for it is a theorem involving many difficulties”.[^4] For centuries mathematicians tried to prove it from the other four and failed; in 1829 Nikolai Lobachevsky published a geometry built on a different version of it, one of the non-Euclidean geometries.[^1]

Everything else is proved. A proposition follows a fixed pattern: the general statement, the setting-out with a lettered figure, a restatement for that figure, the construction, the proof and the conclusion.[^1] The very first shows it. It opens «ἐπὶ τῆς δοθείσης εὐθείας πεπερασμένης τρίγωνον ἰσόπλευρον συστήσασθαι», “On a given finite straight line to construct an equilateral triangle”; then “Let AB be the given finite straight line”, and “Thus it is required to construct an equilateral triangle on the straight line AB”. Two circles are drawn, one round each end, and the point where they cross gives the third corner.[^11] (Euclid never proves that the circles do cross; it is one of the unstated assumptions later critics found.)[^1] The proposition ends «ὅπερ ἔδει ποιῆσαι», “(Being) what it was required to do”.[^11] A theorem ends instead with ὅπερ ἔδει δεῖξαι, “which was to be shown”, put into Latin as *quod erat demonstrandum*, Q.E.D.[^12]

Some of the most famous results in mathematics are here. [Book 1, Proposition 47](cts:tlg1799.tlg001:1.prop.47) is the theorem of Pythagoras:[^1] «ἐν τοῖς ὀρθογωνίοις τριγώνοις τὸ ἀπὸ τῆς τὴν ὀρθὴν γωνίαν ὑποτεινούσης πλευρᾶς τετράγωνον ἴσον ἐστὶ τοῖς ἀπὸ τῶν τὴν ὀρθὴν γωνίαν περιεχουσῶν πλευρῶν τετραγώνοις», “In right-angled triangles the square on the side subtending the right angle is equal to the squares on the sides containing the right angle”.[^13] Book 9 proves that the prime numbers never run out:[^2] «οἱ πρῶτοι ἀριθμοὶ πλείους εἰσὶ παντὸς τοῦ προτεθέντος πλήθους πρώτων ἀριθμῶν», “Prime numbers are more than any assigned multitude of prime numbers”.[^14] And the last proposition of Book 13 shows that “no other figure, besides the said five figures, can be constructed which is contained by equilateral and equiangular figures equal to one another”: there are only five regular solids.[^15]

### A textbook for two thousand years

By the second century AD the doctor Galen and the philosopher Alexander of Aphrodisias cite Euclid's *Elements* by name, sometimes saying which of its books they mean, a sign that it had become the standard school text and was arranged much as we have it.[^3] It was put into Arabic around AD 800, in the reign of Harun al-Rashid, and from Arabic into Latin by Adelard of Bath around 1120; its first books became standard in the medieval universities.[^1,4] The first printed edition came out at Venice in 1482, “the first printed mathematical book of any importance”.[^4,16] More than a thousand editions have followed, a number estimated to be second only to the Bible's.[^1] The first English translation appeared in 1570 and the first Chinese one, by Matteo Ricci and Xu Guangqi, in 1607.[^1,4] In the nineteenth century the *Elements* fell out of favour as a school book, though Charles Dodgson, better known as Lewis Carroll, defended it in *Euclid and His Modern Rivals* (1879).[^1]

And still, as Jones puts it, Euclid remains “the most faceless of the great Hellenistic mathematicians”.[^3]`,

  timeline: [
    { year: -300, approx: true, kind: "writing", certainty: "debated", what: "Euclid at work, according to Proclus under the first Ptolemy (a date some historians would move later)", src: [4, 3] },
    { year: -250, approx: true, kind: "copy", what: "Potsherds found at Elephantine in Egypt, of the third century BC, deal with two propositions of Book 13: the oldest trace of the *Elements*", src: [1] },
    { year: -185, approx: true, kind: "reception", what: "Apollonius' *Conics*, with the first certain mention of Euclid (about 185 BC, give or take a decade, by G. J. Toomer's argument as Jones reports it)", src: [3] },
    { year: 100, approx: true, kind: "copy", certainty: "debated", what: "The papyrus P. Oxy. 29, with Book 2, Proposition 5, is written in Egypt (now dated AD 75–125; once dated to about AD 300)", src: [17, 4] },
    { year: 370, approx: true, kind: "copy", what: "Theon of Alexandria makes his edition, the source of nearly all later manuscripts", src: [18, 4] },
    { year: 450, approx: true, kind: "reception", what: "Proclus writes his commentary on Book 1, with the fullest ancient account of Euclid", src: [4, 2] },
    { year: 800, approx: true, kind: "reception", what: "Al-Hajjaj translates the *Elements* into Arabic in the reign of Harun al-Rashid", src: [4, 1] },
    { year: 888, kind: "copy", what: "Stephen the cleric finishes the Bodleian manuscript, the oldest dated copy of a classical Greek author", src: [19, 4] },
    { year: 900, approx: true, kind: "copy", certainty: "debated", what: "The Vatican manuscript P (Vat. gr. 190), the one copy free of Theon's edition, is written (ninth century for the Vatican Library, tenth for Heiberg and Heath)", src: [20, 4] },
    { year: 1120, approx: true, kind: "reception", what: "Adelard of Bath translates the *Elements* from Arabic into Latin", src: [4, 1] },
    { year: 1482, kind: "print", what: "First printed edition, in Latin, by Erhard Ratdolt at Venice", src: [4, 16] },
    { year: 1533, kind: "print", what: "First printed Greek text, edited by Simon Grynaeus at Basel", src: [4, 1] },
    { year: 1570, kind: "print", what: "Henry Billingsley's English translation, with a preface by John Dee", src: [4, 1] },
    { year: 1607, kind: "print", what: "Matteo Ricci and Xu Guangqi publish the first Chinese translation (Books 1–6)", src: [1] },
    { year: 1808, kind: "reception", what: "François Peyrard notices the Vatican manuscript P, sent to Paris under Napoleon", src: [4, 1] },
    { year: 1829, kind: "reception", what: "Lobachevsky publishes a geometry built on a different form of Euclid's fifth postulate", src: [1] },
    { year: 1883, kind: "print", what: "Heiberg's edition of the Greek text begins (1883–88): the Greek in the Scroll", src: [21, 22] },
    { year: 1908, kind: "print", what: "Heath's English translation and commentary: the English in the Scroll", src: [22, 4] },
    { year: 1969, kind: "print", what: "Heiberg's text revised by Evangelos Stamatis (1969–77)", src: [23] },
  ],

  transmission: `**Ancient copies.** The oldest traces of the *Elements* are potsherds of the third century BC from Elephantine in Egypt that deal with two propositions of Book 13, and an Epicurean critique of geometry by Demetrius Lacon, found among the papyri of Herculaneum, which quotes phrases and proofs close to Book 1 (though, as Jones points out, without naming Euclid).[^1,3] Papyrus copies from Roman Egypt are few, about five, but the *Elements* is the only Greek work of proof-based mathematics of which any papyri are known.[^3] The best known, P. Oxy. 29, was found at Oxyrhynchus by Grenfell and Hunt in 1897 and holds the statement of Book 2, Proposition 5 with its figure; it was first dated to about AD 300, and is now dated to AD 75–125.[^17,4]

**Theon's edition.** In the fourth century AD Theon of Alexandria, the father of Hypatia, made a new edition of the *Elements*.[^18] Most of the medieval manuscripts say in their titles that they come “from the edition of Theon” or “from the lectures of Theon”.[^4] Theon made the text smoother and more complete: he added steps, whole propositions and alternative proofs, and reworded Euclid's Greek to a standard form; according to Heath's summary of Heiberg, the little word “is” alone was added 600 times.[^4,18]

**The manuscripts.** The oldest dated copy is in Oxford: Bodleian MS. D'Orville 301, copied by Stephen the cleric and finished in September 888, the Theonine text of Books 1–15. Arethas, bishop of Caesarea, bought it for fourteen gold coins and added many notes; the library calls it “the oldest manuscript of a classical Greek author to carry a precise date”.[^19,4] Only one Greek manuscript escapes Theon's edition: P, Vat. gr. 190 in the Vatican Library, which the library dates to the ninth century and Heiberg and Heath to the tenth.[^20,4] Among the other main witnesses Heiberg used are F in Florence (tenth century) and V in Vienna (probably twelfth).[^4]

**Through Arabic and Latin.** The Arabic translation of al-Hajjaj was made in the reign of Harun al-Rashid (786–809) and again, revised, for the caliph al-Ma'mun; a later translation by Ishaq ibn Hunain was improved by Thabit ibn Qurra.[^4,1] Adelard of Bath put it from Arabic into Latin around 1120, and the Latin version of Campanus, made before 1260, ruled the Latin tradition until Greek manuscripts became available.[^4,1]

**Print.** Erhard Ratdolt printed Campanus' Latin at Venice in 1482, the first printed edition; Ratdolt's dedication explains that mathematical books were rarely printed because of the difficulty of printing the figures.[^4,16] The Greek text was first printed by Simon Grynaeus at Basel in 1533, from two manuscripts that Heath counts “among the worst”, yet it remained the basis of later Greek editions for a long time.[^4] When Napoleon was having manuscripts sent from Italian libraries to Paris in 1808, François Peyrard obtained P and saw its excellence; his edition in Greek, Latin and French (Paris, 1814–18) adopted many of its readings.[^4,24] J. L. Heiberg's edition (Leipzig, 1883–88) took P as the most authentic witness, but followed the other manuscripts where he suspected P was wrong.[^21,1] Its Greek is the text in the Scroll, and T. L. Heath's translation of 1908 was made from it.[^22,4]`,

  variants: `**Theon's own confession.** In his commentary on Ptolemy, Theon says that a theorem about sectors of circles has been proved “by me in my edition of the Elements”. Nearly every manuscript has that extra part of Proposition 6.33; P does not, and at Proposition 13.6 the first hand in P wrote in the margin: “This theorem is not given in most copies of the new edition, but is found in those of the old.”[^4] The Scroll's [Proposition 6.33](cts:tlg1799.tlg001:6.prop.33) follows P and has no sectors.[^25]

**Words in a definition.** The Greek definition of the circle in the Scroll includes the words «ἣ καλεῖται περιφέρεια», “which is called the circumference”; Heath's English leaves them out: “A circle is a plane figure contained by one line such that all the straight lines falling upon it from one point among those lying within the figure are equal to one another”.[^26,4] All the manuscripts have the words, but Proclus and other ancient writers quote the definition without them, so Heiberg put them in brackets; a papyrus from Herculaneum (no. 1061) has the definition without them too.[^4]

**A proposition that should not be there.** A papyrus fragment of the second or third century AD from the Fayum has Propositions 1.39 and 1.41 one after the other, with no 1.40, though every manuscript has it and Proclus knew it. Heiberg concluded that 1.40 was added by someone who thought there ought to be a proposition there; Euclid never uses it.[^4] In the Scroll, Heath's translation of [Proposition 1.40](cts:tlg1799.tlg001:1.prop.40) stands in square brackets.[^27] The same kind of evidence works the other way: the papyrus P. Oxy. 29 lacks a corollary to Proposition 2.4 found in the Theonine manuscripts, which confirmed Heiberg's view that Theon added it.[^4]

**How many common notions?** The Greek in the Scroll lists nine common notions; Heath's English keeps five, numbering two of them [7] and [8] after their place in the longer list.[^10] Heath explains that three of the extra ones (on equals added to unequals, and on doubles and halves of the same thing) are of the same type as the first three and that Heiberg printed them in brackets, while a fourth of that kind, found in the manuscripts, Heiberg left out altogether; Proclus admitted only five.[^4] The ninth, «καὶ δύο εὐθεῖαι χωρίον οὐ περιέχουσιν», that two straight lines do not enclose a space, Heath thought an interpolation that had crept into manuscripts and editions.[^10,4]

{debated} **Greek or Arabic?** The Arabic versions are shorter: the Book 1 of al-Hajjaj has 47 propositions, without 1.45, and both Greek versions contain explanations missing from the Arabic.[^4,1] In the nineteenth century M. Klamroth and Heiberg disagreed over whether the Arabic had shortened Euclid or the Greek had been expanded; the historian Wilbur Knorr later sided with Klamroth, suggesting that the Arabic may be closer to the original.[^1]`,

  editions: [
    { text: "J. L. Heiberg, *Euclidis Opera omnia*, vols 1–5, *Elementa* (Leipzig: Teubner, 1883–88).[^22,21]", note: "The Greek text in the Scroll. Later volumes of the same series give the *Data* (1896), the *Optics* (1895) and the *Phaenomena* (1916), also in the Scroll." },
    { text: "T. L. Heath, *The Thirteen Books of Euclid's Elements*, 3 vols (Cambridge University Press, 1908; second edition 1926).[^22,28]", note: "The English in the Scroll: a translation from Heiberg's text with a long introduction and commentary." },
    { text: "E. S. Stamatis, *Euclidis Elementa post I. L. Heiberg*, vols I–V (Leipzig: Teubner, 1969–77).[^23]", note: "Heiberg's text revised." },
    { text: "R. Fitzpatrick, *Euclid's Elements* (University of Texas at Austin, online).[^29]", note: "Heiberg's Greek with a modern English translation, free to read." },
    { text: "G. R. Morrow, *Proclus: A Commentary on the First Book of Euclid's Elements* (Princeton University Press, 1970; paperback 1992).[^30]", note: "An English translation of Proclus' commentary on Book 1, which holds the fullest ancient account of Euclid.[^4]" },
    { text: "F. Peyrard, *Les œuvres d'Euclide, en grec, en latin et en français* (Paris, 1814–18).[^24,4]", note: "The first edition to use the Vatican manuscript P." },
    { text: "*Preclarissimus liber elementorum Euclidis* (Venice: Erhard Ratdolt, 1482).[^16,4]", note: "The first printed edition, in Campanus' Latin; a scan is on the Internet Archive." },
  ],

  sources: [
    { label: "Wikipedia, Euclid's Elements (Books 14 and 15; the shape of a proposition; the oldest evidence; Theon and the Vatican manuscript; the Arabic and Latin translations and the Klamroth–Heiberg debate; editions and reception)", url: "https://en.wikipedia.org/wiki/Euclid%27s_Elements" },
    { label: "Wikipedia, Euclid (life and the Proclus and Pappus tradition; the confusion with Euclid of Megara; the Arabic legends; the books of the Elements; the other works, surviving and lost)", url: "https://en.wikipedia.org/wiki/Euclid" },
    { label: "Alexander Jones, “Euclid, the Elusive Geometer” (talk at the Euclid and His Heritage Meeting, Clay Mathematics Institute, Oxford, 2005), NYU Faculty Digital Archive", url: "https://archive.nyu.edu/bitstream/2451/63988/2/Jones%202005%20Euclid%20the%20Elusive%20Geometer%20Oxford.pdf" },
    { label: "T. L. Heath, The Thirteen Books of Euclid's Elements, vol. 1 (Cambridge, 1908), Internet Archive: Introduction, chapters 1 (Euclid and the traditions about him), 2 (other works), 5 (the text), 7 (Euclid in Arabia) and 8 (translations and editions); the notes on Definition 15, the common notions, Postulate 5 and Propositions 1.38–41", url: "https://archive.org/details/bub_gb_UhgPAAAAIAAJ" },
    { label: "Archimedes, On the Sphere and Cylinder 1.2, in the Scroll (Greek only)", cite: { work: "tlg0552.tlg001", ref: "1.2" } },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entries στοιχεῖον and στοιχειωτής (read in the site's copy; also on the Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Wikipedia, Hypsicles (c. 190 – c. 120 BC; possibly the author of Book 14)", url: "https://en.wikipedia.org/wiki/Hypsicles" },
    { label: "Euclid, Optics, the opening assumptions, in the Scroll (Greek only)", cite: { work: "tlg1799.tlg009", ref: "pr" } },
    { label: "Division of the Canon, in the Scroll, listed there among Euclid's works as spurious (Greek only)", cite: { work: "tlg1799.tlg015", ref: "pr" } },
    { label: "Euclid, Elements, Book 1: definitions, postulates and common notions, in the Scroll", cite: { work: "tlg1799.tlg001", ref: "1.def.1", to: "1.comm_not.9" } },
    { label: "Euclid, Elements 1.1, in the Scroll", cite: { work: "tlg1799.tlg001", ref: "1.prop.1" } },
    { label: "Wikipedia, Q.E.D. (the Latin translates the Greek ὅπερ ἔδει δεῖξαι)", url: "https://en.wikipedia.org/wiki/Q.E.D." },
    { label: "Euclid, Elements 1.47, in the Scroll", cite: { work: "tlg1799.tlg001", ref: "1.prop.47" } },
    { label: "Euclid, Elements 9.20, in the Scroll", cite: { work: "tlg1799.tlg001", ref: "9.prop.20" } },
    { label: "Euclid, Elements 13.18, in the Scroll", cite: { work: "tlg1799.tlg001", ref: "13.prop.18" } },
    { label: "Internet Archive, Preclarissimus liber elementorum Euclidis (Venice: Erhard Ratdolt, 1482), with its catalogue record", url: "https://archive.org/details/preclarissimusl00eucl" },
    { label: "Wikipedia, Papyrus Oxyrhynchus 29 (found 1897, published 1898; first dated about AD 300, now AD 75–125)", url: "https://en.wikipedia.org/wiki/Papyrus_Oxyrhynchus_29" },
    { label: "Wikipedia, Theon of Alexandria (c. 335–405; his edition of the Elements)", url: "https://en.wikipedia.org/wiki/Theon_of_Alexandria" },
    { label: "Bodleian Libraries, Digital Bodleian record of MS. D'Orville 301 (Euclid, Elements I–XV; 888; the scribe Stephanos; Arethas)", url: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/d4a23501-0b98-4aff-acd6-fe06fe9b62e3.json" },
    { label: "Digital Vatican Library, catalogue record of Vat. gr. 190, part 1 (“sec. IX”)", url: "https://digi.vatlib.it/mss/detail/Vat.gr.190.pt.1" },
    { label: "Internet Archive, catalogue record of Euclidis Opera omnia, vol. 1 (Leipzig: Teubner, 1883): the contents of all the volumes", url: "https://archive.org/details/euclidisoperaomn01eucl" },
    { label: "The copies of Euclid in the Scroll: the file headers name their sources (Heiberg's Teubner text, 1883–88; Heath's translation, Cambridge, 1908; Menge and Heiberg's later volumes, 1895–1916)", cite: { work: "tlg1799.tlg001", ref: "1.def.1" } },
    { label: "Berlin-Brandenburg Academy, GlossGA source record: Euclid, Elementa, ed. E. S. Stamatis post I. L. Heiberg, vols I–V (Leipzig, 1969–77)", url: "https://glossga.bbaw.de/sources/100038" },
    { label: "Internet Archive, catalogue record of F. Peyrard, Les œuvres d'Euclide, en grec, en latin et en français (Paris, 1814–18)", url: "https://archive.org/details/lesoeuvresdeucli01eucl" },
    { label: "Euclid, Elements 6.33, in the Scroll", cite: { work: "tlg1799.tlg001", ref: "6.prop.33" } },
    { label: "Euclid, Elements, Book 1, Definition 15, in the Scroll", cite: { work: "tlg1799.tlg001", ref: "1.def.15" } },
    { label: "Euclid, Elements 1.39–1.41, in the Scroll", cite: { work: "tlg1799.tlg001", ref: "1.prop.39", to: "1.prop.41" } },
    { label: "Internet Archive, record of T. L. Heath, The Thirteen Books of Euclid's Elements, vol. 1 (Cambridge, 1926)", url: "https://archive.org/details/bwb_S0-AHZ-704_1" },
    { label: "Richard Fitzpatrick (University of Texas at Austin), Euclid's Elements: Heiberg's Greek text with an English translation", url: "https://farside.ph.utexas.edu/books/Euclid/Euclid.html" },
    { label: "Princeton University Press, Proclus: A Commentary on the First Book of Euclid's Elements, translated by Glenn R. Morrow (1970; paperback 1992)", url: "https://press.princeton.edu/books/paperback/9780691020907/proclus" },
  ],
  outsideQuotes: [
    "put together the Elements, collecting many of Eudoxus' theorems, perfecting many of Theaetetus'",
    "in the time of the first Ptolemy",
    "younger than the pupils of Plato but older than Eratosthenes and Archimedes",
    "was grasping at straws",
    "an accidental fragment",
    "and even that was not felicitously done",
    "spent a very long time with the pupils of Euclid at Alexandria",
    "by the second proposition of the first book of Euclid",
    "somewhat suspicious",
    "manifestly an interpolation",
    "that there was no royal road to geometry",
    "Give him threepence, since he must make gain out of what he learns.",
    "the propositions whose proof is involved in the proof of other propositions",
    "the author of the Elements",
    "the straight lines drawn out from the eye",
    "ought even to be struck out of the Postulates altogether; for it is a theorem involving many difficulties",
    "which was to be shown",
    "the first printed mathematical book of any importance",
    "the most faceless of the great Hellenistic mathematicians",
    "from the edition of Theon",
    "from the lectures of Theon",
    "the oldest manuscript of a classical Greek author to carry a precise date",
    "among the worst",
    "by me in my edition of the Elements",
    "This theorem is not given in most copies of the new edition, but is found in those of the old.",
    "which is called the circumference",
  ],
  checked: "2026-10-07",
};
