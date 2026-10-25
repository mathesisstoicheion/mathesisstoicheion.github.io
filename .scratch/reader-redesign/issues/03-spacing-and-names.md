# 03. Spacing on the scale and old colour names out of the reader

Status: done (2026-10-25), waiting for the owner's go before 04
Type: AFK (no visible change meant)
Blocked by: 01, 02
Spec: `../spec.md`, "Building order"

## What to build

- Every spacing value in the reader's files uses the scale (`--space-1` to `--space-8`: 4, 8, 12, 16, 24, 36, 56,
  80 px). This covers the 194 off-scale values in `Reader.module.css` and those in the reader's other CSS files.
  Hairline gaps of 1 or 2 px may stay, listed in one place.
- Font sizes in the reader use the type scale, except the reader's own Greek size setting.
- Use the role names in the reader's files. Remove names from scrapped looks (`--gold` meaning red, `--lintel` and the
  like) from them. A token in `tokens.css` that nothing uses after this is moved out to `_archive/`, never deleted
  outright.
- Fix the failing token check on `PathStepView.tsx` and `PracticeView.tsx` while doing this. It fails on main today.

## Acceptance criteria

- [ ] `check-tokens` passes, and the reader's files have a baseline of zero.
- [ ] Side-by-side screenshots of Iliad 1 and the Apology show no visible change beyond spacing rounded to the scale.
      The screenshots are for checking only and are not sent to the owner. Any noticeable change is described in
      words in the comments.
- [ ] The build and all checks in `checks.yml` pass.

## Comments

2026-10-25, built:
- `web/src/components/reader/spacing.test.ts` is the check. It failed on the old stylesheets (350 spacing values off the
  scale and 52 old names) and passes now.
- Spacing:
  - Every spacing value in px in the reader's 10 stylesheets is now on the scale. A tie between two steps went to the
    smaller one (10 px became 8, 6 became 4, 14 became 12).
  - Hairlines use the new `--hair` (1 px) and `--hair-2` (2 px) in tokens.css.
  - The side panel's two widths are named `--side-panel` and `--side-panel-narrow`.
  - The map's place dots and the scroll-bar marks are now centred with `translate`, not half-pixel margins.
- Spacing left in em, on purpose: a note's mark, a verse's hanging indent and the like. They are set against the
  letters and must grow with the reader's Greek size.
- Font sizes are unchanged in this step:
  - The titles and numerals in GFS Didot stand outside the scale by the site's own rule (tokens.css).
  - The em sizes are relative to the text.
  - The look-up's big word and arrows are redrawn in ticket 05, and the title page in ticket 08.
- Old names: the reader's stylesheets now use plain names for its lines (`--rule-under`, `--rule-box`, `--red-left`
  and the rest, new in tokens.css) in place of the stone look's `--cut-*`, `--slab-*`, `--inlay-*`, `--groove`,
  `--channel` and `--field`.
- 72 tokens that nothing on the site used are moved to `_archive/tokens-2026-10-25/unused-tokens.css`. `--step-4` and
  `--warn` are kept, because the checks read them.
- PathStepView and PracticeView: 8 values that were already on the scale now use the scale's names, so
  `check-tokens` passes. The baseline is lowered by 373 values across the site (`check:tokens --update`).
- Not in this step, but still counted by the ratchet so they cannot grow: the reader's shadows (25), layers (24) and
  motion values (32).
- Looks: everything sits a few pixels tighter. Nothing moved out of place, judged by side-by-side screenshots of the
  page, the look-up, the panels and the Tools menu at 1440 and 390 px.
- One small fix found by check-a11y: the "Go" button in the two-book reader fell to 40 px wide on a phone when its
  padding went onto the scale. It is now held at the finger-sized 44 px. check-a11y passes apart from the Learn page's
  older complaint (`/academy/reading/desire-to-know`, word targets 25 px tall), which is outside the reader.
- Checks: check-overlays, check-reader, check-lookup, check-design, check-look, check-ink and check-credits pass.
  `spacing.test.ts` (new) failed on the old code with 350 values off the scale and 52 old names, and passes now.
