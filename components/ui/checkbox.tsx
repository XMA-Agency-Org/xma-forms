import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded-[var(--radius-sm)] border border-input-border text-primary-800 accent-primary-800 focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
