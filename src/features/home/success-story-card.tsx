import Image from "next/image";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { HomeSuccessStory } from "@/schemas/content";

export function SuccessStoryCard({ story }: { story: HomeSuccessStory }) {
  const initials = story.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("");
  return (
    <Card
      data-success-story={story.id}
      className="success-story-card relative w-full rounded-3xl p-6 shadow-none ring-0"
    >
      {story.image && (
        <Image
          src={story.image.src}
          alt={story.image.alt}
          width={story.image.width}
          height={story.image.height}
          className="success-story-photo absolute inset-0 size-full object-cover"
        />
      )}
      <span className="success-story-monogram" aria-hidden="true">
        {initials}
      </span>
      <figure className="relative z-10 m-0 flex min-w-0 flex-1 flex-col gap-6">
        <Quote
          aria-hidden="true"
          className="success-story-quote size-7 shrink-0"
        />
        <blockquote className="m-0 text-base leading-relaxed">
          <p className="m-0">“{story.quote}”</p>
        </blockquote>
        <figcaption className="mt-auto flex min-w-0 items-center gap-3 border-t border-current/15 pt-5">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-current/25 text-xs font-semibold"
          >
            {initials}
          </span>
          <span className="grid min-w-0 gap-1">
            <span className="font-heading text-2xl font-semibold leading-tight">
              {story.name}
            </span>
            <span className="text-xs leading-relaxed">{story.focus}</span>
          </span>
        </figcaption>
      </figure>
    </Card>
  );
}
