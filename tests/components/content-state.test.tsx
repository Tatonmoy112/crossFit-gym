import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentState } from "@/components/shared/content-state";
describe("S01-B01: static shared content-state contract", () => {
  it.each([
    ["Missing information", "Approved details have not been supplied."],
    [
      "Empty collection",
      "No approved records have been supplied for this website.",
    ],
    ["Unavailable content", "This content is unavailable on this website."],
  ])(
    "presents %s with a semantic subsection and explanatory text",
    (title, description) => {
      const { container } = render(
        <ContentState title={title} description={description} />,
      );
      expect(
        screen.getByRole("heading", { level: 2, name: title }),
      ).toBeInTheDocument();
      expect(screen.getByText(description).tagName).toBe("P");
      expect(
        screen.queryByRole("heading", { level: 1 }),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector(
          "[role], [aria-live], [tabindex], a, button, input",
        ),
      ).toBeNull();
    },
  );

  it("treats both fields as plain text rather than injected markup", () => {
    const title = '<img src=x onerror="alert(1)">';
    const description = "<strong>Unavailable</strong> & pending";
    const { container } = render(
      <ContentState title={title} description={description} />,
    );
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(container.querySelector("img, strong, script")).toBeNull();
  });
});

it("forwards headingId to its H2 and stays unchanged without it", () => {
  const { rerender } = render(
    <ContentState
      title="Fixture title"
      description="Fixture description."
      headingId="fixture-id"
    />,
  );
  expect(
    screen.getByRole("heading", { level: 2, name: "Fixture title" }),
  ).toHaveAttribute("id", "fixture-id");
  rerender(
    <ContentState title="Fixture title" description="Fixture description." />,
  );
  expect(
    screen.getByRole("heading", { level: 2, name: "Fixture title" }),
  ).not.toHaveAttribute("id");
});
