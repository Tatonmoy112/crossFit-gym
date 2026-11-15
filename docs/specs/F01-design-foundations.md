# F01: Design foundations

Date: 2026-11-15. Design-contract status: **specified**. F01-SPEC delivered this specification and acceptance matrix. [F01-A local fonts](F01-A-local-fonts.md), [F01-B semantic colors](F01-B-semantic-colors.md) and [F01-C typography](F01-C-typography.md) are verified for their documented scopes; [F01-D layout/motion](F01-D-layout-motion.md) is also verified for scoped automated and native specimen checks. Manual zoom, other engines, consuming components and final visual approval remain open.

## Purpose and boundaries

Establish consistent design contracts for the complete [24-template sitemap](../sitemap.md). The audience is visitors learning about Crossfit Gym and contacting the Uttara team. All future page sections, shared patterns and shadcn compositions consume these foundations.

The selected direction is supplied yellow/charcoal branding, light content pages and charcoal brand sections. Barlow Condensed is the display face; Inter is the body and control face. These are implementation requirements from the agreed plan, not a claim that the replacement UI has received visual approval.

This document introduces CSS/token contracts, not a public component API or new business-content schema. Keep Next.js App Router, strict TypeScript, Server Components by default, static export, pnpm 10.34.9 and its lockfile. Business content remains in `src/content`, with Zod and relationship validation. Keep UI state local or in URL parameters.

The initial F01-SPEC iteration excluded font downloads, font installation, token/CSS edits, components, page composition, additional routes, providers, dependency upgrades, asset replacement, business copy and deployment. Subsequent implementation is delivered through the separate tasks below. Each later component needs its own props, content contract, states and acceptance cases; F01 does not authorize implementing the roadmap in one pass.

## Design contracts

### F01-R01: Font roles and delivery

| Role              | Family and weights                         | Fallback                     | Consumer contract                                                                                                |
| ----------------- | ------------------------------------------ | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Display           | Barlow Condensed 600 and 700, normal style | Arial, Helvetica, sans-serif | Hero titles, page H1s and major section H2s; exposed through `--font-heading` / `font-heading`.                  |
| Body and controls | Inter 400, 500 and 600, normal style       | Arial, Helvetica, sans-serif | Paragraphs, small headings, navigation, labels, fields and buttons; exposed through `--font-sans` / `font-sans`. |

Source from the official [Barlow project](https://github.com/jpt/barlow) and [Inter project](https://github.com/rsms/inter), using their documented distributions. Preserve the accompanying licenses, record the actual source release/commit and asset filenames when downloaded, and use WOFF2. F01-A supplies the five selected files, provenance manifest and original/exported licenses; no font is fetched at build or runtime from a third party.

Use [Next.js local font loading](https://nextjs.org/docs/app/getting-started/fonts) with `display: "swap"`. Keep font definitions in one server-side module and expose font variables through the root layout without adding a client provider. Map loader variables to the existing Tailwind font roles without self-referential CSS variables. Local font assets must be available at build time; builds and page rendering must not depend on a remote font service.

Load only the selected upright weights, either from static WOFF2 files or a verified WOFF2 variable file covering those weights. Do not synthesize missing display/body weights or add italic assets before a feature needs them. With requests blocked or fonts unavailable, the system fallback must keep all text, controls and navigation usable. Do not claim zero layout shift without measuring it.

### F01-R02: Surfaces, semantic colors and states

Use existing shadcn semantic roles and Tailwind mappings rather than scattering raw colors through components. F01-B implements the following values in `src/styles/colors.css`, alongside explicit surface boundaries and additional state roles. Individual component adaptations remain separate tasks.

| Semantic role                            | Light context         | Charcoal section context |
| ---------------------------------------- | --------------------- | ------------------------ |
| Background / foreground                  | `#FFFFFF` / `#171717` | `#202020` / `#FFFFFF`    |
| Card and popover / foreground            | `#FFFFFF` / `#171717` | `#202020` / `#FFFFFF`    |
| Primary / primary foreground             | `#FFCC00` / `#171717` | `#FFCC00` / `#171717`    |
| Muted, secondary and accent / foreground | `#F5F5F5` / `#525252` | `#171717` / `#F5F5F5`    |
| Decorative border                        | `#D4D4D4`             | `#737373`                |
| Essential input/control boundary         | `#737373`             | `#737373`                |
| Link text                                | `#171717`, underlined | `#FFCC00`, underlined    |
| Destructive/error text and boundary      | `#B91C1C`             | `#FCA5A5`                |
| Focus ring                               | `#171717`             | `#FFCC00`                |

Context applies to the nearest surface, including portaled overlays: a light overlay uses light-context roles even when triggered from a charcoal section. Retain scoped shadcn dark styling for charcoal compositions; do not add a site-wide theme switch or automatically switch the entire site to the operating-system dark preference.

- Primary actions use dark text, hover background `#E6B800` and pressed background `#CCA300`. Where a yellow control's boundary against a light surface is essential to identify it, add a solid charcoal border; yellow alone does not supply that boundary contrast.
- Links stay identifiable without color and retain their underline on hover. Yellow is not body/link text on light backgrounds. Image-backed text requires a solid surface or verified overlay contrast in its own feature specification.
- Disabled controls use muted background/foreground without reducing the whole control's opacity. Use native disabled semantics for buttons/fields; specify unavailable-link behavior in U01 rather than putting `disabled` on an anchor. Do not remove a still-focused control's indicator during a state update.
- Selected controls expose their state programmatically and with a shape, border or text cue. Error states include a message and an associated invalid state, not color alone. Field associations and actual validation belong to their component tasks.
- Require at least 4.5:1 for normal text; 3:1 for large text (at least 24 CSS px regular or about 18.67 CSS px bold) and applicable essential UI boundaries/indicators. Decorative separators are not a substitute for a required control boundary. Review composited colors, opacity and every actual state after integration.

The following opaque sRGB pairs were calculated during specification review, rounded to two decimals. They are numerical checks of the proposed colors, not browser or visual approval:

| Foreground / background | Contrast |
| ----------------------- | -------- |
| `#171717` / `#FFFFFF`   | 17.93:1  |
| `#525252` / `#F5F5F5`   | 7.17:1   |
| `#171717` / `#FFCC00`   | 11.86:1  |
| `#FFFFFF` / `#202020`   | 16.29:1  |
| `#737373` / `#FFFFFF`   | 4.74:1   |
| `#B91C1C` / `#FFFFFF`   | 6.47:1   |
| `#FCA5A5` / `#202020`   | 8.58:1   |
| `#FFCC00` / `#202020`   | 10.78:1  |

### F01-R03: Typography and responsive layout

Keep the root font size at the browser default (normally 16px), with body text `1rem`, weight 400 and line height 1.6. Specify sizes in rem; fluid headings combine rem and viewport units so that text still responds to zoom. Do not globally capitalize text or force heading line breaks to match a desktop screenshot.

| Text role               | Size                                    | Weight                      | Line height |
| ----------------------- | --------------------------------------- | --------------------------- | ----------- |
| Hero display            | `clamp(2.5rem, 1.5rem + 4vw, 5rem)`     | Barlow Condensed 700        | 1.05        |
| Page H1                 | `clamp(2.25rem, 1.5rem + 3vw, 4rem)`    | Barlow Condensed 700        | 1.1         |
| Major section H2        | `clamp(1.75rem, 1.25rem + 2vw, 3rem)`   | Barlow Condensed 600        | 1.15        |
| Small heading H3        | `clamp(1.375rem, 1.125rem + 1vw, 2rem)` | Inter 600                   | 1.25        |
| Body                    | `1rem`                                  | Inter 400                   | 1.6         |
| Controls and navigation | `1rem`                                  | Inter 500; 600 for emphasis | 1.4         |
| Supporting label/hint   | `0.875rem`                              | Inter 400 or 500            | 1.5         |

Use normal letter spacing initially. Heading level follows document structure, not visual size; pages retain one H1. Long-form text has a maximum measure of 65ch. Long words, URLs, labels and missing-content notices wrap without clipping or hiding information. A dedicated component may define a different documented text role when its actual structure requires one.

- Spacing unit: `0.25rem` (4px at the default root). Standard steps: 4, 8, 12, 16, 24, 32, 48, 64 and 96px, expressed in rem.
- Content width: at most 72rem of inner content. Center it with a width equivalent to `min(72rem, 100% - 2 * gutter)`; the gutter must not be added again inside this width.
- Gutters: 1rem below `md`, 1.5rem from `md`, 2rem from `lg`. Existing Tailwind defaults remain `sm=640`, `md=768`, `lg=1024`, `xl=1280`, `2xl=1536` CSS px, using rem equivalents.
- Full-width section backgrounds extend beyond the content container. F01-D removes the temporary globally constrained main styling; each existing shell section now owns its content width through layout-container. Keep the main landmark and skip-link destination intact.
- Verify 320, 375, 768, 1280 and 1920 CSS px. At 200% browser zoom, text and controls remain usable without clipping; at 400% from a 1280px viewport, content reflows at the 320px equivalent without two-dimensional page scrolling. A genuinely two-dimensional feature must specify its own accessible contained scrolling.
- Radius roles: controls 0.5rem, cards 0.75rem, overlays 1rem. Expose these roles without relying on the stock radius multipliers to happen to match them.
- Primary touch controls have a target of at least 44 by 44 CSS px, allowing internal padding to grow. Smaller secondary targets still meet applicable WCAG 2.2 target-size/spacing requirements and need explicit review in their component task. Inline text links retain normal paragraph flow.

### F01-R04: Keyboard focus

Retain the first-tab skip link and its focus transfer to `main`. Every focusable control has an unclipped visible indicator. Use a solid 3px outline with a 3px offset: `#171717` on white, muted and yellow surfaces; `#FFCC00` on charcoal surfaces. Give controls enough space that the indicator does not overlap or disappear behind neighboring elements.

The noninteractive full-width main landmark uses a 3px inset outline (offset -3px) to keep its skip-destination indicator inside viewport edges; control outlines retain their 3px outward offset. Do not remove focus without an equivalent indicator. Forced-colors mode uses the system focus color. Dialog focus trapping/restoration, navigation keyboard patterns and sticky-header focus visibility are accepted within their future component specifications, not claimed by this unmounted foundation.

### F01-R05: Motion

Control color/border/opacity transitions last 150ms with ease-out easing; overlay entrance/exit transitions last 200ms with ease-out easing. No autoplay, parallax, looping decorative motion or smooth scrolling is introduced by F01. Limit transitioned properties rather than using `transition-all` in new compositions.

Under `prefers-reduced-motion: reduce`, suppress nonessential transforms, animation and scrolling effects and make state changes immediate. Essential loading/progress information remains available as text/status. Existing global reduced-motion protection stays in place until replacement behavior is verified. Do not rely on an animation-end event to unlock interaction or move focus.

### F01-R06: Compatibility and content safeguards

Preserve all route templates, approved static parameters, unknown-slug 404 behavior, metadata, canonical paths, robots and sitemap behavior. Preview pages remain noindex and isolated from actual collections. Keep the root main landmark, first-tab skip link and focus destination. No application data, service, provider tree or page is added for foundation verification; representative populated states use clearly isolated test fixtures.

## Acceptance matrix: write tests before implementation

These are parent acceptance contracts. F01-01 has font-delivery/fallback coverage in F01-A; F01-C adds hierarchy and text-role sizing checks. F01-02/F01-04 have surface/state/focus specimen coverage in F01-B; actual component consumers still need review. F01-03 has scoped text/measure/fallback/user-spacing coverage in F01-C, and layout/geometry specimen coverage in F01-D, with actual manual zoom and component geometry still pending; F01-05 has normal/reduced-motion specimen coverage in F01-D, with consuming animations still requiring review. F01-06 regressions run for every implementation task. See the task specifications for executed evidence; a scoped specimen does not complete every consumer. Test-only probes must not become public routes or catalog records. Use Vitest for independent calculations/logic, Testing Library for actual interactive component contracts, and Playwright for rendering, network, focus and media behavior. Do not unit-test CSS text or reimplement a library's own tests.

| Case   | Requirement | Scenario and expected result                                                                                                                                                                                                                                                                       | Verification method                                                                                                                                                                                                      | Owning task                                                              |
| ------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| F01-01 | R01         | On a cold exported-page load, each selected weight renders using its intended local family with no third-party font request. Block font responses in a separate case: fallback text, links and controls remain visible, wrap and remain usable. No synthetic weight is needed for specified roles. | Playwright request/resource inspection, `document.fonts` loading checks and computed font roles; manual fallback comparison; license/source-file review. Expected blocked-font failures are scoped to the fallback test. | F01-A; font-role sizing in F01-C.                                        |
| F01-02 | R02         | Light, yellow and charcoal specimens cover default, hover, pressed, disabled, selected and invalid states. Actual text and essential boundaries meet their thresholds; links/errors/selection do not rely only on color.                                                                           | Independent contrast calculations for actual opaque/composited pairs; Playwright state inspection and axe; manual review of boundaries and non-color cues.                                                               | F01-B; component-state coverage added in U01/U03 and consuming features. |
| F01-03 | R03         | At all five widths, short/long headings, contact details, long URLs, controls and missing-content notices fit without page overflow. Font fallback, 200% zoom and 400% reflow preserve readable content and usable controls. Targets and radius roles match the contract.                          | Playwright geometry/overflow checks and computed dimensions; manual browser zoom/text-spacing review. A viewport resize alone does not prove browser zoom behavior.                                                      | F01-C and F01-D; actual targets verified again in component tasks.       |
| F01-04 | R04         | Tab/Shift+Tab through light, yellow and charcoal specimens. The skip link is first and focuses main; each control retains its visible outline without clipping, including at zoom and in forced-colors mode.                                                                                       | Playwright focus/style checks and forced-colors emulation; manual keyboard/visibility review.                                                                                                                            | F01-B and F01-D; focus behavior in later interactive components.         |
| F01-05 | R05         | With no motion preference, relevant state transitions use their specified duration. With reduced motion enabled, nonessential movement stops and all state/focus behavior still completes.                                                                                                         | Playwright media emulation and computed transition/animation checks; manual comparison. Test actual state transitions once a consumer exists.                                                                            | F01-D; repeated for animated consumers.                                  |
| F01-06 | R06         | All 24 template categories remain represented; existing named outputs and approved detail paths load; unknown paths/slugs return 404. Main/skip behavior and metadata/indexing protections survive every foundation task; structure previews remain excluded from real catalogs/sitemap.           | Complete README quality workflow, export audit, existing route/axe tests and targeted metadata/preview assertions.                                                                                                       | F01-A through F01-D.                                                     |

## Small-task execution order and traceability

F01-SPEC is complete; F01-A local fonts, F01-B semantic colors and F01-C typography are implemented with tests written first. F01-D layout/motion is also implemented with tests written first. The CSS foundations have scoped automated evidence; manual and consuming-component checks remain open. Every implementation task writes its scoped acceptance tests, records the expected failing result, then implements only its own contract and runs the required checks. Existing passing regressions must stay passing; diagnose unrelated baseline failures separately. Actual task outcomes belong in their linked specifications.

| Task                   | Ordered work                                                                                                                                                                                                             | Acceptance cases                | Completion evidence                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| F01-SPEC               | Record selected direction and contracts; define acceptance cases; map requirements to tasks; link backlog/inventory; validate this documentation.                                                                        | Defines F01-01 through F01-06.  | Specification and documentation checks only; no runtime claim.                                        |
| F01-A: local fonts     | 1. Write local-font, fallback and role tests. 2. Acquire verified WOFF2 weights and licenses. 3. Add shared local loader/root variables. 4. Apply Inter to body and expose display role; leave heading sizing for F01-C. | F01-01, F01-06.                 | Expected failing tests, passing font/fallback checks, source/license record and full README workflow. |
| F01-B: semantic colors | 1. Write surface/contrast/state/focus tests. 2. Map semantic tokens and scoped charcoal surfaces. 3. Define state colors and focus treatment without redesigning every stock UI module.                                  | F01-02, F01-04, F01-06.         | Calculated actual pairs, rendered state/focus evidence and full README workflow.                      |
| F01-C: typography      | 1. Write font-role/wrapping tests. 2. Implement the type hierarchy and readable measure. 3. Verify long text and font fallback.                                                                                          | F01-01, F01-03, F01-06.         | Typography/wrapping evidence and full README workflow; manual zoom results recorded.                  |
| F01-D: layout/motion   | 1. Write layout, geometry, focus and motion tests. 2. Implement spacing/gutter/width/radius/duration roles. 3. Retire temporary main constraints while preserving landmarks. 4. Verify the responsive and media matrix.  | F01-03, F01-04, F01-05, F01-06. | Geometry, focus and motion results plus full README workflow; manual reflow results recorded.         |

Shared container components, buttons, navigation and page sections remain separate follow-up tasks after these foundations. A foundation task does not mark all consumers or a page complete. The [rebuild plan](../component-rebuild-plan.md) retains the full delivery sequence and all page sections.

For every task maintain status **specified -> tests written -> implemented -> verified** with evidence. An acceptance matrix alone is not "tests written"; implementation alone is not "verified". Record automated results, manual results, unverified consumer states and any blockers separately. End the iteration at the selected task boundary.

## Specification review and remaining limits

F01-SPEC review on 2026-11-15: all six agreed acceptance IDs map to requirements, methods and implementation tasks; the approved starting values and font roles are documented. The representative sRGB ratios above were calculated with the WCAG relative-luminance formula. Documentation validation resolved all 19 relative links across the specification, rebuild plan, implementation backlog and component inventory, and confirmed the six case mappings and five task entries. The final project formatting check passed after formatting the edited Markdown tables.

The original F01-SPEC iteration was documentation-only. F01-A subsequently tests local fonts, fallbacks, licenses and indexing safeguards; F01-B tests semantic surface/state colors, nested boundaries, contrast and protected focus; F01-C adds the approved type hierarchy, readable measure and scoped reflow checks. Read their specifications for current execution results. F01-D adds section-owned containers, geometry and motion roles with scoped normal/reduced-motion checks; no new page/component, full manual accessibility/zoom review, final visual approval or performance score is claimed.

The twelve raster references documented in [figma-mapping.md](../figma-mapping.md) are absent from the current working tree and appear as existing deletions. Do not restore or overwrite them as part of F01. There is no supplied editable Figma authority or mobile/interaction-state design. Review later references supplied by the owner within their relevant task; do not infer approval from old screenshots.

Stale cover/social-image references and separately changed logo assets remain for their image/branding tasks. Existing uncommitted work and the pre-existing second lockfile remain untouched. Business copy, legal text, service integration, visual review, domain and hosting remain subject to [content readiness](../content-readiness.json). This specification is not public-launch approval.

[U01-A Button](U01-A-button.md) subsequently adds actual native-button consumer coverage for semantic colors, typography/geometry, focus, fallback and motion. This does not verify other stock components or final page compositions.

[U01-B NavigationLink](U01-B-navigation-link.md) subsequently adds actual standalone-link consumer coverage and integrates only About's existing recovery link. Menu route matching, button-shaped anchors and other compositions remain separate.

[L01-A BrandLink](L01-A-brand-link.md) adds an isolated consumer of the link, font, geometry, focus and motion roles, with local-image and failure-fallback coverage. Header placement remains for assembly.

[L01-B header assembly](L01-B-header-assembly.md) now mounts BrandLink and both navigation consumers in the root layout, with real routing and focus coverage. [L03-A footer](L03-A-footer.md) adds a server-rendered consumer of surface, typography, responsive, link/focus and fallback roles. [S01-A preview notice](S01-A-preview-notice.md) adds a static yellow-surface consumer with conditional visibility and preserved indexing safeguards. [S01-B content states](S01-B-content-states.md) adds a static Empty consumer with foundation surface/type/radius/reflow coverage and accurate empty Programs integration. [S03-A Container](S03-A-container.md) exposes the existing width/gutters through a native div wrapper, first integrated inside Programs' full-width section. [S03-B SectionHeading](S03-B-section-heading.md) adds an H2/optional-description consumer for the verified typography/surfaces and first reuses it in ContentState. Next executable task: **S02-A breadcrumbs only**, with its own specification and tests first.
