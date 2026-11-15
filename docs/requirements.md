# Requirements and implementation boundary

The approved scope is the complete website, not a reduced initial launch: 24 templates including the blueprint pages, screenshot page types, supporting detail templates and custom 404.

Primary visitor goal: learn about Crossfit Gym and contact the Uttara team. Secondary goals: discover training, coaches, facilities, class times, membership, gallery, FAQs, journal, affiliate information, vacancies and supplements when approved information is available.

Frontend-only: static export; no CMS, database, authentication, internal bookings, checkout or payments. External destinations can be used after verification. Form input validation does not imply delivery.

Source of truth: the supplied blueprint, local business information and provided brand assets. Twelve PNGs are layout references, not proof that their depicted businesses, services or people belong to this gym. An editable Figma file and complete client content were not available.

Implemented: all page routes and detail templates, reusable shell, typed local content, validation, URL-driven discovery controls, schedule and membership controls, gallery dialog, FAQ search, form validation, static SEO infrastructure, tests, CI and export server.

Content incomplete: most business records, detailed copy, original page photography, opening hours, legal text and external-service providers. Do not silently remove their page templates; maintain their content-needed states and readiness entries.

Release targets: WCAG 2.2 AA; no overflow at 375/768/1280/1920 pixels; no broken internal links or missing referenced assets; static build; mobile Lighthouse Performance >=90 and other categories >=95 after content and indexability approval. Scores and conformance must be measured rather than inferred.
