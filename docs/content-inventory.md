# Content inventory and update guide

| Content                        | Module                      | Supplied status                                                                 |
| ------------------------------ | --------------------------- | ------------------------------------------------------------------------------- |
| Business identity and contacts | `src/content/site.ts`       | Name, address, phone, Instagram handle and Facebook URL supplied                |
| Navigation and UI headings     | `navigation.ts`, `pages.ts` | Implemented; copy is UI guidance, not unsupported business claims               |
| About                          | `about.ts`                  | Story, mission, values and community absent                                     |
| Programs                       | `programs.ts`               | No approved records                                                             |
| Coaches                        | `coaches.ts`                | No approved records or portraits                                                |
| Facilities                     | `facilities.ts`             | Detailed descriptions and inventory absent                                      |
| Schedule                       | `schedule.ts`               | No approved class records                                                       |
| Membership                     | `memberships.ts`            | No approved prices or plans                                                     |
| Gallery                        | `gallery.ts`                | One supplied cover photograph                                                   |
| FAQs                           | `faqs.ts`                   | Four answers grounded in supplied contacts or explicit information availability |
| Articles                       | `articles.ts`               | No approved articles/authors/dates                                              |
| Affiliates                     | `affiliates.ts`             | No confirmed offering or provider links                                         |
| Locations                      | `locations.ts`              | One actual Uttara record; opening hours absent                                  |
| Vacancies                      | `vacancies.ts`              | No approved vacancies/application destinations                                  |
| Supplements                    | `supplements.ts`            | No approved catalog, ingredients, variants, prices or destinations              |
| Testimonials                   | `testimonials.ts`           | No approved quotations                                                          |
| Legal                          | `legal.ts`                  | Both documents awaiting approved text                                           |

Catalog records share validated slugs, titles, summaries, categories, structured sections and optional image/author/date/destination/variant fields. Relationships use program, coach, location and membership identifiers. Section bodies are rendered as React text; no raw client HTML is injected.

For a real catalog record, add approved content with `status: "approved"` to the relevant content module. Supply all applicable sections and asset metadata. Rebuild to produce its static detail page; no API call or CMS is required. Do not insert `content-preview` into real collections.

Class records require valid 24-hour time, positive duration and existing program/coach/location identifiers. Membership labels are supplied display text; never calculate discounts without approved pricing rules.

Affiliates, About, Facilities and Legal have explicit content modules. Legal text is rendered from structured sections only when its `approved` flag is true.

The supplied cover is 851x315 and contains both photography and branding. CSS crops its photographic portion in hero/facility slots without modifying the source. Full-resolution original photos and a larger logo are still required for a polished public release. No reference screenshot is served as a page image.

The original 309,438-byte PNG is preserved. Its 851x315 WebP derivative is 42,324 bytes and is used for displayed gym photographs and gallery content.
