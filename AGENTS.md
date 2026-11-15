# Project instructions

- Preserve the complete 24-template scope documented in `docs/sitemap.md`.
- Use Next.js App Router, strict TypeScript, Server Components by default and static export.
- Use pnpm 10.34.9 and preserve its lockfile. Do not add a second package manager lockfile.
- Treat `info/` as supplied business inputs and `figma/` as visual references. Do not overwrite the originals.
- Never invent programs, coaches, prices, schedules, articles, claims, reviews or business services. Keep missing information explicit.
- Keep structure-preview records separate from real catalog records. Never index preview records.
- Store business content in `src/content`; validate structured content with Zod and validate relationships.
- Keep UI state local or in URL parameters. Do not add Redux, query caches, a backend or a CMS without a concrete requirement.
- Reuse real shared patterns. Keep routes compositional and avoid generic components with unrelated optional props.
- Do not expose secrets or claim a form was delivered without a real successful service response.
- Preserve keyboard focus behavior, visible focus, reduced motion and responsive layouts.
- Run checks relevant to changes. For route, layout or interaction changes run the complete quality workflow in README.
- Update documentation with actual implemented and verified behavior. Report content, integration and visual-review limitations candidly.
- Public launch requires resolving `docs/content-readiness.json`, approved legal text, domain and hosting configuration, and full QA. A successful build alone is not release approval.
