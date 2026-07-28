import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/api/authService';
import { useAuthStore } from '@/store/authStore';
import type { LoginCredentials } from '@/types/auth';

export const useLogin = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    retry: false,
    onSuccess: (auth) => {
      // Evita reutilizar datos de React Query que pertenezcan a otra sesión.
      queryClient.removeQueries();
      setSession(auth);
    },
  });
};
