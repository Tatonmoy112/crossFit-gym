# SHOP02: Reusable product details

The approved plan uses Whey Protein Powder as the master composition, then reuses the same sections for all ten supplied product examples. The reference layout is adapted to the existing yellow, charcoal and light surfaces, local fonts, shared header/footer and container. Original templates, including the Supplements detail shell, remain in scope.

## Routes and content

`/products/[slug]/` statically generates each visible product ID. Listing names and media are native detail links; the hover dialog retains its explicit Quick view control and adds View full details. Category breadcrumbs and related cards return to the existing discovery flow.

`src/content/previews/product-details.ts` holds the supplied section-4 headlines, descriptions, highlights, intended audiences, usage/exercise guidance and specification labels. Unresolved specification values are null and render as “To be confirmed.” Product records retain null prices and empty image arrays. The empty approved collection lives separately in `src/content/product-details.ts`. Zod and relationship validation reject missing, duplicate, orphaned and status-mismatched detail records. Never treat illustrative nutrition copy as verified manufacturer information.

Preview examples disappear when site.preview is false. `/products/content-preview/` is a neutral structure page, not a catalog record; it also provides the static parameter required by the installed Next version when the real collection is empty. All new detail routes remain noindex and outside sitemap. Unknown slugs return the existing 404. No product structured data is emitted.

## Component boundaries

ProductDetailPage is a Server Component composing ProductDetailHeader, ProductGallery, ProductSummary, ProductDescription, ProductDetails, ProductReviewsEmpty and RelatedProducts. ProductAvailabilityInfo and ProductInquiryActions are reusable server sections; quick view shares the inquiry actions. ProductShare and ProductImageGallery isolate browser-only behavior. Business copy remains in src/content.

At 60rem of usable container width, the gallery and information occupy the left column and summary occupies the right. Smaller layouts follow gallery, summary, information. Description and individual detail disclosures use native details/summary. Reviews have an honest empty state; up to four same-category related products exclude the current record.

With no approved photography, one explicit placeholder appears without fabricated thumbnails. When local images are supplied, the same gallery supports finite previous/next buttons, thumbnails, arrow keys, horizontal touch gestures and a bounded zoom dialog with focus restoration. All supplied images render server-side without JavaScript; enhancement controls appear after hydration. Gallery fixture images are test-only existing assets and never enter product content.

Sharing reports success only after clipboard/native-share promises resolve. Cancellation is silent; unavailable clipboard access reveals a selectable page address. The confirmed Contact and telephone destinations remain the inquiry actions. Prices, options, availability, manufacturer information and delivery/return policies stay explicit. No cart, checkout, wishlist, review submission or unverified service/stock claim is introduced.

## Verification

Run the complete README quality workflow. Coverage includes all ten static URLs and metadata, content relationships, preview-off omission, listing/quick-view/history journeys, native disclosures and links, six normal/enlarged widths, failed assets, no JavaScript, clipboard fallbacks, gallery keyboard/touch/zoom and automated accessibility. Record actual execution and visual review in docs/qa-checklist.md. Approved product data, photography, owner visual approval and manual accessibility/device review remain outstanding.

Executed 2026-11-17: all 327 unit/component tests across 53 files pass; typecheck, lint, formatting, production build and the 38-HTML audit pass. The full browser run returns 297 passed, two shop interaction failures and one intentional skip; all 34 rebuilt Products/detail cases pass after corrections. All 299 applicable browser cases are verified across those runs. The isolated preview-disabled build passes a 28-HTML audit and omits sample records and sample detail paths. See the QA checklist for artifacts and remaining review requirements.
