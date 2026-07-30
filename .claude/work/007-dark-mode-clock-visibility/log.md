# Log: 007-dark-mode-clock-visibility

- 2026-07-30: Sonja opened work folder. Tim reported the site looks bad and clock hands don't show in browser dark mode, via two screenshots (both appeared to be normal light-mode renders, so the failure is condition-specific and needs reproduction, not visible from the screenshots supplied). All colours in `index.html`/`styles/styles.css` are hardcoded hex, no `color-scheme` declared anywhere and no `prefers-color-scheme`/`forced-colors` media queries exist in `styles/styles.css`. Dispatching Carol first to reproduce and diagnose before Sean fixes.
