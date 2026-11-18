import { MaintenancePage } from "@/components/shared/maintenance-page";
import { maintenanceCopy, maintenancePage } from "@/content/maintenance";
import { metadata as makeMetadata } from "@/lib/seo";

const content = maintenancePage("/affiliates");
export const metadata = makeMetadata(
  `${content.title} — ${maintenanceCopy.status}`,
  maintenanceCopy.description,
  content.path,
  true,
);

export default function Page() {
  return <MaintenancePage content={content} />;
}
