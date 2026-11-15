import { afterEach, expect, it, vi } from "vitest";

const configuration = vi.hoisted(() => ({ preview: true }));
vi.mock("@/content/site", async () => {
  const actual =
    await vi.importActual<typeof import("@/content/site")>("@/content/site");
  return {
    ...actual,
    site: {
      ...actual.site,
      get preview() {
        return configuration.preview;
      },
    },
  };
});
afterEach(() => {
  configuration.preview = true;
  vi.unstubAllEnvs();
  vi.resetModules();
});

it.each([
  [true, "true", "https://example.invalid", false],
  [true, "false", "https://example.invalid", false],
  [false, "true", "http://example.invalid", false],
  [false, "false", "https://example.invalid", false],
  [false, "true", "https://example.invalid", true],
] as const)(
  "S01-A04: preview=%s, index flag=%s, origin=%s preserves indexing guard",
  async (preview, flag, origin, expected) => {
    configuration.preview = preview;
    vi.stubEnv("NEXT_PUBLIC_SITE_INDEXABLE", flag);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", origin);
    vi.resetModules();
    const { indexable } = await import("@/config/site");
    const { metadata } = await import("@/lib/seo");
    const robots = (await import("@/app/robots")).default();
    const sitemap = (await import("@/app/sitemap")).default();
    expect(indexable).toBe(expected);
    expect(
      metadata("Test page", "Fixture description", "/about").robots,
    ).toEqual({ index: expected, follow: expected });
    expect(
      metadata(
        "Structural fixture",
        "Fixture description",
        "/programs/content-preview",
        true,
      ).robots,
    ).toEqual({ index: false, follow: false });
    expect(robots.rules).toMatchObject(
      expected ? { allow: "/" } : { disallow: "/" },
    );
    expect(sitemap.some((entry) => entry.url.includes("content-preview"))).toBe(
      false,
    );
    if (!expected) expect(sitemap).toEqual([]);
    else expect(sitemap.length).toBeGreaterThan(0);
  },
);
