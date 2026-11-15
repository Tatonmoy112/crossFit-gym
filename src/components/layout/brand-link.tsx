import Image from "next/image";
import { cn } from "cn";
import { NavigationLink } from "@/components/ui/navigation-link";
import { brand } from "@/content/brand";

function BrandLink({ className }: { className?: string }) {
  return (
    <NavigationLink
      href={brand.href}
      className={cn("gap-3 p-2 font-semibold no-underline", className)}
    >
      <Image
        src={brand.image.src}
        width={brand.image.width}
        height={brand.image.height}
        alt=""
        loading="eager"
        decoding="async"
        unoptimized
        className="size-11 shrink-0 rounded-control object-contain"
      />
      <span data-brand-name className="min-w-0">
        {brand.name}
      </span>{" "}
      <span className="sr-only">home</span>
    </NavigationLink>
  );
}

export { BrandLink };
