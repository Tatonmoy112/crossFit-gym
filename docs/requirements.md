# Requirements and implementation boundary

The approved scope is the complete website, not a reduced initial launch: 24 templates including the blueprint pages, screenshot page types, supporting detail templates and custom 404.

Primary visitor goal: learn about Crossfit Gym and contact the Uttara team. Secondary goals: discover training, coaches, facilities, class times, membership, gallery, FAQs, journal, affiliate information, vacancies and supplements when approved information is available.

Frontend-only: static export; no CMS, database, authentication, internal bookings, checkout or payments. External destinations can be used after verification. Form input validation does not imply delivery.

Source of truth: the supplied blueprint, local business information and provided brand assets. Twelve PNGs are layout references, not proof that their depicted businesses, services or people belong to this gym. An editable Figma file and complete client content were not available.

Current reset state (2026-11-15): all 24 routes remain as neutral shells. The old shared shell, page sections and interactive components were removed for a complete UI rebuild. Typed local content, validation, static route generation, metadata/robots/sitemap infrastructure, inquiry transport contract, CI and export serving remain. See docs/component-rebuild-plan.md for the complete reconstruction backlog.

The full official shadcn/ui foundation was subsequently installed at the owner's request: 63 local UI modules, supporting files and neutral theme tokens. Gym-specific design and page integration remain pending. See docs/component-inventory.md and docs/shadcn-setup.md.

Content incomplete: most business records, detailed copy, original page photography, opening hours, legal text and external-service providers. Do not silently remove their page templates; maintain their content-needed states and readiness entries.

Release targets: WCAG 2.2 AA; no overflow at 375/768/1280/1920 pixels; no broken internal links or missing referenced assets; static build; mobile Lighthouse Performance >=90 and other categories >=95 after content and indexability approval. Scores and conformance must be measured rather than inferred.
