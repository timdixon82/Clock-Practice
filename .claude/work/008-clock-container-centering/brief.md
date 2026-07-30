# Brief: 008-clock-container-centering

## Summary

Regression from work item 007: giving `.clock-container` `width: fit-content` (to fix a stretched oval) removed the implicit full-width block sizing that had been keeping it visually centered. As a plain block element it now hugs the left edge of `<main>` instead of sitting in the middle; `body`'s `align-items: center` only centers its direct flex children (`<header>`, `<main>`), not further-nested descendants.

Preamble fields:

- Status: `active`
- Branch: `fix/clock-container-centering`
- Mockup mode: D (one-line CSS regression fix, no new UI)
- Priority: 1
- Blockers: None

## Requirements

None written up separately; the requirement is that the clock backdrop (from work 007) is both a true circle and horizontally centered within the page, at every breakpoint the site supports.

## Routing plan

Sean (fix on branch) -> architecture-and-security conformance check (styling-only, no escalation expected) -> Carol (functional + accessibility + visual check in parallel) -> Sonja (review, take to Tim, merge only on approval).

## Out of scope

- Any change to the width: fit-content fix itself from work 007 (that stays; it correctly fixes the oval).
- Any other layout or visual change Tim did not ask about.

## Risk and rollback

Risk: an incorrect centering approach (e.g. hardcoding margins that don't hold at the small-screen breakpoint) could reintroduce off-center or clipped layout on narrow viewports.

Rollback: revert the merge commit on main; CSS-only change, no data impact, safe to revert immediately.

## Definition of done

- [ ] `.clock-container` renders as a true circle (carried over from 007, must not regress).
- [ ] `.clock-container` is horizontally centered within the page at normal viewport width.
- [ ] `.clock-container` remains centered at the narrow (<=360px) breakpoint.
- [ ] Carol's functional and accessibility passes both show PASS.
- [ ] No new console errors.

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
