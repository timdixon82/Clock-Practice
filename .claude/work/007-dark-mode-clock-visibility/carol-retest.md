# Carol's retest: 007-dark-mode-clock-visibility

## Verdict: PASS

Tested branch `fix/dark-mode-clock-visibility` (commit `69934cc`) against `main` (local `88de5a9`, which matches the branch's fork point). Sean's fix is exactly the two-line change described: `<meta name="color-scheme" content="light">` in `index.html`'s `<head>`, and `color-scheme: light;` added to the `html, body` rule in `styles/styles.css`. No other lines changed in either file.

## Method

Served both `main` (baseline, via `git worktree`) and the branch from local static HTTP servers (matches the project's no-build-step, GitHub-Pages-static architecture). Ran three parallel passes with Python Playwright (Chromium) plus Pa11y 9.1.1 and Chrome DevTools MCP for console/issue checks.

## 1. Functional pass — PASS

- Page loads with no console errors. Only console output on both branch and main is the expected `goatcounter: not counting because of: localhost` warning, present because of local testing against an analytics endpoint that only fires on the real host — not a regression, not present on the production CSP-approved domain in any way related to this change.
- Clock hands rotate correctly on "New Clock": captured `transform` attribute on `#hour-hand` across 5 clicks, all five values differed, confirming the hands move to new random times (`rotate(227.5 100 100)`, `rotate(100 100 100)`, `rotate(270 100 100)`, `rotate(170 100 100)`, `rotate(110 100 100)`).
- Hour/minute controls work: `+`/`-` buttons update `#hour-display` / `#minute-display` text and `aria-valuenow` correctly.
- Check My Answer works both for wrong answers (feedback text `"Not quite! ... Try again"`, attempts counter incremented) and for a correct answer (brute-forced through hour/minute combinations until match): feedback showed `"✅ Brilliant! You got it right! It was 12:25 — solved in 138 tries!"`, `#share-btn` became enabled, `#check-btn` became disabled, matching `checkAnswer()`'s logic in `scripts/clock-practice.js`.
- New Clock resets attempts, feedback, and re-enables Check/disables Share correctly.
- No console errors or warnings introduced by the two-line diff itself.

## 2. Accessibility pass — PASS, no regression against AAA baseline

- Ran Pa11y 9.1.1, `--standard WCAG2AAA --include-notices --include-warnings`, against both `main` and the branch. **Result sets are byte-identical**: 51 findings on each, and a set-comparison of `(code, selector, message)` tuples across both runs shows `identical: True` — nothing added, nothing removed, nothing changed. This is expected: `color-scheme` affects only browser-chrome/UA-styling defaults (native form-control theming, scrollbar colour), and this page has no native form controls whose rendering `color-scheme` would touch (no `<select>`, `<input type=checkbox>`, etc. — the number controls are custom `<span role="spinbutton">` and `<button>` elements with explicit CSS).
- The 51 findings that persist are the same pre-existing findings recorded in `docs/accessibility.md` (Critical: no text alternative for time shown; High: sight-dependent instruction text, stat-box association, label/control mismatch; etc.) — out of scope for this work item per the brief, and unaffected by this change either way.
- Chrome DevTools MCP native console/issue check on the branch page: no errors, no accessibility issues reported. Only message is the same localhost goatcounter warning noted above.
- Contrast: since the fix touches no colour values, only a `color-scheme` declaration, and Pa11y's rule set (which includes contrast checks) produced an identical result, contrast is confirmed unaffected.

## 3. Dark-mode fix verification (Chromium forced-dark repaint) — PASS

Per your correction, reproduced using the real-world mechanism `--enable-features=WebContentsForceDark` (Chromium launch arg), not `--blink-settings=forceDarkModeEnabled=true` — the latter does not honour `color-scheme` and would give a false negative/false pass here.

- With `--enable-features=WebContentsForceDark` and a `dark` page colour scheme context, the branch (with the fix) renders identically to a normal light-mode render:
  - **Hour hand** (`stroke="#0A2342"`): renders in its correct dark navy, fully visible against the white face (screenshot `forced-dark-repaint-fixed-clock-crop.png`).
  - **Centre pivot dot** (`fill="#0A2342"`): visible, correct dark navy, not washed out.
  - **Stat/panel boxes**: computed `background-color` on `.stat-box` reads `rgb(255, 255, 255)` — still white, not inverted to near-black as in the pre-fix repro captured in the diagnosis (`playwright-blink-force-dark.png`).
  - **Minute hand** (`stroke="#C2410C"`): unaffected as before, stays orange.
- Pixel-diff test: rendered both `main` (pre-fix) and the branch (post-fix) in plain light mode (`color_scheme="light"`, no forced-dark, no forced-colors) with the clock hands forced to identical fixed positions via JS, then diffed the two full-page screenshots pixel-for-pixel. **Result: `diff bbox: None`, `max diff: 0`, `mean diff: 0.0`** — the fix is provably pixel-equivalent in normal light-mode rendering, confirming light-mode-unaffected is satisfied exactly, not just "should be."

## 4. `forced-colors: active` (Windows/browser high-contrast) — PASS, unaffected by the fix, matches original baseline

- Ran a Playwright context with `forced_colors="active"` against the branch. As in the original diagnosis: background gradient is replaced by a flat system (Canvas) colour, and stat/panel boxes take system-colour borders — this is unaffected by Sean's change since it was already happening before the fix and is browser-driven UA behaviour, not something `color-scheme: light` interacts with.
- **Hands and face remain visible**: `getComputedStyle()` on `#hour-hand` and `#minute-hand` reports their explicit authored `stroke` colours unchanged (`rgb(10, 35, 66)` navy, `rgb(194, 65, 12)` orange), and the clock face `circle` fill remains `rgb(255, 255, 255)` white — identical to the values recorded in the original diagnosis's forced-colors testing. No change in behaviour between pre-fix and post-fix under this mode, as expected: the fix only opts the page out of the separate forced-dark heuristic repaint, and does not touch or interact with `forced-colors`.

## Definition-of-done checklist (for Sonja / merge gate)

- [x] Root cause documented — done previously in `carol-diagnosis.md` (Chromium's forced-dark content-repaint heuristic, distinct from `prefers-color-scheme` and `forced-colors`).
- [x] Hands, face, numbers, and text remain visible and at correct AAA-established contrast in dark mode (forced-dark repaint reproduction) — confirmed above, hour hand and pivot dot render in their authored navy, no longer washed out.
- [x] Light mode renders pixel-equivalent after the fix — confirmed by exact pixel-diff (`max diff: 0`) between `main` and the branch under identical fixed clock-hand state.
- [x] Carol's functional pass: PASS (section 1 above).
- [x] Carol's accessibility pass: PASS, Pa11y WCAG2AAA result set identical pre/post fix, no regression (section 2 above).
- [x] No new console errors introduced — confirmed via Playwright console/pageerror listeners and Chrome DevTools MCP's native issue list; only pre-existing, unrelated localhost analytics warning present on both branch and main.
- [x] `forced-colors: active` unaffected, matches original baseline (section 4 above; not itself a Definition-of-done line item but explicitly required by the brief's risk section before merge).

## Citation check (not applicable)

This PR was authored by Sean (developer), not Tad or Simon, so the writing-style/brand citation check does not apply to this work item.

## Evidence

Working files retained only in the scratchpad for this session (not committed to the repo, per "no report files" convention): screenshots for the initial light-mode render, the fixed forced-dark repaint (full and cropped), the forced-colors-active render, and the pixel-diff comparison; Pa11y JSON output for both `main` and the branch.

## No further action needed

No rework flag, no specialist dispatch recommendation. This is a clean, minimal, verified fix. Ready for Sonja to take to Tim for merge approval.
