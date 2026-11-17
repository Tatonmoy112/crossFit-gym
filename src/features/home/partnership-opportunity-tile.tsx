import {
  Dumbbell,
  HeartPulse,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { PartnershipOpportunity } from "@/schemas/home-affiliates";

const opportunityIcons: Record<PartnershipOpportunity["id"], LucideIcon> = {
  "fitness-brands": Dumbbell,
  "industry-professionals": UsersRound,
  "wellness-partners": HeartPulse,
};

export function PartnershipOpportunityTile({
  item,
}: {
  item: PartnershipOpportunity;
}) {
  const Icon = opportunityIcons[item.id];
  return (
    <li
      className="partnership-opportunity"
      data-partnership-opportunity={item.id}
      data-surface="light"
    >
      <span className="partnership-opportunity-icon" aria-hidden="true">
        <Icon size={22} />
      </span>
      <h3 className="m-0 text-lg leading-snug font-semibold">{item.title}</h3>
    </li>
  );
}
