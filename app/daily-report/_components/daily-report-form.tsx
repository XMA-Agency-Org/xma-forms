"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CheckCircle, AlertCircle } from "lucide-react";
import type { EmployeeConfig, EmployeeRole } from "../_lib/report-types";

const roleDefaultValues: Partial<Record<EmployeeRole, Record<string, unknown>>> = {
  "video-editor": {
    editingEntries: [{ client: "", videosEdited: 0 }],
  },
  videographer: {
    shootEntries: [{ client: "", shootDescription: "", videosCaptured: 0 }],
  },
  "account-manager": {
    accountEntries: [{ client: "" }],
  },
};
import { composeSchema } from "../_lib/report-schema";
import { CoreSection } from "./core-section";
import { VideoEditorSection } from "./video-editor-section";
import { VideographerSection } from "./videographer-section";
import { ScriptWriterSection } from "./script-writer-section";
import { AccountManagerSection } from "./account-manager-section";
import { GraphicDesignerSection } from "./graphic-designer-section";
import { SalesmanSection } from "./salesman-section";
import { FormActions } from "@/components/form/form-actions";

interface DailyReportFormProps {
  config: EmployeeConfig;
}

const roleSectionMap: Record<EmployeeRole, () => React.ReactNode> = {
  "video-editor": () => <VideoEditorSection />,
  videographer: () => <VideographerSection />,
  "script-writer": () => <ScriptWriterSection />,
  "account-manager": () => <AccountManagerSection />,
  "graphic-designer": () => <GraphicDesignerSection />,
  salesman: () => <SalesmanSection />,
};

export function DailyReportForm({ config }: DailyReportFormProps) {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const schema = composeSchema(config.roles);

  function getTodayFormatted() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: getTodayFormatted(),
      ...config.roles.reduce(
        (acc, role) => ({ ...acc, ...roleDefaultValues[role] }),
        {}
      ),
    },
  });

  async function onSubmit(data: Record<string, unknown>) {
    try {
      setSubmitStatus("idle");
      await axios.post("/api/submit/daily-report", {
        employee: config.slug,
        employeeName: config.name,
        ...data,
      });
      setSubmitStatus("success");
      setSubmitMessage("Daily report submitted successfully.");
      methods.reset();
    } catch (err) {
      setSubmitStatus("error");
      const errorData = axios.isAxiosError(err) ? JSON.stringify(err.response?.data, null, 2) : String(err);
      setSubmitMessage(errorData);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <CoreSection />

        {config.roles.map((role) => {
          const renderSection = roleSectionMap[role];
          return <div key={role}>{renderSection()}</div>;
        })}

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
          submitLabel="Submit Daily Report"
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
