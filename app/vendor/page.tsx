import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { VendorOnboardingForm } from "./_components/vendor-onboarding-form";

export default function VendorPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Vendor / Supplier Onboarding"
        description="Complete this form to register as a vendor or supplier. All required fields must be filled."
      />
      <VendorOnboardingForm />
    </PageContainer>
  );
}
