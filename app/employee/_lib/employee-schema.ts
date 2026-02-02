import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const fileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_FILE_SIZE, "File must be under 10MB");

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

export const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  preferredName: z.string().optional(),
  dateOfBirth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
  passportNumber: z.string().min(1, "Passport number is required"),
  passportFront: fileSchema,
  passportBack: fileSchema,
  profilePhoto: fileSchema.optional(),

  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  secondaryPhone: z.string().optional(),
  residentialAddress: addressSchema,

  employmentType: z.enum(["full-time", "part-time", "contract"]),
  jobTitle: z.string().min(1, "Job title is required"),
  startDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
  taxIdentificationNumber: z.string().optional(),

  bankName: z.string().min(1, "Bank name is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  accountNumberIban: z.string().min(1, "Account number/IBAN is required"),
  swiftCode: z.string().min(1, "SWIFT code is required"),

  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(1, "Emergency contact phone is required"),
  }),

  maritalStatus: z.string().optional(),
  numberOfDependents: z.string().optional(),
  medicalInformation: z.string().optional(),
  certifications: z.array(fileSchema).optional(),
  previousEmploymentDocs: z.array(fileSchema).optional(),
});
