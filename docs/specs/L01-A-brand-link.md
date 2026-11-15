# L01-A: Brand link

Date: 2026-11-15. Status: **verified for the documented automated scope; manual review remains open**. Parent: [rebuild plan L01](../component-rebuild-plan.md), following [U01-B NavigationLink](U01-B-navigation-link.md).

## Purpose, references and boundary

Deliver one `BrandLink` for the future header/footer: the supplied gym mark and existing business name link to Home. Consumers receive the same identity and destination; this component adds no heading, landmark, menu, route matching, tagline, service claim or business action. Header/footer assembly and desktop/mobile navigation remain separate iterations. There is no existing brand placeholder in the neutral route shells, so keep the component isolated until header assembly rather than adding a temporary global layout.

Reviewed `info/logo.jpg` (180x180), `public/images/brand/logo_with-bg.png` (1254x1254, 911,067 bytes) and `logo_without-bg.png` (1254x1254). The clean white-background PNG matches the supplied running-figure identity; the transparent candidate has visible colored residue around its edges. Select the clean candidate for this iteration, retain its white plate on every surface, and preserve all originals. This is an implementation choice pending final visual approval; no editable design authority or current header/mobile reference is available.

Create only a resized/encoded 192x192 WebP derivative, `public/images/brand/brand-mark.webp`, without recoloring, redrawing, cropping or background removal. Keep the full square image and record source/output hashes, dimensions, encoding and byte count in `public/images/brand/brand-mark-source.json`. Target at most 20 KiB; no runtime optimization endpoint or third-party request. Existing cover/social-preview references are unrelated and remain explicit backlog items.

## Content, API and behavior

Store the validated brand record in `src/content/brand.ts`, deriving the name from `site.name` and using the existing image schema for asset metadata. Fix the destination to `/`. Export a server-compatible `BrandLink` from `src/components/layout/brand-link.tsx` with optional `className` only; callers do not replace its identity, destination, image or accessible name. Future composition owns placement and any current-page logic.

Reuse NavigationLink for native link semantics, disabled prefetch, foundation state colors, focus and reduced-motion handling. Render a local unoptimized Next Image with intrinsic 192x192 dimensions, eager loading and async decoding; CSS displays a 44px square at the default root size with object-contain, no distortion/cropping, no filter and no image animation. The supplied white plate stays intact. Mark the redundant image decorative (`alt=""`); visible text always shows the existing gym name in Inter 600, 1rem/1.4. Append visually hidden ` home` so the link has the name `Crossfit Gym home` without duplicate logo announcements. Image or font failure must leave the visible name and functional link available.

Use 8px link padding/radius, a 12px image/text gap and at least 44px targets. At normal size the image plus padding makes the link at least 60px tall. Remove the ordinary navigation underline for this recognizable brand identity; semantic hover/pressed surfaces and the protected focus outline remain. Keep natural text wrapping, a shrinkable text column and maximum inline size of 100%. Do not hide identity text on mobile. Consumers must provide the outline's 6px clearance. Respect root text enlargement, text spacing and 320px reflow; no fixed overall height, ellipsis or hidden overflow.

## Requirement, test and task mapping

| ID      | Requirement and expected result                                                                                                                                                                             | Verification                                                                                  | Steps   |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------- |
| L01-A01 | One Home link uses the real visible name and accessible name `Crossfit Gym home`; image is decorative, and no extra heading/button/landmark or new tab is introduced.                                       | Testing Library; actual browser Enter navigation.                                             | 1, 2    |
| L01-A02 | Clean supplied mark has a local decodable derivative, preserved aspect ratio, intrinsic dimensions, <=20 KiB transfer and recorded provenance; originals remain byte-identical.                             | Component test; browser image decode/network and export-byte checks; source hash audit.       | 1, 3    |
| L01-A03 | All three surfaces have readable Inter control text, 44px image, >=60px normal target, 8px radius, appropriate hover/pressed states and visible keyboard focus.                                             | Actual-component browser specimens, computed metrics/contrast, Tab/Shift+Tab and sampled axe. | 1, 2, 4 |
| L01-A04 | At 320/375/768/1280/1920px and doubled/spaced text, identity reflows without clipping. Blocked images/fonts keep a readable name and usable link; reduced motion/forced colors preserve keyboard operation. | Browser reflow, failure/media emulation and actual font fallback review.                      | 1, 4    |
| L01-A05 | All 24 templates, metadata/indexing, routes, existing components, content and static export remain unchanged. Component stays unmounted until header assembly.                                              | Complete README workflow; protected-file audit; no new public fixture route.                  | 4, 5    |

1. Write two focused semantic/image component tests and three browser acceptance cases first. Use a plain unstyled text link as a runnable baseline, recording behavioral failures. Keep test fixtures outside business catalogs/routes.
2. Add the validated brand record and compose the smallest BrandLink with NavigationLink, decorative image and visible/accessible naming (A01/A03).
3. Generate the small derivative from the clean original with the installed image encoder, preserving source bytes and recording provenance (A02).
4. Verify actual states, keyboard operation, five widths, enlarged/spaced text, failure fallbacks, reduced motion and forced colors (A03/A04). Do not assemble the header just to host this component.
5. Run the complete quality workflow, inspect desktop/mobile specimens and update this specification, inventory, backlog and QA evidence (A05). End this iteration.

## Evidence and limits

Before implementation, both component tests failed: the plain link lacked the Home accessible-name cue and image/dimensions. All three runnable desktop browser cases failed at the missing Home name contract. The baseline was a plain anchor, so failures were behavioral rather than import errors. A subsequent component failure caught the hidden Home cue concatenating with the name; an explicit text separator fixed the accessible name. Browser tests use the existing TypeScript compiler to load actual local source/dependencies and Next's CJS entry points without mocks.

Both component cases now pass, and the full unit suite passes all 38 tests across seven files. All six scoped desktop/mobile browser cases passed in 33.3 seconds. They verify local image decode/export bytes, Home keyboard navigation, actual states/contrast/geometry on the three surfaces, normal and failed-asset reflow at all five widths, doubled/spaced fallback text, system font fallback, reduced motion and forced colors. Inspected desktop/mobile screenshots and the encoded image. The actual WebP is 2,604 bytes at 192x192; source and encoding details/hashes are recorded in its manifest. A protected-file audit confirms all 137 captured route/content/style/component/input/asset/package/config files remain unchanged.

Production build passed after correcting a test-only unsupported Testing Library option. Typecheck, ESLint, final formatting and export audit passed; the build normalized 24 Windows segment files and the audit checked 26 HTML files. Matching Chromium availability check completed. Complete browser workflow: **73 passed, one intentional viewport-specific skip in 2.9 minutes**, including all six brand cases and existing route, 404, metadata/indexing, font, color, typography, Button, NavigationLink, layout/motion and sampled accessibility regressions.

| Cases | Result                                                                                                                                                                                              |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01   | Single named Home link, decorative image and no extra landmark/heading/button pass component checks. Native Enter reaches Home in both browser projects.                                            |
| A02   | 192px image decodes locally, matches exported/source bytes and the provenance hashes, and remains well below the 20 KiB budget. Source inputs remain unchanged.                                     |
| A03   | Three-surface text contrast, Inter 600 metrics, 44px square image, >=60px normal height, radius, state surfaces, keyboard/focus clearance and sampled axe pass. Desktop/mobile specimens inspected. |
| A04   | Normal/failed-asset identity fits all five widths. Doubled/spaced fallback text fits 320px; real system fallback, reduced motion and forced-colors keyboard navigation pass.                        |
| A05   | Full quality workflow and 137-file audit pass. No existing route/content/style/component or configuration changed, no package was added and no public fixture route/header was introduced.          |

Completed **specified -> tests written -> implemented -> verified** for this scope. Browser tests render actual component source; isolated markup does not establish BrandLink framework hydration or header layout. Existing About recovery-link tests retain real Next hydration coverage. Full manual browser zoom, screen-reader review, other engines and final visual approval remain separate. No public launch, image-library cleanup or complete global shell is implied.

Next task: **L02-A desktop navigation only**, with a focused specification and tests first; mobile navigation and header assembly follow separately.

2026-11-16 integration update: [L01-B header assembly](L01-B-header-assembly.md) now mounts this component in the root layout and verifies real App Router/history and responsive focus behavior. The evidence above records the earlier isolated iteration; manual visual/accessibility limitations remain.
