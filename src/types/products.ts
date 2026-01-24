// ============================================
// TIPOS PARA PRODUCTOS
// ============================================

export interface Product {
  idProduct: number;
  code: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  idCategory: number;
  name: string;
  description: string;
  imageUrl: string | null;
  order: number;
  productCount: number;
  products: Product[];
}

export type ProductsGroupedByCategory = Category[];
