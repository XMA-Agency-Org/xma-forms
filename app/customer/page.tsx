import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { CustomerOnboardingForm } from "./_components/customer-onboarding-form";

export default function CustomerPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Customer Onboarding"
        description="Complete this form to register as a new customer. Select your customer type to see relevant fields."
      />
      <CustomerOnboardingForm />
    </PageContainer>
  );
}
