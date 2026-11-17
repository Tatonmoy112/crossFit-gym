import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { ProductShopCopy } from "@/schemas/products";

export function ProductInquiryActions({ copy }: { copy: ProductShopCopy }) {
  return (
    <div className="product-detail-actions">
      <Button
        asChild
        className="rounded-full py-3 text-primary-foreground no-underline hover:bg-primary-hover hover:text-primary-foreground active:bg-primary-active active:text-primary-foreground"
      >
        <NavigationLink href={copy.contact.href}>
          {copy.contact.label}
        </NavigationLink>
      </Button>
      <Button
        asChild
        variant="outline"
        className="rounded-full py-3 no-underline"
      >
        <NavigationLink href={copy.call.href}>{copy.call.label}</NavigationLink>
      </Button>
    </div>
  );
}
