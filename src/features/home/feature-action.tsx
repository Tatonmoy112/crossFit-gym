import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";

export function FeatureAction({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Button
      asChild
      className="feature-action min-w-0 max-w-full flex-wrap justify-between gap-4 rounded-full py-1 pr-1 pl-5 text-primary-foreground no-underline hover:bg-primary-hover hover:text-primary-foreground active:bg-primary-active active:text-primary-foreground"
    >
      <NavigationLink href={href}>
        <span className="min-w-0 flex-1">{label}</span>
        <span
          data-surface="light"
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </NavigationLink>
    </Button>
  );
}
