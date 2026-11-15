import { cn } from "cn";

type SectionHeadingProps = {
  title: string;
  description?: string;
  headingId?: string;
  align?: "start" | "center";
};

export function SectionHeading({
  title,
  description,
  headingId,
  align = "start",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "grid w-full min-w-0 gap-2 [overflow-wrap:anywhere]",
        align === "center"
          ? "justify-items-center text-center"
          : "justify-items-start text-start",
      )}
    >
      <h2 id={headingId} className="m-0 text-foreground">
        {title}
      </h2>
      {description?.trim() ? (
        <p className="text-measure m-0 text-base leading-[1.6] font-normal text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
