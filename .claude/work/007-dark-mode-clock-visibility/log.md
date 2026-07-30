# Log: 007-dark-mode-clock-visibility

- 2026-07-30: Sonja opened work folder. Tim reported the site looks bad and clock hands don't show in browser dark mode, via two screenshots (both appeared to be normal light-mode renders, so the failure is condition-specific and needs reproduction, not visible from the screenshots supplied). All colours in `index.html`/`styles/styles.css` are hardcoded hex, no `color-scheme` declared anywhere and no `prefers-color-scheme`/`forced-colors` media queries exist in `styles/styles.css`. Dispatching Carol first to reproduce and diagnose before Sean fixes.
- [2026-07-30 18:53:23] subagent completed
- [2026-07-30 18:53:56] subagent completed
- [2026-07-30 18:54:28] subagent completed
- [2026-07-30 18:55:01] subagent completed
- [2026-07-30 18:55:34] subagent completed
- [2026-07-30 18:56:07] subagent completed
- [2026-07-30 18:56:49] subagent completed
- 2026-07-30: Carol's diagnosis is in. Root cause: Chromium's built-in "force dark" content-repaint heuristic (the mechanism behind chrome://flags/#enable-force-dark and Android Chrome's "Auto Dark Mode for Web Contents"), not `prefers-color-scheme` (no dark CSS exists, ruled out) and not `forced-colors: active` (hands stayed visible under that, ruled out). It repaints colours at the compositor stage after layout, inverting dark/low-saturation colours it judges "dark-on-light" — the navy hour hand and centre pivot (#0A2342) get flattened to near-white against the white clock face, and the white stat/panel boxes get inverted to near-black against the still-untouched gradient background, which is the "looks terrible" complaint. It never engages because index.html has no `color-scheme` meta tag or CSS `color-scheme` property to opt the page out. Full write-up and screenshot evidence in carol-diagnosis.md. Dispatching Sean to add an explicit `color-scheme: light` declaration and verify both prefers-color-scheme and forced-colors remain fine.
- [2026-07-30 18:58:08] subagent completed
- [2026-07-30 18:58:40] subagent completed
- [2026-07-30 18:59:12] subagent completed
- [2026-07-30 18:59:44] subagent completed
