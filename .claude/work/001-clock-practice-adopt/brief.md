# Brief: 001-clock-practice-adopt

## Summary

Adopt the existing `timdixon82/Clock-Practice` repository as the team's first real project, and run the project-completeness backfill on it. Clock-Practice is a public, interactive HTML page for practising telling the time on an analogue clock. It predates the team, so it has none of the team's reviews or documentation.

- Status: `archived`
- Branch: main
- Priority:
- Blockers: None

## Requirements

None exist yet. Clock-Practice was built before the team. Tad will backfill the business-analysis documentation, reverse-engineering the requirements and acceptance criteria from the working code, for Tim to confirm through the clarification relay.

## Routing plan

This first phase is adopt and audit, not code change:

1. Sonja clones the repository and surveys it: the code, and whether it already holds any project wiki, architecture review, security review, or business-analysis documentation.
2. Jacob backfills the architecture review.
3. Gerrie and Jed backfill the security review: Gerrie for governance, Jed for code-level review.
4. Tad backfills the business-analysis documentation.
5. Sonja consolidates the findings and gaps and reports to Tim, who decides the next phase, for example scaffolding the project wiki and the GitHub workflows, or fixing any issues found.

The stack is a static front-end of HTML, CSS, and JavaScript. Standards: `docs/stacks/static-front-end.md` in the global wiki.

## Approved GitHub actions

This phase is read-only. The actions ticked below may run without pausing for Tim.

- [x] Clone the `timdixon82/Clock-Practice` repository, read-only, into `~/Library/Mobile Documents/com~apple~CloudDocs/Github/Clock-Practice`
- [x] Read repository metadata with `gh repo view`, read-only
- [ ] Create a branch
- [ ] Commit to a branch
- [ ] Push a branch other than the main branch
- [ ] Open a pull request
- [ ] Comment on a pull request or an issue
- [ ] Create an issue

## Not pre-approved

These always pause for Tim, whatever is ticked above:

- Merging to the main branch. This always needs Tim's express approval at the time.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`. These are refused outright, whatever a brief says: force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.
