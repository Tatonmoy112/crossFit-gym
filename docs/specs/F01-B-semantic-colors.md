# F01-B: Semantic colors

Date: 2026-11-15. Status: **verified** for the documented automated scope and specimen review. Parent: [F01 design foundations](F01-design-foundations.md), requirements R02/R04/R06 and acceptance cases F01-02/F01-04/F01-06.

## Boundary and interfaces

Implement the approved light and charcoal palette, state-color roles and visible focus. Keep font delivery, typography sizing, layout, radii, animation and all page/component composition in their separate tasks. Business content, routes, packages, lockfiles, assets and client providers are unchanged.

Use the existing shadcn variables for background/foreground, card, popover, primary, secondary, muted, accent, destructive, border, input and ring. Add paired Tailwind color mappings for `primary-hover`, `primary-active`, `primary-border`, `link`, `disabled`, `disabled-foreground`, `selected`, `selected-foreground` and `selected-border`. These are color contracts for future consumers, not a new button/field API. Preserve unused chart colors; align sidebar semantic aliases with their surrounding surface rather than introducing another palette.

`data-surface="light"`, `data-surface="charcoal"` and `data-surface="yellow"` establish explicit local contexts and paint their background/foreground. Root defaults to light regardless of OS preference. `.light` and `.dark` are compatible scope markers. Light/yellow boundaries stop ancestor dark utility variants; another nested charcoal boundary starts a new dark scope. Use bounded CSS scopes for the Tailwind dark variant, following [Tailwind custom variants](https://tailwindcss.com/docs/hover-focus-and-other-states#registering-a-custom-variant) and [CSS scope boundaries](https://drafts.csswg.org/css-cascade-6/#scoped-styles). No theme switch or runtime theme detection is added.

Portaled compositions must explicitly mark their rendered surface; the trigger's color context does not cross a DOM portal. This task verifies surface boundaries, not a new dialog implementation. Do not combine conflicting surface markers on one element.

| Role                                       | Light                             | Charcoal                          | Yellow                                                                         |
| ------------------------------------------ | --------------------------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| Background / foreground                    | `#FFFFFF` / `#171717`             | `#202020` / `#FFFFFF`             | `#FFCC00` / `#171717`                                                          |
| Card/popover                               | White / primary text              | Charcoal / white                  | White / primary text; use an explicit light boundary for interactive contents. |
| Primary / foreground                       | `#FFCC00` / `#171717`             | Same                              | Same                                                                           |
| Primary hover / pressed / border           | `#E6B800` / `#CCA300` / `#202020` | Same                              | Same                                                                           |
| Secondary/muted/accent / foreground        | `#F5F5F5` / `#525252`             | `#171717` / `#F5F5F5`             | Same as light                                                                  |
| Link / focus ring                          | `#171717`                         | `#FFCC00`                         | `#171717`                                                                      |
| Decorative border / essential input border | `#D4D4D4` / `#737373`             | `#737373` / `#737373`             | Same as light                                                                  |
| Disabled / foreground                      | `#F5F5F5` / `#525252`             | `#171717` / `#F5F5F5`             | Same as light                                                                  |
| Selected / foreground / border             | `#F5F5F5` / `#171717` / `#171717` | `#171717` / `#F5F5F5` / `#FFCC00` | Same as light                                                                  |
| Error text/border                          | `#B91C1C`                         | `#FCA5A5`                         | `#991B1B`                                                                      |

Yellow is a surface/focus context, not the default page. Its darker error color is required because the light-context red against yellow is only 4.28:1; `#991B1B` against yellow is 5.50:1. Essential borders on yellow use the input role (3.14:1), not its decorative border. Primary controls use the explicit primary border. Error messages inside white cards use a light boundary and light-context error role.

Link text retains an underline in every state. Primary consumers use the specified opaque hover/pressed colors instead of opacity. Disabled consumers use native disabled behavior and opaque paired colors; selected consumers expose their state and an additional text/shape cue. Invalid fields associate an error message and do not rely on red alone. Stock shadcn modules are not globally redesigned here: their individual variants, alpha colors and disabled/selected behavior still require U01/U03/feature adaptation and tests before use.

Use a solid, opaque 3px focus outline with 3px offset and the local ring color, including on controls with `outline-none` utilities. Place this focus protection outside Tailwind layers so utilities cannot silently erase it. In forced-colors mode use the system Highlight outline, retain automatic forced-color adjustment, and do not force brand colors over the user's palette. Clipping, focus traps and sticky-header overlap remain consumer/layout checks.

## Acceptance cases written before implementation

| Case    | Parent | Expected result                                                                                                                                                                                                                          | Verification                                                                                                                                               |
| ------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F01-B01 | F01-02 | Approved actual surface/primary/link/error pairs render correctly. Normal text meets 4.5:1 and applicable essential borders meet 3:1 on light, charcoal and yellow. Card/popover/secondary/muted/accent roles use their paired values.   | Playwright computed paints normalized to sRGB with independent WCAG contrast calculations.                                                                 |
| F01-B02 | F01-02 | Primary normal/hover/pressed, native disabled, selected and invalid specimens use the semantic roles. Disabled opacity stays 1, selected text and aria-pressed provide a non-color cue, and invalid fields retain associated error text. | Native test-only DOM consuming real generated Tailwind utilities; pointer/state checks in desktop/mobile. Hover is asserted only where hover is supported. |
| F01-B03 | F01-02 | Nested charcoal/light/charcoal boundaries, yellow boundaries, class compatibility and a separately mounted light surface resolve locally. OS dark preference does not recolor the page.                                                  | Playwright nested inheritance and dark-variant probes; no theme provider or public fixture route.                                                          |
| F01-B04 | F01-04 | Keyboard focus has the solid 3px local-color outline and 3px offset on all three surfaces, even with outline-none. Forced-colors uses a visible system outline.                                                                          | Playwright keyboard interaction, computed outlines and forced-colors emulation.                                                                            |
| F01-B05 | F01-02 | Representative native specimens have no sampled automated WCAG A/AA violations and fit the viewport.                                                                                                                                     | axe plus geometry checks at desktop/mobile and 320px; this does not certify unmounted shadcn components.                                                   |
| F01-B06 | F01-06 | Font delivery, complete route inventory, noindex/metadata, 404 behavior, landmarks and static export remain intact.                                                                                                                      | Complete README quality workflow, including existing font/route/accessibility tests.                                                                       |

Test fixtures are injected only in browser-test DOM and use actual generated semantic utility classes. Do not inject substitute test CSS, add fixture records to catalogs, or assert CSS source strings. Tests calculate contrast from actual rendered color/opacity; alpha colors are not silently treated as opaque.

## Small implementation steps

1. Write F01-B01 through B05 and confirm expected failures on the unchanged F01-A export; retain B06 regression coverage.
2. Map the approved semantic variables and additional state roles. Add local surfaces and bounded dark utilities; leave fonts and layout unchanged.
3. Replace hardcoded shell link/focus colors, keep links underlined, and protect visible/system focus without changing component modules.
4. Build and run scoped browser tests, inspect specimens, then run the complete README workflow. Record actual evidence, limitations and the next task; stop after F01-B.

## Evidence and limitations

Before implementation, all five scoped desktop tests failed against the unchanged F01-A export: surface markers were unstyled, primary/state colors were neutral, nested scope colors were incorrect, outline-none removed visible focus, and axe found 4.34:1 muted-text contrast. These are expected missing-contract failures, not test infrastructure failures. F01-B06 retains the existing full regression workflow.

`src/styles/colors.css` owns the semantic surface/state colors and unlayered focus protection. The global stylesheet imports it, maps the extra Tailwind state roles, bounds dark utilities with CSS scopes, and uses semantic link colors. No stock component module, font, route, content record, package or lockfile was changed by this task.

| Verification                            | Actual result                                                                                                                                                                                                     |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scoped desktop/mobile cases             | All ten passed: actual surface paints/contrast, states, nested boundaries, OS preference, keyboard/system focus, axe and 320px reflow.                                                                            |
| TypeScript, ESLint and final formatting | Passed.                                                                                                                                                                                                           |
| Vitest                                  | 11 tests passed across four files.                                                                                                                                                                                |
| Production build and export audit       | Passed; 24 template categories retained, 24 Windows segment files normalized and 26 HTML files audited.                                                                                                           |
| Complete browser workflow               | 29 passed and one intentional viewport-specific skip in 1.2 minutes, including existing font, route, metadata, 404, skip-link and sampled accessibility coverage. Matching Chromium availability check completed. |
| Specimen review                         | Desktop/mobile screenshots from F01-B05 inspected for readable light/charcoal/yellow text, state colors and wrapping. These are intentionally uncomposed native test fixtures, not a page or component design.    |

Track **specified -> tests written -> implemented -> verified**. Only the scoped specimens are verified here. CSS scope behavior is verified in the configured Chromium engine; other browser engines remain unverified. Stock component variants and their alpha/disabled/selected styles, actual portals, clipped/sticky layouts, manual screen-reader/zoom review and final visual approval require later review. Chart colors were retained without a chart-design claim. No public demo route, provider or business content was added. Next task: **F01-C typography sizing only**.
