import { createRoot } from "react-dom/client";
import { HomeStats } from "@/features/home/home-stats";
import { fixture } from "./home-stats.data";

createRoot(document.getElementById("home-stats-fixture")!).render(
  <HomeStats content={fixture} />,
);
