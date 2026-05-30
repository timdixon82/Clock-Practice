# Carol Fix Re-test: 004-clock-practice-setup

Date: 2026-05-21
Tester: Carol
Scope: Targeted re-test of 9 HTML lint errors fixed by Sean in `index.html`. The earlier full setup-verification sign-off remains in force. This re-test covers only the two defects described below.

## Verdict: PASS

Both defects are resolved. The lint passes clean. No regressions are introduced.

## Defect A: Seven buttons missing `type="button"`

Sean added `type="button"` to all seven action buttons. The fix is confirmed present on every button:

1. Decrease hour button: `type="button"` present.
2. Increase hour button: `type="button"` present.
3. Decrease minutes by five button: `type="button"` present.
4. Increase minutes by five button: `type="button"` present.
5. Check My Answer button (`id="check-btn"`): `type="button"` present.
6. New Clock button (`id="new-clock-btn"`): `type="button"` present.
7. Share with Mum and Dad button (`id="share-btn"`): `type="button"` present.

All seven buttons retain their accessible names and their event listeners (wired in `clock-practice.js` via `addEventListener`). No functional regression.

Result: PASS.

## Defect B: Two `<label>` elements with invalid `for` attributes

The two `<label>` elements previously carried `for` attributes pointing at `<span>` elements with `role="spinbutton"`. A `<label for>` association is only valid for labelable form elements (input, select, textarea, and so on). A `<span>` is not a labelable element, so the association was invalid and the accessible names were broken.

Sean's fix:

- Removed the invalid `for` attributes from both labels, leaving them as `<label id="hour-label">Hour</label>` and `<label id="minute-label">Minutes</label>`.
- Added `aria-labelledby` on each spinbutton span, pointing at the label's existing `id`. `aria-labelledby` is the correct mechanism for providing an accessible name to a span with `role="spinbutton"`.

Accessible names observed (from static markup analysis):

- `hour-display` spinbutton: `aria-labelledby="hour-label"`. The element with `id="hour-label"` has text content "Hour". Accessible name: **"Hour"**.
- `minute-display` spinbutton: `aria-labelledby="minute-label"`. The element with `id="minute-label"` has text content "Minutes". Accessible name: **"Minutes"**.

Both accessible names are non-empty and correct. WCAG 2.2 Success Criterion 4.1.2 (Name, Role, Value) is satisfied.

The `aria-labelledby` on the wrapping `role="group"` divs is unchanged and continues to function correctly alongside the spinbutton accessible names.

Result: PASS.

## Lint result

Command: `npx html-validate index.html`
Config: `.htmlvalidate.json` (extends `html-validate:recommended`; adds `no-trailing-whitespace` and `void-style: omit` rules)
Output: no errors, no warnings.
Exit code: 0.

Result: PASS.

## Functional check (static analysis)

The JavaScript in `clock-practice.js` wires buttons by their `aria-label` attribute selectors (for the four number-control buttons) and by element ID (for `check-btn`, `new-clock-btn`, `share-btn`). None of these selectors depend on `for` attributes or on the presence or absence of `type`. The `updateDisplay()` function references `hour-display` and `minute-display` by ID, which are unchanged. All event bindings remain intact.

No regression is introduced by either fix.

## Summary

Both defects are fixed. The HTML lint passes with no errors. The spinbutton accessible names are "Hour" and "Minutes" respectively. No regressions.
