"use client";

import type { ReactNode } from "react";
import { useFormContext, get } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ name, label, required, children }: FormFieldProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const fieldError = get(errors, name);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      {children}
      {fieldError && (
        <p className="text-sm text-error-500 mt-1">{fieldError.message}</p>
      )}
    </div>
  );
}
