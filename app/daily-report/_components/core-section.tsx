"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Textarea } from "@/components/ui/textarea";
import { DateInput } from "@/components/ui/date-input";

export function CoreSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormSection
      title="Daily Report"
      description="Core information about your work day"
    >
      <FormField name="date" label="Date" required>
        <DateInput
          {...register("date")}
          variant={errors.date ? "error" : "default"}
        />
      </FormField>

      <div className="sm:col-span-2">
        <FormField name="notes" label="Notes">
          <Textarea
            {...register("notes")}
            placeholder="Any additional notes about your day"
            rows={4}
          />
        </FormField>
      </div>
    </FormSection>
  );
}
