import { describe, expect, it } from "vitest";
import { faqs } from "@/content/faqs";
import { homeFaq, homeFaqItems } from "@/content/home-faq";
import { selectFaqs } from "@/lib/content/faqs";
import { faqCollectionSchema, homeFaqSchema } from "@/schemas/home-faq";

describe("homepage FAQ content", () => {
  it("selects the six approved topics in order and preserves existing visiting records", () => {
    expect(homeFaqItems.map((item) => item.id)).toEqual([
      "plans",
      "getting-started",
      "personal-training",
      "product-ordering",
      "gym-visit",
      "choosing-supplements",
    ]);
    expect(faqs).toHaveLength(13);
    expect(
      faqs.filter((item) => ["location", "contact", "hours"].includes(item.id)),
    ).toHaveLength(3);
    expect(faqs.filter((item) => item.id === "plans")).toHaveLength(1);
    expect(homeFaqItems[3].answer).toContain(
      "Online checkout is not currently available.",
    );
    expect(homeFaq.closing.action.href).toBe("/contact/");
  });

  it("rejects duplicate records, duplicate selections and missing relationships", () => {
    expect(() => faqCollectionSchema.parse([...faqs, faqs[0]])).toThrow(
      "Duplicate FAQ ID",
    );
    expect(() => selectFaqs(faqs, ["plans", "plans"])).toThrow(
      "Duplicate homepage FAQ ID",
    );
    expect(() => selectFaqs(faqs, ["missing"])).toThrow("Unknown homepage FAQ");
    expect(() =>
      homeFaqSchema.parse({ ...homeFaq, questionIds: ["plans", "plans"] }),
    ).toThrow();
  });

  it("rejects blank copy, invalid identifiers and unsupported CTA destinations", () => {
    expect(() =>
      faqCollectionSchema.parse([{ ...faqs[0], answer: "  " }]),
    ).toThrow();
    expect(() =>
      faqCollectionSchema.parse([{ ...faqs[0], id: "../invalid" }]),
    ).toThrow();
    expect(() => homeFaqSchema.parse({ ...homeFaq, heading: "  " })).toThrow();
    expect(() =>
      homeFaqSchema.parse({
        ...homeFaq,
        closing: {
          ...homeFaq.closing,
          action: { label: "Contact Us", href: "/faq/" },
        },
      }),
    ).toThrow();
  });
});
