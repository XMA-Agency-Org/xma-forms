"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function CustomerIdentitySection() {
  const { register, watch, formState: { errors } } = useFormContext();
  const customerType = watch("customerType");

  if (!customerType) return null;

  return (
    <FormSection
      title={customerType === "individual" ? "Personal Details" : "Company Details"}
      description={customerType === "individual" ? "Your personal identification" : "Business identification details"}
    >
      {customerType === "individual" ? (
        <>
          <FormField name="fullName" label="Full Name" required>
            <Input
              {...register("fullName")}
              placeholder="Ahmed Al Maktoum"
              variant={errors.fullName ? "error" : "default"}
            />
          </FormField>

          <FormField name="nationalIdNumber" label="National ID Number" required>
            <Input
              {...register("nationalIdNumber")}
              placeholder="ID number"
              variant={errors.nationalIdNumber ? "error" : "default"}
            />
          </FormField>
        </>
      ) : (
        <>
          <FormField name="companyName" label="Company Name" required>
            <Input
              {...register("companyName")}
              placeholder="Emirates Trading LLC"
              variant={errors.companyName ? "error" : "default"}
            />
          </FormField>

          <FormField name="companyRegistrationNumber" label="Company Registration Number" required>
            <Input
              {...register("companyRegistrationNumber")}
              placeholder="Registration number"
              variant={errors.companyRegistrationNumber ? "error" : "default"}
            />
          </FormField>

          <FormField name="companySize" label="Company Size">
            <Select {...register("companySize")}>
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </Select>
          </FormField>
        </>
      )}

      <FormField name="industryType" label="Industry Type">
        <Input
          {...register("industryType")}
          placeholder="Technology, Healthcare, etc."
        />
      </FormField>
    </FormSection>
  );
}
