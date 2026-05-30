# Baseline Accessibility Audit: Clock Practice

**Audit date:** 2026-05-21
**Auditor:** Carol (tester agent)
**Standard:** Web Content Accessibility Guidelines (WCAG) 2.2 at AAA conformance
**Subject:** `index.html`, Clock Practice — single-page interactive analogue clock practice app
**Repository on disk:** /Users/timdixon/Library/Mobile Documents/com~apple~CloudDocs/Github/Clock-Practice
**Live URL:** https://projects.timdixon.net/Clock-Practice/
**Nature of audit:** Baseline of pre-existing work. This is not a sign-off.

## Automated testing

Pa11y version 9.1.1 was run against the live site with the WCAG2AAA rule set, including notices and warnings. The tool returned zero errors, six warnings, and 48 notices. Notices flag criteria that require human judgement; they are not automatic failures. Each notice and warning is assessed manually below and either closed or escalated to a finding.

axe-core was not available as a standalone command-line tool. The Pa11y run covers the same core rule set. Manual review addresses the gaps that automated tools cannot reach.

## Findings

Findings are numbered F-01 onwards. Severities are: Critical (blocks access), High (significantly impairs access), Medium (impairs access for some users), Low (minor barrier or best practice gap).

---

### F-01 Clock face carries no text alternative for the current time shown

**Severity:** Critical

**Criterion:** 1.1.1 Non-text Content, Level A

**Location:** `<svg class="clock" role="img" aria-label="Practice clock. Look at the two hands and enter the time using the controls below.">`

**Problem:** The SVG clock is the core instrument of the exercise. Its `aria-label` tells the user it is a practice clock and instructs them to look at the hands, but it does not tell them what time the hands are showing. A screen reader user cannot see the hands. The answer is hidden from them, making the exercise impossible without sighted assistance. This is the single most serious barrier on the page.

The label also uses the word "look", which is an instruction that depends on sight. A blind user cannot look at anything.

**Recommended fix:** After each new clock is generated, update a visually hidden live region (or the SVG `aria-label` itself) to announce the actual time. For a practice tool, the time should be revealed to the user on request, for example via a "Read the time aloud" button that announces it as a status message. Alternatively, restructure the exercise so the clock is a teaching aid and the task is presented in a way that is screen-reader accessible, such as confirming or rejecting a stated time. Remove the word "look" from the label.

---

### F-02 Stat boxes convey values without programmatic labels linking the label text to the value

**Severity:** High

**Criterion:** 1.3.1 Info and Relationships, Level A

**Location:** `.stat-box` elements containing `.stat-label` and `.stat-value` divs (lines 330–338)

**Problem:** Each stat box contains two plain `div` elements: one for the label ("Tries This Clock", "Clocks Solved") and one for the live-updating value ("0"). There is no programmatic association between the label and the value. A screen reader user navigating by element will hear "0" with no context, or "Tries This Clock" and "0" as two unrelated strings with no structural relationship expressed.

The `role="group"` on the outer `.stats` div with `aria-label="Game statistics"` helps at the group level but does not create the label-to-value pairing within each box.

**Recommended fix:** Use `aria-labelledby` on each value element pointing to its label, or use a `dl` (description list) with `dt` for the label and `dd` for the value. Example: `<div class="stat-value" id="attempts" aria-labelledby="attempts-label">0</div>` with `<div class="stat-label" id="attempts-label">Tries This Clock</div>`.

---

### F-03 Labels for hour and minute inputs reference a non-form element

**Severity:** High

**Criterion:** 1.3.1 Info and Relationships, Level A; 4.1.2 Name, Role, Value, Level A

**Location:** `<label id="hour-label" for="hour-display">Hour</label>` and `<label id="minute-label" for="minute-display">Minutes</label>` (lines 355, 368)

**Problem:** Pa11y flagged this as a warning. The `for` attribute of each `label` points to a `span` element (`id="hour-display"` and `id="minute-display"`). The `label` element's `for` attribute is only valid when it references a labelable form element such as `input`, `select`, or `textarea`. A `span` is not a labelable element, so the association is broken in the HTML specification. Although the `span` carries `role="spinbutton"` and is accessible via `aria-labelledby` on the parent group, the broken `for` link means clicking the label text does not focus the control, and screen readers that rely on the `label`/`for` pattern will not announce the pairing correctly.

**Recommended fix:** Either replace each `for` attribute with `aria-labelledby` on the `span` itself pointing to the label `id`, or restructure to use a native `input` element. The `aria-labelledby` approach on the spinbutton element is already partially in place via the group; complete it by adding `aria-labelledby="hour-label"` directly on the `#hour-display` span. Remove the `for` attributes from the `label` elements, or replace the `label` elements with plain `span` elements styled identically and referenced by `aria-labelledby`.

---

### F-04 "Check My Answer" button label contains a visible emoji character that screen readers will announce

**Severity:** Medium

**Criterion:** 1.1.1 Non-text Content, Level A; 4.1.2 Name, Role, Value, Level A

**Location:** `<button class="primary" id="check-btn" onclick="checkAnswer()">Check My Answer ✓</button>` (line 379)

**Problem:** The check mark character ✓ is a Unicode character, not an emoji, but screen readers announce it differently depending on the reader and language settings. VoiceOver on macOS announces it as "check mark". JAWS announces it as "checkmark" or may skip it. The accessible name of the button therefore varies between screen readers. While this is not a complete blocker, it introduces inconsistency in the name announced versus what Tim hears. The same applies to the "New Clock 🔄" button, where the counterclockwise arrows emoji is announced as "counterclockwise arrows button" by VoiceOver, making the button name longer and less clear.

**Recommended fix:** Remove the trailing emoji and Unicode symbol from button labels, or wrap them in `aria-hidden="true"` so they are excluded from the accessible name. The visible label text alone is sufficient and clear.

---

### F-05 Wrong-answer feedback contains an emoji that is included in the live region announcement

**Severity:** Medium

**Criterion:** 1.1.1 Non-text Content, Level A; 4.1.3 Status Messages, Level AA

**Location:** `feedback.textContent = \`Not quite! ${hint} Try again 💪\`` (line 531)

**Problem:** The flexed bicep emoji 💪 is written directly into the `textContent` of the live region. Screen readers will announce its full Unicode description, for example "flexed biceps" on VoiceOver, as part of the error message. This is disruptive and unexpected for a screen reader user. The correct answer feedback wraps its emoji in `aria-hidden="true"`, but the wrong answer path uses `textContent` assignment directly, bypassing any ability to hide the emoji from assistive technology.

**Recommended fix:** Use `innerHTML` for the wrong-answer branch too, and wrap the emoji in `<span aria-hidden="true">💪</span>`, consistent with the correct-answer branch.

---

### F-06 Feedback region uses `aria-live="assertive"` for all feedback, including non-urgent updates

**Severity:** Medium

**Criterion:** 2.2.4 Interruptions, Level AAA; 4.1.3 Status Messages, Level AA

**Location:** `<div class="feedback empty" id="feedback" role="status" aria-live="assertive"></div>` (line 381)

**Problem:** The feedback element carries both `role="status"` and `aria-live="assertive"`. These two attributes conflict. `role="status"` implies `aria-live="polite"` by specification. The explicit `aria-live="assertive"` overrides it. Assertive live regions interrupt whatever the screen reader is currently announcing, including the user's own navigation. For a wrong-answer message this is intrusive and can cut across a JAWS or VoiceOver user who is mid-announcement. Assertive is reserved for time-critical errors such as a session timeout. A wrong-answer hint is not time-critical.

**Recommended fix:** Remove the explicit `aria-live="assertive"` attribute and rely on the `role="status"` default of polite. If the correct-answer announcement is felt to be important enough to warrant assertive behaviour, use a separate assertive live region for the correct case only, and keep the wrong-answer feedback in a polite region.

---

### F-07 The page has no landmark structure beyond the body element

**Severity:** Medium

**Criterion:** 2.4.1 Bypass Blocks, Level A; 1.3.6 Identify Purpose, Level AAA

**Location:** Entire page body

**Problem:** There is no `<main>` landmark, no `<nav>`, and no `<header>`. JAWS and VoiceOver users can press a single key to jump between landmarks. With none defined, the user must read or tab through the entire page from the top on every visit. A `<main>` element wrapping the interactive content would at minimum let users skip to the interactive area directly.

**Recommended fix:** Wrap the primary content in a `<main>` element. Consider wrapping the `h1` in a `<header>`. If the page ever adds navigation, use `<nav>`.

---

### F-08 Spinbutton elements do not announce their `aria-valuetext` to aid interpretation

**Severity:** Medium

**Criterion:** 4.1.2 Name, Role, Value, Level A

**Location:** `#hour-display` and `#minute-display` span elements (lines 358–373)

**Problem:** The spinbutton elements expose `aria-valuenow` as a plain number. For hours this is clear, but for minutes, when the value is 0, the screen reader will announce "0" rather than "00" (which is what is displayed). More significantly, the spinbutton exposes only the numeric value with no unit, so a user stepping through just hears "3" for hours and "0" for minutes, without being told these are hours and minutes respectively. A complete spinbutton should use `aria-valuetext` to provide a human-readable version of the current value, for example "3 hours" and "00 minutes".

**Recommended fix:** Add `aria-valuetext` to each spinbutton element and update it in the `updateDisplay()` function. For example: `hEl.setAttribute('aria-valuetext', userHour + ' hours')` and `mEl.setAttribute('aria-valuetext', userMinute.toString().padStart(2,'0') + ' minutes')`.

---

### F-09 The page title is generic and does not describe the current task

**Severity:** Low

**Criterion:** 2.4.2 Page Titled, Level A

**Location:** `<title>Clock Practice</title>` (line 7)

**Problem:** Pa11y raised a notice on this. "Clock Practice" describes the application category but not the specific task or state. For a single-page application this is a low-severity issue, but a more descriptive title such as "Clock Practice — Read the analogue clock and enter the time" would orient a user arriving via browser history or a bookmarks list. Because this is a single-page app with no navigation between pages, this is a low-priority finding.

**Recommended fix:** Expand the title to "Clock Practice — Analogue Clock Reading Exercise" or similar.

---

### F-10 Background gradient creates unverifiable contrast for text overlaid on it

**Severity:** Medium

**Criterion:** 1.4.6 Contrast Enhanced, Level AAA (7:1 for normal text)

**Location:** `h1` element; body text colour `#1A2340` on background gradient `#87CEEB` to `#FFB6C1` (lines 12–13, 32–41, 47–49)

**Problem:** Pa11y flagged three warnings about text on a background image (treating the CSS gradient as an image). The code comments state `#1A2340 on lightest gradient point #FFB6C1` at 9.3:1 (AAA), and `#0A2342` on the gradient at 17:1 (AAA). These ratios are for the lightest point of the gradient. At the midpoint and the blue end of the gradient, the dark navy text will have an even higher contrast ratio, so the claim is directionally correct. However, the automated tool cannot verify this because it cannot sample a gradient. This finding is a note that the contrast assertion should be validated with a colour picker against both ends of the gradient at the point where each text element actually sits, not only at the lightest point.

The `h1` sits near the top of the page where the gradient is sky blue (#87CEEB). #0A2342 on #87CEEB gives a ratio of approximately 8.3:1, which meets the 7:1 AAA threshold. Pa11y's warning is a false positive on this specific pairing, but it should be confirmed rather than assumed.

**Recommended fix:** Confirm contrast ratios by sampling actual rendered pixel values. If confirmed at 7:1 or above, document the confirmed ratios in the project wiki to close this finding.

---

### F-11 Focus appearance does not fully meet the AAA criterion 2.4.13

**Severity:** Medium

**Criterion:** 2.4.13 Focus Appearance, Level AAA

**Location:** CSS focus ring rules (lines 206–211)

**Problem:** The focus ring is `4px solid #0A2342` with `outline-offset: 3px`. WCAG 2.4.13 requires that the focus indicator has an area of at least the perimeter of the unfocused component multiplied by 1 CSS pixel, and that the indicator has a contrast ratio of at least 3:1 between focused and unfocused states, and between the indicator colour and the adjacent colour. The 4px outline in dark navy is strong and likely meets the area and contrast requirements for most controls. However, `2.4.13` also requires that the focus indicator is not entirely enclosed within the component's background, and that the contrast requirement is met against every background the indicator may appear on. The gradient background and white panels mean the indicator colour (#0A2342, dark navy) must be checked against each surface. Against white it is 17:1. Against the blue end of the gradient it is approximately 8.3:1. These pass. Against the mid-gradient pink the ratio is approximately 9.3:1. These also pass. This finding is a confirmation note, not a confirmed failure.

The `number-display` span has `focus-visible` declared in the rule, which is correct. However, the `.number-display` is a non-interactive span that has been given `tabindex="0"` and `role="spinbutton"`. Its focus style is the same 4px ring, which is appropriate.

One gap: `button:disabled` elements receive no focus ring rule. Disabled elements should not be focusable per HTML spec (and they are not by default), so this is not a failure in itself, but it is worth confirming that disabled buttons are never in the tab order.

**Recommended fix:** Confirm focus indicator contrast against each background surface and document the results. Confirm that disabled buttons are excluded from the tab order (they are in current HTML, as `disabled` attribute removes focusability).

---

### F-12 Stat value elements are live but have no live region role

**Severity:** Medium

**Criterion:** 4.1.3 Status Messages, Level AA

**Location:** `<div class="stat-value" id="attempts">0</div>` and `<div class="stat-value" id="correct-count">0</div>` (lines 332, 336)

**Problem:** The attempt counter and correct count update dynamically via JavaScript (`document.getElementById('attempts').textContent = attempts`). These elements have no `aria-live` attribute and no ARIA role that implies a live region. A screen reader user will not be informed when these values change. The user must navigate back to these elements to discover the updated counts.

**Recommended fix:** Add `aria-live="polite"` and `aria-atomic="true"` to each stat value element, so screen readers announce the updated value after each answer is checked. Alternatively, include the count in the feedback message that is already in a live region.

---

### F-13 The `prefers-reduced-motion` media query uses `!important` overrides but confetti still launches

**Severity:** Low

**Criterion:** 2.3.3 Animation from Interactions, Level AAA

**Location:** `launchConfetti()` function (line 539) and `@media (prefers-reduced-motion: reduce)` rule (lines 288–294)

**Problem:** The CSS media query suppresses animations for users who have set `prefers-reduced-motion: reduce`. The `launchConfetti()` function correctly checks this preference before creating confetti elements. These two protections are consistent and the confetti does not launch for users with reduced motion. This is good practice and is noted as a pass.

However, the CSS rule uses `!important` to override all animation durations to 0.01ms. This is a functional suppression, but setting a duration of 0.01ms rather than 0 means the animation technically still runs for one frame. This is unlikely to trigger seizure risk (it is well below three flashes per second) but is worth tidying.

**Recommended fix:** Set `animation-duration: 0ms` and `transition-duration: 0ms` rather than 0.01ms.

---

### F-14 Page has no skip link

**Severity:** Low

**Criterion:** 2.4.1 Bypass Blocks, Level A

**Location:** Top of the page body

**Problem:** There is no skip navigation link. On a single-page application with no repeated navigation blocks, the absence of a skip link is a lesser concern. However, the `h1` and stats section appear before the interactive controls, and a screen reader user must tab through the stat boxes before reaching the clock and inputs. A skip link or `<main>` landmark (see F-07) would allow keyboard users to jump directly to the interactive area.

**Recommended fix:** Add `<a href="#panel" class="visually-hidden focusable">Skip to practice controls</a>` as the first element inside `body`, and add `id="panel"` to the `.panel` div. Show the link on focus. This is particularly useful when combined with fixing F-07 by adding a `<main>` landmark.

---

### F-15 Emoji in button labels are included in accessible names

**Severity:** Low

**Criterion:** 2.5.3 Label in Name, Level A

**Location:** `<button class="secondary" onclick="newClock()">New Clock 🔄</button>` and `<button class="share" id="share-btn" ...>Share with Mum &amp; Dad 📤</button>` (lines 384–385)

**Problem:** Emoji in button text become part of the accessible name announced by screen readers. VoiceOver will announce "New Clock counterclockwise arrows button" and "Share with Mum and Dad outbox tray button". While the intent is clear, the emoji descriptions add noise to the name announcement. They also make the name longer for voice control users who want to activate the button by speaking its label.

**Recommended fix:** Wrap each emoji in `<span aria-hidden="true">` so it is excluded from the accessible name, consistent with how emojis are handled in the `h1` and the correct-answer feedback.

---

### F-16 Clock SVG label instructs the user to "Look" at the hands

**Severity:** High

**Criterion:** 1.3.3 Sensory Characteristics, Level A

**Location:** `aria-label="Practice clock. Look at the two hands and enter the time using the controls below."` (line 341)

**Problem:** The word "look" is an instruction that depends on visual perception. A screen reader user cannot look at anything. This instruction is meaningless and potentially confusing for a blind user. This finding overlaps with F-01 (the clock hands are not read aloud) but is a distinct WCAG failure in its own right under 1.3.3, which forbids instructions that rely on sensory characteristics such as sight.

**Recommended fix:** Replace "Look at the two hands" with text that does not assume sight, for example: "An analogue clock face showing a time for you to read." Then provide the actual time through the mechanism described in F-01.

---

### F-17 No `<main>` or page region landmarks defined

**Severity:** Medium (duplicates F-07 for completeness of listing)

This finding is combined with F-07. See F-07 for details.

---

### F-18 "Share with Mum and Dad" button may trigger a Web Share API action whose result is not announced

**Severity:** Low

**Criterion:** 4.1.3 Status Messages, Level AA

**Location:** `share()` function and `<button id="share-btn">` (lines 674–710, 385)

**Problem:** The share function uses the Web Share API where available, falling back to clipboard copy and an `alert()`. The `alert()` fallback is accessible because it takes focus and is announced by screen readers. However, there is no announcement when the native share sheet is dismissed (either by sharing or cancelling). The button returns to its disabled state after the clock is solved but does not announce the outcome of the share action. A screen reader user will not know whether sharing succeeded.

Additionally, the fallback `alert()` text includes emoji: the message set in the `share()` function at line 676 contains 🕐 and 🎉 which are announced by screen readers reading the alert.

**Recommended fix:** After a successful share, set a polite live region message such as "Shared successfully." For the fallback clipboard path, the existing `alert()` covers it. Remove emoji from the share text that will be read aloud, or provide a separate text-only share message.

---

## Summary and verdict

### Pass areas

- Language attribute: `lang="en-GB"` is present on the HTML element. Pass on 3.1.1.
- Reduced motion: The `prefers-reduced-motion` media query is implemented in CSS and respected in JavaScript. Pass on 2.3.3 (subject to minor fix noted in F-13).
- Focus ring: A visible, high-contrast focus ring is defined on all interactive elements using `:focus-visible`. Directionally meets 2.4.13, subject to confirmation noted in F-11.
- Spinbutton keyboard support: Arrow key handlers are attached to both spinbutton elements, meeting the WAI-ARIA Authoring Practices for the spinbutton role. Pass on 2.1.1 and 2.1.3 for this widget.
- Emoji hiding in correct feedback: The celebration emoji in correct feedback is wrapped in `aria-hidden="true"`. Good practice.
- Confetti aria-hidden: Confetti elements are given `aria-hidden="true"` on creation. Good practice.
- Responsive layout: `clamp()` font sizes, flexible containers, and media queries for small screens are implemented. Directionally meets 1.4.4 and 1.4.10.
- No timing or session limits: The exercise has no time limit, meeting 2.2.3.
- No auto-context changes: The page does not redirect or move focus without user action, meeting 3.2.5.
- Contrast palette: The in-code colour comments show AAA-level contrast ratios for most pairings. F-10 flags one that needs manual confirmation.

### Count of findings by severity

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 3 |
| Medium | 7 |
| Low | 5 |
| Total | 16 |

Note: F-17 duplicates F-07 and is counted once only in the totals above.

### Does the page currently meet WCAG 2.2 AAA?

No. The page does not meet WCAG 2.2 AAA conformance. It does not fully meet WCAG 2.2 Level A, the minimum level, because:

- F-01 (Critical): The clock face does not expose the time it shows as text. A screen reader user cannot complete the exercise independently. This alone is a Level A failure under 1.1.1.
- F-16 (High): The clock label uses sight-dependent language, a Level A failure under 1.3.3.
- F-02 (High): Stat box labels and values are not programmatically associated, a Level A failure under 1.3.1.
- F-07 / F-17 (Medium): No landmark structure, a Level A failure under 2.4.1.
- F-12 (Medium): Dynamic stat updates are not announced, a Level AA failure under 4.1.3.

Several AAA-specific findings (F-06, F-13) are also present but are lower in severity given the more critical Level A failures.

This audit is a baseline of pre-existing work. The findings above describe the state of the page at the time of adoption. They are not a sign-off.

---

**Audit metadata**

- Automated tool: Pa11y 9.1.1 with WCAG2AAA rule set, including notices and warnings
- Manual review: Full source code review of `index.html` (740 lines), checked against WCAG 2.2 AAA criteria
- Screen reader testing: Manual review only; no screen reader was attached to this audit run. Screen reader verification of all findings should follow in the next test pass.
- Tool-call count: approximately 8
- Token count: not directly measurable from within the agent; estimated at moderate usage
- Duration: single session, approximately 5 minutes
