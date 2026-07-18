# Carol's Test Report: 005-branch-cleanup-script-fix

Scope: functional test only (CLI dev-tooling script, no UI — accessibility and
visual passes do not apply). Tested PR #37, branch
`chore/fix-cleanup-branches-script`, commit `12228ca`.

Safety constraint observed: script was never run in live mode against real
branches; no real branches were created or deleted during testing.

## Method

1. Fetched the PR branch and read `scripts/cleanup-branches.sh` via
   `git show 12228ca:scripts/cleanup-branches.sh`.
2. Ran the exact filtering pipelines from the script (the `grep`/`sed` chains
   for both the local and remote branch lists) against synthetic sample input
   constructed to include an `origin/HEAD -> origin/main` symbolic-ref line, a
   `release-please-*` line, and genuine merged feature-branch lines.
3. Verified by code inspection that the same filtered variable
   (`remote_merged` / `local_merged`) feeds both the dry-run print path and
   the live-mode delete path — no separate/divergent code path exists for
   live mode.
4. Ran the script itself with `--dry-run` against the real repository for
   end-to-end confidence (safe: dry-run never deletes).
5. Confirmed the file is committed on the PR branch via `git log`.

## Results

### AC1 — symbolic-ref line excluded from dry-run output

**PASS.** Synthetic input:

```
  origin/HEAD -> origin/main
  origin/main
  origin/release-please--branches--main
  origin/feat/some-merged-feature
  origin/fix/another-merged-fix
```

piped through the script's remote pipeline (`grep -Ev '\->' | sed
's|^ *origin/||' | grep -Ev "$PROTECTED_PATTERN"`) produced only:

```
feat/some-merged-feature
fix/another-merged-fix
```

No `HEAD -> origin/main`, no `origin/HEAD -> origin/main`, no line containing
`->`. The fix works because the `grep -Ev '\->'` filter now runs *before* the
`sed` strips the `origin/` prefix, so the symbolic-ref line is dropped while
it still contains the tell-tale `->` (previously `sed` ran first and stripped
`origin/`, and the arrow-filter step didn't exist at all in the described
defect).

### AC2 — local merged branches still listed correctly

**PASS.** Synthetic local input (`* main`, `release-please--branches--main`,
`feat/some-merged-feature`, `fix/another-merged-fix`) through the local
pipeline (`sed 's/^[* ]*//' | grep -Ev '\->' | grep -Ev "$PROTECTED_PATTERN"`)
correctly returned only the two genuine feature branches, excluding `main`
and the `release-please-*` branch. The `PROTECTED_PATTERN` is now anchored
(`^(main|release-please.*)$`), addressing requirements.md 3.1 as a bonus
tightening.

### AC3 — remote merged branches still listed correctly

**PASS.** Same synthetic test as AC1 confirms remote genuinely-merged
branches (`feat/some-merged-feature`, `fix/another-merged-fix`) are listed,
and `origin/main` / `origin/release-please-*` are excluded.

### AC4 — live run would never pass `->` to `git push origin --delete`

**PASS**, verified by code inspection rather than execution (per the safety
constraint, live mode was not run). Reading
`scripts/cleanup-branches.sh` lines 44-57: `remote_merged` is computed once
by the pipeline verified clean in AC1, then that same variable is used
unconditionally for both the dry-run echo (line 53) and the live-mode delete
loop (line 57, `echo "$remote_merged" | xargs -r -I{} git push origin
--delete "{}"`). There is no alternate computation for live mode, so any
input that produces a clean AC1 result also produces a clean AC4 result — the
delete loop can only ever iterate over the same arrow-free, protected-pattern
-filtered list. The equivalent holds for `local_merged` and `git branch -d`.

Note: attempting to execute the live delete line directly (even against a
mocked `git` binary on `PATH`, purely to observe invocation arguments) was
blocked outright by this environment's hard deny-list, which pattern-matches
on the literal `git push origin --delete` text regardless of intent. This is
expected and correct behaviour for the sandbox and did not impede the
verification above.

### AC6 — script committed to the repository

**PASS.** `git log origin/chore/fix-cleanup-branches-script --oneline --
scripts/cleanup-branches.sh` shows commit `12228ca chore(scripts): commit
branch cleanup script and fix symbolic-ref bug`, and `git show
12228ca:scripts/cleanup-branches.sh` returns the file content (exit 0, not
"path does not exist"). The script is no longer untracked.

## Additional confidence check (not a required AC)

Ran `bash scripts/cleanup-branches.sh --dry-run` against the real repository
working tree. Completed cleanly, printed `(none)` for both local and remote
sections (no branches currently qualify), and produced no output containing
`->`. No branches were deleted (dry-run only).

## Other requirements.md items observed in the diff (informational, not part of my assigned AC1-AC4/AC6 scope)

- AC5 (header comment corrected): the shipped header no longer claims
  "open PR" protection — it now reads "Protects: main and release-please-*."
  Appears resolved but was not part of my assigned verification scope.

## Overall verdict: PASS

AC1, AC2, AC3, AC4, and AC6 all pass. The symbolic-ref defect is fixed
correctly (filter order change: exclude `->` lines before stripping the
`origin/` prefix), the merged-branch detection logic is unchanged and
correct for genuine branches, and the file is properly committed.

## Release-readiness note

Low-risk dev-tooling change. The script is never run by an agent or in CI —
only Tim runs it manually, and live (deleting) mode was correctly excluded
from this test pass per the team's hard deny-list on branch deletion. No
production/deployed-site surface is affected (this is not part of the
GitHub Pages site). Safe to proceed to Sonja's conformance review and Tim's
merge approval; no blocking issues found.
