import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/axiosConfig';
import type { ChangePasswordFormValues } from '@/schemas/auth.schema';

interface ChangePasswordResponse {
  message: string;
}

export const useChangePassword = () => {
  return useMutation<
    ChangePasswordResponse,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    Omit<ChangePasswordFormValues, 'confirmPassword'>
  >({
    mutationFn: async (payload) => {
      const { data } = await api.patch<ChangePasswordResponse>(
        '/auth/change-password',
        payload
      );
      return data;
    },
  });
};
