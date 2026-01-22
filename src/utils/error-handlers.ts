import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export const handleLoginError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    
    // Manejo específico por código de estado
    switch (error.response?.status) {
      case 401:
        // Usar siempre nuestro mensaje en español
        return 'Credenciales incorrectas. Verifica tu email y contraseña.';
      case 403:
        return 'Acceso denegado. Usuario inactivo o sin permisos.';
      case 404:
        return 'Usuario no encontrado.';
      case 500:
        return 'Error del servidor. Intenta nuevamente más tarde.';
      case 503:
        return 'Servicio no disponible. Intenta más tarde.';
      default:
        // Para otros errores, intentar usar mensaje del backend
        return data?.message?.toString() || data?.error || 'Error al iniciar sesión.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ha ocurrido un error inesperado.';
};