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