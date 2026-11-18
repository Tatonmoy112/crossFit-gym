# L02-C: Header dropdowns, static footer links and maintenance destinations

Date: 2026-11-18. Revised at the owner's request: footer dropdowns are removed, the earlier visible-column layout is restored, and header/footer navigation background highlights are removed. Earlier shared-dropdown verification remains historical in the QA checklist.

The mobile presentation is subsequently redesigned in [L02-D](L02-D-mobile-drawer.md): a branded charcoal drawer with one expandable group at a time and native Contact/Call actions. This specification's desktop dropdown and static footer behavior remains current.

## Header interaction and styling

The server-composed Header passes validated records to the header-only client DropdownNavigation through DesktopNavigationMenu. Its props are groups and optional className; there is no footer placement API or footer disclosure state. The mobile header dialog receives the same expanded content. State stays local, without dependencies, providers, backend or URL writes.

- Four groups expose fourteen destinations as listed in `../sitemap.md`.
- Native details/summary preserve no-JavaScript pointer/keyboard access, controls IDs, current-section descriptions and visible focus. Native grouping keeps one header disclosure open.
- Fine-pointer hover opens after 150ms; leaving starts a 200ms dismissal delay. Entering the panel cancels it, and its wrapper bridges the 8px gap. Coarse-pointer hover does not open menus.
- Pointer click pins a hover preview and the next click closes it. Keyboard Enter/Space toggle directly; Arrow Down opens and focuses the first link. Hover preserves panels containing keyboard focus.
- Escape cancels pending hover, closes an open panel and restores trigger focus. Outside interaction, ordinary link selection, route changes and breakpoints dismiss appropriately. Timers/listeners clean up; modified links keep native behavior.
- Desktop panels open downward, align to their triggers and use measured horizontal correction within a 16px viewport gutter. The header still changes to its mobile dialog below 64rem.
- Hover, pressed, open and current navigation states use transparent backgrounds and local readable text. Hover/focus/open states underline; current destinations retain semibold/underline emphasis. This includes mobile menu links and navigation controls. Dropdown panel surfaces, borders, shadows, 16px corners and 44px targets remain. Focus outlines, reduced motion and forced colors remain supported.

## Footer composition

Footer is server-rendered with static group headings and all fourteen links visible. Its container queries restore one column below 18rem of available space, two columns from 18rem and four from 64rem; the contact/navigation split also starts at 64rem. No summary, dropdown panel, chevron, footer click/hover state or footer-specific dropdown CSS remains.

Regular footer navigation, phone, directions, social and supplied legal links use transparent hover/pressed backgrounds and underline feedback on hover or keyboard focus. Styling is local; shared NavigationLink defaults elsewhere are unchanged. Existing contact information, supplied-content limitations, decorative wordmark, brand link and yellow CTA retain their treatment. Without JavaScript, all footer links remain directly available.

## Maintenance pages

The validated ten-page maintenance registry, route files, page-name H1s, preparation copy, Home/Contact links and individual canonicals remain. Programs, Coaches, Facilities, Schedule, Gallery, FAQ, Blog, Affiliates, Locations and Careers always set `noindex, nofollow` and stay outside the sitemap even when indexing is enabled. Unknown/detail/structure-preview and unavailable legal URLs retain 404 behavior. Business content, previews, original inputs, pnpm lockfile and the long-term 24-template scope remain.

## Verification

Footer component/browser checks require four headings, fourteen visible links and no disclosure controls, including without JavaScript. Browser interaction checks inspect transparent backgrounds while hovering, pressing, opening and selecting current navigation, along with underline feedback, keyboard focus and working header disclosures. Existing responsive/enlarged-text, history, reduced-motion, forced-color, asset-failure and axe coverage remains.

Run the full README quality workflow and record actual results in `../qa-checklist.md`. Owner visual approval, manual device/screen-reader review, business/legal content and existing release gates remain outstanding.
