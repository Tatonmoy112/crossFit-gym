# QA checklist

Executed results are updated after the final implementation checks. A test definition alone is not a passed check.

- [x] Production static build generates all planned route templates.
- [x] TypeScript check and production build type checking passed.
- [x] ESLint passed with no errors or warnings.
- [x] Unit/component suite: 14 tests passed in six files.
- [x] Export audit: 26 HTML outputs checked for internal links, referenced assets, H1s, descriptions and noindex on preview details.
- [x] Final formatting/type/lint/unit/export checks completed.
- [x] Playwright: 14 tests passed, with two intentional viewport-specific skips. All 23 named route outputs loaded on desktop/mobile without browser page errors or horizontal overflow; custom 404 recovery also passed.
- [x] Final browser regression completed in 29.9 seconds with two workers. Four simultaneous workers caused desktop action-stability timeouts on this machine; the same interactions passed with bounded concurrency, without forced clicks or disabled assertions.
- [x] Automated WCAG A/AA scans returned no violations for Home, Programs, Contact, FAQ, Gallery, Uttara location and program preview on desktop/mobile. This is automated evidence, not a claim of full WCAG conformance.
- [x] Additional responsive checks at 768 and 1920 passed for seven representative page types; desktop/mobile route checks used 1280 and 375.
- [ ] Manual keyboard, screen-reader and visual checks against approved designs.
- [x] Local production homepage Lighthouse mobile audit: Performance 93, Accessibility 100, Best Practices 100, SEO 69. SEO's failed scored check is intentional noindex. Lab LCP 2.6 seconds, TBT 250 ms, CLS 0. These are local lab results, not field Core Web Vitals or a universal device guarantee. Reports: `.cache/lighthouse-home.report.html` and `.cache/lighthouse-home.report.json`.
- [ ] Final performance/image/font review with full approved content and real production hosting; field Core Web Vitals after launch.
- [ ] Real provider delivery/spam/error checks after a provider is connected.
- [ ] Approved content and legal audit; release readiness.
- [ ] Production domain/hosting, direct URL, security header and indexability verification.

The Browser plugin reported no connected browser; interactive comparison against the approved design remains unverified. Automated Playwright tests ran with the matching workspace-local Chromium. Accessibility testing found secondary-text contrast and brand label/name issues; these were corrected. An existing failure screenshot was inspected to confirm the rendered homepage structure. Audits include WCAG 2.1 A rules as well as AA tags.

Lighthouse initially found oversized imagery and Windows RSC prefetch 404s. The supplied image was encoded as WebP and the build now normalizes segment files. Disabling speculative page prefetching reduced initial main-thread work; tests additionally reject internal HTTP errors.

`check:release` was executed and intentionally failed with 16 missing approval requirements. No public deployment or content-complete release is claimed.
