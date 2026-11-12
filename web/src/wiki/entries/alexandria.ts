import type { Entry } from "../types";

const entry: Entry = {
  slug: "alexandria",
  title: "Alexandria and the Museum",
  greek: "Ἀλεξάνδρεια",
  category: "education",
  kicker: "Alexander's city in Egypt, where scholars were paid to read Homer",
  image: "red-base",
  hook: `Alexander chose the site, on a strip of land between a lagoon and the sea, and marked out the streets himself. He never saw the city built. Under the Ptolemies, the Macedonian kings who ruled Egypt after him, Alexandria grew into one of the greatest cities of the Mediterranean, with a lighthouse that was counted among the wonders, the tomb of Alexander, and a royal institution where scholars lived at the king's expense: the Museum, with its library. Much of the Greek we read today passed through their hands.`,
  body: `## A city drawn in barley meal

{legend} Plutarch tells that Alexander, in Egypt in the winter of 332/1 BC, dreamed that a grey-haired old man stood by him and recited two lines of Homer:

{{quote:pharos}}

He went to Pharos, saw the site, and said that Homer was a wise architect as well as a poet. There was no chalk, so the plan was [marked out on the ground with barley meal](cts:tlg0007.tlg047:26.5-26.6); birds came down and ate it, and the seers said the city would feed men of every nation. The historian Arrian, using earlier sources, says only that [Alexander thought the place the finest for a city and laid out its agora and temples himself](cts:tlg0074.tlg001:3.1.5).

## The city Strabo saw

The geographer Strabo lived in Alexandria a few years after the Romans took Egypt, and his description is the fullest that survives. He describes the [harbour closed by the island of Pharos](cts:tlg0099.tlg001:17.1.6), with its tower of white stone, many storeys high, dedicated by Sostratus of Cnidus; the broad streets crossing at right angles; and the royal palaces, which took up a quarter or even a third of the city. Inside the palace grounds were two places that mattered to every educated Greek. One was the Sema, the walled enclosure with the tombs of the kings and of Alexander, whose body Ptolemy had seized on its way from Babylon. The other was the Museum.

{{quote:museum}}

## Scholars at the king's table

{well} The Museum, the "shrine of the Muses", was a community of scholars and scientists supported by the Ptolemies, and the great library belonged to it. Its first famous names worked in the third century BC. The poet Callimachus drew up a catalogue of Greek writers and their works; Eratosthenes estimated the size of the Earth; and a line of scholars, Zenodotus, Aristophanes of Byzantium and Aristarchus, compared copies of Homer and other poets and tried to establish what the poets had really written. The marks they put in the margins to flag doubtful lines, and the commentaries they wrote, still lie behind the notes in modern editions.

!! The statue base on this page was set up by Aristocles son of Aristocles, "an Alexandrian", in honour of Queen Arsinoe II, who was worshipped as a goddess after her death by her husband and brother, Ptolemy II. It was found on Cyprus, then ruled from Alexandria.

## What happened to the library

{debated} No one knows exactly how the library ended. Plutarch says that when Julius Caesar was besieged in Alexandria in 48 BC he set fire to the enemy's ships, and the fire [spread from the dockyards and destroyed the great library](cts:tlg0007.tlg048:49.3). Yet Strabo, a generation later, describes the Museum as still working, with its priest now appointed by the emperor. The scholars of Alexandria went on working in later centuries, and the story that the library was burned all at once by a single conqueror is a simplification.

{{timeline}}`,
  quotes: {
    pharos: {
      work: "tlg0007.tlg047", ref: "26.3", label: "Plutarch, Alexander 26.3",
      grc: "νῆσος ἔπειτά τις ἔστι πολυκλύστῳ ἐνὶ πόντῳ, Αἰγύπτου προπάροιθε· Φάρον δέ ἑ κικλήσκουσιν.",
      tr: "Now, there is an island in the much-dashing sea, In front of Egypt; Pharos is what men call it.",
      trFrom: "corpus", trBy: "Bernadotte Perrin (1919)",
    },
    museum: {
      work: "tlg0099.tlg001", ref: "17.1.8", label: "Strabo 17.1.8",
      grc: "τῶν δὲ βασιλείων μέρος ἐστὶ καὶ τὸ Μουσεῖον, ἔχον περίπατον καὶ ἐξέδραν καὶ οἶκον μέγαν ἐν ᾧ τὸ συσσίτιον τῶν μετεχόντων τοῦ Μουσείου φιλολόγων ἀνδρῶν. ἔστι δὲ τῇ συνόδῳ ταύτῃ καὶ χρήματα κοινὰ καὶ ἱερεὺς ὁ ἐπὶ τῷ Μουσείῳ τεταγμένος τότε μὲν ὑπὸ τῶν βασιλέων νῦν δʼ ὑπὸ Καίσαρος.",
      tr: "The Museum is also part of the palace. It has a covered walk, a hall with seats, and a large house in which the scholars who belong to the Museum take their meals together. This community has funds held in common, and a priest in charge of the Museum, appointed in those days by the kings and now by Caesar.",
      trFrom: "site", trBy: "this site",
    },
  },
  timeline: [
    { when: "332/1 BC", what: "Alexander founds the city.", certainty: "well" },
    { when: "after 323 BC", what: "Ptolemy, Alexander's general, rules Egypt and takes Alexander's body to Egypt.", certainty: "well" },
    { when: "3rd c. BC", what: "The Museum and library flourish under the first Ptolemies; the Pharos lighthouse is built.", certainty: "well" },
    { when: "48 BC", what: "Caesar is besieged in Alexandria; Plutarch says the fire destroyed the great library.", certainty: "debated" },
    { when: "30 BC", what: "Egypt becomes Roman after the death of Cleopatra VII.", certainty: "well" },
    { when: "late 1st c. BC", what: "Strabo describes the city, the Sema and the Museum.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0007.tlg047", ref: "26.3", to: "26.6", label: "Plutarch, Alexander 26", why: "The dream, the barley meal and the birds." },
    { work: "tlg0074.tlg001", ref: "3.1.5", label: "Arrian, Anabasis 3.1.5", why: "The founding, told plainly." },
    { work: "tlg0099.tlg001", ref: "17.1.6", to: "17.1.10", label: "Strabo 17.1.6–10", why: "A walk through the city: harbours, Pharos, palaces, Museum and tombs." },
  ],
  related: ["egypt"],
  places: ["727070"],
  primary: [
    { work: "tlg0007.tlg047", ref: "26.3", to: "26.6", label: "Plutarch, Alexander 26.3–6" },
    { work: "tlg0074.tlg001", ref: "3.1.5", label: "Arrian, Anabasis 3.1.5" },
    { work: "tlg0099.tlg001", ref: "17.1.6", to: "17.1.8", label: "Strabo 17.1.6–8" },
    { work: "tlg0007.tlg048", ref: "49.3", label: "Plutarch, Caesar 49.3" },
  ],
  secondary: [
    { id: "fraser-alexandria", note: "The standard account of the city, its Museum and its scholars." },
  ],
  written: "2026-11-11",
};
export default entry;
