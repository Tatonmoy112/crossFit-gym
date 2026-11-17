"use client";

import type { RefObject } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { Product, ProductShopCopy } from "@/schemas/products";
import { ProductMedia } from "./product-media";
import { productDetailHref } from "@/lib/products/links";
import { ProductInquiryActions } from "./product-inquiry-actions";

export function ProductQuickView({
  open,
  product,
  categoryLabel,
  copy,
  onClose,
  returnFocus,
}: {
  open: boolean;
  product: Product | null;
  categoryLabel: string;
  copy: ProductShopCopy;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        data-surface="light"
        className="product-quick-view"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (returnFocus.current?.isConnected) returnFocus.current.focus();
          else document.getElementById("product-search")?.focus();
        }}
      >
        {product && (
          <>
            <ProductMedia
              product={product}
              pendingLabel={copy.pendingPhotography}
            />
            <div className="product-quick-view-copy">
              <p className="product-category-label">{categoryLabel}</p>
              <DialogTitle className="m-0 pr-10 text-3xl leading-tight">
                {product.name}
              </DialogTitle>
              <DialogDescription className="m-0 text-base leading-relaxed">
                {product.summary}
              </DialogDescription>
              <NavigationLink
                href={productDetailHref(product.id)}
                className="justify-self-start"
              >
                View full details
              </NavigationLink>
              <p className="product-price">
                {product.price === null
                  ? copy.pendingPrice
                  : `BDT ${product.price.toLocaleString("en-BD")}`}
              </p>
              <p className="m-0 text-sm text-muted-foreground">
                {copy.pendingOptions}
              </p>
              {product.status === "preview" && (
                <p
                  role="note"
                  className="m-0 text-sm leading-relaxed text-muted-foreground"
                >
                  {copy.previewNotice}
                </p>
              )}
              <ProductInquiryActions copy={copy} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
