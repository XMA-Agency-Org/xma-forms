"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-error-500",
        false: "",
      },
    },
    defaultVariants: {
      required: false,
    },
  }
);

type LabelProps = React.ComponentPropsWithRef<"label"> &
  VariantProps<typeof labelVariants>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants({ required }), className)}
      {...props}
    />
  )
);

Label.displayName = "Label";

export { Label, labelVariants };
