import { QueryClient } from '@tanstack/react-query';
//comportamiento global de React Query

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos"
      // Durante este tiempo, NO se refetch automáticamente
      staleTime: 1000 * 60 * 5, // 5 minutos
      // Tiempo que los datos permanecen en cache DESPUÉS de no usarse
      gcTime: 1000 * 60 * 10, // 10 minutos
      // Refetch cuando el usuario vuelve a la pestaña
      refetchOnWindowFocus: true,
      // Refetch cuando se recupera la conexión a internet
      refetchOnReconnect: true,
      // Cuántas veces reintentar si falla una petición
      retry: 1,
      // Tiempo de espera entre reintentos (en milisegundos)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    
    mutations: {
      retry: 0,
    },
  },
});