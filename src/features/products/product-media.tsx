import Image from "next/image";
import { Backpack, Dumbbell, FlaskConical, Shirt } from "lucide-react";
import type { Product } from "@/schemas/products";

const icons = {
  "sports-nutrition": FlaskConical,
  "training-equipment": Dumbbell,
  "gym-accessories": Backpack,
  "fitness-apparel": Shirt,
};

export function ProductMedia({
  product,
  pendingLabel,
}: {
  product: Product;
  pendingLabel: string;
}) {
  const image = product.images[0];
  const Icon = icons[product.categoryId];
  return (
    <div className="product-media">
      {image ? (
        <Image
          {...image}
          alt={image.alt}
          unoptimized
          className="size-full object-contain"
        />
      ) : (
        <>
          <Icon
            aria-hidden="true"
            className="product-media-icon"
            strokeWidth={0.75}
          />
          <span className="product-media-note">{pendingLabel}</span>
        </>
      )}
    </div>
  );
}
