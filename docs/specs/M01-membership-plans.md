# M01: Membership Plans page

Rebuilds the existing `/membership/` route using the owner-approved nine-section plan from chat on 2026-11-17. The new design uses a charcoal split hero with the approved gym photograph, centered introduction, three white editorial pricing cards, four proposed benefit tiles, a native comparison table, joining steps, six FAQ disclosures, a yellow final CTA and pending membership-information notice. Original routes and homepage plan content remain intact.

## Content boundaries

`src/content/membership-page.ts` owns validated page/SEO labels and safe inquiry guidance. `src/content/previews/membership-plans.ts` contains the supplied page-specific Essential/Performance/Elite examples, ten comparison rows and four proposed benefit tiles. The data resolver validates shared IDs against the existing homepage preview identities, reusing their names without mutating homepage copy. The approved `memberships.ts` collection remains empty; confirmed inventory, prices and policies still require future content work.

Prices and durations say they require confirmation. Performance is a FEATURED EXAMPLE, not a popularity claim. A visible pricing notice explains that names and benefits are illustrative; every comparison caption/cell distinguishes proposed, pending and unspecified information. Not specified is explicitly explained as missing information rather than service unavailability. The table follows the approved matrix; it invents no assessment, access hours, fees, facility inclusions or session quantities. Cards and all joining actions start inquiries at Contact. Only the final secondary action calls the supplied gym telephone. No registration, checkout, billing selector, payment, form-delivery or activation service is introduced.

Four safe membership FAQ records extend the shared collection, reusing the existing beginner and gym-visit answers for the six-question page selection. Existing Home FAQ IDs/copy remain unchanged. FAQs ask visitors to confirm inclusions, upgrades and fees instead of promising them. Membership terms remain a pending-information notice, not approved legal policy.

When `site.preview` is false, the resolver returns no sample plans, comparison rows or benefit tiles. Pricing/comparison show explicit unavailable-content states; safe hero/introduction/joining/FAQ/CTA/information remain. Nothing publishes fake approved memberships. Metadata keeps the existing canonical URL and explicitly disables indexing while examples are shown. No offer or pricing structured data is emitted; existing release gates remain unchanged.

## Composition and behavior

Nine section components, a tier card, section heading and server page assembly live under the Membership feature. Shared Container, Breadcrumbs, SectionHeading, Button, NavigationLink, ContentState, FaqRow and FaqDisclosures are reused. Server Components own business content. The existing FAQ enhancer and the small MembershipSectionLink client boundary handle only interactions.

MembershipSectionLink keeps real fragment hrefs. Its unmodified activation uses Next's documented patched History API, focuses the target section and scrolls immediately, preserving the router snapshot for Back after a Contact visit. Repeated activation does not add duplicate history entries. Modified/new-tab activations and missing targets retain native behavior. Without JavaScript the anchors/disclosures/table/Contact links remain functional. No global state or custom navigation service is added.

At 60rem usable container width, the hero uses two columns, pricing uses three equal intrinsic cards, benefits use two columns and joining steps use three columns. Smaller layouts stack, with pricing constrained to a readable maximum width. At 24rem and below benefit icons stack above titles. All text grows naturally. The native table deliberately scrolls horizontally inside a labeled, visibly focusable region; semantic caption/column/row headers remain available. It adds no sticky column or body overflow. The approved photo uses an intrinsic 4:3 crop; originals are unchanged. Existing focus/reduced-motion roles remain active.

The comparison explanation is also visible outside its scroll region so it wraps normally on narrow screens; its semantic table caption is visually hidden rather than clipped with the wide table. Table cells distinguish proposed inclusions from pending or unspecified values without unavailable-service crosses.

## Verification and remaining work

Coverage includes data/ID/reference validation, pending comparison values, preview separation, unchanged Home content, server markup, both preview configurations, canonical/noindex metadata, fragment focus/history, inquiry destinations, keyboard table scrolling, shared FAQ mouse/touch/keyboard behavior, no JavaScript, six responsive widths, long/enlarged text, blocked assets, reduced motion and axe. Run the complete README workflow and record actual results/screenshots in the QA checklist.

During integration, the earlier Affiliates commit was found to omit its Home mount while retaining its component/tests; reconnecting the previously approved section restores Product Categories → Affiliates → Success Stories → FAQ without altering homepage plan cards. Vitest setup now resolves its file URL absolutely to avoid Windows `/tests/setup.ts` startup resolution failures.

Confirmed memberships, terms, owner visual approval, manual screen-reader/device/browser-zoom review and other engines remain pending. This implementation is not publication or public-launch approval.

Executed 2026-11-17: all 351 unit/component tests, typecheck, lint, formatting, final build and 38-HTML export audit pass. The complete browser workflow passes 334 cases with two intentional skips; all fourteen Membership cases pass again after the final caption refinement. An isolated preview-disabled build passes its 28-HTML audit and omits example Membership content. Final responsive/enlarged/failed-asset captures were reviewed; see the QA checklist for exact reports and remaining review limitations.
