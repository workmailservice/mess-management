---
description: Typecheck, lint, and build the app, then summarize any failures before opening a PR
---

Run this project's pre-flight checks, in order, stopping to report clearly if any step fails:

1. `npx tsc --noEmit -p tsconfig.json` — type errors
2. `npx eslint .` — lint errors/warnings
3. `npm run build` — production build (catches issues typecheck/lint miss, e.g. Next.js route/type generation)

For each step:
- If it fails, show the relevant error output (don't dump the entire log) and stop — don't run later steps on top of a known failure unless asked to.
- If it passes, say so briefly and move to the next step.

At the end, give a one-line summary: all clear, or a punch list of what needs fixing before the PR is ready. Do not fix issues automatically unless asked — this command is a status check.
