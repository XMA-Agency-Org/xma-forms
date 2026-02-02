import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const separatorVariants = cva("bg-border shrink-0", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type SeparatorProps = React.ComponentPropsWithRef<"div"> &
  VariantProps<typeof separatorVariants>;

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation ?? "horizontal"}
      className={cn(separatorVariants({ orientation }), className)}
      {...props}
    />
  )
);

Separator.displayName = "Separator";

export { Separator, separatorVariants };
