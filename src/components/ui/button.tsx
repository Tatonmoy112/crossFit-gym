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
          "border-primary-border bg-primary text-primary-foreground enabled:hover:bg-primary-hover enabled:active:bg-primary-active",
        outline:
          "border-input bg-background text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground enabled:active:border-selected-border enabled:active:bg-selected enabled:active:text-selected-foreground",
        secondary:
          "border-input bg-secondary text-secondary-foreground enabled:hover:bg-accent enabled:hover:text-foreground enabled:active:border-selected-border enabled:active:bg-selected enabled:active:text-selected-foreground",
        ghost:
          "bg-transparent text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground enabled:active:border-selected-border enabled:active:bg-selected enabled:active:text-selected-foreground",
        destructive:
          "border-destructive bg-background text-destructive enabled:hover:bg-muted enabled:active:bg-selected",
        link: "bg-transparent text-link underline underline-offset-4 enabled:hover:bg-accent enabled:hover:text-accent-foreground enabled:active:bg-selected enabled:active:text-selected-foreground",
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
