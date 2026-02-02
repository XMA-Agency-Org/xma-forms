import type { z } from "zod";
import type { customerSchema } from "./customer-schema";

export type CustomerFormData = z.infer<typeof customerSchema>;
