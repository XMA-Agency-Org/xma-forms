# Forms Architecture

## Overview

The application provides three internal forms for collecting structured data with file attachments. Each form follows the same architectural pattern.

| Form     | Route       | Purpose                    |
| -------- | ----------- | -------------------------- |
| Employee | `/employee` | Employee onboarding data   |
| Customer | `/customer` | Customer intake data       |
| Vendor   | `/vendor`   | Vendor registration data   |

## Route Structure

Each form route follows locality of behavior:

```
app/{form-type}/
  _lib/
    schema.ts       # Zod validation schema + inferred TypeScript type
    types.ts        # Additional types if needed
  _components/
    {form-type}-form.tsx          # FormProvider wrapper + submission handler
    {section-name}-section.tsx    # Individual form sections using useFormContext
  page.tsx                        # Page component composing the form
```

## Validation

### Schema Definition

Each form has a Zod schema in `_lib/schema.ts`. Types are derived directly from the schema:

```tsx
const employeeFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address"),
  // ...
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;
```

### Client-Side Validation

react-hook-form handles validation via `zodResolver`:

```tsx
const methods = useForm<EmployeeFormData>({
  resolver: zodResolver(employeeFormSchema),
});
```

Validation runs on submit. Field-level errors propagate to FormField components through `useFormContext`.

### Customer Form Discriminated Union

The customer form uses a discriminated union on `customerType` to conditionally require different fields:

```tsx
const customerFormSchema = z.discriminatedUnion("customerType", [
  z.object({
    customerType: z.literal("individual"),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    // individual-specific fields
  }),
  z.object({
    customerType: z.literal("company"),
    companyName: z.string().min(1),
    contactPerson: z.string().min(1),
    // company-specific fields
  }),
]);
```

The form UI conditionally renders sections based on the watched `customerType` value.

## File Handling

File uploads use the `FileUploadZone` component integrated with react-hook-form's `Controller`:

- Drag-and-drop or click-to-browse interaction
- Client-side validation of file type (MIME) and file size (MB limit)
- Preview display after file selection
- Files are held in form state and appended to FormData on submission

## Submission Flow

```
Client                          Server                         External
  |                               |                               |
  |  1. User clicks submit        |                               |
  |  2. Zod validates all fields  |                               |
  |  3. Build FormData object     |                               |
  |     - JSON data blob          |                               |
  |     - File attachments        |                               |
  |  4. POST /api/submit/{type}   |                               |
  |  --------------------------->  |                               |
  |                               |  5. Parse FormData             |
  |                               |  6. Build formatted HTML email |
  |                               |  7. Send via Resend API        |
  |                               |  -----------------------------> |
  |                               |                               |  8. Deliver to
  |                               |                               |     admin@xmaagency.com
  |                               |  <----------------------------- |
  |                               |  9. Return JSON response       |
  |  <---------------------------  |                               |
  | 10. Show success/error state   |                               |
```

### API Route Handler

Each form type has a corresponding API route at `app/api/submit/{type}/route.ts`:

1. Parses the incoming `FormData` (extracts JSON data and file attachments)
2. Constructs a formatted HTML email with the submitted data
3. Sends the email via the Resend SDK to `admin@xmaagency.com`
4. Returns a JSON response indicating success or failure

### HTTP Client

All client-side API calls use axios:

```tsx
const formData = new FormData();
formData.append("data", JSON.stringify(validatedData));
formData.append("attachment", fileValue);

await axios.post(`/api/submit/${formType}`, formData);
```

## Environment Variables

| Variable       | Purpose                  | Required |
| -------------- | ------------------------ | -------- |
| RESEND_API_KEY | Resend API key for email | Yes      |
