"use client";

import { FormSection } from "@/components/form/form-section";
import { FileUploadZone } from "@/components/form/file-upload-zone";

export function CustomerDocumentsSection() {
  return (
    <FormSection title="Supporting Documents" description="Upload any additional supporting documents">
      <div className="sm:col-span-2">
        <FileUploadZone
          name="supportingDocuments"
          label="Supporting Documents"
          accept="image/*,.pdf,.doc,.docx"
          multiple
          description="Trade licenses, contracts, or other relevant documents"
        />
      </div>
    </FormSection>
  );
}
