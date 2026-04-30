import { z } from 'zod';

export const displayConfigSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Nombre muy largo'),
  categoryId: z.number().nullable().optional(),
  rotationInterval: z
    .number({
      message: 'Debe ser un número (Min. 3)',
    })
    .min(3, 'Mínimo 3 segundos')
    .max(60, 'Máximo 60 segundos'),
  transitionType: z.enum(['slide', 'fade', 'zoom']),
  showPrices: z.boolean(),
  showDescriptions: z.boolean(),
  productsPerSlide: z
    .number({
      message: 'Debe ser un número (Min. 1)',
    })
    .min(1, 'Mínimo 1 producto')
    .max(6, 'Máximo 6 productos'),
  isActive: z.boolean(),
});

export type DisplayConfigFormValues = z.infer<typeof displayConfigSchema>;

export const DEFAULT_DISPLAY_VALUES: DisplayConfigFormValues = {
  name: '',
  categoryId: null,
  rotationInterval: 8,
  transitionType: 'slide',
  showPrices: true,
  showDescriptions: true,
  productsPerSlide: 3,
  isActive: true,
};
