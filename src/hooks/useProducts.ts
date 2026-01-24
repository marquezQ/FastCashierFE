import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axiosConfig';
import type { ProductsGroupedByCategory } from '@/types/products';

export const useProducts = () => {
  return useQuery<ProductsGroupedByCategory>({
    queryKey: ['products', 'grouped-by-category'],
    queryFn: async () => {
      const { data } = await api.get<ProductsGroupedByCategory>('/products/grouped-by-category');
      return data;
    },
  });
};
