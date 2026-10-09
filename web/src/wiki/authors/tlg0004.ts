/**
 * Diogenes Laertius. Checked on 2026-10-07 (notes: pipeline/drafts/checked/tlg0004.md). Written from the old-site draft, every
 * claim checked against the sources listed. Left out because nothing reliable could be found, or the draft overstated it: that his
 * Greek is "one of the easier texts for a reader moving on from a grammar"; "more than two hundred" sources (Hicks says "the two
 * hundred sources cited"); that the common ancestor of the manuscripts was "damaged"; the shelfmark "Vaticanus gr. 96" for the
 * Vatican excerpts (Dorandi's summary says only "a Vatican MS of the twelfth century"); that "the Suda draws on the work
 * extensively" (Hicks hedges; Marcovich prints passages of the Suda among the Byzantine extracts, and only that is kept); that
 * the authenticity of the Letter to Pythocles is debated, and that repairing Epicurus' letters is "central to the study of
 * Epicureanism" (no source opened says so); the words "loves Plato" given as a quotation (they are no one's translation); a date
 * for Montaigne's remark (the sentence may not be in the first edition of 1580); Stephanus of Byzantium, Cobet and F in the
 * timeline (kept in the prose; the timeline is held to twenty marks); the number of names in P's index of Book 7 (Hicks and
 * Wikipedia's lists differ slightly).
 */
import type { AuthorArticle } from "../author-articles";

export const diogenesLaertius: AuthorArticle = {
  id: "tlg0004",
  summary: `Diogenes Laertius wrote the *Lives and Opinions of Eminent Philosophers*, in ten books.[^1] Many such books were written in antiquity, but by the chance of survival his is the one that remains,[^2] and because so much of what he used is lost, it has become the foremost surviving source for the history of Greek philosophy.[^1] Of the man himself almost nothing is known: who he was, and when and where he was born, is nowhere recorded.[^2]

### A man known only from his book

Even his name is uncertain. The manuscripts call him “Laertius Diogenes”; the order “Diogenes Laertius” is much rarer in ancient writers, and the Byzantine scholar Eustathius calls him simply Laertes.[^1,2] His home town is not recorded.[^1]

{debated} Nor is it clear what “Laertius” means. It might point to a town called Laerte. H. S. Long, writing in 1972, took the prevailing view to be that it was a nickname, taken from the words with which Homer's characters, gods among them, address Odysseus, «διογενὲς Λαερτιάδη», “Zeus-born son of Laertes” (our translation), to tell him apart from the many other men called Diogenes;[^1,3] but Stephen White, his most recent translator, argues at length that he came from the town of Laertes.[^28]

His date has to be worked out from the book itself.[^2] The latest philosopher he names is an otherwise unknown Saturninus, the pupil of Sextus Empiricus: «Σέξτου δὲ διήκουσε Σατορνῖνος ὁ Κυθηνᾶς, ἐμπειρικὸς καὶ αὐτός», “Sextus taught Saturninus called Cythenas, another empiricist.”[^4] Sextus is thought to have flourished about AD 200, and Sopater of Apamea, about 300, already quotes Diogenes; so he is usually placed in the first half of the third century.[^1,2] He never mentions the late revival of Platonism known as Neoplatonism, which he might have been expected to notice in his life of Plato, had it already begun.[^2]

He wrote for someone. In the middle of his book on Plato he turns to his reader: «Φιλοπλάτωνι δέ σοι δικαίως ὑπαρχούσῃ», “as you are an enthusiastic Platonist, and rightly so”.[^5] The reader is a woman,[^2] and in the book on Epicurus he again speaks to one person, «ὥστε σὲ πανταχόθεν καταμαθεῖν τὸν ἄνδρα», “that you may be in a position to study the philosopher on all sides”.[^6,2]

{debated} Hicks thought it a natural guess that this lady was the patron for whom the whole work was meant. By his day scholars had proposed only two names for her: an Arria mentioned by the doctor Galen, and the empress Julia Domna, who died in AD 217.[^2]

{debated} He nowhere claims to have studied philosophy himself, or to belong to one of the schools. Because he once writes of “our Apollonides of Nicaea”, some have taken him for a Sceptic; others think he copied the words from a Sceptic writer without marking the quotation.[^2,7]

### Ten books of lives

The work opens with the view of some that philosophy began among foreigners: the Magi of Persia, the Chaldaeans, the naked sages of India and the Druids of the Celts.[^8,2] Diogenes will have none of it: “These authors forget that the achievements which they attribute to the barbarians belong to the Greeks, with whom not merely philosophy but the human race itself began.”[^8]

Then he sets out his plan. «Φιλοσοφίας δὲ δύο γεγόνασιν ἀρχαί», “philosophy, the pursuit of wisdom, has had a twofold origin”: an Ionian line, which starts with Anaximander, the pupil of Thales, and an Italian line, which starts with Pythagoras, who worked mostly in Italy.[^9] The Ionian line ends, he says, with Clitomachus, Chrysippus and Theophrastus, the Italian with Epicurus.[^9] Where we speak of a school of philosophy, the Greeks spoke of a “succession”, each master handing on the teaching to a pupil, like a family tree.[^2]

Book 1 tells of the Seven Sages, such as Thales and Solon; Book 2 of the early Ionians, Socrates and his followers; Book 3 of Plato alone; Book 4 of Plato's Academy; Book 5 of Aristotle and his school, the Peripatetics; Book 6 of the Cynics; Book 7 of the Stoics; Book 8 of Pythagoras and his followers; Book 9 of Heraclitus, the Eleatics, the atomists and the Sceptics; and Book 10 of Epicurus.[^1,2] Those who belong to neither line are «τῶν σποράδην, ὥς φασι», “the so-called sporadic philosophers”.[^10] One result is that the earliest thinkers are scattered over four books, 1, 2, 8 and 9.[^2] Plato and Epicurus each have a whole book, swelled less by stories than by extra material: an introduction to Plato's dialogues and doctrines in Book 3, and in Book 10 long extracts from Epicurus' own writings.[^2]

### Where his stories came from

Diogenes was a compiler, borrowing, copying and excerpting.[^2] He cites some two hundred earlier writers, but how many of them he read for himself nobody can tell.[^2] His chief authorities seem to have been Favorinus, the most famous sophist of his day and a friend of Plutarch, and Diocles of Magnesia; he also drew, directly or through others, on Hellenistic biographers such as Antigonus of Carystus, Hermippus and Sotion, and on the verse chronicle of Apollodorus of Athens.[^1,2] Now and then he tells us that he looked something up himself: «ἐγὼ δʼ εὗρον ἐν τοῖς Ὑπομνήμασι Φαβωρίνου», “I found in the Memorabilia of Favorinus”.[^11,2] Besides stories he copied documents: decrees, epitaphs, letters, and the wills of no fewer than six philosophers.[^2]

In 1868 Friedrich Nietzsche argued that Diogenes owed nearly everything to Diocles; Hicks thought that rash.[^2] Glenn Most has traced the part Diogenes played in the rise of the German scholars' method of hunting for an author's lost sources (*Quellenforschung*).[^12]

### What reading him is like

Hicks found in him “a Dryasdust, vain and credulous, of multifarious reading, amazing industry, and insatiable curiosity”, writing in an age whose taste ran to personal details, anecdotes and witty sayings.[^2] Many of his stories come with a «λέγεται», “it is said”, and they are best read as anecdotes, not as history.[^13]

{legend} Thales, for example, was once taken out of doors by an old woman to look at the stars, fell into a ditch, and heard her ask: “How can you expect to know all about the heavens, Thales, when you cannot even see what is just before your feet?”[^13]

Many of his sayings are told in a fixed shape that ancient teachers called a *chreia*: a short anecdote about a named person, often in the pattern *on being asked* (ἐρωτηθείς) … *he said* (ἔφη).[^14] So Thales again: «ἐρωτηθεὶς τί δύσκολον, ἔφη, τὸ ἑαυτὸν γνῶναι», “Being asked what is difficult, he replied, To know oneself.”[^15]

{legend} The most famous of all is told of Diogenes the Cynic. As he was sunning himself, Alexander the Great came and stood over him and said, «αἴτησόν με ὃ θέλεις», “Ask of me any boon you like.” The answer: «ἀποσκότησόν μου», “Stand out of my light.”[^16]

Then there are his own poems. Before the *Lives* he had published a collection of epitaphs in verse, the *Pammetros*, and he quotes them freely.[^2] Thales died of heat and thirst while watching the games in his old age, and Diogenes adds an epigram from «ἐν τῷ πρώτῳ τῶν Ἐπιγραμμάτων ἢ Παμμέτρῳ», in Hicks's version “my first book, Epigrams in Various Metres”: “As Thales watched the games one festal day / The fierce sun smote him, and he passed away”.[^17] In that collection, he says, “I have discoursed of all the illustrious dead in all metres and rhythms, in epigrams and lyrics”.[^18] Hicks thought the verses “but sorry stuff”;[^2] Kathryn Gutzwiller has argued that they are more sophisticated than they first appear.[^12]

He ends the whole work with a flourish. Before copying out Epicurus' *Principal Doctrines* he writes «Καὶ φέρε οὖν δὴ νῦν τὸν κολοφῶνα, ὡς ἂν εἴποι τις, ἐπιθῶμεν τοῦ παντὸς συγγράμματος», “Come, then, let me set the seal, so to say, on my entire work”, so that its end will be «τῇ τῆς εὐδαιμονίας ἀρχῇ», “the beginning of happiness”.[^19] A κολοφών was a summit, or the finishing touch.[^20]

### Why he matters

The tenth book is the greatest treasure. Diogenes copied out three letters in which Epicurus summed up his teaching, to Herodotus on nature, to Pythocles on the heavens and to Menoeceus on how to live, and his *Principal Doctrines*, together with his will.[^6,21,19] Hicks called the extracts from Epicurus “by far the most precious thing preserved in this collection of odds and ends”.[^2] For the Stoics, his summary of their teaching in Book 7 is “comprehensive and trustworthy”, and most of that book went into von Arnim's collection of the fragments of the early Stoics.[^2] He treats the earliest thinkers, the Presocratics, rather briefly, yet the collections of their fragments, among them Hermann Diels's, draw on him; so did the editors of the comic poets and of the Greek Anthology.[^2]

Readers have loved and scorned him. Montaigne wrote: “I am very sorry we have not a dozen Laertii”.[^22] Hermann Usener called him a complete ass, *asinus germanus*, and Werner Jaeger “that great ignoramus”.[^1] The editor Herbert S. Long warned that “Diogenes has acquired an importance out of all proportion to his merits”, because the loss of so much else has left him the chief continuous source for the history of Greek philosophy.[^1] Since the late twentieth century scholars have partly restored his reputation by reading his book in the literary setting of the Hellenistic age.[^1]`,

  timeline: [
    {"year":200,"approx":true,"kind":"writing","what":"Sextus Empiricus is thought to flourish; his pupil Saturninus is the latest philosopher Diogenes names","src":[2,4,1]},
    {"year":225,"approx":true,"kind":"writing","what":"The *Lives* written, probably in the first half of the third century","certainty":"debated","src":[1,2]},
    {"year":300,"approx":true,"kind":"reception","what":"Sopater of Apamea quotes Diogenes","src":[1,2]},
    {"year":850,"approx":true,"kind":"copy","what":"Von der Mühll's guess: the single surviving copy turns up at Constantinople, about the ninth century","certainty":"debated","src":[2]},
    {"year":925,"kind":"copy","what":"A manuscript of extracts now in Vienna is written, dated 28 July 925","src":[23]},
    {"year":1100,"approx":true,"kind":"copy","what":"P, the Paris manuscript, is written at Constantinople (eleventh or twelfth century by Dorandi's dating; about 1300 by Hicks's)","certainty":"debated","src":[23,2]},
    {"year":1150,"approx":true,"kind":"copy","what":"B, the Naples manuscript, is written (twelfth century; about 1200 by Hicks's dating)","src":[1,2]},
    {"year":1158,"approx":true,"kind":"reception","what":"Henricus Aristippus translates at least part of Diogenes into Latin (late 1150s); his version is lost","src":[1]},
    {"year":1433,"approx":true,"kind":"reception","what":"Ambrogio Traversari's Latin translation (finished in 1431 by Hicks's account; presentation copy dated 1433)","certainty":"debated","src":[2,1]},
    {"year":1472,"kind":"print","what":"Traversari's Latin translation printed at Rome","src":[1]},
    {"year":1497,"kind":"print","what":"The lives of Aristotle and Theophrastus, the first Greek of Diogenes in print, in the Aldine Aristotle at Venice","src":[2,1]},
    {"year":1533,"kind":"print","what":"The whole Greek text first printed at Basel by Froben and Episcopius","src":[2,1]},
    {"year":1692,"kind":"print","what":"Meibom's edition divides the books into the numbered sections still used","src":[1]},
    {"year":1868,"kind":"reception","what":"Nietzsche argues that Diogenes copied nearly everything from Diocles","src":[2]},
    {"year":1887,"kind":"print","what":"Usener edits Book 10 in his *Epicurea*","src":[2]},
    {"year":1925,"kind":"print","what":"R. D. Hicks's Loeb edition and translation, the text in the Scroll","src":[2,25]},
    {"year":1964,"kind":"print","what":"H. S. Long's Oxford text, the first critical edition of the whole work","src":[26,1]},
    {"year":1999,"kind":"print","what":"Marcovich's Teubner edition, with a volume of Byzantine extracts","src":[24]},
    {"year":2013,"kind":"print","what":"Tiziano Dorandi's Cambridge edition","src":[27]},
    {"year":2018,"kind":"print","what":"Pamela Mensch's English translation of Dorandi's text","src":[12]},
  ],

  transmission: `**Early readers.** Sopater of Apamea, about AD 300, used the work, as we learn from the ninth-century scholar Photius; in the sixth century Stephanus of Byzantium cited it three times, and in the twelfth Eustathius and Tzetzes knew it.[^1,2]

{debated} **One copy behind them all.** The mistakes that all the manuscripts share most likely come from one common ancestor (an *archetype*).[^2] Peter Von der Mühll suspected that a single copy of Diogenes was found in a library at Constantinople in about the ninth century, after ancient learning had revived there, and that every later copy descends from it.[^2]

**The manuscripts.** About a hundred manuscripts carry the *Lives*, whole, in part or in extracts.[^23] In Tiziano Dorandi's account the oldest witnesses are three continuous manuscripts, B, P and F, written between the end of the eleventh century and the thirteenth, and three collections of extracts: two in a twelfth-century Vatican manuscript and one in a manuscript at Vienna dated 28 July 925.[^23] B, the Borbonicus at the National Library in Naples, was in Hicks's day agreed by all critics to be the most faithful to the archetype;[^2] Marcovich's reviewer ranks B and P together above F.[^24] Hicks thought its scribe knew no Greek, which H. S. Long later rejected; Dorandi judges that he knew little and copied mechanically, and that a few years later a corrector who knew Greek well changed many readings that, rightly or wrongly, he took to be mistakes.[^2,1] P (Paris, gr. 1759) was written at Constantinople by two scribes working at the same time, and F is in the Laurentian Library at Florence (69.13).[^23,24,1] All of them lack the end of Book 7.[^1] The headings for the separate lives printed in modern editions are missing from the oldest manuscripts; a later hand wrote them into the blank spaces and margins of P.[^1]

{debated} **How old?** The dates are argued over. Hicks put B about 1200 and P, “probably”, about 1300. Wikipedia dates B to the twelfth century, and Dorandi dates P to the eleventh or twelfth, which may make P the oldest of the three; F is of the thirteenth.[^2,1,23]

**In Latin.** Western Europe first read Diogenes in Latin. Henricus Aristippus, archdeacon of Catania, translated at least part of the work in the late 1150s, but his version is lost.[^1] Ambrogio Traversari, a monk of Camaldoli who had learnt Greek from Manuel Chrysoloras, made a new translation; Hicks dates its completion to 1431, while Wikipedia, after Gian Mario Cao, has him working on it in Florence from 1424 to 1433, and, after A. C. de la Mare, dates the copy presented to Cosimo de' Medici 8 February 1433.[^2,1] It was printed at Rome in 1472.[^1]

**In print.** The first pieces of the Greek text to be printed were the lives of Aristotle and Theophrastus, in the Aldine Aristotle at Venice in 1497.[^2,1] The whole Greek text was published at Basel in 1533 by Hieronymus Froben and Nicolaus Episcopius,[^2,1] but it was printed from a poor late manuscript full of additions, which Von der Mühll identified.[^2] Henri Estienne (Stephanus) published the Greek with a Latin version in 1570,[^1,2] and Marcus Meibom's Greek and Latin edition of 1692 divided each book into numbered sections of about equal length, the numbers still used for reference today.[^1] After Meibom the author was neglected until the nineteenth century.[^2] Cobet's text in the Didot series (Paris, 1850) was a great advance, though it gave no reasons for its changes, and Hermann Usener edited Book 10 in his *Epicurea* (1887).[^2] Hicks's Loeb text of 1925, the Greek in the Scroll, is a text of his own choosing based largely on Cobet's.[^2,12,25]

**Modern editions.** The first critical edition of the whole work (one that reports the manuscripts' readings), H. S. Long's in the Oxford Classical Texts, appeared only in 1964;[^1,26] by 2000 a reviewer could call it “discredited”.[^24] Miroslav Marcovich's Teubner edition (1999) reported the three main manuscripts in full and added a volume of Byzantine extracts: a fragment of Photius, passages of the Suda encyclopaedia, and the “Magnum Excerptum”, a digest of lives based on Diogenes.[^24] Dorandi's Cambridge edition of 2013, which drew for the first time on all of Von der Mühll's papers,[^27] is the text on which both recent English translations are based.[^28]`,

  variants: `**The mother of what?** Among the sayings of the philosopher Bion, the Scroll's text has «τὴν δόξαν 〈ἀρ〉ετῶν μητέρα εἶναι», “Renown he called the mother of virtues”.[^29] The two letters in angle brackets are an editor's: in the text as handed down renown is the mother of ἐτῶν, “years”, and Hicks adopted Herbert Richards's ἀρετῶν, “virtues”.[^2] Others have tried ἀνιῶν (Reiske) and αἰτιῶν, “charges” (Donald Russell), and Marcovich rewrote the phrase further.[^24]

**A word that would not stay put.** Of Arcesilaus the Scroll says «περιιὼν δὲ οὔτε γύναιον ἐπηγάγετο οὔτʼ ἐπαιδοποιήσατο», “In all his life he never married nor had any children.”[^30] The older reading is περιών; Wilamowitz marked it as corrupt, and the form περιιών that he noted has since been printed and translated “in all his life”.[^24] Marcovich instead linked it to Arcesilaus' wealth and added words to say so; his reviewer Robert Todd argued that, where the talk is of money, περιών could mean by itself that he had wealth to spare, with no addition at all.[^24]

**A note that pushed out the text.** Notes written in the margins of Epicurus' letters (*scholia*) have made their way into the text itself; Hicks even thought that Diogenes may have written them.[^2] At one place in the *Letter to Herodotus* the Scroll's Greek breaks off after «οὔτε ἐξ ἀνάγκης δεῖ νομίζειν ἕνα σχηματισμὸν ἔχοντας», “we must not suppose that the worlds have necessarily one and the same shape”, marks a gap with asterisks, and puts the following note in square brackets: “On the contrary, in the twelfth book On Nature he himself says that the shapes of the worlds differ”.[^31] Usener's verdict on the place, quoted by Hicks: “Hiat oratio, uerbis genuinis scholio intruso expulsis”, that is, “the sentence gapes: the genuine words were driven out by a note that forced its way in” (our translation).[^2]

**A book that breaks off.** Book 7 stops in the middle of the list of Chrysippus' writings, at «Περὶ τῶν λεγομένων ὑπὲρ τῆς», “Of the Arguments commonly used on Behalf of [Pleasure]”; the bracketed last word is Hicks's own supplement.[^32] An index of the lives at the front of the Paris manuscript P shows that the book went on to about twenty more Stoics, Panaetius and Posidonius among them, and ended with Cornutus.[^2,1] Hicks reckoned that, told at average length, these lives would have doubled the book.[^2]

**Diogenes in Homer.** Diogenes the Cynic, asked for a contribution to a club, answers with a line in Homer's manner: «τοὺς ἄλλους ἐράνιζʼ, ἀπὸ δʼ Ἕκτορος ἴσχεο χεῖρας», “Despoil the rest; off Hector keep thy hands.”[^33] Some editors of Homer went so far as to put this line into the text of the *Iliad*, though it stands in no manuscript of the *Iliad* and the ancient commentators seem not to have known it.[^2]`,

  editions: [
    {"text":"R. D. Hicks, *Diogenes Laertius: Lives of Eminent Philosophers*, 2 vols (Loeb Classical Library; London: William Heinemann, New York: G. P. Putnam's Sons, 1925).[^2,25]","note":"The Greek and English in the Scroll, from Perseus's copy, whose header names the later Harvard University Press and Heinemann imprint. Hicks warned that his text was provisional."},
    {"text":"H. S. Long, *Diogenis Laertii Vitae philosophorum*, 2 vols (Oxford Classical Texts, Clarendon Press, 1964).[^26,1]","note":"The first critical edition of the whole work, now superseded."},
    {"text":"M. Marcovich, *Diogenis Laertii Vitae philosophorum*, vol. 1, *Libri I–X*, vol. 2, *Excerpta Byzantina* (Teubner, Stuttgart and Leipzig, 1999); vol. 3, indexes by H. Gärtner (2002).[^24,1]","note":"Full reports of the manuscripts B, P and F, and the Byzantine extracts."},
    {"text":"T. Dorandi, *Diogenes Laertius: Lives of Eminent Philosophers* (Cambridge Classical Texts and Commentaries 50, Cambridge University Press, 2013).[^27,28]","note":"The Greek text now followed by translators, with a long introduction on the manuscripts."},
    {"text":"Pamela Mensch (tr.), James Miller (ed.), *Diogenes Laertius: Lives of the Eminent Philosophers* (Oxford University Press, 2018).[^12]","note":"The first English translation of Dorandi's text: lively, with notes, 556 colour pictures and sixteen essays."},
    {"text":"Stephen White, *Diogenes Laertius: Lives of Eminent Philosophers, an Edited Translation* (Cambridge University Press, 2021).[^28]","note":"A translation of Dorandi's text that departs from it in 128 places, each listed."},
    {"text":"C. D. Yonge (tr.), *Lives and Opinions of Eminent Philosophers* (London: Bohn, 1853).[^1]","note":"The older English version, more literal than its seventeenth-century predecessor but with many mistakes."},
  ],

  sources: [
    {"label":"Wikipedia, Diogenes Laertius (read as wikitext: the name, his date between Sextus Empiricus and Sopater, the nickname from Homer, the plan of the ten books, the lost end of Book 7 and the index in P, his chief sources, the manuscripts B, P and F after Dorandi, the Latin translations of Aristippus and Traversari, the printed editions from 1472 to Dorandi, the English translations, Montaigne, Usener, Jaeger and Long)","url":"https://en.wikipedia.org/wiki/Diogenes_Laertius"},
    {"label":"R. D. Hicks, Diogenes Laertius: Lives of Eminent Philosophers, vol. 1 (Loeb Classical Library; London: William Heinemann, New York: G. P. Putnam's Sons, 1925), preface, introduction and bibliography, Internet Archive scan","url":"https://archive.org/details/livesofeminentph01diog"},
    {"label":"Homer, Iliad 2.173 («διογενὲς Λαερτιάδη»), in the Scroll","cite":{"work":"tlg0012.tlg001","ref":"2.173"}},
    {"label":"Diogenes Laertius 9.116 (the succession of Sceptics down to Sextus Empiricus and his pupil Saturninus), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"9.12.116"}},
    {"label":"Diogenes Laertius 3.47 (he turns to his reader, a lover of Plato), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"3.1.47"}},
    {"label":"Diogenes Laertius 10.29 (the three letters of Epicurus and the Principal Doctrines announced to a single reader), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"10.1.29"}},
    {"label":"Diogenes Laertius 9.109 (“our Apollonides of Nicaea”), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"9.12.109"}},
    {"label":"Diogenes Laertius 1.1–3 (the prologue: philosophy among the Magi, Chaldaeans, Gymnosophists and Druids, and his reply), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"1.prol.1","to":"1.prol.3"}},
    {"label":"Diogenes Laertius 1.13–15 (the two beginnings of philosophy, Ionian and Italian, and their successions), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"1.prol.13","to":"1.prol.15"}},
    {"label":"Diogenes Laertius 8.91 (the end of the Pythagoreans; “the so-called sporadic philosophers”), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"8.8.91"}},
    {"label":"Diogenes Laertius 8.53 (“I found in the Memorabilia of Favorinus”), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"8.2.53"}},
    {"label":"Sean McConnell, review of P. Mensch (tr.) and J. Miller (ed.), Diogenes Laertius: Lives of the Eminent Philosophers (Oxford University Press, 2018), Bryn Mawr Classical Review 2019.02.28 (read in the Internet Archive's copy)","url":"https://web.archive.org/web/2024/https://bmcr.brynmawr.edu/2019/2019.02.28/"},
    {"label":"Diogenes Laertius 1.34 (Thales and the ditch), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"1.1.34"}},
    {"label":"Wikipedia, Chreia (a short anecdote about a named person, often in the pattern “On being asked …, he said”), read as wikitext","url":"https://en.wikipedia.org/wiki/Chreia"},
    {"label":"Diogenes Laertius 1.36 (Thales' answers: what is difficult, to know oneself), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"1.1.36"}},
    {"label":"Diogenes Laertius 6.38 (Diogenes the Cynic and Alexander), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"6.2.38"}},
    {"label":"Diogenes Laertius 1.39 (the death of Thales, and Diogenes' own epigram from the first book of his Epigrams in Various Metres), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"1.1.39"}},
    {"label":"Diogenes Laertius 1.63 (his epigram on Solon, and what his collection of epigrams contains), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"1.2.63"}},
    {"label":"Diogenes Laertius 10.138 (the last words in his own voice, before the Principal Doctrines), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"10.1.138"}},
    {"label":"Liddell–Scott–Jones, Greek–English Lexicon, the entry κολοφών (read in the site's copy; also on the Perseus Digital Library)","url":"https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057%3Aentry%3Dkolofw%2Fn"},
    {"label":"Diogenes Laertius 10.16 (his own epigram on the death of Epicurus, and the beginning of Epicurus' will), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"10.1.16"}},
    {"label":"Montaigne, Essays, book 2, chapter 10, “Of Books”, translated by Charles Cotton, edited by W. C. Hazlitt (Project Gutenberg)","url":"https://www.gutenberg.org/cache/epub/3600/pg3600.txt"},
    {"label":"Cambridge Core, T. Dorandi (ed.), Diogenes Laertius: Lives of Eminent Philosophers (2013): the summary of the introduction (about a hundred manuscripts; B, P and F; the excerpt collections; P written at Constantinople, 11th/12th century)","url":"https://www.cambridge.org/core/books/diogenes-laertius-lives-of-eminent-philosophers/introduction/6106EA3D1EEBC427899077E47363CB19"},
    {"label":"Robert Todd, review of M. Marcovich (ed.), Diogenes Laertius: Vitae Philosophorum, vol. 1, Libri I–X, vol. 2, Excerpta Byzantina (Teubner, 1999), Bryn Mawr Classical Review 2000.07.09 (read in the Internet Archive's copy)","url":"https://web.archive.org/web/2024/https://bmcr.brynmawr.edu/2000/2000.07.09/"},
    {"label":"The Scroll's Diogenes Laertius: the headers of Perseus's Greek and English files name R. D. Hicks, Lives of Eminent Philosophers, two volumes (Cambridge, MA: Harvard University Press; London: William Heinemann, 1925)","cite":{"work":"tlg0004.tlg001","ref":"1.prol.1"}},
    {"label":"Cambridge Core record of N. G. Wilson's review of Diogenes Laertius, Vitae philosophorum, ed. H. S. Long, 2 vols (Oxford: Clarendon Press, 1964), The Journal of Hellenic Studies 85 (1965) 185–186","url":"https://www.cambridge.org/core/journals/journal-of-hellenic-studies/article/diogenes-laertius-vitae-philosophorum-ed-h-s-long-2-vols-script-class-bibl-oxon-oxford-the-clarendon-press-1964-pp-xx-1246-xiv-247597-each-vol-1-15s/2A6D6FD46DA63AB8683A85BFAFC0E63F"},
    {"label":"Cambridge Core, T. Dorandi (ed.), Diogenes Laertius: Lives of Eminent Philosophers (Cambridge Classical Texts and Commentaries 50, Cambridge University Press, 2013): the publisher's description","url":"https://www.cambridge.org/core/product/identifier/9780511843440/type/book"},
    {"label":"Christopher Moore, review of Stephen White, Diogenes Laertius: Lives of Eminent Philosophers, an Edited Translation (Cambridge University Press, 2021), Bryn Mawr Classical Review 2022.01.04 (read in the Internet Archive's copy)","url":"https://web.archive.org/web/2024/https://bmcr.brynmawr.edu/2022/2022.01.04/"},
    {"label":"Diogenes Laertius 4.48 (Bion's sayings), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"4.7.48"}},
    {"label":"Diogenes Laertius 4.43 (Arcesilaus' last years), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"4.6.43"}},
    {"label":"Diogenes Laertius 10.74 (Letter to Herodotus: the shapes of the worlds, with a gap and a bracketed note), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"10.1.74"}},
    {"label":"Diogenes Laertius 7.202 (the list of Chrysippus' books, where Book 7 breaks off), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"7.7.202"}},
    {"label":"Diogenes Laertius 6.63 (Diogenes the Cynic's sayings, with a line of verse in Homer's manner), in the Scroll","cite":{"work":"tlg0004.tlg001","ref":"6.2.63"}},
  ],
  outsideQuotes: [
    "Laertius Diogenes",
    "Diogenes Laertius",
    "Zeus-born son of Laertes",
    "a Dryasdust, vain and credulous, of multifarious reading, amazing industry, and insatiable curiosity",
    "but sorry stuff",
    "by far the most precious thing preserved in this collection of odds and ends",
    "comprehensive and trustworthy",
    "I am very sorry we have not a dozen Laertii",
    "that great ignoramus",
    "Diogenes has acquired an importance out of all proportion to his merits",
    "discredited",
    "Magnum Excerptum",
    "Hiat oratio, uerbis genuinis scholio intruso expulsis",
    "the sentence gapes: the genuine words were driven out by a note that forced its way in",
  ],
  checked: "2026-10-09",
};
