import Link from "next/link";
import { cn } from "cn";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbEntry[];
  className?: string;
}

function Entry({ item, current }: { item: BreadcrumbEntry; current: boolean }) {
  if (current) {
    // Current page is plain text; drop the stock disabled-link semantics.
    return (
      <BreadcrumbPage role={undefined} aria-disabled={undefined}>
        {item.label}
      </BreadcrumbPage>
    );
  }
  if (!item.href) return <span>{item.label}</span>;
  return (
    <BreadcrumbLink asChild className="text-muted-foreground">
      <Link href={item.href} prefetch={false}>
        {item.label}
      </Link>
    </BreadcrumbLink>
  );
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <Breadcrumb aria-label="Breadcrumb" className={cn("py-2", className)}>
      <BreadcrumbList>
        {items.flatMap((item, index) => {
          const current = index === items.length - 1;
          // "anywhere" (unlike the list's break-word) shrinks flex min-content,
          // so unbroken labels wrap instead of overflowing narrow viewports.
          const entry = (
            <BreadcrumbItem
              key={`item-${index}`}
              className="min-w-0 [overflow-wrap:anywhere]"
            >
              <Entry item={item} current={current} />
            </BreadcrumbItem>
          );
          return current
            ? [entry]
            : [entry, <BreadcrumbSeparator key={`separator-${index}`} />];
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
