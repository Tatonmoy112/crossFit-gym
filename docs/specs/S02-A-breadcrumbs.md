# S02-A: Breadcrumbs

Status: **specified; tests in progress**. Date: 2026-11-16. Item 9 in the [13-item pre-Home checklist](../pre-home-checklist.md).

## Purpose and design

Build accessible breadcrumb navigation for interior pages to convey hierarchical position and provide immediate upward traversal. The component composes the installed official shadcn breadcrumb primitives (`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`) with our semantic colors, typography and accessible focus contracts.

Breadcrumbs appear on interior pages (not Home). The root item always represents Home (`/`), followed by ancestor category/listing destinations, and terminates in the current page title. The current page item is plain text marked with `aria-current="page"` and is never an interactive link.

No fictitious breadcrumb paths or arbitrary deep hierarchies are invented. The trail strictly reflects the validated routes in `src/config/routes.ts` and `src/content/navigation.ts`.

## Contract and boundary

- `Breadcrumbs({ items, className? })` is a Server Component.
- `items`: An array of `{ label: string; href?: string }` entries.
  - Length must be at least 1.
  - Non-terminal items with a defined `href` render a link (`BreadcrumbLink` wrapping Next.js `Link` / `NavigationLink`).
  - The final item (and any item without `href`) renders as current page text (`BreadcrumbPage`) with `aria-current="page"` and no link tag.
- Render one `<nav aria-label="Breadcrumb">` containing an `<ol>`.
- Separators use the installed `BreadcrumbSeparator` containing `ChevronRightIcon` with `aria-hidden="true"` and `role="presentation"`.
- Text styles: Inter font, 14px (`text-sm`), muted foreground for links and separators, foreground for current page. Links transition color on hover and show visible focus ring on keyboard focus.
- The wrapper is transparent, respects container bounds, and wraps flex items cleanly on small mobile viewports (`320px`) without horizontal overflow or clipping.
- Breadcrumbs does not own page headings; it renders no `<h1>` or `<h2>`.
- First integration: Mounted on `/programs/` within the `Container` above `ContentState`, displaying `Home > Programs`.

## Acceptance matrix and ordered tasks

| ID      | Scenario / expected result                                                                                                                             | Verification                                                                | Ordered task / dependency                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------- |
| S02-A01 | Semantic `<nav aria-label="Breadcrumb">` with `<ol>` and `<li>` items. Ancestors render links; last item renders `aria-current="page"` text (no link). | Component tests covering 2-item, 3-item trails and text escaping.           | 1. Write failing tests; 2. minimal component.      |
| S02-A02 | Links navigate to supplied URLs; caller-supplied attributes/classes forward cleanly without unexpected attributes.                                     | Component link target tests; href verification.                             | 1. Cases; 2. Link forwarding.                      |
| S02-A03 | Semantic colors, Inter 14px typography, chevron separators with `aria-hidden="true"`, responsive wrapping at 320/375/768/1280px without overflow.      | Browser computed styles, separator visibility, axe accessibility audit.     | 1. Browser cases; 3. visual/accessibility styling. |
| S02-A04 | First integration in `/programs/` renders `Home > Programs` cleanly inside Container; preserves H1, ContentState, metadata and noindex.                | Page integration tests; browser regression check.                           | 4. Integrate in Programs; 5. Page verification.    |
| S02-A05 | Full quality workflow passes: typecheck, lint, format, unit/component tests, static build, export check.                                               | `tsc`, `eslint`, `prettier`, `vitest`, `build`, `check-export`, Playwright. | 6. Full verification & checklist updates.          |

Workflow: **specified → tests written → implemented → verified**.
