# Carol's Test Report: 008-clock-container-centering

**Branch:** `fix/clock-container-centering` (PR #52)
**Verdict: PASS**

## Change under test

`styles/styles.css`, `.clock-container` rule:

```diff
-  margin-bottom: 26px;
+  margin: 0 auto 26px;
```

`width: fit-content` (from work 007) is untouched, as required by the brief's "out of scope" section.

## Functional tests

Ran against a local static server (`python3 -m http.server`, no build step, per `docs/decisions/002-no-build-step.md`), driven with Playwright (chromium, headless).

- Page loads, clock SVG renders and is visible: pass.
- New Clock button present and clicking it changes the hour-hand `transform` (`rotate(290 100 100)` -> `rotate(217.5 100 100)`), confirming hands rotate to a new time: pass.
- Hour/minute spinbutton controls present (2 spinbuttons found): pass.
- Check My Answer button present: pass.
- Share with Mum & Dad button present: pass.
- No console errors or page errors during load or interaction: pass.

Also ran the project's own automated suites, unaffected by scope but useful as a regression backstop for a CSS change touching a shared layout container:

- `npm test` (vitest): 33/33 tests passed.
- `npm run lint` (html-validate, stylelint, eslint): all clean, no errors.

## Visual tests

Screenshots captured with Playwright at two viewports.

**Desktop (1280x900):**
- `.clock-container` bounding box: x=464, width=352, height=352.
- Left gap to viewport edge: 464px. Right gap: 464px. Difference: 0px — centered.
- width/height ratio: 1.0 — true circle, not an ellipse.

**Narrow (340x700, the <=360px breakpoint named in the brief):**
- `.clock-container` bounding box: x=23, width=294, height=294.
- Left gap: 23px. Right gap: 23px. Difference: 0px — centered.
- width/height ratio: 1.0 — true circle.

Both screenshots were visually reviewed and match the numeric measurements: the clock backdrop sits centered under the header and stat boxes with even margins on both sides, and is circular (not stretched) at both the normal desktop width and the narrow breakpoint that also resizes the SVG and container padding. This directly verifies both properties named in the dispatch (centering and circularity) together, not just centering, addressing the fact that this is the second fix in two days touching this element.

No visual regression elsewhere on the page (header, stat boxes, hour/minute controls, buttons) was observed at either viewport.

## Accessibility tests

Sean flagged in the PR that `scripts/accessibility-regression.sh` is not checked into this repo. I confirmed this independently: `find` for `*accessibility-regression*` across the repository returns nothing. **This is a process gap** — logging it below as a task, not blocking this PR on it, per the dispatch instruction.

Fallback approach taken, per the dispatch instruction to use the team's usual fallback (Pa11y/axe directly) when the dedicated entry point is missing:

- `npx pa11y --config pa11y.json --standard WCAG2AAA http://localhost:8098/index.html` (project's own committed Pa11y config, default errors-only mode): **"No issues found!"**, exit code 0.
- `npx pa11y --config pa11y.json --standard WCAG2AAA --include-notices --include-warnings` (verbose pass, matching the AAA-with-notices-and-warnings methodology used in the baseline audit): 0 errors, 3 warnings (all the same pre-existing "text on background image, verify contrast manually" warning on different elements), 48 notices (all generic AAA "check that..." advisories that apply to any page, not element-specific findings). This output is consistent in kind and count with what would be expected from an unchanged DOM/ARIA/colour surface — the change is margin-only CSS on a container div, touching no text, no colour, no ARIA, no focus order, and no interactive elements.

This is consistent with `docs/accessibility.md`'s baseline: the project does not yet meet WCAG 2.2 AAA (16 known findings, out of scope for a dedicated accessibility phase), and none of those known findings are affected by a `margin` change on `.clock-container`. I did not find any new error-level violation introduced by this change.

Given the change is CSS-only, affecting no DOM structure, ARIA attributes, colour, or content, and the automated pass shows no new errors, I did not recommend dispatching an accessibility specialist (e.g. contrast-master, aria-specialist) for this PR — none of their trigger conditions ("new and interactive component" or "automated tool flags something needing deeper analysis") are met here.

## Citation check

Not applicable. This PR was authored by Sean (implementation fix), not by Tad or Simon, so the docs/writing-style.md or docs/brand.md citation requirement does not apply.

## Definition of done (from brief.md), item by item

- [x] `.clock-container` renders as a true circle (carried over from 007, must not regress). — Confirmed at both desktop (352x352, ratio 1.0) and narrow (294x294, ratio 1.0) viewports.
- [x] `.clock-container` is horizontally centered within the page at normal viewport width. — Confirmed at 1280px: 464px gap on each side, difference 0px.
- [x] `.clock-container` remains centered at the narrow (<=360px) breakpoint. — Confirmed at 340px: 23px gap on each side, difference 0px.
- [x] Carol's functional and accessibility passes both show PASS. — This report.
- [x] No new console errors. — Confirmed: zero console/page errors during load and interaction.

All five Definition-of-done items are satisfied. Recommend Sonja proceed to Tim for merge approval.

## Process gap noted (not blocking this PR)

`scripts/accessibility-regression.sh` is referenced in the dispatch and by Sean in the PR as an expected entry point, but does not exist anywhere in the repository. I used Pa11y directly as a fallback per the dispatch's own instruction, and that fallback was sufficient for this CSS-only change. Recording as a task below so the gap gets a real fix (either create the script or update whatever documentation/dispatch template refers to it) rather than being silently worked around every time.

<!-- TASK -->
- [ ] `scripts/accessibility-regression.sh` is referenced by dispatch instructions and PR discussion as the project's accessibility regression entry point, but does not exist in the repo. Either add the script (wrapping the project's Pa11y config/axe as appropriate) or correct the references to it so future dispatches don't hit a missing-file surprise. `priority:low` `owner:sean` `from:carol-008-clock-container-centering`
<!-- /TASK -->
