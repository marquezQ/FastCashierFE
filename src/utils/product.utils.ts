import type { Product } from '@/types/products';

// URL de imagen placeholder para productos sin imagen
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop';

export const getProductImageUrl = (product: Product): string => {
  return product.imageUrl || PLACEHOLDER_IMAGE;
};

export const formatPrice = (price: string): string => {
  const numPrice = parseFloat(price);
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(numPrice);
};
