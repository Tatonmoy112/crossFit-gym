"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Native disclosures own open state. The enhancement adds mouse previews without
// duplicating content or removing the static HTML's keyboard/touch fallback.
export function FaqDisclosures({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = root.current;
    if (!list) return;
    const rows = [
      ...list.querySelectorAll<HTMLDetailsElement>("[data-faq-row]"),
    ];
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let pinned: HTMLDetailsElement | null = null;
    let hovered: HTMLDetailsElement | null = null;
    let disposed = false;
    const containsAnswerFocus = (row: HTMLDetailsElement) =>
      !!row
        .querySelector("[data-faq-answer]")
        ?.contains(document.activeElement);
    const open = (row: HTMLDetailsElement) => {
      rows.forEach((other) => {
        if (other !== row) other.open = false;
      });
      row.open = true;
    };
    const cleanups = rows.map((row) => {
      const summary = row.querySelector("summary")!;
      const enter = (event: PointerEvent) => {
        if (!finePointer.matches || event.pointerType !== "mouse") return;
        hovered = row;
        if (rows.some((other) => other !== row && containsAnswerFocus(other)))
          return;
        if (pinned !== row) pinned = null;
        open(row);
      };
      const leave = () => {
        if (hovered === row) hovered = null;
        if (pinned !== row && !containsAnswerFocus(row)) row.open = false;
      };
      const click = (event: MouseEvent) => {
        event.preventDefault();
        if (row.open && pinned === row) {
          row.open = false;
          pinned = null;
        } else {
          open(row);
          pinned = row;
        }
      };
      const keydown = (event: KeyboardEvent) => {
        if (event.key !== "Escape" || !row.open) return;
        event.preventDefault();
        if (containsAnswerFocus(row)) summary.focus({ preventScroll: true });
        row.open = false;
        if (pinned === row) pinned = null;
      };
      const focusout = () =>
        queueMicrotask(() => {
          if (
            !disposed &&
            hovered !== row &&
            pinned !== row &&
            !containsAnswerFocus(row)
          )
            row.open = false;
        });
      row.addEventListener("pointerenter", enter);
      row.addEventListener("pointerleave", leave);
      row.addEventListener("pointercancel", leave);
      row.addEventListener("keydown", keydown);
      row.addEventListener("focusout", focusout);
      summary.addEventListener("click", click);
      return () => {
        row.removeEventListener("pointerenter", enter);
        row.removeEventListener("pointerleave", leave);
        row.removeEventListener("pointercancel", leave);
        row.removeEventListener("keydown", keydown);
        row.removeEventListener("focusout", focusout);
        summary.removeEventListener("click", click);
      };
    });
    list.dataset.ready = "true";
    return () => {
      disposed = true;
      cleanups.forEach((cleanup) => cleanup());
      delete list.dataset.ready;
    };
  }, []);

  return (
    <div ref={root} className="faq-list" data-faq-list>
      {children}
    </div>
  );
}
