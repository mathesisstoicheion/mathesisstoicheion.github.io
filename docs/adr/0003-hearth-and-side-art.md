# 3. The hearth, and art beside the text
Date: 2026-10-16
Follows: 0002-scroll-per-page.md.

Context: After round 3 the owner asked for fewer sparks and a fire that never goes out, which lights "a face or an object, with a dramatic shadow. Lit up from underneath, revealing more when you scroll up or down". They found the library too still when idle, and said much of Socrates' face was covered as you scrolled down: "The animation needs to be seen." The reader could have "a bit more atmosphere and character until you scroll and begin to read".

Options for the lit object:
- The Athenian coin: it is the home page's emblem, but a coin's low relief throws almost no shadow.
- A marble head: strong shadows, but white marble under firelight reads cold.
- The gold "Mask of Agamemnon" from Mycenae: deep relief (brows, nose, beard), gold that answers firelight, a public-domain photograph (CC0), and it is already the Iliad's emblem in the library.

Decision:
- The home page has a hearth: a fire drawn by the page burns at the foot of the screen and lights the gold mask from below. Scrolling either way fans it. Only a few sparks rise, from the fire itself.
- The mask is lit from its photograph turned into a colour map and a height map, so the firelight can fall across its surface and throw shadows.
- On wide screens, the home page and the library read down a left-hand column, and their moving art stands beside it, uncovered. On phones the art stays behind the page.
- The coin moves from the home page's first screen into its windows, each window framing a whole coin.
- The library's Socrates gathers by himself within a few seconds. When idle, a light reads the speech across his face, loose letters circle him, and a band of light passes over him from time to time.
- The reader opens on a lamplit cover that fades as you scroll into the text.

Consequences:
- The home page needs WebGL (graphics drawn by the device's graphics chip). Without it, a simpler flat fire is drawn. The hearth lowers its own resolution if a device cannot keep up. Its speed on real phones still has to be checked in the build.
- Wide-screen pages give the text about half the width. Wide grids (the five rooms, the nine Muses) wrap into fewer columns.
- The reader's cover adds one screen above the text. In the build it should show on a work's first page only, not on every chapter.
