# Brief: 007-dark-mode-clock-visibility

## Summary

Tim reports the site "looks terrible" and the clock hands don't show when the browser is running in dark mode. All visual elements in `index.html` and `styles/styles.css` carry explicit hex colours, so the likely cause is the absence of a declared `color-scheme` (letting Chrome/Edge/Safari apply automatic forced-dark repainting to the page) or Windows/browser forced-colors mode overriding SVG stroke/fill. Needs diagnosis in an actual dark-mode render before a fix is written.

Preamble fields:

- Status: `active`
- Branch: `fix/dark-mode-clock-visibility`
- Mockup mode: D (bug fix to existing visuals; no new UI, skip mockup phase)
- Priority: 1
- Blockers: None

## Requirements

None written up separately; the requirement is captured in this brief: the page must remain legible and the clock hands must remain visible under `prefers-color-scheme: dark` and under Windows forced-colors mode, without breaking the existing AAA-contrast light-mode palette recorded at the top of `styles/styles.css`.

## Routing plan

Carol (diagnose: reproduce in dark mode, capture computed styles/screenshot, report root cause) -> Sean (fix on branch) -> architecture-and-security conformance check (styling-only change, no escalation expected) -> Carol (functional + accessibility retest in parallel, confirm light mode unaffected) -> Sonja (review, take to Tim, merge only on approval).

## Out of scope

- Adding a user-facing dark theme / theme toggle. This fix keeps the site single-themed (light) but stops browsers from forcibly repainting it.
- Redesigning the palette or layout Tim did not ask about.
- Any change to the CSP, hosting, or other project settings unrelated to colour rendering.

## Risk and rollback

Risk: an incorrect fix (e.g. disabling forced-colors support outright) could harm high-contrast-mode users rather than help them, so the fix must be verified in both `prefers-color-scheme: dark` and `forced-colors: active` before merge.

Rollback: revert the merge commit on `main`; the change is CSS/HTML only with no data or migration impact, so revert is immediate and safe.

## Definition of done

- [ ] Root cause of hands/backgrounds not showing in dark mode is identified and documented in this work folder.
- [ ] Clock hands, face, numbers, and all text remain visible and at or above AAA contrast when the OS/browser is set to dark mode.
- [ ] Page renders unchanged (pixel-equivalent) in light mode after the fix.
- [ ] Carol's functional and accessibility passes both show PASS.
- [ ] No new console errors introduced.

## Approved GitHub actions

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [x] Comment on a pull request or an issue
- [x] Create an issue

## Not pre-approved

- Merging to the main branch. This always needs Tim's express approval at the time.
- Publishing to a blog or a social media account.

## Never allowed

Force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.
