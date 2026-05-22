# Clock Practice

An interactive analogue clock practice page for learners who are developing the skill of reading the time. The page displays a clock face with randomly positioned hands, invites the learner to enter the time they see, checks their answer, and gives encouraging feedback. When the learner gets it right, they can share a personalised result image with a parent or carer.

## Live site

The page is published at [projects.timdixon.net/Clock-Practice/](https://projects.timdixon.net/Clock-Practice/).

## Features

- A randomly generated analogue clock face shown as an inline SVG (Scalable Vector Graphics) image, redrawn on each new clock.
- Hour and minute spinbutton controls. The learner enters their answer using plus and minus buttons or the keyboard arrow keys.
- Targeted hints for wrong answers: the page tells the learner which hand to check.
- Session statistics: tries on the current clock and total clocks solved in the session.
- A confetti celebration on a correct answer, suppressed when the operating system's reduce-motion preference is set.
- A share feature that generates a personalised 600 by 800 pixel result image and invites the learner to share it with Mum and Dad. The feature uses the Web Share API (Application Programming Interface) where available, with graceful fallback to image download and clipboard copy.
- Full keyboard support, including arrow-key operation of the spinbutton controls.
- Screen-reader support: accessible names on the clock and controls, live region feedback, and ARIA (Accessible Rich Internet Applications) spinbutton roles.
- Responsive layout from approximately 360 pixels wide upward.
- A Content Security Policy (CSP) delivered via a meta tag.

## Running it locally

The project has no build step. Serve the repository root with any static file server. The simplest option on most systems is Python 3:

```
python3 -m http.server 8080
```

Then open a browser and go to `http://localhost:8080`.

Alternatively, use the Node.js package `serve`:

```
npx serve .
```

## Accessibility

This project is built to WCAG 2.2 AAA. That is the highest of the three WCAG levels, and it satisfies the accessibility laws in scope: the United Kingdom Equality Act, the Public Sector Bodies Accessibility Regulations, the European Accessibility Act, the Americans with Disabilities Act, and Section 508.

The team tests with VoiceOver on macOS and JAWS on Windows. Every pull request must pass the automated accessibility checks (axe-core and Pa11y at WCAG 2.2 AAA) before it can be merged.

Known accessibility findings that are out of scope for the current phase are tracked in the [project wiki](docs/).

## Project wiki

The full project documentation is in the [docs/ folder](docs/), including architecture decision records, security and code review findings, requirements, and the glossary.

## Security

The project uses a Content Security Policy delivered via a meta tag, and a Referrer-Policy meta tag. Several security headers that require an HTTP (Hypertext Transfer Protocol) response header cannot be delivered on GitHub Pages. These gaps are recorded as an accepted exception in [docs/exceptions/SEC-001-missing-response-headers.md](docs/exceptions/SEC-001-missing-response-headers.md).

The page loads no external scripts, no external stylesheets, and no external fonts. All code and assets are served from the same origin.

## Licence

The project code is the work of Tim Dixon and is published under the licence in the `LICENSE` file.
