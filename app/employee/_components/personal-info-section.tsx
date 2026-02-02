"use client";

import { useFormContext } from "react-hook-form";
import type { EmployeeFormData } from "../_lib/employee-types";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";

export function PersonalInfoSection() {
  const { register, formState: { errors } } = useFormContext<EmployeeFormData>();

  const hasError = (field: string) => {
    const parts = field.split(".");
    let current: Record<string, unknown> = errors as Record<string, unknown>;
    for (const part of parts) {
      if (!current?.[part]) return false;
      current = current[part] as Record<string, unknown>;
    }
    return true;
  };

  return (
    <FormSection title="Personal Information" description="Basic personal and contact details">
      <FormField name="firstName" label="First Name" required>
        <Input
          {...register("firstName")}
          placeholder="Ahmed"
          variant={errors.firstName ? "error" : "default"}
        />
      </FormField>

      <FormField name="lastName" label="Last Name" required>
        <Input
          {...register("lastName")}
          placeholder="Al Maktoum"
          variant={errors.lastName ? "error" : "default"}
        />
      </FormField>

      <FormField name="middleName" label="Middle Name">
        <Input {...register("middleName")} placeholder="Optional" />
      </FormField>

      <FormField name="preferredName" label="Preferred Name">
        <Input {...register("preferredName")} placeholder="Optional" />
      </FormField>

      <FormField name="dateOfBirth" label="Date of Birth" required>
        <DateInput
          {...register("dateOfBirth")}
          variant={errors.dateOfBirth ? "error" : "default"}
        />
      </FormField>

      <FormField name="passportNumber" label="Passport Number" required>
        <Input
          {...register("passportNumber")}
          placeholder="AB1234567"
          variant={errors.passportNumber ? "error" : "default"}
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
          placeholder="ahmed@example.ae"
          variant={errors.email ? "error" : "default"}
        />
      </FormField>

      <FormField name="secondaryPhone" label="Secondary Phone">
        <Input type="tel" {...register("secondaryPhone")} placeholder="Optional" />
      </FormField>

      <div className="sm:col-span-2 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Residential Address</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField name="residentialAddress.street" label="Street" required>
            <Input
              {...register("residentialAddress.street")}
              placeholder="Al Wasl Road, Villa 42"
              variant={hasError("residentialAddress.street") ? "error" : "default"}
            />
          </FormField>

          <FormField name="residentialAddress.city" label="City" required>
            <Input
              {...register("residentialAddress.city")}
              placeholder="Dubai"
              variant={hasError("residentialAddress.city") ? "error" : "default"}
            />
          </FormField>

          <FormField name="residentialAddress.state" label="State / Province" required>
            <Input
              {...register("residentialAddress.state")}
              placeholder="Dubai"
              variant={hasError("residentialAddress.state") ? "error" : "default"}
            />
          </FormField>

          <FormField name="residentialAddress.postalCode" label="Postal Code" required>
            <Input
              {...register("residentialAddress.postalCode")}
              placeholder="00000"
              variant={hasError("residentialAddress.postalCode") ? "error" : "default"}
            />
          </FormField>

          <FormField name="residentialAddress.country" label="Country" required>
            <Input
              {...register("residentialAddress.country")}
              placeholder="United Arab Emirates"
              variant={hasError("residentialAddress.country") ? "error" : "default"}
            />
          </FormField>
        </div>
      </div>
    </FormSection>
  );
}
