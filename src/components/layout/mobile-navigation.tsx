import { MobileNavigationMenu } from "@/components/layout/mobile-navigation-menu";
import { navigation } from "@/content/navigation";
import { mobileDrawerContent } from "@/content/mobile-navigation";
import { BrandLink } from "./brand-link";

function MobileNavigation({ className }: { className?: string }) {
  return (
    <MobileNavigationMenu
      groups={navigation}
      content={mobileDrawerContent}
      brand={
        <BrandLink className="mobile-drawer-brand gap-2 p-0 hover:bg-transparent hover:text-primary active:bg-transparent active:text-primary" />
      }
      className={className}
    />
  );
}

export { MobileNavigation };
