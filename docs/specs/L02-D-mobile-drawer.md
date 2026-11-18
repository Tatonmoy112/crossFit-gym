# L02-D: Branded mobile drawer

Date: 2026-11-18. Implements the owner-approved charcoal/yellow, right-hand drawer with expandable navigation groups. Supersedes L02-B's floating light panel and permanently expanded mobile list; desktop dropdowns and the static footer remain unchanged.

## Layout and visual design

- Full-height `100dvh` panel, flush to the right. Below 480px it fills the viewport; at/above 480px it uses the smaller of 448px and the viewport minus 32px, with 24px left corners. The existing 64rem desktop breakpoint remains.
- Explicit charcoal surface, yellow top accent, supplied logo/name, white navigation text, subtle dividers and an icon close control. The accessible “Site navigation” title is visually hidden. Brand text remains available if its image fails.
- The padded header stays visible. One scrollable body contains navigation and contact actions, with safe-area padding. Contact actions sit toward the bottom when there is room and scroll naturally with the navigation on short screens or enlarged text.
- Category headings use Barlow Condensed at 1.75rem, with at least 56px triggers; Inter page links use 1.125rem and at least 48px targets. Current links have yellow text, semibold/underline emphasis and a slim yellow marker. Ordinary navigation backgrounds remain transparent.
- The lower section has a yellow Contact the gym link to the existing Contact page, native Call link using the supplied number, and the existing Uttara caption. No hours, services, delivery claim or business content is invented.
- A 65% black backdrop uses blur when supported. Drawer/backdrop/group motion uses the existing 200ms overlay role; chevrons use the existing control duration. Global reduced-motion and forced-color support remain active.

## Content and interaction

`MobileNavigation` remains a server wrapper with optional className only. It supplies validated groups, a server-rendered BrandLink slot and Zod-validated presentation/contact content from `src/content/mobile-navigation.ts`. The client boundary receives serializable content and the React slot; it imports business-content types only. No new dependencies or shared providers are added.

- Existing Radix Dialog and Accordion primitives supply modal and disclosure behavior; stock UI wrappers are unchanged. Fourteen destinations keep their existing labels/order/hrefs.
- A single collapsible group is expanded at most. Each opening resets to the current page's group; Home/unmatched paths default to Training, with the first supplied group as the fallback if Training is absent. Users may collapse all groups. Shared normalized exact/section matching retains Products/Supplements compatibility.
- Initial focus goes to Close menu. Tab/Shift+Tab stay inside; accordion triggers support native Radix keyboard operation. Escape, the close control and exposed backdrop dismiss with Menu focus restored. Background isolation and scroll locking remain.
- Normal navigation, brand, contact and telephone link activation close the drawer; modifier clicks retain native behavior. Telephone testing cancels the native default so QA does not place a call. Path changes reset the drawer; crossing to desktop dismisses and sends focus to the existing main fallback.
- With JavaScript disabled, the modal remains closed as before; directly available server-rendered footer links and contact actions provide navigation.

## Verification and limits

Component tests cover every group/destination, single-open/collapse-all behavior, current matching, default/reset rules, modifier selection and brand/contact/call dismissal. Content tests verify source-backed phone/location values, registered Contact routing and unsafe destination rejection.

Browser coverage includes real header/history integration, 320/375/390/480/768/1023 widths, short screens, doubled/spaced text, pinned close control, natural inner scrolling, modal isolation/scroll cleanup, all fourteen destinations, native contact actions, failed fonts/logo, reduced motion, forced colors and axe checks. Geometry checks wait for the drawer entrance animation before measuring its settled position. Final executed results and visual-review evidence belong in the QA checklist.

Routes, indexing, maintenance pages, desktop behavior, footer composition, original references and the pnpm lockfile are preserved. Owner visual approval, manual device/screen-reader review and existing public-launch gates remain open.
