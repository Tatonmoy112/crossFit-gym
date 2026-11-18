import { maintenancePages } from "@/content/maintenance";

// Registered public destinations, including explicitly non-indexed maintenance pages.
export const routes = [
  "/",
  "/about",
  "/membership",
  "/contact",
  "/products",
  "/supplements",
  ...maintenancePages.map((page) => page.path),
];
