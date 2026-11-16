import { BrandLink } from "@/components/layout/brand-link";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

function Header() {
  return (
    <header data-surface="charcoal">
      <div className="layout-container flex flex-wrap items-center justify-between gap-4 py-4">
        <BrandLink className="min-w-0 max-w-full" />
        <DesktopNavigation className="min-w-0" />
        <MobileNavigation className="ml-auto" />
      </div>
    </header>
  );
}

export { Header };
