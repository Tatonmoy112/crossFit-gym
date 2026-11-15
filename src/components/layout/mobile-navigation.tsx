import { MobileNavigationMenu } from "@/components/layout/mobile-navigation-menu";
import { navigation } from "@/content/navigation";

function MobileNavigation({ className }: { className?: string }) {
  return <MobileNavigationMenu groups={navigation} className={className} />;
}

export { MobileNavigation };
