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

export const vendorSchema = z.object({
  vendorName: z.string().min(1, "Vendor name is required"),
  taxIdentificationVatNumber: z
    .string()
    .min(1, "Tax ID / VAT number is required"),
  businessRegistrationNumber: z
    .string()
    .min(1, "Business registration number is required"),

  contactPersonName: z.string().min(1, "Contact person name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  secondaryContactPerson: z.string().optional(),
  alternateContactDetails: z.string().optional(),
  businessAddress: addressSchema,

  bankName: z.string().min(1, "Bank name is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  accountNumberIban: z.string().min(1, "Account number/IBAN is required"),
  swiftCode: z.string().min(1, "SWIFT code is required"),

  vatRegistrationCertificate: fileSchema,
  complianceDocuments: z.array(fileSchema).optional(),

  yearsInOperation: z.string().optional(),
  references: z.string().optional(),
  preferredPaymentMethod: z
    .enum(["bank-transfer", "cheque", "cash", "other"])
    .optional(),
  notesAdditionalComments: z.string().optional(),
});
