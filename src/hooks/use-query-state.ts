"use client";
import { useSyncExternalStore } from "react";
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("gym-query", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("gym-query", callback);
  };
}
export function useQueryState() {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const params = new URLSearchParams(search);
  function update(values: Record<string, string>) {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(values)) {
      if (value && value !== "All") next.set(key, value);
      else next.delete(key);
    }
    const query = next.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
    window.dispatchEvent(new Event("gym-query"));
  }
  return { params, update };
}
