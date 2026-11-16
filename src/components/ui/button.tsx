import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";

const buttonVariants = cva(
  "group/button inline-flex items-center justify-center gap-2 rounded-control border border-transparent bg-clip-padding type-control touch-target motion-control text-center whitespace-normal [overflow-wrap:anywhere] select-none disabled:cursor-not-allowed disabled:border-input disabled:bg-disabled disabled:text-disabled-foreground disabled:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary-border bg-primary text-primary-foreground not-disabled:hover:bg-primary-hover not-disabled:active:bg-primary-active",
        outline:
          "border-input bg-background text-foreground not-disabled:hover:bg-accent not-disabled:hover:text-accent-foreground not-disabled:active:border-selected-border not-disabled:active:bg-selected not-disabled:active:text-selected-foreground",
        secondary:
          "border-input bg-secondary text-secondary-foreground not-disabled:hover:bg-accent not-disabled:hover:text-foreground not-disabled:active:border-selected-border not-disabled:active:bg-selected not-disabled:active:text-selected-foreground",
        ghost:
          "bg-transparent text-foreground not-disabled:hover:bg-accent not-disabled:hover:text-accent-foreground not-disabled:active:border-selected-border not-disabled:active:bg-selected not-disabled:active:text-selected-foreground",
        destructive:
          "border-destructive bg-background text-destructive not-disabled:hover:bg-muted not-disabled:active:bg-selected",
        link: "bg-transparent text-link underline underline-offset-4 not-disabled:hover:bg-accent not-disabled:hover:text-accent-foreground not-disabled:active:bg-selected not-disabled:active:text-selected-foreground",
      },
      size: {
        default: "px-4 py-2",
        xs: "px-2 py-1 [&_svg:not([class*='size-'])]:size-3",
        sm: "px-3 py-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-12 px-6 py-2.5",
        icon: "p-2",
        "icon-xs": "p-2 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "p-2 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "min-h-12 min-w-12 p-2 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  const elementProps = asChild
    ? props
    : { ...props, type: props.type ?? ("button" as const) };

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...elementProps}
    />
  );
}

export { Button, buttonVariants };
