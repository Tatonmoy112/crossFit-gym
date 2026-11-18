# GitHub checks and Vercel client preview

## Font failure and fix

The supplied Ubuntu GitHub Actions log failed at `pnpm test:e2e`: six font/typography cases failed, 357 passed and three were intentionally skipped. The build and earlier quality steps had completed.

Both affected specs called `document.fonts.load()` with the complete computed family stack. Next registers a metrics-adjusted fallback with `src: local("Arial")`; loading the whole stack also requests that face. A machine without that installed font can reject the request even when the primary WOFF2 loads correctly. A controlled browser reproduction made that fallback unavailable: all five WOFF2 responses remained 200 and Chromium rendered Inter, while the old full-stack call rejected with the same NetworkError.

The shared test helper now loads only the primary computed family with its style, weight and size. Empty matches and failed primary loads still fail. Existing rendered-font, weight/metric, license, MIME/origin, delayed-font and blocked-font assertions remain. Two browser regressions reproduce the missing-fallback error and verify that blocking the actual primary WOFF2 still rejects. Production font files and fallback configuration are unchanged.

## Reproducible checks

- Node is pinned to `24.x`; pnpm remains `10.34.9`. `pnpm-lock.yaml` is the only package manager lockfile. Do not regenerate it with npm.
- `pnpm typecheck` runs `next typegen` before TypeScript. `next-env.d.ts` is generated locally, ignored and removed from version control; do not restore mode-specific imports manually.
- GitHub Actions retains the complete quality workflow on Ubuntu and both browser configurations. Browser failures upload `playwright-report/` and `test-results/` for seven days. Traces/screenshots remain available without skipping checks or adding retries.
- Current executed results and limitations are recorded in `docs/qa-checklist.md`.

## GitHub delivery

Local verification (2026-11-18): 357 unit/component tests, type generation/TypeScript, lint, formatting, production build, the 29-HTML export audit and all 367 applicable browser cases pass; three viewport-specific cases are intentionally skipped. All 20 focused font/typography cases pass, including both regressions in both projects. Frozen lockfile consistency passes without changing `pnpm-lock.yaml`.

Remote GitHub verification also succeeded: fix commit `bd7dd07` was pushed after initial connection failures, and the complete Ubuntu [Frontend checks run 44300310580](https://github.com/Tatonmoy112/crossFit-gym/actions/runs/44300310580) passed. The tested fix was promoted into main with a fast-forward. The owner will deploy later through the Vercel platform; no live deployment or client URL is claimed.

The fix was delivered on `fix/ci-font-loading-vercel-preview` and promoted into `main` after its remote Ubuntu workflow passed. For future changes, use the same branch/check/promote sequence; a local Windows pass alone is not evidence that Linux CI completed.

Git uses the existing configured credential manager. GitHub CLI access, if needed separately, requires `gh auth login`. Keep credentials out of the repository. The owner's later Vercel deployment should import the updated `main` branch.

## Vercel settings

Import `Tatonmoy112/crossFit-gym` into the intended Vercel account and use `main` for the stable client-review address. Keep the repository root as the project root. The versioned `vercel.json` specifies:

| Setting       | Value                             |
| ------------- | --------------------------------- |
| Framework     | Next.js                           |
| Node.js       | 24.x, from package engines        |
| Install       | `pnpm install --frozen-lockfile`  |
| Build         | `pnpm build && pnpm check:export` |
| Static output | `out`                             |

Set these project environment variables for deployments before sharing a link:

| Variable                       | Value                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1`, so Vercel honors the pinned pnpm version                                  |
| `NEXT_PUBLIC_SITE_INDEXABLE`   | `false`                                                                        |
| `NEXT_PUBLIC_SITE_URL`         | The exact assigned stable HTTPS `.vercel.app` address, without a trailing path |

If the address is assigned only after the first import/build, set the final URL and redeploy before review. Public metadata is generated at build time; changing an environment variable alone does not update an existing export. Clear conflicting dashboard overrides so the versioned build settings apply. Keep `site.preview=true` and the existing `output: "export"` configuration; no Node server or SPA catch-all rewrite is required.

Configure the client-facing address to open without Vercel authentication, as requested. Vercel may label this stable deployment Production; the site's content mode remains a non-indexed client preview. Do not infer final business/legal approval from that hosting label.

## Hosted acceptance and handoff

Before giving the client the address, verify it in a signed-out browser:

- Home, About, Membership, Contact, Products, a sample product detail and a maintenance page load directly and survive refresh. Missing paths return a real 404.
- Header dropdowns, the mobile drawer, footer links and client-side navigation work. Font and image requests succeed; WOFF2 responses have a font MIME type.
- Canonical URLs use the assigned HTTPS address rather than localhost. Pages remain noindex and `robots.txt` disallows indexing. Preview records and missing business facts remain explicit.
- The actual client-facing address opens without login. Confirm the deployment is Ready and corresponds to the tested main commit.

Handoff includes the verified HTTPS URL, commit SHA, GitHub run result and Vercel deployment status. No live URL or successful remote deployment is claimed until it has been observed. Existing content, legal, custom-domain and full public-launch requirements remain in `docs/content-readiness.json`.

## Official references

- [Next.js type generation](https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options)
- [Vercel build settings and Corepack](https://vercel.com/docs/builds/configure-a-build)
- [Vercel package managers](https://vercel.com/docs/package-managers)
- [Vercel deployment protection](https://vercel.com/docs/deployment-protection)
