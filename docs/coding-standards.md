# Project Coding Standards: Clock-Practice

This project follows the team's stack-independent standards in the global wiki's `coding-standards.md`, and the per-stack standards in the global wiki's `stacks/static-front-end.md`.

This page records only what is specific to Clock-Practice: its stack, and any project-specific coding decisions.

## Stack

A static front-end: HTML, CSS, and JavaScript that runs entirely in the browser, with no server. The project is hosted on GitHub Pages and served from the `main` branch.

## Project-specific notes

The architecture for this project is recorded as Architecture Decision Records in `decisions/`. The points below summarise what those records mean for day-to-day coding on Clock-Practice.

### File structure

Today the page is a single `index.html` that holds the HyperText Markup Language (HTML), the Cascading Style Sheets (CSS), and the JavaScript together. The team's stack standard asks for these three to be in separate files. Decision Record 001 keeps the single file for the adoption work and recommends a follow-up refactor that splits it into `index.html`, `styles.css`, and `clock-practice.js`. Until that refactor happens, a change to the page touches the one file; after it, match the change to the right file and keep the three concerns separate.

### No build step

There is no build step. The repository source is exactly what the browser receives. Do not add a bundler, a pre-processor, or a package manifest without revisiting Decision Record 002. See `decisions/002-no-build-step.md`.

### Security headers

GitHub Pages cannot send custom Hypertext Transfer Protocol (HTTP) response headers. The Content-Security-Policy is therefore delivered through a `<meta http-equiv="Content-Security-Policy">` tag in the `<head>` of `index.html`, placed first after `<meta charset>`. Test any change to that policy in a browser, because a policy that is too strict breaks the page silently. See `decisions/003-hosting-and-security-headers.md`.

### Dependencies

Clock-Practice has zero third-party runtime dependencies. Every script, style, and image is the project's own and is served from the project's own origin. The favicon is a first-party file. Do not add a script, stylesheet, or font from another origin without revisiting Decision Record 004; if one is ever added, pin it with Subresource Integrity and add its origin to the Content-Security-Policy. See `decisions/004-dependency-posture.md`.
