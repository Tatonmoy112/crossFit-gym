import Image from "next/image";
import { brand } from "@/content/brand";
import type { HomeAffiliatesContent } from "@/schemas/home-affiliates";
import { PartnershipOpportunityTile } from "./partnership-opportunity-tile";

export function PartnershipNetwork({
  label,
  opportunities,
}: {
  label: string;
  opportunities: HomeAffiliatesContent["opportunities"];
}) {
  return (
    <figure
      className="partnership-network"
      aria-labelledby="home-affiliates-network-caption"
      data-partnership-network
    >
      <figcaption
        id="home-affiliates-network-caption"
        className="partnership-network-caption"
      >
        {label}
      </figcaption>
      <div className="partnership-network-layout">
        <div className="partnership-hub" data-partnership-hub>
          <div className="partnership-hub-mark" data-surface="light">
            <Image
              src={brand.image.src}
              width={brand.image.width}
              height={brand.image.height}
              alt=""
              loading="lazy"
              decoding="async"
              unoptimized
            />
          </div>
          <p className="m-0 text-center text-base font-semibold">
            {brand.name}
          </p>
        </div>
        <ul
          className="partnership-opportunities"
          aria-labelledby="home-affiliates-network-caption"
        >
          {opportunities.map((item) => (
            <PartnershipOpportunityTile key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </figure>
  );
}
