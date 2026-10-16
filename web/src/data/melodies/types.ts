/**
 * A surviving ancient Greek melody, as a modern scholar has transcribed it from the ancient notation.
 * Times are in beats: one beat is the χρόνος πρῶτος, the shortest time of Greek rhythm (an eighth note in most modern
 * transcriptions). Pitches are MIDI note numbers (60 is middle C) with a fraction where the ancient tuning differs
 * from the modern one (67.18 is a G about a fifth of a semitone sharp).
 */
export interface MelodyNote {
  /** the pitch, a MIDI note number */
  m: number;
  /** when it starts, in beats from the beginning */
  t: number;
  /** how long it lasts, in beats */
  d: number;
  /** the syllable sung to it; a note that carries on the syllable before it (a melisma) has none */
  syl?: string;
  /** 1 where a new line of the words begins */
  br?: 1;
}

export interface Melody {
  id: string;
  title: string;
  /** its opening words, or its Greek title, where the sources give them */
  greek?: string;
  /** where and when it was written down */
  date: string;
  /** what it survives on: the stone, the papyrus, the manuscripts */
  document: string;
  /** a few plain sentences about the piece */
  about: string[];
  /** the words, line by line, Greek with a literal English line under each; null where only the music survives */
  words: { grc: string; en: string }[] | null;
  /** who translated the English lines */
  translation?: string;
  /** whose transcription the notes are, and the edition behind it */
  credit: string;
  /** whether the syllables are set on the notes (else the roll shows the notes alone) */
  sung: boolean;
}

/** A melody's notes: /data/melodies/<id>.json, made by pipeline/build_melodies.py. */
export interface MelodyNotes {
  id: string;
  /** beats per minute at "as written" speed */
  bpm: number;
  /** gaps in the source, in beats, where notes are lost and nothing is played */
  gaps: [from: number, to: number][];
  notes: MelodyNote[];
}
