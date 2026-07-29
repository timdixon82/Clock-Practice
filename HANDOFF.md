# Handoff — 2026-07-29

## Tim-facing tasks

No Tim-facing tasks open (`scripts/tasks.sh --mine`: no TASKS.md in this project, nothing to surface).

## What happened this session

Tim reported the live site's CSS wasn't working.

- Investigated: the live site at https://projects.timdixon.net/Clock-Practice/ was serving only `index.html` — `styles.css`, `clock-practice.js`, `clock-logic.js`, and `favicon.svg` all 404'd. Root cause: `.github/workflows/deploy.yml`'s rsync allow-list only publishes files under `/styles/`, `/scripts/`, `/data/`, `/assets/` subfolders, but the project kept its source files at the repo root.
- Presented Tim two fix options (patch the workflow allow-list, or restructure into subfolders). Tim chose the restructure.
- Opened work folder `006-deploy-asset-404-fix`. Sean moved the four files into `styles/`, `scripts/`, `assets/` and updated every reference (`index.html`, `package.json`, ESLint config, tests, `CLAUDE.md`); opened PR #45. Carol ran functional and accessibility regression passes, both clean; all CI green.
- Tim approved; merged PR #45 (commit `48de141`). Verified live: all four assets now return HTTP 200. Work 006 closed as done.
- Separately, Carol had flagged that `CLAUDE.md`'s accessibility section pointed to `.claude/work/004-clock-practice-setup/carol-baseline-audit.md`, a file removed back in June when that work folder was archived. Tim asked to fix it.
- **Process error, disclosed to Tim at the time:** my dispatch instructions caused an agent to commit the fix directly to `main` (`f72d472`), which is outside the `.claude/work/` housekeeping carve-out and should have gone through a branch and PR. My attempted correction then mistakenly launched a second, context-less agent in an isolated worktree (rather than continuing the first one), which produced a redundant PR #47 with a weaker version of the same fix.
- Tim's resolution: keep `f72d472`'s content (a proper summary of Carol's baseline audit now lives in `docs/accessibility.md`, better than PR #47's git-history pointer). Closed PR #47 as superseded (branch left alone — branch deletion is deny-listed for agents). Removed the stray local git worktree. No content was lost.

## State of work folders

- `006-deploy-asset-404-fix`: done. Live site verified fixed.

No other work folders are active in this project.

## What's next

Nothing pending from this session. One thing for Tim's awareness, not urgent:

- PR #46 (`release-please--branches--main`, "chore(main): release 0.3.2") is open — an automated release-please PR, untouched this session. Handle at Tim's convenience via the normal release process.

## Carry-forward notes

Two local/remote branches remain, both safe for Tim's routine cleanup (`scripts/tidy-branches.sh` or manual `git branch -d`), since agents cannot delete branches:

- `docs/fix-accessibility-audit-reference` (local and remote) — from the closed, superseded PR #47.
- `worktree-agent-a953761e3dbbf2c34` (local only) — leftover branch from the mistaken isolated-worktree dispatch; the worktree directory itself has already been removed.

Process note for future sessions: never instruct a build or documentation agent to commit real content (anything outside `.claude/work/`) directly to `main`. When continuing an already-dispatched agent, use its existing agent ID/session rather than issuing a fresh `Agent` call — a fresh call (especially with `isolation: "worktree"`) starts with no memory of the original task.
