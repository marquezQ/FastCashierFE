import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, User } from '../types/auth';
import { getRoleById } from '../constants/roles';

// ============================================
// STORE DE AUTENTICACIÓN
// ============================================
// Simple: Estado + acciones básicas

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;

  setSession: (auth: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setSession: ({ user, access_token }) => {
        if (!getRoleById(user.roleId)) {
          throw new Error('Rol inválido');
        }

        // Axios lee el token desde esta única ubicación persistida.
        localStorage.setItem('token', access_token);

        set({
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cashier-storage');

        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: ({ user, isAuthenticated }) => ({ user, isAuthenticated }),
    }
  )
);