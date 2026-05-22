# Decision Record 003: Hosting on GitHub Pages and the security-header constraint

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-21, during work 004-clock-practice-setup. One part, the Content-Security-Policy value, is proposed and depends on the file split in Decision Record 001.

## Context

Clock-Practice is hosted on GitHub Pages, served from the `main` branch of the public `timdixon82/Clock-Practice` repository at `https://timdixon82.github.io/Clock-Practice`. This matches Decision Record 001 of the global wiki (foundations): GitHub Pages is the standard host for static projects, and a GitHub Pages site is served from a public repository.

The team's coding standard, in the global wiki's `coding-standards.md`, requires a set of security response headers on every site. The stack standard says to "set the security response headers through the hosting configuration".

GitHub Pages has a hard limit here: it does not let the site owner set custom Hypertext Transfer Protocol (HTTP) response headers. A site owner cannot add `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, or the others as real response headers. GitHub Pages does send `Strict-Transport-Security` itself, and the team has already enabled "Enforce HTTPS" on the repository (recorded in the work log). The rest cannot be set as headers.

This record decides how Clock-Practice meets the team's security-header standard within that constraint.

## Decision

### Hosting

Confirm GitHub Pages as the host, served from `main`, with "Enforce HTTPS" enabled. This is the standard static-project host and needs no change.

### Security headers, given the GitHub Pages constraint

Because GitHub Pages cannot send custom response headers, Clock-Practice meets the security-header standard as far as a static page on this host can:

1. `Content-Security-Policy` is delivered through a `<meta http-equiv="Content-Security-Policy">` tag in the `<head>` of `index.html`. A meta-tag policy is honoured by browsers and is the only delivery route available on GitHub Pages. It has two known limits compared with a real header: it cannot use the `frame-ancestors` directive, and it cannot use the `report-uri` or `report-to` reporting directives. The page must be in place before any script runs, so the meta tag must be the first element in the `<head>` after `<meta charset>`.

2. `Strict-Transport-Security` is sent by GitHub Pages itself once "Enforce HTTPS" is on. No project action is needed beyond keeping that setting on. Note that the hard deny-list and the GitHub Pages settings mean this stays on; do not turn it off.

3. `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy` cannot be set on GitHub Pages. For `X-Frame-Options`, the defence against the page being framed by another site is the `frame-ancestors` directive in a real Content-Security-Policy header, which a meta tag cannot carry. The residual gap is therefore: clickjacking protection, referrer trimming, content-type sniffing protection, and feature lock-down are not enforced by headers on this host.

4. The residual gap is accepted as a documented security exception, not a defect. Gerrie should record it in `docs/exceptions/` with the reasoning below, for Tim's approval. The reasoning: Clock-Practice has no login, no form that posts anywhere, no personal data, no cookies, and no money or state-changing action. The realistic harm from a missing `X-Frame-Options` or `Referrer-Policy` on a page like this is very low. The defences that do matter for this page, HTTPS everywhere and a Content-Security-Policy that restricts where code may load from, are both in place.

### Content-Security-Policy value

The meta-tag policy should be as strict as the page allows.

- Target policy, after the file split in Decision Record 001:
  `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; base-uri 'self'; object-src 'none'; form-action 'none'`
  The `img-src` directive allows `data:` because the share-image feature draws to an HTML canvas and converts a Scalable Vector Graphics (SVG) image through a `data:`-style object Uniform Resource Locator (URL); confirm the exact need with Jed during the code review and tighten if it is not required.
- Interim policy, while the page is still a single file (current state):
  the same policy but with `script-src 'self' 'unsafe-inline'` and `style-src 'self' 'unsafe-inline'`, because a single-file page has its script and style inline. `'unsafe-inline'` weakens the policy: it is the reason Decision Record 001 recommends splitting the file. The interim policy is acceptable only until the split.

The exact policy must be tested in a browser before release, because a Content-Security-Policy that is too strict will silently break the page (for example, the SVG-to-canvas step in the share feature). Carol and Jed verify it.

## Alternatives considered

### Move hosting to a host that can set response headers, such as Netlify or Cloudflare Pages

Rejected for this project. A host with a headers configuration file would let the team set every header as a real header, which is stronger. But the global foundations decision sets GitHub Pages as the standard static host, the project already runs there, and the residual risk for a page with no login, no data, and no forms is low. Changing host to gain headers that defend against risks this page does not really carry is more change than the gain justifies. If Clock-Practice ever grows a feature that handles personal data or state, revisit the host then.

### Put a Content Delivery Network in front of GitHub Pages to inject headers

Rejected. A content delivery network in front of the Pages site could add the missing headers. It also adds a service to configure, a second place for the site to break, and a custom domain to manage. For a page of this risk profile that is disproportionate. The principle "prefer the simple solution" applies.

### Skip the Content-Security-Policy because it cannot be a real header

Rejected. A meta-tag Content-Security-Policy is weaker than a header policy, but it is not worthless: browsers honour it, and it still restricts where scripts, styles, and other resources may load from, which is the main thing a Content-Security-Policy does. Shipping the meta-tag policy is clearly better than shipping nothing.

## Consequences

- `index.html` must carry a `<meta http-equiv="Content-Security-Policy">` tag, placed first in the `<head>` after `<meta charset>`. Adding it is a small change for Sean to make on the project-setup branch; it is content, not configuration, so it is not a GitHub action and needs no separate approval.
- The project has one documented security exception: the response headers that GitHub Pages cannot send. Gerrie records it in `docs/exceptions/`; Tim approves it.
- The strict target Content-Security-Policy depends on the file split in Decision Record 001. Until the split, the page uses the interim policy with `'unsafe-inline'`. This is a second reason to schedule the split.
- "Enforce HTTPS" must stay on. It is already on. Turning it off would drop the one security header GitHub Pages does send and would break the HTTPS-everywhere standard.
- The Content-Security-Policy must be tested in a real browser before release. The share feature, which serialises an SVG image and draws it to a canvas, is the most likely thing a too-strict policy would break.
