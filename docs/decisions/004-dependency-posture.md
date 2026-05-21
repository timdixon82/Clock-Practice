# Decision Record 004: Zero third-party runtime dependencies

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-21, during work 004-clock-practice-setup.

## Context

The team's standards keep dependencies few. The stack standard, in the global wiki's `stacks/static-front-end.md`, says: "Keep dependencies few. Every dependency is something to keep updated and secure", and "Load a third-party script only when genuinely needed, and pin it with Subresource Integrity." The global foundations decision chose Dependabot as the dependency tool, partly because static projects have nothing for it to update.

This record reviews what Clock-Practice actually depends on, so the dependency posture is recorded and can be checked against later.

## Decision

Clock-Practice has zero third-party runtime dependencies, and it should stay that way unless a real need arrives.

A review of the repository confirms the posture:

- No script is loaded from another origin. The page does not include any `<script src>` pointing at a content delivery network or any other site. All JavaScript is the project's own, written inline in `index.html` today.
- No stylesheet is loaded from another origin. There is no `<link rel="stylesheet">` to a font service or a CSS framework. All CSS is the project's own.
- No web font is loaded from another origin. The page uses a system-font stack (`-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `system-ui`, `sans-serif`), so the fonts are whatever the visitor's device already has. Nothing is fetched.
- No package is installed from a package registry. There is no `package.json` and no lockfile. Consistent with the no-build-step decision (Decision Record 002).
- The favicon, `favicon.svg`, is the project's own file, committed to the repository. It is a hand-written Scalable Vector Graphics (SVG) drawing of a clock face. It is served from the project's own origin, not fetched from anywhere. It is not a third-party resource.
- The clock dial itself is drawn at run time by the project's own JavaScript, building SVG elements. No image library and no charting library is involved.
- The two browser interfaces the page uses, the Web Share interface (`navigator.share`) and the Clipboard interface (`navigator.clipboard`), are built into the browser. They are platform features, not dependencies, and they need no script to be loaded.

Because every script, style, and image is the project's own and served from its own origin, the Content-Security-Policy in Decision Record 003 can use `'self'` for `script-src`, `style-src`, and `img-src` with no third-party origin added.

There is one cosmetic point, not a dependency: the page uses emoji characters in headings, button labels, and feedback (for example a clock emoji and a tick emoji). Emoji are Unicode text characters rendered by the operating system's own emoji font; they are not fetched and are not a dependency. They are an accessibility and design matter for Simon and Carol, not an architecture matter, and the decorative ones in the current page are already marked `aria-hidden`.

## Alternatives considered

### Add a library for the clock drawing or the share feature

Rejected. The clock is drawn with a short loop that places SVG lines and numbers, and the share feature uses the browser's own canvas and Web Share interface. Both already work with the project's own code. A library would add a dependency to keep patched, and on a static site it would also have to be either loaded from another origin (which the Content-Security-Policy would then have to allow, weakening it) or copied into the repository (which then has to be kept updated by hand). Neither earns its place.

### Self-host a web font for a more distinctive look

Rejected as out of architecture scope, and not needed. The system-font stack means the page loads no font file at all, which is the fastest and most private option. Whether the page should have a more distinctive typeface is a design question for Simon, not an architecture decision. If a custom font is ever wanted, it should be self-hosted in the repository, not loaded from a font service, so the Content-Security-Policy can stay on `'self'`.

## Consequences

- Dependabot has nothing to scan for Clock-Practice, which is the expected state for a static project with no package manifest. The global foundations decision already anticipated this.
- The Subresource Integrity rule in the stack standard does not apply today, because there is no third-party script to pin. If a third-party script is ever added, it must be pinned with Subresource Integrity and its origin added to the Content-Security-Policy, and this record must be revisited.
- The zero-dependency posture is what lets Decision Record 003 keep the Content-Security-Policy tight on `'self'`. Adding any third-party resource later would force a change to both this record and the Content-Security-Policy.
- The favicon is confirmed as a first-party project asset. No licensing or supply-chain question attaches to it.
