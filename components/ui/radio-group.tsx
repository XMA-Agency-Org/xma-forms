"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const radioGroupVariants = cva("flex", {
  variants: {
    layout: {
      vertical: "flex-col gap-2",
      horizontal: "flex-row gap-4",
    },
  },
  defaultVariants: {
    layout: "vertical",
  },
});

type RadioGroupProps = React.ComponentPropsWithRef<"div"> &
  VariantProps<typeof radioGroupVariants>;

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, layout, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(radioGroupVariants({ layout }), className)}
      role="radiogroup"
      {...props}
    />
  )
);

RadioGroup.displayName = "RadioGroup";

type RadioGroupItemProps = React.ComponentPropsWithRef<"input">;

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="radio"
      className={cn("h-4 w-4 accent-primary-600", className)}
      {...props}
    />
  )
);

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem, radioGroupVariants };
