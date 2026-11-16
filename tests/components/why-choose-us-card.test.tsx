import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { whyCardFixture } from "../fixtures/why-choose-us.data";

it("H01-D01: one named static card renders supplied H3/body without owning the page heading", async () => {
  const { WhyChooseUsCard } =
    await import("@/features/home/why-choose-us-card");
  const { container } = render(<WhyChooseUsCard item={whyCardFixture} />);
  const card = screen.getByRole("article", { name: "Certified Trainers" });
  expect(within(card).getByRole("heading", { level: 3 })).toHaveTextContent(
    "Certified Trainers",
  );
  expect(within(card).getByText("30+ certified trainers.").tagName).toBe("P");
  expect(
    container.querySelector("h1, h2, a, button, form, [tabindex], [aria-live]"),
  ).toBeNull();
  expect(card.textContent).not.toContain(whyCardFixture.source);
});

it("H01-D01: uses the supplied local image lazily with intrinsic size and a nonempty accurate alt", async () => {
  const { WhyChooseUsCard } =
    await import("@/features/home/why-choose-us-card");
  render(<WhyChooseUsCard item={whyCardFixture} />);
  const image = screen.getByRole("img", { name: whyCardFixture.image.alt });
  expect(image).toHaveAttribute("src", whyCardFixture.image.src);
  expect(image).toHaveAttribute("width", "1672");
  expect(image).toHaveAttribute("height", "941");
  expect(image).toHaveAttribute("loading", "lazy");
  expect(image).toHaveAttribute("data-why-image");
  expect(document.querySelector('img[src*="picsum"]')).toBeNull();
});

it("H01-D01: preserves caller text safely, including long unbroken strings", async () => {
  const { WhyChooseUsCard } =
    await import("@/features/home/why-choose-us-card");
  const title = "<script>specimen</script> & title";
  const description = `<b>Specimen</b> ${"UnbrokenText".repeat(20)}`;
  const { container } = render(
    <WhyChooseUsCard item={{ ...whyCardFixture, title, description }} />,
  );
  expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(title);
  expect(screen.getByText(description)).toBeInTheDocument();
  expect(container.querySelector("script, b")).toBeNull();
});

it("H01-D01: independent card instances keep unique heading IDs and names", async () => {
  const { WhyChooseUsCard } =
    await import("@/features/home/why-choose-us-card");
  render(
    <>
      <WhyChooseUsCard item={whyCardFixture} />
      <WhyChooseUsCard
        item={{
          ...whyCardFixture,
          id: "location-fixture",
          title: "Uttara Location",
          imagePosition: "center",
        }}
      />
    </>,
  );
  const headings = screen.getAllByRole("heading", { level: 3 });
  expect(headings[0].id).toBeTruthy();
  expect(headings[1].id).toBeTruthy();
  expect(headings[0].id).not.toBe(headings[1].id);
  expect(
    screen.getByRole("article", { name: "Uttara Location" }),
  ).toBeInTheDocument();
});

it("H01-D01: server HTML contains full visible copy without requiring JavaScript", async () => {
  const { WhyChooseUsCard } =
    await import("@/features/home/why-choose-us-card");
  const html = renderToStaticMarkup(<WhyChooseUsCard item={whyCardFixture} />);
  expect(html).toContain("Certified Trainers");
  expect(html).toContain("30+ certified trainers.");
  expect(html).not.toContain("Image Scale Effect");
  expect(html).not.toContain("picsum.photos");
});
