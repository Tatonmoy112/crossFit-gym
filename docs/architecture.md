# Architecture

Routes compose feature sections. Shared presentation and business components sit above accessible primitives. Business data lives in typed local content modules. Tokens own colors, typography, spacing foundations and layout widths.

Build flow: approved inputs -> local modules -> Zod parsing -> relationship validation -> Server Components -> route metadata -> static export. All dynamic path segments enumerate approved slugs at build time. Unknown paths use the custom 404.

Client boundaries: desktop/mobile navigation; catalog/FAQ/search filters; gallery lightbox; schedule filters and dialog; membership billing; inquiry validation; product variants; article reading progress and user-initiated sharing. No global provider tree, remote query cache or artificial API is used.

URL discovery state uses `useSyncExternalStore` with popstate/custom change subscriptions. Server snapshots are empty and hydration reads the actual browser query. Inquiry context is keyed to its URL parameters so selected membership/program context survives direct loading.

Zod contracts check field shapes. Relationship validation rejects duplicate slugs, duplicate class/membership IDs, unknown related records and broken program/coach/location/membership references.

Inquiry transport is an explicit optional function. Unconfigured transport returns `unavailable`; provider rejection/exception returns `error`; only confirmed acceptance returns `success`. The shipped UI supplies no transport and makes no submission request.

Static export uses trailing directory indexes and unoptimized Next Image against supplied local assets. No runtime image server, API route, server action or request-dependent rendering is required.

The build wrapper runs Next and normalizes Windows RSC segment filenames. Next 16.4's exporter replaces forward slashes only, while Windows filesystem paths use backslashes; without normalization some client prefetch requests return 404. The post-build step adds the expected flat filenames to `out/`, leaving source inputs and dependencies untouched. Linux exports already use the expected form. Always build with `pnpm build` rather than invoking Next directly.

The supplied cover photograph has a 42,324-byte WebP derivative, preserving its dimensions and source content. Hero requests include high fetch priority. The local export server negotiates gzip for text assets and uses immutable caching for hashed framework assets.

Shared SiteLink wraps Next Link with prefetch disabled. Marketing pages load on navigation rather than speculatively downloading unrelated contact/catalog components during the homepage load. This change improved the local mobile Lighthouse performance score to 93 while retaining client navigation.

Indexability defaults off and also requires `site.preview=false` plus an HTTPS domain. Preview detail pages remain noindex. Domain configuration, approved legal text and content readiness are release requirements.
