"use client";

import { FormSection } from "@/components/form/form-section";
import { FileUploadZone } from "@/components/form/file-upload-zone";

export function ComplianceDocumentsSection() {
  return (
    <FormSection title="Compliance Documents" description="Upload required certificates and licenses">
      <FileUploadZone
        name="vatRegistrationCertificate"
        label="VAT Registration Certificate"
        required
        accept="image/*,.pdf"
        description="Upload your VAT registration certificate"
      />

      <FileUploadZone
        name="complianceDocuments"
        label="Licenses & Certifications"
        accept="image/*,.pdf,.doc,.docx"
        multiple
        description="Business licenses, compliance certifications, etc."
      />
    </FormSection>
  );
}
