# Brief: 004-clock-practice-setup

## Summary

Adopt the existing `timdixon82/Clock-Practice` repository as a team project: a static, accessible, interactive web page for practising telling the time on an analogue clock, built with HTML, CSS, and JavaScript and hosted on GitHub Pages. Set up the project wiki, backfill the missing reviews, add the team's repository configuration, and verify the project meets the team's standards.

- Status: archived
- Branch: main
- Priority:
- Blockers: None

## Requirements

No formal requirements exist. The repository is a single `index.html` with a favicon and a licence. Tad will reverse-engineer and record the requirements in the project wiki at `docs/requirements.md`.

## Routing plan

1. Sonja scaffolds the work folder, the project wiki skeleton, and the working branch `chore/project-setup`.
2. Backfill reviews, in parallel: Tad (business analysis), Jacob (architecture), Gerrie (security governance), Jed (code review and penetration test), Carol (baseline WCAG 2.2 AAA audit).
3. Sean adds the team's repository configuration on the branch.
4. Carol verifies; Neil produces the release checklist.
5. Sonja runs the conformance check and merge gate, and presents to Tim. Sean opens the pull request; Sonja merges only on Tim's express approval.

## Approved GitHub actions

The actions ticked below may run without pausing for Tim.

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [ ] Comment on a pull request or an issue
- [ ] Create an issue

Also approved for this work by Tim on 2026-05-21: clone the repository (completed); enable "Enforce HTTPS" on the repository's GitHub Pages settings (completed).

## Not pre-approved

- Merging to the main branch.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`: force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.
