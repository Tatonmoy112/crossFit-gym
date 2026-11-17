# H01-E: Homepage services carousel

Composition update: [H01-F](H01-F-home-features.md) now places Features immediately after Services and before Story. The second new section is implemented; its photography and detail pages remain deferred. Earlier direct Services/Story adjacency below is historical.

Date: 2026-11-17. Owner-approved homepage scope; photographs and individual service pages are deferred. See the execution record in [QA checklist](../qa-checklist.md).

## Content and composition

Home order is hero with embedded counters → Why choose us → Our Services → story missing-content state → temporary page inventory. The original 24 templates remain intact. This specification supersedes earlier Home adjacency instructions in H01-B/H01-C/H01-D, retaining their component contracts.

The owner approved all eight homepage services and the introduction in `newsection.md`. `src/content/home-services.ts` retains their exact copy and order, separately from the empty Programs catalog. Every card opens `/contact/`; no service route, fabricated catalog record, price, schedule or credential is created. Approval applies to this homepage copy, not the document's detailed service pages or suggested Features copy. Content-readiness and indexing guards remain active.

`homeServicesSchema` validates nonblank copy, unique slug-like IDs, destinations from the existing route configuration and optional local image metadata. Current records omit images. Original sources/assets are preserved; external example photographs are not fetched.

## Rendering and design

`HomeServices({ content })` and `ServiceCard({ item })` are Server Components. They compose Container, centered SectionHeading and server-owned cards passed through `HomeServicesCarousel({ children, headingId })`, a small client boundary. Empty records omit the whole section. Card, NavigationLink and installed Carousel primitives remain unchanged.

The light section uses 48/64px vertical padding and 32px group gaps. The approved eyebrow precedes the heading/description. Cards have 12px corners, a static charcoal gradient, 20px padding, an H3/subtitle at the top left and a decorative white circular arrow at the top right. Each card is one Contact link named “Ask about [service] [subtitle]”, retaining all visible text for speech-input accessibility. Height prefers a 3:4 portrait ratio, starts at 22rem and grows with content. Optional future photos use local lazy Next Image with a dark scrim; none are present now.

Gaps are 1rem. At normal root text size, slides occupy 85% of the viewport below 768px, two columns from 768px and four from 1024px. Named container queries additionally require 40rem/60rem available width for two/four columns, so enlarged text reduces the count. A card narrower than 14rem places its arrow on its own first row to preserve reading space. The shared 1550px maximum and responsive gutters remain unchanged.

## Motion and accessibility

Embla uses start alignment, looping and one-card steps, with no new dependency. A local five-second timeout advances only while intersecting, document-visible, not hovered and allowed by the user/motion preference. Selection schedules the next interval. Hover/offscreen/hidden-tab suspension resumes with a fresh delay. Without IntersectionObserver the carousel remains manual.

Focus, pointer interaction, keyboard arrows and manual buttons stop rotation until Play is explicitly activated. Pause/play precedes yellow previous/next controls in keyboard order; targets are at least 44px. Playback preserves the intended pointer action across focus changes. Focus stays on the activated button. Reduced motion hides playback, prevents the timer and makes manual navigation immediate. A section-owned watchFocus callback reveals partially visible keyboard-focused cards immediately, avoiding Embla's short Tab timing window while preserving pointer dragging.

Slides have title/position names. Fully offscreen slides become inert after initialization and update during scroll/reinitialization. Looping creates no duplicate markup. Timers, observers, events and inert attributes are cleaned up on unmount. Autoplay generates no live announcements.

Before initialization and without JavaScript, scoped CSS provides a native horizontal snap row with all eight links and hides inactive controls. Native horizontal touch scrolling remains available in the fallback; enhanced mode allows vertical panning and pinch zoom alongside dragging. Inset card focus outlines remain within the clipped viewport.

## Verification and remaining work

Unit/component checks cover exact copy, destinations, validation, server markup, empty content, timers, hover/intersection/document visibility, persistent interaction pause, pointer playback, reduced motion and teardown. Browser checks cover responsive screenshots at 320/375/768/1280/1920px, loops, dragging, focus, Contact navigation, no JavaScript, blocked assets, enlarged text and axe. Composition tests require the complete new order.

Run the entire README quality workflow and record actual outcomes in QA. Photography, detail pages, the second proposed homepage section, manual assistive-technology review and owner visual approval remain separate work. A build is not launch approval.
