import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { EmployeeOnboardingForm } from "./_components/employee-onboarding-form";

export default function EmployeePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Employee Onboarding"
        description="Complete this form to begin the employee onboarding process. All required fields must be filled."
      />
      <EmployeeOnboardingForm />
    </PageContainer>
  );
}
