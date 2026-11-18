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

Remote delivery is pending: GitHub CLI is signed out, Git HTTPS cannot connect to github.com:443 even through the approved direct execution path, and no connected browser/Vercel session is available. Linux/WSL is not installed locally. No green remote run, merged commit, live deployment or client URL is claimed.

The fix is prepared on `fix/ci-font-loading-vercel-preview`. Push that branch, inspect the Frontend checks run and merge the tested commit into `main` only after the Ubuntu workflow passes. A local Windows pass and the simulated missing-fallback regression are not evidence that the remote Linux run has completed.

```sh
git push -u origin fix/ci-font-loading-vercel-preview
```

GitHub CLI access requires signing in with `gh auth login`; Git can also use an already configured credential manager. Keep account credentials out of the repository. The exact remote push/check/merge status must be recorded after those operations succeed.

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
