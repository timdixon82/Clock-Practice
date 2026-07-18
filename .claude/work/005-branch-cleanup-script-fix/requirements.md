# Requirements: 005-branch-cleanup-script-fix

## 1. Purpose (restated from the current script)

`scripts/cleanup-branches.sh` is a manually-run dev-tooling script (never run by an agent or in CI) that:

- Runs `git fetch --prune origin` to bring remote refs up to date.
- Lists local branches fully merged into `main` (`git branch --merged main`), excluding `main` itself and any branch matching `release-please.*`.
- Lists remote branches fully merged into `main` (`git branch -r --merged main`), excluding the same protected patterns.
- In `--dry-run` mode (first positional arg `--dry-run`), only prints the candidate lists — no deletion.
- In live mode (no argument), deletes the listed local branches with `git branch -d` (safe delete, refuses on unmerged branches) and the listed remote branches with `git push origin --delete <name>`.
- Exits cleanly and reports "(none)" for either list when nothing qualifies.

Note: the header comment (line 3) states branches with "an open PR" are also protected, but no such check exists anywhere in the script body — see defect 3.2 below.

## 2. Defect to fix: symbolic-ref false positive

`git branch -r --merged main` includes the symbolic ref line for the remote's default branch pointer, e.g.:

```
  origin/HEAD -> origin/main
```

The current pipeline (`sed 's|^ *origin/||'`) strips only the leading `origin/` prefix, turning that line into `HEAD -> origin/main`, which is not a real branch name. Because this string doesn't match `PROTECTED_PATTERN`, it survives the `grep -Ev` filter and is added to `remote_merged`. In live mode this would be passed to `git push origin --delete "HEAD -> origin/main"`, an invalid ref that would simply error out — but it must not be a candidate at all, since the script's entire purpose is safe, correct branch deletion.

**Required fix:** exclude any symbolic-ref line from the remote merged-branch list before (or as part of) the existing filter — i.e. drop any line matching `->` (for example `origin/HEAD -> origin/main`) so it can never reach the candidate list or a delete command. The same defensive filter should be applied to the local list too, for robustness, even though `git branch --merged` (without `-r`) does not currently emit symbolic-ref lines in normal use.

## 3. Other correctness observations (real, scoped to what's in the script)

3.1. **Local branch protection pattern is unanchored at the end.** `PROTECTED_PATTERN='^(main|release-please.*)'` has no `$` anchor after `main`, so a hypothetical branch literally named `main-something` or `maintenance` would also match `^main` and be treated as protected. This only makes protection *broader* (safer), never less safe, so it is not a deletion-safety bug — but it is a minor mismatch between intent ("protect the branch named main") and behaviour ("protect anything starting with main"). Worth a one-line tightening (`^(main|release-please.*)$`) while Sean is already touching this pattern, but is not required to satisfy this work's Definition of done.

3.2. **Header comment claims a protection that doesn't exist.** Line 4 says branches "with an open PR" are protected, but the script never queries PR state (no `gh` call, no such filter). Either the comment should be corrected to describe what the script actually does, or this is a real gap — a merged-into-main branch that still has an open PR (rare, but possible e.g. a PR left open after a squash-merge) would be deleted as if it had none. Given the brief's stated out-of-scope list explicitly excludes "adding new cleanup capabilities beyond what the script already does," the recommended resolution is to **correct the comment to match actual behaviour**, not add PR-checking logic. Flagging this so Sean/Sonja can make the deliberate choice rather than it being an oversight.

## 4. Acceptance criteria (testable)

- AC1: On a repo where `origin/HEAD -> origin/main` is present in `git branch -r`, running `bash scripts/cleanup-branches.sh --dry-run` does not print `HEAD -> origin/main`, `origin/HEAD -> origin/main`, or any line containing `->` under "=== REMOTE branches merged into main ===".
- AC2: On the same repo, `--dry-run` still correctly lists every genuinely-merged local branch except `main` and `release-please-*` branches, unchanged from current behaviour.
- AC3: On the same repo, `--dry-run` still correctly lists every genuinely-merged remote branch except `origin/main` and `origin/release-please-*` branches, unchanged from current behaviour.
- AC4: A live (non-dry-run) run on a repo containing the symbolic-ref line never invokes `git push origin --delete` with an argument containing `->` or equal to `HEAD -> origin/main`.
- AC5: The header comment accurately describes what the script protects (resolve the open-PR comment/behaviour mismatch noted in 3.2, by whichever means Sean and Sonja agree — correcting the comment is the recommended minimal fix).
- AC6: `scripts/cleanup-branches.sh` is committed to the repository (currently untracked).
- AC7: Carol confirms AC1–AC4 functionally, using a real or simulated branch set including a symbolic-ref line.
