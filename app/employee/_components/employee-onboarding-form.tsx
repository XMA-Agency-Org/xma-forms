"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CheckCircle, AlertCircle } from "lucide-react";
import { employeeSchema } from "../_lib/employee-schema";
import type { EmployeeFormData } from "../_lib/employee-types";
import { PersonalInfoSection } from "./personal-info-section";
import { EmploymentDetailsSection } from "./employment-details-section";
import { BankDetailsSection } from "./bank-details-section";
import { EmergencyContactSection } from "./emergency-contact-section";
import { OptionalInfoSection } from "./optional-info-section";
import { DocumentsUploadSection } from "./documents-upload-section";
import { FormActions } from "@/components/form/form-actions";

function appendFilesToFormData(formData: FormData, key: string, value: unknown) {
  if (value instanceof File) {
    formData.append(key, value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => {
      if (item instanceof File) {
        formData.append(key, item);
      }
    });
  }
}

function buildFormData(data: EmployeeFormData): FormData {
  const formData = new FormData();

  const fileFields = [
    "passportFront",
    "passportBack",
    "profilePhoto",
    "certifications",
    "previousEmploymentDocs",
  ];

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

export function EmployeeOnboardingForm() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const methods = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employmentType: undefined,
      residentialAddress: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },
  });

  async function onSubmit(data: EmployeeFormData) {
    try {
      setSubmitStatus("idle");
      const formData = buildFormData(data);
      await axios.post("/api/submit/employee", formData);
      setSubmitStatus("success");
      setSubmitMessage("Employee onboarding form submitted successfully. An email has been sent to the admin.");
      methods.reset();
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Failed to submit the form. Please try again.");
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <PersonalInfoSection />
        <EmploymentDetailsSection />
        <BankDetailsSection />
        <EmergencyContactSection />
        <DocumentsUploadSection />
        <OptionalInfoSection />

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
          submitLabel="Submit Employee Onboarding"
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
