# 9. The quiet desk: the reader redesigned around the Greek
Date: 2026-10-25
Follows: 0008, whose reader it changes. The rest of 0008 stands.

Context:
- On 2026-10-24 the owner asked for a review of the reader before any more building. They wanted to read real
  Ancient Greek from the first week, with the Greek as the beauty and the word look-up as the signature moment.
- The review found about 60 controls around one passage. The look-up was the smallest and busiest type on the page,
  and it opened in three different places on a computer. The English stood beside the Greek by default, and a book
  opened on a title page about 900 px above its first line.
- The owner answered twelve questions on 2026-10-24, then chose mockup B, "the quiet desk", from three.
- The spec is `.scratch/reader-redesign/spec.md`, and the tickets are in `.scratch/reader-redesign/issues/`.

Decision (what changes from 0008, for the reader only):
1. Decision 4 becomes one placement per device. At 1100 px wide or more, the look-up is a window about 300 px wide
   over the right margin, fixed to the screen so that the text scrolls while it stays (the owner, 2026-10-26, after
   trying a note level with the line). Below 1100 px it is a low sheet over about a quarter of the screen. The other
   placements go.
2. Decision 5 becomes Greek alone by default. Each passage has "Show the English", and Aa still offers Both.
3. Decision 7, in the reader: a book opens on its text under a one-line title. The title page and its photograph show
   only the first time that book is opened.
4. The look-up has two layers. The first shows the dictionary form, the kind of word, one meaning line, what the word
   does in this sentence (only where the treebank says), and the grammar in plain words. "More about it" opens the
   rest.
5. The reader has its own bar at the foot: Library, where you are, Aa and Study. Every tool the reader has stays,
   behind Study. Decision 10 still holds: the site's phone bar stays out of the reader.
6. The Greek is set in Gentium Book Plus. GFS Didot leaves the reading choices and stays for titles.
7. The reader's own parts are tidied before the new look goes on: one panel shell, one button set, one switch, and
   spacing on the scale.

Consequences:
- Every panel, sheet and dialog in `web/src/components/reader/` is built from one shell (`Panel.tsx`), and a test
  fails if a new one is not.
- Code comments cite "the quiet desk" and a ticket number for these decisions.
- 0008 still governs the rest of the site, including its photographs, until a later decision changes them.
- The reader shows no photographs (the owner, 2026-10-26): ADR 0008's frontispiece for each book goes, and with it the
  red first line of a book (its rubric).
