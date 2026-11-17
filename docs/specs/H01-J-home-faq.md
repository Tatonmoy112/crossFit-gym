# H01-J: Homepage FAQ

Owner-approved homepage-only adaptation of the wide-row reference supplied in chat on 2026-11-17. Home places FAQ immediately after Member Success Stories and before Our Story. The six answers use the accuracy adjustments approved during planning. Unlike illustrative membership/product/story previews, this factual section also renders when `site.preview` is false.

## Content and structure

The supplied eyebrow, headline, introduction and closing Contact block live in `src/content/home-faq.ts`. The ordered IDs select Memberships, Beginners, Personal Training, Fitness Products, Gym Visit and Supplements from the shared `src/content/faqs.ts` collection. Existing address/contact/hours entries remain available; the existing `plans` record is updated rather than duplicated. Nine shared records now contain six homepage answers plus the original three visiting/contact answers.

Zod validates nonblank text, stable identifiers, unique collection/selection IDs and the fixed Contact destination. Selection rejects unresolved references at build time. Personal Training is already an owner-approved service in home-services. Session details, membership benefits/prices, visiting arrangements and product availability remain inquiries. The product answer explicitly says checkout is unavailable; ingredients and usage information are not claimed to exist on unfinished product pages. No new prices, schedule, credentials, services or availability promises are added.

HomeFaq composes the existing Container, SectionHeading, Button and NavigationLink. Server-rendered FaqRow owns native details/summary markup and plain escaped answer text. FaqDisclosures receives the server-composed rows and enhances only interaction. No business content is imported into that client boundary. All six start collapsed and all answer text is included in exported HTML. The Contact button opens the existing Contact route, whose form delivery integration remains unavailable. This step does not rebuild `/faq/`, add a View All link, emit FAQ structured data or change routes, metadata/indexing, dependencies or preview flags.

## Visual contract

The full-width section uses a muted light surface, charcoal copy, yellow decorative dot/active underline and thin divided rows. Heading and description precede the list. Two-digit decorative row numbers and a rotating plus indicator sit at the far right; the accessible summary name is the question alone. The closing text and yellow Contact action wrap naturally beneath the list.

At 60rem usable container width, engines supporting `details::details-content` use an intrinsic grid: question left, answer right, marker at the far edge. Question and answer begin at the same vertical position; both contribute to row height. Smaller layouts and engines without that selector stack the answer under its question. No fixed panel height, clipped maximum-height animation or absolute-positioned body is used. Reveal opacity and indicator rotation use the existing control duration; global reduced-motion styles make transitions immediate. Controls have at least 44px height and retain the shared visible keyboard focus.

## Interaction and fallback

With JavaScript, only one row is open. Mouse entry opens a temporary answer only when `(hover: hover) and (pointer: fine)` matches. Moving into the answer keeps it open; exiting closes an unpinned answer. Clicking a temporary answer's summary pins it open; clicking again closes it. Clicking or hovering another question replaces the open answer. Touch and pen entry do not trigger a preview; tap, Enter and Space toggle through the native summary activation. Escape closes the current answer without reopening until another pointer entry/activation.

Pointer operations never close another answer containing focus. When focus leaves an unpinned answer after pointer exit, the temporary disclosure closes. Escape from inside answer content restores focus to its visible summary before closing. Effects remove listeners/ready markers on unmount and guard pending focus cleanup. No timers, global state, backend or package is introduced.

Without JavaScript, native disclosures remain keyboard/click operable and share a disclosure group name. Supporting browsers keep one open; older browsers can independently expand rows. The Contact link remains native. Browsers without the desktop disclosure-content styling retain the readable stacked presentation.

## Verification and limitations

Coverage includes collection/selection validation, retained records, SSR/collapsed HTML, preview-disabled Home placement, hover/click persistence, coarse-pointer exclusion, keyboard focus protection, Escape, cleanup, real responsive geometry, touch, Contact/history, no JavaScript, enlarged spaced text/long words/blocked assets, reduced motion and axe.

Run and record the complete README workflow and representative visual review in `docs/qa-checklist.md`. Test declarations alone are not evidence of execution. Owner visual approval, manual screen-reader/device/browser-zoom review and other browser engines remain separate review tasks. Existing content/legal/domain/hosting/release gates remain unchanged. No publication is included.

Executed 2026-11-17: all 335 unit/component tests across 56 files pass; typecheck, lint, formatting, production build and the 38-HTML export audit pass. All 310 applicable browser cases are verified across the full run and final affected-case rerun, with two intentional skips in the full suite. The two full-run failures were outdated container counts; both pass on the rebuilt final export. The concurrent owner change placing Memberships before Features is preserved and its affected placement checks pass. See the QA checklist for exact reports, screenshots and remaining manual-review limitations.
