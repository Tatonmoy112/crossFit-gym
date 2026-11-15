import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FAQExplorer } from "@/features/faq/faq-explorer";
import { MembershipPlans } from "@/features/membership/membership-plans";
import { Catalog } from "@/components/shared/catalog";
import { catalogSchema } from "@/schemas/content";
import { faqs } from "@/content/faqs";
describe("discovery interactions", () => {
  it("filters FAQs and clears a no-results query", () => {
    render(<FAQExplorer items={faqs} />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "membership" },
    });
    expect(screen.getByText("1 questions")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "zzzz" },
    });
    expect(screen.getByText("No matching questions.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByText("4 questions")).toBeInTheDocument();
  });
  it("filters catalog categories and resets pagination", () => {
    const items = ["Alpha", "Beta"].map((title) =>
      catalogSchema.parse({
        slug: title.toLowerCase(),
        title,
        summary: "Test fixture only",
        category: title,
        status: "approved",
        sections: [],
      }),
    );
    window.history.replaceState(null, "", "/programs?page=2");
    render(<Catalog items={items} base="programs" empty={<p>Empty</p>} />);
    fireEvent.click(screen.getByRole("button", { name: "Beta" }));
    expect(
      screen.queryByRole("heading", { name: "Alpha" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument();
    expect(window.location.search).toBe("?category=Beta");
  });
  it("switches approved membership billing and preserves inquiry context", () => {
    render(
      <MembershipPlans
        plans={[
          {
            id: "test",
            name: "Test fixture",
            description: "For automated tests",
            monthly: "Monthly fixture",
            annual: "Annual fixture",
            features: ["Test benefit"],
            highlighted: false,
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Annual" }));
    expect(screen.getByText("Annual fixture")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Ask about this plan/ }),
    ).toHaveAttribute(
      "href",
      "/contact?topic=Membership&interest=Test%20fixture",
    );
  });
});
