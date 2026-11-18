import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { ContactActionContent } from "@/schemas/contact-page";

export function ContactAction({
  action,
  appearance = "primary",
}: {
  action: ContactActionContent;
  appearance?: "primary" | "outline" | "dark";
}) {
  return (
    <Button
      asChild
      variant={appearance === "outline" ? "outline" : "default"}
      className={`contact-action contact-action-${appearance}`}
    >
      <NavigationLink href={action.href}>
        {action.label}
        <ArrowUpRight aria-hidden="true" />
      </NavigationLink>
    </Button>
  );
}
