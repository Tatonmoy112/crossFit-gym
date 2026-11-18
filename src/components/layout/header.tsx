import { BrandLink } from "@/components/layout/brand-link";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { HeaderFrame } from "@/components/layout/header-frame";
import { navigationBrandImage } from "@/content/brand";

function Header() {
  return (
    <HeaderFrame>
      <div className="layout-container flex flex-wrap items-center justify-between gap-4 py-4">
        <BrandLink
          image={navigationBrandImage}
          className="min-w-0 max-w-full bg-transparent hover:bg-transparent hover:text-link active:bg-transparent active:text-link"
        />
        <DesktopNavigation className="min-w-0" />
        <MobileNavigation className="ml-auto" />
      </div>
    </HeaderFrame>
  );
}

export { Header };
