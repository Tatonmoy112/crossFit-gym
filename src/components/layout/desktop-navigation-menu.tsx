"use client";

import { DropdownNavigation } from "./dropdown-navigation";
import type { NavigationGroup } from "@/schemas/navigation";

function DesktopNavigationMenu(props: {
  groups: readonly NavigationGroup[];
  className?: string;
}) {
  return <DropdownNavigation {...props} />;
}

export { DesktopNavigationMenu };
