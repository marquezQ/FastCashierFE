import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api/axiosConfig';
import type { User, RoleName, LoginCredentials, AuthResponse } from '../types/auth';
import { getRoleById } from '../constants/roles';

// ============================================
// STORE DE AUTENTICACIÓN
// ============================================
// Simple: Estado + acciones básicas

interface AuthStore {
  // Estado
  user: User | null;
  token: string | null;
  role: RoleName | null;
  isAuthenticated: boolean;
  
  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      // Login
      login: async (credentials) => {
        try {
          // Llamar al backend
          const { data } = await api.post<AuthResponse>('/auth/login', credentials);
          
          // Obtener el rol
          const roleData = getRoleById(data.user.roleId);
          
          if (!roleData) {
            throw new Error('Rol inválido');
          }
          
          // Guardar token en localStorage
          localStorage.setItem('token', data.access_token);
          
          // Actualizar estado
          set({
            user: data.user,
            token: data.access_token,
            role: roleData.name as RoleName,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error en login:', error);
          throw error;
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cashier-storage'); // Clear persisted cashier session
        
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);