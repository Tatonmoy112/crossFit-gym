import { expect, it } from "vitest";
import { homeStatsSchema } from "@/schemas/content";
import { homeStats } from "@/content/home";
import { homeStatsPreview } from "@/content/previews/home-stats";
import { formatStat } from "@/features/home/count-up";

// Clearly fictitious fixture values: they verify validation only.
const item = {
  value: 4.9,
  decimals: 1,
  suffix: "★",
  suffixLabel: "out of 5",
  label: "Fixture rating",
  source: "Test fixture",
};
const withItem = (overrides: Record<string, unknown>) => ({
  heading: "Fixture heading",
  items: [{ ...item, ...overrides }],
});

it("H01-C01: real Home statistics stay empty until sourced numbers are supplied", () => {
  expect(homeStats).toEqual({ heading: "Crossfit Gym in numbers", items: [] });
});

it("H01-C01: preview figures stay separate and existing examples remain labeled", () => {
  expect(homeStatsPreview.content.items).not.toBe(homeStats.items);
  expect(homeStatsPreview.content.items).toHaveLength(4);
  expect(
    homeStatsPreview.content.items
      .slice(0, 3)
      .every((entry) => entry.label.startsWith("Example ")),
  ).toBe(true);
  expect(homeStatsPreview.notice).toContain("not verified gym statistics");
  expect(homeStatsSchema.safeParse(homeStatsPreview.content).success).toBe(
    true,
  );
  expect(homeStats.items).toEqual([]);
});

it("H01-C01: includes the owner-requested 30+ Certified Trainers as the fourth counter value", () => {
  expect(homeStatsPreview.content.items[3]).toMatchObject({
    value: 30,
    decimals: 0,
    suffix: "+",
    label: "Certified Trainers",
  });
  expect(homeStatsPreview.content.items[3]?.source).toContain("Owner supplied");
});

it.each([
  ["negative value", { value: -1 }],
  ["NaN value", { value: Number.NaN }],
  ["infinite value", { value: Number.POSITIVE_INFINITY }],
  ["three decimals", { decimals: 3 }],
  ["blank label", { label: "  " }],
  ["blank source", { source: "" }],
  ["missing source", { source: undefined }],
  ["blank suffix label", { suffixLabel: " " }],
])("H01-C01: schema rejects %s", (_name, overrides) => {
  expect(homeStatsSchema.safeParse(withItem(overrides)).success).toBe(false);
});

it("H01-C01: schema rejects more than four items and a blank heading", () => {
  expect(
    homeStatsSchema.safeParse({
      heading: "Fixture heading",
      items: Array.from({ length: 5 }, () => item),
    }).success,
  ).toBe(false);
  expect(homeStatsSchema.safeParse({ heading: " ", items: [] }).success).toBe(
    false,
  );
});

it("H01-C01: schema accepts no items and a sourced decimal fixture", () => {
  expect(
    homeStatsSchema.safeParse({ heading: "Fixture heading", items: [] })
      .success,
  ).toBe(true);
  expect(homeStatsSchema.safeParse(withItem({})).success).toBe(true);
  expect(
    homeStatsSchema.safeParse(withItem({ suffix: "", suffixLabel: undefined }))
      .success,
  ).toBe(true);
});

it.each([
  [10, 0, "10"],
  [4.9, 1, "4.9"],
  [1200, 0, "1,200"],
  [5, 1, "5.0"],
  [0, 0, "0"],
  [2.456, 2, "2.46"],
])("H01-C01: formatStat(%s, %s) is %s", (value, decimals, expected) => {
  expect(formatStat(value, decimals)).toBe(expected);
});
