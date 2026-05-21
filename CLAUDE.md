# Clock Practice: Project Memory

This file is the project-specific memory for the Clock Practice project. It supplements the global team memory in the AgentTeam repository's `CLAUDE.md`. Every agent working on this project reads both files.

## Project identity

Clock Practice is a static, interactive single-page web application for practising reading the time on an analogue clock. It is hosted on GitHub Pages at `https://projects.timdixon.net/Clock-Practice/`. The repository is `timdixon82/Clock-Practice`.

## Stack

Static front-end: HTML, CSS, and JavaScript, running entirely in the browser. No server, no database, no build step. See `docs/decisions/002-no-build-step.md`.

Source files:

- `index.html` — page structure
- `styles.css` — all styles
- `clock-practice.js` — all behaviour
- `favicon.svg` — the clock favicon

## Architecture decisions

Key decisions are recorded in `docs/decisions/`. Read these before making structural changes.

- 001: Keep the single-file structure for the adoption work; split into three files as follow-up. (The split was completed in work 004.)
- 002: No build step. The repository source is the deployed site.
- 003: GitHub Pages hosting; Content-Security-Policy delivered via meta tag; security-header gaps documented in `docs/exceptions/SEC-001-missing-response-headers.md`.
- 004: Zero third-party runtime dependencies. Keep it that way unless a real need arrives.

## Security posture

The Content-Security-Policy meta tag in `index.html` is:

`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; base-uri 'self'; object-src 'none'; form-action 'none'`

Do not weaken this policy without a recorded decision and Jed's sign-off.

HTTPS is enforced on the GitHub Pages site. Do not change the "Enforce HTTPS" setting.

The missing response headers that GitHub Pages cannot provide are documented as accepted exceptions in `docs/exceptions/SEC-001-missing-response-headers.md`.

## Accessibility

The project targets WCAG 2.2 at AAA conformance. Carol's baseline audit is in `.claude/work/004-clock-practice-setup/carol-baseline-audit.md`. Outstanding accessibility findings are out of scope for work 004 and will be addressed in a dedicated accessibility phase.

## Branch and pull request conventions

- Branch names follow the conventional-commits prefix: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `a11y/`.
- Commits use the conventional commit format: `type(scope): description`.
- Pull requests use the template in `.github/pull_request_template.md`.
- Sean opens pull requests; Sonja merges only with Tim's express approval.

## Project wiki

The project wiki is in `docs/`. The index is at `docs/index.md`. The operations log is at `docs/log.md`.
