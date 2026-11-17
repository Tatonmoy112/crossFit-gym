# H01-C: Home stats band

Update 2026-11-17: [H01-A3](H01-A3-home-hero-redesign.md) supersedes the hero presentation/actions, counter placement and Home-only header placement described below. Historical acceptance results remain recorded for the earlier implementation.

Owner refinement (2026-11-16): appended **30+ Certified Trainers** as the fourth value in the currently displayed preview counter, with owner-supplied provenance. The existing three example figures and preview/release boundaries remain unchanged; no coach profiles or credential verification were invented. The existing four-item schema and responsive component support it without layout or dependency changes. Tests were updated first: three assertions failed for the absent fourth entry, then passed after adding it. Six focused Chromium cases pass, including four-value animation completion, exact trainer label, no-JavaScript final values and enlarged-text reflow. See the latest [QA record](../qa-checklist.md) for final full-workflow results.

Status: **verified for the documented scope**. Date: 2026-11-16. This is a Home section directly under the [hero](H01-A2-home-hero-design.md), built from an owner-supplied style reference: a dark band reading "10K+ Members transformed │ 4.9★ Average rating │ 5+ Years stronger together".

## Owner decisions (2026-11-16)

1. **Approved figures remain empty.** No real business figures have been supplied. The owner subsequently requested random numbers to see the section. Show deterministic example figures only while `site.preview` is true, with example labels and a visible notice that these are not verified gym statistics. Keep that data in `src/content/previews`, separate from approved content and test fixtures. Never show examples when preview is false; approved statistics take priority. The existing readiness requirement remains unresolved.
2. **Placement:** a separate charcoal band directly under the hero's V-cut, before the story section.
3. **Animation:** count up once when scrolled into view.
4. **Framework:** no new library. The band reuses the installed shadcn `Separator`, `Container` and the existing type and surface roles. The count-up is a small local client component built on browser APIs.

## Contract

### Content

`homeStatsSchema` in `src/schemas/content.ts` describes `homeStats` in `src/content/home.ts`:

- `heading` is nonblank.
- `items` has 0–4 entries, each with:
  - `value`: a finite number ≥ 0;
  - `decimals`: 0, 1 or 2;
  - `suffix`: a visual string, which may be empty;
  - `suffixLabel`: an optional nonblank spoken replacement for the suffix;
  - `label`: nonblank;
  - `source`: nonblank provenance. It is required and never displayed.

The real data is `{ heading: "Crossfit Gym in numbers", items: [] }`.

### HomeStats

`HomeStats({ content })` in `src/features/home/home-stats.tsx` is a Server Component.

- **Empty items:** returns `null`.
- **Section:** `<section aria-labelledby="home-stats-title" data-surface="charcoal">` with an `sr-only` H2 and a `Container`.
- **Items:** a `<ul>` of `<li>`, each with a value line above an uppercase label.
  - **Value:** Barlow Condensed 700, white, `tabular-nums`.
  - **Label:** Inter, 14px, uppercase, `0.08em` tracking, muted foreground.
  - **Suffix:** visual. When `suffixLabel` exists, the suffix is `aria-hidden` and `suffixLabel` is `sr-only`.
- **Dividers:** decorative shadcn `Separator`s between items, so they are never exposed as `role="separator"`. They are vertical at 640px and up, where the items form a row, and horizontal below 640px, where the items stack.
- **Placement:** a negative top margin equal to the hero's V-cut depth (`1.5rem`, `3rem` from 768px) with matching extra padding. The cut triangles then show charcoal, not the page background.
- **No links, buttons, forms or live regions.**

### CountUp

`CountUp({ value, decimals })` in `src/features/home/count-up.tsx` is a client component, alongside a pure `formatStat(value, decimals)` helper using `Intl.NumberFormat("en")`.

- **Server render and no JavaScript:** shows the final value.
- **Structure:** an `aria-hidden` visual span holds the animated text, and an `sr-only` span always holds the final value.
- **Mount:**
  - Under reduced motion, or without `IntersectionObserver` or `matchMedia`, it stays final.
  - Otherwise it shows 0. On first intersection it animates to the value over 1500ms with ease-out (`requestAnimationFrame`), ending exactly on the value. It never overshoots and runs once.
- **Preference changes:** enabling reduced motion during counting cancels it immediately and restores the final value. Changed props clean up the old animation and use the new value. Screen-reader text is always final.
- **Unmount:** cancels the animation frame, disconnects the observer and removes the preference listener.
- **Layout:** an invisible final-value span sizes the wrapper; a tabular-number visual overlay counts without changing that width.
- **Animation ownership:** React owns the final SSR text; the effect updates only the decorative visual span, without repeated React renders.

### Preview placement

`HomeStatsPreview` is a focused Server Component gated by `site.preview`. It composes HomeStats with a visible static note: "Example figures for layout preview only. These are not verified gym statistics." The separately Zod-validated preview record uses 1,200+ example clients, 4.8 example rating and 5+ example years. These are illustrative values, not business claims. Home composes hero -> approved statistics or preview fallback -> story. No extra route, indexing entry, framework or dependency is introduced. Preview indexing/release guards remain unchanged.

## Acceptance matrix

| ID      | Scenario / expected result                                                                                                                                                                                                            | Verification                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| H01-C01 | The real `homeStats` has no items. The schema rejects negative, non-finite, unsupported-decimals, blank-label, blank or missing-source, blank-suffixLabel and five-item data. `formatStat` output is exact.                           | Unit tests                    |
| H01-C02 | Empty content renders nothing. A fixture gives a named region with an `sr-only` H2, list items read as value + label, the spoken suffix label, decorative separators, and no interactive elements. Server HTML contains final values. | Component tests               |
| H01-C03 | CountUp under reduced motion and without an observer stays final. Intersecting goes from 0 to exactly the final value without overshoot and only once. Unmount cleans up. The `sr-only` text is always final.                         | Component tests (jsdom)       |
| H01-C04 | Fixture under the real hero: typography and colors on charcoal; vertical separators at 1280px and horizontal stacking at 375px; no overflow at 320–1920px; the V-cut corners show charcoal; zero axe violations.                      | Playwright                    |
| H01-C05 | In the browser, the count starts at 0 below the fold, reaches the final value after scrolling into view, and keeps a stable width. Reduced motion shows the final value at once. A no-JavaScript render shows final values.           | Playwright                    |
| H01-C06 | Real Home places clearly labeled example figures between hero and story while preview is enabled. Examples disappear outside preview; approved statistics replace examples. Home remains noindex. Full README workflow passes.        | Component; Playwright; README |

Workflow: **specified → tests written → implemented → verified**.

## Test-first evidence

The existing 27 scoped unit/component cases passed before changes. Before production edits, seven additional edge/integration cases produced four failures and three passes: live reduced-motion changes left the intermediate value (844), missing matchMedia threw, changed props retained stale visual text (0), and Home had no preview counter. All four failures are resolved; the scoped unit/component coverage now totals 37 cases.

The visual reservation regression also failed before its fix: the tabular overlay started at x=55.89 while its proportional reserve started at x=64. The reserve now inherits tabular numerals too. Corrected desktop/phone screenshots have been inspected. The enlarged-text test waits two animation frames after viewport changes so it measures settled layout rather than the foundation's 0.01ms responsive transition; the overflow condition itself is unchanged. Both targeted reflow cases pass.

All 193 unit/component tests across 27 files, strict typecheck, lint, formatting, static build, matching Chromium check and export audit (26 HTML files) pass. Final full-browser rerun: **188 passed, two intentional viewport/hover skips in 3.0 minutes**, including all 18 counter cases and eight story cases. All 24 templates, supplied originals, approved catalogs, dependencies, pnpm lockfile and release gates are preserved. The counter/story browser coverage includes real preview placement, noindex, real no-JavaScript final values, fonts/preferences, five widths, fixture semantics/styles, V-cut geometry, count-once behavior and stable digit width. Corrected desktop/mobile screenshots have been inspected and copied to `.cache/qa/home-stats/`.

Manual screen-reader, actual browser-zoom, other engines and owner visual approval remain open. No approval of the illustrative values as business statistics or of public launch is implied. Stop after this component; discovery links and other page sections remain separate tasks.
