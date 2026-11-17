import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { HomeProductCategory } from "@/schemas/content";

export function ProductCategoryCard({ item }: { item: HomeProductCategory }) {
  return (
    <Card
      data-product-category={item.id}
      data-surface="charcoal"
      className="product-category-card relative isolate flex min-w-0 flex-1 flex-col justify-end gap-5 overflow-hidden rounded-[1.75rem] border-0 p-6 shadow-none ring-0"
    >
      <div className="grid min-w-0 gap-3">
        <h3 className="m-0 font-heading text-3xl leading-tight">
          {item.title}
        </h3>
        <p className="m-0 text-sm leading-relaxed text-foreground">
          {item.description}
        </p>
      </div>
      <Button
        asChild
        className="product-category-action w-full rounded-full px-4 py-3 text-primary-foreground no-underline hover:bg-primary-hover hover:text-primary-foreground active:bg-primary-active active:text-primary-foreground"
      >
        <NavigationLink href={item.action.href}>
          {item.action.label}
        </NavigationLink>
      </Button>
    </Card>
  );
}
