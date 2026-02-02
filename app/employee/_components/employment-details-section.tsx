"use client";

import { useFormContext } from "react-hook-form";
import type { EmployeeFormData } from "../_lib/employee-types";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Select } from "@/components/ui/select";

export function EmploymentDetailsSection() {
  const { register, watch, formState: { errors } } = useFormContext<EmployeeFormData>();
  const employmentType = watch("employmentType");

  return (
    <FormSection title="Employment Details" description="Position and employment information">
      <FormField name="employmentType" label="Employment Type" required>
        <Select
          {...register("employmentType")}
          variant={errors.employmentType ? "error" : "default"}
        >
          <option value="">Select type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </Select>
      </FormField>

      <FormField name="jobTitle" label="Job Title" required>
        <Input
          {...register("jobTitle")}
          placeholder="Software Engineer"
          variant={errors.jobTitle ? "error" : "default"}
        />
      </FormField>

      <FormField name="startDate" label="Start Date" required>
        <DateInput
          {...register("startDate")}
          variant={errors.startDate ? "error" : "default"}
        />
      </FormField>

      <FormField name="taxIdentificationNumber" label={`Tax Identification Number${employmentType === "contract" ? "" : " (Optional)"}`}>
        <Input
          {...register("taxIdentificationNumber")}
          placeholder="Tax ID"
        />
      </FormField>
    </FormSection>
  );
}
