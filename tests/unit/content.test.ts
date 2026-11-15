import { describe, expect, it } from "vitest";
import { catalogSchema, classSchema, inquirySchema } from "@/schemas/content";
import { locations } from "@/content/locations";
import { catalogs, findItem } from "@/lib/content/catalogs";
describe("content contracts", () => {
  it("has one actual Uttara location and no invented catalog records", () => {
    expect(locations.map((item) => item.slug)).toEqual(["uttara"]);
    expect(Object.values(catalogs).flat()).toEqual([]);
  });
  it("isolates previews and rejects unknown records", () => {
    expect(findItem("programs", "content-preview")?.status).toBe("preview");
    expect(findItem("programs", "missing")).toBeUndefined();
  });
  it("rejects invalid slugs, dates and destinations", () => {
    const item = findItem("blog", "content-preview")!;
    expect(
      catalogSchema.safeParse({ ...item, slug: "../escape" }).success,
    ).toBe(false);
    expect(
      catalogSchema.safeParse({ ...item, date: "2026-14-40" }).success,
    ).toBe(false);
    expect(
      catalogSchema.safeParse({ ...item, destination: "javascript:alert(1)" })
        .success,
    ).toBe(false);
  });
  it("rejects invalid class times", () => {
    expect(
      classSchema.safeParse({
        id: "a",
        name: "Test",
        day: "Monday",
        time: "29:70",
        duration: 60,
        programId: "p",
        coachId: "c",
        locationId: "uttara",
        description: "Test fixture",
      }).success,
    ).toBe(false);
  });
  it("validates inquiries without accepting missing consent", () => {
    const inquiry = {
      name: "Test Person",
      email: "test@example.com",
      phone: "",
      topic: "Training",
      message: "Please share information.",
      consent: true,
    };
    expect(inquirySchema.safeParse(inquiry).success).toBe(true);
    expect(
      inquirySchema.safeParse({ ...inquiry, consent: false }).success,
    ).toBe(false);
    expect(inquirySchema.safeParse({ ...inquiry, email: "bad" }).success).toBe(
      false,
    );
  });
});
