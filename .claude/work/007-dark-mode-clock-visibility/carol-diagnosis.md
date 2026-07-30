# Carol's diagnosis: 007-dark-mode-clock-visibility

## Verdict

Reproduced. Root cause identified.

**Root cause: Chromium's built-in "force dark" content-repainting feature** (Blink's `forceDarkModeEnabled` setting — the same mechanism exposed to end users as the desktop Chrome/Edge flag `chrome://flags/#enable-force-dark`, "Auto Dark Mode for Web Contents," and enabled by default in some Android Chrome configurations). This is **not** the CSS `prefers-color-scheme` media feature, and it is **not** Windows/browser forced-colors (high-contrast) mode. It is a separate, browser-internal heuristic repaint pass that runs after layout/paint, inverting the lightness of individual painted colours it judges to be "dark-on-light" or "light-on-dark," independently of the page's CSS. Because it operates at the paint/compositing stage, it does **not** show up in `getComputedStyle()` or DevTools' Computed panel — the CSSOM still reports the page's original hex values even while the rendered pixels are altered. That is exactly why the two screenshots Tim originally supplied looked like normal light-mode renders if they were captured by a tool that reads the DOM/CSS rather than composited pixels, or from a session where the flag was off; the moment the flag is on, the on-screen pixels differ from what the source and computed styles say.

## What I tried and what happened

I reproduced against the local file (`file:///Users/timdixon/Code/Github/Clock-Practice/index.html`) using both Chrome DevTools MCP `emulate` and standalone Playwright/Chromium sessions, to isolate each of the two candidate mechanisms named in the brief.

1. **`prefers-color-scheme: dark` alone** (Chrome DevTools MCP `emulate colorScheme=dark`, and Playwright `new_context(color_scheme="dark")`):
   No visible change at all — gradient background, white clock face, navy hour hand, and orange minute hand render identically to normal. Confirmed by `getComputedStyle()`: `body` background-image, `circle` fill, and both `line` stroke values were byte-identical to the light-mode baseline. This is expected: the codebase has no `@media (prefers-color-scheme: dark)` rules, so the media query alone does nothing. **This mechanism does not reproduce the bug.**

2. **`forced-colors: active`** (Playwright `new_context(forced_colors="active")`, tried with both `color_scheme="dark"` and `color_scheme="light"`):
   The browser did inject a UA-level `color-scheme: light dark` and stripped the body's gradient `background-image` (replaced with a flat Canvas-coloured background, black or white depending on scheme), and gave form controls/boxes system-colour borders. However, the clock hands and face were **not** affected — the SVG `<line>` stroke and `<circle>` fill kept their explicit authored colours and remained clearly visible in both the dark and light forced-colors screenshots. **This mechanism does not reproduce "hands don't show."** (It does change the background styling, which could contribute to "looks terrible" separately, but it is not the hands-invisibility cause.)

3. **Chromium's forced-dark content repaint** (Playwright `p.chromium.launch(args=["--blink-settings=forceDarkModeEnabled=true"])`, tested with both `color_scheme="dark"` and `color_scheme="light"` page contexts):
   This reproduced the bug exactly, and did so **regardless of the page's `prefers-color-scheme` value** — confirming it is a distinct, browser-level mechanism, not a page-CSS-driven one:
   - The gradient body background was left alone.
   - The white stat cards ("Tries this clock," "Clocks solved") and the hour/minutes control panel were inverted to near-black boxes with light text and light borders — this is the "looks terrible" complaint (mismatched black boxes against the pastel gradient).
   - The clock face `<circle>` (explicit `fill="white"`) stayed white.
   - **The hour hand** (`stroke="#0A2342"`, a very dark navy) was repainted to a near-white, low-saturation pale blue-grey. Against the still-white clock face this is barely perceptible — see the cropped close-up. This is the reported "hands don't show."
   - **The centre pivot dot** (also `#0A2342`) was likewise inverted to a pale near-white, leaving only a faint ring visible against the white face.
   - **The minute hand** (`stroke="#C2410C"`, a saturated orange) survived much better — Chromium's heuristic treats already-vivid/saturated hues less aggressively than the very-dark, low-saturation navy, so it stayed a recognisable (if slightly lightened) orange in all three repaint screenshots.

## Why this matches what Tim is seeing

Tim's browser (or Chrome/Edge on his device) evidently has the automatic dark-content-repainting feature switched on — either via the `chrome://flags/#enable-force-dark` flag, an OS/browser default that engages it opportunistically, or an equivalent Edge setting. Because `index.html` never declares a `<meta name="color-scheme" content="light">` tag or a CSS `color-scheme: light` property anywhere, the browser has no explicit opt-out signal from the page, so it falls back to its own heuristic repaint of every colour it can find — including the ones on the SVG hands, even though those are hardcoded hex values, not `currentColor` or CSS custom properties. In plain language: the browser looks at the page, decides "this is a light page with a browser feature asking me to darken things," and independently repaints each colour it finds by inverting how light or dark it is. The pale orange minute hand happens to survive that repainting reasonably intact because it's a vivid, saturated colour; the very dark navy hour hand and the navy centre dot do not survive it, and get turned almost the exact same shade as the white clock face behind them — so they visually disappear. The near-black stat cards and control panel, which were originally solid white with dark text, get fully inverted too, which is the "looks terrible" part: black boxes sitting on top of the still-untouched pastel gradient background, which was left alone because it's a `background-image` gradient rather than a flat colour.

This also explains why Tim's own screenshots looked like a normal light-mode render: if those screenshots were captured through a path that doesn't go through Chromium's paint/compositor override (e.g., a DOM/CSS-based screenshot tool, a different browser without the flag enabled at that moment, or a moment when the feature was toggled off), the discrepancy is exactly consistent with this being a paint-time-only effect that never touches computed styles or markup.

## Affected elements (summary)

- `line` (hour hand, `stroke="#0A2342"`) — repainted to near-white, effectively invisible against the white face. **Primary cause of "hands don't show."**
- `circle` (centre pivot, fill `#0A2342`) — same repaint, same effective invisibility.
- `line` (minute hand, `stroke="#C2410C"`) — repainted but stays visible (vivid/saturated hue resists the heuristic better).
- Stat-card boxes and the hour/minutes control panel (white backgrounds, dark text/borders) — inverted to near-black boxes, contributing to "looks terrible" against the still-light gradient background.
- `circle` (clock face, `fill="white"`) — unaffected, stayed white.
- `body` background gradient — unaffected (gradient `background-image`s are not repainted by this heuristic the way flat colours are).

## What was not the cause

- `prefers-color-scheme: dark` media query response: the codebase has no dark-mode CSS rules, so this media feature by itself changes nothing. Ruled out.
- `forced-colors: active` (Windows/browser high-contrast mode): changes background/box styling via UA system colours, but leaves the explicitly-coloured SVG hands and face fully visible. Ruled out as the cause of hand invisibility.

## Evidence

All captured in this work folder:
- `screenshots-normal.png` — baseline light-mode render (Chrome DevTools MCP, file://).
- `screenshots-dark-scheme.png` — `prefers-color-scheme: dark` emulated, unaffected.
- `playwright-forced-colors-active-dark.png` / `playwright-forced-colors-active-light.png` — `forced-colors: active`, hands unaffected, boxes/background changed.
- `playwright-force-dark-mode.png` — attempted repro via `--force-dark-mode --enable-features=WebContentsForceDark`, no effect on this Chromium build (flag combination not the right one for this repro; kept for completeness).
- `playwright-blink-force-dark.png` and `playwright-blink-force-dark-lightscheme.png` — the reproduction, via `--blink-settings=forceDarkModeEnabled=true`, with `color_scheme` set to `dark` and `light` respectively (identical result both times, confirming independence from `prefers-color-scheme`).
- `crop-hands.png` — 2x cropped close-up of the clock face from `playwright-blink-force-dark.png`, showing the hour hand and pivot dot faded to near-white against the white face while the orange minute hand remains visible.

## Recommendation for the fix phase (not actioned here, per brief)

The brief already scopes the fix to Sean. For his reference, the standard opt-out for this exact class of bug is declaring `color-scheme` on the page (`<meta name="color-scheme" content="light">` and/or CSS `:root { color-scheme: light; }`), which tells browsers the page's colours are intentional and light-only, stopping the heuristic force-dark repaint from engaging. That does not by itself address `forced-colors: active` (Windows high-contrast) support, which per this diagnosis was already working correctly and should be re-verified unaffected by whatever fix Sean applies, per the brief's requirement to check both conditions before merge.

## No fix attempted

Per the brief, I did not modify any source file. This diagnosis is read-only reproduction and reporting.
