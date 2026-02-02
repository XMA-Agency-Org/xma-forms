import { forwardRef, type SelectHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const selectVariants = cva(
  "flex w-full appearance-none rounded-[var(--radius-md)] border bg-transparent px-3 py-2 pr-10 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input-border",
        error: "border-error-500",
      },
      size: {
        sm: "h-8 text-sm",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> &
  VariantProps<typeof selectVariants>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <div className="relative w-full">
      <select
        className={cn(selectVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
);

Select.displayName = "Select";

export { Select, selectVariants };
