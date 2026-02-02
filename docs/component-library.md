# Component Library

## UI Primitives (`components/ui/`)

All primitives are built with CVA for variant management and accept a `className` prop for composition via `cn()`.

### Button

Interactive button element with multiple visual styles.

| Prop    | Options                                     | Default   |
| ------- | ------------------------------------------- | --------- |
| variant | `default`, `outline`, `ghost`, `destructive`| `default` |
| size    | `sm`, `md`, `lg`                            | `md`      |

Renders as a `<button>` element. Forwards all native button props.

### Input

Text input field with error state support.

| Prop    | Options            | Default   |
| ------- | ------------------ | --------- |
| variant | `default`, `error` | `default` |
| size    | `sm`, `md`, `lg`   | `md`      |

Forwards all native input props via `React.forwardRef` for react-hook-form compatibility.

### Textarea

Multi-line text input. Same variant/size API as Input. Auto-forwards native textarea props.

### Select

Dropdown selection input. Same variant/size API as Input. Renders a native `<select>` element wrapping `<option>` children.

### Checkbox

Boolean toggle input. Renders a styled `<input type="checkbox">` with a label slot.

### RadioGroup + RadioGroupItem

Grouped radio selection. `RadioGroup` provides the grouping context; `RadioGroupItem` renders each option with a label.

### Label

Text label for form fields.

| Prop     | Options          | Default   |
| -------- | ---------------- | --------- |
| required | `true`, `false`  | `false`   |

When `required` is true, renders a red asterisk indicator after the label text.

### Link

Wrapper around `next/link`. Provides consistent styling and accepts all Next.js Link props.

### Badge

Small status indicator pill.

| Prop    | Options                                 | Default   |
| ------- | --------------------------------------- | --------- |
| variant | `default`, `success`, `warning`, `error`| `default` |

### Separator

Visual divider line.

| Prop        | Options                      | Default      |
| ----------- | ---------------------------- | ------------ |
| orientation | `horizontal`, `vertical`     | `horizontal` |

---

## Form Composites (`components/form/`)

Higher-level components that combine UI primitives with form logic.

### FormField

Connects a label, an input slot, and an error message to react-hook-form state.

- Uses `useFormContext()` to read field errors automatically
- Props: `name` (field path), `label`, `required`, `children` (the input element)
- Renders Label above children, error message below when validation fails

### FileUploadZone

Drag-and-drop file upload area with validation and preview.

- Accepts `allowedTypes` (MIME strings), `maxSizeInMB`, and `name` (form field path)
- Integrates with react-hook-form via `Controller`
- Displays file type and size validation errors inline
- Shows filename and preview thumbnail after selection
- Supports both click-to-browse and drag-and-drop

### FormSection

Card-based wrapper that groups related form fields.

- Props: `title`, `description`, `children`
- Renders a SectionCard with a heading and a responsive 2-column grid layout for its children

### FormActions

Standardized form footer with submit and reset buttons.

- Renders a submit Button (default variant) and a reset Button (ghost variant)
- Handles loading state on the submit button during form submission

---

## Layout Components (`components/layout/`)

### PageContainer

Centered content wrapper.

- Applies `max-w-3xl`, horizontal centering, and vertical padding
- Used as the outermost wrapper in each form page

### SectionCard

Card wrapper for grouping content.

- Applies card background, border, border-radius (lg), and padding
- Used by FormSection and standalone content blocks

### PageHeader

Page title area with navigation.

- Props: `title`, `description`, `backHref` (optional)
- Renders an h1 heading, a description paragraph, and an optional back-navigation Link
