#!/usr/bin/env bash
# cleanup-branches.sh
# Deletes local and remote branches that are fully merged into main.
# Protects: main and release-please-*.
#
# Usage (dry run first):   bash scripts/cleanup-branches.sh --dry-run
# Usage (live run):        bash scripts/cleanup-branches.sh

set -euo pipefail

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Bring remote refs up to date
echo "Fetching remote…"
git fetch --prune origin

PROTECTED_PATTERN='^(main|release-please.*)$'

echo ""
echo "=== LOCAL branches merged into main ==="
local_merged=$(git branch --merged main \
  | sed 's/^[* ]*//' \
  | grep -Ev '\->' \
  | grep -Ev "$PROTECTED_PATTERN" \
  || true)

if [[ -z "$local_merged" ]]; then
  echo "  (none)"
else
  echo "$local_merged"
  if ! $DRY_RUN; then
    echo ""
    echo "Deleting local branches…"
    echo "$local_merged" | xargs -r git branch -d
  fi
fi

echo ""
echo "=== REMOTE branches merged into main ==="
remote_merged=$(git branch -r --merged main \
  | grep -Ev '\->' \
  | sed 's|^ *origin/||' \
  | grep -Ev "$PROTECTED_PATTERN" \
  || true)

if [[ -z "$remote_merged" ]]; then
  echo "  (none)"
else
  echo "$remote_merged"
  if ! $DRY_RUN; then
    echo ""
    echo "Deleting remote branches…"
    echo "$remote_merged" | xargs -r -I{} git push origin --delete "{}"
  fi
fi

echo ""
$DRY_RUN && echo "Dry run complete — nothing deleted. Remove --dry-run to apply." \
         || echo "Done."
