"use client";
import { ChevronDown, Search } from "lucide-react";
import { useQueryState } from "@/hooks/use-query-state";
import type { FAQ } from "@/schemas/content";
export function FAQExplorer({ items }: { items: FAQ[] }) {
  const { params, update } = useQueryState();
  const query = params.get("q") || "";
  const category = params.get("category") || "All";
  const filtered = items.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.question} ${item.answer}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div>
      <div className="catalog-toolbar">
        <label className="search-field">
          <Search size={18} />
          <span className="sr-only">Search questions</span>
          <input
            type="search"
            value={query}
            placeholder="What would you like to know?"
            onChange={(e) => update({ q: e.target.value })}
          />
        </label>
        <p className="result-count" aria-live="polite">
          {filtered.length} questions
        </p>
      </div>
      <div className="filter-pills">
        {["All", ...new Set(items.map((item) => item.category))].map(
          (value) => (
            <button
              aria-pressed={value === category}
              className={value === category ? "selected" : ""}
              key={value}
              onClick={() => update({ category: value })}
            >
              {value}
            </button>
          ),
        )}
      </div>
      <div className="faq-list">
        {filtered.map((item, i) => (
          <details key={item.id}>
            <summary>
              <span className="row-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.question}
              <ChevronDown size={20} />
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="no-results">
          <h3>No matching questions.</h3>
          <button
            className="button button-dark"
            onClick={() => update({ q: "", category: "" })}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
