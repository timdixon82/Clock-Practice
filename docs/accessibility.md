# Project Accessibility: Clock-Practice

This project meets WCAG 2.2 at AAA, interpreted in the global wiki's `accessibility.md`.

This page records only what is specific to Clock-Practice: its accessibility notes, and a pointer to its exceptions.

## Project-specific notes

An analogue clock is a visual instrument. Presenting it to a screen-reader user at AAA needs deliberate care: the time shown must be available as text, the hands and dial must have clear text alternatives, and any practice exercise must be fully operable from the keyboard.

## Baseline audit

Carol (tester agent) ran a baseline accessibility audit on 2026-05-21, against `index.html` as it stood at adoption of the project. It combined an automated Pa11y 9.1.1 pass (WCAG2AAA rule set, including notices and warnings) with a full manual source review against WCAG 2.2 AAA. It was explicitly a baseline of pre-existing work, not a sign-off.

**Overall conformance state at the time:** the page did not meet WCAG 2.2 AAA, and did not fully meet Level A, the minimum level. 16 findings were recorded: 1 Critical, 3 High, 7 Medium, 5 Low.

The most significant open findings from that audit:

- **Critical — clock face has no text alternative for the time shown.** The SVG clock's `aria-label` describes the widget but never states the time the hands display, so a screen-reader user cannot complete the exercise independently (WCAG 1.1.1).
- **High — clock label uses sight-dependent instruction ("Look at the two hands").** Violates 1.3.3 Sensory Characteristics; overlaps with the finding above.
- **High — stat box labels and values have no programmatic association** (1.3.1 Info and Relationships).
- **High — hour/minute `label` elements' `for` attributes point to a non-form `span`**, breaking the label/control association (1.3.1, 4.1.2).
- **Medium — no landmark structure** (no `<main>`, `<header>`, or `<nav>`), affecting bypass-blocks navigation (2.4.1).
- **Medium — dynamic stat counters update with no live region**, so changes are not announced (4.1.3).
- **Medium — feedback region mixes `role="status"` with `aria-live="assertive"`**, which is more interruptive than warranted for routine feedback (2.2.4, 4.1.3).
- **Medium — contrast and focus-appearance claims for text/focus rings on the gradient background were not independently confirmed** by the audit tooling and need manual verification (1.4.6, 2.4.13).
- Remaining Medium/Low findings covered emoji in accessible names, spinbutton `aria-valuetext`, page title specificity, a skip link, and the Web Share API result not being announced. Full detail is preserved in git history: `git show 4d1e020^:.claude/work/004-clock-practice-setup/carol-baseline-audit.md`.

Areas the audit found already passing: `lang="en-GB"`, `prefers-reduced-motion` handling, visible high-contrast focus rings, spinbutton keyboard support, `aria-hidden` on decorative confetti and celebration emoji, responsive layout, no session time limits, and no unexpected context changes.

These findings were out of scope for the work that produced them and are outstanding, pending a dedicated accessibility phase. None has yet been accepted as a permanent, formal exception — see `exceptions/` above for how a finding graduates into a recorded exception once Tim signs off on treating it as one.

## Exceptions

Documented accessibility exceptions for this project are in `exceptions/`. Every exception needs Tim's approval. None recorded yet.
