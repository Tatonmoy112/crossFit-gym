import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { SectionHeading } from "@/components/shared/section-heading";

it("S03-B01: presents a subsection heading and supplied description without owning page or live semantics", () => {
  const { container } = render(
    <SectionHeading
      title="Section title"
      description="Supplied descriptive text."
    />,
  );
  expect(
    screen.getByRole("heading", { level: 2, name: "Section title" }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("heading")).toHaveLength(1);
  expect(screen.getByText("Supplied descriptive text.").tagName).toBe("P");
  expect(
    container.querySelector(
      "h1, header, main, [role], [aria-live], [tabindex], a, button",
    ),
  ).toBeNull();
  expect(screen.getByRole("heading")).not.toHaveAttribute("id");
});

it.each([undefined, "", "   "])(
  "S03-B01: a title with description %j has no empty paragraph or generated fallback",
  (description) => {
    const { container } = render(
      <SectionHeading title="Title only" description={description} />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Title only" }),
    ).toBeInTheDocument();
    expect(container.querySelector("p")).toBeNull();
    expect(container).toHaveTextContent(/^Title only$/);
  },
);

it("S03-B02: caller IDs label independent sections through their own H2s", () => {
  render(
    <>
      <section aria-labelledby="first-section">
        <SectionHeading headingId="first-section" title="First section" />
      </section>
      <section aria-labelledby="second-section">
        <SectionHeading
          headingId="second-section"
          title="Second section"
          align="center"
        />
      </section>
    </>,
  );
  for (const [title, id] of [
    ["First section", "first-section"],
    ["Second section", "second-section"],
  ]) {
    expect(
      within(screen.getByRole("region", { name: title })).getByRole("heading", {
        level: 2,
        name: title,
      }),
    ).toHaveAttribute("id", id);
  }
});

it("S03-B01: literal markup is escaped in title and description", () => {
  const title = "<img src=x>";
  const description = "<strong>Supplied text</strong> & details";
  const { container } = render(
    <SectionHeading title={title} description={description} />,
  );
  expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
  expect(screen.getByText(description)).toBeInTheDocument();
  expect(container.querySelector("img, strong, script")).toBeNull();
});
