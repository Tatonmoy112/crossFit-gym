import { z } from "zod";

const text = z.string().trim().min(1);
export const productDetailCopy = z
  .object({
    previewNotice: text,
    pendingValue: text,
    description: text,
    details: text,
    highlights: text,
    idealFor: text,
    specifications: text,
    delivery: text,
    deliveryNote: text,
    reviews: text,
    reviewsNote: text,
    related: text,
    structureTitle: text,
    structureDescription: text,
    availability: z.array(z.object({ label: text, value: text })).min(1),
  })
  .parse({
    previewNotice:
      "Illustrative product detail preview. This example does not confirm the gym's inventory, manufacturer information, prices or availability.",
    pendingValue: "To be confirmed",
    description: "Description",
    details: "Product details",
    highlights: "Product highlights",
    idealFor: "Ideal for",
    specifications: "Specifications",
    delivery: "Delivery & returns",
    deliveryNote:
      "Delivery, collection and return policies have not been supplied. Contact the gym to confirm before making a purchase.",
    reviews: "Product reviews",
    reviewsNote:
      "Approved product reviews have not been supplied for this website.",
    related: "You may also like",
    structureTitle: "Product details · structure preview",
    structureDescription:
      "Approved product detail content has not been supplied. This neutral structure preview does not represent an actual product.",
    availability: [
      {
        label: "Availability",
        value: "Not confirmed. Call the gym to check current availability.",
      },
      {
        label: "Manufacturer information",
        value: "Verified manufacturer specifications have not been supplied.",
      },
      {
        label: "Delivery & returns",
        value:
          "Contact the gym to confirm the available arrangements and policies.",
      },
    ],
  });
export type ProductDetailCopy = typeof productDetailCopy;
