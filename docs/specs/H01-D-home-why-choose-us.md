# H01-D: Why choose us

Status: **verified for the documented scope**. Date: 2026-11-16.

## Agreed scope and design

Owner selected three cards, supplied facts and the existing approved gym photo. Home order becomes hero -> counter -> Why choose us -> existing story -> temporary inventory. Complete only this feature, sequentially: test and verify one reusable Certified Trainers card first, then test and compose the three-card section.

Install the requested `@reui/c-card-8` using `pnpm dlx shadcn@latest add @reui/c-card-8` with pnpm 10.34.9. Configure `@reui` as `https://reui.io/r/{style}/{name}.json`, retaining radix-nova. Inspect the CLI changes and decline overwriting the existing Card primitive. The official registry pattern uses Card with an image, bottom text, gradient and hover zoom; it has no npm dependencies beyond the installed Card's dependencies. Replace its remote demonstration image/copy and move the adapted pattern into the Home feature rather than leaving a public demo.

## Contracts

- `WhyChooseUsCard({ item })` is a Server Component based on the downloaded pattern, composing the existing Card. Item: stable ID, nonblank plain-text title/description/source, local image metadata and left/center/right crop. It renders a named article with one H3 and paragraph, a lazy local Next Image with intrinsic dimensions and decorative overlays. No link, button, pointer cursor, live region, heading-level flag, client state or provider.
- Cards have a charcoal fallback, a uniform 70% charcoal scrim plus bottom gradient, readable foreground text, 12px corners, 24px padding and a minimum 24rem height that grows with content. The image alone zooms to 1.1 over 500ms on capable-pointer hover under no motion preference; reduced motion disables zoom. Text is always visible. No max-width cap inside the grid.
- `HomeWhyChooseUs({ content })` is a Server Component with Container, centered SectionHeading H2 named Why choose us, and a native list of the same reusable cards. Empty items render nothing. Use 48px vertical spacing, 64px from md, a 32px heading/grid gap and 24px grid gaps: one column below 768px, two from 768px, three from 1024px.
- Validate the section/card records with Zod in src/content and the content schema module. Reject blank fields, duplicate IDs, invalid crop values, non-local images and nonpositive/noninteger image dimensions. Keep images within public assets and preserve normal React escaping.
- Current card copy (owner-requested rewrite, 2026-11-16): Certified Training Team / "Train at Crossfit Gym, home to a team of 30+ certified trainers."; Your Gym in Uttara / "Make training part of your routine. Visit us at [site.address]."; Start With a Conversation / "Have questions before your first visit? Call [site.phone] to speak directly with the Crossfit Gym team." The trainer count remains owner supplied. Derive address/phone from site content. Reuse homeHero.image with left/center/right crops; do not edit originals or infer credentials, offerings or new service claims. Card markup, styling and behavior are unchanged by the rewrite.
- Preserve the counter, story missing state, single page H1, header/hero borderless join, all 24 templates, noindex and release gates. Update existing placement assertions to require the new complete order, not merely remove them.

## Acceptance and ordered verification

| ID      | Behavior                                                                          | Tests first                                                                                           |
| ------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| H01-D01 | One reusable static card owns H3/body, local lazy image, crop and safe text       | Component exact content, SSR, image metadata, long/escaped text and no controls                       |
| H01-D02 | Card appearance, readable overlays, hover-only image motion and failure fallbacks | Actual-component browser fixture; geometry, contrast, reduced motion, image failure and enlarged text |
| H01-D03 | Content matches selected supplied facts and validates consistently                | Unit copy/source/image/ID validation and invalid-record cases                                         |
| H01-D04 | Same card reused three times in a named H2 section at the exact Home position     | Section/route tests, empty list, single H1, previous counter/story regressions                        |
| H01-D05 | Responsive section remains accessible and static-export friendly                  | Browser 320/375/768/1024/1280/1920, axe, no JS, image failure, text enlargement and screenshots       |
| H01-D06 | Full quality workflow and protected-source audit                                  | README checks, registry provenance/dependency audit, documentation and manual-review limits           |

First verify D01 before composing the section. Record missing-behavior failures, then implementation/results. Test fixtures stay outside public routes/catalogs. Manual screen-reader, actual zoom, other-engine and owner visual approval remain separate from automated Chromium evidence.

## Evidence and limitations

- Initial card tests could not resolve the not-yet-created component. Fourteen schema cases then failed for missing validation exports. After importing/adapting Card 8, all five card component and fourteen schema cases passed before any section composition.
- The requested command ran through pnpm 10.34.9 and shadcn 4.23.0. Registry dry-run proposed replacing Card; declined the overwrite during installation. The existing Card, project dependencies and pnpm lockfile stayed byte-identical. Adapted the actual downloaded source, removing demonstration copy/remote image and moving it out of examples.
- Isolated browser tests exposed stock rounded-xl overriding the 12px token (14px actual). A local data-slot radius override fixed it without editing stock source. CSS colors are normalized through canvas with a one-channel 8-bit rounding allowance; opacity and the 4.5:1 worst-case contrast threshold remain asserted. All eight isolated browser cases passed before composing the section.
- Section tests were written next: missing-content and revised counter order produced three failing assertions, the new section suite could not resolve its module, and the real-browser placement case found zero Why choose us regions. Added the validated supplied-fact record and static section afterward; all focused cases pass.
- All 217 unit/component tests across 30 files, typecheck, lint, formatting, production build and 26-HTML export audit pass. All eight integrated browser cases pass, including selected crops, exact copy/order, one/two/three columns, enlarged text, image/font failures, reduced motion, keyboard/axe and real no-JavaScript display. Inspected desktop/phone screenshots under `.cache/why-section-review/`.
- A protected-file audit captured 189 existing files: 185 unchanged; only components.json, the Home route/content module and content schema changed. New Home feature/test/spec files are additions. Original inputs/photos/references, stock components, style foundations, metadata/indexing configuration, packages and lockfile are unchanged. UI/layout/shared/Home feature counts are 64/seven/four/seven.

The final full README workflow passes, including matching Chromium availability, formatting and **204 browser tests passed with two intentional viewport/hover skips in 3.4 minutes**. All sixteen new card/section cases and the revised counter/story placement cases pass in that run. Desktop/phone review copies are retained under `.cache/qa/why-choose-us/`.

The trainer statement is owner supplied; no credentials, offerings or service claims are independently established by these UI tests. Manual screen-reader, browser zoom, other-engine testing, owner visual approval and public-release gates remain open. Other Home sections are not part of this delivery. Completed only H01-D; stop this iteration.
