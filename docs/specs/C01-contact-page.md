# C01 — Contact Us page

## Scope and composition

Rebuild the existing canonical `/contact/` route. Home, its FAQ ending and temporary inventory, shared header/footer, original assets and all original templates remain unchanged. No photography or dependency is added.

Six independently composed Server Component sections render in order:

1. Editorial hero: supplied CONTACT US heading/paragraphs, Call our team and Get directions actions.
2. Contact introduction: supplied WE'RE HERE TO HELP copy with Crossfit Gym substituted.
3. Contact methods: yellow phone card, charcoal visit card, official social links and white disabled message preview.
4. Location: supplied introduction and bordered semantic address panel with decorative yellow location accent and real Maps link.
5. Five Contact-specific FAQs using the existing native disclosure enhancement.
6. Light Membership invitation with yellow accent and Membership/telephone actions, distinct from the shared footer CTA.

## Content and behavior

`src/content/contact-page.ts` owns copy and derives telephone, display number, exact full address, Maps destination and social URLs from `site.ts`. `src/schemas/contact-page.ts` validates nonblank copy, registered routes/existing contact channels, seven unique inquiry topic IDs and five unique FAQ IDs. Shared Home/Membership FAQs remain unchanged.

The six-field preview renders only while `site.preview` is enabled. Its notice precedes a disabled fieldset, disabled controls and disabled type=button action. Name, Email, Inquiry Type and Message retain required markers. Seven supplied categories are retained. There is no HTML form, submit handler, API, storage, provider, email address, delivery promise or success message. The existing inquiry validation/transport contract is unchanged. Outside preview, contact cards expand into two desktop columns.

Opening hours and response times are explicitly unconfirmed; visits, training and products require confirmation through working channels. Metadata describes inquiries through real channels and retains `/contact/` plus root indexing protections.

## Layout and access

Barlow Condensed headings and Inter text reuse existing yellow/charcoal/light tokens. The scoped stylesheet was created before importing it globally. Sections own their containers and use intrinsic heights, wrapping and 44px active targets.

Named container queries split hero/introduction at 48rem usable width, methods/preview at 60rem in an approximate 40/60 ratio, and short fields at 32rem inside the padded preview card. Subject/Message span the form width. Below thresholds, content stacks in reading order; narrow panels reduce card/notice insets to preserve enlarged-text reading space. The FAQ list establishes its own container to avoid narrow answer columns triggered by wide ancestors.

Native links, semantic addresses and named sections remain available without JavaScript. Only the reused FAQ enhancement has a client boundary. Disabled controls accept no input/focus. Icons are decorative; focus outlines, forced colors and global reduced motion remain supported.

## Verification and pending work

See the C01 entry in [QA checklist](../qa-checklist.md) for actual checks and screenshot evidence. Tests cover copy, source-derived contacts, validation, section order, preview exclusion, disabled controls, native navigation, responsive layout, FAQ keyboard/history, no JavaScript, enlarged/spaced text and failed assets.

Outstanding: live message delivery and approved privacy/consent handling, official email, confirmed opening hours, final owner visual approval and manual device/screen-reader/accessibility review. Implementation does not imply release approval.
