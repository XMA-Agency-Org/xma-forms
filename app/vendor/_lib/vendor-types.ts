import type { z } from "zod";
import type { vendorSchema } from "./vendor-schema";

export type VendorFormData = z.infer<typeof vendorSchema>;
