# S02-C — Remove breadcrumbs sitewide

Date: 2026-11-18. Status: implemented and automatically verified. Owner-approved removal; S02-A is retired.

## Behavior and scope

Remove breadcrumb navigation from About, Programs, Membership, Contact, Products, Supplements, every product detail page and the neutral product structure preview. No replacement breadcrumb, route or dependency is added. Headings, copy, metadata, existing navigation/actions, original assets and preview/indexing safeguards remain intact. Existing uncommitted Contact work is preserved.

Remove the application wrapper and its dedicated component/browser tests, unused content/schema fields and hero props, unused category input on the product-detail header, and breadcrumb-specific styling. The installed shadcn primitive remains available as part of the UI library without any page consumer.

## Layout and navigation

About retains its photographic hero dimensions and bottom-aligned introduction. Other pages keep existing section padding without placeholder breadcrumb rows. Products keep their introduction and preview notices. ProductDetailHeader renders the preview disclosure only for preview products and returns null for approved products, preventing an empty header gap.

Recovery uses existing header brand links and Programs' Back to home link. Product category navigation uses the existing Related Products category action. Keyboard checks follow the first remaining main-content link after Skip to content; no new controls are introduced.

## Verification

Update dependent component assertions, link counts, native navigation/history and keyboard focus order. Confirm no breadcrumb landmark or markup across the complete route inventory, all ten product examples and the structure preview, with and without JavaScript. Check six responsive widths, enlarged/spaced text with failed assets, header clearance, About alignment, focus and overflow. Preserve preview disclosures and verify approved-product headers leave no empty wrapper.

Run typecheck, lint, formatting, unit/component tests, production build/export audit and Playwright. Actual counts and screenshot evidence are recorded in the S02-C entry of the [QA checklist](../qa-checklist.md). Historical S02-A specifications and QA remain intact; current page requirements no longer include breadcrumbs.
