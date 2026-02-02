"use client";

import * as React from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const linkVariants = cva("transition-colors", {
  variants: {
    variant: {
      default:
        "text-primary-700 hover:text-primary-900 underline-offset-4 hover:underline",
      muted: "text-muted-foreground hover:text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type LinkComponentProps = Omit<React.ComponentPropsWithRef<"a">, keyof NextLinkProps> &
  NextLinkProps &
  VariantProps<typeof linkVariants>;

const Link = React.forwardRef<HTMLAnchorElement, LinkComponentProps>(
  ({ className, variant, ...props }, ref) => (
    <NextLink
      ref={ref}
      className={cn(linkVariants({ variant }), className)}
      {...props}
    />
  )
);

Link.displayName = "Link";

export { Link, linkVariants };
