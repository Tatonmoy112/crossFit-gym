import { navigation } from "@/content/navigation";
import { DesktopNavigationMenu } from "./desktop-navigation-menu";

function DesktopNavigation({ className }: { className?: string }) {
  return <DesktopNavigationMenu groups={navigation} className={className} />;
}

export { DesktopNavigation };
