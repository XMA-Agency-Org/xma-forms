"use client";

import { useFormContext } from "react-hook-form";
import type { EmployeeFormData } from "../_lib/employee-types";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function OptionalInfoSection() {
  const { register } = useFormContext<EmployeeFormData>();

  return (
    <FormSection title="Additional Information" description="Optional details">
      <FormField name="maritalStatus" label="Marital Status">
        <Select {...register("maritalStatus")}>
          <option value="">Select status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </Select>
      </FormField>

      <FormField name="numberOfDependents" label="Number of Dependents">
        <Input
          type="number"
          {...register("numberOfDependents")}
          placeholder="0"
          min="0"
        />
      </FormField>

      <div className="sm:col-span-2">
        <FormField name="medicalInformation" label="Medical Information">
          <Textarea
            {...register("medicalInformation")}
            placeholder="Any relevant medical conditions, allergies, or special requirements"
            rows={4}
          />
        </FormField>
      </div>
    </FormSection>
  );
}
