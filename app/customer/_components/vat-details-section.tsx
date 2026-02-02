"use client";

import { useFormContext } from "react-hook-form";
import type { CustomerFormData } from "../_lib/customer-types";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { FileUploadZone } from "@/components/form/file-upload-zone";

export function VatDetailsSection() {
  const { register, formState: { errors } } = useFormContext<CustomerFormData>();

  return (
    <FormSection title="VAT / Tax Details" description="Tax registration and identification">
      <FormField name="trnVat" label="TRN / VAT Number" required>
        <Input
          {...register("trnVat")}
          placeholder="Tax registration number"
          variant={errors.trnVat ? "error" : "default"}
        />
      </FormField>

      <FileUploadZone
        name="vatRegistrationCertificate"
        label="VAT Registration Certificate"
        required
        accept="image/*,.pdf"
        description="Upload your VAT registration certificate"
      />
    </FormSection>
  );
}
