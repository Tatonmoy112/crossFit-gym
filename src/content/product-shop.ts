import { productShopCopySchema } from "@/schemas/products";
import { site } from "./site";

export const productShopCopy = productShopCopySchema.parse({
  eyebrow: "THE GYM SHOP",
  heading: "Your Goals. Your Gear. Your Journey.",
  introduction:
    "Explore our collection of fitness supplements, training equipment, and gym accessories. Whether you're taking your first step or building on years of training, find the essentials that fit your routine.",
  catalogHeading: "Shop All Products",
  previewNotice:
    "Product listing preview. These are illustrative products; availability, prices and options are not confirmed.",
  pendingPrice: "Price to be confirmed",
  pendingPhotography: "Product photography pending",
  pendingOptions: "Options to be confirmed",
  emptyTitle: "Product information is not available yet",
  emptyDescription:
    "Approved product records have not been supplied for this website. Contact the gym to ask about current availability.",
  noMatchTitle: "No matching products",
  noMatchDescription:
    "No examples match your selection. Try another category or clear your filters. This preview does not confirm the gym's inventory.",
  contact: { label: "Ask about this product", href: "/contact/" },
  call: { label: "Call the gym", href: `tel:${site.telephone}` },
});
