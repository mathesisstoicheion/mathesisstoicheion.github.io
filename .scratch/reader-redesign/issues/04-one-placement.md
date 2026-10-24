# 04. The look-up in one place per device

Status: ready-for-agent
Type: HITL (the owner looks at it before the next ticket)
Blocked by: 03
Spec: `../spec.md`, "Placement". User stories 10 to 15, 22

## What to build

- One rule decides where the look-up opens:
  - at 1100 px or wider, the margin note
  - below that, the sheet
  - Reader.tsx asks this rule in every place it opens the look-up. The 400 px side-panel note and the in-between sheet
    go.
- **Computer.** The margin note is about 300 px wide, level with the tapped line, and joined to the word by a thin
  line, as in mockup B.
- **Phone.** The sheet rests at about a quarter of the screen. It drags up for more and down to close. The text scrolls
  so that the tapped line stays above it.
- **The tapped word** gets the soft paper-tone highlight in Paper and the matching tone in Night.
- **Content.** The note still shows what the look-up shows today. Ticket 05 changes the content.

## Acceptance criteria

- [ ] A unit test checks the rule: 1099 px gives the sheet, 1100 px gives the note.
- [ ] `check-lookup` checks that, on a computer at 1440 × 900:
  - [ ] the note is at least 280 px wide, beside the tapped line, and never covers it
  - [ ] the note is in the same place with another panel open
- [ ] `check-lookup` checks that, on a phone at 390 × 844:
  - [ ] the sheet rests at or below 27% of the screen height
  - [ ] the sheet never covers the tapped line
- [ ] Escape closes the look-up and gives focus back to the word, and Previous and Next still step between words.
- [ ] The owner has looked at it on the computer and on the OnePlus and given the go.

## Comments
