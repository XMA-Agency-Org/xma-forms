"use client";

import { forwardRef, type ChangeEvent, type InputHTMLAttributes } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { inputVariants } from "./input";

type DateInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "onChange"> &
  VariantProps<typeof inputVariants> & {
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  };

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, variant, size, onChange, ...props }, ref) => {
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
      let formatted = "";

      if (raw.length > 0) formatted = raw.slice(0, 2);
      if (raw.length > 2) formatted += "/" + raw.slice(2, 4);
      if (raw.length > 4) formatted += "/" + raw.slice(4, 8);

      e.target.value = formatted;
      onChange?.(e);
    }

    return (
      <input
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder="DD/MM/YYYY"
        maxLength={10}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };
