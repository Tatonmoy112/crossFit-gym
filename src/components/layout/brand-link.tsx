import Image from "next/image";
import { cn } from "cn";
import { NavigationLink } from "@/components/ui/navigation-link";
import { brand } from "@/content/brand";
import type { ImageAsset } from "@/schemas/content";

function BrandLink({
  className,
  image = brand.image,
}: {
  className?: string;
  image?: ImageAsset;
}) {
  return (
    <NavigationLink
      href={brand.href}
      className={cn("gap-3 p-2 font-semibold no-underline", className)}
    >
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt=""
        loading="eager"
        decoding="async"
        unoptimized
        className={cn(
          "size-11 shrink-0 object-contain",
          image.src === brand.image.src && "rounded-control",
        )}
      />
      <span data-brand-name className="min-w-0">
        {brand.name}
      </span>{" "}
      <span className="sr-only">home</span>
    </NavigationLink>
  );
}

export { BrandLink };
