import { renderToStaticMarkup } from "react-dom/server";
import Link from "next/link";
import { expect, it, vi } from "vitest";
import RootLayout, { metadata } from "@/app/layout";

vi.mock("@/styles/fonts", () => ({
  inter: { variable: "font-inter-test" },
  barlowCondensed: { variable: "font-heading-test" },
}));
vi.mock("@/styles/globals.css", () => ({}));
vi.mock("@/components/layout/header", () => ({
  Header: () => (
    <header>
      <Link href="/">Home</Link>
    </header>
  ),
}));
vi.mock("@/components/layout/footer", () => ({
  Footer: () => <footer>Footer fixture</footer>,
}));

function documentLayout() {
  return new DOMParser().parseFromString(
    renderToStaticMarkup(
      <RootLayout>
        <section>
          <h1>Page fixture</h1>
        </section>
      </RootLayout>,
    ),
    "text/html",
  );
}

it("removes the Website preview banner from the root layout even while preview mode is enabled", () => {
  const document = documentLayout();
  expect(document.querySelector('[aria-label="Website preview"]')).toBeNull();
  expect(document.body.textContent).not.toContain(
    "This website is being rebuilt.",
  );
});

it("starts main with the supplied page content without a banner wrapper or spacer", () => {
  const document = documentLayout();
  const main = document.querySelector("main")!;
  expect(main.children).toHaveLength(1);
  expect(main.firstElementChild?.tagName).toBe("SECTION");
  expect(main.firstElementChild?.textContent).toBe("Page fixture");
});

it("preserves the skip destination, landmark order, local font roles and noindex metadata", () => {
  const document = documentLayout();
  expect([...document.body.children].map((node) => node.tagName)).toEqual([
    "A",
    "HEADER",
    "MAIN",
    "FOOTER",
  ]);
  expect(document.querySelector(".skip-link")?.getAttribute("href")).toBe(
    "#main",
  );
  expect(document.querySelector("main")?.getAttribute("id")).toBe("main");
  expect(document.querySelector("main")?.getAttribute("tabindex")).toBe("-1");
  expect(document.documentElement.className).toContain("font-inter-test");
  expect(metadata.robots).toEqual({ index: false, follow: false });
});
