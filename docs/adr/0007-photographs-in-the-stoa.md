# 7. When a photograph appears, and how
Date: 2026-10-20
Follows: the review fix list (mathesis-fix-prompt.md), slice 9.

Context:
- The review found that the Archaeology card on the Painted Stoa's page, and the pictures on entry pages, are full-colour photographs, while the rest of the site shows gold engravings.
- The fix list asked for one of two things: give the photographs the engraving treatment, or set a deliberate rule for when photographs appear.

Decision:
- A photograph is used only for a real object or a real place: a find, a site, a manuscript page.
- On an entry's own page, and in the Archaeology room (the Kerameikos), the photograph is the evidence, so it is shown in its true colours, with its caption and credit.
- Where a photograph stands for a room or an entry, for example a card on the Stoa's page or "On the wall today", it gets the engraving's gold: greyscale, warmed to sepia and dimmed. Pointed at or focused, it fades into its own colours, so the card still shows what is behind it.
- Everything that is not a photograph of a real object or place is drawn in the engraving style, as before.

Consequences:
- The detector `web/scripts/check-rooms.mjs` checks that every photograph on the Stoa's page carries the engraving filter.
- A new card that uses a photograph should use the same filter (ExploreLead.module.css `.pic`, Stoa.module.css `.featuredPic`).
