# 📝 Forms & Validation

This project uses a robust system for handling user input and data integrity.

## 🛠️ Tools
- **React Hook Form (RHF)**: For form state and lifecycle management.
- **Zod**: For schema definition and validation.
- **@hookform/resolvers**: To bridge Zod and RHF.

## 📋 Implementation Pattern

### 1. Schema Definition
Schemas are located in `src/schemas/`.
```typescript
export const mySchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().positive(),
});
```

### 2. Form Component
Always use the `useForm` hook with the Zod resolver.
```tsx
const form = useForm<Type>({
  resolver: zodResolver(mySchema),
  defaultValues: { ... }
});

const onSubmit = (data: Type) => {
  // Logic
};
```

### 3. UI Integration
Use Shadcn UI's Form components (`FormField`, `FormItem`, `FormLabel`, `FormControl`) to maintain consistent styling and error display.

## ✅ Best Practices
- **Self-Documenting Errors**: Write clear, user-friendly error messages in the Zod schema.
- **Dirty State**: Check `form.formState.isDirty` before allowing submission or closing dialogs.
- **Async Validation**: Use TanStack Query success/error callbacks to sync form state with API results.
