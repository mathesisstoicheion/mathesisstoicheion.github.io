/**
 * Hesiod. Checked on 2026-10-06 (notes: pipeline/drafts/checked/tlg0020.md). Left out because nothing
 * reliable could be found, or the sources disagree too much: "the first Greek poet to name himself" (kept
 * only as Wikipedia's attributed wording about a poet who sees himself as a persona); the exact year 1280
 * for Laurentianus 32.16 and any date for Vaticanus gr. 915 (Evelyn-White gives only centuries); a tenth-
 * century date for Parisinus gr. 2771 (Evelyn-White says the eleventh; a search snippet said "about 1000",
 * not opened); "the ending of the Theogony from about line 900" as the place where the later part begins
 * (sources give the end as athetized, and West's 965-1020, but not 900); the "Days" (765-828) as "often
 * thought a later appendix" (only Wilamowitz's leaving them out is kept); the exact number of lines the
 * Shield borrows from the Catalogue (Wikipedia 56, Evelyn-White 53: "fifty-odd" is kept); Plutarch's own
 * words rejecting Works and Days 654-662 (reported by Wikipedia and Evelyn-White only); the date of the
 * Lelantine War beyond Wikipedia's "estimates"; Proclus' and Tzetzes' commentaries (no page with details
 * would open); Virgil's Georgics and Hesiod's Roman readers; and the translations whose details were not
 * opened (Lattimore, Athanassakis, Stallings and others listed by Wikipedia). The third-century-BC date of the
 * Schøyen papyrus is the owning collection's own and is given as such.
 */
import type { AuthorArticle } from "../author-articles";

export const hesiod: AuthorArticle = {
  id: "tlg0020",
  summary: `Hesiod was a Greek poet who is generally thought to have been at work between 750 and 650 BC, around the same time as Homer.[^1] He has been called “the first written poet in the Western tradition to regard himself as an individual persona with an active role to play in his subject”.[^1] The historian Herodotus put the two side by side: “these are the ones who taught the Greeks the descent of the gods, and gave the gods their names”.[^2]

### A shepherd on Helicon

The *Theogony*, his poem on the birth of the gods, tells how the Muses met him: “And one day they taught Hesiod glorious song while he was shepherding his lambs under holy Helicon”, «Ἡσίοδον καλὴν ἐδίδαξαν ἀοιδήν».[^3] They are not polite. “Shepherds of the wilderness, wretched things of shame, mere bellies,” they say, and they warn him: «ἴδμεν ψεύδεα πολλὰ λέγειν ἐτύμοισιν ὁμοῖα», “we know how to speak many false things as though they were true”. Then they give him a staff of laurel and breathe into him “a divine voice”.[^3] Because the gift was a staff and not a lyre, ancient and modern readers have guessed that he was not a professionally trained singer.[^1]

The *Works and Days* adds more. His father “left Aeolian Cyme”, on the coast of Asia Minor, fleeing “from wretched poverty which Zeus lays upon men”, and settled in a village under Mount Helicon in Boeotia: «Ἄσκρῃ, χεῖμα κακῇ, θέρει ἀργαλέῃ, οὐδέ ποτʼ ἐσθλῇ», “Ascra, which is bad in winter, sultry in summer, and good at no time”.[^4,1] Hesiod himself was no sailor. He crossed the sea only once, from Aulis to Euboea, for the funeral games of a nobleman of Chalcis, Amphidamas: “And there I boast that I gained the victory with a song and carried off a handled tripod which I dedicated to the Muses of Helicon”.[^4,1,23] Centuries later the traveller Pausanias saw on Helicon, among other tripods, the oldest of them, which was said to be the one Hesiod won.[^5]

The poem is addressed to his brother Perses, and it grows out of a family quarrel: “For we had already divided our inheritance, but you seized the greater share and carried it off, greatly swelling the glory of our bribe-swallowing lords”.[^6]

{debated} How much of this is a real man's life? Some scholars think Perses was invented, a figure for the poet to lecture, and Gregory Nagy reads both “Hesiod” and “Perses” as names for poetic characters.[^1] Glenn Most treats Hesiod as a real person who tells us facts about his life, chosen to serve the poem: “the poet’s self-representation is always in the service of his self-legitimation”.[^7] In 1914 Hugh Evelyn-White, whose text and translation are the ones in the Scroll, even thought the *Theogony* was by a later poet, telling of his own call by the Muses who had once taught Hesiod.[^8]

{debated} His date is not secure either. Plutarch identified Amphidamas with a hero of the Lelantine War between Chalcis and Eretria, and modern estimates for that war fit the usual dates for Hesiod.[^1,9] Which came first, Homer or Hesiod? Most scholars today put Homer first.[^1] M. L. West argued that Hesiod was the older; Richard Janko holds that statistical study of their language puts Homer first beyond reasonable doubt; Most thought the question “probably undecidable”.[^7]

### What he wrote

The *Theogony* tells how the world and the gods came into being, generation by generation, and how Zeus won his power.[^1] It begins with a void: «ἦ τοι μὲν πρώτιστα Χάος γένετʼ», “In truth at first Chaos came to be, but next wide-bosomed Earth”.[^10] It is also the earliest known source for the myth of Prometheus and for the making of the first woman, whom the *Works and Days* calls Pandora.[^1,12]

The *Works and Days* opens with a short hymn to Zeus and then seems to correct the *Theogony*, or at least the older story it told: “So, after all, there was not one kind of Strife alone, but all over the earth there are two”, one who stirs up war and one who drives people to work.[^11,12,7] Then come Pandora, the five ages of mankind from the golden race down to our own race of iron, the fable of the hawk and the nightingale, advice on farming and sailing through the year, and a list of lucky and unlucky days.[^12] Hesiod sighs at the age of iron: “would that I were not among the men of the fifth generation”.[^13]

Nearly all scholars accept these two poems as Hesiod's.[^14] Antiquity gave him many more, from a poem on the seer Melampus to the *Precepts of Chiron*.[^5] The greatest, the *Catalogue of Women*, ran, according to the Byzantine lexicon the *Suda*, to five books of family trees of the heroines who lay with gods and the heroes born to them.[^15] It is lost, but papyri and quotations preserve some 1,300 whole or broken lines.[^15] The last two lines of the *Theogony* are also its first two: «νῦν δὲ γυναικῶν φῦλον ἀείσατε», “sing of the company of women”.[^16,15] {debated} Most scholars now think the *Catalogue* is not Hesiod's. West dated it between 580 and 520 BC; others put it earlier, and Janko close to the *Theogony* itself.[^15]

The third poem that came down whole, the *Shield of Heracles*, tells of Heracles' fight with Cycnus, son of Ares, around a long description of the hero's shield.[^18,8] It begins with the *Catalogue*'s formula, «ἢ οἵη», “Or like her who left home and country and came to Thebes”,[^17] because its first fifty-odd lines were taken from the *Catalogue*.[^18,8] Aristophanes of Byzantium noticed the borrowing and suspected the poem; it is now thought to be by a later poet, of the late seventh or the sixth century BC.[^18,1]

### What reading him is like

Hesiod wrote in the language of epic, Homer's Ionic Greek, with some Aeolic forms but no words that are certainly Boeotian.[^1] His verse is less smooth than Homer's (one scholar speaks of “hobnailed hexameters”), and he uses hundreds of words that Homer never does: 278 in the *Works and Days*, by one count.[^1] M. L. West pictured him as “a surly, conservative countryman, given to reflection, no lover of women or life, who felt the gods' presence heavy about him”.[^1]

He talks in proverbs: «νήπιοι, οὐδὲ ἴσασιν ὅσῳ πλέον ἥμισυ παντὸς», “Fools! They know not how much more the half is than the whole”.[^6] His brother is «μέγα νήπιε Πέρση», “foolish Perses”; in the dictionary LSJ, νήπιος is an infant or child and, of the mind, “childish, silly”.[^19,20] And on work: «τῆς δʼ ἀρετῆς ἱδρῶτα θεοὶ προπάροιθεν ἔθηκαν ἀθάνατοι», “between us and Goodness the gods have placed the sweat of our brows”.[^19]

He loves riddling names for ordinary things, the “quaint allusive phrases” Evelyn-White counted among his charms.[^8] Winter is the season «ὅτʼ ἀνόστεος ὃν πόδα τένδει», “when the Boneless One gnaws his foot”:[^21] LSJ explains that ἀνόστεος, “boneless”, is used here of the polypus, the octopus.[^20] The Roman teacher Quintilian was cool: “Hesiod rarely rises to any height”, yet “his maxims of moral wisdom provide a useful model”.[^22]

### Legends

{legend} The *Contest of Homer and Hesiod* survives in a version of the second century AD, since it mentions Hadrian, but papyri show that the story is older.[^23] At Chalcis, it says, the Greeks wanted Homer crowned, but the king who judged gave the prize to Hesiod, «εἰπὼν δίκαιον εἶναι τὸν ἐπὶ γεωργίαν καὶ εἰρήνην προκαλούμενον νικᾶν», “saying that it was right for the man who called people to farming and peace to win, not the one who told of wars and slaughter” (our translation).[^24] Plutarch tells another version, in which the two poets trade riddles at the funeral of Amphidamas.[^9]

{legend} Thucydides already knew the precinct of Nemean Zeus in Locris “where the poet Hesiod is said to have been killed by the men of that region, an oracle having foretold to him that he should suffer this fate at Nemea”.[^25,1] Pausanias adds that his killers' sister had been ravished, and “some say the deed was Hesiod's, and others that Hesiod was wrongly thought guilty of another's crime”.[^5] Later the people of Orchomenus, struck by plague, were told by Delphi to fetch his bones; a crow showed the place, and his tomb there said “Ascra rich in corn was his native land”.[^26]

### Why he matters

In Aristophanes' comedy *Frogs*, Aeschylus lists the poets who taught something useful: Orpheus, Musaeus, «Ἡσίοδος δὲ γῆς ἐργασίας, καρπῶν ὥρας, ἀρότους», “and Hesiod, the working of the land, the seasons of crops, ploughing” (our translation), and only then Homer.[^27] Greeks of the late fifth and early fourth centuries BC thought these four the oldest poets, in that order.[^1] Today he is read as a major source for Greek myth, and for early Greek farming, economic thought, astronomy and ideas about how the world began.[^1]`,

  timeline: [
    { year: -700, approx: true, kind: "writing", what: "Hesiod at work in Boeotia (usually placed between 750 and 650 BC)", certainty: "debated", src: [1, 7] },
    { year: -600, approx: true, kind: "writing", what: "The *Shield of Heracles* is composed, between the late seventh and the mid sixth century", certainty: "debated", src: [18] },
    { year: -580, approx: true, kind: "writing", what: "The *Catalogue of Women* in West's dating (580–520 BC); others place it earlier", certainty: "debated", src: [15] },
    { year: -300, approx: true, kind: "reception", what: "Praxiphanes, a pupil of Theophrastus, says he found a copy of the *Works and Days* without its opening hymn", src: [28, 29] },
    { year: -250, approx: true, kind: "copy", what: "A scrap of the *Works and Days* on papyrus, dated by the collection that owns it to the third century BC", src: [31] },
    { year: -200, approx: true, kind: "reception", what: "At Alexandria, Aristophanes of Byzantium suspects the *Shield*", src: [18, 30] },
    { year: -150, approx: true, kind: "reception", what: "Aristarchus marks the hymn that opens the *Works and Days* as spurious", src: [28, 30] },
    { year: 130, approx: true, kind: "reception", what: "The *Contest of Homer and Hesiod* in the version we have, which mentions Hadrian", src: [23] },
    { year: 160, approx: true, kind: "reception", what: "Pausanias, travelling in Greece, is shown a lead tablet of the *Works* on Helicon", src: [5, 45] },
    { year: 1050, approx: true, kind: "copy", what: "The Paris manuscript gr. 2771 of the *Works and Days*, of the eleventh century", src: [8] },
    { year: 1310, approx: true, kind: "copy", what: "Vaticanus gr. 1825, an early manuscript of the *Theogony*, dated about 1310 by its watermarks", src: [34] },
    { year: 1480, approx: true, kind: "print", what: "The *Works and Days* first printed at Milan, edited by Bonus Accursius", src: [32, 35, 36] },
    { year: 1496, approx: true, kind: "print", what: "Aldus Manutius prints all three poems at Venice (dated February 1495 in the Venetian calendar)", src: [18, 8, 35] },
    { year: 1914, kind: "print", what: "Evelyn-White's Loeb edition, the Greek and English in the Scroll", src: [40, 7] },
    { year: 1962, kind: "copy", what: "Volume 28 of the *Oxyrhynchus Papyri* nearly doubles the papyri of the lost Hesiodic poems", src: [15] },
    { year: 1966, kind: "print", what: "M. L. West's edition of the *Theogony* with commentary", src: [42, 14] },
    { year: 1967, kind: "print", what: "Merkelbach and West's *Fragmenta Hesiodea*", src: [15] },
    { year: 1978, kind: "print", what: "West's edition of the *Works and Days* with commentary", src: [43] },
    { year: 2006, kind: "print", what: "Glenn Most's new Loeb edition (2006–07; second edition 2018)", src: [7, 14] },
  ],

  transmission: `**In antiquity.** Pausanias was shown, at the spring on Helicon, a lead tablet “mostly defaced by time, on which is engraved the Works”. The Boeotians there said that “Hesiod wrote nothing but the Works”, and that even that poem began without its hymn to the Muses.[^5] The scholars agreed that something was odd. Praxiphanes, a pupil of Theophrastus, said he had come upon a copy that began at the line “so there is not just one race of Strifes”, and Aristarchus put the marks of a spurious passage beside the opening lines.[^28,29] Aristarchus, head of the Library of Alexandria and the most influential of all scholars of Homer,[^30] also wrote a book *On the Date of Hesiod*, arguing that Hesiod was later than Homer.[^7] A book label for a copy of the fifth or sixth century AD lists just three poems, the *Theogony*, the *Works and Days* and the *Shield*, and the *Catalogue* went out of circulation before the Middle Ages.[^15]

**Papyri.** In 1914 Evelyn-White could already say that the papyri on the whole confirmed the medieval manuscripts, while adding new lines to the *Works and Days* and better readings in a few places; their greatest gift was the lost *Catalogue*.[^8] Pieces of more than fifty ancient copies of the *Catalogue* are now known, and the publication of volume 28 of the *Oxyrhynchus Papyri* in 1962 nearly doubled the papyri of the lost Hesiodic poems.[^15] For the *Shield* there are papyri of the first, second and fourth centuries AD.[^18] The collection that owns two scraps with *Works and Days* 360–366 and 378–383 dates them to the third century BC and calls them by far the earliest surviving copy of the poem.[^31]

**Manuscripts.** The *Works and Days* was read far more than the other poems. M. L. West counted something over 260 manuscripts of it, against seventy-odd of the *Theogony* and sixty-odd of the *Shield*, and more than a hundred of those are later than the first printed edition.[^32] The oldest complete manuscripts of the *Theogony* date only from the end of the thirteenth century, and the ones an editor must chiefly rely on are of the fourteenth and fifteenth.[^33] An early example, Vaticanus gr. 1825, is dated about 1310 from its watermarks.[^34] Among the oldest manuscripts of the *Works and Days* in Evelyn-White's list is Paris, Bibliothèque nationale gr. 2771, of the eleventh century.[^8]

**Print.** The *Works and Days* was first printed at Milan around 1480, in a book that also held the *Idylls* of Theocritus, edited by Bonus Accursius.[^32,35,36] (Evelyn-White, in 1914, still named as the first an edition by Demetrius Chalcondyles, which he placed, with question marks, at Milan in 1493.)[^8] Aldus Manutius printed all three poems at Venice in a book dated February 1495 by the Venetian calendar (1496 by ours).[^18,8,35] Among the modern editions are those of Alois Rzach (Leipzig, 1902 and 1913), whose grouping of the manuscripts Evelyn-White followed,[^8] and M. L. West's commentaries on the *Theogony* (1966) and the *Works and Days* (1978), whose text Most's Loeb follows.[^14]`,

  variants: `**The hymn at the start of the *Works and Days*.** The poem as we read it opens with ten lines calling on the Muses to sing of Zeus ([*Works and Days* 1–10](cts:tlg0020.tlg002:1-10)).[^11,12] Praxiphanes knew a copy without them, Aristarchus marked them as spurious, and the Boeotians on Helicon left them out.[^28,5] The Scroll's text prints them.[^11]

{debated} **Where does the *Theogony* end?** The poem as it stands closes by calling on the Muses to sing of women, and runs straight into the *Catalogue*.[^16,15] West treated the end of the *Theogony* as later than Hesiod, dating lines 965–1020 to the late sixth century, and Most's Loeb follows him in marking the end as not genuine; Janko answers that the language and other arguments strongly support Hesiod's authorship.[^15,7]

**Lines some texts have and others lack.** Evelyn-White's text, the one in the Scroll, prints twenty extra lines after *Theogony* 929, numbered 929a–929t, in which “Hera was very angry and quarrelled with her mate” ([*Theogony* 929a–929t](cts:tlg0020.tlg001:929a-929t)). He explains that the first was restored by the scholar Peppmüller and that the other nineteen come from another version of the passage, quoted by Chrysippus as preserved by Galen.[^37,8] In the *Works and Days* he prints four lines found on papyrus, 169a–169d, which say of Cronos “for the father of men and gods released him from his bonds”.[^38,8]

**The manuscripts or the ancient quotation?** At *Theogony* 900 and *Works and Days* 288, West, followed by Most, prints the wording of an ancient quotation rather than that of the manuscripts; Janko calls these ancient misquotations and would keep the manuscripts' text. He also names at least a dozen places where lines that are missing from papyri or from part of the medieval tradition should, in his view, be marked as spurious.[^7]

**The end of the *Works and Days*.** The poem now ends by blessing the man “who discerns the omens of birds and avoids transgression”: «ὄρνιθας κρίνων καὶ ὑπερβασίας ἀλεείνων».[^39] According to the ancient commentator Proclus, a poem on *Divination by Birds* once followed, until Apollonius of Rhodes rejected it.[^8] Even the “Days” have been doubted: Wilamowitz's edition of 1928 left them out.[^12]`,

  editions: [
    { text: "H. G. Evelyn-White, *Hesiod, the Homeric Hymns and Homerica* (Loeb Classical Library, London and New York, 1914).[^40,8]", note: "The Greek text and English translation in the Scroll. A reviewer of its replacement called it “totally outdated”.[^7]" },
    { text: "M. L. West, *Hesiod: Theogony* (Oxford, Clarendon Press, 1966).[^42]", note: "Greek text with a full commentary; the text Most's Loeb follows.[^14]" },
    { text: "M. L. West, *Hesiod: Works and Days*, edited with prolegomena and commentary (Oxford, Clarendon Press, 1978).[^43]", note: "The companion volume for the *Works and Days*.[^14]" },
    { text: "F. Solmsen, *Hesiodi Theogonia, Opera et Dies, Scutum*, with *Fragmenta selecta* edited by R. Merkelbach and M. L. West (Oxford Classical Texts, 1970; second edition 1983; third edition 1990).[^12,44]", note: "The standard Oxford text of the three poems." },
    { text: "R. Merkelbach and M. L. West, *Fragmenta Hesiodea* (Oxford, 1967).[^15,41]", note: "The lost poems: the papyri and the quotations." },
    { text: "G. W. Most, *Hesiod*, 2 vols: *Theogony, Works and Days, Testimonia* and *The Shield, Catalogue of Women, Other Fragments* (Loeb Classical Library 57 and 503, Harvard University Press, 2006–07; second edition 2018).[^7,41,14]", note: "Greek text and English prose translation, with the ancient testimonies about Hesiod." },
    { text: "A. Rzach, *Hesiodi Carmina* (Leipzig, 1902; smaller edition 1913).[^8]", note: "The edition whose classification of the manuscripts Evelyn-White followed." },
  ],

  sources: [
    { label: "Wikipedia, Hesiod (dates, life, the persona debate, Plutarch on Amphidamas, Homer's priority, the works, Hesiod's Greek, reception)", url: "https://en.wikipedia.org/wiki/Hesiod" },
    { label: "Herodotus, Histories 2.53.1–3, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "2.53.1", to: "2.53.3" } },
    { label: "Hesiod, Theogony 1–35, in the Scroll (the Muses on Helicon)", cite: { work: "tlg0020.tlg001", ref: "1", to: "35" } },
    { label: "Hesiod, Works and Days 633–662, in the Scroll (Cyme, Ascra, Chalcis and the tripod)", cite: { work: "tlg0020.tlg002", ref: "633", to: "662" } },
    { label: "Pausanias, Description of Greece 9.31.3–6, in the Scroll (the tripod, the lead tablet, the poems, the death)", cite: { work: "tlg0525.tlg001", ref: "9.31.3", to: "9.31.6" } },
    { label: "Hesiod, Works and Days 35–41, in the Scroll (the inheritance; the half and the whole)", cite: { work: "tlg0020.tlg002", ref: "35", to: "41" } },
    { label: "Bryn Mawr Classical Review 2007.03.31, Richard Janko on G. W. Most, Hesiod: Theogony, Works and Days, Testimonia (Loeb Classical Library 57, 2006)", url: "https://bmcr.brynmawr.edu/2007/2007.03.31/" },
    { label: "H. G. Evelyn-White, Hesiod, the Homeric Hymns and Homerica (1914): introduction, bibliography and notes, Project Gutenberg ebook 348", url: "https://www.gutenberg.org/cache/epub/348/pg348.txt" },
    { label: "Plutarch, The Dinner of the Seven Wise Men 10, in the Scroll (Amphidamas; Homer and Hesiod)", cite: { work: "tlg0007.tlg079", ref: "10" } },
    { label: "Hesiod, Theogony 116–117, in the Scroll", cite: { work: "tlg0020.tlg001", ref: "116", to: "117" } },
    { label: "Hesiod, Works and Days 1–12, in the Scroll (the hymn to Zeus; the two Strifes)", cite: { work: "tlg0020.tlg002", ref: "1", to: "12" } },
    { label: "Wikipedia, Works and Days (contents; the ten-line hymn; editions, including Wilamowitz 1928 and Solmsen's Oxford text)", url: "https://en.wikipedia.org/wiki/Works_and_Days" },
    { label: "Hesiod, Works and Days 174–175, in the Scroll", cite: { work: "tlg0020.tlg002", ref: "174", to: "175" } },
    { label: "Bryn Mawr Classical Review 2019.10.06, Felice Stama on G. W. Most, Hesiod I–II (Loeb Classical Library 57 and 503, second edition, 2018), in Italian", url: "https://bmcr.brynmawr.edu/2019/2019.10.06/" },
    { label: "Wikipedia, Catalogue of Women (five books; the surviving lines; the date and authorship debate; papyri; editions)", url: "https://en.wikipedia.org/wiki/Catalogue_of_Women" },
    { label: "Hesiod, Theogony 1019–1022, in the Scroll (the last lines)", cite: { work: "tlg0020.tlg001", ref: "1019", to: "1022" } },
    { label: "Shield of Heracles 1–57, in the Scroll (the opening taken from the Catalogue)", cite: { work: "tlg0020.tlg003", ref: "1", to: "57" } },
    { label: "Wikipedia, Shield of Heracles (subject, date, the borrowed opening, Aristophanes of Byzantium, papyri, the Aldine of 1495)", url: "https://en.wikipedia.org/wiki/Shield_of_Heracles" },
    { label: "Hesiod, Works and Days 285–292, in the Scroll", cite: { work: "tlg0020.tlg002", ref: "285", to: "292" } },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entries νήπιος, ἀνόστεος and πολύπους (read in the site's copy; also on the Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Hesiod, Works and Days 520–526, in the Scroll (the Boneless One)", cite: { work: "tlg0020.tlg002", ref: "520", to: "526" } },
    { label: "Quintilian, Institutio Oratoria 10.1.52, translated by H. E. Butler (Loeb, 1920–22), on LacusCurtius", url: "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Quintilian/Institutio_Oratoria/10A*.html" },
    { label: "Wikipedia, Contest of Homer and Hesiod (date, Alcidamas, papyri, the verdict)", url: "https://en.wikipedia.org/wiki/Contest_of_Homer_and_Hesiod" },
    { label: "The Contest of Homer and Hesiod, in the Scroll (Greek only)", cite: { work: "tlg1252.tlg002", ref: "1" } },
    { label: "Thucydides, History 3.96.1, in the Scroll", cite: { work: "tlg0003.tlg001", ref: "3.96.1" } },
    { label: "Pausanias, Description of Greece 9.38.3–4, in the Scroll (the bones and the tomb at Orchomenus)", cite: { work: "tlg0525.tlg001", ref: "9.38.3", to: "9.38.4" } },
    { label: "Aristophanes, Frogs 1030–1036, in the Scroll (Greek only)", cite: { work: "tlg0019.tlg009", ref: "1030", to: "1036" } },
    { label: "Living Poets (Durham University): scholion on Hesiod, Works and Days, prolegomena (p. 2 Pertusi), Greek and English: Aristarchus and Praxiphanes on the opening hymn (copy in the Internet Archive's Wayback Machine, February 2025)", url: "http://web.archive.org/web/20250218085307/https://livingpoets.dur.ac.uk/w/index.php/Scholion,_Hesiod_Works_and_Days_Prolegomena_Ac,_p._2_Pertusi" },
    { label: "Wikipedia, Praxiphanes (pupil of Theophrastus about 322 BC; a commentary on the Works and Days)", url: "https://en.wikipedia.org/wiki/Praxiphanes" },
    { label: "Wikipedia, Aristarchus of Samothrace (about 220–143 BC; the most influential scholar of Homer)", url: "https://en.wikipedia.org/wiki/Aristarchus_of_Samothrace" },
    { label: "The Schøyen Collection, MS 5068: Hesiod, Erga kai Hemerai (papyrus, third century BC, by the collection's dating)", url: "https://www.schoyencollection.com/papyri-ostraca-collection/greek/hesiod-erga-kai-hemerai-ms-5068" },
    { label: "M. L. West, “The Medieval Manuscripts of the Works and Days”, The Classical Quarterly 24.2 (1974) 161–185: opening page (Cambridge Core)", url: "https://www.cambridge.org/core/journals/classical-quarterly/article/medieval-manuscripts-of-the-works-and-days/7E5558E108E7AC03E9020749EC473696" },
    { label: "M. L. West, “The Medieval and Renaissance Manuscripts of Hesiod's Theogony”, The Classical Quarterly 14.2 (1964) 165–189: opening page (Cambridge Core)", url: "https://www.cambridge.org/core/journals/classical-quarterly/article/medieval-and-renaissance-manuscripts-of-hesiods-theogony/82F9CBFCD1945F226A5245A3A90CDD36" },
    { label: "Wikipedia, Theogony (manuscripts: Vaticanus gr. 1825, about 1310)", url: "https://en.wikipedia.org/wiki/Theogony" },
    { label: "Wikipedia, List of editiones principes in Greek (Works and Days, Milan, about 1482, ed. Bonus Accursius; the Aldine Hesiod, 1495–96)", url: "https://en.wikipedia.org/wiki/List_of_editiones_principes_in_Greek" },
    { label: "Dizionario Biografico degli Italiani (Treccani), Bonaccorso da Pisa: his Theocritus with Hesiod's Works and Days", url: "https://www.treccani.it/enciclopedia/bonaccorso-da-pisa_%28Dizionario-Biografico%29/" },
    { label: "Hesiod, Theogony 924–930, with the extra lines 929a–929t, in the Scroll", cite: { work: "tlg0020.tlg001", ref: "924", to: "930" } },
    { label: "Hesiod, Works and Days 169–169d, in the Scroll", cite: { work: "tlg0020.tlg002", ref: "169", to: "169d" } },
    { label: "Hesiod, Works and Days 826–828, in the Scroll (the last lines)", cite: { work: "tlg0020.tlg002", ref: "826", to: "828" } },
    { label: "Perseus's copies of Hesiod shown in the Scroll: each file's header names its source (Evelyn-White, Hesiod, the Homeric Hymns and Homerica, Loeb Classical Library, Heinemann and Macmillan, 1914)", cite: { work: "tlg0020.tlg002", ref: "1" } },
    { label: "Bryn Mawr Classical Review 2007.10.44, Matthew Fox on G. W. Most, Hesiod: The Shield, Catalogue of Women, Other Fragments (Loeb Classical Library 503, 2007)", url: "https://bmcr.brynmawr.edu/2007/2007.10.44/" },
    { label: "The Journal of Hellenic Studies 88 (1968) 144–150, G. S. Kirk and M. Robertson's review of Hesiod, Theogony, ed. M. L. West (Oxford, Clarendon Press, 1966): record on Cambridge Core", url: "https://www.cambridge.org/core/journals/journal-of-hellenic-studies/article/hesiod-theogony-ed-m-l-west-oxford-the-clarendon-press-1966-pp-xiii-459-4-10s/6CA2A1ACB3DE1031E727F57D89AA935F" },
    { label: "The Classical Review 29.2 (1979) 202–206, Malcolm Davies's review of M. L. West, Hesiod, Works and Days (Oxford, Clarendon Press, 1978): record on Cambridge Core", url: "https://www.cambridge.org/core/journals/classical-review/article/abs/hesiod-m-l-west-hesiod-works-and-days-edited-with-prolegomena-and-commentary-pp-xiv-400-oxford-clarendon-press-1978-15/BF4C90348ECEC198037F481CFCC6500A" },
    { label: "CiNii Books, library record of Hesiodi Theogonia, Opera et dies, Scutum, ed. F. Solmsen, Fragmenta selecta ed. R. Merkelbach and M. L. West (Oxford, second edition, 1983)", url: "https://ci.nii.ac.jp/ncid/BA26560092" },
    { label: "Wikipedia, Pausanias (geographer) (about 110–180; travelled in Greece from about 150)", url: "https://en.wikipedia.org/wiki/Pausanias_(geographer)" },
  ],
  outsideQuotes: [
    "the first written poet in the Western tradition to regard himself as an individual persona with an active role to play in his subject",
    "the poet’s self-representation is always in the service of his self-legitimation",
    "probably undecidable",
    "hobnailed hexameters",
    "a surly, conservative countryman, given to reflection, no lover of women or life, who felt the gods' presence heavy about him",
    "childish, silly",
    "quaint allusive phrases",
    "Hesiod rarely rises to any height",
    "his maxims of moral wisdom provide a useful model",
    "saying that it was right for the man who called people to farming and peace to win, not the one who told of wars and slaughter",
    "and Hesiod, the working of the land, the seasons of crops, ploughing",
    "so there is not just one race of Strifes",
    "totally outdated",
  ],
  checked: "2026-10-06",
};
