# Decisions and assumptions

1. Preserve all 24 planned templates. Missing records prevent content completion, not template implementation.
2. Use Next.js 16.4.6, React 19.3.1 and Tailwind 4.3.5, verified against registry metadata during implementation. The committed pnpm lockfile fixes the resolved dependency tree.
3. Pin pnpm 10.34.9 because pnpm 12's executable was blocked by Device Guard. No npm lockfile or global package-manager installation is introduced.
4. Adapt reference layouts to supplied yellow/charcoal branding. Do not publish Invictus identities, staff, testimonials, articles, locations or product claims.
5. Use English and Asia/Dhaka. One actual location is supplied.
6. Use typed static content, no artificial API, CMS, database, Redux or TanStack Query.
7. Keep missing catalogs empty. Their `content-preview` pages contain explicit structural notices and remain noindex.
8. Use phone, supplied social links and address-derived map search. The map panel is labeled an illustration; no map coordinates or pin accuracy are claimed.
9. No gym email or WhatsApp contact is inferred. No newsletter, comments, cart, booking or payment service is simulated.
10. The inquiry form validates locally only. The submission abstraction is ready for an explicitly configured real provider.
11. Legal pages contain implementation notices until approved documents are supplied. All pages remain non-indexed during preview.
12. No public hosting is configured or deployment claimed. The implementation includes a reproducible static artifact and local export server; release requires the missing inputs and selected hosting destination.
13. Normalize Windows RSC segment export filenames after each build. Browser tests check failed internal HTTP responses, including prefetch requests, to prevent silent routing regressions.
14. Preserve original supplied assets and serve a WebP derivative of the cover image. No generated or unapproved stock photography is introduced.
