import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import {
  getEmployeeConfig,
  getAllEmployeeSlugs,
} from "../_lib/employee-config";
import { DailyReportForm } from "../_components/daily-report-form";

interface DailyReportPageProps {
  params: Promise<{ employee: string }>;
}

export async function generateStaticParams() {
  return getAllEmployeeSlugs().map((slug) => ({ employee: slug }));
}

export default async function DailyReportPage({ params }: DailyReportPageProps) {
  const { employee } = await params;
  const config = getEmployeeConfig(employee);

  if (!config) {
    notFound();
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Daily Report \u2014 ${config.name}`}
        description="Fill out your end-of-day production report. Keep it factual and measurable."
      />
      <DailyReportForm config={config} />
    </PageContainer>
  );
}
