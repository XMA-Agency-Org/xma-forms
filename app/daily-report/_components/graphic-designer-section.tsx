"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";

export function GraphicDesignerSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormSection
      title="Graphic Design"
      description="Details about design work completed today"
    >
      <FormField name="creativesProduced" label="Creatives Produced" required>
        <Input
          type="number"
          {...register("creativesProduced")}
          placeholder="0"
          min={0}
          variant={errors.creativesProduced ? "error" : "default"}
        />
      </FormField>

      <FormField name="thumbnailsDesigned" label="Thumbnails Designed">
        <Input
          type="number"
          {...register("thumbnailsDesigned")}
          placeholder="0"
          min={0}
        />
      </FormField>

      <FormField name="designRevisionsCompleted" label="Revisions Completed">
        <Input
          type="number"
          {...register("designRevisionsCompleted")}
          placeholder="0"
          min={0}
        />
      </FormField>

      <FormField name="newConceptsDeveloped" label="New Concepts Developed">
        <Input
          type="number"
          {...register("newConceptsDeveloped")}
          placeholder="0"
          min={0}
        />
      </FormField>
    </FormSection>
  );
}
