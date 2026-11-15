import { SiteLink as Link } from "@/components/ui/site-link";
import { ArrowUpRight } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const styles = cva("button", {
  variants: {
    variant: {
      primary: "button-primary",
      dark: "button-dark",
      outline: "button-outline",
      text: "button-text",
    },
  },
  defaultVariants: { variant: "primary" },
});
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  arrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "dark" | "outline" | "text";
  className?: string;
  arrow?: boolean;
}) {
  const external = /^https?:/.test(href);
  return (
    <Link
      href={href}
      className={cn(styles({ variant }), className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {arrow && <ArrowUpRight size={17} aria-hidden="true" />}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </Link>
  );
}
