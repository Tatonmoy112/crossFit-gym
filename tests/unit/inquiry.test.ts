import { expect, it, vi } from "vitest";
import { submitInquiry } from "@/lib/forms/inquiry";
const inquiry = {
  name: "Test Person",
  email: "test@example.com",
  phone: "",
  topic: "Training",
  message: "Please share information.",
  consent: true,
};
it("never reports delivery when no service is connected", async () => {
  expect((await submitInquiry(inquiry)).status).toBe("unavailable");
});
it("reports confirmed provider acceptance", async () => {
  const transport = vi.fn(async () => true);
  expect((await submitInquiry(inquiry, transport)).status).toBe("success");
  expect(transport).toHaveBeenCalledWith(inquiry);
});
it("handles rejection and network failure", async () => {
  expect((await submitInquiry(inquiry, async () => false)).status).toBe(
    "error",
  );
  expect(
    (
      await submitInquiry(inquiry, async () => {
        throw new Error("offline");
      })
    ).status,
  ).toBe("error");
});
