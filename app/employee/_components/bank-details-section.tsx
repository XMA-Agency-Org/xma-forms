"use client";

import { useFormContext } from "react-hook-form";
import type { EmployeeFormData } from "../_lib/employee-types";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";

export function BankDetailsSection() {
  const { register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <FormSection title="Bank Details" description="Payment and banking information">
      <FormField name="bankName" label="Bank Name" required>
        <Input
          {...register("bankName")}
          placeholder="Emirates NBD"
          variant={errors.bankName ? "error" : "default"}
        />
      </FormField>

      <FormField name="accountHolderName" label="Account Holder Name" required>
        <Input
          {...register("accountHolderName")}
          placeholder="Ahmed Al Maktoum"
          variant={errors.accountHolderName ? "error" : "default"}
        />
      </FormField>

      <FormField name="accountNumberIban" label="Account Number / IBAN" required>
        <Input
          {...register("accountNumberIban")}
          placeholder="IBAN or account number"
          variant={errors.accountNumberIban ? "error" : "default"}
        />
      </FormField>

      <FormField name="swiftCode" label="SWIFT / BIC Code" required>
        <Input
          {...register("swiftCode")}
          placeholder="ABORAEAD"
          variant={errors.swiftCode ? "error" : "default"}
        />
      </FormField>
    </FormSection>
  );
}
