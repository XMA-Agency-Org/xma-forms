"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";

export function ScriptWriterSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormSection
      title="Script Writing"
      description="Details about script writing work completed today"
    >
      <FormField name="scriptsWritten" label="Scripts Written" required>
        <Input
          type="number"
          {...register("scriptsWritten")}
          placeholder="0"
          min={0}
          variant={errors.scriptsWritten ? "error" : "default"}
        />
      </FormField>

      <FormField name="scriptsRevised" label="Scripts Revised">
        <Input
          type="number"
          {...register("scriptsRevised")}
          placeholder="0"
          min={0}
        />
      </FormField>

      <FormField name="avgScriptLength" label="Avg Script Length">
        <Input
          {...register("avgScriptLength")}
          placeholder="e.g. 30 seconds or 150 words"
        />
      </FormField>

      <FormField name="scriptsApproved" label="Scripts Approved Today">
        <Input
          type="number"
          {...register("scriptsApproved")}
          placeholder="0"
          min={0}
        />
      </FormField>
    </FormSection>
  );
}
