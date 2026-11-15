"use client";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { ContentCard } from "./content-card";
import { useQueryState } from "@/hooks/use-query-state";
import type { CatalogItem } from "@/schemas/content";
export function filterCatalog(
  items: CatalogItem[],
  query: string,
  category: string,
) {
  const text = query.trim().toLocaleLowerCase();
  return items.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.title} ${item.summary} ${item.category}`
        .toLocaleLowerCase()
        .includes(text),
  );
}
export function Catalog({
  items,
  base,
  empty,
}: {
  items: CatalogItem[];
  base: string;
  empty: React.ReactNode;
}) {
  const { params, update } = useQueryState();
  const query = params.get("q") || "";
  const category = params.get("category") || "All";
  const categories = ["All", ...new Set(items.map((item) => item.category))];
  const filtered = filterCatalog(items, query, category);
  const total = Math.ceil(filtered.length / 9);
  const page = Math.min(
    Math.max(1, Number(params.get("page")) || 1),
    Math.max(1, total),
  );
  return (
    <div>
      <div className="catalog-toolbar">
        <label className="search-field">
          <Search size={18} />
          <span className="sr-only">Search {base}</span>
          <input
            type="search"
            placeholder={`Search ${base === "blog" ? "stories" : base}…`}
            value={query}
            onChange={(e) => update({ q: e.target.value, page: "" })}
          />
        </label>
        <span className="result-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </span>
      </div>
      {categories.length > 1 && (
        <div className="filter-pills" aria-label="Filter by category">
          {categories.map((value) => (
            <button
              className={category === value ? "selected" : ""}
              key={value}
              onClick={() => update({ category: value, page: "" })}
              aria-pressed={category === value}
            >
              {value}
            </button>
          ))}
        </div>
      )}
      {items.length === 0 ? (
        empty
      ) : filtered.length === 0 ? (
        <div className="no-results">
          <h3>No matches this time.</h3>
          <p>Try another search or clear the filters.</p>
          <button
            className="button button-dark"
            onClick={() => update({ q: "", category: "", page: "" })}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="catalog-grid">
            {filtered.slice((page - 1) * 9, page * 9).map((item, i) => (
              <ContentCard
                key={item.slug}
                item={item}
                base={base}
                index={(page - 1) * 9 + i}
              />
            ))}
          </div>
          {total > 1 && (
            <nav className="pagination" aria-label="Results pages">
              <button
                disabled={page === 1}
                onClick={() => update({ page: String(page - 1) })}
                aria-label="Previous page"
              >
                <ArrowLeft size={17} />
              </button>
              {Array.from({ length: total }, (_, i) => i + 1).map((value) => (
                <button
                  key={value}
                  aria-current={value === page ? "page" : undefined}
                  onClick={() => update({ page: String(value) })}
                >
                  {String(value).padStart(2, "0")}
                </button>
              ))}
              <button
                disabled={page === total}
                onClick={() => update({ page: String(page + 1) })}
                aria-label="Next page"
              >
                <ArrowRight size={17} />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
