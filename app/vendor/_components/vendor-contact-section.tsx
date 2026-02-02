"use client";

import { useFormContext, get } from "react-hook-form";
import type { VendorFormData } from "../_lib/vendor-types";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";

export function VendorContactSection() {
  const { register, formState: { errors } } = useFormContext<VendorFormData>();

  return (
    <FormSection title="Contact Details" description="Primary and secondary contact information">
      <FormField name="contactPersonName" label="Contact Person Name" required>
        <Input
          {...register("contactPersonName")}
          placeholder="Contact name"
          variant={errors.contactPersonName ? "error" : "default"}
        />
      </FormField>

      <FormField name="phone" label="Phone Number" required>
        <Input
          type="tel"
          {...register("phone")}
          placeholder="+971 50 123 4567"
          variant={errors.phone ? "error" : "default"}
        />
      </FormField>

      <FormField name="email" label="Email Address" required>
        <Input
          type="email"
          {...register("email")}
          placeholder="vendor@example.ae"
          variant={errors.email ? "error" : "default"}
        />
      </FormField>

      <FormField name="secondaryContactPerson" label="Secondary Contact Person">
        <Input {...register("secondaryContactPerson")} placeholder="Optional" />
      </FormField>

      <FormField name="alternateContactDetails" label="Alternate Contact Details">
        <Input {...register("alternateContactDetails")} placeholder="Optional phone or email" />
      </FormField>

      <div className="sm:col-span-2 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Business Address</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField name="businessAddress.street" label="Street" required>
            <Input
              {...register("businessAddress.street")}
              placeholder="Sheikh Zayed Road, Office 501"
              variant={get(errors, "businessAddress.street") ? "error" : "default"}
            />
          </FormField>
          <FormField name="businessAddress.city" label="City" required>
            <Input
              {...register("businessAddress.city")}
              placeholder="Dubai"
              variant={get(errors, "businessAddress.city") ? "error" : "default"}
            />
          </FormField>
          <FormField name="businessAddress.state" label="State / Province" required>
            <Input
              {...register("businessAddress.state")}
              placeholder="Dubai"
              variant={get(errors, "businessAddress.state") ? "error" : "default"}
            />
          </FormField>
          <FormField name="businessAddress.postalCode" label="Postal Code" required>
            <Input
              {...register("businessAddress.postalCode")}
              placeholder="00000"
              variant={get(errors, "businessAddress.postalCode") ? "error" : "default"}
            />
          </FormField>
          <FormField name="businessAddress.country" label="Country" required>
            <Input
              {...register("businessAddress.country")}
              placeholder="United Arab Emirates"
              variant={get(errors, "businessAddress.country") ? "error" : "default"}
            />
          </FormField>
        </div>
      </div>
    </FormSection>
  );
}
