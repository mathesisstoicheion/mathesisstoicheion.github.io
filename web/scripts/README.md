# Check scripts

## Running the checks
- A thread runs only the one check for what it changed, on its own computer (build, serve with
  `node scripts/serve-out.mjs 3100`, then `node scripts/check-<name>.mjs http://localhost:3100`). It does not run them all.
- The full set runs on GitHub, as the workflow "Site checks" (`.github/workflows/checks.yml`). Start it by hand on the
  branch, or open a pull request. That run has the sign-in settings; a local build usually does not.
- Without the sign-in settings the account pages cannot work. The checks that need them print one line starting
  "SETUP:" and skip only those parts; the GitHub run covers them.
- While lessons are off (`LESSONS_SHOWN` in `src/config/lessons.ts`), the lesson pages show "not found", so the
  checks that use `scripts/lib/pages.mjs` leave them out and say how many.
