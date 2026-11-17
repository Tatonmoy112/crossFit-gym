import { expect, it } from "vitest";
import { homeSuccessStoriesPreview as content } from "@/content/previews/home-success-stories";
import { testimonials } from "@/content/testimonials";
import { homeSuccessStoriesPreviewSchema as schema } from "@/schemas/content";

it("keeps supplied fictional stories separate from approved testimonials", () => {
  expect(testimonials).toEqual([]);
  expect(content.status).toBe("preview");
  expect(content.heading).toBe("Real People. Real Progress. Real Inspiration.");
  expect(content.stories.map(({ name, focus }) => [name, focus])).toEqual([
    ["Arif Rahman", "Strength & Confidence"],
    ["Nadia Ahmed", "Fitness & Consistency"],
    ["Tanvir Hasan", "Endurance & Lifestyle"],
  ]);
  expect(content.stories.map(({ quote }) => quote)).toEqual([
    "I started with very little experience. Over time, I found a routine that helped me grow stronger and feel more confident in every workout.",
    "Finding the motivation to stay active wasn't always easy. Having a routine I genuinely enjoy has made fitness a meaningful part of my life.",
    "My goal was to become more active and improve my stamina. With regular training, I've learned to enjoy the process instead of chasing quick results.",
  ]);
  expect(content.stories.every((story) => !story.image)).toBe(true);
  expect(content.action).toEqual({
    label: "Start your journey",
    href: "/contact/",
  });
  expect(content.closing.action.href).toBe("/contact/");
});

it.each([
  [
    "approved status",
    (c: typeof content) => Object.assign(c, { status: "approved" }),
  ],
  ["duplicate ID", (c: typeof content) => (c.stories[1].id = c.stories[0].id)],
  ["blank quote", (c: typeof content) => (c.stories[0].quote = " ")],
  ["blank name", (c: typeof content) => (c.stories[0].name = " ")],
  ["blank focus", (c: typeof content) => (c.stories[0].focus = " ")],
  ["missing story", (c: typeof content) => c.stories.pop()],
  ["blank disclosure", (c: typeof content) => (c.notice = " ")],
  [
    "nonexistent route",
    (c: typeof content) => (c.action.href = "/success-stories/"),
  ],
  [
    "external closing action",
    (c: typeof content) => (c.closing.action.href = "https://example.com/"),
  ],
  [
    "remote image",
    (c: typeof content) =>
      (c.stories[0].image = {
        src: "https://example.com/photo.jpg",
        alt: "Photo",
        width: 600,
        height: 800,
      }),
  ],
])("rejects %s", (_name, mutate) => {
  const copy = structuredClone(content);
  mutate(copy);
  expect(schema.safeParse(copy).success).toBe(false);
});

it("accepts future local image metadata", () => {
  const copy = structuredClone(content);
  copy.stories[0].image = {
    src: "/images/stories/approved.webp",
    alt: "Approved member portrait",
    width: 600,
    height: 800,
  };
  expect(schema.safeParse(copy).success).toBe(true);
});
