# 📝 Forms & Validation — FastCashierFE

Complete reference for form handling patterns using React Hook Form, Zod schemas, and Shadcn UI form components.

---

## 🛠️ Tools & Versions

| Tool | Package | Version |
| :--- | :--- | :--- |
| **Form State** | `react-hook-form` | ^7.71.1 |
| **Schema Validation** | `zod` | ^4.3.5 |
| **Integration Bridge** | `@hookform/resolvers` | ^5.2.2 |
| **UI Components** | Shadcn Form (Radix-based), `src/components/ui/form.tsx` | — |

---

## 📋 Existing Schemas (`src/schemas/`)

### `auth.schema.ts`

| Schema | Export | Key Validations |
| :--- | :--- | :--- |
| Login | `loginSchema` | `email` (valid format), `password` min 6 chars |
| Create User | `createUserSchema` | `fullName` min 3, `email`, `password` + `confirmPassword` match (cross-field `refine`), `roleId` must be ≥ 1 |
| Update User | `updateUserSchema` | All fields optional: `fullName`, `email`, `phone` max 20, `roleId`, `isActive` |

**Inferred types**: `LoginFormValues`, `CreateUserFormValues`, `UpdateUserFormValues`.

### `products.schema.ts`

| Schema | Export | Key Validations |
| :--- | :--- | :--- |
| Create Product | `createProductSchema` | `code` min 3, `name` min 3, `price` positive number, `description` min 3, `image` optional File (max 20MB, JPG/PNG/WEBP), `isActive` boolean, `idCategory` required ≥ 1 (cross-field `refine`) |
| Update Product | `updateProductSchema` | All fields optional; adds `imageUrl` (URL or empty string) for clearing existing image |

**Inferred types**: `CreateProductFormValues`, `UpdateProductFormValues`.

---

## 📋 Implementation Pattern

### 1. Schema Definition
```typescript
// src/schemas/my-feature.schema.ts
import * as z from 'zod';

export const mySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').min(3, 'Mínimo 3 caracteres'),
  amount: z.number().positive('Debe ser mayor a 0'),
  roleId: z.number().optional(),
}).refine((data) => data.roleId !== undefined, {
  message: 'Debe seleccionar un rol',
  path: ['roleId'],
});

export type MyFormValues = z.infer<typeof mySchema>;
```

### 2. Form Hook Setup
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mySchema, type MyFormValues } from '@/schemas/my-feature.schema';

const form = useForm<MyFormValues>({
  resolver: zodResolver(mySchema),
  defaultValues: {
    name: '',
    amount: 0,
  },
});
```

### 3. File / Image Fields
For schemas with `File` input (like product image), note that HTML inputs deliver `FileList`, not `File`. Use a custom `onChange` handler:
```tsx
<Input
  type="file"
  accept="image/jpeg,image/png,image/webp"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) form.setValue('image', file, { shouldValidate: true });
  }}
/>
```

### 4. UI Integration — Shadcn Form Components
Always use the Shadcn Form wrapper components from `src/components/ui/form.tsx`:
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          <FormControl>
            <Input placeholder="Ingresa el nombre" {...field} />
          </FormControl>
          <FormMessage /> {/* Shows Zod error automatically */}
        </FormItem>
      )}
    />
  </form>
</Form>
```

### 5. Submit Handler & Mutation Integration
```typescript
const createMutation = useCreateSomething();

const onSubmit = async (data: MyFormValues) => {
  try {
    await createMutation.mutateAsync(data);
    form.reset(); // Reset after success
    onClose?.();   // Close dialog if applicable
  } catch {
    // Errors are handled in the hook's onError (toast), no need to duplicate
  }
};
```

---

## ✅ Active Best Practices

### Error Messaging
- Write messages in **Spanish** — the app is fully localized for Spanish speakers.
- Be **specific**: prefer `'Debe seleccionar un rol'` over `'Campo requerido'`.
- For cross-field validations, always specify the `path` in `refine()` so the error appears on the correct field.

### Form State Guards
```typescript
// Don't allow closing a dialog if the user has unsaved changes
const handleClose = () => {
  if (form.formState.isDirty) {
    // Show confirmation or block close
    return;
  }
  onClose();
};
```

### Pending / Loading States
```tsx
// Disable submit button while mutation is pending
<Button type="submit" disabled={createMutation.isPending}>
  {createMutation.isPending ? 'Guardando...' : 'Guardar'}
</Button>
```

### Reset on Open
When using forms inside Dialogs that can open/reopen with different data:
```typescript
useEffect(() => {
  if (isOpen) {
    form.reset(initialData ? mapEntityToFormValues(initialData) : defaultValues);
  }
}, [isOpen, initialData]);
```

### Numeric Field Handling
RHF defaults to string values for inputs. For numeric Zod schemas, use the `valueAsNumber` option:
```tsx
<Input
  type="number"
  {...form.register('price', { valueAsNumber: true })}
/>
```

---

## 📊 Forms That Use Controlled State (No Zod Schema)

Some forms use controlled `useState` instead of React Hook Form + Zod, typically for simpler flows:

| Form | File | Validation Method |
| :--- | :--- | :--- |
| `CloseSessionDialog` | `cashier/CloseSessionDialog.tsx` | Manual validation (`!closingCash || isNaN(...)`) |
| `OpenRegisterForm` | `cashier/OpenRegisterForm.tsx` | Inline Zod in component |
| `CancelOrder` dialog | Within order components | Basic validation |
| `OrderSummary` (create order) | `cashier/OrderSummary.tsx` | Inline logic |

---

## 🚧 What Doesn't Have a Schema Yet (Add Before Implementing)

The following forms exist in the UI but their validation logic lives inline or needs a dedicated schema file:

| Form | Current Status | Recommended Action |
| :--- | :--- | :--- |
| `OpenRegisterForm` | Inline Zod in component | Extract to `sessions.schema.ts` |
| `CloseSessionDialog` | Manual `useState` + `isNaN` checks | Extract to `sessions.schema.ts` with `closingCashAmount`, `closingQrAmount`, `observations` fields |
| `CancelOrder` dialog | Basic validation | Add reason length constraints |
| `OrderSummary` (create order) | Inline logic | Extract `createOrderSchema` to `schemas/` |

> **Rule**: Before implementing any new form, create its Zod schema in `src/schemas/` first and export the inferred type. Never validate inline in the component.
