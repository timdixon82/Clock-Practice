# Log: 006-deploy-asset-404-fix

- 2026-07-29 Sonja: Tim reported the live site's CSS wasn't working. Investigated: all of `styles.css`, `clock-practice.js`, `clock-logic.js`, `favicon.svg` return 404 on the live site; only `index.html` deploys. Root cause: `.github/workflows/deploy.yml`'s rsync allow-list only publishes `/styles/`, `/scripts/`, `/data/`, `/assets/` subfolders, but this project's source files live at the repo root. Presented Tim two options: (A) patch the workflow allow-list for root-level files, (B) restructure into the standard subfolder layout. Tim chose B. Work folder opened, brief written, dispatching Sean next.
- [2026-07-29 17:36:31] subagent completed
- [2026-07-29 17:37:02] subagent completed
- [2026-07-29 17:37:34] subagent completed
- [2026-07-29 17:38:05] subagent completed
- [2026-07-29 17:38:36] subagent completed
- 2026-07-29 Sonja: Sean opened PR #45 (fix/deploy-asset-layout) moving files into styles/, scripts/, assets/ to match the deploy workflow's allow-list; index.html, package.json, eslint config, tests, and CLAUDE.md updated; lint and tests pass locally; verified in-browser with zero console errors. Dispatched Carol for functional and accessibility regression testing.
- 2026-07-29 Carol: PASS. Functional and accessibility regression checks both clean; npm test 33/33, npm run lint clean; PR CI green (build, lint, Playwright, Pa11y/axe AAA, dependency-review, semgrep, trivy). No issues found. Only remaining DoD item is the post-merge live-site 200 check, correctly deferred until after merge. PR comment posted. Ready for Sonja to bring to Tim for merge approval. Note: baseline audit file referenced in the brief (.claude/work/004-clock-practice-setup/carol-baseline-audit.md) does not exist in the repo; flagged, not a blocker.
- 2026-07-29 Sonja: process note — the shared local clone was used concurrently by Sean, Carol, and this orchestration session, causing a branch-switch collision on log.md mid-run. No content was lost (each agent's branch state resolved cleanly), but future parallel dispatches on this project should avoid overlapping direct commits to the same clone while a build/test agent is active in it.
