# S02-A: Breadcrumbs

Status: **verified** (see [QA record](../qa-checklist.md#s02-a-breadcrumbs-2026-11-16); manual visual/screen-reader review remains open). Date: 2026-11-16. Item 9 in the [13-item pre-Home checklist](../pre-home-checklist.md).

## Purpose and design

Build accessible breadcrumb navigation for interior pages to convey hierarchical position and provide immediate upward traversal. The component composes the installed official shadcn breadcrumb primitives (`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`) with our semantic colors, typography and the global focus contract from F01-B.

Breadcrumbs appear on interior pages (not Home). The root item always represents Home (`/`), followed by ancestor listing destinations, and terminates in the current page title. Callers supply real routes exactly as written in `src/config/routes.ts` and `src/content/navigation.ts`, for example `/programs`. The static export appends the trailing slash (`next.config.ts` sets `trailingSlash: true`), so the exported HTML links to `/programs/`. No fictitious paths or arbitrary deep hierarchies are invented.

## Contract and boundary

- `Breadcrumbs({ items, className? })` is a Server Component with no client boundary.
- `items`: an array of `{ label: string; href?: string }` entries.
  - **Linked ancestor:** a non-last item with `href` renders a Next.js `Link` (`prefetch={false}`, matching NavigationLink) inside `BreadcrumbLink`. The `href` is forwarded exactly.
  - **Unlinked ancestor:** a non-last item without `href` renders plain text with **no** `aria-current` and no link.
  - **Current page:** only the **last** item renders as `BreadcrumbPage` text with `aria-current="page"`. The stock `role="link"` and `aria-disabled` are removed. An `href` on the last item is ignored.
  - **Empty array:** renders nothing.
  - **Single item:** renders a one-entry trail with the current item, no separators and no links.
  - **Labels:** rendered as escaped text. Duplicate labels are allowed and keyed by position.
- `className` is forwarded to the `<nav>`.
- Render one `<nav aria-label="Breadcrumb">` containing an `<ol>`. There is one item `<li>` per entry plus `items.length - 1` separator `<li>` elements.
- Separators use the installed `BreadcrumbSeparator` with `ChevronRightIcon`, `aria-hidden="true"` and `role="presentation"`.
- **Text styles:**
  - Inter, 14px (`text-sm`).
  - Ancestor links and separators use the muted foreground. Links are underlined (a non-color cue, consistent with NavigationLink) and change to the foreground color on hover.
  - The current page uses the foreground color and has no underline.
- Keyboard focus uses the global unlayered `:focus-visible` outline (3px `--ring`). There are no component-specific focus overrides.
- The wrapper is transparent, respects container bounds, and wraps cleanly at 320px without horizontal overflow, clipping or ellipsis.
- Breadcrumbs does not own headings or live regions. It renders no `h1`–`h6`, `[aria-live]`, button or form.
- **First integration:** mounted on `/programs/` inside `Container`, above the page H1 and `ContentState`, displaying `Home > Programs`. Other interior pages receive breadcrumbs in their own section tasks.

## Acceptance matrix and ordered tasks

| ID      | Scenario / expected result                                                                                                                                                                                                                              | Verification                                                                 | Ordered task                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| S02-A01 | Semantic `<nav aria-label="Breadcrumb">` with `<ol>`/`<li>`. Linked ancestors are links; the last item is `aria-current="page"` text (no link). No headings or live regions.                                                                            | Component tests: 2- and 3-item trails, ownership exclusions.                 | 1. Failing tests; 2. component.                 |
| S02-A02 | Links keep the exact supplied route `href`. `className` forwards to the nav.                                                                                                                                                                            | Component tests.                                                             | 1. Failing tests; 2. component.                 |
| S02-A03 | Muted 14px Inter links with underline, foreground current page, hidden chevron separators, visible global focus ring, reflow at 320/375/768/1280px with long labels, zero axe WCAG 2.x A/AA violations.                                                 | Component separator test; Playwright computed styles, focus, reflow and axe. | 1. Browser cases; 3. styling.                   |
| S02-A04 | `/programs/` renders `Home > Programs` before the single H1 inside Container. ContentState, metadata and noindex are preserved. Home is reachable by keyboard and click. It works without JavaScript.                                                   | Playwright integration tests; existing regressions.                          | 4. Integrate in Programs; 5. page verification. |
| S02-A05 | Full README quality workflow passes.                                                                                                                                                                                                                    | typecheck, lint, format, Vitest, build, export check, Playwright.            | 6. Full verification and documentation.         |
| S02-A06 | Edge cases: exactly one current item; unlinked ancestor has no `aria-current`; last-item `href` ignored; no `role="link"`/`aria-disabled`; empty array renders nothing; single item; duplicate labels without key warnings; markup-like labels escaped. | Component tests.                                                             | 1. Failing tests; 2. component.                 |

Workflow: **specified → tests written → implemented → verified**.
