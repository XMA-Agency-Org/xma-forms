"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "../_lib/report-schema";

export function VideoEditorSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "editingEntries",
  });

  const entryErrors = errors.editingEntries as
    | Record<string, Record<string, { message?: string }>>
    | undefined;

  return (
    <FormSection
      title="Video Editing"
      description="Add an entry for each client you edited for today"
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
                name={`editingEntries.${index}.client`}
                label="Client"
                required
              >
                <Input
                  {...register(`editingEntries.${index}.client`)}
                  placeholder="Client name"
                  list="client-suggestions"
                  variant={
                    entryErrors?.[index]?.client ? "error" : "default"
                  }
                />
              </FormField>

              <FormField
                name={`editingEntries.${index}.videosEdited`}
                label="Videos Edited"
                required
              >
                <Input
                  type="number"
                  {...register(`editingEntries.${index}.videosEdited`)}
                  placeholder="0"
                  min={0}
                  variant={
                    entryErrors?.[index]?.videosEdited ? "error" : "default"
                  }
                />
              </FormField>

              <FormField
                name={`editingEntries.${index}.cutsMade`}
                label="Cuts Made"
              >
                <Input
                  type="number"
                  {...register(`editingEntries.${index}.cutsMade`)}
                  placeholder="0"
                  min={0}
                />
              </FormField>

              <FormField
                name={`editingEntries.${index}.editorRevisionsCompleted`}
                label="Revisions Completed"
              >
                <Input
                  type="number"
                  {...register(
                    `editingEntries.${index}.editorRevisionsCompleted`
                  )}
                  placeholder="0"
                  min={0}
                />
              </FormField>

              <FormField
                name={`editingEntries.${index}.pendingRevisions`}
                label="Pending Revisions"
              >
                <Input
                  type="number"
                  {...register(`editingEntries.${index}.pendingRevisions`)}
                  placeholder="0"
                  min={0}
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField
                  name={`editingEntries.${index}.entryNotes`}
                  label="Notes"
                >
                  <Textarea
                    {...register(`editingEntries.${index}.entryNotes`)}
                    placeholder="Notes about this editing task"
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
            append({ client: "", videosEdited: 0, cutsMade: undefined, editorRevisionsCompleted: undefined, pendingRevisions: undefined })
          }
        >
          <Plus className="size-4 mr-1" />
          Add Editing Entry
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
