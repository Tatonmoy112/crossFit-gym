import { Button } from "@/components/ui/button";
import type { ProductCategory } from "@/schemas/products";
import type { ProductFilters } from "@/lib/products/discovery";

export function ProductCategoryFilter({
  categories,
  selected,
  onChange,
  onClear,
  name,
}: {
  categories: ProductCategory[];
  selected: ProductFilters["category"];
  onChange: (category: ProductFilters["category"]) => void;
  onClear: () => void;
  name: string;
}) {
  return (
    <div className="product-filter-panel">
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-between text-start"
        onClick={onClear}
      >
        Clear all <span aria-hidden="true">×</span>
      </Button>
      <details open className="product-category-details">
        <summary className="touch-target py-3 font-semibold">Category</summary>
        <fieldset className="m-0 grid min-w-0 gap-1 border-0 p-0">
          <legend className="sr-only">Product category</legend>
          {[{ id: "all" as const, label: "All Products" }, ...categories].map(
            (category) => (
              <label key={category.id} className="product-category-option">
                <input
                  type="radio"
                  name={name}
                  value={category.id}
                  checked={selected === category.id}
                  onChange={() => onChange(category.id)}
                />
                <span>{category.label}</span>
              </label>
            ),
          )}
        </fieldset>
      </details>
    </div>
  );
}
