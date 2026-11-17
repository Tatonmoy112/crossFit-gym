# H01-I: Homepage Product Categories preview

SHOP01 update (2026-11-17): the closing action is now View All Product ? `/products/`, and each category action opens its matching Products filter. The current disclosure describes illustrative examples and unconfirmed availability/prices. See [SHOP01](SHOP01-products-listing.md) for the current discovery destinations; the original section implementation record below is historical where it describes Contact actions.

Owner-approved plan (2026-11-17): add Product Categories between Memberships and Member Success Stories. Adapt the supplied travel-card reference to four unique proposed product categories, existing local fonts, yellow actions and charcoal gradient placeholders. This is a homepage section, not a shop implementation.

## Content and boundaries

Section 2 of the supplied Gym Shop document owns the exact eyebrow, heading, introduction, four category names/descriptions and card labels. Order: Sports Nutrition, Training Equipment, Gym Accessories, Fitness Apparel. The separate Zod-validated `src/content/previews/home-product-categories.ts` record has literal preview status, four unique IDs, required nonblank copy and registered-route validation. The existing real supplements catalog remains empty.

The entire section is gated by `site.preview`. Its associated visible notice reads: “Product category layout preview. Product availability is not confirmed. Category links open Contact for inquiries.” All four category links and the closing “Ask about products” link open `/contact/`. No new routes, product records, prices, ratings, inventory claims, product structured data, shopping cart, checkout, images or dependencies are introduced. Supplied files remain unchanged; preview indexing protections and release requirements remain active.

## Presentation and architecture

HomeProductCategories and ProductCategoryCard compose content on the server using Container, SectionHeading, Card, Button and NavigationLink. HomeProductCategoriesCarousel receives server-composed slides/action and owns only local Embla interaction. The reusable carousel API and other carousel consumers remain unchanged. Scoped CSS lives in `src/styles/home-product-categories.css`, imported after the existing homepage section styles.

A white section contains a centered eyebrow pill, Barlow Condensed H2, Inter introduction/disclosure, rounded tall charcoal cards and yellow pill links. Cards have intrinsic content height and a 26rem minimum. At 60rem usable container width, roughly one-third-width slides overlap by 1rem when enhanced. The selected card rises to a 30rem minimum height with higher stacking; focused cards rise above neighboring cards. Training Equipment starts selected. Four unique categories create asymmetric edge previews rather than a fabricated fifth category.

Below 60rem, cards do not overlap. Slides occupy 70% from 40rem usable width, 88% below it, and 100% at 17rem and below. Narrow card padding and vertically stacked bottom controls accommodate enlarged text. All labels/descriptions wrap; no copy is line-clamped. Every action/control keeps a minimum 44px target.

## Interaction and fallback

Embla uses centered alignment, initial index 1, one slide per step, `loop: false`, and `containScroll: false`. Previous/next arrows surround the Contact action. There is no timer or autoplay. Finite boundary controls expose aria-disabled, guard activation and retain focus. Arrow keys operate the focused viewport or bottom controls; native card links retain their normal key behavior. Mouse/touch dragging remains supported.

Selection is announced politely. The active card follows selection and offscreen slides become inert. Visible keyboard focus reveals its slide immediately. Live reduced-motion changes make control movement immediate. Event/media subscriptions and active/inert state are cleaned on unmount.

Before initialization and without JavaScript, all four cards, exact copy, notice and five Contact links remain in a native scroll-snap row, with no inert slides. Inactive controls and live position text are hidden. Wide layouts retain a taller second card with no overlap so native scrolling remains predictable.

## Verification and remaining review

Unit/component cases cover schema rejection, real-catalog separation, static content/fallback, preview gating, homepage adjacency, finite navigation, focus preservation, live reduced motion and cleanup. Browser cases cover six widths (320/375/768/1024/1280/1920), layering/centering, text wrapping, 44px targets, focused partially visible actions, offscreen inert state, real Contact/history navigation, mouse/touch dragging, absence of automatic rotation, failed assets, 200% spaced text, axe and no JavaScript.

Run the full README workflow and record actual results in `docs/qa-checklist.md`. Approved product availability, category photographs, owner visual approval, manual screen-reader/device/browser-zoom review and other browser engines remain pending. Placeholder gradients deliberately do not represent actual products.

Executed 2026-11-17: typecheck, lint, formatting, all 297 unit/component tests, production build and the 26-HTML export audit pass. All ten new section browser cases pass. The full browser run returned 261 passed, four stale homepage assertion failures and one intentional skip; all four corrected assertions passed on rerun. All 265 applicable browser cases are verified across those runs. See the QA checklist for evidence and remaining review limitations.
