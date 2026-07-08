import * as z from 'zod';

export const loginSchema = z.object({
  email: z
    .email('Correo electrónico inválido'),
  password: z
  .string()
  .min(1, 'La contraseña es requerida')
  .min(6, 'La contraseña debe tener al menos 6 caracteres'),

});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ============================================
// SCHEMA PARA CREAR USUARIO
// ============================================

export const createUserSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'El nombre completo es requerido')
      .min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z
      .string()
      .min(1, 'El correo electrónico es requerido')
      .email('Correo electrónico inválido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Debes confirmar la contraseña'),
    roleId: z.number().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
  .refine((data) => data.roleId !== undefined && data.roleId >= 1, {
    message: 'Debe seleccionar un rol',
    path: ['roleId'],
  });

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

// ============================================
// SCHEMA PARA ACTUALIZAR USUARIO
// ============================================

export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .optional(),
  email: z
    .string()
    .email('Correo electrónico inválido')
    .optional(),
  phone: z
    .string()
    .max(20, 'El teléfono no puede tener más de 20 caracteres')
    .optional(),
  roleId: z.number().min(1, 'Debe seleccionar un rol').optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

// ============================================
// SCHEMA PARA CAMBIAR CONTRASEÑA
// ============================================

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(1, 'La nueva contraseña es requerida')
      .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Debes confirmar la nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;