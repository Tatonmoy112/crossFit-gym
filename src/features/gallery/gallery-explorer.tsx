"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQueryState } from "@/hooks/use-query-state";
import type { GalleryImage } from "@/schemas/content";
export function GalleryExplorer({ images }: { images: GalleryImage[] }) {
  const { params, update } = useQueryState();
  const category = params.get("category") || "All";
  const [selected, setSelected] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const filtered = images.filter(
    (item) => category === "All" || item.category === category,
  );
  const index = filtered.findIndex((item) => item.id === selected);
  const current = filtered[index];
  function move(direction: number) {
    setSelected(
      filtered[(index + direction + filtered.length) % filtered.length]?.id ??
        null,
    );
  }
  return (
    <>
      <div className="filter-pills">
        {["All", ...new Set(images.map((item) => item.category))].map(
          (value) => (
            <button
              key={value}
              aria-pressed={value === category}
              className={value === category ? "selected" : ""}
              onClick={() => update({ category: value })}
            >
              {value}
            </button>
          ),
        )}
      </div>
      <div className="gallery-grid">
        {filtered.map((item) => (
          <button
            key={item.id}
            className="gallery-item"
            aria-label={`Enlarge ${item.caption}`}
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setSelected(item.id);
            }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(max-width: 768px) 100vw, 65vw"
            />
            <span>
              <span>{item.caption}</span>
              <Maximize2 size={19} />
            </span>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="no-results">No photographs in this category.</p>
      )}
      <Dialog
        open={!!current}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="lightbox"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          <div
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") move(-1);
              if (event.key === "ArrowRight") move(1);
            }}
          >
            <DialogTitle>
              {current?.caption || "Gallery photograph"}
            </DialogTitle>
            <DialogDescription>{current?.alt}</DialogDescription>
            {current && (
              <Image
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="90vw"
              />
            )}
            <div className="lightbox-controls">
              <button
                className="icon-button"
                aria-label="Previous photograph"
                disabled={filtered.length < 2}
                onClick={() => move(-1)}
              >
                <ArrowLeft />
              </button>
              <span>
                {index + 1} / {filtered.length}
              </span>
              <button
                className="icon-button"
                aria-label="Next photograph"
                disabled={filtered.length < 2}
                onClick={() => move(1)}
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
