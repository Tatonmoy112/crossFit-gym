# H01-A3: Homepage hero redesign

Date: 2026-11-17. Status: implemented and checked in desktop/mobile Chromium; verification results are recorded in `docs/qa-checklist.md`. Owner visual approval remains pending.

This owner-approved plan supersedes the presentation, actions and counter-placement rules in H01-A, H01-A2 and H01-C, and the Home-only header placement in L01-B. Other content, navigation, focus and indexing contracts remain in effect.

## Reference mapping

- Adapt the supplied Peakfit screenshot using the existing yellow (`--primary`), charcoal and white surfaces, local Barlow Condensed display font and Inter controls. Retain the approved local gym interior photograph and its provenance. Reference copy, people, brand and statistics are not published.
- Keep the single two-part H1: white **One step closer.**, yellow **Crossfit Gym**. The supplied Uttara location follows it. There is no invented descriptive paragraph.
- Use a full-width, straight-edged hero with minimum height `min(100svh, 56rem)` and natural content growth. Remove the former V-cut and vertical brand ornament.
- Layer a 25% uniform charcoal scrim, a strong text-side gradient and a bottom gradient. Desktop shading remains strongest across the text column while leaving the right-side photograph more visible. Below desktop, the text-side scrim spans the photograph for reliable contrast.
- Shared Container owns horizontal alignment. The text column is at most 40rem; the counter area is at most 52rem. Content begins below the measured header plus responsive breathing room.
- Hero actions are Button/NavigationLink compositions: **Start your journey** links to `/contact/` with an arrow; **View memberships** links to `/membership/` without a directions icon. Yellow primary and transparent outlined secondary use a 14px radius. Buttons stack below 640px and wrap horizontally above it. Destination pages remain existing rebuild shells.

## Header and counters

`Header` remains a Server Component that passes the original BrandLink and desktop/mobile navigation to `HeaderFrame`. That small client boundary uses the pathname and ResizeObserver. On Home, measurement sets `--home-header-height` and activates absolute overlay placement. Further size changes update the inset. Leaving Home or unmounting disconnects the observer and removes the custom property. Other routes use the in-flow charcoal header. Without JavaScript or ResizeObserver, Home also retains an in-flow header.

The Home overlay has a subtle 1px white-at-10% bottom divider matching the reference; interior header borders remain unchanged. The header stacking level is 40, mobile dialog/backdrop 50 and skip link 60. Header dropdowns retain their existing solid surface and keyboard behavior. No sticky header, new header CTA, navigation groups or provider is added.

`HomeHero` accepts validated `content` plus an optional `stats: ReactNode` composition slot. The homepage selects real HomeStats content when present, otherwise HomeStatsPreview; the homepage passes no statistics slot when preview is disabled and approved figures are absent. HomeStatsPreview also independently guards against rendering outside preview mode. Statistics render inside the hero, followed by Why choose us, Story and the temporary page inventory. The old band and its nested Containers/negative margins are removed.

All four existing counter records, value formatting, accessible final values, one-time animation and reduced-motion behavior remain. Preview figures keep their exact disclosure and are omitted outside preview mode; approved figures replace them without a preview notice. There is no new catalog or business claim.

The counter grid queries its available inline size: two columns from 20.5rem and four from 45rem, otherwise one column. With the shared gutters and default text size, Home uses one column below 360px, two from 360px, and four from 768px. Container-query rem thresholds let enlarged text fall back to fewer columns. Dividers are decorative: horizontal in a single column, vertical between adjacent columns. Labels wrap and the hero grows under enlarged text.

## Verification and limitations

Coverage checks route transitions/history, observer cleanup/resizing, no-JavaScript fallback, real CTA destinations, counter policy, keyboard focus, modal isolation, long text, five responsive widths, enlarged text and blocked assets. Browser-rendered scrims are sampled over a white replacement backdrop to check text contrast independent of the photograph. Screenshots and the complete README workflow are recorded in the QA checklist.

No dependency, lockfile, original photograph, business catalog, hosting, form delivery, legal approval or indexability change is required. This is a local implementation, not public-release approval. Manual screen-reader review, other browser engines and owner visual approval remain separate.
