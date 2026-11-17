import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { HomeMemberships } from "@/features/home/home-memberships";
import { homeMembershipsPreview } from "@/content/previews/home-memberships";

it("renders disclosed examples, plan inquiry links and the Membership page action before initialization", () => {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(
    <HomeMemberships content={homeMembershipsPreview} />,
  );
  expect(root.querySelector("section")).toHaveAttribute(
    "aria-describedby",
    "home-memberships-notice",
  );
  expect(root.querySelector('[role="note"]')).toHaveTextContent(
    homeMembershipsPreview.notice,
  );
  expect(root.querySelector("h2")).toHaveTextContent(
    homeMembershipsPreview.heading,
  );
  expect(root.querySelectorAll("h3")).toHaveLength(3);
  expect(
    root.querySelectorAll("h1,img,[inert],[data-membership-active]"),
  ).toHaveLength(0);
  expect(root.querySelectorAll("a")).toHaveLength(4);
  expect(root.querySelectorAll("button[hidden]")).toHaveLength(2);
  for (const link of root.querySelectorAll("[data-membership-plan] a"))
    expect(link.getAttribute("href")).toMatch(/^\/contact\/?$/);
  expect(
    [...root.querySelectorAll("a")]
      .find((link) => link.textContent === "View Membership Plans")
      ?.getAttribute("href"),
  ).toMatch(/^\/membership\/?$/);
  homeMembershipsPreview.plans.forEach((plan, index) => {
    const card = root.querySelectorAll("[data-membership-plan]")[index];
    expect(card.querySelector("h3")).toHaveTextContent(plan.name);
    expect(card.querySelectorAll("li")).toHaveLength(4);
    expect(card.querySelector("a")).toHaveTextContent(plan.action.label);
    expect(card.closest('[aria-roledescription="slide"]')).toHaveAttribute(
      "aria-label",
      `${plan.name}, ${index + 1} of 3`,
    );
    expect(card).toHaveTextContent("Price to be confirmed");
  });
  expect(root.textContent).not.toMatch(
    /৳|per month|Most Popular|Explore All Memberships/i,
  );
});
