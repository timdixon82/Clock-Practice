# Brief: 009 dependency alerts

Status: active

## Summary

Clear the 14 open Dependabot alerts in the root package-lock.json (8 high, 4 medium, 2 low, all development scope) for brace-expansion, fast-uri, js-yaml and minimatch. Approved by Tim (Q323C).

Method: targeted npm update within existing ranges lifted fast-uri to 3.1.9, js-yaml to 4.3.2 and brace-expansion to 5.0.12. The minimatch fix (11.0.1 or later) is a major version that no current release of eslint or its dependencies allows, so a documented npm override (minimatch ^11.0.1) is used as a last resort. Remove the override once eslint and its config-array package accept minimatch 11.

## Out of scope

Feature changes, workflows, other work folders, and any npm audit fix --force.

## Risk and rollback

Risk is low: development dependencies only, nothing ships to the browser. The override forces eslint to use minimatch 11; lint and tests pass. Rollback: revert the pull request.

## Definition of done

- npm audit reports 0 vulnerabilities.
- npm ci, lint and tests pass.
- One pull request open against main, not merged.
