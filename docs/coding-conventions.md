# Coding Conventions

## File Structure

Follow locality of behavior. Feature-specific code lives inside each route directory using underscore-prefixed folders:

```
app/
  employee/
    _components/    # Components specific to the employee form
    _lib/           # Schema, types, utils for this route
    page.tsx
  customer/
    _components/
    _lib/
    page.tsx
  vendor/
    _components/
    _lib/
    page.tsx
components/         # Shared across all routes
  ui/               # Primitive design system components
  form/             # Reusable form composites
  layout/           # Layout components
lib/                # Shared utilities (cn, axios instance, etc.)
```

Only truly shared code (design system primitives, layout, providers, utilities) belongs in root-level directories.

## Naming

| Context              | Convention  | Example                     |
| -------------------- | ----------- | --------------------------- |
| Files and folders    | kebab-case  | `file-upload-zone.tsx`      |
| Components           | PascalCase  | `FileUploadZone`            |
| Functions/variables  | camelCase   | `handleFileChange`          |
| Types/interfaces     | PascalCase  | `EmployeeFormData`          |
| Schema variables     | camelCase   | `employeeFormSchema`        |

## Code Style

- **No comments.** Use expressive function and variable names to convey intent.
- **oklch only.** Never use hex or rgb color values anywhere in the codebase.
- **bun only.** Use `bun` for all package management and script execution. Never use `npm`.

## Component Authoring

- **CVA (class-variance-authority)** for all primitive components. Every primitive defines its variants through `cva()`.
- **cn() utility** for className merging. Combines `clsx` and `tailwind-merge` to handle conditional classes and Tailwind conflicts:

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- **Componentize aggressively.** Pages should be short and composed of smaller components. No long page files.

## Form Patterns

- **Zod** for all validation schemas. Derive TypeScript types with `z.infer<typeof schema>`.
- **react-hook-form** with `zodResolver` for form state management.
- **FormProvider pattern**: wrap forms with `<FormProvider>` and access state in child components via `useFormContext()`. This avoids prop drilling of register/errors/control.

```tsx
const methods = useForm<EmployeeFormData>({
  resolver: zodResolver(employeeFormSchema),
});

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <PersonalInfoSection />
    <EmploymentSection />
    <FormActions />
  </form>
</FormProvider>
```

## API Calls

- **axios only.** Never use the native `fetch` API.
- Form submissions send `FormData` (JSON data + file attachments) via `axios.post`.

## Icons

- **lucide-react** is the sole icon library. Import individual icons to keep bundles small.
