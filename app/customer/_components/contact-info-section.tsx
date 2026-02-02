"use client";

import { useFormContext } from "react-hook-form";
import type { CustomerFormData } from "../_lib/customer-types";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function ContactInfoSection() {
  const { register, formState: { errors } } = useFormContext<CustomerFormData>();

  return (
    <FormSection title="Contact Information" description="Primary and secondary contact details">
      <FormField name="primaryContactPerson" label="Primary Contact Person" required>
        <Input
          {...register("primaryContactPerson")}
          placeholder="Contact name"
          variant={errors.primaryContactPerson ? "error" : "default"}
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
          placeholder="contact@example.ae"
          variant={errors.email ? "error" : "default"}
        />
      </FormField>

      <FormField name="secondaryContactPerson" label="Secondary Contact Person">
        <Input {...register("secondaryContactPerson")} placeholder="Optional" />
      </FormField>

      <FormField name="alternatePhone" label="Alternate Phone">
        <Input type="tel" {...register("alternatePhone")} placeholder="Optional" />
      </FormField>

      <FormField name="preferredCommunicationMethod" label="Preferred Communication">
        <Select {...register("preferredCommunicationMethod")}>
          <option value="">Select method</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="whatsapp">WhatsApp</option>
        </Select>
      </FormField>
    </FormSection>
  );
}
