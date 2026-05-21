# Decision Record 001: Keep the single-file structure for now

## Status

Proposed. Recorded by Jacob (architect) on 2026-05-21, during work 004-clock-practice-setup. Awaiting Tim's decision on the question raised at the end of this record.

## Context

Clock-Practice is an existing repository being adopted as a team project. The whole page is one `index.html` of about 22 kilobytes. That single file holds three things at once:

- Structure: the HyperText Markup Language (HTML) for the clock, the controls, and the statistics.
- Presentation: a `<style>` block of about 290 lines of Cascading Style Sheets (CSS).
- Behaviour: a `<script>` block of about 350 lines of JavaScript.

The team's static front-end stack standard, in the global wiki's `stacks/static-front-end.md`, says under "Project structure": "Keep structure (HTML), presentation (CSS), and behaviour (JavaScript) separate." Read plainly, that asks for three files: `index.html`, a stylesheet, and a script.

The current single-file layout does not meet that standard. This record decides what to do about the gap.

## Decision

Keep the single-file structure for the project-adoption work (work 004), and do not split the file as part of that work.

Two reasons:

1. The adoption work is a backfill of reviews and repository configuration. It is not a feature change. Splitting the file is a refactor that changes every line's location, which would make the security review and the code review harder to trace against the original code. The team should review the project as it stands first.
2. The split is a one-way refactor with real value, but it is a separate, deliberate piece of work. It should be scoped, branched, and reviewed on its own, not folded into an adoption housekeeping task.

The split should still happen. This record recommends it as the next piece of work after adoption, and Decision Record 002 (the no-build-step decision) and Decision Record 003 (the hosting and headers decision) both assume the split will follow.

## Alternatives considered

### Split the file now, as part of the adoption work

Rejected for this work. The split is sound and should be done, but doing it inside the adoption work mixes a refactor with a review-and-configure task. It would obscure the audit trail: the security and code reviews could no longer be read against the file the team actually adopted. Better to review first, then split as named follow-up work.

### Leave the file as one file permanently

Rejected. A 22-kilobyte single file is workable today, but the standard exists for good reasons that apply here:

- A separate stylesheet and script can be cached by the browser across visits.
- Separate files give cleaner change history: a CSS-only change does not appear in the same diff as a behaviour change.
- A separate `.css` file and `.js` file can be linted by the standard tools without the lint step having to extract them from HTML first. The stack standard requires lint checks in continuous integration.
- The Content-Security-Policy this project will adopt (see Decision Record 003) is stricter and simpler when the script is an external file, because the policy can then forbid inline script entirely.

Leaving the file as one file permanently would mean carrying a known standards exception forever, which is worse than doing the refactor once.

### Split into many small feature files

Rejected as too much for a page this size. The stack standard says "source organised by feature", but Clock-Practice is one screen with one feature: practise reading a clock. Three files (`index.html`, `styles.css`, `clock-practice.js`) match the page. Splitting the JavaScript further into a clock-drawing module, an input module, and a share module is possible, but it is more structure than a 350-line script needs today. The team's own principle "prefer the simple solution" applies. If the script grows, revisit it then.

## Consequences

- For work 004, the project carries one known, recorded gap against the stack standard: structure, presentation, and behaviour are not in separate files. This record is the documentation of that gap. Gerrie and Jed should review the single file as it stands and not treat the layout itself as a defect to fix inside this work.
- A follow-up piece of work should split `index.html` into three files: `index.html`, `styles.css`, and `clock-practice.js`. File names in kebab-case, per the naming standard. That work is a `refactor` change and must not alter behaviour.
- The split is a precondition for the stricter Content-Security-Policy in Decision Record 003. Until the split happens, the page needs `'unsafe-inline'` for both script and style, which weakens the policy. Decision Record 003 records that interim state.
- The colour-contrast comment block at the top of the current `<style>` block is valuable design documentation. When the CSS moves to its own file, that comment must move with it, not be dropped.

## Question for Tim

The split into three files is recommended follow-up work, but it is not free, and it is the kind of change that can introduce a subtle regression in a page that currently works. Should the team schedule the file split as the next piece of work after the Clock-Practice adoption, or leave the page as a single file for now and revisit only if the page grows? The architecture recommendation is to schedule the split, because it unlocks a stronger Content-Security-Policy and cleaner linting, but the decision is Tim's.
