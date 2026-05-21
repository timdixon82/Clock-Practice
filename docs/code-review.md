# Code Review and Penetration Test: Clock-Practice

Reviewer: Jed (penetration tester and code reviewer)
Date: 2026-05-21
Branch reviewed: chore/project-setup
File reviewed: index.html (approximately 22 kilobytes, 740 lines)
Scope: OWASP Top 10 mapping, front-end security practice

This report is a backfill review. The Clock-Practice page had no prior security review before the team adopted it. Gerrie's security governance review is a separate document.

## Scope and method

The review covered the single production file, `index.html`, against the OWASP (Open Worldwide Application Security Project) Top 10 (2021 edition) and the specific checklist items in the work brief:

- Third-party scripts or styles loaded without Subresource Integrity (SRI)
- Cross-site scripting (XSS) sinks, including dangerous DOM write properties (`innerHTML`, `outerHTML`, `insertAdjacentHTML`), `eval`, and the `Function` constructor
- Inline event handler attributes
- External links that open a new tab without `rel="noopener noreferrer"`
- Hard-coded secrets
- Mixed content
- Unsafe use of URL parameters or Web Storage (the browser's `localStorage` and `sessionStorage`)

No Bash tool was available during this session, so automated scanner output (Semgrep, Trivy) is not included. The review is manual, line-by-line static analysis.

## Confirmed absences (no finding)

The following items from the checklist were checked and found to be absent or correctly handled.

- No external scripts, stylesheets, or fonts are loaded. All code and styling is inline. SRI is therefore not applicable.
- No `eval`, `Function` constructor, `outerHTML`, or `insertAdjacentHTML` is used anywhere in the file.
- No external links exist in the page. There are no `<a>` tags with `target="_blank"`, so the `rel="noopener noreferrer"` requirement does not apply.
- No hard-coded secrets, API keys, tokens, or passwords are present.
- No external resources are loaded over HTTP on an HTTPS page, so there is no mixed-content risk.
- No URL parameters are read (`location.search`, `URLSearchParams`, `location.hash` are absent).
- No Web Storage is used (`localStorage`, `sessionStorage`, `indexedDB` are absent).
- No third-party dependencies of any kind are present.

## Findings

### Finding 1: No Content Security Policy

Severity: Medium
OWASP category: A05:2021 Security Misconfiguration
Location: `index.html`, `<head>` section (lines 3 to 8) and the GitHub Pages hosting configuration

There is no Content Security Policy (CSP) in place. A CSP is a browser-enforced allowlist that tells the browser which sources of scripts, styles, images, and other resources are permitted to run. Without one, any cross-site scripting (XSS) vulnerability introduced in future would execute without any browser-level restriction.

GitHub Pages does not set a CSP response header by default, and the page does not include a `<meta http-equiv="Content-Security-Policy">` tag.

How to reproduce: Open the page in a browser, open the browser developer tools, go to the Network tab, reload, select the main document request, and inspect the response headers. No `Content-Security-Policy` header will be present.

Recommended fix: Add a `<meta>` CSP tag in the `<head>`. Because all scripts and styles are inline and all resources are self-contained, a strict policy is achievable. A starting point:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'none';
               script-src 'nonce-GENERATED_NONCE';
               style-src 'unsafe-inline';
               img-src 'self' blob: data:;
               connect-src 'none';
               form-action 'none';
               base-uri 'none';">
```

To use a `nonce`-based `script-src`, the inline `<script>` block and each inline event handler must carry the matching `nonce` attribute. Because there are currently seven inline `onclick` attributes (see Finding 2), those must be moved to `addEventListener` calls first. If that refactor is not done, the policy must fall back to `'unsafe-inline'` for `script-src`, which weakens the protection significantly.

An alternative starting point that avoids the nonce complexity is `'unsafe-inline'` for `script-src` combined with a strict `object-src 'none'` and `base-uri 'none'`. This is still far better than no policy at all.

### Finding 2: Seven inline event handler attributes

Severity: Medium
OWASP category: A05:2021 Security Misconfiguration
Location: `index.html`, lines 361, 363, 370, 372, 379, 384, 385

The file uses seven `onclick` attributes to wire up its interactive controls:

- Line 361: `onclick="changeHour(-1)"`
- Line 363: `onclick="changeHour(1)"`
- Line 370: `onclick="changeMinute(-5)"`
- Line 372: `onclick="changeMinute(5)"`
- Line 379: `onclick="checkAnswer()"`
- Line 384: `onclick="newClock()"`
- Line 385: `onclick="share()"`

Inline event handlers are treated as inline scripts by the browser. Any Content Security Policy that blocks `'unsafe-inline'` in `script-src` will also block inline event handlers. This means Findings 1 and 2 are coupled: a strict nonce-based or hash-based CSP cannot be adopted without first removing these inline handlers.

There is also a secondary risk: all seven handler functions (`changeHour`, `changeMinute`, `checkAnswer`, `newClock`, `share`) must be exposed on the global `window` object when they are wired as inline handlers. This widens the attack surface if a reflected or stored XSS vulnerability were ever introduced.

Recommended fix: Remove all `onclick` attributes and register the same handlers in JavaScript using `addEventListener`. The `init()` function at line 413 already serves as the setup entry point, so the registrations can go there alongside the existing `attachKeyboardSupport()` call. Example for the check button:

```javascript
// In init(), add this line to replace the onclick attribute on #check-btn:
document.getElementById('check-btn').addEventListener('click', checkAnswer);
```

Repeat this pattern for the remaining six handlers.

### Finding 3: DOM write via the innerHTML property in the feedback element

Severity: Low
OWASP category: A03:2021 Injection
Location: `index.html`, lines 510 to 517

When the user answers correctly, the feedback element is written using the `innerHTML` property (the dangerous DOM write property). The code at lines 510-517 builds a template literal that includes:

- `currentHour` - always an integer between 1 and 12, generated by `Math.floor(Math.random() * 12) + 1`.
- `currentMinute` - always an integer between 0 and 55 in steps of 5, generated by `Math.floor(Math.random() * 12) * 5`.
- `attempts` - a counter incremented from zero with `++`, always a non-negative integer.
- The `formatTime()` return value - those same safe integers formatted as a time string.

No user-typed input and no URL parameter reaches this template. As the code stands today, this is not exploitable: every value is a safe integer from `Math.random()` or a plain counter.

The risk is a future-change risk. If a developer were to pass a user-supplied value into this template without sanitising it first, a cross-site scripting vulnerability would result, because the property parses and executes HTML.

Recommended fix: Replace the property assignment with DOM construction using `createElement` and `textContent` for all text nodes. This removes the sink entirely rather than relying on all future contributors keeping data safe. If the brevity of the template literal is preferred, add a code comment explaining why the current values are safe and document that any future use of user input in this block requires explicit sanitisation first.

### Finding 4: Missing security-related response headers

Severity: Low
OWASP category: A05:2021 Security Misconfiguration
Location: GitHub Pages hosting configuration (not in `index.html` directly)

GitHub Pages does not set the following response headers by default:

- `X-Content-Type-Options: nosniff` - prevents MIME-type sniffing, which can cause browsers to execute a downloaded resource as a different type than intended.
- `Referrer-Policy: strict-origin-when-cross-origin` (or stricter) - controls how much of the page URL is sent in the `Referer` header when a user navigates away or shares a link.
- `Permissions-Policy` (formerly Feature-Policy) - allows the page to opt out of browser features it does not use, such as the camera, microphone, and geolocation.

For a static page hosted on GitHub Pages, `X-Content-Type-Options` and `Permissions-Policy` cannot be set via a file in the repository because GitHub Pages does not support custom response headers. The `Referrer-Policy` can be addressed partially with a `<meta>` tag:

```html
<meta name="referrer" content="strict-origin-when-cross-origin">
```

If the hosting ever moves to Netlify, Cloudflare Pages, or a similar platform that supports a `_headers` file, all three headers should be among the first configuration items to address.

### Finding 5: alert() used in fallback share path

Severity: Informational
OWASP category: Not an OWASP vulnerability
Location: `index.html`, lines 728 to 732

The `fallbackShare()` function uses `alert()` to inform the user that the share text has been copied to the clipboard, or to present the share text directly when the clipboard API is unavailable. The content passed to `alert()` is composed of safe values only: integers formatted as a time string. There is no XSS or injection risk here.

This is noted as a practice finding because `alert()` is synchronous and blocks the browser thread, it cannot be styled or made accessible, and its appearance varies by browser and operating system. On some mobile browsers it is suppressed entirely.

Recommended fix: Replace `alert()` with an announcement written to the existing `#feedback` live region, or add a dedicated status region for share confirmations. This also improves the experience for screen reader users.

## Summary

Five findings were identified: two Medium, two Low, and one Informational. No Critical or High findings were found.

The page has a sound security foundation. It loads no external resources, reads no URL parameters, uses no Web Storage, and contains no secrets. The main risks are the absence of a Content Security Policy and the seven inline event handlers that prevent a strict CSP from being adopted without first refactoring the event wiring.

### Findings by severity

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 0 |
| Medium | 2 |
| Low | 2 |
| Informational | 1 |

### Priority order for fixes

1. Remove inline `onclick` attributes and replace with `addEventListener` calls (Finding 2). This is a prerequisite for the next item.
2. Add a Content Security Policy `<meta>` tag (Finding 1). Once the inline handlers are gone, a meaningful policy can be written.
3. Replace the dangerous DOM write property in the feedback block with `createElement` and `textContent` calls (Finding 3). Low current risk, but eliminates the sink for future safety.
4. Add `<meta name="referrer">` and note the remaining header limitations of GitHub Pages hosting (Finding 4).
5. Replace `alert()` in the fallback share path with a live region announcement (Finding 5, Informational).

## Review metadata

Tool calls used: 4 (two parallel file reads, one directory listing, one Bash attempt that was denied by the session hook)
Approximate duration: one session pass
Automated scanners run: none (Bash tool not available in this session; Semgrep and Trivy checks could not be executed)

Note for Sonja: because automated scanning was not possible, I recommend that Sean or a continuous integration step runs Semgrep with the `p/javascript` and `p/owasp-top-ten` rule sets against `index.html` before the branch merges to main. This is a cross-cutting recommendation for any static HTML project on this team.
