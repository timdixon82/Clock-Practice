# Brief: 005-branch-cleanup-script-fix

## Summary

`scripts/cleanup-branches.sh` exists in the working tree but was never committed to the repository, and its remote-branch detection has a bug: it mistakes the `origin/HEAD -> origin/main` symbolic ref for a real branch name, which would break a live `git push origin --delete` run. This work commits the script properly and fixes the detection.

Preamble fields:

- Status: `active`
- Branch: `chore/fix-cleanup-branches-script` (to be created by Sean)
- Mockup mode: D (dev tooling script, no UI)
- Priority: 3
- Blockers: None

## Requirements

None recorded yet. Tad to write a short requirements note in this work folder (`requirements.md`) covering: what the script must do (report/delete local and remote branches already merged into `main`, excluding `main` and `release-please-*`), and the specific defect to fix (symbolic ref false positive).

## Routing plan

Tad (requirements) -> Sean (build + fix on branch) -> Sonja (architecture-and-security conformance check; not architecture- or security-sensitive, so no Jacob/Jed escalation expected) -> Carol (functional test only; no UI, so accessibility/visual passes are not applicable) -> Sonja (review, take to Tim, merge only on his approval).

## Out of scope

- Adding new cleanup capabilities beyond what the script already does (e.g. deleting branches not merged into main, pruning tags, or any GitHub Actions workflow to run this automatically).
- Any change to the pre-approved GitHub actions list or to the hard deny-list. Branch deletion via this script is run by Tim himself, not by any agent, and that stays true after this fix.
- Committing or otherwise touching `/tmp/clock-practice-branch-cleanup.sh`, the one-off script Sonja already handed Tim directly; that file is out of scope for this work folder.

## Risk and rollback

Risk: a bug in the detection logic could cause the script to attempt to delete a branch that is not actually safe to delete.

Rollback: the script is only ever run manually by Tim, never by an agent or in CI, so a bad version can simply not be run; reverting the commit on `main` removes it entirely.

## Definition of done

- [ ] `scripts/cleanup-branches.sh` is committed to the repository.
- [ ] Running `--dry-run` against a repo with a remote `origin/HEAD` symbolic ref no longer lists `HEAD -> origin/main` (or any symbolic-ref artifact) as a branch to delete.
- [ ] Running `--dry-run` still correctly lists genuinely merged local and remote branches, excluding `main` and `release-please-*`.
- [ ] Carol's functional test confirms both of the above on a real or simulated branch set.
- [ ] Pull request opened, conformance check passed, and Sonja has brought it to Tim for merge approval.

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

The hard deny-list from `CLAUDE.md`: force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.
