import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import type { ContactPageContent } from "@/schemas/contact-page";

export function ContactMessagePreview({
  content,
}: {
  content: ContactPageContent["message"];
}) {
  const fields = content.fields;
  return (
    <Card
      className="contact-card contact-form-preview"
      data-surface="light"
      data-contact-message-preview
    >
      <p className="contact-eyebrow">{content.eyebrow}</p>
      <h3 id="contact-message-title">{content.heading}</h3>
      <p id="contact-message-notice" className="contact-preview-notice">
        {content.notice}
      </p>
      <fieldset
        disabled
        className="contact-preview-fieldset"
        aria-describedby="contact-message-notice"
      >
        <legend className="sr-only">{content.heading}</legend>
        <div className="contact-fields">
          <div className="contact-field">
            <label htmlFor="contact-name">{fields.name} *</label>
            <Input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              disabled
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-email">{fields.email} *</label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-phone">{fields.phone}</label>
            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              disabled
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-topic">{fields.topic} *</label>
            <NativeSelect
              id="contact-topic"
              name="topic"
              defaultValue=""
              required
              disabled
            >
              <NativeSelectOption value="">
                {content.topicPlaceholder}
              </NativeSelectOption>
              {content.topics.map((topic) => (
                <NativeSelectOption key={topic.id} value={topic.id}>
                  {topic.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="contact-field contact-field-wide">
            <label htmlFor="contact-subject">{fields.subject}</label>
            <Input id="contact-subject" name="subject" disabled />
          </div>
          <div className="contact-field contact-field-wide">
            <label htmlFor="contact-message">{fields.message} *</label>
            <Textarea id="contact-message" name="message" required disabled />
          </div>
        </div>
        <Button
          type="button"
          disabled
          className="contact-action contact-submit"
        >
          {content.submitLabel}
        </Button>
      </fieldset>
    </Card>
  );
}
