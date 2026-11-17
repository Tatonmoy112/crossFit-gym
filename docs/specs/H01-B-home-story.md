# H01-B: Home introductory story

Superseded on 2026-11-17 by [A01 / H01-L](A01-about.md): supplied homepage and full About content now render through the new HomeAbout and modular About page. HomeStory and its missing-content placeholder are retired. The material below is the historical implementation/verification record.

Current composition after H01-H: Story follows the Success Stories preview while site preview is enabled; with preview disabled it follows Features. Earlier adjacency notes below describe prior stages.

Current composition: Story follows the [H01-G Membership preview](H01-G-home-memberships.md) while site preview is enabled, or Features otherwise. Services, Why choose us and the hero/counters precede them. Earlier ordering below is historical.

Status: **verified** (see [QA record](../qa-checklist.md#h01-b-home-story-2026-11-16); manual review remains open). Date: 2026-11-16. This is the second Home section ([rebuild plan](../component-rebuild-plan.md), page 1: Hero → **introductory story** → discovery links …). It is built after [H01-A Home hero](H01-A-home-hero.md).

## Purpose and inputs

The section introduces the gym in its own words, directly after the hero. The only source is `about.story` in `src/content/about.ts`. It is currently `null`, because no story, mission, values or community text has been supplied, and `docs/content-readiness.json` lists "Homepage and About copy" as not approved.

The reference `figma/Screenshot_1.png` ("Why Invictus?") is a benefits grid built on unverified service claims (medical spa, nutritional guidance). Its copy, claims and icons are **not** reused. Only its position as the first content section after the hero applies.

No text is invented. The real site shows an explicit missing-content state until approved story text is supplied. The supplied-story layout is verified only with clearly labelled test fixtures.

## Contract

### Content

- **Validation:** `aboutSchema` in `src/schemas/content.ts` validates `about.ts`:
  - `story`, `mission` and `community` are each nonblank text or `null`;
  - `values` is an array of nonblank strings;
  - blank or whitespace-only text is rejected rather than shown as empty.
  - The exported `about` shape is unchanged.
- **`homeStory`** in `src/content/home.ts`:
  - heading "Our story" (the same label as the site navigation);
  - `story` taken from `about.story`;
  - `link`: "More about Crossfit Gym" → `/about`;
  - `missing`: the ContentState copy "Our story has not been supplied yet" / "Approved story text for Crossfit Gym has not been provided for this website."

### Component

- `HomeStory({ content })` in `src/features/home/home-story.tsx` is a Server Component with a required prop and no client state.
- It renders `<section aria-labelledby="home-story-title">` on the page's light surface, inside a `Container` with vertical section padding.

**Supplied story**

- A `SectionHeading` H2 "Our story" (`id="home-story-title"`).
- The story text is split on blank lines into separate `<p>` paragraphs:
  - empty fragments are dropped;
  - each paragraph uses the 65ch reading measure;
  - text is escaped.
- A `NavigationLink` "More about Crossfit Gym" to `/about`.

**Missing story**

- The existing `ContentState`, with its H2 given `id="home-story-title"` so it names the region.
- No link, no story paragraphs and no claims.
- This needs one small shared change: `ContentState` and `SectionHeading` pass an optional `headingId` through. `SectionHeading` already supports it, and the existing Programs consumer is unchanged.

**Both states**

- No H1, forms, buttons or live regions.
- Long unbroken text wraps at 320–1920px.
- No animation.

**Placement**

On Home, the section sits directly after the hero and before the temporary page inventory.

## Acceptance matrix

| ID      | Scenario / expected result                                                                                                                                   | Verification                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| H01-B01 | Real content (story `null`): region named by the missing-state H2 with its description; no link, no story paragraphs, no H1.                                 | Component tests; Playwright on `/`    |
| H01-B02 | Fixture story: region named "Our story"; paragraphs split on blank lines with no empty `<p>`; link to `/about`; no missing state.                            | Component tests                       |
| H01-B03 | `aboutSchema` accepts `null`/nonblank text and rejects blank or whitespace text and blank values; `homeStory` derives from `about` and has no invented copy. | Unit tests                            |
| H01-B04 | `ContentState` forwards `headingId`; Programs output unchanged.                                                                                              | Component tests; existing regressions |
| H01-B05 | Home order hero → story → inventory; H2 typography; zero axe WCAG 2.x A/AA violations; reflow at 320/375/768/1280/1920px; no JavaScript keeps content.       | Playwright                            |
| H01-B06 | Fixture story in the browser: 65ch measure, long unbroken words reflow, keyboard focus ring on the About link, and Enter navigates to `/about/`.             | Playwright (server-rendered fixture)  |
| H01-B07 | Full README workflow passes; docs record the evidence.                                                                                                       | README workflow                       |

Workflow: **specified → tests written → implemented → verified**.

## Verification

Completed **specified → tests written → implemented → verified** on 2026-11-16.

- **Tests:** 11 unit cases and 5 component cases failed first, along with the browser spec, because the schema, content and feature modules were missing. All now pass, together with 4 browser cases per project.
- **Real Home:** shows the explicit missing state directly after the hero.
- **Supplied-story layout:** verified only with fictitious fixtures.
- **Full README workflow:** 157 unit/component tests; 167 browser tests passed with one intentional skip.
- **Still open:** real story text, which is pending owner approval, and manual design review.
