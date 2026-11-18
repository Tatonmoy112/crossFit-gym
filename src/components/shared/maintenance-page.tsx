import { WrenchIcon } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import {
  maintenanceCopy,
  type MaintenancePageContent,
} from "@/content/maintenance";

export function MaintenancePage({
  content,
}: {
  content: MaintenancePageContent;
}) {
  return (
    <Container className="maintenance-page">
      <div className="max-w-xl">
        <div className="maintenance-symbol" aria-hidden="true">
          <WrenchIcon className="size-7" />
        </div>
        <p className="type-control-strong mb-3 text-muted-foreground">
          {maintenanceCopy.status}
        </p>
        <h1 className="type-display mb-5">{content.title}</h1>
        <p className="text-muted-foreground">{maintenanceCopy.description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <NavigationLink href="/">{maintenanceCopy.home}</NavigationLink>
          </Button>
          <Button asChild variant="outline">
            <NavigationLink href="/contact/">
              {maintenanceCopy.contact}
            </NavigationLink>
          </Button>
        </div>
      </div>
    </Container>
  );
}
