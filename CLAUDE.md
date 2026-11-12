# Mathesis Stoicheion

A site for reading real Ancient Greek, with a word look-up on every word. See `SPEC.md` for what the site is,
`GLOSSARY.md` for the site's own words, `DESIGN.md` for the look, `PROGRESS.md` for where things stand.

## Facts about the project
- The work lives in the claude.ai Project "Mathesis Stoicheion" and this GitHub repository. The branch
  `claude/project-thread-wj81cr` is out of date.
- A push to `main` republishes https://mathesisstoicheion.com/ (see `DEPLOYMENT.md`).
- The site is a Next.js static export in `web/`, also packed into an Android app in `android/`. The GitHub workflows
  `checks.yml` (site checks) and `android.yml` (beta app build) run on request.
- Accounts run on Supabase.
- Tickets are markdown files in `.scratch/` (`docs/agents/issue-tracker.md`); the repository is public.
- Author drafts from an earlier site are kept on the owner's computer only (`pipeline/drafts/`, not in git).
- Older planning files are in `_archive/`.
