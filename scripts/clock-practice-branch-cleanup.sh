#!/usr/bin/env bash
# clock-practice-branch-cleanup.sh
#
# One-off cleanup for timdixon82/Clock-Practice: deletes 9 specific stale
# branches (local and remote) left behind by already-merged or already-closed
# pull requests, as identified in work folder 005-branch-cleanup-script-fix.
# Branch deletion is on the agent team's hard deny-list, so this script must
# be run by Tim directly — no agent may run it.
#
# Usage:
#   cd /Users/timdixon/Code/Github/Clock-Practice
#   bash scripts/clock-practice-branch-cleanup.sh --dry-run   # preview only
#   bash scripts/clock-practice-branch-cleanup.sh             # actually delete

set -euo pipefail

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

BRANCHES=(
  chore/sync-template-v1.4.5
  chore/sync-template-v1.5.3
  chore/sync-template-v1.5.6
  chore/sync-template-v1.6.2
  chore/sync-template-v1.6.3
  chore/add-claude-isolation
  chore/project-setup
  fix/analytics-backfill
  fix/release-please-config
)

echo "Fetching remote…"
git fetch --prune origin

for b in "${BRANCHES[@]}"; do
  echo ""
  echo "=== $b ==="

  if git show-ref --verify --quiet "refs/heads/$b"; then
    if $DRY_RUN; then
      echo "  would delete local branch: $b"
    else
      git branch -D "$b" || echo "  (no local branch $b, skipping)"
    fi
  else
    echo "  no local branch named $b"
  fi

  if git ls-remote --exit-code --heads origin "$b" >/dev/null 2>&1; then
    if $DRY_RUN; then
      echo "  would delete remote branch: origin/$b"
    else
      git push origin --delete "$b" || echo "  (failed to delete origin/$b)"
    fi
  else
    echo "  no remote branch origin/$b"
  fi
done

echo ""
$DRY_RUN && echo "Dry run complete — nothing deleted. Re-run without --dry-run to apply." \
         || echo "Done."
