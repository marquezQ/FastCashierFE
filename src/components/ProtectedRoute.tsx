import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getRoleById, getRoleRoute } from '../constants/roles';
import type { RoleName } from '../types/auth';

interface ProtectedRouteProps {
  allowedRoles: RoleName[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  // No autenticado → login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = getRoleById(user.roleId)?.name;

  // Rol no permitido → su dashboard
  if (!role || !allowedRoles.includes(role)) {
    const redirectTo = getRoleRoute(user.roleId);
    return <Navigate to={redirectTo} replace />;
  }

  // Todo OK → Renderizar las rutas hijas con Outlet
  return <Outlet />;
};