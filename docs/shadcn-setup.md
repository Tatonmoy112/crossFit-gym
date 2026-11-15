# shadcn/ui foundation

Installed on 2026-11-15 at the owner's request using pnpm 10.34.9. The latest official CLI resolved to shadcn 4.23.0; that CLI version is recorded in package.json and pnpm-lock.yaml.

## Installed scope

The official add --all command installed 63 UI modules plus two hooks and the highlighter helper. Initialization also created components.json, the cn helper and Tailwind 4 theme variables. [component-inventory.md](component-inventory.md) lists every installed module and support file.

Configuration: Radix Nova style, neutral base color, Lucide icons, CSS variables, RSC, TSX and @/ aliases rooted in src/. Components are local editable source in src/components/ui/. Required registry dependencies were installed through pnpm; pnpm-lock.yaml was updated in place. No new root package-manager lockfile was created. The pre-existing untracked package-lock.json was left unchanged.

Commands used after resolving the latest CLI:

```powershell
pnpm dlx shadcn@4.23.0 init --preset nova --base radix --yes --no-monorepo --no-rtl
pnpm exec shadcn add --all --yes
```

During setup, dependency installation was also run directly with pnpm for visible progress, and initialization was completed using --force --no-reinstall after components.json existed. The add --all command completed successfully and created 66 files; initialization separately created src/lib/utils.ts.

Official references: [CLI](https://ui.shadcn.com/docs/cli), [Next.js setup](https://ui.shadcn.com/docs/installation/next).

## How to use the library

Import individual modules from `@/components/ui/<name>`. Keep routes and static sections as Server Components by default, with client boundaries for interactive compositions. The root header consumes adapted Button, Collapsible and Dialog composition boundaries with NavigationLink; other stock modules await their relevant tasks. About's recovery link also consumes NavigationLink.

```tsx
import { Button } from "@/components/ui/button";

export function ExampleAction() {
  return <Button type="button">Action label</Button>;
}
```

This example documents usage; it is not a new page or business feature. Use [U01-B NavigationLink](specs/U01-B-navigation-link.md) for standalone navigation controls with an approved destination. It supplies native anchor semantics and current-page styling, safe/announced explicit new tabs and foundation states. Missing targets must be omitted or described as noninteractive missing content by their consumer. Inline prose and button-shaped CTAs are separate; Button's asChild interface is retained, but slotted anchor states still need review within the actual CTA task. Use supplied business content and the existing Zod/relationship contracts when building real sections.

Add TooltipProvider around a subtree when integrating tooltips, including sidebar tooltip consumers. Mount Toaster once when implementing actual notifications. A theme provider is needed only when implementing a theme-switching feature; light/dark CSS variables alone do not enable a user preference control. Other compound components expose their own providers/context boundaries. No provider tree or notification UI has been mounted in the page shells.

## Theme and local adjustments

The registry retains its neutral preset in components.json, while [F01-B semantic colors](specs/F01-B-semantic-colors.md) supplies the active yellow/charcoal surface/state palette in colors.css. Global focus protection is deliberately unlayered so component outline-none utilities cannot erase it. Other stock component-specific alpha/disabled/selected variants still require adaptation before use; native Button states are adapted in U01-A. The initializer's remote-font changes were removed; [F01-A](specs/F01-A-local-fonts.md) subsequently integrated local Inter/Barlow Condensed into the font roles. [F01-C typography](specs/F01-C-typography.md) now supplies body/H1/H2/H3 defaults and optional display/control/hint/measure classes; builds do not download fonts. Actual component typography still needs its own adaptation. The stale favicon metadata entry was removed after `logo.jpg` was deleted separately during setup; favicon/social-preview configuration remains pending. L01-A selects a clean supplied logo derivative for BrandLink only. [F01-D layout/motion](specs/F01-D-layout-motion.md) replaces global main constraints with explicit section containers, exposes radius/touch/motion roles and strengthens reduced-motion delay protection. Stock component radii, target sizes and animations still require their own adaptation; generic radius multipliers remain unchanged.

[U01-A Button](specs/U01-A-button.md) replaces stock palette/size/motion classes with foundation roles and uses a safe native type default. Preserve this change when updating registry source. Its existing variants/sizes and slot API remain; slotted anchor states and composed stock consumers still need their own layout/interaction review. NavigationLink is an additional local module, not a newly downloaded registry component; it reuses installed dependencies and foundation roles without changing package declarations or lockfiles.

The generated use-mobile hook and carousel subscription were adapted to useSyncExternalStore to meet the project's React lint rules and provide stable hydration/cleanup behavior. Keep these changes when updating the registry source; inspect CLI diffs before overwriting local modules. Relevant regression tests are in tests/components/shadcn-adapters.test.tsx.

## Desktop disclosure composition

[L02-A desktop navigation](specs/L02-A-desktop-navigation.md) reuses installed Collapsible/Trigger/Content with adapted Button and NavigationLink in native navigation/lists. Its initial NavigationMenu composition exposed an aria-hidden focus proxy during browser review; the final composition passes the unchanged accessibility scan and direct Tab/Shift+Tab checks. Stock NavigationMenu source remains unmodified and unreviewed for future integration. No package or provider was added. L01-B mounts this composition in the real root header.

## Next iteration

[L01-A BrandLink](specs/L01-A-brand-link.md) is a local composition of NavigationLink and Next Image, separate from the registry module count. L01-B mounts it in the real header; do not run the registry CLI to replace it. [L02-B mobile navigation](specs/L02-B-mobile-navigation.md) composes installed Dialog root/trigger/portal/close and Radix modal content with the adapted controls, explicitly scoped light portal tokens and responsive local state. Stock Dialog/Sheet decorations remain unmodified and unreviewed. L01-B verifies these compositions in the actual App Router shell. L03-A reuses BrandLink and the adapted NavigationLink in the real server-rendered footer, without downloading another component or adding a provider. S01-A composes installed Alert/Title/Description for the preview notice, overriding only this instance to a static note with explicit yellow/dark tokens and body typography; stock Alert source/other variants remain unmodified and unreviewed. S01-B composes only installed Empty/Header with a semantic H2 and paragraph for static content states, using the verified radius/type/surface roles. Stock Empty title/description decorations remain unmodified and unreviewed. Programs is the first consumer; no component download, provider or dependency was needed. S03-A adds a local Container wrapper around the verified layout-container CSS, using installed cn and React 19 native div props/ref. It does not download a registry component or change stock modules/tokens. Programs is its first consumer. S03-B adds a local SectionHeading composition with the existing cn utility and verified type/surface roles; ContentState now reuses it inside installed Empty. Stock Empty/Header source remains unchanged; no download or provider is needed. Next task: S02-A breadcrumbs only, with a focused specification and tests first.

Use [component-rebuild-plan.md](component-rebuild-plan.md). Review the design foundations, adapt a selected primitive if needed, then compose one gym-specific component and add it to its intended pages. Update the inventory and run the required checks after each integration. All 24 page templates remain in scope. No business records, services, demo content or new application routes were introduced by this install.

See [qa-checklist.md](qa-checklist.md) for executed verification. Compilation and shell accessibility checks do not establish visual approval or validate every unmounted component state.
