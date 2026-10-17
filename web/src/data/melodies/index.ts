/**
 * The surviving ancient Greek melodies the lyre plays (/stoa/lyre), oldest first. Their notes are in
 * /data/melodies/<id>.json (pipeline/build_melodies.py, from Stefan Hagel's renderings of Pöhlmann and West's
 * transcriptions). Each fact here was checked (2026-10-16) against Wikipedia's articles on the piece (Seikilos epitaph,
 * Delphic Hymns, Mesomedes, Oxyrhynchus hymn, Orestes (play), Music of ancient Greece, and the French article on the
 * Seikilos epitaph), which cite Pöhlmann and West, Documents of Ancient Greek Music (2001), and against Hagel's list of
 * the documents (dates, papyrus lines; copied in music-sources/hagel-index.txt on the lyre's branch). What the sources
 * did not support was left out. The English lines are the site's own literal translations.
 */
import type { Melody } from "./types";

const HAGEL = "Notes: Stefan Hagel's rendering (Austrian Academy of Sciences, Ancient Greek Music: The Melodies), after the transcription in E. Pöhlmann and M. L. West, Documents of Ancient Greek Music (Oxford, 2001); in the ancient tuning of his files, not modern equal temperament.";
const OURS = "English: the site's own literal translation.";

export const MELODIES: Melody[] = [
  {
    id: "orestes", title: "A chorus from Euripides' Orestes", greek: "Ὀρέστης", date: "408 BC (the play)",
    document: "Vienna Papyrus G 2315, from Hermopolis in Egypt",
    about: [
      "A papyrus fragment with the music of a choral ode from Euripides' Orestes (lines 338–344), a play first staged at the City Dionysia in Athens in 408 BC. The music may have been composed by Euripides himself.",
      "Only a fragment survives, so the melody comes in short pieces with silences between them. In Hagel's rendering some of its steps are smaller than a semitone, which no modern keyboard can play.",
    ],
    words: null, credit: HAGEL, sung: false,
  },
  {
    id: "delphic-1", title: "The First Delphic Hymn", date: "128 BC",
    document: "Carved on the Athenian Treasury at Delphi",
    about: [
      "A paean to Apollo by Athenaios son of Athenaios, carved with its notes on the south outer wall of the Athenian Treasury at Delphi, and found there in 1893 by the French archaeologist Théophile Homolle. Like the second hymn it was probably written for the Pythaid of 128 BC, a special procession of the Athenians to Delphi.",
      "It is written in the notation for voices, in the five-beat cretic metre throughout. Almost all of its last part is lost.",
    ],
    words: null, credit: HAGEL, sung: false,
  },
  {
    id: "delphic-2", title: "The Second Delphic Hymn", date: "128 BC",
    document: "Carved on the Athenian Treasury at Delphi",
    about: [
      "Headed “Paean and processional to the god”, it is by Limenios son of Thoinos, an Athenian and a kithara player. It is written in the notation for instruments, and changes key often.",
      "It calls the Muses to come to Delphi, and tells of Apollo's birth on Delos, his visit to Attica, how he killed the Python, and how he drove off an army of Gauls with a snowstorm. There are many gaps where the stone is broken.",
    ],
    words: null, credit: HAGEL, sung: false,
  },
  {
    id: "seikilos", title: "The Seikilos song", greek: "Ὅσον ζῇς φαίνου", date: "1st–2nd century AD",
    document: "A stone pillar from Tralles (now Aydın, Turkey), in the National Museum of Denmark",
    about: [
      "The oldest surviving complete piece of music: a short song carved with its notes on a stone that Seikilos set up, found in 1883. Older written music survives only in fragments.",
      "Its four lines tell the living to shine while they live and grieve at nothing, for life is short. Marks over the notes show which are held for two beats or three; its key is read as the Iastian (Ionian), or as the Phrygian.",
    ],
    words: [
      { grc: "Ὅσον ζῇς, φαίνου,", en: "As long as you live, shine;" },
      { grc: "μηδὲν ὅλως σὺ λυποῦ·", en: "let nothing grieve you at all." },
      { grc: "πρὸς ὀλίγον ἔστι τὸ ζῆν,", en: "Life lasts only a little while," },
      { grc: "τὸ τέλος ὁ χρόνος ἀπαιτεῖ.", en: "and time demands its end." },
    ],
    translation: `${OURS} Words set to the notes as in Pöhlmann and West's transcription.`,
    credit: HAGEL, sung: true,
  },
  {
    id: "muse", title: "Prayer to the Muse", greek: "Ἄειδε μοῦσά μοι φίλη", date: "early 2nd century AD",
    document: "Byzantine manuscripts",
    about: [
      "A short invocation that came down through Byzantine copies with its music. It is listed among the hymns of Mesomedes of Crete, a citharode (a singer to the kithara) and a freedman of the emperor Hadrian; but its dialect (Ionic, not Doric) and its style differ from his other hymns, and J. G. Landels thought it is probably not his.",
    ],
    words: [
      { grc: "Ἄειδε μοῦσά μοι φίλη,", en: "Sing for me, dear Muse," },
      { grc: "μολπῆς δ’ ἐμῆς κατάρχου·", en: "and lead my song;" },
      { grc: "αὔρη δὲ σῶν ἀπ’ ἀλσέων", en: "and let a breeze from your groves" },
      { grc: "ἐμὰς φρένας δονείτω.", en: "stir my mind." },
    ],
    translation: `${OURS} Words set to the notes by their metre: a long syllable takes two beats, so a long syllable over two short notes is sung across both.`,
    credit: HAGEL, sung: true,
  },
  {
    id: "calliope", title: "Prayer to Calliope and Apollo", greek: "Καλλιόπεια σοφά", date: "2nd century AD",
    document: "Byzantine manuscripts",
    about: [
      "A prayer to Calliope, leader of the Muses, and to Apollo, the Delian Paean. Once assigned to Dionysius of Alexandria, it has also been attributed to Mesomedes.",
    ],
    words: [
      { grc: "Καλλιόπεια σοφά,", en: "Wise Calliope," },
      { grc: "μουσῶν προκαθαγέτι τερπνῶν,", en: "leader of the delightful Muses," },
      { grc: "καὶ σοφὲ μυστοδότα,", en: "and you, wise giver of the mysteries," },
      { grc: "Λατοῦς γόνε, Δήλιε, Παιάν,", en: "son of Leto, Delian, Paean," },
      { grc: "εὐμενεῖς πάρεστέ μοι.", en: "be with me, and be kind." },
    ],
    translation: `${OURS} Words set to the notes by their metre, as for the Prayer to the Muse.`,
    credit: HAGEL, sung: true,
  },
  {
    id: "helios", title: "Hymn to the Sun", greek: "Χιονοβλεφάρου πάτερ Ἀοῦς", date: "2nd century AD",
    document: "Byzantine manuscripts",
    about: [
      "A hymn to Helios, the Sun, who follows the track of his winged horses in his rose-pink chariot while the stars dance to the music of Apollo's lyre. Once assigned to Dionysius of Alexandria, it has also been attributed to Mesomedes. Until the Seikilos stone was found in the 19th century, the hymns of Mesomedes were the only written music known to survive from the ancient world.",
      "The roll shows the notes without their syllables; the words are below.",
    ],
    words: [
      { grc: "Χιονοβλεφάρου πάτερ Ἀοῦς,", en: "Father of snowy-lidded Dawn," },
      { grc: "ῥοδόεσσαν ὃς ἄντυγα πώλων", en: "you who drive the rosy chariot of your colts" },
      { grc: "πτανοῖς ὑπ’ ἴχνεσσι διώκεις,", en: "on winged hooves," },
      { grc: "χρυσέαισιν ἀγαλλόμενος κόμαις,", en: "glorying in your golden hair," },
      { grc: "περὶ νῶτον ἀπείριτον οὐρανοῦ", en: "around the boundless back of the sky" },
      { grc: "ἀκτῖνα πολύστροφον ἀμπλέκων,", en: "weaving your many-turning ray," },
      { grc: "αἴγλας πολυδερκέα πάναν", en: "winding the far-seeing thread of your light" },
      { grc: "περὶ γαῖαν ἅπασαν ἑλίσσων.", en: "around the whole earth." },
      { grc: "ποταμοὶ δὲ σέθεν πυρὸς ἀμβρότου", en: "Rivers of your undying fire" },
      { grc: "τίκτουσιν ἐπήρατον ἁμέραν.", en: "give birth to lovely day." },
      { grc: "σοὶ μὲν χορὸς εὔδιος ἀστέρων", en: "For you the calm chorus of the stars" },
      { grc: "κατ’ Ὄλυμπον ἄνακτα χορεύει,", en: "dances across lordly Olympus," },
      { grc: "ἄνετον μέλος αἰὲν ἀείδων,", en: "ever singing its free song," },
      { grc: "Φοιβηΐδι τερπόμενος λύρᾳ.", en: "delighting in the lyre of Phoebus." },
      { grc: "γλαυκὰ δὲ πάροιθε Σελάνα", en: "And gleaming Selene before you" },
      { grc: "χρόνον ὥριον ἁγεμονεύει,", en: "leads the seasons' time," },
      { grc: "λευκῶν ὑπὸ σύρμασι μόσχων.", en: "drawn by white calves." },
      { grc: "γάνυται δέ τέ σοι νόος εὐμενὴς", en: "And your kindly mind rejoices" },
      { grc: "πολυείμονα κόσμον ἑλίσσων.", en: "as it turns the many-robed world." },
    ],
    translation: `Greek: the text of Pöhlmann and West. ${OURS}`,
    credit: HAGEL, sung: false,
  },
  {
    id: "nemesis", title: "Hymn to Nemesis", greek: "Νέμεσι πτερόεσσα", date: "early 2nd century AD",
    document: "Byzantine manuscripts",
    about: [
      "Mesomedes' hymn to Nemesis, the winged goddess who holds the balance of life and curbs the insolence of mortals. It is one of four of his hymns that keep the ancient musical notation written over the words.",
      "The roll shows the notes without their syllables.",
    ],
    words: null, credit: HAGEL, sung: false,
  },
  {
    id: "berlin-instrumental", title: "A piece for instruments", date: "2nd–3rd century AD",
    document: "Berlin Papyrus 6870, lines 20–22",
    about: [
      "A few lines of music for instruments alone, on a papyrus in Berlin that also carries a paean to Apollo (shown by Annie Bélis in 2003 to be by Mesomedes) and music about Ajax. With no words to sing, it is music for an instrument to play.",
    ],
    words: null, credit: HAGEL, sung: false,
  },
  {
    id: "oxyrhynchus", title: "The Oxyrhynchus hymn", date: "late 3rd century AD",
    document: "Oxyrhynchus Papyrus 1786",
    about: [
      "The earliest known manuscript of a Christian hymn in Greek with both its words and its music: a papyrus fragment found at Oxyrhynchus in Egypt in 1918. It calls for silence, even from the shining stars, while Father, Son and Holy Spirit are praised. Its melody is entirely diatonic and spans exactly an octave.",
      "The roll shows the notes without their syllables.",
    ],
    words: null, credit: HAGEL, sung: false,
  },
];
