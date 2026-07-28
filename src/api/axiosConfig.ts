import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar token automáticamente a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Manejar token expirado (SOLO para rutas protegidas)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir al login si:
    // 1. Es un 401
    // 2. NO es la ruta de login (para permitir mostrar errores de credenciales)
    // 3. El usuario ya tenía un token (estaba autenticado)
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    const hadToken = !!localStorage.getItem('token');

    if (error.response?.status === 401 && !isLoginRequest && hadToken) {
      // Delegar la limpieza al store de Zustand
      useAuthStore.getState().logout();
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);