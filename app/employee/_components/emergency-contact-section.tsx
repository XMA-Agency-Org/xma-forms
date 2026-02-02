"use client";

import { useFormContext, get } from "react-hook-form";
import type { EmployeeFormData } from "../_lib/employee-types";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";

export function EmergencyContactSection() {
  const { register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <FormSection title="Emergency Contact" description="Person to contact in case of emergency">
      <FormField name="emergencyContact.name" label="Full Name" required>
        <Input
          {...register("emergencyContact.name")}
          placeholder="Fatima Al Maktoum"
          variant={get(errors, "emergencyContact.name") ? "error" : "default"}
        />
      </FormField>

      <FormField name="emergencyContact.relationship" label="Relationship" required>
        <Input
          {...register("emergencyContact.relationship")}
          placeholder="Spouse, Parent, etc."
          variant={get(errors, "emergencyContact.relationship") ? "error" : "default"}
        />
      </FormField>

      <FormField name="emergencyContact.phone" label="Phone Number" required>
        <Input
          type="tel"
          {...register("emergencyContact.phone")}
          placeholder="+971 50 123 4567"
          variant={get(errors, "emergencyContact.phone") ? "error" : "default"}
        />
      </FormField>
    </FormSection>
  );
}
