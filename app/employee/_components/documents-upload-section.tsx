"use client";

import { FormSection } from "@/components/form/form-section";
import { FileUploadZone } from "@/components/form/file-upload-zone";

export function DocumentsUploadSection() {
  return (
    <FormSection title="Documents" description="Upload required and optional documents">
      <FileUploadZone
        name="passportFront"
        label="Passport Front"
        required
        accept="image/*,.pdf"
        description="Upload front page of your passport"
      />

      <FileUploadZone
        name="passportBack"
        label="Passport Back"
        required
        accept="image/*,.pdf"
        description="Upload back page of your passport"
      />

      <FileUploadZone
        name="profilePhoto"
        label="Profile Photo"
        accept="image/*"
        description="Optional profile photo"
      />

      <FileUploadZone
        name="certifications"
        label="Certifications"
        accept="image/*,.pdf,.doc,.docx"
        multiple
        description="Upload any relevant certifications"
      />

      <div className="sm:col-span-2">
        <FileUploadZone
          name="previousEmploymentDocs"
          label="Previous Employment Documents"
          accept="image/*,.pdf,.doc,.docx"
          multiple
          description="Payslips, contracts, or other employment documents"
        />
      </div>
    </FormSection>
  );
}
