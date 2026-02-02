"use client";

import { useFormContext } from "react-hook-form";
import type { VendorFormData } from "../_lib/vendor-types";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";

export function BusinessInfoSection() {
  const { register, formState: { errors } } = useFormContext<VendorFormData>();

  return (
    <FormSection title="Business Information" description="Company identification and registration details">
      <FormField name="vendorName" label="Vendor / Company Name" required>
        <Input
          {...register("vendorName")}
          placeholder="Al Futtaim Trading LLC"
          variant={errors.vendorName ? "error" : "default"}
        />
      </FormField>

      <FormField name="businessRegistrationNumber" label="Business Registration Number" required>
        <Input
          {...register("businessRegistrationNumber")}
          placeholder="Registration number"
          variant={errors.businessRegistrationNumber ? "error" : "default"}
        />
      </FormField>

      <FormField name="taxIdentificationVatNumber" label="Tax ID / VAT Number" required>
        <Input
          {...register("taxIdentificationVatNumber")}
          placeholder="VAT or Tax ID"
          variant={errors.taxIdentificationVatNumber ? "error" : "default"}
        />
      </FormField>
    </FormSection>
  );
}
