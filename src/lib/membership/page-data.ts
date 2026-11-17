import { homeMembershipsPreview } from "@/content/previews/home-memberships";
import { membershipPlansPreview } from "@/content/previews/membership-plans";
import {
  membershipPreviewSchema,
  type MembershipPlanPreview,
  type MembershipPreviewContent,
} from "@/schemas/membership-page";

export type MembershipPagePlan = MembershipPlanPreview & { name: string };
export type MembershipPageData = {
  plans: MembershipPagePlan[];
  comparison: MembershipPreviewContent["comparison"];
  benefits: MembershipPreviewContent["benefits"];
};

export function resolveMembershipPreview(
  content: MembershipPreviewContent,
  identities: { id: string; name: string }[],
): MembershipPageData {
  const validated = membershipPreviewSchema.parse(content);
  if (new Set(identities.map((item) => item.id)).size !== identities.length)
    throw new Error("Duplicate membership identity");
  const plans = validated.plans.map((plan) => {
    const identity = identities.find((item) => item.id === plan.id);
    if (!identity)
      throw new Error(`Unknown membership preview identity: ${plan.id}`);
    return { ...plan, name: identity.name };
  });
  return {
    plans,
    comparison: validated.comparison,
    benefits: validated.benefits,
  };
}

const previewData = resolveMembershipPreview(
  membershipPlansPreview,
  homeMembershipsPreview.plans,
);
export function getMembershipPageData(preview: boolean): MembershipPageData {
  return preview ? previewData : { plans: [], comparison: [], benefits: [] };
}
