# Current route inventory

Updated 2026-11-18 after the owner requested removal of all unfinished pages. This supersedes the earlier 24-template preservation scope.

| Page            | Route                | Status                                                       |
| --------------- | -------------------- | ------------------------------------------------------------ |
| Home            | `/`                  | Implemented; temporary page inventory removed                |
| About           | `/about/`            | Complete section composition                                 |
| Membership      | `/membership/`       | Implemented with disclosed illustrative plans in preview     |
| Contact         | `/contact/`          | Working phone, Maps/social links; disabled message preview   |
| Products        | `/products/`         | Implemented listing and discovery                            |
| Supplements     | `/supplements/`      | Implemented filtered product listing                         |
| Product details | `/products/[id]/`    | Ten populated illustrative records, preview-only and noindex |
| Not found       | Unknown/removed URLs | Custom 404 with Home recovery                                |

Removed placeholder URLs: Programs and its structure preview, Coaches and its structure preview, Facilities, Schedule, Gallery, FAQ, Blog and its structure preview, Affiliates, Locations and Uttara detail, Careers and its structure preview, Privacy, Terms, the supplement structure preview and the product structure preview. Existing catalog data, legal approval records, assets, homepage sections and shared components remain available for later work.

Shared header/footer groups now expose Our story, Membership, Products and Contact. Home equipment/coaching/space actions use clearly labelled Contact inquiries; other completed-page links stay in place. Home FAQ remains available in its existing section. No replacement routes, redirects or new pages are added. Removed URLs deliberately return 404.

The sitemap remains empty while preview indexing is disabled. If indexing is explicitly enabled after release approval, only the implemented Home, About, Membership and Contact pages are included; product examples/listings remain excluded. Robots rules and release gates are unchanged. With no product records, the reserved static-export parameter reaches notFound(). The export normalizer removes its generated artifact so static hosts return 404 rather than a blank 200 response.
