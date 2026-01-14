import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axiosConfig';

// Hook de prueba para verificar que React Query funciona
export const useTest = () => {
  return useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      console.log('React Query está haciendo una petición!');
      const { data } = await api.get('/products');
      console.log('Datos recibidos:', data);
      return data;
    },
  });
};