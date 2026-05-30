# Release Checklist: Clock-Practice Setup

Work folder: 004-clock-practice-setup
Project: Clock-Practice
Branch: chore/project-setup
Date: 2026-05-21
Release manager: Neil

## Checks

### Continuous integration passed

- [ ] Lint, type-check, tests, and build completed without errors.

Status: **BLOCKED. Lint failure in progress.** Pull request 1 is open on the Clock-Practice repository. The continuous integration workflow ran, but the lint check failed with 9 errors in index.html:

**HTML validation errors (html-validate):**
- Line 44: `<label>` "for" attribute references "hour-display" which is a `<span role="spinbutton">`, not a labelable form control. Valid-for rule violation.
- Line 46: `<button>` missing recommended "type" attribute. (no-implicit-button-type)
- Line 50: `<button>` missing recommended "type" attribute. (no-implicit-button-type)
- Line 57: `<label>` "for" attribute references "minute-display" which is a `<span role="spinbutton">`, not a labelable form control. Valid-for rule violation.
- Line 59: `<button>` missing recommended "type" attribute. (no-implicit-button-type)
- Line 63: `<button>` missing recommended "type" attribute. (no-implicit-button-type)
- Line 68: `<button>` missing recommended "type" attribute. (no-implicit-button-type)
- Line 73: `<button>` missing recommended "type" attribute. (no-implicit-button-type)
- Line 74: `<button>` missing recommended "type" attribute. (no-implicit-button-type)

These are real defects in the HTML structure that must be fixed before the release can proceed. The fixes required:

1. Remove the `for` attributes from the `<label>` elements on lines 44 and 57, since they reference span elements, not true form controls.
2. Add `type="button"` to all `<button>` elements (lines 46, 50, 59, 63, 68, 73, 74).

Once these fixes are committed and pushed to `chore/project-setup`, the lint check should pass.

### Accessibility checks passed

- [x] Pa11y at WCAG 2.2 AAA reports findings; baseline findings are documented and accepted.

Status: **Complete.** The GitHub accessibility workflow runs on every pull request and reports findings. The pa11y check passed (43s). Clock-Practice Phase 1 is a structural and security setup phase, not an accessibility release. Tim has approved (decision from work log) that Phase 1 ships with baseline accessibility findings that are scheduled for a later Clock-Practice accessibility phase. This mirrors Periodic-Table's two-phase approach: Phase 1 is setup; the accessibility remediation phase follows.

Carol's baseline accessibility audit has been completed and recorded in the project wiki. Phase 1 introduces no new accessibility regressions relative to the baseline.

### Security checks passed

- [x] Semgrep, Trivy, dependency review, and CodeQL have passed.

Status: **Complete.** Pull request 1 has been opened and the security workflows have executed successfully. All checks pass: Semgrep (code patterns), Trivy (dependency vulnerabilities), dependency-review (licence and security review), and CodeQL (code scanning) all complete without blocking findings.

### Carol has signed off functional, accessibility, and visual testing

- [x] Carol has completed verification of Phase 1 functional, accessibility, and visual scope.

Status: **Complete.** Carol's Phase 1 verification (completed 2026-05-21) confirms:

- All source files (index.html, styles.css, clock-practice.js, and project documentation) were read in full and analyzed by code inspection.
- The file split from the original single `index.html` into separate HTML, CSS, and JavaScript files is functionally and visually behaviour-neutral: no functional change introduced, no appearance change introduced.
- Security meta tags (Content-Security-Policy and Referrer-Policy) are correctly placed and scoped.
- All Jed's five code-review fixes are correctly implemented.
- The team configuration (GitHub Actions workflows, CODEOWNERS, pull request template, issue templates, `.github/dependabot.yml`) is complete and correct.
- The ESLint configuration (`eslint.config.js`) is correctly adapted to Clock-Practice: the `files` glob matches the root-level `clock-practice.js`, browser globals are declared explicitly, and Periodic-Table cruft is removed. Defect D-01 is closed.
- Phase 1 introduces no accessibility regression relative to the baseline audit.

Carol's verdict: "Phase 1 is fit to merge, with baseline accessibility findings recorded as known and carried into the later Clock-Practice accessibility phase."

Note: Carol's sign-off was based on visual code inspection before the HTML lint validation errors became visible in the CI run. The lint errors are structural and do not affect Carol's functional and visual testing sign-off, but they must be fixed before merge.

### Architecture-and-security conformance check is done

- [ ] Sonja has performed the architecture-and-security conformance gate.

Status: **Outstanding; awaiting Sonja's gate after lint is fixed.** The architecture-and-security conformance check is a separate gate before merge, performed by Sonja. This check is outstanding and required before the merge gate. It will proceed once the lint defects are fixed.

### Version number is set and follows semantic versioning

- [x] Version number is set in the project.

Status: **Complete.** The version is 0.1.0 (pre-release setup version) and a `VERSION` file is committed to the branch (commit `6c14b18`).

### Changelog is written or deferred to automation

- [x] Changelog approach is decided.

Status: **Complete.** The changelog is generated by release-please at release time, not pre-written. The branch follows conventional commit format (refactor, feat, chore, docs), so release-please will generate the changelog automatically on release. No CHANGELOG.md pre-commit is required.

### Work folder's GitHub-actions log is complete

- [x] The GitHub-actions log is up to date and documents all tool invocations.

Status: **Complete.** The work folder's log.md documents every major action taken during Clock-Practice setup and through pull request 1.

### Security-header exception record is complete

- [x] Security exceptions are documented if any were introduced.

Status: **Complete.** No security exceptions or deviations from the team's security standards were introduced during Phase 1. All security meta tags and code-review fixes are in conformance. Any security findings from the automated scans are documented in the pull request.

## Accessibility Debt

- [x] Baseline accessibility findings are documented and scheduled for later Phase.

Status: **Approved.** Carol's baseline accessibility audit has identified findings scheduled for a later Clock-Practice accessibility phase. This is the intended approach, mirroring Periodic-Table's structure.

## Tim's Screen-Reader Test

- [ ] Tim has tested the release himself with his screen reader and has approved it for merge.

Status: **Outstanding, deferred to later phase.** Tim may defer his screen-reader test to the later Clock-Practice accessibility phase, the same choice as for Periodic-Table Phase 1. If Tim chooses to perform a screen-reader test now, it should cover:

- Page loading and title announcement
- Button and interactive element navigation
- Clock display and interaction
- Time input functionality
- Screen reader navigation by landmark and by heading

## Verdict

**Status: BLOCKED ON LINT DEFECTS. Release cannot proceed.**

### What is complete

1. Security checks pass: Semgrep, Trivy, dependency-review, and CodeQL all pass without blocking findings.
2. Accessibility checks pass: Pa11y runs without blocking findings.
3. Carol has signed off functional, accessibility, and visual testing: Phase 1 is behaviour-neutral and fully verified.
4. Defect D-01 (ESLint configuration) is resolved and re-verified by Carol.
5. Version number is set: 0.1.0 (commit 6c14b18).
6. Changelog approach is decided: generated by release-please at release time.
7. Pull request 1 is open on the Clock-Practice repository.
8. The work folder's log is complete.
9. The project wiki has been created with requirements, decisions, and reviews.
10. All source code changes are committed and pushed to the chore/project-setup branch.
11. Security-header exceptions are documented (none required).

### Blockers before merge

1. **Lint failures in index.html (CRITICAL):** 9 HTML validation errors must be fixed:
   - Remove `for` attributes from `<label>` elements on lines 44 and 57 (they reference spans, not form controls).
   - Add `type="button"` to all `<button>` elements (lines 46, 50, 59, 63, 68, 73, 74).

2. **Sonja's architecture-and-security conformance gate** — Sonja must perform the architecture-and-security conformance check before proceeding to the merge gate. (Deferred until lint is fixed.)

3. **Tim's screen-reader test (optional)** — Tim may choose to defer this to the later Clock-Practice accessibility phase, or may test now and approve for merge.

### Actions required

The lint defects must be fixed immediately:

1. Dispatch an agent (likely Sean) to fix the HTML validation errors in index.html.
2. Commit the fixes to the `chore/project-setup` branch.
3. Verify the lint check passes.
4. Complete Carol's re-verification if needed (likely a formality, given the structural nature of the fixes).
5. Re-run this release checklist.
6. Proceed to Sonja's architecture-and-security conformance gate.

---

Neil, release manager

Work folder: /Users/timdixon/Library/Mobile Documents/com~apple~CloudDocs/AgentTeam/.claude/work/004-clock-practice-setup

Clock-Practice repository: /Users/timdixon/Library/Mobile Documents/com~apple~CloudDocs/Github/Clock-Practice

Branch: chore/project-setup

Date of checklist: 2026-05-21
