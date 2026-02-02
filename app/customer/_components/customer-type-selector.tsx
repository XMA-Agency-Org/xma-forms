"use client";

import { useFormContext } from "react-hook-form";
import type { CustomerFormData } from "../_lib/customer-types";
import { User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const customerTypes = [
  { value: "individual" as const, label: "Individual", icon: User, description: "Personal customer account" },
  { value: "company" as const, label: "Company", icon: Building2, description: "Business or corporate account" },
];

export function CustomerTypeSelector() {
  const { setValue, watch, formState: { errors } } = useFormContext<CustomerFormData>();
  const selectedType = watch("customerType");

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">
        Customer Type <span className="text-error-500">*</span>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {customerTypes.map(({ value, label, icon: Icon, description }) => (
          <button
            key={value}
            type="button"
            onClick={() => setValue("customerType", value, { shouldValidate: true })}
            className={cn(
              "flex items-center gap-4 rounded-[var(--radius-lg)] border-2 p-4 text-left transition-colors",
              selectedType === value
                ? "border-primary-500 bg-primary-50"
                : "border-border hover:border-primary-300 hover:bg-muted"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
              selectedType === value ? "bg-primary-100 text-primary-700" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">{label}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </button>
        ))}
      </div>
      {errors.customerType && (
        <p className="text-sm text-error-500">{errors.customerType.message}</p>
      )}
    </div>
  );
}
