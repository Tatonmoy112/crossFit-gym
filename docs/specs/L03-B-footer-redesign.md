# L03-B: Shared footer redesign

Date: 2026-11-17. Status: **implemented and verified for the documented automated scope**. Owner visual approval and manual reviews remain open.

## Composition and content

This specification supersedes L03-A's visual composition while retaining its content, landmark and native-navigation contracts. The owner's supplied screenshot is adapted to the existing yellow/charcoal palette, Barlow Condensed headings and Inter supporting text. No reference-company content or photograph is copied.

One server-rendered Footer remains after main on every route, including the custom 404. FooterCallToAction composes Container, SectionHeading, Button and NavigationLink. The lower body composes a second Container, a white Card, BrandLink, the existing four navigation groups and original contact/social/legal destinations.

- CTA heading: **Your Stronger Future Starts Here.**
- Description: **Visit Crossfit Gym in Sector 12, Uttara, Dhaka. Contact our team to get started.**
- Yellow pill action: **Start your journey**, `/contact/`, with a decorative arrow.
- Brand tagline: **One step closer.** Decorative wordmark: **CROSSFIT GYM**, derived from the existing name.
- All 22 original links remain, plus the new CTA: 23 links total. Navigation still has four groups and 15 destinations. Address, telephone, directions, Facebook and Instagram derive from current sources.
- Preserve the missing-hours note and conditional legal-approval notice. No copyright statement, email, newsletter, opening times or additional business claim is supplied.

`src/content/footer.ts` validates nonblank CTA/tagline/wordmark copy and a registered trailing-slash CTA destination with Zod. Existing telephone, HTTPS/social uniqueness and legal relationship validation remains. No catalog, approval flag, page template or preview/indexing policy changes.

## Layout and accessibility

Scoped rules live in `src/styles/footer.css`. The file was created before registering its global import. The CTA uses a 20rem minimum height, intrinsic growth, charcoal surface, subtle yellow top glow, centered content and 3rem bottom radii. The light lower body has rounded top corners. The bordered, softly shadowed Card uses responsive padding and visible overflow for focus outlines. Its local shadow overrides the primitive's ring utility, which also owns box-shadow; a computed-style browser assertion verifies the actual paint.

The Card is the named inline-size container. At 64rem of usable content width, its main grid places brand/contact beside four navigation columns. Below that threshold, brand/contact precedes navigation; navigation has two columns from 18rem and one below. Social/legal rows use a horizontal grid from 40rem, otherwise stack. These rem-based container queries respond to both available width and enlarged text. Heights remain intrinsic and text wraps without truncation.

Only the decorative wordmark frame clips overflow. It is aria-hidden and permanently inert, ignores pointer input and is hidden in forced colors. BrandLink supplies the accessible gym identity. Meaningful content and focus rings remain visible. All links keep at least 44px targets and native destinations. Keyboard order is CTA, brand, telephone, directions, grouped navigation, social and legal links. Navigation stays expanded without JavaScript. The existing mobile dialog isolates and restores the whole footer; a dialog-open axe audit guards this composition.

Footer and FooterCallToAction are Server Components. No pathname wrapper, client state, observer, animation library, provider or dependency is introduced.

## Verification contract

Content/component tests cover exact CTA copy/destination, nonblank validation, registered routes, preserved content, all links, semantic headings, two containers, Card reuse and decorative-only wordmark. Existing homepage container coverage accounts for the additional CTA Container.

Browser coverage checks Home, About, Contact, Privacy, Terms and an unknown URL for one footer and one H1, native contact channels, App Router navigation/history and noindex. It checks actual Tab order/focus, 44px targets, container columns, modal isolation, no JavaScript, blocked fonts/logo, reduced motion, forced colors and WCAG-tag axe. Normal and doubled/spaced text screenshots cover 320, 375, 768, 1024, 1280 and 1920px. Only decorative clipping is permitted.

Run the complete README workflow and inspect actual Turbopack page/stylesheet responses. Record actual results and artifact paths in the [QA checklist](../qa-checklist.md); a successful production build alone does not verify the development server or approve release.

## Recorded results

All 284 unit/component tests across 43 files pass. Typecheck, lint, formatting, production build, matching Chromium and the 26-HTML export audit pass. The complete browser suite passes 255 cases with one intentional viewport skip in 9.3 minutes after the decorative-inert correction. All 12 footer/header cases pass again against the final rebuilt shadow polish (1.1 minutes); the full passing run precedes that cosmetic-only CSS correction. No accessibility rule or behavioral assertion was removed.

Screenshots cover six normal/enlarged widths, blocked fonts/logo, no JavaScript and forced colors. Actual Turbopack pages and stylesheet return 200, unknown URLs return the custom 404, Home/Contact/history treatment is correct and the mobile dialog has zero axe violations. Final focused artifacts are under `.cache/qa/footer-redesign/final-footer/`; full regressions are under `full-verified/`. Clean desktop/mobile copies and development checks are in the same footer-redesign artifact directory. All original assets, supplied content, catalogs, pnpm tooling and release protections remain unchanged.

## Outstanding review

Owner visual approval, manual screen-reader/device/browser-zoom checks and other browser engines remain open. Opening hours, approved legal content, domain/hosting and all content-readiness/release gates remain unresolved. Supplied remote social account availability and a precise map pin are not independently verified. This change does not publish the site.
