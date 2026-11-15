# F01-A: Local fonts

Date: 2026-11-15. Status: **verified** for the automated scope below. Parent requirements: [F01-R01 and F01-R06](F01-design-foundations.md); acceptance cases F01-01 and F01-06. Manual/visual limits remain explicit below.

## Task boundary and contracts

Install only Barlow Condensed 600/700 and Inter 400/500/600, upright WOFF2, with original licenses and pinned source provenance. Include exact copies of both licenses in the exported artifact at `/fonts/licenses/barlow-OFL.txt` and `/fonts/licenses/inter-LICENSE.txt`. Use one shared `next/font/local` module, root font variables and the existing Tailwind `font-heading` / `font-sans` roles. Inter becomes the body face; Barlow Condensed is exposed for later display compositions. Keep Arial, Helvetica and sans-serif fallback, `font-display: swap`, and disable synthetic font styling.

Use static files for exactly the selected weights. Disable automatic preloading for both multi-file families so that unused weights and display fonts are not downloaded by every shell. The browser discovers the body face from CSS and loads each additional weight when consumed. Font loading has no runtime third-party requests, build-time remote requests, new provider or package dependency. Preserve all routes and static-export behavior.

Excluded: heading sizes/line heights, semantic colors, spacing/layout, components, business content, image reconciliation, theme controls and other F01 tasks. Test probes exist only inside Playwright-created DOM; no fixture route or business record is added.

## Test cases before implementation

| Case    | Parent | Scenario and expected result                                                                                                                                                                                                                                             | Verification                                                                                 |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| F01-A01 | F01-01 | Cold exported page: body uses Inter; role probes at all five selected weights use the corresponding custom font rather than a system substitute. Loaded font faces are upright, swap and cover the requested weight. All font requests are successful same-origin WOFF2. | Playwright on desktop/mobile; FontFaceSet descriptors and Chromium rendered-font inspection. |
| F01-A02 | F01-01 | Delay font responses: fallback text and a control remain visible, rendered with system fonts, while pending requests exist. Release responses: roles switch to the intended custom fonts.                                                                                | Playwright request gating and rendered-font inspection before/after release.                 |
| F01-A03 | F01-01 | Abort all font requests: both roles retain readable, wrapped fallback text at the project viewport and 320px. A fixture control works, the skip link focuses main, and real inventory navigation still works. Expected failed requests are isolated to this case.        | Playwright request interception, font inspection, geometry, click and keyboard assertions.   |
| F01-A04 | F01-06 | Route inventory, 404s, landmarks, metadata, preview noindex, sitemap separation and accessibility survive integration.                                                                                                                                                   | Complete README workflow and targeted preview/robots/sitemap assertions in the font suite.   |

Do not assert generated font filenames or Next.js class hashes. Check actual font loading/rendering and semantic role behavior. Existing regression tests remain intact.

## Ordered implementation steps

1. Write F01-A01 through F01-A03 browser tests and F01-A04 metadata checks; run them against the current export and record expected font-contract failures.
2. Download the five WOFF2 files and two licenses from pinned official revisions. Verify Git blob hashes and WOFF2 signatures; record source URLs, file sizes and SHA-256 hashes with the assets.
3. Add shared local definitions and root variables, map Tailwind font roles without variable cycles, and disable synthetic styling. Do not apply the later heading scale.
4. Build the static export, run the scoped browser cases, then the complete README quality workflow. Verify font metadata and licensing provenance; update status with actual evidence and limits.

## Evidence and status

Tests were written before font integration in `tests/e2e/fonts.spec.ts`. On the unchanged static export, the desktop run failed F01-A01 because no custom font face existed and failed F01-A02/F01-A03 because no font requests existed; F01-A04 passed. This establishes the expected missing behavior. An earlier run that reused a development server on port 3000 was discarded; static QA now owns a separate port (3100 by default, configurable with `PLAYWRIGHT_PORT`) and refuses to reuse an existing server.

The exported-license check was also written before adding the public license copies: it failed with HTTP 404, then the original notices were copied byte-for-byte into the public export inputs. Font assets and metadata were verified against official Git blob hashes, WOFF2 signatures and embedded weight/style metadata. `src/styles/fonts/sources.json` records pinned source revisions, original URLs, sizes, SHA-256 hashes and public license paths. Barlow uses revision `dc2940e2e04ef4ec96c07e23e0f02aefbddd343b`; Inter uses v4.1 revision `e3a3d4c57d5ecc01453a575621882a384c1995a3`. The five font files total 461,996 bytes before HTTP compression; unused weights are not preloaded. No subsetting or font modification was performed.

The shared loader, root variables, Tailwind role mapping and synthetic-style protection are implemented. Final complete-workflow results after adding the exported licenses:

| Check                                           | Actual result                                                                                                                                                                                              |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript, ESLint and final project formatting | Passed.                                                                                                                                                                                                    |
| Vitest                                          | 11 tests passed across four files.                                                                                                                                                                         |
| Production static build                         | Passed; all 24 template categories retained; 24 Windows segment files normalized.                                                                                                                          |
| Export audit                                    | 26 HTML files passed internal-link/asset/H1/description/preview checks.                                                                                                                                    |
| Matching Chromium availability                  | Install/check command completed using `.cache/ms-playwright`.                                                                                                                                              |
| Complete Playwright suite                       | 19 passed, one intentional viewport-specific skip, in 40.2 seconds. All eight font cases passed across desktop/mobile, including exact exported-license delivery.                                          |
| Asset/provenance audit                          | Five upright weights and seven source asset hashes verified; both public and exported license copies match the originals byte-for-byte. Dependency manifest and both pre-existing lockfiles are unchanged. |

No test fixture is present in real routes or catalog data. The viewport/route regression checks, unknown-path 404 checks and sampled automated WCAG A/AA scans also passed. Documentation checks resolve the updated relative links. The test runner's isolated server was run with permission to manage its own subprocesses; a restricted-process cleanup delay in preliminary runs did not establish an application defect. No existing development server was stopped.

Automated Chromium rendering checks do not establish full manual accessibility, browser zoom, screen-reader review, visual approval or zero layout shift. Other browser engines and actual branded display compositions remain unreviewed. Selected font assets are local and builds need no remote font fetch; this is not a claim that every build step was tested with networking disabled. Next task after completion is F01-B semantic colors.
