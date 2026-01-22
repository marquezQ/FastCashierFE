import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axiosConfig';
import type { UserWithRole } from '@/types/auth';

export const useUsers = () => {
  return useQuery<UserWithRole[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<UserWithRole[]>('/users');
      return data;
    },
  });
};
