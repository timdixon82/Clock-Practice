# Decision Record 002: No build step

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-21, during work 004-clock-practice-setup.

## Context

Clock-Practice is a static front-end project. It is served exactly as written: the browser receives the same `index.html` that lives in the repository. There is no compile, no bundle, no transform, and no generated output.

The team's static front-end stack standard, in the global wiki's `stacks/static-front-end.md`, says under "Language and tooling": "A small project needs no build step. A larger one may use a light bundler such as Vite." This record decides whether Clock-Practice needs a build step, and records the reasoning so it does not need to be re-asked.

## Decision

Clock-Practice has no build step. The repository source is the deployed site.

This holds whether the page stays as one file or is later split into three files (see Decision Record 001). Three plain files, one HTML, one CSS, and one JavaScript, are still served directly with no build step. A build step would only be needed if the project later took on something that must be transformed before a browser can use it, such as a JavaScript package installed from a package registry, a CSS pre-processor, or a framework.

A development-only lint manifest is not a build step. Clock-Practice has a `package.json` and a `package-lock.json` whose only job is to pin the project's linters for continuous integration and for developers (see Decision Record 005). That manifest installs no runtime package and transforms nothing. The deployed site is still the exact HyperText Markup Language (HTML), Cascading Style Sheets (CSS), and JavaScript in the repository. Periodic-Table, the reference static project, has both a "No build step" decision and a development lint manifest, and the two coexist without contradiction.

## Alternatives considered

### Add a light bundler, such as Vite

Rejected. A bundler earns its place when a project has many source modules to combine, third-party packages to resolve, or assets to transform. Clock-Practice has none of these. It is one screen, with no dependencies installed from a package registry (see Decision Record 004). Adding a bundler would add a `node_modules` folder, a lockfile, and a build command, all of which are then things to keep updated and secure, for no gain the project can use today. The team's principle "prefer the simple solution" and "do not build for a future that has not been asked for" both point the same way.

### Add a build step only to minify the output

Rejected. Minifying would shave a few kilobytes off a 22-kilobyte page. The saving is small, and it comes at the cost of a build step and a difference between the source and the served file, which makes the served code harder to inspect. For a page this size the cost is not worth the saving. If the page ever grows large enough for size to matter, revisit this.

## Consequences

- No build step also means no build to break, no build dependencies to patch, and nothing between the repository and the browser. What is reviewed is exactly what is served, which keeps the security and code reviews honest.
- The continuous integration pipeline still runs lint and accessibility checks (required by the stack standard), but it has nothing to compile. Continuous integration validates the source; it does not produce a separate artefact.
- GitHub Pages serves the repository content directly (see Decision Record 003). With no build step, GitHub Pages can serve the `main` branch as-is, with no GitHub Actions build job in between.
- This decision is tied to the dependency posture in Decision Record 004. If Clock-Practice ever adopts a dependency that must be installed and bundled, the no-build-step decision must be revisited at the same time.
