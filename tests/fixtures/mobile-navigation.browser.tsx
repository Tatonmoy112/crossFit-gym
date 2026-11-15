import { useState } from "react";
import { createRoot } from "react-dom/client";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

const root = document.getElementById("mobile-navigation-fixture")!;
function Fixture() {
  const [path, setPath] = useState(window.location.pathname);
  return (
    <PathnameContext.Provider value={path}>
      <section data-surface={root.dataset.surface} className="p-4">
        <h2>Mobile navigation fixture</h2>
        <MobileNavigation />
        <button
          type="button"
          className="touch-target block"
          onClick={() => setPath("/locations/uttara/")}
        >
          Change fixture pathname
        </button>
      </section>
    </PathnameContext.Provider>
  );
}
createRoot(root).render(<Fixture />);
