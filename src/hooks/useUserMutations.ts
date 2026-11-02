import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axiosConfig';
import type { UserWithRole } from '@/types/auth';
import { getApiErrorMessage } from '@/utils/error-handlers';
import { toast } from 'sonner';

// Tipos para las mutaciones
interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
}

interface UpdateUserData {
  fullName?: string;
  email?: string;
  phone?: string;
  roleId?: number;
  isActive?: boolean;
}

// Hook para crear usuario
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const { data } = await api.post<UserWithRole>('/auth/register', userData);
      return data;
    },
    onSuccess: () => {
      // Invalidar y refrescar la lista de usuarios
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Hook para actualizar usuario
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserData }) => {
      const { data: updatedUser } = await api.patch<UserWithRole>(`/users/${id}`, data);
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Hook para eliminar usuario
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Hook para restablecer la contraseña de un usuario a la predeterminada
export const useResetUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch<{ message: string }>(`/users/${id}/reset-password`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Contraseña restablecida a 123456');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Error al restablecer la contraseña'));
    },
  });
};

// Hook para activar/desactivar usuario
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const { data } = await api.patch<UserWithRole>(`/users/${id}/status`, { isActive });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
