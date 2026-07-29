# Brief: 006-deploy-asset-404-fix

## Summary

The live site at https://projects.timdixon.net/Clock-Practice/ serves only `index.html`; `styles.css`, `clock-practice.js`, `clock-logic.js`, and `favicon.svg` all 404. The Pages deploy workflow's rsync allow-list only publishes files under `/styles/`, `/scripts/`, `/data/`, and `/assets/` subfolders, but this project keeps its source files at the repo root. Tim chose Option B: restructure the project into the standard subfolder layout so the existing deploy workflow allow-list picks the files up unchanged.

Preamble fields:

- Status: `active`
- Branch: `fix/deploy-asset-layout` (Sean to create)
- Mockup mode: D (bug fix, no UI change)
- Priority: 1
- Blockers: None

## Requirements

No new user-facing requirement; this is a structural fix to match `docs/patterns/github-pages-deploy.md` (team standard) and the layout referenced in `docs/stacks/static-front-end.md`. Move:

- `styles.css` -> `styles/styles.css`
- `clock-practice.js` -> `scripts/clock-practice.js`
- `clock-logic.js` -> `scripts/clock-logic.js`
- `favicon.svg` -> `assets/favicon.svg`

Update all references in `index.html` (stylesheet link, script tags, favicon link) and any references elsewhere in the repo (tests, docs, CLAUDE.md "Source files" list, CSP if paths are referenced there — CSP here is by scheme/origin, not path, so should be unaffected but verify).

## Routing plan

Sean builds the restructure on a branch and opens a pull request. Carol tests (functional + accessibility in parallel) including a live-deploy smoke check once merged. Sonja reviews and takes it to Tim for merge approval.

## Out of scope

- No visual or behavioural changes to the app itself.
- No change to the CSP meta tag or other security headers.
- No change to the deploy workflow file itself (Option A alternative was declined; the workflow's allow-list is left as-is).
- No repository rename or history rewrite.
- Not fixing any pre-existing accessibility findings noted in the baseline audit; those remain tracked separately.

## Risk and rollback

Risk: a missed reference to a moved file (in `index.html`, tests, or `package.json` lint scripts) could leave the deployed site broken in a different way.

Rollback: revert the merge commit on `main`; the previous flat-file layout and its (broken) deploy remain in git history and can be restored in one revert.

## Definition of done

- [ ] `styles.css`, `clock-practice.js`, `clock-logic.js`, `favicon.svg` moved to `styles/`, `scripts/`, `scripts/`, `assets/` respectively.
- [ ] `index.html` references updated to the new paths and loads correctly locally.
- [ ] `package.json` lint scripts (`lint:css`, any others referencing old paths) updated to the new paths.
- [ ] CLAUDE.md "Source files" list updated to reflect new paths.
- [ ] CI (lint, accessibility, playwright) passes on the branch.
- [ ] After merge, the live site at https://projects.timdixon.net/Clock-Practice/ serves `styles/styles.css`, `scripts/clock-practice.js`, `scripts/clock-logic.js`, and `assets/favicon.svg` with HTTP 200, and the page renders styled and functional.
- [ ] Carol's functional and accessibility passes both sign off.

## Approved GitHub actions

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [x] Comment on a pull request or an issue
- [x] Create an issue

## Not pre-approved

These always pause for Tim, whatever is ticked above:

- Merging to the main branch. This always needs Tim's express approval at the time.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`. These are refused outright, whatever a brief says: force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.
