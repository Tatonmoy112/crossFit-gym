# S04 ? Remove unfinished page routes

Implemented 2026-11-18.

The owner requested removal of blank/unbuilt pages and correct homepage connections. Remove only the confirmed placeholder page files and the empty product structure URL. Retain Home, About, Membership, Contact, Products, Supplements and populated product details. See [the current inventory](../sitemap.md).

Remove the temporary Home inventory and dead header/footer destinations. Homepage equipment/coaching/space actions become Contact inquiries with corresponding labels. Unwritten legal links are omitted while the legal approval notice and source records remain. Existing preview examples, disclosures, noindex, robots rules and release requirements remain unchanged. No dependencies, assets or transport contracts change. Next requires a reserved product parameter for an empty catalog; it reaches notFound(), and the export normalizer removes only that generated directory to avoid a blank HTML artifact on static hosts. A filesystem regression verifies populated product exports are preserved.

Regressions cover registered destinations, rejected removed destinations, absent placeholder files, all implemented route responses, every known removed URL returning 404, native Home/footer links without JavaScript, browser history and the Home header treatment. Shared foundation specimens now mount in isolated test markup on a finished page instead of depending on Programs.

QA results are recorded in [the checklist](../qa-checklist.md). Future unbuilt sections/detail pages, approved legal/business content, owner visual approval and manual accessibility review remain pending.
