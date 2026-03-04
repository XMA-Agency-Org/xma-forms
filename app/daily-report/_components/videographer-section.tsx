"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "../_lib/report-schema";

export function VideographerSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shootEntries",
  });

  const entryErrors = errors.shootEntries as
    | Record<string, Record<string, { message?: string }>>
    | undefined;

  return (
    <FormSection
      title="Videography"
      description="Add an entry for each shoot completed today"
    >
      <div className="sm:col-span-2 space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-[var(--radius-md)] border border-border p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Shoot {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                name={`shootEntries.${index}.client`}
                label="Client"
                required
              >
                <Input
                  {...register(`shootEntries.${index}.client`)}
                  placeholder="Client name"
                  list="client-suggestions"
                  variant={
                    entryErrors?.[index]?.client ? "error" : "default"
                  }
                />
              </FormField>

              <FormField
                name={`shootEntries.${index}.shootDescription`}
                label="What Was the Shoot?"
                required
              >
                <Input
                  {...register(`shootEntries.${index}.shootDescription`)}
                  placeholder="Product shoot, interview, BTS..."
                  variant={
                    entryErrors?.[index]?.shootDescription
                      ? "error"
                      : "default"
                  }
                />
              </FormField>

              <FormField
                name={`shootEntries.${index}.videosCaptured`}
                label="Videos Captured"
                required
              >
                <Input
                  type="number"
                  {...register(`shootEntries.${index}.videosCaptured`)}
                  placeholder="0"
                  min={0}
                  variant={
                    entryErrors?.[index]?.videosCaptured
                      ? "error"
                      : "default"
                  }
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField
                  name={`shootEntries.${index}.entryNotes`}
                  label="Notes"
                >
                  <Textarea
                    {...register(`shootEntries.${index}.entryNotes`)}
                    placeholder="Notes about this shoot"
                    rows={2}
                  />
                </FormField>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ client: "", shootDescription: "", videosCaptured: 0, entryNotes: "" })
          }
        >
          <Plus className="size-4 mr-1" />
          Add Shoot Entry
        </Button>

        <datalist id="client-suggestions">
          {PROJECTS.filter((p) => p !== "Other").map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </div>
    </FormSection>
  );
}
