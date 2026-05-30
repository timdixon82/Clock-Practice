# Clock-Practice CSS-lint blocker

## Summary

After the HTML lint defect was fixed and pushed, continuous integration revealed a second blocker: the CI "Lint CSS" step fails. It had been hidden because the "Lint HTML" step failed first and stopped the job.

This finding is held for an architecture decision. The HTML lint fix (commit `09abba7`) is correct and unaffected.

## What fails

`.github/workflows/ci.yml` runs `npx --yes stylelint styles.css`. The project's `.stylelintrc.json` extends `stylelint-config-standard`. `npx --yes stylelint` fetches only the `stylelint` package, not the shared `stylelint-config-standard` config, so stylelint exits with `ConfigurationError: Could not find "stylelint-config-standard"` and exit code 78.

## Why it is not a quick fix

Clock-Practice is deliberately built with no package manifest, that is, no `package.json`. The linters run through `npx`, which fetches them on demand. This works for `html-validate` (a self-contained `.htmlvalidate.json`) and for `eslint` (the flat config in `eslint.config.js` was deliberately made self-contained; see the D-01 fix and the comment in that file).

It does not work for `stylelint` with a shared config. Stylelint resolves an `extends` entry by module resolution from the config file's own directory, not from the npx install location. Passing `--package stylelint-config-standard` to npx does not help: tested locally, stylelint still cannot resolve the config because the project directory has no `node_modules`.

So the fix is an architecture decision about the project's linting tooling, not a one-line change. It touches the recorded "no package manifest" design.

## Options

- A. Make `.stylelintrc.json` self-contained: drop `extends: ["stylelint-config-standard"]` and keep only explicit rules. Consistent with the no-package-manifest design and the eslint approach, but it loses the standard CSS rule set, leaving a thin lint.
- B. Add a `package.json` listing the linters and shared configs as devDependencies, and have CI run `npm ci` before the linters. This reverses the deliberate no-package-manifest design, but gives the full standard rule set and pinned, reproducible linter versions.

## Status

Held for an architecture decision by Jacob, then implementation by Sean and a re-test by Carol. Routed through Sonja.

## Note

The CSS lint has never run to completion in CI, so it is not yet known whether `styles.css` itself passes the standard rule set. That can be checked only once the tooling decision is made.
