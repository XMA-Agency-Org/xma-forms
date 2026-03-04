"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "../_lib/report-schema";

export function AccountManagerSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accountEntries",
  });

  const entryErrors = errors.accountEntries as
    | Record<string, Record<string, { message?: string }>>
    | undefined;

  return (
    <FormSection
      title="Account Management"
      description="Add an entry for each client you managed today"
    >
      <div className="sm:col-span-2 space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-[var(--radius-md)] border border-border p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Entry {index + 1}
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
                name={`accountEntries.${index}.client`}
                label="Client"
                required
              >
                <Input
                  {...register(`accountEntries.${index}.client`)}
                  placeholder="Client name"
                  list="client-suggestions"
                  variant={
                    entryErrors?.[index]?.client ? "error" : "default"
                  }
                />
              </FormField>

              <FormField
                name={`accountEntries.${index}.clientCallsDone`}
                label="Client Calls Done"
              >
                <Input
                  type="number"
                  {...register(`accountEntries.${index}.clientCallsDone`)}
                  placeholder="0"
                  min={0}
                />
              </FormField>

              <FormField
                name={`accountEntries.${index}.issuesResolved`}
                label="Issues Resolved"
              >
                <Input
                  type="number"
                  {...register(`accountEntries.${index}.issuesResolved`)}
                  placeholder="0"
                  min={0}
                />
              </FormField>

              <FormField
                name={`accountEntries.${index}.deliverablesCoordinated`}
                label="Deliverables Coordinated"
              >
                <Input
                  type="number"
                  {...register(
                    `accountEntries.${index}.deliverablesCoordinated`
                  )}
                  placeholder="0"
                  min={0}
                />
              </FormField>

              <FormField
                name={`accountEntries.${index}.escalations`}
                label="Escalations"
              >
                <Input
                  type="number"
                  {...register(`accountEntries.${index}.escalations`)}
                  placeholder="0"
                  min={0}
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField
                  name={`accountEntries.${index}.entryNotes`}
                  label="Notes"
                >
                  <Textarea
                    {...register(`accountEntries.${index}.entryNotes`)}
                    placeholder="Notes about this client"
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
            append({
              client: "",
              clientCallsDone: undefined,
              issuesResolved: undefined,
              deliverablesCoordinated: undefined,
              escalations: undefined,
              entryNotes: "",
            })
          }
        >
          <Plus className="size-4 mr-1" />
          Add Client Entry
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
