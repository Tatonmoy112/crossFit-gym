# A01 / H01-L: About page and homepage introduction

## Implemented composition

The owner supplied the short homepage introduction and full About copy on 2026-11-17 and selected both scopes. Home now places HomeAbout immediately after Hero/counters and before Why choose us. Its white two-column introduction has a 4:3 approved gym photograph with a yellow offset frame, the supplied label/title/two paragraphs and Discover Our Story to `/about/`. Small containers stack image above copy. The obsolete bottom HomeStory placeholder, content contract and implementation are retired.

The existing `/about/` route composes nine separate Server Components:

1. Full-width photographic hero: breadcrumb, GET TO KNOW US and Built for Strength. Driven by Passion.
2. Our Story: editorial heading and supplied brand introduction, not an invented founding history.
3. Mission and Vision: paired charcoal/light panels with yellow accents.
4. Core Values: four numbered columns separated by vertical rules.
5. Gym Experience: four light icon cards using supplied aspirational descriptions.
6. Fitness Approach: charcoal section and yellow philosophy statement.
7. Community: oversized heading and supplied community aspirations, without fictional member photographs or testimonials.
8. Membership invitation: Explore Membership Plans to `/membership/`.
9. Final CTA: Become a Member to `/membership/`; Contact Us to `/contact/`.

## Content and boundaries

`src/content/about.ts` owns homepage and page copy. Dedicated Zod schemas validate nonblank text, local image paths/dimensions/alt text, unique item IDs, known icon names and existing trailing-slash route destinations. `[Gym Name]` becomes Crossfit Gym using the existing business record. The supplied copy is retained as paragraphs; no HTML injection, new services, fees, milestones, statistics or claims are added.

The existing owner-approved Home photo is reused, with its original unchanged. Additional trainer/member photography has not been supplied. The About canonical remains `/about/`; no `/about-us/` alias or new template is introduced. The SEO helper supplies the requested title and description, retaining current noindex/release safeguards. Supplied brand copy does not approve unrelated missing catalogs, membership services, legal content or public launch.

## Architecture and accessibility

HomeAbout and the nine About sections compose shared Container, SectionHeading, Button, NavigationLink and Breadcrumbs. AboutSectionHeading/AboutCopy implement the repeated heading/paragraph pattern without unrelated optional props. All new presentation renders on the server; no client state, dependencies or integration is added. Scoped CSS uses existing palette and typography roles. Container thresholds at 40rem/60rem adapt panels, editorial columns and feature grids to available text space; enlarged text falls back to stacked layouts. Images reserve aspect ratio and have descriptive alt text. All copy remains readable if images fail.

Native links work without JavaScript, visible focus remains, and there is no animation. One H1 belongs to each page, with named regions and H2/H3 hierarchy. Existing homepage sample counters, memberships, products and stories retain their original preview isolation.

## Acceptance and verification

- Validate content and metadata; reject blank text, duplicate IDs, unknown icons and invalid routes.
- Verify Home Hero → About → Why choose us order in both preview configurations; remove the old Story placeholder.
- Verify all nine About sections, heading associations, original supplied paragraphs and native CTA destinations.
- Exercise actual App Router navigation/history, keyboard focus, no-JavaScript links, and the Breadcrumb Home recovery.
- Inspect 320/375/768/1280/1920 layouts, enlarged/spaced text, unavailable fonts/images, reduced motion, screenshots and axe results.
- Run the complete README workflow and record actual results in the QA checklist. Owner visual approval and manual device/screen-reader review remain separate.

Verified on 2026-11-17: all 346 unit/component tests across 61 files, complete Chromium suite (336 passed, two intentional skips), typecheck, lint, formatting, final production build and 38-HTML export audit pass. All ten About browser cases pass again after rebuilding the final yellow breadcrumb hover correction. Reviewed desktop/mobile and enlarged failed-asset captures. See the [QA record](../qa-checklist.md) for exact evidence and remaining content/manual-review limitations.
