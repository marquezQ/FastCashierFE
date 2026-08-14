import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axiosConfig';
import type { Product } from '@/types/products';

interface CreateProductData {
  name: string;
  price: number;
  description: string;
  idCategory: number;
  image?: File;
  isActive: boolean;
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: CreateProductData) => {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('price', productData.price.toString());
      formData.append('description', productData.description);
      formData.append('idCategory', productData.idCategory.toString());
      formData.append('isActive', productData.isActive.toString());

      if (productData.image) {
        formData.append('image', productData.image);
      }

      const { data } = await api.post<Product>('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

interface UpdateProductData {
  name?: string;
  price?: number;
  description?: string;
  idCategory?: number;
  image?: File;
  imageUrl?: string;
  isActive?: boolean;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProductData }) => {
      // Si hay una imagen (File), usar FormData
      if (data.image) {
        const formData = new FormData();

        if (data.name !== undefined) formData.append('name', data.name);
        if (data.price !== undefined) formData.append('price', data.price.toString());
        if (data.description !== undefined) formData.append('description', data.description);
        if (data.idCategory !== undefined) formData.append('idCategory', data.idCategory.toString());
        if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
        formData.append('image', data.image);

        const { data: updatedProduct } = await api.patch<Product>(`/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return updatedProduct;
      }

      // Si no hay imagen, usar JSON normal
      const { data: updatedProduct } = await api.patch<Product>(`/products/${id}`, data);
      return updatedProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
