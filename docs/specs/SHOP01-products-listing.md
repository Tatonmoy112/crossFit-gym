# SHOP01: Products listing and hover quick view

Owner-approved plan (2026-11-17): build the Products listing now and defer individual product pages. Adapt the supplied footwear listing/card/dialog compositions to Crossfit Gym's fonts, light/charcoal surfaces and yellow actions. Product photography, real prices and actual inventory remain unavailable.

## Routes and homepage integration

`/products/` is a new route, preserving all original 24 templates. Products replaces Supplements in the existing Explore menu and shared footer navigation. `/supplements/` renders the same listing composition with Supplements selected by default, canonicalizes to `/products/`, and remains noindex. Existing `/supplements/content-preview/` and unknown-slug handling are preserved. Legacy supplement paths highlight Products in navigation.

Home's bottom action is exactly “View All Product” and opens `/products/`. The four category actions open `/products/?category=<matching-id>`. Category IDs remain sports-nutrition, training-equipment, gym-accessories and fitness-apparel. Product-specific link validation permits only the listing or those recognized category URLs; shared service/action validation remains unchanged. The homepage category disclosure now describes illustrative examples and unconfirmed availability/prices.

## Content and isolation

The category registry, actual products and listing copy live in src/content; product schemas validate nonblank copy, stable IDs, known category relationships, nonnegative/null prices and future local-image metadata. Actual products and the existing actual Supplements catalog remain empty. src/content/previews/products.ts separately validates the ten supplied section-3 product names/descriptions, with preview status, null prices and no photographs. Counts: four Supplements, two Equipment, four Accessories, zero Apparel. The empty Apparel result describes absent examples without claiming the gym has no apparel.

The associated notice reads: “Product listing preview. These are illustrative products; availability, prices and options are not confirmed.” Cards/dialogs say “Price to be confirmed”; the dialog says “Options to be confirmed.” No brand/rating/discount/size/stock claim, cart, checkout, WhatsApp destination, product detail URL, manufacturer information or product structured data is inferred. Contact and Call use the existing confirmed destinations. Examples are selected server-side only while site.preview is true; outside preview the page shows the approved collection's missing-content state without serializing sample records. The listing and compatibility route remain noindex and excluded from sitemap independently of launch settings.

## Composition and discovery

ProductsPage is server-rendered and owns validation, hero, introduction/breadcrumbs, preview notice and source selection. A Suspense boundary isolates ProductCatalog's useSearchParams/usePathname interaction. Its fallback renders all ten examples (four on the legacy route), readable summaries, the disclosure and native Contact/Call links. Enhancement-only discovery and quick view are absent without JavaScript. Cards/media are shared presentation modules; dialogs reuse the installed primitives with explicit light portal surfaces. No dependency, backend, provider or global store is added.

Page order: shared header, charcoal hero with supplied title/introduction, charcoal sort bar, Home/Products breadcrumbs and Shop All Products introduction, search, category sidebar/grid, counts/Load more, native inquiry links, shared footer. The media placeholders use light gray surfaces, decorative category line icons and a photography-pending label. Desktop has three result columns beside a light sidebar; below 64rem it uses a mobile filter dialog and two columns, below 40rem one column. Container queries further reduce columns with enlarged text. Descriptions wrap and cards grow intrinsically.

Category, trimmed name/summary search and sort are stored in category/q/sort URL parameters. Featured preserves supplied order; name sorting supports A–Z and Z–A. Native History integration updates these values without requesting runtime data, supports refresh and Back/Forward, and moves legacy interactions to `/products/`. Unknown categories/sorts fall back safely. Clear all returns to the unfiltered listing. Nine matches appear initially; Load more reveals further matches and resets on discovery changes. When the final Load more control disappears, focus moves to the first newly revealed product's Quick view button. The responsive Filters dialog dismisses on desktop and transfers focus to the visible search input when its trigger becomes hidden.

## Quick-view interaction

On fine-pointer hover devices, a 400ms mouse intent opens the product dialog. Exit, scrolling, discovery changes and unmount cancel pending intent. Explicit named Quick view buttons and product-name buttons work for keyboard/touch. Touching a media placeholder alone does not open quick view. Opening a filter or product dialog blocks another product from replacing it.

The wide dialog has media left and text/actions right, stacking below 48rem. It is bounded to the viewport and scrolls internally under enlarged text. It shows the selected name, category, exact supplied summary, pending price/options and preview disclosure. With no approved photos, one placeholder is rendered and no thumbnail rail is fabricated. Actions are Ask about this product (Contact) and Call the gym (confirmed telephone link).

Radix modal semantics trap focus, isolate the background and lock body scrolling. Escape, Close and outside clicks dismiss; focus returns to the originating Quick view button, with search as the fallback if discovery removed that button. Dismissing suppresses hover reopening until pointer exit/re-entry. Live reduced motion uses the existing global foundations. Intent/listener cleanup prevents delayed dialogs after navigation.

## Verification

Run the full README workflow. Unit/component coverage checks content/category relationships, preview separation, safe links, discovery combinations, ordering, legacy defaults, metadata/sitemap protections, static fallback and release-mode omission. Browser coverage checks the six standard widths, new/legacy/homepage journeys, search/filter/sort/refresh/history, final pagination focus, hover timing/cancellation/suppression, keyboard/touch dialogs, focus trapping/restoration, native inquiry links, responsive filter dismissal, enlarged/failed-asset/reduced-motion layouts, axe and no JavaScript.

Record executed results and artifacts in docs/qa-checklist.md. Owner visual approval, approved inventory/prices/photos, manual device/screen-reader/browser-zoom review and other browser engines remain pending. No publication or release approval is included.

Executed 2026-11-17: all 310 unit/component tests across 49 files pass with one worker and a 30-second CLI test budget; typecheck, lint, formatting, production build and the 27-HTML export audit pass. All 18 Products browser cases pass. The full browser run returned 282 passed, one Services timing assertion failure and one intentional skip; both corrected Services reruns pass. All 283 applicable browser cases are verified across those runs. See the QA checklist for precise evidence and remaining review requirements.
