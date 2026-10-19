/**
 * The pictures in design A's windows: each a real object, engraved in gold lines by lib/a/lamplight.js from a greyscale
 * picture with its outline (public/images/a/, made by design A's own preparation, and by scripts/prepare-engravings.py for
 * the site's other pieces). `cap` is the window's short caption; `credit` the full credit for the foot of the page.
 */
export interface Picture { src: string; label: string; cap: string; credit: string }

export const A_ART: Record<string, Picture> = {
  coin: { src: "/images/a/coin.png", label: "The head of Athena from an Athenian silver coin, engraved in gold lines", cap: "Athena · Athens, c. 440–404 BC",
    credit: "a silver tetradrachm of Athens, c. 440–404 BC, The Metropolitan Museum of Art, New York (2021.40.80), CC0" },
  frieze: { src: "/images/a/art-frieze.jpg", label: "Two seated figures from the Parthenon's east frieze, engraved in gold lines", cap: "Parthenon east frieze, block IV · plaster cast, Acropolis Museum",
    credit: "a plaster cast in the Acropolis Museum, Athens, of part of block IV of the Parthenon’s east frieze (the marble original is in the British Museum), photograph by Deiadameian, CC BY-SA 4.0" },
  socrates: { src: "/images/a/art-socrates.png", label: "Socrates, a Roman marble portrait, engraved in gold lines", cap: "Socrates · Roman marble portrait, Louvre",
    credit: "Socrates, Roman marble portrait, 1st century AD, Musée du Louvre, Paris, photograph by Eric Gaba, public domain" },
  douris: { src: "/images/a/art-douris.png", label: "School scenes on a cup by Douris, engraved in gold lines", cap: "Cup by Douris, c. 480 BC",
    credit: "school scenes on a red-figure drinking cup by Douris, c. 480 BC, Antikensammlung, Berlin (F 2285), photograph by Marcus Cyron, CC BY-SA 3.0" },
  amphora: { src: "/images/a/art-amphora.png", label: "A young man singing to the kithara, on an amphora by the Berlin Painter, engraved in gold lines", cap: "Berlin Painter, c. 490 BC",
    credit: "red-figure amphora attributed to the Berlin Painter, c. 490 BC, The Metropolitan Museum of Art, New York (56.171.38), CC0" },
  antikythera: { src: "/images/a/art-antikythera.jpg", label: "The Antikythera mechanism, fragment A, engraved in gold lines", cap: "Antikythera mechanism",
    credit: "the Antikythera mechanism, fragment A, 2nd–1st century BC, National Archaeological Museum, Athens, photograph by Logg Tandy, CC BY 4.0" },
  ostraka: { src: "/images/a/art-ostraka.png", label: "An ostrakon inscribed with the name of Themistocles, engraved in gold lines", cap: "Ostrakon of Themistocles",
    credit: "ostraka inscribed with the name of Themistocles, 5th century BC, Museum of the Ancient Agora, Athens, photograph by Zde, CC BY-SA 4.0" },
  mask: { src: "/images/a/art-mask.png", label: "The gold mask called the Mask of Agamemnon, engraved in gold lines", cap: "Mask of Agamemnon",
    credit: "gold funeral mask from Shaft Grave V at Mycenae, the so-called Mask of Agamemnon, 16th century BC, National Archaeological Museum, Athens (NAMA 624), photograph by Jebulon, CC0" },
  crates: { src: "/images/a/art-crates.jpg", label: "A Roman wall painting identified as Crates and Hipparchia, engraved in gold lines", cap: "Crates and Hipparchia · Roman wall painting",
    credit: "Roman wall painting identified as Crates and Hipparchia, from the Villa Farnesina, 1st century BC–1st century AD, Museo Nazionale Romano, Palazzo Massimo, Rome, public domain" },
};

const piece = (name: string, label: string, cap: string, credit: string): Picture => ({ src: `/images/a/pieces/${name}.png`, label, cap, credit });

/** the window beside the passage of the day: an object that belongs to the text, where there is one */
const BY_WORK: Record<string, Picture> = {
  "tlg0012.tlg001": A_ART.mask,   // the Iliad: the mask Schliemann tied to Homer's king (as the library says)
  "tlg0085.tlg005": A_ART.mask,   // Aeschylus' Agamemnon
  "tlg0012.tlg002": piece("melian-relief", "A clay relief with a scene of Odysseus' homecoming, engraved in gold lines", "Odysseus’ homecoming · Melos, c. 450 BC",
    "a clay relief made on Melos, c. 450 BC, with a scene of Odysseus’ homecoming, The Metropolitan Museum of Art, New York, CC0"),
  "tlg0003.tlg001": piece("pericles-bust", "A marble bust of Pericles, engraved in gold lines", "Pericles · Roman copy, British Museum",
    "Pericles, Roman copy of a portrait of c. 440–430 BC, British Museum, photograph by Marie-Lan Nguyen, CC BY 2.5"),
  "tlg0016.tlg001": piece("herodotos-bust", "A marble bust of Herodotos, engraved in gold lines", "Herodotos · marble bust, 2nd century AD",
    "marble bust of Herodotos, 2nd century AD, The Metropolitan Museum of Art, New York (91.8), CC0"),
  "tlg0020.tlg001": piece("seated-muse", "A marble statue of a seated Muse, engraved in gold lines", "A seated Muse · marble, 1st or 2nd century AD",
    "marble statue of a seated Muse, 1st or 2nd century AD, The Metropolitan Museum of Art, New York (03.12.16), CC0"),
};
const ANY = piece("hand-with-scroll", "A marble hand holding a book roll, engraved in gold lines", "A hand holding a book roll · marble, 1st or 2nd century AD",
  "marble left hand holding a scroll, 1st or 2nd century AD, The Metropolitan Museum of Art, New York (21.88.10), CC0");

export const passagePicture = (work: string) => BY_WORK[work] ?? ANY;
