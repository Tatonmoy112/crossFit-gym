import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement, type ComponentProps } from "react";
import { expect, it, vi } from "vitest";
import { ProductImageGallery } from "@/features/products/product-image-gallery";
import { ProductGallery } from "@/features/products/product-gallery";
import { previewProducts } from "@/content/previews/products";

vi.mock("next/image", () => ({
  default: ({
    unoptimized,
    ...props
  }: ComponentProps<"img"> & { unoptimized?: boolean }) => {
    void unoptimized;
    return createElement("img", { ...props, alt: props.alt ?? "" });
  },
}));
const images = ["home-hero.webp", "cover.webp", "brand-mark.webp"].map(
  (name, index) => ({
    src: `/images/brand/${name}`,
    alt: `Fixture view ${index + 1}`,
    width: 600,
    height: 800,
  }),
);

it("keeps missing photography explicit and renders no fake gallery controls", () => {
  const html = renderToStaticMarkup(
    <ProductGallery
      product={previewProducts[0]}
      pendingLabel="Product photography pending"
    />,
  );
  expect(html).toContain("Product photography pending");
  expect(html).not.toContain("<button");
  expect(html).not.toContain("<img");
});

it("renders every supplied photo without JavaScript and hides enhancement controls", () => {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(
    <ProductImageGallery name="Fixture product" images={images} />,
  );
  expect(root.querySelectorAll("img")).toHaveLength(3);
  expect(root.querySelectorAll("button")).toHaveLength(0);
});

it("supports finite selection, thumbnails, viewport keys, zoom dismissal and focus restoration", async () => {
  render(<ProductImageGallery name="Fixture product" images={images} />);
  const previous = screen.getByRole("button", {
    name: "Previous product image",
  });
  previous.focus();
  fireEvent.click(previous);
  expect(previous).toHaveFocus();
  expect(previous).toHaveAttribute("aria-disabled", "true");
  fireEvent.click(
    screen.getByRole("button", { name: "View image 3 of Fixture product" }),
  );
  expect(
    screen.getByRole("img", { name: "Fixture view 3" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Next product image" }),
  ).toHaveAttribute("aria-disabled", "true");
  fireEvent.keyDown(screen.getByRole("group", { name: "Image 3 of 3" }), {
    key: "ArrowLeft",
  });
  expect(
    screen.getByRole("img", { name: "Fixture view 2" }),
  ).toBeInTheDocument();
  const zoom = screen.getByRole("button", {
    name: "Zoom image of Fixture product",
  });
  fireEvent.click(zoom);
  expect(
    await screen.findByRole("dialog", { name: "Image of Fixture product" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  await waitFor(() => expect(zoom).toHaveFocus());
});
