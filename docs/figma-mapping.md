# Reference audit and rebuild mapping

The previous UI was removed on 2026-11-15. These references are retained as inputs for the rebuild; the table describes intended component/page responsibilities. It does not claim that the old visual implementation still exists.

Only raster references were available. There is no Figma file key, editable hierarchy, verified font specification, design tokens, mobile frame or interaction-state specification. Exact Figma fidelity cannot be claimed.

| Reference                                 | Dimensions | Rebuild mapping                                                                    |
| ----------------------------------------- | ---------- | ---------------------------------------------------------------------------------- |
| `hero_home_section.png`                   | 1903x946   | Global header, hero identity, contact actions                                      |
| `Featured Programs_section_home page.png` | 1919x741   | Program navigation and data-driven homepage highlights                             |
| `Screenshot_1.png`                        | 1919x666   | Benefits/story content reference; unverified medical/nutritional claims not copied |
| `Screenshot_2.png`                        | 1911x806   | Team preview structure; Invictus staff photograph not reused                       |
| `location_section_home.png`               | 1919x830   | Home location preview, actual Uttara directory/detail, map link                    |
| `footer.png`                              | 1907x875   | Footer groups, contacts and social links; no fake subscription                     |
| `program-list_page.png`                   | 1920x3521  | Program discovery and cards                                                        |
| `Individual program page.png`             | 1920x5623  | Structured program detail and related content                                      |
| `blog_list_page.png`                      | 1920x5082  | Article discovery, search, categories and pagination                               |
| `individual blog page.png`                | 1920x5219  | Article body, reading progress, related links and unavailable-comment notice       |
| `affiliates page.png`                     | 1920x6242  | Offering, tracks, benefits, providers and associated-coach slots                   |
| `FEATURED SUPPLEMENTS_ section.png`       | 1919x730   | Informational product catalog and options; no internal cart or payment             |

The previous adaptation used yellow/charcoal, off-white surfaces and strong display headings. That implementation and its tokens have been removed. Reassess the replacement direction against supplied branding and references before implementing new components; no replacement visual direction is approved yet.

Mobile layouts, focus/hover states and reduced-motion behavior are implementation decisions requiring review. Scrollbars and Windows activation overlays are screenshot artifacts and are not implemented.

The in-app Browser runtime reported no available browser. Automated browser tests are separate test infrastructure; an interactive visual comparison against the references remains outstanding.
