# H01-A: Home hero

Status: **verified; design superseded by [H01-A2](H01-A2-home-hero-design.md)** (see [QA record](../qa-checklist.md#h01-a-home-hero-2026-11-16); manual visual/screen-reader review remains open). Date: 2026-11-16. This is the first Home page section ([rebuild plan](../component-rebuild-plan.md), page 1, section "Hero"). The owner chose to start Home before the remaining pre-Home items (S02-B, S05-A, S06-A, S04-A). This task builds only what the hero itself needs.

## Purpose and reference

The hero gives the Home page its single H1 and the first honest ways to reach the gym. The reference is `figma/hero_home_section.png`:

- a full-bleed dark photograph;
- a centered display name with a tagline;
- three contact actions.

Only the structure is reused. The Invictus name, green palette, copy and email action are not copied.

## Content (owner decisions, 2026-11-16)

- **Image:** the owner chose `public/images/brand/hero_section.png` (1672×941) and confirmed it represents the gym. The page serves a resize-free WebP derivative, `public/images/brand/home-hero.webp`, with a provenance file. The original stays unchanged.
  - **Alt text** describes only what is visible: "Crossfit Gym training floor with treadmills, cross-trainers and strength racks".
- **Text:** tagline only, using already approved site content:
  - title `site.name` ("Crossfit Gym");
  - tagline `site.tagline` ("One step closer.");
  - location `site.shortAddress`.
  - No "Welcome to" eyebrow and no unapproved marketing line.
- **Actions,** in order:
  1. "Call 01323-275695" → `tel:+8801323275695`
  2. "Get directions" → the supplied Google Maps search URL
  3. "Contact us" → `/contact`
  - There is no email action, because no email address has been supplied.
- **Storage:** content lives in `src/content/home.ts`. It is derived from `site.ts` and validated by `homeHeroSchema` in `src/schemas/content.ts`.

## Contract

### Content and component

- **Schema (`homeHeroSchema`):**
  - nonblank `title`, `tagline` and `location`;
  - `image` follows `imageSchema`;
  - `actions` has 1–3 entries of `{ label, href }`, and each `href` must be one of:
    - a `tel:+…` number;
    - an `https://` URL;
    - a root-relative path (but not `//`).
  - Anything else is rejected: `http:`, `javascript:`, blank values, and zero or more than three actions.
- **Component:** `HomeHero({ content })` in `src/features/home/home-hero.tsx`.
  - It is a Server Component with a required prop and no client boundary or state.

### Markup

- `<section aria-labelledby="home-hero-title" data-surface="charcoal">` containing:
  - the image, covering the section (`object-fit: cover`), loaded eagerly with high fetch priority;
  - an `aria-hidden` charcoal overlay;
  - a `Container` with the content.
- `<h1 id="home-hero-title">` uses the `type-display` role. It is the page's only H1, and Home's old "Home" H1 is removed.
- The tagline and location are paragraphs. The location has a decorative map-pin icon.
- Actions are a `<ul>` of `NavigationLink`s:
  - The first action is primary: yellow background, charcoal text.
  - The others are outlined, with white text on a transparent background.
  - All actions are at least 44px tall, wrap, and open in the same tab.

### Behavior and fallbacks

- **Contrast:** text must reach at least 4.5:1 even over a pure-white image pixel (overlay composited on white). If the image fails, the section's charcoal background keeps the text readable.
- **Animation:** none.
- **Layout:** content is centered. Nothing overflows at 320/375/768/1280/1920px, including long unbroken titles.
- **Fit:** the H1 is visible in the first viewport at 375×812 and 1280×900.
- **Rest of Home:** the temporary page inventory and the "awaiting rebuild" note stay below the hero until later Home sections replace them. Metadata is unchanged.

## Acceptance matrix

| ID      | Scenario / expected result                                                                                                                                                            | Verification                                   |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| H01-A01 | Named region with one H1 (title), tagline and location from content. No headings below H1, forms, buttons or live regions.                                                            | Component tests                                |
| H01-A02 | Ordered actions with exact labels/hrefs; tel and Maps are native anchors, Contact is internal; none open new tabs. Primary vs outline styling and 44px targets.                       | Component tests; browser computed styles       |
| H01-A03 | Image: content alt, intrinsic size, eager/high priority, covers section; overlay hidden from assistive tech; derivative exists and matches provenance.                                | Component and unit tests; browser natural size |
| H01-A04 | Content derives from `site.ts`; schema rejects unsafe or blank values and invalid action counts.                                                                                      | Unit tests                                     |
| H01-A05 | Worst-case contrast ≥ 4.5:1; axe WCAG 2.x A/AA zero violations; H1 within first viewport; reflow at five widths with long title.                                                      | Playwright                                     |
| H01-A06 | Keyboard order Call → Directions → Contact after the skip link, with the 3px focus ring; Contact navigates. Blocked image, no JavaScript and reduced motion all keep the hero usable. | Playwright                                     |
| H01-A07 | Home integration: hero first in main after the preview note; inventory still works; header/footer Home-H1 regressions updated; full README workflow passes.                           | Playwright regressions; README workflow        |

Workflow: **specified → tests written → implemented → verified**.

## Verification

Completed **specified → tests written → implemented → verified** on 2026-11-16.

- **Tests:** 14 content/schema unit cases, 7 component cases and 14 browser cases (7 per desktop/mobile project). All failed before implementation, as did the two updated header/footer Home-H1 regressions.
- **Image:** the derivative is 229,154 bytes (from 2,545,135), same 1672×941 size.
- **Contrast:** the overlay is `bg-background/80`. Worst-case text contrast over white or black pixels is at least 4.5:1, and the screenshots confirm it.
- **Full README workflow:** 144 unit/component tests; export audit of 26 HTML files; 159 browser tests passed with one intentional skip.
- **Still open:** manual approval of the visual design, screen-reader review and other browser engines. The rest of the Home sections remain pending.
