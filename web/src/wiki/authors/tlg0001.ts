/**
 * Apollonius of Rhodes. Checked on 2026-10-07 (notes: pipeline/drafts/checked/tlg0001.md). Left out because
 * nothing reliable could be opened, or the sources disagree too much: a birth year ("perhaps c. 295": no ancient
 * source gives one, and modern guesses run from 296 to 235 BC); a date for his headship of the Library; the old
 * draft's claim that the poem is "the only Greek epic" between Homer and the Roman empire (only "the only Hellenistic
 * epic to survive entire" was found); that he "avoids the repetitions of oral epic" and that editors disagree "mainly
 * over Homeric forms" and the geography of Book 4; the Callimachus line-by-line "replies" (Hymn to Apollo 105–113,
 * Argonautica 3.927–947) that older editors read as part of the quarrel; Varro of Atax's date ("c. 60 BC": only his
 * death about 35 BC was found); a modern count of the medieval manuscripts (only Merkel's nineteenth-century count of
 * twenty-six, as Mooney reports it); the papyrus of the Library list (P.Oxy. 1241, 1914), whose scan would not open;
 * Hunter's and Race's own pages (Cambridge and Harvard would not open; library records and a review heading are used);
 * the BMCR review of Hunter's Book IV (the server failed).
 */
import type { AuthorArticle } from "../author-articles";

export const apolloniusRhodius: AuthorArticle = {
  id: "tlg0001",
  summary: `Apollonius of Rhodes was a poet and scholar at Alexandria, the Greek capital of Ptolemaic Egypt, in the third century BC.[^1] He is remembered for one poem, the *Argonautica*: the voyage of Jason and the Argonauts to fetch the Golden Fleece. It is the only epic of the Hellenistic age (the age of the Greek kingdoms that followed Alexander the Great) that survives entire,[^2,3] and Roman poets, Virgil among them, took it as a model.[^1,4]

### A life pieced together from scraps

Almost nothing about him is certain.[^1] What we have are two short ancient *Lives*, copied at the end of the old notes on the poem in its oldest manuscript; an entry in the *Suda*, a Byzantine encyclopaedia of the tenth century; and a list of the Library's heads on a papyrus of the second century AD.[^1,5,6] The *Suda* calls him «Ἀπολλώνιοϲ, Ἀλεξανδρεὺϲ, ἐπῶν ποιητὴϲ, διατρίψαϲ ἐν Ῥόδῳ», “Apollonius, of Alexandria, an epic poet, who spent time in Rhodes” (our translation), and makes him the son of Silleus and a pupil of the poet Callimachus.[^7] The geographer Strabo agrees about his city: he and another scholar, “though Alexandrians, were called Rhodians”.[^8] But Athenaeus and Aelian call him «Ἀπολλώνιος ὁ Ῥόδιος ἢ Ναυκρατίτης», “Apollonius the Rhodian or Naucratian”, after Naucratis, a Greek town some 70 km south of Alexandria on the Nile.[^9,10,1] In ancient lives, “pupil” was often only a way of saying that one poet influenced another.[^1]

{debated} No ancient source gives the year of his birth, and modern guesses have run from 296 BC to as late as 235.[^1,5] The papyrus list names “Apollonius son of Silleus, of Alexandria, called the Rhodian, the disciple of Callimachus” as head of the Library, says that he taught the king, and makes Eratosthenes his successor; its beginning is lost, but Zenodotus is taken to have been head before him.[^6,1] The papyrus calls the king the “first”, which its translator takes as a slip for the third, Ptolemy III, who came to the throne in 247/246 BC.[^6,1] The *Suda* instead makes Apollonius the successor of Eratosthenes, which does not fit; a later librarian, also called Apollonius, may have caused the confusion.[^7,1]

### Rhodes, and a famous quarrel

{legend} The *Lives* tell a story. While still young, Apollonius recited the *Argonautica* at Alexandria and it failed; ashamed, he left for Rhodes, polished the poem, recited it again to great acclaim, and was made a citizen; the first *Life* says that he then called himself a Rhodian in the poem's title, the second that he is called the Rhodian because he made his home and taught there. “Some say”, the second *Life* adds, that he came back to Alexandria, was put in charge of the libraries, and was buried next to Callimachus.[^6,5] Ancient biographers liked to send poets into exile, and the scholar Mary Lefkowitz argues that these tales were probably invented to explain why there were two editions of the poem; the name “of Rhodes” may only mean that he wrote a poem about the island.[^1]

{debated} Then there is the quarrel. The *Suda*'s entry on Callimachus says that his lost poem *Ibis* was aimed «εἴϲ τινα Ἴβον, γενόμενον ἐχθρὸν τοῦ Καλλιμάχου· ἦν δὲ οὗτοϲ Ἀπολλώνιοϲ, ὁ γράψαϲ τὰ Ἀργοναυτικά», “at a certain Ibis, who had become Callimachus' enemy; this was Apollonius, who wrote the Argonautica” (our translation).[^11] An epigram under the name of “Apollonius the grammarian” mocks Callimachus and his *Aetia* (“Causes”): «Καλλίμαχος τὸ κάθαρμα, τὸ παίγνιον, ὁ ξύλινος νοῦς», “Callimachus the scum, the plaything, the wooden brain” (our translation).[^12,1] In 1912 George Mooney, whose Greek text the Scroll uses, wrote that their feud “stands out as the most bitter in the ancient world of letters”.[^5] Most scholars now think it has been greatly exaggerated, if it happened at all: both *Lives* stress the two poets' friendship, the *Ibis* was meant to be obscure, and the epigram may be by another Apollonius.[^1]

### A scholar's poem

Apollonius was also a leading student of Homer. He wrote the period's first scholarly study of Homer, criticising the editions of Zenodotus, and prose works on Archilochus and on problems in Hesiod are credited to him.[^1] Of his other poems, on the founding of cities such as Alexandria, Naucratis, Cnidus and Rhodes, only scraps survive.[^1] Athenaeus quotes a few lines from his *Foundation of Naucratis*, where a sailor called Pompilus, who tried to save a girl from Apollo, is turned into a fish.[^9]

The *Argonautica* runs to four books and fewer than 6,000 lines, much shorter than Homer's epics.[^2] It opens with Apollo: «ἀρχόμενος σέο, Φοῖβε, παλαιγενέων κλέα φωτῶν μνήσομαι», “Beginning with you, Phoebus, I will recall the famous deeds of men born long ago” (our translation), the men who, at King Pelias' command, sailed the Argo «χρύσειον μετὰ κῶας», “after the golden fleece”.[^13] Book 1 gathers the crew and sets out; Book 2 brings them through the Clashing Rocks into the Black Sea and up the river Phasis in Colchis; in Book 3 the king's daughter Medea falls in love with Jason and helps him through his trials; Book 4 is the long, roundabout voyage home, by the Danube, Italy and the deserts of Libya.[^2,3] When he wrote it is disputed too: under Ptolemy II, or a generation later; one study of the stars the poem describes points to 238 BC.[^2,3]

### Reading Apollonius

He writes in Homer's language, but he is no mere copyist. He keeps old epic forms, using the old genitive ending -οιο even more freely than the *Iliad*, yet he coins new forms and stretches Homer's grammar in new directions.[^14] One scholar has called the poem “a kind of poetic dictionary of Homer”.[^1] He talks to the poets of his own day too: one line, «καὶ τὰ μὲν ὧς ἤμελλε μετὰ χρόνον ἐκτελέεσθαι», “And thus were those things to be accomplished in the course of time”, repeats a line of Callimachus' *Aetia* word for word.[^15,2]

His Jason is no Achilles. He is a more human, less heroic leader, and the scholar Hermann Fränkel summed up the crew's repeated despair in one word, ἀμηχανία, “helplessness”.[^1,2,16] The heart of the poem is Medea. Book 3 begins by calling on Erato, the Muse of love poetry: «εἰ δʼ ἄγε νῦν, Ἐρατώ, παρά θʼ ἵστασο», “Come now, Erato, stand beside me” (our translation).[^17,2] Eros shoots her, and «βέλος δʼ ἐνεδαίετο κούρῃ νέρθεν ὑπὸ κραδίῃ, φλογὶ εἴκελον», “the arrow burned deep down in the girl's heart, like a flame” (our translation).[^18] That night, while sailors at sea look out at the Bear and Orion, travellers and gatekeepers long for sleep, and deep sleep wraps even a mother whose children have died, «ἀλλὰ μάλʼ οὐ Μήδειαν ἐπὶ γλυκερὸς λάβεν ὕπνος», “but sweet sleep did not take hold of Medea” (our translation), and her heart leaps like a sunbeam that dances about a house, thrown back from water just poured into a cauldron or a pail.[^19] The critic A. W. Bulloch judged that Apollonius seems to have been the first narrative poet to study “the pathology of love”.[^2]

In Book 4 Medea lures her brother Apsyrtus into a trap and Jason kills him.[^2] Before he tells it, the poet turns on Love himself: «σχέτλιʼ Ἔρως, μέγα πῆμα, μέγα στύγος ἀνθρώποισιν», “Merciless Love, great misery, great horror for mankind” (our translation). At the moment of the killing Medea turns her eyes away and covers herself with her veil, «μὴ φόνον ἀθρήσειε κασιγνήτοιο τυπέντος», “so as not to see her brother struck down and killed” (our translation).[^20,16] The poem ends with a farewell to its heroes, «Ἵλατʼ ἀριστήων μακάρων γένος», “Be gracious, race of blessed heroes” (our translation), as they step ashore at Pagasae, where they set out.[^21,22]

### Why he matters

Ancient critics were cool. The author of the treatise *On the Sublime*, known as Longinus, granted that Apollonius was «ἄπτωτος», a wrestler's word for one who is never thrown, and so “faultless”, but asked: «ἆρ’ οὖν Ὅμηρος ἂν μᾶλλον ἢ Ἀπολλώνιος ἐθέλοις γενέσθαι;», “would you rather be Homer, then, or Apollonius?” (our translation).[^23,16] The Roman teacher Quintilian explained that the scholars' lists of classic poets left him out because they included no poets of their own day, but judged that “his work is by no means to be despised”.[^24]

Roman poets read him closely. Varro of Atax, who died about 35 BC, put the *Argonautica* into Latin; Catullus imitated it constantly in his poem 64, and Virgil made it one of his models for the *Aeneid*.[^25,4,26] The Latin writer Macrobius claimed that Virgil had shaped “librum Aeneidos suae quartum totum paene”, “almost the whole fourth book of his Aeneid” (our translation), on Apollonius, giving Medea's passion for Jason to Dido.[^27] About AD 70 Valerius Flaccus began a new Latin *Argonautica*, a free imitation of the Greek and in places a translation.[^28] Long dismissed in modern times as a mere imitator of Homer, Apollonius has risen again in scholars' esteem.[^1]`,

  timeline: [
    { year: -280, approx: true, kind: "writing", what: "Born in Alexandria or Naucratis, early in the third century BC; no ancient source gives the year", certainty: "debated", src: [1, 5] },
    { year: -246, kind: "writing", what: "Ptolemy III, whom Apollonius probably taught, becomes king (247/246 BC); Eratosthenes, who followed Apollonius as head of the Library, is appointed after this", certainty: "debated", src: [6, 1] },
    { year: -238, approx: true, kind: "writing", what: "One argument, from the stars it describes, dates the *Argonautica* to 238 BC; others place it a generation earlier", certainty: "debated", src: [2, 3] },
    { year: -35, approx: true, kind: "reception", what: "Varro of Atax, who has put the *Argonautica* into Latin, dies about this year", src: [25, 4] },
    { year: -19, kind: "reception", what: "Virgil dies, leaving the *Aeneid* unfinished; its Dido owes much to Medea", src: [29, 27] },
    { year: 70, approx: true, kind: "reception", what: "Valerius Flaccus begins his Latin *Argonautica*", src: [28] },
    { year: 200, approx: true, kind: "copy", what: "Most of the roughly forty-nine papyri of the poem are copied in Egypt, between the first and fourth centuries AD", src: [4] },
    { year: 950, approx: true, kind: "copy", what: "The Florence manuscript L (Laurentianus 32.9), with Aeschylus and Sophocles, is written in the tenth century", src: [30, 5] },
    { year: 1250, approx: true, kind: "copy", what: "The Wolfenbüttel manuscript G and Laurentianus 32.16, of a second family, are written in the thirteenth century", src: [5, 31] },
    { year: 1496, kind: "print", what: "First printed edition, in Greek capitals, edited by Janus Lascaris and printed by Lorenzo de Alopa at Florence, with the scholia", src: [5, 32] },
    { year: 1521, kind: "print", what: "The Aldine edition at Venice", src: [5, 31] },
    { year: 1780, kind: "print", what: "Brunck's edition at Strasbourg, the first truly critical text", src: [5] },
    { year: 1854, kind: "print", what: "Merkel's edition, with Keil's text of the scholia in L", src: [31] },
    { year: 1912, kind: "print", what: "Mooney's edition with commentary (the Greek in the Scroll) and Seaton's Loeb translation", src: [33, 31] },
    { year: 1935, kind: "print", what: "Carl Wendel's edition of the ancient scholia", src: [2] },
    { year: 1961, kind: "print", what: "Hermann Fränkel's Oxford Classical Text", src: [34, 35] },
    { year: 1974, kind: "print", what: "Francis Vian's Budé edition, with Émile Delage's French translation, begins (complete 1981)", src: [2, 36] },
    { year: 2008, kind: "print", what: "William H. Race's new Loeb edition and translation", src: [37] },
  ],

  transmission: `**Ancient readers.** Scholarly comment began almost at once: Chares, a friend of Apollonius, wrote about the poet's sources. At the end of Book 4 the medieval notes (the *scholia*) name three ancient commentators from whom they were drawn: Theon (first century BC), Lucillus of Tarrha (mid-first century AD) and Sophocles (second century AD).[^4,5] Mooney called the scholia as valuable as those on any ancient author: they preserve, among much else, lines of Hesiod that would otherwise be lost.[^5]

**Papyri.** Roughly forty-nine papyri of the poem survive. Most were copied between the first and fourth centuries AD and come from Oxyrhynchus in Egypt; a few take the text on to the seventh or eighth century. Book 1 has by far the most, twenty-four, against nine for Book 2, ten for Book 3 and six for Book 4.[^4]

**Manuscripts.** The chief manuscript is L, Laurentianus 32.9 in Florence, written in the tenth century; it also holds the plays of Aeschylus and Sophocles.[^30,5] Seaton, who dated it to the early eleventh century, called it “far the best authority for the text”.[^31] Next come three thirteenth-century books, Vaticanus 280, G at Wolfenbüttel and Laurentianus 32.16; G and Laurentianus 32.16 go back to a different ancestor; a later hand corrected L from that second kind of text, and quotations in the Byzantine dictionary *Etymologicum Magnum* show that it was as old as the fifth century.[^5,31] In the nineteenth century Merkel counted twenty-six manuscripts, the last twenty-two of them, from the fifteenth and sixteenth centuries, far inferior to the first four.[^5]

**Print.** The first printed edition, edited by Janus Lascaris, came from Lorenzo de Alopa's press at Florence in 1496: the poem in Greek capitals with accents, the scholia in small letters in the margins.[^5,32] The Aldine edition followed at Venice in 1521.[^5,31] Brunck's edition (Strasbourg, 1780) was the first really critical text; he relied above all on manuscripts in Paris.[^5] Merkel's edition of 1854 printed the scholia of L, edited by H. Keil, and Carl Wendel's edition of the scholia followed in 1935.[^31,2] The modern texts are Seaton's in the Oxford series (1900), Hermann Fränkel's (Oxford, 1961) and Francis Vian's (Budé, 1974–81).[^31,34,2]`,

  variants: `**Two editions?** In six places in Book 1 the scholia quote a different text from a προέκδοσις, an “earlier edition”.[^5] At line 515, for instance, the Argonauts sit spellbound by Orpheus' song, «κηληθμῷ· τοῖόν σφιν ἐνέλλιπε θέλκτρον ἀοιδῆς»; our text then has them pour a drink-offering and go to sleep (516–518), before dawn comes and the helmsman Tiphys wakes them. In the earlier edition, the scholia say, the poem went straight from line 515 to four other lines: at the third dawn a wind came from Zeus and Tiphys called the crew aboard; the text then went on at our line 524, so our lines 516–523 were not there.[^5,22] In another place (788–789) the earlier text sat Jason on a δίφραξ, a very rare word for a woman's chair, where ours has the Homeric «κλισμῷ».[^5,38] Mooney and Seaton took the earlier edition to be the poet's own earlier version; Lefkowitz thinks the ancient story of a failed first reading was invented to explain it.[^5,31,1]

**“Your” oracle or a “true” one?** In line 8 of Book 1 the poet, still speaking to Phoebus Apollo, says that Jason came «τεὴν κατὰ βάξιν», “according to your word”, meaning the oracle Pelias had heard. Almost every critic suspected τεήν; Merkel proposed ἐτεήν, “true”, and Seaton's Loeb translates “in accordance with that true report”. Mooney, whose text the Scroll prints, kept the manuscripts' reading: the poet, he argued, wants to show Apollo's hand in the whole voyage.[^5,31,39]

**Two missing lines.** In Book 4 the Scroll's numbering jumps from line 543 to 546. A line about the hero Hyllus (τυτθὸς ἐών ποτ᾽ ἔναιεν, “he lived there as a small boy”) stands in a different place in different manuscripts; L, the tenth-century manuscript in Florence, has it in the margin, with letters to show where it belongs. Brunck printed an arrangement he found in a book by Cardinal Angelus Quirinus, which made two extra lines, 544–545. Later editions kept Brunck's numbering, but, Mooney wrote in 1912, no modern editor had followed his text.[^5,40]

**An editor's correction.** In line 18 of Book 1 the manuscripts say that the old singers ἔτι κλείουσιν, “still celebrate”, the building of the Argo. Brunck changed it to ἐπικλείουσιν, and Seaton and Mooney both print his correction: «νῆα μὲν οὖν οἱ πρόσθεν ἐπικλείουσιν ἀοιδοὶ».[^5,31,39]`,

  editions: [
    { text: "G. W. Mooney, *The Argonautica of Apollonius Rhodius*, edited with introduction and commentary (London: Longmans, Green, 1912).[^33,5]", note: "The Greek text in the Scroll. Not a translation: a Greek text with notes in English." },
    { text: "R. C. Seaton, *Apollonius Rhodius: The Argonautica* (Loeb Classical Library 1; London: Heinemann, 1912).[^31]", note: "Greek text with a prose translation, reprinted many times; also on the Internet Archive." },
    { text: "H. Fränkel, *Apollonii Rhodii Argonautica* (Oxford Classical Texts; Oxford, 1961).[^34,35]", note: "The standard Oxford Greek text." },
    { text: "F. Vian, *Apollonios de Rhodes: Argonautiques*, translated by É. Delage (the last volume by Delage and Vian), 3 vols (Collection Budé; Paris: Les Belles Lettres, 1974–81).[^2,36]", note: "Greek text, French translation and notes." },
    { text: "W. H. Race, *Apollonius Rhodius: Argonautica* (Loeb Classical Library 1; Cambridge, Mass.: Harvard University Press, 2008).[^37,1]", note: "The new Loeb: Greek text and English translation, with the fragments of his other poems." },
    { text: "R. L. Hunter, *Apollonius of Rhodes: Argonautica Book III* (Cambridge Greek and Latin Classics; Cambridge University Press, 1989), and *Argonautica Book IV* (2015).[^41,42,2]", note: "Greek text with commentary in English, for students." },
    { text: "P. Green, *The Argonautika* (University of California Press, 1997; later expanded).[^43,2]", note: "An English verse translation." },
  ],

  sources: [
    { label: "Wikipedia, Apollonius of Rhodes (the ancient lives and their reliability, after M. Lefkowitz; Naucratis; the Library; Rhodes; the quarrel with Callimachus; his scholarship and lost poems; his modern reputation)", url: "https://en.wikipedia.org/wiki/Apollonius_of_Rhodes" },
    { label: "Wikipedia, Argonautica (the plot by books; length; the date; Jason and Fränkel's “helplessness”; Bulloch on love; line 1.1309 and Callimachus; editions, the scholia, translations)", url: "https://en.wikipedia.org/wiki/Argonautica" },
    { label: "Peter Hulse, Apollonius, Argonautica Book 4, Dickinson College Commentaries: Introduction (the date, the poem whole, the route home)", url: "https://dcc.dickinson.edu/apollonius-argonautica/intro/intro" },
    { label: "Peter Hulse, Apollonius, Argonautica Book 4, Dickinson College Commentaries: Reception of the Argonautica (ancient commentators, the papyri, Roman imitators)", url: "https://dcc.dickinson.edu/node/29983" },
    { label: "G. W. Mooney, The Argonautica of Apollonius Rhodius (London: Longmans, Green, 1912), Internet Archive: the introduction (life, manuscripts, scholia, editions), the commentary on 1.8 and 1.18, and Appendix I, The Double Recension", url: "https://archive.org/details/argonauticaedite00apoluoft" },
    { label: "Attalus.org, Lives of Apollonius of Rhodes (the two lives from the scholia, from Wendel's text) and the list of the Library's directors, P.Oxy. 1241, in English", url: "http://www.attalus.org/poetry/lives.html" },
    { label: "The Suda, entry α 3419, Apollonius (Adler's numbering), in the Scroll", cite: { work: "tlg9010.tlg001", ref: "1.A.3419" } },
    { label: "Strabo, Geography 14.2.13, in the Scroll", cite: { work: "tlg0099.tlg001", ref: "14.2.13" } },
    { label: "Athenaeus, The Deipnosophists 7.19 (Kaibel's numbering; Casaubon 7.283), quoting the Foundation of Naucratis, in the Scroll", cite: { work: "tlg0008.tlg001", ref: "7.19" } },
    { label: "Aelian, On the Nature of Animals 15.23, in the Scroll", cite: { work: "tlg0545.tlg001", ref: "15.23" } },
    { label: "The Suda, entry κ 227, Callimachus (Adler's numbering), in the Scroll", cite: { work: "tlg9010.tlg001", ref: "3.Κ.227" } },
    { label: "Testimonia to Callimachus' Aetia: the epigram of “Apollonius”, Greek Anthology 11.275, in the Scroll", cite: { work: "tlg0533.tlg006", ref: "0.1" } },
    { label: "Apollonius, Argonautica 1.1–4, in the Scroll", cite: { work: "tlg0001.tlg001", ref: "1.1", to: "1.4" } },
    { label: "Peter Hulse, Apollonius, Argonautica Book 4, Dickinson College Commentaries: The Language of the Argonautica", url: "https://dcc.dickinson.edu/apollonius-argonautica/intro/language" },
    { label: "Apollonius, Argonautica 1.1309, in the Scroll", cite: { work: "tlg0001.tlg001", ref: "1.1309" } },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entries ἀμηχανία, ἄπτωτος, σχέτλιος and στύγος (read in the site's copy; also on the Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057%3Aentry%3Da)%2Fptwtos" },
    { label: "Apollonius, Argonautica 3.1–5, in the Scroll", cite: { work: "tlg0001.tlg001", ref: "3.1", to: "3.5" } },
    { label: "Apollonius, Argonautica 3.284–298, in the Scroll", cite: { work: "tlg0001.tlg001", ref: "3.284", to: "3.298" } },
    { label: "Apollonius, Argonautica 3.744–760, in the Scroll", cite: { work: "tlg0001.tlg001", ref: "3.744", to: "3.760" } },
    { label: "Apollonius, Argonautica 4.445–467, in the Scroll", cite: { work: "tlg0001.tlg001", ref: "4.445", to: "4.467" } },
    { label: "Apollonius, Argonautica 4.1773–1781, the end of the poem, in the Scroll", cite: { work: "tlg0001.tlg001", ref: "4.1773", to: "4.1781" } },
    { label: "Apollonius, Argonautica 1.512–524, in the Scroll", cite: { work: "tlg0001.tlg001", ref: "1.512", to: "1.524" } },
    { label: "[Longinus], On the Sublime 33.4, in the Scroll (Greek only)", cite: { work: "tlg0560.tlg001", ref: "33.4" } },
    { label: "Quintilian, Institutio Oratoria 10.1.54, translated by H. E. Butler (Loeb, 1920–22), on LacusCurtius", url: "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Quintilian/Institutio_Oratoria/10A*.html" },
    { label: "Wikipedia, Varro Atacinus (82 – about 35 BC; his Latin Argonautica)", url: "https://en.wikipedia.org/wiki/Varro_Atacinus" },
    { label: "Peter Hulse, Apollonius, Argonautica Book 4, Dickinson College Commentaries: Ancient Scholarly Perspectives (Longinus, Catullus, Virgil, Macrobius)", url: "https://dcc.dickinson.edu/apollonius-argonautica/intro/scholarly-perspectives" },
    { label: "Macrobius, Saturnalia 5.17.4, Latin text on LacusCurtius", url: "https://penelope.uchicago.edu/Thayer/L/Roman/Texts/Macrobius/Saturnalia/5*.html" },
    { label: "Wikipedia, Valerius Flaccus (his Argonautica, begun about AD 70; a free imitation of Apollonius)", url: "https://en.wikipedia.org/wiki/Valerius_Flaccus_(poet)" },
    { label: "Wikipedia, Aeneid (written 29–19 BC; unfinished when Virgil died in 19 BC)", url: "https://en.wikipedia.org/wiki/Aeneid" },
    { label: "Biblissima, Florence, Biblioteca Medicea Laurenziana, Plut. 32.9 (tenth century; Sophocles, Aeschylus, Apollonius Rhodius)", url: "https://iiif.biblissima.fr/collections/manifest/1fdd391bd6dc0adca9472aea0d71aec3dc37e49a" },
    { label: "R. C. Seaton, Apollonius Rhodius: The Argonautica (Loeb Classical Library; London: Heinemann; first printed 1912, this copy the reprint of 1919), Internet Archive: introduction, bibliography and notes", url: "https://archive.org/details/argonautica01apol" },
    { label: "Wikipedia, List of editiones principes in Greek (Apollonius Rhodius: Florence, 1496, Laurentius de Alopa, edited by Janus Lascaris, with the scholia)", url: "https://en.wikipedia.org/wiki/List_of_editiones_principes_in_Greek" },
    { label: "The Scroll's copy of the Argonautica: its file header names its source (Mooney's edition, London: Longmans, Green, 1912)", cite: { work: "tlg0001.tlg001", ref: "1.1" } },
    { label: "Wikipedia, Hermann Fränkel (his Oxford Classical Text of Apollonius, 1961)", url: "https://en.wikipedia.org/wiki/Hermann_Fr%C3%A4nkel" },
    { label: "Internet Archive, library record of Apollonii Rhodii Argonautica, ed. Hermann Fränkel (1961)", url: "https://archive.org/details/bwb_KR-524-324" },
    { label: "Open Library, record of Apollonios de Rhodes, Argonautiques, tome 2, Livre 3 (Paris: Les Belles Lettres, 1980)", url: "https://openlibrary.org/works/OL26531349W" },
    { label: "Exemplaria Classica 16 (2012), Evina Sistakou's review of W. H. Race (ed.), Apollonius Rhodius, Argonautica (Loeb Classical Library 1; Harvard University Press, 2008), on Propylaeum", url: "https://www.propylaeum.de/recensio-antiquitatis/rezensionen/zeitschriften/exemplaria-classica/16-2012/ReviewMonograph476756318" },
    { label: "Apollonius, Argonautica 1.788–789, in the Scroll", cite: { work: "tlg0001.tlg001", ref: "1.788", to: "1.789" } },
    { label: "Apollonius, Argonautica 1.5–19, in the Scroll", cite: { work: "tlg0001.tlg001", ref: "1.5", to: "1.19" } },
    { label: "Apollonius, Argonautica 4.538–548, in the Scroll (the numbering skips 544–545)", cite: { work: "tlg0001.tlg001", ref: "4.538", to: "4.548" } },
    { label: "Open Library, record of R. L. Hunter (ed.), Apollonius of Rhodes: Argonautica Book III (Cambridge Greek and Latin Classics; Cambridge University Press, 1989)", url: "https://openlibrary.org/works/OL7981836W" },
    { label: "Open Library, record of R. Hunter (ed.), Apollonius of Rhodes: Argonautica Book IV (Cambridge University Press, 2015)", url: "https://openlibrary.org/works/OL21100967W" },
    { label: "Open Library, record of P. Green, The Argonautika: The Story of Jason and the Quest for the Golden Fleece (University of California Press, 1997; later printings 2007 and 2008)", url: "https://openlibrary.org/works/OL8303207W" },
  ],
  outsideQuotes: [
    "Apollonius, of Alexandria, an epic poet, who spent time in Rhodes",
    "Apollonius son of Silleus, of Alexandria, called the Rhodian, the disciple of Callimachus",
    "at a certain Ibis, who had become Callimachus' enemy; this was Apollonius, who wrote the Argonautica",
    "Callimachus the scum, the plaything, the wooden brain",
    "stands out as the most bitter in the ancient world of letters",
    "Beginning with you, Phoebus, I will recall the famous deeds of men born long ago",
    "after the golden fleece",
    "a kind of poetic dictionary of Homer",
    "And thus were those things to be accomplished in the course of time",
    "Come now, Erato, stand beside me",
    "the arrow burned deep down in the girl's heart, like a flame",
    "but sweet sleep did not take hold of Medea",
    "the pathology of love",
    "Merciless Love, great misery, great horror for mankind",
    "so as not to see her brother struck down and killed",
    "Be gracious, race of blessed heroes",
    "would you rather be Homer, then, or Apollonius?",
    "his work is by no means to be despised",
    "librum Aeneidos suae quartum totum paene",
    "almost the whole fourth book of his Aeneid",
    "far the best authority for the text",
    "according to your word",
    "in accordance with that true report",
    "he lived there as a small boy",
    "still celebrate",
    "earlier edition",
  ],
  checked: "2026-10-09",
};
