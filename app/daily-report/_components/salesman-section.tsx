"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";

export function SalesmanSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormSection
      title="Sales"
      description="Details about sales activity today"
    >
      <FormField name="outreaches" label="Outreaches" required>
        <Input
          type="number"
          {...register("outreaches")}
          placeholder="0"
          min={0}
          variant={errors.outreaches ? "error" : "default"}
        />
      </FormField>

      <FormField name="appointmentsSet" label="Appointments Set" required>
        <Input
          type="number"
          {...register("appointmentsSet")}
          placeholder="0"
          min={0}
          variant={errors.appointmentsSet ? "error" : "default"}
        />
      </FormField>
    </FormSection>
  );
}
