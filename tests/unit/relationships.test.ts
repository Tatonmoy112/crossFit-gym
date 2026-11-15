import { expect, it } from "vitest";
import { validateContentRelationships } from "@/lib/content/validate";
import { previewItem } from "@/lib/content/catalogs";
it("rejects duplicate slugs and broken content associations", () => {
  const record = previewItem("programs");
  expect(() =>
    validateContentRelationships({ programs: [record, record] }, [], []),
  ).toThrow("Duplicate");
  expect(() =>
    validateContentRelationships(
      { programs: [{ ...record, coachIds: ["missing"] }] },
      [],
      [],
    ),
  ).toThrow("Unknown coachIds");
});
