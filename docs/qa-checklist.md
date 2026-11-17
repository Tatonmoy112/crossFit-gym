# QA checklist

## L03-B shared footer redesign: 2026-11-17

- [x] Implemented the complete owner-approved CTA/panel/wordmark composition as Server Components after main, shared by every route and the custom 404. Reused Container, Card, BrandLink, SectionHeading, Button and NavigationLink; no dependency or client wrapper was added.
- [x] Validated the exact CTA copy and Contact destination, source-derived tagline/wordmark and original contacts/social/legal values. All 22 original links remain plus the new CTA. Hours/legal availability notes and existing content/indexing/release protections remain active.
- [x] Created footer.css before adding its global import. Actual running Turbopack About and stylesheet responses return HTTP 200 with the new rules, 23 links and no browser/page errors. Initial screenshot/geometry review at 320/375/768/1024/1280/1920px found no horizontal page overflow; refined narrow link padding so Membership stays intact at 375px.
- [x] All **284 unit/component tests across 43 files** pass with one worker (161.96 seconds). The focused footer suite passes all 20 cases. Corrected an unsupported Testing Library test option caught by TypeScript. Lint and formatting pass.
- [x] Initial focused browser run passed eight cases and exposed the brand row overflowing at 320px with 200% spaced text. Added footer-local brand wrapping and reduced phone padding to retain reading space. All ten corrected desktop/mobile footer cases pass in 1.0 minute, retaining the original assertions, target sizes and focus checks. Artifacts: `.cache/qa/footer-redesign/verified/`.
- [x] Final production build, TypeScript and 26-HTML export audit pass, preserving all 24 templates. An additional static-markup audit verifies exactly one footer, one H1, the approved CTA and noindex in all 26 outputs. Matching Chromium runs locally. Reviewed six normal/enlarged widths, six blocked-asset widths and no-JavaScript/forced-color specimens. The wordmark alone clips; meaningful content, native links and visible focus remain available. Clean review copies: `.cache/qa/footer-redesign/footer-1280.png` and `footer-mobile-375.png`.
- [x] Actual final Turbopack Home and Contact pages and their compiled stylesheet return HTTP 200, with the footer CSS, all 23 links and zero page/console errors. Home to footer CTA to Contact to browser Back restores the correct header treatment. An unknown development URL returns the custom 404 with one footer/one H1. Evidence: `.cache/qa/footer-redesign/dev/final-check.json`; the existing development server stays running.
- [x] Initial complete browser run: **254 passed, one intentional viewport skip, one failed in 9.3 minutes**. The mobile header dialog audit inspected the faint decorative wordmark behind the modal. Made only that repeated decoration permanently inert, retaining aria-hidden and the accessible BrandLink. Added component/browser inert assertions and a dialog-open footer axe audit; the live-development reproduction now has zero violations. All twelve corrected footer/header desktop/mobile cases pass against the rebuilt export (1.1 minutes), including the original failing header audit and the added dialog-open footer audit. The subsequent complete run passed **255 cases with one intentional viewport skip in 9.3 minutes**, with no failures. Artifacts: `.cache/qa/footer-redesign/full-verified/`. All current homepage sections, routes, header/history, accessibility and preview regressions pass.
- [x] Final visual polish: found that Card ring utilities overrode the intended frame shadow. Corrected only the local shadow cascade and added an actual computed-shadow assertion. The full passing run precedes this cosmetic correction; the final rebuilt export passes all **12 footer/header checks in 1.1 minutes**, including six normal/enlarged/blocked/no-JavaScript widths and dialog audits. Typecheck, formatting and the export audit pass again. Refreshed and reviewed final screenshots; artifacts: `.cache/qa/footer-redesign/final-footer/`. Turbopack also paints the real 16px/48px soft shadow with HTTP 200 and no page errors; evidence: `dev/shadow-check.json`. Both owned QA servers shut down, and the original development server remains available.
- [x] Protected-file audit shows no changes to package declarations, pnpm-lock.yaml, original info/figma/public assets, site identity, real membership/testimonial catalogs or content-readiness approvals. The supplied newsection.md SHA-256 is unchanged; the pre-existing untracked package-lock.json is untouched. All 192 checked local documentation references resolve.
- [ ] Owner visual approval, manual screen-reader/device/browser-zoom checks, other browser engines, approved legal text, opening hours and release readiness remain outstanding. No site is published.

## Turbopack development stylesheet recovery: 2026-11-17

The long-running development server on port 3000 returned HTTP 500 with a missing home-success-stories.css resolution error even though the file existed and the import was correct. The stylesheet import had briefly preceded creation of the file during implementation. Updating stylesheet timestamps did not clear the running process's earlier error. Restarted only the verified project Next.js development server, retaining 127.0.0.1:3000; no cache directory was deleted and no application/style content changed.

Verified the actual Turbopack development server after restart: Home, Contact and the compiled stylesheet return HTTP 200; the CSS contains the Success Stories rules; the carousel initializes with Nadia's 480px minimum-height charcoal gradient; Contact navigation and browser back work; a fresh Chromium context reports no page or console errors. Next regenerated its normal development type paths in next-env.d.ts. This supplements the production-export workflow below with a direct development-server check. Development server logs are under `.cache/dev-recovery/`.

## H01-H homepage Member Success Stories: 2026-11-17

- [x] Added the owner-approved three-card adaptation after Memberships and before Story. Exact supplied fictional names, focuses, quotations, introduction, supporting line and closing content stay separately validated in previews; the real testimonials catalog remains empty. The section is visibly disclosed, gated by site.preview and excluded when preview is disabled. Both actions open Contact; no story route, review structured data, form, remote image or dependency is added.
- [x] Reused the existing container, heading, card, button, link and Embla primitives. The rounded light panel has a split wide introduction, light side quote cards and a tall charcoal focal card initially showing Nadia. Native scrolling and all quotes/actions remain usable without JavaScript; inactive controls are hidden. The additive optional CarouselContent viewportProps forwards native accessible viewport attributes without changing existing consumers.
- [x] Verified finite arrows, aria-disabled boundary focus retention, viewport/control arrow keys, actual mouse and touch swipe, three unique selection positions, no automatic rotation, live reduced motion, offscreen inert updates and subscription/attribute cleanup.
- [x] Initial browser checks exposed an identity-row reading-width problem at 200% spaced text. Stacked initials/name/focus inside narrow cards, preserved intrinsic growth and ensured side-card backgrounds override the primitive utility layer. All ten corrected focused desktop/mobile browser cases pass (1.1 minutes), including six normal/enlarged widths, blocked assets, axe and no-JavaScript mobile/desktop reading and Contact navigation. Artifacts: `.cache/qa/home-success-stories/verified/`.
- [x] All **275 unit/component tests across 43 files** pass in the final isolated `--maxWorkers=1` run (300.73 seconds). An initial server-markup assertion was aligned with Next's trailing-slash normalization, matching existing tests. Two unchanged component tests timed out during a concurrent run; the complete isolated rerun retained assertions and five-second limits and passed. Typecheck, lint, formatting, production build and the 26-HTML export audit pass; all 24 templates and preview indexing protections remain.
- [x] Executed the complete **254-case** README browser workflow in **14.1 minutes**: **249 passed, 1 intentional viewport skip, 4 failed**. All four failures were two existing hero assertions using a page-wide role=note selector, now ambiguous because Home has three independent preview disclosures. Scoped those assertions to the hero; **all four affected desktop/mobile cases passed on rerun (14.2 seconds)**. Thus **all 253 applicable cases are verified across these runs**, not a single clean full-suite run. Application code and the exported artifact were unchanged by the selector correction. All ten Success Stories cases and all twelve Membership cases passed in the complete run. Artifacts: `.cache/qa/home-success-stories/full-final/` and `hero-regression-recheck/`; both owned QA servers shut down.
- [x] Reviewed normal and 200%-text/spacing/blocked-asset captures at 320/375/768/1024/1280/1920px, plus desktop/mobile no-JavaScript captures and their viewport focus outlines. Narrow enlarged-text layouts grow vertically without clipping or horizontal page overflow. Clean owner-review copies are `.cache/qa/home-success-stories/stories-1280.png` and `stories-mobile-375.png`. These are Chromium screenshot reviews, not actual browser-zoom, screen-reader or owner approval.
- [x] Updated the section specification, README, content inventory, architecture, component/composition trackers and reference mapping. Original info/figma/public files, package declarations, pnpm-lock.yaml, real testimonials and content-readiness gates remain unchanged. The supplied newsection.md SHA-256 remains unchanged; the pre-existing untracked package-lock.json is untouched.
- [ ] Approved member stories, consent, photography, owner visual approval, manual screen-reader/device/browser-zoom review and other browser engines remain pending. Existing legal/domain/hosting/release requirements remain active. No publication is included.

## H01-G homepage Membership & Pricing: 2026-11-17

- [x] Implemented the preceding approved homepage-only preview after Features. Essential, Performance and Elite use the supplied descriptions/four benefits, unconfirmed-price labels, visible illustrative-offering disclosure and Contact actions. Performance uses FEATURED PLAN. The real membership catalog remains empty; the section disappears outside site preview. No billing selector, checkout, membership detail page, photography or dependency is added.
- [x] Manual centered finite Embla navigation starts on Performance, retains focused aria-disabled boundary controls, supports actual swipe, reveals focused cards, observes live reduced motion and updates offscreen inert state. Native no-JavaScript cards/actions remain available. Layered wide frames overlap by 16px without obscuring CTA centers; intrinsic heights and narrow-reading-width rules preserve enlarged text.
- [x] The preceding focused Membership run passed all 12 desktop/mobile cases (30.3 seconds); its source checks passed all 260 unit/component tests, typecheck, lint, formatting, build and export audit. The current H01-H workflow reruns the combined implementation, including the final narrow-layout refinements and wide no-JavaScript regression. Earlier interrupted full-browser work is not claimed as a completed passing run.
- [x] The combined H01-H complete workflow verifies all twelve Membership browser cases against the final narrow-layout refinements and wide no-JavaScript fallback. All 253 applicable site-wide cases are verified across the complete run and four hero-selector reruns described above; all 275 current unit/component tests also pass. Reviewed current phone, enlarged-text and wide fallback captures; clean Membership desktop/mobile copies are in `.cache/qa/home-memberships/`. Features' preceding QA entry below already records its completed 245-unit/231-browser result.
- [ ] Approved actual plans, benefits, fees, terms, photography and owner visual approval remain pending.

## H01-F homepage features carousel: 2026-11-17

- [x] Added the next section after Services and before Story using the six supplied feature titles, descriptions, action labels and introduction from newsection.md. Existing Facilities, Coaches, Membership and Contact pages provide destinations; their content states remain unchanged. No feature-detail routes, catalog records, photographs or dependencies were added.
- [x] Adapted the new reference with a left introduction/numbered position status, two rounded portrait cards with staggered bottom edges, yellow pill links with white circular diagonal arrows and manual looping controls. Smaller layouts stack the introduction and show a partial next card. Reused existing UI primitives and kept business content/card composition on the server.
- [x] Implemented mouse/touch/keyboard navigation, focus retention and immediate focused-card reveal, live reduced motion, inert fully offscreen slides and subscription/attribute cleanup. Before initialization and without JavaScript all six CTA links remain usable in a native snapping row; inactive controls/status are hidden. Features has no automatic rotation timer.
- [x] Initial browser checks found vertical clipping at 200% spaced text: a fixed portrait aspect ratio constrained content height. Isolated the cause in a browser experiment, replaced that constraint with a slide-relative proportional minimum height and enabled intrinsic growth/button wrapping. Diagnostic styles were removed from tests before rebuilding the actual source. Regression checks inspect all card text/link clipping boundaries, loop positions and control/CTA separation.
- [x] Final typecheck, lint, formatting, production build and export audit pass. All 245 unit/component tests across 37 files pass with `--maxWorkers=2`. A prior simultaneous build/default-worker test run hit four five-second timeouts; the final run was isolated with limited concurrency, preserving test thresholds and assertions. All 24 templates and 26 audited HTML files remain, including preview noindex protection.
- [x] The complete Features browser workflow finished successfully before Membership work: **231 passed, 1 intentional viewport skip, 0 failures (232 cases, 11.6 minutes)**. All ten new desktop/mobile Features cases pass, including actual touch swipe, finite content links, six-card looping, control/CTA separation, focus, reduced motion, blocked assets, enlarged text, axe and no JavaScript. Outputs remain under `.cache/qa/home-features/full-final/`; desktop/mobile composition and enlarged-text captures were reviewed. The owned QA server shut down. This finalizes the entry that was left pending when the next planning task began.
- [x] Updated specification, README, architecture, component inventory, composition trackers and reference mapping. Original info/figma/public files, package declarations, pnpm-lock.yaml and content-readiness gates remain unchanged. The supplied newsection.md hash remains unchanged; the pre-existing untracked package-lock.json was left untouched.
- [ ] Photography, feature-detail pages, confirmation of supplied facility claims for public launch, owner visual approval, real screen-reader/device/browser-zoom review and other browser engines remain pending. Existing legal/domain/hosting/release requirements and indexing protections remain active. No publication is included.

## H01-E homepage services carousel: 2026-11-17

- [x] Added the eight owner-approved service titles/subtitles and exact introduction from newsection.md after Why choose us and before Story. Each whole card opens the existing Contact page; no service routes or Programs records were created. Charcoal gradients reserve photography space without fetching remote images.
- [x] Kept server-owned content/card composition and existing primitives. Scoped native-scroll fallback, five-second looping, hover/intersection/document suspension, persistent interaction pause, explicit playback, inert offscreen slides, immediate keyboard-focus reveal and live reduced-motion behavior are implemented without new dependencies.
- [x] Fixed actual clipping under enlarged text: cards now grow intrinsically, usable-width queries reduce columns and narrow cards give their arrow its own row. Replaced Embla's 10ms Tab timing assumption with a section-owned focus-visible callback, preserving pointer drag. Tests distinguish visible fallback-font ink beyond a line box from actual card clipping.
- [x] An initial full browser run caught WCAG 2.1 label-content-name mismatch. Stopped that run, included title/subtitle in each name and added explicit whitespace between their server-rendered elements (the text otherwise joined at the boundary). Added a server-markup regression assertion and WCAG 2.1 A to focused axe tags before rerunning the workflow.
- [x] Typecheck, lint, formatting, all 234 unit/component tests across 34 files, production build and export audit pass. The export audit checks 26 HTML files and preview noindex; all 24 templates remain. Typecheck was rerun after build because an earlier concurrent run raced Next's generated type cleanup.
- [x] All 14 final focused Chromium cases passed: desktop/mobile full-page accessibility across seven key templates, exact service copy/responsive geometry, complete looping/Contact navigation, rotation lifecycle, mouse drag, real touch swipe, keyboard-focus reveal, reduced motion, 200% root text plus text spacing, blocked assets, focused axe and no-JavaScript native scrolling.
- [x] The final complete README Playwright run exited successfully: **221 passed, 1 intentional skip, 0 failures (222 cases, 8.8 minutes)**. The skipped tablet/wide-layout case is already covered by the desktop project. Outputs are under `.cache/qa/home-services/full-final/`; earlier diagnostic runs are retained separately. Home/interior/history header treatment, all route templates, remaining homepage sections, keyboard/mobile dialogs, preview protections and static fallbacks pass. The owned QA server shut down at completion.
- [x] Reviewed normal and enlarged-text screenshots at 320/375/768/1280/1920px, plus the no-JavaScript view. Narrow enlarged-text layouts wrap more often and grow vertically without clipping or horizontal page overflow. Clean previews are `.cache/qa/home-services/services-{width}.png`; enlarged/no-JavaScript versions and test outputs are in the same QA directory.
- [x] Updated specifications, composition documentation and README. Preserved originals in info/figma/public, package declarations and pnpm-lock.yaml. Left the pre-existing untracked package-lock.json untouched. Added only the supplied newsection.md brief to Prettier's existing source-input exclusions so its original bytes are preserved; application/test/docs formatting remains checked.
- [ ] Photography, individual service pages, the second new homepage section, owner visual approval, real screen-reader/device/browser-zoom review and other browser engines remain pending. Global release/content/legal/domain/hosting gates remain active; this task is a local implementation, not a public deployment.

## H01-A3 homepage hero redesign: 2026-11-17

- [x] Implemented the owner-approved Peakfit reference composition in the existing yellow/charcoal palette, keeping the approved local photograph, two-part H1 and supplied location. Replaced the V-cut/vertical ornament with a straight edge and rounded Contact/Membership actions. No new business copy, catalog records, original assets, package declarations or lockfile changes were required.
- [x] The server-composed navigation now passes through a small pathname-aware HeaderFrame. Home-only overlay placement activates after ResizeObserver measurement; changes update the reserved inset. Navigation/unmount cleanup removes the observer and CSS custom property. Interior pages and the no-JavaScript/unsupported-observer Home fallback retain an in-flow header. Existing modal, dropdown and skip-link stacking/focus remain.
- [x] Embedded the four existing counters and exact example disclosure in the hero's statistics slot. Removed the separate band and nested Containers. Container queries select one/two/four columns from usable width and text size. Approved figures replace examples; with preview disabled and no approved figures, neither statistics nor an empty statistics slot is rendered.
- [x] Regression checks cover observer resizing/cleanup, soft navigation/history, CTA destinations, preview policy, no-JavaScript values/navigation, contrast against a white image replacement, responsive geometry, blocked assets, enlarged text and reduced motion. Initial browser checks caught a utility-layer divider override and oversized values in narrow enlarged-text columns; corrected their display ownership and changed the grid to query usable width. Added an explicit empty-slot release-mode regression.
- [x] Final source checks: strict TypeScript, ESLint and all **219 unit/component tests across 31 files** pass. Production build preserves all 24 templates, normalizes 24 Windows segment files and passes the 26-HTML export audit. Matching Chromium v1255 was installed in the ignored workspace-local browser cache using the pinned pnpm 10.34.9 toolchain.
- [x] All six focused desktop/mobile counter cases pass, covering responsive dividers, two-column phone presentation and enlarged-text/blocked-font reflow. The initial sandboxed QA process required explicit cleanup of its own Windows server; the complete regression run uses the required process permissions.
- [x] Complete browser workflow executed all **210 cases**: **207 passed**, one intentional viewport skip, and two failures from the prior zero-border Home-header expectation. Updated that assertion for the new Home-only 1px reference divider and explicitly awaited overlay readiness; **both affected desktop/mobile cases passed on rerun (8.8 seconds)**. All **209 applicable browser cases are verified across these runs**; this is not represented as a single clean full-suite run. Application code and its exported artifact were unchanged by that test-only correction.
- [x] Inspected default and enlarged-text/blocked-asset hero screenshots at **320, 375, 768, 1280 and 1920px**, plus the mobile-project 375px capture. Header/content clearance, photo coverage, controls, counter/divider layout and disclosure reflow are preserved. Copies are retained under `.cache/qa/home-hero-redesign/`, including `hero-1280.png`, `hero-mobile-375.png` and five enlarged-text captures.

Manual screen-reader review, actual browser zoom, other browser engines and owner visual approval remain open. Contact and Membership retain their existing rebuild shells. Existing content, legal, integration, domain/hosting and public-release requirements remain unresolved; no deployment or release approval is claimed.

## Shared 1550px container maximum: 2026-11-16

- [x] Owner requested a 1550px maximum for section content. Changed the shared `--content-max` token to `1550px`; all existing `Container` and direct `layout-container` consumers inherit it, including header, footer, Home and interior shells. Full-width backgrounds and existing 16/24/32px responsive gutters remain unchanged. The maximum stays 1550 CSS pixels when root text is enlarged; gutters still scale with text size.
- [x] Tests first: updated existing geometry assertions and added a real Home check covering all seven section/header/footer containers, narrow screens, 1440/1550px, the 1614px cap threshold and wide 1920/2560px screens. The baseline failed at 1152px instead of 1550px before the token changed. Existing enlarged-text/constrained-parent and no-JavaScript cases also require the new cap.
- [x] The first wider-layout check passed, while the existing hero separation assertion caught the vertical decoration overlapping the heading at 1280px (decoration right edge 40px, heading left edge 32px). Moved only that decoration from 24px to 8px from the viewport edge; the strengthened assertion requires at least 8px separation at six desktop widths. Section widths and text measures are not narrowed to accommodate it.

- [x] Strict typecheck after build, lint, formatting, **217 unit/component tests across 30 files**, production build, matching Chromium availability and the 26-HTML export audit pass. All 24 templates remain. Desktop checks confirm the new maximum and responsive/enlarged-text/constrained-parent/no-JavaScript geometry; the hero clearance regression passes. Inspected the 1920px Home screenshot with consistently aligned section edges.

- [x] Complete browser workflow passes in 4.0 minutes: **206 passed, two intentional viewport/hover skips**. All ten Container cases and both strengthened hero cases pass. Desktop/phone Home screenshots were inspected and copied to `.cache/qa/container-1550/`. Mobile gutters, page overflow, no-JavaScript content, navigation/focus, image/font fallbacks and indexing regressions pass. Content, dependencies and supplied originals are unchanged by this width update. Manual screen-reader, actual browser zoom, other-engine and owner visual approval remain open.

## Why choose us copy refinement: 2026-11-16

- [x] Rewrote all three headings and descriptions by owner request: Certified Training Team, Your Gym in Uttara and Start With a Conversation. Copy retains the owner-supplied trainer count and derives the address/phone from existing site content. No new credentials, programs, services or outcome claims were added.
- [x] Updated the existing exact-copy checks first; the content test failed against the former headings before implementation. Retained validation, escaping, empty-content and placement coverage. Updated real-page browser assertions to the revised text, including enlarged-text/fallback and no-JavaScript checks.
- [x] Changes are confined to content, corresponding assertions and documentation. Card/section components, styles, imagery, routes and counter labels are unchanged. See the current copy contract in [H01-D](specs/H01-D-home-why-choose-us.md).

- [x] Typecheck, lint, formatting, **217 unit/component tests**, production build and 26-HTML export audit pass. All **eight focused desktop/mobile browser cases** pass, including six-width reflow, enlarged/spaced text with failed fonts/images, axe, keyboard behavior and no JavaScript. Inspected updated desktop/phone screenshots: longer descriptions remain readable within the existing cards. Full site browser regressions were not repeated for this content-only edit; the preceding removal run remains recorded below. Manual screen-reader and owner visual approval remain open.

## Features and services removal: 2026-11-16

- [x] Removed this section by owner request. Home again composes Hero → Counter → Why choose us → Story → temporary page inventory, without an extra wrapper or reserved gap.
- [x] Tests first: updated Home placement/absence checks failed twice against the existing section before removal. Removed the dedicated wheel/card/preview modules, sample content, unused schemas, fixtures, feature-only tests and withdrawn specification. Updated README, inventory and rebuild trackers. No dependency or lockfile change was required.
- [x] Regression coverage requires the section and its wheel/card markup to be absent, including when preview is disabled and with JavaScript disabled. Counter/story placement checks require Why choose us and Story to be adjacent. Existing counter values, three Why choose us cards, shared components and original image remain intact.

- [x] Strict typecheck, lint, formatting, **217 unit/component tests across 30 files**, production build, matching Chromium availability and export audit (26 HTML files) pass. Exported Home contains no removed section, card/wheel markup or sample service copy. All 191 protected files match the snapshot from before the section was introduced, including Home composition/content/schema, shared UI, original assets, package declarations and lockfile.

- [x] Full README browser workflow passes in 4.3 minutes: **204 passed, two intentional viewport/hover skips**. Desktop/mobile absence, exact placement and no-JavaScript checks pass. Inspected the unchanged Why choose us screenshots at desktop and phone sizes. No public-launch approval is implied; existing content and visual-review limitations remain.

## H01-D Why choose us: 2026-11-16

- [x] Followed the agreed sequence: card/component/schema tests first, actual ReUI Card 8 installation/adaptation, isolated card verification, section/placement tests, then three-card composition. Initial missing-component/schema failures and missing-section/order failures are recorded in the [specification](specs/H01-D-home-why-choose-us.md).
- [x] Added `@reui` registry configuration and used the requested latest shadcn command through pnpm 10.34.9 (CLI 4.23.0). Dry-run exposed the proposed shared Card overwrite; declined it during installation. Adapted/moved the downloaded pattern into WhyChooseUsCard; no Picsum image, demo route, new dependency, provider or stock module overwrite remains.
- [x] Verified one reusable Certified Trainers card before reusing it for Uttara Location and Talk to Our Team. Content uses the owner-supplied count and original address/phone/photo. One H2 section now sits directly after the counter and before the unchanged story. Updated counter/story regression assertions to verify the new complete order. Empty items render nothing.
- [x] First isolated geometry cases failed at 14px corners instead of 12px; a local radius override resolved the stock-class conflict. All 16 focused browser cases pass: eight isolated card plus eight integrated section cases, with contrast/axe, hover/reduced motion, image/font failure, long/enlarged text, six widths and actual no-JavaScript navigation. Inspected desktop/mobile section screenshots.
- [x] Typecheck, lint, formatting, **217 unit/component tests across 30 files**, production build and export audit (26 HTML files) pass. All 24 templates remain. A before/after audit of 189 existing files finds only the four planned configuration/route/content/schema changes; 185 files, including original assets, stock modules and package/lockfiles, remain unchanged. No public-launch approval is implied.
- [x] Final complete browser workflow passes in 3.4 minutes: **204 passed, two intentional viewport/hover skips**. All sixteen new card/section cases and the revised counter/story placements pass. Final formatting and protected-file checks pass. Desktop/phone review images are retained under `.cache/qa/why-choose-us/`, alongside the original registry source and before/after audit. Completed only H01-D.

Manual screen-reader, actual browser zoom, other engines and final owner visual approval remain open. Missing story/catalog/legal content and release gates remain unresolved; no business claim beyond supplied inputs was invented. Stop after this section.

## Fourth counter value: 2026-11-16

- [x] Added the owner-requested **30+ Certified Trainers** as the fourth item in the existing Home preview counter, recording owner-supplied provenance. Existing example values, disclosures, approved content, preview indexing safeguards and the four-item schema are preserved. No component, dependency or layout change was needed.
- [x] Tests first: updated data/placement assertions and added the exact value/label/source case; three assertions failed before the record existed. All **194 unit/component tests across 27 files** now pass. Lint, typecheck, production build and 26-HTML export audit pass.
- [x] Six focused browser cases pass for four values, exact trainer label, final digit widths, no-JavaScript display and enlarged/spaced text at five widths with blocked fonts and reduced motion. Inspected desktop/mobile screenshots: four columns on desktop, four stacked values and three horizontal dividers on phones.
- [x] Complete README workflow passes, including formatting, matching Chromium availability and the full browser suite: **188 passed, two intentional viewport/hover skips in 3.2 minutes**. All 18 counter cases pass. All 24 templates remain available; packages, lockfile, original assets and indexing safeguards are unchanged. Four-item review screenshots are retained under `.cache/qa/trainer-counter/`.

## Header/hero divider removal: 2026-11-16

- [x] Extended the existing Home join browser case before implementation: require a 0px header bottom border, no header shadow and no hero top border at 320/375/768/1280/1920px. It failed against the old export with 1px instead of 0px.
- [x] Removed only the shared header's `border-b border-input` classes. Charcoal surface, layout, navigation, keyboard focus and hero content are unchanged. All 193 unit/component tests across 27 files pass; production compilation and static generation pass.
- [x] Complete README workflow passes: strict typecheck, lint, formatting, 193 unit/component tests, production build, 26-HTML export audit, matching Chromium check and **188 browser tests passed with two intentional skips in 3.0 minutes**. Both pointer/touch join cases pass at all five widths. Inspected desktop/mobile screenshots: the light separator is gone; navigation and keyboard-focus regressions pass. Copies are retained under `.cache/qa/header-hero-join/`. Dependencies, pnpm lockfile, original assets/content, all 24 templates and indexing guards are unchanged by this refinement.

## Website preview banner removal: 2026-11-16

Removed only the global Website preview section by owner request. The header now leads directly into page content; on Home that is the hero. Counter example-data disclosure, missing-content states and preview indexing/release protections remain active.

- [x] Tests first: two new root-layout cases failed for the existing banner/extra wrapper while the landmark/metadata case and five indexing-policy cases passed. The new browser removal case also failed against the old export because it found one Website preview note instead of zero.
- [x] Removed the PreviewNotice import/mount, unused component and dedicated UI-copy record. Retired its three component cases and four browser cases, replacing them with three root-layout cases and four removal/geometry/navigation/no-JavaScript cases. Updated the all-route and content-state assertions to require absence of this specific banner rather than removing preview protections.
- [x] Typecheck, lint, formatting, all 193 unit/component tests across 27 files, production build, matching Chromium availability and export audit (26 HTML files) pass. All 24 templates remain available. Dependencies, pnpm-lock.yaml, site.preview, noindex/robots/sitemap code, supplied originals and release approvals are unchanged.
- [x] Full browser workflow passed in 2.9 minutes: **188 passed, two intentional viewport/hover skips**, including all eight new banner-removal browser cases. Inspected desktop/mobile screenshots: no yellow Website preview section or empty gap remains between the header and hero. Copies are retained under `.cache/qa/banner-removal/`. All-route, structural-preview/404, skip-link/modal, counter, metadata, robots/sitemap and no-JavaScript regressions pass.

The [S01-A specification](specs/S01-A-preview-notice.md) is marked retired and retains its historical evidence. Current inventory, README and rebuild tracker describe the banner removal. Removing a UI banner does not approve publication or supply missing business/legal content. Manual screen-reader and final owner visual approval remain open.

## H01-C Home counter: 2026-11-16

Completed the counter placement and edge-case fixes only. See [H01-C specification](specs/H01-C-home-stats.md).

- [x] The pre-existing 27 scoped tests passed. Added seven lifecycle/placement cases before production edits: four failed (live reduced motion, missing matchMedia, stale changed-prop text and absent preview counter) and three passed. Added one/four-item and content-separation coverage afterward; all 37 focused unit/component cases are included in the passing full unit suite.
- [x] Owner requested random values. Home now places a clearly labeled example counter directly after the hero and before the story, using 1,200+ example clients, 4.8 example rating and 5+ example years. Examples live in a separate Zod-validated preview record, with an explicit visible notice. They never populate approved statistics, disappear when site.preview is false, and yield to supplied approved data. Preview noindex and unresolved statistics-readiness requirements remain intact.
- [x] CountUp keeps final server/screen-reader text, counts once after intersection, cancels frames/observer/listener on cleanup, responds to live reduced motion and safely handles absent browser APIs and changed values. Animation updates only the decorative span. No new library or public specimen route was added.
- [x] Screenshot review exposed a proportional-reserve/tabular-overlay mismatch: the added browser assertion failed at x=55.89 versus the reserved x=64. Both spans now inherit tabular numerals. Inspected corrected 1280px and 375px counter screenshots, including the V-cut join, dividers, aligned values/labels and readable example notice.
- [x] The initial scoped Chromium run passed all 26 counter/story cases after resolving a Windows sandbox teardown hang by terminating only the verified test-owned static server. Subsequent runs used subprocess-cleanup permission. No development server was stopped.
- [x] First full-browser run: 186 passed, two intentional skips, two failures in the enlarged-text counter check. Diagnosis showed measurements during the foundation's 0.01ms responsive transition guard (temporary zero-width flex items). Waiting two animation frames after resize retains the same overflow assertion; both targeted pointer/touch cases then passed. No foundation styles or accessibility rules were changed.
- [x] Pinned pnpm 10.34.9; typecheck, lint, formatting, 193 unit/component tests across 27 files, production build and export audit pass. Export audit checks 26 HTML files; all 24 templates remain. Matching Chromium availability check passed. Dependency declarations, pnpm-lock.yaml, original inputs/references/assets, real business catalogs and release approvals were not changed by this task.
- [x] Final complete Chromium rerun passed in 3.0 minutes: **188 passed, two intentional viewport/hover skips**, with no failures. All 18 counter cases and eight story cases pass in this full run. Corrected desktop/mobile screenshots are retained under test-results and copied to `.cache/qa/home-stats/`, outside supplied assets/public routes.

Manual screen-reader, actual browser-zoom, other-engine and final owner visual approval remain open. Example figures cannot establish real business claims or public-launch readiness. Other Home sections remain separate tasks.

## Git checkpoint: 2026-11-16

The owner requested pushing the current code. The workspace also contains newer build/export script edits and a Breadcrumbs draft with four component cases and an initial Programs integration. These are included in the checkpoint review; the draft does not complete S02-A or change the eight-of-thirteen verified count. Fresh checks for this exact workspace passed. Its new Home breadcrumb initially broke the older one-link assertion; the updated tests explicitly require both breadcrumb Home and Back to home, including their keyboard order.

The build wrapper now selects webpack by default, while explicit turbo flags select Next's default compiler. Export normalization also creates percent-encoded bracket-path aliases. Review these changes with a fresh production build, export audit and full browser suite.

Original reference/brand-image deletions already present locally are excluded from the commit to preserve supplied originals in Git. Their local working-tree state remains untouched. Generated caches/export/browser reports, environment files and any secondary package-manager lockfile are excluded. This is a source checkpoint, not deployment or release approval.

- [x] Fresh README workflow passed: typecheck, ESLint, final formatting, **113 unit/component tests across nineteen files**, webpack production build, export audit (26 HTML files), matching Chromium check and **135 browser tests passed, one intentional viewport-specific skip in 4.6 minutes**. The ten directly affected content-state/breadcrumb component cases also pass.
- [x] Reviewed 231 staged files and prepared the source checkpoint for origin/main without force. Only the fifteen pre-existing original-reference/brand-image deletions remain unstaged. Code whitespace checks exclude the two byte-preserved upstream Barlow license copies, which contain original trailing spaces. The actual push result is reported after remote verification.

## H01-A2 Home hero design: 2026-11-16

This restyles only the Home hero, to the reference screenshot the owner supplied (an Invictus Fitness hero).

**Owner decisions**

- Headline: the approved tagline plus the name, two-tone.
- Actions: Call and Get directions only.

**What was and wasn't reused from the reference**

- Reused: the layout and style.
- Mapped: green to the brand yellow, and the serif display font to Barlow Condensed.
- Not copied: the reference's slogan and its "since 2009" claim.
- Out of scope: the transparent header, which would be a header task.

**Results**

- [x] **Tests first.** Wrote the [H01-A2 spec](specs/H01-A2-home-hero-design.md), then updated the unit, component and browser tests and recorded failures before changing code:
  - 5 unit/component cases failed;
  - every new hero browser case failed (21 in total including the regressions; one hover case is skipped on touch);
  - the 4 updated header/footer H1-name regressions failed.
- [x] **Shared Button fix.** Hover/active selectors changed from `enabled:` to `not-disabled:` (10 hover, 13 active). Native buttons match identically, and `Button asChild` links now get the variant states. The Button, desktop and mobile navigation, header and footer specs still pass. This completes the slotted-anchor item left open in U01-A.
- [x] **Hero.**
  - Uppercase `type-display` H1 with a white tagline span and a yellow name span. Its accessible name is "One step closer. Crossfit Gym".
  - Location line with a map pin.
  - Two `Button asChild` + `NavigationLink` actions: default variant with an arrow, outline variant with a pin.
  - Uppercase, 14px, bold, 0.12em tracking and a 2px radius.
  - 70% charcoal scrim plus a decorative left gradient; `aria-hidden` vertical name at 1280px and wider; V-cut `clip-path`; at least `min(88svh, 56rem)` tall.
  - Content now has two actions.
- [x] **Fixed during implementation.** These were caught by tests or review:
  - The 2px radius lost to the `rounded-control` token, which `cn` does not merge, so it now uses a `data-[slot=button]` selector.
  - `w-full` would have removed the Container gutters.
  - The vertical name overlapped the H1 at 1024px, so it is now shown at 1280px and wider, with a no-overlap assertion.
- [x] **Focused results.** All 17 applicable hero cases pass. They cover:
  - Barlow uppercase start-aligned H1, aligned to the container;
  - white and yellow spans, with worst-case scrim contrast of at least 4.5:1 for white and at least 3:1 for the large yellow name;
  - full-page axe;
  - button typography, radius, fills, borders, icons and targets of at least 44px;
  - primary hover `rgb(230, 184, 0)` and outline hover fill on desktop;
  - vertical name at 1280px but not at 1024px or 375px;
  - polygon clip-path and minimum height, with the H1 inside the first viewport;
  - image size and that it covers the hero;
  - reflow at 320–1920px;
  - keyboard Call → Directions with the 3px ring;
  - blocked image, forced colors and reduced motion;
  - no JavaScript.
- [x] **Full README workflow passed:** typecheck, ESLint, Prettier check, **156 unit/component tests across 23 files**, production build, export audit of 26 HTML files, and **170 browser tests passed with 2 intentional skips**.
- [x] **Visual check.** Compared screenshots at 1920×946, 1280×900 and 375×812, plus a crop of the V-cut edge, with the reference. Saved outside the repository.
- [ ] **Still open.** Owner approval of the visual design; a transparent header over the hero (a separate header task if wanted); screen-reader review and other browser engines.

## H01-B Home story: 2026-11-16

Completed only [H01-B Home story](specs/H01-B-home-story.md), the second Home section.

- [x] **Inputs reviewed.** `about.story` is `null`, and "Homepage and About copy" is not approved. The `Screenshot_1.png` reference ("Why Invictus?") relies on unverified medical-spa and nutrition claims, so none of its copy, claims or icons were reused.
- [x] **Tests first.** Wrote the spec, then 11 unit cases, 5 component cases and a browser spec. Before implementation, the unit cases failed (no `aboutSchema` or `homeStory`), the component file could not resolve `home-story`, and the browser spec failed at collection for the same reason.
- [x] **Content.**
  - Added `aboutSchema` (nonblank text or `null`; nonblank values) and parsed `about.ts` through it, keeping the same shape. Nothing else imported `about`.
  - Added `homeStorySchema` and `homeStory`, derived from `about.story`. The UI copy is the heading "Our story" (matching the navigation label), the link "More about Crossfit Gym" → `/about`, and the missing-state title and description.
- [x] **Component.**
  - Added the Server Component `src/features/home/home-story.tsx`. A missing story shows ContentState, and the region is named by that state's H2.
  - A supplied story shows a SectionHeading H2, paragraphs split on blank lines (empty fragments dropped, text escaped, 65ch measure) and a NavigationLink to About.
  - ContentState gained an optional pass-through `headingId`.
- [x] **Home integration.** Mounted directly after the hero and before the temporary inventory.
- [x] **Focused results.** All new cases pass.
  - **Real Home:** order hero → story → inventory; the missing-state text; no links; Barlow H2 in charcoal; one H1; no animation; full-page WCAG 2.x A/AA axe; reflow at 320/375/768/1280/1920px; present without JavaScript.
  - **Fixture injected into another page:** the 65ch measure, long unbroken words reflowing at every width, axe, the 3px focus ring on the About link, and Enter opening About.
  - The existing ContentState, SectionHeading, journeys and accessibility specs still pass.
- [x] **Full README workflow passed:** typecheck, ESLint and Prettier check; **157 unit/component tests across 23 files**; production build; export audit of 26 HTML files; **167 browser tests passed with one intentional skip**.
- [x] **Visual check.** Reviewed the section at 1280px and 375px in screenshots saved outside the repository. It is the same bordered missing-content panel used on Programs, centered and wrapping cleanly.
- [ ] **Still open.** Real story text needs owner approval, and the section needs manual design review.

Next task: **H01-C Home discovery links only**: links to the real Programs, Coaches and Membership routes, without claims about their content.

## H01-A Home hero: 2026-11-16

Completed only [H01-A Home hero](specs/H01-A-home-hero.md), the first Home section. The owner chose to start Home before pre-Home items 10–13. Those items remain pending.

**Owner decisions**

- Use `public/images/brand/hero_section.png`; the owner confirmed it represents the gym.
- Tagline-only copy, from approved `site.ts` values. No "Welcome to" eyebrow and no unapproved marketing line.
- No email action, because no email address was supplied.

**Results**

- [x] **Tests first.** Wrote the spec, then:
  - 14 content/schema unit cases;
  - 7 component cases;
  - 7 browser cases per project.
    All failed before implementation: the content and feature modules were missing, and there was no hero region.
- [x] **Updated regressions.** The header and footer no-JavaScript cases now expect the Home H1 to be "Crossfit Gym". Both failed against the old "Home" H1, while the other 12 header/footer cases still passed.
- [x] **Corrected one test before running it.** It treated the preview note's wrapper as Home's first section. The note's `role="note"` sits inside a wrapper `div`, so the test now skips the main child that contains the note.
- [x] **Content and image:**
  - Added `homeHeroSchema` (nonblank text; 1–3 actions limited to `tel:+`, `https:` or root-relative destinations) and `src/content/home.ts`, derived from `site.ts`.
  - Encoded `home-hero.webp` at the same 1672×941 size with sharp 0.35.5 (WebP quality 80, effort 6): 229,154 bytes, down from 2,545,135.
  - Recorded provenance, hashes and the owner's approval in `home-hero-source.json`. The original PNG is unchanged.
- [x] **Component.** Added the Server Component `src/features/home/home-hero.tsx`:
  - a charcoal section named by its H1, using `type-display`;
  - a cover image loaded eagerly with high priority;
  - an `aria-hidden` 80% charcoal overlay;
  - the tagline, and the location with a hidden map-pin icon;
  - a list of NavigationLinks: a yellow primary Call action, then outlined Directions and Contact actions.
- [x] **Home integration.** Mounted the hero on Home first after the preview note. Removed the old "Home" H1 and kept the temporary inventory and rebuild note below. Metadata is unchanged.
- [x] **Focused results.** All 35 new cases pass. They cover:
  - display typography;
  - worst-case contrast of at least 4.5:1 over white and black pixels;
  - full-page WCAG 2.x A/AA axe;
  - targets of at least 44px and exact destinations (Contact exports as `/contact/`);
  - the image's natural size and that it covers the hero;
  - the H1 inside the first viewport at 375×812 and 1280×900;
  - reflow of a long title at 320/375/768/1280/1920px;
  - keyboard order Call → Directions → Contact with the 3px focus ring;
  - a blocked image (charcoal fallback), reduced motion, forced colors and no JavaScript.
- [x] **Unrelated flake fixed.** The full browser run exposed an existing flaky foundation test, F01-D04, on `/about/`. Chromium reported the 200ms transition as 199.99997ms, which failed 3 of 20 targeted runs. The measured duration is now rounded to whole milliseconds without changing what the test checks, and the spec then passed 100 of 100 repeated runs.
- [x] **Full README workflow passed** with pnpm 10.34.9:
  - typecheck, ESLint and Prettier check;
  - **144 unit/component tests across 21 files**;
  - production build;
  - export audit of 26 HTML files;
  - **159 browser tests passed with one intentional skip** (160 total).
- [x] **Visual check.** Reviewed 1280×900 and 375×812 screenshots, saved outside the repository. The text is crisp over the scrim, the primary action stands out, and on mobile the actions wrap to two rows with everything above the fold.
- [ ] **Still open.** Manual design approval against the reference, screen-reader review, other browser engines and the remaining Home sections.

Next task: **H01-B Home introductory story only**. `about.story` is not supplied yet, so it starts from the explicit missing-content state.

## S02-A breadcrumbs: 2026-11-16

Completed only [S02-A Breadcrumbs](specs/S02-A-breadcrumbs.md), item 9 of the [13-item pre-Home sequence](pre-home-checklist.md). **Nine verified, four remain.** S02-B page introduction is next.

- [x] **Spec first.** Tightened the specification with current/ancestor/empty/single-item rules and a new S02-A06 edge-case row.
- [x] **Component tests before code.** Expanded the draft's four component cases to fourteen; one failed against the draft. The draft marked a non-last unlinked ancestor `aria-current="page"`, which created two current pages.
- [x] **Corrected test assumption: trailing slashes.** The trailing-slash href cases initially failed because Next Link outside a build drops trailing slashes. The repo's routes and navigation content use the unslashed form (`/programs`), and the export adds the slash. The tests and spec now use the `routes.ts` form; this was a test correction, not a component change.
- [x] **Browser tests before code.** Added ten Playwright cases across desktop and mobile. Six failed against the draft:
  - Ancestor links inherited the global `a { color: var(--link) }` (`rgb(23,23,23)`) instead of the muted foreground.
  - Long unbroken labels overflowed at 320px.
  - A case-sensitive title assertion was a test error. It was corrected to match the real title "Training programs | Crossfit Gym".
- [x] **Implementation, three-way per item:**
  - linked ancestor: Next Link with `prefetch={false}` and a muted underlined link;
  - unlinked ancestor: plain text with no `aria-current`;
  - last item: current page, with the stock `role="link"`/`aria-disabled` removed. An `href` on the last item is ignored.
- [x] **Edge cases.** Empty trails render nothing, separators are keyed by position, and the `cn` import is aligned with other modules.
- [x] **Overflow fix.** The stock list's `wrap-break-word` overrode the inherited `overflow-wrap: anywhere`, so each `<li>` now sets `[overflow-wrap:anywhere]` and `min-w-0`. The reflow assertion now reports the offending nodes. SVG icons are exempt only from the overflow-style check, because the browser's default stylesheet gives every `<svg>` `overflow:hidden`; their bounds are still checked.
- [x] **Focused results.** All 14 component cases and all 10 focused browser cases pass. They cover:
  - Inter 14px, the muted underlined ancestor links and the foreground current page;
  - two hidden chevrons, with exactly three list items in the accessibility tree;
  - fixture-scoped WCAG 2.x A/AA axe;
  - reflow at 320/375/768/1280px;
  - the skip link followed by Tab reaching Home with the 3px global focus outline, and Enter navigating Home;
  - Programs integration: one H1 after the breadcrumb inside Container, ContentState, title and noindex preserved;
  - the no-JavaScript breadcrumb at 320px.
- [x] **Full README workflow passed** with pnpm 10.34.9 via `npm.cmd exec`:
  - typecheck, ESLint and Prettier check;
  - **123 unit/component tests across nineteen files**;
  - production build and export audit;
  - **145 browser tests passed with one intentional desktop-only journey skip on mobile** (146 total, 2.4 minutes).
- [x] **Environment.** Matching Chromium 1255 was installed into the git-ignored `.cache/ms-playwright`, because the user-level cache only held build 1243.
- [x] **Files changed.** The breadcrumb component, its tests and this documentation only. The Programs page source is unchanged (it already supplied `Home > Programs`). Dependencies, lockfile, content, tokens, stock UI modules, `info/` and `figma/` are untouched.
- [ ] **Still open.** Manual visual approval, screen-reader review, other browser engines and other interior-page integrations remain open. Other pages receive breadcrumbs in their own section tasks.

Next task: **S02-B page introduction only**, with its own specification and tests first.

## S03-B section heading: 2026-11-16

Completed only [S03-B SectionHeading](specs/S03-B-section-heading.md), item 8 of the [13-item pre-Home sequence](pre-home-checklist.md). **Eight verified, five remain.** S02-A breadcrumbs is next.

- [x] Wrote the focused design/specification and acceptance/test/task matrix, then tests first. All six new component cases failed for missing heading/description/ID behavior while the six existing content-state cases passed. The initial browser specimen failed with zero of six expected headings.
- [x] Added a Server Component for an H2 and optional nonblank description, logical start/center alignment and optional caller-owned heading ID. It adds no H1, action, generated content/ID, live region, focus stop, provider, state or dependency. Reused it in ContentState center mode inside installed shadcn Empty. Existing page files, copy and data conditions remain unchanged.
- [x] Six new component cases and all six content-state component cases pass. Caller IDs label separate parent regions; missing/empty/whitespace descriptions omit empty paragraphs, and React escapes literal markup.
- [x] All sixteen focused browser cases pass in 16.4 seconds across pointer/touch projects: eight heading cases and eight existing content-state cases. They verify foundation typography/semantic colors on three surfaces, 8px gap, 65ch body measure, transparent wrapper, start/center and RTL alignment, long/unbroken content and doubled/spaced text at 320/375/768/1280/1920px. Full-page WCAG-tag axe passes without disabled rules.
- [x] Inspected 375px/1280px design specimens. Saved local review copies outside business assets/public routes. Programs retains its H1, accurate content-state copy/card geometry, recovery, noindex and main landmark. Blocked fonts, reduced motion, forced colors, skip/onward keyboard focus and no-JavaScript content/navigation pass. Manual approval remains open.
- [x] Typecheck, ESLint, 109 unit/component tests across eighteen files, production build, matching Chromium check and export audit pass. Build normalized 24 Windows segment files; export audit checked 26 HTML files.
- [x] Audit captures 169 existing files: 168 unchanged; ContentState is the only existing-source integration change. The new heading/tests/spec are additions. Original inputs/assets/references, page routes, catalogs/copy, tokens, stock modules, flags/approvals, SEO configuration, dependencies and lockfiles remain unchanged. UI/layout/shared counts are 64/seven/four.
- [x] Complete browser regressions and final formatting/documentation checks. Scoped heading and content-state Playwright runs, prettier formatting and export verification passed cleanly.
- [ ] Manual screen-reader/browser-zoom review, other engines, missing-reference visual approval and release QA remain open. Root-font enlargement is supplementary reflow evidence. Other section integrations and page introductions remain separate; successful checks do not approve launch.

Next task: **S02-A breadcrumbs only**, with its own specification and tests first.

## S03-A container: 2026-11-16

Completed only [S03-A Container](specs/S03-A-container.md), item 7 of the [13-item pre-Home sequence](pre-home-checklist.md). **Seven verified, six remain.** S03-B section heading is next.

- [x] Wrote the focused specification, acceptance/test/task matrix and tests first. Both component cases initially failed for absent children/ref behavior. The browser integration case failed because Programs' outer section measured 288px at a 320px viewport instead of full width.
- [x] Added one native div Server Component using the existing layout-container role and installed cn utility. Native attributes/React 19 ref and consumer classes are forwarded. No client directive, hook, provider, state, variant, polymorphic API, generated content, implicit semantic/focus role or dependency was added.
- [x] Programs is the first consumer: its section owns full width and existing vertical spacing; Container owns the inner horizontal constraint. H1, content-state condition/copy, recovery, metadata, landmarks and route remain. Other direct CSS consumers and later page sections are unchanged.
- [x] Both component cases and all eight focused browser cases pass. Browser checks cover exact widths/centering at 320/375/767/768/1023/1024/1280/1920px, three surfaces, transparent wrapper, caller grid/gap/padding, constrained RTL grid parent, long unbroken text and doubled/spaced text. No clipping was introduced. Inspected 375px/1280px Programs specimens; visual approval remains open.
- [x] Full-page WCAG-tag axe, blocked fonts, reduced motion, forced colors, skip/onward recovery focus and no-JavaScript content/navigation pass. No accessibility rule was disabled or assertion weakened. Root-font enlargement is supplementary reflow evidence, not actual browser-zoom review.
- [x] Typecheck, ESLint, 103 unit/component tests across seventeen files, production build, matching Chromium check and export audit pass. Build normalized 24 Windows segment files; export audit checked 26 HTML files. All eight scoped browser cases passed in 24.2 seconds.
- [x] Audit captures 167 existing files: 166 unchanged; Programs route is the only existing-source integration change. New wrapper/tests/spec are additions. CSS tokens, stock modules, original inputs/assets, catalogs, flags/approvals, SEO configuration, dependencies and lockfiles are unchanged. UI/layout/shared counts are 64/seven/three.
- [x] Complete README workflow passes, including final formatting and full browser regressions: **127 passed, one intentional viewport-specific skip in 4.4 minutes**. All eight new container cases and existing route/header/footer/navigation/content-state/foundation/control/indexing regressions pass. Documentation validation resolved 178 local references.
- [ ] Manual screen-reader/browser-zoom review, other engines, absent-reference visual approval and release QA remain open. Other container consumers and page sections remain separate. Successful checks do not approve launch.

Next task: **S03-B section heading only**, with its own specification and tests first.

## S01-B content states: 2026-11-16

Completed only [S01-B content states](specs/S01-B-content-states.md), item 6 of the [13-item pre-Home sequence](pre-home-checklist.md). **Six verified, seven remain.** S03-A container is next.

- [x] Wrote the focused contract, requirement/test/task matrix and tests first. Five of six initial component cases failed for missing presentation/integration; the populated-catalog compatibility case passed. The initial browser integration case failed for the absent heading/explanation.
- [x] Added a static Server Component using installed Empty/Header with a real H2 and plain paragraph. Required title/description props share the missing/empty/unavailable structure; there is no variant, action, live region, focus target, arbitrary children or client state. Stock Empty source remains unchanged.
- [x] Added a Zod-validated Programs UI-copy record and replaced only its real empty-catalog placeholder. It describes missing approved website inputs without claiming the gym has no programs. An approved-record test fixture suppresses the state and retains the unfinished populated presentation's rebuild message. Other pages/consumers remain separate.
- [x] Six component/route cases pass. Eight scoped browser cases pass across pointer/touch projects in 15.1 seconds. They cover real-page H1/recovery/metadata/noindex, skip and onward keyboard focus, no-JavaScript recovery, font failure, reduced motion and forced colors.
- [x] Light/yellow/charcoal semantic paints, 12px card radius, 24px padding, Barlow Condensed 600 heading and Inter 400 16px/1.6 body pass. Reflow checks include long unbroken fixture text and normal/doubled/spaced text at 320/375/768/1280/1920px. Full-page WCAG-tag axe passes without disabling rules. Inspected desktop/mobile specimens; visual approval remains open.
- [x] Typecheck, ESLint, all 101 unit/component tests across sixteen files, build, matching Chromium check and export audit pass. Build normalized 24 Windows segment files; export audit checked 26 HTML files. Final browser/format results are recorded below.
- [x] Protected-file audit captures 164 existing files: 163 unchanged; Programs route is the sole existing-source integration change. New component/content/tests are additions. Original inputs/assets, catalogs, flags/approvals, SEO/configuration, stock modules, dependencies and lockfiles remain unchanged. UI/layout/shared counts are 64/seven/two.
- [x] Complete README workflow passes, including final formatting and full browser regressions: **119 passed, one intentional viewport-specific skip in 4.2 minutes**. All eight new content-state cases and existing route/header/footer/navigation/foundation/control/indexing regressions pass. Documentation validation resolved 168 local references.
- [ ] Manual screen-reader/browser-zoom review, other browser engines, missing-reference visual approval and release QA remain open. Other state integrations and populated catalog presentation are not delivered by this task. Successful checks do not approve public launch.

Next task: **S03-A container only**, with its own specification and tests first.

## S01-A preview notice: 2026-11-16

Completed only [S01-A preview notice](specs/S01-A-preview-notice.md), item 5 of the [13-item pre-Home sequence](pre-home-checklist.md). **Five verified, eight remain.** Content states remain the next task.

- [x] Wrote the focused contract/matrix, component, indexing and browser cases first. Initial results: two component failures for missing note behavior, one hidden-state compatibility pass and five existing indexing-policy passes. All four desktop browser cases failed for the absent notice.
- [x] Added a Server Component at the beginning of main, gated directly by the existing site.preview flag, and a Zod-validated UI-copy record. It reuses installed Alert/Title/Description with an explicitly named static note role. No extra heading, focus target, live region, dismissal control, provider or local state was introduced.
- [x] Three component cases cover visible/hidden/subsequent-render states. Five configuration cases verify preview/indexability/HTTPS guards, metadata/robots/sitemap behavior and structural-preview isolation. False visibility is tested with indexing explicitly disabled; it does not imply release approval.
- [x] Real Home, structural detail and 404 checks verify notice order inside main, one H1, page rebuild messages and noindex. All-route assertions require the note while preserving header/footer/main/recovery coverage. Skip and onward keyboard focus, header-modal isolation/release and no-JavaScript navigation pass.
- [x] Browser checks caught the stock Alert radius and title weight overriding the intended roles. Scoped token/semibold overrides fix these without changing stock source or weakening assertions. Final styling cases pass in both pointer/touch configurations.
- [x] Normal and doubled/spaced text fit at 320/375/768/1280/1920px. Yellow/dark colors, boundary, 8px radius, Inter 600 title, 16px/1.6 Inter 400 body, full-page WCAG-tag axe, blocked fonts, reduced motion and forced colors pass. Inspected desktop/mobile specimens.
- [x] Unit/component suite: 95 passed across fifteen files. Build normalized 24 Windows segment files and export audit checked 26 HTML files. Matching Chromium availability check completed; final quality workflow result is recorded at closure.
- [x] Complete README workflow passed: typecheck, ESLint, final formatting, unit/component tests, build, export audit, matching Chromium check and full browser tests. Browser result: **111 passed, one intentional viewport-specific skip in 4.5 minutes**, including all eight notice cases and existing route/header/footer/navigation/foundation/control/indexing regressions.
- [x] Audit captures 162 existing files: 161 unchanged, with root-layout integration as the sole existing-source change. New component/content/tests are additions. Existing flags, approvals, SEO/configuration, business data, original inputs/assets, stock UI modules, dependencies and lockfiles remain unchanged. UI/layout counts remain 64/seven; shared now has one rebuilt module.
- [ ] Manual screen-reader/browser-zoom review, other engines, missing-reference visual approval and release QA remain open. The actual export remains preview; hidden/public-mode behavior is tested with isolated configuration fixtures. Successful checks do not approve launch.

Next task: **S01-B content states only**, with its own specification and tests first.

## L03-A footer: 2026-11-16

Completed only [L03-A footer](specs/L03-A-footer.md), item 4 of the [13-item pre-Home sequence](pre-home-checklist.md). **Four verified, nine remain.** Preview notice is next; no page section was rebuilt.

- [x] Wrote the focused specification/matrix and content/component/browser cases first. All eleven initial unit/component cases and four desktop browser cases failed for missing validation/content/footer behavior before implementation.
- [x] Added a Server Component Footer after main on every exported route and the custom 404. It reuses BrandLink/NavigationLink and the original four groups/15 destinations. Existing all-route checks now require one contentinfo landmark while preserving banner/main, H1, rebuild notice, recovery, metadata and indexing checks.
- [x] Added `src/content/footer.ts` as a validated derivation of existing site values. Source address, displayed/normalized phone, directions, Facebook and Instagram are preserved. Validation rejects empty address, malformed telephone, non-HTTPS/duplicate social channels and unknown/preview legal destinations.
- [x] Rendered native telephone/social/directions links, registered Privacy/Terms destinations and explicit missing-hours/unapproved-legal notes. No email, timetable, service, newsletter or copyright claim was invented. External Facebook selection is intercepted by the browser test; no phone call or social contact is placed.
- [x] Real App Router Programs/Privacy/Terms transitions preserve a document sentinel and noindex metadata. A JavaScript-disabled browser verifies all 22 footer links, legal navigation, availability notes and Home recovery.
- [x] Both normal and doubled/spaced text fit at 320/375/768/1280/1920px. Intrinsic columns, 44px targets, focus clearance and actual Tab order pass. Header modal isolation hides/releases the footer. Inspected desktop, mobile and enlarged specimens; missing-reference visual approval remains open.
- [x] Full-page WCAG-tag axe, blocked font/mark behavior, reduced motion and forced colors pass. All eight focused footer browser cases passed in 31.8 seconds; no accessibility rule or behavior assertion was removed.
- [x] Complete README workflow passed: typecheck, ESLint, final formatting, **87 unit/component tests across thirteen files**, build, export audit, matching Chromium check and browser tests. Build normalized 24 Windows segment files; audit checked 26 HTML files.
- [x] Full browser suite: **103 passed, one intentional viewport-specific skip in 3.7 minutes**, including existing header/navigation/foundation/control/route/indexing regressions.
- [x] Protected-file audit captures 160 existing files: 159 unchanged, with root layout integration as the sole intentional existing-source change. All supplied inputs/assets, existing business content, packages/lockfiles and stock UI modules remain unchanged. New footer content/component/tests are additions; UI count is 64 and layout count is seven.
- [ ] Remote social availability and a Maps pin were not verified; directions use the existing address-search URL. Manual screen-reader/browser-zoom review, other engines, missing-reference visual approval, approved legal text and release QA remain open. Passing checks do not approve launch.

Next task: **S01-A preview notice only**, with its own specification and tests first.

## L01-B header assembly: 2026-11-16

Completed only [L01-B header assembly](specs/L01-B-header-assembly.md), item 3 of the [13-item pre-Home sequence](pre-home-checklist.md). **Three verified, ten remain.** The root layout now mounts the real header; footer is next.

- [x] Wrote the focused contract/matrix and initial two composition/three browser cases before implementation. All failed for the missing banner/controls. A further desktop component regression failed for stale open state before the responsive fix.
- [x] Composed BrandLink and both existing server navigation wrappers in a Server Component Header. Root order is first-tab skip link, banner and focusable main. No business data, page section, route definition, provider or dependency was added.
- [x] Updated all-route checks to require one banner/main and preserve one H1, rebuild notice, no unrelated UI, recovery, metadata/indexing and 404 behavior. Isolated navigation checks now select their own fixture roots instead of counting real header controls.
- [x] Real header checks pass at 320/375/768/1023/1024/1280/1920px and with doubled/spaced text. Browser testing caught brand compression; final layout wraps with readable controls. Inspected desktop, mobile and enlarged screenshots; final reference/visual approval remains open.
- [x] First-Tab skip is visibly hit-tested above the header. Native focus order, open/closed breakpoint handoff to main, stale desktop dismissal, modal lock/isolation cleanup and leaving outside focus unchanged pass. A shared hook preserves focus ownership through CSS-driven blur before the media event, without global state.
- [x] Actual App Router links, same-page dismissal, history reset, detail current cues and brand Home navigation pass in pointer/touch configurations. A document sentinel persists across soft navigation and history. A JavaScript-disabled browser also verifies server brand/Home and page recovery; menus still require JavaScript.
- [x] Full-page WCAG-tag axe checks, charcoal header/light portal semantics, target/focus geometry, font/mark request failure, reduced motion and forced colors pass. No accessibility rule or assertion was removed to fix implementation failures.
- [x] All 76 unit/component tests passed across eleven files. Eight focused header browser cases passed in 21.0 seconds. Full browser suite: **95 passed, one intentional viewport-specific skip in 3.2 minutes**, including all existing regressions.
- [x] Full README workflow passed: typecheck, ESLint, final formatting, unit/component tests, production build, export audit, matching Chromium check and browser tests. Build normalized 24 Windows segment files; export audit checked 26 HTML files.
- [x] Audit captures 156 existing files: 153 unchanged; intentional changes are root layout integration/skip stacking and coordination in the two navigation clients. Original inputs/assets, catalogs, packages/lockfiles and stock shadcn modules remain unchanged. UI module count remains 64; layout count is six.
- [ ] Full manual screen-reader/browser-zoom review, other engines, absent-reference visual approval and release QA remain open. Footer/preview notice/page sections remain separate. Successful checks do not approve public launch.

Next task: **L03-A footer only**, with its own specification and tests first.

## L02-B mobile navigation: 2026-11-16

Completed only [L02-B mobile navigation](specs/L02-B-mobile-navigation.md), item 2 of the [13-item pre-Home sequence](pre-home-checklist.md). **Two verified, eleven remain.** Header assembly is next; both navigation variants remain isolated.

- [x] Wrote the focused specification, acceptance/task matrix, component and actual-source browser cases before implementation. All 12 initial component cases failed for missing Menu behavior.
- [x] Added a server data wrapper and small client modal boundary using installed shadcn Dialog root/trigger/portal/close, Radix modal content and adapted Button/NavigationLink. Preserved the four groups and 15 existing destinations without editing business content.
- [x] Shared the existing canonical-path/closest-ancestor matcher with desktop navigation. Twelve mobile and thirteen desktop component cases pass, including current semantics, pathname reset and native selection behavior.
- [x] Browser checks pass for named modal, initial focus, trapped Tab/Shift+Tab, Escape/close/backdrop focus restoration, scroll lock/release, background isolation, pathname-context reset and navigation to Contact.
- [x] Mobile-only visibility and desktop cleanup pass at 320/375/768/1023/1024/1280/1920px. Short viewport and doubled/spaced text preserve access. Initial browser checks caught an enlarged-text failure; a compact, accessibly named X control fixed it without weakening assertions. Inspected normal/enlarged specimens and confirmed title/body geometry.
- [x] All three trigger surfaces, explicit light portal, target sizes/radius/focus and open/closed full-page WCAG-tag axe checks pass. Blocked fonts, reduced motion and forced-colors operation pass. No accessibility rule was disabled.
- [x] Full README workflow passed: typecheck, lint, formatting, 73 unit/component tests across ten files, build, export audit and matching Chromium check. Build normalized 24 Windows segment files; audit checked 26 HTML files.
- [x] Full browser suite: 87 passed, one intentional viewport-specific skip in 3.0 minutes, including all eight mobile cases. Existing route, metadata/indexing and desktop/foundation/control checks remain passing.
- [x] Audit captured 147 existing files: 146 unchanged; the sole intentional change extracts desktop current-route matching into a shared helper. Packages/lockfiles, original inputs/assets, routes and stock shadcn source remain unchanged. No public fixture route or new dependency/provider.
- [ ] Real header mounting/App Router soft navigation and responsive focus composition, manual zoom/screen-reader review, other engines and final visual approval remain open. No mobile visual reference was available. This is not launch approval.

Next task: **L01-B header assembly only**, with its own specification and tests first.

## L02-A desktop navigation: 2026-11-16

Completed only [L02-A desktop navigation](specs/L02-A-desktop-navigation.md), item 1 of the [13-item pre-Home sequence](pre-home-checklist.md). Twelve items remain; mobile navigation is next. The component stays isolated until header assembly.

- [x] Wrote content/component and real client browser acceptance cases first. Initial results: 19 failing unit/component cases, one passing data-compatibility case and all three desktop browser cases failing for missing behavior. Added three focused entry/Escape/outside/selection regressions before changing the disclosure composition.
- [x] Added server-side Zod validation for groups/labels, canonical internal targets, duplicates and route/approved-location relationships. Verified all four original groups and 15 labels/destinations remain in order. No preview record or catalog data was added.
- [x] Implemented a Server Component data wrapper and small client boundary using the existing pathname hook, one local open-group state and installed shadcn Collapsible/Button/NavigationLink. Exact/closest-section semantics, current-section description, pathname reset, Enter/Space, Arrow Down, Escape focus return and outside/selection dismissal passed.
- [x] Browser review exposed the initially selected NavigationMenu's hidden focus proxy. The final Collapsible composition passes the unchanged axe scan and real first-link Shift+Tab/Tab sequence. No accessibility rule or contrast threshold was disabled; stock library source is unchanged. The test-only outside control was positioned clear of the dropdown.
- [x] All 61 unit/component tests passed across nine files, including 23 scoped navigation cases and all existing regressions.
- [x] All six scoped browser cases passed in 54.3 seconds across desktop pointer and wide touch configurations. Tests cover actual interactive source, real Next pathname context, exact/detail destinations, navigation to Contact, current cues, targets/radii/type, three-surface open states, focus clearance and sampled axe.
- [x] Desktop visibility/keyboard exclusion and reflow passed at 320/375/768/1023/1024/1280/1920px, plus doubled/spaced text. Blocked fonts used actual system fallback; reduced motion and forced-colors keyboard operation passed. Inspected both wide-screen specimens; mobile navigation remains unimplemented.
- [x] TypeScript, ESLint, final formatting, production build and export audit passed. Build normalized 24 Windows segment files; export audit checked 26 HTML files. Matching Chromium availability check completed. The browser fixture uses installed Next/TypeScript tooling and ignored bundles, with no public fixture route or added dependency.
- [x] Full browser suite: 79 passed, one intentional viewport-specific skip in 2.4 minutes. Existing routes, unknown-slug 404s, metadata/indexing, fonts/colors/typography, Button/NavigationLink/BrandLink, layout/motion and sampled accessibility remain passing.
- [x] Before/after audit confirms all 142 protected existing route/component/style/content/config/input/asset/package files unchanged; navigation source differs only by the validation import/wrapper, with identical data values/order. Existing inputs, assets and lockfiles remain preserved.
- [ ] Real header mounting/App Router soft-navigation composition, full manual zoom/screen-reader review, other engines and final visual approval remain open. Isolated client fixtures do not certify complete shell composition or public launch.

Next task: L02-B mobile navigation only, with a focused specification and tests first.

## L01-A BrandLink: 2026-11-15

Completed only [L01-A BrandLink](specs/L01-A-brand-link.md). It stays isolated until header assembly because the route shells contain no brand placeholder. Menus, header/footer assembly and other page work remain separate.

- [x] Wrote two component tests and three browser cases first. Both component cases and all three desktop baseline cases failed for missing naming/image contracts. A later failing unit assertion caught the hidden Home cue joining the name without a space; an explicit separator fixed it.
- [x] Composed NavigationLink with a decorative local Next Image and the real visible gym name. The validated content record derives the name from site.name and fixes the Home destination; no provider, route-matching state, business record or new package was added.
- [x] Reviewed both supplied PNG candidates and the original info/logo.jpg. Selected the clean white-background source; the transparent candidate has visible colored residue. The full-square 192px WebP derivative is 2,604 bytes versus the 911,067-byte source. Source/output hashes and encoder settings are recorded; originals remain byte-identical. Favicon and unrelated cover/social-image references remain pending.
- [x] All 38 unit/component tests across seven files passed, including two new brand cases and existing regressions. A test-only unsupported Testing Library option was corrected before the final production build/typecheck.
- [x] All six scoped desktop/mobile browser cases passed. Tests verify local image decode/export bytes/provenance, native Home navigation, real visible/accessibly named identity, three-surface contrast/states, Inter metrics, 44px image, >=60px normal target, radius, keyboard focus clearance and sampled axe.
- [x] Normal and failed-asset identity reflow passed at 320/375/768/1280/1920px. Doubled/spaced fallback text reflow, blocked images, actual system font fallback, reduced motion and forced-colors keyboard operation passed. Inspected desktop/mobile actual-component specimens and the encoded mark.
- [x] TypeScript, ESLint, final formatting, production build and export audit passed. Build normalized 24 Windows segment files; audit verified 26 HTML files. Matching Chromium availability check completed.
- [x] Full browser workflow: 73 passed, one intentional viewport-specific skip in 2.9 minutes. Existing route, 404, metadata/indexing, font, color, typography, Button, NavigationLink, layout/motion, keyboard and sampled accessibility regressions passed.
- [x] Before/after hashes confirm all 137 captured existing route/content/style/component/input/asset/package/config files unchanged. All 24 templates remain in scope. Test fixtures are isolated browser DOM; no demonstration page, header or global layout change was added.
- [ ] BrandLink hydration and placement in the real header, full manual zoom/screen-reader review, other engines and final visual approval remain open. Isolated specimens do not validate complete shell composition or public launch.

Next task: L02-A desktop navigation only, with its own specification and tests first.

## U01-B NavigationLink: 2026-11-15

Completed only [U01-B NavigationLink](specs/U01-B-navigation-link.md), including About's existing recovery link. Brand, menu/header assembly, inline prose, button-shaped anchors and other page integration remain separate.

- [x] Wrote component/browser cases before implementation. The runnable baseline had ten failing component cases and seven passing compatibility cases; four desktop browser cases failed for missing target sizing, new-tab cues and reduced-motion behavior. Two additional malformed HTTP cases failed before validation was tightened.
- [x] Added standalone Next/native anchor dispatch with required destinations, native props/ref/event forwarding, explicit current-page semantics, safe/announced explicit new tabs and foundation typography, states, wrapping, focus and motion. External URLs remain same-tab by default; no disabled-link interception or route-matching state was added.
- [x] All 36 unit/component tests across six files passed, including 19 NavigationLink cases and existing Button/adapter/content/inquiry regressions.
- [x] All ten scoped desktop/mobile browser cases passed. Actual-component fixtures cover all three surfaces, readable normal/hover where supported/pressed/current states, independent contrast, 44px targets, 8px radius and persistent underline/current cues.
- [x] Native fragment keyboard focus, root query/hash preservation and the hydrated About-to-Home recovery link passed. A local explicit new-tab route opened with opener null and visible/accessibly named copy. No external service was clicked or business request sent.
- [x] Reflow at 320/375/768/1280/1920px, full stress labels with doubled/spaced text, Tab/Shift+Tab, visible focus clearance and sampled axe scans passed. Blocked fonts used verified system fallback; reduced motion removed transitions and forced-colors keyboard operation remained usable.
- [x] The browser harness transpiles actual component source with the already installed TypeScript compiler to load Next's entry without mocks. Corrected isolated-render slash assertions to accept Next-owned normalization; no production routing change or relaxed destination/query/hash requirement was needed.
- [x] TypeScript, ESLint and final formatting passed. Production build/export audit passed, with 24 Windows segment files normalized and 26 HTML files audited. Matching Chromium availability check completed.
- [x] Full browser workflow: 67 passed, one intentional viewport-specific skip in 2.4 minutes. Existing route, 404, metadata/indexing, fonts, typography, colors, Button, layout, motion, focus and sampled accessibility regressions remained passing.
- [x] Inspected actual desktop/mobile specimen screenshots for wrapping, current-page cues, new-tab copy and visible focus on the three surfaces. A before/after audit confirmed 127 captured package/lockfile/style/font/content/input/other-route/existing-component files unchanged; About changed only its link import/wrapper plus formatting. No dependency, provider, business record or public fixture route was introduced.
- [ ] Actual browser zoom, other engines, screen-reader review, final visual approval and future composed consumers remain open. Isolated specimens and one recovery link do not validate a complete navigation system or page design.

Next task: L01-A brand link only, with its own specification and tests first. Existing content, image-reference and launch-readiness limitations remain open.

## U01-A Button: 2026-11-15

Completed only [U01-A Button](specs/U01-A-button.md). Navigation links, stock compositions and production page integration remain separate.

- [x] Wrote six component cases and five browser cases before implementation. The safe native-type test failed while five compatibility cases passed; all five desktop browser cases failed for missing visual/geometry/accessibility/motion contracts or unintended submission.
- [x] Adapted all six existing Button variants and eight size aliases to opaque semantic states, Inter control typography, 8px radius, wrapping targets of at least 44px and foundation focus/motion. Native buttons default to type button; explicit submit/reset and slot/ref/ARIA/event forwarding remain supported.
- [x] Vitest passed all 17 tests across five files, including all six new Button cases and existing adapters/content/inquiry regressions.
- [x] All ten scoped desktop/mobile browser cases passed. Actual component markup covers normal/hover where supported/pressed/disabled states on light/yellow/charcoal, independent contrast checks, size aliases, five viewport widths, enlarged/spaced text, accessible icons, keyboard focus and sampled axe review.
- [x] Native Enter/Space action tests no longer submitted their isolated form; explicit submit/reset and disabled Tab skipping passed. No real business request was sent.
- [x] Blocked fonts used verified system fallback. Reduced motion removed Button transitions; forced-colors focus and keyboard operation remained usable. Normal transitions used 150ms ease-out and no pressed translation.
- [x] Corrected the contrast test to recognize the yellow fill boundary on charcoal and constrained an overflowing test-only input during enlarged-text checks. No production overflow was hidden and no contrast threshold was reduced.
- [x] TypeScript, ESLint and final formatting passed. Production build/export audit passed, with 24 Windows segment files normalized and 26 HTML files audited. Matching Chromium availability check completed.
- [x] Full browser workflow: 57 passed, one intentional viewport-specific skip in 2.1 minutes. Existing route, 404, indexing/metadata, fonts, typography, layout, focus, motion and sampled accessibility coverage remained passing.
- [x] Inspected desktop/mobile screenshots of the actual Button specimens. A before/after audit confirmed 127 captured route/style/content/input/package/other-component files are unchanged. Only Button source changed at runtime; no dependency, provider or public fixture route was added.
- [ ] Slotted anchor states, composed stock consumers, actual browser zoom, other engines, screen-reader review and final visual approval remain open. Unit/server-markup specimens do not certify future page compositions or a real inquiry service.

Next task: U01-B navigation links only, with its own specification and tests first. Existing content, asset-reference and launch-readiness limitations remain open.

## F01-D layout/motion: 2026-11-15

Completed only [F01-D layout/motion](specs/F01-D-layout-motion.md), with a focused specification and requirement/test/task matrix. No shared component or page section was built.

- [x] Wrote five browser cases before implementation and recorded failures against the unchanged F01-C export. A geometry rerun isolated the missing radius role from newly referenced spacing utilities absent in the old export.
- [x] Added explicit 4px spacing, 72rem section-owned containers, responsive 16/24/32px gutters, 8/12/16px radius roles and minimum 44px touch targets. Main is full width; only section classes changed in all 24 route shells. Skip-link sizing and inset main focus are integrated.
- [x] Ten scoped desktop/mobile cases passed. Geometry covers 320/375/767/768/1023/1024/1280/1920px; keyboard focus covers all five parent widths. Doubled root text and text-spacing overrides preserve 320px reflow and wrapping controls.
- [x] Actual control transitions run at 150ms and overlay entrance/exit at 200ms with ease-out. State/focus updates do not await animation completion. Reduced motion removes role transitions, clears delays, limits existing animations, preserves static positioning and keeps keyboard activation usable.
- [x] TypeScript, ESLint and final formatting passed; initial test-only lint warnings were resolved. Vitest passed all 11 tests across four files.
- [x] Production build passed with 24 Windows segment files normalized; export audit passed for 26 HTML files. Matching Chromium availability check completed.
- [x] Full browser workflow: 47 passed, one intentional viewport-specific skip in 1.4 minutes. Existing route, 404, metadata/noindex, skip-link, fonts, typography, surface/focus and sampled automated accessibility checks remained passing.
- [x] Inspected desktop/mobile native layout specimens for edge-to-edge backgrounds, aligned inner content and readable text. These are isolated browser-test fixtures, not approved page designs or a dialog implementation.
- [x] Before/after audit confirmed all 24 route changes are section classes only and 35 captured package/lockfile/font/color/typography/content/input files are unchanged.
- [ ] Actual 200%/400% browser zoom, screen-reader review, other engines, consumer-specific target/focus/motion checks and final visual approval remain open. Automated enlarged-text/reflow checks do not replace browser zoom review.

Next task: U01-A button adaptation only, with its own specification and tests first. Navigation links and shell assembly remain separate. Existing content, image-reference and launch-readiness limits remain open.

## F01-C typography: 2026-11-15

Completed only [F01-C typography](specs/F01-C-typography.md), with a requirement/test/task matrix and tests written before styles. Layout/motion and component composition remain separate tasks.

- [x] Recorded all four scoped desktop cases failing against the unchanged F01-B export for missing display sizing/measure and incorrect normal/enlarged H1 sizing.
- [x] Applied the approved fluid H1/H2/H3 hierarchy, body defaults, explicit display/control/emphasis/hint roles and opt-in 65ch measure. Preserved font delivery, semantic colors, existing main constraints and heading margins.
- [x] Eight scoped desktop/mobile cases passed: computed metrics and actual rendered local families at 320/375/768/1280/1920px, reading measure, long text/URL wrapping, blocked-font system fallback, keyboard activation, doubled root text size and user text-spacing overrides.
- [x] Corrected the reflow test to allow visible glyph overhang from tight display leading while still rejecting horizontal overflow and hidden/clipped text. No clipping CSS was introduced.
- [x] TypeScript, ESLint and formatting passed; Vitest passed 11 tests across four files. Production build and export audit passed, with 24 Windows segment files normalized and 26 HTML files checked. Matching Chromium availability check completed.
- [x] Full browser workflow passed: 37 passed, one intentional viewport-specific skip in 1.2 minutes. Existing route, metadata/noindex, 404, skip-link, font, color/focus and sampled automated accessibility coverage remained passing.
- [x] Inspected desktop/mobile native typography-specimen screenshots. No public test route, component, business record, dependency, font asset or color change was introduced.
- [ ] Actual browser 200% zoom/400% reflow, screen-reader review, other browser engines, composed component states and final visual approval remain outstanding. Root-font enlargement and viewport tests do not establish actual browser zoom conformance.

Next task: F01-D layout/motion only. Existing content, image-reference and release-readiness limitations remain open.

## F01-B semantic colors: 2026-11-15

Completed only [F01-B semantic colors](specs/F01-B-semantic-colors.md). Typography sizing, layout/motion and gym components remain separate tasks.

- [x] Wrote five scoped browser cases before implementation. All five desktop cases failed against the unchanged F01-A export for missing surface/state colors, incorrect nesting, hidden focus and muted text below 4.5:1 (4.34:1).
- [x] Implemented light/charcoal/yellow contexts, shadcn semantic/state roles, contrast-safe underlined links and protected keyboard/system focus. CSS scope boundaries prevent ancestor dark utilities leaking through light/yellow resets. Root stays light under OS dark preference.
- [x] All ten scoped desktop/mobile cases passed, covering computed colors and contrast, hover where supported, pressed/disabled/selected/invalid states, nested scopes, focus despite outline-none, forced colors, axe and 320px reflow.
- [x] TypeScript, ESLint and final project formatting passed. Vitest passed all 11 tests across four files.
- [x] Production build retained all 24 template categories, normalized 24 Windows segment files, and passed the export audit for 26 HTML files. Matching Chromium availability check completed.
- [x] Complete browser workflow: 29 passed and one intentional viewport-specific skip in 1.2 minutes. Existing font delivery/fallback/license, metadata/indexing, routes, 404s, skip-link, viewport and sampled automated accessibility coverage remained passing.
- [x] Inspected the desktop/mobile F01-B05 color-specimen screenshots for readable text/state colors and wrapping. Fixtures are browser-test DOM only; no new page, business content or component implementation was introduced.

This establishes the scoped color/focus foundation in Chromium. It does not certify stock shadcn component variants, actual dialogs/portals, all browser engines, clipped/sticky compositions, full manual screen-reader/zoom behavior, performance or final visual approval. Brand assets and unresolved release inputs remain unchanged.

## F01-A local fonts: 2026-11-15

Completed the local-font task only. See [F01-A specification and test cases](specs/F01-A-local-fonts.md) for contracts, test-first evidence, source revisions and limitations.

- [x] Wrote browser cases before integration. Against the unchanged export, three desktop font cases failed for missing font faces/requests while the metadata case passed. The later exported-license assertion failed with HTTP 404 before the license copies were added.
- [x] Installed only five upright WOFF2 files: Barlow Condensed 600/700 and Inter 400/500/600. Official pinned Git blobs, WOFF2 signatures, embedded families/weights/styles, SHA-256 hashes and source sizes were verified. Original licenses are retained; exact public/exported license copies were checked.
- [x] Shared next/font/local definitions, root variables and existing Tailwind font roles are connected. Inter supplies body text, Barlow Condensed is available through font-heading. Swap, system fallback, on-demand loading and disabled synthetic styling are configured without a client provider or dependency change.
- [x] Browser QA owns port 3100 by default, configurable through PLAYWRIGHT_PORT, and refuses to reuse an existing server. An initial run against the owner's development server on 3000 was discarded. Restricted preliminary subprocess cleanup required stopping only the test-owned static servers; final runs with subprocess-management permission completed normally. The development server was left running.
- [x] TypeScript, ESLint and final project formatting passed. Vitest passed all 11 tests across four files.
- [x] Production build passed for the complete template inventory; 24 Windows segment files were normalized. Export audit passed for 26 HTML files.
- [x] Matching Chromium availability/install check completed using the workspace-local browser cache.
- [x] Final complete browser workflow: 19 passed and one intentional viewport-specific skip in 40.2 seconds. All eight font cases passed across desktop/mobile: actual rendered selected weights, same-origin WOFF2 delivery, exact exported licenses, readable delayed/blocked fallbacks, wrapping at 320px, focus/navigation and preview indexing safeguards.
- [x] Existing complete route, 404, skip-link, responsive and sampled automated WCAG A/AA checks passed. Dependency declarations, pnpm-lock.yaml and the pre-existing package-lock.json match their pre-task hashes.

This verifies the local-font integration in Chromium. Heading sizing, semantic colors, layout/motion and all gym components remain separate tasks. No full manual visual, zoom, screen-reader or other-engine review, measured layout-shift/performance result, missing-image repair, business-content completion or public-release approval is claimed.

## Full shadcn foundation: 2026-11-15

The official shadcn 4.23.0 CLI completed `add --all --yes` with the Radix Nova configuration. All 63 UI modules and three support files were created; initialization separately created the cn helper. See `component-inventory.md` for the actual filenames. Components remain unmounted in the existing route shells.

- [x] pnpm 10.34.9 retained. The existing pnpm lockfile was updated in place for required registry dependencies. The pre-existing untracked npm lockfile and AGENTS.md match their pre-install copies. Route-shell structure is retained; the stale favicon reference was removed after a concurrent deletion of `public/images/brand/logo.jpg`.
- [x] Strict TypeScript check passed for all generated source, supporting files and adapter tests.
- [x] ESLint passed with no rule disables. The mobile hook and carousel subscriptions were adapted to useSyncExternalStore to satisfy the existing React rules.
- [x] Formatting check passed, including the installed source and updated documentation.
- [x] Unit suite: 11 tests passed in four files. Two new adapter regressions cover mobile server/client hydration and breakpoint updates, carousel initial/selected/reinitialized controls, keyboard navigation and subscription cleanup. Existing content/relationship/inquiry tests remain passing.
- [x] CLI-added remote-font layout changes were removed; system fonts remain. Neutral document defaults are in the base layer; keyboard focus and reduced-motion defaults are preserved.
- [x] Production build passed for all 24 template categories. The wrapper normalized 24 Windows segment files. The final export audit passed for 26 HTML files after the stale favicon reference was removed.
- [x] Matching Chromium availability check passed. The complete browser workflow passed in 1.1 minutes: 11 passed, one intentional viewport-specific skip. All 23 named outputs loaded at 1280/375 pixels without failed internal requests, browser errors or horizontal overflow; representative 768/1920 layouts, inventory navigation, skip-link focus and unknown-route/detail-slug 404s passed. Automated accessibility scans found no WCAG A/AA violations on the seven sampled template outputs in desktop/mobile configurations.

This verifies installation and local compatibility, not every unmounted component state. Review actual component compositions, visual design, keyboard behavior and appropriate interaction coverage when each feature is integrated. No new business content, provider integration or public-release approval is claimed. Existing asset-reference and release limitations below remain open.

Additional concurrent asset changes: `public/images/brand/logo.jpg` was removed and two PNG logo candidates were added. The first export audit correctly rejected the missing favicon. The stale metadata entry was removed; no replacement logo was chosen or image overwritten. Resolve the final logo and existing cover/social-image references during branding review.

## Previous UI reset (before library installation): 2026-11-15

The old UI was removed. Previous component/interaction and Lighthouse results describe the retired implementation and do not verify the rebuild. Current scope is the 24 route shells, retained data/transport logic and static-export infrastructure.

Executed results:

- [x] Used pnpm 10.34.9 from a workspace-local cache. The committed pnpm lockfile and dependency declarations are unchanged. A pre-existing untracked root `package-lock.json` was left untouched; no second root lockfile was introduced by this work.
- [x] TypeScript check passed; production build type checking also passed.
- [x] ESLint passed with no errors or warnings after route links were switched to the standard Next Link component.
- [x] Prettier formatting check passed.
- [x] Unit suite: nine tests passed in three files, covering content contracts, relationships and inquiry delivery-state behavior.
- [x] Production build passed and preserved every planned route template. The export wrapper normalized 24 Windows segment files.
- [x] Export audit passed for 26 generated HTML files: internal links, referenced href/src assets, H1s, descriptions and preview noindex.
- [x] Matching Chromium revision 1255 installed in `.cache/ms-playwright`.
- [x] Browser workflow executed on desktop/mobile. Ten tests passed and one viewport-specific case was intentionally skipped in the initial full run; the desktop 23-page inventory test exceeded its original 60-second limit near the end. Its scoped budget was increased to 120 seconds without changing assertions, and the targeted desktop rerun passed in 22.3 seconds. All 11 applicable cases passed across these runs.
- [x] All 23 named page outputs loaded at 1280 and 375 pixels with one H1, the rebuild notice, no old header/footer/form/input/dialog, no browser page errors, no failed internal requests and no horizontal overflow. Unknown paths and unknown program/location slugs returned the custom 404.
- [x] Representative layouts fit at 768 and 1920 pixels across seven page types.
- [x] Temporary homepage inventory navigation and back-home recovery passed. Keyboard skip-link activation focused the main landmark on both desktop/mobile.
- [x] Automated WCAG A/AA scans found no violations on Home, Programs, Contact, FAQ, Gallery, Uttara location and the program preview on desktop/mobile. This is automated evidence, not a claim of full WCAG conformance.
- [x] No remaining source/test imports reference removed component, feature, hook or class-name-helper modules. The reset does not change business content modules, schemas, supplied `info/` or `figma/` inputs.

The old component tests were retired with their implementations. Each rebuilt interaction needs relevant coverage when reintroduced. No replacement-component visual approval, manual screen-reader audit, provider delivery verification, current Lighthouse measurement or public-release approval is claimed.

Separate brand-asset edits appeared while this work was running: `cover.png` and `cover.webp` were deleted and `hero_section.png` was added under `public/images/brand/`. Those edits were left untouched. The retained `gymImage` in `src/content/site.ts` and Open Graph image in `src/lib/seo.ts` still refer to the removed covers. Shells render no photos, but social-image references need remapping before publication and photo references before rebuilding image sections. The export checker validates HTML href/src targets, not Open Graph image URLs.

## Outstanding release checks

- [ ] Review every rebuilt component/page against the agreed design and supplied references.
- [ ] Manually verify keyboard interaction, screen-reader behavior and reduced motion for rebuilt features.
- [ ] Validate full approved content, image/font performance and production-host behavior.
- [ ] Connect and verify an actual submission provider if required; do not simulate delivery.
- [ ] Resolve content-readiness.json, approved legal text, domain and hosting configuration.
- [ ] Complete launch QA and explicitly approve public release.
