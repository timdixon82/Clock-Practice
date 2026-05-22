# Decision Record 005: Pinned linter manifest for continuous integration

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-22, during work 004-clock-practice-setup.

## Context

Clock-Practice runs three linters in continuous integration: `html-validate` for the HyperText Markup Language (HTML), `stylelint` for the Cascading Style Sheets (CSS), and `eslint` for the JavaScript. The stack standard, in the global wiki's `stacks/static-front-end.md`, requires these lint checks.

The continuous integration pipeline first installed each linter with `npx --yes`, which fetches whatever version is newest on the package registry at the moment the pipeline runs. Two problems followed from that approach.

- The CSS lint step failed. The `stylelint` configuration extends the shared configuration `stylelint-config-standard`, which is a separate package. With `npx --yes` and no installed packages folder next to the configuration file, `stylelint` cannot resolve that shared configuration, so it exits with a configuration error. The CSS lint had never run to completion.
- The toolchain was not pinned. `npx --yes` fetches an unpinned latest version of each linter, and of every package those linters depend on, on every run. Two runs of the same commit a week apart could use different versions and reach different verdicts. There was no lockfile, nothing for Dependabot to watch, and no review of what the pipeline pulled from the registry. This is the "vulnerable and outdated components" risk in the Open Web Application Security Project (OWASP) Top 10, and the team's compliance baseline requires that risk to be mapped to a concrete defence.

This record decides how Clock-Practice installs and pins its linters. It does not change the runtime dependency posture: see Decision Record 004, which confirms Clock-Practice still has zero third-party runtime dependencies.

## Decision

Clock-Practice has a development-only linter manifest, modelled on the reference static project, Periodic-Table.

The arrangement is as follows.

- A `package.json` at the repository root, marked `"private": true`, with no runtime `dependencies`. Its `devDependencies` list the project's development tooling: `html-validate`, `stylelint`, the shared configuration `stylelint-config-standard`, `eslint`, and `globals` (the browser-globals package used by the ESLint configuration). Every entry is pinned. The file also carries the local lint scripts (`lint:html`, `lint:css`, `lint:js`, and `lint`) so the project has one local lint command.
- A committed `package-lock.json`, which pins every direct and indirect package to an exact version and content hash.
- The installed packages folder, `node_modules/`, is listed in `.gitignore`. The lockfile is committed; the installed packages are not.
- Continuous integration installs the linters with `npm ci`, which installs exactly what the lockfile specifies, before it runs the lint steps. Continuous integration never installs linters with `npx --yes`.

This manifest is the release-type of work the team calls tooling. It is not a feature and not a runtime change. It exists for one reason: to give continuous integration and developers a pinned, reproducible set of linters. Nothing in it is served to the browser, and it adds no build step. The continuous integration configuration itself is changed by Sonja and is outside the scope of this record.

The browser-globals package `globals` is part of this manifest. The ESLint configuration imports it and uses `globals.browser`, instead of a hand-written list of browser globals. The hand-written list was a workaround for having no manifest: with a manifest, the standard package is the cleaner choice, because it removes the need to update a bespoke list every time the script uses a new browser interface.

Periodic-Table is the worked example. It already uses a pinned `package.json` and `package-lock.json` for its linters, with `node_modules/` gitignored and `npm ci` in continuous integration. Clock-Practice now follows the same model.

## Alternatives considered

### Keep the no-manifest model and make every linter self-contained

Rejected. This would mean dropping the `extends` from the `stylelint` configuration and hand-copying a subset of the rules that `stylelint-config-standard` provides. That shared configuration carries roughly a hundred rules covering invalid CSS, deprecated syntax, duplicate properties, and malformed values. Re-deriving and maintaining that set by hand is not realistic, and it would leave a deliberately thin CSS lint. The no-manifest model also leaves the whole toolchain floating on `npx --yes`, so it does not fix the reproducibility or supply-chain problem at all. It optimises for a local quirk over the team's intent, which is to lint against recognised standard rule sets and to keep the static projects consistent with each other.

### Copy the shared configuration package into the repository

Rejected. Copying `stylelint-config-standard` into the repository would make CSS lint resolve with no manifest, but it leaves a third-party package copied in with no version record and no Dependabot coverage, to be updated by hand forever. It also still leaves `html-validate`, `stylelint`, and `eslint` themselves floating on `npx --yes`. It trades one problem for a worse one.

### Pin versions inside the `npx` calls

Rejected. Pinning a version in an `npx` call, for example `npx --yes stylelint@16.19.1`, fixes the version of the named tool but still does not let `stylelint` resolve a separate shared-configuration package, which is the actual failure. It also scatters version numbers across a continuous integration file with no lockfile and no pinning of indirect dependencies. A real lockfile is strictly better.

## Consequences

- The CSS lint step can run to completion for the first time. It may report real findings in `styles.css`, because the standard rule set has never run against that file before. Those are ordinary lint fixes and a normal re-test. They are not an architecture matter.
- The linter toolchain is reproducible. `npm ci` installs exactly what the committed `package-lock.json` specifies, so two runs of the same commit use the same linter versions and reach the same verdict.
- The supply chain is pinned. The lockfile pins every direct and indirect package to an exact version and hash. Dependabot can watch the manifest and flag a vulnerable or outdated linter. This is the concrete defence for the "vulnerable and outdated components" risk in the OWASP Top 10.
- The runtime posture in Decision Record 004 is unchanged. The manifest installs only development tooling. Clock-Practice still has zero third-party runtime dependencies, and the Content-Security-Policy in Decision Record 003 still uses `'self'`.
- The no-build-step decision in Decision Record 002 is unchanged. A development-only lint manifest transforms nothing and produces no separate artefact. The deployed site is still the exact repository source.
- A cross-cutting note: this manifest model is recommended as a standing standard for every adopted static front-end project, not just Clock-Practice. Whether to record that in the global wiki is Sonja's call on cross-cutting writes; the architect has flagged it to her.
