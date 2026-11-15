# Complete sitemap

| Template          | Route                  | State                                                                                           |
| ----------------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| Home              | `/`                    | Supplied business details and navigation; populated highlights render from approved collections |
| About             | `/about/`              | Story/mission/values/community content slots; unapproved copy clearly identified                |
| Programs          | `/programs/`           | Search, categories, pagination, empty state                                                     |
| Program detail    | `/programs/[slug]/`    | Overview, audience/inclusions content, associations and inquiry; preview available              |
| Coaches           | `/coaches/`            | Directory and discovery controls                                                                |
| Coach detail      | `/coaches/[slug]/`     | Biography/credentials/specialty sections, associations and inquiry; preview available           |
| Facilities        | `/facilities/`         | Supplied photograph and facility-content slots                                                  |
| Schedule          | `/schedule/`           | Day/program/coach filters, responsive week and class dialog                                     |
| Membership        | `/membership/`         | Plan grid, billing periods, comparison and inquiry context                                      |
| Gallery           | `/gallery/`            | Category filters and accessible lightbox                                                        |
| FAQ               | `/faq/`                | Category/search controls and native accordions                                                  |
| Blog              | `/blog/`               | Article discovery and pagination                                                                |
| Article detail    | `/blog/[slug]/`        | Body, reading progress, sharing, neighbors and related links; preview available                 |
| Affiliates        | `/affiliates/`         | Offering, tracks, benefits, provider links and coach slots                                      |
| Locations         | `/locations/`          | Actual supplied locations only                                                                  |
| Location detail   | `/locations/[slug]/`   | Uttara address, contacts, directions and related page navigation                                |
| Contact           | `/contact/`            | Actual contact channels and honest inquiry validation                                           |
| Careers           | `/careers/`            | Vacancy discovery and recruitment information state                                             |
| Vacancy detail    | `/careers/[slug]/`     | Role requirements/responsibilities/application sections; preview available                      |
| Supplements       | `/supplements/`        | Informational catalog discovery                                                                 |
| Supplement detail | `/supplements/[slug]/` | Product/ingredient/usage sections, options and external destination; preview available          |
| Privacy           | `/privacy/`            | Explicit notice until approved legal text is supplied                                           |
| Terms             | `/terms/`              | Explicit notice until approved legal text is supplied                                           |
| Not found         | Unknown URLs           | Custom 404 with recovery links                                                                  |

There are 23 named route templates plus the custom 404. Detail routes expand with approved records. The export also includes framework error output, robots.txt and sitemap.xml.

`content-preview` slugs are isolated layout previews, not catalog records. The only actual detail record currently supplied is `/locations/uttara/`.

Main navigation groups About, Training, Explore and Visit us. The footer exposes all destinations. No account, cart, checkout, internal payment or booking route exists.
