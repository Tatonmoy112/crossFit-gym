# H01-K: Homepage Affiliates invitation

Owner-approved connection-diagram design and invitation wording from chat on 2026-11-17. Home places this section immediately after Product Categories and before Success Stories. The existing Memberships-before-Features order remains intact. The invitation also renders when `site.preview` is false; it then follows Features and precedes FAQ because the sample categories/stories are absent.

## Content and components

The eyebrow is OUR AFFILIATES, the heading is Stronger Together. Greater Every Day., and the paragraph welcomes collaboration opportunities rather than claiming existing partnerships. The diagram caption is Partnership opportunities. Fitness Brands, Industry Professionals and Wellness Partners describe potential collaborators. Become a Partner opens `/contact/`; no application acceptance or delivered form is implied. The existing `affiliateOffering` remains null, and `/affiliates/` remains its original shell. Confirmed partner names/logos and referral/commission terms have not been supplied.

All invitation copy lives in `src/content/home-affiliates.ts`. Zod requires nonblank fields, exactly three known/unique opportunity identifiers and the confirmed Contact destination. A typed icon map covers those identifiers. This introduces no fictitious provider/catalog record, new route, dependency, backend or indexing change.

HomeAffiliates, PartnershipNetwork and PartnershipOpportunityTile are Server Components. They reuse Container, SectionHeading, Button and NavigationLink. The semantic figure/figcaption and labeled list contain informational tiles. The hub reuses approved brand image metadata and displays the gym name separately, so its image has empty alt. Icons and CSS connectors are decorative. Only the Contact CTA is interactive. All content and navigation work without JavaScript.

## Visual contract

A full-width charcoal section supplies white introduction text, yellow accents, a circular gym hub and light opportunity tiles. Scoped CSS owns intrinsic tile heights and connectors; no text is positioned absolutely or clipped to a fixed height. At 60rem usable section width the introduction/CTA sit left and network right. Below that threshold DOM order is introduction, network, CTA. At 32rem network width the hub sits left of three stacked tiles; smaller networks place it above the tiles. At 20rem and below tile icons stack above titles to retain reading width. The gym name remains visible if its mark fails.

There is no carousel, animation or client state. The existing semantic palette, fonts, spacing, native Contact navigation, visible focus and responsive text wrapping are retained. Existing preview/indexing/release settings remain unchanged.

## Verification and limitations

Content/component coverage verifies approved invitation/categories, the unchanged null offering, identifier/icon relationships, blanks/duplicates, CTA destination, semantic static markup, decorative assets, escaped text and both preview configurations. Updated homepage adjacency checks reflect Product Categories → Affiliates → Success Stories → FAQ. Home now has fourteen shared containers.

Browser coverage exercises 320/375/768/1024/1280/1920 widths, actual section/network geometry, keyboard/touch Contact/history, no JavaScript, failed assets, enlarged spaced/long text, reduced motion, forced-colors focus and axe. Run the complete README workflow and record actual results and screenshots in the QA checklist. Owner visual approval, manual screen-reader/device/browser-zoom review and other engines remain separate tasks. No publication or launch approval is included.

Executed 2026-11-17: all 341 unit/component tests, typecheck, lint, formatting, final build and the 38-HTML export audit pass. All 320 applicable browser cases are verified across the complete run and final targeted rerun. The two full-run failures were stale Services adjacency assertions; both pass after correcting the expected existing order. All ten Affiliates cases pass again against the final cosmetic rebuild. Reviewed final desktop/mobile/enlarged captures; see the QA checklist for exact reports and remaining manual-review limitations.
