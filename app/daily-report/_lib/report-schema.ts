import { z } from "zod";
import type { EmployeeRole } from "./report-types";

const PROJECTS = ["Client A", "Client B", "Internal", "Other"] as const;

const YES_NO = ["Yes", "No"] as const;

export { PROJECTS, YES_NO };

const coreBaseSchema = z.object({
  date: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
  notes: z.string().optional(),
});

export const videoEditingEntrySchema = z.object({
  client: z.string().min(1, "Client is required"),
  videosEdited: z.coerce.number().min(0, "Videos edited is required"),
  cutsMade: z.coerce.number().min(0).optional(),
  editorRevisionsCompleted: z.coerce.number().min(0).optional(),
  pendingRevisions: z.coerce.number().min(0).optional(),
  entryNotes: z.string().optional(),
});

export const videoEditorSchema = z.object({
  editingEntries: z
    .array(videoEditingEntrySchema)
    .min(1, "Add at least one editing entry"),
});

export const videographyEntrySchema = z.object({
  client: z.string().min(1, "Client is required"),
  shootDescription: z.string().min(1, "Shoot description is required"),
  videosCaptured: z.coerce.number().min(0, "Videos captured is required"),
  entryNotes: z.string().optional(),
});

export const videographerSchema = z.object({
  shootEntries: z
    .array(videographyEntrySchema)
    .min(1, "Add at least one shoot entry"),
});

export const scriptWriterSchema = z.object({
  scriptsWritten: z.coerce.number().min(0, "Scripts written is required"),
  scriptsRevised: z.coerce.number().min(0).optional(),
  avgScriptLength: z.string().optional(),
  scriptsApproved: z.coerce.number().min(0).optional(),
});

export const accountManagerEntrySchema = z.object({
  client: z.string().min(1, "Client is required"),
  clientCallsDone: z.coerce.number().min(0).optional(),
  issuesResolved: z.coerce.number().min(0).optional(),
  deliverablesCoordinated: z.coerce.number().min(0).optional(),
  escalations: z.coerce.number().min(0).optional(),
  entryNotes: z.string().optional(),
});

export const accountManagerSchema = z.object({
  accountEntries: z
    .array(accountManagerEntrySchema)
    .min(1, "Add at least one client entry"),
});

export const graphicDesignerSchema = z.object({
  creativesProduced: z.coerce
    .number()
    .min(0, "Creatives produced is required"),
  thumbnailsDesigned: z.coerce.number().min(0).optional(),
  designRevisionsCompleted: z.coerce.number().min(0).optional(),
  newConceptsDeveloped: z.coerce.number().min(0).optional(),
});

export const salesmanSchema = z.object({
  outreaches: z.coerce.number().min(0, "Outreaches is required"),
  appointmentsSet: z.coerce.number().min(0, "Appointments set is required"),
});

const roleSchemaMap: Record<EmployeeRole, z.ZodObject<z.ZodRawShape>> = {
  "video-editor": videoEditorSchema as unknown as z.ZodObject<z.ZodRawShape>,
  videographer: videographerSchema as unknown as z.ZodObject<z.ZodRawShape>,
  "script-writer": scriptWriterSchema as unknown as z.ZodObject<z.ZodRawShape>,
  "account-manager": accountManagerSchema as unknown as z.ZodObject<z.ZodRawShape>,
  "graphic-designer": graphicDesignerSchema as unknown as z.ZodObject<z.ZodRawShape>,
  salesman: salesmanSchema as unknown as z.ZodObject<z.ZodRawShape>,
};

export function composeSchema(roles: EmployeeRole[]) {
  let shape = { ...coreBaseSchema.shape };

  for (const role of roles) {
    const roleSchema = roleSchemaMap[role];
    shape = { ...shape, ...roleSchema.shape };
  }

  return z.object(shape);
}
