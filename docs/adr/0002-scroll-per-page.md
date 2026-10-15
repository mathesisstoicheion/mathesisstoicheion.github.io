# 2. A scroll style for each page
Date: 2026-10-15
Follows: 0001-visual-direction.md, which left the scroll style open.

Context: Round 2 sampled three ways to scroll: Windows, Shutters and Stage. The owner wanted a high-end feel without lag.

Options:
- Windows: calm, but the least to discover.
- Shutters: every window has a moment of arrival.
- Stage: one large picture that changes with the scroll. It is the most dramatic, but too much for every page.

Decision:
- The library uses Stage, with Socrates gathering out of the Apology's letters (the owner: "The Stage library is so sick. Keep that").
- The home page and the other pages use Shutters (the owner: "Shutters is awesome"). The floating Greek letters behind the page become sparks that the visitor fans with the pointer or a fast scroll.
- The home page gains the nine Muses as fanned flames.
- The reader has no scroll effect.

Consequences:
- Two scroll engines must be kept: a pinned stage, and shutter windows.
- The animation has to stay smooth on phones:
  - full-screen layers use no blend modes;
  - colours are read once per page;
  - letters are stamped from a prepared sheet;
  - the Stage keeps a still picture of the face and redraws it only when it changes.
- In the test browser this raised the frame rate from about 30 to about 50–55.
