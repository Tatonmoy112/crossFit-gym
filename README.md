# Crossfit Gym · Uttara

A Next.js App Router, React, strict TypeScript and Tailwind frontend implementing the complete 24-template website plan. It exports static files to `out/`.

## Current state

All planned page templates are implemented. The supplied Uttara address, telephone, social profiles, cover image and logo are used. There is no backend, CMS, authentication, booking, payment, comment or newsletter service.

**This is a non-indexed content preview, not a content-complete public release.** Programs, coaches, memberships, schedule, articles, vacancies, products, affiliate details and legal text were not supplied. Catalogs deliberately contain no invented records. Their detail templates are reviewable at `/programs/content-preview/`, `/coaches/content-preview/`, `/blog/content-preview/`, `/careers/content-preview/` and `/supplements/content-preview/`.

## Run locally

Use Node 24 and pnpm 10.34.9.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://127.0.0.1:3000`. On Windows with PowerShell script restrictions or no global pnpm, use the JavaScript CLI through npm:

```powershell
npm.cmd exec --yes --package=pnpm@10.34.9 -- pnpm dev
```

The latest pnpm 12 executable was blocked by this machine's Device Guard policy; the pinned pnpm 10 CLI installed successfully.

## Verify

```sh
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm check:export
pnpm exec playwright install chromium
pnpm test:e2e
```

In this workspace the matching test browsers are installed in `.cache/ms-playwright`. For local Windows E2E checks:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.cache\ms-playwright'
.\node_modules\.bin\playwright.cmd test
```

`pnpm start` serves the exported artifact on `http://127.0.0.1:3000`. Build first. The server supports nested directory indexes and the custom 404. It is a local QA server, not an internet-facing production server.

Always use `pnpm build`: its wrapper fixes Next 16.4's Windows segment-export filename mismatch after generating the site. The resulting `out/` is portable and needs no custom RSC rewrites. The local server supports gzip and the supplied cover has an optimized WebP derivative.

## Content updates

Edit the corresponding modules in `src/content/`. Zod validates their shapes; the content relationship check rejects duplicate identifiers and references to missing records. All content is rendered at build time. Use lowercase hyphenated stable slugs. See `docs/content-inventory.md` for ownership and `src/schemas/content.ts` for the contracts.

Add original approved images to `public/images/`; provide useful alt text and intrinsic dimensions. Never use complete screenshots as website content or publish another gym's staff, articles, claims, prices or testimonials.

Approved catalog records appear automatically on listings, detail pages and relevant homepage highlights after rebuilding. Preview records live separately from real catalog data.

## Contact form

The current form checks input locally and explicitly says no message was sent. It never sends or stores the visitor's data. `submitInquiry` accepts an optional typed transport for future integration and distinguishes unavailable, accepted and failed delivery. No transport is connected to the UI. Connect only a real provider, review its privacy and abuse protections, replace the preview notice and consent wording with approved text, and test real provider responses before enabling online delivery.

## Release and hosting

Run `pnpm check:release` to see outstanding approval requirements. It intentionally fails while the supplied inputs are incomplete. Do not mark missing inputs approved to bypass this check.

Before public launch: finish content and visual review, supply approved legal documents, configure the real domain in `.env.local`, set `site.preview` to `false`, and explicitly enable `NEXT_PUBLIC_SITE_INDEXABLE=true`. Preview detail pages remain noindex. The indexing configuration also requires an HTTPS site URL.

Deploy the contents of `out/` to a static host that supports directory indexes and serves `404.html` with a 404 status. Do not use an SPA catch-all to `index.html`. Verify nested URLs, redirects, canonical URLs, MIME types and security headers on the selected host. No hosted site was registered or published because release inputs and a hosting destination are missing.

## Documentation

The `docs/` directory records requirements, all routes, reference mappings, architecture, reusable components, decisions, the implementation backlog, approval requirements and executed QA results. `AGENTS.md` defines maintenance rules.
