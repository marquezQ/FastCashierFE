import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axiosConfig';
import type { UserWithRole } from '@/types/auth';

// Tipos para las mutaciones
interface CreateUserData {
  fullName: string;
  email: string;
  phone: string;
  roleId: number;
  password: string;
}

interface UpdateUserData {
  fullName?: string;
  email?: string;
  phone?: string;
  roleId?: number;
}

// Hook para crear usuario
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const { data } = await api.post<UserWithRole>('/users', userData);
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
      const { data: updatedUser } = await api.put<UserWithRole>(`/users/${id}`, data);
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
