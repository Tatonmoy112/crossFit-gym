# QA checklist

## Git checkpoint: 2026-11-16

The owner requested pushing the current code. The workspace also contains newer build/export script edits and a Breadcrumbs draft with four component cases and an initial Programs integration. These are included in the checkpoint review; the draft does not complete S02-A or change the eight-of-thirteen verified count. Fresh checks for this exact workspace passed. Its new Home breadcrumb initially broke the older one-link assertion; the updated tests explicitly require both breadcrumb Home and Back to home, including their keyboard order.

The build wrapper now selects webpack by default, while explicit turbo flags select Next's default compiler. Export normalization also creates percent-encoded bracket-path aliases. Review these changes with a fresh production build, export audit and full browser suite.

Original reference/brand-image deletions already present locally are excluded from the commit to preserve supplied originals in Git. Their local working-tree state remains untouched. Generated caches/export/browser reports, environment files and any secondary package-manager lockfile are excluded. This is a source checkpoint, not deployment or release approval.

- [x] Fresh README workflow passed: typecheck, ESLint, final formatting, **113 unit/component tests across nineteen files**, webpack production build, export audit (26 HTML files), matching Chromium check and **135 browser tests passed, one intentional viewport-specific skip in 4.6 minutes**. The ten directly affected content-state/breadcrumb component cases also pass.
- [x] Reviewed 231 staged files and prepared the source checkpoint for origin/main without force. Only the fifteen pre-existing original-reference/brand-image deletions remain unstaged. Code whitespace checks exclude the two byte-preserved upstream Barlow license copies, which contain original trailing spaces. The actual push result is reported after remote verification.

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
