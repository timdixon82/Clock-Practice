# Architecture-and-Security Conformance Check: Clock-Practice setup build

Checked by: Sonja (orchestrator)
Date: 2026-05-22
Work folder: 004-clock-practice-setup
Branch: chore/project-setup, pull request 1, branch head 946c611

## Purpose

The architecture-and-security conformance check for the Clock-Practice setup build, before the merge gate. It confirms that pull request 1 conforms to the project's Architecture Decision Records and to the team's security standards.

## Architecture conformance

Clock-Practice pull request 1 adopts the repository to the team standard: the single-file `index.html` split into separate files, the team repository configuration, the continuous-integration workflows, and the pinned linter manifest added under Jacob's Option B.

- **ADR 001, file split.** The single `index.html` was split into `index.html`, `styles.css`, and `clock-practice.js`. Carol verified the split is behaviour-neutral. Conforms.
- **ADR 002, no build step.** No build step is added. The pinned linter manifest is development-only tooling and is not a build step; Jacob amended ADR 002 to record this. Conforms.
- **ADR 003, GitHub Pages security headers.** The Content-Security-Policy and Referrer-Policy are delivered by meta tags, with the security-header gap recorded as an exception. Conforms.
- **ADR 004, dependency posture.** Zero third-party runtime dependencies. Jacob amended ADR 004 to draw the runtime-versus-development line: the linters are development dependencies only and are never served to the browser. Conforms.
- **ADR 005, pinned linter manifest.** New record. The linters are pinned in a private `package.json` with a committed `package-lock.json`; continuous integration runs `npm ci`. Conforms.

## Security conformance

- Jed's backfill code review and his supply-chain review of the linter-manifest change both passed. The supply-chain review confirmed the pinned manifest improves posture over the previous unpinned `npx --yes` model, that the lockfile pins every dependency with integrity hashes, and that no dependency carries an install script.
- The continuous-integration and release workflows pin every action to a full commit SHA. The `ci.yml` permissions block is least privilege (`contents: read`).
- The deployed site has no third-party runtime dependency and no new input or network request.

## Verdict

Pass. Clock-Practice pull request 1 conforms to all five Architecture Decision Records and to the team's security standards. The architecture-and-security conformance check is satisfied for the merge gate.

## Note: release automation

Clock-Practice carries the same `release.yml` workflow as the other static projects. Like Periodic-Table, it needs the release-please manifest configuration (`release-please-config.json` and `.release-please-manifest.json`) and the repository setting "Allow GitHub Actions to create and approve pull requests". Until that follow-up is done, the Release workflow will fail on a push to `main`. This does not affect the merged, deployed site and does not block the setup-build merge. It is a tracked cross-cutting follow-up across all the static projects.
