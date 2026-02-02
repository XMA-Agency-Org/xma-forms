"use client";

import { useFormContext, get } from "react-hook-form";
import type { CustomerFormData } from "../_lib/customer-types";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function BillingDetailsSection() {
  const { register, watch, formState: { errors } } = useFormContext<CustomerFormData>();
  const sameAsBilling = watch("shippingAddressSameAsBilling");

  return (
    <FormSection title="Billing & Shipping" description="Address information for billing and shipping">
      <div className="sm:col-span-2 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Billing Address</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField name="billingAddress.street" label="Street" required>
            <Input
              {...register("billingAddress.street")}
              placeholder="Sheikh Zayed Road, Office 301"
              variant={get(errors, "billingAddress.street") ? "error" : "default"}
            />
          </FormField>
          <FormField name="billingAddress.city" label="City" required>
            <Input
              {...register("billingAddress.city")}
              placeholder="Dubai"
              variant={get(errors, "billingAddress.city") ? "error" : "default"}
            />
          </FormField>
          <FormField name="billingAddress.state" label="State / Province" required>
            <Input
              {...register("billingAddress.state")}
              placeholder="Dubai"
              variant={get(errors, "billingAddress.state") ? "error" : "default"}
            />
          </FormField>
          <FormField name="billingAddress.postalCode" label="Postal Code" required>
            <Input
              {...register("billingAddress.postalCode")}
              placeholder="00000"
              variant={get(errors, "billingAddress.postalCode") ? "error" : "default"}
            />
          </FormField>
          <FormField name="billingAddress.country" label="Country" required>
            <Input
              {...register("billingAddress.country")}
              placeholder="United Arab Emirates"
              variant={get(errors, "billingAddress.country") ? "error" : "default"}
            />
          </FormField>
        </div>
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox {...register("shippingAddressSameAsBilling")} defaultChecked />
          Shipping address is the same as billing address
        </label>
      </div>

      {!sameAsBilling && (
        <div className="sm:col-span-2 space-y-4">
          <h3 className="text-sm font-medium text-foreground">Shipping Address</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField name="shippingAddress.street" label="Street" required>
              <Input
                {...register("shippingAddress.street")}
                placeholder="Sheikh Zayed Road, Office 301"
                variant={get(errors, "shippingAddress.street") ? "error" : "default"}
              />
            </FormField>
            <FormField name="shippingAddress.city" label="City" required>
              <Input
                {...register("shippingAddress.city")}
                placeholder="Dubai"
                variant={get(errors, "shippingAddress.city") ? "error" : "default"}
              />
            </FormField>
            <FormField name="shippingAddress.state" label="State / Province" required>
              <Input
                {...register("shippingAddress.state")}
                placeholder="Dubai"
                variant={get(errors, "shippingAddress.state") ? "error" : "default"}
              />
            </FormField>
            <FormField name="shippingAddress.postalCode" label="Postal Code" required>
              <Input
                {...register("shippingAddress.postalCode")}
                placeholder="00000"
                variant={get(errors, "shippingAddress.postalCode") ? "error" : "default"}
              />
            </FormField>
            <FormField name="shippingAddress.country" label="Country" required>
              <Input
                {...register("shippingAddress.country")}
                placeholder="United Arab Emirates"
                variant={get(errors, "shippingAddress.country") ? "error" : "default"}
              />
            </FormField>
          </div>
        </div>
      )}
    </FormSection>
  );
}
