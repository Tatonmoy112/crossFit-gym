"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Info } from "lucide-react";
import { inquirySchema, type Inquiry } from "@/schemas/content";
import { useQueryState } from "@/hooks/use-query-state";
import { submitInquiry, type SubmissionResult } from "@/lib/forms/inquiry";
const topics = [
  "Training",
  "Membership",
  "Visiting",
  "Careers",
  "Supplements",
  "Affiliates",
  "Other",
];
export function InquiryForm() {
  const { params } = useQueryState();
  const initialTopic = params.get("topic") || "";
  const interest = params.get("interest") || "";
  return (
    <InquiryFormFields
      key={`${initialTopic}:${interest}`}
      initialTopic={initialTopic}
      interest={interest}
    />
  );
}
function InquiryFormFields({
  initialTopic,
  interest,
}: {
  initialTopic: string;
  interest: string;
}) {
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      topic: topics.includes(initialTopic) ? initialTopic : "",
      interest,
      name: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
    },
  });
  const fields = [
    {
      name: "name",
      label: "Your name",
      type: "text",
      auto: "name",
      placeholder: "Full name",
    },
    {
      name: "email",
      label: "Email address",
      type: "email",
      auto: "email",
      placeholder: "you@example.com",
    },
    {
      name: "phone",
      label: "Phone (optional)",
      type: "tel",
      auto: "tel",
      placeholder: "Your phone number",
    },
  ] as const;
  return (
    <div className="inquiry-form">
      <p className="eyebrow">START A CONVERSATION</p>
      <h2>
        What’s on
        <br />
        your mind?
      </h2>
      <div className="form-disclaimer">
        <Info size={19} />
        <p>
          Online delivery is not connected. You can check your details below,
          but this form will not send or store your inquiry. Please call or
          message the gym directly.
        </p>
      </div>
      <form
        noValidate
        onSubmit={handleSubmit(async (values) =>
          setResult(await submitInquiry(values)),
        )}
      >
        <div className="form-grid">
          {fields.map((field) => (
            <div className="field" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name}
                type={field.type}
                autoComplete={field.auto}
                placeholder={field.placeholder}
                {...register(field.name)}
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name] ? `${field.name}-error` : undefined
                }
              />
              {errors[field.name] && (
                <span className="field-error" id={`${field.name}-error`}>
                  {errors[field.name]?.message}
                </span>
              )}
            </div>
          ))}
          <div className="field">
            <label htmlFor="topic">I’m interested in</label>
            <select
              id="topic"
              {...register("topic")}
              aria-invalid={!!errors.topic}
              aria-describedby={errors.topic ? "topic-error" : undefined}
            >
              <option value="">Choose a topic</option>
              {topics.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
            {errors.topic && (
              <span className="field-error" id="topic-error">
                {errors.topic.message}
              </span>
            )}
          </div>
        </div>
        <label className="field" htmlFor="interest">
          Program, plan or subject (optional)
          <input
            id="interest"
            {...register("interest")}
            placeholder="Tell us what caught your eye"
          />
        </label>
        <div className="field">
          <label htmlFor="message">Your message</label>
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            placeholder="How can the team help?"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <span className="field-error" id="message-error">
              {errors.message.message}
            </span>
          )}
        </div>
        <label className="checkbox-field">
          <input
            type="checkbox"
            {...register("consent")}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span>
            I understand that this preview does not send or store my inquiry.
          </span>
        </label>
        {errors.consent && (
          <span className="field-error" id="consent-error">
            {errors.consent.message}
          </span>
        )}
        <button
          className="button button-dark"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Checking…" : "Check inquiry details"}
          <ArrowUpRight size={17} />
        </button>
        <p className="small-note">
          Nothing is sent when you check your details.
        </p>
        {result && (
          <div role="status" className="form-status">
            {result.message}
          </div>
        )}
      </form>
    </div>
  );
}
