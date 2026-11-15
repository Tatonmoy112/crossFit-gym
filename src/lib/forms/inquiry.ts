import type { Inquiry } from "@/schemas/content";
export type SubmissionResult = {
  status: "unavailable" | "success" | "error";
  message: string;
};
export type InquiryTransport = (inquiry: Inquiry) => Promise<boolean>;
export async function submitInquiry(
  inquiry: Inquiry,
  transport?: InquiryTransport,
): Promise<SubmissionResult> {
  if (!transport)
    return {
      status: "unavailable",
      message:
        "Your details have been checked, but your inquiry has not been sent. Online delivery is not connected. Please call the gym or use its social links.",
    };
  try {
    const accepted = await transport(inquiry);
    return accepted
      ? {
          status: "success",
          message: "The delivery service accepted your inquiry.",
        }
      : {
          status: "error",
          message:
            "Your inquiry could not be delivered. Please try again or call the gym.",
        };
  } catch {
    return {
      status: "error",
      message:
        "The delivery service is unavailable. Please try again or call the gym.",
    };
  }
}
