# H01-G: Homepage Membership & Pricing

Composition update after H01-H: Success Stories preview now follows Memberships before Story. The Membership content and interaction contracts below are unchanged.

Implemented 2026-11-17 from the owner-approved plan and travel-card reference supplied in chat. Home order in preview mode: Hero/counters → Why choose us → Services → Features → Membership preview → Story → inventory. Without site preview, the Membership preview is absent. The existing Membership page remains in the 24-template scope; this task adds no page.

## Content and preview policy

`src/content/previews/home-memberships.ts` holds separately Zod-validated design examples: Essential, Performance and Elite, in that order. The section uses the supplied introduction, supporting text, descriptions and four homepage benefits per plan. It never populates the real empty memberships catalog. The typed record requires preview status, nonblank copy, three unique IDs, the middle plan featured, existing route destinations and optional future local image metadata.

Every card says “Price to be confirmed.” There are no amounts, currency placeholders, billing periods, durations, discounts, savings or Offer structured data. Performance uses FEATURED PLAN rather than an unverified popularity claim. Each Choose action opens Contact. Following M01, the final View Membership Plans action opens the Membership Plans page at `/membership/`. There is no checkout, delivery, selected-plan prefill or new backend.

The visible local disclosure is “Illustrative membership plans. Benefits and prices are not confirmed gym offerings.” The homepage gates the entire section with site.preview. Disabling preview removes its introduction, cards and actions together. Existing noindex and content/legal/release gates remain intact. Real fees, benefits and terms must be approved separately.

## Presentation

HomeMemberships and MembershipPlanCard retain server-owned content and compose Container, SectionHeading, Card, Button and NavigationLink. HomeMembershipsCarousel contains interaction only, reusing the installed Embla primitives without a new dependency.

The centered light introduction uses the existing yellow/charcoal palette, Barlow Condensed headings, Inter supporting text, 1550px container and 48/64px section spacing. Rounded charcoal gradient cards reserve photography without fetching reference images. Each card contains a badge, name, description, price status, checkmarked benefits and a full-width pill link. Side links use a light surface; Performance uses yellow. Cards have a 34rem minimum height and grow intrinsically, without an aspect-ratio height that could clip enlarged content.

Usable container width controls layout: below 40rem, slides occupy 88% with 8px gaps; from 40rem, 70% with 16px gaps; from 60rem, three frames share the viewport with 16px overlap. At 17rem or less of usable space, full-width slides and reduced padding preserve reading space under enlarged text. The selected desktop card rises 32px above its neighbors and sits in front. Padding protects text/buttons from overlap, and focus-within brings a slide forward. Enlarging text reduces the card count automatically. Contact sits between circular 44px previous/next controls; very narrow enlarged-text layouts stack controls in DOM order.

## Interaction and fallback

Embla uses center alignment, startIndex 1, one-card movement, loop false and containScroll false. This preserves three individual positions even when all three desktop cards fit. Performance is centered initially; no plans are cloned and no automatic timer exists. Mouse/touch drag and native button activation navigate; left/right keys on the footer controls navigate while retaining focus. At boundaries, aria-disabled controls ignore activation and remain focusable rather than losing focus when disabled.

Focus-visible card links reveal their slide immediately. Fully offscreen slides become inert after initialization. Selected state, slide visibility and elevation update during selection, scrolling and reinitialization. Reduced-motion changes are observed live and make manual navigation immediate. Event/media subscriptions, inert properties and active attributes are cleaned up on unmount. A polite selected-position status is hidden before initialization.

Before initialization and without JavaScript, all four Contact links and the disclosure remain available. Scoped CSS provides three readable desktop cards or a native horizontal snapping row on smaller screens. Inactive arrow controls are hidden; the server-rendered Contact CTA remains visible. Enhanced scrolling allows vertical panning and pinch zoom.

## Verification and remaining inputs

Unit/component checks cover supplied copy/order, preview/catalog separation, schema failures, server markup, Home placement, preview-disabled exclusion, boundary guards, focus retention, reduced motion and cleanup. Browser checks cover responsive geometry, overlap hit testing, Contact navigation/history, real mouse/touch drag, focus reveal, reduced motion, enlarged/spaced text, blocked assets, axe and no JavaScript.

Actual full-workflow results and screenshot review are recorded in the QA checklist. Photography, confirmed memberships/fees/benefits/terms, owner visual approval and manual assistive-technology/device review remain separate work. A passing build does not approve public launch.
