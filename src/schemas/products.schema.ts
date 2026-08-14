import * as z from 'zod';

// ============================================
// SCHEMA PARA CREAR PRODUCTO
// ============================================

export const createProductSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre es requerido')
      .min(3, 'El nombre debe tener al menos 3 caracteres'),
    price: z
      .number()
      .positive('El precio debe ser mayor a 0')
      .min(0.01, 'El precio debe ser mayor a 0'),
    description: z
      .string()
      .min(1, 'La descripción es requerida')
      .min(3, 'La descripción debe tener al menos 3 caracteres'),
    idCategory: z.number().optional(),
    image: z
      .instanceof(File, { message: 'Debe seleccionar una imagen' })
      .refine((file) => file.size <= 20 * 1024 * 1024, {
        message: 'La imagen no debe exceder 20MB',
      })
      .refine(
        (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
        {
          message: 'La imagen debe ser JPG, PNG o WEBP',
        }
      )
      .optional(),
    isActive: z.boolean(),
  })
  .refine((data) => data.idCategory !== undefined && data.idCategory >= 1, {
    message: 'Debe seleccionar una categoría',
    path: ['idCategory'],
  });

export type CreateProductFormValues = z.infer<typeof createProductSchema>;

// ============================================
// SCHEMA PARA ACTUALIZAR PRODUCTO
// ============================================

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .optional(),
  price: z
    .number()
    .positive('El precio debe ser mayor a 0')
    .min(0.01, 'El precio debe ser mayor a 0')
    .optional(),
  description: z
    .string()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .optional(),
  idCategory: z.number().min(1, 'Debe seleccionar una categoría').optional(),
  image: z
    .instanceof(File, { message: 'Debe seleccionar una imagen' })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: 'La imagen no debe exceder 20MB',
    })
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      {
        message: 'La imagen debe ser JPG, PNG o WEBP',
      }
    )
    .optional(),
  imageUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
