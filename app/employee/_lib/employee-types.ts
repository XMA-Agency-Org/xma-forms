import type { z } from "zod";
import type { employeeSchema } from "./employee-schema";

export type EmployeeFormData = z.infer<typeof employeeSchema>;
