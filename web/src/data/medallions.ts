/**
 * The library's famous books (app/library/page.tsx), each with a photograph of its author or of the thing it is best known
 * for: the photographs are in data/images.json, whose credits `why` repeats, and each book's plate is chosen in
 * data/library-plates.ts. (Under the old look these pictures were redrawn in letters; that is set aside in
 * _archive/old-look-2026-10-22/.)
 */
/** `about` is one line on the work itself (as the reading paths, data/paths.ts, describe it); `why` is the picture's credit */
export interface Medallion { group: string; id: string; pic: string; alt: string; about: string; why: string }

export const MEDALLIONS: Medallion[] = [
  { group: "Epic and history", id: "tlg0012.tlg001", pic: "mask-of-agamemnon",
    about: "The wrath of Achilles in the tenth year of the Trojan War.",
    alt: "A sheet of beaten gold shaped into a bearded man’s face, with closed eyes.",
    why: "The gold “Mask of Agamemnon” from Mycenae, 16th century BC, National Archaeological Museum, Athens. Photograph by Jebulon, CC0. Schliemann tied it to Homer’s king; it is centuries older than the date usually given for the Trojan War." },
  { group: "Epic and history", id: "tlg0012.tlg002", pic: "melian-relief",
    about: "Odysseus’ return home from Troy to Ithaca.",
    alt: "A broken clay relief: a bearded man sits on the left, a young man stands in the middle, and a woman sits on the right.",
    why: "A clay relief made on Melos, c. 450 BC, with a scene of Odysseus’ homecoming. The Metropolitan Museum of Art, New York, CC0." },
  { group: "Epic and history", id: "tlg0003.tlg001", pic: "pericles-bust",
    about: "The war between Athens and Sparta, by an Athenian general who lived through it.",
    alt: "A marble bust of a bearded man wearing a helmet pushed back on his head.",
    why: "Pericles, whose Funeral Oration is in book 2. Roman copy of a portrait of c. 440–430 BC, British Museum. Photograph by Marie-Lan Nguyen, CC BY 2.5." },
  { group: "Philosophy and medicine", id: "tlg0059.tlg002", pic: "socrates-louvre",
    about: "Socrates on trial, in Plato’s telling.",
    alt: "A marble head of an old man with a broad flat nose and a thick curly beard.",
    why: "Socrates, the speaker of the whole work. Roman marble portrait, 1st century AD, Louvre. Photograph by Eric Gaba, public domain." },
  { group: "Philosophy and medicine", id: "tlg0627.tlg006", pic: "asklepios-epidaurus",
    about: "Doctors’ notes on the seasons, the illnesses they brought, and their patients, day by day.",
    alt: "A marble statue of a bearded god, a snake coiled around the staff at his side.",
    why: "Asclepius, god of healing, from his sanctuary at Epidaurus; Roman copy, c. AD 160, National Archaeological Museum, Athens. Photograph by Carole Raddato, CC BY-SA 2.0." },
  { group: "Philosophy and medicine", id: "tlg0004.tlg001", pic: "gerome-diogenes",
    about: "The lives and sayings of the Greek philosophers, from Thales to Epicurus.",
    alt: "A painting: a bearded man sits in the mouth of a huge clay jar, trimming a lamp in daylight.",
    why: "Diogenes the Cynic with his lamp: Diogenes Laertius tells how he lit a lamp in daylight and went about saying he was looking for a human being (Lives 6.41). Gérôme, 1860, Walters Art Museum. Public domain." },
];

export const medallionOf = (workId: string) => MEDALLIONS.find((m) => m.id === workId);
