import { createRoot } from "react-dom/client";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";

const root = document.getElementById("desktop-navigation-fixtures")!;
createRoot(root).render(
  <PathnameContext.Provider value={window.location.pathname}>
    {["light", "yellow", "charcoal"].map((surface) => (
      <section
        key={surface}
        data-surface={surface}
        className="p-4 pb-80"
        aria-label={`${surface} desktop navigation specimen`}
      >
        <h2>{surface} navigation specimen</h2>
        <DesktopNavigation className="mt-4" />
        <button type="button" className="touch-target mt-80 block">
          Outside navigation
        </button>
      </section>
    ))}
  </PathnameContext.Provider>,
);
