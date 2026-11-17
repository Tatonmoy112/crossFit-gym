"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ZoomIn } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationLink } from "@/components/ui/navigation-link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  filterProducts,
  productFiltersHref,
  readProductFilters,
  type ProductFilters,
} from "@/lib/products/discovery";
import type {
  Product,
  ProductCategory,
  ProductShopCopy,
} from "@/schemas/products";
import type { ProductCategoryId } from "@/config/products";
import { ProductCard } from "./product-card";
import { ProductCategoryFilter } from "./product-category-filter";
import { ProductQuickView } from "./product-quick-view";

export function ProductCatalog({
  products,
  categories,
  copy,
  initialCategory,
  introduction,
}: {
  products: Product[];
  categories: ProductCategory[];
  copy: ProductShopCopy;
  initialCategory: ProductCategoryId | "all";
  introduction: ReactNode;
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const urlFilters = readProductFilters(
    params,
    pathname.replace(/\/$/, "") === "/supplements" ? initialCategory : "all",
  );
  const urlKey = JSON.stringify(urlFilters);
  const [discovery, setDiscovery] = useState({ urlKey, filters: urlFilters });
  // Keep native controls responsive while Next commits a History transition.
  // A committed URL (including Back/Forward) always replaces this local draft.
  if (discovery.urlKey !== urlKey)
    setDiscovery({ urlKey, filters: urlFilters });
  const filters = discovery.urlKey === urlKey ? discovery.filters : urlFilters;
  const filterKey = JSON.stringify(filters);
  const matches = filterProducts(products, filters);
  const [pagination, setPagination] = useState({ key: filterKey, limit: 9 });
  const limit = pagination.key === filterKey ? pagination.limit : 9;
  const shown = matches.slice(0, limit);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<{ product: Product | null; open: boolean }>({
    product: null,
    open: false,
  });
  const intentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressed = useRef<string | null>(null);
  const returnFocus = useRef<HTMLButtonElement>(null);
  const quickButtons = useRef(new Map<string, HTMLButtonElement>());
  const filterButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const addedProductFocus = useRef<{ id: string; key: string } | null>(null);

  useEffect(() => {
    const pending = addedProductFocus.current;
    if (!pending) return;
    if (pending.key === filterKey)
      quickButtons.current.get(pending.id)?.focus();
    addedProductFocus.current = null;
  }, [pagination, filterKey]);

  const cancelIntent = useCallback(() => {
    if (intentTimer.current !== null) clearTimeout(intentTimer.current);
    intentTimer.current = null;
  }, []);

  useEffect(() => {
    // A modal can consume the card's pointer-leave event. A real pointer exit
    // must still release dismissal suppression before the next card entry.
    const releaseSuppression = (event: PointerEvent) => {
      const id = suppressed.current;
      if (!id || event.pointerType !== "mouse") return;
      const card = document.querySelector(`[data-product-card="${id}"]`);
      const bounds = card?.getBoundingClientRect();
      if (
        !bounds ||
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        suppressed.current = null;
    };
    const pop = () => {
      cancelIntent();
      setView((current) => ({ ...current, open: false }));
    };
    window.addEventListener("scroll", cancelIntent, true);
    window.addEventListener("pointermove", releaseSuppression);
    window.addEventListener("popstate", pop);
    return () => {
      cancelIntent();
      window.removeEventListener("scroll", cancelIntent, true);
      window.removeEventListener("pointermove", releaseSuppression);
      window.removeEventListener("popstate", pop);
    };
  }, [cancelIntent]);

  useEffect(() => {
    // A new discovery URL invalidates any pending pointer intent.
    return cancelIntent;
  }, [filterKey, cancelIntent]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)");
    const resize = () => {
      if (media.matches) setFiltersOpen(false);
    };
    media.addEventListener("change", resize);
    return () => media.removeEventListener("change", resize);
  }, []);

  const updateFilters = (next: ProductFilters) => {
    cancelIntent();
    setDiscovery({ urlKey, filters: next });
    setView((current) => ({ ...current, open: false }));
    const href = productFiltersHref(next);
    if (`${window.location.pathname}${window.location.search}` !== href)
      window.history.pushState(null, "", href);
    setPagination({ key: JSON.stringify(next), limit: 9 });
  };
  const clear = () =>
    updateFilters({ q: "", category: "all", sort: "featured" });
  const chooseCategory = (category: ProductFilters["category"]) =>
    updateFilters({ ...filters, category });
  const openProduct = (product: Product) => {
    cancelIntent();
    if (filtersOpen || view.open) return;
    returnFocus.current = quickButtons.current.get(product.id) ?? null;
    setView({ product, open: true });
  };
  const closeProduct = () => {
    cancelIntent();
    suppressed.current = view.product?.id ?? null;
    setView((current) => ({ ...current, open: false }));
  };

  return (
    <div data-product-catalog data-ready="true">
      <div data-surface="charcoal" className="product-sort-bar">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <p className="m-0 text-sm">Featured &amp; Everyday Essentials</p>
          <label className="flex min-w-0 flex-wrap items-center gap-3 text-sm">
            Sort by
            <select
              aria-label="Sort products"
              className="product-sort-select touch-target"
              value={filters.sort}
              onChange={(event) =>
                updateFilters({
                  ...filters,
                  sort: event.target.value as ProductFilters["sort"],
                })
              }
            >
              <option value="featured">Featured</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>
          </label>
        </Container>
      </div>
      {introduction}
      <Container className="pb-12 md:pb-16">
        <form
          key={filters.q}
          role="search"
          aria-label="Search products"
          className="product-search"
          onSubmit={(event) => {
            event.preventDefault();
            const q = String(
              new FormData(event.currentTarget).get("q") ?? "",
            ).trim();
            updateFilters({ ...filters, q });
          }}
        >
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <Input
            ref={searchInput}
            id="product-search"
            name="q"
            type="search"
            placeholder="Search products"
            defaultValue={filters.q}
            className="touch-target h-auto min-w-0 rounded-full px-5 py-3"
          />
          <Button type="submit" variant="outline" className="rounded-full px-5">
            <Search aria-hidden="true" />
            Search
          </Button>
        </form>
        <div className="product-mobile-filters">
          <Dialog
            open={filtersOpen}
            onOpenChange={(open) => {
              cancelIntent();
              setFiltersOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button
                ref={filterButton}
                variant="outline"
                className="rounded-full"
              >
                <SlidersHorizontal aria-hidden="true" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent
              data-surface="light"
              className="product-filters-dialog"
              onCloseAutoFocus={(event) => {
                if (!filterButton.current?.getClientRects().length) {
                  event.preventDefault();
                  searchInput.current?.focus();
                }
              }}
            >
              <DialogTitle className="pr-10 text-2xl leading-tight">
                Filter products
              </DialogTitle>
              <DialogDescription>
                Choose a category to browse the product examples.
              </DialogDescription>
              <ProductCategoryFilter
                categories={categories}
                selected={filters.category}
                onChange={chooseCategory}
                onClear={clear}
                name="mobile-product-category"
              />
              <DialogClose asChild>
                <Button className="rounded-full">Show products</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
        <div className="product-catalog-layout">
          <aside
            aria-label="Product filters"
            className="product-desktop-filters"
          >
            <ProductCategoryFilter
              categories={categories}
              selected={filters.category}
              onChange={chooseCategory}
              onClear={clear}
              name="desktop-product-category"
            />
          </aside>
          <div className="min-w-0">
            <h3 className="sr-only">Product results</h3>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="product-result-count"
            >
              {matches.length
                ? `Showing 1–${shown.length} of ${matches.length} products`
                : "0 products"}
            </p>
            {shown.length ? (
              <ul className="product-grid">
                {shown.map((product) => (
                  <li
                    key={product.id}
                    onPointerEnter={(event) => {
                      cancelIntent();
                      if (
                        event.pointerType !== "mouse" ||
                        !window.matchMedia("(hover: hover) and (pointer: fine)")
                          .matches ||
                        view.open ||
                        filtersOpen ||
                        suppressed.current === product.id
                      )
                        return;
                      intentTimer.current = setTimeout(
                        () => openProduct(product),
                        400,
                      );
                    }}
                    onPointerLeave={() => {
                      cancelIntent();
                      if (!view.open) suppressed.current = null;
                    }}
                  >
                    <ProductCard
                      product={product}
                      categoryLabel={
                        categories.find(
                          (category) => category.id === product.categoryId,
                        )!.label
                      }
                      copy={copy}
                      action={
                        <Button
                          ref={(node) => {
                            if (node)
                              quickButtons.current.set(product.id, node);
                            else quickButtons.current.delete(product.id);
                          }}
                          variant="outline"
                          className="product-quick-button rounded-full"
                          aria-label={`Quick view ${product.name}`}
                          aria-haspopup="dialog"
                          onClick={() => openProduct(product)}
                        >
                          <ZoomIn aria-hidden="true" />
                          Quick view
                        </Button>
                      }
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="product-no-match">
                <h3>{copy.noMatchTitle}</h3>
                <p>{copy.noMatchDescription}</p>
                <Button variant="outline" onClick={clear}>
                  Clear all filters
                </Button>
              </div>
            )}
            {shown.length < matches.length && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  className="w-full max-w-sm rounded-full"
                  onClick={() => {
                    const firstAdded = matches[shown.length];
                    if (firstAdded && limit + 9 >= matches.length)
                      addedProductFocus.current = {
                        id: firstAdded.id,
                        key: filterKey,
                      };
                    setPagination({ key: filterKey, limit: limit + 9 });
                  }}
                >
                  Load more
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="product-inquiry-links">
          <NavigationLink href={copy.contact.href}>
            {copy.contact.label}
          </NavigationLink>
          <NavigationLink href={copy.call.href}>
            {copy.call.label}
          </NavigationLink>
        </div>
      </Container>
      <ProductQuickView
        open={view.open}
        product={view.product}
        categoryLabel={
          categories.find(
            (category) => category.id === view.product?.categoryId,
          )?.label ?? ""
        }
        copy={copy}
        onClose={closeProduct}
        returnFocus={returnFocus}
      />
    </div>
  );
}
