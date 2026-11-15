"use client";
import { useEffect, useState } from "react";
import { useQueryState } from "@/hooks/use-query-state";
export function VariantSelector({ variants }: { variants: string[] }) {
  const { params, update } = useQueryState();
  const selected = params.get("variant") || variants[0];
  return (
    <label className="field">
      Product option
      <select
        value={selected}
        onChange={(e) => update({ variant: e.target.value })}
      >
        {variants.map((variant) => (
          <option key={variant}>{variant}</option>
        ))}
      </select>
    </label>
  );
}
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const article = document.getElementById("article-body");
      if (!article) return;
      const start = article.offsetTop;
      const distance = Math.max(1, article.offsetHeight - window.innerHeight);
      setProgress(
        Math.round(
          Math.max(0, Math.min(1, (window.scrollY - start) / distance)) * 100,
        ),
      );
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div className="reading-progress">
      <span className="eyebrow">YOUR PROGRESS</span>
      <progress
        aria-label="Article reading progress"
        max={100}
        value={progress}
      />
      <span>{progress}%</span>
    </div>
  );
}
