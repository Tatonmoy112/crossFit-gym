# Component inventory

| Responsibility    | Implemented components                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| Global shell      | SiteHeader, Brand, SiteFooter, skip link, PageHero breadcrumbs                                 |
| Design primitives | ButtonLink variants; Radix/shadcn-style Dialog, Trigger, Content, Title, Description, Close    |
| Shared sections   | SectionHeading, PageHero, PendingContent, InquiryCTA, GymPhoto, LocationDetails, PreviewNotice |
| Catalogs          | Catalog discovery shell and reusable ContentCard                                               |
| Detail pages      | DetailPage, VariantSelector, ReadingProgress, ShareLinks                                       |
| Home              | HomePage and data-driven HomeContentSections                                                   |
| FAQ               | FAQExplorer with native disclosure semantics                                                   |
| Gallery           | GalleryExplorer with category filtering, dialog, keyboard arrows and focus restoration         |
| Schedule          | ScheduleExplorer with week filters and class dialog                                            |
| Membership        | MembershipPlans with billing and comparison table                                              |
| Contact           | InquiryForm and keyed field instance                                                           |
| Legal             | LegalPage with explicit unapproved/approved rendering                                          |

The five catalog/detail families share presentation because their content structure and behavior overlap. Their data, routes, terminology and structured sections remain distinct. More specialized variants should be added when actual content establishes a real visual difference.

SiteLink is the shared Next Link wrapper. It disables automatic route prefetching while retaining normal client navigation, keeping initial marketing-page work bounded.

Page-local static composition stays in the corresponding route where extracting another wrapper would add no reuse. This intentionally differs from creating empty feature directories for every page.
