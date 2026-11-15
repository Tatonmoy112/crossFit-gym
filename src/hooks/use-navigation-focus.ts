"use client";

import { useCallback, useRef, type FocusEvent, type RefObject } from "react";

// Browsers can blur a control before matchMedia reports its CSS visibility
// change. Keep focus ownership through that blur, but clear it on ordinary exit.
function useNavigationFocus(root: RefObject<HTMLElement | null>) {
  const ownedFocus = useRef(false);
  const restoreFocus = useCallback(() => {
    if (ownedFocus.current || root.current?.contains(document.activeElement))
      document.getElementById("main")?.focus();
    ownedFocus.current = false;
  }, [root]);

  function onFocusCapture() {
    ownedFocus.current = true;
  }
  function onBlurCapture(event: FocusEvent<HTMLElement>) {
    if (
      !event.currentTarget.contains(event.relatedTarget) &&
      getComputedStyle(event.currentTarget).display !== "none"
    )
      ownedFocus.current = false;
  }

  return { onFocusCapture, onBlurCapture, restoreFocus };
}

export { useNavigationFocus };
