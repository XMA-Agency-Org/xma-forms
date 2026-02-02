import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const fileSchema = z.instanceof(File).refine(f => f.size <= MAX_FILE_SIZE, "File must be under 10MB");

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

const baseCustomerSchema = z.object({
  primaryContactPerson: z.string().min(1, "Primary contact person is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  secondaryContactPerson: z.string().optional(),
  alternatePhone: z.string().optional(),
  billingAddress: addressSchema,
  shippingAddressSameAsBilling: z.boolean().default(true),
  shippingAddress: addressSchema.optional(),
  trnVat: z.string().min(1, "TRN/VAT number is required"),
  vatRegistrationCertificate: fileSchema,
  preferredCommunicationMethod: z.enum(["email", "phone", "whatsapp"]).optional(),
  supportingDocuments: z.array(fileSchema).optional(),
});

const individualCustomerSchema = baseCustomerSchema.extend({
  customerType: z.literal("individual"),
  fullName: z.string().min(1, "Full name is required"),
  nationalIdNumber: z.string().min(1, "National ID number is required"),
  industryType: z.string().optional(),
});

const companyCustomerSchema = baseCustomerSchema.extend({
  customerType: z.literal("company"),
  companyName: z.string().min(1, "Company name is required"),
  companyRegistrationNumber: z.string().min(1, "Company registration number is required"),
  industryType: z.string().optional(),
  companySize: z.string().optional(),
});

export const customerSchema = z.discriminatedUnion("customerType", [
  individualCustomerSchema,
  companyCustomerSchema,
]);
