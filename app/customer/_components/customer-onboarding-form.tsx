"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CheckCircle, AlertCircle } from "lucide-react";
import { customerSchema } from "../_lib/customer-schema";
import type { CustomerFormData } from "../_lib/customer-types";
import { CustomerTypeSelector } from "./customer-type-selector";
import { CustomerIdentitySection } from "./customer-identity-section";
import { ContactInfoSection } from "./contact-info-section";
import { BillingDetailsSection } from "./billing-details-section";
import { VatDetailsSection } from "./vat-details-section";
import { CustomerDocumentsSection } from "./customer-documents-section";
import { FormActions } from "@/components/form/form-actions";

function appendFilesToFormData(formData: FormData, key: string, value: unknown) {
  if (value instanceof File) {
    formData.append(key, value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => {
      if (item instanceof File) formData.append(key, item);
    });
  }
}

function buildFormData(data: CustomerFormData): FormData {
  const formData = new FormData();
  const fileFields = ["vatRegistrationCertificate", "supportingDocuments"];
  const jsonData: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (fileFields.includes(key)) {
      appendFilesToFormData(formData, key, value);
    } else {
      jsonData[key] = value;
    }
  }

  formData.append("data", JSON.stringify(jsonData));
  return formData;
}

export function CustomerOnboardingForm() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const methods = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      shippingAddressSameAsBilling: true,
      billingAddress: { street: "", city: "", state: "", postalCode: "", country: "" },
    } as Partial<CustomerFormData>,
  });

  async function onSubmit(data: CustomerFormData) {
    try {
      setSubmitStatus("idle");
      const formData = buildFormData(data);
      await axios.post("/api/submit/customer", formData);
      setSubmitStatus("success");
      setSubmitMessage("Customer onboarding form submitted successfully. An email has been sent to the admin.");
      methods.reset();
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Failed to submit the form. Please try again.");
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <CustomerTypeSelector />
        <CustomerIdentitySection />
        <ContactInfoSection />
        <BillingDetailsSection />
        <VatDetailsSection />
        <CustomerDocumentsSection />

        {submitStatus === "success" && (
          <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-success-200 bg-success-50 p-4 text-sm text-success-800">
            <CheckCircle className="h-5 w-5 shrink-0" />
            {submitMessage}
          </div>
        )}

        {submitStatus === "error" && (
          <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-error-200 bg-error-50 p-4 text-sm text-error-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {submitMessage}
          </div>
        )}

        <FormActions
          submitLabel="Submit Customer Onboarding"
          isSubmitting={methods.formState.isSubmitting}
          onReset={() => {
            methods.reset();
            setSubmitStatus("idle");
          }}
        />
      </form>
    </FormProvider>
  );
}
