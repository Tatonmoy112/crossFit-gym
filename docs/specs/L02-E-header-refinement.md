# L02-E: Header logo and mobile menu refinement

The later [L03-C footer refinement](L03-C-footer-logo.md) extends this logo and transparent interaction treatment to the footer. References below to preserving its old image describe the original L02-E scope.

Date: 2026-11-18. Refines the existing header and L02-D drawer without changing navigation destinations or footer branding.

## Presentation and interaction

- Below the existing 64rem desktop breakpoint, the header trigger shows only a three-line, 24px hamburger centered in a 44px square target. Its accessible name remains Menu; Radix owns its expanded state and dialog relationship.
- Header and drawer brand links use the owner-supplied `/images/brand/logo_without-bg.png`, validated with its actual 1254px square dimensions. It renders at 44px with contained proportions and transparent pixels, beside the existing visible gym name and accessible Home destination. The original file is unchanged.
- `BrandLink` accepts an optional typed image override. Its existing default image remains the footer's image; other business and page imagery are unchanged.
- Header logo and hamburger, drawer logo and Close control have transparent hover/pressed backgrounds. Icon buttons retain transparent pressed borders. Visible keyboard outlines, forced-color support and reduced-motion behavior remain.
- Drawer groups, current-page cues, focus trapping/restoration, Escape/backdrop dismissal, desktop transition cleanup, contact actions and scrolling remain as documented in L02-D. The footer retains static navigation columns.

## Verification

Existing component/browser checks cover accessible identity, image dimensions and sources, responsive targets, current-state matching, real navigation/history, modal operation, enlarged text, reduced motion, forced colors and blocked assets. Additional browser assertions inspect the affected controls while hovered, actively pressed and keyboard-focused, check all three hamburger strokes and compare header/drawer image sources with the preserved footer image. Asset-failure interception includes the new PNG.

The complete README quality workflow passes: 357 unit/component tests, typecheck, lint, formatting, final production build, the 29-HTML export audit and 363 browser cases with three intentional viewport skips. Twenty focused header/drawer cases also pass. Reviewed responsive header captures, the phone drawer and keyboard focus specimens; see the QA checklist for exact evidence and runner settings. Manual real-device/screen-reader review and owner visual approval remain pending; existing content/legal/domain/hosting release gates still apply.
