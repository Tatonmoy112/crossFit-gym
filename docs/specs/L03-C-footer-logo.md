# L03-C: Footer logo alignment

Date: 2026-11-18. Extends L02-E's transparent navigation branding to the footer, superseding its earlier decision to preserve the footer's old mark.

## Implemented behavior

- Header, drawer and footer explicitly use the same Zod-validated `navigationBrandImage` record. It references the unchanged owner-supplied `/images/brand/logo_without-bg.png`, with actual 1254px square intrinsic dimensions and a contained, unrounded 44px presentation.
- The footer retains the visible gym name, accessible Home link, spacing and responsive wrapping. Its logo link has transparent hover/pressed backgrounds and preserves its existing text color, visible keyboard focus and native navigation.
- `BrandLink`'s optional image interface remains unchanged. Its original default image and styling still support other uses; the homepage partnership illustration keeps its existing image. The shared presentation record was renamed from `headerBrandImage` to reflect all three navigation placements.
- Footer navigation remains fourteen always-visible links in static columns. The CTA, contact details, social/legal presentation and decorative wordmark are unchanged. No new routes, services, dependencies or business claims are added.

## Verification

Existing footer component checks now assert the supplied PNG and intrinsic dimensions. Header browser expectations recognize the shared footer image. Footer browser coverage checks all six existing widths, real hover/pointer-down backgrounds and text color, 44px contained geometry, image delivery, visible keyboard outlines, native Home navigation, enlarged text, failed PNG/fonts, reduced motion, forced colors and no-JavaScript operation. Existing automated accessibility checks remain enabled.

The complete README quality workflow was executed: 357 unit/component tests, typecheck, lint, formatting, production build and the 29-HTML export audit pass. The full browser run returned 362 passed, one header audit timing failure and three intentional skips. After waiting for the drawer's entrance animation before auditing, all ten header cases pass again; all 363 applicable unique browser cases are verified across these runs. Reviewed six footer widths, enlarged text and blocked-image/font captures. See the QA checklist for exact evidence. Owner visual approval and manual real-device/screen-reader review remain pending, alongside existing content/legal/domain/hosting release gates.
