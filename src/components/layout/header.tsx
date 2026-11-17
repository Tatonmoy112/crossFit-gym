import { BrandLink } from "@/components/layout/brand-link";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { HeaderFrame } from "@/components/layout/header-frame";

function Header() {
  return (
    <HeaderFrame>
      <div className="layout-container flex flex-wrap items-center justify-between gap-4 py-4">
        <BrandLink className="min-w-0 max-w-full" />
        <DesktopNavigation className="min-w-0" />
        <MobileNavigation className="ml-auto" />
      </div>
    </HeaderFrame>
  );
}

export { Header };
