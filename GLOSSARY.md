# GLOSSARY.md — the site's own words

Use these names in code, docs and messages to the owner. One word for one thing. Area names live in
`web/src/config/areas.ts`; change them only there.

## The five doors

| Door | Greek area | What it is |
|---|---|---|
| **Learn** | the Academy | Alphabet, lessons, flashcards, daily practice. |
| **Read** | the Mouseion | The library and the reader. |
| **Explore** | the Painted Stoa | The wiki, the Periplus, the Census, the Kerameikos. |
| **Talk** | the Town Hall and the Pnyx | Forum and debates. **Frozen** (see SPEC.md). |
| **Mine** | the Treasury | Saved words, notes, bookmarks, places, downloads. |

## Reading

- **Reader**: the page that shows a text. It opens on the Greek alone; "Show the English" opens a passage's translation under it, and Text (Aa) can set the two side by side.
- **Foot bar**: the reader's one bar, along the foot of the page: Library, where you are (it opens Go to), Text (Aa: the columns, Paper or Night, the size of the Greek, the line spacing) and Study.
- **Study**: the reader's menu of every reading tool, in groups: Reading help, Go deeper, Edition and translation, More.
- **Passage strip**: the strip that opens on a passage's number or selected words: Bookmark, Favourite, Note, the four highlight colours, Notebook, Share, Echoes.
- **Look-up**: what opens when a word is clicked: meaning, form and LSJ entry, in place. The site's core.
- **Passage**: a citable piece of a text (a line, a section, a Stephanus page).
- **Floating reader**: the reader in a small window that stays open while moving around the site.
- **Reading aids**: the helps under Reading help in Study (Transliteration, Colour by case, Metre, Try it first, the page's vocabulary, Find in this text).

## Finding and counting

- **Oracle**: the search, across all texts.
- **Echoes**: repeated words and phrases within a book.
- **Census** ("Most Mentioned"): ranked names, things, words and phrases.
- **Word Study**: every form of one dictionary word and its count in each work.

## Exploring

- **Periplus**: the map. **Frozen.**
- **Kerameikos**: the archaeology section.
- **Entry**: one wiki article in the Painted Stoa.

## The look (the printed page, `docs/adr/0008-the-printed-page.md`)

- **Paper** and **Night**: the two looks. The site follows the device unless Settings says otherwise.
- **Plate**: a numbered photograph with its credit ("Plate I").
- **Ink-in**: the one movement. Words and plates fade in as they arrive, then nothing moves.
- **Bottom bar**: the four rooms along the foot of a phone's screen.

## Data

- **Packs**: the large generated files (word analyses, LSJ, search, Word Study), published at `/packs/`, not in git.
- **Corpus**: the original Perseus and First1KGreek text files, read unchanged.
- **Author draft**: one of the 85 old-site author articles, unpublished until every claim is checked against a source.
