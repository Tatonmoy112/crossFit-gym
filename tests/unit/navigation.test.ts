import { expect, it } from "vitest";
import { navigation } from "@/content/navigation";
import { navigationSchema } from "@/schemas/navigation";

it("L02-A01: retains the four supplied groups and four implemented destinations", () => {
  expect(navigation.map((group) => group.label)).toEqual([
    "About",
    "Training",
    "Explore",
    "Visit us",
  ]);
  expect(navigation.flatMap((group) => group.links)).toHaveLength(4);
  expect(navigationSchema.safeParse(navigation).success).toBe(true);
});

it.each([
  ["empty groups", []],
  [
    "empty group label",
    [{ label: " ", links: [{ label: "About", href: "/about" }] }],
  ],
  ["empty links", [{ label: "About", links: [] }]],
  [
    "empty link label",
    [{ label: "About", links: [{ label: "", href: "/about" }] }],
  ],
  [
    "unsafe destination",
    [
      {
        label: "About",
        links: [{ label: "About", href: "javascript:alert(1)" }],
      },
    ],
  ],
  [
    "unknown route",
    [{ label: "About", links: [{ label: "Unknown", href: "/missing" }] }],
  ],
  [
    "preview route",
    [
      {
        label: "Training",
        links: [{ label: "Preview", href: "/programs/content-preview" }],
      },
    ],
  ],
  ["duplicate group", [navigation[0], navigation[0]]],
  [
    "duplicate destination",
    [
      {
        label: "About",
        links: [navigation[0].links[0], navigation[0].links[0]],
      },
    ],
  ],
])("L02-A01: rejects %s", (_scenario, value) => {
  expect(navigationSchema.safeParse(value).success).toBe(false);
});
