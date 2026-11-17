# H01-F: Homepage features carousel

Composition update: [H01-G](H01-G-home-memberships.md) inserts the Membership preview between Features and Story while site preview is enabled. Earlier direct adjacency below is historical.

Implemented 2026-11-17 from the owner's next-section reference and section 03 of the supplied `newsection.md`. Current composition: Hero/counters → Why choose us → Our Services → Features → Story → temporary inventory. This supersedes earlier Services/Story adjacency descriptions.

## Content and scope

`src/content/home-features.ts` preserves the supplied introduction, six titles, descriptions and action labels in source order. The supplied eyebrow remains WHY CHOOSE US; the distinct heading is “Everything You Need. Nothing Holding You Back.” Existing destinations are Facilities (equipment, zones, space), Coaches (guidance), Membership (community) and Contact (approach and introduction CTA). These pages retain their current rebuild/content states. No feature-detail routes, images, claims beyond supplied copy, catalog records, dependencies or lockfile changes are added. Equipment and facility verification remains part of public-launch content review.

Zod validates nonblank content, stable unique IDs, existing route destinations and optional future local image metadata. Features remain separate from Programs. Original source files and all 24 templates are preserved. Photography and feature-detail pages remain future work; preview indexing/release protections remain active.

## Composition and styling

HomeFeatures, FeatureCard and FeatureAction keep business content/server composition outside the interactive boundary. They reuse Container, SectionHeading, Card, Button and NavigationLink. HomeFeaturesCarousel isolates Embla interaction using installed Carousel primitives.

The light section keeps existing responsive gutters and 48/64px section padding. At 62rem of usable container width, the introduction occupies one third and cards two thirds, separated by 3rem. Below that, the introduction stacks above the cards. At 40rem of usable width two cards appear with 20px gaps; below that each card occupies 88% of the viewport, revealing the next. Usable-width queries reduce columns when text is enlarged.

Cards have 28px corners and a proportional minimum height of max(28rem, 150cqi), measured against each slide. This preserves the portrait design while allowing intrinsic growth for enlarged text; no fixed aspect-ratio height clips the content. Pill labels can wrap, and the circular arrow moves to another line only when the available width requires it. Charcoal gradients reserve backgrounds without fetching example photos or copying the hero. White titles sit at the top; descriptions and yellow pill links sit near the bottom, with a separate white circular diagonal arrow inside each link. Decorative slide numbers are hidden from accessibility APIs. The shorter trailing visible card reserves room for controls; its position updates as the loop moves so controls never cover a CTA. On narrow layouts controls sit below the row.

## Interaction and fallback

Manual one-card looping supports arrows, mouse drag, touch swipe and left/right keys. There is no automatic timer or playback control. Prev/next buttons have at least 44px targets, retain focus and use existing focus/state tokens. A polite position status reports the selected feature out of six after initialization.

Reduced motion is observed live and makes manual movements immediate. Focus-visible links reveal their entire slide immediately; pointer focus preserves dragging. Fully offscreen slides become inert after initialization, updating on selection, scroll and reinitialization. Listeners, motion subscriptions, inert states and trailing-card attributes are cleaned on unmount.

Before initialization or without JavaScript, all six links remain in a native horizontal snapping row. Unavailable controls/status are hidden; no inert states are present. Fallback horizontal touch scrolling is retained. Rules are scoped to this section and preserve Services, header and hero behavior.

## Verification

Unit/component coverage checks source copy/order, ID/route/image validation, server markup, empty content, position changes, loops, focus retention, live reduced motion and teardown. Browser coverage checks composition, card geometry, pill states, five responsive widths, mouse/touch navigation, focus reveal, destinations/history, blocked assets, enlarged spaced text, reduced motion, axe and no JavaScript. Actual full-workflow outcomes and visual-review limits are recorded in `docs/qa-checklist.md`.
