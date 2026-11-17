"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Product } from "@/schemas/products";

const subscribe = () => () => {};
export function ProductImageGallery({
  name,
  images,
}: {
  name: string;
  images: Product["images"];
}) {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(false);
  const zoomButton = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const image = images[selected];
  const move = (direction: number) =>
    setSelected((index) =>
      Math.max(0, Math.min(images.length - 1, index + direction)),
    );
  if (!images.length) return null;
  if (!ready)
    return (
      <div className="product-native-gallery">
        {images.map((item, index) => (
          <Image
            key={item.src}
            {...item}
            alt={item.alt}
            loading={index === 0 ? "eager" : "lazy"}
            unoptimized
            className="w-full object-contain"
          />
        ))}
      </div>
    );
  return (
    <div
      className="product-image-gallery"
      role="group"
      aria-label={`Images of ${name}`}
    >
      <div
        className="product-gallery-main"
        tabIndex={0}
        role="group"
        aria-label={`Image ${selected + 1} of ${images.length}`}
        onKeyDown={(event) => {
          if (
            event.target !== event.currentTarget ||
            !["ArrowLeft", "ArrowRight"].includes(event.key)
          )
            return;
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }}
        onPointerDown={(event) => {
          if (event.pointerType === "touch" && event.isPrimary)
            touch.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerCancel={() => {
          touch.current = null;
        }}
        onPointerUp={(event) => {
          const start = touch.current;
          touch.current = null;
          if (!start) return;
          const dx = event.clientX - start.x,
            dy = event.clientY - start.y;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5)
            move(dx < 0 ? 1 : -1);
        }}
      >
        <Image
          {...image}
          alt={image.alt}
          unoptimized
          loading="eager"
          className="size-full object-contain"
        />
        <Button
          ref={zoomButton}
          variant="outline"
          className="product-gallery-zoom rounded-full"
          aria-label={`Zoom image of ${name}`}
          onClick={() => setZoom(true)}
        >
          <ZoomIn aria-hidden="true" />
          Zoom image
        </Button>
      </div>
      {images.length > 1 && (
        <>
          <div className="product-gallery-controls">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous product image"
              aria-disabled={selected === 0}
              onClick={() => move(-1)}
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <p role="status" aria-live="polite" className="m-0 text-sm">
              Image {selected + 1} of {images.length}
            </p>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next product image"
              aria-disabled={selected === images.length - 1}
              onClick={() => move(1)}
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <div
            className="product-gallery-thumbnails"
            role="group"
            aria-label="Choose a product image"
          >
            {images.map((item, index) => (
              <button
                key={item.src}
                type="button"
                aria-label={`View image ${index + 1} of ${name}`}
                aria-pressed={selected === index}
                className="product-gallery-thumbnail touch-target"
                onClick={() => setSelected(index)}
              >
                <Image
                  {...item}
                  alt=""
                  unoptimized
                  loading="lazy"
                  className="size-full object-contain"
                />
              </button>
            ))}
          </div>
        </>
      )}
      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent
          data-surface="light"
          className="product-image-zoom-dialog"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (zoomButton.current?.isConnected) zoomButton.current.focus();
          }}
        >
          <DialogTitle className="pr-10 text-xl leading-tight">
            Image of {name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enlarged product photograph
          </DialogDescription>
          <Image
            {...image}
            alt={image.alt}
            unoptimized
            className="product-zoom-image"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
