"use client";

import { useFormContext } from "react-hook-form";
import type { VendorFormData } from "../_lib/vendor-types";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function VendorOptionalSection() {
  const { register } = useFormContext<VendorFormData>();

  return (
    <FormSection title="Additional Information" description="Optional details about your business">
      <FormField name="yearsInOperation" label="Years in Operation">
        <Input
          type="number"
          {...register("yearsInOperation")}
          placeholder="5"
          min="0"
        />
      </FormField>

      <FormField name="preferredPaymentMethod" label="Preferred Payment Method">
        <Select {...register("preferredPaymentMethod")}>
          <option value="">Select method</option>
          <option value="bank-transfer">Bank Transfer</option>
          <option value="cheque">Cheque</option>
          <option value="cash">Cash</option>
          <option value="other">Other</option>
        </Select>
      </FormField>

      <div className="sm:col-span-2">
        <FormField name="references" label="References">
          <Textarea
            {...register("references")}
            placeholder="List any business references"
            rows={3}
          />
        </FormField>
      </div>

      <div className="sm:col-span-2">
        <FormField name="notesAdditionalComments" label="Notes / Additional Comments">
          <Textarea
            {...register("notesAdditionalComments")}
            placeholder="Any additional information"
            rows={3}
          />
        </FormField>
      </div>
    </FormSection>
  );
}
