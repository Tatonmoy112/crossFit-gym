# Crossfit Gym · Uttara

A Next.js App Router, React, strict TypeScript and Tailwind project preserving the complete 24-template website plan. It exports static files to `out/`.

## Current state

The UI was reset on 2026-11-15 for a complete component rebuild. All 24 templates remain as route shells with a heading and recovery links. Programs now replaces its rebuild notice with an accurate empty-content explanation; other page sections await rebuilding. Home composes the hero, a clearly labeled example counter in preview mode, the three-card Why choose us section, the story missing-content state and a temporary page inventory. The rebuilt header now composes BrandLink and desktop/mobile navigation on every route. The rebuilt footer supplies original navigation/contact/social channels and legal links. The global Website preview banner has been removed by owner request. Page content starts directly inside main; preview indexing protections remain active. Other shared sections and feature components await rebuilding.

The complete official shadcn/ui library is installed: **63 UI modules**, supporting hooks/utilities and theme foundations. One additional local NavigationLink module brings the UI directory to 64 modules. It uses shadcn 4.23.0, the Radix Nova style, Lucide icons and Tailwind 4. Local fonts, semantic brand colors, typography and layout/motion foundations are integrated; Button and standalone navigation links are adapted; other components and page composition remain pending. See [docs/component-inventory.md](docs/component-inventory.md) for every installed module and [docs/shadcn-setup.md](docs/shadcn-setup.md) for setup and usage.

The complete page-by-page section plan, shared-component backlog, content sources and rebuild sequence are in [docs/component-rebuild-plan.md](docs/component-rebuild-plan.md). Build and review components individually, then compose them into their existing routes.

Supplied inputs, typed business content, validation, metadata and static paths are retained. The twelve documented raster references are currently absent from the working tree; their existing deletions have not been reversed. The existing pnpm lockfile was updated in place for the previously requested library dependencies. There is no backend, CMS, authentication, booking, payment, comment or newsletter service. The root layout retains its first-tab skip link and main landmark, with the server-composed header between them and footer after main. CSS includes shadcn theme/animation foundations, neutral shell defaults, visible focus and reduced-motion support.

[F01-A local fonts](docs/specs/F01-A-local-fonts.md) installs Inter 400/500/600 for body text and exposes Barlow Condensed 600/700 through `font-heading`. All five upright WOFF2 files are self-hosted with swap behavior, system fallbacks and synthetic styling disabled. Pinned source revisions, hashes and original licenses are retained in `src/styles/fonts/`; exact license copies are included in the static export under `/fonts/licenses/`. Fonts load on demand rather than preloading every weight. No new dependency or remote font request is required. Heading sizing is supplied by F01-C.

[F01-B semantic colors](docs/specs/F01-B-semantic-colors.md) defines the yellow/charcoal palette in `src/styles/colors.css`, including state roles and protected keyboard/system focus. Root stays light regardless of OS preference. Mark local contexts with `data-surface="light"`, `data-surface="charcoal"` or `data-surface="yellow"`; nested light/yellow boundaries stop ancestor dark utilities. Portaled contents require their own explicit surface marker. These foundations are tested with isolated native specimens; stock shadcn consumers still need review before integration; U01-A separately adapts native Button states. No new page UI or theme switch was added.

[F01-C typography](docs/specs/F01-C-typography.md) applies the approved fluid H1/H2/H3 hierarchy in `src/styles/typography.css`. Display headings use Barlow Condensed; body, small headings and controls use Inter. Opt-in roles are `type-display`, `type-control`, `type-control-strong`, `type-hint` and `text-measure` (65ch). These classes do not change heading semantics or adapt stock components. Layout/motion roles are supplied by F01-D.

[F01-D layout/motion](docs/specs/F01-D-layout-motion.md) keeps main full width and puts `layout-container py-8` on each existing shell section. The container provides a 1550px inner maximum with 16/24/32px responsive gutters. Explicit `rounded-control`/`rounded-card`/`rounded-overlay`, `touch-target`, `motion-control` and `motion-overlay` roles are available for future consumers. Reduced motion removes role transitions, resets delays and limits installed animations while preserving positioning transforms. Native specimens verify these contracts; actual component adaptation follows separately.

[U01-A action button](docs/specs/U01-A-button.md) adapts the installed Button with opaque semantic states, Inter control typography, minimum 44px targets, wrapping labels and foundation focus/motion. All existing variant/size names remain. Native Button defaults to `type="button"`; use an explicit submit/reset type when intended. Icon-only consumers supply an accessible name. Header navigation now consumes Button; other stock consumers and button-shaped anchor states remain separate tasks.

[U01-B NavigationLink](docs/specs/U01-B-navigation-link.md) adds a standalone 44px navigation control with native current-page semantics, wrapping labels and surface-aware focus/states. Root-relative paths use Next Link without prefetch; named fragments, HTTP(S), mailto and tel use native anchors. Missing/unsupported destinations throw instead of becoming fake links. Explicit new tabs receive safe rel tokens and a visible accessible cue; external links stay in the same tab by default. About's existing Back to home link, root header and footer consume NavigationLink. Inline prose and button-shaped CTAs remain separate.

[L01-A BrandLink](docs/specs/L01-A-brand-link.md) composes NavigationLink with the existing gym name and a 2,604-byte local logo derivative. The clean supplied white-background mark is preserved; both original logo candidates remain unchanged. The visible name and Home destination survive image/font failure. L01-B mounts it in the real header and L03-A reuses it in the footer; no public demonstration route was added.

[L02-A desktop navigation](docs/specs/L02-A-desktop-navigation.md) adds the four supplied disclosure groups, validated destinations, exact/section current states and responsive keyboard-accessible interaction using shadcn Collapsible, Button and NavigationLink. Content validation stays on the server; open state stays local to the client boundary. L01-B now mounts it in the root header. Track progress in the [13-item pre-Home checklist](docs/pre-home-checklist.md). [L02-B mobile navigation](docs/specs/L02-B-mobile-navigation.md) adds the isolated modal counterpart with grouped links, shared current matching, focus/scroll management and responsive dismissal. The panel explicitly uses a light surface when portaled. [L01-B header assembly](docs/specs/L01-B-header-assembly.md) mounts these components on all routes and verifies real App Router/history, responsive focus cleanup and static brand fallback. [L03-A footer](docs/specs/L03-A-footer.md) adds a Server Component after main, reusing validated navigation and supplied contact/social values. Its legal/hour availability notes are explicit; all footer links work without JavaScript. [S01-A preview notice](docs/specs/S01-A-preview-notice.md) was removed by owner request on 2026-11-16, including its component and UI copy. Preview mode and indexing/release guards remain unchanged. [S01-B content states](docs/specs/S01-B-content-states.md) adds a static shared heading/description using installed Empty, first integrated against the real empty Programs catalog. It describes absent approved website inputs without implying there are no gym offerings. Populated catalog presentation and other page integrations remain separate. [S03-A Container](docs/specs/S03-A-container.md) exposes the existing width/gutter role through a native div Server Component, first integrated inside Programs' full-width section. Other direct CSS consumers remain unchanged. [S03-B SectionHeading](docs/specs/S03-B-section-heading.md) adds a semantic H2/optional-description group with logical start/center alignment, caller-owned heading IDs and responsive brand typography. ContentState is its first consumer. [S02-A Breadcrumbs](docs/specs/S02-A-breadcrumbs.md) adds an accessible trail with exactly one current page, first integrated in Programs. [H01-A Home hero](docs/specs/H01-A-home-hero.md) gives Home its single H1, the owner-approved gym photograph and the owner's reference layout ([H01-A2](docs/specs/H01-A2-home-hero-design.md)) with real Call and Get directions actions as shadcn Button links; the temporary page inventory remains below it. [H01-C Home stats](docs/specs/H01-C-home-stats.md) sits directly below the hero. The counter uses separately validated example figures only in preview mode, with a visible notice; sourced business statistics replace these examples when supplied. [H01-D Why choose us](docs/specs/H01-D-home-why-choose-us.md) reuses one adapted ReUI Card 8 for three supplied-fact cards immediately below the counter. [H01-B Home story](docs/specs/H01-B-home-story.md) follows that section; because no story text is supplied, it shows an explicit missing-content state. Next task: Home discovery links only (pending a separate specification).

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

The project pins pnpm 10.34.9. Use that version and preserve `pnpm-lock.yaml`.

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

Playwright owns a separate static-export QA server at `http://127.0.0.1:3100` and refuses to reuse an existing server, keeping tests independent of a development server on port 3000. Set `PLAYWRIGHT_PORT` to choose another QA port. Build the export before running browser tests.

To install and use matching browsers in a workspace-local cache on Windows:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.cache\ms-playwright'
.\node_modules\.bin\playwright.cmd install chromium
.\node_modules\.bin\playwright.cmd test
```

`pnpm start` serves the exported artifact on `http://127.0.0.1:3000`. Build first. The server supports nested directory indexes and the custom 404. It is a local QA server, not an internet-facing production server.

Always use `pnpm build`: its wrapper fixes Next 16.4's Windows segment-export filename mismatch after generating the site. The wrapper selects webpack by default; `pnpm build -- --turbopack` selects Next's default compiler. It also emits percent-encoded bracket-path aliases. The resulting `out/` is portable and needs no custom RSC rewrites. The local server supports gzip. Page image presentation awaits rebuilding; retained cover/social-image references need reconciling with the separately changed brand assets noted in `docs/qa-checklist.md`. BrandLink uses its own verified local mark and does not repair those unrelated references.

Current browser tests cover route availability, 404s, responsive shell layouts, temporary inventory navigation, skip-link focus and automated accessibility checks. Header tests exercise actual App Router soft navigation/history, responsive keyboard focus, current cues, fallback and no-JavaScript Home access. Footer tests cover real contact/route targets, legal availability, keyboard/modal isolation, intrinsic responsive columns and no-JavaScript navigation. Font tests inspect actual Chromium rendering for every selected weight, same-origin delivery, exported licenses, delayed/blocked fallback behavior and preview indexing safeguards. Focused tests cover the local mobile-hook and carousel subscription adapters. Old gym-feature interaction tests were retired with their implementations. Restore meaningful coverage as each feature is rebuilt. See `docs/qa-checklist.md` for actual execution results; unmounted library components still need review when integrated.

## Content updates

Edit the corresponding modules in `src/content/`. Zod validates their shapes; the content relationship check rejects duplicate identifiers and references to missing records. All content is rendered at build time. Use lowercase hyphenated stable slugs. See `docs/content-inventory.md` for ownership and `src/schemas/content.ts` for the contracts.

Add original approved images to `public/images/`; provide useful alt text and intrinsic dimensions. Never use complete screenshots as website content or publish another gym's staff, articles, claims, prices or testimonials.

Approved records still generate detail URLs at build time. Listings, detail presentation and homepage highlights must be reconnected as their new components are built. Preview records live separately from real catalog data and remain excluded from indexing.

## Contact form

The form UI has been removed. Its Zod validation and `submitInquiry` transport contract remain for the rebuild. The contract distinguishes unavailable, accepted and failed delivery, and no provider is configured. When rebuilding the form, keep delivery status explicit, connect only a real provider if required, use approved privacy/consent wording and verify provider responses before enabling online delivery.

## Release and hosting

Run `pnpm check:release` to see outstanding approval requirements. It intentionally fails while the supplied inputs are incomplete. Do not mark missing inputs approved to bypass this check.

Before public launch: finish content and visual review, supply approved legal documents, configure the real domain in `.env.local`, set `site.preview` to `false`, and explicitly enable `NEXT_PUBLIC_SITE_INDEXABLE=true`. Preview detail pages remain noindex. The indexing configuration also requires an HTTPS site URL.

Deploy the contents of `out/` to a static host that supports directory indexes and serves `404.html` with a 404 status. Do not use an SPA catch-all to `index.html`. Verify nested URLs, redirects, canonical URLs, MIME types and security headers on the selected host. No hosted site was registered or published because release inputs and a hosting destination are missing.

## Documentation

The `docs/` directory records requirements, all routes, reference mappings, architecture, reusable components, decisions, the implementation backlog, approval requirements and executed QA results. `AGENTS.md` defines maintenance rules.
