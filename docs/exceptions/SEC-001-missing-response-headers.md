# Security Exception SEC-001: Missing Response Headers on GitHub Pages

- Reference: SEC-001
- Date raised: 2026-05-21
- Raised by: Gerrie (security governance)
- Status: Pending Tim's approval

## Reason

GitHub Pages does not support custom HTTP (Hypertext Transfer Protocol) response headers. The headers Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, and Permissions-Policy cannot be set at the platform level for this project.

## Risk

Without these headers, there is no server-enforced second line of defence against cross-site scripting or clickjacking. The risk is assessed as low for this specific application because it processes no personal data, loads no third-party scripts, and contains no login or payment flows. The realistic harm from missing X-Frame-Options or Referrer-Policy on a page with no sensitive content is very low.

## Mitigation

The following mitigations are in place.

- A `<meta http-equiv="Content-Security-Policy">` tag is included in `index.html` with a strict policy: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; base-uri 'self'; object-src 'none'; form-action 'none'`. This provides a browser-side Content-Security-Policy restriction even though a server header is not available.
- A `<meta name="referrer" content="strict-origin-when-cross-origin">` tag is included in `index.html` to partially address the missing Referrer-Policy header.
- HTTPS is enforced on the GitHub Pages site. Strict-Transport-Security is sent by GitHub Pages itself once "Enforce HTTPS" is on. That setting is active.

The following headers remain unmitigated by any available technique on GitHub Pages:

- X-Frame-Options (and the frame-ancestors Content-Security-Policy directive, which cannot be set via a meta tag).
- X-Content-Type-Options.
- Permissions-Policy.

## Approval required from

Tim Dixon.

## Approval date

Pending.

## Review trigger

This exception must be reassessed if any of the following occur:

- The project moves to a hosting platform that supports custom response headers, such as Netlify or Cloudflare Pages.
- The project adds a feature that handles personal data, login, payment, or any state-changing action.
- GitHub Pages adds support for custom response headers.
