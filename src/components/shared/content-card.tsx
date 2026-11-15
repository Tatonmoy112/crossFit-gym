import Image from "next/image";
import { SiteLink as Link } from "@/components/ui/site-link";
import { ArrowUpRight } from "lucide-react";
import type { CatalogItem } from "@/schemas/content";
export function ContentCard({
  item,
  base,
  index = 0,
}: {
  item: CatalogItem;
  base: string;
  index?: number;
}) {
  return (
    <Link
      href={`/${base}/${item.slug}`}
      className={`catalog-card ${base === "blog" ? "article-card" : ""}`}
    >
      <div className="catalog-card-image">
        {item.image ? (
          <Image
            {...item.image}
            alt={item.image.alt}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <span className="catalog-card-number">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <span className="card-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="catalog-card-copy">
        <p className="eyebrow">{item.category}</p>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        {item.author && (
          <small>
            {item.author}
            {item.date &&
              ` · ${new Date(`${item.date}T12:00:00Z`).toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" })}`}
          </small>
        )}
        {item.priceLabel && <strong>{item.priceLabel}</strong>}
      </div>
    </Link>
  );
}
