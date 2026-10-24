# 09. The bar at the foot, Study and a smaller Aa

Status: ready-for-agent
Type: HITL
Blocked by: 03
Spec: `../spec.md`, "Tools and the bar", "Typeface". User stories 8, 24 to 28

## What to build

- **The top toolbar goes.**
- **The bar at the foot of the reader** holds "← Library", where you are ("line 1 of 611" with a thin progress rule),
  Aa and Study.
  - On a computer it is always shown.
  - On a phone it hides as you read on, comes back on scrolling up or a tap, and hides while the look-up is open.
  - The site's own phone bar stays out of the reader (ADR 0008 decision 10).
- **Study** holds every tool the reader has today.
  - Beginner tools come first: find, go to a line, colour by case, metre, try it first, vocabulary, notes and marks.
  - Then come comparing editions, a second book, the floating reader, Places, Manuscript, Listen and Echoes.
  - Nothing is removed.
- **Aa** holds only:
  - Follow the device, Paper or Night
  - the Greek size and line spacing
  - Greek alone or Both
- **Didot** leaves the reading choices. A saved Didot becomes Gentium.
- **The page shade** (`--paper-shade`) is removed from the reader.
- **Splitting Reader.tsx.** While doing this, split the shell out of Reader.tsx: the title, the passages, the bar, Aa
  and Study.

## Acceptance criteria

- [ ] `check-reader` checks that nothing is fixed to the top of the reader.
- [ ] A test lists every tool reachable on main and checks each is reachable from Study.
- [ ] A unit test checks that a saved Didot becomes Gentium.
- [ ] Every bar control is at least 44 px on a phone.
- [ ] `check-bar` and `check-midscroll` pass.
- [ ] Private texts, notes, bookmarks and highlights still open and save. The owner is signed in for this; Claude never
      types a password.
- [ ] The owner has looked at it on the computer and on the OnePlus and given the go.

## Comments
