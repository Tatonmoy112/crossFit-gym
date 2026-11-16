# H01-A2: Home hero design

Status: **verified** (see [QA record](../qa-checklist.md#h01-a2-home-hero-design-2026-11-16); owner visual approval pending). Date: 2026-11-16. This restyles [H01-A Home hero](H01-A-home-hero.md) from a style reference the owner supplied (an Invictus Fitness hero screenshot, provided in the conversation). Where this document differs from H01-A, it replaces H01-A's contract. All other H01-A rules still apply: validated content, owner-approved image, no invented copy, a single H1 and Server Component only.

## Reference to project mapping

| Reference                                                     | Implementation                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full-bleed gym photo, darker on the text side                 | Local `home-hero.webp` (`object-fit: cover`). A uniform charcoal scrim `[data-hero-overlay]` at 70% guarantees contrast, and an extra decorative left-to-right gradient `[data-hero-gradient]` adds depth.                                                                         |
| Left-aligned text block, vertically centered                  | Content is start-aligned inside `Container` and centered in a hero of at least `min(88svh, 56rem)`.                                                                                                                                                                                |
| Huge uppercase two-tone headline (white phrase + green brand) | `<h1>` with `type-display`, uppercase and slight tracking. It contains a white `[data-hero-tagline]` "One step closer." on its own line, then a yellow (`--primary`) `[data-hero-name]` "Crossfit Gym". The accessible name is "One step closer. Crossfit Gym".                    |
| White subline ("Battle Tested since 2009")                    | `[data-hero-location]`: map pin plus `site.shortAddress`, white, semibold, `text-lg`. The reference's claim is **not** copied.                                                                                                                                                     |
| Solid green CTA with arrow; outlined CTA with pin icon        | shadcn `Button asChild` around `NavigationLink`, size `lg`. The labels are uppercase, 14px, bold, with `0.12em` tracking and a 2px radius. **Primary:** yellow fill, charcoal text, arrow icon. **Outline:** transparent fill, white text, white border, pin icon.                 |
| Vertical letter-spaced brand text at the far left             | `[data-hero-vertical]` "Crossfit Gym": `aria-hidden`, yellow, uppercase, vertical. It is shown at 1280px and wider and hidden below that. With the shared 1550px container maximum, its 8px left offset keeps at least 8px clearance from content at the narrowest desktop gutter. |
| V-shaped bottom edge                                          | The section is clipped by a `clip-path` polygon whose center point sits `3rem` lower than the sides (`1.5rem` below 768px). Content padding stays clear of the cut.                                                                                                                |
| Green accent, serif display font, transparent header          | Mapped to yellow and Barlow Condensed. The transparent header is out of scope; it would be a header task.                                                                                                                                                                          |

## Owner decisions (2026-11-16)

- **Headline:** the tagline plus the name, two-tone, using approved text only. No reference copy is used.
- **Actions:** exactly two.
  1. "Call 01323-275695" → `tel:+8801323275695` (primary)
  2. "Get directions" → the supplied Maps URL (outline)
- **Contact:** the "Contact us" action is removed. Contact stays reachable through the header and footer.

## Shared change: slotted Button anchor states (completes the open U01-A item)

`Button` hover and active colors used `enabled:`, which only matches form controls, so `Button asChild` links never received them. Those selectors become `not-disabled:`:

- For native buttons, `:not(:disabled)` matches the same elements as `:enabled`, with the same specificity, so they are unchanged.
- Disabled buttons still keep their disabled colors.
- Slotted links now receive the variant hover and active states.

## Acceptance matrix (new or changed cases)

| ID      | Scenario / expected result                                                                                                                                                                                                                                                   | Verification                    |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| H01-A01 | Region named by the H1 "One step closer. Crossfit Gym". The tagline and name are separate spans in order. Location text is present. One H1 and no other headings.                                                                                                            | Component tests                 |
| H01-A02 | Exactly two actions in order, with exact hrefs and no new tabs. Both are shadcn Buttons (`data-slot="button"`); the primary uses the `default` variant and the secondary uses `outline`.                                                                                     | Unit and component tests        |
| H01-A08 | Uppercase Barlow H1 aligned to the start. The tagline is white and the name is yellow `rgb(255, 204, 0)`. The H1's left edge aligns with the content container. Worst-case contrast is at least 4.5:1 for white text and at least 3:1 for the large yellow name.             | Playwright                      |
| H01-A09 | Buttons are uppercase, 14px and 700 weight, with letter-spacing above 0 and a radius of at most 4px. The primary has a yellow fill and charcoal text; the outline has a transparent fill, white text and a white solid border. Both are at least 44px tall and have an icon. | Playwright                      |
| H01-A10 | Hovering the primary link changes its fill to `--primary-hover` `rgb(230, 184, 0)`, and hovering the outline link changes its fill from transparent. Native Button regressions are unchanged.                                                                                | Playwright; existing U01-A spec |
| H01-A11 | The vertical brand text is `aria-hidden`: visible at 1280px without overlapping the H1, and hidden at 1024px and 375px.                                                                                                                                                      | Playwright                      |
| H01-A12 | `clip-path` is a polygon. The hero is at least `min(88svh, 56rem)` tall at 1280×900, and the H1 is still inside the first viewport at 375×812 and 1280×900.                                                                                                                  | Playwright                      |
| H01-A13 | Reflow at 320–1920px with a long title. Blocked image, forced colors, reduced motion and no JavaScript all keep the hero usable. Keyboard order is Call → Directions with the 3px focus ring. Zero axe violations. Header and footer regressions use the new H1 name.        | Playwright; README workflow     |

Workflow: **specified → tests written → implemented → verified**.

## Verification

Completed **specified → tests written → implemented → verified** on 2026-11-16.

- **Tests first:**
  - 5 unit/component cases failed against the previous hero;
  - every new browser case failed in both projects (the hover case is skipped on touch);
  - the 4 updated header/footer regressions failed.
- **Fixed during implementation:**
  - `cn` does not merge the custom `rounded-control` token, so the 2px radius uses a `data-[slot=button]` selector to win on specificity.
  - `w-full` would have overridden the Container's width rule and removed its gutters, so it was dropped.
  - The vertical name collided with the headline at 1024px (32px margin), so it is limited to 1280px and wider, with a no-overlap assertion.
- **Full README workflow:** 156 unit/component tests; export audit of 26 HTML files; 170 browser tests passed with 2 intentional skips.
- **Visual check:** screenshots at 1920/1280/375px and a capture of the bottom-edge V-cut were compared with the reference.
