import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it } from "vitest";
import { InquiryForm } from "@/features/contact/inquiry-form";
it("shows accessible validation and honest unconnected delivery", async () => {
  render(<InquiryForm />);
  fireEvent.click(
    screen.getByRole("button", { name: /Check inquiry details/ }),
  );
  expect(
    await screen.findByText("Please enter your name."),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Your name"), {
    target: { value: "Test Person" },
  });
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText("I’m interested in"), {
    target: { value: "Training" },
  });
  fireEvent.change(screen.getByLabelText("Your message"), {
    target: { value: "Please share more information." },
  });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(
    screen.getByRole("button", { name: /Check inquiry details/ }),
  );
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("has not been sent"),
  );
});
