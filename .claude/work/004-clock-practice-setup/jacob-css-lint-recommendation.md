# Architecture recommendation: Clock-Practice CSS-lint tooling

## Summary

Clock-Practice's continuous integration (CI) cannot lint CSS. The "Lint CSS"
step runs `npx --yes stylelint styles.css`, but `.stylelintrc.json` extends the
shared config `stylelint-config-standard`, and `npx --yes` does not fetch that
shared config. Stylelint exits with a configuration error.

I recommend **Option B with a refinement**: give Clock-Practice a `package.json`
that lists the three linters and the one shared config as development
dependencies, commit a lockfile, and have CI run `npm ci` before the lint steps.

The deciding fact is the reference project. Periodic-Table's CI passes all
checks, and Periodic-Table already does exactly this. Clock-Practice's
no-package-manifest setup is not the proven pattern; it is a divergence from it,
and that divergence is the defect. The fix is to bring Clock-Practice into line
with Periodic-Table, not to invent a third path.

This should be a **cross-cutting standard**. Decision Record 006 in the global
wiki should be updated so every adopted static front-end project uses a pinned
linter manifest. The other adopted static projects share the same latent
defect to the extent they copied Clock-Practice's `npx --yes` pattern, and they
must be checked.

## What I examined

- `CLAUDE.md` at the AgentTeam root, for the team rules and the wiki schema.
- The finding: `.claude/work/004-clock-practice-setup/css-lint-finding.md`.
- The Clock-Practice project wiki, in particular Decision Record 002
  (no build step) and Decision Record 004 (zero third-party runtime
  dependencies).
- Decision Record 006 in the global wiki (standards for adopted static
  front-end projects).
- The Periodic-Table repository: its `package.json`, its committed
  `package-lock.json`, its `.stylelintrc.json`, and its CI workflow
  `.github/workflows/ci.yml`.
- The Clock-Practice repository: its `.stylelintrc.json`, `.htmlvalidate.json`,
  `eslint.config.js`, and CI workflow.
- The global stack standard `docs/stacks/static-front-end.md`.

## The key finding: the reference project contradicts the premise

The finding describes Clock-Practice's no-package-manifest design as the
settled pattern, and frames the fix as a choice between keeping that pattern
(Option A) and reversing it (Option B). The repositories tell a different story.

Periodic-Table is named as the proven-working reference: its CI passes every
check. Here is what Periodic-Table actually does.

- It has a `package.json`. The file lists, as `devDependencies`, the three
  linters (`html-validate`, `stylelint`, `eslint`), the shared config
  `stylelint-config-standard`, and three self-hosted font packages. The
  manifest is marked `"private": true`, so it is never published.
- It commits a `package-lock.json`. The lockfile pins every direct and
  indirect dependency to an exact version and hash.
- It gitignores `node_modules/`. The installed packages are not committed; the
  lockfile is.
- Its CI runs `npm ci` as an "Install dependencies" step, before the three
  lint steps. `npm ci` installs exactly what the lockfile specifies. The lint
  steps then call `npx html-validate`, `npx stylelint`, and `npx eslint`, which
  resolve from the freshly installed `node_modules/`.

Periodic-Table's `.stylelintrc.json` is **byte-for-byte identical** to
Clock-Practice's: the same `extends: ["stylelint-config-standard"]` and the
same five rule overrides. The CSS-lint config is not the problem. The problem
is that Clock-Practice's CI was built on a different tooling model from the one
the reference project uses and proves.

So Clock-Practice's no-package-manifest setup is not the team's validated
static-project pattern. It is a divergence from it. The defect in the finding
is one visible symptom of that divergence; making the two projects consistent
is the real fix.

## How the linters resolve, and why Option A is weaker than it looks

The finding correctly states that `html-validate` and `eslint` were made
"self-contained" so they work under `npx --yes`. It is worth being precise
about what that cost.

- `.htmlvalidate.json` extends `html-validate:recommended`. That preset ships
  *inside* the `html-validate` package itself, so `npx --yes html-validate`
  fetches it for free. This is genuinely self-contained at no cost.
- `eslint.config.js` was made self-contained by **dropping the `globals`
  package** and hand-listing every browser global the script uses. A comment
  in the file says so plainly: "The globals package is not imported because
  Clock-Practice has no package manifest and the package may not resolve."
  That is not a free win. It is a maintenance burden: every time the script
  uses a new browser API, someone must remember to add it to the hand-written
  list, or `no-undef` raises a false error. The team's standard rule set was
  replaced with a bespoke partial one to fit the tooling model.
- `.stylelintrc.json` extends `stylelint-config-standard`, a **separate
  package**. Stylelint resolves an `extends` entry by Node module resolution
  from the config file's directory. With no `node_modules/` next to the config,
  resolution fails. As the finding notes, `npx --package` does not rescue this.

Option A would "fix" CSS lint the same way eslint was fixed: drop the
`extends`, and hand-copy a subset of rules. But `stylelint-config-standard`
carries roughly a hundred rules covering invalid CSS, deprecated syntax,
duplicate properties, malformed values, and more. Re-deriving and maintaining
that by hand is not realistic. Option A does not give a thin lint by accident;
it gives a thin lint by design, because the full standard rule set is precisely
what it has to throw away. The finding's own note already flags that CSS lint
has never completed once, so the project has no evidence its CSS even passes
the standard rules. Option A would lock in that blind spot.

Option A is therefore consistent with the *no-manifest model* but inconsistent
with the *team's intent*: lint HTML, CSS, and JavaScript against recognised
standard rule sets, and keep all five static projects consistent with each
other. Consistency with a local quirk is not the consistency that matters.

## Security and reproducibility: `npx --yes` is the larger problem

The finding asks me to weigh "security and reproducibility (note that
`npx --yes` fetches the latest version on every run)". This point deserves
weight, because it is an architecture and supply-chain problem in its own right,
separate from the CSS failure.

`npx --yes stylelint` fetches **whatever version of stylelint is newest on the
npm registry at the moment CI runs**, and `--yes` suppresses the prompt that
would otherwise ask before installing it. The same is true of the
`html-validate` and `eslint` steps. This means:

- **No reproducibility.** Two CI runs of the same commit, a week apart, can run
  different linter versions and reach different verdicts. A green build today
  can turn red tomorrow with no code change. A red build can turn green. The
  build is not a stable gate.
- **Unpinned supply chain.** Every CI run pulls the latest published version
  of each linter and, transitively, the latest of its dependency tree, with no
  review and no lockfile. If any of those packages, or any package in their
  dependency trees, is compromised or has a bad release, Clock-Practice runs it
  automatically on the next push. This is the "vulnerable and outdated
  components" risk in the OWASP Top 10, and the team's compliance baseline
  requires each OWASP item to be mapped to a concrete defence. Unpinned `npx`
  has no defence mapped; a committed lockfile plus `npm ci` is that defence.
- **It works against Dependabot.** Decision Record 004 in both projects says
  Dependabot is the dependency tool and a static project has no manifest for it
  to watch, so the dependency posture is tracked by hand in the decision
  record. That argument holds for *runtime* dependencies, of which Clock-Practice
  genuinely has none. But the linters are real, versioned npm packages that
  Clock-Practice runs on every push. Today they are invisible: no manifest, no
  lockfile, nothing for Dependabot to see, nothing pinned. A `package.json`
  plus `package-lock.json` makes the linter toolchain visible and lets
  Dependabot patch it. That is strictly better security posture, not worse.

So the no-manifest model does not just fail CSS lint. It also leaves the whole
CI toolchain unpinned and unreproducible. Option B fixes the CSS failure *and*
removes this larger problem in the same change. Option A fixes neither: even
with a self-contained `.stylelintrc.json`, the three `npx --yes` calls would
still float to the latest version on every run.

## Reconciling Option B with Decision Records 002 and 004

The honest objection to Option B is that Clock-Practice's wiki appears to forbid
a `package.json`. I have read those records closely. They do not, once read
precisely.

- **Decision Record 002, "No build step."** This decides Clock-Practice has no
  *build step*: no compile, no bundle, no transform, the repository source is
  the deployed site. A `package.json` whose only job is to install linters does
  not add a build step. The deployed site is still the exact HTML, CSS, and
  JavaScript in the repository. The record's own Consequences section already
  says: "The continuous integration pipeline still runs lint and accessibility
  checks ... but it has nothing to compile. Continuous integration validates
  the source; it does not produce a separate artefact." A dev-only lint
  manifest is fully inside that sentence. Periodic-Table proves the point: it
  also has a "No build step" decision, *and* a `package.json`, and the two
  coexist without contradiction.
- **Decision Record 004, "Zero third-party runtime dependencies."** Read the
  title and the wording. It governs *runtime* dependencies: scripts, styles,
  and fonts the browser loads when a visitor opens the page. Its decision is
  that no script, style, or font is loaded from another origin, so the
  Content-Security-Policy can stay on `'self'`. Linters never reach the
  browser. They run only in CI and on a developer's machine. Adding linters as
  `devDependencies` leaves "zero third-party runtime dependencies" completely
  true. Clock-Practice's CSP and `'self'` posture do not move at all.

The one line that needs care is in Decision Record 004: "No package is
installed from a package registry. There is no `package.json` and no lockfile."
That sentence was written to describe the *runtime* posture, but it is phrased
absolutely, so adding a dev manifest will read as a contradiction unless the
record is updated. The fix is a small, accurate amendment: state that
Clock-Practice has zero third-party *runtime* dependencies, and that its
*development* tooling (the three linters and one shared config) is pinned in a
`package.json` and `package-lock.json` used only by CI and developers, never
shipped to the browser. That is the same distinction Periodic-Table's records
already draw, so the amendment makes the two projects consistent rather than
creating a new exception.

## The recommendation

Adopt **Option B, refined to match Periodic-Table exactly**. Concretely, the
implementation Sean carries out should be:

1. Add a `package.json` at the Clock-Practice repository root, modelled on
   Periodic-Table's: `"private": true`, no runtime `dependencies`, and a
   `devDependencies` block listing `html-validate`, `stylelint`,
   `stylelint-config-standard`, and `eslint`, each pinned. Mirror
   Periodic-Table's lint scripts (`lint:html`, `lint:css`, `lint:js`, `lint`)
   so the project has a single local lint command.
2. Restore the `globals` package as a `devDependency` and let
   `eslint.config.js` import it, instead of the hand-written browser-globals
   list. This is optional but recommended: it removes the maintenance burden
   that the no-manifest model forced, and it makes the eslint setup match
   Periodic-Table too. If the team prefers the smallest possible change, the
   hand-written list can stay and `globals` can be skipped; the CSS fix does
   not depend on it. I recommend restoring it, and Sonja can put that to Tim as
   a sub-point.
3. Generate and **commit `package-lock.json`**. Add `node_modules/` to
   `.gitignore`. This matches Periodic-Table's `.gitignore`, which already
   documents this exact arrangement.
4. Change CI: add `cache: npm` to the `actions/setup-node` step, add an
   "Install dependencies" step running `npm ci` before the lint steps, and
   change the three lint steps from `npx --yes <tool>` to `npx <tool>` (or to
   `npm run lint`). After `npm ci`, `npx` resolves the pinned local copy and
   never reaches the registry.
5. Once CI can run CSS lint to completion for the first time, expect it may
   report real findings in `styles.css`, because the standard rule set has
   never actually run against that file. Those are ordinary lint fixes for
   Sean, and a normal re-test for Carol. They are not an architecture matter.
6. Update Clock-Practice Decision Record 004 with the runtime-versus-development
   wording described above, and add a short note to Decision Record 002
   confirming a dev-only lint manifest is not a build step. Record the tooling
   choice itself as a new Clock-Practice decision record (the next free number)
   so the project has a clear architecture record of why the manifest exists.

### Why not Option A

Option A keeps the no-manifest model but pays for it by discarding the standard
CSS rule set, leaving a deliberately thin lint, and it does nothing about the
unpinned, unreproducible `npx --yes` supply-chain problem. It also keeps
Clock-Practice inconsistent with Periodic-Table, the project the team has
already validated. It optimises for a local quirk over the team's actual
intent.

### Why not a third option

I considered two third options and rejected both.

- **Vendor `stylelint-config-standard` into the repository** (copy the config
  package's files in, and point `extends` at the local path). This makes CSS
  lint work with no manifest, but it leaves a third-party package copied into
  the repo with no version record and no Dependabot coverage, to be updated by
  hand forever. It also still leaves `html-validate`, `stylelint`, and `eslint`
  themselves floating on `npx --yes`. It trades one problem for a worse one.
- **Pin versions in the `npx` calls** (for example `npx --yes stylelint@16.19.1`).
  This fixes reproducibility for the named tool but still does not let stylelint
  resolve a *separate* shared-config package, which is the actual failure. It
  also scatters version numbers across a YAML file with no lockfile and no
  transitive-dependency pinning. It is strictly worse than a real lockfile.

Option B as refined is the only option that fixes the CSS failure, removes the
supply-chain problem, and makes Clock-Practice consistent with the proven
reference, all in one change.

## Per-project or cross-cutting

This is a **cross-cutting standard**, not a per-project decision.

Decision Record 006 in the global wiki already exists precisely because the
same setup questions kept recurring across the five adopted static projects,
and Tim chose to settle them once as standing standards. CI linter tooling is
the same kind of question. The team should not answer it five separate ways.

I recommend Decision Record 006 gain a fourth standing standard, alongside its
three existing ones:

> **4. Linters are pinned in a development manifest.** Every adopted static
> front-end project has a `package.json` marked `"private": true` whose
> `devDependencies` list the project's linters and any shared lint configs,
> with a committed `package-lock.json` and `node_modules/` gitignored.
> Continuous integration runs `npm ci` before the lint steps. CI never installs
> linters with `npx --yes`, because that fetches an unpinned latest version on
> every run, which is neither reproducible nor a defensible supply-chain
> posture. This manifest is development-only tooling: it adds no runtime
> dependency and no build step, and nothing in it is served to the browser.
> Periodic-Table is the worked example.

Whether to amend Decision Record 006 is Sonja's call on cross-cutting writes,
per `CLAUDE.md`; I am flagging it to her as the architect, with my reasoning,
which is the route `CLAUDE.md` sets out. My recommendation is that she does
amend it, because Periodic-Table already follows this and the cost of leaving
the standard unwritten is exactly the Clock-Practice defect repeating.

## Are the other adopted static projects affected

Decision Record 006 names five adopted static front-end projects: Periodic-Table,
Clock-Practice, LLBS, Braille-Reference, and timdixon82.github.io.

What I could verify directly:

- **Periodic-Table:** not affected. It already uses the pinned-manifest model.
  It is the reference and the fix target.
- **Clock-Practice:** affected. It is the project in this finding.

What I could not verify, and a flag to Sonja:

- **LLBS, Braille-Reference, and timdixon82.github.io:** their repositories are
  not present on this machine. Only Periodic-Table and Clock-Practice are
  checked out under the local `Github/` folder. I could not inspect their CI
  workflows or lint configs, so I cannot confirm or rule out the defect for
  them.

The latent-defect risk for those three is real and specific. Any one of them
**has the same defect if both of these are true:** its CI installs linters with
`npx --yes` (or `npx` with no `npm ci`), **and** its `.stylelintrc` (or eslint
config) extends a shared config that lives in a *separate* npm package. The
`.htmlvalidate.json` preset is safe, because it ships inside `html-validate`
itself; the stylelint and eslint shared configs are the exposure. A project
that copied Clock-Practice's `ci.yml` and `.stylelintrc.json` as a template, as
is likely given Clock-Practice and Periodic-Table share an identical
`.stylelintrc.json`, would carry the defect.

This needs a short check, which is why the cross-cutting standard matters:
fixing only Clock-Practice would leave the same trap in the others. I recommend
Sonja route a quick conformance check of LLBS, Braille-Reference, and
timdixon82.github.io: for each, read `.github/workflows/*.yml` and the lint
config files, and confirm whether linters are pinned in a manifest or floated
on `npx --yes`. Any project on the `npx --yes` model is brought into line with
the Decision Record 006 standard at the same time. That check is small and is
best done as one batched task rather than waited for here.

## Open questions for Sonja to put to Tim

These are batched for Sonja to relay; I am not asking Tim directly.

- Whether to amend global Decision Record 006 with the fourth standing standard
  above, making the pinned-linter-manifest the rule for every adopted static
  project. (My recommendation: yes.)
- Whether to restore the `globals` package as a `devDependency` and let
  `eslint.config.js` import it, removing the hand-written browser-globals list.
  (My recommendation: yes; it is a clean side benefit of having a manifest, and
  it makes Clock-Practice match Periodic-Table. It is optional and the CSS fix
  does not depend on it.)
- Whether to commission the conformance check of LLBS, Braille-Reference, and
  timdixon82.github.io for the same `npx --yes` defect, and to fix any that
  carry it. (My recommendation: yes.)

## Handoff

This recommendation returns to Sonja. It informs Jed's security review (the
supply-chain reasoning above) and Sean's implementation. Implementation is a
separate task; this file changes no project file and runs no Git or GitHub
action.
