# H01-H: Homepage Member Success Stories

Owner-approved homepage-only adaptation of the testimonial reference supplied in chat on 2026-11-17. The reference has five quote/portrait cards; the approved implementation uses exactly the three supplied fictional examples, with a light quote card on either side of a taller charcoal focal card. No separate stories page or testimonial submission integration is included.

## Content and composition

Home places this section after Membership preview and before Our Story, only while `site.preview` is true. `src/content/previews/home-success-stories.ts` contains the exact supplied introduction, supporting line, three names/focuses/quotes and closing block. These examples never populate the empty real testimonials catalog. A visible, section-associated notice says: “Fictional sample testimonials for layout preview. Names and quotations are illustrative, not verified member stories.” Preview indexing protections remain enabled; no review structured data is emitted.

HomeSuccessStories and SuccessStoryCard are Server Components. The client receives server-composed slides and action content, not a business-content import. Cards use semantic figure/blockquote/figcaption and are not links. The only two actions are Start your journey and Your Story Starts Here — Join Our Community, both opening `/contact/`. There are no invented metrics, ratings, social profiles, member photographs or consent claims.

## Visual contract

The existing Container retains its normal width/gutters. Inside it, a rounded white panel sits on a muted light background, with responsive inner padding. At 60rem of usable panel width the introduction splits into two columns and the three cards fit without overlap; below that threshold the heading and introduction stack. Inter supports Barlow Condensed headings.

The initially selected Nadia Ahmed card is a charcoal gradient with decorative initials and a 30rem minimum height. Side cards use light surfaces and a 20rem minimum. Selecting another story transfers the focal presentation; DOM order stays Arif, Nadia, Tanvir. Cards grow intrinsically for quotes, identity text and enlarged type; no fixed height or height animation clips their content. Inside cards at 18rem and below, identity rows stack the initials above the name/focus to preserve reading width. Optional future local-image metadata is validated but no photography is supplied or downloaded. Current placeholders use CSS only.

Below 60rem usable width slides use 70% width; below 40rem they use 88%; at 17rem and below they use full width with reduced card padding. Navigation/footer controls stack when the available reading width is narrow. Both Contact buttons can wrap. All controls have targets of at least 44px.

## Interaction and fallback

HomeSuccessStoriesCarousel uses existing Embla primitives with center alignment, startIndex 1, slidesToScroll 1, loop false and containScroll false. Three unique slides provide three individual selection positions. No timer, autoplay, cloning, new package, route, global store or backend is added. At finite boundaries aria-disabled controls ignore activation and retain keyboard focus. Arrow keys operate the focused viewport or controls, without moving focus between controls. Live reduced-motion changes make movement immediate.

After initialization the selected index controls presentation; fully offscreen slides become inert and selection is announced politely. Scroll/select/reInit subscriptions update inert/presentation state and are removed on unmount, along with inert/active attributes. An additive typed viewportProps option on shared CarouselContent provides native viewport labeling, focus and keyboard events while leaving existing callers unchanged.

Before initialization and without JavaScript, all three quotes and both Contact actions remain in the document, no slides are inert and inactive controls/status are hidden. The viewport is focusable and natively horizontally scrollable with snapping; wide layouts display all three cards with Nadia's focal presentation. Edge selections in the enhanced finite carousel can leave empty space instead of repeating a story.

## Acceptance and limitations

Unit/component cases cover supplied copy/order, unique IDs/nonblank fields, route validation, preview/catalog separation, future local images, server markup, finite boundaries, focus, live reduced motion and subscription cleanup. Browser cases cover six widths (320/375/768/1024/1280/1920), selected presentation, actual mouse/touch swipe, Contact/history, viewport keyboard operation, inert state, blocked assets, 200% spaced text, axe and no JavaScript. Run the full README workflow and record executed results in docs/qa-checklist.md; a specification is not evidence that checks passed.

Approved real member stories, consent, photography, owner visual approval, manual screen-reader/device/browser-zoom review and other browser engines remain pending. Content/legal/domain/hosting/release gates are unchanged. No publication is included.

Executed 2026-11-17: all 275 unit/component tests pass; all 253 applicable browser cases are verified across the complete 254-case run and four corrected hero-selector reruns, with one intentional viewport skip. All ten section browser cases pass in both focused and complete workflows. Typecheck, lint, formatting, production build and export audit pass. See the QA record for exact run results, diagnostic fixes, captures and limitations; this is not represented as one clean full-browser run.
