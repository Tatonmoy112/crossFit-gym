import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { MembershipPage } from "@/features/membership/membership-page";
import { membershipPage, membershipPageFaqs } from "@/content/membership-page";
import { getMembershipPageData } from "@/lib/membership/page-data";
import { metadata } from "@/app/(marketing)/membership/page";

function markup(preview: boolean) {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(
    <MembershipPage
      content={membershipPage}
      data={getMembershipPageData(preview)}
      faqs={membershipPageFaqs}
    />,
  );
  return root;
}

it("server-composes nine sections, native fragments, labeled examples and an accessible comparison", () => {
  const root = markup(true);
  expect(
    [...root.querySelectorAll("[data-membership-section]")].map((node) =>
      node.getAttribute("data-membership-section"),
    ),
  ).toEqual([
    "hero",
    "introduction",
    "pricing",
    "benefits",
    "comparison",
    "joining",
    "faq",
    "cta",
    "information",
  ]);
  expect(root.querySelectorAll("h1")).toHaveLength(1);
  expect(root.querySelector("h1")).toHaveTextContent(
    membershipPage.hero.heading,
  );
  expect(root.querySelectorAll("[data-membership-tier]")).toHaveLength(3);
  expect(root.querySelectorAll("[data-membership-price]")).toHaveLength(3);
  expect(root.querySelector("[role=note]")).toHaveTextContent(
    "Illustrative membership plans",
  );
  expect(root.querySelectorAll("table thead th[scope=col]")).toHaveLength(4);
  expect(root.querySelectorAll("table tbody th[scope=row]")).toHaveLength(10);
  expect(root.querySelector("table caption")).toHaveTextContent(
    "Illustrative membership comparison",
  );
  expect(root.querySelectorAll("details[name=membership-faq]")).toHaveLength(6);
  expect(root.querySelectorAll("details[open]")).toHaveLength(0);
  const fragmentLinks = root.querySelectorAll<HTMLAnchorElement>(
    'a[href*="#membership-"]',
  );
  expect(fragmentLinks).toHaveLength(5);
  for (const link of fragmentLinks)
    expect(
      root.querySelector(`#${link.getAttribute("href")!.split("#")[1]}`),
    ).toHaveAttribute("tabindex", "-1");
  const ids = [...root.querySelectorAll("[id]")].map((node) => node.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(root.querySelector('a[href="tel:+8801323275695"]')).toHaveTextContent(
    "Talk to Our Team",
  );
  expect(root.querySelector("form,input,button,[data-ready]")).toBeNull();
});

it("renders honest empty states and safe guidance without leaking example plans when preview is disabled", () => {
  const root = markup(false);
  expect(root.querySelectorAll("[data-membership-section]")).toHaveLength(8);
  expect(
    root.querySelector("[data-membership-tier],table,[data-preview]"),
  ).toBeNull();
  expect(
    root.querySelector("[data-membership-section=pricing]"),
  ).toHaveTextContent(membershipPage.pricing.empty.title);
  expect(
    root.querySelector("[data-membership-section=comparison]"),
  ).toHaveTextContent(membershipPage.comparison.empty.title);
  expect(root.textContent).not.toMatch(
    /Essential|Performance|Elite|FEATURED EXAMPLE/,
  );
  expect(root.querySelectorAll("details")).toHaveLength(6);
  expect(root.querySelector('a[href^="/contact"]')).not.toBeNull();
});

it("keeps the existing canonical route and preview noindex metadata", () => {
  expect(metadata.title).toBe("Gym Membership Plans & Pricing");
  expect(metadata.alternates?.canonical).toMatch(/\/membership\/$/);
  expect(metadata.robots).toEqual({ index: false, follow: false });
});
