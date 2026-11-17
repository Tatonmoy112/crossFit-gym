import { CircleHelp, FileText, Package } from "lucide-react";
import type { ProductDetailCopy } from "@/content/product-detail-copy";

const icons = [Package, FileText, CircleHelp];
export function ProductAvailabilityInfo({
  items,
}: {
  items: ProductDetailCopy["availability"];
}) {
  return (
    <dl className="product-availability-info">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];
        return (
          <div key={item.label} className="product-availability-row">
            <dt>
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              {item.label}
            </dt>
            <dd>{item.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
