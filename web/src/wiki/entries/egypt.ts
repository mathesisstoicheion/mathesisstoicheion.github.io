import type { Entry } from "../types";

const entry: Entry = {
  slug: "egypt",
  title: "Egypt, the river's gift",
  greek: "Αἴγυπτος",
  category: "weird",
  kicker: "The oldest country the Greeks knew, and the book Herodotus gave it",
  image: "herodotos-bust",
  hook: `Greeks went to Egypt as soldiers, as traders and as sightseers, and found a country whose kings and temples were older than any of their own stories. Herodotus gave it a whole book of his *Histories*, the second. He travelled up the Nile as far as Elephantine, asked the priests, measured what he could and wrote down what he was told. Some of it is right, some of it is wrong, and all of it is the earliest full account of Egypt in Greek that survives. The library names Egypt more often than any other place.`,
  body: `## The gift of the river

Herodotus begins with the ground under his feet. The priests told him that the land of Lower Egypt had been laid down by the Nile, and he agreed: anyone with sense could see it.

{{quote:gift}}

{well} He was right. The Delta and the floor of the valley are made of the silt that the river's yearly flood brought down and left behind; without the Nile, Egypt would be desert. Herodotus says plainly where his own knowledge stopped: he went [as far as Elephantine to see for himself](cts:tlg0016.tlg001:2.29.1), and beyond that he could only ask.

## Everything the other way round

To a Greek visitor Egypt seemed to reverse the ordinary rules of life, and Herodotus enjoys the list.

{{quote:backwards}}

He goes on to describe how the Egyptians [embalmed their dead](cts:tlg0016.tlg001:2.86.1-2.88.1), with the three grades of service and their prices, and how they honoured [sacred animals](cts:tlg0016.tlg001:2.65.1-2.76.3), cats and crocodiles and ibises among them. Much of this matches what Egyptian tombs and mummies show; some of it, like his stories of the phoenix, he reports and does not believe.

## The pyramid and the radishes

{legend} Herodotus' priests told him that King Cheops closed the temples and set the whole people to work on his pyramid, in [gangs of a hundred thousand men, each for three months](cts:tlg0016.tlg001:2.124.3-2.124.5): ten years for the road the stones were dragged along, twenty for the pyramid itself. Then he adds a detail he could check, or thought he could.

{{quote:radishes}}

{debated} No such inscription is known on the Great Pyramid today. Its polished outer casing, where Herodotus implies the writing was, has almost all gone, so his story can be neither confirmed nor disproved. Herodotus could not read Egyptian himself: the figure came to him through an interpreter.

## Greeks in Egypt

{well} Greeks were in Egypt long before Herodotus. The pharaoh Psammetichus I hired Ionian and Carian soldiers, and afterwards [gave them land to live on](cts:tlg0016.tlg001:2.154.1) on both banks of the Nile. Greek mercenaries in a later pharaoh's army, marching south against Nubia in the 590s BC, cut their names on the leg of a colossal statue of Ramesses II at Abu Simbel, one of the oldest Greek inscriptions that can be dated ([Struffolino, *Axon* 2018](https://edizionicafoscari.unive.it/en/edizioni/riviste/axon/2018/1/iscrizione-dei-mercenari-greci-ad-abu-simbel)).

{well} King Amasis, Herodotus says, [gave the Greeks the city of Naucratis](cts:tlg0016.tlg001:2.178.1) in the Delta. The site was found again by Flinders Petrie in 1884, and the British Museum has excavated it again since 2012; it was a trading town set up by the Egyptian kings of the late seventh century BC ([British Museum](https://www.britishmuseum.org/research/projects/harbour-naukratis)).

After Amasis, Egypt was conquered by the Persian king [Cambyses](cts:tlg0016.tlg001:3.1.1), then by Alexander, whose general Ptolemy founded the dynasty that ruled it from [Alexandria](wiki:alexandria) for three centuries, until the death of Cleopatra VII and the Roman conquest.

## The stone that let us read Egypt

!! The key to Egyptian writing was Greek. The Rosetta Stone, found by French soldiers near Rosetta (Rashid) in 1799, carries one decree of 196 BC in honour of Ptolemy V three times: in hieroglyphs, in demotic and in Greek. Scholars could read the Greek, and from it Thomas Young and then Jean-François Champollion worked out the Egyptian scripts; Champollion published his decipherment in 1822 ([Britannica](https://www.britannica.com/print/article/509988)).

{{timeline}}`,
  quotes: {
    gift: {
      work: "tlg0016.tlg001", ref: "2.5.1", label: "Herodotus 2.5.1",
      grc: "ὅτι Αἴγυπτος, ἐς τὴν Ἕλληνες ναυτίλλονται, ἐστὶ Αἰγυπτίοισι ἐπίκτητός τε γῆ καὶ δῶρον τοῦ ποταμοῦ",
      tr: "that Egypt to which the Greeks sail is land deposited for the Egyptians, the river's gift",
      trFrom: "corpus", trBy: "A. D. Godley (1920)",
    },
    backwards: {
      work: "tlg0016.tlg001", ref: "2.35.2", label: "Herodotus 2.35.2",
      grc: "τὰ πολλὰ πάντα ἔμπαλιν τοῖσι ἄλλοισι ἀνθρώποισι ἐστήσαντο ἤθεά τε καὶ νόμους· ἐν τοῖσι αἱ μὲν γυναῖκες ἀγοράζουσι καὶ καπηλεύουσι, οἱ δὲ ἄνδρες κατʼ οἴκους ἐόντες ὑφαίνουσι",
      tr: "so, too, have they instituted customs and laws contrary for the most part to those of the rest of mankind. Among them, the women buy and sell, the men stay at home and weave",
      trFrom: "corpus", trBy: "A. D. Godley (1920)",
    },
    radishes: {
      work: "tlg0016.tlg001", ref: "2.125.6", label: "Herodotus 2.125.6",
      grc: "σεσήμανται δὲ διὰ γραμμάτων Αἰγυπτίων ἐν τῇ πυραμίδι ὅσα ἔς τε συρμαίην καὶ κρόμμυα καὶ σκόροδα ἀναισιμώθη τοῖσι ἐργαζομένοισι",
      tr: "There are writings on the pyramid in Egyptian characters indicating how much was spent on radishes and onions and garlic for the workmen",
      trFrom: "corpus", trBy: "A. D. Godley (1920)",
    },
  },
  timeline: [
    { when: "664–610 BC", what: "Psammetichus I reigns, and settles Ionian and Carian soldiers in Egypt.", certainty: "well" },
    { when: "late 7th c. BC", what: "Naucratis is founded as a trading town for Greeks in the Delta.", certainty: "well" },
    { when: "590s BC", what: "Greek mercenaries carve their names at Abu Simbel.", certainty: "well" },
    { when: "525 BC", what: "Cambyses of Persia conquers Egypt.", certainty: "well" },
    { when: "5th c. BC", what: "Herodotus travels in Egypt, as far as Elephantine.", certainty: "well" },
    { when: "332/1 BC", what: "Alexander takes Egypt and founds Alexandria.", certainty: "well" },
    { when: "196 BC", what: "The decree on the Rosetta Stone is issued for Ptolemy V.", certainty: "well" },
    { when: "30 BC", what: "Cleopatra VII dies; Egypt becomes a Roman province.", certainty: "well" },
    { when: "1799", what: "French soldiers find the Rosetta Stone.", certainty: "well" },
    { when: "1822", what: "Champollion publishes his decipherment of hieroglyphs.", certainty: "well" },
    { when: "1884", what: "Flinders Petrie finds Naucratis.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0016.tlg001", ref: "2.2.1", to: "2.5.2", label: "Herodotus 2.2–5", why: "The oldest people in the world, and the land made by the river." },
    { work: "tlg0016.tlg001", ref: "2.35.1", to: "2.36.4", label: "Herodotus 2.35–36", why: "A country where everything is done the other way round." },
    { work: "tlg0016.tlg001", ref: "2.124.1", to: "2.127.3", label: "Herodotus 2.124–127", why: "Cheops, Chephren and the pyramids, as the priests told it." },
    { work: "tlg0016.tlg001", ref: "2.154.1", to: "2.154.5", label: "Herodotus 2.154", why: "The first Greeks to settle in Egypt." },
  ],
  related: ["alexandria"],
  places: ["981503", "736963"],
  primary: [
    { work: "tlg0016.tlg001", ref: "2.5.1", label: "Herodotus 2.5" },
    { work: "tlg0016.tlg001", ref: "2.29.1", label: "Herodotus 2.29" },
    { work: "tlg0016.tlg001", ref: "2.35.2", label: "Herodotus 2.35" },
    { work: "tlg0016.tlg001", ref: "2.124.3", to: "2.125.6", label: "Herodotus 2.124–125" },
    { work: "tlg0016.tlg001", ref: "2.154.1", label: "Herodotus 2.154" },
    { work: "tlg0016.tlg001", ref: "2.178.1", label: "Herodotus 2.178" },
    { work: "tlg0016.tlg001", ref: "3.1.1", label: "Herodotus 3.1" },
  ],
  secondary: [
    { id: "lloyd-herodotus-2", note: "The full commentary on Herodotus' Egyptian book, by an Egyptologist." },
  ],
  written: "2026-11-11",
};
export default entry;
