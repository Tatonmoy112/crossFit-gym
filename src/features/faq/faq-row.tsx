import { Plus } from "lucide-react";
import type { FAQ } from "@/schemas/content";

export function FaqRow({
  item,
  index,
  group,
}: {
  item: FAQ;
  index: number;
  group: string;
}) {
  return (
    <details className="faq-row" data-faq-row name={group}>
      <summary className="faq-question">
        <span className="faq-question-text">{item.question}</span>
        <span className="faq-row-marker" aria-hidden="true">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <Plus className="faq-row-icon" size={18} />
        </span>
      </summary>
      <div className="faq-answer" data-faq-answer>
        <p>{item.answer}</p>
      </div>
    </details>
  );
}
