# Project Requirements: Clock Practice

This document records the business analysis for the Clock Practice project. It covers purpose, target users, scope, functional requirements, non-functional requirements, and acceptance criteria. It was reverse-engineered from the existing `index.html` as part of work 004-clock-practice-setup.

## 1. Purpose

Clock Practice is a static, interactive web page that helps learners practise reading the time on an analogue clock. The problem it solves is straightforward: learners who are developing the skill of reading analogue clocks need a low-pressure, repeatable way to practise. The page displays a clock face with randomly positioned hands, invites the learner to enter the time they see, checks their answer, and gives encouraging feedback.

The project is hosted on GitHub Pages and runs entirely in the browser. It has no server-side component and stores no data outside the current browser session.

## 2. Target Users

### 2.1 Primary users

The primary users are learners who are practising to read an analogue clock. The language and tone of the page suggest the intended audience is children, supported by a parent or carer. The share feature is addressed to "Mum and Dad", which indicates a school-age child audience.

### 2.2 Assistive technology users

The page must be fully operable by users of assistive technology (AT), including screen readers such as VoiceOver on macOS and JAWS on Windows. The project's owner, Tim Dixon, is severely sight-impaired and uses VoiceOver and JAWS. Any learner or carer who relies on a screen reader must be able to use the page independently.

### 2.3 Users with motion sensitivity

Users who prefer reduced motion (for example, due to vestibular conditions) are supported. The application respects the operating system's "reduce motion" preference.

## 3. Scope

### 3.1 In scope

- Displaying a randomly generated analogue clock face in the browser.
- Allowing the learner to enter an hour and a minute as their answer.
- Checking the answer and giving feedback, including targeted hints.
- Tracking the number of attempts for the current clock, and the total number of clocks solved in the session.
- Celebrating a correct answer with a visual confetti effect (suppressed when the user has requested reduced motion).
- Allowing the learner to generate and share a completion image via the browser's native share interface (Web Share Application Programming Interface, or Web Share API), or to download the image and copy a text message as a fallback.
- Supporting keyboard-only operation, including spinbutton-style controls for entering the hour and minute.
- Meeting the Web Content Accessibility Guidelines (WCAG) 2.2 at AAA conformance level.
- Responsive layout that works on screen widths from approximately 360 pixels (small phones) upward.

### 3.2 Out of scope

- User accounts, login, or persistent score storage.
- Times at the minute level below five-minute intervals (the current design uses only five-minute increments for minutes).
- Twenty-four-hour clock format.
- Audio pronunciation of the time or spoken instructions.
- Server-side logic, databases, or back-end services.
- Native mobile applications (iOS or Android).
- Multiple languages or internationalisation.
- Difficulty levels or configurable settings.

## 4. Functional Requirements

The following requirements are derived directly from the code in `index.html`.

1. On page load, the application must generate and display a random clock time. The hour must be a whole number from 1 to 12. The minutes must be one of the twelve five-minute values: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, or 55.

2. The application must render the clock as a Scalable Vector Graphics (SVG) element. The SVG must include a circular face, 60 minute markers (with the 12 hour-position markers drawn longer and darker than the other 48), the numbers 1 through 12, an hour hand, and a minute hand.

3. The hour hand must be positioned to reflect both the current hour and the current minute (the hand moves proportionally between hours as minutes advance). The minute hand must be positioned to reflect the current minute exactly.

4. The application must display a session statistics area showing two values: "Tries This Clock" (the number of answer submissions for the current clock) and "Clocks Solved" (the cumulative count of clocks answered correctly in the session).

5. The application must provide an hour input control. The control must allow the learner to select any whole number from 1 to 12, wrapping from 12 back to 1 when incremented past 12, and from 1 back to 12 when decremented below 1. The control must start at 12 each time a new clock is generated.

6. The application must provide a minutes input control. The control must allow the learner to select any five-minute value from 0 to 55, wrapping from 55 back to 0 when incremented past 55, and from 0 back to 55 when decremented below 0. The control must start at 0 each time a new clock is generated.

7. Both input controls must support keyboard operation. Pressing the Up Arrow or Right Arrow key must increase the value. Pressing the Down Arrow or Left Arrow key must decrease the value.

8. The application must provide a "Check My Answer" button. When activated, the button must compare the learner's entered hour and minute against the randomly generated time.

9. If the answer is correct, the application must:
   - Display a success feedback message that includes the correct time and the number of attempts taken.
   - Increment the "Clocks Solved" counter.
   - Disable the "Check My Answer" button so the same clock cannot be submitted again.
   - Enable the "Share with Mum and Dad" button.
   - Launch a confetti animation, unless the user's device reports a preference for reduced motion.

10. If the answer is wrong, the application must display a hint. The hint must identify which hand is incorrect: if only the hour is wrong, the hint must name the short hand; if only the minute is wrong, the hint must name the long hand; if both are wrong, the hint must suggest looking at both hands.

11. The application must provide a "New Clock" button that generates a fresh random time at any point, resets the attempts counter to zero, resets the hour and minute inputs to their defaults, clears any feedback, and disables the "Share with Mum and Dad" button.

12. The application must provide a "Share with Mum and Dad" button. The button must be disabled until the learner answers a clock correctly. When activated, the button must:
    - Generate a share image (600 by 800 pixels) containing the clock face, the correct time, and the number of attempts.
    - Attempt to share the image and a text message using the Web Share API with file support.
    - Fall back to the Web Share API without file support (sharing text only and separately triggering an image download) if file sharing is unavailable.
    - Fall back further to downloading the image and copying the text message to the clipboard if the Web Share API is unavailable.
    - Fall back to showing the text message in an alert dialog if the clipboard is also unavailable.

13. The feedback area must use an ARIA (Accessible Rich Internet Applications) live region with `aria-live="assertive"` so that screen readers announce feedback immediately when it changes.

14. The clock SVG must carry a meaningful `aria-label` that describes its purpose and directs the learner to the input controls below. The decorative elements inside the SVG (markers, numbers, hands) must be hidden from the accessibility tree with `aria-hidden="true"`.

15. Each input control must be implemented as a spinbutton using `role="spinbutton"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` attributes. The `aria-valuenow` attribute must be updated every time the value changes.

16. The confetti elements added to the page must be hidden from the accessibility tree with `aria-hidden="true"` so screen readers do not announce them.

17. The emoji characters in the page heading must be hidden from the accessibility tree with `aria-hidden="true"`.

## 5. Non-Functional Requirements

### 5.1 Accessibility

1. The application must conform to WCAG 2.2 at AAA level. This is interpreted in the global wiki's `accessibility.md` and the project-specific notes in `docs/accessibility.md`.

2. Every colour pair used in the interface must meet the contrast ratios required by WCAG 2.2 Success Criterion 1.4.6 (Contrast, Enhanced) for text (7:1) and Success Criterion 1.4.11 (Non-text Contrast) for graphical elements (3:1). The colour pairs documented in the source code comments are:
   - Body text (#1A2340) on the lightest gradient point (#FFB6C1): 9.3:1 (AAA).
   - Stat label (#495057) on white: 7.5:1 (AAA).
   - Stat value and dark text (#0A2342) on white: 17:1 (AAA).
   - White on primary green (#15803D): 5.0:1 (AA; noted as a non-text graphical element).
   - White on share purple (#6B21A8): 8.7:1 (AAA).
   - White on plus-minus blue (#1D4ED8): 6.6:1 (AA; near AAA).
   - Dark navy (#0A2342) on brand orange (#FF6F00): 5.6:1 (AA).
   - Clock minute hand (#C2410C) on white: 5.1:1 (meets the 3:1 graphical threshold).
   - Hour hand, numbers, and hour markers (#0A2342) on white: 17:1 (AAA).
   - Minor minute markers (#555555) on white: 7.8:1 (AAA).
   - Correct feedback (#0F5132 text on #D4EDDA background): 7.4:1 (AAA).
   - Wrong feedback (#664D03 text on #FFF3CD background): 7.8:1 (AAA).
   - Disabled button (white on #475569): 6.8:1 (AAA).

3. All interactive elements must have a clearly visible focus indicator. The application uses a 4-pixel solid outline in #0A2342 with a 3-pixel offset, applied on `:focus-visible`.

4. The application must be fully operable by keyboard alone, without any requirement to use a pointing device.

5. The application must respect the `prefers-reduced-motion` media query. When reduced motion is preferred, all CSS animations and transitions must be suppressed (duration set to 0.01 milliseconds), and the confetti JavaScript function must exit without adding any elements.

6. Screen-reader users must be able to determine the current state of the clock face through the SVG's `aria-label`, enter an answer using the keyboard-accessible spinbutton controls, and receive feedback through the live region.

### 5.2 Performance

1. The application is a single HTML file of approximately 22 kilobytes with no external dependencies, no JavaScript bundles, no external stylesheets, and no web fonts. It must load and be interactive within one second on a standard broadband connection.

2. The application must not make any network requests after the initial page load, except when the learner activates the share feature (which generates an image in the browser and passes it to the operating system).

### 5.3 Browser support

1. The application must work correctly in all modern browsers that support Scalable Vector Graphics (SVG), the Canvas 2D application programming interface (API), and ES2017 JavaScript (async/await). This includes current and one previous major release of Chrome, Edge, Firefox, and Safari.

2. The share feature relies on the Web Share API, which is not available in all browsers. The application must degrade gracefully (see functional requirement 12) when the Web Share API is absent.

### 5.4 Data and privacy

1. The application collects no personal data. It has no analytics, no cookies, no local storage, no session storage, and no network calls to any third-party service. There is nothing to report under the United Kingdom General Data Protection Regulation (UK GDPR).

2. The share image and share text are generated entirely in the browser and are passed directly to the operating system's share interface or downloaded to the learner's device. No data leaves the browser through any server the project controls.

### 5.5 Hosting and deployment

1. The application is hosted as a static site on GitHub Pages at the URL listed in `README.md`. No server-side configuration is required.

## 6. Acceptance Criteria

Each criterion below is a binary pass-or-fail test.

### 6.1 Clock generation

- AC-01: On page load, the clock displays a time where the hour is a whole number from 1 to 12 and the minutes are a multiple of 5 from 0 to 55.
- AC-02: Pressing "New Clock" generates a new random time that replaces the previous one.
- AC-03: After pressing "New Clock", the hour input shows 12 and the minute input shows 00.
- AC-04: After pressing "New Clock", the "Tries This Clock" counter shows 0.

### 6.2 Input controls

- AC-05: Pressing the plus button on the hour control increments the hour by 1.
- AC-06: Pressing the minus button on the hour control decrements the hour by 1.
- AC-07: When the hour reaches 12 and is incremented, it wraps to 1.
- AC-08: When the hour reaches 1 and is decremented, it wraps to 12.
- AC-09: Pressing the plus button on the minutes control increments the minutes by 5.
- AC-10: Pressing the minus button on the minutes control decrements the minutes by 5.
- AC-11: When the minutes reach 55 and are incremented, they wrap to 0.
- AC-12: When the minutes reach 0 and are decremented, they wrap to 55.
- AC-13: With keyboard focus on the hour spinbutton, pressing the Up Arrow or Right Arrow key increments the hour.
- AC-14: With keyboard focus on the hour spinbutton, pressing the Down Arrow or Left Arrow key decrements the hour.
- AC-15: With keyboard focus on the minutes spinbutton, pressing the Up Arrow or Right Arrow key increments the minutes by 5.
- AC-16: With keyboard focus on the minutes spinbutton, pressing the Down Arrow or Left Arrow key decrements the minutes by 5.

### 6.3 Answer checking

- AC-17: Submitting a correct answer displays a success message that includes the time and the number of attempts.
- AC-18: Submitting a correct answer increments the "Clocks Solved" counter by 1.
- AC-19: After a correct answer, the "Check My Answer" button is disabled.
- AC-20: After a correct answer, the "Share with Mum and Dad" button is enabled.
- AC-21: Submitting a wrong answer when only the hour is incorrect displays a hint about the short hand.
- AC-22: Submitting a wrong answer when only the minute is incorrect displays a hint about the long hand.
- AC-23: Submitting a wrong answer when both are incorrect displays a hint about both hands.
- AC-24: "Tries This Clock" increments by 1 each time the "Check My Answer" button is pressed.
- AC-25: After a correct answer, pressing "Check My Answer" again has no effect.

### 6.4 Share feature

- AC-26: The "Share with Mum and Dad" button is disabled when the page first loads.
- AC-27: The "Share with Mum and Dad" button is disabled after pressing "New Clock".
- AC-28: On a browser that supports the Web Share API with file sharing, pressing "Share with Mum and Dad" triggers the native share sheet with an image attached.
- AC-29: On a browser that supports the Web Share API without file sharing, pressing "Share with Mum and Dad" triggers the native share sheet with text, and separately downloads the image.
- AC-30: On a browser that does not support the Web Share API, pressing "Share with Mum and Dad" downloads the image and attempts to copy the text message to the clipboard.

### 6.5 Accessibility

- AC-31: The page passes an automated WCAG 2.2 AAA audit using a tool such as axe-core with no violations.
- AC-32: Every interactive element is reachable and operable using the Tab, Shift-Tab, Enter, Space, and Arrow keys alone, with no pointing device.
- AC-33: The clock SVG has an `aria-label` that is announced by a screen reader when focus moves to it.
- AC-34: The feedback area is announced immediately by a screen reader when its content changes, without the learner moving focus.
- AC-35: The hour and minute spinbuttons report their current value to a screen reader via `aria-valuenow` after every change.
- AC-36: Every interactive element has a visible focus indicator when it receives keyboard focus.
- AC-37: All text colour pairs meet the WCAG 2.2 Success Criterion 1.4.6 (Contrast, Enhanced) ratio of 7:1 or above, as listed in section 5.1.2.
- AC-38: When the operating system's "reduce motion" setting is active, no CSS animations or transitions play, and no confetti elements are added to the page.

### 6.6 Performance and data

- AC-39: The page loads and reaches an interactive state within 3 seconds on a simulated slow 3G connection, as measured by a browser developer tool.
- AC-40: Inspecting the browser's network panel after full page load shows no requests to any external domain.
- AC-41: Inspecting the browser's application storage (cookies, local storage, session storage, and IndexedDB) shows no data written by the application.
