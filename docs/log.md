# Project Wiki: Operations Log: Clock-Practice

This log is chronological and append-only. It is never edited. Each entry starts with a heading in the form `## [YYYY-MM-DD] <operation> | <subject>`.

## [2026-05-21] ingest | Project wiki created

The project wiki for Clock-Practice was created from the team template, as part of work folder 004-clock-practice-setup. Clock-Practice is an existing repository being adopted as a team project: a static, accessible web page for practising telling the time on an analogue clock, built with HTML, CSS, and JavaScript and hosted on GitHub Pages.

## [2026-05-21] build | Setup build: file split, security fixes, and repository configuration

Work folder: 004-clock-practice-setup. Branch: chore/project-setup. Performed by Sean (developer).

### File split (build plan step 1)

The single `index.html` was split into three files per the static front-end stack standard and Decision Record 001:

- `styles.css` — extracted from the `<style>` block.
- `clock-practice.js` — extracted from the `<script>` block.
- `index.html` — rewritten to link both files. The `<link rel="stylesheet" href="styles.css">` and `<script src="clock-practice.js" defer>` tags replace the inline blocks.

No behaviour was changed. The split is a pure refactor.

### Security fixes from Jed's code review (build plan step 2)

All five findings from `docs/code-review.md` were addressed:

- Finding 2: Seven inline `onclick` attributes removed from `index.html`. Handlers wired in `clock-practice.js` via `addEventListener` in the `init()` function. The New Clock button was given the id `new-clock-btn` to allow the selector to work without an `onclick` attribute.
- Finding 1: Content Security Policy meta tag added to `index.html`: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; base-uri 'self'; object-src 'none'; form-action 'none'`. The `blob:` source is required because the share-image feature creates an object URL from a canvas blob before passing it to the Web Share API.
- Finding 3: The `innerHTML` assignment in the correct-answer feedback path replaced with DOM construction using `createElement` and `textContent`.
- Finding 4: `<meta name="referrer" content="strict-origin-when-cross-origin">` added to `index.html`.
- Finding 5: Both `alert()` calls in `fallbackShare()` replaced with announcements written to the `#feedback` live region.

Additionally, the emoji in the wrong-answer feedback text (`💪`) was removed from the `textContent` assignment. Because `feedback.textContent` is now used for the wrong-answer path, there is no way to wrap the emoji in `aria-hidden`. Removing the emoji is cleaner and is consistent with Carol's finding F-05.

The share text in `share()` also had its emoji removed (`🕐` and `🎉`) because the text is now passed to a live region as plain text in the fallback path. Screen readers would otherwise announce the emoji descriptions.

### Security exception (build plan step 4)

`docs/exceptions/SEC-001-missing-response-headers.md` created, carrying Gerrie's exception text from `docs/security-review.md`. Pending Tim's approval.

### Repository configuration (build plan step 5)

Added: `.editorconfig`, `.gitignore`, `.github/CODEOWNERS`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/accessibility.yml`, `.github/ISSUE_TEMPLATE/bug.yml`, `.github/ISSUE_TEMPLATE/feature.yml`, `.github/dependabot.yml`, `CLAUDE.md`.

### GitHub Actions workflows (build plan step 6)

The Write tool was blocked by the team safety hook for all five workflow files (`ci.yml`, `accessibility.yml`, `security.yml`, `codeql.yml`, `release.yml`) in `.github/workflows/`. The `.github/workflows/` directory is empty on this branch. This is reported to Sonja; a separate pass or a manual write outside the agent session is needed to create those files.

### README (build plan step 7)

`README.md` rewritten following the Periodic-Table pattern, without emoji, with descriptive link text and screen-reader-friendly structure.

### VERSION file (build plan step 8)

`VERSION` file created containing `0.1.0`.
