import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentState } from "@/components/shared/content-state";
import ProgramsPage from "@/app/(marketing)/programs/page";
import type { CatalogItem } from "@/schemas/content";

const fixture = vi.hoisted(() => ({ programs: [] as CatalogItem[] }));
vi.mock("@/lib/content/catalogs", () => ({
  catalogs: {
    get programs() {
      return fixture.programs;
    },
  },
}));
afterEach(() => {
  fixture.programs = [];
});

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

describe("S01-B02/B05: Programs integration follows actual record availability", () => {
  const title = "Program information is not available yet";
  it("explains absent approved website inputs without substituting preview records", () => {
    render(<ProgramsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Programs" }),
    ).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 2, name: title });
    expect(
      within(heading.parentElement!).getByText(
        "No approved program details have been supplied for this website.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Page components are awaiting rebuild."),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(
      ["Home", "Back to home"],
    );
    expect(
      within(screen.getByRole("navigation", { name: "Breadcrumb" })).getByRole(
        "link",
        { name: /^Home$/ },
      ),
    ).toHaveAttribute("href", "/");
    expect(
      screen.queryByText(/content-preview|no programs available/i),
    ).not.toBeInTheDocument();
  });

  it("does not falsely report an empty catalog when an approved fixture record exists", () => {
    fixture.programs = [
      {
        slug: "test-only-program",
        title: "Test-only program",
        summary: "Test fixture only",
        category: "Fixture",
        sections: [],
        relatedIds: [],
        programIds: [],
        coachIds: [],
        locationIds: [],
        membershipIds: [],
        variants: [],
        status: "approved",
      },
    ];
    render(<ProgramsPage />);
    expect(
      screen.queryByRole("heading", { name: title }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Page components are awaiting rebuild."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
