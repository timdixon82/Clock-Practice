# Work Log: 004-clock-practice-setup

This log is chronological and append-only.

## [2026-05-21] setup | Work folder created

Tim asked to bring the Clock-Practice project up to the team's standard. Triaged as an adopt-and-backfill job, the same pattern as Periodic-Table.

## [2026-05-21] clone | Repository cloned

Cloned `timdixon82/Clock-Practice` to `Github/Clock-Practice`. Current state: a single `index.html` of about 22 kilobytes, a `favicon.svg`, a `LICENSE`, and a short `README.md`. GitHub Pages is enabled, and HTTPS enforcement was switched on.

## [2026-05-21] scaffold | Branch and project wiki created

Created the working branch `chore/project-setup` and the project wiki skeleton in `docs/`.

## [2026-05-21] dispatch | Backfill reviews dispatched

Dispatched Tad, Jacob, Gerrie, Jed, and Carol in parallel to backfill the business-analysis, architecture, and security reviews, and to baseline-audit the page against WCAG 2.2 AAA.
Note (2026-05-22, intake I1): Gerrie's work is now covered by Jed, the team's penetration tester, code reviewer, and security governance agent.

## [2026-05-21] consolidate | Backfill reviews found complete; setup resumes

Picking Clock-Practice back up at Tim's direction (decision 3A). A survey of the Clock-Practice repository shows the backfill reviews dispatched earlier all completed and wrote into the project wiki on the `chore/project-setup` branch: Tad's `docs/requirements.md`, Jacob's four Architecture Decision Records in `docs/decisions/`, Gerrie's `docs/security-review.md`, and Jed's `docs/code-review.md`. Carol's baseline WCAG 2.2 AAA audit is in this work folder. The next steps are Sonja's consolidation and the setup build by Sean. Jacob's ADR 001 flagged a decision for Tim: whether the single-file `index.html` should be split into separate HTML, CSS, and JavaScript files as part of the setup. That decision has been put to Tim.

## [2026-05-21] decision | File split approved; setup build dispatched

Tim answered decision 1A: the Clock-Practice `index.html` is to be split into separate HTML, CSS, and JavaScript files as part of the setup build. The `.claude/work/.current` marker was switched to `004-clock-practice-setup` so the safety hook pre-approves Sean's branch, commit, and push actions for this work folder.

Dispatched Sean in the background to carry out the Clock-Practice setup build on the `chore/project-setup` branch: split the single file, self-host any external fonts, add the Content-Security-Policy and Referrer-Policy meta tags, apply Jed's code-review fixes, record any security-header exceptions, add the team's repository configuration and workflows, write the README, set the `VERSION` file to 0.1.0, and open the pull request. Carol's baseline accessibility findings are out of scope for this setup build; a Clock-Practice accessibility phase follows later, the same two-phase shape as Periodic-Table.
- [2026-05-21 20:24:01] subagent completed

## [2026-05-21] note | Clock-Practice build blocked on write permissions; settings fixed, Sean re-dispatched

Sean's first Clock-Practice build pass was blocked: the session's permission settings did not grant the Write tool access to the `Github/Clock-Practice` path, and a subagent cannot clear the resulting permission prompt. This is the same class of issue as the earlier subagent denials; it is not the team safety hook, which gates only Bash and GitHub Model Context Protocol tools. Sean read all the backfill documents and produced a complete twelve-step build plan before stopping.

Sonja added scoped `Write` and `Edit` permissions for the three team-project repository paths, Clock-Practice, Periodic-Table, and LLBS, to `.claude/settings.local.json`, the machine-local settings, mirroring how development access was granted for Periodic-Table. The hard deny-list is unchanged. Sean was re-dispatched in the background to execute his build plan. If the permission change does not take effect without a Claude Code restart, Sean will report still-blocked and Tim will be asked to restart.
- [2026-05-21 20:33:32] subagent completed
- [2026-05-21 20:35:09] subagent completed

## [2026-05-21] note | Clock-Practice setup files written; commit, push, and workflows blocked

Sean's Clock-Practice retry succeeded in writing every setup file: the file split (`styles.css`, `clock-practice.js`, rewritten `index.html`), Jed's five code-review fixes, the security-exception record, the `.github` configuration (CODEOWNERS, pull request template, issue templates, dependabot), the project `CLAUDE.md`, `.editorconfig`, `.gitignore`, `README.md`, `VERSION` (0.1.0), and the project-wiki log entry. The earlier `Write` and `Edit` permission fix took effect; file writes worked. Every file is on the `chore/project-setup` branch working tree; nothing is lost.

Two things were blocked. The five `.github/workflows/` files could not be written: Claude Code blocks workflow-file writes by an agent, and a subagent cannot clear that prompt. And the final commit, push, and pull request were blocked: the git commands were denied for the subagent. Sonja put two decisions to Tim: whether Sonja finishes Clock-Practice from the main-agent side, and the standing approach for creating workflow files. The Phase 2 Sean carries instructions to report the exact git denial, which will pinpoint the cause for the subagent git block.
- [2026-05-21 20:44:47] subagent completed
- [2026-05-21 21:00:05] subagent completed

## [2026-05-21] merge-prep | Clock-Practice setup finished by Sonja; pull request 1 opened

Per decision 1A, Sonja finished the Clock-Practice setup build from the main-agent side. The three project-agnostic workflows (security, CodeQL, release) were copied from Periodic-Table; the linter configuration files and the accessibility workflow were copied across; Sonja wrote `ci.yml`, adapted for Clock-Practice's no-package-manifest setup with the linters run through `npx`, and `pa11y.json` for the Chromium no-sandbox argument. Everything Sean wrote plus these files was committed as `61dd200` and pushed, and pull request 1 was opened on the Clock-Practice repository: `https://github.com/timdixon82/Clock-Practice/pull/1`.

Decision 2A is in effect: from now on Sonja creates `.github/workflows/` files as the main agent, since a subagent cannot clear Claude Code's workflow-file write prompt. This is recorded for the wiki upkeep. Next on Clock-Practice: Carol verifies the setup, Neil produces the release checklist, Sonja runs the conformance check and the merge gate. Accessibility remediation remains a later Clock-Practice phase.
Note (2026-05-22, intake I1): Neil's work is now covered by Carol, the team's tester and release manager.
- [2026-05-21 21:12:59] subagent completed
- [2026-05-21 21:18:05] subagent completed
- [2026-05-21 21:18:12] subagent completed
- [2026-05-21 21:18:25] subagent completed
- [2026-05-21 21:18:32] subagent completed
- [2026-05-21 21:18:43] subagent completed
- [2026-05-21 21:19:11] subagent completed
- [2026-05-21 21:19:47] subagent completed
- [2026-05-21 21:20:20] subagent completed
- [2026-05-21 21:20:34] subagent completed
- [2026-05-21 21:21:33] subagent completed
- [2026-05-21 21:23:10] subagent completed
- [2026-05-21 21:23:13] subagent completed
- [2026-05-21 21:26:16] subagent completed
- [2026-05-21 21:31:33] subagent completed
- [2026-05-21 21:36:00] subagent completed
- [2026-05-21 21:39:43] subagent completed
- [2026-05-21 21:49:00] subagent completed
- [2026-05-21 22:13:03] subagent completed

## [2026-05-21] dispatch | Carol dispatched to verify the Clock-Practice setup

Clock-Practice pull request 1, the setup build, had been open and waiting since Sonja opened it; the project stalled there while Sonja focused on Periodic-Table Phase 2 and the new-project backfills. Sonja has now dispatched Carol to verify the Clock-Practice setup: that the file split is behaviour-neutral, the security meta tags and code-review fixes are correct, and the team configuration is in place. The baseline accessibility findings are out of scope for the setup phase. Next: Neil's release checklist, Sonja's conformance check, and the merge gate.
Note (2026-05-22, intake I1): Neil's work is now covered by Carol, the team's tester and release manager.
- [2026-05-21 22:17:24] subagent completed
- [2026-05-21 22:18:44] subagent completed

## [2026-05-21] note | Clock-Practice setup verified, one defect; eslint config fix dispatched

Carol verified the Clock-Practice setup build (pull request 1). It passed on every point: the behaviour-neutral file split, Jed's five code-review fixes, the security meta tags, and all team configuration files. One defect, D-01: the `eslint.config.js` Sonja copied from Periodic-Table when finishing the setup was not adapted. Its `files` glob `js/**/*.js` does not match Clock-Practice's root-level `clock-practice.js`, so the continuous-integration JavaScript lint step passes with no rule coverage, and the config carries Periodic-Table cruft. This was Sonja's copy-paste error when completing the setup under decision 1A.

Sonja dispatched Sean to rewrite `eslint.config.js` correctly for Clock-Practice: edits only, Sonja commits. The corrected config then returns to Carol for re-verification, after which Neil produces the release checklist and Sonja runs the conformance check.
Note (2026-05-22, intake I1): Neil's work is now covered by Carol, the team's tester and release manager.

## [2026-05-21] note | D-01 fix committed; Carol dispatched for re-verification

Sean rewrote `eslint.config.js`: the `files` glob now matches the root-level `clock-practice.js`, the browser globals the file uses are declared explicitly (document, window, navigator, console, setTimeout, Promise, Math, URL, Blob, Image, XMLSerializer, File), and the Periodic-Table cruft and dead import are removed. Sonja committed it as `6c14b18` and pushed to `chore/project-setup`. Dispatched Carol for a focused re-verification of D-01; on a clean result the Clock-Practice setup is fully verified and Neil produces the release checklist.
Note (2026-05-22, intake I1): Neil's work is now covered by Carol, the team's tester and release manager.
- [2026-05-21 22:21:30] subagent completed
- [2026-05-21 22:22:54] subagent completed
- [2026-05-21 23:04:35] subagent completed
- [2026-05-21 23:04:54] subagent completed

## [2026-05-21] note | Rate limit, then Clock-Practice setup fully verified; Neil dispatched

The team hit the Claude Max session rate limit; Carol's D-01 re-verification was cut off before it reported. After the limit reset, Sonja re-dispatched Carol. Carol's re-verification: D-01 is resolved. The `eslint.config.js` `files` glob now matches `clock-practice.js`, the declared browser globals exactly cover the file's usage, and the Periodic-Table cruft is gone. With D-01 closed and all other setup points already verified (the behaviour-neutral file split, Jed's five code-review fixes, the security meta tags, the team configuration), Carol gave the full Clock-Practice setup verification sign-off.

Dispatched Neil to produce the Clock-Practice release checklist. Sonja then runs the architecture-and-security conformance check, toward the merge gate.
Note (2026-05-22, intake I1): Neil's work is now covered by Carol, the team's tester and release manager.
- [2026-05-21 23:06:53] subagent completed
- [2026-05-21 23:08:57] subagent completed
- [2026-05-21 23:14:53] subagent completed
- [2026-05-21 23:28:42] subagent completed
- [2026-05-21 23:41:30] subagent completed
- [2026-05-21 23:50:36] subagent completed
- [2026-05-21 23:53:05] subagent completed
- [2026-05-22 16:29:59] subagent completed
- [2026-05-22 16:44:50] subagent completed
- [2026-05-22 16:45:32] subagent completed
- [2026-05-22 16:51:27] subagent completed
- [2026-05-22 17:01:22] subagent completed
- [2026-05-22 17:20:42] subagent completed
- [2026-05-22 18:08:02] subagent completed
- [2026-05-22 18:09:30] subagent completed
- [2026-05-22 18:12:31] subagent completed
- [2026-05-22 18:44:31] subagent completed
- [2026-05-22 18:45:45] subagent completed
- [2026-05-22 18:48:35] subagent completed
- [2026-05-22 18:54:01] subagent completed
- [2026-05-22 19:03:44] subagent completed
- [2026-05-22 19:09:09] subagent completed
- [2026-05-22 19:22:43] subagent completed
- [2026-05-22 19:26:39] subagent completed
- [2026-05-22 19:26:47] subagent completed
- [2026-05-22 19:36:02] subagent completed
- [2026-05-22 19:44:27] subagent completed

## [2026-05-22] note | Clock-Practice Option B started; Sean implemented the manifest; Jacob resolving a discrepancy

Picked Clock-Practice back up at Tim's direction, to fix the continuous-integration CSS-lint blocker: stylelint cannot resolve the shared config `stylelint-config-standard` under `npx --yes`. Tim had approved Jacob's Option B (Q7A to Q10A): give Clock-Practice a pinned linter manifest like Periodic-Table's.

Sonja dispatched Sean, who created `package.json` at the Clock-Practice root: `"private": true`, no runtime dependencies, `devDependencies` of `eslint`, `html-validate`, `stylelint`, and `stylelint-config-standard`, pinned to Periodic-Table's versions, with mirrored lint scripts. `node_modules/` was already in `.gitignore`. Sean removed the obsolete comment in `eslint.config.js`.

Sean flagged a factual error in Jacob's recommendation: it said restoring the `globals` npm package would make the eslint setup match Periodic-Table, but Periodic-Table does not use the `globals` package; it has a hand-written globals object and an unused `eslint/use-at-your-own-risk` import. Sonja dispatched Jacob to resolve the discrepancy, whether Clock-Practice should adopt the `globals` package and whether Periodic-Table should be brought into line, and to complete the decision-record updates his recommendation called for: amend Clock-Practice Decision Records 002 and 004 and add a new record for the linter manifest.

Held until Jacob reports, because the `package.json` content may change: Sonja then generates `package-lock.json`, edits `.github/workflows/ci.yml` (add an `npm ci` step, change `npx --yes` to `npx`, add `cache: npm`), commits, and pushes. Then Jed reviews the supply-chain change, Carol re-tests, and the CSS lint runs to completion for the first time.

## [2026-05-22] note | Option B committed; CSS lint surfaced 18 real findings; Sean dispatched

Jacob resolved the `globals` question: Clock-Practice adopts the `globals` npm package, the modern ESLint flat-config approach; Periodic-Table is the divergent one, and its dead `eslint/use-at-your-own-risk` import is a separate small follow-up. Jacob applied the `globals` change and amended Clock-Practice Decision Records 002 and 004 and added Decision Record 005, the pinned linter manifest.

Sonja generated `package-lock.json` with `npm install` (198 packages, no vulnerabilities), edited `.github/workflows/ci.yml` (added `cache: npm` and an `npm ci` step, changed `npx --yes` to `npx`, updated the header comment), and committed and pushed everything as `8f5026c`.

Continuous integration then ran the CSS lint to completion for the first time. As Jacob predicted, it surfaced 18 real `stylelint-config-standard` findings in `styles.css`: multiple-declaration single lines, `rgba` and color-function notation, two `no-descending-specificity` selector-order findings, two `media-feature-range-notation` findings, and one `rule-empty-line-before`. The other six checks pass. Sonja dispatched Sean to fix all 18, behaviour-neutral, file edits only. On a clean lint result, Jed reviews the supply-chain change, Carol tests, then the merge gate.

## [2026-05-22] note | CSS lint fixed and signed off; conformance check passed; merge gate ready

Sean fixed the 18 stylelint findings (commit `d524c66`), all behaviour-neutral. The CSS lint then surfaced two further `rule-empty-line-before` findings exposed by the line-splitting; Sonja added the two empty lines directly (commit `946c611`). All seven continuous-integration checks now pass on pull request 1.

Jed reviewed the supply-chain change: verdict PASS, no findings. The pinned manifest and lockfile improve supply-chain posture over the previous unpinned `npx --yes` model. Carol re-tested commit `946c611`: verdict PASS. The 20 CSS fixes are confirmed behaviour-neutral, the `globals` package gives equal or wider eslint coverage, and there is no regression against the earlier setup sign-off.

Sonja ran the architecture-and-security conformance check: pass, recorded in `sonja-conformance-check.md`. Clock-Practice pull request 1 conforms to all five Architecture Decision Records and the team security standards.

Merge gate for pull request 1: all seven checks green; Carol's setup verification and Option B re-test both signed off; the conformance check passed. The gate is satisfied. Sonja is presenting pull request 1 to Tim for his express merge approval. One note carried to Tim: like Periodic-Table, Clock-Practice's `release.yml` needs the release-please configuration; until that cross-cutting follow-up is done, the Release workflow will fail on the merge to `main`. This does not affect the deployed site and does not block the setup-build merge.

## [2026-05-22] merge | Setup build merged; release-please configured; Release workflow green

Tim gave express approval and Sonja squash-merged pull request 1, the setup build, to `main` as commit `b5402e0`. As expected, the Release workflow then failed on `main`, because Clock-Practice did not yet have the release-please configuration.

Tim asked for that failure to be fixed and the fix applied across all projects. Sonja applied the same fix as Periodic-Table on a branch `fix/release-please-config`: `release-please-config.json` and `.release-please-manifest.json` (the manifest seeded at `0.1.0` to match the `VERSION` file), and the `config-file` and `manifest-file` inputs added to `release.yml`. Sonja also enabled the repository setting "Allow GitHub Actions to create and approve pull requests". Pull request 4 was opened, all seven checks passed, Tim gave express approval, and Sonja squash-merged it as `afe5b0b`.

The Release workflow then ran on `main` and completed successfully. Clock-Practice's setup build and its release automation are both complete. The cross-cutting part of Tim's request is met by building the release-please configuration into the standard project setup. Clock-Practice's accessibility remediation remains a separate later phase.
- [2026-05-22 19:47:33] subagent completed
- [2026-05-22 19:48:24] subagent completed
- [2026-05-22 19:51:44] subagent completed
- [2026-05-22 20:01:42] subagent completed
- [2026-05-22 20:12:37] subagent completed
- [2026-05-22 20:23:12] subagent completed
- [2026-05-22 20:25:03] subagent completed
- [2026-05-22 20:25:54] subagent completed
- [2026-05-22 20:32:35] subagent completed
- [2026-05-22 20:38:37] subagent completed
- [2026-05-22 21:00:41] subagent completed
- [2026-05-22 21:01:31] subagent completed
- [2026-05-22 21:02:58] subagent completed
- [2026-05-22 21:03:25] subagent completed
- [2026-05-22 21:07:28] subagent completed
- [2026-05-22 21:13:18] subagent completed
- [2026-05-22 21:17:55] subagent completed
- [2026-05-22 21:30:55] subagent completed
- [2026-05-22 21:38:56] subagent completed
- [2026-05-22 21:57:38] subagent completed
- [2026-05-22 22:00:35] subagent completed
- [2026-05-22 22:51:22] subagent completed
- [2026-05-22 22:52:18] subagent completed
- [2026-05-22 22:55:35] subagent completed
- [2026-05-22 23:01:41] subagent completed
- [2026-05-22 23:10:24] subagent completed
- [2026-05-22 23:11:15] subagent completed
- [2026-05-22 23:21:40] subagent completed
- [2026-05-22 23:40:38] subagent completed
- [2026-05-22 23:40:51] subagent completed
- [2026-05-23 00:27:57] subagent completed
- [2026-05-23 00:29:03] subagent completed
- [2026-05-23 00:29:37] subagent completed
- [2026-05-23 00:34:45] subagent completed
- [2026-05-23 00:36:47] subagent completed
- [2026-05-23 00:45:24] subagent completed
- [2026-05-23 00:47:16] subagent completed
- [2026-05-23 00:47:33] subagent completed
- [2026-05-23 00:48:33] subagent completed
- [2026-05-23 00:57:44] subagent completed
- [2026-05-23 01:00:36] subagent completed
- [2026-05-23 01:04:38] subagent completed
- [2026-05-23 01:05:12] subagent completed
- [2026-05-23 01:09:04] subagent completed
- [2026-05-23 01:10:31] subagent completed
- [2026-05-23 01:11:52] subagent completed
- [2026-05-23 01:18:03] subagent completed
- [2026-05-23 01:19:29] subagent completed
- [2026-05-23 01:27:13] subagent completed
- [2026-05-23 01:27:17] subagent completed
- [2026-05-23 01:27:19] subagent completed
- [2026-05-23 01:28:59] subagent completed
- [2026-05-23 01:29:31] subagent completed
