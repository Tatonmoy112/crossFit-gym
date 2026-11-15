import type { NavigationGroup } from "@/schemas/navigation";

function normalizeNavigationPath(pathname: string | null) {
  return pathname?.split(/[?#]/)[0].replace(/\/+$/, "") || null;
}

function currentNavigationLink(
  groups: readonly NavigationGroup[],
  path: string | null,
) {
  return path
    ? groups
        .flatMap((group) => group.links)
        .filter(
          (link) => path === link.href || path.startsWith(`${link.href}/`),
        )
        .sort((a, b) => b.href.length - a.href.length)[0]
    : undefined;
}

export { normalizeNavigationPath, currentNavigationLink };
