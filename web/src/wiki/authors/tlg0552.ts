/**
 * Archimedes. Checked on 2026-10-07 (notes: pipeline/drafts/checked/tlg0552.md). Left out because nothing
 * reliable could be opened, or the sources disagree: the price paid for the palimpsest in 1998 ($2 million on
 * one Wikipedia page, $2.2 million on another) and where it is kept now (the CNRS says the Walters Art Museum,
 * Wikipedia says it went back to its owner); Heracleides' identity (Wikipedia doubts the attribution to
 * Heraclides Lembus); Valla's death year (1499 in Heath, 1500 in Heiberg, 1501 in Wilson); the date "1311" for
 * codex B (found only in a search summary); the claim that the Romans sacked the palimpsest's library in 1204;
 * the planetarium Marcellus took to Rome and the Syracusia, the great ship (confirmed, but cut for length);
 * Valerius Maximus' wording of the last words; Galileo's "superhuman" and other later praise; Diodorus on the
 * water-screw (his book 5 is not in the Scroll's copy), so the Egyptian visit is reported through Heath only.
 * The old draft's "double reductio ad absurdum" was not checked and is dropped.
 */
import type { AuthorArticle } from "../author-articles";

export const archimedes: AuthorArticle = {
  id: "tlg0552",
  summary: `Archimedes of Syracuse lived in the third century BC, and historians of mathematics almost all agree that he was the finest mathematician of the ancient world.[^1] Yet very little about his life is certain.[^1] A man called Heracleides wrote a *Life* of him, but it is lost;[^1,2] all that survives are two references to it by Eutocius, a commentator of the sixth century AD, one of them: «ὥς φησιν Ἡρακλείδης ἐν τῷ Ἀρχιμήδους βίῳ», “as Heracleides says in his Life of Archimedes” (our translation).[^3,1]

### A life in Syracuse

The usual birth date, about 287 BC, is worked out backwards: the Byzantine scholar John Tzetzes says that he lived seventy-five years, and he died in 212.[^1,2] His city, Syracuse, was a Greek port on the east coast of Sicily.[^4] In the *Sand-Reckoner*, listing earlier astronomers' estimates of the size of the sun, he mentions «Φειδία δὲ τοῦ ἁμοῦ πατρὸς», “Pheidias my father”, in a modern correction of the manuscripts (see *Where editors disagree*).[^5,2] Nothing else is known about Pheidias.[^1] Plutarch calls Archimedes a kinsman and friend of Hiero II, the king of Syracuse,[^6] while Cicero makes him a man of humble origins.[^1,7]

He sent his discoveries as letters to mathematicians in Alexandria, in Egypt: to the astronomer Conon of Samos, to Conon's pupil Dositheus, and to Eratosthenes, the head of the great Library.[^1,2] The letters are personal. The *Quadrature of the Parabola* opens with grief: «Ἀκούσας Κόνωνα μὲν τετελευτηκέναι, ὃς ἧν οὐδὲν ἐπιλείπων ἁμῖν ἐν φιλίᾳ», “Having heard that Conon had died, who never fell short of us in friendship” (our translation).[^8]

{debated} Did he study in Alexandria himself? Heath thought so, from a remark of the historian Diodorus that Archimedes invented the water-screw on a visit to Egypt; more recent accounts say it is unknown whether he ever went.[^2,1]

### The engineer and the siege

{legend} Plutarch tells how Archimedes wrote to Hiero that any given weight could be moved by a given force, and boasted «εἰ γῆν εἶχεν ἑτέραν, ἐκίνησεν ἂν ταύτην μεταβὰς εἰς ἐκείνην»: “if there were another world, and he could go to it, he could move this.”[^6] Hiero asked for a demonstration, and Archimedes, sitting at a distance, drew a loaded three-masted merchant ship towards him with a set of compound pulleys.[^6] The later mathematician Pappus gives the boast in its famous form: “Give me a place to stand on, and I can move the earth.”[^2,1]

In 214 or 213 BC, during Rome's second war with Carthage, Syracuse broke with Rome, and a Roman army and fleet under Marcus Claudius Marcellus attacked it.[^1,4] The historian Polybius says that the Romans had not reckoned «μία ψυχὴ τῆς ἁπάσης ἐστὶ πολυχειρίας ἐν ἐνίοις καιροῖς ἀνυστικωτέρα», that “in certain circumstances, the genius of one man is more effective than any numbers whatever”.[^9] Catapults for every range, loopholes for archers, and cranes that dropped stones of ten talents or lifted ships by the prow with an iron hand beat off the assault; in the eight months of siege that followed, the Romans never again dared to storm the city.[^9,10] Marcellus joked about fighting “this geometrical Briareus”, a hundred-handed giant of myth, and his men grew so afraid that the sight of a rope or a beam above the wall sent them running.[^10]

{debated} Plutarch adds that Archimedes thought these machines “mere accessories of a geometry practised for amusement” and would not write about them.[^6,11] Modern scholars generally see this as Plutarch's own Platonist view rather than Archimedes'.[^1]

{legend} The burning mirrors come later. Lucian, in the second century AD, is the first to say that Archimedes set the Roman ships on fire: «τὰς τῶν πολεμίων τριήρεις καταφλέξαντα τῇ τέχνῃ», “burned the ships of the enemy by means of his science”, with no word of mirrors.[^12,1] The three earliest accounts of the siege, by Polybius, Livy and Plutarch, do not mention them at all.[^1] Galen, later in the second century, is the first to mention mirrors, and about AD 500 the architect Anthemius of Tralles tried to work out how such mirrors could have been made.[^1,13]

### Death and the tomb

Syracuse fell in 212 BC.[^1,4] Plutarch knew three stories of Archimedes' death. In the first, a soldier ordered him to come to Marcellus, and “Archimedes refused to do until he had worked out his problem and established his demonstration”, so the soldier killed him.[^14] In the second he begged for time to finish; in the third he was carrying instruments to Marcellus and was killed by soldiers who thought the box held gold.[^14] It was generally agreed, Plutarch says, that Marcellus grieved for him and honoured his family.[^14] Livy has him killed by a soldier who did not know who he was, while he was intent on figures drawn in the dust.[^1,2]

{legend} The famous last words, “Do not disturb my circles”, are found in no ancient source.[^1]

He is said, Plutarch reports, to have asked for his grave to carry “a cylinder enclosing a sphere”, with the proportion between them.[^11] That proportion is the result he announced to Dositheus in *On the Sphere and Cylinder*: the cylinder that just holds a sphere «αὐτός τε ἡμιόλιός ἐστιν τῆς σφαίρας», “is itself half as large again as the sphere” (our translation).[^15,1] In 75 BC Cicero, then a quaestor (a junior financial officer) in Sicily,[^16] went looking for the tomb. The Syracusans said it did not exist.[^7] He found it near the Agrigentine gate, hidden by brambles and thickets, and knew it by a small column carved with a sphere and a cylinder.[^7] He called Archimedes a *humilem homunculum*, “a humble little man”, whom he would “call up from his dust and drawing-rod” (*a pulvere et radio excitabo*; our translation).[^7]

### “Eureka”

{legend} The best-known story comes from the Roman architect Vitruvius, writing some two centuries later.[^1] Hiero suspected that a goldsmith had mixed silver into a golden crown.[^17] Archimedes noticed the water overflowing as he got into a bath, and “leapt out of the vessel in joy, and, returning home naked”, shouted εὕρηκα, “I have found it”.[^17] Plutarch tells it more briefly: thinking in the bath of how to measure the crown, «οἷον ἔκ τινος κατοχῆς ἢ ἐπιπνοίας ἐξήλατο βοῶν εὕρηκα», “he leaped up as one possessed or inspired, crying, I have found it”.[^18]

### What he wrote

The Scroll has thirteen works under his name: *On the Sphere and Cylinder*, *Measurement of a Circle*, *On Conoids and Spheroids*, *On Spirals*, *On the Equilibrium of Planes*, the *Sand-Reckoner*, the *Quadrature of the Parabola*, *On Floating Bodies*, the *Stomachion*, the *Method*, the *Book of Lemmas*, the *Cattle Problem* and some fragments.[^19] Others are lost, among them *On Sphere-Making*, a work on thirteen semi-regular solids, and the *Principles* sent to Zeuxippus.[^1]

*Measurement of a Circle* pins down what we call π: «Παντὸς κύκλου ἡ περίμετρος τῆς διαμέτρου τριπλασίων ἐστὶ καὶ ἔτι ὑπερέχει ἐλάσσονι μὲν ἢ ἑβδόμῳ μέρει τῆς διαμέτρου, μείζονι δὲ ἢ δέκα ἑβδομηκοστομόνοις», “The perimeter of every circle is three times the diameter and exceeds it by less than a seventh of the diameter but by more than ten seventy-firsts” (our translation).[^20] He got there by drawing polygons of up to 96 sides inside and outside the circle.[^1]

The *Sand-Reckoner*, addressed to King Gelon, Hiero's son, begins: «Οἴονταί τινες, βασιλεῦ Γέλων, τοῦ ψάμμου τὸν ἀριθμὸν ἄπειρον εἶμεν τῷ πλήθει», “There are some, king Gelon, who think that the number of the sand is infinite in multitude”.[^5,2] To show that it is not, Archimedes builds a way of naming huge numbers and fills a whole universe with sand: the answer, in modern terms, is 8 × 10⁶³ grains.[^1] On the way he reports that Aristarchus of Samos supposed «τὰν δὲ γᾶν περιφέρεσθαι περὶ τὸν ἅλιον κατὰ κύκλου περιφέρειαν», “that the earth revolves about the sun in the circumference of a circle”.[^5,2]

The *Method*, a letter to Eratosthenes, lets us see how he found his results. He imagined figures balanced against each other on a lever, and only then proved the results by strict geometry: «Καὶ γάρ τινα τῶν πρότερόν μοι φανέντων μηχανικῶς ὕστερον γεωμετρικῶς ἀπεδείχθη», “certain things first became clear to me by a mechanical method, although they had to be demonstrated by geometry afterwards”.[^21,22,1]

### Reading him

Archimedes wrote in Doric, the dialect of Syracuse.[^1,2] You can hear it in the line about Aristarchus above: the earth is γᾶ, not the Attic γῆ, and the sun ἅλιος, not ἥλιος; and in the text editors print, his father is ἁμός, “my”, a word the dictionary marks as especially Doric, though at that spot it is a modern correction of the manuscripts (see *Where editors disagree*).[^23,2] Copyists slowly wore the dialect away.[^2] By the sixth century Eutocius, finding in an old book some theorems that seemed to be Archimedes' own, noticed that they «ἐν μέρει δὲ τὴν Ἀρχιμήδει φίλην Δωρίδα γλῶσσαν ἀπέσωζον», kept “in part Archimedes' favourite Doric dialect”.[^24,2]

Archimedes knew his readers. The *Sand-Reckoner* ends: «Ταῦτα δέ, βασιλεῦ Γέλων, τοῖς μὲν πολλοῖς καὶ μὴ κεκοινωνηκότεσσι τῶν μαθημάτων οὐκ εὔπιστα φανήσειν ὑπολαμβάνω», “I conceive that these things, king Gelon, will appear incredible to the great majority of people who have not studied mathematics”.[^25,2]

### Why he matters

His works reached the Islamic world and medieval Europe in Arabic and Latin, and inspired the scientists of the Renaissance and the seventeenth century.[^1] Today the Fields Medal, awarded for outstanding achievement in mathematics, carries his head, his name in Greek capitals, ΑΡΧΙΜΗΔΟΥΣ, and on the back a sphere inscribed in a cylinder.[^26]`,
  timeline: [
    { year: -287, approx: true, kind: "writing", what: "Born at Syracuse, about 287 BC (worked out from Tzetzes' seventy-five years)", certainty: "debated", src: [1, 2] },
    { year: -214, kind: "writing", what: "Syracuse breaks with Rome; Marcellus attacks, and Archimedes' engines beat off the assault (214 or 213 BC)", certainty: "debated", src: [1, 4, 9] },
    { year: -212, kind: "writing", what: "Syracuse falls; Archimedes is killed by a Roman soldier", src: [1, 4, 14] },
    { year: -75, kind: "reception", what: "Cicero, quaestor in Sicily, finds the neglected tomb with its sphere and cylinder", src: [16, 7] },
    { year: 150, approx: true, kind: "reception", what: "Lucian is the first to say that Archimedes burned the Roman ships", src: [1, 12] },
    { year: 530, approx: true, kind: "copy", what: "Isidore of Miletus is believed to gather the works at Constantinople; Eutocius writes his commentaries in the same century", src: [1, 27] },
    { year: 850, approx: true, kind: "copy", what: "Codex A, the lost source of most Renaissance copies, is written (Heiberg: mid-ninth century; Heath: ninth or tenth)", certainty: "debated", src: [28, 29, 2] },
    { year: 950, approx: true, kind: "copy", what: "Codex C, the future palimpsest, is copied at Constantinople", src: [27] },
    { year: 1229, kind: "copy", what: "Codex C is scraped and rewritten as a prayer book (a note in it is dated 13 April 1229)", src: [27] },
    { year: 1269, kind: "copy", what: "William of Moerbeke translates Archimedes into Latin at Viterbo", src: [29, 30] },
    { year: 1544, kind: "print", what: "First printed edition, Greek and Latin (Basel: Herwagen, ed. Venatorius); codex A is last heard of the same year", src: [31, 32, 28] },
    { year: 1773, kind: "print", what: "Lessing publishes the *Cattle Problem* from a manuscript at Wolfenbüttel", src: [33, 32] },
    { year: 1880, kind: "print", what: "J. L. Heiberg's first critical edition (Leipzig, 1880–81)", src: [2] },
    { year: 1897, kind: "print", what: "T. L. Heath's English *Works of Archimedes*", src: [2] },
    { year: 1906, kind: "copy", what: "Heiberg studies and photographs the palimpsest in Constantinople and finds the *Method*", src: [27, 1] },
    { year: 1910, kind: "print", what: "Heiberg's second edition, using the palimpsest (1910–15)", src: [27, 28] },
    { year: 1970, kind: "print", what: "Charles Mugler's edition with French translation (1970–72): the Greek text in the Scroll", src: [19, 34] },
    { year: 1998, kind: "copy", what: "The palimpsest is sold at auction in New York; imaging from 1999 to 2008 reveals much more", src: [27] },
    { year: 2004, kind: "print", what: "Reviel Netz's English translation begins with *On the Sphere and Cylinder*", src: [35] },
    { year: 2026, kind: "copy", what: "A lost leaf of the palimpsest is identified in a museum at Blois", src: [36] },
  ],
  transmission: `**Antiquity.** Archimedes' inventions were famous, but his mathematical writings were little known in antiquity outside the circle of Alexandrian mathematicians who read and quoted them.[^1] The geographer Strabo cites a treatise by its title, «ἐν τοῖς περὶ τῶν ὀχουμένων», “in his *On Floating Bodies*” (our translation).[^37] About AD 530, it is believed, Isidore of Miletus, the architect of Hagia Sophia, gathered the works into one collection at Constantinople, and in the same century Eutocius wrote commentaries that opened them to a wider readership;[^1,27] the Scroll has his commentaries on *On the Sphere and Cylinder*, *Measurement of a Circle* and *On the Equilibrium of Planes*.[^24,3] By then the Doric dialect was already wearing away; Heath thought *On the Sphere and Cylinder* and *Measurement of a Circle* were completely recast after Eutocius' time.[^2]

**Arabic and Latin.** In the ninth century the works were translated into Arabic, notably by Thābit ibn Qurra, and in the twelfth century Latin versions followed, among them Gerard of Cremona's translations from the Arabic.[^1] In 1269, at Viterbo, William of Moerbeke translated them straight from the Greek.[^29,30] His own copy survives in the Vatican (Ottoboni latin 1850), and it is so literal that the Greek he was reading can usually be reconstructed.[^29,30]

**Three Byzantine books.** Moerbeke used two Greek manuscripts, both now lost.[^30] One was codex A, which Heiberg believed was written at Constantinople in the middle of the ninth century; Wilson says probably the ninth, Heath the ninth or tenth.[^28,29,2] In the 1490s it belonged to the Venetian humanist Giorgio Valla, then passed to the princes of Carpi; it was last seen in Rome in 1544 and vanished before 1564.[^28,2] It survives only through its copies, of which Wilson counts four from the fifteenth and sixteenth centuries.[^29] The other, codex B, was lost probably in the fourteenth century; its text lives on in Moerbeke's Latin.[^38] The third, codex C, was copied at Constantinople about 950, taken to the Holy Land, and in 1229 scraped and written over as a prayer book.[^27]

**The palimpsest.** In the 1840s the scholar Tischendorf took one leaf of it, now in Cambridge.[^27] In 1899 a catalogue of the Greek Orthodox library in Constantinople printed a few lines of the faint lower text, in which Heiberg recognised Archimedes; in 1906 he came to Constantinople, confirmed it, and had the pages photographed.[^27] It gave the only text of the *Method*, the original Greek of *On Floating Bodies*, a fuller *Stomachion*, and a second witness for *On Spirals*, *On the Sphere and Cylinder* and *Measurement of a Circle*.[^38,27] Then it disappeared: in the 1920s it passed to a private collector in France, suffered from damp and mould, and had forged pictures painted over four pages.[^27] It was sold at auction in New York in 1998; imaging at the Walters Art Museum in Baltimore from 1999 to 2008, with X-rays at Stanford, revealed far more, and in 2008 all the images and transcriptions were put online free of charge.[^27] In March 2026 a missing leaf, with part of *On the Sphere and Cylinder* book 1, was identified in the Musée des Beaux-Arts at Blois.[^36]

**Print.** The first printed edition came out at Basel in 1544 from Johannes Herwagen's press, edited by Thomas Venatorius, in Greek and Latin with Eutocius' commentaries.[^31,32,2] Later editions of the Greek included David Rivault's (Paris, 1615), which gave only the propositions in Greek, and J. Torelli's (Oxford, 1792).[^2] Heiberg's edition (Leipzig, 1880–81), which Heath called definitive, followed,[^2] and his second edition (1910–15) used the palimpsest.[^27,28] The *Method* was first printed by Heiberg in 1907.[^32]`,
  variants: `**Who was his father?** The Scroll's *Sand-Reckoner* names «Φειδία δὲ τοῦ ἁμοῦ πατρὸς», “Pheidias my father”.[^5] That is not what the manuscripts say.[^2] Heath reports that the words are a correction by the scholar Blass for the manuscripts' τοῦ Ἀκούπατρος, “of Akoupatros”; an old marginal note on Gregory of Nazianzus also names Pheidias, a Syracusan astronomer, as Archimedes' father.[^2]

**Discover or publish?** In the *Method* Archimedes credits Eudoxus with the first proof that a cone is a third of a cylinder.[^21,22] The Scroll's text reads «ὧν Εὔδοξος ἐξηύρηκεν πρῶτος τὴν ἀπόδειξιν», which Heath translated as the theorems “the proof of which Eudoxus was the first to discover”.[^21,22] Reviel Netz reports that the new imaging of the palimpsest shows a passage where Heiberg's text makes Eudoxus the first to “discover” a proof and the manuscript makes him the first to “publish” it: one of hundreds of small corrections to Heiberg's reading.[^38]

**Cut or moistened?** In *On Floating Bodies*, where an object lies partly in water, Heiberg printed a word meaning “cut”, *temnesthai*.[^29] Nigel Wilson, working on the new images, read *brekhesthai*, “moistened”, and found that Moerbeke's Latin has *humectetur*, “is moistened”: the medieval translation and the palimpsest confirm each other.[^29]

**How much Doric?** The dialect is uneven from work to work.[^2] The same phrase, “by us”, appears in the ordinary form in *On the Sphere and Cylinder*, «τῶν ὑφʼ ἡμῶν τεθεωρημένων», and in Doric in the *Quadrature*, «νῦν δὲ ὑφʼ ἁμῶν τεθεώρηται».[^15,8] Heath notes that in *On the Sphere and Cylinder* and *Measurement of a Circle* practically all trace of Doric has gone, while the *Sand-Reckoner* has suffered least.[^2]

**Is it his?** The *Book of Lemmas* reached us only through an Arabic translation by Thābit ibn Qurra.[^39,2] Heath argued that it cannot be by Archimedes in its present form, because it quotes him by name, though some of its propositions may go back to him.[^2,39] Since no Greek copy is known, the Greek that the Scroll prints for it is a modern reconstruction in Doric by the scholar E. Stamatis, which Charles Mugler printed beside a seventeenth-century Latin translation, not an ancient text.[^2,41] The *Cattle Problem*, a puzzle in verse addressed to Eratosthenes, is “attributed” to him; it was found by Lessing in a manuscript at Wolfenbüttel and published in 1773.[^33,32] The *Stomachion* survives only in fragments, in an Arabic version and in the palimpsest.[^40]`,
  editions: [
    { text: "C. Mugler, *Archimède*, 4 vols (Paris: Les Belles Lettres, 1970–1972), text established and translated into French.[^19,34]", note: "The Greek text in the Scroll." },
    { text: "J. L. Heiberg, *Archimedis opera omnia cum commentariis Eutocii*, second edition (Leipzig: Teubner, 1910–1915).[^28,27]", note: "The standard critical edition, the first to use the palimpsest; volume III holds Eutocius and the long Latin introduction on the manuscripts." },
    { text: "T. L. Heath, *The Works of Archimedes* (Cambridge University Press, 1897).[^2]", note: "The classic English version, “edited in modern notation”, and freely available." },
    { text: "T. L. Heath, *The Method of Archimedes, Recently Discovered by Heiberg* (Cambridge University Press, 1912).[^22]", note: "A supplement to the 1897 volume, with the newly found *Method* in English." },
    { text: "R. Netz, *The Works of Archimedes*, vol. 1, *The Two Books On the Sphere and the Cylinder* (Cambridge University Press, 2004).[^35]", note: "A close English translation with commentary, the first English translation of Eutocius' commentary, and the first scientific edition of the diagrams, using the palimpsest." },
    { text: "*Archimēdous tou Syrakousiou, Ta mechri nun sōzomena, hapanta* (Basel: Johannes Herwagen, 1544), ed. Thomas Venatorius.[^31,2]", note: "The first printed edition, Greek and Latin, with Eutocius; a scan is online." },
  ],
  sources: [
    { label: "Wikipedia, Archimedes (life, the wreath story, the ship, war machines, the burning mirrors, the death, the tomb, the works, lost and doubtful works, the palimpsest, the Arabic and Latin translations, the first printed edition, later reputation)", url: "https://en.wikipedia.org/wiki/Archimedes" },
    { label: "T. L. Heath, The Works of Archimedes (Cambridge University Press, 1897), Internet Archive: the introduction, chapters I (Archimedes) and II (manuscripts and principal editions, dialect, lost works), and the translation of the Sand-Reckoner", url: "https://archive.org/details/worksofarchimede00arch" },
    { label: "Eutocius, Commentary on the Measurement of a Circle 1.1, in the Scroll (Heracleides' Life of Archimedes)", cite: { work: "tlg4072.tlg002", ref: "1.1" } },
    { label: "Wikipedia, Siege of Syracuse (213–212 BC)", url: "https://en.wikipedia.org/wiki/Siege_of_Syracuse_(213%E2%80%93212_BC)" },
    { label: "Archimedes, The Sand-Reckoner, chapter 1, in the Scroll (King Gelon; Aristarchus; Pheidias the father)", cite: { work: "tlg0552.tlg006", ref: "1" } },
    { label: "Plutarch, Marcellus 14.3–14.9, in the Scroll (Hiero, the boast about moving the earth, the ship and the pulleys, the engines)", cite: { work: "tlg0007.tlg022", ref: "14.3", to: "14.9" } },
    { label: "Cicero, Tusculan Disputations 5.64–66 (Latin text), The Latin Library", url: "https://www.thelatinlibrary.com/cicero/tusc5.shtml" },
    { label: "Archimedes, Quadrature of the Parabola, preface, in the Scroll (to Dositheus, on Conon's death)", cite: { work: "tlg0552.tlg007", ref: "pr" } },
    { label: "Polybius, Histories 8.3.3–8.7.7, in the Scroll (the assault on Syracuse and Archimedes' engines; the eight months)", cite: { work: "tlg0543.tlg001", ref: "8.3.3", to: "8.7.7" } },
    { label: "Plutarch, Marcellus 15.1–17.3, in the Scroll (the engines, the geometrical Briareus)", cite: { work: "tlg0007.tlg022", ref: "15.1", to: "17.3" } },
    { label: "Plutarch, Marcellus 17.4–17.7, in the Scroll (his contempt for engineering, his style, the sphere and cylinder on the grave)", cite: { work: "tlg0007.tlg022", ref: "17.4", to: "17.7" } },
    { label: "Lucian, Hippias 2, in the Scroll (Archimedes burned the enemy's ships)", cite: { work: "tlg0062.tlg002", ref: "2" } },
    { label: "Wikipedia, Archimedes' heat ray", url: "https://en.wikipedia.org/wiki/Archimedes%27_heat_ray" },
    { label: "Plutarch, Marcellus 19.4–19.6, in the Scroll (three accounts of the death)", cite: { work: "tlg0007.tlg022", ref: "19.4", to: "19.6" } },
    { label: "Archimedes, On the Sphere and Cylinder 1, preface, in the Scroll (to Dositheus: the sphere and the cylinder; Conon)", cite: { work: "tlg0552.tlg001", ref: "1.pr" } },
    { label: "Wikipedia, Cicero (quaestor in Sicily in 75 BC)", url: "https://en.wikipedia.org/wiki/Cicero" },
    { label: "Vitruvius, On Architecture 9, preface 9–12, translated by Joseph Gwilt, on LacusCurtius", url: "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Vitruvius/9*.html" },
    { label: "Plutarch, That One Cannot Live Pleasantly according to Epicurus 11 (1094c), in the Scroll (the bath and the crown)", cite: { work: "tlg0007.tlg139", ref: "11" } },
    { label: "The Scroll's Archimedes: the catalogue lists thirteen works, and each file's header names its source, Charles Mugler's Archimède, 4 vols (Paris: Les Belles Lettres, 1970–1972), digitised for Harvard College Library with the University of Leipzig (2018)", cite: { work: "tlg0552.tlg001", ref: "1.1" } },
    { label: "Archimedes, Measurement of a Circle, proposition 3, in the Scroll", cite: { work: "tlg0552.tlg002", ref: "3" } },
    { label: "Archimedes, The Method, to Eratosthenes, preface, in the Scroll", cite: { work: "tlg0552.tlg010", ref: "pr1" } },
    { label: "T. L. Heath, The Method of Archimedes, Recently Discovered by Heiberg: a Supplement to The Works of Archimedes 1897 (Cambridge University Press, 1912), Internet Archive", url: "https://archive.org/details/methodofarchimed00arch" },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entries γᾶ, ἅλιος (C) and ἁμός (read in the site's copy; also on the Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Eutocius, Commentary on the Books On the Sphere and Cylinder, section 37, in the Scroll (the old book that kept 'in part' the Doric dialect)", cite: { work: "tlg4072.tlg001", ref: "37" } },
    { label: "Archimedes, The Sand-Reckoner, chapter 4 (the end), in the Scroll", cite: { work: "tlg0552.tlg006", ref: "4" } },
    { label: "International Mathematical Union, The Fields Medal (description of the medal by Eberhard Knobloch)", url: "https://www.mathunion.org/imu-awards/fields-medal" },
    { label: "Wikipedia, Archimedes Palimpsest (Isidore's compilation, the copy of about 950, the prayer book of 1229, Tischendorf's leaf, Papadopoulos-Kerameus, Heiberg, the disappearance, the forgeries, the 1998 sale, the imaging, the online release)", url: "https://en.wikipedia.org/wiki/Archimedes_Palimpsest" },
    { label: "J. L. Heiberg, Archimedis opera omnia cum commentariis Eutocii, second edition, vol. III (Leipzig: Teubner, 1915), Internet Archive: the Prolegomena on codex A and on William of Moerbeke", url: "https://archive.org/details/archimedisoperao0000jlhe" },
    { label: "Nigel Wilson, The Archimedes Palimpsest: a Progress Report, on the Archimedes Palimpsest project's website (codex A and its copies; Moerbeke's translation; the reading 'moistened')", url: "https://archimedespalimpsest.org/about/scholarship/scholarship_wilson6.php" },
    { label: "Wikipedia, William of Moerbeke (his Archimedes translation of 1269 and the two lost Greek manuscripts)", url: "https://en.wikipedia.org/wiki/William_of_Moerbeke" },
    { label: "Internet Archive, record and scan of the first printed edition (Basel: Johannes Herwagen, 1544), edited by Thomas Venatorius, Greek and Latin, with Eutocius", url: "https://archive.org/details/archimedoustous00arch" },
    { label: "Wikipedia, List of editiones principes in Greek (Archimedes, Basel 1544; the Cattle Problem, 1773; the Method, 1907; the Stomachion, 1915)", url: "https://en.wikipedia.org/wiki/List_of_editiones_principes_in_Greek" },
    { label: "Wikipedia, Archimedes's cattle problem", url: "https://en.wikipedia.org/wiki/Archimedes%27s_cattle_problem" },
    { label: "Perseus Catalog, record of Archimède, tome I, ed. Charles Mugler (Paris: Les Belles Lettres, 1970): 'Texte établi et traduit par Charles Mugler'", url: "https://catalog.perseus.org/catalog/urn:cts:greekLit:tlg0552.tlg001.opp-grc3" },
    { label: "Stanford University, Department of Classics: Reviel Netz, The Works of Archimedes, vol. 1, The Two Books On the Sphere and the Cylinder (Cambridge University Press, 2004)", url: "https://classics.stanford.edu/publications/works-archimedes-volume-1-two-books-sphere-and-cylinder-translation-and-commentary" },
    { label: "CNRS press release, Lost page of the Archimedes Palimpsest identified in Blois, central France (9 March 2026)", url: "https://www.cnrs.fr/en/press/lost-page-archimedes-palimpsest-identified-blois-central-france" },
    { label: "Strabo, Geography 1.3.11, in the Scroll (Archimedes' On Floating Bodies cited by title)", cite: { work: "tlg0099.tlg001", ref: "1.3.11" } },
    { label: "Reviel Netz, Overview: The Importance of the Palimpsest to the Study of Archimedes, on the Archimedes Palimpsest project's website (codices A and B; what the 1906 and 1998 discoveries added; 'publish' for 'discover')", url: "https://archimedespalimpsest.org/about/scholarship/archimedes-manuscript.php" },
    { label: "Wikipedia, Book of Lemmas", url: "https://en.wikipedia.org/wiki/Book_of_Lemmas" },
    { label: "Wikipedia, Ostomachion (the Arabic version and the palimpsest)", url: "https://en.wikipedia.org/wiki/Ostomachion" },
    { label: "Michel Federspiel, review of Charles Mugler, Archimède, tomes II–III, Revue des Études Anciennes 75 (1973) 375–377, on Persée (the Book of Lemmas: E. Stamatis's Doric reconstruction, printed beside a Latin translation)", url: "https://www.persee.fr/doc/rea_0035-2004_1973_num_75_3_3946_t1_0375_0000_2" },
  ],
  outsideQuotes: [
    "as Heracleides says in his Life of Archimedes",
    "Pheidias my father",
    "Having heard that Conon had died, who never fell short of us in friendship",
    "Give me a place to stand on, and I can move the earth",
    "is itself half as large again as the sphere",
    "a humble little man",
    "call up from his dust and drawing-rod",
    "leapt out of the vessel in joy, and, returning home naked",
    "The perimeter of every circle is three times the diameter and exceeds it by less than a seventh of the diameter but by more than ten seventy-firsts",
    "There are some, king Gelon, who think that the number of the sand is infinite in multitude",
    "that the earth revolves about the sun in the circumference of a circle",
    "certain things first became clear to me by a mechanical method, although they had to be demonstrated by geometry afterwards",
    "in part Archimedes' favourite Doric dialect",
    "I conceive that these things, king Gelon, will appear incredible to the great majority of people who have not studied mathematics",
    "in his On Floating Bodies",
    "the proof of which Eudoxus was the first to discover",
    "Do not disturb my circles",
    "edited in modern notation",
  ],
  checked: "2026-10-07",
};
