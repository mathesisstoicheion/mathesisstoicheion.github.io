# Spec: the reader, redesigned around the Greek ("the quiet desk")

Date: 2026-10-24. Status: agreed with the owner, not built. Nothing here is built until the owner says "start building".

Where this comes from:
- The review (audit, research, critique and twelve questions):
  https://claude.ai/artifact/69gpJD9PbQuAGALpbdz91t
- The three mockups. The owner chose **B, "the quiet desk"** on 2026-10-24:
  https://claude.ai/artifact/8VkCS4sd3vrEt9ycDuUbEf
- The owner's answers to the twelve questions, 2026-10-24: 1a, 2a, 3a, 4a, 5a, 6b, 7a, 8 (see the mockups), 9a, 10c,
  11a, 12a. Each one appears below where it applies.

## Problem

The site's promise is "Read real Ancient Greek from the first week, with every word explained on the line". The reader
is where that promise is kept, and today it gets in the way:

- **About 60 controls sit around one passage of Homer.** The top of the screen reads like a software toolbar of framed
  buttons. On a phone the ··· menu is 1,425 px tall.
- **The word look-up is the smallest and busiest type on the page.** The look-up should be the signature moment, but:
  - It has seven sections and three sources of meaning that repeat each other.
  - It shows a badge, a lesson card and credits in four places.
  - On a computer it is 14 px type in a 210 px column.
  - It appears in three different places depending on the window width.
  - On a phone it opens at 46% of the screen.
- **The English stands beside the Greek by default**, at almost equal weight, so the eye goes to it first.
- **A book opens on a title page** with a photograph and a nine-line caption. On a computer the first Greek line is
  about 900 px down.
- **Homer's lines break in two on a phone.** At the current size about 21 letters fit on a line.
- **The parts underneath have never been tidied.** The site has been re-skinned about six times in two weeks, and the
  parts under each skin stayed the same:
  - 27 panel builds
  - about 50 button styles
  - 194 spacing values off the scale in `Reader.module.css` alone
  - colour names left over from scrapped looks

## Solution

The reader becomes a quiet desk. The Greek fills the page alone, set large in Gentium, with red line numbers at the
start of each passage. Nothing sits at the top of the screen.

- **The bar at the foot.** One quiet bar holds the way back to the Library, where you are in the book ("line 1 of 611"
  with a thin progress rule), **Aa** (type and page) and **Study** (every other tool).
- **Tapping a word.** The word gets a soft highlight.
  - On a computer, a short note opens in the margin beside the line (about 300 px wide), joined to the word by a thin
    line.
  - On a phone, a low sheet rises over about a quarter of the screen, and the lines above stay readable.
- **What the note shows:**
  - the dictionary form and what kind of word it is ("μῆνις, noun, feminine")
  - one line of meaning ("wrath, revengeful temper")
  - where the treebank (a hand-made analysis of each sentence's grammar) has it, what the word does in this sentence
    ("Here it is the object of ἄειδε: the thing the goddess is to sing")
  - the grammar in plain words ("Accusative singular")
  - Previous, Next and **More about it**
- **More about it** opens the second layer:
  - on a computer, a side panel; on a phone, the sheet dragged up
  - the second layer holds the dictionary entry, where else the word occurs, how the sentence is built, the lesson
    that explains the grammar, Word Study, the other dictionaries, and one quiet line of credits
- **The English is one tap away** for each passage ("Show the English"), never beside the Greek by default.
- **A book opens on its text**, under a one-line title ("Ἰλιάς · Homer, Iliad, book 1"). The title page with its
  photograph shows only the first time you open that book.

Phone and computer get equal care (answer 10c). Neither is a cut-down copy of the other.

## User stories

### Reading
1. As a reader, I want a book to open straight on its Greek text, so that I start reading at once.
2. As a reader opening a book for the first time, I want to see its title page and photograph once, so that the edition
   still has its moment of ceremony.
3. As a reader, I want the Greek alone on the page by default, so that my eye stays on the Greek and not on the English.
4. As a reader, I want to show the English for one passage with one tap, and hide it again, so that I can check my
   understanding without the English taking over.
5. As a reader who prefers it, I want to still choose Greek and English side by side in Aa, so that the old way stays
   possible.
6. As a reader on a phone, I want each line of Homer to fit whole on the screen, so that a verse stays one line of
   metre and meaning.
7. As a reader, I want red line numbers at the start of each passage and a one-line title, so that I know where I am
   without a toolbar.
8. As a reader, I want to see where I am in the book ("line 1 of 611") at the foot, so that I know my progress without
   a header.
9. As a reader in Night, I want the same quiet desk in Night's colours, so that reading in the dark feels the same.

### The look-up
10. As a reader, I want to tap any Greek word and see its meaning beside it at once, so that I never leave the text.
11. As a reader, I want the word I tapped to stay visible and softly marked, so that I know which word the note is
    about.
12. As a reader on a computer, I want the note in the margin beside the line, joined to the word by a thin line, so
    that my eye travels the shortest way.
13. As a reader on a computer, I want the note always in the same place, whatever the window width or other open
    panels, so that the look-up is predictable.
14. As a reader on a phone, I want a low sheet over about a quarter of the screen, so that I can keep reading the lines
    above it.
15. As a reader on a phone, I want to drag the sheet up for more and down to close it, so that the gesture matches every
    other phone app.
16. As a reader, I want the first layer to show only the dictionary form, the kind of word, one line of meaning, what
    the word does here, and the grammar in plain words, so that I am not flooded.
17. As a reader, I want the meaning line to come from a real dictionary, never made up, so that I can trust it.
18. As a reader, I want "what the word does here" only when the treebank gives it, and nothing when it does not, so
    that the reader never guesses.
19. As a reader, I want to step to the previous and next word from the note, so that I can read word by word.
20. As a reader, I want "More about it" to open the full dictionary entry, other places the word occurs, the sentence's
    structure, the lesson on its grammar, Word Study and the other dictionaries, so that nothing useful is lost.
21. As a reader, I want the credits as one quiet line at the foot of the second layer, so that the sources are honoured
    without crowding the note.
22. As a reader using a keyboard, I want to reach words, step between them, open More and close the look-up with
    Escape, so that the reader works without a mouse.
23. As a reader using a screen reader, I want the note announced with the word it explains, so that the look-up makes
    sense without sight.

### Tools
24. As a reader, I want every tool the reader has today still there, behind one Study menu, so that nothing is lost and
    nothing crowds the page (answer 6b).
25. As a reader, I want Aa to hold only type and page choices (Paper, Night or follow the device, size, line spacing,
    Greek or both columns), so that it is small and clear.
26. As a reader on a phone, I want the foot bar to slip away while I read on and come back when I scroll up or tap,
    so that the Greek has the whole screen.
27. As a reader on a phone, I want the bar's controls large enough to tap (44 px), so that I never mis-tap.
28. As the owner, I want my private texts, notes, bookmarks and highlights to keep working, so that the redesign loses
    none of my things.

## Decisions

### Look
- **Typeface.** The Greek is set in Gentium Book Plus, as in mockup B. The owner did not ask for Porson, so Gentium
  stays. GFS Didot leaves the reading choices in Aa and stays for titles only. A saved choice of Didot becomes Gentium.
- **Sizes.**
  - Greek on a computer: about 26 px, with a line height of about 1.8.
  - Verse on a phone: about 16.5 to 18 px, chosen so that the longest line of the passage fits whole. It never goes
    below 16 px. A line that still does not fit wraps with a hanging indent.
  - Prose on a phone keeps the reader's size setting.
- **The note's type.** The meaning is the largest English on the screen, about 25 px on a computer and 22 px on a
  phone. The note is never smaller than the text it explains.
- **Colours.** Only Paper and Night colours from `tokens.css`. The tapped word gets a soft paper-tone highlight. Red
  is kept for line numbers, "More about it" and links.
- **The page shade goes.** The darkening gradient at the foot of the page (`globals.css`, `--paper-shade`) is removed
  from the reader.

### Placement
- **One placement per device.**
  - When the window is 1100 px or wider: the margin note, with the side panel for More.
  - Below 1100 px: the sheet.
  - The 400 px side-panel note and the in-between sheet go.
- **The sheet rests at about a quarter of the screen**, and drags up to nearly full for More. It never covers the
  tapped line; the text scrolls so the line stays above the sheet.

### Tools and the bar
- **The bar at the foot of the reader** belongs to the reader alone.
  - ADR 0008 decision 10 keeps the site's own phone bar out of the reader, and that still holds.
  - On a computer the bar is always shown.
  - On a phone it hides on scroll down and while the look-up is open.
- **Study** holds every tool the reader has today. It is grouped so that the tools a beginner uses come first: find, go
  to a line, colour by case, metre, try it first, vocabulary, notes and marks. Comparing editions, a second book, the
  floating reader, Places, Manuscript, Listen and Echoes come after. Nothing is removed (answer 6b).

### Defaults and saved settings
- **Columns.** The default becomes Greek alone. People's saved "Both" changes to "Greek" once, because "Both" was the
  old default and not a choice anyone made. "Both" stays available in Aa.
- **First opening.** The title page shows once per book. Which books have been opened is remembered on the device,
  alongside the other reader settings.

### Building order (answer 12a)
Tidy the reader's own parts first, then put the new look on them:
- one panel shell, one button set and one switch
- spacing on the 4–8–12–16–24–36–56–80 scale
- unused colour names removed from the reader's files

The token check (`check-tokens`) must pass for every reader file before the new look goes on.

### The decision record
A new ADR (0009, the quiet desk) records the changes this spec makes to ADR 0008:
- decision 4: one placement per device
- decision 5: Greek alone by default
- decision 7's spirit for the reader: the title page shows only on a book's first opening

### Parts to build or change
These are the deep parts, each testable alone:
- **The look-up card.** A pure function from a word and its place in the text to what the first layer shows: the
  dictionary form, the kind of word, the meaning line and its source, the grammar in plain words, and the role in the
  sentence (or none).
  - The meaning line comes from the core vocabulary list where the word is in it, otherwise from LSJ's short
    definition, and it names its source.
  - The role in the sentence comes from the treebank through `governor()` in `lib/constructions.ts`. A small table
    turns each relation into plain words ("object of", "subject of", …). An unknown relation shows nothing.
- **Plain grammar.** It builds on `lib/lookup/postag.ts`, turning a tag into "noun, feminine" and "Accusative singular".
- **Placement.** One rule that takes the window width and returns "note" or "sheet". It is used everywhere the look-up
  opens, so that Reader.tsx no longer decides in three places.
- **Verse fit.** A function from a passage's longest line and the screen width to the Greek size, with the 16 px
  floor.
- **First opening.** A small store that remembers which books have been opened.
- **The reader shell.** The one-line title, the passages, the foot bar, Aa and Study. Reader.tsx (1,948 lines) is split
  along these lines while the work is done.

## Testing

Tests check what a reader sees or what a function returns, never how the code is arranged inside. The site already
has examples to follow: `lib/lookup/*.test.ts` for small parts with vitest, and `web/scripts/check-*.mjs` for checks
on the built site with Playwright.

- **Unit tests (vitest)**, written first, as the build steps are done one at a time:
  - **The look-up card:**
    - μῆνιν in Iliad 1.1 gives μῆνις, "noun, feminine", "wrath, revengeful temper", "Accusative singular", and
      "object of ἄειδε".
    - A word with no treebank gives no role.
    - A word missing from every dictionary says so plainly.
  - **Plain grammar:** a set of real tags and their wording.
  - **Placement:** 1099 px gives the sheet and 1100 px gives the note.
  - **Verse fit:** the Iliad's longest lines at 390 px fit, and the size never goes below 16 px.
  - **First opening and the saved-settings change.**
- **Built-site checks.** `check-reader` and `check-lookup` gain:
  - no toolbar at the top
  - a book opens on Greek with no English column
  - the English shows and hides per passage
  - on a computer, the note is at least 280 px wide, beside the tapped line, never covering it, and in the same place
    with other panels open
  - on a phone, the sheet rests at or below 27% of the screen and never covers the tapped line
  - every Iliad 1 line fits whole at 390 px
  - every reader control is at least 44 px on a phone
  - Escape closes the look-up and gives focus back to the word
  - the same checks pass in Paper and Night
- **The token check** runs on the reader's files with a baseline of zero once the tidy-up is done.

## Out of scope

- The rest of the site. Answer 11a (photographs only where they teach, none in page heads) is agreed but belongs to a
  later piece of work.
- A gloss printed on the line before tapping (answer 2a: no).
- GFS Porson and Literata.
- The frozen features: the forum (sign-in keeps working), the map and the everyday-life wiki. Also out: the 8,000-text
  import and the outreach to scholars.
- The translation tool (a separate project).
- Changes to the data packs. The look-up uses only data the site already loads.
- Removing any tool. Tools move behind Study; none is deleted.

## Notes

- The data shown in the mockups is real (Iliad 1.1, Monro's text and Murray's English, LSJ and the GLAUx analysis).
  The tests use the same.
- Every step is a ticket in `.scratch/reader-redesign/issues/`, built one at a time with the owner's go between them.
