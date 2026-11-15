# F01-C: Typography

Date: 2026-11-15. Status: **verified** for automated scope and native specimen review. Parent: [F01 design foundations](F01-design-foundations.md), R01/R03/R06 and F01-01/F01-03/F01-06.

## Scope and consumers

Apply the approved type hierarchy to the existing route shells and expose small CSS text roles for future compositions. Use the existing licensed local fonts. No page section, component, business content, dependency, font asset, color, gutter, radius or motion change belongs to this iteration. The supplied raster references remain unavailable; the parent specification supplies the typography values.

`src/styles/typography.css` owns base body/H1/H2/H3 defaults and component-layer opt-in roles. Base defaults allow later component utilities to override them. Body uses Inter 400, 1rem/1.6; leave the root at the browser default. H1 uses Barlow Condensed 700, `clamp(2.25rem, 1.5rem + 3vw, 4rem)`/1.1; H2 uses Barlow Condensed 600, `clamp(1.75rem, 1.25rem + 2vw, 3rem)`/1.15; H3 uses Inter 600, `clamp(1.375rem, 1.125rem + 1vw, 2rem)`/1.25. All use normal letter spacing and natural wrapping.

| Opt-in role           | Contract                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `type-display`        | Hero display, Barlow Condensed 700, `clamp(2.5rem, 1.5rem + 4vw, 5rem)`/1.05. Does not assign heading semantics.      |
| `type-control`        | Inter 500, 1rem/1.4 for future navigation and controls.                                                               |
| `type-control-strong` | Same control role, weight 600.                                                                                        |
| `type-hint`           | Inter 400, 0.875rem/1.5. A consumer may use a weight-500 utility.                                                     |
| `text-measure`        | Maximum inline size 65ch and `min-inline-size: 0`; opt in on long-form content. No global paragraph-width constraint. |

Heading levels follow structure, with one H1 per actual page. No global uppercase, forced line breaks, truncation or hidden overflow. Body wrapping must preserve long URLs, unbroken words, missing-content notices and labels under local fonts and system fallback. Text roles carry no interaction state or ARIA behavior; actual controls remain separately specified. Keep existing main constraints and heading margins for F01-D. H4–H6 have no new display role in this task.

## Acceptance matrix and task mapping

| Case    | Parent         | Scenario and expected result                                                                                                                                                                              | Verification                                                                                                                                         | Step    |
| ------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| F01-C01 | F01-01, F01-03 | Body, H1/H2/H3 and opt-in roles use specified sizes, weights, line heights, normal letter spacing and actual local families at 320, 375, 768, 1280 and 1920px. No synthetic font is used.                 | Computed styles, independent numeric clamp expectations and Chromium rendered-font inspection.                                                       | 1, 2    |
| F01-C02 | F01-03         | Long-form measure is at most 65ch and shrinks to its parent. Long headings, URLs, labels and explicit missing-content notices remain visible without horizontal page/element overflow at all five widths. | Native test-only DOM, geometry and screenshot review.                                                                                                | 1, 3    |
| F01-C03 | F01-01, F01-03 | With WOFF2 requests blocked, heading/body roles remain readable, wrap at 320px and a control remains keyboard operable using system fonts.                                                                | Blocked network responses, actual fallback font inspection, geometry and keyboard activation.                                                        | 1, 3    |
| F01-C04 | F01-03, F01-06 | User text enlargement and text-spacing overrides preserve visible content and operation; no heading text transform is imposed and real pages keep one H1.                                                 | Doubled root font size plus WCAG text-spacing overrides, geometry and semantics. This supplements, and does not replace, actual browser zoom review. | 1, 3, 4 |
| F01-C05 | F01-06         | Routes, landmarks, skip link, font delivery, surface/focus behavior, metadata, previews and static export remain intact.                                                                                  | Full README workflow and existing regression suite.                                                                                                  | 4       |

1. Write C01–C04 before styles and record failures against the previous exported build. Keep C05 regressions intact.
2. Apply base hierarchy and explicit reusable text roles; remove conflicting temporary H1 size/line height. Do not change heading margins or main layout.
3. Verify measures, five-width reflow, blocked-font fallback and user text overrides. Inspect native specimen screenshots; keep fixtures outside public routes and business catalogs.
4. Run the complete README quality workflow, update inventory/backlog and record actual results and limitations. End this iteration; F01-D is separate.

## Evidence and limitations

All four scoped desktop cases failed against the unchanged F01-B export before implementation: missing display role (16px instead of 40px), missing 65ch measure, incorrect fallback H1 size (32px instead of 36px), and incorrect enlarged H1 size (64px instead of 72px). These were expected missing-contract failures.

The global stylesheet now imports `src/styles/typography.css` and removes the conflicting temporary H1 size/line height and duplicate body leading. Existing H1 margins, main constraints, fonts, colors, routes, components and business records are preserved. Text-role classes are opt-in; stock component typography still needs adaptation in its consuming task.

The first implementation run revealed an overly strict vertical-overflow assertion: tight display leading produced 2–3px of visible glyph overhang, with equal client/scroll widths and `overflow: visible`. Corrected the test to distinguish visible ink from hidden/clipped or contained vertical overflow. No overflow was hidden and no specified line height was changed to satisfy the test.

| Verification                      | Actual result                                                                                                                                                                                                               |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scoped browser cases              | Eight desktop/mobile cases passed: all five viewport widths, numeric hierarchy metrics, actual local families, 65ch measure, long-text wrapping, blocked-font system fallback, keyboard operation and enlarged/spaced text. |
| TypeScript, ESLint and formatting | Passed.                                                                                                                                                                                                                     |
| Vitest                            | All 11 tests passed across four files.                                                                                                                                                                                      |
| Production build and export audit | Passed, retaining 24 template categories; 24 Windows segment files normalized and 26 HTML files audited.                                                                                                                    |
| Complete browser workflow         | 37 passed, one intentional viewport-specific skip, in 1.2 minutes. Existing route, 404, landmark/skip-link, indexing, font, color/focus and sampled axe checks passed. Matching Chromium availability check completed.      |
| Visual specimen review            | Inspected desktop/mobile screenshots from C02 for display/H1/H2/H3 hierarchy, Inter body/control/hint text and readable wrapping. The fixtures have no component layout or spacing design.                                  |

Specimens are injected only into browser-test DOM; no public fixture route or catalog record was added. Long-content geometry is checked before screenshot text is replaced with short representative labels for visual review. Test screenshots remain local generated artifacts.

Completed **specified -> tests written -> implemented -> verified** for the documented scope. Automated root-font enlargement is not actual browser zoom. Actual 200% zoom/400% reflow, screen-reader review, other engines, composed components and final visual approval require separate manual review. No public-launch approval is implied. Next task: **F01-D layout/motion only**.
